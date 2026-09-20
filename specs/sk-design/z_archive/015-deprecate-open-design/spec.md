---
title: "Feature Specification: Deprecate sk-design mcp-open-design transport skill and remove all live references"
description: "Retire the Open Design MCP transport skill (sk-design-mcp-open-design) completely: remove the 45-file skill tree, strip every live reference across sk-design hub/modes, agents, commands, MCP registrations, deep-alignment adapters, advisor corpus, and root docs, and leave only historical records untouched."
trigger_phrases:
  - "deprecate open design"
  - "remove mcp-open-design references"
  - "sk-design-mcp-open-design deprecation"
  - "open design transport removal"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/015-deprecate-open-design"
    last_updated_at: "2026-08-10T14:09:15Z"
    last_updated_by: "remnant-remediation"
    recent_action: "Removed residual transport contracts"
    next_safe_action: "None — remnant remediation verified"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-mcp-open-design/"
      - ".utcp_config.json"
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/agents/design.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deprecate-open-design-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Deprecate sk-design mcp-open-design transport skill and remove all live references

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The Open Design desktop-app MCP transport, packaged as the `sk-design-mcp-open-design` skill (45 files) and registered as the `open_design` MCP server in `.utcp_config.json`, is being retired. This packet removes the skill tree completely and strips every live reference from the sk-design hub and its sibling modes, runtime agents, commands, MCP registrations, deep-alignment adapters, advisor corpus, sk-doc/sk-prompt/sk-code fixtures and checklists, and root-level docs. Historical records (specs, changelogs, dated benchmark reports and fixtures, sqlite indexes) stay untouched and are enumerated as out of scope.

**Key Decisions**: (1) Full removal of `.opencode/skills/sk-design/sk-design-mcp-open-design/` rather than a stub; (2) live-reference removal across all surfaces with a final zero-residue grep gate; (3) historical artifacts (specs, changelogs, benchmark corpora, sqlite indexes) intentionally preserved as records.

**Critical Dependencies**: The 10-iteration deep review (GPT-5.6 Luna, max thinking, fast tier, native pi subagents) must converge on the authoritative reference inventory before implementation starts.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete — deprecation implemented and verified |
| **Created** | 2026-08-10 |
| **Branch** | `scaffold/015-deprecate-open-design` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Open Design transport (`sk-design-mcp-open-design` skill + `open_design` MCP server registration in `.utcp_config.json` + `od` CLI wiring) is being retired by operator decision. A grep sweep finds 130+ live files referencing `mcp-open-design`, `design-mcp-open-design`, or `Open Design` across the sk-design hub, runtime agents, commands, install guides, deep-alignment adapters, mcp-tooling siblings, advisor corpus, doc fixtures, and root docs. Left in place, the dead transport keeps routing surfaces, playbooks, tests, and docs pointing at a removed capability — stale contracts that will mis-route future sessions and fail audits.

### Purpose
Leave zero live references to the Open Design transport in the main workspace while preserving every historical record, and make the deprecation verifiable with a single residue-sweep grep gate plus `validate.sh --strict`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete/archive `.opencode/skills/sk-design/sk-design-mcp-open-design/` (45 files) completely.
- Remove `open_design` MCP server entry from `.utcp_config.json`.
- Strip references from sk-design hub: `SKILL.md`, `README.md`, `mode-registry.json`, `leaf-manifest.json`, `hub-router.json`, `command-metadata.json`, `description.json`, `graph-metadata.json`, `feature-catalog/`, `manual-testing-playbook/`, `shared/`, `sk-design-md-generator/` docs, `changelog/` (add deprecation entry only).
- Strip references from runtime agents: `.opencode/agents/design.md`, `deep-alignment.md`; `.claude/agents/*`; `.codex/agents/*.toml`; `.pi/agents/*.md`.
- Strip references from commands: `.opencode/commands/interface/design.md`, `design-reference.md`; `.opencode/commands/doctor/mcp.md`, `doctor-mcp-install.yaml`; `.opencode/install-guides/README.md`.
- Strip references from deep-alignment: `system-deep-loop/deep-alignment/` adapters, feature-catalog, playbook, scripts, tests.
- Strip references from sibling skills: `mcp-code-mode/` (tool-catalog, route-guard), `mcp-tooling/mcp-figma/` docs, `cli-external-orchestration/*` SKILL.md + playbook, `sk-code` mcp-server-authoring checklist, `sk-prompt` improve docs + design-generation-patterns, `sk-doc` fixtures/tests/templates, `system-spec-kit` manual-testing-playbook + eval ground-truth, `system-skill-advisor` corpus (`skill_advisor.py`, `skill-graph.json`).
- Update root docs: `README.md`, `AGENTS.md`, `BARTER.md`.
- Update compiled-routing fixture `009-parent-hub-rollout/006-sk-design/fixtures/canary-cases.v1.json` (or mark not-live, per review).
- Write `review/` packet: 10 iterations, `review-report.md`.
- Author spec docs to Level 3; pass `validate.sh --strict`; complete `checklist.md` with evidence.

### Out of Scope
- `specs/` folders (incl. `006-design-mcp-open-design`, `014-template-conformance/005-design-mcp-open-design`) — historical records; leave as-is.
- Changelog history files (past versions) — records; only append deprecation entries where a live doc needs one.
- Dated benchmark reports + `.private.json` benchmark fixtures (2026-07-21 corpus) — historical corpora; adjudicated by review.
- sqlite databases (context-index, skill-graph, deep-loop-graph) — regenerated by indexing/scan; not hand-edited.
- `.worktrees/` — separate checkouts; out of the main-workspace blast radius (noted in report only).
- `.pi-subagents/artifacts/` — transient session artifacts.
- The Open Design desktop app itself and its files outside this repo.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-mcp-open-design/` | Delete | Full 45-file skill tree (deprecated) |
| `.utcp_config.json` | Modify | Remove `open_design` MCP server entry |
| `.opencode/skills/sk-design/SKILL.md`, `README.md` | Modify | Remove transport references, routing table rows |
| `.opencode/skills/sk-design/mode-registry.json`, `leaf-manifest.json`, `hub-router.json`, `command-metadata.json`, `description.json`, `graph-metadata.json` | Modify | Drop mcp-open-design leaf/mode entries |
| `.opencode/skills/sk-design/feature-catalog/**`, `manual-testing-playbook/**`, `shared/**` | Modify | Remove open-design scenarios/routing claims |
| `.opencode/skills/sk-design/sk-design-md-generator/**` | Modify | Remove pairing references to the transport |
| `.opencode/agents/design.md`, `.claude/agents/design.md`, `.codex/agents/design.toml`, `.pi/agents/design.md` | Modify | Remove transport tool/route claims |
| `.opencode/agents/deep-alignment.md`, `.claude/agents/deep-alignment.md`, `.codex/agents/deep-alignment.toml`, `.pi/agents/deep-alignment.md` | Modify | Remove live-render adapter references |
| `.opencode/commands/interface/design.md`, `design-reference.md` | Modify | Remove transport dispatch instructions |
| `.opencode/commands/doctor/mcp.md`, `assets/doctor-mcp-install.yaml` | Modify | Remove open-design install/verify path |
| `.opencode/install-guides/README.md` | Modify | Remove install entry |
| `.opencode/skills/system-deep-loop/deep-alignment/**` | Modify | Remove adapter docs/scripts/tests referencing the transport |
| `.opencode/skills/mcp-code-mode/**`, `.opencode/skills/mcp-tooling/mcp-figma/**` | Modify | Remove comparison/route references |
| `.opencode/skills/cli-external-orchestration/**` | Modify | Remove open-design dispatch references |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md` | Modify | Remove example reference |
| `.opencode/skills/sk-prompt/sk-prompt-improve/**`, `references/design-generation-patterns.md` | Modify | Remove start_run/od patterns |
| `.opencode/skills/sk-doc/**` (fixtures, tests, templates) | Modify | Remove open-design baselines/validation rules |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/**`, `mcp-server/**/ground-truth.json` | Modify | Remove eval/fixture references |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py`, `skill-graph.json` | Modify | Re-point corpus away from the transport |
| `README.md`, `AGENTS.md`, `BARTER.md` | Modify | Remove transport rows/mentions |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/fixtures/canary-cases.v1.json` | Modify or keep | Per review adjudication |
| `specs/sk-design/015-deprecate-open-design/**` | Create | Level 3 packet + `review/` packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove the `sk-design-mcp-open-design` skill tree completely | `test ! -e .opencode/skills/sk-design/sk-design-mcp-open-design` exits 0 |
| REQ-002 | Remove the `open_design` MCP server registration from `.utcp_config.json` | `python3 -c` parse shows no `open_design` key; `grep -i open.design .utcp_config.json` returns nothing |
| REQ-003 | Strip all live references from sk-design hub/modes/playbooks/tests | `grep -rniE "mcp[-_]open[-_]design|design-mcp-open-design|open[-_ ]design"` over live surfaces (excluding specs/, changelogs, benchmark corpora, sqlite) returns zero hits |
| REQ-004 | Strip references from agents, commands, deep-alignment, sibling skills, advisor corpus, root docs (per review inventory) | Same zero-residue grep gate over the whole main workspace (excluding documented historical exclusions) |
| REQ-005 | Run 10 deep-review iterations (GPT-5.6 Luna max/fast, native pi subagents) and synthesize `review/review-report.md` with verdict | `review/iterations/iteration-001..010.md` exist; `review/review-report.md` has 9 core sections |
| REQ-006 | Pass `validate.sh specs/sk-design/015-deprecate-open-design --strict` | Exit code 0 |
| REQ-007 | Complete `checklist.md` with evidence for every P0/P1 item | All P0/P1 rows `[x]` with evidence column filled |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Keep historical records intact | `git status` shows no modifications under `specs/` (except this packet), `changelog/` history files, dated benchmark reports/fixtures, or sqlite databases |
| REQ-009 | Write `implementation-summary.md` and `decision-record.md` documenting the deprecation + the pi-native review adaptation | Files exist, no placeholders, `check-placeholders.sh` clean |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero live references to the Open Design transport in the main workspace (single grep gate over the allowlist, exit 1/no hits).
- **SC-002**: The skill directory no longer exists and is not routable by the skill advisor or any hub (grep + advisor probe).
- **SC-003**: 10 review iterations completed with state machine artifacts (JSONL, deltas, registry, dashboard, report) and a documented verdict.
- **SC-004**: `validate.sh --strict` exit 0; checklist fully evidenced; no stray files in `git status`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 10-iteration deep review completeness | If a live reference is missed, residue gate fails | Zero-residue grep gate is the hard final check; review iterations rotate all 4 dimensions + traceability overlays |
| Risk | Removing MCP registration breaks Code Mode config parsing | Med | Validate `.utcp_config.json` parses after edit |
| Risk | Advisor corpus still routes to removed skill | Med | Update `skill_advisor.py`/`skill-graph.json` corpus + re-scan memory DB |
| Risk | Mirror drift (.claude/.codex/.pi agents) | Low | Treat mirrors as in-scope for reference removal, per inventory |
| Risk | Historical records accidentally edited | Med | Explicit out-of-scope list; final `git status` diff review |
| Risk | Subagent iterations fail to write state artifacts | Med | Orchestrator validates iteration file + JSONL delta after each dispatch; retry/fix before next iteration |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Review loop completes 10 iterations within the session; each iteration ≤ 13 tool calls per LEAF contract.

### Security
- **NFR-S01**: No credentials or app paths of the retired transport remain in any live doc or config; `.utcp_config.json` env block (OD_DATA_DIR, OD_SIDECAR_IPC_PATH) fully removed.

### Reliability
- **NFR-R01**: After deprecation, `validate.sh --strict` and the residue grep gate are rerunnable and deterministic (exit codes stable).

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: review iteration with no new findings must still emit ratio 0.0 and a verdict line.
- Maximum length: iteration files must stay under TCB; findings cite file:line only.

### Error Scenarios
- External service failure: no external calls in review (code-only); Open Design daemon never started by this packet.
- Network timeout: subagent dispatch failures are retried once with the same state; state machine files remain the single source of truth.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | 130+ live files across 15 surfaces |
| Risk | 18/25 | Config parse breakage, advisor corpus, mirror drift |
| Research | 10/20 | Reference surface known; review confirms |
| Multi-Agent | 10/15 | 10 subagent iterations, 1 orchestrator |
| Coordination | 12/15 | State machine + reducer + synthesis |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Missed live reference survives the sweep | H | M | Two-pass sweep: broad regex + per-surface allowlist; review iterations cross-check |
| R-002 | `.utcp_config.json` malformed after edit | M | L | JSON parse check immediately after edit |
| R-003 | Advisor still surfaces deprecated skill | M | M | Corpus update + `skill_advisor.py` probe after removal |
| R-004 | Historical files accidentally touched | M | L | Out-of-scope list enforced; final diff review |

---

## 11. USER STORIES

### US-001: Operator retires the transport (Priority: P0)

**As an** operator, **I want** the Open Design transport fully deprecated, **so that** no surface routes to a removed capability.

**Acceptance Criteria**:
1. Given the skill directory, When deprecation completes, Then `test ! -e` passes.
2. Given any live doc/config, When a residue grep runs, Then zero hits remain.

### US-002: Auditor verifies the deprecation (Priority: P1)

**As an** auditor, **I want** evidence-backed completion, **so that** the removal is provable.

**Acceptance Criteria**:
1. Given the review packet, When checked, Then 10 iteration files + report with verdict exist.
2. Given the spec folder, When validated, Then `validate.sh --strict` exits 0.

---

## 12. OPEN QUESTIONS

- Whether dated benchmark fixtures and `.private.json` corpora count as live references — adjudicated by the deep review, then recorded in `decision-record.md`.
- Whether the compiled-routing canary fixture must be regenerated — adjudicated by the deep review.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
