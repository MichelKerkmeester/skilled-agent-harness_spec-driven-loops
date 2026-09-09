---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/019-cache-optimizer-measurement-fixes"
    last_updated_at: "2026-09-09T12:46:42Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped all five items, each with a negative control"
    next_safe_action: "None; all five items shipped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-hooks/019-cache-optimizer-measurement-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-cache-optimizer-measurement-fixes |
| **Completed** | 2026-09-09 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All five items, each its own commit, each proved by a control that fails when the change is reverted.

| Item | Commit | Suite |
|------|--------|-------|
| W1 — an unreported cache signal is not a miss | `20ece8e556` | 98 → 103 |
| W2 — an explicit zero cached-read rate is a price | `afba356590` | 103 → 104 |
| W3 — a model can declare it never reports cache usage | `29fa3b7825` | 104 → 106 |
| W4 — lift a prefix only after it proves stable | `43f3e075b4` | 106 → 111 |
| W5 — remember a learned key rejection across restarts | `a3e0d78f24` | 111 → 113 |

W1 avoided the trap the research identified: tokens and cost record unconditionally, and only
`hitRequests` and the measured denominator exclude an unreported sample. The naive version would
have dropped real spend out of Baseline and Savings.

W4 is the one visible behavior change: the first turn now lifts nothing, buying the guarantee that
a prefix was stable before it is moved.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each item was dispatched separately to `gpt-5.6-luna` at reasoning effort `max` on the `fast`
service tier, sandboxed to workspace-write and scoped to the extension directory. Gates ran at each
boundary rather than once at the end, and no item started before the previous one was committed.

Every result was re-verified here rather than accepted: the diff read, `run check` re-run, and a
control applied that neutralises the specific new behavior to confirm the new tests actually fail
without it.

Two dispatches were killed by host memory pressure before printing a closing report. Both had
already finished their work, which inspection confirmed rather than assumed — the suite was green,
the required state existed, and the controls failed correctly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Cost and the hit ratio are two counters on one path.** This is the whole of W1. Excluding an
unreported sample from cost as well as from the ratio would understate the savings figure the
extension exists to produce, which is a worse error than the ambiguity being removed.

**W3 is a companion to W1, not a substitute.** Presence answers per response; the declaration
answers per model, for the case where the host synthesises zeros before the extension sees anything.
Merging them would lose whichever case the survivor did not cover.

**Authorization is not churn.** W4 keeps its own state. The churn map is model-keyed, report-only
and records empty shipments, so reusing it as the authorization record would have been wrong in
three separate ways.

**W5 keeps injection default-on.** Persisting the learned rejection fixes the repeated 400 without
costing every well-behaved third-party route its cache key.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Suite | 98 → 113, all passing |
| `npm --prefix .pi/extensions/pi-cache-optimizer run check` | exit 0 after every item |
| Controls | W1 1 test, W2 1, W3 1, W4 7, W5 1 — each fails with its change neutralised, passes restored |
| Scope | Only `.pi/extensions/pi-cache-optimizer/` changed; nothing outside touched in any dispatch |
| Comment hygiene | No artifact ids or spec paths in any diff |
| Migration | A pre-change stats record loads with counters intact and new fields defaulted |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**Four items ship, not five.** The cross-turn stability change was reverted. Its evidence was void:
`before_agent_start` fires once per user prompt, not once per provider request, so the one-shot
processes used to test it never reached a second observation and lifted nothing. Its cost was also
understated — turn one unlifted and turn two lifted changes the head of the prompt once per session
and invalidates the cached conversation at that point, where the previous behavior lifted from turn
one and stayed stable. Re-landing it needs multi-prompt sessions, a warm-cache control, and the
shipped prompt bytes asserted to differ between arms.

**The pricing change still rests on an unanswered question.** It assumes an explicit zero cached-read
rate is an authoritative "free" and that absent means "unknown". If the registry writes zero to mean
unknown, that commit is wrong in kind and should be reverted rather than adjusted.

**The measurement change is narrower than it first appeared.** Pi's usage type requires the cache
fields, so the unmeasured branch is reachable through the raw fallbacks and the capability
declaration rather than through the normalized reader. That is why the declaration exists; it is not
a defect, but the earlier claim that classification "did not misfire" was empty rather than
reassuring.

**Nothing is proven against a live provider beyond the pricing, capability and migration paths.**
The quality comparison run earlier is inconclusive by construction, because neither arm lifted a
prefix, so it compared near-identical bytes.

<!-- /ANCHOR:limitations -->

---


