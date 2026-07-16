---
title: "Tasks: Real-World Usefulness Test Execution"
description: "Task list for setup, pilot, sandboxable matrix execution, analysis, synthesis, and deferred runtime cells."
trigger_phrases:
  - "real-world usefulness execution"
  - "026/007/012/001"
  - "usefulness synthesis"
importance_tier: "important"
contextType: "execution"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/008-real-world-usefulness-test-planning/002-sandbox-usefulness-trials"
    last_updated_at: "2026-05-06T04:35:32.335Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Completed local execution tasks and marked live-runtime tasks deferred"
    next_safe_action: "Review synthesis gaps or rerun deferred live runtime cells"
    blockers:
      - "Authenticated/networked external CLI runtimes unavailable in sandbox"
      - "Claude Code and OpenCode native live sessions unavailable from sandbox"
    key_files:
      - "tasks.md"
      - "trials/trial-log.jsonl"
      - "synthesis-report.md"
    session_dedup:
      fingerprint: "sha256:0260070120010260070120010260070120010260070120010260070120010260"
      session_id: "026-007-012-002-sandbox-usefulness-trials"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-approved for this execution packet."
---
# Tasks: Real-World Usefulness Test Execution

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

**Task Format**: `T### [P?] Description (file path or scenario id)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create Level 2 execution packet.
- [x] T002 Create `trials/raw/`, `trials/control/`, and `analysis/`.
- [x] T003 Create trial-log schema at `trials/trial-log.jsonl`.
- [x] T004 Update parent graph metadata with `002-sandbox-usefulness-trials`.
- [x] T005 Record automatable vs deferred matrix.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Pilot Tasks

- [x] T020 Run S-CG-01 pilot caller lookup.
- [x] T021 Run S-HK-01 pilot session-prime relevance check.
- [x] T022 Attempt S-PL-01 pilot external runtime smoke check and record blocked results.

### Scenario Tasks

- [x] T030 Execute S-CG-01 caller lookup trials.
- [x] T031 Execute S-CG-02 module touch-map trials.
- [x] T032 Execute S-CG-03 blast-radius preview trials.
- [x] T033 Execute S-CG-04 invariant trials.
- [x] T034 Execute S-HK-01 startup relevance trials.
- [x] T035 Execute S-HK-02 advisor routing corpus trials.
- [x] T036 Execute S-HK-03 Gate 3 classifier corpus trials.
- [B] T037 Execute S-HK-04 compaction recovery trials. Deferred: requires live compaction state.
- [B] T038 Execute S-PL-01 full runtime startup trials. Deferred after external smoke failures.
- [B] T039 Execute S-PL-02 memory retrieval runtime trials. Deferred after external smoke failures.
- [B] T040 Execute S-PL-03 external dispatch consistency trials. Deferred after external smoke failures.
- [x] T041 Execute S-PL-04 local advisor routing stand-in.

### Matrix Cell Tasks

- [x] T100 [P] Run S-CG-01/cli-codex-55-high (completed by sandbox-direct harness)
- [x] T101 [P] Run S-CG-02/cli-codex-55-high (completed by sandbox-direct harness)
- [x] T102 [P] Run S-CG-03/cli-codex-55-high (completed by sandbox-direct harness)
- [x] T103 [P] Run S-CG-04/cli-codex-55-high (completed by sandbox-direct harness)
- [x] T104 [P] Run S-HK-01/cli-codex-55-high (completed by sandbox-direct harness)
- [x] T105 [P] Run S-HK-02/cli-codex-55-high (completed by sandbox-direct harness)
- [x] T106 [P] Run S-HK-03/cli-codex-55-high (completed by sandbox-direct harness)
- [x] T107 [P] Run S-PL-04/cli-codex-55-high (completed by sandbox-direct harness)
- [B] T200 [P] Run S-CG-01/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T201 [P] Run S-CG-01/opencode-native (deferred: live/auth/network/runtime state unavailable)
- [B] T202 [P] Run S-CG-02/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T203 [P] Run S-CG-02/opencode-native (deferred: live/auth/network/runtime state unavailable)
- [B] T204 [P] Run S-CG-03/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T205 [P] Run S-CG-03/opencode-native (deferred: live/auth/network/runtime state unavailable)
- [B] T206 [P] Run S-CG-04/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T207 [P] Run S-CG-04/opencode-native (deferred: live/auth/network/runtime state unavailable)
- [B] T208 [P] Run S-CG-01/cli-gemini-31-pro (deferred: live/auth/network/runtime state unavailable)
- [B] T209 [P] Run S-CG-02/cli-gemini-31-pro (deferred: live/auth/network/runtime state unavailable)
- [B] T210 [P] Run S-CG-03/cli-claude-code-external (deferred: live/auth/network/runtime state unavailable)
- [B] T211 [P] Run S-CG-04/cli-copilot-default (deferred: live/auth/network/runtime state unavailable)
- [B] T212 [P] Run S-HK-01/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T213 [P] Run S-HK-01/cli-codex-54-medium (deferred: live/auth/network/runtime state unavailable)
- [B] T214 [P] Run S-HK-01/cli-copilot-default (deferred: live/auth/network/runtime state unavailable)
- [B] T215 [P] Run S-HK-01/cli-gemini-31-pro (deferred: live/auth/network/runtime state unavailable)
- [B] T216 [P] Run S-HK-01/cli-claude-code-external (deferred: live/auth/network/runtime state unavailable)
- [B] T217 [P] Run S-HK-01/opencode-native (deferred: live/auth/network/runtime state unavailable)
- [B] T218 [P] Run S-HK-02/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T219 [P] Run S-HK-02/cli-codex-54-medium (deferred: live/auth/network/runtime state unavailable)
- [B] T220 [P] Run S-HK-02/cli-copilot-default (deferred: live/auth/network/runtime state unavailable)
- [B] T221 [P] Run S-HK-02/cli-gemini-31-pro (deferred: live/auth/network/runtime state unavailable)
- [B] T222 [P] Run S-HK-02/cli-claude-code-external (deferred: live/auth/network/runtime state unavailable)
- [B] T223 [P] Run S-HK-02/opencode-native (deferred: live/auth/network/runtime state unavailable)
- [B] T224 [P] Run S-HK-03/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T225 [P] Run S-HK-03/cli-copilot-default (deferred: live/auth/network/runtime state unavailable)
- [B] T226 [P] Run S-HK-03/opencode-native (deferred: live/auth/network/runtime state unavailable)
- [B] T227 [P] Run S-HK-04/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T228 [P] Run S-HK-04/cli-codex-55-high (deferred: live/auth/network/runtime state unavailable)
- [B] T229 [P] Run S-HK-04/opencode-native (deferred: live/auth/network/runtime state unavailable)
- [B] T230 [P] Run S-PL-01/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T231 [P] Run S-PL-01/cli-codex-54-medium (deferred: live/auth/network/runtime state unavailable)
- [B] T232 [P] Run S-PL-01/cli-codex-55-high (deferred: live/auth/network/runtime state unavailable)
- [B] T233 [P] Run S-PL-01/cli-copilot-default (deferred: live/auth/network/runtime state unavailable)
- [B] T234 [P] Run S-PL-01/cli-gemini-31-pro (deferred: live/auth/network/runtime state unavailable)
- [B] T235 [P] Run S-PL-01/cli-claude-code-external (deferred: live/auth/network/runtime state unavailable)
- [B] T236 [P] Run S-PL-01/opencode-native (deferred: live/auth/network/runtime state unavailable)
- [B] T237 [P] Run S-PL-02/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T238 [P] Run S-PL-02/cli-codex-54-medium (deferred: live/auth/network/runtime state unavailable)
- [B] T239 [P] Run S-PL-02/cli-codex-55-high (deferred: live/auth/network/runtime state unavailable)
- [B] T240 [P] Run S-PL-02/cli-copilot-default (deferred: live/auth/network/runtime state unavailable)
- [B] T241 [P] Run S-PL-02/cli-gemini-31-pro (deferred: live/auth/network/runtime state unavailable)
- [B] T242 [P] Run S-PL-02/cli-claude-code-external (deferred: live/auth/network/runtime state unavailable)
- [B] T243 [P] Run S-PL-02/opencode-native (deferred: live/auth/network/runtime state unavailable)
- [B] T244 [P] Run S-PL-03/cli-codex-55-high (deferred: live/auth/network/runtime state unavailable)
- [B] T245 [P] Run S-PL-03/cli-copilot-default (deferred: live/auth/network/runtime state unavailable)
- [B] T246 [P] Run S-PL-03/cli-gemini-31-pro (deferred: live/auth/network/runtime state unavailable)
- [B] T247 [P] Run S-PL-03/cli-claude-code-external (deferred: live/auth/network/runtime state unavailable)
- [B] T248 [P] Run S-PL-04/claude-code-native (deferred: live/auth/network/runtime state unavailable)
- [B] T249 [P] Run S-PL-04/cli-codex-54-medium (deferred: live/auth/network/runtime state unavailable)
- [B] T250 [P] Run S-PL-04/cli-copilot-default (deferred: live/auth/network/runtime state unavailable)
- [B] T251 [P] Run S-PL-04/cli-gemini-31-pro (deferred: live/auth/network/runtime state unavailable)
- [B] T252 [P] Run S-PL-04/cli-claude-code-external (deferred: live/auth/network/runtime state unavailable)
- [B] T253 [P] Run S-PL-04/opencode-native (deferred: live/auth/network/runtime state unavailable)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T300 Capture baseline/control measurements for completed local scenarios.
- [x] T301 Capture quantitative metrics for completed trials.
- [x] T302 Capture qualitative relevance and usefulness scores.
- [x] T303 Aggregate metrics by scenario and CLI.
- [x] T304 Classify systems as useful, mixed, or overhead.
- [x] T305 Create file:line-cited improvement backlog.
- [x] T306 Write synthesis report.
- [x] T307 Update checklist with execution evidence.
- [x] T308 Update implementation summary.
- [x] T309 Run strict validation after final docs update. Evidence: `validate.sh --strict` exited 0 after final docs update.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Local automatable cells have trial-log rows and raw outputs.
- [x] Deferred cells have explicit reasons.
- [x] Analysis docs and synthesis report exist.
- [x] Strict validation exit 0 is recorded after the final validation command.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Trial Log**: See `trials/trial-log.jsonl`
- **Synthesis**: See `synthesis-report.md`
<!-- /ANCHOR:cross-refs -->
