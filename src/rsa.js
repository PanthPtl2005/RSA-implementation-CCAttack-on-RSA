const p = 3557n;
const q = 2579n;
const e = 65537n;

const gcd = (a, b) => {
  let x = a;
  let y = b;

  while (y !== 0n) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }

  return x;
};

export const modPow = (base, exponent, modulus) => {
  if (modulus === 1n) {
    return 0n;
  }

  let result = 1n;
  let value = base % modulus;
  let power = exponent;

  while (power > 0n) {
    if (power % 2n === 1n) {
      result = (result * value) % modulus;
    }

    power /= 2n;
    value = (value * value) % modulus;
  }

  return result;
};

const extendedGcd = (a, b) => {
  if (b === 0n) {
    return { gcd: a, x: 1n, y: 0n };
  }

  const next = extendedGcd(b, a % b);

  return {
    gcd: next.gcd,
    x: next.y,
    y: next.x - (a / b) * next.y,
  };
};

export const modInverse = (value, modulus) => {
  const result = extendedGcd(value, modulus);

  if (result.gcd !== 1n) {
    throw new Error("Public exponent and phi(n) are not coprime.");
  }

  return ((result.x % modulus) + modulus) % modulus;
};

const n = p * q;
const phi = (p - 1n) * (q - 1n);

if (gcd(e, phi) !== 1n) {
  throw new Error("The chosen RSA values are invalid.");
}

const d = modInverse(e, phi);

export const rsaConfig = {
  p,
  q,
  n,
  phi,
  e,
  d,
};

export const simulateRsa = (asciiInput) => {
  if (!asciiInput.trim()) {
    throw new Error("Enter ASCII codes to simulate RSA encryption.");
  }

  const asciiCodes = asciiInput.trim().split(/\s+/).map((code) => {
    const num = parseInt(code, 10);
    if (isNaN(num) || num < 0 || num > 127) {
      throw new Error(`Invalid ASCII code: "${code}". Must be a number between 0 and 127.`);
    }
    return num;
  });

  if (asciiCodes.length === 0) {
    throw new Error("Enter at least one ASCII code.");
  }

  const rows = asciiCodes.map((ascii, index) => {
    const asciiBig = BigInt(ascii);
    const encrypted = modPow(asciiBig, e, n);
    const decrypted = modPow(encrypted, d, n);

    return {
      index: index + 1,
      ascii,
      character: String.fromCharCode(ascii),
      encrypted: encrypted.toString(),
      decryptedAscii: Number(decrypted),
      decryptedCharacter: String.fromCharCode(Number(decrypted)),
    };
  });

  return {
    rows,
    asciiValues: rows.map((row) => row.ascii),
    encryptedValues: rows.map((row) => row.encrypted),
    decryptedMessage: rows.map((row) => row.decryptedCharacter).join(""),
  };
};
