## Overview

Welcome to the BUMO Documentation Center, where we provide you with comprehensive documents, including API guides, development guides, user guides and more, all of which are to help you get started with BUMO quickly. Meanwhile, we are fully prepared to help you when you come across technical issues.



## Environment

You have to be on Node >= 8.x and Yarn >= 1.5.



## Installation

1. Downloading the zip package.

1. Unzipping the package.

1. Going to the `website` directory, and downloading the dependency libs, the commands as follow:
   ```shell
   cd  website
   npm install
   ```

1. Starting the project in `website` directory, the command as follow:
   ```shell
   cd  website
   npm start or yarn start
   ```

   The command of modifying the port number (such as port 8080) as follow:
   ```shell
   npm run start -- --port 8080 或 yarn run start --port 8080
   ```

1. To create a static build of your website, run the following script from the `website` directory:

   ```shell
   npm run build 或者　　yarn run build
   ```

   This will generate a `build` directory inside the `website` directory, containing a `bumo` directory.  Now replacing the `codetabs.js` in root directory to the `codetabs.js` in `js`directory of `bumo` directory.

   Thus,  the `bumo` directory contrains the the `.html` files from all of your docs and other pages included in `pages`.

