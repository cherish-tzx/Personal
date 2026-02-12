# Gitee 基础用法完全指南
<div class="doc-toc">
## 目录

1. [Gitee 简介](#1-gitee-简介)
2. [环境配置与账户设置](#2-环境配置与账户设置)
3. [仓库管理](#3-仓库管理)
4. [分支管理](#4-分支管理)
5. [提交与推送](#5-提交与推送)
6. [远程仓库操作](#6-远程仓库操作)
7. [标签管理](#7-标签管理)
8. [合并与变基](#8-合并与变基)
9. [冲突解决](#9-冲突解决)
10. [撤销与回退](#10-撤销与回退)
11. [stash 暂存](#11-stash-暂存)
12. [子模块管理](#12-子模块管理)
13. [Gitee 特有功能](#13-gitee-特有功能)
14. [Gitee API 使用](#14-gitee-api-使用)
15. [Gitee Pages](#15-gitee-pages)
16. [Gitee CI/CD](#16-gitee-cicd)
17. [Gitee Webhook](#17-gitee-webhook)
18. [常用技巧与最佳实践](#18-常用技巧与最佳实践)


</div>

---

## 1. Gitee 简介

### 1.1 什么是 Gitee

Gitee（码云）是国内领先的代码托管平台，基于 Git 版本控制系统，提供代码托管、项目管理、协作开发等功能。相比 GitHub，Gitee 在国内访问速度更快，且提供更多本土化服务。

### 1.2 Gitee vs GitHub

| 特性 | Gitee | GitHub |
|------|-------|--------|
| 访问速度 | 国内快速 | 国内较慢 |
| 私有仓库 | 免费无限制 | 免费有限制 |
| 企业服务 | 本土化 | 国际化 |
| 中文支持 | 完善 | 一般 |
| CI/CD | Gitee Go | GitHub Actions |

---

## 2. 环境配置与账户设置

### 2.1 Git 安装与配置

```bash
# Windows 下载安装包
# 官网：https://git-scm.com/download/win

# macOS 安装
brew install git

# Linux (Ubuntu/Debian) 安装
sudo apt-get install git

# Linux (CentOS/RHEL) 安装
sudo yum install git
```

**使用场景**：首次使用Git前必须安装Git工具。

### 2.2 全局配置用户信息

```bash
# 配置用户名（必须与Gitee账户一致）
git config --global user.name "你的用户名"

# 配置邮箱（必须与Gitee绑定邮箱一致）
git config --global user.email "your_email@example.com"

# 查看当前配置
git config --list

# 查看特定配置
git config user.name
git config user.email
```

**使用场景**：团队协作时，通过用户名和邮箱识别提交者身份。

### 2.3 SSH 密钥配置

```bash
# 生成 SSH 密钥（推荐 ed25519 算法）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 如果系统不支持 ed25519，使用 RSA
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 查看公钥内容
cat ~/.ssh/id_ed25519.pub
# 或
cat ~/.ssh/id_rsa.pub

# 测试 SSH 连接
ssh -T git@gitee.com
```

**使用场景**：SSH免密推送代码，避免每次输入密码。

### 2.4 配置多个 SSH 密钥（Gitee + GitHub）

```bash
# 创建或编辑 SSH 配置文件
vim ~/.ssh/config
```

```
# Gitee 配置
Host gitee.com
    HostName gitee.com
    User git
    IdentityFile ~/.ssh/id_ed25519_gitee
    PreferredAuthentications publickey

# GitHub 配置
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    PreferredAuthentications publickey
```

**使用场景**：同时使用Gitee和GitHub时，需要配置不同的SSH密钥。

### 2.5 HTTPS 凭证缓存

```bash
# 缓存密码（默认15分钟）
git config --global credential.helper cache

# 设置缓存时间（1小时 = 3600秒）
git config --global credential.helper 'cache --timeout=3600'

# Windows 使用凭证管理器
git config --global credential.helper wincred

# macOS 使用钥匙串
git config --global credential.helper osxkeychain
```

**使用场景**：使用HTTPS方式克隆仓库时，避免频繁输入密码。

---

## 3. 仓库管理

### 3.1 初始化本地仓库

```bash
# 在当前目录初始化仓库
git init

# 在指定目录初始化仓库
git init my-project

# 初始化裸仓库（用于服务器端）
git init --bare my-project.git
```

**使用场景**：从零开始创建新项目时使用。

### 3.2 克隆远程仓库

```bash
# SSH 方式克隆（推荐）
git clone git@gitee.com:username/repository.git

# HTTPS 方式克隆
git clone https://gitee.com/username/repository.git

# 克隆并指定本地目录名
git clone git@gitee.com:username/repository.git my-local-folder

# 浅克隆（只获取最近一次提交，适用于大型仓库）
git clone --depth 1 git@gitee.com:username/repository.git

# 克隆指定分支
git clone -b develop git@gitee.com:username/repository.git

# 克隆所有分支
git clone --mirror git@gitee.com:username/repository.git
```

**使用场景**：
- SSH方式：团队成员日常开发
- 浅克隆：CI/CD流水线中加速构建
- 指定分支：只需要特定分支代码

### 3.3 .gitignore 文件配置

```bash
# 创建 .gitignore 文件
touch .gitignore
```

```gitignore
# 常用 .gitignore 配置

# 依赖目录
node_modules/
vendor/

# 构建输出
dist/
build/
*.min.js
*.min.css

# 环境配置文件
.env
.env.local
.env.*.local

# 编辑器配置
.idea/
.vscode/
*.swp
*.swo
*~

# 系统文件
.DS_Store
Thumbs.db

# 日志文件
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 测试覆盖率
coverage/
.nyc_output/

# 临时文件
tmp/
temp/
*.tmp
```

**使用场景**：排除不需要版本控制的文件，如依赖、构建产物、敏感配置等。

### 3.4 查看仓库状态

```bash
# 查看完整状态
git status

# 简洁模式查看状态
git status -s
# 或
git status --short

# 查看被忽略的文件
git status --ignored
```

**状态标识说明**：
- `??` - 未跟踪文件
- `A` - 新添加到暂存区
- `M` - 修改过的文件
- `D` - 删除的文件
- `R` - 重命名的文件
- `C` - 复制的文件
- `U` - 更新但未合并

**使用场景**：提交前检查文件变更状态。

---

## 4. 分支管理

### 4.1 分支基本操作

```bash
# 查看本地分支
git branch

# 查看所有分支（包括远程）
git branch -a

# 查看远程分支
git branch -r

# 创建新分支
git branch feature-login

# 切换分支
git checkout feature-login
# 或（Git 2.23+）
git switch feature-login

# 创建并切换分支
git checkout -b feature-login
# 或
git switch -c feature-login

# 基于指定提交创建分支
git checkout -b hotfix-bug abc1234

# 基于远程分支创建本地分支
git checkout -b feature-local origin/feature-remote
```

**使用场景**：
- 开发新功能时创建feature分支
- 修复bug时创建hotfix分支
- 多人协作时避免直接在主分支开发

### 4.2 分支重命名与删除

```bash
# 重命名当前分支
git branch -m new-branch-name

# 重命名指定分支
git branch -m old-name new-name

# 删除本地分支（已合并）
git branch -d feature-login

# 强制删除本地分支（未合并）
git branch -D feature-login

# 删除远程分支
git push origin --delete feature-login
# 或
git push origin :feature-login
```

**使用场景**：功能开发完成合并后，清理无用分支。

### 4.3 分支跟踪

```bash
# 设置当前分支跟踪远程分支
git branch --set-upstream-to=origin/develop

# 创建分支时设置跟踪
git checkout -b feature-x --track origin/feature-x

# 查看分支跟踪信息
git branch -vv
```

**使用场景**：建立本地分支与远程分支的关联关系，简化推送和拉取操作。

### 4.4 分支比较

```bash
# 比较两个分支的差异
git diff branch1..branch2

# 查看分支间的提交差异
git log branch1..branch2

# 查看分支图
git log --oneline --graph --all

# 查看分支包含的提交
git log --oneline feature-branch
```

**使用场景**：合并前对比分支差异，代码审查。

---

## 5. 提交与推送

### 5.1 添加文件到暂存区

```bash
# 添加单个文件
git add filename.js

# 添加多个文件
git add file1.js file2.js file3.css

# 添加当前目录所有文件
git add .

# 添加所有变更（包括删除）
git add -A
# 或
git add --all

# 添加指定类型文件
git add *.js

# 交互式添加（可选择部分内容）
git add -p filename.js

# 添加被修改和删除的文件（不包括新文件）
git add -u
```

**使用场景**：
- `git add .`：提交所有修改
- `git add -p`：只提交部分修改，用于拆分大提交

### 5.2 提交变更

```bash
# 提交并编写消息
git commit -m "feat: 添加用户登录功能"

# 多行提交消息
git commit -m "feat: 添加用户登录功能" -m "- 实现手机号登录" -m "- 实现邮箱登录"

# 打开编辑器编写详细消息
git commit

# 添加并提交（跳过 git add）
git commit -am "fix: 修复登录验证bug"

# 修改最近一次提交
git commit --amend -m "feat: 添加用户登录功能（修正）"

# 修改提交但不改变消息
git commit --amend --no-edit

# 空提交（用于触发CI）
git commit --allow-empty -m "chore: trigger CI"
```

**提交消息规范（Angular规范）**：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**type 类型**：
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变动
- `revert`: 回滚

**使用场景**：记录代码变更历史，便于追溯和协作。

### 5.3 推送到远程仓库

```bash
# 推送当前分支
git push

# 推送指定分支
git push origin feature-login

# 首次推送设置上游
git push -u origin feature-login
# 或
git push --set-upstream origin feature-login

# 推送所有分支
git push --all origin

# 推送标签
git push origin v1.0.0

# 推送所有标签
git push --tags

# 强制推送（慎用）
git push -f origin feature-branch
# 或
git push --force-with-lease origin feature-branch  # 更安全
```

**使用场景**：
- `-u`：首次推送新分支
- `--force-with-lease`：rebase后推送，比-f更安全

### 5.4 查看提交历史

```bash
# 查看提交历史
git log

# 简洁模式
git log --oneline

# 显示分支图
git log --oneline --graph --all

# 显示文件变更
git log --stat

# 显示具体改动
git log -p

# 查看指定文件历史
git log -- path/to/file.js

# 按作者筛选
git log --author="username"

# 按时间筛选
git log --since="2024-01-01" --until="2024-12-31"

# 按消息关键字筛选
git log --grep="login"

# 显示最近N条
git log -n 10

# 自定义格式
git log --pretty=format:"%h - %an, %ar : %s"
```

**使用场景**：查找历史提交、追溯代码变更。

---

## 6. 远程仓库操作

### 6.1 远程仓库管理

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin git@gitee.com:username/repo.git

# 添加多个远程仓库
git remote add gitee git@gitee.com:username/repo.git
git remote add github git@github.com:username/repo.git

# 修改远程仓库URL
git remote set-url origin git@gitee.com:username/new-repo.git

# 重命名远程仓库
git remote rename origin gitee

# 删除远程仓库
git remote remove origin

# 查看远程仓库详情
git remote show origin
```

**使用场景**：
- 单仓库多远程：同时推送到Gitee和GitHub
- 迁移仓库：更换远程仓库地址

### 6.2 拉取远程更新

```bash
# 获取远程更新（不合并）
git fetch origin

# 获取所有远程仓库更新
git fetch --all

# 获取并清理无效的远程跟踪分支
git fetch --prune

# 拉取并合并（fetch + merge）
git pull

# 拉取指定分支
git pull origin develop

# 拉取并变基（避免merge commit）
git pull --rebase origin develop

# 拉取所有分支
git pull --all
```

**使用场景**：
- `fetch`：查看远程更新但不影响本地
- `pull --rebase`：保持提交历史线性

### 6.3 同步多个远程仓库

```bash
# 配置多个远程
git remote add gitee git@gitee.com:username/repo.git
git remote add github git@github.com:username/repo.git

# 同时推送到多个远程
git push gitee main
git push github main

# 配置同时推送
git remote set-url --add --push origin git@gitee.com:username/repo.git
git remote set-url --add --push origin git@github.com:username/repo.git

# 一次推送到所有配置的远程
git push origin main
```

**使用场景**：代码同步备份到Gitee和GitHub。

---

## 7. 标签管理

### 7.1 创建标签

```bash
# 创建轻量标签
git tag v1.0.0

# 创建附注标签（推荐）
git tag -a v1.0.0 -m "发布版本 1.0.0"

# 为历史提交创建标签
git tag -a v0.9.0 abc1234 -m "标记旧版本"

# 创建带签名的标签
git tag -s v1.0.0 -m "签名版本 1.0.0"
```

**使用场景**：标记发布版本，便于回溯和部署。

### 7.2 查看与删除标签

```bash
# 查看所有标签
git tag

# 查看标签列表（按模式筛选）
git tag -l "v1.*"

# 查看标签详情
git show v1.0.0

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
# 或
git push origin :refs/tags/v1.0.0
```

**使用场景**：版本管理、标记里程碑。

### 7.3 推送标签

```bash
# 推送单个标签
git push origin v1.0.0

# 推送所有标签
git push --tags

# 推送附注标签
git push --follow-tags
```

**使用场景**：发布新版本时同步标签到远程。

### 7.4 检出标签

```bash
# 检出标签（分离HEAD状态）
git checkout v1.0.0

# 基于标签创建分支
git checkout -b hotfix-1.0.1 v1.0.0
```

**使用场景**：回到特定版本修复bug或验证问题。

---

## 8. 合并与变基

### 8.1 合并分支

```bash
# 合并指定分支到当前分支
git merge feature-login

# 不使用快进合并（保留分支历史）
git merge --no-ff feature-login

# 使用快进合并
git merge --ff-only feature-login

# 压缩合并（将多个提交压缩为一个）
git merge --squash feature-login
git commit -m "feat: 合并登录功能"

# 合并时添加消息
git merge -m "Merge feature-login into develop" feature-login

# 中止合并
git merge --abort
```

**使用场景**：
- `--no-ff`：保留功能分支的完整历史
- `--squash`：将功能分支的所有提交合并为一个，保持主分支整洁

### 8.2 变基操作

```bash
# 将当前分支变基到目标分支
git rebase main

# 交互式变基（修改/合并/删除提交）
git rebase -i HEAD~5

# 变基时保留合并提交
git rebase --preserve-merges main

# 继续变基（解决冲突后）
git rebase --continue

# 跳过当前提交
git rebase --skip

# 中止变基
git rebase --abort

# 将feature分支变基到main
git checkout feature-branch
git rebase main
```

**交互式变基命令**：
- `pick (p)`: 保留提交
- `reword (r)`: 修改提交消息
- `edit (e)`: 修改提交内容
- `squash (s)`: 合并到上一个提交
- `fixup (f)`: 合并但丢弃消息
- `drop (d)`: 删除提交

**使用场景**：
- 整理提交历史
- 更新功能分支到最新主分支
- 合并多个小提交为有意义的大提交

### 8.3 Cherry-pick

```bash
# 拣选单个提交
git cherry-pick abc1234

# 拣选多个提交
git cherry-pick abc1234 def5678

# 拣选一系列提交
git cherry-pick abc1234..def5678

# 拣选但不自动提交
git cherry-pick -n abc1234

# 继续拣选（解决冲突后）
git cherry-pick --continue

# 中止拣选
git cherry-pick --abort
```

**使用场景**：将特定提交应用到其他分支，如将hotfix应用到多个版本分支。

---

## 9. 冲突解决

### 9.1 查看冲突

```bash
# 查看冲突文件
git status

# 查看冲突详情
git diff

# 查看合并冲突的三方差异
git diff --cc
```

### 9.2 解决冲突

**冲突标记格式**：

```
<<<<<<< HEAD
当前分支的内容
=======
合并分支的内容
>>>>>>> feature-branch
```

**手动解决步骤**：

```bash
# 1. 编辑冲突文件，删除冲突标记，保留需要的内容

# 2. 标记为已解决
git add conflicted-file.js

# 3. 继续合并
git merge --continue
# 或
git rebase --continue
```

### 9.3 使用工具解决冲突

```bash
# 使用默认合并工具
git mergetool

# 指定合并工具
git mergetool --tool=vscode

# 配置默认合并工具
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

### 9.4 保留某一方的版本

```bash
# 保留当前分支版本
git checkout --ours conflicted-file.js

# 保留合并分支版本
git checkout --theirs conflicted-file.js

# 合并时全部使用我方
git merge -X ours feature-branch

# 合并时全部使用对方
git merge -X theirs feature-branch
```

**使用场景**：明确知道应该保留哪一方代码时使用。

---

## 10. 撤销与回退

### 10.1 撤销工作区修改

```bash
# 撤销单个文件的修改
git checkout -- filename.js
# 或（Git 2.23+）
git restore filename.js

# 撤销所有修改
git checkout -- .
# 或
git restore .

# 撤销指定目录
git checkout -- path/to/dir/
```

**使用场景**：放弃工作区的修改，恢复到暂存区或最新提交的状态。

### 10.2 撤销暂存区

```bash
# 取消暂存单个文件
git reset HEAD filename.js
# 或（Git 2.23+）
git restore --staged filename.js

# 取消暂存所有文件
git reset HEAD
# 或
git restore --staged .

# 取消暂存但保留修改
git reset --soft HEAD
```

**使用场景**：不小心add了不该提交的文件。

### 10.3 回退提交

```bash
# 回退到上一个提交（保留修改在暂存区）
git reset --soft HEAD~1

# 回退到上一个提交（保留修改在工作区）
git reset --mixed HEAD~1
# 或
git reset HEAD~1

# 回退到上一个提交（丢弃所有修改）
git reset --hard HEAD~1

# 回退到指定提交
git reset --hard abc1234

# 回退远程提交（慎用）
git reset --hard HEAD~1
git push -f origin branch-name
```

**使用场景**：
- `--soft`：修改提交消息或合并多个提交
- `--mixed`：重新整理提交内容
- `--hard`：完全放弃错误提交

### 10.4 Revert 撤销（安全）

```bash
# 撤销指定提交（创建新提交）
git revert abc1234

# 撤销多个提交
git revert abc1234 def5678

# 撤销一系列提交
git revert abc1234..def5678

# 撤销但不自动提交
git revert -n abc1234

# 撤销合并提交
git revert -m 1 merge-commit-hash
```

**使用场景**：撤销已推送的提交，保持历史完整性。

### 10.5 找回丢失的提交

```bash
# 查看所有操作历史
git reflog

# 恢复到之前的状态
git reset --hard HEAD@{2}

# 从reflog恢复分支
git branch recovered-branch HEAD@{5}
```

**使用场景**：误操作后恢复丢失的提交或分支。

---

## 11. Stash 暂存

### 11.1 基本操作

```bash
# 暂存当前修改
git stash

# 暂存并添加描述
git stash save "修改了登录逻辑，临时保存"
# 或（推荐）
git stash push -m "修改了登录逻辑，临时保存"

# 暂存包括未跟踪文件
git stash -u
# 或
git stash --include-untracked

# 暂存所有文件（包括被忽略的）
git stash -a
# 或
git stash --all

# 暂存部分文件
git stash push -m "只暂存src目录" src/
```

**使用场景**：临时切换分支处理紧急任务，保存当前未完成的工作。

### 11.2 查看暂存

```bash
# 查看暂存列表
git stash list

# 查看最近暂存的内容
git stash show

# 查看暂存的详细差异
git stash show -p

# 查看指定暂存
git stash show stash@{1} -p
```

### 11.3 恢复暂存

```bash
# 恢复最近的暂存（保留stash记录）
git stash apply

# 恢复并删除最近的暂存
git stash pop

# 恢复指定暂存
git stash apply stash@{2}

# 恢复到新分支
git stash branch new-branch-name
```

### 11.4 删除暂存

```bash
# 删除最近的暂存
git stash drop

# 删除指定暂存
git stash drop stash@{1}

# 清空所有暂存
git stash clear
```

**使用场景**：清理不再需要的暂存记录。

---

## 12. 子模块管理

### 12.1 添加子模块

```bash
# 添加子模块
git submodule add git@gitee.com:username/sub-repo.git path/to/submodule

# 添加指定分支的子模块
git submodule add -b develop git@gitee.com:username/sub-repo.git libs/sub-repo
```

**使用场景**：项目依赖其他Git仓库，如共享组件库。

### 12.2 初始化与更新

```bash
# 克隆包含子模块的仓库
git clone --recurse-submodules git@gitee.com:username/main-repo.git

# 初始化子模块
git submodule init

# 更新子模块
git submodule update

# 初始化并更新（合并命令）
git submodule update --init

# 递归初始化嵌套子模块
git submodule update --init --recursive

# 更新子模块到最新提交
git submodule update --remote

# 更新指定子模块
git submodule update --remote path/to/submodule
```

### 12.3 查看与管理

```bash
# 查看子模块状态
git submodule status

# 查看子模块摘要
git submodule summary

# 对所有子模块执行命令
git submodule foreach 'git checkout main && git pull'

# 删除子模块
git submodule deinit path/to/submodule
git rm path/to/submodule
rm -rf .git/modules/path/to/submodule
```

**使用场景**：管理多仓库项目、微服务架构中的共享代码。

---

## 13. Gitee 特有功能

### 13.1 Fork 与 Pull Request

```bash
# Fork 仓库后克隆
git clone git@gitee.com:your-username/forked-repo.git

# 添加上游仓库
git remote add upstream git@gitee.com:original-owner/original-repo.git

# 同步上游更新
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# 创建PR分支
git checkout -b pr/feature-xxx
# ... 开发修改 ...
git push origin pr/feature-xxx
# 然后在Gitee网页创建Pull Request
```

**使用场景**：向开源项目贡献代码。

### 13.2 Issue 关联

```bash
# 提交消息关联Issue
git commit -m "fix: 修复登录失败问题 #123"

# 关闭Issue
git commit -m "fix: 修复登录失败问题, close #123"

# 关联多个Issue
git commit -m "feat: 新增用户功能 #123 #124"
```

**关键字**：
- `close`、`closes`、`closed`：关闭Issue
- `fix`、`fixes`、`fixed`：修复Issue
- `resolve`、`resolves`、`resolved`：解决Issue

### 13.3 Gitee Go（轻量CI）

```yaml
# .gitee-ci.yml
version: 1.0
name: gitee-go-pipeline

triggers:
  push:
    branches:
      - main
      - develop

stages:
  - name: install
    script:
      - npm install
      
  - name: test
    script:
      - npm run test
      
  - name: build
    script:
      - npm run build
      
  - name: deploy
    script:
      - npm run deploy
```

**使用场景**：自动化测试、构建、部署。

### 13.4 Gitee Release

```bash
# 创建带发布说明的标签
git tag -a v1.0.0 -m "## 更新内容
- 新增用户登录功能
- 修复已知问题
- 性能优化"

git push origin v1.0.0
```

然后在Gitee仓库页面创建Release，关联标签。

**使用场景**：正式版本发布，提供下载包。

---

## 14. Gitee API 使用

### 14.1 获取 Access Token

1. 登录Gitee
2. 设置 -> 安全设置 -> 私人令牌
3. 生成新令牌，保存token

### 14.2 常用 API 示例

```bash
# 获取用户信息
curl "https://gitee.com/api/v5/user?access_token=YOUR_TOKEN"

# 获取用户仓库列表
curl "https://gitee.com/api/v5/user/repos?access_token=YOUR_TOKEN"

# 创建仓库
curl -X POST "https://gitee.com/api/v5/user/repos" \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "YOUR_TOKEN",
    "name": "new-repo",
    "private": true,
    "description": "新仓库描述"
  }'

# 获取仓库信息
curl "https://gitee.com/api/v5/repos/username/repo?access_token=YOUR_TOKEN"

# 获取分支列表
curl "https://gitee.com/api/v5/repos/username/repo/branches?access_token=YOUR_TOKEN"

# 获取提交列表
curl "https://gitee.com/api/v5/repos/username/repo/commits?access_token=YOUR_TOKEN"

# 创建Issue
curl -X POST "https://gitee.com/api/v5/repos/username/repo/issues" \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "YOUR_TOKEN",
    "title": "Bug: 登录失败",
    "body": "详细描述..."
  }'

# 创建Pull Request
curl -X POST "https://gitee.com/api/v5/repos/username/repo/pulls" \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "YOUR_TOKEN",
    "title": "新功能开发",
    "head": "feature-branch",
    "base": "main",
    "body": "PR描述"
  }'
```

### 14.3 JavaScript 调用 API

```javascript
// 使用 fetch 调用 Gitee API
async function getGiteeUser(token) {
  const response = await fetch(
    `https://gitee.com/api/v5/user?access_token=${token}`
  );
  return response.json();
}

// 获取仓库列表
async function getUserRepos(token) {
  const response = await fetch(
    `https://gitee.com/api/v5/user/repos?access_token=${token}&sort=updated&per_page=20`
  );
  return response.json();
}

// 创建仓库
async function createRepo(token, repoName, isPrivate = true) {
  const response = await fetch('https://gitee.com/api/v5/user/repos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: token,
      name: repoName,
      private: isPrivate,
    }),
  });
  return response.json();
}
```

**使用场景**：自动化脚本、CI/CD集成、管理后台。

---

## 15. Gitee Pages

### 15.1 配置静态页面

```bash
# 项目结构
my-project/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── images/
    └── logo.png
```

### 15.2 部署步骤

1. 确保仓库是公开的
2. 项目根目录或指定目录有 `index.html`
3. 在仓库设置中启用 Gitee Pages
4. 选择部署分支和目录

### 15.3 Vue/React 项目部署

```javascript
// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/repo-name/'  // 仓库名
    : '/'
}
```

```javascript
// vite.config.js
export default {
  base: '/repo-name/'  // 仓库名
}
```

```json
// package.json
{
  "homepage": "https://username.gitee.io/repo-name"
}
```

### 15.4 自动部署脚本

```bash
#!/bin/bash
# deploy.sh

# 构建
npm run build

# 进入构建目录
cd dist

# 初始化Git仓库
git init
git add -A
git commit -m "deploy"

# 推送到gh-pages分支
git push -f git@gitee.com:username/repo.git main:gh-pages

cd -
```

**使用场景**：个人博客、文档站点、项目演示。

---

## 16. Gitee CI/CD

### 16.1 Gitee Go 完整配置

```yaml
# .gitee-ci.yml
version: 1.0
name: frontend-pipeline

# 全局变量
variables:
  NODE_VERSION: "18"
  NPM_REGISTRY: "https://registry.npmmirror.com"

# 触发条件
triggers:
  push:
    branches:
      include:
        - main
        - develop
        - release/*
      exclude:
        - feature/*
  pull_request:
    branches:
      - main
  tag:
    - v*

# 阶段定义
stages:
  # 安装依赖
  - name: install
    image: node:18-alpine
    script:
      - npm config set registry $NPM_REGISTRY
      - npm ci
    cache:
      key: npm-cache
      paths:
        - node_modules/

  # 代码检查
  - name: lint
    image: node:18-alpine
    script:
      - npm run lint
    depends_on:
      - install

  # 单元测试
  - name: test
    image: node:18-alpine
    script:
      - npm run test:coverage
    depends_on:
      - install
    artifacts:
      paths:
        - coverage/

  # 构建
  - name: build
    image: node:18-alpine
    script:
      - npm run build
    depends_on:
      - lint
      - test
    artifacts:
      paths:
        - dist/

  # 部署到测试环境
  - name: deploy-test
    script:
      - echo "Deploying to test environment..."
      - scp -r dist/* user@test-server:/var/www/html/
    depends_on:
      - build
    only:
      - develop

  # 部署到生产环境
  - name: deploy-prod
    script:
      - echo "Deploying to production..."
      - scp -r dist/* user@prod-server:/var/www/html/
    depends_on:
      - build
    only:
      - main
    when: manual  # 手动触发
```

### 16.2 与 Jenkins 集成

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        GITEE_TOKEN = credentials('gitee-token')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'gitee-credentials',
                    url: 'git@gitee.com:username/repo.git'
            }
        }
        
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }
    
    post {
        success {
            // 更新Gitee提交状态
            sh '''
            curl -X POST "https://gitee.com/api/v5/repos/username/repo/statuses/${GIT_COMMIT}" \
              -H "Content-Type: application/json" \
              -d '{
                "access_token": "'"${GITEE_TOKEN}"'",
                "state": "success",
                "target_url": "'"${BUILD_URL}"'",
                "description": "Build succeeded",
                "context": "jenkins/build"
              }'
            '''
        }
    }
}
```

**使用场景**：自动化构建、测试、部署流水线。

---

## 17. Gitee Webhook

### 17.1 配置 Webhook

在仓库设置 -> Webhooks 中添加：

- URL: 你的服务器接收地址
- 密码: 用于验证的密钥
- 事件: Push、Pull Request、Issue等

### 17.2 Node.js Webhook 服务器

```javascript
// webhook-server.js
const express = require('express');
const crypto = require('crypto');
const { execSync } = require('child_process');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = 'your-webhook-secret';

// 验证签名
function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return signature === digest;
}

// 处理 Push 事件
app.post('/webhook/gitee', (req, res) => {
  const signature = req.headers['x-gitee-token'];
  const event = req.headers['x-gitee-event'];
  
  // 验证密钥
  if (signature !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const payload = req.body;
  
  switch (event) {
    case 'Push Hook':
      handlePush(payload);
      break;
    case 'Merge Request Hook':
      handleMergeRequest(payload);
      break;
    case 'Issue Hook':
      handleIssue(payload);
      break;
    default:
      console.log('Unknown event:', event);
  }
  
  res.json({ status: 'ok' });
});

function handlePush(payload) {
  const branch = payload.ref.replace('refs/heads/', '');
  const repository = payload.repository.path;
  
  console.log(`Push to ${repository}/${branch}`);
  
  // 自动部署
  if (branch === 'main') {
    try {
      execSync('cd /var/www/html && git pull origin main && npm install && npm run build');
      console.log('Deploy succeeded');
    } catch (error) {
      console.error('Deploy failed:', error);
    }
  }
}

function handleMergeRequest(payload) {
  const action = payload.action;
  const title = payload.pull_request.title;
  
  if (action === 'merge') {
    console.log(`PR merged: ${title}`);
    // 发送通知等
  }
}

function handleIssue(payload) {
  const action = payload.action;
  const title = payload.issue.title;
  
  console.log(`Issue ${action}: ${title}`);
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

### 17.3 自动部署脚本

```bash
#!/bin/bash
# auto-deploy.sh

PROJECT_PATH="/var/www/my-project"
LOG_FILE="/var/log/deploy.log"

echo "$(date) - Starting deployment..." >> $LOG_FILE

cd $PROJECT_PATH

# 拉取最新代码
git pull origin main >> $LOG_FILE 2>&1

# 安装依赖
npm install >> $LOG_FILE 2>&1

# 构建项目
npm run build >> $LOG_FILE 2>&1

# 重启服务
pm2 restart my-app >> $LOG_FILE 2>&1

echo "$(date) - Deployment completed" >> $LOG_FILE
```

**使用场景**：代码推送自动触发部署、通知机器人、同步到其他系统。

---

## 18. 常用技巧与最佳实践

### 18.1 Git 别名配置

```bash
# 常用别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.last "log -1 HEAD"
git config --global alias.unstage "reset HEAD --"
git config --global alias.amend "commit --amend --no-edit"
git config --global alias.undo "reset --soft HEAD~1"
```

### 18.2 .gitconfig 完整配置

```ini
# ~/.gitconfig
[user]
    name = Your Name
    email = your@email.com

[core]
    editor = code --wait
    autocrlf = input
    ignorecase = false

[init]
    defaultBranch = main

[pull]
    rebase = true

[push]
    default = current

[merge]
    tool = vscode
    conflictstyle = diff3

[mergetool "vscode"]
    cmd = code --wait $MERGED

[diff]
    tool = vscode

[difftool "vscode"]
    cmd = code --wait --diff $LOCAL $REMOTE

[alias]
    st = status -sb
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --all --decorate
    last = log -1 HEAD --stat
    unstage = reset HEAD --
    amend = commit --amend --no-edit
    undo = reset --soft HEAD~1
    cleanup = "!git branch --merged | grep -v '\\*\\|main\\|develop' | xargs -n 1 git branch -d"

[color]
    ui = auto
    status = auto
    branch = auto

[credential]
    helper = cache --timeout=3600
```

### 18.3 分支命名规范

```
# 功能分支
feature/user-login
feature/order-management
feature/123-add-payment  # 带Issue编号

# 修复分支
fix/login-validation
hotfix/security-patch
bugfix/456-cart-error

# 发布分支
release/v1.0.0
release/2024-01

# 其他
chore/update-dependencies
docs/api-documentation
refactor/user-service
```

### 18.4 提交规范工具

```bash
# 安装 commitizen
npm install -g commitizen cz-conventional-changelog

# 配置
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc

# 使用
git cz  # 代替 git commit
```

```json
// package.json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

### 18.5 Git Hooks

```bash
# .git/hooks/pre-commit
#!/bin/sh

# 运行lint检查
npm run lint
if [ $? -ne 0 ]; then
  echo "Lint check failed. Please fix errors before committing."
  exit 1
fi

# 运行测试
npm run test
if [ $? -ne 0 ]; then
  echo "Tests failed. Please fix tests before committing."
  exit 1
fi
```

```bash
# 使用 husky 管理 hooks
npm install husky lint-staged --save-dev

# package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "stylelint --fix"
    ]
  }
}
```

### 18.6 大文件管理（Git LFS）

```bash
# 安装 Git LFS
git lfs install

# 跟踪大文件
git lfs track "*.psd"
git lfs track "*.zip"
git lfs track "videos/*"

# 查看跟踪的文件类型
git lfs track

# 查看LFS文件
git lfs ls-files

# 添加 .gitattributes
git add .gitattributes
git commit -m "Add LFS tracking"
```

**使用场景**：管理设计稿、视频、大型数据文件等。

### 18.7 清理与优化

```bash
# 清理无用文件
git clean -fd  # 删除未跟踪的文件和目录
git clean -fdx  # 包括被忽略的文件

# 垃圾回收
git gc

# 优化仓库
git gc --aggressive --prune=now

# 查看仓库大小
git count-objects -vH

# 查找大文件
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sort -k3 -n -r | head -20
```

### 18.8 常见问题解决

```bash
# 问题1: push被拒绝（远程有新提交）
git pull --rebase origin main
git push origin main

# 问题2: 修改已推送的提交消息
# 仅限个人分支，不要修改公共分支
git commit --amend -m "新消息"
git push -f origin branch-name

# 问题3: 撤销已推送的提交
git revert HEAD
git push origin main

# 问题4: 清理远程已删除的分支
git fetch --prune
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -d

# 问题5: 大仓库克隆慢
git clone --depth 1 --single-branch --branch main git@gitee.com:xxx/repo.git

# 问题6: 合并后撤销
git revert -m 1 <merge-commit-hash>

# 问题7: 修复detached HEAD
git checkout -b temp-branch
git checkout main
git merge temp-branch
```

---

## 附录：Git 命令速查表

| 命令 | 说明 |
|------|------|
| `git init` | 初始化仓库 |
| `git clone <url>` | 克隆仓库 |
| `git add <file>` | 添加到暂存区 |
| `git commit -m "msg"` | 提交 |
| `git push` | 推送到远程 |
| `git pull` | 拉取并合并 |
| `git fetch` | 获取远程更新 |
| `git branch` | 查看分支 |
| `git checkout <branch>` | 切换分支 |
| `git merge <branch>` | 合并分支 |
| `git rebase <branch>` | 变基 |
| `git stash` | 暂存修改 |
| `git log` | 查看历史 |
| `git diff` | 查看差异 |
| `git reset` | 回退 |
| `git revert` | 撤销提交 |
| `git tag` | 标签管理 |
| `git remote` | 远程仓库 |
| `git submodule` | 子模块 |
| `git cherry-pick` | 拣选提交 |

---

> 文档版本：v1.0  
> 更新时间：2024年  
> 适用于：Gitee 所有版本
