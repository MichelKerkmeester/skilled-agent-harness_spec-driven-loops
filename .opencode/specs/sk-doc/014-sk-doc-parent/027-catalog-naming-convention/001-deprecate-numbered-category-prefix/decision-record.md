---
title: "Decision Record: numbered category-prefix deprecation"
description: "The load-bearing decisions for the NN-- category-folder deprecation: hard rename, tolerate-then-rename sequencing, number-agnostic leaf classification, the changelog/history exclusion boundary, and a no-new-numbers regression guard."
importance_tier: "important"
contextType: "decision"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded 6 decisions"
    next_safe_action: "Proceed to implementation"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: Numbered Category-Prefix Deprecation

## ADR-001 — Hard rename, no compatibility aliases

**Decision.** Rename each numbered folder to its bare slug and delete the numbered name; do **not** create
symlinks, dual entries, or a deprecation grace period.

**Why.** No consumer parses the number (research.md, B), and the migration rewrites every live reference in the
same pass, so there is no window in which an alias would be needed. Aliases would themselves become a new thing
to keep in sync. Git history preserves the old paths for anyone who needs them.

## ADR-002 — Tolerate-both, then rename (sequencing)

**Decision.** Land the number-agnostic classifier + the dropped convention mandate (Phases 001–002) **before**
renaming any folder (Phase 004). The classifier accepts both `NN--slug` and `slug` during the transition.

**Why.** The validator downgrades a de-numbered leaf to `readme` and silently drops its checks
(`validate_document.py:129,135`). If the rename landed first, every renamed leaf would lose validation until the
regex caught up — an invalid intermediate state. Making the classifier tolerant first means every commit in the
sequence validates cleanly. Rejected alternative: one atomic mega-commit (GPT-D's literal recommendation) —
correct in end-state but unreviewable and un-bisectable at ~6,500 edits.

## ADR-003 — Classify catalog/playbook leaves by structure, not by number

**Decision.** Change leaf classification from "immediate parent matches `^\d{2}--`" to "the file sits in a
*subfolder* of `feature_catalog/` (resp. `manual_testing_playbook/`) — i.e. its parent is not the catalog root
itself." This is number-agnostic and still excludes the root `feature_catalog.md` index.

**Why.** It is the minimal change that (a) keeps the numbered form valid during transition, (b) makes the
de-numbered form valid, and (c) preserves the existing exclusion of the root index file. Applies identically to
both `validate_document.py` copies (`scripts/` and `shared/scripts/`).

## ADR-004 — Changelog & history stay numbered (exclusion boundary)

**Decision.** The migration's reference-rewrite **excludes**: any path segment `z_archive/`; files named
`CHANGELOG*` / `changelog*`; spec-folder history and `implementation-summary.md` narrative that records prior
folder names; and this packet's own `research.md` / this file (which cite numbered paths as evidence).

**Why.** Those surfaces document *what folders were called at the time*. Rewriting them would falsify the
historical record and break the "changelog is truth" principle. The deny-list is encoded in the Phase 003
script and asserted in Phase 005 (no in-scope numbered folder remains; excluded surfaces are untouched).

## ADR-005 — No-new-numbers regression guard

**Decision.** Add a guard (a check the sk-doc validator/CI runs) that FAILS when a **newly introduced**
`feature_catalog/NN--*/` or `manual_testing_playbook/NN--*/` folder appears. Grandfather nothing — after
Phase 004 there are no in-scope numbered folders, so any new one is a regression.

**Why.** Deprecation without a guard silently rots back as authors copy old examples. The guard makes the
de-numbered form self-enforcing. It lives with the classifier (Phase 002) so a single check owns the rule.

## ADR-006 — Slug is the canonical, sole naming form

**Decision.** The descriptive slug (`mcp-tool-surface`, `read-path-freshness`) is the only documented form in
`create-feature-catalog`, `create-manual-testing-playbook`, their templates, and the `/create:*` generators.
Ordering is documented as owned by the root index table, not the folder name.

**Why.** Removes the renumber-on-insert churn that motivated the deprecation; aligns the docs with the guard.

## ADR-007 — Adapt the proven engine from the archived snippet-denumbering packet

**Decision.** The Phase 003 migration script is adapted from `skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering`'s `denumber-snippets.cjs` — a complete, merged-to-main engine (rename map, collision check, word-boundary reference sweep, manifests, dry-run) — retargeted from snippet *files* to category *folders*.

**Why.** Packet 108 already de-numbered the per-feature snippet *files* (`001-foo.md` → `foo.md`) repo-wide and **deliberately kept the numbered category folders** — this packet is its exact complementary follow-on (folders, not files). Reusing that proven engine beats authoring a new one blind. Two facts inherited from 108: (1) its D2 decision "**include** the historical spec-folder links" confirms this packet's deny-list is *path-based* (`z_archive/`, `CHANGELOG*`, this packet's evidence) rather than "all history" — active spec-folder cross-links ARE rewritten so nothing 404s; (2) the exact live count is **391** category folders (the `03--5d-scorer` slug begins with a digit, which a `[a-z]`-anchored scan misses); the script computes the map from the live tree, so it is self-correcting.

**Guard activation note (ADR-005 addendum).** The no-new-numbers guard ships as a standalone opt-in check in Phase 002 (it necessarily reports the 391 pre-migration folders as violations while they still exist); Phase 005 wires it as a blocking gate only after Phase 004 leaves the tree clean.
