---
title: "Implementation Plan: Route the cli-pi GLM-5.3-Flash fan-out literal through the DevPass LLM Gateway"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Route the cli-pi GLM-5.3-Flash fan-out literal through the DevPass LLM Gateway

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS fan-out driver plus a TypeScript constants module, both under `system-deep-loop/runtime` |
| **Framework** | deep-loop fan-out lineage command builders |
| **Storage** | None |
| **Testing** | `vitest` unit suites, plus one live `pi` dispatch against the gateway |

### Overview
The fix is one map value. Everything else in the diff is comments and a reference table that asserted the old mapping, and those matter because the mapping is documented in four places and a stale one reads as a contradiction rather than as a stale line.

The design question was whether to re-point the existing literal or teach the command builder a second selector scheme. Re-pointing wins on the evidence: the builder composes `${provider}/${model}` in one place, three separate comments already treat one-literal-one-provider as the rule, and the Cline GLM route is already direct-dispatch only for exactly this reason. A second scheme would add a branch to the hot path so that a route nothing currently uses could stay reachable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The gateway's id shape is confirmed, bare not prefixed, so the composed selector is known before the edit
- [x] Every consumer of the bare literal is enumerated by grep rather than assumed
- [x] The live route is proven to answer before any code moves

### Definition of Done
- [x] `buildLineageCommand` emits `llmgateway/glm-5.3-flash` and `--thinking max`
- [x] The OpenRouter and default routes are unchanged, checked in the same run
- [x] Targeted cli-pi suite green, and the one remaining failure in a touched file attributed to a prior commit
- [x] No document still asserts the opencode-go mapping
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One literal maps to one provider. The selector is composed, not stored, so the literal has to carry whatever shape the target gateway expects.

### Key Components
- **`PI_MODEL_PROVIDERS`** (`runtime/scripts/fanout-run.cjs`): the `Map` this packet edits, literal to provider.
- **`buildPiLineageCommand`** (same file): composes `--model ${provider}/${model}`, which is why the literal must be bare for a gateway that rejects a prefix.
- **`PI_SUPPORTED_MODELS`** (`runtime/lib/deep-loop/executor-config.ts`) and **`PI_ALLOWED_MODELS`** (`fanout-run.cjs`): two hand-synced copies of the allowlist. Neither needed an edit, because the literal was already in both.
- **`isFlashMaxPinnedModel`**: regex-matches `glm-5.3-flash` on any provider path and forces `max`. It needed no change, and it is why the tier is correct even when a caller omits `--reasoning-effort`.
- **`EXECUTOR_ENV_PREFIXES_BY_KIND`** and **`buildExecutorDispatchEnv`** (`executor-audit.ts`): the dispatch env filter, allowlist-based as defense in depth. A kind with no entry gets no provider credentials at all, which is what `cli-pi` had.

### Data Flow
A lineage names a model. The allowlist gates it, the map resolves its provider, the builder concatenates the two into the `--model` argument, and the effort pin overrides the requested tier for the Flash family. Only the second step changed.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three layers, smallest first.

The **negative control ran before the code changed**: a direct `pi -p --offline --model llmgateway/glm-5.3-flash --thinking max` returned the sentinel from the gateway. Had that failed, the whole change would have been pointless, and the failure would have been in credentials rather than in code.

**Composition** is asserted in-process by calling `buildLineageCommand` for the changed route and for two unchanged ones in the same run, so a regression in either neighbour shows up next to the fix rather than later.

**The pinned unit test** is the one that caught the change, which is the point of it. `fanout-run.vitest.ts` asserts the provider per model id; its expectation moved with the mapping. A test that had not failed here would have meant the mapping was not really covered.

**A real dispatch is the only check that found the second defect.** Composition, the unit test and the direct smoke test were all green while the fan-out route was still unauthenticated, because none of them exercises `buildExecutorDispatchEnv`. The credential gap surfaced only when a genuine fan-out dispatch ran end to end. Treat "the command composes correctly" as necessary and not sufficient for any executor change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `llmgateway` provider block in `.pi/models.json`, which is config rather than code and is not a Pi builtin. It supplies the base URL and the env-keyed credential. Nothing in this repository creates it, so a machine without it cannot use this route regardless of the runtime change.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Restore one map value: `['glm-5.3-flash', 'opencode-go']` in `PI_MODEL_PROVIDERS`, delete the `cli-pi` entry from `EXECUTOR_ENV_PREFIXES_BY_KIND`, then revert the test expectation and the four comment blocks. The change adds no state, writes no file and alters no schema, so reverting is a text edit with no migration. The only consequence of reverting is that GLM fan-out billing returns to per token.
<!-- /ANCHOR:rollback -->

---

