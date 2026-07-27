---
title: "Implementation Summary: Dead Code and Broken Reference Removal"
description: "One of five approved findings applied. Two refuted as documented operator interfaces, one escalated as intended-but-unbuilt, one deferred to the phase that owns its file."
trigger_phrases:
  - "dead code removal summary"
  - "017 phase 003 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/003-dead-code-removal"
    last_updated_at: "2026-07-27T14:24:44Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Applied the ignore-rule fix; withheld four deletions"
    next_safe_action: "Begin phase 004 legacy and superseded removal"
    blockers: []
    key_files:
      - "approved-findings.md"
      - "refutations.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-003"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the Copilot hook wrappers be removed, or should Copilot handlers be built?"
    answered_questions:
      - "No caller is a fact about the call graph; delete it is a judgement about intent."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-dead-code-removal |
| **Completed** | 2026-07-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An example environment file that git had been silently hiding is visible again, and four proposed deletions were stopped before they ran.

| Finding | Result |
|---------|--------|
| `devin-04:F14` | APPLIED — added a negation after the `.env.*` pattern; `.env.example` is trackable while `.env` and `.env.local` stay ignored |
| `devin-01:F16` | REFUTED — `validate-remote-allowlist` is the documented operator entry point to the remote-push gate |
| `devin-01:F17` | REFUTED — `skill-ids` is documented in the script's own README as a CLI |
| `devin-04:F11` | ESCALATED — Copilot hook wrappers reference an unbuilt handler directory; a capability decision, not a cleanup |
| `devin-04:F6` | DEFERRED — the karabiner shortcut lives in a file phase 005 may remove |

Dead code was the category triage measured at 31% wrong, and it is the only category whose remediation cannot be undone. Four of five outcomes changed on re-verification.

### The pattern worth carrying forward

Three of the four withheld findings share one structure: the observation is correct and the prescribed action does not follow from it. "No caller" is a fact about the call graph. "Therefore delete" is a judgement about intent, and intent lives in documentation the call graph cannot see. Both refuted subcommands are reachable only by a human typing them, which is exactly what an operator CLI is.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One GPT-5.6-LUNA worker at xhigh effort. It was given a trap check: after adding the negation, confirm `.env` itself is still ignored, and return BLOCKED rather than over-correct. It returned BLOCKED — correctly, because the success criterion in its prompt was wrong. `git check-ignore -v` exits 0 whenever any rule matches, including a negation, so exit 0 does not mean ignored. The worker used `-q`, reached the right answer, and refused to claim success against a criterion it could not satisfy.

The change was then verified independently with `-q` exit status and `git status`, which is how the prompt defect was found rather than the worker's judgement being blamed for it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Track `.env.example` as well as un-ignoring it | The negation is inert otherwise, and an example file exists to be shared. All four values were confirmed placeholders before tracking |
| Refuse both subcommand deletions | Absence of a programmatic caller is expected for an operator CLI, not evidence of death |
| Escalate rather than decide the Copilot question | Copilot is documented across four surfaces but has no built handlers. Removing the wrappers is a capability decision |
| Defer the karabiner shortcut | Repairing a file the next phase may delete is wasted work and risks a conflicting edit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.env.example` no longer ignored | PASS, `check-ignore -q` exit 1 |
| `.env` and `.env.local` still ignored | PASS, exit 0 each |
| No real credentials in the tracked example | PASS, all four values are placeholders |
| Containment | PASS, only intended paths |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Copilot question is unresolved.** The wrappers are guarded, so they fail silently rather than loudly, and will keep doing so until someone decides whether Copilot is a supported runtime.
2. **The karabiner shortcut is still broken.** It is deferred, not fixed, and depends on phase 005's decision about the file.
3. **Four deletions did not happen.** If any is later shown to be genuinely dead, it can be revisited; the refutations record what would need to change to reverse each verdict.
<!-- /ANCHOR:limitations -->
