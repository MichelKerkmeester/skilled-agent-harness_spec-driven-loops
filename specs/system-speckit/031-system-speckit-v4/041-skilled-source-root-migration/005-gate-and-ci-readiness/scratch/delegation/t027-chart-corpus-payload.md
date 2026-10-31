# Edits for unit t027-chart-corpus

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/workflows/chart-corpus.yml`

OLD:

~~~~text
  push:
    branches: [main, 'skilled/**']
    paths:
      - '.opencode/skills/sk-design/sk-design-chart/**'
      - '.github/workflows/chart-corpus.yml'
~~~~

NEW:

~~~~text
  push:
    branches: [main, 'skilled/**']
    paths:
      - '.opencode/skills/sk-design/sk-design-chart/**'
      - '.skilled/skills/sk-design/sk-design-chart/**'
      - '.github/workflows/chart-corpus.yml'
~~~~

## Edit 2

File: `.github/workflows/chart-corpus.yml`

OLD:

~~~~text
  pull_request:
    paths:
      - '.opencode/skills/sk-design/sk-design-chart/**'
      - '.github/workflows/chart-corpus.yml'
~~~~

NEW:

~~~~text
  pull_request:
    paths:
      - '.opencode/skills/sk-design/sk-design-chart/**'
      - '.skilled/skills/sk-design/sk-design-chart/**'
      - '.github/workflows/chart-corpus.yml'
~~~~
