---
title: "190 -- Session recovery via /speckit:resume"
description: "This scenario validates interrupted-session recovery via /speckit:resume for `190`."
audited_post_018: true
phase_018_change: Removed CONTINUE_SESSION from the active ladder and aligned the recovery order to `handover.md -> _memory.continuity -> spec docs`.
version: 2.0.2.0
id: retrieval-session-recovery-spec-kit-resume
expected_workflow_mode: system-spec-kit
expected_leaf_resources:
  - workflow_mode: system-spec-kit
    leaf_resource_id: references/retrieval/retrieval-conventions.md
---

# 190 -- Session recovery via /speckit:resume

## 1. OVERVIEW

This scenario validates interrupted-session recovery via `/speckit:resume` for `190`. It focuses on verifying that resume-mode recovery uses the documented fallback chain and produces an actionable continuation summary.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `/speckit:resume` detects the packet from the CLI argument, then the calling session's handoff note, then its `session_ref`, and that it reads `handover.md` at any age, then `_memory.continuity`, then packet-first spec docs and bounded anchors, with the ripgrep recipe as the only free-text fallback. No memory tool is involved.
- Real user request: `` Please validate Session recovery via /speckit:resume against /speckit:resume specs/<target-spec> :auto and tell me whether the expected signals are present: `handover.md` is read at any age when present; `_memory.continuity` supplies supporting state when needed; packet-first spec docs and bounded anchors are read directly when the packet is thin; the ripgrep recipe is the only free-text fallback; the command opens only a packet the operator named or the calling session's own handoff note or `session_ref` names; with no such source, auto mode prints the No Session result and confirm mode lists at most three packets labelled as not matched to this session and waits; the final response includes state and next-step guidance. ``
- Prompt: `Validate /speckit:resume auto recovery and confirm the resume ladder, session detection, and final next-step guidance work.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `handover.md` is read at any age when present; `_memory.continuity` supplies supporting state when needed; packet-first spec docs and bounded anchors are read directly when the packet is thin; the ripgrep recipe is the only free-text fallback; the command opens only a packet the operator named or the calling session's own handoff note or `session_ref` names; with no such source, auto mode prints the No Session result and confirm mode lists at most three packets labelled as not matched to this session and waits; the final response includes state and next-step guidance
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Recovery follows the documented chain and produces an actionable continuation summary; FAIL: primary recovery skips the canonical packet ladder, a packet is opened that neither the operator nor the calling session's records named, the no-session case is mishandled, or the recovered state is not actionable

---

## 3. TEST EXECUTION

### Prompt

`Validate /speckit:resume auto recovery and confirm the resume ladder, session detection, and final next-step guidance work.`

### Commands

1. Invoke `/speckit:resume specs/<target-spec> :auto` or the equivalent recovery workflow for a real interrupted session and verify the command first reads `handover.md` when the packet has one, at any age
2. Confirm the workflow then consults `_memory.continuity` in `implementation-summary.md` and the supporting spec docs before it reaches helper fallback paths
3. If the packet is thin, verify the workflow reads the bounded anchors directly out of the packet documents (`<!-- ANCHOR:state -->`, `next-steps`, `summary`, `blockers`) rather than calling any retrieval service
4. If still thin, verify the free-text fallback is the ripgrep recipe from `references/retrieval/retrieval-conventions.md` §2.4, with the result ranked caller-side per §5
5. Invoke `/speckit:resume :auto` with no spec folder, in a session that has no handoff note and no `session_ref`, and verify the command prints the No Session result, asks for a spec folder path and opens no packet
6. Invoke `/speckit:resume :confirm` with no spec folder in that same session and confirm the workflow lists at most three packets, labels each as not matched to this session and waits for the operator's choice without selecting one
7. Verify the final recovery response includes actionable state and next steps, then routes appropriately to continued `/speckit:resume` work or to a direct read of `implementation-summary.md`, plus its `changelog/` when an older packet still has one, depending on user need

### Expected

`handover.md` is read at any age when present. `_memory.continuity` and supporting spec docs follow. The ripgrep fallback runs only for a named gap. With no session-owned source, auto mode prints the No Session result and confirm mode shows the not-matched list. The final response contains actionable continuation state and next-step routing, including a direct read of `implementation-summary.md`, plus its `changelog/` when an older packet still has one

### Evidence

Command transcript; the ripgrep invocations when the fallback lane fired; evidence of handover use if present; the No Session result and the not-matched candidate list; final recovery summary showing state, next steps, and routing recommendation

### Pass / Fail

- **Pass**: Recovery follows the documented chain and produces an actionable continuation summary
- **Fail**: primary recovery skips the canonical packet ladder, a packet is opened that neither the operator nor the calling session's records named, the no-session case is mishandled, or the recovered state is not actionable

### Failure Triage

Verify `/speckit:resume` command routing against `.skilled/commands/speckit/resume.md`; confirm the anchor names the workflow reads match the packet templates; re-run the ripgrep recipe by hand to see whether the miss is the recipe or the corpus; when detection opens the wrong packet, check the calling session id against the notes under `.skilled/skills/.state/session-relaunch/handoffs/`

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [retrieval/session-recovery-spec-kit-resume.md](../../feature-catalog/retrieval/session-recovery-spec-kit-resume.md)

Provenance: manual only - /speckit:resume specs/<target-spec> :auto

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 190
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval/session-recovery-spec-kit-resume.md`
