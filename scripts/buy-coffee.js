const hre = require("hardhat")

// Returns the Ether balance of a given address.
async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address)
    return hre.ethers.utils.formatEther(balanceBigInt)
    //so basically we are taking the bigInt and converting into ETH amount
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
    let idx = 0
    for (const address of addresses) {
        console.log(`Address ${idx} balance: `, await getBalance(address))
        idx++
    }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp
        const tipper = memo.name
        const tipperAddress = memo.from
        const message = memo.message
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`)
    }
}

async function main() {
    // Get the example accounts we'll be working with.
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners() //couldnt understand how accounts are renamed to tipper

    // We get the contract to deploy.
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee")
    const buyMeACoffee = await BuyMeACoffee.deploy()

    // Deploy the contract.
    await buyMeACoffee.deployed()
    console.log("BuyMeACoffee deployed to:", buyMeACoffee.address)

    // Check balances before the coffee purchase.
    const addresses = [owner.address, tipper.address, tipper2.address, buyMeACoffee.address]
    console.log("== start ==")
    await printBalances(addresses)

    // Buy the owner a few coffees.
    const tip = { value: hre.ethers.utils.parseEther("32") }
    await buyMeACoffee
        .connect(tipper)
        .buyCoffee("Johny Bravo", "Yeah sure take all my money!!", tip) //third field is the optional in a celebrity function call; include
    // this option array as optional
    await buyMeACoffee.connect(tipper2).buyCoffee("Loffer", "REallyy!!!", tip)
    await buyMeACoffee
        .connect(tipper3)
        .buyCoffee("Serious", "I am still waiting for my proof of knowledge ", {
            value: hre.ethers.utils.parseEther("60"),
        })

    // Check balances after the coffee purchase.
    console.log("== bought coffee ==")
    await printBalances(addresses)

    //Checking Delegates
    //console.log(`Current Delegate is ${buyMeACoffee.delegates.address}`)

    //Delegate withdrawal to another Address
    await buyMeACoffee.connect(owner).delegateWithdrawAuthority(tipper2.address)
    //  console.log(`New Delegate is ${buyMeACoffee.delegates.address}`)
    // Withdraw.
    await buyMeACoffee.connect(tipper2).withdrawTips()

    // Check balances after withdrawal.
    console.log("== withdrawTips ==")
    await printBalances(addresses)

    // Check out the memos.
    console.log("== memos ==")
    const memos = await buyMeACoffee.getMemos()
    printMemos(memos)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
