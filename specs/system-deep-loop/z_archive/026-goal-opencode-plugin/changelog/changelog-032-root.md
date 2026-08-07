---
title: "Changelog: /goal OpenCode Plugin [032-goal-opencode-plugin/root]"
description: "Chronological changelog for the /goal OpenCode Plugin spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin` (Level 1)

### Summary

Packet 032 shipped a passive goal layer for OpenCode with durable per-session state, sanitized context injection and a thin `/goal` command router, then extended it through prompt-quality enhancement and system-spec-kit integration. A dual deep-research/deep-review audit found a conditional verdict against the shipped state; five remediation phases closed every P1 finding, normalized the twice-renamed command surface, backfilled real integration-seam regression tests, wired a dormant status enum to a real provider-usage detector, and added goal-state archival so `.goal-state/` stops growing unboundedly. Phase 009 (a `/speckit:*` goal-prompt-offer integration) remains in progress, owned by a separate concurrent session, and is intentionally excluded from this rollup.

### Before vs After

**Before**

The active-goal feature had no durable store, no root command and no safe way to put the current goal into the assistant's system context. A session could not rely on one stable active goal and there was no lifecycle memory for token budget charging, completion evidence or guarded continuation after idle.

**After**

The plugin now persists one active goal per OpenCode session through atomic serialized state, refuses missing session ids and exposes the feature through a thin `/goal` router whose tools own session resolution, mutation, status and injection preview. Active goals reach the assistant as a sanitized `[active_goal]` block through OpenCode's system transform, using a deterministic sk-prompt-style `goalPrompt` instead of the raw objective. Lifecycle tracking records assistant activity, charges usage only when safe, marks a goal `budget_limited` once its token cap is reached, and now also marks `usage_limited` on a real provider 429. On idle, a conservative supervisor evaluates redacted evidence and completes the goal only on an exact met verdict, while guarded continuation stays passive by default and calls `promptAsync` only when every gate passes. A follow-on audit closed five P1 security/correctness defects, settled the command's final filename, backfilled tests against the corrected behavior, and added an archive-then-prune lifecycle so goal state does not accumulate indefinitely.

**Impact**

OpenCode now has a passive goal layer with durable session state, visible status, budget and usage awareness, a cautious completion path, and a state-cleanup lifecycle. The assistant can see the active goal without making chat depend on persistence, the continuation machinery exists without becoming an always-on prompt sender, and the shipped implementation has been independently audited and remediated rather than trusted on first landing.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-state-store` | Complete | The passive /goal milestone now has durable state. mk-goal.js persists one active goal per OpenCode session, refuses missing session ids, writes JSON atomically, and serializes mutations so later phases can rely on a stable store. |
| `002-injection-plugin` | Complete | Active goals now reach the assistant as passive system context. The plugin reads the current session goal, renders a sanitized [active_goal] block, and appends it through OpenCode's system transform without making chat depend on state persistence. |
| `003-goal-command` | Complete | The passive goal feature now has a root command. /goal is a thin router that selects one plugin tool call, and the tools own session resolution, state mutation, status rendering, and the exact injection preview. |
| `004-lifecycle-tracking` | Complete | Lifecycle tracking now gives /goal enough runtime memory to govern budgets and prepare verifier evidence without changing its passive M1 behavior. The plugin observes OpenCode events, records assistant activity, charges usage only when it is safe, and marks a goal budget_limited once its configured token cap is reached. |
| `005-completion-supervisor` | Complete | The goal plugin now has a conservative supervisor path for automatic completion. On session.idle, it evaluates the last redacted evidence, stores the verifier result, and completes the goal only when the verdict is exactly met. |
| `006-active-continuation` | Complete | The goal plugin now has a guarded continuation path after idle-time verification. It stays passive by default, can be smoke-tested without sending a prompt, and only calls promptAsync when every gate passes. |
| `007-sk-prompt-goal-enhancement` | Complete | The goal plugin now turns raw /goal set input into a deterministic sk-prompt-style goalPrompt under 4000 characters, using the enhanced prompt for injection while keeping the raw objective for status and auditability. |
| `008-system-spec-kit-integration` | Complete | The /goal OpenCode plugin is now documented inside system-spec-kit as a known local plugin surface, with routed skill logic, a hook reference, feature catalog and manual playbook assets, env var coverage, and explicit bridge-boundary notes. |
| `009-speckit-command-goal-prompt-offer` | In Progress (owned by a separate session) | `/speckit:*` goal-prompt-offer integration; not touched or narrated by this rollup. |
| `010-security-and-correctness-fixes` | Complete | Closed all five P1 security/correctness defects a 15-iteration deep review found: unredacted verifier exceptions, a bypassable prompt-injection sanitizer, an uncapped injection block, a stale-verifier race, and a missing RICCE metadata field. |
| `011-command-surface-normalization` | Complete | Normalized the twice-renamed /goal command filename to its final operator-confirmed name (goal_opencode.md), swept all nine referencing surfaces, and closed two smaller config-contract gaps. |
| `012-regression-test-backfill` | Complete | Backfilled regression coverage through real integration seams (transform hook, event branches, autonomy smoke, export contract, tool registration) pinning the corrected phase 010/011 behavior. |
| `013-design-fidelity-and-polish` | Complete | Wired a real usage_limited provider-429 detector, replaced phases 001-008 zero-placeholder fingerprints with real hashes, corrected phase 006's overstated completion, and added fsync-error and store-health observability. |
| `014-goal-state-cleanup-and-archive` | Complete | Goal state files now archive-then-prune on session.deleted and orphaned active state sweeps on a throttled session.created pass, so .goal-state/ stops growing unboundedly. |

### Added

- `mutation=created\|refreshed\|replaced` and `store_health=` status output fields; `usage_limited` provider-429 detector; goal-state archive/prune/sweep lifecycle with three new retention/sweep env vars

### Changed

- This packet owns the dedicated `/goal` OpenCode plugin capability. Its design was produced by a dedicated 10-iteration deep-research run whose artifacts live in this folder's `research/` directory. A follow-on dual deep-research (8 iterations) plus deep-review (15 iterations) audit against the shipped state produced the conditional verdict phases 010-014 remediated.
- A separate 10-iteration deep-research plus 10-iteration deep-review pass then audited whether related skill documentation and READMEs were still accurate after phases 010-014; the confirmed P1/P2 gaps were fixed directly (see the packet's `review/review-report.md`).

### Fixed

- See phases 010-014's own changelogs for the full per-finding fix list (DR-001 through DR-010, F-003/F-010/F-012/F-014/F-016).

### Verification

- `validate.sh --strict` PASSED on the packet root and every phase child except `009` (owned by a separate concurrent session, pre-existing and unrelated).
- Full 6-file `mk-goal-*.test.cjs` suite PASSED (exit 0) after every phase's edits, re-verified fresh at the end of the audit-and-remediation work.
- Every phase independently verified; every review/audit-remediation doc fix independently re-verified by a freshly dispatched agent before being trusted.

### Files Changed

_No packet-level file-level detail recorded. See each phase's own changelog for full file-level detail._

### Follow-Ups

- Phase 009 remains in progress under a separate session; this packet's rollup will need a further update once that phase lands.
- `.opencode/plugins/tests/` (renamed from `__tests__` after the doc-staleness audit) is shared with `mk-deep-loop-guard`'s test suite, owned by a different packet; any future rename of this shared directory needs the same repo-wide sweep this session ran.
