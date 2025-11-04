<!-- markdownlint-disable MD029 -->
# osynic-cors.deno.dev - OSU API CORS 代理服务

[中文版本](README.md) | [English Version](README_EN.md)

## 项目简介

osynic-cors.deno.dev 是一个专门为 OSU API 设计的 CORS 代理服务器，基于 Deno 和 Deno Deploy 构建。该服务解决了浏览器端直接访问 OSU API 时可能遇到的跨域问题，使前端应用能够顺利地与 OSU API 进行交互。

## 特性

- 🚀 基于 Deno Deploy 搭建，快速且稳定
- 🔒 安全的跨域请求处理
- 🛡️ 域名白名单保护，仅允许指定来源的请求
- 🔄 支持常见 HTTP 方法（GET, POST, PUT, DELETE, OPTIONS）
- 📝 详细的请求日志记录
- 🎯 专为 OSU API 优化

## 工作原理

该代理服务接收来自客户端的请求，转发至 OSU API 服务器，并在返回响应时添加必要的 CORS 头信息，从而允许浏览器接受来自不同域的响应数据。

请求流程如下：

```bash
客户端 → osynic-cors.deno.dev → osu.ppy.sh/api → osynic-cors.deno.dev → 客户端
```

## 使用方法

### 基本用法

将您的 OSU API 请求发送到以下格式的 URL：

```bash
https://osynic-cors.deno.dev/https://osu.ppy.sh/api/您的API路径?您的参数
```

### 示例

获取谱面信息：

```bash
https://osynic-cors.deno.dev/https://osu.ppy.sh/api/get_beatmaps?k=您的API密钥&s=114514
```

### 注意事项

- 请求 URL 必须以 `https://osu.ppy.sh/api/` 开头
- 目前仅允许来自 `https://osynic-osuapi.deno.dev` 的跨域请求
- 所有原始查询参数将被保留并传递给 OSU API

## 错误处理

服务器会返回以下错误：

- **400 错误**：当请求路径格式不正确时
- **500 错误**：当代理过程中发生内部错误时

## 部署说明

### 在 Deno Deploy 上部署

1. 创建一个 Deno Deploy 项目
2. 上传此代码或连接到您的 GitHub 代码库
3. 部署完成后，您将获得一个 `*.deno.dev` 的域名

### 本地开发

1. 安装 [Deno](https://deno.land/)
2. 克隆代码库
3. 在项目目录下运行相应命令：

#### 使用任务命令（推荐）

```bash
# 启动本地调试服务器（运行 proxy_server.ts）
deno task dev

# 运行部署版本（Deno Deploy）
deno task deploy

# 代码格式化
deno task fmt

# 代码检查
deno task lint

# 类型检查
deno task check
```

#### 直接运行（不使用任务）

```bash
# 本地调试
deno run --allow-net proxy_server.ts

# 部署版本
deno run --allow-net deploy.ts
```

### 本地调试配置

- 服务器将在 `http://localhost:8000` 启动
- 访问示例：`http://localhost:8000/https://osu.ppy.sh/api/get_beatmaps?k=YOUR_KEY&s=114514`
- `proxy_server.ts` 默认允许所有源站（`ALLOWED_ORIGINS = ["*"]`），适合开发用

### 配置源站白名单

在 `proxy_server.ts` 或 `deploy.ts` 中修改 `ALLOWED_ORIGINS`：

```typescript
// 开发环境：允许所有源站
const ALLOWED_ORIGINS = ["*"];

// 生产环境：限制特定源站（推荐）
const ALLOWED_ORIGINS = ["https://yourdomain.com", "http://localhost:3000"];
```

## 安全性考虑

- 此代理服务器应限制允许的源站以防止滥用
- 在生产环境中，建议不要使用 `*` 作为允许的源站
- 服务不存储或记录 API 密钥等敏感信息

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进此项目。提交前请确保：

1. 代码遵循现有的代码风格
2. 添加必要的注释和文档
3. 测试您的更改

## 相关项目

- [osynic-osuapi.deno.dev](https://osynic-osuapi.deno.dev) - 使用此代理服务的 OSU API 前端应用

## 许可证

待定 - 请联系项目作者确认许可证信息

## 联系方式

如有问题或建议，请通过 GitHub 联系项目维护者。

---

*此项目仅用于学习和研究目的，与 osu! 官方无关。*
