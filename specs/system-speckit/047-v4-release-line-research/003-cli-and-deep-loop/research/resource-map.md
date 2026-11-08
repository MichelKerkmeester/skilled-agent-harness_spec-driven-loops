---
title: "Resource Map — Audit the Skilled v4 release line (v4.0.0.0 to v4.0.2.0) for the CLI and deep-loop cluster: .skilled/skills/cli-external-orchestration/**, .skilled/skills/cli-classifier/**, .skilled/skills/system-deep-loop/** and .skilled/commands/deep/**. Find seven types: drift (release note vs code vs docs), misalignment with sk-code, sk-doc or Skilled canon, bugs (each with a repro command or failing check), improvement, operator and AI-user UX, over-engineering (name what breaks if removed), extension. Each finding states type, severity P0/P1/P2, a [SOURCE: path:line] you opened this iteration, the release that introduced it, confidence and a verify command. Release notes: .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0 3fed08373e, .1 bcb775402e, .2 7980001709, .3 c9bd4b156c, .4-.10 4d8f403355, .11 e2b2e393fa, .12 7fecd5f219, .13 42b41dd286, .14 bb9b9d1c09, .15 22c3a9b2c7, .16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317; always path-limit git diff. Read-only outside your research folder."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 140
- **By category**: READMEs=0, Documents=16, Commands=12, Agents=1, Skills=107, Specs=3, Scripts=1, Tests=0, Config=0, Meta=0
- **Missing on disk**: 2
- **Scope**: research convergence output for 003-cli-and-deep-loop
- **Generated**: 2026-11-08T23:08:27.767Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/agents | Cited | OK | Citations=1; Iterations=1 |
| .pi/extensions/pi-fast-mode-w-subagent-support | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.0.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/changelog/skilled/v4.0.0.2.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/changelog/skilled/v4.0.0.3.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.7.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.8.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.9.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.12.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.13.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.14.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.15.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.16.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.1.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.2.0.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/deep | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/ai-council.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/deep/assets/deep-ai-council-auto.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/deep/assets/deep-ai-council-confirm.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/assets/deep-ai-council-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/assets/deep-research-auto.yaml | Cited | OK | Citations=10; Iterations=10 |
| .skilled/commands/deep/assets/deep-research-confirm.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/deep/assets/deep-review-auto.yaml | Cited | OK | Citations=8; Iterations=8 |
| .skilled/commands/deep/assets/deep-review-confirm.yaml | Cited | OK | Citations=5; Iterations=5 |
| .skilled/commands/deep/assets/deep-review-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/review.md | Cited | OK | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/agents/deep-review.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-classifier/cli-jev/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-classifier/hub-router.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-classifier/ROUTER.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-classifier/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/cli-external-orchestration | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-claude-code/hard-rules.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-codex/hard-rules.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-devin/hard-rules.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/cli-opencode/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.16.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/hard-rules.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/hub-router.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/manual-testing-playbook.md | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/manual-testing-playbook/fanout-stress/auth-failure.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/mode-registry.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/cli-external-orchestration/ROUTER.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/SKILL.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-deep-loop/changelog/v1.4.3.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-ai-council/assets/runtime-capabilities.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-ai-council/changelog/v1.2.0.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-ai-council/changelog/v1.3.0.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/deep-mode.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/assets | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/three-signal-model.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/references/state/state-outputs.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/deep-research/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/changelog/v1.7.0.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/hub-router.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/ROUTER.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/conditional-fanin/types.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/council/adjudicator-verdict-scoring.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/index.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/event-envelope/event-type-registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/shadow-projection-store.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/mode-contracts/substrate-ports.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-deep-loop/runtime/scripts/check-projection-coverage.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=12; Iterations=12 |
| .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-deep-loop/runtime/scripts/status.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/tests/integration/deep-research-postflip-fanout.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-convergence-floor.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment-yaml-call-sites.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-deep-loop/043-fanout-resume-and-containment/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/047-v4-release-line-research/003-cli-and-deep-loop/research/deep-research-config.json | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/047-v4-release-line-research/003-cli-and-deep-loop/research/deep-research-state.jsonl | Cited | OK | Citations=4; Iterations=4 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/skill-advisor.cjs | Cited | OK | Citations=2; Iterations=2 |

---
