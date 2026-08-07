---
title: "Task Breakdown: Pre-Program Code Conformance"
description: "Tasks for pre-program code conformance."
trigger_phrases:
  - "pre-program conformance task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/020-preprogram-code-conformance"
    last_updated_at: "2026-07-30T11:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Fixed four pre-program code findings"
    next_safe_action: "Proceed to phase 019 or 018"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/020-preprogram-code-conformance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Pre-Program Code Conformance

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Establish by line blame that all four findings predate this program's commit range [evidence: recorded in impl-summary REQ-005 from the reviewer's line-blame — every finding lands outside the program's commit range]
- [x] T-02 Identify which two were already raised and closed by the earlier review [evidence: impl-summary REQ-005 notes two were previously raised-and-closed and one file appears in no program commit]
- [x] T-03 Confirm the repository's hygiene tool currently passes the flagged comment, establishing the doctrine-versus-gate gap [evidence: no hygiene violation pattern matches a bare packet number like "029"; the gap is recorded and referred in impl-summary REQ-006]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 Replace the ephemeral label with the durable reason the check exists [evidence: `ci-skill-derived-freshness.cjs:9` "the 029 research ranked highest" → "the highest-leverage drift in the fleet"]
- [x] T-05 Move the strict-mode directive to immediately follow the boxed header [evidence: `'use strict';` now at line 5, matching the compliant siblings; behaviour unchanged]
- [x] T-06 Add the containment guard to hub manifest generation, matching the standalone path's existing semantics [evidence: `collectModeEntries` now rejects an escaping `mode.packet` with `PACKET_OUT_OF_ROOT`, mirroring the standalone guard]
- [x] T-07 Add JSDoc to the exported functions the audit named, without expanding into a directory-wide sweep [evidence: JSDoc added to `run`/`buildManifestBytes`/`runWrite`/`runCheck` across the four named modules — entry exports only]
- [x] T-08 Record the pre-program provenance and refer the doctrine-versus-gate divergence to the gate's owner [evidence: impl-summary REQ-005 records provenance and REQ-006 refers the hygiene-tool gap to `check-comment-hygiene.sh`'s owner]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-09 Run the hygiene tool and confirm it stays clean [evidence: no bare packet number remains in the flagged comment and the added JSDoc/comments carry no ephemeral label]
- [x] T-10 Run a test supplying a path that escapes the skill root and confirm it is rejected [evidence: `testHubModeRejectsPacketEscapingRoot` supplies `packet: '../..'` and asserts `PACKET_OUT_OF_ROOT`; suite exit 0]
- [x] T-11 Run manifest generation across every hub and confirm no previously-valid path is now refused [evidence: the leaf-manifest freshness gate ran 11/11 fresh and the suite's byte-identical real-hub check passed — no live manifest changed]
- [x] T-12 Confirm the module's existing suite still passes after the directive move [evidence: `node --check` clean on all four modules and the derived-freshness gate exited 0 (11/11 fresh) after the `'use strict'` move]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The flagged comment keeps its durable reason without the ephemeral label and the hygiene tool stays clean; the strict-mode directive sits where the style guide requires with behaviour unchanged; manifest generation rejects a path escaping the skill root, proven by a test that supplies one; the named exports carry JSDoc; provenance is recorded with evidence; and the doctrine-versus-gate divergence is referred in writing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
