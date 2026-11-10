# Review Iteration 004

- Run: fanout-dsflash-llmgw-1791754059549-b7vcvs
- Packet: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/review/lineages/dsflash-llmgw
- Executor: cli-pi model=deepseek-v4.1-flash (detached fan-out lineage; iteration executed inline by the lineage process)
- Agent: @deep-review LEAF contract
- Started: 2026-10-11T21:41:30Z

## Dimension

D4 Maintainability — helper placement and duplication against the recorded D2/REQ-007 decision, comment hygiene in the added lines, usage/error-message accuracy, and the module-scope observation carried from iteration 2.

## Files Reviewed

- `steer.md` (lineage steering channel; read before this iteration, rulings applied)
- `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs` (assertKnownFlags) and all six importers
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/reject-unknown-options.mjs` and its four consumers (three importers + `capture-local-native-divergence-ledger.mjs` inline copy)
- `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs`, `check-repo-rules.cjs` (inline `findUnknownOption` copies)
- `.skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs`, `check-projection-coverage.cjs`, `check-protocol-append-sites.cjs` (inline variants)
- `.skilled/skills/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, `ci-skill-root-metadata.cjs`, `ci-router-vocabulary-reach.cjs`, `generate-leaf-manifest.cjs`, `generate-router-intent-signals.cjs`, `validate-compiled-routing-scenarios.cjs`, `validate-playbook-topology.cjs`
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`, `runtime/scripts/codex-dispatch.cjs`, `runtime/scripts/loop-lock.cjs`
- All added comment lines in the build diff (comment-hygiene sweep)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Unknown-option error in `verify-router-sync.cjs` reuses the check-ID usage suffix and contradicts itself** -- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:325-330`
   - Case: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --bogus-xyz` prints `verify-router-sync.cjs: unknown option: --bogus-xyz` followed by `usage: verify-router-sync [--checks 1a,1b,2,3,4] (unknown: none given)`; the `(unknown: none given)` suffix was built for check-ID validation and reads as retracting the unknown option named on the line above.
   - Evidence: reproduced above, exit 2. The new loop prints the shared usage string that ends with the ID-validation suffix (`[SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:325-330]`); the suffix is only meaningful for the `--checks` value path at `:333-337`.
   - Finding class: instance-only
   - Scope proof: `rg -n "unknown option" .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` shows one new site; the suffix string is shared with the ID path, so both callers print it. The fix is a plain usage line without the suffix.
   - Affected surface hints: ["verify-router-sync.cjs usage output"]
   - Recommendation: print `usage: verify-router-sync [--checks <id,id,...>]` (no `(unknown: ...)` suffix) in the unknown-option branch; keep the suffix only for the ID-validation branch.

2. **A missing `--format` value is reported as `unknown --format value: undefined`** -- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:56-62` (same pattern in `ci-skill-root-metadata.cjs:83-90`)
   - Case: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --format` prints `ci-leaf-manifest-freshness.cjs: unknown --format value: undefined`, exit 2; the value is missing, not unknown, and `undefined` is a JavaScript internal rather than a diagnosis. Same in `ci-skill-root-metadata.cjs --format`.
   - Evidence: both commands reproduced above. The branch assigns `args.format = argv[i + 1]` and then validates the raw value (`[SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:56-62]`, `[SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:83-90]`).
   - Finding class: class-of-bug
   - Scope proof: `rg -n "unknown --format value" .skilled/skills` lists exactly these two sites; no other script uses the pattern. Both are gate scripts whose error text is read by operators.
   - Affected surface hints: ["ci-leaf-manifest-freshness.cjs --format parsing", "ci-skill-root-metadata.cjs --format parsing"]
   - Recommendation: branch on `argv[i + 1] === undefined` and print `--format needs one of: text, json`, then validate the value separately.

## Traceability Checks

- `spec_code` — REQ-007 (shared-helper decision) verified below; REQ-001/002 carry the earlier deviations; this iteration surfaced no contradiction with the implementation summary.
- `checklist_evidence` — notApplicable (Level 1 packet).

## Helper Decision Verification (REQ-007 / D2)

- `assertKnownFlags` importers counted: six callers (`convergence.cjs`, `status.cjs`, `query.cjs`, `upsert.cjs`, `fanout-merge.cjs`, `loop-lock.cjs`) plus its home `cli-guards.cjs` — matches the recorded decision, all in the same folder with no new import edge across skills.
- `reject-unknown-options.mjs` consumers counted: three importers (`build-holdout.mjs`, `capture-scorer-eval-baseline.mjs`, `derive-ambiguity-slice.mjs`) plus the documented inline copy in `capture-local-native-divergence-ledger.mjs`, whose comment states the lone-file parity-test constraint and whose copy allows exactly `--write`/`--summary` with exit 2 — consistent with the decision.
- Inline-copy claim checked: `findUnknownOption` appears in exactly `build-rule-cards.cjs` and `check-repo-rules.cjs` (two callers, below the three-caller bar); the deep-loop checkers (`check-documentation-drift`, `check-projection-coverage`, `check-protocol-append-sites`) carry three different parser shapes, so the "no other skill reached three callers sharing one shape" sentence holds on inspection.
- `build-holdout.mjs` guards its check behind `import.meta.url === file://${process.argv[1]}`; `capture-scorer-eval-baseline.mjs` and `derive-ambiguity-slice.mjs` run their whole script at module scope and have no importers, so their unguarded top-level checks introduce no import-time regression. `capture-local-native-divergence-ledger.mjs` likewise runs at module scope.

## Comment Hygiene Sweep

- Added comment lines carry durable WHY text (why the flag must fail, why a value token may be flag-shaped, why the transient owner kind exists); no added code comment carries an ADR/REQ/CHK/task/finding id or a spec-folder path.
- The spec-folder strings in the diff are changelog front-matter references (`> Spec folder: …` in the seven `changelog/*.md` files), which the changelog template owns — they are documentation, not code comments, and pass the comment-hygiene rule.

## Edge Cases

- `compiled-route.cjs --prompt hi` (no `--hub` at all) returns the legacy sentinel with `hubId: "--prompt"` and exit 0 because the hub is derived as `args[args.indexOf('--hub') + 1]` and `indexOf` returns `-1`. Pre-existing hub-derivation behavior the commit did not touch (F16 covers unknown flags, which are rejected); recorded as an out-of-scope observation.
- `compiled-route.cjs --hub` and `compiled-route-status.cjs --hub` with no value both exit 2 with usage (reproduced), so the no-value path fails loudly even though the value-flag loop skips past the end.
- Duplicate valid flags are rejected as "unknown option" by the strict scripts (`verify-zombie-soak.sh --verbose -v` reports `unknown option: -v`); usage sanctions one flag, so the rejection is correct even though the wording says unknown.
- `check-markdown-links.cjs` evaluates its argv guard at module scope with no `require.main` guard (unlike `derive-command-bridges.cjs`); it exports nothing and has no import sites, so no triggering case exists today.

## Confirmed-Clean Surfaces

- Helper placement matches the recorded decision; no new cross-skill import edge was introduced by either helper.
- Comment hygiene: clean in every added code comment.
- `assertKnownFlags` message reconstruction (camelCase to `--kebab-case`) verified for the typo shapes the tests use.
- The sk-doc sibling scripts' stricter loops (positional rejection included) match their scripts' no-positional interfaces; none of them accepts a positional today.

## Ruled Out

- "Shared-helper decision contradicted by a third caller": counted callers in both skills; the recorded numbers hold.
- "Inline copies diverge behaviorally": `capture-local-native-divergence-ledger.mjs` allows exactly the two flags its usage documents and exits 2 with the same message shape.
- "Added comments embed ephemeral pointers": the sweep found none in code comments.
- "Module-scope argv guards break imports": no importer exists for any of the three module-scope sites.

## Next Focus

Adversarial cross-cutting pass: value-flag semantics across the whole change set (`--flag=value` acceptance/rejection, flag-shaped values, `--help` handling), exit-code consistency spot-audit against each script's pre-change usage code, and the tests' fail-without-fix property for the cases not yet reproduced live.

## Status

complete

Review verdict: PASS
