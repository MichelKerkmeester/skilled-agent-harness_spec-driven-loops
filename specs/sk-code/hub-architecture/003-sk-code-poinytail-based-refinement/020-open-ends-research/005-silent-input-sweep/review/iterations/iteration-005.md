# Iteration 005 - Deep Review (correctness, slice 5)

**Run:** rvw-020-005-silent-input-20261011T162455Z
**Dimension:** correctness
**Mode:** review (target_agent=deep-review)
**Slice:** 5 of 10 -- 22 CLI files under sk-create-skill, sk-create-with-human-voice, sk-git, deep-ai-council and deep-research.

## Dimension

correctness: the two sweep defect classes.
- Class 1: an unknown or misspelled option is accepted with exit 0 and no error, swallowed into a positional, or silently ignored.
- Class 2: the script detects a problem (stale output, drift, failed check, missing/invalid input) but still exits 0; or the header/usage documents an option the parser rejects.

## Files Reviewed

| # | File | Anchor | Depth |
| --- | --- | --- | --- |
| 1 | generate-leaf-manifest.cjs | :594 | parser, runWrite/runCheck, exit sites (L1-608) |
| 2 | generate-router-intent-signals.cjs | :75 | full |
| 3 | init_skill.py | :855 | argparse + failure-return paths (L690-860) |
| 4 | leaf-route-replay.cjs | :715 | parser + main + exits (L560-837) |
| 5 | package_skill.py | :1016 | argparse + main/exit codes (L1000-1090) |
| 6 | regenerate-skill-derived.cjs | :220 | full |
| 7 | validate_skill_package.py | :190 | full |
| 8 | validate-compiled-routing-scenarios.cjs | :387 | full |
| 9 | validate-playbook-topology.cjs | :483 | parser/exit region + full key lines |
| 10 | hvr_scan.py | :574 | argparse + main + exits |
| 11 | commit-id-naming.sh | :275 | full |
| 12 | git-message-gate.mjs | :378 | header + entrypoint/exits (middle tokenizer region truncated) |
| 13 | advisory-noise-audit.mjs | :97 | full |
| 14 | migrate-legacy-branch-names.sh | :113 | full |
| 15 | stamp-branch.sh | :57 | full |
| 16 | validate-message.mjs | :55 | full |
| 17 | worktree-naming.sh | :399 | parser/CLI dispatch + create/provision bodies |
| 18 | advise-council-completion.cjs | :29 | full |
| 19 | persist-artifacts.cjs | :1020 | main + head/key/tail (parseArgs region only partially read) |
| 20 | orchestrate-session.cjs | :63 | parser + main (key lines) |
| 21 | replay-graph-from-artifacts.cjs | :38 | parser + main/exits |
| 22 | reduce-state.cjs | :2960 | head/key + CLI tail read this iteration |

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Misspelled --strict leaves detected FAILs at exit 0 in validate-compiled-routing-scenarios.cjs** -- `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs:387`

   parseArgs (lines 387-396) has no unknown-token branch, so any unrecognized flag is silently ignored. The only failure exit is `if (args.strict && report.fail > 0) process.exit(1); process.exit(0);` (lines 409-410). A directory holding a failing scenario reports `pass=0 fail=1 skip=0` and still exits 0 unless the exact `--strict` token is present; `--strct` is accepted silently.

   - **Repro:** `D=$(mktemp -d); printf '# bad scenario\n' > "$D/bad-scenario.md"; node .skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs --dir "$D"; echo exit=$?; node .skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs --dir "$D" --strict; echo exit=$?; node .skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs --dir "$D" --strct; echo exit=$?`
   - **Observed:** Default: 'pass=0 fail=1 skip=0 total=1' exit=0. With --strict: same report exit=1. With --strct: same report exit=0 and no usage/unknown-argument error (flag silently ignored).

   <claim-adjudication id="R5-P1-001">

   ```json
{
     "claim": "A misspelled --strict is silently accepted and leaves the compiled-routing content gate at exit 0 while its own report says a scenario FAILed.",
     "evidenceRefs": [
       ".skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs:387",
       ".skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs:409",
       ".skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs:410"
     ],
     "counterevidenceSought": "Searched for a production caller that passes --strict or parses stdout; narrow grep over .skilled/.github found no CI workflow or production caller of this script (only docs and the sibling replay module).",
     "alternativeExplanation": "Non-strict mode may be an intentional report-only mode, with --strict the opt-in gate; a caller deliberately omitting --strict then gets the story it chose.",
     "finalSeverity": "P1",
     "confidence": 0.85,
     "downgradeTrigger": "A documented caller contract that the script is always report-only (or a CI job that pins --strict and parses its exit code) would move this to P2."
   }
   ```

   </claim-adjudication>

2. **Same silent-unknown-flag + opt-in --strict shape in validate-playbook-topology.cjs, a gate the sk-design playbook calls mandatory** -- `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs:483`

   parseArgs (around lines 425-435) ignores unknown tokens; the blocked verdict only fails the run under `if (args.strict && report.blockedCount > 0) process.exit(1); process.exit(0);` (lines 483-486). The sk-design playbook itself states the failure mode: '--strict is not optional. Without it the gate prints verdict=FAIL and exits 0, which reads as a pass to anything checking exit status.' (manual-testing-playbook.md:55).

   - **Repro:** `node .skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs --skill-dir .skilled/skills/sk-doc --strct; echo exit=$?`
   - **Observed:** 'verdict=PASS valid=26 blocked=0 unenrolled=3 total=29' exit=0 - the --strct typo produced no usage/unknown-argument error. No live blocked>0 case exists in the current tree, so the FAIL->exit-0 path is evidenced by the repo's own documentation (line 55) and the exit site at 483-486, not by an executed failing run.

   <claim-adjudication id="R5-P1-002">

   ```json
{
     "claim": "A misspelled --strict silently disables the only failure exit of the typed-gold playbook gate; the repository's own playbook documents that without --strict the gate exits 0 on verdict=FAIL.",
     "evidenceRefs": [
       ".skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs:483",
       ".skilled/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md:55",
       ".skilled/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md:51"
     ],
     "counterevidenceSought": "Ran the validator against the live sk-doc playbook with and without --strict and with the --strct typo; current playbook is 26 valid/0 blocked so no live FAIL existed to observe. Checked for a CI workflow calling it; none found.",
     "alternativeExplanation": "The typo path requires an operator to both want gating and mistype it; a careful operator types --strict correctly, and the docs warn that the flag is not optional.",
     "finalSeverity": "P1",
     "confidence": 0.85,
     "downgradeTrigger": "A live blocked >0 run exiting non-zero without --strict, or a caller contract that prints/branches on the verdict text rather than the exit code, would move this to P2."
   }
   ```

   </claim-adjudication>


### P2 Findings

3. **Dangling --hub silently widens generate-router-intent-signals to all hubs; unknown flags ignored** -- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:75`

   `const only = args.includes('--hub') ? args[args.indexOf('--hub') + 1] : null;` - a trailing/dangling --hub yields `undefined`, and `plans.filter((h) => !only || h === only)` then selects every hub. In --write mode that rewrites every hub's graph-metadata.json instead of the one named. Unknown flags are likewise ignored.

   - **Repro:** `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --hub | tail -2; echo exit=$?; node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --bogus-xyz | tail -1; echo exit=$?`
   - **Observed:** Baseline --check: 'checked=7 hub(s), missing=0' / 'RESULT: PASSED' exit=0. `--check --hub` (dangling): same all-7-hubs report, exit=0, no usage error. `--check --bogus-xyz`: 'RESULT: PASSED' exit=0, no unknown-option error. Write mode was not executed (write path avoided).

4. **generate-leaf-manifest parseArgs ignores unknown flags on both --write and --check paths** -- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:43`

   parseArgs (lines 43-53) loops only over `--write`/`--check` and silently skips every other token. A misspelled flag leaves the write/check proceeding without any unknown-option error; only a missing mode or value is rejected (exit 2).

   - **Repro:** `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-doc --bogus-xyz; echo exit=$?`
   - **Observed:** Baseline --check on the sk-doc hub: leaf-manifest.json OK (b7295919a286bb1377ea78af03093b3e17625f0e8168e2768b564f49ba481b42). With --bogus-xyz appended: leaf-manifest.json OK (b7295919a286bb1377ea78af03093b3e17625f0e8168e2768b564f49ba481b42) - the unknown flag caused no error; the check ran and reported its normal result.

5. **advise-council-completion consumes an option-like token as the packet path and always exits 0** -- `.skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:29`

   The first positional is taken as packetSpecFolder; remaining tokens are checked against `--json`/`--quiet` and anything else is stored as `args.unknown`. main() still returns 0 for an unknown flag and for a missing packet, printing only advisory text.

   - **Repro:** `node .skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs --bogus-xyz; echo exit=$?`
   - **Observed:** Console output treated the token as a path: 'no council artifacts at .../--bogus-xyz/ai-council', exit=0. No usage failure exit; unknown trailing flags render as an advisory line and still exit 0.

6. **worktree-naming.sh create silently drops unknown and surplus arguments, including a --no-provision typo** -- `.skilled/skills/sk-git/scripts/worktree-naming.sh:403`

   create_named_worktree (lines 399-405) recognizes only --no-provision; every other token is consumed as slug/base and any surplus token is dropped with no error. A typo such as --no-provison therefore runs provisioning instead of skipping it, and a --dry-run token is silently ignored on a command that creates branches and worktrees.

   - **Repro:** `bash .skilled/skills/sk-git/scripts/worktree-naming.sh --help`
   - **Observed:** Code read at lines 399-405; --help (executed) prints 'create <slug> [base] [--no-provision]'. The create path is a mutating git path and was not executed (sweep contract). No unknown-argument branch exists in the case statement.

7. **Failed provisioning is downgraded to a message and exit 0 by worktree-naming.sh create** -- `.skilled/skills/sk-git/scripts/worktree-naming.sh:418`

   provision_worktree documents 'Exits non-zero if any install or build failed, so a half-provisioned tree is never reported ready' (lines 510-555), but create_named_worktree calls `provision_worktree "$dir" || echo "worktree created but provisioning failed: $dir" >&2` (line 418), so a failed install/build still yields a zero exit for the command a caller checks.

   - **Repro:** `bash .skilled/skills/sk-git/scripts/worktree-naming.sh --help`
   - **Observed:** Code read at line 418 and lines 510-555. The create/provision path installs packages and was not executed (sweep contract); the contradiction is between the callee's documented non-zero contract and the caller's `|| echo` downgrade.

8. **migrate-legacy-branch-names reports success and exits 0 after skipping collisions** -- `.skilled/skills/sk-git/scripts/migrate-legacy-branch-names.sh:116`

   A detected name collision prints 'SKIP (collision; resolve and re-run)' and `continue`s, but next_num/total were already incremented, so the final line claims '$total legacy pair(s) renamed' and the script exits 0 even when pairs were skipped.

   - **Repro:** `bash .skilled/skills/sk-git/scripts/migrate-legacy-branch-names.sh --dry-run; echo exit=$?`
   - **Observed:** Observed in-repo: migrate-legacy-branch-names: no legacy owner-first worktree branches found (this repo currently has no legacy owner-first branches, so the collision path was not reachable live). MIG_OBS. Code read at lines 113-130: the collision branch skips the rename but keeps counting; only a rename failure exits 1. The mutating (non-dry-run) path was not executed.


## Traceability Checks

None this iteration: the slice is CLI argument/exit correctness, and no spec-code or checklist claim is touched by these findings. Run traceability protocols remain pending.

## Integration Evidence

- Repro executions were run from the repository root; all read-only. Write/mutating scripts (worktree-naming.sh create/provision, migrate-legacy-branch-names.sh apply path, generate-router-intent-signals --write path) were **not** executed; those findings cite parser/exit lines and --help/--dry-run outputs only.
- Scratch fixtures for the validate-compiled-routing-scenarios repro were created under the OS temp dir; nothing in the repository was written by any run.

## Edge Cases

- validate-compiled-routing-scenarios.cjs is also imported as a module by leaf-route-replay.cjs; the `require.main === module` guard means the strict-exit finding only affects direct CLI use.
- leaf-route-replay.cjs rejects unknown flags and missing values with return 2, so the sibling that imports the validator does not inherit its silent-input behavior.

## Confirmed-Clean Surfaces

- **leaf-route-replay.cjs** - parser rejects every token outside --report/--transcripts/--prose and rejects missing values (return 2, lines 715-734); validates --transcripts dir and --prose file (749-770).
- **stamp-branch.sh** - unknown option exits 2, --dry-run/--help handled (lines 57-92).
- **validate-message.mjs** - parseArgs throws UsageError on unknown argument and on a missing value; exit-catch maps to 2 (lines 55-71, 219-225).
- **hvr_scan.py / package_skill.py / init_skill.py / validate_skill_package.py** - argparse parse_args rejects unknown options (exit 2); explicit failure exits are 0/1/2 by result.
- **regenerate-skill-derived.cjs** - parseArgs throws inputError on unknown argument; error exit 2, error-status roots exit 2 (lines 220-268).
- **orchestrate-session.cjs** - parseArgs throws on unknown argument and requires both required flags (lines 63-80).
- **replay-graph-from-artifacts.cjs** - parseArgs throws on unknown argument; missing required flags error to exit 1 (lines 38-47, 396-428).
- **advisory-noise-audit.mjs** - exits 1 (over budget) / 2 (no rules, no live control) (lines 100-171).
- **commit-id-naming.sh** - unknown command exits 2; subcommand trailing tokens are ignored but do not change mode or write path, so no finding was filed.

## Ruled Out

- Class 2 doc/parser mismatches: every usage/help string checked (hvr_scan usage block, stamp-branch usage, validate-message usage, worktree-naming usage, git-message-gate header) maps to an implemented option. No documented-but-rejected option found in this slice.
- git-message-gate.mjs fail-open on unparseable stdin/commands is a documented contract ("A command it cannot parse ... is allowed"), backed by the commit-msg/pre-push hooks; not filed.

## Not Proven

- validate-playbook-topology.cjs: no live blocked>0 fixture existed in the tree, so the FAIL->exit-0 path was not reproduced by execution; it is asserted from the exit site (483-486) plus the repository's own statement at .skilled/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md:55.
- generate-router-intent-signals.cjs --write widening to all hubs on a dangling --hub was not executed (write path avoided); only --check behavior was observed.
- worktree-naming.sh and migrate-legacy-branch-names.sh findings are code-read proofs on mutating git scripts; the sweep contract forbids executing their mutating paths.
- persist-artifacts.cjs parseArgs region was read only partially (head/key/tail); no finding is asserted for it, and its main() converts parser throws to exit 1.

## Verdict

2 P1 (CONDITIONAL) - no P0. The two P1s are the same defect shape in sibling validators: silent unknown-option acceptance plus an exit-0 default that the repository itself documents as a pass-reading failure for the playbook gate.

## Next Dimension

Slice 6 of the CLI scope (orchestrator-assigned); dimension remains correctness under the sweep contract.

Review verdict: CONDITIONAL