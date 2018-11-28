BUMO GO SDK Guide
==================

Overview
---------

This document details the common interfaces of the Bumo Go SDK, making
it easier for developers to operate and query the BU blockchain.

Import of Packages
-------------------

The packages on which the projects depend are in the src folder, you can get the packages as follows:

::

 //to get the packages.
 go get github.com/bumoproject/bumo-sdk-go

Terminology
-----------

This section gives details about the terms used in this document.

**Operate the BU Blockchain** 

Operate the BU Blockchain refers to writing data to or modifying data in
the BU blockchain.

**Submit Transactions**

Submit Transactions refers to sending a request to write data to or
modify data in the BU blockchain.

**Query the BU Blockchain**

Query the BU Blockchain refers to querying data in the BU blockchain.

**Account Services**

Account Services provide account validity check and query interfaces.

**Asset Services**

Asset Services provide asset-related query interfaces.

**Ctp10Token Services**

Ctp10Token Services provide validity check and query interfaces
related to contract assets.

**Contract Services**

Contract Services provide contract-related validity check and query
interfaces.

**Transaction Services**

Transaction Services provide query interfaces and a submit transaction interface.

**Block Services**

Block Services provide interfaces to query the block.

**Account Nonce Value**

Account Nonce Value is used to identify the order in which the
transaction is executed when the user submits the transaction.

Format of Request Parameters and Response Data
-----------------------------------------------

This section details the format of the request parameters and response
data.

Request Parameters
~~~~~~~~~~~~~~~~~~~

The class name of the request parameter of the interface is composed of
**Service Name+Method Name+Request**. For example, the request parameter
format of the ``getInfo`` interface in Account Services is
``AccountGetInfoRequest``.

The member of the request parameter is the member of the input parameter
of each interface. For example, if the input parameter of the ``getInfo``
interface in Account Services is ``address``, the complete structure of
the request parameters of the interface is as follows:

::

   type AccountGetInfoRequest struct {
   address string
   }

Response Data
~~~~~~~~~~~~~~

The members of the response data include error codes, error
descriptions, and return results. The class name of the response data of the interface is composed of
**Service Name+Method Name+Response**. 

For example, the members of the
response data of the ``Account.GetInfo()`` is ``AccountGetInfoResponse`` :

::

 type AccountGetInfoResponse struct {
   ErrorCode int
   ErrorDesc string
   Result  AccountGetInfoResult
 }

.. note:: - ErrorCode:  error code. 0 means no error, greater than 0 means there is an error

       - ErrorDesc: error description. null means no error, otherwise there is an error

       - Result: returns the result. The class name of the result structure is **Service Name+Method Name+Result** . For example, the result class name of the ``Account.GetNonce()`` interface in Account Services is AccountGetNonceResult.  
        
::

    type AccountGetNonceResult struct {
      Nonce int64
    }

Usage
------

This section describes the process of using the SDK. First you need to
generate the SDK instance and then call the interface of the
corresponding service. Services include account services, asset
services,contract services, transaction services,
and block services. Interfaces are classified into public-private key
address interfaces, validity check interfaces, query interfaces, and
transaction-related interfaces.

Import of The Packages
~~~~~~~~~~~~~~~~~~~~~~~

Import the packages before generating the SDK instance.

::

 import(
   "github.com/bumoproject/bumo-sdk-go/src/model"
   "github.com/bumoproject/bumo-sdk-go/src/sdk"
 )

Generating SDK Instances
~~~~~~~~~~~~~~~~~~~~~~~~~

The method to initialize SDK structure:

::

 var testSdk sdk.sdk

Call the Init interface of SDK structure:

::

 url :="http://seed1.bumotest.io:26002"
 var reqData model.SDKInitRequest
 reqData.SetUrl(url)
 resData := testSdk.Init(reqData)

Generating Public-Private Keys and Addresses  
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Call the Create function of Account to gerenate an account:

::

 resData :=testSdk.Account.Create()

Checking Validity
~~~~~~~~~~~~~~~~~

The validity check interface is used to verify the validity of the
information, and the information validity check can be achieved by
directly invoking the corresponding interface. For example, to verify
the validity of the account address, the specific call is as follows:

::

 //Initialize request parameters
 var reqData model.AccountCheckValidRequest
 var address string = "buQtfFxpQP9JCFgmu4WBojBbEnVyQGaJDgGn"
 reqData.SetAddress(address)
 //Call the validity check interface
 resData := testSdk.Account.CheckValid(reqData)

Querying
~~~~~~~~~

The data query can be implemented by directly invoking the corresponding
interface.For example, to query the account information, the specific
call is as follows:

::

 //Initialize request parameters
 var reqData model.AccountGetInfoRequest
 var address string = "buQtfFxpQP9JCFgmu4WBojBbEnVyQGaJDgGn"
 reqData.SetAddress(address)
 //Call the getInfo interface 
 resData := testSdk.Account.GetInfo(reqData)

Submitting Transactions
~~~~~~~~~~~~~~~~~~~~~~~

The process of submitting transactions consists of the following steps:

`1. Obtaining the Nonce Value of the Account`_

`2. Building Operations`_

`3. Building Transaction Blob`_

`4. Signing Transactions`_

`5. Broadcasting Transactions`_

1. Obtaining the Nonce Value of the Account
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The developer can maintain the nonce value of each account, and
automatically increments by 1 for the nounce value after submitting a
transaction, so that multiple transactions can be sent in a short time;
otherwise, the nonce value of the account must be added 1 after the
execution of the previous transaction is completed. The specific
interface call is as follows:

::

 //Initialize request parameters
 var reqData model.AccountGetNonceRequest
 var address string = "buQtfFxpQP9JCFgmu4WBojBbEnVyQGaJDgGn"
 reqData.SetAddress(address)
 //Call the getNonce interface
 resData := testSdk.Account.GetNonce(reqData)

2. Building Operations
^^^^^^^^^^^^^^^^^^^^^^^

The operations refer to some of the actions that are done in the
transaction to facilitate serialization of transactions and evaluation
of fees. For example, to build an operation to send BU
(BUSendOperation), the specific interface call is as follows:

::

 var buSendOperation model.BUSendOperation
 buSendOperation.Init()
 var amount int64 = 100
 var address string = "buQVU86Jm4FeRW4JcQTD9Rx9NkUkHikYGp6z"
 buSendOperation.SetAmount(amount)
 buSendOperation.SetDestAddress(address)

3. Building Transaction Blob
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The building transaction blob interface is for generating transaction blob string. The specific interface call is as follows:

::

 //Initialize request parameters
 var reqDataBlob model.TransactionBuildBlobRequest
 reqDataBlob.SetSourceAddress(sourceAddress)
 reqDataBlob.SetFeeLimit(feeLimit)
 reqDataBlob.SetGasPrice(gasPrice)
 reqDataBlob.SetNonce(senderNonce)
 reqDataBlob.SetOperation(buSendOperation)
 //Call the BuildBlob interface
 resDataBlob := testSdk.Transaction.BuildBlob(reqDataBlob)

.. note:: The unit of gasPrice and feeLimit is MO，and 1 BU =10^8 MO.

4. Signing Transactions
^^^^^^^^^^^^^^^^^^^^^^^^

The signing transaction interface is used by the transaction initiator
to sign the transaction using the private key of the account. The specific
interface call is as follows:

::

 //Initialize request parameters
 PrivateKey := []string{"privbUPxs6QGkJaNdgWS2hisny6ytx1g833cD7V9C3YET9mJ25wdcq6h"}
 var reqData model.TransactionSignRequest
 reqData.SetBlob(resDataBlob.Result.Blob)
 reqData.SetPrivateKeys(PrivateKey)
 //Call the Sign interface
 resDataSign := testSdk.Transaction.Sign(reqData)

5. Broadcasting Transactions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The broadcasting transaction interface is used to send transactions to BU blockchain and trigger the execution of transactions.
The specific interface call is as follows:

::

 //Initialize request parameters
 var reqData model.TransactionSubmitRequest
 reqData.SetBlob(resDataBlob.Result.Blob)
 reqData.SetSignatures(resDataSign.Result.Signatures)
 //Call the Submit interface
 resDataSubmit := testSdk.Transaction.Submit(reqData)

Account Services
----------------

Account Services provide account-related interfaces, which include seven
interfaces: ``CheckValid``, ``Create``, ``GetInfo-Account``, ``GetNonce``,
``GetBalance-Account``, ``GetAssets`` and ``GetMetadata``.

CheckValid
~~~~~~~~~~

The ``CheckValid`` interface is used to check the validity of the account address.

The method to call this interface is as follows:

::

 CheckValid(model.AccountCheckValidRequest)model.AccountCheckValidResponse

The request parameter is shown in the following table:

+-----------+--------+-------------------------------------+
| Parameter | Type   | Description                         |
+===========+========+=====================================+
| address   | string | The account address to be checked   |
+-----------+--------+-------------------------------------+

The response data is shown in the following table:

+-----------+--------+-------------------------------------+
| Parameter | Type   | Description                         |
+===========+========+=====================================+
| IsValid   | string | Whether the account address is valid|
+-----------+--------+-------------------------------------+

The error code is shown in the following table:

+--------------+------------+--------------+
| Exception    | Error Code | Description  |
+==============+============+==============+
| SYSTEM_ERROR | 20000      | System error |
+--------------+------------+--------------+

The specific example is as follows:

::

   var reqData model.AccountCheckValidRequest
   address := "buQtfFxpQP9JCFgmu4WBojBbEnVyQGaJDgGn"
   reqData.SetAddress(address)
   resData := testSdk.Account.CheckValid(reqData)
   if resData.ErrorCode == 0 {
     fmt.Println(resData.Result.IsValid)
   }

Create
~~~~~~

The ``Create`` interface is used to generate private key.

The method to call this interface is as follows:

::

 Create() model.AccountCreateResponse

The response data is shown in the following table:

+------------+--------+-------------+
|Parameter   | Type   | Description |
+============+========+=============+
| PrivateKey | string | Private key |
+------------+--------+-------------+
| PublicKey  | string | Public key  |
+------------+--------+-------------+
| Address    | string | Address     |
+------------+--------+-------------+

The specific example is as follows:

::

 resData := testSdk.Account.Create()
 if resData.ErrorCode == 0 {
   fmt.Println("Address:",resData.Result.Address)
   fmt.Println("PrivateKey:",resData.Result.PrivateKey)
   fmt.Println("PublicKey:",resData.Result.PublicKey)
 }

GetInfo-Account
~~~~~~~~~~~~~~~

The ``GetInfo-Account`` interface is used to obtain the specified account information.

The method to call this interface is as follows:

::

 GetInfo(model.AccountGetInfoRequest) model.AccountGetInfoResponse

The request parameter is shown in the following table:

+-----------+--------+-------------------------------------+
| Parameter | Type   | Description                         |
+===========+========+=====================================+
| Address   | string | The account address to be checked   |
+-----------+--------+-------------------------------------+

The response data is shown in the following table:

+-----------+---------+-----------------------------------+
| Parameter | Type    | Description                       |
+===========+=========+===================================+
| Address   | string  | Account address                   |
+-----------+---------+-----------------------------------+
| Balance   | int64   | Account balance                   |
+-----------+---------+-----------------------------------+
| Nonce     | int64   | Account transaction serial number |
+-----------+---------+-----------------------------------+
| Priv      | `Priv`_ | Account privilege                 |
+-----------+---------+-----------------------------------+


The error code is shown in the following table:

+-----------------------+------------+-------------------------+
| Exception             | Error Code | Description             |
+=======================+============+=========================+
| INVALID_ADDRESS_ERROR | 11006      | Invalid address         |
+-----------------------+------------+-------------------------+
| CONNECTNETWORK_ERROR  | 11007      | Failed to connect to    |
|                       |            | the blockchain          |
+-----------------------+------------+-------------------------+
| SYSTEM_ERROR          | 20000      | System error            |
+-----------------------+------------+-------------------------+

The specific example is as follows:

::

 var reqData model.AccountGetInfoRequest
 var address string = "buQtfFxpQP9JCFgmu4WBojBbEnVyQGaJDgGn"
 reqData.SetAddress(address)
 resData := testSdk.Account.GetInfo(reqData)
 if resData.ErrorCode == 0 {
   data, _ := json.Marshal(resData.Result)
   fmt.Println("Info:", string(data))
 }

Interface Object Types
^^^^^^^^^^^^^^^^^^^^^^^

The description of interface object types of the ``GetInfo-Account`` interface is as follows.

Priv
++++

+--------------+----------------+-------------------+
| Parameter    | Type           | Description       |
+==============+================+===================+
| MasterWeight | int64          | Account weight    |
+--------------+----------------+-------------------+
| Signers      | [] `Signer`_   | Signer weight list|
+--------------+----------------+-------------------+
| Thresholds   | `Threshold`_   | Threshold         |
+--------------+----------------+-------------------+


Signer
++++++

+-------------+--------+-----------------------------------+
| Parameter   | Type   | Description                       |
+=============+========+===================================+
| Address     | string | The account address of the signer |
+-------------+--------+-----------------------------------+
| Weight      | int64  | Signer weight                     |
+-------------+--------+-----------------------------------+  

Threshold
+++++++++

+----------------+-------------------+------------------------------------------------+
| Parameter      | Type              | Description                                    |
+================+===================+================================================+
| TxThreshold    | string            | Transaction default threshold                  |
+----------------+-------------------+------------------------------------------------+
| TypeThresholds | `TypeThreshold`_  | Thresholds for different types of transactions |
+----------------+-------------------+------------------------------------------------+   

TypeThreshold
++++++++++++++

+-----------+-------+--------------------+
| Parameter | Type  | Description        |
+===========+=======+====================+
| Type      | int64 | The operation type |
+-----------+-------+--------------------+
| Threshold | int64 | The threshold      |
+-----------+-------+--------------------+

GetNonce
~~~~~~~~

The ``GetNonce`` interface is used to obtain the nonce value of the
specified account.

The method to call this interface is as follows:

::

 GetNonce(model.AccountGetNonceRequest)model.AccountGetNonceResponse

The request parameter is shown in the following table:

+--------------+--------+------------------------------------+
| Parameter    | Type   | Description                        |
+==============+========+====================================+
| Address      | string | The account address to be queried  |
+--------------+--------+------------------------------------+

The response data is shown in the following table:

+-----------+------+-----------------------------------+
| Parameter | Type | Description                       |
+===========+======+===================================+
| Nonce     | Long | Account transaction serial number |
+-----------+------+-----------------------------------+

The error code is shown in the following table:

+-----------------------+------------+-------------------------+
| Exception             | Error Code | Description             |
+=======================+============+=========================+
| INVALID_ADDRESS_ERROR | 11006      | Invalid address         |
+-----------------------+------------+-------------------------+
| CONNECTNETWORK_ERROR  | 11007      | Failed to connect to    |
|                       |            | the network             |
+-----------------------+------------+-------------------------+
| SYSTEM_ERROR          | 20000      | System error            |
+-----------------------+------------+-------------------------+

The specific example is as follows:

::

 var reqData model.AccountGetNonceRequest
 var address string = "buQtfFxpQP9JCFgmu4WBojBbEnVyQGaJDgGn"
 reqData.SetAddress(address)
 if resData.ErrorCode == 0 {
   fmt.Println(resData.Result.Nonce)
 }

GetBalance-Account
~~~~~~~~~~~~~~~~~~~

The ``GetBalance-Account`` interface is used to get the Balance value of the specific account.

The method to call this interface is as follows:

::

 GetBalance(model.AccountGetBalanceRequest)model.AccountGetBalanceResponse

The request parameter is shown in the following table:

+--------------+--------+------------------------------------+
| Parameter    | Type   | Description                        |
+==============+========+====================================+
| Address      | string | The account address to be queried  |
+--------------+--------+------------------------------------+

The response data is shown in the following table:

+-----------+-------+-------------------+
| Parameter | Type  | Description       |
+===========+=======+===================+
| Balance   | int64 | Account balance   |
+-----------+-------+-------------------+

The error code is shown in the following table:

+-----------------------+------------+-------------------------+
| Exception             | Error Code | Description             |
+=======================+============+=========================+
| INVALID_ADDRESS_ERROR | 11006      | Invalid address         |
+-----------------------+------------+-------------------------+
| CONNECTNETWORK_ERROR  | 11007      | Failed to connect to    |
|                       |            | the network             |
+-----------------------+------------+-------------------------+
| SYSTEM_ERROR          | 20000      | System error            |
+-----------------------+------------+-------------------------+

The specific example is as follows:

::

 var reqData model.AccountGetBalanceRequest
 var address string = "buQtfFxpQP9JCFgmu4WBojBbEnVyQGaJDgGn"
 reqData.SetAddress(address)
 resData := testSdk.Account.GetBalance(reqData)
 if resData.ErrorCode == 0 {
   fmt.Println("Balance", resData.Result.Balance)
 }

GetAssets
~~~~~~~~~~

The ``GetAssets`` interface is used to get the asset information of the specific account.

The method to call this interface is as follows:

::

 GetAssets(model.AccountGetAssetsRequest)model.AccountGetAssetsResponse

The request parameter is shown in the following table:

+--------------+--------+------------------------------------+
| Parameter    | Type   | Description                        |
+==============+========+====================================+
| Address      | string | The account address to be queried  |
+--------------+--------+------------------------------------+

The response data is shown in the following table:

+-----------+----------------+---------------+
| Parameter | Type           | Description   |
+===========+================+===============+
| Asset     | [] `Asset`_    | Account asset |
+-----------+----------------+---------------+

The error code is shown in the following table:

+-----------------------+------------+-------------------------+
| Exception             | Error Code | Description             |
+=======================+============+=========================+
| INVALID_ADDRESS_ERROR | 11006      | Invalid address         |
+-----------------------+------------+-------------------------+
| CONNECTNETWORK_ERROR  | 11007      | Failed to connect to    |
|                       |            | the network             |
+-----------------------+------------+-------------------------+
| SYSTEM_ERROR          | 20000      | System error            |
+-----------------------+------------+-------------------------+

The specific example is as follows:

::

 var reqData model.AccountGetAssetsRequest
 var address string = "buQtfFxpQP9JCFgmu4WBojBbEnVyQGaJDgGn"
 reqData.SetAddress(address)
 resData := testSdk.Account.GetAssets(reqData)
 if resData.ErrorCode == 0 {
   data, _ := json.Marshal(resData.Result.Assets)
   fmt.Println("Assets:", string(data))
 }

Interface Object Types
^^^^^^^^^^^^^^^^^^^^^^^

The description of interface object types of the ``GetAssets`` interface is as follows.

Asset
+++++

+-------------+---------+-----------------------------+
| Parameter   | Type    | Description                 |
+=============+=========+=============================+
| Key         | `key`_  | Unique identifier for asset |
+-------------+---------+-----------------------------+
| Amount      | int64   | Amount of assets            |
+-------------+---------+-----------------------------+

Key
++++

+-----------+--------+----------------------------------------+
| Parameter | Type   | Description                            |
+===========+========+========================================+
| Code      | String | Asset code                             |
+-----------+--------+----------------------------------------+
| Issuer    | String | The account address for issuing assets |
+-----------+--------+----------------------------------------+

GetMetadata
~~~~~~~~~~~~

The ``GetMetadata`` interface is used to get the Metadata information of the specific account.

The method to call this interface is as follows:

::

 GetMetadata(model.AccountGetMetadataRequest)model.AccountGetMetadataResponse

The request parameters are shown in the following table:

+-----------+--------+----------------------------------------------------+
| Parameter | Type   | Description                                        |
+===========+========+====================================================+
| Address   | String | Required, the account address to be queried        |
+-----------+--------+----------------------------------------------------+
| Key       | String | Optional, metadata keyword, length limit [1, 1024] |
+-----------+--------+----------------------------------------------------+

The response data is shown in the following table:

+-----------+-----------------------+-------------+
| Parameter | Type                  | Description |
+===========+=======================+=============+
| Metadatas | [] :ref:`Metadata-1`  | Account     |
+-----------+-----------------------+-------------+


The error code is shown in the following table:

+-----------------------+------------+----------------------------------------------+
| Exception             | Error Code | Description                                  |
+=======================+============+==============================================+
| INVALID_ADDRESS_ERROR | 11006      | Invalid address                              |
+-----------------------+------------+----------------------------------------------+
| CONNECTNETWORK_ERROR  | 11007      | Failed to connect to the network             |
+-----------------------+------------+----------------------------------------------+
| INVALID_DATAKEY_ERROR | 11011      | The length of key must be between 1 and 1024 |
+-----------------------+------------+----------------------------------------------+
| SYSTEM_ERROR          | 20000      | System error                                 |
+-----------------------+------------+----------------------------------------------+

The specific example is as follows:

::

 var reqData model.AccountGetMetadataRequest
 var address string = "buQemmMwmRQY1JkcU7w3nhruoX5N3j6C29uo"
 reqData.SetAddress(address)
 resData := testSdk.Account.GetMetadata(reqData)
 if resData.ErrorCode == 0 {
   data, _ := json.Marshal(resData.Result.Metadatas)
   fmt.Println("Metadatas:", string(data))
 }

Interface Object Types
^^^^^^^^^^^^^^^^^^^^^^^

The description of interface object types of the ``GetMetadata`` interface is as follows.

.. _Metadata-1:

Metadata
+++++++++

+-----------+--------+------------------+
| Parameter | Type   | Description      |
+===========+========+==================+
| Key       | string | Metadata keyword |
+-----------+--------+------------------+
| Value     | string | Metadata content |
+-----------+--------+------------------+
| Version   | int64  | Metadata version |
+-----------+--------+------------------+

Asset Services
--------------

Account Services provide an asset-related interface. Currently there is one interface: ``getInfo``.

GetInfo-Asset
~~~~~~~~~~~~~

The ``GetInfo-Asset`` interface is used to obtain the specified asset information of the specified account.

The method to call this interface is as follows:

::

 GetInfo(model.AssetGetInfoRequest) model.AssetGetInfoResponse

The request parameters are shown in the following table:

+-----------+--------+--------------------------------------------------+
| Parameter | Type   | Description                                      |
+===========+========+==================================================+
| Address   | String | Required, the account address to be queried      |
+-----------+--------+--------------------------------------------------+
| Code      | String | Required, asset code, length limit [1, 64]       |
+-----------+--------+--------------------------------------------------+
| Issuer    | String | Required, the account address for issuing assets |
+-----------+--------+--------------------------------------------------+

The response data is shown in the following table:

+-----------+------------------+---------------+
| Parameter | Type             | Description   |
+===========+==================+===============+
| Assets    | [] `asset`_      | Account asset |
+-----------+------------------+---------------+

The error code is shown in the following table:

+--------------------------+-----------+------------------+
| Exception                | Error Code| Description      |
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

The specific example is as follows:

::

 var reqData model.AssetGetInfoRequest
 var address string = "buQemmMwmRQY1JkcU7w3nhruoX5N3j6C29uo"
 reqData.SetAddress(address)
 reqData.SetIssuer("buQnc3AGCo6ycWJCce516MDbPHKjK7ywwkuo")
 reqData.SetCode("HNC")
 resData := testSdk.Token.Asset.GetInfo(reqData)
 if resData.ErrorCode == 0 {
   data, _ := json.Marshal(resData.Result.Assets)
   fmt.Println("Assets:", string(data))
 }

Contract Services
------------------

Contract Services provide contract-related interfaces and currently have
one interfaces:``GetInfo``.

GetInfo-contract
~~~~~~~~~~~~~~~~

The ``GetInfo-contract`` interface is used to get contract information.

The method to call this interface is as follows:

::

 GetInfo(model.ContractGetInfoRequest) model.ContractGetInfoResponse

The request parameter is shown in the following table:

+-----------------+--------+----------------------------------------------------+
| Parameter       | Type   | Description                                        |
+=================+========+====================================================+
| contractAddress | string | Required, contract address of token to be verified |
+-----------------+--------+----------------------------------------------------+


The response data is shown in the following table:

+-----------+--------+-----------------------------+
| Parameter | Type   | Description                 |
+===========+========+=============================+
| Type      | int64  | Contract type, 0 is default |
+-----------+--------+-----------------------------+
| Payload   | string | Contract code               |
+-----------+--------+-----------------------------+

The error code is shown in the following table:

+-------------------------+------------+------------------+
| Exception               | Error Code | Description      | 
+=========================+============+==================+
| INVALID_CONTRACTADDRESS | 11037      | Invalid contract |
| _ERROR                  |            | address          |
+-------------------------+------------+------------------+
| CONTRACTADDRESS_NOT_CON | 11038      | contractAddress  |
| TRACTACCOUNT_ERROR      |            | is not a         |
|                         |            | contract account |
+-------------------------+------------+------------------+
| CONNECTNETWORK_ERROR    | 11007      | Failed to connect|
|                         |            | to the network   |
+-------------------------+------------+------------------+
| SYSTEM_ERROR            | 20000      | System error     |
+-------------------------+------------+------------------+

The specific example is as follows:

::

 var reqData model.ContractGetInfoRequest
 var address string = "buQfnVYgXuMo3rvCEpKA6SfRrDpaz8D8A9Ea"
 reqData.SetAddress(address)
 resData := testSdk.Contract.GetInfo(reqData)
 if resData.ErrorCode == 0 {
   data, _ := json.Marshal(resData.Result.Contract)
   fmt.Println("Contract:", string(data))
 }

Transaction Services
---------------------

Transaction Services provide transaction-related interfaces and
currently have five interfaces:``EvaluateFee``, ``BuildBlob``, ``Sign``, ``Submit`` and 
``GetInfo-transaction``.

EvaluateFee
~~~~~~~~~~~

The ``EvaluateFee`` interface implements the cost estimate for the
transaction.

The method to call this interface is as follows:

::

 EvaluateFee(model.TransactionEvaluateFeeRequest)model.TransactionEvaluateFeeResponse

The request parameters are shown in the following table:


+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| sourceAddress     | String              | Required, the source       |
|                   |                     | account address issuing    |
|                   |                     | the operation              |
+-------------------+---------------------+----------------------------+
| nonce             | int64               | Required, transaction      |
|                   |                     | serial number to be        |
|                   |                     | initiated, size limit      |
|                   |                     | [1,max(int64)]             |
+-------------------+---------------------+----------------------------+
| operations        | list.List           | Required, list of          |
|                   |                     | operations to be committed |
|                   |                     | which cannot be empty      |
+-------------------+---------------------+----------------------------+
| signtureNumber    | string              | Optional, the number of    |
|                   |                     | people to sign, the        |
|                   |                     | default is 1, size limit   |
|                   |                     | [1,max(int32)]             |
+-------------------+---------------------+----------------------------+
| metadata          | string              | Optional, note             |
+-------------------+---------------------+----------------------------+
| ceilLedgerSeq     | int64               | Optional, set a value      |
|                   |                     | which will be combined     |
|                   |                     | with the current block     |
|                   |                     | height to restrict         |
|                   |                     | transactions. If           |
|                   |                     | transactions do not        |
|                   |                     | complete within the set    |
|                   |                     | value plus the current     |
|                   |                     | block height, the          |
|                   |                     | transactions fail. The     |
|                   |                     | value you set must be      |
|                   |                     | greater than 0. If the     |
|                   |                     | value is set to 0, no      |
|                   |                     | limit is set.              |
+-------------------+---------------------+----------------------------+

The response data is shown in the following table:

+----------+-------+-------------------------------------------+
| Parameter| Type  | Description                               |
+==========+=======+===========================================+
| FeeLimit | int64 | Minimum fees required for the transaction |
+----------+-------+-------------------------------------------+
| GasPrice | int64 | Transaction gas price                     |
+----------+-------+-------------------------------------------+

The error code is shown in the following table:

+-------------------------+------------+------------------+
| Exception               | Error Code | Description      |
+=========================+============+==================+
| INVALID_SOURCEADDRESS   | 11002      | Invalid          |
| _ERROR                  |            | sourceAddress    |
+-------------------------+------------+------------------+
| INVALID_NONCE_ERROR     | 11048      | Nonce must be    |
|                         |            | between 1 and    |
|                         |            | max(int64)       |
+-------------------------+------------+------------------+
| INVALID_OPERATIONS      | 11051      | Operations       |
| _ERROR                  |            | cannot be        |
|                         |            | resolved         |
+-------------------------+------------+------------------+
| OPERATIONS_ONE_ERROR    | 11053      | One of the       |
|                         |            | operations cannot|
|                         |            | be resolved      |
+-------------------------+------------+------------------+
| INVALID_SIGNATURENUMBER | 11054      | SignatureNumber  |
| _ERROR                  |            | must be between  |
|                         |            | 1 and max(int32) |
+-------------------------+------------+------------------+
| SYSTEM_ERROR            | 20000      | System error     |
+-------------------------+------------+------------------+  

The specific example is as follows:

::

   var reqDataOperation model.BUSendOperation
   reqDataOperation.Init()
   var amount int64 = 100
   reqDataOperation.SetAmount(amount)
   var destAddress string = "buQVU86Jm4FeRW4JcQTD9Rx9NkUkHikYGp6z"
   reqDataOperation.SetDestAddress(destAddress)

   var reqDataEvaluate model.TransactionEvaluateFeeRequest
   var sourceAddress string = "buQVU86Jm4FeRW4JcQTD9Rx9NkUkHikYGp6z"
   reqDataEvaluate.SetSourceAddress(sourceAddress)
   var nonce int64 = 88
   reqDataEvaluate.SetNonce(nonce)
   var signatureNumber string = "3"
   reqDataEvaluate.SetSignatureNumber(signatureNumber)
   var SetCeilLedgerSeq int64 = 50
   reqDataEvaluate.SetCeilLedgerSeq(SetCeilLedgerSeq)
   reqDataEvaluate.SetOperation(reqDataOperation)
   resDataEvaluate := testSdk.Transaction.EvaluateFee(reqDataEvaluate)
   if resDataEvaluate.ErrorCode == 0 {
       data, _ := json.Marshal(resDataEvaluate.Result)
       fmt.Println("Evaluate:", string(data))
   }

BuildBlob
~~~~~~~~~


The ``BuildBlob`` interface is used to serialize transactions and generate
transaction blob strings for network transmission.

Before you can call buildBlob, you need to build some
operations. There are 16 operations, please refer to `BaseOperation`_.

The method to call this interface is as follows:

::
 
 BuildBlob(model.TransactionBuildBlobRequest)model.TransactionBuildBlobResponse

The request parameters are shown in the following table:

+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| sourceAddress     | string              | Required, the source       |
|                   |                     | account address initiating |
|                   |                     | the operation              |
+-------------------+---------------------+----------------------------+
| nonce             | int64               | Required, the transaction  |
|                   |                     | serial number to be        |
|                   |                     | initiated, add 1 in the    |
|                   |                     | function, size limit       |
|                   |                     | [1,max(int64)]             |
+-------------------+---------------------+----------------------------+
| gasPrice          | int64               | Required, transaction gas  |
|                   |                     | price, unit MO, 1 BU =     |
|                   |                     | 10^8 MO, size limit [1000, |
|                   |                     | max(int64)]                |
+-------------------+---------------------+----------------------------+
| feeLimit          | int64               | Required, the minimum fees |
|                   |                     | required for the           |
|                   |                     | transaction, unit MO, 1 BU |
|                   |                     | = 10^8 MO, size limit [1,  |
|                   |                     | max(int64)]                |
+-------------------+---------------------+----------------------------+
| operation         | list.List           | Required, list of          |
|                   |                     | operations to be committed |
|                   |                     | which cannot be empty      |
+-------------------+---------------------+----------------------------+
| ceilLedgerSeq     | int64               | Optional, set a value      |
|                   |                     | which will be combined     |
|                   |                     | with the current block     |
|                   |                     | height to restrict         |
|                   |                     | transactions. If           |
|                   |                     | transactions do not        |
|                   |                     | complete within the set    |
|                   |                     | value plus the current     |
|                   |                     | block height, the          |
|                   |                     | transactions fail. The     |
|                   |                     | value you set must be      |
|                   |                     | greater than 0. If the     |
|                   |                     | value is set to 0, no      |
|                   |                     | limit is set.              |
+-------------------+---------------------+----------------------------+
| metadata          | string              | Optional, note             |
+-------------------+---------------------+----------------------------+

The response data is shown in the following table:

+-----------------+--------+-----------------------------------+
| Parameter       | Type   | Description                       |
+=================+========+===================================+
| TransactionBlob | string | Serialized transaction hex string |
+-----------------+--------+-----------------------------------+

The error code is shown in the following table:

+-------------------------+------------+------------------+
| Exception               | Error Code | Description      |
+=========================+============+==================+
| INVALID_SOURCEADDRESS   | 11002      | Invalid          |
| _ERROR                  |            | sourceAddress    |
+-------------------------+------------+------------------+
| INVALID_NONCE_ERROR     | 11048      | Nonce must be    |
|                         |            | between 1 and    |
|                         |            | max(int64)       |
+-------------------------+------------+------------------+
| INVALID_DESTADDRESS     | 11003      | Invalid          |
| _ERROR                  |            | destAddress      |
+-------------------------+------------+------------------+
| INVALID_INITBALANCE     | 11004      | InitBalance must |
| _ERROR                  |            | be between 1 and |
|                         |            | max(int64)       |
+-------------------------+------------+------------------+
| SOURCEADDRESS_EQUAL     | 11005      | SourceAddress    |
| _DESTADDRESS_ERROR      |            | cannot be equal  |
|                         |            | to destAddress   |
+-------------------------+------------+------------------+
| INVALID_ISSUE_AMMOUNT   | 11008      | AssetAmount to   |
| _ERROR                  |            | be issued        |
|                         |            | must be between  |
|                         |            | 1 and max(int64) |
+-------------------------+------------+------------------+
| INVALID_DATAKEY_ERROR   | 11011      | The length of    |
|                         |            | key must be      |
|                         |            | between 1 and    |
|                         |            | 1024             |
+-------------------------+------------+------------------+
| INVALID_DATAVALUE_ERROR | 11012      | The length of    |
|                         |            | value must be    |
|                         |            | between 0 and    |
|                         |            | 256k             |
+-------------------------+------------+------------------+
| INVALID_DATAVERSION     | 11013      | The version must |
| _ERROR                  |            | be greater than  |
|                         |            | or equal to 0    |
+-------------------------+------------+------------------+
| INVALID_MASTERWEIGHT    | 11015      | MasterWeight     |
| _ERROR                  |            | must be between  |
|                         |            | 0 and            |
|                         |            | max(uint32)      |
+-------------------------+------------+------------------+
| INVALID_SIGNER_ADDRESS  | 11016      | Invalid signer   |
| _ERROR                  |            | address          |
+-------------------------+------------+------------------+
| INVALID_SIGNER_WEIGHT   | 11017      | Signer weight    |
| _ERROR                  |            | must be between  |
|                         |            | 0 and            |
|                         |            | max(uint32)      |
+-------------------------+------------+------------------+
| INVALID_TX_THRESHOLD    | 11018      | TxThreshold must |
| _ERROR                  |            | be between 0 and |
|                         |            | max(int64)       |
+-------------------------+------------+------------------+
| INVALID_OPERATION_TYPE  | 11019      | Operation type   |
| _ERROR                  |            | must be between  |
|                         |            | 1 and 100        |
+-------------------------+------------+------------------+
| INVALID_TYPE_THRESHOLD  | 11020      | TypeThreshold    |
| _ERROR                  |            | must be between  |
|                         |            | 0 and max(int64) |
+-------------------------+------------+------------------+
| INVALID_ASSET_CODE      | 11023      | The length of    |
| _ERROR                  |            | code must be     |
|                         |            | between 1 and 64 |
+-------------------------+------------+------------------+
| INVALID_ASSET_AMOUNT    | 11024      | AssetAmount must |
| _ERROR                  |            | be between 0 and |
|                         |            | max(int64)       |
+-------------------------+------------+------------------+
| INVALID_BU_AMOUNT_ERROR | 11026      | BuAmount must be |
|                         |            | between 0 and    |
|                         |            | max(int64)       |
+-------------------------+------------+------------------+
| INVALID_ISSUER_ADDRESS  | 11027      | Invalid issuer   |
| _ERROR                  |            | address          |
+-------------------------+------------+------------------+
| NO_SUCH_TOKEN_ERROR     | 11030      | The length of    |
|                         |            | ctp must be      |
|                         |            | between 1 and 64 |
+-------------------------+------------+------------------+
| INVALID_TOKEN_NAME      | 11031      | The length of    |
| _ERROR                  |            | token name must  |
|                         |            | be between 1 and |
|                         |            | 1024             |
+-------------------------+------------+------------------+
| INVALID_TOKEN_SYMBOL    | 11032      | The length of    |
| _ERROR                  |            | symbol must be   |
|                         |            | between 1 and    |
|                         |            | 1024             |
+-------------------------+------------+------------------+
| INVALID_TOKEN_DECIMALS  | 11033      | Decimals must be |
| _ERROR                  |            | between 0 and 8  |
+-------------------------+------------+------------------+
| INVALID_TOKEN_TOTALSUPP | 11034      | TotalSupply must |
| LY_ERROR                |            | be between 1 and |
|                         |            | max(int64)       |
+-------------------------+------------+------------------+
| INVALID_TOKENOWNER      | 11035      | Invalid token    |
| _ERRP                   |            | owner            |
+-------------------------+------------+------------------+
| INVALID_CONTRACTADDRESS | 11037      | Invalid contract |
| _ERROR                  |            | address          |
+-------------------------+------------+------------------+
| CONTRACTADDRESS_NOT     | 11038      | ContractAddress  |
| _CONTRACTACCOUNT_ERRO   |            | is not a         |
|                         |            | contract account |
+-------------------------+------------+------------------+
| INVALID_TOKEN_AMOUNT    | 11039      | Amount           |
| _ERROR                  |            | must be between  |
|                         |            | 1 and max(int64) |
+-------------------------+------------+------------------+
| SOURCEADDRESS_EQUAL     | 11040      | SourceAddress    |
| _CONTRACTADDRESS_ERROR  |            | cannot be equal  |
|                         |            | to               |
|                         |            | contractAddress  |
+-------------------------+------------+------------------+
| INVALID_FROMADDRESS     | 11041      | Invalid          |
| _ERROR                  |            | fromAddress      |
+-------------------------+------------+------------------+
| FROMADDRESS_EQUAL_DESTA | 11042      | FromAddress      |
| DDRESS_ERROR            |            | cannot be equal  |
|                         |            | to destAddress   |
+-------------------------+------------+------------------+
| INVALID_SPENDER_ERROR   | 11043      | Invalid spender  |
+-------------------------+------------+------------------+
| PAYLOAD_EMPTY_ERROR     | 11044      | Payload cannot   |
|                         |            | be empty         |
+-------------------------+------------+------------------+
| INVALID_LOG_TOPIC       | 11045      | The length of    |
| _ERROR                  |            | log topic must   |
|                         |            | be between 1     |
|                         |            | and 128          |
+-------------------------+------------+------------------+
| INVALID_LOG_DATA        | 11046      | The length of    |
| _ERROR                  |            | log data must be |
|                         |            | between 1 and    |
|                         |            | 1024             |
+-------------------------+------------+------------------+
| INVALID_CONTRACT_TYPE   | 11047      | Type must be     |
| _ERROR                  |            | greater than or  |
|                         |            | equal to 0       |
+-------------------------+------------+------------------+
| INVALID_NONCE_ERROR     | 11048      | Nonce must be    |
|                         |            | between 1 and    |
|                         |            | max(int64)       |
+-------------------------+------------+------------------+
| INVALID_GASPRICE        | 11049      | GasPrice must be |
| _ERROR                  |            | between 1000 and |
|                         |            | max(int64)       |
+-------------------------+------------+------------------+
| INVALID_FEELIMIT_ERROR  | 11050      | FeeLimit must be |
|                         |            | between 1 and    |
|                         |            | max(int64)       |
+-------------------------+------------+------------------+
| OPERATIONS_EMPTY_ERROR  | 11051      | Operations       |
|                         |            | cannot be empty  |
+-------------------------+------------+------------------+
| INVALID_CEILLEDGERSEQ   | 11052      | CeilLedgerSeq    |
| _ERROR                  |            | must be equal or |
|                         |            | greater than 0   |
+-------------------------+------------+------------------+
| OPERATIONS_ONE_ERROR    | 11053      | One of the       |
|                         |            | operations       |
|                         |            | cannot be        |
|                         |            | resolved         |
+-------------------------+------------+------------------+
| SYSTEM_ERROR            | 20000      | System error     |
+-------------------------+------------+------------------+

The specific example is as follows:

::

   var reqDataOperation model.BUSendOperation
   reqDataOperation.Init()
   var amount int64 = 100
   var destAddress string = "buQVU86Jm4FeRW4JcQTD9Rx9NkUkHikYGp6z"
   reqDataOperation.SetAmount(amount)
   reqDataOperation.SetDestAddress(destAddress)

   var reqDataBlob model.TransactionBuildBlobRequest
   var sourceAddressBlob string = "buQemmMwmRQY1JkcU7w3nhruoX5N3j6C29uo"
   reqDataBlob.SetSourceAddress(sourceAddressBlob)
   var feeLimit int64 = 1000000000
   reqDataBlob.SetFeeLimit(feeLimit)
   var gasPrice int64 = 1000
   reqDataBlob.SetGasPrice(gasPrice)
   var nonce int64 = 88
   reqDataBlob.SetNonce(nonce)
   reqDataBlob.SetOperation(reqDataOperation)

   resDataBlob := testSdk.Transaction.BuildBlob(reqDataBlob)
   if resDataBlob.ErrorCode == 0 {
       fmt.Println("Blob:", resDataBlob.Result)
   }



BaseOperation
^^^^^^^^^^^^^

Before calling the BuildBlob interface, some operation objects shall be built, and now we have 16 operation objects:
``AccountActivateOperation``, ``AccountSetMetadataOperation``, ``AccountSetPrivilegeOperation``,
``AssetIssueOperation``, ``AssetSendOperation``, ``BUSendOperation``, ``Ctp10TokenIssueOperation``,
``Ctp10TokenTransferOperation``, ``Ctp10TokenTransferFromOperation``, ``Ctp10TokenApproveOperation``,
``Ctp10TokenAssignOperation``, ``Ctp10TokenChangeOwnerOperation``, ``ContractCreateOperation``,
``ContractInvokeByAssetOperation``, ``ContractInvokeByBUOperation`` and ``LogCreateOperation``。

AccountActivateOperation

+----------------+---------+-------------------------------------------+
| Parameter      | Type    | Description                               |
+================+=========+===========================================+
| sourceAddress  | string  | Optional, source account address of the   |
|                |         | operation                                 |
+----------------+---------+-------------------------------------------+
| destAddress    | string  | Required, target account address          |
+----------------+---------+-------------------------------------------+
| initBalance    | int64   | Required, initialize the asset,           |
|                |         | size [1, max(int64)]                      |
+----------------+---------+-------------------------------------------+
| metadata       | string  | Optional, note                            |
+----------------+---------+-------------------------------------------+

AccountSetMetadataOperation

+---------------+---------+------------------------------------------------------+
| Parameter     | Type    | Description                                          |
+===============+=========+======================================================+
| sourceAddress | string  | Optional, source account address of the operation    |
+---------------+---------+------------------------------------------------------+
| key           | string  | Required, metadata keyword, length limit [1, 1024]   |
+---------------+---------+------------------------------------------------------+
| value         | string  | Optional, metadata content, length limit [0, 256000] |
+---------------+---------+------------------------------------------------------+
| version       | int64   | Optional, metadata version                           |
+---------------+---------+------------------------------------------------------+
| deleteFlag    | bool    | Optional, whether to delete metadata                 |
+---------------+---------+------------------------------------------------------+
| metadata      | string  | Optional, note                                       |
+---------------+---------+------------------------------------------------------+

AccountSetPrivilegeOperation

+------------------+-----------------+--------------------------------------+
| Parameter        | Type            | Description                          |
+==================+=================+======================================+
| sourceAddress    | string          | Optional, source account address of  |
|                  |                 | the operation                        |
+------------------+-----------------+--------------------------------------+
| masterWeight     | string          | Optional, account weight, size limit |
|                  |                 | [0, max(uint32)]                     |
+------------------+-----------------+--------------------------------------+
| signers          | [] `Signer`_    | Optional, signer weight list         |
+------------------+-----------------+--------------------------------------+
| txThreshold      | string          | Optional, transaction threshold,     |
|                  |                 | size limit [0, max(int64)]           |
+------------------+-----------------+--------------------------------------+
| typeThreshold    | `TypeThreshold`_| Optional, specify transaction        |
|                  |                 | threshold                            |
+------------------+-----------------+--------------------------------------+
| metadata         | string          | Optional, note                       |
+------------------+-----------------+--------------------------------------+

AssetIssueOperation

+-------------------+-------------+------------------------------------+
| Parameter         | Type        | Description                        |
+===================+=============+====================================+
| sourceAddress     | string      | Optional, source account address   |
|                   |             | of the operation                   |
+-------------------+-------------+------------------------------------+
| code              | string      | Required, asset code, length limit |
|                   |             | [1, 64]                            |
+-------------------+-------------+------------------------------------+
| amount            | int64       | Required, number of asset issues,  |
|                   |             | size limit [0, max(int64)]         |
+-------------------+-------------+------------------------------------+
| metadata          | string      | Optional, note                     |
+-------------------+-------------+------------------------------------+

AssetSendOperation

+-----------------------+----------+-----------------------+
| Parameter             | Type     | Description           |
+=======================+==========+=======================+
| sourceAddress         | string   | Optional, source      |
|                       |          | account address of    |
|                       |          | the operation         |
+-----------------------+----------+-----------------------+
| destAddress           | string   | Required, target      |
|                       |          | account address       |
+-----------------------+----------+-----------------------+
| code                  | string   | Required, asset code, |
|                       |          | length limit [1, 64]  |
+-----------------------+----------+-----------------------+
| issuer                | string   | Required, account     |
|                       |          | address issuing       |
|                       |          | assets                |
+-----------------------+----------+-----------------------+
| amount                | int64    | Required, asset       |
|                       |          | quantity, size limit  |
|                       |          | [0, max(int64)]       |
+-----------------------+----------+-----------------------+
| metadata              | string   | Optional, note        |
+-----------------------+----------+-----------------------+

BUSendOperation

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | string       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| destAddress        | string       | Required, target account address |
+--------------------+--------------+----------------------------------+
| amount             | int64        | Required, amount of asset        |
|                    |              | issued, size limit [0,           |
|                    |              | max(int64)]                      |
+--------------------+--------------+----------------------------------+
| metadata           | string       | Optional, note                   |
+--------------------+--------------+----------------------------------+

Ctp10TokenIssueOperation

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | string       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| initBalance        | int64        | Required, initial assets for the |
|                    |              | contract account,                |
|                    |              |  size limit [1,max(64)]          |
+--------------------+--------------+----------------------------------+
| name               | string       | Required, token name,            |
|                    |              | length limit [1, 1024]           |
+--------------------+--------------+----------------------------------+
| symbol             | string       | Required, token symbol,          |
|                    |              | length limit [1, 1024]           |
+--------------------+--------------+----------------------------------+
| decimals           | int64        | Required, the precision of the   |
|                    |              | number of tokens, size limit     |
|                    |              | [0, 8]                           |
+--------------------+--------------+----------------------------------+
| supply             | int64        | Required, total supply of issued |
|                    |              | token,size limit [1, max(int64)] |
+--------------------+--------------+----------------------------------+
| metadata           | string       | Optional, note                   |
+--------------------+--------------+----------------------------------+

Ctp10TokenTransferOperation

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | string       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| contractAddress    | string       | Required, contract account       |
|                    |              | address                          |
+--------------------+--------------+----------------------------------+
| destAddress        | string       | Required, target account address |
|                    |              | to which token is transferred    |
+--------------------+--------------+----------------------------------+
| amount             | int64        | Required, amount of tokens to be |
|                    |              | transferred, size limit [1,      |
|                    |              | max(int64)]                      |
+--------------------+--------------+----------------------------------+
| metadata           | string       | Optional, note                   |
+--------------------+--------------+----------------------------------+

Ctp10TokenTransferFromOperation

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | string       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| contractAddress    | string       | Required, contract account       |
|                    |              | address                          |
+--------------------+--------------+----------------------------------+
| fromAddress        | string       | Required, source account address |
|                    |              | from which token is transferred  |
+--------------------+--------------+----------------------------------+
| destAddress        | string       | Required, target account address |
|                    |              | to which token is transferred    |
+--------------------+--------------+----------------------------------+
| amount             | int64        | Required, amount of tokens       |
|                    |              | to be transferred, size limit    |
|                    |              | [1, max(int64)]                  |
+--------------------+--------------+----------------------------------+
| metadata           | string       | Optional, note                   |
+--------------------+--------------+----------------------------------+

Ctp10TokenApproveOperation

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | string       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| contractAddress    | string       | Required, contract account       |
|                    |              | address                          |
+--------------------+--------------+----------------------------------+
| spender            | string       | Required, authorized account     |
|                    |              | address                          |
+--------------------+--------------+----------------------------------+
| amount             | int64        | Required, the number of          |
|                    |              | authorized tokens to be          |
|                    |              | transferred, size limit [1,      |
|                    |              | max(int64)]                      |
+--------------------+--------------+----------------------------------+
| metadata           | string       | Optional, note                   |
+--------------------+--------------+----------------------------------+

Ctp10TokenAssignOperation

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | string       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| contractAddress    | string       | Required, contract account       |
|                    |              | address                          |
+--------------------+--------------+----------------------------------+
| destAddress        | string       | Required, target account address |
|                    |              | to be assigned                   |
+--------------------+--------------+----------------------------------+
| amount             | int64        | Required, amount of tokens       |
|                    |              | to be allocated, size limit [1,  |
|                    |              | max(int64)]                      |
+--------------------+--------------+----------------------------------+
| metadata           | string       | Optional, note                   |
+--------------------+--------------+----------------------------------+

Ctp10TokenChangeOwnerOperation

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | string       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| contractAddress    | string       | Required, contract account       |
|                    |              | address                          |
+--------------------+--------------+----------------------------------+
| tokenOwner         | string       | Required, target account address |
|                    |              | to which token is transferred    |
+--------------------+--------------+----------------------------------+
| metadata           | string       | Optional, note                   |
+--------------------+--------------+----------------------------------+


ContractCreateOperation

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | string       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| initBalance        | int64        | Required, initial asset for      |
|                    |              | contract account,                |
|                    |              | size limit [1, max(int64)]       |
+--------------------+--------------+----------------------------------+
| payload            | string       | Required, contract code for the  |
|                    |              | corresponding language           |
+--------------------+--------------+----------------------------------+
| initInput          | string       | Optional, the input parameters   |
|                    |              | of the init method in the        |
|                    |              | contract code                    |
+--------------------+--------------+----------------------------------+
| metadata           | string       | Optional, note                   |
+--------------------+--------------+----------------------------------+

ContractInvokeByAssetOperation

+--------------------+--------------+----------------------------------+
| Parameter          | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | string       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| contractAddress    | string       | Required, contract account       |
|                    |              | address                          |
+--------------------+--------------+----------------------------------+
| code               | string       | Optional, asset code, length     |
|                    |              | limit [0, 64]; when it is        |
|                    |              | empty, only the contract is      |
|                    |              | triggered                        |
+--------------------+--------------+----------------------------------+
| issuer             | string       | Optional, the account address    |
|                    |              | issuing assets; when it is null, |
|                    |              | only trigger the contract        |
+--------------------+--------------+----------------------------------+
| amount             | int64        | Optional, asset quantity, size   |
|                    |              | limit [0, max(int64)], when      |
|                    |              | it is 0, only trigger the        |
|                    |              | contract                         |
+--------------------+--------------+----------------------------------+
| input              | string       | Optional, the input parameter of |
|                    |              | the main() method for the        |
|                    |              | contract to be triggered         |
+--------------------+--------------+----------------------------------+
| metadata           | string       | Optional, note                   |
+--------------------+--------------+----------------------------------+

ContractInvokeByBUOperation

+--------------------+--------------+----------------------------------+
| Member             | Type         | Description                      |
+====================+==============+==================================+
| sourceAddress      | string       | Optional, source account address |
|                    |              | of the operation                 |
+--------------------+--------------+----------------------------------+
| contractAddress    | string       | Required, contract account       |
|                    |              | address                          |
+--------------------+--------------+----------------------------------+
| amount             | int64        | Optional, number of asset        |
|                    |              | issues, size limit [0,max(int64)]|
|                    |              | when it is 0,                    |
|                    |              | only triggers the contract       |
+--------------------+--------------+----------------------------------+
| input              | string       | Optional, the input parameter of |
|                    |              | the main() method for the        |
|                    |              | contract to be triggered         |
+--------------------+--------------+----------------------------------+
| metadata           | string       | Optional, note                   |
+--------------------+--------------+----------------------------------+

LogCreateOperation

+--------------------+--------------+------------------------------------+
| Member             | Type         | Description                        |
+====================+==============+====================================+
| sourceAddress      | string       | Optional, source account address   |
|                    |              | of the operation                   |
+--------------------+--------------+------------------------------------+
| topic              | string       | Required,log topic,                |
|                    |              | size limit [1, 128]                |
+--------------------+--------------+------------------------------------+
| data               | []string     | Required,log content, the length   |
|                    |              | of each string is between [1, 1024]|
+--------------------+--------------+------------------------------------+
| metadata           | string       | Optional, note                     |
+--------------------+--------------+------------------------------------+

Sign
~~~~

The ``Sign`` interface is used to sign the transactions.

The method to call this interface is as follows:

::

 Sign(model.TransactionSignRequest) model.TransactionSignResponse

The request parameters are shown in the following table:

+-------------+----------+-------------------------------------------------+
| Parameter   | Type     | Description                                     |
+=============+==========+=================================================+
| blob        | string   | Required, pending transaction blob to be signed |
+-------------+----------+-------------------------------------------------+
| privateKeys | []string | Required, private key list                      |
+-------------+----------+-------------------------------------------------+


The response data is shown in the following table:

+------------+------------------+------------------+
| Parameter  | Type             | Description      |
+============+==================+==================+
| Signatures | [] `signature`_  | Signed data list |
+------------+------------------+------------------+

The error code is shown in the following table:

+------------------------+------------+-----------------------------------------+
| Exception              | Error Code | Description                             |
+========================+============+=========================================+
| INVALID_BLOB_ERROR     | 11056      | Invalid blob                            |
+------------------------+------------+-----------------------------------------+
| PRIVATEKEY_NULL_ERROR  | 11057      | PrivateKeys cannot be empty             |
+------------------------+------------+-----------------------------------------+
| PRIVATEKEY_ONE_ERROR   | 11058      | One of privateKeys error                |
+------------------------+------------+-----------------------------------------+
| GET_ENCPUBLICKEY_ERROR | 14000      | The function `GetEncPublicKey` failed   |
+------------------------+------------+-----------------------------------------+
| SIGN_ERROR             | 14001      | The function `Sign` failed              |
+------------------------+------------+-----------------------------------------+
| SYSTEM_ERROR           | 20000      | System error                            |
+------------------------+------------+-----------------------------------------+

The specific example is as follows:

::

   PrivateKey := []string{"privbUPxs6QGkJaNdgWS2hisny6ytx1g833cD7V9C3YET9mJ25wdcq6h"}
   var reqData model.TransactionSignRequest
   reqData.SetBlob(resDataBlob.Result.Blob)
   reqData.SetPrivateKeys(PrivateKey)
   resDataSign := testSdk.Transaction.Sign(reqData)
   if resDataSign.ErrorCode == 0 {
       fmt.Println("Sign:", resDataSign.Result)
   }

Interface Object Types
^^^^^^^^^^^^^^^^^^^^^^^^

The description of interface object types of the ``Sign`` interface is as follows.

Signature
+++++++++

+-----------+-------+-------------+
| Member    | Type  | Description |
+===========+=======+=============+
| signData  | int64 | Data signed |
+-----------+-------+-------------+
| publicKey | int64 | Public key  |
+-----------+-------+-------------+


Submit
~~~~~~

The ``Submit`` interface is used to submit transactions.

The method to call this interface is as follows:

::
 
 Submit(model.TransactionSubmitRequest) model.TransactionSubmitResponse

The request parameters are shown in the following table:

+-----------+------------------+----------------------------+
| Parameter | Type             | Description                |
+===========+==================+============================+
| blob      | string           | Required, transaction blob |
+-----------+------------------+----------------------------+
| signature | [] `signature`_  | Required, signature list   |
+-----------+------------------+----------------------------+

The response data is shown in the following table:

+-----------+--------+------------------+
| Parameter | Type   | Description      |
+===========+========+==================+
| hash      | string | Transaction hash |
+-----------+--------+------------------+

The error code is shown in the following table:

+--------------------+------------+--------------+
| Exception          | Error Code | Description  |
+====================+============+==============+
| INVALID_BLOB_ERROR | 11052      | Invalid blob |
+--------------------+------------+--------------+
| SYSTEM_ERROR       | 20000      | System error |
+--------------------+------------+--------------+

The specific example is as follows:

::

   var reqData model.TransactionSubmitRequest
   reqData.SetBlob(resDataBlob.Result.Blob)
   reqData.SetSignatures(resDataSign.Result.Signatures)
   resDataSubmit := testSdk.Transaction.Submit(reqData.Result)
   if resDataSubmit.ErrorCode == 0 {
       fmt.Println("Hash:", resDataSubmit.Result.Hash)
   }

GetInfo-transaction
~~~~~~~~~~~~~~~~~~~~

The ``GetInfo-transaction`` interface is used to check transactions information by the hash value. 

The method to call this interface is as follows:

::

 GetInfo(model.TransactionGetInfoRequest)model.TransactionGetInfoResponse

The request parameter is shown in the following table:

+-----------+--------+------------------+
| Parameter | Type   | Description      |
+===========+========+==================+
| hash      | string | Transaction hash |
+-----------+--------+------------------+

The response data is shown in the following table:

+---------------+---------------------------+-----------------------+
| Parameter     | Type                      | Description           |            
+===============+===========================+=======================+
| TotalCount    | int64                     | Total number of       |       
|               |                           | transactions returned |
+---------------+---------------------------+-----------------------+
| Transactions  | [] `TransactionHistory`_  | Transaction content   |
+---------------+---------------------------+-----------------------+


The specific example is as follows:

::

   var reqData model.TransactionGetInfoRequest
   var hash string = "cd33ad1e033d6dfe3db3a1d29a55e190935d9d1ff40a138d777e9406ebe0fdb1"
   reqData.SetHash(hash)
   resData := testSdk.Transaction.GetInfo(reqData)
   if resData.ErrorCode == 0 {
       data, _ := json.Marshal(resData.Result)
       fmt.Println("info:", string(data)
   }

Interface Object Types
^^^^^^^^^^^^^^^^^^^^^^^

The description of interface object types of the ``GetInfo-transaction`` interface is as follows.

TransactionHistory
++++++++++++++++++

+--------------+---------------------+-----------------------------+
| Member       | Type                | Description                 |
+==============+=====================+=============================+
| ActualFee    | string              | Actual transaction cost     |
+--------------+---------------------+-----------------------------+
| CloseTime    | int64               | Transaction closure time    |
+--------------+---------------------+-----------------------------+
| ErrorCode    | int64               | Transaction error code      |
+--------------+---------------------+-----------------------------+
| ErrorDesc    | string              | Transaction description     |
+--------------+---------------------+-----------------------------+
| Hash         | string              | Transaction hash            |
+--------------+---------------------+-----------------------------+
| LedgerSeq    | int64               | Block serial number         |
+--------------+---------------------+-----------------------------+
| Transactions | `Transaction`_      | List of transaction contents|
+--------------+---------------------+-----------------------------+
| Signatures   | [] `Signature`_     | Signature list              |
+--------------+---------------------+-----------------------------+
| TxSize       | int64               | Transaction size            |
+--------------+---------------------+-----------------------------+

Transaction
++++++++++++

+-----------------------+-----------------------+-----------------------+
| Member                | Type                  | Description           |
+=======================+=======================+=======================+
| SourceAddress         | string                | The source account    |
|                       |                       | address initiating    |
|                       |                       | the transaction       |
+-----------------------+-----------------------+-----------------------+
| FeeLimit              | int64                 | Minimum fees required |
|                       |                       | for the transaction   |
+-----------------------+-----------------------+-----------------------+
| GasPrice              | int64                 | Transaction fuel      |
|                       |                       | price                 |
+-----------------------+-----------------------+-----------------------+
| Nonce                 | int64                 | Transaction serial    |
|                       |                       | number                |
+-----------------------+-----------------------+-----------------------+
| Operations            | []  `Operation`_      | Operation list        |
+-----------------------+-----------------------+-----------------------+

Operation
++++++++++

+---------------+--------------------+-----------------------------------------+
| Member        | Type               | Description                             |
+===============+====================+=========================================+
| Type          | int64              | Operation type                          |
+---------------+--------------------+-----------------------------------------+
| SourceAddress | string             | The source account address              |
|               |                    | initiating operations                   |
+---------------+--------------------+-----------------------------------------+
| Metadata      | string             | Note                                    |
+---------------+--------------------+-----------------------------------------+
| CreateAccount | `CreateAccount`_   | Operation of creating accounts          |
+---------------+--------------------+-----------------------------------------+
| IssueAsset    | `IssueAsset`_      | Operation of issuing assets             |
+---------------+--------------------+-----------------------------------------+
| PayAsset      | `PayAsset`_        | Operation of transferring assets        |
+---------------+--------------------+-----------------------------------------+
| PayCoin       | `PayCoin`_         | Operation of sending BU                 |
+---------------+--------------------+-----------------------------------------+
| SetMetadata   | `SetMetadata`_     | Operation of setting metadata           |
+---------------+--------------------+-----------------------------------------+
| SetPrivilege  | `SetPrivilege`_    | Operation of setting account privilege  |
+---------------+--------------------+-----------------------------------------+
| Log           | `Log`_             | Record logs                             |
+---------------+--------------------+-----------------------------------------+

TriggerTransaction
+++++++++++++++++++

+--------+--------+------------------+
| Member | Type   | Description      |
+========+========+==================+
| hash   | string | Transaction hash |
+--------+--------+------------------+

CreateAccount
++++++++++++++

+-------------+----------------------+-------------------------+
| Member      | Type                 | Description             |
+=============+======================+=========================+
| DestAddress | string               | Target account address  |
+-------------+----------------------+-------------------------+
| Contract    | `Contract`_          | Contract info           |
+-------------+----------------------+-------------------------+
| Priv        | `Priv`_              | Account privilege       |
+-------------+----------------------+-------------------------+
| Metadata    | [] :ref:`Metadata-2` | Account                 |
+-------------+----------------------+-------------------------+
| InitBalance | int64                | Account assets          |
+-------------+----------------------+-------------------------+
| InitInput   | string               | The input parameter for |
|             |                      | the init function       |
|             |                      | of the contract         |
+-------------+----------------------+-------------------------+

Contract
+++++++++

+---------+---------+--------------------------------------------------------+
| Member  | Type    | Description                                            |
+=========+=========+========================================================+
| Type    | integer | The contract language is not assigned value by default |
+---------+---------+--------------------------------------------------------+
| Payload | string  | The contract code for the corresponding language       |
+---------+---------+--------------------------------------------------------+

.. _Metadata-2:

Metadata
++++++++

+---------+--------+------------------+
| Member  | Type   | Description      |
+=========+========+==================+
| Key     | string | metadata keyword |
+---------+--------+------------------+
| Value   | string | metadata content |
+---------+--------+------------------+
| Version | int    | metadata version |
+---------+--------+------------------+

IssueAsset
+++++++++++

+-------------+--------+-------------------+
| Member      | Type   | Description       |
+=============+========+===================+
| Code        | String | Assets encoding   |
|             |        | size limit [1 64] |
+-------------+--------+-------------------+
| AssetAmount | Long   | Assets amount     |
+-------------+--------+-------------------+

PayAsset
+++++++++

+-------------+-----------+----------------------------+
| Member      | Type      | Description                |
+=============+===========+============================+
| DestAddress | string    | The target account address |
|             |           | to which the asset is      | 
|             |           | transferred                |
+-------------+-----------+----------------------------+
| Asset       | `Asset`_  | Account asset              |
+-------------+-----------+----------------------------+
| Input       | string    | Input parameters for the   |
|             |           | main function of the       |
|             |           | contract                   |
+-------------+-----------+----------------------------+ 

PayCoin
++++++++

+--------------+--------+----------------------------+
| Member       | Type   | Description                |
+==============+========+============================+
| DestAddress  | string | The target account address |
|              |        | to which the asset is      |
|              |        | transferred                |
+--------------+--------+----------------------------+
| Amount       | int64  | BU amounts to be           |
|              |        | transferred                |
+--------------+--------+----------------------------+
| Input        | string | Input parameters for the   |
|              |        | main function of the       |
|              |        | contract                   |
+--------------+--------+----------------------------+

SetMetadata
++++++++++++

+------------+--------+---------------------------+
| Member     | Type   | Description               |
+============+========+===========================+
| Key        | string | metadata keyword          |
+------------+--------+---------------------------+
| Value      | string | metadata content          |
+------------+--------+---------------------------+
| Version    | int64  | metadata version          |
+------------+--------+---------------------------+
| DeleteFlag | bool   | Whether to delete metadata|
+------------+--------+---------------------------+

SetPrivilege
+++++++++++++

+----------------+-------------------+---------------------------+
| Member         | Type              | Description               |
+================+===================+===========================+
| MasterWeight   | string            | Account weight,size limit |
|                |                   | [0,max(uint32)]           |
+----------------+-------------------+---------------------------+
| Signers        | [] `Signer`_      | Signer weight list        |
+----------------+-------------------+---------------------------+
| TxThreshold    | string            | Transaction threshold,    |
|                |                   | size limit[0,max(int64)]  |
+----------------+-------------------+---------------------------+
| TypeThreshold  | `TypeThreshold`_  | Threshold for specified   |
|                |                   | transaction type          |
+----------------+-------------------+---------------------------+

Log
++++

+--------+----------+-------------+
| Member | Type     | Description |
+========+==========+=============+
| Topic  | string   | Log theme   |
+--------+----------+-------------+
| Data   | string[] | Log content |
+--------+----------+-------------+


Block Services
---------------

Block services provide block-related interfaces. There are currently 11 interfaces: ``GetNumber``, ``CheckStatus``, ``GetTransactions``, ``GetInfo-block``, ``GetLatest``,
``GetValidators``, ``GetLatestValidators``, ``GetReward``, ``GetLatestReward``, ``GetFees`` and ``GetLatestFees``。

GetNumber
~~~~~~~~~~~

The ``GetNumber`` interface is used to query the latest block height.

The method to call this interface is as follows:

::

 GetNumber() model.BlockGetNumberResponse 

The response data is shown in the following table:

+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| BlockNumber       | int64               | The latest block           |
|                   |                     | height,corresponding to    |
|                   |                     | the underlying field       |
|                   |                     | seq                        |
+-------------------+---------------------+----------------------------+

The error code is shown in the following table:

+----------------------+------------+-------------------------+
| Exception            | Error Code | Description             |
+======================+============+=========================+
| CONNECTNETWORK_ERROR | 11007      | Failed to connect to    |
|                      |            | the network             |
+----------------------+------------+-------------------------+
| SYSTEM_ERROR         | 20000      | System error            |
+----------------------+------------+-------------------------+

The specific example is as follows:

::

   resData := testSdk.Block.GetNumber()
   if resData.ErrorCode == 0 {
       fmt.Println("BlockNumber:", resData.Result.BlockNumber)
   }

CheckStatus
~~~~~~~~~~~~

The ``CheckStatus`` interface is used to check if the local node block is synchronized.

The method to call this interface is as follows:

::

 CheckStatus() model.BlockCheckStatusResponse

The response data is shown in the following table:

+---------------+---------+-----------------------------------+
| Parameter     | Type    | Description                       |
+===============+=========+===================================+
| IsSynchronous | boolean | Whether the block is synchronized |
+---------------+---------+-----------------------------------+

The error code is shown in the following table:

+----------------------+------------+-------------------------+
| Exception            | Error Code | Description             |
+======================+============+=========================+
| CONNECTNETWORK_ERROR | 11007      | Failed to connect to    |
|                      |            | the network             |
+----------------------+------------+-------------------------+
| SYSTEM_ERROR         | 20000      | System error            |
+----------------------+------------+-------------------------+

The specific example is as follows:

::

   resData := testSdk.Block.CheckStatus()
   if resData.ErrorCode == 0 {
       fmt.Println("IsSynchronous:", resData.Result.IsSynchronous)
   }

GetTransactions
~~~~~~~~~~~~~~~~

The ``GetTransactions`` interface is used to query all transactions at the
specified block height.

The method to call this interface is as follows:

::

 GetTransactions(model.BlockGetTransactionRequest)model.BlockGetTransactionResponse

The request parameter is shown in the following table:


+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| blockNumber       | int64               | Required, the height of    |
|                   |                     | the block to be queried    |
|                   |                     | must be greater than 0     |
+-------------------+---------------------+----------------------------+

The response data is shown in the following table:

+-----------------------+------------------------------+-----------------------+
| Parameter             | Type                         | Description           |
+=======================+==============================+=======================+
| TotalCount            | int64                        | Total number of       |
|                       |                              | transactions returned |
+-----------------------+------------------------------+-----------------------+
| Transactions          | [] `TransactionHistory`_     | Transaction content   |
+-----------------------+------------------------------+-----------------------+

The error code is shown in the following table:

+---------------------------+------------+-------------------------+
| Exception                 | Error Code | Description             |
+===========================+============+=========================+
| INVALID_BLOCKNUMBER_ERROR | 11060      | BlockNumber must be     |
|                           |            | greater than 0          |
+---------------------------+------------+-------------------------+
| CONNECTNETWORK_ERROR      | 11007      | Failed to connect       |
|                           |            | to the network          |
+---------------------------+------------+-------------------------+
| SYSTEM_ERROR              | 20000      | System error            |
+---------------------------+------------+-------------------------+ 

The specific example is as follows:

::

   var reqData model.BlockGetTransactionRequest
   var blockNumber int64 = 581283
   reqData.SetBlockNumber(blockNumber)
   resData := testSdk.Block.GetTransactions(reqData)
   if resData.ErrorCode == 0 {
       data, _ := json.Marshal(resData.Result.Transactions)
       fmt.Println("Transactions:", string(data))
   }

GetInfo-block
~~~~~~~~~~~~~~

The ``GetInfo-block`` interface is used to obtain block information.

The method to call this interface is as follows:

::

 GetInfo(model.BlockGetInfoRequest) model.BlockGetInfoResponse

The request parameter is shown in the following table:

+-------------+-------+-------------------------------------------------+
| Parameter   | Type  | Description                                     |
+=============+=======+=================================================+
| blockNumber | int64 | Required, the height of the block to be queried |
+-------------+-------+-------------------------------------------------+

The response data is shown in the following table:

+-----------+--------+-------------------------------+
| Parameter | Type   | Description                   |
+===========+========+===============================+
| CloseTime | int64  | Block closure time            |
+-----------+--------+-------------------------------+
| Number    | int64  | Block height                  |
+-----------+--------+-------------------------------+
| TxCount   | int64  | Total transactions amount     |
+-----------+--------+-------------------------------+
| Version   | string | Block version                 |
+-----------+--------+-------------------------------+

The error code is shown in the following table:

+---------------------------+------------+------------------------------------+
| Exception                 | Error Code | Description                        |
+===========================+============+====================================+
| INVALID_BLOCKNUMBER_ERROR | 11060      | BlockNumber must be greater than 0 |
+---------------------------+------------+------------------------------------+
| CONNECTNETWORK_ERROR      | 11007      | Failed to connect to               |
|                           |            | the network                        |
+---------------------------+------------+------------------------------------+
| SYSTEM_ERROR              | 20000      | System error                       |
+---------------------------+------------+------------------------------------+      

The specific example is as follows:

::

   var reqData model.BlockGetInfoRequest
   var blockNumber int64 = 581283
   reqData.SetBlockNumber(blockNumber)
   resData := testSdk.Block.GetInfo(reqData)
   if resData.ErrorCode == 0 {
       data, _ := json.Marshal(resData.Result.Header)
       fmt.Println("Header:", string(data))
   }

GetLatest
~~~~~~~~~~

The ``GetLatest`` interface is used to get the latest block information.

The method to call this interface is as follows:

::

 GetLatest() model.BlockGetLatestResponse

The response data is shown in the following table:

+-----------+--------+---------------------------+
| Parameter | Type   | Description               |
+===========+========+===========================+
| CloseTime | int64  | Block closure time        |
+-----------+--------+---------------------------+
| Number    | int64  | Block height              |
+-----------+--------+---------------------------+
| TxCount   | int64  | Total transactions amount |
+-----------+--------+---------------------------+
| Version   | string | Block version             |
+-----------+--------+---------------------------+

The error code is shown in the following table:

+----------------------+------------+-------------------------+
|  Exception           | Error Code | Description             |
+======================+============+=========================+
| CONNECTNETWORK_ERROR | 11007      | Failed to connect to    |
|                      |            | the network             |
+----------------------+------------+-------------------------+
| SYSTEM_ERROR         | 20000      | System error            |
+----------------------+------------+-------------------------+   

The specific example is as follows:

::

   resData := testSdk.Block.GetLatest()
   if resData.ErrorCode == 0 {
       data, _ := json.Marshal(resData.Result.Header)
       fmt.Println("Header:", string(data))
   }

GetValidators
~~~~~~~~~~~~~~

The ``GetValidators`` interface is used to get the number of all the
authentication nodes in the specified block.

The method to call this interface is as follows:

::

 GetValidators(model.BlockGetValidatorsRequest)model.BlockGetValidatorsResponse

The request parameter is shown in the following table:

+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| blockNumber       | int64               | The height of the block    |
|                   |                     | to be queried              |
+-------------------+---------------------+----------------------------+

The response data is shown in the following table:

+------------+-----------------------+-----------------+
| Parameter  | Type                  | Description     |
+============+=======================+=================+
| validators | [] `ValidatorInfo`_   | Validators list |
+------------+-----------------------+-----------------+

The error code is shown in the following table:

+---------------------------+------------+--------------------------+
| Exception                 | Error Code |  Description             |
+===========================+============+==========================+
| INVALID_BLOCKNUMBER_ERROR | 11060      | BlockNumber must be      |
|                           |            | greater than 0           |
+---------------------------+------------+--------------------------+
| CONNECTNETWORK_ERROR      | 11007      | Failed to connect to     |
|                           |            | the network              |
+---------------------------+------------+--------------------------+
| SYSTEM_ERROR              | 20000      | System error             |
+---------------------------+------------+--------------------------+  

The specific example is as follows:

::

   var reqData model.BlockGetValidatorsRequest
   var blockNumber int64 = 581283
   reqData.SetBlockNumber(blockNumber)
   resData := testSdk.Block.GetValidators(reqData)
   if resData.ErrorCode == 0 {
       data, _ := json.Marshal(resData.Result.Validators)
       fmt.Println("Validators:", string(data))
   }

Interface Object Types
^^^^^^^^^^^^^^^^^^^^^^^

The description of interface object types of the ``GetValidators`` interface is as follows.

ValidatorInfo
++++++++++++++

+------------------+--------+------------------------+
| Member           | Type   | Description            |
+==================+========+========================+
| Address          | String | Consensus node address |
+------------------+--------+------------------------+
| PledgeCoinAmount | int64  | Deposit of validators  |
+------------------+--------+------------------------+



GetLatestValidators
~~~~~~~~~~~~~~~~~~~~

The ``GetLatestValidators`` interface is used to get the number of all
validators in the latest block.

The method to call this interface is as follows:

::

 GetLatestValidators() model.BlockGetLatestValidatorsResponse

The response data is shown in the following table:

+------------+-----------------------+-----------------+
| Parameter  | Type                  | Description     |
+============+=======================+=================+
| validators | [] `ValidatorInfo`_   | Validators list |
+------------+-----------------------+-----------------+

The error code is shown in the following table:

+---------------------------+------------+----------------------------+
| Exception                 | Error Code | Description                |
+===========================+============+============================+
| INVALID_BLOCKNUMBER_ERROR | 11060      | BlockNumber must           |
|                           |            | be greater than 0          |
+---------------------------+------------+----------------------------+
| CONNECTNETWORK_ERROR      | 11007      | Failed to connect to       |
|                           |            | the network                |
+---------------------------+------------+----------------------------+
| SYSTEM_ERROR              | 20000      | System error               |
+---------------------------+------------+----------------------------+  

The specific example is as follows:

::

   resData := testSdk.Block.GetLatestValidators()
   if resData.ErrorCode == 0 {
       data, _ := json.Marshal(resData.Result.Validators)
       fmt.Println("Validators:", string(data))
   }

GetReward
~~~~~~~~~~

The ``GetReward`` interface is used to retrieve the block reward and
valicator node rewards in the specified block.

The method to call this interface is as follows:

::

   GetReward(model.BlockGetRewardRequest) model.BlockGetRewardResponse

The request parameter is shown in the following table:

+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| blockNumber       | int64               | Required, the height of    |
|                   |                     | the block to be queried    |
+-------------------+---------------------+----------------------------+

The response data is shown in the following table:

+-----------------------+--------------------------+-------------------+
| Parameter             | Type                     | Description       |
+=======================+==========================+===================+
| BlockReward           | int64                    | Block rewards     |
+-----------------------+--------------------------+-------------------+
| ValidatorsReward      | [] :ref:`ValidatorReward`| Validators rewards|
+-----------------------+--------------------------+-------------------+


The error code is shown in the following table:

+---------------------------+------------+------------------------------------+
| Exception                 | Error Code | Description                        |
+===========================+============+====================================+
| INVALID_BLOCKNUMBER_ERROR | 11060      | BlockNumber must be greater than 0 |
+---------------------------+------------+------------------------------------+
| CONNECTNETWORK_ERROR      | 11007      | Failed to connect to               |
|                           |            | the network                        |
+---------------------------+------------+------------------------------------+
| SYSTEM_ERROR              | 20000      | System error                       |
+---------------------------+------------+------------------------------------+  

The specific example is as follows:

::

   var reqData model.BlockGetRewardRequest
   var blockNumber int64 = 581283
   reqData.SetBlockNumber(blockNumber)
   resData := testSdk.Block.GetReward(reqData)
   if resData.ErrorCode == 0 {
       fmt.Println("ValidatorsReward:", resData.Result.ValidatorsReward)
   }

Interface Object Types
^^^^^^^^^^^^^^^^^^^^^^^^

The description of interface object types of the ``GetReward`` interface is as follows.

.. _ValidatorReward:

ValidatorReward
+++++++++++++++++

+-----------+--------+-------------------+
| Member    | Type   | Description       |
+===========+========+===================+
| Validator | String | Validator address |
+-----------+--------+-------------------+
| Reward    | int64  | Validator reward  |
+-----------+--------+-------------------+

GetLatestReward
~~~~~~~~~~~~~~~~~

The ``GetLatestReward`` interface gets the block rewards and validator
rewards in the latest block.

The method to call this interface is as follows:

::

 GetLatestReward() model.BlockGetLatestRewardResponse

The response data is shown in the following table:

+-----------------------+-----------------------+-----------------------+
| Parameter             | Type                  | Description           |
+=======================+=======================+=======================+
| BlockReward           | int64                 | Block rewards         |
+-----------------------+-----------------------+-----------------------+
| ValidatorsReward      | [] `ValidatorReward`_ | Validator rewards     |
+-----------------------+-----------------------+-----------------------+

The error code is shown in the following table:

+----------------------+------------+-------------------------+
| Exception            | Error Code | Description             |
+======================+============+=========================+
| CONNECTNETWORK_ERROR | 11007      | Failed to connect to    |
|                      |            | the network             |
+----------------------+------------+-------------------------+
| SYSTEM_ERROR         | 20000      | System error            |
+----------------------+------------+-------------------------+ 

The specific example is as follows:

::

   resData := testSdk.Block.GetLatestReward()
   if resData.ErrorCode == 0 {
       fmt.Println("ValidatorsReward:", resData.Result.ValidatorsReward)
   }

GetFees
~~~~~~~

The ``GetFees`` interface gets the minimum asset limit and fuel price of the
account in the specified block.

The method to call this interface is as follows:

::

 GetFees(model.BlockGetFeesRequest) model.BlockGetFeesResponse

The request parameter is shown in the following table:

+-------------------+---------------------+----------------------------+
| Parameter         | Type                | Description                |
+===================+=====================+============================+
| blockNumber       | int64               | Required, the height of    |
|                   |                     | the block to be queried    |
+-------------------+---------------------+----------------------------+

The response data is shown in the following table:

+-----------+---------+-------------+
| Parameter | Type    | Description |
+===========+=========+=============+
| Fees      | `Fees`_ | Fees        |
+-----------+---------+-------------+



The error code is shown in the following table:

+---------------------------+------------+--------------------------------+
| Exception                 | Error Code | Description                    |
+===========================+============+================================+
| INVALID_BLOCKNUMBER_ERROR | 11060      | BlockNumber must               |
|                           |            | be greater than 0              |
+---------------------------+------------+--------------------------------+
| CONNECTNETWORK_ERROR      | 11007      | Failed to connect to           |
|                           |            | the network                    |
+---------------------------+------------+--------------------------------+
| SYSTEM_ERROR              | 20000      | System error                   |
+---------------------------+------------+--------------------------------+    

The specific example is as follows:

::

   var reqData model.BlockGetFeesRequest
   var blockNumber int64 = 581283
   reqData.SetBlockNumber(blockNumber)
   resData := testSdk.Block.GetFees(reqData)
   if resData.ErrorCode == 0 {
       data, _ := json.Marshal(resData.Result.Fees)
       fmt.Println("Fees:", string(data))
   }

Interface Object Types
^^^^^^^^^^^^^^^^^^^^^^^^

The description of interface object types of the ``GetFees`` interface is as follows.

Fees
+++++

+-------------+------+-------------------------------------------------+
| Member      | Type | Description                                     |
+=============+======+=================================================+
| BaseReserve | int64| Minimum asset limit for the account             |
+-------------+------+-------------------------------------------------+
| GasPrice    | int64| Transaction fuel price, unit MO, 1 BU = 10^8 MO |
+-------------+------+-------------------------------------------------+


GetLatestFees
~~~~~~~~~~~~~

The ``GetLatestFees`` interface is used to obtain the minimum asset limit
and fuel price of the account in the latest block.

The method to call this interface is as follows:

::

 GetLatestFees() model.BlockGetLatestFeesResponse

The response data is shown in the following table:

+-----------+----------+-------------+
| Parameter | Type     | Description |
+===========+==========+=============+
| Fees      | `fees`_  | Fees        |
+-----------+----------+-------------+

The error code is shown in the following table:

+----------------------+------------+-------------------------+
| Exception            | Error Code | Description             |
+======================+============+=========================+
| CONNECTNETWORK_ERROR | 11007      | Failed to connect to    |
|                      |            | the network             |
+----------------------+------------+-------------------------+
| SYSTEM_ERROR         | 20000      | System error            |
+----------------------+------------+-------------------------+  

The specific example is as follows:

::

   resData := testSdk.Block.GetLatestFees()
   if resData.ErrorCode == 0 {
       data, _ := json.Marshal(resData.Result.Fees)
       fmt.Println("Fees:", string(data))
   }

Error code
---------

The public error code is shown in the following table:

+-------+---------------------------------------------------------------+
| Code  | Description                                                   |
+=======+===============================================================+
| 11001 | Failed to create an account.                                  |
+-------+---------------------------------------------------------------+
| 11002 | Invalid sourceAddress.                                        |
+-------+---------------------------------------------------------------+
| 11003 | Invalid destAddress.                                          |
+-------+---------------------------------------------------------------+
| 11004 | InitBalance must be between 1 and max(int64).                 |
+-------+---------------------------------------------------------------+
| 11005 | SourceAddress cannot be equal to destAddress.                 |
+-------+---------------------------------------------------------------+
| 11006 | Invalid address.                                              |
+-------+---------------------------------------------------------------+
| 11007 | Failed to connect to the network.                             |
+-------+---------------------------------------------------------------+
| 11008 | AssetAmount to be issued must be between 1 and max(int64).    |
+-------+---------------------------------------------------------------+
| 11009 | The account does not have this asset.                         |
+-------+---------------------------------------------------------------+
| 11010 | The account does not have this metadata.                      |
+-------+---------------------------------------------------------------+
| 11011 | The length of key must be between 1 and 1024.                 |
+-------+---------------------------------------------------------------+
| 11012 | The length of value must be between 0 and 256k.               |
+-------+---------------------------------------------------------------+
| 11013 | The version must be greater than or equal to 0.               |
+-------+---------------------------------------------------------------+
| 11015 | MasterWeight must be between 0 and max(uint32).               |
+-------+---------------------------------------------------------------+
| 11016 | Invalid signer address.                                       |
+-------+---------------------------------------------------------------+
| 11017 | Signer weight must be between 0 and max(uint32).              |
+-------+---------------------------------------------------------------+
| 11018 | TxThreshold must be between 0 and max(int64).                 |
+-------+---------------------------------------------------------------+
| 11019 | Type of TypeThreshold is invalid.                             |
+-------+---------------------------------------------------------------+
| 11020 | TypeThreshold must be between 0 and max(int64).               |
+-------+---------------------------------------------------------------+
| 11023 | The length of code must be between 1 and 64.                  |
+-------+---------------------------------------------------------------+
| 11024 | AssetAmount must be between 0 and max(int64).                 |
+-------+---------------------------------------------------------------+
| 11026 | BuAmount must be between 0 and max(int64).                    |
+-------+---------------------------------------------------------------+
| 11027 | Invalid issuer address.                                       |
+-------+---------------------------------------------------------------+
| 11030 | The length of ctp must be between 1 and 64.                   |
+-------+---------------------------------------------------------------+
| 11031 | The length of token name must be between 1 and 1024.          |
+-------+---------------------------------------------------------------+
| 11032 | The length of symbol must be between 1 and 1024.              |
+-------+---------------------------------------------------------------+
| 11033 | Decimals must be between 0 and 8.                             |
+-------+---------------------------------------------------------------+
| 11034 | TotalSupply must be between 1 and max(int64).                 |
+-------+---------------------------------------------------------------+
| 11035 | Invalid token owner.                                          |
+-------+---------------------------------------------------------------+
| 11036 | Failed to get allowance.                                      |
+-------+---------------------------------------------------------------+
| 11037 | Invalid contract address.                                     |
+-------+---------------------------------------------------------------+
| 11038 | contractAddress is not a contract account.                    |
+-------+---------------------------------------------------------------+
| 11039 | Amount must be between 1 and max(int64).                      |
+-------+---------------------------------------------------------------+
| 11040 | SourceAddress cannot be equal to contractAddress.             |
+-------+---------------------------------------------------------------+
| 11041 | Invalid fromAddress.                                          |
+-------+---------------------------------------------------------------+
| 11042 | FromAddress cannot be equal to destAddress.                   |
+-------+---------------------------------------------------------------+
| 11043 | Invalid spender.                                              |
+-------+---------------------------------------------------------------+
| 11045 | The length of log topic must be between 1 and 128.            |
+-------+---------------------------------------------------------------+
| 11046 | The length of log data must be between 1 and 1024.            |
+-------+---------------------------------------------------------------+
| 11048 | Nonce must be between 1 and max(int64).                       |
+-------+---------------------------------------------------------------+
| 11049 | GasPrice must be between 1000 and max(int64).                 |
+-------+---------------------------------------------------------------+
| 11050 | FeeLimit must be between 1 and max(int64).                    |
+-------+---------------------------------------------------------------+
| 11051 | Operations cannot be empty.                                   |
+-------+---------------------------------------------------------------+
| 11052 | CeilLedgerSeq must be greater than or equal to 0.             |
+-------+---------------------------------------------------------------+
| 11053 | One of the operations cannot be resolved.                     |
+-------+---------------------------------------------------------------+
| 11054 | SignatureNumber must be between 1 and max(int32).             |
+-------+---------------------------------------------------------------+
| 11055 | Invalid transaction hash.                                     |
+-------+---------------------------------------------------------------+
| 11056 | Invalid blob.                                                 |
+-------+---------------------------------------------------------------+
| 11057 | PrivateKeys cannot be empty.                                  |
+-------+---------------------------------------------------------------+
| 11058 | One of the privateKeys is invalid.                            |
+-------+---------------------------------------------------------------+
| 11060 | BlockNumber must be greater than 0.                           |
+-------+---------------------------------------------------------------+
| 11062 | Url cannot be empty.                                          |
+-------+---------------------------------------------------------------+
| 11063 | ContractAddress and code cannot be empty at the same time.    |
+-------+---------------------------------------------------------------+
| 11064 | OptType must be between 0 and 2.                              |
+-------+---------------------------------------------------------------+
| 11065 | Failed to get allowance.                                      |
+-------+---------------------------------------------------------------+
| 11067 | The signatures cannot be empty.                               |
+-------+---------------------------------------------------------------+
| 11066 | Failed to get token info.                                     |
+-------+---------------------------------------------------------------+
| 20000 | System error.                                                 |
+-------+---------------------------------------------------------------+

The following table describes the GO error messages:

+-------------+----------------------------------------+
| Parameter   | Description                            |
+=============+========================================+
| 14000       | The function `GetEncPublicKey` failed. |                       
+-------------+----------------------------------------+
| 14001       | The function `Sign` failed.            |
+-------------+----------------------------------------+
| 14002       | The parameter `payload` is invalid.    |
+-------------+----------------------------------------+
| 14003       | The query failed.                      |
+-------------+----------------------------------------+
| 14004       | No results.                            |
+-------------+----------------------------------------+
