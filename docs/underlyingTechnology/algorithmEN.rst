Algorithm
==========

This document details the features of the hashing algorithm and its application in the blockchain, also we will introduce the structure of the Merkel Patricia Tree.


Features of Hashing Algorithm
------------------------------

A good hashing algorithm has the following features:

**Fast speed in hashing:** computing the hash value in limited time and with limited resources when the plaintext and hashing algorithm is given.

**Difficult to reverse:** the plaintexts cannot be reversely calculated by analyzing the rules of given hash values. 

**Sensitive to input values:** minor change can result in big difference in the hash value.

**Conflict avoidance:** it is impossible to find two different plaintexts with the same hash value.


Application in the Blockchain
-------------------------------


Here are some important parameters for each block:

**Prev_Hash:** the hash value of the previous block which is calculated by the previous block.

**Timestamp:** the block generation time.

**Tx_Hash:** the hash value derived from all the packaged transactions.  

Basically, every blockchain has the three attributes. Except Timestamp, the rest two both require a hash function. 

MD5 (Message-Digest Algorithm 5) and SHA (Secure Hashing Algorithm) are common hashing algorithms, and hash functions are often used in the blockchain, such as:

1.Calculation of addresses of nodes on the blockchain and calculation of public key and private key.

2.MerkelTrie is a tree structure that combines the Merkel Tree and the Prefix Tree.

Merkel Patricia Tree
---------------------

If you are familiar with data storage, you might have heard about Merkel Tree.
 
 
Merkel Tree has a feature:  Its root hash is only related to the collection of data in the tree, and we can quickly determine whether two data sets are the same according to this feature.  
For each key-value pair (K, V) in the data set, K determines the position of a piece of data in the tree, and V determines the hash value. 
So, the (K, V) data set together determines the root hash. When modifying, adding, or deleting data in a tree, you only need to recalculate the path where the changing node is located. 
Modifying any piece of data will inevitably cause the change of the root hash, which is the basic feature of Merkel Tree.

Prefix Tree is also called Dictionary Tree. In Prefix Tree, the key value of a node is the path of the node, so the Prefix Tree is a multi-fork tree structure for fast retrieval.
In Prefix Tree, the root node does not contain any character, and each child node except the root node contains one character. 
Combine all the characters starting from the root node to a certain node to get the key of that node. 
All sub-nodes of each node contain different characters.

If we combine Prefix Tree and Merkel Tree, we can speed up comparison, and optimize checking and searching for the tree.
In BuChain, we choose to use Merkel Patricia Tree, which combines all the advantages of the tree structures we have mentioned before.
