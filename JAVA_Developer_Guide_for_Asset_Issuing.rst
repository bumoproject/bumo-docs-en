JAVA Developer Guide for Asset Issuing
=======================================

Scenario Description
--------------------

The asset issuer issues an asset of 1000000000 on BuChain, the asset code is GLA and the asset name is Global. 
The specific information is as follows:

+-------------------------+----------+------------------+------------------------+
| Field Name              | Required | Example          | Description            |
+=========================+==========+==================+========================+
| name                    | yes      | Global           | Asset name             |
+-------------------------+----------+------------------+------------------------+
| code                    | yes      | GLA              | Asset code             |
+-------------------------+----------+------------------+------------------------+
| totalSupply             | yes      | 1000000000       | Total supply of asset  |
+-------------------------+----------+------------------+------------------------+
| decimals                | yes      | 8                | Asset decimal          |
+-------------------------+----------+------------------+------------------------+
| description             | no       |                  | Asset description      |
+-------------------------+----------+------------------+------------------------+
| icon                    | no       |                  | Asset ICON             |
+-------------------------+----------+------------------+------------------------+   
| version                 | yes      | 1.0              | The version number of  |     
|                         |          |                  | the protocol           |
+-------------------------+----------+------------------+------------------------+

.. note:: |
       - code: capitalized spell is recommended.

       - decimals: the number of decimal places which is in the range of 0~8, and 0 means no decimal place.

       - totalSupply: the total supply of the asset which is in the range of 0~2^63-1, and 0 means no limitation for the tokens.
      
       - icon:  Base64 bit encoding, and the size of the icon file is less than 32k.

       - version: the version number of the protocol, and its present value is 1.0.
        



Development Process for Asset Issuing
--------------------------------------

In this document we use the Java language as an example to create an asset issuer and issue an asset of 1000000000.

Creating SDK Instance
~~~~~~~~~~~~~~~~~~~~~~

We create an instance with the following code and set its url (the IP and Port of the node).

::

 String url = "http://seed1.bumotest.io:26002";
 SDK sdk = SDK.getInstance(url);

In BuChain, the generation time for each block is 10 seconds, and only one confirmation is needed for a transaction to get the final state.

The environment description is as follows:

+-------------------------+--------------------+------------------+----------------------------------+
| 网络环境                | IP                 | Port             | 区块链浏览器                     |
+=========================+====================+==================+==================================+
| 主网                    | seed1.bumo.io      | 16002            | https://explorer.bumo.io         |
+-------------------------+--------------------+------------------+----------------------------------+
| 测试                    | seed1.bumotest.io  | 26002            | http://explorer.bumotest.io      |
+-------------------------+--------------------+------------------+----------------------------------+

Creating Asset Issuer Account
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The specific code for creating an account for the asset issuer is as follows:

::

 public static AccountCreateResult createAccount() {
    AccountCreateResponse response = sdk.getAccountService().create();
    if (response.getErrorCode() != 0) {
        return null;
    }
    return response.getResult();
 }

The returned value is as follows:

::

 AccountCreateResult
     address:  buQsurH1M4rjLkfjzkxR9KXJ6jSu2r9xBNEw
     privateKey:  privbvTuL1k8z27i9eyBrFDUvAVVCSxKeLtzjMMZEqimFwbNchnejS81
     publicKey: b00179b4adb1d3188aa1b98d6977a837bd4afdbb4813ac65472074fe3a491979bf256ba63895

.. note:: |
       The account created above is not activited.


Activating the Asset Issuer Account
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The non-activated account needs to be activited by and activited account. Please skip this section if your issuer account is already activated.

.. note:: |
       You can activate the account by transfering 50.03 BU to the issuer account from the BuPocket(the Wallet). The BU can be used for the transaction fee of issuing assets.


Getting the Nonce Value 
~~~~~~~~~~~~~~~~~~~~~~~~

Each account maintains a nonce value which starts at 1. The nonce value represents the amount of transactions in the account.

The code used to get the nonce value is as follows:

::

 public long getAccountNonce() {
 long nonce = 0;

    // Init request
    String accountAddress = "buQsurH1M4rjLkfjzkxR9KXJ6jSu2r9xBNEw";
    AccountGetNonceRequest request = new AccountGetNonceRequest();
    request.setAddress(accountAddress);

    // Call getNonce
    AccountGetNonceResponse response = sdk.getAccountService().getNonce(request);
    if (0 == response.getErrorCode()) {
        nonce = response.getResult().getNonce();
    } else {
        System.out.println("error: " + response.getErrorDesc());
    }
   return nonce;
  }

The returned value is as follows:

::

 nonce: 28

Grouping Oprations for Asset Issuing
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A transaction can consist of multiple operations, each pointing to a specific transaction content.
Two operations are needed to issue an asset: AssetIssueOperation, and AccountSetMetadataOperation.

The specific code for grouping operations for asset issuing is as follows:

::

    public BaseOperation[] buildOperations() {
    // The account address to issue apt1.0 token
    String issuerAddress = "buQsurH1M4rjLkfjzkxR9KXJ6jSu2r9xBNEw";
    // The token name
    String name = "Global";
    // The token code
    String code = "GLA";
    // The apt token version
    String version = "1.0";
    // The apt token icon
    String icon = "";
    // The token total supply number
    Long totalSupply = 1000000000L;
    // The token now supply number
    Long nowSupply = 1000000000L;
    // The token description
    String description = "GLA TOKEN";
    // The token decimals
    Integer decimals = 0;

    // Build asset issuance operation
    AssetIssueOperation assetIssueOperation = new AssetIssueOperation();
    assetIssueOperation.setSourceAddress(issuerAddress);
    assetIssueOperation.setCode(code);
    assetIssueOperation.setAmount(nowSupply);

    // If this is an atp 1.0 token, you must set metadata like this
    JSONObject atp10Json = new JSONObject();
    atp10Json.put("name", name);
    atp10Json.put("code", code);
    atp10Json.put("description", description);
    atp10Json.put("decimals", decimals);
    atp10Json.put("totalSupply", totalSupply);
    atp10Json.put("icon", icon);
    atp10Json.put("version", version);

    String key = "asset_property_" + code;
    String value = atp10Json.toJSONString();
    // Build setMetadata
    AccountSetMetadataOperation accountSetMetadataOperation = new AccountSetMetadataOperation();
    accountSetMetadataOperation.setSourceAddress(issuerAddress);
    accountSetMetadataOperation.setKey(key);
    accountSetMetadataOperation.setValue(value);

    BaseOperation[] operations = {assetIssueOperation, accountSetMetadataOperation};
    return operations;
    }

Serializing Transactions
~~~~~~~~~~~~~~~~~~~~~~~~~

Transactions are serialized for network transmission.


.. note:: |
       - feeLimit: the maximum fee the transaction initiator will pay for the transaction, and please fill 50.03 BU when the operation is issuing asset.

       - nonce: tne nonce value of this transaction initiator,  which can be obtained by adding 1 to the current nonce value.



The specific code for serializing transactions is as follows:The specific code for serializing transactions is as follows:

::

 public String seralizeTransaction() {
 String transactionBlob = null;

 // The account address to issue atp1.0 token
 String senderAddresss = "buQsurH1M4rjLkfjzkxR9KXJ6jSu2r9xBNEw";
    // The gasPrice is fixed at 1000L, the unit is MO
    Long gasPrice = 1000L;
    // Set up the maximum cost 50.03BU
    Long feeLimit = ToBaseUnit.BU2MO("50.03");
    // Call the interface for getting the nonce value, and the nonce value is increased by 1.
 long nonce = getAccountNonce() + 1;
 // Call the interface for grouping oprations for asset issuing.
 BaseOperation[] operations = buildOperations ();

 // Build transaction  Blob
 TransactionBuildBlobRequest transactionBuildBlobRequest = new TransactionBuildBlobRequest();
 transactionBuildBlobRequest.setSourceAddress(senderAddresss);
 transactionBuildBlobRequest.setNonce(nonce);
 transactionBuildBlobRequest.setFeeLimit(feeLimit);
 transactionBuildBlobRequest.setGasPrice(gasPrice);
 for (int i = 0; i < operations.length; i++) {
    transactionBuildBlobRequest.addOperation(operations[i]);
 }
  TransactionBuildBlobResponse transactionBuildBlobResponse = sdk.getTransactionService().buildBlob(transactionBuildBlobRequest);
  if (transactionBuildBlobResponse.getErrorCode() == 0) {
 transactionBlob = transactionBuildBlobResponse. getResult().getTransactionBlob();
 } else {
    System.out.println("error: " + transactionBuildBlobResponse.getErrorDesc());
 }
 return transactionBlob;
 }



The returned value is as follows:

::

 transactionBlob: 
  0A2462755173757248314D34726A4C6B666A7A6B7852394B584A366A537532723978424E4577101C18C0F1CED
  11220E8073A350802122462755173757248314D34726A4C6B666A7A6B7852394B584A366A537532723978424E
  45772A0B0A03474C41108094EBDC033AB6010804122462755173757248314D34726A4C6B666A7A6B7852394B5
  84A366A537532723978424E45773A8B010A1261737365745F70726F70657274795F474C4112757B22636F6465
  223A22474C41222C22746F74616C537570706C79223A313030303030303030302C22646563696D616C73223A3
  02C226E616D65223A22474C41222C2269636F6E223A22222C226465736372697074696F6E223A22474C412054
  
  
Signing Transactions
~~~~~~~~~~~~~~~~~~~~

All transactions need to be signed to be valid. Signature data and public key are gererated from the transaction by signing to it.

The specific code for signing transactions is as follows:

::

 public Signature[] signTransaction() {
    Signature[] signatures = null;
    // The account private key to issue atp1.0 token
  String senderPrivateKey = " privbvTuL1k8z27i9eyBrFDUvAVVCSxKeLtzjMMZEqimFwbNchnejS81";
 //Call the interface for serializing transactions
 String transactionBlob = seralizeTransaction();

 // Sign transaction BLob
 TransactionSignRequest transactionSignRequest = new TransactionSignRequest();
 transactionSignRequest.setBlob(transactionBlob);
 transactionSignRequest.addPrivateKey(senderPrivateKey);
 TransactionSignResponse transactionSignResponse = sdk.getTransactionService().sign(transactionSignRequest);
 if (transactionSignResponse.getErrorCode() == 0) {
    signatures = transactionSignResponse.getResult().getSignatures();
 } else {
    System.out.println("error: " + transactionSignResponse.getErrorDesc());
 }
 return signatures;
 }


The returned value is as follows:
::

 signData: 6CEA42B11253BD49E7F1A0A90EB16448C6BC35E8684588DAB8C5D77B5E771BD5C7E1718942B32F9BDE14551866C00FEBA832D92F88755226434413F98E5A990C; 
 publicKey: b00179b4adb1d3188aa1b98d6977a837bd4afdbb4813ac65472074fe3a491979bf256ba63895


Sending Transactions
~~~~~~~~~~~~~~~~~~~~~

Sending transactions refers to sending the serialized transactions and the signatures to BuChain.


The specific code for sending transactions is as follows:
::

 public String submitTransaction() {
 String  hash = null;
 // Call the interface for serializing transactions
 String transactionBlob = seralizeTransaction();
 // Call the interface for signing transactions
 Signature[] signatures = signTransaction();

 // Submit transaction
 TransactionSubmitRequest transactionSubmitRequest = new TransactionSubmitRequest();
 transactionSubmitRequest.setTransactionBlob(transactionBlob);
 transactionSubmitRequest.setSignatures(signatures);
 TransactionSubmitResponse transactionSubmitResponse = sdk.getTransactionService().submit(transactionSubmitRequest);
 if (0 == transactionSubmitResponse.getErrorCode()) {
        hash = transactionSubmitResponse.getResult().getHash();
 } else {
        System.out.println("error: " + transactionSubmitResponse.getErrorDesc());
  }
 return  hash ;
 }


The returned value is as follows:

::

 hash:  031fa9a7da6cf8777cdd55df782713d4d05e2465146a697832011b058c0a0cd8


Checking the Result of the Transaction Execution
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. note:: |
       The result returned by sending transactions represents whether the transaction is submitted successfully, 
       and to check whether the transaction is executed successfully you have to perform one of the two operations: 


Querying from the Blockchain Browser
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can query the result from the BUMO Blockchain browser by the hash value you obtained above. The address of the main network is `<https://explorer.bumo.io>`_ and the address of the test network is  `<http://explorer.bumotest.io>`_：

|BUBrowser|

The result returned is as follows:

|execution_result_of_transaction|


Querying by Calling the Interface
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The specific code to call the interface is as follows:

::

 public boolean checkTransactionStatus() {
    Boolean transactionStatus = false;
    // Call the interface for sending transactions
 String txHash = submitTransaction();
 // Wait for 10 seconds for the execution of the transaction
 try {
    Thread.sleep(10000);
 } catch (InterruptedException e) {
    e.printStackTrace();
 }
 // Init request
 TransactionGetInfoRequest request = new TransactionGetInfoRequest();
 request.setHash(txHash);

 // Call getInfo
 TransactionGetInfoResponse response = sdk.getTransactionService().getInfo(request);
 if (response.getErrorCode() == 0) {
    transactionStatus = true;
 } else {
    System.out.println("error: " + response.getErrorDesc());
  }
 return transactionStatus;
 }


The returned value is as follows:

::
 
 transactionStatus: true


.. |BUBrowser| image:: /image/BUBrowser.png
.. |execution_result_of_transaction| image:: /image/execution_result_of_transaction.png