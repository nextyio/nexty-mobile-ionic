# Nexty Wallet

Ionic project for create nexty wallet application in ios and android

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Nodejs, Ionic and cordova

```
npm install -g cordova ionic
```

### Installing

Run ionic serve

```
npm run ionic:serve
```

Web view:
> http://localhost:8100/

## Deployment

> Read ionic docs

#### Ionic setup

```
ionic login ct@teddyvn.com
ionic link --pro-id 19777f0b
```

## Note

- When add new asset, component,... Ionic should be restarted to recognize new files
- CORS issue on Chrome: Start chrome using: "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --args --disable-web-security --user-data-dir
- run "npm update" get web3 invalid (beta2 instead of beta30), reinstall web3 manually to resolve.
- Back issue of barcode scanner on android: https://github.com/ionic-team/ng-cordova/issues/138 (use 2nd)
# nexty-mobile-ionic
