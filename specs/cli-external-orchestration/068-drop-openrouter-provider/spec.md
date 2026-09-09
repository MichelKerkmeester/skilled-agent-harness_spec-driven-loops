---
title: "Feature Specification: Remove the openrouter provider from the cli-pi and cli-opencode skills"
description: "OpenRouter is one of seven providers on the cli-pi and cli-opencode closed rosters. The operator is retiring the account, so every live reference to it in those two skills has to go while the historical record of it stays."
trigger_phrases:
  - "remove openrouter provider"
  - "drop openrouter from cli-pi"
  - "drop openrouter from cli-opencode"
  - "openrouter roster retirement"
  - "six providers reachable"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Remove the openrouter provider from the cli-pi and cli-opencode skills

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-09 |
| **Branch** | `skilled/v4.0.0.0` (no dedicated branch; `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

OpenRouter is one of seven providers on the closed rosters of `cli-pi` and `cli-opencode`, carrying two models on each: DeepSeek V4 Flash and GLM-5.3-Flash. The operator is retiring the route, and a roster that still lists it invites a dispatch that cannot resolve. The removal is not a search-and-replace, because 25 of the mentions across the two skills are three different kinds of text: live wiring that must go, changelog entries that record what was true when written and must not be touched, and prose that only mentions OpenRouter to explain a neighbouring route.

### Purpose

Both skills document six providers, no live path reaches OpenRouter, and every model that OpenRouter carried keeps a documented route through another provider.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every live OpenRouter reference in `cli-pi`: the provider count in `SKILL.md`, the roster section and its two rows, the roster sourcing note, and four cross-references from the `cline-pass` and `llmgateway` sections.
- Any claim the removal falsifies even where it carries no OpenRouter token, such as a count of authenticated providers.
- Every live OpenRouter reference in `cli-opencode`: the advisor keyword, the provider count, the id-shape footgun, the roster section and its two rows, the GLM-5.3-Flash fallback callout, the pre-flight login tree, and two playbook sentences.
- Frontmatter version bumps on every edited doc, plus one changelog entry per skill, which is how both skills have recorded every prior roster change.

### Out of Scope
- **The three changelog mentions.** `cli-pi/changelog/v1.4.1.0.md` and `cli-opencode/changelog/v1.4.3.0.md` record that the OpenRouter allowlist survived the 056 roster retirement. That was true then, and `cli-pi/changelog/v1.5.0.0.md` states the governing rule: changelog and benchmark records "state what was true when they were written".
- **The deep-loop fan-out runtime.** `PI_SUPPORTED_MODELS` (`executor-config.ts:201-202`) allowlists two OpenRouter literals and `PI_MODEL_PROVIDERS` (`fanout-run.cjs:2293-2294`) maps both to `openrouter`. That is `system-deep-loop`'s contract, not either skill's, and this packet was scoped to the two skills.
- **`.pi/models.json`.** It declares a `providers.openrouter` block holding session-affinity compat and one model override. It is Pi runtime configuration, not a skill.
- **Repointing anything.** Where OpenRouter was one of several routes to a model, the other routes were named; no model was moved to a new provider to compensate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | Provider count seven to six; `openrouter` dropped from the list |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | `### openrouter` section cut; sourcing note, two `cline-pass` rows and the DevPass rationale de-referenced |
| `.opencode/skills/cli-external-orchestration/cli-pi/changelog/v1.5.1.0.md` | Create | Records the retirement and what was deliberately left |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Keyword removed; provider count seven to six; id-shape footgun reduced to the two remaining shapes |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | `### openrouter` section cut; GLM-5.3-Flash fallback repointed to two roster routes |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | Modify | OpenRouter login line cut from the all-providers-missing pre-flight tree |
| `.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | Modify | Retired-CO-011 note no longer lists OpenRouter as a live flash route |
| `.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/multi-provider/variant-levels-comparison.md` | Modify | CO-012 scenario prose drops OpenRouter from the reasoning-variant routes |
| `.opencode/skills/cli-external-orchestration/cli-opencode/changelog/v1.4.4.0.md` | Create | Records the retirement and what was deliberately left |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No live OpenRouter reference survives in either skill | `grep -rai openrouter` over both skill trees, excluding `changelog/`, returns zero hits |
| REQ-002 | Every mention is classified before it is edited, and only live wiring is edited | Each of the 25 pre-change mentions appears in the classification table of `implementation-summary.md` with its verdict |
| REQ-003 | The three changelog mentions are byte-identical after the change | `git diff` touches no file under either `changelog/` except the two newly created entries |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No documented default, fallback or example breaks | The cli-opencode default stays `opencode-go/deepseek-v4-flash-vision-exp`; the GLM-5.3-Flash-on-Cline callout still names two roster routes; no dispatch example used an OpenRouter id |
| REQ-005 | Both skills record the change the way they have recorded every prior roster change | A changelog entry per skill, and a frontmatter version bump on each edited doc |
| REQ-006 | The runtime divergence this creates is reported rather than silently repointed | The out-of-scope runtime allowlist and provider map are named with file and line in both this spec and `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A residue sweep over both skills finds exactly three OpenRouter mentions, all in changelogs, each justified in writing.
- **SC-002**: Both `SKILL.md` files say six providers are reachable, and the six they name match the six sections remaining in each roster.
- **SC-003**: `ci-leaf-manifest-freshness`, `ci-skill-derived-freshness` and `ci-router-vocabulary-reach` report the same result for `cli-external-orchestration` after the change as before it.
- **SC-004**: The deep-loop roster unit tests still pass unchanged, confirming no runtime file moved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A blanket sweep edits a changelog line | High: destroys the record of when the allowlist last changed | Every edit matched an exact unique string or an asserted line range; changelogs were never a target |
| Risk | A cross-reference in a neighbouring section is left dangling | Medium: the `cline-pass` rows explained their own ceiling by comparing against OpenRouter | Four such cross-references were found and rewritten against providers still on the roster |
| Risk | Removing OpenRouter strands a model | Medium: it carried DeepSeek V4 Flash and GLM-5.3-Flash on both CLIs | Both models keep an opencode-go route and a DevPass route on both skills, verified row by row before the cut |
| Dependency | `system-deep-loop` fan-out roster | The runtime still allowlists and routes two OpenRouter literals | Out of scope by instruction; reported for a follow-up packet rather than repointed |
| Dependency | `.pi/models.json` `providers.openrouter` block | Dormant compat configuration once Pi stops selecting the provider | Reported; it is runtime configuration, not skill documentation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the operator want a follow-up packet in `system-deep-loop` to drop `deepseek/deepseek-v4-flash-vision-exp` and `z-ai/glm-5.3-flash` from `PI_SUPPORTED_MODELS` and `PI_MODEL_PROVIDERS`? Until that lands, the fan-out can still dispatch two literals that neither roster documents.
- Should the `providers.openrouter` block leave `.pi/models.json`? It is inert once nothing selects the provider, but it is also the last place the account is named.
- The `cline-pass` GLM-5.3-Flash route is direct-dispatch only because the shared `z-ai/glm-5.3-flash` literal is taken in the fan-out map. If the runtime entry goes, that literal frees up and the Cline route could take the fan-out slot. That is a routing decision for the follow-up packet, not a documentation one.
<!-- /ANCHOR:questions -->

---
