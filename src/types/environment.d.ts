export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            MONGODB_USER: string;
            MONGODB_PASSWORD: string;
            MONGODB_HOST: string;
            MONGODB_PORT: string;
            MONGODB_DATABASE: string;
            COOKIE_SECRET: string;
            SMTP_HOST: string;
            SMTP_PORT: string;
            SMTP_USER: string;
            SMPT_PASSWORD: string;
            SMPT_FROM_EMAIL: string;
        }
    }
}
