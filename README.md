# API Testing

API tests for Dashboard API using Mocha, and Supertest.

## Installation

Clone the repository into the folder of your choice. Use npm to install the necessary packages to run these tests.

```bash
npm i
```

## Usage

Run the test script defined in the package.json.

```bash
npm test
```

## Configuration Options
Multiple options are available that can be modified at runtime. These can be viewed in the ./helpers/config.js file. These values can be displayed at runtime by seting DEBUG_LEVEL=1 in the ./helpers/debugHelper.js file.
```
API_TIMEOUT=500 DASHBOARD_HOST_URL=https://dashboard.qa6.devspace.lsea4.livelyvideo.tv npm test
```

## Contributing
Pull requests are welcome. Please submit a PR to #qa-private when making any change to these tests. All tests must be functioning across all development environments before a PR will be approved.
