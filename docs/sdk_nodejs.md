---
id: sdk_nodejs
title: BUMO Nodejs SDK
sidebar_label: Nodejs
---

## Overview
This document details the common interfaces of the BUMO Nodejs SDK, making it easier for developers to operate and query the BuChain.

## Installation

Node.js 6.0.0 or higher is required.

Installation is done using the command as follows: 

```shell

npm install bumo-sdk --save
```

## Format of Request Parameters and Response Data

This section details the format of the request parameters and response data.

### Request Parameters

To ensure the precision of numbers, the numbers in the request parameters are treated as strings. For example, amount=500 will be changed to amount='500' when processed.

### Response Data**

The response data of the interfaces are JavaScript object, and the following is the structure of the response data.

```js
{
       errorCode: 0,
       errorDesc: '',
       result: {}
}
```

**Note**: 
- errorCode: `Error code`. 0 means no error, and the number greater than 0 means there is an error.
- errorDesc: `Error description`. Null means no error, otherwise there is an error.
- result: The result. Since the structure of the response data is fixed, the response data mentioned in the subsequent description refers to the parameters of the result.

## Usage

This section describes the process of using the SDK. First you need to generate the SDK implementation and then call the interface of the corresponding service. Services include [Account Service](#account-service), [Asset Service](#asset-service), [Contract Service](#contract-service), [Transaction Service](#transaction-service), and [Block Service](#block-service). Interfaces are classified into [Querying](#querying), and [Groadcasting Transaction](#broadcasting-transactions).

### Generating SDK Instance

When generating SDK instances, the input parameter is an options object, and the options object includes the following parameter:

| Parameter | Type   | Description        |
| ---- | ------ | ----------- |
| host | String | Ip:port |

The example is as follows:

```js
const BumoSDK = require('bumo-sdk');

const options = {
 host: 'seed1.bumotest.io:26002',
};

const sdk = new BumoSDK(options);
```

### Querying
The `query` interface is used to query data on the BuChain, and data query can be implemented by directly invoking the corresponding interface. For example, to query the account information, the specific call is as follows:
```js
const address = 'buQemmMwmRQY1JkcU7w3nhruo%X5N3j6C29uo';

sdk.account.getInfo(address).then(info=> {
 console.log(info);
}).catch(err => {
 console.log(err.message);
});
```

### Broadcasting Transactions
Broadcasting transactions refers to the initiation of a transaction by means of broadcasting. The broadcast transaction consists of the following steps:

1. [Obtaining the Nonce Value of the account](#obtaining-the-nonce-value-of-the-account)
2. [Building Operations](#building-operations)
3. [Serializing Transactions](#serializing-transactions)
4. [Signing Transactions](#signing-transactions)
5. [Submitting Transactions](#submitting-transactions)

#### Obtaining the Nonce Value of the Account

The developer can maintain the `nonce` value of each account, and automatically increments by 1 for the `nounce` value after submitting a transaction, so that multiple transactions can be sent in a short time; otherwise, the `nonce` value of the account must be added 1 after the execution of the previous transaction is completed. For interface details, see [getNonce](#getnonce), which calls as follows:
```js
const address = 'buQemmMwmRQY1JkcU7w3nhruo%X5N3j6C29uo';

sdk.account.getNonce(address).then(info => {

 if (info.errorCode !== 0) {
   console.log(info);
   return;
 }

 const nonce = new BigNumber(info.result.nonce).plus(1).toString(10);
});

// In this example, big-number.js is used to add the value of nonce to 1 and return the string type.
```

#### Building Operations

The operation refers to some of the actions that are done in the transaction to facilitate serialization of transactions and evaluation of fees. For more details, see [Operations](#operations). For example, to build an operation to send BU (`BUSendOperation`), the specific interface call is as follows:
```js
const destAddress = 'buQWESXjdgXSFFajEZfkwi5H4fuAyTGgzkje';

const info = sdk.operation.buSendOperation({
       destAddress,
       amount: '60000',
       metadata: '746573742073656e64206275',
});
```

#### Serializing Transactions

The `transaction serialization` interface is used to serialize transactions and generate transaction blob strings for network transmission. The nonce value and operation are obtained from the interface called. For interface details, see [buildBlob](#buildblob), which calls as follows:
```js
let blobInfo = sdk.transaction.buildBlob({
  sourceAddress: 'buQnc3AGCo6ycWJCce516MDbPHKjK7ywwkuo',
  gasPrice: '3000',
  feeLimit: '1000',
  nonce: '102',
  operations: [ sendBuOperation ],
  metadata: '74657374206275696c6420626c6f62',
});

const blob = blobInfo.result;
```

#### Signing Transactions

The `signature transaction` interface is used by the transaction initiator to sign the transaction using the private key of the account. The transactionBlob is obtained from the interface called. For interface details, see [sign](#sign), which calls as follows:
```js
 const signatureInfo = sdk.transaction.sign({
  privateKeys: [ privateKey ],
  blob,
});

const signature = signatureInfo.result;
```

#### Submitting Transactions

The `submit interface` is used to send a transaction request to the BU blockchain, triggering the execution of the transaction. transactionBlob and signResult are obtained from the interfaces called. For interface details, see [submit](#submit), which calls as follows:
```js
sdk.transaction.submit({
  blob,
  signature: signature,
}).then(data => {
      console.log(data);
});
```

## Transaction Service

Transaction Service provide transaction-related interfaces and currently have five interfaces: `buildBlob`, `evaluateFee`, `sign`, `submit`, and `getInfo`.

### buildBlob

> **Note:** Before you call **buildBlob**, you shold make some operations, details for [Operations](#operations).

- **Interface description**

   The `buildBlob` interface is used to serialize transactions and generate transaction blob strings for network transmission.

- **Method call**

`sdk.transaction.buildBlob(args);`

- **Request parameters**

   Args is of Object type, which contains the following parameters:

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   sourceAddress|String|Required, the source account address initiating the operation
   nonce|String|Required, the transaction serial number to be initiated, add 1 in the function, size limit [1, max(int64)], and it cannot start with 0.
   gasPrice|String|Required, transaction gas price, unit MO, 1 BU = 10^8 MO, size limit [1000, max(int64)], and it cannot start with 0.
   feeLimit|String|Required, the minimum fees required for the transaction, unit MO, 1 BU = 10^8 MO, size limit [1, max(int64)], and it cannot start with 0.
   operation|BaseOperation[]|Required, list of operations to be committed which cannot be empty
   ceilLedgerSeq|String|Optional, set a value which will be combined with the current block height to restrict transactions. If transactions do not complete within the set value plus the current block height, the transactions fail. The value you set must be greater than 0. If the value is set to 0, no limit is set., and it cannot start with 0.
   metadata|String|Optional, note

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   transactionBlob|String|Serialized transaction hex string
   hash|String|Transaction hash

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_SOURCEADDRESS_ERROR|11002|Invalid sourceAddress
   INVALID_NONCE_ERROR|11048|Nonce must be between 1 and max(int64)
   INVALID_NONCE_ERROR|11048|Nonce must be between 1 and max(int64)
   INVALID_ GASPRICE_ERROR|11049|GasPrice must be between 1000 and max(int64)
   INVALID_FEELIMIT_ERROR|11050|FeeLimit must be between 1 and max(int64)
   OPERATIONS_EMPTY_ERROR|11051|Operations cannot be empty
   INVALID_CEILLEDGERSEQ_ERROR|11052|CeilLedgerSeq must be equal to or greater than 0
   OPERATIONS_ONE_ERROR|11053|One of the operations cannot be resolved
   SYSTEM_ERROR|20000|System error

- **Example**

```js
const args = {
 sourceAddress,
 gasPrice,
 feeLimit,
 nonce,
 operations: [ sendBuOperation ],
 metadata: '6f68206d79207478',
};
const blobInfo = sdk.transaction.buildBlob(args);
```

### evaluateFee

- **Interface description**

   The `evaluateFee` interface implements the cost estimate for the transaction.

- **Method call**

`sdk.transaction.evaluateFee(args)`

- **Request parameters**

   Args is of Object type, which contains the following parameters:

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   sourceAddress|String|Required, the source account address initiating the operation
   nonce|String|Required, transaction serial number to be initiated, size limit [1, max(int64)]
   operation|Array|Required, list of operations to be committed which cannot be empty
   signtureNumber|Integer|Optional, the number of people to sign, the default is 1, size limit [1, max(int32)]
   ceilLedgerSeq|String|Optional, set a value which will be combined with the current block height to restrict transactions. If transactions do not complete within the set value plus the current block height, the transactions fail. The value you set must be greater than 0. If the value is set to 0, no limit is set.
   metadata|String|Optional, note

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
    feeLimit | String | Transaction fees 
   gasPrice | String | Transaction gas price 

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_SOURCEADDRESS_ERROR|11002|Invalid sourceAddress
    INVALID_ARGUMENTS           | 15016      | Arguments of the function are invalid 
   SYSTEM_ERROR|20000|System error

- **Example**

```js
const args = {
       sourceAddress: 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf',
       nonce: '101',
       operations: [sendBuOperation],
       signtureNumber: '1',
       metadata: '54657374206576616c756174696f6e20666565',
};

sdk.transaction.evaluateFee(args).then(data => {
 console.log(data);
});

```

### sign

- **Interface description**

   The `sign` interface is used to implement the signature of the transaction.

- **Method call**

```js
sdk.transaction.sign(args);
```

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   blob|String|Required, pending transaction blob to be signed
   privateKeys|Array|Required, private key list


- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   signatures|Array<[Signature](#signature)>|Signed data list

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_BLOB_ERROR|11056|Invalid blob
   PRIVATEKEY_NULL_ERROR|11057|PrivateKeys cannot be empty
   PRIVATEKEY_ONE_ERROR|11058|One of privateKeys is invalid
   SYSTEM_ERROR|20000|System error

- **Example**

```js
const signatureInfo = sdk.transaction.sign({
       privateKeys: [ 'privbyQCRp7DLqKtRFCqKQJr81TurTqG6UKXMMtGAmPG3abcM9XHjWvq' ],
       blob: '0A246275516E6E5545425245773268423670574847507A77616E5837643238786B364B566370102118C0843D20E8073A56080712246275516E6E5545425245773268423670574847507A77616E5837643238786B364B566370522C0A24627551426A4A443142534A376E7A41627A6454656E416870466A6D7852564545746D78481080A9E08704'
});

console.log(signatureInfo);
```

### submit

- **Interface description**

   The `submit` interface is used to implement the submission of the transaction.

- **Method call**

`sdk.transaction.submit(args);`

- **Request parameters**

   Args is of Object type, which contains the following parameters:

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
    blob|String|Required, transaction blob
    signature|Array<[Signature](#signature)>|Required, signature list

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   hash|String|Transaction hash

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_BLOB_ERROR|11056|Invalid blob
    INVALID_SIGNATURE_ERROR | 15027      | Invalid signature 
   SYSTEM_ERROR|20000|System error

- **Example**

```js
const args = {
  blob: '0A246275516E6E5545425245773268423670574847507A77616E5837643238786B364B566370102118C0843D20E8073A56080712246275516E6E5545425245773268423670574847507A77616E5837643238786B364B566370522C0A24627551426A4A443142534A376E7A41627A6454656E416870466A6D7852564545746D78481080A9E08704',
  signature: {
     signData: 'D2B5E3045F2C1B7D363D4F58C1858C30ABBBB0F41E4B2E18AF680553CA9C3689078E215C097086E47A4393BCA715C7A5D2C180D8750F35C6798944F79CC5000A',
     publicKey: 'b0011765082a9352e04678ef38d38046dc01306edef676547456c0c23e270aaed7ffe9e31477'
  },

let transactionInfo = yield sdk.transaction.submit(args);
```

### getInfo

- **Interface description**

   The `getInfo` interface is used to implement query transactions based on transaction hashes.

- **Method call**

`sdk.transaction.getInfo(hash);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   hash|String|Transaction hash

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   totalCount|String|Total number of transactions returned
   transactions|Array<[TransactionHistory](#transactionhistory)>|Transaction content

- **Error code**

Error Message      |     Error Code     |        Description   
-----------  | ----------- | -------- 
INVALID_HASH_ERROR|11055|Invalid transaction hash
REQUEST_NULL_ERROR|12001|Request parameter cannot be null
CONNECTNETWORK_ERROR|11007|Failed to connect to the network
SYSTEM_ERROR|20000|System error
INVALID_REQUEST_ERROR|17004|Request is invalid

- **Example**

```js
const hash = '1653f54fbba1134f7e35acee49592a7c29384da10f2f629c9a214f6e54747705';
sdk.transaction.getInfo(hash).then(data => {
 console.log(data);
})
```

## Operations

Operations refer to the things that are to be done in a transaction, and the operations that need to be built before the operations are to be built. At present, there are 10 kinds of operations, which include [Activating Account](#activating-account)、[Setting Account Metadata](#setting-account-metadata)、 [Setting Account Priviledge](#setting-account-priviledge)、 [Sendding BU](#sending-bu)、 [Issuing Asset](#issuing-asset)、 [Paying Asset](#paying-asset)、 [Creating Contract](#creating-contract)、 [Invoking Contract by Paying Assets](#invoking-contract-by-paying-assets)、 [Invoking Contract By Sending BU](#invoking-contract-by-sending-bu)、 [Recording Log](#recording-log).

### Activating Account

- **Fee**

   FeeLimit is currently fixed at 0.01 BU (2018.07.26).

- **Method call**

`sdk.operation.accountActivateOperation(args);`

- **Request parameters**

  Args is of Object type, which contains the following parameters:

  | Parameter      |     Type     |        Description                                                         |
  | ------------- | ------ | ------------------------------------------------------------ |
  | sourceAddress | String | Optional, the account address to trigger the contract                                       |
  | destAddress   | String | Required, target account address                      |
  | initBalance   | String | Required, initialize the asset, includes only numbers and cannot start with 0, size [1, max(int64)], unit MO |
  | metadata      | String | Optional, note                                                   |

- **Response data**

  | Parameter      |     Type     |        Description               |
  | --------- | ----------------------- | ------------------ |
  | operation | [Operation](#operation) | Object of AccountActivateOperation |

- **Error code**

  | Error Message      |     Error Code     |        Description                                         |
  | ------------------------------------- | ---------- | -------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR           | 11002      | Invalid sourceAddress                        |
  | INVALID_DESTADDRESS_ERROR             | 11003      | Invalid destAddress                          |
  | INVALID_INITBALANCE_ERROR             | 11004      | InitBalance must be between 1 and max(int64) |
  | SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR | 11005      | SourceAddress cannot be equal to destAddress |
  | INVALID_METADATA_ERROR                | 15028      | Invalid metadata                             |
  | SYSTEM_ERROR                          | 20000      | System error                                 |

### Setting Account Metadata

- **Fee**

  FeeLimit is currently fixed at 0.01 BU (2018.07.26).

- **Method call**

`sdk.operation.accountSetMetadataOperation(args);`

- **Request parameters**

  Args is of Object type, which contains the following parameters:

  | Parameter      |     Type     |        Description                                  |
  | ---------- | ------- | ------------------------------------- |
  | key        | String  | Required, metadata keyword, length limit [1, 1024] |
  | value      | String  | Optional, metadata content, length limit [0, 256K]   |
  | version    | String  | Optional, metadata version                  |
  | deleteFlag | Boolean | Optional, whether to delete metadata                |
  | metadata   | String  | Optional, note                            |

- **Response data**

  | Parameter      |     Type     |        Description                       |
  | --------- | ----------------------- | -------------------------- |
  | operation | [Operation](#operation) | Object of AccountSetMetadataOperation |

- **Error code**

  | Error Message      |     Error Code     |        Description                                             |
  | --------------------------- | ---------- | ------------------------------------------------ |
  | INVALID_SOURCEADDRESS_ERROR | 11002      | Invalid sourceAddress                            |
  | INVALID_DATAKEY_ERROR       | 11011      | The length of key must be between 1 and 1024     |
  | INVALID_DATAVALUE_ERROR     | 11012      | The length of value must be between 0 and 256000 |
  | INVALID_DATAVERSION_ERROR   | 11013      | The version must be equal to or greater than 0   |
  | SYSTEM_ERROR                | 20000      | System error                                     |

### Setting Account Priviledge

- **Fee**

  FeeLimit is currently fixed at 0.01 BU (2018.07.26).

- **Method call**

`sdk.operation.accountSetPrivilegeOperation(args);`

- **Request parameters**

  Args is of Object type, which contains the following parameters:

  | Parameter      |     Type     |        Description                                         |
  | ------------- | -------------------------------------- | -------------------------------------------- |
  | sourceAddress | String                                 | Optional, source account address of the operation                         |
  | masterWeight  | String                                 | Optional, account weight, size limit [0, max(uint32)] |
  | signers       | [Array<Signer](#signer)>               | Optional, signer weight list                         |
  | txThreshold   | String                                 | Optional, transaction threshold, size limit [0, max(int64)]      |
  | typeThreshold | Array<[TypeThreshold](#typethreshold)> | Optional, specify transaction threshold                       |
  | metadata      | String                                 | Optional, note                                   |

- **Response data**

  | Parameter      |     Type     |        Description                   |
  | --------- | ----------------------- | ---------------------- |
  | operation | [Operation](#operation) | Object of AccountSetPrivilegeOperation |

- **Error code**

  | Error Message      |     Error Code     |        Description                                            |
  | ---------------------------- | ---------- | ----------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR  | 11002      | Invalid sourceAddress                           |
  | INVALID_MASTERWEIGHT_ERROR   | 11015      | MasterWeight must be between 0 and max(uint32)  |
  | INVALID_SIGNER_ADDRESS_ERROR | 11016      | Invalid signer address                          |
  | INVALID_SIGNER_WEIGHT_ERROR  | 11017      | Signer weight must be between 0 and max(uint32) |
  | INVALID_TX_THRESHOLD_ERROR   | 11018      | TxThreshold must be between 0 and max(int64)    |
  | INVALID_OPERATION_TYPE_ERROR | 11019      | The type of typeThreshold is invalid            |
  | INVALID_TYPE_THRESHOLD_ERROR | 11020      | TypeThreshold must be between 0 and max(int64)  |
  | SYSTEM_ERROR                 | 20000      | System error                                    |

### Sending BU

> **Note**: If the destination account is not activated, this operation will activate this account.

- **Fee**

  FeeLimit is currently fixed at 0.01 BU (2018.07.26).

- **Method call**

`sdk.operation.buSendOperation(args);`

- **Request parameters**

  Args is of Object type, which contains the following parameters:

  | Parameter      |     Type     |        Description                                                         |
  | ------------- | ------ | ------------------------------------------------------------ |
  | sourceAddress | String | Optional, source account address of the operation                                         |
  | destAddress   | String | Required, target account address                      |
  | buAmount      | String | Required, amount of asset issued, size limit [0,max(int64)] string of only numbers, cannot starts with 0 |
  | metadata      | String | Optional, note                                                   |

- **Response data**

  | Parameter      |     Type     |        Description             |
  | --------- | ----------------------- | ---------------- |
  | operation | [Operation](#operation) | Object of BUSendOperation |

- **Error code**

  | Error Message      |     Error Code     |        Description                                         |
  | ------------------------------------- | ---------- | -------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR           | 11002      | Invalid sourceAddress                        |
  | INVALID_DESTADDRESS_ERROR             | 11003      | Invalid destAddress                          |
  | SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR | 11005      | SourceAddress cannot be equal to destAddress |
  | INVALID_BU_AMOUNT_ERROR               | 11026      | BuAmount must be between 1 and max(int64)    |
  | INVALID_ISSUER_ADDRESS_ERROR          | 11027      | Invalid issuer address                       |
  | SYSTEM_ERROR                          | 20000      | System error                                 |

### Issuing Asset

- **Fee**

  FeeLimit is currently fixed at 50.01 BU (2018.07.26).

- **Method call**

`sdk.operation.assetIssueOperation(args);`

- **Request parameters**

  Args is of Object type, which contains the following parameters:

  | Parameter      |     Type     |        Description                                        |
  | ------------- | ------ | ------------------------------------------- |
  | sourceAddress | String | Optional, source account address of the operation                        |
  | code          | String | Required, asset code, length limit [1, 64]             |
  | assetAmount   | String | Required, asset amount, size limit [0, max(int64)], string of only numbers and cannot starts with 0 |
  | metadata      | String | Optional, note                                  |

- **Response data**

  | Parameter      |     Type     |        Description               |
  | --------- | ----------------------- | ------------------ |
  | operation | [Operation](#operation) | Object of TokenIssueOperation |

- **Error code**

  | Error Message      |     Error Code     |        Description                                         |
  | --------------------------- | ---------- | -------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR | 11002      | Invalid sourceAddress                        |
  | INVALID_ASSET_CODE_ERROR    | 11023      | The length of key must be between 1 and 64   |
  | INVALID_ASSET_AMOUNT_ERROR  | 11024      | AssetAmount must be between 1 and max(int64) |
  | SYSTEM_ERROR                | 20000      | System error                                 |

### Paying Asset

> **Note**: If the destination account is not activated, the activation account operation must be invoked first.

- **Fee**

  FeeLimit is currently fixed at 0.01 BU (2018.07.26).

- **Method call**

`sdk.operation.assetSendOperation(args);`

- **Request parameters**

  Args is of Object type, which contains the following parameters:

  | Parameter      |     Type     |        Description                                          |
  | ------------- | ------ | --------------------------------------------- |
  | sourceAddress | String | Optional, source account address of the operation                          |
  | destAddress   | String | Required, target account address       |
  | code          | String | Required, asset code, length limit [1, 64]               |
  | issuer        | String | Required, the account address for issuing assets                        |
  | assetAmount   | String | Required, asset amount, size limit [0, max(int64)], string of only numbers and cannot starts with 0 |
  | metadata      | String | Optional, note                                    |

- **Response data**

  | Parameter      |     Type     |        Description               |
  | --------- | ----------------------- | ------------------ |
  | operation | [Operation](#operation) | Object of TokenTransferOperation |

- **Error code**

  | Error Message      |     Error Code     |        Description                                         |
  | ------------------------------------- | ---------- | -------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR           | 11002      | Invalid sourceAddress                        |
  | INVALID_DESTADDRESS_ERROR             | 11003      | Invalid destAddress                          |
  | SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR | 11005      | SourceAddress cannot be equal to destAddress |
  | INVALID_ASSET_CODE_ERROR              | 11023      | The length of key must be between 1 and 64   |
  | INVALID_ASSET_AMOUNT_ERROR            | 11024      | AssetAmount must be between 1 and max(int64) |
  | INVALID_ISSUER_ADDRESS_ERROR          | 11027      | Invalid issuer address                       |
  | SYSTEM_ERROR                          | 20000      | System error                                 |

### Creating Contract

- **Fee**

  FeeLimit is currently fixed at 10.01 BU (2018.07.26).

- **Method call**

`sdk.operation.contractCreateOperation(args);`

- **Request parameters**

  Args is of Object type, which contains the following parameters:

  | Parameter      |     Type     |        Description                                                         |
  | ------------- | ------- | ------------------------------------------------------------ |
  | sourceAddress | String  | Optional, source account address of the operation                                         |
  | initBalance   | String  | Required, initial asset for contract account, unit MO, 1 BU = 10^8 MO, size limit [1, max(int64)] |
  | type          | Integer | Optional, the language of the contract, the default is                                     |
  | payload       | String  | Required, contract code for the corresponding language                                     |
  | initInput     | String  | Optional, the input parameters of the init method in the contract code                               |
  | metadata      | String  | Optional, note                                                   |

- **Response data**

  | Parameter      |     Type     |        Description               |
  | --------- | ----------------------- | ------------------ |
  | operation | [Operation](#operation) | Object of ContractCreateOperation |

- **Error code**

  | Error Message      |     Error Code     |        Description                                      |
  | ----------------------------------------- | ---------- | ----------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR               | 11002      | Invalid sourceAddress                     |
  | INVALID_CONTRACTADDRESS_ERROR             | 11037      | Invalid contract address                  |
  | CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR | 11038      | ContractAddress is not a contract account |
  |                                           |            |                                           |
  | SYSTEM_ERROR                              | 20000      | System error                              |

### Invoking Contract by Paying Assets

**Note**：If the contract account does not exist, the contract account must be created first.

- **Fee**

  FeeLimit requires to add fees according to the execution of the transaction in the contract. First, the transaction fee is initiated. At present the fee (2018.07.26) is 0.01BU, and then the transaction in the contract also requires the transaction initiator to add the transaction fees.

- **Method call**

`sdk.operation.contractInvokeByAssetOperation(args);`

- **Request parameters**

  Args is of Object type, which contains the following parameters:

  | Parameter      |     Type     |        Description                                                         |
  | --------------- | ------ | ------------------------------------------------------------ |
  | sourceAddress   | String | Optional, source account address of the operation                                         |
  | contractAddress | String | Required, contract account address                                           |
  | code            | String | Optional, asset code, length limit [0, 1024]; when it is empty, only the contract is triggered        |
  | issuer          | String | Optional, the account address issuing assets; when it is null, only trigger the contract                 |
  | assetAmount     | String | Optional, asset amount, size limit[0, max(int64)], when it is 0, only the contract is triggered. It cannot start with 0. |
  | input           | String | Optional, the input parameter of the main() method for the contract to be triggered                               |
  | metadata        | String | Optional, note                                                   |

- **Response data**

  | Parameter      |     Type     |        Description                       |
  | --------- | ----------------------- | -------------------------- |
  | operation | [Operation](#operation) | Object of ContractInvokeByAssetOperation |

- **Error code**

  | Error Message      |     Error Code     |        Description                                              |
  | ----------------------------------------- | ---------- | ------------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR               | 11002      | Invalid sourceAddress                             |
  | INVALID_INITBALANCE_ERROR                 | 11004      | InitBalance must be between 1 and max(int64)      |
  | PAYLOAD_EMPTY_ERROR                       | 11044      | Payload must be a non-empty string                |
  | SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR | 11040      | SourceAddress cannot be equal to contractAddress  |
  | INVALID_ASSET_CODE_ERROR                  | 11023      | The length of asset code must be between 0 and 64 |
  | INVALID_CONTRACT_ASSET_AMOUNT_ERROR       | 15031      | AssetAmount must be between 0 and max(int64)      |
  | INVALID_ISSUER_ADDRESS_ERROR              | 11027      | Invalid issuer address                            |
  | INVALID_INPUT_ERROR                       | 15029      | Invalid input                                     |
  | SYSTEM_ERROR                              | 20000      | System error                                      |

### Invoking Contract By Sending BU

> **Note**: If the destination account is not a contract and it is not activated, this operation will activate this account.

- **Fee**

  FeeLimit requires to add fees according to the execution of the transaction in the contract. First, the transaction fee is initiated. At present the fee (2018.07.26) is 0.01BU, and then the transaction in the contract also requires the transaction initiator to add the transaction fees.

- **Method call**

`sdk.operation.contractInvokeByBUOperation(args);`

- **Request parameters**

  Args is of Object type, which contains the following parameters:

  | Parameter      |     Type     |        Description                                                         |
  | --------------- | ------ | ------------------------------------------------------------ |
  | sourceAddress   | String | Optional, source account address of the operation                                         |
  | contractAddress | String | Required, contract account address                                           |
  | buAmount        | String | Optional, number of asset issues, size limit [0, max(int64)], when it is 0 only triggers the contract |
  | input           | String | Optional, the input parameter of the main() method for the contract to be triggered                               |
  | metadata        | String | Optional, note                                                   |

- **Response data**

  | Parameter      |     Type     |        Description                     |
  | --------- | ----------------------- | ------------------------ |
  | operation | [Operation](#operation) | Object of ContractInvokeByBUOperation |

- **Error code**

  | Error Message      |     Error Code     |        Description                                             |
  | ----------------------------------------- | ---------- | ------------------------------------------------ |
  | INVALID_SOURCEADDRESS_ERROR               | 11002      | Invalid sourceAddress                            |
  | INVALID_CONTRACTADDRESS_ERROR             | 11037      | Invalid contract address                         |
  | CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR | 11038      | ContractAddress is not a contract account        |
  | SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR | 11040      | SourceAddress cannot be equal to contractAddress |
  | INVALID_CONTRACT_BU_AMOUNT_ERROR          | 15030      | BuAmount must be between 0 and max(int64)        |
  | INVALID_INPUT_ERROR                       | 15029      | Invalid input                                    |
  | SYSTEM_ERROR                              | 20000      | System error                                     |

### Recording Log

- **Fee**

  FeeLimit is currently fixed at 0.01 BU (2018.07.26).

- **Method call**

`sdk.operation.logCreateOperation(args);`

- **Request parameters**

  Args is of Object type, which contains the following parameters:

  | Parameter      |     Type     |        Description                                        |
  | ------------- | ------------ | ------------------------------------------- |
  | sourceAddress | String       | Optional, source account address of the operation                        |
  | topic         | String       | Required, Log theme，length limit [1, 128]            |
  | datas         | List<String> | Required, Log content，length limit of each string [1, 1024] |
  | metadata      | String       | Optional, note                                  |

- **Response data**

  | Parameter      |     Type     |        Description           |
  | --------- | ----------------------- | -------------- |
  | operation | [Operation](#operation) | LogCreateOperation |

- **Error code**

  | Error Message      |     Error Code     |        Description                                           |
  | --------------------------- | ---------- | ---------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR | 11002      | Invalid sourceAddress                          |
  | INVALID_LOG_TOPIC_ERROR     | 11045      | The length of key must be between 1 and 128    |
  | INVALID_LOG_DATA_ERROR      | 11046      | The length of value must be between 1 and 1024 |
  | SYSTEM_ERROR                | 20000      | System error                                   |


## Account Service

Account Service provide account-related interfaces, which include six interfaces: `create`,`checkValid`, `getInfo`, `getNonce`, `getBalance`, `getAssets`, and `getMetadata`.

### create

- **Interface description**

The `craete` interface is used to generate private key, public key and addrss of a new account.

- **Method call**

```js
sdk.account.create()
```

- **Response data**

| Parameter      |     Type     |        Description |
| ---------- | ------ | ---- |
| privateKey | String | Private key |
| publicKey  | String | Public key |
| address    | String | Address |

- **Example**

```js
sdk.account.create().then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### checkValid
- **Interface description**

   The `create` interface in account service can generate private key, public key and address of an new account.

- **Method call**

```js
sdk.account.checkValid(address)
```

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   address     |   String     |  Required, the account address to be checked on the blockchain

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   isValid     | Boolean |  Whether the response data is valid   

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   SYSTEM_ERROR |   20000     |  System error 

- **Example**

```js
const address = 'buQemmMwmRQY1JkcU7w3nhruoX5N3j6C29uo';

sdk.account.checkValid(address).then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getInfo

- **Interface description**

   The `getInfo` interface is used to obtain the specified account information.

- **Method call**

`sdk.account.getInfo(address);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   address     |   String     |  Required, the account address to be queried on the blockchain 

- **Response data**

   Parameter      |     Type     |        Description       
   --------- | ------------- | ---------------- 
   address	  |    String     |    Account address       
   balance	  |    String     |    Account balance, unit is MO, 1 BU = 10^8 MO, the account balance must be > 0
   nonce	  |    String     |    Account transaction serial number must be greater than 0
   priv	  | [Priv](#priv) |    Account privilege

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR| 11006 | Invalid address
   CONNECTNETWORK_ERROR| 11007| Failed to connect to the network
   SYSTEM_ERROR |   20000     |  System error 

- **Example**

```js
const address = 'buQemmMwmRQY1JkcU7w3nhruo%X5N3j6C29uo';

sdk.account.getInfo(address).then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getNonce

- **Interface description**

   The `getNonce` interface is used to obtain the nonce value of the specified account.

- **Method call**

`sdk.account.getNonce(address);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   address     |   String     |  Required, the account address to be queried on the blockchain 

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   nonce       |   String     |  Account transaction serial number

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR| 11006 | Invalid address
   CONNECTNETWORK_ERROR| 11007| Failed to connect to the network
   SYSTEM_ERROR |   20000     |  System error 

- **Example**

```js
const address = 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf';

sdk.account.getNonce(address).then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getBalance

- **Interface description**

   The `getBalance` interface is used to obtain the BU balance of the specified account.

- **Method call**

`sdk.account.getBalance(address);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   address     |   String     |  Required, the account address to be queried on the blockchain 

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   balance     |   String     | BU balance, unit MO, 1 BU = 10^8 MO

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR| 11006 | Invalid address
   CONNECTNETWORK_ERROR| 11007| Failed to connect to the network
   SYSTEM_ERROR |   20000     |  System error 

- **Example**

```js
const address = 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf';

const info = sdk.account.getBalance(address);
```

### getAssets

- **Interface description**

   The `getAssets` interface is used to get all the asset information of the specified account.

- **Method call**

`sdk.account.getAssets(address);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   address     |   String     |  Required, the account address to be queried   

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   asset	    | Array<[AssetInfo](#assetinfo)> |Account asset

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR| 11006 | Invalid address
   CONNECTNETWORK_ERROR| 11007| Failed to connect to the network
   NO_ASSET_ERROR|11009|The account does not have the asset
   SYSTEM_ERROR|20000|System error

- **Example**

```js
const address = 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf';

sdk.account.getAssets(address).then(result => {
       console.log(result);
}).catch(err => {
       console.log(err.message);
});
```

### getMetadata

- **Interface description**

   The `getMetadata` interface is used to obtain the metadata information of the specified account.

- **Method call**

`sdk.account.getMetadata(args);`

- **Request parameters**

   Args is of Object type, which contains the following parameters:

   Parameter      |     Type     |        Description       
   -------- | -------- | ---------------- 
   address  |  String  |  Required, the account address to be queried  
   key      |  String  |  Optional, metadata keyword, length limit [1, 1024]

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ----------- | ---------------- 
   metadata    |[MetadataInfo](#metadatainfo)   |  Account metadata

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR | 11006 | Invalid address
   CONNECTNETWORK_ERROR | 11007 | Failed to connect to the network
   NO_METADATA_ERROR|11010|The account does not have the metadata
   INVALID_DATAKEY_ERROR | 11011 | The length of key must be between 1 and 1024
   SYSTEM_ERROR | 20000| System error


- **Example**

```js

const args = {
    address: 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf',
	key: 'test'
};

sdk.account.getMetadata(args).then(result => {
       console.log(result);
}).catch(err => {
       console.log(err.message);
});
```

## Asset Service

Asset Service follow the ATP 1.0 protocol, and Account Service provide an asset-related interface. Currently there is one interface: `getInfo`.

### getInfo

- **Interface description**

   The `getInfo` interface is used to obtain the specified asset information of the specified account.

- **Method call**

`sdk.token.asset.getInfo(args);`

- **Request parameters**

   Args is of Object type, which contains the following parameters:

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   address     |   String    |  Required, the account address to be queried
   code        |   String    |  Required, asset code, length limit [1, 64]
   issuer      |   String    |  Required, the account address for issuing assets

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   asset	    | [AssetInfo](#assetinfo) |Account asset   

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR|11006|Invalid address
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   INVALID_ASSET_CODE_ERROR|11023|The length of asset code must be between 1 and 64
   INVALID_ISSUER_ADDRESS_ERROR|11027|Invalid issuer address
   SYSTEM_ERROR|20000|System error

- **Example**

```js
const args = {
       address: 'buQnnUEBREw2hB6pWHGPzwanX7d28xk6KVcp',
       code: 'TST',
       issuer: 'buQnnUEBREw2hB6pWHGPzwanX7d28xk6KVcp',
};


sdk.token.asset.getInfo(args).then(data => {
 console.log(data);
});
```

## Contract Service

Contract Service provide contract-related interfaces and currently have four interfaces: `checkValid`, `getInfo`, `getAddress`, and `call`.

### checkValid

- **Interface description**

   The `checkValid` interface is used to check the validity of the contract account.

- **Method call**

`sdk.contract.checkValid(contractAddress)`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   contractAddress     |   String     |  Contract account address to be tested

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   isValid     |   Boolean     |  Whether the response data is valid   

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_CONTRACTADDRESS_ERROR|11037|Invalid contract address
   CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR | 11038      | ContractAddress is not a contract account 
   SYSTEM_ERROR |   20000     |  System error 

- **Example**

```js
const contractAddress = 'buQhP94E8FjWDF3zfsxjqVQDeBypvzMrB3y3';

sdk.contract.checkValid(contractAddress).then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getInfo

- **Interface description**

   The `getInfo` interface is used to query the contract code.

- **Method call**

`sdk.contract.getInfo(contractAddress);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   contractAddress     |   String     |  Contract account address to be queried   

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   contract|[ContractInfo](#contractinfo)|Contract info

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_CONTRACTADDRESS_ERROR|11037|Invalid contract address
   CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR|11038|contractAddress is not a contract account
   NO_SUCH_TOKEN_ERROR|11030|No such token
   GET_TOKEN_INFO_ERROR|11066|Failed to get token info
   SYSTEM_ERROR|20000|System error

- **Example**

```js
const contractAddress = 'buQqbhTrfAqZtiX79zp4MWwUVfpcadvtz2TM';

sdk.contract.getInfo(contractAddress).then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getAddress

- **Interface description**

The `getAddress` interface is used to query the contract address.

- **Method call**

`sdk.contract.getAddress(hash);`

- **Request parameters**

Parameter      |     Type     |        Description       
----------- | ------------ | ---------------- 
hash     |   String     |  The hash used to create a contract transaction   

- **Response data**

Parameter      |     Type     |        Description       
----------- | ------------ | ---------------- 
contractAddressList|List<[ContractAddressInfo](#contractaddressinfo)>|Contract address list

- **Error code**

Error Message      |     Error Code     |        Description   
-----------  | ----------- | -------- 
INVALID_HASH_ERROR|11055|Invalid transaction hash
CONNECTNETWORK_ERROR|11007|Failed to connect to the network
SYSTEM_ERROR|20000|System error

- **Example**

```js
const hash = 'f298d08ec3987adc3aeef73e81cbb49cbad2316145ba190700de2d78657880c0';
sdk.contract.getAddress(hash).then(data => {
 console.log(data);
})
```

### call 

- **Interface description**

   The `call` interface is used to debug the contract code.

- **Method call**

`sdk.contract.call(args);`

- **Request parameters**

   Args is of Object type, which contains the following parameters:

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   sourceAddress|String|Optional, the account address to trigger the contract
   contractAddress|String|Optional, the contract account address and code cannot be empty at the same time
   code|String|Optional, the contract code and contractAddress cannot be empty at the same time, length limit [1, 64]
   input|String|Optional, input parameter for the contract
   contractBalance|String|Optional, the initial BU balance given to the contract, unit MO, 1 BU = 10^8 MO, size limit [1, max(int64)]
   optType|Integer|Required, 0: Call the read/write interface of the contract init, 1: Call the read/write interface of the contract main, 2: Call the read-only interface query
   feeLimit|String|Minimum fee required for the transaction, size limit [1, max(int64)], and it cannot start with 0.
   gasPrice|String|Transaction fuel price, size limit [1000, max(int64), and it cannot start with 0.


- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   logs|JSONObject|Log information
   queryRets|JSONArray|Query the result set
   stat|[ContractStat](#contractstat)|Contract resource occupancy
   txs|Array<[TransactionEnvs](#transactionenvs)>|Transaction set

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_SOURCEADDRESS_ERROR|11002|Invalid sourceAddress
   INVALID_CONTRACTADDRESS_ERROR|11037|Invalid contract address
   CONTRACTADDRESS_CODE_BOTH_NULL_ERROR|11063|ContractAddress and code cannot be empty at the same time
   INVALID_OPTTYPE_ERROR|11064|OptType must be between 0 and 2
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **Example**

```js
const args = {
    code: '"use strict";log(undefined);function query() { getBalance(thisAddress); }',
    feeLimit: '1000000000',
    optType: 2
}

sdk.contract.call(args).then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```


## Block service

Block service provide block-related interfaces. There are currently 11 interfaces: `getNumber`, `checkStatus`, `getTransactions`, `getInfo`, `getLatestInfo`, `getValidators`, `getLatestValidators`, `getReward`, `getLatestReward`, `getFees`, and `getLatestFees`.

### getNumber

- **Interface description**

   The `getNumber` interface is used to query the latest block height.

- **Method call**

`sdk.block.getNumber();`

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   header|[BlockHeader](#blockheader)|Block head
   blockNumber|String|The latest block height,corresponding to the underlying field sequence

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.getNumber().then((result) => {
 console.log(result);
}).catch((err) => {
 console.log(err.message);
});
```

### checkStatus

- **Interface description**

   The `checkStatus` interface is used to check if the local node block is synchronized.

- **Method call**

`sdk.block.checkStatus();`

- **Response data**

Parameter      |     Type     |        Description       |
----------- | ------------ | ---------------- |
isSynchronous    |   Boolean     |  Whether the block is synchronized  |

- **Error code**

Error Message      |     Error Code     |        Description   |
-----------  | ----------- | -------- |
CONNECTNETWORK_ERROR|11007|Failed to connect to the network
SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.checkStatus().then((result) => {
 console.log(result);
}).catch((err) => {
 console.log(err.message);
});
```

### getTransactions

- **Interface description**

   The `getTransactions` interface is used to query all transactions at the specified block height.

- **Method call**

   `sdk.block.getTransactions(blockNumber);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   blockNumber|String|Required, the height of the block to be queried must be greater than 0

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   totalCount|String|Total number of transactions returned
   transactions|Array<[TransactionHistory](#transactionhistory)>|Transaction content

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must bigger than 0
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   QUERY_RESULT_NOT_EXIST|15014|Query result does not exist
   SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.getTransactions(100).then(result => {
 console.log(result);
 console.log(JSON.stringify(result));
}).catch(err => {
 console.log(err.message);
});
```

### getInfo

- **Interface description**

   The `getInfo` interface is used to obtain block information.

- **Method call**

`sdk.block.getInfo(blockNumber);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   blockNumber|String|Required, the height of the block to be queried

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   closeTime|String|Block closure time
   number|String|Block height
   txCount|String|Total transactions amount
   version|String|Block version

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must bigger than 0
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.getInfo(100).then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getLatestInfo

- **Interface description**

   The `getLatestInfo` interface is used to get the latest block information.

- **Method call**

`sdk.block. getLatestInfo();`

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   closeTime|String|Block closure time
   number|String|Block height,corresponding to the underlying field seq
   txCount|String|Total transactions amount
   version|String|Block version


- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.getLatestInfo().then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getValidators

- **Interface description**

   The `getValidators` interface is used to get the number of all the authentication nodes in the specified block.

- **Method call**

`sdk.block.getValidators(blockNumber);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   blockNumber|String|Required, the height of the block to be queried must be greater than 0

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   validators|Array<[ValidatorInfo](#validatorinfo)>|Validators list

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must bigger than 0
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.getValidators(100).then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getLatestValidators

- **Interface description**

   The `getLatestValidators` interface is used to get the number of all validators in the latest block.

- **Method call**

`sdk.block.getLatestValidators();`

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   validators|Array<[ValidatorInfo](#validatorinfo)>|Validators list

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.getLatestValidators().then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getReward

- **Interface description**

   The `getReward` interface is used to retrieve the block reward and valicator node rewards in the specified block.

- **Method call**

`sdk.block.getReward(blockNumber);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   blockNumber|String|Required, the height of the block to be queried must be greater than 0

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   blockReward|String|Block rewards
   validatorsReward|Array<[ValidatorReward](#validatorreward)>|Validator rewards


- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must bigger than 0
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.getReward(100).then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getLatestReward

- **Interface description**

   The `getLatestReward` interface gets the block rewards and validator rewards in the latest block. The method call is as follows:

- **Method call**

`BlockGetLatestRewardResponse getLatestReward();`

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   blockReward|String|Block rewards
   validatorsReward|[ValidatorReward](#validatorreward)[]|Validator rewards

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.getLatestReward().then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getFees

- **Interface description**

   The `getFees` interface gets the minimum asset limit and fuel price of the account in the specified block.

- **Method call**

`sdk.block.getFees(blockNumber);`

- **Request parameters**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   blockNumber|String|Required, the height of the block to be queried must be greater than 0

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   fees|[Fees](#fees)|Fees

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must bigger than 0
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.getFees(100).then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```

### getLatestFees

- **Interface description**

   The `getLatestFees` interface is used to obtain the minimum asset limit and fuel price of the account in the latest block.

- **Method call**

`sdk.block.getLatestFees();`

- **Response data**

   Parameter      |     Type     |        Description       
   ----------- | ------------ | ---------------- 
   fees|[Fees](#fees)|Fees

- **Error code**

   Error Message      |     Error Code     |        Description   
   -----------  | ----------- | -------- 
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **Example**

```js
sdk.block.getLatestFees().then(result => {
 console.log(result);
}).catch(err => {
 console.log(err.message);
});
```



## Data Object

#### Priv

| Member       |     Type     |       Description                                                    |
| ------------ | ----------------------- | ------------------------------------------------------- |
| masterWeight | String                  | Account weight, size limit [0, max(uint32)] |
| signers      | [Signer](#signer)[]     | Signer weight list                                          |
| threshold    | [Threshold](#threshold) | Threshold                                                    |

#### Signer

| Member       |     Type     |       Description                                                  |
| ------- | ------ | ----------------------------------------------------- |
| address | String | The account address of the signer on the blockchain                                  |
| weight  | String | Signer weight, size limit [0, max(uint32)] |

#### Threshold

| Member       |     Type     |       Description                                       |
| -------------- | --------------------------------- | ------------------------------------------- |
| txThreshold    | String                            | Transaction default threshold, size limit [0, max(int64)] |
| typeThresholds | [TypeThreshold](#typethreshold)[] | Thresholds for different types of transactions                          |

#### TypeThreshold

| Member       |     Type     |       Description                                  |
| --------- | ------ | ------------------------------------- |
| type      | String | The operation type must be greater than 0                   |
| threshold | String | Threshold, size limit [0, max(int64)] |

#### AssetInfo

| Member       |     Type     |       Description         |
| ----------- | ----------- | ------------ |
| key         | [Key](#key) | Unique identifier for asset |
| assetAmount | String      | Amount of assets     |

#### Key

| Member       |     Type     |       Description             |
| ------ | ------ | ---------------- |
| code   | String | Asset code         |
| issuer | String | The account address for issuing assets |

#### ContractInfo

Member       |     Type     |       Description      |
----------- | ------------ | ---------------- |
type|Integer|Contract type, default is 0
payload|String|Contract code

#### MetadataInfo
Member       |     Type     |       Description       
----------- | ----------- | ---------------- 
key         |  String     |  Metadata keyword
value       |  String     |  Metadata content
version     |  String    |  Metadata version

#### ContractAddressInfo

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
contractAddress|String|Contract address
operationIndex|Integer|The subscript of the operation

#### ContractStat

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
  applyTime|String|Receipt time
  memoryUsage|String|Memory footprint
  stackUsage|String|Stack occupancy
  step|String|Steps needed

#### TransactionEnvs

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
  transactionEnv|[TransactionEnv](#transactionenv)|Transaction

#### TransactionEnv

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
transaction|[TransactionInfo](#transactioninfo)|Transaction content
trigger|[ContractTrigger](#contracttrigger)|Contract trigger

#### TransactionInfo

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
sourceAddress|String|The source account address initiating the transaction
feeLimit|String|Minimum fees required for the transaction
gasPrice|String|Transaction fuel price
nonce|String|Transaction serial number
operations|[Operation](#operation)[]|Operations list

#### ContractTrigger
Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
transaction|[TriggerTransaction](#triggertransaction)|Trigger transactions

#### Operation

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
type|Integer|Operation type
sourceAddress|String|The source account address initiating operations
metadata|String|Note
createAccount|[OperationCreateAccount](#operationcreateaccount)|Operation of creating accounts
issueAsset|[OperationIssueAsset](#operationissueasset)|Operation of issuing assets
payAsset|[OperationPayAsset](#operationpayasset)|Operation of transferring assets
payCoin|[OperationPayCoin](#operationpaycoin)|Operation of sending BU
setMetadata|[OperationSetMetadata](#operationsetmetadata)|Operation of setting metadata
setPrivilege|[OperationSetPrivilege](#operationsetprivilege)|Operation of setting account privilege
log|[OperationLog](#operationlog)|Record log

#### TriggerTransaction

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
hash|String|Transaction hash

#### OperationCreateAccount

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
destAddress|String|Target account address
contract|[Contract](#contract)|Contract info
priv|[Priv](#priv)|Account privilege
metadata|[MetadataInfo](#metadatainfo)[]|Account
initBalance|String|Account assets, unit MO, 1 BU = 10^8 MO,
initInput|String|The input parameter for the init function of the contract

#### Contract

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
type|Integer| The contract language is not assigned value by default
payload|String|The contract code for the corresponding language

#### MetadataInfo

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
key|String|Metadata keyword
value|String|Metadata content
version|String|Metadata version

#### OperationIssueAsset

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
code|String|Asset code
assetAmount|String|Amount of assets

#### OperationPayAsset

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
destAddress|String|The target account address to which the asset is transferred
asset|[AssetInfo](#assetinfo)|Account asset
input|String|Input parameters for the main function of the contract

#### OperationPayCoin

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
destAddress|String|The target account address to which the asset is transferred
buAmount|String|BU amounts to be transferred
input|String|Input parameters for the main function of the contract

#### OperationSetMetadata

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
key|String|Metadata keyword
value|String|Metadata content
version|String|Metadata version
deleteFlag|boolean|Whether to delete metadata

#### OperationSetPrivilege

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
masterWeight|String|Account weight, size limit [0, max(uint32)]
signers|[Signer](#signer)[]|Signer weight list
txThreshold|String|Transaction threshold, size limit [0, max(int64)]
typeThreshold|[TypeThreshold](#typethreshold)|Threshold for specified transaction type

#### OperationLog

Member       |     Type     |       Description      
----------- | ------------ | ---------------- 
topic|String|Log theme
data|String[]|Log content



#### TestTx

| Member       |     Type     |       Description         |
| -------------- | ------------------------------------------- | ------------ |
| transactionEnv | [TestTransactionFees](#testtransactionfees) | Assess transaction costs |

#### TestTransactionFees

| Member       |     Type     |       Description     |
| --------------- | ----------------------------------- | -------- |
| transactionFees | [TransactionFees](#transactionfees) | Transaction fees |

#### TransactionFees

| Member       |     Type     |       Description               |
| -------- | ------ | ------------------ |
| feeLimit | String | Minimum fees required for the transaction |
| gasPrice | String | Transaction fuel price       |

#### Signature

| Member       |     Type     |       Description      |
| --------- | ------ | ---------- |
| signData  | String | Signed data |
| publicKey | String | Public key       |

#### TransactionHistory

| Member       |     Type     |       Description         |
| ----------- | ----------------------------------- | ------------ |
| actualFee   | String                              | Actual transaction cost |
| closeTime   | String                              | Transaction closure time |
| errorCode   | String                              | Transaction error code   |
| errorDesc   | String                              | Transaction description     |
| hash        | String                              | Transaction hash     |
| ledgerSeq   | String                              | Block serial number   |
| transaction | [TransactionInfo](#transactioninfo) | List of transaction contents |
| signatures  | [Signature](#signature)[]           | Signature list     |
| txSize      | String                              | Transaction size     |

#### ValidatorReward

| Member       |     Type     |       Description        |
| --------- | ------ | ------------ |
| validator | String | Validator address |
| reward    | String | Validator reward |

#### ValidatorInfo

| Parameter      |     Type     |        Description         |
| --------------- | ------ | ------------ |
| address         | String | Consensus node address |
| plegeCoinAmount | String | Validators deposit |

#### Fees

| Member       |     Type     |       Description                                 |
| ----------- | ------ | ------------------------------------ |
| baseReserve | String | Minimum asset limit for the account                     |
| gasPrice    | String | Transaction fuel price, unit MO, 1 BU = 10^8 MO |



## Error Code

Error Message      |     Error Code     |        Description   
-----------  | ----------- | -------- 
ACCOUNT_CREATE_ERROR|11001|Failed to create the account 
INVALID_SOURCEADDRESS_ERROR|11002|Invalid sourceAddress
INVALID_DESTADDRESS_ERROR|11003|Invalid destAddress
INVALID_INITBALANCE_ERROR|11004|InitBalance must be between 1 and max(int64) 
SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR|11005|SourceAddress cannot be equal to destAddress
INVALID_ADDRESS_ERROR|11006|Invalid address
CONNECTNETWORK_ERROR|11007|Failed to connect to the network
INVALID_ISSUE_AMOUNT_ERROR|11008|Amount of the token to be issued must be between 1 and max(int64)
NO_ASSET_ERROR|11009|The account does not have the asset
NO_METADATA_ERROR|11010|The account does not have the metadata
INVALID_DATAKEY_ERROR|11011|The length of key must be between 1 and 1024
INVALID_DATAVALUE_ERROR|11012|The length of value must be between 0 and 256000
INVALID_DATAVERSION_ERROR|11013|The version must be equal to or greater than 0 
INVALID_MASTERWEIGHT_ERROR|11015|MasterWeight must be between 0 and max(uint32)
INVALID_SIGNER_ADDRESS_ERROR|11016|Invalid signer address
INVALID_SIGNER_WEIGHT_ERROR|11017|Signer weight must be between 0 and max(uint32)
INVALID_TX_THRESHOLD_ERROR|11018|TxThreshold must be between 0 and max(int64)
INVALID_OPERATION_TYPE_ERROR|11019|Operation type must be between 1 and 100
INVALID_TYPE_THRESHOLD_ERROR|11020|TypeThreshold must be between 0 and max(int64)
INVALID_ASSET_CODE_ERROR|11023|The length of key must be between 1 and 64
INVALID_ASSET_AMOUNT_ERROR|11024|AssetAmount must be between 0 and max(int64)
INVALID_BU_AMOUNT_ERROR|11026|BuAmount must be between 0 and max(int64)
INVALID_ISSUER_ADDRESS_ERROR|11027|Invalid issuer address
NO_SUCH_TOKEN_ERROR|11030|No such token
INVALID_TOKEN_NAME_ERROR|11031|The length of token name must be between 1 and 1024
INVALID_TOKEN_SIMBOL_ERROR|11032|The length of symbol must be between 1 and 1024
INVALID_TOKEN_DECIMALS_ERROR|11033|Decimals must be between 0 and 8
INVALID_TOKEN_TOTALSUPPLY_ERROR|11034|TotalSupply must be between 1 and max(int64)
INVALID_TOKENOWNER_ERRPR|11035|Invalid token owner
INVALID_CONTRACTADDRESS_ERROR|11037|Invalid contract address
CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR|11038|contractAddress is not a contract account
INVALID_TOKEN_AMOUNT_ERROR|11039|TokenAmount must be between 1 and max(int64)
SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR|11040|SourceAddress cannot be equal to contractAddress
INVALID_FROMADDRESS_ERROR|11041|Invalid fromAddress
FROMADDRESS_EQUAL_DESTADDRESS_ERROR|11042|FromAddress cannot be equal to destAddress
INVALID_SPENDER_ERROR|11043|Invalid spender
PAYLOAD_EMPTY_ERROR|11044|Payload cannot be empty
INVALID_LOG_TOPIC_ERROR|11045|The length of a log topic must be between 1 and 128
INVALID_LOG_DATA_ERROR|11046|The length of one piece of log data must be between 1 and1024
INVALID_CONTRACT_TYPE_ERROR|11047|Invalid contract type
INVALID_NONCE_ERROR|11048|Nonce must be between 1 and max(int64)
INVALID_GASPRICE_ERROR|11049|GasPrice must be between 1000 and max(int64)
INVALID_FEELIMIT_ERROR|11050|FeeLimit must be between 1 and max(int64)
OPERATIONS_EMPTY_ERROR|11051|Operations cannot be empty
INVALID_CEILLEDGERSEQ_ERROR|11052|CeilLedgerSeq must be equal to or greater than 0
OPERATIONS_ONE_ERROR|11053|One of the operations cannot be resolved
INVALID_SIGNATURENUMBER_ERROR|11054|SignagureNumber must be between 1 and max(int32)
INVALID_HASH_ERROR|11055|Invalid transaction hash
INVALID_BLOB_ERROR|11056|Invalid blob
PRIVATEKEY_NULL_ERROR|11057|PrivateKeys cannot be empty
PRIVATEKEY_ONE_ERROR|11058|One of privateKeys is invalid
SIGNDATA_NULL_ERROR|11059|SignData cannot be empty
INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must be bigger than 0
PUBLICKEY_NULL_ERROR|11061|PublicKey cannot be empty
URL_EMPTY_ERROR|11062|Url cannot be empty
CONTRACTADDRESS_CODE_BOTH_NULL_ERROR|11063|ContractAddress and code cannot be empty at the same time
INVALID_OPTTYPE_ERROR|11064|OptType must be between 0 and 2
GET_ALLOWANCE_ERROR|11065|Failed to get allowance
GET_TOKEN_INFO_ERROR|11066|Failed to get token info
SIGNATURE_EMPTY_ERROR|11067|The signatures cannot be empty
REQUEST_NULL_ERROR|12001|Request parameter cannot be null
INVALID_ARGUMENTS|15016|Invalid arguments to the function
INVALID_FORMAT_OF_ARG|15019|Invalid argument format to the function
INVALID_SIGNATURE_ERROR|15027|Invalid signature
INVALID_METADATA_ERROR|15028|Invalid metadata
INVALID_INPUT_ERROR|15029|invalid input
INVALID_CONTRACT_BU_AMOUNT_ERROR|15030|BuAmount must be between 0 and max(int64)
INVALID_CONTRACT_ASSET_AMOUNT_ERROR|15031|AssetAmount must be between 0 and max(int64)
CONNECTN_BLOCKCHAIN_ERROR|19999|Failed to connect to the blockchain 
SYSTEM_ERROR|20000|System error
