/**
 * @license
 * Copyright 2021 Google LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const zwsp = document.getElementById('zwsp') as HTMLInputElement;
const idsp = document.getElementById('idsp') as HTMLInputElement;
const space = document.getElementById('space') as HTMLInputElement;
const presets = [zwsp, idsp, space];
const other = document.getElementById('other') as HTMLInputElement;
const separatorText = document.getElementById(
  'separatorText'
) as HTMLInputElement;
const saveButton = document.getElementById('save') as HTMLButtonElement;

function checkOtherIfNeeded() {
  if (separatorText.value) other.checked = true;
}

function getSeparator() {
  for (const preset of presets) {
    if (preset.checked) return preset.value;
  }
  return separatorText.value;
}

function setSeparator(separator: string) {
  for (const preset of presets) {
    if (separator === preset.value) {
      preset.checked = true;
      return;
    }
  }
  other.checked = true;
  separatorText.value = separator;
}

function saveOptions() {
  chrome.storage.sync.set({
    separator: getSeparator(),
  });
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      separator: '\u200B',
    },
    items => {
      if (typeof items.separator === 'string') {
        setSeparator(items.separator);
      }
    }
  );
}

function localize() {
  for (const element of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    element.textContent = chrome.i18n.getMessage(element.dataset.i18n!);
  }
  for (const element of document.querySelectorAll<HTMLElement>(
    '[data-i18n-aria-label]'
  )) {
    element.setAttribute(
      'aria-label',
      chrome.i18n.getMessage(element.dataset.i18nAriaLabel!)
    );
  }
}

localize();
document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);
separatorText.addEventListener('input', checkOtherIfNeeded);
