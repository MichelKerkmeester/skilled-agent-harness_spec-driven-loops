---
title: "Implementation Plan: Cursor + Devin testing-playbook scenarios"
description: "Add VSN-017..VSN-020 playbook scenarios plus the shared-transport catalog page, and update the index for four hosts."
trigger_phrases:
  - "sk-vision cursor devin testing playbook plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook"
    last_updated_at: "2026-08-17T16:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored VSN-017..VSN-020 playbook scenarios and updated the index."
    next_safe_action: "Commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook/plan.md"
      - ".opencode/skills/sk-vision/feature-catalog/host-adapters/mcp-transport.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-017-cursor-devin-testing-playbook"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cursor + Devin testing-playbook scenarios

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown testing-playbook scenarios |
| **Framework** | sk-vision manual-testing-playbook (feature files + feature-catalog) |
| **Storage** | `manual-testing-playbook/host-adapters/`, `feature-catalog/host-adapters/` (skill root) |
| **Testing** | file presence, `VSN` id grep, index link check, `ci-skill-root-metadata`, package check |

### Overview
Author four operator scenarios covering the MCP path and the vision-blind-model value story, port the shared-transport catalog page the scenarios reference, and update the index so the playbook reads as four hosts rather than two.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Four-host model shipped. Evidence: `016` `hooks/cursor` + `hooks/devin` entries.
- [x] Value story identified. Evidence: Cursor/Devin both run text-only GLM that cannot see images.

### Definition of Done
- [x] Four scenarios + catalog page authored; index updated. Evidence: `implementation-summary.md` Verification.
- [x] Skill package unchanged-green after the manifest refresh. Evidence: `ci-skill-root-metadata` `OK [S]`; package `--check` PASS.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Each host scenario is a self-contained feature file under `host-adapters/`, with a nine-column scenario table plus prose Test Execution, Source Files, and Source Metadata sections — matching the existing `VSN-014`/`VSN-015` files. The index links each to a feature-catalog page describing the shared transport.

### Key Components
- **`mcp-standalone.md` (`VSN-017`)** — protocol-level 13-tool check, the shared dependency of the two hosts.
- **`cursor-mcp.md` (`VSN-018`)** — merged-config preservation + attach + `sk_vision_status`.
- **`devin-mcp.md` (`VSN-019`)** — dedicated-config attach + namespaced `mcp__sk-vision__sk_vision_status`.
- **`vision-blind-model.md` (`VSN-020`)** — a text-only model reads an image via a tool call.
- **`feature-catalog/host-adapters/mcp-transport.md`** — the catalog page the four scenarios cite.

### Data Flow
Every scenario launches the same `node dist/mcp-server.js`; VSN-018/019 reach it through the `016` host configs, VSN-020 layers a real image + text-only model on top.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenarios
- [x] Author `mcp-standalone.md`, `cursor-mcp.md`, `devin-mcp.md`, `vision-blind-model.md`. Evidence: four files under `host-adapters/`, each with a `VSN-0##` id.
- [x] Enrich the Cursor/Devin "Why This Matters" with the GLM vision-blind angle. Evidence: both files name GLM and the vision-blind case.

### Phase 2: Catalog + index
- [x] Port `feature-catalog/host-adapters/mcp-transport.md`. Evidence: file present; the four scenarios link it.
- [x] Update the index §10 (header, intro, four entries), the coverage note, and the version to `1.1.0.0`. Evidence: §10 lists `VSN-017`..`VSN-020`; coverage note reads 20 scenarios.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Presence | Four scenarios + catalog page exist | `ls` |
| Content | Each carries a `VSN` id + scenario sections | `grep` |
| Index | §10 names four hosts + links the files | `grep` |
| Package | Manifest refresh + skill still valid | `ci-skill-root-metadata.cjs`, `validate_skill_package.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `014` MCP server | Internal | Available | No server for the scenarios to exercise |
| `016` Cursor/Devin configs | Internal | Available | VSN-018/019 have nothing to attach |
| feature-catalog leaf root | Internal | Available | Added a page; manifest regen required |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new scenarios or catalog page are wrong, or the manifest refresh misbehaves.
- **Procedure**: Delete the four `host-adapters/*.md` scenario files and `feature-catalog/host-adapters/mcp-transport.md`, revert the `manual-testing-playbook.md` §10 + coverage-note + version edits, and re-run `ci-skill-root-metadata.cjs --fix` to restore the prior manifests. No runtime, server, or config is touched, so the skill keeps working.
<!-- /ANCHOR:rollback -->
