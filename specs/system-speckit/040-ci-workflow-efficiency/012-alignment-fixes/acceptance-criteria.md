---
title: "Acceptance Criteria: Phase 12: alignment-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/012-alignment-fixes"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All seven criteria met with recorded commands"
    next_safe_action: "None; the conductor lands the commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-053-012-alignment-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: alignment-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/012-alignment-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the two sk-code-ci references, When each cited line is printed, Then it shows the claimed text | `sed -n '12p;24p' .github/workflows/repo-rules-corpus.yml` printed the `.opencode/repo-rules/**` twin twice. `sed -n 61p` and `sed -n 92p` on the matrix workflows printed `fail-fast: false`. Cited lines: `.github/workflows/repo-rules-corpus.yml:12`, `.github/workflows/pi-extension-tests.yml:61` | Met | - |
| AC-002 | REQ-002 | Given a fresh advisor runtime, When the new steps run a scan and then `npm test`, Then every default-suite file passes | Database deleted, `skill_graph_scan --trusted` exit 0, then `npm test` printed `Test Files  150 passed (150)`, exit 0. The job keeps `if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'`. Steps at `.github/workflows/skill-advisor-stress.yml:86` and `.github/workflows/skill-advisor-stress.yml:90` | Met | - |
| AC-003 | REQ-003 | Given a new `synthesis_complete.json`, When the guard runs, Then it passes, and a sibling snake_case name still fails | Guard unittest 9/9 after, 1 failure before. Replay since `583316d0833e`: 18 names before, 8 after, none a marker. `check-gate-inputs.sh` `RESULT: PASSED` with `main` in the push trigger. Exemption at `.skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:268`, test at `.skilled/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py:198`, trigger at `.github/workflows/naming-standard-guard.yml:7` | Met | - |
| AC-004 | REQ-004 | Given the spec-kit runtime, When `npm run check` runs, Then it exits 0 with no rule disabled and no `cli/` ignore | `npm --prefix .skilled/skills/system-spec-kit/runtime run check` printed no problems (0 errors, 0 warnings), exit 0: 239 errors before, 137 after the `^_` rule change (133 in `cli/`), 0 after the code fixes, and the three unused-directive warnings that predated this phase were deleted. The cli package's own `npm run typecheck` and `npm run check` exit 0 and its `npm test` matches the baseline (vitest 191 of 194 files and 2239 of 2259 tests passed with 3 files and 20 tests skipped, and every legacy and validation suite passed, exit 0, the same as the baseline run before the change). Rule scope at `.skilled/skills/system-spec-kit/runtime/eslint.config.mjs:24` | Met | - |
| AC-005 | REQ-005 | Given a version probe slower than its timeout, When the resolution case runs, Then it still passes because it spawns no probe | Stub made to sleep 4 s: the old case failed at 3013.5 ms, the new case passed in 5.9 ms. Five plain runs: `pass 42`, `fail 0` each. Seam use at `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:288` | Met | - |
| AC-006 | REQ-006 | Given a host with opencode v2.1.4, When `hook-stdin-deadline.test.mjs` runs, Then both preflight cases pass | Before: `pass 19`, `fail 2`, exit 1. After, five runs: `pass 21`, `fail 0`, exit 0 each. Stub at `.skilled/hooks/shared/hook-stdin-deadline.test.mjs:117` | Met | - |
| AC-007 | REQ-007 | Given the advisor workflow's run history, When the cost is computed, Then the packet records minutes per run and runs per month | `spec.md` NFR-P01: 2.7 minutes a run over 73 runs in 30 days, about 197 runner-minutes a month, recorded at `spec.md:182` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met with its command output recorded, and closure now waits only on the conductor landing the commits.
<!-- /ANCHOR:closure -->
