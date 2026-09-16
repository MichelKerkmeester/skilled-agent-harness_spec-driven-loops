# Edits for unit t027-runtime-no-spec-import

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/workflows/runtime-no-spec-import.yml`

OLD:

~~~~text
  push:
    branches: [main]
    paths:
      - '.github/workflows/runtime-no-spec-import.yml'
      - '.opencode/bin/**'
~~~~

NEW:

~~~~text
  push:
    branches: [main]
    paths:
      - '.github/workflows/runtime-no-spec-import.yml'
      - '.opencode/bin/**'
      - '.skilled/bin/**'
~~~~

## Edit 2

File: `.github/workflows/runtime-no-spec-import.yml`

OLD:

~~~~text
  pull_request:
    branches: [main]
    paths:
      - '.github/workflows/runtime-no-spec-import.yml'
      - '.opencode/bin/**'
~~~~

NEW:

~~~~text
  pull_request:
    branches: [main]
    paths:
      - '.github/workflows/runtime-no-spec-import.yml'
      - '.opencode/bin/**'
      - '.skilled/bin/**'
~~~~
