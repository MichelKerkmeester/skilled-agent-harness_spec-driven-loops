---
title: "Implementation Summary: Phase 5: deep-ai-council Frontmatter Alignment"
description: "All 18 deep-ai-council reference/asset docs now conform to the canonical contract, including one net-new authored block and four tier promotions."
trigger_phrases:
  - "deep-ai-council frontmatter summary"
  - "council doc contract evidence"
  - "frontmatter alignment phase five"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/005-deep-ai-council"
    last_updated_at: "2026-06-11T09:45:08Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 18 docs conform and smoke passed"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/references/structure/output_schema.md"
      - ".opencode/skills/deep-ai-council/assets/prompt_pack_round.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-005-deep-ai-council"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-deep-ai-council |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

deep-ai-council's 18 reference and asset docs now carry exactly the canonical frontmatter contract, making the campaign's largest doc set so far fully valid routing signal for the advisor doc harvest. The phase exercised every drift class at once: enum normalization, missing-field backfill, net-new authoring, tier judgment, and phrase hygiene.

### Contract normalization

13 references carried the detailed block with `contextType: reference`, the same natural-but-wrong value the 008 pilot found. Each now declares `planning` (convergence rules, dispatch, failure handling, anti-patterns, seat diversity, scoring, loop protocol) or `implementation` (graph support, command wiring, findings registry, folder layout, output schema, state format) based on whether the doc governs how the council deliberates or how its artifacts persist. Four docs moved from `normal` to `important` tier: `depth_dispatch.md` (seat-dispatch and no-recursive-counciling invariants), `folder_layout.md` (mandatory packet-local artifact layout), `output_schema.md` (single source of truth for the persist-artifacts.cjs parser), and `state_format.md` (append-only JSONL event contract).

### Missing-field backfill and net-new authoring

`loop_protocol.md`, `quick_reference.md`, and both template assets carried only title, description, and trigger phrases; they gained `importance_tier`/`contextType`. `prompt_pack_round.md` had no frontmatter at all and received a full canonical block authored from its actual content (seat prompt slots, required sections, verdict footer).

### Phrase hygiene

Three trigger phrases were repaired to the lowercase multi-word rule: hyphenated single-token `two-of-three-agree` became `two of three agree`, and the uppercase `CLI`/`YAML` phrases were lowercased.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/convergence/{convergence_signals,deep_mode,failure_handling}.md` | Modified | contextType to `planning`; phrase fix in convergence_signals |
| `references/convergence/depth_dispatch.md` | Modified | contextType to `planning`; tier to `important` |
| `references/{patterns/anti_patterns,patterns/seat_diversity_patterns,scoring/scoring_rubric}.md` | Modified | contextType to `planning` |
| `references/integration/loop_protocol.md` | Modified | Added tier `normal` + contextType `planning` |
| `references/integration/quick_reference.md` | Modified | Added tier `normal` + contextType `general` (operator cheat sheet) |
| `references/{integration/graph_support,patterns/command_wiring,scoring/findings_registry}.md` | Modified | contextType to `implementation`; phrase fixes in graph_support and command_wiring |
| `references/structure/{folder_layout,output_schema,state_format}.md` | Modified | contextType to `implementation`; tier to `important` |
| `assets/{deep_ai_council_dashboard,deep_ai_council_strategy}.md` | Modified | Added tier `normal` + contextType `planning` |
| `assets/prompt_pack_round.md` | Modified | Net-new canonical frontmatter block authored |

All paths relative to `.opencode/skills/deep-ai-council/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Frontmatter-only in-place patches with assertion-guarded replacements scoped to the leading fence, verified by the contract checker in coverage mode, a `git diff -U0` hunk-header sweep, and a Python local-mode advisor smoke that needs no live daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split contextType between `planning` and `implementation` | deep-ai-council is a planning skill, but its structure/integration docs specify persistence machinery (parser contracts, JSONL formats, graph CLI), not deliberation rules. One blanket value would misdescribe half the set. |
| Tier `important` for four docs, not just the structure trio | `depth_dispatch.md` encodes the seat-dispatch and NDP no-recursive-counciling invariants, which meets the same formal-contract bar as the artifact-layout and parser contracts. Descriptive docs stay `normal` so the per-skill doc signal stays dampened. |
| `quick_reference.md` as `general` | It is an operator cheat sheet spanning the whole workflow rather than a planning rule or implementation contract. |
| Template assets as `planning` | The dashboard, strategy, and round prompt-pack templates are filled in during council planning runs; they are inputs to deliberation, not implementation machinery. |
| Smoke via Python local mode, not the live daemon | The live daemon adopts the doc-trigger flag only after a session cycle (packet 145 T025); the Python path reads the same files under the same flag and proves routing now. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-skill-doc-frontmatter.sh --skill deep-ai-council --coverage` | PASS — docs=18, carrying-detailed-block=18, violations=0 (baseline: 18 violations) |
| Python local-mode smoke ("council escape hatches and two of three agree", flag on) | PASS — deep-ai-council first at 0.95 with two `(signal)` doc matches |
| Python local-mode smoke ("council seat verdict and round prompt pack", flag on) | PASS with caveat — deep-ai-council surfaces at 0.86 with `!council seat verdict(signal)`; sk-prompt ranks first at 0.95 because the query contains "prompt" |
| Diff hygiene | PASS — `git diff -U0` hunk headers all inside leading fences across the 18 files |
| Live daemon `matchedDocs` smoke | DEFERRED — rides packet 145 T025 (session-cycle daemon adoption) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-daemon verification is campaign-level, not per-phase.** The running advisor daemon adopts `SPECKIT_ADVISOR_DOC_TRIGGERS` only after every advisor-attached session ends and a fresh session respawns it (tracked as packet 145 T025).
2. **Prompt-pack phrases compete with sk-prompt.** Queries that include the bare token "prompt" rank sk-prompt above deep-ai-council; the doc signal still surfaces the skill, and council-specific phrasing routes first.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
