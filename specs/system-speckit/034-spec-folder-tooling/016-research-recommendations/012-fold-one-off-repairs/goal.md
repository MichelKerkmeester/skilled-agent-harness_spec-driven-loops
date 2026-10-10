---
title: "Goal: Fold one-off repairs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs"
    last_updated_at: "2026-10-09T06:50:00Z"
    last_updated_by: "closeout"
    recent_action: "Second closeout pass, tree4 cited, 39 of 39 verbose run"
    next_safe_action: "Operator decisions in implementation-summary Open Items"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Fold one-off repairs

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Clarify frontmatter value-source order per document class and add grouped-detail reporting to upgrade-legacy.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Frontmatter fill respects document class: template literal per class is the primary source (e.g., goal.md uses `important` and `planning`). |
| D2 | Grouped-detail report shows failures grouped by rule with count in format "### folder / x RULE". |
| D3 | Built in wave 4 by DeepSeek V4.1 Flash max through cli-pi on the LLM Gateway route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D4 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D5 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Value-source test passes: `npx vitest run tests/upgrade-legacy.vitest.ts --config ../vitest.config.ts --root . --reporter verbose 2>&1 | grep -E "fills missing|Tests "` shows the case passing and the totals. The default reporter lists no test names, so the flag is required for the grep to print anything
- [x] Grouped-detail report test passes: `npx vitest run tests/upgrade-legacy.vitest.ts --config ../vitest.config.ts --root . --reporter verbose 2>&1 | grep -E "groups each failing|Tests "` shows the case passing
- [x] Fill-frontmatter logic respects template literal per class: test in upgrade-legacy.vitest.ts extends the "fills missing frontmatter keys" case with value-source assertions
- [x] Suite passes: `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` shows 0 failures (includes all upgrade-legacy tests)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Value-source audit | Done | fillMissingFrontmatter at `spec/upgrade-legacy.mjs:734`, compared with the HEAD version. Recorded in implementation-summary.md |
| Grouped-detail design | Done | Format "### folder / x RULE (count)" in `printGroupedDetail` (`spec/upgrade-legacy.mjs:520`) |
| Frontmatter fill implementation | Done | Template literal per class before the runtime tables, through an opt-in option that only the fill sets |
| Grouped-detail implementation | Done | Printed on every dry run and apply as a section, with no mode flag |
| Test coverage | Done | Value-source at `upgrade-legacy.vitest.ts:365`, template-missing fallback at `:504` and grouped detail at `:541`, as of 08:41 CEST. The verbose run on 2026-10-09 printed 39 of 39 passed |
| Suite validation | Done | Whole-tree gate tree4 (git HEAD `02cc1fb948`): CLI test exit 0, 171 files and 1775 tests passed, 19 skipped, 0 failed, against a baseline of 161 files and 1639 passed. Tree4 read the test file before the isolation fix 012-T2 |

### Deviations and findings

| Item | Note |
|------|------|
| Deviations and open items | Listed in implementation-summary.md under Deviations and Open Items: the widened fill set, the missing changelog refresh, the manual `--apply` still open (T011), the sandbox reset for the order-dependent packet (an `afterEach` hook that landed at 08:41 CEST, author not confirmed), and the process-wide cache variant, closed by removing the cache (see implementation-summary.md). The four classes that had no value-source case are pinned as of the second pass |
| Stale route text in D3 and D4 | D3 names the LLM Gateway route and D4 names Luna. The build ran on the opencode-go route with DeepSeek, and the review on the other route, under parent D1 and D7. The decisions are frozen, so the text stays and this row records the difference |

<!-- /ANCHOR:log -->
