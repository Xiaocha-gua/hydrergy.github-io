// Web3Forms统一配置模块
// 替代EmailJS的免费邮件发送服务

const Web3FormsConfig = {
    // Web3Forms配置
    accessKey: '39b05b6a-5db9-4676-8fea-e59bec4ca71c', // Web3Forms Access Key
    recipientEmail: 'qiuzt@carbonxtech.com.cn',
    apiEndpoint: 'https://api.web3forms.com/submit',
    
    // 初始化Web3Forms
    init: function() {
        console.log('[Web3Forms Config] 初始化成功');
        return Promise.resolve();
    },
    
    // 发送邮件
    sendEmail: function(data) {
        if (!this.validateFormData(data)) {
            return Promise.reject(new Error('表单数据验证失败'));
        }
        
        console.log('[Web3Forms Config] 发送邮件数据:', {
            name: data.name,
            email: data.email,
            subject: data.subject || '网站留言',
            message: data.message
        });
        
        // 构建表单数据
        const formData = new FormData();
        formData.append('access_key', this.accessKey);
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('subject', data.subject || '网站留言');
        formData.append('message', data.message);
        formData.append('from_name', 'HYDRERGY网站');
        formData.append('to', this.recipientEmail);
        
        // 添加蜜罐字段防止垃圾邮件
        formData.append('botcheck', '');
        
        return fetch(this.apiEndpoint, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('[Web3Forms Config] 邮件发送成功:', result);
            return result;
        })
        .catch(error => {
            console.error('[Web3Forms Config] 邮件发送失败:', error);
            
            // 错误处理
            let errorMessage = '邮件发送失败，请稍后重试';
            if (error.message.includes('400')) {
                errorMessage = '表单数据格式错误';
            } else if (error.message.includes('403')) {
                errorMessage = '访问被拒绝，请检查配置';
            } else if (error.message.includes('429')) {
                errorMessage = '发送频率过高，请稍后重试';
            } else if (error.message.includes('network')) {
                errorMessage = '网络连接异常，请检查网络';
            }
            
            throw new Error(errorMessage);
        });
    },
    
    // 验证邮箱格式
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // 验证电话格式
    validatePhone: function(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone);
    },
    
    // 验证表单数据
    validateFormData: function(data) {
        if (!data.name || data.name.trim().length < 2) {
            return { valid: false, message: '请输入有效的姓名（至少2个字符）' };
        }
        
        if (!data.email || !this.validateEmail(data.email)) {
            return { valid: false, message: '请输入有效的邮箱地址' };
        }
        
        if (!data.message || data.message.trim().length < 10) {
            return { valid: false, message: '请输入详细的留言内容（至少10个字符）' };
        }
        
        if (data.phone && !this.validatePhone(data.phone)) {
            return { valid: false, message: '请输入有效的电话号码' };
        }
        
        return { valid: true };
    },
    
    // 获取配置信息
    getConfig: function() {
        return {
            accessKey: this.accessKey,
            recipientEmail: this.recipientEmail,
            apiEndpoint: this.apiEndpoint
        };
    }
};

// DOM加载完成后自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        Web3FormsConfig.init().catch(error => {
            console.error('[Web3Forms Config] 自动初始化失败:', error);
        });
    });
} else {
    Web3FormsConfig.init().catch(error => {
        console.error('[Web3Forms Config] 自动初始化失败:', error);
    });
}

// 导出到全局作用域
window.Web3FormsConfig = Web3FormsConfig;

// 兼容性函数，保持与原有代码的兼容
window.sendEmailNotification = function(data) {
    return Web3FormsConfig.init().then(() => {
        return Web3FormsConfig.sendEmail(data);
    });
};

console.log('[Web3Forms Config] 模块加载完成');