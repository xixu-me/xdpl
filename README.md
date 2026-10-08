# XDPL

A lightweight proxy server for DeepL Translator built with [Nitro](https://nitro.build/), providing a clean API interface to DeepL's translation services.

## Features

- 🚀 Fast and lightweight proxy server
- 🔒 Secure routing through Nitro
- 🌐 Full DeepL API compatibility
- 📦 Easy deployment to various platforms
- ⚡ Built-in caching and optimization

## Tech Stack

- **Framework**: [Nitro](https://nitro.build/) - Universal JavaScript server
- **Runtime**: Node.js
- **Package Manager**: pnpm
- **TypeScript**: Full TypeScript support

## Getting Started

This project pins Nitro 3 (`3.0.260903-beta`) to avoid unpatched dependencies in Nitro 2.

### Prerequisites

- Node.js 22.12+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/xixu-me/XDPL.git
    cd XDPL
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Start the development server:

    ```bash
    pnpm dev
    ```

The server will start on `http://localhost:3000`

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm test` - Verify development and production proxy behavior

## Usage

The proxy server forwards all requests to DeepL's API. You can use it as a drop-in replacement for direct DeepL API calls:

```javascript
// Instead of calling https://www2.deepl.com/jsonrpc
// Call your deployed proxy
fetch('https://your-domain.vercel.app/jsonrpc', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    // Your DeepL API request
  })
})
```

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xixu-me/XDPL)

#### Option 1: One-Click Deploy

Click the "Deploy with Vercel" button above to deploy instantly.

#### Option 2: Manual Deploy via CLI

1. Install Vercel CLI:

    ```bash
    npm i -g vercel
    ```

2. Login to your Vercel account:

    ```bash
    vercel login
    ```

3. Deploy from your project directory:

    ```bash
    vercel
    ```

4. For production deployment:

    ```bash
    vercel --prod
    ```

#### Option 3: Deploy via Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Visit [vercel.com](https://vercel.com) and import your repository
3. Vercel will automatically detect the Nitro configuration and deploy

#### Vercel Configuration

The project is pre-configured for Vercel deployment. Nitro automatically generates the necessary Vercel configuration during the build process.

### Deploy to Other Platforms

This Nitro application can also be deployed to:

- **Netlify**: `nitro build --preset netlify`
- **Cloudflare Workers**: `nitro build --preset cloudflare-pages`
- **AWS Lambda**: `nitro build --preset aws-lambda`
- **DigitalOcean**: `nitro build --preset digitalocean`

For more deployment options, see the [Nitro deployment documentation](https://nitro.build/).

## Configuration

The main configuration is in `nitro.config.ts`:

```typescript
import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: ".",
  routeRules: {
    "/**": {
      proxy: "https://www2.deepl.com/**",
    },
  },
});
```

## Data Privacy & Security

### Privacy Considerations

- **Proxy Operation**: XDPL acts as a transparent proxy, forwarding requests directly to DeepL's servers without storing or logging translation content
- **No Data Retention**: Translation requests and responses pass through the proxy without being cached or stored locally
- **Direct Communication**: Your data flows directly between your application and DeepL's secure infrastructure

### Security Features

- **HTTPS Support**: All communications are encrypted in transit when deployed with HTTPS
- **No API Key Exposure**: Your DeepL API credentials remain between your client and DeepL's servers
- **Minimal Attack Surface**: Lightweight proxy design reduces potential security vulnerabilities
- **Server-Side Processing**: Runs on secure server infrastructure (Vercel, Netlify, etc.)

### Best Practices

- **Use HTTPS**: Always deploy with HTTPS enabled for encrypted communication
- **Environment Variables**: Store sensitive configuration in environment variables, not in code
- **Regular Updates**: Keep dependencies updated to ensure security patches are applied
- **Monitor Usage**: Implement proper logging and monitoring for your deployment

### Compliance

- **GDPR Friendly**: No personal data is stored or processed by the proxy
- **Data Sovereignty**: Translation data flows directly to DeepL, maintaining your existing compliance posture
- **Audit Trail**: Server logs can be configured according to your compliance requirements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
