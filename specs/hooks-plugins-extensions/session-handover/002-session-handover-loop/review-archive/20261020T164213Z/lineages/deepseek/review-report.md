# Deep Review Report — Session Relaunch Loop (DeepSeek Lineage)

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 1, P2 10
- **Scope:** `specs/hooks/023-session-relaunch-loop` — the parent phase packet and phases 001 to 007, the shared relaunch core, the nudge planner, the CLI and wrapper, the killer, the five automatic runtime adapters, the OpenCode plugin, the Hermes bridge, the spec-gate runtime-state exemption, the handoff command, and the catalog, playbook, benchmark, and evidence surfaces those changes touch.
- **Run:** detached fan-out lineage `deepseek`, session `fanout-deepseek-1792421295628-xsy88n`, five iterations, stop reason `maxIterationsReached`. Convergence was telemetry only; the iteration cap owned the stop.
- **Dimension coverage:** 4 of 4 (correctness, security, traceability, maintainability), plus a broadened adapter-parity and evidence pass in iteration 5.
- **Why CONDITIONAL:** DS-004 is a P1 evidence gap in phase 007. The phase's acceptance criteria, implementation summary, and benchmark record cite `relaunch-run10.log` as durable evidence, but the file is absent from the tree and excluded by `.gitignore:263` (`*.log`). The ten P2 findings are maintained as active advisories.

No P0 finding was identified. The code paths that were previously remediated for short writes, cross-user state, EPERM, stale-record timeout, lock expiry, shell detection, and repo-root resolution are present and tested. The new findings cluster around first-run and repeated-handoff state, note confidentiality, stale-lock housekeeping, freshness by clock, evidence durability, parent and phase documentation drift, and adapter input documentation and coverage.

## 2. Planning Trigger

`/speckit:plan` is required by the CONDITIONAL verdict and the P1 evidence gap. The planning packet below seeds a remediation phase. `fixCompletenessRequired` is true because DS-004 must be repaired or the acceptance criteria amended before phase 007 can be honestly closed.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "DS-004", "severity": "P1", "dimension": "traceability", "file": "specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/acceptance-criteria.md:59-61", "title": "Phase 007 cites a live-run log that is absent and permanently ignored by Git"},
    {"id": "DS-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/session-relaunch/lib/nudge.cjs:219-260", "title": "The automatic nudge names a note path in a directory it never creates"},
    {"id": "DS-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs:418-427", "title": "A second handoff can orphan the first open note and a later nudge can reuse the stale path"},
    {"id": "DS-003", "severity": "P2", "dimension": "security", "file": ".skilled/hooks/session-relaunch/lib/nudge.cjs:209-213", "title": "Handoff notes inherit the default permissive directory and file modes"},
    {"id": "DS-005", "severity": "P2", "dimension": "traceability", "file": "specs/hooks/023-session-relaunch-loop/spec.md:39,51,62-67,79-86,122", "title": "The parent specification still counts six children and leaves the 006-to-007 handoff row undefined"},
    {"id": "DS-006", "severity": "P2", "dimension": "traceability", "file": "specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/spec.md:40,43", "title": "Phase 006's review evidence cites an absent report path and an ephemeral temp table"},
    {"id": "DS-007", "severity": "P2", "dimension": "traceability", "file": ".skilled/commands/speckit/handoff.md:33,105-107", "title": "The handoff command documents exit 3 as outside-loop only, while the CLI also returns 3 at the hop cap"},
    {"id": "DS-008", "severity": "P2", "dimension": "maintainability", "file": ".skilled/hooks/session-relaunch/lib/killer.cjs:234-242", "title": "A crash between the stale-lock rename and its removal leaves an unswept lock backup"},
    {"id": "DS-009", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs:403-417", "title": "shouldRelaunch treats a future armedAt as fresh instead of stale"},
    {"id": "DS-010", "severity": "P2", "dimension": "maintainability", "file": ".skilled/hooks/session-relaunch/pi/session-relaunch.ts:338", "title": "The carried-packet environment inputs are undocumented and differ by runtime"},
    {"id": "DS-011", "severity": "P2", "dimension": "maintainability", "file": ".skilled/hooks/session-relaunch/claude/context-nudge.mjs:121-123", "title": "The Claude and Codex nudge tests never cover a carried spec_folder"}
  ],
  "remediationWorkstreams": [
    "WS-1 Evidence durability: DS-004. Commit the run 10 log under a non-ignored name or amend the AC and benchmark to cite the tracked panes and outcome JSON.",
    "WS-2 Parent and phase documentation: DS-005, DS-006, DS-007. Update the parent count/scope/handoff row, repoint the archived report paths, and describe both exit-3 causes.",
    "WS-3 Handoff first-run and repeated preparation: DS-001, DS-002. Create the handoffs directory before planning a note, and reconcile or reuse an existing open note before a new record.",
    "WS-4 Note confidentiality: DS-003. Create the handoffs directory 0700, pin notes 0600, and stop preserving a permissive mode on claim/complete.",
    "WS-5 Lock and freshness housekeeping: DS-008, DS-009. Sweep crash-leftover lock backups and reject a future armedAt as stale.",
    "WS-6 Adapter input documentation and coverage: DS-010, DS-011. Document or unify the spec-folder inputs and add Claude/Codex nudge-payload tests."
  ],
  "specSeed": "Add a remediation phase for the P1 evidence repair and the ten P2 advisories. Keep the phase 007 live-run narrative and repoint every citation to a durable artifact or to the tracked panes. Add the first-run directory creation, repeated-prepare reconciliation, note mode guarantee, lock backup sweep, future-timestamp stale rule, and the spec-folder input documentation and tests.",
  "planSeed": "Order WS-1 first because it decides whether phase 007 is complete. Then run WS-3 and WS-5 as code lanes with tests; WS-4 depends on the WS-3 path change; WS-2 and WS-6 are documentation lanes after the code. Verification after the last lane: the relaunch node suite, the Pi vitest suite, the OpenCode plugin suite, the Hermes pytest suite, the packet's strict validator, and a fresh checkout check that every cited evidence path resolves.",
  "findingClasses": ["documentation-evidence-defect", "documentation-drift", "cross-consumer", "class-of-bug", "algorithmic", "matrix/evidence"],
  "affectedSurfacesSeed": [
    ".skilled/hooks/session-relaunch/lib/nudge.cjs",
    ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs",
    ".skilled/hooks/session-relaunch/lib/killer.cjs",
    ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs",
    ".skilled/hooks/session-relaunch/claude/context-nudge.mjs",
    ".skilled/hooks/session-relaunch/codex/shared.mjs",
    ".skilled/hooks/session-relaunch/pi/session-relaunch.ts",
    ".opencode/plugins/session-relaunch.js",
    ".skilled/commands/speckit/handoff.md",
    "specs/hooks/023-session-relaunch-loop/spec.md",
    "specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/spec.md",
    "specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/acceptance-criteria.md",
    ".skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### DS-004 — P1 — Phase 007 cites a live-run log that is absent and permanently ignored by Git

- **Dimension:** traceability
- **File:** `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/acceptance-criteria.md:59-61`
- **Evidence:** AC-006, AC-007 and AC-008 mark themselves Met with line citations into `evidence/live-run10-2026-10-19/relaunch-run10.log`; `implementation-summary.md:71` says the file was created; the benchmark report records its byte count and SHA-256 (`README.md:44-49`, `source.md:19`). The directory contains six files, none named `relaunch-run10.log`; `git ls-files` lists only the launch commands and five pane captures; `git check-ignore -v` reports `.gitignore:263:*.log` for the path.
- **Impact:** phase 007 cannot be honestly closed from a fresh checkout; the run 10 prepare/SIGTERM/relaunch timings and the hash cannot be verified.
- **Recommendation:** store the log under a non-ignored name such as `relaunch-run10.txt`, or add a targeted negation for this evidence file; re-hash and update every citation, or amend the AC to cite the tracked panes and outcome JSON and drop the log claim.
- **Disposition:** active
- **Finding class:** documentation-evidence-defect
- **Scope proof:** the three AC rows and the benchmark rows name the missing path; `git check-ignore` proves the named path cannot be committed without a negation or rename.
- **Affected surfaces:** phase 007 closure, benchmark run 10 outcomes, future review provenance.
- **First/last seen:** iteration 3 / iteration 3.

### DS-001 — P2 — The automatic nudge names a note path in a directory it never creates

- **Dimension:** correctness
- **File:** `.skilled/hooks/session-relaunch/lib/nudge.cjs:219-260`
- **Evidence:** `plannedNotePath` returns `<repo>/.skilled/skills/.state/session-relaunch/handoffs/<stamp>-<sid8>.md` through `handoffDir`, a plain `path.join`; `openNotePathFor` treats an absent directory as no open note. The manual command creates the directory at `.skilled/commands/speckit/handoff.md:65-69`, and `prepare` refuses a note whose parent is missing at `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:149-156`.
- **Impact:** a first automatic handoff on a clean checkout can fail before `prepare` runs, with no hook error.
- **Recommendation:** create the handoffs directory with `fs.mkdirSync(..., { recursive: true, mode: 0o700 })` in the planner or each adapter, add `mkdir -p -m 700` to the nudge, and add a first-run test.
- **Disposition:** active
- **Finding class:** cross-consumer
- **Scope proof:** all five automatic adapters route through `plannedNotePath`; no mkdir exists in the planner or adapters.
- **Affected surfaces:** Claude nudge, Pi extension, OpenCode plugin, Codex nudge, Hermes nudge, prepare.
- **First/last seen:** iteration 1 / iteration 1.

### DS-002 — P2 — A second handoff can orphan the first open note and a later nudge can reuse the stale path

- **Dimension:** correctness
- **File:** `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:418-427`
- **Evidence:** `prepare` writes a new pending record and overwrites the previous one; `supersedeClaimed` only completes notes already `claimed` by the session (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:486-526`); `openNotePathFor` returns the first matching `status: open` note in directory order (`.skilled/hooks/session-relaunch/lib/nudge.cjs:219-244`); the command doc tells the model to create a new timestamped note (`.skilled/commands/speckit/handoff.md:25,63-71`).
- **Impact:** work context in the abandoned note can be lost, and the nudge and the record can point at different notes.
- **Recommendation:** reuse or supersede the session's open note before a new record, prefer the newest open note, and add a two-invocation test.
- **Disposition:** active
- **Finding class:** cross-consumer
- **Scope proof:** the two planners disagree; no test covers two open notes for one session.
- **Affected surfaces:** nudge note planner, `/speckit:handoff`, prepare pending record, claim/complete lifecycle.
- **First/last seen:** iteration 1 / iteration 1.

### DS-003 — P2 — Handoff notes inherit the default permissive directory and file modes

- **Dimension:** security
- **File:** `.skilled/hooks/session-relaunch/lib/nudge.cjs:209-213`
- **Evidence:** the note directory is not created with a private mode; the manual command uses plain `mkdir -p` (`.skilled/commands/speckit/handoff.md:65-69`); `claim`/`complete` preserve the note's existing mode (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:129-132`). The core's own state directory and log are pinned to 0700 and 0600 (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:43-57, 585-609`).
- **Impact:** on a shared host or shared checkout, a second local user can read in-flight work state from a default 0755/0644 note.
- **Recommendation:** create the handoffs directory 0700, pin notes 0600, stop preserving a permissive mode, and assert the modes in tests.
- **Disposition:** active
- **Finding class:** class-of-bug
- **Scope proof:** all handoff writers use the same directory and the same preserved mode; no note mode pin exists.
- **Affected surfaces:** handoff note write, claim/complete updates, prepare read, all five automatic runtimes, `/speckit:handoff`.
- **First/last seen:** iteration 2 / iteration 2.

### DS-005 — P2 — The parent specification still counts six children and leaves the 006-to-007 handoff row undefined

- **Dimension:** traceability
- **File:** `specs/hooks/023-session-relaunch-loop/spec.md:39,51,62-67,79-86,122`
- **Evidence:** the metadata says `All six children are Complete`; the purpose says `The six child phases`; In Scope stops at phase 006; Files to Change stops at phase 006; the final handoff row is `[Criteria TBD]` / `[Verification TBD]` while the phase map lists phase 007 complete.
- **Impact:** the parent reports a different child set from its own phase map and leaves phase 7's transition unverifiable.
- **Recommendation:** say seven, add phase 007 to In Scope and Files to Change, and fill the 006-to-007 handoff row with phase 007 acceptance plus `validate.sh 007 --strict` and the run 10 benchmark row.
- **Disposition:** active
- **Finding class:** documentation-drift
- **Scope proof:** `rg` over the file shows the seven-row phase map and the six-child prose in the same document.
- **Affected surfaces:** parent closure metadata, phase scope, phase file map, 006-to-007 handoff verification.
- **First/last seen:** iteration 3 / iteration 3.

### DS-006 — P2 — Phase 006's review evidence cites an absent report path and an ephemeral temp table

- **Dimension:** traceability
- **File:** `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/spec.md:40,43`
- **Evidence:** the scope boundary and dependency cite `../review/review-report.md` and an absolute `/private/tmp/.../verification.md`; the parent 005-to-006 row at `spec.md:121` cites the same report; AC-010 at `acceptance-criteria.md:65` claims the report resolves at 37,457 bytes and AC-011 at `:66` cites `review/review-report.md:1`. The review tree holds no `review-report.md`; the generation-2 report is archived at `review-archive/20261019T144809Z/review-report.md`.
- **Impact:** phase 006's closure evidence is not reproducible from the repository, and the parent's handoff path is stale.
- **Recommendation:** repoint active citations to the archived report, copy the verification table into the packet or cite the archived section, and update AC-010 and AC-011.
- **Disposition:** active
- **Finding class:** documentation-evidence-defect
- **Scope proof:** the review tree has no report; the archive holds it; `rg` lists the stale citations.
- **Affected surfaces:** phase 006 scope, phase 006 acceptance evidence, parent 005-to-006 handoff, phase 004 continuity pointer.
- **First/last seen:** iteration 3 / iteration 3.

### DS-007 — P2 — The handoff command documents exit 3 as outside-loop only, while the CLI also returns 3 at the hop cap

- **Dimension:** traceability
- **File:** `.skilled/commands/speckit/handoff.md:33,105-107`
- **Evidence:** the CLI table and Step 5 say exit 3 means "not under `skilled-loop`"; `prepare` returns 3 inside the loop at `hops >= maxHops` after printing the hop-limit line and manual claim command and logging `prepare-declined reason=hop-cap` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:399-415`).
- **Impact:** a session at the cap may diagnose the wrapper instead of treating the cap as the intended decline.
- **Recommendation:** describe exit 3 as outside-loop or at the cap, distinguish the lines and log reasons, and add a command-doc example.
- **Disposition:** active
- **Finding class:** documentation-drift
- **Scope proof:** the CLI has two return-3 paths; the command document describes only one.
- **Affected surfaces:** `/speckit:handoff`, operator status line, hop-cap decline, auto-compaction fallback message.
- **First/last seen:** iteration 3 / iteration 3.

### DS-008 — P2 — A crash between the stale-lock rename and its removal leaves an unswept lock backup

- **Dimension:** maintainability
- **File:** `.skilled/hooks/session-relaunch/lib/killer.cjs:234-242`
- **Evidence:** `removeStaleLock` renames a non-file to `${lockPath}.stale-<pid>-<uuid>` then calls `fs.rmSync`; `sweepStaleTakeovers` at `:291-317` only matches the `${basename(lockPath)}.takeover.stale-` prefix; `rg -n "stale-"` finds no cleaner for the lock form.
- **Impact:** unbounded state-directory litter and ambiguous operator diagnostics; no direct signal or data-loss effect.
- **Recommendation:** sweep lock `.stale-*` backups by age under the mutex, or move to a reaped temp name; add a leftover test.
- **Disposition:** active
- **Finding class:** class-of-bug
- **Scope proof:** the only cleanup prefix in the module is the takeover prefix; the normal-path test does not cover a crash leftover.
- **Affected surfaces:** killer stale-lock takeover, runtime state directory, operator diagnostics.
- **First/last seen:** iteration 4 / iteration 4.

### DS-009 — P2 — `shouldRelaunch` treats a future `armedAt` as fresh instead of stale

- **Dimension:** correctness
- **File:** `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:403-417`
- **Evidence:** the age check only rejects `nowMs - armedAtMs > ageLimitMs`; a negative difference passes. Both the wrapper (`bin/session-relaunch.cjs:456-460`) and `nudge.armedRecordStillCurrent` (`lib/nudge.cjs:317-319`) use this single gate.
- **Impact:** a backward clock step or a crafted future timestamp can keep an old handoff fresh and relaunch unexpectedly; the hop cap still bounds the chain.
- **Recommendation:** treat `nowMs < armedAtMs - allowedSkewMs` as stale and add future-`armedAt` tests for the wrapper and `handoffPending`.
- **Disposition:** active
- **Finding class:** algorithmic
- **Scope proof:** `shouldRelaunch` is the only freshness gate; a fix covers both readers.
- **Affected surfaces:** wrapper should-relaunch, nudge handoffPending, armed record freshness, clock-step recovery.
- **First/last seen:** iteration 4 / iteration 4.

### DS-010 — P2 — The carried-packet environment inputs are undocumented and differ by runtime

- **Dimension:** maintainability
- **File:** `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:338`
- **Evidence:** Pi and OpenCode read `SYSTEM_SPEC_FOLDER`; Hermes reads `HERMES_SPEC_FOLDER` and passes `payload.spec_folder` (`.hermes/plugins/repo-guards/__init__.py:151,687`); Claude and Codex read `payload.spec_folder`; the environment reference lists no spec-folder variable (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:98-112`).
- **Impact:** an operator cannot discover how to bind a packet for automatic carrying, and the names differ by runtime.
- **Recommendation:** document both inputs in `ENV-REFERENCE.md` and the session-relaunch README, or unify on one variable and read it from Claude and Codex too.
- **Disposition:** active
- **Finding class:** cross-consumer
- **Scope proof:** `rg` finds the adapter reads and the goal-binding reference but no row in the environment reference.
- **Affected surfaces:** Pi adapter, OpenCode plugin, Hermes bridge, ENV-REFERENCE, session-relaunch README.
- **First/last seen:** iteration 5 / iteration 5.

### DS-011 — P2 — The Claude and Codex nudge tests never cover a carried `spec_folder`

- **Dimension:** maintainability
- **File:** `.skilled/hooks/session-relaunch/claude/context-nudge.mjs:121-123`
- **Evidence:** Claude and Codex read `payload.spec_folder`, but `rg -n "spec_folder"` in `tests/claude-adapters.test.cjs` and `tests/codex-adapters.test.cjs` finds no hit; the Claude suite covers only the seed suffix at `:233-247`.
- **Impact:** a regression that drops the nudge field on two of the five automatic runtimes would pass both suites.
- **Recommendation:** add one nudge-payload case per adapter with `spec_folder` set; if the field is not a supported host payload, remove the dead reads and document the model-written field.
- **Disposition:** active
- **Finding class:** matrix/evidence
- **Scope proof:** the two adapter files are the only automatic runtimes whose nudge field is untested; Pi/OpenCode set the variable in tests and Hermes passes the payload field.
- **Affected surfaces:** Claude context nudge, Codex shared adapter, Claude test suite, Codex test suite, D3 packet carry.
- **First/last seen:** iteration 5 / iteration 5.

## 4. Remediation Workstreams

1. **WS-1 Evidence durability (DS-004, P1):** Commit the run 10 log under a non-ignored name or add a targeted `.gitignore` negation; re-hash it; update the AC, implementation summary, benchmark README, source, and outcome JSON. If the log is intentionally local-only, amend the AC and benchmark to cite the tracked pane captures and outcome JSON and remove the line-level log claims. This lane decides whether phase 007 is honestly complete.
2. **WS-2 Parent and phase documentation (DS-005, DS-006, DS-007):** Update the parent count, purpose, scope, file table, and 006-to-007 row; repoint phase 006's scope, dependency, and acceptance citations to the archived generation-2 report; copy or cite the verification table durably; describe both exit-3 causes in the handoff command.
3. **WS-3 Handoff first-run and repeated preparation (DS-001, DS-002):** Create the handoffs directory with mode 0700 before planning a note, reuse or supersede an existing open note before writing a new record, prefer the newest open note, and add first-run and two-invocation tests.
4. **WS-4 Note confidentiality (DS-003):** Pin the handoffs directory and notes to 0700/0600, stop preserving a permissive mode on claim/complete, and add a mode assertion.
5. **WS-5 Lock and freshness housekeeping (DS-008, DS-009):** Sweep crash-leftover lock backups by age under the takeover mutex, reject a future `armedAt` beyond a small skew as stale, and add both tests.
6. **WS-6 Adapter input documentation and coverage (DS-010, DS-011):** Document or unify the spec-folder inputs, add Claude and Codex nudge-payload cases, and document whether the field is model-written or host-provided.

Order: WS-1 first (it decides closure), then WS-3 and WS-5 as code lanes with tests; WS-4 follows WS-3 because both touch the handoff path; WS-2 and WS-6 are documentation lanes after the code. The `p1` finding is not code-repair work unless the operator chooses the log-copy form.

## 5. Spec Seed

- Add a remediation phase for DS-004, DS-001 to DS-003, DS-005 to DS-011.
- Phase 007: replace the `relaunch-run10.log` citations with a durable artifact or amend the AC to the tracked panes and outcome JSON; re-state the evidence contract in `source.md`.
- Parent: say seven children, add phase 007 to In Scope and Files to Change, and fill the 006-to-007 handoff row.
- Phase 006: repoint `../review/review-report.md` to `review-archive/20261019T144809Z/review-report.md`, make the verification table durable, and update AC-010/AC-011.
- Handoff command: document the hop-cap return-3 path alongside the outside-loop path.
- Nudge and CLI: create the handoffs directory, reconcile repeated preparation, pin note modes, sweep lock backups, and reject future `armedAt`.
- Adapter docs/tests: document the spec-folder inputs and add Claude/Codex nudge-payload coverage.
- Add a fresh-checkout paper test that every cited evidence path resolves and every checked acceptance row has a committed artifact.

## 6. Plan Seed

1. WS-1: choose the durable log form, copy/rename the artifact, re-hash, and update the four citation surfaces; if the operator prefers local-only, rewrite the AC to the tracked panes and outcome JSON and remove the log lines.
2. WS-3: add directory creation with mode 0700, a repeated-prepare reconciliation, and the two tests; run the relaunch node suite and the handoff CLI suite.
3. WS-5: add the lock-backup sweep and the future-`armedAt` stale rule; run the killer and relaunch-core suites.
4. WS-4: pin the note directory and note modes; run the handoff CLI and nudge suites.
5. WS-6: add the documented inputs and the two adapter cases; run the Claude, Codex, Pi, OpenCode, and Hermes suites.
6. WS-2: update the parent and phase docs after the code and evidence lanes settle; run `validate.sh --strict` on the parent and every changed child, and the recursive validator.
7. Close with a fresh-checkout audit: `git ls-files` for every cited evidence path, the run 10 comparisons, and the packet validator.

## 7. Traceability Status

### Core protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Parent six-child drift (DS-005), handoff exit-3 drift (DS-007); the code matches the reviewed protocol otherwise. |
| `checklist_evidence` | partial | The run 10 log is missing (DS-004) and phase 006's report path is absent (DS-006); most other acceptance rows resolve. |

### Overlay protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | pass | The catalog's nudge, prepare, killer, wrapper, and seed claims match the reviewed code; the input documentation is DS-010/DS-011. |
| `playbook_capability` | partial | The three playbooks and commands resolve; the run 10 raw log is missing (DS-004). |
| `skill_agent` | notApplicable | The target is a spec folder, not a skill package. |
| `agent_cross_runtime` | notApplicable | No agent definition is the target; adapter parity was checked as behavior. |

**AC_COVERAGE:** exempt. The parent packet has no root `checklist.md` and no root `implementation-summary.md`.

**Resource Map Coverage Gate:** skipped. `specs/hooks/023-session-relaunch-loop/resource-map.md` is not present.

## 8. Deferred Items

- All ten P2 findings are active advisories; none is deferred.
- No blocked protocol or blocked search class remains. The review used `graphless_fallback` because the lineage did not have a graph service; no graph-seed step was attempted, and the direct evidence is recorded instead.
- The live-run raw log is not deferred; it is the P1 evidence gap.
- The handoff notes themselves are gitignored local state and cannot be committed; the benchmark source explicitly records that boundary. The pane captures and the note status lines in the AC are the durable substitutes where present.
- No tests or validators were run in this lineage; it is a read-only static review, and every finding carries a code or file citation rather than a test execution.

## 9. Dimension Expansion Map

- **Selected review directions:** correctness (core planner/CLI/wrapper), security (note mode, state ownership, containment, signals, spec-gate exemption), traceability (parent and phase closure, evidence, command contract), maintainability (lock housekeeping, freshness, process-table duplication), and a broadened adapter-parity/input pass.
- **Saturated directions:** none. The lineage stopped on the iteration cap, not on convergence.
- **Completed pivots:** 0.
- **Failed pivots:** 0.
- **Audited overrides:** 0.
- **Council artifact references:** none.
- **Remaining frontier:** the operator-facing choice in WS-1 between a committed log and a citation-only evidence contract; no code direction remains.

This section records breadth only. It does not alter the verdict, `hasAdvisories`, the registry, or the self-check results.

## 10. Search Ledger

### Iteration 1 — correctness

- **Covered:** `nudge_handoff_directory_creation`, `repeated_handoff_state`.
- **Ruled out:** `append_short_write`, `wrapper_seed_reconstruction`.
- **Blocked/deferred:** none.
- **Graph mode:** `graphless_fallback`.

### Iteration 2 — security

- **Covered:** `handoff_note_permissions`.
- **Ruled out:** `state_directory_ownership`, `handoff_path_escape`, `pid_reuse_signal`, `lock_takeover`, `live_shell_guard`, `runtime_state_exemption`.
- **Blocked/deferred:** none.

### Iteration 3 — traceability

- **Covered:** `phase_007_live_evidence`, `parent_phase_count`, `phase_006_review_report_path`, `handoff_exit_code_contract`.
- **Ruled out:** `archived_report_integrity`, `phase_007_other_acceptance`.
- **Blocked/deferred:** none.

### Iteration 4 — maintainability

- **Covered:** `stale_lock_backup_cleanup`, `future_armed_at`.
- **Ruled out:** `process_table_duplication`, `lock_takeover_expiry`, `unused_lock_helper`.
- **Blocked/deferred:** none.

### Iteration 5 — broadened adapter parity

- **Covered:** `carried_spec_folder_inputs`, `claude_codex_spec_folder_coverage`.
- **Ruled out:** `catalog_claims`, `playbook_commands`, `seed_parser`.
- **Blocked/deferred:** none.

### Candidate coverage and search debt

- **candidateCoverage:** required classes 27 across the five iterations; covered 11; ruled out 16; deferred 0; blocked 0. The class lists are in each iteration's `searchLedger`.
- **searchDebt:** none.
- **ruledOutCandidates:** the classes named above in each iteration.
- **cleanSearchProof:** every covered class has a finding ID and every ruled-out class has a reason and evidence reference in its iteration ledger.
- **Graph coverage mode:** `graphless_fallback` throughout; no graph service was used.

## 11. Audit Appendix

### Iteration Table

| Iteration | Focus | Dimensions | Findings (cumulative) | New | newFindingsRatio | Verdict |
|-----------|-------|------------|-----------------------|-----|------------------|---------|
| 1 | correctness | correctness | P0 0, P1 0, P2 2 | P2 2 | 1.000 | PASS |
| 2 | security | security | P0 0, P1 0, P2 3 | P2 1 | 0.333 | PASS |
| 3 | traceability | traceability | P0 0, P1 1, P2 6 | P1 1, P2 3 | 0.727 | CONDITIONAL |
| 4 | maintainability | maintainability, correctness | P0 0, P1 1, P2 8 | P2 2 | 0.154 | CONDITIONAL |
| 5 | adapter parity and documentation inputs | maintainability, traceability | P0 0, P1 1, P2 10 | P2 2 | 0.133 | CONDITIONAL |

### Convergence Replay

- **Stop policy:** `maxIterationsReached` at 5 of 5. Convergence was telemetry only; the ratios did not govern the stop.
- **Ratios:** 1.000, 0.333, 0.727, 0.154, 0.133.
- **P0 override:** not applicable; no P0 finding was active.
- **Legal-stop gates:** the traceability pass records `spec_code` and `checklist_evidence` as partial, and the missing log is the active P1. The lineage did not synthesize early; it used the fifth pass to broaden adapter parity as required.
- **Replay result:** the stored iteration records, deltas, and registry agree on 11 active findings (1 P1, 10 P2) and four covered dimensions. The replay is a self-check over this lineage's records, not an independent execution.

### Coverage Summary

- Merged dimensions: 4 of 4.
- Files reviewed: 5 iterations across the shared core, the planner, the CLI, the wrapper, the killer, five automatic adapters, the OpenCode plugin, the Hermes bridge, the handoff command, the spec-gate exemption, and the packet/benchmark docs.
- Core protocols: `spec_code` partial, `checklist_evidence` partial.
- Overlay: `feature_catalog_code` pass, `playbook_capability` partial, the other two not applicable.
- Resource map: absent; coverage gate skipped.
- AC_COVERAGE: exempt.

### Ruled-Out Claims

- **Short-write handling:** fixed; the helper compares the written byte count and throws (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:598-608`).
- **Cross-user fallback state:** fixed; the fallback name carries the uid and `ensureStateDir` checks real ownership and mode (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:43-57,157-163`).
- **Handoff path escape:** no static escape found; the validator checks lexical and real containment (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:128-191`).
- **Killer signal target:** the ancestry check is last before SIGTERM; the residual PID-reuse window is documented (`killer.cjs:579-595`).
- **Stale-lock takeover:** the mutex, expiry, and inode-checked release remain correct (`killer.cjs:347-466`).
- **Live-shell guard:** the widened list and login-dash strip are present (`session-relaunch.cjs:19-21,245-254`).
- **Spec-gate exemption:** realpath-scoped; concern README and nested `.state` paths stay gated (`spec-gate-core.mjs:1546-1584`).
- **Process-table duplication:** the CLI/adapters share `core.findLoopChildPid`; the killer keeps its fail-closed read by design.
- **Archived report integrity:** the generation-2 report states PASS with 12 P2 and its registry agrees; only the live-path citations are stale.
- **Catalog and playbook claims:** the catalog and the three playbook files resolve and match the reviewed behavior; the missing raw log is DS-004.

### Claim Adjudication

- **DS-004 (P1):** claim, evidence refs, counterevidence search, alternative explanation, final severity, confidence 0.97, and downgrade trigger are recorded in `iterations/iteration-003.md` and in the iteration record. The counterevidence search covered the repository, the benchmark folder, the sibling worktrees, `git ls-files`, and `git check-ignore`. The alternative (intentional local-only log) was rejected because the AC and benchmark treat it as durable evidence. Downgrade trigger: amend the AC and benchmark to the tracked panes/outcome JSON and remove the log claim.
- **P2 findings:** no formal adjudication is required; each carries file:line evidence and a scope proof.

### Sources Reviewed

- Parent and phase docs: `specs/hooks/023-session-relaunch-loop/spec.md`, `007-handoff-gate-exemptions/acceptance-criteria.md`, `007-handoff-gate-exemptions/implementation-summary.md`, `006-deep-review-2-remediation/spec.md`, `006-deep-review-2-remediation/acceptance-criteria.md`, `review-archive/20261018T184826Z/review-report.md`, `review-archive/20261019T144809Z/review-report.md`.
- Code: `.skilled/hooks/session-relaunch/lib/{nudge,relaunch-core,killer,context-usage}.cjs`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`, the Claude, Codex, Hermes, Pi, and OpenCode adapters, `.skilled/bin/skilled-loop`, `.skilled/commands/speckit/handoff.md`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`.
- Tests: the session-relaunch node suites, the Pi vitest suite, the OpenCode plugin suite, and the spec-gate matrix test (read, not executed).
- Docs: `.skilled/hooks/session-relaunch/README.md`, `ENV-REFERENCE.md`, `feature-catalog/context-preservation/session-relaunch-loop.md`, the three plugins-and-hooks playbooks, the benchmark run folders, and `.gitignore`.
- Lineage state: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, the five iteration files, and the five deltas.

### Run Notes and Deviations

1. The state log's first row is the thin projected config row from the append gateway; the full config is in `deep-review-config.json`, as the gateway design requires.
2. The lineage did not run the reducer. The registry, dashboard, strategy, and report were maintained by this executor inside the lineage; the synthesis closeout read the registry and state log for consistency.
3. No tests, validators, context generation, or Git writes were run. Every finding is based on direct file reads and file-tree checks.
4. The review target is a spec folder; the `skill_agent` and `agent_cross_runtime` overlays are not applicable. Adapter parity was checked as cross-runtime behavior.
5. The run 10 log is the only missing raw artifact; the six committed panes and launch commands support the live round but do not replace the AC's line-level citations.
6. The generation-2 report's LOGIC-SYNC note about search debt is historical; this lineage recorded no search debt because it used the graphless fallback and recorded direct evidence.

### Cross-Reference Appendix

#### Core Protocols

- `spec_code`: parent phase count and handoff row (DS-005); handoff command exit-3 (DS-007).
- `checklist_evidence`: phase 007 AC-006/007/008 log citations (DS-004); phase 006 report citations (DS-006).

#### Overlay Protocols

- `feature_catalog_code`: the catalog's nudge/prepare/killer/wrapper/seed claims match the code; the missing input docs are DS-010/DS-011.
- `playbook_capability`: the three playbooks and commands resolve; the run 10 raw log is missing (DS-004).
- `skill_agent` / `agent_cross_runtime`: not applicable to a spec-folder target.

Review verdict: CONDITIONAL
