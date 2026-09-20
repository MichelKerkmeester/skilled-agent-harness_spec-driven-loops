---
title: "Implementation Summary"
description: "Ran 9 strictly-sequential real opencode-run dispatches (MR-005, AI-001-P5, PB-003, MG-001..MG-004, FR-001-md-generator, FR-002-md-generator) against sk-design's md-generator mode and graded each strictly against its scenario file's own Pass/Fail Criteria. Verdicts: 4 PASS, 3 PARTIAL, 1 FAIL. Surfaced a real repo-root file leak and a genuine router-precedence gap."
trigger_phrases:
  - "implementation"
  - "summary"
  - "wave 010 implementation summary"
  - "md-generator serial pipeline dispatch summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/010-md-generator-serial-pipeline"
    last_updated_at: "2026-07-07T18:40:00.000Z"
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
      - "/tmp/skd-MR005-response.jsonl"
      - "/tmp/skd-AI001-P5-response.jsonl"
      - "/tmp/skd-PB003-response.jsonl"
      - "/tmp/skd-MG001-response.jsonl"
      - "/tmp/skd-MG002-response.jsonl"
      - "/tmp/skd-MG003-response.jsonl"
      - "/tmp/skd-MG004-response.jsonl"
      - "/tmp/skd-FR001-md-generator-response.jsonl"
      - "/tmp/skd-FR002-md-generator-response.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-010-md-generator-serial"
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
| **Spec Folder** | 010-md-generator-serial-pipeline |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Executed the 9 dispatches assigned to this wave — `MR-005`, `AI-001-P5`, `PB-003`, `MG-001` through `MG-004`, `FR-001-md-generator`, `FR-002-md-generator` — strictly one at a time in the mandated order (this is the one wave among the 10 in this packet where every dispatch can write real files, so parallelism was structurally forbidden), plus a plain-Bash coordinator checkpoint that copied `MG-001`'s real extraction output forward to seed `MG-002` and `MG-003`. Captured full JSON-lines transcripts for all 9 and graded each strictly against its scenario file's own Pass/Fail Criteria section. Ran a mandatory `git status --porcelain` check after `MR-005` and `AI-001-P5` (the two dispatches with no pinned sandbox output path) to catch any write escaping outside `/tmp/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/010-md-generator-serial-pipeline/{spec,plan,tasks,checklist,implementation-summary,dispatch-log}.md` | Created | This wave's Level 2 spec-folder documentation |
| `/tmp/skd-MR005-response.jsonl`, `/tmp/skd-AI001-P5-response.jsonl`, `/tmp/skd-PB003-response.jsonl`, `/tmp/skd-MG001-response.jsonl`, `/tmp/skd-MG002-response.jsonl`, `/tmp/skd-MG003-response.jsonl`, `/tmp/skd-MG004-response.jsonl`, `/tmp/skd-FR001-md-generator-response.jsonl`, `/tmp/skd-FR002-md-generator-response.jsonl` | Created | Full JSON-lines transcripts, one per dispatch |
| `/tmp/skd-MR005/`, `/tmp/skd-PB003/`, `/tmp/skd-MG001/`, `/tmp/skd-MG002/`, `/tmp/skd-MG003/` | Created (by the dispatched model / coordinator checkpoint) | Real live-extraction/validation/report sandbox artifacts |
| `DESIGN.md` (repo root, untracked) | Created (by `AI-001-P5`'s dispatched model, not by this session directly) | **Unintended side effect — see Known Limitations** |
| `design-extracts/example-com/` (repo root, untracked, empty) | Created (by `AI-001-P5`'s timed-out first attempt) | **Unintended side effect — see Known Limitations** |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read all 9 constituent scenario files in full before dispatching, plus `design-md-generator/SKILL.md`'s Smart Router Pseudocode, `INTENT_SIGNALS` keyword table, `RESOURCE_MAP`, and Resource Loading Levels table to author two clean prompts and grade phase/resource claims precisely. Ran the 4 real-extraction dispatches (`MR-005`, `AI-001-P5`, `PB-003`, `MG-001`) first, in that order, then the plain-Bash coordinator checkpoint, then the two fixture-consuming dispatches (`MG-002`, `MG-003`), then the negative control (`MG-004`), then the two fallback-and-resilience variants (`FR-001-md-generator`, `FR-002-md-generator`) — matching the task's mandated strict order exactly.

`AI-001-P5`'s first attempt hit the 300s timeout wall because the backend's `npm install && npx playwright install chromium` had not yet run warm in this session; it was killed by `timeout 300` (exit 124) after leaving an empty, untracked `design-extracts/example-com/` directory at repo root (created before the model's own transcript showed it self-correcting toward the approved sandbox). Retried at `timeout 580` per the recipe's explicit "300s+" allowance — the retry completed, but because the scenario's own exact prompt (`Extract design tokens from https://example.com and generate DESIGN.md.`) never specifies an output path, the model reasoned "no workspace `DESIGN.md` exists outside bundled examples, so I'll write the requested artifact at repo root as `DESIGN.md`" and did exactly that via `apply_patch`. The mandatory `git status --porcelain` check immediately after the dispatch caught this (`?? DESIGN.md`, 8295 bytes, untracked). Per the coordinator's explicit instruction, this was documented in full — not silently cleaned up.

For every live-extraction dispatch that requested a specific output path (`MR-005`'s implicit default, `AI-001-P5`, `PB-003`, `MG-001`), the extractor's own sandbox guard refused the first direct-output attempt (`.opencode/specs` or the approved `/var/.../T/skd-*` prefix only) and the model consistently self-corrected: ran the crawl into the approved sandbox, then copied or wrote the final artifacts to the requested location. This two-hop pattern is expected, packet-documented behavior (`design_system_extraction.md`'s sandbox guard), verified consistent across all 4 dispatches that hit it — not treated as a defect.

`MG-002` and `MG-003` both surfaced the same advisor-ranking anomaly: their internal `advisor_recommend` calls ranked `sk-doc` ahead of `sk-design` (0.87-0.88 vs 0.82) for validation/report requests against existing `/tmp` artifact pairs. In both cases the model's own narrated text explicitly flagged the tie/near-tie and then correctly resolved the substantive work to `sk-design`/`md-generator`, loading exactly the resource set each scenario's own "Expected mode resources loaded or cited" list specifies and running the correct real backend scripts. Because each scenario's own PASS criterion is an explicit AND that includes "advisor top-1 is `sk-design`," and that specific sub-condition was not met even though overall routing intent and execution were correct, both were graded PARTIAL rather than PASS — consistent with how wave 009's `HM-004` was graded PARTIAL over an analogous unmet literal-citation AND-condition despite correct underlying behavior.

`MG-004`'s dispatch surfaced a more serious, genuine finding: contrary to the scenario's own explicit "Expected mode resolution: md-generator" and its cited router-contract reasoning, the real dispatch resolved to `foundations` directly and never loaded `design-md-generator/SKILL.md` at all — so `references/authoring_boundary.md` and `assets/source_of_truth_router_card.md` (the two resources the scenario's PASS criterion requires to be cited) were never read or cited. The resulting brief-derived document presented every brief value (`#1a73e8`, `Inter`, `8px`, `12px`) as an unlabeled, definitive CSS custom-property token throughout a full Foundations-style token system, with only a generic disclaimer at the very end — matching two of the scenario's own explicit FAIL triggers independently. No file was actually written to disk (confirmed no `Write`/`apply_patch`/`Bash`-write call anywhere in the transcript), so the defect is a routing/citation/labeling gap, not a filesystem fabrication — but it is a real router-precedence issue worth remediation-packet triage, not smoothed over.

For `FR-001-md-generator`, the scenario file (`no-card-matches-fallback.md`) supplies an exact prompt only for the `foundations` variant; authored a narrow doc-structure advisory prompt for the `md-generator` variant, cross-checked word-by-word against every `INTENT_SIGNALS` keyword and the private procedure-card trigger list before dispatching, to guarantee the no-card path was genuinely exercised rather than accidentally short-circuited into the extraction procedure card. The dispatch correctly determined no procedure card applied and gave a genuinely useful advisory answer grounded in the real format-spec references — but the stated fallback line ("`Procedure applied: none - baseline md-generator format guidance`") deviated from the packet's own canonical text ("`Procedure applied: none - baseline md-generator pipeline`," confirmed at `SKILL.md` line 240), so this was graded PARTIAL against FR-001's "states the exact no-card fallback line" PASS requirement rather than full PASS.

For `FR-002-md-generator`, the scenario's own `md-generator variant` text uses generic `this DESIGN.md`/`tokens.json` phrasing with no path; lightly authored by substituting the already-seeded `/tmp/skd-MG003/` fixture paths (produced earlier in this same wave) for that generic phrasing, keeping every other word verbatim. The dispatch executed directly with no subagent dispatch, under its normal `Bash`-capable backend boundary, and named all three required elements (backend entrypoint, provenance proof, validation result) under dedicated headers in its final response — a clean PASS.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retry `AI-001-P5` at `timeout 580` after its first attempt hit the 300s wall | The recipe explicitly allows "300s+"; the partial transcript showed real progress (routing, extraction underway) blocked only by a cold `npm install`, not a genuine failure |
| Document, not clean up, `AI-001-P5`'s repo-root `DESIGN.md` leak and the leftover `design-extracts/example-com/` directory | Explicit coordinator instruction: "if any untracked DESIGN.md/tokens.json appears OUTSIDE /tmp/, that is a real finding: note it, do not silently clean it up yourself" |
| Grade `AI-001-P5` PASS on its own narrow advisor/mode/packet criteria while separately flagging the repo-root leak | AI-001's own Pass/Fail Criteria tests advisor routing and mode/packet resolution only; it does not test output-write-location discipline (that is PB-003's and MG-001's domain) — conflating the two would misapply a criterion the scenario never states |
| Grade `MG-002`/`MG-003` PARTIAL despite fully correct mode/packet/phase execution | Each scenario's PASS criterion is an explicit AND that names "advisor top-1 is `sk-design`" as a distinct sub-condition; the internal `advisor_recommend` call's own top-1 was `sk-doc` in both cases — a real, unmet AND-condition, not excused by otherwise-correct behavior, consistent with wave 009's `HM-004` grading precedent |
| Grade `MG-001` PASS rather than PARTIAL despite not spelling out the bare word "VALIDATE" as a standalone label | Consistent with how `MR-005` (same wording style, same softer "names the extract-write-validate pipeline" bar) was graded — the response identifies all three stages via their canonical backend scripts and outcomes in the correct order, which satisfies the intent of "naming the pipeline" even without an ALLCAPS bare-word label |
| Grade `MG-004` FAIL | Directly contradicts the scenario's own "Expected mode resolution: md-generator," never cites either required authoring-boundary resource, and presents brief values as unlabeled definitive tokens — matches two explicit, independent FAIL triggers |
| Grade `FR-001-md-generator` PARTIAL over a one-word deviation ("format guidance" vs "pipeline") | FR-001's PASS criterion explicitly requires "the exact no-card fallback line"; the packet's own `SKILL.md` states a specific canonical string, and the dispatch's actual text diverges from it — a real, citable gap even though all substantive behavior was correct |
| Author `FR-001-md-generator`'s prompt to avoid every `INTENT_SIGNALS` keyword and every private procedure-card trigger word, including avoiding the literal string "DESIGN.md" (a listed extraction procedure-card trigger) and "reference"/"generate" (listed router-intent keywords) | The scenario is specifically a negative control for the no-card path; a prompt that accidentally matched any router intent or the extraction procedure card would test the wrong thing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Dispatch | Verdict | Key Evidence |
|----------|---------|---------------|
| `MR-005` | PASS | Advisor `0.8932`; `"Selected mode: md-generator"`; `playwright-extract` named; `validate.ts` PASS `97/100`; no leak outside `/var/folders` sandbox |
| `AI-001-P5` | PASS (routing) + flagged finding | Advisor `0.9238` internal; mode/packet correct; **but** `git status --porcelain` showed `?? DESIGN.md` (8295 bytes) written to repo root on the retry |
| `PB-003` | PASS | Advisor `0.8591`; `"Confirmed mode boundary: md-generator is the only sk-design mode allowed to write output"`; artifacts at `/tmp/skd-PB003/` |
| `MG-001` | PASS | Advisor `0.8702`; EXTRACT->WRITE->VALIDATE performed and named via canonical scripts, in order; `validate.ts` PASS `98/100`; writes confined to `/tmp/skd-MG001/` |
| `MG-002` | PARTIAL | Internal advisor: `sk-doc 0.876` top-1, `sk-design 0.82` second — unmet AND-condition; `VALIDATE` phase + `validate.ts` (PASS `98/100`) otherwise fully correct |
| `MG-003` | PARTIAL | Same advisor-ranking miss (`sk-doc 0.870` vs `sk-design 0.82`); `VALIDATE`+`REPORT`/preview otherwise fully correct, sandbox-confined |
| `MG-004` | FAIL | Resolved `foundations`, not `md-generator`; `design-md-generator/SKILL.md` never loaded; brief values unlabeled in a full CSS-token document |
| `FR-001-md-generator` | PARTIAL | Correct no-card determination, but stated `"baseline md-generator format guidance"` instead of the packet's canonical `"baseline md-generator pipeline"` |
| `FR-002-md-generator` | PASS | `"Backend Entrypoint"`/`"Provenance Proof"`/`"Validation Result"` all explicitly named; no subagent dispatch; normal `Bash`-capable boundary preserved |

**Result**: 4 PASS, 3 PARTIAL, 1 FAIL across 9 dispatches (one PASS carries a flagged, non-criteria-affecting side-effect finding).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`AI-001-P5`'s dispatch left a real, untracked `DESIGN.md` (8295 bytes) at the repo root**, created by the dispatched model's `apply_patch` call, not by this documentation session directly. Confirmed via `git status --porcelain` (`?? DESIGN.md`) and direct file read immediately after the dispatch. The content is a legitimate measured Style Reference for `example.com` — the defect is purely the unsandboxed write location, traceable to the scenario's own prompt never specifying an output path. Left in place, not cleaned up, per explicit task instruction; cleanup is an operator decision.
2. **The same dispatch's timed-out first attempt (300s) left an empty, untracked `design-extracts/example-com/` directory at repo root**, created before the model self-corrected to the sandbox path. Also left in place, documented rather than removed.
3. **`MG-004` surfaced a genuine router-precedence gap**: a brief-only `DESIGN.md style reference` request with no live site should, per the scenario's own cited contract, stay inside `md-generator`'s own CONDITIONAL authoring-boundary gate (citing `references/authoring_boundary.md`/`assets/source_of_truth_router_card.md`) rather than falling through to `foundations` pre-routing. The real dispatch fell through to `foundations` directly and never loaded the md-generator packet at all. No file was written (confirmed structurally, not just by absence), so this is a routing/citation defect rather than a fabrication incident — but it is a real, remediation-worthy finding, not a documentation nit. Flagged in `spec.md` Open Questions for operator triage.
4. **`MG-002` and `MG-003` both show the hub's internal advisor consistently ranking `sk-doc` ahead of `sk-design`** for validation/report requests against an existing `/tmp` `DESIGN.md`+`tokens.json` pair (0.87-0.88 vs 0.82 in both cases). This did not propagate into a routing failure — the model's own subsequent reasoning correctly resolved and executed `md-generator`'s `VALIDATE`/`REPORT` phases in both cases — but it is a real, reproducible advisor-scoring pattern worth noting for the advisor-tuning workstream (`goal_packet-024-sk-code-advisor-routing.md`'s sibling scorer work), since `DESIGN.md` fidelity/report language apparently reads as strongly "documentation-shaped" to the shared scorer.
5. **Standalone `skill_advisor.py` probe results were noisy/unstable across this session** (native daemon intermittently unavailable, local fallback scorer producing multi-way ties on `PB-003` and an empty result on `FR-002-md-generator`). Recorded as observed per dispatch in `dispatch-log.md`; did not affect grading, since each scenario's own criteria are graded against the real dispatch's internal routing/behavior, not the standalone probe.
6. **`FR-001-md-generator`'s and `FR-002-md-generator`'s exact prompt text is authored/lightly-authored, not scenario-verbatim**, since the scenario file supplies either no exact prompt (`FR-001`'s `md-generator` variant) or only generic, path-free phrasing (`FR-002`'s `md-generator` variant). Both flagged explicitly in `spec.md`, `plan.md`, and `dispatch-log.md`.
<!-- /ANCHOR:limitations -->
