---
title: "Feature Specification: create-skill Compiled-Routing Alignment"
description: "Plan the create-skill onboarding changes that make newly generated parent hubs match v4 compiled-routing reality: every generated hub receives the same additive compiled-routing directive as the seven existing hubs, while an explicit onboarding mode either mints and verifies a fresh activation manifest or deliberately emits no manifest and remains legacy by construction."
trigger_phrases:
  - "create-skill compiled routing alignment"
  - "new hub compiled-ready scaffold"
  - "create-skill activation manifest step"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# create-skill Compiled-Routing Alignment

## EXECUTIVE SUMMARY

`sk-doc:create-skill` now generates parent hubs in an explicit legacy or compiled-ready state. Both templates emit the additive directive; ready generation uses the canonical manifest minter and freshness predicate, while legacy remains the no-manifest compatibility default.

This packet implements the onboarding-side contract owned by `../012-default-on-decision/decision-record.md`. A generated parent hub is born in one of two explicit states: **compiled-ready**, where create-skill mints and verifies the canonical fresh manifest, or **legacy**, where no manifest is emitted and the hub follows the existing routing path by construction.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Consumed decision** | `../012-default-on-decision/decision-record.md` (eligibility and fallback authority) |
| **Blast radius** | Generator and templates only during implementation; existing skills remain unchanged unless regenerated explicitly |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Confirmed Current State

The active parent-hub generator is `scripts/init_skill.py::init_parent_skill()`. It creates the complete hub scaffold and accepts parent-only `--compiled-routing legacy|ready`. Existing calls default to legacy.

The active scaffold and copy-from parent template contain the same exact directive. The create-skill workflow asks for the onboarding state, package validation consumes canonical freshness, and contract tests cover both states plus fail-closed outcomes.

### Problem Statement

The original gap was that new parent hubs could not express a deliberate compiled state. The delivered generator closes both halves together: every parent receives the directive, while only ready mode mints and verifies the canonical manifest.

### Purpose

Create-skill is aligned with the v4 router model through the exact directive block, explicit compiled-readiness selection, canonical manifest mint/freshness step, and contract tests for both generated states.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Parent-hub generation through `init_skill.py --kind parent`; standalone-skill scaffolding remains unchanged.
- A new `--compiled-routing legacy|ready` option. Existing CLI calls default to `legacy` for backward compatibility; the higher-level create-skill workflow must ask authors to choose explicitly.
- The exact compiled-routing directive added to both the active parent scaffold and the copy-from parent-hub template.
- A post-scaffold manifest step for `ready`: call the canonical minter supplied by the P3 eligibility implementation, then verify the returned manifest is valid and fresh before reporting compiled-ready.
- The `legacy` state: do not mint a manifest; report the generated hub as legacy by construction.
- Create-skill workflow, README/reference, validator, and contract-test updates needed to keep the generated output and documentation synchronized.
- Failure behavior that never reports compiled-ready after a missing, stale, malformed, or failed manifest mint.

### Out of Scope

- Defining the fallback or eligibility rules; those remain owned by the decision packet.
- Implementing the P3 runtime discovery and canonical manifest store; create-skill consumes those interfaces after they exist.
- Changing the compiled router's decisions, the advisor recommendation, environment defaults, existing hub manifests, or existing hub directives.
- Editing `router-replay.cjs`, `score-skill-benchmark.cjs`, or `load-playbook-scenarios.cjs`.
- Retrofitting existing skills automatically; migration of existing hubs requires a separate explicit operation.

### Exact Generated Directive

Both parent-hub templates must render this block inside `## 2. SMART ROUTING`, immediately after the introductory routing paragraph and before the prose discriminator/router algorithm:

```markdown
> **Compiled routing (opt-in, flag-gated, additive).** When `SPECKIT_COMPILED_ROUTING=1`, resolve the mode via the compiled router contract first:
> ```bash
> node .opencode/bin/compiled-route.cjs --hub {{HUB_NAME}} --prompt "<task>"
> ```
> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving authority, and the flag is **off by default**, so this is inert until compiled routing is activated for `{{HUB_NAME}}`.
```

`init_skill.py` resolves both `{{HUB_NAME}}` occurrences to the generated hub name. A legacy scaffold still receives this additive directive; the missing manifest causes the authoritative fallback path, making legacy status explicit and safe rather than leaving a different template shape.

### Delivered Implementation Files

| File Path | Change Type | Delivered Change |
|-----------|-------------|----------------|
| `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py` | Modify | Add the parent-only compiled state option, render the directive, invoke the canonical minter for `ready`, and report verified state |
| `.opencode/skills/sk-doc/create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md` | Modify | Add the generated directive block used by the active initializer |
| `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md` | Modify | Add the matching block to the copy-from canonical template |
| `.opencode/skills/sk-doc/create-skill/SKILL.md` | Modify | Add the explicit onboarding decision and ordered manifest step |
| `.opencode/skills/sk-doc/create-skill/README.md` | Modify | Document generated compiled states and examples |
| `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modify | Document the parent-hub readiness choice without duplicating the eligibility contract |
| `.opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py` | Modify if required by the chosen P3 API | Report directive/manifest consistency and freshness through the shared predicate |
| `.opencode/skills/sk-doc/scripts/tests/test_create_skill_contract.py` | Modify | Add legacy, compiled-ready, directive-rendering, and mint-failure regression cases |

> These generator-side changes do not alter any established hub manifest or repository default.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Consume the eligibility and fallback decision without redefining it. | create-skill calls the shared P3 minter/freshness interface and links to the decision packet; no local allowlist, freshness algorithm, or alternate fallback rule is introduced. |
| REQ-002 | Render the compiled-routing directive on every newly generated parent hub. | The active scaffold and canonical parent template contain the exact block above; generated commands use the actual hub name; the existing prose router remains below as fallback. |
| REQ-003 | Expose two deliberate generated states. | `--compiled-routing legacy|ready` is parent-only; existing CLI calls default to `legacy`; the higher-level workflow asks for a choice; output states either `legacy (no manifest)` or `compiled-ready (fresh manifest verified)`. |
| REQ-004 | Mint real eligibility for compiled-ready hubs. | `ready` invokes the canonical minter after final router inputs exist, receives the canonical manifest location, and validates freshness through the shared predicate before success output. No synthetic digest or hand-authored manifest is accepted. |
| REQ-005 | Fail closed without a half-wired success state. | Missing minter, mint error, malformed manifest, or stale digest produces a non-zero result and never prints compiled-ready. The output names the retained legacy fallback or diagnostic path explicitly. |
| REQ-006 | Preserve legacy compatibility. | `legacy` emits no manifest, the generated directive falls through safely, existing `--kind parent` calls remain valid, and standalone scaffolding is byte-equivalent except for unrelated timestamp fields. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Add contract tests and package validation for both states. | Tests cover directive substitution, legacy no-manifest output, ready fresh-manifest output through a test minter, stale/malformed rejection, unknown option rejection, and unchanged standalone behavior. |
| REQ-008 | Keep authoring documentation synchronized. | `SKILL.md`, README, parent reference, active scaffold, and canonical template describe the same option names, ordering, and status language. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A newly generated parent hub contains the same compiled-routing directive shape as the seven established hubs, with its own hub name rendered in the command and fallback sentence.
- **SC-002**: `legacy` generation emits no manifest and is reported as legacy by construction.
- **SC-003**: `ready` generation is reported as compiled-ready only after the canonical manifest exists and the shared predicate confirms freshness.
- **SC-004**: A mint or freshness failure cannot be mistaken for compiled-ready output.
- **SC-005**: Existing parent and standalone generation invocations retain backward-compatible behavior.
- **SC-006**: The implementation adds no local eligibility list and edits no frozen scorer file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | P3 canonical minter, manifest store, and freshness predicate | `ready` cannot be truthful without them | Gate implementation on the stable P3 interface; never emulate it inside create-skill |
| Dependency | Data-driven runtime hub discovery | A fresh manifest alone cannot route a hub if the runtime still uses a fixed hub map | Require P3 runtime discovery before advertising ready mode |
| Risk | Active scaffold and copy-from template drift | CLI-generated and manually-authored hubs receive different directives | One contract test reads both templates and compares the normalized block |
| Risk | Backward-compatible default hides an author choice | Existing scripts need a default, but agent workflows should not silently choose | CLI defaults to legacy; create-skill workflow asks explicitly and reports the selected state |
| Risk | Partial scaffold remains after a mint failure | Files may exist although the command exits non-zero | Print a clear diagnostic and legacy state; do not write a success marker or synthetic manifest |
| Risk | P4 later changes directive semantics | The generated block could become stale | Treat the active scaffold and seven hub directives as one lockstep surface in P4 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism

- **NFR-D01**: Given the same hub inputs and P3 minter version, manifest minting and readiness classification are deterministic.
- **NFR-D02**: The rendered directive differs across generated hubs only by the resolved hub name.

### Backward Compatibility

- **NFR-B01**: Existing parent generation without the new option selects legacy and remains valid.
- **NFR-B02**: Standalone generation does not gain a compiled-routing option or directive.

### Authority

- **NFR-A01**: create-skill may request and verify eligibility but cannot define it; the shared predicate remains authoritative.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Generator Input

- `--compiled-routing ready` with `--kind standalone`: reject with an actionable parent-only error.
- Unknown compiled state: reject before writing a success result.
- Existing target folder: preserve the current refusal; do not mint against an ambiguous target.

### Manifest Outcomes

- Canonical minter unavailable: non-zero result; no compiled-ready claim.
- Minter returns a path outside the canonical store: reject through the shared validator.
- Manifest exists but live inputs changed before verification: stale result; report re-mint required.
- Legacy selection with a pre-existing manifest at the target identity: halt and require an explicit reconciliation decision rather than silently deleting or reusing it.

### Template Integrity

- Hub name substitution must occur in the CLI command and closing sentence.
- The directive must precede, not replace, the prose router.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One generator path, two templates, workflow docs, validation, and tests |
| Risk | 12/25 | Backward-compatible default and fail-safe fallback bound runtime risk |
| Research | 8/20 | Depends on the stable P3 minter and manifest-location interface |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What exact callable/CLI name and return schema will P3 expose for canonical manifest minting and freshness verification?
- Will the P3 canonical manifest live beside each hub, in a central runtime store, or behind an abstract resolver? create-skill must consume the interface rather than bind to the current phase-local path.
- On a ready-mode mint failure, should the non-zero command retain the generated legacy files for inspection or stage them outside the final target until mint succeeds? The recommendation is to preserve diagnostics without printing a successful state.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Eligibility and fallback authority**: `../012-default-on-decision/decision-record.md`
- **Default-on program**: `../012-default-on-decision/spec.md`
- **Build approach**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Implementation record**: `implementation-summary.md`
- **Current create-skill workflow**: `.opencode/skills/sk-doc/create-skill/SKILL.md`
- **Current parent initializer**: `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`
