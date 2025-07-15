// EmailJS功能测试脚本
// 用于诊断EmailJS在不同页面的工作状态

class EmailJSTestSuite {
    constructor() {
        this.testResults = [];
        this.currentPage = window.location.pathname;
        console.log(`[EmailJS Test] 开始测试页面: ${this.currentPage}`);
    }

    // 测试EmailJS基础环境
    testEmailJSEnvironment() {
        const test = {
            name: 'EmailJS环境检查',
            page: this.currentPage,
            timestamp: new Date().toISOString(),
            results: {}
        };

        // 检查EmailJS CDN是否加载
        test.results.emailjsCDN = {
            loaded: typeof emailjs !== 'undefined',
            version: typeof emailjs !== 'undefined' ? emailjs.version || 'unknown' : null,
            status: typeof emailjs !== 'undefined' ? 'success' : 'failed'
        };

        // 检查EmailJSConfig模块是否加载
        test.results.emailjsConfig = {
            loaded: typeof window.EmailJSConfig !== 'undefined',
            initialized: window.EmailJSConfig ? window.EmailJSConfig.isInitialized : false,
            status: (typeof window.EmailJSConfig !== 'undefined' && window.EmailJSConfig.isInitialized) ? 'success' : 'failed'
        };

        // 检查网络状态
        test.results.network = {
            online: navigator.onLine,
            status: navigator.onLine ? 'success' : 'failed'
        };

        this.testResults.push(test);
        return test;
    }

    // 测试DOM元素
    testDOMElements() {
        const test = {
            name: 'DOM元素检查',
            page: this.currentPage,
            timestamp: new Date().toISOString(),
            results: {}
        };

        const requiredElements = [
            'messageBtn',
            'messageModal', 
            'messageForm',
            'userName',
            'userPhone',
            'userEmail',
            'userMessage'
        ];

        requiredElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            test.results[elementId] = {
                exists: !!element,
                visible: element ? window.getComputedStyle(element).display !== 'none' : false,
                status: !!element ? 'success' : 'failed'
            };
        });

        this.testResults.push(test);
        return test;
    }

    // 测试表单验证功能
    testFormValidation() {
        const test = {
            name: '表单验证功能检查',
            page: this.currentPage,
            timestamp: new Date().toISOString(),
            results: {}
        };

        if (window.EmailJSConfig) {
            // 测试邮箱验证
            const testEmails = [
                { email: 'test@example.com', expected: true },
                { email: 'invalid-email', expected: false },
                { email: '', expected: false }
            ];

            test.results.emailValidation = testEmails.map(testCase => {
                try {
                    const result = window.EmailJSConfig.validateEmail(testCase.email);
                    return {
                        input: testCase.email,
                        expected: testCase.expected,
                        actual: result,
                        status: result === testCase.expected ? 'success' : 'failed'
                    };
                } catch (error) {
                    return {
                        input: testCase.email,
                        expected: testCase.expected,
                        actual: null,
                        error: error.message,
                        status: 'error'
                    };
                }
            });

            // 测试手机号验证
            const testPhones = [
                { phone: '13800138000', expected: true },
                { phone: '1380013800', expected: false },
                { phone: '', expected: false }
            ];

            test.results.phoneValidation = testPhones.map(testCase => {
                try {
                    const result = window.EmailJSConfig.validatePhone(testCase.phone);
                    return {
                        input: testCase.phone,
                        expected: testCase.expected,
                        actual: result,
                        status: result === testCase.expected ? 'success' : 'failed'
                    };
                } catch (error) {
                    return {
                        input: testCase.phone,
                        expected: testCase.expected,
                        actual: null,
                        error: error.message,
                        status: 'error'
                    };
                }
            });
        } else {
            test.results.error = 'EmailJSConfig未加载，无法测试验证功能';
        }

        this.testResults.push(test);
        return test;
    }

    // 测试EmailJS配置
    testEmailJSConfiguration() {
        const test = {
            name: 'EmailJS配置检查',
            page: this.currentPage,
            timestamp: new Date().toISOString(),
            results: {}
        };

        if (window.EmailJSConfig) {
            const config = window.EmailJSConfig;
            test.results.configuration = {
                publicKey: config.publicKey ? '已配置' : '未配置',
                serviceId: config.serviceId ? '已配置' : '未配置',
                templateId: config.templateId ? '已配置' : '未配置',
                recipientEmail: config.recipientEmail ? '已配置' : '未配置',
                status: (config.publicKey && config.serviceId && config.templateId && config.recipientEmail) ? 'success' : 'failed'
            };
        } else {
            test.results.error = 'EmailJSConfig未加载';
            test.results.status = 'failed';
        }

        this.testResults.push(test);
        return test;
    }

    // 运行所有测试
    async runAllTests() {
        console.log(`[EmailJS Test] 开始完整测试 - 页面: ${this.currentPage}`);
        
        const environmentTest = this.testEmailJSEnvironment();
        console.log('[EmailJS Test] 环境检查:', environmentTest);
        
        const domTest = this.testDOMElements();
        console.log('[EmailJS Test] DOM检查:', domTest);
        
        const validationTest = this.testFormValidation();
        console.log('[EmailJS Test] 验证功能检查:', validationTest);
        
        const configTest = this.testEmailJSConfiguration();
        console.log('[EmailJS Test] 配置检查:', configTest);
        
        // 生成测试报告
        const report = this.generateReport();
        console.log('[EmailJS Test] 测试报告:', report);
        
        return report;
    }

    // 生成测试报告
    generateReport() {
        const report = {
            page: this.currentPage,
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: this.testResults.length,
                passed: 0,
                failed: 0,
                errors: 0
            },
            details: this.testResults,
            recommendations: []
        };

        // 统计测试结果
        this.testResults.forEach(test => {
            if (test.results.status === 'success') {
                report.summary.passed++;
            } else if (test.results.status === 'failed') {
                report.summary.failed++;
            } else {
                report.summary.errors++;
            }
        });

        // 生成建议
        if (report.summary.failed > 0 || report.summary.errors > 0) {
            report.recommendations.push('发现问题，建议检查控制台错误信息');
            
            // 检查具体问题
            const envTest = this.testResults.find(t => t.name === 'EmailJS环境检查');
            if (envTest && !envTest.results.emailjsCDN.loaded) {
                report.recommendations.push('EmailJS CDN未正确加载，请检查网络连接');
            }
            if (envTest && !envTest.results.emailjsConfig.loaded) {
                report.recommendations.push('EmailJSConfig模块未加载，请检查文件路径');
            }
            
            const domTest = this.testResults.find(t => t.name === 'DOM元素检查');
            if (domTest) {
                Object.keys(domTest.results).forEach(elementId => {
                    if (!domTest.results[elementId].exists) {
                        report.recommendations.push(`缺少必要的DOM元素: ${elementId}`);
                    }
                });
            }
        } else {
            report.recommendations.push('所有测试通过，EmailJS功能应该正常工作');
        }

        return report;
    }

    // 显示测试结果到页面
    displayResults() {
        const report = this.generateReport();
        
        // 创建结果显示区域
        const resultDiv = document.createElement('div');
        resultDiv.id = 'emailjs-test-results';
        resultDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            max-height: 500px;
            overflow-y: auto;
            background: white;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
        `;
        
        const statusColor = report.summary.failed === 0 && report.summary.errors === 0 ? '#28a745' : '#dc3545';
        
        resultDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; color: ${statusColor};">EmailJS测试结果</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">关闭</button>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>页面:</strong> ${report.page}<br>
                <strong>时间:</strong> ${new Date(report.timestamp).toLocaleString()}
            </div>
            <div style="margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                <strong>测试摘要:</strong><br>
                总计: ${report.summary.totalTests} | 
                <span style="color: #28a745;">通过: ${report.summary.passed}</span> | 
                <span style="color: #dc3545;">失败: ${report.summary.failed}</span> | 
                <span style="color: #ffc107;">错误: ${report.summary.errors}</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>建议:</strong><br>
                ${report.recommendations.map(rec => `• ${rec}`).join('<br>')}
            </div>
            <details>
                <summary style="cursor: pointer; font-weight: bold;">详细结果</summary>
                <pre style="background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 10px;">${JSON.stringify(report.details, null, 2)}</pre>
            </details>
        `;
        
        // 移除之前的结果
        const existingResult = document.getElementById('emailjs-test-results');
        if (existingResult) {
            existingResult.remove();
        }
        
        document.body.appendChild(resultDiv);
    }
}

// 自动运行测试（如果页面已加载完成）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            const tester = new EmailJSTestSuite();
            tester.runAllTests().then(() => {
                tester.displayResults();
            });
        }, 2000); // 等待2秒确保所有脚本加载完成
    });
} else {
    setTimeout(() => {
        const tester = new EmailJSTestSuite();
        tester.runAllTests().then(() => {
            tester.displayResults();
        });
    }, 1000);
}

// 导出到全局作用域，方便手动调用
window.EmailJSTestSuite = EmailJSTestSuite;

// 添加快捷测试函数
window.testEmailJS = function() {
    const tester = new EmailJSTestSuite();
    tester.runAllTests().then(() => {
        tester.displayResults();
    });
};

console.log('[EmailJS Test] 测试脚本已加载，可以调用 testEmailJS() 进行手动测试');