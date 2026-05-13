---
title: "Resource Map - Phase 001 Complete CocoIndex MCP Fork"
description: "Path ledger for planned and analyzed resources in the complete CocoIndex MCP fork phase."
trigger_phrases:
  - "027 phase 001 resource map"
  - "cocoindex complete fork resource map"
importance_tier: "important"
contextType: "resource-map"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored Phase 001 resource map"
    next_safe_action: "Refresh resource map after import manifest"
    blockers: []
    key_files: ["resource-map.md", "research.md", "plan.md"]
    completion_pct: 0
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Use this file as the blast-radius ledger for Phase 001. It lists analyzed, created, and planned files for the complete CocoIndex MCP fork.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 31
- **By category**: READMEs=3, Documents=9, Skills=5, Specs=9, Scripts=4, Config=1
- **Missing on disk**: 0 for analyzed/planning files; planned implementation paths exist after import
- **Scope**: complete `cocoindex-code` MCP-wrapper fork planning and future implementation blast radius
- **Generated**: 2026-05-10T00:00:00+02:00

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Planned` · `Renamed`.
> **Status vocabulary**: `OK` · `PLANNED`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/README.md` | Planned | OK | Update ownership and runtime docs |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | Planned | OK | Update local install flow |
| `specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-code-main/README.md` | Analyzed | OK | Upstream usage and MCP surface |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/CHANGELOG.md` | Analyzed/Planned | OK | Current local patch history and future version entry |
| `.opencode/skills/mcp-coco-index/NOTICE` | Analyzed/Planned | OK | Attribution and local modifications |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md` | Planned | OK | Update v0.2.33 + telemetry docs |
| `.opencode/skills/mcp-coco-index/references/settings_reference.md` | Planned | OK | Embedder params and runtime settings |
| `specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork/research.md` | Created | OK | Research basis |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/spec_kit/plan.md` | Analyzed | OK | `/spec_kit:plan` workflow contract |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:agents -->
## 4. Agents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/agents/` | Planned | OK | No direct changes expected |
<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/SKILL.md` | Analyzed/Planned | OK | Current fork statement and usage guidance |
| `.opencode/skills/mcp-coco-index/mcp_server/**` | Planned | OK | Complete fork root |
| `.opencode/skills/mcp-coco-index/scripts/install.sh` | Analyzed/Planned | OK | Local install workflow |
| `.opencode/skills/mcp-coco-index/scripts/update.sh` | Analyzed/Planned | OK | Upstream sync workflow |
| `.opencode/skills/mcp-coco-index/scripts/doctor.sh` | Planned | OK | Readiness workflow |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/system-spec-kit/027-xce-research-based-refinement/spec.md` | Updated | OK | Parent phase map to include new Phase 001 |
| `specs/system-spec-kit/027-xce-research-based-refinement/description.json` | Updated | OK | Children list and summary |
| `specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json` | Updated | OK | Children IDs and derived metadata |
| `specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork/spec.md` | Created | OK | Phase spec |
| `specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork/plan.md` | Created | OK | Phase plan |
| `specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork/tasks.md` | Created | OK | Phase tasks |
| `specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork/checklist.md` | Created | OK | Verification checklist |
| `specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork/decision-record.md` | Created | OK | ADR |
| `specs/system-spec-kit/027-xce-research-based-refinement/002-*` through `011-*` | Renamed/Updated | OK | Existing phases renumbered |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/scripts/install.sh` | Planned | OK | Needs complete-fork layout support |
| `.opencode/skills/mcp-coco-index/scripts/update.sh` | Planned | OK | Needs complete-fork diff/import workflow |
| `.opencode/skills/mcp-coco-index/scripts/doctor.sh` | Planned | OK | Needs version/layout checks |
| `.opencode/skills/mcp-coco-index/scripts/ensure_ready.sh` | Planned | OK | Needs runtime path support |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/tests/**` | Planned | OK | Expand from 2 local tests to upstream + patch regression suite |
| `specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-code-main/tests/**` | Analyzed | OK | Upstream test source |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-code-main/pyproject.toml` | Analyzed | OK | Upstream package/dependency model |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-code-main/LICENSE` | Analyzed | OK | Apache-2.0 upstream license |
<!-- /ANCHOR:meta -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

Keep this ledger current during implementation. Move paths from Planned to Updated/Created only after the actual implementation changes land.
<!-- /ANCHOR:author-instructions -->
