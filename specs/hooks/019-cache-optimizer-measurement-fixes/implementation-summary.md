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
    recent_action: "Four items shipped, one reverted after measurement"
    next_safe_action: "None; packet closed"
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

Four items ship, each its own commit and each proved by a control that fails when the change is
reverted. A fifth was built, measured, and reverted.

| Item | Commit | Suite |
|------|--------|-------|
| W1 — an unreported cache signal is not a miss | `891e728d36` | 98 → 103 |
| W2 — an explicit zero cached-read rate is a price | `ca3e9b4885` | 103 → 104 |
| W3 — a model can declare it never reports cache usage | `0b6be71f09` | 104 → 106 |
| ~~W4 — lift a prefix only after it proves stable~~ | reverted in `99c1c42d7e` | — |
| W5 — remember a learned key rejection across restarts | `b2c2f98bcd` | 111 → 113 |

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

Its premise now looks weaker still. The extension already persists a churn counter, and across the
recorded history — 42 session and model rows, 412 requests — prefix churn is **zero everywhere**, at
a 94.7% hit rate. The gate was guarding against a failure this installation has never observed. That
is not proof it cannot happen, and only 3 of those 412 requests were priced, so the *cost* of churn
remains unmeasured even though its frequency does not.

**The pricing question is settled: zero means free, and the change stands.** The registry has no
"absent" state to confuse it with — every one of the 1,356 catalogued models carries a `cacheRead`
value, none missing and none negative. Unknown is expressed by omitting the whole cost block, and
the composer then fills it with `input: 0` as well
(`provider-composer.js:71`). The predicate's *unchanged* first line already rejects `input <= 0`, so
the two states were separable all along and the change only prices a real curated block. Pi's own
cost arithmetic multiplies the cached-read rate unconditionally with no unknown branch
(`pi-ai/dist/models.js:545`), and the catalog uses zero as a genuine price elsewhere — 648 models
pair a positive read rate with a zero write rate, which is exactly how OpenAI bills.

Of the 446 zero-rate models, 331 have a positive input rate, and those are overwhelmingly models
with no prompt caching at all, where the cached-token count is always zero and no fictitious saving
is arithmetically reachable. The residual risk is four models of 1,356 that declare a zero read rate
alongside a positive write rate; caching demonstrably exists there, so those look like an upstream
data gap rather than a wrong convention. Reverting would have restored a worse bug, in which every
non-caching priced model reports "unpriced".

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


