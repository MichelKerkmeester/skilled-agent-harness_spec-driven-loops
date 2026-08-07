---
title: "Spec 032 Changelog Index"
description: "Packet-local changelog index for the dedicated /goal OpenCode plugin spec."
trigger_phrases:
  - "032 changelog index"
  - "goal opencode plugin changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 032 Changelog Index

> Packet-local changelog index for the dedicated `/goal` OpenCode plugin spec and its phase children.

Spec 032 owns the `/goal` OpenCode plugin and command. Phases 001-008 shipped the original passive-goal implementation plus its prompt-enhancement and system-spec-kit integration. Phase 009 (`/speckit:*` goal-prompt-offer integration) is owned by a separate, concurrently in-flight session and has no changelog here. Phases 010-014 are a remediation track that closed a dual deep-research/deep-review audit's findings, normalized the command surface, backfilled regression tests, wired the `usage_limited` detector, and added goal-state cleanup. The chronological view of the same work lives in [`../timeline.md`](../timeline.md) and the before-and-after narrative in [`../before-vs-after.md`](../before-vs-after.md).

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. PHASE CHANGELOGS](#1-phase-changelogs)

<!-- /ANCHOR:table-of-contents -->

---

## 1. PHASE CHANGELOGS

| Phase | Changelog |
|-------|-----------|
| Root rollup | [changelog-032-root.md](./changelog-032-root.md) |
| 001 state store | [changelog-032-001-state-store.md](./changelog-032-001-state-store.md) |
| 002 injection plugin | [changelog-032-002-injection-plugin.md](./changelog-032-002-injection-plugin.md) |
| 003 goal command | [changelog-032-003-goal-command.md](./changelog-032-003-goal-command.md) |
| 004 lifecycle tracking | [changelog-032-004-lifecycle-tracking.md](./changelog-032-004-lifecycle-tracking.md) |
| 005 completion supervisor | [changelog-032-005-completion-supervisor.md](./changelog-032-005-completion-supervisor.md) |
| 006 active continuation | [changelog-032-006-active-continuation.md](./changelog-032-006-active-continuation.md) |
| 007 sk-prompt goal enhancement | [changelog-032-007-sk-prompt-goal-enhancement.md](./changelog-032-007-sk-prompt-goal-enhancement.md) |
| 008 system-spec-kit integration | [changelog-032-008-system-spec-kit-integration.md](./changelog-032-008-system-spec-kit-integration.md) |
| 009 speckit goal-prompt-offer | _owned by a separate session, no changelog here_ |
| 010 security and correctness fixes | [changelog-032-010-security-and-correctness-fixes.md](./changelog-032-010-security-and-correctness-fixes.md) |
| 011 command surface normalization | [changelog-032-011-command-surface-normalization.md](./changelog-032-011-command-surface-normalization.md) |
| 012 regression test backfill | [changelog-032-012-regression-test-backfill.md](./changelog-032-012-regression-test-backfill.md) |
| 013 design fidelity and polish | [changelog-032-013-design-fidelity-and-polish.md](./changelog-032-013-design-fidelity-and-polish.md) |
| 014 goal-state cleanup and archive | [changelog-032-014-goal-state-cleanup-and-archive.md](./changelog-032-014-goal-state-cleanup-and-archive.md) |
