---
title: "Implementation Summary: Rule Encoding"
description: "Ten state-gated rules, an additively extended evaluator, and a test suite that caught a wrong premise in the founding rule."
trigger_phrases:
  - "git hard rules encoding"
  - "sk-git advisory rules"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/002-rule-encoding"
    last_updated_at: "2026-07-27T23:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Encoded ten state-gated rules and extended the shared evaluator"
    next_safe_action: "Phase 003 wires the hook"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Extend the shared evaluator additively rather than build a git-specific sibling."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Rule Encoding

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-rule-encoding |
| **Completed** | 2026-07-27 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

sk-git now declares ten `hard_rules:` in its frontmatter, and the evaluator that already ran on every Bash command can finally read them, because it can now see the repository as well as the command.

Every rule is a state discriminator. That is not a style preference: measurement in phase 001 found roughly one operation in seven here is a `reset`, and 93% of those merely unstage. A rule keyed to the word fires constantly and gets skimmed past; the same rule keyed to the commit actually moving fires about a hundredth as often. Each of the ten follows that shape or it would not have shipped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-git/SKILL.md` | Modified | Ten rules, version 1.4.0.0 |
| `sk-git/scripts/lib/git-rule-checks.mjs` | Created | Checks plus a narrow git command parser |
| `sk-git/scripts/lib/git-context.mjs` | Created | Lazy pre-execution state, cached per invocation |
| `sk-git/scripts/lib/git-rule-checks.test.mjs` | Created | 18 tests against real repositories |
| `cli-opencode/.../dispatch-rule-checks.mjs` | Modified | Optional checks registry and context |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gating question was answered by reading the evaluator rather than assuming it: its checks are pure `(cmd) => boolean` functions, and JavaScript discards extra arguments, so a second parameter is structurally invisible to all of them. Extension was therefore safe in a way a promise of compatibility would not have been, and no phase inversion was needed.

Tests build real throwaway repositories and perform the failing operation before asserting anything. Three defects surfaced that way and none would have surfaced against a mock: a commit message landing in the pathspec because the parser did not know which flags take values, an `add --dry-run` result that conflated three different empty outcomes, and a founding premise that was simply wrong about git.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extend the shared evaluator | Structural compatibility; a duplicate parser is a second home for one contract |
| Rewrite the founding rule | Experiment showed the remembered premise was wrong; see the decision record |
| Reproduce before asserting | Describing a failure encodes the description; reproducing it encodes the failure |
| Ten rules, all `warn` | Enforcement belongs to hooks that can see outcomes this cannot |
| Shell to `add --dry-run` | A drifting model of git manufactures false positives |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Test suite | PASS — 18/18 |
| Rules parse under the existing parser | PASS — 10 parsed |
| No orphan rule or orphan check | PASS — 0 both directions |
| Every rule advises, never blocks | PASS — all `warn` |
| Command-only rules unchanged | PASS — regression asserted |
| A throwing check approves | PASS — fail-open asserted |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing runs this suite automatically.** No CI job, pre-commit invocation or npm script discovers `.test.mjs` files anywhere in this repository; the sibling dispatch suite has the same gap. Both pass when invoked by hand. This is the third instance of silent non-running tests found in this codebase and it deserves a fix outside this packet.
2. **The parser is deliberately narrow.** Aliases, wrapper scripts and anything behind a shell variable are not classified. Guessing at their expansion would produce advisories about commands nobody typed.
3. **`commit-pathspec-empty-change` fires per named path, not per commit.** A command naming several paths where one is empty draws one advisory, which is correct, but the message does not say which path.
4. **The destructive tier the research retained is not encoded here.** The handoff scoped this phase to the confirmed and strong tiers.
<!-- /ANCHOR:limitations -->
