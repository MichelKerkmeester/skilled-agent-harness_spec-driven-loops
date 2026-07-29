---
title: "Implementation Summary: Remove Routing-Neutral Dead Fields"
description: "Planned scope record: what will be deleted, reconciled, and documented once this phase executes — not yet built."
trigger_phrases:
  - "dead field deletes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/007-dead-field-deletes"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "REQ-004 (causal_summary disposition) needs phase 003's recorded decision before it can execute"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-dead-field-deletes"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "advisorRouting.packetSkillName: delete outright vs keep-and-document as an intentional redundant self-check"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Remove Routing-Neutral Dead Fields

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase turns two findings from the 029 skill/advisor JSON optimization research — the routing-neutral half of O5 and all of O11 — into a scoped, evidence-verified deletion-and-reconciliation packet. Nothing ships yet; this is the plan a future implementation session executes.

### Orphan-field deletion (O5, routing-neutral half)

Three `description.json` extras (`trigger_examples` on 7 hubs, `supported_surfaces`/`opencode_languages` on `sk-code` and `sk-doc`) and two `sk-code`-only `graph-metadata.json` derived-block fields (`supported_surfaces`, `peer_resource_categories`) will be deleted once a fresh repo-wide grep at implementation time reconfirms zero non-JSON readers. A sixth field, `derived.causal_summary` (16 files fleet-wide), is validated as required-non-empty by the Python compiler but absent from the TypeScript `SkillDerivedV2Schema` and never read by the scorer's derived lane — its disposition is deliberately left to whatever phase 003 decides about the canonical `derived` owner, rather than assumed here.

### Duplicate-authority reconciliation (O11)

`sk-doc/hub-router.json`'s authored `routerPolicy.tieBreak` order has drifted from what `sk-doc`'s own compiler actually uses (six of seven hubs copy the authored order verbatim into the runtime router; `sk-doc` alone derives its own order from `routerSignals` key order and silently ignores the authored array, per an inline comment in `registry-compiler.cjs` that already documents the drift). This phase will realign the two. Separately, every mode entry in every hub's `mode-registry.json` carries `packetSkillName` twice — once at the top level, which every production consumer reads, and once nested inside `advisorRouting`, which only a drift-guard test reads — and this phase will resolve that duplication one way or the other, recording the choice.

### Documentation gap (O11)

`skill-root-metadata-contract.md` already distinguishes the skill-root and spec-folder `description.json`/`graph-metadata.json` schemas, but does not name the spec-folder-only `generate-description.ts`/`backfill-graph-metadata.ts` scripts as having no skill-root equivalent. This phase will add that one-line cross-reference.

### Files Changed (planned)

| File | Action | Purpose |
|------|--------|---------|
| `sk-prompt/description.json`, `mcp-tooling/description.json`, `system-deep-loop/description.json`, `sk-code/description.json`, `sk-design/description.json`, `sk-doc/description.json`, `cli-external-orchestration/description.json` | Modified | Remove `trigger_examples` (REQ-001) |
| `sk-code/description.json`, `sk-doc/description.json` | Modified | Remove `supported_surfaces`, `opencode_languages` (REQ-002) |
| `sk-code/graph-metadata.json` | Modified | Remove `derived.supported_surfaces`, `derived.peer_resource_categories` (REQ-003) |
| Fleet `graph-metadata.json` files carrying `derived.causal_summary` (16) | Modified or unchanged, per phase 003's decision | REQ-004 |
| `sk-doc/hub-router.json` | Modified | Reorder `routerPolicy.tieBreak`, add exception comment (REQ-005) |
| Fleet `mode-registry.json` files, `routing-registry-drift-guard.vitest.ts`, `init_skill.py` | Modified per chosen branch | Resolve `advisorRouting.packetSkillName` duplicate (REQ-006) |
| `skill-root-metadata-contract.md` | Modified | Script-name-collision note (REQ-007) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. This packet was authored by re-verifying every claim in the 029 research's O5/O11 findings against the live tree with fresh repo-wide greps (rather than trusting the research's citations at face value), confirming exactly which hubs carry which field and exactly which callers read `packetSkillName` versus `tieBreak` at the top level vs. nested. Once phase 003 records its canonical-derived-owner decision, an implementation session will execute the three phases in `tasks.md` and re-run the same greps plus the fleet gate, doctor checks, Python compiler validation, and drift-guard vitest suite before claiming completion.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split O5 into a routing-neutral half (this phase) and left the `graph-metadata.manual.*` field out of scope | `manual.*` needs a schema migration into typed `edges` plus an unknown-key lint, not a plain deletion — bundling a migration into a deletion-only phase would blur its acceptance criteria and its own rollback story |
| Gated `causal_summary`'s disposition on phase 003 instead of picking a side now | The field's fate depends entirely on which schema (TS or Python) phase 003 names canonical; deciding it here would risk contradicting that decision later |
| Left `advisorRouting.packetSkillName`'s resolution as an open question rather than picking a default | Deleting it fleet-wide touches scaffold templates and a test assertion in one change; keeping it open lets implementation-time evidence (whether any scaffold silently depends on its presence) decide, rather than a spec-time guess |
| Treated the `sk-doc` `tieBreak` reorder as data-only, not a compiler-logic change | The compiler already ignores the authored order (confirmed by its own inline comment); reordering the array to match reality is a zero-behavior-change cleanup, not a fix to running code |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec-authoring-time repo-wide grep for `trigger_examples`/`supported_surfaces`/`opencode_languages` (description.json) | Confirmed 7/2/2 hub counts, zero non-JSON code readers |
| Spec-authoring-time repo-wide grep for `supported_surfaces`/`peer_resource_categories` (graph-metadata.json derived) | Confirmed `sk-code` sole carrier; absent from `skill_graph_compiler.py`'s required-field list (line 313) and from `scorer/lanes/derived.ts` |
| Spec-authoring-time inspection of `skill-derived-v2.ts` vs `skill_graph_compiler.py` | Confirmed `causal_summary` is validated by the Python compiler (lines 318-320) but absent from the TS `SkillDerivedV2Schema` (lines 42-55) and unread by `scorer/lanes/derived.ts` |
| Spec-authoring-time inspection of all 7 hubs' `registry-compiler.cjs` | Confirmed 6/7 copy `routerPolicy.tieBreak` verbatim into the compiled router; `sk-doc`'s alone derives and ignores it (lines 188-200) |
| Spec-authoring-time repo-wide grep for `packetSkillName` | Confirmed the top-level field drives `registry-compiler.cjs`, `parent-skill-check.cjs`, `d5-connectivity.cjs`, `executor-delegation.ts`; the nested `advisorRouting.packetSkillName` is read only by `routing-registry-drift-guard.vitest.ts` |
| `validate.sh --strict` on this spec folder | Not yet run — belongs to the orchestrator's post-authoring pass |
| Implementation-time fleet gate / doctor checks / compiler validation / drift-guard suite | Not yet run — this phase has not been implemented |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **REQ-004 is not resolvable at spec-authoring time.** `causal_summary`'s disposition depends on phase 003's canonical-derived-owner decision, which had not landed when this spec was written; the requirement is written to branch cleanly on either outcome rather than guess.
2. **REQ-006's resolution direction is an open question, not a decision.** Whether to delete `advisorRouting.packetSkillName` outright or keep it documented as an intentional redundant check is left for implementation time, when the scaffold-dependency question can be checked directly rather than inferred.
3. **This packet was authored concurrently with sibling phases under the same parent** (`030-json-optimization-implementation`), so cross-phase references (the `003-*` predecessor, any phases after this one) are structural placeholders by number, not verified slugs — the parent packet's own authoring pass is expected to confirm or correct them.
<!-- /ANCHOR:limitations -->
