---
title: "Implementation Plan: MiMo v2.5 to v2.6 cutover across skills settings and deep-loop allowlists"
description: "A case-preserving token rename (mimo-v2.5 → mimo-v2.6, MiMo-V2.5-Pro → MiMo-V2.6-Pro) applied to the living skill documents, the .pi settings' enabledModels, and the deep-loop enforcement pair with its mirrors and tests — all in one pass, because the paired roster copies are asserted equal by the very tests being renamed."
trigger_phrases:
  - "mimo v2.6 cutover plan"
  - "roster rename approach"
  - "paired allowlist copies"
  - "mechanical token rename"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: MiMo v2.5 to v2.6 cutover across skills settings and deep-loop allowlists

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Repository documentation (Markdown), two JSON configuration files, TypeScript + `.cjs` (system-deep-loop runtime) |
| **Framework** | pi skills; system-deep-loop runtime (vitest 4.1.11, tsx, zod) |
| **Storage** | None (no data migration — the change is provider/model configuration and documented route selection) |
| **Testing** | Live `opencode models llmgateway --verbose` catalog inspection, Node JSON assertions, `pi --list-models`, focused route-preservation searches, the repository's frontmatter-version gate, and the spec-kit validator |

### Overview
The rename is mechanical but the enforcement graph is not: the Pi and HerMeS rosters exist as four string-literal copies (two declarations, two mirrors) plus a provider map plus eight test expectations, and the pairing tests assert two of those copies equal-each-other-minus-one. So the implementation moves the whole set in one pass — documents, settings, enforcement, mirrors, tests — then re-runs the suites that read the allowlist, the typecheck, the frontmatter gate and the spec-kit validator. Historical bodies and dated evidence are deliberately left as they were written; the 070 precedent calls that theirs, not this packet's.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other — a mechanical rename across a paired-copy enforcement contract. No new abstraction: the copies stay copies, because the test that asserts their agreement is the thing that keeps them honest.

### Key Components
- **The roster contract** (`executor-config.ts` declarations + `fanout-run.cjs` mirrors + provider map): what a Pi or HerMeS dispatch is allowed to resolve, enforced as bare gateway literals.
- **The paired tests** (`executor-config.vitest.ts` pairing/effort expectations, `fanout-run.vitest.ts` provider-map expectation): the assertions that fail if one copy moves without the other.
- **The documented surfaces**: the three skills' living references/rosters and `.pi/settings.json`'s `enabledModels`, which must name what the enforcement actually resolves.
- **The direct provider route**: `llmgateway/mimo-v2.6-pro` is a provider-qualified Pi/OpenCode route backed by the existing gateway block. It does not create a second bare-literal fan-out mapping. The existing bare `mimo-v2.6-pro` literal remains owned by `xiaomi`.

### Data Flow
An id enters through a provider-qualified gateway route, resolves through the provider catalog and `enabledModels`, and, for the bare fan-out literal, is admitted or rejected by `PI_SUPPORTED_MODELS` / `HERMES_SUPPORTED_MODELS` and their fan-out mirrors. The Xiaomi and LLM Gateway selectors therefore coexist without changing the one-literal-one-provider contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The amended route is verified with the live `opencode models llmgateway --verbose` catalog, JSON assertions over `.pi/models.json` and `.pi/settings.json`, and `pi --list-models` showing the provider-qualified route. Focused searches prove the bare deep-loop literal still maps to `xiaomi` and no Hermes roster widened. The frontmatter gate covers the two skill version bumps and new changelogs, and the spec-kit validator proves the amended packet. A real Pi round-trip remains the operator's billable availability check because catalog output and picker rows do not prove the configured credential can complete a request.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The route depends on the existing `${LLMGATEWAY_API_KEY}` reference and the active `mimo-v2.6-pro` catalog row returned by `opencode models llmgateway --verbose`. No new credential, install, provider block, or fan-out mapping is required. The operator's live request remains the final availability check.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the new `mimo-v2.6-pro` object from `providers.llmgateway`, remove `llmgateway/mimo-v2.6-pro` from `.pi/settings.json`, revert the direct-route documentation, skill version bumps, changelog entries, and packet amendment. Preserve the existing llmgateway provider block, credentials, Xiaomi definitions, and deep-loop mapping.
<!-- /ANCHOR:rollback -->

---
