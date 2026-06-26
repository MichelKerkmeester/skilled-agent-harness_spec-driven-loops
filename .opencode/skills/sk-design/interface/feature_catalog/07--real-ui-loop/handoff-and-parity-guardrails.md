---
title: "Handoff and loop guardrails"
description: "Keeps generated source separate, emits an optional handoff manifest, and holds the line against style presets and scope the protocol refuses to add."
trigger_phrases:
  - "handoff and loop guardrails"
  - "design handoff manifest"
  - "generated versus presentational boundary"
  - "no style presets guardrail"
version: 1.5.0.1
---

# Handoff and loop guardrails

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Keeps generated source separate, emits an optional handoff manifest, and holds the line against style presets and scope the protocol refuses to add.

This is the closing half of the real-UI loop, where a verified result is handed off cleanly and where the protocol states what it deliberately does not become. It keeps the loop from collapsing into a templated generator, which is the exact failure mode the skill exists to resist. The boundary, manifest, and guardrails are defined in `references/design-process/real_ui_loop.md`, and this entry is the catalog summary.

## 2. HOW IT WORKS

### Generated boundary and handoff

The loop keeps generated component source, the wrapper or adaptation files, and business logic distinct. Reused components and tokens are read live and adapted rather than copied, and generated source is treated as one-way because re-generation overwrites it, so application logic lives in the wrapper. At the end it can emit one small structured handoff block rather than a heavy schema: the token system and theme variables, files changed, key interactions, the quality-floor and anti-default checks run, open risks, and the next `sk-code` steps. Iteration itself stays in thinking, so the manifest is the durable handoff rather than a per-revision ledger.

### Pre-build direction gate and guardrails

For open-ended visual work, the loop can sketch two or three brief-specific directions, critique each against the AI-default looks, and recommend one before building, but only when each direction is grounded in the subject. If the directions could be reused across briefs it has become a preset and must not ship. The protocol holds a hard line on what it never adds. There are no style presets, pick-a-vibe menus, or named aesthetic dials. A matched design system is never turned into a generator. There is no multi-format export or live comment thread, and no unsanctioned write-back to a source system, since reuse stays read-only and any mutating transport verb is a STOP-and-confirm point. There is no full-stack, backend, Git ownership, or deploy, and no heavyweight visual-regression engine, since judgment over a render is the gate.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/design-process/real_ui_loop.md` | Shared | Sections 6, 7, and 8 define the generated-versus-presentational boundary and handoff manifest, the pre-build direction gate, and the guardrails the protocol refuses to cross. |
| `references/design-process/design_principles.md` | Shared | Owns the anti-default mandate the pre-build direction gate and the no-presets guardrail enforce. |
| `SKILL.md` | Shared | Section 7 names `sk-code` as the implementation handoff target the manifest's next steps route to. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `references/design-process/real_ui_loop.md` | Manual playbook | Section 8 guardrails enumerate the presets, exports, and scope the loop must not ship. |
| `SKILL.md` | Manual playbook | Section 4 NEVER rules forbid shipping a templated default on a free axis. |

---

## 4. SOURCE METADATA

- Group: Real-UI loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--real-ui-loop/handoff-and-parity-guardrails.md`

Related references:
- [ground-and-reuse-before-generate.md](ground-and-reuse-before-generate.md) - Ground and reuse before generate
- [fidelity-check-and-revision-grammar.md](fidelity-check-and-revision-grammar.md) - Fidelity check and revision grammar
- [../05--integration-boundary/design-and-implementation-boundary.md](../05--integration-boundary/design-and-implementation-boundary.md) - Design and implementation boundary
