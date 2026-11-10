# Iteration 002 -- Correctness (cli playbook backticked path corrections)

Run 1, iteration 2 of 5. Dimension: correctness. Target: the backticked path corrections in commits `f30918f94b`, `3be9030128` and `cd34e1fbbe` on `worktrees/118-playbook-paths`, restricted this iteration to the 127 changed files under the seven `cli-*` packages of `.skilled/skills/cli-external-orchestration` (`git diff 41302e72be..HEAD -- .skilled/skills/cli-external-orchestration`, +146/-147 lines). Iteration 1 covered the validator change; this iteration asks whether each rewritten path names the file the scenario actually means, whether any rewrite changed a command or expected result beyond a path, and whether any removed table row is still needed.

## Dimension

Correctness of the inter-file path corrections: target identity (does the new path point at the artifact the scenario claims), instruction preservation (commands, expected signals, repair hints), and table integrity (removed rows, sibling consistency).

## Method

- Mechanical sweep of all 143 hunks in the 127-file diff: 137 hunks are pure path substitutions (removed and added lines are byte-identical once backtick spans are masked), 6 hunks across 5 files changed something else, 1 table row was removed, and 156 token substitutions were extracted and paired old to new.
- Identity checks: every substituted token resolved against `git ls-files`; headings of the 20 basename-level changes read; target existence for every class checked on disk (stress matrix, sk-prompt card, z_archive evidence, `.opencode/agents/`, `.codex/config.toml`, `.pi/extensions`); the seven package validators run as the resolution proof.
- Sampling: full old-to-new pair review for cli-claude-code (16 files), cli-codex (21 files) and cli-cursor (18 files); unique substitution-class review for cli-devin (19 files), cli-hermes (15), cli-opencode (19) and cli-pi (19). Every file is covered by at least its substitution class, exceeding the 25-file floor across all seven packages.

## Files Reviewed

- `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md:81`, `:89`
- `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/agent-routing/multi-ai-council-multi-strategy-planning.md:79`
- `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/stress/auth-failure.md:29`
- `.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/built-in-tools/mcp-server-registration.md:14`, `:29`, `:30`, `:40`, `:48`, `:72`
- `.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md:692`
- `.skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md:139`
- `.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/prompt-templates/clear-scoring-quality-card.md:18`
- `.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/stress/auth-failure.md:29`
- `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/cloud-worker/worker-help-inspection-skip-default.md:73`
- `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md:64`
- `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md:18`, `:48`, `:64`
- `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/prompt-templates/clear-scoring-quality-card.md:18`
- `specs/cli-external-orchestration/z_archive/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:55`
- `.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/rules/rules-list-and-paths.md:82`
- `.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/stress/auth-failure.md:29`
- `.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/stress/auth-failure.md:29`
- `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/general-agent-default.md:18`, `:52`
- `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/stress/auth-failure.md:29`
- `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook.md:57`
- `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/stress/auth-failure.md:29`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:399` (backtick resolver semantics)
- `.codex/config.toml:11`

## Findings by Severity

### P0

None.

### P1

None new this iteration. R1-P1-001 (residual `BACKTICK_PATH_UNRESOLVED` for `.cursor/worktrees.json` with no Remaining row) remains active: the per-package runs still show exactly that one unresolved warning.

### P2

#### R2-P2-001 -- CX-025 now prescribes `.codex/config.toml` with `mcp_servers`, while its root summary and the reference it cites still prescribe `.codex/settings.json` with `mcpServers`

The repair rewrote the CX-025 scenario to the real Codex layout: `.codex/config.toml` and `mcp_servers` ([SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/built-in-tools/mcp-server-registration.md:14], `:29`, `:30`, `:40`, `:48`, `:72`). The repo's own `.codex/config.toml:11` carries `[mcp_servers.code_mode]`, so the scenario now matches reality, and `settings.json` (the old target) does not exist under `.codex/`. However, the two sibling surfaces were not touched: the package root summary still states `Expected signals: .codex/settings.json ... mcpServers` ([SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md:692], identical at `41302e72be` and at HEAD), and the reference the scenario itself points to for stub registration, `references/codex-tools.md` section "MCP Server Integration (codex mcp)", still shows `.codex/settings.json` with a `"mcpServers"` JSON block ([SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md:131] and `:139`). An operator who follows the root summary or the cited reference registers the stub in `settings.json`; the scenario's Step 1 (`cat .codex/config.toml`) then finds no entry and the run reports FAIL although the MCP surface works. Before the repair the same three surfaces agreed with each other, so the repair converted one shared wrong claim into a disagreement between surfaces.

- claim: The CX-025 path correction exceeded a pure path fix (also renamed the config key) and was not propagated to the root summary or the cited reference, so the package now gives contradictory registration instructions.
- evidenceRefs: `mcp-server-registration.md:29`, `:48`; `manual-testing-playbook.md:692`; `codex-tools.md:139`; `.codex/config.toml:11`; `git diff --stat 41302e72be..HEAD -- .../cli-codex/manual-testing-playbook/manual-testing-playbook.md` (empty); `ls .codex/` (no settings.json).
- counterevidenceSought: checked whether the root summary or `codex-tools.md` was updated by the repair (neither is in `git diff --name-only 41302e72be..HEAD`); checked whether `settings.json` exists anywhere under `.codex/` (it does not); checked whether the validator would surface the drift (the cli-codex run reports 0 `BACKTICK_PATH_UNRESOLVED` although the root summary cites the missing file, so the root summary is outside the backtick scanner's reach).
- alternativeExplanation: `codex-tools.md` may document an older Codex JSON layout and the scenario file is the authoritative artifact, which limits the impact to operator confusion and a possible spurious FAIL when the cited reference is followed.
- finalSeverity: P2
- confidence: 0.75
- downgradeTrigger: The root summary and `codex-tools.md` are aligned to `.codex/config.toml` with `mcp_servers`, or a note is added that the reference documents a legacy layout.

### Non-path changes in the six flagged hunks

- `mcp-server-registration.md` lines 14, 29-30, 40, 48, 72: config file and key rename. See R2-P2-001.
- `goal-hook.md:57`: `-extensions/goal-context.ts` became the quoted string `"-extensions/goal-context.ts"` for `.pi/settings.json`. The quoting is right for a JSON value and the validator skips the token because a trailing quote fails its extension regex. No defect.
- `general-agent-default.md:18`, `:52`: `.opencode/agents/general.md` became prose about `.opencode/agents/`. The sentences still say `general` has no project-local agent file, the directory exists, and the built-in status is intact. No defect.
- `git-preflight-advisory.md:81`: `src/untracked.txt` became `$repo/src/untracked.txt`, naming the scratch repo variable used earlier in the same command. Correct.

## Answers to the Iteration Questions

1. Does each rewritten path name the file the scenario actually means? Yes for all 156 substitutions. The stress class (`tests/stress/cli-adapter/<cli>.vitest.ts` to `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/<cli>.vitest.ts`, 14-15 files per package) resolves to the matching cli adapter matrix file, and the repaired scenario files now agree with their root summaries, which already carried the full path. The sk-prompt card, the renamed scenario files (headings `CC-014`, `CX-015`, `CO-017`), the `z_archive` moves (the one hand-checked target carries the exact `preToolUse-Task-fired` / `preToolUse-unmatched-fired` markers the row cites), the `.pi/extensions`, `sk-design/sk-design-md-generator`, and `.skilled/hooks/task-dispatch` rewrites all resolve to the artifact named by their scenario. No stale-path signature remains.
2. Did any rewrite change a scenario's commands or expected results beyond the path? One file did: `mcp-server-registration.md` also renamed the key (`mcpServers` to `mcp_servers`), rewrote the Step 1 expectation, and changed the repair hint to an `[mcp_servers.<name>]` table. The change is factually right but incomplete across siblings, recorded as R2-P2-001. The pi quoting and opencode prose changes are improvements with no defect.
3. Was any table row removed that the scenario still needs? One row was removed: `rules-list-and-paths.md:82`, `| ../../../../CLAUDE.md | Claude repository rules |`. This is ruled out, not raised: no `CLAUDE.md` exists at the repo root or anywhere in the skill tree, so the row had no correct target to be repaired to, and the validator was already silent on the neighboring rows because they resolve from the skill root. The scenario's line 25 comparison against root `CLAUDE.md` is stale text outside this commit's changed lines and is named here rather than scored.

## Proof Runs

Per-package strict validators (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package .skilled/skills/cli-external-orchestration/<pkg>/manual-testing-playbook`): all seven packages exit 0, violations 0, warnings 1 each. Backticked-path warnings: 0 for six packages; cli-cursor keeps the single known `.cursor/worktrees.json` warning that is R1-P1-001. The resolver accepts only a directory path, so bare package ids exit 2 at `validate-playbook-package.cjs:665`; the full-path form above is the one that passes.

## Traceability Checks

- core `spec_code`: blocked (swept direction, REQ-001 evaluation not re-entered). R1-P1-001 carried.
- core `checklist_evidence`: blocked (swept direction; implementation summary still scaffold).
- overlay `playbook_capability`: pass. 7/7 package runs clean; the 127-file diff carries no new unresolved backticked path.
- overlay `skill_agent`: not re-entered (swept in iteration 1).
- overlay `agent_cross_runtime`, `feature_catalog_code`: deferred to the traceability iteration.

## Scope Violations

None.

## Verdict

CONDITIONAL. No new P0 and no new P1; one new P2 (R2-P2-001). The active prior P1 (R1-P1-001, residual `.cursor/worktrees.json` warning without a Remaining row) keeps the run below PASS.

## Next Dimension

security

Review verdict: CONDITIONAL
