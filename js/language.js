// 页面跳转式多语言切换功能

// 页面映射表：中文页面 -> 英文页面
const pageMapping = {
    // 主页面
    'index.html': 'index-en.html',
    '/': 'index-en.html',
    '': 'index-en.html',
    
    // 联系页面
    'pages/contact.html': 'pages/contact-en.html',
    
    // 业务页面
    'pages/business/hydrogen.html': 'pages/business/hydrogen-en.html',
    'pages/business/co2.html': 'pages/business/co2-en.html',
    'pages/business/consulting.html': 'pages/business/consulting-en.html',
    'pages/business/anion-membrane.html': 'pages/business/anion-membrane-en.html',
    'pages/business/zsm-membrane.html': 'pages/business/zsm-membrane-en.html',
    'pages/business/bench-water-electrolysis.html': 'pages/business/bench-water-electrolysis-en.html',
    'pages/business/desktop-water-electrolysis.html': 'pages/business/desktop-water-electrolysis-en.html',
    'pages/business/multi-channel-water-electrolysis.html': 'pages/business/multi-channel-water-electrolysis-en.html',
    'pages/business/co2-electrolysis-system.html': 'pages/business/co2-electrolysis-system-en.html',
    'pages/business/lca-service.html': 'pages/business/lca-service-en.html',
    'pages/business/tea-service.html': 'pages/business/tea-service-en.html',
    'pages/business/database-service.html': 'pages/business/database-service-en.html'
};

// 反向映射表：英文页面 -> 中文页面
const reversePageMapping = {};
Object.keys(pageMapping).forEach(zhPage => {
    const enPage = pageMapping[zhPage];
    reversePageMapping[enPage] = zhPage;
});

// 检测当前页面语言
function getCurrentPageLanguage() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';
    
    // 检查是否为英文页面（包含-en后缀）
    if (currentFile.includes('-en.html') || currentPath.includes('-en.html')) {
        return 'en';
    }
    return 'zh';
}

// 获取当前页面的对应语言版本URL
function getCorrespondingPageUrl(targetLanguage) {
    const currentPath = window.location.pathname;
    let currentPage = currentPath;
    
    // 处理根路径
    if (currentPath === '/' || currentPath === '') {
        currentPage = 'index.html';
    } else if (currentPath.startsWith('/')) {
        currentPage = currentPath.substring(1);
    }
    
    const currentLanguage = getCurrentPageLanguage();
    
    if (currentLanguage === 'zh' && targetLanguage === 'en') {
        // 中文切换到英文
        const targetPage = pageMapping[currentPage] || currentPage;
        return targetPage;
    } else if (currentLanguage === 'en' && targetLanguage === 'zh') {
        // 英文切换到中文
        const targetPage = reversePageMapping[currentPage] || currentPage.replace('-en.html', '.html');
        return targetPage;
    }
    
    return currentPage;
}

// 当前语言
let currentLanguage = getCurrentPageLanguage();

// 初始化语言功能
function initLanguage() {
    // 查找所有语言切换按钮（支持多种选择器）
    const languageToggles = document.querySelectorAll('.language-toggle, #languageToggle, [class*="lang"]');
    
    languageToggles.forEach(toggle => {
        // 移除之前可能存在的事件监听器标记，重新绑定
        if (toggle.dataset.languageHandled) {
            // 如果已经处理过，先移除标记，重新绑定以确保功能正常
            delete toggle.dataset.languageHandled;
        }
        
        // 移除可能存在的旧事件监听器
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const targetLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
            switchToLanguagePage(targetLanguage);
        });
        
        // 标记已处理
        newToggle.dataset.languageHandled = 'true';
    });
    
    // 更新语言切换按钮显示
    updateLanguageToggleDisplay();
}

// 切换到对应语言页面
function switchToLanguagePage(targetLanguage) {
    const targetUrl = getCorrespondingPageUrl(targetLanguage);
    
    // 保存语言偏好到本地存储
    localStorage.setItem('website-language', targetLanguage);
    
    // 跳转到对应语言页面
    if (targetUrl && targetUrl !== window.location.pathname.substring(1)) {
        // 构建正确的URL，确保不重复路径
        let finalUrl;
        if (targetUrl.startsWith('/')) {
            // 如果已经以/开头，直接使用
            finalUrl = targetUrl;
        } else {
            // 否则添加/前缀
            finalUrl = '/' + targetUrl;
        }
        
        console.log('Switching from:', window.location.pathname);
        console.log('Target URL:', targetUrl);
        console.log('Final URL:', finalUrl);
        
        window.location.href = finalUrl;
    }
}

// 更新语言切换按钮显示
function updateLanguageToggleDisplay() {
    const languageToggles = document.querySelectorAll('.language-toggle, #languageToggle, [class*="lang"]');
    
    languageToggles.forEach(toggle => {
        const langText = toggle.querySelector('.lang-text, span');
        if (langText) {
            // 根据当前页面语言显示对应的切换文本
            langText.textContent = currentLanguage === 'zh' ? 'English' : '中文';
        } else {
            // 如果没有子元素，直接设置按钮文本
            toggle.textContent = currentLanguage === 'zh' ? 'English' : '中文';
        }
    });
}

// 页面加载时初始化
function initPageLanguage() {
    // 检测当前页面语言并更新全局变量
    currentLanguage = getCurrentPageLanguage();
    
    // 初始化语言切换功能
    initLanguage();
    
    // 检查是否需要根据用户偏好跳转
    checkLanguagePreference();
}

// 检查用户语言偏好
function checkLanguagePreference() {
    const savedLanguage = localStorage.getItem('website-language');
    const browserLanguage = navigator.language || navigator.userLanguage;
    
    // 如果用户有保存的语言偏好，且与当前页面语言不符，则跳转
    if (savedLanguage && savedLanguage !== currentLanguage) {
        const targetUrl = getCorrespondingPageUrl(savedLanguage);
        if (targetUrl && targetUrl !== window.location.pathname.substring(1)) {
            const finalUrl = targetUrl.startsWith('/') ? targetUrl : '/' + targetUrl;
            window.location.href = finalUrl;
            return;
        }
    }
    
    // 如果没有保存的偏好，根据浏览器语言进行智能跳转
    if (!savedLanguage) {
        const preferredLanguage = browserLanguage.startsWith('zh') ? 'zh' : 'en';
        if (preferredLanguage !== currentLanguage) {
            const targetUrl = getCorrespondingPageUrl(preferredLanguage);
            if (targetUrl && targetUrl !== window.location.pathname.substring(1)) {
                // 保存偏好并跳转
                localStorage.setItem('website-language', preferredLanguage);
                const finalUrl = targetUrl.startsWith('/') ? targetUrl : '/' + targetUrl;
                window.location.href = finalUrl;
                return;
            }
        }
    }
 }

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initPageLanguage();
});

// 导出函数供其他脚本使用
window.HydrergyLanguage = {
    switchToLanguagePage,
    getCurrentPageLanguage,
    getCorrespondingPageUrl,
    getCurrentLanguage: () => currentLanguage,
    getSupportedLanguages: () => ['zh', 'en']
};