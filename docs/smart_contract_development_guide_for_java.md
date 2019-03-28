---
id: smart_contract_development_guide_for_java
title: BUMO Smart Contract Development Guide for Java
sidebar_label: Smart Contract Development for Java
---

## Overview

The contract is a `JavaScript` code, with a standard (`ECMAScript` as specified in `ECMA-262`). The initialization function of the contract is `init`, and the entry function of the execution is the `main` function. You must have the definition of the `init` and `main` functions in the contract code. The input argument to this function is the string `input`, which is specified when the contract is called.

- For details of the smart contract, refer to [Introduction to Smart Contract](../introduction_to_smart_contract).
- For details of the smart contract syntax, refer to [Syntax in Smart Contract](../syntax_in_smart_contract).
- For details of the smart contract editor, refer to[Introduction to Smart Contract Editor](../introduction_to_smart_contract).

This section introduces three Java-based smart contract development scenarios, and all scenarios are associated. 

- [Scenario One](#scenario-one) mainly implements the contract creation function.
- [Scenario Two](#scenario-two) mainly implements contract triggering function. 
- [Scenario Three](#scenario-three) mainly implements contract query function. 

The scenarios are based on the smart contract code that follows the CTP 1.0 protocol. The code comes from [contractBasedToken.js](https://github.com/bumoproject/bumo/blob/master/src/contract/contractBasedToken.js).

```javascript
'use strict';

let globalAttribute = {};
const globalAttributeKey = 'global_attribute';

function makeAllowanceKey(owner, spender){
    return 'allow_' + owner + '_to_' + spender;
}

function approve(spender, value){
    assert(addressCheck(spender) === true, 'Arg-spender is not a valid address.');
    assert(stoI64Check(value) === true, 'Arg-value must be alphanumeric.');
    assert(int64Compare(value, '0') > 0, 'Arg-value of spender ' + spender + ' must be greater than 0.');

    let key = makeAllowanceKey(sender, spender);
    storageStore(key, value);

    tlog('approve', sender, spender, value);

    return true;
}

function allowance(owner, spender){
    assert(addressCheck(owner) === true, 'Arg-owner is not a valid address.');
    assert(addressCheck(spender) === true, 'Arg-spender is not a valid address.');

    let key = makeAllowanceKey(owner, spender);
    let value = storageLoad(key);
    assert(value !== false, 'Failed to get the allowance given to ' + spender + ' by ' + owner + ' from metadata.');

    return value;
}

function transfer(to, value){
    assert(addressCheck(to) === true, 'Arg-to is not a valid address.');
    assert(stoI64Check(value) === true, 'Arg-value must be alphanumeric.');
    assert(int64Compare(value, '0') > 0, 'Arg-value must be greater than 0.');
    if(sender === to) {
        tlog('transfer', sender, to, value);  
        return true;
    }
    
    let senderValue = storageLoad(sender);
    assert(senderValue !== false, 'Failed to get the balance of ' + sender + ' from metadata.');
    assert(int64Compare(senderValue, value) >= 0, 'Balance:' + senderValue + ' of sender:' + sender + ' < transfer value:' + value + '.');

    let toValue = storageLoad(to);
    toValue = (toValue === false) ? value : int64Add(toValue, value); 
    storageStore(to, toValue);

    senderValue = int64Sub(senderValue, value);
    storageStore(sender, senderValue);

    tlog('transfer', sender, to, value);

    return true;
}

function transferFrom(from, to, value){
    assert(addressCheck(from) === true, 'Arg-from is not a valid address.');
    assert(addressCheck(to) === true, 'Arg-to is not a valid address.');
    assert(stoI64Check(value) === true, 'Arg-value must be alphanumeric.');
    assert(int64Compare(value, '0') > 0, 'Arg-value must be greater than 0.');
    
    if(from === to) {
        tlog('transferFrom', sender, from, to, value);
        return true;
    }
    
    let fromValue = storageLoad(from);
    assert(fromValue !== false, 'Failed to get the value, probably because ' + from + ' has no value.');
    assert(int64Compare(fromValue, value) >= 0, from + ' Balance:' + fromValue + ' < transfer value:' + value + '.');

    let allowValue = allowance(from, sender);
    assert(int64Compare(allowValue, value) >= 0, 'Allowance value:' + allowValue + ' < transfer value:' + value + ' from ' + from + ' to ' + to  + '.');

    let toValue = storageLoad(to);
    toValue = (toValue === false) ? value : int64Add(toValue, value); 
    storageStore(to, toValue);

    fromValue = int64Sub(fromValue, value);
    storageStore(from, fromValue);

    let allowKey = makeAllowanceKey(from, sender);
    allowValue   = int64Sub(allowValue, value);
    storageStore(allowKey, allowValue);

    tlog('transferFrom', sender, from, to, value);

    return true;
}

function balanceOf(address){
    assert(addressCheck(address) === true, 'Arg-address is not a valid address.');

    let value = storageLoad(address);
    assert(value !== false, 'Failed to get the balance of ' + address + ' from metadata.');
    return value;
}

function init(input_str){
    let params = JSON.parse(input_str).params;

    assert(stoI64Check(params.totalSupply) === true && params.totalSupply > 0 &&
           typeof params.name === 'string' && params.name.length > 0 &&
           typeof params.symbol === 'string' && params.symbol.length > 0 &&
           typeof params.decimals === 'number' && params.decimals >= 0, 
           'Failed to check args');
       
    globalAttribute.totalSupply = params.totalSupply;
    globalAttribute.name = params.name;
    globalAttribute.symbol = params.symbol;
    globalAttribute.version = 'ATP20';
    globalAttribute.decimals = params.decimals;
    
    storageStore(globalAttributeKey, JSON.stringify(globalAttribute));
    storageStore(sender, globalAttribute.totalSupply);
}

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
    else{
        throw '<Main interface passes an invalid operation type>';
    }
}

function query(input_str){
    let result = {};
    let input  = JSON.parse(input_str);

    if(input.method === 'tokenInfo'){
        globalAttribute = JSON.parse(storageLoad(globalAttributeKey));
        result.tokenInfo = globalAttribute;
    }
    else if(input.method === 'allowance'){
        result.allowance = allowance(input.params.owner, input.params.spender);
    }
    else if(input.method === 'balanceOf'){
        result.balance = balanceOf(input.params.address);
    }
    else{
        throw '<Query interface passes an invalid operation type>';
    }
    return JSON.stringify(result);
}
```

## Scenario One

This example mainly implements the contract creation function. Please refer to the demo: [CreateContractDemo.java](https://github.com/bumoproject/bumo-sdk-java/blob/develop/examples/src/main/java/io/bumo/sdk/example/CreateContractDemo.java).

Based on CTP 1.0, an asset issuer issues smart contract tokens, the total amount of which is 1 billion, the issuance code is CGO, and the name is Contract Global. The details are as follows:

| Field       | Required? | Example         | Description  |
| ----------- | --------- | --------------- | ------------ |
| name        | Yes       | Contract Global | token name   |
| symbol      | Yes       | CGO             | token code   |
| decimals    | Yes       | 8               | Precision    |
| totalSupply | Yes       | 1000000000      | total amount |

The specific execution process of this scenario includes [Validating Code Validity](#validating-code-validity), [Compressing Text](#compressing-text), [Creating SDK Instances-1](#creating-sdk-instances-1), [Creating the Asset Issuer Account](#creating-the-asset-issuer-account), [Activating the Asset Issuer Account](#activating-the-asset-issuer-account), [Obtaining the Serial Number of the Asset Issuer Account-1](#obtaining-the-serial-number-of-the-asset-issuer-account-1), [Assembling the Creation of the Contract Account and the CGO Token Issuance](#assembling-the-creation-of-the-contract-account-and-the-cgo-token-issuance), [Serializing the Transaction-1](#serializing-the-transaction-1), [Signing the Transaction-1](#signing-the-transaction-1), [Sending the Transaction-1](#sending-the-transaction-1), and [Querying Whether the Transaction Was Executed Successfully-1](#querying-whether-the-transaction-was-executed-successfully-1).

### Validating Code Validity

Open the online detection page: [bumo-jslint](http://jslint.bumocdn.com/ ), copy the above smart contract code into the edit box, and click the **JSLint** button.
If there is a warning that the background is red, there is a problem with the syntax, as shown below:
<img src="/docs/assets/warnings.png"
​     style= "margin-left: 20px">

If there is no syntax problem, the following information is displayed.

<img src="/docs/assets/nowarnings.png"
​     style= "margin-left: 20px">


### Compressing Text


Open the online text compression page:  [tool from the third party](https://jsmin.51240.com/) , copy the verified smart contract code to the edit box on the page, then click the **Compress** button to copy the compressed string, as shown below:

<img src="/docs/assets/compressedString.png"
​     style= "margin-left: 20px">

### Creating SDK Instances-1

Create an instance and set the url (the IP and port of a deployed node).

Environment description:

| Network Environment | IP                | Port  | Blockchain Explorer         |
| ------------------- | ----------------- | ----- | --------------------------- |
| Mainnet             | seed1.bumo.io     | 16002 | https://explorer.bumo.io    |
| Testnet             | seed1.bumotest.io | 26002 | https://explorer.bumotest.io |


Sample code

```java
 String url = "http://seed1.bumotest.io:26002"; 
 SDK sdk = SDK.getInstance(url); 
```

In the BuChain network, each block is generated every 10 seconds, and each transaction requires only one confirmation to get the final state of the transaction.


### Creating the Asset Issuer Account

The code to create the asset issuer account is as follows:

```java

public static AccountCreateResult createAccount() { 
    AccountCreateResponse response = sdk.getAccountService().create(); 
    if (response.getErrorCode() != 0) { 
        return null; 
    } 
    return response.getResult(); 
}
```
Return value:
```java
 AccountCreateResult 
   address: buQYLtRq4j3eqbjVNGYkKYo3sLBqW3TQH2xH 
   privateKey: privbs4iBCugQeb2eiycU8RzqkPqd28eaAYrRJGwtJTG8FVHjwAyjiyC 
   publicKey: b00135e99d67a4c2e10527f766e08bc6afd4420951628149042fdad6584a5321c23c716a528b
```
**Note**: 
 An account created in this way is an account that is not activated.


### Activating the Asset Issuer Account

When the account is not activated, it needs to be activated by an activated (chained) account. Please skip this section if your account has been activated.


**Note**:
- Main network environment: the account can be activated by transferring10.09 BU (payment to the transaction fee for asset issuance) to the asset issuer account through Bu Pocket.
- Test network environment: the asset issuer can access the [Faucet](https://faucet.bumotest.io/)，enter the account address to be activated (or recharged) into the edit box, and click "Confirm" to complete the activation (or recharge).

### Obtaining the Serial Number of the Asset Issuer Account-1

Each account maintains its own serial number, which starts from 1 and is incremented. A serial number marks a transaction for that account. The code to obtain the serial number of the asset issuer account is as follows:

```java
 public long getAccountNonce() {
 long nonce = 0;

    // Init request
    String accountAddress = [address of the asset issuer account];
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
```

Return value:
```
 nonce: 6
```
**Note**:
 If an account is not queried, it means that the account is not activated.



### Assembling the Creation of the Contract Account and the CGO Token Issuance

The code assigns the compressed contract code to the payload variable. The specific code is as follows:

```java
 public BaseOperation[] buildOperations() { 
     // The account address to issue apt1.0 token 
     String createContractAddress = "buQYLtRq4j3eqbjVNGYkKYo3sLBqW3TQH2xH"; 
     // Contract account initialization BU，the unit is MO，and 1 BU = 10^8 MO 
     Long initBalance = ToBaseUnit.BU2MO("0.01"); 
     // The token name 
     String name = "Contract Global"; 
     // The token code 
     String symbol = "CGO"; 
     // The token total supply, which includes the dicimals.
     // If decimals is 8 and you want to issue 10 tokens now, the nowSupply must be 10 * 10 ^ 8, like below.
     String totalSupply = "1000000000";
     // The token decimals 
     Integer decimals = 8; 
     // Contract code 
     String payload = "'use strict';let globalAttribute={};const globalAttributeKey='global_attribute';function makeAllowanceKey(owner,spender){return'allow_'+owner+'_to_'+spender;}function approve(spender,value){assert(addressCheck(spender)===true,'Arg-spender is not a valid address.');assert(stoI64Check(value)===true,'Arg-value must be alphanumeric.');assert(int64Compare(value,'0')>0,'Arg-value of spender '+spender+' must be greater than 0.');let key=makeAllowanceKey(sender,spender);storageStore(key,value);tlog('approve',sender,spender,value);return true;}function allowance(owner,spender){assert(addressCheck(owner)===true,'Arg-owner is not a valid address.');assert(addressCheck(spender)===true,'Arg-spender is not a valid address.');let key=makeAllowanceKey(owner,spender);let value=storageLoad(key);assert(value!==false,'Failed to get the allowance given to '+spender+' by '+owner+' from metadata.');return value;}function transfer(to,value){assert(addressCheck(to)===true,'Arg-to is not a valid address.');assert(stoI64Check(value)===true,'Arg-value must be alphanumeric.');assert(int64Compare(value,'0')>0,'Arg-value must be greater than 0.');if(sender===to){tlog('transfer',sender,to,value);return true;}let senderValue=storageLoad(sender);assert(senderValue!==false,'Failed to get the balance of '+sender+' from metadata.');assert(int64Compare(senderValue,value)>=0,'Balance:'+senderValue+' of sender:'+sender+' < transfer value:'+value+'.');let toValue=storageLoad(to);toValue=(toValue===false)?value:int64Add(toValue,value);storageStore(to,toValue);senderValue=int64Sub(senderValue,value);storageStore(sender,senderValue);tlog('transfer',sender,to,value);return true;}function transferFrom(from,to,value){assert(addressCheck(from)===true,'Arg-from is not a valid address.');assert(addressCheck(to)===true,'Arg-to is not a valid address.');assert(stoI64Check(value)===true,'Arg-value must be alphanumeric.');assert(int64Compare(value,'0')>0,'Arg-value must be greater than 0.');if(from===to){tlog('transferFrom',sender,from,to,value);return true;}let fromValue=storageLoad(from);assert(fromValue!==false,'Failed to get the value, probably because '+from+' has no value.');assert(int64Compare(fromValue,value)>=0,from+' Balance:'+fromValue+' < transfer value:'+value+'.');let allowValue=allowance(from,sender);assert(int64Compare(allowValue,value)>=0,'Allowance value:'+allowValue+' < transfer value:'+value+' from '+from+' to '+to+'.');let toValue=storageLoad(to);toValue=(toValue===false)?value:int64Add(toValue,value);storageStore(to,toValue);fromValue=int64Sub(fromValue,value);storageStore(from,fromValue);let allowKey=makeAllowanceKey(from,sender);allowValue=int64Sub(allowValue,value);storageStore(allowKey,allowValue);tlog('transferFrom',sender,from,to,value);return true;}function balanceOf(address){assert(addressCheck(address)===true,'Arg-address is not a valid address.');let value=storageLoad(address);assert(value!==false,'Failed to get the balance of '+address+' from metadata.');return value;}function init(input_str){let params=JSON.parse(input_str).params;assert(stoI64Check(params.totalSupply)===true&&params.totalSupply>0&&typeof params.name==='string'&&params.name.length>0&&typeof params.symbol==='string'&&params.symbol.length>0&&typeof params.decimals==='number'&&params.decimals>=0,'Failed to check args');globalAttribute.totalSupply=params.totalSupply;globalAttribute.name=params.name;globalAttribute.symbol=params.symbol;globalAttribute.version='ATP20';globalAttribute.decimals=params.decimals;storageStore(globalAttributeKey,JSON.stringify(globalAttribute));storageStore(sender,globalAttribute.totalSupply);}function main(input_str){let input=JSON.parse(input_str);if(input.method==='transfer'){transfer(input.params.to,input.params.value);}else if(input.method==='transferFrom'){transferFrom(input.params.from,input.params.to,input.params.value);}else if(input.method==='approve'){approve(input.params.spender,input.params.value);}else{throw'<Main interface passes an invalid operation type>';}}function query(input_str){let result={};let input=JSON.parse(input_str);if(input.method==='tokenInfo'){globalAttribute=JSON.parse(storageLoad(globalAttributeKey));result.tokenInfo=globalAttribute;}else if(input.method==='allowance'){result.allowance=allowance(input.params.owner,input.params.spender);}else if(input.method==='balanceOf'){result.balance=balanceOf(input.params.address);}else{throw'<Query interface passes an invalid operation type>';}return JSON.stringify(result);}"; 

     // Init initInput 
     JSONObject initInput = new JSONObject(); 
     JSONObject params = new JSONObject(); 
     params.put("name", name); 
     params.put("symbol", symbol); 
     params.put("decimals", decimals); 
     params.put("totalSupply", totalSupply);
     initInput.put("params", params);  

     // Build create contract operation 
     ContractCreateOperation contractCreateOperation = new ContractCreateOperation(); 
     contractCreateOperation.setSourceAddress(createContractAddress); 
     contractCreateOperation.setInitBalance(initBalance); 
     contractCreateOperation.setPayload(payload); 
     contractCreateOperation.setInitInput(initInput.toJSONString()); 
     contractCreateOperation.setMetadata("create ctp 1.0 contract"); 

     BaseOperation[] operations = { contractCreateOperation }; 
     return operations; 
 } 
```

### Serializing the Transaction-1

Serializing transactions is for the convenience network transmission.


**Note**:
- feeLimit: the maximum transaction fee that the originator of this transaction will pay for this transaction. Please fill in 10.08BU for the issuance of this asset.
- nonce: the transaction serial number of the originator of this transaction, which is obtained by adding 1 to the nonce value of the current account.

The specific code of serializing transactions is as follows. The parameter `nonce` in the example is the account serial number obtained by calling `getAccountNonce`, and the parameter operations is the asset issuance operation obtained by calling `buildOperations`.

```java
 public String seralizeTransaction(Long nonce,  BaseOperation[] operations) { 
    String transactionBlob = null; 

    // The account address to create contracts and issue ctp 1.0 tokens 
    String senderAddresss = "buQYLtRq4j3eqbjVNGYkKYo3sLBqW3TQH2xH"; 
    // The gasPrice is fixed at 1000L, the unit is MO 
    Long gasPrice = 1000L; 
    // Set up the maximum cost 10.08BU 
    Long feeLimit = ToBaseUnit.BU2MO("10.08"); 
    // Nonce should add 1 
    nonce += 1; 

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
```
Return value:
```
 transactionBlob: 0A24627551594C745271346A336571626A564E47596B4B596F33734C4271573354514832784810071880B8D3E00320E8073AC42408011224627551594C745271346A336571626A564E47596B4B596F33734C427157335451483278481A176372656174652063747020312E3020636F6E74726163742280241295231292232775736520737472696374273B6C657420676C6F62616C4174747269627574653D7B7D3B636F6E737420676C6F62616C4174747269627574654B65793D27676C6F62616C5F617474726962757465273B66756E6374696F6E206D616B65416C6C6F77616E63654B6579286F776E65722C7370656E646572297B72657475726E27616C6C6F775F272B6F776E65722B275F746F5F272B7370656E6465723B7D66756E6374696F6E20617070726F7665287370656E6465722C76616C7565297B6173736572742861646472657373436865636B287370656E646572293D3D3D747275652C274172672D7370656E646572206973206E6F7420612076616C696420616464726573732E27293B6173736572742873746F493634436865636B2876616C7565293D3D3D747275652C274172672D76616C7565206D75737420626520616C7068616E756D657269632E27293B61737365727428696E743634436F6D706172652876616C75652C273027293E302C274172672D76616C7565206F66207370656E64657220272B7370656E6465722B27206D7573742062652067726561746572207468616E20302E27293B6C6574206B65793D6D616B65416C6C6F77616E63654B65792873656E6465722C7370656E646572293B73746F7261676553746F7265286B65792C76616C7565293B746C6F672827617070726F7665272C73656E6465722C7370656E6465722C76616C7565293B72657475726E20747275653B7D66756E6374696F6E20616C6C6F77616E6365286F776E65722C7370656E646572297B6173736572742861646472657373436865636B286F776E6572293D3D3D747275652C274172672D6F776E6572206973206E6F7420612076616C696420616464726573732E27293B6173736572742861646472657373436865636B287370656E646572293D3D3D747275652C274172672D7370656E646572206973206E6F7420612076616C696420616464726573732E27293B6C6574206B65793D6D616B65416C6C6F77616E63654B6579286F776E65722C7370656E646572293B6C65742076616C75653D73746F726167654C6F6164286B6579293B6173736572742876616C7565213D3D66616C73652C274661696C656420746F206765742074686520616C6C6F77616E636520676976656E20746F20272B7370656E6465722B2720627920272B6F776E65722B272066726F6D206D657461646174612E27293B72657475726E2076616C75653B7D66756E6374696F6E207472616E7366657228746F2C76616C7565297B6173736572742861646472657373436865636B28746F293D3D3D747275652C274172672D746F206973206E6F7420612076616C696420616464726573732E27293B6173736572742873746F493634436865636B2876616C7565293D3D3D747275652C274172672D76616C7565206D75737420626520616C7068616E756D657269632E27293B61737365727428696E743634436F6D706172652876616C75652C273027293E302C274172672D76616C7565206D7573742062652067726561746572207468616E20302E27293B69662873656E6465723D3D3D746F297B746C6F6728277472616E73666572272C73656E6465722C746F2C76616C7565293B72657475726E20747275653B7D6C65742073656E64657256616C75653D73746F726167654C6F61642873656E646572293B6173736572742873656E64657256616C7565213D3D66616C73652C274661696C656420746F20676574207468652062616C616E6365206F6620272B73656E6465722B272066726F6D206D657461646174612E27293B61737365727428696E743634436F6D706172652873656E64657256616C75652C76616C7565293E3D302C2742616C616E63653A272B73656E64657256616C75652B27206F662073656E6465723A272B73656E6465722B27203C207472616E736665722076616C75653A272B76616C75652B272E27293B6C657420746F56616C75653D73746F726167654C6F616428746F293B746F56616C75653D28746F56616C75653D3D3D66616C7365293F76616C75653A696E74363441646428746F56616C75652C76616C7565293B73746F7261676553746F726528746F2C746F56616C7565293B73656E64657256616C75653D696E7436345375622873656E64657256616C75652C76616C7565293B73746F7261676553746F72652873656E6465722C73656E64657256616C7565293B746C6F6728277472616E73666572272C73656E6465722C746F2C76616C7565293B72657475726E20747275653B7D66756E6374696F6E207472616E7366657246726F6D2866726F6D2C746F2C76616C7565297B6173736572742861646472657373436865636B2866726F6D293D3D3D747275652C274172672D66726F6D206973206E6F7420612076616C696420616464726573732E27293B6173736572742861646472657373436865636B28746F293D3D3D747275652C274172672D746F206973206E6F7420612076616C696420616464726573732E27293B6173736572742873746F493634436865636B2876616C7565293D3D3D747275652C274172672D76616C7565206D75737420626520616C7068616E756D657269632E27293B61737365727428696E743634436F6D706172652876616C75652C273027293E302C274172672D76616C7565206D7573742062652067726561746572207468616E20302E27293B69662866726F6D3D3D3D746F297B746C6F6728277472616E7366657246726F6D272C73656E6465722C66726F6D2C746F2C76616C7565293B72657475726E20747275653B7D6C65742066726F6D56616C75653D73746F726167654C6F61642866726F6D293B6173736572742866726F6D56616C7565213D3D66616C73652C274661696C656420746F20676574207468652076616C75652C2070726F6261626C79206265636175736520272B66726F6D2B2720686173206E6F2076616C75652E27293B61737365727428696E743634436F6D706172652866726F6D56616C75652C76616C7565293E3D302C66726F6D2B272042616C616E63653A272B66726F6D56616C75652B27203C207472616E736665722076616C75653A272B76616C75652B272E27293B6C657420616C6C6F7756616C75653D616C6C6F77616E63652866726F6D2C73656E646572293B61737365727428696E743634436F6D7061726528616C6C6F7756616C75652C76616C7565293E3D302C27416C6C6F77616E63652076616C75653A272B616C6C6F7756616C75652B27203C207472616E736665722076616C75653A272B76616C75652B272066726F6D20272B66726F6D2B2720746F20272B746F2B272E27293B6C657420746F56616C75653D73746F726167654C6F616428746F293B746F56616C75653D28746F56616C75653D3D3D66616C7365293F76616C75653A696E74363441646428746F56616C75652C76616C7565293B73746F7261676553746F726528746F2C746F56616C7565293B66726F6D56616C75653D696E7436345375622866726F6D56616C75652C76616C7565293B73746F7261676553746F72652866726F6D2C66726F6D56616C7565293B6C657420616C6C6F774B65793D6D616B65416C6C6F77616E63654B65792866726F6D2C73656E646572293B616C6C6F7756616C75653D696E74363453756228616C6C6F7756616C75652C76616C7565293B73746F7261676553746F726528616C6C6F774B65792C616C6C6F7756616C7565293B746C6F6728277472616E7366657246726F6D272C73656E6465722C66726F6D2C746F2C76616C7565293B72657475726E20747275653B7D66756E6374696F6E2062616C616E63654F662861646472657373297B6173736572742861646472657373436865636B2861646472657373293D3D3D747275652C274172672D61646472657373206973206E6F7420612076616C696420616464726573732E27293B6C65742076616C75653D73746F726167654C6F61642861646472657373293B6173736572742876616C7565213D3D66616C73652C274661696C656420746F20676574207468652062616C616E6365206F6620272B616464726573732B272066726F6D206D657461646174612E27293B72657475726E2076616C75653B7D66756E6374696F6E20696E697428696E7075745F737472297B6C657420706172616D733D4A534F4E2E706172736528696E7075745F737472292E706172616D733B6173736572742873746F493634436865636B28706172616D732E746F74616C537570706C79293D3D3D747275652626706172616D732E746F74616C537570706C793E302626747970656F6620706172616D732E6E616D653D3D3D27737472696E67272626706172616D732E6E616D652E6C656E6774683E302626747970656F6620706172616D732E73796D626F6C3D3D3D27737472696E67272626706172616D732E73796D626F6C2E6C656E6774683E302626747970656F6620706172616D732E646563696D616C733D3D3D276E756D626572272626706172616D732E646563696D616C733E3D302C274661696C656420746F20636865636B206172677327293B676C6F62616C4174747269627574652E746F74616C537570706C793D706172616D732E746F74616C537570706C793B676C6F62616C4174747269627574652E6E616D653D706172616D732E6E616D653B676C6F62616C4174747269627574652E73796D626F6C3D706172616D732E73796D626F6C3B676C6F62616C4174747269627574652E76657273696F6E3D274154503230273B676C6F62616C4174747269627574652E646563696D616C733D706172616D732E646563696D616C733B73746F7261676553746F726528676C6F62616C4174747269627574654B65792C4A534F4E2E737472696E6769667928676C6F62616C41747472696275746529293B73746F7261676553746F72652873656E6465722C676C6F62616C4174747269627574652E746F74616C537570706C79293B7D66756E6374696F6E206D61696E28696E7075745F737472297B6C657420696E7075743D4A534F4E2E706172736528696E7075745F737472293B696628696E7075742E6D6574686F643D3D3D277472616E7366657227297B7472616E7366657228696E7075742E706172616D732E746F2C696E7075742E706172616D732E76616C7565293B7D656C736520696628696E7075742E6D6574686F643D3D3D277472616E7366657246726F6D27297B7472616E7366657246726F6D28696E7075742E706172616D732E66726F6D2C696E7075742E706172616D732E746F2C696E7075742E706172616D732E76616C7565293B7D656C736520696628696E7075742E6D6574686F643D3D3D27617070726F766527297B617070726F766528696E7075742E706172616D732E7370656E6465722C696E7075742E706172616D732E76616C7565293B7D656C73657B7468726F77273C4D61696E20696E746572666163652070617373657320616E20696E76616C6964206F7065726174696F6E20747970653E273B7D7D66756E6374696F6E20717565727928696E7075745F737472297B6C657420726573756C743D7B7D3B6C657420696E7075743D4A534F4E2E706172736528696E7075745F737472293B696628696E7075742E6D6574686F643D3D3D27746F6B656E496E666F27297B676C6F62616C4174747269627574653D4A534F4E2E70617273652873746F726167654C6F616428676C6F62616C4174747269627574654B657929293B726573756C742E746F6B656E496E666F3D676C6F62616C4174747269627574653B7D656C736520696628696E7075742E6D6574686F643D3D3D27616C6C6F77616E636527297B726573756C742E616C6C6F77616E63653D616C6C6F77616E636528696E7075742E706172616D732E6F776E65722C696E7075742E706172616D732E7370656E646572293B7D656C736520696628696E7075742E6D6574686F643D3D3D2762616C616E63654F6627297B726573756C742E62616C616E63653D62616C616E63654F6628696E7075742E706172616D732E61646472657373293B7D656C73657B7468726F77273C517565727920696E746572666163652070617373657320616E20696E76616C6964206F7065726174696F6E20747970653E273B7D72657475726E204A534F4E2E737472696E6769667928726573756C74293B7D1A041A02080128C0843D325C7B22706172616D73223A7B2273796D626F6C223A2243474F222C22746F74616C537570706C79223A2231303030303030303030222C22646563696D616C73223A382C226E616D65223A22436F6E747261637420476C6F62616C227D7D
```

### Signing the Transaction-1

All transactions need to be signed, and a transaction will not take effect until it is signed. The signature result includes signature data and a public key.
The specific code for signing transactions is as follows. The parameter `transactionBlob` in the example is the serialized transaction string obtained by calling `seralizeTransaction`.

```java
 public Signature[] signTransaction(String transactionBlob) { 
    Signature[] signatures = null; 
    // The account private key to create contract and issue ctp 1.0 token 
    String senderPrivateKey = "privbs4iBCugQeb2eiycU8RzqkPqd28eaAYrRJGwtJTG8FVHjwAyjiyC"; 

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
```
Return value:
```
 signData: 37C3EEF6FDA7CBF9AFDFAA038EE9444886F37563E5897B65F719FEB3B216E485D11A5AD31255F3DFFE533C1AA16DE9F23C73E51CF94368FDF2C5638D25D23D07 
 publicKey: b00135e99d67a4c2e10527f766e08bc6afd4420951628149042fdad6584a5321c23c716a528b
```


### Sending the Transaction-1

Send the serialized transaction and the signature to BuChain.
The specific code for sending the transaction is as follows. The parameter `transactionBlob` in the example is the serialized transaction string obtained by calling `seralizeTransaction`, and signatures is the signature data obtained by calling `signTransaction`.

```java
 public String submitTransaction(String transactionBlob, Signature[] signatures) { 
    String  hash = null; 

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
```
Return value:
```
 hash: ac296754120911c47fb0e83d0df0c0ae82e32e9822a4a92d910886d9303b015e
```


### Querying Whether the Transaction Was Executed Successfully-1


**Note**:
The result returned after the transaction is sent only indicates whether the transaction is submitted successfully. If you want to know whether the transaction is executed successfully, you have to perform the one of the following two operations for querying. 


#### Querying with the Blockchain Explorer-1

In the BUMO blockchain browser, query the above hash. [The main network](https://explorer.bumo.io) and [the test network](https://explorer.bumotest.io). The operation is as follows:

<img src="/docs/assets/BUExplorer1.png"
​     style= "margin-left: 20px">

Result:

<img src="/docs/assets/BUResult1.png"
​     style= "margin-left: 20px">


#### Querying by Calling the Interface-1

The following code shows how to query by calling the interface. The parameter `txHash` in this example is the transaction hash (the unique identifier of the transaction) obtained by calling `submitTransaction`.

```java
 public int checkTransactionStatus(String txHash) {
    // Init request
    TransactionGetInfoRequest request = new TransactionGetInfoRequest();
    request.setHash(txHash);

    // Call getInfo
    TransactionGetInfoResponse response = sdk.getTransactionService().getInfo(request);
    int errorCode = response.getErrorCode();
    if (errorCode == 0){
        TransactionHistory transactionHistory = response.getResult().getTransactions()[0];
        errorCode = transactionHistory.getErrorCode();
    }

    return errorCode;
 }
```

Return value:

| Error code | Description                                              |
| ------ | ------------------------------------------------------------ |
| 0      | Successful operation                                         |
| 1      | Inner service defect                                         |
| 2      | Parameters error                                             |
| 3      | Objects already exist, such as repeated transactions      |
| 4      | Objects do not exist, such as null account, transactions and blocks etc. |
| 5      | Transactions expired. It means the transaction has been removed from the buffer, but it still has probability to be executed. |
| 7      | Math calculation is overflown                                |
| 20     | The expression returns false. It means the TX failed to be executed currently, but it still has probability to be executed in the following blocks . |
| 21     | The syntax of the expression returns are false. It means that the TX must fail. |
| 90     | Invalid public key                                           |
| 91     | Invalid private key                                          |
| 92     | Invalid assets                                               |
| 93     | The weight of the signature does not match the threshold of the operation. |
| 94     | Invalid address                                              |
| 97     | Absent operation of TX                                       |
| 98     | Over 100 operations in a single transaction                  |
| 99     | Invalid sequence or nonce of TX                              |
| 100    | Low reserve in the account                                   |
| 101    | Sender and receiver accounts are the same                    |
| 102    | The target account already exists                            |
| 103    | Accounts do not exist                                        |
| 104    | Low reserve in the account                                   |
| 105    | Amount of assets exceeds the limitation ( int64 )         |
| 106    | Insufficient initial reserve for account creation            |
| 111    | Low transaction fee                                          |
| 114    | TX buffer is full                                            |
| 120    | Invalid weight                                               |
| 121    | Invalid threshold                                            |
| 144    | Invalid data version of metadata                             |
| 146    | Exceeds upper limitation                                     |
| 151    | Failure in contract execution                                |
| 152    | Failure in syntax analysis                                   |
| 153    | The depth of contract recursion exceeds upper limitation     |
| 154    | The TX submitted from the  contract exceeds upper limitation |
| 155    | Contract expired                                             |
| 160    | Fail to insert the TX into buffer                            |
| 11060  | BlockNumber must be bigger than 0                            |
| 11007  | Failed to connect to the network                             |
| 12001  | Request parameter cannot be null                             |
| 20000  | System error                                                 |


## Scenario Two

This example mainly implements contract triggering function. Watch the demo: [TriggerContractDemo.java](https://github.com/bumoproject/bumo-sdk-java/blob/develop/examples/src/main/java/io/bumo/sdk/example/TriggerContractDemo.java)

The asset issuer `buQYLtRq4j3eqbjVNGYkKYo3sLBqW3TQH2xH` is assigned to himself 20000 CGO on BuChain through the smart contract account `buQcEk2dpUv6uoXjAqisVRyP1bBSeWUHCtF2`, and transfers 10000 CGO to another account `buQXPeTjT173kagZ7j8NWAPJAgJCpJHFdyc7`.

The specific implementation process in this scenario includes: [Creating SDK Instances-2](#creating-sdk-instances-2), [Obtaining the Serial Number of the Asset Issuer Account-2](#obtaining-the-serial-number-of-the-asset-issuer-account-2), [Assembling CGO Allocation and CGO Transfer](#assembling-cgo-allocation-and-cgo-transfer), [Serializing Transactions-2](#serializing-transactions-2), [Signing Transactions-2](#signing-transactions-2), [Sending Transactions-2](#sending-transactions-2), and [Querying whether the Transaction Was Executed Successfully-2](#querying-whether-the-transaction-was-executed-successfully-2).

### Creating SDK Instances-2

Create an instance and set the url (the IP and port of a deployed node).
```java
 String url = "http://seed1.bumotest.io:26002";
 SDK sdk = SDK.getInstance(url);
```

In the BuChain network, each block is generated every 10 seconds, and each transaction requires only one confirmation to get the final state of the transaction.

Environment description:

| Network Environment | IP                | Port  | Blockchain Explorer         |
| ------------------- | ----------------- | ----- | --------------------------- |
| Mainnet             | seed1.bumo.io     | 16002 | https://explorer.bumo.io    |
| Testnet             | seed1.bumotest.io | 26002 | https://explorer.bumotest.io |

### Obtaining the Serial Number of the Asset Issuer Account-2

Each account maintains its own serial number, which starts from 1 and is incremented. A serial number marks a transaction for that account. The code to obtain the serial number of the asset issuer account is as follows:

```java
 public long getAccountNonce() {
    long nonce = 0;

    // Init request
    String accountAddress = [account address of asset issuer];
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
```
Return value:

```
 nonce: 8
```

### Assembling CGO Allocation and CGO Transfer

This section contains two operations: allocating CGO and transferring CGO. The following is the sample code:

```java
 public BaseOperation[] buildOperations() 
 { // The account address to issue apt1.0 token 
 String invokeAddress = "buQYLtRq4j3eqbjVNGYkKYo3sLBqW3TQH2xH"; 
 // The contract address 
 String contractAddress = "buQcEk2dpUv6uoXjAqisVRyP1bBSeWUHCtF2"; 
 // The destination address 
 String destAddress = "buQXPeTjT173kagZ7j8NWAPJAgJCpJHFdyc7"; 
 // The amount to be assigned 
 String assignAmount = "20000"; 
 // The amount to be transfered 
 String transferAmount = "10000";


 // build assign method input 
 JSONObject assignInput = new JSONObject(); 
 assignInput.put("method", "assign"); 
 JSONObject assignParams = new JSONObject(); 
 assignParams.put("to", invokeAddress); 
 assignParams.put("value", assignAmount); 
 assignInput.put("params", assignParams); 

 // build send bu operation to assign CGO 
 ContractInvokeByBUOperation assignOperation = new ContractInvokeByBUOperation(); 
 assignOperation.setSourceAddress(invokeAddress); 
 assignOperation.setContractAddress(contractAddress); 
 assignOperation.setBuAmount(0L); 
 assignOperation.setInput(assignInput.toJSONString());

 // build transfer method input 
 JSONObject transferInput = new JSONObject(); 
 transferInput.put("method", "transfer"); 
 JSONObject transferParams = new JSONObject(); 
 transferParams.put("to", destAddress); 
 transferParams.put("value", transferAmount); 
 transferInput.put("params", transferParams);

 // build send bu operation to transfer CGO 
 ContractInvokeByBUOperation transferOperation = new ContractInvokeByBUOperation(); 
 transferOperation.setSourceAddress(invokeAddress); 
 transferOperation.setContractAddress(contractAddress); 
 transferOperation.setBuAmount(0L); 
 transferOperation.setInput(transferInput.toJSONString()); 
 BaseOperation[] operations = { assignOperation, transferOperation }; 
 return operations; }
```

### Serializing Transactions-2

Serializing transactions for the convenience of network transmission.


**Note**:
- feeLimit: the maximum transaction fee that the originator of this transaction will pay for this transaction.To create a contract account and issue a ctp token operation, please fill in 0.02 BU.
- nonce: the transaction serial number of the originator of this transaction, which is obtained by adding 1 to the nonce value of the current account.

The specific code of serializing the transaction is as follows. The parameter `nonce` in the example is the account serial number obtained by calling `getAccountNonce`, and the parameter `operations` is the asset issuance operation obtained by calling `buildOperations`. 
The following is the sample code for serializing the transaction:

```java
 public String seralizeTransaction(Long nonce,  BaseOperation[] operations) { 
    String transactionBlob = null; 

    // The account address to create contract and issue ctp 1.0 token 
    String senderAddresss = "buQYLtRq4j3eqbjVNGYkKYo3sLBqW3TQH2xH"; 
    // The gasPrice is fixed at 1000L, the unit is MO 
    Long gasPrice = 1000L; 
    // Set up the maximum cost 10.08BU 
    Long feeLimit = ToBaseUnit.BU2MO("0.02"); 
    // Nonce should add 1 
    nonce += 1; 
    
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
```
Return value:

```
 transactionBlob: 0A24627551594C745271346A336571626A564E47596B4B596F33734C4271573354514832784810091880B8D3E00320E8073AAF0108071224627551594C745271346A336571626A564E47596B4B596F33734C427157335451483278485284010A246275515A4C38706666744E416562573853626A5237376D453579747977574E3532486E751A5C7B226D6574686F64223A227472616E73666572222C22706172616D73223A7B22746F223A22627551585065546A543137336B61675A376A384E5741504A41674A43704A484664796337222C2276616C7565223A223130303030227D7D
```

### Signing Transactions-2

All transactions need to be signed, and a transaction will not take effect until it is signed. The signature result includes signature data and a public key.
The specific code for signing transactions is as follows. The parameter `transactionBlob` in the example is the serialized transaction string obtained by calling `seralizeTransaction`.

```java
 public Signature[] signTransaction(String transactionBlob) { 
     Signature[] signatures = null; 
     // The account private key to create contract and issue ctp 1.0 token 
     String senderPrivateKey = "privbs4iBCugQeb2eiycU8RzqkPqd28eaAYrRJGwtJTG8FVHjwAyjiyC"; 

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
```

Return value:

```
 signData: 244D230BD01EBE1EDFC73382ECBBF6AF7639BDC4FA95C362EC39D776FB53FEFE20D699F20EE3082F90E8E66D16484EE44D1525AD311BB333006D32AE1E2D9501
 publicKey: b00135e99d67a4c2e10527f766e08bc6afd4420951628149042fdad6584a5321c23c716a528b
```

### Sending Transactions-2

Send the serialized transaction and signature to BuChain.
The specific code for sending transactions is as follows. The parameter `transactionBlob` in the example is the serialized transaction string obtained by calling `seralizeTransaction`, and the parameter `signatures` is the signature data obtained by calling `signTransaction`.

```java
 public String submitTransaction(String transactionBlob, Signature[] signatures) { 
    String  hash = null; 

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
```

Return value:
```
 hash: 7783bca41e08a14629e8ce2e12ac8580d2a287343b657f47eb7fc828ca9edb8d
```

### Querying whether the Transaction Was Executed Successfully-2

**Note**: 
The result returned after the transaction is sent only indicates whether the transaction was submitted successfully. If you want to know whether the transaction is executed successfully, you have to perform the one of the following two operations for querying.

#### Querying with the Blockchain Explorer-2

In the BUMO blockchain browser, query the above hash. [The main network](https://explorer.bumo.io) and [the test network](https://explorer.bumotest.io). The operation is as follows:


<img src="/docs/assets/BUExplorer2.png"
​     style= "margin-left: 20px">

Result:

<img src="/docs/assets/BUResult2.png"
​     style= "margin-left: 20px">

#### Querying by Calling the Interface-2

The following code shows how to query by calling the interface. The parameter txHash in this example is the transaction hash (the unique identifier of the transaction) obtained by calling submitTransaction.

```java
 public int checkTransactionStatus(String txHash) {
    // Init request
    TransactionGetInfoRequest request = new TransactionGetInfoRequest();
    request.setHash(txHash);

    // Call getInfo
    TransactionGetInfoResponse response = sdk.getTransactionService().getInfo(request);
    int errorCode = response.getErrorCode();
    if (errorCode == 0){
        TransactionHistory transactionHistory = response.getResult().getTransactions()[0];
        errorCode = transactionHistory.getErrorCode();
    }

    return errorCode;
 }
```

Return value:

| Error code | Description                                              |
| ------ | ------------------------------------------------------------ |
| 0      | Successful operation                                         |
| 1      | Inner service defect                                         |
| 2      | Parameters error                                             |
| 3      | Objects already exist, such as repeated transactions      |
| 4      | Objects do not exist, such as null account, transactions and blocks etc. |
| 5      | Transactions expired. It means the transaction has been removed from the buffer, but it still has probability to be executed. |
| 7      | Math calculation is overflown                                |
| 20     | The expression returns false. It means the TX failed to be executed currently, but it still has probability to be executed in the following blocks . |
| 21     | The syntax of the expression returns are false. It means that the TX must fail. |
| 90     | Invalid public key                                           |
| 91     | Invalid private key                                          |
| 92     | Invalid assets                                               |
| 93     | The weight of the signature does not match the threshold of the operation. |
| 94     | Invalid address                                              |
| 97     | Absent operation of TX                                       |
| 98     | Over 100 operations in a single transaction                  |
| 99     | Invalid sequence or nonce of TX                              |
| 100    | Low reserve in the account                                   |
| 101    | Sender and receiver accounts are the same                    |
| 102    | The target account already exists                            |
| 103    | Accounts do not exist                                        |
| 104    | Low reserve in the account                                   |
| 105    | Amount of assets exceeds the limitation ( int64 )         |
| 106    | Insufficient initial reserve for account creation            |
| 111    | Low transaction fee                                          |
| 114    | TX buffer is full                                            |
| 120    | Invalid weight                                               |
| 121    | Invalid threshold                                            |
| 144    | Invalid data version of metadata                             |
| 146    | Exceeds upper limitation                                     |
| 151    | Failure in contract execution                                |
| 152    | Failure in syntax analysis                                   |
| 153    | The depth of contract recursion exceeds upper limitation     |
| 154    | The TX submitted from the  contract exceeds upper limitation |
| 155    | Contract expired                                             |
| 160    | Fail to insert the TX into buffer                            |
| 11060  | BlockNumber must be bigger than 0                            |
| 11007  | Failed to connect to the network                             |
| 12001  | Request parameter cannot be null                             |
| 20000  | System error                                                 |


## Scenario Three

This example mainly implements contract query function.

Check the CGO balance of the account `buQXPeTjT173kagZ7j8NWAPJAgJCpJHFdyc7` via the smart contract account `buQcEk2dpUv6uoXjAqisVRyP1bBSeWUHCtF2` on BuChain.

This section mainly introduces [Creating SDK Instances-3](#creating-sdk-instances-3) and [Querying Balance](#querying-balance).

### Creating SDK Instances-3

Create an instance and set the url (the IP and port of a deployed node).

```java
 String url = "http://seed1.bumotest.io:26002";
 SDK sdk = SDK.getInstance(url);
```

In the BuChain network, each block is generated every 10 seconds, and each transaction requires only one confirmation to get the final state of the transaction.
Environment description:

| Network Environment | IP                | Port  | Blockchain Explorer         |
| ------------------- | ----------------- | ----- | --------------------------- |
| Mainnet             | seed1.bumo.io     | 16002 | https://explorer.bumo.io    |
| Testnet             | seed1.bumotest.io | 26002 | https://explorer.bumotest.io |

### Querying Balance

The sample code for querying the balance is as follows:

```java

 public String queryContract() { 
    // Init variable 
    // Contract address 
    String contractAddress = "buQcEk2dpUv6uoXjAqisVRyP1bBSeWUHCtF2"; 
    // TokenOwner address 
    String tokenOwner = "buQXPeTjT173kagZ7j8NWAPJAgJCpJHFdyc7"; 

    // Init input 
    JSONObject input = new JSONObject(); 
    input.put("method", "balanceOf"); 
    JSONObject params = new JSONObject(); 
    params.put("address", tokenOwner); 
    input.put("params", params); 
    // Init request 
    ContractCallRequest request = new ContractCallRequest(); 
    request.setContractAddress(contractAddress); 
    request.setFeeLimit(10000000000L); 
    request.setOptType(2); 
    request.setInput(input.toJSONString()); 

    // Call call 
    String result = null; 
    ContractCallResponse response = sdk.getContractService().call(request); 
    if (response.getErrorCode() == 0) { 
        result = JSON.toJSONString(response.getResult().getQueryRets().getJSONObject(0)); 
    } else { 
        System.out.println("error: " + response.getErrorDesc()); 
    } 
    return result; 
    } 
```
Return value:

```json
 {
     "result":{
         "type":"string",
         "value":"{\"balance\":\"10000\"}"
     }
 } 
```