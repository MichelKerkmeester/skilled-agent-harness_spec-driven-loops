---
title: "Implementation Plan: Command contract reconciliation"
description: "Audit every command-contract field against the shipped tree, correct the contract, schema, templates and references in place, and add a read-only doctor check that catches catalog and hub-metadata drift against command frontmatter."
trigger_phrases:
  - "command contract plan"
  - "contract reconciliation"
  - "catalog mirror check"
  - "command asset naming"
  - "doctor drift check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Command contract reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON contract and Draft-07 schema, Markdown templates and references, Node CommonJS for the new check |
| **Framework** | None; the check uses only `node:fs` and `node:path`, as its sibling diagnostics do |
| **Storage** | None; every input is a repository file |
| **Testing** | `generate-command-routers.cjs --check`, `jsonschema` against the contract, `validate_document.py` per document, `parent-skill-check.cjs`, and a scratch-copy negative-control suite for the new check |

### Overview

The contract is data, so the work is an audit before it is an edit: read every declared field against the tree it claims to describe, decide per divergence which side is wrong, then correct the contract where it lies and record the tree's exception where the tree is right. The one live consumer expands the contract's path templates with a hardcoded rule, so each family's path shape has to be chosen to land on a real filename under that existing rule rather than requiring the consumer to change. The new check is deliberately a guard and not a generator: it compares each copy against command frontmatter, never a copy against another copy.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single source with guarded copies. Command frontmatter is the source of a command's identity; the contract, the catalogs and the hub metadata are derived views that a person maintains by hand. Rather than generate the views, each is compared back to the source by a check that reports where they disagree.

### Key Components

- **`command-contract.json`**: one entry per router-shaped family, carrying topology, router paths, input and gate owner, execution targets, mode matrix, owned assets, presentation ownership, destructive policy and invocation aliases.
- **`command-contract.schema.json`**: the Draft-07 shape the contract validates against, and the place its field semantics are described.
- **`generate-command-routers.cjs`**: the live consumer. It expands each family's asset-path templates and compares them against the paths each router names in its own tables.
- **`command-catalog-mirror-check.cjs`**: the new read-only diagnostic. It reads the command tree, then checks each catalog and each hub's command metadata against it.

### Data Flow

`.opencode/commands/**/*.md` frontmatter is read once into a command list. The contract's path templates expand against the same list through the generator; the catalogs and hub metadata are compared against it directly by the new check. Nothing writes back.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `command-contract.json` | The declared behavioural truth downstream tools read | update | `generate-command-routers.cjs --check` reports `path-drift=0` |
| `command-contract.schema.json` | Validates the contract and documents its field semantics | update | `jsonschema.Draft7Validator` reports 0 errors |
| `generate-command-routers.cjs` | Expands contract path templates and gates router drift | unchanged | Path shapes chosen so its existing expansion rule resolves correctly |
| `sk-create-command` templates and references | Teach the asset shapes an author copies | update | `validate_document.py` reports 0 issues on all 21 documents |
| `sk-doc` hub manifest and router | Index the mode's resources | unchanged | `parent-skill-check.cjs` passes, including byte-for-byte leaf-manifest regeneration |
| `.opencode/commands/**` | The tree of record | not a consumer | Untouched apart from the one added script; concurrent agent owns it |
| Hub `command-metadata.json` files | Advisor routing records copied from frontmatter | not a consumer | Divergence reported by the new check, not repaired here |

Required inventories:
- Contract path templates: `grep -rn '_auto\.yaml\|_confirm\.yaml\|_presentation\.txt' .opencode/skills/sk-doc/sk-create-command/`.
- Contract consumers: `grep -rn 'command-contract\.json' .opencode --include='*.cjs' --include='*.md'`.
- Matrix axes: the six families crossed with the eight declared fields; each cell checked against disk.
- Algorithm invariant: every asset path the contract declares must, after the consumer's placeholder expansion, name a file that exists.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Contract shape and field semantics | `jsonschema` Draft-07 against the schema |
| Integration | Contract path templates against every router's own tables | `generate-command-routers.cjs --check` |
| Manual | The new check against five deliberate staleness shapes plus a restore | Scratch copy of the tree driven through `--root` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `generate-command-routers.cjs` | Internal | Green | Without it there is no live proof the contract's paths resolve |
| `python3` with `jsonschema` | External | Green | The contract could not be validated against its own schema |
| Concurrent agent editing `.opencode/commands/` | Internal | Yellow | Verification results move; the gate must be re-run after the tree settles |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the contract change makes a downstream consumer report drift it did not report before, or the new check reports a false positive on the tree as it stands.
- **Procedure**: `git checkout -- .opencode/skills/sk-doc/sk-create-command/` restores the mode; `rm .opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs` removes the new file. Nothing else was touched, and nothing was committed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit) ──────► Phase 2 (Contract + schema) ──┐
                                                      ├──► Phase 4 (Verify)
                        Phase 3 (Templates + check) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | None | Contract, Templates |
| Contract + schema | Audit | Verify |
| Templates + check | Audit | Verify |
| Verify | Contract, Templates | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | High | 2-3 hours |
| Core Implementation | Medium | 2-3 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — not applicable; every change is a tracked working-tree edit with no commit
- [x] Feature flag configured — not applicable; the new check is unregistered until someone wires it into a route
- [x] Monitoring alerts set — not applicable; the check is invoked on demand

### Rollback Procedure
1. Restore the mode: `git checkout -- .opencode/skills/sk-doc/sk-create-command/`.
2. Remove the added script: `rm .opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs`.
3. Re-run `generate-command-routers.cjs --check` and confirm it returns to the pre-change baseline.
4. Notify the operator, since the reported contract divergences would go back to being uncaught.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
