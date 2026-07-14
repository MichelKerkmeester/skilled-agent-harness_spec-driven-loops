---
title: "Resource Map [skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering/resource-map]"
description: "Blast-radius ledger for de-numbering per-feature snippet files across feature catalogs and manual testing playbooks: the sk-doc contract surfaces, the 20 migration target trees, referrers, and the frozen out-of-scope set."
trigger_phrases:
  - "resource map"
  - "files touched"
  - "snippet denumbering blast radius"
  - "catalog playbook migration paths"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored 133 parent resource map during scaffold"
    next_safe_action: "Update path ledger as phases execute"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total snippet files to rename**: 1,531 (583 feature-catalog + 948 manual-testing-playbook)
- **Migration target skills**: 20 (10 with catalogs, all 20 with playbooks)
- **Category folders kept (numbered)**: 261 (83 catalog + 178 playbook)
- **Known rename collisions**: 2 pairs (4 files) — all in `system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/`
- **External referrers in scope**: ~822 (.md links) = ~79 active-skill (changelogs, references, root docs, create-commands) + ~743 historical `.opencode/specs/**` (INCLUDED per D2)
- **Git isolation (D3)**: all skill-file mutations run in a dedicated worktree `.worktrees/NNNN-snippet-denumbering`, merged to `main` after phase 006 validates
- **Scope**: parent-aggregate map of every path class this packet touches across phases 001–006; execution runs in a dedicated worktree (excludes only `z_archive`, `z_future/backup`, and the unrelated `.worktrees/000N-*` skill copies).
- **Generated**: 2026-06-06 (updated after D1–D4 confirmed)

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> **Mode**: parent-aggregate (one map for all phases). Per-tree rename inventories live in phase 002's dry-run manifest, not here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> The sk-doc creation standards — the canonical contract phase 001 rewrites.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/sk-doc/references/feature_catalog_creation.md` | Updated | OK | §3 invariants, §3 naming rule, §4 numbering line → drop `NNN-` file prefix; add root-doc-defines-order rule (P001) |
| `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md` | Updated | OK | §3 invariants/tree, §3 numeric-slug line → de-number; keep `NN--` category dirs (P001) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

> `create:*` command docs + assets that instruct catalog/playbook creation.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/create/feature-catalog.md` | Updated | OK | De-number any snippet-filename guidance (P001) |
| `.opencode/commands/create/testing-playbook.md` | Updated | OK | Known referrer to numbered snippet examples (P001) |
| `.opencode/commands/create/assets/create_feature_catalog_{auto,confirm}.yaml` | Updated | OK | Align scaffold instructions to no-prefix filenames (P001) |
| `.opencode/commands/create/assets/create_testing_playbook_{auto,confirm}.yaml` | Updated | OK | Align scaffold instructions to no-prefix filenames (P001) |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> Migration targets. Each tree's per-feature snippet files (`NN--cat/NNN-slug.md`) are renamed to `NN--cat/slug.md`; category dirs unchanged. Counts = numbered snippet files per skill (catalog | playbook).

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/sk-doc/assets/feature_catalog/*.md` | Updated | OK | Root + snippet TEMPLATES — de-number `{NN}`/`{NNN}` placeholders (P001, not a rename) |
| `.opencode/skills/sk-doc/assets/testing_playbook/*.md` | Updated | OK | Root + snippet TEMPLATES — de-number `{NNN}` placeholders (P001) |
| `.opencode/skills/system-spec-kit/{feature_catalog,manual_testing_playbook}/**` | Renamed | OK | 673 files (308+365) — **largest**, phase 003; holds the 2 collisions |
| `.opencode/skills/mcp-click-up/{feature_catalog,manual_testing_playbook}/**` | Renamed | OK | 135 files (96+39) — phase 004 |
| `.opencode/skills/system-skill-advisor/{feature_catalog,manual_testing_playbook}/**` | Renamed | OK | 86 files (40+46) — phase 004 |
| `.opencode/skills/deep-review/{feature_catalog,manual_testing_playbook}/**` | Renamed | OK | 76 files (27+49) — phase 004 |
| `.opencode/skills/deep-improvement/{feature_catalog,manual_testing_playbook}/**` | Renamed | OK | 71 files (23+48) — phase 004 |
| `.opencode/skills/deep-ai-council/{feature_catalog,manual_testing_playbook}/**` | Renamed | OK | 64 files (32+32) — phase 004; uppercase `FEATURE_CATALOG.md` left as-is (out of scope) |
| `.opencode/skills/deep-research/{feature_catalog,manual_testing_playbook}/**` | Renamed | OK | 60 files (16+44) — phase 004 |
| `.opencode/skills/deep-loop-runtime/{feature_catalog,manual_testing_playbook}/**` | Renamed | OK | 56 files (27+29) — phase 004 |
| `.opencode/skills/system-code-graph/{feature_catalog,manual_testing_playbook}/**` | Renamed | OK | 36 files (14+22) — phase 005 |
| `.opencode/skills/cli-opencode/manual_testing_playbook/**` | Renamed | OK | 33 files — phase 005 |
| `.opencode/skills/cli-devin/manual_testing_playbook/**` | Renamed | OK | 28 files — phase 005 |
| `.opencode/skills/sk-prompt/manual_testing_playbook/**` | Renamed | OK | 28 files — phase 005 |
| `.opencode/skills/cli-codex/manual_testing_playbook/**` | Renamed | OK | 27 files — phase 005 |
| `.opencode/skills/cli-claude-code/manual_testing_playbook/**` | Renamed | OK | 26 files — phase 005 |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/**` | Renamed | OK | 26 files — phase 005 |
| `.opencode/skills/sk-code/manual_testing_playbook/**` | Renamed | OK | 24 files — phase 005 |
| `.opencode/skills/mcp-chrome-devtools/manual_testing_playbook/**` | Renamed | OK | 22 files — phase 005 |
| `.opencode/skills/sk-git/manual_testing_playbook/**` | Renamed | OK | 22 files — phase 005 |
| `.opencode/skills/sk-doc/manual_testing_playbook/**` | Renamed | OK | 20 files — phase 005 (sk-doc's own playbook) |
| `.opencode/skills/sk-code-review/manual_testing_playbook/**` | Renamed | OK | 18 files — phase 005 |
| `.opencode/skills/*/{feature_catalog,manual_testing_playbook}/*.md` (root docs) | Updated | OK | Root catalog/playbook files: rewrite links to renamed snippets (per-tree, P003–005) |
| `.opencode/skills/*/changelog/**`, `.opencode/skills/*/references/**` | Updated | OK | ~79 active-skill referrers to renamed snippets (P006 sweep) |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> This packet, PLUS the ~743 historical referrers under other `.opencode/specs/**` packets — now IN SCOPE per D2 (phase 006 sweep).

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/**` numbered-snippet referrers (~743; ~622 system-spec-kit, ~121 skilled-agent-orchestration) | Updated | OK | Rewrite numbered-snippet links per D2 (phase 006) |
| `.opencode/specs/skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering/spec.md` | Created | OK | Phase-parent spec |
| `.opencode/specs/skilled-agent-orchestration/133-.../resource-map.md` | Created | OK | This file |
| `.opencode/specs/skilled-agent-orchestration/133-.../00{1..6}-*/` | Created | OK | Six phase children |
| `.opencode/specs/skilled-agent-orchestration/133-.../{description,graph-metadata}.json` | Created | OK | Generated metadata (memory search + graph traversal) |
| `.opencode/specs/skilled-agent-orchestration/graph-metadata.json` | Updated | OK | Parent track gains `133` child link |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> The migration tooling (phase 002) + the validator touched in phase 001.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/skilled-agent-orchestration/133-.../scratch/denumber-snippets.*` | Created | PLANNED | Deterministic rename + reference-rewrite, dry-run, collision-abort (P002) |
| `.opencode/specs/skilled-agent-orchestration/133-.../scratch/*-manifest.*` | Created | PLANNED | Rename + ref-edit + collision manifests from dry-run (P002) |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Updated | OK | Line ~123 stale `NNN-feature.md` comment → de-numbered wording (validator logic unchanged; keys off `^\d{2}--` category dir, so de-numbering is safe) |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/sk-doc/assets/template_rules.json` | Updated | OK | Line ~556 description "under manual_testing_playbook/NN--category/" — drop file-number implication (P001) |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:author-instructions -->
## Frozen Out-of-Scope Set (do NOT touch)

Recorded here so phases never drift into them:

| Path / Class | Why frozen |
|------|------|
| `.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md` | Uppercase root anomaly — a separate convention bug, not this change (D4) |
| `.opencode/specs/z_future/code-graph-and-cocoindex/backup/**` catalogs + playbooks | Parked/backup copies, not active skill docs |
| `.worktrees/**` (0001-mcp-front-proxy, 0002-followups) | Separate git worktrees / branches |
| `**/z_archive/**` | Archived packets |
| Feature IDs in content (`M-219`, `EX-001`, …) | Scenario identifiers, not filenames |
| Category folders `NN--category-name/` | Kept numbered by design |

**Category precedence applied:** `Specs` > `Config` for spec-folder JSON; `Skills` > `Documents` for markdown under `.opencode/skills/**`. Omitted empty categories: READMEs, Agents, Tests, Meta.
<!-- /ANCHOR:author-instructions -->
