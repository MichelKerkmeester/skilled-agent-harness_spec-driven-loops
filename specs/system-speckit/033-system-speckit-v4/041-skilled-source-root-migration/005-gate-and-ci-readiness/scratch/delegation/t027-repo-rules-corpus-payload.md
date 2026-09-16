# Edits for unit t027-repo-rules-corpus

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/workflows/repo-rules-corpus.yml`

OLD:

~~~~text
  pull_request:
    branches: [main]
    paths:
      - 'REPO RULES.md'
      - 'repo-rules/**'
      - '.opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs'
~~~~

NEW:

~~~~text
  pull_request:
    branches: [main]
    paths:
      - 'REPO RULES.md'
      - 'repo-rules/**'
      - '.opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs'
      - '.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs'
~~~~
