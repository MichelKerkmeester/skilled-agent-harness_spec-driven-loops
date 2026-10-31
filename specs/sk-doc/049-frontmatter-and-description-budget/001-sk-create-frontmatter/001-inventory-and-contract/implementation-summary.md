---
title: "Implementation Summary: Frontmatter Consumer Inventory and Ownership Boundary"
description: "A reproducible probe found every reference to the frontmatter template spec and the versioning rules across .opencode/: 83 lines in 40 files, written in five different forms. Classifying them closed the packet's central open question — no consumer parses either file at run time — and fixed the ownership boundary the next two phases build on."
trigger_phrases:
  - "frontmatter consumer inventory summary"
  - "frontmatter ownership boundary decision"
  - "frontmatter run-time parser finding"
  - "no consumer parses frontmatter"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/001-inventory-and-contract"
    last_updated_at: "2026-09-01T10:43:26Z"
    last_updated_by: "implementation"
    recent_action: "Authored the frontmatter consumer inventory and ownership boundary"
    next_safe_action: "Proceed to phase 002 (mode scaffold)"
    blockers: []
    key_files:
      - "inventory/consumer-inventory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-inventory-and-contract"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 001-inventory-and-contract |
| **Completed** | 2026-09-01 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase produced one artifact: `inventory/consumer-inventory.md`, a reproducible, line-exact inventory
of every reference to the two frontmatter documents the next phase moves. It answers the packet's three
requirements directly — every reference is listed, every run-time parser is named (there are none), and
every consumer carries an owned-or-shared classification with a reason — and it corrects the packet's own
premise: the two scripts assumed to parse the file at run time only ever cite its path in a docstring or
an operator-facing string.

### The Reference Inventory

A single grep probe — `grep -ranI --exclude-dir=.git --exclude-dir=node_modules -E
'frontmatter-(templates|versioning)' .opencode/ | grep -v '/benchmark/reports/'` — found 83 matching
lines across 40 files. The `-a` flag is load-bearing: grep silently returns nothing on a file carrying a
NUL byte, with no warning. A Python classifier then sorted every line into one of five written forms
(markdown link, skill-relative-in-string, repo-absolute, bare-relative, bare-name), because 22 of the 54
live references are not markdown links, and a rewrite assuming only that form would miss them.

Every line then landed in exactly one of four buckets: 54 live consumer references across 34 files that
phase 003 repoints, 4 internal cross-links inside the two moving documents that survive the move unedited
(because `assets/` and `references/` stay siblings under the new mode), 13 frozen-history or out-of-scope
lines, and 12 bare-name mentions that are not references at all. The four buckets sum to 83 exactly.

### The Run-Time Parser Finding

REQ-002 asked for every consumer that parses the file at run time, on the premise that at least one
exists. There is none. `shared/scripts/quick_validate.py` opens exactly one file — the `SKILL.md` under
validation, at line 172 — and carries the four frontmatter paths only in a module docstring and in
strings it prints to the operator; its own docstring states the constants are duplicated into Python
deliberately. `sk-create-skill/scripts/package_skill.py` reads `SKILL.md` and walks the packet's `*.md`
files but never opens either frontmatter document; its one reference sits inside a validation-failure
message. An exhaustive sweep found no other script that joins a `shared/assets` or `shared/references`
path with either filename. The real failure mode of a careless move is a stale path printed to an
operator, not a crashed run.

### The Ownership Boundary

Both documents move whole to `sk-create-frontmatter/assets/` and `sk-create-frontmatter/references/`;
neither splits, because neither has a second constituency that would justify leaving part of it behind.
Three enforcement scripts — `frontmatter-version.mjs`, `check-frontmatter-versions.sh`, and
`quick_validate.py` — stay in the shared tier, because
`.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:38` hard-codes the shared path and resolves
it on every qualifying edit from outside the hub. The boundary in one line: the mode owns the contract,
the shared tier keeps the enforcement.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `inventory/consumer-inventory.md` | Created | The full reference inventory, the run-time parser finding, and the ownership boundary decision |

No other file was touched. This phase is read-only by design: spec.md's Out of Scope explicitly excludes
editing any consumer.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The probe and classifier are plain shell/Python one-offs, not new tooling — the deliverable is the
finding, not a script to maintain. The probe and classification were run twice within the same
investigation session and produced the identical 83-line, 40-file count with the identical five-form
split before this phase closed, satisfying SC-001. The run-time parser question (REQ-002, SC-003) was
closed by reading the two candidate scripts line by line rather than by assumption. A
`resolve_skill_markdown_links.py --repo-root . --scope .opencode/skills/sk-doc` baseline was captured
before any move: 113 failures, of which exactly one names a frontmatter path — the already-broken
`sk-create-changelog/assets/changelog-template.md:286` link — giving phase 003 a number to hold itself to
(zero frontmatter-related failures, total not exceeding 112).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Both frontmatter documents move whole; neither splits | The template spec is one eleven-class contract and the versioning rules are one derivation algorithm — splitting either would produce two files that each defer to the other |
| Three enforcement scripts stay in the shared tier | `post-edit-router.cjs:38` hard-codes `check-frontmatter-versions.sh`'s current path and resolves it from outside the hub on every qualifying edit; moving the scripts would break a runtime hook to gain nothing |
| Target homes are `sk-create-frontmatter/assets/` and `sk-create-frontmatter/references/` as siblings | The 4 internal cross-links between the two documents (inventory §5d) then survive the move unedited; any other arrangement rewrites four working links for nothing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reproducible probe rerun within the same session | PASS — identical 83 lines / 40 files and five-form split both times (SC-001) |
| Four-bucket partition sum | PASS — 54+4+13+12=83, every line in exactly one bucket (SC-002) |
| Run-time parser sweep of `quick_validate.py` and `package_skill.py` | PASS — neither opens either frontmatter document; both named explicitly (SC-003) |
| `resolve_skill_markdown_links.py --repo-root . --scope .opencode/skills/sk-doc` (pre-move baseline) | PASS — 113 failures recorded, exactly one names a frontmatter path |
| Scope check: no consumer file edited | PASS — `git status --porcelain` for the phase folder shows only the new `inventory/` untracked directory |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A live rerun of the probe today no longer reproduces 83/40.** Phase 002 has since scaffolded
   `sk-create-frontmatter/{SKILL.md,README.md,references/README.md,changelog/v1.0.0.0.md}` in the live
   tree, adding new bare-name mentions of both filenames. That is a downstream effect of later work
   already in progress, not a defect in this phase's own snapshot — SC-001's reproduction claim is scoped
   to the phase-001 investigation session.
2. **The outbound-link scan is bonus scope, not a requirement.** While inventorying inbound references,
   the investigation also scanned both moving documents for links pointing away from them and found 4
   that break on the move (`inventory/consumer-inventory.md` §5e). REQ-001 asks only for references to
   the two files, so this finding is recorded for phase 003's benefit but is not represented as its own
   acceptance criterion here.
3. **A pre-existing broken link was found, not fixed.**
   `sk-create-changelog/assets/changelog-template.md:286` links to `./frontmatter-templates.md`, which
   does not exist in that directory. Fixing it is explicitly phase 003's work (repointing is what fixes
   it); this phase only records it.
<!-- /ANCHOR:limitations -->

---
