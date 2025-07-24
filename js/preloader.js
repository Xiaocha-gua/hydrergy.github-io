/**
 * 资源预加载模块
 * 用于预加载关键资源，提升首屏加载速度
 * 版本: 1.0.0
 */

(function() {
    'use strict';

    // 预加载配置
    const PRELOAD_CONFIG = {
        // 关键图片资源
        criticalImages: [
            'images/hydrergy-logo-4.png',
            'images/电解制氢技术与产品-new-1.png',
            'images/电解二氧化碳技术与产品-new-1.png',
            'images/技术咨询服务与数据库-new-1.png',
            'images/邮箱.png',
            'images/电话.png',
            'images/领英.png'
        ],
        
        // 关键CSS文件
        criticalCSS: [
            'css/style.css',
            'css/responsive.css',
            'css/homepage.css'
        ],
        
        // 关键JavaScript文件
        criticalJS: [
            'js/main.js',
            'js/language.js'
        ],
        
        // 预加载超时时间（毫秒）
        timeout: 5000,
        
        // 是否显示加载进度
        showProgress: true
    };

    // 预加载状态
    const preloadState = {
        loadedResources: new Set(),
        failedResources: new Set(),
        totalResources: 0,
        loadedCount: 0,
        isComplete: false,
        startTime: 0
    };

    /**
     * 创建预加载进度指示器
     */
    function createProgressIndicator() {
        if (!PRELOAD_CONFIG.showProgress || document.getElementById('preload-progress')) {
            return null;
        }

        const progressContainer = document.createElement('div');
        progressContainer.id = 'preload-progress';
        progressContainer.innerHTML = `
            <div class="preload-overlay">
                <div class="preload-content">
                    <div class="preload-logo">
                        <img src="images/hydrergy-logo-4.png" alt="HYDRERGY" onerror="this.style.display='none'">
                    </div>
                    <div class="preload-text">正在加载...</div>
                    <div class="preload-bar">
                        <div class="preload-fill" id="preload-fill"></div>
                    </div>
                    <div class="preload-percentage" id="preload-percentage">0%</div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #preload-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.95);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.5s ease-out;
            }
            
            .preload-overlay {
                text-align: center;
            }
            
            .preload-content {
                max-width: 300px;
                padding: 40px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }
            
            .preload-logo img {
                max-width: 120px;
                height: auto;
                margin-bottom: 20px;
            }
            
            .preload-text {
                font-size: 16px;
                color: #333;
                margin-bottom: 20px;
                font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            }
            
            .preload-bar {
                width: 100%;
                height: 6px;
                background: #e9ecef;
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 15px;
            }
            
            .preload-fill {
                height: 100%;
                background: linear-gradient(90deg, #007bff, #0056b3);
                border-radius: 3px;
                transition: width 0.3s ease;
                width: 0%;
            }
            
            .preload-percentage {
                font-size: 14px;
                color: #666;
                font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            }
            
            .preload-fade-out {
                opacity: 0;
                pointer-events: none;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(progressContainer);
        
        return progressContainer;
    }

    /**
     * 更新加载进度
     */
    function updateProgress() {
        if (!PRELOAD_CONFIG.showProgress) {
            return;
        }

        const percentage = Math.round((preloadState.loadedCount / preloadState.totalResources) * 100);
        const fillElement = document.getElementById('preload-fill');
        const percentageElement = document.getElementById('preload-percentage');
        
        if (fillElement) {
            fillElement.style.width = percentage + '%';
        }
        
        if (percentageElement) {
            percentageElement.textContent = percentage + '%';
        }
    }

    /**
     * 隐藏进度指示器
     */
    function hideProgressIndicator() {
        const progressElement = document.getElementById('preload-progress');
        if (progressElement) {
            progressElement.classList.add('preload-fade-out');
            setTimeout(() => {
                progressElement.remove();
            }, 500);
        }
    }

    /**
     * 预加载图片
     */
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            const timeoutId = setTimeout(() => {
                reject(new Error(`Image preload timeout: ${src}`));
            }, PRELOAD_CONFIG.timeout);
            
            img.onload = () => {
                clearTimeout(timeoutId);
                preloadState.loadedResources.add(src);
                resolve(src);
            };
            
            img.onerror = () => {
                clearTimeout(timeoutId);
                preloadState.failedResources.add(src);
                reject(new Error(`Image preload failed: ${src}`));
            };
            
            img.src = src;
        });
    }

    /**
     * 预加载CSS文件
     */
    function preloadCSS(href) {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载
            const existingLink = document.querySelector(`link[href="${href}"]`);
            if (existingLink) {
                preloadState.loadedResources.add(href);
                resolve(href);
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            
            const timeoutId = setTimeout(() => {
                reject(new Error(`CSS preload timeout: ${href}`));
            }, PRELOAD_CONFIG.timeout);
            
            link.onload = () => {
                clearTimeout(timeoutId);
                preloadState.loadedResources.add(href);
                resolve(href);
            };
            
            link.onerror = () => {
                clearTimeout(timeoutId);
                preloadState.failedResources.add(href);
                reject(new Error(`CSS preload failed: ${href}`));
            };
            
            document.head.appendChild(link);
        });
    }

    /**
     * 预加载JavaScript文件
     */
    function preloadJS(src) {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                preloadState.loadedResources.add(src);
                resolve(src);
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = src;
            
            const timeoutId = setTimeout(() => {
                reject(new Error(`JS preload timeout: ${src}`));
            }, PRELOAD_CONFIG.timeout);
            
            link.onload = () => {
                clearTimeout(timeoutId);
                preloadState.loadedResources.add(src);
                resolve(src);
            };
            
            link.onerror = () => {
                clearTimeout(timeoutId);
                preloadState.failedResources.add(src);
                reject(new Error(`JS preload failed: ${src}`));
            };
            
            document.head.appendChild(link);
        });
    }

    /**
     * 预加载单个资源
     */
    function preloadResource(resource, type) {
        let promise;
        
        switch (type) {
            case 'image':
                promise = preloadImage(resource);
                break;
            case 'css':
                promise = preloadCSS(resource);
                break;
            case 'js':
                promise = preloadJS(resource);
                break;
            default:
                promise = Promise.reject(new Error(`Unknown resource type: ${type}`));
        }
        
        return promise
            .then(result => {
                preloadState.loadedCount++;
                updateProgress();
                console.log(`Preloaded ${type}:`, resource);
                return result;
            })
            .catch(error => {
                preloadState.loadedCount++;
                updateProgress();
                console.warn(`Failed to preload ${type}:`, resource, error.message);
                return null;
            });
    }

    /**
     * 开始预加载所有资源
     */
    function startPreloading() {
        preloadState.startTime = performance.now();
        
        // 计算总资源数
        preloadState.totalResources = 
            PRELOAD_CONFIG.criticalImages.length +
            PRELOAD_CONFIG.criticalCSS.length +
            PRELOAD_CONFIG.criticalJS.length;
        
        if (preloadState.totalResources === 0) {
            completePreloading();
            return;
        }
        
        console.log(`Starting preload of ${preloadState.totalResources} resources`);
        
        // 创建进度指示器
        createProgressIndicator();
        
        // 预加载所有资源
        const promises = [
            ...PRELOAD_CONFIG.criticalImages.map(img => preloadResource(img, 'image')),
            ...PRELOAD_CONFIG.criticalCSS.map(css => preloadResource(css, 'css')),
            ...PRELOAD_CONFIG.criticalJS.map(js => preloadResource(js, 'js'))
        ];
        
        // 等待所有资源加载完成（或失败）
        Promise.allSettled(promises)
            .then(() => {
                completePreloading();
            });
    }

    /**
     * 完成预加载
     */
    function completePreloading() {
        if (preloadState.isComplete) {
            return;
        }
        
        preloadState.isComplete = true;
        const loadTime = performance.now() - preloadState.startTime;
        
        console.log(`Preloading completed in ${loadTime.toFixed(2)}ms`);
        console.log(`Loaded: ${preloadState.loadedResources.size}, Failed: ${preloadState.failedResources.size}`);
        
        // 延迟隐藏进度指示器，让用户看到100%
        setTimeout(() => {
            hideProgressIndicator();
            
            // 触发预加载完成事件
            const event = new CustomEvent('preloadComplete', {
                detail: {
                    loadTime: loadTime,
                    loadedCount: preloadState.loadedResources.size,
                    failedCount: preloadState.failedResources.size,
                    totalCount: preloadState.totalResources
                }
            });
            
            document.dispatchEvent(event);
        }, 300);
    }

    /**
     * 获取预加载统计信息
     */
    function getStats() {
        return {
            isComplete: preloadState.isComplete,
            totalResources: preloadState.totalResources,
            loadedCount: preloadState.loadedResources.size,
            failedCount: preloadState.failedResources.size,
            loadedResources: Array.from(preloadState.loadedResources),
            failedResources: Array.from(preloadState.failedResources)
        };
    }

    /**
     * 初始化预加载器
     */
    function init() {
        // 只在首页启用预加载
        const currentPath = window.location.pathname;
        const isHomePage = currentPath === '/' || 
                          currentPath.endsWith('/index.html') || 
                          currentPath.endsWith('/index-en.html') ||
                          currentPath === '';
        
        if (!isHomePage) {
            console.log('Preloader: Not on homepage, skipping preload');
            return;
        }
        
        console.log('Preloader: Initializing');
        startPreloading();
    }

    /**
     * 自动初始化
     */
    function autoInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    // 导出API
    window.Preloader = {
        init: init,
        getStats: getStats,
        config: PRELOAD_CONFIG
    };

    // 自动初始化
    autoInit();

})();