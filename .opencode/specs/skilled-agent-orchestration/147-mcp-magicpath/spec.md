---
title: "Feature Specification: mcp-magicpath"
description: "Vendor the third-party MagicPath agent skill into the curated .opencode/skills framework as mcp-magicpath, with house README, schema-2 graph metadata, a CLI installer, catalog registration, and advisor-graph indexing."
trigger_phrases:
  - "magicpath skill"
  - "install magicpath"
  - "mcp-magicpath"
  - "vendor third-party skill"
  - "skill registration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-mcp-magicpath"
    last_updated_at: "2026-06-13T11:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored spec for mcp-magicpath framework install"
    next_safe_action: "Run validate.sh --strict then generate-context.js"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-magicpath/SKILL.md"
      - ".opencode/skills/mcp-magicpath/graph-metadata.json"
      - ".opencode/skills/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-147-mcp-magicpath"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Install target: framework .opencode/skills"
      - "Skill name: mcp-magicpath (mcp- family prefix)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: mcp-magicpath

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-13 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator wants MagicPath (a platform for finding, installing and authoring UI components) usable from this agent environment. The upstream skill at `github.com/MagicPathAI/agent-skills` is shaped for the generic agent-skills CLI and plugin marketplaces, not for this repository's curated `.opencode/skills` framework, which has a family-prefix naming convention, a house README format, schema-2 graph metadata, a hand-maintained catalog index, and a separate advisor SQLite graph that drives Gate 2 routing.

### Purpose
Vendor the upstream skill into `.opencode/skills/mcp-magicpath/` so the agent can route to it through the advisor and invoke the `magicpath-ai` CLI, fully conformant with the framework's skill conventions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Vendor the upstream `magicpath` skill (`SKILL.md` + three reference docs) into `.opencode/skills/mcp-magicpath/`.
- Author a house-voice `README.md` and a schema-2 `graph-metadata.json`.
- Add a `scripts/install.sh` that makes the `magicpath-ai` CLI available, matching the mcp-* family pattern.
- Register the skill in the skills catalog index and the advisor SQLite graph.

### Out of Scope
- Fixing the pre-existing `cli-* (4)` count drift in the catalog index - unrelated to this packet, owned by the cli-devin/cli-gemini deprecation specs.
- A repo-wide `sanitizer_version` derived-block backfill - every existing skill carries that warning; not introduced here.
- Authenticating against a live MagicPath account or exercising real component installs - the operator runs `magicpath-ai login` when they choose.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-magicpath/SKILL.md` | Create | Lean house-template runtime instructions (WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / REFERENCES), under the 5k-word cap |
| `.opencode/skills/mcp-magicpath/references/magicpath_operations.md` | Create | Full upstream operational body, relocated verbatim |
| `.opencode/skills/mcp-magicpath/references/*.md` | Create | Three upstream reference docs (snake_case names), verbatim |
| `.opencode/skills/mcp-magicpath/README.md` | Create | House-voice 9-section README |
| `.opencode/skills/mcp-magicpath/graph-metadata.json` | Create | Schema-2 advisor graph metadata |
| `.opencode/skills/mcp-magicpath/scripts/install.sh` | Create | Global `magicpath-ai` CLI installer |
| `.opencode/skills/mcp-magicpath/mcp-servers/magicpath-cli/` | Create | In-skill CLI vendor (package.json + setup.sh + README), mirroring mcp-click-up/mcp-servers |
| `.opencode/skills/README.md` | Modify | Add catalog row, bump skill + mcp-* counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill folder exists with conformant files | **Given** the framework, **When** listing `.opencode/skills/mcp-magicpath/`, **Then** `SKILL.md`, `README.md`, `graph-metadata.json`, `references/` (3 files) and `scripts/install.sh` are all present |
| REQ-002 | SKILL.md frontmatter is framework-valid | **Given** the SKILL.md, **When** reading the frontmatter, **Then** `name: mcp-magicpath`, a `description`, and `user-invocable: true` are present and the runtime lists the skill |
| REQ-003 | Advisor graph indexes the skill | **Given** a scanned graph, **When** running `advisor_recommend` on a clear MagicPath prompt, **Then** `mcp-magicpath` is the top match and `skill_graph_validate` reports `errorCount: 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | CLI is actually available | **Given** the installer, **When** running `scripts/install.sh`, **Then** `magicpath-ai --version` resolves on PATH and the script is idempotent on re-run |
| REQ-005 | README passes house structure | **Given** the README, **When** running the sk-doc readme validator, **Then** it reports zero issues |
| REQ-006 | Catalog index reflects the addition | **Given** the skills catalog, **When** reading it, **Then** `mcp-magicpath` appears under External Tool Surfaces and the total + mcp-* counts are incremented |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The advisor routes a MagicPath prompt to `mcp-magicpath` with confidence >= 0.8 and uncertainty <= 0.35 (passes Gate 2).
- **SC-002**: `bash validate.sh <spec-folder> --strict` exits clean and the skill graph validates with zero errors.
- **SC-003**: `package_skill.py` reports the skill valid with zero warnings (sk-doc skill-creation standard).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `magicpath-ai` npm package | CLI unusable if unpublished | Pinned to a real published package (v2.3.2 verified); installer falls back to `npx -y` if the global install is absent |
| Dependency | MagicPath account + network | No live component ops without auth | Documented in README/installer; auth is the operator's step, not this packet's |
| Risk | `mcp-` prefix overstates transport | Reader assumes an MCP server exists | README and graph `causal_summary` state explicitly that this is CLI-only with no MCP component |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: First `npx -y magicpath-ai` call may take seconds to fetch the package; the global installer removes that latency for later calls.
- **NFR-P02**: Advisor scan of the new skill completes in one `skill_graph_scan` pass (single indexed node).

### Security
- **NFR-S01**: No secrets are stored in the skill; MagicPath auth is a browser session managed by the CLI.
- **NFR-S02**: The installer only runs `npm install -g` and never edits config files.

### Reliability
- **NFR-R01**: The installer is idempotent and detects an existing install.
- **NFR-R02**: The skill degrades gracefully to `npx -y magicpath-ai` when no global binary is present.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: `search` with no matches returns an empty list, which is valid, not an error.
- Maximum length: not applicable; the CLI paginates `list-components` and `list-projects`.
- Invalid format: non-React project + `add` is rejected; the skill routes such cases to `inspect` + manual translation.

### Error Scenarios
- External service failure: MagicPath unreachable surfaces a CLI error; no local writes occur.
- Network timeout: the agent retries the CLI call; no partial skill state is written.
- Concurrent access: not applicable; the skill is read-mostly and per-invocation.

### State Transitions
- Partial completion: a failed `code submit` leaves `magicpath-code.json` intact for retry.
- Session expiry: an expired auth session prompts a re-`login`; no skill change needed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 6 new files + 1 catalog edit; mostly vendored content |
| Risk | 8/25 | Additive, no existing behavior changed; external dependency only |
| Research | 10/20 | Had to learn the CLI surface and the framework's skill conventions |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Install target (framework) and skill name (`mcp-magicpath`) were resolved with the operator before authoring.
<!-- /ANCHOR:questions -->
