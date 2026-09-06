---
title: "Implementation Summary: The Framework Document Describes The Gate That Exists"
description: "Two false claims corrected; the git rules were checked and were already true."
trigger_phrases:
  - "framework doc matches behaviour"
  - "agents md validation claims"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/005-framework-doc-matches-behaviour"
    last_updated_at: "2026-08-29T21:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Corrected the framework doc's validation claims to match the gate"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: The Framework Document Describes The Gate That Exists
# Implementation Summary: The Framework Document Describes The Gate That Exists

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-framework-doc-matches-behaviour |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two corrections to the document loaded on every turn.

It claimed strict mode promotes warnings to validation errors, so a
warnings-only packet exits 2 and never 1. Earlier phases of this packet changed
that; such a packet now exits 0. The sentence says so, and adds the distinction
that matters: strict selects which rules run, and a rule that should block
reports an error itself.

It also promised that a stale freshness result blocks completion for
non-grandfathered packets. No grandfather mechanism exists in the rule said to
honour it. The sentence now describes what the rule does: it decides its own
applicability, reports nothing when the flag is off, warns when stale, and
errors only under its enforce flag.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each claim was run rather than remembered. The exit code came from validating a
warnings-only packet; the freshness behaviour from running that rule with its
flag off; the missing grandfather from searching the rule for the word.

The git rules in the neighbouring section were checked on the same basis instead
of being assumed stale, and needed no change: the pre-push hook exists at the
configured hooks path and enforces the remote-push policy, and the commit and
merge hooks that drive live-sync are installed. Nothing in this work touched git
behaviour, so nothing there was removed.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Verify the git claims rather than edit them | The instruction assumed they were stale; they were not, and removing accurate guidance would have been the worse error |
| State what replaces the removed behaviour | "Warnings no longer block" invites the question of what does, so the sentence answers it |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Exit-code claim | PASS | Warnings-only packet under strict exits 0 |
| Freshness claim | PASS | Rule prints that it is skipped when the flag is off |
| Grandfather claim | PASS | The word matches nothing in the rule; the promise is removed |
| Git claims | PASS | Pre-push hook present at the configured path and enforcing; commit and merge hooks installed |
| No deleted rule named | PASS | No rule removed by this packet appears in the document |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only the claims this packet invalidated were audited.** The document makes
   many other statements about tooling that were not re-verified here.

<!-- /ANCHOR:limitations -->
