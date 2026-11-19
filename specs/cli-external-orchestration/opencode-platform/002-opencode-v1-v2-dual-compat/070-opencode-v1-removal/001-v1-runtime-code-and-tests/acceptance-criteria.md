---
title: "Acceptance Criteria: Phase 1: v1-runtime-code-and-tests"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "v1 runtime code and tests acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests"
    last_updated_at: "2026-11-19T09:04:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-v1-runtime-code-and-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: v1-runtime-code-and-tests

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 001-v1-runtime-code-and-tests
**Level:** 2
**Status:** Draft
**Date:** 2026-11-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the resolver module is loaded, When its supported-family list is read, Then it equals `['v2']` and major 1 resolves to "unsupported" | `rg -n -F "SUPPORTED_FAMILIES = Object.freeze(['v2'])" .skilled/hooks/cli-dispatch/lib/opencode-version.mjs` prints one line, and the parity test reports 0 failed tests Observed 2026-11-19: the rg prints 1 line, and the parity vitest reports 24 passed, 0 failed. | Met | - |
| AC-002 | REQ-002 | Given the dispatch rules, When the two v1-only rule names are searched in the rule file and the checker, Then no match remains | `rg -l -F -e 'no-bare-agent-general' -e 'command-flag-for-slash-prompt' .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs \| wc -l` prints 0 Observed 2026-11-19: the rg count is 0. | Met | - |
| AC-003 | REQ-003 | Given the deep-loop runtime, When the native-lineage and `--variant` strings are searched in the two scripts, Then none remain, and the fanout suite reports 0 failed tests | `rg -n -F -e 'deep/${' -e '--variant' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs \| wc -l` prints 0, and `npx vitest run tests/unit/fanout-run.vitest.ts` in the runtime folder reports 0 failed tests Observed 2026-11-19: the rg count is 0, and the fanout vitest reports 194 passed, 0 failed. | Met | - |
| AC-004 | REQ-004 | Given the skilled-loop wrapper, When its model-effort test runs, Then it reports no failures | `node --test .skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs` prints `# fail 0` Observed 2026-11-19: `# tests 64`, `# pass 64`, `# fail 0`. | Met | - |
| AC-005 | REQ-005 | Given the setup helper and its tests, When the v1 modes are searched and the both-test path is checked, Then no v1 mode remains and the both-test file is gone | `rg -n -F -e 'mode_both' -e 'mode_v1' -e 'write_launcher' .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh \| wc -l` prints 0, and `ls .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-both.test.cjs` exits 1 Observed 2026-11-19: the rg count is 0, and the both-test file is absent (ls exits 1). | Met | - |
| AC-006 | REQ-006 | Given the doctor battery, When its test runs, Then it reports no failures on the v2 family only | `node --test .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` prints `# fail 0` Observed 2026-11-19: `# tests 49`, `# pass 49`, `# fail 0`. | Met | - |
| AC-007 | REQ-007 | Given the plugin folder, When the `.disposed` and `.server(` strings are searched, Then no match remains, and each removed event branch is recorded as not seen in the capture | `rg -l -F '.disposed' .opencode/plugins/*.js \| wc -l` prints 0, and `rg -l -F '.server(' .opencode/plugins/tests \| wc -l` prints 0 Superseded by ADR-001: `global.disposed` stays, so a `.disposed` search cannot reach 0. The replacement check `rg -n -F -e server.instance.disposed -e app.disposed .opencode/plugins/*.js \| wc -l` prints 0 (observed 2026-11-19). The `.server(` check was scoped to `.opencode/plugins/tests` and missed a production caller, `.vibe/plugins/repo-guards/session-cleanup.mjs`, which the deep review found (DR4-P1-001) and which now calls `.factory(`. The widened check `rg -l -F '.server(' --hidden -g '!**/node_modules/**' -g '!**/*.md' -g '!**/*.markdown' -g '!specs/**' -g '!.git/**' -g '!**/changelog/**' -g '!**/benchmark/**' . \| wc -l` prints 0 (observed 2026-11-19). | Superseded | ADR-001 |
| AC-008 | REQ-008 | Given the session readers, When the legacy table constant and the v1 fixture name are searched, Then no match remains, and the readers test reports no failures | `rg -n -F 'LEGACY_MESSAGE_TABLE' .skilled/hooks/shared/session-readers/opencode.mjs \| wc -l` prints 0, and `node --test .skilled/hooks/shared/tests/session-readers/opencode.test.mjs` prints `# fail 0` Observed 2026-11-19: LEGACY_MESSAGE_TABLE count 0, opencode-v1.db matches under hooks 0, `# tests 10`, `# pass 10`, `# fail 0`. | Met | - |
| AC-009 | REQ-009 | Given the widened branch-contract scan over the two `loop-protocol.md` files and the two presentation `.txt` files, When its vitest suite runs after the doc fix, Then it passes because none of the four carries `--pure` | In the runtime folder, `npx vitest run tests/unit/executor-branch-contract.vitest.ts` reports 0 failed tests. Before the doc fix, the same run failed and named exactly the four files Observed 2026-11-19: `Tests 10 passed (10)`, 0 failed. | Met | - |

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

**Closeable:** No

No. Every criterion is Unmet because this phase has not been implemented yet.
<!-- /ANCHOR:closure -->
