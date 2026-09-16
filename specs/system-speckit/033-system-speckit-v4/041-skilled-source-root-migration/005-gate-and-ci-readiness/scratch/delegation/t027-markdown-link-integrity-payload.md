# Edits for unit t027-markdown-link-integrity

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/workflows/markdown-link-integrity.yml`

OLD:

~~~~text
  pull_request:
    branches: [main]
    paths:
      - '.opencode/skills/**'
      - '.opencode/commands/**'
      - '.opencode/agents/**'
      - '.claude/agents/**'
      - '.claude/commands/**'
      - '.codex/agents/**'
      - '.codex/commands/**'
~~~~

NEW:

~~~~text
  pull_request:
    branches: [main]
    paths:
      - '.opencode/skills/**'
      - '.skilled/skills/**'
      - '.opencode/commands/**'
      - '.skilled/commands/**'
      - '.opencode/agents/**'
      - '.skilled/agents/**'
      - '.claude/agents/**'
      - '.claude/commands/**'
      - '.codex/agents/**'
      - '.codex/commands/**'
~~~~
