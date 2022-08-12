const anchor = require('@project-serum/anchor');

// Need the system program
const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log('\x1b[32m%s\x1b[0m', "🚀 Starting test...")

  // ⬇ Create and set the provider to communicate with our frontend
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Solanapage;

  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Call start_stuff_off, pass it the params it needs!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log('\x1b[35m%s\x1b[0m', "📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('\x1b[33m%s\x1b[0m', '👀 GIF Count', account.totalGifs.toString())

  // Call add_gif!
  await program.rpc.addGif("Here is the link for GIF, when deployed to prdt, this will be message from textarea", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count CHECK', '\x1b[33m%s\x1b[0m', account.totalGifs.toString())

  // Access gif_list on the account!
  console.log('🔆 GIF List','\x1b[31m%s\x1b[0m', account.gifList)
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();