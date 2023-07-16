/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                "nunito": ["Nunito", "sans-serif"]
            },
            screens: {
                "phone": "444px",
                // => @media (min-width: 640px) { ... }

                "phone-1": "516px",
                // => @media (min-width: 640px) { ... }

                "tablet": "640px",
                // => @media (min-width: 640px) { ... }

                "laptop": "1024px",
                // => @media (min-width: 1024px) { ... }

                "desktop": "1280px",
                // => @media (min-width: 1280px) { ... }
            },
        },
    },
    plugins: [],
}

