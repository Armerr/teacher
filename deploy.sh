#!/bin/bash

# 配置信息
GITHUB_REPO="git@github.com:Armerr/deploy.git"
DEPLOY_DIR="deploy_repo"
DIST_DIR="dist"
TARGET_BRANCH="teacher"

# 错误处理函数
handle_error() {
  echo "❌ 错误: $1"
  exit 1
}

# 确保脚本在任何错误时退出
set -e

# 🚀 运行 Vue3 构建
echo "🚀 开始 Vue3 项目打包..."
npm install || handle_error "依赖安装失败"
npm run build || handle_error "打包失败"

# 检查 dist 目录
if [ ! -d "$DIST_DIR" ]; then
  handle_error "❌ 打包失败，未找到 dist 目录！"
fi

# 📦 克隆目标部署仓库
echo "📦 克隆目标部署仓库..."
rm -rf $DEPLOY_DIR
git clone "$GITHUB_REPO" "$DEPLOY_DIR" || handle_error "❌ Git 克隆失败"

cd $DEPLOY_DIR || handle_error "❌ 进入 deploy_repo 目录失败"
git checkout --orphan $TARGET_BRANCH  # 创建无历史的新分支

# 🗑️ 清理旧文件
echo "🗑️ 清理旧文件..."
git rm -rf . || handle_error "❌ 清理旧文件失败"

# 📂 复制打包后的文件
echo "📂 复制 dist 目录文件..."
cp -r ../$DIST_DIR/* . || handle_error "❌ 复制文件失败"

# 📝 提交更改
echo "📤 提交到 GitHub..."
git add . || handle_error "❌ 添加文件到 Git 失败"
git commit -m "🚀 Deploy build at $(date)" || handle_error "❌ 提交失败"
git push -f origin $TARGET_BRANCH || handle_error "❌ 推送失败"
echo "✅ 部署完成！已更新 GitHub 仓库的 teacher 分支。"

# 🗑️ 删除 deploy_repo 目录
cd ..
rm -rf $DEPLOY_DIR
echo "🧹 已删除临时目录 $DEPLOY_DIR。"