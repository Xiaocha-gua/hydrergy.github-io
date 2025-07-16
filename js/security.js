// 网站安全防护脚本

// 安全配置（优化后 - 减少过度限制）
const securityConfig = {
    // 是否启用右键禁用（改为false，提升用户体验）
    disableRightClick: false,
    // 是否启用F12禁用（改为false，不影响开发和调试）
    disableF12: false,
    // 是否启用文本选择禁用
    disableTextSelection: false,
    // 是否启用拖拽禁用（保留，防止意外拖拽）
    disableDrag: true,
    // 是否启用开发者工具检测（改为false，避免误判）
    detectDevTools: false,
    // 是否启用复制禁用
    disableCopy: false,
    // 是否启用打印禁用
    disablePrint: false
};

// 初始化安全防护
function initSecurity() {
    // 禁用右键菜单
    if (securityConfig.disableRightClick) {
        disableRightClick();
    }
    
    // 禁用F12和其他开发者工具快捷键
    if (securityConfig.disableF12) {
        disableDevToolsKeys();
    }
    
    // 禁用文本选择
    if (securityConfig.disableTextSelection) {
        disableTextSelection();
    }
    
    // 禁用拖拽
    if (securityConfig.disableDrag) {
        disableDrag();
    }
    
    // 检测开发者工具
    if (securityConfig.detectDevTools) {
        detectDevTools();
    }
    
    // 禁用复制
    if (securityConfig.disableCopy) {
        disableCopy();
    }
    
    // 禁用打印
    if (securityConfig.disablePrint) {
        disablePrint();
    }
    
    // 添加安全头部
    addSecurityHeaders();
    
    // 输入验证和过滤
    initInputValidation();
    
    // 防止点击劫持
    preventClickjacking();
}

// 禁用右键菜单
function disableRightClick() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showSecurityWarning('右键功能已被禁用以保护网站内容');
        return false;
    });
}

// 禁用开发者工具快捷键
function disableDevToolsKeys() {
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            showSecurityWarning('开发者工具已被禁用');
            return false;
        }
        
        // Ctrl+Shift+I (开发者工具)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            showSecurityWarning('开发者工具已被禁用');
            return false;
        }
        
        // Ctrl+Shift+J (控制台)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            showSecurityWarning('控制台已被禁用');
            return false;
        }
        
        // Ctrl+U (查看源代码)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showSecurityWarning('查看源代码已被禁用');
            return false;
        }
        
        // Ctrl+Shift+C (元素选择器)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            showSecurityWarning('元素选择器已被禁用');
            return false;
        }
        
        // Ctrl+S (保存页面)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            showSecurityWarning('保存页面已被禁用');
            return false;
        }
    });
}

// 禁用文本选择
function disableTextSelection() {
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('mousedown', function(e) {
        if (e.detail > 1) { // 多次点击
            e.preventDefault();
            return false;
        }
    });
    
    // CSS方式禁用选择
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        input, textarea {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
        }
    `;
    document.head.appendChild(style);
}

// 禁用拖拽
function disableDrag() {
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        return false;
    });
}

// 检测开发者工具
function detectDevTools() {
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                handleDevToolsOpen();
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // 检测控制台
    let consoleCheck = setInterval(function() {
        const before = new Date();
        debugger;
        const after = new Date();
        if (after - before > 100) {
            handleDevToolsOpen();
        }
    }, 1000);
}

// 处理开发者工具打开
function handleDevToolsOpen() {
    showSecurityWarning('检测到开发者工具，页面将被保护');
    
    // 可以选择重定向或关闭页面
    // window.location.href = 'about:blank';
    
    // 或者模糊页面内容
    document.body.style.filter = 'blur(5px)';
    
    setTimeout(() => {
        document.body.style.filter = 'none';
    }, 3000);
}

// 禁用复制
function disableCopy() {
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        showSecurityWarning('复制功能已被禁用');
        return false;
    });
    
    document.addEventListener('keydown', function(e) {
        // Ctrl+C
        if (e.ctrlKey && e.keyCode === 67) {
            e.preventDefault();
            showSecurityWarning('复制功能已被禁用');
            return false;
        }
        
        // Ctrl+A (全选)
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            showSecurityWarning('全选功能已被禁用');
            return false;
        }
        
        // Ctrl+X (剪切)
        if (e.ctrlKey && e.keyCode === 88) {
            e.preventDefault();
            showSecurityWarning('剪切功能已被禁用');
            return false;
        }
    });
}

// 禁用打印
function disablePrint() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+P
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            showSecurityWarning('打印功能已被禁用');
            return false;
        }
    });
    
    // 重写window.print
    window.print = function() {
        showSecurityWarning('打印功能已被禁用');
    };
}

// 添加安全头部
function addSecurityHeaders() {
    // 扩展CSP策略
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.web3forms.com; img-src 'self' data:;";
    document.head.appendChild(meta);
}

// 添加CSP meta标签（如果不存在）
if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const cspMeta = document.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    cspMeta.setAttribute('content', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
    document.head.appendChild(cspMeta);
}
    
    // 添加X-Frame-Options
    const frameMeta = document.createElement('meta');
    frameMeta.setAttribute('http-equiv', 'X-Frame-Options');
    frameMeta.setAttribute('content', 'DENY');
    document.head.appendChild(frameMeta);
    
    // 添加X-Content-Type-Options
    const contentTypeMeta = document.createElement('meta');
    contentTypeMeta.setAttribute('http-equiv', 'X-Content-Type-Options');
    contentTypeMeta.setAttribute('content', 'nosniff');
    document.head.appendChild(contentTypeMeta);
}

// 输入验证和过滤
function initInputValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // XSS防护
            const value = e.target.value;
            const filteredValue = sanitizeInput(value);
            
            if (value !== filteredValue) {
                e.target.value = filteredValue;
                showSecurityWarning('检测到潜在的恶意输入，已自动过滤');
            }
        });
    });
}

// 输入清理函数
function sanitizeInput(input) {
    // 移除HTML标签
    let sanitized = input.replace(/<[^>]*>/g, '');
    
    // 移除JavaScript事件
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    
    // 移除javascript:协议
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    // 移除data:协议
    sanitized = sanitized.replace(/data:/gi, '');
    
    // 移除vbscript:协议
    sanitized = sanitized.replace(/vbscript:/gi, '');
    
    return sanitized;
}

// 防止点击劫持
function preventClickjacking() {
    if (window.top !== window.self) {
        // 如果页面被嵌入到iframe中，跳转到顶层
        window.top.location = window.self.location;
    }
}

// 显示安全警告
function showSecurityWarning(message) {
    // 创建警告元素
    const warning = document.createElement('div');
    warning.className = 'security-warning';
    warning.textContent = message;
    
    // 添加样式
    Object.assign(warning.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(220, 53, 69, 0.95)',
        color: 'white',
        padding: '20px 30px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: '9999',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // 添加到页面
    document.body.appendChild(warning);
    
    // 自动移除
    setTimeout(() => {
        if (warning.parentNode) {
            warning.parentNode.removeChild(warning);
        }
    }, 3000);
}

// 生成随机字符串（用于CSRF防护等）
function generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 检查URL安全性
function isUrlSafe(url) {
    try {
        const urlObj = new URL(url, window.location.origin);
        
        // 检查协议
        if (!['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol)) {
            return false;
        }
        
        // 检查是否为外部链接
        if (urlObj.origin !== window.location.origin && 
            !urlObj.protocol.startsWith('mailto:') && 
            !urlObj.protocol.startsWith('tel:')) {
            return confirm('您即将访问外部链接，是否继续？');
        }
        
        return true;
    } catch (e) {
        return false;
    }
}

// 重写链接点击事件
function secureLinks() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href) {
            if (!isUrlSafe(link.href)) {
                e.preventDefault();
                showSecurityWarning('链接被安全策略阻止');
                return false;
            }
        }
    });
}

// 页面离开时的安全清理
function securePageUnload() {
    window.addEventListener('beforeunload', function() {
        // 清理敏感数据
        const inputs = document.querySelectorAll('input[type="password"], input[type="email"]');
        inputs.forEach(input => {
            input.value = '';
        });
        
        // 清理本地存储中的敏感数据（如果有）
        // localStorage.removeItem('sensitive-data');
    });
}

// 监控异常活动
function monitorAbnormalActivity() {
    let clickCount = 0;
    let keyCount = 0;
    const timeWindow = 10000; // 10秒
    
    // 监控过度点击
    document.addEventListener('click', function() {
        clickCount++;
        if (clickCount > 50) {
            showSecurityWarning('检测到异常点击活动');
            clickCount = 0;
        }
    });
    
    // 监控过度按键
    document.addEventListener('keydown', function() {
        keyCount++;
        if (keyCount > 100) {
            showSecurityWarning('检测到异常键盘活动');
            keyCount = 0;
        }
    });
    
    // 重置计数器
    setInterval(() => {
        clickCount = 0;
        keyCount = 0;
    }, timeWindow);
}

// 页面加载时初始化安全功能
document.addEventListener('DOMContentLoaded', function() {
    initSecurity();
    secureLinks();
    securePageUnload();
    monitorAbnormalActivity();
    
    console.log('网站安全防护已启用');
});

// 导出安全函数
window.HydrergySecurity = {
    sanitizeInput,
    isUrlSafe,
    generateRandomString,
    showSecurityWarning
};

// 控制台警告
console.warn('%c⚠️ 安全警告', 'color: red; font-size: 20px; font-weight: bold;');
console.warn('%c此浏览器控制台仅供开发人员使用。请勿在此处输入或粘贴任何代码，这可能会导致您的账户被盗用或网站功能异常。', 'color: red; font-size: 14px;');
console.warn('%cSecurity Warning: This browser console is intended for developers only. Do not enter or paste any code here as it may compromise your account or website functionality.', 'color: red; font-size: 14px;');