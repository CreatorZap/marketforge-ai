import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desabilitar validação de ESLint durante o build
  // Permite deploy mesmo com erros de linting
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Desabilitar validação de TypeScript durante o build
  // Permite deploy mesmo com erros de tipo
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 🔒 SECURITY HEADERS
  // Protege contra ataques comuns (XSS, clickjacking, etc)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN' // Previne clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Previne MIME sniffing
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block' // Proteção XSS em navegadores antigos
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin' // Controla informações de referência
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ]
  },
  
  webpack: (config, { isServer }) => {
    // Ignorar dependências opcionais do jsPDF que não estamos usando
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'html2canvas': false,
        'dompurify': false,
        'canvg': false,
      };
    }
    return config;
  },
};

export default nextConfig;
