---
title: "Deep Review Report: hook library cleanup packet, generation 2"
description: "Five-iteration rerun of the deep review of packet 008 after phase 7. Verdict CONDITIONAL: one P1 status record and nine P2 findings, two of them small hardening gaps in the dispatch audit log. Every terminal gate passes."
trigger_phrases:
  - "hook library cleanup deep review report"
importance_tier: normal
contextType: review
---

# Deep Review Report: hook library cleanup packet, generation 2

<!-- MACHINE-OWNED: START report-meta -->
- Session: `2026-11-16T11:20:27.056Z`, generation 2, lineage restart from `2026-11-16T10:21:46.673Z`
- Executor: `cli-deepseek-harness`, model `deepseek-v4.1-flash-1017`, reasoning max, 900 s per iteration
- Iterations: 5 of 5. Stop reason: `maxIterationsReached` (stop policy max-iterations)
<!-- MACHINE-OWNED: END report-meta -->

---

## 1. Executive Summary

- **Verdict: CONDITIONAL**
- **hasAdvisories:** false. The flag applies only to a PASS verdict.
- **Counts the verdict used:** P0 = 0, P1 = 1, P2 = 9.
- **Why CONDITIONAL:** one active P1, R3-P1-001. The parent `spec.md` says Complete while phase 7 is still open. The terminal gates all pass: evidence (`all-findings-cited`), scope (`all-findings-in-scope`) and coverage. Both core protocols, `spec_code` and `checklist_evidence`, now pass, which is the generation 1 coverage failure closed.
- **Self-check outcomes:** iteration 5 re-adjudicated R3-P1-001 and kept it at P1. The orchestrator separately re-read all ten findings at their cited lines and confirmed each one. None was downgraded or called a false positive.
- **Review scope:** the phase-parent packet with its seven children and the 349 live files its commits changed. That is 390 files in total.
- **What changed from generation 1:** all six generation 1 findings are fixed. The new findings come from deeper reads: the cli-dispatch code and READMEs, and the phase 7 records the rerun itself depends on.

---

## 2. Planning Trigger

`/speckit:plan` is required by the workflow's CONDITIONAL route. The operator already chose to fix every finding inside this packet, so the plan is the remediation list below.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "CONDITIONAL",
    "hasAdvisories": false,
    "activeFindings": [
      {"id": "R3-P1-001", "severity": "P1", "file": "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md", "line": 52},
      {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/hooks/cli-dispatch/README.md", "line": 115},
      {"id": "R1-P2-002", "severity": "P2", "file": ".skilled/hooks/cli-dispatch/README.md", "line": 166},
      {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs", "line": 1106},
      {"id": "R2-P2-002", "severity": "P2", "file": ".skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs", "line": 1243},
      {"id": "R3-P2-001", "severity": "P2", "file": "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/implementation-summary.md", "line": 50},
      {"id": "R3-P2-002", "severity": "P2", "file": "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/goal.md", "line": 109},
      {"id": "R3-P2-003", "severity": "P2", "file": "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md", "line": 91},
      {"id": "R4-P2-001", "severity": "P2", "file": ".skilled/hooks/decision-capture/README.md", "line": 71},
      {"id": "R4-P2-002", "severity": "P2", "file": ".skilled/hooks/subagent-dispatch-guard/README.md", "line": 92}
    ],
    "remediationWorkstreams": [
      {"id": "WS-1", "title": "Close the phase 7 records and the parent status", "findings": ["R3-P1-001", "R3-P2-001", "R3-P2-002", "R3-P2-003"]},
      {"id": "WS-2", "title": "Remove the stale Pi fallback and alias text and complete the README trees", "findings": ["R1-P2-001", "R4-P2-002", "R1-P2-002", "R4-P2-001"]},
      {"id": "WS-3", "title": "Harden the dispatch audit log", "findings": ["R2-P2-001", "R2-P2-002"]}
    ],
    "specSeed": [
      "The parent status agrees with its phase map, and phase 7 records its evidence",
      "No hook README describes the removed Pi fallback or Vitest alias, and each feature tree lists the entries its runtime table names",
      "The dispatch audit log redacts URL credentials and is created owner-only"
    ],
    "planSeed": [
      "Fill phase 7's implementation summary and close it, then set the parent status from its phase map",
      "Correct goal.md's binding table and progress rows to seven phases through the goal log, and drop the fixed Pi line from the parent out-of-scope list",
      "Rewrite cli-dispatch README lines 115 and 257-261, subagent-dispatch-guard README line 92, pi/README.md line 21 and the hooks README tree comment at line 148",
      "Add the missing tree entries in cli-dispatch, decision-capture, subagent-dispatch-guard and session-lifecycle",
      "Add a URL-userinfo pattern to SECRET_PATTERNS and mode 0o600 to the audit log write, each with a test",
      "Rerun the dispatch audit tests, validate_document.py and hvr_scan.py on changed READMEs, and validate.sh --recursive --strict"
    ],
    "findingClasses": ["traceability", "correctness", "maintainability", "security"],
    "affectedSurfacesSeed": [
      "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md",
      "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/goal.md",
      "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/",
      ".skilled/hooks/README.md",
      ".skilled/hooks/cli-dispatch/README.md",
      ".skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs",
      ".skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs",
      ".skilled/hooks/subagent-dispatch-guard/README.md",
      ".skilled/hooks/subagent-dispatch-guard/pi/README.md",
      ".skilled/hooks/decision-capture/README.md",
      ".skilled/hooks/session-lifecycle/README.md"
    ],
    "fixCompletenessRequired": false
  }
}
```

---

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Finding |
|----|-----|-----------|-----------|---------|
| R3-P1-001 | P1 | traceability | `spec.md:52` (also `:59`) | The parent says Complete while phase 7 is open |
| R3-P2-001 | P2 | traceability | `007-review-doc-reconciliation/implementation-summary.md:50` | Phase 7's implementation summary is an unfilled template |
| R3-P2-002 | P2 | traceability | `goal.md:109` (also `:66-71`, `:108`, `:111`) | goal.md still records four child phases |
| R3-P2-003 | P2 | traceability | `spec.md:91` | The parent's out-of-scope list still holds the Pi fallbacks phases 5 and 6 removed |
| R1-P2-001 | P2 | correctness | `.skilled/hooks/cli-dispatch/README.md:115` (also `:257-261`) | The README prescribes the removed Pi fallback and Vitest alias |
| R4-P2-002 | P2 | maintainability | `.skilled/hooks/subagent-dispatch-guard/README.md:92` (also `pi/README.md:21`) | The same removed fallback and alias, in the subagent guard READMEs |
| R1-P2-002 | P2 | correctness | `.skilled/hooks/cli-dispatch/README.md:166` | The tree omits the `vibe/` adapter folder |
| R4-P2-001 | P2 | maintainability | `.skilled/hooks/decision-capture/README.md:71` (also two more READMEs) | Three feature trees omit live entries their own runtime tables name |
| R2-P2-001 | P2 | security | `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1106` | URL credentials pass the audit scrubber |
| R2-P2-002 | P2 | security | `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1243` | The audit log is created with the default umask |

### R3-P1-001: the parent says Complete while phase 7 is open

- **Evidence:** parent `spec.md:52` holds `Status | Complete` and `:59` says "All seven children are Complete". The phase map at `:127` lists phase 7 In Progress. Phase 7's `spec.md:25` says Draft, its `tasks.md:62` leaves T011 (this review) open and its `implementation-summary.md:50` is a template.
- **Impact:** a reader or a resume treats the packet as closed while its last phase has no recorded evidence.
- **Fix:** close phase 7 with its evidence, so the parent statement becomes true, or hold the parent at In Progress until then.

### R3-P2-001: phase 7's implementation summary is an unfilled template

- **Evidence:** six `[YOUR_VALUE_HERE: ...]` tokens at lines 50, 61, 70, 81, 92 and 101. Phase 7's handoff criteria at `spec.md:32` require each requirement's command output to be recorded there.
- **Fix:** fill it from the checks phase 7 already ran.

### R3-P2-002: goal.md still records four child phases

- **Evidence:** the binding table at `goal.md:66-71` lists phases 1 to 4. The progress rows say "four binding rows matched to four folders" (`:108`), "Four child phases | Pending" (`:109`) and "all four phases Complete" (`:111`). The criterion at `:91` already names seven children.
- **Fix:** add the missing binding rows and record the current state through the goal's locked log. The rows are history, so a new row records the change rather than an edit rewriting the old ones.

### R3-P2-003: the parent's out-of-scope list still holds the Pi fallbacks

- **Evidence:** `spec.md:91` lists "The dead legacy import fallbacks in four Pi adapters and the Vitest alias that exists only for them" as out of scope. Decision D5 was amended so phases 5 and 6 fix them, and both phases record the fix.
- **Fix:** move that half of the line into scope history. The OpenCode prefixes stay out of scope.

### R1-P2-001 and R4-P2-002: the removed Pi fallback and Vitest alias are still described

- **Evidence:** `cli-dispatch/README.md:115` says the Pi preflight "tries a long specifier ... first and falls back to `../lib/`". `:257` says the hooks config's "alias serves the literal long specifier the Pi preflight keeps". `subagent-dispatch-guard/README.md:92` and `subagent-dispatch-guard/pi/README.md:21` say a longer fallback specifier "resolves only through the test alias". Phase 5 reduced the Pi adapters to one import each and deleted the alias. The hooks README tree comment at `.skilled/hooks/README.md:148` still says "its long-specifier alias".
- **Fix:** describe the single `../lib/` import and drop the alias wording in all five places.

### R1-P2-002 and R4-P2-001: feature trees omit live entries

- **Evidence:** `cli-dispatch/README.md:166` has no `vibe/` line although `cli-dispatch/vibe/` exists. `decision-capture/README.md:71` has no `opencode/decision-capture.js`, which its runtime section names. `subagent-dispatch-guard/README.md:102` has no `vibe/deep-loop-guard.mjs`, named at `:79`. `session-lifecycle/README.md:188` leaves out the live `vibe/session-start.test.mjs`.
- **Fix:** add the missing lines.

### R2-P2-001: URL credentials pass the audit scrubber

- **Evidence:** every pattern in `SECRET_PATTERNS` at `dispatch-audit.mjs:1106` anchors on a keyword (token, key, secret, password, authorization), a provider prefix, a PEM block or a JWT. A dispatch line holding `HTTPS_PROXY=http://alice:hunter2@proxy:8080` or `--base-url https://alice:hunter2@host` matches none of them, so the password reaches the audit log.
- **Fix:** add a pattern that replaces the `user:password@` part of a URL and keeps the scheme and host.

### R2-P2-002: the audit log is created with the default umask

- **Evidence:** `appendAuditLog` at `dispatch-audit.mjs:1243` calls `appendFileSync` without a mode, so a new log is 0644 under the usual umask. The decision-capture queue writes with `mode: 0o600` at `capture-core.mjs:370`. The log holds command lines that the scrubber may miss, as R2-P2-001 shows.
- **Fix:** create the log with `mode: 0o600`.

---

## 4. Remediation Workstreams

1. **P0:** none.
2. **WS-1, the P1 (traceability):** close phase 7's records, then set the parent status from its phase map: R3-P1-001, R3-P2-001, R3-P2-002 and R3-P2-003.
3. **WS-2, documentation drift (P2):** R1-P2-001 and R4-P2-002, then R1-P2-002 and R4-P2-001.
4. **WS-3, audit log hardening (P2):** R2-P2-001 and R2-P2-002, each with a failing test first.

**Fix first: R3-P1-001.** It is the only finding that sets the verdict.

---

## 5. Spec Seed

- The parent status agrees with its phase map, and phase 7 records its evidence.
- No hook README describes the removed Pi fallback or Vitest alias, and each feature tree lists the entries its runtime section names.
- The dispatch audit log redacts URL credentials and is created owner-only.

---

## 6. Plan Seed

1. Fill `007-review-doc-reconciliation/implementation-summary.md` from the checks phase 7 ran.
2. Add the goal binding rows and a progress row through the goal log, and correct the parent out-of-scope line.
3. Rewrite the five fallback and alias passages.
4. Add the missing tree lines in four READMEs.
5. Add the URL-userinfo pattern and the 0o600 mode to `dispatch-audit.mjs`, with a test for each in `dispatch-audit.test.mjs`.
6. Run the dispatch audit tests, `validate_document.py` and `hvr_scan.py` on each changed README, and `validate.sh --recursive --strict` on the packet.
7. Close phase 7 and set its status.

---

## 7. Traceability Status

### Core protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | pass | Parent completion state, phase 7 state and the README and code drift were re-read against the current files in iteration 5 | Recorded as findings R3-P1-001, R1-P2-001 and R4-P2-002 |
| `checklist_evidence` | pass | The ticked tasks of phases 1 to 6 were checked against their Verify claims | Phase 7's open T011 and its empty summary (R3-P2-001) |

### Overlay protocols

| Protocol | Status | Note |
|----------|--------|------|
| `skill_agent` | not run | The packet changes no skill contract an agent mirrors |
| `agent_cross_runtime` | not run | Covered indirectly by `sync-runtime-mirrors.cjs --check` PASS |
| `feature_catalog_code` | not run | The packet has no feature catalog |
| `playbook_capability` | not run | Not examined |

---

## 8. Deferred Items

These are advisory only and do not change the verdict.

- **Test isolation (SL-403):** iteration 4 deferred a read of `session-lifecycle/tests/pi-session-start-advisories.test.ts` and `dsh-session-lifecycle.test.mjs`. It reviewed only their phase record and README description.
- **Existing audit logs:** a mode on `appendFileSync` applies only when it creates a file, so a log created before the fix keeps 0644 until it rotates or is removed.
- **Overlay protocols:** none of the four ran.
- **Closeout warning from the loop tooling:** `synthesis-closeout.cjs` recorded `synthesis_incomplete` with `structured_state_findings_partially_reflected_in_registry`: 11 identifiable findings against 10 registry entries. The eleventh is R5-P2-001, which iteration 5 marked `refines: R4-P2-002`. The reducer folds a refinement into its target at `reduce-state.cjs:995` but does not add the folded id to `mergedFindingIds`, which the closeout counts. `missingStructuredFindingCount` is 0, so no finding is missing from the registry. The mismatch is in the deep-loop runtime, outside this packet.

---

## Dimension Expansion Map

- Saturated directions: none recorded.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0. No Council artifacts.
- Selected directions: correctness (iteration 1), security (2), traceability (3), maintainability (4), stabilization across all four (5).
- Remaining frontier: SL-403 and the four overlay protocols.

---

## 9. Search Ledger

- **hasSearchDebt:** true. One deferred item, SL-403 (`test_isolation`).
- **Candidates covered:** doc_code_drift, doc_completeness, missing_artifact, missing_file_permission, module_resolution, secret_redaction_bypass, stale_alias_reference, stale_path_reference.
- **Candidates ruled out:** broken_symlink, flag_precedence_inversion, missing_artifact, module_resolution, raw_prompt_logging, stale_path_reference, unbounded_input.
- **Clean search proof, sample:** SL-001. Every static relative specifier and literal spawn path in the cli-dispatch, decision-capture, completion-evidence and subagent-dispatch-guard folders resolves from its importer's real path: 0 missing across 74 files. Seven proof rows in all are in `deep-review-findings-registry.json` under `cleanSearchProof`.

---

## 10. Audit Appendix

### Convergence summary

| Iteration | Dimension | New-findings ratio | Files reviewed | New findings |
|-----------|-----------|--------------------|----------------|--------------|
| 1 | correctness | 1.00 | 9 | R1-P2-001, R1-P2-002 |
| 2 | security | 0.50 | 16 | R2-P2-001, R2-P2-002 |
| 3 | traceability | 0.67 | 16 | R3-P1-001, R3-P2-001, R3-P2-002, R3-P2-003 |
| 4 | maintainability | 0.14 | 9 | R4-P2-001, R4-P2-002 |
| 5 | stabilization | 0.10 | 13 | R5-P2-001, merged into R4-P2-002 |

- Convergence score 0.90, graph convergence score 0.85.
- Terminal gates: evidence pass, scope pass, coverage pass.

### Coverage summary

- Dimensions: 4 of 4 covered (1.0).
- Every iteration passed `verify-iteration.cjs` on the first attempt, and every claim adjudication passed. No iteration errored or needed a redispatch.

### Ruled-out claims

- A broken import after the phase 3 renames or the phase 5 fallback removal: none across 74 files.
- Raw prompt bodies in the audit log: ruled out. The log keeps a capped, scrubbed command line.
- A stale renamed-folder path in live code: none.

### Sources reviewed

- Per-iteration file lists are in `iterations/iteration-001.md` to `iteration-005.md`, and the resource map is in `resource-map.md`.

### Cross-reference appendix

**Core Protocols:** `spec_code` pass, `checklist_evidence` pass (section 7).

**Overlay Protocols:** `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` were not run (section 7).
