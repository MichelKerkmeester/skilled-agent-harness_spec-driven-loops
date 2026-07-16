# Resource Map: gpt55-fast-5

| Resource | Coverage | Notes |
|---|---|---|
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/001-reference-research/spec.md` | Scope and success criteria | Confirms read-only research phase and fallback risk framing. |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md` | Structural merge | Covers Stage 0-4, Class A/Class B path repair, tooling-borrow, graph metadata, and verification. |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/003-external-reference-migration/plan.md` | Reference migration | Covers dependency-ordered stages A-J, advisor, codegen, commands, docs, graph metadata, ledgers, and validation. |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/004-fallback-router-wiring/plan.md` | Optional fallback scope | Confirms fallback wiring is operator-gated optional work. |
| `.opencode/skills/deep-loop-workflows/SKILL.md` | Current hub contract | Establishes current two-skill topology and single advisor identity. |
| `.opencode/skills/deep-loop-runtime/README.md` | Current runtime contract | Establishes frozen backend consumed by workflow modes. |
| `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs` | Mechanical validation | Supports direct artifact-dir iteration validation. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Fan-out retry behavior | Shows retry exhaustion settles failure rather than resolving fallback. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Fallback router implementation | Shows router capabilities and safeguards. |
| `.opencode/skills/sk-prompt-models/assets/model_profiles.json` | Model registry | Shows MiMo and GLM active, separate quota pools, and null fallback targets. |
| `.opencode/skills/system-skill-advisor/**` | Advisor migration surface | Contains routing tests, graph metadata, corpus/ledger references. |
| `.opencode/commands/deep/assets/**` | Command migration surface | Source YAML includes old skill paths and runtime script paths. |
| `.opencode/skills/system-spec-kit/**` | Integration consumer | Package scripts, vitest globs, docs, reducer tests, and workflow references use old paths. |
| `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md` | Parent-skill example | Needs semantic update for the `system-deep-loop` prefix exception. |
