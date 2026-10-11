# Review Iteration 006 — Security (Silent-Input Sweep, Slice 6/10)

BINDING: target=slice 6 of 10, 17 CLI scripts under .skilled/skills/system-deep-loop
BINDING: maxIterations=10
BINDING: convergence=0.10
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep

## Dispatcher
- Route: /deep:review (auto), iteration 6 of 10, stopPolicy=max-iterations, dimension rotation security.
- Focus: orchestrator-assigned slice 6 of 10 of the CLI silent-input sweep: every script under .skilled/skills/system-deep-loop checked for (1) unknown/misspelled options accepted silently and (2) exit 0 on a detected problem, or a header documenting an option the parser rejects.
- Budget profile: verify. Prior state: P0=0 P1=6 P2=27 open; registry 33 open findings, none on this slice. 5 iteration records in the state log before this run.

## Dimension
security — silent option handling and read-only/write-path selection at trust and integrity boundaries (sweep charter).

## Files Reviewed
- .skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:507
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:58
- .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs:77
- .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs:580
- .skilled/skills/system-deep-loop/runtime/scripts/check-direct-append.cjs:99
- .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs:33
- .skilled/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs:106
- .skilled/skills/system-deep-loop/runtime/scripts/check-projection-coverage.cjs:157
- .skilled/skills/system-deep-loop/runtime/scripts/check-protocol-append-sites.cjs:43
- .skilled/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs:171
- .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:721
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:98
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:95
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:93
- .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:54
- .skilled/skills/system-deep-loop/runtime/scripts/query.cjs:106
- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2366

## Findings by Severity

### P0 Findings
None.

### P1 Findings

1. **R6-P1-001 loop-lock.cjs accepts unknown options; a misspelled --ttl-ms silently falls back to the 300000 ms default** — .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:54 (parser), :151 (ttl default) — [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:151]. parseFlags has no unknown-key branch; --ttl-msx 1800000 leaves flags.ttlMs undefined and the lock is written with ttl_ms 300000 while the deep-loop workflow templates request 1800000. --bogus-xyz is accepted with exit 0. The lock is the single-writer advisory gate every deep loop acquires, refreshes and releases (deep-review-auto.yaml:301,312,582,2414; deep-research-auto/confirm; deep-ai-council-auto/confirm).
- Case: an operator or workflow edit types --ttl-msx 1800000 (or adds a stray flag); the CLI accepts it, writes the lock with the 5-minute default TTL, and exits 0 with no diagnostic.
- Finding class: class-of-bug.
- Scope proof: rg over the slice shows the same no-unknown-branch parser in query.cjs:56-70, convergence.cjs:98-115, fanout-merge.cjs:95-113 and fanout-run.cjs:93-111; check-direct-append.cjs:96-109 shows the reject-unknown pattern exists in-repo.
- Affected surface hints: ["deep-review-auto.yaml acquire", "deep-research-auto/confirm", "deep-ai-council-auto/confirm", "loop-lock acquire/refresh/release"]
- Recommendation: declare an allowed-key set per subcommand and exit 3 (INPUT_VALIDATION) on any unknown key; keep the current required-key checks.

```json
{
  "type": "claim-adjudication",
  "claim": "loop-lock.cjs accepts unknown options silently; a misspelled --ttl-ms (proved with --ttl-msx 1800000) leaves flags.ttlMs undefined and the lock is written with the 300000 ms default, while the deep-loop workflow templates request 1800000 ms. --bogus-xyz is accepted with exit 0.",
  "evidenceRefs": [
    "loop-lock.cjs:54-71 (parseFlags has no unknown-key branch)",
    "loop-lock.cjs:151 (ttlMs default 300000)",
    "deep-review-auto.yaml:301 (acquire passes --ttl-ms 1800000)",
    "repro A1/A3 output: A3 wrote ttl_ms 300000, both exit 0"
  ],
  "counterevidenceSought": "Searched loop-lock.cjs for an unknown-key rejection equivalent to the one in check-direct-append.cjs:96-109 (none); checked whether a caller wraps the CLI and pre-validates flags (workflow YAML invokes it directly).",
  "alternativeExplanation": "The lock is documented as advisory/best-effort, so a shorter TTL may be tolerated; but the requested TTL is discarded with no diagnostic, which is the silent-input defect this sweep targets.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "A doc or caller-side check establishing 300000 ms as the intended TTL, or a wrapper that rejects unknown flags before invocation, would reduce this to P2."
}
```

2. **R6-P1-002 A --check typo selects the write path; render-contract-snapshot.cjs rewrites the tracked snapshot and exits 0** — .skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:507 — [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:507]. run() reads only argv.includes('--check'); anything else falls through to fs.mkdirSync + fs.writeFileSync of .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md and returns 0 (:525-529, :531).
- Case: a --check invocation intended as a read-only staleness check arrives as --chek or with a stray flag; the snapshot is regenerated and the command exits 0.
- Finding class: instance-only.
- Scope proof: rg over .skilled/hooks, .github, .skilled/bin and .skilled/commands found no --check caller for this script; the defect is the writer shape itself, not a wired gate.
- Affected surface hints: ["review-mode-contract-snapshot.md", "review-mode-contract.yaml render target"]
- Recommendation: reject every token except exactly --check; treat anything else as usage, exit 2.

```json
{
  "type": "claim-adjudication",
  "claim": "render-contract-snapshot.cjs reads only argv.includes('--check'); any unknown or misspelled flag (proved with --bogus-xyz, the same shape as a --chek typo) takes the write path, rewrites the tracked snapshot .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md, and exits 0.",
  "evidenceRefs": [
    "render-contract-snapshot.cjs:507 (argv.includes('--check'))",
    "render-contract-snapshot.cjs:525-529 (mkdirSync + writeFileSync)",
    "repro B2: [render-contract-snapshot] wrote ... (write intercepted by stub), run_returns=0, exit 0",
    "repro B1: --check exits 0 with OK"
  ],
  "counterevidenceSought": "Checked for a guard before the write branch (none); searched .skilled/hooks, .github, .skilled/bin and .skilled/commands for a --check caller (none found), so severity rests on the writer shape, not a live gate.",
  "alternativeExplanation": "The script may be a manual renderer where writing is the expected default; but its own drill message tells the operator to run --check to detect staleness, so a typo silently regenerates instead of detecting.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the script is never used in a verification posture (no --check caller anywhere), impact falls to a silent rewrite of a generated artifact, P2."
}
```

3. **R6-P1-003 query.cjs: a misspelled --read-only silently skips the in-memory read-only open** — .skilled/skills/system-deep-loop/runtime/scripts/query.cjs:106 — [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/query.cjs:106]. parseArgs (:56-70) has no unknown-key branch; readOnly is args.readOnly === true, and only then is db.openReadOnlyDb() called (:115). Without it the first query calls getDb()/​initDb(), which mkdirs .skilled/skills/system-deep-loop/database and opens deep-loop-graph.sqlite read-write (coverage-graph-db.ts:151, :322-327, :452). The doctor route documents the read-only form (.skilled/commands/doctor/_routes.yaml:71).
- Case: the doctor query invocation (or any read-only caller) typo-s the flag; the query still runs, still exits 0, but against a read-write database handle instead of the in-memory read-only view.
- Finding class: class-of-bug.
- Scope proof: convergence.cjs:680/:688 is the same gate shape; no other read-only guard exists in query.cjs.
- Affected surface hints: ["doctor _routes.yaml:71", "coverage-graph database", "council query path"]
- Recommendation: reject unknown flags; require an explicit write flag for the read-write open.

```json
{
  "type": "claim-adjudication",
  "claim": "query.cjs accepts unknown flags; --read-only is read as args.readOnly === true, so a misspelled --read-only (for example --read-onyl) silently skips db.openReadOnlyDb() and the first query function opens the graph database through getDb()/initDb(), which mkdirs .skilled/skills/system-deep-loop/database and opens deep-loop-graph.sqlite read-write.",
  "evidenceRefs": [
    "query.cjs:56-70 (parseArgs, no unknown-key branch)",
    "query.cjs:106 (readOnly = args.readOnly === true)",
    "query.cjs:115 (if (readOnly) db.openReadOnlyDb())",
    "coverage-graph-db.ts:151 (COVERAGE_GRAPH_DATABASE_DIR -> runtime/../database)",
    "coverage-graph-db.ts:452 getDb -> initDb; :322-327 mkdirSync + new Database",
    "doctor route .skilled/commands/doctor/_routes.yaml:71 passes --read-only"
  ],
  "counterevidenceSought": "Checked whether getDb() fails closed when no read-only open happened (it does not, it initializes the directory and database); checked for an unknown-key rejection or a strict parseArgs (none).",
  "alternativeExplanation": "The doctor route spells the flag correctly today, so the defect may never fire in practice; but nothing rejects the typo and the run still exits 0 with a read-write open.",
  "finalSeverity": "P1",
  "confidence": 0.8,
  "downgradeTrigger": "If the default database directory resolves outside the repository and an unintended read-write open has no durable effect, impact falls to P2."
}
```

4. **R6-P1-004 convergence.cjs: a misspelled --read-only drops both the read-only open and the no-write guard** — .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:680 — [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:680]. readOnly gates db.openReadOnlyDb() (:688) and every appendConvergenceObservabilityEvent call (:706, :742, :886); the parser (:98-115) accepts unknown flags. .skilled/commands/doctor/deep-loop.md:60 names query.cjs and convergence.cjs as read through their read-only forms.
- Case: a read-only convergence read with a typo (or a stray flag) opens the database read-write and appends observability events — a doctor-plane read mutates the graph.
- Finding class: class-of-bug.
- Scope proof: query.cjs:106/:115 is the same shape; no other read-only gate exists in convergence.cjs.
- Affected surface hints: ["doctor deep-loop.md:60", "observability-events.jsonl", "coverage-graph database"]
- Recommendation: same as query.cjs: unknown flags refused; explicit opt-in for writes.

```json
{
  "type": "claim-adjudication",
  "claim": "convergence.cjs shares the same parser shape; readOnly gates both db.openReadOnlyDb() and every appendConvergenceObservabilityEvent call, so a misspelled --read-only turns a read-only convergence read into a run that opens the database read-write and appends observability events.",
  "evidenceRefs": [
    "convergence.cjs:98-115 (parseArgs, no unknown-key branch)",
    "convergence.cjs:680 (readOnly = args.readOnly === true)",
    "convergence.cjs:688 (if (readOnly) db.openReadOnlyDb())",
    "convergence.cjs:706, :742, :886 (if (!readOnly) appendConvergenceObservabilityEvent(db, payload, ns))",
    ".skilled/commands/doctor/deep-loop.md:60 (query.cjs and convergence.cjs read in their read-only forms)"
  ],
  "counterevidenceSought": "Checked whether appendConvergenceObservabilityEvent is a no-op without a database (it takes the opened module) and whether any other guard rejects an unknown flag (none).",
  "alternativeExplanation": "No observed caller passes --read-only to convergence.cjs today (the doctor doc names the read-only form but no route line shows the flags), so the flip is latent; the acceptance of the typo is still silent and exit 0.",
  "finalSeverity": "P1",
  "confidence": 0.75,
  "downgradeTrigger": "If no caller ever passes --read-only to convergence.cjs, the typo has no observable flip and the finding is P2."
}
```

5. **R6-P1-005 append-state-record.cjs: a flag-shaped token becomes the state-log path; the record is appended to a junk file with exit 0** — .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs:77 — [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs:77]. target is process.argv[2] with no option parsing and no flag-shaped-path guard; the record is appended to that path (:107) and the process exits 0.
- Case: a producer passes --state-log <path> (or any flag-shaped token) instead of the positional path; the record lands in a file named after the typo and the intended log never receives it, while the command reports success.
- Finding class: instance-only.
- Scope proof: usage (line 17) and the unit test invoke a literal path; no caller or guard rejects a flag-shaped target.
- Affected surface hints: ["deep-review/deep-research state logs", "workflow append_jsonl steps"]
- Recommendation: refuse a target starting with -- (usage, exit 2).

```json
{
  "type": "claim-adjudication",
  "claim": "append-state-record.cjs has no option parser; process.argv[2] is used verbatim as the target path, so a flag-shaped token (--state-log, --bogus-xyz) is consumed as the path, the record is appended to a file named after the typo, and the command exits 0 while the intended state log never receives the record.",
  "evidenceRefs": [
    "append-state-record.cjs:77 (const target = process.argv[2])",
    "append-state-record.cjs:107 (fs.appendFileSync(target, ...))",
    "repro C: appended 89 bytes to --bogus-xyz, exit 0, file created with the record"
  ],
  "counterevidenceSought": "Checked for a flag-shaped-path guard or any option parsing (none); checked the usage line (one positional only) and the callers (workflow steps and the unit test invoke it with a literal path).",
  "alternativeExplanation": "No current caller passes a flag-shaped token, so the trigger is caller error; but the failure is silent (exit 0) and the misfiled file is the only trace, on the single append path all state records travel.",
  "finalSeverity": "P1",
  "confidence": 0.7,
  "downgradeTrigger": "If evidence shows no producer ever passes flag-like tokens, the finding collapses to P2 (low-likelihood caller error)."
}
```

### P2 Findings

6. **R6-P2-001 The documentation, projection-coverage and append-site checkers ignore unknown flags (and a valueless --dir)** — .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs:33, check-projection-coverage.cjs:157, check-protocol-append-sites.cjs:43 — the first reads flags only via argv.includes, the other two only --dir/--dir=; every other token is discarded and the default scope runs, exit 0. A misspelled scope flag silently narrows or widens the checked set; the checks are read-only and no caller surfaced in the searched hook/CI surfaces.
- Case: --dirs <path> or a stray flag on any of the three; the run reports a clean default-scope result with exit 0.
- Recommendation: reject unknown flags with a usage error (exit 1).

7. **R6-P2-002 fanout-merge.cjs and fanout-run.cjs ignore unknown flags** — .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:95, fanout-run.cjs:93 — both parsers camel-case unknown tokens into args and never reject them; required arguments are guarded, but every optional knob (for example --stop-policy, --containment-mode, --lineage-timeout-hours on fanout-run) silently falls back to its default when misspelled. fanout-run execution was withheld (it spawns write-capable executor CLIs); the defect was proven by reading the parser and its call sites.
- Case: a typo in an optional orchestration knob; the run proceeds with defaults and exit code driven by the run outcome, not by the typo.
- Recommendation: reject unknown keys in both parsers.

8. **R6-P2-003 check-ledger-stem-producers.cjs: a valueless --repo-root silently falls back to the default tree** — .skilled/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs:111 (value consumed unchecked), :392 (fallback) — the parser does reject unknown flags (exit 1, verified), but --repo-root with no value is accepted and the default repo root is checked instead, exit 0.
- Case: a wrapper builds --repo-root from an empty variable; the census runs against the wrong tree and reports ok.
- Recommendation: exit 1 when --repo-root has no value.

9. **R6-P2-004 codex-dispatch.cjs manual dispatch path accepts any --name flag** — .skilled/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs:171 — the smoke-test parser stores every --flag into opts and reads only prompt/cwd/model/effort/tier/sandbox/timeout (:176-184); a --modle typo dispatches with DEFAULT_MODEL. Execution withheld (spawns the codex CLI, external process); proven by reading.
- Case: a benchmark operator typo-s a dispatch knob; the dispatch runs with defaults and reports the model it used, exit code from the model only.
- Recommendation: whitelist the known keys and reject the rest.

## Traceability Checks
- Core spec_code: deferred — this is a CLI-configuration sweep; the slice scripts are implementations and the sweep charter is the defect definition (exhausted direction, not retried).
- Core checklist_evidence: not applicable — no checklist governs CLI flag sets or exit codes in this packet.
- Overlay skill_agent: checked — loop-lock is invoked by the deep-* workflow YAML assets; query.cjs by the doctor route; convergence.cjs named by the doctor deep-loop doc.
- Overlay agent_cross_runtime: partial — no mirror copy of the slice scripts was exercised; rg found no hook/CI invocation of the review/render scripts in the searched surfaces.
- Overlay feature_catalog_code, playbook_capability: not checked this iteration.

## Integration Evidence
- loop-lock.cjs: .skilled/commands/deep/assets/deep-review-auto.yaml:301,312,582,2414; deep-research-auto.yaml:282,589,2366; deep-research-confirm.yaml:302,625,1813; deep-ai-council-auto.yaml:120,220; deep-ai-council-confirm.yaml:127.
- query.cjs: .skilled/commands/doctor/_routes.yaml:71 (--read-only).
- convergence.cjs: .skilled/commands/doctor/deep-loop.md:60 (read-only forms).
- render-contract-snapshot.cjs and the checkers: no hook/CI/bin/command caller found in .skilled/hooks, .github, .skilled/bin, .skilled/commands.

## Edge Cases
- render-contract-snapshot B2 used a write-stub harness (fs.mkdirSync/writeFileSync replaced before require) so the write path was observed without touching the repository; B1 ran --check read-only.
- query.cjs and convergence.cjs executions were withheld because the non-read-only path would create .skilled/skills/system-deep-loop/database/deep-loop-graph.sqlite inside the workspace; the flip is proven by direct code read.
- Scratch artifacts (lock files, junk append target, empty artifact dir) were created under $TMPDIR only; no repository file was written by any repro.

## Confirmed-Clean Surfaces
- append-mode-event.cjs: rejects positionals (:58-76) and refuses records missing required keys via the required-argument check (:83, :139-141).
- check-direct-append.cjs: explicit unknown-argument rejection (UNKNOWN_ARGUMENT, exit 1) at :96-109.
- check-contract-drift.cjs: throws Unknown argument (:580); drift exits 2.
- compile-command-contracts.cjs: throws Unknown argument (:721); errors exit 1.
- reduce-state.cjs: explicit boolean/value flag whitelist, unknown flag exits 3 (:2362-2380).
- check-ledger-stem-producers.cjs: unknown-flag branch exits 1 (contrast run E2), apart from the valueless --repo-root case above.

## Ruled Out
- exit_zero_on_detected_problem (all 17 files): every inspected failure branch returns nonzero — checkers 1 or 2, render --check 1, reduce-state 2 or 3, fanout-run 2 or 3, fanout-merge 1 or 3, append gateway 2, append-state-record 1. No instance found.
- documented_option_rejected_by_parser: the usage/help texts checked (check-contract-drift --command/--accept-compiled-drift; compile-command-contracts --command; reduce-state positional + four flags; check-ledger-stem-producers --repo-root) all map to parsed options. No instance found.

## Not Proven
- No producer-side typo could be exhibited for the query.cjs/convergence.cjs read-only flag (the defect is the silent acceptance, not an observed bad run).
- The downstream consequence of the fanout-run unknown-flag acceptance (no intent-flip case proven; execution withheld).
- The codex-dispatch dispatch outcome under a misspelled flag (not executed).

## Next Focus
- Dimension: security (rotation).
- Focus area: slice 7 of 10 (orchestrator-assigned).
- Reason: stopPolicy=max-iterations; the sweep continues to iteration 10.
- Rotation status: security slice 6 complete.
- Blocked/productive carry-forward: none.
- Required evidence: parser line, usage/header text and every exit path for the next slice's files.
- Recovery note: not applicable.

## Verdict
5 P1 and 4 P2 new findings, 0 P0. Existing open findings were not touched. Review verdict: CONDITIONAL — active P1 findings remain, no active P0.

Review verdict: CONDITIONAL
