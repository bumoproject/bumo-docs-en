---
id: version-1.0.0.10-contract_hello_world
title: BUMO Smart Contract(Hello World)
sidebar_label: Smart Contract(Hello World)
original_id: contract_hello_world
---

## Overview
　　
The contract is a `JavaScript` code, with a standard (`ECMAScript` as specified in `ECMA-262`). The initialization function of the contract is `init`, and the entry function of the execution is the `main` function. You must have the definition of the `init` and `main` functions in the contract code. The input argument to this function is the string `input`, which is specified when the contract is called.

- For details of the smart contract, refer to [Introduction to Smart Contract](introduction_to_smart_contract).
- For details of the smart contract syntax, refer to [Syntax in Smart Contract](syntax-in-smart-contract).
- For details of the smart contract editor, refer to[Introduction to Smart Contract Editor](introduction_to_smart_contract).

The following example is implemented in [Contract Editor](https://cme.bumo.io).



## Smart Contract (Hello World)

We will show you how to use the contract with a simple example.



### Contract Code

- The contract source code

Edit a snippet of contract code as follows:

```javascript
"use strict";
function init(bar)
{
  assert(typeof bar === 'string' && bar.length > 0, 'The param of init must be a not empty string');
  storageStore(bar, 'init : ' + bar);
}

function main(input)
{
  assert(typeof input === 'string' && input.length > 0, 'The param of main must be a not empty string');
  storageStore(input, 'main : ' + input);
}

function query(input)
{ 
  assert(typeof input === 'string' && input.length > 0, 'The param of query must be a not empty string');
  return storageLoad(input);
}
```

- Simple illustration

  `assert`: A global function that asserts when the condition of the first argument is not met, the string content of the second argument is thrown.

  `storageStore`: A global function that saves the specified key-value pairs into the blockchain. `Key` is the first argument and `value` is the second argument.

- The result is as follows:

<img src="/docs/Assets/contractcodehelloworld.png" style= "margin-left: 20px">



### Publishing the Contract

- Operation

  Publishing the contract is done by clicking the **Deploy** button on the right side of the interface. The edit box on the **Deploy** button is used to enter the parameters of the `init` function .
- Running the function

  This operation runs the `init` function in the contract code, and the `init` function has a parameter `bar`.

  When executing the first line of code in the `init` function,you should be noted that the parameter `bar` cannot be empty and it must be a string.

- Parameter

 Type `hello` in the edit box above the `Deploy` button.

- Result

  Click the **Deploy** button and the result is as follows:

  <img src="/docs/Assets/contractdeploy.png" style= "margin-left: 20px">



### main

- Operation

  Click the **main** tab at the bottom right of the interface. The edit box at the bottom is used to enter the parameters of the `main` function. There is also an editor below where you can input the number of BUs to be transferred to the contract account.

- Running the function
  
  This operation will run the `main` function in the contract code, and the `main` function has a parameter `input`.

  When executing the first line of the `main` function, you should be noted that the parameter `input` cannot be empty and it must be a string.

- Parameter

  Enter `world` in the first edit box under `main`.

- Result

  Click the **Invoke** button and the result is as follows:

  <img src="/docs/Assets/contractmain.png" style= "margin-left: 20px">



### query

- Operation

  Click the **query** tab at the bottom right of the interface, and the edit box below is used to enter the parameters of the `query` function .

- Running the function

 This operation will run the `query` function in the contract code, and the `query` function has a parameter `input`.

- Parameter

  Enter `hello` in the edit box under `query`.

- Result

   Click the **Invoke** button and the result is as follows:

  <img src="/docs/Assets/contractquery.png" style= "margin-left: 20px">