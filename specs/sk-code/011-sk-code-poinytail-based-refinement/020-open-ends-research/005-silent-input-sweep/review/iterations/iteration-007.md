# Review Iteration 007 — Traceability (Silent-Input Sweep, Slice 7/10)

BINDING: target=slice 7 of 10, 23 CLI scripts under .skilled/skills/system-deep-loop and .skilled/skills/system-skill-advisor
BINDING: maxIterations=10
BINDING: convergence=0.10
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep

## Dispatcher
- Route: /deep:review (auto), iteration 7 of 10, stopPolicy=max-iterations, dimension traceability.
- Focus: orchestrator-assigned slice 7 of 10 of the CLI silent-input sweep: 23 scripts (7 deep-loop runtime, 6 system-skill-advisor runtime, 5 routing-accuracy, 5 Python CLIs) checked for (1) unknown/misspelled options accepted silently and (2) exit 0 on a detected problem, or a header documenting an option the parser rejects.
- Prior state: P0=0 P1=11 P2=31 open; registry 42 open findings, none on this slice. Repros A-J executed from the repo root; no repo writes (one write-path repro ran with fs.writeFileSync stubbed in-process).

## Dimension
traceability — silent option handling at parser/gate/writer boundaries in the slice (spec-code traceability of the two charter defect classes), plus consumer traceability for the new findings.

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:220
- .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1367
- .skilled/skills/system-deep-loop/runtime/scripts/status.cjs:61
- .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:78
- .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:48
- .skilled/skills/system-deep-loop/runtime/scripts/verify-authority.cjs:165
- .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:92
- .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh:29
- .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:63
- .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:41
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:387
- .skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh:9
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:129
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:216
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:194
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs:92
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/gate3-corpus-runner.mjs:9
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:242
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_bench.py:250
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py:260
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4753
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:1076
- .skilled/skills/system-skill-advisor/runtime/scripts/verify-zombie-soak.sh:22

## Findings by Severity

### P0 Findings
None.

### P1 Findings

1. **R7-P1-001 status.cjs accepts unknown options; a misspelled --read-only silently drops the read-only open and appends an observability event** — .skilled/skills/system-deep-loop/runtime/scripts/status.cjs:61 (parser), :121, :129, :168/:199 (write) — [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/status.cjs:61]. parseArgs (61-70) turns every --token into a key with no unknown-key branch; readOnly is args.readOnly === true (:121), so a typo leaves the read-only open (:129) un-called and the success path appends an observability event (:168 council, :199 coverage) before exiting 0.
- Case: an operator or workflow passes --read-onl (or any stray flag) intending a read-only status query; the query runs, writes an observability event, and exits 0 with no diagnostic.
- Evidence: repro A: --bogus-xyz accepted; the run failed only on the unrelated missing specFolder (exit 3, INPUT_VALIDATION), with no unknown-flag message. Repro A2: --read-onl accepted; failure came from specFolder namespace validation, not flag rejection. Lines 121/129/168/199 fix the consequence.
- User impact: a read-only intent silently becomes a write against the deep-loop graph database; the ledger gains an event the caller believed was suppressed.
- Finding class: class-of-bug.
- Scope proof: the strict pattern exists in-repo (verify-authority.cjs:165-174, verify-iteration.cjs:92, synthesis-closeout.cjs:78-79); prior iterations registered the same shape on query.cjs/convergence.cjs (R6-P1-003/R6-P1-004) — this is a new file, not a re-report.
- Affected surface hints: ["status.cjs parseArgs", "appendStatusObservabilityEvent", "coverage/council graph database"]
- Recommendation: reject keys outside an explicit allow-list through the existing INPUT_VALIDATION path; never infer read-only from an unvalidated boolean.

```json
{
  "type": "claim-adjudication",
  "claim": "status.cjs parseArgs (61-70) accepts any --token without an unknown-key branch; a misspelled --read-only leaves readOnly false (121), skips the read-only open (129), and the success path appends an observability event (168 council, 199 coverage) before exiting 0. Repro A shows --bogus-xyz accepted with no flag diagnostic; repro A2 shows --read-onl accepted and the run proceeding to namespace validation.",
  "evidenceRefs": [
    "status.cjs:61-70 (generic parser, no allow-list)",
    "status.cjs:121 (readOnly = args.readOnly === true)",
    "status.cjs:129 (openReadOnlyDb only when readOnly)",
    "status.cjs:168 and :199 (appendStatusObservabilityEvent when !readOnly)",
    "repro A: exit 3, error 'specFolder is required', no unknown-option message",
    "repro A2: exit 3 from specFolder namespace validation; --read-onl not rejected"
  ],
  "counterevidenceSought": "Searched status.cjs for an unknown-key allow-list (none; loop 61-70 has no hasOwnProperty check); compared with verify-authority.cjs:165-174 and verify-iteration.cjs:92 where rejection exists; found no caller-side flag pre-validation.",
  "alternativeExplanation": "The generic parser may be intentional for forward-compatible keys, but the file writes on the non-read-only path, so silent acceptance changes persistence behavior — the sweep's target class, matching the registered R6-P1-003/R6-P1-004 shape on sibling scripts.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "A caller-side flag allow-list before invoking status.cjs, or documentation declaring unknown flags benign AND read-only usage advisory, would reduce this to P2."
}
```
2. **R7-P1-002 upsert.cjs accepts unknown options; a misspelled flag is ignored by the graph writer with no diagnostic** — .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:48 (parser) — [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:48]. parseArgs (48-58) maps any --token to a key; only required keys are pulled (:146-150) and unknown keys are never enumerated. The script is a graph writer (writer-lock import :18; success payload with graph_nodes_json/graph_edges_json :301-307).
- Case: a caller types --event instead of --events (or adds a stray flag); the flag is silently ignored, the write proceeds or drops the intended input, and a valid invocation still exits 0 with status ok.
- Evidence: repro B: --bogus-xyz accepted; the run failed only on the unrelated missing specFolder (exit 3, INPUT_VALIDATION), no unknown-flag message. Value validation exists for individual keys (seeds :98-124, events :126-136) but the key set is never checked.
- User impact: silent option typos change what is written to (or omitted from) the graph store with no diagnostic.
- Finding class: class-of-bug.
- Scope proof: same parser shape as R7-P1-001; strict rejection exists in sibling scripts of the same directory family.
- Affected surface hints: ["upsert.cjs parseArgs", "writer lock", "coverage/council graph upsert"]
- Recommendation: enumerate allowed keys per mode and fail with INPUT_VALIDATION on any unknown key.

```json
{
  "type": "claim-adjudication",
  "claim": "upsert.cjs parseArgs (48-58) accepts any --token; unknown keys are never enumerated (only required keys pulled at 146-150). Repro B shows --bogus-xyz accepted, failing only on the unrelated missing specFolder. The script acquires a writer lock and returns graph_nodes_json/graph_edges_json (:301-307), so a typo silently changes or drops written input with no diagnostic.",
  "evidenceRefs": [
    "upsert.cjs:48-58 (generic parser, no allow-list)",
    "upsert.cjs:146-150 (required keys only)",
    "upsert.cjs:301-307 (success payload graph_nodes_json/graph_edges_json)",
    "repro B: exit 3, error 'specFolder is required', no unknown-option message"
  ],
  "counterevidenceSought": "Searched for a known-keys check between 48 and 150 (none); individual values are validated, the key set is not; no wrapper pre-validates flags.",
  "alternativeExplanation": "Tolerating extra keys could be deliberate for forward compatibility, but the writer has no dry-run and adjacent scripts reject unknowns, so a typo is unobservable.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If every caller is a versioned workflow passing a fixed flag set and no human invokes the CLI, reduce to P2."
}
```
3. **R7-P1-003 a --check typo/unknown flag selects the write path; derive-command-bridges.cjs rewrites the generated projection and exits 0** — .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:387 (parser), :424-430 (write) — [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:387]. run() reads only argv.includes('--check'); every other token falls to the write branch, which rewrites command-bridges.generated.json and any drifted command-bridge source files, then exits 0 (:438 only sets 1 under checkOnly).
- Case: a --chek invocation (or any stray flag) intended as a read-only drift check regenerates the projection instead; the caller sees exit 0 and a 'generated' status.
- Evidence: repro C ran the real script with --bogus-xyz and fs.writeFileSync stubbed in-process: STUB_WRITES=[.../command-bridges.generated.json], exit 0. Control C2 with --check: STUB_WRITES=[], exit 0. skill_advisor.py:617-619 invokes this script with --check, so the check posture is wired.
- User impact: a typo silently mutates tracked generated/workflow artifacts instead of detecting drift, masking staleness.
- Finding class: class-of-bug.
- Scope proof: the same shape is registered on render-contract-snapshot.cjs (R6-P1-002) and build-rule-cards.cjs (R4-P1-001); this is a new file. The script has no other arg validator.
- Affected surface hints: ["derive-command-bridges CLI", "command-bridges.generated.json", "skill_advisor.py health/check consumer"]
- Recommendation: reject every token except an explicit allowed set; print usage and exit 2 on unknown input.

```json
{
  "type": "claim-adjudication",
  "claim": "derive-command-bridges.cjs takes checkOnly from argv.includes('--check') (:387); any other token (--chek typo or --bogus-xyz) falls to the write branch (:424-430), rewriting command-bridges.generated.json and any drifted source files, then exiting 0. Stub repro C shows the generated-file write under --bogus-xyz with exit 0; control C2 shows zero writes under --check.",
  "evidenceRefs": [
    "derive-command-bridges.cjs:387 (argv.includes('--check'))",
    "derive-command-bridges.cjs:424-430 (write branch, unconditional when !checkOnly)",
    "derive-command-bridges.cjs:438 (exitCode 1 only under checkOnly with changes)",
    "skill_advisor.py:617-619 (consumer invokes --check)",
    "repro C: STUB_WRITES=[...command-bridges.generated.json], exit 0; repro C2: STUB_WRITES=[], exit 0"
  ],
  "counterevidenceSought": "Searched the script for another arg validator or dry-run default (none); confirmed the write branch executes unconditionally when --check is absent.",
  "alternativeExplanation": "Write-by-default is plausible for a generator, but the script has an explicit --check posture with a live consumer (skill_advisor.py:617-619), so a typo silently mutating tracked files is the registered R6-P1-002 shape, not an intended default.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If no workflow/hook ever relies on --check and the advisor consumer is removed, impact falls to a silent rewrite of a generated artifact (P2)."
}
```

### P2 Findings

4. **R7-P2-001 init-skill-graph.sh reads no CLI options; an expected --help or --dry-run silently triggers the full rebuild** — .skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh:9 (script body), :57/:64/:77/:80 (unconditional commands) — [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh:57]. No argv handling exists anywhere: the script validates metadata, rebuilds the runtime SQLite graph, exports JSON and runs the health check unconditionally.
- Case: an operator runs it with --help or --dry-run expecting a menu or a no-op; the rebuild executes instead.
- Evidence: code read only — the script was NOT executed because it rebuilds the runtime SQLite store; every command between :57 and :80 runs regardless of "$@".
- Impact: low — maintenance script with no option surface to typo, but an unintended heavy rebuild is silently performed.
- Recommendation: add a usage/argument guard that exits 2 on any argument, or document the no-args contract in the header.

5. **R7-P2-002 verify-zombie-soak.sh recognizes only --verbose/-v; unknown flags are silently ignored** — .skilled/skills/system-skill-advisor/runtime/scripts/verify-zombie-soak.sh:22-24 — [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/verify-zombie-soak.sh:22]. The case statement has no default branch, so any other token (a --verboes typo) leaves VERBOSE=0 with no usage error.
- Case: an operator typo-s the verbose flag; the diagnostic runs non-verbose and the typo is never surfaced.
- Evidence: repro E: bash verify-zombie-soak.sh --bogus-xyz produced no flag diagnostic and exited 1 on its own checks (early abort in the sandbox); the flag was silently swallowed by the case block.
- Impact: low — read-only diagnostic helper; only the verbose evidence path is silently lost.
- Recommendation: add a default case that prints usage and exits 2 on unrecognized first arguments.

6. **R7-P2-003 check-prompt-quality-card-sync.sh consumes $1 as the repo root and silently ignores every further argument** — .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh:29 — [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh:29]. ROOT is "$1"; extra tokens are never read.
- Case: a caller appends a flag (or typo-s one after the root); the guard runs normally and reports PASS, so the extra input is silently ignored.
- Evidence: repro F: bash check-prompt-quality-card-sync.sh . --bogus-xyz printed 'GUARD PASS — tables not inlined, deep-path pointer-only' and exited 0.
- Impact: low — read-only guard; stray input cannot change the verdict but is not rejected.
- Recommendation: validate argument count and reject unknown flags with exit 2.

7. **R7-P2-004 a dangling --skill silently widens check-skill-doc-frontmatter.mjs to all skills and reports PASS** — .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:63 — [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:63]. opts.skill = argv[i + 1] ?? null; with --skill last, skill stays null and the run scans every skill.
- Case: a per-phase authoring run intends --skill <name> but omits the value (or appends another value); the checker silently validates the whole tree and reports a broad PASS.
- Evidence: repro G: node check-skill-doc-frontmatter.mjs --skill printed 'PASS mode=shape scope=all-skills docs=101 carrying-detailed-block=101 violations=0', exit 0.
- Impact: low — read-only checker; a mistaken scope silently inflates the checked set.
- Recommendation: treat a valueless --skill as exit 2 (usage), matching the unknown-option branch.

8. **R7-P2-005 routing-accuracy helpers gate writes on process.argv.includes; a --write typo silently skips the artifact write with exit 0** — .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:129 — [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:129]. Same includes('--write') shape at capture-local-native-divergence-ledger.mjs:216, capture-scorer-eval-baseline.mjs:194 and derive-ambiguity-slice.mjs:92; gate3-corpus-runner.mjs:9 reads process.argv[2] as the dataset path with no flag parsing at all.
- Case: a --wrtie invocation silently no-ops the write and exits 0, so a stale holdout/baseline/ledger persists while the operator believes it was refreshed.
- Evidence: repro D: node build-holdout.mjs --wrtie printed the summary JSON and exited 0 with no 'wrote ...' line, proving the typo was ignored.
- Impact: low-to-moderate — developer tooling; downstream gates re-score live, so a stale artifact surfaces later, but the silent no-op hides the cause.
- Recommendation: parse options strictly (node:util parseArgs) and reject unknown flags with exit 2.

## Traceability Checks
- Core spec_code: all 8 findings map to Class 1 of the sweep charter (unknown/misspelled option silently accepted); zero Class 2 instances found in this slice.
- Core checklist_evidence: the 3 P1 findings carry fenced claim-adjudication blocks; 9 executed repros (A, A2, B, C, C2, D, E, F, G) plus 2 strict-parser controls (I, J) recorded with exit codes; init-skill-graph.sh is code-read-only with the reason stated.
- Overlay skill_agent: consumer links verified — skill_advisor.py:617-619 invokes derive-command-bridges.cjs --check; init-skill-graph.sh:80 invokes skill_advisor.py --health; init-skill-graph.sh:77 invokes skill_graph_compiler.py --export-json, matching the parser definition at skill_graph_compiler.py:1072.
- Overlay agent_cross_runtime / feature_catalog_code / playbook_capability: not applicable in this slice (no agent definitions, feature-catalog or playbook references in the reviewed files).

## Integration Evidence
- derive-command-bridges.cjs is consumed by skill_advisor.py:617-619 in a block/check posture, so the --check write-path flip (R7-P1-003) sits under a live advisor check.
- strictly parsed controls verified by execution: score-fanout-pairs.cjs exits 2 on an unknown option with a usage line (repro I); verify-authority.cjs --help prints an OPTIONS list that matches its allow-list (repro J, exit 0).
- all five Python CLIs use argparse parse_args (strict, unrecognized option exits 2): score-routing-corpus.py:242, skill_advisor_bench.py:250, skill_advisor_regression.py:260, skill_advisor.py:4753, skill_graph_compiler.py:1076; every option documented in headers is defined.

## Edge Cases
- status.cjs repro A2 aborted at namespace validation (specFolder outside the repo root), not at flag rejection; the unknown-flag acceptance is proven by the absence of any flag diagnostic and by code read of :61-70.
- derive-command-bridges repro C reported changed: [] so only the generated-projection write is proven by execution; the source-file writes share the same branch (:426-430) and are not individually exercised.
- build-holdout repro D additionally printed a 'collisionIds' entry in its summary; that is fixture data, not part of the two defect classes.
- verify-zombie-soak repro E exited 1 with no output (early abort in the sandbox); the unknown-flag acceptance is proven by the missing default case at :22-24 and the absence of any flag diagnostic.
- No prompt-injection-style directives were found in the reviewed files; all reviewed content was treated as data.

## Confirmed-Clean Surfaces
- render-command-contract.cjs:200-221 throws 'Unknown argument' on any unrecognized token; help text documents exactly --command/--compare/-- and the parser accepts each.
- score-fanout-pairs.cjs:1367-1382 uses strict node:util parseArgs, allowPositionals false; unknown option exits 2 (repro I).
- synthesis-closeout.cjs:74-92 rejects unknown flags with exit 1; research incompleteness sets process.exitCode = 2 (:379).
- verify-authority.cjs:163-198 rejects unknown keys with UNKNOWN_ARGUMENT exit 1; --help output matches the parser (repro J).
- verify-iteration.cjs:83-95 records unknown flags as errors and returns 2 (:549); missing required flags also return 2.
- check-skill-doc-frontmatter.sh:41 is a pure exec wrapper delegating to the strict .mjs checker.
- The five Python CLIs parse strictly with argparse (see Integration Evidence).

## Ruled Out
- Class 2 (a script detecting a problem but exiting 0) in this slice: no instance found; detected failures exit non-zero (synthesis-closeout exitCode 2, verify-authority 2, verify-iteration 1/2, argparse unknown-option exit 2, score-fanout-pairs refusal exit 2).
- A documented option the parser rejects: none in this slice; every header/usage item in the reviewed files is accepted by its parser (verified for verify-authority and score-fanout-pairs by execution, for the rest by read).

## Not Proven
- Whether workflows/hooks invoke status.cjs or upsert.cjs with flag sets that are typo-prone (caller sweep beyond this slice not performed; deep-loop workflow YAMLs were not scanned for these two scripts this iteration).
- init-skill-graph.sh behavior under arguments (script not executed — it rebuilds the runtime SQLite store; the defect is proven from code read).
- The cause of verify-zombie-soak.sh's early exit 1 in the sandbox (environmental; irrelevant to the unknown-flag defect).

## Verdict
3 P1 and 5 P2 new findings, 0 P0. Active P1 findings remain open; no active P0. Review verdict: CONDITIONAL.

## Next Dimension
Slice 8 of 10 as assigned by the orchestrator; stopPolicy=max-iterations, so the sweep continues.

Review verdict: CONDITIONAL