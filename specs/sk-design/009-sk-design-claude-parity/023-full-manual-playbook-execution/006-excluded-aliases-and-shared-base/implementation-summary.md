---
title: "Implementation Summary"
description: "Executed and graded 5 manual-testing-playbook dispatches (TV-005, SR-002 3-probe battery, SR-003) against the live sk-design orchestrator via cli-opencode. All 5 verdicts: PASS."
trigger_phrases:
  - "implementation"
  - "summary"
  - "wave 006 implementation summary"
  - "excluded aliases shared base summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base"
    last_updated_at: "2026-07-07T15:35:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run generate-description.js + backfill-graph-metadata.js + validate.sh --strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "dispatch-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-006-excluded-aliases-shared-base"
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
| **Spec Folder** | 006-excluded-aliases-and-shared-base |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Executed this wave's 5 assigned manual-testing-playbook dispatches (`TV-005`, `SR-002-P1`, `SR-002-P2`, `SR-002-P3`, `SR-003`) against the live `sk-design` orchestrator via `cli-opencode`, using the validated 4-step dispatch recipe (advisor probe -> real orchestrator dispatch with addendum -> full JSON-lines transcript capture -> grading against the owning scenario's own Pass/Fail Criteria). All 5 dispatches ran sequentially, one at a time, per the wave instructions. Every dispatch graded `PASS`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/spec.md` | Created | This wave's specification |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/plan.md` | Created | Implementation plan |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/tasks.md` | Created | Task breakdown |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/checklist.md` | Created | Verification checklist |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/dispatch-log.md` | Created | Per-dispatch evidence table (5 rows) |
| `/tmp/skd-TV005-advisor.txt`, `/tmp/skd-TV005-response.jsonl` | Created | `TV-005` advisor probe + orchestrator transcript |
| `/tmp/skd-SR002-P1-advisor.txt`, `/tmp/skd-SR002-P1-response.jsonl` | Created | `SR-002-P1` advisor probe + orchestrator transcript |
| `/tmp/skd-SR002-P2-advisor.txt`, `/tmp/skd-SR002-P2-response.jsonl` | Created | `SR-002-P2` advisor probe + orchestrator transcript |
| `/tmp/skd-SR002-P3-advisor.txt`, `/tmp/skd-SR002-P3-response.jsonl` | Created | `SR-002-P3` advisor probe + orchestrator transcript |
| `/tmp/skd-SR003-advisor.txt`, `/tmp/skd-SR003-response.jsonl` | Created | `SR-003` advisor probe + orchestrator transcript |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read all 3 constituent scenario files in full first (`audit-excluded-aliases.md`, `reference-base-backend-modes.md`, `shared-base-not-workflow.md`) as ground truth for exact prompts, expected signals, and each one's own Pass/Fail Criteria section. Read `../../022-benchmark-rerun-and-coverage-fill/` as the exact structural template to mirror (frontmatter shape, `_memory.continuity` blocks, `<!-- SPECKIT_LEVEL -->`/`<!-- SPECKIT_TEMPLATE_SOURCE -->` markers, `ANCHOR` comments).

For each of the 5 dispatches, ran the deterministic advisor probe first with the byte-exact clean scenario prompt (no addendum), via `skill_advisor.py --threshold 0.8`. Then dispatched the real orchestrator (`opencode run --model openai/gpt-5.5-fast --variant medium --format json --dir <repo>`) with the same clean prompt plus the standard evaluation-call addendum, appending the non-empty no-target clause for `TV-005`/`SR-002-P1`/`SR-002-P2`/`SR-002-P3` (each names a hypothetical local UI surface — "this card", "this product dashboard", "this onboarding flow", "this page" — with no literal repo target) and the empty clause for `SR-003` (a hub-intake premise question about the shared reference base itself, naming no UI surface). Every dispatch command ended with `</dev/null` and ran to completion (all well under the 300s timeout) before the next one started, per the wave's one-at-a-time execution rule.

Parsed each JSON-lines transcript for `tool_use` events (confirming which skill/mode packets loaded and that only the read-only `skill` tool was called for the 4 doc-guidance dispatches — no `Write`/`Edit`/`Bash`) and `text` events (confirming the model's own stated mode resolution and the substance of its final answer). Graded each dispatch strictly against its owning scenario's own Pass/Fail Criteria section, citing the specific line.

Two dispatches (`TV-005`, `SR-002-P3`) showed a notable divergence: the standalone deterministic advisor script's own top-1 recommendation was `sk-code` (not `sk-design`), differing from each scenario's "Expected advisor behavior" prose. This did not change either verdict, because each scenario's actual Pass/Fail Criteria section grades the live orchestrator's mode resolution and packet loading, not the standalone script's confidence score — and in both cases the live orchestrator dispatch still correctly loaded `sk-design` and resolved the expected mode (`interface` for `TV-005`, `audit` for `SR-002-P3`). This is recorded as an observation in `dispatch-log.md`, not folded silently into the verdict.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Grade strictly against each scenario file's own Pass/Fail Criteria line, not the "Expected advisor behavior" prose | The task's own instructions require citing the specific criterion; the "Expected advisor behavior" section is explanatory context, while the Pass/Fail Criteria section is the actual grading contract for the live orchestrator dispatch |
| Record the advisor-vs-orchestrator divergence as an observation rather than silently omitting it | `TV-005` and `SR-002-P3` both showed the standalone deterministic script naming `sk-code` top-1, a real and reproducible signal worth surfacing for whoever later reviews the advisor scorer, even though it did not change either dispatch's verdict |
| Apply the no-target clause per-scenario by reading the scenario's own prompt text, not by a fixed default | `SR-003` is structurally different from the other 4 — it is a premise question about the shared reference base itself, not a request naming a hypothetical local UI surface, so it correctly received the empty clause per the recipe's own decision rule |
| Run all 5 dispatches strictly sequentially | Matches the wave's explicit instruction (one at a time, no backgrounding) and `cli-opencode`'s own single-dispatch-per-agent rule |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `TV-005` | `PASS` — resolved `interface`, loaded `design-interface/SKILL.md`, produced design guidance (no findings-first audit report), never routed to `audit` from `harden`/`polish` |
| `SR-002-P1` | `PASS` — resolved `foundations`, cited `shared/register.md`, tool surface was `skill` only |
| `SR-002-P2` | `PASS` — resolved `motion`, cited `shared/register.md`, tool surface was `skill` only |
| `SR-002-P3` | `PASS` — resolved `audit`, cited `shared/register.md`, tool surface was `skill` only |
| `SR-003` | `PASS` — no `workflowMode: shared` invented; shared reference base files (`register.md`, `context_loading_contract.md`, `anti_slop_principles.md`, `cognitive_laws.md`, `design_token_vocabulary.md`) were cited as reference-base examples within the resolved `audit` mode, not treated as a standalone workflow packet; the AI explicitly asked for the concrete target artifact before producing any findings |
| `validate.sh --strict` | See checklist/description-generation step below (Errors:0 target) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The deterministic advisor script diverged from `sk-design` top-1 on 2 of 5 dispatches** (`TV-005`, `SR-002-P3`), both returning `sk-code` instead. This is a real, reproducible signal about the standalone `skill_advisor.py` scorer's behavior on these specific prompts (both use audit-adjacent or evaluation-flavored vocabulary — "audit report", "audit ... findings" — that appears to pull toward `sk-code`'s code-review lane). It is out of scope for this wave to investigate or remediate; it is surfaced here and in `dispatch-log.md` as an observation for whoever later reviews advisor scorer behavior on design-family prompts.
2. **This wave does not roll up the parent `023-full-manual-playbook-execution` verdict matrix.** That aggregation (task `#56` in the tracking list) is owned by the orchestrating session after all 10 waves complete.
<!-- /ANCHOR:limitations -->
