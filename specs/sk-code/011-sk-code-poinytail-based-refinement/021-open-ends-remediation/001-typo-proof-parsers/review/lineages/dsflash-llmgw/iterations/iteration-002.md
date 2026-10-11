# Review Iteration 002

- Run: fanout-dsflash-llmgw-1791754059549-b7vcvs
- Packet: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/review/lineages/dsflash-llmgw
- Executor: cli-pi model=deepseek-v4.1-flash (detached fan-out lineage; iteration executed inline by the lineage process)
- Agent: @deep-review LEAF contract
- Started: 2026-10-11T21:35:30Z

## Dimension

D2 Security — trust boundaries of the changed paths: can a flag-shaped positional reach a write target, can a `--check` typo still fall into the write path, and is there a bypass through `--flag=value` or argument-order tricks.

## Files Reviewed

- `steer.md` (lineage steering channel; read before this iteration, rulings applied)
- `.skilled/skills/sk-design/shared/scripts/render-screenshots.cjs` (:171-186)
- `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs` (:43-60, :232-244)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` (:384-400)
- `.skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs` (:504-514)
- `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs` (:34-44)
- `.skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs` (:409-420)
- `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/guided-run.ts` (:96-115)
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` (:936-995, :1133-1190)
- `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts` (:85-105)
- `.skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs` (:74-92)
- `.skilled/skills/system-deep-loop/runtime/scripts/check-projection-coverage.cjs`, `check-protocol-append-sites.cjs` (parseArgs)
- `.skilled/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs` (:172-187)
- `.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts` / `.sh` (parseCliArgs)
- `.skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts`, `smart-router-analyze.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/ops/process-sweep.ts`, `process-memory-harness.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/validation/evidence-marker-audit.ts`, `ephemeral-pointer-audit.mjs`, `unactioned-recorded-failure-audit.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs`, `check-source-tags-helper.mjs`
- `.skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs`
- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs`, `.skilled/skills/sk-doc/scripts/validate-doc-model-refs.js`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs`, `validate-playbook-topology.cjs`
- `.skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs`, `assets/scripts/verify-router-sync.cjs`, `.skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs`
- `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`, `check-review-final-line.js`, `check-review-findings.js`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`, `spec/repo-era.mjs`, `spec/template-phrase-lint.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`, `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new this iteration. Active from iteration 1: I1-P2-001 (council advisory flag position), I1-P2-002 (stale documented catalog command).

## Traceability Checks

- `spec_code` — REQ-001 verified for the write-capable parsers: every `--check`-adjacent typo tested below was rejected before any write. REQ-002 verified for the ten detected-problem paths (check-comment-hygiene exit 3, check-native-modules exit 1, check-graph-metadata-child-drift warn, dist-freshness error exit 1, is-phase-parent exit 2, check-frontmatter-values exit 2, unactioned audit exit 2, ephemeral-pointer exit 2, lint-goal-criteria usage exit 2, build-write-prompt exit 1 read from source + test).
- `checklist_evidence` — notApplicable (Level 1 packet, no checklist.md).

## Security Verifications (reproduced)

All commands below were run from the repository root and exited before touching any output path:

- `node .skilled/skills/sk-design/shared/scripts/render-screenshots.cjs . . --chek` -> `render-screenshots.cjs: unknown option: --chek`, exit 2 (no render).
- `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs --chekc` -> exit 2 (no cards written).
- `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --chek` -> exit 2 (no generated sources).
- `node .skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs --chek` -> exit 2 (no snapshot rewrite).
- `node .skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs --forse` -> exit 2 (no minification).
- `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --wrtie` -> exit 2 (no router rewrite).
- Read-verified before-write ordering: `generate-context.ts` throws on an unknown option inside `parseArguments` and the CLI catch exits 1 before the save lock or any write (`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:976-984, :1172-1186]`); `generate-description.ts` rejects before resolving positionals or reading files (`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:88-103]`).
- Value-flag convention verified against the flag-shaped-value rules: `guided-run.ts` consumes a flag-shaped value instead of judging it as an option (`[SOURCE: .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/guided-run.ts:96-104]`), and both inline-gate-renderer parsers exclude `--level`/`--out-dir` value positions from the unknown check (`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:248-259]`).
- `append-state-record.cjs` never lets a flag-shaped or surplus token become the append target (`[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs:82-89]`); reproduced in the shipped deep-loop test (`--bogus-xyz` exits 2 and creates no file named `--bogus-xyz`).

## Edge Cases

- `--flag=value` is rejected by every sampled parser that does not implement the `=` form (compiled-route, compiled-route-status, ci router reach, evidence-marker-audit `--folder=` is the one supported `=` form). This is stricter than before but never silently changes a run; no caller in the repository was found using the `=` form outside `--folder=`.
- A value token that is itself flag-shaped is consumed as a value by design in this change set (guided-run, inline-gate-renderer, codex-dispatch, smart-router-*), which keeps `--prompt "--flag"` and `--out-dir "-x"` working; the convention is consistent across the sampled scripts.
- `check-markdown-links.cjs` validates argv at module scope with no `require.main` guard, unlike `derive-command-bridges.cjs` which explicitly guards for module consumers. No module imports it (no `module.exports`, no `require` sites), so no case exists today; recorded as a maintainability observation for iteration 4, not an active defect.
- `smart-router-measurement.ts` treats `--jsonl` as a value option (`jsonlOutputPath`), so `--jsonl --x` consumes `--x` as the path value rather than rejecting it — consistent with the value-flag convention, and the write target is an explicit caller-supplied path.

## Confirmed-Clean Surfaces

- All six write-capable `--check`/`--force` gates reproduced above exit 2 on a misspelled spelling before any output path is touched.
- `append-state-record.cjs`, `codex-dispatch.cjs`, `parent-skill-check.cjs`, `check-review-*`, `check-rule-copies.js`, `check-corpus.cjs`, `check-diagram-corpus.cjs`, `validate-playbook-topology.cjs`, `validate-compiled-routing-scenarios.cjs`, `repo-era.mjs`, `template-phrase-lint.mjs`, `env-reader-table.mjs`, `check-markdown-links.cjs`, `generate-command-routers.cjs`, `process-sweep.ts`, `process-memory-harness.ts`, `smart-router-analyze.ts`, `strict-pass-freshness.ts`: unknown dash-tokens rejected with a named token and the script's usage code; no positional/value regression found.
- `dist-freshness.cjs` now exits 1 on an error result (F47) while keeping exit 64 for a misspelled flag and 69 for stale; its two callers (`check-dist-staleness.sh` `check-all --json`, `check-file --file <path> --json`) pass only known flags.
- `check-comment-hygiene.sh` exit 3 propagates through the pre-commit hook's `0|2` pass / `1` violation / other-blocked switch, so an unreadable input blocks instead of counting clean.
- No live caller of a changed script was found passing a now-rejected option outside the disclosed catalog line (finding I1-P2-002); deep command YAMLs, doctor workflow, pre-push/pre-commit hooks and CI workflows were checked.

## Ruled Out

- "Typo still falls into a write path": the six reproduced write-path gates reject before writes; `--check`-to-write fallthrough is closed on every sampled surface.
- "Flag-shaped positional becomes a write target": `append-state-record.cjs` and `check-frontmatter-values-helper.cjs` reject dash-prefixed positionals; write-path scripts consume values by the documented convention.
- "Module-scope guard breaks imports": only `check-markdown-links.cjs` and `minify-webflow.mjs` guard at module scope, and neither has import sites or exports.

## Next Focus

D3 Traceability: ledger completeness (68 rows), Tests-table truthfulness, version bumps and changelog entries for the seven skills, `.hermes` mirror consistency, and the goal completion-criteria commands.

## Status

complete

Review verdict: PASS
