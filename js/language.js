// 统一的语言切换系统 - 简化版
// 只支持中英文页面切换，无IP地理位置检测

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
        const targetPage = pageMapping[currentPage];
        return targetPage || currentPage;
    } else if (currentLanguage === 'en' && targetLanguage === 'zh') {
        // 英文切换到中文
        const targetPage = reversePageMapping[currentPage];
        if (targetPage) {
            return targetPage;
        }
        // 如果映射表中没有，尝试简单的文件名替换
        return currentPage.replace('-en.html', '.html');
    }
    
    return currentPage;
}

// 切换到对应语言页面
function switchToLanguagePage(targetLanguage) {
    const targetUrl = getCorrespondingPageUrl(targetLanguage);
    
    // 保存语言偏好到本地存储
    localStorage.setItem('website-language', targetLanguage);
    
    // 跳转到对应语言页面
    if (targetUrl && targetUrl !== window.location.pathname.substring(1)) {
        // 构建正确的URL
        const finalUrl = targetUrl.startsWith('/') ? targetUrl : '/' + targetUrl;
        window.location.href = finalUrl;
    }
}

// 更新语言切换按钮显示
function updateLanguageToggleDisplay() {
    const currentLanguage = getCurrentPageLanguage();
    const languageToggles = document.querySelectorAll('.language-toggle, #languageToggle, [class*="lang"]');
    
    languageToggles.forEach(toggle => {
        const langText = toggle.querySelector('.lang-text, span');
        const displayText = currentLanguage === 'zh' ? 'English' : '中文';
        
        if (langText) {
            langText.textContent = displayText;
        } else {
            toggle.textContent = displayText;
        }
    });
}

// 初始化语言切换功能
function initLanguage() {
    // 查找所有语言切换按钮
    const languageToggles = document.querySelectorAll('.language-toggle, #languageToggle, [class*="lang"]');
    
    languageToggles.forEach(toggle => {
        // 移除可能存在的旧事件监听器
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        // 添加点击事件监听器
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentLanguage = getCurrentPageLanguage();
            const targetLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
            
            switchToLanguagePage(targetLanguage);
        });
    });
    
    // 更新按钮显示
    updateLanguageToggleDisplay();
}

// 检查并应用保存的语言偏好
function checkLanguagePreference() {
    const savedLanguage = localStorage.getItem('website-language');
    const currentLanguage = getCurrentPageLanguage();
    
    // 如果用户有保存的语言偏好，且与当前页面语言不符，则跳转
    if (savedLanguage && savedLanguage !== currentLanguage) {
        const targetUrl = getCorrespondingPageUrl(savedLanguage);
        if (targetUrl && targetUrl !== window.location.pathname.substring(1)) {
            const finalUrl = targetUrl.startsWith('/') ? targetUrl : '/' + targetUrl;
            window.location.href = finalUrl;
        }
    }
}

// 页面加载时初始化语言功能
function initPageLanguage() {
    // 初始化语言切换功能
    initLanguage();
    
    // 检查语言偏好（延迟执行，避免页面加载冲突）
    setTimeout(() => {
        checkLanguagePreference();
    }, 100);
}

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initPageLanguage();
    }, 50);
});

// 导出函数供其他脚本使用
window.HydrergyLanguage = {
    switchToLanguagePage,
    getCurrentPageLanguage,
    getCorrespondingPageUrl,
    initPageLanguage,
    updateLanguageToggleDisplay
};