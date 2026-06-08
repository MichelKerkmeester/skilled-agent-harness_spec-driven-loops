---
title: "Feature Specification: Deep-review remediation of the daemon-reliability and portability work"
description: "An 11-lineage multi-model deep review (gpt-5.5 x6 + opus x5) found one real P1 in the shipped reap fix plus convergent P2 hardening. Fix the verified, clearly-actionable items and document the judgment-call deferrals."
trigger_phrases:
  - "deep review remediation"
  - "stale reclaim mutex fix"
  - "reap respawn lock"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/140-deep-review-remediation"
    last_updated_at: "2026-06-08T11:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed F1/F1c/F2/F3 from the deep review; documented F4-F9 deferrals"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-140-deep-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep-review remediation of the daemon-reliability and portability work

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A multi-model deep review (6 gpt-5.5-fast xhigh lineages via the official cli-opencode fan-out plus 5 opus lineages) of the recent daemon-reliability, reap, and hook-portability work converged on one real P1 and a set of P2 hardening items. The P1: the reap-before-respawn fix's `O_EXCL` "spawn mutex" claim does not hold for the stale-owner-lease reclaim branch, so two concurrent fresh launchers racing a crashed-not-released owner could both reap and respawn.

### Purpose
Fix the verified, clearly-actionable findings and serialize the stale reclaim so the single-writer invariant holds even under the crashed-owner race, then sync the launcher fixes to the Barter mirror.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F1: serialize the stale-reclaim reap+spawn under the exclusive respawn lock; correct the overstated comment.
- F1c: refuse respawn when the orphan child outlives SIGKILL within the grace window.
- F2: rewrite the two `096 packet` comment-hygiene violations and extend the checker to catch reversed `NNN packet` ordering.
- F3: harden the live test's two `execSync` shell calls to `spawnSync` with args (no interpolation).
- Sync the launcher fixes to the Barter mirror (not the sk-code checker, kept as-is per the mirror convention).

### Out of Scope (documented deferrals)
- F1b / F4: true adoption (a fresh session bridging to the warm daemon instead of reaping) and a live test for fresh-reap while a secondary is connected - the larger ownership-transfer enhancement.
- F5: SIGKILL escalation on the model-server in the release path - best-effort sidecar cleanup, idle-bounded.
- F6: renaming `check-comment-hygiene.sh` to `.py` - works via shebang; 6+ references make the rename churn outweigh the cosmetic gain.
- F7: tracked `settings.local.json` shipping personal env/allowlist - an owner-policy settings.json/.local restructure.
- F8/F9: deeper PID-identity guard and the cross-runtime hook asymmetry - the latter is by design (devin uses skill-advisor, codex/claude use spec-kit).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | F1 respawn-lock serialization, F1c reap, F2 comment |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | F2 comment |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Modify | F2 reversed-ordering pattern |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Modify | F3 spawnSync hardening |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stale reclaim is serialized | A second fresh launcher racing a stale lease bails on the respawn lock instead of reaping; the single fresh-session path still reaps to one writer |
| REQ-002 | No respawn on unconfirmed kill | The reap returns not-allowed when the child outlives SIGKILL, so no replacement spawns onto a live writer |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Comment hygiene clean + checker catches reversed ordering | The two launcher comments pass the checker; a `NNN packet` comment now trips it |
| REQ-004 | Test helpers carry no shell interpolation | The live test uses `spawnSync` with args; the suite stays green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Durability suite and launcher-lease suite stay green with the serialization change.
- **SC-002**: The launcher fixes land in the Barter mirror with sk-code and sk-git preserved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Respawn lock not released | Future respawns blocked | Released after launchServer and in the finally; non-blocking acquire |
| Risk | lsof non-zero exit drops output | Test false-negative | spawnSync parses stdout regardless of exit status |
| Dependency | Existing respawn-lock + reap helpers | Serialization | Already present and used by the dead-socket path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The respawn lock is acquired only on the rare stale-reclaim branch.
- **NFR-P02**: It is released immediately after the spawn, not held for the launcher lifetime.

### Security
- **NFR-S01**: The test no longer interpolates paths into a shell.
- **NFR-S02**: No new external surface.

### Reliability
- **NFR-R01**: At most one fresh launcher reaps and respawns a stale orphan.
- **NFR-R02**: No replacement spawns while a SIGKILL'd child is unconfirmed dead.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable; lifecycle change.
- Maximum length: not applicable.
- Invalid format: a lease without childPid skips the reap.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: two fresh launchers racing a stale lease - one wins the respawn lock, the other reports lease-held.

### State Transitions
- Partial completion: a launcher that bails on the lock reconnects via the host.
- Session expiry: the winning launcher becomes the single owner and writer.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One launcher branch, one helper, two comments, one test |
| Risk | 15/25 | Lock lifecycle in a default-on path, verified by the live test |
| Research | 16/20 | 11-lineage multi-model review plus code-level round-2 verification |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None; the deferred items (F1b/F4-F9) are recorded with rationale.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
