// 地理位置语言自动检测
(function() {
    'use strict';
    
    // 检测用户地理位置并设置语言
    function detectAndSetLanguage() {
        // 检查是否已有语言设置（避免与language.js冲突）
        const savedLanguage = localStorage.getItem('website-language');
        if (savedLanguage) {
            return; // 已有设置，不进行地理检测
        }
        
        // 检查是否已经进行过地理检测（避免重复检测）
        const geoDetected = sessionStorage.getItem('geo-language-detected');
        if (geoDetected) {
            return; // 本次会话已检测过，不再重复
        }
        
        // 标记已进行地理检测
        sessionStorage.setItem('geo-language-detected', 'true');
        
        // 尝试通过浏览器语言检测
        const browserLanguage = navigator.language || navigator.userLanguage;
        
        // 中文相关的语言代码
        const chineseLanguages = ['zh', 'zh-CN', 'zh-TW', 'zh-HK', 'zh-SG'];
        
        // 检查浏览器语言是否为中文
        const isChineseBrowser = chineseLanguages.some(lang => 
            browserLanguage.toLowerCase().startsWith(lang.toLowerCase())
        );
        
        if (isChineseBrowser) {
            // 浏览器语言为中文，保持默认中文设置，不进行切换
            return;
        } else {
            // 对于非中文浏览器，尝试IP地理位置检测
            detectLocationByIP();
        }
    }
    
    // 通过IP检测地理位置
    function detectLocationByIP() {
        // 使用免费的IP地理位置API
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                // 中国大陆、香港、澳门、台湾、新加坡等地区使用中文
                const chineseRegions = ['CN', 'HK', 'MO', 'TW', 'SG'];
                
                if (chineseRegions.includes(data.country_code)) {
                    setLanguage('zh');
                } else {
                    setLanguage('en');
                }
            })
            .catch(error => {
                console.log('IP地理位置检测失败，使用默认语言:', error);
                // 如果IP检测失败，默认使用中文
                setLanguage('zh');
            });
    }
    
    // 设置语言（与language.js协调）
    function setLanguage(language) {
        // 避免不必要的语言切换，减少页面闪烁
        const currentLang = localStorage.getItem('website-language') || 'zh';
        if (currentLang === language) {
            return; // 语言相同，无需切换
        }
        
        // 使用HydrergyLanguage命名空间中的函数
        if (window.HydrergyLanguage && typeof window.HydrergyLanguage.switchLanguage === 'function') {
            window.HydrergyLanguage.switchLanguage(language);
        } else if (typeof window.switchLanguage === 'function') {
            window.switchLanguage(language);
        } else {
            // 如果语言切换功能还未加载，等待一下再尝试
            setTimeout(() => {
                if (window.HydrergyLanguage && typeof window.HydrergyLanguage.switchLanguage === 'function') {
                    window.HydrergyLanguage.switchLanguage(language);
                } else if (typeof window.switchLanguage === 'function') {
                    window.switchLanguage(language);
                }
            }, 200);
        }
    }
    
    // 页面加载完成后执行检测（延迟执行以避免与language.js冲突）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // 延迟执行，确保language.js已完成初始化
            setTimeout(detectAndSetLanguage, 500);
        });
    } else {
        // 延迟执行，确保language.js已完成初始化
        setTimeout(detectAndSetLanguage, 500);
    }
    
    // 导出函数供其他脚本使用
    window.GeoLanguage = {
        detectAndSetLanguage: detectAndSetLanguage,
        setLanguage: setLanguage
    };
})();