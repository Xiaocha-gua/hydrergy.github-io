// EmailJS统一配置模块 - 增强版
// 版本：v1.1
// 创建日期：2025-01-12
// 更新日期：2025-01-12

const EmailJSConfig = {
    // 服务配置
    publicKey: 'rxffQW9Xlbh6J_9EE',
    serviceId: 'service_y7euqtk',
    templateId: 'template_3vjncmk',
    
    // 收件人配置
    recipientEmail: 'qiuzt@carbonxtech.com.cn',
    
    // 初始化状态
    isInitialized: false,
    initPromise: null,
    initAttempts: 0,
    maxInitAttempts: 3,
    
    // 初始化EmailJS (增强版)
    init: function() {
        if (this.initPromise && this.isInitialized) {
            return this.initPromise;
        }
        
        this.initAttempts++;
        console.log(`[EmailJS Config] 开始初始化 (尝试 ${this.initAttempts}/${this.maxInitAttempts})`);
        
        this.initPromise = new Promise((resolve, reject) => {
            // 检查网络状态
            if (!navigator.onLine) {
                const error = new Error('网络连接异常，请检查网络后重试');
                console.error('[EmailJS Config] 网络检查失败:', error.message);
                reject(error);
                return;
            }
            
            // 检查EmailJS库是否加载
            if (typeof emailjs === 'undefined') {
                const error = new Error('EmailJS库未加载，请检查CDN连接');
                console.error('[EmailJS Config] EmailJS库检查失败:', error.message);
                reject(error);
                return;
            }
            
            try {
                // 验证配置参数
                if (!this.publicKey || !this.serviceId || !this.templateId) {
                    throw new Error('EmailJS配置参数不完整');
                }
                
                emailjs.init(this.publicKey);
                this.isInitialized = true;
                console.log('[EmailJS Config] 初始化成功');
                console.log('[EmailJS Config] 配置信息:', {
                    publicKey: this.publicKey.substring(0, 8) + '...',
                    serviceId: this.serviceId,
                    templateId: this.templateId,
                    recipientEmail: this.recipientEmail
                });
                resolve();
            } catch (error) {
                console.error('[EmailJS Config] 初始化失败:', error);
                this.isInitialized = false;
                
                // 如果还有重试机会，清除Promise以便重试
                if (this.initAttempts < this.maxInitAttempts) {
                    this.initPromise = null;
                    console.log('[EmailJS Config] 将在1秒后重试初始化');
                    setTimeout(() => {
                        this.init().then(resolve).catch(reject);
                    }, 1000);
                } else {
                    reject(error);
                }
            }
        });
        
        return this.initPromise;
    },
    
    // 等待EmailJS加载 (增强版)
    waitForEmailJS: function(timeout = 15000) {
        console.log('[EmailJS Config] 开始等待EmailJS库加载');
        
        return new Promise((resolve, reject) => {
            // 如果已经加载并初始化，直接返回
            if (typeof emailjs !== 'undefined' && this.isInitialized) {
                console.log('[EmailJS Config] EmailJS已加载并初始化');
                resolve();
                return;
            }
            
            // 如果EmailJS已加载但未初始化，尝试初始化
            if (typeof emailjs !== 'undefined') {
                console.log('[EmailJS Config] EmailJS已加载，开始初始化');
                this.init().then(resolve).catch(reject);
                return;
            }
            
            const startTime = Date.now();
            let checkCount = 0;
            const maxChecks = Math.floor(timeout / 100);
            
            const checkInterval = setInterval(() => {
                checkCount++;
                const elapsed = Date.now() - startTime;
                
                if (typeof emailjs !== 'undefined') {
                    clearInterval(checkInterval);
                    console.log(`[EmailJS Config] EmailJS库加载完成 (耗时: ${elapsed}ms, 检查次数: ${checkCount})`);
                    this.init().then(resolve).catch(reject);
                } else if (elapsed > timeout) {
                    clearInterval(checkInterval);
                    const error = new Error(`EmailJS库加载超时 (${timeout}ms)，请检查网络连接或CDN可用性`);
                    console.error('[EmailJS Config] 加载超时:', error.message);
                    reject(error);
                } else if (checkCount % 50 === 0) {
                    // 每5秒输出一次等待日志
                    console.log(`[EmailJS Config] 仍在等待EmailJS库加载... (${elapsed}ms/${timeout}ms)`);
                }
            }, 100);
        });
    },
    
    // 发送邮件 (增强版)
    sendEmail: function(data) {
        console.log('[EmailJS Config] 开始发送邮件流程');
        console.log('[EmailJS Config] 页面路径:', window.location.pathname);
        console.log('[EmailJS Config] 表单数据:', data);
        
        // 检查初始化状态
        if (!this.isInitialized) {
            const error = new Error('EmailJS未初始化，请稍后重试');
            console.error('[EmailJS Config] 发送失败:', error.message);
            return Promise.reject(error);
        }
        
        // 检查EmailJS对象
        if (typeof emailjs === 'undefined') {
            const error = new Error('EmailJS库不可用，请刷新页面重试');
            console.error('[EmailJS Config] 发送失败:', error.message);
            return Promise.reject(error);
        }
        
        // 验证表单数据
        const validationResult = this.validateFormData(data);
        if (!validationResult.isValid) {
            const error = new Error(`表单验证失败: ${validationResult.errors.join(', ')}`);
            console.error('[EmailJS Config] 验证失败:', error.message);
            return Promise.reject(error);
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
            page_source: data.pageSource || window.location.pathname,
            page_url: window.location.href,
            timestamp: new Date().toLocaleString('zh-CN')
        };
        
        console.log('[EmailJS Config] 发送邮件数据:', {
            to: emailData.to_email,
            from: emailData.from_name,
            subject: emailData.subject
        });
        console.log('[EmailJS Config] 服务配置:', {
            serviceId: this.serviceId,
            templateId: this.templateId
        });
        
        // 发送邮件
        const sendStartTime = Date.now();
        return emailjs.send(this.serviceId, this.templateId, emailData)
            .then((response) => {
                const sendDuration = Date.now() - sendStartTime;
                console.log(`[EmailJS Config] 邮件发送成功 (耗时: ${sendDuration}ms):`, response);
                console.log('[EmailJS Config] 响应状态:', response.status);
                console.log('[EmailJS Config] 响应文本:', response.text);
                return response;
            })
            .catch((error) => {
                const sendDuration = Date.now() - sendStartTime;
                console.error(`[EmailJS Config] 邮件发送失败 (耗时: ${sendDuration}ms):`, error);
                console.error('[EmailJS Config] 错误详情:', {
                    name: error.name,
                    message: error.message,
                    status: error.status,
                    text: error.text
                });
                
                // 提供用户友好的错误信息
                let userMessage = '发送失败，请稍后重试';
                if (error.status === 400) {
                    userMessage = '请求参数错误，请检查输入信息';
                } else if (error.status === 401) {
                    userMessage = '服务认证失败，请联系技术支持';
                } else if (error.status === 403) {
                    userMessage = '服务访问被拒绝，请联系技术支持';
                } else if (error.status === 429) {
                    userMessage = '发送频率过高，请稍后重试';
                } else if (error.status >= 500) {
                    userMessage = '服务器错误，请稍后重试或直接联系我们';
                } else if (!navigator.onLine) {
                    userMessage = '网络连接异常，请检查网络后重试';
                } else {
                    userMessage = '邮件服务暂时不可用，请直接拨打+86-15680598517';
                }
                
                const enhancedError = new Error(userMessage);
                enhancedError.originalError = error;
                enhancedError.userMessage = userMessage;
                throw enhancedError;
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
    
    // 验证表单数据 (增强版)
    validateFormData: function(data) {
        console.log('[EmailJS Config] 开始验证表单数据:', data);
        const errors = [];
        
        // 验证姓名
        if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
            errors.push('姓名不能为空');
        } else if (data.name.trim().length > 50) {
            errors.push('姓名长度不能超过50个字符');
        }
        
        // 验证邮箱
        if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
            errors.push('邮箱不能为空');
        } else if (!this.validateEmail(data.email.trim())) {
            errors.push('请输入有效的邮箱地址');
        }
        
        // 验证留言内容
        if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
            errors.push('留言内容不能为空');
        } else if (data.message.trim().length < 5) {
            errors.push('留言内容至少需要5个字符');
        } else if (data.message.trim().length > 1000) {
            errors.push('留言内容不能超过1000个字符');
        }
        
        // 验证手机号（可选）
        if (data.phone && typeof data.phone === 'string' && data.phone.trim().length > 0) {
            if (!this.validatePhone(data.phone.trim())) {
                errors.push('请输入有效的手机号码');
            }
        }
        
        const result = {
            isValid: errors.length === 0,
            errors: errors
        };
        
        console.log('[EmailJS Config] 表单验证结果:', result);
        return result;
    },
    
    // 启动状态监控
    startStatusMonitor: function() {
        console.log('[EmailJS Config] 启动状态监控');
        
        // 每30秒检查一次EmailJS状态
        setInterval(() => {
            if (!this.isInitialized && typeof emailjs !== 'undefined') {
                console.warn('[EmailJS Config] 检测到EmailJS未初始化，尝试重新初始化');
                this.init().catch(error => {
                    console.error('[EmailJS Config] 重新初始化失败:', error);
                });
            }
        }, 30000);
        
        // 监听网络状态变化
        window.addEventListener('online', () => {
            console.log('[EmailJS Config] 网络连接恢复，检查EmailJS状态');
            if (!this.isInitialized) {
                this.waitForEmailJS().catch(error => {
                    console.error('[EmailJS Config] 网络恢复后初始化失败:', error);
                });
            }
        });
        
        window.addEventListener('offline', () => {
            console.warn('[EmailJS Config] 网络连接断开');
        });
    },
    
    // 显示初始化错误提示
    showInitializationError: function(error) {
        console.error('[EmailJS Config] 显示初始化错误:', error.message);
        
        // 在控制台显示详细错误信息
        console.group('[EmailJS Config] 初始化错误详情');
        console.error('错误信息:', error.message);
        console.error('页面路径:', window.location.pathname);
        console.error('网络状态:', navigator.onLine ? '在线' : '离线');
        console.error('EmailJS对象:', typeof emailjs !== 'undefined' ? '已加载' : '未加载');
        console.groupEnd();
        
        // 可以在这里添加用户界面提示
        // 例如显示一个小的通知条
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

// DOM加载完成后自动初始化 (增强版)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[EmailJS Config] DOM加载完成，开始自动初始化');
        EmailJSConfig.waitForEmailJS().then(() => {
            console.log('[EmailJS Config] 自动初始化成功');
            // 启动状态监控
            EmailJSConfig.startStatusMonitor();
        }).catch(error => {
            console.error('[EmailJS Config] 自动初始化失败:', error);
            // 显示用户友好的错误提示
            EmailJSConfig.showInitializationError(error);
        });
    });
} else {
    // 如果DOM已经加载完成，立即初始化
    console.log('[EmailJS Config] DOM已加载，立即开始初始化');
    setTimeout(() => {
        EmailJSConfig.waitForEmailJS().then(() => {
            console.log('[EmailJS Config] 立即初始化成功');
            // 启动状态监控
            EmailJSConfig.startStatusMonitor();
        }).catch(error => {
            console.error('[EmailJS Config] 立即初始化失败:', error);
            // 显示用户友好的错误提示
            EmailJSConfig.showInitializationError(error);
        });
    }, 100); // 稍微延迟以确保所有脚本加载完成
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