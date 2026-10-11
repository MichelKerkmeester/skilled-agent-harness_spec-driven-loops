# Review Iteration 009 — Correctness (Silent-Input Sweep, Slice 9/10)

## Dispatcher
- Route: mode=review; target_agent=deep-review; single review iteration (9 of 10); state externalized.
- Dimension: correctness; slice 9 of 10 (orchestrator-assigned): system-spec-kit runtime CLI rules/setup/spec-folder/spec, 33 files.
- Stop policy: max-iterations (convergence is telemetry only).
- Charter (two defect classes): (1) unknown or misspelled options accepted silently; (2) exit 0 on a detected problem, or a header that documents an option the parser rejects or never reads.
- State: registry held R1..R8 (16 P1 + 42 P2) at iteration start; no slice-9 file carried a prior finding; nothing was re-reported.

## Dimension
Correctness — the CLI input contract: option parsing vs documented options, and exit codes as promised, across the runtime CLI rules/setup/spec-folder/spec clusters.

## Files Reviewed
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs:541
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh:31
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:27
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-shared.cjs:125
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-description-shape.sh:42
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:109
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter.sh:163
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:155
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-identity.sh:56
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-shape.sh:43
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata.sh:29
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention-helper.mjs:28
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-links.sh:121
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:11
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:315
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:15
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-toc-policy.sh:14
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs:41
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:41
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:60
- .skilled/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh:49
- .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh:22
- .skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:103
- .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:146
- .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:566
- .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh:545
- .skilled/skills/system-spec-kit/runtime/cli/spec/check-completion.sh:85
- .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:58
- .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:37
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:347
- .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:988
- .skilled/skills/system-spec-kit/runtime/cli/spec/is-phase-parent.ts:198
- .skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:121

## Findings by Severity
### P0 Findings
None. No CI/hook/workflow path in this slice reports success after detecting a failure that the path relies on.

### P1 Findings
1. **R9-P1-001 Unknown/misspelled options are silently ignored by the description.json writer; a --descriptoin typo discards the caller text and regenerates from spec.md with exit 0** — .skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:103 (indexOf parse; :107 for --level; no unknown-token branch) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:103]
- Case: a caller runs the writer with a misspelled or unknown option, for example --descriptoin "CUSTOM-TEXT-R9" or --bogus-xyz; the token is never rejected and never read, the folder is generated from spec.md instead, and description.json is written with exit 0 and no diagnostic.
- Evidence: repro A2 (executed): node .../dist/spec-folder/generate-description.js "$TMPDIR/descr-base/999-r9-typo" "$TMPDIR/descr-base" --descriptoin "CUSTOM-TEXT-R9" -> exit 0, stdout "description.json created in ...", written description "Spec" (from spec.md), not CUSTOM-TEXT-R9. Control A1: same command with --bogus-xyz -> exit 0, description.json written.
- User impact: a mistyped flag silently changes what metadata is written; the explicit description or level is dropped while the run still reports success, and the drift is invisible until description.json is audited.
- Finding class: class-of-bug.
- Scope proof: main() reads only args[0], args[1] (:86-88), indexOf('--description') (:103) and indexOf('--level') (:107); no getopt/known-flags rejection exists anywhere in the file.
- Affected surface hints: ["create.sh folder scaffolding", "canonical save/refresh flows writing description.json", "validation rules reading description.json level/identity"]
- Recommendation: reject unknown tokens with a usage error before generation, matching nested-changelog.ts:146.

```json
{
  "type": "claim-adjudication",
  "claim": "generate-description.ts parses only --description and --level by index scan and never rejects unknown tokens; a misspelled flag is silently ignored and the writer still writes description.json with exit 0.",
  "evidenceRefs": [".skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:103", ".skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:107", "repro A2"],
  "counterevidenceSought": "searched the file for a known-flags or getopt rejection (none; :82-110 is the whole parse) and checked the typo path is not deferred validation (the run exited 0 and wrote the file).",
  "alternativeExplanation": "The typo token could be treated as a positional; but positionals are fixed to args[0]/args[1] (:86-88) and the token plus its value are never read, so this is an absent unknown-token branch, not positional handling.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "A caller-visible rejection of unknown tokens added ahead of the parse, or evidence that every invocation site pre-validates flags."
}
```

### P2 Findings
1. **R9-P2-001 is-phase-parent runCli() falls through with exit 0 for an unknown command and for a missing folder argument** — .skilled/skills/system-spec-kit/runtime/cli/spec/is-phase-parent.ts:198 (destructure; :199-201 silent return; dispatch :203-216) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/is-phase-parent.ts:198]
- Case: "node dist/spec/is-phase-parent.js bogus-command <dir>" or "node dist/spec/is-phase-parent.js check" (no folder) reads as success: exit 0 with no output, so a mistyped subcommand is indistinguishable from a completed check.
- Evidence: repro B1/B2 (executed): both exit 0, no output.
- Finding class: class-of-bug.
- Scope proof: runCli() has no else branch and no exit code for unhandled commands; the early return sits before any output.
- Affected surface hints: ["shell rules shelling out to the is-phase-parent dist", "manual diagnostics"]
- Recommendation: print usage and exit 2 for unknown commands; exit 2 when the folder argument is missing.

2. **R9-P2-002 check-frontmatter-values helper consumes stray flags as file paths and silently counts unreadable or missing files as checked** — .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:109 (:113-115 catch -> continue) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:109]
- Case: "node check-frontmatter-values-helper.cjs --bogus-xyz" (or any nonexistent path) exits 0 with no output and no WARN line, even though the header promises one WARN per value outside the shared list and exit 0 means checked.
- Evidence: repro C (executed): exit 0, empty output.
- Finding class: class-of-bug.
- Scope proof: the loop body catches every read error and continues; no diagnostic path exists for an unreadable input.
- Affected surface hints: ["rules/check-frontmatter-values.sh (warn-level rule)", "corpus sweeps"]
- Recommendation: reject flag-shaped arguments and emit a diagnostic for unreadable inputs.

3. **R9-P2-003 check-source-tags helper ignores every argument after the first** — .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:315 — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:315]
- Case: "node check-source-tags-helper.mjs <folder> --bogus-xyz" exits 0 and runs normally; the stray flag is never inspected or named.
- Evidence: repro D (executed): exit 0, stdout "SKIP no Created date in spec.md, so the packet counts as older than the cutoff".
- Finding class: class-of-bug.
- Scope proof: main() reads argv[0] only; nothing else in the file consumes argv.
- Affected surface hints: ["rules/check-source-tags.sh:29 (the sole caller, one arg)"]
- Recommendation: reject surplus arguments with the usage error (exit 2).

4. **R9-P2-004 check-native-modules prints [FAIL] for a missing marker, a version mismatch or a sharp load failure but never exits non-zero** — .skilled/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh:49 (:46 mismatch, :61 sharp; documented exit codes :72-74) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh:49]
- Case: on a machine with no .node-version-marker the script prints "Marker: [FAIL] not found (run rebuild script to create)" and "If any modules FAILED, run: ..." yet exits 0; a caller checking only the exit status reads success.
- Evidence: repro E (executed): repo run exit 0 with all probes OK; byte-identical cp copy under $TMPDIR run with no marker -> stdout "Marker: [FAIL] not found ...", exit 0. The FAIL branches set no exit status and end-of-file leaves 0.
- Finding class: class-of-bug.
- Scope proof: the only exit statuses in the file are exit 1 for node-missing (:15) and the implicit 0; the FAIL branches (:43-49, :57-65) only print.
- Affected surface hints: ["setup-native-module-health playbook", "manual diagnostic runs"]
- Recommendation: exit 1 when any check printed [FAIL].

5. **R9-P2-005 check-graph-metadata-child-drift treats any scanner exit code other than 9/20/21 as no drift, so an unanticipated scanner crash is reported clean** — .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:155 (:145-152 handles only 20/21) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:155]
- Case: the embedded scanner throws at listDerivedChildNames() (a permissions or runtime failure), node exits 1, the guard "[["$drift_rc" -eq 9]] || return 0" returns without a status change, and the rule reports children_ids as matching while a real gap could hide.
- Evidence: repro F (executed): the SAME node snippet extracted verbatim from the target exits rc=1 against a throwing scanner fixture; the run_check xtrace shows drift_rc=1, then [[ 1 -eq 20 ]] false, [[ 1 -eq 21 ]] false, [[ 1 -eq 9 ]] false, return 0. The fail-closed branch only covers 20/21 despite the comment promising that a run which could not determine drift must not pass silently.
- Finding class: class-of-bug.
- Scope proof: exact guard line cited; the only rc values that change behavior are 9, 20 and 21; every other rc reaches line 155 and returns 0.
- Affected surface hints: ["validate.sh strict runs (warn escalates)", "phase-parent graph-metadata currency checks"]
- Recommendation: fail closed (or warn) for any rc outside {0, 9} once enforcement is on.

## Traceability Checks
- core: spec_code — charter Class 1: R9-P1-001, R9-P2-001, R9-P2-002, R9-P2-003; charter Class 2: R9-P2-002 (unreadable counted checked), R9-P2-004, R9-P2-005.
- core: checklist_evidence — repros A1/A2, B1/B2, C, D, E (repo + copy), F (verbatim snippet + xtrace) executed from the repo root; exit codes recorded.
- overlay: skill_agent — callers verified by rg: rules/check-source-tags.sh:29; lib/shell-common.sh:48 and rules/check-graph-metadata-shape.sh:84 consume the is-phase-parent dist; rules/check-frontmatter-values.sh (Severity: warn); check-native-modules has no hook/CI caller (docs only).
- overlay: agent_cross_runtime, feature_catalog_code, playbook_capability — not applicable in this slice.

## Integration Evidence
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:29 — the helper's sole invocation site, one positional argument; the unknown-flag path is manual-invocation only.
- .skilled/skills/system-spec-kit/runtime/cli/lib/shell-common.sh:48 and .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-shape.sh:84 — shell consumers of the is-phase-parent dist; they pass a verified folder, so R9-P2-001 bites manual/mistyped calls.
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh:10 — Severity: warn, which keeps R9-P2-002 at P2.
- .skilled/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh callers — docs/playbook only (rg found no hook or CI invocation), which keeps R9-P2-004 at P2.

## Edge Cases
- The inline-node exit 0 in check-description-shape.sh:42-43 and check-graph-metadata-shape.sh:43-44 is deliberate and safe: the shell captures stdout and parses ERROR/WARN lines, and exit 0 keeps set -e from aborting the rule on the command substitution.
- check-graph-metadata-child-identity.sh:78 exit 0 for a null identity is documented as not this rule's finding (shape/presence checks own it) — not a defect.
- check-ac-closure.sh and check-ac-coverage.sh env-flag readers treat unrecognized values as gate-on (safety-biased) — not a defect.

## Confirmed-Clean Surfaces
- create.sh:347-354 rejects unknown options via the -?* arm (exit 1); positionals are the only tokens routed to ARGS.
- archive.sh:566-572 rejects unknown options via the -* arm (exit 1); --list/--restore/--force/--help all map to arms.
- heal-spec-docs.cjs:981-1005 (KNOWN_FLAGS + rejectUnknownArgument -> exit 2) and rejectMissingFlagValue -> exit 2.
- sync-gate1-pointers.cjs:41, sync-hook-registrations.cjs:41 (throw -> catch -> exit 2); sync-runtime-mirrors.cjs:60-67 accepts only --check, otherwise throws.
- nested-changelog.ts:146 (throw on unknown -> exit 1); sweep-memory-residue.mjs:541 (throw -> EXIT_ERROR 2).
- check-completion.sh:90-92, check-placeholders.sh:62, check-template-staleness.sh:42, progressive-validate.sh:134, check-prerequisites.sh:48-50 reject unknown options.
- check-metadata-disk-consistency-helper.cjs:11 — a flag-shaped argv[2] makes realpathSync throw -> JSON error + exit 1, not a silent pass.

## Ruled Out
- Documented option rejected or never read: no instance across the 33 files; --validate-verbose is read at check-prerequisites.sh:141, --auto-upgrade is explicitly rejected with a message at check-template-staleness.sh:39.
- The inline-node "process.exit(0) after printing ERROR" pattern (two shape rules) — not Class 2; stdout is the contract, exit 0 protects set -e.
- child-identity and child-drift fail-closed branches 20/21 — correct as written apart from the unhandled-rc gap in R9-P2-005.

## Not Proven
- R9-P2-005 could not be read end-to-end through run_check: the xtrace proves drift_rc=1 walks past the 20/21 branch and hits return 0 at line 155, and the verbatim snippet exits rc=1, but the rule status variables did not surface in the ad-hoc harness. The finding is filed on the verbatim snippet plus the guard line, both executed.
- Write-mode executions were withheld by charter: sync-runtime-mirrors.cjs, sync-hook-registrations.cjs, create.sh, archive.sh, heal-spec-docs.cjs --apply. Their parsers were reviewed by direct read only.

## Verdict
CONDITIONAL — one active P1 (R9-P1-001) and five P2 findings this iteration; no P0.

## Next Dimension
Slice 10 of 10 (orchestrator-assigned); correctness slice 9 complete.

Review verdict: CONDITIONAL
