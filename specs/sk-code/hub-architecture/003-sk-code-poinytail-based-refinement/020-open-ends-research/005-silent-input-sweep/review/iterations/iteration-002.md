# Deep Review — Iteration 2 of 10 (security)

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review` — single LEAF iteration; no sub-agents dispatched.
- Iteration: 2 of 10, dimension `security`; orchestrator-assigned slice 2 of 10 (32 CLI scripts under `.skilled/commands/doctor/scripts`, `.skilled/skills/mcp-code-mode/scripts`, `.skilled/skills/mcp-tooling/**/scripts`, `.skilled/skills/sk-code/**/scripts`, `.skilled/skills/sk-design/**/scripts`).
- BINDING: target=CLI scripts slice 2 of 10 (mcp-code-mode, mcp-tooling, sk-code, sk-design scripts; 32 files)
- BINDING: maxIterations=10
- BINDING: convergence=0.10
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep
- State: registry holds R1-P1-001 and R1-P2-001..004 (slice 1, all still active); no swept or pivot directions recorded; this iteration did not re-report any of them.

## Dimension

Security rotation over the sweep's two defect classes: (1) an unknown or misspelled option silently accepted, swallowed or ignored; (2) exit 0 after a detected problem, or a header documenting an option the parser rejects. A gate that under-reports, or a parser that silently discards caller intent, is a trust-boundary failure, which is why these classes carry the security rotation. Every file's argument parser, usage/header text and exit paths were read; candidate defects were confirmed with 13 safe read-only repros under `$TMPDIR`; the one side-effecting writer was proven by parser read only.

## Files Reviewed

- .skilled/commands/doctor/scripts/route-validate.sh:47
- .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:319
- .skilled/skills/mcp-code-mode/scripts/_utils.sh:863
- .skilled/skills/mcp-code-mode/scripts/doctor.sh:27
- .skilled/skills/mcp-code-mode/scripts/install.sh:99
- .skilled/skills/mcp-code-mode/scripts/validate_config.py:455
- .skilled/skills/mcp-tooling/mcp-aside-devtools/scripts/install.sh:45
- .skilled/skills/mcp-tooling/mcp-chrome-devtools/scripts/_utils.sh:863
- .skilled/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh:297
- .skilled/skills/mcp-tooling/mcp-click-up/scripts/install.sh:51
- .skilled/skills/mcp-tooling/mcp-figma/scripts/connect-yolo.sh:11
- .skilled/skills/mcp-tooling/mcp-figma/scripts/daemon.sh:13
- .skilled/skills/mcp-tooling/mcp-figma/scripts/install.sh:43
- .skilled/skills/mcp-tooling/mcp-notion/scripts/install.sh:53
- .skilled/skills/mcp-tooling/mcp-obsidian/scripts/install.sh:52
- .skilled/skills/mcp-tooling/mcp-obsidian/scripts/verify-notion-migration-parity.sh:66
- .skilled/skills/sk-code/sk-code-obsidian/scripts/run-source-gates.sh:52
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:507
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:167
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:70
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:319
- .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:36
- .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:187
- .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:214
- .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:175
- .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:99
- .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:86
- .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:155
- .skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs:36
- .skilled/skills/sk-design/shared/scripts/render-screenshots.cjs:172
- .skilled/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs:159
- .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:3514

## Findings by Severity

### P0 Findings

None. Every failure branch in the slice's gate cluster returns nonzero (receipts in Confirmed-Clean Surfaces).

### P1 Findings

1. **Misspelled `--check` silently bypasses the screenshot-coverage gate and falls into the write path** -- .skilled/skills/sk-design/shared/scripts/render-screenshots.cjs:176 -- positionals are extracted with `args.filter((a) => !a.startsWith('--'))` and modes with `args.includes`, so any unknown or misspelled flag is silently discarded. `--chek` never sets `check = true`: the run falls through to the capture loop, prints `RESULT: PASSED` and exits 0, and the coverage question ("is every source covered") is never asked. The same swallow on `--full-page` (line 175) re-renders every form at the fixed height, and the file's own comment (lines 200-204) records that a sibling corpus compares committed images byte for byte.
- Case: an operator or agent invokes the renderer with `--chek` intending `--check`; the run exits 0 with `rendered 0, failed 0 / RESULT: PASSED` and the missing-screenshot gate never runs, where the correct flag on the same inputs exits 1 with `MISSING page.html`.
- Finding class: class-of-bug
- Scope proof: `rg -n 'argv|unknown|usage'` shows the only flag reads are `includes('--check')` (line 174), `includes('--full-page')` (line 175) and the `--`-filter (line 176); no unknown-flag rejection exists anywhere in the CLI region (lines 172-224). Caller search across `.skilled/commands`, `.skilled/hooks` and the sk-design packet found no hook or CI invocation, so the typo reaches the script from operator or agent call sites.
- Affected surface hints: ["screenshot coverage gate", "chart/design capture workflows", "byte-compared sibling corpus"]
- Claim adjudication:

```json
{
  "id": "R2-P1-001",
  "type": "class-1-silent-unknown-option",
  "claim": "render-screenshots.cjs extracts positionals with args.filter((a) => !a.startsWith('--')) and modes with args.includes, so an unknown or misspelled flag is silently discarded. With '--check' mistyped as '--chek', check mode never activates, the run falls into the capture path, prints RESULT: PASSED and exits 0, and the coverage gate silently does not run.",
  "evidenceRefs": [
    ".skilled/skills/sk-design/shared/scripts/render-screenshots.cjs:172-179",
    ".skilled/skills/sk-design/shared/scripts/render-screenshots.cjs:186-194",
    "repro: --check on $TMPDIR scratch dirs -> exit=1, 'MISSING page.html', 'RESULT: FAILED'; --chek -> exit=0, 'rendered 0, failed 0', 'RESULT: PASSED'; --check --bogus-xyz -> exit=0 with no unknown-option diagnostic"
  ],
  "counterevidenceSought": "Read the whole CLI region for an unknown-flag rejection path (none exists). Checked callers with rg across .skilled/commands, .skilled/hooks and the sk-design packet: no hook or CI invocation invokes the renderer, so the typo needs an operator or agent call site. Verified the flag cannot be consumed as a positional: the filter removes every token starting with '--'.",
  "alternativeExplanation": "The filter is deliberate so flag order and future '--' switches do not disturb the two positional roots, and the byte-compared sibling corpus would catch an accidental fixed-height overwrite downstream, loudly. The gate bypass needs one mistyped mode flag at the call site, and the script never reports which modes actually ran, so the run's success marker cannot be told apart from a real check pass.",
  "finalSeverity": "P1",
  "confidence": 0.65,
  "downgradeTrigger": "If no caller (command, workflow, agent doc) invokes this renderer's --check/--full-page modes with user-typed flags, or the downstream byte-compare corpus gate is retired, downgrade to P2."
}
```

### P2 Findings

2. **Unknown option is treated as a file path and exits 0 with no output (a --all typo silently skips the sweep)** -- .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:197 -- only `--all` is recognized (line 186); any other token falls to `os.path.abspath(sys.argv[1])`, and the not-a-file branch exits 0 at line 199 without printing anything.
- Case: `python3 check-dist-staleness.sh --al` (a typo of `--all`) checks nothing and reports nothing; the session-start cross-package sweep silently does not happen.
- Finding class: instance-only
- Scope proof: main's argv branches read at lines 175-206; the sole option read is `sys.argv[1] == "--all"`; the file's header documents `--all` and single-file modes, and the fallthrough has no diagnostic.
- Affected surface hints: ["dist staleness sweep", "session-start hook surface"]

3. **Unreadable or missing input is counted as clean, so the hygiene gate exits 0** -- .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:56 -- `check_file` returns 0 for an unreadable path after only a stderr `WARNING` (lines 51-56), and `main` exits 0 whenever any code is 0 (line 221, reached because line 219 only fires on code 1).
- Case: `check-comment-hygiene.sh <nonexistent-or-unreadable file>` prints `WARNING: cannot read ...` and exits 0; the pre-commit gate treats that as pass. With one clean and one violating file the same script correctly exits 1.
- Finding class: instance-only
- Scope proof: exit logic read at lines 214-221; wiring confirmed at `.skilled/scripts/git-hooks/pre-commit:97` (`COMMENT_CHECKER=...check-comment-hygiene.sh`) and `.skilled/hooks/git/pre-commit:29` (`CHECKER_PATH=...`), so the exit code is consumed by a blocking hook.
- Affected surface hints: ["pre-commit comment-hygiene gate", "PostToolUse hygiene hook"]

4. **Unknown flags silently ignored by a file-writing minifier (only --force is read)** -- .skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs:36 -- the parser reads `args` only through `args.includes('--force')` (line 37); every other token, including a misspelled `--force`, is discarded and the run proceeds in incremental mode. Unlike the installers in this slice, there is no `*)` rejection.
- Case: `node minify-webflow.mjs --forc` re-minifies only changed files instead of all files; no diagnostic distinguishes that from a successful forced run.
- Finding class: instance-only
- Scope proof: the file's only argv read is line 36-37; the header (lines 6-9) documents exactly `--force`; no other flag handling exists in the file.
- Affected surface hints: ["webflow minify build step"]

5. **Extra CLI arguments silently ignored by the two review-gate checkers** -- .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:100 and .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:87 -- both read only `argv[2]` as an optional input path; everything after it is discarded without a diagnostic. A flag in position 2 is misread as a path and fails loudly (exit 2), but a stray flag after a valid path is ignored and the gate reports OK.
- Case: `node check-review-final-line.js <valid-review-output> --bogus-xyz` exits 0 with `OK: ...`, the same for the findings checker; a caller appending an unintended flag sees a clean gate.
- Finding class: class-of-bug
- Scope proof: `rg -n 'argv'` shows a single read site per file (line 100 and line 87 respectively); no flag loop exists in either.
- Affected surface hints: ["review output gates (final-line, findings)"]

6. **Unknown flags and a valueless --root silently verify process.cwd() instead of the intended tree** -- .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:155 -- `parseRoot` does `argv.indexOf('--root')` and falls back to `process.cwd()` when the flag is absent, misspelled, or has no value; no unknown-flag rejection exists, and the OK report never names the tree it verified.
- Case: `node check-rule-copies.js --rooot /candidate/tree` verifies the repository root instead of the candidate and exits 0; likewise `--root` with no value.
- Finding class: instance-only
- Scope proof: parser read at lines 155-163; exit paths at 305-323 show the canary only fails on missing invariant strings, not on malformed invocation.
- Affected surface hints: ["rule-copy canary (AGENTS.md invariants)"]

7. **Unknown flags ignored by the corpus and router gates (a misspelled scope flag silently narrows coverage)** -- .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:3515 and .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:319 -- both read their options with `includes`/`indexOf` and never examine the rest of argv, so a stray flag runs the default scope and reports success. For check-corpus that default is narrower than the requested one: a misspelled `--extra` (`--extras DIR`) or `--render` is discarded, the external deliveries or render checks are not covered, and the run still prints `RESULT: PASSED` and exits 0.
- Case: `node check-corpus.cjs --extras /candidate/deliveries` exits 0 with `RESULT: PASSED` while the candidate directory was never scanned; `node verify-router-sync.cjs --bogus-xyz` runs all five legs and exits 0 without mentioning the flag.
- Finding class: class-of-bug
- Scope proof: check-corpus CLI read at lines 3514-3526 (`--families`, `--render`, `parseExtraDirectory` for `--extra` only); verify-router-sync parser read at lines 319-330 (only `--checks` is examined; unknown check ids are rejected but unknown flags are not).
- Affected surface hints: ["chart corpus gate", "sk-code router-sync gate"]

## Traceability Checks

- Core `spec_code` / `checklist_evidence`: deferred — this is the security rotation of the silent-input sweep; spec-doc claim checks belong to the traceability iteration.
- Overlay `skill_agent`: partial — confirmed the hygiene gate's pre-commit wiring (`.skilled/scripts/git-hooks/pre-commit:97`, `.skilled/hooks/git/pre-commit:29`), which is what keeps R2-P2-002 above a standalone-helper nit; confirmed no hook/CI caller for render-screenshots.cjs.
- Overlay `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: not checked this iteration.
- Source tags cited in this narrative were resolved against the current worktree; paths and lines exist.

## Integration Evidence

- `.skilled/scripts/git-hooks/pre-commit:97` sets `COMMENT_CHECKER="${SOURCE_ROOT}/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"`; `.skilled/hooks/git/pre-commit:29` sets `CHECKER_PATH="$SOURCE_ROOT/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"`.
- Caller search over `.skilled/commands`, `.skilled/hooks` and the sk-design packet found no invocation of render-screenshots.cjs; its only references outside itself are benchmark reports. Recorded here so the P1's downgrade trigger is auditable.

## Edge Cases

- `_utils.sh` (both the mcp-code-mode and mcp-chrome-devtools copies) and `router-replay-lib.cjs` are libraries with no CLI entry point: `_utils.sh` defines functions only, and the `process.argv` matches in `router-replay-lib.cjs` are checked strings inside regexes. The two defect classes do not apply.
- `check-dist-staleness.sh`'s "Always exits 0" is its documented advisory contract (header lines 9-11); R2-P2-001 is confined to the silent unknown-option path, not to that contract.
- `verify-notion-migration-parity.sh` SKIPs the Notion-source comparison checks when no `--ledger` is given (line 612) and exits 0 when nothing failed; the skip is announced in the summary line (line 629) and documented, so it is not counted as a hidden pass.
- `connect-yolo.sh` without its consent flag and `daemon.sh` with an unknown verb both refuse with exit 2; `route-validate.sh`'s self-test asserts each fixture's expected rule id and exit 1 (lines 68-77). No findings.
- `check-rule-copies.js` run with `--root <value>` does read the candidate tree; the defect is only the silent cwd fallback on a malformed flag.

## Confirmed-Clean Surfaces

- Strict-parse CLIs rejecting unknown options with a nonzero exit: `.skilled/skills/mcp-code-mode/scripts/install.sh:99` (exit 1), `doctor.sh:28` (exit 1), `validate_config.py` (argparse, exit 2), `.skilled/skills/mcp-tooling/mcp-aside-devtools/scripts/install.sh:47` (exit 1), `mcp-chrome-devtools/scripts/install.sh:297` (exit 1), `mcp-click-up/scripts/install.sh:52` (exit 1), `mcp-notion/scripts/install.sh:54` (exit 1), `mcp-obsidian/scripts/install.sh:53` (exit 1), `mcp-figma/scripts/install.sh:44` (exit 2), `mcp-figma/scripts/daemon.sh:14` (exit 2), `.skilled/commands/doctor/scripts/route-validate.sh:51` (exit 2), `skill-graph-freshness.cjs:319` (exit 2), `verify_alignment_drift.py` (argparse, exit 2), `verify-doc-claims.cjs:76-90` (exit 2), `verify-router-sync.cjs:325` (exit 2 on unknown check ids), `verify-notion-migration-parity.sh:71` (exit 2), `apply-design-md.cjs:183` (fail, exit 2), `ceiling-report.sh:191` (exit 2).
- Nonzero exit on detected problems: `check-corpus.cjs:3677` (exit 1 on corpus errors), `verify-doc-claims.cjs:393` (exit 1 on failed checks; a zero-doc walk is itself reported as a failed check), `verify-router-sync.cjs:353` (exit 1 on failed legs; leg exceptions are caught and counted), `verify-notion-migration-parity.sh:632` (exit 1 when any check FAILs), `apply-design-md.cjs:710` (exit 1 on gate failures, `RESULT: FAILED`), `skill-graph-freshness.cjs:313` (exit 1 under `--strict`), `run-all-drift-guards.sh:82` (exit 1 when any guard fails; `pipefail` + failure counter), `run-source-gates.sh:86` (exit 1 when any guard fails; absent guard scripts SKIP by documented contract), `check-rule-copies.js:313` (exit 1 on drifted wording), `check-review-final-line.js:121` and `check-review-findings.js:104` (exit 1 on failed checks), `render-screenshots.cjs:193`/`:223` (exit 1 in both check and render modes when coverage or capture fails), `check-comment-hygiene.sh:219` (exit 1 on violations), `ceiling-report.sh:219` (documented report-only contract, exit 2 only for bad arguments).

## Ruled Out

- `documented_option_rejected_by_parser` for slice 2: compared usage/header text against the parser for all 32 files; every documented option is read, and no usage block documents a flag its parser rejects. `validate_config.py`'s usage (positional path + `--check-env`) matches the argparse registration at lines 455-467; `render-screenshots.cjs`'s usage (`--check`, `--full-page`) matches lines 174-175; `check-corpus.cjs`'s usage (`--families`, `--render`, `--extra DIR`) matches lines 3515-3522; `ceiling-report.sh`'s documented exit-code table matches main().
- `exit_zero_on_detected_problem` at gate scope for slice 2: every failure branch in the gate cluster inspected returns nonzero (receipts above); the two exit-0-after-detection instances found are R2-P2-002 (unreadable input counted clean) and R2-P2-001 (advisory helper's documented always-0 contract).
- Unknown-option rejection is intact across the seven MCP installer scripts, `doctor.sh`, `daemon.sh`, `connect-yolo.sh`, `route-validate.sh`, `skill-graph-freshness.cjs`, and both python argparse CLIs; no Class 1 instance exists in that cluster.
- Nested-dispatch / out-of-scope mutation: none attempted; no scope violations.

## Not Proven

- `minify-webflow.mjs` was not executed: all of its run modes write minified files into the webflow package, outside `$TMPDIR`. R2-P2-003 rests on the parser read, per the side-effect-script rule.
- The adverse directions behind R2-P2-006 (a misspelled `--extra`/`--render` silently narrowing check-corpus coverage) are read-derived; only the unknown-flag acceptance itself was executed.

## Next Dimension

- dimension: traceability
- focus area: spec-anchored claims — the two known prior instances named in the packet spec (`spec/create.sh` gluing unknown options into the title; `regenerate-skill-derived.cjs` documenting `--skills-dir`, rejecting it, and returning 0 on a stale dry run) held against the current CLI surface, plus the sweep's spec.md acceptance claims.
- reason: security rotation complete for slice 2; correctness (slice 1) and security (slice 2) are swept, traceability is the next unswept dimension.
- rotation status: correctness -> security -> traceability.
- blocked/productive carry-forward: productive = one grep inventory plus one batched $TMPDIR repro run per slice; carry the render-screenshots gate-bypass pattern forward for a reuse check in slices 3-10.
- required evidence: file:line at the parser or sink plus a safe repro (dry-run, `--help`, nonexistent path, or `$TMPDIR` scratch).
- recovery note: none (stuck count 0).

## Verdict

1 P1 and 6 P2 findings this iteration, 0 P0. Per the mapping this iteration is CONDITIONAL.

Review verdict: CONDITIONAL
