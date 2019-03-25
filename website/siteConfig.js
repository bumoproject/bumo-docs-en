/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: '/img/docusaurus.svg',
    infoLink: 'https://www.bumo.io',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Documentation', // Title for your website.
  secTitle: 'Welcome to the BUMO Documentation Center, where we provide you with comprehensive documents, including API guides, development guides, user guides and more, all of which are to help you get started with BUMO quickly. Meanwhile, we are fully prepared to help you when you come across technical issues.',
  tagline: 'Public Blockchain for Ubiquitous Value Transfer',
  url: 'https://www.bumo.io', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'bumo-docs-en',
  organizationName: 'bumoproject',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'
  
  editUrl: 'https://github.com/bumoproject/bumo-docs-en/tree/develop/docs/',
  docsSideNavCollapsible: true,
  scrollToTop: true,
  
  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'introduction_to_bumo', label: 'Docs'},
    { href: "https://github.com/bumoproject/bumo", label: "GitHub", target: "_blank" },
    { href: "javascript:(0);", label: "中文", target: "_self" },
    { languages: true },
    { search: true }
  ],

  // If you have users set above, you add it here:
  // users,

  /* path to images for header/footer */
  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/bumo.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#00D175',
    secondaryColor: '#00D175',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()}`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'github',
  },
  algolia: {
    apiKey: 'd4c9fe4edd1bc00c3fab7c201e7330ee',
    indexName: 'bumo',
    algoliaOptions: {
      facetFilters: ['language:en', 'version:VERSION'],
    }
  },
  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,
  useEnglishUrl: false,
  
  // Open Graph and Twitter card images.
  ogImage: 'img/logo.png',
  twitterImage: 'img/logo.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/bumoproject/bumo',
};

module.exports = siteConfig;
