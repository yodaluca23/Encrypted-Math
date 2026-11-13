import * as paillierBigint from './paillier-bigint.js';

function decodePublicKey(encodedPublicKey) {
    const publicJson = JSON.parse(atob(encodedPublicKey));

    const publicKey = new paillierBigint.PublicKey(
        BigInt(publicJson.n),
        BigInt(publicJson.g)
    );

    return publicKey;
}

function decodePrivateKey(encodedPrivateKey, publicKey) {
    const privateJson = JSON.parse(atob(encodedPrivateKey));

    const privateKey = new paillierBigint.PrivateKey(
        BigInt(privateJson.lambda),
        BigInt(privateJson.mu),
        publicKey
    );

    return privateKey;
}

function encryptNumber() {
    console.log("Encrypting number...");
    const encodedPublicKey = document.getElementById("publicKey").value;
    const unencrypted = BigInt(document.getElementById("numberToEncrypt").value);
    const publicKey = decodePublicKey(encodedPublicKey);

    console.log("Unencrypted:", unencrypted);

    const encrypted = publicKey.encrypt(unencrypted);

    document.getElementById("encryptedResult").value = encrypted.toString();
}

document.getElementById("encryptButton").addEventListener("click", encryptNumber);

function generateKeys() {
    console.log("Generating keys...");
    paillierBigint.generateRandomKeys(4096).then(({ publicKey, privateKey }) => {

        const encodedPublicKey = btoa(JSON.stringify({
            n: publicKey.n.toString(),
            g: publicKey.g.toString()
        }));
        const encodedPrivateKey = btoa(JSON.stringify({
            lambda: privateKey.lambda.toString(),
            mu: privateKey.mu.toString()
        }));
        
        document.getElementById("publicKey").value = encodedPublicKey;
        document.getElementById("privateKey").value = encodedPrivateKey;
        document.getElementById("generatedPublicKey").value = encodedPublicKey;
        document.getElementById("generatedPrivateKey").value = encodedPrivateKey;
        document.getElementById("publicKeyForDecryption").value = encodedPublicKey;
        document.getElementById("publicKeyForAddition").value = encodedPublicKey;
        document.getElementById("publicKeyForMultiplication").value = encodedPublicKey;
    });
}

document.getElementById("generateKeyPairButton").addEventListener("click", generateKeys);

function decryptNumber() {
    console.log("Decrypting number...");
    const encodedPrivateKey = document.getElementById("privateKey").value;
    const encodedPublicKey = document.getElementById("publicKeyForDecryption").value;
    const encrypted = BigInt(document.getElementById("encryptedNumber").value);
    const publicKey = decodePublicKey(encodedPublicKey);
    const privateKey = decodePrivateKey(encodedPrivateKey, publicKey);
    
    const decrypted = privateKey.decrypt(encrypted);

    document.getElementById("decryptedResult").value = decrypted.toString();
}

document.getElementById("decryptButton").addEventListener("click", decryptNumber);

function copyPublicKeyUrl() {
    const publicKey = document.getElementById("generatedPublicKey").value;
    const url = new URL(window.location.href);
    url.hash = encodeURIComponent(publicKey);
    navigator.clipboard.writeText(url.toString());
}

document.getElementById("copyPublicKeyURLButton").addEventListener("click", copyPublicKeyUrl);

function encryptAddition() {
    const encodedPublicKey = document.getElementById("publicKeyForAddition").value;
    const encrypted1 = BigInt(document.getElementById("encryptedNumber1").value);
    const encrypted2 = BigInt(document.getElementById("encryptedNumber2").value);
    const publicKey = decodePublicKey(encodedPublicKey);

    const encryptedSum = publicKey.addition(encrypted1, encrypted2);

    document.getElementById("encryptedSumResult").value = encryptedSum.toString();
}

document.getElementById("addButton").addEventListener("click", encryptAddition);

function encryptMultiplication() {
    console.log("Encrypting multiplication...");
    const encodedPublicKey = document.getElementById("publicKeyForMultiplication").value;
    const unencrypted = BigInt(document.getElementById("encryptedNumberForMultiplication").value);
    const multiplier = BigInt(document.getElementById("scalar").value);
    const publicKey = decodePublicKey(encodedPublicKey);

    const encrypted = publicKey.encrypt(unencrypted);
    const encryptedProduct = publicKey.multiply(encrypted, multiplier);

    document.getElementById("encryptedProductResult").value = encryptedProduct.toString();
}

document.getElementById("multiplyButton").addEventListener("click", encryptMultiplication);

// Check if there's a public key in the URL hash and populate the input fields
const urlHash = decodeURIComponent(window.location.hash.substring(1));
if (urlHash) {
    const encodedPublicKey = urlHash;
    document.getElementById("publicKey").value = encodedPublicKey;
    document.getElementById("publicKeyForDecryption").value = encodedPublicKey;
    document.getElementById("publicKeyForAddition").value = encodedPublicKey;
    document.getElementById("publicKeyForMultiplication").value = encodedPublicKey;
}