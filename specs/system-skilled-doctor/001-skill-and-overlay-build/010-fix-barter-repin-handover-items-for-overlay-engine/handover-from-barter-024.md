---
title: "Handover to Skilled: three limits Barter met porting the frontend surface"
description: "A removed json-entry set operation leaves its value in the live file, a session's surface hint cannot join a route that scored only a generic hub surface, and a baseline capture run straight after a skill graph scan reads the state from before it."
trigger_phrases:
  - "removed set operation not reverted"
  - "surface hint cannot join a scored route"
  - "baseline capture after graph scan stale"
importance_tier: "important"
contextType: "implementation"
---
# Handover to Skilled: three limits Barter met porting the frontend surface

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use this handover when** a Skilled session works on the overlay engine's `json-entry` operations, the sk-code hub router's surface hint or the advisor's command routing baseline capture.

**Addressed to:** Skilled. It continues the list in `../023-repin-d0fc9d719b/handover.md`, whose six items are still open. Every file named below is vendored and held at upstream bytes in Barter unless an overlay is named.

**Status:** open. Nothing below has been started in Skilled.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

Barter ported upstream `sk-code-frontend` v1.2.0.0 into its own copy of the packet on 2026-11-16, at pin `d0fc9d719b`, and took upstream's plain-request routing with two changed values. Three limits showed.

**7. A `set` operation removed from an overlay source leaves its value in the live file (observed twice).**
- Barter's `json-entry` overlay on `runtime/scripts/routing-accuracy/command-routing-baseline.json` held `set ["rows","cmd-design-extract-plain-holdout-01","top"] = "sk-doc"`. A fresh capture matched upstream's value, `sk-code`, so the operation was removed from the source.
- `apply` printed `0 changed`. `status` printed `checked=134 ok=134 miss=0` and `RESULT: PASSED`. The live file still read `sk-doc`, and `tests/command-routing-slice.vitest.ts` failed on that row.
- The `set` branch of `overlay-engine.cjs` writes the operation's value and has no record of the value it replaced, so a removed operation has nothing to restore.
- Barter added `set` operations that state upstream's own value, for that row and later for `mns-d3-04`. The source now pins values that equal upstream's.

**8. A session's surface hint cannot join a route that scored only a generic hub surface (observed, and read in the code).**
- In `canary-router.cjs`, `hintedFallbackSurface` runs only when no mode scored, and `applySurfaceHint` only reorders targets the prompt already matched.
- With upstream's first-stage frontend keywords, `compiled-route.cjs --hub sk-code --surface-hint sk-code-fe-partners-app --prompt "make the navbar sticky with css"` returns `["sk-code-frontend"]`. Before the keywords were added it returned `["sk-code-fe-partners-app"]`, because the prompt scored nothing.
- A Barter repository surface links the frontend packet and adds the repository's own patterns, so the route lost evidence when the keywords were added.
- Barter's packet `SKILL.md` now tells the agent to open the repository's surface beside the packet. That is prose, and no check enforces it.

**9. Two frontend phrases outscore a surface a host adds (measured, and worked around in data).**
- Every mode scores at weight 4 and `routerPolicy.ambiguityDelta` is 1. "fix the responsive grid and the sticky header in fe-partners-app" scored the frontend surface at 8 and the repository surface at 4, and routed to `["sk-code-frontend"]`. "review the dark mode toggle and focus trap in fe-backoffice-app" dropped the review mode and the repository surface the same way.
- Barter's `hub-router.json` overlay sets `routerSignals.sk-code-frontend.weight` to 2 and `routerPolicy.ambiguityDelta` to 2. Every other mode scores in multiples of 4, so the wider window changes only comparisons with the frontend surface. One to three frontend phrases now bundle beside the repository surface and the review mode. Four drop them again.
- The second prompt drops the review mode in a hub with no added surface too, so this is not only a host's case.

**10. A baseline capture run straight after `skill_graph_scan` can read the state from before the scan (observed twice, cause not found).**
- `capture-command-routing-baseline.mjs`, run in the same command as `skill-advisor.cjs skill_graph_scan --trusted`, returned the value from before the scan for one row each time. A run a minute later returned the new value three times in a row.
- Barter did not find which cache or process held the old state.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

- Evidence in this phase's `scratch/`: `probe-after.txt` and `probe2-after.txt` (the routes at Barter's values), `advisor-suite-tail.txt` (the suite at the final state).
- The numbers behind item 9 at upstream's values are in this phase's `implementation-summary.md`, under Verification.
- One line of `../023-repin-d0fc9d719b/handover.md` no longer holds: its Context Transfer says plain frontend requests defer in Barter. They now route to the frontend packet.
- Not confirmed for item 7: whether the engine's sync state already records enough to restore a value. Barter read only the `set` branch.
- Not Skilled's: upstream's keyword `lcp regression` is left out of Barter's routers. With it the advisor ranked `sk-code` above `sk-git` for "review this pull request for bugs", the control row `doctor-control-04`. Upstream's own suite may pass with it, since Barter's `sk-git` signals differ.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

Proposed to Skilled:

7. **Restore the pinned value when a `json-entry` operation leaves the source**, or have `status` report a live value that neither the pin nor any current operation explains.
8. **Let a session hint that names a specific surface join a route whose only surface is a generic hub one**, ahead of it, as `applySurfaceHint` already orders two matched surfaces.
9. **Say whether a host may lower one surface's weight and widen `ambiguityDelta`**, or score a surface a host adds so that a second phrase for a generic surface does not drop it.
10. **Find why a capture after a scan reads old state**, or have the capture wait for the scan's generation.

In Barter, after Skilled ships item 7: remove the two `set` operations that state upstream's value. After item 8: remove the repository line from the packet's `SKILL.md`.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [ ] After a `set` operation is removed from a source, `apply` returns the live value to the pin's, or `status` does not print `RESULT: PASSED`.
- [ ] A hinted plain frontend prompt routes to the hinted specific surface and the frontend surface.
- [ ] A capture run in the same command as a scan returns the same rows as one run a minute later.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

Written after the frontend port of 2026-11-16. Barter changed no vendored engine or router code for any item. Items 7 and 9 are `json-entry` operations and item 8 is one line in Barter's own packet.
<!-- /ANCHOR:session-notes -->
