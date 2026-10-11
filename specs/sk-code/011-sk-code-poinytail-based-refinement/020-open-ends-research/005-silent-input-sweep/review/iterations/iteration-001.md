# Deep Review — Iteration 1 of 10 (correctness)

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review` — single LEAF iteration; no sub-agents dispatched.
- Iteration: 1 of 10, dimension `correctness`; orchestrator-assigned slice 1 of 10 (33 CLI files under `.skilled/bin` and `.skilled/commands/doctor/scripts`).
- BINDING: target=CLI scripts under .skilled/bin and .skilled/commands/doctor/scripts (slice 1 of 10, 33 files)
- BINDING: maxIterations=10
- BINDING: convergence=0.10
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep
- State: findings registry empty; no earlier iterations; no swept/saturated directions.

## Dimension

Correctness of CLI argument handling and exit codes, checked for two defect classes: (1) an unknown or misspelled option accepted silently; (2) exit 0 on a detected problem, or a header documenting an option the parser rejects. Every file's argument parser, usage/header text and exit paths were read; candidate defects were confirmed with safe read-only repro commands.

## Files Reviewed

- .skilled/bin/check-agent-mirror-sync.cjs:75
- .skilled/bin/check-no-spec-imports.cjs:146
- .skilled/bin/cli-exit-taxonomy-smoke.cjs:55
- .skilled/bin/cli-offline-smoke.cjs:35
- .skilled/bin/compiled-route-admission.cjs:47
- .skilled/bin/compiled-route-guard.cjs:121
- .skilled/bin/compiled-route-manifest.cjs:51
- .skilled/bin/compiled-route-status.cjs:284
- .skilled/bin/compiled-route-sync.cjs:1093
- .skilled/bin/compiled-route.cjs:27
- .skilled/bin/git-live-follow.sh:59
- .skilled/bin/git-primary-reconcile.sh:1
- .skilled/bin/git-sync.sh:56
- .skilled/bin/install-codex-hooks.mjs:51
- .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:145
- .skilled/bin/magicpath-utcp-exec.cjs:91
- .skilled/bin/mcp-code-mode-launcher.cjs:135
- .skilled/bin/skill-advisor.cjs:38
- .skilled/bin/speckit-completion.cjs:40
- .skilled/bin/worktree-reaper.sh:34
- .skilled/bin/worktree-session.sh:45
- .skilled/bin/worktree-status.sh:32
- .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:89
- .skilled/commands/doctor/scripts/audit_descriptions.py:439
- .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:66
- .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs:105
- .skilled/commands/doctor/scripts/git-hook-gates.cjs:67
- .skilled/commands/doctor/scripts/git-standards.cjs:76
- .skilled/commands/doctor/scripts/mcp-doctor-lib.sh:294
- .skilled/commands/doctor/scripts/mcp-doctor.sh:77
- .skilled/commands/doctor/scripts/parent-skill-check.cjs:1931
- .skilled/commands/doctor/scripts/release-update.cjs:2484
- .skilled/commands/doctor/scripts/route-validate.py:643

## Findings by Severity

### P0 Findings

None. No exit-0-after-a-detected-failure path was found in this slice.

### P1 Findings

1. **Unknown/misspelled option turns the agent-mirror gate into a vacuous exit-0 pass** -- .skilled/bin/check-agent-mirror-sync.cjs:65-75 -- `--bogus-xyz` (or the `--all` typo `--al`) is mapped through `agentNameFromPath`, filtered by `Boolean`, and the resulting zero-name set hits the 'no agent files to check — nothing verified' branch that exits 0. The gate is wired into pre-commit (`.skilled/hooks/git/pre-commit:82`) and CI (`--all`), so a mistyped flag silently converts a blocking check into a pass.
- Case: `node .skilled/bin/check-agent-mirror-sync.cjs --al` or any stray flag as the sole argument -> exit 0, no mirrors checked.
- Finding class: class-of-bug
- Scope proof: `rg -n 'unknown|argv' .skilled/bin/check-agent-mirror-sync.cjs` shows the only argv reads are `--all` detection (line 67) and name mapping (line 69); the empty-set exit (75) is the sole guard. Callers confirmed at `.skilled/hooks/git/pre-commit:82` and `.skilled/bin/README.md:167`.
- Affected surface hints: ["agent mirror gate", "pre-commit hook", "agent-mirror-sync CI"]
- Claim adjudication: {
  "type": "class-1-silent-unknown-option",
  "claim": "If the only argument is an unknown or misspelled option, check-agent-mirror-sync.cjs filters it out through agentNameFromPath, finds zero names, prints 'nothing verified', and exits 0. The script is wired into pre-commit hooks and CI, so a mistyped --all (e.g. --al) or any stray flag makes the gate report success without checking a single mirror.",
  "evidenceRefs": [
    ".skilled/bin/check-agent-mirror-sync.cjs:65-75",
    ".skilled/hooks/git/pre-commit:82",
    ".skilled/bin/README.md:167",
    "repro: node .skilled/bin/check-agent-mirror-sync.cjs --bogus-xyz -> exit=0, 'no agent files to check — nothing verified'"
  ],
  "counterevidenceSought": "Searched for an unknown-flag rejection path in the file (none: only --all and --all-detection are read), and checked callers: pre-commit passes staged file paths, CI runs --all; neither validates the flag before the empty-set branch.",
  "alternativeExplanation": "The empty-set branch is deliberate for changed-file callers whose diff contains no agent paths — a legitimate no-op. The defect is that unrecognized FLAGS share that branch with no error, so a typo is indistinguishable from 'nothing to check' at exit 0.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If every automated caller can only ever pass validated --all or concrete agent file paths and no flag typo can reach the invocation, reclassify as P2."
}

### P2 Findings

2. **Unknown options are swallowed as positionals; a --strict typo silently drops strict mode** -- .skilled/bin/speckit-completion.cjs:40-44 -- the parser pushes any unrecognized token into `positionals`; `--strcit` is ignored (strict stays false) and `--bogus-xyz` alone becomes the spec folder, printing a JSON payload with exit 0.
- Case: a caller mistypes `--strict`; the completion payload is emitted non-strict with exit 0 and no diagnostic.
- Finding class: instance-only
- Scope proof: parser read at lines 26-47; `--project-dir` without a value also degrades to cwd silently (line 37).
- Affected surface hints: ["speckit completion shim", "workflow completion state"]

3. **Shell helpers warn on an unknown arg then continue (and git-sync exits 0 in --auto hook mode)** -- .skilled/bin/git-sync.sh:56 (git-live-follow.sh:59, worktree-status.sh:32) -- the `*)` branch prints a warning and `shift`s instead of exiting, unlike the sibling scripts that exit 2.
- Case: `bash .skilled/bin/git-sync.sh --auto --bogus-xyz` -> exit 0, stderr warning only; in hook mode a misspelled flag is a silent no-op success.
- Finding class: class-of-bug
- Scope proof: all three files share the identical `*)` clause (rg over the three files, one hit each).
- Affected surface hints: ["git-sync hook mode", "live-follow", "worktree-status"]

4. **Compiled-routing helpers ignore unknown flags instead of rejecting them** -- .skilled/bin/compiled-route.cjs:27-33 (resolve.cjs:145-148, compiled-route-guard.cjs:120-122, compiled-route-status.cjs:284-287) -- options are read with `args.includes`/`indexOf` and any other token is never examined; all four repros exit 0 while ignoring `--bogus-xyz`.
- Case: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt hello --bogus-xyz` -> exit 0 routing JSON.
- Finding class: class-of-bug
- Scope proof: four sites read via rg for the argv-pattern; sibling compiled-route-manifest.cjs and compiled-route-admission.cjs do reject unknown args (exit 2), showing the intended contract.
- Affected surface hints: ["compiled routing front door", "resolver CLI", "route guard", "route status"]

5. **Extra CLI arguments (including flags) are silently ignored by parent-skill-check** -- .skilled/commands/doctor/scripts/parent-skill-check.cjs:1931 -- only `process.argv[2]` is read; `--bogus-xyz` is never examined and the audit still exits 0.
- Case: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code --bogus-xyz` -> exit 0, no diagnostic.
- Finding class: instance-only
- Scope proof: single `process.argv` read in the file (rg hit at 1931); no flag loop exists.
- Affected surface hints: ["parent-skill audit"]


## Traceability Checks

- Core `spec_code` / `checklist_evidence`: deferred — this is the correctness dimension; spec-doc claim checks belong to the traceability iteration.
- Overlay `skill_agent`: partial — confirmed `.skilled/bin/check-agent-mirror-sync.cjs` is wired to pre-commit (`.skilled/hooks/git/pre-commit:82`) and CI (`--all`, `.skilled/bin/README.md:167`), which is what raises R1-P1-001 above advisory.
- Overlay `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: not checked this iteration.
- Source tags cited in this narrative were resolved against the current worktree; paths and lines exist.

## Integration Evidence

- `.skilled/hooks/git/pre-commit:82` sets `MIRROR_CHECKER="$SOURCE_ROOT/bin/check-agent-mirror-sync.cjs"`; the `.skilled/scripts/git-hooks/pre-commit:172` twin does the same.
- `.skilled/bin/README.md:167` documents the checker as run by both pre-commit hooks and the agent-mirror-sync CI workflow.
- `.claude/SYNC.md:57` documents the CI invocation `node .skilled/bin/check-agent-mirror-sync.cjs --all`.

## Edge Cases

- `check-no-spec-imports.cjs --bogus` fails safe: the flag becomes a scan root, the scan reads zero files, and the no-proof guard exits 2 — not a finding.
- `compiled-route-manifest.cjs`, `compiled-route-admission.cjs`, `install-codex-hooks.mjs`, `git-hook-gates.cjs`, `git-standards.cjs`, `command-catalog-mirror-check.cjs`, `agent-roster-mirror-check.cjs`, `route-validate.py`, `audit_descriptions.py`, `release-update.cjs`, `mcp-doctor.sh`, `check-mcp-mutation-class.sh` and `worktree-reaper.sh` all reject unknown options with a nonzero exit; no documented-option/parser mismatch was found in the slice.
- Proxies (`skill-advisor.cjs`, `magicpath-utcp-exec.cjs`, `mcp-code-mode-launcher.cjs`) forward argv to the child CLI, so unknown-option rejection is delegated by design; no finding.
- `git-primary-reconcile.sh` takes no CLI options and documents exit 0 for every outcome; that is its stated hook contract, not a finding.

## Confirmed-Clean Surfaces

- Strict-parse CLIs (exit 2 on unknown): compiled-route-manifest/admission/sync, release-update, git-standards, git-hook-gates, command-catalog-mirror-check, agent-roster-mirror-check, install-codex-hooks, mcp-doctor.sh, check-mcp-mutation-class.sh, worktree-reaper.sh, route-validate.py (argparse), audit_descriptions.py (argparse).
- Nonzero exit on detected problems: `check-no-spec-imports.cjs` (2 = unreadable/empty scan, 1 = violation), `cli-offline-smoke.cjs` / `cli-exit-taxonomy-smoke.cjs` (1 = failing case), `compiled-route-guard.cjs` (1 = stale/drift unless --warn-only).

## Ruled Out

- `exit_zero_on_detected_problem` for this slice: every failure branch inspected returns nonzero (1/2/3/69/75); the exit-0 paths are documented no-ops (`--auto`, kill switches, --warn-only).
- `documented_option_rejected_by_parser`: compared usage/header options against parsers for all 12 candidate scripts; no mismatch. `speckit-completion.cjs` is the opposite case (parser accepts-and-ignores beyond its documented set).
- Nested-dispatch / out-of-scope mutation: none attempted; no scope violations.

## Not Proven

- `cli-offline-smoke.cjs:35-48` and `cli-exit-taxonomy-smoke.cjs:55-68` ignore unknown flags in `parseArgs`, and `--format <non-json>` silently coerces to text while consuming the next token. Repro would spawn their full suites (slow, daemon-adjacent); recorded here instead of as findings.

## Next Dimension

- dimension: security
- focus area: argv/env-derived values flowing into filesystem, git, or process-spawn sinks without validation (starting from this slice's resolved values: `--live`/`--remote`/`--interval` strings, `--out` dirs, `--repo` paths).
- reason: the silent-option/exit-code class is now swept for slice 1; untrusted-value flow is the next unswept class on the same scope.
- rotation status: correctness -> security (first rotation).
- blocked/productive carry-forward: productive = parser+exit read plus one exec repro per candidate; carry the compiled-routing ignored-flag class forward for a reuse check in later slices.
- required evidence: file:line at the sink plus a safe repro (dry-run, --help, nonexistent path, or $TMPDIR scratch).
- recovery note: none (stuck count 0).

## Verdict

1 P1 and 4 P2 findings, 0 P0. Per the mapping this iteration is CONDITIONAL.

Review verdict: CONDITIONAL
