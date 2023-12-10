/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                box: '#33386a',
                'hover-button-box': '#292d56',
                'active-button-box': '#191b34',
            },
        },
    },
    plugins: [],
};
