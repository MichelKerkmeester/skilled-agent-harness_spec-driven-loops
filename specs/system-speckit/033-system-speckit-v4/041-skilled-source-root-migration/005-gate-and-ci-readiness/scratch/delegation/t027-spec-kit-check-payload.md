# Edits for unit t027-spec-kit-check

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/workflows/spec-kit-check.yml`

OLD:

~~~~text
  push:
    branches: [main, 'skilled/**']
    paths:
      - '.opencode/skills/system-spec-kit/**'
      - '.github/workflows/spec-kit-check.yml'
      # The mirror-parity job compares generated mirrors against their sources.
      # Triggering on the spec-kit runtime alone let a mirror drift on a command
      # or agent commit, ship unseen, and fail here later on whoever next touched
      # the runtime. Every mirror source and every mirror output triggers it now.
      - '.opencode/commands/**'
      - '.opencode/agents/**'
      - '.opencode/skills/*/command-metadata.json'
      - '.codex/**'
      - '.claude/**'
      - '.cursor/**'
      - '.devin/**'
      - '.pi/**'
~~~~

NEW:

~~~~text
  push:
    branches: [main, 'skilled/**']
    paths:
      - '.opencode/skills/system-spec-kit/**'
      - '.skilled/skills/system-spec-kit/**'
      - '.github/workflows/spec-kit-check.yml'
      # The mirror-parity job compares generated mirrors against their sources.
      # Triggering on the spec-kit runtime alone let a mirror drift on a command
      # or agent commit, ship unseen, and fail here later on whoever next touched
      # the runtime. Every mirror source and every mirror output triggers it now.
      - '.opencode/commands/**'
      - '.skilled/commands/**'
      - '.opencode/agents/**'
      - '.skilled/agents/**'
      - '.opencode/skills/*/command-metadata.json'
      - '.skilled/skills/*/command-metadata.json'
      - '.codex/**'
      - '.claude/**'
      - '.cursor/**'
      - '.devin/**'
      - '.pi/**'
~~~~

## Edit 2

File: `.github/workflows/spec-kit-check.yml`

OLD:

~~~~text
  pull_request:
    branches: [main]
    paths:
      - '.opencode/skills/system-spec-kit/**'
      - '.github/workflows/spec-kit-check.yml'
      # The mirror-parity job compares generated mirrors against their sources.
      # Triggering on the spec-kit runtime alone let a mirror drift on a command
      # or agent commit, ship unseen, and fail here later on whoever next touched
      # the runtime. Every mirror source and every mirror output triggers it now.
      - '.opencode/commands/**'
      - '.opencode/agents/**'
      - '.opencode/skills/*/command-metadata.json'
      - '.codex/**'
      - '.claude/**'
      - '.cursor/**'
      - '.devin/**'
      - '.pi/**'
~~~~

NEW:

~~~~text
  pull_request:
    branches: [main]
    paths:
      - '.opencode/skills/system-spec-kit/**'
      - '.skilled/skills/system-spec-kit/**'
      - '.github/workflows/spec-kit-check.yml'
      # The mirror-parity job compares generated mirrors against their sources.
      # Triggering on the spec-kit runtime alone let a mirror drift on a command
      # or agent commit, ship unseen, and fail here later on whoever next touched
      # the runtime. Every mirror source and every mirror output triggers it now.
      - '.opencode/commands/**'
      - '.skilled/commands/**'
      - '.opencode/agents/**'
      - '.skilled/agents/**'
      - '.opencode/skills/*/command-metadata.json'
      - '.skilled/skills/*/command-metadata.json'
      - '.codex/**'
      - '.claude/**'
      - '.cursor/**'
      - '.devin/**'
      - '.pi/**'
~~~~
