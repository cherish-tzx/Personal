# 把个人博客项目发布到 GitHub 的步骤说明

下面每一步都会说明「做什么」以及「命令/操作的含义」。

---

## 前提

- 已安装 [Git](https://git-scm.com/)
- 已有 [GitHub](https://github.com/) 账号

---

## 第一步：在项目根目录初始化 Git 仓库

在项目根目录（有 `package.json` 的目录）打开终端，执行：

```bash
git init
```

**含义**：在当前文件夹里创建一个隐藏的 `.git` 目录，让这个文件夹变成一个「Git 仓库」。之后所有版本记录、分支、提交历史都会保存在这里。只需执行一次。

---

## 第二步：配置用户信息（若从未配置过）

如果这是你第一次在本机用 Git，需要先设置姓名和邮箱（会出现在每次提交记录里）：

```bash
git config --global user.name "你的名字或昵称"
git config --global user.email "你的GitHub邮箱"
```

**含义**：  
- `user.name`：提交时显示的作者名。  
- `user.email`：最好填你在 GitHub 上绑定的邮箱，便于和账号关联。  
- `--global`：对本机所有仓库生效，只需配置一次。

若已经配置过，可跳过这一步。

---

## 第三步：添加要提交的文件

```bash
git add .
```

**含义**：  
- `git add`：把文件的「当前状态」加入「暂存区」（staging area）。  
- `.`：表示当前目录及子目录下所有**未被 .gitignore 忽略**的文件。  
暂存区相当于「准备提交的清单」，提交时只会提交这里面的内容。

也可以用 `git add 某个文件或文件夹` 只添加部分文件。

---

## 第四步：做第一次提交（commit）

```bash
git commit -m "初始提交：个人博客项目"
```

**含义**：  
- `git commit`：用暂存区里的内容生成一个「提交」（commit），相当于一次快照。  
- `-m "..."`：为这次提交写一条说明，方便以后查看历史。  
每个 commit 都有一个唯一 ID，之后可以回退、对比等。

---

## 第五步：在 GitHub 上新建仓库

1. 登录 [GitHub](https://github.com/)
2. 右上角 **「+」→「New repository」**
3. 填写：
   - **Repository name**：例如 `my-blog`（仓库名，可自定）
   - **Description**：可选，简短描述
   - 选择 **Public**
   - **不要**勾选 "Add a README file"（因为本地已有项目）
4. 点击 **「Create repository」**

**含义**：在 GitHub 上创建一个「空仓库」，用来存放你本地的代码。不勾选 README 是为了避免和本地第一次推送产生冲突。

---

## 第六步：把本地仓库和 GitHub 仓库关联

创建完仓库后，GitHub 会给出仓库地址，例如：

- HTTPS：`https://github.com/你的用户名/my-blog.git`
- SSH：`git@github.com:你的用户名/my-blog.git`

在项目根目录执行（把地址换成你自己的）：

```bash
git remote add origin https://github.com/你的用户名/my-blog.git
```

**含义**：  
- `git remote add`：添加一个「远程仓库」的简称。  
- `origin`：远程仓库的名字，习惯上第一个远程都叫 `origin`。  
- 后面的 URL：你在 GitHub 上刚创建的仓库地址。  
这样以后执行 `git push origin main` 时，Git 就知道要推送到哪个仓库。

---

## 第七步：设置主分支名为 main（如需要）

Git 新版本默认分支名是 `main`，GitHub 也默认用 `main`。若你当前分支是 `master`，可改成 `main`：

```bash
git branch -M main
```

**含义**：把当前分支重命名为 `main`。`-M` 是强制重命名。若本来就是 `main`，可跳过。

---

## 第八步：推送到 GitHub

```bash
git push -u origin main
```

**含义**：  
- `git push`：把本地当前分支的提交「推」到远程仓库。  
- `origin`：远程仓库名（第六步里起的）。  
- `main`：要推送的本地分支名。  
- `-u origin main`：把本地 `main` 和远程 `origin/main` 建立「上游」关联，以后在同一分支只需执行 `git push` 即可。

第一次推送可能需要登录 GitHub（HTTPS 会提示输入用户名/密码或 Token）。

---

## 之后日常更新流程

改完代码后，一般按这三步即可：

```bash
git add .
git commit -m "简短描述你做了什么"
git push
```

- `git add .`：把修改加入暂存区  
- `git commit -m "..."`：生成一次提交  
- `git push`：推到 GitHub

---

## 常见问题

1. **推送时提示要登录**  
   使用 HTTPS 时，GitHub 已不支持账号密码，需要用 **Personal Access Token** 当密码。在 GitHub → Settings → Developer settings → Personal access tokens 里生成。

2. **提示 "failed to push some refs"**  
   若 GitHub 上已有 README 等文件，需要先拉再推：  
   `git pull origin main --rebase`  
   然后再 `git push origin main`。

3. **想忽略某些文件**  
   在项目根目录的 `.gitignore` 里加上路径或通配符，例如已为你添加了 `node_modules/`、`.history/` 等，可按需修改。

---

按上面步骤做完，你的个人博客项目就会出现在 GitHub 上，并且可以在别处克隆、备份或部署（如 GitHub Pages）。
