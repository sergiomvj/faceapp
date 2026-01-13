/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#137fec',
                secondary: '#617589',
                background: {
                    light: '#f6f7f8',
                    dark: '#101922'
                },
                surface: {
                    light: '#ffffff',
                    dark: '#1c242d'
                }
            },
            fontFamily: {
                display: ['Newsreader', 'serif'],
                sans: ['Inter', 'Noto Sans', 'sans-serif'],
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio'),
    ],
    darkMode: 'class',
}
