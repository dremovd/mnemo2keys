import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

import * as web3 from '@solana/web3.js';

const bs58 = require('bs58');

async function mnemonicToKeys(mnemonic: string, numKeys: number): Promise<{ publicKey: string, secretKey: string }[]> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const keys: { publicKey: string, secretKey: string }[] = [];

  for (let i = 0; i < numKeys; i++) {
    const derivationPath = `m/44'/501'/${i}'/0'`;
    const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
    const keyPair = web3.Keypair.fromSeed(derivedSeed); 
    const secretKey = bs58.encode(keyPair.secretKey);
    const publicKey = keyPair.publicKey.toBase58();
    keys.push({ publicKey, secretKey });
  }

  return keys;
}

// Read mnemonic from stdin
process.stdin.setEncoding('utf8');

process.stdin.on('data', async (data: string) => {
  const mnemonic = data.trim();

  try {
    const keys = await mnemonicToKeys(mnemonic, 100);
    console.log(`index,public,private`);
    keys.forEach((key, index) => {
      console.log(`${index + 1},${key.publicKey},${key.secretKey}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }

  process.stdin.end();
  process.exit();
});
