---
title: "190 -- Session recovery via /speckit:resume"
description: "This scenario validates interrupted-session recovery via /speckit:resume for `190`."
audited_post_018: true
phase_018_change: Removed CONTINUE_SESSION from the active ladder and aligned the recovery order to `handover.md -> _memory.continuity -> spec docs`.
version: 4.0.0.0
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


- Objective: Verify `/speckit:resume` uses `handover.md` first, then `_memory.continuity`, then packet-first spec docs and bounded anchors, with the ripgrep recipes and the trigger-index lookup as the only free-text fallbacks. No memory tool is involved.
- Real user request: `` Please validate Session recovery via /speckit:resume against /speckit:resume specs/<target-spec> :auto and tell me whether the expected signals are present: `handover.md` is preferred when fresh; `_memory.continuity` supplies supporting state when needed; packet-first spec docs and bounded anchors are read directly when the packet is thin; the ripgrep recipes and the trigger-index lookup are the only free-text fallbacks; auto mode resolves a strong candidate with minimal prompting; confirm mode shows alternatives when ambiguity remains; the final response includes state and next-step guidance. ``
- Prompt: `Validate /speckit:resume auto recovery and confirm the resume ladder, candidate discovery, and final next-step guidance work.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `handover.md` is preferred when fresh; `_memory.continuity` supplies supporting state when needed; packet-first spec docs and bounded anchors are read directly when the packet is thin; the ripgrep recipes and the trigger-index lookup are the only free-text fallbacks; auto mode resolves a strong candidate with minimal prompting; confirm mode shows alternatives when ambiguity remains; the final response includes state and next-step guidance
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Recovery follows the documented chain and produces an actionable continuation summary; FAIL: primary recovery skips the canonical packet ladder, fallback routing is missing, ambiguity is mishandled, or the recovered state is not actionable

---

## 3. TEST EXECUTION

### Prompt

`Validate /speckit:resume auto recovery and confirm the resume ladder, candidate discovery, and final next-step guidance work.`

### Commands

1. Invoke `/speckit:resume specs/<target-spec> :auto` or the equivalent recovery workflow for a real interrupted session and verify the command first reads `handover.md` when fresh handover data is present
2. Confirm the workflow then consults `_memory.continuity` in `implementation-summary.md` and the supporting spec docs before it reaches helper fallback paths
3. If the packet is thin, verify the workflow reads the bounded anchors directly out of the packet documents (`<!-- ANCHOR:state -->`, `next-steps`, `summary`, `blockers`) rather than calling any retrieval service
4. If still thin, verify the free-text fallback is the ripgrep recipe from `references/retrieval/retrieval-conventions.md` §2.4, with the result ranked caller-side per §5
5. If no clear candidate exists, verify prompt-to-packet routing through `node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs "<prompt>"`
6. Invoke confirm mode or force an ambiguous case and confirm the workflow presents the detected session plus 2-3 alternatives
7. Verify the final recovery response includes actionable state and next steps, then routes appropriately to continued `/speckit:resume` work or to a direct read of the packet's `changelog/` and `implementation-summary.md` depending on user need

### Expected

`handover.md` is primary after fresh handover handling; `_memory.continuity` and supporting spec docs follow; helper fallback paths activate correctly; confirm mode shows alternatives when needed; final response contains actionable continuation state and next-step routing

### Evidence

Command transcript; the ripgrep invocations and the trigger-index lookup output when the fallback lanes fired; evidence of handover use if present; final recovery summary showing state, next steps, and routing recommendation

### Pass / Fail

- **Pass**: Recovery follows the documented chain and produces an actionable continuation summary
- **Fail**: primary recovery skips the canonical packet ladder, fallback routing is missing, ambiguity is mishandled, or the recovered state is not actionable

### Failure Triage

Verify `/speckit:resume` command routing against `.opencode/commands/speckit/resume.md`; confirm the anchor names the workflow reads match the packet templates; re-run the ripgrep recipe by hand to see whether the miss is the recipe or the corpus; check `data/trigger-index.json` is present and current when the trigger lane returns nothing

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [retrieval/session-recovery-spec-kit-resume.md](../../feature-catalog/retrieval/session-recovery-spec-kit-resume.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 190
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval/session-recovery-spec-kit-resume.md`
