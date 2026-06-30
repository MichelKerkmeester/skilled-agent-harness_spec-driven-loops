---
title: "Implementation Summary: D5-R4 — DESIGN router intent lane in all 3 CLI dictionaries"
description: "Design intent is now a recognized, weighted routing signal in each child CLI's provider dictionary, so design work dispatched to a child routes to sk-design rather than being lost in transport; resolved INTENT_SIGNALS-only because the router same-skill guard rejects a RESOURCE_MAP target."
trigger_phrases:
  - "d5-r4 implementation summary"
  - "design router intent lane built"
  - "design intent signals lane summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/004-design-router-intent-lane"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Document the DESIGN INTENT_SIGNALS lane in 3 cli-*"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r4-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-design-router-intent-lane |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When a parent dispatched design work to a child CLI, the child's deterministic router had no way to recognize design intent: none of the three cli-* provider dictionaries declared a design signal, so design phrasing scored zero against every known intent and fell through to the generic fallback lane. This phase adds a `DESIGN` intent to the `INTENT_SIGNALS` dictionary in all three cli-* SKILLs, so design intent is now a recognized, weighted routing signal in each child's provider dictionary. Design work dispatched to a child routes toward sk-design rather than being lost in transport. The lane composes with — it does not duplicate — the always-fires `Design Standards Loading` rule and the D5-R3 dispatch manifest, which remain the durable sk-design loading contract.

### The DESIGN INTENT_SIGNALS key in three cli-*

Each of `cli-codex/SKILL.md`, `cli-claude-code/SKILL.md`, and `cli-opencode/SKILL.md` now carries one new `INTENT_SIGNALS["DESIGN"]` key with `weight: 4` (equal to every other primary intent) and an identical keyword set: `sk-design`, `interface design`, `frontend design`, `visual design`, `redesign the ui`, `design foundations`, `design tokens`, `motion design`, `micro-interactions`, `design audit`, `ui critique`, `extract design system`, `generate design.md`. Every keyword traces to a hub-router vocabulary alias (the interface / foundations / motion / audit / md-generator alias classes) or a hub-identity token, so the lane invents no net-new design vocabulary and cannot drift from the hub. This is a deterministic routing-signal addition: the lane makes design intent legible to the scorer. It makes no taste claim and resolves no design mode — mode resolution stays the child's job via the loaded contract.

### INTENT_SIGNALS-only resolution, and why no RESOURCE_MAP target

The phase scaffold and the original plan called for "a `DESIGN` intent + keywords + `RESOURCE_MAP` target." During preconditions the resolution was changed to INTENT_SIGNALS-only, and no `RESOURCE_MAP["DESIGN"]` entry was added. The router same-skill path guard (`_guard_in_skill`) resolves a `RESOURCE_MAP` target against the cli-* skill root and rejects anything that escapes it or does not end in `.md`. No skill-local design `.md` exists in any cli-* skill root, so a `RESOURCE_MAP["DESIGN"]` target would be a guard-violating dangling cross-skill reference that breaks routing. A WHY comment in each dictionary records this: "DESIGN is an intent signal only. The durable sk-design loading contract lives in the always-fires Design Standards Loading rule and the dispatch manifest; RESOURCE_MAP stays limited to same-skill markdown paths." The design resource is reached through the D5-R1 ALWAYS rule and the D5-R3 dispatch manifest, so the lane is the fast scored keyword path while D5-R1 remains the phrasing-independent safety net.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-codex/SKILL.md` | Modified | Added `INTENT_SIGNALS["DESIGN"]` (weight 4, line 112) + a 3-line WHY comment (lines 109-111); `RESOURCE_MAP` unchanged |
| `.opencode/skills/cli-claude-code/SKILL.md` | Modified | Added the same `DESIGN` key (line 113) + WHY comment (lines 110-112), parallel keyword set; `RESOURCE_MAP` unchanged |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Added the same `DESIGN` key (line 127) + WHY comment (lines 124-126), stacked on top of the concurrent GLM-5.2 WIP; `RESOURCE_MAP` unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) edited exactly the three cli-* `INTENT_SIGNALS` dictionaries under a frozen scope. It added only the `DESIGN` key plus a WHY comment to each; it added no `RESOURCE_MAP["DESIGN"]` entry, because the orchestrator resolved the precondition to INTENT_SIGNALS-only after confirming the router guard rejects cross-skill paths and that no skill-local design `.md` exists. `hub-router.json`, `router-replay.cjs`, and `cli_reference.md` were left untouched.

The orchestrator verified the deliverable independently. All three cli-* carry the `DESIGN` `INTENT_SIGNALS` key (one per dictionary), and no `RESOURCE_MAP` carries a `DESIGN` key — the apparent `RESOURCE_MAP[DESIGN]=1` grep hit was a false-match on the explanatory WHY comment, not a real entry. The concurrent GLM-5.2 WIP in `cli-opencode/SKILL.md` is byte-identical before and after, because codex touched only the `DESIGN` key and stacked it on top. The existing routes are unchanged. The sk-design `hubRoute` scorer stays 13 pass / 5 known-gap / 0 regression: a cli-* `INTENT_SIGNALS` change does not touch the sk-design hub corpus, so no hub-route regression is possible from this edit. An evergreen scan over the deliverable returned no spec path, packet, phase, ADR, REQ, task, or finding ID.

This phase adds a recognized routing signal and composes with the load-time safety net; it does not add a static token lint or route-replay fixtures asserting the lane — that is the sibling fixture phase, named as the downstream consumer, not built here.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve the lane to INTENT_SIGNALS-only; add no `RESOURCE_MAP["DESIGN"]` | The router same-skill guard rejects cross-skill paths and non-`.md` targets, and no skill-local design `.md` exists, so a `RESOURCE_MAP` target would be a guard-violating dangling reference that breaks routing |
| Reach the design resource via the D5-R1 ALWAYS rule + the D5-R3 manifest, not a `RESOURCE_MAP` target | The durable loading contract already lives there; the lane is the fast scored keyword path, so it composes with D5-R1 instead of issuing a competing or dangling load instruction |
| Set weight 4, equal to the other primary intents | Design intent deserves the same scoring strength as the existing primaries, and equal weight avoids both starving and over-firing the lane |
| Trace every keyword to the hub-router vocabulary | Drawing keywords from the hub alias classes and hub-identity tokens keeps a single source of truth and prevents the cli dictionary from drifting from the hub |
| Record the resolution in a WHY comment in each dictionary | A future editor seeing no `RESOURCE_MAP` entry needs the guard rationale inline, or the "missing" target reads like a bug |
| Add the key on top of the GLM WIP, touch nothing else | The concurrent GLM workstream was editing cli-opencode; an additive key keeps its WIP byte-identical |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `DESIGN` in `INTENT_SIGNALS` in all 3 cli-* | PASS — one key each (cli-codex line 112, cli-claude-code line 113, cli-opencode line 127), `weight: 4` |
| No `DESIGN` key in any `RESOURCE_MAP` | PASS — `RESOURCE_MAP` unchanged; the `RESOURCE_MAP[DESIGN]=1` grep hit was a false-match on the WHY comment, not a real entry |
| Keyword sets parallel across siblings | PASS — the `DESIGN` keyword set is byte-identical in all three |
| Every keyword traces to hub-router vocabulary | PASS — each keyword maps to a hub vocabulary alias or hub-identity token; no net-new vocabulary |
| WHY comment present | PASS — each cli-* states the INTENT_SIGNALS-only rationale and where the durable contract lives |
| Existing routes byte-identical | PASS — prior intents/resources unchanged in all three |
| GLM WIP byte-identical (no clobber) | PASS — the GLM-5.2 WIP in cli-opencode is unchanged before/after; only the `DESIGN` key added |
| hubRoute scorer 13 / 5 / 0 | PASS — unchanged; a cli-* `INTENT_SIGNALS` change does not touch the sk-design hub corpus |
| Evergreen scan over deliverable | PASS — no spec path / packet / phase / ADR / REQ / task / finding ID |
| `validate.sh --strict` | PASS except the 2 expected GENERATED_METADATA findings (orchestrator regenerates `description.json` / `graph-metadata.json`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The lane is a coarse design-intent gate, not a per-mode router.** It scores design intent and hands off; it does not resolve which design mode (interface, foundations, motion, audit, md-generator) applies. Mode resolution stays the child's job via the loaded contract.
2. **A design prompt that matches no keyword is still covered, but not by the lane.** Such a prompt loads sk-design through the always-fires `Design Standards Loading` rule, not the scored lane. The lane is the fast path, not the only path.
3. **No automated assertion of the lane lands here.** The static token lint and route-replay fixtures that would assert the `DESIGN` key and its keyword set in each dictionary are the sibling fixture phase, named as the consumer. Until that lands, verification is a static read, not an automated check.
4. **Generated metadata is a residual at hand-off.** `description.json` and `graph-metadata.json` still need regeneration by the orchestrator after this doc sync; the strict validator's 2 GENERATED_METADATA findings are expected and are not hand-written.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
</content>
