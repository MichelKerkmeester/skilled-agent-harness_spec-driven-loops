---
title: "Tasks: Drop DeepSeek API provider, V4 Pro, and GPT-5.6 Terra"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "drop deepseek api pro terra"
  - "remove deepseek provider roster"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/056-roster-drop-deepseek-api-pro-terra"
    last_updated_at: "2026-08-29T10:35:00Z"
    last_updated_by: "pi"
    recent_action: "All tasks complete; 205/205 unit tests green; grep gates pass"
    next_safe_action: "None — validated --strict"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-056-roster-drop-deepseek-api-pro-terra"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Drop DeepSeek API provider, V4 Pro, and GPT-5.6 Terra

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

- [x] T001 `PI_SUPPORTED_MODELS` −2 ids, `PI_DEFAULT_MODEL` → `deepseek-v4-flash` [evidence: `sed -n '182,211p' .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` capture lists 11 ids + `PI_DEFAULT_MODEL ... 'deepseek-v4-flash'`]
- [x] T002 `fanout-run.cjs`: `PI_ALLOWED_MODELS` −2, default swap, `PI_MODEL_PROVIDERS` −2 entries, comment refresh [evidence: `node --check .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` exit 0]
- [x] T003 Guard tests updated + suites green [evidence: `npx vitest run` (in `.opencode/skills/system-deep-loop/runtime/`) reports 205 passed / 0 failed, re-run after the final map fix]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### cli-pi

- [x] T101 Roster retirement + example repoint + version bump [evidence: `grep -rn "deepseek-v4-pro\|5\.6-terra" .opencode/skills/cli-external-orchestration/cli-pi --include="*.md"` (minus changelog/benchmark) returns only the intentional PI-023 retired-note; `grep -rn "provider deepseek\b\|deepseek/deepseek-v4-pro" …` returns zero hits]
- [x] T102 Add `cli-pi/changelog/v1.4.1.0.md` [evidence: file `.opencode/skills/cli-external-orchestration/cli-pi/changelog/v1.4.1.0.md` exists; its Verification section records the unit-test run + grep gates]
- [x] T103 Playbook expectations updated (smoke 11 ids + repaired stale sed range 153,174 → 182,211 with fresh capture; cline id-format Pro retired) [evidence: `sed -n '182,211p' .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` lists 11 ids; PI-023 Expected Signals column updated in `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md`]

### cli-opencode

- [x] T201 Roster + §3/§4/§5 defaults rework + version bump [evidence: `grep -rn "deepseek-v4-pro\|5\.6-terra" .opencode/skills/cli-external-orchestration/cli-opencode --include="*.md"` (minus changelog/benchmark) returns only intentional retired-notes / incident history]
- [x] T202 SKILL/README pre-flight rekey to opencode-go [evidence: `OPENCODE_GO_OK` replaces `DEEPSEEK_OK` in `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` §4 pre-flight script + decision table]
- [x] T203 Mechanical default swap across references/assets [evidence: `grep -rn "deepseek/deepseek-v4-pro" .opencode/skills/cli-external-orchestration/cli-opencode --include="*.md"` minus changelog/benchmark returns zero hits]
- [x] T204 CO-011 retired, feature file deleted, index/coverage/wave plan updated [evidence: file `.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/multi-provider/deepseek-direct-api.md` removed; `.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md` marks CO-011 RETIRED at the inventory + Wave-2 lines]
- [x] T205 Add `cli-opencode/changelog/v1.4.3.0.md` [evidence: file `.opencode/skills/cli-external-orchestration/cli-opencode/changelog/v1.4.3.0.md` exists; SKILL.md version frontmatter moved from 1.4.2.0 to 1.4.3.0]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T301 Grep gates 1–3 pass [evidence: `grep -rn "deepseek-v4-pro\|5\.6-terra" .opencode/skills/cli-external-orchestration/{cli-pi,cli-opencode} --include='*.md'` (minus changelog/benchmark) returns 6 intentional retired-notes / incident-history hits and zero live dispatch shapes; `grep -rn "provider deepseek\b\|deepseek/deepseek-v4-pro" …` returns zero hits; `grep -n "deepseek-v4-pro\|gpt-5.6-terra" .opencode/skills/system-deep-loop/runtime/{lib/deep-loop/executor-config.ts,scripts/fanout-run.cjs}` minus the DEVIN allowlist returns zero residue]
- [x] T302 Unit tests re-run green [evidence: 205/205]
- [x] T303 `validate.sh --strict` + no-stray-files sweep [evidence: RESULT PASSED, git status clean of temp artifacts]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks checked with observed evidence
- [x] Roster docs, playbooks, and enforcement agree on the 11-id pi roster and the `opencode-go/deepseek-v4-flash --variant max` opencode default
- [x] `validate.sh --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` §4 Requirements
- Plan: `plan.md` §4 Implementation Phases
- Checklist: `checklist.md`
- Summary: `implementation-summary.md` §5 Verification
<!-- /ANCHOR:cross-refs -->
