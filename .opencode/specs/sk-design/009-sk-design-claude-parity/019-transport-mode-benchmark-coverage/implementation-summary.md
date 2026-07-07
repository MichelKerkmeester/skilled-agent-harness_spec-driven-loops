---
title: "Implementation Summary"
description: "sk-design's benchmark corpus and skill-level advisor descriptors now cover all six registered modes (five design-judgment + one transport). Router-mode, live-mode, and a direct router-replay spot-check all confirm the new routing is correct and non-disruptive."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 019 implementation summary"
  - "transport mode benchmark coverage summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/019-transport-mode-benchmark-coverage"
    last_updated_at: "2026-07-07T10:55:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run validate.sh --strict for final confirmation, then commit and push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-design/manual_testing_playbook/01--mode-routing/mcp-open-design-mode.md"
      - ".opencode/skills/sk-design/description.json"
      - ".opencode/skills/sk-design/benchmark/after-018-transport-integration/report.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "transport-benchmark-019"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-transport-mode-benchmark-coverage |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 018 registered `design-mcp-open-design` as a new `packetKind: "transport"` mode in sk-design's `mode-registry.json`/`hub-router.json`, but left the benchmark corpus and skill-level advisor descriptors untouched — they still only knew about five modes. This phase closes that gap: a new critical-path playbook scenario, an extended advisor-integration probe battery, synced descriptors, and a full re-benchmark (both automated modes plus a direct programmatic spot-check) confirming the new routing actually works and doesn't disturb the existing five modes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/manual_testing_playbook/01--mode-routing/mcp-open-design-mode.md` | Created | `MR-007`: Open Design transport mode routing scenario |
| `.opencode/skills/sk-design/manual_testing_playbook/02--advisor-integration/positive-design-controls.md` | Edited | Added `P6` probe to `AI-001`; version 1.0.0.0 -> 1.1.0.0 |
| `.opencode/skills/sk-design/manual_testing_playbook/02--advisor-integration/doc-write-routes-elsewhere.md` | Edited | Fixed stale "five modes" prompt text; version 1.0.0.0 -> 1.0.1.0 |
| `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md` | Edited | Overview, preconditions, Section 7 table, critical-path list, AI-003 row, cross-reference index, totals (32 -> 33 scenarios, 14 -> 15 critical-path); version 1.0.0.0 -> 1.1.0.0 |
| `.opencode/skills/sk-design/README.md` | Edited | Fixed playbook description line (also resolved a pre-existing, unrelated staleness: it said "24-scenario" when the playbook already had 32) |
| `.opencode/skills/sk-design/description.json` | Edited | description, keywords, trigger_examples, modes[], backend_kinds[]; version 1.1.0.0 -> 1.2.0.0 |
| `.opencode/skills/sk-design/graph-metadata.json` | Edited | causal_summary, intent_signals |
| `.opencode/skills/sk-design/benchmark/after-018-transport-integration/{report.json,report.md}` | Created | Fresh live-mode benchmark baseline |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the playbook's root index and one existing `MR-*` scenario (`audit-mode.md`) as the exact template before authoring `MR-007`, then extended `AI-001`'s existing probe table with a sixth row rather than inventing a new scenario ID for what is really the same "does the advisor route every mode correctly" check. A router-mode benchmark run confirmed the new scenario was actually picked up by the corpus loader (scenario count 24 -> 25) before moving on. A live-mode benchmark run then produced a fresh whole-hub baseline (PASS, 93/100) — but it surfaced an important finding: `MR-007`, like all 6 of its `MR-*` siblings, gets classified as `browser` class and routed out unscored by BOTH benchmark modes, regardless of content (this is an existing ID-prefix classification rule in the harness, not a defect in the new scenario). Since neither automated mode actually dispatch-tested the new routing logic end-to-end, a direct call to `router-replay.cjs`'s exported `routeSkillResources()` function was used as a more rigorous, definitive check — after discovering the correct parameter name is `taskText`, not `task` (an initial call with the wrong parameter silently returned empty intents for every prompt, which would have been a false negative if not caught). With the correct call, two independent Open Design phrasings both correctly resolved to `design-mcp-open-design`, and three spot-checked design-mode prompts (interface, audit, motion) resolved correctly and unaffected.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extend `AI-001` with a probe row rather than a new `AI-004` scenario | `AI-001` already tests "does the advisor correctly route every mode," which is exactly what a 6th mode needs verified — adding a near-duplicate scenario would fragment the same check across two files |
| Only add coverage to Mode Routing and Advisor Integration categories | The transport mode isn't a design-judgment mode, so concepts specific to the other 6 categories (procedure cards, transform-verb framing, shared reference base consumption, md-generator's specific pipeline) don't apply to it — forcing coverage there would test nothing real |
| Use a direct `router-replay.cjs` call instead of trusting the benchmark's "PASS" verdict alone | The live-mode benchmark's aggregate PASS didn't actually exercise `MR-007`'s specific claim (browser-class scenarios are skipped in both modes); a stronger, independent verification was needed to actually confirm the new vocabulary routes correctly and doesn't collide with the existing 5 modes |
| Leave `MR-002`/`MR-003`/`MR-004` at 50/100 or unscored in prior live-mode baselines uninvestigated | Out of scope for this phase — those scores are pre-existing browser-harness-availability artifacts (no `bdg` in this environment) unrelated to the transport-mode integration this phase is about |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Router-mode benchmark | PASS, aggregate 100/100, scenario count 24 -> 25, D5 connectivity 100/100 |
| Live-mode benchmark | PASS, aggregate 93/100, 25 scenarios (19 passed, 6 browser-routed including MR-007) |
| Direct `router-replay.cjs` spot-check | "Wire Open Design MCP server..." and "Connect open design and let me use the od cli." both correctly resolve `intents: ["design-mcp-open-design"]`; "less generic... visual direction" -> `interface`, "WCAG contrast... design slop" -> `audit`, "transition choreography... reduced-motion" -> `motion`, all unaffected by the new registry entry |
| JSON parse (`description.json`, `graph-metadata.json`) | PASS, 0 errors |
| Grep sweep for stale "five modes" | 0 unqualified hits remaining in sk-design's own live docs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The automated benchmark harness does not independently dispatch each `AI-001` probe row.** `AI-001`'s scenario record shows it derives one representative/generic prompt per scenario rather than iterating its probe table — `P6`'s primary value is completing the MANUAL testing contract (per the playbook's own "EXECUTION POLICY": manual execution is the validation source), not automated per-probe scoring. The direct `router-replay.cjs` spot-check is what actually confirms P6's underlying claim.
2. **`MR-007` remains permanently unscored by both automated benchmark modes**, exactly like its 6 `MR-*` siblings — the harness classifies every `MR-*` scenario as `browser` class regardless of content, needing the `bdg` browser-debug tool this environment doesn't have. This is pre-existing behavior, not something this phase introduced or could resolve within its scope.
3. **No new playbook categories added** (Transform Verb Framing, md-generator Pipeline, Shared Reference Base, Parity Behavior, Fallback and Resilience, Hub Manager Intake all remain five-mode-only) — deliberately out of scope, since those categories test concepts specific to design-judgment modes that don't apply to a transport packet.
<!-- /ANCHOR:limitations -->
