---
title: "Implementation Summary: Headless Fallback Status and Dedup"
description: "The advisor fallback now opens with one status line that says whether the advisor failed, matched nothing or skipped the prompt, names the recovery command on an outage, and repeats in a known session as that line alone."
trigger_phrases:
  - "fallback status summary"
  - "fallback dedup summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/004-headless-fallback-status-and-dedup"
    last_updated_at: "2026-09-26T13:40:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Shipped R4 status heads and R6 head-only repeats on Claude and OpenCode"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/render.ts"
      - ".skilled/plugins/system-skill-advisor.js"
      - ".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Research Q7: the operator allowed head-only fallback repeats in a known session."
      - "A head before the directives separator is enough for the existing lifecycle split; directive-lifecycle.ts needs no change."
      - "The fallback case must read status and freshness: the CLI path reports a no-match as skipped with live or stale freshness."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Headless Fallback Status and Dedup

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-headless-fallback-status-and-dedup |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A model that gets no brief now learns why. The fallback opens with one line: `Advisor: outage (<status>)` with the command to route by hand, `Advisor: no skill matched.`, or `Advisor: prompt skipped.`. The directives block below it is unchanged. Because the fallback now has a head, the existing lifecycle split treats it like a brief: in a known session the first no-route turn gets the whole text and later ones get the line alone.

### Phase 4: headless fallback status and dedup

- **Status heads (R4).** `advisorFallbackCase` in `runtime/lib/render.ts` classifies a result with no brief, and `renderAdvisorFallbackDirective` renders the head plus the directives. `renderAdvisorTimeoutFallback` is now the outage case and has lost its unread marker line.
- **The rule reads freshness as well as status.** The CLI path reports a live answer with nothing above threshold as `skipped` with `live` or `stale` freshness, which only the prompt gate's `skipped` with `unavailable` freshness can be told apart from. Outage is `fail_open`, a missing graph (`absent`), or `unavailable` freshness on anything but a gate skip. No result at all counts as an outage.
- **Plugin mirror (R4).** `renderPluginFallbackDirective` in `.skilled/plugins/system-skill-advisor.js` implements the same rule and text, and the plugin maps its CLI response to the pair the hook would produce. A parity test compares the two for every pair in the rule.
- **Pi debug labels (R4).** `formatPiAdvisorDebug` labels `fallback(outage)`, `fallback(no-match)`, `fallback(skipped)` and `fallback(headless)` instead of reading the head as a live route.
- **Head-only repeats (R6).** No lifecycle code changed. A repeat in a known, confirmed session keeps the head and drops the block; an unknown session, the kill switch and a thrown error still get the whole text.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Modified | R4 case rule, heads and outage renderer |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modified | R4 pass the result to the renderer; dedup comment |
| `.skilled/plugins/system-skill-advisor.js` | Modified | R4 and R6 plugin mirror |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modified | R4 debug labels |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modified | Render and dedup steps describe the heads |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modified | Heads, caps, CLI-path pairs, five-turn repeats |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modified | Parity and plugin repeats |
| `.skilled/plugins/tests/system-skill-advisor.test.cjs` | Modified | Updated pins; four transform-dedup tests isolated |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts` | Modified | Pi debug labels |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/policy-plan/baseline-contexts.json` | Modified | Regenerated `fallback` context |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna at max effort wrote each change from a one-change brief, two at a time on disjoint files, through cli-codex in fast mode and cli-pi on the `openai-codex` provider. The orchestrator reread every diff, reran every named test, and reverted each source change to confirm its tests fail without it.

The first brief carried a wrong rule: it treated every `skipped` result as a gate skip. The plugin brief's failures showed that the CLI path reports a no-match as `skipped` with live freshness, so a real no-match would have read "prompt skipped". A correction brief moved both copies to the status-and-freshness rule, and the live check confirms the real CLI no-match now reads "no skill matched". Four plugin transform-dedup tests had used the headless fallback as a block that could never be reduced; a last brief switches lifecycle dedup off inside those four so they again test only transform dedup, with their assertions unchanged. The orchestrator also updated two sentences of the hook doc that phase 3 had written, since they described the headless fallback.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Classify by status and freshness, not status alone | The CLI path and the prompt gate both return `skipped`; only freshness separates a no-match from a gate skip |
| No result counts as an outage | A missing result means the advisor did not answer, which is what Pi's deadline path renders |
| Keep the plugin's block ids and order | The change is the text, and the transform ledger keys on it already |
| Isolate the four transform-dedup tests rather than change them | They test same-message suppression; lifecycle reduction is covered by its own tests |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor suite, `npx vitest run` | 947 passed, 1 failed, 6 skipped of 954: the phase 3 baseline plus 36 new tests. The one failure is the routing-divergence ratchet, which failed at baseline |
| Typecheck, `npm run typecheck` | Exit 0 |
| Plugin suite, `node --test .skilled/plugins/tests/system-skill-advisor.test.cjs` | 29 of 29 |
| sk-code drift guards | Both passed |
| Negative controls | Reverting the renderer and hook failed 13 hook tests; reverting the plugin failed 28 vitest and 5 `.cjs` tests; reverting Pi's classifier failed 4 tests |
| REQ-001 live | A 50 ms budget through the real shim emits `Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend ...`, 143 characters |
| REQ-002 live | A real CLI no-match reads `Advisor: no skill matched.`; "thanks" reads `Advisor: prompt skipped.`, 24 characters |
| REQ-004 and SC-002 live | Five no-route turns in one session: `emittedBytes` 244, then 26 four times with `directivesSuppressed` true. Without a session id: 244 five times |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement --strict --recursive` | Run at phase close, see the parent packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The plugin never sees `absent` freshness.** Its CLI parser keeps only `live` and `stale`, so a missing graph reads `outage (fail_open)` there and `outage (absent)` in the hook. Both are the outage case with the same command.
2. **Same-message transform dedup and lifecycle dedup still interact in the plugin.** With the opt-in `deduplicateTransforms` on, a second transform for one message can be reduced to its head by lifecycle dedup and then delivered as new content instead of suppressed. Real briefs already behaved this way; the headed fallback only made it visible. It needs its own change.
3. **Whether a model runs the named command is unobserved** (research Q6).
<!-- /ANCHOR:limitations -->

---
