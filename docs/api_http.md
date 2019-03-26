---
id: api_http
title: BUMO HTTP
sidebar_label: HTTP
---

## Overview

BUMO, you need to understand the basic information such as the data format in the http interfaces, http web server, port configuration, transaction process, and transaction operations.

### json

The data in the http interfaces is in json format.

### http

BuChain provides http API interfaces. You can find the `"webserver"` object in the bumo.json file located at the installation directory /config/bumo.json , which specifies the http service port.


```json
    "webserver":
    {
      "listen_addresses": "0.0.0.0:36002"
    }
```

### Port Configuration

| Network       | WebServer |
| ------------- | --------- |
| mainnet    | 16002 |
| testnet   | 26002 |
| internalnet  |  36002 |



### Transaction Process

The transaction process includes five steps:
1. Assemble the transaction object `Transaction` according to your requiremment. Different transactions have different data structures. See [Transactions](#transactions) for details.
2. The transaction object is serialized into a byte stream `transaction_blob`. See [getTransactionBlob](#gettransactionblob) for details.
3. Sign the `transaction_blob` with the private key `skey` to get `sign_data`, and the public key of `skey` is `pkey`. See [Keypair Guide](../keypair_guide) for details.
4. Submit the transaction. See [submitTransaction](#submittransaction) for details.
5. According to the query of the transaction by hash to determine whether the transaction is successful. See [getTransactionHistory](#gettransactionhistory) for details.

**Note**: Refer to [Example](#example) for the complete transaction process.

### Have a Try

If your blockchain has just been deployed, there is only a genesis account in the blockchain system. You can check the genesis account through the http interface: `HTTP GET host: 36002/getGenesisAccount`.

The content returned is as follows.

```json
{
   "error_code" : 0,
   "result" : {
      "address" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3",
      "assets" : null,
      "balance" : 100000000000000000,
      "metadatas" : null,
      "priv" : {
         "master_weight" : 1,
         "thresholds" : {
            "tx_threshold" : 1
         }
      }
   }
}
```


The value of `address` in the returned result is the genesis account.

You can query any account through the [getAccount](#getaccount) interface.

```http
HTTP GET host:36002/getAccount?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3
```



## Transactions

- In json format

    ```json
      {
          "source_address":"buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3",//The source account, also called the originator of the transaction
          "nonce":2, //The nonce value of the source account
          "fee_limit" : 1000000, //The transaction fee that you intend to pay
          "gas_price": 1000,//The gas price (not less than the minimum configured)
          "ceil_ledger_seq": 100, //Optional, block height limit, if greater than 0, the transaction is only valid below (including the height) the block height
          "metadata":"0123456789abcdef", //Optional, a user-defined note for transactions, in hexadecimal format
          "operations":[
          {
          //Fill in according to specific operations
          },
          {
          //Fill in according to specific operations
          }
          ......
          ]
      }
    ```

- Keywords in json

    | Keyword          | Type   | Description                                                     |
    | --------------- | ------ | ------------------------------------------------------------ |
    | source_address  | string | The source account of the transaction, which is the account of the transaction initiator. When the transaction is successful, the nonce field of the source account will be automatically incremented by 1. The nonce in the account number is the number of transactions executed by this account   |
    | nonce           | int64  | Its value must be equal to the current nonce+1 of the source account of the transaction, which is designed to prevent replay attacks. If you want to know how to query the nonce of an account, you can refer to [getTransactionHistory](#gettransactionhistory). If the account queried does not display the nonce value, the current nonce of the account is 0. |
    | fee_limit       | int64  | The maximum fee that can be accepted for this transaction. The transaction will first charge a fee based on this fee. If the transaction is executed successfully, the actual cost will be charged, otherwise the fee for this field will be charged. The unit is MO, 1 BU = 10^8 MO |
    | gas_price       | int64  | It is used to calculate the handling fee for each operation and also involved in the calculation of the transaction byte fee. The unit is MO, 1 BU = 10^8 MO |
    | ceil_ledger_seq | int64  | Optional, the block height restriction for this transaction, which is also an advanced feature             |
    | operations      | array  | The operation list. The payload of this transaction, which is what the transaction wants to do. See [Operations](#operations) for more details |
    | metadata        | string | Optional, a user-defined field that can be left blank or filled in a note                   |



## Operations

The corresponding `operations` in the json structure of the transaction can contain one or more operations.

- In json format
    ```json
    {
        "type": 1,//The operation type
        "source_address": "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3",//Optional, the source account of the operations 
        "metadata": "0123456789abcdef",//Optional, a user-defined note for transactions, in hexadecimal format
        "create_account": {
            //The parameters of the account to be created
        },
        "issue_asset": {
            //The parameters of the asset to be issued
        },
        "pay_asset": {
            //The parameters of the asset to be transferred
        },
        "set_metadata": {
            //Set the relevant parameters of the account metadata
        },
        "pay_coin": {
            //The parameters of the native token(BU) to be transferred
        },
        "set_privilege": {
            ///The parameters of setting the account privileges
        },
        "log": {
            //The parameters of the log
        }
    }
    ```

- Keyword in json

    | Keyword         | Type  | Description                                                       |
    | -------------- | ------ | ------------------------------------------------------------ |
    | type           | int    | Operation code, different operation codes perform different operations, see [Operation Codes](#operation-codes) for details  |
    | source_address | string | Optional, the source account of the operation, that is, the operator of the operation. When not filled in, the default is the same as the source account of the transaction|
    | metadata       | string | Optional, a user-defined field that can be left blank or filled in a note                     |
    | create_account | json   | The [Creating Accounts](#creating-accounts) operation                                    |
    | issue_asset    | json   | The [Issuing Assets](#issuing-assets) operation                                    |
    | pay_asset      | json   | The  [Transferring Assets](#transferring-assets) operation                            |
    | set_metadata   | json   | The [Setting Metadata](#setting-metadata) operation                            |
    | pay_coin       | json   | The [Transferring BU Assets](#transferring-bu-assets) operation                              |
    | log            | json   | The [Recording Logs](#recording-logs) operation                                    |
    | set_privilege  | json   | The [Setting Privileges](#setting-privileges) operation         |



### Operation Codes

| Operation Code  | Operation           | Description        |
| :----- | ----------------- | ------------ |
| 1      | create_account    | [Creating Accounts](#creating-accounts)    |
| 2      | issue_asset       | [Issuing Assets](#issuing-assets)     |
| 3      | pay_asset         | [Transferring Assets](#transferring-assets)    |
| 4      | set_metadata      | [Setting Metadata](#setting-metadata) |
| 7      | pay_coin          | [Transferring BU Assets](#transferring-bu-assets) |
| 8      | log               | [Recording Logs](#recording-logs)     |
| 9      | set_privilege     | [Setting Privileges](#setting-privileges)     |

### Creating Accounts
The source account creates a new account on the blockchain. Creating Accounts are divided into [Creating Normal Accounts](#creating-normal-accounts) and [Creating Contract Accounts](#creating-contract-accounts).

#### Creating Normal Accounts

> **Note**: Both `master_weight` and `tx_threshold` must be 1 in the current operation. 

- In json format
    ```json
    {
          "dest_address": "buQcSAePGfDiaW9t9xsWFVRA3ZwGVcRpR9CZ",//The target account address to be created
          "init_balance": 100000,//The initial balance of the target account
          "priv":  {
                "master_weight": 1,//The weight owned by the target account
                "thresholds": {
                      "tx_threshold": 1//The threshold required to initiate a transaction
                }
          }
    }
    ```

- Keyword in json

    | Keyword        | Type   | Description                                                         |
    | ------------- | ------ | ------------------------------------------------------------ |
    | dest_address  | string | The address of the target account. When creating a normal account, it cannot be empty                   |
    | init_balance  | int64  | The initial BU value of the target account, in MO, 1 BU = 10^8 MO    |
    | master_weight | int64  | The master weight of the target account, which ranges [0, MAX(UINT32)]    |
    | tx_threshold  | int64  | The threshold for initiating a transaction below which the transaction cannot be initiated, which ranges ​​[0, MAX(INT64)] |

- Query

  The account information is queried through the [getAccount](#getaccount) interface.



#### Creating Contract Accounts

> **Note**: In the current operation, `master_weight` must be 0 and `tx_threshold` must be 1. 

- In json format
    ```json
    {
        "contract": { //Contract
            "payload": "
                'use strict';
                function init(bar)
                {
                  return;
                }

                function main(input)
                {
                  return;
                }

                function query()
                {
                  return;
                }
              "//Contract code
            },
            "init_balance": 100000,  //The initial asset of the contract account 
            "init_input" : "{\"method\":\"toWen\",\"params\":{\"feeType\":0}}",//Optional, the entry of the init function
            "priv": {
                "master_weight": 0,//The weight of the contract account to be created
                "thresholds": {
                "tx_threshold": 1　//The weight required to initiate a transaction
            }
        }
    }
    ```

- Keyword in json

    | Keyword        | Type   | Description                                                         |
    | ------------- | ------ | ------------------------------------------------------------ |
    | payload       | string | The contract code                          |
    | init_balance  | int64  | The initial BU value of the target account, in MO, 1 BU = 10^8 MO        |
    | init_input    | string | Optional, the input parameter of the init function in the contract code                             |
    | master_weight | int64  | The master weight of the target account                                |
    | tx_threshold  | int64  | The threshold for initiating a transaction below which it is not possible to initiate a transaction.                    |

- Query

  - The account information is queried through the [getAccount](#getaccount) interface.

  - Query with the [getTransactionHistory](#gettransactionhistory) interface, and the result is as follows:

    ```json
    [
        {
            "contract_address": "buQm5RazrT9QYjbTPDwMkbVqjkVqa7WinbjM", //The contract account
            "operation_index": 0                                        //The operation index value in the transaction array, 0 means the first transaction
        }
    ]
    ```



### Issuing Assets

- Function

  The source account of this operation issues a digital asset, and this asset appears in the asset balance of the source account after successful execution.

- In json format

    ```json
    {
        "code": "HYL", //The code of the asset to be issued
        "amount": 1000 //The amount of the asset to be issued
    }
    ```

- Keyword in json

    | Keyword | Type   | Description                                       |
    | ------ | ------ | ------------------------------------------ |
    | code   | string | The code of the asset to be issued, which ranges [1, 64]        |
    | amount | int64  | The amount of the asset to be issued, which ranges ​​(0, MAX(int64))|



### Transferring Assets

> **Note**: If the target account is a contract account, the current operation triggers the contract execution of the target account. 

- Function

  The source account of this operation transfers an asset to the target account.

- In json format

    ```json
    {
        "dest_address": "buQcSAePGfDiaW9t9xsWFVRA3ZwGVcRpR9CZ",//The target account to receive the asset
        "asset": {
            "key": {
                "issuer": "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3",//The account to issue the asset
                "code": "HYL" // The code of the asset to be transferred
            },
            "amount": 100 //The amount of the asset to be transferred
        },
        "input": "{\"bar\":\"foo\"}"　// Optional, the input parameters of the main code of the contract code in the target account
    }
    ```

- Keyword in json

    | Keyword       | Type   | Description                                                         |
    | ------------ | ------ | ------------------------------------------------------------ |
    | dest_address | string | The address of the target account                            |
    | issuer       | string | The address of the issuer                                          |
    | code         | string | The asset code which ranges [1, 64]                                  |
    | amount       | int64  | The amount of the asset which ranges (0,MAX(int64))                             |
    | input        | string | Optionally, if the target account is a contract account, the input will be passed to the argument of the `main` function of the contract code. This setting is invalid if the target account is a normal account |



### Setting Metadata

- Function

  The source account of this operation modifies or adds metadata to the metadata table.

- In json format

    ```json
    {
        "key": "abc",//Metadata Keyword
        "value": "hello abc!",//Metadata content
        "version": 0 //Optional, the metadata version
    }
    ```

- Keyword in json

    | Keyword  | Type   | Description                                                         |
    | ------- | ------ | ------------------------------------------------------------ |
    | key     | string | The keyword of metadata, which ranges (0, 1024)                        |
    | value   | string | The content of metadata, which ranges [0, 256K].                         |
    | version | int64  | Optional, metadata version number. The default value is *0*. 0: when the value is zero, it means no limit version; >0: when the value is greater than zero, it means the current value version must be this value; <0: when the value is less than zero, it means the value is illegal |



### Setting Privileges

- Function

  Set the weights that the signer has and set the thresholds required for each operation. For details, see [Assignment of Control Rights](#assignment-of-control-rights).

- In json format

    ```json
    {
        "master_weight": "10",//Optional, the current account's weight
        "signers"://Optional, a list of signers that need to operate
        [
            {
                "address": "buQqfssWJjyKfFHZYx8WcSgLVUdXPT3VNwJG",//The signer's address
                "weight": 8　//Optional, the signer's weight
            }
        ],
        "tx_threshold": "2",//Optional, the threshold required to initiate the transaction
        "type_thresholds"://Optional, the thresholds required for different operations
        [
            {
                "type": 1,//The type of account creation
                "threshold": 8　//Optional, the threshold required for this operation
            },
            {
                "type": 2,//The type of asset issuance
                "threshold": 9 //Optional, the threshold required for this operation
            }
        ]
    }
    ```



- Keywords in json

    | Keyword          | Type   | Description                                                         |
    | --------------- | ------ | ------------------------------------------------------------ |
    | master_weight   | string | Optional, by default "", it indicates the master weight of the account. "" : do not set this value; "0": set the master weight to 0; ("0", "MAX(UINT32)"]: set the weight value to this value; Other: illegal |
    | signers         | array  | Optional, a list of signers that need to operate. By default is an empty object. Empty objects are not set |
    | address         | string | The signer's address that needs to operate, which should be in accordance with the address verification rules  |
    | weight          | int64  | Optional, by default is 0. 0: delete the signer; (0, MAX (UINT32)]: set the weight to this value, others: illegal |
    | tx_threshold    | string | Optional, by default "", it means the minimum privilege for the account. "", do not set this value; "0": set `tx_threshold` weight to 0; ("0", "MAX(INT64)"]: set the weight value to this value; others: illegal. |
    | type_thresholds | array  | Optional, a list of thresholds ​​required for different operations; by default is an empty object. Empty objects are not set |
    | type            | int    | To indicate a certain operation type  (0, 100]                                 |
    | threshold       | int64  | Optional, by default is 0. 0: delete the type operation; (0, MAX(INT64)]: set the weight value to this value; Other: illegal |



### Transferring BU Assets

> **Note**: If the target account is a contract account, the current operation triggers the contract execution of the target account. 

- Function

  Two functions:

  1. The source account of this operation transfers a BU asset to the target account.
  1. The source account of this operation creates a new account on the blockchain.

- In json format

    ```json
    {
        "dest_address": "buQgmhhxLwhdUvcWijzxumUHaNqZtJpWvNsf",//The target account to receive BU assets
        "amount": 100,//The amount of BU assets to be transferred
        "input": "{\"bar\":\"foo\"}" // Optional, the input parameters of the main code of the contract code in the target account
    }
    ```

- jsonKeyword

    | Keyword       | Type   | Description                                                         |
    | ------------ | ------ | ------------------------------------------------------------ |
    | dest_address | string | The target account                                                   |
    | amount       | array  | Optional, a list of signers that need to operate. By default is an empty object. Empty objects are not set.|
    | input        | string | Optionally, if the target account is a contract account, and the input will be passed to the argument of the `main` function of the contract code. This setting is invalid if the target account is a normal account. |


### Recording Logs

- Function

  The source account of this operation writes the log to the blockchain.

- In json format

    ```json
    {
        "topic": "hello",// The topic of the log
        "datas"://The content of the log
        [
            "hello, log 1",
            "hello, log 2"
        ]
    }
    ```

- jsonKeyword

    | Keyword | Type   | Description                             |
    | ------ | ------ | -------------------------------- |
    | topic  | string | The log topic and the parameter length is (0,128]      |
    | datas  | array  | The log content. The length of each element is (0,1024] |



## Assignment of Control Rights

When you create an account, you can specify the control assignment for this account. You can set this by setting the value of `priv`. Here is a simple example.

```json
{
    "master_weight": "70",//The weight for the private key of this address is 70
    "signers": [//The weights assigned
        {
            "address": "buQc39cgJDBaFGiiAsRtYKuaiSFdbVGheWWk",
            "weight": 55    //The weight of the above address is 55
        },
        {
            "address": "buQts6DfT5KavtV94JgZy75H9piwmb7KoUWg",
            "weight": 100    //The weight of the above address is 100
        }
    ],
    "tx_threshold": "8",//The weight required to initiate the transaction is 8
    "type_thresholds": [
        {
            "type": 1,//The weight required to create an account is 11
            "threshold": 11
        },
        {//The weight required to issue an asset is 21
            "type": 2,
            "threshold": 21
        },
        {//The weight required to transfer assets is 31
            "type": 3,
            "threshold": 31
        },
        {//The weight required to set metadata is 41
            "type": 4,
            "threshold": 41
        },
        {//The weight required to change controllers is 51
            "type": 5,
            "threshold": 51
        },
        {//The weight required to change operations is 61
            "type": 6,
            "threshold": 61
        }
    ]
}
```



## HTTP Interfaces

### Generating Public and Private Key pairs - Test

```http
HTTP GET /createKeyPair
```

- Function

  > **Note**: This interface is only for testing purposes. Do not use this interface in a production environment (SDK or command line used in production environment), because after calling this interface, if the node server is evil, the account's private key will be leaked. This interface only generates a public-private key pair and does not write to the entire network blockchain.

- Return value

    ```json
    {
       "error_code" : 0,
       "result" : {
          "address" : "buQqRgkmtckz3U4kX91F2NmZzJ9rkadjYaa2",  //The account address
          "private_key" : "privbtnSGRQ46FF3MaqiGiDNytz2soFw4iNHKahTqszR6mRrmq7qhVYh",  //The private key of the account
          "private_key_aes" : "7594a97bc5e6432704cc5f58ff60727ee9bda10a6117915d025553afec7f81527cb857b882b7c775391fe1fe3f7f3ec198ea69ada138b19cbe169a1a3fa2dec8",  //The data after the private key of the account is encrypted with AES
          "public_key" : "b00101da11713eaad86ad8ededfc28e86b8cd619ca2d593a21d8b82da34320a7e63b09c279bc", //The public key of the account
          "public_key_raw" : "01da11713eaad86ad8ededfc28e86b8cd619ca2d593a21d8b82da34320a7e63b",  //The data of the public key excluding the prefix and suffix
          "sign_type" : "ed25519"  //The type of the account encryption
       }
    }
    ```

### getAccount

```http 
HTTP GET /getAccount?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3&key=hello&code=xxx&issuer=xxx
```

- Function

  Return information about the specified account and all its assets and metadata.

- Parameters

  | Parameter        | Description                                                         |
  | ------------ | ------------------------------------------------------------ |
  | address      | The account address, required                                       |
  | key          | The value of the key specified in the metadata of the account. If not filled, the returned result contains all the metadata |
  | code, issuer | The asset code, and asset issuer. These two variables are either filled in at the same time or not filled at the same time. If you do not fill in, the returned results contain all the assets. If filled in, only the code and issuer are displayed in the returned results. |

- Return value

  The content returned is as follows:

    ```json
    {
      "error_code" : 0,//Error code, 0 means success
      "result" : {
        "address" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3", //The address of the account
        "balance" : 300000000000,//BU balance, in MO
        "nonce" : 1, //The number of transactions that the account has currently executed. If nonce is 0, this field is not displayed.
        "assets" : [//The asset list
          {
            "amount" : 1400,//The amount of the asset
            "key"　://Keyword of this asset
            {
              "code" : "CNY",//The asset code
              "issuer" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3"　//The account address of the asset issuer 
            }
          }, {
            "amount" : 1000,
            "key" :
            {
              "code" : "USD",
              "issuer" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3"
            }
          }
        ],
        "assets_hash" : "9696b03e4c3169380882e0217a986717adfc5877b495068152e6aa25370ecf4a",//The hash value generated by the asset list
        "contract" : null,//Contract. **Empty** means that the current contract is not a contract
        "metadatas" : [//Metadata list
          {
            "key" : "123",//Keyword of metadata
            "value" : "123_value",//Metadata content
            "version" : 1 // Metadata version
          }, {
            "key" : "456",
            "value" : "456_value",
            "version" : 1
          }, {
            "key" : "abcd",
            "value" : "abcd_value",
            "version" : 1
          }
        ],
        "metadatas_hash" : "82c8407cc7cd77897be3100c47ed9d43ec4097ee1c00e2c13447187e5b1ac66c",//The hash value generated by the metadata list
        "priv" : {//The privilege of the account
          "master_weight" : 1,//The weight for the account
          "thresholds" : {
            "tx_threshold" : 1//The weight required to initiate a transaction
          }
        }
      }
    }
    ```

  If the account does not exist, the content returned is as follows:

    ```json
    {
       "error_code" : 4,//Error code, 4 means the account does not exist
       "result" : null
    }
    ```



### getAccountBase

```http
HTTP GET /getAccountBase?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3
```

- Function

  Return basic information about the specified account, excluding assets and metadata.
- Parameter

    | Parameter        | Description|
    | :----------- | ---------- |
    | address      | The account address, required  |

- Return value

  The content returned is as follows:

    ```json
    {
      "error_code" : 0,//Error code, 0 indicates success
      "result" : {
        "address" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3", //The address of the account
        "assets_hash" : "9696b03e4c3169380882e0217a986717adfc5877b495068152e6aa25370ecf4a",//The hash value generated by the asset list
        "balance" : 899671600,//BU balance in MO
        "contract" : null,//Contract. **Empty** indicates the current account is not a contract account
        "nonce" : 1, //The number of transactions that the account has currently executed. If nonce is 0, this field is not displayed.
        "priv" : {//Account privileges
          "master_weight" : 1,//The weight of the account
          "thresholds" : {
            "tx_threshold" : 1 //The weight required to initiate a transaction
          }
        },
        "metadatas_hash" : "82c8407cc7cd77897be3100c47ed9d43ec4097ee1c00e2c13447187e5b1ac66c"　// The hash value generated by the metadata list
      }
    }
    ```

  If the account does not exist, the content returned is as follows:

    ```json
    {
       "error_code" : 4,//Error code, 4 indicates the account does not exist
       "result" : null
    }
    ```



### getAccountAssets

```http
HTTP GET /getAccountAssets?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3
```

- Function

  Return the asset information of the specified account.

- Parameters

    | Parameter         | Description     |
    | :----------- | ----------- |
    | address      | The account address, required|
    | code, issuer | The issuer represents the asset issuance account address, and code represents the asset code. Only the correct code&issuer can be filled in at the same time to display the specified asset correctly or all assets will be displayed by default |

- Return value

  The content returned is as follows:

    ```json
    {
      "error_code" : 0,//Error code, 0 indicates the account does not exist
        "result": [//If the result is not null, it indicates the asset is existed
          {
            "amount" : 1400,//The amount of assets owned
            "key" ://Asset identification, including asset code and issuer
            {
              "code" : "EES",//Asset code
              "issuer" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3" //The account address of the issuer
            }
          },
          {
            "amount" : 1000,
            "key" :
            {
              "code" : "OES",
              "issuer" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3"
            }
          }
        ]
    }
    ```

  If the account does not have an asset, the content returned is as follows:

    ```json
    {
       "error_code" : 0,//Error code, 0 indicates the account does not existed
       "result" : null　//Result is null, indicating that the asset does not exist
    }
    ```



### getAccountMetaData

```http
HTTP GET /getAccountMetaData?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3
```

- Function

  Return the metadata information of the specified account.

- Parameters

    |Parameter       | Description     |
    | :----------- | ----------- |
    | address      | The account address, required|
    | key      | Optional. Specify the key value in the metadata  |

- Return value

  The content returned is as follows:

    ```json
    {
      "error_code" : 0,//Error code, 0 indicates the account does not exist
        "result": {//Result is not null, indicating that metadata exists
            "123": {
                "key" : "123",
                "value" : "123_value",
                "version" : 1
            },
            "456": {
                "key" : "456",
                "value" : "456_value",
                "version" : 1
            },
            "abcd": {
                "key" : "abcd",
                "value" : "abcd_value",
                "version" : 1
            }
        }
    }
    ```

  If the account does not have metadata, return the content:

    ```json
    {
       "error_code" : 0,//Error code, 0 indicates the account does not exist
       "result" : null //Result is null, indicating that the metadata does not exist
    }
    ```



### getTransactionHistory

```http 
GET /getTransactionHistory?ledger_seq=6
```

- Function

  Return the completed transaction history.

- Parameters

    |Parameter       | Description                       |
    | :--------- | -------------------------- |
    | hash       | Query with the hash, the unique identifier of the transaction |
    | ledger_seq | Query all transactions in the specified block |

  > **Note**: The constraint generated by the above two parameters is a logical AND. If you specify two parameters at the same time, the system will query the specified transaction in the specified block.

- Return value

  The content returned is as follows:

  > **Note**: There are two transactions below, and the 2nd transaction is a transaction to create a contract account. Please note the contents of the **error_desc** field.

    ```json
    {
        "error_code": 0,//Error code, o indicates the transaction is exited
        "result": {
            "total_count": 2,//The number of transactions queried
            "transactions": [{//The transaction list
                "actual_fee": 313000,//The actual fee for the transaction
                "close_time": 1524031260097214,//When the transaction is completed
                "error_code": 0,// The error code of the transaction, 0 means the transaction is executed successfully, and non-zero means the transaction execution failed
                "error_desc": "",//Description for the error in the transaction
                "hash": "89a9d6e5d2c0e2b5c4fe58045ab2236d12e9449ef232342a48a2e2628e12014d",//The hash value of the transaction
                "ledger_seq": 6,//The block height of the transaction
                "signatures": [{//The signature list
                    "public_key": "b00180c2007082d1e2519a0f2d08fd65ba607fe3b8be646192a2f18a5fa0bee8f7a810d011ed",//Public key
                    "sign_data": "27866d70a58fc527b1ff1b4a693b8034b0078fc7ac7591fb05679abe5ca660db5c372922bfa8f26e76511e2c33386306ded7593874a6aec5baeeaddbd2012f06"//Data signed
                }],
                "transaction": {//Transaction content
                    "fee_limit": 10000000000,//The maximum fee provided for this transaction, in MO
                    "gas_price": 1000,//The price of gas, in MO
                    "nonce": 1,//The sequence number of the transaction in the account
                    "operations": [{//The operation list
                        "create_account": {//The operation to create an account
                            "dest_address": "buQBAfoMfXZVPpg9DaabMmM2EwUnfoVsTSVV",//The address of the target account
                            "init_balance": 10000000,//The initial BUs of the target account, in MO
                            "priv": {//The privilege of the target account
                                "master_weight": 1,//The weight of the target account
                                "thresholds": {
                                    "tx_threshold": 1 //The weight required to initiate a transaction for the target account
                                }
                            }
                        },
                        "type": 1 //The type of the operation, 1 means the operation is to create an account
                    },
                    {
                        "create_account": {
                            "dest_address": "buQj8UyKbN3myVSerLDVXVXH47vWXfqtxKLm",
                            "init_balance": 10000000,
                            "priv": {
                                "master_weight": 1,
                                "thresholds": {
                                    "tx_threshold": 1
                                }
                            }
                        },
                        "type": 1
                    }],
                    "source_address": "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3" //The account address to initiate the transaction
                },
                "tx_size": 313 //The transaction byte
            },
            {
                "actual_fee": 1000402000,//The actual fee for the transaction
                "close_time": 1524031260097214,//When the transaction is completed
                "error_code": 0,// The error code of the transaction, 0 means the transaction is executed successfully, and non-zero means the transaction execution failed
                "error_desc": "[{\"contract_address\":\"buQfFcsf1NUGY1o25sp8mQuaP6W8jahwZPmX\",\"operation_index\":0}]", //The result of contract creation, including contract address and operation index values
                "hash": "4cbf50e03645f1075d7e5c450ced93e26e3153cf7b88ea8003b2fda39e618e64",//The hash value of the transaction
                "ledger_seq": 6,//The block height of the transaction
                "signatures": [{//The signature list
                    "public_key": "b00180c2007082d1e2519a0f2d08fd65ba607fe3b8be646192a2f18a5fa0bee8f7a810d011ed",//Public key
                    "sign_data": "87fdcad0d706479e1a3f75fac2238763cd15fd93f81f1b8889fb798cefbe1752c192bbd3b5da6ebdb31ae47d8b62bb1166dcceca8d96020708f3ac5434838604" //Data signed
                }],
                "transaction": {//Transaction content
                    "fee_limit": 20004420000,//The maximum fee for this transaction
                    "gas_price": 1000,//The price of gas
                    "nonce": 30,//The sequence number of the transaction in the account
                    "operations": [{//The operation list
                        "create_account": {//The operation to create an account
                            "contract": {//Contract
                                "payload": "'use strict';\n\t\t\t\t\tfunction init(bar)\n\t\t\t\t\t{\n\t\t\t\t\t  return;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\tfunction main(input)\n\t\t\t\t\t{\n\t\t\t\t\t  return;\n\t\t\t\t\t}\n\t\t     function query()\n\t\t\t\t\t{\n\t\t\t\t\t  return;\n\t\t\t\t\t}\n\t\t      \n\t\t          "　//Contract code
                            },
                            "init_balance": 10000000,//The initial BUs of the contract account, in MO
                            "priv": {//The privilege of the contract account
                                "thresholds": {
                                    "tx_threshold": 1 //The weight required to initiate a contract account transaction
                                }
                            }
                        },
                        "type": 1 // The operation type, 1 indicates the operation to create an account
                    }],
                    "source_address": "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3" //The account address to initiate the transaction
                },
                "tx_size": 402 //The transaction byte
            }]
        }
    }
    ```

  If no transaction is found, return the following content:

    ```json
    {
      "error_code": 4,//Error code, 4 indicates no transaction
      "result":
      {
        "total_count": 0,//The number of transactions queried
        "transactions": []
      }
    }
    ```



### getTransactionCache

```http
GET /getTransactionCache?hash=ad545bfc26c440e324076fbbe1d8affbd8a2277858dc35927d425d0fe644e698&limit=100
```

- Function

  Return a transaction that is submitted successfully but not yet executed.

- Parameters

    | Parameter     | Description                     |
    | :--------- | ------------------------ |
    | hash       | Query with the hash, the unique identifier of the transaction |
    | limit      | Query N transactions being processed in the transaction queue |

  > **Note**: The constraint generated by the above two parameters is a logical OR. If you specify two parameters at the same time, the system will hash the query.

- Return value

  The content returned is as follows:

    ```json
    {
        "error_code": 0,//Error code, 0 indicates the query is successful
        "result": {
            "total_count": 1,//The total transactions
            "transactions": [//The transaction list
                {
                    "hash": "a336c8f4b49c8b2c5a6c68543368ed3b450b6138a9f878892cf982ffb6fe234e",//The transaction hash
                    "incoming_time": 1521013029435154,//When the transaction enters the cache queue
                    "signatures": [//The signature list
                        {
                            "public_key": "b001882b9d1b5e7019f163d001c85194cface61e294483710f5e66ef40a4d387f5fcb0166f4f",//Public key
                            "sign_data": "c5885144ffccb0b434b494271258e846c30a4551036e483822ee2b57400576e9e700e8960eb424764d033a2e73af6e6a2bfa5da390f71161732e13beee206107" //Data signed
                        }
                    ],
                    "status": "processing",//The transaction status
                    "transaction": {//Transaction content
                        "fee_limit": 100000,//The maximum fee provided for this transaction, in MO
                        "gas_price": 1000,//The price of gas, in MO
                        "nonce": 2,//The sequence number of the transaction in the account
                        "operations": [//The operation list
                            {
                                "create_account": {//The operation to create an account
                                    "dest_address": "buQWufKdVicxRAqmQs6m1Z9QuFZG2W7LMsi2",//The address of the target account
                                    "init_balance": 300000,//The initial BUs of the target account, in MO
                                    "priv": {//The privilege of the target account
                                        "master_weight": 1,//The weight of the target account
                                        "thresholds": {
                                            "tx_threshold": 2 //The weight required to initiate a transaction for the target account
                                        }
                                    }
                                },
                                "type": 1　// The operation type, 1 indicates the operation to create an account
                            }
                        ],
                        "source_address": "buQBDf23WtBBC8GySAZHsoBMVGeENWzSRYqB"// The account address to initiate the transaction
                    }
                }
            ]
        }
    }
    ```

  If no transaction is found, return the following content:

    ```json
    {
      "error_code": 4,//Error code, 4 indicates no transaction is queried
      "result":
      {
        "total_count": 0,//The number of transactions queried
        "transactions": []
      }
    }
    ```



### getLedger

```http
GET /getLedger?seq=xxxx&with_validator=true&with_consvalue=true&with_fee=true&with_block_reward=true
```

- Function

  Return information about block header.

- Parameters

    | Parameter         | Description                                      |
    | :------------- | ----------- |
    | seq            | The serial number of the ledger. If not filled, return the current ledger |
    | with_validator | By default is false and the list of verification nodes is not displayed      |
    | with_consvalue | The default is false, and no consensus value is displayed           |
    | with_fee       | The default is false, and the cost configuration is not displayed         |
    | with_block_reward | The default is false, and no block rewards and verification node rewards are displayed         |

- Return value

  Return the content as follows:

    ```json
    {
       "error_code" : 0,//Error code, 0 indicates success
       "result" : {
          "block_reward" : 800000000,//Block reward, in MO
          "consensus_value" : {//Consensus content
             "close_time" : 1524031260097214,//When the consensus is finished
             "ledger_seq" : 6,//The block height
             "previous_ledger_hash" : "ef329c7ed761e3065ab08f9e7672fd5f4e3ddd77b0be35598979aff8c21ada9b",//The hash of the previous block
             "previous_proof" : "0ac1010a2c080110022a26080310052220432dde2fd32a2a66da77647231821c87958f56c303bd08003633952d384eb0b61290010a4c623030316435363833363735303137666662633332366538666232303738653532316566383435373234363236353339356536383934633835323434656566643262666130386635393862661240deeb9b782410f0f86d897006cac8ad152e56e4f914e5d718706de84044ef98baef25512a337865772641d57090b5c77e9e2149dbd41910e8d6cd85c3387ea708",//The certificate of the previous block 
             "previous_proof_plain" : {//The content of the previous block certificate
                "commits" : [
                   {
                      "pbft" : {
                         "commit" : {
                            "sequence" : 5,//The serial number of the block
                            "value_digest" : "432dde2fd32a2a66da77647231821c87958f56c303bd08003633952d384eb0b6",//Summary
                            "view_number" : 3 //The serial number of the view
                         },
                         "round_number" : 1,
                         "type" : 2 //Type
                      },
                      "signature" : {//The signature of the node
                         "public_key" : "b001d5683675017ffbc326e8fb2078e521ef8457246265395e6894c85244eefd2bfa08f598bf",//Public key
                         "sign_data" : "deeb9b782410f0f86d897006cac8ad152e56e4f914e5d718706de84044ef98baef25512a337865772641d57090b5c77e9e2149dbd41910e8d6cd85c3387ea708"　//Data signed
                      }
                   }
                ]
             },
             "txset" : {//Transaction set
                "txs" : [//The transaction list
                   {
                      "signatures" : [//The signature list
                         {
                            "public_key" : "b00180c2007082d1e2519a0f2d08fd65ba607fe3b8be646192a2f18a5fa0bee8f7a810d011ed",//Public key
                            "sign_data" : "27866d70a58fc527b1ff1b4a693b8034b0078fc7ac7591fb05679abe5ca660db5c372922bfa8f26e76511e2c33386306ded7593874a6aec5baeeaddbd2012f06" //Data signed
                         }
                      ],
                      "transaction" : {//Transaction content
                         "fee_limit" : 10000000000,//The maximum fee provided for this transaction, in MO
                         "gas_price" : 1000,//The price of gas, in MO
                         "nonce" : 1,//The sequence number of the transaction in the account
                         "operations" : [//The operation list
                            {
                               "create_account" : {//The operation to create an account
                                  "dest_address" : "buQBAfoMfXZVPpg9DaabMmM2EwUnfoVsTSVV",//The target account
                                  "init_balance" : 10000000,//The initial BUs of the target account, in MO
                                  "priv" : {//The privilege of the target account
                                     "master_weight" : 1,//The weight owned by the target account
                                     "thresholds" : {
                                        "tx_threshold" : 1 //The weight required to initiate a transaction for the target account
                                     }
                                  }
                               },
                               "type" : 1 //The operation type, 1 indicates the operation is to create an account
                            },
                            {
                               "create_account" : {
                                  "dest_address" : "buQj8UyKbN3myVSerLDVXVXH47vWXfqtxKLm",
                                  "init_balance" : 10000000,
                                  "priv" : {
                                     "master_weight" : 1,
                                     "thresholds" : {
                                        "tx_threshold" : 1
                                     }
                                  }
                               },
                               "type" : 1
                            }
                         ],
                         "source_address" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3"
                      }
                   },
                   {
                      "signatures" : [
                         {
                            "public_key" : "b00180c2007082d1e2519a0f2d08fd65ba607fe3b8be646192a2f18a5fa0bee8f7a810d011ed",
                            "sign_data" : "fb7d9d87f4c9140b6e19a199091c6871e2380ad8e8a8fcada9b42a2911057111dc796d731f3f887e600aa89cc8692300f980723298a93b91db711155670d3e0d"
                         }
                      ],
                      "transaction" : {
                         "fee_limit" : 10000000000,
                         "gas_price" : 1000,
                         "nonce" : 2,
                         "operations" : [
                            {
                               "create_account" : {
                                  "dest_address" : "buQntAvayDWkAhPh6CSrTWbiEniAL2ys5m2p",
                                  "init_balance" : 10000000,
                                  "priv" : {
                                     "master_weight" : 1,
                                     "thresholds" : {
                                        "tx_threshold" : 1
                                     }
                                  }
                               },
                               "type" : 1
                            },
                            {
                               "create_account" : {
                                  "dest_address" : "buQX5X9y59zbmqyFgFPQPcyUPcPnvwsLatsq",
                                  "init_balance" : 10000000,
                                  "priv" : {
                                     "master_weight" : 1,
                                     "thresholds" : {
                                        "tx_threshold" : 1
                                     }
                                  }
                               },
                               "type" : 1
                            }
                         ],
                         "source_address" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3"
                      }
                   }
                ]
             }
          },
          "fees" : {//The fee standard of blocks
             "base_reserve" : 10000000,//The minimum BU in the account, in MO
             "gas_price" : 1000 //The price of gas, in MO
          },
          "header" : {//The block header
             "account_tree_hash" : "6aca37dfe83f213942b21d02618b989619cfd7c0e67a8a14b0f7599dd4010aad",//The hash value of the account tree
             "close_time" : 1524031260097214,//When the block is generated
             "consensus_value_hash" : "14a65d69f619395135da2ff98281d5707494801f12184a4318b9a76383e651a8",//The hash value of onsensus content
             "fees_hash" : "916daa78d264b3e2d9cff8aac84c943a834f49a62b7354d4fa228dab65515313",//The hash value of the fee standard
             "hash" : "2cf378b326ab0026625c8d036813aef89a0b383e75055b80cb7cc25a657a9c5d",//The hash value of the block
             "previous_hash" : "ef329c7ed761e3065ab08f9e7672fd5f4e3ddd77b0be35598979aff8c21ada9b",//The hash value of the previous block
             "seq" : 6,//The block height
             "tx_count" : 2,//The total transactions
             "validators_hash" : "d857aa40ecdb123415f893159321eb223e4dbc11863daef86f35565dd1633316",//The hash value of the validation node list
             "version" : 1000 //The block version
          },
          "validators" : [//The validation node list
             {
                "address" : "buQhmPKU1xTyC3n7zJ8zLQXtuDJmM2zTrJey" //The address of the validation node
          ],
          "validators_reward" : {//The reward of the validation node
             "buQhmPKU1xTyC3n7zJ8zLQXtuDJmM2zTrJey" : 800000000 //The reward of the validation node
          }
       }
    }
    ```

  Return the following content if no ledger is queried:

    ``` json
    {
       "error_code" : 4,
       "result" : null
    }
    ```



### getTransactionBlob

```http
POST /getTransactionBlob
```

- Function

  Return the transaction hash and the hexadecimal string after the transaction is serialized.

- The body is in json format

  Here body transfer is the transaction data. For specific json format and parameters, see [Transactions](#transactions).

- Return value

    ```json
    {
        "error_code": 0,//The serialized transaction error code
        "error_desc": "",//Description for the error
        "result": {
            "hash": "8e97ab885685d68b8fa8c7682f77ce17a85f1b4f6c8438eda8ec955890919405",//The transaction hash
            "transaction_blob": "0a2e61303032643833343562383964633334613537353734656234393736333566663132356133373939666537376236100122b90108012ab4010a2e61303032663836366337663431356537313934613932363131386363353565346365393939656232396231363461123a123866756e6374696f6e206d61696e28696e707574537472297b0a202f2ae8bf99e698afe59088e7baa6e585a5e58fa3e587bde695b02a2f207d1a06080a1a020807223e0a0568656c6c6f1235e8bf99e698afe5889be5bbbae8b4a6e58fb7e79a84e8bf87e7a88be4b8ade8aebee7bdaee79a84e4b880e4b8aa6d65746164617461" //The hexadecimal representation after serializing the transaction
        }
    }
    ```



### submitTransaction

```http 
POST /submitTransaction
```

- Function

  Send the serialized transaction and signature list to the blockchain.

- The body is in json format

    ```json
    {
      "items" : [{//The transaction package list
          "transaction_blob" : "0a2e61303032643833343562383964633334613537353734656234393736333566663132356133373939666537376236100122b90108012ab4010a2e61303032663836366337663431356537313934613932363131386363353565346365393939656232396231363461123a123866756e6374696f6e206d61696e28696e707574537472297b0a202f2ae8bf99e698afe59088e7baa6e585a5e58fa3e587bde695b02a2f207d1a06080a1a020807223e0a0568656c6c6f1235e8bf99e698afe5889be5bbbae8b4a6e58fb7e79a84e8bf87e7a88be4b8ade8aebee7bdaee79a84e4b880e4b8aa6d65746164617461",//The hexadecimal representation after serializing the transaction
          "signatures" : [{//The first signature
              "sign_data" : "2f6612eaefbdadbe792201bb5d1e178aff118dfa0a640edb2a8ee91933efb97c4fb7f97be75195e529609a4de9b890b743124970d6bd7072b7029cfe7683ba2d",//Data signed
              "public_key" : "b00204e1c7dddc36d3153adcaa451b0ab525d3def48a0a10fdb492dc3a7263cfb88e80ee974ca4da0e1f322aa84ff9d11340c764ea756ad148e979c121619e9fe52e9054"//Public key
            }, {//The second signature
              "sign_data" : "90C1CD2CD371F581EB8EACDA295C390D62C19FE7F080FB981584FB5F0BAB3E293B613C827CB1B2E063E5783FFD7425E1DEC0E70F17C1227FBA5997A72865A30A",//Data signed
              "public_key" : "b00168eceea7900ddcb8f694161755f98590ba7944de3bfe339610fe0cacc10a18372dcbf71b"//Public key
            }
          ]
        }
      ]
    }
    ```

- Keyword in json

    | Parameter             | Type   | Description                                                         |
    | :--------------- | ------ | ------------------------------------------------------------ |
    | transaction_blob | string | The hexadecimal format after the transaction is serialized                                 |
    | sign_data        | string | Data signed, in hexadecimal format. Its value is the signature data obtained by signing (transaction) the transaction_blob. **Note**: when signing, you must first convert `transaction_blob` into byte stream and then sign, and do not directly sign hexadecimal string |
    | public_key       | string | The public key, in hexadecimal format                                        |

- Return value

  > **Note**: The transaction is submitted and executed successfully.

    ```json
    {
        "error_code": 0,//The result of the submission
        "error_desc": "",//Description for the error
        "result": {
            "hash": "8e97ab885685d68b8fa8c7682f77ce17a85f1b4f6c8438eda8ec955890919405",//The transaction hash
        }
    }
    ```



### callContract

```http 
POST /callContract
```

- Function

  In the design of the smart contract module, we provide a sandbox environment for debugging contracts, and the state of the blockchain and contract is not changed during debugging. On BuChain, we provide you with the `callContract` interface to help you debug the smart contract. The smart contract can be stored in the public chain, or it can be tested by uploading the local contract code by parameters. The `callContract` interface will not be sent. Therefore, there is no need to pay for the transaction fee.

- The body is in json format

    ```json
    {
      "contract_address" : "",//Optional, the smart contract address
      "code" : "\"use strict\";log(undefined);function query() { return 1; }",//Optional, the smart contract code
      "input" : "{}",//Optional, pass parameters to the contract to be called
      "contract_balance" : "100009000000",//The initial BU balance assigned to the contract
      "fee_limit" : 100000000000000000,//The transaction fee
      "gas_price": 1000,//Optional, the gas price
      "opt_type" : 2,//Optional, the operation type
      "source_address" : "" //Optional, the original address of the simulated contract call
    }
    ```

- Keywords in json

    | Keyword           | Type   | Description                                                         |
    | ---------------- | ------ | ------------------------------------------------------------ |
    | contract_address | string | The smart contract address that is called, or an error is returned if it is not quired from the database. If you left it blank, the content of the **code** field is read by default. |
    | code             | string | The contract code to be debugged, if the `contract_address` is empty, the **code** field is used, and if the **code** field is also empty, an error is returned |
    | input            | string | Pass the parameters to the contract to be called                                        |
    | contract_balance | string | The initial BU balance assigned to the contract                                 |
    | fee_limit        | int64  | The transaction fee                                                     |
    | gas_price        | int64  | The price of gas                                                   |
    | opt_type         | int    | 0: call the contract's read-write interface `init`, 1: call the contract's read-write interface `main`, 2: call the read-only interface `query` |
    | source_address   | string | Simulate the original address of the contract called                                      |

- Return value

    ```json
      {
       "error_code" : 0,//The result of the call, 0 means success
       "error_desc" : "",//Description of error code
       "result" : {
          "logs" : {
             "0-buQVkReBYUPUYHBinVDrrb9FQRpo49b9YRXq" : null　//Not used any more
          },
          "query_rets" : [
             {
                "result" : {
                   "type" : "bool", //　Return the name of the variable
                   "value" : false  // The value of the variable is false
                }
             }
          ],
          "stat" : {
             "apply_time" : 6315,//Execution time
             "memory_usage" : 886176,//Memory usage
             "stack_usage": 2564,//Stack usage
             "step" : 3 //Frequency of execution
          },
          "txs" : null　//Transaction set
       }
    }
    ```



### testTransaction

```http
   POST /testTransaction
```

- Function

  The evaluation fee does not change the evaluation based on the account balance. The original account and the target account involved in the transaction must exist in the system, but the target address for creating the account does not have to be in the system.

- The body is in json format

    ```json
    {
      "items": [
        {
          "transaction_json": {
            "source_address": "buQBDf23WtBBC8GySAZHsoBMVGeENWzSRYqB", //The original address of the simulated transaction
            "metadata":"0123456789abcdef", //Optional, additional information
            "nonce": 6,//The serial number of transaction in the account
            "operations":[//The operation list
            {
            //Fill in according to specific operations
            },
            {
            //Fill in according to specific operations
            }
            ......
          },
          "signature_number":1 //Optional, the number of signatures
        }
      ]
    }
    ```

- Keywords in json

    | Keyword           | Type   | Description                                                         |
    | ---------------- | ------ | ------------------------------------------------------------ |
    | source_address   | string | The original address of the simulated transaction                                         |
    | nonce            | int64  | Add 1 based on the original account number                                        |
    | signature_number | int64  | The number of signatures, the default is 1; the system will be set to 1 if not filled                   |
    | metadata         | string | Optional, the number of signatures                                          |
    | operations       | array  | Operation list. The payload of this transaction, which is what the transaction wants to do. See [Operations](#operations) for details |

- Return value

    ```json
    {
        "error_code": 0,
        "error_desc": "",
        "result": {
            "hash": "7f0d9de23d6d8f2964a1efe4a458e02e43e47f60f3c22bb132b676c54a44ba04",
            "logs": null,
            "query_rets": null,
            "stat": null,
            "txs": [
                {
                    "actual_fee": 264,
                    "gas": 264,
                    "transaction_env": {
                        "transaction": {
                            "fee_limit": 99999999700110000,
                            "gas_price": 1,
                            "nonce": 1,
                            "operations": [
                                {
                                    "pay_coin": {
                                        "amount": 299890000,
                                        "dest_address": "buQkBDTfe4tx2Knw9NDKyntVmsYvYtHmAiE7"
                                    },
                                    "type": 7
                                }
                            ],
                            "source_address": "buQBDf23WtBBC8GySAZHsoBMVGeENWzSRYqB"
                        }
                    }
                }
            ]
        }
    }
    ```



## Example

Next, we use `buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV` to initiate a transaction. This transaction has only one operation, that is, creating a new account `buQts6DfT5KavtV94JgZy75H9piwmb7KoUWg`, and completing the account creation process by transferring BUs to the new account.

### Assembling Transactions

Referring to the structure of [Transactions](#transactions), the following three steps are required:

1. [ Obtaining the account nonce value](#obtaining-the-account-nonce-value)

2. [Assembling operations](#assembling-operations)

3. [Generating transaction objects](#generating-transaction-objects)



#### Obtaining the Account Nonce Value

In the structure of the transaction, it is necessary to confirm the serial number of the transaction in the transaction initiation account. Therefore, it is necessary to obtain the nonce value of the transaction initiation account through the [getAccountBase](#getaccountbase ) interface, and increase the nonce value by 1 based on its nonce value. 

The interface call is as follows:

```http 
HTTP GET /getAccountBase?address=buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV
```

The following content is returned:

```json
{
   "error_code" : 0,
   "result" : {
      "address" : "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
      "assets_hash" : "ad67d57ae19de8068dbcd47282146bd553fe9f684c57c8c114453863ee41abc3",
      "balance" : 96545066100,
      "metadatas_hash" : "ad67d57ae19de8068dbcd47282146bd553fe9f684c57c8c114453863ee41abc3",
      "nonce" : 20,
      "priv" : {
         "master_weight" : 1,
         "thresholds" : {
            "tx_threshold" : 1
         }
      }
   }
}
```



#### Assembling Operations

According to the structure of [Operations](#operations), [Operation Codes](#operation-codes), and [Transferring BU Assets](#transferring-bu-assets) structure, the json format of the generation operation is as follows:

```json
{
    "type": 7,
    "pay_coin": {
        "dest_address": "buQts6DfT5KavtV94JgZy75H9piwmb7KoUWg",
        "amount": 10000000,
        "input": ""
    }
}
```



#### Generating Transaction Objects

In [Obtaining the Account Nonce Value](#obtaining-the-account-nonce-value), the nonce value is *20*, then the serial number of the new transaction is *21*. According to the operation structure obtained in the [Assembling Operations](#assembling-operations), the json format of the transaction is generated as follows:

```json
{
    "source_address": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
    "nonce": 21,
    "fee_limit":1000000,
    "gas_price":1000,
    "operations": [{
        "type": 7,
        "pay_coin": {
            "dest_address": "buQts6DfT5KavtV94JgZy75H9piwmb7KoUWg",
            "amount": 10000000,
            "input": ""
        }
    }]
}
```



### Serializing Transaction Data

This is done through the [getTransactionBlob](#gettransactionblob) interface.

The interface call is as follows:

```http
POST getTransactionBlob
```

Return the following content:

```json
{
    "error_code": 0,
    "error_desc": "",
    "result": {
        "hash": "3f90865062d7737904ea929cbde7c45e831e4972cf582b69a0198781c452e9e1",
        "transaction_blob": "0a246275516f50326552796d4163556d33757657675138526e6a7472536e58425866417a7356101518c0843d20e8073a2f0807522b0a24627551747336446654354b6176745639344a675a79373548397069776d62374b6f5557671080ade204"
    }
}
```



### Signing Signatures

Signing signatures is to sign the value of `transaction_blob` in [getTransactionBlob](#gettransactionblob) with the private key of `buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV` and generate a public key. For details, please refer to [keypair](../keypair_guide). 
 The resulting signature data is as follows:

```json
［{
    "sign_data": "ACF64A7D41244AFC4465DBC225D616E0499776140D46BA7A84B1B6B263DAF1422904137E0181301F480F7114EC7CC5BBE4763EDA981E565EF81EF7705596CB0B",
    "public_key": "b00168eceea7900ddcb8f694161755f98590ba7944de3bfe339610fe0cacc10a18372dcbf71b"
}］
```



### Submitting Transaction Data

 According to the signature data obtained by the [`transaction_blob` and [signature] (#signature) obtained by [getTransactionBlob](#gettransactionblob), the json format of the body in the [submitTransaction](#submittransaction) interface is generated as follows:

```json
{
    "items" : [{
        "transaction_blob" : "0a246275516f50326552796d4163556d33757657675138526e6a7472536e58425866417a7356101518c0843d20e8073a2f0807522b0a24627551747336446654354b6176745639344a675a79373548397069776d62374b6f5557671080ade204",
        "signatures" : [{
            "sign_data" : "ACF64A7D41244AFC4465DBC225D616E0499776140D46BA7A84B1B6B263DAF1422904137E0181301F480F7114EC7CC5BBE4763EDA981E565EF81EF7705596CB0B",
            "public_key" : "b00168eceea7900ddcb8f694161755f98590ba7944de3bfe339610fe0cacc10a18372dcbf71b"
        }]
    }]
}
```

The interface call is as follows:

```http 
POST /submitTransaction
```

Return the following content:

```json
{
    "results": [
        {
            "error_code": 0,
            "error_desc": "",
            "hash": "3f90865062d7737904ea929cbde7c45e831e4972cf582b69a0198781c452e9e1"
        }
    ],
    "success_count": 1
}
```



### Querying the Transaction Result

According to the hash obtained by the [submitTransaction](#submittransaction) interface, confirm whether the transaction is executed successfully by the [getTransactionHistory](#gettransactionhistory) interface (check whether `error_code` under `transactions` is equal to 0).

The interface call is as follows:

```http 
GET /getTransactionHistory?hash=3f90865062d7737904ea929cbde7c45e831e4972cf582b69a0198781c452e9e1
```

Return the following result:

```json
{
    "error_code": 0,//The transaction is queried
    "result": {
        "total_count": 1,
        "transactions": [
            {
                "actual_fee": 245000,
                "close_time": 1552125554325904,
                "error_code": 0,//The transaction is executed successfully
                "error_desc": "",
                "hash": "3f90865062d7737904ea929cbde7c45e831e4972cf582b69a0198781c452e9e1",
                "ledger_seq": 2688046,
                "signatures": [
                    {
                        "public_key": "b00168eceea7900ddcb8f694161755f98590ba7944de3bfe339610fe0cacc10a18372dcbf71b",
                        "sign_data": "acf64a7d41244afc4465dbc225d616e0499776140d46ba7a84b1b6b263daf1422904137e0181301f480f7114ec7cc5bbe4763eda981e565ef81ef7705596cb0b"
                    }
                ],
                "transaction": {
                    "fee_limit": 1000000,
                    "gas_price": 1000,
                    "nonce": 21,
                    "operations": [
                        {
                            "pay_coin": {
                                "amount": 10000000,
                                "dest_address": "buQts6DfT5KavtV94JgZy75H9piwmb7KoUWg"
                            },
                            "type": 7
                        }
                    ],
                    "source_address": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV"
                },
                "tx_size": 245
            }
        ]
    }
}
```



## Error Codes

  The error code is composed of two parts:

- error_code : Error code, approximate error classification

- error_desc : Error Description, which can accurately find the error specific information from the error description

The error list is as follows:

| Error code | Name     | Description        |
| ---------------- | -------- | ------- |
| 0                 | ERRCODE_SUCCESS                        | Successful operation                                                                                    |
| 1                 | ERRCODE_INTERNAL_ERROR                 | Inner service defect                                                                               |
| 2                 | ERRCODE_INVALID_PARAMETER              | Parameters error                                                                                     |
| 3                 | ERRCODE_ALREADY_EXIST                  | Objects already exist, such as repeated transactions submitted                                                                 |
| 4                 | ERRCODE_NOT_EXIST                      | Objects do not exist, such as null account, transactions and blocks etc                                                       |
| 5                 | ERRCODE_TX_TIMEOUT                     | Transactions expired. It means the transaction has been removed from the buffer, but it still has probability to be executed      |
| 7 | ERRCODE_MATH_OVERFLOW | Math calculation is overflown |
| 20 | ERRCODE_EXPR_CONDITION_RESULT_FALSE | The expression returns false. It means the TX failed to be executed currently, but it still has probability to be executed in the following blocks|
| 21 | ERRCODE_EXPR_CONDITION_SYNTAX_ERROR | The syntax of the expression returns is false. It means that the TX must fail |
| 90 | ERRCODE_INVALID_PUBKEY | Invalid public key |
| 91 | ERRCODE_INVALID_PRIKEY | Invalid private key |
| 92 | ERRCODE_ASSET_INVALID | Invalid assets |
| 93 | ERRCODE_INVALID_SIGNATURE | The weight of the signature does not match the threshold of the operation |
| 94 | ERRCODE_INVALID_ADDRESS | Invalid address |
| 97 | ERRCODE_MISSING_OPERATIONS | Absent operation of TX |
| 98 | ERRCODE_TOO_MANY_OPERATIONS | Over 100 operations in a single transaction |
| 99 | ERRCODE_BAD_SEQUENCE | Invalid sequence or nonce of TX |
| 100 | ERRCODE_ACCOUNT_LOW_RESERVE | Low reserve in the account |
| 101 | ERRCODE_ACCOUNT_SOURCEDEST_EQUAL | Sender and receiver accounts are the same |
| 102 | ERRCODE_ACCOUNT_DEST_EXIST | The target account already exists |
| 103 | ERRCODE_ACCOUNT_NOT_EXIST | Accounts do not exist |
| 104 | ERRCODE_ACCOUNT_ASSET_LOW_RESERVE | Low reserve in the account |
| 105 | ERRCODE_ACCOUNT_ASSET_AMOUNT_TOO_LARGE | Amount of assets exceeds the limitation ( int64 ) |
| 106 | ERRCODE_ACCOUNT_INIT_LOW_RESERVE | Insufficient initial reserve for account creation |
| 111 | ERRCODE_FEE_NOT_ENOUGH | Low transaction fee |
| 114 | ERRCODE_OUT_OF_TXCACHE | 	TX buffer is full |
| 120 | ERRCODE_WEIGHT_NOT_VALID | Invalid weight |
| 121 | ERRCODE_THRESHOLD_NOT_VALID | Invalid threshold |
| 144 | ERRCODE_INVALID_DATAVERSION | Invalid data version of metadata|
| 146 | ERRCODE_TX_SIZE_TOO_BIG | TX exceeds upper limitation |
| 151 | ERRCODE_CONTRACT_EXECUTE_FAIL | Failure in contract execution |
| 152 | ERRCODE_CONTRACT_SYNTAX_ERROR | Failure in syntax analysis |
| 153 | ERRCODE_CONTRACT_TOO_MANY_RECURSION |  The depth of contract recursion exceeds upper limitation |
| 154 | ERRCODE_CONTRACT_TOO_MANY_TRANSACTIONS |the TX submitted from the  contract exceeds upper limitation |
| 155 | ERRCODE_CONTRACT_EXECUTE_EXPIRED |	Contract expired |
| 160 | ERRCODE_TX_INSERT_QUEUE_FAIL | Failed to insert the TX into buffer |