/**
 * 统一的邮件服务模块
 * 负责处理所有页面的邮件发送功能
 * 作者：HYDRERGY开发团队
 * 版本：v1.0.0
 * 更新时间：2025-01-12
 */

// EmailJS配置信息
const EMAIL_CONFIG = {
    publicKey: 'rxffQW9Xlbh6J_9EE',
    serviceId: 'service_y7euqtk',
    templateId: 'template_3vjncmk',
    targetEmail: 'qiuzt@carbonxtech.com.cn'
};

// 调试模式
const DEBUG_MODE = true;

// 调试日志函数
function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        console.log(`[EmailService] ${message}`, data || '');
    }
}

// 邮件服务类
class EmailService {
    constructor() {
        this.isInitialized = false;
        this.initPromise = null;
    }

    /**
     * 初始化EmailJS服务
     * @returns {Promise} 初始化Promise
     */
    async init() {
        debugLog('开始初始化EmailJS服务');
        
        if (this.isInitialized) {
            debugLog('EmailJS已经初始化，直接返回');
            return Promise.resolve();
        }

        if (this.initPromise) {
            debugLog('EmailJS正在初始化中，等待完成');
            return this.initPromise;
        }

        this.initPromise = new Promise((resolve, reject) => {
            // 检查EmailJS是否已加载
            if (typeof emailjs === 'undefined') {
                debugLog('EmailJS未加载，开始动态加载');
                // 动态加载EmailJS
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                script.onload = () => {
                    debugLog('EmailJS脚本加载成功');
                    try {
                        this.initializeEmailJS();
                        resolve();
                    } catch (error) {
                        debugLog('EmailJS初始化失败', error);
                        reject(error);
                    }
                };
                script.onerror = () => {
                    const error = new Error('EmailJS脚本加载失败');
                    debugLog('EmailJS脚本加载失败', error);
                    reject(error);
                };
                document.head.appendChild(script);
            } else {
                debugLog('EmailJS已存在，直接初始化');
                try {
                    this.initializeEmailJS();
                    resolve();
                } catch (error) {
                    debugLog('EmailJS初始化失败', error);
                    reject(error);
                }
            }
        });

        return this.initPromise;
    }

    /**
     * 初始化EmailJS配置
     */
    initializeEmailJS() {
        try {
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS对象未定义');
            }
            
            emailjs.init(EMAIL_CONFIG.publicKey);
            this.isInitialized = true;
            debugLog('EmailJS初始化成功');
        } catch (error) {
            debugLog('EmailJS初始化失败', error);
            throw error;
        }
    }

    /**
     * 发送邮件通知
     * @param {Object} data 邮件数据
     * @param {string} data.name 发送者姓名
     * @param {string} data.email 发送者邮箱
     * @param {string} data.phone 发送者电话
     * @param {string} data.message 留言内容
     * @param {string} [data.company] 公司名称
     * @param {string} [data.subject] 咨询主题
     * @returns {Promise} 发送结果Promise
     */
    async sendEmail(data) {
        try {
            debugLog('准备发送邮件', data);
            
            // 确保EmailJS已初始化
            await this.init();
            debugLog('EmailJS初始化完成');

            // 验证必填字段
            this.validateEmailData(data);
            debugLog('数据验证通过');

            // 构建邮件模板参数
            const templateParams = this.buildTemplateParams(data);
            debugLog('模板参数构建完成', templateParams);

            // 发送邮件
            debugLog('开始调用EmailJS发送邮件');
            const response = await emailjs.send(
                EMAIL_CONFIG.serviceId,
                EMAIL_CONFIG.templateId,
                templateParams
            );

            debugLog('邮件发送成功', response);
            return response;
        } catch (error) {
            debugLog('邮件发送失败', error);
            
            // 提供更友好的错误信息
            let friendlyMessage = '发送失败，请稍后重试';
            if (error.message) {
                if (error.message.includes('网络')) {
                    friendlyMessage = '网络连接失败，请检查网络后重试';
                } else if (error.message.includes('邮箱')) {
                    friendlyMessage = '邮箱格式不正确，请检查后重试';
                } else if (error.message.includes('必填')) {
                    friendlyMessage = error.message;
                }
            }
            
            const enhancedError = new Error(friendlyMessage);
            enhancedError.originalError = error;
            throw enhancedError;
        }
    }

    /**
     * 验证邮件数据
     * @param {Object} data 邮件数据
     */
    validateEmailData(data) {
        const requiredFields = ['name', 'email', 'message'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
        
        if (missingFields.length > 0) {
            throw new Error(`缺少必填字段: ${missingFields.join(', ')}`);
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('邮箱格式不正确');
        }
    }

    /**
     * 构建邮件模板参数
     * @param {Object} data 邮件数据
     * @returns {Object} 模板参数
     */
    buildTemplateParams(data) {
        // 构建详细的留言内容
        let detailedMessage = data.message;
        
        if (data.subject) {
            detailedMessage = `咨询主题：${data.subject}\n\n${detailedMessage}`;
        }
        
        if (data.company) {
            detailedMessage = `公司：${data.company}\n${detailedMessage}`;
        }

        return {
            to_email: EMAIL_CONFIG.targetEmail,
            from_name: data.name,
            from_email: data.email,
            phone: data.phone || '未提供',
            message: detailedMessage,
            reply_to: data.email,
            current_time: new Date().toLocaleString('zh-CN'),
            page_source: this.getPageSource()
        };
    }

    /**
     * 获取页面来源信息
     * @returns {string} 页面来源
     */
    getPageSource() {
        const path = window.location.pathname;
        const pageMap = {
            '/index.html': '首页',
            '/pages/contact.html': '联系我们页面',
            '/pages/business/hydrogen.html': '电解制氢技术与产品',
            '/pages/business/co2.html': '电解二氧化碳技术与产品',
            '/pages/business/consulting.html': '技术咨询服务与数据库',
            '/pages/business/lca-service.html': '生命周期评估服务',
            '/pages/business/tea-service.html': '技术经济分析服务',
            '/pages/business/database-service.html': '数据库服务',
            '/pages/business/zsm-membrane.html': 'ZSM复合隔膜',
            '/pages/business/anion-membrane.html': '阴离子交换膜',
            '/pages/business/bench-water-electrolysis.html': '台架式电解水测试系统',
            '/pages/business/desktop-water-electrolysis.html': '桌面式电解水测试系统'
        };
        
        return pageMap[path] || `未知页面 (${path})`;
    }
}

// 创建全局邮件服务实例
const emailService = new EmailService();

// 通知显示函数
function showEmailNotification(message, type = 'info') {
    debugLog('显示通知', { message, type });
    
    // 移除现有通知
    const existingNotifications = document.querySelectorAll('.email-notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `email-notification ${type}`;
    
    // 图标映射
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // 设置初始样式（隐藏状态）
    Object.assign(notification.style, {
        opacity: '0',
        transform: 'translateX(100%) scale(0.8)',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    requestAnimationFrame(() => {
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0) scale(1)';
        }, 50);
    });
    
    // 自动隐藏
    const hideTimeout = setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%) scale(0.8)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 5000);
    
    // 点击关闭
    notification.addEventListener('click', () => {
        clearTimeout(hideTimeout);
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%) scale(0.8)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    });
    
    // 鼠标悬停暂停自动隐藏
    notification.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
    });
    
    notification.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%) scale(0.8)';
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 400);
            }
        }, 2000);
    });
}

// 统一的表单处理函数
function handleEmailForm(form, options = {}) {
    if (!form) {
        console.error('表单元素不存在');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            // 获取表单数据
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || '未提供',
                message: formData.get('message')
            };

            // 添加可选字段
            if (formData.get('company')) {
                data.company = formData.get('company');
            }
            if (formData.get('subject')) {
                data.subject = formData.get('subject');
            }

            // 获取提交按钮
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // 保存原始文本
            if (!submitBtn.getAttribute('data-original-text')) {
                submitBtn.setAttribute('data-original-text', originalText);
            }
            
            // 设置加载状态
            submitBtn.textContent = '发送中...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            debugLog('开始发送邮件', data);
            
            // 发送邮件
            await emailService.sendEmail(data);
            
            // 重置表单
            this.reset();
            
            // 关闭弹窗（如果存在）
            if (options.closeModal && typeof options.closeModal === 'function') {
                options.closeModal();
            }
            
            // 显示成功消息
            showEmailNotification('留言发送成功，我们会尽快回复您！', 'success');
            
        } catch (error) {
            console.error('邮件发送失败:', error);
            showEmailNotification('发送失败，请稍后重试或直接联系我们', 'error');
        } finally {
            // 恢复按钮状态
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.getAttribute('data-original-text') || submitBtn.textContent.replace('发送中...', '发送留言');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        }
    });
}

// 初始化留言弹窗功能
function initMessageModal() {
    debugLog('开始初始化留言弹窗功能');
    
    const messageBtn = document.getElementById('messageBtn');
    const messageModal = document.getElementById('messageModal');
    const closeModal = document.getElementById('closeModal') || document.querySelector('.close');
    const messageForm = document.getElementById('messageForm');
    
    debugLog('留言弹窗元素检查:', {
        messageBtn: !!messageBtn,
        messageModal: !!messageModal,
        closeModal: !!closeModal,
        messageForm: !!messageForm
    });
    
    if (messageBtn && messageModal) {
        debugLog('添加留言按钮点击事件监听器');
        
        // 打开留言弹窗
        messageBtn.addEventListener('click', function() {
            debugLog('留言按钮被点击');
            messageModal.style.display = 'flex';
            messageModal.style.alignItems = 'center';
            messageModal.style.justifyContent = 'center';
            document.body.style.overflow = 'hidden';
            debugLog('留言弹窗已显示');
        });
        
        // 关闭留言弹窗函数
        function closeMessageModal() {
            messageModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // 关闭按钮事件
        if (closeModal) {
            closeModal.addEventListener('click', closeMessageModal);
        }
        
        // 点击弹窗外部关闭
        messageModal.addEventListener('click', function(e) {
            if (e.target === messageModal) {
                closeMessageModal();
            }
        });
        
        // 处理表单提交
        if (messageForm) {
            handleEmailForm(messageForm, { closeModal: closeMessageModal });
        }
        
        debugLog('留言弹窗初始化完成');
    } else {
        debugLog('留言弹窗初始化失败 - 缺少必要元素:', {
            messageBtn: !!messageBtn,
            messageModal: !!messageModal
        });
    }
}

// 自动初始化函数
function autoInitEmailService() {
    debugLog('开始自动初始化邮件服务');
    
    // 检查必要的DOM元素
    const messageBtn = document.getElementById('messageBtn');
    const messageModal = document.getElementById('messageModal');
    
    debugLog('DOM元素检查:', {
        messageBtn: !!messageBtn,
        messageModal: !!messageModal,
        messageBtn_element: messageBtn,
        messageModal_element: messageModal
    });
    
    // 初始化留言弹窗
    initMessageModal();
    
    // 处理联系页面表单
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        handleEmailForm(contactForm);
    }
    
    // 处理其他可能的表单
    const otherForms = document.querySelectorAll('form.message-form, form.contact-form');
    otherForms.forEach(form => {
        if (form.id !== 'messageForm' && form.id !== 'contactForm') {
            handleEmailForm(form);
        }
    });
    
    debugLog('邮件服务自动初始化完成');
}

// 导出API
window.EmailService = {
    // 核心服务
    service: emailService,
    
    // 发送邮件
    sendEmail: (data) => emailService.sendEmail(data),
    
    // 显示通知
    showNotification: showEmailNotification,
    
    // 处理表单
    handleForm: handleEmailForm,
    
    // 初始化弹窗
    initModal: initMessageModal,
    
    // 自动初始化
    autoInit: autoInitEmailService
};

// 兼容性：保持原有的全局函数
window.sendEmailNotification = (data) => emailService.sendEmail(data);
window.showNotification = showEmailNotification;

// 页面加载完成后自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitEmailService);
} else {
    autoInitEmailService();
}

console.log('邮件服务模块加载完成 - v1.0.0');