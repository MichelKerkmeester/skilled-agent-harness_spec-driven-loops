---
title: "Implementation Plan: Phase 7: links-scan-registry-rule"
description: "Wrap check-links.sh in a run_check(folder, level) adapter scoped to the system-spec-kit skill tree, register it as LINKS_VALID, and resolve rename-pattern.md's memory-name wikilinks before the rule can fail every packet's strict validation."
trigger_phrases:
  - "links scan registry rule plan"
  - "run check adapter technical approach"
  - "memory name allowlist strategy"
  - "registry coverage testing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: links-scan-registry-rule

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (rule adapter), JSON (registry), Markdown |
| **Framework** | None |
| **Testing** | `tests/validate-runs-every-registry-rule.vitest.ts`, `tests/test-validation-extended.sh` |

### Overview
`check-links.sh` already does the real work (`scan_wikilinks`). It just has no `run_check(folder, level)` entry point and no registry row. The plan adds a thin adapter function that ignores the `$folder` argument validate.sh passes (since wikilinks live in skill documentation, not in the spec-folder being validated) and instead scans the fixed target `.opencode/skills/system-spec-kit`, the skill this validator infrastructure is part of. The registry row is added only after `rename-pattern.md`'s four broken citations are resolved, so the new rule never lands in a state where it immediately fails every packet's strict validation.
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
Registry-rule adapter over an existing standalone tool, the same shape every other `rules/check-*.sh` file already follows: a `run_check(folder, level)` function that sets `RULE_NAME`, `RULE_STATUS`, `RULE_MESSAGE`, `RULE_DETAILS` and `RULE_REMEDIATION`, sourced by `validate.sh` through the registry. The one deliberate departure from the other 39 rules is that `LINKS_VALID`'s scan target is fixed, not derived from `$folder`, matching the precedent `check-markdown-links.cjs` already sets as a repo-wide (not per-folder) documentation guard wired into its own CI workflow.

### Key Components
- **`check-links.sh`'s `run_check()` adapter**: new function, added beside the existing `main()`/`scan_wikilinks()` so the standalone `bash check-links.sh <dir>` entry point keeps working unchanged
- **`validator-registry.json`'s `LINKS_VALID` row**: `script_path: rules/check-links.sh`, `severity: error`, `category: authored_template` (grouped with the other documentation-shape rules, since a broken wikilink is an authoring defect, not a runtime-generated-artifact one)
- **`rename-pattern.md`'s memory-name citations**: resolved by the allowlist convention (documented inline in the file itself) so the four `[[feedback_*]]` links keep their visual form

### Data Flow
`validate.sh` → registry lookup → `check-links.sh --registry-mode <folder> <level>` (or equivalent flag) → `run_check()` ignores `$folder`, scans `.opencode/skills/system-spec-kit` → `RULE_*` variables → validator output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `rules/check-links.sh` | Standalone `main()`/`scan_wikilinks()` scan, no registry entry point | update (add `run_check()` adapter) | `bash rules/check-links.sh .opencode/skills/system-spec-kit` still works standalone. `run_check` invoked the way `validate.sh` invokes every other rule |
| `lib/validator-registry.json` | 39 rows, no `LINKS_VALID` | update (add one row) | `python3` load and membership check |
| `references/workflows/rename-pattern.md` | Four `[[feedback_*]]` citations that resolve to no file | update | `bash rules/check-links.sh` re-run reports zero broken links |
| `tests/validate-runs-every-registry-rule.vitest.ts` | Generic loop over every registry row, already covers a new row automatically | not a consumer requiring a code change | re-run after the registry row lands. Confirmed to pass without modification since it derives its expectations from the registry file itself |
| `rules/README.md`, `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` | Both currently state `check-links.sh` is standalone-only | update | grep for "standalone" and "not registered" near the `check-links.sh` mention in both files |
| `mcp-obsidian`'s `notion-bases-relation-rollup.md` broken `[[Website Relaunch]]` links | Discovered during planning by running the scan with no argument | not a consumer of this change. Explicitly out of scope | scan target stays `.opencode/skills/system-spec-kit`, so this file is never in the rule's scan path |
| `specs/` documents' own 96 wikilink occurrences | Memory citations and template-example prose | not a consumer. Out of scope | scan target stays `.opencode/skills/system-spec-kit`, not `specs/` |

Required inventories:
- Same-class producers: `bash rules/check-links.sh .opencode/skills/system-spec-kit` before the fix, confirming the exact five-line, four-target broken-link set this phase must resolve.
- Consumers of changed symbols: `grep -rln "check-links.sh"` across the skill (found: `rules/README.md`, `feature-catalog/tooling-and-scripts/markdown-link-integrity-guard.md`, `spec-validation-rule-engine.md`) to find every doc describing its current standalone status.
- Matrix axes: none beyond the single fixed scan target. This rule takes no per-folder axis since its subject is the skill's documentation tree, not the folder validate.sh was pointed at.
- Algorithm invariant: `LINKS_VALID` reports `fail` if and only if `.opencode/skills/system-spec-kit`'s own wikilink scan reports a broken link. It never inspects the `$folder` argument's own content.
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
| Unit | Standalone `check-links.sh` invocation before and after, isolated-rule case for `LINKS_VALID` added to the extended suite | bash, `tests/test-validation-extended.sh` |
| Integration | `validate-runs-every-registry-rule.vitest.ts`, `validate.sh --strict` on this skill's own packets | vitest, bash |
| Manual | Re-run the scan with no argument to confirm the `mcp-obsidian` finding is unaffected and stays out of the rule's target | bash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `017-completion-gate-and-catalog-alignment`'s decision to keep the scan standalone | Internal | Green. This phase reverses that decision now that a fix exists for the reason it was made | Re-registering without fixing `rename-pattern.md` would repeat the same failure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `validate-runs-every-registry-rule.vitest.ts` fails, or `validate.sh --strict` starts failing on a packet under `specs/system-speckit/` that was passing before this change
- **Procedure**: `git revert` the single commit. The registry row and the `run_check()` adapter are removed together, restoring the standalone-only state
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Re-run the scan, confirm the five-line broken-link set and the consumer docs |
| Core Implementation | Low | `run_check()` adapter, registry row, `rename-pattern.md` fix |
| Verification | Low | Registry-coverage test, extended suite, strict validation on this skill's own packets |
| **Total** | | One small rule adapter, one registry row, one document fix |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed. Tracked in git history
- [x] Feature flag configured - none. The row is added directly to the registry
- [x] Monitoring alerts set - the registry-coverage test is the alert

### Rollback Procedure
1. `git revert` the commit that added the registry row and the adapter
2. Rerun `validate-runs-every-registry-rule.vitest.ts` to confirm `LINKS_VALID` no longer appears
3. Confirm `bash rules/check-links.sh <dir>` still works standalone

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
