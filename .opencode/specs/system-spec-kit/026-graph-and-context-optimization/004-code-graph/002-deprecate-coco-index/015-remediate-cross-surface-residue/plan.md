---
title: "Implementation Plan: Remove remaining post-014-deprecation coco/ccc/rerank residue across non-code-graph surfaces [template:level_2/plan.md]"
description: "Per-surface removal gated by grep + tsc + vitest: mirror canonical routing into GEMINI.md, strip the /memory:manage ccc subcommand, sync the advisor runtime graph, drop dead ignore/env/playbook refs, and remove the RM-8 harness's dead coco/rerank daemon-kill rules with test updates."
trigger_phrases:
  - "cross-surface residue plan"
  - "ccc cleanup plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/015-remediate-cross-surface-residue"
    last_updated_at: "2026-05-25T16:10:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored plan from verified per-surface findings"
    next_safe_action: "Validate and commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-cross-surface-residue-001"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Remove remaining post-014-deprecation coco/ccc/rerank residue across non-code-graph surfaces

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown configs/commands/docs + TypeScript (process harness + vitest) + JSON artifacts |
| **Framework** | OpenCode runtime configs, spec-kit command contracts, RM-8 process harness |
| **Storage** | N/A (advisor `database/skill-graph.json` is a gitignored runtime artifact) |
| **Testing** | per-target `rg`, `tsc -p scripts/tsconfig.json`, vitest (`process-memory-harness`, `process-sweep`) |

### Overview
Each of the 7 surfaces carries a discrete dead reference to a deleted CocoIndex/rerank artifact. Fix per surface, verify the live behavior is preserved (embedder sidecar allowlist stays; RM-8 kill-safety keeps its live-daemon rules + tests), and gate on grep + tsc + vitest.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each finding re-verified against current reality
- [x] Live-vs-dead distinction confirmed per surface (embedder allowlist live; daemons can't spawn)
- [x] Operator approval for the RM-8 daemon-kill removal

### Definition of Done
- [ ] All 7 per-target greps == 0
- [ ] tsc clean + both process-* vitests green
- [ ] `validate.sh --strict` clean; packet docs reconciled
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Cross-surface residue removal (post-refactor cleanup) — no architecture change.

### Key Components
- **Routing docs** (GEMINI.md): mirror the 4-runtime canonical HYBRID policy.
- **Command contract** (manage.md): scope back to the memory DB (drop cross-domain code-graph ccc route).
- **RM-8 harness** (process-memory-harness.ts): classify only daemons that can still spawn.

### Data Flow
Deleted artifact (cocoindex/rerank) → remove every surface that still names it → verify live daemons/behavior untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planning from the 013 deep-review (the non-code-graph residue findings) + a daemon-kill finding from this session.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.gemini/GEMINI.md` | routing doc (consumer) | mirror `.claude/CLAUDE.md` HYBRID | `rg -i cocoindex` == 0 |
| `/memory:manage` | command contract | remove ccc subcommand + CCC MODE | `rg -i ccc manage.md` == 0; sections gap-free |
| advisor `scripts/skill-graph.json` | tracked compiled graph | confirm clean (already recompiled) | `rg system-rerank` == 0 |
| advisor `database/skill-graph.json` | gitignored runtime copy | sync from `scripts/` | runtime copy 0 refs |
| `.gitignore`, `sidecar-env-allowlist.cjs`, `250-playbook` | ignore/env/doc | drop dead refs | per-target grep == 0 |
| `process-memory-harness.ts` (+ 2 vitests) | RM-8 classifier (producer) | remove dead coco/rerank rules | tsc + vitest green; live-daemon rules kept |

Required inventories (done this session):
- Per-surface: `rg -i 'cocoindex|ccc|rerank' <file>` before/after.
- Consumers of removed harness type `'ccc-daemon'`: `rg 'ccc-daemon|isCccProcess' scripts` → 0 after.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-verify 6 findings + classify sweep extras (keep cli-* pkill exception, fixtures, accurate prose)
- [x] Create Level-2 packet on main
- [x] Investigate nuanced surfaces (allowlist live? hook check? manage ccc route? harness rules?)

### Phase 2: Core Implementation
- [x] Clear fixes: GEMINI.md, .gitignore, sidecar-env-allowlist, skill-graph sync, 250-playbook
- [x] manage.md ccc removal + section renumber
- [x] RM-8 harness daemon-kill removal + vitest updates

### Phase 3: Verification
- [x] Per-target grep == 0; tsc clean; vitests green
- [ ] `validate.sh --strict`; reconcile packet docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep gate | Per-surface residue == 0 | `rg` |
| Type | scripts type-check after harness edit | `tsc -p scripts/tsconfig.json` |
| Unit | RM-8 classification still correct | `process-memory-harness` + `process-sweep` vitests |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 014/004/005 deletions (mcp-coco-index, system-rerank-sidecar) | Internal | Green | precondition met — daemons can't spawn |
| Operator approval (daemon-kill removal) | External | Green | granted |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a removed rule turns out live, or vitest regresses.
- **Procedure**: `git checkout -- <file>` per-surface (changes are isolated; one code+test pair, rest are doc/config removals).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Per-surface fixes) ──► Phase 3 (Verify: grep+tsc+vitest)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Fixes |
| Fixes | Setup | Verify |
| Verify | Fixes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | done |
| Core Implementation | Med | ~1h (manage.md + RM-8 harness/tests were the heavy parts) |
| Verification | Low | ~15 min |
| **Total** | | **~1.5h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration
- [x] RM-8 live-daemon rules + tests retained

### Rollback Procedure
1. `git checkout -- <file>` for any regressed surface.
2. Re-run the per-target grep + vitest to confirm baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (gitignored `database/skill-graph.json` regenerates)
<!-- /ANCHOR:enhanced-rollback -->
