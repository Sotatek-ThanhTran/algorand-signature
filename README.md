Signature verification example (base on https://developer.algorand.org/articles/verify-signatures-and-signed-data-within-algorand-smart-contracts/)

# Test
```shell
yarn run algob clean
yarn run algob deploy
yarn run algob run scripts/interaction/test.js
```

# Create message signature
```ecmascript 6
const message = new Uint8Array(/* data here */)
const messageHash = new Uint8Array(keccak256.arrayBuffer(message));

// get program hash by running this command: `./sandbox goal app info --app-id <applicationID>`
// It should be a env variable
const approvalProgramHash = '37RGKMFDD4DAXEO6L3LQFU33FP72EG52MJD62ICJQBXYYJRDTD6GSZVEVQ';

const signature = tealSign(adminAccount.sk, messageHash, approvalProgramHash);
```

# Verify signature in contract
```
message = Concat(data here)
messageHash = Keccak256(message)
Assert(Ed25519Verify(messageHash, signature, signer) == Int(1))
```