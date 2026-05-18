---
title: "Task Breakdown: system-code-graph deferred follow-on (039)"
description: "Atomic Phase 0-4 tasks for closing 038 deferred items + 037 P2 batch."
trigger_phrases:
  - "039 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/039-system-code-graph-deferred-followon"
    last_updated_at: "2026-05-15T18:05:00Z"
    last_updated_by: "claude-opus-4-7-039-scaffold"
    recent_action: "tasks_authored"
    next_safe_action: "await_user_dispatch_authorization"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-039-deferred-followon"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: 039 Deferred Follow-on

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[S]` | Sequential (must wait for predecessor) |
| `[B]` | Blocked (waiting on dependency) |

**Task format**: `T#.# [marker] Description (file path) — evidence`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

(Verification sweep — re-checks every 037 finding against current main HEAD before remediation begins. Aliased as "Phase 0" in plan.md for narrative continuity with packet 038.)

| ID | Status | Task | Evidence anchor |
|----|--------|------|-----------------|
| T0.1 | [ ] | Re-check P1-A4 — read `feature_catalog/feature_catalog.md` head + sample 2 per-feature files; mark STILL-OPEN or CLOSED-BY-PARALLEL after `058/4*` commits. | 037 review-report.md P1-A4 + verification-addendum.md P1-A4 row |
| T0.2 | [ ] | Re-check P1-A5 — `grep -n "scenario 024\|scenario 016" manual_testing_playbook/manual_testing_playbook.md`; check Devin scenario length. | 037 P1-A5 + verification-addendum.md P1-A5 |
| T0.3 | [ ] | Re-check P1-D1 — `ls mcp_server/tests/runtime-detection.vitest.ts` + `ls mcp_server/tests/exclude-rule-classifier.vitest.ts`. | verification-addendum.md P1-D1 (2 modules, not 4) |
| T0.4 | [ ] | Re-check P1-D2 — verify `mcp_server/stress_test/code-graph/deep-loop-{crud,graph-convergence}-stress.vitest.ts` deletion is intentional or needs move-to-sibling. | parallel agent already deleted (see git status) |
| T0.5 | [ ] | Re-check P1-D3 — `grep -n "it.skip" mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts`. | verification-addendum.md P1-D3 |
| T0.6 | [ ] | Re-check P1-F1 — `jq '.scripts' .opencode/skills/system-code-graph/package.json`; verify gitignore line. | verification-addendum.md P1-F1 |
| T0.7 | [ ] | Re-check P1-F2 — `wc -c mcp_server/dist/index.js`. | verification-addendum.md P1-F2 (drop node_modules claim) |
| T0.8 | [ ] | Re-check P1-G1 — `grep -A 8 "diagnose_mk_code_index" .opencode/commands/doctor/scripts/mcp-doctor.sh \| grep -i mkdir`. | verification-addendum.md P1-G1 |
| T0.9 | [ ] | Re-check P1-H1 — `rg "SPECKIT_CODE_GRAPH_INDEX_" .claude/mcp.json .codex/config.toml .devin/config.json .gemini/settings.json .vscode/mcp.json opencode.json`. | verification-addendum.md P1-H1 |
| T0.10 | [ ] | Re-check P1-H2 — `rg "_NOTE_1_TOOLS\|_NOTE_1_DB" .claude/mcp.json .gemini/settings.json`. | verification-addendum.md P1-H2 |
| T0.11 | [ ] | Re-check P1-H3 — `jq '.servers."mk-spec-memory".env._NOTE_AUTO_MIGRATION' .vscode/mcp.json`. | verification-addendum.md P1-H3 |
| T0.12 | [ ] | Compile STILL-OPEN list; record CLOSED-BY-PARALLEL items with commit SHA evidence; build the actionable Phase 1-3 task list. | this file |

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

(Build + test infra + config parity + doctor + P2 batch — combined into a single implementation phase per the L2 manifest. Aliased as "Phase 1+2+3" in plan.md.)

### Sub-phase: Build + Test Infra

| ID | Status | Task | Evidence anchor |
|----|--------|------|-----------------|
| T1.1 | [ ] [S] | Open Question 1 decision: track `package.json` or leave gitignored? Default = track. Update `.opencode/.gitignore` if needed. | spec.md §7 Q1 |
| T1.2 | [ ] [S after T1.1] | Commit `package.json` with `scripts: { build, typecheck, test, test:watch, clean, rebuild }` block. | P1-F1 |
| T1.3 | [ ] [S after T1.2] | Run `npm install && npm run build` from `.opencode/skills/system-code-graph/`; verify `wc -c mcp_server/dist/index.js > 1000`. | P1-F2 |
| T1.4 | [ ] [P with T1.5, T1.6] | NEW `mcp_server/tests/runtime-detection.vitest.ts` covering `lib/runtime-detection.ts` branches + env parsing + hook policy edges (≥80% branch coverage; ≥15 test cases). | P1-D1 |
| T1.5 | [ ] [P with T1.4, T1.6] | NEW `mcp_server/tests/exclude-rule-classifier.vitest.ts` covering `lib/exclude-rule-classifier.ts` schema + tier + pattern loading + errors (≥80% branch coverage; ≥15 test cases). | P1-D1 |
| T1.6 | [ ] [P with T1.4, T1.5] | Restore or document-as-skipped the 2 `it.skip` tests in `mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:125, :184`. | P1-D3 |
| T1.7 | [ ] [S after T1.4-T1.6] | Full vitest suite: `npx vitest run` from `mcp_server/` — must exit 0. | quality gate |

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 2 — Config Parity + Doctor

| ID | Status | Task | Evidence anchor |
|----|--------|------|-----------------|
| T2.1 | [ ] [S] | Align `SPECKIT_CODE_GRAPH_INDEX_*` defaults to `"false"` in `opencode.json`, `.claude/mcp.json`, `.gemini/settings.json` (5 flags × 3 files = 15 edits). Verify the other 3 configs already have `"false"`. | P1-H1 |
| T2.2 | [ ] [S after T2.1] | `.claude/mcp.json` + `.gemini/settings.json`: rename `_NOTE_1_TOOLS` → `_NOTE_2_TOOLS`, prepend `_NOTE_1_DB` per canonical opencode.json shape. | P1-H2 |
| T2.3 | [ ] [S after T2.2] | `.vscode/mcp.json`: add `_NOTE_AUTO_MIGRATION` to mk-spec-memory env block matching the other 5 configs. | P1-H3 |
| T2.4 | [ ] [S after T2.3] | `.opencode/commands/doctor/scripts/mcp-doctor.sh` `diagnose_mk_code_index` fix-mode branch: add `mkdir -p "$db_dir"` (matches `doctor_mcp_debug.yaml:150-152` repair_action). | P1-G1 |
| T2.5 | [ ] [S after T2.4] | Validate all 6 configs: `for f in opencode.json .claude/mcp.json .codex/config.toml .devin/config.json .gemini/settings.json .vscode/mcp.json; do echo "$f"; done` + JSON/TOML syntax check. | quality gate |

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Phase 3: Verification

(v1.0.2.0 ship — final validate + changelog + commit. Aliased as "Phase 4" in plan.md.)

### P2 Batch Triage (cap at 10)

| ID | Status | Task |
|----|--------|------|
| T3.1 | [ ] | Extract P2 findings from `037/.../review/iterations/iteration-001..020.md` per-iteration P2 sections. |
| T3.2 | [ ] | Rank by impact (operator-pain + framework-correctness); pick top 10. |
| T3.3..T3.12 | [ ] | 10 individual P2 remediations (file by file). |
| T3.13 | [ ] | Author `scratch/p2-deferral.md` listing remaining ~20 P2s with rationale (defer to 040 if pursued). |

### Ship v1.0.2.0

| ID | Status | Task |
|----|--------|------|
| T4.1 | [ ] | Author `.opencode/skills/system-code-graph/changelog/v1.0.2.0.md` with HONEST scope. |
| T4.2 | [ ] | Bump SKILL.md version `1.0.1.x` → `1.0.2.0` if parallel agent hasn't already. |
| T4.3 | [ ] | Strict validate: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <039> --strict` exits 0. |
| T4.4 | [ ] | Full repo-level `npx tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json` + `npx vitest run` clean. |
| T4.5 | [ ] | Final commit on main; push to origin. |

---

## Completion Criteria

- All Phase 1 (Setup) verification entries marked with STILL-OPEN / CLOSED-BY-PARALLEL / REVISED status + commit SHA evidence.
- All Phase 2 (Implementation) tasks marked `[x]` with file paths or commit SHAs.
- All Phase 3 (Verification) tasks marked `[x]` with `bash validate.sh --strict` exit 0 + `vitest run` exit 0 + `tsc --noEmit` exit 0 evidence.
- Final commit on main; pushed to origin.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Plan**: `plan.md` — phased rollout
- **Checklist**: `checklist.md` — verification gates
- **Source findings**: `037/review/review-report.md` + `037/review/verification-addendum.md`
- **Parent remediation**: `038-system-code-graph-deep-review-remediation/spec.md`

<!-- /ANCHOR:cross-refs -->
