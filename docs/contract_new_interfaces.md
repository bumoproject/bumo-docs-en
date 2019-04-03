---
id: contract_new_interfaces
title: BUMO Smart Contract Development (New Interfaces)
sidebar_label: New Interfaces
---

## Overview

The BUMO Smart Contract is a snippet of `JavaScript` code, with a standard (ECMAScript as specified in ECMA-262). The initialization function of the contract is `init`, the entry function of the execution is the `main` function, and the query interface is `query`. The parameter string `input` of these functions is specified when the contract is called.

The following is a simple example:

```javascript
"use strict";
function init(input)
{
  /*init whatever you want*/
  return;
}

function main(input)
{
  let para = JSON.parse(input);
  if (para.do_foo)
  {
    let x = {
      'hello' : 'world'
    };
  }
}

function query(input)
{ 
  return input;
}
```



## Objects in the Interfaces

The global objects `Chain` and `Utils` are provided in the BUMO smart contract. These two objects provide various methods and variables, which can get some information about the blockchain, and can also drive the account to initiate all transactions, excluding setting thresholds and weights.

> **Note**: The custom variables should not be duplicated with built-in objects, because this can result in uncontrollable data errors.



### Method Usage

Object. method (variable)

- Obtain the account balance

  ```javascript
  Chain.getBalance('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY');
  ```

- Print logs	

  ```javascript
  Utils.log('hello');
  ```

- The current block number

  ```javascript
  Chain.block.number;
  ```


### Read and Write Privileges

1. Each function in the object has a fixed **read-only** or **write** privilege.
   - Read-only permissions are interface functions that **do not write data to the blockchain**, such as getting the balance [Chain.getBalance](#chaingetbalance).

   - Write permissions refer to interface functions that **write data to the blockchain**, such as transfer tokens [Chain.payCoin](#chainpaycoin).

2. When writing smart contracts, you should be noted that different entry functions have different calling permissions.

    - `init` and `main` can call all built-in functions.

   - `query` can only call functions with read-only permissions, otherwise the interface will be prompted undefined during debugging or execution.



### Return Value

When calling an internal function, return `false` if it fails or throw an exception and terminate the call, otherwise it is successful for other objects. If a parameter error is encountered, the parameter position error will be indicated in the error description. The position here refers to the index number of the parameter, that is, counting from *0*. For example, `parameter 1` indicates that the *2* parameter is incorrect. 

The following is an example:
```javascript 
Chain.issueAsset("CNY", 10000);
/*
    Error description:
    Contract execute error,issueAsset parameter 1 should be a string

    It means that the second parameter should be a string
*/
```

## Methods of the Chain Object

This section describes some methods of the Chain object, including [Chain.load](#chainload), [Chain.store](#chainstore), [Chain.del](#chaindel), [Chain.getBlockHash](#chaingetblockhash), [Chain.tlog](#chaintlog), [Chain.getAccountMetadata](#chaingetaccountmetadata), [Chain.getBalance](#chaingetbalance), [Chain.getAccountAsset]( #chaingetaccountasset), [Chain.getContractProperty](#chaingetcontractproperty), [Chain.payCoin](#chainpaycoin), [Chain.issueAsset](#chainissueasset), [Chain.payAsset](#chainpayasset), [Chain.delegateCall](#chaindelegatecall), [Chain.delegateQuery](#chaindelegatequery), [Chain.contractCall](#chaincontractcall), [Chain.contractQuery](#chaincontractquery ), and [Chain.contractCreate](#chaincontractcreate).

### Chain.load

- Description

  Get the metadata information of the contract account.

- Function call

```javascript
Chain.load(metadata_key);
```

- Parameter description

  - Metadata_key: The keyword for metadata.

- Example

  ```javascript
  let value = Chain.load('abc');
  /*
    
    Permission: Read-only.
    Return value: Return a string if it succeeds, such as 'values'; return false if it fails.
  */
  ```

### Chain.store

- Description

  Store the metadata information of the contract account.

- Function call

  ```javascript
  Chain.store(metadata_key, metadata_value);
  ```

- Parameter description

  - metadata_key: The keyword for metadata.
  - metadata_key: The content of metadata.


- Example

  ```javascript
  Chain.store('abc', 'values');
  /*
    Permission: Write
    Return value: Return true if it succeeds, or throw an exception if it fails
  */
  ```

### Chain.del

- Description

  Delete the metadata information of the contract account.

- Function call

  ```javascript
  Chain.del(metadata_key);
  ```

- Parameter description

  - metadata_key: The keyword for metadata.
  - metadata_key: The metadata content.

- Example

  ```javascript
  Chain.del('abc');
  /*
    Permission: Write
    Return: Return true if it succeeds, or throw an exception if it fails
  */
  ```

### Chain.getBlockHash

- Description

  Get block information.

- Function call

  ```javascript
  Chain.getBlockHash(offset_seq);
  ```

- Parameter description

  - offset_seq: The offset from the last block ranges: [0,1024).

- Example

  ```javascript
  let ledger = Chain.getBlockHash(4);
  /*
    Permission: Read-only
    Return value: Return a string if it succeeds, such as'c2f6892eb934d56076a49f8b01aeb3f635df3d51aaed04ca521da3494451afb3', or return false if it fails
  */
  ```

### Chain.tlog

- Description

  Output transaction logs.

- Function call

  ```javascript
  Chain.tlog(topic,args...);
  ```

- Parameter description

  - tlog will generate a transaction written on the block.
  - topic: The log subject, which must be a string type with a parameter length of (0,128].
  - args...: It can contain up to 5 parameters, which can be string, numeric or Boolean type, with each parameter length (0,1024].

- Example

  ```javascript
  Chain.tlog('transfer',sender +' transfer 1000',true);
  /*
    Permission: Write
    Return value: Return true if it succeeds, or throw an exception if it fails
  */
  ```

### Chain.getAccountMetadata

- Description

  Get the metadata of the specified account.

- Function call

  ```javascript
  Chain.getAccountMetadata(account_address, metadata_key);
  ```

- Parameter description

  - account_address: The account address.
  - metadata_key: The keyword for metadata.

- Example

  ```javascript
  let value = Chain.getAccountMetadata('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY', 'abc');
  
  /*
    Permission: Read-only
    Return value: Return a string if it succeeds, such as 'values', or return false if it fails.
  */
  ```

### Chain.getBalance

- Description

  Get the coin amount of the account.

- Function call

  ```javascript
  Chain.getBalance(address);
  ```

- Parameter description

  - address: The account address

- Example

  ```javascript
  let balance = Chain.getBalance('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY');
  /*
    Permission: Read-only
    Return value: Number in string format '9999111100000'
  */
  ```

### Chain.getAccountAsset

- Description

  Get asset information for an account

- Function call

  ```javascript
  Chain.getAccountAsset(account_address, asset_key);
  ```

- Parameter description

  - account_address: The account address.
  - asset_key: The asset attributes.

- Example

  ```javascript
  let asset_key =
  {
    'issuer' : 'buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY',
    'code' : 'CNY'
  };
  let bar = Chain.getAccountAsset('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY', asset_key);
  
  /*
    Permission: Read-only
    Return value: Return the asset value such as '10000' if it succeeds, or return false if it fails
  */
  ```

### Chain.getContractProperty

- Description

  Get the attributes of the contract account.

- Function call

  ```javascript
  Chain.getContractProperty(contract_address);
  ```

- Parameter description

  - contract_address: The contract address.

- Example

  ```javascript
  let value = Chain.getContractProperty('buQcFSxQP6RV9vnFagZ31SEGh55YMkakBSGW');
  
  /*
    Permission: Read-only
    Return value: Return a JSON object such as {"type":0, "length" : 416} if it succeeds, where the type refers to the contract type and the length refers to the code length of the contract, and if the account is not a contract, then the length is 0; return false if it fails.
    
  */
  ```

### Chain.payCoin

- Description

  Transfer tokens.

- Function call

  ```javascript
  Chain.payCoin(address, amount[, input]);
  ```

- Parameter description

  - address: The target address.
  - amount: The amount of BU.
  - input: Optional, the contract parameter. By default, it is an empty string if it is not filled in.

- Example

  ```javascript
  Chain.payCoin("buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY", "10000", "{}");
  /*
    Permission: Write
    Return value: Return true if it succeeds, or throw an exception if it fails  
  */
  ```

### Chain.issueAsset

- Description

  Issue assets.

- Function call

  ```javascript
  Chain.issueAsset(code, amount);
  ```

- Parameter description

  - code: The asset code.
  - amount: The amount of the asset to be issued.

- Example

  ```javascript
  Chain.issueAsset("CNY", "10000");
  /*
    Permission: Write
    Return value: Return true if it succeeds, or throw an exception if it fails  
  */
  ```

### Chain.payAsset

- Description

  Transfer tokens

- Function call

  ```javascript
  Chain.payAsset(address, issuer, code, amount[, input]);
  ```

- Parameter description

  - address: The target address.
  - issuer: The asset issuer.
  - code: The asset code.
  - amount: The amount to be transferred.
  - input: Optional, the contract parameter. By default, it is an empty string if it is not filled in.

- Example

  ```javascript
  Chain.payAsset("buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY", "buQgmhhxLwhdUvcWijzxumUHaNqZtJpWvNsf", "CNY", "10000", "{}");
  /*
    Permission: Write
    Return value: Return true if it succeeds, or throw an exception if it fails    
  */
  ```

### Chain.delegateCall

- Description

  Delegate call.

- Function call

  ```javascript
  Chain.delegateCall(contractAddress, input);
  ```

- Parameter description

  - contractAddress: The address of the contract to be called.
  - input：Input parameter.

  The `Chain.delegateCall` function will trigger the `main` function of the contract to be called, and the Chain.delegateCall function will assign the execution environment of the current contract to the contract to be called.

- Example

  ```javascript
  let ret = Chain.delegateCall('buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY'，'{}');
  /*
    Permission: Write
    Return value: Return a result if it succeeds, or throw an exception if it fails.
  */
  ```

### Chain.delegateQuery

- Description

  Delegate query.

- Function call

  ```javascript
  Chain.delegateQuery(contractAddress, input);
  ```

- Parameter description

  - contractAddress: The address of the contract to be called.
  - input：Input parameter.

   The `Chain.delegateQuery` function will trigger the `query` function of the contract to be called, and the Chain.delegateQuery function will assign the execution environment of the current contract to the contract to be called.

- Example

  ```javascript
  let ret = Chain.delegateQuery('buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY'，"");
  /*
    Permission: Read-only
    Return value: If the target account is a normal account, it returns true. If the target account is a contract, and the call succeeds, the string {"result":"4"} is returned, where the value of the result field is the specific result of the query, and if the call fails return {"error ":true} string.
  */
  ```

### Chain.contractCall

- Description

  Call contracts.

- Function call

  ```javascript
  Chain.contractCall(contractAddress, asset, amount, input);
  ```

- Parameter description

  - contractAddress: The address of the contract to be called
  
  - asset: The asset class, true for BU, object {"issue": buxxx, "code" : USDT} for assets.
  - amount: The amount of the asset.
  - input：Input parameter.

  The `Chain.contractCall` function triggers the `main` function entry of the contract to be called.

- Example

  ```javascript
  let ret = Chain.contractCall('buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY'，true, toBaseUnit("10"), "");
  /*
    Permission: Write
    Return value: Return true if the target account is a normal account. If the target account is a contract, the return value of the main function is returned if the call succeeds, and an exception is thrown if the call fails.
  */
  ```

### Chain.contractQuery

- Description

  Query contracts.

- Function call

  ```javascript
  Chain.contractQuery(contractAddress, input);
  ```

- Parameter description

  - contractAddress: The address of the contract to be called
  - input：Input parameter.

  The Chain.contractQuery function will call the query interface of the contract.

- Example

  ```javascript
  let ret = Chain.contractQuery('buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY'，"");
  /*
    Permission: Read-only
    Return value: If the call succeeds, the string {"result":"xxx"} is returned, where the value of the result field is the specific result of the query, and if the call fails, return a string of {"error":true}.
  */
  ```

### Chain.contractCreate

- Description

  Create Contracts.

- Function call

  ```javascript
  Chain.contractCreate(balance, type, code, input);
  ```

- Parameter description

  - balance: The asset that is transferred to the contract created, in string.
  - type :0 indicates javascript, in integer.
  - code: The contract code, in string.
  - input：The initiation parameter of the init function.

  The Chain.contractCreate function create contracts.

- Example

  ```javascript
  let ret = Chain.contractCreate(toBaseUnit("10"), 0, "'use strict';function init(input){return input;} function main(input){return input;} function query(input){return input;} ", "");
  /*
    Permission: Write
    Return value: Return the contract address if it is created successfully, or throw an exception if it fails.
  */
  ```

### 

## Variables of the Chain Object

This section introduces some variables of the Chain object, respectively [Chain.block](#chainblock), [Chain.tx](#chaintx) , [Chain.msg](#chainmsg) related variables and [Chain.thisAddress](#chainthisaddress). The variables of the block information include [Chain.block.timestamp](#chainblocktimestamp), [Chain.block.number](#chainblocknumber). Variables for transaction information include [Chain.tx.initiator](#chaintxinitiator), [Chain.tx.sender](#chaintxsender), [Chain.tx.gasPrice](#chaintxgasprice), [Chain.tx.hash](#chaintxhash), [chain.tx.feeLimit](#chaintxfeelimit). The variables of the message include [Chain.msg.initiator](#chainmsginitiator), [Chain.msg.sender](#chainmsgsender), [Chain.msg.coinAmount](#chainmsgcoinamount ), [Chain.msg.asset](#chainmsgasset), [Chain.msg.nonce](#chainmsgnonce), [Chain.msg.operationIndex](#chainmsgoperationindex).

### Chain.block



#### Chain.block.timestamp

- Variable description

  The timestamp of the block when the current transaction is executed.



#### Chain.block.number

- Variable description

  The height of the block where the current transaction is executed.



### Chain.tx

- Variable description

  The transaction information signed by the user at the time of the transaction.



#### Chain.tx.initiator

- Variable description

  The original originator of the transaction, that is the fee payer of the transaction.



#### Chain.tx.sender

- Variable description
  
  The most primitive trigger of the transaction, that is the account in the transaction that triggers the execution of the contract.
  For example, an account initiates a transaction, and an operation in the transaction is to call the contract Y (the source_address of the operation is x), then the value of the sender is the address of the account x during the execution of the contract Y.

- Example

  ```javascript
  let bar = Chain.tx.sender;
  /*  
   Then the value of bar is the account address of x.
  */
  ```



#### Chain.tx.gasPrice

- Variable description
  
  The price of the gas in the transaction signature.



#### Chain.tx.hash

- Variable description

  The hash value of the transaction.



#### Chain.tx.feeLimit

- Variable description

  The limit fee for the transaction.



### Chain.msg

A message is the information that triggers the execution of a smart contract in a transaction. During the execution of the triggered contract, the transaction information will not be changed and the message will change. For example, when calling `contractCall`, `contractQuery` in a contract, the message will change.



#### Chain.msg.initiator

- Variable description
  
  The original originator account for this message.



#### Chain.msg.sender

- Variable description
  
  The account number for triggering this message.

- Example
  
  For example, an account initiates a transaction, and an operation in the transaction is to call the contract Y (the source_address of the operation is x), then the value of the sender is the address of the account x during the execution of the contract Y.

  ```javascript
  let bar = Chain.msg.sender;
  /*
  Then the value of bar is the account address of x.
  */
  ```


#### Chain.msg.coinAmount

- Variable description
  
  The BUs for this payment operation


#### Chain.msg.asset

- Variable description
  
  The assets for this payment operation
  
- Example
  ```json
  {
      "amount": 1000, 
      "key" : {
          "issuer": "buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY", 
          "code":"CNY"
      }
  }
  ```



#### Chain.msg.nonce

- Variable description
  
   The nonce value of the initiator in this transaction, ie the nonce value of the `Chain.msg.initiator` account.



#### Chain.msg.operationIndex

- Variable description

  The sequence number for triggering this contract calling operation.

- Example

  For example, an account A initiates a transaction tx0, and tx0 has a 0th (counting from 0) operation which is to transfer assets to a contract account (contract call), then the value of `Chain.msg.operationIndex` is 0.

  ```javascript
  let bar = Chain.msg.operationIndex;
  /* bar is a non-negative integer*/
  ```



### Chain.thisAddress

- Variable description
  
  The address of the current contract account.

- Example

  For example, the account x initiates a transaction to call contract Y. During this execution, the value is the address of the contract account Y.

  ```js
  let bar = Chain.msg.thisAddress;
  /*
   The value of bar is the account address of the contract Y.
  */
  ```



## Methods of the Utils Object

This section describes some of the methods of the Utils object, including [Utils.log](#utilslog), [Utils.stoI64Check](#utilsstoi64check), [Utils.int64Add](#utilsint64add), [Utils.int64Sub ](#utilsint64sub), [Utils.int64Mul](#utilsint64mul), [Utils.int64Mod](#utilsint64mod), [Utils.int64Div](#utilsint64div), [Utils.int64Compare](#utilsint64compare), [Utils.assert](#utilsassert), [Utils.sha256](#utilssha256), [Utils.ecVerify](#utilsecverify), [Utils.toBaseUnit](#utilstobaseunit), [Utils.addressCheck](#utilsaddresscheck) and [Utils.toAddress](#utilstoaddress).

### Utils.log

- Description

  Output logs.

- Function call

  ```javascript
  Utils.log(info);
  ```

- Parameter description

  - info: The log content.

- Example

  ```javascript
  let ret = Utils.log('hello');
  /*
    Permission: Read-only
    Return value: If it succeeds, no value will be returned, and a snippet of Trace log will be output in the process of executing the contract, such as V8contract log[buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY:hello], or return false if it fails.
  */
  ```

### Utils.stoI64Check

- Description

  Legal check for string numerics.

- Function call

  ```javascript
  Utils.stoI64Check(strNumber);
  ```

- Parameter description

  - strNumber: String numeric parameter

- Example

  ```javascript
  let ret = Utils.stoI64Check('12345678912345');
  /*
    Permission: Read-only
    Return value: Return true if it succeeds, or return false if it fails.
  */
  ```

### Utils.int64Add

- Description

  64-bit addition.

- Function call

  ```javascript
  Utils.int64Add(left_value, right_value);
  ```

- Parameter description

  - left_value: Left value.
  - right_value: Right value.

- Example

  ```javascript
  let ret = Utils.int64Add('12345678912345', 1);
  /*
    Permission: Read-only
    Return value: Return a string if it succeeds, such as '12345678912346', or throw an exception if it fails.
  */
  ```

### Utils.int64Sub

- Description
  
  64-bit subtraction.

- Function call

  ```javascript
  Utils.int64Sub(left_value, right_value);
  ```

- Parameter description

  - left_value: Left value.
  - right_value：Right value.

- Example

  ```javascript
  let ret = Utils.int64Sub('12345678912345', 1);
  /*
    Permission: Read-only
    Return value: Return a string such as '12345678912344' if it succeeds, or throw an exception if it fails.
  */
  ```

### Utils.int64Mul

- Description

  64-bit multiplication.

- Function call

  ```javascript
  Utils.int64Mul(left_value, right_value);
  ```

- Parameter description

  - left_value: Left value.
  - right_value：Right value.

- Example

  ```javascript
  let ret = Utils.int64Mul('12345678912345', 2);
  /*
    Permission: Read-only
    Return value: Return a string such as '24691357824690' if it succeeds, or throw an exception if it fails.
  */
  ```

### Utils.int64Mod

- Description

  64-bit modulo.

- Function call

  ```javascript
  Utils.int64Mod(left_value, right_value);
  ```

- Parameter description

  - left_value: Left value.
  - right_value: Right value.

- Example

  ```javascript
  let ret = Utils.int64Mod('12345678912345', 2);
  /*
    Permission: Read-only
    Return value: Return a string such as '1' if it succeeds, or throw an exception if it fails.
  */
  ```

### Utils.int64Div

- Description

  64-bit division.

- Function call

  ```javascript
  Utils.int64Div(left_value, right_value);
  ```

- Parameter description

  - left_value: Left value.
  - right_value: Right value.

- Example

  ```javascript
  let ret = Utils.int64Div('12345678912345', 2);
  /*
    Permission: Read-only
    Return value: Return '6172839456172' if it succeeds, or throw an exception if it fails.
  */
  ```

### Utils.int64Compare

- Description

  64-bit comparison.

- Function call

  ```javascript
  Utils.int64Compare(left_value, right_value);
  ```

- Parameter description

  - left_value: Left value.
  - right_value: Right value.

- Example

  ```javascript
  let ret = Utils.int64Compare('12345678912345', 2);
  /*
    Permission: Read-only
    Return value: Return 1 if it succeeds (the left value is greater than the right value), or throw an exception if it fails.
  */
  ```

- Return value

   1: left value is greater than right value, 0: left value equals to right value, -1: left value less than right value.



### Utils.assert

- Description

  64 assertion.

- Function call

  ```javascript
  Utils.assert(condition[, message]);
  ```

- Parameter description

  - condition: Assertive variable
  - message: Optional, an exception message is thrown when it fails

- Example

  ```javascript
  Utils.assert(1===1, "Not valid");
  /*
    Permission: Read-only
    Return value: Return true if it succeeds, or throw an exception if it fails  
  */
  ```



### Utils.sha256

- Description

  sha256 computation.

- Function call

  ```javascript
  Utils.sha256(data[, dataType]);
  ```

- Parameter description

  - data: The raw data of the hash to be calculated. According to the dataType, fill in the data in different formats.
  - dataType: The data type, integer, optional field, by default is 0. 0: base16 encoded string, such as "61626364"; 1: ordinary original string, such as "abcd"; 2: base64 encoded string, such as "YWJjZA==". If you are calculating binary data, it is recommended to use base16 or base64 encoding.

- Return value

  Return a base16 encoded string if it succeeds, or return false if it fails.
- Example

  ```javascript
  let ret = Utils.sha256('61626364');
  /*
    Permission: Read-only
    Function: Right
    Return value: Return a 64-byte base16 string if it succeeds, such as '88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589', or return false it fails.
  */
  ```

### Utils.ecVerify

- Description

  Check if the signature is legal.

- Function call

  ```javascript
  Utils.ecVerify(signedData, publicKey,blobData [, blobDataType]);
  ```

- Parameter description

  - signedData: The signature data, a string encoded by base16.
  - publicKey: The public key, a string encoded by base16.
  - blobData: The raw data, fill in different formats of data per blobDataType.
  - blobDataType: The blobData type, integer, optional field, the default is 0. 0: base16 encoded string, such as "61626364"; 1: ordinary original string, such as "abcd"; 2: base64 encoded string, such as "YWJjZA==". If you are verifying binary data, it is recommended to use base16 or base64 encoding.

- Return value

  Return true if it succeeds, or return false if it fails.

- Example

  ```javascript
  let ret = Utils.ecVerify('3471aceac411975bb83a22d7a0f0499b4bfcb504e937d29bb11ea263b5f657badb40714850a1209a0940d1ccbcfc095c4b2d38a7160a824a6f9ba11f743ad80a', 'b0014e28b305b56ae3062b2cee32ea5b9f3eccd6d738262c656b56af14a3823b76c2a4adda3c', 'abcd', 1);
  /*
    Permission: Read-only
    Return value: Return true if it succeeds, or return false if it fails
  */
  ```



### Utils.toBaseUnit

- Description

 Transform the unit.

- Function call

  ```javascript
  Utils.toBaseUnit(value);
  ```

- Parameter description

  - value: The converted number, only string is allowed to pass in, and it can contain a decimal point, which allows up to 8 digits after the decimal point.


- Return value

  Return a string multiplied by 10^8 if it succeeds, or return false if it fails.

- Example

  ```javascript
  let ret = Utils.toBaseUnit('12345678912');
  /*
    Permission: Read-only
    Return value: Return a string '1234567891200000000' if it succeeds, or throw an exception if it fails.
  */
  ```

### Utils.addressCheck

- Description

  Address legality check.

- Function call

  ```javascript
  Utils.addressCheck(address);
  ```

- Parameter description

  - address The address parameter in string.

- Return value

  Return true if it succeeds, or return false if it fails.

- Example

  ```javascript
  let ret = Utils.addressCheck('buQgmhhxLwhdUvcWijzxumUHaNqZtJpWvNsf');
  /*
    Permission: Read-only
    Return value: Return true if it succeeds, or return false if it fails.
  */
  ```

### Utils.toAddress

- Description

  Transform a public key to an address.

- Function call

  ```javascript
  Utils.toAddress(public_key);
  ```

- Parameter description

  - public_key The public key, a base16 encoded string

- Return value

  Return the account address if it succeeds, or return false if it fails.

- Example

  ```javascript
  let ret = Utils.toAddress('b0016ebe6191f2eb73a4f62880b2874cae1191183f50e1b18b23fcf40b75b7cd5745d671d1c8');
  /*
    Permission: Read-only
    Return value: Return "buQi6f36idrKiGrno3RcdjUjGAibUC37FJK6" if it succeeds, or return false if it fails.
  */
  ```



## Exception Handling

- JavaScript exceptions

   When an uncaught JavaScript exception occurs during contract execution, the processing rules:

  1. The execution of this contract fails and all transactions made in the contract will not take effect.
  2. The transaction that triggered this contract is a failure. The error code is `151`.

- Failure in transaction execution

  <font color=red> Multiple transactions can be executed in a contract. If one transaction fails, an exception will be thrown, causing the entire transaction to fail</font>

