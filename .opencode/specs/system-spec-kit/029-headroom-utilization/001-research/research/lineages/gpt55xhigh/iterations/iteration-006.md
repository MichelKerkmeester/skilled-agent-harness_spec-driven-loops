# Iteration 006: Deep-Loop Workflow Fit

## Focus

Evaluate Headroom with deep-loop state, convergence, reducer behavior, and cli executor dispatch.

## Evidence

- Deep-research is an iterative protocol with fresh context per iteration, externalized state, and convergence detection. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:11]
- The default convergence threshold is `0.05` on `newInfoRatio`, with negative-knowledge emphasis. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:27]
- The deep-research YAML canonical state paths include config, state log, strategy, registry, dashboard, prompts, iterations, deltas, research output, and resource map. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:94]
- The cli-codex executor branch passes prompt files into `codex exec` with model, reasoning effort, service tier, approval policy, and sandbox config. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:650]
- Post-dispatch validation requires iteration markdown, state-log append, canonical JSONL fields, canonical `type:"iteration"`, and a delta file with an iteration record. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:756]
- The reducer owns registry, dashboard, and strategy synchronization and is idempotent for identical inputs. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:780]
- Synthesis compiles `research.md`, reads iteration files, emits `resource-map.md`, and appends a convergence report. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:895]
- The constitutional deep-workflow rule says deep tasks must use the workflow and must not hand-roll loop state. [SOURCE: .opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md:43]

## Findings

Deep-loop integration should treat Headroom as a leaf-context helper, not a loop owner. Headroom may help compress copied evidence bundles or long command output, but it must not rewrite:

- state JSONL,
- per-iteration delta records,
- reducer-owned registry/dashboard/strategy,
- convergence metrics,
- executor audit records,
- spec writeback payloads.

The most plausible integration mode is a future shim in prompt-pack construction: collect exact evidence, preserve citations and machine JSON, then optionally compress only selected long prose/tool-output blocks.

New information ratio: 0.55.

## Dead Ends / Ruled Out

- Running deep-loop executor seats through `headroom wrap` by default is ruled out; it would obscure executor provenance and process environment.
- Replacing deep-loop convergence with Headroom telemetry or savings metrics is ruled out.
