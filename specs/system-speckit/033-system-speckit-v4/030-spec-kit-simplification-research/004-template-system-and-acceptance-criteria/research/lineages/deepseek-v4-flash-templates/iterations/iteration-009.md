# Iteration 009 — Fresh angles: --sharded, upgrade-level, and lying surfaces round one never touched (RQ8 extension)

- Angle: surfaces the round-one synthesis covered in one pass or not at all — the `--sharded` create.sh flag (never examined; the charter's create.sh quote named only --with-lazy-addons/--phase), upgrade-level.sh's doc set, level-specifications.md's resource-map rows, and the parity suite's list coverage.
- Verdict: ONE P1: `--sharded` is a phantom flag — advertised in help and the usage example, backed by a `templates/sharded/` directory that does not exist, producing warnings and EMPTY stub files into spec-sections/. Round one never touched it; the tree it originally rendered from is gone and nothing restored it. Everything else on this angle is clean: level-specifications.md:741 resource-map row is accurate (Manual/optional, any level), upgrade-level.sh is honest about its transition-only addendum inputs and never claims to manage the lazy/flag docs (so no goal/render gap for a bump — CQ-008 closed), and the parity suite's laziness covers the four numbered lists as the 010 summary claims (the phase/review/research list shapes remain unpinned — recorded as a ledger note, not a finding).
- Findings: 2 (1×P1, 1×P2). Tool calls: 7/12.

## Findings

### f-iter009-001 [P1] — `--sharded` is a phantom flag: help-advertised, zero backend
- THE CLAIM: create.sh:284 help — "`--sharded` Create sharded spec sections (Level 3 only)"; usage example :332; and the manifest/reference world implies the spec system supports sharded Level 3 sections.
- WHAT THE CODE DOES: create.sh:1722-1762 — the block sets `SHARDED_TEMPLATES_DIR="$TEMPLATES_BASE/sharded"` and copies 5 files. `templates/sharded/` does NOT exist (inventory of templates/: CONTRACT.md, EXTENSION-GUIDE.md, MIGRATION.md, README.md, addons, changelog, core, examples, packet-types, scratch, spec-kit-docs.json, stress-test — no sharded). Every branch falls to the warning path: "Sharded template not found: …/spec-index.md" then for each of 01-overview.md/02-requirements.md/03-architecture.md/04-testing.md: warning + `touch` an EMPTY file into spec-sections/ (:1753-1759). The manifest has no shard concept (grep shard in spec-kit-docs.json = 0), no reference doc mentions sharded sections (grep in references/ = 0), and the validator has no knowledge of spec-sections/.
- CONSEQUENCE: `create.sh --level 3 --sharded` produces a spec-sections/ directory of four zero-byte stubs and leaves spec.md at the standard template (the optional spec-index.md cp is skipped) — silently misleading for L3 operators, and the empty files are recorded in CREATED_FILES as "(empty - template not found)".
- SEVERITY: P1 (wrong-or-unused: a documented public flag whose backend is entirely gone; the only defensible reading is that the sharded surface was removed by this simplification program and the flag's removal missed).
- RECOMMENDATION: remove — delete the --sharded flag, help rows (:284, :332) and block (:1722-1762), OR restore templates/sharded/ + the reference docs it implies; the stub-touching fallback is the worst of both worlds.

### f-iter009-002 [P2] — the parity suite pins only the four numbered lazy lists; phase/review/research shapes are unpinned
- THE CLAIM: 010 verification — "the parity suite asserts the four numbered lazy lists equal" — and the manifest now has three MORE contract rows whose lazy lists differ (phase 7 docs, review/research 6 docs, spec-kit-docs.json:2170-2180, :2312-2322, :2430-2440).
- WHAT THE CODE DOES: template-version-parity.vitest.ts:72-77 pins levels 1/2/3/3+ only. No assertion protects the phase/review/research list contents, which are precisely the rows that changed most in this remediation (goal.md dropped at review/research, resource-map.md added) — a future edit that drifts them (or re-adds goal.md at review) has no test.
- SEVERITY: P2 (test-coverage gap on the newest deltas of the same class the parity suite was created to protect).
- RECOMMENDATION: fix — pin the phase (7) and review/research (6) contents in the suite (or assert the deltas: phase = numbered minus {debug-delegation, research/research.md}; review/research = phase minus {goal.md}).

## What worked
- The inventory-first proof: `ls templates/` (1 call) + the block read (1 call) turned "this flag looks dead" into a falsifiable claim with zero ambiguity — and the charter's angle-8 mandate ("which templates or surfaces could merge or drop without losing a validated capability") is answered literally: --sharded loses nothing because its templates already don't exist.

## Ruled out (this iteration)
- upgrade-level.sh fails to re-render goal.md on a bump: RULED OUT — goal's section gates are identical at 1/2/3/3+ (only binding differs, phase-only), so no stale shape results; the playbook's render-by-hand path covers opt-in docs (CQ-008 CLOSED).
- level-specifications.md:741 still describes resource-map as ladder-scoped: RULED OUT — "Any level, when reviewers need a scannable file ledger | Manual (optional)" matches the current contract; f-iter003-002's flat-model rewrite landed there too.
- templates/sharded/ exists but is untracked (worktree artifact risk): RULED OUT — the directory simply does not exist in the checked-in tree; no untracked/ignored shard dir found.
