---
title: "Tasks: Red-Team Probe Gate [system-spec-kit/028-memory-search-intelligence/001-speckit-memory/006-redteam-probe-gate/tasks]"
description: "Task Format: T### [P?] Description (file path). All tasks PENDING, neither candidate shipped in the Wave-0 030 record."
trigger_phrases:
  - "red-team probe gate tasks"
  - "memory injection ci gate tasks"
  - "prompt-pack render probe task"
  - "exfil audit no querytext task"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/006-redteam-probe-gate"
    last_updated_at: "2026-06-19T07:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level 2 task breakdown for the red-team probe gate"
    next_safe_action: "Operator review before any gate implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-redteam-probe-gate-replan-2026-06-19"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Tasks: Red-Team Probe Gate

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

> **Candidate status:** `M-redteam-probe-gate` is implemented for the Spec-Kit Memory MCP server seams and `M-exfil-audit-no-querytext` is implemented in governance audit persistence. The sibling deep-loop prompt-pack probe remains pending because this turn was scoped to `.opencode/skills/system-spec-kit/mcp_server`.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the live per-seam sanitizer surfaces: `sanitizeSkillLabel` (`lib/utils/skill-label-sanitizer.ts`), `architecture-seam.vitest.ts`, `bm25-security.vitest.ts`, `tests/security/adversarial-unicode.vitest.ts`, fixtures `tests/advisor-fixtures/{promptPoisoningAdversarial,unicodeInstructionalSkillLabel}.json`
- [x] T002 Confirm the namespace-denial audit GAP and locate the wiring point (`rg 'namespace_denied|audit|denial'`). Record that `spec-folder-mutex.ts` is a TOCTOU lock, not an Authorizer
- [x] T003 Decide C8/SB8 sequencing: escaper-first vs gate-lands-red-as-acceptance-test. Capture the decision in the checklist

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the named gate aggregator with a zero-success ceiling and a structured per-probe report (`mcp_server/tests/security/redteam-probe-gate.vitest.ts`), REQ-001, REQ-002, REQ-008
- [x] T005 [P] Add the poisoned-RAG family: `memory_save` untrusted content → recall (full + compact) → assert markers neutralized at render (`mcp_server/tests/security/redteam-probe-gate.vitest.ts`), REQ-003, REQ-009
- [x] T006 [P] Add the query-only-injection family aggregating the `'ignore previous instructions' → null` assertion (`mcp_server/tests/security/redteam-probe-gate.vitest.ts`), REQ-004
- [x] T007 [P] Add the wrapper-breakout family reusing the unicode-instructional / nested-tag surfaces (`mcp_server/tests/security/redteam-probe-gate.vitest.ts`), REQ-005
- [x] T008 Add per-family fixtures, extending the existing poisoning/unicode fixtures (`mcp_server/tests/security/redteam-fixtures/`)
- [ ] T009 [B] Author the deep-loop prompt-pack render probe at the renderer unit (`deep-loop-runtime/tests/unit/prompt-pack-injection.vitest.ts`), REQ-006. Left pending: outside the requested MCP-server implementation surface. Renderer still requires sibling-runtime work.
- [x] T010 Wire the no-querytext exfil-audit: record a denial event with no verbatim query text + a gate assertion that the stored audit record contains no query (namespace-denial audit path, `mcp_server/tests/security/redteam-probe-gate.vitest.ts`), REQ-007
- [x] T011 Add the `run-tests.mjs` security lane selector so the gate runs as one named group (`mcp_server/scripts/run-tests.mjs`), REQ-001
- [x] T012 Add the negative control (no-op payload must not false-pass), REQ-010 edge case

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the gate as one group. Confirm zero-success ceiling fails on any probe success and the structured report names the broken seam
- [x] T014 Confirm both recall shapes (full + compact) and the negative control pass, REQ-009
- [x] T015 `tsc`/build green + existing suite green vs the pre-gate baseline (capture baseline first), SC-004, REQ-010
- [x] T016 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/006-redteam-probe-gate --strict` green
- [ ] T017 Adversarial review of the gate (independent seat tries to find a probe-bypass or a false-green), left pending: no separate reviewer seat was run

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, pending T009/T017
- [ ] No `[B]` blocked tasks remaining, T009 remains blocked by sibling-runtime scope
- [ ] Manual + automated verification passed. `validate.sh --strict` green. Impl-summary authored

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
