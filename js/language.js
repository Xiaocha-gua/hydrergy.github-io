// 多语言切换功能

// 语言数据
const translations = {
    zh: {
        // 导航栏
        'nav.home': '首页',
        'nav.business': '业务领域',
        'nav.contact': '联系我们',
        
        // 业务领域下拉菜单
        'business.hydrogen': '电解制氢技术与产品',
        'business.co2': '电解二氧化碳技术与产品',
        'business.consulting': '技术咨询服务与数据库',
        
        // 业务展示区
        'business.hydrogen.desc': '专业的电解制氢零部件、设备和技术解决方案，助力清洁能源发展',
        'business.co2.desc': '创新的二氧化碳电解技术，实现碳资源高效利用',
        'business.consulting.desc': '专业的生命周期分析、技术经济分析咨询和完善的数据库服务，为您提供全方位支持',
        
        // 信息区域
        'info.contact.title': '联系我们',
        'info.contact.person': '联系人：邱经理',
        'info.business.title': '业务领域',
        'info.view.more': '查看更多',
        
        // 留言相关
        'message.btn': '留言',
        'message.title': '留言',
        'message.name.placeholder': '姓名',
        'message.email.placeholder': '邮箱',
        'message.phone.placeholder': '电话',
        'message.content.placeholder': '留言内容',
        'message.send': '发送',
        'message.sending': '发送中...',
        'message.success': '留言发送成功，我们会尽快回复您！',
        'message.error': '请检查并填写正确的信息',
        
        // 底部标语
        'footer.slogan': '用高质量技术与产品，赋能碳中和技术发展',
        
        // 页面标题
        'page.title': 'HYDRERGY - 用高质量技术与产品，赋能碳中和技术发展',
        'page.title.away': 'HYDRERGY - 期待您的回来',
        
        // 语言切换
        'lang.switch': 'EN'
    },
    en: {
        // 导航栏
        'nav.home': 'Home',
        'nav.business': 'Business Areas',
        'nav.contact': 'Contact Us',
        
        // 业务领域下拉菜单
        'business.hydrogen': 'Water Electrolysis Technology & Products',
        'business.co2': 'CO₂ Electrolysis Technology & Products',
        'business.consulting': 'Technical Consulting & Database Services',
        
        // 业务展示区
        'business.hydrogen.desc': 'Professional water electrolysis components, equipments, and technical solutions—enabling hydrogen production and accelerating clean energy growth.',
        'business.co2.desc': 'Specialized components, equipment, and technical solutions for CO₂ electrolysis – powering the efficient utilization of carbon resources.',
        'business.consulting.desc': 'Professional life cycle analysis, techno-economic analysis consulting, and comprehensive database services – delivering holistic support tailored for you.',
        
        // 信息区域
        'info.contact.title': 'Contact Us',
        'info.contact.person': 'Contact: Mr. Qiu',
        'info.business.title': 'Business Areas',
        'info.view.more': 'View More',
        
        // 留言相关
        'message.btn': 'Message',
        'message.title': 'Leave a Message',
        'message.name.placeholder': 'Name',
        'message.email.placeholder': 'Email',
        'message.phone.placeholder': 'Phone',
        'message.content.placeholder': 'Message Content',
        'message.send': 'Send',
        'message.sending': 'Sending...',
        'message.success': 'Message sent successfully, we will reply to you as soon as possible!',
        'message.error': 'Please check and fill in the correct information',
        
        // 底部标语
        'footer.slogan': 'Empowering carbon neutrality technology development with high-quality technology and products',
        
        // 页面标题
        'page.title': 'HYDRERGY - Empowering carbon neutrality technology development with high-quality technology and products',
        'page.title.away': 'HYDRERGY - Looking forward to your return',
        
        // 语言切换
        'lang.switch': '中文'
    }
};

// 当前语言
let currentLanguage = 'zh';

// 初始化语言功能
function initLanguage() {
    const languageToggle = document.getElementById('languageToggle');
    
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            const newLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
            switchLanguage(newLanguage);
        });
    }
    
    // 从本地存储加载语言设置
    const savedLanguage = localStorage.getItem('website-language');
    if (savedLanguage && savedLanguage !== currentLanguage) {
        switchLanguage(savedLanguage);
    }
}

// 切换语言
function switchLanguage(language) {
    if (!translations[language]) {
        console.error('Language not supported:', language);
        return;
    }
    
    currentLanguage = language;
    
    // 保存到本地存储
    localStorage.setItem('website-language', language);
    
    // 更新HTML lang属性
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    
    // 更新所有带有data-zh和data-en属性的元素
    updateDataAttributes(language);
    
    // 更新表单占位符
    updatePlaceholders(language);
    
    // 更新语言切换按钮
    updateLanguageToggle(language);
    
    // 更新页面标题
    updatePageTitle(language);
    
    // 触发语言切换事件
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: language }
    }));
}

// 更新带有data属性的元素
function updateDataAttributes(language) {
    // 处理 data-zh 和 data-en 属性的元素
    const dataElements = document.querySelectorAll('[data-zh], [data-en]');
    
    dataElements.forEach(element => {
        const text = element.getAttribute(`data-${language}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // 处理 data-lang 属性的元素（显示/隐藏逻辑）
    const langElements = document.querySelectorAll('[data-lang]');
    
    langElements.forEach(element => {
        const elementLang = element.getAttribute('data-lang');
        if (elementLang === language) {
            // 显示当前语言的元素
            element.style.display = '';
        } else {
            // 隐藏其他语言的元素
            element.style.display = 'none';
        }
    });
    
    // 确保所有元素都有完整的多语言支持
    ensureCompleteMultilingualSupport();
}

// 确保所有元素都有完整的多语言支持
function ensureCompleteMultilingualSupport() {
    // 处理只有data-zh但缺少data-en的元素
    const zhOnlyElements = document.querySelectorAll('[data-zh]:not([data-en])');
    zhOnlyElements.forEach(element => {
        const zhText = element.getAttribute('data-zh');
        if (zhText && !element.getAttribute('data-en')) {
            // 为缺少英文的元素添加默认英文翻译（保持中文内容）
            element.setAttribute('data-en', zhText);
        }
    });
    
    // 处理只有data-en但缺少data-zh的元素
    const enOnlyElements = document.querySelectorAll('[data-en]:not([data-zh])');
    enOnlyElements.forEach(element => {
        const enText = element.getAttribute('data-en');
        if (enText && !element.getAttribute('data-zh')) {
            // 为缺少中文的元素添加默认中文翻译（保持英文内容）
            element.setAttribute('data-zh', enText);
        }
    });
    
    // 处理只有data-lang="zh"但缺少data-lang="en"的元素
    const zhLangOnlyElements = document.querySelectorAll('[data-lang="zh"]');
    zhLangOnlyElements.forEach(element => {
        const zhText = element.textContent.trim();
        if (zhText) {
            // 查找是否已有对应的英文元素
            const parentElement = element.parentElement;
            const existingEnElement = parentElement ? parentElement.querySelector('[data-lang="en"]') : null;
            
            if (!existingEnElement) {
                // 创建对应的英文元素
                const enElement = element.cloneNode(true);
                enElement.setAttribute('data-lang', 'en');
                enElement.textContent = zhText; // 暂时使用中文内容作为英文内容
                enElement.style.display = 'none';
                
                // 插入到中文元素之后
                element.parentNode.insertBefore(enElement, element.nextSibling);
            }
        }
    });
    
    // 处理只有data-lang="en"但缺少data-lang="zh"的元素
    const enLangOnlyElements = document.querySelectorAll('[data-lang="en"]');
    enLangOnlyElements.forEach(element => {
        const enText = element.textContent.trim();
        if (enText) {
            // 查找是否已有对应的中文元素
            const parentElement = element.parentElement;
            const existingZhElement = parentElement ? parentElement.querySelector('[data-lang="zh"]') : null;
            
            if (!existingZhElement) {
                // 创建对应的中文元素
                const zhElement = element.cloneNode(true);
                zhElement.setAttribute('data-lang', 'zh');
                zhElement.textContent = enText; // 暂时使用英文内容作为中文内容
                zhElement.style.display = '';
                
                // 插入到英文元素之前
                element.parentNode.insertBefore(zhElement, element);
            }
        }
    });
}

// 更新表单占位符
function updatePlaceholders(language) {
    const inputs = document.querySelectorAll('input[data-zh-placeholder], textarea[data-zh-placeholder]');
    
    inputs.forEach(input => {
        const placeholder = input.getAttribute(`data-${language}-placeholder`);
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });
}

// 更新语言切换按钮
function updateLanguageToggle(language) {
    const languageToggle = document.getElementById('languageToggle');
    
    if (languageToggle) {
        const langText = languageToggle.querySelector('.lang-text');
        
        if (langText) {
            langText.textContent = translations[language]['lang.switch'];
        }
    }
}

// 更新页面标题
function updatePageTitle(language) {
    document.title = translations[language]['page.title'];
}

// 获取翻译文本
function getTranslation(key, language = currentLanguage) {
    return translations[language] && translations[language][key] || key;
}

// 动态添加翻译元素
function addTranslation(element, zhText, enText) {
    element.setAttribute('data-zh', zhText);
    element.setAttribute('data-en', enText);
    
    // 立即应用当前语言
    const text = currentLanguage === 'zh' ? zhText : enText;
    element.textContent = text;
}

// 动态添加占位符翻译
function addPlaceholderTranslation(element, zhPlaceholder, enPlaceholder) {
    element.setAttribute('data-zh-placeholder', zhPlaceholder);
    element.setAttribute('data-en-placeholder', enPlaceholder);
    
    // 立即应用当前语言
    const placeholder = currentLanguage === 'zh' ? zhPlaceholder : enPlaceholder;
    element.placeholder = placeholder;
}

// 语言检测
function detectLanguage() {
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && translations[langParam]) {
        return langParam;
    }
    
    // 检查本地存储
    const savedLang = localStorage.getItem('website-language');
    if (savedLang && translations[savedLang]) {
        return savedLang;
    }
    
    // 检查浏览器语言
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh')) {
        return 'zh';
    } else {
        return 'en';
    }
}

// 更新通知消息的语言
function updateNotificationLanguage() {
    // 重写showNotification函数以支持多语言
    const originalShowNotification = window.HydrergyMain?.showNotification;
    
    if (originalShowNotification) {
        window.HydrergyMain.showNotification = function(messageKey, type = 'info') {
            const message = getTranslation(messageKey) || messageKey;
            originalShowNotification(message, type);
        };
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 首先确保所有元素都有完整的多语言支持
    ensureCompleteMultilingualSupport();
    
    // 检测并设置初始语言
    const detectedLanguage = detectLanguage();
    if (detectedLanguage !== 'zh') {
        switchLanguage(detectedLanguage);
    }
    
    // 初始化语言功能
    initLanguage();
    
    // 更新通知消息语言支持
    updateNotificationLanguage();
});

// 监听页面可见性变化，更新标题
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.title = getTranslation('page.title.away');
    } else {
        document.title = getTranslation('page.title');
    }
});

// 导出函数供其他脚本使用
window.HydrergyLanguage = {
    switchLanguage,
    getTranslation,
    addTranslation,
    addPlaceholderTranslation,
    getCurrentLanguage: () => currentLanguage,
    getSupportedLanguages: () => Object.keys(translations)
};

// 为表单提交更新语言支持
document.addEventListener('languageChanged', function(e) {
    const language = e.detail.language;
    
    // 更新表单提交按钮文本
    const submitBtns = document.querySelectorAll('.message-form button[type="submit"]');
    submitBtns.forEach(btn => {
        if (!btn.disabled) {
            btn.textContent = getTranslation('message.send', language);
        }
    });
});

// 注意：表单提交逻辑由main.js处理，这里只负责语言相关的更新