---
title: "Implementation Plan: Fanout Lineage Timeout Override"
description: "Plan for adding an operator-facing override to the hardcoded 4-hour fanout lineage timeout."
trigger_phrases:
  - "fanout lineage timeout override plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/009-research-backlog-remediation/002-fanout-timeout-override"
    last_updated_at: "2026-07-01T07:15:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fanout Lineage Timeout Override

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`computeLineageTimeoutMs(lineage)` at `fanout-run.cjs:884-888` currently reads only `lineage.iterations` and `lineage.timeoutSeconds`. Add a third optional field, e.g. `lineage.maxTimeoutHours` (or a global CLI-parsed value applied to every lineage), and change the hardcoded `4 * 60 * 60 * 1000` to `(overrideHours ?? 4) * 60 * 60 * 1000`. Parse `--lineage-timeout-hours <N>` in `parseArgs` (line ~95) and thread it into whatever constructs each lineage's config object before `computeLineageTimeoutMs` is called.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Default (flag absent) behavior byte-identical to current code.
- New tests RED before the fix, GREEN after.
- Full suite green.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Ceiling override, not formula replacement.** Keep `iters * timeoutSeconds * 2` as the computed value; only the ceiling constant becomes configurable. This preserves the existing "generous but bounded" safety intent while letting operators raise the bound for legitimately long runs.
- **Opt-in only.** No flag = current 4h default. An operator must explicitly ask for more time.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Read `computeLineageTimeoutMs` and `parseArgs` in full.
2. Write RED tests for both REQ-001 (default unchanged) and REQ-002 (override raises ceiling).
3. Implement the override plumbing.
4. Confirm RED→GREEN.
5. Document the flag on both consumer commands.
6. Run the full suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. Unit test: call `computeLineageTimeoutMs({iterations: 60, timeoutSeconds: 900})` (a combination that would exceed 4h: 60*900*2=108000s=30h) with no override → still returns the 4h cap (14400000ms), confirming REQ-001.
2. Same input with an override of 8 hours → returns `Math.min(108000000, 8*3600*1000)` = 8h cap (28800000ms), confirming REQ-002.
3. Full `deep-loop-runtime` Vitest suite stays green.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None — self-contained change to `fanout-run.cjs` and its test file, plus doc updates.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit touching `fanout-run.cjs` + test file + the two command docs. No state/data written, pure code + docs revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## 8. AFFECTED SURFACES (reference)

| Surface | Change |
|---------|--------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | `computeLineageTimeoutMs` ceiling param; `--lineage-timeout-hours` CLI parsing |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | New tests |
| `.opencode/commands/deep/research.md`, `.opencode/commands/deep/review.md` | Flag documentation |
<!-- /ANCHOR:affected-surfaces -->
