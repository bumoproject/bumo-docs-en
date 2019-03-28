---
id: dex_10
title: BUMO DEX 10 Protocol
sidebar_label: DEX 10
---

## Introduction

BUMO DEX 1.0 (Decentralized Exchange) is a decentralized asset exchange protocol based on BUMO smart contracts. The protocol provides free and decentralized exchange for all types of assets issued on BUMO.

## Purpose

The decentralized asset exchange contracts based on this standard interface allow all types of assets issued on BUMO to be safely and quickly exchanged on the chain without having to rely on centralized exchanges, and the contracts can be used by other applications and integrated by third parties.

## Rule

The BUMO smart contract is implemented in JavaScript and contains the initialization function `init` and two entry functions `main`, and `query`. The `init` function is used to initialize the contract when it is created; the `main` function is mainly responsible for data writing, and the `query` function is responsible for data querying. 

The DEX 1.0 protocol supports free conversion between ATP tokens and BU, and the service fee is charged in BU. When the assets are exchanged, the party paying BUs needs to pay the service fee separately according to the service fee ratio in addition to the planned exchange amount, which is similar to the tax excluded from the price, that is, the service fee is not included in the exchange amount. The party paying the atp or ctp tokens pays the service fee in BU received after the transaction is completed according to the service fee rate, which is similar to the tax included in the price, that is, the service fee is included in the exchange amount. The ratio of service fee to transaction amount can be set by the DEX contract.


## Attributes of DEX 

The attributes of DEX stored in the smart contract's account can be queried through the contract's `dexInfo` function. The attributes are shown in the following table.

| Variable         | Description                   |
| :----------- | --------------------------- |
|owner         | The owner the DEX contract      |
|feeRate       | The service fee ratio                 |
|version       | The decentralized exchange Version |

**Attention**:
- owner: If the default value is not given when a DEX contract is created, then by default the creator of the default DEX contract is the owner.
- feeRate: The unit is 1/(10^8). For example, the feeRate is 50000, then the service rate is 50000/(10^8) = 5/10000.
- version：The version of DEX. Such as *1.0*.



## Functions

### makeOrder

- Post orders for ATP tokens or CTP tokens to exchange with BUs, support conversion between ATP and BU, CTP and BU, BU and ATP, and BU and CTP.
- When the ATP tokens are exchanged, they are marked with the issuer (the issuer address), code (the asset code), and value (exchange quantity).
- When the CTP tokens are exchanged, they are marked with the issuer (the CTP contract address) and the value (exchange quantity).
- BU is the native token in BUMO, so there is no need to mark. When BUs are exchanged, just provide the value (quantity).
- If the redemption tokens in the order are a CTP asset, you have to grant the DEX contract the amount to be exchanged prior to issuing the order.
- If the redemption tokens in the order are an ATP asset, you have to trigger it with `payAsset`, and the asset and amount of the asset must be the same as that to be redeemed.
- If the redemption tokens in the order are BUs, you have to trigger it with `payCoin`, and the amount to be transferred must be the amount of BUs to redeemed plus service fee.
- The entry function is `main`.

- Parameters are in json format:
    ```json
    {  
    'method':'makeOrder',
    'params':{
    'own':{ //ATP token
    'issuer':buQxxx',
    'code':'EUR',
    'value':10000,
    },
    'target':{ //BU
    'value':1000,
    },
    'fee':5,
    'expiration':'2018...'
    }
    }
    ```
    own: The token information exchanged by the order, including the issuer (the issuance address), code (the asset code), and value (number of redemption), where CTP tokens have no code, and BU tokens have no issuer and code.

    target: The token to which the order is redeemed, including the issuer, code, and value. The CTP token has no code and the BU has no issuer and code.

    fee: The service fee paid by the order posting account to the DEX contract to redeem the asset. If the tokens to be redeemed is not BU, the DEX contract will deduct from the redeemed BUs according to the redemption ratio.

    expiration: The due date of the order, the order is invalid after the date.
- Function: Functions of `makeOrder`(own, target, fee, expiration).
- Return value: Return `true` or throw an exception.

### cancelOrder

- The account posting the order cancels it.
- The entry function `main`.

- The parameter is in json format:
    ```json
    {
        'method':'cancelOrder',
        'params':{
            'order':'order_1'
        }
    }
    ```
    order: The sequence number of the order cancelled.

- Function: function cancelOrder(order)
- Return value: return `true` or throw an exception

### takeOrder

- For order filling or partial filling, the function should be thrown if the order has been completed or has expired.
- If the redemption tokens in the order are a CTP asset, you have to grant the DEX contract the amount to be exchanged prior to filling the order.
- If the redemption tokens in the order are an ATP asset, you have to trigger it with `payAsset` when filling the order, and the asset and amount of the asset must be the same as that to be redeemed.
- If the redemption tokens in the order are BUs, you have to trigger it with `payCoin` when filling the order, and the amount to be transferred must be the amount of BUs to redeemed plus service fee.
- The entry function is `main`.

- The parameters are in json format:
    ```json
    {
        'method':'takeOrder',
        'params':{
          'order':'order_1',
          'fee':5,
        }
    }

    ```
    order: The sequence number of the order fully filled or partially filled.

    fee: The fee paid to the DEX contract by the account filling the order to redeem the asset. If the tokens to be redeemed is not BU, the DEX contract will deduct from the redeemed BUs according to the redemption ratio.

- Function: the function takeOrder(order).
- Return value: Return `true` or throw an exception.

### updateFeeRate

- Change the service fee ratio of the DEX contract. If the contract is called by a non-contract owner, it should be thrown.
- The entry function is `main`.

- The parameter is in json format:
    ```json
    {
        'method' : 'updateFeeRate',
        'params' : {
             'rate' : '50000' //unit 1/(10^8)
        }
    }
    ```
    rate: The ratio of the service fee to the token exchange amount.
- Function: the function updateFeeRate(rate)
- Return value: Return `true` or throw an exception

### updateOwner

- Change the owner of the DEX contract. After the contract is changed, the original contract owner will lose control of the DEX contract. If the contract is called by one other than the owner, the function should be thrown.

- The entry function is `main`.
- The parameter is in json format:
    ```json
    {
        'method' : 'updateOwner',
        'params' : {
             'address' : 'buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj'
        }
    }
    ```

    address: The address of the new owner of the DEX contract.
- Function: The function updateOwner(address).
- Return value: Return `true` or throw an exception.

### clearExpiredOrder

- Clear an uncompleted but expired order in a DEX contract, which should be thrown if it is called by a non-contract owner.
- The entry function is `main`.

- The parameter is in json format:
    ```json
    {
        'method' : 'clearExpiredOrder',
    }
    ```
- Function: the function clearExpiredOrder().
- Return value: Return `true` or throw an exception.

### withdrawFee

- The service fee is withdrawn from the DEX contract, which should be thrown if it is called by a non-contract owner.
- The entry function is `main`.
- The parameter is in json format.

    ```json
    {
        'method' : 'withdrawFee',
        'params' : {
             'value': 10000
        }
    }
    ```
    value: The amount to be withdrawn.

- Function: The function withdrawFee(value).
- Return value: Return `true` or throw an exception.

### dexInfo

- Return basic information about the DEX contract.
- The entry function is `query`.
- The parameter is in json format.
    ```json
    {
        'method':'dexInfo'
    }
    ```
- Function: The function dexInfo().
- Return value:
    ```json
    {
        'result':{
            'type': 'string',
            'value': {
                'dexInfo': {
                    'owner': 'buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj',
                    'feeRate': 50000, //unit 1/(10^8)
                    'version': '1.0'
                }
            }
        }
    } 
    ```

### getOrder

- Get the order details based on the order number.
- The entry function is `query`.
- The parameter is in json format:
    ```json
    {
        'method':'getOrder',
        'params' : {
             'order': 'order_1'
        }
    }
    ```
    order: the order number.

- Function: The function getOrder(order).
- Return value:
    ```json
    {  
        'order_1':{
            'own':{ //ATP token
                'issuer':buQxxx',
                'code':'EUR',
                'value':10000,
            },
           'target':{ //BU
               'value':1000,
            },
           'fee':5,
           'expiration':'2018...'
        }
    }
    ```

### getOrderInterval

- Get the valid range of the order.
- The entry function is `query`.
- The parameter is in json format.
    ```json
    {
        'method':'getOrderInterval',
    }
    ```

- Function: the function getOrderInterval().
- Return value:
    ```json
    {  
        'orderInterval':[9, 1000]
    }
    ```

## Contract Entry

### init

- When the contract is created, the entry function `init` is triggered and it is responsible for the initialization of the contract.
- Function
    ```js
    function init(input_str){
    }
    ```

- The parameters are in json format.
    ```json
    {
        'params':{
            'owner':'buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj',
            'feeRate':'50000',
            'version': '1.0'
        }
    }
    ```
    - owner: If the default value is not given when a DEX contract is created, then by default the creator of the default DEX contract is the owner.
    - feeRate: The unit is 1/(10^8). For example, the feeRate is 50000, then the service rate is 50000/(10^8) = 5/10000.
    - version：The version of DEX. Such as *1.0*.

- Return value:

    Success: None.

    Failure: Throw an exception.

### main

- The `main` function is responsible for data writing, including [makeOrder](#makeorder), [cancelOrder](#cancelorder), [takeOrder](#takeorder), [updateFeeRate](#updatefeerate), [updateOwner](#updateowner), [clearExpiredOrder](#clearexpiredorder), [withdrawFee](#withdrawfee) and other interfaces.
- Function body.

    ```js
    function main(input_str){
        let input = JSON.parse(input_str);

        if(input.method === 'makeOrder'){
            makeOrder(input.params.own, input.params.target, input.params.fee, input.params.expiration);
        }
        else if(input.method === 'cancelOrder'){
            cancelOrder(input.params.order);
        }
        else if(input.method === 'takeOrder'){
            takeOrder(input.params.order);
        }
        else if(input.method === 'updateFeeRate'){
            updateFeeRate(input.params.rate);
        }
        else if(input.method === 'updateOwner'){
            updateOwner(input.params.owner);
        }
        else if(input.method === 'clearExpiredOrder'){
            clearExpiredOrder();
        }
        else if(input.method === 'withdrawFee'){
            withdrawFee(input.params.value);
        }
        else{
            throw '<Main interface passes an invalid operation type>';
        }
    }
    ```

### query

- The query function is responsible for data query, including [dexInfo](#dexinfo), [getOrder](#getorder), [getOrderInterval](#getorderinterval) and other interfaces.
- Function body.

    ```js
    function query(input_str){
    
        let result = {};
        let input  = JSON.parse(input_str);
    
        if(input.method === 'dexInfo'){
            result.dexInfo = dexInfo();
        }
        else if(input.method === 'getOrder'){
            result.order = getOrder(input.params.order);
        }
        else if(input.method === 'getOrderInterval'){
            result.interval = getOrderInterval();
        }
        else{
            throw '<Query interface passes an invalid operation type>';
        }
        return JSON.stringify(result);
    }
    ```
