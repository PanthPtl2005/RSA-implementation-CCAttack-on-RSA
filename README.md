# RSA Simulation & CCA Attack Demo

An interactive web-based simulation demonstrating RSA encryption/decryption and the Chosen Ciphertext Attack (CCA) exploit.

## Features

- **RSA Encryption/Decryption**: Encrypt ASCII codes and see the step-by-step RSA process
- **Chosen Ciphertext Attack (CCA)**: Interactive demo of how RSA malleability can be exploited to recover plaintext
- **Educational**: Shows the mathematical operations (modular exponentiation, modular inverse) in action

## Tech Stack

- React 18
- Vite
- React Router
- BigInt for cryptographic math

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
RSA website simulation/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
├── README.md               # Project documentation
├── package-lock.json       # Locked dependency versions
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx              # Main app with routing
    ├── CCAttack.jsx         # Chosen Ciphertext Attack demo
    ├── rsa.js               # RSA implementation (modPow, modInverse, simulateRsa)
    └── styles.css           # CSS styles
```

## RSA Parameters

- Prime p: 3557
- Prime q: 2579
- Public exponent e: 65537
- Uses fixed primes for demonstration purposes

## Security Note

This is an educational simulation. The fixed primes and lack of padding make it unsuitable for any real cryptographic use.
