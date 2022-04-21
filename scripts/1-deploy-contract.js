const {
  executeTransaction
} = require('@algo-builder/algob');
const { types } = require('@algo-builder/web');

async function run (runtimeEnv, deployer) {
  const masterAccount = deployer.accountsByName.get('master-account');
  const adminAccount = deployer.accountsByName.get('admin');

  const algoTxnParams = {
    type: types.TransactionType.TransferAlgo,
    sign: types.SignType.SecretKey,
    fromAccount: masterAccount,
    toAccountAddr: adminAccount.addr,
    amountMicroAlgos: 200e6,
    payFlags: {}
  };
  // transfer some algos to creator account
  await executeTransaction(deployer, algoTxnParams);

  // Create Application
  // Note: An Account can have maximum of 10 Applications.
  const sscInfo = await deployer.deployApp(
    'approval_program.py', // approval program
    'clear_program.teal', // clear program
    {
      sender: adminAccount,
      localInts: 2,
      localBytes: 10,
      globalInts: 10,
      globalBytes: 10
    }, {});

  console.log(sscInfo);

  // Opt-In for creator
  await deployer.optInAccountToApp(adminAccount, sscInfo.appID, {}, {});
}

module.exports = { default: run };
