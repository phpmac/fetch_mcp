# Fetch MCP 服务器

[English](./README.md) | [中文](./README_ZH.md)

该 MCP 服务器提供了以多种格式获取网页内容的功能，包括 HTML、JSON、纯文本和 Markdown。

### 工具

- **fetch_html**

  - 获取网站内容并以 HTML 格式返回
  - 输入参数：
    - `url` (字符串，必需)：要获取的网站 URL
    - `headers` (对象，可选)：请求中要包含的自定义头部
  - 返回网页的原始 HTML 内容

- **fetch_json**

  - 从 URL 获取 JSON 文件
  - 输入参数：
    - `url` (字符串，必需)：要获取的 JSON 的 URL
    - `headers` (对象，可选)：请求中要包含的自定义头部
  - 返回解析后的 JSON 内容

- **fetch_txt**

  - 获取网站内容并以纯文本格式返回（无 HTML）
  - 输入参数：
    - `url` (字符串，必需)：要获取的网站 URL
    - `headers` (对象，可选)：请求中要包含的自定义头部
  - 返回网页的文本内容，已移除 HTML 标签、脚本和样式

- **fetch_markdown**
  - 获取网站内容并以 Markdown 格式返回
  - 输入参数：
    - `url` (字符串，必需)：要获取的网站 URL
    - `headers` (对象，可选)：请求中要包含的自定义头部
  - 返回转换为 Markdown 格式的网页内容

### 2 种启动方法

1. bun

```bash
bun i
bun start
```

2. docker

```bash
docker compose up --build -d
```

### 使用方法

```json
{
  "mcpServers": {
    "fetch-mcp": {
      "transport": "sse",
      "url": "http://localhost:3000/sse",
      "headers": {
        "Authorization": "Bearer your-token-here",
        "X-Custom-Header": "custom-value"
      },
      "useNodeEventSource": true
    }
  }
}
```

### 资源

此服务器不提供任何持久化资源。它被设计为按需获取和转换网页内容。

### 参考

- [原作者 zcaceres/fetch-mcp](https://github.com/zcaceres/fetch-mcp)
