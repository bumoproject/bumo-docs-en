---
id: version-1.0.0.10-codemach_editor_user_guide
title: BUMO CodeMach Editor User Guide
sidebar_label: CodeMach Editor
original_id: codemach_editor_user_guide
---

## Introduction

BUMO provides a developer-friendly smart contract editor, `CodeMach Editor`, for developers to visually debug contracts. `CodeMach Editor` has a bunch of extensible underlying interfaces that support `JavaScript`, `C`, `C++`, `Python`, `Golang`, and more. `CodeMach Editor` meets cross-platform operational scenarios with certifiable out-of-contract data feedback and a separate sandbox environment, so smart contracts can be executed in an isolated environment. At the same time, `CodeMach Editor` also provides contract interoperability and exception handling mechanisms. The URL of `CodeMach Editor` is as follows: https://cme.bumo.io/.

The following is the default page of the contract editor, `CodeMach Editor`. This page is divided into five areas. The following describes the functions of `CodeMach Editor` in each area.

<img src="/docs/assets/codemacheditoroverview.jpg"
     style= "margin-left: 20px">

- **Area 1** is the browsing area where file directories are displayed. The **Example** directory is the default generated example, and the code inside can be copied and used directly. **Customize** is a custom folder. You can create a file by the **+** symbol next to **Custom**, or by clicking **+Folder** above.

- **Area 2** is the code editing area, and the contract code can be edited in this area.

- **Area 3** is the information area, and the current user's account address and the number of available BUs are displayed here. When it prompts that BUs are insufficient, click the **Refresh** button next to it to get 100BUs again. You can set smart contract parameters at **Deploy the contract**, where parameters are passed in for the specified method. Once the contract parameters have been set, click the **Deploy** button below to generate the contract. The **Contractinformation** shows the return information displayed after the smart contract is executed.

- **Area 4** is the console area. After the smart contract is executed, relevant information such as contract address and transaction hash will be displayed here. If an error occurs during the execution, an error message will be returned to the console area.

- **Area 5** is an area to invoke smart contracts. After selecting the main function, you can configure methods and parameters to execute the main function at **Deploy the contract**. After selecting query, you can execute the query function by configuring methods and parameters at **Deploy the contract**.  

The following sections describe how to use CodeMach Editor to customize files or folders, generate smart contracts, and call smart contracts.

## Custom Folders and Files

The fllowing sections walk you through the process to customize folders and files.

### Customizing Folders

You can customize files in `CodeMach Editor` by following these steps:
1. Click **+Folder** in the upper right corner of the browsing area, or the **+** symbol to the right of the **Customize** folder.

<img src="/docs/assets/customfolder.jpg"
     style= "margin-left: 20px">

2. In the pop-up dialog box, enter the name of the new folder, such as *bumotest*.

<img src="/docs/assets/newfolder.jpg"
     style= "margin-left: 20px">  

3. Click **Enter** to complete the new folder and the new folder is displayed in the list on the left.

<img src="/docs/assets/foldercreated.jpg"
     style= "margin-left: 20px">  


### Customizing Files

You can create new files in the **Example** folder or **Customize** folder of `CodeMach Editor` by following these steps:
1. Click the **+** symbol to the right of the folder where you want to create a new file. For example, select the new folder **bumotest**.
2. In the pop-up dialog box, enter the name of the new file, such as *newfile*.

<img src="/docs/assets/newfile.jpg"
     style= "margin-left: 20px">  

3. Click **Enter** to complete the new file and the new file is displayed under the **bumotest** folder.

<img src="/docs/assets/newfilecreated.jpg"
     style= "margin-left: 20px">  

## Generating Smart Contracts

You can generate a smart contract after setting parameters for the smart contract. Take the default code of `CodeMach Editor` as an example. The specific implementation steps are as follows: 
1. Enter the parameters of the init function at **Deploy the contract**, such as *5*.
2. Click **Deploy** to generate a smart contract.

<img src="/docs/assets/smartcontractgenerated.jpg"
     style= "margin-left: 20px">

**Note**:
* After the smart contract is successfully generated, a success message is displayed under the **Deploy** button.
* After the smart contract is executed, the return information including the contract address and transaction hash is displayed at **Contract information**.
* After the smart contract is executed, relevant information such as contract address and transaction hash is displayed at the console area. If an error occurs during the execution, an error message is returned to the console.
* Click **Show source data** to display the source data code.   

## Calling Smart Contracts

Calling a smart contract involves calling the main function and calling the `query` function.

### Calling the Main Function

You can call the main function by the following steps:
1. Click **main** under **Invoke the contract**.
2. Enter the parameter in the input box, such as *5*.
3. Enter the number of BUs to send at **Amount of BU to be sent to the contract address**.
4. Click **Invoke** to complete the call.

<img src="/docs/assets/callmain.jpg"
     style= "margin-left: 20px">

**Note**: After the `main` function is called, the transaction hash value and the transaction result are displayed at the console.

### Calling the Query Function

You can call the query function by the following steps:
1. Click **query** under **Invoke the contract**.
2. Enter the parameter in the input box, such as *3*.
3. Click **Invoke** to complete the call.

<img src="/docs/assets/callquery.jpg"
     style= "margin-left: 20px">

**Note**: After the `query` function is called, the result of the query is displayed at the console.