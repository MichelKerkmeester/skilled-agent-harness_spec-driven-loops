---
title: "Tasks: code-opencode Language-Slice Intent Gate"
description: "Task breakdown for the code-opencode per-language intent split and parent mirror."
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/005-code-opencode-language-gate"
    last_updated_at: "2026-07-09T10:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All 7 tasks executed with evidence"
    next_safe_action: "Commit code + packet"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: code-opencode Language-Slice Intent Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` done · `[ ]` pending. Evidence is captured inline and in `checklist.md`.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Capture before baselines — code-opencode child (PASS 84) and sk-code hub (PASS 85).
- [x] Record per-scenario routed counts before the split (ts 18 / py 14 / shell 14).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Split code-opencode `INTENT_SIGNALS` `LANGUAGE_STANDARDS` → JAVASCRIPT/TYPESCRIPT/PYTHON/SHELL.
- [x] Split code-opencode `RESOURCE_MAP` `LANGUAGE_STANDARDS` → four per-language trios.
- [x] Mirror the parent `smart_routing.md` machine block (RESOURCE_MAP move + INTENT_SIGNALS add).
- [x] Update the three `01--language-standards` scenarios' `expected_intent`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] Run the three drift guards — 20/20 pass.
- [x] Re-benchmark child (84→87) and hub (85→85, no regression).
- [x] Confirm each language scenario routes exactly its trio (gold-lang-match 3/3).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All Phase 1–3 tasks done with evidence; `checklist.md` fully checked; `validate.sh --strict` clean.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Diagnosis: `../004-cross-skill-routing-sweep/assets/code-opencode-language-split-design.md`
- Guards: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/`
<!-- /ANCHOR:cross-refs -->
