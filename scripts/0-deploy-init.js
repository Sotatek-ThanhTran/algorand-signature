const { executeTransaction, balanceOf } = require('@algo-builder/algob');
const { types } = require('@algo-builder/web');

async function transferAlgo(deployer, senderAccount, receiverAddr, amount) {
    const tx = {
        type: types.TransactionType.TransferAlgo,
        sign: types.SignType.SecretKey,
        fromAccount: senderAccount,
        toAccountAddr: receiverAddr,
        amountMicroAlgos: amount,
        payFlags: {}
    };
    await executeTransaction(deployer, tx);
}

async function run (runtimeEnv, deployer) {
    // we start with extracting acocunt objects from the config.
    const masterAccount = deployer.accountsByName.get('master-account');
    const admin = deployer.accountsByName.get('admin');
    const user1 = deployer.accountsByName.get('user1');
    const user2 = deployer.accountsByName.get('user2');
    const operator = deployer.accountsByName.get('operator');

    const promises = [
        transferAlgo(deployer, masterAccount, admin.addr, 300e6),
        transferAlgo(deployer, masterAccount, user1.addr, 50e6),
        transferAlgo(deployer, masterAccount, user2.addr, 50e6),
        transferAlgo(deployer, masterAccount, operator.addr, 50e6)
    ];
    await Promise.all(promises);
}

module.exports = { default: run };