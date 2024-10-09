# Lodgify QA Challenge

## Introduction

This project contains automated tests for the Lodgify application, designed to validate various functionalities through Cypress. These instructions will guide you on how to set up and run the tests.

## Prerequisites

Before you begin, ensure you have met the following requirements:

 - Node.js and npm

Cypress is a Node.js application, and using it to run tests requires Node.js and npm (Node Package Manager). Ensure you have Node.js and npm installed — npm is included with the Node.js installation.

- **Installing Node.js and npm**: Visit the [Node.js website](https://nodejs.org/) to download and install the latest stable version of Node.js. This project requires Node.js version 14 or higher.

To check if you have Node.js and npm installed, run the following commands in your terminal:

```
node -v  # Checks the installed version of Node.js
npm -v   # Checks the installed version of npm
```

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Cloning the Repository

Start by cloning the repository to your local machine:

```
git clone https://github.com/MirianaDrago/lodgify_QA_challenge.git
cd lodgify_QA_challenge
```

### Install dependencies

```
npm install
```

### Run Cypress in Chrome browser with mochawesome reporter

```
npx cypress run --browser chrome --reporter mochawesome
```
