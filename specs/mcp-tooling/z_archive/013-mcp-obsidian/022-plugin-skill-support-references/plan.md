---
title: "Plugin skill support — references for charts, dataview, excalidraw, git, outliner, Minimal"
description: "Research the six newly installed artifacts and author per-plugin reference sets (index, data-model, workflows, troubleshooting) plus plugin-operation-logic rows."
trigger_phrases:
  - "plugin skill support references"
  - "charts dataview excalidraw git outliner minimal references"
  - "plugin reference sets"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/022-plugin-skill-support-references"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase documentation"
    next_safe_action: "Execute the phase work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/022-plugin-skill-support-references"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan — Plugin skill support — references for charts, dataview, excalidraw, git, outliner, Minimal

<!-- ANCHOR:summary -->
## 1. SUMMARY

Research each artifact from its GitHub repo, README, manifest, and release facts (charts block syntax; dataview DQL and metadata model; excalidraw `.excalidraw.md` embedded JSON; obsidian-git config + vault git semantics; outliner list-indentation model; Minimal theme file layer), then author per-plugin reference sets under `references/plugins/{charts,dataview,excalidraw,git,outliner,minimal}/` mirroring the existing iconic/health-md pattern (index, data-model, workflows, troubleshooting with frontmatter + version), and extend `references/plugins/plugin-operation-logic.md` data map with the six rows. Rollback is a git revert.

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