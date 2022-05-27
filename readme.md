## api_front

- `npm install`
- `npx tsc --init`
    - tsconfig.json →
        - "declaration": true,
        - "sourceMap": true,
        - "outDir": "./dist",
- `npx tsc`
- copy .env.example, rename it .env & fill vars
    - secret : any strong random string
- `npm run build`
- `npm run start`