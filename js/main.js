// HYDRERGY 网站主要功能脚本

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// 初始化网站功能
function initializeWebsite() {
    initNavigation();
    initBusinessItems();
    initMessageModal();
    initSmoothScroll();
    initFormValidation();
    
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

// 留言弹窗功能初始化
function initMessageModal() {
    const messageBtn = document.getElementById('messageBtn');
    const messageModal = document.getElementById('messageModal');
    const closeModal = document.getElementById('closeModal');
    const messageForm = document.getElementById('messageForm');
    
    // 打开弹窗
    messageBtn.addEventListener('click', function() {
        messageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭弹窗
    function closeModalFunction() {
        messageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    closeModal.addEventListener('click', closeModalFunction);
    
    // 点击背景关闭弹窗
    messageModal.addEventListener('click', function(e) {
        if (e.target === messageModal) {
            closeModalFunction();
        }
    });
    
    // ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && messageModal.style.display === 'block') {
            closeModalFunction();
        }
    });
    
    // 表单提交
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit(this);
    });
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

// 表单验证初始化
function initFormValidation() {
    const inputs = document.querySelectorAll('.message-form input, .message-form textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // 清除错误状态
            this.style.borderColor = '#ddd';
        });
    });
}

// 字段验证
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
        }
    }
    
    // 设置样式
    field.style.borderColor = isValid ? '#28a745' : '#dc3545';
    
    return isValid;
}

// 处理表单提交
function handleFormSubmit(form) {
    const formData = new FormData(form);
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    // 验证所有字段
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('请检查并填写正确的信息', 'error');
        return;
    }
    
    // 获取表单数据
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const phone = form.querySelector('input[type="tel"]').value || '未提供';
    const message = form.querySelector('textarea').value;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = '发送中...';
    submitBtn.disabled = true;
    
    // 发送邮件到指定邮箱
    sendEmailNotification({
        name: name,
        email: email,
        phone: phone,
        message: message
    }).then(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // 重置表单
        form.reset();
        inputs.forEach(input => {
            input.style.borderColor = '#ddd';
        });
        
        // 关闭弹窗
        document.getElementById('messageModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // 显示成功消息
        showNotification('留言发送成功，我们会尽快回复您！', 'success');
    }).catch((error) => {
        console.error('邮件发送失败:', error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // 显示错误消息
        showNotification('发送失败，请稍后重试或直接联系我们', 'error');
    });
}

// 发送邮件通知函数
function sendEmailNotification(data) {
    return new Promise((resolve, reject) => {
        // 构建邮件内容
        const emailContent = `
新的网站留言：

姓名：${data.name}
邮箱：${data.email}
电话：${data.phone}
留言时间：${new Date().toLocaleString('zh-CN')}

留言内容：
${data.message}

---
此邮件来自HYDRERGY官网留言系统
        `.trim();
        
        // 使用EmailJS发送邮件（需要配置EmailJS服务）
        // 这里提供两种实现方式：
        
        // 方式1：使用EmailJS（推荐）
        if (typeof emailjs !== 'undefined') {
            emailjs.send('service_y7euqtk', 'template_3vjncmk', {
                from_name: data.name,
                reply_to: data.email,
                phone: data.phone,
                message: data.message,
                current_time: new Date().toLocaleString('zh-CN')
            }).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        } else {
            // 方式2：使用Fetch API发送到后端接口（需要后端支持）
            fetch('/api/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'sales@carbonxtech.com.cn',
                    subject: `HYDRERGY网站新留言 - ${data.name}`,
                    content: emailContent,
                    replyTo: data.email
                })
            }).then(response => {
                if (response.ok) {
                    resolve();
                } else {
                    reject(new Error('服务器响应错误'));
                }
            }).catch(error => {
                reject(error);
            });
        }
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

// 导出函数供其他脚本使用
window.HydrergyMain = {
    showNotification,
    debounce,
    throttle,
    validateField
};