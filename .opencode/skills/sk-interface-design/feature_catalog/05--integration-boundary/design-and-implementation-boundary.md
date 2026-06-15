---
title: "Design and implementation boundary"
description: "The boundary where this skill decides the look and hands implementation and verification to sk-code and the screenshot tooling."
trigger_phrases:
  - "design and implementation boundary"
  - "sk-interface-design owns the look sk-code implements"
  - "hand implementation to sk-code"
  - "screenshot self-critique tooling"
---

# Design and implementation boundary

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The boundary where this skill decides the look and hands implementation and verification to `sk-code` and the screenshot tooling.

This capability defines what the skill is responsible for and what it deliberately leaves to others. It owns the aesthetic direction and stops at the design decision, which keeps a design skill from drifting into build mechanics or stack-implementation concerns.

## 2. HOW IT WORKS

This skill owns the look and ends at the design decision. Implementation belongs to `sk-code`, which builds the chosen direction to the detected web surface's standards and verifies it, and `sk-code-review` can audit the built UI against those same standards. The router hands implementation to `sk-code` for the detected web surface rather than building code in this skill.

For the self-critique step, the screenshot is captured by a real-browser tool so the result can be inspected rather than imagined. React implementation performance is also pushed to `sk-code` rather than absorbed into the quality floor. When a non-visual task arrives, such as pure logic or documentation, the skill routes it away to `sk-code` or `sk-doc` instead of producing a design plan.

When the work runs through an Open Design generation run, this boundary is operated by the Claude Design parity loop, where `mcp-open-design` owns the Open Design terminal transport and this skill still owns the judgment. The parity loop's handoff manifest routes its next steps to `sk-code`, so the boundary holds even when the path to a verified result goes through a generation run.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Shared | Section 2 router hands implementation to sk-code, and Section 7 names the related skills and the boundary that this skill owns the look, not the build. |
| `references/design-process/design_principles.md` | Shared | Section 5 covers the screenshot-based self-critique that the browser tool supports. |
| `references/design-process/ux_quality_reference.md` | Shared | Records the explicit deferral of React implementation performance to sk-code. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `SKILL.md` | Manual playbook | Section 1 When NOT to Use directs pure-logic work to sk-code and documentation work to sk-doc. |

---

## 4. SOURCE METADATA

- Group: Integration boundary
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--integration-boundary/design-and-implementation-boundary.md`

Related references:
- [../07--claude-design-parity/handoff-and-parity-guardrails.md](../07--claude-design-parity/handoff-and-parity-guardrails.md) - Handoff and parity guardrails
- [../04--interface-writing/interface-writing.md](../04--interface-writing/interface-writing.md) - Interface writing as design material
- [../02--quality-floor/objective-quality-floor.md](../02--quality-floor/objective-quality-floor.md) - Objective quality floor
