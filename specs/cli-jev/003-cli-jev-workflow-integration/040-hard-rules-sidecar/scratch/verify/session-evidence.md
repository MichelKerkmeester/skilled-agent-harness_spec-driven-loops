# Session evidence: phase 040 build (orchestrator record, 2026-09-30)

Branch `worktrees/071-cli-jev-sk-alignment` (worktree 071). Raw outputs sit beside this file.

## Operator decision

"Move rules out of frontmatter". The session chose the sidecar (`hard-rules.json`, a JSON array) over a SKILL.md body section because the rule engine is dependency-free and fail-open, and JSON parses with no YAML or markdown parser.

## Executors (DeepSeek V4.1 Flash on Cline at xhigh, all STATUS DONE)

- Design (`../w4-build/design.md`): found 12 readers, 6 of them missed by the context file (the Pi adapter, both OpenCode plugins, the sk-git Pi twin, the Devin permission policy and `git-rule-checks.test.mjs`). Keeping `readHardRules(skillMdPath)` meant no reader changed its call.
- Batch 1: `corpus.json` and `record-verdicts.mjs`, then the before recordings and `baseline-suites.txt` (5 suites, 135 passed, 0 failed).
- Batches 2 to 5 as one change: the engine reads the sibling sidecar, `stripQuotes` and `parseHardRules` deleted, nine sidecars emitted from the before snapshots (never retyped), nine frontmatter blocks removed, one sk-git body sentence, and the tests that read a SKILL.md.
- Batch 6: sk-doc's frontmatter contract, the frontmatter templates, the skill template and the one-line sweep of docs that said rules live in frontmatter.
- Fix after review: the `evaluate` JSDoc and a portable temp dir in the scratch recorder.
- The session ran the Hermes sync (10 of 72 copies written, 0 pruned) and the manifest refresh for cli-classifier, cli-external-orchestration and sk-doc (their routing inputs include the edited files).

## Gates from the final state

- Criterion 1: `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` exit 1. Sidecars: sk-git 17, cli-hermes 8, cli-jev 8, cli-opencode 5, cli-pi 4, cli-claude-code 2, cli-codex 2, cli-cursor 2, cli-devin 2 (50 rules).
- Criterion 2: `parseHardRules` gone from all code. Suites `s1.txt` to `s5.txt`: dispatch-rule-checks 20, dispatch-audit 75 (vitest), git-rule-checks 26, git-preflight-advisory 7, source-root-consumers 7. 135 passed, 0 failed, equal to baseline.
- Criterion 3: `compare.txt`, nine `equal <skill> <n> rows` lines, exit 0. Live hook smoke through `claude/dispatch-preflight-lint.mjs`: `pi -p --model glm-5.3-flash "task"` denied with `stdin-redirect-required`, `pi-offline-required` and `pi-provider-qualified-model`. A correct `pi -p --offline --model llmgateway/... </dev/null` passed silently. `jev choice ... -o only=x` denied with `jev-choice-option-cardinality` (`hook-smoke-jev.txt`).
- Criterion 4: 27 changed skill docs VALID (session), 37 by the reviewer's count including phase docs. The contract and the templates name `hard-rules.json`.
- Criterion 5: `h2.txt` `PASS: 72 Hermes skill copies in sync`. Also `g2.txt` all hubs fresh, `df.txt` derived metadata 15 of 15 fresh, leaf manifest 15 of 15.
- `parent-skill-check.cjs .skilled/skills/sk-git` fails 5 hub invariants because sk-git is not a parent hub (no mode registry, router or description). Not applicable and unchanged by this phase.

## Cross-family review

MiMo v2.6 Pro at high, `review-mimo-r1.txt`: VERDICT PASS, all five criteria met. It re-ran HEAD's own parser on all nine HEAD SKILL.md files and matched all 50 rules byte for byte, reproduced all 47 corpus rows live, and checked every fail-open case. Two P2s, both fixed: the `evaluate` JSDoc named the old field, and the recorder hardcoded a session scratchpad path (now `fs.mkdtempSync` under `os.tmpdir()`).
