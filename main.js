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
    
    if (!messageBtn || !messageModal || !closeModal || !messageForm) {
        console.log('留言功能组件未找到，跳过初始化');
        return;
    }
    
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
    
    // 表单提交 - 延迟绑定，等待EmailJS加载
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 显示加载状态
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '初始化中...';
        submitBtn.disabled = true;
        
        // 检查EmailJS是否已加载，如果没有则等待
        waitForEmailJS().then(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            handleFormSubmit(this);
        }).catch((error) => {
            console.error('EmailJS加载失败:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNotification('邮件服务初始化失败，请刷新页面重试', 'error');
        });
    });
}

// 等待EmailJS加载完成
function waitForEmailJS(maxWait = 15000) {
    return new Promise((resolve, reject) => {
        // 检查EmailJS是否已经加载并初始化
        if (typeof emailjs !== 'undefined' && emailjs.init) {
            // 确保EmailJS已经初始化
            try {
                // 重新初始化以确保配置正确
                emailjs.init("rxffQW9Xlbh6J_9EE");
                console.log('[EmailJS] 服务已初始化');
                resolve();
                return;
            } catch (error) {
                console.error('[EmailJS] 初始化失败:', error);
                reject(new Error('EmailJS初始化失败'));
                return;
            }
        }
        
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            if (typeof emailjs !== 'undefined' && emailjs.init) {
                clearInterval(checkInterval);
                try {
                    emailjs.init("rxffQW9Xlbh6J_9EE");
                    console.log('[EmailJS] 服务延迟初始化成功');
                    resolve();
                } catch (error) {
                    console.error('[EmailJS] 延迟初始化失败:', error);
                    reject(new Error('EmailJS初始化失败'));
                }
            } else if (Date.now() - startTime > maxWait) {
                clearInterval(checkInterval);
                console.error('[EmailJS] 加载超时');
                reject(new Error('EmailJS加载超时，请检查网络连接'));
            }
        }, 200);
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
    
    // 统一字段获取方式
    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const messageInput = form.querySelector('[name="message"]');
    
    // 增加空值检测
    if (!nameInput || !emailInput || !messageInput) {
        console.error('表单字段缺失:', {nameInput, emailInput, messageInput});
        showNotification('表单配置异常，请联系技术支持', 'error');
        return;
    }
    
    // 验证所有必填字段
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('请检查并填写正确的信息', 'error');
        return;
    }
    
    // 获取表单数据（统一使用name属性）
    const name = nameInput.value;
    const email = emailInput.value;
    const phone = phoneInput ? phoneInput.value : '未提供';
    const message = messageInput.value;
    
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
        // 检查EmailJS是否可用
        if (typeof emailjs === 'undefined' || !emailjs.send) {
            console.error('[EmailJS] 邮件服务未正确加载');
            return reject(new Error('邮件服务未正确加载'));
        }
        
        // 验证必要的配置参数
        const templateParams = {
            to_email: 'qiuzt@carbonxtech.com.cn',
            from_name: data.name || '未提供姓名',
            reply_to: data.email || '',
            phone: data.phone || '未提供',
            message: data.message || '',
            current_time: new Date().toLocaleString('zh-CN')
        };
        
        console.log('[EmailJS] 准备发送邮件:', {
            serviceId: 'service_y7euqtk',
            templateId: 'template_3vjncmk',
            params: templateParams
        });
        
        emailjs.send('service_y7euqtk', 'template_3vjncmk', templateParams)
            .then((response) => {
                console.log('[EmailJS] 邮件发送成功:', {
                    status: response.status,
                    text: response.text,
                    data: data
                });
                resolve(response);
            })
            .catch((error) => {
                console.error('[EmailJS] 发送失败详细信息:', {
                    error: error,
                    message: error.message,
                    status: error.status,
                    text: error.text,
                    templateParams: templateParams
                });
                
                // 根据错误类型提供更具体的错误信息
                let errorMessage = '邮件发送失败';
                if (!navigator.onLine) {
                    errorMessage = '网络连接异常，请检查网络后重试';
                } else if (error.status === 400) {
                    errorMessage = '邮件模板配置错误，请联系技术支持';
                } else if (error.status === 401) {
                    errorMessage = '邮件服务认证失败，请联系技术支持';
                } else if (error.status === 403) {
                    errorMessage = '邮件服务权限不足，请联系技术支持';
                } else if (error.status >= 500) {
                    errorMessage = '邮件服务器暂时不可用，请稍后重试';
                } else {
                    errorMessage = '邮件发送失败，请直接联系我们：+86-15680598517';
                }
                
                reject(new Error(errorMessage));
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

// 导出函数供其他脚本使用
window.HydrergyMain = {
    showNotification,
    debounce,
    throttle,
    validateField
};

// 将邮件发送函数暴露到全局作用域，供contact.html等页面使用
window.sendEmailNotification = sendEmailNotification;
window.handleFormSubmit = handleFormSubmit;