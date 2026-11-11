---
title: "Resource Map — How can the Skilled test cycle get faster after the five cuts already built? Measured state on an 18-core Mac: the system-deep-loop suite takes 504-511 s (161 files in parallel, then 12 timing-sensitive files serially, about 265 s: tests/stress/**, tests/lifecycle/**, unit/fanout-run, unit/lineage-timestamp-window, integration/deep-research-postflip-fanout). The system-spec-kit npm test takes 841-911 s: the core lane 348-399 s (about 300 s of it is import time), the cli lane about 400 s set by tests/upgrade-legacy.vitest.ts alone, and validation about 90 s. Open items: (1) the cli lane's upgrade-legacy file sets its time; (2) the 12 serial deep-loop files; (3) the 300 s import time in the spec-kit core lane; (4) ledger read caching ideas in production code (singleWriterReadCache, gateway rescans) that change runtime behavior; (5) a smaller CI runner gains less from parallel files. Prioritize changes that keep every assertion, measure before claiming and avoid overengineering."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 42
- **By category**: READMEs=0, Documents=0, Commands=1, Agents=0, Skills=31, Specs=8, Scripts=0, Tests=0, Config=2, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 005-test-cycle-speed
- **Generated**: 2026-11-10T17:45:37.086Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/deep/assets/deep-research-auto.yaml | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/quality-guards.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/integration/deep-research-postflip-fanout.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-claude-code.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-codex.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-cursor.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-deepseek-harness.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-devin.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-opencode.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-pi.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/ledger-read-cache.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/vitest.config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/package.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/package.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/vitest.config.ts | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md | Cited | OK | Citations=7; Iterations=7 |
| specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/deep-research-config.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/deep-research-strategy.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/iterations/iteration-005.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/iterations/iteration-006.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md | Cited | OK | Citations=4; Iterations=4 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/deep-loop-runtime.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/spec-kit-check.yml | Cited | OK | Citations=3; Iterations=3 |

---
