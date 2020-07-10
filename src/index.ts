import {Command, flags} from '@oclif/command'
import {execSync} from 'child_process'
import {existsSync} from 'fs'
import cli from 'cli-ux'
const chalk = require('chalk')
import {getObjectFromJsonFile, installPackage} from './util'

class SupportIonicAppFlowMonorepo extends Command {
  static description = 'script for support ionic appflow monorepo';

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    path: flags.string({char: 'p', description: 'path to app folder'}),
  };

  async run() {
    const {flags} = this.parse(SupportIonicAppFlowMonorepo)
    if (!flags.path) {
      throw new Error('[ERROR] Please set args `--path=YOUR_APP_DIR`')
    }

    const requirePackages = this.getRequirePackageFromDependencies(flags.path)

    this.log(`[${chalk.green('OK')}] script found ${requirePackages.length} dependencies package.`)

    installPackage(requirePackages)
    this.copyRequireFiles(flags.path)

    this.log(`[${chalk.green('OK')}] Complete set Ionic AppFlow Settings`)
  }

  getRequirePackageFromDependencies(path: string): string[] {
    const installPackage: string[] = ['@capacitor/core', '@capacitor/cli'];

    const {dependencies} = getObjectFromJsonFile(process.cwd() + `/${path}/package.json`)
    const appDependencies = Object.keys(dependencies)
    for (const packageName of appDependencies) {
      /**
       * Capacitor Pluginであるかどうかの検証
       */
      try {
        const {dependencies, peerDependencies} = getObjectFromJsonFile(process.cwd() +
          `/${path}/node_modules/${packageName}/package.json`)
        if (
          (dependencies && dependencies.hasOwnProperty('@capacitor/core')) ||
          (peerDependencies && peerDependencies.hasOwnProperty('@capacitor/core'))
        ) {
          installPackage.push(packageName)
          this.log(`[${chalk.green('OK')}] script found ${packageName}`)
          continue
        }
      } catch (error) {
        throw new Error('[WARNING] Can not find ' + packageName + '. Did you do npm install?')
      }

      /**
       * Cordovaプラグインかどうかの検証
       */
      try {
        if (existsSync(process.cwd() + `/${path}/node_modules/${packageName}/plugin.xml`)) {
          installPackage.push(packageName)
          this.log(`[${chalk.green('OK')}] script found ${packageName}`)
        }
      } catch (error) {
        /**
         * Cordovaプラグインかどうかの検証はエラーなし
         */
      }
    }

    return installPackage
  }

  copyRequireFiles(path: string): void {
    cli.action.start('> ' + chalk.green(`cd ${path} && cp -r -f capacitor.config.json ionic.config.json www ios android ` + process.cwd()))
    execSync(`cd ${path} && cp -r -f capacitor.config.json ionic.config.json www ios android ` + process.cwd())
    cli.action.stop()
  }
}

export = SupportIonicAppFlowMonorepo
