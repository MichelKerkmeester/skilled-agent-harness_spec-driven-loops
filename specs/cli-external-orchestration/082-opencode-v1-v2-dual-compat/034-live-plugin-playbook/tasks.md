---
title: "Tasks: Live plugin utilization playbook on OpenCode v1 and v2"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "live plugin playbook tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Live plugin utilization playbook on OpenCode v1 and v2

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create and provision worktree `174-live-plugin-playbook` from origin/main with sk-git's `create` command
- [x] T002 Scaffold this Level 2 packet with `create.sh --level 2 --path`
- [x] T003 Confirm both versions reach `llmgateway/deepseek-v4.1-flash` at high effort with a one-word dispatch
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the capture proxy, the stub MCP server and the scenario runner (`manual-testing-playbook/plugin-utilization/`)
- [x] T005 Probe which events and tool names reach a bridged plugin on each version (`scratch/live-runs/event-probe-summary.txt`)
- [x] T006 Run one live scenario per plugin on both versions and keep the evidence (`scratch/live-runs/*.v1.txt`, `*.v2.txt`)
- [x] T007 Check the skill-advisor kill switch on both versions (`scratch/live-runs/killswitch-skill-advisor.*`)
- [x] T008 Write the results matrix with root causes (`scratch/live-runs/results-matrix.md`)
- [x] T009 Write one scenario file per plugin through the OpenCode DeepSeek writer (`manual-testing-playbook/plugin-utilization/*.md`) [EVIDENCE: 17 files, CO-040 to CO-056]
- [x] T010 Register the category and its count in the root playbook (`manual-testing-playbook/manual-testing-playbook.md`) [EVIDENCE: section 22, the section 18 index and the 72-scenario, 14-category census]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run sk-doc script tests, the playbook operator contract and link integrity locally [EVIDENCE: `validate-playbook-package.cjs --strict` cli-opencode PASS 72/14 with 0 violations; `check-markdown-links.cjs` 0 broken of 14193; `run-script-tests.sh` first failed on `test_readme_manifest.py` because the new report folder was missing from the durable-directory manifest, then passed after the test's own `--write` refresh; `cite-drift-gate.mjs --base` the merge base exits 0 with no new broken citation. Outputs: `scratch/live-runs/local-checks.txt`]
- [ ] T012 Luna review, read-only
- [ ] T013 Recursive strict validation of 082 prints `RESULT: PASSED`
- [ ] T014 Merge to main, push, and read every CI workflow's conclusion
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: `bash -n run-plugin-scenario.sh` and `node --check` on both `.mjs` files exit 0; the comment hygiene checker exits 0 on all three]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: `scratch/live-runs/local-checks.txt`: every check exits 0; the remaining validator warnings (hand-typed census) are the same class the baseline already carried]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: the runner exits 2 on bad usage; the proxy answers 502 on an upstream error and never lets a capture error stop forwarding]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: module and component headers match `opencode-setup.sh` and the plugin modules]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: 36 run files in `scratch/live-runs/`, the matrix in `results-matrix.md`]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: a model refusal was rerun with a clearer prompt, not counted against the plugin (post-edit and sentinel runs); the sentinel's dedup record was cleared before the second version]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: every refusing plugin was driven into its refusal on v1: dispatch guard, message gate, spec gate, deep-loop guard]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class [EVIDENCE: the four root causes in `results-matrix.md` are `class-of-bug` in the v2 bridge or in the plugins' tool and event filters]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed [EVIDENCE: `grep -n "'bash'\|'task'" .opencode/plugins/*.js` lists every tool-name filter; all are in the matrix]
- [x] CHK-FIX-003 [P0] Consumer inventory completed [EVIDENCE: no plugin or bridge code changed in this packet]
- [x] CHK-FIX-004 [P0] Adversarial table tests [EVIDENCE: not applicable; no parser, path or redaction code changed]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed [EVIDENCE: 17 plugins × 2 versions, with the dispatch audit plugin split into its guard and log halves]
- [x] CHK-FIX-006 [P1] Hostile env variant executed [EVIDENCE: the kill-switch runs and the child-flag-off spec-gate runs]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA [EVIDENCE: `scratch/live-runs/round4-rerun.txt` re-ran the changed blocks at `43d570d14f`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: the proxy never writes headers; `grep -rE "LLMGATEWAY_API_KEY=|Bearer |sk-[A-Za-z0-9]{20}"` over `scratch/live-runs` finds nothing]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: the runner rejects a version other than v1 or v2; the proxy rejects a missing port or path]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: no v2 run used `--server` or `--attach`; the shared v2 service was never contacted]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: the AC table, this checklist and `implementation-summary.md` name the same evidence files and verdict counts]
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: `benchmark/README.md` and `benchmark/reports/README.md` list the new report]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: raw captures stay in the session scratchpad; only trimmed evidence is in the packet]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: the probe plugin, fixture files and the stale dist were removed or restored; `git status` shows only intended paths]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-20
<!-- /ANCHOR:summary -->
