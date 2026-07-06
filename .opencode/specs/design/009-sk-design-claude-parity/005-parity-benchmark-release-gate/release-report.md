---
title: "Release Report: Phase 005 - Parity Benchmark Release Gate"
description: "Conditional release-gate report comparing the frozen sk-design baseline to the Phase 005 after-009 router-mode benchmark run and listing live/manual gaps requiring operator execution."
trigger_phrases:
  - "phase 005 release report"
  - "after-009 benchmark comparison"
  - "conditional parity verdict"
  - "operator live-mode review"
importance_tier: "high"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/005-parity-benchmark-release-gate"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Recorded conditional Phase 005 release-gate evidence."
    next_safe_action: "Operator runs live/browser/manual scenarios before any ready verdict."
---
# Release Report: Phase 005 - Parity Benchmark Release Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: release-report | v1 -->

---

<!-- ANCHOR:verdict -->
## 1. VERDICT

| Field | Value |
|-------|-------|
| **Verdict** | CONDITIONAL |
| **Release-ready?** | No |
| **Release / threshold authority** | Repository owner, delegated to this session for the automated gate record |
| **Reason** | Router-mode benchmark passes the deterministic replay gate with no D5 or tool-surface failures, but live/manual/browser-mode design usefulness and reviewer lanes were not run in this automated pass. |
| **Required next action** | Operator must execute live/browser/manual scenarios and record design-quality verdicts before a READY claim. |
<!-- /ANCHOR:verdict -->

---

<!-- ANCHOR:baseline-comparison -->
## 2. BASELINE-TO-CURRENT COMPARISON

| Metric | Baseline | Current after-009 | Delta | Evidence |
|--------|----------|-------------------|-------|----------|
| Artifact | `benchmark/baseline/skill-benchmark-report.json` | `benchmark/after-009/report.json` | Append-only current run; baseline preserved | Files read after rerun |
| Trace mode | router | router | No mode change | `report.md` line 3 |
| Verdict | CONDITIONAL | CONDITIONAL | No verdict change | Baseline report line 5; after-009 report line 5 |
| Aggregate | 69/100 | 69/100 | 0 | Baseline report line 5; after-009 report line 5 |
| Scenario count | 21 | 24 | +3 parity-behavior scenarios | Baseline report line 79; after-009 report line 85 |
| Scored text/advisor scenarios | 15 | 18 | +3 | Baseline report line 9; after-009 report line 9 |
| Browser/live routed out | 6 | 6 | 0; still requires live mode | Baseline report lines 42-47; after-009 report lines 42-47 |
| D1 intra | 100/100 | 100/100 | 0 | after-009 report line 17 |
| D2 discovery | 100/100 | 100/100 | 0 | after-009 report line 18 |
| D3 efficiency | 0/100 | 0/100 | 0; router-mode measurement gap | after-009 report line 19 |
| D4 usefulness | unscored-mode-a | unscored-mode-a | No live usefulness evidence collected | after-009 report lines 20 and 23 |
| D5 connectivity | 100/100 | 100/100 | 0; hard gate passed | after-009 report line 21 |
| Harness funnel | 15 passed | 18 passed | +3 passed replay scenarios | after-009 report line 32 |

Benchmark command executed in this pass:

```bash
node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill .opencode/skills/sk-design --outputs-dir .opencode/skills/sk-design/benchmark/after-009 --trace-mode router --output .opencode/skills/sk-design/benchmark/after-009/report.json
```

Observed output:

```text
skill-benchmark: sk-design verdict=CONDITIONAL aggregate=69 scenarios=24
report.json -> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/benchmark/after-009/report.json
report.md   -> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/benchmark/after-009/report.md
node  --skill .opencode/skills/sk-design --outputs-dir  --trace-mode router    0.03s user 0.01s system 102% cpu 0.040 total
```

Runtime note: the second router-mode rerun was measured with shell `time` and completed in `0.040 total`. Reviewer time for this automated pass is `0 minutes` because the live/manual reviewer lanes were intentionally not executed by this dispatch; operator live-lane execution must record elapsed reviewer time per scenario before any READY verdict.
<!-- /ANCHOR:baseline-comparison -->

---

<!-- ANCHOR:scenario-evidence -->
## 3. SCENARIO EVIDENCE

| Scenario | Lane | Automated Router-Mode Result | Live/Manual Status | Evidence |
|----------|------|------------------------------|--------------------|----------|
| PB-001 | Procedure-selection proof | Passed replay; `workflowMode: interface`, aliases `less generic` and `sk-design`, packet `design-interface` | Not run in this pass, requires operator execution | `benchmark/after-009/report.json` lines 1850-1868; `manual_testing_playbook/06--parity-behavior/procedure-selection-proof.md` |
| PB-002 | Context and proof gates | Passed replay; `workflowMode: foundations`, alias `hierarchy`, packet `design-foundations` | Not run in this pass, requires operator execution | `benchmark/after-009/report.json` lines 1953-1970; `manual_testing_playbook/06--parity-behavior/context-proof-gates.md` |
| PB-003 | md-generator preservation confirmation | Passed replay; `workflowMode: md-generator`, alias `design.md`, backend `playwright-extract`, packet `design-md-generator` | Not run in this pass, requires operator execution for live extraction | `benchmark/after-009/report.json` lines 2055-2071; `manual_testing_playbook/06--parity-behavior/md-generator-preservation-confirmation.md` |
| MR-001..MR-006 | Browser/live mode routing | Routed out by router harness | Not run in this pass, requires operator execution | `benchmark/after-009/report.md` lines 42-47 |
<!-- /ANCHOR:scenario-evidence -->

---

<!-- ANCHOR:lane-verdicts -->
## 4. LANE VERDICTS

| Lane | Verdict | Evidence | Release Impact |
|------|---------|----------|----------------|
| Baseline discipline | PASS | Baseline remained under `benchmark/baseline/`; new run wrote only `benchmark/after-009/`. | Supports no-regression comparison for router mode. |
| Router/advisor replay | PASS for router-mode replay | 18 scored scenarios passed; no ranked bottlenecks; no D5 hard-gate failure. | Supports conditional release evidence only. |
| Procedure-selection proof | CONDITIONAL | PB-001 replay route passed; manual response proof not run. | Blocks READY until operator captures response evidence. |
| Context/proof gates | CONDITIONAL | PB-002 replay route passed; manual response proof not run. | Blocks READY until operator captures confirmed/inferred/proof-gap evidence. |
| Design quality: anti-slop, accessibility, hierarchy, interaction, polish, usefulness | CONDITIONAL | D4 remains unscored in router mode; no live/manual reviewer notes collected. | Blocks READY. |
| md-generator preservation | CONDITIONAL | PB-003 replay route reached `md-generator` with `playwright-extract`; live extraction not run. | Blocks READY until sandbox extraction is executed or explicitly accepted by owner. |
| Negative controls | CONDITIONAL | Existing replay scenarios still pass; live false-positive behavior not run. | Blocks READY until operator verifies live negative controls. |
| Security / boundary | PASS for automated artifacts | No secrets or private prompts added; read-only modes remain documented as read-only; md-generator is the only mutating mode. | Supports conditional release evidence. |
<!-- /ANCHOR:lane-verdicts -->

---

<!-- ANCHOR:gaps -->
## 5. EVIDENCE GAPS AND OPERATOR ACTIONS

| Gap | Status | Required Operator Evidence |
|-----|--------|----------------------------|
| MR browser-class scenarios | Not run in this pass, requires operator execution | Live/browser-mode evidence for MR-001 through MR-006. |
| D1-inter advisor behavior | Not scored in router mode | Live advisor or configured advisor probe evidence. |
| D4 usefulness and task outcome | Not scored in router mode | Live skill-on/off or reviewer usefulness evidence. |
| Manual parity feel | Not run in this pass, requires operator execution | Reviewer notes for PB-001, PB-002, PB-003 and any selected MR/MG/SR critical scenarios. |
| md-generator live extraction | Not run in this pass, requires operator execution | Sandbox `/tmp/skd-PB003/` output or explicit owner decision not to run extraction. |
| Anti-slop/accessibility/hierarchy/interaction/polish lanes | Not run in this pass, requires operator execution | Design reviewer verdicts with pass/fail rationale. |
<!-- /ANCHOR:gaps -->

---

<!-- ANCHOR:scope-note -->
## 6. SCOPE AND WORKTREE NOTE

`git status --short` before this doc reconciliation showed pre-existing changed and untracked files outside the Phase 005 allowed write paths, including sk-design hub/mode files, procedure-card directories, Phase 003/004 docs, and unrelated system-code-graph/spec-memory files. This Phase 005 pass did not edit or revert those paths. The automated benchmark rerun touched only `benchmark/after-009/report.json` and `benchmark/after-009/report.md`; the documentation reconciliation is scoped to this Phase 005 folder.
<!-- /ANCHOR:scope-note -->

---

<!-- ANCHOR:authority -->
## 7. RELEASE AUTHORITY DECISION

The repository owner delegated release/threshold authority to this session for the automated Phase 005 gate record. The decision recorded here is:

- The current release verdict is **CONDITIONAL**, not READY.
- The frozen baseline under `benchmark/baseline/` remains authoritative and was not overwritten.
- The `after-009` router-mode run is accepted as the current automated comparison artifact.
- Live/manual/browser-mode lanes remain release-blocking until an operator executes them or the repository owner records a separate accepted-risk decision.
<!-- /ANCHOR:authority -->

---

<!-- ANCHOR:rollback-correction -->
## 8. ROLLBACK AND CORRECTION PROCEDURE

If an `after-009` benchmark artifact is later found to be malformed, incomplete, or based on the wrong corpus, the correction path is:

1. Stop any release-ready claim that cites the bad artifact.
2. Preserve the bad `benchmark/after-009/` artifact for audit rather than overwriting the frozen baseline.
3. Rerun the canonical router-mode benchmark into the approved append-only current-run location or a newly named sibling run folder if the repository owner wants to keep both current attempts side by side.
4. Update this release report with the bad-artifact finding, corrected artifact path, benchmark command output, and release-owner decision.
5. Rerun strict Phase 005 validation after metadata regeneration before making any completion claim.

Rollback boundary: `benchmark/baseline/` is not part of this rollback path and must remain untouched unless the repository owner records explicit baseline overwrite authority.
<!-- /ANCHOR:rollback-correction -->
