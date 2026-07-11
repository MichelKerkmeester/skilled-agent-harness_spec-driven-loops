---
title: "Tasks: Phase 7: adapter-sk-code"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 007"
  - "adapter sk-code"
  - "surface detection"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/007-adapter-sk-code"
    last_updated_at: "2026-07-11T14:56:54Z"
    last_updated_by: "claude"
    recent_action: "All 14 tasks executed and CLI-verified"
    next_safe_action: "Wire adapter into phase 008 ITERATE/CONVERGE loop"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "006 dependency was not load-bearing -- each adapter is authority-independent per ADR-003, so 007 built without waiting on 006"
---
# Tasks: Phase 7: adapter-sk-code

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm phase 005 adapter contract signature is available. Read `sk_doc_adapter.md`/`sk-doc.cjs` in full; matched file shape in `sk-code.cjs`.
- [x] T002 Re-read `.opencode/skills/sk-code/shared/references/smart_routing.md` and `stack_detection.md` for currency. Both read in full 2026-07-11; ported into `classifySurface()`.
- [x] T003 [P] Re-read `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py` CLI contract and Finding shape for currency. Read in full; `--root` confirmed directory-only, no `--json` flag, print format at lines 534-537.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- 006 dependency was not load-bearing: each adapter authority is independent per ADR-003 (discover/standardSource/check never branch on another authority's state), so this phase built without waiting on 006's own adapters landing. -->

- [x] T004 Implement `discover(scope)` calling the shared sk-code surface router (`scripts/adapters/sk-code.cjs` Section 4; CLI-verified against real directories)
- [x] T005 Implement `standardSource(authority)` loading surface-appropriate reference sets (`sk-code.cjs` Section 6; CLI-verified, output in `sk_code_adapter.md` §2)
- [x] T006 Implement `check()` layer 1 deterministic pass invoking `verify_alignment_drift.py` for OPENCODE surface (`sk-code.cjs` §8.1; 6 live dry-runs, `sk_code_adapter.md` §8.4)
- [x] T007 Implement `check()` layer 1 deterministic pass invoking the Webflow minification/verification script chain for WEBFLOW surface (`sk-code.cjs` §8.2; `minify-webflow.mjs` excluded — real, documented deviation, mutates the tree — `sk_code_adapter.md` §4.1.2)
- [x] T008 Implement `check()` layer 2 reasoning-agent pass with evidence citation and layer tagging (`sk-code.cjs` §9; `buildReasoningLayerDispatch()` + `checkPatternConformance()`, 3 live `node -e` tests confirm the VERIFY-FIRST pass-through, `plan.md` Phase 3)
- [x] T009 Author the accepted-deviation set seeded from `verify_alignment_drift.py`'s skip-path allowlist functions (`sk_code_known_deviations.md`, 6 entries: 4 from the tool's real functions, 2 the build itself found and verified live)
- [x] T010 Write the honest automatability-limits statement into adapter documentation, providing the evidence-cited deterministic-vs-reasoning split for ADR-008's LOCKED HYBRID decision (`sk_code_adapter.md` Section 9)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Dry-run layer 1 against a known OPENCODE-surface file; confirm findings translate with `layer: deterministic`. `check()` against `sk-doc.cjs` → `[]`, consistent with a standalone tool dry-run of the same directory.
- [x] T012 Dry-run layer 2 against a file with an intentional pattern deviation; confirm file:line evidence and `layer: reasoning-agent` tag. Layer 2 cannot self-judge a deviation (ADR-008's whole point) — verified the pass-through contract instead via 3 live `node -e` calls (with-evidence emits; without-evidence and non-contradiction both correctly emit nothing).
- [x] T013 Confirm `surface-undetected` reporting on `UNKNOWN` detection instead of a guessed surface. `check('somewhere/generic/file.ts')` → one `P1 surface-undetected` finding.
- [x] T014 Update `checklist.md` with evidence for each verified item. Done in this same pass.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — `node --check` clean; `discover`/`check`/`standard-source`/`reasoning-dispatch` CLI subcommands all exercised against real repo files (transcripts in `sk_code_adapter.md` Section 8)
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
