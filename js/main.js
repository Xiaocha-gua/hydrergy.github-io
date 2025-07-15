// HYDRERGY 网站主要功能脚本

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// 初始化网站功能
function initializeWebsite() {
    initNavigation();
    initBusinessItems();

    initSmoothScroll();
    initMessageModal();

    
    // 加载保存的语言设置
    const savedLanguage = localStorage.getItem('website-language') || 'zh';
    if (savedLanguage === 'en') {
        switchLanguage('en');
    }
}

// 导航功能初始化
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 移除所有active类
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加active类到当前链接
            this.classList.add('active');
            
            // 如果是锚点链接，阻止默认行为并平滑滚动
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // 下拉菜单功能
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        let timeout;
        
        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(timeout);
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
        });
        
        dropdown.addEventListener('mouseleave', function() {
            timeout = setTimeout(() => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            }, 150);
        });
    });
}

// 业务项目交互初始化
function initBusinessItems() {
    const businessItems = document.querySelectorAll('.business-item');
    
    businessItems.forEach(item => {
        // 鼠标悬停效果
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
        
        // 点击事件
        item.addEventListener('click', function() {
            const businessType = this.getAttribute('data-business');
            handleBusinessClick(businessType);
        });
    });
}

// 处理业务项目点击
function handleBusinessClick(businessType) {
    const pages = {
        'hydrogen': 'pages/business/hydrogen.html',
        'co2': 'pages/business/co2.html',
        'consulting': 'pages/business/consulting.html'
    };
    
    if (pages[businessType]) {
        // 检查页面是否存在，如果不存在则显示提示
        window.location.href = pages[businessType];
    }
}





// 平滑滚动初始化
function initSmoothScroll() {
    // 为所有内部锚点链接添加平滑滚动
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}









// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '6px',
        color: 'white',
        fontSize: '14px',
        zIndex: '3000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // 设置背景色
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'info': '#007bff',
        'warning': '#ffc107'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 滚动事件处理（节流）
const handleScroll = throttle(function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const nav = document.querySelector('.main-nav');
    
    if (scrollTop > 100) {
        nav.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    } else {
        nav.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
}, 100);

// 添加滚动监听
window.addEventListener('scroll', handleScroll);

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.title = 'HYDRERGY - 期待您的回来';
    } else {
        document.title = 'HYDRERGY - 用高质量技术与产品，赋能碳中和技术发展';
    }
});

// 留言功能初始化 - 已迁移到email-service.js
// 保留此函数以维持兼容性，实际功能由EmailService模块处理
function initMessageModal() {
    // 功能已完全迁移到email-service.js模块
    // 不再在main.js中处理留言弹窗，避免冲突
    console.log('留言功能已迁移到EmailService模块');
}

// EmailJS发送邮件功能 - 已迁移到email-service.js
// 保留此函数以维持向后兼容性
function sendEmailNotification(data) {
    // 如果EmailService模块已加载，使用新的服务
    if (typeof window.EmailService !== 'undefined') {
        return window.EmailService.sendEmail(data);
    }
    
    // 兼容性回退：使用原有逻辑
    console.warn('EmailService模块未加载，使用兼容性邮件发送功能');
    return new Promise((resolve, reject) => {
        if (typeof emailjs === 'undefined') {
            reject(new Error('EmailJS未加载'));
            return;
        }
        
        emailjs.send('service_y7euqtk', 'template_3vjncmk', {
            to_email: 'qiuzt@carbonxtech.com.cn',
            from_name: data.name,
            from_email: data.email,
            phone: data.phone,
            message: data.message,
            reply_to: data.email,
            current_time: new Date().toLocaleString('zh-CN')
        })
        .then((response) => {
            console.log('邮件发送成功:', response);
            resolve(response);
        })
        .catch((error) => {
            console.error('EmailJS发送失败:', error);
            reject(error);
        });
    });
}

// 导出函数供其他脚本使用
window.HydrergyMain = {
    showNotification,
    debounce,
    throttle
};

// 全局导出sendEmailNotification函数
window.sendEmailNotification = sendEmailNotification;