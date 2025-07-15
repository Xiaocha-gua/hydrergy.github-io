// EmailJS统一配置模块
// 版本：v1.0
// 创建日期：2025-01-12

const EmailJSConfig = {
    // 服务配置
    publicKey: 'rxffQW9Xlbh6J_9EE',
    serviceId: 'service_y7euqtk',
    templateId: 'template_3vjncmk',
    
    // 收件人配置
    recipientEmail: 'qiuzt@carbonxtech.com.cn',
    
    // 初始化状态
    isInitialized: false,
    
    // 初始化EmailJS
    init: function() {
        if (this.isInitialized) {
            return Promise.resolve();
        }
        
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.publicKey);
            this.isInitialized = true;
            console.log('[EmailJS Config] 初始化成功');
            return Promise.resolve();
        } else {
            return this.waitForEmailJS();
        }
    },
    
    // 等待EmailJS加载
    waitForEmailJS: function(maxWait = 10000) {
        return new Promise((resolve, reject) => {
            if (this.isInitialized) {
                resolve();
                return;
            }
            
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                if (typeof emailjs !== 'undefined') {
                    clearInterval(checkInterval);
                    emailjs.init(this.publicKey);
                    this.isInitialized = true;
                    console.log('[EmailJS Config] 延迟初始化成功');
                    resolve();
                } else if (Date.now() - startTime > maxWait) {
                    clearInterval(checkInterval);
                    reject(new Error('EmailJS加载超时'));
                }
            }, 100);
        });
    },
    
    // 发送邮件
    sendEmail: function(data) {
        if (!this.isInitialized) {
            return Promise.reject(new Error('EmailJS未初始化'));
        }
        
        if (typeof emailjs === 'undefined') {
            return Promise.reject(new Error('EmailJS服务不可用'));
        }
        
        // 数据验证
        if (!data.name || !data.email || !data.message) {
            return Promise.reject(new Error('必填字段不能为空'));
        }
        
        // 构建邮件数据
        const emailData = {
            to_email: this.recipientEmail,
            from_name: data.name,
            reply_to: data.email,
            phone: data.phone || '未提供',
            message: data.message,
            subject: data.subject || '网站留言',
            company: data.company || '未提供',
            current_time: new Date().toLocaleString('zh-CN'),
            page_source: data.pageSource || window.location.pathname
        };
        
        console.log('[EmailJS Config] 发送邮件数据:', {
            to: emailData.to_email,
            from: emailData.from_name,
            subject: emailData.subject
        });
        
        return emailjs.send(this.serviceId, this.templateId, emailData)
            .then((response) => {
                console.log('[EmailJS Config] 邮件发送成功:', response);
                return response;
            })
            .catch((error) => {
                console.error('[EmailJS Config] 邮件发送失败:', error);
                
                // 提供用户友好的错误信息
                if (!navigator.onLine) {
                    throw new Error('网络连接异常，请检查网络后重试');
                } else if (error.status === 400) {
                    throw new Error('邮件格式错误，请检查输入信息');
                } else if (error.status === 401) {
                    throw new Error('邮件服务认证失败，请联系技术支持');
                } else if (error.status === 429) {
                    throw new Error('发送频率过高，请稍后再试');
                } else {
                    throw new Error('邮件服务暂时不可用，请直接拨打+86-15680598517');
                }
            });
    },
    
    // 验证邮箱格式
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // 验证电话格式
    validatePhone: function(phone) {
        if (!phone) return true; // 电话是可选的
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone);
    },
    
    // 验证表单数据
    validateFormData: function(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length === 0) {
            errors.push('姓名不能为空');
        }
        
        if (!data.email || data.email.trim().length === 0) {
            errors.push('邮箱不能为空');
        } else if (!this.validateEmail(data.email)) {
            errors.push('邮箱格式不正确');
        }
        
        if (data.phone && !this.validatePhone(data.phone)) {
            errors.push('电话格式不正确');
        }
        
        if (!data.message || data.message.trim().length === 0) {
            errors.push('留言内容不能为空');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    // 获取配置信息（用于调试）
    getConfig: function() {
        return {
            publicKey: this.publicKey,
            serviceId: this.serviceId,
            templateId: this.templateId,
            recipientEmail: this.recipientEmail,
            isInitialized: this.isInitialized
        };
    }
};

// 自动初始化（当DOM加载完成后）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        EmailJSConfig.init().catch(error => {
            console.error('[EmailJS Config] 自动初始化失败:', error);
        });
    });
} else {
    // DOM已经加载完成
    EmailJSConfig.init().catch(error => {
        console.error('[EmailJS Config] 自动初始化失败:', error);
    });
}

// 导出配置到全局作用域
window.EmailJSConfig = EmailJSConfig;

// 兼容性：保持原有的全局函数
window.sendEmailNotification = function(data) {
    return EmailJSConfig.init().then(() => {
        return EmailJSConfig.sendEmail(data);
    });
};

console.log('[EmailJS Config] 模块加载完成');