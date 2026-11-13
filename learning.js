import * as paillierBigint from './paillier-bigint.js';
import * as bigintConversion from './bigint-conversion.js';

const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(4096);

console.log("Public Key:", publicKey);
console.log("Private Key:", privateKey);

const unencrypted = 5031232n;
var c1 = publicKey.encrypt(unencrypted);

console.log("Unencrypted:", unencrypted);
console.log("Encrypted:", c1);

c1 = publicKey.addition(c1, publicKey.encrypt(200n));

console.log("Encrypted + 200:", c1);

var decrypted = privateKey.decrypt(c1);

console.log("Decrypted:", decrypted);