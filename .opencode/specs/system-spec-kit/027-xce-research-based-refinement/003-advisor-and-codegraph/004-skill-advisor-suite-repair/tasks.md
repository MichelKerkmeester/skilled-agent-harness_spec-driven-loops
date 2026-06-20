---
title: "Tasks: Skill-advisor test-suite repair: fix pre-existing scorer/hook failures and align brief-assertion tests with the fable-5 governor"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks skill advisor repair"
  - "deep-loop merge test tasks"
  - "governor brief tasks"
  - "name"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/004-skill-advisor-suite-repair"
    last_updated_at: "2026-06-15T19:00:00Z"
    last_updated_by: "opus-agent"
    recent_action: "All tasks complete including second-pass settings-parity + symmetry-edge fixes"
    next_safe_action: "None — complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:dbc81cd48a3013ca376b086f211ac93eb541de2f4d29bef778bb71f85e7fbbff"
      session_id: "027-003-004-skill-advisor-suite-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Skill-advisor test-suite repair: fix pre-existing scorer/hook failures and align brief-assertion tests with the fable-5 governor

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

- [x] T001 Capture baseline `npx vitest run` (61 failed / 553 across 15 files)
- [x] T002 Confirm only `deep-loop-workflows` exists on disk; legacy deep-* skill dirs gone
- [x] T003 [P] Confirm the only working-tree source change is the verified `render.ts` governor
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Append governor line to renderer expected brief helper (tests/legacy/advisor-renderer.vitest.ts) + strip governor in the 480-char length check
- [x] T005 Append governor to brief-producer expected brief (tests/legacy/advisor-brief-producer.vitest.ts) + exclude governor suffix from AS10 token-cap check
- [x] T006 [P] Append governor to claude/codex hook + prompt-wrapper expected context (tests/hooks/*.vitest.ts)
- [x] T007 Repoint council fixture/assertion to merged id (tests/scorer/native-scorer.vitest.ts)
- [x] T008 [P] Repoint two `deep-ai-council` corpus labels to `deep-loop-workflows` (tests/scorer/fixtures/intent-prompt-corpus.ts)
- [x] T009 Re-baseline pythonCorrect/tsAlsoCorrect 61 to 62 (tests/parity/python-ts-parity.vitest.ts) and pythonCorrect/hookPreserved 61 to 62 (tests/legacy/advisor-corpus-parity.vitest.ts)
- [x] T010 Fix `_apply_deep_research_disambiguation` to target merged id (scripts/skill_advisor.py) + update SA-011/012 lookups (tests/python/test_skill_advisor.py)
- [x] T011 Add `workflow`, `design` to ALLOWED_CATEGORIES (scripts/skill_graph_compiler.py)
- [x] T012 Regenerate divergence ledger from current scorer output (tests/parity/fixtures/local-native-approved-divergences.json) + repoint cli-parity council row (tests/skill-advisor-cli-parity.vitest.ts)
- [x] T016 Retarget settings-parity SETTINGS_PATH to committed `.claude/settings.json`; relax only the absolute-anchor/pinned-node assertion to the portable `cd "${CLAUDE_PROJECT_DIR:-$PWD}"` + bare-node form; preserve all real-contract guards; update header comment (tests/hooks/settings-driven-invocation-parity.vitest.ts)
- [x] T017 [P] Add reciprocal `prerequisite_for: deep-loop-workflows` (.opencode/skills/deep-loop-runtime/graph-metadata.json)
- [x] T018 [P] Add reciprocal `prerequisite_for: mcp-figma` (.opencode/skills/mcp-code-mode/graph-metadata.json)
- [x] T019 [P] Add reciprocal `siblings: sk-prompt` (.opencode/skills/deep-loop-workflows/graph-metadata.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 `npm run build` exits 0
- [x] T014 Full `npx vitest run` re-run after first pass: 36 failed / 553
- [x] T020 `skill_graph_compiler.py --validate-only` exits 0, VALIDATION PASSED, no SYMMETRY warnings
- [x] T021 Final full `npx vitest run`: 0 failed / 548 passed / 5 skipped (553)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All in-scope tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Build clean + full suite green (0 failed / 553)
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
