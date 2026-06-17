# Deep-Research Iteration 012: acceptance gates and runtime disk confirmation

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

low-blast, read-only synthesis. I’ll load the required continuity/context first, then disk-confirm the specific runtime and doctor-route facts before making a validation-gate recommendation.
Memory trigger loading rejected the caller-provided session id; I’m retrying without it so the server can scope the read-only lookup.
Spec-memory is unavailable after retry (`Not connected`). I’ll continue with direct file evidence and still run skill routing before repository reads.
SKILL ROUTING: advisor returned an ambiguous deep-loop cluster (`deep-review`, `deep-context`, `deep-research`, `deep-ai-council` all high confidence). For this read-only synthesis iteration, I’m applying the `deep-research` skill under the user’s explicit no-write constraint.
I’m now reading the required context report before any other repository evidence, as requested.
The context report confirms the requested Q-GOV 18/19 scope and prior open facts. I’m reading the two precedent specs, validation usage, runtime directories, and doctor route evidence now.
Disk evidence confirms `executor-config.ts` and `executor-audit.ts` are present, and both runtime SQLite DBs exist. I’m checking the doctor route details because the first grep only shows `deep-loop-graph.sqlite`, not `council-graph.sqlite`.
The doctor route is currently scoped to research/review coverage only; I found no `council-graph.sqlite` reference under `.opencode/commands/doctor`. This is the one confirmed gap I’ll fold into the acceptance strategy.
I’m checking the live `/deep:*` command inventory and current Phase-0 markers so the proposed checklist names the exact command set rather than relying only on prior specs.
The live command inventory is 8 markdown commands but only 12 YAML assets. `skill-benchmark` and `non-dev-ai-system` appear thin command wrappers, so their acceptance gates need to cover both markdown wrappers and the underlying improvement lane assets they dispatch.
I’m verifying the native agent mirror surface so the acceptance checklist can specify exact parity inputs and the known whitelist.
I have the precedent-level evidence. I’m doing one targeted search for existing parity-normalization wording/scripts so the recommendation can reuse local practice rather than inventing a new artifact diff convention.
There are existing manual parity playbook entries for research/review single-executor fanout. I’m reading them to mirror their artifact expectations and extend them mode-by-mode.
The existing advisor parity tests only cover research/review/council and use old public skill IDs; the new gate must expand them to context, improvement lanes, and a mode discriminator while expecting one public skill ID.
I’m confirming the skill-graph scan/validation output names for `rejectedEdges` and `UNKNOWN-TARGET` so the gate wording uses the repo’s actual diagnostics.
I’m checking governance tree presence and top-level count declarations because the merged checklist needs reconciliation gates that account for known drift rather than assuming source counts are correct.
The governance presence check shows `deep-loop-runtime` also has both governance roots, so acceptance must explicitly exclude it from the workflow-skill merge while preserving its references. I’m counting current workflow/runtime governance files to define reconciliation evidence.
I’m checking the mode artifact filenames for the checklist so the parity matrix can name concrete outputs instead of generic “artifacts.”
**Recommendation**
Make acceptance validation a release-blocking, mode-discriminated parity suite, not a broad “rename passed” sweep. The merge is safe only if every public workflow mode proves byte-identical single-executor artifacts after timestamp normalization, advisor routing returns one public skill id plus distinct mode winners, all command/agent/governance mirrors reconcile, and both runtime graph stores are acknowledged. `/doctor deep-loop` currently does not cover both runtime graph DBs, so the spec should require either `--scope=council|all` support or a separately documented council-graph diagnostic before completion.

**Disk-Confirmed Facts**
| Fact | Finding | Evidence |
| --- | --- | --- |
| `executor-config.ts` exists | Yes | `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` is present in the directory listing. |
| `executor-audit.ts` exists | Yes | `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` is present in the directory listing. |
| Two runtime graph DBs coexist | Yes | `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite` and `council-graph.sqlite` are both present. |
| `/doctor deep-loop` covers both DBs | No | Route permits `--scope=research|review|both` only and calls runtime scripts with `loop_type`; no council scope in `.opencode/commands/doctor/_routes.yaml:101-111`. |
| `/doctor deep-loop` storage target | Only `deep-loop-graph.sqlite` | `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:78-80`. |
| Doctor docs scope | Research/review only | `.opencode/commands/doctor/assets/doctor_update_presentation.txt:193-198`. |
| Current deep command inventory | 8 markdown commands, 12 YAML assets | `start-skill-benchmark-loop.md` and `start-non-dev-ai-system-loop.md` call `loop-host.cjs` directly at `.opencode/commands/deep/start-skill-benchmark-loop.md:75-81` and `.opencode/commands/deep/start-non-dev-ai-system-loop.md:78-84`. |
| `skill_id` folder-name binding | Hard-bound | `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658`. |
| `UNKNOWN-TARGET` scan diagnostic | Real rejected-edge warning | `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:992-1030`. |
| `deep-loop` family allowed | Yes | `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:39`. |

**Governance Counts**
These are disk counts from current roots, excluding each root index in the scenario/feature totals.

| Skill | Feature entries | Playbook scenarios | Merge handling |
| --- | ---: | ---: | --- |
| `deep-context` | 25 | 25 | Move under `deep-loop-workflows/feature_catalog/context/` and `manual_testing_playbook/context/`. |
| `deep-research` | 16 | 44 | Move under `research`; fix stale “No dedicated feature_catalog” prose. |
| `deep-review` | 27 | 49 | Move under `review`; preserve severity/report semantics. |
| `deep-ai-council` | 32 | 32 | Move under `council`; normalize `FEATURE_CATALOG.md` casing. |
| `deep-improvement` | 24 | 49 | Move under `improvement`; replace stale `COVERED_FEATURES == TOTAL_FEATURES == 48` literal. |
| `deep-loop-runtime` | 27 | 29 | Do not merge into workflow governance; keep as backend governance. |

**Spec Checklist**
Use this as the `checklist.md` acceptance set.

| ID | Gate | Acceptance Check |
| --- | --- | --- |
| CHK-001 | Pre-baseline captured | Record pre-migration git SHA, command inputs, executor config, environment vars, and artifact roots for every public workflow mode before moving files. |
| CHK-002 | Deterministic parity harness | Use fixed `spec_folder`, fixed `sessionId` where supported, fixed `run_label`, fixed prompt fixtures, fixed executor/model, and fixture/replay or mock output where live LLM nondeterminism would otherwise make byte identity impossible. |
| CHK-003 | Timestamp-only normalizer | Normalize only timestamp/duration fields and ISO timestamp strings before diffing: `timestamp`, `startedAt`, `endedAt`, `createdAt`, `updatedAt`, `lastUpdatedAt`, `generatedAt`, `durationMs`, `duration_seconds`, and markdown ISO-8601 strings. |
| CHK-004 | No over-normalization | Do not normalize paths, mode names, skill IDs, session IDs unless fixed by setup, graph node IDs, content hashes, verdicts, counts, prompt text, model IDs, stop reasons, feature IDs, or artifact filenames. |
| CHK-005 | Byte-identical diff rule | For each mode, compare normalized pre/post artifact trees with recursive diff; any non-timestamp delta is a failure. Precedent: `.opencode/specs/skilled-agent-orchestration/123-deep-loop-parallel-fanout/006-command-surface-docs-parity/spec.md:34-36`. |
| CHK-006 | Context parity | `/deep:start-context-loop` single-executor run produces byte-identical `context/deep-context-config.json`, `context/deep-context-state.jsonl`, `context/deep-context-strategy.md`, `context/iterations/**`, `context/findings-registry.json`, `context/deep-context-dashboard.md`, `context/context-report.md`, and `context/context-report.json`. |
| CHK-007 | Research parity | `/deep:start-research-loop` single-executor run produces byte-identical `research/deep-research-config.json`, `research/deep-research-state.jsonl`, `research/deep-research-strategy.md`, `research/deep-research-findings-registry.json`, `research/deep-research-dashboard.md`, `research/iterations/**`, `research/research.md`, optional `research/resource-map.md`, and any research-owned generated `spec.md` fence. |
| CHK-008 | Review parity | `/deep:start-review-loop` single-executor run produces byte-identical `review/deep-review-config.json`, `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, `review/deep-review-findings-registry.json`, `review/deep-review-dashboard.md`, `review/iterations/**`, `review/resource-map.md` when enabled, and `review/review-report.md`. |
| CHK-009 | Council parity | `/deep:ask-ai-council` single-executor/single-topic fixture produces byte-identical `ai-council/**`, including config, state JSONL, strategy/dashboard assets, topic/round artifacts, reports, failed-round forensics when applicable, and persisted checksums. |
| CHK-010 | Agent-improvement parity | `/deep:start-agent-improvement-loop` Lane A fixture produces byte-identical `improvement/agent-improvement-config.json`, `improvement/agent-improvement-state.jsonl`, `improvement/improvement-journal.jsonl`, `improvement/experiment-registry.json`, `improvement/agent-improvement-dashboard.md`, `improvement/candidates/**`, and no canonical target mutation unless the fixture explicitly tests approved promotion. |
| CHK-011 | Model-benchmark parity | `/deep:start-model-benchmark-loop` Lane B fixture produces byte-identical packet-local improvement state plus foreign benchmark hub outputs under `.opencode/skills/sk-prompt-small-model/benchmarks/{run_label}/`; the foreign output path must remain unchanged. |
| CHK-012 | Skill-benchmark parity | `/deep:start-skill-benchmark-loop` Lane C fixture produces byte-identical `skill-benchmark-report.json` and `skill-benchmark-report.md`; markdown re-render from JSON is byte-identical. |
| CHK-013 | Non-dev AI-system parity | `/deep:start-non-dev-ai-system-loop` Lane D dry-run fixture produces byte-identical adapter outputs and packaging-owned `_loop/state/loop-journal.jsonl`; live refine remains separately gated by the external packaging contract. |
| CHK-014 | Old skill folders removed from live graph | The five old workflow skill folders no longer expose live `graph-metadata.json`; one live `.opencode/skills/deep-loop-workflows/graph-metadata.json` has `skill_id: "deep-loop-workflows"`. |
| CHK-015 | Runtime remains peer backend | `.opencode/skills/deep-loop-runtime` remains a separate skill; no workflow mode is moved into runtime, and runtime DB paths are not collapsed. |
| CHK-016 | Runtime disk invariant | `deep-loop-runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts`, and `database/{deep-loop-graph.sqlite,council-graph.sqlite}` are present after migration. |
| CHK-017 | Doctor graph coverage | `/doctor deep-loop` either covers both `deep-loop-graph.sqlite` and `council-graph.sqlite` with explicit scope options, or the spec documents a separate council-graph diagnostic and excludes council from `/doctor deep-loop` status claims. |
| CHK-018 | Doctor false-confidence guard | No release note or checklist claims “deep-loop graph doctor covers runtime graphs” unless council graph coverage is implemented and verified. |
| CHK-019 | Advisor public identity | `advisor_recommend` returns only `deep-loop-workflows` as the public skill for deep-loop prompts; old five IDs are not rankable public skills. |
| CHK-020 | Advisor mode discriminator | Every deep-loop recommendation includes a mode discriminator such as `context`, `research`, `review`, `council`, `agent-improvement`, `model-benchmark`, `skill-benchmark`, or `non-dev-ai-system-refine`. |
| CHK-021 | Router replay variants | Add at least three prompt variants per workflow mode; expected public `skillId` is always `deep-loop-workflows`, and expected `workflowMode` remains distinct per mode. |
| CHK-022 | Router replay context variants | Context prompts include “map existing code reuse points before planning,” “run a deep context sweep over integration points,” and “produce a reuse-first Context Report.” |
| CHK-023 | Router replay research variants | Research prompts include “deep research external API options until novelty converges,” “investigate architecture tradeoffs over multiple iterations,” and “continue the research loop and synthesize negative knowledge.” |
| CHK-024 | Router replay review variants | Review prompts include “iterative P0/P1/P2 code review until findings stabilize,” “deep review this diff across correctness and test coverage,” and “produce review-report.md.” |
| CHK-025 | Router replay council variants | Council prompts include “deliberate across three design alternatives,” “multi-seat strategy comparison with dissent,” and “check verdict stability across rounds.” |
| CHK-026 | Router replay Lane A variants | Agent-improvement prompts include “improve this agent with packet-local candidates,” “run agent improvement lane A,” and “generate guarded promotion evidence.” |
| CHK-027 | Router replay Lane B variants | Model-benchmark prompts include “benchmark this prompt framework,” “run lane B model benchmark with pattern scorer,” and “sweep a model profile and write report.json.” |
| CHK-028 | Router replay Lane C variants | Skill-benchmark prompts include “benchmark a skill’s routing,” “run skill-benchmark lane C,” and “validate D5 connectivity and skill-benchmark report.” |
| CHK-029 | Router replay Lane D variants | Non-dev prompts include “benchmark a non-dev AI-system packaging,” “packaging refine lane D with independent grader,” and “validate packaging loop kill switches.” |
| CHK-030 | Skill graph scan | Run `skill_graph_scan` after migration; response must report `rejectedEdges: 0`. |
| CHK-031 | UNKNOWN-TARGET audit | Capture skill graph scan output and grep it for `UNKNOWN-TARGET`; zero matches required. |
| CHK-032 | Skill graph validation | Run `skill_graph_validate`; validation categories and pass/warn/error state must be present, and no broken-edge errors may remain. |
| CHK-033 | Advisor rebuild | Run `advisor_rebuild({force:true})` after graph migration; freshness must return live. |
| CHK-034 | Advisor validation | Run `advisor_validate({"confirmHeavyRun":true,"skillSlug":null})` and a focused `skillSlug:"deep-loop-workflows"` slice once supported; no Python-correct prompt regressions. |
| CHK-035 | Phase-0 command inventory | The eight command markdown files are exactly `ask-ai-council.md`, `start-agent-improvement-loop.md`, `start-context-loop.md`, `start-model-benchmark-loop.md`, `start-non-dev-ai-system-loop.md`, `start-research-loop.md`, `start-review-loop.md`, and `start-skill-benchmark-loop.md`. |
| CHK-036 | Phase-0 marker grep | `rg "PHASE 0: @GENERAL AGENT VERIFICATION" .opencode/commands/deep/*.md` matches all eight command files. |
| CHK-037 | First-action order grep | Each command’s execution protocol lists “Run Phase 0” before setup and run/YAML execution. |
| CHK-038 | BLOCKED setup grep | Each command has a Phase-0 `STATUS: ☐ BLOCKED` and a setup/input `STATUS: ☐ BLOCKED`, either in the command markdown or in the command-owned presentation asset named by that markdown. |
| CHK-039 | Restart-line grep | Each Phase-0 failure box names its own restart command, not a sibling command. |
| CHK-040 | Skill reference rewrite | Command markdown/YAML/presentation assets reference `deep-loop-workflows` for workflow skill paths and preserve `.opencode/skills/deep-loop-runtime/**` paths unchanged. |
| CHK-041 | Lane C/D direct-wrapper parity | Because Lane C/D currently use direct markdown `loop-host.cjs` invocations, acceptance must preserve those wrapper contracts byte-identically or prove any new YAML wrapper emits identical commands and artifacts. |
| CHK-042 | Native agent names preserved | The five native agent names remain `deep-context`, `deep-research`, `deep-review`, `deep-improvement`, and `ai-council`. |
| CHK-043 | Three-way agent mirror parity | For each native agent, compare `.opencode/agents/*.md`, `.claude/agents/*.md`, and `.codex/agents/*.toml` after normalizing TOML wrapper/frontmatter and whitelisting only the `Path Convention` line. |
| CHK-044 | Agent skill refs repointed | Agent bodies refer to `deep-loop-workflows` mode resources where they previously loaded old workflow skill paths; agent names and artifact names are not mechanically renamed. |
| CHK-045 | Codex TOML preservation | `.codex/agents/*.toml` retains TOML fields such as `model` and `sandbox_mode`; only the embedded instruction body changes as needed. |
| CHK-046 | Governance roots present | `deep-loop-workflows/feature_catalog/feature_catalog.md` and `deep-loop-workflows/manual_testing_playbook/manual_testing_playbook.md` exist with top-level mode partitions. |
| CHK-047 | Governance counts reconcile | Merged per-mode feature/playbook counts equal disk-derived source counts for the five workflow skills: context 25/25, research 16/44, review 27/49, council 32/32, improvement 24/49. |
| CHK-048 | Runtime governance excluded | `deep-loop-runtime` governance counts 27/29 remain under runtime and are not folded into workflow totals. |
| CHK-049 | Council casing normalized | Council `FEATURE_CATALOG.md` is normalized to lowercase `feature_catalog.md`; no live references to uppercase remain except historical changelog/archive text. |
| CHK-050 | Stale governance prose removed | Merged governance removes stale claims like research “No dedicated feature_catalog” and improvement `TOTAL_FEATURES == 48`; counts are generated from disk or explicitly mode-scoped. |
| CHK-051 | ID collision policy | CP-style collisions are resolved by mode-qualified IDs at the merged root index level, not by renumbering source feature files. |
| CHK-052 | Source-file path rewrite | Governance SOURCE FILES tables point to `deep-loop-workflows/<mode>/**` or `deep-loop-runtime/**` as appropriate; no live old skill-root paths remain outside allowed history/alias contexts. |
| CHK-053 | Spec validation | Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows --strict --recursive`; exit code must be 0. Usage contract is documented at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:94-105`. |
| CHK-054 | Skill doc validation | For every modified skill doc, run the project’s doc validator such as `python3 .opencode/skills/sk-doc/scripts/validate_document.py <path>`; `validate.sh` is for spec folders, not skill roots. |
| CHK-055 | Runtime/unit tests | Run affected package tests, including deep-loop-runtime unit tests and system-skill-advisor routing/graph tests. Existing research/review parity playbooks expect the runtime vitest suite to stay green. |
| CHK-056 | Old-id grep | `rg "\.opencode/skills/deep-(context|research|review|ai-council|improvement)"` has matches only in allowed historical/changelog/archive/compat notes or deliberate alias documentation. |
| CHK-057 | Advisor old-id grep | Advisor scorer aliases/fixtures no longer treat old IDs as public winners; they map to `deep-loop-workflows` plus mode metadata. |
| CHK-058 | Final no-regression evidence | Checklist completion records pre/post artifact manifests, normalized diff outputs, scan/rebuild/validate outputs, test command exits, and any accepted timestamp-only deltas. |

**Pass-1 Amendments**
I would not change the core two-skill architecture. I would amend the validation interpretation in two places.

Amend Iter-3 slightly: “keep per-mode YAML workflows” should not force new YAML assets for Lane C/D. The current live `skill-benchmark` and `non-dev-ai-system` commands are direct markdown wrappers around `loop-host.cjs`, so parity should preserve or prove the direct wrapper behavior rather than inventing YAML solely for symmetry.

Add a Q-GOV acceptance blocker: `/doctor deep-loop` currently covers research/review `deep-loop-graph.sqlite` only, while the runtime also has `council-graph.sqlite`. Completion must not claim doctor coverage for all deep-loop runtime graphs until council coverage is added or explicitly split into a separate diagnostic.
