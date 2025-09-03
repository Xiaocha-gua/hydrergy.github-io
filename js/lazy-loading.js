/**
 * 图片懒加载模块
 * 使用Intersection Observer API实现高性能的图片懒加载
 * 版本: 1.0.0
 */

(function() {
    'use strict';

    // 懒加载配置
    const LAZY_CONFIG = {
        // 提前加载距离（像素）
        rootMargin: '50px 0px',
        // 可见度阈值
        threshold: 0.01,
        // 加载失败重试次数
        maxRetries: 3,
        // 加载超时时间（毫秒）
        timeout: 10000,
        // 占位符图片（可选）
        placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'
    };

    // 懒加载状态管理
    const lazyState = {
        observer: null,
        loadingImages: new Set(),
        failedImages: new Map(),
        isSupported: false
    };

    /**
     * 检查浏览器支持
     */
    function checkSupport() {
        lazyState.isSupported = 'IntersectionObserver' in window &&
                               'IntersectionObserverEntry' in window &&
                               'intersectionRatio' in window.IntersectionObserverEntry.prototype;
        
        if (!lazyState.isSupported) {
            console.warn('LazyLoading: IntersectionObserver not supported, falling back to immediate loading');
        }
        
        return lazyState.isSupported;
    }

    /**
     * 创建加载动画元素
     */
    function createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'lazy-loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-ring"></div>
        `;
        return spinner;
    }

    /**
     * 添加懒加载样式
     */
    function addLazyStyles() {
        if (document.getElementById('lazy-loading-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'lazy-loading-styles';
        style.textContent = `
            .lazy-image {
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                background-color: #f8f9fa;
            }
            
            .lazy-image.loaded {
                opacity: 1;
            }
            
            .lazy-image.error {
                opacity: 1;
                background-color: #f8d7da;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dc3545'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: center;
                background-size: 48px 48px;
            }
            
            .lazy-loading-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
            }
            
            .spinner-ring {
                display: inline-block;
                width: 40px;
                height: 40px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #007bff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .lazy-container {
                position: relative;
                display: inline-block;
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * 加载图片
     */
    function loadImage(img, src) {
        return new Promise((resolve, reject) => {
            // 防止重复加载
            if (lazyState.loadingImages.has(img)) {
                return;
            }
            
            lazyState.loadingImages.add(img);
            
            // 创建新的图片对象进行预加载
            const imageLoader = new Image();
            
            // 设置超时
            const timeoutId = setTimeout(() => {
                reject(new Error('Image loading timeout'));
            }, LAZY_CONFIG.timeout);
            
            imageLoader.onload = () => {
                clearTimeout(timeoutId);
                lazyState.loadingImages.delete(img);
                
                // 设置实际图片源
                img.src = src;
                img.classList.add('loaded');
                img.classList.remove('lazy-image');
                
                // 移除加载动画
                const spinner = img.parentNode.querySelector('.lazy-loading-spinner');
                if (spinner) {
                    spinner.remove();
                }
                
                resolve(img);
            };
            
            imageLoader.onerror = () => {
                clearTimeout(timeoutId);
                lazyState.loadingImages.delete(img);
                reject(new Error('Image loading failed'));
            };
            
            // 开始加载
            imageLoader.src = src;
        });
    }

    /**
     * 处理图片加载失败
     */
    function handleImageError(img, src) {
        const retryCount = lazyState.failedImages.get(img) || 0;
        
        if (retryCount < LAZY_CONFIG.maxRetries) {
            // 重试加载
            lazyState.failedImages.set(img, retryCount + 1);
            
            setTimeout(() => {
                console.log(`LazyLoading: Retrying image load (${retryCount + 1}/${LAZY_CONFIG.maxRetries}):`, src);
                loadImage(img, src).catch(error => {
                    handleImageError(img, src);
                });
            }, 1000 * (retryCount + 1)); // 递增延迟
        } else {
            // 标记为错误状态
            img.classList.add('error');
            img.classList.remove('lazy-image');
            
            // 移除加载动画
            const spinner = img.parentNode.querySelector('.lazy-loading-spinner');
            if (spinner) {
                spinner.remove();
            }
            
            console.error('LazyLoading: Failed to load image after retries:', src);
        }
    }

    /**
     * 处理图片进入视口
     */
    function handleImageIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                
                if (src) {
                    // 添加加载动画
                    if (img.parentNode && !img.parentNode.querySelector('.lazy-loading-spinner')) {
                        const container = img.parentNode;
                        if (!container.classList.contains('lazy-container')) {
                            container.classList.add('lazy-container');
                        }
                        container.appendChild(createLoadingSpinner());
                    }
                    
                    // 开始加载图片
                    loadImage(img, src)
                        .then(() => {
                            console.log('LazyLoading: Image loaded successfully:', src);
                        })
                        .catch(error => {
                            console.error('LazyLoading: Image loading failed:', src, error);
                            handleImageError(img, src);
                        });
                    
                    // 停止观察这个图片
                    observer.unobserve(img);
                }
            }
        });
    }

    /**
     * 初始化懒加载观察器
     */
    function initObserver() {
        if (!checkSupport()) {
            // 不支持时立即加载所有图片
            fallbackLoading();
            return;
        }
        
        lazyState.observer = new IntersectionObserver(
            handleImageIntersection,
            {
                rootMargin: LAZY_CONFIG.rootMargin,
                threshold: LAZY_CONFIG.threshold
            }
        );
    }

    /**
     * 降级处理：立即加载所有图片
     */
    function fallbackLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            const src = img.dataset.src;
            if (src) {
                img.src = src;
                img.classList.add('loaded');
                img.classList.remove('lazy-image');
            }
        });
    }

    /**
     * 观察图片元素
     */
    function observeImages() {
        if (!lazyState.observer) {
            return;
        }
        
        const lazyImages = document.querySelectorAll('img[data-src]:not(.loaded):not(.error)');
        lazyImages.forEach(img => {
            // 添加懒加载样式类
            img.classList.add('lazy-image');
            
            // 设置占位符
            if (!img.src && LAZY_CONFIG.placeholder) {
                img.src = LAZY_CONFIG.placeholder;
            }
            
            // 开始观察
            lazyState.observer.observe(img);
        });
        
        console.log(`LazyLoading: Observing ${lazyImages.length} images`);
    }

    /**
     * 刷新懒加载（用于动态添加的图片）
     */
    function refresh() {
        observeImages();
    }

    /**
     * 销毁懒加载
     */
    function destroy() {
        if (lazyState.observer) {
            lazyState.observer.disconnect();
            lazyState.observer = null;
        }
        
        lazyState.loadingImages.clear();
        lazyState.failedImages.clear();
    }

    /**
     * 初始化懒加载
     */
    function init() {
        // 添加样式
        addLazyStyles();
        
        // 初始化观察器
        initObserver();
        
        // 开始观察图片
        observeImages();
        
        console.log('LazyLoading: Initialized');
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
    window.LazyLoading = {
        init: init,
        refresh: refresh,
        destroy: destroy,
        config: LAZY_CONFIG
    };

    // 自动初始化
    autoInit();

})();