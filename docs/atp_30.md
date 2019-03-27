---
id: atp_30
title: BUMO ATP 30
sidebar_label: ATP 30
---

## Introduction

ATP 30 (Account-based Tokenization Protocol) is "Non-Fungible Tokens", abbreviated as "NFT", and can be interpreted as non-interchangeable Tokens. Simply put, each token is unique and cannot be interchanged.

**Note**:
- TokenId is unique within the contract.
- TokenId can only be owned by one owner (i.e. address).
- An owner can have multiple NFTs, and its balance only counts
- ATP 30 provides the  [approve](#approve),  [transfer](#transfer), and [transferFrom](#transferfrom) interfaces for transferring ownership.

## Standards

### NTF ID

The NTF ID, also called the TokenId, uses a unique identifier in the contract, and the ID of each NFT is not allowed to change during the life cycle of the smart contract. The recommended implementation is: starting from 0, NTFID is incremented 1 for each new NFT.

## Attributes of Token 

The attributes of tokens are stored in the account of the smart contract. The attributes of tokens can be queried through the contract's `tokenInfo` function. The token attributes are shown in the following table. 

| Variable        | Description   |
| :----------- | ---------------- |
| id           | The unique identifier of the token  |
| owner        | The owner of the token    |
| description  | The description of the token       |
| creationTime | The time when the token is created  |

**Attention**:

- id: Starting from 0, and the id is incremented 1 for each new token.
- description: The length of the characters is 1 ~ 200k.

## Event

The functions [issue](#issue), [transfer](#transfer), [approve](#approve), and [transferFrom](#transferfrom) will trigger the event. The event is to call the `tlog` interface, and a transaction log is recorded on the blockchain. The log records the details of the function call for the user to read.

The tlog is defined as follows:

```
tlog(topic,args...);
```

- `tlog`: It will generate a transaction written on the block.
- `topic`: Log subject, must be a string type, parameter length (0,128].
- `args...`: It can contain up to 5 parameters, and the parameter type can be string, numeric or Boolean type, each parameter length (0,1024].

## Functions

Functions in the BUMO ATP 30 protocol include [issue](#issue), [totalSupply](#totalsupply), [balanceOf](#balanceof), [ownerOf](#ownerof), [approve](#approve), [transfer](#transfer), [transferFrom](#transferfrom), [tokensOfOwner](#tokensofowner), [tokenInfo](#tokeninfo), [name](#name), and [symbol](#symbol).

### issue

- Description

  Issuing new tokens.

- Entry function

  `main`

- The parameters are in json format.

    ```json
    {
        "method":"issue",
        "params": {
            "description": "demo"
        }
    }
    ```

- The json parameters

  | Parameter   | Description                   |
  | ----------- | ----------------------------- |
  | description | The description of the token. |

- Function

  ```js
  function issue(description)
  ```

- Return value

  Return `true` or throw an exception.

- Event:

    ```javascript
      tlog('issue', sender, tokenId, description);
    ```

    topic: The function name, here is 'issue'.

    sender: The account address to call the contract.

    tokenID: The tokenID transferred.

    description: The description for the token.

### totalSupply

- Description

  Returning the total number of tokens issued. 

- Entry function

  `query`

- The parameter is in json format.

  ```json 
  {
      "method":"totalSupply"
  }
  ```

- Function:

  ```js
  function totalSupply()
  ```

- Return value:

    ```json
    {
        "result":{
            "type": "string",
            "value": {
                "totalSupply": "2"
            }
        }
    } 
    ```

### balanceOf

- Description

  Returning the sum of tokens for the specified account. 

- Entry function

     `query`

- The parameter is in json format.

    ```json
    {
        "method":"balanceOf",
        "params":{
            "address":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
        }
    }
    ```

- The json parameters

  | Parameter | Description          |
  | --------- | -------------------- |
  | address   | The account address. |

- Function:

  ```js
  function balanceOf(address)
  ```

- Return value: The total tokens for the specified address.

    ```json
    {
        "result":{
            "type": "number",
            "value": {
                "count": 1
            }
        }
    } 
    ```

### ownerOf

- Description

    Returning the owner of the token.

- Entry function

     `query`

- The parameters are in json format.

    ```json
    {
        "method":"ownerOf",
        "params": {
            "tokenId": 1
        }
    }
    ```

- The json paremeters

  | Parameter | Description   |
  | --------- | ------------- |
  | tokenId   | The token id. |

- Function:

  ```js
  function ownerOf(tokenId)
  ```

- Return value:

    ```json
    {
        "result":{
            "type": "string",
            "value": {
                "owner": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
            }
        }
    } 
    ```

### approve

- Description

    Authorize the account `spender` to transfer the token with the specified TokenId from the transaction account `sender`. Only the owner of the token can call.

- Entry function

     `main`

- The parameters are in json format.

    ```json
    {
        "method":"approve",
        "params":{
            "spender":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "tokenId": 2
        }
    }
    ```

- The json parameters

  | Parameter | Description                  |
  | --------- | ---------------------------- |
  | spender   | The account address.         |
  | tokenId   | The identifier of the token. |

- Function

  ```js
  function approve(spender, tokenId)
  ```

- Return value

  Return `true` or throw an exception.

- Event:

    ```javascript
      tlog('approve', sender, spender, tokenId);
    ```

    Topic: The method name, here is 'approve'.

    Sender: The account address to call the contract.

    Spender: The authorized account address.

    tokenId: The tokenId transferred.

### transfer

- Description

    Transfer the token with the specified tokenId to the destination address (to), and the log event must be triggered. Only the owner of the token can call.

- Entry function

     `main`

- The parameters are in json format.

    ```json
    {
        "method":"transfer",
        "params":{
            "to":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "tokenId": 0
        }
    }
    ```

- The json parameters

  | Parameter | Description                      |
  | --------- | -------------------------------- |
  | to        | The destination account address. |
  | tokenId   | The identifier of the token.     |

- Function

  ```js
  function transfer(to, tokenId)
  ```

- Return value

  Return `true` or throw an exception.

- Event:

    ```javascript
    tlog('transfer', sender, to, tokenId);
    ```

    topic: The method name, here is 'transfer'.

    sender: The account address to call the contract.

    to: The destination account address.

    tokenId: The tokenId transferred.


### transferFrom

- Description

    The token event must be triggered when the token with tokenId is sent to the destination address(`to`) from the source account(`from`).  Prior to `transferFrom`, `from` must authorize the originator of the current transaction (ie, approve operation). Only the authorized address of the token can call.

- Entry function

     `main`

- The parameters are in json format.

    ```json
    {
        "method":"transferFrom",
        "params":{
            "from":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "to":"buQYH2VeL87svMuj2TdhgmoH9wSmcqrfBner",
            "tokenId": 1
        }
    }
    ```

- The json parameters

  | Parameter | Description                      |
  | --------- | -------------------------------- |
  | from      | The source account address.      |
  | to        | The destination account address. |
  | tokenId   | The identifier of the token.     |

- Function

  ```js
  function transferFrom(from,to,tokenId)
  ```

- Return value

  Return `true` or throw an exception.

- Event

    ```javascript
    tlog('transferFrom', sender, from, to, tokenId);
    ```

    topic: The method name, here is 'transferFrom'.

    sender: The account address to call the contract.

    from: The source account address.

    to: The destination account address.

    tokenId: The tokenId transferred.

### tokensOfOwner

- Description

    Returning all tokens of the owner.

- Entry function

     `query`

- The parameter is in json format.

    ```json
    {
        "method":"ownerOf",
        "params": {
            "owner": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
        }
    }
    ```

- The json parameters

  | Parameter | Description         |
  | --------- | ------------------- |
  | owner     | The owner of token. |

- Function:

  ```js
  function ownerOf(tokenId)
  ```

- Return value:

    ```json
    {
        "result":{
            "type": "Array",
            "value": {
                "tokens": [0, 2]
            }
        }
    } 
    ```

### tokenInfo

- Description

    Returning basic information of the token.

- Entry function 

    `query`

- The parameter is in json format.

    ```json
    {
        "method":"tokenInfo",
        "params":{
            "tokenId": 0
        }
    }
    ```

- The json parameters

  | Parameter | Description   |
  | --------- | ------------- |
  | tokenId   | The token id. |

- Function:

  ```js
  function tokenInfo(tokenId)
  ```

- Return value:

    ```json
    {
        "result":{
            "type": "string",
            "value": {
                "tokenInfo": {
                    "title": "demo",
                    "author": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
                    "info": "demo",
                    "creationTime": "135665626565612"
                }
            }
        }
    } 
    ```

### name

- Description

    Returning the collection name of the tokens contained in the current contract.

- Entry function

     `query`

- The parameter is in json format.

    ```json
    {
        "method":"name"
    }
    ```

- Function:

  ```js
  function name()
  ```

- Return value:

    ```json
    {
        "result":{
            "type": "string",
            "value": {
                "name": "demo"
            }
        }
    } 
    ```

### symbol

- Description

    Returning the collection symbol of the tokens contained in the current contract.

- Entry function

     `query`

- The parameter is in json format.

    ```json
    {
        "method":"symbol"
    }
    ```

- Function:

  ```js
  function symbol(tokenId)
  ```

- Return value:

    ```json
    {
        "result":{
            "type": "string",
            "value": {
                "symbol": "DM"
            }
        }
    } 
    ```

## Contract Entry

### init

- When the contract is created, Entry function `init` is triggered which is responsible for the initialization of the contract creation.

- Function

    ```js
    function init(input_str){
    }
    ```

- The parameters are in json format.

    ```json
    {
        "params":{
            "name":"DemoToken",
            "symbol":"DT"
        }
    }
    ```

- Return value

  Return `true` or throw an exception.

### main

- The `main` function is responsible for data writing, including [issue](#issue), [transfer](#transfer), [transferFrom](#transferfrom) and [approve](#approve) functions.

- Function body

    ```javascript
    function main(arg) {
      const data = JSON.parse(arg);
      const operation = data.operation || '';
      const param = data.param || {};

      switch (operation) {
        case 'issue':
          issue(param);
          break;
        case 'approve':
          approve(param.to, param.tokenId);
          break;
        case 'transfer':
          transfer(param.to, param.tokenId);
          break;
        case 'transferFrom':
          transferFrom(param.from, param.to, param.tokenId);
          break;
        default:
          throw '<Main interface passes an invalid operation type>';
      }
    }
    ```

### query

- It is used for data querying, which includes the [totalSupply](#totalsupply)、[balanceOf](#balanceof)、[ownerOf](#ownerof)、[tokensOfOwner](#tokensofowner)、[tokenInfo](#tokeninfo)、[name](#name)、[symbol](#symbol) functions.
- Function body.

    ```javascript
    function query(arg) {
        let result = {};
        let input  = JSON.parse(input_str);
    
        if(input.method === 'name'){
            result.name = name();
        }
        else if(input.method === 'symbol'){
            result = symbol();
        }
        else if(input.method === 'tokenInfo'){
            result = tokenInfo(input.tokenId);
        }
        else if(input.method === 'totalSupply'){
            result.totalSupply = totalSupply();
        }
        else if(input.method === 'balanceOf'){
            result.balance = balanceOf(input.owner);
        }
        else if(input.method === 'ownerOf'){
            result.owner = ownerOf(input.tokenId);
        }
        else if(input.method === 'tokensOfOwner'){
            result.tokens = tokensOfOwner(input.owner);
        }
        else{
            throw '<Query interface passes an invalid operation type>';
        }
        return JSON.stringify(result);
    }
    ```

