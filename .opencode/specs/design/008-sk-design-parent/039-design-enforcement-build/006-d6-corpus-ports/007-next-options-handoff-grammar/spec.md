---
title: "D6-R7 — nextOptions[] + handoff status grammar (no silent chain)"
description: "Port a typed next-options + handoff status grammar onto the sk-design command-metadata SSOT — a handoff object (nextOptions[] of command/when, handoffRequired, handoffReason) on all 5 records — drift-gate it in the surface-check, and project HANDOFF GRAMMAR into the five /design:* wrappers, holding STATUS=PASS drift=0 and hubRoute 23/5/0."
trigger_phrases:
  - "d6-r7 next options handoff grammar"
  - "handoff grammar design build"
  - "validateHandoff design command surface-check"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/007-next-options-handoff-grammar"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record D6-R1 reconciliation and enforceable/advisory split"
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
# D6-R7 — nextOptions[] + handoff status grammar (no silent chain)

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
| **Enforcement class** | enforceable |
| **Dimension** | D6 — Corpus Ports |
| **Feeds** | D2 |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The design corpus ends every command with an explicit follow-up grammar — a `## Output` block declaring what was produced and which named recipes may run next. The five `/design:*` wrappers, by contrast, ended on a bare success tail (`STATUS=OK PRODUCES= NEXT= PROOF=`) plus a prose "recommend-only / never silently chains" line. The next hop was therefore legible to a human but not machine-checkable, and "no silent auto-chain" was asserted in prose with nothing to enforce it. A wrapper could name a follow-up that does not resolve to a real recipe, or imply a chain it never declared, and nothing would catch it.

### Purpose
Port a typed **next-options + handoff status grammar** onto the existing command-metadata SSOT and make it a checked cross-surface contract: a `handoff` object per record (`nextOptions[]` of `command` + `when`, a `handoffRequired` boolean, a `handoffReason` string) whose `nextOptions[].command` set equals the record's `next` set, whose every option resolves to a known non-self recipe, and which the surface-check drift-gates against each wrapper's `## HANDOFF GRAMMAR` section. A declared option that does not resolve, or a silent auto-chain, fails the checker. Every change is additive and coexists with sibling phase 001's `argumentGrammar`/`choreography[]`; the established `STATUS=PASS ... drift=0` baseline and `mode-registry.json` identity are preserved.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `handoff` object (`nextOptions[]` of `command` + `when`, `handoffRequired:false`, non-empty `handoffReason`) to each of the five design command records in `command-metadata.json`; the `nextOptions[].command` set equals the record `next` set
- Extend `design-command-surface-check.mjs` additively: `handoff` in the required set, `validateHandoff` (known-recipe resolution, no self-handoff, no duplicate, `nextOptions == next` lockstep, boolean-and-`false` `handoffRequired`, non-empty `handoffReason`, non-empty `when`), and a `## HANDOFF GRAMMAR` wrapper-drift detector
- Add one `## HANDOFF GRAMMAR` section to each of the five `.opencode/commands/design/*.md` wrappers, carrying `NEXT_OPTIONS` / `HANDOFF_REQUIRED` / `HANDOFF_REASON`, each option's `when`, and the no-silent-chain assertion

### Out of Scope
- The recipe **projection layer** (`argumentGrammar` + `choreography[]`) — owned by sibling phase 001 (D6-R1); this port is additive beside it
- The recipe **scorer cap** — owned by sibling phase 002
- The broader structural drift audit (route fixtures, generated-doc comparison) — owned by sibling phase 008
- Any runtime generator binary — acceptance requires a drift gate, not regeneration

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add a `handoff` object to each of the five records; `nextOptions` set equals `next`; preserve every existing field |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Add `handoff` to the required set; add `validateHandoff`; add the `## HANDOFF GRAMMAR` wrapper-drift detector and register the new drift field |
| `.opencode/commands/design/audit.md` | Modify | Add a `## HANDOFF GRAMMAR` section matching the audit `handoff` object |
| `.opencode/commands/design/foundations.md` | Modify | Add a `## HANDOFF GRAMMAR` section matching the foundations `handoff` object |
| `.opencode/commands/design/interface.md` | Modify | Add a `## HANDOFF GRAMMAR` section matching the interface `handoff` object |
| `.opencode/commands/design/md-generator.md` | Modify | Add a `## HANDOFF GRAMMAR` section matching the md-generator `handoff` object |
| `.opencode/commands/design/motion.md` | Modify | Add a `## HANDOFF GRAMMAR` section matching the motion `handoff` object |
| `.opencode/skills/sk-design/mode-registry.json` | Unchanged | Identity-only reference; not edited |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add a `handoff` object to every record | All five records carry `nextOptions[]` (each `command` + `when`), `handoffRequired:false`, and a non-empty `handoffReason` |
| REQ-002 | Every next option resolves to a known non-self recipe | Each `nextOptions[].command` is one of the five `/design:*` recipes, is not the record's own command, and is not duplicated |
| REQ-003 | Surface-check requires and validates the handoff object | `validateHandoff` enforces the shape, known-recipe resolution, `nextOptions == next` lockstep, boolean-and-`false` `handoffRequired`, non-empty `handoffReason`/`when`; a record missing `handoff` is `INVALID` |
| REQ-004 | Wrapper-drift detector gates the handoff grammar (no silent chain) | Each wrapper `## HANDOFF GRAMMAR` section must carry the three tokens, every option command + rationale, `HANDOFF_REQUIRED=false`, and the no-silent-chain assertion; a divergence or an unknown option blocks |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All five wrappers carry the section | Each of `audit`, `foundations`, `interface`, `md-generator`, `motion` has one `## HANDOFF GRAMMAR` section reflecting its handoff object |
| REQ-006 | Preserve identity and stay evergreen | `mode-registry.json` byte-unchanged; routing artifacts untouched; D6-R1 `argumentGrammar`/`choreography[]` preserved; no spec/packet/phase IDs in any edited code |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node design-command-surface-check.mjs` returns `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0, with a valid `handoff` object present on all five records and every wrapper `## HANDOFF GRAMMAR` section matching the SSOT.
- **SC-002**: The gate bites — injecting an unknown/malformed `nextOptions` command yields `STATUS=INVALID invalid=1`, and removing `handoffRequired` from a record yields `STATUS=INVALID invalid=2` (required-field plus boolean-type errors); both revert to the green baseline.
- **SC-003**: `nextOptions == next` lockstep holds with no self-handoff; D6-R1 `argumentGrammar`/`choreography[]` stay intact; `mode-registry.json`, `hub-router.json`, and `score-skill-benchmark.cjs` are untouched by this phase; `hubRoute` holds 23/5/0; the evergreen scan is clean; and the change set is the in-scope artifacts only.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Reconciliation | D6-R1 (phase 001) deferred the rich `nextOptions[]` + STATUS handoff grammar to this phase | If R7 clobbered R1's landed `argumentGrammar`/`choreography[]`, drift would break | **Resolved: R7 adds the richer `nextOptions`/`handoff` that R1 deferred, additively.** The `handoff` object sits beside R1's fields; both verified present; `drift=0` after the merge |
| Logic-sync | Spec listed loose grammar tokens; the handoff fields needed one cohesive home | Three loose fields would scatter the contract and complicate the validator | **Resolved: group under one `handoff` object.** `validateHandoff` owns the whole shape; `nextOptions` is held in lockstep with `next` so there is no parallel surface |
| Risk | The recommended pipeline choice is not machine-checkable | The gate can prove the grammar is declared and consistent, never that the recommended options are the right pipeline for a live request | Documented honesty: handoff-grammar structure (presence, known-recipe resolution, lockstep, no-silent-chain) is enforceable; live pipeline choice and live no-auto-chain behavior stay advisory |
| Risk | Wrappers edited before the checker knows the grammar | The run would not be a meaningful drift gate | Order enforced: SSOT first, then the checker, then the wrappers, then verification |
| Dependency | Node runtime for the ESM surface-check | Green | Required to run the gate; no new packages |
| Dependency | The existing passing command surface (`next`, `pipeline.nextCommands`, the wrapper success tail) | Green | Already built and enforced; `handoff.nextOptions` enriches `next` and is preserved as-is |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: The port is additive only — no existing SSOT field is removed or mutated, D6-R1's `argumentGrammar`/`choreography[]` stay intact, and `mode-registry.json` stays byte-identical.
- **NFR-I02**: `next`, `pipeline.nextCommands` (a subset of `next`), and `handoff.nextOptions` stay in lockstep through the `nextOptions == next` invariant, so there is one canonical next-command surface.

### Consistency
- **NFR-C01**: The metadata `handoff` object is the single source; each wrapper `## HANDOFF GRAMMAR` section is a projection of it, drift-gated so the two cannot diverge silently.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Field validity
- **Missing handoff**: a record without `handoff` is reported `INVALID` by the required-field set.
- **Unknown option**: a `nextOptions[].command` that does not resolve to one of the five recipes is reported `INVALID` by `validateHandoff`.
- **Self-handoff / duplicate**: an option referencing the record's own command, or a duplicated command, fails the validator.
- **Lockstep break**: a `nextOptions[].command` set that does not equal `next` exactly fails the validator.
- **Mandatory chain**: a non-`false` or non-boolean `handoffRequired` is reported invalid (recommend-only is enforced).

### Drift
- **Wrapper divergence**: a wrapper `## HANDOFF GRAMMAR` section missing a token, an option command, its rationale, the `HANDOFF_REQUIRED=false` flag, or the no-silent-chain assertion is reported as `DRIFT` and blocks.
- **No-regression**: existing fields, D6-R1 fields, registry identity, and the prior pass all hold; the summary line stays `invalid=0 drift=0`.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Three artifacts — one SSOT JSON (5 records × one `handoff` object), one ESM checker (`validateHandoff` + one wrapper-drift detector), and five Markdown wrappers (one `## HANDOFF GRAMMAR` section each).
- **Risk concentration**: The only judgment-bearing surface is whether the *recommended* options are the right pipeline for a live request; everything else (presence, shape, known-recipe resolution, lockstep, recommend-only, wrapper-metadata agreement, no-silent-chain) is structural and the surface-check bites on it. The blast radius is the design command surface only; the registry and routing stay untouched.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the next-options grammar be built here or in D6-R1? **RESOLVED: here.** Sibling phase 001 (D6-R1) ported `argumentGrammar`/`choreography[]` and explicitly deferred the richer `nextOptions[]` + STATUS handoff grammar to this phase. R7 adds it additively beside R1's landed fields; both are verified present and `drift=0` holds.
- Should the grammar tokens be three loose fields or one object? **RESOLVED: one `handoff` object.** Grouping `nextOptions[]`, `handoffRequired`, and `handoffReason` keeps the contract cohesive, lets `validateHandoff` own the whole shape, and holds `nextOptions` in lockstep with `next` so no parallel next-command surface appears.
- Does the gate certify the recommended pipeline is the *right* one? **RESOLVED: No.** The surface-check proves the handoff grammar is declared, well-formed, resolves to known non-self recipes, stays in lockstep with `next`, is recommend-only, and matches each wrapper including the no-silent-chain assertion — structure and cross-surface agreement. Whether the recommended options are the right pipeline for a live request, and whether a live model honors no-auto-chain outside the static surface, stay advisory.

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
- Additive handoff-grammar port: a handoff object (nextOptions[] of command/when, handoffRequired, handoffReason) on all 5 design command records, drift-gated by the surface-check
- STATUS=PASS commands=5 invalid=0 drift=0; unknown-nextOptions-INVALID (invalid=1) and missing-handoffRequired-INVALID (invalid=2) bites both confirmed
- D6-R1 reconciliation recorded in RISKS/OPEN QUESTIONS: R7 adds the richer nextOptions/handoff R1 deferred, additively beside argumentGrammar/choreography
- Enforcement split: handoff-grammar structure (presence, known-recipe resolution, lockstep, no-silent-chain) enforceable, live pipeline choice advisory; GENERATED_METADATA regenerated by the orchestrator
-->
