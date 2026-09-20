---
title: "Implementation Summary"
description: "The operator asked for a version bump. The live CLI showed the bare `swe` alias had already moved to SWE-2, so the skill's documented default had been dispatching to a model no surface named. Ten files corrected, the fan-out allowlist widened, `swe-2-max` dispatch-verified."
trigger_phrases:
  - "swe-2 cutover summary"
  - "what shipped swe-2"
  - "devin alias drift evidence"
  - "swe-2 allowlist verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/070-swe-2-model-cutover"
    last_updated_at: "2026-09-12T06:15:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Cutover shipped; swe-2-max dispatch-verified and the fan-out allowlist widened"
    next_safe_action: "Dispatch the five-iteration deep research on the advisor decommission at swe-2-max"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/graph-metadata.json"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01V4wzp8qRJRvyXdqxAYuJTi"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Nothing detects the next alias move; a periodic devin models list diff would"
    answered_questions:
      - "Does a bare swe-2 id exist? No. The three ids are high, medium and max"
      - "Should SWE-1.7 be removed? No, the CLI still serves four of its ids"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 070-swe-2-model-cutover |
| **Completed** | 2026-09-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The ask was to replace SWE 1.7 with SWE 2 because SWE 2 had just been released. Reading `devin models list` first turned a version bump into a correctness fix: the family `SWE-2 (swe-2)` already carried `aliases: swe`, and `swe` is the skill's documented default. Every dispatch that took the default had been running SWE-2 while eight documents said it was running SWE-1.7 Lightning. You now get the model the documentation names.

### The alias claim

`swe` is documented as resolving to SWE-2 everywhere it is mentioned, which is what the CLI does. Two claims that travelled with the old alias went with it. The default was described as a lightning speed tier, and SWE-2 has no lightning tier, so a caller choosing the default for latency was choosing on a false premise. The curated roster also claimed Devin fronts 37 families where the CLI now reports 48.

SWE-1.7 kept its rows. The CLI still serves `swe-1-7`, `swe-1-7-medium`, `swe-1-7-lightning` and `swe-1-7-lightning-medium`, so pinning one is still legitimate. What it lost is the alias and the default position. The lightning tier is now named for what it is: the only lightning option, and the only metered one, against SWE-2's three free effort tiers at 262K context.

### The routing vocabulary

A hub routes in two stages, and a keyword added to `ROUTER.md` alone never reaches the advisor that scores the hub. So `swe-2` went into all three metadata files beside the existing `swe-1.7` entries rather than replacing them. Both generations are dispatchable, so a prompt naming either one still routes to the Devin mode.

### One defect the gates caught on the way past

The positive test fixture in `fanout-run.vitest.ts` is named "accepts every model in the enforced allowlist" and enumerates the ids by hand. Adding three ids to the allowlist left the name untrue while the suite stayed green, because the fixture only iterates what it lists. It is complete again, and the rejection fixture now pins the bare `swe-2` that a reader would reasonably assume exists. The repository frontmatter gate also turned up a reference file from the advisor decommission missing its `version` field; that is fixed here rather than left for whoever next runs the gate.

### The fan-out allowlist

The deep-loop fan-out enforces a literal set of cli-devin ids and would have refused `swe-2-max` before sending a request. That is why the follow-on research needed this, not just the docs. The three SWE-2 ids joined both copies of the set, and the doc comment beside the default, which still explained that `swe` is the SWE-1.7 Lightning alias, now says what actually happened: Cognition moved the alias, so the default followed without the literal changing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-devin/SKILL.md` | Modified | Default alias, the "swe max" dispatch row, three family lists, selection strategy |
| `cli-devin/references/providers-and-models.md` | Modified | Three SWE-2 rows added, alias claim moved off the lightning row, default row, family count |
| `cli-devin/references/cli-reference.md` | Modified | Overview, `--model` description, default paragraph, four rationale rows, troubleshooting |
| `cli-devin/README.md` | Modified | Roster line, default claim, troubleshooting row, model-choice answer |
| `ROUTER.md` | Modified | Hub roster line and the DEVIN keyword weight |
| `graph-metadata.json` | Modified | Advisor vocabulary widened in three lists |
| `hub-router.json` | Modified | `devin-dispatch` keywords widened |
| `description.json` | Modified | Hub description vocabulary widened |
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | Three ids added; the alias claim in the default's doc comment corrected |
| `system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | The same three in the synchronous copy the lineage builder reads |
| `system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Positive fixture completed; negatives add the bare `swe-2` and `swe-1-7-lightning-medium` |
| `cli-devin/changelog/v1.4.2.0.md` | Created | The roster-change record, and the version bump that goes with it |
| `system-skill-advisor/references/runtime/cli-front-door-contract.md` | Modified | Missing `version` field, which was failing the repository frontmatter gate |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ground truth came from `devin models list` on version 3000.10.21, not from a release note, and it is what turned the framing around. `swe-2-max` was then probed with a live one-turn dispatch before being wired anywhere, because this repository has already shipped a documented model id that failed at resolution, and the probe costs one turn. It replied.

Three uncommitted changes in the working tree belong to other work: the V4.1 Flash model swap in `cli-opencode` and `cli-pi`, and an `AGENTS.md` section renumber across three modes. They were identified before anything was staged and left alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lead the packet with the alias drift rather than the version bump | The drift is the defect. A version bump would have been optional; a default that resolves somewhere the docs do not name is wrong today |
| Keep SWE-1.7 documented as pinnable | The CLI still serves four of its ids. Deleting them would break a deliberate pin to satisfy a tidier roster |
| Widen the routing vocabulary instead of replacing it | Both generations dispatch, so a prompt naming either should route. Replacing would have silently dropped the older one |
| Probe `swe-2-max` live before wiring | A list entry proves the id is named, not that it resolves. The Cline route in the V4.1 Flash packet listed and still failed |
| Let the pre-commit gate re-mint the serving manifest | Editing the mode's `SKILL.md` and the hub's `hub-router.json` is exactly the narrow set that gate covers, and a hand-run mint is one more thing to get wrong |
| Record no tier ladder claim for `swe-2-high` and `swe-2-medium` | Only max was dispatch-tested. The other two are list-verified and are described that way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `devin models list` on 3000.10.21 | PASS — `SWE-2 (swe-2)` carries `aliases: swe`; ids are `swe-2-high`, `swe-2-medium`, `swe-2-max`, all free at 262K; no bare `swe-2` |
| Live `devin -p --model swe-2-max` | PASS — returned the requested reply, exit 0 |
| Alias-claim scan outside `changelog/` | PASS — no surviving `swe-1-7-lightning` alias claim, no 37-family figure |
| `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts` | PASS — 218 tests across the three, after the fixture was completed |
| `check-frontmatter-versions.sh` | PASS — 2863 files ok, 0 failures. It was failing on one file before this packet, from the advisor decommission |
| Three hub JSON files parse | PASS — validated before each write; one duplicate line from a substring match was found and removed |
| `compiled-route-guard.cjs` | Reported `cli-external-orchestration stale-manifest` after the edit, as expected; the pre-commit gate re-mints and stages both manifests |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only `swe-2-max` is dispatch-verified.** `swe-2-high` and `swe-2-medium` are list-verified. Both are documented that way rather than claimed as working.
2. **Nothing detects the next alias move.** This drift arrived with no signal and was found only because the operator asked for an unrelated bump. A periodic diff of `devin models list` against the roster would catch it, and belongs to the mode rather than to this packet.
3. **The Fusion families are unevaluated.** The listing shows `fusion-*-sidekick-swe-2-medium` pairings. Whether any belongs in the curated six was not assessed.
4. **The subagent default is still recorded as SWE-1.6.** `run_subagent` takes a profile, not a model, so the claim could not be checked without a live subagent turn. It was left as written rather than updated on a guess.
<!-- /ANCHOR:limitations -->

---
