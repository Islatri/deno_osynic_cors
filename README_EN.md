<!-- markdownlint-disable MD029 -->
# osynic-cors.deno.dev - OSU API CORS Proxy

[中文版本](README.md) | [English Version](README_EN.md)

## Project Overview

osynic-cors.deno.dev is a specialized CORS proxy server designed for the OSU API, built with Deno and Deno Deploy. This service solves cross-origin issues that browsers encounter when directly accessing the OSU API, enabling frontend applications to interact smoothly with the OSU API.

## Features

- 🚀 Built on Deno Deploy for speed and stability
- 🔒 Secure cross-origin request handling
- 🛡️ Domain whitelist protection, allowing requests only from specified origins
- 🔄 Support for common HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- 📝 Detailed request logging
- 🎯 Optimized specifically for the OSU API

## How It Works

The proxy server receives requests from clients, forwards them to the OSU API server, and adds necessary CORS headers to the responses, allowing browsers to accept data from different domains.

The request flow is as follows:

```bash
Client → osynic-cors.deno.dev → osu.ppy.sh/api → osynic-cors.deno.dev → Client
```

## Usage

### Basic Usage

Send your OSU API requests to URLs in the following format:

```bash
https://osynic-cors.deno.dev/https://osu.ppy.sh/api/your-api-path?your-parameters
```

### Example

Fetching beatmap information:

```bash
https://osynic-cors.deno.dev/https://osu.ppy.sh/api/get_beatmaps?k=your-api-key&s=114514
```

### Important Notes

- Request URLs must start with `https://osu.ppy.sh/api/`
- Currently, cross-origin requests are only allowed from `https://osynic-osuapi.deno.dev`
- All original query parameters are preserved and passed to the OSU API

## Error Handling

The server will return the following errors:

- **400 Error**: When the request path format is incorrect
- **500 Error**: When an internal error occurs during the proxy process

## Deployment Instructions

### Deploying on Deno Deploy

1. Create a Deno Deploy project
2. Upload this code or connect to your GitHub repository
3. After deployment, you'll receive a `*.deno.dev` domain

### Local Development

1. Install [Deno](https://deno.land/)
2. Clone the repository
3. Run the appropriate commands in the project directory:

#### Using Task Commands (Recommended)

```bash
# Start the local debug server (runs proxy_server.ts)
deno task dev

# Run the deployment version (Deno Deploy)
deno task deploy

# Format code
deno task fmt

# Lint code
deno task lint

# Type checking
deno task check
```

#### Direct Execution (Without Tasks)

```bash
# Local debugging
deno run --allow-net proxy_server.ts

# Deployment version
deno run --allow-net deploy.ts
```

### Environment Variables Configuration

This project supports configuration through the `.env` file or environment variables. Create or edit the `.env` file in the project root directory:

```properties
# Your Web Application URLs (CORS whitelist), multiple URLs separated by commas
WEBAPP_URLS=http://localhost:5173,https://yourdomain.com
```

**Environment Variables Description:**

| Environment Variable | Description | Example | Required |
|-----|------|---------|----------|
| `WEBAPP_URLS` | Web application URL whitelist, multiple URLs separated by commas | `http://localhost:5173,https://yourdomain.com` | No |

- If `WEBAPP_URLS` is not set, the default value is `http://localhost:5173`
- Multiple domains are supported, separated by commas (whitespace around commas is automatically trimmed)
- In production environments, it is strongly recommended to set specific domain whitelists instead of using wildcards

### Local Debug Configuration

- The server will start at `http://localhost:8000`
- Access example: `http://localhost:8000/https://osu.ppy.sh/api/get_beatmaps?k=YOUR_KEY&s=114514`
- `proxy_server.ts` allows all origins by default (`ALLOWED_ORIGINS = ["*"]`), suitable for development

### Configure Origin Whitelist

When deploying to Deno Deploy, the system automatically reads the `WEBAPP_URLS` from the `.env` file to configure the whitelist. To manually configure, you can edit the `ALLOWED_ORIGINS` in `proxy_server.ts` or `deploy.ts`:

```typescript
// Development environment: allow all origins
const ALLOWED_ORIGINS = ["*"];

// Production environment: restrict to specific origins (recommended)
const ALLOWED_ORIGINS = ["https://yourdomain.com", "http://localhost:3000"];
```

## Security Considerations

- This proxy server should limit allowed origins to prevent abuse
- In production environments, it's advised not to use `*` as an allowed origin
- The service does not store or log sensitive information such as API keys

## Contribution Guidelines

Issues and Pull Requests to improve this project are welcome. Before submitting, please ensure:

1. Code follows the existing code style
2. Necessary comments and documentation are added
3. Your changes have been tested

## Related Projects

- [osynic-osuapi.deno.dev](https://osynic-osuapi.deno.dev) - An OSU API frontend application using this proxy service

## License

To be determined - Please contact the project author for license information

## Contact

For questions or suggestions, please contact the project maintainer via GitHub.

---

*This project is for learning and research purposes only and is not affiliated with osu! official.*
