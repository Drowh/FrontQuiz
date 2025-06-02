/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3cdfff",
          light: "#031fac",
        },
        secondary: {
          DEFAULT: "#683de5",
          light: "#4a2ca3",
        },
        third: {
          DEFAULT: "#0cf2b4",
          light: "#00b38f",
        },
        dark: {
          bg: "#0c0c14",
          card: "#161626",
          sidebar: "#1f1f2e",
          border: "#2a2a40",
        },
        light: {
          bg: "#ffffff",
          card: "#f8f9fa",
          sidebar: "#f1f3f5",
          border: "#e9ecef",
        },
        text: {
          primary: {
            DEFAULT: "#d8ecff",
            light: "#1a1a1a",
          },
          secondary: {
            DEFAULT: "#f3f3f3",
            light: "#4a4a4a",
          },
        },
      },
      fontFamily: {
        "new-rocker": ['"New Rocker"', "fantasy", "Arial", "sans-serif"],
        tektur: ['"Tektur"', "monospace", "Arial", "sans-serif"],
        inter: ['"Inter"', "sans-serif"],
      },
      fontWeight: {
        tektur: "600",
      },
      boxShadow: {
        "card-hover": "0 5px 15px rgba(60, 223, 255, 0.1)",
        "card-hover-light": "0 5px 15px rgba(0, 0, 0, 0.1)",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease",
      },
      // Добавляем плавные переходы для всех элементов
      transitionProperty: {
        theme: "background-color, border-color, color, fill, stroke",
        colors: "background-color, border-color, color",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "gradient-flow": "gradient-flow 4s ease infinite",
        "gradient-flow-reverse": "gradient-flow-reverse 4s ease infinite",
        "gradient-flow-slow": "gradient-flow 6s ease infinite",
        "gradient-flow-reverse-slow": "gradient-flow-reverse 6s ease infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(2deg)" },
          "66%": { transform: "translateY(5px) rotate(-1deg)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(60, 223, 255, 0.3), 0 0 40px rgba(60, 223, 255, 0.2), 0 0 60px rgba(60, 223, 255, 0.1)",
          },
          "50%": {
            boxShadow:
              "0 0 30px rgba(60, 223, 255, 0.5), 0 0 60px rgba(60, 223, 255, 0.3), 0 0 90px rgba(60, 223, 255, 0.2)",
          },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "gradient-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "gradient-flow-reverse": {
          "0%": { backgroundPosition: "100% 50%" },
          "50%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "fade-in-up": {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      backgroundSize: {
        "gradient-flow": "200% 200%",
      },
    },
  },
  plugins: [
    // Добавляем плагин для глобальных переходов
    function ({ addBase }) {
      addBase({
        "*": {
          transitionProperty:
            "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
          transitionDuration: "300ms",
          transitionTimingFunction: "ease",
        },
      });
    },
  ],
};
