---
title: "Implementation Summary"
description: "Ran 6 sequential real opencode-run dispatches (FR-001-audit, FR-002-motion, HM-001..HM-004) against the sk-design skill and graded each strictly against its scenario file's own Pass/Fail Criteria. Verdicts: 4 PASS, 1 FAIL, 1 PARTIAL."
trigger_phrases:
  - "implementation"
  - "summary"
  - "wave 009 implementation summary"
  - "fallback hub intake dispatch summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/009-fallback-and-hub-intake"
    last_updated_at: "2026-07-07T17:45:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run generate-description.js, backfill-graph-metadata.js, validate.sh --strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "dispatch-log.md"
      - "/tmp/skd-FR001-audit-response.jsonl"
      - "/tmp/skd-FR002-motion-response.jsonl"
      - "/tmp/skd-HM001-response.jsonl"
      - "/tmp/skd-HM002-response.jsonl"
      - "/tmp/skd-HM003-response.jsonl"
      - "/tmp/skd-HM004-response.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-009-fallback-hub-intake"
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
| **Spec Folder** | 009-fallback-and-hub-intake |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Executed the 6 dispatches assigned to this wave — `FR-001`'s `audit` variant, `FR-002`'s `motion` variant, and `HM-001` through `HM-004` — one at a time via the validated dispatch recipe (deterministic advisor probe, then a real `opencode run --model openai/gpt-5.5-fast --variant medium --format json` orchestrator call with the standard evaluation addendum). Captured full JSON-lines transcripts for all 6 and graded each strictly against its scenario file's own Pass/Fail Criteria section.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/009-fallback-and-hub-intake/{spec,plan,tasks,checklist,implementation-summary,dispatch-log}.md` | Created | This wave's Level 2 spec-folder documentation |
| `/tmp/skd-FR001-audit-response.jsonl`, `/tmp/skd-FR002-motion-response.jsonl`, `/tmp/skd-HM001-response.jsonl`, `/tmp/skd-HM002-response.jsonl`, `/tmp/skd-HM003-response.jsonl`, `/tmp/skd-HM004-response.jsonl` | Created | Full JSON-lines transcripts, one per dispatch |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read all 6 constituent scenario files in full before dispatching. For `FR-001-audit`, the scenario file (`no-card-matches-fallback.md`) supplies an exact prompt only for the `foundations` variant; the `audit` variant is described solely by its expected fallback-line text (`Procedure applied: none - baseline audit workflow`). Authored a narrow-advisory `audit`-mode prompt following the same structural pattern (mode-hint prefix, single-property advisory question, explicit "state whether a procedure card applies" instruction), deliberately steering clear of every `design-audit` procedure-card trigger word so the no-card path is genuinely exercised rather than accidentally short-circuited into `accessibility_audit.md` or `ai_slop_check.md`. This authored-not-quoted status is flagged explicitly in `dispatch-log.md`, matching the same authored-to-pattern treatment the task brief described for wave 008's `interface`/`motion` FR-001 variants.

For each dispatch, ran the deterministic `skill_advisor.py --threshold 0.8` probe first and recorded the observed top-1 skill + confidence, then ran the real dispatch with `timeout 300 opencode run ... </dev/null`, redirecting JSON-lines stdout to a capture file. The NO_TARGET_CLAUSE was applied only to `FR-001-audit` (references a hypothetical "this settings screen") and `FR-002-motion` (references a hypothetical "this toolbar") — both name a hypothetical local UI target with no real file in the repo. It was omitted for all four `HM-*` dispatches per the recipe's own explicit example category ("hub-intake premise questions").

The standalone advisor probe was notably unstable across the session — the native advisor daemon intermittently reported unavailable, falling back to a keyword-heavy local scorer that occasionally surfaced off-target top-1 skills (`sk-code` for `HM-001`, `mcp-figma` for `HM-003`, `memory:save`/`system-spec-kit` for `FR-002-motion`'s first probe run, an empty result on a retry). Rather than reword scenario-exact prompts to chase a cleaner probe score (which would have violated the "use the CLEAN scenario prompt" instruction for the two dispatches with a scenario-supplied exact prompt), these results were recorded as observed. The real dispatch's own internal `advisor_recommend` tool call — visible inside each transcript — is the signal actually used for grading wherever a scenario's criteria reference advisor confidence (`HM-004` explicitly requires `sk-design` top-1 at `>= 0.80`; the transcript's internal call showed `0.82`).

`HM-004`'s dispatch encountered a live, running Open Design MCP daemon (the task brief flagged a possible SKIP/timeout as an equally valid outcome, but that branch did not occur). The model correctly sequenced the pairing (`design-mcp-open-design` + `sk-design` + `design-interface` + `design-foundations` loaded, a Linear-grounded design read produced) before firing the mutating `open-design_start_run` call, and created a real project (`linear-grounded-settings-page`) plus started a real generation run (`b8362f10-b306-4254-83d7-2bfc343183dc`). Graded strictly against the scenario's own criteria, this earned PARTIAL rather than full PASS: the pairing order and advisor-confidence conditions were met, but the visible plan text never explicitly named/cited the hub's `Transports and Consumers` rule or the packet's `MANDATORY PAIRING` banner — those strings appear only inside the loaded `SKILL.md` file content returned by the `skill` tool call, not in the model's own narrated `text`-type output, confirmed by grepping the transcript's text parts in isolation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Author `FR-001-audit`'s prompt to avoid every `design-audit` procedure-card trigger word, rather than reuse language close to the accessibility/polish triggers | The scenario is specifically a negative control for the no-card path; a prompt that accidentally matched `accessibility_audit.md` or `ai_slop_check.md` would test the wrong thing |
| Do not reword `FR-002-motion`/`HM-*`'s scenario-exact prompts to improve their standalone advisor-probe scores | The recipe requires the CLEAN scenario prompt for the probe step; the probe is a documentation signal, not the graded artifact — the real dispatch's internal routing is what the scenario criteria actually test |
| Apply the NO_TARGET_CLAUSE only to `FR-001-audit` and `FR-002-motion` | Both reference a hypothetical local UI surface ("this settings screen", "this toolbar"); all four `HM-*` prompts are explicitly named as "hub-intake premise questions" in the recipe's own empty-clause example list |
| Grade `HM-004` as PARTIAL rather than PASS despite correct pairing/ordering | The Pass/Fail Criteria's citation clause ("citing both the hub's `Transports and Consumers` rule and the packet's `MANDATORY PAIRING` banner") is a distinct, unmet AND-condition — the model's own narrated text never names either contract element, even though its tool-call sequence behaviorally complied with the pairing rule |
| Grade `HM-001` as FAIL | The response declared "Route selected: `sk-design` bundle, ordered as `audit -> interface -> foundations -> motion-if-needed`" and only requested screenshots/deck/URL afterward, inverting the required "surface intake before routing" order and never labeling goal/surface/inputs/constraints/proof by name |
| Document `HM-004`'s real external side effect rather than omit it | The dispatch created a real Open Design project and started a real generation run against a live daemon; CLAUDE.md's "name what still speaks the old contract" / "no result-hiding" discipline applies even though this session did not initiate the mutating call directly |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Dispatch | Verdict | Key Evidence |
|----------|---------|---------------|
| `FR-001-audit` | PASS | Response text: `"Procedure applied: none - baseline audit workflow. This is a narrow visual-hierarchy judgment, not an accessibility, AI-slop, or full polish-gate procedure-card case."`; only `sk-design` and `design-audit` packets loaded |
| `FR-002-motion` | PASS | `"Tool Boundary: Used current-session direct execution only. No subagents, no repo target search, no file edits, no Bash..."`; selected card `procedures/interaction_states_pass.md`; reduced-motion table + proof line present |
| `HM-001` | FAIL | `"Route selected: sk-design bundle, ordered as audit -> interface -> foundations -> motion-if-needed."` stated before the asset request, inverting "intake before routing" |
| `HM-002` | PASS | `"Design Route"` block (selected bundle, context loaded, design moves, proof required, handoff target `sk-code`) appears before the `"Visual Direction"` substantive recommendation section |
| `HM-003` | PASS | `"Ready claim paused... Missing proof field: AUDIT EVIDENCE.rendered UI: confirmed"`; Figma export explicitly treated as non-acceptance evidence; `design-audit` loaded for the gating |
| `HM-004` | PARTIAL | Advisor `0.82` (`>=0.80` met); bundle `design-mcp-open-design` + `sk-design` + `design-interface` + `design-foundations`; design-read critique text precedes `open-design_start_run` in transcript order; but `Transports and Consumers`/`MANDATORY PAIRING` never named in the model's own narrated text (confirmed absent from all `type:"text"` parts via grep) |

**Result**: 4 PASS, 1 FAIL, 1 PARTIAL across 6 dispatches.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`HM-004` left a real, unreversed side effect in the live Open Design environment.** Project `linear-grounded-settings-page` (design system `linear-app`) and run `b8362f10-b306-4254-83d7-2bfc343183dc` were created/started by the dispatched model, not by this documentation session directly. Cleanup (deleting the project) is an operator decision, not made here — flagged in `spec.md` Open Questions.
2. **Standalone `skill_advisor.py` probe results were unstable across the session** (native daemon intermittently reported unavailable, local fallback scorer occasionally off-target). Recorded as observed per dispatch in `dispatch-log.md`; did not affect grading, since the scenarios' own criteria are graded against the real dispatch's internal routing/behavior, not the standalone probe.
3. **`FR-001-audit`'s exact prompt text is authored, not scenario-verbatim**, since the scenario file only supplies the `foundations` variant's exact prompt. Flagged explicitly in both `spec.md` and `dispatch-log.md`; the authored prompt was independently verified against `design-audit/SKILL.md`'s real procedure-card trigger table before dispatching.
4. **`HM-001`'s FAIL verdict is specific to this one dispatch's ordering**, not a claim that the hub never performs correct intake — `HM-002` and `HM-003` (same hub, same session type, different prompts) both correctly sequenced their required behaviors before substantive output.
<!-- /ANCHOR:limitations -->
