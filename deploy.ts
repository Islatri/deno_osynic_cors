import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

// 加载 .env 文件（如果存在）
let env: Record<string, string> = {};
try {
  env = await load();
} catch (error) {
  // 在部署环境中可能没有 .env 文件，这是正常的
  const errMsg = error instanceof Error ? error.message : String(error);
  console.error("⚠️ .env file not found, proceeding with environment variables:", errMsg);
  console.log("ℹ️ .env file not found, using environment variables instead");
}

const webappUrlsString = env.WEBAPP_URLS || Deno.env.get("WEBAPP_URLS") || "http://localhost:5173";
const webappUrls = webappUrlsString.split(",").map((url: string) => url.trim());
console.log("允许的 Web 应用 URL:", webappUrls);

// 不再需要指定PORT，Deno Deploy会自动处理
const ALLOWED_ORIGINS = webappUrls.length > 0 ? webappUrls : ["*"];

async function handleRequest(request: Request): Promise<Response> {
  // 处理CORS逻辑 - 获取请求的Origin
  const origin = request.headers.get("Origin") || "";
  
  // 确定是否允许该Origin
  let allowOrigin = "*"; // 默认值
  if (ALLOWED_ORIGINS[0] !== "*") {
    // 只有当ALLOWED_ORIGINS不是通配符时才进行检查
    allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";
  }
  
  // 获取请求 URL
  const url = new URL(request.url);
  let targetURL: string;
  
  // 移除开头的斜杠并获取目标 URL
  const pathname = url.pathname.substring(1); // 去掉开头的 "/"
  // 判断是否是https://osu.ppy.sh/api/开头，不是则返回错误
  
  // 检查是否提供了有效的 URL
  if (!pathname) {
    return new Response("请在路径中提供目标 URL\n例如: /https://osu.ppy.sh/api/get_beatmaps?k=&s=114514", { 
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin
      }
    });
  }
  
  if (!pathname.startsWith("https://osu.ppy.sh/")) {
    return new Response("请在路径中提供正确的osu!api调用 \n例如: /https://osu.ppy.sh/api/get_beatmaps?k=&s=114514", { 
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin
      }
    });
  }

  // 构造目标 URL（确保包含 http:// 或 https://）
  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    targetURL = pathname;
  } else {
    targetURL = "https://" + pathname;
  }
  
  // 添加原始查询参数
  const targetURLObj = new URL(targetURL);
  for (const [key, value] of url.searchParams.entries()) {
    targetURLObj.searchParams.set(key, value);
  }
  
  targetURL = targetURLObj.toString();
  console.log(`代理请求到: ${targetURL}`);
  
  try {
    // 处理预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "*", // 允许所有头信息
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 创建转发请求
    const requestHeaders = new Headers();
    
    // 复制所有请求头，排除特定头
    for (const [key, value] of request.headers.entries()) {
      // 排除一些可能导致问题的头
      if (
        !["host", "origin", "referer", "connection", "sec-fetch-mode", 
        "sec-fetch-site", "sec-fetch-dest"].includes(key.toLowerCase())
      ) {
        requestHeaders.set(key, value);
      }
    }

    // 创建转发请求配置
    const requestInit: RequestInit = {
      method: request.method,
      headers: requestHeaders,
    };

    // 如果请求有 body，添加到转发请求
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      requestInit.body = await request.blob();
    }

    // 转发请求到目标 URL
    const response = await fetch(targetURL, requestInit);
    
    // 创建响应头
    const responseHeaders = new Headers();
    
    // 复制原始响应头
    for (const [key, value] of response.headers.entries()) {
      responseHeaders.set(key, value);
    }

    // 添加 CORS 头，使用ALLOWED_ORIGINS
    responseHeaders.set("Access-Control-Allow-Origin", allowOrigin);
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "*");
    
    // 添加代理信息头
    responseHeaders.set("X-Proxied-By", "Deno CORS Proxy");

    // 获取响应体
    const responseBody = await response.arrayBuffer();
    
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error("代理错误:", error);
    return new Response(`代理错误: ${error.message}`, { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin
      }
    });
  }
}

// 直接启动服务，不需要指定端口
console.log(`CORS 代理服务器已启动`);
serve(handleRequest);