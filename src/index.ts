import Koa from "koa";
import Router from "@koa/router";
import type { Context } from "koa";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { RequestPayloadSchema } from "./types.js";
import { Fetcher } from "./Fetcher.js";

const app = new Koa();
const router = new Router();

const server = new Server(
  {
    name: "mcp/fetch",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
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
        description:
          "Fetch a website, return the content as plain text (no HTML)",
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

router.get("/sse", async (ctx: Context) => {
  // 设置 SSE 所需的响应头
  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  transport = new SSEServerTransport("/messages", ctx.res);
  await server.connect(transport);
  ctx.status = 200;
});

router.post("/messages", async (ctx: Context) => {
  if (transport) {
    transport.handlePostMessage(ctx.req, ctx.res);
  }
  ctx.status = 200;
});

// 使用路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
