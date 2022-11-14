// scripts/deploy.js
const { verify } = require("../utils/verify")
const { moveBlocks } = require("../utils/move-blocks")
const hre = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
async function main() {
    // We get the contract to deploy.

    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee")
    const buyMeACoffee = await BuyMeACoffee.deploy()
    const args = []

    const tx = await buyMeACoffee.deployed()

    // Moving the blocks for blockConfirmations if the network is localhost
    if (network.config.chainId == "31337") {
        await moveBlocks(6, (sleepAmount = 1000)) // await 1 second or 1000 miliseconds between each blocks
    }
    await buyMeACoffee.deployTransaction.wait(6)

    // Verify the deployment

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(buyMeACoffee.address, args)
    }

    console.log("BuyMeACoffee deployed to:", buyMeACoffee.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
