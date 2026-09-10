---
title: "Feature Specification: The DevPass DeepSeek route moves to V4.1 Flash"
description: "LLM Gateway deactivated deepseek-v4-flash-vision-exp and answers 410 for it. That id was the cli-pi fan-out default, so an omitted model reached a dead route. The gateway route is the V4.1 Flash line now, across both CLI skills, the Pi config and the deep-loop fan-out."
trigger_phrases:
  - "llmgateway deepseek v4.1 flash"
  - "devpass model deactivated 410"
  - "pi fan-out default model"
  - "gateway route repoint"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: The DevPass DeepSeek route moves to V4.1 Flash

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Operator: "Check if llmgateway provides deepseek v4.1 flash yet" then "replace all references of deepseek flash v4 with v4.1", scoped to "Omly llm gateway tho" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The bare literal `deepseek-v4-flash-vision-exp` was the DevPass route for DeepSeek Flash and the cli-pi default in the deep-loop fan-out. The gateway has deactivated it. A live call returns `410 "Model deepseek-v4-flash-vision-exp has been deactivated and is no longer available"`, which means every fan-out lineage that omitted a model was dispatching at a dead route. Nothing in the repository knew: the roster still described its ladder, its price and its image behaviour as though the route worked. The gateway now carries `deepseek-v4.1-flash` instead, which the same account reaches with a `200`.

### Purpose

The DevPass DeepSeek route names a model the gateway actually serves, and every claim the roster makes about it was measured rather than carried forward.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The LLM Gateway route only. The bare literal, its provider mapping, the fan-out default and the effort pin
- Both CLI skills' gateway sections, and the roster claims in them that a live probe contradicts
- The Pi runtime configuration that declares the gateway provider, its model definition and its picker entry
- The deep-loop fan-out integration: allowlist, provider map, default, effort pin, and both unit suites
- One changelog entry per skill, which is how both have recorded every prior roster change

### Out of Scope
- **The `opencode-go` and `cline-pass` DeepSeek routes.** They are different routes that still resolve, and the operator scoped this to the gateway
- **OpenRouter.** The operator does not use it, and an earlier packet deliberately left its two fan-out literals in place as the deep-loop runtime's own contract. Repointing them is that owner's decision
- **The tier ladder.** It cannot be established from this API, so nothing here claims one

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Gateway roster row, id-shape example, reachability prose |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | Gateway roster row, bare-id footgun, effort table, model count |
| Both skills' `SKILL.md` and `changelog/` | Modify, Create | Anchor bump plus one entry each |
| `.pi/models.json`, `.pi/settings.json`, `.pi/custom-providers.md` | Modify | Provider block, picker entry, setup doc |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Allowlist, provider map, default, effort pin |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | The same four, as the source of record |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/*.vitest.ts` | Modify | Both suites, including a third copy of the pin pattern |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No live surface names the deactivated gateway id |
| REQ-002 | The fan-out's cli-pi default, allowlist entry and provider mapping all name the live gateway id, and the effort pin matches it |
| REQ-003 | Every roster claim about the new route was read from the gateway rather than inherited from the old row |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Both deep-loop unit suites pass, and the repository frontmatter gate exits zero |
| REQ-005 | Each skill carries a changelog entry describing the break and the replacement |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live gateway call to the new bare id returns `200`, and to the retired id returns `410`
- **SC-002**: `fanout-run.vitest.ts` and `executor-config.vitest.ts` both pass with no failures
- **SC-003**: A repository scan finds no live reference to the deactivated id
- **SC-004**: `check-frontmatter-versions.sh` exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The effort pin forces a tier the new route rejects | High | Probed before wiring. `max` returns `200` and is the top level in the provider's documented ladder, so the pin lands on a real tier. The probe itself was too weak to conclude more: every value it sent was valid, so the uniform `200` said nothing about what the route refuses |
| Risk | A blanket replace catches routes the operator excluded | Med | Only the gateway literal moved. The `opencode-go`, `cline-pass` and OpenRouter literals are distinct strings and were left as they are |
| Risk | The pin pattern lives in three places and one is missed | Med | It does live in three: the script, the TypeScript source and a private copy inside a test. The test's copy caught the mismatch by failing, which is what surfaced the third |
| Dependency | The gateway's published rates and limits | Low | Read from its own model listing on the day, and cited with that date |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The new route costs $0.15 in and $0.60 out per million tokens against the retired route's $0.14 and $0.28. Cached reads are cheaper, $0.003 against $0.0028 per million. The fan-out bill rises for uncached work

### Security
- **NFR-S01**: No credential shape changes. The gateway key stays env-keyed and is never written into a doc or a config literal

### Reliability
- **NFR-R01**: The failure this fixes was silent at every layer but dispatch. Neither the model listing check nor the auth check reports a deactivated id
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- An effort string the route does not implement: the gateway accepts it anyway, so a caller cannot detect the ceiling. Pass the tier deliberately
- A prefixed id: `400`, with the provider naming the id it rejected
- A deactivated id: `410`, distinct from a `404`, so the two are worth telling apart in a failure report

### Error Scenarios
- Fan-out with no model named: previously reached the dead route, now reaches the live one
- A pinned effort on a route without that tier: the reason the pin was probed before wiring

### State Transitions
- The retired id keeps working on OpenRouter, so a literal that looks identical still resolves there. One literal maps to one provider, which is what keeps the two apart
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Eleven files across two skills, one runtime and one config tree |
| Risk | 14/25 | Live dispatch wiring with a forced effort tier, and a shared runtime contract |
| Research | 8/20 | The route had to be probed before anything could be wired |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The fan-out still maps two OpenRouter literals to a provider the operator says is not in use. An earlier packet left them deliberately as the deep-loop runtime's contract rather than either skill's. Whether they should now go is that owner's call, not this packet's.
<!-- /ANCHOR:questions -->

---
