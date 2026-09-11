---
title: "Implementation Summary"
description: "The phase has not executed yet. This summary records the pre-implementation state, the files the phase will touch, and the measured baseline no claim may contradict."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-derived-artifact-registry/003-measure-and-declare"
    last_updated_at: "2026-09-11T06:37:37Z"
    last_updated_by: "template-author"
    recent_action: "Initialized the pre-implementation record"
    next_safe_action: "Execute the phase and replace this file with what shipped"
    blockers: []
    key_files:
      - "specs/system-speckit/035-derived-artifact-registry/003-measure-and-declare/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-measure-and-declare"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-measure-and-declare |
| **Completed** | not yet, phase is in Draft |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been built yet. This summary is written before the work so the files and the baseline are named in one place. One fact is already measured and no later claim may contradict it: a tree that is clean in the git sense still reports repairable packets under `specs/sk-git` and `specs/hooks`, so no criterion here expects a clean tree to report zero.

### Phase 3: measure-and-declare

When it executes, this phase adds `--format json` to `runtime/cli/spec/repair-derived.cjs` and `runtime/cli/spec/heal-spec-docs.cjs`, so the weekly job at `.github/workflows/strict-pass-freshness-report.yml` can publish counts instead of prose. It creates `runtime/cli/lib/unhealable-documents.json`, the declared list of documents the healer refuses, each with a reason. It extends `runtime/cli/tests/repair-derived.vitest.ts` with parity cases and creates `runtime/cli/tests/heal-spec-docs.vitest.ts` for the refusal census and the declaration comparison. No new sweep is built, because the weekly job already walks the corpus.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/spec/repair-derived.cjs` | Modify, planned | `--format json` mirroring the text counts and exit codes |
| `runtime/cli/spec/heal-spec-docs.cjs` | Modify, planned | `--format json` refusal census with reasons |
| `runtime/cli/lib/unhealable-documents.json` | Create, planned | The declared list |
| `.github/workflows/strict-pass-freshness-report.yml` | Modify, planned | Consume both reports and publish the counts |
| `runtime/cli/tests/repair-derived.vitest.ts` | Modify, planned | JSON and text parity cases |
| `runtime/cli/tests/heal-spec-docs.vitest.ts` | Create, planned | Census and declaration cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The delivery path is: capture both tools' text output on the current tree, add the JSON modes, compare both modes over one fixture, write the declared list from the healer's own refusal census, then extend the workflow step and prove it read-only in a scratch worktree. The completion claim requires the published counts to equal the recorded baseline on two consecutive runs and the declaration to be checked in both directions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extend the existing weekly job | It already walks the corpus read-only and publishes an artifact, so a second sweep would duplicate the schedule and the scope |
| Add JSON instead of parsing human text | A count read from a log line breaks the next time a message changes |
| Record a measured baseline | A clean tree already reports repairable packets, so a zero target cannot be met |
| Check the declaration in both directions | An undeclared refusal and a stale entry are both drift, and only one of them is caught by a one-way check |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this phase | Not run, phase is in Draft |
| JSON and text parity for both tools | Not run, JSON modes do not exist yet |
| Published counts equal the baseline | Not run, the workflow step is not extended yet |
| Declaration checked in both directions | Not run, the declared list does not exist yet |
| Scratch-worktree read-only run | Not run, planned |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This summary is a plan.** It cannot be treated as evidence that anything shipped. Replace it during phase execution with the observed counts from the real run and the reason every declared entry carries.

2. **The baseline is a snapshot.** It is measured at execution time, so a tree that changes between measurement and claim reproduces a different number by design. The criterion is equality between two runs over the same tree, not equality with a stored constant.
<!-- /ANCHOR:limitations -->

---

