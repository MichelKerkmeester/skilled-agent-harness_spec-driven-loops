---
title: "Feature Specification: Wave 010 - md-generator Serial Pipeline Dispatches"
description: "Executes 9 real, mutation-capable md-generator dispatches (MR-005, AI-001-P5, PB-003, MG-001..MG-004, FR-001-md-generator, FR-002-md-generator) one at a time in strict order, capturing full transcripts and grading each against its scenario file's own Pass/Fail Criteria."
trigger_phrases:
  - "wave 010 md-generator serial pipeline"
  - "sk-design manual playbook wave 010"
  - "MR-005 AI-001-P5 PB-003 MG-001 MG-002 MG-003 MG-004 FR-001-md-generator FR-002-md-generator"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/010-md-generator-serial-pipeline"
    last_updated_at: "2026-07-07T18:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md, dispatch-log.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-010-md-generator-serial"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Wave 010 - md-generator Serial Pipeline Dispatches

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `md-generator` mode is the only `sk-design` mode with `mutatesWorkspace: true` and `Write`/`Edit`/`Bash` tool access, so its manual-testing-playbook scenarios (mode routing, positive advisor control P5, parity preservation, the full four-scenario `04--md-generator-pipeline/` set, and both md-generator variants of the fallback-and-resilience negative controls) had never been run through a real `opencode run` dispatch that actually performs a live URL crawl and writes files. Because every dispatch in this wave can write real files (repo-root, `/tmp` sandboxes, and the model's own approved `/var/.../T/skd-*` extraction sandbox), the 9 dispatches had to run strictly one at a time in a fixed order — never parallel — so that a fixture pair produced by one dispatch (`MG-001`) could be deterministically copied forward as seed input for two downstream dispatches (`MG-002`, `MG-003`).

### Purpose

Execute the 9 assigned dispatches in the mandated strict serial order using the validated dispatch recipe (deterministic advisor probe, then a real `opencode run` orchestrator call with the standard evaluation addendum), capture full JSON-lines transcripts, run a mandatory `git status --porcelain` check after every dispatch that could write outside its own `/tmp` sandbox, and grade each dispatch strictly against its scenario file's own Pass/Fail Criteria section — never a generic bar. Real, unexpected side effects (a live extraction writing outside its assigned sandbox) are surfaced as findings, not silently cleaned up.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read all 9 constituent scenario files across `01--mode-routing/`, `02--advisor-integration/`, `06--parity-behavior/`, `04--md-generator-pipeline/`, and `07--fallback-and-resilience/` in full before dispatching.
- Run the advisor probe (`skill_advisor.py --threshold 0.8`) for each dispatch's clean exact prompt and record top-1 skill + confidence, including recording native-daemon-unavailable fallback-scorer noise as observed, not corrected.
- Run the real orchestrator dispatch (`opencode run --model openai/gpt-5.5-fast --variant medium --format json`) for each of the 9 assigned dispatch IDs in the mandated strict order, one at a time, never parallel.
- After every dispatch capable of a repo-root or non-sandbox write (`MR-005`, `AI-001-P5`), run `git status --porcelain` and record the output verbatim in `dispatch-log.md`, without silently cleaning up any leaked artifact.
- Run the coordinator checkpoint (`mkdir` + `cp` from `/tmp/skd-MG001/` into `/tmp/skd-MG002/` and `/tmp/skd-MG003/`) as a plain Bash step, not a dispatch, verifying the real output paths before copying.
- Author `FR-001`'s `md-generator` variant prompt (no exact prompt supplied by the scenario file for this variant) following the file's own structural pattern, deliberately avoiding both the router's `INTENT_SIGNALS` keywords and the private extraction procedure-card trigger words.
- Lightly author `FR-002`'s `md-generator` variant prompt by substituting concrete already-seeded `/tmp/skd-MG003/` fixture paths for the scenario file's generic `this DESIGN.md`/`tokens.json` phrasing.
- Capture full JSON-lines stdout under `/tmp/skd-<dispatch-id>-response.jsonl` for each dispatch.
- Grade each dispatch PASS / PARTIAL / FAIL / SKIP strictly against its scenario file's own Pass/Fail Criteria, citing the specific criterion line.
- Author this Level 2 spec-folder documentation plus a `dispatch-log.md` at the folder root.

### Out of Scope

- The other 46 parallel dispatches across waves `001-mode-routing-core` through `009-fallback-and-hub-intake` — owned by those sibling wave folders.
- Any edits to `manual_testing_playbook.md`, any `SKILL.md`, `mode-registry.json`, or `hub-router.json` — this wave is execution/grading only, no playbook or registry authoring.
- Cleanup of the real, untracked `DESIGN.md` written to the repo root by `AI-001-P5`'s dispatch, or the empty `design-extracts/example-com/` directory left by its first (timed-out) attempt — both are flagged as findings for operator awareness and decision, not silently removed by this session.
- Fixing the router precedence gap surfaced by `MG-004` (brief-only prompts resolving to `foundations` instead of staying inside `md-generator`'s own CONDITIONAL authoring-boundary gate) — that is a remediation-packet decision, not this wave's job.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/010-md-generator-serial-pipeline/{spec,plan,tasks,checklist,implementation-summary,dispatch-log}.md` | Create | This wave's Level 2 spec-folder documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 9 assigned dispatches executed strictly one at a time, in the mandated order | 9 full JSON-lines transcripts captured under `/tmp/skd-<id>-response.jsonl`, no two dispatches run concurrently |
| REQ-002 | Every verdict traces to the scenario file's own Pass/Fail Criteria line | `dispatch-log.md` cites the exact criterion for each of the 9 verdicts |
| REQ-003 | Mandatory `git status --porcelain` check run and recorded after `MR-005` and `AI-001-P5` | Output captured verbatim in `dispatch-log.md`; any leaked `DESIGN.md`/`tokens.json` outside `/tmp/` flagged, not cleaned up |
| REQ-004 | Coordinator checkpoint verified against MG-001's real output paths before copying | `dispatch-log.md` records the actual paths found and any deviation from the assumed `/tmp/skd-MG001/{DESIGN.md,tokens.json}` shape |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `FR-001-md-generator`'s and `FR-002-md-generator`'s authored/lightly-authored prompts are explicitly flagged, not presented as scenario-verbatim | Noted in both `spec.md` scope and `dispatch-log.md` |
| REQ-006 | Real, unexpected side effects (the repo-root `DESIGN.md` leak) are surfaced, not hidden | Documented in `implementation-summary.md` Known Limitations with exact file path, size, and timestamp |
| REQ-007 | Standalone advisor-probe instability and any internal-vs-standalone advisor disagreement (e.g. `sk-doc` outranking `sk-design` on `MG-002`/`MG-003`) is recorded, not silently normalized away | Noted per dispatch in `dispatch-log.md` and summarized in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the 9 assigned dispatches, **Then** each has a captured transcript and a verdict citing the scenario file's own Pass/Fail Criteria.
- **SC-002**: **Given** the strict-order/no-parallelism constraint, **Then** the coordinator checkpoint (fixture copy from `MG-001` into `MG-002`/`MG-003`) only ran after `MG-001`'s real dispatch completed and its actual output paths were verified.
- **SC-003**: **Given** `AI-001-P5`'s dispatch wrote a real `DESIGN.md` to the repo root, **Then** that side effect is documented with exact evidence (path, size, git status), not silently omitted or cleaned up.
- **SC-004**: **Given** `MG-004` is a negative control asserting no file should be written, **Then** the dispatch's actual mode resolution, resource citations, and token-labeling are graded against the scenario's own FAIL triggers, independent of whether a file was written.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `AI-001-P5`'s first attempt timed out at 300s (backend `npm install` + Chromium download were needed) and left an empty `design-extracts/example-com/` directory at repo root before self-correcting to the sandbox path | Low (empty dir, no tracked content) | Retried with a longer timeout (580s) per the recipe's "300s+" allowance; documented the leftover empty directory as a minor side effect rather than deleting it |
| Risk | `AI-001-P5`'s successful retry wrote a real, untracked `DESIGN.md` (8295 bytes) to the repo root instead of confining output to a sandbox, because the scenario's own prompt does not specify an explicit output path | Medium | Confirmed via `git status --porcelain` immediately after the dispatch per the coordinator's mandatory check; left in place and flagged prominently rather than cleaned up, per explicit task instruction |
| Risk | `MG-002` and `MG-003`'s internal `advisor_recommend` calls both ranked `sk-doc` ahead of `sk-design` (0.87 vs 0.82), even though the model still correctly resolved and executed `md-generator`'s `VALIDATE`/`REPORT` phases | Low | Graded PARTIAL against each scenario's own "advisor top-1 is sk-design" AND-condition rather than silently excusing the miss because behavior was otherwise correct |
| Risk | `MG-004` resolved to `foundations` instead of `md-generator`, never citing `authoring_boundary.md`/`source_of_truth_router_card.md`, and presented brief values as unlabeled CSS custom-property tokens | High (real router-precedence gap) | Graded FAIL against the scenario's own explicit FAIL triggers; flagged as a genuine remediation-worthy finding, not smoothed over |
| Dependency | Real, live `opencode run` executor (`openai/gpt-5.5-fast`) plus a working `design-md-generator` Playwright backend against `https://example.com` | All 5 live-extraction dispatches (`MR-005`, `AI-001-P5`, `PB-003`, `MG-001`) completed extraction successfully within the extended timeout | None — all completed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to remove the real, untracked `DESIGN.md` at the repo root and the empty `design-extracts/example-com/` directory left by `AI-001-P5`'s dispatch is an operator decision, not made in this phase.
- Whether the `MG-004` router-precedence gap (brief-only prompts falling through to `foundations` instead of staying inside `md-generator`'s CONDITIONAL authoring-boundary check) warrants a remediation packet is an operator decision, flagged here for triage.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The dispatch recipe (deterministic advisor probe -> real orchestrator dispatch with standard addendum -> transcript capture -> criteria-cited grading) used here is the same recipe used across all `023-full-manual-playbook-execution` waves, keeping grading methodology consistent across the full 55-dispatch run.
- **NFR-M02**: This wave's strict-serial constraint (unique to `010` among the 10 wave folders) is documented in `plan.md` Architecture so any re-run understands why these 9 dispatches cannot be parallelized like the other 46.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- `MG-001`'s dispatch (and `MR-005`, `PB-003`, `AI-001-P5`'s successful retry) each attempted a direct `extract.ts --output` write to the user-requested path first, had it refused by the extractor's own sandbox guard (`.opencode/specs` or `/var/.../T/skd-*` only), then self-corrected to the approved sandbox and copied/wrote the final artifacts to the requested location — a consistent, expected two-hop pattern across every live-extraction dispatch in this wave, not a failure.
- `MG-002` and `MG-003` both show the hub's internal advisor ranking `sk-doc` ahead of `sk-design` for validation/report requests against existing `/tmp` artifact pairs, yet the model's own subsequent routing correctly loaded and executed `design-md-generator`'s `VALIDATE`/`REPORT` phase resources exactly as the scenario's own "Expected mode resources loaded or cited" list specifies — a genuine advisor-ranking anomaly that did not propagate into a routing failure.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 9 real, mutation-capable dispatches run strictly serially, one coordinator fixture-checkpoint step, two authored/lightly-authored prompts, no source-code or playbook edits |
| Risk | 12/25 | Live extraction + real file writes on every dispatch; one dispatch leaked a real file to the repo root; one dispatch surfaced a genuine router-precedence defect |
| Research | 8/20 | Required reading 9 scenario files plus the md-generator `SKILL.md`'s router pseudocode, resource-loading table, and phase-detection keywords in depth to author two clean prompts and grade precisely |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None — see section 7.

---

## RELATED DOCUMENTS

- **Sibling waves**: `../008-parity-proof-and-fallback-start/` (FR-001's `interface`/`motion` variants), `../009-fallback-and-hub-intake/` (FR-001's `audit` variant, FR-002's `motion` variant)
- **Precedent**: `../../022-benchmark-rerun-and-coverage-fill/` (Level 2 documentation shape this wave mirrors), `../009-fallback-and-hub-intake/` (same-wave-family strict-serial dispatch recipe precedent)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Per-dispatch log**: See `dispatch-log.md`
