# Deep Review — Iteration 3 of 10 (traceability)

## Dispatcher

- Route: Resolved route: mode=review target_agent=deep-review — single LEAF iteration; no sub-agents dispatched.

- Iteration: 3 of 10, dimension traceability; orchestrator-assigned slice 3 of 10 (26 CLI scripts under .skilled/skills/sk-design/sk-design-diagram/scripts, .skilled/skills/sk-design/sk-design-md-generator/**/scripts and .skilled/skills/sk-doc/**/scripts).

- BINDING: target=CLI scripts slice 3 of 10 (sk-design-diagram, sk-design-md-generator, sk-doc; 26 files)

- BINDING: maxIterations=10

- BINDING: convergence=0.1

- BINDING: mode=review

- BINDING: dimensions=correctness,security,traceability,maintainability

- BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep

- State: registry holds R1-P1-001, R2-P1-001, R1-P2-001..004 and R2-P2-001..006 (all still active); this iteration did not re-report any of them.

- Gateway: append-mode-event.cjs accepted an iteration record at ledger sequence 6 (exit 0, projectionRefreshed=true).

- Reconciliation: that record was appended mid-iteration and already listed R3-P2-005 (build-write-prompt) with summary P2=4; both remaining probes (study-prepare, build-write-prompt) were subsequently proven with the entry guard keyed off an exported env var, so this narrative carries P2=5 (adding R3-P2-004) with corrected evidence. The delta finding records mirror this list; the embedded iteration record line preserves the appended payload for audit.

## Dimension

Traceability rotation of the silent-input sweep: every file's argument parser, usage/header text and exit paths were read, candidates were confirmed with safe read-only repros (no writes into the repository; git status identical before and after), and each defect site was traced to the caller that makes it load-bearing. Core spec_code / checklist_evidence are deferred per the strategy; overlays skill_agent, agent_cross_runtime (partial) and playbook_capability (partial) were exercised.

## Files Reviewed

- .skilled/skills/sk-design/sk-design-diagram/scripts/apply-design-md.cjs:854
- .skilled/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs:47
- .skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs:107
- .skilled/skills/sk-design/sk-design-diagram/scripts/drawio_extract.py:928
- .skilled/skills/sk-design/sk-design-diagram/scripts/mermaid_extract.py:1383
- .skilled/skills/sk-design/sk-design-diagram/scripts/validate-flowchart.sh:15
- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/build-write-prompt.ts:171
- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/cli.ts:31
- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts:82
- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/guided-run.ts:80
- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/preview-gen.ts:270
- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/proof.ts:463
- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/report-gen.ts:716
- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/study-prepare.ts:184
- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/validate.ts:744
- .skilled/skills/sk-design/sk-design-md-generator/styles/scripts/extract-refero.mjs:62
- .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:317
- .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py:58
- .skilled/skills/sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py:48
- .skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:362
- .skilled/skills/sk-doc/shared/scripts/check_no_numbered_categories.py:48
- .skilled/skills/sk-doc/shared/scripts/check_no_numbered_snippet_files.py:49
- .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:9
- .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1188
- .skilled/skills/sk-doc/shared/scripts/extract_structure.py:1251
- .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:362

## Findings by Severity

### P0 Findings

None. No gate, hook or CI-backed check in this slice exits 0 after detecting a failure; every gate exit path inspected returns nonzero (frontmatter-version.mjs:414, validate-doc-model-refs.js:400, check-diagram-corpus.cjs:194, the three sk-doc ROOT guards, extract_structure.py:1267, validate.ts:765).

### P1 Findings

1. **Unknown flags are silently skipped by the guided runner; a --dry-run typo executes the full run** -- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/guided-run.ts:102 -- parseGuidedRunArgs skips every unrecognized token starting with -- (line 102) and reads mode flags with args.includes (lines 116-119). A mistyped --dry-run (--dryru) is accepted with no diagnostic, leaves dryRun=false, and runGuided falls through the 'if (options.dryRun) return;' guard (line 296) into plan execution: preflight spawns, extraction, write-prompt generation and the optional validate/report commands (lines 292-368). references/guided-run.md:63 documents the runner invocation, so an operator or agent typo silently converts a planned dry run into a live run that writes under the output folder.
- Case: a caller types --dryru instead of --dry-run; the runner executes the full pipeline and exits 0 with no warning.
- File: .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/guided-run.ts:102 (parser skip), :118 (dryRun read), :296 (guard)
- Evidence: scratch-loader probe -> exit=0; ACCEPTED ["https://example.com","--output","/tmp/skd-3","--dryru"] dryRun=false; the same call with --dry-run reports dryRun=true (repro: node --import /tmp/sweep3-register.mjs /tmp/sweep3-probe.mjs).
- User impact: a dry run intended to be side-effect free crawls the target site and writes extraction artifacts.
- Finding class: class-of-bug
- Scope proof: lines 80-121 are the file's only argv handling; no unknown-flag rejection branch exists; the usage line 74 mirrors VALUE_FLAGS/BOOLEAN_FLAGS (lines 54-55).
- Affected surface hints: ["guided runner", "dry-run mode", "extract-write-validate pipeline"]
- Claim adjudication:

```json
{
  "id": "R3-P1-001",
  "type": "class-1-silent-unknown-option",
  "claim": "parseGuidedRunArgs skips every unrecognized -- token (line 102) and reads mode flags with args.includes (line 118), so a misspelled --dry-run is accepted at exit 0 with dryRun=false and runGuided falls through the dryRun guard (line 296) into the execution path that spawns extraction, prompt generation and optional validation/report commands.",
  "evidenceRefs": [
    "guided-run.ts:80-121",
    "guided-run.ts:102",
    "guided-run.ts:118",
    "guided-run.ts:296",
    "repro: node --import /tmp/sweep3-register.mjs /tmp/sweep3-probe.mjs -> exit=0; ACCEPTED [\"https://example.com\",\"--output\",\"/tmp/skd-3\",\"--dryru\"] dryRun=false"
  ],
  "counterevidenceSought": "Read the whole parser (80-121) for an unknown-flag rejection branch: none exists. readValue (82-88) validates only that a value does not start with --, never that a flag name is known. --dry-run is documented (line 74) and read only via args.includes (line 118).",
  "alternativeExplanation": "The swallow is deliberate tolerance so pass-through flags do not disturb URL detection (lines 95-105 skip flag values); the defect is that a mistyped safety flag is indistinguishable from the intended one at exit 0.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If every caller of guided-run is automated and passes a validated flag set (no operator-typed invocations per references/guided-run.md or SKILL.md), downgrade to P2."
}
```

### P2 Findings

2. **A misspelled --extra silently skips the extra-directory corpus scan while the run still prints RESULT: PASSED** -- .skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs:108-109 -- the only argument read is an exact-string indexOf('--extra') (line 108); every other token short-circuits to null (line 109) and main() treats null as 'no extra directory' (line 135). A typo such as --exta DIR checks only the in-package corpus and still prints RESULT: PASSED with exit 0, the marker the skill workflow demands for an external delivery (SKILL.md:272, 390; scripts/README.md:41-42).
- Case: node check-diagram-corpus.cjs --exta /some/delivery -> exit 0, RESULT: PASSED; the delivery is never scanned.
- File: .skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs:108 (indexOf), :109 (return null), :135 (parse for main)
- Evidence: node .skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs --exta /nonexistent-sweep-xyz -> exit=0, 'Summary: errors: 0', 'RESULT: PASSED'; the --extra form -> exit=2, 'ERROR: --extra directory does not exist: /nonexistent-sweep-xyz'.
- Finding class: class-of-bug
- Scope proof: lines 107-117 are the file's only argv handling; rg for --extra shows a single indexOf read and no other flag rejection.
- Affected surface hints: ["diagram corpus gate", "external HTML delivery check"]

3. **Unknown options are ignored by the doc-model-reference drift check** -- .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:317-319 -- argv is read only through args.includes('--verbose') and args.includes('--help'); every other token (for example a --verbos typo) is never examined and the scan runs with defaults. The check still exits by drift result (0 clean / 1 drift, lines 400-405).
- Case: node validate-doc-model-refs.js --bogus-xyz -> exit 0 with no diagnostic, identical to the baseline run.
- File: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:317-319
- Evidence: node .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js --bogus-xyz -> exit=0 (no output); baseline without the flag -> exit=0 (no output); wiring at .github/workflows/advisory-checks.yml:44.
- Finding class: instance-only
- Scope proof: argv is referenced only at line 317; the two includes reads are the complete option surface.
- Affected surface hints: ["doc-model drift check", "advisory CI"]

4. **The frontmatter version gate engine has no unknown-flag branch; a misspelled flag is silently ignored** -- .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:369-379 -- parseArgs loops the known options and, when a token matches no branch (line 377 ends the chain), falls through with no else/unknown diagnostic. The gate still checks every in-scope doc and exits 1 on any missing or malformed version (line 414), so a stray flag does not create a false pass; a misspelled --from-manifest or --classes silently ignores the caller's scoping instead of erroring. The script is the engine behind check-frontmatter-versions.sh, routed by the post-edit quality hook as an exit1 gate (.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38).
- Case: node frontmatter-version.mjs gate --bogus-xyz -> same summary and exit 0 as the baseline; no unknown-option diagnostic.
- File: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:369-379 (no unknown branch), :397-414 (gate)
- Evidence: node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs gate --bogus-xyz -> exit=0, '[gate] 2909 files | ok=2902  skip-no-frontmatter=7'; the baseline gate run -> exit=0, identical summary.
- Finding class: instance-only
- Scope proof: parseArgs (lines 362-380) is the file's only argv handling; the loop tail returns args with no unknown-token check.
- Affected surface hints: ["post-edit frontmatter gate", "check-frontmatter-versions.sh"]

5. **An unreadable tokens input is reported as JSON but study-prepare still exits 0** -- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/study-prepare.ts:190-197 -- the CLI catches every read/parse error, writes the ok:false JSON to stdout, and returns; only the missing-argument branch exits nonzero (line 188).
- Case: study-prepare.ts /nonexistent.json -> stdout ok:false JSON, exit 0.
- File: .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/study-prepare.ts:190-197 (catch), :188 (only exit 1)
- Evidence: scratch-driver repro -> node_exit=0 with the ok:false JSON line.
- Finding class: instance-only
- Scope proof: the whole CLI region is lines 184-198; the catch has no exitCode assignment.
- Affected surface hints: ["study context preparation", "guided-run --study"]

6. **An unreadable --study-context is silently dropped and unknown flags ignored while the prompt is still written with exit 0** -- .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/build-write-prompt.ts:187-192 -- the CLI reads --study-context with indexOf and, when the file cannot be read or parsed, catches and sets studyContext = undefined instead of failing; line 194 then writes the prompt without the STUDY block. The same invocation with --bogus-xyz produced the same output.
- Case: build-write-prompt.ts tokens.json --study-context /missing.json --bogus-xyz -> exit 0, prompt written (27994 bytes), 0 STUDY lines.
- File: .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/build-write-prompt.ts:187-192 (silent catch), :194 (prompt written)
- Evidence: scratch-driver repro (SWEEP3_ENTRY keyed to the script) -> node_exit=0, 27994-byte prompt written, 0 STUDY lines, no diagnostic for --bogus-xyz.
- Finding class: class-of-bug
- Scope proof: CLI region lines 171-195 is the file's only argv handling; --study-context is the sole flag read.
- Affected surface hints: ["write-prompt generation", "STUDY block", "guided-run"]

## Traceability Checks

- Core spec_code: deferred — slice scripts are CLI implementations; findings were traced to the skill/hook surfaces that invoke them (below).

- Core checklist_evidence: not applicable to this slice (no checklist governs CLI flags or exit codes).

- Overlay skill_agent: checked — .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38 routes versioned skill docs to check-frontmatter-versions.sh with an exit1 gate (.skilled/hooks/post-edit-quality/README.md:50); sk-design-diagram/SKILL.md:272 and :390 require check-diagram-corpus.cjs (with --extra over external deliveries) to print RESULT: PASSED; references/guided-run.md:63 documents the guided-run invocation.

- Overlay agent_cross_runtime: partial — .github/workflows/advisory-checks.yml:44 invokes the .opencode mirror of the reviewed validate-doc-model-refs.js; mirror drift was not exercised.

- Overlay feature_catalog_code: not checked this iteration.

- Overlay playbook_capability: partial — the sk-design-diagram capture-review playbook references the corpus check.

- Repro discipline: no repository writes; git status showed only the pre-existing untracked review packet before and after.

## Integration Evidence

- .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38 -> check-frontmatter-versions.sh (gate), backed by frontmatter-version.mjs gate mode.

- .github/workflows/advisory-checks.yml:44 -> validate-doc-model-refs.js (advisory CI, .opencode mirror path).

- .skilled/skills/sk-design/sk-design-md-generator/references/guided-run.md:63 -> guided-run.ts with --fast (operator-typed invocations, raising R3-P1-001 above advisory).

## Confirmed-Clean Surfaces

- apply-design-md.cjs:854-878 rejects unknown args (fail) and validates --forms/--out values; a URL positional is refused by name.

- apply-diagram-tokens.cjs:47-78 reads only declared value flags, rejects everything else (line 61) and skips consumed values (line 63).

- extract-refero.mjs:62-75 throws 'unknown flag: <t>'; the argparse scripts (drawio_extract.py:928-942, mermaid_extract.py:1383-1396, extract_structure.py:1251-1258, check_authored_name_kebab.py:58-67, check_no_new_snake_case.py:362-367) reject unknown options with exit 2.

- cite-drift-scan.mjs:1188-1209 uses node:util parseArgs strict: true (unknown flags -> exit 2); its --advise always-0 behavior is documented (header lines 7-9).

- validate-flowchart.sh:15-29 exits 1 (usage) on a missing or non-file first argument.

## Edge Cases

- check-diagram-corpus.cjs rejects a valueless --extra and a missing directory (throw -> exit 2, lines 136-138); only unknown or misspelled flags are silent.

- The three sk-doc ROOT guards turn a stray flag into the ROOT positional and fail loudly ('ERROR: root not found', exit 2).

- validate.ts:744-765 exits by validation result; check-frontmatter-versions.sh:13 forwards "$@" to the gate engine.

## Not Proven

- extract.ts:156-158: unknown flags (--bogus-xyz) are dropped by the final else-if (!arg.startsWith('--')) branch and never examined; source read only. Runtime proof is blocked: the module graph pulls playwright (backend node_modules absent) and a strip-only TS harness fails on a TypeScript parameter property. Not reported as a finding.
- preview-gen.ts:270-278, proof.ts:463-479, report-gen.ts:716-732, validate.ts:744-751: trailing arguments beyond the fixed positions are never inspected; source read only, not exercised. Not reported as findings.
- validate-flowchart.sh extra positionals: the extra-arg run exited 1 because SKILL.md fails its own content checks; no clean baseline, so stray-arg silence is not proven.

## Verdict

Conditional: 1 P1 and 5 P2 findings this iteration, no P0. The accumulated registry still carries two active P1 findings from iterations 1-2; nothing was resolved this iteration.

## Next Dimension

maintainability (slice 4 of 10).

Review verdict: CONDITIONAL
