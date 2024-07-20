// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.19;

contract TodoManager {

    mapping (address => string[]) TODOS;

    function getAllTodos() public view returns (string[] memory) {
        return TODOS[msg.sender];
    }

    function getTodoById(uint index) public view returns (string memory) {
        return TODOS[msg.sender][index];
    }

    function addTodo(string memory todo) public {
        TODOS[msg.sender].push(todo);
    }

}