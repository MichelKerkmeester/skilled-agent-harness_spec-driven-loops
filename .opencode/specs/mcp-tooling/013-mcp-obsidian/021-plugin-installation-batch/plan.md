---
title: "Plugin installation batch — charts, dataview, excalidraw, git, outliner, Minimal"
description: "Install and enable six Obsidian community plugins plus the Minimal theme across all three vaults, with recorded versions."
trigger_phrases:
  - "plugin installation batch"
  - "charts dataview excalidraw git outliner minimal install"
  - "minimal theme install"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/021-plugin-installation-batch"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase documentation"
    next_safe_action: "Execute the phase work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/021-plugin-installation-batch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan — Plugin installation batch — charts, dataview, excalidraw, git, outliner, Minimal

<!-- ANCHOR:summary -->
## 1. SUMMARY

Install the latest release of obsidian-charts (phibr0/obsidian-charts), dataview (blacksmithgu/obsidian-dataview), excalidraw (zsviczian/obsidian-excalidraw-plugin), obsidian-git (Vinzent03/obsidian-git), outliner (vslinko/obsidian-outliner) and the Minimal theme (kepano/obsidian-minimal) into all three vaults (main, iCloud Michel Kerkmeester, Barter): fetch release assets via the GitHub API, write plugin files under `<vault>/.obsidian/plugins/<id>/` and theme files under `<vault>/.obsidian/themes/Minimal/`, append plugin ids to `community-plugins.json`, set `cssTheme: Minimal` in `appearance.json`, and record every installed version as evidence for the reference phases. Rollback is a git revert.

---

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Artifact presence | Files land at the stated paths | find / ls |
| Format | No decimal headings, no invented keys, full frontmatter | rg + review |
| Links | All new links resolve | check-markdown-links.cjs |
| Voice | No em dashes or semicolons in prose | rg |
| Packaging | Leaf manifest fresh where routing changes | generate-leaf-manifest.cjs --check |
| Phase docs | validate.sh errors zero | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Target | Change |
|--------|--------|
| `references/plugins/{charts,dataview,excalidraw,git,outliner,minimal}/` | New reference sets (phases 022) |
| `assets/plugins/{charts,dataview,excalidraw,git,outliner,minimal}/` | New example assets (phase 023) |
| `feature-catalog/plugins/` + root catalog | Six new cards + counts (phase 023) |
| `manual-testing-playbook/plugin-tie-ins/` | Six new scenarios (phase 023) |
| `SKILL.md` router + resource map | Six new intents (phase 024) |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Inventory sources and patterns |
| Implementation | Execute the phase focus |
| Verification | Run the quality gates |

Sequenced in tasks.md.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Fixture and throwaway-vault validation only. Real vaults are never mutated beyond the installation batch (phase 021). Documentation gates: link guard, heading grep, package validator, validate.sh.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Prior phases in the chain | Missing inputs | Phase-map ordering + handoff criteria |
| Plugin sources | Stale facts | Pin to release tags and mark `VERIFY` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit to restore prior state. No vault content participates beyond plugin enablement recorded in phase 021.
<!-- /ANCHOR:rollback -->