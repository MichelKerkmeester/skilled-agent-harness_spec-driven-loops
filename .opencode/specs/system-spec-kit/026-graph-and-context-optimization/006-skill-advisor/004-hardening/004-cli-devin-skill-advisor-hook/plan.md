---
title: "Implementation Plan: CLI Devin Skill Advisor Hook"
description: "Phase A research is complete; Phase B synthesizes docs; Phase C implements the mk-skill-advisor rename and Devin hook; Phase D verifies; Phase E checks cross-packet integration."
trigger_phrases:
  - "cli-devin"
  - "skill-advisor"
  - "phase b"
  - "advisor plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook"
    last_updated_at: "2026-05-15T17:30:00Z"
    last_updated_by: "cli-codex-phase-b"
    recent_action: "Phase B synthesis complete"
    next_safe_action: "Phase C implementation"
    blockers: []
    key_files:
      - "plan.md"
      - "decision-record.md"
      - "tasks.md"
      - "resource-map.md"
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "Phase A findings F001-F010 incorporated into implementation plan."
---

# Implementation Plan: CLI Devin Skill Advisor Hook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---
<!-- ANCHOR:summary -->
## 1. SUMMARY

Phase A is complete and produced 10 research findings covering Devin hook compatibility, source location, compile target, plugin rename blast radius, bridge ownership, post-extraction audit, runtime parity, sk-code, sk-doc, and final synthesis. The only low-confidence point is Devin's empirical handling of Claude context injection, so the plan deliberately implements both sides of the mitigation: an explicit Devin hook variant plus inherited Claude configuration as a safety net.

Phase B turns those findings into implementation-ready packet docs. This plan, `spec.md`, `tasks.md`, `decision-record.md`, `checklist.md`, and `resource-map.md` define the Phase C work without modifying source, `.devin`, `.claude`, `.opencode/skills`, or research outputs.

Phase C belongs to cli-opencode + deepseek-v4-pro in a worktree-isolated run. Phase D returns to the packet owner for verification: strict validation, typecheck, vitest, sk-doc DQI, MCP boot smoke, 5-runtime parity, and live Devin `/hooks`. Phase E reconciles the shared `.devin/hooks.v1.json` merge with packet 036.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Phase | Command or Evidence | Pass Condition |
|------|-------|---------------------|----------------|
| Spec strict validation | B, D, E | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | Exit 0; exit 1 only acceptable for reviewed implementation-summary placeholder before Phase D. |
| sk-code typecheck | D | `tsc --noEmit` in advisor TypeScript surface | Exit 0. |
| Vitest scoped tests | D | `vitest run` on touched advisor tests | Exit 0. |
| Runtime parity | D | 5-runtime parity fixture | Claude/Gemini/Codex/OpenCode/Devin slugs match; confidence +/-0.01. |
| MCP boot smoke | D | Advisor MCP server boot plus public tool smoke | 8 advisor public tools respond. |
| sk-doc DQI | D | sk-doc DQI scorer over touched docs | DQI >= 4.0 each. |
| Devin live smoke | D | `/hooks` and prompt smoke | Devin lists hook and surfaces/fail-opens advisor brief. |
| Grep cleanup | D | Case-insensitive grep excluding history | No current legacy plugin/bridge refs. |
<!-- /ANCHOR:quality-gates -->

---
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The advisor keeps skill-owned runtime hooks and moves the bridge to the same extracted skill boundary.

```text
Devin UserPromptSubmit
  |
  v
.devin/hooks.v1.json
  |
  v
bash -c 'cd "${DEVIN_PROJECT_DIR}" && node .../dist/.../hooks/devin/user-prompt-submit.js'
  |
  v
.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts
  |
  v
buildSkillAdvisorBrief(runtime="devin")
  |
  +--> diagnostic JSONL / fail-open
  +--> hookSpecificOutput.additionalContext

OpenCode plugin rename
  |
  v
.opencode/plugins/mk-skill-advisor.js
  |
  v
.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs
  |
  v
mk_skill_advisor MCP server (stable)
```
<!-- /ANCHOR:architecture -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Owner | Entry Criteria | Work | Exit Criteria |
|-------|-------|----------------|------|---------------|
| Phase A - Research | cli-devin SWE-1.6 | Phase 0 scaffold exists. | 10 iterations over Q1-Q10. | `research/research.md` and `findings.json` complete. DONE. |
| Phase B - Synthesis | cli-codex | Phase A complete. | Update packet docs and create `resource-map.md`. | Strict validation reviewed; docs ready for implementation. CURRENT. |
| Phase C - Implementation | cli-opencode + deepseek-v4-pro | Phase B docs accepted; branch remains `main` or worktree-isolated branch per dispatch. | Rename plugin/bridge, add Devin hook, update docs/tests/config. | Scoped implementation present; no commits. |
| Phase D - Verification | cli-codex | Phase C returns changes. | Run typecheck, vitest, MCP smoke, DQI, strict validate, `/hooks`, grep cleanup. | Checklist evidence filled; failures fixed or reported. |
| Phase E - Integration | cli-codex | Both packets 025 and 036 verified. | Reconcile shared `.devin/hooks.v1.json`, cross-packet smoke, final memory save. | Ready for completion summary and handover. |
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. **5-runtime parity smoke**: Extend or create `runtime-parity.vitest.ts` to call `buildSkillAdvisorBrief()` for `claude`, `gemini`, `codex`, `opencode`, and `devin`. Slugs must be byte-equivalent; confidence values tolerate +/-0.01 (F007/Q7).
2. **Live Devin `/hooks` test**: Verify Devin lists the explicit `UserPromptSubmit` entry after `.devin/hooks.v1.json` is created. Then run one prompt smoke and record whether inherited Claude and explicit Devin paths double-fire.
3. **MCP server boot smoke**: Start the advisor MCP server and verify the 8 public tools respond: `advisor_status`, `advisor_recommend`, `advisor_rebuild`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`.
4. **Plugin/bridge smoke**: Cold-start OpenCode plugin loading and run bridge tests after `mk-skill-advisor` rename.
5. **Doc validation**: Rescore touched advisor docs with sk-doc DQI target >= 4.0.
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase A cli-devin research is complete and verified by `research/findings.json`.
- `.devin` binary auth was verified in the approved plan; Phase C must not self-invoke cli-devin from inside Devin.
- cli-opencode with `deepseek/deepseek-v4-pro` or `deepseek-v4-pro-max` must be available for Phase C dispatch.
- `main` is the baseline branch; no Phase B branch or commit is created.
- `.devin/hooks.v1.json` is a shared final merge file with packet 036.
- `.devin/config.json` must keep or explicitly evaluate `read_config_from.claude=true`.
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

For uncommitted work, revert only Phase C scoped paths from `main`:

```bash
git checkout main -- .opencode/plugins/mk-skill-advisor.js
git checkout main -- .opencode/plugins/spec-kit-skill-advisor.js
git checkout main -- .opencode/skills/system-skill-advisor
git checkout main -- .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs
git checkout main -- .devin/hooks.v1.json .devin/config.json
```

If Phase C uses a worktree and creates an orphan branch by accident, switch back to `main`, remove the worktree with `git worktree remove <path>`, and delete the orphan branch only after confirming no wanted changes exist there.
<!-- /ANCHOR:rollback -->

---
<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase A research
  -> Phase B spec synthesis
    -> Phase C implementation
      -> Phase D verification
        -> Phase E cross-packet integration
```

Packets 025 and 036 are implementation-independent except for the final `.devin/hooks.v1.json` merge. No cycle exists: each packet can complete rename/hook/test work separately, then Phase E merges registrations and verifies both hooks appear together.
<!-- /ANCHOR:phase-deps -->

---
<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Notes |
|-------|----------|-------|
| Phase A | Complete | 10 iterations already done. |
| Phase B | 45-75 minutes | Docs, ADRs, resource map, strict validation. |
| Phase C | 2-4 hours | Rename, bridge move, hook source, dist, config, tests/docs. |
| Phase D | 60-120 minutes | Typecheck, vitest, DQI, MCP boot, Devin smoke, grep cleanup. |
| Phase E | 30-60 minutes | Shared `.devin/hooks.v1.json` reconciliation and final packet validation. |
<!-- /ANCHOR:effort -->

---
<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Record baseline SHA before Phase C:

```bash
BASELINE_SHA=$(git rev-parse HEAD)
```

Atomic rollback per packet can reset only scoped Phase C paths to that SHA:

```bash
git checkout "$BASELINE_SHA" -- .opencode/plugins .opencode/skills/system-skill-advisor .devin/hooks.v1.json .devin/config.json
```

Do not reset the repository globally. Preserve unrelated user changes and packet 036 changes unless the rollback explicitly targets the shared `.devin/hooks.v1.json` merge.
<!-- /ANCHOR:enhanced-rollback -->

---
<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION

| Phase | Executor | Invariants |
|-------|----------|------------|
| A | cli-devin SWE-1.6 | Complete; research frozen. |
| B | cli-codex | No SpawnAgent, no source/config writes outside packet docs. |
| C | cli-opencode + deepseek-v4-pro | Worktree-isolated implementation, no commits, no branch left behind, no frozen research edits. |
| D | cli-codex | Verify before completion claims; fill checklist evidence only after commands run. |
| E | cli-codex | Merge packet 025 and 036 registrations and reconcile final docs. |

Autonomous handoff invariants: preserve `main`, do not touch frozen research, keep `implementation-summary.md` placeholder until verified implementation, and report any HALT condition in packet issues.
<!-- /ANCHOR:ai-execution -->

---
<!-- ANCHOR:architecture-overview -->
## L3: ARCHITECTURE OVERVIEW

High-level data flow:

```text
User prompt in Devin
  -> Devin UserPromptSubmit hook
  -> advisor brief builder
  -> skill graph / routing context
  -> additional context returned to Devin
  -> model sees advisor routing guidance
```

The plugin path is separate from the hook path:

```text
OpenCode loads mk-skill-advisor plugin
  -> plugin launches mk-skill-advisor bridge
  -> bridge starts mk_skill_advisor MCP server
  -> advisor tools remain stable
```
<!-- /ANCHOR:architecture-overview -->

---
<!-- ANCHOR:risk-mitigation -->
## L3: RISK MITIGATION

| Risk | Finding | Mitigation | Verification |
|------|---------|------------|--------------|
| Devin context injection uncertain | F001/Q1 | Explicit variant + inherited Claude safety net. | `/hooks` and live prompt smoke. |
| Double firing | ADR-001 | Detect in Phase D; disable inherited path or rely on deduplication. | Prompt smoke diagnostics. |
| Plugin rename cache break | F004/Q4 | Rename all current refs and cold-start OpenCode. | Plugin load smoke. |
| Env alias regression | F004/Q4 | Keep `SPECKIT_*`, add `MK_*`. | Env-var tests. |
| Bridge import break | F005/Q5 | Move bridge and update plugin import in same phase. | Bridge vitest. |
| Post-extraction false cleanup | F006/Q6 | Only remediate legacy refs; keep justified shared/build refs. | Grep audit. |
| Runtime parity drift | F007/Q7 | Exact slug comparison, confidence tolerance. | Parity vitest. |
| Doc quality gap | F009/Q9 | Update stale docs and rescore. | DQI >= 4.0. |
<!-- /ANCHOR:risk-mitigation -->

---
<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
F001/Q1 + F002/Q2
  -> ADR-001
  -> T2.1 Devin hook
  -> T3.1/T3.2 parity tests

F004/Q4
  -> ADR-002
  -> T1.1/T1.4 docs/tests/env aliases

F005/Q5 + F006/Q6
  -> ADR-003
  -> T1.2/T1.3 bridge move and audit cleanup

F008/Q8 + F009/Q9
  -> Phase D gates
  -> checklist evidence
```
<!-- /ANCHOR:dependency-graph -->

---
<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Rename plugin and bridge first so all current refs point at the new identity.
2. Add Devin hook source and compile target.
3. Merge `.devin/hooks.v1.json` with packet 036.
4. Add parity and bridge tests.
5. Update docs and DQI.
6. Run verification and fill checklist.
<!-- /ANCHOR:critical-path -->

---
<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1: Phase B synthesized | Updated spec docs and `resource-map.md`. |
| M2: Rename complete | Grep cleanup and plugin bridge tests. |
| M3: Devin hook live | `/hooks` listing and prompt smoke. |
| M4: Quality gates green | Typecheck, vitest, DQI, strict validate. |
| M5: Cross-packet ready | Shared `.devin/hooks.v1.json` contains advisor and code-graph hooks. |
<!-- /ANCHOR:milestones -->

---
## RELATED DOCUMENTS

- `spec.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `resource-map.md`
- `research/research.md`
