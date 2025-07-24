#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图片优化脚本
用于批量压缩网站图片，提升加载速度
"""

import os
import shutil
from PIL import Image
import sys

def get_file_size_mb(file_path):
    """获取文件大小（MB）"""
    return os.path.getsize(file_path) / (1024 * 1024)

def compress_image(input_path, output_path, max_size_kb=200, quality=85):
    """
    压缩图片
    
    Args:
        input_path: 输入文件路径
        output_path: 输出文件路径
        max_size_kb: 目标最大文件大小（KB）
        quality: JPEG质量（1-100）
    
    Returns:
        bool: 是否成功压缩
    """
    try:
        with Image.open(input_path) as img:
            # 获取原始文件信息
            original_size = os.path.getsize(input_path)
            original_size_kb = original_size / 1024
            
            print(f"处理图片: {os.path.basename(input_path)}")
            print(f"  原始大小: {original_size_kb:.1f} KB")
            
            # 如果文件已经很小，直接复制
            if original_size_kb <= max_size_kb:
                shutil.copy2(input_path, output_path)
                print(f"  文件已经足够小，直接复制")
                return True
            
            # 转换RGBA到RGB
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'RGBA':
                    background.paste(img, mask=img.split()[-1])
                else:
                    background.paste(img)
                img = background
            
            # 获取文件扩展名
            _, ext = os.path.splitext(input_path.lower())
            
            # 尝试不同的压缩策略
            compressed = False
            
            # 策略1: 降低质量
            for q in [quality, 75, 65, 55, 45]:
                if ext in ['.jpg', '.jpeg']:
                    img.save(output_path, 'JPEG', quality=q, optimize=True)
                elif ext == '.png':
                    img.save(output_path, 'PNG', optimize=True)
                else:
                    # 其他格式转为JPEG
                    img.save(output_path.replace(ext, '.jpg'), 'JPEG', quality=q, optimize=True)
                    output_path = output_path.replace(ext, '.jpg')
                
                new_size_kb = os.path.getsize(output_path) / 1024
                
                if new_size_kb <= max_size_kb:
                    print(f"  压缩后大小: {new_size_kb:.1f} KB (质量: {q})")
                    print(f"  压缩率: {(1 - new_size_kb/original_size_kb)*100:.1f}%")
                    compressed = True
                    break
            
            # 策略2: 如果质量降低还不够，尝试缩小尺寸
            if not compressed:
                original_width, original_height = img.size
                for scale in [0.8, 0.6, 0.5, 0.4]:
                    new_width = int(original_width * scale)
                    new_height = int(original_height * scale)
                    
                    resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    
                    if ext in ['.jpg', '.jpeg']:
                        resized_img.save(output_path, 'JPEG', quality=quality, optimize=True)
                    elif ext == '.png':
                        resized_img.save(output_path, 'PNG', optimize=True)
                    else:
                        resized_img.save(output_path.replace(ext, '.jpg'), 'JPEG', quality=quality, optimize=True)
                        output_path = output_path.replace(ext, '.jpg')
                    
                    new_size_kb = os.path.getsize(output_path) / 1024
                    
                    if new_size_kb <= max_size_kb:
                        print(f"  缩放到: {new_width}x{new_height} ({scale*100:.0f}%)")
                        print(f"  压缩后大小: {new_size_kb:.1f} KB")
                        print(f"  压缩率: {(1 - new_size_kb/original_size_kb)*100:.1f}%")
                        compressed = True
                        break
            
            if not compressed:
                print(f"  警告: 无法将文件压缩到目标大小")
                # 使用最小尺寸和最低质量
                final_width = int(original_width * 0.3)
                final_height = int(original_height * 0.3)
                final_img = img.resize((final_width, final_height), Image.Resampling.LANCZOS)
                final_img.save(output_path.replace(ext, '.jpg'), 'JPEG', quality=30, optimize=True)
                
                final_size_kb = os.path.getsize(output_path.replace(ext, '.jpg')) / 1024
                print(f"  最终大小: {final_size_kb:.1f} KB")
            
            return True
            
    except Exception as e:
        print(f"  错误: {str(e)}")
        return False

def backup_original_images(images_dir):
    """备份原始图片"""
    backup_dir = os.path.join(images_dir, 'original_backup')
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"创建备份目录: {backup_dir}")
        
        # 复制所有图片到备份目录
        for filename in os.listdir(images_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp')):
                src = os.path.join(images_dir, filename)
                dst = os.path.join(backup_dir, filename)
                if os.path.isfile(src):
                    shutil.copy2(src, dst)
        
        print("原始图片已备份")
    else:
        print("备份目录已存在，跳过备份")

def optimize_images(images_dir, max_size_kb=200):
    """
    批量优化图片
    
    Args:
        images_dir: 图片目录
        max_size_kb: 目标最大文件大小（KB）
    """
    if not os.path.exists(images_dir):
        print(f"错误: 目录不存在 {images_dir}")
        return
    
    # 备份原始图片
    backup_original_images(images_dir)
    
    # 获取所有图片文件
    image_files = []
    for filename in os.listdir(images_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            file_path = os.path.join(images_dir, filename)
            if os.path.isfile(file_path):
                file_size_kb = os.path.getsize(file_path) / 1024
                image_files.append((filename, file_size_kb))
    
    # 按文件大小排序，优先处理大文件
    image_files.sort(key=lambda x: x[1], reverse=True)
    
    print(f"\n找到 {len(image_files)} 个图片文件")
    print(f"目标最大文件大小: {max_size_kb} KB\n")
    
    total_original_size = 0
    total_compressed_size = 0
    processed_count = 0
    
    for filename, original_size_kb in image_files:
        if original_size_kb <= max_size_kb:
            print(f"跳过 {filename} (已经足够小: {original_size_kb:.1f} KB)")
            continue
        
        input_path = os.path.join(images_dir, filename)
        output_path = input_path  # 直接覆盖原文件
        
        # 临时文件
        temp_path = input_path + '.temp'
        
        if compress_image(input_path, temp_path, max_size_kb):
            # 替换原文件
            shutil.move(temp_path, output_path)
            
            new_size_kb = os.path.getsize(output_path) / 1024
            total_original_size += original_size_kb
            total_compressed_size += new_size_kb
            processed_count += 1
        else:
            # 删除临时文件
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
        print()
    
    # 统计结果
    if processed_count > 0:
        print(f"\n=== 优化完成 ===")
        print(f"处理文件数: {processed_count}")
        print(f"原始总大小: {total_original_size:.1f} KB")
        print(f"压缩后总大小: {total_compressed_size:.1f} KB")
        print(f"总压缩率: {(1 - total_compressed_size/total_original_size)*100:.1f}%")
        print(f"节省空间: {total_original_size - total_compressed_size:.1f} KB")
    else:
        print("\n没有需要压缩的文件")

def main():
    """主函数"""
    # 获取当前脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(script_dir, 'images')
    
    print("=== 网页图片优化工具 ===")
    print(f"图片目录: {images_dir}")
    
    # 检查PIL是否可用
    try:
        from PIL import Image
        print("PIL库检查: ✓")
    except ImportError:
        print("错误: 需要安装PIL库")
        print("请运行: pip install Pillow")
        return
    
    # 开始优化
    optimize_images(images_dir, max_size_kb=200)
    
    print("\n优化完成！原始图片已备份到 images/original_backup/ 目录")
    print("如果效果不满意，可以从备份目录恢复原始图片")

if __name__ == '__main__':
    main()