---
title: "D3-R6 — Content-bound SOURCE PROOF"
description: "Add a SOURCE PROOF block (path/sha256/anchor/echo) to both sk-design proof cards and an additive proof_check.py --require-source-proof flag that recomputes each cited file's raw-byte sha256 and verifies the verbatim echo, replacing self-attested utilization with content-bound proof."
trigger_phrases:
  - "d3-r6 source proof"
  - "content bound proof design build"
  - "proof_check require source proof"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/006-content-bound-source-proof"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the source-proof build and mark the phase spec complete"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/context_loaded_card.md"
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D3-R6 — Content-bound SOURCE PROOF

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
| **Dimension** | D3 — Routing & Utilization |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Utilization is self-attested today. A ready-claim can tick a checkbox asserting a file was loaded without any proof that it was. There is no content binding between the claim and the loaded resource, so the proof cards record intent, not evidence. A route that says "I loaded the register" is indistinguishable from one that did not.

### Purpose
Replace self-attestation with a content-bound SOURCE PROOF. Each cited file carries its raw-byte sha256 plus a short verbatim echo that must still be present inside the live file, and `proof_check.py --require-source-proof` recomputes the digest from disk and confirms the echo, failing on a tampered digest or a missing/forged anchor rather than on a missing field. This is the LOADING-layer proof that the routing utilization guarantee depends on: the digest and echo make a load-claim falsifiable. The digest rule is reused from `references/design_proof_token.md` section 4 (the single raw-byte sha256 rule), not reinvented.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `SOURCE PROOF` section (recompute-rule line + `[Path, SHA256, Anchor, Echo]` table) on both `context_loaded_card.md` and `proof_of_application_card.md`
- Extending the application card's footer gate hint to document the stricter `--require-source-proof` mode
- An additive `proof_check.py --require-source-proof` flag that recomputes each cited file's raw-byte sha256 and verifies the verbatim echo, failing closed on unreadable files
- Acceptance (faithful / tampered / forged / unreadable) and no-regression verification

### Out of Scope
- Any change to `references/design_proof_token.md` (its section 4 hashing rule is reused, not edited)
- Wiring `--require-source-proof` into any CI/build gate as mandatory (it ships as an opt-in flag)
- Verifying that an `Anchor` locator points at a specific heading/line (the strong checks are digest + echo substring)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/assets/context_loaded_card.md` | Modify | Add `## 6. SOURCE PROOF` block with the `[Path, SHA256, Anchor, Echo]` table |
| `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md` | Modify | Add the same SOURCE PROOF block; extend footer gate hint with `--require-source-proof` |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Modify | Add the additive `--require-source-proof` flag + digest/echo recompute |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both cards carry a SOURCE PROOF block | `## SOURCE PROOF` with a `[Path, SHA256, Anchor, Echo]` table present in both cards |
| REQ-002 | The checker recomputes digest from disk | `--require-source-proof` reads the cited file's raw bytes and fails on a sha256 mismatch, not on field presence |
| REQ-003 | The checker verifies the verbatim echo | A faithful card passes; an echo absent from the cited file fails |
| REQ-004 | The checker fails closed on an unreadable cited file | A row pointing at a missing/unreadable file fails (does not pass) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The flag is additive | No-flag / `--json` / `--require-cards` behavior and return keys are unchanged; `source_proof` appears only under the flag |
| REQ-006 | The sha256 rule is reused, not reinvented | sha256 follows `design_proof_token.md` section 4; that file is not edited |
| REQ-007 | Evergreen body | The two cards and the script carry no spec/packet/phase IDs or `specs/` paths |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `proof_check.py --require-source-proof <card>` reports `source_proof.ok` is `True` for a faithful card (real path, recomputed sha256, real echo).
- **SC-002**: Flipping one hex char in a `SHA256` cell makes `source_proof.ok` `False` (digest mismatch).
- **SC-003**: Replacing the `Echo` with text absent from the cited file makes `source_proof.ok` `False` (anchor echo absent/forged).
- **SC-004**: Pointing a row at a missing/unreadable file makes `source_proof.ok` `False` (fail-closed).
- **SC-005**: No-flag and `--json` invocations keep the original return keys with `source_proof` absent; the change set is limited to the two cards + the script.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The new flag changes existing behavior | Existing callers mis-fire | Gate every new behavior behind `--require-source-proof`; keep return keys unchanged when absent |
| Risk | A second hashing rule drifts from the token | Cards and checker disagree on canonicalization | Reuse the `design_proof_token.md` section 4 raw-byte rule verbatim; do not author a second rule |
| Risk | A passing card cites an unreadable file | A load-claim slips through unverified | Fail closed: an unreadable cited file is treated as failure |
| Dependency | `references/design_proof_token.md` section 4 | Source-of-truth hashing rule | Reused unchanged; no edit |
| Dependency | Python 3 stdlib (`hashlib`, `re`) | Recompute + table parse | Standard library only, no new deps |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: With no flag, the checker output (keys, ordering, exit code) is byte-identical to the prior baseline; `source_proof` is never added.

### Backward Compatibility
- **NFR-B01**: `check()` keeps its existing keys (`fields`, `cards`, `ready`, `not_ready_flag`, `missing`, `ok`) and the 0/1/2 exit contract; `source_proof` is additive and contributes to `missing`/`ok` only under the flag.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Table Boundaries
- **Placeholder rows**: Rows whose cells are only underscores/whitespace are skipped; a card with only placeholder rows under the flag fails as "rows missing".
- **Malformed digest**: A `SHA256` cell that is not `sha256:<64 hex>` fails as "digest malformed".

### File Boundaries
- **Unreadable file**: An `OSError` on the cited path fails closed.
- **Non-utf-8 bytes**: The file is decoded tolerantly for the echo check; the digest is always over raw bytes.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Two card edits (one new section each) plus one additive parser/recompute path in a single script.
- **Risk concentration**: Regression risk is contained by the opt-in flag; the no-flag no-regression check is the controlling guard.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the checker verify uniqueness of the echo, not just presence? **RESOLVED: No; the checker verifies literal presence, and the author is responsible for choosing a distinctive verbatim quote.**
- Should `--require-source-proof` be mandatory in CI? **RESOLVED: No; it ships as an additive opt-in flag this phase, so existing callers are unaffected.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Reused contract**: `../../../../../../skills/sk-design/references/design_proof_token.md` section 4 (raw-byte sha256)

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Evidence: proof_check.py --require-source-proof recompute gate + SOURCE PROOF blocks on both cards; source_proof.ok matrix (faithful True, tampered/forged/unreadable False)
-->
