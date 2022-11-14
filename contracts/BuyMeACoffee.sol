//SPDX-License-Identifier: Unlicense

// contracts/BuyMeACoffee.sol
pragma solidity ^0.8.9;

// Switch this to your own contract address once deployed, for bookkeeping!
// Example Contract Address on Goerli: 0x7889c3d661F590a1608C73f8315A6C09281901A2

contract BuyMeACoffee {
    // Event to emit when a Memo is created.
    event NewMemo(address indexed from, uint256 timestamp, string name, string message);

    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable owner; // the reason we want to track this, is that we wannt to be able to withdraw once a tip is made

    // List of all memos received from coffee purchases.
    Memo[] memos; //> This struct was defined above and so this Memo array here is a list of structs inside the state variable "memo"

    //Constructor is run 1 time upon deployment
    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        owner = payable(msg.sender);
    } //so without this payable keyword here; as we have defined the address of the owner as payable above we have to define

    //this address as payable as well as in future when we want to reference the owner address and pay it, its doable

    /**
     * @dev fetches all stored memos
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */

    //memory keyword makes sure that our string is thrown away after the function is called
    // what we want from this function is that we want to add some money into the SC check that its non-zero

    function buyCoffee(string memory _name, string memory _message) public payable {
        // Must accept more than 0 ETH for a coffee.
        require(msg.value > 0, "can't buy coffee for free!");

        //creating a memo object but not only that we are saving this to the memos array up there
        // Add the memo to storage!
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // Emit a NewMemo event with details about the memo.
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */

    //it doesnt matter whoever calls the function but it should send the balance of the smart contract to the owner of the smart contract
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }
}
