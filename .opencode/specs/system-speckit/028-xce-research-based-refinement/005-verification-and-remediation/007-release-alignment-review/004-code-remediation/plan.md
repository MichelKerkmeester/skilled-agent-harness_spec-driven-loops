---
title: "Implementation Plan: Code vs sk-code Remediation (Track B)"
description: "Executor design, slicing, and verification gates for the Track B code remediation: fix confirmed sk-code misalignments only via file-disjoint general+sk-code fixer seats."
trigger_phrases:
  - "code remediation plan"
  - "track B code remediation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/004-code-remediation"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author code remediation plan"
    next_safe_action: "Dispatch fixer seats and verify"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: Code vs sk-code Remediation (Track B)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Source review** | `../002-code-vs-sk-code-opencode/review/findings-all.json` (154: 66 P0 / 47 P1 / 41 P2) + `../synthesis.md` |
| **Executor** | `cli-opencode` → `openai/gpt-5.5-fast` `--variant high`, dispatched as a general code-implementation agent (role + `sk-code` load in the prompt body) |
| **Surface** | OpenCode (sk-code skill standards) |

### Overview
Fix the CONFIRMED sk-code misalignments only. The raw 66 P0s are ~3x inflated by false positives — fixing them blindly would strip valid comments and waste churn. Confirmed work groups into themes C1–C4, dispatched to file-disjoint fixer seats and verified baseline-and-delta.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed-finding briefs filtered from findings-all.json (C1–C4; refuted clusters dropped)
- [x] Pre-merge baseline captured (tsc + hygiene gate + affected tests)
- [x] Worktree-B created with clean baseline
- [x] Binding DO-NOT-FIX list documented

### Definition of Done
- [x] `tsc` clean (spec-kit, advisor, code-graph)
- [x] `check-comment-hygiene` 0 violations
- [x] Shell strict-mode present + `bash -n` clean; node/py syntax clean
- [x] Changed set ⊆ allowed paths; scoped commit; dist rebuilt


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
File-disjoint fixer fleet — only seats that own confirmed findings get a fixer; orchestrator verifies and merges.

### Confirmed Themes

| # | Theme | Fix | Verified basis |
|---|-------|-----|----------------|
| C1 | Ephemeral ids in code comments (comment-hygiene HARD BLOCK) | Drop the perishable label, KEEP the durable WHY (`// FIX RC3-B: …` → `// …`; `// P4-12/P4-19: …` → `// …`; `# …packets 006-009 … SC-002` → plain-language) | comment-hygiene.md forbidden list; 3/3 spot-checks were real |
| C2 | Missing shell strict-mode | Add `set -euo pipefail` after shebang/header | sk-code `opencode/shell/quality_standards.md:51` |
| C3 | `any[]` in public DB type (`lib/storage/write-provenance.ts:25`) | Replace with the real row type (infer from usage; verify with tsc) | sk-code `code_quality_standards.md:92` "no any" |
| C4 | Real spec-path mentions in comments (audit, not example values) | file-watcher.ts:201, folder-discovery.ts:1069 — replace concrete `.opencode/specs/NNN-…` paths with durable WHY | comment-hygiene.md |

### DO NOT FIX (refuted / downgraded — editing corrupts correct code)
- `// Feature catalog: <name>` comments (~18-20 "P0s") — gate-allowed; leave them.
- TSDoc `@example` values like `specFolder: 'specs/001-demo'` — illustrative; leave them.
- `scripts/dist/**` "stale compiled" — gitignored build output; rebuild instead of editing.
- "non-boxed / dashed header" P0s — downgraded to P2 style; optional cosmetic only.
- P1 style nits (catch-param-not-`unknown`, missing-TSDoc-on-exported) — batch only behavior-neutral ones, defer the rest.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Build confirmed-finding briefs (filter findings-all.json to C1–C4; drop refuted clusters)
- [x] Capture pre-merge baseline (tsc + hygiene gate + affected tests)
- [x] Create worktree-B; verify clean baseline

### Phase 2: Core Implementation
- [x] Dispatch ~6-8 general code-fixer seats (pool 10, staggered 3s, `</dev/null`, `gtimeout 1200`, sk-code-loaded)
- [x] Group confirmed C1/C2/C3/C4 hits by directory cluster (handlers, lib/search, lib/storage+ops, shared+context-server, advisor scripts, code-graph, deep-loop scripts, bin+hooks+scripts)
- [x] Collect per-seat fixed/refuted tables; salvage empties

### Phase 3: Verification
- [x] Re-run whole gate: tsc 0 errors, hygiene 0 violations, `bash -n` + strict-mode, affected vitest vs baseline
- [x] Report delta vs baseline
- [x] Diff-review worktree-B; merge + scoped commit; rebuild dist; update implementation-summary


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Type safety across edited packages | `npm run typecheck` (tsc) |
| Lint | Comment-hygiene ephemeral-id gate | `check-comment-hygiene.sh` (Python checker) |
| Syntax | Shell / node / py edited files | `bash -n`, `node --check`, `py_compile` |
| Behavior | Most-edited search file regression | affected `vitest` (retrieval-rescue suite) |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| findings-all.json | Internal | Green | Cannot scope fixer briefs |
| sk-code skill | Internal | Green | Seats lack OpenCode standards |
| cli-opencode / gpt-5.5-fast | External | Green | No fixer executor |
| git worktree-B | Internal | Green | No isolation for disjoint seats |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A merged edit changes behavior, or tsc/hygiene gate regresses vs baseline.
- **Procedure**: Revert the scoped commit (`git revert 83f36b8050`); rebuild dist; re-run the gate to confirm clean baseline.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup + Baseline) ──> Phase 2 (Fixer Seats) ──> Phase 3 (Verify + Merge)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup + Baseline | None | Fixer Seats |
| Fixer Seats | Setup + Baseline | Verify + Merge |
| Verify + Merge | Fixer Seats | None |


<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + Baseline | Low | 30 minutes |
| Fixer Seats (19 dispatched) | Medium | 1-2 hours |
| Verify + Merge | Medium | 1 hour |
| **Total** | | **~3 hours** |


<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured (tsc + hygiene + affected tests on clean branch)
- [x] Worktree-B isolated (disjoint file scopes, never `--dangerously-skip-permissions`)
- [x] Diff-reviewed before merge

### Rollback Procedure
1. **Immediate**: `git revert 83f36b8050` (scoped commit)
2. **Rebuild**: `npm run build` to regenerate dist
3. **Verify**: re-run tsc + hygiene gate to confirm clean baseline restored
4. **Notify**: flag in the 027 epic handover if any regression surfaced

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — comment/type/strict-mode edits only

<!-- /ANCHOR:enhanced-rollback -->
