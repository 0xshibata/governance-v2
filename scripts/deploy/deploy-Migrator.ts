const hre = require("hardhat");
import {
  AEVO_ADDR,
  PLACEHOLDER_ADDR,
  RBN_ADDR,
} from "../../constants/constants";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log(`\Deploying with ${deployer.address}`);

  // We get the contract to deploy
  const Migrator = await hre.ethers.getContractFactory("Migrator", deployer);

  // Use a different address for obfuscation just in case anyone's watching
  const AEVO_ADDRESS =
    network === "goerli" || network === "sepolia"
      ? PLACEHOLDER_ADDR
      : AEVO_ADDR;
  const RBN_ADDRESS =
    network === "goerli" || network === "sepolia" ? PLACEHOLDER_ADDR : RBN_ADDR;

  const migrator = await Migrator.deploy(RBN_ADDRESS, AEVO_ADDRESS);

  await migrator.deployed();

  console.log(`\nMigrator is deployed at ${migrator.address}`);

  await migrator.deployTransaction.wait(5);

  await hre.run("verify:verify", {
    address: migrator.address,
    constructorArguments: [RBN_ADDRESS, AEVO_ADDRESS],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
