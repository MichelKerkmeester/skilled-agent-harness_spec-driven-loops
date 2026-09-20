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
| **Status** | In Progress |
| **Created** | 2026-09-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Operator: "Check if llmgateway provides deepseek v4.1 flash yet" then "replace all references of deepseek flash v4 with v4.1", scoped to "Omly llm gateway tho". **Reopened 2026-09-11** by the operator, extending the same replacement to the two sibling routes the first pass had excluded: "Update `opencode-go/deepseek-v4-flash-vision-exp`, `cline-pass/cline-pass/deepseek-v4-flash` for deepseek v4.1 flash — cline and opencode go both support it already" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The bare literal `deepseek-v4-flash-vision-exp` was the DevPass route for DeepSeek Flash and the cli-pi default in the deep-loop fan-out. The gateway has deactivated it. A live call returns `410 "Model deepseek-v4-flash-vision-exp has been deactivated and is no longer available"`, which means every fan-out lineage that omitted a model was dispatching at a dead route. Nothing in the repository knew: the roster still described its ladder, its price and its image behaviour as though the route worked. The gateway now carries `deepseek-v4.1-flash` instead, which the same account reaches with a `200`.

### The Reopened Second Pass

The sibling routes were excluded on that scope, and they came back with opposite evidence. The `opencode-go` route carries `deepseek-v4.1-flash` in its own catalog and answered a live dispatch at the same price, context, output ceiling and image support as the id it replaces, so that swap is like-for-like. The `cline-pass` route is the other case: Cline's own API lists the model, but opencode resolves provider models from models.dev, which carries no cline-pass V4.1 entry, so the id fails at resolution before a request is sent — and the account's monthly quota is exhausted, which blocks the previously working fallback id as well. That route is therefore recorded as **listing-only**, with the blocker and the fallback named, rather than claimed as working.

### Purpose

The DevPass DeepSeek route names a model the gateway actually serves, and every claim the roster makes about it was measured rather than carried forward.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The LLM Gateway route only. The bare literal, its provider mapping, the fan-out default and the effort pin
- **The two sibling DeepSeek routes, as of the 2026-09-11 reopening:** the `opencode-go` mode default and the `cline-pass` roster row, in both skills and in the Pi config
- The deep-loop test assertion that names the `opencode-go` literal, and the Cline id-format control in the cli-pi playbook
- Both CLI skills' gateway sections, and the roster claims in them that a live probe contradicts
- The Pi runtime configuration that declares the gateway provider, its model definition and its picker entry
- The deep-loop fan-out integration: allowlist, provider map, default, effort pin, and both unit suites
- One changelog entry per skill, which is how both have recorded every prior roster change

### Out of Scope
- **The `opencode-go` and `cline-pass` DeepSeek routes, as originally scoped.** They were different routes that still resolved, and the operator had scoped the first pass to the gateway. **This exclusion was reversed on 2026-09-11** — both are now in scope above. It is recorded here rather than deleted because the reversal is the reason the second pass exists
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
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Mode default in four places, plus the anchor and keywords |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | Modify | Cline login example id |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md` | Modify | Id-format control: id, expected default, quota skip blocker, in both of its copies |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | The private pin assertion moves to the live opencode-go literal |
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
| REQ-006 | The `opencode-go` route names the live V4.1 id on every surface the first pass deliberately left alone, and the mode default moves with it |
| REQ-007 | The `cline-pass` row is recorded as listing-only unless a live turn proves it, and names both its blocker and the fallback id a dispatcher should use instead |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Both deep-loop unit suites pass, and the repository frontmatter gate exits zero |
| REQ-005 | Each skill carries a changelog entry describing the break and the replacement |
| REQ-008 | The `pi` catalog is refreshed so the picker entry resolves, and `pi --list-models` reports the new id with its image support |
| REQ-009 | Each skill's second changelog entry states plainly which of the two routes was verified and which was not |

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
- **SC-005**: A live `opencode run` turn on the `opencode-go` route returns a reply at the new id
- **SC-006**: `pi --list-models` lists `opencode-go/deepseek-v4.1-flash` with 1M context, 384K output and image support
- **SC-007**: No surface claims the `cline-pass` V4.1 route was dispatch-verified, and its row names the `429` blocker and the V4-Flash fallback
- **SC-008**: Both suites and the frontmatter gate still exit clean after the second pass
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
| Risk | The `cline-pass` V4.1 id is documented as usable while the plan may not serve it | High | The row is marked listing-only, carries the `429` blocker, and names the previously verified `cline-pass/cline-pass/deepseek-v4-flash` as the fallback. The live gate is deferred to the operator after the quota window resets. No cost, context or output figure is claimed for it |
| Risk | Moving the picker entry drops the only dispatch-verified Cline DeepSeek route | Med | The fallback is named in both the skill roster and the Pi setup doc, so restoring it is a one-line change rather than a rediscovery |
| Risk | Pi's own catalog is stale and silently hides the new id | Med | It did hide it: `pi --list-models` omitted the id until `pi update --models` ran. The refresh is part of the change and is recorded in the changelog, because a reader would otherwise see a correct config resolve to nothing |
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
