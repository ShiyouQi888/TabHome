// 扩展背景脚本

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
  console.log('TabHome扩展已安装:', details);
  
  // 设置默认存储值
  chrome.storage.local.set({
    isLoggedIn: false,
    authToken: null,
    lastSyncTime: null
  });
  
  // 如果是首次安装，显示欢迎页面
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: 'https://tabhome.netlify.app/dashboard'
    });
  }
  
  // 创建同步闹钟，每小时触发一次
  chrome.alarms.create('syncBookmarks', {
    periodInMinutes: 60,
    delayInMinutes: 0
  });
});

// 监听消息事件
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message);
  
  switch (message.type) {
    case 'CHECK_LOGIN_STATUS':
      // 检查登录状态
      chrome.storage.local.get(['isLoggedIn', 'authToken'], (result) => {
        sendResponse({
          isLoggedIn: result.isLoggedIn || false,
          authToken: result.authToken || null
        });
      });
      return true;
      
    case 'UPDATE_LOGIN_STATUS':
      // 更新登录状态
      chrome.storage.local.set({
        isLoggedIn: message.isLoggedIn,
        authToken: message.authToken || null
      });
      sendResponse({ success: true });
      return true;
      
    case 'LOGOUT':
      // 登出
      chrome.storage.local.set({
        isLoggedIn: false,
        authToken: null
      });
      sendResponse({ success: true });
      return true;
      
    default:
      sendResponse({ success: false, message: '未知消息类型' });
      return true;
  }
});

// 监听书签变更事件（可选，用于同步浏览器书签和TabHome书签）
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  console.log('书签已创建:', id, bookmark);
  // 这里可以实现与TabHome服务器的同步逻辑
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.log('书签已删除:', id, removeInfo);
  // 这里可以实现与TabHome服务器的同步逻辑
});

chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  console.log('书签已更改:', id, changeInfo);
  // 这里可以实现与TabHome服务器的同步逻辑
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 当标签页加载完成时
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    console.log('标签页加载完成:', tab.url);
    // 这里可以实现自动添加书签的逻辑
  }
});

// 定期同步书签（可选）
function syncBookmarks() {
  console.log('开始同步书签...');
  // 这里可以实现定期与服务器同步书签的逻辑
}

// 监听闹钟事件
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncBookmarks') {
    syncBookmarks();
  }
});
