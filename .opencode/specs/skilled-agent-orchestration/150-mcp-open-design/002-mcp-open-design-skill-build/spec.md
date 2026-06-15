---
title: "Feature Specification: mcp-open-design skill build"
description: "Record of building the mcp-open-design skill v1.0.0: terminal control of the installed Open Design app via od mcp wiring, the gated ~18-tool MCP surface, and the headless od verbs, modeled on mcp-magicpath. Already shipped as commit 0508518ac9."
trigger_phrases:
  - "mcp-open-design skill build"
  - "open design terminal control skill"
  - "od mcp install opencode claude"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-mcp-open-design/002-mcp-open-design-skill-build"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented the shipped mcp-open-design v1.0.0 build (commit 0508518ac9)"
    next_safe_action: "Operator reviews the record, then phase 003 de-vendor follows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:5bb1a95d9c30413ab94148bc80f49843333e7445afba3fc84a483ef3a54b99a7"
      session_id: "session-150-002-mcp-open-design-skill-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: mcp-open-design skill build

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
| **Type** | Retroactive record of completed work (already shipped) |
| **Commit** | `0508518ac9` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The installed Open Design desktop app (nexu-io/open-design, Electron plus Next.js) holds rich local-first design systems and a generation engine, but the framework could only reach them through the in-app chat UI. The phase 001 research established that Open Design exposes a stdio MCP server, an `od` CLI, and headless verbs, but no skill packaged that surface for an agent to use. Without a skill, an agent had no house-conformant contract for wiring Open Design into the terminal, no map of which tools are safe to call, and no guard against the mutating and destructive verbs the live server registers.

### Purpose
Build the `mcp-open-design` skill so an agent can drive the installed Open Design app from the terminal: wire its MCP server in (`od mcp install opencode` / `od mcp install claude`), read design systems and projects, commission headless generation runs, and verify the live tool surface, all under a strict surface, gate, and omit policy modeled on `mcp-magicpath`.

> **Retroactive record.** This packet documents work that already shipped as commit `0508518ac9`. It is a past-tense record pointing to the deliverable at `.opencode/skills/mcp-open-design/`. It does not re-do the build and it does not edit the skill.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `mcp-open-design` skill package: `SKILL.md`, three references (`mcp_wiring.md`, `tool_surface.md`, `od_cli_reference.md`), a feature catalog, a manual testing playbook, a README, and a v1.0.0.0 changelog.
- The MCP wiring path (`od mcp install <agent>`) for opencode and Claude Code, with the local `node "$OD_BIN"` invocation form.
- The tool-exposure policy: surface read-only verbs, gate mutating verbs behind confirmation, omit destructive verbs from the default path.
- The headless `od` verbs (runs, reads, UI responses, artifacts, transport) and the live `tools/list` verification requirement.

### Out of Scope
- The `sk-interface-design` de-vendor and Open Design integration (phase 003).
- Live verification of `od mcp install opencode` against a running daemon (phase 004).
- Changes to the Open Design app or its upstream repo (read-only third-party input).
- The standalone `mcp-magicpath` skill (packet `147-mcp-magicpath`), used here only as the structural model.

### Files Changed (already shipped in commit `0508518ac9`)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/SKILL.md` | Created | Runtime contract: wire, read, run direction, the surface/gate/omit policy, and the ALWAYS/NEVER rules |
| `.opencode/skills/mcp-open-design/references/mcp_wiring.md` | Created | `od mcp install` wiring, the config shape, socket-discovery transport |
| `.opencode/skills/mcp-open-design/references/tool_surface.md` | Created | The ~18 MCP tools and the surface/gate/omit policy |
| `.opencode/skills/mcp-open-design/references/od_cli_reference.md` | Created | The `od` CLI verbs, transport, and headless usage |
| `.opencode/skills/mcp-open-design/feature_catalog/` | Created | Capability inventory across wiring, reading, grounding, runs, transport |
| `.opencode/skills/mcp-open-design/manual_testing_playbook/` | Created | Operator scenarios across wiring, reading, gated runs, failure paths |
| `.opencode/skills/mcp-open-design/README.md` | Created | Narrative overview, troubleshooting, FAQ |
| `.opencode/skills/mcp-open-design/changelog/v1.0.0.0.md` | Created | Initial release changelog |
| `.opencode/skills/mcp-open-design/graph-metadata.json` | Created | Skill graph topics, edges, source docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (delivered)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The skill wires Open Design into the terminal agent | `SKILL.md` and `mcp_wiring.md` document `od mcp install opencode` and `od mcp install claude` with the local `node "$OD_BIN"` form |
| REQ-002 | The MCP tool surface is mapped and policed | `tool_surface.md` lists the ~18 live tools and classifies each as surface, gate, or omit |
| REQ-003 | Every mutating and destructive verb is gated or omitted | The skill gates mutating verbs behind confirmation and keeps destructive verbs off the default path |

### P1 - Required (delivered)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The headless `od` verbs are documented | `od_cli_reference.md` covers the run, read, UI, artifact, and transport verbs |
| REQ-005 | The skill follows the mcp-magicpath structure | The package carries the same SKILL.md, references, feature catalog, playbook, README, and changelog shape as `mcp-magicpath` |
| REQ-006 | The live tool surface must be verified before use | The skill requires checking the live `tools/list` before trusting any tool's name or read-only status |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `mcp-open-design` skill exists at `.opencode/skills/mcp-open-design/` with the full package (delivered in commit `0508518ac9`).
- **SC-002**: `validate.sh` on this packet with `--strict` reports zero errors.
- **SC-003**: The skill documents the `od mcp install` wiring, the ~18-tool surface with a gate policy, and the headless verbs, modeled on `mcp-magicpath`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An agent calls a mutating or destructive verb thinking it is read-only | High | The surface/gate/omit policy and the live `tools/list` verification requirement keep mutating verbs gated |
| Risk | The help text undercounts the real tool surface | Medium | The skill records that `od mcp --help` lists a subset and the running server registers ~18, and requires live verification |
| Dependency | Phase 001 research ground-truth | Green | The terminal surface, tool tiers, and transport came from the read-only research fleet |
| Dependency | The installed Open Design app | Green | The skill reads and drives the locally installed app and caches nothing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: Every mutating verb is gated behind explicit confirmation and every destructive verb is omitted from the default path, so an agent cannot overwrite or delete without an intentional step.

### Consistency
- **NFR-C01**: The skill follows the `mcp-magicpath` package shape and house voice, with no em dashes and no prose semicolons in new prose.

### Accuracy
- **NFR-A01**: Tool and transport claims are tagged confirmed or inferred so a reader can tell verified facts from reasoning, and the live `tools/list` is the authority before promising any tool.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Transport boundaries
- The daemon is down when the agent calls a tool: the skill documents the daemon-not-running failure path and the standalone `od --no-open` daemon option.
- The ephemeral socket or port rotated since the last call: the skill records that each `od mcp` spawn re-discovers the live URL and configs survive daemon restarts.

### Tool-surface boundaries
- The help text lists fewer tools than the running server registers: the skill states the real surface is ~18 and includes mutating and destructive verbs, and requires live verification.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | A full new skill package: SKILL.md, three references, catalog, playbook, README, changelog |
| Risk | 9/25 | Correctness-critical tool gating, but documentation only and grounded in research |
| Research | 6/20 | The terminal surface was supplied by phase 001, and the build applied it |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The live `od mcp install opencode` wire against a running daemon is carried into phase 004 as the remaining verification item.
<!-- /ANCHOR:questions -->
