import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { RequestPayloadSchema } from "./types.js";
import { Fetcher } from "./Fetcher.js";
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const app = express();

const server = new Server(
  {
    name: "zcaceres/fetch",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "fetch_html",
        description: "Fetch a website and return the content as HTML",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the website to fetch",
            },
            headers: {
              type: "object",
              description: "Optional headers to include in the request",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "fetch_markdown",
        description: "Fetch a website and return the content as Markdown",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the website to fetch",
            },
            headers: {
              type: "object",
              description: "Optional headers to include in the request",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "fetch_txt",
        description: "Fetch a website, return the content as plain text (no HTML)",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the website to fetch",
            },
            headers: {
              type: "object",
              description: "Optional headers to include in the request",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "fetch_json",
        description: "Fetch a JSON file from a URL",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the JSON to fetch",
            },
            headers: {
              type: "object",
              description: "Optional headers to include in the request",
            },
          },
          required: ["url"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const validatedArgs = RequestPayloadSchema.parse(args);

  if (request.params.name === "fetch_html") {
    const fetchResult = await Fetcher.html(validatedArgs);
    return fetchResult;
  }
  if (request.params.name === "fetch_json") {
    const fetchResult = await Fetcher.json(validatedArgs);
    return fetchResult;
  }
  if (request.params.name === "fetch_txt") {
    const fetchResult = await Fetcher.txt(validatedArgs);
    return fetchResult;
  }
  if (request.params.name === "fetch_markdown") {
    const fetchResult = await Fetcher.markdown(validatedArgs);
    return fetchResult;
  }
  throw new Error("Tool not found");
});

let transport: SSEServerTransport | null = null;

// 添加重连和错误处理
const connectTransport = (res: express.Response) => {
  try {
    transport = new SSEServerTransport("/messages", res);
    server.connect(transport);

    transport.onerror = (error) => {
      console.error("Transport error:", error);
      transport = null;
    };

    return true;
  } catch (error) {
    console.error("Failed to create transport:", error);
    return false;
  }
};

app.get("/sse", (req, res) => {
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");

  if (!connectTransport(res)) {
    res.status(500).send("Failed to establish SSE connection");
    return;
  }
});

app.post("/messages", (req, res) => {
  if (!transport) {
    res.status(503).send("Transport not available");
    return;
  }

  try {
    transport.handlePostMessage(req, res);
  } catch (error) {
    console.error("Error handling post message:", error);
    res.status(500).send("Internal server error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
