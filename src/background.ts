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
const browserAPI = self.browser ?? chrome;

async function applyBudouX(tab?: chrome.tabs.Tab, frameId?: number) {
  const tabId = tab?.id;
  assert(tabId !== undefined, tab);
  if (tabId === undefined) return;

  try {
    // Try browser.scripting API (works for both Chrome and Firefox with MV3)
    if (typeof browserAPI.scripting !== 'undefined' && browserAPI.scripting.executeScript) {
      const target: chrome.scripting.InjectionTarget = {
        tabId: tabId,
        frameIds: frameId !== undefined ? [frameId] : undefined,
      };
      await browserAPI.scripting.executeScript({
        target: target,
        files: ['content.js'],
      });
    } else if (typeof browserAPI.tabs !== 'undefined' && browserAPI.tabs.executeScript) {
      // Fallback for older Firefox versions with MV2 API
      await browserAPI.tabs.executeScript(tabId, {
        file: 'content.js',
        frameId: frameId || 0,
      });
    } else {
      throw new Error('No compatible script injection API available');
    }

    // Use action API (MV3) with fallback to browserAction (MV2)
    const actionAPI = browserAPI.action || browserAPI.browserAction;
    if (actionAPI) {
      await actionAPI.setBadgeText({
        text: 'ON',
        tabId: tabId,
      });
      await actionAPI.setBadgeBackgroundColor({
        color: '#00c853',
        tabId: tabId,
      });
    }
  } catch (error) {
    console.error('Error applying BudouX:', error);
  }
}

// Initialize context menu for right-click on web pages
browserAPI.runtime.onInstalled.addListener(() => {
  browserAPI.contextMenus.create({
    id: 'BudouX',
    title: browserAPI.i18n.getMessage('applyMenuTitle'),
    contexts: ['all'],
  });
});

// Handle context menu clicks
browserAPI.contextMenus.onClicked.addListener(async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  await applyBudouX(tab, info.frameId);
});

// For left-click on toolbar icon, directly apply BudouX
const actionAPI = browserAPI.action || browserAPI.browserAction;
if (actionAPI && actionAPI.onClicked) {
  actionAPI.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
    await applyBudouX(tab);
  });
}
