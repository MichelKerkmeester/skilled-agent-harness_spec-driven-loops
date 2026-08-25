---
title: "Verification Checklist: Runtime Agent Gateway Alignment"
description: "QA verification that every affected deep-loop leaf agent records through the gateway, in all six runtimes, with no direct projection write."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-runtime-agent-gateway-alignment"
    last_updated_at: "2026-08-25T07:26:58Z"
    last_updated_by: "claude"
    recent_action: "Marked the QA checklist with cited evidence"
    next_safe_action: "Hold for the operator's commit/push instruction"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Runtime Agent Gateway Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Mark `[x]` only with cited evidence. A finding is a hypothesis until confirmed against the real symptom.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The misalignment is confirmed against the authoritative contract. [Evidence: `state-jsonl.md:38,51-55` ("written by calling the append gateway, not by writing to the file"); `deep-research-auto.yaml:100-105` (`append-gateway`, "never fall back to a direct file write"); `002-deep-research-enablement/implementation-summary.md:31` ("leaves write through the gateway").]
- [x] CHK-002 [P0] The doc-level guard fails on the current tree and names all 24 affected files. [Evidence: `checked=24 failing=24`, exit 2.]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] Each agent names its mode's gateway command with the exit-0/exit-2 contract. [Evidence: guard rule A pass; per-mode `--mode research|review|alignment|ai-council` present.]
- [x] CHK-004 [P0] `--event-json` names a single-record file, not the multi-line delta. [Evidence: guard rule D `checked=24 failing=0`; grep for `--event-json …deltas/` returns 0.]
- [x] CHK-005 [P0] Read references to `*-state.jsonl` and reducer references are preserved (no over-edit). [Evidence: sub-agent reports confirm dispatch-input/read-state references intact; `reduce-alignment-state.cjs` kept.]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] The guard passes across all six runtimes; zero stragglers. [Evidence: `checked=24 failing=0`, exit 0 (rules A–D).]
- [x] CHK-007 [P0] codex TOML integrity holds. [Evidence: all 4 `.codex/agents/*.toml` show exactly 2 triple-quote delimiters and 6 top-level keys (4/4 pass).]
- [x] CHK-008 [P0] `validate.sh --strict` exits 0. [Evidence: `validate.sh 013-runtime-agent-gateway-alignment --strict` exit 0, Errors: 0, Warnings: 0.]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-009 [P0] All four agents migrated in all six runtimes (`deep-research`, `deep-review`, `deep-alignment`, `ai-council`). [Evidence: guard `ok` on all 24 lines.]
- [x] CHK-010 [P0] The `deep-alignment` literal `printf >> …-state.jsonl` redirect is removed everywhere. [Evidence: grep for the redirect returns 0; guard raw-redirect rule clean.]
- [x] CHK-011 [P0] Residual direct-write prose and delta/payload conflation removed. [Evidence: 0 direct-write prose hits; the 4 remaining "event payload" hits are ai-council's `<event payload file>` placeholder, not a delta path.]

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-012 [P0] No secrets or credentials introduced; no `.sqlite`/`.jsonl` in the tracked diff. [Evidence: grep of tracked changes for `.sqlite`/`.jsonl` returns none.]

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-013 [P0] Spec docs authored and the `--event-json` correction recorded. [Evidence: `decision-record.md` Decision 5; `implementation-summary.md` "Correction made during verification".]

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-014 [P0] Scope diff = agent files + this spec folder; no runtime code / YAML / SKILL.md. [Evidence: 16 modified agent files (4 agents × `.claude`/`.opencode`/`.pi`/`.codex`; cursor+devin via symlink); grep for runtime/YAML/SKILL/ts/cjs in the diff returns none.]
- [x] CHK-015 [P0] `deep-improvement` left unchanged (proposal-only, out of scope). [Evidence: not present in `git status` modified set.]

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

The migration is complete across all six runtimes; the guard passes 24/24 (rules A–D) and `validate.sh --strict` exits 0 with no errors or warnings. All 15 checklist items are verified with evidence.

<!-- /ANCHOR:summary -->
