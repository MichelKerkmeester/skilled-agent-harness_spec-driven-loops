---
title: "Feature Specification: mcp-open-design generation-flow correction"
description: "The mcp-open-design skill described generation as a one-shot start_run, but a live test proved generation is multi-turn and that od artifacts create only adds a file. Correct the skill to the live-verified reality."
trigger_phrases:
  - "mcp-open-design generation flow correction"
  - "open design multi-turn generation"
  - "od run start discovery form"
  - "od artifacts create not a design"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/007-mcp-open-design-generation-flow-correction"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Corrected mcp-open-design generation flow to multi-turn, bumped to v1.1.0"
    next_safe_action: "Operator reviews the corrected skill and v1.1.0.0 changelog"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:c52deb1b362ba0b7be5d06494498afe5567855d58ffb52f5b1d7d2a53511835a"
      session_id: "session-150-007-mcp-open-design-generation-flow-correction"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: mcp-open-design generation-flow correction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-open-design` skill (v1.0.0) was built from a reverse-engineering pass and a deep review that validated it against that reverse-engineering. It described generation as a one-shot `start_run` that "returns files plus a previewUrl". A live generation test this session proved that wrong: generation is multi-turn, and `od artifacts create` only adds a file rather than creating a rendered design. An agent following the v1.0.0 skill would fire a single run, see a question-form with zero files, and either stall or wrongly claim a design was produced.

### Purpose
Correct every doc in the skill to the live-verified reality so an agent drives generation as the proven multi-turn flow and never treats a single run or a file-add as a finished design.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the generation flow across the skill to multi-turn (turn 1 returns a discovery question-form, answering it fires the build).
- Separate "add a file" (`od artifacts create`) from "create a visible design" (the multi-turn flow).
- Connect `od ui respond` to answering the discovery form in the generation flow.
- Add the `od run start|watch|cancel|list|info` verbs to the CLI reference.
- Document the HTTP API surface, `/api/mcp/install-info` as the canonical config source, and the ephemeral-port-rotation warning.
- Bump the skill version 1.0.0 to 1.1.0 and add `changelog/v1.1.0.0.md`.

### Out of Scope
- Editing the 150 parent control docs - that folder is owned elsewhere.
- Editing `sk-design-interface` or `sk-prompt` - not in this correction.
- Re-running the live generation test - the proven facts are taken as authoritative input.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/SKILL.md` | Modify | Multi-turn Run Direction, artifacts callout, ALWAYS/NEVER rules, version 1.1.0 |
| `.opencode/skills/mcp-open-design/references/tool_surface.md` | Modify | Multi-turn generation flow, corrected start_run, artifacts separation |
| `.opencode/skills/mcp-open-design/references/od_cli_reference.md` | Modify | od run verbs, multi-turn section, HTTP API surface, resolved uncertainty |
| `.opencode/skills/mcp-open-design/references/mcp_wiring.md` | Modify | install-info canonical, command[0] is the Helper binary, shape confirmed |
| `.opencode/skills/mcp-open-design/feature_catalog/feature_catalog.md` | Modify | Run section to multi-turn |
| `.opencode/skills/mcp-open-design/feature_catalog/04--runs/headless-runs.md` | Modify | Multi-turn run feature |
| `.opencode/skills/mcp-open-design/manual_testing_playbook/manual_testing_playbook.md` | Modify | RUN-001 expected to multi-turn |
| `.opencode/skills/mcp-open-design/manual_testing_playbook/03--gated-runs/gated-verb-confirm.md` | Modify | RUN-001 scenario exercises the multi-turn flow |
| `.opencode/skills/mcp-open-design/README.md` | Modify | Run narrative, troubleshooting, FAQ |
| `.opencode/skills/mcp-open-design/changelog/v1.1.0.0.md` | Create | Generation-flow correction changelog |
| `.opencode/skills/mcp-open-design/graph-metadata.json` | Modify | Topics, source_docs, causal summary, changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Generation documented as multi-turn everywhere | No doc claims a single `start_run` or `od run start` produces a finished visible design without the discovery form being answered |
| REQ-002 | `od artifacts create` separated from creating a design | Every run-direction doc states artifacts create only adds a file and never renders a design |
| REQ-003 | `od ui respond` connected to answering the discovery form | The generation flow shows `od ui list/show` then `od ui respond` as the step that fires the build |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `od run` verbs added to the CLI reference | `od run start\|watch\|cancel\|list\|info` appear in the verb table with mutation classes |
| REQ-005 | HTTP API surface documented | The HTTP base, the verified endpoints, `/api/mcp/install-info` as canonical source, and the ephemeral-port-rotation warning are recorded |
| REQ-006 | Version bumped and changelog added | SKILL.md version is 1.1.0 and `changelog/v1.1.0.0.md` exists |
| REQ-007 | Confirmed facts preserved | The MCP wiring config shape, gate-mutations policy, daemon-must-be-running, node daemon-cli.mjs invocation, and the roughly 18-tool surface are unchanged in substance |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py .opencode/skills/mcp-open-design --check` returns PASS.
- **SC-002**: `validate.sh` on this folder with `--strict` reports zero errors.
- **SC-003**: A grep of the skill finds no remaining claim that a single one-shot `od run start` produces a finished visible design without answering the discovery form.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reintroducing the one-shot error in an unedited doc | High | Grep every `start_run` and `od run start` mention and qualify each with the multi-turn flow |
| Risk | Trimming corrections pushes SKILL.md over the word cap | Low | Keep the correction, trim lower-value prose to stay under 3000 words |
| Dependency | Live generation test handed to this packet | Medium | Treated as authoritative; claims tagged live-verified this session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: The gate-every-mutation policy survives the rewrite, and `od ui respond` (the step that fires the build) is gated like every other mutating verb.

### Consistency
- **NFR-C01**: House voice holds across all edits, with no em dashes and no prose semicolons in new prose.

### Accuracy
- **NFR-A01**: Every corrected claim is tagged confirmed (live-verified this session) or inferred, so a reader can tell proven facts from reasoning.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Run boundaries
- Turn 1 returns zero files and `awaiting_input`: documented as not-a-design, not a failure.
- The discovery form answered with `--skip`: accepts the recommended defaults and still fires the build.

### Transport boundaries
- The HTTP port rotated since the last call: rediscover from `/api/mcp/install-info` or the socket, never hardcode.
- `autoSendFirstMessage:true` did not fire the run: POST `/api/projects` is treated as create-only, and the run-start plus answer flow builds.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 11 skill files, documentation only, no code |
| Risk | 8/25 | Correctness-critical wording, but reversible and verified by grep |
| Research | 5/20 | Reality is handed in as proven facts; no new investigation |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The live-verified reality was supplied as authoritative input and applied in full.
<!-- /ANCHOR:questions -->
