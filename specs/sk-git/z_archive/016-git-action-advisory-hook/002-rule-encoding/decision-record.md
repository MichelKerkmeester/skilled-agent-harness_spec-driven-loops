---
title: "Decision Record: Rule Encoding"
description: "Why the shared evaluator was extended rather than duplicated, and why one founding rule was rewritten mid-build."
trigger_phrases:
  - "git hard rules encoding"
  - "evaluator extension decision"
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
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: Rule Encoding

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Extend the shared evaluator rather than build a git-specific sibling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Implementer, with the parent spec's inversion clause as the fallback |

<!-- ANCHOR:adr-001-context -->
### Context

`evaluate(command, rules)` accepted command text and nothing else. That is sufficient for dispatch rules and almost useless for git rules: whether a `reset` deserves a word depends on whether the commit moves, which is repository state, not command text.

This gated the phase. The parent spec explicitly permitted inverting phases 002 and 003 if extension proved unviable, so the answer determined the shape of the remaining work.

### Constraints

- The evaluator runs on every Bash command through a live hook; breaking it breaks dispatch linting for two other skills.
- The frontmatter contract has one parser today, and contracts that live in two places diverge.
- Git-specific logic must not end up owned by a CLI dispatch skill.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Extend `evaluate` with an optional third argument carrying a checks registry and a context object. Checks receive context as a second parameter.

The deciding property is structural rather than contractual: every existing check is a unary function of the command, and JavaScript discards extra arguments, so passing a second parameter is invisible to all of them. Compatibility here is a fact about the language, not a promise someone has to keep.

sk-git owns its own checks module and its own state collector. Nothing git-specific entered the dispatch skill; only the optional parameter did.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Why not |
|-------------|---------|
| Build a git-specific evaluator alongside | Requires a second copy of the frontmatter parser, free to drift from the first. One contract with two implementations is a defect waiting for a schedule |
| Invert phases 002 and 003 | Only warranted if extension were unsafe. It is not |
| Pass state through the rule objects instead of a context | Rules are declarative frontmatter; loading them with runtime state confuses the layer meant to be readable by a human |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

The dispatch evaluator is now shared infrastructure with two consumers rather than one. Its default path is unchanged and a regression test asserts that, but future edits carry a second caller's expectations.

No phase inversion was needed, so the packet's phase order held.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| **Simplicity** | One optional parameter against a duplicated parser. The smaller change is also the safer one |
| **Necessity** | Forced, not chosen. Without state, nine of the ten rules cannot exist |
| **Reversibility** | Omitting the parameter restores the prior signature exactly |
| **Blast radius** | Two other skills depend on this function; contained by structural compatibility plus a regression assertion |
| **Alternatives** | Duplication was the only real alternative and creates a second home for one contract |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

The evaluator takes an options object whose `checks` defaults to the existing registry and whose `context` defaults to undefined. Checks are invoked with the command and that context.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Rewrite the founding rule when its premise failed verification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Implementer, on experimental evidence |

<!-- ANCHOR:adr-002-context -->
### Context

The packet was motivated by a commit that reported success while omitting a file. The rule written from that memory said a pathspec commit silently skips untracked paths.

Writing the reproduction disproved it. Naming an untracked file directly makes git refuse the entire commit with `pathspec did not match`, exit 1. Git is loud about that case, and a rule guarding it would guard nothing.

### Constraints

- The rule is the packet's reason for existing; removing it without a replacement would hollow out the work.
- Any replacement has to be verified the same way, not reasoned toward.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

Replace the rule with one keyed to a commit scoped to a **directory**, or to all tracked files, while untracked files sit inside that scope.

That case was found by experiment and is genuinely silent: the pathspec matches tracked files, so git has no complaint, exits 0, and leaves the new file behind. The all-tracked form behaves identically.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Alternative | Why not |
|-------------|---------|
| Keep the original rule | It guards a case git already handles loudly. Pure noise |
| Drop the rule and the phase with it | The failure is real; only the described mechanism was wrong |
| Warn on every scoped commit regardless of state | A verb-keyed rule, which is exactly the pattern the research showed gets ignored |
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

The rule guards the case that is actually silent. The reproduction performs the real commit and asserts the omission before asserting the check, so the premise cannot quietly revert to the remembered version.

More broadly, this is the packet's strongest argument for reproducing a failure rather than describing it. The description was confident, specific, and wrong; only the reproduction said so.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| **Simplicity** | Same rule count, same shape; only the discriminator changed |
| **Necessity** | The original guarded nothing. Shipping it would have been worse than shipping no rule |
| **Reversibility** | Fully reversible, though reverting would restore a rule known to be wrong |
| **Blast radius** | One rule and its test |
| **Alternatives** | Considered and rejected above; keeping a false rule was never viable |
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

The check fires when a scoped commit names a path with untracked files beneath it, or when the all-tracked form is used while untracked files exist. A pathspec naming an untracked file directly stays silent, because git already refuses it.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
