# Files for unit t011

Create each file named below with exactly the content between its two fence lines, without the fence lines themselves.

## File 1

File: `.github/workflows/gate-inputs.yml`

CONTENT:

~~~~text
name: Gate Inputs
on:
  push:
    branches: [main, 'skilled/**']
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  gate-inputs:
    name: Every gate input resolves under both source roots
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Test the gate-input check against its fixtures
        run: bash .github/scripts/tests/check-gate-inputs.test.sh
      - name: Check the inputs of every hook, workflow and dependabot entry
        run: bash .github/scripts/check-gate-inputs.sh
~~~~
