# Review Iteration 005

- Run: fanout-dsflash-llmgw-1791754059549-b7vcvs
- Packet: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/review/lineages/dsflash-llmgw
- Executor: cli-pi model=deepseek-v4.1-flash (detached fan-out lineage; iteration executed inline by the lineage process)
- Agent: @deep-review LEAF contract
- Started: 2026-10-11T21:43:00Z

## Dimension

Adversarial cross-cutting pass (final iteration) — value-flag semantics across the whole change set (`--flag=value`, flag-shaped values, `--help`), exit-code consistency against each script's pre-change usage code, and the fail-without-fix property of the shipped tests.

## Files Reviewed

- `steer.md` (lineage steering channel; read before this iteration, rulings applied)
- `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/build-write-prompt.ts` (last unreviewed diff, F27)
- Base-commit copies via `git show 0039903bde:<path>` for: `frontmatter-version.mjs`, `dist-freshness.cjs`, `validate-command-tree-parity.sh`, `speckit-completion.cjs`, `generate-description.ts`, `compiled-route.cjs`, `check-corpus.cjs`, `parent-skill-check.cjs`, `check-agent-mirror-sync.cjs`, `advise-council-completion.cjs`
- Repository-wide invocation search for `=<value>` flag forms across `.skilled/commands`, `.skilled/scripts`, `.github`, `.opencode`
- Live `--help` probes on six changed scripts

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new this iteration. Active carried findings: I1-P2-001, I1-P2-002, I3-P2-003, I4-P2-004, I4-P2-005.

## Adversarial Checks Performed

### Exit-code consistency vs the base commit

- `frontmatter-version.mjs` used `process.exit(64)` at the base (line 464); the new unknown-option branch keeps 64.
- `dist-freshness.cjs` had three `process.exit(64)` usage sites and `STALE_EXIT_CODE = 69` at the base; the new branch keeps 64 and preserves 69; the added error exit 1 is the F47 requirement.
- `validate-command-tree-parity.sh` already used `exit 64` for an unknown argument; the new one-sided check keeps 64.
- `speckit-completion.cjs` already returned 1 for usage; the new unknown branch returns 1.
- `generate-description.ts` already used `process.exit(1)` for argument errors; the new branch keeps 1.
- `compiled-route.cjs`, `check-corpus.cjs` and `parent-skill-check.cjs` had exit-2 usage paths at the base; their new branches keep 2. `advise-council-completion.cjs`, `minify-webflow.mjs`, `validate-doc-model-refs.js` and `init-skill-graph.sh` had no usage-code path; their new branches introduce 2, matching the phase default.

### `--flag=value` and flag-shaped values

- No live caller in `.skilled/commands`, `.skilled/scripts`, `.github` or `.opencode` invokes any script with the `=<value>` form; the only supported `=` forms in the tree are `--dir=` (check-projection-coverage, check-protocol-append-sites) and `--folder=` (evidence-marker-audit), and neither is used with an unsupported spelling.
- Flag-shaped values stay values: `compiled-route.cjs --prompt --bogus-xyz` exits 0 with the prompt accepted (pinned by the T1 test); `compiled-route.cjs --hub` with no value exits 2 (reproduced); `compiled-route-status.cjs --hub` with no value exits 2 (reproduced); `check-corpus.cjs --extra` with no value exits 2 (reproduced).

### `--help` audit

- Scripts that owned help keep it: `frontmatter-version.mjs --help` (exit 0, help text), `repo-era.mjs --help` (exit 0, usage), `template-phrase-lint.mjs --help` (exit 0 per F61), `speckit-completion.cjs --help` (exit 0).
- Scripts that never had help now refuse it loudly with their usage line instead of silently treating it as data: `check-agent-mirror-sync.cjs --help` (exit 2), `render-screenshots.cjs --help` (exit 2), `check-corpus.cjs --help` (exit 2, message only), `advise-council-completion.cjs --help` (exit 2, usage). This is the intended strictness, not a regression: those scripts had no help surface before.

### Fail-without-fix property

- Direct old-vs-new execution was attempted for `check-agent-mirror-sync.cjs` and `advise-council-completion.cjs` by materializing the base-commit sources inside this lineage; both copies failed to load (their relative dependency chains resolve against the copy location: `./lib/mirror-sync-verify.cjs` -> `../skills/system-spec-kit/shared/dist/...` and `./persist-artifacts.cjs`). The experiment is recorded as inconclusive, not as evidence.
- The property is instead established from the base sources read via `git show`: neither `check-agent-mirror-sync.cjs` nor `advise-council-completion.cjs` had a rejecting branch at the base (the former filtered `--bogus-xyz` as a non-agent path and continued; the latter printed it as an advisory and returned 0). The shipped assertions require the refused flag name in the error text or the specific exit code, which the base code cannot produce, and the `.skilled/bin` suite was executed live against the current tree (10/10 pass, exit 0) with `TMPDIR` contained inside this lineage.
- `build-write-prompt.ts` (F27, last unreviewed diff): the `--study-context` read error now prints `cannot read --study-context <path>: <message>` and exits 1 instead of silently dropping the context; the script writes only the prompt to stdout, so the fail-fast path has no side effect.

## Traceability Checks

- `spec_code` — all four dimensions and both core protocols have now been reviewed; active deviations are the five P2 findings. No REQ is contradicted (REQ-001's surviving variant is I1-P2-001; REQ-007 verified in iteration 4).
- `checklist_evidence` — notApplicable (Level 1 packet).

## Edge Cases

- `check-corpus.cjs --help` prints the unknown-option line without a usage line (the only sampled script whose new branch omits usage); its README documents invocation, and no caller passes `--help`, so it stays an observation.
- `check-dist-staleness.sh` validates the unknown flag before the hook-disable switch, so even a disabled hook fails loudly on a typo; this is the intended fail-loud property of the change set.
- The `compiled-route.cjs --prompt hi` (no `--hub`) quirk recorded in iteration 4 remains pre-existing and out of the commit's scope.

## Confirmed-Clean Surfaces

- No `=`-form invocation of any changed script exists in live callers.
- Exit codes across the sampled set match each script's pre-change usage code (64/69/1/2/3) per the operator decision.
- `--help` handling is preserved where it existed and loud where it did not.
- The remaining diff (`build-write-prompt.ts`) matches its F27 row and has no side effect on the error path.

## Ruled Out

- "A live caller uses a now-rejected `--flag=value` form": repository-wide invocation search found none.
- "A script's new branch changed its existing usage code": base-commit greps show every sampled code pre-existed or matches the recorded operator decision.
- "A help surface regressed": scripts with help keep it; scripts without it now fail loudly by design.
- "F27 behaves differently from its row": the read-error path exits 1 before writing.

## Next Focus

None — this is the final iteration. Proceed to synthesis.

## Status

complete

Review verdict: PASS
