Introduction
=============

Blockchain is an important concept of Bitcoin, which is essentially a decentralized database. 
As the underlying technology of Bitcoin, blockchain is a string of data blocks generated using cryptographic methods.

BUMO is a next-generation commercial-grade public Blockchain for ubiquitous and trusted value transfer, which is aimed to build a decentralized application ecosystem featured with extensive digital trust, free-flowing value and public-sharing apps. 
BUMO is a new generation of public chain for business. It builds an internet infrastructure that can move value around through core technologies like BU Firework, BU Orbits, BU Canal and BU CodeMach.
With the value representation and value transfer function of the blockchain, we take tokens for encouragement and governance, mobilizing all users and partners to build a shared, win-win and autonomous industrial ecosystem.



BuVM
------

The smart contract is a necessary feature for a mature blockchain technology system and one of the main reasons why blockchain can be called disruptive technology. 
The BUMO Smart Contract not only has the basic features of smart contracts such as Turing complete, fast deployment, flexible call, and reliable execution, but also provides an eco-friendly contract engine BuVM (BUMO Virtual Machine) which enables better performance, security, multi-language support, friendly development and application extensions, etc.


BuVM is an improved implementation based on Google V8 and WebAssembly to better meet the needs of being user-friendly by BUMO. 
Google V8 is an open source JavaScript engine developed by Google that translates JavaScript code directly into binary (machine code) for efficient execution on a physical machine. WebAssembly is a portable, load-efficient, platform-independent bytecode format that can be executed on platforms at a high speed. 
This is a brand-new WEB standard that is supported and developed by several companies including Google, Apple, Microsoft, and Mozilla. 
These two technologies can provide basic functional support for BuVM, but they cannot be directly applied to BUMO scenarios, mainly in terms of security for contract execution, interface permissions, contract interactions, exception handling, and grammar checking. 
BuVM has specifically optimized the functions, the main improvements of which are as follows:

1.Increase security check for contract execution.

2.Set interface permissions.

3.Increase interaction between contracts.

4.Enhance the exception handling mechanism.

5.Security check for syntax.

In addition, BuVM supports multiple languages such as JavaScript/C/C++/Python/Go, which runs across platforms, with rich and scalable underlying interfaces, and a separate sandbox environment to ensure that BUMO smart contracts are executed securely in isolated environments.

Ledger Structure
-----------------

The ledger structure is an important form of data storage in the blockchain. As application scenarios in blockchain become more and more complex, the requirements for the structure design of the ledger are getting higher and higher.
The ledger structure of BUMO is BU Bambook which mainly includes: multi-asset account structure, global block structure, atomic transaction structure, efficient data storage of ledger, and joint account with multi-signature.

An integrated transaction formed by multiple interrelated operations, either fully executed or not executed at all, is required for asset transactions in real world. In designing its transaction structure, BUMO adds sub-operation of arrays, which can put one or more sub-operations of assets into the same transaction to execute. 
Failure of any sub-operation will result in the failure of the whole transaction and trigger a rollback of the transaction that has been performed to avoid affecting the relevant accounts.

BUMO uses MPT (Merkle Patricia Trie) tree to store the ledger data. Combined with the advantages of the Trie tree and the Merkle tree, MPT tree can effectively reduce the depth of the ledger tree, increase the balance of the tree, improve the security and verifiability of the tree. 
The data structure of ledger based on the MTP tree allows BUMO to achieve high efficiency and low consumption in data comparison, data insertion, and data modification operations. 
For example, differences at the bit level in the entire blockchain ledger can be found simply by comparing the root hashes; the accurate data retrieval can be achieved through traversal from short branches.

In the account design, we take the operation threshold for multi-weight into consideration, which allows you to set operation weights for different accounts and set thresholds for executing operations. The account weight refers to the weight of the operation that the owner and the signer have for the account; 
the operation threshold refers to the threshold for operating the account. Only when the account reaches the weight threshold, the operation authority is available. 
With the above solution, a set of users can jointly control the account, precise operation can be achieved with operation threshold, and finally meet the needs of diversified user cooperation, refined operation modes, and rich business models.

BU Firework
------------

BUMO proposes the BU Firework, an two-layer multi-chain consensus algorithm, which generates a set of validation nodes for the main chain by voting according to the DPoS, and then generates blocks by the selected validation nodes through the improved BFT algorithm, thereby achieving higher transaction throughput, scalability and security.  

BUMO Firework meets the needs of multi-chain interoperability scenarios, but instead of simply creating multiple similar single chains, it is innovative to adopt a two-layer structure(mainchain-subchain). The first layer is the mainchain consensus: users select a validation node set for the mainchain by voting per the DPoS protocol, and then blocks are generated by the improved BFT algorithm. 
The validation nodes in the mainchain are full nodes and can participate in any sub-chain consensus validation. The second layer is the sub-chain consensus: the blocks on the sub-chain are generated periodically by Proposers, and the block header is submitted to the mainchain for validation consensus. 
The validation nodes on the subchain are a subset of the validation nodes on the mainchain. Based on the VRF (Verifiable Random Function) algorithm, the validation nodes are randomly generated and dynamically changed, and are highly resistant to attacks.


Incentive Mechanism and Fee Model
--------------------------------------


BUMO combines the incentives of DPoS and BFT, in which validation nodes need to continuously improve performance to gain more supporters to gain more revenue, and ordinary nodes can also gain revenue by supporting validation nodes. At the same time, BUMO introduces a full-node incentive scheme that enables any ordinary node to be a full-node to obtain block rewards and motivates nodes to participate in governing the blockchain and providing services.

The fee model and the incentive mechanism complement each other. In addition to increasing in revenue for block nodes, the transaction fee can also prevent users from spamming transactions and wasting blockchain resources. 
For traditional blockchain systems such as Bitcoin, transaction fees are charged according to the amount of transactions. Since the blockchain size, transaction load, and digital currency prices are constantly changing, this fee model cannot be adjusted according to actual conditions and lacks flexibility. The BUMO fee model introduces a fee-based election mechanism that allows the fee to vary depending on the real situation. 
Any validation node can propose a new fee proposal, which can be validated into a new fee standard after passing the validation vote. 
In addition, BUMO sets different fee standards according to the transaction content, which makes the transaction fees more refined. 

Orbits
-----------

BUMO proposes Orbits, A Two-layer Polymorphic Mainchain-Subchain Multi-chain System. As its name suggests, this system allows each business to run more efficiently on its own "track" without causing operational errors or even system crashes due to "track forking". 
Orbits does not simply split a chain into multiple chains but creates differentiated featured sub-chains for various services based on factors such as storage efficiency, throughput, and business differences, and relies on the main chain for higher-level consensus validation. 
It improves the blockchain processing performance and meets the diversity requirements of the businesses without compromising security.

Canal 
-----------

In the current blockchain world, the nodes of each blockchain validate their respective transactions of the chain, and establish their independent and vertical autonomous systems, making these blockchains gradually become "value islets", each of which is like a separate "local area network". 
It also makes assets exchange and communications between chains very difficult. Canal aims to establish a scalable and interoperable cross-chain system to realize the interconnection between blockchains, transform the “local area network” into “internet”, making it possible to freely move values, assets, and information between value islets” of the blockchain “. 

BUMO proposes Canal, a cross-chain system of mainchain-mainchain for value routing, which enables completely different blockchain systems to be interconnected through a channel similar to a “canal”, achieving the value routing by bridging the chains with the same or different architectures, and moving values freely between different blockchains. 
Canal aims to assume the "router" role of the blockchain and form the blockchain "Internet."
