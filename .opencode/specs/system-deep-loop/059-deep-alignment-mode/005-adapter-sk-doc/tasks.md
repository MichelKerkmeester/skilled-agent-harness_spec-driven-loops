---
title: "Tasks: Phase 5: adapter-sk-doc"
description: "Pending tasks for planning the sk-doc reference adapter: standardSource wiring, verify-first check(), the known-deviation suppression list, and discover()."
trigger_phrases:
  - "sk-doc adapter tasks"
  - "alignment reference adapter tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/005-adapter-sk-doc"
    last_updated_at: "2026-07-11T14:16:14Z"
    last_updated_by: "claude"
    recent_action: "All 12 tasks executed and verified; T006-T012 unblocked once 004 landed concurrently"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_adapter.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-adapter-sk-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: adapter-sk-doc

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `.opencode/skills/sk-doc/scripts/validate_document.py` in full for its CLI contract and exit-code semantics. Evidence: `.opencode/skills/sk-doc/scripts/validate_document.py:1-929` read in full; exit codes cited at `validate_document.py:18-20`.
- [x] T002 [P] Read `.opencode/skills/sk-doc/scripts/extract_structure.py` in full for its DQI scoring and document-type detection. Evidence: `.opencode/skills/sk-doc/scripts/extract_structure.py:1-1257` read in full; DQI formula cited at `extract_structure.py:940-951`.
- [x] T003 [P] Read `.opencode/skills/sk-doc/shared/references/core_standards.md` for filename conventions and document-type detection. Evidence: `.opencode/skills/sk-doc/shared/references/core_standards.md:1-332` read in full; cited in `sk_doc_adapter.md` §3's Classifier Provenance.
- [x] T004 [P] Read `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md` and `iteration-002.md` for the real known-deviation findings. Evidence: both files read in full; `iteration-001.md:14` and `iteration-002.md:116,42,57` cited across `sk_doc_known_deviations.md` and `sk_doc_adapter.md`.
- [x] T005 Re-read phase 004's finalized `discover(scope)->artifacts` contract signature. Evidence: `.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md` (landed concurrently during this phase's build) read in full; `sk-doc.cjs`'s `discover()` corrected against it — see `sk_doc_adapter.md` §1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Author `deep-alignment/references/adapters/sk_doc_adapter.md` with the `standardSource`/`check`/`discover` specification. Evidence: `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_adapter.md` (10 sections, created).
- [x] T007 Author `deep-alignment/references/adapters/sk_doc_known_deviations.md` seeded with the four real findings plus the changelog convention. Evidence: `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md` (5 entries: 4 from `iteration-001.md:14` plus the changelog convention, each with citable evidence and an independent live-reality re-check).
- [x] T008 Implement the adapter wiring script that shells out to `validate_document.py --json` and `extract_structure.py`. Evidence: `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs:runValidateDocument()`,`runExtractStructure()`,`checkTemplateConformance()`; live-verified via `node .../sk-doc.cjs check <real-file-path>`.
- [x] T009 Implement `discover()` for the `docs`/`sk-doc` lane. Evidence: `sk-doc.cjs:discover()`,`discoverPaths()`,`discoverGlobs()`; live-verified via `node .../sk-doc.cjs discover <path>` and `node .../sk-doc.cjs discover --glob '<pattern>'` against real repo directories.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Dry-run the adapter against a known corpus and confirm it reproduces the 130-packet's real findings, minus the four suppressed deviations. Evidence: ran `sk-doc.cjs check` against `.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-cli/README.md` (the real R1-P0-001 file, part of the `mcp-tooling` corpus this task names). The original finding no longer reproduces (the file's own DQI is now 90, up from 42 at review time — independently fixed since); the adapter instead correctly surfaced a new, real, currently-live `validate_document.py` defect (`sk_doc_adapter.md` §8) as a `P1 could-not-validate` finding rather than a false positive or a crash.
- [x] T011 Confirm the adapter never asserts a reality-drift finding without first re-running the relevant validator (VERIFY-FIRST). Evidence: live `node -e` fixture with 3 synthetic `verifiedClaims` (matched / contradicted-with-evidence / contradicted-without-evidence) produced exactly 1 finding — the only claim carrying both a contradiction and cited `reprobeEvidence`.
- [x] T012 Confirm the adapter's `discover()`/`check()` signatures match phase 004's contract exactly. Evidence: re-diffed against the real `discover_contract.md` once it landed; found and corrected a real drift (scope shape, output shape); re-verified with `node --check` (clean) and live CLI dry-runs (paths, globs, branchRange, malformed-scope error path) after the correction.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — see Phase 3 evidence above and `implementation-summary.md` Verification table
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
