VERDICT: FIX

- [P1] `.skilled/skills/sk-code/shared/README.md:47-52` | 8 | The STRUCTURE tree is the page's file index, but it omits `scripts/lib/repository-identity.cjs` and `scripts/tests/repository-identity.test.cjs`, both committed in `shared/scripts/` and used by `sk-code-quality/scripts/lib/quality-config-discovery.cjs` and `quality-config-schema.cjs`. Round 3's edit is not in the final tree: `guard-3.txt` reports `BLOCK-CHANGED .skilled/skills/sk-code/shared/README.md edited=1` then `restored`, because the edited block was never recorded in `scratch/approved-blocks.md`. `diff-3.patch` is byte-identical to `diff-2.patch`, so the file is still at HEAD and the index still lists 14 of the 16 committed files. | Replace lines 47-52 with this block, verbatim:

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

  Then record that whole fenced block, fences included, in `specs/sk-doc/066-skill-readability-refinement/006-sk-code/001-hub-and-shared/scratch/approved-blocks.md` beside `scope.txt`, or `code-blocks.py --restore` reverts it again. After the +2 lines, the inbound `shared/README.md:61` line reference shifts to 63 for the commit-time hand recheck.

Of the 16 findings, 13 are applied in the final tree, this one is applied but guard-reverted, and two are correctly left at HEAD: `phase-detection.md:39` and `workflow-debug.md:62` each rewrite a factual claim, which this pass forbids ("every claim must survive"), so they belong in a correctness pass. Everything else holds: all 11 scoped files report `valid=True issues=0`, the five LOST lines are reflows with every claim, path, error code and qualifier intact, the `phase-detection.md` intro keeps its factual first sentence and replaces only the contents pointer, no code block, block count, frontmatter value or citation changed, and every inbound heading and H2 number and order still holds.
