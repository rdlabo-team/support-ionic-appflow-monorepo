@rdlabo/support-ionic-appflow-monorepo
======================================

This script for support monorepo structure at Ionic AppFlow 

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@rdlabo/support-ionic-appflow-monorepo.svg)](https://npmjs.org/package/@rdlabo/support-ionic-appflow-monorepo)
[![Downloads/week](https://img.shields.io/npm/dw/@rdlabo/support-ionic-appflow-monorepo.svg)](https://npmjs.org/package/@rdlabo/support-ionic-appflow-monorepo)
[![License](https://img.shields.io/npm/l/@rdlabo/support-ionic-appflow-monorepo.svg)](https://github.com/rdlabo-team/support-ionic-appflow-monorepo/blob/master/package.json)


Ionic AppFlow don't support monorepo structure now.
So this script will solve your problem, if your repository looks like this:

```
project
 ├── package.json
 ├── api/  -- framework like NestJS
 └── {APP_DIR}/  -- capacitor apps
```

This script work three step.

1. Check require packages from Ionic CLI and {APP_DIR} package.json
2. Install require packages to project directory.
3. Copy file for using Ionic AppFlow from {APP_DIR}.

# Usage
You can freely name the app directory. In this usage, app directory name display {APP_DIR}. Please replace name at your environment.

## 1. Copy file
Copy two file from {APP_DIR} to project directory. Ionic AppFlow checked these file before npm build. So you should copy manually.

- `{APP_DIR}/ionic.config.json`     => `./ionic.config.json`
- `{APP_DIR}/capacitor.config.json` => `./capacitor.config.json`

You can use this command:
```sh-session
% cp -r -f {APP_DIR}/ionic.config.json {APP_DIR}/capacitor.config.json ./
```

## 2. Set npm script

```diff
  "scripts": {
    ...
+   "postbuild": "npx @rdlabo/support-ionic-appflow-monorepo --path={APP_DIR}"
  },
```
