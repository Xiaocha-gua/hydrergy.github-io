// 主要JavaScript功能

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// 初始化网站功能
function initializeWebsite() {
    initNavigation();
    initModal();
    initContactForm();
    initScrollEffects();
    initImageLazyLoading();
    initAnimations();
    initProductSliders();
}

// 导航功能初始化
function initNavigation() {
    // 移动端菜单切换
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // 下拉菜单功能
    const dropdownItems = document.querySelectorAll('.dropdown');
    dropdownItems.forEach(item => {
        const toggle = item.querySelector('.dropdown-toggle');
        const menu = item.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // 鼠标悬停显示菜单
            item.addEventListener('mouseenter', function() {
                menu.style.display = 'block';
                setTimeout(() => {
                    menu.classList.add('show');
                }, 10);
            });
            
            // 鼠标离开隐藏菜单
            item.addEventListener('mouseleave', function() {
                menu.classList.remove('show');
                setTimeout(() => {
                    if (!menu.classList.contains('show')) {
                        menu.style.display = 'none';
                    }
                }, 300);
            });
        }
    });
    
    // 平滑滚动到锚点
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // 考虑固定导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 模态框功能
function initModal() {
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close');
    
    // 点击关闭按钮关闭模态框
    if (closeBtn) {
        closeBtn.addEventListener('click', closeContactModal);
    }
    
    // 点击模态框外部关闭
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeContactModal();
            }
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeContactModal();
        }
    });
}

// 打开联系模态框
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
        
        // 聚焦到第一个输入框
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="text"]');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
}

// 关闭联系模态框
function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    }
}

// 联系表单功能
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 表单验证
        if (!validateForm(form)) {
            return;
        }
        
        // 显示提交状态
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;
        
        // 提交表单数据
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                showMessage('留言发送成功！我们会尽快回复您。', 'success');
                form.reset();
                closeContactModal();
            } else {
                throw new Error('发送失败');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('发送失败，请稍后重试或直接联系我们。', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// 表单验证
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldGroup = field.closest('.form-group');
        
        // 移除之前的错误样式
        field.classList.remove('error');
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // 验证必填字段
        if (!value) {
            showFieldError(field, '此字段为必填项');
            isValid = false;
            return;
        }
        
        // 验证邮箱格式
        if (field.type === 'email' && !isValidEmail(value)) {
            showFieldError(field, '请输入有效的邮箱地址');
            isValid = false;
            return;
        }
        
        // 验证电话格式（如果填写了）
        if (field.type === 'tel' && value && !isValidPhone(value)) {
            showFieldError(field, '请输入有效的电话号码');
            isValid = false;
            return;
        }
    });
    
    return isValid;
}

// 显示字段错误
function showFieldError(field, message) {
    field.classList.add('error');
    const fieldGroup = field.closest('.form-group');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    fieldGroup.appendChild(errorDiv);
}

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 验证电话格式
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// 显示消息提示
function showMessage(message, type = 'info') {
    // 移除现有的消息
    const existingMessage = document.querySelector('.message-toast');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新的消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-toast ${type}`;
    messageDiv.textContent = message;
    
    // 样式设置
    Object.assign(messageDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '6px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // 根据类型设置背景色
    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    } else if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(135deg, #dc3545, #e74c3c)';
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';
    }
    
    // 添加到页面
    document.body.appendChild(messageDiv);
    
    // 显示动画
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// 滚动效果
function initScrollEffects() {
    const nav = document.querySelector('.main-nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 导航栏滚动效果 - 保持固定在顶部
        if (nav) {
            // 添加滚动时的阴影效果
            if (scrollTop > 50) {
                nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                nav.style.backdropFilter = 'blur(10px)';
            } else {
                nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                nav.style.backdropFilter = 'none';
            }
        }
        
        // 滚动到顶部按钮
        toggleScrollToTopButton(scrollTop);
    });
}

// 切换回到顶部按钮
function toggleScrollToTopButton(scrollTop) {
    let scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollTop > 300) {
        if (!scrollToTopBtn) {
            scrollToTopBtn = createScrollToTopButton();
        }
        scrollToTopBtn.style.display = 'block';
    } else if (scrollToTopBtn) {
        scrollToTopBtn.style.display = 'none';
    }
}

// 创建回到顶部按钮
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.setAttribute('aria-label', '回到顶部');
    
    // 样式设置
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #007bff, #0056b3)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
        transition: 'all 0.3s ease',
        zIndex: '1000',
        display: 'none'
    });
    
    // 悬停效果
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.4)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
    });
    
    // 点击事件
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(button);
    return button;
}

// 图片懒加载
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // 降级处理
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// 动画效果
function initAnimations() {
    // 元素进入视口动画
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(el => animationObserver.observe(el));
    }
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
    }
}

// 语言切换功能（如果需要客户端处理）
function switchLanguage(lang) {
    // 这里可以添加客户端语言切换逻辑
    // 目前使用页面跳转方式
    if (lang === 'en') {
        window.location.href = 'index-en.html';
    } else {
        window.location.href = 'index.html';
    }
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
    // 可以在这里添加错误报告逻辑
});

// 页面性能监控
window.addEventListener('load', function() {
    // 页面加载完成后的性能统计
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('页面加载时间:', loadTime + 'ms');
    }
});

// 产品滑动功能
let sliderStates = {
    components: { currentIndex: 0, totalItems: 6 },
    systems: { currentIndex: 0, totalItems: 4 },
    equipment: { currentIndex: 0, totalItems: 2 },
    consulting: { currentIndex: 0, totalItems: 3 }
};

// 初始化产品滑动器
function initProductSliders() {
    // 为每个滑动器设置初始状态
    Object.keys(sliderStates).forEach(sliderId => {
        updateSliderButtons(sliderId);
    });
    
    // 监听窗口大小变化，重新计算按钮状态
    window.addEventListener('resize', debounce(() => {
        Object.keys(sliderStates).forEach(sliderId => {
            // 重置滑动位置
            sliderStates[sliderId].currentIndex = 0;
            const slider = document.querySelector(`[data-slider="${sliderId}"]`);
            if (slider) {
                const container = slider.querySelector('.products-container');
                container.style.transform = 'translateX(0px)';
            }
            updateSliderButtons(sliderId);
        });
    }, 250));
}

// 获取当前屏幕下显示的产品数量
function getVisibleItemsCount() {
    const width = window.innerWidth;
    if (width <= 768) {
        return 1; // 移动端显示1个
    } else if (width <= 1024) {
        return 2; // 平板显示2个
    } else {
        return 4; // 桌面显示4个
    }
}

// 滑动产品展示
function slideProducts(sliderId, direction) {
    const slider = document.querySelector(`[data-slider="${sliderId}"]`);
    if (!slider) return;
    
    const container = slider.querySelector('.products-container');
    const items = container.querySelectorAll('.product-item');
    const state = sliderStates[sliderId];
    const visibleItems = getVisibleItemsCount();
    
    if (direction === 'next' && state.currentIndex < state.totalItems - visibleItems) {
        state.currentIndex++;
    } else if (direction === 'prev' && state.currentIndex > 0) {
        state.currentIndex--;
    }
    
    // 计算偏移量（每次移动一个产品的宽度）
    const itemWidth = items[0].offsetWidth + 25; // 包括gap
    const offset = -state.currentIndex * itemWidth;
    
    container.style.transform = `translateX(${offset}px)`;
    
    // 更新按钮状态
    updateSliderButtons(sliderId);
}

// 更新滑动器按钮状态
function updateSliderButtons(sliderId) {
    const slider = document.querySelector(`[data-slider="${sliderId}"]`);
    if (!slider) return;
    
    const state = sliderStates[sliderId];
    const visibleItems = getVisibleItemsCount();
    const prevBtn = slider.querySelector('.slider-controls.prev .slider-btn');
    const nextBtn = slider.querySelector('.slider-controls.next .slider-btn');
    
    // 更新上一页按钮
    if (prevBtn) {
        prevBtn.disabled = state.currentIndex === 0;
    }
    
    // 更新下一页按钮
    if (nextBtn) {
        nextBtn.disabled = state.currentIndex >= state.totalItems - visibleItems;
    }
}

// 全局函数导出
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.switchLanguage = switchLanguage;
window.slideProducts = slideProducts;