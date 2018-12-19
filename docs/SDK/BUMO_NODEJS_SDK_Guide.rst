BUMO NODEJS SDK Guide
======================

Overview
---------

This document details the common interfaces of BUMO SDK in ``NODEJS``, making
it easier for developers to write data to BuChain and query data from it.

Terminology
-----------

This section gives details about the terms used in this document.

**Operating BuChain** 

Operating BuChain refers to writing data to or modifying data on BuChain.

**Broadcasting Transactions**

Broadcasting Transactions refers to sending transactions to BuChain to trigger execution of the transactions.

**Querying BuChain** 

Querying BuChain refers to querying data on BuChain.

**Account Services** 

Account Services provide account-related validity check interfaces and query interfaces.

**Asset Services** 

Asset Services provide asset-related query interfaces.


**Transaction Services**

Transaction Services provide interfaces to write data to or query BuChain.

**Block Services** 

Block Services provide interfaces to query the block.

**Account Nonce Value** 

Account Nonce Value is used to identify the order in which the
transactions are executed. Each account maintains a **nonce** value.

Format of Request Parameters and Response Data
-----------------------------------------------

This section details the format of the request parameters and the response data.

Request Parameters
~~~~~~~~~~~~~~~~~~~

To ensure the precision of numbers, the numbers in the request parameters are treated as strings. 
For example, **amount=500** will be changed to **amount='500'** when processed.

Response Data
~~~~~~~~~~~~~~~~


The response data of the interfaces are ``JavaScript`` object, and the following is the structure of the response data.

::


 {
	errorCode: 0,
	errorDesc: '',
	result: {}
 }

.. note:: 
          - errorCode: error code. 0 means no error, and the number greater than 0 means there is an error.

          - errorDesc: error description. Null means no error, otherwise there is an error. 

          - result: the result. 


Since the structure of the response data is fixed, the response data mentioned in the subsequent description refers to the parameters of the result.


Usage
--------


This section describes the process of using BUMO SDK. First you have to generate the SDK instance and then call the interfaces of the corresponding service. 
The services include `account services`_, `asset services`_, `contract services`_, `transaction services`_ and `block services`_. 
Interfaces are classified into public-private key address interfaces, validity check interfaces, query interfaces and transaction-related interfaces.


Installing SDK
~~~~~~~~~~~~~~

Install BUMO SDK before using it:

::

 npm install bumo-sdk --save


Generating SDK Instances
~~~~~~~~~~~~~~~~~~~~~~~~~~


When generating SDK instances, the input parameter is an **options** object, and the **options** object includes the following parameter:

+--------------+------------+----------------------------------+ 
|  Parameter   |     Type   |      Description                 |         
+--------------+------------+----------------------------------+ 
|  host        |     String |      Ip address:port             |      
+--------------+------------+----------------------------------+    


The example is as follows:

::
 
 const BumoSDK = require('bumo-sdk');

 const options = {
  host: 'seed1.bumotest.io:26002',
 };

 const sdk = new BumoSDK(options);

Querying Information
~~~~~~~~~~~~~~~~~~~~

The query interface is used to query data on BuChain, and data
query can be implemented by calling the corresponding
interface. For example, to query the account information, the specific
call is as follows:


::

 const address = 'buQemmMwmRQY1JkcU7w3nhruo%X5N3j6C29uo';

 sdk.account.getInfo(address).then(info=> {
  console.log(info);
 }).catch(err => {
  console.log(err.message);
 });


Submitting Transactions
~~~~~~~~~~~~~~~~~~~~~~~~

The process of submitting transactions consists of the following steps:

`1. Obtaining the Nonce Value of the Account`_

`2. Building Operations`_

`3. Building Transaction Blob`_

`4. Signing Transactions`_

`5. Broadcasting Transactions`_

1. Obtaining the Nonce Value of the Account
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


The developer can maintain the nonce value of each account, and
automatically increments it by 1 after submitting a
transaction, so that multiple transactions can be sent in a short time;
otherwise, the nonce value of the account must be incremented by 1 after the
execution of the previous transaction is completed. The interface call is as follows:

::

 const address = 'buQemmMwmRQY1JkcU7w3nhruo%X5N3j6C29uo';

 sdk.account.getNonce(address).then(info => {

  if (info.errorCode !== 0) {
    console.log(info);
    return;
  }

  const nonce = new BigNumber(info.result.nonce).plus(1).toString(10);
 });

 // In this example, big-number.js is used to increment ** nonce ** by 1, and a string will be returned.

2. Building Operations
^^^^^^^^^^^^^^^^^^^^^^



The operations refer to the actions operated in the
transaction. For example, to build an operation to send BU
(BUSendOperation), the interface call is as follows:

::

 const destAddress = 'buQWESXjdgXSFFajEZfkwi5H4fuAyTGgzkje';

 const info = sdk.operation.buSendOperation({
	destAddress,
	amount: '60000',
	metadata: '746573742073656e64206275',
 });

3. Building Transaction Blob
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


The building transaction blob interface is for generating transaction blob string. The interface call is as follows:

::

  let blobInfo = sdk.transaction.buildBlob({
    sourceAddress: 'buQnc3AGCo6ycWJCce516MDbPHKjK7ywwkuo',
    gasPrice: '3000',
    feeLimit: '1000',
    nonce: '102',
    operations: [ sendBuOperation ],
    metadata: '74657374206275696c6420626c6f62',
  });

  const blob = blobInfo.result;

.. note:: **nonce**, **gasPrice** and **feeLimit** are strings include only numbers, and they cannot start with 0.

4. Signing Transactions
^^^^^^^^^^^^^^^^^^^^^^^^^^^

The signing transaction interface is used by the transaction initiator
to sign the transaction using the private key of the account. The interface call is as follows:

::

   const signatureInfo = sdk.transaction.sign({
    privateKeys: [ privateKey ],
    blob,
  });

  const signature = signatureInfo.result;

5. Broadcasting Transactions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The broadcasting transaction interface is used to send transactions to BuChain and trigger the execution of the transactions.
The interface call is as follows:

::

   sdk.transaction.submit({
    blob,
    signature: signature,
  }).then(data => {
  	console.log(data);
  });

Account Services
----------------

Account services provide account-related interfaces, which include:``create``, ``checkValid``, ``getInfo-Account``, ``getNonce``, 
``getBalance``, ``getAssets`` and ``GetMetadata``.

create
~~~~~~

The ``create`` interface is used to generate private keys.

The method to call this interface is as follows:

::

 sdk.account.create()

The response data is described in the following table:

+--------------+-----------+--------------+
|  Parameter   |    Type   |  Description |
+--------------+-----------+--------------+
|  privateKey  |    String |  Private key | 
+--------------+-----------+--------------+
|  publicKey   |    String |  Public key  |
+--------------+-----------+--------------+
|  address     |    String |  Address     |
+--------------+-----------+--------------+  

The example is as follows:

::

 sdk.account.create().then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });


checkValid
~~~~~~~~~~


The ``checkValid`` interface is used to check the validity of the account address.

The method to call this interface is as follows:

::

 sdk.account.checkValid(address)

The request parameter is described in the following table:

+-----------+--------+-------------------------------------+
| Parameter | Type   | Description                         |
+===========+========+=====================================+
| address   | String | The account address to be checked   |
+-----------+--------+-------------------------------------+

The response data is described in the following table:

+-----------+--------+-------------------------------------+
| Parameter | Type   | Description                         |
+===========+========+=====================================+
| isValid   | Boolean| Whether the account address is valid|
+-----------+--------+-------------------------------------+


The error code is described in the following table:

+--------------+------------+--------------+
| Error Message| Error Code | Description  |
+==============+============+==============+
| SYSTEM_ERROR | 20000      | System error |
+--------------+------------+--------------+


The example is as follows:

::

 const address = 'buQemmMwmRQY1JkcU7w3nhruoX5N3j6C29uo';

 sdk.account.checkValid(address).then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });


getInfo-Account
~~~~~~~~~~~~~~~~


The ``getInfo-Account`` interface is used to get the specified account information.

The method to call this interface is as follows:

::

 sdk.account.getInfo(address);

The request parameter is described in the following table:

+-----------+--------+-------------------------------------+
| Parameter | Type   | Description                         |
+===========+========+=====================================+
| address   | String | The account address to be checked   |
+-----------+--------+-------------------------------------+

The response data is described in the following table:

+-----------+---------+-----------------------------------+
| Parameter | Type    | Description                       |
+===========+=========+===================================+
| address   | String  | Account address                   |
+-----------+---------+-----------------------------------+
| balance   | String  | Account balance                   |
+-----------+---------+-----------------------------------+
| nonce     | String  | Account transaction serial number |
+-----------+---------+-----------------------------------+
| priv      | Object  | Account privilege                 |
+-----------+---------+-----------------------------------+


The error codes are described in the following table:

+-----------------------+------------+-------------------------+
| Error Message         | Error Code | Description             |
+=======================+============+=========================+
| INVALID_ADDRESS_ERROR | 11006      | Invalid address         |
+-----------------------+------------+-------------------------+
| CONNECTNETWORK_ERROR  | 11007      | Failed to connect to    |
|                       |            | the blockchain          |
+-----------------------+------------+-------------------------+
| SYSTEM_ERROR          | 20000      | System error            |
+-----------------------+------------+-------------------------+


The example is as follows:

::

 const address = 'buQemmMwmRQY1JkcU7w3nhruo%X5N3j6C29uo';

 sdk.account.getInfo(address).then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });

Object Parameters
^^^^^^^^^^^^^^^^^^^


The description of object parameters of the ``getInfo-Account`` interface is as follows.

priv
++++


+--------------+----------------+-------------------+
| Parameter    | Type           | Description       |
+==============+================+===================+
| masterWeight | String         | Account weight    |
+--------------+----------------+-------------------+
| signers      | Object         | Signer weight list|
+--------------+----------------+-------------------+
| thresholds   | Object         | Threshold         |
+--------------+----------------+-------------------+

signers
++++++++


+-------------+--------+-----------------------------------+
| Parameter   | Type   | Description                       |
+=============+========+===================================+
| address     | String | The account address of the signer |
+-------------+--------+-----------------------------------+
| weight      | String | Signer weight                     |
+-------------+--------+-----------------------------------+  


thresholds
++++++++++


+----------------+-------------------+------------------------------------------------+
| Parameter      | Type              | Description                                    |
+================+===================+================================================+
| tx_threshold   | String            | Transaction default threshold                  |
+----------------+-------------------+------------------------------------------------+
| type_thresholds| Object            | Thresholds for different types of transactions |
+----------------+-------------------+------------------------------------------------+   

type_thresholds
++++++++++++++++


+-----------+-------+--------------------+
| Parameter | Type  | Description        |
+===========+=======+====================+
| type      | String| The operation type |
+-----------+-------+--------------------+
| threshold | String| The threshold      |
+-----------+-------+--------------------+

getNonce
~~~~~~~~~


The ``getNonce`` interface is used to get the nonce value of the
specified account.

The method to call this interface is as follows:
::

 sdk.account.getNonce(address);

The request parameter is described in the following table:

+--------------+--------+------------------------------------+
| Parameter    | Type   | Description                        |
+==============+========+====================================+
| address      | String | The account address to be queried  |
+--------------+--------+------------------------------------+

The response data is described in the following table:

+-----------+--------+-----------------------------------+
| Parameter | Type   | Description                       |
+===========+========+===================================+
| nonce     | String | Account transaction serial number |
+-----------+--------+-----------------------------------+


The error codes are described in the following table:

+-----------------------+------------+-------------------------+
| Error Message         | Error Code | Description             |
+=======================+============+=========================+
| INVALID_ADDRESS_ERROR | 11006      | Invalid address         |
+-----------------------+------------+-------------------------+
| CONNECTNETWORK_ERROR  | 11007      | Failed to connect to    |
|                       |            | the network             |
+-----------------------+------------+-------------------------+
| SYSTEM_ERROR          | 20000      | System error            |
+-----------------------+------------+-------------------------+


The example is as follows:

::

 const address = 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf';

 sdk.account.getNonce(address).then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });



getBalance
~~~~~~~~~~~


The ``getBalance`` interface is used to get the **balance** value of the specific account.

The method to call this interface is as follows:

::

 sdk.account.getBalance(address);

The request parameter is described in the following table:

+--------------+--------+------------------------------------+
| Parameter    | Type   | Description                        |
+==============+========+====================================+
| address      | String | The account address to be queried  |
+--------------+--------+------------------------------------+



The response data is described in the following table:

+-----------+-------+-------------------+
| Parameter | Type  | Description       |
+===========+=======+===================+
| balance   | String| Account balance   |
+-----------+-------+-------------------+



The error codes are described in the following table:

+-----------------------+------------+-------------------------+
| Error Message         | Error Code | Description             |
+=======================+============+=========================+
| INVALID_ADDRESS_ERROR | 11006      | Invalid address         |
+-----------------------+------------+-------------------------+
| CONNECTNETWORK_ERROR  | 11007      | Failed to connect to    |
|                       |            | the network             |
+-----------------------+------------+-------------------------+
| SYSTEM_ERROR          | 20000      | System error            |
+-----------------------+------------+-------------------------+



The example is as follows:

::

 const address = 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf';

 const info = sdk.account.getBalance(address);


getAssets
~~~~~~~~~~


The ``getAssets`` interface is used to get the asset information of the specific account.

The method to call this interface is as follows:

::

 sdk.account.getAssets(address);

The request parameter is described in the following table:

+--------------+--------+------------------------------------+
| Parameter    | Type   | Description                        |
+==============+========+====================================+
| address      | String | The account address to be queried  |
+--------------+--------+------------------------------------+



The response data is described in the following table:

+-----------+----------------+---------------+
| Parameter | Type           | Description   |
+===========+================+===============+
| assets    | Array          | Account asset |
+-----------+----------------+---------------+


The error codes are shown in the following table:

+-----------------------+------------+-------------------------+
| Error Message         | Error Code | Description             |
+=======================+============+=========================+
| INVALID_ADDRESS_ERROR | 11006      | Invalid address         |
+-----------------------+------------+-------------------------+
| CONNECTNETWORK_ERROR  | 11007      | Failed to connect to    |
|                       |            | the network             |
+-----------------------+------------+-------------------------+
| SYSTEM_ERROR          | 20000      | System error            |
+-----------------------+------------+-------------------------+



The example is as follows:

::

 sdk.account.getAssets(address).then(result => {
	console.log(result);
 }).catch(err => {
	console.log(err.message);
 });


Object Parameters
^^^^^^^^^^^^^^^^^^^

The description of object parameters of the ``getAssets`` interface is as follows.

+------------+----------+-----------------------------------------------------------------+
|  Parameter |    Type  |    Description                                                  |
+------------+----------+-----------------------------------------------------------------+
|  key       |    Object|    Unique identifier for tokens, including code (token code)    |
+------------+----------+-----------------------------------------------------------------+
|            |          |    and issuer (account address of the token issuer)             |
+------------+----------+-----------------------------------------------------------------+
|  amount    |    int64 |    Amount of assets                                             |
+------------+----------+-----------------------------------------------------------------+  

Asset Services
----------------

Asset services provide an asset-related interface: ``getInfo-Asset``.

The ``getInfo-Asset`` interface is used to get the specified asset information of the specified account.

The method to call this interface is as follows:

::

 sdk.token.asset.getInfo(args);


The response data is described in the following table:

+-----------+------------------+---------------+
| Parameter | Type             | Description   |
+===========+==================+===============+
| asset     | Array            | Account asset |
+-----------+------------------+---------------+


The error codes are shown in the following table:

+--------------------------+-----------+------------------+
| Error Message            | Error Code| Description      |
+==========================+===========+==================+
| INVALID_ADDRESS_ERROR    | 11006     | Invalid address  |
+--------------------------+-----------+------------------+
| CONNECTNETWORK_ERROR     | 11007     | Failed to connect|
|                          |           | to the network   |
+--------------------------+-----------+------------------+
| INVALID_ASSET_CODE_ERROR | 11023     | The length of    |
|                          |           | code must        |
|                          |           | be between 1 and |
|                          |           | 1024             |
+--------------------------+-----------+------------------+
| INVALID_ISSUER_ADDRESS   | 11027     | Invalid issuer   |
| _ERROR                   |           | address          |
+--------------------------+-----------+------------------+
| SYSTEM_ERROR             | 20000     | System error     |
+--------------------------+-----------+------------------+


The example is as follows:

::

 const args = {
	address: 'buQnnUEBREw2hB6pWHGPzwanX7d28xk6KVcp',
	code: 'TST',
	issuer: 'buQnnUEBREw2hB6pWHGPzwanX7d28xk6KVcp',
 };


 sdk.token.asset.getInfo(args).then(data => {
  console.log(data);
 });



Object Parameters
^^^^^^^^^^^^^^^^^^


The parameter **args** of ``getInfo-Asset`` interface is **Object**, and the following are its parameters:

+-----------+--------+--------------------------------------------------+
| Parameter | Type   | Description                                      |
+===========+========+==================================================+
| address   | String | Required, the account address to be queried      |
+-----------+--------+--------------------------------------------------+
| code      | String | Required, token code, length limit [1, 64]       |
+-----------+--------+--------------------------------------------------+
| issuer    | String | Required, the account address for issuing assets |
+-----------+--------+--------------------------------------------------+

The elements of the parameter **asset** of ``getInfo-Asset`` interface are **Object**, and the object parameters are:


+------------+----------+--------------------------------------------------------------+
|  Parameter |    Type  |    Description                                               |
+------------+----------+--------------------------------------------------------------+
|  key       |    Object|    Unique identifier for tokens, including code (token code) |
|            |          |    and issuer (account address of the token issuer )         |
+------------+----------+--------------------------------------------------------------+
|  amount    |    String|    Amount of assets                                          |
+------------+----------+--------------------------------------------------------------+

Transaction Services
-----------------------

Transaction services provide transaction-related interfaces:``buildBlob``, ``evaluateFee``, 
``sign``, ``submit`` and ``getInfo-transaction``.

buildBlob
~~~~~~~~~

The ``buildBlob`` interface is used to serialize transactions and generate
transaction blob strings for network transmission.

Before you call buildBlob, you need to build some
operations. Please refer to `BaseOperation`_.

The method to call this interface is as follows:


::

 sdk.transaction.buildBlob(args)

The response data is described in the following table:

+-----------------+--------+-----------------------------------+
| Parameter       | Type   | Description                       |
+=================+========+===================================+
| transactionBlob | String | Serialized transaction hex string |
+-----------------+--------+-----------------------------------+



The error codes are shown in the following table:

+--------------------------+-----------+------------------+
| 错误信息                 | 错误码    | 描述             |
+==========================+===========+==================+
| INVALID_ADDRESS_ERROR    | 11006     | Invalid address  |
+--------------------------+-----------+------------------+
| CONNECTNETWORK_ERROR     | 11007     | Failed to connect|
|                          |           | to the network   |
+--------------------------+-----------+------------------+
| INVALID_ASSET_CODE_ERROR | 11023     | The length of    |
|                          |           | code must        |
|                          |           | be between 1 and |
|                          |           | 1024             |
+--------------------------+-----------+------------------+
| INVALID_ISSUER_ADDRESS   | 11027     | Invalid issuer   |
| _ERROR                   |           | address          |
+--------------------------+-----------+------------------+
| SYSTEM_ERROR             | 20000     | System error     |
+--------------------------+-----------+------------------+ 


The example is as follows:

::

 const args = {
  sourceAddress,
  gasPrice,
  feeLimit,
  nonce,
  operations: [ sendBuOperation ],
  metadata: '6f68206d79207478',
 };
 const blobInfo = sdk.transaction.buildBlob(args);

Object Parameters
^^^^^^^^^^^^^^^^^^^^

The parameter **args** of the ``buildBlob`` interface is **Object**, and the parameters of **args** are as follows:


+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| sourceAddress     | String              | Required, the source       |
|                   |                     | account address initiating |
|                   |                     | the operation              |
+-------------------+---------------------+----------------------------+
| nonce             | String              | Required, the transaction  |
|                   |                     | serial number              |
+-------------------+---------------------+----------------------------+
| gasPrice          | String              | Required, transaction gas  |
|                   |                     | price, unit MO             |
+-------------------+---------------------+----------------------------+
| feeLimit          | String              | Required, the minimum fees |
|                   |                     | required for the           |
|                   |                     | transaction, unit MO       |
+-------------------+---------------------+----------------------------+
| operations        | Array               | Required, list of          |
|                   |                     | operations to be committed |
+-------------------+---------------------+----------------------------+
| ceilLedgerSeq     | String              | Optional, the current      |
|                   |                     | block height               |
+-------------------+---------------------+----------------------------+
| metadata          | String              | Optional, note             |
+-------------------+---------------------+----------------------------+

.. note:: **gasPrice**, **feeLimit**, **nonce** and **ceilLedgerSeq** are strings include only numbers and cannot start with 0.

BaseOperation
^^^^^^^^^^^^^^

Before calling the ``buildBlob`` interface, some operation objects shall be built, and they are:
`AccountActivateOperation`_, `AccountSetMetadataOperation`_, `AccountSetPrivilegeOperation`_, `BUSendOperation`_, `TokenIssueOperation`_, `TokenTransferOperation`_, `ContractCreateOperation`_, `ContractInvokeByAssetOperation`_, 
`ContractInvokeByBUOperation`_ and `LogCreateOperation`_.

AccountActivateOperation
++++++++++++++++++++++++

The interface call is as follows:

::

 sdk.operation.accountActivateOperation(args)

**Parameter Description**

The parameter **args** of the AccountActivateOperation is **Object**, and the parameters of **args** are as follows:


+----------------+---------+-------------------------------------------+
| Parameter      | Type    | Description                               |
+================+=========+===========================================+
| sourceAddress  | String  | Optional, source account address of the   |
|                |         | operation                                 |
+----------------+---------+-------------------------------------------+
| destAddress    | String  | Required, target account address          |
+----------------+---------+-------------------------------------------+
| initBalance    | String  | Required, initialize the asset, includes  |
|                |         | only numbers and cannot start with 0,     |
|                |         | size [1, max(int64)], unit MO             |
+----------------+---------+-------------------------------------------+
| metadata       | String  | Optional, note                            |
+----------------+---------+-------------------------------------------+

.. note:: 1 BU=10^8 MO.

**Return Value**

The return value of the AccountActivateOperation is as follows:

+---------------+--------+------------------------------------+
| Parameter     | Type   | Description                        |
+===============+========+====================================+
| operation     | Object | Object of AccountActivateOperation |
+---------------+--------+------------------------------------+

**Error Codes**


The common error codes of the AccountActivateOperation are as follows:

+---------------------------------------------+------------+----------------------------------------------+
| Error Message                               | Error code | Description                                  |
+=============================================+============+==============================================+
| INVALID_SOURCEADDRESS_ERROR                 | 11002      | Invalid sourceAddress                        |
+---------------------------------------------+------------+----------------------------------------------+
| INVALID_DESTADDRESS_ERROR                   | 11003      | Invalid destAddress                          |
+---------------------------------------------+------------+----------------------------------------------+
| INVALID_INITBALANCE_ERROR                   | 11004      | InitBalance must be between 1 and max(int64) |
+---------------------------------------------+------------+----------------------------------------------+ 
| SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR       | 11005      | SourceAddress cannot be equal to destAddress |                    
+---------------------------------------------+------------+----------------------------------------------+
| INVALID_METADATA_ERROR                      | 15028      | Invalid metadata                             |
+---------------------------------------------+------------+----------------------------------------------+
| SYSTEM_ERROR                                | 20000      | System error                                 |      
+---------------------------------------------+------------+----------------------------------------------+


AccountSetMetadataOperation
++++++++++++++++++++++++++++++++

The interface call is as follows:

::

 sdk.operation.accountSetMetadataOperation(args)

**Parameter Description**


The parameter **args** of the AccountSetMetadataOperation is **Object**, and the parameters of **args** are as follows:


+---------------+---------+------------------------------------------------------+
| Parameter     | Type    | Description                                          |
+===============+=========+======================================================+
| sourceAddress | String  | Optional, source account address of the operation    |
+---------------+---------+------------------------------------------------------+
| key           | String  | Required, metadata keyword, length limit [1, 1024]   |
+---------------+---------+------------------------------------------------------+
| value         | String  | Optional, metadata content, length limit [0, 256000] |
+---------------+---------+------------------------------------------------------+
| version       | String  | Optional, metadata version                           |
+---------------+---------+------------------------------------------------------+
| deleteFlag    | Boolean | Optional, whether to delete metadata                 |
+---------------+---------+------------------------------------------------------+
| metadata      | String  | Optional, note                                       |
+---------------+---------+------------------------------------------------------+

**Return Value**


The return value of the AccountSetMetadataOperation is as follows:

+---------------+--------+---------------------------------------+
| Parameter     | Type   | Description                           |
+===============+========+=======================================+
| operation     | Object | Object of AccountSetMetadataOperation |
+---------------+--------+---------------------------------------+

**Error Codes**

The common error codes of the AccountSetMetadataOperation are as follows:


+---------------------------------------------+------------+---------------------------------------------------+
| Error Message                               | Error Code | Description                                       |
+=============================================+============+===================================================+
| INVALID_SOURCEADDRESS_ERROR                 | 11002      | Invalid sourceAddress                             |
+---------------------------------------------+------------+---------------------------------------------------+
| INVALID_DATAKEY_ERROR                       | 11011      | The length of key must be between 1 and 1024      |
+---------------------------------------------+------------+---------------------------------------------------+
| INVALID_DATAVALUE_ERROR                     | 11012      | The length of value must be between 0 and 256000  |
+---------------------------------------------+------------+---------------------------------------------------+ 
| INVALID_DATAVERSION_ERROR                   | 11013      | The version must be equal to or greater than 0    |                    
+---------------------------------------------+------------+---------------------------------------------------+
| SYSTEM_ERROR                                | 20000      | System error                                      |      
+---------------------------------------------+------------+---------------------------------------------------+


AccountSetPrivilegeOperation
++++++++++++++++++++++++++++++++

The interface call is as follows:

::

 sdk.operation.accountSetPrivilegeOperation(args)

**Parameter Description**


The parameter **args** of the AccountSetPrivilegeOperation is **Object**, and the parameters of **args** are as follows:


+------------------+-----------------+--------------------------------------+
| Parameter        | Type            | Description                          |
+==================+=================+======================================+
| sourceAddress    | String          | Optional, source account address of  |
|                  |                 | the operation                        |
+------------------+-----------------+--------------------------------------+
| masterWeight     | String          | Optional, account weight, size limit |
|                  |                 | [0, max(uint32)]                     |
+------------------+-----------------+--------------------------------------+
| signers          | Array           | Optional, signer weight list         |
+------------------+-----------------+--------------------------------------+
| txThreshold      | String          | Optional, transaction threshold,     |
|                  |                 | size limit [0, max(int64)]           |
+------------------+-----------------+--------------------------------------+
| typeThreshold    | Array           | Optional, specify transaction        |
|                  |                 | threshold                            |
+------------------+-----------------+--------------------------------------+
| metadata         | String          | Optional, note                       |
+------------------+-----------------+--------------------------------------+

**Return Value**

The return value of the AccountSetPrivilegeOperation is as follows:

+---------------+--------+---------------------------------------+
| Parameter     | Type   | Description                           |
+===============+========+=======================================+
| operation     | Object | Object of AccountSetPrivilegeOperation|
+---------------+--------+---------------------------------------+

**Error Codes**

The common error codes of the AccountSetPrivilegeOperation are as follows:


+---------------------------------------------+-------------+---------------------------------------------------+
| Error Message                               | Error Code  | Description                                       |
+=============================================+=============+===================================================+
| INVALID_SOURCEADDRESS_ERROR                 | 11002       | Invalid sourceAddress                             |
+---------------------------------------------+-------------+---------------------------------------------------+
| INVALID_MASTERWEIGHT_ERROR                  | 11015       | MasterWeight must be between 0 and max(uint32)    |
+---------------------------------------------+-------------+---------------------------------------------------+
| INVALID_SIGNER_ADDRESS_ERROR                | 11016       | Invalid signer address                            |
+---------------------------------------------+-------------+---------------------------------------------------+ 
| INVALID_SIGNER_WEIGHT_ERROR                 | 11017       | Signer weight must be between 0 and max(uint32)   |                    
+---------------------------------------------+-------------+---------------------------------------------------+
| INVALID_TX_THRESHOLD_ERROR                  | 11018       | TxThreshold must be between 0 and max(int64)      |  
+---------------------------------------------+-------------+---------------------------------------------------+
| INVALID_OPERATION_TYPE_ERROR                | 11019       | The type of typeThreshold is invalid              |
+---------------------------------------------+-------------+---------------------------------------------------+ 
| INVALID_TYPE_THRESHOLD_ERROR                | 11020       | TypeThreshold must be between 0 and max(int64)    |                    
+---------------------------------------------+-------------+---------------------------------------------------+
| SYSTEM_ERROR                                | 20000       | System error                                      |      
+---------------------------------------------+-------------+---------------------------------------------------+


**Object Parameters**

The elements of **signers** parameter of **args** are **Object**, and the object parameters are as follows:


+------------+--------+-------------------------------------------------------------+
| Parameter  | Type   | Description                                                 |
+============+========+=============================================================+
| address    | String | Optional, the account address of the signer                 |
+------------+--------+-------------------------------------------------------------+
| weight     | String | Optional, the signer weight, size limit[0, max(int32)]      |
+------------+--------+-------------------------------------------------------------+


The elements of **typeThresholds** parameter of **args** are **Object**, and the object parameters are as follows:

+-----------+-----------+-------------------------------------------------+
| Parameter | Type      | Description                                     |
+===========+===========+=================================================+
| type      | String    | Optional, the operation type, size limit[0,100] |
+-----------+-----------+-------------------------------------------------+
| threshold | String    | Optional, threshold, size limit[0,max(int64)]   |
+-----------+-----------+-------------------------------------------------+


BUSendOperation
++++++++++++++++++

The interface call is as follows:

::

 sdk.operation.buSendOperation(args)

**Parameter Description**


The parameter **args** of the BUSendOperation is **Object**, and the parameters of **args** are as follows:

+---------------+--------+---------------------------------------------------------------+
| Parameter     | Type   | Description                                                   |
+===============+========+===============================================================+
| sourceAddress | String | Optional, source account address of the operation             |
+---------------+--------+---------------------------------------------------------------+
| metadata      | String | Optional, note                                                |
+---------------+--------+---------------------------------------------------------------+
| destAddress   | String | Required, target account address                              |
+---------------+--------+---------------------------------------------------------------+
| buAmount      | String | Required, amount of asset issued, size limit [0,max(int64)]   |                        
|               |        | string of only numbers, cannot starts with 0                  |
+---------------+--------+---------------------------------------------------------------+

**Return Value**


The return value of the BUSendOperation is as follows:

+---------------+--------+---------------------------------------+
| Parameter     | Type   | Description                           |
+===============+========+=======================================+
| operation     | Object | Object of BUSendOperation             |
+---------------+--------+---------------------------------------+

**Error Codes**

The common error codes of the BUSendOperation are as follows:

+---------------------------------------------+-------------+---------------------------------------------------+
| Error Message                               | Error Code  | Description                                       |
+=============================================+=============+===================================================+
| INVALID_SOURCEADDRESS_ERROR                 | 11002       | Invalid sourceAddress                             |
+---------------------------------------------+-------------+---------------------------------------------------+
| INVALID_DESTADDRESS_ERROR                   | 11003       | Invalid destAddress                               |
+---------------------------------------------+-------------+---------------------------------------------------+
| SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR       | 11005       | SourceAddress cannot be equal to destAddress      |
+---------------------------------------------+-------------+---------------------------------------------------+ 
| INVALID_BU_AMOUNT_ERROR                     | 11026       | BuAmount must be between 1 and max(int64)         |                    
+---------------------------------------------+-------------+---------------------------------------------------+
| INVALID_ISSUER_ADDRESS_ERROR                | 11027       | Invalid issuer address                            |  
+---------------------------------------------+-------------+---------------------------------------------------+
| SYSTEM_ERROR                                | 20000       | System error                                      |      
+---------------------------------------------+-------------+---------------------------------------------------+


TokenIssueOperation
++++++++++++++++++++++++


The interface call is as follows:

::

 sdk.operation.assetIssueOperation(args)

**Parameter Description**


The parameter **args** of the TokenIssueOperation is **Object**, and the parameters of **args** are as follows:

+---------------+--------+--------------------------------------------------------+
| Parameter     | Type   | Description                                            |
+===============+========+========================================================+
| sourceAddress | String | Optional, source account address of the operation      |
+---------------+--------+--------------------------------------------------------+
| metadata      | String | Optional, note                                         |
+---------------+--------+--------------------------------------------------------+
| code          | String | Required, asset code                                   |
+---------------+--------+--------------------------------------------------------+
| assetAmount   | String | Required, asset quantity, size limit [0, max(int64)],  |
|               |        | string of only numbers and cannot starts with 0        | 
+---------------+--------+--------------------------------------------------------+  

**Return Value**

The return value of the TokenIssueOperation is as follows:

+---------------+--------+---------------------------------------+
| Parameter     | Type   | Description                           |
+===============+========+=======================================+
| operation     | Object | Object of TokenIssueOperation         |
+---------------+--------+---------------------------------------+

**Error Codes**

The common error codes of the TokenIssueOperation are as follows:

+---------------------------------------------+------------+---------------------------------------------------+
| Error Message                               | Error Code | Description                                       |
+=============================================+============+===================================================+
| INVALID_SOURCEADDRESS_ERROR                 | 11002      | Invalid sourceAddress                             |
+---------------------------------------------+------------+---------------------------------------------------+
| INVALID_ASSET_CODE_ERROR                    | 11023      | The length of key must be between 1 and 1024      |                    
+---------------------------------------------+------------+---------------------------------------------------+
| INVALID_ASSET_AMOUNT_ERROR                  | 11024      | AssetAmount must be between 1 and max(int64)      |
+---------------------------------------------+------------+---------------------------------------------------+ 
| SYSTEM_ERROR                                | 20000      | System error                                      |                    
+---------------------------------------------+------------+---------------------------------------------------+


TokenTransferOperation
++++++++++++++++++++++++

The interface call is as follows:

::

 sdk.operation.assetSendOperation(args)

**Parameter Description**


The parameter **args** of the TokenTransferOperation is **Object**, and the parameters of **args** are as follows:

+--------------------+--------------+-------------------------------------------------+
| Parameter          | Type         | Description                                     |
+====================+==============+=================================================+
| sourceAddress      | String       | Optional, source account address                |
|                    |              | of the operation                                |
+--------------------+--------------+-------------------------------------------------+
| destAddress        | String       | Required, target account address                |
|                    |              | to which token is transferred                   |
+--------------------+--------------+-------------------------------------------------+
| assetAmount        | String       | Required, amount of tokens to be                |
|                    |              | transferred, size limit [1,max(int64)]          |
+--------------------+--------------+-------------------------------------------------+
| metadata           | String       | Optional, note                                  |
+--------------------+--------------+-------------------------------------------------+
| code               | String       | Required, token code                             |
+--------------------+--------------+-------------------------------------------------+
| issuer             | String       | Required, the account address issuing assets     |
+--------------------+--------------+-------------------------------------------------+   

**Return Value**

The return value of the TokenTransferOperation is as follows:

+---------------+--------+---------------------------------------+
| Parameter     | Type   | Description                           |
+===============+========+=======================================+
| operation     | Object | Object of TokenTransferOperation      |
+---------------+--------+---------------------------------------+

**Error Codes**

The common error codes of the TokenTransferOperation are as follows:


+---------------------------------------------+------------+----------------------------------------------------+
| Error Message                               | Error Code | Description                                        |
+=============================================+============+====================================================+
| INVALID_SOURCEADDRESS_ERROR                 | 11002      | Invalid sourceAddress                              |
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_DESTADDRESS_ERROR                   | 11003      | Invalid destAddress                                |
+---------------------------------------------+------------+----------------------------------------------------+
| SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR       | 11005      | SourceAddress cannot be equal to destAddress       |
+---------------------------------------------+------------+----------------------------------------------------+ 
| INVALID_ASSET_CODE_ERROR                    | 11023      | The length of asset code must be between 1 and 1024|                    
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_ASSET_AMOUNT_ERROR                  | 11024      | AssetAmount must be between 1 and max(int64)       |                      
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_ISSUER_ADDRESS_ERROR                | 11027      | Invalid issuer address                             |     
+---------------------------------------------+------------+----------------------------------------------------+
| SYSTEM_ERROR                                | 20000      | System error                                       |      
+---------------------------------------------+------------+----------------------------------------------------+


ContractCreateOperation
++++++++++++++++++++++++

The interface call is as follows:

::

 sdk.operation.contractCreateOperation(args)

**Parameter Description**


The parameter **args** of the ContractCreateOperation is **Object**, and the parameters of **args** are as follows:

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | String       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| initBalance        | String       | Required, initial asset for      |
|                    |              | contract account,                |
|                    |              | size limit [1, max(int64)]       |
+--------------------+--------------+----------------------------------+
| payload            | String       | Required, contract code for the  |
|                    |              | corresponding language           |
+--------------------+--------------+----------------------------------+
| metadata           | String       | Optional, note                   |
+--------------------+--------------+----------------------------------+

**Return Value**

The return value of the ContractCreateOperation is as follows:

+---------------+--------+---------------------------------------+
| Parameter     | Type   | Description                           |
+===============+========+=======================================+
| operation     | Object | Object of ContractCreateOperation     |
+---------------+--------+---------------------------------------+

**Error Codes**

The common error codes of the ContractCreateOperation are as follows:


+---------------------------------------------+------------+----------------------------------------------------+
| Error Message                               | Error Code | Description                                        |
+=============================================+============+====================================================+
| INVALID_SOURCEADDRESS_ERROR                 | 11002      | Invalid sourceAddress                              |
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_INITBALANCE_ERROR                   | 11004      | InitBalance must be between 1 and max(int64)       |    
+---------------------------------------------+------------+----------------------------------------------------+
| PAYLOAD_EMPTY_ERROR                         | 11044      | Payload must be a non-empty string                 |
+---------------------------------------------+------------+----------------------------------------------------+ 
| SYSTEM_ERROR                                | 20000      | System error                                       |      
+---------------------------------------------+------------+----------------------------------------------------+


ContractInvokeByAssetOperation
+++++++++++++++++++++++++++++++++


The type of ContractInvokeByAssetOperation is **Promise**, and the interface call is as follows:

::

 sdk.operation.contractInvokeByAssetOperation(args)

**Parameter Description**


The parameter **args** of the ContractInvokeByAssetOperation is **Object**, and the parameters of **args** are as follows:

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | String       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| contractAddress    | String       | Required, contract account       |
|                    |              | address                          |
+--------------------+--------------+----------------------------------+
| code               | String       | Optional, asset code, length     |
|                    |              | limit [0, 1024]; when it is      |
|                    |              | empty, only the contract is      |
|                    |              | triggered                        |
+--------------------+--------------+----------------------------------+
| issuer             | String       | Optional, the account address    |
|                    |              | issuing assets; when it is null, |
|                    |              | only the contract is triggered   |
+--------------------+--------------+----------------------------------+
| assetAmount        | String       | Optional, asset quantity, size   |
|                    |              | limit [0, max(int64)], when      |
|                    |              | it is 0, only the contract is    |
|                    |              | triggered                        |
+--------------------+--------------+----------------------------------+
| input              | String       | Optional, the input parameter of |
|                    |              | the main() method for the        |
|                    |              | contract to be triggered         |
+--------------------+--------------+----------------------------------+
| metadata           | String       | Optional, note                   |
+--------------------+--------------+----------------------------------+

**Return Value**

The return value of the ContractInvokeByAssetOperation is as follows:

+---------------+--------+--------------------------------------------+
| Parameter     | Type   | Description                                |
+===============+========+============================================+
| operation     | Object | Object of ContractInvokeByAssetOperation   |
+---------------+--------+--------------------------------------------+

**Error Codes**

The common error codes of the ContractInvokeByAssetOperation are as follows:


+---------------------------------------------+------------+----------------------------------------------------+
| Error Message                               | Error Code | Description                                        |
+=============================================+============+====================================================+
| INVALID_SOURCEADDRESS_ERROR                 | 11002      | Invalid sourceAddress                              |
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_CONTRACTADDRESS_ERROR               | 11037      | Invalid contract address                           |    
+---------------------------------------------+------------+----------------------------------------------------+
| CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR   | 11038      | ContractAddress is not a contract account          |
+---------------------------------------------+------------+----------------------------------------------------+ 
| SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR   | 11040      | SourceAddress cannot be equal to contractAddress   |
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_ASSET_CODE_ERROR                    | 11023      | The length of asset code must be between 0 and 1024|    
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_CONTRACT_ASSET_AMOUNT_ERROR         | 15031      | AssetAmount must be between 0 and max(int64)       |
+---------------------------------------------+------------+----------------------------------------------------+ 
| INVALID_ISSUER_ADDRESS_ERROR                | 11027      | Invalid issuer address                             |
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_INPUT_ERROR                         | 15028      | Invalid input                                      |    
+---------------------------------------------+------------+----------------------------------------------------+
| SYSTEM_ERROR                                | 20000      | System error                                       |      
+---------------------------------------------+------------+----------------------------------------------------+



ContractInvokeByBUOperation
++++++++++++++++++++++++++++++++

The type of ContractInvokeByBUOperation is **Promise**, and the interface call is as follows:

::

 sdk.operation.contractInvokeByBUOperation(args)

**Parameter Description**


The parameter **args** of the ContractInvokeByBUOperation is **Object**, and the parameters of **args** are as follows:


+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | String       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| contractAddress    | String       | Required, contract account       |
|                    |              | address                          |
+--------------------+--------------+----------------------------------+
| buAmount           | String       | Optional, number of asset        |
|                    |              | issues, size limit [0,max(int64)]|
|                    |              | when it is 0,                    |
|                    |              | only triggers the contract       |
+--------------------+--------------+----------------------------------+
| input              | String       | Optional, the input parameter of |
|                    |              | the main() method for the        |
|                    |              | contract to be triggered         |
+--------------------+--------------+----------------------------------+
| metadata           | String       | Optional, note                   |
+--------------------+--------------+----------------------------------+

**Return Value**

The return value of the ContractInvokeByBUOperation is as follows:

+---------------+--------+--------------------------------------------+
| Parameter     | Type   | Description                                |
+===============+========+============================================+
| operation     | Object | Object of ContractInvokeByBUOperation      |
+---------------+--------+--------------------------------------------+



**Error Codes**

The common error codes of the ContractInvokeByBUOperation are as follows:


+---------------------------------------------+------------+----------------------------------------------------+
| Error Message                               | Error Code | Description                                        |
+=============================================+============+====================================================+
| INVALID_SOURCEADDRESS_ERROR                 | 11002      | Invalid sourceAddress                              |
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_CONTRACTADDRESS_ERROR               | 11037      | Invalid contract address                           |    
+---------------------------------------------+------------+----------------------------------------------------+
| CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR   | 11038      | ContractAddress is not a contract account          |
+---------------------------------------------+------------+----------------------------------------------------+ 
| SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR   | 11040      | SourceAddress cannot be equal to contractAddress   |
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_CONTRACT_BU_AMOUNT_ERROR            | 15030      | BuAmount must be between 0 and max(int64)          |    
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_INPUT_ERROR                         | 15028      | Invalid input                                      |    
+---------------------------------------------+------------+----------------------------------------------------+
| SYSTEM_ERROR                                | 20000      | System error                                       |      
+---------------------------------------------+------------+----------------------------------------------------+



LogCreateOperation
+++++++++++++++++++

The interface call is as follows:

::

 sdk.operation.logCreateOperation(args)

**Parameter Description**


The parameter **args** of the LogCreateOperation is **Object**, and the parameters of **args** are as follows:

+--------------------+--------------+------------------------------------+
| Parameter          | Type         | Description                        |
+====================+==============+====================================+
| sourceAddress      | String       | Optional, source account address   |
|                    |              | of the operation                   |
+--------------------+--------------+------------------------------------+
| topic              | String       | Required, log topic,               |
|                    |              | size limit [1, 128]                |
+--------------------+--------------+------------------------------------+
| data               | String       | Required, log content, the length  |
|                    |              | of each string is between [1, 1024]|
+--------------------+--------------+------------------------------------+
| metadata           | String       | Optional, note                     |
+--------------------+--------------+------------------------------------+


**Return Value**

The return value of the LogCreateOperation is as follows:

+---------------+--------+--------------------------------------------+
| Parameter     | Type   | Description                                |
+===============+========+============================================+
| operation     | Object | Object of LogCreateOperation               |
+---------------+--------+--------------------------------------------+

**Error Codes**

The common error codes of the LogCreateOperation are as follows:

+---------------------------------------------+------------+----------------------------------------------------+
| Error Message                               | Error Code | Description                                        |
+=============================================+============+====================================================+
| INVALID_SOURCEADDRESS_ERROR                 | 11002      | Invalid sourceAddress                              |
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_LOG_TOPIC_ERROR                     | 11045      | The length of key must be between 1 and 128        |    
+---------------------------------------------+------------+----------------------------------------------------+
| INVALID_LOG_DATA_ERROR                      | 11046      | The length of value must be between 1 and 1024     |                 
+---------------------------------------------+------------+----------------------------------------------------+
| SYSTEM_ERROR                                | 20000      | System error                                       |      
+---------------------------------------------+------------+----------------------------------------------------+


evaluateFee
~~~~~~~~~~~~

The ``evaluateFee`` interface is used to estimate the transaction fee.

The method to call this interface is as follows:

::

 sdk.transaction.evaluateFee(args)

The request parameter is described in the following table:

+----------+-------+-------------------------------------------+
| Parameter| Type  | Description                               |
+==========+=======+===========================================+
| feeLimit | String| fees required for the transaction         |
+----------+-------+-------------------------------------------+
| gasPrice | String| Transaction gas price                     |
+----------+-------+-------------------------------------------+


The common error codes are as follows:

+-------------------------+------------+----------------------------+
| Error Message           | Error Code | Description                |
+=========================+============+============================+
| INVALID_NONCE_ERROR     | 11048      | Nonce must be              |
|                         |            | between 1 and              |
|                         |            | max(int64)                 |
+-------------------------+------------+----------------------------+
| INVALID_ARGUMENTS       | 15016      | Arguments of the function  |
|                         |            | are invalid                |
+-------------------------+------------+----------------------------+
| SYSTEM_ERROR            | 20000      | System error               |
+-------------------------+------------+----------------------------+ 

The example is as follows:

::

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


Object Parameters
^^^^^^^^^^^^^^^^^^

The parameter **args** of the ``evaluateFee`` interface is **Object**, and the parameters of **args** are as follows:

+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| sourceAddress     | String              | Required, the source       |
|                   |                     | account address issuing    |
|                   |                     | the operation              |
+-------------------+---------------------+----------------------------+
| nonce             | String              | Required, transaction      |
|                   |                     | serial number to be        |
|                   |                     | initiated                  |
+-------------------+---------------------+----------------------------+
| operations        | Array               | Required, list of          |
|                   |                     | operations to be committed |
+-------------------+---------------------+----------------------------+
| signtureNumber    | String              | Optional, the number of    |
|                   |                     | people to sign, the        |
|                   |                     | default is 1               |
+-------------------+---------------------+----------------------------+
| metadata          | String              | Optional, note             |
+-------------------+---------------------+----------------------------+


sign
~~~~~


The ``sign`` interface is used to sign the transactions.

The method to call this interface is as follows:
::

 sdk.transaction.sign(args)

The response data is described in the following table:

+------------+------------------+------------------+
| Parameter  | Type             | Description      |
+============+==================+==================+
| signatures | Array            | Signed data list |
+------------+------------------+------------------+


The error codes are described in the following table:


+------------------------+------------+---------------------------------------+
| Error Message          | Error Code | Description                           |
+========================+============+=======================================+
| INVALID_BLOB_ERROR     | 11056      | Invalid blob                          |
+------------------------+------------+---------------------------------------+
| PRIVATEKEY_ONE_ERROR   | 11058      | One of privateKeys is invalid         |
+------------------------+------------+---------------------------------------+
| SYSTEM_ERROR           | 20000      | System error                          |
+------------------------+------------+---------------------------------------+

The example is as follows:

::

 const signatureInfo = sdk.transaction.sign({
	privateKeys: [ privateKey ],
	blob,
 });

 console.log(signatureInfo);

Object Parameters
^^^^^^^^^^^^^^^^^^


The parameter **args** of the ``sign`` interface is **Object**, and the parameters of **args** are as follows:


+-------------+----------+-------------------------------------------------+
| Parameter   | Type     | Description                                     |
+=============+==========+=================================================+
| blob        | String   | Required, pending transaction blob to be signed |
+-------------+----------+-------------------------------------------------+
| privateKeys | Array    | Required, private key list                      |
+-------------+----------+-------------------------------------------------+



The elements of the response data signature of the ``sign`` interface are **Object**, and the parameters of the elements are as follows:

+-----------+-------+-------------------+
| Parameter | Type  | Description       |
+===========+=======+===================+
| signData  | String| Signed data list  |
+-----------+-------+-------------------+
| publicKey | String| Public key        |
+-----------+-------+-------------------+

submit
~~~~~~~

The ``submit`` interface is used to submit transactions.

The method to call this interface is as follows:

::

 sdk.transaction.submit(args)

The response data is described in the following table:


+-----------+--------+------------------+
| Parameter | Type   | Description      |
+===========+========+==================+
| hash      | String | Transaction hash |
+-----------+--------+------------------+

The error codes are shown in the following table:

+--------------------------+------------+--------------------+
| Error Message            | Error Code | Description        |
+==========================+============+====================+
| INVALID_BLOB_ERROR       | 11056      | Invalid blob       |
+--------------------------+------------+--------------------+
| INVALID_SIGNATURE_ERROR  | 15027      | Invalid signature  |
+--------------------------+------------+--------------------+              
| SYSTEM_ERROR             | 20000      | System error       |
+--------------------------+------------+--------------------+

The example is as follows:

::

   let transactionInfo = yield sdk.transaction.submit({
    blob: blob,
    signature: signature,
  });
 

Object Parameters
^^^^^^^^^^^^^^^^^^^


The parameter **args** of the ``submit`` interface is **Object**, and the parameters of **args** are as follows:

+-----------+------------------+----------------------------+
| Parameter | Type             | Description                |
+===========+==================+============================+
| blob      | String           | Required, transaction blob |
+-----------+------------------+----------------------------+
| signature | Array            | Required, signature list   |
+-----------+------------------+----------------------------+


Block Services
-----------------

Block services provide block-related interfaces: ``getNumber``, ``checkStatus``, ``getTransactions``, ``getInfo-block``, ``getLatestInfo``, 
``getValidators``, ``getLatestValidators``, ``getReward``, ``getLatestReward``, ``getFees`` and 
``getLatestFees``.

getNumber
~~~~~~~~~~

The ``getNumber`` interface is used to query the latest block height.

The method to call this interface is as follows:

::

 sdk.block.getNumber()

The response data is described in the following table:

+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| header            | String              | The block header           |
+-------------------+---------------------+----------------------------+
| BlockNumber       | String              | The latest block height    |
+-------------------+---------------------+----------------------------+

The error code is described in the following table:

+----------------------+------------+-------------------------+
| Error Message        | Error Code | Description             |
+======================+============+=========================+
| SYSTEM_ERROR         | 20000      | System error            |
+----------------------+------------+-------------------------+


The example is as follows:

::

 sdk.block.getNumber().then((result) => {
  console.log(result);
 }).catch((err) => {
  console.log(err.message);
 });


checkStatus
~~~~~~~~~~~~


The ``checkStatus`` interface is used to check whether the local node block is synchronized.

The method to call this interface is as follows:

::

 sdk.block.checkStatus()

The response data is described in the following table:


+---------------+---------+-----------------------------------+
| Parameter     | Type    | Description                       |
+===============+=========+===================================+
| isSynchronous | bool    | Whether the block is synchronized |
+---------------+---------+-----------------------------------+

The error code is shown in the following table:

+----------------------+------------+-------------------------+
| Error Message        | Error Code | Description             |
+======================+============+=========================+
| SYSTEM_ERROR         | 20000      | System error            |
+----------------------+------------+-------------------------+


The example is as follows:

::

 sdk.block.checkStatus().then((result) => {
  console.log(result);
 }).catch((err) => {
  console.log(err.message);
 });

getTransactions
~~~~~~~~~~~~~~~~


The ``getTransactions`` interface is used to query all transactions at the
specified block height.

The method to call this interface is as follows:

::

 sdk.block.getTransactions(blockNumber)

The request parameter is described in the following table:


+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| blockNumber       | String              | The height of              |
|                   |                     | the block to be queried    |
+-------------------+---------------------+----------------------------+

The response data is described in the following table:

+-----------------------+------------------------------+----------------------------------------+
| Parameter             | Type                         | Description                            |
+=======================+==============================+========================================+
| total_count           | String                       | Total number of transactions returned  |
+-----------------------+------------------------------+----------------------------------------+
| transactions          | Array                        | Transaction content                    |
+-----------------------+------------------------------+----------------------------------------+


The error codes are shown in the following table:

+--------------------------+------------+--------------------------------------+
| Error Message            | Error Code | Description                          |
+==========================+============+======================================+
| INVALID_BLOCKNUMBER_ERROR| 11060      | BlockNumber must be bigger than 0    |
+--------------------------+------------+--------------------------------------+
| QUERY_RESULT_NOT_EXIST   | 15014      | Query result does not exist          |
+--------------------------+------------+--------------------------------------+
| SYSTEM_ERROR             | 20000      | System error                         |
+--------------------------+------------+--------------------------------------+

The example is as follows:

::

 sdk.block.getTransactions(100).then(result => {
  console.log(result);
  console.log(JSON.stringify(result));
 }).catch(err => {
  console.log(err.message);
 });



Object Parameters
^^^^^^^^^^^^^^^^^^^

The following are parameters of **Object** type of the ``getTransactions`` interface.

transactions
+++++++++++++


The elements of **transactions** in the response data are **Object**, and the parameters of the elements are:

+----------------+-------------------------+-----------------------------+
| Parameter      |  Type                   | Description                 |
+================+=========================+=============================+
| actual_fee     | String                  | Actual transaction fee      |
+----------------+-------------------------+-----------------------------+
| close_time     | String                  | Transaction closure time    |
+----------------+-------------------------+-----------------------------+
| error_code     | String                  | Transaction error code      |
+----------------+-------------------------+-----------------------------+
| error_desc     | String                  | Transaction description     |
+----------------+-------------------------+-----------------------------+
|  hash          | String                  | Transaction hash            |
+----------------+-------------------------+-----------------------------+
| ledger_seq     | String                  | Block serial number         |
+----------------+-------------------------+-----------------------------+
|  transaction   | TransactionInfoObject   | List of transaction contents|
+----------------+-------------------------+-----------------------------+
| signatures     | SignatureObject         | Signature list              |
+----------------+-------------------------+-----------------------------+
| tx_size        | int64                   | Transaction size            |
+----------------+-------------------------+-----------------------------+ 

transactionInfoObject
++++++++++++++++++++++++++

The **transaction** parameter in **transactions** is **transactionInfoObject**, and the parameters of **transaction** are as follows:

+-----------------------+-----------------------+-----------------------+
| Parameter             | Type                  | Description           |
+=======================+=======================+=======================+
| source_address        | String                | The source account    |
|                       |                       | address initiating    |
|                       |                       | the transaction       |
+-----------------------+-----------------------+-----------------------+
| fee_limit             | String                | Minimum fees required |
|                       |                       | for the transaction   |
+-----------------------+-----------------------+-----------------------+
| gas_price             | String                | Transaction fuel      |
|                       |                       | price                 |
+-----------------------+-----------------------+-----------------------+
| nonce                 | String                | Transaction serial    |
|                       |                       | number                |
+-----------------------+-----------------------+-----------------------+
| operations            | Object                | Operation list        |
+-----------------------+-----------------------+-----------------------+


signatureObject
++++++++++++++++++

The **signatures** parameter in **transactions** is **signatureObject**, and the parameters of **signatures** are as follows:

+----------------+-------------------------+-----------------------+
| Parameter      | Type                    | Description           |
+================+=========================+=======================+
| sign_data      | String                  | Signed data list      |
+----------------+-------------------------+-----------------------+
| public_key     | String                  | Public key            |
+----------------+-------------------------+-----------------------+


getInfo-block
~~~~~~~~~~~~~


The ``getInfo-block`` interface is used to obtain block information.

The method to call this interface is as follows:

::

 sdk.block.getInfo(blockNumber)

The request parameter is described in the following table:

+-------------+-------+-------------------------------------------------+
| Parameter   | Type  | Description                                     |
+=============+=======+=================================================+
| blockNumber | String| The height of the block to be queried           |
+-------------+-------+-------------------------------------------------+


The response data is described in the following table:

+-----------+--------+-------------------------------+
| Parameter | Type   | Description                   |
+===========+========+===============================+
| closeTime | String | Block closure time            |
+-----------+--------+-------------------------------+
| number    | String | Block height                  |
+-----------+--------+-------------------------------+
| txCount   | String | Total transactions amount     |
+-----------+--------+-------------------------------+
| version   | String | Block version                 |
+-----------+--------+-------------------------------+

The error codes are described in the following table:

+---------------------------+------------+------------------------------------+
| Error Message             | Error Code | Description                        |
+===========================+============+====================================+
| INVALID_BLOCKNUMBER_ERROR | 11060      | BlockNumber must be greater than 0 |
+---------------------------+------------+------------------------------------+
| SYSTEM_ERROR              | 20000      | System error                       |
+---------------------------+------------+------------------------------------+   

The example is as follows:

::

 sdk.block.getInfo(100).then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });


getLatestInfo
~~~~~~~~~~~~~~

The ``getLatestInfo`` interface is used to get the latest block information.

The method to call this interface is as follows:


::

 sdk.block. getLatestInfo()

The response data is described in the following table:

+-----------+--------+---------------------------+
| Parameter | Type   | Description               |
+===========+========+===========================+
| closeTime | String | Block closure time        |
+-----------+--------+---------------------------+
| number    | String | Block height              |
+-----------+--------+---------------------------+
| txCount   | String | Total transactions amount |
+-----------+--------+---------------------------+
| version   | String | Block version             |
+-----------+--------+---------------------------+


The error code is shown in the following table:

+----------------------+------------+-------------------------+
| Error Message        | Error Code | Description             |
+======================+============+=========================+
| SYSTEM_ERROR         | 20000      | System error            |
+----------------------+------------+-------------------------+   


The example is as follows:

::

 sdk.block.getLatestInfo().then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });

getValidators
~~~~~~~~~~~~~~~~~~


The ``getValidators`` interface is used to get the number of all the
validator nodes in the specified block.

The method to call this interface is as follows:

::

 sdk.block.getValidators(blockNumber)

The request parameter is described in the following table:


+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| blockNumber       | String              | The height of the block    |
|                   |                     | to be queried              |
+-------------------+---------------------+----------------------------+

The response data is described in the following table:

+------------+-----------------------+-----------------+
| Parameter  | Type                  | Description     |
+============+=======================+=================+
| validators | Array                 | Validators list |
+------------+-----------------------+-----------------+

The error codes are described in the following table:

+---------------------------+------------+--------------------------+
| Error Message             | Error Code |  Description             |
+===========================+============+==========================+
| INVALID_BLOCKNUMBER_ERROR | 11060      | BlockNumber must be      |
|                           |            | greater than 0           |
+---------------------------+------------+--------------------------+
| SYSTEM_ERROR              | 20000      | System error             |
+---------------------------+------------+--------------------------+  

The example is as follows:

::

 sdk.block.getValidators(100).then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });

Object Parameters
^^^^^^^^^^^^^^^^^^^^

The elements of **validators** of the response data are **Object**, and the parameters of the elements are as follows:

+-------------------+--------+------------------------+
| Parameter         | Type   | Description            |
+===================+========+========================+
| address           | String | Consensus node address |
+-------------------+--------+------------------------+
| pledge_coin_amount| String | Deposit of validators  |
+-------------------+--------+------------------------+


getLatestValidators
~~~~~~~~~~~~~~~~~~~~~


The ``getLatestValidators`` interface is used to get the number of all
validators in the latest block.

The method to call this interface is as follows:

::

 sdk.block.getLatestValidators()

The response data is described in the following table:

+------------+-----------------------+-----------------+
| Parameter  | Type                  | Description     |
+============+=======================+=================+
| validators | Array                 | Validators list |
+------------+-----------------------+-----------------+


The error code is described in the following table:

+---------------------------+------------+----------------------------+
| Error Message             | Error Code | Description                |
+===========================+============+============================+
| SYSTEM_ERROR              | 20000      | System error               |
+---------------------------+------------+----------------------------+ 

The example is as follows:

::

 sdk.block.getLatestValidators().then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });

Object Parameters
^^^^^^^^^^^^^^^^^^

The elements of **validators** of the response data are **Object**, and the parameters of the elements are as follows:

+-------------------+--------+------------------------+
| Parameter         | Type   | Description            |
+===================+========+========================+
| address           | String | Consensus node address |
+-------------------+--------+------------------------+
| pledge_coin_amount| String | Deposit of validators  |
+-------------------+--------+------------------------+

getReward
~~~~~~~~~~


The ``getReward`` interface is used to retrieve the block reward and
validator node rewards in the specified block.

The method to call this interface is as follows:

::

 sdk.block.getReward(blockNumber)

The request parameter is described in the following table:

+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| blockNumber       | String              | Required, the height of    |
|                   |                     | the block to be queried    |
+-------------------+---------------------+----------------------------+


The response data is described in the following table:


+-----------------------+-------------------------+-------------------+
| Parameter             | Type                    | Description       |
+=======================+=========================+===================+
| blockReward           | String                  | Block rewards     |
+-----------------------+-------------------------+-------------------+
| validatorsReward      | Array                   | Validators rewards|
+-----------------------+-------------------------+-------------------+


The error codes are shown in the following table:

+---------------------------+------------+------------------------------------+
| Error Message             | Error Code | Description                        |
+===========================+============+====================================+
| INVALID_BLOCKNUMBER_ERROR | 11060      | BlockNumber must be greater than 0 |
+---------------------------+------------+------------------------------------+
| SYSTEM_ERROR              | 20000      | System error                       |
+---------------------------+------------+------------------------------------+  


The example is as follows:

::

 sdk.block.getReward(100).then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });


Object Parameters
^^^^^^^^^^^^^^^^^^^

The elements of **validatorsReward** of the response data are **Object**, and the parameters of the elements are as follows:

+-----------+--------+-------------------+
| Parameter | Type   | Description       |
+===========+========+===================+
| validator | String | Validator address |
+-----------+--------+-------------------+
| reward    | String | Validator reward  |
+-----------+--------+-------------------+


getLatestReward
~~~~~~~~~~~~~~~~


The ``getLatestReward`` interface is used to get the block rewards and validator
rewards in the latest block.

The method to call this interface is as follows:
::

 sdk.block.getLatestReward()


The response data is described in the following table:

+-----------------------+-----------------------+-----------------------+
| Parameter             | Type                  | Description           |
+=======================+=======================+=======================+
| blockReward           | String                | Block rewards         |
+-----------------------+-----------------------+-----------------------+
| validatorsReward      | Array                 | Validator rewards     |
+-----------------------+-----------------------+-----------------------+


The error code is described in the following table:

+----------------------+------------+-------------------------+
| Error Message        | Error Code | Description             |
+======================+============+=========================+
| SYSTEM_ERROR         | 20000      | System error            |
+----------------------+------------+-------------------------+ 


The example is as follows:

::

 sdk.block.getLatestReward().then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });

Object Parameters
^^^^^^^^^^^^^^^^^^^^^

The elements of **validatorsReward** of the response data are **Object**, and the parameters of the elements are as follows:

+-----------+--------+-------------------+
| Parameter | Type   | Description       |
+===========+========+===================+
| validator | String | Validator address |
+-----------+--------+-------------------+
| reward    | String | Validator reward  |
+-----------+--------+-------------------+

getFees
~~~~~~~~


The ``getFees`` interface is used to get the minimum asset limit and fuel price of the
account in the specified block.

The method to call this interface is as follows:

::

 sdk.block.getFees(blockNumber)

The request parameter is described in the following table:

+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| blockNumber       | String              | The height of              |
|                   |                     | the block to be queried    |
+-------------------+---------------------+----------------------------+

The response data is described in the following table:

+-----------+---------+-------------+
| Parameter | Type    | Description |
+===========+=========+=============+
| fees      | Object  | Fees        |
+-----------+---------+-------------+


The error codes are shown in the following table:

+---------------------------+------------+--------------------------------+
| Error Message             | Error Code | Description                    |
+===========================+============+================================+
| INVALID_BLOCKNUMBER_ERROR | 11060      | BlockNumber must               |
|                           |            | be greater than 0              |
+---------------------------+------------+--------------------------------+
| SYSTEM_ERROR              | 20000      | System error                   |
+---------------------------+------------+--------------------------------+ 


The example is as follows:

::

 sdk.block.getFees(100).then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });

Object Parameters
^^^^^^^^^^^^^^^^^^^

The elements of **fees** of the response data are **Object**, and the parameters of the elements are as follows:

+-------------+------+-------------------------------------------------+
| Parameter   | Type | Description                                     |
+=============+======+=================================================+
| baseReserve |String| Minimum asset limit for the account             |
+-------------+------+-------------------------------------------------+
| gasPrice    |String| Transaction fuel price, unit MO, 1 BU = 10^8 MO |
+-------------+------+-------------------------------------------------+

getLatestFees
~~~~~~~~~~~~~~


The ``getLatestFees`` interface is used to get the minimum asset limit
and fuel price of the account in the latest block.

The method to call this interface is as follows:

::

 sdk.block.getLatestFees()

The response data is described in the following table:

+-----------+----------+-------------+
| Parameter | Type     | Description |
+===========+==========+=============+
| fees      | Object   | Fees        |
+-----------+----------+-------------+


The error code is described in the following table:

+----------------------+------------+-------------------------+
| Error Message        | Error Code | Description             |
+======================+============+=========================+
| SYSTEM_ERROR         | 20000      | System error            |
+----------------------+------------+-------------------------+  


The example is as follows:

::

 sdk.block.getLatestFees().then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });



Contract Services
------------------

Contract Services provide contract-related interfaces and they are: ``getInfo-contract``, ``checkValid-contract`` and ``getAddress-contract``.


getInfo-contract
~~~~~~~~~~~~~~~~~


The ``getInfo-contract`` interface is used to get contract information.

The method to call this interface is as follows:

::

 sdk.contract.getInfo(contractAddress)

The request parameter is described in the following table:

+-----------------+--------+----------------------------------------------------+
| Parameter       | Type   | Description                                        |
+=================+========+====================================================+
| contractAddress | string | Required, contract address of token to be verified |
+-----------------+--------+----------------------------------------------------+


The response data is described in the following table:

+-----------------+------------------+---------------------+
| Parameter       | Type             | Description         |
+=================+==================+=====================+
| contract        | Object           | Contract information|
+-----------------+------------------+---------------------+
| type            | Number           | Contract type       |
+-----------------+------------------+---------------------+
| payload         | String           | Contract code       |
+-----------------+------------------+---------------------+

The error codes are described in the following table:

+-------------------------+------------+-------------------------+
| Error Message           | Error Code | Description             |
+=========================+============+=========================+
| INVALID_CONTRACTADDRESS | 11037      | Invalid contract        |
| _ERROR                  |            | address                 |
+-------------------------+------------+-------------------------+
| CONTRACTADDRESS_NOT_CON | 11038      | contractAddress is not  |
| TRACTACCOUNT_ERROR      |            | a  contract account     |
+-------------------------+------------+-------------------------+
| INVALID_CONTRACT_HASH   | 11025      | Invalid transaction hash|
| _ERROR                  |            | to create contract      |
+-------------------------+------------+-------------------------+
| SYSTEM_ERROR            | 20000      | System error            |
+-------------------------+------------+-------------------------+



The example is as follows:

::

 const contractAddress = 'buQqbhTrfAqZtiX79zp4MWwUVfpcadvtz2TM';
 sdk.contract.getInfo(contractAddress).then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });


checkValid-contract
~~~~~~~~~~~~~~~~~~~~


The ``checkValid-contract`` interface is used to check the validity of the contract account address.

The method to call this interface is as follows:

::

 sdk.contract.checkValid(contractAddress)

The request parameter is described in the following table:

+-----------+--------+----------------------------------------------+
| Parameter | Type   | Description                                  |
+===========+========+==============================================+
| address   | String | The contract account address to be checked   |
+-----------+--------+----------------------------------------------+

The response data is described in the following table:

+-----------+--------+-------------------------------------+
| Parameter | Type   | Description                         |
+===========+========+=====================================+
| isValid   | Boolean| Whether the account address is valid|
+-----------+--------+-------------------------------------+


The error codes are described in the following table:

+-------------------------------------------+------------+------------------------------------------+
| Error Message                             | Error Code | Description                              |
+===========================================+============+==========================================+
| INVALID_CONTRACTADDRESS_ERROR             | 11037      | Invalid contract address                 |
+-------------------------------------------+------------+------------------------------------------+
| CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR | 11038      | ContractAddress is not a contract account|
+-------------------------------------------+------------+------------------------------------------+
| SYSTEM_ERROR                              | 20000      | System error                             |
+-------------------------------------------+------------+------------------------------------------+

The example is as follows:

::

 const contractAddress = 'buQhP94E8FjWDF3zfsxjqVQDeBypvzMrB3y3';
 sdk.contract.checkValid(contractAddress).then(result => {
  console.log(result);
 }).catch(err => {
  console.log(err.message);
 });



getAddress-contract
~~~~~~~~~~~~~~~~~~~~

The ``getAddress`` interface is used to query the contract address.

The method to call this interface is as follows:

::

 sdk.contract.getAddress(hash)

The request parameter is described in the following table:

+-----------+--------+------------------------------------------------+
| Parameter | Type   | Description                                    |
+===========+========+================================================+
| hash      | String | The hash used to create a contract transaction |
+-----------+--------+------------------------------------------------+

The response data is described in the following table:

+-----------------------+----------------------------+-----------------------+
| Parameter             | Type                       | Description           |
+=======================+============================+=======================+
| contractAddressList   | List                       | Contract address list |
+-----------------------+----------------------------+-----------------------+



The error codes are described in the following table:


+-------------------------+------------+-------------------------+
| Error Message           | Error Code | Description             |
+=========================+============+=========================+
| INVALID_HASH_ERROR      | 11055      | Invalid transaction hash|
+-------------------------+------------+-------------------------+
| SYSTEM_ERROR            | 20000      | System error            |
+-------------------------+------------+-------------------------+

The example is as follows:

::

 const hash = 'f298d08ec3987adc3aeef73e81cbb49cbad2316145ba190700de2d78657880c0';
 sdk.contract.getAddress(hash).then(data => {
  console.log(data);
 })



Object Parameters
^^^^^^^^^^^^^^^^^^^

The elements of **contractAddressList** of the response data are **Object**, and the parameters of the elements are as follows:

+------------------+------------------+---------------------------+
| Parameter        | Type             | Description               |
+==================+==================+===========================+
| contract_address | String           | Contract address          |
+------------------+------------------+---------------------------+
| operation_index  | Number           | Index of the operation    |
+------------------+------------------+---------------------------+


Tools
--------------

In this section we describe some interfaces for converting strings, and they are ``utfToHex``, ``hexToUtf``, ``buToMo`` and ``moToBu``.

utfToHex
~~~~~~~~~

The ``utfToHex`` interface is used to convert a utf8 string to a hex string.

The method to call this interface is as follows:

::

 sdk.util.utfToHex(str)

The request parameter is described in the following table:

+-----------------+------------------+--------------------------------+
| Parameter       | Type             | Description                    |
+=================+==================+================================+
| str             | String           | The string to be converted     |
+-----------------+------------------+--------------------------------+


The response data is a hex string if the parameter is correct, and **undefined** if the parameter is incorrect.

The example is as follows:

::
  
  const hexString = sdk.util.utfToHex('hello, world');
  console.log(hexString);

hexToUtf
~~~~~~~~~


The ``hexToUtf`` interface is used to convert a hex string to a utf8 string.

The method to call this interface is as follows:

::

 sdk.util.hexToUtf(str)

The request parameter is described in the following table:

+-----------------+------------------+--------------------------------+
| Parameter       | Type             | Description                    |
+=================+==================+================================+
| str             | String           | The string to be converted     |
+-----------------+------------------+--------------------------------+


The response data is a utf8 string if the parameter is correct, and **undefined** if the parameter is incorrect.

The example is as follows:

::

 const utfString = sdk.util.hexToUtf('68656c6c6f2c20776f726c64');
 console.log(utfString);

buToMo
~~~~~~~

The ``buToMo`` interface is used to convert bu to mo.


The method to call this interface is as follows:

::

 sdk.util.buToMo(str)

The request parameter is described in the following table:

+-----------------+------------------+----------------------------------------------------------------------------+
| Parameter       | Type             | Description                                                                |
+=================+==================+============================================================================+
| str             | String           | The string to be converted (the string can have up to 8 decimal places)    |
+-----------------+------------------+----------------------------------------------------------------------------+


The response data is a string if the parameter is correct, and ``''`` if the parameter is incorrect.

The example is as follows:

::

 const mo = sdk.util.buToMo('5');
 console.log(mo);

moToBu
~~~~~~~


The ``moToBu`` interface is used to convert mo to bu.

The method to call this interface is as follows:

::

 sdk.util.moToBu(str)

The request parameter is described in the following table:

+-----------------+------------------+--------------------------------+
| Parameter       | Type             | Description                    |
+=================+==================+================================+
| str             | String           | The string to be converted     |
+-----------------+------------------+--------------------------------+


The response data is a string if the parameter is correct, and ``''`` if the parameter is incorrect.

The example is as follows:

::

 const bu = sdk.util.moToBu('500000000');
 console.log(bu);


Error Codes
------------


The common error codes are as follows:


+---------------------------------------------+--------+----------------------------------------------------+
| Error Message                               | Error  | Description                                        |
|                                             | Code   |                                                    |
+=============================================+========+====================================================+
| ACCOUNT_CREATE_ERROR                        | 11001  | Failed to create the account                       |
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_SOURCEADDRESS_ERROR                 | 11002  | Invalid sourceAddress                              |
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_DESTADDRESS_ERROR                   | 11003  | Invalid destAddress                                |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_INITBALANCE_ERROR                   | 11004  | InitBalance must be between 1 and max(int64)       |
+---------------------------------------------+--------+----------------------------------------------------+ 
| SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR       | 11005  | SourceAddress cannot be equal to destAddress       |
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_ADDRESS_ERROR                       | 11006  | Invalid address                                    |    
+---------------------------------------------+--------+----------------------------------------------------+
| CONNECTNETWORK_ERROR                        | 11007  | Failed to connect to the network                   |
+---------------------------------------------+--------+----------------------------------------------------+
| METADATA_NOT_HEX_STRING_ERROR               | 11008  | Metadata must be a hex string                      |    
+---------------------------------------------+--------+----------------------------------------------------+
| NO_ASSET_ERROR                              | 11009  | The account does not have the asset                |
+---------------------------------------------+--------+----------------------------------------------------+ 
| NO_METADATA_ERROR                           | 11010  | The account does not have the metadata             |
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_DATAKEY_ERROR                       | 11011  | The length of key must be between 1 and 1024       |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_DATAVALUE_ERROR                     | 11012  | The length of value must be between 0 and 256000   |       
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_DATAVERSION_ERROR                   | 11013  | The version must be equal to or greater than 0     |
+---------------------------------------------+--------+----------------------------------------------------+  
| INVALID_MASTERWEIGHT_ERROR                  | 11015  | MasterWeight must be between 0 and max(uint32)     |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_SIGNER_ADDRESS_ERROR                | 11016  | Invalid signer address                             |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_SIGNER_WEIGHT_ERROR                 | 11017  | Signer weight must be between 0 and max(uint32)    |
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_TX_THRESHOLD_ERROR                  | 11018  | TxThreshold must be between 0 and max(int64)       |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_OPERATION_TYPE_ERROR                | 11019  | Operation type must be between 1 and 100           | 
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_TYPE_THRESHOLD_ERROR                | 11020  | TypeThreshold must be between 0 and max(int64)     |   
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_ASSET_CODE_ERROR                    | 11023  | The length of key must be between 1 and 1024       |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_ASSET_AMOUNT_ERROR                  | 11024  | AssetAmount must be between 1 and max(int64)       |          
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_BU_AMOUNT_ERROR                     | 11026  | BuAmount must between 1 and max(int64)             |     
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_ISSUER_ADDRESS_ERROR                | 11027  | Invalid issuer address                             |    
+---------------------------------------------+--------+----------------------------------------------------+
| NO_SUCH_TOKEN_ERROR                         | 11030  | No such token                                      |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_TOKEN_NAME_ERROR                    | 11031  | The length of token name must be between 1 and 1024|
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_TOKEN_SIMBOL_ERROR                  | 11032  | The length of symbol must be between 1 and 1024    |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_TOKEN_DECIMALS_ERROR                | 11033  | Decimals must be less than 8                       |
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_TOKEN_TOTALSUPPLY_ERROR             | 11034  | TotalSupply must be between 1 and max(int64)       |    
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_TOKENOWNER_ERRPR                    | 11035  | Invalid token owner                                |      
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_CONTRACTADDRESS_ERROR               | 11037  | Invalid contract address                           |    
+---------------------------------------------+--------+----------------------------------------------------+
| CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR   | 11038  | contractAddress is not a contract account          |
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_TOKEN_AMOUNT_ERROR                  | 11039  | Amount must be between 1 and max(int64)            |  
+---------------------------------------------+--------+----------------------------------------------------+  
| SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR   | 11040  | SourceAddress cannot be equal to contractAddress   |                                    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_FROMADDRESS_ERROR                   | 11041  | Invalid fromAddress                                |    
+---------------------------------------------+--------+----------------------------------------------------+
| FROMADDRESS_EQUAL_DESTADDRESS_ERROR         | 11042  | FromAddress cannot be equal to destAddress         |          
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_SPENDER_ERROR                       | 11043  | Invalid spender                                    |      
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_LOG_TOPIC_ERROR                     | 11045  | The length of log topic must be between 1 and 128  |                                    
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_LOG_DATA_ERROR                      | 11046  | The length of log data must be between 1 and 1024  |  
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_NONCE_ERROR                         | 11048  | Nonce must be between 1 and max(int64)             |             
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_GASPRICE_ERROR                      | 11049  | Amount must be between gasPrice in block           |    
|                                             |        | and max(int64)                                     |
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_FEELIMIT_ERROR                      | 11050  | FeeLimit must be between 1 and max(int64)          |                                    
+---------------------------------------------+--------+----------------------------------------------------+ 
| OPERATIONS_EMPTY_ERROR                      | 11051  | Operations cannot be empty                         |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_CEILLEDGERSEQ_ERROR                 | 11052  | CeilLedgerSeq must be greater than or equal to 0   |                   
+---------------------------------------------+--------+----------------------------------------------------+
| OPERATIONS_ONE_ERROR                        | 11053  | One of the operations cannot be resolved           |                              
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_SIGNATURENUMBER_ERROR               | 11054  | SignatureNumber must be between 1 and max(int32)   |                                    
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_HASH_ERROR                          | 11055  | Invalid transaction hash                           |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_BLOB_ERROR                          | 11056  | Invalid blob                                       |    
+---------------------------------------------+--------+----------------------------------------------------+
| PRIVATEKEY_NULL_ERROR                       | 11057  | PrivateKeys cannot be empty                        |      
+---------------------------------------------+--------+----------------------------------------------------+ 
| PRIVATEKEY_ONE_ERROR                        | 11058  | One of the privateKeys is invalid                  |                                    
+---------------------------------------------+--------+----------------------------------------------------+ 
| URL_EMPTY_ERROR                             | 11062  | Url cannot be empty                                |    
+---------------------------------------------+--------+----------------------------------------------------+
| CONTRACTADDRESS_CODE_BOTH_NULL_ERROR        | 11063  | ContractAddress and code cannot                    |                    
|                                             |        | be empty at the same time                          | 
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_OPTTYPE_ERROR                       | 11064  | OptType must be between 0 and 2                    |      
+---------------------------------------------+--------+----------------------------------------------------+ 
| GET_ALLOWANCE_ERROR                         | 11065  | Failed to get allowance                            |      
+---------------------------------------------+--------+----------------------------------------------------+ 
| GET_TOKEN_INFO_ERROR                        | 11066  | Failed to get token info                           |                                    
+---------------------------------------------+--------+----------------------------------------------------+ 
| CONNECTN_BLOCKCHAIN_ERROR                   | 19999  | Failed to connect to the blockchain                |    
+---------------------------------------------+--------+----------------------------------------------------+
| SYSTEM_ERROR                                | 20000  | System error                                       |      
+---------------------------------------------+--------+----------------------------------------------------+ 
| ACCOUNT_NOT_EXIST                           | 15001  | Account does not exist                             |      
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_NUMBER_OF_ARG                       | 15006  | Invalid arguments number to the function           |                                    
+---------------------------------------------+--------+----------------------------------------------------+ 
| QUERY_RESULT_NOT_EXIST                      | 15014  | Query result does not exist                        |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_ARGUMENTS                           | 15016  | Invalid arguments to the function                  |    
+---------------------------------------------+--------+----------------------------------------------------+
| FAIL                                        | 15017  | Failure                                            |      
+---------------------------------------------+--------+----------------------------------------------------+   
| INVALID_FORMAT_OF_ARG                       | 15019  | Invalid argument format to the function            |                                    
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_OPERATIONS                          | 15022  | Invalid operation                                  |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_SIGNATURE_ERROR                     | 15027  | Invalid signature                                  |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_METADATA_ERROR                      | 15028  | Invalid metadata                                   |      
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_DELETEFLAG_ERROR                    | 15029  | DeleteFlag must be Boolean                         |                                    
+---------------------------------------------+--------+----------------------------------------------------+ 
| INVALID_CONTRACT_BU_AMOUNT_ERROR            | 15030  | BuAmount must be between 0 and max(int64)          |    
+---------------------------------------------+--------+----------------------------------------------------+
| INVALID_CONTRACT_ASSET_AMOUNT_ERROR         | 15031  | AssetAmount must be between 0 and max(int64)       |                              
+---------------------------------------------+--------+----------------------------------------------------+     
