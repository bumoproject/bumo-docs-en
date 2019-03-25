---
id: version-1.0.0-introduction_to_smart_contract
title: Introduction to BUMO smart contract
sidebar_label: Introduction
original_id: introduction_to_smart_contract
---

## Definition

Smart Contract is a section of ECMAScript as specified in ECMA-262. The codes of smart contract should contain two parts of functions. The first is initialization function, init. The other one is entry function, main. When you call the main function you have to assign the input (type string). For syntax, please referring to [Contract Syntax](../syntax_in_smart_contract)

The following is a simple example: 

```JavaScript
"use strict";
function init(bar)
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



## Global Functions and Default Variables

> Do not duplicate the name of **Global Functions** or **Default Variables** as the custom fuctions. It will lead to uncontrollable error.



### Global Functions

The system offers several global variables for getting the information of blockchain and drive the transactions, except setting thresholds and weight.

#### Read/Write Rights of functions

1. Every functions have a stable **read-only** or **write** authority: 

- **Read-only** means the interface functions which would not write the data on the blockchain, such as [getBalance](#getbalance). 

- **Write** means the interface functions which would write data on the blockchain, such as transferring [payCoin](#paycoin). 


2. While coding the smart contract, please pay attention to the authority for calling different entry functions: 

- `init` and `main` functions can call all the global functions.
-  `query` can only call the **read-only** functions. Or the interface will be **undefined during debugging or execution**.

#### Return

For all the default functions, if they fail, then, return false or throw the exceptions directly. Otherwise, they will return other objects.If there is a parameter error, the error description will describe the parameter location, which refers to the index number of the parameter, i.e., counting from 0. e.g.

```JavaScript
issueAsset("CNY", 10000);
/*
   error description:
   Contract execute error,issueAsset parameter 1 should be a string

   Means that the second argument should be a string
*/
```



#### Details

This chapter mainly introduces some functions involved in the development process of smart contract, including [assert](#assert)、[getBalance](#getbalance)、[storageStore](#storagestore)、[storageLoad](#storageload)、[storageDel](#storagedel)、[getAccountAsset](#getaccountasset)、[getBlockHash](#getblockhash)、[addressCheck](#addresscheck)、[stoI64Check](#stoi64check)、[int64Add](#int64add)、[int64Sub](#int64sub)、[int64Mul](#int64mul)、[int64Div](#int64div)、[int64Mod](#int64mod)、[int64Compare](#int64compare)、[toBaseUnit](#tobaseunit)、[log](#log)、[tlog](#tlog)、[issueAsset](#issueasset)、[payAsset](#payasset)、[payCoin](#paycoin).

##### assert

- **Description**

  `assert` Function for assertion validation.

- **Call**

  ```JavaScript
  assert(condition[, message]);
  ```

- **Parameters**

  - condition: Condition variable.
  - message: Optional. Throwing an exception message when it fails.

- **Example**

```JavaScript
 assert(1===1, "Not valid");
/*
  Authority: Read-only
  return, Successfully->true; failed->exceptions  
*/
```



##### getBalance

- **Description**

  `getBalance` function for getting account information (except metadata and assets).

- **Call**

  ```javascript
  getBalance(address);
  ```

- **Parameters**

  - address: Address of the account.

- **Example**

  ```JavaScript
  let balance = getBalance('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY');
  /*
    Authority: Read-Only 
    return, numbers in stype string '999911110000'
  */
  ```

##### storageStore

- **Description**

  `storageStore` function for storing metadata of contract account.

- **Call**

  ```javascript
  storageStore(metadata_key, metadata_value);
  ```

- **Parameters**

  - metadata_key: Key of metadata.
  - metadata_value: Value of metadata.

- **Example**

  ```JavaScript
  storageStore('abc', 'values');
  /*
    Authority: Read-Only 
    return, Successfully->true; failed->exceptions
  */
  ```

##### storageLoad

- **Description**

  `storageLoad` function for getting metadata of contract account.

- **Call**

  ```JavaScript
  storageLoad(metadata_key);
  ```

- **Parameters**

  - metadata_key: Key of metadata.

- **Example**

```JavaScript
let value = storageLoad('abc');
/*
  Authority: Read-Only
  return, Successfully->value in type string; failed->exceptions
*/
```

##### storageDel

- **Description**

  `storageDel` function for Deleting metadata of contract account

- **Call**

  ```JavaScript
  storageDel(metadata_key);
  ```

- **Parameters**

  - metadata_key: Key of metadata.

- **Example**

  ```JavaScript
  storageDel('abc');
  /*
    Authority: Read-Only
    return, Successfully->true; failed->exceptions
  */
  ```

##### getAccountAsset

- **Description**

  `getAccountAsset` function for obtaining assets information of an account.

- **Call**

  ```JavaScript
  getAccountAsset(account_address, asset_key);
  ```

- **Parameters**

  - account_address: Address of the account.
  - asset_key: Property of the assets.

- **Example**

  ```JavaScript
  let asset_key =
  {
  'issuer' : 'buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY',
  'code' : 'CNY'
  };
  let bar = getAccountAsset('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY',
  asset_key);
  /*
    Authority: Read-Only
    return, Successfully->assets amount, such as '10000'; failed->exceptions
  */
  ```

##### getAccountMetadata

- **Description**

  `getAccountMetadata` function for getting the metadata for the specified account.

- **Call**

  ```JavaScript
  getAccountMetadata(account_address, metadata_key);
  ```

- **Parameters**

  - account_address: Address of the account.
  - asset_key: Key of metadata.

- **Example**

  ```JavaScript
  let value = getAccountMetadata('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY', 'abc');

  /*
    Authority: Read-Only
    return: Successfully to a string, such as 'values', failed to false
  */
  ```

##### getBlockHash

- **Description**

  `getBlockHash` function for getting block information.

- **Call**

  ```JavaScript
  getBlockHash(offset_seq);
  ```

- **Parameters**

  - offset_seq: Offset from the latest block,range [0,1024).

- **Example**

  ```JavaScript
  et ledger = getBlockHash(4);
  /*
    Authority: Read-Only
    return, Successfully->value in type string, such as 'c2f6892eb934d56076a49f8b01aeb3f635df3d51aaed04ca521da3494451afb3'; failed->false
  */
  ```

##### addressCheck

- **Description**

  `addressCheck` function for checking the validity of the address.

- **Call**

  ```JavaScript
  addressCheck(address);
  ```

- **Parameters**

  - address: Address name in type string.

- **Example**

  ```JavaScript
  let ret = addressCheck('buQgmhhxLwhdUvcWijzxumUHaNqZtJpWvNsf');
  /*
    Authority: Read-Only
    return, Successfully->true; failed->false
  */
  ```

##### toAddress

- **Description**

  `toAddress` function for changing public key to address.

- **Call**

  ```JavaScript
  toAddress(public_key);
  ```

- **Parameters**

  - public_key: Public key，base16 encoded string.

- **Example**

  ```JavaScript
  let ret = toAddress('b0016ebe6191f2eb73a4f62880b2874cae1191183f50e1b18b23fcf40b75b7cd5745d671d1c8');
  /*
    Authority: Read-Only
    return: Successfully-> "buQi6f36idrKiGrno3RcdjUjGAibUC37FJK6"，failed to false
  */
  ```

- **Return**

  - If success，returning account address.
  - If failed, returning false.

##### stoI64Check

- **Description**

  `stoI64Check` for checking the validity of string number.

- **Call**

  ```JavaScript
  stoI64Check(strNumber);
  ```

- **Parameters**

  - strNumber: String number in type string.

- **Example**

  ```JavaScript
  let ret = stoI64Check('12345678912345');
  /*
    Authority: Read-Only
    return, Successfully->true; failed->false
  */
  ```

##### int64Add

- **Description**

  `int64Add` function for addition in 64 bits.

- **Call**

  ```JavaScript
  int64Add(left_value, right_value);
  ```

- **Parameters**

  - left_value: Left value.
  - right_value: Right value.

- **Example**

  ```JavaScript
  let ret = int64Add('12345678912345', 1);
  /*
    Authority: Read-Only
    return, Successfully->value in type string, such as'12345678912346'; failed->exceptions
  */
  ```

##### int64Sub

- **Description**

  `int64Sub` function for subtraction in 64 bits.

- **Call**

  ```JavaScript
  int64Sub(left_value, right_value);
  ```

- **Parameters**

  - left_value: Left value.
  - right_value: Right value.

- **Example**

  ```JavaScript
  let ret = int64Sub('12345678912345', 1);
  /*
    Authority: Read-Only
    return, Successfully->value in type string, such as'12345678912346'; failed->exceptions
  */
  ```

##### int64Mul

- **Description**

  `int64Mul` function for multiplication in 64 bite.

- **Call**

  ```JavaScript
  int64Mul(left_value, right_value);
  ```

- **Parameters**

  - left_value: Left value.
  - right_value: Right value.

- **Example**

  ```JavaScript
  let ret = int64Mul('12345678912345', 2);
  /*
    Authority: Read-Only
    return, Successfully->value in type string as '24691357824690'; failed->exceptions
  */
  ```

##### int64Div

- **Description**

  `int64Div` function for division in 64 bits.

- **Call**

  ```JavaScript
  int64Div(left_value, right_value);
  ```

- **Parameters**

  - left_value: Left value.
  - right_value: Right value.

- **Example**

  ```JavaScript
  let ret = int64Div('12345678912345', 2);
  /*
    Authority: Read-Only
    return, Successfully->value in type string as'6172839456172'; failed->exceptions
  */
  ```

##### int64Mod

- **Description**

  `int64Mod` function modulus in 64 bits.

- **Call**

  ```JavaScript
  int64Mod(left_value, right_value);
  ```

- **Parameters**

  - left_value: Left value.
  - right_value: Right value.

- **Example**

  ```JavaScript
  let ret = int64Mod('12345678912345', 2);
  /*
    Authority: Read-Only
    return, Successfully->value in type string, such as'1'; failed->exceptions
  */
  ```

##### int64Compare

- **Description**

  `int64Compare` function for comparison in 64bits.

- **Call**

  ```JavaScript
  int64Compare(left_value, right_value);
  ```

- **Parameters**

  - left_value: Left value.
  - right_value: Right value.

- **Example**

  ```JavaScript
  let ret = int64Compare('12345678912345', 2);
  /*
    Authority: Read-Only
    return, Successfully-> 1(left is larger than right), 0 (equal), -1 (smaller); failed->exceptions
  */
  ```

##### toBaseUnit

- **Description**

  `toBaseUnit` function for switching units.

- **Call**

  ```JavaScript
  toBaseUnit(value);
  ```

- **Parameters**

  - value: Only accept string number( including the number with point down to the eighth decimal point).

- **Example**

  ```JavaScript
  let ret = toBaseUnit('12345678912');
  /*
    Authority: Read-Only
    return, Successfully->value in type string as'1234567891200000000'; failed->exceptions
  */
  ```

- **Return**

  Successfully->value multiply 10^start^ in type string; failed->false.

##### sha256

- **Description**

  `sha256` function for sha256 calculate.

- **Call**

  ```JavaScript
  sha256(data[, dataType]);
  ```

- **Parameters**

  - data: The raw data for the hash to be computed, fill in the data in different formats, depending on the dataType.
  - dataType：Data type, integer, optional field, default is 0. 0: base16 encoded string, such as "61626364"; 1: ordinary original string, such as "abcd";2: base64 encoded string, such as "YWJjZA==".Base16 or base64 encoding is recommended for binary data hash calculations.

- **Example**

  ```JavaScript
  let ret = sha256('61626364');
  /*
    Authority: Read-Only
    function：sha256
    return：Returns a base16 format string of 64 bytes successfully '88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589'，Failure to return false
  */
  ```

- **Return**

  Success returns the base16-encoded string after the hash, and failure returns false.

##### ecVerify

- **Description**

  `ecVerify` function for verifying that the signature is valid.

- **Call**

  ```JavaScript
  ecVerify(signedData, publicKey,blobData [, blobDataType]);
  ```

- **Parameters**

  - signedData: Signature data, base16-encoded string.
  - publicKey：Public key, base16-encoded string.
  - blobData：The raw data, depending on the blobDataType, is filled in in different formats.
  - blobDataType：BlobData's data type, integer, optional field, default is 0.0: base16 encoded string, such as "61626364";1: normal raw string, such as "abcd"; 2: base64 encoded string, such as "YWJjZA==".If you validate binary data, base16 or base64 encoding is recommended.

- **Example**

  ```JavaScript
  let ret = sha256('61626364');
  /*
    Authority: Read-Only
    function：sha256
    return：Returns a base16 format string of 64 bytes successfully '88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589'，Failure to return false
  */
  ```

- **Return**

  Successfully->true,Failure to return false.

##### delegateCall

- **Description**

  `delegateCall` function for verifying that the signature is valid.

  `delegateCall` function triggers the entry to the called contract main function,and assign the execution environment of the current contract to the invoked contract.

- **Call**

  ```JavaScript
  delegateCall(contractAddress, input);
  ```

- **Parameters**

  - contractAddress: The address of the contract invoked.
  - input：Call parameters.

- **Example**

  ```JavaScript
  let ret = delegateCall('buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY'，'{}');
  /*
    Authority: Read-Only
    return：Success returns true, failure to throw exception
  */
  ```

##### log

- **Description**

  `log` function for log.

- **Call**

  ```JavaScript
  log(info);
  ```

- **Parameters**

  - info: Log contents.

- **Example**

  ```JavaScript
  let ret = log('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY');
  /*
  Authority: Read-Only
  return, Successfully->null; failed->exceptions
  */
  ```

##### tlog

- **Description**
  `tlog` function for recording a transaction on the block.

- **Call**

  ```JavaScript
  tlog(topic,args...);
  ```

- **Parameters**

  - topic: Log topic, type string, length(0,128].
  - args...: At most 5 parameters; type can be string, value, or boolean; length(0,1024].

- **Example**

  ```JavaScript
  tlog('transfer',sender +' transfer 1000',true);
  /*
    Authority: Read-Only
    return, Successfully->true; failed->exceptions
  */
  ```

##### issueAsset

- **Description**
  `issueAsset` function for issuing assets.

- **Call**

  ```JavaScript
  issueAsset(code, amount);
  ```

- **Parameters**

  - code: Codes of assets.
  - amount: Amount of assets.

- **Example**

  ```JavaScript
  issueAsset("CNY", "10000");
  /*
    Authority: Read-Only
    return, Successfully->true; failed->exceptions 
  */
  ```

##### payAsset

- **Description**

  `payAsset` function for transferring assets.

- **Call**

  ```JavaScript
  payAsset(address, issuer, code, amount[, input]);
  ```

- **Parameters**

  - address: Address of the receiver account.
  - issuer: Assets issuer.
  - code: Codes of assets.
  - amount: Asset amount to be transferred.
  - input: Optional; defaults to null.

- **Example**

  ```JavaScript
  payAsset("buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY",
  "buQgmhhxLwhdUvcWijzxumUHaNqZtJpWvNsf", "CNY", "10000", "{}");
  /*
    Authority: Read-only
    return, Successfully->true; failed->exceptions   
  */
  ```

##### payCoin

- **Description**

  `payCoin` function for Transferring BU coin.

- **Call**

  ```JavaScript
  payCoin(address, amount[, input]);
  ```

- **Parameters**

  - address: Address of BU receiver account.
  - amount: BU amount.
  - input: Optional; defaults to null.

- **Example**

  ```JavaScript
  payCoin("buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY", "10000", "{}");
  /*
    Authority: Writable
    return, Successfully->true; failed->exceptions  
  */
  ```

### Default Variables

This section describes some default variables involved in the development process of smart contract, including [thisAddress](#thisaddress)、 [thisPayCoinAmount](#thispaycoinamount)、 [thisPayAsset](#thispayasset)、 [blockNumber](#blocknumber)、 [blockTimestamp](#blocktimestamp)、 [sender](#sender)、 [triggerIndex](#triggerindex).

#### thisAddress

- **Description**

  Global variable thisAdress is the address of this contract account. 

- **Example**

  If account X submits a transaction to call contract Y, thisAddressis Y's address:

  ```JavaScript
  let bar = thisAddress;
    /*
    bar is Y's address.
  */
  ```

#### thisPayCoinAmount

- **Description**

  BU coin for current operation

#### thisPayAsset

- **Description**

  Asset object for this operation, such as follow:

  ```JavaScript
  {"amount": 1000, "key" : {"issuer": "buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY", "code":"CNY"}}。
  ```

#### blockNumber

- **Description**

  Current block height。

#### blockTimestamp

- **Description**

  Current block timestamp。

#### sender

- **Description**

  Address of the caller (call the function/variables).

- **Example**

  There is an operation (from address X) to call contract Y in a transaction. In this process, address X is the sender.

  ```JavaScript
  let bar = sender;
    /*
    bar is the account address of X.
  */
  ```

#### triggerIndex

- **Description**
  Operation sequence for triggering the contract.

- **Example**

  An account A submits a transaction tx0, and the 0-th (count from 0) operation is transferring assets to a contract account (calling the contract). Then triggerIndexis 0.

  ```JavaScript
  let bar = triggerIndex;
    /*
    bar is an int
  */
  ```



## Exceptions

- avaScript exceptions

  While there is an uncaught JavaScript exception in contract operation: 

  1. Failed execution, all transactions in this contract operation are failed.

  1. The transaction triggrted (TRIGGERED) the contract is failed with error code151.

- Failure in executing transactions

  <font color=red>Contracts can execute several transactions, but only one fault would lead to failure of all transactions and throw exceptions.</font>

