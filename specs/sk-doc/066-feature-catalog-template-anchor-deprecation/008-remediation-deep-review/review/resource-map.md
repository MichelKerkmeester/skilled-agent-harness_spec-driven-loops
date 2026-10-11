---
title: "Resource Map — Git commit range main..HEAD on branch worktrees/096-feature-catalog-anchor-deprecation: the 8 T4 commits e6b0297bcf, 45cb464be8, caafc08377, 99c133fd5a, 837c8e1629, cc1e6baba1, ccf25fdd56, c2fcd2d1e3. Before reviewing, read .skilled/agents/deep-review.md (your agent definition) and follow it as your persona. Inspect with: git log --oneline main..HEAD ; git show --stat <sha> ; git diff main..HEAD -- <path>. What the commits did: (1) stop the sk-create-feature-catalog mode stamping the <!-- sk-doc-template: skill_asset_feature_catalog --> comment and remove it from 548 catalog docs; (2) remove 97 leftover sk-doc-template comments from other skill docs; (3) add the version key to 217 changelog entries; (4) fix skill package findings on six units; (5) rename three sk-code-opencode scripts from snake_case to kebab-case (router_replay_lib.cjs, verify_doc_claims.cjs, verify_router_sync.cjs and their tests); (6) repair feature catalog validator findings 761 to 15; (7) version bumps with new changelog entries. Phase docs: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/00[1-7]-*/ (spec.md, tasks.md, implementation-summary.md, acceptance-criteria.md, scratch/*.py bulk scripts). Check: correctness of each bulk script, broken references to the old snake_case script names anywhere in the repo (tests, hooks, docs, workflows, drift-guard runner) via git grep, accidental content loss in bulk edits (a removed line that was not the marker or its blank line), version and changelog hygiene (SKILL.md version vs newest changelog file, duplicate or skipped versions), prevent-overengineering per .skilled/repo-rules/prevent-overengineering.md, and whether each phase matches its claims. Known environment gap, NOT a defect: sk-vision vision-runtime/dist is not built in this worktree, so 3 catalog validator fails on .opencode/plugins/sk-vision.js are expected. Sample with intent: the diff is about 1159 files; read each bulk script, the riskiest renames, and random docs per kind rather than everything."
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 13
- **By category**: READMEs=0, Documents=9, Commands=0, Agents=0, Skills=1, Specs=3, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 9
- **Scope**: review convergence output for 008-remediation-deep-review
- **Generated**: 2026-10-10T21:52:05.453Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| dim-security | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| dim-traceability | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| file-goal-doc | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| file-phase2-receipt | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| file-phase3-receipt | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| file-scratch-writes | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| find-R3-P2-001 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| find-R3-P2-003 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R2-P2-001 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-deep-loop/runtime/changelog/v1.0.0.0.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/implementation-summary.md | Analyzed | OK | Findings P0=0 P1=0 P2=2; Iterations=2 |
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/remove_packet_history_lines.py | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/goal.md | Analyzed | OK | Findings P0=0 P1=0 P2=2; Iterations=1 |

---
