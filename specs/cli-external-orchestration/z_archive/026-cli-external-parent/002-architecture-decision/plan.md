---
title: "Implementation Plan: Phase 2: architecture-decision"
description: "Decision-gate process for freezing the cli-external parent-hub architecture before scaffold, move, and scorer-rewrite work. The plan records the five ADRs, provides concrete registry/router targets for phase 003, and states the hub-aware scorer contract for phase 005."
trigger_phrases:
  - "cli-external architecture plan"
  - "cli parent decision gate"
  - "mode-registry target"
  - "hub-router target"
  - "executor-delegation scorer contract"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted decision-gate plan, target shapes, and scorer contract"
    next_safe_action: "Operator reviews and approves or amends the decision gate before phase 003"
    blockers:
      - "Human approval required before phase 003 starts"
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Shared dispatch hook lift to hub root vs packet-local (ADR-002 sub-decision, phase 003/004)"
    answered_questions:
      - "Both modes workflow; default route and tie-break frozen; scorer sources from mode-registry"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: architecture-decision

<!-- SPECKIT_LEVEL: 3 -->
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
| **Language/Stack** | Markdown decision docs plus future JSON router artifacts and a TypeScript scorer rewrite specified for phase 005 |
| **Framework** | OpenCode parent-skill hub pattern |
| **Storage** | Skill-local files only; no database changes in this phase |
| **Testing** | Spec-kit validation after drafting; parent-skill-check and the scorer parity fixtures belong to the scaffold and fold-in phases |

### Overview
This phase implements a decision gate, not code. It converts the operator-approved merge decisions into a frozen target architecture for a workflow-only `cli-external` parent hub and gives phase 003 an unambiguous registry/router scaffold target and phase 005 an unambiguous scorer-rewrite contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Operator-approved locked decisions are represented without reopening them
- [ ] The family-cli-to-scorer consequence is stated and ADR-004/ADR-005 are paired as atomic
- [ ] The routing-class question is explicitly deferred to phase 007 evidence

### Definition of Done
- [ ] `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` contain no template placeholders
- [ ] Frozen target shape names every future registry/router field phase 003 needs
- [ ] The scorer contract names its source, resolution target, dist refresh, and fixture re-baseline
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow-only parent hub with two nested workflow packets and no named extensions. This mirrors the pure two-tier sk-doc/sk-prompt core shape: hub plus packets, one `modes[]` registry, one `hub-router.json`, one graph identity, and base router outcomes `single`, `orderedBundle`, and `defer` only.

### Key Components
- **Hub `.opencode/skills/cli-external/`**: Surviving advisor identity (`family: cli`), router-policy owner, graph-metadata owner, description owner, and parent of both workflow packets.
- **Packet `cli-opencode/`**: Full rename target for today's `.opencode/skills/cli-opencode/*`; owns the OpenCode dispatch orchestrator, the shared dispatch-preflight hook, and its manual-testing material.
- **Packet `cli-claude-code/`**: Full rename target for today's `.opencode/skills/cli-claude-code/*`; owns the Claude Code dispatch orchestrator.
- **Future `mode-registry.json`**: Declares exactly two `packetKind: "workflow"` modes: `cli-opencode` and `cli-claude-code`. This registry is also the new source of truth the rewritten scorer reads.
- **Future `hub-router.json`**: Routes by the base three outcomes only, defaults ambiguous dispatch to `cli-opencode`, no command surface.
- **Executor-delegation scorer (phase 005)**: Rewritten to source its alias table from the registry's `packetSkillName` values, resolving to the `EXECUTOR_KINDS` strings.

### Data Flow
Advisor routing selects the single `cli-external` hub identity. The hub reads `hub-router.json`, resolves a `workflowMode`, then loads the selected packet's `SKILL.md`. Separately, the rewritten scorer reads the hub `mode-registry.json` to build its executor alias table for delegation prompts, resolving each to the executor-kind string downstream config expects.

### Decision Record

| Decision | Status | Rationale | Downstream Effect |
|----------|--------|-----------|-------------------|
| Full rename by `git mv`: `cli-opencode/*` to `cli-external/cli-opencode/*` and `cli-claude-code/*` to `cli-external/cli-claude-code/*`. | Locked by operator | Preserves history and enforces `folder == packetSkillName == workflowMode` for both packets. | Scaffold packet folders exactly as `cli-opencode/` and `cli-claude-code/`; no compatibility folders. |
| No command for the hub or either mode. | Locked by operator | Neither skill has a command today; both are advisor-routed. | Registry entries carry `command: null`; hub stays outside checker 3k coverage. |
| Both modes are `packetKind: "workflow"`, not `transport`. | Locked by operator | Both orchestrate and their dispatched writes land in this repo, failing the transport contract. | No `transport-axis` extension; no `surfaceBundle` outcome. |
| Delete both children's `graph-metadata.json`; author one hub graph identity with `family: cli`. | Locked by operator | Parent hubs expose one identity; family inherits both children's tag. | Fold union of both children's edges/signals into the hub metadata. |
| Rewrite the scorer to source aliases from the hub `mode-registry.json`, resolving to `EXECUTOR_KINDS`. | Locked by operator | The `family: cli` hub would otherwise make the family filter match the hub and silently degrade routing (the `external` noun enters the orchestrator-noun table and the model-alias backstop drops via `activeExecutorIds`). | Phase 005 lands the rewrite atomically with the dissolution; phase 007 re-baselines the fixtures. |
| Set `routerPolicy.defaultMode` to `cli-opencode`. | Locked by operator | The full-runtime dispatch path is the more general default when intent is ambiguous. | Future `hub-router.json` must set `defaultMode: "cli-opencode"`. |
| Defer the final `routingClass` choice to phase 007. | Deferred by design | Whether `metadata` suffices is an empirical benchmark question. | Scaffold `routingClass: "metadata"` for both modes; phase 007 may amend on evidence. |

### Frozen Target Shape For Phase 003

Future `mode-registry.json` must use this shape as the architecture target:

```json
{
  "skill": "cli-external",
  "version": "1.0.0.0",
  "description": "Parent hub for external CLI dispatch: full-runtime OpenCode orchestration and Claude Code cross-AI handoff.",
  "discriminator": {
    "workflowMode": "Selects cli-opencode or cli-claude-code.",
    "packetKind": "workflow for both modes.",
    "backendKind": "Mode-specific dispatch backend."
  },
  "advisorRoutingContract": "One advisor identity: cli-external. Packets are advisor-invisible nested workflows. The rewritten executor-delegation scorer reads this registry to build its executor alias table.",
  "modes": [
    {
      "workflowMode": "cli-opencode",
      "packetKind": "workflow",
      "backendKind": "opencode-runtime-dispatch",
      "packet": "cli-opencode",
      "packetSkillName": "cli-opencode",
      "grandfatheredFolderMismatch": false,
      "command": null,
      "aliases": ["delegate to opencode", "opencode run", "parallel detached session", "cross-ai handback", "full runtime dispatch"],
      "toolSurface": {
        "mutatesWorkspace": true,
        "allowed": ["Bash", "Read", "Glob", "Grep"],
        "forbidden": ["Write", "Edit", "Task"],
        "bashAllowlist": []
      },
      "advisorRouting": {
        "routingClass": "metadata",
        "packetIdentity": "cli-opencode"
      }
    },
    {
      "workflowMode": "cli-claude-code",
      "packetKind": "workflow",
      "backendKind": "claude-code-dispatch",
      "packet": "cli-claude-code",
      "packetSkillName": "cli-claude-code",
      "grandfatheredFolderMismatch": false,
      "command": null,
      "aliases": ["delegate to claude", "claude code cli", "deep reasoning handoff", "structured output", "cross-ai review"],
      "toolSurface": {
        "mutatesWorkspace": true,
        "allowed": ["Bash", "Read", "Glob", "Grep"],
        "forbidden": ["Write", "Edit", "Task"],
        "bashAllowlist": []
      },
      "advisorRouting": {
        "routingClass": "metadata",
        "packetIdentity": "cli-claude-code"
      }
    }
  ],
  "extensions": {}
}
```

Future `hub-router.json` must use this shape as the architecture target:

```json
{
  "skill": "cli-external",
  "version": "1.0.0.0",
  "routerPolicy": {
    "defaultMode": "cli-opencode",
    "ambiguityDelta": 1,
    "tieBreak": ["cli-opencode", "cli-claude-code"],
    "outcomes": {
      "single": "one dominant dispatch intent routes to one mode",
      "orderedBundle": "multiple explicitly requested dispatch workflows route in tie-break order",
      "defer": "unclear or contradictory intent asks for disambiguation"
    },
    "defaultResource": ["cli-opencode/SKILL.md"]
  },
  "routerSignals": {
    "cli-opencode": {
      "weight": 4,
      "classes": ["opencode-aliases", "runtime-dispatch", "hub-identity"],
      "resources": ["cli-opencode/SKILL.md"]
    },
    "cli-claude-code": {
      "weight": 4,
      "classes": ["claude-code-aliases", "reasoning-handoff", "hub-identity"],
      "resources": ["cli-claude-code/SKILL.md"]
    }
  },
  "vocabularyClasses": {
    "opencode-aliases": {
      "keywords": ["opencode run", "delegate to opencode", "parallel detached session", "worker farm", "cross-ai handback"]
    },
    "runtime-dispatch": {
      "keywords": ["full plugin runtime", "spec kit runtime", "agent dispatch", "ablation suite"]
    },
    "claude-code-aliases": {
      "keywords": ["delegate to claude", "claude code cli", "anthropic cli", "structured claude output"]
    },
    "reasoning-handoff": {
      "keywords": ["deep reasoning", "extended thinking", "second opinion", "code edit handoff"]
    },
    "hub-identity": {
      "keywords": ["cli-external", "external cli dispatch", "cli orchestrator"]
    }
  }
}
```

### Scorer Rewrite Contract (phase 005 target)

The rewritten `executor-delegation.ts` must: (1) source its executor alias table from the hub `mode-registry.json` `packetSkillName` values instead of `projection.skills.filter(family === 'cli')`, and NOT derive an orchestrator noun from the hub id (so `external` never enters the alias table); (2) resolve each match to the `EXECUTOR_KINDS` strings `cli-opencode` / `cli-claude-code` that `executor-config.ts` expects; (3) rebuild the compiled `dist/` artifact in the same change; (4) re-baseline `tests/parity/fixtures/executor-delegation-cases.json` (the actual 11 cases: 6 `expectedTop: cli-opencode`, 2 `cli-claude-code`, 2 `sk-code`, 1 `none`), keeping the 2 `sk-code` + 1 `none` negatives green and asserting no scenario resolves to `cli-external`, and keep `tests/scorer/executor-delegation.vitest.ts` green; (5) land in the SAME commit as the ADR-004 identity dissolution.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/cli-opencode/` and `.opencode/skills/cli-claude-code/` | Current flat dispatch skills and future hub packets | Decision only in phase 002; physical rename/scaffold later | Phase 003 uses this plan as its registry/router target |
| `executor-delegation.ts` (+ dist) | Runtime executor alias-table builder using the family filter | Unchanged in phase 002; rewritten atomically in phase 005 | ADR-005 contract; phase 007 parity re-baseline |
| `.claude/settings.json` PreToolUse hook + `dispatch-preflight-lint.mjs` | Fail-open dispatch-rule linter on every Bash call | Unchanged in phase 002; repointed and made hub-aware with the move | Later implementation grep + active trigger test at phase 008 |
| `executor-delegation-cases.json` parity fixtures | 11 cases (6 `cli-opencode`, 2 `cli-claude-code`, 2 `sk-code`, 1 `none`) | Unchanged in phase 002; re-baselined in phase 005/007 | `executor-delegation.vitest.ts` green; negatives preserved |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the operator-approved locked decisions and treat them as frozen inputs.
- [ ] Confirm the phase is documentation-only and scoped to `002-architecture-decision/` files.
- [ ] Use parent-hub doctrine to constrain the target to a pure two-tier workflow-only hub.

### Phase 2: Core Implementation
- [ ] Record the five locked decisions as formal ADRs with rationale and downstream effects.
- [ ] State the family-cli-to-scorer consequence and pair ADR-004/ADR-005 as atomic.
- [ ] Record the scorer contract: source, resolution target, dist refresh, fixture re-baseline.
- [ ] Add concrete future `mode-registry.json` and `hub-router.json` target shapes.
- [ ] Record the shared-hook-lift question as an open ADR-002 sub-decision.

### Phase 3: Verification
- [ ] Check no bracketed scaffold placeholders remain in the phase files.
- [ ] Check anchors, frontmatter, `SPECKIT_LEVEL`, and `SPECKIT_TEMPLATE_SOURCE` markers remain intact.
- [ ] Hold phase 003 until the operator approves or amends this decision gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template integrity | `spec.md`, `plan.md`, `tasks.md`, `decision-record.md` anchors and frontmatter | Read/Grep checks plus spec-kit validation |
| Architecture consistency | Registry/router/scorer target matches parent-hub doctrine | Manual review against parent-hub references and later `parent-skill-check` after JSON exists |
| Human gate | Operator approval before phase 003 | Explicit approval in conversation or saved continuation note |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval | Human gate | Yellow | Phase 003 cannot start until the architecture decision is accepted or amended. |
| Parent-hub doctrine | Internal documentation | Green | Without it, the target shape could drift into unsupported axes or router outcomes. |
| Phase 007 benchmark evidence | Future empirical validation | Yellow | Final routing-class choice remains deferred; scaffold uses metadata routing until evidence says otherwise. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Operator rejects or amends the architecture gate, or phase 003 discovers that the frozen target conflicts with parent-hub enforcement.
- **Procedure**: Patch only the phase 002 decision docs to reflect the approved amendment, then re-run documentation validation before allowing scaffold work to proceed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│  001-research-   │────►│ 002-architecture-     │────►│ 003-scaffold-hub │
│  and-context     │     │ decision (this phase) │     │  (additive-only) │
└─────────────────┘     └──────────┬───────────┘     └────────┬─────────┘
                                    │                          │
                                    │ freezes registry/router/ │ scaffolds against
                                    │ scorer target shapes      │ the frozen target
                                    ▼                          ▼
                          decision-record.md          004-onboard-cli-opencode
                          (5 ADRs, operator-gated)     005-foldin-cli-claude-code
                                                       (atomic scorer + dissolution)
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Operator reviews and approves `decision-record.md`** - blocking, no fixed duration - CRITICAL
2. **Phase 003 scaffolds the hub against the frozen target** - depends directly on step 1 - CRITICAL
3. **Phases 004/005 relocate content and land the atomic scorer/dissolution change** - depends on phase 003 - CRITICAL

**Total Critical Path**: Operator approval is the sole blocking dependency; every subsequent phase depends transitively on this gate closing, and the phase-005 scorer/dissolution change is the single riskiest step it authorizes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Decision record drafted | Five ADRs authored with alternatives and rollback paths | This phase, drafting sub-step |
| M2 | Gate approved | Operator accepts or amends all five ADRs | This phase, closing sub-step |
| M3 | Scaffold unblocked | Phase 003 has zero remaining architecture ambiguity | Phase 003 start |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the five locked decisions from the shared dispatch context are represented without reopening them.
- [ ] Confirm no live `.opencode/skills/cli-opencode/`, `.opencode/skills/cli-claude-code/`, advisor, hook, or CI file is touched in this phase.
- [ ] Confirm `decision-record.md` exists with Status: Accepted on all five ADRs before claiming the gate ready for review.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Draft `decision-record.md` before finalizing `spec.md`'s Executive Summary, since the summary depends on the ADRs' final wording. |
| TASK-SCOPE | Edits stay inside `002-architecture-decision/`; no git commands, no edits to the live skills, advisor code, hook, or CI. |

### Status Reporting Format
Report phase status as: `Phase 002 — <Draft|Review Gate|Approved> — N/5 ADRs accepted — blocking on: <operator approval | none>`.

### Blocked Task Protocol
If the operator does not approve within this phase's review window, the phase status stays `Review Gate` and phase 003 does not start. Amendments land as edits to the existing ADR (same number), never as a competing decision document.
<!-- /ANCHOR:ai-execution-protocol -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
