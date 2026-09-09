---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/054-cli-hub-doc-version-reconciliation"
    last_updated_at: "2026-09-09T06:42:07Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Reconciled 355 doc versions in the cli hub"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-054-cli-hub-doc-version-reconciliation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 054-cli-hub-doc-version-reconciliation |
| **Completed** | 2026-09-09 |
| **Level** | 2 |
| **Status** | Complete |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Reconciled the `version:` field of 355 docs in the `cli-external-orchestration` hub through the
contract's own generator. 8 docs were already correct and skipped.

Before: 350 docs declared an `X.Y` era that did not match their skill — playbook rows at `1.0.0.0`
under a `SKILL.md` at `1.5.0.0`, and similar across all six modes. After: zero era mismatches.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`frontmatter-version.mjs apply --skill cli-external-orchestration --update`, one pass, with the
manifest written outside the repository so the run left no residue.

The decision to reconcile at all followed an independent review by a fresh reviewer, which
corrected the framing this packet started from. The initial read was that the failures were
build-segment drift — a self-restaling counter not worth chasing. Classifying the 355 failures
showed the opposite: 350 were era mismatches and only 5 were build-only. Era is human-curated and
does not self-restale, which is what makes the fix durable and worth making.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**One skill, not the fleet.** The versioning contract draws this line itself: it calls a fleet-wide
sweep a mistake that "buries real changes in noise, and is undone by its own commit", while saying
to "reconcile a skill when you want its numbers to mean something precise". This is one hub.

**Single pass; no `--amend` second pass.** The contract's convergence procedure ends with amending
the commit so the build counts settle. That rewrites a commit already pushed to a shared branch,
which is not acceptable here. The residual build-segment drift is accepted instead.

**The build segment was never the target.** Writing a version is itself an edit, so every file's
count goes stale the moment this commit lands. That is the documented expected reading, not a
failure, and no follow-up run should chase it.

**`gate` stays the enforced check.** `verify` is a reconciliation tool. Promoting it to a gate is
incoherent while `W` is defined as a commit count, because no commit can ever leave it green.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Era mismatches cleared | `frontmatter-version.mjs verify --skill cli-external-orchestration` | `X.Y` wrong: 350 -> 0 |
| Enforced gate green | `frontmatter-version.mjs gate --skill cli-external-orchestration` | 363/363 ok, exit 0 |
| Content untouched | `git diff` over the hub | 710 of 710 changed lines are `version:` fields |
| Blast radius contained | `git status --porcelain` over the hub before the run | 0 dirty files; the other session's 94 dirty files are in a disjoint lane |
| Apply accounting | `apply` output | 363 files: 355 updated, 8 already equal |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The build segment is off by one for every reconciled file the moment this commit lands, so a
`verify` run afterwards reports build-only mismatches again. This is the contract's expected
behavior and is deliberately not chased.

Only this hub was reconciled. Other skills carry the same class of era drift and were left alone,
because the contract permits reconciling a skill and forbids sweeping the fleet.
<!-- /ANCHOR:limitations -->

---


