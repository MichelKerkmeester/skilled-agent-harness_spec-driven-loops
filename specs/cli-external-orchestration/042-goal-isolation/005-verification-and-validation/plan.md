---
title: "Verification Plan: Cross-Runtime Goal Isolation"
description: "Run independent integrated checks, reconcile evidence and metadata, and gate Pi goal-extension rollout."
trigger_phrases:
  - "goal isolation verification plan"
  - "pi goal rollout gate"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/005-verification-and-validation"
    last_updated_at: "2026-08-10T15:19:41Z"
    last_updated_by: "codex"
    recent_action: "Verification plan completed"
    next_safe_action: "Monitor session-isolated goals during normal Pi use"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Verification Plan: Cross-Runtime Goal Isolation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Automated** | Core, CLI, adapters, plugin, config, docs, packet validation |
| **Live** | Two Pi sessions with distinct canaries and transcript inspection |
| **Safety state** | Pi goal extension disabled until P0 gates pass |
| **Evidence** | Command output, exit status, file assertions, scoped diff |

### Overview

Start with the exact original negative control and the full automated matrix. Then run live Pi canaries only from a safe isolated state. Re-enable the extension only after all P0 gates and metadata reconciliation pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phases 2, 3, and 4 focused evidence is complete.
- [x] Exact test commands and baseline counts are recorded.
- [x] Live canary objectives contained only synthetic labels.

### Definition of Done

- [x] Original symptom is negative and all automated isolation matrix rows pass.
- [x] Live Pi A/B native commands resolved distinct scoped records; commands short-circuited before model turns, so no transcript bodies were created.
- [x] Regressions, config/docs, packet-scoped alignment, and recursive strict gates pass; the known repository-wide drift backlog is recorded separately.
- [x] Metadata and scoped diff are reconciled.
- [x] Pi is re-enabled and normal trusted-project discovery is verified.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Independent boundary-first verification with rollout as the final state transition.

### Key Components

- **Matrix harness**: every action across sessions, runtimes, workspaces, and state conditions.
- **Live canary harness**: Pi current-session management through raw prompt transcript.
- **Regression gate**: all focused and authoritative suites from final code state.
- **Reconciliation gate**: artifacts, docs, metadata, status, and diff agree.

### Data Flow

```text
final implementation -> automated isolation matrix -> live Pi canaries
                    -> full regressions/config/docs -> metadata/diff audit
                    -> re-enable or remain disabled with blocker
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Verification | Failure Owner |
|---------|--------------|---------------|
| Scoped core and CLI | Full lifecycle and filesystem matrix | Phase 2 |
| Runtime adapters/management | Fake and live identity canaries | Phase 3 |
| Legacy/docs/config | Migration, scans, registrations, playbooks | Phase 4 |
| `.pi/settings.json` | Disabled before gates; resolver enabled only after pass | Phase 5 rollout |
| Packet metadata | Recursive validation and state reconciliation | Phase 5 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Automated Matrix

- [x] Run lifecycle, namespace, missing-id, malformed, concurrency, legacy, resume, and fork rows.
- [x] Compare final counts with baseline and inspect failures before continuing.

### Phase 2: Live Runtime Validation

- [x] Start two isolated Pi sessions with different canaries.
- [x] Set through native commands and inspect distinct scoped files; input/turn injection remains covered by the real-adapter harness because command-only Pi runs create no model transcript.

### Phase 3: Full Gates and Reconciliation

- [x] Run all goal/plugin suites, config and documentation checks, the workspace wrapper plus scoped delta, and recursive strict validation.
- [x] Reconcile parent/child docs, tasks, summaries, and generated metadata.
- [x] Inspect scoped diff and remove task-created residue.

### Phase 4: Rollout Decision

- [x] Remove the Pi exclusion only after the goal-specific P0 pass, then reconfirm normal trusted-project discovery.
- [x] Record rollback: restore the Pi exclusion if native discovery or isolation regresses.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Layer | Required Evidence |
|-------|-------------------|
| Unit/CLI | Exit 0, counts, and action matrix receipts |
| Adapter | Identity and no-op/error assertions |
| Live | Session-specific canaries in raw Pi transcripts and scoped files |
| Configuration | JSON parse, registered path existence, Pi resolver state |
| Documentation | Stale-term/link/playbook scans |
| Packet | Recursive strict validation and metadata integrity |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Completed implementation phases | Required | Verification cannot certify a partial cutover. |
| Pi CLI and native session binding | Required for live acceptance | Keep goal extension disabled. |
| Authoritative workspace gate | Resolve before implementation closeout | Completion remains blocked without it. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any P0 gate fails after re-enable, a canary crosses sessions, or runtime identity becomes unavailable.
- **Procedure**: restore the Pi exclusion immediately, stop affected Pi sessions, disable other leaking adapters, preserve evidence and both state layouts, and return the failure to its owning phase.
<!-- /ANCHOR:rollback -->
