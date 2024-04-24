import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "drag-drop-border": `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%2364748BFF' stroke-width='4' stroke-dasharray='16' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");`,
        "drag-drop-border-dragover": `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%232563EBFF' stroke-width='4' stroke-dasharray='16' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");`,
        "drag-drop-border-success": `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%2322C55EFF' stroke-width='4' stroke-dasharray='16' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");`,
        "drag-drop-border-error": `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23EF4444FF' stroke-width='4' stroke-dasharray='16' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");`,
      },
    },
  },
  plugins: [],
};
export default config;
