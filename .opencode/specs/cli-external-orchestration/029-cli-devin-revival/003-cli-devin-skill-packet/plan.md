---
title: "Implementation Plan: cli-devin skill packet"
description: "Scaffold the cli-devin packet from sk-doc create-skill templates, wire the 3 hub registry surfaces, regenerate leaf-manifest.json, and validate against the hub's 0-fail baseline."
trigger_phrases: ["cli-devin skill plan", "cli-devin mode wiring", "4th mode implementation plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/003-cli-devin-skill-packet"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md for the planned cli-devin skill-packet phase"
    next_safe_action: "Author tasks.md, checklist.md, and decision-record.md for this phase"
    blockers: ["Phase 002 (deep-loop-executor-support) must land and pass validate.sh --strict before this phase's implementation starts, per the parent packet's Phase Transition Rules"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: cli-devin skill packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | OpenCode skill packet — Markdown (SKILL.md/README.md/references/assets) + JSON registries; no application code. |
| **Framework** | `sk-doc create-skill` packet-level templates (`skill-md-template.md`, `skill-readme-template.md`). |
| **Storage** | Filesystem only — no database. |
| **Testing** | Static validators: `parent-skill-check.cjs`, `validate_skill_package.py`. |

### Overview
Build `cli-devin` as a new 4th mode following the `cli-codex` precedent (`027-cli-codex-revival/003-cli-codex-skill-packet`): scaffold packet files from the `create-skill` templates, wire the 3 hub registry surfaces (`mode-registry.json`, `hub-router.json`, hub-root `description.json`/`SKILL.md`/`graph-metadata.json`), regenerate `leaf-manifest.json`, and validate that the hub stays at its confirmed 0-fail/0-warning baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 (deep-loop-executor-support) spec exists and defines the runtime executor contract this packet references.
- [ ] `cli-codex` packet available as the literal structural precedent (`cli-external-orchestration/cli-codex/`).
- [ ] `parent-skill-check.cjs` baseline confirmed 0 fails / 0 warnings against the hub before any edit.

### Definition of Done
- [ ] Both `parent-skill-check.cjs` and `validate_skill_package.py` report 0 fails against the whole hub.
- [ ] `leaf-manifest.json` regenerated and matches the new tree with no byte-drift.
- [ ] All 14 grounded-fact steps complete.
- [ ] No `cli-devin/graph-metadata.json` or `cli-devin/description.json` exists anywhere under the new packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-driven mode packet — matches the hub's declarative "two-axis model": a `workflowMode`/`packetKind`/`backendKind` discriminator plus an `advisorRouting` projection, both owned by `mode-registry.json`.

### Key Components
- **`SKILL.md`**: Routing contract, `hard_rules` triad, self-invocation guard function, `command -v devin` probe.
- **`README.md`**: 9-section AT A GLANCE → RELATED DOCUMENTS overview.
- **`references/*.md`**: Behavior docs (CLI reference, integration patterns, agent delegation, Devin-unique tool surface, cloud handoff).
- **`assets/*.md`**: Prompt-craft artifacts (thin-delegator quality card, prompt templates).
- **`mode-registry.json` entry**: Discriminator + `toolSurface` + aliases + `advisorRouting`.
- **`hub-router.json` entry**: `routerSignals` + `vocabularyClasses` + `tieBreak` membership.

### Data Flow
Advisor routes to the single hub identity (`cli-external-orchestration`) → `hub-router.json` scores signals and vocabulary classes → `mode-registry.json` resolves the `cli-devin` packet → `executor-delegation.ts` (unchanged) reads `packetSkillName` + `aliases` at call time to resolve prompts like "delegate to devin" without any code edit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix — this is new-mode construction. Populated for structural completeness and because the change does touch shared hub-level policy (registry + router + hub-root docs).

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `mode-registry.json` | Discriminator source of truth | Update (add `cli-devin` `modes[]` entry) | `parent-skill-check.cjs` checks 3c/3d/3d-canon/3e |
| `hub-router.json` | Routing signals + tie-break | Update | Checks 5b/5e |
| `leaf-manifest.json` | Reachability/byte-drift ledger | Regenerate | Checks 10a-10d |
| `description.json` (hub root) | Advisor-facing summary | Update (keywords/trigger_examples/prose only) | Check 8b (no `modes`/`backend_kinds` duplication) |
| `SKILL.md` (hub root) | Hub routing doc | Update (mode table + layout tree) | Manual diff review |
| `graph-metadata.json` (hub root) | Hub's single skill-graph identity | Update (derived arrays only) | Manual diff review; checks 2a/2b (must stay single identity) |
| `system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts` | Dynamic alias-table builder | No change needed | Code research confirmed dynamic load of `mode-registry.json` at call time. |

Required inventories:
- Same-class producers: the 3 existing sibling mode entries — `rg -n '"workflowMode"' .opencode/skills/cli-external-orchestration/mode-registry.json .opencode/skills/cli-external-orchestration/hub-router.json`.
- Consumers of the registry: `executor-delegation.ts`'s `loadCliHubExecutors()`, the hub's own `SKILL.md` mode table, `leaf-manifest.json`.
- Matrix axes: none — single new packet, not a variant matrix.
- Algorithm invariant: n/a — no parser/redaction/resolver logic touched.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the 0-fail/0-warning baseline before any edit.
- [ ] Read the `create-skill` packet-level templates fresh.
- [ ] Create the `cli-devin/` directory structure.

### Phase 2: Core Implementation
- [ ] Author `SKILL.md`, `README.md`, all 5 `references/*.md`, both `assets/*.md`.
- [ ] Wire `mode-registry.json` and `hub-router.json`.
- [ ] Update the hub's own `description.json`, `SKILL.md`, `graph-metadata.json`.

### Phase 3: Verification
- [ ] Regenerate `leaf-manifest.json`.
- [ ] Confirm no `executor-delegation.ts` code change is needed.
- [ ] Run both validators; confirm 0 fails.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Static validation | Whole hub tree | `parent-skill-check.cjs` |
| Package validation | `cli-devin` packet | `validate_skill_package.py` |
| Manual | `mode-registry.json` ↔ `hub-router.json` bidirectional consistency | Read + `rg` diff review |
| Regression | 3 existing sibling modes unaffected | Re-run both validators, confirm no new fails against `cli-opencode`/`cli-claude-code`/`cli-codex`. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 001 (devin-contract-pin) | Internal | Complete | None — already landed with live-verification evidence. |
| Phase 002 (deep-loop-executor-support) | Internal | Planned | Packet can still be authored (registry read dynamically), but end-to-end dispatch smoke-testing needs phase 002's `ExecutorKind` support. |
| `sk-doc/create-skill` templates | Internal | Green | Wrong packet shape if templates move/change before authoring. |
| `parent-skill-check.cjs` / `validate_skill_package.py` | Internal | Green (0/0 baseline confirmed) | Cannot claim completion without these. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any validator regresses from 0 fails, or checks 2a/2b (second identity) trip.
- **Procedure**: Remove the `cli-devin/` directory; revert the 5 hub-root file edits (`mode-registry.json`, `hub-router.json`, `description.json`, `SKILL.md`, `graph-metadata.json`) via `git checkout` of those specific paths; regenerate `leaf-manifest.json` against the reverted tree; re-run both validators to confirm return to the pre-phase 0/0 baseline.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup | Low | 15-30 min |
| Core Implementation | Medium | 2-4 hours (11 new files + 2 registry edits + 3 hub-doc edits) |
| Verification | Low | 15-30 min |
| **Total** | | **3-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline validator run captured before edits (0/0 confirmed today).
- [ ] `git status` clean before starting.

### Rollback Procedure
1. Remove the `cli-devin/` directory via `git`.
2. Revert the 5 hub-root file edits.
3. Regenerate `leaf-manifest.json`.
4. Re-run both validators; confirm 0/0.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — filesystem/config-only change, fully reversible via `git checkout`.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────┐     ┌────────────────────────┐     ┌────────────┐
│  Phase 1  │────►│  Phase 2 (Core)        │────►│  Phase 3   │
│  Setup    │     │  author + wire         │     │  Verify    │
└───────────┘     └──────────┬─────────────┘     └────────────┘
                              │
                        ┌─────▼─────┐
                        │  Phase 2b │
                        │  hub-root │
                        │ doc edits │
                        └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|---|---|---|---|
| Packet scaffold (`SKILL.md`/`README.md`/`references/`/`assets/`) | Setup | `cli-devin/**` | Registry wiring |
| `mode-registry.json` entry | Packet scaffold (`packetSkillName` must exist) | Discriminator row | `hub-router.json` `tieBreak`, `leaf-manifest.json` |
| `hub-router.json` entry | `mode-registry.json` entry | Router signals | `leaf-manifest.json`, validation |
| Hub-root doc edits (`description.json`/`SKILL.md`/`graph-metadata.json`) | Packet scaffold | Updated hub docs | Validation |
| `leaf-manifest.json` regen | All of the above | Reachability ledger | Validation |
| Validation (both validators) | `leaf-manifest.json` regen | Pass/fail signal | Phase closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Packet scaffold** (`SKILL.md`/`README.md`/`references/`/`assets/`) - ~2h - CRITICAL
2. **`mode-registry.json` + `hub-router.json` wiring** - ~45min - CRITICAL
3. **`leaf-manifest.json` regeneration + both validators** - ~20min - CRITICAL

**Total Critical Path**: ~3h

**Parallel Opportunities**:
- `references/*.md` and `assets/*.md` authoring can proceed in parallel with hub-root doc edits (`description.json`/`SKILL.md`/`graph-metadata.json`) — neither depends on the other's completion.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|---|---|---|---|
| M1 | Packet scaffold exists | `SKILL.md`/`README.md`/`changelog/` present, frontmatter correct | End of Phase 2a |
| M2 | Hub fully wired | `mode-registry.json` + `hub-router.json` + `description.json` + `SKILL.md` + `graph-metadata.json` all updated | End of Phase 2b |
| M3 | Validation green | Both validators 0 fails, `leaf-manifest.json` regenerated | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Three ADRs govern this phase's architectural choices: packet-kind classification (ADR-001), self-invocation guard signal design (ADR-002), and the `prompt-quality-card.md` shape (ADR-003). See `decision-record.md` for full context, alternatives, consequences, and rollback notes.

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirmed phase 002 has landed (`cli-devin` compiles as a deep-loop executor kind)
- [ ] Confirmed all 3 ADRs in `decision-record.md` are Accepted before authoring packet content
- [ ] Confirmed baseline `parent-skill-check.cjs` + `validate_skill_package.py` run against the hub (0 fails today)

### Execution Rules
| Rule | Requirement |
|---|---|
| TASK-SEQ | Follow `tasks.md` Setup -> Implementation -> Verification order; do not wire `mode-registry.json`/`hub-router.json` before the packet directory and its required files exist |
| TASK-SCOPE | Touch only `cli-external-orchestration/cli-devin/**` and the named hub-root registry files (`mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `SKILL.md`, `description.json`, `graph-metadata.json`) - never create `cli-devin/graph-metadata.json` or `cli-devin/description.json` |

### Status Reporting Format
Report each completed task as `T### done: <one-line evidence>`; report blocked tasks as `T### blocked: <reason>`.

### Blocked Task Protocol
If `parent-skill-check.cjs` or `validate_skill_package.py` regresses below the 0-fail baseline after a change, revert that change, record the exact failing check id in `implementation-summary.md`, and do not proceed to the next task until it is re-green.
<!-- /ANCHOR:ai-execution -->
