---
title: "Feature Specification: Devin manual-testing playbook"
description: "Author a Devin-native manual-testing playbook for the cli-devin skill: a split-document Feature Catalog (root directory + 8 category folders, ~15-20 DV-NNN scenario files) reframed against Devin's actual 2026-07 CLI surface rather than a blind port of cli-codex's 27-file playbook."
trigger_phrases: ["devin manual testing playbook", "DV-NNN scenarios", "cli-devin playbook categories", "devin hallucination fixture scenario"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/006-devin-manual-testing-playbook"
    last_updated_at: "2026-07-24T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Strengthened hooks REQ-009 to all 8 events + added REQ-013 catalog cross-ref"
    next_safe_action: "Wait for phases 003-005; author 8 hooks scenarios per phase 004's dormancy status"
    blockers: ["devin auth login requires an interactive OAuth browser flow only the operator can complete - blocks scenario EXECUTION, not this phase's authoring work"]
    key_files: [".opencode/specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md", ".opencode/specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Should permission-modes include a destructive/approval-gated scenario analogous to cli-codex's CX-007, given smart/dangerous modes carry comparable risk?", "Once phase 003's skill packet lands, should this playbook's preconditions cite its reference/asset paths verbatim, or pre-draft and reconcile later?"]
    answered_questions: ["Phase 004 is Complete (dormant), not Planned - hooks/ scenarios author against its real paths + confirmed no-op-under-p finding."]
---
# Feature Specification: Devin manual-testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-23 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | `../005-devin-model-registry-and-quota/spec.md` |
| **Successor** | `../007-docs-agents-governance-and-closeout/spec.md` |
| **Handoff Criteria** | Manual-testing playbook authored with Devin-native scenario categories, cross-referenced from `cli-devin/SKILL.md` (per the parent packet's phase-map handoff criteria). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-codex` ships a 27-file manual-testing-playbook (1 root + 26 per-feature scenario files across 9 categories) as its canonical, no-mocking, PASS/FAIL/SKIP validation mechanism - there is no automated test suite for these CLI-dispatch skills, so the playbook IS the gate. `cli-devin` needs its own playbook, but several of Codex's categories (`agent-routing` via `config.toml` `-p profile` routing, `sandbox-modes` via local sandbox flags) are local-CLI-binary-specific and do not map 1:1 onto Devin's actual (2026-07) surface, confirmed live in phase 001. A blind port would fabricate test coverage for capabilities Devin doesn't have in that shape (Codex's 3-tier sandbox modes, `config.toml` profile files), while missing capabilities Devin genuinely does have that Codex doesn't (cloud handoff via `/handoff`, `devin mcp` subcommands, a 4-tier permission model separate from an OS-level `--sandbox` flag, custom `.devin/agents/[name]/AGENT.md` subagent profiles).

### Purpose
Author a Devin-native manual-testing playbook that mirrors the confirmed cli-codex split-document template exactly (root directory file + category folders, universal per-feature scenario template, `DV-NNN` scenario IDs) but reframes the category set against Devin's live-verified 2026-07 surface: 8 categories targeting roughly 15-20 total scenario files, including a dedicated hallucination-fixture scenario grounded in documented `swe-1.6` failure modes, with an explicit note that playbook EXECUTION (not authoring) is gated on the operator completing `devin auth login`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the playbook root file `manual-testing-playbook.md` under `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/`, mirroring cli-codex's confirmed 17-section structure (EXECUTION POLICY banner, SELF-INVOCATION GUARD banner, then numbered §1 Overview through §17 Feature Catalog Cross-Reference Index).
- Author 8 category subdirectories, each with at least 1 `DV-NNN` scenario file using the universal per-feature template (frontmatter, §1 Overview, §2 Scenario Contract, §3 Test Execution, §4 Source Files, §5 Source Metadata): `cli-invocation`, `permission-modes`, `subagents`, `hooks`, `session-continuity`, `cloud-handoff`, `prompt-templates`, `mcp-integration`.
- Target roughly 15-20 total scenario files - smaller than Codex's 26 since several Codex categories don't apply in the same shape.
- Reframe Codex's `sandbox-modes` category as Devin's `permission-modes` category (the 4 permission modes - auto/accept-edits/smart/dangerous - plus the genuinely separate `--sandbox` OS-level flag), not a verbatim port of Codex's read-only/workspace-write/danger-full-access sandbox shape.
- Reframe Codex's `agent-routing` (`config.toml` `-p profile`) category as Devin's `subagents` category (`subagent_explore`, `subagent_general`, custom `.devin/agents/[name]/AGENT.md` profiles), Devin's genuinely different delegation mechanism.
- Add a `hooks` category with exactly 8 scenario files, one per Devin lifecycle event confirmed in phase 001, each stating its real dormancy status (phase 004 confirmed live 2026-07-24 that no hook fires under `devin -p`) rather than a smoke-test-only pass for 2 events and silence on the rest.
- Add a `cloud-handoff` category testing `/handoff` thoroughly, since it may be one of Devin's primary invocation modes rather than a secondary one.
- Add an `mcp-integration` category testing `devin mcp add/list/get/remove/login/logout/enable/disable` - a genuine Devin capability with no direct Codex analog in this shape.
- Port the `prompt-templates` category near-verbatim from Codex's CLEAR/RCAF scoring apparatus - a shared, cli-family-generic pattern.
- Include at least one scenario that dispatches a prompt likely to trigger flag hallucination (canonical example: a fabricated `--reasoning-effort` flag) and verifies the response does not reference a real-looking but fake flag, grounded in the archived 018 packet's documented `swe-1.6` failure modes (hallucinated CLI flags, wrong-cwd path defects, bundle-gate bypasses).
- State explicitly, in the root file's Global Preconditions section, that playbook EXECUTION (not authoring) is gated on the operator completing `devin auth login` - an interactive OAuth flow that cannot be satisfied non-interactively.
- Add a cross-reference to the playbook from `cli-devin/SKILL.md` once phase 003's skill packet exists.

### Out of Scope
- Actually executing any scenario. Execution requires `devin auth login`, an operator-only interactive OAuth step (see parent packet blocker) - this phase authors the playbook, it does not run it.
- Porting Codex's `config.toml` profile-routing or local-sandbox-flag categories verbatim - they don't map onto Devin's actual surface (see Problem Statement).
- Building the `cli-devin` skill packet (phase 003) or the hook adapter layer (phase 004) - this phase only authors the playbook that will validate them once built.
- Wiring `mode-registry.json`/`hub-router.json`/`leaf-manifest.json` - that registry wiring belongs to phase 003; this phase only adds the playbook's own cross-reference pointer into `cli-devin/SKILL.md`.
- Inventing a parallel fictional changelog/version-history narrative for this phase's own docs - that is a phase-007/closeout concern, not authored here, and phase 007 should not fabricate one either.

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md` | Create | Root playbook file, 17-section structure mirroring cli-codex's root file. |
| `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/{cli-invocation,permission-modes,subagents,hooks,session-continuity,cloud-handoff,prompt-templates,mcp-integration}/*.md` | Create | Roughly 15-20 `DV-NNN` scenario files, at least 1 per category, using the universal per-feature template. |
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | Add a cross-reference to the manual-testing playbook (once phase 003 creates this file). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Playbook root file authored with all 17 numbered sections in the confirmed order, plus both banners before §1 | Each of the 17 section headings (`## 1. OVERVIEW` through `## 17. FEATURE CATALOG CROSS-REFERENCE INDEX`) appears exactly once, in ascending order; the EXECUTION POLICY and SELF-INVOCATION GUARD banners appear before §1. |
| REQ-002 | 8 category subdirectories authored, each with at least 1 `DV-NNN` scenario file | `find manual-testing-playbook -mindepth 1 -maxdepth 1 -type d` lists exactly `cli-invocation`, `permission-modes`, `subagents`, `hooks`, `session-continuity`, `cloud-handoff`, `prompt-templates`, `mcp-integration`; each directory contains `>=1` `.md` file. |
| REQ-003 | Total scenario file count lands in the 15-20 range | `find manual-testing-playbook -mindepth 2 -name "*.md" \| wc -l` returns a value between 15 and 20 inclusive. |
| REQ-004 | At least one scenario dispatches a prompt designed to trigger flag hallucination, with Pass/Fail criteria that explicitly reject a fake-flag reference | The scenario cites the archived `swe-1.6` failure modes (hallucinated CLI flags, wrong-cwd path defects, bundle-gate bypasses) and its Pass/Fail line names the FAIL condition (a referenced non-existent flag, e.g. a fabricated `--reasoning-effort`) explicitly, not just the PASS condition. |
| REQ-005 | Root file's Global Preconditions section documents `devin auth login` as an operator-only, non-automatable interactive OAuth step, gating scenario EXECUTION (not authoring) | The preconditions section states this distinction explicitly, in prose a human or AI operator can act on without re-deriving it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Scenario IDs use the `DV-NNN` prefix (Devin), globally unique and sequential with no gaps across all 8 categories | Extracting every `DV-\d{3}` token across all scenario files yields a sorted, gap-free, duplicate-free sequence starting at `DV-001`. |
| REQ-007 | `permission-modes` category documents why it replaces Codex's `sandbox-modes` category (4 permission modes distinct from the separate `--sandbox` OS-level flag) | The category's overview text names all 4 modes (auto/accept-edits/smart/dangerous) and states `--sandbox` is a separate, OS-level mechanism, not a 5th mode. |
| REQ-008 | `subagents` category documents why it replaces Codex's `agent-routing`/`-p profile`/`config.toml` category | The category's scenario files reference `subagent_explore`, `subagent_general`, and a custom `.devin/agents/[name]/AGENT.md` profile at least once each. |
| REQ-009 | **Strengthened 2026-07-24**: `hooks` category contains exactly 8 scenario files, one per Devin lifecycle event (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PermissionRequest`, `Stop`, `PostCompaction`, `SessionEnd`) - not a 2-event minimum. Each scenario's Pass/Fail criteria state the event's real dormancy status per phase 004's confirmed finding (no hook fires under `devin -p`) rather than assuming a live-fire pass. | `find manual-testing-playbook/hooks -name "*.md" \| wc -l` returns exactly 8; each scenario's Pass/Fail section names its dormancy status explicitly, not a silent live-pass assumption. |
| REQ-013 | Every `hooks` scenario cross-references its matching `feature-catalog/hooks/*.md` entry (phase 010) when that catalog exists at scenario-authoring time; if phase 010 hasn't landed yet, the scenario explicitly notes "no catalog entry yet" rather than a broken or omitted link. | Each `hooks` scenario file contains either a working link to `../../feature-catalog/hooks/<event>.md` or the explicit no-catalog-yet note. |
| REQ-010 | `cloud-handoff` category tests `/handoff` thoroughly, not as a single throwaway scenario | The category contains `>=2` scenario files. |
| REQ-011 | Playbook cross-referenced from `cli-devin/SKILL.md` | `cli-devin/SKILL.md` contains at least one reference to `manual-testing-playbook`. |
| REQ-012 | This phase's own docs do not fabricate a changelog/version-history narrative | None of this phase's spec-kit docs contain a changelog or version-history section; that concern is deferred to phase 007, which is flagged not to fabricate one either. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Root playbook file exists with all 17 confirmed sections, structurally mirroring the cli-codex root-file shape.
- **SC-002**: All 8 categories authored, each with at least 1 scenario, total scenario count within the 15-20 target range.
- **SC-003**: The hallucination-fixture scenario exists and its Pass/Fail criteria explicitly reject fake-flag references.
- **SC-004**: Playbook cross-referenced from `cli-devin/SKILL.md`.
- **SC-005**: sk-doc's `validate_document.py` reports 0 structural errors against every playbook file, and this phase's own spec-folder passes `validate.sh <phase-folder> --strict` with 0 errors and 0 warnings.
- **SC-006**: Root file's Global Preconditions explicitly gate scenario EXECUTION (not authoring) on `devin auth login`.
- **SC-007**: `hooks` category has exactly 8 scenarios (one per lifecycle event), each stating its real dormancy status per phase 004's confirmed finding, and cross-referencing its matching phase 010 feature-catalog entry where one exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Phase 003 `cli-devin` skill packet (SKILL.md cross-reference target) | Yellow - Planned, not yet built | Author playbook content independently of SKILL.md's existence; add the cross-reference once phase 003 ships. |
| Dependency | Phase 004 hook adapter layer (adapter script paths + confirmed dormancy status for the `hooks` category) | Green - Complete (dormant) as of 2026-07-24 | Author all 8 `hooks` scenarios against phase 004's actual adapter paths and its confirmed dormancy finding, not phase 001's contract alone; re-verify if phase 008 (the remaining 6 events) lands with a different status per event. |
| Dependency | Phase 005 model registry (current model slugs for the root file's model roster note) | Yellow - Planned | Author against phase 001's confirmed facts (`swe-1.6`, Adaptive router); confirm current sibling-model slugs once phase 005 ships. |
| Dependency | `devin auth login` (operator-only interactive OAuth) | Red - not completed | Blocks scenario EXECUTION only; does not block authoring this phase's docs or the playbook content itself. |
| Risk | Blind port of Codex categories fabricates coverage for capabilities Devin doesn't have in that shape | High if unmitigated | Reframe `permission-modes` and `subagents` per grounded facts (REQ-007/REQ-008); explicit Out-of-Scope callout against verbatim porting. |
| Risk | Scenario-count target (15-20) drifts too high or low during authoring | Low | Track the running count during Phase 2 implementation tasks; verify against REQ-003 in Phase 3. |
| Risk | `swe-1.6` hallucination-fixture facts (archived 018 packet) are stale by implementation time | Medium | Re-verify against live `swe-1.6` behavior where feasible at implementation time; cite the exact archived source for traceability regardless. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the hallucination-fixture scenario re-verify the fake `--reasoning-effort` flag name against a live dispatch on one of phase 005's allowlisted models at implementation time, or is the archived 018 citation sufficient grounding on its own? Leaning toward re-verifying when a live dispatch is feasible.
- Should `permission-modes` include a destructive/approval-gated scenario analogous to cli-codex's `CX-007` (danger-full-access), given `smart`/`dangerous` modes carry comparable risk? Leaning toward yes, scoped to a sandboxed temp directory, mirroring the Codex precedent.
- Once phase 003's skill packet lands, should this playbook's preconditions cite its reference/asset paths verbatim, or pre-draft against the currently-planned layout and reconcile at implementation time? Leaning toward pre-drafting and reconciling (see Risks table).
<!-- /ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable - this phase produces no runtime code path; documented as N/A rather than fabricated.

### Security
- **NFR-S01**: No scenario file may embed a real credential, token, or the operator's actual `COGNITION_API_KEY` value - placeholders only.

### Reliability
- **NFR-R01**: The EXECUTION POLICY banner enforces PASS/FAIL/SKIP-only verdicts (no silent "unavailable" or "unautomatable" classification), matching the cli-codex precedent's reliability bar for the eventual execution phase.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Devin binary absent from PATH: the precondition check fails closed, and every scenario is marked SKIP with a documented blocker rather than FAIL.
- `devin auth` not completed: playbook execution is blocked at the Global Preconditions gate; authoring and this phase's own `validate.sh --strict` proceed unaffected.

### Error Scenarios
- Hallucinated-flag scenario returns ambiguous output (references both a real flag and a fake one): the Pass/Fail criteria must treat any fake-flag reference as FAIL, not PARTIAL.
- `mcp-integration` scenario has no registered MCP server available: the scenario is marked SKIP with a documented blocker (mirroring cli-codex's `CX-025` registration precondition), not silently omitted.

### State Transitions
- Phase 006 authoring begins before phases 003/004/005 fully land: cross-references to SKILL.md, hook-adapter paths, and model slugs are drafted against phase 001's confirmed facts and reconciled once those phases ship (see Risks table).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Root file + ~16-20 scenario files across 8 directories, all markdown, no code. |
| Risk | 8/25 | Docs-only, low blast radius; main risk is miscategorization/fabricated coverage, mitigated by REQ-007/REQ-008. |
| Research | 10/20 | Grounded in confirmed phase 001 facts and archived 018 findings, but exact hook-adapter paths and model slugs depend on phases 004/005 landing first. |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../005-devin-model-registry-and-quota/spec.md` (predecessor)
- `../007-docs-agents-governance-and-closeout/spec.md` (successor)
- `../001-devin-contract-pin/implementation-summary.md` (live Devin CLI contract: hooks, permissions, subagents, cloud handoff, models)
- `../../z_archive/018-cli-devin-prompt-quality/spec.md` (source of the documented `swe-1.6` hallucination-fixture failure modes)
- `../../z_archive/013-cli-copilot-hallucination-caveat/spec.md` (structural analog for documenting a CLI's known hallucination behavior)
- `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md` (structural precedent this phase mirrors)
