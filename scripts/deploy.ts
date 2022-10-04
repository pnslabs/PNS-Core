// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import Web3 from "web3";
import { ethers } from "hardhat";
const web3 = new Web3("http://localhost:8545");


async function main() {
  let pns;
  let proxyAdmin;
  let transparentUpgradeableProxy;

  const PNSContract = await ethers.getContractFactory("PNS");
  const ProxyAdminContract = await ethers.getContractFactory("ProxyAdmin");
  const TransparentUpgradeableProxyContract = await ethers.getContractFactory(
    "TransparentUpgradeableProxy",
  );

  pns = await PNSContract.deploy();
  console.log("PNS Contract Deployed", pns.address);

  // setting up proxy admin to be this address. You can set it up to be multi-sig
  proxyAdmin = await ProxyAdminContract.deploy();
  console.log("Proxy Admin deployed", proxyAdmin.address);

  const encodedData = web3.utils.hexToBytes("0x");

  transparentUpgradeableProxy =
    await TransparentUpgradeableProxyContract.deploy(
      pns.address,
      proxyAdmin.address,
      encodedData,
    );
  console.log(
    `Proxy deployed to ${transparentUpgradeableProxy.address}, you can now upgrade to v2!`,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});