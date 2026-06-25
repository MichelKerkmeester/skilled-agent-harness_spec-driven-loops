# Deep Review Report: sk-design-interface

## Executive Summary

Verdict: CONDITIONAL

The review reached convergence after 5 iterations. No P0 blockers were found. Two active P1 findings require remediation before a PASS verdict, and one P2 advisory remains. `hasAdvisories=true`.

Scope: `.opencode/skills/sk-design-interface` as a skill package, including `SKILL.md`, `README.md`, `LICENSE.txt`, `graph-metadata.json`, `references/`, `feature_catalog/`, `manual_testing_playbook/`, and `changelog/`. Target repository files were read-only. Artifacts were written only under the provided fanout artifact directory.

Stop reason: `converged`. All configured dimensions were covered and stabilization replay found no new findings.

## Planning Trigger

Route to remediation planning because active P1 findings remain:

- F001 affects a documented live execution branch for Mobbin/Refero real-world reference routing.
- F002 directly contradicts the skill's central anti-default/no-preset contract.

The review does not block on a P0, but it should not be treated as PASS until both P1 findings are resolved or intentionally downgraded with new evidence.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
|---|---|---|---|---|---|
| F001 | P1 | correctness | Code Mode-backed reference routing lacks a matching tool-access contract | `.opencode/skills/sk-design-interface/SKILL.md:4`; `.opencode/skills/sk-design-interface/SKILL.md:75`; `.opencode/skills/sk-design-interface/references/design-grounding/design_references_mcp.md:42-47`; `.opencode/skills/sk-design-interface/feature_catalog/03--design-grounding/design-references-grounding.md:28-34`; `.opencode/skills/sk-design-interface/manual_testing_playbook/08--design-references-routing/initiative-ask-fallback-routing.md:30-33` | active |
| F002 | P1 | traceability | Preset catalog contradicts the skill's no-preset contract | `.opencode/skills/sk-design-interface/references/aesthetics/README.md:2-9`; `.opencode/skills/sk-design-interface/references/aesthetics/README.md:15-29`; `.opencode/skills/sk-design-interface/references/design-process/real_ui_loop.md:103-106`; `.opencode/skills/sk-design-interface/feature_catalog/07--real-ui-loop/handoff-and-parity-guardrails.md:28-30`; `.opencode/skills/sk-design-interface/manual_testing_playbook/07--real-ui-loop/reuse-before-generate-with-design-system.md:27-33` | active |
| F003 | P2 | maintainability | README verification command packages by default instead of validating only | `.opencode/skills/sk-design-interface/README.md:147-154`; `.opencode/skills/sk-doc/scripts/package_skill.py:15-17`; `.opencode/skills/sk-doc/scripts/package_skill.py:587-638`; `.opencode/skills/sk-doc/scripts/package_skill.py:721-723` | active |

### F001 Detail

The skill's frontmatter grants `[Read, Write, Edit, Bash, Grep, Glob]`, but the live design-reference branch requires Code Mode discovery and `call_tool_chain` usage. This makes the documented initiative path under-specified for consumers who rely on the skill's allowed-tool contract. The finding was adjudicated as P1 because it can make an advertised feature fail or silently degrade to ask/fallback behavior.

### F002 Detail

The package ships a discoverable `references/aesthetics/` preset catalog with trigger phrases and usage text that invite preset selection. This conflicts with `real_ui_loop.md`, the feature catalog, and the manual playbook, all of which treat style presets or pick-a-vibe menus as a failure mode. The finding was adjudicated as P1 because it cuts against the skill's central anti-default promise.

### F003 Detail

The README's skill-structure verification row omits `--check`, so the documented command can create a zip package by default. This is a maintainer workflow footgun rather than a runtime behavior bug, so it is P2.

## Remediation Workstreams

| Workstream | Findings | Suggested Action |
|---|---|---|
| Tool contract alignment | F001 | Either add the Code Mode access path to the skill contract and explicitly load `mcp-code-mode`, or reframe Mobbin/Refero as an optional handoff that only runs after a separate Code Mode skill is loaded. |
| Anti-preset contract cleanup | F002 | Remove `references/aesthetics/`, move it to a non-routable archive, or rewrite it as anti-examples/critique baselines with no preset trigger phrases or chooser language. Update graph metadata, feature catalog, and playbook accordingly. |
| Verification doc hygiene | F003 | Change README verification command to `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design-interface/ --check`. |

## Spec Seed

If a remediation spec is opened, seed it with these requirements:

- REQ-001: The design-reference initiative path must have an executable tool-access contract or explicitly defer to `mcp-code-mode` before any Mobbin/Refero call.
- REQ-002: No live `sk-design-interface` reference may present style presets, pick-a-vibe menus, named aesthetic dials, or reusable aesthetic choices as selectable directions.
- REQ-003: Operator-facing verification commands must be read-only when they are described as validation checks.

## Plan Seed

1. Decide whether Mobbin/Refero calls belong directly in `sk-design-interface` or behind an explicit `mcp-code-mode` co-load.
2. Sweep `references/aesthetics/` and either remove, archive outside routable references, or rewrite as critique-against anti-examples.
3. Update README verification table to use `--check` for validation-only packaging checks.
4. Re-run package validation and targeted greps for `preset`, `pick-a-vibe`, `call_tool_chain`, and `mcp-code-mode`.
5. Re-run a focused traceability pass over `SKILL.md`, `feature_catalog/`, `manual_testing_playbook/`, and `graph-metadata.json`.

## Traceability Status

| Protocol | Status | Gate | Summary |
|---|---|---|---|
| spec_code | partial | hard | Most normative claims resolve to docs; F001 remains active. |
| checklist_evidence | partial | hard | No-preset negative controls are contradicted by the preset catalog; F002 remains active. |
| skill_agent | pass | advisory | No direct `.opencode/agents` or `.opencode/commands` entry point references were found. |
| feature_catalog_code | partial | advisory | Feature catalog no-preset claims do not account for `references/aesthetics/`. |
| playbook_capability | partial | advisory | Playbook no-preset fail condition is contradicted by package-local preset docs. |

## Deferred Items

- D001: Live Mobbin/Refero paid lookup behavior was not exercised; this review was code/docs-only and did not use external MCPs.
- D002: Code graph was stale; exact Grep/Glob/Read produced sufficient evidence for this markdown skill package review.
- D003: Historical changelog mentions of older MagicPath/Open Design coupling were left alone because v1.4.0.0 explicitly says historical changelogs remain point-in-time records.

## Audit Appendix

### Iteration Table

| Iteration | Focus | New Findings | Ratio | Verdict |
|---:|---|---|---:|---|
| 1 | correctness | F001 | 1.0000 | CONDITIONAL |
| 2 | security | none | 0.0000 | PASS |
| 3 | traceability | F002 | 0.5000 | CONDITIONAL |
| 4 | maintainability | F003 | 0.1667 | PASS |
| 5 | stabilization-replay | none | 0.0000 | PASS |

### Convergence Replay

- Dimension coverage: 4/4.
- Required traceability protocols covered: yes, with partial statuses recorded for active P1s.
- Latest ratio: 0.0000.
- Last two ratios: 0.1667 and 0.0000.
- P0 resolution: pass, active P0=0.
- Claim adjudication: pass for F001 and F002.
- Final verdict mapping: active P0=0, active P1=2, active P2=1, therefore CONDITIONAL.

### Validation

- Artifact validation: PASS.
- Strict spec-folder validation: FAILED. `validate.sh` reported `FILE_EXISTS: Missing 4 required file(s) for Level 1` for `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/007-family-deep-review`.
- Remediation was not attempted because the user explicitly allowed writes only inside the artifact directory.

### File Coverage Matrix

| Area | Coverage |
|---|---|
| SKILL.md | full |
| README.md | full |
| LICENSE.txt | present and sampled |
| graph-metadata.json | full |
| references/design-process | full |
| references/design-grounding | full |
| references/mcp-tooling | full |
| references/aesthetics | full |
| feature_catalog | full |
| manual_testing_playbook | full |
| changelog | full |
| assets | absent |
| scripts | absent |

### Verdict

CONDITIONAL
