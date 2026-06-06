# Iteration 009 — Cheap-model-gates cost architecture

**Focus:** peck runs blocking reviewers on cheap small models @low (qwen3.6-plus / glm-5.1) vs spec-kit cli-* dispatch + sk-prompt-small-model + deep-review (defaults to native Opus).
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.48.

## Findings
- **[F-009-01]** peck pins blocking reviewers to small OpenCode-Go models @low (acceptance=qwen3.6-plus low, code-review=glm-5.1 low) (`external/peck-master/src/assets/agents/acceptance-reviewer.md:10-11`, `code-reviewer.md:10-11`); spec-kit deep-review DEFAULTS to native `opus`, not a cheap verifier (`deep_start-review-loop_confirm.yaml:69,74`, `start-review-loop.md:107,212`). GAP real. **ADAPT** · M · med · blast: deep-review setup docs/YAML defaults, not core reducer.
- **[F-009-02]** peck puts the rigor in the RUBRIC (code-review ≥4 block; acceptance lint+tests+AC coverage) so a cheap model suffices; spec-kit has severity/evidence rigor but not tied to cheap-model selection (`sk-code-review/references/review_core.md:20,32`). GAP partial. **ADAPT** · M · med.
- **[F-009-03]** spec-kit ALREADY has small-model dispatch infra (cli-opencode default deepseek; sk-prompt-small-model qwen/glm/minimax/mimo profiles) — plumbing, not a verification POLICY (`cli-opencode/SKILL.md:247,263`, `sk-prompt-small-model/SKILL.md:200,214`). GAP partial — "run cheap review GATES" is net-new as a default/recommended pattern. **ADAPT** · S/M · med.
- **[F-009-04]** deep-review can already run cli-opencode + map `--variant` from reasoningEffort, but doesn't select qwen/glm/low by default; fanout cli-opencode fallback is a frontier Claude model (`deep_start-review-loop_confirm.yaml:852-866`, `fanout-run.cjs:308-315`). GAP real for cost-tier PRESETS; none for raw capability. **ADAPT** · S · med.
- **[F-009-05]** FAILURE MODE: spec-kit review scope is BROADER than peck's story reviewers → low-reasoning cheap gates risk false PASS on cross-surface traceability/security (`deep-review/SKILL.md:322,327,436,453`). Use cheap models only as a bounded first-pass / parallel lineage, NOT the sole release gate for broad/system/security surfaces. **DEFER blanket default; ADAPT opt-in/benchmark-gated preset** · high risk · blast: release-readiness policy.

## Ruled out
- cli-opencode small/open-model selection already exists.
- deep-review already supports non-native executors + variant mapping.
- review rigor/evidence requirements already exist.

## Verdict contribution
Net-new = the POLICY pattern (a benchmark-gated cheap-model severity FIRST-pass preset), NOT the routing plumbing. **ADAPT as an opt-in, benchmark-gated preset** (gated by the 006 reviewer-benchmark substrate — cheap model only after it passes the regression fixtures). High-risk as a blanket default → DEFER. Secondary item; pairs naturally with 006.
