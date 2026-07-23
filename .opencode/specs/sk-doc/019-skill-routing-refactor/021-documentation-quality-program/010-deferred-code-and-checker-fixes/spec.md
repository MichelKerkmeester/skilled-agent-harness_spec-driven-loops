---
title: "Feature Specification: Deferred Code and Checker Fixes"
description: "Action the deferred follow-ups: fix the 10a leaf-manifest checker path bug and the two data gaps it surfaced, complete the skill and command Title-Case enforcement flip, and record the investigation outcomes for the benchmark findings and the repo-wide HVR sweep."
trigger_phrases:
  - "deferred code checker fixes"
  - "10a manifest checker path fix"
  - "skill command uppercase flip"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/010-deferred-code-and-checker-fixes"
    last_updated_at: "2026-07-22T16:53:38Z"
    last_updated_by: "claude"
    recent_action: "Fixed the 10a checker, flipped skill/command, closed the benchmark and HVR findings."
    next_safe_action: "Operator ff-merge to v4."
    blockers: []
    key_files:
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
      - ".opencode/skills/sk-code/mode-registry.json"
      - ".opencode/skills/mcp-tooling/leaf-manifest.json"
---

# Feature Specification: Deferred Code and Checker Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-22 |
| **Branch** | `sk-doc/0097-documentation-quality` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The closeout deferred five follow-ups. Two were code defects worth fixing: the `parent-skill-check.cjs` rule `10a-manifest-source` resolved the shared leaf-resource generator from each hub's own `create-skill/scripts/`, but that mode exists only in sk-doc, so every other leaf-manifest hub failed 10a on a missing generator. The skill and command doc types still had `h2UppercaseRequired` off. Three others needed an on-disk verdict before any edit: the benchmark `RIG_ROOT`, the unused `dispatch-swe16`, and the repo-wide HVR sweep.

### Purpose

Fix the 10a path resolution and the two data gaps it surfaced, complete the Title-Case flip for skill and command, and record the evidence-based decision to not touch the benchmark findings or run a blind HVR sweep.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Resolve the 10a generator and contract library from the canonical `sk-doc/create-skill/scripts/`.
- Add the missing `resourceContractVersion` to `sk-code/mode-registry.json` and regenerate the stale `mcp-tooling/leaf-manifest.json`.
- Flip `h2UppercaseRequired` for skill and command and uppercase the two SKILL.md offenders.

### Out of Scope

- The `RIG_ROOT` and `dispatch-swe16` benchmark code, which the investigation found should not be edited (see decisions).
- The repo-wide HVR sweep, a standalone project of 4,601 files and roughly 167,000 em-dash occurrences.
- sk-design rule 6a (its `styles/` asset tree is an unregistered child), a pre-existing unrelated finding.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P2 | All seven leaf-manifest hubs pass 10a, 10b and 10d after the checker path fix. |
| REQ-002 | P2 | `sk-code/mode-registry.json` declares the `resourceContractVersion` its leaf-manifest already carries. |
| REQ-003 | P2 | `mcp-tooling/leaf-manifest.json` matches a fresh regeneration byte for byte. |
| REQ-004 | P2 | `h2UppercaseRequired` is true for skill and command, and all SKILL.md and command files pass. |
| REQ-005 | P2 | The benchmark and HVR decisions are recorded with the evidence that justified not editing them. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `parent-skill-check.cjs` passes 10a/10b/10d on all seven hubs; `node --check` clean.
- All 49 SKILL.md and 51 command files pass the h2-uppercase check with the flip.
- The three not-fixed findings carry an on-disk rationale in `context-index.md`.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Editing routing data.** Mitigated: the sk-code registry field is additive and matches the leaf-manifest; 10b confirms the mcp-tooling regeneration is byte-correct.
- **Force-uppercasing SKILL.md.** Mitigated: only 2 files offended, the transform is header-only and exempt-preserving, and both stay VALID.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- The checker resolves shared tooling from one canonical place, so a hub without the create-skill mode still validates.
- Not-fixing is documented as a decision with evidence, not a silent gap.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- `buildManifestBytes(target)` accepts an arbitrary hub, so loading the generator from sk-doc and building for another hub is correct.
- The mcp-tooling drift was a single `INSTALL-GUIDE.md` to `install-guide.md` kebab rename, not a structural change.
- The 001 benchmark `RIG_ROOT` is stale but its packet is an archived run with no live references, so its scripts are frozen artifacts.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether the repo-wide HVR sweep is worth a dedicated project (per-occurrence grammatical judgment across 167,000 em dashes) is left for the operator.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).
- `../spec.md` and `../context-index.md` (the 021 program parent).
- Previous phase: [`009-titlecase-config-and-closeout`](../009-titlecase-config-and-closeout/spec.md).

<!-- /ANCHOR:related-docs -->
