import { Command, flags } from '@oclif/command'
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import cli from 'cli-ux'
const chalk = require('chalk');
import { getObjectFromJsonFile, installPackage } from './util';

class SupportIonicAppFlowMonorepo extends Command {
  static description = 'script for support ionic appflow monorepo';
  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    path: flags.string({char: 'p', description: 'path to app folder'}),
  };

  async run() {
    const { flags } = this.parse(SupportIonicAppFlowMonorepo);
    if (!flags.path) {
      throw Error('[ERROR] Please set args `--path=YOUR_APP_DIR`');
    }

    const requirePackages = this.getRequirePackageFromInfo();
    Array.prototype.push.apply(requirePackages, this.getRequirePackageFromDependencies(flags.path));

    this.log(`[${chalk.green('OK')}] script found ${requirePackages.length} dependencies package.`);

    installPackage(requirePackages);
    this.copyRequireFiles(flags.path);

    this.log(`[${chalk.green('OK')}] Complete set Ionic AppFlow Settings`);
  }

  getRequirePackageFromInfo(): string[] {
    const installPackage: string[] = [];

    const { type } = getObjectFromJsonFile(process.cwd() + '/ionic.config.json');
    const replacePackage = {
      'Capacitor CLI': '@capacitor/cli',
      'Ionic Framework': '@ionic/' + type,
    };

    let ionicInfo: Array<{
      name: string;
      value: string;
    }>;

    try {
      const stdout = execSync('ionic info --json');
      const ionicInfoScheme = stdout.toString('utf-8');
      ionicInfo = JSON.parse(ionicInfoScheme);
    } catch (e) {
      throw Error('[ERROR] Ionic CLI is not installed at global');
    }

    for (const info of ionicInfo) {
      if (info.name && info.value === 'not installed' && info.name !== 'native-run') {
        if (replacePackage.hasOwnProperty(info.name)) {
          // @ts-ignore
          info.name = replacePackage[info.name];
          installPackage.push(info.name);
          this.log(`[${chalk.green('OK')}] script found ${info.name}`);
        }
      }
    }

    return installPackage;
  };

  getRequirePackageFromDependencies(path: string): string[] {
    const installPackage: string[] = [];

    const { dependencies } = getObjectFromJsonFile(process.cwd() + `/${path}/package.json`);
    const appDependencies = Object.keys(dependencies);
    for (const packageName of appDependencies) {
      /**
       * Capacitor Pluginであるかどうかの検証
       */
      try {
        const { dependencies, peerDependencies } = getObjectFromJsonFile(process.cwd() +
          `/${path}/node_modules/${packageName}/package.json`);
        if (
          (dependencies && dependencies.hasOwnProperty('@capacitor/core')) ||
          (peerDependencies && peerDependencies.hasOwnProperty('@capacitor/core'))
        ) {
          installPackage.push(packageName);
          this.log(`[${chalk.green('OK')}] script found ${packageName}`);
          continue;
        }
      } catch (e) {
        throw Error('[WARNING] Can not find ' + packageName + '. Did you do npm install?');
      }

      /**
       * Cordovaプラグインかどうかの検証
       */
      try {
        if (existsSync(process.cwd() + `/${path}/node_modules/${packageName}/plugin.xml`)) {
          installPackage.push(packageName);
          this.log(`[${chalk.green('OK')}] script found ${packageName}`);
        }
      } catch (e) {
        /**
         * Cordovaプラグインかどうかの検証はエラーなし
         */
      }
    }

    return installPackage;
  };

  copyRequireFiles(path: string): void {
    cli.action.start('> ' + chalk.green(`cd ${path} && cp -r -f capacitor.config.json ionic.config.json www ios android ` + process.cwd()));
    execSync(`cd ${path} && cp -r -f capacitor.config.json ionic.config.json www ios android ` + process.cwd());
    cli.action.stop();
  };
}

export = SupportIonicAppFlowMonorepo
