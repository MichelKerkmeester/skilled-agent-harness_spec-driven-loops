---
title: "Implementation Summary: sk-design routing and resource-loading wiring"
description: "Done. The interface grounding loader was split so a system-grounding task loads one file instead of four, the preflight branch gained its dial input, the foundations TOKENS branch now loads the full cross-axis set plus the shared token vocabulary, and the parent registry gained the foundations and md-generator aliases the children own."
trigger_phrases:
  - "sk-design routing wiring status"
  - "foundations aliases outcome"
importance_tier: "important"
contextType: "implementation"
status: complete
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/018-routing-wiring"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Split the interface grounding loader and wired the foundations and md-gen routing"
    next_safe_action: "Move to 019 handoff card"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-018-routing-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-design routing and resource-loading wiring

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 154-sk-design-parent/018-routing-wiring |
| **Completed** | 2026-06-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Router precision and resource loading tightened across three modes.

The interface `GROUNDING` intent was one overloaded branch that loaded the own-system inventory plus both external catalog tool refs on any grounding task. It is now split into `REAL_SYSTEM_GROUNDING` (loads the design inventory alone) and `REAL_WORLD_REFERENCE` (loads the Mobbin and Refero catalog refs). A system-grounding task now loads one grounding file instead of four. The `MECHANICAL_PREFLIGHT` branch also gained `brief_to_dials.md` so the preflight card has the dial-calibration input it depends on.

The foundations `TOKENS` branch loaded only the token scaffold even though token work is cross-axis. It now also loads the color, type and layout references plus the parent token vocabulary from the sibling shared dir.

The parent registry gained the aliases each child owns but the router did not expose: foundations got grid, container queries, context adaptation, data visualization, chart type, data tables and token starter; md-generator got validate, report, preview and study aliases that stay extraction-and-validate specific so they do not capture a generic token prompt.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The wiring gaps are grounded in the interface, foundations and md-generator lineages. The grounding split keeps all four original files reachable, just under two intents instead of one, so a system task and a real-world task no longer share a load set. The foundations TOKENS cross-axis load uses the parent shared token vocabulary, which the 016 gate sanction now permits in a resource map. The new aliases were kept precise so foundations keeps the generic "design tokens" term and md-generator keeps only the extraction variants, avoiding a parent-routing collision.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split grounding into two intents rather than trim it | Resource recall is strong, so the fix is branch precision, not removing knowledge |
| Keep the one-catalog-by-surface choice in the prose | The keyword router has no app-versus-web signal, so the machine lists both catalog refs and the runtime picks one |
| Address audit and md-generator economy by reach, not trimming | Their multi-resource loading is largely intentional, so the alias additions widen reach while a full re-score is deferred to 020 |
| Keep new aliases precise | Broad aliases collide across modes, so each routes only to its owner |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `mode-registry.json` valid JSON | PASS |
| D5 connectivity gate, all five modes | PASS. score 100, 0 escapes, 0 dead intent keys, 0 dead paths each |
| Interface over-routing dropped | PASS. a system-grounding task loads 1 grounding file, a real-world task loads the 3 catalog refs (was 4 for either before) |
| Foundations TOKENS cross-axis load | PASS. replay loads corpus_map, register, token_starter, oklch_workflow, typography_system, layout_responsive and design_token_vocabulary |
| Alias collision check | PASS. foundations keeps the generic token alias, md-generator keeps the extraction variants, no new alias duplicates another mode |
| `package_skill.py --check` interface, foundations | PASS |
| `validate.sh --strict` on this packet | PASSED. 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Audit and md-generator internal fan-out is unchanged.** The 014 baseline flagged them as the heaviest loaders, but their multi-resource loading is largely intentional, so this phase widened routing reach rather than trimming their resource maps. A full Mode-A re-score is deferred to the 020 fixtures phase.
2. **The catalog-by-surface choice is a runtime decision.** The machine `REAL_WORLD_REFERENCE` branch lists both Mobbin and Refero refs, and the prose directs picking one by surface, because the keyword router carries no app-versus-web signal.
3. **Gold expected-resources not yet refreshed.** The new branches and aliases change what some scenarios should expect; that gold refresh is handed to 020.
<!-- /ANCHOR:limitations -->
