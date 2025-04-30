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

const assert = console.assert;
// Use browser API if available, fallback to chrome
const browser = typeof window.browser !== 'undefined' ? window.browser : chrome;

async function applyBudouX(tab?: chrome.tabs.Tab, frameId?: number) {
  const tabId = tab?.id;
  assert(tabId !== undefined, tab);
  if (tabId === undefined) return;

  try {
    // Try Firefox's browser.scripting API first
    if (typeof browser.scripting !== 'undefined') {
      const target: chrome.scripting.InjectionTarget = {tabId: tabId};
      if (frameId !== undefined) target.frameIds = [frameId];
      await browser.scripting.executeScript({
        target: target,
        files: ['content.js'],
      });
    } else {
      // Fallback for older Firefox versions
      await browser.tabs.executeScript(tabId, {
        file: 'content.js',
        frameId: frameId || 0,
      });
    }

    await browser.action.setBadgeText({
      text: 'ON',
      tabId: tabId,
    });
    await browser.action.setBadgeBackgroundColor({
      color: '#00c853',
      tabId: tabId,
    });
  } catch (error) {
    console.error('Error applying BudouX:', error);
  }
}

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'BudouX',
    title: browser.i18n.getMessage('applyMenuTitle'),
    contexts: ['all'],
  });
});

browser.contextMenus.onClicked.addListener(async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  await applyBudouX(tab, info.frameId);
});
browser.action.onClicked.addListener(applyBudouX);
