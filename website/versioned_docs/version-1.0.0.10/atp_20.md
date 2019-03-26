---
id: version-1.0.0.10-atp_20
title: BUMO ATP 20
sidebar_label: ATP 20
original_id: atp_20
---

## Overview

ATP 20 (Account based Tokenization Protocol) provides protocol standards for issuing tokens based on BUMO contracts. ATP 20 also provides interfaces for third parties to transfer and use tokens. 

## Purpose

Based on this standard interface, tokens can be quickly docked and used by other applications and third parties, such as wallets and exchanges.

## Rule

BUMO smart contracts are implemented by JavaScript language, including initialization function `init` and two entry functions, `main` and `query`. The `init` function is used to initialize contract creation; the `main` function is mainly responsible for data writing, the `query` function is responsible for data querying.

## Attributes of Tokens

The attributes of tokens are stored in the smart contract account, and you can check them by using the `tokenInfo` function. The attributes of tokens are as follows:

| Variable | Description          |
| :----------- | --------------------------- |
|name          | Token name              |
|symbol        | Token symbol            |
|decimals      | Decimal places of tokens |
|totalSupply   | Total amount of tokens (**The value is 10 ^ decimals * issuing amount**) |
|version       | ATP version |

**Attention**:
- name：Full spelled words with initial letters capitalized are recommanded, such as *Demo Token*.
- symbol：Capitalization and acronyms are recommended, such as *DT*.
- decimals：The number of decimal places which is in the range of 0~8, and 0 means no decimal place.
- totalSupply：The value is in the range of 1 ~ (2 ^ 63 - 1). **For example, when issuing 10000 tokens with 8 decimal places, the value of totalSupply is 1000000000000 (10 ^ 8 * 10000)**.
- version：The version of ATP, Such as *ATP20*.

## Event

The functions [transfer](#transfer), [transferFrom](#transferfrom) , [approve](#approve) will trigger the event (see the description of each function for details), The event is to call the `tlog` function, and a transaction log is recorded on the blockchain.  The log records the function call details for the user to read.

The tlog is defined as follows:

```js
tlog(topic,args...);
```

- `tlog`: It will generate a transaction written on the block.
- `topic`: Log subject, must be a string type, parameter length (0,128].
- `args...`: It can contain up to 5 parameters, and the parameter type can be string, numeric or Boolean type, each parameter length (0,1024].

## Functions

The functions provided in BUMO ATP 20 Protocol include [transfer](#transfer), [transferFrom](#transferfrom), [approve](#approve), [balanceOf](#balanceof), [tokenInfo](#tokeninfo), and [allowance](#allowance).

### transfer

- Function

    It is used to transfer (*value*) tokens to the destination address (*to*), and the *log* event must be triggered. An exception will be thrown if the source account does not have enough tokens.

- Entry function 

    `main`

- The parameters are in json format
    ```json
    {
        "method":"transfer",
        "params":{
            "to":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "value":"1000000"
        }
    }
    ```

- The json parameters

    | Parameter | Description                                              |
    | --------- | -------------------------------------------------------- |
    | to        | The address of the destination account.                  |
    | value     | The amount of tokens allowed to be transferred (string). |

- Function call
    ```js
    function transfer(to, value);
    ```

- Return value

  Returning `true` or throw an exception.

- event：
    ``` js
    tlog('transfer', sender, to, value);
    ```

    topic: The function name, here is 'transfer'.

    sender: The account address to call the contract.

    to: The address of the destination account.

    value: The amount of tokens allowed to be transferred (string).

### approve

- Function

    Authorized account `spender` can transfer `value` token from the transaction sender account.

- Entry function

    `main`

- Parameters are in json format.

    ```json
    {
        "method":"approve",
        "params":{
            "spender":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "value":"1000000"
        }
    }
    ```

- The json parameters

  | Parameter | Description                                                  |
  | --------- | ------------------------------------------------------------ |
  | spender   | The account address of the spender.                          |
  | value     | The amount of tokens an account is authorized to transfer (string). |

- Function call

    ```js
    function approve(spender, value)
    ```

- Return value

   Returning `true` or throw an exception.

- Event：

    ``` javascript
    tlog('approve', sender, spender, value);
    ```

    topic: The function name，here is 'approve'.

    sender:  The account address to call the contract.

    spender: The account address of the spender.

    value: The amount of tokens an account is authorized to transfer (string).

### transferFrom

- Function

    It  is used to transfer (*value*) tokens from the source address (*from*) to the destination address (*to*), and the `log` event must be triggered. Before the `transferFrom` function is called, the source address (*from*) must have authorized the destination address (*to*) by calling the `approve` function for transferring a certain amount of tokens. If the amount of tokens in the source address (*from*) is insufficient or if the source address (*from*) has not authorized the destination address (*to*) for transferring enough amount of tokens, then the `transferFrom` function will throw an exception. 

- Entry function

    `main`

- The parameters are in json format
    ```json
    {
        "method":"transferFrom",
        "params":{
            "from":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "to":"buQYH2VeL87svMuj2TdhgmoH9wSmcqrfBner",
            "value":"1000000"
        }
    }
    ```

- The json parameters

  | Parameter | Description                                              |
  | --------- | -------------------------------------------------------- |
  | from      | The source address.                                      |
  | to        | The destination address.                                 |
  | value     | The amount of tokens allowed to be transferred (string). |

- Function call
    ```js
    function transferFrom(from,to,value)
    ```

- Return value

  Returning `true` or throw an exception.

- Event：
    ``` javascript
    tlog('transferFrom', sender, from, to, value);
    ```

    topic: Function name, here is `transferFrom`.

    sender: The acount address to call the contract.

    from: The source address.

    to: The destination address.

    value: The amount of tokens allowed to be transferred (string).

### balanceOf

- Function

  It is used to check the balance of the owner account.

- Entry function

  `query`

- The parameters are in json format
  ```json
  {
    "method":"balanceOf",
    "params":{
        "address":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
  }
  ```

- The json parameters

  | Parameter | Description     |
  | --------- | --------------- |
  | address   | Account address |

- Function call

  ```js
  function balanceOf(owner)
  ```

- Return value

  The balance of specified address, such as follows: 
    ```json
  {
      "result":{
          "balanceOf":"100000000000000",
      }
  } 
    ```

### tokenInfo

- Function

    It is used to get the basic information of the token.

- Entry function 

    `query`

- The parameters are in json format
  ```json
  {
    "method":"tokenInfo"
  }
  ```

- Function call

  ```js
  function tokenInfo()
  ```

- Return value
    ```json
      {
        "result":{
            "type": "string",
            "value": {
                "tokenInfo": {
                    "name": "DemoToken",
                    "symbol": "DT",
                    "decimals": 8,
                    "totalSupply": "5000000000000",
                    "version": "1.0"
                }
            }
        }
      } 
    ```

### allowance

- Function

    It is used to check the amount of tokens still allowed to be transferred from the token owner.

- Entry function

    `query`

- The parameters are in json format
  ```json
  {
    "method":"allowance",
    "params":{
        "owner":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "spender":"buQYH2VeL87svMuj2TdhgmoH9wSmcqrfBner"
    }
  }
  ```

- The json parameters

    | Parameter | Description                             |
    | --------- | --------------------------------------- |
    | owner     | The account address of the token owner. |
    | spender   | The account address of the spender.     |

- Function call

  function allowance(owner, spender)

- Return value
    ```json
      {
        "result":{
            "allowance":"1000000",
        }
      } 
    ```

## Contract Entry Function

### init

- When the contract is created, the contract `init` entry function is triggered, which is responsible for the initialization of the contract creation
- Function call

    ```js
    function init(input_str){
    }
    ```

- Parameters are in json format

    ```json
    {
        "params":{
            "name":"DemoToken",
            "symbol":"DT",
            "decimals":8,
            "totalSupply":"5000000000000",
            "version": "1.0"
        }
    }
    ```
- Return value

  Return `true` or throw an exception.

### main

- It is used for data writing, which includes the [transfer](#transfer), [transferFrom](#transferfrom) and [approve](#approve) functions.
- Function body

    ```js
    function main(input_str){
        let input = JSON.parse(input_str);

        if(input.method === 'transfer'){
            transfer(input.params.to, input.params.value);
        }
        else if(input.method === 'transferFrom'){
            transferFrom(input.params.from, input.params.to, input.params.value);
        }
        else if(input.method === 'approve'){
            approve(input.params.spender, input.params.value);
        }
        else{
            throw '<Main interface passes an invalid operation type>';
        }
    }
    ```
### query

- It is used for data querying, which includes the [tokenInfo](#tokeninfo), [allowance](#allowance) functions.
- Function body

    ```js
    function query(input_str){
        globalAttribute = JSON.parse(storageLoad(globalAttributeKey));

        let result = {};
        let input  = JSON.parse(input_str);

        if(input.method === 'tokenInfo'){
            result.tokenInfo = globalAttribute;
        }
        else if(input.method === 'allowance'){
            result.allowance = allowance(input.params.owner, input.params.spender);
        }
        else{
            throw '<Query interface passes an invalid operation type>';
        }
        return JSON.stringify(result);
    }
    ```
