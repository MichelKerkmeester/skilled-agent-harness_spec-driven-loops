---
title: "Implementation Plan: Scouted Bugfix Batch 1"
description: "Verify-first batch fix over the top 5 of 40 scouted candidates: an 8-agent scout selected the targets, 5 parallel gpt-5.5-fast deep-dives confirmed/refuted each headline (the two pre-try lease-leak headlines REFUTED, each target's real lesser defect confirmed), and 5 disjoint-file implement agents fixed and tested the confirmed defects across 10 files. Three security hardenings (worktree-reaper eval, setup-cp-sandbox rm-rf, advisor IPC) and two MCP-server bug fixes (file-watcher close hang, scan lease heartbeat); every fix stack-verified."
trigger_phrases:
  - "scouted bugfix batch 1 plan"
  - "verify-first deep-dive fix workflow"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/001-scouted-bugfix-batch-1"
    last_updated_at: "2026-06-03T05:31:00Z"
    last_updated_by: "claude-opus"
    recent_action: "5 deep-dives done; 5 implement agents fixed 10 files; builds + targeted tests green"
    next_safe_action: "Generate metadata, validate --strict, reconcile completion"
    blockers: []
    key_files:
      - ".opencode/bin/worktree-reaper.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-1-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scouted Bugfix Batch 1

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Mixed: 2 Bash scripts + 3 TypeScript MCP-server files (system-spec-kit + system-skill-advisor) |
| **Executor** | 8-agent scout + `gpt-5.5-fast` parallel deep-dives (confirm/refute) + 5 disjoint-file implement-and-test agents |
| **Parallelism** | 5 deep-dives in parallel, then 5 implement agents on disjoint files (10 files, no overlap) |
| **Ground truth** | The real source code (deep-dive against actual throws/lease lifecycle); code-graph socket-server.ts DR-008 reference |

### Overview
A verify-first pipeline. SCOUT runs 8 agents to enumerate 40 candidate deep-research targets and selects the top 5. DEEP-DIVE runs 5 parallel gpt-5.5-fast passes that confirm or refute each headline against the real code — notably refuting the two "pre-try lease leak" headlines (all throws occur before lease acquisition; the one post-acquisition call swallows its errors) while still finding a real lesser defect in each target. IMPLEMENT runs 5 parallel agents on disjoint file sets, each fixing only the confirmed defect and proving it with stack-appropriate verification. The orchestrator then reviews every diff and confirms builds + tests before ship.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Top 5 targets selected from the 40-candidate scout
- [x] Each headline assigned a deep-dive owner (confirm/refute before any edit)
- [x] Disjoint file partition defined so the 5 implement agents never collide

### Definition of Done
- [x] 5 deep-dives done; two pre-try lease-leak headlines REFUTED with code evidence
- [x] 5 confirmed lesser defects fixed across 10 files (disjoint agents)
- [x] All fixes verified: shell `bash -n`/shellcheck/live-injection; TS typecheck/build/vitest
- [x] Both MCP builds exit 0; file-watcher 22/22, cooldown 9/9
- [ ] description.json + graph-metadata.json present; validate --strict 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out / fan-in with a verify gate. The same 5 targets flow through deep-dive (confirm/refute) and then implement (disjoint files), so no edit is made on an unverified headline and no two agents touch the same file.

### Key Components
- **SCOUT (8 agents)**: enumerate candidate defects → 40 candidates → top 5 selected.
- **DEEP-DIVE (5x gpt-5.5-fast)**: confirm/refute each headline against the real code; emit CONFIRMED / REFUTED + the real defect.
- **IMPLEMENT (5x disjoint agents)**: fix only the confirmed defect per target; prove with stack-appropriate verification.
- **REVIEW (orchestrator)**: read every diff, confirm builds + tests, then ship.
- **Reference impl**: code-graph `socket-server.ts` DR-008 hardening (source for the advisor IPC port).

### Data Flow
Codebase → SCOUT → 40 candidates → top 5 → DEEP-DIVE (confirm/refute) → 2 headlines REFUTED + 5 real defects → IMPLEMENT (disjoint files) → 5 fixes / 10 files → REVIEW (diffs + builds + tests) → ship.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `worktree-reaper.sh` | `eval "$@"` act() (command-injection via reaped path) | argv-array `"$@"` at 5 call sites; `rm -rf -- "$sd"` guard; `%q` DRY_RUN | `bash -n` + shellcheck clean; LIVE injection test (hostile `$sd`) injection dead; exit-status preserved |
| `setup-cp-sandbox.sh` (3 copies) | hardcoded author REPO_ROOT; unguarded `rm -rf` | derive REPO_ROOT from `BASH_SOURCE`; `validate_sandbox_dir()` rejects empty/non-abs/`..`/non-`/tmp` | `bash -n` + 11-input unit test + end-to-end (rejects `$HOME`, `/tmp/../etc`; default works) |
| `system-skill-advisor` `socket-server.ts` | missing the 4 DR-008 IPC hardening items | port canonicalizePath ancestor-realpath, allowedSocketRoots, isWithinAllowedSocketRoot, post-mkdir stat uid/group-writable | typecheck + build exit 0; faithful to code-graph reference |
| `system-spec-kit` `file-watcher.ts` | `close()` blocks on non-cancellable `withBusyRetry` backoff sleep | RetryWaker wake-coordination (sticky-after-wakeAll; clears backoff timer on early wake); re-enable suite in test:core | typecheck exit 0; file-watcher 22/22 incl new close-mid-retry-sleep test |
| `system-spec-kit` `memory-index.ts` | no lease heartbeat during multi-batch processBatches | `setInterval` heartbeat (expiry/3, min 10s, `.unref()`) started in try, cleared in finally | typecheck exit 0; cooldown 9/9 incl new heartbeat test |

Scout + deep-dive census:
- 8-agent scout enumerated 40 candidate deep-research targets; top 5 selected.
- 5 parallel deep-dives: the two "pre-try lease leak" headlines REFUTED (all throws precede lease acquisition; the one post-acquisition call swallows its errors); each target still had a real lesser defect.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scout + select (done)
- [x] 8-agent scout enumerated 40 candidate deep-research targets
- [x] Top 5 selected by risk

### Phase 2: Deep-dive — confirm/refute (done)
- [x] 5 parallel gpt-5.5-fast deep-dives against the real code
- [x] Two pre-try lease-leak headlines REFUTED; each target's real lesser defect confirmed

### Phase 3: Implement + verify (done)
- [x] 5 parallel disjoint-file implement agents fix the confirmed defects (10 files)
- [x] worktree-reaper: argv-array + `rm -rf --` + `%q`; `bash -n` + shellcheck + LIVE injection test
- [x] setup-cp-sandbox (3 copies): BASH_SOURCE REPO_ROOT + validate_sandbox_dir(); 11-input unit + end-to-end
- [x] advisor IPC: 4 DR-008 items ported; typecheck + build exit 0
- [x] file-watcher: RetryWaker; re-enabled in test:core; 22/22 incl close-mid-retry-sleep test
- [x] memory-index: scan lease heartbeat; cooldown 9/9 incl heartbeat test
- [x] Orchestrator reviewed every diff; both MCP builds exit 0

### Phase 4: Ship
- [ ] description.json + graph-metadata.json
- [ ] validate --strict → 0
- [ ] reconcile completion metadata
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Confirm/refute deep-dive | each headline vs the real code | gpt-5.5-fast parallel passes |
| Shell static + live | worktree-reaper, setup-cp-sandbox | `bash -n`, shellcheck, LIVE injection test, 11-input unit test, end-to-end |
| TS typecheck + build | all 3 MCP-server files | `tsc` typecheck, `npm run build` (both servers exit 0) |
| Targeted vitest | file-watcher + memory-index cooldown | file-watcher 22/22 (new close-mid-retry-sleep), cooldown 9/9 (new heartbeat) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- code-graph `socket-server.ts` DR-008 hardening is the reference for the advisor IPC port; the advisor change mirrors it.
- Deploy depends on the orchestrator recycling the mk-spec-memory daemon (#1/#2) + skill-advisor (#3) after commit; the 2 shell fixes need no deploy.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Targeted code change across 10 files; rollback is a clean revert of those files.

- **Revert**: restore the 10 edited files (2 shell, 1 advisor IPC, 2 system-spec-kit MCP files + their tests/package.json) to pre-fix state.
- **Re-enable note**: reverting file-watcher.ts also re-adds the `--exclude` in test:core (the suite re-disable goes with the revert).
- **Deploy**: a revert also requires re-recycling the affected daemons to drop the fixed behavior; the shell fixes need no deploy on revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Scout) ──► Phase 2 (Deep-dive) ──► Phase 3 (Implement) ──► Phase 4 (Ship)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scout | None | Deep-dive |
| Deep-dive | Scout (top 5) | Implement |
| Implement | Deep-dive (confirmed defects) | Ship |
| Ship | Implement (builds + tests green) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scout (8 agents → 40 candidates → top 5) | Med | ~1 hour |
| Deep-dive (5 parallel confirm/refute) | Med | ~1.5 hours |
| Implement + verify (5 disjoint agents, 10 files) | High | ~2.5 hours |
| Ship (review, metadata, validate, reconcile) | Low | ~0.5 hour |
| **Total** | | **~5.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration involved (code-behavior fixes only)
- [x] No feature flag required (defect fixes, not new behavior toggles)
- [x] Scope-locked to the 10 confirmed-defect files (no adjacent cleanup)

### Rollback Procedure
1. Restore the 10 edited files from version control.
2. Re-recycle the mk-spec-memory daemon (#1/#2) + skill-advisor (#3) to drop the fixed behavior; shell fixes need no deploy action.
3. The file-watcher revert re-disables the suite in test:core (the `--exclude` returns with the file).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — behavior fixes only; no persisted-data change.
<!-- /ANCHOR:enhanced-rollback -->
