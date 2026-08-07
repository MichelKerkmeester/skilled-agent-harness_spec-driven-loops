# Deep-Review Strategy — skill:deep-improvement (MiMo-v2.5-pro)

## Scope
Target: `skill:deep-improvement` — review `.opencode/skills/deep-improvement/` (SKILL.md + references/ + assets/ + scripts/ + the @deep-improvement agent + /deep:start-* commands).

## Focus (this session's work — review with extra scrutiny)
- D4-R task-outcome instrument + asset lane: `scripts/skill-benchmark/{d4-ablation,score-skill-benchmark,build-report,live-executor,run-skill-benchmark}.cjs`, the new grader prompt `scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md`.
- model-benchmark envelope + sweep isolation: `scripts/model-benchmark/{dispatch-model,sweep-benchmark}.cjs` + tests `scripts/model-benchmark/tests/{dispatch-envelope,sweep-isolation}.vitest.ts`.
- sk-code-template reformat across all 49 `.cjs` (box header + sections + JSDoc) — verify no behavior drift, header/JSDoc accuracy.
- Docs: 10 new READMEs, 9 reference trigger_phrases, SKILL.md v1.11.0.0, changelog/v1.11.0.0.md — verify accuracy vs the code.

## Dimensions
correctness, security, traceability, maintainability (risk-ordered).

## Known Context
Full suite green (349/0) at review start; reformat verified behavior-preserving. Reviewer = MiMo-v2.5-pro (smaller model; COSTAR/lean profile).