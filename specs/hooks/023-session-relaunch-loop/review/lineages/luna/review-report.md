# Deep Review Report — Session Relaunch Loop

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 0, P2 5
- **Scope:** `specs/hooks/023-session-relaunch-loop` (`spec-folder`), reviewed in three dimension passes.
- **Stop reason:** `maxIterationsReached` (three of three iterations; convergence was telemetry only).
- **Dimension coverage:** correctness, security, and traceability reviewed; maintainability remains uncovered because the four-dimension request exceeded the three-iteration cap.

No P0 or P1 finding was identified. The five P2 findings cover one event-log integrity edge case, two conditional process/state security edges, and two packet traceability inconsistencies. Two security findings are static inferences and require targeted reproduction to confirm their precise runtime conditions.

## 2. Planning Trigger

`/speckit:plan` is not required by the PASS verdict. The active P2 advisories can be addressed in a follow-on packet if the operator chooses.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id":"LUNA-001","severity":"P2","dimension":"correctness","file":".skilled/hooks/session-relaunch/lib/relaunch-core.cjs:580","title":"appendLog accepts a short write as complete"},
    {"id":"LUNA-002","severity":"P2","dimension":"security","file":".skilled/hooks/session-relaunch/lib/relaunch-core.cjs:42-46,143-145","title":"The fallback state directory is shared across users on systems with a shared temp directory"},
    {"id":"LUNA-003","severity":"P2","dimension":"security","file":".skilled/hooks/session-relaunch/lib/killer.cjs:449-464","title":"The killer can signal a reused PID after its ancestry check"},
    {"id":"LUNA-004","severity":"P2","dimension":"traceability","file":"specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/spec.md:40,43","title":"Phase 5 depends on a review-report path that is absent"},
    {"id":"LUNA-005","severity":"P2","dimension":"traceability","file":"specs/hooks/023-session-relaunch-loop/spec.md:39,92-98","title":"The parent handoff criteria still count four children while the phase map lists five"}
  ],
  "remediationWorkstreams": [
    "P2: verify complete append writes and add a forced short-write test (LUNA-001)",
    "P2: scope fallback state under a per-user directory and bind signals to process identity where supported (LUNA-002, LUNA-003)",
    "P2: update the archived review dependency path and align the parent child-count criterion (LUNA-004, LUNA-005)"
  ],
  "specSeed": [
    "Define behavior when XDG_RUNTIME_DIR is absent on systems with a shared temporary directory.",
    "Clarify the parent completion criterion after adding Phase 5.",
    "Point Phase 5 and its parent handoff row to the archived report or restore the declared canonical report path."
  ],
  "planSeed": [
    "Add a test seam for short writeSync results and ensure appendLog detects incomplete writes.",
    "Add an isolated shared-temp fallback test with XDG_RUNTIME_DIR unset and a pre-created state path.",
    "Evaluate a stable process identity/handle for killer signaling and add a controlled PID-reuse case where supported.",
    "Update and verify the Phase 5 report references and the parent phase-count wording."
  ],
  "findingClasses": ["io-error-handling", "cross-user-state-directory", "process-identity-race", "documentation-evidence-defect", "parent-child-contract-drift"],
  "affectedSurfacesSeed": [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/lib/killer.cjs", "specs/hooks/023-session-relaunch-loop/spec.md", "specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/spec.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### LUNA-001 — P2 — appendLog accepts a short write as complete

- **Dimension:** correctness
- **File:** `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:580`
- **Evidence:** one `fs.writeSync` call ignores the returned byte count, then the helper fsyncs and returns the full event (`:580–585`). The shared helper is used by adapters, the wrapper, and the killer. Existing test source covers concurrent append uniqueness and partial tails, but not a forced short write (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:749–810`).
- **Impact:** if the filesystem call reports a short write, the final part of a `relaunch.log` event is lost while the helper reports success. The next append can restore a line boundary, but not the lost bytes.
- **Recommendation:** write until the buffer is complete or raise an error on an incomplete result; add a stubbed short-write test.
- **Disposition:** active P2; static inference, with the failure path confirmed by observing a short result from `writeSync`.
- **Finding class:** `io-error-handling`.
- **Scope proof:** all inspected runtime event producers route through the shared append helper.
- **Affected surfaces:** Claude, Codex, Hermes, Pi, OpenCode, wrapper, and killer event logging.

### LUNA-002 — P2 — The fallback state directory is shared across users on systems with a shared temp directory

- **Dimension:** security
- **File:** `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:42–46,143–145`
- **Evidence:** without `XDG_RUNTIME_DIR`, `stateDir` uses `os.tmpdir()` plus fixed name `skilled-relaunch`; `ensureStateDir` accepts the existing path and chmods it. The killer test fixture always supplies `XDG_RUNTIME_DIR` (`killer.test.cjs:22–43`).
- **Impact:** on a shared temporary directory, such as Linux `/tmp`, another local user can pre-create the fixed directory. A second user's attempt to chmod that foreign-owned directory can fail and deny relaunch state in this fallback configuration.
- **Recommendation:** use a per-user fallback directory and verify ownership before changing permissions or writing state.
- **Disposition:** active P2; conditional static inference. A shared-temp test with an unset `XDG_RUNTIME_DIR` and pre-created path would confirm the denial path.
- **Finding class:** `cross-user-state-directory`.
- **Scope proof:** `stateDir` is the common path builder for relaunch records and killer locks; `ensureStateDir` is used before those operations.
- **Affected surfaces:** state setup, relaunch records, killer locks, and event logs when the runtime environment omits `XDG_RUNTIME_DIR`.

### LUNA-003 — P2 — The killer can signal a reused PID after its ancestry check

- **Dimension:** security
- **File:** `.skilled/hooks/session-relaunch/lib/killer.cjs:449–464`
- **Evidence:** the killer checks loop ancestry and liveness by numeric PID, reads the armed record, then calls `process.kill` on the same number. It does not bind that signal to a stable identity for the process that passed the ancestry check.
- **Impact:** if the target exits and the operating system reuses its PID in that interval, `SIGTERM` could reach a replacement process.
- **Recommendation:** revalidate process identity immediately before signaling and use a stable process handle where the platform supports one.
- **Disposition:** active P2; low-probability static inference. A controlled PID-reuse case or stable process handle would confirm or close the gap.
- **Finding class:** `process-identity-race`.
- **Scope proof:** the checked process-tree relationship is a point-in-time property; the actual signal is sent later by PID.
- **Affected surfaces:** the killer's final session termination path.

### LUNA-004 — P2 — Phase 5 depends on a review-report path that is absent

- **Dimension:** traceability
- **File:** `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/spec.md:40,43`; parent handoff row at `spec.md:114`
- **Evidence:** both specifications require `review/review-report.md`. That path is absent; the report and registry exist under `review-archive/20261018T184826Z/`.
- **Impact:** the declared Phase 5 dependency cannot be followed from its specified path, so the remediation phase's review source is not reproducible through the packet's current links.
- **Recommendation:** update both links to the archived report and registry, or restore the declared canonical report path.
- **Disposition:** active P2; confirmed path mismatch. The archived report content and registry counts agree with the dependency summary.
- **Finding class:** `documentation-evidence-defect`.
- **Scope proof:** root handoff criterion and Phase 5 dependency name the missing file directly.
- **Affected surfaces:** phase handoff verification, remediation provenance, and future packet review.

### LUNA-005 — P2 — The parent handoff criteria still count four children while the phase map lists five

- **Dimension:** traceability
- **File:** `specs/hooks/023-session-relaunch-loop/spec.md:39,92–98`
- **Evidence:** metadata requires “All four children” to be complete; the phase table lists 1 through 5 and includes Phase 5 as a child.
- **Impact:** the parent completion criterion does not establish whether Phase 5 is included in the required child set.
- **Recommendation:** change the criterion to five children or identify the four phases it covers and state how Phase 5 participates.
- **Disposition:** active P2; confirmed specification inconsistency.
- **Finding class:** `parent-child-contract-drift`.
- **Scope proof:** both statements are in the parent spec's current metadata and phase map.
- **Affected surfaces:** parent packet closure and downstream readers using the handoff criterion.

## 4. Remediation Workstreams

All findings are P2 advisories; no P0 or P1 workstream applies.

1. **Append integrity — LUNA-001:** make the append helper detect incomplete writes and add a focused failure-path test.
2. **State isolation and process identity — LUNA-002, LUNA-003:** exercise the no-XDG shared-temp fallback and assess stable process identity for the killer's signal path.
3. **Packet traceability — LUNA-004, LUNA-005:** repair the archived review links and align the parent completion criterion with the five-phase map.

## 5. Spec Seed

- Define a private per-user fallback when `XDG_RUNTIME_DIR` is unset.
- Define the expected behavior for incomplete `writeSync` results and process identity changes before signaling.
- Align Phase 5's report dependency and the parent handoff count with current packet structure.

## 6. Plan Seed

- Add a short-write injection test; make appendLog detect an incomplete write.
- Add a fallback-path test using an isolated shared temp root and a pre-created state path.
- Add a controlled process identity check around signaling, using a stable handle on supported platforms.
- Update and resolve the report path references; revise the parent handoff count; verify both paths.

## 7. Traceability Status

### Core Protocols

- **Implementation evidence:** LUNA-001 through LUNA-003 cite the shared log writer, state path builder, and killer signal path.
- **Test evidence:** source tests cover standard concurrent append, transcript disappearance, stale-lock exclusivity, and state-directory mode. Tests were not run in this review.
- **Finding linkage:** each active finding has an ID, severity, title, and file reference in the iteration state and delta rows.
- **AC_COVERAGE:** exempt for the parent target; it has no root `checklist.md` or root `implementation-summary.md`. Phase 5's separate acceptance criteria were inspected for LUNA-004/005 traceability.

### Overlay Protocols

- The parent handoff path and Phase 5 dependency point to an absent current report path (LUNA-004).
- The parent metadata and phase map disagree on the number of children (LUNA-005).
- The inspected AC-001 citation resolves to the run-ledger rows; the archived report's PASS/P2 counts match its registry.

No resource-map artifact is configured in this lineage, so the Resource Map Coverage Gate is not applicable.

## 8. Deferred Items

- **Maintainability review:** not covered because the hard cap allowed three passes for four requested dimensions. The review did not infer maintainability coverage from the other passes.
- **Graph-backed coverage:** the workflow's graph-seed step would write packet-level state outside the authorized lineage; graph and semantic search were unavailable. The reducer records `graph_backed_coverage` as blocked search debt.
- **Behavioral reproduction:** tests were not run. The short-write, shared-temp, and PID-reuse findings need focused isolated confirmation.
- **Workflow write boundary:** generic packet review-root migration was skipped. The stock synthesis step stages event files in a temporary directory; this run stages the synthesis event in the lineage's `events/` directory instead. No continuity save was run because it would write outside the lineage.

## Dimension Expansion Map

- **Covered:** correctness, security, traceability.
- **Remaining frontier:** maintainability.
- **Pivots:** none; each iteration followed the next configured dimension.
- **Breadth limits:** no packet coverage graph or semantic search was available; graph seed and migration were skipped under the write authorization.

## 9. Search Ledger

- **Required classes in the latest pass:** `remediation_report_dependency_path`, `phase_count_handoff_criteria`, `acceptance_evidence_links`, `archived_report_registry_alignment`.
- **Covered:** `append_short_write_handling`, `cross_user_state_directory_collision`, `pid_reuse_before_signal`, `remediation_report_dependency_path`, `phase_count_handoff_criteria`.
- **Ruled out:** `append_concurrency`, `partial_tail_recovery`, `state_directory_permissions`, `handoff_path_escape`, `stale_lock_takeover_race`, `transcript_disappearance_signal`, `acceptance_evidence_links`, `archived_report_registry_alignment`.
- **Deferred:** none.
- **Blocked:** `graph_backed_coverage` because the graph seed writes outside the lineage authorization.
- **Graph coverage mode:** graphless fallback.
- **Reducer search debt:** one blocked graph-backed coverage item. The append-only state history also retains the original iteration 2 and 3 records that lacked `bugClass`; corrected iteration records were appended through the gateway and the latest records carry the required classes. The reducer's aggregated candidate coverage still contains `UNKNOWN` entries from those original records.
- **Clean search proof:** reducer emitted ruled-out evidence for `append_concurrency`, `partial_tail_recovery`, `state_directory_permissions`, `handoff_path_escape`, `stale_lock_takeover_race`, `transcript_disappearance_signal`, `acceptance_evidence_links`, and `archived_report_registry_alignment`.

## 10. Audit Appendix

### Convergence and Coverage Summary

- Iterations: 3/3; stop reason: `maxIterationsReached`.
- Convergence telemetry: final reducer score 0.00 against configured threshold 0.10; it did not change the max-iteration stop policy, and the loop completed all three passes.
- Findings: P0 0, P1 0, P2 5; verdict PASS with advisories.
- Dimension coverage: 3/4; maintainability not reviewed.
- Search debt: one blocked graph-seed class; one `UNKNOWN` coverage artifact remains from the original untyped iteration rows noted above.

### Ruled-Out Claims

- Normal full-write concurrent append, partial-tail line separation, and mode `0700` were supported by source and test inspection.
- Handoff traversal, two-killer stale-lock takeover, and transcript disappearance before signaling were supported by source and test inspection.
- The selected Phase 5 AC-001 run-ledger references resolve; the archived review report and registry agree on PASS with 12 P2 findings.

### Sources Reviewed

- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` and its append-focused tests.
- `.skilled/hooks/session-relaunch/lib/killer.cjs`, its tests, and the CLI handoff path validator.
- `specs/hooks/023-session-relaunch-loop/spec.md` and Phase 5 spec, acceptance criteria, implementation summary, and run ledger.
- `specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/review-report.md` and `deep-review-findings-registry.json`.
- Deep-review workflow YAML, prompt/output contract, append gateway, reducer, and iteration verification contract.

### Cross-Reference Appendix

#### Core Protocols

- Shared append producer: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:555–585`.
- State directory path and mode: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:42–46,143–145`.
- Killer process checks and signal: `.skilled/hooks/session-relaunch/lib/killer.cjs:449–469`.
- Review state and delta records were appended through the mode-event gateway; structural iteration verification passed for all three iterations.

#### Overlay Protocols

- Parent phase handoff: `specs/hooks/023-session-relaunch-loop/spec.md:39,92–115`.
- Phase 5 dependency and requirements: `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/spec.md:40–43,117–129`.
- Phase 5 AC-001 and run-ledger evidence: `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md:54`; `scratch/run-ledger.md:429–456`.
- Archived deep-review report and registry: `review-archive/20261018T184826Z/`.

Review verdict: PASS
