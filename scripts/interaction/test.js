const { keccak256 } = require('js-sha3');
const {types} = require("@algo-builder/web");
const {getApplicationAddress, encodeUint64, signBytes, verifyBytes, tealSign} = require("algosdk");
const {executeTransaction, convert} = require("@algo-builder/algob");

function createEmptyTransaction(account, applicationID) {
  return {
    type: types.TransactionType.CallApp,
    sign: types.SignType.SecretKey,
    fromAccount: account,
    appID: applicationID,
    payFlags: {},
    appArgs: [convert.stringToBytes('nothing'), encodeUint64(Math.round(Math.random() * 100000))]
  };
}

async function run (runtimeEnv, deployer) {
  const adminAccount = deployer.accountsByName.get('admin');
  const user1Account = deployer.accountsByName.get('user1');

  const appInfo = deployer.getApp('approval_program.py', 'clear_program.teal');
  const applicationID = appInfo.appID;

  const candidate = user1Account.addr;
  const maxAmount = 200;
  const minAmount = 14;

  const message = new Uint8Array([...convert.addressToPk(candidate), ...encodeUint64(maxAmount), ...encodeUint64(minAmount)]);
  const messageHash = new Uint8Array(keccak256.arrayBuffer(message));

  // get program hash by running this command: `./sandbox goal app info --app-id <applicationID>`
  // It should be a env variable
  const approvalProgramHash = '37RGKMFDD4DAXEO6L3LQFU33FP72EG52MJD62ICJQBXYYJRDTD6GSZVEVQ';

  const signature = tealSign(adminAccount.sk, messageHash, approvalProgramHash);

  const appArgs = [
    convert.stringToBytes('test_ecdsa'), // 0. method
    convert.addressToPk(user1Account.addr), // 1. candidate
    encodeUint64(maxAmount), // 2. max amount
    encodeUint64(minAmount), // 3. min amount
    signature // 4. signature
  ];

  const tx = {
    type: types.TransactionType.CallApp,
    sign: types.SignType.SecretKey,
    fromAccount: adminAccount,
    appID: applicationID,
    payFlags: {},
    appArgs,
  };

  const tx2 = createEmptyTransaction(adminAccount, applicationID);
  const tx3 = createEmptyTransaction(adminAccount, applicationID);
  const tx4 = createEmptyTransaction(adminAccount, applicationID);

  // cost budget for each transaction is 700, but cost for ed25519verify is 1900!!!,
  // so we have to create a group of transactions in order to increase the total budget
  // with 4 transactions, the total budget is 4 * 700 = 2800, this is enough to run the ed25519verify opcode
  await executeTransaction(deployer, [tx, tx2, tx3, tx4]);

  console.log('Correct signature!!!');
}

module.exports = { default: run };
