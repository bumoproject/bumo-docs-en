BUMO ATP Standard
==================

Overview
---------

ATP (Account-based Tokenization Protocol) provides protocol standards for issuing, tranferring and issuing additional tokens based on BUMO account. 

Purpose
--------

ATP is aimed to provide interfaces for applications to issue, transfer and issue additional tokens on BUMO.

Attributes of Tokens
---------------------

You can set the attributes of the tokens to be issued by setting the metadata of the source account of tokens, 
so the applications can manage and check token information conveniently.


+--------------+----------------------------+
| Variables    | Description                |
+==============+============================+
| name         | Token name                 |
+--------------+----------------------------+
| code         | Token code                 |
+--------------+----------------------------+
| description  | Description of tokens      |
+--------------+----------------------------+
| decimals     | Decimal places of tokens   |
+--------------+----------------------------+
| totalSupply  | Total amount of tokens     |
+--------------+----------------------------+
| icon         | Token icon (optional)      |	
+--------------+----------------------------+	
| version      | ATP version                |
+--------------+----------------------------+

.. note:: 

 - code: capitalization and acronyms are recommended.
 - decimals: the number of decimal places which is in the range of 0~8, and 0 means no decimal place.
 - totalSupply: the value is in the range of 0~2^63-1. 0 means no upper limit.
 - icon: base64-bit encoding, the file size is less than 32 k, and 200*200 pixels is recommended.

Operations
-----------

The operations provided in BUMO ATP standards include `registrating tokens`_, `issuing tokens`_, `transferring tokens`_, `issuing additional tokens`_, `querying tokens`_, and `querying specified metadata`_.


Registrating Tokens
^^^^^^^^^^^^^^^^^^^^

Registrating tokens is to set the metadata of the tokens. You can set **key**, **value** and  **version** of the metadata by sending the ``Setting Metadata`` transaction.
The following is an example of registrating tokens.


**Format in json:**

::

 {
  "type": 4,
  "set_metadata": {
    "key": "asset_property_DT",
    "value": "{\"name\":\"Demon Token\",\"code\":\"DT\",\"totalSupply\":\"10000000000000\",\"decimals\":8,
    \"description\":\"This is hello Token\",\"icon\":\"iVBORw0KGgoAAAANSUhEUgAAAAE....\",\"version\":\"1.0\"}",
    "version": 0
  }
 }

.. note::

 The value of **key** must be composed of the prefix **asset_property_** and token code, and you can refer to the code parameters when issuing tokens. 
 You can check the result  by querying the specified metadata after you have set the values.

Issuing Tokens
^^^^^^^^^^^^^^

Issuing tokens is to issue a certain amount of digital tokens, and these tokens can be viewed in the account balance after being issued.
When issuing tokens, you can set the parameters **amount (amount of tokens to be issued)** and **code (token code)** by initiating the ``Issuing Assets`` transaction.
The following is an example of issuing 10000 DT tokens with 8 decimal places.


**Format in json:**

::

 {
  "type": 2,
  "issue_asset": {
    "amount": 1000000000000,
    "code": "DT"
  }
 }

Transferring Tokens
^^^^^^^^^^^^^^^^^^^^

Transferring tokens is to transfer a certain amount of tokens to a destination account.
When transferring tokens, you can set the parameters by initiating the ``Transferring Assets`` transaction.
The following table shows the parameters to be set.


+----------------------------------+-----------------------------------------+
| Parameters                       | Description                             |
+==================================+=========================================+
| pay_asset.dest_address           | Address of the destination account      |
+----------------------------------+-----------------------------------------+
| pay_asset.asset.key.issuer       | Address of the token issuer             |
+----------------------------------+-----------------------------------------+
| pay_asset.asset.key.code         | Token code                              |
+----------------------------------+-----------------------------------------+
| pay_asset.asset.amount           | Amount of tokens to                     |
|                                  | be transferred * accuracy               |
+----------------------------------+-----------------------------------------+
| pay_asset.input                  | Input parameters for triggering         |
|                                  | the contract, empty string is defaulted |                          
+----------------------------------+-----------------------------------------+

The following is an example of transferring 500000000000 DT tokens to the destination account ``buQaHVCwXj9ERtFznDnAuaQgXrwj2J7iViVK``.


**Format in json:**

::

    {
      "type": 3,
      "pay_asset": {
        "dest_address": "buQaHVCwXj9ERtFznDnAuaQgXrwj2J7iViVK",
        "asset": {
          "key": {
            "issuer": "buQhzVyca8tQhnqKoW5XY1hix2mCt5KTYzcD",
            "code": "DT"
          },
          "amount": 500000000000
        }
      }
    }

After the transfer, the destination account has (**amount**) DT tokens. 


.. note:: If the destination account is not activated, the transaction of tranferring tokens will fail.

Issuing Additional Tokens 
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Issuing additional tokens is that the account continues to issue a certain amount of tokens based on the original token code by setting the same transaction code with the previously issued tokens.  
Applications controls the amount of additional tokens to be issued and makes sure it does not exceed **totalSupply**.
These tokens can be viewed in the account balance after being issued.


Querying Tokens
^^^^^^^^^^^^^^^^

Querying tokens is to check the token information of the source account. The following are the parameters you have to specify when querying tokens.

+----------------------------------+----------------------------------------------------------------+
| Parameters                       | Description                                                    |
+==================================+================================================================+
| address                          | Account address, required                                      |
+----------------------------------+----------------------------------------------------------------+
| code &                           | **issuer** is the account address which issues the tokens and  |
| issuer                           | **code** is the token code. The specified token can be         |
|                                  | displayed correctly only when the code&issuer are both correct;|
|                                  | otherwise all the tokens will be displayed by default          |
+----------------------------------+----------------------------------------------------------------+
| type                             | Currently **type** can only be 0, you can leave it blank       |
+----------------------------------+----------------------------------------------------------------+

The following is the code of querying tokens:


::

 HTTP GET /getAccountAssets?address=buQhzVyca8tQhnqKoW5XY1hix2mCt5KTYzcD




If the account has tokens, the following content will be returned:

::

 
 {
    "error_code": 0,
    "result": [
        {
            "amount": 469999999997,
            "key": {
                "code": "DT",
                "issuer": "buQhzVyca8tQhnqKoW5XY1hix2mCt5KTYzcD"
            }
        },
        {
            "amount": 1000000000000,
            "key": {
                "code": "ABC",
                "issuer": "buQhzVyca8tQhnqKoW5XY1hix2mCt5KTYzcD"
            }
        }
    ]
 }

If the account does not have tokens, the following content will be returned:

::

 {
   "error_code" : 0,
   "result" : null
 }

Querying Specified Metadata
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Querying specified metadata is to check the information about **metadata**, including **key**, **value** and **version**.


+----------------------------------+---------------------------------------------------+
| Parameters                       | Description                                       |
+==================================+===================================================+
| address                          | Account address, required                         |
+----------------------------------+---------------------------------------------------+
| key                              | Key value of the specified metadata               |
+----------------------------------+---------------------------------------------------+ 

The following is the code of querying specified metadata:


::

 HTTP GET /getAccountMetaData?address=buQhzVyca8tQhnqKoW5XY1hix2mCt5KTYzcD&key=asset_property_DT


If the specified key has a value, the following content will be returned:

::

 {
    "error_code": 0,
    "result": {
        "asset_property_DT": {
            "key": "asset_property_DT",
            "value": "{\"name\":\"DemonToken\",\"code\":\"DT\",\"totalSupply\":\"1000000000000\",\"decimals\":8,\"description\":\"This is hello Token\",\"icon\":\"iVBORw0KGgoAAAANSUhEUgAAAAE\",\"version\":\"1.0\"}",
            "version": 4
        }
    }
 }

If the specified key does not have a value, the following content will be returned:

::

 {
   "error_code" : 0,
   "result" : null
 }