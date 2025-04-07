# Fetch MCP Server

[English](./README.md) | [中文](./README_ZH.md)

This MCP server provides functionality to fetch web content in various formats, including HTML, JSON, plain text, and Markdown.

### Tools

- **fetch_html**

  - Fetch website content and return as HTML
  - Input parameters:
    - `url` (string, required): URL of the website to fetch
    - `headers` (object, optional): Custom headers to include in the request
  - Returns the raw HTML content of the webpage

- **fetch_json**

  - Fetch JSON file from URL
  - Input parameters:
    - `url` (string, required): URL of the JSON to fetch
    - `headers` (object, optional): Custom headers to include in the request
  - Returns the parsed JSON content

- **fetch_txt**

  - Fetch website content and return as plain text (no HTML)
  - Input parameters:
    - `url` (string, required): URL of the website to fetch
    - `headers` (object, optional): Custom headers to include in the request
  - Returns the text content of the webpage with HTML tags, scripts, and styles removed

- **fetch_markdown**
  - Fetch website content and return as Markdown
  - Input parameters:
    - `url` (string, required): URL of the website to fetch
    - `headers` (object, optional): Custom headers to include in the request
  - Returns the webpage content converted to Markdown format

### 2 Ways to Start

1. bun

```bash
bun i
bun start
```

2. docker

```bash
docker compose up --build -d
```

### Usage

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

### Resources

This server does not provide any persistent resources. It is designed to fetch and transform web content on demand.

### References

- [Original Repository zcaceres/fetch-mcp](https://github.com/zcaceres/fetch-mcp)
