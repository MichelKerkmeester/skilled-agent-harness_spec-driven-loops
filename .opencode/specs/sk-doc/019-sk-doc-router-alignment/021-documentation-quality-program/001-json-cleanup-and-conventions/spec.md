---
title: "Feature Specification: JSON Cleanup and Advisor-Metadata Conventions"
description: "Remove the one dead advisor-metadata residue in the skill tree and codify the placement convention so it cannot recur: a doctrine sentence, a recursive checker rule, and an AGENTS.md disambiguation note."
trigger_phrases:
  - "advisor metadata json cleanup"
  - "nested description.json residue"
  - "parent-skill-check description rule"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/001-json-cleanup-and-conventions"
    last_updated_at: "2026-07-22T12:29:01Z"
    last_updated_by: "claude"
    recent_action: "Removed the residue; added rule 2b; codified the convention in doctrine and AGENTS.md."
    next_safe_action: "Proceed to phase 002 (reference/asset template alignment)."
    blockers: []
    key_files:
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
      - ".opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md"
      - "AGENTS.md"
---

# Feature Specification: JSON Cleanup and Advisor-Metadata Conventions

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-22 |
| **Branch** | `sk-doc/0097-documentation-quality` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The skill tree carries two metadata systems that reuse the filenames `description.json` and `graph-metadata.json` with incompatible schemas: spec-folder continuity metadata and skill-advisor hub-identity metadata. By design the advisor pair lives only at a routable unit (a parent-hub root or a standalone-skill root), never inside a mode packet, but nothing enforced that rule. One violation existed: `sk-prompt/prompt-models/description.json`, merge residue from when `sk-prompt-models` was folded into `sk-prompt` as a mode. A JSON audit grep-proved it has no runtime consumer, and the `parent-skill-check.cjs` checker had a recursive rule for nested `graph-metadata.json` (2a) but none for `description.json`, so the residue passed silently.

### Purpose

Remove the residue and codify the placement convention in the three places that keep it from recurring: the doctrine reference, the checker (a recursive rule sibling to 2a), and AGENTS.md.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Delete `sk-prompt/prompt-models/description.json`.
- Add a recursive nested-`description.json` rule (2b) to `parent-skill-check.cjs`.
- Add the "no per-packet `description.json`" statement to `parent-skills-nested-packets.md`.
- Add a two-schema disambiguation and placement rule to `AGENTS.md`.

### Out of Scope

- The pre-existing `10a-manifest-source` checker path bug (tracked in `context-index.md`, relevant to phase 005).
- A fixture-dir exclusion for rules 2a/2b (only needed if the checker is ever run against `system-spec-kit`).
- Any other JSON in the tree (the audit found all others correctly placed).

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P1 | No mode/packet folder carries `description.json` or `graph-metadata.json` (advisor identity is hub-only). |
| REQ-002 | P1 | `parent-skill-check.cjs` fails when a nested `description.json` exists below a hub root. |
| REQ-003 | P1 | The doctrine and AGENTS.md state the placement rule and the two-schema disambiguation. |
| REQ-004 | P1 | The residue removal breaks no runtime consumer (grep-proven) and leaves `sk-prompt` checker-clean on rule 2b. |
| REQ-005 | P2 | The change touches no runtime routing, serving, or advisor path (documentation plus a diagnostic-only checker rule). |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `parent-skill-check.cjs .opencode/skills/sk-prompt` reports `PASS: 2b` (was `FAIL: 2b` before removal).
- `find .opencode/skills -mindepth 3 -name description.json` returns nothing outside `system-spec-kit` test fixtures.
- The checker passes `node --check`.
- The doctrine and AGENTS.md carry the placement rule.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Deleting a consumed file.** Mitigated: the JSON audit grep-proved no runtime consumer (advisor extraction sources SKILL.md + graph-metadata.json only) and the file's own content disclaimed advisor-discoverability.
- **Rule 2b false-positive on fixtures.** Mitigated: the 7 checked hubs carry no fixture `description.json`; only `system-spec-kit` (not a checked hub) does. Recorded in `context-index.md`.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Rule 2b mirrors the existing rule 2a exactly (same recursion, same failure framing), so the checker stays internally consistent.
- No change to runtime routing, serving, or any advisor behavior. Documentation and a diagnostic checker only.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A hub root's own `description.json` must still pass (rule 2b excludes `path.join(target, 'description.json')`).
- Test-fixture `description.json` files under `system-spec-kit/scripts/**` are spec-folder-schema, not advisor residue; the checker is not run against `system-spec-kit`, so they are not flagged in practice.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether to add a fixture-dir exclusion to rules 2a/2b is deferred; not needed unless the checker is pointed at a standalone skill with spec-folder fixtures.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).
- `../spec.md` and `../context-index.md` (the 021 program parent).
- Next phase: [`002-reference-asset-template-alignment`](../002-reference-asset-template-alignment/spec.md).

<!-- /ANCHOR:related-docs -->
