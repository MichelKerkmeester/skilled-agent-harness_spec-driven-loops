---
title: "Plan: deterministic dry-run rename engine for numbered snippet filenames"
description: "Author one deterministic rename engine (dry-run default), adapted from the proven 108 denumber-snippets.cjs, that enumerates the scoped 111 in-scope snippet files across 9 packets, aborts on collision, derives+injects the stage: field for the 63 R/H/N-structured files, sweeps the 3 hub-routing root-index tables, and corrects 108's stale 999-sk-doc-parent deny-list bug against the current 014-sk-doc-parent path."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/003-migration-tooling"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan authored"
    next_safe_action: "Implement the rename engine + dry-run report"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: Deterministic Dry-Run Rename Engine for Numbered Snippet Filenames

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
Build one deterministic rename engine, adapted from `108-catalog-playbook-snippet-denumbering`'s proven
`denumber-snippets.cjs`, whose default is a DRY RUN that mutates nothing. Unlike 108's generic per-tree scan,
this engine enumerates exactly the scoped 111 in-scope files across the 9 named packets, aborts on any
collision before writing, derives and injects a `stage: routing|holdout|negative` frontmatter field for the 63
files that encode that grouping, and sweeps the 3 hub-routing root-index tables that cite the old filenames. It
corrects a deny-list bug carried from 108 (a stale, nonexistent `999-sk-doc-parent` self-exclusion path) to
reference the current `sk-doc/014-sk-doc-parent` packet. No tree mutation here — Phase 004 runs it with `--apply`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
Dry-run mutates nothing (verified: `git status` clean after a dry-run); enumeration matches exactly the
111-file scoped list across the 9 named packets (not a broad regex over the whole tree); collision check
reports 0; deny-list excludes `z_archive/` / `CHANGELOG*` / history / this packet's own evidence and correctly
references `sk-doc/014-sk-doc-parent` (not the stale `999-sk-doc-parent` path 108 carried); `stage:` injection is
previewed for the 88 routing-recall/hub-routing files (14 holdout / 5 negative / 69 routing; operator-amended
from 63, ADR-004); the 3 hub-routing root-index tables show correct rewritten rows in the diff; report counts
land at 111 / 88 / 3 / 0; `validate.sh --strict`
Errors 0 on this phase folder; comment hygiene respected in the script (durable WHY only, no spec/packet ids in
comments).
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
One script, planned at `003-migration-tooling/scripts/denumber-snippet-filenames.mjs` (packet-local so the
one-time migration is scoped and reviewable; reversible to a shared sk-doc scripts area if review prefers),
adapted from the archived `108-catalog-playbook-snippet-denumbering/002-migration-tooling-and-dry-run/tooling/denumber-snippets.cjs`.
The key structural difference: 108 discovered category directories by scanning an entire `--tree` argument for
any `^\d{2,3}--` folder and renamed every numbered file found inside; this engine instead takes a **fixed,
scoped enumeration** of the 9 named packet paths and only considers files under those, so it structurally
cannot match the 20 out-of-scope system-spec-kit single-digit files even though some of those also start with a
digit. Pipeline stages, each a pure function over the scoped file list:
1. **Enumerate** — walk only the 9 named packet paths' `feature_catalog`/`manual_testing_playbook` category
   folders; match `^\d{3}-(.+)\.md$`; build the rename map (`oldPath → newPath`, stripped basename). Assert
   exactly 111 entries against research.md.
2. **Deny-list filter** — a predicate that excludes any candidate under `z_archive/`, named `CHANGELOG*` /
   `changelog*`, spec-folder history / `implementation-summary.md`, this packet's own `research.md` /
   `decision-record.md`, and (correcting 108's bug) the **current** `sk-doc/014-sk-doc-parent` packet path — not
   the stale, nonexistent `999-sk-doc-parent` path the 108 script's self-exclusion referenced.
3. **Collision-check** — group stripped names by parent category folder; abort if any parent has two entries
   collapsing onto one slug (expected 0, reported explicitly).
4. **Stage derivation** — for the 63 R/H/N-structured files (`intra-routing-recall` / `hub-routing` categories),
   read the ordinal + filename token (e.g. `holdout`, `negative`) and compute the `stage:` frontmatter value
   (`holdout` / `negative` / `routing` default); files outside these categories receive no `stage:` field.
5. **Reference sweep** — adapted from 108's boundary-safe basename replace: rewrite the 3 hub-routing
   root-index table rows (`cli-external`, `mcp-tooling`, `sk-prompt`) that cite the old filenames.
6. **Report / apply** — dry-run prints the rename map + per-file diff + stage-injection preview + collision +
   excluded-surface summary; `--apply` (used only by Phase 004) executes the rename, frontmatter write, and
   index-table rewrites.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Enumerate the 111 in-scope files from the 9 named packet paths; assert the count against research.md.
2. Implement the collision check and the corrected deny-list predicate (`014-sk-doc-parent`, not the stale
   `999-sk-doc-parent`); unit-cover both, including a regression case for the 108 bug.
3. Implement stage derivation for the routing-recall/hub-routing files (holdout/negative token detection,
   `routing` by category), stamping all 88 under `--stage-scope=all`, and the frontmatter-injection edit plan.
4. Implement the reference sweep for the 3 hub-routing root-index tables, word-boundary safe.
5. Implement the dry-run report (rename map + per-file diff + stage preview + collision + excluded-surface
   summary) and the `--apply` gate; assert idempotency.
6. Run the dry-run; reconcile the reported counts (111 / 88 / 14 / 5 / 3 / 0) against research.md; validate
   `--strict`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run the dry-run against the current tree and diff its counts against research.md (111 renames, 88 `stage:`
injections [14 holdout / 5 negative / 69 routing], 3 root-index tables rewritten, 0 collisions). Assert
`git status` is clean afterward (R1: zero mutation). Grep the per-file diff for any of the 20 out-of-scope
system-spec-kit files or an excluded surface (`z_archive/`, `CHANGELOG`, history, this packet's evidence) → must
be empty (R2). Feed a synthetic colliding pair through the collision check → must abort (R3). Feed a synthetic
`999-sk-doc-parent`-style stale path through the deny-list predicate → must NOT match (regression test for the
108 bug); feed the real `sk-doc/014-sk-doc-parent` path → must match. Inspect the `stage:` injection preview for
one sample holdout file, one negative file, and one plain-routing file → each resolves to the correct value
(R4). Re-run the dry-run twice → byte-identical output (R6 idempotency). `validate.sh --strict` on this phase
folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Depends on Phase 001 (number-agnostic loader + optional `stage:` field parsing) and Phase 002 (generator
alignment) landing first, per the packet's sequencing invariant — this tooling is authored against the settled
tolerant-loader contract even though it does not itself touch the loader or generator. Feeds Phase 004, which
runs this script with `--apply`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
The script itself mutates nothing in dry-run, so authoring it is inherently reversible (`git checkout` the
script file). When Phase 004 later runs `--apply`, reversal is `git reset --hard` / `git revert` of that
commit — the migration is a set of file renames plus frontmatter/text rewrites with no out-of-band state.
<!-- /ANCHOR:rollback -->
