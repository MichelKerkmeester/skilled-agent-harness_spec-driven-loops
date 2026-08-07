---
title: "Spec: Deterministic dry-run rename engine for numbered snippet filenames"
description: "Phase 003 of the numbered-snippet-filename deprecation. Author one deterministic rename engine, denumber-snippet-filenames.mjs, adapted from the proven 108 denumber-snippets.cjs: enumerate exactly the 111 in-scope per-scenario snippet files across 9 skill packets (excluding the 20 legitimate system-spec-kit single-digit files), abort on any collision before writing, derive and inject a stage: routing|holdout|negative frontmatter field for the 63 files that encode that grouping in their filename, and sweep the 3 hub-routing root-index tables that cite the old filenames. Corrects a deny-list bug inherited from 108 (a stale, nonexistent 999-sk-doc-parent self-exclusion path) to reference the current 014-sk-doc-parent packet. Default mode is a DRY RUN that mutates nothing and emits a rename map, per-file diff, stage-injection preview, and collision/safety report. Tooling-only phase — Phase 004 runs it with mutation enabled."
trigger_phrases:
  - "de-numbering snippet filenames migration script"
  - "dry-run rename engine for snippet filenames"
  - "stage frontmatter injection for routing holdout negative"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/003-migration-tooling"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Implement the rename engine + dry-run report"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Deterministic Dry-Run Rename Engine for Numbered Snippet Filenames

> **Phase adjacency** (grouping order under the parent, not a runtime dependency): predecessor `002-generator-alignment`; successor `004-execute-migration`.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 026/003-migration-tooling |
| **Level** | 2 |
| **Status** | Complete |
| **Phase** | 003 of 005 (tooling) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The numbered-snippet-filename deprecation touches 111 per-scenario snippet files across 9 skill packets
(`feature_catalog/`/`manual_testing_playbook/` category leaves) plus 3 hub-routing root-index tables that cite
them by filename. Doing this rename by hand is error-prone against two load-bearing hazards: the
deep-improvement Lane C skill-benchmark loader (`load-playbook-scenarios.cjs`) currently gates ingestion on a
`^\d{3}-.*\.md$` filename match, so a naive strip would silently drop scenarios from the corpus unless the
loader is made number-agnostic first (Phase 001); and the 88 files in the routing-recall / hub-routing
categories carry a routing/holdout/negative (R/H/N) grouping (an initial estimate said 63; the live tree has 88,
per `decision-record.md` ADR-004) that must be preserved as an explicit `stage:` frontmatter field rather than
lost with the number. This phase authors a single deterministic
rename engine, `denumber-snippet-filenames.mjs`, adapted from the proven `013-catalog-playbook-snippet-denumbering`
packet's `denumber-snippets.cjs`. Unlike that script's generic per-tree walk, this engine enumerates only the
scoped 111 in-scope files across the 9 named packets, explicitly excluding the 20 legitimate system-spec-kit
single-digit files (topic-name / reading-order digits, not the anti-pattern). Its default mode is a DRY RUN that
mutates nothing and emits a rename map, per-file reference diff, a stage-injection preview, and a
collision/safety report. It also corrects a deny-list bug carried over from 108: that script's self-exclusion
referenced a stale, nonexistent `999-sk-doc-parent` path (from before this hub was renumbered); 026's deny-list
must reference the current `sk-doc/014-sk-doc-parent` packet path so the tooling never accidentally rewrites its
own spec-folder evidence. Phase 004 is the only place this script runs with mutation (`--apply`) enabled.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
**In scope — author the rename engine + its dry-run report:**
- One deterministic script (planned location `003-migration-tooling/scripts/denumber-snippet-filenames.mjs`;
  see plan.md §3) adapted from the archived `013-catalog-playbook-snippet-denumbering/002-migration-tooling-and-dry-run/tooling/denumber-snippets.cjs`,
  covering exactly the 111 in-scope files across 9 packets (research.md, A):
  - `cli-external/cli-claude-code/manual_testing_playbook/intra-routing-recall` (10; holdout 008-009, negative 010)
  - `cli-external/cli-opencode/manual_testing_playbook/intra-routing-recall` (10; holdout 008-009, negative 010)
  - `cli-external/manual_testing_playbook/hub-routing` (5; holdout 004-005)
  - `mcp-tooling/manual_testing_playbook/hub-routing` (6; holdout 005-006)
  - `mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/intra-routing-recall` (8; holdout 006-007, negative 008)
  - `mcp-tooling/mcp-click-up/manual_testing_playbook/intra-routing-recall` (7; holdout 005-006, negative 007)
  - `mcp-tooling/mcp-figma/manual_testing_playbook/intra-routing-recall` (9; holdout 007-008, negative 009)
  - `sk-code/code-review/manual_testing_playbook/intra-routing-recall` (7)
  - `sk-code/code-opencode/manual_testing_playbook/{authoring-verification, config-hooks, language-standards}` (9)
  - `sk-code/code-webflow/manual_testing_playbook/{implementation-quality, performance-animation, deployment-forms-video, language-standards}` (13)
  - `sk-code/code-quality/manual_testing_playbook/quality-gate` (1)
  - `sk-prompt/manual_testing_playbook/hub-routing` (4)
  - `system-deep-loop/deep-improvement/manual_testing_playbook/intra-routing-recall` (10)
  - `system-deep-loop/deep-research/manual_testing_playbook/intra-routing-recall` (8)
  - `system-deep-loop/deep-review/manual_testing_playbook/intra-routing-recall` (4)
- **Enumeration** is a fixed, scoped walk of only the 9 named packet paths above — not a generic regex sweep of
  the whole tree — so it structurally cannot touch the 20 out-of-scope system-spec-kit single-digit files.
- **Deny-list**: `z_archive/`, files named `CHANGELOG*`/`changelog*`, spec-folder history/`implementation-summary.md`
  narrative, this packet's own `research.md`/`decision-record.md`, and the current `sk-doc/014-sk-doc-parent`
  packet path (correcting 108's stale `999-sk-doc-parent` self-exclusion, per ADR-006/ADR-008).
- **Collision-abort**: computed rename map is checked for any two stripped names colliding within a parent
  category folder before anything is written; aborts the run if found.
- **`stage:` frontmatter derivation + injection**: for the 88 R/H/N-category files (the `intra-routing-recall`
  / `hub-routing` categories; operator-amended from an initial 63 estimate, ADR-004), derive
  `stage: holdout|negative|routing` from the filename token or category and stage it as a frontmatter edit in the
  dry-run plan (default `routing` for untagged files inside those categories, per operator Decision A).
- **Reference sweep**: rewrite the 3 hub-routing root-index tables (`cli-external`, `mcp-tooling`, `sk-prompt`)
  that cite the old filenames, word-boundary safe (adapted from 108's boundary-safe basename replace).
- The dry-run report format: rename map, per-file diff, stage-injection preview, collision report, and an
  excluded-surface summary.

**Out of scope:** actually mutating the tree (Phase 004 runs the script with `--apply` — dry-run only here);
the number-agnostic loader + `stage:` parsing change (Phase 001); the generator alignment fix (Phase 002); the
recursive re-validation and Lane C re-benchmark (Phase 005).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **REQ-001:** In dry-run (the default) the script mutates nothing and prints a **complete rename map** plus a
  **per-file reference-change diff** for every file it would touch.
- **REQ-002:** Enumeration is **scoped to exactly the 111 in-scope files** across the 9 named packet paths — not a
  generic tree walk — so the 20 legitimate system-spec-kit single-digit files are structurally excluded, and the
  deny-list references the **current `sk-doc/014-sk-doc-parent`** packet path, not the stale, nonexistent
  `999-sk-doc-parent` path the 108 script's self-exclusion carried.
- **REQ-003:** A **collision check** aborts the run if any two stripped names would collide within a parent category
  folder (expected zero per research.md, A); the check is reported explicitly, not assumed.
- **REQ-004:** For the **88 routing-recall / hub-routing files** (operator-amended from an initial 63 estimate; see
  `decision-record.md` ADR-004), the script derives and previews a `stage: holdout|negative|routing` frontmatter
  injection from the filename token or category (14 holdout, 5 negative, 69 routing); the 23 feature-oriented
  files outside those categories receive no `stage:` field.
- **REQ-005:** The **reference sweep** rewrites the **3 hub-routing root-index tables** (`cli-external`, `mcp-tooling`,
  `sk-prompt`) in the same pass, word-boundary safe, so it does not false-positive on substrings.
- **REQ-006:** The script is **re-runnable / idempotent** (a second dry-run after a partial run reflects only the
  remaining work — no double-stripping, no duplicate `stage:` injection) and **reversible via git**.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. A dry-run against the current tree reports exactly **111 renames** across the 9 named packets, **88 `stage:`
   injections** (14 holdout / 5 negative / 69 routing) under `--stage-scope=all`, **3 hub-routing root-index
   tables** rewritten, **0 collisions**, and **0 mutations to any excluded surface** (deny-list clean, including
   the corrected `014-sk-doc-parent` path).
2. `validate.sh --strict` on this phase folder is Errors 0.
3. The script is reviewed (dry-run output inspected against research.md's 111 / 88 / 14 / 5 / 3 / 0 counts)
   **before** Phase 004 runs it with mutation enabled.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Risk:* an over-broad word-boundary sweep touches a numbered string inside one of the 20 out-of-scope
  system-spec-kit single-digit files or an excluded surface → mitigated by R2's scoped-not-generic enumeration
  plus the dry-run's excluded-surface summary being inspected before Phase 004.
- *Risk:* repeating 108's stale self-exclusion bug (a deny-list entry pointing at a path — `999-sk-doc-parent` —
  that no longer exists, since this hub was renumbered to `014-sk-doc-parent`) → mitigated by R2 hardcoding the
  deny-list against the current path and covering the bug with a regression test (see plan.md §5).
- *Risk:* `stage:` derivation misclassifies a file whose ordinal/token doesn't cleanly map to holdout/negative
  → mitigated by R4 requiring the injection to appear in the reviewed dry-run diff, never silently applied.
- *Dependency:* Phase 001 (number-agnostic loader + optional `stage:` field parsing) and Phase 002 (generator
  alignment) should land first so this tooling is authored against the settled tolerant-loader contract, though
  003 itself is tooling-only and does not touch the loader or generator.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None. Script location is proposed in plan.md §3 (packet-local `scripts/`), reversible to a shared sk-doc scripts
area if review prefers it, mirroring the 025 analog decision.
<!-- /ANCHOR:questions -->
