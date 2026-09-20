---
title: "Implementation Plan: cli-pi skill packet"
description: "Scaffold the cli-pi packet from sk-doc create-skill templates, wire the 3 hub registry surfaces, regenerate leaf-manifest.json, and validate against the hub's confirmed 0-fail baseline — planning only, gated on phases 001/002 landing first."
trigger_phrases:
  - "cli-pi skill plan"
  - "cli-pi mode wiring"
  - "6th mode implementation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/003-cli-pi-skill-packet"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "pi-cli-authoring"
    recent_action: "Plan executed via LUNA, reviewed by GLM-5.2, findings fixed"
    next_safe_action: "Commit; phase 004 builds on the registered mode"
    blockers: ["Compiled-routing readiness stays a known, out-of-scope pre-existing gap"]
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-packet-authoring", parent_session_id: null }
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: cli-pi skill packet

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode skill packet — Markdown (`SKILL.md`/`README.md`/`references`/`assets`) + JSON registries; no application code. |
| **Framework** | `sk-doc create-skill` packet-level templates (`skill-md-template.md`, `skill-readme-template.md`). |
| **Storage** | Filesystem only — no database. |
| **Testing** | Static validators: `parent-skill-check.cjs`, `validate_skill_package.py`. |

### Overview
Build `cli-pi` as the hub's 6th mode, following the `cli-devin` (`029-cli-devin-revival/003-cli-devin-skill-packet`) and `cli-cursor` (`030-cli-cursor-creation/003-cli-cursor-skill-packet`) precedents: scaffold packet files from the `create-skill` templates, wire the 3 hub registry surfaces (`mode-registry.json`, `hub-router.json`, hub-root `description.json`/`SKILL.md`/`graph-metadata.json`), regenerate `leaf-manifest.json`, and validate that the hub stays at its confirmed 0-fail/0-warning baseline. **This phase is planning only** — the tasks below describe future implementation work gated on phase 001 (live Pi CLI verification) and phase 002 (deep-loop executor support) landing first; no packet file or hub registry file is created or modified by this authoring pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 (`pi-contract-pin`) has live-verified the Pi CLI install, `.pi/` config-merge behavior, and headless dispatch syntax — required before *implementation* begins, not before this planning phase.
- [ ] Phase 002 (`deep-loop-executor-support`) spec exists and defines the runtime `ExecutorKind` this packet references.
- [ ] `cli-devin` and `cli-cursor` packets available as the literal structural precedents (`cli-external-orchestration/cli-devin/`, `cli-external-orchestration/cli-cursor/`).
- [ ] `parent-skill-check.cjs` baseline confirmed against the hub before any implementation-time edit — **re-confirmed live today, 2026-07-27, during this planning pass**:
  ```text
  $ node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration
  OK: parent-skill-check — all hard invariants passed, 0 warnings
  (5 modes declared; 25 aliases unique across modes)
  $ python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/cli-external-orchestration
  - package_skill.py --check: PASS (exit 0)
  - compiled routing readiness: compiled-ready: PASS (exit 0)
  - parent-skill-check.cjs: PASS (exit 0)
  ```

### Definition of Done
- [ ] Both `parent-skill-check.cjs` and `validate_skill_package.py` report 0 fails against the whole hub (6 modes).
- [ ] `leaf-manifest.json` regenerated and matches the new tree with no byte-drift.
- [ ] All tasks in `tasks.md` complete.
- [ ] No `cli-pi/graph-metadata.json` or `cli-pi/description.json` exists anywhere under the new packet.
- [ ] No pi.dev-documentation-sourced claim in the authored packet content is stated as already live-verified (per spec.md REQ-014/SC-005).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-driven mode packet — matches the hub's declarative "two-axis model": a `workflowMode`/`packetKind`/`backendKind` discriminator plus an `advisorRouting` projection, both owned by `mode-registry.json`.

### Key Components
- **`SKILL.md`**: Routing contract, `hard_rules` triad, self-invocation guard function, `command -v pi` probe.
- **`README.md`**: 9-section AT A GLANCE → RELATED DOCUMENTS overview.
- **`references/*.md`**: Behavior docs — CLI reference, integration patterns, agent delegation, Pi's native skills/extensions surface, and the third-party MCP/subagent packages.
- **`assets/*.md`**: Prompt-craft artifacts (thin-delegator quality card, prompt templates).
- **`mode-registry.json` entry**: Discriminator + `toolSurface` + aliases + `advisorRouting`.
- **`hub-router.json` entry**: `routerSignals` + `vocabularyClasses` + `tieBreak` membership.

### Data Flow
Advisor routes to the single hub identity (`cli-external-orchestration`) → `hub-router.json` scores signals and vocabulary classes → `mode-registry.json` resolves the `cli-pi` packet → `executor-delegation.ts` (unchanged, pending re-confirmation at implementation) reads `packetSkillName` + `aliases` at call time to resolve prompts like "delegate to pi" without any code edit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix — this is new-mode construction, planned for a future implementation pass. Populated for structural completeness and because the eventual change does touch shared hub-level policy (registry + router + hub-root docs).

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `mode-registry.json` | Discriminator source of truth (5 modes today) | Update (add `cli-pi` `modes[]` entry) | `parent-skill-check.cjs` checks 3b/3c/3d/3d-canon/3e |
| `hub-router.json` | Routing signals + tie-break (5-element today) | Update | Checks 5b/5e |
| `leaf-manifest.json` | Reachability/byte-drift ledger | Regenerate | Checks 10a-manifest-source through 10d-reachability |
| `description.json` (hub root) | Advisor-facing summary | Update (keywords/trigger_examples/prose only) | Check 8b (no `modes`/`backend_kinds` duplication) |
| `SKILL.md` (hub root) | Hub routing doc | Update (mode table + layout tree + mode-count prose) | Manual diff review at implementation time |
| `graph-metadata.json` (hub root) | Hub's single skill-graph identity | Update (derived arrays only) | Manual diff review; checks 2a/2b (must stay single identity) |
| `system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts` | Dynamic alias-table builder | No change expected | Re-verify at implementation time that it still reads `mode-registry.json` dynamically at call time — do not assume this from the spec alone (SC-003). |

Required inventories:
- Same-class producers: the 5 existing sibling mode entries — `rg -n '"workflowMode"' .opencode/skills/cli-external-orchestration/mode-registry.json .opencode/skills/cli-external-orchestration/hub-router.json`.
- Consumers of the registry: `executor-delegation.ts`'s `loadCliHubExecutors()`, the hub's own `SKILL.md` mode table, `leaf-manifest.json`.
- Matrix axes: none — single new packet, not a variant matrix.
- Algorithm invariant: n/a — no parser/redaction/resolver logic touched.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the 0-fail/0-warning baseline before any edit (re-confirm live at implementation time; already confirmed today, 2026-07-27, during this planning pass — see §2).
- [ ] Read the `create-skill` packet-level templates fresh.
- [ ] Create the `cli-pi/` directory structure.

### Phase 2: Core Implementation
- [ ] Author `SKILL.md`, `README.md`, all 5 `references/*.md`, both `assets/*.md`.
- [ ] Wire `mode-registry.json` and `hub-router.json`.
- [ ] Update the hub's own `description.json`, `SKILL.md`, `graph-metadata.json`.

### Phase 3: Verification
- [ ] Regenerate `leaf-manifest.json`.
- [ ] Confirm no `executor-delegation.ts` code change is needed (re-verify dynamic load, do not assume).
- [ ] Run both validators; confirm 0 fails at 6 modes.
- [ ] Confirm alias case-fold uniqueness across all 6 modes' alias arrays.
- [ ] Confirm `hub-router.json`'s `routerPolicy.tieBreak` is an exact 6-element permutation of all 6 registry `workflowMode` values.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Static validation | Whole hub tree | `parent-skill-check.cjs` |
| Package validation | `cli-pi` packet | `validate_skill_package.py` |
| Manual | `mode-registry.json` ↔ `hub-router.json` bidirectional consistency | Read + `rg` diff review |
| Regression | 5 existing sibling modes unaffected | Re-run both validators, confirm no new fails against `cli-opencode`/`cli-claude-code`/`cli-codex`/`cli-cursor`/`cli-devin`. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 001 (`pi-contract-pin`) | Internal | Planned (not started) | Packet can still be authored (registry read dynamically at call time), but no live-behavior claim can be confirmed and no real dispatch smoke-test is possible until phase 001 runs. |
| Phase 002 (`deep-loop-executor-support`) | Internal | Planned (not started) | Packet can still be authored, but end-to-end dispatch needs phase 002's `ExecutorKind` support. |
| `sk-doc/create-skill` templates | Internal | Green | Wrong packet shape if templates move/change before authoring. |
| `parent-skill-check.cjs` / `validate_skill_package.py` | Internal | Green (0/0 baseline re-confirmed live today, 2026-07-27, at 5 modes / 25 unique aliases) | Cannot claim completion without these staying green at 6 modes. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any validator regresses from 0 fails, or checks 2a/2b (second identity) trip, at implementation time.
- **Procedure**: Remove the `cli-pi/` directory; revert the 5 hub-root file edits (`mode-registry.json`, `hub-router.json`, `description.json`, `SKILL.md`, `graph-metadata.json`) via `git checkout` of those specific paths; regenerate `leaf-manifest.json` against the reverted tree; re-run both validators to confirm return to the pre-phase 0/0 5-mode baseline.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 min |
| Core Implementation | Medium | 2-4 hours (11 new files + 2 registry edits + 3 hub-doc edits) |
| Verification | Low | 15-30 min |
| **Total** | | **3-5 hours** (future implementation phase — this planning phase's own authoring is already complete once this document set is filled in) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline validator run captured before edits (0/0, 5 modes, 25 unique aliases — confirmed live today, 2026-07-27, during this planning pass).
- [ ] `git status` clean before implementation-time edits begin.

### Rollback Procedure
1. Remove the `cli-pi/` directory via `git`.
2. Revert the 5 hub-root file edits.
3. Regenerate `leaf-manifest.json`.
4. Re-run both validators; confirm 0/0 back at the 5-mode baseline.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — filesystem/config-only change, fully reversible via `git checkout`.
<!-- /ANCHOR:enhanced-rollback -->
