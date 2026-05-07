---
title: Deep Review Strategy - 079 sk-deep-agent-improvement
description: Runtime review strategy for the 079 rename packet release-readiness audit.
---

# Deep Review Strategy - 079 sk-deep-agent-improvement

## 1. OVERVIEW

Review the completed `sk-improve-agent` to `deep-agent-improvement` rename packet for release readiness. The review is read-only for all source, spec, command, skill, agent, and runtime mirror files. Only artifacts under this `review/` directory are writable.

## 2. TOPIC

Review target: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement` (`spec-folder`).

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness - Iteration 001 validated rename outputs, runtime command mirror existence, advisor/source claims, and implementation/resource-map claims against files on disk; one P1 resource-map evidence mismatch remains active.
- [x] D2 Security - Iteration 002 checked representative SKILL frontmatter, command YAML shell invocations, and path-consuming scripts; one P1 unquoted-placeholder shell/path handling issue remains active.
- [x] D3 Traceability - Iteration 003 cross-checked spec requirements, task/checklist claims, implementation evidence, and resource-map coverage; one new P1 completion-status mismatch remains active alongside prior resource-map evidence mismatch.
- [x] D4 Maintainability - Iteration 004 reviewed root docs, install docs, SKILL.md, and packet docs for naming consistency, historical-record boundaries, and follow-on operator clarity; one P2 stale install-guide skill inventory row remains active.
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Do not modify rename implementation files.
- Do not repair findings during this review loop.
- Do not re-run the full `/improve:agent` implementation workflow.
- Do not rename `@improve-agent`, `/improve:agent`, or YAML asset filenames unless reporting a finding.

## 5. STOP CONDITIONS

- Stop at convergence after all configured dimensions have coverage and legal-stop gates pass.
- Stop at `maxIterations=5` and synthesize remaining risks if convergence is not legal.
- Any active P0 yields FAIL; any active P1 yields CONDITIONAL; P2 only yields PASS with advisories.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 001 | Implementation-summary runtime mirror claims checked clean for Gemini/Codex; advisor sampled references use `deep-agent-improvement`; resource-map runtime mirror inventory has one active P1 stale-evidence mismatch. |
| Security | CONDITIONAL | 002 | Representative command YAML, SKILL frontmatter, and path-consuming scripts reviewed; auto/confirm workflow command strings interpolate user-controlled placeholders unquoted before script-level path handling. |
| Traceability | CONDITIONAL | 003 | Spec/checklist/task/implementation-summary cross-check found completion wording claiming all P0/P1 requirements met while REQ-015 `/memory:save`, T-041, and CHK-055 remain pending; resource-map stale runtime mirror rows carried forward. |
| Maintainability | PASS-with-advisory | 004 | Root docs, install docs, SKILL.md, and packet docs reviewed for naming clarity and historical boundaries; one P2 stale install-guide table still advertises retired `sk-deep-research` / `sk-deep-review` skill IDs. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 3 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +0 P1, +1 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Pending first iteration.
- Iteration 001: Exact disk inventory plus targeted Grep/Read evidence quickly separated correct implementation-summary claims from stale resource-map mirror rows.
- Iteration 002: Exact Read/Grep evidence on command YAML and representative Node scripts isolated the shell boundary from script-level path parsing.
- Iteration 003: Packet-local Read plus exact runtime mirror glob evidence exposed a release-readiness traceability mismatch without relying on the stale code graph.
- Iteration 004: Exact Grep/Read across root docs, install docs, SKILL.md, and packet docs separated allowed historical rename prose from one actionable setup-doc naming drift.

## 9. WHAT FAILED

- Pending first iteration.
- Iteration 001: The resource map retained pre-implementation `OK` rows for Codex command files and Gemini YAML assets that do not exist on disk.
- Iteration 002: Command workflow templates still expose unquoted user placeholders in shell command strings; script-level parsing cannot mitigate shell metacharacters before process launch.
- Iteration 003: Completion wording and continuity percentage were advanced before `/memory:save`, T-041, and CHK-055 were reconciled, leaving inconsistent release-readiness evidence.
- Iteration 004: `.opencode/install_guides/SET-UP - AGENTS.md` still advertises retired `sk-deep-research` and `sk-deep-review` names in the active installation table while adjacent current setup docs use `deep-research` and `deep-review`.

## 10. EXHAUSTED APPROACHES (do not retry)

- None yet.

## 11. RULED OUT DIRECTIONS

- None yet.
- Iteration 001: Do not treat absent `.codex/commands/improve/` or absent `.gemini/commands/improve/assets/*.yaml` as runtime implementation failures; implementation-summary documents both shapes as intentional/N/A. The active issue is stale resource-map evidence.
- Iteration 002: Do not escalate the placeholder issue to P0 unless the dispatcher is proven to execute unescaped malicious values end-to-end; current packet evidence supports P1.
- Iteration 003: Do not duplicate P1-001 for resource-map runtime mirror rows; carry it forward as the same active evidence mismatch unless new surfaces are found.
- Iteration 004: Do not treat retained `@improve-agent`, `/improve:agent`, YAML asset filenames, historical changelog prose, or specs research artifacts as maintainability defects; packet docs explicitly preserve those boundaries.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Dimension: cross-reference synthesis
Focus area: Final convergence/legal-stop check across all four completed dimensions, active P1 carry-forward, and reducer/report readiness.
Reason: Maintainability completed in iteration 004 with one P2 setup-doc naming drift; all configured dimensions now have coverage but active P1s still block release readiness.
Required evidence: Verify state/strategy/finding counts, carry forward active P1/P2 findings, and decide whether iteration 005 should synthesize or inspect any unresolved cross-reference protocol.
Rotation status: correctness, security, traceability, and maintainability completed; rotate to synthesis/cross-reference fallback if another iteration runs.
Blocked/productive carry-forward: Productive exact Grep/Read evidence; code graph remains stale and should not be relied on. Active P1s need resource-map correction, shell/path placeholder hardening, and completion-status reconciliation; active P2 needs install-guide skill inventory cleanup.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

- Packet-local continuity says implementation is complete at 100% and next safe action is memory save (`implementation-summary.md` frontmatter lines 11-28).
- Scope claims include a symbolic-only skill rename while keeping `@improve-agent` and `/improve:agent` stable (`spec.md` lines 73-94).
- Implementation summary claims approximately 116 files migrated, advisor rebuilt, residual active grep clean, and no auto-branch (`implementation-summary.md` lines 34-43 and 68-93).
- Resource map is present and first-class for this review; it claims exhaustive coverage of active-code reference sites and includes command/runtime mirror inventories (`resource-map.md` lines 35-43, 82-116).
- Graph status is stale and CocoIndex readiness is unavailable for this session; exact Grep/Glob/Read evidence should be preferred over structural graph claims.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 001 | Correctness checked implementation-summary/resource-map claims against runtime command disk state and advisor sampled source references. |
| `security_shell_path` | security | partial | 002 | Representative command YAML and path-consuming scripts checked; active P1 for unquoted workflow placeholders crossing shell boundaries. |
| `checklist_evidence` | core | failed | 003 | Implementation-summary claims all P0/P1 requirements met while REQ-015, T-041, CHK-055, and checklist summary remain unchecked/pending. |
| `feature_catalog_code` | overlay | pending | - | Not yet executed. |
| `playbook_capability` | overlay | partial | 004 | Root/install/SKILL operator docs checked for naming and current-release clarity; one P2 stale install-guide skill inventory row remains. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md` | - | - | 0 | pending |
| `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/plan.md` | - | - | 0 | pending |
| `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/tasks.md` | traceability | 003 | 1 | active P1 |
| `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/checklist.md` | traceability | 003 | 1 | active P1 |
| `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md` | correctness, traceability | 003 | 1 | active P1 |
| `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md` | correctness, traceability | 003 | 1 | active P1 |
| `.opencode/skills/deep-agent-improvement/**` | security | 002 | 0 | representative scripts/frontmatter checked |
| `.opencode/commands/improve/**` | security | 002 | 1 | active P1 |
| `.claude/commands/improve/**` | correctness | 001 | 0 | checked |
| `.gemini/commands/improve/**` | correctness | 001 | 0 | checked |
| `.codex/commands/improve/**` | correctness | 001 | 1 | absent; matches implementation-summary N/A but contradicts resource-map |
| `.opencode/agents/improve-agent.md` | - | - | 0 | pending |
| `.claude/agents/improve-agent.md` | - | - | 0 | pending |
| `.gemini/agents/improve-agent.md` | - | - | 0 | pending |
| `.codex/agents/improve-agent.toml` | - | - | 0 | pending |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/**` | correctness | 001 | 0 | sampled clean |
| `README.md`, `AGENTS.md`, `.opencode/install_guides/**` | maintainability | 004 | 1 | active P2 in `SET-UP - AGENTS.md`; root README/AGENTS and install README sampled clean for 079 naming |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-2026-05-06T12:38:00Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-05-06T12:38:00Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence`: failed for completion status. `checklist.md` remains fully unchecked in the verification summary [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/checklist.md:155`] while `implementation-summary.md` claims all P0/P1 requirements met [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:36`]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: failed for completion status. `checklist.md` remains fully unchecked in the verification summary [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/checklist.md:155`] while `implementation-summary.md` claims all P0/P1 requirements met [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:36`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: failed for completion status. `checklist.md` remains fully unchecked in the verification summary [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/checklist.md:155`] while `implementation-summary.md` claims all P0/P1 requirements met [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:36`].

### `historical_record_boundaries`: clean for the inspected 079 docs. `spec.md` explicitly preserves historical changelog narrative and specs research artifacts while updating active path strings [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:92`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:93`], and `implementation-summary.md` repeats the same boundary [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:174`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:175`]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `historical_record_boundaries`: clean for the inspected 079 docs. `spec.md` explicitly preserves historical changelog narrative and specs research artifacts while updating active path strings [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:92`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:93`], and `implementation-summary.md` repeats the same boundary [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:174`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:175`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `historical_record_boundaries`: clean for the inspected 079 docs. `spec.md` explicitly preserves historical changelog narrative and specs research artifacts while updating active path strings [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:92`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:93`], and `implementation-summary.md` repeats the same boundary [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:174`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:175`].

### `implementation-summary.md` runtime mirror statements were checked against disk for Gemini and Codex. The summary correctly says Gemini has only `improve-agent.toml` + `README.txt` and no YAML assets, and that `.codex/commands/improve/` does not exist. [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:87`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:88`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `implementation-summary.md` runtime mirror statements were checked against disk for Gemini and Codex. The summary correctly says Gemini has only `improve-agent.toml` + `README.txt` and no YAML assets, and that `.codex/commands/improve/` does not exist. [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:87`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:88`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `implementation-summary.md` runtime mirror statements were checked against disk for Gemini and Codex. The summary correctly says Gemini has only `improve-agent.toml` + `README.txt` and no YAML assets, and that `.codex/commands/improve/` does not exist. [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:87`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:88`]

### `maintainability_naming`: partial. `README.md`, `AGENTS.md`, `.opencode/install_guides/README.md`, and `.opencode/skills/deep-agent-improvement/SKILL.md` use `deep-agent-improvement` consistently for the renamed skill [SOURCE: `README.md:845`, `README.md:1217`, `AGENTS.md:324`, `.opencode/install_guides/README.md:1200`, `.opencode/skills/deep-agent-improvement/SKILL.md:2`]. One adjacent install-guide inventory table still uses retired `sk-deep-research` / `sk-deep-review` skill IDs [SOURCE: `.opencode/install_guides/SET-UP - AGENTS.md:514`, `.opencode/install_guides/SET-UP - AGENTS.md:515`]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `maintainability_naming`: partial. `README.md`, `AGENTS.md`, `.opencode/install_guides/README.md`, and `.opencode/skills/deep-agent-improvement/SKILL.md` use `deep-agent-improvement` consistently for the renamed skill [SOURCE: `README.md:845`, `README.md:1217`, `AGENTS.md:324`, `.opencode/install_guides/README.md:1200`, `.opencode/skills/deep-agent-improvement/SKILL.md:2`]. One adjacent install-guide inventory table still uses retired `sk-deep-research` / `sk-deep-review` skill IDs [SOURCE: `.opencode/install_guides/SET-UP - AGENTS.md:514`, `.opencode/install_guides/SET-UP - AGENTS.md:515`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `maintainability_naming`: partial. `README.md`, `AGENTS.md`, `.opencode/install_guides/README.md`, and `.opencode/skills/deep-agent-improvement/SKILL.md` use `deep-agent-improvement` consistently for the renamed skill [SOURCE: `README.md:845`, `README.md:1217`, `AGENTS.md:324`, `.opencode/install_guides/README.md:1200`, `.opencode/skills/deep-agent-improvement/SKILL.md:2`]. One adjacent install-guide inventory table still uses retired `sk-deep-research` / `sk-deep-review` skill IDs [SOURCE: `.opencode/install_guides/SET-UP - AGENTS.md:514`, `.opencode/install_guides/SET-UP - AGENTS.md:515`].

### `operator_follow_on_clarity`: partial. The skill current-release section clearly retracts unsupported lineage modes and tells operators to start a new session [SOURCE: `.opencode/skills/deep-agent-improvement/SKILL.md:306`, `.opencode/skills/deep-agent-improvement/SKILL.md:308`, `.opencode/skills/deep-agent-improvement/SKILL.md:310`]. Prior P1-003 remains active for packet completion follow-on clarity because `/memory:save`, T-041, and CHK-055 remain pending. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `operator_follow_on_clarity`: partial. The skill current-release section clearly retracts unsupported lineage modes and tells operators to start a new session [SOURCE: `.opencode/skills/deep-agent-improvement/SKILL.md:306`, `.opencode/skills/deep-agent-improvement/SKILL.md:308`, `.opencode/skills/deep-agent-improvement/SKILL.md:310`]. Prior P1-003 remains active for packet completion follow-on clarity because `/memory:save`, T-041, and CHK-055 remain pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `operator_follow_on_clarity`: partial. The skill current-release section clearly retracts unsupported lineage modes and tells operators to start a new session [SOURCE: `.opencode/skills/deep-agent-improvement/SKILL.md:306`, `.opencode/skills/deep-agent-improvement/SKILL.md:308`, `.opencode/skills/deep-agent-improvement/SKILL.md:310`]. Prior P1-003 remains active for packet completion follow-on clarity because `/memory:save`, T-041, and CHK-055 remain pending.

### `REQ-015`: inconsistent. The spec requires `/memory:save` as P1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:140`], but the implementation summary marks it pending [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:163`] and the task/checklist ledgers leave T-041/CHK-055 unchecked [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/tasks.md:151`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/checklist.md:138`]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `REQ-015`: inconsistent. The spec requires `/memory:save` as P1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:140`], but the implementation summary marks it pending [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:163`] and the task/checklist ledgers leave T-041/CHK-055 unchecked [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/tasks.md:151`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/checklist.md:138`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `REQ-015`: inconsistent. The spec requires `/memory:save` as P1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:140`], but the implementation summary marks it pending [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:163`] and the task/checklist ledgers leave T-041/CHK-055 unchecked [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/tasks.md:151`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/checklist.md:138`].

### `resource_map_coverage`: prior P1-001 remains active. `resource-map.md` claims missing on disk is 0 and marks Codex/Gemini command rows OK [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:41`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:107`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:108`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:109`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:115`]; exact glob evidence for `.gemini/commands/improve/**` returned only `README.txt` and `improve-agent.toml`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `resource_map_coverage`: prior P1-001 remains active. `resource-map.md` claims missing on disk is 0 and marks Codex/Gemini command rows OK [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:41`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:107`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:108`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:109`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:115`]; exact glob evidence for `.gemini/commands/improve/**` returned only `README.txt` and `improve-agent.toml`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `resource_map_coverage`: prior P1-001 remains active. `resource-map.md` claims missing on disk is 0 and marks Codex/Gemini command rows OK [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:41`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:107`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:108`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:109`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:115`]; exact glob evidence for `.gemini/commands/improve/**` returned only `README.txt` and `improve-agent.toml`.

### `resource-map.md` runtime mirror rows were checked against disk and found inconsistent for Gemini YAML assets and Codex command files. [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:63`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:108`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:109`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:115`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `resource-map.md` runtime mirror rows were checked against disk and found inconsistent for Gemini YAML assets and Codex command files. [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:63`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:108`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:109`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:115`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `resource-map.md` runtime mirror rows were checked against disk and found inconsistent for Gemini YAML assets and Codex command files. [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:63`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:108`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:109`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:115`]

### `spec_code`: partial. Focused on requirement-to-evidence consistency for REQ-014/REQ-015 and runtime-resource inventory evidence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: partial. Focused on requirement-to-evidence consistency for REQ-014/REQ-015 and runtime-resource inventory evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Focused on requirement-to-evidence consistency for REQ-014/REQ-015 and runtime-resource inventory evidence.

### Advisor source references sampled in the configured scope show `deep-agent-improvement` references in `skill_advisor.py`, `skill-graph.json`, `fusion.ts`, `graph-metadata.json`, and native scorer tests, with no sampled active `sk-improve-agent` advisor reference found. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Advisor source references sampled in the configured scope show `deep-agent-improvement` references in `skill_advisor.py`, `skill-graph.json`, `fusion.ts`, `graph-metadata.json`, and native scorer tests, with no sampled active `sk-improve-agent` advisor reference found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Advisor source references sampled in the configured scope show `deep-agent-improvement` references in `skill_advisor.py`, `skill-graph.json`, `fusion.ts`, `graph-metadata.json`, and native scorer tests, with no sampled active `sk-improve-agent` advisor reference found.

### Code graph was stale and not used as evidence. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Code graph was stale and not used as evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Code graph was stale and not used as evidence.

### No active P0: evidence shows a command-template injection boundary, but exploitability depends on the dispatcher passing malicious placeholder values without escaping. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No active P0: evidence shows a command-template injection boundary, but exploitability depends on the dispatcher passing malicious placeholder values without escaping.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No active P0: evidence shows a command-template injection boundary, but exploitability depends on the dispatcher passing malicious placeholder values without escaping.

### No duplicate P1 for checklist/task/implementation-summary completion mismatch; P1-003 already covers that traceability gate. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No duplicate P1 for checklist/task/implementation-summary completion mismatch; P1-003 already covers that traceability gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No duplicate P1 for checklist/task/implementation-summary completion mismatch; P1-003 already covers that traceability gate.

### No finding for retained `@improve-agent` or `/improve:agent`: the packet explicitly keeps those stable [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:88`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:89`]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No finding for retained `@improve-agent` or `/improve:agent`: the packet explicitly keeps those stable [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:88`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:89`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No finding for retained `@improve-agent` or `/improve:agent`: the packet explicitly keeps those stable [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:88`, `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md:89`].

### No new P1 for `deep-agent-improvement` root/install-guide references: exact matches in `README.md`, `AGENTS.md`, and `.opencode/install_guides/README.md` use the new skill name. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No new P1 for `deep-agent-improvement` root/install-guide references: exact matches in `README.md`, `AGENTS.md`, and `.opencode/install_guides/README.md` use the new skill name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new P1 for `deep-agent-improvement` root/install-guide references: exact matches in `README.md`, `AGENTS.md`, and `.opencode/install_guides/README.md` use the new skill name.

### No separate finding for broad SKILL.md allowed tools: the skill is explicitly an improvement workflow that writes packet-local candidates and uses Bash, so the allowed tool list alone is not evidence of a rename-introduced security regression [SOURCE: `.opencode/skills/deep-agent-improvement/SKILL.md:4`, `.opencode/skills/deep-agent-improvement/SKILL.md:38`]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No separate finding for broad SKILL.md allowed tools: the skill is explicitly an improvement workflow that writes packet-local candidates and uses Bash, so the allowed tool list alone is not evidence of a rename-introduced security regression [SOURCE: `.opencode/skills/deep-agent-improvement/SKILL.md:4`, `.opencode/skills/deep-agent-improvement/SKILL.md:38`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No separate finding for broad SKILL.md allowed tools: the skill is explicitly an improvement workflow that writes packet-local candidates and uses Bash, so the allowed tool list alone is not evidence of a rename-introduced security regression [SOURCE: `.opencode/skills/deep-agent-improvement/SKILL.md:4`, `.opencode/skills/deep-agent-improvement/SKILL.md:38`].

### Review stayed within the declared target and representative security files named by dispatch. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Review stayed within the declared target and representative security files named by dispatch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Review stayed within the declared target and representative security files named by dispatch.

### Ruled out a Gemini command asset implementation failure: `.gemini/commands/improve/` intentionally has no YAML assets per `implementation-summary.md`; the active issue is resource-map mismatch. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Ruled out a Gemini command asset implementation failure: `.gemini/commands/improve/` intentionally has no YAML assets per `implementation-summary.md`; the active issue is resource-map mismatch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a Gemini command asset implementation failure: `.gemini/commands/improve/` intentionally has no YAML assets per `implementation-summary.md`; the active issue is resource-map mismatch.

### Ruled out a new P0: the mismatch affects release-readiness/traceability claims, not immediate exploitable or destructive behavior. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out a new P0: the mismatch affects release-readiness/traceability claims, not immediate exploitable or destructive behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a new P0: the mismatch affects release-readiness/traceability claims, not immediate exploitable or destructive behavior.

### Ruled out a runtime command implementation failure for Codex commands: the absence of `.codex/commands/improve/` is documented as N/A by `implementation-summary.md`, so the active issue is stale resource-map evidence rather than a missing required Codex command implementation. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Ruled out a runtime command implementation failure for Codex commands: the absence of `.codex/commands/improve/` is documented as N/A by `implementation-summary.md`, so the active issue is stale resource-map evidence rather than a missing required Codex command implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a runtime command implementation failure for Codex commands: the absence of `.codex/commands/improve/` is documented as N/A by `implementation-summary.md`, so the active issue is stale resource-map evidence rather than a missing required Codex command implementation.

### Ruled out duplicating P1-001: resource-map stale runtime rows remain active prior findings, not a distinct new traceability finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out duplicating P1-001: resource-map stale runtime rows remain active prior findings, not a distinct new traceability finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out duplicating P1-001: resource-map stale runtime rows remain active prior findings, not a distinct new traceability finding.

### Ruled out relying on code graph for traceability because startup digest marked graph status stale. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out relying on code graph for traceability because startup digest marked graph status stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out relying on code graph for traceability because startup digest marked graph status stale.

### Security focus followed the strategy next focus for unsafe path handling, shell command regressions, secret exposure, and broadened permissions. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Security focus followed the strategy next focus for unsafe path handling, shell command regressions, secret exposure, and broadened permissions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Security focus followed the strategy next focus for unsafe path handling, shell command regressions, secret exposure, and broadened permissions.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Dimension: cross-reference synthesis Focus area: Final convergence/legal-stop check across all four completed dimensions, active P1 carry-forward, and reducer/report readiness. Reason: Maintainability is now covered with one new P2 stale install-guide inventory finding; all configured dimensions have at least one iteration of coverage. Rotation status: correctness, security, traceability, and maintainability completed. Blocked/productive carry-forward: Productive exact Grep/Read evidence; avoid stale code graph. Active P1s remain P1-001, P1-002, and P1-003; new P2 is install-guide skill inventory naming drift. Required evidence: Verify state/strategy/finding counts and decide whether iteration 005 should synthesize or inspect any unresolved cross-reference protocol.

<!-- /ANCHOR:next-focus -->
