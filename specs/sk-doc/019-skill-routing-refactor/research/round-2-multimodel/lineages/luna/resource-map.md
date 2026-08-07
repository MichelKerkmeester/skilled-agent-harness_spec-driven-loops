---
title: "Resource Map — Second-pass, expand-do-not-converge deep audit of the sk-doc/019-skill-routing-refactor parent packet AND its full 21-child tree, going BEYOND the first audit which only covered the parent-level docs; find what the first pass missed or could not reach. Investigate at minimum: (1) each child packet internal consistency and completion-truthfulness (spec.md status vs implementation-summary vs graph-metadata vs checklist), including the two known committed child errors 012-sk-doc-routing-fixes (missing a required Level-3 file plus LEVEL_MATCH inconsistency) and 017-system-code-graph-routing-research (frontmatter _memory-block violation), and whether similar defects exist in other children; (2) drift between the parent routing-reference docs (routing-config-and-advisor-reference.md, routing-before-after.md, context-index.md, spec.md) and the ACTUAL live state of the compiled-routing runtime at .opencode/bin/lib/compiled-routing/ and all 7 hubs hub-router.json / mode-registry.json / leaf-manifest.json / shared/references/smart-routing.md; (3) whether the just-landed parent-doc fixes in commit 140266be3e introduced any NEW inconsistency, stale cross-reference, wrong metric, or broken link; (4) lifecycle-status truthfulness parent-vs-child across the whole tree, and correctness of derived.last_active_child_id and children_ids; (5) any broken, stale, or non-repo-rooted cross-document link anywhere in the tree; (6) resume-safety and nested-topology gaps (the 020/007 duplicate-012 prefix collision and the 14-child 015 sub-parent). For EVERY finding give file:line evidence, a severity (P1 or P2), state whether it is NEW (introduced by the recent fixes) or PRE-EXISTING, and verify the claim against the real file before reporting. Do NOT treat frozen historical artifacts as defects; EXCLUDE research/**, benchmark/**, lineages/**, *.out, *.log, and run-record artifacts."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 43
- **By category**: READMEs=0, Documents=3, Commands=0, Agents=0, Skills=4, Specs=34, Scripts=2, Tests=0, Config=0, Meta=0
- **Missing on disk**: 19
- **Scope**: research convergence output for 019-skill-routing-refactor
- **Generated**: 2026-07-23T19:39:51.221Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| git ls-files .opencode/skills/system-skill-advisor/mcp_server = zero | Cited | MISSING | Citations=1; Iterations=1 |
| seven live hub shared/references/smart-routing.md files and leaf manifests verified on disk | Cited | MISSING | Citations=1; Iterations=1 |
| strict validation confirms 015 has open checklist items at checklist.md:76 and checklist.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `mcp-server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/sk-code/leaf-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-code/shared/references/smart-routing.md:17,29,40-41,317-322,347-350,399-409,411-417 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/sk-doc/shared/references/smart-routing.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/sk-doc/019-skill-routing-refactor/006-create-skill-router-marker-gap/graph-metadata.json:37 says in_progress while spec.md:19 says Analysis complete — decision pending (consistent pending state) | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/checklist.md:32 declares SPECKIT_LEVEL 3 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/implementation-summary.md: absent; strict validator FILE_EXISTS fails | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/plan.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/plan.md:33, tasks.md:32, checklist.md:32, decision-record.md:33 declare Level 3 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:36 declares Level 3 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:36 declares SPECKIT_LEVEL 3 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:90,124,149 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes/decision-record.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes/spec.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/graph-metadata.json:42 says planned while implementation-summary.md:43 says In Progress (~70%) (pending state is not represented consistently) | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/017-system-code-graph-routing-research/implementation-summary.md:15 recent_action is a long narrative value | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/017-system-code-graph-routing-research/implementation-summary.md:16 next_safe_action is a long narrative value | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/graph-metadata.json:42 says status in_progress | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/implementation-summary.md:45 says Research Complete (100%) | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/spec.md:46 says Status Research Complete | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/implementation-summary.md:54,111 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/009-sk-doc-template-alignment/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/009-sk-doc-template-alignment/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/009-sk-doc-template-alignment/spec.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/graph-metadata.json:42,210 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/spec.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json | Cited | OK | Citations=2; Iterations=2 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs | Cited | OK | Citations=1; Iterations=1 |
| .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs | Cited | OK | Citations=1; Iterations=1 |

---
