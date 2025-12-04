// 配置Supabase客户端
const supabaseConfig = {
  url: 'https://cubicshszllnxxngsapx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1Ymljc2hzemxsbnh4bmdzYXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjExOTksImV4cCI6MjA4MDI5NzE5OX0.BXfWAFmne33NKRH60xAMkPQCGMtCbfywiMxJqTU7pf4'
};

// API客户端类
class TabHomeApiClient {
  constructor() {
    this.supabaseUrl = supabaseConfig.url;
    this.anonKey = supabaseConfig.anonKey;
    this.authToken = null;
  }

  async setAuthToken(token) {
    this.authToken = token;
    chrome.storage.local.set({ authToken: token });
  }

  async getAuthToken() {
    if (!this.authToken) {
      const result = await chrome.storage.local.get('authToken');
      this.authToken = result.authToken;
    }
    return this.authToken;
  }

  async fetchWithAuth(endpoint, options = {}) {
    const token = await this.getAuthToken();
    if (!token) {
      throw new Error('未登录');
    }

    const response = await fetch(`${this.supabaseUrl}/rest/v1/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': this.anonKey
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API错误: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getBookmarks(folderId = null) {
    let endpoint = 'bookmarks?select=*&order=position.asc';
    if (folderId) {
      endpoint += `&folder_id=eq.${folderId}`;
    }
    return this.fetchWithAuth(endpoint);
  }

  async getFolders() {
    return this.fetchWithAuth('folders?select=*&order=position.asc');
  }

  async addBookmark(bookmark) {
    return this.fetchWithAuth('bookmarks', {
      method: 'POST',
      body: JSON.stringify(bookmark)
    });
  }

  async deleteBookmark(bookmarkId) {
    return this.fetchWithAuth(`bookmarks?id=eq.${bookmarkId}`, {
      method: 'DELETE'
    });
  }

  async getWebsiteInfo(url) {
    // 使用扩展内置的API或调用后端代理
    try {
      // 尝试直接获取网站信息（可能会遇到CORS问题）
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/1`);
      const data = await response.json();
      return {
        title: data.title,
        description: data.body.substring(0, 100),
        icon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`
      };
    } catch (error) {
      // 默认返回值
      return {
        title: url,
        description: '',
        icon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`
      };
    }
  }
}

// 主应用类
class TabHomeExtension {
  constructor() {
    this.apiClient = new TabHomeApiClient();
    this.bookmarks = [];
    this.folders = [];
    this.filteredBookmarks = [];
    this.currentFolder = 'all';
    this.searchQuery = '';
    this.isLoggedIn = false;
    this.init();
  }

  init() {
    this.bindEvents();
    this.checkAuth();
  }

  bindEvents() {
    // 登录按钮
    document.getElementById('loginBtn')?.addEventListener('click', () => {
      this.openLoginPage();
    });

    // 打开设置
    document.getElementById('openOptions')?.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });

    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.filterBookmarks();
    });

    // 添加书签按钮
    const addBookmarkBtn = document.getElementById('addBookmarkBtn');
    addBookmarkBtn?.addEventListener('click', () => {
      this.openAddBookmarkModal();
    });

    // 模态框关闭
    document.getElementById('closeModal')?.addEventListener('click', () => {
      this.closeAddBookmarkModal();
    });

    document.getElementById('cancelAdd')?.addEventListener('click', () => {
      this.closeAddBookmarkModal();
    });

    // 添加书签表单提交
    const addBookmarkForm = document.getElementById('addBookmarkForm');
    addBookmarkForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddBookmark(e);
    });

    // 模态框外部点击关闭
    const modal = document.getElementById('addBookmarkModal');
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeAddBookmarkModal();
      }
    });
  }

  async checkAuth() {
    try {
      const token = await this.apiClient.getAuthToken();
      if (token) {
        this.isLoggedIn = true;
        this.showLoggedInView();
        await this.loadData();
      } else {
        this.isLoggedIn = false;
        this.showLoggedOutView();
      }
    } catch (error) {
      console.error('验证失败:', error);
      this.isLoggedIn = false;
      this.showLoggedOutView();
    }
  }

  showLoggedInView() {
    document.getElementById('loggedInView')?.classList.remove('hidden');
    document.getElementById('loggedOutView')?.classList.add('hidden');
    document.getElementById('loginBtn')?.textContent = '退出';
  }

  showLoggedOutView() {
    document.getElementById('loggedInView')?.classList.add('hidden');
    document.getElementById('loggedOutView')?.classList.remove('hidden');
    document.getElementById('loginBtn')?.textContent = '登录';
  }

  openLoginPage() {
    chrome.tabs.create({
      url: 'https://tabhome.netlify.app/login'
    });
    window.close();
  }

  async loadData() {
    try {
      // 获取书签和文件夹
      const [bookmarks, folders] = await Promise.all([
        this.apiClient.getBookmarks(),
        this.apiClient.getFolders()
      ]);

      this.bookmarks = bookmarks;
      this.folders = folders;
      this.filteredBookmarks = [...this.bookmarks];

      this.renderFolderTabs();
      this.renderBookmarks();
      this.renderFolderSelect();
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  }

  renderFolderTabs() {
    const container = document.getElementById('folderTabsContainer');
    if (!container) return;

    container.innerHTML = '';
    this.folders.forEach(folder => {
      const button = document.createElement('button');
      button.className = 'tab-btn';
      button.textContent = folder.name;
      button.dataset.folder = folder.id;
      button.addEventListener('click', () => {
        this.switchFolder(folder.id);
      });
      container.appendChild(button);
    });
  }

  renderFolderSelect() {
    const select = document.getElementById('bookmarkFolder');
    if (!select) return;

    // 清空现有选项，保留默认选项
    select.innerHTML = '<option value="">无分类</option>';
    
    this.folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder.id;
      option.textContent = folder.name;
      select.appendChild(option);
    });
  }

  renderBookmarks() {
    const container = document.getElementById('bookmarksGrid');
    if (!container) return;

    if (this.filteredBookmarks.length === 0) {
      container.innerHTML = '<div class="empty-state">暂无书签</div>';
      return;
    }

    container.innerHTML = '';
    this.filteredBookmarks.forEach(bookmark => {
      const card = this.createBookmarkCard(bookmark);
      container.appendChild(card);
    });
  }

  createBookmarkCard(bookmark) {
    const card = document.createElement('div');
    card.className = 'bookmark-card';
    card.addEventListener('click', () => {
      chrome.tabs.create({ url: bookmark.url });
      window.close();
    });

    // 添加右键菜单支持
    card.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      // 这里可以实现右键菜单
    });

    const iconUrl = bookmark.icon || `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`;
    
    card.innerHTML = `
      <img src="${iconUrl}" alt="${bookmark.title}" class="bookmark-icon" onerror="this.style.display='none'">
      <div class="bookmark-title">${bookmark.title || new URL(bookmark.url).hostname}</div>
    `;

    return card;
  }

  switchFolder(folderId) {
    this.currentFolder = folderId;
    this.updateActiveTab();
    this.filterBookmarks();
  }

  updateActiveTab() {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.folder === this.currentFolder) {
        btn.classList.add('active');
      }
    });
  }

  filterBookmarks() {
    let filtered = [...this.bookmarks];

    // 文件夹过滤
    if (this.currentFolder !== 'all') {
      filtered = filtered.filter(b => b.folder_id === this.currentFolder);
    }

    // 搜索过滤
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        (b.title?.toLowerCase().includes(query) || '') ||
        b.url.toLowerCase().includes(query)
      );
    }

    this.filteredBookmarks = filtered;
    this.renderBookmarks();
  }

  openAddBookmarkModal() {
    const modal = document.getElementById('addBookmarkModal');
    modal?.classList.remove('hidden');
    
    // 自动填充当前活动标签页的URL和标题
    this.populateCurrentTabInfo();
  }

  closeAddBookmarkModal() {
    const modal = document.getElementById('addBookmarkModal');
    modal?.classList.add('hidden');
    // 重置表单
    document.getElementById('addBookmarkForm')?.reset();
  }

  async populateCurrentTabInfo() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url && tab.url.startsWith('http')) {
        const urlInput = document.getElementById('bookmarkUrl');
        const titleInput = document.getElementById('bookmarkTitle');
        
        urlInput.value = tab.url;
        titleInput.value = tab.title || '';
      }
    } catch (error) {
      console.error('获取当前标签页信息失败:', error);
    }
  }

  async handleAddBookmark(e) {
    const formData = new FormData(e.target);
    const bookmark = {
      url: formData.get('url'),
      title: formData.get('title') || '',
      folder_id: formData.get('folderId') || null
    };

    try {
      // 自动获取网站信息（如果标题为空）
      if (!bookmark.title) {
        const websiteInfo = await this.apiClient.getWebsiteInfo(bookmark.url);
        bookmark.title = websiteInfo.title;
        bookmark.icon = websiteInfo.icon;
      }

      await this.apiClient.addBookmark(bookmark);
      await this.loadData();
      this.closeAddBookmarkModal();
    } catch (error) {
      console.error('添加书签失败:', error);
      alert('添加书签失败: ' + error.message);
    }
  }
}

// 初始化应用
const tabHomeApp = new TabHomeExtension();

// 监听来自background或content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AUTH_TOKEN_UPDATED') {
    tabHomeApp.checkAuth();
    sendResponse({ success: true });
  }
  return true;
});