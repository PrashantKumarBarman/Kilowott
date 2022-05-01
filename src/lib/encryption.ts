import crypto from 'crypto';

function createHash(string: string) : string {
    return crypto.createHash('sha256').update(string).digest('hex');
}

export { createHash };