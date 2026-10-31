---
title: "Resource Map — Moving every skill's MACHINE ROUTER section out of SKILL.md into a sibling ROUTER.md. Answer RQ-1 to RQ-5 in spec.md: every reader of the machine router with file:line; how each of the seven runtimes loads a skill; what the agent needs at run time versus what only scripts read; how a hub's MACHINE ROUTER joins its existing root ROUTER.md without breaking the router replay mode projection; and a migration that holds the routing baseline with a measured token saving."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 82
- **By category**: READMEs=0, Documents=9, Commands=9, Agents=0, Skills=57, Specs=2, Scripts=4, Tests=0, Config=0, Meta=1
- **Missing on disk**: 26
- **Scope**: research convergence output for 001-deep-research
- **Generated**: 2026-10-29T08:53:57.177Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/SYNC.md:14,27 | Cited | MISSING | Citations=2; Iterations=2 |
| .codex/SYNC.md | Cited | OK | Citations=2; Iterations=2 |
| .cursor/SYNC.md | Cited | OK | Citations=2; Iterations=2 |
| .devin/SYNC.md:20,34 | Cited | MISSING | Citations=2; Iterations=2 |
| .hermes/SYNC.md:16,24,27 | Cited | MISSING | Citations=2; Iterations=2 |
| .hermes/SYNC.md:16,24,51,65-67 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/SYNC.md:14,26 | Cited | MISSING | Citations=2; Iterations=2 |
| .pi/SYNC.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs:291-315,419-467 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/assets/create-skill-auto.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/assets/create-skill-auto.yaml:347,430 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/create/assets/create-skill-parent-auto.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/assets/create-skill-parent-auto.yaml:437,476,627,634 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/create/assets/create-skill-parent-auto.yaml:476,518,527 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs:1857,1943-2013,2019-2072,2147-2155 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs:2065-2069,2150-2152 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:72-129,388-421 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:78-79,365-421,763-765 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:815-839,842-879 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:47,194-205 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/test_routing_shape.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:229-271,455-458 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md:20-26,32-57 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:117-128,323-345 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:187-193,791-909,975-1010 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:187-193,1004-1009 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/changelog/v0.17.23.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/leaf-manifest.config.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/leaf-scopes.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/derived/sync.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/bm25.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/derived.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/SKILL.md:100-115,220-240 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/SKILL.md:266-285,323-330,480-488 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:51-70,89-100,142-160 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:51-70,89-100,142-160,234-270 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:51-70,142-160,234-270 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:373-381,517-545 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/smart-router-measurement.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/001-deep-research/research/lineages/luna/token-savings.csv | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/001-deep-research/spec.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/system-skill-advisor.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/003-contract-schemas/lib/canonical.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=2; Iterations=2 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| deepseek | lineages/deepseek/deltas/iter-001.jsonl |
| luna | lineages/luna/deltas/iter-001.jsonl |
| luna | lineages/luna/deltas/iter-002.jsonl |
| luna | lineages/luna/deltas/iter-003.jsonl |
