---
title: "Review Report: feature catalog anchor deprecation track"
description: "Synthesized verdict of a 5-iteration deep review over the 8 commits main..HEAD: PASS with five confirmed P2 advisories, all documentation or record gaps."
trigger_phrases:
  - "feature catalog anchor deprecation review report"
importance_tier: "normal"
contextType: "review"
---
# Review Report: feature catalog anchor deprecation track

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 0, P2 5
- **Scope:** the 8 commits `main..HEAD` on `worktrees/096-feature-catalog-anchor-deprecation`, `e6b0297bcf` through `c2fcd2d1e3`: 1159 files, about 58.5k insertions and 46.1k deletions, of which about 40k lines per commit are the regenerated `trigger-index.json`.
- **Run:** `/deep:review:auto`, single executor `cli-pi`, model `deepseek-v4.1-flash` on DevPass (`llmgateway`) at `--thinking max`, 5 iterations, stop policy `max-iterations`. DevPass never hit its limit, so no cline-pass switch happened.
- **Synthesis rule:** every iteration finding was treated as a hypothesis. Each kept finding below was re-proved by a command or a line read during synthesis. One iteration finding was not kept (section 8).

The product changes are correct. No bulk edit lost content, no reference to a renamed script is broken, every link the range added resolves, and every version carrier agrees with its newest changelog entry. The five findings are all in the packet's own records or in version-key coverage that the records overstate.

## 2. Planning Trigger

`/speckit:plan` is not required. No P0 or P1 is active. The P2 items are small record fixes and an optional key sweep.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": ["F-001", "F-002", "F-003", "F-004", "F-005"],
  "remediationWorkstreams": ["WS-1 version-key coverage", "WS-2 packet record accuracy"],
  "specSeed": ["Scope or extend the version-key claim", "Correct parent goal D5 and criterion 3", "Record the sk-doc hub target and the 20-entry count"],
  "planSeed": ["Run add_changelog_version_keys.py over the four named units", "Edit three packet docs"],
  "findingClasses": ["instance-only", "cross-consumer"],
  "affectedSurfacesSeed": ["changelog frontmatter", "parent goal.md", "phase 003 receipts"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### F-001 [P2] Version-key coverage is narrower than the packet claims (iteration R1-P2-001, broadened in synthesis)

- **Dimension:** correctness, traceability
- **File:line:** `.skilled/skills/system-deep-loop/runtime/changelog/v1.0.0.0.md:1-11`; claim at `specs/sk-doc/066-feature-catalog-template-anchor-deprecation/005-changelog-version-keys/spec.md:30` and `:59`
- **Evidence:** phase 005 says "No changelog entry in the touched skills lacks a version key" (spec.md:30) and "Every changelog entry in the touched skills names its version" (spec.md:59). At HEAD:
  - `system-deep-loop/runtime`, swept by phase 002 (55 catalog files) and given new entries `v1.9.5.0` and `v1.9.6.0` in this range, still has 9 unkeyed entries, `v1.0.0.0` through `v1.8.0.0` (awk frontmatter scan, synthesis).
  - `cli-codex`, `cli-cursor` and `mcp-code-mode`, patch-bumped by phase 004 (`99c133fd5a`) after phase 005 ran, still have 25, 6 and 9 unkeyed entries. `package_skill.py --check --strict` prints `Result: FAIL` for all three: `cli-codex` (25 unmet, all missing `version`), `mcp-code-mode` (9 unmet, all missing `version`) and `cli-cursor` (7 unmet, 6 missing `version` plus a 166-character description).
- **Impact:** documentation and metadata only. Readers trust a coverage claim that is false for four range-touched units, and three of them still fail the strict package check. No runtime reads the key. These gaps existed on `main`, so this is not a regression.
- **Smallest fix:** run `005-changelog-version-keys/scratch/add_changelog_version_keys.py` over the four units, which all have frontmatter, and patch-bump them; or reword spec.md:30 and :59 to "the 28 units checked in phase 005".
- **findingClass:** instance-only. **scopeProof:** whole-tree scan of tracked changelog files; the other unkeyed units were not touched by the range.

### F-002 [P2] Parent completion criterion names a superseded mode version (iteration R3-P2-002)

- **Dimension:** traceability
- **File:line:** `specs/sk-doc/066-feature-catalog-template-anchor-deprecation/goal.md:87`
- **Evidence:** the checked criterion reads "sk-create-feature-catalog reads version 1.0.2.0". `.skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md:5` reads `version: 1.0.4.0`, after `837c8e1629` (1.0.3.0) and `ccf25fdd56` (1.0.4.0). The version chain 1.0.2.0, 1.0.3.0, 1.0.4.0 is dense and each entry exists.
- **Impact:** an evaluator testing the criterion against the tree finds it false.
- **Smallest fix:** change the clause to "reads version 1.0.2.0 or later" or "1.0.4.0", or add a supersession row to the goal's deviations table.
- **findingClass:** instance-only.

### F-003 [P2] Decision D5 says hub bumps are handed off, but phase 002 bumped all six hubs (iteration R3-P2-001)

- **Dimension:** traceability
- **File:line:** `specs/sk-doc/066-feature-catalog-template-anchor-deprecation/goal.md:51`
- **Evidence:** D5 reads "Hub version bumps are handed off, because their JSON version fields belong to another owner." Commit `45cb464be8` bumped the six hubs' `SKILL.md` and their `description.json`, `hub-router.json` and `mode-registry.json` versions (sk-doc 2.3.0.0 to 2.3.1.0, sk-code 2.2.7.0 to 2.2.8.0, and four more; synthesis compared `main` and HEAD). Phase 002's own scope lists those carriers (`002-retroactive-removal/spec.md:70`). The carriers agree with each other at HEAD, so nothing is broken; the directive simply does not describe what the packet did, and the goal's own precedence rule asks that a conflict be named.
- **Impact:** ownership of the hub JSON version fields reads ambiguously.
- **Smallest fix:** scope D5 to phases 003 to 007, or add a deviation row naming the phase 002 hub bumps.
- **findingClass:** cross-consumer.

### F-004 [P2] The sk-doc hub bump is handed off without a target version (iteration R4-P2-001)

- **Dimension:** maintainability
- **File:line:** `specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/implementation-summary.md:105`
- **Evidence:** phase 003 lists six hubs as handed off with no versions. Phases 004, 005 and 007 name targets for five of them (cli-classifier 0.8.2.0, cli-external-orchestration 1.7.3.0, mcp-tooling 1.8.2.0, sk-code 2.2.9.0, system-deep-loop 1.5.5.0). A grep for `2.3.2.0` or `sk-doc 2.3` across phases 001 to 007 returns nothing, while `ccf25fdd56` changed sk-doc hub catalog files and sk-doc stays at 2.3.1.0.
- **Impact:** the owner of the hub version fields cannot action the sk-doc bump from the records.
- **Smallest fix:** add "sk-doc 2.3.1.0 to 2.3.2.0" to the phase 003 handoff line, or keep one consolidated hub-handoff table in the parent.
- **findingClass:** cross-consumer.

### F-005 [P2] Phase 003 receipts count 19 new changelog entries; the commit adds 20 (iteration R3-P2-003)

- **Dimension:** traceability
- **File:line:** `specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/implementation-summary.md:61`, `acceptance-criteria.md:56`
- **Evidence:** both say 19 entries. `git show ccf25fdd56 --name-status -- '*changelog/v*.md'` lists 20 added files: 19 units with a `SKILL.md` bump plus `system-deep-loop/runtime/changelog/v1.9.6.0.md`, a unit with no `SKILL.md`. The same pattern in phase 002 (27 entries, 26 `SKILL.md` bumps) is counted correctly there.
- **Impact:** a minor audit discrepancy in a closed phase.
- **Smallest fix:** say "20 entries, 19 of them with a SKILL.md bump" in both lines.
- **findingClass:** instance-only.

## 4. Remediation Workstreams

- **P0, P1:** none.
- **WS-1, P2 (F-001):** key the 49 entries in the four units with the existing script and bump each unit, or narrow the claim. Optional; nothing reads the key.
- **WS-2, P2 (F-002 to F-005):** four text edits in `goal.md` and phase 003's `implementation-summary.md` and `acceptance-criteria.md`.

## 5. Spec Seed

- Phase 005 wording states which units its version-key guarantee covers.
- Parent `goal.md` criterion 3 and decision D5 match the tree and the phase 002 actions.
- One consolidated record of pending hub bumps with exact targets, including sk-doc.

## 6. Plan Seed

1. `python3 -I 005-changelog-version-keys/scratch/add_changelog_version_keys.py <runtime> <cli-codex> <cli-cursor> <mcp-code-mode>`, then `package_skill.py --check --strict` on each.
2. Edit `goal.md:51` and `:87`, `003-feature-catalog-findings/implementation-summary.md:61` and `:105`, `acceptance-criteria.md:56`.
3. `validate.sh --recursive --strict` on the parent.

## 7. Traceability Status

### Core protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | Pass with gaps | Counts re-proved in synthesis: 548 catalog files at exactly one marker plus one blank line each (548 and 548 removed lines, 0 other); 97 leftover comments plus 1 Hermes copy, with the two documented heading-case edits as the only other removals; 217 changelog files gaining one `version:` line each plus 10 new entries; 5 renames. Gaps are F-001, F-002, F-003. |
| `checklist_evidence` | Pass with gaps | `validate_catalog_package.py --report-only` prints 15 violations (3 fail, 12 warn), the 3 fails being the known sk-vision environment gap; renamed-script tests 17 pass, 0 fail; `run-all-drift-guards.sh` all 4 guards PASSED, rc 0; catalog validator tests ALL PASS; Hermes `--check` PASS, 70 copies. Gaps are F-004, F-005. |

### Overlay protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | Not applicable | No agent definitions in the range. |
| `agent_cross_runtime` | Pass | Hermes copies in sync (`sync-skills-hermes.cjs --check`). |
| `feature_catalog_code` | Pass | Every relative link added by the 8 commits resolves (85 in `ccf25fdd56`, 98 overall, 0 missing). The changed `cupt --json` claim matches `cupt add --help` on cupt 0.8.0. |
| `playbook_capability` | Not applicable | Playbook edits were the marker removal and two heading-case changes only. |

`AC_COVERAGE`: exempt; the target is a commit range, not a lifecycle-active spec folder.

## 8. Deferred Items and Findings Not Kept

- **Not kept, R2-P2-001 (scratch scripts glob the working tree rather than tracked files).** The mechanism is real in `remove_packet_history_lines.py`, `normalize_validation_types.py` and `add_changelog_version_keys.py`, but the scripts are one-shot tools that already ran, the worktree had no untracked or symlinked catalog files, and the committed results were re-proved directly. No defect exists in the range, so this is not a finding.
- **Out of range, pre-existing:** `.skilled/skills/sk-code/sk-code-opencode/changelog/v1.0.0.0.md` carries `version: 1.0.0.4` against its file name; the file is unchanged from `main`.
- **Out of range:** 131 more unkeyed changelog entries sit in units the range never touched.
- **Ruled out:** content loss in bulk edits, broken old-name references (only three historical changelog lines keep them, by design), dangling links, version-carrier drift, duplicate or skipped versions, and overengineering (the scratch scripts add no dependency, abstraction or runtime path).

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Directions: correctness (iterations 1 and 5), security (2), traceability (3), maintainability (4).
- Remaining frontier: none recorded.

## 9. Search Ledger

- The reducer recorded one search-debt row (SL-307, iteration 3): goal criteria 4 and 6 could not be re-run inside an iteration. Synthesis ran them: `sync-skills-hermes.cjs --check` printed PASS, `generate-trigger-index.mjs --check` reported stale entries only for this new 008 phase, and `validate.sh --recursive --strict` printed RESULT: PASSED for the parent and all seven original children before this phase's docs were written. The debt is cleared, so the verdict stays PASS.
- Ruled-out classes and per-iteration ledgers are in `deltas/iter-00[1-5].jsonl` and the findings registry.

## 10. Audit Appendix

- **Convergence:** stop reason `maxIterationsReached` at 5 of 5. `convergence.cjs` reported `STOP_BLOCKED` (uncovered_dimensions) before each logged iteration, 2 to 5; the iteration 1 reading was lost to a pipe-flush bug in the driver. The findings registry marks all four dimensions covered after iteration 4. Telemetry only under the `max-iterations` policy.
- **Iterations:** each ended `Review verdict: PASS`; each passed `verify-iteration.cjs` (narrative, route proof, delta) on the first dispatch.
- **Sources reviewed:** all 8 commit messages and stats; the 9 phase scratch scripts; the renamed scripts, wrapper, tests and leaf manifest; phase 001 to 007 spec, tasks, acceptance criteria and implementation summaries; parent `spec.md` and `goal.md`; sampled diffs per commit; population scans over every tracked changelog file and every removed line in the four bulk commits.
- **Workflow deviations:** the single-executor path was driven by a scratch driver that binds the YAML `if_cli_pi` branch verbatim. The per-iteration `graph_convergence_evaluated` ledger event was not appended (convergence was computed and logged only), and `phase_save` (`generate-context.js`) was not run; continuity lives in this phase's hand-written docs. The prompt pack inlined no persona, so the review target told the child to read `.skilled/agents/deep-review.md` first.
