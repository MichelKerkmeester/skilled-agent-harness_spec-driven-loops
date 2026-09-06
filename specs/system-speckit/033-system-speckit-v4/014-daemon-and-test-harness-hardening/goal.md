---
title: "Goal: Daemon Lifecycle and Test-Harness Hardening"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/014-daemon-and-test-harness-hardening"
    last_updated_at: "2026-08-30T10:24:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive and bound the four phase children"
    next_safe_action: "Execute 001-production-db-isolation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-daemon-and-test-harness-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Daemon Lifecycle and Test-Harness Hardening

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the gap between a safety guard existing and that guard running, for four failure classes found leaking live processes on 2026-08-30.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Presence in source is not acceptance. Each phase reproduces its failure first, then proves the guard fires on that same reproduction. |
| D2 | Classification is out of scope. Packet 035 settled it and it is correct; this packet only attaches triggers to it. |
| D3 | Phase 001 lands first. It is the only phase whose failure mode destroys data. |
| D4 | No change may signal a process belonging to a live session. A false positive blocks closure outright. |
| D5 | Implementation dispatches through cli-devin with `--model deepseek-v4-flash-max --permission-mode dangerous`, named per dispatch and never inherited from the environment. Operator approved full auto-approve on 2026-08-30; do not re-ask. |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-production-db-isolation | `001-production-db-isolation/goal.md` |
| 002-orphan-daemon-reaping | `002-orphan-daemon-reaping/goal.md` |
| 003-test-hang-containment | `003-test-hang-containment/goal.md` |
| 004-live-follow-log-hygiene | `004-live-follow-log-hygiene/goal.md` |

**Precedence.** Decisions above outrank child detail; child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] No vitest entry point resolves the production database directory, from any working directory
- [x] An orphaned launcher terminates and releases its respawn lock with no operator action
- [x] A hung suite dies within its bound and names the handle retaining it
- [x] A held divergence emits one log entry, and the follower log cannot grow unbounded
- [x] Each phase has a recorded negative control: failure reproduced before, guard firing after
- [x] `validate.sh <packet> --strict --recursive` reports Errors: 0 across all five folders
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet scaffolded and authored | Done | 5 folders, `validate.sh --strict` RESULT: PASSED, Errors: 0 |
| 001-production-db-isolation | Done | guard reachable from all three entry points; drift check proven non-vacuous |
| 002-orphan-daemon-reaping | Done | orphan reaped and lock released; live-parent and connected-peer both refused |
| 003-test-hang-containment | Done | exit 124 at the bound; reporter names the handle |
| All completion criteria verified | Done | four phase negative controls recorded; `validate.sh --strict` Errors: 0 across all five folders |
| 004-live-follow-log-hygiene | Done | 4 entries -> 1 held; cap with one retained generation |

### Deviations and findings

| Item | Note |
|------|------|
| Predecessor 035 is Complete yet its failure mode still leaked | Its classification is correct but nothing invokes the sweep; `ops/README.md` records that no live apply command exists. This packet supplies the trigger, not new classification. |
| Phase 003 root cause is unproven | Three runs held ~96% CPU after reporting finished, which suggests a spin loop rather than an idle handle. Scoped to containment plus diagnosis rather than a named fix. |
| Compiled `generate-description.js` is older than its source | Observed 2026-08-30; routed around via the `.cjs` repair path rather than rebuilding while other sessions were live in the tree. Not fixed here. |
<!-- /ANCHOR:log -->
