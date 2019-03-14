---
id: version-1.0.0.10-sto_10
title: BUMO STO 10
sidebar_label: STO 10
original_id: sto_10
---

## Introduction

STO 10 (Security Token Standard) refers to the standard protocol for issuing securities-type Tokens based on BUMO smart contracts. Based on CTP 10, this standard enables you to issue additional tokens, destroy tokens, store relevant legal documents, slash tokens (tranche), set restraint conditions such as lockout periods for tranche. It also allows you to authorize the tranche tokens to third parties, and add the relevant functions of the controller (such as the monitoring department).

## Purpose

Tokens issued under this protocol standard can be distributed and managed in any jurisdiction and is in compliance with relevant regulations. 


## Rule

The BUMO smart contract is implemented in `JavaScript` and contains the initialization function `init` and two entry functions `main`, and `query`. The `init` function is used to initialize the contract when it is created; the `main` function is mainly responsible for data writing, and the `query` function is responsible for data querying. 

## Attributes of STO

### Basic Information of the Token

```
key: global_attribute
value: {
    "version": "1.0",
    "name": "Security Token",
    "symbol": "STO",
    "decimals": 8,
    "totalSupply": "100000",
    "scheduledTotalSupply":"100000",
    "owner":""
}
```
- version: The current version.
- name: The token name.
- symbol:The token symbol.
- decimals: The decimals of the token.
- totalSupply: The total amount of tokens issued. Let us take token A as an example, 10000 tokens have been issued and the decimals are 8, totalSupply=10^decimals*. The result is 1000000000000.
- scheduledTotalSupply: The total amount of tokens to be issued. 0 means no limit on circulation, and greater than 0 means a limited total issuance. Its value is equal to 10^decimals* planned circulation. Take Token A as an example, the total planned issuance is 10,000, the decimals are 8, scheduledTotalSuppl = 10 ^ 8 * 10000. The result is 1000000000000. 
- owner: The owner of the token.

### Attributes and Restraints of Tranche 

```
key: tranche_attribute_id
value: {
    "description": "private",
    "limits": [{
        "name": "lockupPeriod",
        "value": "1517470155872949",
    },
    ……
    ]
}
```
- id: The id of tranche.
- description: The description of tranche.
- limits: The restraints.
- name: The restraint name.
- value: The content of the restraint.

### The Balance of All Tranches

```
key: balance_tokenHolder
value: {
	"value": "100000000", 
	"tranches": ["0", "1",……]
}
```
- tokenHolder: The holder of the token.
- value: The balance.
- tranches: The trancheid list.

### Tranche Balance

```
key: tranche_tokenHolder_id
value: "10000"
```
- tokenHolder: The holder of the token.
- id: The trancheid.
- value: The tranche balance.

### Operator

```
key: operator_tokenHolder_operatorAddress
value: ["0", "1", ……]
```
- tokenHolder: The holder of the token.
- operatorAddress: The operator's address.
- tranches: The trancheid list. The empty list means all tranches are authorized and, non-empty list means only specified tranches are authorized.

### Controller

```
key: global_controller
value: [address1, addres2, ...]
```
- controllers: The controllers list
- address: The controller's address

### Authorization

```
key: allowance_tokenHolder_tranche_spenderAddress
value: "1000"
```
- tokenHolder: The holder of the token.
- tranche: The specified trancheid.
- spenderAddress: The authorized account address.
- value: The amount to be authorized.

### Documentation

```
key: document_documentName
value: {
	"url": "https://BUMO.io/BUMO-Technology-White-Paper-cn",
    "hashType": "sha256",
    "documentHash": "ad67d57ae19de8068dbcd47282146bd553fe9f684c57c8c114453863ee41abc3",
    "provider": "buQXRbzyDaVpX3JT3Wd2gj2U2ZzVWZRpwcng",
    "date": 1544595438978280
}

```
- documentName: The document name.
- url: The url of the document.
- hashType: The hash type.
- documentHash: Hash hex string.
- provider: The provider of the document.
- data: Date provided.

## Event

The functions [setDocument](#setdocument), [createTranche](#createtranche), [transferWithData](#transferwithdata), [transferFromWithData](#transferfromwithdata), [transferFromToTranche](#transferfromtotranche), [transferTranche](#transfertranche), [transferToTranche](#transfertotranche), [transfersToTranche](#transferstotranche), [controllerTransfer](#controllertransfer), [controllerRedeem](#controllerredeem), [authorizeOperator](#authorizeoperator), [revokeOperator](#revokeoperator), [authorizeOperatorForTranche](#authorizeoperatorfortranche), [revokeOperatorForTranche](#revokeoperatorfortranche), [operatorTransferTranche](#operatortransfertranche), [operatorRedeemTranche](#operatorredeemtranche), [issue](#issue), [issueToTranche](#issuetotranche), [redeem](#redeem), [redeemFrom](#redeemfrom), [redeemTranche](#redeemtranche), [redeemFromTranche](#redeemfromtranche), [transfer](#transfer), [approve](#approve), [approveTranche](#approvetranche) and [transferFrom](#transferfrom) will trigger the event, and the event is to call the `tlog` interface, and record a transaction log on the blockchain. The log records the details of the function call for users to read.

The tlog is defined as follows:

```
tlog(topic,args...);

```

- tlog will generate a transaction written on the block.
- topic: The log subject, must be a string type, and the parameter length is (0,128).
- args...: It can contain up to 5 parameters, the parameter type can be string, numeric or boolean type, and the length of each parameter is (0,1024).


## Functions

BUMO ATP 20 Protocol includes the following functions: [tokenInfo](#tokeninfo), [setDocument](#setdocument), [getDocument](#getdocument), [createTranche](#createtranche), [balanceOf](#balanceof), [balanceOfTranche](#balanceoftranche), [tranchesOf](#tranchesof), [transferWithData](#transferwithdata), [transferFromWithData](#transferfromwithdata), [transferFromToTranche](#transferfromtotranche), [transferTranche](#transfertranche), [transferToTranche](#transfertotranche), [transfersToTranche](#transferstotranche)[isControllable](#iscontrollable), [controllerTransfer](#controllertransfer), [controllerRedeem](#controllerredeem), [authorizeOperator](#authorizeoperator),[revokeOperator](#revokeoperator), [authorizeOperatorForTranche](#authorizeoperatorfortranche), [revokeOperatorForTranche](#revokeoperatorfortranche), [isOperator](#isoperator), [isOperatorForTranche](#isoperatorfortranche), [operatorTransferTranche](#operatortransfertranche), [operatorRedeemTranche](#operatorredeemtranche), [isIssuable](#isissuable)[issue](#issue), [issueToTranche](#issuetotranche), [redeem](#redeem), [redeemFrom](#redeemfrom), [redeemTranche](#redeemtranche), [redeemFromTranche](#redeemfromtranche), [canTransfer](#cantransfer), [canTransferTranche](#cantransfertranche), [canTransferToTranche](#cantransfertotranche)、[transfer](#transfer), [transferFrom](#transferfrom), [approve](#approve), [approveTranche](#approvetranche), [allowance](#allowance), and [allowanceForTranche](#allowancefortranche).


### tokenInfo

- Description

> Query Token details.

- Entry function

> query

- Parameter

```json
{
    "method": "tokenInfo
}
```

- Return value

```json
{
    "result":{
        "type": "string",
        "value": {
            "tokenInfo": {
                "name": "DemoToken",
                "symbol": "STP",
                "decimals": 8,
                "totalSupply": "10000000",
                "scheduledTotalSupply": "10000000",
                "owner": "buQXRbzyDaVpX3JT3Wd2gj2U2ZzVWZRpwcng",
                "version": "1.0"
            }
        }
    }
} 
```



### setDocument

​Only used by the owner and controller of the token.

-   Description

> Set up legal documents or other reference materials.

-   Entry function

> main

-   Parameter

```json
{
    "method":"setDocument",
    "params":{
        "name": "BUMO-Technology-White-Paper-cn",
        "url": "https://BUMO.io/BUMO-Technology-White-Paper-cn",
        "hashType": "sha256",
        "documentHash": "ad67d57ae19de8068dbcd47282146bd553fe9f684c57c8c114453863ee41abc3"
    }
}
- name: The document name, and length is [1,256].
- url: The online document link address, and the length is [10,128k].
- hashType: Calculate the type of document hash, and the length is [1,16].
- documentHash: The hexadecimal string of the document hash.
```

-   Return value

> Success: true
>
> Failure: Throw an exception

- Event

```javascript
  tlog('setDocument', sender, name, url, hashType, documentHash);
```


Topic: The method name, here is 'setDocument'.

sender: The account address to call the contract.

name: The document name.

url: The online document url.

​hashType: The hash type.

documentHash: The Hash hex string.



### getDocument

-   Description

> Check legal documents or other reference materials

-   Entry function

> query

-   Parameter

```json
{
    "method":"getDocument",
    "params":{
        "name": "BUMO-Technology-White-Paper-cn"
    }
}
- name: The document name
```

-   Return value
```json
{
	"result": {
        "type": "string",
        "value": {
            "document": {
                "url": "https://BUMO.io/BUMO-Technology-White-Paper-cn",
                "hashType": "sha256",
                "documentHash": "ad67d57ae19de8068dbcd47282146bd553fe9f684c57c8c114453863ee41abc3",
                "provider": "buQXRbzyDaVpX3JT3Wd2gj2U2ZzVWZRpwcng",
                "date": 1544595438978280
            }
        }
	}
}
- url: The url of the online document.
- hashType: The hash type.
- documentHash: The Hash hex string.
- provider: The provider of the document.
- data: When the document is uploaded.
```

### createTranche

It is only available to the owner of the Token.

-   Description

> Create a branch (only the issuer is allowed to operate)

-   Entry function

> main

-   Parameter

```json
{
    "method":"createTranche",
    "params":{
        "tranche":{
            "id": "1",
            "description": "private",
            "limits":[{
                "name":"lockupPeriod",
                "value":"1517470155872949"
            }],
            "tokenHolders":{
                "buQoqGbz7o6RSkDympf8LrqSe8z4QkiBjcHw": "1000",
                ...
            }
        }
    }
}

- id: The trancheid, and the range is [1, 2^63-1].
- description: The trancheDescription, and the range is [1,64k].
- limits: The constraints.
- name: The constraint name and the range is [1,64].
- value: The constraint content and the range is [1,256].
- tokenHolders: A list of distributed accounts, up to 8 accounts are supported.
```
> **Note**: At most 8 tokenHolders are allowed to be distributed.

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### balanceOf

- Description

> Query the total tokens of all tranches under the specified account.

- Entry function

> query

- Parameter

```json
{
    "method": "balanceOfTranche",
    "params":{
        "address": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
}
```

- Return value

```json
{
    "result": {
    	"type": "string",
    	"value": {
            "balance": "0.01"
    	}
    }
}
```

### balanceOfTranche

- Description

> Query the token balance of the specified tranche under the specified account.

-   Entry function

> query

-   Parameter

```json
{
    "method":"balanceOfTranche",
    "params":{
        "tranche": "1",
        "address": "buQZW68otiwmNPgzcBceuQ7NzFLX46FVyh65"
    }
}
```

-   Return value

```json
{
	"result": {
		"type": "string",
		"value": {
            "balance": "1000"
		}
	}
}
```

### tranchesOf

-   Description

> Query the number of all tranches associated with a specific address of the token holder.

-   Entry function

> query

-   Parameter

```json
{
    "method":"tranchesOf",
    "params":{
        "address": "buQZW68otiwmNPgzcBceuQ7NzFLX46FVyh65"
    }
}
```

-   Return value

```json
{
	"result": {
		"type": "string",
		"value": {
            "balance": "30000"
		}
	}
}
```

### transferWithData

-   Description

> Transfer the contract trigger's tokens to the target account and allow any data to be carried.

-   Entry function

> main

-   Parameter

```json
{
    "method": "transferWithData",
    "params":{
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "value": "100",
        "data": ""
    }
}

- to: The recipient address of the tokens
- value: Number of tokens, and the range is [0, 2^63-1]
- data: Allow any data to be submitted with the transfer for interpretation or recording. This can be signature data for authorizing transfers (for example, dynamic whitelisting), but flexible enough to accommodate other use cases. The range is [0,128k].
```
- Return value

> Success: `true`
>
> Failure: Throw an exception

- Event

```javascript
  tlog('transferWithData', sender, to, value, data);
```

topic: The method name, here is `transfer`.

sender: The account address to call the contract.

to: The destination account address. 

value: The amount to transfer (string type).

data: Additional information.

### transferFromWithData

-   Description

> Transfer the tokens of the specified holder to the target account (the contract trigger must be granted a sufficient share) and allow any data to be carried.


-   Entry function

> main

-   Parameter

```json
{
    "method": "transferFromWithData",
    "params":{
        "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "value": "100",
        "data": ""
    }
}
- from: The sending address of the tokens.
- to: The recipient address of the tokens.
- value: Number of tokens, and the range is [0, 2^63-1].
- data: Allow any data to be submitted with the transfer for interpretation or recording. This can be signature data for authorizing transfers (for example, dynamic whitelisting), but flexible enough to accommodate other use cases. The range is [0,128k].
```
- Return value

> Success: `true`
>
> Failure: Throw an exception

- Event

```javascript
  tlog('transferFromWithData', sender, from, to, value, data);
```

topic: The method name, here is 'transfer’.

sender: The account address to call the contract.

from: The source account address to transfer tokens. 

value: The amount to transfer (string type).

data: Additional information.


### transferFromToTranche

-   Description

> Transfer the tokens of the specified tranche of the holder to the target account and allow any data to be carried.


-   Entry function

> main

-   Parameter

```json
{
    "method": "transferFromToTranche",
    "params":{
    	"from": "buQm44k6VxqyLM8gQ7bJ49tJSjArhFsrVUKY",
    	"fromTranche": "0",
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "toTranche": "1",
        "value": "100",
        "data": ""
    }
}

- from: The sending address of the tokens.
- fromTranche: The tranche id of the party to pay tokens, and the range of the id is [0,2^63-1].
- to: The recipient address of tokens.
- value: Number of tokens, and the range is [0, 2^63-1].
- data: Allow any data to be submitted with the transfer for interpretation or recording. This can be signature data for authorizing transfers (for example, dynamic whitelisting), but flexible enough to accommodate other use cases. The range is [0,128k].
```
- Return value

> Success: `true`
>
> Failure: Throw an exception
> 

### transferTranche


-   Description

> Transfer the tokens of the specified tranche of the contract trigger to the specified tranche of the target account and allow any data to be carried.
-   Entry function

> main

-   Parameter

```json
{
    "method": "transferTranche",
    "params":{
        "tranche": "0",
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "value": "100",
        "data": ""
    }
}
- tranche: The tranche id of the token sending account and the token receiving account, and the range of the id is [0,2^63-1].
- to: The recipient address of tokens.
- value: Number of tokens, and the range is [0, 2^63-1].
- data: Allow any data to be submitted with the transfer for interpretation or recording. This can be signature data for authorizing transfers (for example, dynamic whitelisting), but flexible enough to accommodate other use cases. The range is [0,128k].
```
-   Return value

> Success: `true`
>
> Failure: Throw an exception

### transferToTranche

-   Description

> Transfer the tokens of the specified tranche of the contract trigger to the specified tranche of the target account and allow any data to be carried.

-   Entry function

> main

-   Parameter

```json
{
    "method": "transferToTranche",
    "params":{
        "fromTranche": "0",
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "toTranche": "1",
        "value": "100",
        "data": ""
    }
}
- fromTranche: The tranche id of the party to pay tokens, and the range of the id is [0,2^63-1].
- to: The recipient address of tokens.
- toTranche: The tranche id of the party to receive tokens, and the range of the id is [0,2^63-1].
- value: Number of tokens, and the range is [0, 2^63-1].
- data: Allow any data to be submitted with the transfer for interpretation or recording. This can be signature data for authorizing transfers (for example, dynamic whitelisting), but flexible enough to accommodate other use cases. The range is [0,128k].
```
- Return value

> Success: `true`
>
> Failure: Throw an exception

### transfersToTranche

-   Description

> Transfer the tokens of the specified tranche of the contract trigger to a certain tranche of multiple target accounts and allow any data to be carried.


-   Entry function

> main

-   Parameter

```json
{
    "method": "transfersToTranche",
    "params":{
        "fromTranche": "0",
        "toTranche": "1",
        "tokenHolders": {
            Address1: value1,
            Address2: value2,
             …
        },
        "data": ""
    }
}
- fromTranche: The tranche id of the party to pay tokens, and the range of the id is [0,2^63-1].
- toTranche: The tranche id of the party to receive tokens, and the range of the id is [0,2^63-1].
- tokenHolders: The list of token-receiving accounts.
- Address1/Address2/...: The account address to receive tokens.
- value1/value2/...: Number of tokens to be transferred, and the range is [0, 2^63-1].
- data: Allow any data to be submitted with the transfer for interpretation or recording. This can be signature data for authorizing transfers (for example, dynamic whitelisting), but flexible enough to accommodate other use cases. The range is [0,128k].
```
- Return value

> Success: Return the tranche of the target account
>
> Failure: Throw an exception



### isControllable

-   Description

> Determine whether the current Token is controllable, and whether the circulation between the two accounts can be controlled by the judicial/designated account (no authorization required).

-   Entry function

> query

-   Parameter

```json
{
    "method": "isControllable"
}
```

> **Note**: If isControllable is `true`, the controller can use `operatorTransferTranche` and `operatorRedeemTranche` without authorization.

-   Return value

> Success: `true`
>
> Failure: false

### controllerTransfer

>In some jurisdictions, an issuer (or an entity entrusted by an issuer) may need to retain the ability to forcibly transfer tokens. This may be to resolve legal disputes or court orders, or to remedy the loss of investors who are inaccessible to their private keys.

-   Description

> Allow authorized addresses to pass tokens between any two token holders.

-   Entry function

> main

-   Parameter

```json
{
    "method": "controllerTransfer",
    "params":{
        "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "fromTranche": "1",
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "toTranche": "2",
        "value": "100",
        "data": "",
        "operatorData": ""
    }
}
- from: The account address to pay tokens.
- fromTranche: The tranche id of the party to pay tokens, and the range of the id is [0,2^63-1].
- to: The recipient address of tokens.
- toTranche: The tranche id of the party to receive tokens, and the range of the id is [0,2^63-1].
- value: Number of tokens, and the range is [0, 2^63-1].
- data: Allow any data to be submitted with the transfer for interpretation or recording. This can be signature data for authorizing transfers (for example, dynamic whitelisting), but flexible enough to accommodate other use cases. The range is [0,64k].
- operatorData: Allow any data to be submitted with the transfer for interpretation or recording. This can be signature data for authorizing transfers (for example, dynamic whitelisting), but flexible enough to accommodate other use cases. The range is [0,64k].
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### controllerRedeem

> In some jurisdictions, an issuer (or an entity entrusted by an issuer) may need to retain the ability to forcibly transfer tokens. This may be to resolve legal disputes or court orders, or to remedy the loss of investors who are inaccessible to their private keys.
-   Description

> Allow authorized addresses to redeem tokens for any token holder.

-   Entry function

> main

-   Parameter

```json
{
    "method": "controllerRedeem",
    "params":{
        "tokenHolder": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "tranche": "1",
        "value": "100",
        "data": "",
        "operatorData": ""
    }
}
```

> data: Allow any data to be submitted with the transfer for interpretation or recording. This can be signature data (for example, dynamic whitelisting), but flexible enough to accommodate other use cases. 


-   Return value

> Success: `true`
>
> Failure: Throw an exception



### authorizeOperator

-   Description

> Authorize an operator for all tranches of the contract trigger.

-   Entry function

> main

-   Parameter

```json
{
    "method": "authorizeOperator",
    "params":{
        "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### revokeOperator

-   Description

> Unauthorize the operator of all tranches of the previous contract trigger.

-   Entry function

> main

-   Parameter

```json
{
    "method": "revokeOperator",
    "params":{
        "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### authorizeOperatorForTranche

-   Description

> Authorize an operator for the specified tranche of the contract trigger.

-   Entry function

> main

-   Parameter

```json
{
    "method": "authorizeOperatorForTranche",
    "params":{
        "tranche": "1",
        "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### revokeOperatorForTranche

-   Description

> Unauthorize the operator for the specified tranche of the contract trigger.

-   Entry function

> main

-   Parameter

```json
{
    "method": "revokeOperatorForTranche",
    "params":{
        "tranche": "1",
        "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception



### isOperator

-   Description

> Determine whether the one is the operator of all tranches of the token holder.

-   Entry function

> query

-   Parameter

```json
{
    "method": "isOperator",
    "params":{
        "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV"
    }
}
```

-   Return value

> Success: `true`
>
> Failure: false


### isOperatorForTranche

-   Description

> Determine whether the one is the operator of the specified tranche of the token holder.

-   Entry function

> query

-   Parameter

```json
{
    "method": "isOperatorForTranche",
    "params":{
        "tranche": "1",
        "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV"
    }
}
```

-   Return value

> Success: `true`
>
> Failure: false

### operatorTransferTranche

-   Description

> Allow the operator to transfer tokens within the specified tranche on behalf of the token holder.

-   Entry function

> main

-   Parameter

```json
{
    "method": "operatorTransferTranche",
    "params":{
        "tranche": "1",
        "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "value": "100",
        "data": "",
        "operatorData": ""
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception



### operatorRedeemTranche

-   Description

> Allow the operator to redeem tokens on behalf of the token holder within the specified tranche (the total amount of tokens will be reduced).

-   Entry function

> main

-   Parameter

```json
{
    "method": "operatorRedeemTranche",
    "params":{
        "tranche": "1",
        "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "value": "100",
        "operatorData": ""
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### isIssuable

-   Description

> The securities token issuer can specify that the issuance is completed (ie no new token can be cast or issued).

-   Entry function

> query

-   Parameter

```json
{
    "method": "isIssuable"
}
```

-   Return value

> Success: true
>
> Failure: false

### issue

-   Description

> Increase the total supply of the specified token holder.

-   Entry function

> main

-   Parameter

```json
{
    "method": "issue",
    "params":{
        "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "nowSupply": "1000000000000",
        "data": ""
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### issueToTranche

-   Description

> Increase the supply of the specified tranche of the specified token holder.

-   Entry function

> main

-   Parameter

```json
{
    "method": "issueToTranche",
    "params":{
        "tranche": "",
        "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "nowSupply": "1000000000000",
        "data": ""
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception



### redeem

-   Description

> Redeem a specified amount of tokens from the contract trigger (the total supply will decrease).

-   Entry function

> main

-   Parameter

```json
{
    "method": "redeem",
    "params":{
        "value": "1000000000000",
        "data": ""
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception



### redeemFrom

-   Description

> Redeem a specified amount of tokens from the specified token holder (the total supply will decrease).

-   Entry function

> main

-   Parameter

```json
{
    "method": "redeemFrom",
    "params":{
        "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "value": "1000000000000",
        "data": ""
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### redeemTranche

-   Description

> Redeem a specified amount of tokens from the specified tranche of the contract trigger (the total supply will decrease).

-   Entry function

> main

-   Parameter

```json
{
    "method": "redeemTranche",
    "params":{
        "tranche": "1",
        "value": "1000000000000",
        "data": ""
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### redeemFromTranche

-   Description

> Redeem a specified amount of tokens from the specified token holder (the total supply will be reduced and a sufficient share must be granted ).

-   Entry function

> main

-   Parameter

```json
{
    "method": "redeemFromTranche",
    "params":{
        "tranche": "1",
        "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "value": "1000000000000",
        "data": ""
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### canTransfer

-   Description

> Whether the transmission can be successful.

-   Entry function

> main

-   Parameter

```json
{
    "method": "canTransfer",
    "params":{
        "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "value": "100",
        "data": ""
    }
}
```

-   Return value

Success: `true`

Failure: Throw an error message

### canTransferTranche

-   Description

> Specify whether the tokens in the tranche can be successfully transferred.

-   Entry function

> main

-   Parameter

```json
{
    "method": "canTransferByTranche",
    "params":{
        "tranche": "",
        "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        “value”: "100",
        "data": ""
    }
}
```

-   Return value

Success: true

Failure: Throw an error message

### canTransferToTranche

-   Description

> Specify whether the tokens in the tranche can be transferred to the target specified tranche.

-   Entry function

> main

-   Parameter

```json
{
    "method": "canTransferByTranche",
    "params":{
        "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "fromTranche": "1",
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "toTranche": "2",
        “value”: "100",
        "data": ""
    }
}
```

-   Return value

Success: `true`

Failure: Throw an error message



### transfer

-   Description

> Transfer the contract trigger's tokens to the target account.

-   Entry function

> main

-   Parameter

```json
{
    "method": "transfer",
    "params":{
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "value": "100"
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

- Event

```javascript
  tlog('transfer', sender, to, value);
```

topic: The method name, here is `transfer`.

sender: The account address to call the contract.

to: The destination account address. 

value: The amount to transfer (string type).


### transferFrom

-   Description

> Transfer the tokens of the specified holder to the target account (the contract trigger must be granted a sufficient share).

-   Entry function

> main

-   Parameter

```json
{
    "method": "transferFrom",
	"params":{
        "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "value": "100"
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

- Event

```javascript
tlog('transferFrom', sender, from, to, value);
```

topic: The method name, here is `transferFrom`.

sender: The account address to call the contract.

from: The source account address.

to: The destination account address. 

value: The amount to transfer (string type).



### approve

-   Description

> Allow the specified account to operate the tokens on behalf of the token holder.

-   Entry function

> main

-   Parameter

```json
{
    "method": "approve",
	"params":{
        "spender": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "value": "100"
    }
}
```

-   Return value

> Success: `true`

> Failure: Throw an exception

- Event

```javascript
  tlog('approve', sender, spender, value);
```

topic: The method name, here is `approve`.

sender: The account address to call the contract.

spender: The authorized account address.

value: The amount to transfer (string type).



### approveTranche

-   Description

> Allow the specified account to operate the tokens on behalf of the token holder.

-   Entry function

> main

-   Parameter

```json
{
    "method": "approveTranche",
	"params":{
        "tranche": "1",
        "spender": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "value": "100"
    }
}
```

-   Return value

> Success: `true`
>
> Failure: Throw an exception

### allowance

-   Description

> Query the number of tokens that the specified account can operate on behalf of the token holder.

-   Entry function

> query

-   Parameter

```json
{
    "method": "allowance",
	"params":{
        "owner": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "spender": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
}
```

-   Return value

```json
{
	"result": {
		"type": "string",
		"value": {
			"allowance": "10000000"
		}
	}
}
```


### allowanceForTranche

-   Description

> Query the number of tokens that the specified account can operate on behalf of the token holder.

-   Entry function

> query

-   Parameter

```json
{
    "method": "allowanceForTranche",
	"params":{
	    "tranche": "1",
        "owner": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
        "spender": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
}
```

-   Return value

```json
{
	"result": {
		"type": "string",
		"value": {
			"allowance": "100000"
		}
	}
}
```

## Contract Entry

### init

- When the contract is created, the `init` Entry function is triggered, which is responsible for the initialization of the contract.

- Function

```js
function init(input_str){
}

```

- Parameter are in json format

```json
{
    "params":{
        "name": "123",
        "symbol": "STP",
        "description": "STP",
        "decimals": 8,
        "nowSupply": "10000000",
        "scheduledTotalSupply": "10000000",
        "icon": "",
        "controllers": ["buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"]
    }
}
- name: The token name, and the range is [1,64].
- code: The token symbol, and the range is [1,64].
- description: The description for the token and the range is [1,64k].
- decimals: The token symbol, which indicates the supported decimal places, and the range is [0,8].
- nowSupply: The current circulation of the token, with a range [0, 2^63-1]. Its value is equal to 10^decimals* circulation. If you are currently issuing a token with a quantity of 10000 and the decimal places are 8, then nowSupply = 10 ^ 8 * 10000, and the result is 1000000000000.
- scheduledTotalSupply: The total amount of tokens to be issued and the range is [0,2^63-1]. 0 means no limit on circulation, and greater than 0 means a limited ssuance. Its value is equal to 10^decimals* scheduled circulation. If you are issuing 10,000 tokens, the decimals are 8, scheduledTotalSuppl = 10 ^ 8 * 10000. The result is 1000000000000. 
- icon: base64 bit encoding, icon file size is less than 32k, 200*200 pixels are recommended.
- controllers: The controller list of the token, which is the list of regulators.
```
Return value：

​	Success: None

​	Failure: Throw an exception


### main

- Responsible for data writing, including [setDocument](#setdocument), [createTranche](#createtranche), [transferWithData](#transferwithdata), [transferFromWithData](#transferfromwithdata), [transferFromToTranche](#transferfromtotranche), [transferTranche](#transfertranche), [transferToTranche](#transfertotranche), [transfersToTranche](#transferstotranche), [controllerTransfer](#controllertransfer), [controllerRedeem](#controllerredeem), [authorizeOperator](#authorizeoperator), [revokeOperator](#revokeoperator), [authorizeOperatorForTranche](#authorizeoperatorfortranche), [revokeOperatorForTranche](#revokeoperatorfortranche), [operatorTransferTranche](#operatortransfertranche), [operatorRedeemTranche](#operatorredeemtranche), [issue](#issue), [issueToTranche](#issuetotranche), [redeem](#redeem), [redeemFrom](#redeemfrom), [redeemTranche](#redeemtranche), [redeemFromTranche](#redeemfromtranche), [transfer](#transfer), [approve](#approve), [approveTranche](#approvetranche), [transferFrom](#transferfrom) and other interfaces.
- Function body

```js
function main(input_str){
    let input = JSON.parse(input_str);

    if (input.method === 'setDocument'){
      setDocument(input.params.name, input.params.url, input.params.hashType, input.params.documentHash);
    }
    else if(input.method === 'createTranche'){
      createTranche(input.params.tranche);
    }
    else if(input.method === 'changeOwnership'){
      changeOwnership(input.params.owner);
    }
    else if(input.method === 'issue'){
      issue(input.params.tokenHolder, input.params.nowSupply, input.params.data);
    }
    else if(input.method === 'issueToTranche'){
      issueToTranche(input.params.tranche, input.params.tokenHolder, input.params.nowSupply, input.params.data);
    }
    else if (input.method === 'approveTranche'){
      approveTranche(input.params.tranche, input.params.spender, input.params.value, input.params.data);
    }
    else if(input.method === 'approve'){
      approve(input.params.spender, input.params.value);
    }
    else if(input.method === 'transfer'){
      transfer(input.params.to, input.params.value);
    }
    else if(input.method === 'transferFrom'){
      transferFrom(input.params.from, input.params.to, input.params.value);
    }
    else if(input.method === 'transferWithData'){
      transferWithData(input.params.to, input.params.value, input.params.data);
    }
    else if(input.method === 'transferFromWithData'){
      transferFromWithData(input.params.from, input.params.to, input.params.value, input.params.data);
    }
    else if(input.method === 'transferTranche'){
      transferTranche(input.params.tranche, input.params.to, input.params.value, input.params.data);
    }
    else if(input.method === 'transferToTranche'){
      transferToTranche(input.params.fromTranche, input.params.to ,input.params.toTranche, input.params.value, input.params.data);
    }
    else if(input.method === 'transfersToTranche'){
      transfersToTranche(input.params.fromTranche, input.params.toTranche, input.params.tokenHolders);
    }
    else if(input.method === 'transferFromToTranche'){
      transferFromToTranche(input.params.from, input.params.fromTranche, input.params.to ,input.params.toTranche, input.params.value, input.params.data);
    }
    else if (input.method === 'controllerTransfer'){
      controllerTransfer(input.params.from, input.params.fromTranche, input.params.to, input.params.toTranche, input.params.value, input.params.data, input.params.operatorData);
    }
    else if(input.method === 'controllerRedeem'){
      controllerRedeem(input.params.tokenHolder, input.params.tranche, input.params.value, input.params.data, input.params.operatorData);
    }
    else if(input.method === 'authorizeOperator'){
      authorizeOperator(input.params.operator);
    }
    else if(input.method === 'authorizeOperatorForTranche'){
      authorizeOperatorForTranche(input.params.tranche, input.params.operator);
    }
    else if(input.method === 'revokeOperator'){
      revokeOperator(input.params.operator);
    }
    else if(input.method === 'revokeOperatorForTranche'){
      revokeOperatorForTranche(input.params.tranche, input.params.operator);
    }
    else if(input.method === 'operatorTransferTranche'){
      operatorTransferTranche(input.params.tranche, input.params.from, input.params.to, input.params.value, input.params.data, input.params.operatorData);
    }
    else if(input.method === 'redeem'){
      redeem(input.params.value, input.params.data);
    }
    else if(input.method === 'redeemFrom'){
      redeemFrom(input.params.tokenHolder, input.params.value, input.params.data);
    }
    else if(input.method === 'redeemTranche'){
      redeemTranche(input.params.tranche, input.params.value, input.params.data);
    }
    else if(input.method === 'operatorRedeemTranche'){
      operatorRedeemTranche(input.params.tranche, input.params.tokenHolder, input.params.value, input.params.operatorData);
    }
    else{
        throw '<unidentified operation type>';
    }
}
```

### query

- Responsible for data query, including [getDocument](#getdocument), [isIssuable](#isissuable), [tokenInfo](#tokeninfo), [balanceOf](#balanceof), [tranchesOf](#tranchesof), [balanceOfTranche](#balanceoftranche), [allowance](#allowance), [allowanceForTranche](#allowancefortranche), [isControllable](#iscontrollable), [isOperator](#isoperator), [isOperatorForTranche](#isoperatorfortranche), [canTransfer](#cantransfer), [canTransferTranche](#cantransfertranche), [canTransferToTranche](#cantransfertotranche) and other interfaces.
- Function body

```js
function query(input_str){
    let result = {};
    let input  = JSON.parse(input_str);

    if(input.method === 'getDocument'){
      result.document = getDocument(input.params.name);
    }
    else if(input.method === 'isIssuable'){
      result.isIssuable = isIssuable();
    }
    else if(input.method === 'tokenInfo'){
      globalAttribute = JSON.parse(storageLoad(globalAttributeKey));
      result.tokenInfo = globalAttribute;
    }
    else if(input.method === 'balanceOf'){
      result.balance = balanceOf(input.params.address);
    }
    else if(input.method === 'tranchesOf'){
      result.tranches = tranchesOf(input.params.address);
    }
    else if(input.method === 'balanceOfTranche'){
      result.balance = balanceOfTranche(input.params.tranche, input.params.address);
    }
    else if(input.method === 'allowance'){
      result.allowance = allowance(input.params.owner, input.params.spender);
    }
    else if (input.method === 'allowanceForTranche'){
      result.allowance = allowanceForTranche(input.params.tranche, input.params.owner, input.params.spender);
    }
    else if(input.method === 'isControllable'){
      result.isControllable = isControllable();
    }
    else if(input.method === 'isOperator'){
      result.isOperator = isOperator(input.params.operator, input.params.tokenHolder);
    }
    else if(input.method === 'isOperatorForTranche'){
      result.isOperator = isOperatorForTranche(input.params.tranche, input.params.operator, input.params.tokenHolder);
    }
    else if(input.method === 'canTransfer'){
      result.canTransfer = canTransfer(input.params.from, input.params.to, input.params.value, input.params.data);
    }
    else if(input.method === 'canTransferTranche'){
      result.canTransfer = canTransferTranche(input.params.from, input.params.to, input.params.tranche, input.params.value, input.params.data);
    }
    else if (input.method === 'canTransferToTranche'){
      result.canTransfer = canTransferToTranche(input.params.from, input.params.fromTranche, input.params.to, input.params.toTranche, input.params.value, input.params.data);
    }
    else{
        throw '<Query interface passes an invalid operation type>';
    }
    return JSON.stringify(result);
}
```