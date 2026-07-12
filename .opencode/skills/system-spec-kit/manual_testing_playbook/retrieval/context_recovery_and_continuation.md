---
title: "M-001 -- Context Recovery and Continuation"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-001`."
audited_post_018: true
phase_018_change: Re-centered the resume path on `/speckit:resume`, `handover.md`, `_memory.continuity`, and supporting spec docs instead of legacy CONTINUE_SESSION wording.
version: 3.6.0.19
---

# M-001 -- Context Recovery and Continuation

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-001`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-001`.
- Real user request: `` Please validate Context Recovery and Continuation against /speckit:resume specs/<target-spec> and tell me whether the expected signals are present: Resume-ready state summary and next steps via `/speckit:resume` and the canonical packet ladder. ``
- Prompt: `Validate context recovery with /speckit:resume specs/<target-spec> and confirm the resume ladder returns actionable next steps.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Resume-ready state summary and next steps via `/speckit:resume` and the canonical packet ladder
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: `/speckit:resume` is used as the primary recovery path; continuation context is actionable and specific.

---

## 3. TEST EXECUTION

### Prompt

`Validate context recovery with /speckit:resume specs/<target-spec> and confirm the resume ladder returns actionable next steps.`
### Commands

1. `/speckit:resume specs/<target-spec>` — primary recovery surface
  2. If the packet is thin, verify `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder: "specs/<target-spec>", includeContent: true })` is used as the helper recovery path
  3. If the packet is still thin, confirm the workflow consults `handover.md`, then `_memory.continuity`, then the supporting spec docs
  4. If summary is still thin, run anchored fallback: `memory_search({ query: "session state next steps summary blockers", specFolder: "specs/<target-spec>", anchors: ["state","next-steps","summary","blockers"], includeContent: true, limit: 5 })`
  5. If results are empty or low-confidence, fall back to `memory_list({ limit: 5, sortBy: "updated_at" })` to discover recent candidates
### Expected

Resume-ready state summary and next steps via `/speckit:resume` and the canonical packet ladder.
### Evidence

returned context + extracted next actions + recovery source identification (`handover.md` / `_memory.continuity` / memory_context / memory_search / user).
### Pass/Fail

`/speckit:resume` is used as the primary recovery path; continuation context is actionable and specific.
### Failure Triage

verify `memory_context` resume mode routes correctly; broaden anchors on fallback search; verify spec folder path; check the canonical packet ladder order.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval/unified_context_retrieval_memorycontext.md](../../feature_catalog/retrieval/unified_context_retrieval_memorycontext.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: M-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval/context_recovery_and_continuation.md`
