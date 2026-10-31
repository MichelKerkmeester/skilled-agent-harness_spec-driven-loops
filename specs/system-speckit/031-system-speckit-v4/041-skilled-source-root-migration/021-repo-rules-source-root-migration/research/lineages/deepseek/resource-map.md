---
title: "Resource map - deepseek lineage"
trigger_phrases: []
---
# Resource map - deepseek lineage

Resources actually consulted by this detached lineage, by iteration. Paths are relative to the repository root; the sibling filesystem entries are outside the repository and were read only.

## Iteration 1 - Q1 census

| Resource | Role |
|---|---|
| `REPO RULES.md` | Router read end to end; 26 links measured (13 trigger rows 40-52, 13 index rows 60-72) |
| `AGENTS.md` | Five link lines / 9 instances measured |
| `repo-rules/*.md` (13 files) | Backlink census (`../REPO%20RULES.md`) |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | Full read: 437 lines, nine checks, four layout couplings |
| `.skilled/commands/create/repo-rule.md` + `assets/create-repo-rule-{auto,confirm}.yaml`, `create-repo-rule-presentation.txt` | `rules_dir` and output-string bindings |
| `.skilled/agents/orchestrate.md`, `.skilled/agents/markdown.md` | The two authored agent references |
| `.skilled/skills/sk-communication/benchmark/reply-harness/generate-prompts.mjs`, `cases.json` | Benchmark generator's two lanes |
| Packet `spec.md` | Migration semantics: REQ-001..006, edge cases, NFRs, Out-of-Scope |

## Iteration 2 - Q2 generators, mirrors, CI, artifacts

| Resource | Role |
|---|---|
| `.claude/agents/`, `.pi/agents/`, `.codex/agents/`, `.hermes/skills/` (listing + content greps) | Mirror topology and `repo-rules` carriers |
| `.opencode/` listing | Symlink farm evidence (`agents -> ../.skilled/agents`, `skills -> ../.skilled/skills`) |
| `sync-agents.cjs`, `sync-agents-pi.cjs`, `sync-skills-hermes.cjs`, `sync-runtime-mirrors.cjs` | Generators and their `SOURCE_DIR` constants |
| `check-agent-mirror-sync.cjs`, `lib/mirror-sync-verify.cjs`, `agent-roster-mirror-check.cjs` | Checkers and the runtime mirror list |
| `.github/workflows/{agent-mirror-sync,repo-rules-corpus,gate-inputs,command-tree-parity,spec-kit-check}.yml` | CI wiring |
| `.skilled/scripts/git-hooks/pre-commit`, `pre-push` (greps) | Mirror-parity gates |
| `.github/scripts/check-gate-inputs.sh` | Five rules, twin machinery, workflow parser |
| `generate-trigger-index.mjs`, `lib/corpus.mjs`, `lib/artifact.mjs`, `trigger-index.vitest.ts`, `retrieval/README.md` | Artifact pipeline, roots, determinism contract |
| `.pi/SYNC.md`, `agent-mirror-crosswalk.md` | PI generation/check documentation |

## Iteration 3 - Q3 external consumers and portability

| Resource | Role |
|---|---|
| `references/agents-md-integration.md` §8 | Documented sibling link contract |
| `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/repo-rules/` | Observed sibling links (absolute targets) and local rules |
| Packet `plan.md` §3-§5 | Authoritative checker contract, layout decision, verify commands |
| Parent and phase `spec.md` | Sibling statements, risk rows, SC-002, NFRs |
| `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`, `markdown-link-integrity.yml` | Actual link-check coverage boundary |
| Packet `scratch/` listing | Farm-integrity script absence at HEAD |

## Emitted artifacts

`BINDING.md`, `deep-research-config.json`, `deep-research-strategy.md`, `deep-research-dashboard.md`, `deep-research-state.jsonl`, `iterations/iteration-00{1,2,3}.md`, `deltas/iter-00{1,2,3}.jsonl`, `research.md`, `convergence-report.md`, `findings-registry.json`, and this map.

## Boundary note

No repository file was modified. The only writes are the artifacts above, all inside `research/lineages/deepseek/`. `generate-context.js`, `validate.sh` and all git write commands were not run.
