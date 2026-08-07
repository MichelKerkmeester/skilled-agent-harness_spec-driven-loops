# Deep-Research Iteration 003: Command and orchestration surface

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

SKILL ROUTING: Advisor surfaced deep-context and deep-loop-runtime; for this read-only command/orchestration analysis I will use the deep-context-style research path and keep deep-loop-runtime as a boundary constraint, without running any workflow that writes state.
I will first anchor on the verified context report, then inspect the command docs, representative YAML phase graphs, and the existing improvement loop host to decide whether this is a routing-only merge or an orchestration merge.
The command Markdown confirms all four non-improvement commands are thin routers: they bind inputs and suffix mode, then hand off to YAML assets. I’m checking the three improvement-backed commands and YAML shapes next because they determine whether `loop-host.cjs` can become the common entrypoint.
The `skill-benchmark` improvement command is a direct `loop-host.cjs` invocation, while the agent/model improvement commands still route through YAML. I’m now comparing representative auto YAMLs and searching the council alias references.
Current live council command files appear to have already normalized to `/deep:ask-ai-council`; the `/speckit:deep-council` evidence is in older spec/review artifacts, not the live command entrypoint. I’ll read the live presentation slice to cite the current canonical examples.
**Recommendation**

Keep the 7 `/deep:*` commands as the public surface. Do not collapse them. Merge the five skill folders into `deep-loop-workflows` by repointing skill paths and metadata, but keep the command names, command files, setup contracts, YAML assets, and per-mode orchestration shapes stable. Use `/deep:ask-ai-council` as the canonical council command and do not carry `/speckit:deep-council` forward into live docs.

For orchestration, do not extend `deep-improvement/scripts/shared/loop-host.cjs` into the universal host for context/research/review/council. Keep per-mode YAML workflows, with an optional thin `deep-loop-workflows` mode/asset manifest above them. `loop-host.cjs` should remain the improvement-lane runner after relocation/repointing, not become a YAML replacement.

**Why Commands Stay 8**

The command surface is already independent from the skill folder. The files under `.opencode/commands/deep/` define entrypoints, setup, presentation, and YAML handoff; the skill folder is only referenced as an implementation path inside those routers/assets.

The existing commands are not interchangeable:

| Command | Evidence | Why It Must Stay Separate |
|---|---|---|
| `/deep:start-context-loop` | `.opencode/commands/deep/start-context-loop.md:80-87`, `.opencode/commands/deep/start-context-loop.md:112-114` | Shared-scope codebase context sweep with reuse-first report and context-specific setup. |
| `/deep:start-research-loop` | `.opencode/commands/deep/start-research-loop.md:76-84`, `.opencode/commands/deep/start-research-loop.md:107-116` | Research topic setup, optional spec write-back protocol, WebFetch-capable outward loop. |
| `/deep:start-review-loop` | `.opencode/commands/deep/start-review-loop.md:57-64`, `.opencode/commands/deep/start-review-loop.md:79-86` | Review target/type/dimensions setup and review-specific convergence. |
| `/deep:ask-ai-council` | `.opencode/commands/deep/ask-ai-council.md:58-74`, `.opencode/commands/deep/ask-ai-council.md:92-99` | Session/topic/round council setup with one-CLI-per-round and packet-local council artifacts. |
| `/deep:start-agent-improvement-loop` | `.opencode/commands/deep/start-agent-improvement-loop.md:67-75`, `.opencode/commands/deep/start-agent-improvement-loop.md:115-126` | Lane A setup, target agent profile, scoring mode, and guarded promotion path. |
| `/deep:start-model-benchmark-loop` | `.opencode/commands/deep/start-model-benchmark-loop.md:68-77`, `.opencode/commands/deep/start-model-benchmark-loop.md:131-141` | Lane B fixed benchmark setup and foreign benchmark output contract. |
| `/deep:start-skill-benchmark-loop` | `.opencode/commands/deep/start-skill-benchmark-loop.md:61-83` | Lane C direct `loop-host.cjs --mode=skill-benchmark` diagnostic command. |

Collapsing these into fewer commands would force one entrypoint to multiplex incompatible required inputs, tool permissions, artifact roots, state names, and safety text. That violates the byte-identical artifact bar because setup and execution paths become new behavior, not a path reorg.

**Council Naming**

The current live command surface is already canonicalized to `/deep:ask-ai-council`.

Evidence:

`.opencode/commands/deep/ask-ai-council.md:76` declares canonical attached syntax as `/deep:ask-ai-council:auto` and `/deep:ask-ai-council:confirm`.

`.opencode/commands/deep/ask-ai-council.md:94` repeats the same canonical syntax in mode routing.

`.opencode/commands/deep/assets/deep_ask-ai-council_presentation.txt:3` says the presentation source of truth is for `/deep:ask-ai-council`.

`.opencode/commands/deep/assets/deep_ask-ai-council_presentation.txt:241-243` shows only `/deep:ask-ai-council` examples.

I found no live `/speckit:deep-council` command file under `.opencode/commands/**`. The dual-name issue is historical context from older review/spec artifacts, not the current live command state. The migration should add a validation check for zero `/speckit:deep-council` references in live command/workflow assets and should not create a compatibility alias unless a separate external-consumer requirement proves it necessary.

**Orchestration Decision**

Keep per-mode YAML workflows. Add only a thin mode/asset router if useful. Do not make one universal `loop-host.cjs`.

The YAML phase graphs are materially different:

`.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml:29-35` defines an iterative context loop, and `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml:373-457` implements a special shared-scope parallel sweep where native and CLI seats analyze the same focus and the host merges findings. It uses runtime graph scripts with `--loop-type context` at `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml:514-529`.

`.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:23-29` is also an iterative loop, but its fan-out model spawns full isolated research lineages with `fanout-run.cjs --loop-type research` at `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:144-162`.

`.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:9-15` is a review loop, and `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:134-153` uses `fanout-run.cjs --loop-type review`, not context’s one-shot shared-scope sweep.

`.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml:5-11` is an iterative multi-topic session, not an iteration loop, and `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml:101-103` delegates to `orchestrate-session.cjs`.

`.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:11-18` is an iterative evaluation loop, and `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:161-218` runs propose/score/benchmark/reduce/journal steps without runtime `convergence.cjs`.

`loop-host.cjs` is not a general loop interpreter. It is a pure planner/spawner for three improvement lanes: `agent-improvement`, `model-benchmark`, and `skill-benchmark` at `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:44-45`. Its planning API maps `mode,args` to direct script invocations at `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:180-258`. It does not understand YAML phases, branch labels, host-written state, memory save steps, runtime graph convergence, council session hierarchy, or context’s shared-scope sweep.

**Mode Routing Layers**

Keep these layers distinct:

Command suffix mode is UX/control mode: `:auto`, `:confirm`, or ask. Evidence appears across command routers, for example `.opencode/commands/deep/start-context-loop.md:80-87`.

Runtime `--loop-type` is backend graph/convergence discrimination for context/research/review/council. Evidence: context uses `--loop-type context` at `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml:514-529`; research uses `--loop-type research` at `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:158-162`; review uses `--loop-type review` at `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:148-153`; council uses `--loop-type council` references at `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml:46-52`.

Improvement `loop-host --mode` is lane-local script routing. Evidence: `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:13-15` promises byte-identical default behavior for `agent-improvement`, and `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:190-258` maps lanes to concrete scripts.

A merged skill can have a mode router in `SKILL.md` or a manifest, but that router should select the correct existing workflow asset or lane runner. It should not execute all modes through one Node host.

**Rejected Alternatives**

Collapse to one `/deep:loop --mode=...`: rejected because it breaks stable operator entrypoints, loses per-command setup schemas, and risks permission over-broadening. Research has WebFetch in command tools while context/review do not, visible at `.opencode/commands/deep/start-research-loop.md:4` versus `.opencode/commands/deep/start-context-loop.md:4` and `.opencode/commands/deep/start-review-loop.md:4`.

Extend `loop-host.cjs` into a universal host: rejected because it would require reimplementing YAML workflow semantics in Node. That is behavior work and cannot plausibly meet byte-identical artifacts for single-executor runs.

Port improvement onto runtime `--loop-type improvement` during this migration: rejected for this angle because improvement currently bypasses runtime convergence and uses plateau/journal semantics. The context report flags this as high risk and non-graph-based at `.opencode/specs/deep-loops/029-deep-loop-workflows/context/context-report.md:145-147`.

**Concrete Path Changes**

Keep these command files and invocation names unchanged:

`.opencode/commands/deep/start-context-loop.md`

`.opencode/commands/deep/start-research-loop.md`

`.opencode/commands/deep/start-review-loop.md`

`.opencode/commands/deep/ask-ai-council.md`

`.opencode/commands/deep/start-agent-improvement-loop.md`

`.opencode/commands/deep/start-model-benchmark-loop.md`

`.opencode/commands/deep/start-skill-benchmark-loop.md`

Repoint skill references inside these assets:

`.opencode/commands/deep/assets/deep_start-context-loop_{auto,confirm}.yaml`

`.opencode/commands/deep/assets/deep_start-research-loop_{auto,confirm}.yaml`

`.opencode/commands/deep/assets/deep_start-review-loop_{auto,confirm}.yaml`

`.opencode/commands/deep/assets/deep_ask-ai-council_{auto,confirm}.yaml`

`.opencode/commands/deep/assets/deep_start-agent-improvement-loop_{auto,confirm}.yaml`

`.opencode/commands/deep/assets/deep_start-model-benchmark-loop_{auto,confirm}.yaml`

`.opencode/commands/deep/assets/*_presentation.txt`

Repoint direct improvement command snippets:

`.opencode/commands/deep/start-skill-benchmark-loop.md:75-83`

Change metadata frontmatter where present:

`.opencode/commands/deep/start-skill-benchmark-loop.md:1-4`

Keep runtime paths unchanged:

`.opencode/skills/deep-loop-runtime/**`

Move/repoint the improvement runner but keep its semantic scope lane-local:

Old: `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs`

New: under `.opencode/skills/deep-loop-workflows/**`, exact location dependent on the internal layout decision.

**Tradeoffs**

Stable 8-command surface preserves user muscle memory, command docs, and byte-identical setup behavior, but leaves more public entrypoints than a collapsed command would.

Per-mode YAML preserves artifacts and convergence behavior, but keeps duplicated command-gate and presentation patterns that a later refactor may want to template.

Keeping `loop-host.cjs` lane-local avoids a behavioral rewrite, but means `deep-loop-workflows` is a unified skill package, not a single executable loop host.

Path repointing is mechanically broad but lower risk than semantic orchestration consolidation.

**Risks**

A broad rename can accidentally rewrite `.opencode/skills/deep-loop-runtime/**` references; those must stay frozen.

A broad rename can miss inline command snippets in `start-skill-benchmark-loop.md` because that command does not use YAML.

If `/speckit:deep-council` is reintroduced as an alias without a compatibility requirement, it will resurrect a resolved naming inconsistency.

If `loop-host.cjs` is generalized, it will create a second orchestration engine competing with YAML and runtime `--loop-type`, making byte-identical parity unlikely.

**Depends On**

Q-ARCH must decide internal layout: preserve old subtrees under `deep-loop-workflows/` or normalize to `modes/<mode>/`. This affects exact path rewrites but not the command/orchestration decision.

Q-AGENT must decide whether native agent names stay stable. This affects YAML `agent:` fields but not command filenames.

Q-ADVISOR must decide how legacy skill aliases route to the new `deep-loop-workflows` skill_id. The command surface can stay stable either way.

Q-IMPROVE must decide whether improvement ever gains a runtime `loopType`; this recommendation says do not do that in the structural merge.

Q-BACKEND must decide whether generic helpers like loop locks and capability probes move to `deep-loop-runtime`; this recommendation leaves runtime boundaries unchanged for command orchestration.

**Open Questions**

I am uncertain whether external users or docs outside the repo still invoke `/speckit:deep-council`. The live repo command surface does not, but telemetry or external docs would be needed to justify an alias.

I am uncertain whether the final internal layout will be old subtree preservation or `modes/<mode>/`. This changes the exact path strings, not the decision to keep 7 commands and per-mode YAML.
