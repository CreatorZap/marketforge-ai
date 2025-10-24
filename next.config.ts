import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
