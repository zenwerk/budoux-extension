[![CI](https://github.com/google/budoux-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/google/budoux-extension/actions/workflows/ci.yml)
[![Lint](https://badgen.net/github/checks/google/budoux-extension/lint)](
[![Dependencies](https://badgen.net/github/dependabot/google/budoux-extension)](https://github.com/google/budoux-extension/network/updates)

# BudouX Browser Extension

This extension applies the phrase-based line breaking
or the Japanese [Wakachi-gaki] style line breaking
to the current page.

Please refer to the [Chrome Web Store] for instructions and screenshots.

<img src="https://raw.githubusercontent.com/google/budoux/main/example.png">

This extension uses the [BudouX] line breaking engine.
Please see the [BudouX] for more details of the engine.

[BudouX]: https://github.com/google/budoux
[Chrome Web Store]: https://chrome.google.com/webstore/detail/budoux/dnonkmkecnbciehcnmhngnihgmenfmph
[Wakachi-gaki]: https://ja.wikipedia.org/wiki/%E3%82%8F%E3%81%8B%E3%81%A1%E6%9B%B8%E3%81%8D

# Install

## Chrome
This extension is available to install at the [Chrome Web Store].

## Firefox
This extension is now compatible with Firefox. To build and install it for Firefox:

```sh
npm run zip:firefox
```

Then install it in Firefox:
1. Open Firefox
2. Navigate to `about:addons`
3. Click the gear icon and select "Install Add-on From File..."
4. Select the `budoux-firefox.zip` file from the project directory

## Local Development
To install local builds, please refer to the [Unpacked extension tests] section below.

# Development

## Build
[build]: #build

Install dependencies by:

```sh
npm install
```
Then you can build an unpacked directory by:
```sh
npm run build
```
Or you can build a ZIP file by:
```sh
npm run zip
```

## Testing

### Unit tests

```sh
npm test
```

### Browser tests

```sh
npm run dev
```
Then open [`test.html`] in the browser.

[`test.html`]: tests/test.html

### Unpacked extension tests
[Unpacked extension tests]: #unpacked-extension-tests

#### Chrome
[Build] the unpacked directory:
```sh
npm run build
```
Then install the extension using the following steps:
1. Start Chrome.
2. Open the Extension Management page by navigating to `chrome://extensions`.
3. Enable Developer Mode by clicking the toggle switch next to **Developer mode**.
4. Click the **Load unpacked** button and select the `dist` directory.

#### Firefox
Build the Firefox version:
```sh
npm run dist:firefox
```
Then install the extension using the following steps:
1. Open Firefox.
2. Navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on**.
4. Select any file from the `dist-firefox` directory.

# Disclaimer

This is not an officially supported Google product.
