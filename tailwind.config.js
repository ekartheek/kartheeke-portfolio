/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        chassis: {
          950: '#04070c',
          900: '#070c14',
          850: '#0b121e',
          800: '#101a2b',
          700: '#17243b',
          600: '#223454',
          border: '#1b2a44'
        },
        noc: {
          green: '#10b981',
          emerald: '#059669',
          cyan: '#0284c7',
          sky: '#38bdf8',
          amber: '#f59e0b',
          gold: '#d97706',
          blue: '#2563eb',
          slate: '#64748b'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'laser-stream': 'laserStream 4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'laser-stream-delayed': 'laserStream 4.5s 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        laserStream: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' }
        }
      }
    }
  },
  plugins: []
};
