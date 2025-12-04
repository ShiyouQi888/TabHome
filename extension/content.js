// 扩展内容脚本

// 监听来自扩展的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content脚本收到消息:', message);
  
  switch (message.type) {
    case 'GET_PAGE_INFO':
      // 获取当前页面信息
      const pageInfo = {
        url: window.location.href,
        title: document.title,
        favicon: document.querySelector('link[rel="icon"]')?.href || 
                document.querySelector('link[rel="shortcut icon"]')?.href || 
                `https://www.google.com/s2/favicons?domain=${window.location.hostname}&sz=64`
      };
      sendResponse(pageInfo);
      return true;
      
    case 'ADD_BOOKMARK_BUTTON':
      // 添加书签按钮到页面（可选功能）
      addBookmarkButton();
      sendResponse({ success: true });
      return true;
      
    default:
      sendResponse({ success: false, message: '未知消息类型' });
      return true;
  }
});

// 添加书签按钮到页面的函数（可选功能）
function addBookmarkButton() {
  // 检查按钮是否已存在
  if (document.getElementById('tabhome-bookmark-btn')) {
    return;
  }
  
  // 创建书签按钮
  const bookmarkBtn = document.createElement('button');
  bookmarkBtn.id = 'tabhome-bookmark-btn';
  bookmarkBtn.textContent = '添加到TabHome';
  bookmarkBtn.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    padding: 8px 16px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  `;
  
  // 添加悬停效果
  bookmarkBtn.addEventListener('mouseenter', () => {
    bookmarkBtn.style.opacity = '0.9';
    bookmarkBtn.style.transform = 'translateY(-1px)';
    bookmarkBtn.style.boxShadow = '0 8px 12px -2px rgba(0, 0, 0, 0.15)';
  });
  
  bookmarkBtn.addEventListener('mouseleave', () => {
    bookmarkBtn.style.opacity = '1';
    bookmarkBtn.style.transform = 'translateY(0)';
    bookmarkBtn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  });
  
  // 添加点击事件
  bookmarkBtn.addEventListener('click', () => {
    // 向扩展发送消息，打开添加书签对话框
    chrome.runtime.sendMessage({
      type: 'OPEN_ADD_BOOKMARK_DIALOG',
      pageInfo: {
        url: window.location.href,
        title: document.title,
        favicon: document.querySelector('link[rel="icon"]')?.href || 
                document.querySelector('link[rel="shortcut icon"]')?.href || 
                `https://www.google.com/s2/favicons?domain=${window.location.hostname}&sz=64`
      }
    });
  });
  
  // 将按钮添加到页面
  document.body.appendChild(bookmarkBtn);
}

// 页面加载完成后执行
window.addEventListener('load', () => {
  console.log('Content脚本已加载');
  
  // 可以在这里添加初始化逻辑
  // 例如：检查页面类型，根据需要添加功能
});
