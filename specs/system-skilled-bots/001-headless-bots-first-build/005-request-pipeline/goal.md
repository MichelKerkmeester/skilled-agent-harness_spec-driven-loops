---
title: "Goal: Phase 5: request-pipeline"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/005-request-pipeline"
    last_updated_at: "2026-11-22T16:57:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-005-request-pipeline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: request-pipeline

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Let any producer write one run request, through `bots enqueue`, `bots answer` or the opt-in post-commit leg, and make each request end in exactly one run or in quarantine with a reason.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The idempotency key comes from the event source and its own event id, a caller-supplied key wins, and a body hash is never the key. |
| D2 | Enqueue writes a temp file and renames it into the watched `inbox/` folder. A claim renames it out before dispatch. Queue folders are siblings under one state-root directory (ADR-003). |
| D3 | Requests for a paused bot go to quarantine with reason `paused`, and requests refused with `awaiting-decision-hold` go to quarantine with reason `held-needs-you`. Neither is replayed (ADR-004). |
| D4 | `bots answer` records the answer on the item before it enqueues one `resume` request keyed by the item id. |
| D5 | The opt-in post-commit leg only enqueues, never fails a commit, never runs an agent and does nothing in an untrusted repository. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] Two `bots drain` processes started together against one request leave exactly one run record that joins that request, over 50 rounds of the race test
- [ ] `bots enqueue` run twice with the same source and event id but different prompts, and two `resume` enqueues for one needs-you item, each print `duplicate` on the second call and leave one run record after `bots drain`
- [ ] After `bots drain` over a malformed definition, a failing precheck, a disabled bot, a paused bot and a bot with an open needs-you item, `ls -A` of the watched folder prints nothing and the quarantine folder holds five requests, the last two with reasons `paused` and `held-needs-you`
- [ ] A commit in a trusted fixture repository with commit triggers on enqueues one request and exits 0, and the same commit in an untrusted clone enqueues nothing
- [ ] In a fixture repository with no remote and no `identity` in `bots/config.json`, `bots enqueue` exits non-zero and the state root holds no new file, and after `identity` is set the same enqueue writes one request
- [ ] `bots answer <item-id> "yes"` run twice on one open item leaves one `resume` request, and the item reads `answered` with that request id
- [ ] `rg -n 'launchctl|\.plist'` over the `request-*.ts` files and the post-commit hook prints nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | Criteria drawn from spec.md section 5 and acceptance-criteria.md |

### Deviations and findings

| Item | Note |
|------|------|
| Criteria merged | spec.md section 5 lists eight success criteria. The two dedupe criteria (SC-002, SC-005) are one criterion here, and the hold quarantine (SC-008) joins the quarantine criterion (SC-003), to stay within seven |
<!-- /ANCHOR:log -->
