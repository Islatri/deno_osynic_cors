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
3. Run the following command:

```bash
deno run --allow-net server.ts
```

## Configuration Options

In the code, you can modify the following configuration:

```typescript
const ALLOWED_ORIGINS = ["https://osynic-osuapi.deno.dev"]; // List of allowed origins
```

You can add more allowed origins as needed, or set it to `["*"]` to allow all origins (not recommended for production environments).

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
