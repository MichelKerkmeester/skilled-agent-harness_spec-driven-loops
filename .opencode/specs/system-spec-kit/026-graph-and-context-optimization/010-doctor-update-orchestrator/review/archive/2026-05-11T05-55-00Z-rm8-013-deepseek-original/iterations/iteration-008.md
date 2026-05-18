# Iteration 8 — maintainability (cross-runtime mirror + phase-parent lean-trio policy)

## Files Reviewed

| Path | Classification | Notes |
|------|---------------|-------|
| `010-doctor-update-orchestrator/` (parent listing) | PASS — lean trio | 3 lean files + 2 cross-cutting docs + 2 child dirs + review/. No heavy doc leak. |
| `010-doctor-update-orchestrator/spec.md:180` | PASS — phase parent spec | REQ-P-001 enforces lean trio; REQ-P-002 requires `last_active_child_id`. Phase map correct. |
| `010-doctor-update-orchestrator/graph-metadata.json:223` | SUSPECT | `last_active_child_id: null` (line 220) — already tracked as R2-P1-001. `last_save_at` set but child pointer never populated. |
| `010-doctor-update-orchestrator/description.json:30` | PASS | childTopology correct; parentChain complete. |
| `010-doctor-update-orchestrator/resource-map.md:206` | PASS | Parent aggregate lists only `.opencode/commands/doctor/` paths; no spurious cross-runtime claims. |
| `010-doctor-update-orchestrator/handover.md:276` | SUSPECT | 002-sandbox section line 100 false claim about last_active_child_id. |
| `.opencode/agents/` (12 entries) | PASS | Full agent roster (11 agents + README). |
| `.claude/agents/` (12 entries) | PASS | Full mirror of `.opencode/agents/` (.md format). |
| `.codex/agents/` (12 entries) | PASS | Full mirror of all 11 agents + README (.toml format). |
| `.gemini/agents/` (12 entries) | PASS | Full mirror of all 11 agents + README (.md format). |
| `.opencode/commands/doctor/` (24 files) | PRESENT | 5 new 013 commands (memory, causal-graph, deep-loop, cocoindex, update) + 5 existing + scripts + YAML assets. |
| `.claude/commands/` | MISSING | No `commands/` directory exists under `.claude/`. |
| `.codex/commands/` | MISSING | No `commands/` directory exists under `.codex/`. |
| `.gemini/commands/doctor/` (2 files) | PARTIAL | Only `mcp_install.toml` and `mcp_debug.toml` (pre-existing, pre-013). None of 013's 5 new commands mirrored. |
| `001-initial-doctor-commands/resource-map.md:168` | PASS | Correctly lists only `.opencode/commands/doctor/` paths. No cross-runtime claims. |
| `002-sandbox-testing-playbook/handover.md:100` | SUSPECT | Claims `last_active_child_id correctly tracks 002` — false; field is null. |
| `002-sandbox-testing-playbook/implementation-summary.md:72` | SUSPECT | Claims `derived.last_active_child_id → 002` — false. |
| `002-sandbox-testing-playbook/implementation-summary.md:252` | SUSPECT | Claims `last_active_child_id ← 002-sandbox-testing-playbook` — false. |
| `002-sandbox-testing-playbook/checklist.md:314` | SUSPECT | CHK-504 (last_active_child_id) unchecked — known gap. |
| `002-sandbox-testing-playbook/resource-map.md:176` | SUSPECT | Claims `last_active_child_id ← 002-sandbox-testing-playbook` — false. |

## Findings by Severity

### P1

#### R8-P1-001 [P1] Cross-runtime doctor command mirror missing for 3/4 runtimes

- **File**: `.claude/commands/` (no directory), `.codex/commands/` (no directory), `.gemini/commands/doctor/` (2 files vs 24 in `.opencode/commands/doctor/`)
- **Evidence**: The 013 packet introduced 5 new doctor commands (`memory.md`, `causal-graph.md`, `deep-loop.md`, `cocoindex.md`, `update.md`) plus 5 corresponding YAML assets (e.g. `doctor_memory.yaml`) under `.opencode/commands/doctor/`. In total `.opencode/commands/doctor/` holds 24 files (10 entrypoint `.md` files, 10 YAML assets, 3 scripts, 1 `assets/` subdir). None of the other three runtimes have these commands:
  - `.claude/commands/` — does not exist (no filesystem directory)
  - `.codex/commands/` — does not exist
  - `.gemini/commands/doctor/` — only 2 pre-existing commands (`mcp_install.toml`, `mcp_debug.toml`) in `.toml` format, both referencing `.opencode/commands/doctor/assets/*.yaml` as their workflow source
- **Finding class**: cross-consumer
- **Scope proof**: `glob(".claude/commands/**")` and `glob(".codex/commands/**")` return no results. `glob(".gemini/commands/doctor/**")` returns only 2 files (mcp_install.toml, mcp_debug.toml). `glob(".opencode/commands/doctor/**")` returns 24 files including all 5 new 013 commands.
- **Affected surface hints**: ["doctor command surface", "cross-runtime agent dispatch", ".gemini/commands/doctor/", ".claude/commands/"]
- **Recommendation**: Either (a) mirror all 10 doctor commands to `.claude/commands/doctor/`, `.codex/commands/doctor/`, and expand `.gemini/commands/doctor/` from 2 to 10 commands, or (b) document in the spec that doctor commands are `.opencode/`-runtime-only with the other runtimes delegating to `.opencode/commands/doctor/assets/` YAML as reference. The partial mirror in `.gemini/commands/doctor/` (2/10 commands) is worse than no mirror because it implies coverage that doesn't exist.

#### R8-P1-002 [P1] Doc-code drift: `last_active_child_id` falsely claimed as set in 002-sandbox-testing-playbook docs

- **File**: `002-sandbox-testing-playbook/handover.md:100`, `002-sandbox-testing-playbook/implementation-summary.md:72`, `002-sandbox-testing-playbook/implementation-summary.md:252`, `002-sandbox-testing-playbook/resource-map.md:176`
- **Evidence**: Four separate locations in the 002 child's documentation claim that parent `graph-metadata.json` `derived.last_active_child_id` is set to `"002-sandbox-testing-playbook"`:
  - `handover.md:100`: "last_active_child_id correctly tracks 002"
  - `implementation-summary.md:72`: "derived.last_active_child_id → 002"
  - `implementation-summary.md:252`: "last_active_child_id ← 002-sandbox-testing-playbook (auto-managed by generate-context.js)"
  - `resource-map.md:176`: "Phase parent — derived.last_active_child_id ← 002-sandbox-testing-playbook"
  
  The actual field at `graph-metadata.json:220` is `"last_active_child_id": null`. The child's own `checklist.md:312` correctly has CHK-504 unchecked, acknowledging this gap.
- **Finding class**: instance-only
- **Scope proof**: Grep for `last_active_child_id` in `002-sandbox-testing-playbook/` returns 5 hits in docs claiming it's set, plus 1 hit in `checklist.md` correctly flagging it unchecked. The actual field in parent `graph-metadata.json:220` is `null`.
- **Affected surface hints**: ["002-sandbox-testing-playbook handover", "implementation-summary continuity", "resource-map accuracy"]
- **Recommendation**: Either run `generate-context.js` on the 002 child to populate `last_active_child_id` in the parent (and then verify all 4 doc locations are accurate), or correct the 4 doc locations to note the field is still null with a reference to the known gap (R2-P1-001). The current state is actively misleading for resume/continuity flows.

### P2

#### R8-P2-001 [P2] Gemini runtime doctor commands use inconsistent `.toml` format vs `.md` format

- **File**: `.gemini/commands/doctor/mcp_install.toml:1`, `.gemini/commands/doctor/mcp_debug.toml:1`
- **Evidence**: The two Gemini doctor commands use TOML format (`description` + `prompt` keys) while `.opencode/commands/doctor/` uses Markdown format with YAML frontmatter. Both Gemini `.toml` files reference `.opencode/commands/doctor/assets/doctor_mcp_*.yaml` as their workflow source, creating a cross-runtime dependency on `.opencode/` assets. Since 013's 5 new commands (memory, causal-graph, deep-loop, cocoindex, update) follow the Markdown entrypoint + YAML asset pattern, Gemini runtime would need both format conversion AND new entries to achieve parity.
- **Finding class**: instance-only
- **Scope proof**: Only 2 `.toml` files exist in `.gemini/commands/doctor/`. The `.opencode/commands/doctor/` `.md` entrypoints follow a different structure (full Markdown with YAML frontmatter and embedded instructions). The `.gemini/` format diverges from the `.opencode/` canonical source.
- **Affected surface hints**: ["gemini runtime commands", "doctor command format", "cross-runtime consistency"]
- **Recommendation**: Either add `.toml` mirrors for the 5 new 013 commands under `.gemini/commands/doctor/` (consistent with existing gemini convention), convert gemini to `.md` format for consistency, or document the format divergence as intentional with a runtime-adapter strategy. Note that mcp_install.toml and mcp_debug.toml successfully delegate to `.opencode/commands/doctor/assets/` YAML — the same pattern could be used for the 5 new commands.

#### R8-P2-002 [P2] Parent spec.md scope section doesn't mention allowed cross-cutting docs

- **File**: `010-doctor-update-orchestrator/spec.md:88-95`
- **Evidence**: The "Files to Change" table in the scope section lists only `spec.md`, `description.json`, and `graph-metadata.json` as parent files. The parent directory actually contains 5 files (the trio + `handover.md` + `resource-map.md`). While cross-cutting docs are explicitly allowed per the phase-parent policy in AGENTS.md, the scope table could be slightly misleading for a reviewer checking REQ-P-001.
- **Finding class**: instance-only
- **Scope proof**: spec.md:88-95 lists 3 files but parent directory listing shows 5 files (3 lean trio + 2 cross-cutting). The AGENTS.md phase-parent section explicitly allows handover.md and resource-map.md as cross-cutting docs.
- **Affected surface hints**: ["spec.md scope section", "phase-parent documentation"]
- **Recommendation**: Optionally expand the "Files to Change" table or add a note clarifying that `handover.md` and `resource-map.md` are allowed cross-cutting files outside the lean trio. Not a spec violation — purely documentation clarity.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|---------|
| spec_code (core) | **clean** | REQ-P-001 (lean trio) satisfied — parent has only spec.md, description.json, graph-metadata.json + allowed cross-cutting docs. REQ-P-002 (last_active_child_id) still failing (R2-P1-001, tracked). REQ-P-003 (children_ids) satisfied — both children listed. |
| checklist_evidence (core) | **partial** | CHK-504 (last_active_child_id) unchecked — acknowledges the gap. No cross-runtime checklist items exist for command mirror coverage (gap in spec definition, not checklist). |
| skill_agent (overlay) | **n/a** | No doctor skill introduced by 013 — the commands live standalone under `.opencode/commands/doctor/`. |
| agent_cross_runtime (overlay) | **partial** | Agent mirrors clean (12 agents in all 4 runtimes). But command mirrors fail — 0/3 non-opencode runtimes have 013 doctor commands. See R8-P1-001. |
| feature_catalog_code (overlay) | **clean** | Resource-map paths verified on disk for parent aggregate (`.opencode/commands/doctor/` entries). No fabricated paths. |
| playbook_capability (overlay) | **n/a** | Command mirroring is outside the playbook's scope. |

## Verdict

**CONDITIONAL** — `activeP0 == 0`, `activeP1 == 2` (R8-P1-001, R8-P1-002), plus 2 new P2 advisories (R8-P2-001, R8-P2-002).

**Rationale:**
- Phase-parent lean-trio policy: **PASS**. Parent has exactly the required trio + allowed cross-cutting docs (handover.md, resource-map.md). No heavy docs leaked. REQ-P-001 satisfied.
- Cross-runtime mirror for agents: **PASS**. All 12 agents identically mirrored across all 4 runtimes.
- Cross-runtime mirror for commands: **FAIL** — 5 new doctor commands exist only in `.opencode/commands/doctor/`. `.claude/commands/` and `.codex/commands/` are empty. `.gemini/commands/doctor/` has only 2 pre-existing MCP commands. R8-P1-001.
- Doc-code drift: 002 child docs falsely claim `last_active_child_id` is set. R8-P1-002.
- Pre-existing `last_active_child_id == null` (R2-P1-001) remains open and contributes to overall CONDITIONAL verdict.

## Next Dimension

Iteration 9 should perform **adversarial self-check** on accumulated P0/P1 findings (per strategy plan §Iterations 8-9). Specifically:
- Scrutinize each existing P0/P1 for downgrade potential given evidence gathered in later iterations
- Cross-reference findings for duplicates or contradictory severity assignments
- Verify all open findings in `deep-review-findings-registry.json` are well-formed (claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger present for every P0/P1)
- Flag any findings that should be merged, split, or downgraded before synthesis in iteration 10

## SCOPE VIOLATIONS

None — all writes confined to allowed paths.
