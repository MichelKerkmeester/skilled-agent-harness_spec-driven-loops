---
title: "Implementation Summary"
description: "LLM Gateway had switched off the DeepSeek id the cli-pi fan-out defaulted to, so every lineage that omitted a model was dispatching at a dead route. The gateway route is DeepSeek V4.1 Flash now, across the runtime, both CLI rosters and the Pi config."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash"
    last_updated_at: "2026-09-10T22:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Repointed the DevPass DeepSeek route and closed the packet"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".pi/models.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-10-llmgateway-deepseek-v41"
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
| **Spec Folder** | 069-llmgateway-deepseek-v4-1-flash |
| **Status** | Complete |
| **Completed** | 2026-09-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The question was whether the gateway carried DeepSeek V4.1 Flash yet. It does. Answering it also turned up that the id the gateway route already named had been switched off. A live call returns `410 "has been deactivated and is no longer available"`, and that id was the cli-pi default in the deep-loop fan-out, so any lineage that did not name a model was dispatching at a route that no longer existed. Nothing reported it: a model listing shows the id missing rather than dead, and neither an auth check nor a listing check fails.

### Phase 1: llmgateway-deepseek-v4-1-flash

Your DevPass DeepSeek dispatches now reach `deepseek-v4.1-flash`, which the same account answers `200` for. It takes images like the id it replaces, keeps the 1.05M context, and raises the output ceiling to 384K. The forced `max` effort tier was probed before the pin was pointed at it, because pinning a tier a route does not offer is the failure mode that motivated the pin's own documentation.

The rosters carry what the provider documents and what the probes returned. Three claims did not survive contact. The old row's sparse tier ladder was wrong in both directions: `minimal`, `medium` and `xhigh` are all accepted, and they fold onto three real levels rather than adding tiers. The gateway fronts 262 models, not 183. And the upstream rewrite reports `deepseek/`, not the `gonka24/` name the old route produced.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Allowlist, provider map, default and effort pin |
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | The same four in the source of record |
| `system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Assertions plus a third private copy of the pin pattern |
| `system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modified | Allowlist, default and a new pin assertion |
| `cli-pi/references/providers-and-models.md` | Modified | Gateway roster row, id-shape example, reachability prose |
| `cli-opencode/references/providers-and-models.md` | Modified | Gateway roster row, bare-id footgun, effort table, model count |
| Both skills' `SKILL.md` and a new `changelog/` entry each | Modified, Created | Anchors moved to 1.5.2.0 and 1.4.5.0 |
| `.pi/models.json` | Modified | Provider block with measured context, ceiling and rates |
| `.pi/settings.json`, `.pi/custom-providers.md` | Modified | Picker entry, setup and round-trip verification commands |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The route was probed before anything was wired, which is the whole lesson of the failure being fixed. Four calls settled it: the candidate, the retired id, a prefixed form, and the candidate under each effort tier. Only the first of those is answerable from a model listing, and the listing would have said nothing about the `410`.

The effort probe was the weak link. It sent five values, all of them valid, and the uniform `200` was written up as proof that the route accepts anything. One deliberately invalid value would have shown otherwise, and the provider's own guide had the ladder in a table the whole time. The correction landed before anything depended on it, but the lesson is that a probe with no negative case cannot support a negative conclusion.

The runtime moved first, because that is what dispatches, then the rosters that describe it. The test suites earned their place immediately: the fan-out suite failed on a data-driven case whose expected arguments came from a private copy of the effort-pin regex living inside the test file. The implementation was right and the test's copy was stale, which is how the third copy of that pattern was found at all.

One recovery is worth recording. A loop meant to revert version-field churn on untouched documents reverted the two edited rosters as well, discarding twelve prose edits. Everything else survived, and the edits were reapplied from a single script rather than by hand. A narrower revert with an explicit file list would not have had the failure mode.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Only the gateway literal moved | The operator scoped it there, and the evidence agrees: the `opencode-go`, `cline-pass` and OpenRouter routes to the same family all still resolve. One literal maps to one provider, so three lookalike strings had to survive untouched. |
| The tier ladder is taken from the provider's own guide | A first pass called it unknowable on the strength of five `200` responses. Every string in that sample was valid, so it showed nothing. The documentation gives three levels plus off, and a probe of a deliberately invalid value confirms the route validates. |
| The pin was probed before it was pointed | A forced tier the route lacks fails at dispatch, which is exactly the class of silent breakage this packet is repairing. |
| The Pi thinking-level map was left as it was | Its three mapped tiers are exactly the three that differ. The unmapped aliases are accepted by the route but fold onto those same three, so mapping them would offer the picker levels that change nothing. |
| Version churn on untouched docs was reverted | The strict formula says every child document's build segment moves, but no gate requires it, and 113 version-only edits would bury a model-id change in noise. |
| The OpenRouter fan-out literals were left alone | An earlier packet decided that deliberately and called them the deep-loop runtime's contract. Overturning another owner's recorded decision is not this packet's business. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live call, new bare id | PASS. `200`, upstream `deepseek/deepseek-v4.1-flash` |
| Live call, retired id | PASS as a negative control. `410`, deactivated |
| Live call, prefixed id | PASS as a negative control. `400`, provider names the id it rejected |
| Effort ladder | Taken from DeepSeek's thinking-mode guide: three levels plus off, `high` by default. `ultra` and every integer refused on this route |
| `fanout-run.vitest.ts` | PASS. 121 tests, 0 failures |
| `executor-config.vitest.ts` | PASS. 92 tests, 0 failures |
| `check-frontmatter-versions.sh` | PASS. 2,961 files, exit 0 |
| Repository scan for the retired id | PASS. No live surface. The only match is the OpenRouter-prefixed literal, a different route |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The three documented levels cannot be told apart by reasoning-token spend.** Four samples each of `low`, `high` and `max` on one hard problem gave medians of 1,673, 1,947 and 1,515 with fully overlapping ranges, so `max` looked lowest by median. The ladder is real per the provider documentation, but token count is too noisy a proxy to confirm it at this sample size, and no claim here rests on that measurement.

2. **Uncached work on this route costs more than it did.** The retired id billed $0.14 in and $0.28 out per million tokens. The replacement bills $0.15 and $0.60. Cached reads are near-identical. A fan-out that reuses a large prompt is barely affected, and one that generates heavily is not.

3. **The fan-out still maps two OpenRouter literals to a provider the operator says is not in use.** They were left deliberately by an earlier packet as the deep-loop runtime's contract rather than either skill's. They are inert unless a lineage names one of those exact literals.

4. **The effort-pin pattern lives in three places.** The script, its TypeScript source and a private copy inside the fan-out test. The test copy is what caught the drift this time, but nothing forces the three to agree.
<!-- /ANCHOR:limitations -->

---
