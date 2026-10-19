---
title: "Proof: OpenCode 1.19.3 and 2.0.32"
description: "The closing proof for the OpenCode dual-compat build: both binaries, every suite against its baseline, the doctor battery on each version, the dispatch audit, one live dispatch per version, the drift guards, the scoped claim and the recursive validation."
trigger_phrases:
  - "opencode dual compat proof"
  - "two version proof"
importance_tier: "normal"
contextType: "general"
---
# Proof: OpenCode 1.19.3 and 2.0.32

Every row below was run by the orchestrator, and each output file sits under `scratch/`. A command counts as evidence only with its output and exit status read. The proof made no install change, ran no `opencode upgrade --major`, and never stopped, started or restarted the OpenCode 2 background service.

## Binaries

Captured 2026-10-19T02:22:35Z (`scratch/proof/versions.txt`):

| Command | Path | `--version` | Exit |
|---------|------|-------------|------|
| `opencode` | `~/.local/bin/opencode` (the `opencode-ai` package) | `1.19.3` | 0 |
| `opencode2` | `~/.local/bin/opencode2` (the launcher) | `opencode v2.0.32` | 0 |

## Suites against the baseline

Each suite ran twice: once before the event correction and the claim, and once from the final tree (`scratch/suites/`). Both runs gave the same counts and exited 0, and the final run is the one kept. The baseline is `../001-unknowns-and-baseline/baseline.json` for the plugin and guard suites. For the suites that phase 001 did not record, it is the count before the phase that first touched them, as phase 009 lists it.

| Suite | Command | Baseline | Final | Delta |
|-------|---------|----------|-------|-------|
| Plugins | `node --test .opencode/plugins/tests/*.test.cjs` | 303 | 355 pass, 0 fail | +52 |
| Guard (node) | `node --test` on `dispatch-rule-checks.test.mjs` and `mcp-route-guard.test.cjs` | 21 | 29 pass, 0 fail | +8 |
| Guard (vitest) | `npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` | 86 | 106 passed | +20 |
| Shared hooks | `node --test` on the stdin-deadline and sk-git hook tests | 57 | 57 pass, 0 fail | 0 |
| Classifier | `node --test` on the injection-screen tests | 78 | 90 pass, 0 fail | +12 |
| Config shape | `node --test .skilled/bin/tests/opencode-config-shape.test.cjs` | 2 | 2 pass, 0 fail | 0 |
| Gate 3 | `node --test .../gate-3-menu-parity.test.mjs` | 17 | 17 pass, 0 fail | 0 |
| Doctor | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | 380 | 7 suites, 383 pass, 0 fail | +3 |
| sk-vision | `bun test` in `vision-runtime/` | 29 | 46 pass, 0 fail | +17 |
| Deep-loop runtime | `npx vitest run --no-coverage` in `system-deep-loop/runtime/` | 2718 | 2742 passed, 8 skipped | +24 |

No count is below its baseline.

## Doctor battery

`node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=<v1|v2> --json --out=<file>`, run three times on each version (`scratch/proof/battery-*.json`, exits in `battery-exits.txt`):

| Version | Legs | Run 1 | Run 2 | Final run |
|---------|------|-------|-------|-----------|
| 1.19.3 | family present, 16 of 16 plugin files discovered, 16 of 16 loaded | exit 0 | exit 0 | exit 0 |
| 2.0.32 | family present, 16 of 16 plugin files active, 57 skill entries visible | exit 0 | exit 0 | exit 0 |

The count was stable across the three runs. The OpenCode 2 legs run against a private server the battery starts on its own port. The shared service, PID 46220, kept its start time (Sun Oct 18 12:18:22 2026) in every snapshot. One after-snapshot caught a short-lived `opencode --version` probe, and a second snapshot matched the before list (`scratch/proof/process-final-note.txt`). The verification date in the claim is 2026-10-19, the day these runs passed.

## Dispatch audit

`node scratch/proof/dispatch-audit-check.mjs` loads the six hard rules from the cli-opencode `SKILL.md` and runs each command through `inspectDispatch` and `evaluate`. Run twice with the same result, exit 0:

| Command | Classified as | Rules violated |
|---------|---------------|----------------|
| `opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash#max --format json "say hi" </dev/null` | direct, cli-opencode | none |
| `opencode2 run --standalone --format json "say hi"` | direct, cli-opencode | `stdin-redirect-required`, `explicit-model-required` |
| `opencode2 run --standalone -m ... "/deep:review x" </dev/null` | direct, cli-opencode | `v2-slash-prompt-route` |
| `opencode run --agent general --model ... </dev/null` | direct, cli-opencode | `no-bare-agent-general` |

## Live dispatch

`scratch/proof/smoke.sh` sent one cheap dispatch per version through the real lineage argv builder, in throwaway projects outside the repository, each with its own database file. The operator approved smoke runs for phases 006, 008 and 011, and this is the 011 run.

| Version | argv | Exit | Events | Shell tool | Token in reply | Lineage file | Cost (USD) |
|---------|------|------|--------|------------|----------------|--------------|------------|
| 1.19.3 | `opencode run --model llmgateway/deepseek-v4.1-flash --format json --dir <ws> --dangerously-skip-permissions --variant max` | 0 | `step_start`, `tool_use`, `step_finish`, `step_start`, `text`, `step_finish` | `bash` | yes | written | 0.002343 |
| 2.0.32 | `opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash#max --format json --auto` | 0 | `step_start`, `tool_use`, `step_finish`, `step_start`, `text` | `shell` | yes | written | 0.001197 |

Both streams carry the same four event names, each event with a `sessionID`. That contradicted the event names the docs used, and phase 010 was amended to correct them (010 decision 18).

## Agent routing on OpenCode 2

Run at the operator's request after the closeout (`scratch/agent-routing/`, decision 10). A private v2 server lists 18 agents for the repo, the 7 built-ins plus the 11 from `.opencode/agents/`, each with its frontmatter mode. Five cheap runs went against a private server in a workspace holding a copy of the agents, and each session's stored assistant message names the agent that served it:

| Case | Served by | Exit |
|------|-----------|------|
| `--agent orchestrate` (primary) | `orchestrate` | 0 |
| `--agent review` (subagent) | `review` | 0 |
| `--agent general` (built-in, rejected on OpenCode 1) | `general` | 0 |
| `--agent no-such-agent-xyz` | none, `error` event `Agent not found` | 1 |
| `As @review:` body, no `--agent` | `build`, no tool call | 0 |

Total cost about USD 0.0053, and the process list was unchanged. Untested: whether an agent-pinned model beats `-m`, since no repo agent pins one, and how an agent routes subagents onward.

## Agent temperature

Run at the operator's request (`scratch/temperature/`, decision 11). A local capture endpoint stood in for the provider, so no real model was called. The fake model was marked as supporting temperature in each version's own config shape, matching the real `llmgateway/deepseek-v4.1-flash` record.

| Case | 1.19.3 sends | 2.0.32 sends |
|------|--------------|--------------|
| `orchestrate` (0.1, primary) | `temperature: 0.1` | not run |
| `markdown` (0.1, mode all) | `temperature: 0.1` | not run |
| `review` (0.1) and `debug` (0.2), subagents | nothing, default agent after a warning | nothing |
| No `--agent` | nothing | nothing |
| Title request | `temperature: 0.5` | nothing |
| v2-native agent or model with `request.body.temperature` | not applicable | nothing |

Every run exited 0, and the process list was unchanged. Only the `openai-compatible` provider package was tested.

## Drift guards

`bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0: all 4 guards PASSED, with 10 non-blocking warnings, the same as phase 009 (`scratch/proof/drift-guards.txt`).

## Scoped claim

The D8 claim sits in the cli-opencode `SKILL.md` under Prerequisites, at the end of the README overview, and in the overview of each reference that names a version: eight references in all. Luna reviewed it and passed it (`scratch/reviews/review-claim-luna.txt`).

| Check | Result |
|-------|--------|
| `grep -n 'Verified against OpenCode 1.19.3 and 2.0.32 on' .../cli-opencode/SKILL.md` | One line, dated 2026-10-19 |
| `validate_document.py` on `SKILL.md` (skill), the README (readme) and each reference (reference) | Exit 0 on all ten |
| `validate_skill_package.py` on `cli-opencode` and on the hub | Exit 0 each (`scratch/claim/`) |
| SKILL.md words | 4,904 of 5,000 |
| `compiled-route-manifest.cjs refresh`, then `compiled-route-sync.cjs --check` | Fresh, generation 5. Sync exit 0, 55 served copies match |
| `sync-skills-hermes.cjs --check` | PASS, 68 copies in sync |
| Sample routes (`scratch/claim/routes.txt`) | cli-opencode, cli-codex, cli-opencode |

## Recursive validation

`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat --recursive --strict` prints `RESULT: PASSED` (`scratch/validate-recursive.txt`).
