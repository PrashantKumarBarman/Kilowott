/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              _id: 
 *                  type: string
 *              first_name:
 *                  type: string
 *              last_name:
 *                  type: string
 *              email:
 *                  type: string
 *              role: 
 *                  type: string
 *              createdAt:
 *                  type: string
 *              updateAt:
 *                  type: string
 *  securitySchemes:
 *      BearerAuth:
 *          type: http
 *          scheme: bearer
 */

/**
 * @swagger
 * path:
 * /user:
 *   get:
 *     summary: Retrieve list of all users
 *     description: Retrieve list of all users
 *     operationId: getAllUsers
 *     parameters:
 *      - in: header
 *        name: authorization
 *        schema:
 *          type: string
 *        required: true
 *     security:
 *      - BearerAuth: []
 *     responses:
 *      200:
 *          description: Returns list of all users
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/User'
 *      400:
 *          description: Unauthorized, no api token provided or invalid token
 *          content:
 *              text/plain:
 *                  schema:
 *                      type: string
 *                  
 */