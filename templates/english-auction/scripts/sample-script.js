// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const main = async() => {
  // Your contract deploy code goes here
}

const runMain = async() => {
  try{
    await main()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

runMain()
