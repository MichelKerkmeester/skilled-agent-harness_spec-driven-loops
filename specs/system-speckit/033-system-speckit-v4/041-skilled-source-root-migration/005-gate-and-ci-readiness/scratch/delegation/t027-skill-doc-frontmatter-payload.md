# Edits for unit t027-skill-doc-frontmatter

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/workflows/skill-doc-frontmatter.yml`

OLD:

~~~~text
  pull_request:
    branches: [main]
    paths:
      # A single * does not cross a slash, so this once matched only top-level
      # skills and ignored every packet-owned doc — the bulk of the corpus.
      - '.opencode/skills/**/references/**'
      - '.opencode/skills/**/assets/**'
~~~~

NEW:

~~~~text
  pull_request:
    branches: [main]
    paths:
      # A single * does not cross a slash, so this once matched only top-level
      # skills and ignored every packet-owned doc — the bulk of the corpus.
      - '.opencode/skills/**/references/**'
      - '.skilled/skills/**/references/**'
      - '.opencode/skills/**/assets/**'
      - '.skilled/skills/**/assets/**'
~~~~
