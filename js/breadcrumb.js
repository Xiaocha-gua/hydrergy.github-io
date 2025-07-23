/* 面包屑导航功能脚本 */
/* 作者：HYDRERGY 开发团队 */
/* 创建时间：2025年1月 */
/* 用途：动态生成面包屑导航，处理滚动悬浮效果和多语言支持 */

// 面包屑导航配置
const breadcrumbConfig = {
    // 页面路径映射
    pathMap: {
        '/': {
            zh: '首页',
            en: 'Home'
        },
        '/index.html': {
            zh: '首页',
            en: 'Home'
        },
        '/index-en.html': {
            zh: '首页',
            en: 'Home'
        },
        '/business': {
            zh: '业务领域',
            en: 'Business Areas'
        },
        '/pages/contact.html': {
            zh: '联系我们',
            en: 'Contact Us'
        },
        '/pages/business/hydrogen.html': {
            zh: '电解制氢技术与产品',
            en: 'Water Electrolysis Technology & Products'
        },
        '/pages/business/co2.html': {
            zh: '电解二氧化碳技术与产品',
            en: 'CO2 Electrolysis Technology & Products'
        },
        '/pages/business/consulting.html': {
            zh: '技术咨询服务',
            en: 'Technical Consulting Services'
        },
        '/pages/business/database-service.html': {
            zh: '专业数据库服务',
            en: 'Professional Database Services'
        },
        '/pages/business/lca-service.html': {
            zh: '生命周期评估服务',
            en: 'Life Cycle Assessment Services'
        },
        '/pages/business/tea-service.html': {
            zh: '技术经济分析服务',
            en: 'Techno-Economic Analysis Services'
        },
        '/pages/business/zsm-membrane.html': {
            zh: '电解水制氢用复合隔膜 Hydrergy ZSM',
            en: 'Composite Membrane for Water Electrolysis Hydrergy ZSM'
        },
        '/pages/business/anion-membrane.html': {
            zh: '电解水制氢用阴离子交换膜',
            en: 'Anion Exchange Membrane for Water Electrolysis'
        },
        '/pages/business/bench-water-electrolysis.html': {
            zh: '台架式电解水制氢系统',
            en: 'Bench-type Water Electrolysis Hydrogen Production System'
        },
        '/pages/business/desktop-water-electrolysis.html': {
            zh: '桌面式电解水测试设备',
            en: 'Desktop Water Electrolysis Test Equipment'
        },
        '/pages/business/multi-channel-water-electrolysis.html': {
            zh: '多通道电解水测试系统',
            en: 'Multi-channel Water Electrolysis Test System'
        },
        '/pages/business/co2-electrolysis-system.html': {
            zh: '电解二氧化碳系统',
            en: 'CO2 Electrolysis System'
        },
        // 英文版本页面路径映射
        '/pages/contact-en.html': {
            zh: '联系我们',
            en: 'Contact Us'
        },
        '/pages/business/hydrogen-en.html': {
            zh: '电解制氢技术与产品',
            en: 'Water Electrolysis Technology & Products'
        },
        '/pages/business/co2-en.html': {
            zh: '电解二氧化碳技术与产品',
            en: 'CO2 Electrolysis Technology & Products'
        },
        '/pages/business/consulting-en.html': {
            zh: '技术咨询服务',
            en: 'Technical Consulting Services'
        },
        '/pages/business/database-service-en.html': {
            zh: '专业数据库服务',
            en: 'Professional Database Services'
        },
        '/pages/business/lca-service-en.html': {
            zh: '生命周期评估服务',
            en: 'Life Cycle Assessment Services'
        },
        '/pages/business/tea-service-en.html': {
            zh: '技术经济分析服务',
            en: 'Techno-Economic Analysis Services'
        },
        '/pages/business/zsm-membrane-en.html': {
            zh: '电解水制氢用复合隔膜 Hydrergy ZSM',
            en: 'Composite Membrane for Water Electrolysis Hydrergy ZSM'
        },
        '/pages/business/anion-membrane-en.html': {
            zh: '电解水制氢用阴离子交换膜',
            en: 'Anion Exchange Membrane for Water Electrolysis'
        },
        '/pages/business/bench-water-electrolysis-en.html': {
            zh: '台架式电解水制氢系统',
            en: 'Bench-type Water Electrolysis Hydrogen Production System'
        },
        '/pages/business/desktop-water-electrolysis-en.html': {
            zh: '桌面式电解水测试设备',
            en: 'Desktop Water Electrolysis Test Equipment'
        },
        '/pages/business/multi-channel-water-electrolysis-en.html': {
            zh: '多通道电解水测试系统',
            en: 'Multi-channel Water Electrolysis Test System'
        },
        '/pages/business/co2-electrolysis-system-en.html': {
            zh: '电解二氧化碳系统',
            en: 'CO2 Electrolysis System'
        }
    },
    
    // 父级路径映射
    parentMap: {
        '/pages/contact.html': '/',
        '/pages/business/hydrogen.html': '/business',
        '/pages/business/co2.html': '/business',
        '/pages/business/consulting.html': '/business',
        '/pages/business/database-service.html': '/pages/business/consulting.html',
        '/pages/business/lca-service.html': '/pages/business/consulting.html',
        '/pages/business/tea-service.html': '/pages/business/consulting.html',
        '/pages/business/zsm-membrane.html': '/pages/business/hydrogen.html',
        '/pages/business/anion-membrane.html': '/pages/business/hydrogen.html',
        '/pages/business/bench-water-electrolysis.html': '/pages/business/hydrogen.html',
        '/pages/business/desktop-water-electrolysis.html': '/pages/business/hydrogen.html',
        '/pages/business/multi-channel-water-electrolysis.html': '/pages/business/hydrogen.html',
        '/pages/business/co2-electrolysis-system.html': '/pages/business/co2.html',
        '/business': '/',
        // 英文版本页面父级路径映射
        '/pages/contact-en.html': '/',
        '/pages/business/hydrogen-en.html': '/business',
        '/pages/business/co2-en.html': '/business',
        '/pages/business/consulting-en.html': '/business',
        '/pages/business/database-service-en.html': '/pages/business/consulting-en.html',
        '/pages/business/lca-service-en.html': '/pages/business/consulting-en.html',
        '/pages/business/tea-service-en.html': '/pages/business/consulting-en.html',
        '/pages/business/zsm-membrane-en.html': '/pages/business/hydrogen-en.html',
        '/pages/business/anion-membrane-en.html': '/pages/business/hydrogen-en.html',
        '/pages/business/bench-water-electrolysis-en.html': '/pages/business/hydrogen-en.html',
        '/pages/business/desktop-water-electrolysis-en.html': '/pages/business/hydrogen-en.html',
        '/pages/business/multi-channel-water-electrolysis-en.html': '/pages/business/hydrogen-en.html',
        '/pages/business/co2-electrolysis-system-en.html': '/pages/business/co2-en.html'
    }
};

// 面包屑导航类
class BreadcrumbNavigation {
    constructor() {
        console.log('初始化面包屑导航');
        this.container = null;
        this.currentLanguage = 'zh';
        this.isSticky = false;
        
        // 检测语言
        this.detectCurrentLanguage();
        
        // 初始化容器
        this.createBreadcrumbContainer();
        
        // 生成面包屑导航
        this.generateBreadcrumb();
        
        // 设置语言监听
        this.setupLanguageListener();
        
        // 添加body类
        this.addBodyClass();
    }
    
    // 初始化
    init() {
        // 首先检测当前语言
        this.detectCurrentLanguage();
        
        // 创建面包屑容器
        this.createBreadcrumbContainer();
        
        // 生成面包屑导航
        this.generateBreadcrumb();
        
        // 设置语言监听
        this.setupLanguageListener();
        
        // 添加body类
        this.addBodyClass();
        
        // 立即从localStorage检查语言设置
        const savedLanguage = localStorage.getItem('website-language');
        if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en') && savedLanguage !== this.currentLanguage) {
            console.log('面包屑导航：初始化时从localStorage获取语言设置:', savedLanguage);
            this.currentLanguage = savedLanguage;
            this.generateBreadcrumb();
        }
    }
    
    // 创建面包屑容器
    createBreadcrumbContainer() {
        // 检查是否已存在
        const existingContainer = document.querySelector('.breadcrumb-container');
        if (existingContainer) {
            console.log('面包屑导航：容器已存在，使用现有容器');
            this.container = existingContainer;
            return;
        }
        
        console.log('面包屑导航：创建新容器');
        // 创建容器
        this.container = document.createElement('div');
        this.container.className = 'breadcrumb-container';
        this.container.style.display = 'block'; // 确保容器显示
        
        // 插入到顶部通栏后面
        const topBar = document.querySelector('.top-bar');
        if (topBar && topBar.parentNode) {
            console.log('面包屑导航：插入到顶部通栏后面');
            topBar.parentNode.insertBefore(this.container, topBar.nextSibling);
        } else {
            // 如果找不到顶部通栏，插入到body开头
            console.log('面包屑导航：插入到body开头');
            document.body.insertBefore(this.container, document.body.firstChild);
        }
    }
    
    // 生成面包屑导航
    generateBreadcrumb() {
        if (!this.container) {
            console.error('面包屑导航：容器不存在');
            return;
        }
        
        const currentPath = this.getCurrentPath();
        console.log('面包屑导航：当前路径:', currentPath, '当前页面路径:', window.location.pathname);
        
        // 如果是首页，不显示面包屑
        if (currentPath === '/' || currentPath === '/index.html' || currentPath === '' || 
            window.location.pathname === '/' || window.location.pathname === '/index.html') {
            console.log('面包屑导航：当前是首页，不显示面包屑');
            this.container.style.display = 'none';
            return;
        }
        
        // 确保面包屑导航显示
        this.container.style.display = 'block';
        console.log('面包屑导航：生成面包屑导航，当前路径:', currentPath);
        const breadcrumbItems = this.buildBreadcrumbItems(currentPath);
        
        // 如果没有面包屑项目，不显示面包屑
        if (!breadcrumbItems || breadcrumbItems.length === 0) {
            console.log('面包屑导航：没有面包屑项目，不显示面包屑');
            this.container.style.display = 'none';
            return;
        }
        
        // 创建面包屑HTML
        const containerDiv = document.createElement('div');
        containerDiv.className = 'container';
        
        const breadcrumbOl = document.createElement('ol');
        breadcrumbOl.className = 'breadcrumb';
        
        breadcrumbItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'breadcrumb-item';
            
            if (index === breadcrumbItems.length - 1) {
                // 最后一项（当前页面）
                li.classList.add('active');
                li.innerHTML = `<span>${item.text}</span>`;
            } else if (!item.href) {
                // 中间层级（如'业务领域'）不可点击
                li.innerHTML = `<span>${item.text}</span>`;
                
                // 添加分隔符
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.innerHTML = '>';
                li.appendChild(separator);
            } else {
                // 链接项
                li.innerHTML = `<a href="${item.href}">${item.text}</a>`;
                
                // 添加分隔符
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.innerHTML = '>';
                li.appendChild(separator);
            }
            
            breadcrumbOl.appendChild(li);
        });
        
        containerDiv.appendChild(breadcrumbOl);
        this.container.innerHTML = '';
        this.container.appendChild(containerDiv);
    }
    
    // 获取当前路径
    getCurrentPath() {
        let path = window.location.pathname;
        
        // 处理根路径
        if (path === '/' || path === '' || path.endsWith('/')) {
            return '/';
        }
        
        // 移除可能的项目路径前缀，但保持完整的相对路径结构
        // 处理类似 /Lin_Lab_new/公司相关/SEO优化/网页-实时更新/ 这样的前缀
        const pathSegments = path.split('/');
        let cleanPath = '';
        let foundStart = false;
        
        for (let i = 0; i < pathSegments.length; i++) {
            const segment = pathSegments[i];
            // 如果找到pages、index.html或index-en.html，说明这是我们需要的路径开始
            if (segment === 'pages' || segment === 'index.html' || segment === 'index-en.html' || foundStart) {
                foundStart = true;
                if (segment) {
                    cleanPath += '/' + segment;
                }
            }
        }
        
        // 如果没有找到标准路径，使用原始路径
        if (!foundStart) {
            cleanPath = path;
        }
        
        // 确保以/开头
        if (!cleanPath.startsWith('/')) {
            cleanPath = '/' + cleanPath;
        }
        
        console.log('面包屑导航：原始路径:', path, '-> 清理后路径:', cleanPath);
        return cleanPath;
    }
    
    // 构建面包屑项目
    buildBreadcrumbItems(currentPath) {
        const items = [];
        const pathConfig = breadcrumbConfig.pathMap[currentPath];
        
        if (!pathConfig) {
            // 如果没有配置，只显示首页
            items.push({
                text: breadcrumbConfig.pathMap['/'][this.currentLanguage],
                href: this.getRelativePath('/')
            });
            console.log('面包屑导航：未找到路径配置，当前路径:', currentPath, '只显示首页');
            console.log('面包屑导航：可用路径配置:', Object.keys(breadcrumbConfig.pathMap));
            return items;
        }
        
        // 构建路径链
        const pathChain = this.buildPathChain(currentPath);
        console.log('面包屑导航：路径链:', pathChain);
        
        pathChain.forEach((path, index) => {
            const config = breadcrumbConfig.pathMap[path];
            if (config) {
                const isFirst = index === 0;
                const isLast = index === pathChain.length - 1;
                
                // 确保业务领域也可以显示，但不可点击
                let href = null;
                if (!isLast) {
                    if (path === '/business') {
                        href = null; // 业务领域不可点击
                    } else {
                        href = this.getRelativePath(path);
                    }
                }
                
                items.push({
                    text: config[this.currentLanguage],
                    href: href
                });
                
                console.log(`面包屑导航：添加项目 - ${config[this.currentLanguage]}`);
            }
        });
        
        console.log('面包屑导航：最终项目:', items);
        return items;
    }
    
    // 构建路径链
    buildPathChain(currentPath) {
        const chain = [];
        let path = currentPath;
        
        // 添加当前路径
        chain.unshift(path);
        
        // 向上查找父路径
        while (breadcrumbConfig.parentMap[path]) {
            path = breadcrumbConfig.parentMap[path];
            chain.unshift(path);
        }
        
        // 确保首页在最前面
        if (chain[0] !== '/') {
            chain.unshift('/');
        }
        
        return chain;
    }
    
    // 获取相对路径
    getRelativePath(targetPath) {
        if (targetPath === '/') {
            const currentPath = this.getCurrentPath();
            if (currentPath.startsWith('/pages/business/')) {
                return '../../index.html';
            } else if (currentPath.startsWith('/pages/')) {
                return '../index.html';
            } else {
                return 'index.html';
            }
        }
        
        // 处理其他路径 - 直接返回相对路径
        const currentPath = this.getCurrentPath();
        
        // 如果当前在 /pages/business/ 目录下
        if (currentPath.startsWith('/pages/business/')) {
            if (targetPath.startsWith('/pages/business/')) {
                // 同级页面，直接使用文件名
                return targetPath.split('/').pop();
            } else if (targetPath.startsWith('/pages/')) {
                // 上一级pages目录
                return '../' + targetPath.split('/').pop();
            } else {
                // 根目录文件
                return '../../' + targetPath.substring(1);
            }
        }
        // 如果当前在 /pages/ 目录下
        else if (currentPath.startsWith('/pages/')) {
            if (targetPath.startsWith('/pages/business/')) {
                // 下级business目录
                return 'business/' + targetPath.split('/').pop();
            } else if (targetPath.startsWith('/pages/')) {
                // 同级pages目录
                return targetPath.split('/').pop();
            } else {
                // 根目录文件
                return '../' + targetPath.substring(1);
            }
        }
        // 如果当前在根目录
        else {
            return targetPath.substring(1); // 移除开头的/
        }
    }
    
    // 移除滚动事件监听，面包屑导航始终固定显示
    
    // 设置语言监听
    setupLanguageListener() {
        // 监听语言切换事件
        document.addEventListener('languageChanged', (event) => {
            this.currentLanguage = event.detail.language;
            console.log('面包屑导航：接收到语言切换事件:', event.detail.language);
            this.generateBreadcrumb();
        });
        
        // 初始化语言（延迟检测以确保language.js已加载）
        this.detectCurrentLanguage();
        
        // 延迟再次检测，以防language.js还没有完全初始化
        setTimeout(() => {
            const newLanguage = this.detectAndGetCurrentLanguage();
            if (newLanguage !== this.currentLanguage) {
                console.log('面包屑导航：延迟检测发现语言变化:', this.currentLanguage, '->', newLanguage);
                this.currentLanguage = newLanguage;
                this.generateBreadcrumb();
            }
        }, 100);
        
        // 添加更长的延迟检测，确保页面完全加载后再次检查语言状态
        setTimeout(() => {
            const finalLanguage = this.detectAndGetCurrentLanguage();
            if (finalLanguage !== this.currentLanguage) {
                console.log('面包屑导航：最终检测发现语言变化:', this.currentLanguage, '->', finalLanguage);
                this.currentLanguage = finalLanguage;
                this.generateBreadcrumb();
            }
        }, 500);
    }
    
    // 检测当前语言
    detectCurrentLanguage() {
        this.currentLanguage = this.detectAndGetCurrentLanguage();
    }
    
    // 检测并返回当前语言（不设置currentLanguage属性）
    detectAndGetCurrentLanguage() {
        // 首先检查当前页面URL是否包含英文标识
        const currentPath = window.location.pathname;
        if (currentPath.includes('-en.html') || currentPath.includes('/en/')) {
            console.log('面包屑导航：从URL路径检测到英文页面:', currentPath);
            return 'en';
        }
        
        // 优先从localStorage获取保存的语言设置
        const savedLanguage = localStorage.getItem('website-language');
        if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
            console.log('面包屑导航：从localStorage获取语言设置:', savedLanguage);
            return savedLanguage;
        }
        
        // 检查全局语言对象
        if (window.HydrergyLanguage && typeof window.HydrergyLanguage.getCurrentLanguage === 'function') {
            const globalLang = window.HydrergyLanguage.getCurrentLanguage();
            if (globalLang && (globalLang === 'zh' || globalLang === 'en')) {
                console.log('面包屑导航：从全局语言对象获取语言设置:', globalLang);
                return globalLang;
            }
        }
        
        // 其次检查HTML lang属性
        const htmlLang = document.documentElement.lang;
        if (htmlLang === 'zh-CN' || htmlLang === 'zh') {
            console.log('面包屑导航：从HTML lang属性获取语言设置:', htmlLang);
            return 'zh';
        } else if (htmlLang === 'en' || htmlLang === 'en-US') {
            console.log('面包屑导航：从HTML lang属性获取语言设置:', htmlLang);
            return 'en';
        } else {
            // 如果是中文页面（不包含-en.html），默认为中文
            if (currentPath.includes('.html') && !currentPath.includes('-en.html')) {
                console.log('面包屑导航：检测到中文页面:', currentPath);
                return 'zh';
            }
            
            // 最后检查浏览器语言
            const browserLang = navigator.language || navigator.userLanguage;
            const detectedLang = browserLang.startsWith('zh') ? 'zh' : 'en';
            console.log('面包屑导航：使用浏览器语言设置:', browserLang, '-> 设置为:', detectedLang);
            return detectedLang;
        }
    }
    
    // 添加body类
    addBodyClass() {
        document.body.classList.add('breadcrumb-active');
    }
    
    // 更新面包屑（外部调用）
    update() {
        this.generateBreadcrumb();
    }
}

// 初始化面包屑导航
let breadcrumbNav = null;

// 确保面包屑导航全局可用
window.breadcrumbNav = null;

// 初始化函数
function initBreadcrumbNavigation() {
    console.log('面包屑导航：初始化面包屑导航');
    
    // 检查是否已经初始化
    if (breadcrumbNav) {
        console.log('面包屑导航：已经初始化，重新生成面包屑');
        breadcrumbNav.generateBreadcrumb();
        return;
    }
    
    // 创建新的面包屑导航实例
    breadcrumbNav = new BreadcrumbNavigation();
    window.breadcrumbNav = breadcrumbNav;
    
    console.log('面包屑导航：初始化完成');
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('面包屑导航：DOM加载完成，初始化面包屑导航');
        initBreadcrumbNavigation();
        
        // 页面完全加载后再次检查语言状态
        window.addEventListener('load', () => {
            console.log('面包屑导航：页面完全加载，重新生成面包屑');
            
            // 确保面包屑导航已初始化
            if (!breadcrumbNav) {
                console.log('面包屑导航：页面加载完成但面包屑导航未初始化，重新初始化');
                initBreadcrumbNavigation();
            } else {
                // 强制重新生成面包屑
                breadcrumbNav.generateBreadcrumb();
                
                setTimeout(() => {
                    const currentLang = breadcrumbNav.detectAndGetCurrentLanguage();
                    if (currentLang !== breadcrumbNav.currentLanguage) {
                        console.log('面包屑导航：页面加载完成后检测到语言变化:', breadcrumbNav.currentLanguage, '->', currentLang);
                        breadcrumbNav.currentLanguage = currentLang;
                        breadcrumbNav.generateBreadcrumb();
                    }
                }, 200);
            }
        });
    });
} else {
    console.log('面包屑导航：DOM已加载，直接初始化面包屑导航');
    initBreadcrumbNavigation();
    
    // 页面完全加载后再次检查语言状态
    window.addEventListener('load', () => {
        console.log('面包屑导航：页面完全加载，重新生成面包屑');
        
        // 确保面包屑导航已初始化
        if (!breadcrumbNav) {
            console.log('面包屑导航：页面加载完成但面包屑导航未初始化，重新初始化');
            initBreadcrumbNavigation();
        } else {
            // 强制重新生成面包屑
            breadcrumbNav.generateBreadcrumb();
            
            setTimeout(() => {
                const currentLang = breadcrumbNav.detectAndGetCurrentLanguage();
                if (currentLang !== breadcrumbNav.currentLanguage) {
                    console.log('面包屑导航：页面加载完成后检测到语言变化:', breadcrumbNav.currentLanguage, '->', currentLang);
                    breadcrumbNav.currentLanguage = currentLang;
                    breadcrumbNav.generateBreadcrumb();
                }
            }, 200);
        }
    });
}

// 导出到全局作用域
window.BreadcrumbNavigation = BreadcrumbNavigation;
window.breadcrumbNav = breadcrumbNav;