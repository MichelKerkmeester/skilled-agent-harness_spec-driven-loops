---
title: "Resource Map — Surface setup hardening for external sk-code users. Skilled assumes every sk-code surface except sk-code-skilled (the native surface, lowest priority for an external user) and sk-code-review (workflow) is irrelevant to an external user, that sk-code-obsidian and sk-code-webflow are the operator's personal examples an external user deletes, that shared/ and sk-code-quality stay, and that any surface the user adds outranks sk-code-skilled. The tie order today is quality, review, opencode, obsidian, webflow (.skilled/skills/sk-code/hub-router.json routerPolicy.tieBreak). Already shipped and NOT to be re-recommended: phase 025 research (specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md, F1-F96, R1-R10, X1-X24; its section 14 is the final list); phase 026 built R1 (/create:skill-parent update --surfaces places a new surface ahead of sk-code-skilled), R2 (sk-code drift guards tolerate removed examples), R3 and R7 (doctor, guard and sync messages name the fix; a missing authored closure is a named failure), R8 (scaffold handoff names the canary and re-mint follow-ups), R4 and R9 (examples marked, the root README block \"What Adapting `sk-code` Looks Like\" is the single external-user guide, release note v4.0.0.5); phase 027 added doctor check 5l in .skilled/commands/doctor/scripts/parent-skill-check.cjs that reports a hand-placed surface after sk-code-skilled in tieBreak unless it is one of the two examples. Operator ruling R5 stands: sk-code-skilled keeps its generic language keywords (report its UX cost only). Answer with path:line or command evidence, classify every finding NEW or ALREADY-COVERED (name the 025 F/R/X id or 026/027), and observe behavior in throwaway copies only: (1) remaining ways the assumption breaks: hand edits to tieBreak, mode-registry.json or hub-router.json, skill-advisor routing (graph metadata, scorer boosts, batteries), compiled routing (manifest, canary fixtures, authored copies), the Hermes copies and the other runtimes' mirrors (.opencode, .claude, .codex, .cursor, .devin, .pi, .hermes), manual-testing playbooks, benchmarks, canaries, feature catalogs, and a fresh clone; (2) the end-to-end external-user journey from clone to a green battery (doctor, guard, sync, drift guards, advisor, one routed prompt), with every friction point; (3) automation that removes manual steps without a judgment call; (4) the operator's two shapes weighed against each other with better names: a new doctor command such as `/doctor sk-code-setup` referenced and integrated in the sk-code hub, versus a new mode inside the sk-code hub such as `sk-code-setup`; for each, where it would be referenced, what it would run, its cost and blast radius, and which existing surfaces (doctor command family under .skilled/commands/doctor/, hub mode-registry, /create:skill-parent) it would overlap; (5) ideas to reject and why. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the failure it prevents today, the smallest change, and the cheaper move that fails."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 85
- **By category**: READMEs=1, Documents=22, Commands=12, Agents=0, Skills=31, Specs=10, Scripts=6, Tests=0, Config=2, Meta=1
- **Missing on disk**: 21
- **Scope**: research convergence output for 028-surface-setup-hardening-research
- **Generated**: 2026-10-13T18:18:22.852Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .pi/extensions/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .devin/skills | Cited | OK | Citations=1; Iterations=1 |
| .hermes/skills/sk-code-obsidian/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .hermes/skills/sk-code-webflow/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .hermes/skills/sk-code/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=1; Iterations=1 |
| clone run: compiled-route.cjs exit 0 action=defer targets=[] | Cited | MISSING | Citations=1; Iterations=1 |
| clone run: FAIL check 1a (97 problems), dead route sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md | Cited | MISSING | Citations=1; Iterations=1 |
| clone run: ls .skilled/skills/system-spec-kit/shared/dist -> No such file | Cited | MISSING | Citations=1; Iterations=1 |
| clone run: verify-doc-claims FAIL check paths (258 problems), shared/references/performance-loading-checklist.md | Cited | MISSING | Citations=1; Iterations=1 |
| copy probe: deepseek-max-i2-wGIE under /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/028/runs/ | Cited | MISSING | Citations=1; Iterations=1 |
| copy run at /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/028/runs/deepseek-max-i5-probe | Cited | MISSING | Citations=1; Iterations=1 |
| copy-run: node .skilled/bin/compiled-route-sync.cjs exit 1 | Cited | MISSING | Citations=1; Iterations=1 |
| copy-run: node .skilled/bin/compiled-route.cjs --hub sk-code --prompt 'code review my rails plugin' -> {"servingAuthority":"legacy"} | Cited | MISSING | Citations=1; Iterations=1 |
| copy-run: skill-advisor.cjs advisor_recommend json output | Cited | MISSING | Citations=1; Iterations=1 |
| deepseek-max/iterations/iteration-004.md | Cited | MISSING | Citations=1; Iterations=1 |
| generate-leaf-manifest.cjs --write .skilled/skills/sk-code (copy run, EXIT 2) | Cited | MISSING | Citations=1; Iterations=1 |
| parent-skill-check.cjs .skilled/skills/sk-code (copy run, EXIT 1) | Cited | MISSING | Citations=1; Iterations=1 |
| parent-skill-check.cjs .skilled/skills/sk-code (copy run, PASS/FAIL lines) | Cited | MISSING | Citations=1; Iterations=1 |
| provisioned-copy battery run in runs/swe-max-i2-6L2e | Cited | MISSING | Citations=1; Iterations=1 |
| provisioned-copy: parent-skill-check/compiled-route-sync/compiled-route/skill-advisor runs | Cited | MISSING | Citations=1; Iterations=1 |
| swe-max/iterations/iteration-004.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/assets/create-skill-parent-auto.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/create/skill-parent.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/assets/doctor-parent-skill.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-update-apply.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/runtime-mirrors.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs:767-770,1537-1548 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/route-validate.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/skill-advisor.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/README.txt | Cited | OK | Citations=3; Iterations=3 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/benchmark/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/description.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-code/feature-catalog/feature-catalog.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/feature-catalog/feature-catalog.md:15,35 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/graph-metadata.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/hub-router.json | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/sk-code/leaf-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/manual-testing-playbook | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/mode-registry.json | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/sk-code/README.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-code/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/shared/references/performance-loading-checklist.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/shared/references/phase-detection.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-quality/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh:397-425,515-559,578-612 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-provision-paths.txt | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:173,175,293-337 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/lineages/deepseek-max/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/lineages/deepseek-max/iterations/iteration-002.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/lineages/deepseek-max/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/lineages/deepseek-max/iterations/iteration-004.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/lineages/swe-max/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/lineages/swe-max/iterations/iteration-002.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/lineages/swe-max/iterations/iteration-003.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/lineages/swe-max/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/check-agent-mirror-sync.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/compiled-route-guard.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/bin/compiled-route-sync.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/bin/compiled-route.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs | Cited | OK | Citations=1; Iterations=1 |
| clone run: ci-skill-root-metadata.cjs exit 1, node:internal/modules/cjs/loader:1573 stack naming root-router-contract.cjs | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| README.md | Cited | OK | Citations=5; Iterations=5 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| deepseek-max | lineages/deepseek-max/deltas/iter-001.jsonl |
| deepseek-max | lineages/deepseek-max/deltas/iter-002.jsonl |
| deepseek-max | lineages/deepseek-max/deltas/iter-003.jsonl |
| deepseek-max | lineages/deepseek-max/deltas/iter-004.jsonl |
| deepseek-max | lineages/deepseek-max/deltas/iter-005.jsonl |
| swe-max | lineages/swe-max/deltas/iter-001.jsonl |
| swe-max | lineages/swe-max/deltas/iter-002.jsonl |
| swe-max | lineages/swe-max/deltas/iter-003.jsonl |
| swe-max | lineages/swe-max/deltas/iter-004.jsonl |
| swe-max | lineages/swe-max/deltas/iter-005.jsonl |
