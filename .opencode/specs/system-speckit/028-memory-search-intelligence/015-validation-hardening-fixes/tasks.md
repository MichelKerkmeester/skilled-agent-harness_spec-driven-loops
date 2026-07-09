---
title: "Tasks: Validation-Hardening Tooling Fixes — Evidence Substance, Status Classifier, Freshness Baseline"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "validation hardening fixes tasks"
  - "evidence substance checker tasks"
  - "status classifier tasks"
  - "freshness sweep baseline tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-validation-hardening-fixes"
    last_updated_at: "2026-07-09T17:50:14.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented F6/F7/F9/F10; T001-T022 done, validate.sh --strict PASSED"
    next_safe_action: "Review 010 scaffold-marker + 83-folder findings, then commit (T023)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-015-validation-hardening-fixes"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Validation-Hardening Tooling Fixes — Evidence Substance, Status Classifier, Freshness Baseline

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Decided paired cross-reference comments (not a shared literal list): matches spec.md §7's "existing bash/TypeScript-duplication precedent" and the plan's Out-of-Scope bar on new shared-config-loading tooling. Comments added at status-classifier.sh:36 and strict-pass-freshness.ts's classifyStatus() naming each other.
- [x] T002 Wrote and ran 4 fixture lines against `check-evidence.sh:31-77` covering the bare-filename loophole, a legitimate filename:linenum line, a substantive deferred-reason line, and a placeholder-only deferred line; codified as the permanent vitest case at `tests/validation-gate-hardening.vitest.ts:219`.
- [x] T003 Decided an unconditional bypass beyond the existing trivial-placeholder case-statement at `check-evidence.sh:41-45` (no new minimum-length floor) — matches spec.md's own risk mitigation text verbatim. Verified via the T002 fixtures at `tests/validation-gate-hardening.vitest.ts:219`: placeholder-only deferred still fails, substantive deferred now passes.
- [x] T004 [P] `rg -n "'regression'|\"regression\"" .opencode/skills/system-spec-kit/scripts .github/workflows` returns 3 hits, all inside `strict-pass-freshness.ts` itself (type union, `regression` literal, `.filter()`); zero hits in `.github/workflows/`. No external consumer needs a T012 update.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**F7 + F9 — status-classifier.sh / strict-pass-freshness.ts (highest priority — confirmed live, see spec.md F7):**
- [x] T005 Added `implemented`/`implementing` to `status-classifier.sh` as its own guarded if-block (not the shared complete-bucket line) [EVIDENCE: `classify_status "Implemented"` → `complete`, confirmed via direct sourcing]. IMPLEMENTATION CORRECTION beyond the plan's literal text (not deferred, not scope creep — same function REQ-003 already authorizes): the naive single-word addition collided with the pre-existing `not implemented` phrase already owned by the `planned` bucket — `classify_status "Not Implemented"` regressed to `complete`, confirmed live against real packets (`system-skill-advisor/008-skill-advisor-cli/*/spec.md`, `z_future/code-graph-and-cocoindex/002-code-graph-trace/*/implementation-summary.md`). Bash has no lookbehind, so added a second guarded check requiring `implemented`/`implementing` NOT be preceded by `not (yet )`. Re-verified `not implemented` → `planned` after the guard; see spec.md's Key Decisions / implementation-summary.md for full detail.
- [x] T006 Added the byte-equivalent word plus the same collision guard to `classifyStatus()` in `strict-pass-freshness.ts` (originally line 97, now ~line 105). Verified byte-identical output to the bash version across 17 test strings via a standalone node script.
- [x] T007 Added cross-reference comments naming the sibling file at `status-classifier.sh:36,53,59` and `strict-pass-freshness.ts:99`, per the T001 decision; presence confirmed via `grep -n "Cross-reference" status-classifier.sh strict-pass-freshness.ts` returning 4 matches.

**F6 — check-evidence.sh:**
- [x] T008 Removed the bare-filename-without-context match entirely from `evidence_item_has_substance()` (was `check-evidence.sh:49`); filename:linenum (line 46, now line ~58) and all other shape checks are untouched.
- [x] T009 Captured the matched bracket keyword via a `grep -Eo '\[(evidence|deferred):'` probe and added a `deferred` bypass immediately after the length gate, before the shape checks, per the T003 decision (`check-evidence.sh:36-56`).

**F10 — strict-pass-freshness.ts:**
- [x] T010 Replaced the single `wasBaselinePass` boolean in `runValidate()` with an explicit `hasBaseline = baselinePasses.size > 0` check; `'regression'` now requires `hasBaseline && wasBaselinePass` (`strict-pass-freshness.ts:172-199`).
- [x] T011 Added `'first-run'` to the `SweepResult.status` union, a `firstRun` count in the JSON payload, and the text-mode summary line.
- [x] T012 N/A — T004's inventory found zero external consumers of the status union outside `strict-pass-freshness.ts` itself.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**F7 + F9 verification (highest priority, confirmed live — verify first):**
- [x] T013 [P] Re-ran `validate.sh --strict` on `006-presentation-layer-fixes`: `STATUS_CROSS_DOC_CONSISTENCY` now reads "spec.md Status 'Implemented, with broad-suite caveat...' and implementation-summary.md Status 'Implemented with broad-suite caveat' both classify as complete" — the "not applicable" skip is gone.
- [x] T014 [P] Re-ran `validate.sh --strict` on `010-query-channel-calibration`: same confirmation, both sides classify `complete`, "not applicable" skip gone. This same re-run ALSO surfaced a new, real `SCAFFOLD_NEVER_TOUCHED` failure — see T016.
- [x] T015 REQ-006 reconciliation: both packets show clean agreement (`STATUS_CROSS_DOC_CONSISTENCY` reports both sides classify `complete` for each), zero mismatch surfaced. No docs edit needed; recording the clean-agreement outcome explicitly here per REQ-006's own instruction for the no-mismatch case.
- [x] T016 Audited `check-scaffold-never-touched.sh`: it DOES call `classify_status` directly (`check-scaffold-never-touched.sh:45`), contradicting the plan's speculative parenthetical that it uses a raw string match — the plan itself flagged this as "confirm during implementation rather than assuming." Confirmed result: `006-presentation-layer-fixes` still passes cleanly (`No scaffold-signature markers found`). `010-query-channel-calibration` now FAILS with `Found 4 scaffold-signature marker(s) in Complete spec folder` — `plan.md:2`, `tasks.md:2`, `implementation-summary.md:2`, `checklist.md:2` all still carry literal `[template:level_2/...]` text in their frontmatter `title` fields, a real pre-existing scaffold-cleanup gap in 010's own docs that F7's classifier bug was masking (010 was never classified `complete` before, so this gate always early-exited). NOT fixed here — out of this packet's Files-to-Change scope (only `spec.md`/`implementation-summary.md` are conditionally authorized, only for REQ-006's Status field, not `plan.md`/`tasks.md`/`checklist.md` frontmatter titles). Flagged for operator decision / a follow-up packet; see implementation-summary.md.

**F6 verification:**
- [x] T017 Ran the T002 fixtures against the updated `evidence_item_has_substance()`: all 4 expected outcomes confirmed (bare filename now fails, filename:linenum still passes, non-trivial DEFERRED now passes, trivial DEFERRED still fails).
- [x] T018 [P] Re-ran the real `EVIDENCE_CITED` rule (sourced directly, not simulated) against every folder in the repo carrying a `checklist.md`/`tasks.md` (2,121 folders) before and after the fix. Result: 83 folders flip `pass`→`warn` (0 flip the other way in this corpus). Manually + pattern-audited the flipped items (spot-checked 19 of the most evidence-signal-adjacent lines): all are genuine bare-filename-only citations with no line number, backtick output, numeric result, or test-tool keyword (e.g. `Evidence: **PASSED** - test-integration.js: vector-index verified, database connection stable`) — confirmed as intended REQ-001 catches, not false positives. 5 of the 83 are within this packet's own `028-memory-search-intelligence` parent (009, 010, 011, 012, 014) — all sibling packets from the SAME review round, out of this phase's Files-to-Change scope to remediate. Not silently fixed; flagged in implementation-summary.md.

**F10 verification:**
- [x] T019 Built and ran the exact synthetic no-baseline vs real-baseline repro against a confirmed known-failing fixture folder (`scratch/f10-fixture-*/...`, cleaned up after): no-baseline run → `status: "first-run"`, `regressions: 0`; baseline recording this folder as a prior pass → `status: "regression"`, `regressions: 1`. Same two scenarios also codified as a permanent vitest case in `validation-gate-hardening.vitest.ts`.
- [x] T020 `strict-pass-freshness.ts` is excluded from `scripts/tsconfig.json`'s `include` list (confirmed by reading it — `sweep/` is not listed), so it has no project-level build/dist-freshness gate. Ran a standalone `tsc --noEmit` with the project's own compiler flags (`--target es2022 --module es2022 --moduleResolution node --strict --esModuleInterop --skipLibCheck --types node`): 0 diagnostics. `npm run build` (`tsc --build`) and `npm run typecheck` both exit 0, unaffected (bash-only + excluded-file edits).

**General:**
- [x] T021 `bash .../validate.sh .../015-validation-hardening-fixes --strict` → `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0.
- [x] T022 Adversarial self-review completed: re-read all three diffs against REQ-001..006 line by line; found and fixed the `not implemented` collision (T005) before it could ship; confirmed T016/T018's findings are real surfaced consequences, not implementation bugs, via direct fixture reproduction rather than assertion.
- [ ] T023 [DEFERRED: operator instructed this task not to git commit or push; scoped commit(s) remain for the operator/a follow-up turn]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` except T023 (deferred: no-commit instruction for this turn — not a blocker)
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict` passes on this folder (Errors: 0 Warnings: 0) and on the T013/T014 re-check sample (both packets now correctly classify and agree); T015's reconciliation resolved with a clean-agreement outcome, no mismatch. Two out-of-scope findings surfaced and flagged rather than silently fixed or hidden — see T016 (010's scaffold markers) and T018 (83-folder EVIDENCE_CITED blast radius, 5 within this packet's own 028 parent)
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
