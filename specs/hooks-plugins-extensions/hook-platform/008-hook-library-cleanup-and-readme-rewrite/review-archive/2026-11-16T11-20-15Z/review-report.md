---
title: "Deep Review Report: hook library cleanup packet"
description: "Five-iteration deep review of packet 008 and the 349 live files its commits changed. Verdict FAIL on the coverage gate, with six P2 documentation findings and no P0 or P1."
trigger_phrases:
  - "hook library cleanup deep review report"
importance_tier: normal
contextType: review
---

# Deep Review Report: hook library cleanup packet

<!-- MACHINE-OWNED: START report-meta -->
- Session: `2026-11-16T10:21:46.673Z`, generation 1, lineage new
- Executor: `cli-deepseek-harness`, model `deepseek-v4.1-flash-1017`, reasoning max, 900 s per iteration
- Iterations: 5 of 5. Stop reason: `maxIterationsReached` (stop policy max-iterations)
<!-- MACHINE-OWNED: END report-meta -->

---

## 1. Executive Summary

- **Verdict: FAIL**
- **hasAdvisories:** false. The flag applies only to a PASS verdict.
- **Counts the verdict used:** P0 = 0, P1 = 0, P2 = 6.
- **Why FAIL with no P0 or P1:** the terminal coverage gate failed with `traceability-incomplete`. Both core protocols, `spec_code` and `checklist_evidence`, ended `partial`, because the packet's own completion records disagree with its evidence. The evidence gate passed (`all-findings-cited`) and the scope gate passed (`all-findings-in-scope`).
- **Self-check outcomes:** no P0 or P1 was raised, so the adversarial self-check recorded no adjudication. The orchestrator separately re-read all six P2 findings at their cited lines and confirmed each one. None was downgraded or called a false positive.
- **Review scope:** the phase-parent packet (37 spec documents across the parent and six child phases) and the 349 live files that the packet's 13 commits changed. That is 386 files in total.
- **What the review did not find:** no hook behavior defect, no security issue, and no broken path, import or registration from the phase 3 renames. Every finding is a documentation or status-record defect, and each one is fixed by a text edit.

---

## 2. Planning Trigger

`/speckit:plan` is required by the workflow's FAIL route. The remediation is six text edits in eight places, so a short follow-up phase under this packet is enough.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "FAIL",
    "hasAdvisories": false,
    "activeFindings": [
      {"id": "R3-P2-001", "severity": "P2", "file": "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite/implementation-summary.md", "line": 59},
      {"id": "R3-P2-002", "severity": "P2", "file": "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md", "line": 59},
      {"id": "R4-P2-001", "severity": "P2", "file": ".skilled/hooks/injection-contract.md", "line": 20},
      {"id": "R4-P2-002", "severity": "P2", "file": ".skilled/hooks/README.md", "line": 251},
      {"id": "R4-P2-003", "severity": "P2", "file": "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite/spec.md", "line": 184},
      {"id": "R5-P2-001", "severity": "P2", "file": "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite/tasks.md", "line": 129}
    ],
    "remediationWorkstreams": [
      {"id": "WS-1", "title": "Reconcile the packet's completion records", "findings": ["R3-P2-002", "R3-P2-001", "R5-P2-001", "R4-P2-003"]},
      {"id": "WS-2", "title": "Repair two navigation gaps in the hooks root README", "findings": ["R4-P2-001", "R4-P2-002"]}
    ],
    "specSeed": [
      "The parent spec and goal name six child phases and the parent continuity reports the packet complete",
      "Phase 4's summary, completion criteria and SC-001 agree with the closed state and with one stated README counting basis",
      "README.md#kill-switch-index resolves, and the hooks tree lists session-handover/history/"
    ],
    "planSeed": [
      "Edit parent spec.md lines 3 and 59 and goal.md line 91 from four to six children, then refresh the parent continuity through the save writer",
      "Rewrite 004 implementation-summary.md line 59 to record the env-secret-guard README as signed off",
      "Tick 004 tasks.md lines 129 and 130",
      "Restate 004 spec.md SC-001 with its counting basis, 104 concern READMEs plus the folder-root index",
      "Add a kill-switch-index anchor above the switch table in .skilled/hooks/README.md",
      "Add a history/ line to the session-handover block of the hooks README tree",
      "Rerun validate.sh --recursive --strict, validate_document.py and hvr_scan.py on the changed READMEs"
    ],
    "findingClasses": ["traceability", "maintainability"],
    "affectedSurfacesSeed": [
      "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md",
      "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/goal.md",
      "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite/implementation-summary.md",
      "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite/spec.md",
      "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite/tasks.md",
      ".skilled/hooks/README.md",
      ".skilled/hooks/injection-contract.md",
      ".skilled/hooks/coverage-rationale.md"
    ],
    "fixCompletenessRequired": false
  }
}
```

---

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Finding |
|----|-----|-----------|-----------|---------|
| R3-P2-002 | P2 | traceability | `spec.md:59` (also `:3`, `:25`; `goal.md:91`) | The parent still describes four children and 0% progress |
| R3-P2-001 | P2 | traceability | `004-hook-readme-fold-and-rewrite/implementation-summary.md:59` | The phase 4 summary still says the env-secret-guard README is not signed off |
| R5-P2-001 | P2 | traceability | `004-hook-readme-fold-and-rewrite/tasks.md:129` | Phase 4's two completion criteria are unticked while the phase reports Complete |
| R4-P2-003 | P2 | maintainability | `004-hook-readme-fold-and-rewrite/spec.md:184` | SC-001's README count no longer reproduces from its own command |
| R4-P2-001 | P2 | maintainability | `.skilled/hooks/injection-contract.md:20` | The documented `README.md#kill-switch-index` link points at an anchor that does not exist |
| R4-P2-002 | P2 | maintainability | `.skilled/hooks/README.md:251` | The browsable tree leaves out `session-handover/history/` |

### R3-P2-002: the parent still describes four children and 0% progress

- **Evidence:** `spec.md:59` says "All four children are Complete". `spec.md:3` says "Four phases". `spec.md:25` holds `completion_pct: 0`, and `spec.md:17` holds `recent_action: "Phase parent created, child phases own continuity"`. `goal.md:91` says "the parent and all four children". The phase map at `spec.md:121-126` lists six children, all Complete, and six child folders exist on disk.
- **Impact:** a reader of the handoff criteria misses phases 5 and 6. A resume reads the packet as unstarted.
- **Fix:** change four to six in the three prose places. Refresh the continuity block through the save writer (`generate-context.js`), not by hand. It is writer-owned.
- **Scope proof:** every stale value sits in the parent `spec.md` or `goal.md`, and the six-row map in the same file contradicts it.

### R3-P2-001: the phase 4 summary still says one README is not signed off

- **Evidence:** `implementation-summary.md:59` says "One README is not signed off: `env-secret-guard/README.md` holds a worker draft with one wrong diagram line". The same file says "T021 closed after the operator's edit" at line 49 and holds `completion_pct: 100` at line 30. `tasks.md:72` has T021 ticked, and `.skilled/hooks/env-secret-guard/README.md:54` now carries the fix T021 describes.
- **Impact:** the phase looks as if it still has an open operator item after it closed.
- **Fix:** rewrite the sentence to record that the operator fixed the README and T021 closed.

### R5-P2-001: phase 4's completion criteria are unticked

- **Evidence:** `tasks.md:129` (`- [ ] All tasks marked [x]`) and `tasks.md:130` (`- [ ] No [B] blocked tasks remaining`). Every implementation task T001 to T086 is ticked, and `004/spec.md:26` says Status Complete. A packet-wide scan for unticked boxes finds only these two and the deferral `001/tasks.md:165` CHK-042, which is documented.
- **Fix:** tick both boxes. Both conditions are true.

### R4-P2-003: SC-001's count depends on an unstated basis

- **Evidence:** `004/spec.md:184` expects `find .skilled/hooks -name README.md | wc -l` to print 104. It prints 105 on the merged tree. `git ls-files '.skilled/hooks/**/README.md'` prints 104, and the extra file is the folder-root `.skilled/hooks/README.md`. `004/implementation-summary.md:59` says 104, and its baseline row at line 146 records `pass=105`.
- **Impact:** a rerun of SC-001 reads as a regression.
- **Fix:** state the basis once, for example "104 concern READMEs, 105 including the folder-root index".

### R4-P2-001: `README.md#kill-switch-index` resolves to no anchor

- **Evidence:** `.skilled/hooks/injection-contract.md:20` and `.skilled/hooks/coverage-rationale.md:30` both link `./README.md#kill-switch-index` and call it the single source for switch names. `.skilled/hooks/README.md` defines no heading or anchor with that id. Its headings are `## 1. OVERVIEW` through `## 8. RELATED`, and the switch table sits inside OVERVIEW at lines 47 to 77.
- **Impact:** the link opens at the top of a 436-line page instead of the table.
- **Fix:** add an explicit `kill-switch-index` anchor directly above the table. No content moves.

### R4-P2-002: the hooks tree leaves out `session-handover/history/`

- **Evidence:** the session-handover block at `.skilled/hooks/README.md:251-258` lists `bin/`, the runtime adapter folders, `lib/` and `tests/`, but not `history/`. `git ls-files .skilled/hooks/session-handover/history` lists 27 tracked files, including `lib/cli.ts` and `lib/core.ts`. The tree filter at line 274 excludes only folders that hold nothing but links.
- **Impact:** a maintainer following the tree to the history lookup finds only `bin/history-lookup.mjs` and misses the engine.
- **Fix:** add one tree line for `history/`.

---

## 4. Remediation Workstreams

1. **P0:** none.
2. **P1:** none.
3. **WS-1, the coverage gate (P2):** reconcile the packet's completion records: R3-P2-002 first, then R3-P2-001, R5-P2-001 and R4-P2-003. These four findings are what hold `spec_code` and `checklist_evidence` at partial, so fixing them is what lets the coverage gate pass on a rerun.
4. **WS-2, advisories (P2):** repair the two navigation gaps in `.skilled/hooks/README.md`, R4-P2-001 and R4-P2-002. Neither one affects the gate.

**Fix first: R3-P2-002.** It is the packet's top-level handoff statement, it misstates the packet's size, and it is the most visible of the records keeping the coverage gate at fail.

---

## 5. Spec Seed

- The parent `spec.md` and `goal.md` name six child phases, and the parent continuity reports the packet complete.
- Phase 4's implementation summary, completion criteria and SC-001 agree with the closed state and with a stated README counting basis.
- `.skilled/hooks/README.md#kill-switch-index` resolves, and the hooks tree lists `session-handover/history/`.

---

## 6. Plan Seed

1. Edit the parent `spec.md` (lines 3 and 59) and `goal.md` (line 91) from four to six children.
2. Refresh the parent continuity with a `generate-context.js` full-auto save.
3. Rewrite `004/implementation-summary.md:59`.
4. Tick `004/tasks.md:129-130`.
5. Restate `004/spec.md` SC-001 with its counting basis.
6. Add the `kill-switch-index` anchor and the `history/` tree line to `.skilled/hooks/README.md`.
7. Run `validate.sh --recursive --strict` on the packet, `validate_document.py` and `hvr_scan.py` on the hooks README, and `backfill-graph-metadata.js` if the parent fingerprint goes stale.
8. Rerun `/deep:review` to confirm the coverage gate passes.

---

## 7. Traceability Status

### Core protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | Phase 6 matches goal D2 (`install-codex-hooks.mjs:324,336-344`, `pi/session-start-advisories.ts:59`, `dsh/session-start-advisories.mjs:65-67`). Phase 5's requirements carry recorded command evidence (`005/spec.md:131-140`, `005/implementation-summary.md:113-121`). The renames resolve: both sync checks PASS over 35 registry hooks, 22 Pi extensions and 257 mirrors | Phase 4 SC-001 (R4-P2-003) and the line 59 sign-off claim (R3-P2-001) |
| `checklist_evidence` | partial | Every implementation task in every phase is ticked. Every acceptance row is Met, apart from the documented 001 CHK-042 deferral | `004/tasks.md:129-130` (R5-P2-001) and the parent completion records (R3-P2-002) |

### Overlay protocols

| Protocol | Status | Note |
|----------|--------|------|
| `skill_agent` | not run | No iteration chose it. The packet changes no skill contract that an agent mirrors |
| `agent_cross_runtime` | not run | Covered indirectly by `sync-runtime-mirrors.cjs --check` PASS (257 mirrors) |
| `feature_catalog_code` | not run | The packet has no feature catalog |
| `playbook_capability` | not run | Not examined. The Codex check's `OK` line, which playbooks pin, is unchanged |

- **AC_COVERAGE:** advisory-shortfall. Phases 1 to 4 carry `acceptance-criteria.md`, and their rows are Met apart from the documented 001 CHK-042 deferral. Phases 5 and 6 are Level 1 and carry none.

---

## 8. Deferred Items

These are advisory only and do not change the verdict.

- **Code not opened in depth:** the phase 3 renamed code under `.skilled/hooks/cli-dispatch/`, `decision-capture/`, `completion-evidence/` and `subagent-dispatch-guard/` was covered by path-existence checks, both sync checks and a comment-hygiene search, not by a file-by-file read. The hook test suites that passed at the last commit (Vitest 506 of 506, `node --test` 1898 passed) are the remaining evidence.
- **Historical probes:** two dated benchmark probe scripts still name the removed `dispatch/` folder (`cli-classifier/cli-jev/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe.sh:18`, `preflight-probe2.sh:13`). They are raw evidence from September, and decision D3 keeps historical artifacts as written.
- **Installer hardening (iteration 2):** a symlinked `~/.codex/hooks.json` is replaced by the atomic rename rather than written through; it is backed up first. Two runs in the same millisecond could share a backup name.
- **DSH advisory:** the detached reconcile child is not awaited, so a spawn error goes unreported. The advisory is warn-only by design.
- **Concern-key naming:** Pi uses concern `session-lifecycle` for the primary-reconcile check, while DSH uses `primary-reconcile`. Decision D1 freezes concern keys.
- **Known limitations already recorded in phase 6:** Cursor prints the `OK` line, and `--dry-run` still needs `--allow-worktree`.

---

## Dimension Expansion Map

- Saturated directions: none recorded.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0. No Council artifacts.
- Selected directions: correctness (iteration 1), security (2), traceability (3), maintainability (4), traceability stabilization (5).
- Remaining frontier: the deferred code read above and the four overlay protocols.

---

## 9. Search Ledger

- **hasSearchDebt:** false. `searchDebt` is empty.
- **Required bug classes:** stale_status_claim, completion_metadata_drift, broken_cross_reference, documentation_drift, count_drift, checklist_evidence_gap, comment_hygiene. All are covered except comment_hygiene, which was ruled out. No class is deferred or blocked.
- **Graph coverage mode:** graphless_fallback.
- **Candidates covered:** broken_cross_reference, checklist_evidence_gap, completion_metadata_drift, count_drift, documentation_drift, error_handling, stale_status_claim, state_transition.
- **Candidates ruled out:** command_injection, comment_hygiene, documentation_structure_drift, error_handling, guard_bypass, path_resolution, secret_exposure, state_transition, supply_chain_ci, undocumented_convention, unsafe_file_write, unsupported_completion_claim.
- **Clean search proof, sample:** SL-001 (`install-codex-hooks.mjs:324,336-344`). The reconcile and dry-run branches keep `args.check` false, so the guard still refuses a linked worktree. The full proof rows are in `deep-review-findings-registry.json` under `cleanSearchProof`.

---

## 10. Audit Appendix

### Convergence summary

| Iteration | Dimension | New-findings ratio | Files reviewed | New findings |
|-----------|-----------|--------------------|----------------|--------------|
| 1 | correctness | 0.00 | 11 | none |
| 2 | security | 0.00 | 19 | none |
| 3 | traceability | 1.00 | 13 | R3-P2-001, R3-P2-002 |
| 4 | maintainability | 1.00 | 10 | R4-P2-001, R4-P2-002, R4-P2-003 |
| 5 | traceability (stabilization) | 0.17 | 12 | R5-P2-001 |

- Convergence score 0.83, graph convergence score 0.85. After iteration 2, the convergence check reported `STUCK_RECOVERY`. The planned next dimension was already uncovered, so the plan did not change.
- At the stop, the legal-stop tree named the dimensionCoverageGate, candidateCoverageGate and graphlessFallbackGate. The stop policy is max-iterations, so the run stopped at `maxIterationsReached` regardless.
- Terminal gates: evidence pass, scope pass, coverage fail (`traceability-incomplete`).

### Coverage summary

- Dimensions: 4 of 4 covered (1.0).
- Every iteration passed `verify-iteration.cjs` on the first attempt, and every claim adjudication passed. No iteration errored or needed a redispatch.

### Ruled-out claims

- Stale renamed-folder references in live code: none outside the two historical probes.
- Dead or duplicate hook registrations: none. Both sync checks PASS.
- A broken import after the Pi fallback removal: none. `hook-flags.mjs` exists, and no live code names `hook-flags.ts`.
- A guard bypass from the `--check` change: none. Only the non-writing path skips the guard.

### Sources reviewed

- Per-iteration file lists are in `iterations/iteration-001.md` to `iteration-005.md`, and the resource map is in `resource-map.md`.
- Integration commands run by the iterations: `sync-hook-registrations.cjs --check`, `sync-runtime-mirrors.cjs --check`, `git ls-files` and `find` counts, and a `git grep` for removed folder names.

### Cross-reference appendix

**Core Protocols:** `spec_code` partial, `checklist_evidence` partial (section 7).

**Overlay Protocols:** `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` were not run (section 7).
