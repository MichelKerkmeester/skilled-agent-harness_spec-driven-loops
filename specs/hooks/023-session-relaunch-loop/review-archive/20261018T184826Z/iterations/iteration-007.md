# Review Iteration 7 — Search-Debt Discharge

## Dimension

Search-debt discharge over the five deferred registry obligations (`SL-208`, `SL-209`, `SL-405`, `SL-406`, `SL-502`), touching traceability (catalog and checklist evidence) and maintainability (README drift, test coverage, duplicated logic). Every obligation is resolved to a new finding or to cited evidence in the disposition table below.

## Files Reviewed

| File | Lines | Why |
| --- | --- | --- |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | 1-200 | SL-208 quantitative claims |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | 11-14, 193, 305, 344-348 | poll, grace, timeout, lock constants |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | 378-410 | hop and age semantics |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | 51-67, 372-373 | zero acceptance and fallbacks |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | 177 | 200k window default |
| `specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md` | 54-58 | T008/T009 evidence pointers |
| `.skilled/hooks/README.md` | 28-30, 180-187, 272-278 | pointer targets |
| `.skilled/hooks/session-relaunch/README.md` | 18-21, 91-95, 147-155 | symlink and killer claims |
| `.skilled/bin/README.md` | 159, 177-179 | wrapper exit contract |
| `.skilled/bin/skilled-loop` | 6, 396-450 | approved and declined exit branches |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` | 34-42, 54-88, 92-101 | playbook pointer and process contract |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | 143-826 | OpenCode coverage inventory |

## Findings — New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Wrapper exit-contract sentence is inverted in the bin README and the command-runtimes playbook** -- `.skilled/bin/README.md:177` -- Both documents say the wrapper "exits 1 when `should-relaunch` approved the hop" and that "neither path prints a manual claim command". The wrapper does the opposite on both counts: an approved hop decodes the record, changes to the recorded cwd and relaunches, so the wrapper ends with the child runtime's exit code, and exit 1 is reserved for invalid relaunch state; and a declined decision with a pending record prints the runtime-specific manual claim command while preserving the runtime exit code. The same README contradicts the sentence nine lines later at `:179`, and the session-relaunch README describes the decode-failure exit correctly.
   - Finding class: `documentation_drift` (maintainability)
   - Scope proof: `.skilled/bin/README.md` is a declared review-scope file and the SL-405 target; the playbook is a declared review-scope file reached by SL-209's `tasks.md:56` pointer.
   - Affected surface hints: `.skilled/bin/README.md`, `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md`, `.skilled/bin/skilled-loop`, `.skilled/hooks/session-relaunch/README.md`.
   - Case: an operator scripting around `skilled-loop` treats "approved -> exit 1" as the contract, misreads a normal relaunch with the child's exit code as a failure, and does not expect the manual claim command on the pending path.
   - Evidence: [SOURCE: .skilled/bin/README.md:177]; [SOURCE: .skilled/bin/README.md:179]; [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md:40]; [SOURCE: .skilled/bin/skilled-loop:6]; [SOURCE: .skilled/bin/skilled-loop:399]; [SOURCE: .skilled/bin/skilled-loop:418]; [SOURCE: .skilled/bin/skilled-loop:440]; [SOURCE: .skilled/bin/skilled-loop:446].

## Search-Debt Dispositions

| Obligation | Disposition | Evidence |
| --- | --- | --- |
| SL-208: catalog quantitative claims vs `killer.cjs` and `relaunch-core.cjs` | ruled out — no drift | 100 ms poll [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:11]; idle 3000 / timeout 30000 / post-SIGTERM grace 5000 [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:34] [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:35] [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:12]; five-second lock window [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:14] [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:193]; 10/10 defaults [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:384]; zero hops hit `hop-cap` because `0 >= 0` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:401]; zero age is stale only when age is greater than zero because the comparison is strict `>` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:390]; zero is accepted and negatives or invalid values fall back [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:51] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:372] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:373]; 200k window default with `[1m]` models at 1M [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:177]. The catalog's `0.12` sentence is a recorded live-run observation, not a code constant. |
| SL-209: stale evidence pointers at `tasks.md:56` and `.skilled/hooks/README.md` | ruled out as a separate finding — folded into T3-P2-001 | `tasks.md:56` is the T008 row and its playbook pointer resolves: the file carries four automatable sections at `:56`, `:64`, `:72`, `:80` and four live sections at `:103`, `:118`, `:133`, `:148` [SOURCE: specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:56]. The T009 pointer cluster sits two lines lower at `:58` and all three of its `.skilled/hooks/README.md` positions are off: the concern sentence is at `:30`, `:186` is the `task-dispatch` row, and the `session-relaunch` coverage row is at `:278` [SOURCE: .skilled/hooks/README.md:30] [SOURCE: .skilled/hooks/README.md:186] [SOURCE: .skilled/hooks/README.md:278]. That is the active T3-P2-001 pointer class, so it is folded there; the playbook's line-40 exit-contract sentence is captured by the new finding. |
| SL-405: README drift in `session-relaunch/README.md` and `bin/README.md` | covered — new finding | Symlink claims were confirmed in iteration 5 and every killer quantitative claim matches (`100 ms`, `3000`, `30000`, `5000`, five-second lock) [SOURCE: .skilled/hooks/session-relaunch/README.md:91] [SOURCE: .skilled/hooks/session-relaunch/README.md:149] [SOURCE: .skilled/hooks/session-relaunch/README.md:150]. The bin README's wrapper exit-contract sentence does not match the wrapper, which is finding F7-P2-001. |
| SL-406: OpenCode adapter test coverage | ruled out — coverage adequate | The 27-test suite covers the kill switch at `:143`, pending and armed record suppression at `:273`, stale armed records at `:292`, zero max age at `:314`, session isolation at `:588`, Bun `node` spawn and both spawn-error paths at `:731`/`:764`/`:792`, and malformed events at `:826` [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:143] [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:292] [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:731] [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:826]. The reviewed adapter path is the browsability symlink to the real file the suite loads. |
| SL-502: pid-resolver duplication folded into M4-P2-001/M4-P2-003 | ruled out — fold confirmed at remediation level | The iteration-5 adjudication stands: `findCodexPid` and `findHermesPid` are byte-identical and ride the shared-helper remediation of M4-P2-001/M4-P2-003 rather than a fifth duplication finding. The registry titles name note-path helpers only, so the shared helper must take the pid resolvers with it or they should be promoted to their own row. |

## Traceability Checks

- `feature_catalog_code` (overlay): **pass** — SL-208 discharged; every code-backed catalog claim now matches its constant.
- `checklist_evidence` (core): **partial** — T3-P2-001 remains active and now carries the T009 pointer evidence; T008's playbook pointer resolves. Run-ledger receipts outside the packet were not re-verified.
- `spec_code` (core): **partial** — carried; interface-contract sections 11.10-11.11 remain unread and no claim in this iteration depends on them.
- `skill_agent` (overlay): **partial** — carried; no command surface was re-read this iteration.
- `agent_cross_runtime` (overlay): **pass** — re-confirmed at row level in iteration 6; the registry and generated configs were not touched since.
- `playbook_capability` (overlay): **partial** — argv and capability claims pass, but the playbook's process-contract sentence is finding F7-P2-001.

## Edge Cases

- SL-209's evidenceRef (`tasks.md:56`) names the T008 playbook row, while the pointer defect it describes sits on the T009 row at `:58`. The row is recorded as-is rather than silently renumbered.
- `numericSwitch` accepts zero but requires an integer for hops, so `SESSION_RELAUNCH_MAX_HOPS=1.5` falls back to 10 while `SESSION_RELAUNCH_MAX_AGE_MIN=0.5` is accepted. Both match their documented wording.
- The playbook's "four automatable checks and one live check per runtime" resolves to four automatable sections and four live sections, one per runtime, matching T008's "4 automatable checks and 4 live checks".

## Confirmed-Clean Surfaces

- Catalog constants: poll interval, killer idle/timeout/grace, lock window, hop and age semantics, zero acceptance, 200k window default.
- Session-relaunch README killer and lock behavior.
- OpenCode adapter coverage for the behaviors the catalog attributes to it.
- Wrapper argument carry and manual-command template behavior (carried from iterations 2-4).

## Ruled Out

- SL-208 catalog drift: no quantitative mismatch found.
- SL-209 as a new finding: line 56 resolves; the T009 positions fold into T3-P2-001.
- SL-406 coverage gap: the suite exercises every named adapter behavior.
- SL-502 as a separate finding: the fold is a remediation-scope decision from iteration 5.
- The catalog's `0.12` live-run sentence as a code drift: it is an operator-set threshold recorded from a live run, not a constant.

## Integration Evidence

- `.skilled/bin/skilled-loop` exit branches (approved, decode failure, unusable cwd, pending/declined).
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` switch parsing and decision CLI.
- `.skilled/hooks/session-relaunch/lib/killer.cjs`, `relaunch-core.cjs`, `context-usage.cjs` constants.
- `.opencode/plugins/tests/session-relaunch.test.cjs` and the browsability symlink at `.skilled/hooks/session-relaunch/opencode/session-relaunch.js`.
- The command-runtimes playbook and the `tasks.md` evidence rows that point at it.

## Next Dimension

- Dimension: synthesis / adjudication (all four dimensions are covered and the search-debt ledger is now empty).
- Focus area: reconcile the twelve active P2 rows with the iteration-7 dispositions and re-read F7-P2-001's two locations; no new code direction remains.
- Reason: one new P2 gives `newFindingsRatio` 0.083, below the 0.10 convergence threshold, with no P0/P1 active.
- Rotation status: post-coverage; dimension rotation complete.
- Blocked/productive carry-forward: T3-P2-001 and T3-P2-002 carried; F7-P2-001 new; SL-502 fold noted as a remediation-scope risk.
- Required evidence: reducer-refreshed registry and dashboard, plus the two carried packet-doc findings.
- Recovery note: none; iteration state is coherent.

## Verdict

No P0 and no P1 is active; one new P2 is recorded. Verdict is PASS with `hasAdvisories=true`.

Review verdict: PASS
