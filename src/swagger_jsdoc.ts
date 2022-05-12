import path from 'path';

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User api",
            version: "0.1.0",
            description: "Api for user management",
            license : {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html"
            },
            contact: {
                name: "Prashant Barman",
                contact: "https://veronicahub.com",
                email: "prashantkumarbarman@gmail.com"
            }
        },
        servers: [
            {
                url: "http://localhost:8080"
            }
        ],
        securityDefinitions: {

        },
        security: [{ bearerAuth: [] }]
    },
    apis: [path.resolve(__dirname, 'routes/docs/user.js')]
}

export { options };