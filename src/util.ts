import {execSync} from "child_process";
import {readFileSync} from "fs";
import cli from 'cli-ux';
const chalk = require('chalk');

export const getObjectFromJsonFile = (path: string) => {
  try {
    const file = readFileSync(path);
    return JSON.parse(file.toString('utf8'));
  } catch (e) {
    console.log(e);
    throw Error(`[ERROR] script can not find ${path}`);
  }
};

export const installPackage = (packages: string[]): void => {
  if (packages.length > 0) {
    const packageString = packages.join(' ');
    cli.action.start('> ' + chalk.green(`npm install ${packageString}`));
    execSync(`npm install ${packageString}`);
    cli.action.stop();
  }
};
