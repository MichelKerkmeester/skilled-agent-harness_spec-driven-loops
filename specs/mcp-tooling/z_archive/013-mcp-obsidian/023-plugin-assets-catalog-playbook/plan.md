---
title: "Plugin assets, catalog cards, and playbook scenarios for the six additions"
description: "Author example assets, six feature-catalog plugin cards, and manual-testing-playbook tie-in scenarios for charts, dataview, excalidraw, git, outliner, Minimal."
trigger_phrases:
  - "plugin assets catalog playbook"
  - "charts dataview excalidraw git outliner minimal catalog"
  - "plugin tie in scenarios"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/023-plugin-assets-catalog-playbook"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase documentation"
    next_safe_action: "Execute the phase work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/023-plugin-assets-catalog-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan — Plugin assets, catalog cards, and playbook scenarios for the six additions

<!-- ANCHOR:summary -->
## 1. SUMMARY

Author copyable example assets under `assets/plugins/{charts,dataview,excalidraw,git,outliner,minimal}/` (charts block example, dataview query example, excalidraw `.excalidraw.md` skeleton, obsidian-git config example, outliner list example, Minimal snippet example), add six feature-catalog plugin cards under `feature-catalog/plugins/` with canonical taxonomy types, add manual-testing-playbook tie-in scenarios (OBS-016..OBS-021) under `manual-testing-playbook/plugin-tie-ins/`, update the root catalog counts and the README plugin knowledge layer, and write the changelog entry. Rollback is a git revert.

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