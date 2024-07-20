// 

const { ethers } = require("hardhat");

async function main() {
  let contract = await ethers.getContractFactory("TodoManager");
  contract = await contract.deploy();

  console.log("TodoManager deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
