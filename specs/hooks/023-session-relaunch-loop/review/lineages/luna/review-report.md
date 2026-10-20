<!-- ANCHOR:review-synthesis -->
# Deep Review Report — Session Relaunch Loop

## Executive Summary

**Verdict: FAIL**  
**Advisories:** false  
**Active findings:** P0=1, P1=4, P2=1  
**Iterations:** 10/10; terminal stop reason: `maxIterationsReached`  
**Release readiness:** blocked

This review covered the automatic handover chain for Claude Code, Pi, OpenCode, Codex, and Hermes, plus the Cursor and Devin command-only handoff paths. It traced usage reading, nudge delivery, prepare/arm state, killer timeout behavior, the linked `.skilled` topology, project hook registrations, and the handoff command contract. The active P0 means the required linked-repository topology cannot receive automatic runtime callbacks when it links only `.skilled`. Four P1 findings describe missed nudges, missing killer supervision, a stale timeout race, and a likely Cursor command-name mismatch. One command guard remains at P2 after the self-detection claim was narrowed.

The review was performed inline under the dispatcher's execution binding. No nested CLI or provider-backed runtime was launched. The review artifacts and source findings are complete; fixes, automated tests, live hops, and strict packet validation remain follow-up work.

## Planning Trigger

`/speckit:plan` is required to address the active P0 and P1 findings before the packet can claim reliable automatic handover. The phase-016 acceptance criteria also require fixes and live-hop evidence.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id":"LUNA-FANOUT-P0-001","severity":"P0","title":"A .skilled-only linked repository has no project-level automatic hook registrations","file":".skilled/hooks/session-relaunch/README.md:23"},
    {"id":"LUNA-FANOUT-P1-001","severity":"P1","title":"A Claude transcript row larger than the 256 KiB tail silently suppresses the nudge","file":".skilled/hooks/session-relaunch/lib/context-usage.cjs:46"},
    {"id":"LUNA-FANOUT-P1-003","severity":"P1","title":"killer spawn errors leave interactive runtimes armed without a retry trigger","file":".skilled/hooks/session-relaunch/claude/stop-arm.mjs:60"},
    {"id":"LUNA-FANOUT-P1-004","severity":"P1","title":"timeout cleanup can disarm a newer armed record for the same handoff path","file":".skilled/hooks/session-relaunch/lib/killer.cjs:486"},
    {"id":"LUNA-FANOUT-P1-005","severity":"P1","title":"Cursor's command mirror does not expose the documented /speckit:handoff name","file":".skilled/hooks/session-relaunch/README.md:29"},
    {"id":"LUNA-FANOUT-P1-006","severity":"P2","title":"A failed or skipped continuity save can still produce a prepared hop","file":".skilled/commands/speckit/handoff.md:61"}
  ],
  "remediationWorkstreams": [
    {"priority":"P0","title":"Provision and verify all five project-level runtime registrations for linked .skilled repositories."},
    {"priority":"P1","title":"Make Claude transcript tail parsing preserve oversized final JSONL records."},
    {"priority":"P1","title":"Roll back or retry armed state when killer spawning fails."},
    {"priority":"P1","title":"Fence killer timeout cleanup with a unique relaunch-record identity."},
    {"priority":"P1","title":"Align Cursor's documented trigger with its supported command-file name."},
    {"priority":"P2","title":"Make successful packet continuity save an explicit prerequisite to prepare."}
  ],
  "specSeed": [
    "Add linked-consumer acceptance evidence for each runtime registration, not only shell-wrapper discovery.",
    "Add source-level or testable cases for oversized final transcript rows, spawn failure, and same-path timeout supersession.",
    "Record Cursor's actual command alias and the command-only Devin direct-file path separately.",
    "Keep the continuity-save stop branch as a P2 reliability improvement."
  ],
  "planSeed": [
    "P0: add a linked-repository bootstrap/sync path and verify Claude, Pi, OpenCode, Codex, and Hermes registrations.",
    "P1: add record-aware usage tail handling and an oversized-final-row regression case.",
    "P1: make spawn failure leave a retryable state and test synchronous and asynchronous errors.",
    "P1: add record generation/CAS semantics and a same-path replacement timeout test.",
    "P1: verify and document Cursor's command-palette alias; retain Devin direct-file instructions.",
    "P2: add a clear successful-save gate before note creation and prepare."
  ],
  "findingClasses": {
    "LUNA-FANOUT-P0-001":"UNKNOWN",
    "LUNA-FANOUT-P1-001":"UNKNOWN",
    "LUNA-FANOUT-P1-003":"UNKNOWN",
    "LUNA-FANOUT-P1-004":"UNKNOWN",
    "LUNA-FANOUT-P1-005":"UNKNOWN",
    "LUNA-FANOUT-P1-006":"UNKNOWN"
  },
  "affectedSurfacesSeed":"UNKNOWN",
  "fixCompletenessRequired": true
}
```

The reducer-owned registry contains IDs, severities, titles, files, lines, and dimensions. Structured `findingClass`, `scopeProof`, and `affectedSurfaceHints` are absent there, so the packet marks those fields `UNKNOWN` rather than deriving them from narrative text.

## Active Finding Registry

### P0

- **LUNA-FANOUT-P0-001 — A .skilled-only linked repository has no project-level automatic hook registrations**  
  **Dimension:** correctness · **File:** `.skilled/hooks/session-relaunch/README.md:23` · **Disposition:** active.  
  **Evidence:** the runtime matrix lists five project-level registrations; the wrapper fixture creates only a `.skilled` symlink and checks wrapper discovery (`tests/skilled-loop-shell.test.cjs:51-58,84-98`).  
  **Impact:** without those project surfaces, automatic adapters never run in the linked consumer repository.  
  **Fix:** add and verify a bootstrap/sync step that provisions the five registrations.  
  **findingClass / scopeProof / affectedSurfaceHints:** UNKNOWN in structured reducer state.

### P1

- **LUNA-FANOUT-P1-001 — A Claude transcript row larger than the 256 KiB tail silently suppresses the nudge**  
  **Dimension:** correctness · **File:** `.skilled/hooks/session-relaunch/lib/context-usage.cjs:46` · **Disposition:** active.  
  **Evidence:** the byte tail can start inside the final row; the parser drops the partial first line and returns null (`:94-109`), and the nudge ends on null (`claude/context-nudge.mjs:71-75`). The existing test sizes its tail to include the full row (`tests/context-usage.test.cjs:182-198`).  
  **Impact:** a high-context session can miss the handoff prompt.  
  **Fix:** read a complete final record or make an oversized-record read failure observable and retryable.  
  **findingClass / scopeProof / affectedSurfaceHints:** UNKNOWN in structured reducer state.

- **LUNA-FANOUT-P1-003 — killer spawn errors leave interactive runtimes armed without a retry trigger**  
  **Dimension:** correctness · **File:** `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:60` · **Disposition:** active.  
  **Evidence:** the record is armed before the spawn attempt; both sync and async spawn-error tests assert it remains armed (`tests/claude-adapters.test.cjs:375-455`).  
  **Impact:** a final Stop can leave no process watching idle, so the wrapper has no trigger to relaunch.  
  **Fix:** roll back to pending or guarantee a retry when the killer cannot start.  
  **findingClass / scopeProof / affectedSurfaceHints:** UNKNOWN in structured reducer state.

- **LUNA-FANOUT-P1-004 — timeout cleanup can disarm a newer armed record for the same handoff path**  
  **Dimension:** correctness · **File:** `.skilled/hooks/session-relaunch/lib/killer.cjs:486` · **Disposition:** active.  
  **Evidence:** timeout cleanup compares path and unarms by status/path (`:480-508`); pending replacements remain armable while a killer owns its lock (`relaunch-core.cjs:403-415`). The existing test changes to a different path (`tests/killer.test.cjs:1291-1358`).  
  **Impact:** a newer same-path handoff can be disarmed by a stale timeout finalizer.  
  **Fix:** attach a unique record generation and compare-and-swap that identity.  
  **findingClass / scopeProof / affectedSurfaceHints:** UNKNOWN in structured reducer state.

- **LUNA-FANOUT-P1-005 — Cursor's command mirror does not expose the documented /speckit:handoff name**  
  **Dimension:** correctness · **File:** `.skilled/hooks/session-relaunch/README.md:29` · **Disposition:** active, source-based inference.  
  **Evidence:** README advertises `/speckit:handoff`, while `.cursor/commands/speckit-handoff.md` is flat. Cursor's [project command documentation](https://docs.cursor.com/en/agent/chat/commands) and [deeplink reference](https://prod.cursor.com/docs/reference/deeplinks) support a file-derived name, but the installed command palette was not checked live.  
  **Impact:** operators may not find the manual handoff command by following the documented trigger.  
  **Fix:** verify and document the Cursor alias or add a supported mirror. Devin remains a separate direct-file path per `.devin/SYNC.md:18-21` and README `:45`.  
  **findingClass / scopeProof / affectedSurfaceHints:** UNKNOWN in structured reducer state.

### P2

- **LUNA-FANOUT-P1-006 — A failed or skipped continuity save can still produce a prepared hop**  
  **Dimension:** correctness · **File:** `.skilled/commands/speckit/handoff.md:61` · **Disposition:** active, downgraded P1 → P2 in iteration 10.  
  **Evidence:** the command directs a packet save before prepare, but has no explicit failure stop branch; `prepare` validates the note/session and does not receive a save result (`session-relaunch.cjs:361-381,418-439`). The skill's self-detection rule is conditional (`SKILL.md:244`), and the implementation summary says this command has no blocking phases (`implementation-summary.md:81-83`); the template's universal wording conflicts with that rule.  
  **Impact:** a runner that mishandles a save error could continue with stale packet state. The review does not claim normal compliant execution skips the save.  
  **Fix:** require a successful save result before note creation and prepare, and stop on failure.  
  **findingClass / scopeProof / affectedSurfaceHints:** UNKNOWN in structured reducer state.

The registry retains the original P1-006 title as the stable fallback identity. Iteration 10 narrows the supported claim and records its severity transition to P2; it is the same finding, not a second item.

## Remediation Workstreams

1. **P0 — Linked-repository registration.** Provide one supported setup path for the `.claude`, `.pi`, `.opencode`, `.codex`, and `.hermes` project registrations, then verify a consumer repo that links `.skilled` and nothing else receives each callback.
2. **P1 — Usage record parsing.** Handle a transcript tail that begins within an oversized final assistant row and add a regression case that uses the default 262144-byte tail.
3. **P1 — Killer start failure.** Make the state retryable when spawn throws or emits an error; test both failure modes and the final-Stop/no-later-event case.
4. **P1 — Stale timeout identity.** Use a unique record generation or equivalent compare-and-swap in timeout cleanup; add a same-path replacement regression case.
5. **P1 — Cursor command name.** Check the live Cursor palette, then align the README alias or supported command mirror. Keep Devin's direct-file instructions separate.
6. **P2 — Continuity save guard.** Add an explicit success gate before prepare and stop with a clear error if the save fails.

## Spec Seed

- Add an acceptance case for a consumer repository with only `.skilled` linked and require each of the five project registrations to be provisioned and observed.
- Add failure cases for an oversized final Claude usage row, synchronous/asynchronous killer spawn errors, and same-path timeout supersession.
- Record the actual Cursor command alias and preserve Devin's documented direct-read invocation.
- Retain the packet continuity-save gate as a P2 reliability requirement.
- Keep AC-004/AC-005 fix evidence and AC-006 live-hop evidence separate from this read-only review result.

## Plan Seed

- Provision project hook/plugin registrations for linked consumer repositories and verify all five automatic adapters.
- Add an oversized final-row parsing regression and fix the usage reader.
- Restore retryable state after killer spawn failure and test both error channels.
- Add record identity fencing and a same-path timeout test.
- Confirm Cursor's command palette alias and update the command matrix.
- Add a successful continuity-save check before `prepare`.
- After fixes, rerun the session-relaunch test suite, execute live hops on Claude, Pi, OpenCode, Codex, and Hermes including a linked repo, then validate the packet.

## Traceability Status

### Core Protocols

- **spec_code — FAIL.** Phase 016 requires the linked `.skilled` case and asks whether the five automatic handovers fire. The current link-only fixture demonstrates wrapper discovery but does not provision project hook registrations. Evidence: phase-016 `spec.md:156-175`; `.skilled/hooks/session-relaunch/README.md:23-30`; `tests/skilled-loop-shell.test.cjs:51-58`.
- **checklist_evidence — advisory-shortfall.** AC-001/002 are recorded Met in phase-016 `acceptance-criteria.md:25-36`. AC-003 was Unmet before this run; ten iteration artifacts now exist through the dispatcher's inline execution binding, but the literal CLI binary/model behavior was not independently exercised. AC-004/005 remain Unmet pending fixes; AC-006 remains Unmet pending live hops (`acceptance-criteria.md:37-55`). Tasks T006-T013 remain unchecked; the task file records 2/12 P0, 0/13 P1, and 0/1 P2 checklist items verified (`tasks.md:30-162`).
- **AC_COVERAGE — exempt.** The review target is the root spec folder. Its `checklist.md` and root `implementation-summary.md` are absent, so the lifecycle AC coverage signal is exempt under the workflow rule. The phase-016 child packet has its own acceptance criteria and remains open as above.

### Overlay Protocols

- **skill_agent — PARTIAL.** The handoff command uses the plain workflow structure. The skill makes self-detection conditional on blocking phases, while the template says every workflow command must include it. The phase-016 implementation summary records this conflict. Iteration 10 withdrew the universal requirement claim and retained only the explicit save-failure stop branch as P2.
- **agent_cross_runtime — FAIL.** The five project registration surfaces were inspected. A `.skilled` symlink alone does not provide those sibling paths.
- **feature_catalog_code — PARTIAL.** The runtime matrix correctly separates automatic runtimes from command-only runtimes, but the linked-consumer setup lacks the registrations required by the automatic claims.
- **playbook_capability — PARTIAL.** Source and existing test evidence were reviewed. This lineage did not run the application test suite or provider-backed live hops.

## Resource Map Coverage Gate

- **Entries touched:** 0 of 6 resource-map paths appear in applied reports; no `applied/T-*.md` reports exist under the review target.
- **Entries not touched:** 6 paths, all `expected-by-scope` because this review is read-only and no implementation report exists: `.skilled/hooks/session-relaunch/README.md`, `.skilled/commands/speckit/handoff.md`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`, `.skilled/hooks/session-relaunch/claude/stop-arm.mjs`, `.skilled/hooks/session-relaunch/lib/context-usage.cjs`, `.skilled/hooks/session-relaunch/lib/killer.cjs`.
- **Implementation paths absent from resource-map:** 0; no applied report supplies `target_files` to compare.

## Deferred Items

- Fix all active P0/P1 findings before claiming reliable handover; address the P2 save guard in the phase-016 remediation.
- Confirm the Cursor alias in a live command palette; the finding remains source-based until then.
- Run the session-relaunch tests and provider-backed live hops on the five automatic runtimes, including the linked-repository topology.
- Update phase-016 AC/task evidence after remediation and run strict validation at closure.
- The normal phase-save step was skipped because it would write outside the lineage. No packet continuity or source file was changed.

## Dimension Expansion Map

- **Coverage:** correctness, security, traceability, and maintainability all show covered in reducer state.
- **Selected directions:** transcript usage and nudge suppression; event/arm and killer state; timeout and wrapper behavior; linked repository and registration surfaces; command-only entrypoints and authoring contract; acceptance/task evidence.
- **Divergence state:** no started/completed/failed pivots, no audited overrides, no saturated directions, and no remaining frontier are recorded by the reducer.
- **Council artifacts:** none.
- **Open evidence edge:** live Cursor command-palette confirmation remains blocked in the source-only pass. Provider-backed hops are deferred follow-up, not a search-debt entry.

## Search Ledger

- **Search coverage:** required classes 8/8 covered: `adversarial_recheck_open_findings`, `checklist_evidence`, `automatic_project_hook_registration`, `oversized_jsonl_record`, `killer_spawn_failure`, `same_path_record_replacement`, `command_name_resolution`, `continuity_save_completion`. Three classes ruled out: `universal_self_detection_requirement`, `devin_direct_file_entrypoint`, `plain_workflow_contract`. Deferred: 0. Blocked: live Cursor command-palette confirmation. Mode: `graphless_fallback`.
- **Candidate coverage:** 32 covered; 31 ruled out; none deferred or blocked. Covered: `adversarial_recheck_open_findings`, `arm_event_identity`, `armed_record_freshness`, `automatic_project_hook_registration`, `checklist_evidence`, `command_name_resolution`, `continuity_save_completion`, `cwd_restore`, `devin_direct_file_entrypoint`, `duplicate_review_finding`, `held_nudge_delivery`, `hermes_project_plugin_scope`, `idle_detection`, `kill_target_and_grace`, `killer_spawn_failure`, `linked_repo_root_resolution`, `oversized_jsonl_record`, `plain_workflow_contract`, `prepare_refusal`, `re_nudge_boundary`, `receiving_seed_claim`, `runtime_argument_carry`, `runtime_invocation_classification`, `same_path_record_replacement`, `shared_state_and_install_config`, `shell_wrapper_discovery`, `silent_nudge_suppression`, `spec_folder_record_transport`, `suppression_order`, `timeout_record_supersession`, `tty_gate`, `wrapper_exit_decision`.
- **Candidate classes ruled out:** `arm_event_identity`, `armed_record_freshness`, `devin_direct_file_entrypoint`, `different_path_record_change`, `duplicate_live_killer`, `duplicate_review_finding`, `freshness_before_signal`, `held_nudge_delivery`, `hermes_project_plugin_scope`, `hop_cap_signal`, `idle_detection`, `install_root_realpath_breaks_note_validation`, `kill_target_and_grace`, `linked_repo_root_resolution`, `linked_skilled_wrapper_lookup`, `path_containment_escape`, `plain_workflow_contract`, `re_nudge_boundary`, `receiving_seed_claim`, `runtime_argument_carry`, `runtime_flag_conflict`, `runtime_invocation_classification`, `shell_wrapper_discovery`, `spec_folder_record_transport`, `stale_future_armedAt_suppression`, `stale_rearm_timestamp`, `suppression_order`, `transcript_missing_grace`, `tty_gate`, `universal_self_detection_requirement`, `wrapper_exit_decision`.
- **Search debt:** none (`searchDebt=[]`).
- **Ruled-out candidate records:** SL-002, SL-003, SL-004, SL-005, SL-007, SL-008, SL-009, SL-010, SL-012, SL-013, SL-016, SL-020, SL-021, SL-022, SL-023, SL-024, SL-025, SL-026, SL-027, SL-031, SL-032, SL-033. Their source evidence and proofs are preserved in `deep-review-findings-registry.json` under `ruledOutCandidates` and `cleanSearchProof`.
- **Clean-search proof IDs:** SL-002, SL-003, SL-004, SL-005, SL-007, SL-008, SL-009, SL-010, SL-012, SL-013, SL-016, SL-020, SL-021, SL-022, SL-023, SL-024, SL-025, SL-026, SL-027, SL-031, SL-032, SL-033.

## Audit Appendix

### Convergence Summary

- Iterations: 10/10; stop reason: `maxIterationsReached`.
- Verdict: FAIL, recomputed from active P0=1, P1=4, P2=1.
- Dimension coverage: 4/4. Convergence score: 1.0; graph convergence: 0 (graphless fallback).
- Registry: six active findings and one resolved finding. The iteration-3 bound packet-path claim remains resolved.
- Claim adjudication: iteration 10 passed with five active P0/P1 findings and no missing packets.

### Coverage Summary

The ten iteration narratives and delta rows are present. The final pass re-read all six open findings and phase-016 checklist evidence. Runtime tests and live hops were not run; the source-only evidence does not satisfy the remediation and live-proof acceptance rows.

### Ruled-Out Claims

Thirty-one candidate classes are marked ruled out by the reducer, with 22 structured clean-search proofs. The report preserves those proof IDs and the full evidence objects in the registry. The prior iteration 9 search found no duplicate report for the Cursor-name or continuity-save findings; adjacent handoff defects were rechecked as addressed.

### Sources Reviewed

- Iterations 1-10, deltas 001-010, `deep-review-state.jsonl`, findings registry, dashboard, strategy, and generated resource map.
- Session-relaunch README, runtime adapters, shared context parser/state core, killer, shell shim, project registration files, and their existing test sources.
- Phase-016 spec, acceptance criteria, tasks, implementation summary, handoff command, and `sk-create-command` skill/template.
- Cursor official command and deeplink documentation linked above.

### Core Protocols

- **spec_code:** phase-016 requirements compared against current source; linked consumer registration remains a P0 gap.
- **checklist_evidence:** acceptance and task status preserved as read; no rows were edited; AC-004/005/006 remain open.

### Overlay Protocols

- **skill_agent:** conditional skill rule and conflicting universal template wording recorded; handoff command remains structurally plain.
- **agent_cross_runtime:** five runtime registrations compared against the link-only consumer topology.
- **feature_catalog_code:** documented runtime matrix compared against automatic and command-only source surfaces.
- **playbook_capability:** source and existing-test references reviewed; provider-backed capabilities remain unverified in this run.

<!-- /ANCHOR:review-synthesis -->
