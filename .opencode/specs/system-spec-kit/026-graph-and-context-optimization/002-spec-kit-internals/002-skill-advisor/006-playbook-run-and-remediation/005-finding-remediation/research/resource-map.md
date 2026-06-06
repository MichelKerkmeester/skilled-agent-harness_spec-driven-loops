---
title: "Resource Map — Skill Advisor Finding Remediation"
description: "Code/doc resources and target files per finding, for the remediation phases."
---

# Resource Map — Skill Advisor Finding Remediation

Authoritative target files per finding (from the deep-research iterations). Paths relative to repo root.

## F1a — advisor_validate alias-aware gold matching
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts` (gold-match sites ~266-275, 361-371 — strict `===` → alias-aware)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:4-16` (existing alias groups to consult)
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl` (53/193 sk-deep-* rows)

## F1b — scorer P0 routing/ambiguity fixes
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:44-57`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:47-55`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:265-268,389-404`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` (P0-UNC-001/002, P0-CMD-002)

## F2 — PC-005 bench doc + gate calibration
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py:241,246,247`
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/005-bench-runner.md:33,36`
- `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts:93,97`
- `.opencode/skills/system-skill-advisor/feature_catalog/08--python-compat/03-bench-runner.md:21`

## F3 — semantic_shadow doc/comment sync
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/004-lane-attribution.md:47,57`
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/005-ablation.md:49`
- `.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/04-attribution.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:160,167` (stale comment + raw flag)
- Source of truth (do NOT change): `lib/scorer/lane-registry.ts:12`, `lib/scorer/weights-config.ts:18`

## F4 — opencode bridge native route
- `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` (`loadNativeAdvisorModules()`)
- `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts` (built `dist/mcp_server/compat/index.js`)
- `.opencode/bin/mk-skill-advisor-launcher.cjs`, `.opencode/bin/lib/launcher-ipc-bridge.cjs` (lease/socket handling)

## F5 — playbook vitest path
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/ambiguous-brief-rendering.md:38`
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/lifecycle-redirect-metadata.md:36`
- Canonical: `cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/...`
