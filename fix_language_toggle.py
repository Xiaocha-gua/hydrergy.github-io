#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
复合隔膜页面语言切换按钮修复脚本

问题分析：
1. language.js 和 page-index.js 之间存在冲突
2. page-index.js 检查到 window.HydrergyLanguage 存在后跳过事件监听器设置
3. 但 language.js 的事件监听器可能没有正确绑定
4. 脚本加载顺序可能导致问题

解决方案：
1. 修改 page-index.js，移除对 window.HydrergyLanguage 的检查
2. 确保语言切换功能只由一个脚本处理
3. 添加调试信息以便排查问题
"""

import os
import re
import shutil
from datetime import datetime

def backup_file(file_path):
    """备份文件"""
    if os.path.exists(file_path):
        backup_path = f"{file_path}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        shutil.copy2(file_path, backup_path)
        print(f"已备份文件: {backup_path}")
        return backup_path
    return None

def fix_page_index_js():
    """修复 page-index.js 中的语言切换冲突"""
    file_path = "js/page-index.js"
    
    if not os.path.exists(file_path):
        print(f"文件不存在: {file_path}")
        return False
    
    # 备份原文件
    backup_file(file_path)
    
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 修复1: 移除对 window.HydrergyLanguage 的检查
    old_check = r"""        // 检查是否已经有language.js处理语言切换
        if \(window\.HydrergyLanguage\) \{
            // 如果language.js已加载，不重复设置事件监听器
            console\.log\('Language\.js已处理语言切换功能，跳过page-index\.js的设置'\);
            return;
        \}"""
    
    new_check = """        // 强制设置语言切换功能，确保按钮可点击
        console.log('page-index.js: 设置语言切换功能');"""
    
    content = re.sub(old_check, new_check, content, flags=re.MULTILINE)
    
    # 修复2: 增强事件监听器绑定
    old_listener = r"""            // 检查是否已经有事件监听器
            if \(toggle\.dataset\.languageHandled\) \{
                return;
            \}
            
            toggle\.addEventListener\('click', \(e\) => \{
                e\.preventDefault\(\);
                this\.switchLanguage\(\);
            \}\);
            
            // 标记已处理
            toggle\.dataset\.languageHandled = 'true';"""
    
    new_listener = """            // 移除旧的事件监听器（如果存在）
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
            
            // 添加新的事件监听器
            newToggle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('page-index.js: 语言切换按钮被点击');
                this.switchLanguage();
            });
            
            // 标记已处理
            newToggle.dataset.languageHandled = 'true';
            console.log('page-index.js: 已为按钮添加事件监听器', newToggle);"""
    
    content = re.sub(old_listener, new_listener, content, flags=re.MULTILINE)
    
    # 修复3: 增强 switchLanguage 方法的调试信息
    old_switch = r"""    // 切换语言
    switchLanguage\(\) \{
        const newLanguage = this\.currentLanguage === 'zh' \? 'en' : 'zh';
        const targetPage = this\.getTargetPageForLanguage\(this\.currentPage, newLanguage\);
        
        if \(targetPage\) \{
            // 保存语言选择
            localStorage\.setItem\('website-language', newLanguage\);
            
            // 确保路径以正确的格式开始，避免相对路径问题
            const finalUrl = targetPage\.startsWith\('/') \? targetPage : '/' \+ targetPage;
            window\.location\.href = finalUrl;
        \} else \{
            console\.warn\('未找到对应语言的页面:', this\.currentPage, newLanguage\);
        \}
    \}"""
    
    new_switch = """    // 切换语言
    switchLanguage() {
        console.log('page-index.js: switchLanguage 被调用');
        console.log('当前语言:', this.currentLanguage);
        console.log('当前页面:', this.currentPage);
        
        const newLanguage = this.currentLanguage === 'zh' ? 'en' : 'zh';
        const targetPage = this.getTargetPageForLanguage(this.currentPage, newLanguage);
        
        console.log('目标语言:', newLanguage);
        console.log('目标页面:', targetPage);
        
        if (targetPage) {
            // 保存语言选择
            localStorage.setItem('website-language', newLanguage);
            
            // 确保路径以正确的格式开始，避免相对路径问题
            const finalUrl = targetPage.startsWith('/') ? targetPage : '/' + targetPage;
            console.log('即将跳转到:', finalUrl);
            window.location.href = finalUrl;
        } else {
            console.error('未找到对应语言的页面:', this.currentPage, newLanguage);
            alert('抱歉，未找到对应语言的页面');
        }
    }"""
    
    content = re.sub(old_switch, new_switch, content, flags=re.MULTILINE)
    
    # 写入修复后的内容
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"已修复 {file_path}")
    return True

def main():
    """主函数"""
    print("开始修复复合隔膜页面语言切换功能...")
    print("="*50)
    
    # 检查当前目录
    if not os.path.exists('js'):
        print("错误: 未找到 js 目录，请确保在正确的项目根目录下运行此脚本")
        return
    
    success_count = 0
    
    # 修复 page-index.js
    if fix_page_index_js():
        success_count += 1
    
    print("="*50)
    print(f"修复完成! 成功修复 {success_count} 个文件")
    print("\n修复内容:")
    print("1. 移除了 page-index.js 中对 window.HydrergyLanguage 的检查")
    print("2. 增强了事件监听器的绑定逻辑")
    print("3. 添加了详细的调试信息")
    print("\n请刷新页面测试语言切换功能")
    print("如果仍有问题，请在浏览器控制台查看调试信息")

if __name__ == '__main__':
    main()