---
title: "Feature Specification: Cursor + Devin testing-playbook scenarios"
description: "Extend the sk-vision manual-testing-playbook with Cursor, Devin, standalone-MCP, and vision-blind-model scenarios so all four hosts and the core value story are operator-testable."
trigger_phrases:
  - "sk-vision cursor devin testing playbook"
  - "sk-vision vision-blind model scenario"
  - "sk-vision playbook four hosts"
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
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook/spec.md"
      - ".opencode/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/sk-vision/manual-testing-playbook/host-adapters/vision-blind-model.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-017-cursor-devin-testing-playbook"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cursor + Devin testing-playbook scenarios

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `016-cursor-devin-hook-entries` |
| **Successor** | N/A |
| **Handoff Criteria** | The playbook carries executable scenarios for the standalone MCP server, Cursor attach, Devin attach, and the vision-blind-model value story; the index names all four hosts; the skill package validates; changes committed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

`014`–`016` shipped Cursor and Devin over MCP and gave them `hooks/` entries, but the manual-testing-playbook still covered only the two in-process hosts (OpenCode plugin `VSN-014`, Pi extension `VSN-015`) plus the runtime core. An operator had no scripted way to prove the MCP path works, or to prove the actual reason it exists: both Cursor and Devin commonly run a text-only model such as GLM that cannot see a single pixel of an attached image, and sk-vision's tools are what give that model sight.

**Scope Boundary**: the `manual-testing-playbook/` files only — four new scenario feature files, one ported feature-catalog transport file, and the index. Do not change the MCP server, the 13 tools, the adapters, or the host configs.

**Dependencies**:
- The `014` MCP server and its `dist/mcp-server.js` build are the transport every new scenario exercises.
- The `016` `hooks/cursor` and `hooks/devin` configs are what VSN-018/VSN-019 attach.

**Deliverables**:
- A playbook that lets an operator test all four hosts and confirm a vision-blind model gains sight.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The manual-testing-playbook documented only the OpenCode plugin and Pi extension host adapters. The MCP path (Cursor, Devin, and the standalone server they share) had no operator scenarios, and nothing captured the end-to-end value: a text-only model reading an image through the tools. An operator following the playbook could not confirm the MCP hosts work, nor demonstrate why sk-vision matters for a vision-blind model.

### Purpose
Give operators exact, self-contained scenarios that prove the standalone MCP server is healthy, that Cursor and Devin attach it without losing other servers, and that a vision-blind model (e.g. GLM) reports an image's real content via a tool call instead of hallucinating or refusing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `host-adapters/mcp-standalone.md` (`VSN-017`): the built MCP server starts and advertises 13 tools.
- Add `host-adapters/cursor-mcp.md` (`VSN-018`): Cursor attaches the shared server, preserving the other servers, and calls `sk_vision_status`.
- Add `host-adapters/devin-mcp.md` (`VSN-019`): Devin loads its dedicated config and calls the namespaced `mcp__sk-vision__sk_vision_status`.
- Add `host-adapters/vision-blind-model.md` (`VSN-020`): a text-only model reads an image via `sk_vision_ocr`/`sk_vision_inspect`.
- Add `feature-catalog/host-adapters/mcp-transport.md` (the shared-transport catalog page the four scenarios reference).
- Update `manual-testing-playbook.md`: §10 header + intro, the four scenario entries, the coverage note, and the index version.

### Out of Scope
- The MCP server, the 13 tool contracts, the in-process adapters, and the host config files.
- Any change to the existing `VSN-014`/`VSN-015`/`VSN-016` scenarios.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/mcp-standalone.md` | Create | `VSN-017` standalone MCP server scenario |
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/cursor-mcp.md` | Create | `VSN-018` Cursor attach scenario |
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/devin-mcp.md` | Create | `VSN-019` Devin attach scenario |
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/vision-blind-model.md` | Create | `VSN-020` vision-blind-model value scenario |
| `.opencode/skills/sk-vision/feature-catalog/host-adapters/mcp-transport.md` | Create | Shared-transport catalog page (skill-root feature-catalog, sibling of `manual-testing-playbook/`) |
| `.opencode/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md` | Update | §10 + coverage note + version 1.1.0.0 |

### Verification evidence

- The four scenario files and the catalog page exist; each carries a `VSN-0##` id and the standard scenario sections.
- The index §10 names all four hosts and lists `VSN-017`..`VSN-020`; the coverage note reads 20 scenarios.
- Because the catalog leaf root gained a file, `ci-skill-root-metadata.cjs` regenerated `leaf-manifest.json`/`leaf-aliases.json` and reports `OK [S] sk-vision`; `validate_skill_package.py --check` PASS.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | MCP path is testable | `VSN-017`/`VSN-018`/`VSN-019` exist with prompt, commands, expected signals, pass/fail |
| REQ-002 | Value story is testable | `VSN-020` proves a text-only model reads an image via a tool call |
| REQ-003 | Index reflects four hosts | §10 names all four hosts and links the four new feature files |
| REQ-004 | Skill still validates | `ci-skill-root-metadata.cjs` `OK [S]`; package `--check` PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Scenarios cite real anchors | Each feature file points at the MCP server, tool definitions, or host config it exercises |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Standalone-MCP scenario present. Evidence: `host-adapters/mcp-standalone.md` (`VSN-017`) with a 13-tool assertion.
- [x] Cursor + Devin scenarios present. Evidence: `cursor-mcp.md` (`VSN-018`), `devin-mcp.md` (`VSN-019`) with attach + status checks.
- [x] Vision-blind-model scenario present. Evidence: `vision-blind-model.md` (`VSN-020`) with tool-call + ground-truth pass/fail.
- [x] Catalog page present. Evidence: `feature-catalog/host-adapters/mcp-transport.md` referenced by the four scenarios.
- [x] Index updated. Evidence: §10 names four hosts and `VSN-017`..`VSN-020`; coverage note reads 20 scenarios; version `1.1.0.0`.
- [x] Skill validates. Evidence: `ci-skill-root-metadata.cjs` `OK [S] sk-vision (wrote leaf-manifest.json, leaf-aliases.json)`; package `--check: PASS`.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scenarios reference a missing catalog page | Dangling links in the playbook | Ported `feature-catalog/host-adapters/mcp-transport.md` alongside the scenarios |
| Risk | Catalog leaf root changed without a manifest refresh | `ci-skill-root-metadata` drift | Ran `--fix`; regenerated `leaf-manifest.json`/`leaf-aliases.json` |
| Dependency | The `014` MCP server + `dist/mcp-server.js` | Every scenario launches it | Unchanged; server still lists 13 tools |
| Dependency | The `016` Cursor/Devin configs | VSN-018/019 attach them | Unchanged |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Why a dedicated vision-blind-model scenario instead of folding it into the attach scenarios? **A**: Attach (VSN-018/019) proves the server connects; it does not prove a text-only model actually reads an image. `VSN-020` isolates the end-to-end value so a PASS means real sight, not just a healthy socket.
- **Q**: Why port a feature-catalog transport page here? **A**: The four scenarios link `../feature-catalog/host-adapters/mcp-transport.md`; it was missing on this branch, so the links would dangle without it.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
