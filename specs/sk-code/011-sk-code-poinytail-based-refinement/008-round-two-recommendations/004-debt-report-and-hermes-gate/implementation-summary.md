---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "debt report and hermes gate implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate"
    last_updated_at: "2026-10-10T09:40:00Z"
    last_updated_by: "builder-008-004"
    recent_action: "Built the ceiling report, its test, the Hermes mirror gate pair and the harness section"
    next_safe_action: "Orchestrator reviews the build against spec.md and decides on the commit"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/scripts/git-hooks/tests/pre-commit.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-008-004-debt-report-and-hermes-gate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-debt-report-and-hermes-gate |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Shortcut comments whose upgrade trigger can never fire are now listed by one command, so they stop hiding in the code. A stale Hermes skill or prompt copy now blocks the commit that would ship it. Before this change, only the Hermes CI job caught that drift, and only after a push.

### Phase 4: debt-report-and-hermes-gate

The sk-code quality skill has a new report, `ceiling-report.sh`. It reads the tracked code files, finds each `ceiling:` and `intentional-limit:` comment, and tags the two kinds whose trigger a reader cannot check: a marker with no trigger at all, and a marker whose trigger has no number and no measurable term such as throughput, latency or a row count. The report prints one line per marker and a summary, and it exits 0 whenever it runs. It reports and never gates. A bare word in an identifier or in prose does not count, because a marker must start a comment.

The pre-commit mirror gate now runs the two Hermes `--check` commands and guards the two `.hermes` output trees, so all eight checks run on every commit. The gate's comment states the real count and a measured time. A harness section plants a drifted Hermes skill copy and proves the commit is blocked, and it proves the prompt check receives `--check`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` | Created | Python report behind a `.sh` entrypoint that lists the markers and tags the two kinds with no checkable trigger |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` | Created | Bash fixture harness for the report: the tag cases, the prefix case, the prose case and the bad-argument exits |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md` | Modified | Names the third checker, adds two contents rows and the report's test command to the validation section |
| `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md` | Modified | One sentence in "Mark intentional simplifications" that points to the report |
| `.skilled/scripts/git-hooks/pre-commit` | Modified | Two Hermes entries in the mirror checks, two `.hermes` trees in the output list, and the gate comment with the real count and time |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified | Section 49: a drifted Hermes skill copy blocks the gate, and the prompt check receives `--check` |
| `.skilled/commands/doctor/runtime-mirrors.md` | Modified | Line 59 drops the Hermes claim, because the workflow checks only the Codex and Pi mirrors |

The sk-code leaf manifest was regenerated and came out byte-identical, so it is not in this table.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The report was written test first. The test ran red with the report absent, then green once the report existed. A guard for the missing report was added so the red run fails on its own cause, not on the bad-argument cases, which exit 2 either way.

The harness section was checked against the pre-change hook as a negative control. Against the old hook the two new checks fail (69 passed, 2 failed), and against the edited hook they pass (71 passed, 0 failed). The gate's timing comment was set from five warm passes of the eight checks, which measured 0.44 to 0.51 seconds with a median of 0.46 seconds.

Nothing is committed. The change sits in the worktree. The live hook in the main checkout runs its own copy of the gate, so the new Hermes checks reach that copy only when this change lands there.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The report matches a marker only at the start of a quote-aware comment | A bare word match counts identifiers such as `project_ceiling: int` and prose, and it would also count the fixtures in its own test file. The operator accepted the anchored match. |
| The trigger is the text after the first semicolon, or after the first comma when there is no semicolon | The style guide writes `ceiling: <ceiling>; <trigger>` and the Ponytail convention writes a comma, so both forms are read. |
| Only the trigger is checked for a measurable term | A ceiling can be a fixed quantity, so a number in it says nothing about whether the trigger can fire. |
| The Hermes pair joins the existing mirror checks rather than getting its own gate | The gate runs on every commit so no mirror is masked. A separate gate would need its own list and lose that property. |
| The doctor doc was corrected, not extended | The doctor workflow checks no Hermes asset. Adding that check is a separate decision. |
| No packet version bump and no changelog entry | The version lives in `sk-code-quality/SKILL.md`, which this phase may not edit. The operator decides the release. |
| The new harness section is numbered 49 | The brief's number 28 was already used, and the harness runs to section 48. |
| The gate comment states about half a second | The median of five warm passes is 0.46 seconds. A single cold run measured 1.4 seconds, so the figure describes a warm checkout. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal 1: `ceiling-report.test.sh` | PASS. Prints `All ceiling report test cases passed`, exit 0 |
| Goal 2: `ceiling-report.sh` on the repository | PASS. Prints `markers=0 no-trigger=0 no-signal=0`, exit 0 |
| Goal 3: `bash -n` on the hook, and both Hermes `--check` commands | PASS. Prints `PASS: 70 Hermes skill copies in sync` and `[hermes-prompt-sync] PASS: 37 prompts are in sync.`, exit 0 |
| Goal 4: `pre-commit.test.sh` | PASS. Prints `pre-commit gates: 71 passed, 0 failed`, exit 0 |
| Goal 5: leaf freshness and rule copies | PASS. Freshness prints `checked=14 fresh=14 failed=0`, rule copies exit 0 |
| Goal 6: `validate.sh --strict` on this folder | PASS. Prints `RESULT: PASSED` with `Errors: 0  Warnings: 0`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live hook is the main checkout's copy.** `core.hooksPath` runs the main checkout's `pre-commit`, which has no Hermes entries until this change lands there. The harness proves the worktree copy only.
2. **The doctor still does not check Hermes.** The runtime-mirrors doc now says so. Extending the workflow to the Hermes copies is a separate decision.
3. **No version bump and no changelog entry.** The packet version lives in `sk-code-quality/SKILL.md`, which this phase may not edit, so the operator decides the release.
4. **The marker match is anchored, not bare.** The report reads a marker only at the start of a comment. The brief said "comment lines containing" the marker, and this departs from that wording on the operator's accepted decision.
<!-- /ANCHOR:limitations -->

---

