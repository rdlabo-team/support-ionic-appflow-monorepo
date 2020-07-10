@rdlabo/support-ionic-appflow-monorepo
======================================

This script for support monorepo structure at Ionic AppFlow 

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@rdlabo/support-ionic-appflow-monorepo.svg)](https://npmjs.org/package/@rdlabo/support-ionic-appflow-monorepo)
[![Downloads/week](https://img.shields.io/npm/dw/@rdlabo/support-ionic-appflow-monorepo.svg)](https://npmjs.org/package/@rdlabo/support-ionic-appflow-monorepo)
[![License](https://img.shields.io/npm/l/@rdlabo/support-ionic-appflow-monorepo.svg)](https://github.com/rdlabo-team/support-ionic-appflow-monorepo/blob/master/package.json)


Ionic AppFlow don't support monorepo structure now.
So if your repository is this, you can use this script.

```
project
 ├── package.json
 ├── api_dir/  -- framework like NestJS
 └── app_dir/  -- capacitor apps
```

This script work three step.

1. Check require package from Ionic CLI and app_dir's package.json
2.   and install project directory.
3. Copy file using Ionic AppFlow from app_dir.

# Usage
You can use free app directory name. In usage, app directory name display {APP_DIR}. Please replace at your environment.

## 1. Copy file
Copy two file from {APP_DIR} to project directory.
- `{APP_DIR}/ionic.config.json`     => `./ionic.config.json`
- `{APP_DIR}/capacitor.config.json` => `./capacitor.config.json`

You can use this command:
```sh-session
% cp -r -f {APP_DIR}/ionic.config.json {APP_DIR}/capacitor.config.json ./
```

## 2. Install this script at project directory

```sh-session
% npm install @rdlabo/support-ionic-appflow-monorepo --save-dev
```

## 3. Set npm script

```
  "scripts": {
    ...
    "build": "npm ci && npx lerna bootstrap && npm run build:ionic",
    "postbuild": "support-ionic-appflow-monorepo --path={APP_DIR}"
  },
```
