/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'chart-up': '#089981',
                'chart-down': '#F23645',
                'chart-bg': '#ffffff',
            }
        },
    },
    plugins: [],
}
