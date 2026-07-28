---
title: "Review Report: sk- prefix mode rename"
description: "Deep-review fan-out leaf swe-1-7 final report for 021-mode-sk-prefix-rename"
date: 2026-07-28
session_id: fanout-swe-1-7-1785217654899-ls3rh2
verdict: CONDITIONAL
---

# Review Report — One sk- prefix across every mode packet and routing key

## 1. EXECUTIVE VERDICT

**CONDITIONAL** — one P1 consumer miss and seven P2 stale-reference/doc findings remain. The four hub mode-registries, hub-routers, leaf-manifests, and packet directory tree are correctly renamed. The primary risk is a live consumer (`system-skill-advisor`) and a cluster of documentation/benchmark fixtures that still speak the pre-rename names.

## 2. SCOPE AND METHOD

- **Review target:** `.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename` (spec-folder)
- **Executor:** `cli-devin model=swe-1-7`
- **Iterations:** 10 (max-iterations stop policy)
- **Dimensions covered:** correctness, security, traceability, maintainability
- **Evidence sources:** mode registries, hub-routers, leaf-manifests, `description.json`, `command-metadata.json`, `system-skill-advisor`, benchmark fixtures, manual-testing playbooks, shared references, and test fixtures.

## 3. FINDINGS

### P1 — Required before release

- **F001**: `system-skill-advisor/mcp-server/scripts/skill_advisor.py:3377` hardcodes the pre-rename path `sk-prompt/prompt-models/assets/model-profiles.json`. The directory moved to `sk-prompt/sk-prompt-models/`; the `try/except` silently returns empty profiles, degrading small-model prompt dispatch without diagnostics.

### P2 — Suggestions / cleanup

- **F002**: `system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/*.private.json` still expects `workflowMode: "interface"` and resources like `design-interface/SKILL.md`. These stale expectations align with the implementation summary's reported `sk-design BLOCKED-BY-ROUTE-GOLD 91` and should be regenerated to the sk- prefixed names.
- **F003**: `sk-design/shared/creation-contract.md:80` uses `workflowMode: "interface"` in a typed context envelope example.
- **F004**: `sk-design/sk-design-mcp-open-design/references/cli-child-pairing.md:83` lists `childLoadedSkills: ["sk-design", "design-mcp-open-design"]` with the pre-rename packet name.
- **F005**: `sk-design/manual-testing-playbook/mode-routing/mcp-open-design-mode.md:64` uses old design-judgment mode names (`interface`, `md-generator`, etc.) in pass/fail criteria.
- **F006**: `sk-doc/sk-create-skill/scripts/tests/validate-compiled-routing-scenarios.test.cjs:68` hardcodes `md-generator`, `design-md-generator`, and `sk-design/md-generator` in a fixture.
- **F007**: `sk-prompt/description.json` includes bare `prompt-improve` and `prompt-models` keywords without the sk- prefix.
- **F008**: `sk-doc/description.json` includes bare `create diff report` and `document before after review` phrases without the sk- prefix.

## 4. CONFIRMED CLEAN

- The four hub `mode-registry.json` files use the new `sk-` prefixed `workflowMode` and `packet` values for every mode.
- The four hub `hub-router.json` files use the new `workflowMode` keys in `tieBreak`, `routerSignals`, and `vocabularyClasses`.
- The four hub `leaf-manifest.json` files list the new packet directory names and workflow modes.
- `sk-design/command-metadata.json` uses `sk-design-interface` and `sk-design-md-generator` for `ownerMode` and choreography references.
- Command bindings and agent definitions under `.opencode/commands` and `.opencode/agents` do not contain old `workflowMode` keys.
- No secrets or permission anomalies were found in the changed registry/leaf files.

## 5. RECOMMENDATIONS

1. Fix `skill_advisor.py:3377` to `sk-prompt/sk-prompt-models/assets/model-profiles.json` (P1).
2. Regenerate the sk-design route-gold fixtures in `system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/` to use `sk-design-interface` and `sk-design-md-generator` while preserving prompts and expected outcomes.
3. Sweep the P2 stale references listed above in shared docs, manual-testing playbooks, test fixtures, and `description.json` keywords.
4. Re-run the four-hub gate after fixes and update the spec `checklist.md` evidence columns.

## 6. SYNTHESIS

The rename of the 20 mode packets and 21 workflowMode keys is structurally correct in the four sk- hubs. The remaining work is consumer cleanup: one code path in the skill advisor and a set of documentation/benchmark references that were intentionally held constant but now contradict the live contract. Completion of F001 is required to move from CONDITIONAL to PASS.
