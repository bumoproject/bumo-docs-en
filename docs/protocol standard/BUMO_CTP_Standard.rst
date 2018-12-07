BUMO CTP Standard
==================

Overview
---------

CTP (Contract Token Protocol) provides protocol standards for issuing tokens based on BUMO contracts. 
CTP also provides interfaces for third parties to transfer and use tokens.
BUMO smart contracts which are implemented in ``javascript`` include an initialization function ``init`` and two entry functions ``main`` and ``query``.
The ``init`` function is mainly for initializing parameters, and ``main`` function for data writing, ``query`` function for data query.



Purpose
--------

CTP is aimed to provide interfaces for applications, like Wallets or exchanges, to use any tokens on BUMO conveniently.


Attributes of Tokens
---------------------

The attributes of tokens are stored in the smart contract account, and you can check them by using the ``tokenInfo`` function. The attributes of tokens are as follows:


+--------------+---------------------------------------+
| Variables    | Description                           |
+==============+=======================================+
| ctp          | Version of Contract Token Protocol    |
+--------------+---------------------------------------+
| name         | Token name                            |
+--------------+---------------------------------------+
| symbol       | Token symbol                          |
+--------------+---------------------------------------+
| decimals     | Decimal places of tokens               |
+--------------+---------------------------------------+
| totalSupply  | Total amount of tokens                 |
+--------------+---------------------------------------+
| contractOwner| Token owner                           |	
+--------------+---------------------------------------+


.. note:: 

 - name: full spelled words with initial letters capitalized are recommanded, such as **Demo Token**.
 - symbol: capitalization and acronyms are recommended, such as **DT**.
 - decimals: the number of decimal places which is in the range of 0~8, and 0 means no decimal place.
 - totalSupply: the value is in the range of 1~2^63-1.


Functions
-----------

The functions provided in BUMO CTP include `contractInfo`_, `name`_, `symbol`_, `decimals`_, `totalSupply`_, `balanceOf`_, `transfer`_, `transferFrom`_, `approve`_, `assign`_, `changeOwner`_ and `allowance`_.

contractInfo
^^^^^^^^^^^^^

The ``contractInfo`` function is used to check basic information of tokens, and its entry function is ``query``.

**Parameters in json format:** 

::
 
 {
    "method":"contractInfo"
 }

**Function call:**

::
 
 function contractInfo ()

**Return value:**

::

 {
    "result":{
        "type": "string",
        "value": {
            "contractInfo": {
                "ctp": "1.0",
                "name": "cccpt-bu",
                "symbol": "CBG",
                "decimals": 0,
                "totalSupply": "100000",
                "contractOwner": "buQBv4pqtNMs6ueBhx7mJULhAFYV3rSHo2Zg",
                "balance": "100000"
            }
        }
    }
 } 

name
^^^^^

The ``name`` function is used to check the token name, and its entry function is ``query``.

**Parameters in json format:** 

::
 
 {
    "method":"name"
 }

**Function call:**

::
 
 function name ()

**Return value:**

::

 {
    "result":{
        "name":"XXXCOIN"
    }
 } 

symbol
^^^^^^^

The ``symbol`` function is used to check the token symbol, and its entry function is ``query``.

**Parameters in json format:** 

::
 
 {
    "method":"symbol"
 }

**Function call:**

::
 
 function symbol ()

**Return value:**

::

 {
    "result":{
        "symbol":"XXX"
    }
 } 

decimals
^^^^^^^^^

The ``decimals`` function is used to check the number of decimal places used by the tokens. 
For example, 5 means the amount of tokens allocated is 100000. Its entry function is ``query``.

**Parameters in json format:** 

::
 
 {
    "method":"decimals"
 }

**Function call:**

::
 
 function decimals ()

**Return value:**

::

 {
    "result":{
        "decimals":5
    }
 } 


totalSupply
^^^^^^^^^^^^^

The ``totalSupply`` function is used to check the total supply of tokens, and its entry function is ``query``.

**Parameters in json format:** 

::
 
 {
    "method":"totalSupply"
 }

**Function call:**

::

 function totalSupply ()

**Return value:**

::

 {
    "result":{
        "totalSupply":"10000000000000000000"
    }
 } 

balanceOf
^^^^^^^^^^

The ``balanceOf`` function is used to check the balance of the owner account, and its entry function is ``query``.

**Parameters in json format:** 

::
 
 {
      "method":"balanceOf",
      "params":{
        "address":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
 }

**Parameter description:**

address: account address.

**Function call:**

::
 
 function balanceOf ()

**Return value:**

::

 {
    "result":{
        "balanceOf":"100000000000000"
    }
 } 

transfer
^^^^^^^^

The ``transfer`` function is used to transfer (**value**) tokens to the destination address (**to**), and the **log** event must be triggered.
An exception will be thrown if the source account does not have enough tokens. Its entry function is ``main``.

**Parameters in json format:** 

::
 
 {
    "method":"transfer",
    "params":{
        "to":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "value":"1000000"
 }

**Parameter description:**

to: the address of the destination account.

value: the amount of tokens allowed to be transferred (string).

**Function call:**

::
 
 function transfer (to, value)

**Return value:**

Returns **true** or throws an exception.

transferFrom
^^^^^^^^^^^^^

The ``transferFrom`` function is used to transfer (**value**) tokens from the source address (**from**) to the destination address (**to**), 
and the **log** event must be triggered. Before the ``transferFrom`` function is called, the source address (**from**) must have authorized the destination address (**to**) by calling the ``approve`` function for transferring a certain amount of tokens.
If the amount of tokens in the source address (**from**) is insufficient or if the source address (**from**) has not authorized the destination address (**to**) for transferring enough amount of tokens, then the ``transferFrom`` function will throw an exception. Its entry function is ``main``.


**Parameters in json format:** 

::
 
 {
    "method":"transferFrom",
    "params":{
        "from":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "to":"buQYH2VeL87svMuj2TdhgmoH9wSmcqrfBner",
        "value":"1000000"
    }
 }

**Parameter description:**

from: the source address.

to: the destination address.

value: the amount of tokens allowed to be transferred (string).

**Function call:**

::
 
 function transferFrom (from, to, value)

**Return value:**

Returns **true** or throws an exception.

approve
^^^^^^^^

The ``approve`` function is used to authorize **spender** for transferring (**value**) tokens from the account of the transaction sender.
Its entry function is ``main``.

**Parameters in json format:** 

::
 
 {
    "method":"approve",
    "params":{
        "spender":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "value":"1000000"
    }
 }

**Parameter description:**

spender: the account address of the spender.

value: the amount of tokens an account is authorized to transfer (string).

**Function call:**

::
 
 function approve (spender, value)

**Return value:**

Returns **true** or throws an exception.

assign
^^^^^^^

The ``assign`` function can be used by token owners to allocate (**value**) tokens to the destination address (**to**). Its entry function is ``main``.


**Parameters in json format:** 

::
 
 {
    "method":"assign",
    "params":{
        "to":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "value":"1000000"
    }
 }

**Parameter description:**

to: the address of the recipient account.

value: the amount of tokens allocated.

**Function call:**

::
 
 function assign (to, value)

**Return value:**

Returns **true** or throws an exception.

changeOwner
^^^^^^^^^^^^

The ``changeOwner`` function is used to transfer the ownership of the contract tokens, whose default owner is the creation account of the tokens, 
and only the token owner has this priviledge. Its entry function is ``main``.


**Parameters in json format:** 

::
 
 {
    "method":"changeOwner",
    "params":{
        "address":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
 }

**Parameter description:**

address: the account address.

**Function call:**

::
 
 function changeOwner (address)

**Return value:**

Returns **true** or throws an exception.

allowance
^^^^^^^^^^

The ``allowance`` function is used to check the amount of tokens still allowed to be transferred from the token owner.


**Parameters in json format:** 

::
 
 {
    "method":"allowance",
    "params":{
        "owner":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "spender":"buQYH2VeL87svMuj2TdhgmoH9wSmcqrfBner"
    }
 }

**Parameter description:**

owner: the account address of the token owner.

spender: the account address of the spender.

**Function call:**

::
 
 function allowance (owner, spender)

**Return value:**

::
 
 {
    "result":{
        "allowance":"1000000",
    }
 } 

Entry Functions
----------------

BUMO smart contract provides entry functions including `init`_, `main`_ and `query`_.

init
^^^^^

The ``init`` function is used for initializing parameters, the following are its function form, parameter form in json, parameter description and returned value.

**Function call:**

::

 function init (input_str){
 }

**Parameters in json format:**

::

 {
    "params":{
        "name":"RMB",
        "symbol":"CNY",
        "decimals":8,
        "totalSupply":"5000000000000"
    }
 }

**Parameter description:**

name: token name.

symbol: token symbol.

decimals: decimal places.

totalSupply: the total amount of tokens. For example, when issuing 50000 tokens, the total amount of tokens is 50000*100000000.

**Return value:**

Returns **true** or throws an exception.

main
^^^^^

The ``main`` function is used for data writing, which includes the ``transfer``, ``transferFrom``, ``approve``, ``assign`` and 
``changeOwner`` interfaces. The following is the function body of  ``main``.
::

 function main(input_str){
    let input = JSON.parse(input_str);

    if(input.method === 'transfer'){
        transfer(input.params.to, input.params.value);
    }
    else if(input.method === 'transferFrom'){
        transferFrom(input.params.from, input.params.to, input.params.value);
    }
    else if(input.method === 'approve'){
        approve(input.params.spender, input.params.value);
    }
    else if(input.method === 'assign'){
        assign(input.params.to, input.params.value);
    }
    else if(input.method === 'changeOwner'){
        changeOwner(input.params.address);
    }
    else{
        throw '<undidentified operation type>';
    }
 }
query
^^^^^

The ``query`` function is used for data query, which includes the ``name``, ``symbol``, ``decimals``, ``totalSupply``, 
``contractInfo``, ``balanceOf`` and ``allowance`` interfaces. The following is the function body of ``query``.

::

 function query(input_str){
    loadGlobalAttribute();

    let result = {};
    let input  = JSON.parse(input_str);
    if(input.method === 'name'){
        result.name = name();
    }
    else if(input.method === 'symbol'){
        result.symbol = symbol();
    }
    else if(input.method === 'decimals'){
        result.decimals = decimals();
    }
    else if(input.method === 'totalSupply'){
        result.totalSupply = totalSupply();
    }
    else if(input.method === 'contractInfo'){
        result.contractInfo = contractInfo();
    }
    else if(input.method === 'balanceOf'){
        result.balance = balanceOf(input.params.address);
    }
    else if(input.method === 'allowance'){
        result.allowance = allowance(input.params.owner, input.params.spender);
    }
    else{
       	throw '<unidentified operation type>';
    }

    log(result);
    return JSON.stringify(result);
 }
