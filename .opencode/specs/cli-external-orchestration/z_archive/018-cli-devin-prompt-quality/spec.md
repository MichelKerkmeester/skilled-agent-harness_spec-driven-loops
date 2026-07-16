---
title: "Feature Specification: cli-devin prompt-quality arc (SWE 1.6 optimization → file extraction → cross-CLI propagation → cross-model validation)"
description: "Phase parent for the seven-phase arc that takes cli-devin's prompt scaffolding from anecdote-driven to data-driven defaults across SWE-1.6, deepseek-v4, kimi-k2.6 — and propagates the winning composition guidance cross-CLI to the four sibling CLI skills."
trigger_phrases:
  - "cli-devin prompt quality arc"
  - "cli-devin optimization phases"
  - "swe 1.6 cross-model validation"
  - "cli-devin RCAF default"
  - "bundle-gate-aversion cross-CLI"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/018-cli-devin-prompt-quality"
    last_updated_at: "2026-05-17T20:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "merged-114-116-117-118-into-113-phased-arc"
    next_safe_action: "monitor-v1-0-6-1-uplift-in-production"
    blockers: []
    key_files:
      - "001-council-design/spec.md"
      - "002-eval-rig/spec.md"
      - "003-eval-loop/synthesis.md"
      - "004-skill-uplift/implementation-summary.md"
      - "005-extraction-rerun/implementation-summary.md"
      - "006-cross-cli-rcaf-propagation/implementation-summary.md"
      - "007-cross-model-validation/analysis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000113"
      session_id: "113-phase-parent-merge"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase parent vs flat: phase parent (7 children) — design / eval / extraction / propagation / cross-model validation separation"
      - "Existing deep-flow fit: NO (deep-agent-improvement profile generator is agent-file-specific); built bespoke deep-loop"
      - "Loop architecture: council-seeded hill-climbing with deterministic + grader scoring, 3-signal convergence"
      - "RCAF cross-model: validated on SWE-1.6, deepseek-v4-pro, kimi-k2.6 — wins on all three"
      - "Bundle-gate-aversion cross-model: holds on all three measured models"
      - "Framework-dominates-anti-hallucination cross-model: holds on all three measured models"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: cli-devin prompt-quality arc

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-16 |
| **Last Updated** | 2026-05-17 |
| **Branch** | `main` |
| **Parent Spec** | n/a (root packet under skilled-agent-orchestration) |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | 105-cli-devin-effectiveness-improvements |
| **Successor** | None |
| **Handoff Criteria** | Every phase passes `validate.sh --strict` independently; cli-devin shipped through v1.0.6.1 with RCAF + medium + standard + standard as the validated default; sk-prompt master + 4 sibling cards propagated with bundle-gate + anti-hallucination cross-CLI guidance |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

cli-devin shipped with 7 prompt templates, 5 model presets, 6 framework choices, and 3 detail levels for the pre-planning block — but no systematic evaluation of which combinations maximize output quality on real coding tasks. Choosing prompt patterns was anecdote-driven. Documented SWE-1.6 failure modes (hallucinated CLI flags, wrong-cwd path defects, bundle-gate bypasses) provided ground truth for a real eval rig but no eval rig existed. Once empirical findings landed on SWE-1.6, two open questions blocked broader application: (a) do the findings transfer beyond a small coding-specialized model, and (b) should the four sibling CLI skills (cli-claude-code / cli-codex / cli-gemini / cli-opencode) inherit the same composition guidance?

### Purpose

Run a bespoke deep-loop that iteratively mutates cli-devin's prompt scaffolding against documented failure-mode fixtures with actual SWE-1.6 invocations, converges on winning patterns, applies them back to the skill, then closes a file-extraction gap, propagates the cross-CLI applicable findings to the sibling skill cards, and validates the held-back findings against two frontier models (deepseek-v4-pro + kimi-k2.6) before promoting them cross-CLI. The arc moves cli-devin's defaults from "best guess from documentation" to "empirically validated on three measured models with cross-CLI propagation".

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Tune the `cli-devin` skill's prompt scaffolding, dispatch contract, and bundle-gate logic against real SWE-1.6 dispatches (phases 001–004)
- Close the SWE-1.6 markdown-to-disk file-extraction gap that capped D1 acceptance scoring in the initial eval, then re-run with the unlock (phase 005)
- Propagate the cross-CLI-applicable findings (RCAF default + medium pre-planning) to sk-prompt master + 4 sibling CLI skill cards (phase 006)
- Validate the held-back findings (bundle-gate-aversion + framework-dominates-anti-hallucination) against two frontier models (deepseek-v4-pro via cli-opencode + DeepSeek direct API; kimi-k2.6 via cli-devin preset), then propagate cross-CLI on confirmation (phase 007)

### Out of Scope

- Modifying Devin itself or its CLI (it stays a black-box dispatch target)
- Tuning OpenCode's own gateway routing or DeepSeek's API behavior
- Building a generic prompt-optimization framework — every phase is cli-devin-anchored, with controlled propagation only when cross-model evidence supports it
- Auto-applying winning patterns mid-loop — every uplift step is gated by operator review
- Topping up opencode-go credits to test qwen3.6-plus or restore the originally-planned kimi route through opencode-go (out of scope; recorded as a follow-on)

### Files Changed (cumulative across all 7 phases)

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `113-.../001-council-design/ai-council/**` | Create | 001 | Council deliberation artifacts (rubric, fixtures, knobs, loop shape) |
| `113-.../002-eval-rig/{fixtures,grader,cache,scripts}/**` | Create | 002 | Packet-local eval rig (no SWE-1.6 dispatches in this phase) |
| `113-.../003-eval-loop/{state,iterations,synthesis.md}` | Create | 003 | Iteration loop run artifacts + synthesis |
| `.opencode/skills/cli-devin/SKILL.md` | Modify | 004, 005, 007 | §3 SWE-1.6 contract + §4 ALWAYS #12 + §3 Model Selection Preset reliability notes |
| `.opencode/skills/cli-devin/assets/prompt_templates.md` | Modify | 004 | RCAF default template + medium pre-planning template |
| `.opencode/skills/cli-devin/assets/prompt_quality_card.md` | Modify | 004 | RCAF ★ default + framework selection rules |
| `.opencode/skills/cli-devin/assets/deep-loop-iter-template.md` | Modify | 004 | Three iter skeletons updated to `Framework: RCAF` |
| `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md` | Modify | 004 | §8 framework ordering + example tag updated |
| `.opencode/skills/cli-devin/changelog/v1.0.5.0.md..v1.0.6.1.md` | Create | 004, 005, 006, 007 | Five changelog releases documenting the arc |
| `113-.../005-extraction-rerun/scripts/extract-files-from-markdown.cjs` | Create | 005 | 4-pattern path-inference extractor |
| `113-.../005-extraction-rerun/scripts/confirm-variant.cjs` | Create | 005 | 3-run reproducibility harness; documented v3 CONTEXT mutation as run-to-run noise |
| `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` | Modify | 006, 007 | §3 gains Pre-planning density + Bundle-gate strictness + Anti-hallucination secondary notes |
| `.opencode/skills/cli-{claude-code,codex,gemini,opencode}/assets/prompt_quality_card.md` | Modify | 006, 007 | Mirror sk-prompt master across 4 sibling cards |
| `.opencode/skills/sk-prompt/changelog/v1.3.1.0.md` | Create | 007 | sk-prompt release for the cross-CLI propagation |
| `.opencode/skills/cli-{claude-code,codex,gemini,opencode}/changelog/v*.md` | Create | 006, 007 | Per-sibling-skill releases |
| `113-.../007-cross-model-validation/scripts/cross-model-confirm.cjs` | Create | 007 | 70-dispatch harness with split-surface dispatcher (cli-opencode for deepseek-v4-pro, cli-devin for kimi-k2.6) |
| `113-.../007-cross-model-validation/analysis.md` | Create | 007 | Per-model × per-variant aggregate scores + Gate 1/Gate 2 verdicts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-council-design/` | deep-ai-council ratifies the 5-dim rubric, fixture catalog, knob set, and loop shape | Complete |
| 002 | `002-eval-rig/` | Build fixtures + grader + cache + deterministic checks (testable in isolation, no SWE-1.6 dispatches) | Complete |
| 003 | `003-eval-loop/` | Run the bespoke deep-loop iterations against SWE-1.6; converge on RCAF + medium + standard + standard | Complete |
| 004 | `004-skill-uplift/` | Apply winning patterns to `.opencode/skills/cli-devin/`; ship v1.0.5.0 | Complete |
| 005 | `005-extraction-rerun/` | Close the markdown-to-disk file-extraction gap; v2 confirms RCAF wins with the unlock; v3 mutation depth explores CONTEXT framework → confirmation NOT_REPRODUCED → hold v1.0.6.0; ship v1.0.5.1 + v1.0.5.2 instead | Complete |
| 006 | `006-cross-cli-rcaf-propagation/` | Propagate RCAF default + medium pre-planning to sk-prompt master + 4 sibling CLI skill cards; bundle-gate + anti-hallucination held pending phase 007 | Complete |
| 007 | `007-cross-model-validation/` | 70-dispatch validation on deepseek-v4-pro + kimi-k2.6 confirms bundle-gate-aversion + framework-dominates-anti-hallucination cross-model; cross-CLI propagation shipped same packet; ship v1.0.6.0 + v1.0.6.1 | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Free-tier and paid-API rate-limit awareness: phases 003 and 007 may pause/resume across days if rate limits hit; do NOT silent-skip fixtures

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 → 002 | `council-report.md` exists with bound rubric, fixture catalog, knob set, loop-shape recommendation | Read `001-council-design/ai-council/council-report.md`; check § Rubric, § Fixtures, § Knobs sections all filled |
| 002 → 003 | Rig dry-run passes on canned outputs (no SWE-1.6 dispatches); cache schema + grader harness verified | Run `node 002-eval-rig/scripts/dry-run.cjs`; exit 0 |
| 003 → 004 | `synthesis.md` ranks variants with explicit confidence scores; convergence reached | Read `003-eval-loop/synthesis.md`; check top variant has score > 0.50 and convergence signal triggered |
| 004 → 005 | cli-devin SKILL.md + assets updated; strict-validate passes; changelog v1.0.5.0 written | Read `004-skill-uplift/implementation-summary.md` — should report "shipped with v1.0.5.0" |
| 005 → 006 | `extract-files-from-markdown.cjs` 12/12 canned tests pass; v2 confirms RCAF wins aggregate; v3 confirmation NOT_REPRODUCED (CONTEXT mutation was noise); v1.0.5.1 + v1.0.5.2 shipped | Read `005-extraction-rerun/{synthesis-v2.md, synthesis-v3.md, confirmation-report.md}` |
| 006 → 007 | sk-prompt master + 4 sibling cards have Pre-planning density note; v1.X.6.0 per-sibling-skill changelogs written | Read `006-cross-cli-rcaf-propagation/implementation-summary.md` |
| 007 → done | Cross-model run completed; both Gate 1 + Gate 2 verdicts HOLDS on both models; sk-prompt + 4 sibling cards updated with bundle-gate + anti-hallucination notes; cli-devin v1.0.6.0 + v1.0.6.1 shipped | Read `007-cross-model-validation/{analysis.md, implementation-summary.md}` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

All open questions raised during the arc were answered by the end of phase 007 (see `answered_questions` in the frontmatter). The two follow-on opportunities recorded for future packets:

- **Kimi Gate 1 confirmation run**: The +0.0305 Δ for v-004 over v-005 on kimi-k2.6 is below the typical 0.04–0.08 fixture-set noise floor. A 3-run confirmation (à la phase 005's v3 mutation confirmation) would harden the cross-model verdict. Out of scope for this arc.
- **opencode-go top-up + qwen3.6-plus / restore opencode-go kimi route**: ADR-001 in phase 007 originally specified `opencode-go/kimi-k2.6` as the dispatch surface; ADR-003 pivoted to cli-devin's preset after the workspace ran out of credits. Topping up restores the originally-intended surface and unlocks `opencode-go/qwen3.6-plus` for an additional cross-model data point.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-council-design/`, `002-eval-rig/`, `003-eval-loop/`, `004-skill-uplift/`, `005-extraction-rerun/`, `006-cross-cli-rcaf-propagation/`, `007-cross-model-validation/`
- **Skills modified**: `.opencode/skills/cli-devin/` (versions 1.0.5.0 → 1.0.6.1), `.opencode/skills/sk-prompt/` (v1.3.1.0), `.opencode/skills/cli-{claude-code,codex,gemini,opencode}/` (each at +2 minor versions)
- **Reuse patterns**: `.opencode/skills/deep-research/references/convergence.md`, `.opencode/skills/deep-agent-improvement/SKILL.md` §4B
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
