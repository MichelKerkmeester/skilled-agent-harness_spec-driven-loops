```text example
shared/
+-- README.md                          # this index and the hub's zero-signal fallback
+-- references/
|   +-- stack-detection.md             # surface detection, the primary routing key
|   +-- phase-detection.md             # phase lifecycle and per-surface evidence
|   +-- workflow-implement.md          # implementation doctrine, symlinked into surfaces
|   +-- workflow-debug.md              # debugging doctrine, symlinked into surfaces
|   +-- workflow-verify.md             # verification doctrine, symlinked into surfaces
|   `-- universal/
|       +-- code-quality-standards.md  # severity model for the quality gate
|       +-- rule-overrides.md          # how a repository drops or replaces a rule
|       `-- rule-overrides.json        # the hard floor no override may name
`-- scripts/
    +-- check-rule-overrides.cjs       # linter for a checklist's Rule overrides section
    +-- lib/
    |   +-- repository-identity.cjs    # the repository a config is scoped to
    |   `-- rule-registry.cjs          # every rule id an override row may name, read from the declaring documents
    `-- tests/
        +-- check-rule-overrides.test.cjs  # node --test suite for the linter
        +-- repository-identity.test.cjs   # node --test suite for the identity helper
        +-- review-lens-overrides.test.cjs # review floor and lens ids against the contract
        `-- rule-registry.test.cjs         # the registry's derivation and no-silent-shrink cases
```
