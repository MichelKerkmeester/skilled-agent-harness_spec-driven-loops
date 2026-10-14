---
title: "Implementation Summary"
description: "Untrusted clones can no longer run code through the global git hooks, the zero Commit-Id is refused and the sk-git catalog states the real enrollment rule."
trigger_phrases:
  - "follow up review fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/033-follow-up-review-fixes"
    last_updated_at: "2026-10-14T19:32:46Z"
    last_updated_by: "epic-review-orchestrator"
    recent_action: "Closed the P0 hook trust hole and both P2s"
    next_safe_action: "Operator reviews the pushed fixes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-033-follow-up-review-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-follow-up-review-fixes |
| **Completed** | 2026-10-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A repository you clone can no longer run its own code through the global git hooks. The untrusted source root now sits under `/dev/null`, a path no repository can create, so a planted `.skilled-untrusted` folder is simply never read.

### Phase 33: follow-up-review-fixes

All six trust blocks changed identically and stay byte-identical, and the pre-commit notice reads the new root. Two new cases plant a guard library and a Commit-Id allocator under `.skilled-untrusted` in an untrusted clone and confirm neither runs. `Commit-Id: 0000000` is now refused by the message template, the policy helper and pre-push, matching the allocator, and the sk-git catalog and the template's rule table say so.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/scripts/git-hooks/` six hooks, `lib/commit-id-policy.sh` and two tests | Modified | Untrusted root and zero-id refusal |
| `.skilled/skills/sk-git/assets/commit-message-template.md` | Modified | Zero-id pattern and rule row |
| `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` | Modified | Zero-id assertion |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md` | Modified | Enrollment wording |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three DeepSeek dispatches made the edits in parallel from literal briefs, and a fourth updated the template rule row the zero-id dispatch flagged as stale. Every hook suite ran before and after.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Root under /dev/null | It is never a directory on any POSIX system, so no repository can ship files there, and its basename keeps the existing probe output |
| Keep the trust model | Only the untrusted root was wrong, and the rest of the gate already behaved as documented |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| source-root-selection.test.sh | 60 passed, 0 failed, from 58 |
| commit-msg.test.sh | 45 passed, from 44 |
| pre-push, prepare-commit-msg, pre-commit suites | 50, 78 and 111 passed, 0 failed |
| message-contract.test.mjs | 38 passed, with the zero-id assertion added to an existing test |
| bash -n on the six hooks | Clean |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Already-cloned repositories.** A clone that planted `.skilled-untrusted` before this fix could already have run once. The fix stops it from now on and cannot undo a past run.
<!-- /ANCHOR:limitations -->

---


