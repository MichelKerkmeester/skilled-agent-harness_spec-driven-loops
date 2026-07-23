---
title: "Implementation Plan: retire the /design:* alias namespace"
description: "Re-key the surface checker and three registries to /interface:*, strip the alias plumbing, delete commands/design/, and prove correctness with the surface checker plus its test suite."
trigger_phrases:
  - "retire design aliases plan"
  - "interface surface rekey"
  - "command dedup plan"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/003-interface-commands/002-retire-design-alias-namespace"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "review-remediation"
    recent_action: "Plan executed and shipped in commit 9a42aedae4; metadata reconciled to complete."
    next_safe_action: "None — packet complete and verified."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: retire the /design:* alias namespace

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), JSON registries |
| **Framework** | `node --test` (built-in test runner) |
| **Storage** | None (static command registries + wrapper/asset files) |
| **Testing** | `design-command-surface-check.test.mjs`, `interface-command-contract.test.mjs` |

### Overview

Re-key the command surface from `/design:*` to `/interface:*` across the checker and the three registries, delete the alias plumbing and the `commands/design/` tree, and update the two test files to the primary namespace. The `commands/interface/` wrappers and assets are already self-contained on `/interface:*` tokens, so the change is a JSON/checker re-keying — not an asset rewrite. Correctness is defined solely by the surface checker exiting 0 and the test suite staying green.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The frozen rename map (5 modes → `/interface:*` primaries), the on-disk `commands/interface/` surface, and the checker/registry structure are all confirmed (done in this spec).

### Definition of Done

- `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` exits 0 (drift=0).
- `node --test design-command-surface-check.test.mjs interface-command-contract.test.mjs` is green (15 tests).
- No `/design:` command token in the checker or the three registries; `.opencode/commands/design/` deleted; `commands/interface/` intact.
- `validate.sh --strict` on this phase = 0 errors.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Deterministic namespace re-key plus dead-code removal. The `/design:*` layer was an additive compatibility skin over an already-canonical `/interface:*` surface; retiring it is a subtractive change (remove alias fields, reconciliation, wrappers, assets) plus a one-to-one token re-key.

### Key Components

- **`design-command-surface-check.mjs`** (the authority): `REQUIRED_FIELDS`, `COMMANDS`, `CANONICAL_COMMAND_BY_MODE`, `readWrapperRoster`, the metadata summary, `collectRosterReconciliationDrift`, `projectRecordsToCanonical`, `validateMetadata`, `validateTaskProjections`, `commandSetForModes`, and `formatTextReport`.
- **`command-metadata.json`**: five records — re-key `command`, delete alias fields, rewrite order-sensitive cross-reference tokens.
- **`hub-router.json`**: delete the `commandSurface.compatibilityAliases` block; keep `canonicalNamespace` + `canonicalByMode`.
- **`mode-registry.json`**: re-key each mode `command`; delete `compatibilityAliases`; the transport mode stays `command:null`.
- **`commands/design/`**: deleted. **`commands/interface/`**: preserved unchanged.

### Data Flow

The checker reads the registries + wrapper roster, projects records to their canonical command, and asserts the surface has no drift. After the re-key, records are already primary (projection is identity), the roster read targets `interface` only, and the alias-reconciliation branch is gone — so the drift set collapses to the `/interface:*` surface that the interface wrappers/assets already describe.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm the green baseline (checker exit 0; current test suite pass) before any edit, so the delta is attributable.
- [ ] Re-key the three registries: `command-metadata.json` (`command` per rename map, delete alias fields, rewrite cross-reference tokens preserving array order), `hub-router.json` (delete `compatibilityAliases`), `mode-registry.json` (re-key `command`, delete `compatibilityAliases`, transport stays null).

### Phase 2: Core Implementation

- [ ] Re-key the checker: `REQUIRED_FIELDS` (drop the two alias fields), `COMMANDS` (five `/interface:*` tokens), `CANONICAL_COMMAND_BY_MODE`→`COMMAND_BY_MODE`, `readWrapperRoster` (`["interface"]`), remove the `compatibilityAliasCount` summary and the canonical projection, and simplify `collectRosterReconciliationDrift` / `validateMetadata` / `validateTaskProjections` / `commandSetForModes` / `formatTextReport` to the primary namespace.
- [ ] Delete the `.opencode/commands/design/` tree (5 wrappers + 15 assets).
- [ ] Update the two test files to the `/interface:*` sibling set + mutation fixtures; remove the "legacy thin aliases" test.
- [ ] Reconcile dangling `/design:*` alias prose in the ungated docs; leave historical changelogs untouched.

### Phase 3: Verification

- [ ] `node design-command-surface-check.mjs` exits 0 (drift=0).
- [ ] `node --test design-command-surface-check.test.mjs interface-command-contract.test.mjs` green (15).
- [ ] Grep confirms zero `/design:` command tokens in the checker + registries and `commands/design/` absent; `commands/interface/` intact.
- [ ] `validate.sh --strict` on this phase = 0 errors.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Surface drift = 0 against the re-keyed registries + interface roster | `design-command-surface-check.mjs` (exit code) |
| Unit | Registry records, sibling/pipeline/handoff sets, boundary scans | `node --test design-command-surface-check.test.mjs` |
| Unit | Canonical resolution + interface wrapper/asset presence | `node --test interface-command-contract.test.mjs` |
| Manual | `rg` for residual `/design:` tokens; directory presence checks | `rg`, `ls` |

The surface checker plus its two test files are the executable contract: the refactor is CORRECT iff the checker exits 0 AND the suite is green. All other evidence (grep, directory listing) is corroborating, not authoritative.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `commands/interface/` self-contained on `/interface:*` | Internal | Green | If interface assets referenced `/design:`, they would need rewriting — confirmed they do not |
| Node built-in test runner + Node's `node:test` on the worktree runtime | Internal | Green | Tests cannot run without it; already used by the current suite |
| `.opencode/skills/sk-design` registries readable/writable in the worktree | Internal | Green | Re-keying blocked without write access to the worktree skill tree |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The surface checker fails (drift ≠ 0), the test suite goes red, or a residual `/design:` token / crash is found after the edits.
- **Procedure**: Because the work is uncommitted in an isolated worktree and nothing is staged/pushed, revert by restoring the touched files and the deleted tree — `git restore --source=HEAD --staged --worktree .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs .opencode/skills/sk-design/shared/scripts/*.test.mjs .opencode/skills/sk-design/command-metadata.json .opencode/skills/sk-design/hub-router.json .opencode/skills/sk-design/mode-registry.json` and `git restore --source=HEAD .opencode/commands/design/` (the deletion is undone by restoring the tree from HEAD). Re-run the checker + tests to confirm the pre-change green baseline is back.
- **Blast radius**: Low and reversible. The default public surface was already `/interface:*`, no generation/data is published, and nothing is committed — a restore fully returns the prior state. Callers already invoke `/interface:*`; the `/design:*` aliases being removed have no runtime consumer beyond the compatibility skin itself.
<!-- /ANCHOR:rollback -->
