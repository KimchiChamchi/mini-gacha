// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract gacha {
    string[] public myItemList;

    string[10] public items;

    constructor() public {
        items = [
            "Zip Row Sword",
            "Server.Sword",
            "Emergency.Sword",
            "Temporary.Sword",
            "Fixed term.Sword",
            "Extension.Sword",
            "Special Sword",
            "Dog Sword",
            "Father Sword",
            "Thread Sword"
        ];
    }

    event PickedItem(address winner, string pickedItem);

    function getItems() public view returns (string[10] memory) {
        return items;
    }

    function getMyItemList() public view returns (string[] memory) {
        return myItemList;
    }

    function getBonus() public view returns (uint256) {
        return bonus;
    }

    uint256 fee = 1 ether;
    uint256 bonus = 0;

    // 뽑기
    function draw(uint256 _randNum) public payable {
        require(_randNum >= 10**14, "This number does not match the standard");
        require(msg.value == fee, "you need to pay 1 ether");
        _randNum = uint256(keccak256(abi.encodePacked(_randNum))) % 10;
        myItemList.push(items[_randNum]);
        bonus++;
        emit PickedItem(msg.sender, items[_randNum]);
    }

    // 무료뽑기
    function freeDraw(uint256 _randNum) public {
        require(_randNum >= 10**14, "This number does not match the standard");
        require(bonus == 5, "Must have done 5 paid draws in the past");
        _randNum = uint256(keccak256(abi.encodePacked(_randNum))) % 10;
        myItemList.push(items[_randNum]);
        bonus = 0;
        emit PickedItem(msg.sender, items[_randNum]);
    }
}
