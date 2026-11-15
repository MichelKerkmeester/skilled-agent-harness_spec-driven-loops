---
title: "Resource Map — Do the READMEs, AGENTS.md, CROSS-CLI.md, runtime sync docs, skill and command docs, feature catalogs and manual testing playbooks across the repo describe the current eleven agents (.skilled/agents/*.md and agent-registry.json) and their runtime copies (.claude, .codex, .cursor, .devin, .dsh, .opencode, .pi, .vibe agent folders) correctly? Find each doc line that misdescribes an agent's role, tools, status values, routing, file location, model pin or sync mechanism, and cite both the doc line and the agent or generator file it contradicts. Exclude changelogs, specs/ and archived packets."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 49
- **By category**: READMEs=2, Documents=11, Commands=3, Agents=12, Skills=16, Specs=0, Scripts=1, Tests=0, Config=2, Meta=2
- **Missing on disk**: 2
- **Scope**: research convergence output for 020-agent-docs-alignment-research
- **Generated**: 2026-11-15T15:05:57.357Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/README.md | Cited | OK | Citations=1; Iterations=1 |
| .dsh/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .codex/agents/ | Cited | OK | Citations=1; Iterations=1 |
| .cursor/agents/ | Cited | OK | Citations=2; Iterations=2 |
| .devin/agents/ | Cited | OK | Citations=1; Iterations=1 |
| .dsh/agents/ | Cited | OK | Citations=2; Iterations=2 |
| .pi/agents/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/agent-mirror-crosswalk.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/agent-mirror-crosswalk.md:2.1 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/bin/agent-mirror-crosswalk.md:2.3 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/CROSS-CLI.md | Cited | OK | Citations=1; Iterations=1 |
| .vibe/agents/ | Cited | OK | Citations=2; Iterations=2 |
| .vibe/SYNC.md | Cited | OK | Citations=2; Iterations=2 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/runtime-mirrors.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/agents/deep-research.md | Cited | OK | Citations=1; Iterations=1 |
| .claude/agents/Explore.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/agents/ | Cited | OK | Citations=2; Iterations=2 |
| .skilled/agents/agent-registry.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/agents/ai-council.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/code.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/deep-research.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/agents/deep-review.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/design.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/markdown.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/orchestrate.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/agents/README.txt | Cited | OK | Citations=3; Iterations=3 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/iteration-dispatch.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/spec-fence-writeback.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/leaf-only-nested-dispatch-refusal.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/check-agent-mirror-sync.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .vibe/agents/context.toml | Cited | OK | Citations=2; Iterations=2 |
| .vibe/agents/orchestrate.toml | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=1; Iterations=1 |
| README.md | Cited | OK | Citations=3; Iterations=3 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| vibe-a | lineages/vibe-a/deltas/iter-001.jsonl |
| vibe-a | lineages/vibe-a/deltas/iter-002.jsonl |
| vibe-a | lineages/vibe-a/deltas/iter-003.jsonl |
| vibe-b | lineages/vibe-b/deltas/iter-001.jsonl |
| vibe-b | lineages/vibe-b/deltas/iter-002.jsonl |
