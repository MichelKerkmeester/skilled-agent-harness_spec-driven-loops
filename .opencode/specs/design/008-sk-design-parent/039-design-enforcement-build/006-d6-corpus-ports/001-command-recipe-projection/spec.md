---
title: "D6-R1 — Command-surface projection layer (argumentGrammar + choreography[])"
description: "Port the two net-new command-recipe shapes — a typed argumentGrammar (render === argumentHint) and an ordered choreography[] — onto the sk-design command-metadata SSOT, drift-gate them in the surface-check, and project choreography into the five /design:* wrappers, holding STATUS=PASS drift=0."
trigger_phrases:
  - "d6-r1 command recipe projection"
  - "command metadata design build"
  - "argumentGrammar choreography surface-check"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/001-command-recipe-projection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 and record ownerMode-singular and next-minimal logic-syncs"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D6-R1 — Command-surface projection layer (argumentGrammar + choreography[])

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
| **Enforcement class** | enforceable |
| **Dimension** | D6 — Corpus Ports |
| **Feeds** | D2 |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The design corpus treats a command as a workflow recipe — a verb carrying a typed argument grammar and an ordered, named-skill choreography that runs underneath it ("commands are workflows; the skills run underneath them"). The five `/design:*` wrappers published only a flat `argumentHint` string and a `STATUS=OK|FAIL` line, so the typed argument shape and the choreographed load order existed only in prose and could drift from the metadata with nothing to catch it.

### Purpose
Port the two genuinely net-new recipe shapes onto the existing command-metadata SSOT and make both a checked cross-surface contract: a typed `argumentGrammar` whose `render` must equal the published `argumentHint`, and an ordered `choreography[]` whose steps each wrapper restates in a `## CHOREOGRAPHY` section that the surface-check drift-gates against the metadata. Every change is additive and preserves the established `STATUS=PASS ... drift=0` baseline; `mode-registry.json` stays identity-only.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `argumentGrammar` (positional + flags + `render`) and `choreography[]` (ordered `order`/`skill`/`resource`/`action` steps) to each of the five design command records in `command-metadata.json`
- Extend `design-command-surface-check.mjs` additively: both fields in the required set, `validateArgumentGrammar` (enforcing `argumentGrammar.render === argumentHint`), and a `## CHOREOGRAPHY` wrapper-drift detector that compares each wrapper's numbered steps to the metadata `choreography[]`
- Add one `## CHOREOGRAPHY` section to each of the five `.opencode/commands/design/*.md` wrappers, reflecting that command's `choreography[]`

### Out of Scope
- The recipe **scorer cap** — owned by sibling phase 002
- The full `nextOptions[]` handoff and STATUS grammar — owned by sibling phase 007
- The broader structural drift audit (route fixtures, generated-doc comparison) — owned by sibling phase 008
- Any runtime generator binary — acceptance requires a drift gate, not regeneration

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add `argumentGrammar` and `choreography[]` to each of the five records; preserve every existing field |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Add both fields to the required set; add `validateArgumentGrammar` (shape + `render === argumentHint`); add the `## CHOREOGRAPHY` wrapper-drift detector |
| `.opencode/commands/design/audit.md` | Modify | Add a `## CHOREOGRAPHY` section matching the audit `choreography[]` |
| `.opencode/commands/design/foundations.md` | Modify | Add a `## CHOREOGRAPHY` section matching the foundations `choreography[]` |
| `.opencode/commands/design/interface.md` | Modify | Add a `## CHOREOGRAPHY` section matching the interface `choreography[]` |
| `.opencode/commands/design/md-generator.md` | Modify | Add a `## CHOREOGRAPHY` section matching the md-generator `choreography[]` |
| `.opencode/commands/design/motion.md` | Modify | Add a `## CHOREOGRAPHY` section matching the motion `choreography[]` |
| `.opencode/skills/sk-design/mode-registry.json` | Unchanged | Identity-only reference; not edited |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add `argumentGrammar` to every record | All five records carry a typed `argumentGrammar` (positional, flags, `render`); `render` equals the existing `argumentHint` for each |
| REQ-002 | Add `choreography[]` to every record | All five records carry a non-empty ordered `choreography[]`; each step has `order`, `skill`, `resource`, and `action` |
| REQ-003 | Surface-check requires and validates both fields | `validateArgumentGrammar` enforces shape and `render === argumentHint`; `choreography[]` is validated as a non-empty ordered named-skill array; a record missing either field is `INVALID` |
| REQ-004 | Wrapper-drift detector gates choreography | Each wrapper `## CHOREOGRAPHY` section must match the metadata `choreography[]`; a divergence is reported as drift and blocks |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All five wrappers carry the section | Each of `audit`, `foundations`, `interface`, `md-generator`, `motion` has one `## CHOREOGRAPHY` section reflecting its steps |
| REQ-006 | Preserve identity and stay evergreen | `mode-registry.json` byte-unchanged; routing artifacts untouched; no spec/packet/phase IDs in any edited code comment |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node design-command-surface-check.mjs` returns `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0, with both new fields present and validated on all five records.
- **SC-002**: The gate bites — corrupting an `argumentGrammar.render` yields `STATUS=INVALID invalid=1`, and diverging one wrapper `## CHOREOGRAPHY` step from the metadata yields `STATUS=DRIFT drift=1`; both revert to the green baseline.
- **SC-003**: `ownerMode` stays singular and `next[]` stays minimal; `mode-registry.json`, `hub-router.json`, and `score-skill-benchmark.cjs` are untouched (`ownerModes`=0, `nextOptions`=0); `hubRoute` holds 23/5/0; the evergreen scan is clean; and the change set is the three in-scope artifacts only.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Logic-sync | Spec wrote `ownerModes[]`; the SSOT + checker use `ownerMode` singular | A literal plural rename is non-additive and breaks `drift=0` plus the `ownerMode → workflowMode` validation | **Resolved: keep `ownerMode` singular.** Multi-skill aspects ride `choreography[]`; the plural rename is not adopted |
| Logic-sync | Spec wrote `nextOptions[]`; sibling 007 owns the full handoff grammar | Building the rich grammar here double-owns the surface and creates parallel drift | **Resolved: keep `next[]` minimal.** The full `nextOptions[]` + STATUS grammar is deferred to sibling phase 007 |
| Risk | Choreography sequence quality is not machine-checkable | The gate can prove the recipe is declared and consistent, never that the sequence is the right one or yields good design | Documented honesty: presence + `render === argumentHint` + wrapper-metadata agreement are enforceable; sequence quality stays advisory |
| Risk | Wrappers edited before the checker knows the fields | The run would not be a meaningful drift gate | Order enforced: SSOT first, then the checker, then the wrappers, then verification |
| Dependency | Node runtime for the ESM surface-check | Green | Required to run the gate; no new packages |
| Dependency | The existing passing command surface (outputContract, next, argumentHint, pipeline, discriminator, registerPolicy, taskProjections) | Green | Already built and enforced; preserved as-is |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: The port is additive only — no existing SSOT field is removed or mutated, and `mode-registry.json` stays byte-identical.
- **NFR-I02**: The typed grammar, the flat `argumentHint`, and the wrapper `argument-hint` stay in lockstep through the `render === argumentHint` invariant, so no new frontmatter is introduced.

### Consistency
- **NFR-C01**: The metadata `choreography[]` is the single source; each wrapper `## CHOREOGRAPHY` section is a projection of it, drift-gated so the two cannot diverge silently.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Field validity
- **Missing field**: a record without `argumentGrammar` or `choreography[]` is reported `INVALID` by the required-field set.
- **Render mismatch**: `argumentGrammar.render` not equal to `argumentHint` is reported `INVALID` by `validateArgumentGrammar`.
- **Malformed choreography**: an empty array, or a step missing `order`/`skill`/`action`, fails the choreography validator.

### Drift
- **Wrapper divergence**: a wrapper `## CHOREOGRAPHY` numbered step that does not match the metadata step is reported as `DRIFT` and blocks.
- **No-regression**: existing fields, registry identity, and the prior pass all hold; the summary line stays `invalid=0 drift=0`.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Three artifacts — one SSOT JSON (5 records × 2 fields), one ESM checker (2 validators + 1 drift detector), and five Markdown wrappers (one section each).
- **Risk concentration**: The only judgment-bearing surface is the *content* of each `choreography[]` sequence; everything else (presence, shape, render equality, wrapper-metadata agreement) is structural and the surface-check bites on it. The blast radius is the design command surface only; the registry and routing stay untouched.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the owner field be renamed to `ownerModes[]` per the spec build-outline? **RESOLVED: No.** The SSOT and checker use `ownerMode` singular pervasively and validate it against a `workflowMode`; a plural rename is non-additive and breaks `drift=0`. Multi-skill aspects are expressed through `choreography[]`, so no information is lost.
- Should the full `nextOptions[]` handoff grammar be built here? **RESOLVED: No.** Sibling phase 007 (`next-options-handoff-grammar`) owns the full handoff and STATUS grammar; `next[]` stays the minimal next-options surface here to avoid double-owning and parallel drift.
- Does the gate certify that the choreography is the *right* sequence? **RESOLVED: No.** The surface-check proves the recipe is declared, well-formed, render-consistent, and that each wrapper matches the metadata — presence and cross-surface agreement. Whether the sequence yields good design stays advisory; taste is not hashed.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Additive recipe-field port: argumentGrammar (render === argumentHint) + choreography[] onto all 5 design command records, drift-gated by the surface-check
- STATUS=PASS commands=5 invalid=0 drift=0; render-INVALID and choreography-DRIFT bites both confirmed
- Logic-syncs recorded in RISKS/OPEN QUESTIONS: ownerMode singular (no rename), next[] minimal (007 owns the rich grammar)
- Enforcement split: presence + cross-surface agreement enforceable, choreography-sequence quality advisory; GENERATED_METADATA regenerated by the orchestrator
-->
