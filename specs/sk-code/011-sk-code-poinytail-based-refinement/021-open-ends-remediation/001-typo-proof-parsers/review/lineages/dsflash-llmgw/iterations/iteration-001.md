# Review Iteration 001

- Run: fanout-dsflash-llmgw-1791754059549-b7vcvs
- Packet: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/review/lineages/dsflash-llmgw
- Executor: cli-pi model=deepseek-v4.1-flash (detached fan-out lineage; iteration executed inline by the lineage process)
- Agent: @deep-review LEAF contract
- Started: 2026-10-11T21:30:04Z

## Dimension

D1 Correctness — parser behavior, rejected vs accepted options, exit paths. Steer questions under test: does a parser still accept a misspelled option; does it reject a valid one; are exit codes consistent with each script's existing usage code.

## Files Reviewed

- `steer.md` (lineage steering channel; read before this iteration, rulings applied)
- `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs` (assertKnownFlags:294-302)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/reject-unknown-options.mjs` (:17-26)
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` (:43-65, :698-708)
- `.skilled/skills/system-deep-loop/runtime/scripts/status.cjs`, `query.cjs`, `upsert.cjs`, `fanout-merge.cjs`, `loop-lock.cjs`, `append-state-record.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs`, `check-projection-coverage.cjs`, `check-protocol-append-sites.cjs`, `codex-dispatch.cjs`
- `.skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs` (:29-49, :172-193)
- `.skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs` (:504-514)
- `.skilled/bin/check-agent-mirror-sync.cjs`, `compiled-route.cjs`, `compiled-route-guard.cjs`, `compiled-route-status.cjs`, `speckit-completion.cjs`
- `.skilled/bin/tests/typo-flags.test.cjs` (cases), `.skilled/skills/system-deep-loop/runtime/tests/unit/typo-flags.vitest.ts` (cases)
- `.skilled/skills/sk-git/scripts/worktree-naming.sh` (:395-425, :611), `.skilled/skills/sk-git/scripts/migrate-legacy-branch-names.sh`
- `.skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh`, `verify-zombie-soak.sh`, `check-prompt-quality-card-sync.sh`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, `ci-skill-root-metadata.cjs`, `ci-router-vocabulary-reach.cjs`, `generate-leaf-manifest.cjs`, `generate-router-intent-signals.cjs`
- `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/validation/unactioned-recorded-failure-audit.mjs`, `ephemeral-pointer-audit.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/is-phase-parent.ts`, `spec-folder/generate-description.ts`, `rules/check-frontmatter-values-helper.cjs`, `rules/check-source-tags-helper.mjs`
- `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`, `.skilled/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh`, `.skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh`, `.skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Misspelled flag after the packet path still exits 0 in the council advisory script** -- `.skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:46` (set) and `:180-193` (main returns 0)
   - Case: `node .skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs . --jso` -> prints `- unknown argument: --jso` inside the advisory and exits 0; an operator running `--jso` instead of `--json` gets human text where JSON was expected, and a caller checking the exit code reads a pass.
   - Evidence: the F37 fix rejects only a flag-shaped token in the packet slot (`unknownOption`, exit 2 — `[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:35-42]`), while the flag loop at `[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:43-47]` still records later unknown flags in `args.unknown`, and `main` returns 0 unconditionally at `[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:193]`. Reproduced: exit 0 on the command above; the packet-slot variant `--jso` as argument 1 exits 2.
   - Finding class: instance-only
   - Scope proof: `rg -n "args.unknown" .skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs` shows the only remaining unknown-flag consumer is this advisory path; the other nine deep-loop scripts route unknown flags through `assertKnownFlags` (INPUT_VALIDATION, exit 3) or an explicit exit-2 branch. The defect instance is the one script where the flag loop precedes any guard.
   - Affected surface hints: ["advise-council-completion.cjs flag loop", "council completion advisory callers"]
   - Recommendation: route the flag loop's `args.unknown` through the same exit-2 branch as `unknownOption`, with the same one-line message, and extend the typo-flag test to cover the flag position (`<packet> --jso`).
   - Note: the row's source reproduction command (`advise-council-completion.cjs --bogus-xyz`, packet slot) is fixed and verified; this is the same defect class on the argument position the row did not name.

2. **Documented catalog command now exits 2 (`ci-skill-root-metadata.cjs --skills-dir .skilled/skills --check`)** -- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:89-97` vs `.skilled/skills/mcp-tooling/feature-catalog/feature-catalog.md:69`
   - Case: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills --check` -> `ci-skill-root-metadata.cjs: unknown option: --check`, exit 2. Before this change the same command ran the default read-only check and exited 0.
   - Evidence: the script's parser knows only `--skills-dir`, `--format`, `--fix`, `--skill` (`[SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:80-97]`); the mcp-tooling catalog prints the command at `[SOURCE: .skilled/skills/mcp-tooling/feature-catalog/feature-catalog.md:69]`. Reproduced above; `mcp-tooling/README.md:128` shows the flag-correct variant (`--skills-dir .skilled/skills --fix`). The packet discloses this as Known Limitation 1 in `[SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/implementation-summary.md:224]` and lists rather than edits it, which the spec's risk mitigation permits ("fix or list the caller").
   - Finding class: cross-consumer
   - Scope proof: `rg -n "ci-skill-root-metadata" .skilled .github` shows the only executable invocations are the pre-push hook (`node "$SKILL_GATE"`, no args — unaffected) and the two catalog lines; `--check` appears only in `feature-catalog.md:69`. The stale doc line is the single consumer regression.
   - Affected surface hints: ["mcp-tooling feature-catalog.md:69", "ci-skill-root-metadata.cjs parser", "pre-push skill metadata gate"]
   - Recommendation: follow-up (outside this phase's version-bump scope) update the catalog line to `--skills-dir .skilled/skills` (the script has no `--check` mode and its default is read-only); keep the Known Limitations entry until then.
   - Note: classified P2 because the packet disclosed the item and the spec's risk mitigation requires "fix or list", which listing satisfies; if the operator treats feature-catalog commands as executable contracts, promote to P1.

## Traceability Checks

- `spec_code` — partial: REQ-001/REQ-002 parser behavior verified on the sampled rows (10+ reproduced or read); one variant of F37's class is not rejected (finding 1) and one documented command is now rejected (finding 2). Deep-loop input errors keep their existing JSON `INPUT_VALIDATION`/exit-3 envelope on stdout; `speckit-completion` keeps exit 1; `frontmatter-version` keeps 64; `check-comment-hygiene` uses 3; `check-native-modules` and `worktree-naming create` use 1 and 3 respectively — all consistent with the operator decision recorded in `implementation-summary.md` Key Decisions.
- `checklist_evidence` — notApplicable: Level 1 packet, no `checklist.md` (scaffolded Level 1 exemption).

## Edge Cases

- `compiled-route.cjs` keeps a flag-shaped prompt value as the prompt (`--prompt --bogus-xyz` stays the prompt value; test T1 pins it) — verified in the test and in the parser's value-skipping loop.
- `compiled-route-status.cjs` rejects `--hub=sk-code` (value form) with exit 2; previously the value form was silently misread as the hub id (`args.indexOf('--hub') + 1` -> first token), so loud rejection is an improvement, not a regression.
- `loop-lock.cjs` validates flags only for known subcommands; an unknown subcommand still throws its own `INPUT_VALIDATION` error (exit 3) before flag validation — the script's own contract, consistent with the operator's deep-loop JSON exit decision.
- `convergence.cjs` whitelists snake_case synonyms (`convergence_mode`, `min_observations`, `sliding_window_size`); verified they are genuinely read at `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:236-263]`, so the whitelist does not create a silent no-op.
- `migrate-legacy-branch-names.sh` with a mid-sequence collision keeps numbering gaps (001, 003) and its summary range line can print `001..002` while two pairs were renamed; the collision count and exit 1 are correct, the range text is cosmetic.

## Confirmed-Clean Surfaces

- `assertKnownFlags` (first-unknown flag named, INPUT_VALIDATION code, camelCase-to-flag message reconstruction correct for typos such as `--ttl-msx`).
- `.skilled/bin` front doors: `check-agent-mirror-sync.cjs --bogus-xyz` (exit 2), `compiled-route.cjs --bogus-xyz` (exit 2), `speckit-completion.cjs --strcit` (exit 1, `-h`/`--help` still 0), `compiled-route-status.cjs --hub=sk-code` (exit 2).
- `check-comment-hygiene.sh` exit 3 for unreadable input matches the pre-commit hook's `0|2` pass / `1` violation / other-blocked switch.
- `check-graph-metadata-child-drift.sh` now treats every rc other than 0 and 9 as unverified under enforcement (scanner crash no longer reads as no-drift).
- `ci-skill-derived-freshness.cjs` returns 2 through `process.exit(run())`; `--format` value parsing preserved.
- `check-repo-rules.cjs`, `generate-router-intent-signals.cjs`, `ci-router-vocabulary-reach.cjs` value-flag skipping does not reject a flag-shaped value; `--hub` with no usable value exits 2 per F35.

## Ruled Out

- "Rejecting valid flags": sampled parsers skip the value token after each value-taking option; the shipped tests pin flag-shaped values (`--prompt --bogus-xyz`, `--roots --x`) and none regressed.
- "Exit-code drift": every sampled script keeps its pre-change usage code (64/1/3/2) per the operator decision; no inconsistency found inside a single script.
- "Guard misses unknown flags for known scripts": `convergence/status/query/upsert/fanout-merge` reject unknown camelCase keys with exit 3 JSON; no live caller passes an option outside those sets (checked against the deep command YAMLs and doctor workflow).

## Next Focus

D2 Security: trust boundaries of the changed paths — flag-shaped positionals reaching write targets (`append-state-record.cjs`, `check-projection-coverage.cjs` `--dir`), write-path protection for `--check` typos (`build-rule-cards.cjs`, `derive-command-bridges.cjs`, `render-screenshots.cjs`, `generate-context.ts`, `guided-run.ts`), and whether any parser's new strictness can be bypassed by `--flag=value` or argument-order tricks.

## Status

complete

Review verdict: PASS
