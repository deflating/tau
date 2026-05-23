# Claude Instructions

## npm package name

The repo is called **tau**, the npm package name (in `package.json`) is **tau-mirror**. The production install command is:
```
npm install -g git+https://github.com/deflating/tau.git#main
```

## Where Pi loads tau from

Pi does **not** load tau from the global npm. It loads from `%USERPROFILE%\.pi\agent\npm\node_modules\tau-mirror\` — a separate npm project at `%USERPROFILE%\.pi\agent\npm\` that lists tau-mirror as a dependency and shadows the global install.

## Setting up live local dev

When asked to make and test changes locally, run these commands automatically:

```powershell
# 1. Remove the shadowing copy from pi-agent
cd "$env:USERPROFILE\.pi\agent\npm"
npm uninstall tau-mirror

# 2. Link global npm to this repo
cd "<repo root>"
npm link
```

After each change to `extensions/mirror-server.ts`, clear the jiti cache and tell the user to restart Pi:
```powershell
Remove-Item "$env:LOCALAPPDATA\Temp\jiti" -Recurse -Force -ErrorAction SilentlyContinue
```

Changes to files in `public/` take effect on browser reload — no Pi restart needed.

## Restoring production install

When dev/testing is done, restore with:
```powershell
npm install -g git+https://github.com/deflating/tau.git#main
```
