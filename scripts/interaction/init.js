const {init, dumpGlobalState} = require("./contract");

async function run (runtimeEnv, deployer) {
  await init(deployer);

  /* Uncomment below code to start debugger  */
  // await new Tealdbg(deployer, tx)
  //   .run({ tealFile: "approval_program.teal" });

  await dumpGlobalState(deployer);
}

module.exports = { default: run };
