---
title: "D4-R6 — Inner-generator payload binding; deny raw --skip/defaults; bind inner model"
description: "Bind the Open Design inner generator's multi-turn input payload (subject/brief/form-answers/lineage) to DESIGN_PROOF_TOKEN payload digests, recompute and reject on drift across both turns, deny blanket defaults, and pin the inner model."
trigger_phrases:
  - "d4-r6 inner generator binding"
  - "payload binding design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/006-inner-generator-payload-binding"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 and record the daemon residual and prose-contract nature"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/inner_generator_binding.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D4-R6 — Inner-generator payload binding; deny raw --skip/defaults; bind inner model

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
| **Enforcement class** | hybrid |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The guarded proxy binds the FIRST outgoing Open Design request to the proof token, but generation is multi-turn. Turn 1 (`start_run` / `od run start --message`) commonly returns a discovery question-form, ends `awaiting_input`, and writes zero files. A SECOND payload — the form answers (`od ui respond --value | --value-json | --skip`) or a follow-up `od run start --conversation` message — is what fires the build that writes the design files. Nothing binds that second turn or the inner agent's effective input back to the token, so the inner generation can drift from the authorized subject/brief/form-answers/lineage, and a blanket `--skip` / "use recommended defaults" run can launder unauthorized answers past a valid turn-1 token.

### Purpose
Author one new `mcp-open-design` reference, `inner_generator_binding.md`, that defines a binding contract: it maps each inner-payload component to one `DESIGN_PROOF_TOKEN` payload digest (subject → `subjectDigest`, brief → `briefDigest`, form answers / follow-up → `formAnswersDigest`, lineage → `openDesignLineageDigest`), requires the guarded-proxy boundary to recompute each digest from the actual inner payload across BOTH turns and DENY on drift, denies blanket defaults that cannot materialize recomputable answers, and pins the inner model by declared equality. Canonicalization is inherited from the proof-token contract §4 by citation; this phase authors no second hashing rule and extends no token field. The deliverable is a prose contract, not code — the enforceable spine (the proof token plus the guarded proxy/Codex gate) already exists; this binds the inner-generation payload as a recomputable consumer of it.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One new shared reference doc: `.opencode/skills/mcp-open-design/references/inner_generator_binding.md`
- The component → digest mapping (subject/brief/form-answers/lineage) carried as structured metadata
- The both-turn recompute-and-reject rule that re-binds the build-fire turn to the SAME token
- The blanket `--skip` / "recommended defaults" denial and the declared-equality inner-model pin
- The named, unclosed daemon residual (inner-agent process + daemon-side bypass)

### Out of Scope
- Any edit to a live skill, gate, hook, or CLI file (the proof token, guarded proxy, and Codex policy already exist)
- Re-authoring the proof-token §4 canonicalization or adding any token digest field
- Reaching inside the closed Open Design daemon's inner-agent process or closing the daemon-side bypass
- The run/build gate and cross-child laundering guard (downstream consumers of this binding)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/inner_generator_binding.md` | Create | The binding contract: mapping table, both-turn recompute-and-reject, §4-by-citation reuse, named residual |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Map every inner-payload component to one token digest | The doc maps subject → `subjectDigest`, brief → `briefDigest`, form answers/follow-up → `formAnswersDigest`, lineage → `openDesignLineageDigest` |
| REQ-002 | Bind BOTH turns to the SAME token | RECOMPUTE & REJECT re-binds the build-fire turn; the form-answer/follow-up payload must recompute to `formAnswersDigest` with the other three digests unchanged |
| REQ-003 | Reuse §4 canonicalization by citation | The doc cites `DESIGN_PROOF_TOKEN` §4 and contains no second hashing rule (zero sha256/hashlib mentions) |
| REQ-004 | Deny drift, blanket defaults, and wrong model | A drifted payload, a `--skip`/defaults run without recomputable answers, or a mismatched inner model is DENIED; fail-closed on absence/ambiguity/exception |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Name the unmodifiable-daemon residual | NAMED RESIDUAL states the adapter cannot reach inside the inner-agent process and a daemon-side raw HTTP / Skills-UI call bypasses the bind |
| REQ-006 | Keep the doc evergreen | No spec, packet, or phase identifiers and no `specs/` paths in the doc body |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `inner_generator_binding.md` exists at the exact target path with the required frontmatter and the seven ordered sections.
- **SC-002**: A positive walk (both turns reconstructable, all four digests recompute to the token, model matches) is ALLOWED; drift, blanket defaults, and wrong-model walks are DENIED.
- **SC-003**: The doc cites proof-token §4 for canonicalization, adds no token field, names both residuals, and its body carries no spec/packet/phase IDs or `specs/` paths.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The contract is prose, not code | A runtime that ignores the contract is not mechanically stopped by it | The enforceable spine (proof token + guarded proxy/Codex gate) already exists; this binds the inner payload as a recomputable consumer of that spine |
| Risk | The closed daemon spawns the inner agent in-app | The adapter cannot reach inside the inner-agent process or a daemon-side bypass | Residual is NAMED, not implied away; the bind holds at the adapter across both turns |
| Risk | Re-authoring canonicalization would fork the hashing rule | Two digest algorithms drift apart | §4 canonicalization is reused by citation; the doc authors no second hashing rule |
| Dependency | `DESIGN_PROOF_TOKEN` digest fields + §4 canonicalization | Green | No digests to bind to and no canonical recompute to reuse without it |
| Dependency | Guarded-proxy precondition (the recompute point) | Green | No boundary to extend the binding into without it |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: The boundary fails closed — drift, missing answers, ambiguous input, or a validator exception returns DENY, never a silent allow.
- **NFR-S02**: The build-fire turn cannot launder a drifted design past a valid turn-1 token; the second turn is re-bound to the same token before any file write.

### Defense-in-Depth
- **NFR-DD01**: This binding extends the existing guarded-proxy precondition to the multi-turn build-fire boundary. It adds a boundary, not a new token, and the proof token plus guarded proxy remain the authoritative spine.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Turn Variants
- **Zero-file turn 1**: A discovery-form turn 1 that writes no files still must recompute to the token; the build fires only on the second turn, which is independently re-bound.
- **Follow-up message build**: A `od run start --conversation` follow-up that fires the build is treated as a build-fire turn and recomputed like a form-answer payload.

### Failure Modes
- **Blanket defaults**: `--skip` / "use recommended defaults" is denied unless it materializes concrete answers that recompute to `formAnswersDigest`.
- **Wrong model**: An inner model not equal to the authorized pinned model returns DENY by declared equality, with no digest added.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One new reference doc binds one already-wired recompute point across two turns; no source change.
- **Risk concentration**: The single material gap is the closed daemon's inner-agent process and daemon-side bypass, which this contract names as residual rather than claiming to close.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Can this contract reach inside the Open Design daemon's inner-agent process? **RESOLVED: No. The bundled daemon spawns the inner agent inside the closed app, so the agent-side adapter binds only AT the adapter across both turns. It cannot observe the inner agent's private reasoning, daemon-internal payload mutation, or a raw HTTP-port / in-app Skills-UI call that reaches the daemon around the adapter. That residual is named, not implied away.**
- Is this phase code or a prose contract? **RESOLVED: A prose contract. The enforceable spine — the proof token and the guarded proxy / Codex gate — already exists. This phase binds the inner-generation payload as a recomputable consumer of that spine; it ships one reference doc and edits no live skill, gate, hook, or CLI file. Taste is not certified.**

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
- Core + Level 2 verification focus
- Prose binding contract: inner-generator payload bound to DESIGN_PROOF_TOKEN digests across both turns
- Residual named in RISKS/OPEN QUESTIONS: closed daemon inner-agent process + daemon-side bypass; prose-not-code nature recorded
-->
