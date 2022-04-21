async function run (runtimeEnv, deployer) {
  const adminAccount = deployer.accountsByName.get('admin');

  // Retreive AppInfo from checkpoints.
  const appInfo = deployer.getApp('approval_program.py', 'clear_program.teal');
  const applicationID = appInfo.appID;
  console.log('Application Id ', applicationID);

  const updatedRes = await deployer.updateApp(
    adminAccount,
    {}, // pay flags
    applicationID,
    'approval_program.py',
    'clear_program.teal',
    {}
  );
  console.log('Application Updated: ', updatedRes);
}

module.exports = { default: run };
