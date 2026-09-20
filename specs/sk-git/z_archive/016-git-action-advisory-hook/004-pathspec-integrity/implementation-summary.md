---
title: "Implementation Summary: Pathspec Integrity"
description: "The rule set measured at 0 fires per 25 ordinary commands with 5 of 5 control shapes firing, after the audit was fixed twice for reporting false signals."
trigger_phrases:
  - "advisory noise audit"
  - "git advisory fire rate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/004-pathspec-integrity"
    last_updated_at: "2026-07-27T23:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Measured the real fire rate with a control group"
    next_safe_action: "Operator reviews the packet"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Pathspec Integrity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-pathspec-integrity |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An audit that replays command shapes against a live repository and reports what the rule set actually costs. Ordinary commands drew no advisory in either measured repository; every control shape drew one.

The pathspec failure this phase is named for was already covered by a rule built in phase 002, with its reproduction asserted there. What was genuinely missing was evidence for the claim the whole design rests on — that these rules stay quiet. Every number to this point was a projection from reflog prevalence, which counts how often an operation happened rather than how often a state-gated rule would fire on it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-git/scripts/lib/advisory-noise-audit.mjs` | Created | Replay, control group, budget verdict |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The control group was added after the first run, and immediately justified itself. Run against the main checkout the audit reported zero fires and "within budget" — while loading zero rules, because that tree's frontmatter had not been changed. A quiet result from a dead rule set is indistinguishable from a quiet result from a well-gated one, and the first version reported the wrong one as success.

Two structural refusals followed. The audit now exits non-zero rather than reporting a verdict when no rules load, and reports the result invalid when no control shape fires.

A second false signal appeared in the dirty-repository run, which reported 4% — over budget. The single fire was `git add README.md` flagged as matching nothing, which was correct: that repository has no README. The probe set was hardcoded, so it manufactured noise. Probes now resolve a real tracked path from the target repository, and the same run reports 0%.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add a control group | A zero is unreadable without one |
| Refuse a verdict rather than report green | Reporting success while measuring nothing is the failure this packet exists to catch |
| Resolve probe paths at runtime | Hardcoded paths manufacture noise and blame the rules for it |
| Include routine-but-dangerous shapes | Plain `reset` and `rebase` are where a badly gated rule turns noisy |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build worktree, 25 ordinary shapes | PASS — 0 fired |
| Dirty repository with untracked files, 25 shapes | PASS — 0 fired |
| Control shapes | PASS — 5 of 5 fired in both |
| Repository with no rules loaded | PASS — refused a verdict, exit 2 |
| Aggregate budget | PASS — 0%, against a 3% ceiling |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a replay, not a fire rate.** It measures what the rules do against one repository's current state, using a fixed shape list. A true rate needs a Bash-hook invocation log, which does not exist here. The number is evidence, not proof.
2. **Twenty-five shapes is a small sample** chosen to mirror reflog prevalence. It is not exhaustive, and a shape nobody thought of is exactly the kind that would be noisy.
3. **Fire rates depend on repository state.** A tree with unusual staging could produce different numbers; the two measured trees were a near-clean worktree and a deliberately dirty repository.
4. **Nothing runs this audit automatically.** Like the phase 002 suite, it is invoked by hand.
<!-- /ANCHOR:limitations -->
