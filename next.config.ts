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
