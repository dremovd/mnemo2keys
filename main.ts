import * as bip39 from 'bip39';
//import * as bs58 from 'bs58';
import * as nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import * as web3 from '@solana/web3.js';

const bs58 = require('bs58');

async function mnemonicToSecretKeys(mnemonic: string, numKeys: number): Promise<string[]> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  console.log('Seed:', seed.toString('hex'));
  const secretKeys: string[] = [];

  for (let i = 0; i < numKeys; i++) {
    const derivationPath = `m/44'/501'/${i}'/0'`;
    const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
    const keyPair = web3.Keypair.fromSeed(derivedSeed); 
    //console.log('Key Pair:', keyPair);
    const secretKey = bs58.encode(keyPair.secretKey);
    //console.log('Secret Key:', secretKey);
    secretKeys.push(secretKey);
  }

  return secretKeys;
}

// Read mnemonic from stdin
process.stdin.setEncoding('utf8');
process.stdout.write('Enter your mnemonic: ');

process.stdin.on('data', async (data: string) => {
  const mnemonic = data.trim();

  try {
    const secretKeys = await mnemonicToSecretKeys(mnemonic, 10);
    console.log(secretKeys.length);

    secretKeys.forEach((key, index) => {
      console.log(`Secret Key ${index + 1}:`, key);
    });
  } catch (error) {
    console.error("Error:", error);
  }

  process.stdin.end();
  process.exit();
});