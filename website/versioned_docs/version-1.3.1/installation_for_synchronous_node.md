---
id: version-1.3.1-installation_for_synchronous_node
title: Installation Guide for BUMO Synchronization Nodes in Main Network
sidebar_label: Installation Guide for Synchronization Nodes in Main Network
original_id: installation_for_synchronous_node
---



## Overview

This document will walk you through the process of installing and configuring the BUMO node in both Linux system.

Details：[BUMO Installation and Maintenance Guide](../installation_maintenance_guide)



## System Requirements

Before installing a BUMO node, you must make sure that your system meets the following requirements.

### Hardware Requirements

The hardware requirements must meet the following configurations:

- **Recommended**：CPU 8 cores, memory 32G, bandwidth 20M, SSD disk 500G
- **Minimum**：CPU 4 cores, memory 16G, bandwidth 10M, SSD disk 500G

### Software Requirements

You can choose Ubuntu, Centos or MacOS systems. The following systems are supported.

- Ubuntu 14.04
- Centos 7



### Installing with a Package

Installing with a package refers to installing the BUMO node with an installation package. Installing the BUMO node with the installation package consists of five parts: [Obtaining the Installation Package and Extracting It](#obtaining-the-installation-package-and-extracting-it), [Registering the Services](#registering-the-services), [Modifying the Service Startup Directory](#modifying-the-service-startup-directory), [Setting the Boot Start](#setting-the-boot-start), and [Selecting the Configuration File for the Main Network](#selecting-the-configuration-file-for-the-main-network).

Example for bumo 1.3.1 version.



### Obtaining the Installation Package and Extracting It

You must complete the following steps to obtain the installation package of BUMO and extract it.

1. Input the following command to download the installation package of BUMO.

    ```bash
    wget https://github.com/bumoproject/bumo/releases/download/1.3.1/buchain-1.3.1-linux-x64.tar.gz
    ```
  > **Note**: 
  >
  >    - If you have not installed `wget`, you can use the `apt-get install wget` command to install `wget`.
  > - You can find the version you need from the https://github.com/bumoproject/bumo/releases link and then right-click the version to copy the download link.
  > - In this example the file is downloaded to the root directory.


2. Copy the installation package to the /usr/local/ directory by inputting the following command.

    ```shell
    cp buchain-1.3.1-linux-x64.tar.gz /usr/local/
    ```
    
  > **Note**: The above copy operation is done in the directory where the file is downloaded. You must copy the file according to the specific download directory.

3. Input the following command to go to the /usr/local/ directory.

    ```shell
    cd /usr/local/
    ```

4. Input the following command to extract the file.

    ```shell
    tar -zxvf buchain-1.3.1-linux-x64.tar.gz
    ```
    
  > **Note**: After extracting the file, the buchain/ directory is generated.



### Registering the Services

After extracting the file, you must register the services of bumo and bumod. You must complete the following steps to register services:

1. Input the following command to register the service of bumo.

    ```shell
    ln -s /usr/local/buchain/scripts/bumo /etc/init.d/bumo
    ```

2. Input the following command to register the service of bumod.

    ```shell 
    ln -s /usr/local/buchain/scripts/bumod /etc/init.d/bumod
    ```



### Modifying the Service Startup Directory

You must complete the following steps to modify the boot directory of bumo and bumod:

1. Open the bumo file by inputting the following command in the local/ directory.

    ```shell
    vim buchain/scripts/bumo
    ```

2. Locate `install_dir` and change the installation directory of bumo.

    ```shell
    install_dir=/usr/local/buchain
    ```
    

  <img src="/docs/assets/start_path.png" style= "margin-left: 20px">

  > **Note**: By default, the directory of `install_dir` is in the /usr/local/buchain directory; you can modify it according to the specific installation directory of bumo.

3. Press `Esc` to exit editing.

4. Input `:wq` to save the file.

5. Open the bumod file by inputting the following command in the local/ directory.

    ```shell
    vim /buchain/scripts/bumod
    ```

6. Locate `install_dir` and change the installation directory for bumod.

    ```shell
    install_dir=/usr/local/buchain
    ```

  > **Note: **By default, the directory of `install_dir` is in the /usr/local/buchain directory; you can modify it according to the specific installation directory of bumod.

7. Press `Esc` to exit editing.

8. Input `:wq` to save the file.



#### Setting the Boot Start

Setting up booting includes setting the startup level, adding startup commands, and modifying file permissions. You must complete the following steps to set up the boot:

1. Input the following command to set level 1.

   ```shell  
   ln -s -f /etc/init.d/bumod /etc/rc1.d/S99bumod
   ```

2. Input the following command to set level 2.

   ```shell 
   ln -s -f /etc/init.d/bumod /etc/rc2.d/S99bumod
   ```

3. Input the following command to set level 3.

   ```shell
   ln -s -f /etc/init.d/bumod /etc/rc3.d/S99bumod
   ```

4. Input the following command to set level 4.

   ```shell 
   ln -s -f /etc/init.d/bumod /etc/rc4.d/S99bumod
   ```

5. Input the following command to set level 5.

   ```shell  
   ln -s -f /etc/init.d/bumod /etc/rc5.d/S99bumod
   ```

6. Input the following command to open the rc.local file.

   ```shell
   vim /etc/rc.local
   ```

7. Append the following command to the end of the rc.local file.

   ```shell
   /etc/init.d/bumod start
   ```

  <img src="/docs/assets/add_start_command.png" style= "margin-left: 20px">

8. Press `Esc` to exit editing.

9. Input `:wq` to save the file.

10. Execute the following command to set the permission of the rc.local file.

    ```shell  
    chmod +x /etc/rc.local
    ```

**Note: **Now the BUMO node is installed. Before starting the bumo service, you must select the configuration file for the running environment.



### Selecting the Configuration File for the Main Network

After installing the BUMO node, you must select the configuration file of the main network to start the bumo service. Steps as follow:

1. Input the following command to go to the configuration file directory.

    ```shell
    cd /usr/local/buchain/config/
    ```
    
2. Input the following command to rename the configuration file for the runtime environment.

    ```shell
    mv bumo-mainnet.json bumo.json
    ```
  > **Note: **
  >
  > - In this example, the main network environment is selected as the running environment. You can also select other files as your running environment according to your needs.
  > - After renaming the file, the bumo service can be started by the `service bumo start` command.
  > - After installing the BUMO node, you can view the directory structure of the installation file in the buchain/ directory.



## Configuration

Configuration by modifying the **bumo.json** file in *buchain*'s *config* directory. Here we configure **validation_address** and **validation_private_key** in *ledger*. These two items are the account address of the validation node and the encrypted private key. If the synchronization node is used, these two items will not work, but if the synchronization node applies to be the validation node, they can be used to participate in the consensus.



### Structure

```json 
"ledger":{
    "validation_address":"buQmtDED9nFcCfRkwAF4TVhg6SL1FupDNhZY",//The address of validation node; the sync node or wallet does not need to be configured
    "validation_private_key": "e174929ecec818c0861aeb168ebb800f6317dae1d439ec85ac0ce4ccdb88487487c3b74a316ee777a3a7a77e5b12efd724cd789b3b57b063b5db0215fc8f3e89", //The private key of validation node; the sync node or wallet does not need to be configured
    "max_trans_per_ledger":1000, //Maximum number of transactions per block
    "tx_pool": //Transaction pool configuration
    {
        "queue_limit":10240, // Limited transactions in the transaction pool
        "queue_per_account_txs_limit":64 //Maximum transaction buffer for a single account
    }
}
```

> **Note: **`Validation_address` and `validation_private_key` can be obtained through the bumo program command line tool. Please save the account information properly and you will not be able to retrieve it if it is lost.



### Generate Command

1.　Generate a new public-private key pair with the following executable command (Where address and private_key_aes correspond to validation_address and validation_private_key, respectively.): 

```shell
[root@bumo ~]# cd /usr/local/buchain/bin
[root@bumo bin]#./bumo --create-account

{
    "address" : "buQmtDED9nFcCfRkwAF4TVhg6SL1FupDNhZY", //Address
    "private_key" : "privbsZozNs3q9aixZWEUzL9ft8AYph5DixN1sQccYvLs2zPsPhPK1Pt", //Private key
    "private_key_aes" : "e174929ecec818c0861aeb168ebb800f6317dae1d439ec85ac0ce4ccdb88487487c3b74a316ee777a3a7a77e5b12efd724cd789b3b57b063b5db0215fc8f3e89", //AES encrypted private key
    "public_key" : "b00108d329d5ff69a70177a60bf1b68972576b35a22d99d0b9a61541ab568521db5ee817fea6", //Public key
    "public_key_raw" : "08d329d5ff69a70177a60bf1b68972576b35a22d99d0b9a61541ab568521db5e", //Original public key
    "sign_type" : "ed25519" //Eed25519 encrypted
}
```



2. If there is already a public-private key pair, the private key can be encrypted by the following command (If the address is *buQmtDED9nFcCfRkwAF4TVhg6SL1FupDNhZY*, and the private key is *privbsZozNs3q9aixZWEUzL9ft8AYph5DixN1sQccYvLs2zPsPhPK1Pt*):

```shell
[root@bumo ~]# cd /usr/local/buchain/bin
[root@bumo bin]#./bumo --aes-crypto privbsZozNs3q9aixZWEUzL9ft8AYph5DixN1sQccYvLs2zPsPhPK1Pt

e174929ecec818c0861aeb168ebb800f6317dae1d439ec85ac0ce4ccdb88487487c3b74a316ee777a3a7a77e5b12efd724cd789b3b57b063b5db0215fc8f3e89

```

### Accounting Node Address

Enter the address of the accounting node when applying to become an accounting node (validation_address). Chart as follow：

<img src="/docs/assets/account_node_apply.png" style= "margin-left: 20px">



## Synchronizing System Time

To ensure that the node can run normally, it is necessary to ensure that the time of the node is consistent with that of other nodes on the public network. Therefore, it is necessary to periodically Synchronize the system time.



### Synchronize the Time Periodically

Enter the following command to Synchronize the system time every 10 seconds.

```shell 
echo "*/10 * * * * /usr/sbin/ntpdate  ntpdate  time.windows.com"  >> /var/spool/cron/root
```

### Ensure that the change takes effect

To ensure that the changes take effect, enter the following command to restart the crond service.

```shell
systemctl restart crond
```



## Service Commands

The main commands introduced here, includes：[Starting the BUMO Service](#starting-the-bumo-service)、[Stopping the BUMO Service](#stopping-the-bumo-service)、[Querying the BUMO Service Status](#querying-the-bumo-service-status)、[Clearing Database](#clearing-database)。



### Starting the BUMO Service

Input the following command to start the bumo service.

```shell
service bumo start
```



### Stopping the BUMO Service

Input the following command to stop the bumo service.

```shell 
service bumo stop
```



### Querying the BUMO Service Status

Input the following command to query the bumo service.

```shell 
service bumo status
```



### Clearing Database

You must stop the BUMO service before clearing the database. You must complete the following steps to clear the database:

1. Stopping the BUMO Service

   ```shell 
   service bumo stop
   ```

2. Input the following command to enter the bumo service directory.

   ```shell 
   cd /usr/local/buchain/bin
   ```


3. Input the following command to clear the database.

  ```shell 
  ./bumo --dropdb
  ```

4. Cleared successfully, the following message is displayed.

  ```json
  [root@bumo bin]# ./bumo --dropdb
  [2019-05-23 15:13:51.507 - INF] <7FFFA81B4380> main.cpp(137):Initialized daemon successfully
  [2019-05-23 15:13:51.508 - INF] <7FFFA81B4380> main.cpp(138):Loaded configure successfully
  [2019-05-23 15:13:51.508 - INF] <7FFFA81B4380> main.cpp(139):Initialized logger successfully
  [2019-05-23 15:13:51.508 - INF] <7FFFA81B4380> main.cpp(146):The path of the database is as follows: keyvalue(/Users/fengruiming/single/buchain/data/keyvalue.db),account(/Users/fengruiming/single/buchain/data/account.db),ledger(/Users/fengruiming/single/buchain/data/ledger.db)
  [2019-05-23 15:13:51.524 - INF] <7FFFA81B4380> storage.cpp(296):Drop db successful
  [2019-05-23 15:13:51.524 - INF] <7FFFA81B4380> main.cpp(153):Initialized database successfully
  [2019-05-23 15:13:51.524 - INF] <7FFFA81B4380> main.cpp(156):Droped database successfully
  ```



## Troubleshooting

### Whether the node is running normally after the deployment is complete

After the deployment is complete, check whether the block height increases normally. If the block height is greater than 1, it means that the node is running normally.

- Command

  Calling the following command（For example, the IP is 127.0.0.1 and the port is 36002.）：

  ```shell
  [root@bumo ~]# curl 127.0.0.1:16002/getLedger
  ```

- Result

  The results are as follows:

  ```json 
  {
    "error_code" : 0,
    "result" : {
      "header" : {
        "account_tree_hash" : "bf337b72bb5ab150f25a4e665259049cd94fa70966a1c0f56f79a44969980ccb",
        "close_time" : 1558595960522453,
        "consensus_value_hash" : "04c172793d72b14ce2da8c5a9f9b7366edf75bc3c81aaf9f3069e6af3af1c857",
        "fees_hash" : "916daa78d264b3e2d9cff8aac84c943a834f49a62b7354d4fa228dab65515313",
        "hash" : "7349292089a68b134c03aefceed8a3ce0bf69960a21a6ca41467a672d3e2c3ce",
        "previous_hash" : "5d86cc2bb4a97831c4f8bbb1bbb8a09289337c42c33fa64bc7c1aa352b17b2ba",
        "seq" : 3,
        "validators_hash" : "9ff25c4231deb81c44eec379fd2467156d2389c5d69edf308d38f7b5ac53705b",
        "version" : 1002
      }
    }
  }
  ```

  > **Note: **Here seq is the block height, it is 3, indicating that the node is running normally.



### The node is running normally, but the transaction commit always fails

Check to see if the node is synchronized. For nodes that are not synchronized, the sent transaction cannot be executed normally.

- Command

  View the current node status, the command is as follows: 

  ```shell
  [root@bumo ~]# curl 127.0.0.1:16002/getModulesStatus
  ```

  

- Result

  The partial results are shown below:

  ```shell
  ...
  "ledger_manager" : {
        "account_count" : 117,
        "chain_max_ledger_seq" : 3185646,
        "hash_type" : "sha256",
        "ledger_context" : {
           "completed_size" : 0,
           "running_size" : 0
        },
        "ledger_sequence" : 65017,
  },
  ...
  ```

  > **Note: The chain_max_ledger_seq indicates the latest block height of the current blockchain. The ledger_sequence indicates the block height of the current node. Since the ledger_sequence is smaller than the chain_max_ledger_seq, it indicates that the current block has not been synchronized yet, and the transaction sent through the node cannot be executed normally.

