---
title: "Implementation Summary"
description: "Real cli-opencode dispatch of MR-001, MR-002, MR-003, MR-004, MR-006 against openai/gpt-5.5-fast --variant medium, graded against each scenario's own Pass/Fail Criteria. Result: 4 PASS, 1 PARTIAL (MR-004's advisor-tier discrepancy)."
trigger_phrases:
  - "implementation"
  - "summary"
  - "wave 001 implementation summary"
  - "mode routing core dispatch summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/001-mode-routing-core"
    last_updated_at: "2026-07-07T17:25:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run validate.sh --strict, report verdicts to the phase-parent orchestrator"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "dispatch-log.md"
      - "/tmp/skd-MR001-response.jsonl"
      - "/tmp/skd-MR002-response.jsonl"
      - "/tmp/skd-MR003-response.jsonl"
      - "/tmp/skd-MR004-response.jsonl"
      - "/tmp/skd-MR006-response.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mode-routing-core-001"
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
| **Spec Folder** | 001-mode-routing-core |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Ran the phase-parent's validated 4-step Gate-3-bypass dispatch recipe for real, one dispatch at a time, against the 5 scenarios assigned to this wave: `MR-001` (interface), `MR-002` (foundations), `MR-003` (motion), `MR-004` (audit), `MR-006` (motion mode-hint override). For each: an independent advisor probe (`skill_advisor.py --threshold 0.8`) against the clean exact prompt, then a real `opencode run --model openai/gpt-5.5-fast --variant medium` dispatch with the standalone-evaluation dispatch-note addendum, then a strict grade against that scenario file's own `### Pass/Fail Criteria` section.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `dispatch-log.md` | Created | This wave's Level-2 spec-folder documentation |
| `/tmp/skd-MR001-response.jsonl` .. `/tmp/skd-MR006-response.jsonl` | Created | Raw JSON-lines transcripts of the 5 real dispatches (evidence, not repo-tracked) |

No file under `.opencode/skills/sk-design/` was modified — every dispatch was read-only against the live skill tree, confirmed by a scoped `git status --porcelain` after the wave.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read all 5 assigned scenario files in full first (never paraphrased from memory), plus the sibling `022-benchmark-rerun-and-coverage-fill/` docs as the exact structural template for this folder's frontmatter, anchors, and section shape.

Dispatched strictly sequentially. Each real `opencode run` call's full JSON-lines stdout was parsed programmatically (not read as prose) to extract every `tool_use` part's tool name and input (`skill` calls, `read` calls with file paths) and every `text` part, so the resolved mode, packet load, and resource citations could be verified against raw tool-call evidence rather than trusted from the model's own summary. For scenarios where the model invoked the `skill` tool, the full `<skill_content>` blob returned inline was substring-searched for every resource path the scenario file names as "expected," since a packet's own `RESOURCE_MAP`/`ON_DEMAND` section can cite a resource without a separate `read` call ever touching it individually — this caught full resource-path coverage in `MR-002` and `MR-004` that a naive tool-call-count check would have missed.

`MR-004` surfaced a genuine, reproducible finding: the deterministic advisor probe scored `sk-code` as top-1 (0.872) ahead of `sk-design` (0.8486, still above the 0.80 threshold but not first) for the exact prompt "Audit this checkout UI for WCAG contrast, keyboard focus, responsive issues, and design slop." — reproduced identically on a second run. The live orchestrator dispatch, however, never even queried this ambiguity: it skipped its own internal advisor tool and the `sk-design` parent-hub skill call entirely, jumping straight to `design-audit`, and still produced a findings-first, evidence-boundary-respecting audit report (P1/P2/P3 severities, explicit "illustrative... not confirmed defects" framing) with zero mutating tool calls. The scenario's Pass/Fail Criteria is a strict AND across 4 conditions ("advisor top-1 is `sk-design`, resolved mode is `audit`, packet is `design-audit/SKILL.md`, and the response is findings-first..."); since the advisor-top-1 conjunct failed while the other three held, this was graded `PARTIAL` rather than smoothed into a `PASS` or forced into a `FAIL` (the scenario's own FAIL triggers — `interface` starts redesigning, `foundations` starts token authoring, mutating tools used — none of those occurred either).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Apply the no-target clause to all 5 dispatches | Every one of the 5 assigned prompts names a hypothetical local UI surface (pricing page, dashboard, command menu, checkout UI, menu) that doesn't exist in this repo, matching the recipe's own decision rule exactly; none targets a live URL, a seeded fixture, or a non-UI request |
| Verify resource citation via substring search of the returned `<skill_content>` blob, not just separate `read` tool calls | Several scenarios (`MR-002`, `MR-004`) satisfied "resources loaded or cited" through the packet's own inline `RESOURCE_MAP`, and a tool-call-count-only check would have under-reported real coverage |
| Grade MR-004 as `PARTIAL`, not `PASS` or `FAIL` | The scenario's Pass/Fail Criteria is a strict AND-conjunction for PASS and a narrow, distinct set of triggers for FAIL; the actual result satisfies neither definition cleanly, and forcing it into either would misrepresent a genuine, reproducible advisor-tier finding |
| Re-run the MR-004 advisor probe a second time before accepting the result | Confirmed the `sk-code`-over-`sk-design` ordering was deterministic (identical scores both runs), not run-to-run noise, before treating it as a real finding worth citing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| MR-001 (Interface Mode Routing) | `PASS` — advisor `sk-design` 0.95; mode `interface`; `design-interface/SKILL.md` loaded; all 4 mode + 2 shared resources cited; read-only |
| MR-002 (Foundations Mode Routing) | `PASS` — advisor `sk-design` 0.9441; mode `foundations`; `design-foundations/SKILL.md` loaded; color/type/layout/token resources all cited; read-only |
| MR-003 (Motion Mode Routing) | `PASS` — advisor `sk-design` 0.9404; mode `motion`; `design-motion/SKILL.md` loaded; motion-decision + reduced-motion resources loaded; read-only |
| MR-004 (Audit Mode Routing) | `PARTIAL` — advisor top-1 was `sk-code` 0.872 (not `sk-design`); mode/packet/response-shape otherwise all correct; read-only |
| MR-006 (Mode Hint Override to Motion) | `PASS` — advisor `sk-design` 0.82; mode `motion` despite `bolder` wording; `design-motion/SKILL.md` loaded; motion-strategy + decision-framework resources loaded; read-only |
| Mutating-tool check (all 5) | Zero `Write`/`Edit`/`Bash` calls across all 5 transcripts |
| Repo-mutation check | `git status --porcelain` on `.opencode/skills/sk-design/` clean after the wave |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **MR-004's advisor-tier discrepancy is a real, reproducible signal, not resolved by this wave.** The deterministic `skill_advisor.py` probe ranks `sk-code` ahead of `sk-design` for an audit prompt that combines "checkout UI," "WCAG contrast," and "keyboard focus" wording that also strongly matches `sk-code`'s code-review surface. Phase 022 already authored `AI-004` specifically to test the `audit`-vs-`sk-code`-`code-review` sibling-collision boundary from the opposite direction; this wave's `MR-004` result is independent evidence of the same underlying overlap and is worth flagging to whoever owns advisor-scorer tuning, but fixing it is out of scope for this wave (execution + grading only, per the phase-parent's own Out-of-Scope statement).
2. **The live orchestrator skipped its own internal advisor and the `sk-design` parent-hub `skill` call for both MR-004 and MR-006**, jumping directly to the target mode's packet skill (`design-audit`, `design-motion`). Both still resolved to the scenario-correct mode and packet, so this did not affect either verdict, but it means the model's actual routing path for these two dispatches didn't visibly exercise the documented hub-router vocabulary-matching step the scenario's own "Why" section describes — only its outcome.
3. **This wave records findings only; it does not remediate them.** Per the phase-parent `spec.md`'s Out-of-Scope statement, any follow-up on the MR-004 advisor-tier gap is a decision for the user to make after reviewing the parent's `verdict-matrix.md` once all 10 waves complete.
<!-- /ANCHOR:limitations -->
