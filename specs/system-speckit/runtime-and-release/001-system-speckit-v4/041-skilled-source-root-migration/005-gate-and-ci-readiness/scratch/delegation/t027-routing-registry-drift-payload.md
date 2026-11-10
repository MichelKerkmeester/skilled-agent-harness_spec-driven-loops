# Edits for unit t027-routing-registry-drift

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/workflows/routing-registry-drift.yml`

OLD:

~~~~text
  push:
    # skilled/v* is included because release-line pushes land directly (no PR),
    # and both live skill-metadata regressions to date arrived exactly that way.
    branches: [main, 'skilled/v*']
    paths:
      - '.github/workflows/routing-registry-drift.yml'
      - '.opencode/skills/*/mode-registry.json'
      - '.opencode/skills/*/hub-router.json'
      - '.opencode/skills/system-skill-advisor/runtime/**'
      - '.opencode/commands/doctor/scripts/parent-skill-check.cjs'
      - '.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/**'
      - '.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/**'
      - '.opencode/skills/*/SKILL.md'
      - '.opencode/skills/**/SKILL.md'
      - '.opencode/skills/*/ROUTER.md'
      - '.opencode/skills/*/leaf-manifest.json'
      - '.opencode/skills/*/leaf-manifest.config.json'
      - '.opencode/skills/*/command-metadata.json'
      - '.opencode/skills/*/leaf-aliases.json'
      - '.opencode/skills/*/description.json'
      - '.opencode/skills/*/graph-metadata.json'
      - '.opencode/skills/sk-doc/sk-create-skill/scripts/**'
      - '.opencode/bin/compiled-route*'
      - '.opencode/bin/lib/compiled-route*'
      - 'specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/**'
      - 'specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/002-baseline-capture/baseline/**'
~~~~

NEW:

~~~~text
  push:
    # skilled/v* is included because release-line pushes land directly (no PR),
    # and both live skill-metadata regressions to date arrived exactly that way.
    branches: [main, 'skilled/v*']
    paths:
      - '.github/workflows/routing-registry-drift.yml'
      - '.opencode/skills/*/mode-registry.json'
      - '.skilled/skills/*/mode-registry.json'
      - '.opencode/skills/*/hub-router.json'
      - '.skilled/skills/*/hub-router.json'
      - '.opencode/skills/system-skill-advisor/runtime/**'
      - '.skilled/skills/system-skill-advisor/runtime/**'
      - '.opencode/commands/doctor/scripts/parent-skill-check.cjs'
      - '.skilled/commands/doctor/scripts/parent-skill-check.cjs'
      - '.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/**'
      - '.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/**'
      - '.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/**'
      - '.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/**'
      - '.opencode/skills/*/SKILL.md'
      - '.skilled/skills/*/SKILL.md'
      - '.opencode/skills/**/SKILL.md'
      - '.skilled/skills/**/SKILL.md'
      - '.opencode/skills/*/ROUTER.md'
      - '.skilled/skills/*/ROUTER.md'
      - '.opencode/skills/*/leaf-manifest.json'
      - '.skilled/skills/*/leaf-manifest.json'
      - '.opencode/skills/*/leaf-manifest.config.json'
      - '.skilled/skills/*/leaf-manifest.config.json'
      - '.opencode/skills/*/command-metadata.json'
      - '.skilled/skills/*/command-metadata.json'
      - '.opencode/skills/*/leaf-aliases.json'
      - '.skilled/skills/*/leaf-aliases.json'
      - '.opencode/skills/*/description.json'
      - '.skilled/skills/*/description.json'
      - '.opencode/skills/*/graph-metadata.json'
      - '.skilled/skills/*/graph-metadata.json'
      - '.opencode/skills/sk-doc/sk-create-skill/scripts/**'
      - '.skilled/skills/sk-doc/sk-create-skill/scripts/**'
      - '.opencode/bin/compiled-route*'
      - '.skilled/bin/compiled-route*'
      - '.opencode/bin/lib/compiled-route*'
      - '.skilled/bin/lib/compiled-route*'
      - 'specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/**'
      - 'specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/002-baseline-capture/baseline/**'
~~~~

## Edit 2

File: `.github/workflows/routing-registry-drift.yml`

OLD:

~~~~text
  pull_request:
    branches: [main]
    paths:
      - '.github/workflows/routing-registry-drift.yml'
      - '.opencode/skills/*/mode-registry.json'
      - '.opencode/skills/*/hub-router.json'
      - '.opencode/skills/system-skill-advisor/runtime/**'
      - '.opencode/commands/doctor/scripts/parent-skill-check.cjs'
      - '.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/**'
      - '.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/**'
      - '.opencode/skills/*/SKILL.md'
      - '.opencode/skills/**/SKILL.md'
      - '.opencode/skills/*/ROUTER.md'
      - '.opencode/skills/*/leaf-manifest.json'
      - '.opencode/skills/*/leaf-manifest.config.json'
      - '.opencode/skills/*/command-metadata.json'
      - '.opencode/skills/*/leaf-aliases.json'
      - '.opencode/skills/*/description.json'
      - '.opencode/skills/*/graph-metadata.json'
      - '.opencode/skills/sk-doc/sk-create-skill/scripts/**'
      - '.opencode/bin/compiled-route*'
      - '.opencode/bin/lib/compiled-route*'
      - 'specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/**'
      - 'specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/002-baseline-capture/baseline/**'
~~~~

NEW:

~~~~text
  pull_request:
    branches: [main]
    paths:
      - '.github/workflows/routing-registry-drift.yml'
      - '.opencode/skills/*/mode-registry.json'
      - '.skilled/skills/*/mode-registry.json'
      - '.opencode/skills/*/hub-router.json'
      - '.skilled/skills/*/hub-router.json'
      - '.opencode/skills/system-skill-advisor/runtime/**'
      - '.skilled/skills/system-skill-advisor/runtime/**'
      - '.opencode/commands/doctor/scripts/parent-skill-check.cjs'
      - '.skilled/commands/doctor/scripts/parent-skill-check.cjs'
      - '.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/**'
      - '.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/**'
      - '.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/**'
      - '.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/**'
      - '.opencode/skills/*/SKILL.md'
      - '.skilled/skills/*/SKILL.md'
      - '.opencode/skills/**/SKILL.md'
      - '.skilled/skills/**/SKILL.md'
      - '.opencode/skills/*/ROUTER.md'
      - '.skilled/skills/*/ROUTER.md'
      - '.opencode/skills/*/leaf-manifest.json'
      - '.skilled/skills/*/leaf-manifest.json'
      - '.opencode/skills/*/leaf-manifest.config.json'
      - '.skilled/skills/*/leaf-manifest.config.json'
      - '.opencode/skills/*/command-metadata.json'
      - '.skilled/skills/*/command-metadata.json'
      - '.opencode/skills/*/leaf-aliases.json'
      - '.skilled/skills/*/leaf-aliases.json'
      - '.opencode/skills/*/description.json'
      - '.skilled/skills/*/description.json'
      - '.opencode/skills/*/graph-metadata.json'
      - '.skilled/skills/*/graph-metadata.json'
      - '.opencode/skills/sk-doc/sk-create-skill/scripts/**'
      - '.skilled/skills/sk-doc/sk-create-skill/scripts/**'
      - '.opencode/bin/compiled-route*'
      - '.skilled/bin/compiled-route*'
      - '.opencode/bin/lib/compiled-route*'
      - '.skilled/bin/lib/compiled-route*'
      - 'specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/**'
      - 'specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/002-baseline-capture/baseline/**'
~~~~
