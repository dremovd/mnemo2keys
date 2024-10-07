import base58
import json
import argparse

def byte_to_base58(byte_key):
    # Convert byte array to Base58
    return base58.b58encode(byte_key).decode('utf-8')

def main():
    # Set up argument parsing
    parser = argparse.ArgumentParser(description="Convert Solana byte private key to Base58 private key from a file.")
    parser.add_argument("filename", help="The JSON file containing the byte private key.")

    args = parser.parse_args()

    with open(args.filename, 'r') as file:
        for line in file.readlines():
            try:
                byte_key_list = json.loads(line.strip())
                byte_key = bytes(byte_key_list)
                base58_key = byte_to_base58(byte_key)
                print(f"Base58 Private Key: {base58_key}")
            except ValueError:
                print(f"Wrong line format: {byte_key_list}")
                continue

if __name__ == "__main__":
    main()
