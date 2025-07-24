// HYDRERGY 页面索引和语言切换管理系统
// 实现自动语言切换和页面索引功能

// 页面索引配置
const PAGE_INDEX = {
    // 主页面
    'index.html': {
        zh: 'index.html',
        en: 'index-en.html',
        title: { zh: '首页', en: 'Home' },
        path: '/'
    },
    'index-en.html': {
        zh: 'index.html',
        en: 'index-en.html',
        title: { zh: '首页', en: 'Home' },
        path: '/'
    },
    
    // 业务页面
    'pages/business/hydrogen.html': {
        zh: 'pages/business/hydrogen.html',
        en: 'pages/business/hydrogen-en.html',
        title: { zh: '电解制氢技术与产品', en: 'Hydrogen Electrolysis Technology & Products' },
        path: '/pages/business/'
    },
    'pages/business/hydrogen-en.html': {
        zh: 'pages/business/hydrogen.html',
        en: 'pages/business/hydrogen-en.html',
        title: { zh: '电解制氢技术与产品', en: 'Hydrogen Electrolysis Technology & Products' },
        path: '/pages/business/'
    },
    
    'pages/business/co2.html': {
        zh: 'pages/business/co2.html',
        en: 'pages/business/co2-en.html',
        title: { zh: '电解二氧化碳技术与产品', en: 'CO₂ Electrolysis Technology & Products' },
        path: '/pages/business/'
    },
    'pages/business/co2-en.html': {
        zh: 'pages/business/co2.html',
        en: 'pages/business/co2-en.html',
        title: { zh: '电解二氧化碳技术与产品', en: 'CO₂ Electrolysis Technology & Products' },
        path: '/pages/business/'
    },
    
    'pages/business/consulting.html': {
        zh: 'pages/business/consulting.html',
        en: 'pages/business/consulting-en.html',
        title: { zh: '技术咨询服务与数据库', en: 'Technical Consulting Services & Database' },
        path: '/pages/business/'
    },
    'pages/business/consulting-en.html': {
        zh: 'pages/business/consulting.html',
        en: 'pages/business/consulting-en.html',
        title: { zh: '技术咨询服务与数据库', en: 'Technical Consulting Services & Database' },
        path: '/pages/business/'
    },
    
    // 产品页面 - 阴离子交换膜
    'pages/business/anion-membrane.html': {
        zh: 'pages/business/anion-membrane.html',
        en: 'pages/business/anion-membrane-en.html',
        title: { zh: '阴离子交换膜', en: 'Anion Exchange Membrane' },
        path: '/pages/business/'
    },
    'pages/business/anion-membrane-en.html': {
        zh: 'pages/business/anion-membrane.html',
        en: 'pages/business/anion-membrane-en.html',
        title: { zh: '阴离子交换膜', en: 'Anion Exchange Membrane' },
        path: '/pages/business/'
    },
    
    // 产品页面 - ZSM复合膜
    'pages/business/zsm-membrane.html': {
        zh: 'pages/business/zsm-membrane.html',
        en: 'pages/business/zsm-membrane-en.html',
        title: { zh: 'ZSM复合膜', en: 'ZSM Composite Membrane' },
        path: '/pages/business/'
    },
    'pages/business/zsm-membrane-en.html': {
        zh: 'pages/business/zsm-membrane.html',
        en: 'pages/business/zsm-membrane-en.html',
        title: { zh: 'ZSM复合膜', en: 'ZSM Composite Membrane' },
        path: '/pages/business/'
    },
    
    // 产品页面 - 桌面式电解水测试系统
    'pages/business/desktop-water-electrolysis.html': {
        zh: 'pages/business/desktop-water-electrolysis.html',
        en: 'pages/business/desktop-water-electrolysis-en.html',
        title: { zh: '桌面式电解水测试系统', en: 'Desktop Water Electrolysis Test System' },
        path: '/pages/business/'
    },
    'pages/business/desktop-water-electrolysis-en.html': {
        zh: 'pages/business/desktop-water-electrolysis.html',
        en: 'pages/business/desktop-water-electrolysis-en.html',
        title: { zh: '桌面式电解水测试系统', en: 'Desktop Water Electrolysis Test System' },
        path: '/pages/business/'
    },
    
    // 产品页面 - 台架式电解水测试系统
    'pages/business/bench-water-electrolysis.html': {
        zh: 'pages/business/bench-water-electrolysis.html',
        en: 'pages/business/bench-water-electrolysis-en.html',
        title: { zh: '台架式电解水测试系统', en: 'Bench-type Water Electrolysis Test System' },
        path: '/pages/business/'
    },
    'pages/business/bench-water-electrolysis-en.html': {
        zh: 'pages/business/bench-water-electrolysis.html',
        en: 'pages/business/bench-water-electrolysis-en.html',
        title: { zh: '台架式电解水测试系统', en: 'Bench-type Water Electrolysis Test System' },
        path: '/pages/business/'
    },
    
    // 产品页面 - 多通道电解水测试系统
    'pages/business/multi-channel-water-electrolysis.html': {
        zh: 'pages/business/multi-channel-water-electrolysis.html',
        en: 'pages/business/multi-channel-water-electrolysis-en.html',
        title: { zh: '多通道电解水测试系统', en: 'Multi-channel Water Electrolysis Test System' },
        path: '/pages/business/'
    },
    'pages/business/multi-channel-water-electrolysis-en.html': {
        zh: 'pages/business/multi-channel-water-electrolysis.html',
        en: 'pages/business/multi-channel-water-electrolysis-en.html',
        title: { zh: '多通道电解水测试系统', en: 'Multi-channel Water Electrolysis Test System' },
        path: '/pages/business/'
    },
    
    // 产品页面 - CO2电解系统
    'pages/business/co2-electrolysis-system.html': {
        zh: 'pages/business/co2-electrolysis-system.html',
        en: 'pages/business/co2-electrolysis-system-en.html',
        title: { zh: 'CO₂电解系统', en: 'CO₂ Electrolysis System' },
        path: '/pages/business/'
    },
    'pages/business/co2-electrolysis-system-en.html': {
        zh: 'pages/business/co2-electrolysis-system.html',
        en: 'pages/business/co2-electrolysis-system-en.html',
        title: { zh: 'CO₂电解系统', en: 'CO₂ Electrolysis System' },
        path: '/pages/business/'
    },
    
    // 服务页面 - 生命周期评估
    'pages/business/lca-service.html': {
        zh: 'pages/business/lca-service.html',
        en: 'pages/business/lca-service-en.html',
        title: { zh: '生命周期评估服务', en: 'Life Cycle Assessment Service' },
        path: '/pages/business/'
    },
    'pages/business/lca-service-en.html': {
        zh: 'pages/business/lca-service.html',
        en: 'pages/business/lca-service-en.html',
        title: { zh: '生命周期评估服务', en: 'Life Cycle Assessment Service' },
        path: '/pages/business/'
    },
    
    // 服务页面 - 技术经济分析
    'pages/business/tea-service.html': {
        zh: 'pages/business/tea-service.html',
        en: 'pages/business/tea-service-en.html',
        title: { zh: '技术经济分析服务', en: 'Techno-Economic Analysis Service' },
        path: '/pages/business/'
    },
    'pages/business/tea-service-en.html': {
        zh: 'pages/business/tea-service.html',
        en: 'pages/business/tea-service-en.html',
        title: { zh: '技术经济分析服务', en: 'Techno-Economic Analysis Service' },
        path: '/pages/business/'
    },
    
    // 服务页面 - 专业数据库
    'pages/business/database-service.html': {
        zh: 'pages/business/database-service.html',
        en: 'pages/business/database-service-en.html',
        title: { zh: '专业数据库服务', en: 'Professional Database Service' },
        path: '/pages/business/'
    },
    'pages/business/database-service-en.html': {
        zh: 'pages/business/database-service.html',
        en: 'pages/business/database-service-en.html',
        title: { zh: '专业数据库服务', en: 'Professional Database Service' },
        path: '/pages/business/'
    },
    
    // 联系我们页面
    'pages/contact.html': {
        zh: 'pages/contact.html',
        en: 'pages/contact-en.html',
        title: { zh: '联系我们', en: 'Contact Us' },
        path: '/pages/'
    },
    'pages/contact-en.html': {
        zh: 'pages/contact.html',
        en: 'pages/contact-en.html',
        title: { zh: '联系我们', en: 'Contact Us' },
        path: '/pages/'
    }
};

// 页面索引管理类
class PageIndexManager {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.currentPage = this.getCurrentPagePath();
        this.init();
    }
    
    // 初始化
    init() {
        this.setupNavigationLinks();
        
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // 页面可见性变化时的处理逻辑
            }
        });
    }
    
    // 检测当前语言
    detectLanguage() {
        // 1. 检查URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && (langParam === 'zh' || langParam === 'en')) {
            return langParam;
        }
        
        // 2. 检查localStorage
        const savedLang = localStorage.getItem('website-language');
        if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
            return savedLang;
        }
        
        // 3. 根据当前页面文件名判断
        const currentPath = window.location.pathname;
        if (currentPath.includes('-en.html')) {
            return 'en';
        }
        
        // 4. 检查浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en')) {
            return 'en';
        }
        
        // 5. 默认中文
        return 'zh';
    }
    
    // 获取当前页面路径
    getCurrentPagePath() {
        let path = window.location.pathname;
        
        // 移除开头的斜杠
        if (path.startsWith('/')) {
            path = path.substring(1);
        }
        
        // 如果是根路径，返回index.html
        if (path === '' || path === '/') {
            path = 'index.html';
        }
        
        return path;
    }
    
    // 语言切换功能已移除，统一由language.js处理
    
    // 设置导航链接的语言切换
    setupNavigationLinks() {
        // 为所有内部链接添加语言切换功能
        const internalLinks = document.querySelectorAll('a[href]');
        
        internalLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // 跳过外部链接、锚点链接和特殊链接
            if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage(href);
            });
        });
    }
    
    // 语言切换功能已移除，统一由language.js处理
    
    // 导航到指定页面（保持当前语言）
    navigateToPage(targetPath) {
        // 规范化目标路径
        let normalizedPath = targetPath;
        
        // 移除开头的斜杠和./
        normalizedPath = normalizedPath.replace(/^(\.?\/)+/, '');
        
        // 如果是相对路径，需要根据当前页面位置计算绝对路径
        if (normalizedPath.startsWith('../')) {
            const currentDir = this.currentPage.substring(0, this.currentPage.lastIndexOf('/'));
            const levels = (normalizedPath.match(/\.\.\//g) || []).length;
            let basePath = currentDir;
            
            for (let i = 0; i < levels; i++) {
                basePath = basePath.substring(0, basePath.lastIndexOf('/'));
            }
            
            normalizedPath = normalizedPath.replace(/\.\.\//g, '');
            normalizedPath = basePath ? `${basePath}/${normalizedPath}` : normalizedPath;
        } else if (!normalizedPath.includes('/') && normalizedPath.endsWith('.html')) {
            // 处理同目录下的相对路径（如从consulting.html点击co2.html）
            const currentDir = this.currentPage.substring(0, this.currentPage.lastIndexOf('/'));
            if (currentDir) {
                normalizedPath = `${currentDir}/${normalizedPath}`;
            }
        }
        
        // 获取目标页面在当前语言下的版本
        const targetPageForLanguage = this.getTargetPageForLanguage(normalizedPath, this.currentLanguage);
        
        if (targetPageForLanguage) {
            // 确保路径以正确的格式开始
            const finalUrl = targetPageForLanguage.startsWith('/') ? targetPageForLanguage : '/' + targetPageForLanguage;
            window.location.href = finalUrl;
        } else {
            // 如果没有找到对应语言版本，使用规范化后的路径跳转
            const finalUrl = normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath;
            window.location.href = finalUrl;
        }
    }
    
    // 获取指定语言的目标页面
    getTargetPageForLanguage(pagePath, language) {
        // 首先尝试直接匹配
        if (PAGE_INDEX[pagePath]) {
            return PAGE_INDEX[pagePath][language];
        }
        
        // 尝试匹配不同语言版本的同一页面
        for (const [key, value] of Object.entries(PAGE_INDEX)) {
            if (value.zh === pagePath || value.en === pagePath) {
                return value[language];
            }
        }
        
        // 如果没有找到，返回null
        return null;
    }
    
    // 页面语言显示更新功能已移除，统一由language.js处理
    
    // 获取页面标题
    getPageTitle(pagePath, language) {
        if (PAGE_INDEX[pagePath]) {
            return PAGE_INDEX[pagePath].title[language];
        }
        return null;
    }
    
    // 获取所有页面列表
    getAllPages() {
        return PAGE_INDEX;
    }
    
    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // 获取当前页面信息
    getCurrentPageInfo() {
        return PAGE_INDEX[this.currentPage] || null;
    }
}

// 初始化页面索引管理器
let pageIndexManager;

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        pageIndexManager = new PageIndexManager();
    });
} else {
    pageIndexManager = new PageIndexManager();
}

// 导出到全局作用域
window.PageIndexManager = PageIndexManager;
window.pageIndexManager = pageIndexManager;
window.PAGE_INDEX = PAGE_INDEX;

// 语言切换函数已移除，统一由language.js处理

window.navigateToPageWithLanguage = function(targetPath) {
    if (pageIndexManager) {
        // 如果传入的是页面标识符（如'anion-membrane'），需要转换为完整路径
        let fullPath = targetPath;
        
        // 检查是否是页面标识符
        if (!targetPath.includes('/') && !targetPath.includes('.html')) {
            // 首先检查是否是特殊页面（如contact）
            if (targetPath === 'contact') {
                fullPath = `pages/${targetPath}.html`;
            } else {
                // 默认假设是business目录下的页面
                fullPath = `pages/business/${targetPath}.html`;
            }
        }
        
        pageIndexManager.navigateToPage(fullPath);
    }
};