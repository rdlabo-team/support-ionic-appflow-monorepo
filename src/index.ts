#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const { type } = require(process.cwd() + '/ionic.config.json');

const replacePackage = {
  'Capacitor CLI': '@capacitor/cli',
  'Ionic Framework': '@ionic/' + type,
};

let ionicInfo: Array<{
  group: string;
  name: string;
  key: string;
  value: string;
}>;

const checkRequireAppPackage = (path: string): string[] => {
  try {
    const stdout = execSync('ionic info --json');
    const ionicInfoScheme = stdout.toString('utf-8');
    ionicInfo = JSON.parse(ionicInfoScheme);
  } catch (e) {
    console.error('[ERROR] Ionic CLI is not installed at global');
    return;
  }

  const installPackage: string[] = [];
  for (const info of ionicInfo) {
    if (info.value === 'not installed' && info.name !== 'native-run') {
      if (replacePackage.hasOwnProperty(info.name)) {
        // @ts-ignore
        info.name = replacePackage[info.name];
      }
      installPackage.push(info.name);
    }
  }

  const { dependencies } = require(process.cwd() + `/${path}/package.json`);
  const appDependencies = Object.keys(dependencies);
  for (const packageName of appDependencies) {
    /**
     * Capacitor Pluginであるかどうかの検証
     */
    try {
      const { dependencies, peerDependencies } = require(process.cwd() +
        `/${path}/node_modules/${packageName}/package.json`);
      if (
        (dependencies && dependencies.hasOwnProperty('@capacitor/core')) ||
        (peerDependencies && peerDependencies.hasOwnProperty('@capacitor/core'))
      ) {
        installPackage.push(packageName);
        continue;
      }
    } catch (e) {
      console.warn('[WARNING] Can not find ' + packageName + '. Did you do npm install?');
    }

    /**
     * Cordovaプラグインかどうかの検証
     */
    try {
      if (existsSync(process.cwd() + `/${path}/node_modules/${packageName}/plugin.xml`)) {
        installPackage.push(packageName);
        continue;
      }
    } catch (e) {
      /**
       * Cordovaプラグインかどうかの検証はエラーなし
       */
    }
  }

  return installPackage;
};

const installPackage = (packages: string[]) => {
  if (packages.length > 0) {
    const packageString = packages.join(' ');
    execSync(`npm install ${packageString}`);
  }
};

const copyRequireFiles = (path: string) => {
  execSync(`cd ${path} && cp -r -f capacitor.config.json ionic.config.json www ios android ` + process.cwd());
};

const yargv = require('yargs').argv;
if (!yargv.path) {
  console.error('[ERROR] Please set args `--path=YOUR_APP_DIR`');
  // @ts-ignore
  return;
}

const requirePackages = checkRequireAppPackage(yargv.path);
if (!requirePackages) {
  // @ts-ignore
  return;
}

installPackage(requirePackages);
copyRequireFiles(yargv.path);
