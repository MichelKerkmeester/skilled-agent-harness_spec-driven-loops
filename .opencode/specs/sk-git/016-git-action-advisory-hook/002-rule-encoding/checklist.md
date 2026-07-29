---
title: "Verification Checklist: Rule Encoding"
description: "Evidence for the ten encoded git advisory rules and the evaluator extension."
trigger_phrases:
  - "rule encoding checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/002-rule-encoding"
    last_updated_at: "2026-07-27T23:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded evidence for the ten encoded rules"
    next_safe_action: "Phase 003 wires the hook"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Rule Encoding

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The evaluator was read before deciding extend versus rebuild
  - **Evidence**: checks are pure `(cmd) => boolean`; extra arguments are discarded, so extension is structurally safe
- [x] CHK-002 [P0] Decision recorded with alternatives weighed
  - **Evidence**: `decision-record.md` D-001

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] Every rule is a state discriminator, not a verb match
  - **Evidence**: each check reads state or a specific flag shape; no bare subcommand match
- [x] CHK-004 [P0] Every check fails open
  - **Evidence**: a throwing check approves; asserted in the suite
- [x] CHK-005 [P1] State collection is lazy
  - **Evidence**: no git process spawns until a check requests state; memoised per invocation
- [x] CHK-006 [P1] Comment hygiene holds
  - **Evidence**: comments carry durable reasoning; no spec paths or task ids

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Test suite passes
  - **Evidence**: `node --test git-rule-checks.test.mjs` → 18/18
- [x] CHK-008 [P0] Each test reproduces the real failure before asserting the check
  - **Evidence**: tests build real repositories and run the failing operation first
- [x] CHK-009 [P0] Command-only dispatch rules still evaluate unchanged
  - **Evidence**: regression assertion on `no-bare-agent-general`
- [x] CHK-010 [P1] Test repositories are hermetic
  - **Evidence**: `core.hooksPath` redirected; a global hooks path otherwise applies host gates

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-011 [P0] The founding rule guards the case that is actually silent
  - **Evidence**: experiment showed the remembered premise was wrong; rule rewritten, `decision-record.md` D-002
- [x] CHK-012 [P0] No orphan rule and no orphan check
  - **Evidence**: round-trip check reports 0 in both directions
- [x] CHK-013 [P1] Parser handles flags whose value is a separate argument
  - **Evidence**: a commit message no longer lands in the pathspec

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-020 [P0] Git logic did not leak into the dispatch skill
  - **Evidence**: only an optional parameter changed in `dispatch-rule-checks.mjs`; checks and state live under sk-git
- [x] CHK-021 [P0] The evaluator extension is structurally backward compatible
  - **Evidence**: existing checks are unary; JavaScript discards the extra argument
- [x] CHK-022 [P1] One contract, one parser
  - **Evidence**: the frontmatter parser is reused, not duplicated

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-023 [P0] No git process spawns for a non-git command
  - **Evidence**: the parser returns null and every check exits before touching context
- [x] CHK-024 [P1] State is collected at most once per invocation
  - **Evidence**: every accessor is memoised on a per-context cache
- [x] CHK-025 [P2] Git calls are bounded
  - **Evidence**: a timeout and an output cap are set on every subprocess call

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-014 [P0] No rule blocks a command
  - **Evidence**: all ten severities are `warn`; asserted in the suite
- [x] CHK-015 [P1] No credentials or absolute user paths in the encoded messages
  - **Evidence**: messages name git concepts and commands only

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-016 [P0] Each rule message explains the situation, not just the rule name
  - **Evidence**: every message exceeds 40 characters and names the consequence
- [x] CHK-017 [P1] The wrong-premise correction is recorded rather than quietly fixed
  - **Evidence**: `decision-record.md` D-002

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-018 [P0] Git checks live under sk-git, not in the dispatch skill
  - **Evidence**: only the optional parameter changed in `dispatch-rule-checks.mjs`
- [x] CHK-019 [P2] Nothing runs this suite automatically
  - **Evidence**: no CI, hook or npm script discovers `.test.mjs`; recorded as a limitation

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-026 [P0] Both corrections are recorded rather than quietly applied
  - **Evidence**: the wrong premise and the three test-surfaced defects appear in the decision record and summary
- [x] CHK-027 [P1] The rollback is written down and is genuinely reversible
  - **Evidence**: removing the frontmatter block leaves the modules inert; the evaluator parameter is optional

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-028 [P0] No rule blocks, so no enforcement authority is claimed that belongs elsewhere
  - **Evidence**: all severities `warn`; pre-commit, commit-msg and pre-push retain enforcement
- [x] CHK-029 [P0] No judgement-only rule was encoded as mechanism
  - **Evidence**: the research classified roughly twenty as judgement-only; none appear in the ten
- [x] CHK-030 [P1] Nothing duplicates existing pre-push enforcement
  - **Evidence**: no rule touches branch naming or push permission

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-031 [P0] The change is inert until the hook is registered
  - **Evidence**: frontmatter and modules do nothing on their own; delivery is a separate phase
- [x] CHK-032 [P0] Existing consumers of the shared evaluator are unaffected
  - **Evidence**: regression assertion; the options parameter is optional
- [x] CHK-033 [P1] A noisy rule can be silenced without a code change
  - **Evidence**: environment-driven suppression, verified in the delivery phase

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:sign-off -->
## Sign-Off

The rule set is complete and tested, and its one genuinely load-bearing claim — that these rules
stay quiet — is deliberately **not** signed off here. Nothing in this phase measures fire rate; the
tests prove each rule fires when it should, which is the opposite question. That measurement is the
final phase's subject, and until it existed the quietness claim was a projection.

Two things a reviewer should treat as open rather than settled: nothing runs this suite
automatically, and the destructive rule tier the research retained is not encoded here.

<!-- /ANCHOR:sign-off -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Priority | Total | Complete | Outstanding |
|----------|-------|----------|-------------|
| P0 | 20 | 20 | 0 |
| P1 | 13 | 13 | 0 |
| P2 | 2 | 2 | 0 |

CHK-019 is marked complete because the gap is confirmed and recorded, not because it is fixed.
Fixing it is repository-wide work outside this packet.

<!-- /ANCHOR:summary -->
