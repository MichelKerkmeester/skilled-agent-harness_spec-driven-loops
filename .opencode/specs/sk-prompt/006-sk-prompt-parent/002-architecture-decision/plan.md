---
title: "Implementation Plan: Phase 2: architecture-decision"
description: "Decision-gate process for freezing the sk-prompt parent-hub architecture before scaffold work. The plan records the approved decisions, resolves the two non-empirical open questions, and provides a concrete registry/router target for phase 003."
trigger_phrases:
  - "sk-prompt architecture plan"
  - "prompt parent decision gate"
  - "mode-registry target"
  - "hub-router target"
  - "phase 002 decision plan"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T17:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted decision-gate plan and registry/router target shape"
    next_safe_action: "Operator reviews and approves or amends the decision gate before phase 003"
    blockers:
      - "Human approval required before phase 003 starts"
    key_files:
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/spec.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/plan.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 30
    open_questions:
      - "Phase 007 must empirically decide whether prompt-models needs lexical routing beyond metadata membership"
    answered_questions:
      - "Existing prompt-improve manual-testing material remains packet-local"
      - "prompt-models visible metadata normalizes to 0.9.0.0 and the parent hub fold-in targets 1.0.0.0"
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
| **Language/Stack** | Markdown decision docs plus future JSON router artifacts |
| **Framework** | OpenCode parent-skill hub pattern |
| **Storage** | Skill-local files only; no database changes in this phase |
| **Testing** | Spec-kit validation after drafting; parent-skill-check belongs to scaffold and verification phases after JSON files exist |

### Overview
This phase implements a decision gate, not code. It converts the operator-approved merge decisions into a frozen target architecture for a workflow-only `sk-prompt` parent hub and gives phase 003 an unambiguous registry/router scaffold target.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Operator-approved locked decisions are represented without reopening them — Evidence: `decision-record.md` ADR-001..003 verbatim match the operator's AskUserQuestion answers.
- [x] Two non-empirical open questions are resolved with documented rationale — Evidence: `decision-record.md` ADR-004.
- [x] The prompt-models routing-class question is explicitly deferred to phase 007 evidence — Evidence: `spec.md` §12 OPEN QUESTIONS.

### Definition of Done
- [x] `spec.md`, `plan.md`, and `tasks.md` contain no template placeholders — Evidence: `validate.sh 002-architecture-decision --strict` passed 0/0.
- [x] Frozen target shape names every future registry/router field phase 003 needs — Evidence: `decision-record.md` ADR-001 Implementation section.
- [x] Operator approval is recorded before phase 003 begins — Evidence: decisions locked via explicit AskUserQuestion answers in the planning turn, re-verified with zero drift in phase 001, confirmed here.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow-only parent hub with two nested workflow packets and no named extensions. This mirrors the pure two-tier `sk-doc` core shape: hub plus packets, one `modes[]` registry, one `hub-router.json`, one graph identity, and base router outcomes `single`, `orderedBundle`, and `defer` only.

### Key Components
- **Hub `.opencode/skills/sk-prompt/`**: Surviving advisor identity, router policy owner, graph metadata owner, description owner, and parent of both workflow packets.
- **Packet `prompt-improve/`**: Full rename target for today's `.opencode/skills/sk-prompt/*`; owns the active prompt-improvement engine, command-backed workflow, and existing prompt-improve manual-testing material.
- **Packet `prompt-models/`**: Full rename target for today's `.opencode/skills/sk-prompt-models/*`; owns read-only small-model prompt-craft profiles, `assets/model_profiles.json`, and the live `benchmarks/` tree used by `/deep:model-benchmark`.
- **Future `mode-registry.json`**: Declares exactly two `packetKind: "workflow"` modes: `prompt-improve` and `prompt-models`.
- **Future `hub-router.json`**: Routes by the base three outcomes only, defaults unclear prompt work to `prompt-improve`, and keeps the phase 007 routing-class benchmark as the only deferred architecture question.

### Data Flow
Advisor routing selects the single `sk-prompt` hub identity. The hub reads `hub-router.json`, resolves a `workflowMode`, then loads the selected packet's `SKILL.md`; `/prompt-improve` invokes only the `prompt-improve` workflow, while `prompt-models` remains advisor-routed or cross-skill referenced by `cli-opencode` pre-dispatch and has no slash command.

### Decision Record

| Decision | Status | Rationale | Phase 003 Effect |
|----------|--------|-----------|------------------|
| Full rename by `git mv`: current `sk-prompt/*` to `sk-prompt/prompt-improve/*` and current `sk-prompt-models/*` to `sk-prompt/prompt-models/*`. | Locked by operator | Preserves history and enforces `folder == packetSkillName == workflowMode` for both packets. | Scaffold packet folders exactly as `prompt-improve/` and `prompt-models/`; do not create compatibility packet folders. |
| Rename `/prompt` command to `/prompt-improve`; give `prompt-models` no command. | Locked by operator | `prompt-models` remains a lookup profile consumed by advisor/cross-skill references, not an interactive command workflow. | Registry entry for `prompt-improve` includes `command: "/prompt-improve"`; registry entry for `prompt-models` includes `command: null`. |
| Both modes are `packetKind: "workflow"`, not `surface`. | Locked by operator | `prompt-models` changes the pre-dispatch craft process for small-model prompts and its real consumer lives outside the hub, so it fails the surface-packet contract. | No `surface-axis` extension, no `surfaceBundle` outcome, and no surface packet constraints except the read-only tool surface retained on `prompt-models`. |
| Delete folded `sk-prompt-models/graph-metadata.json` and preserve its `enhances -> cli-opencode (0.8)` edge in the surviving hub graph metadata. | Locked by operator | Parent hubs expose one advisor identity and packet graph identities must dissolve without losing useful graph relationships. | Phase 003/implementation must merge domain, intent signal, and enhancement content into hub `graph-metadata.json`. |
| Set `routerPolicy.defaultMode` to `prompt-improve`. | Locked by operator | Generic prompt-improvement requests should keep today's active behavior unless a request specifically selects model-profile craft. | Future `hub-router.json` must set `defaultMode: "prompt-improve"`. |
| Keep prompt-improve's existing `manual_testing_playbook/` packet-local. | Resolved in phase 002 | The playbook belongs to the prompt-improvement workflow that is moving under `prompt-improve/`; hub-level manual testing should cover only router smoke and cross-mode expectations if added later. | Full rename keeps that directory under `prompt-improve/`; do not fold it into the hub root during scaffold. |
| Normalize prompt-models version metadata to `0.9.0.0` and release the parent hub fold-in as `1.0.0.0`. | Resolved in phase 002 | `0.9.0.0` matches the latest prompt-models changelog and resolves its internal `0.8.0.0` versus `0.2.1` drift; the parent hub layout and command rename are breaking enough to warrant a new major hub release. | Phase 003 should target hub registry version `1.0.0.0`; the moved prompt-models packet should no longer expose stale `0.8.0.0` or `0.2.1` metadata. |
| Defer final `routingClass` choice for `prompt-models` to phase 007. | Deferred by design | Whether `metadata` is sufficient or lexical routing is needed is an empirical benchmark question, not a phase 002 architecture assertion. | Scaffold `routingClass: "metadata"` for both modes as the canonical parent-hub baseline; phase 007 may amend `prompt-models` only if benchmark evidence justifies it. |

### Frozen Target Shape For Phase 003

Future `mode-registry.json` must use this shape as the architecture target:

```json
{
  "skill": "sk-prompt",
  "version": "1.0.0.0",
  "description": "Parent hub for prompt improvement and small-model prompt-craft profiles.",
  "discriminator": {
    "workflowMode": "Selects prompt-improve or prompt-models.",
    "packetKind": "workflow for both modes.",
    "backendKind": "Mode-specific workflow backend."
  },
  "advisorRoutingContract": "One advisor identity: sk-prompt. Packets are advisor-invisible nested workflows.",
  "modes": [
    {
      "workflowMode": "prompt-improve",
      "packetKind": "workflow",
      "backendKind": "prompt-improvement-engine",
      "packet": "prompt-improve",
      "packetSkillName": "prompt-improve",
      "grandfatheredFolderMismatch": false,
      "command": "/prompt-improve",
      "aliases": ["prompt improve", "improve prompt", "prompt engineering", "clear scoring", "depth thinking"],
      "toolSurface": {
        "mutatesWorkspace": false,
        "allowed": ["Read", "Grep", "Glob"],
        "forbidden": ["Write", "Edit", "Task"],
        "bashAllowlist": []
      },
      "advisorRouting": {
        "routingClass": "metadata",
        "packetIdentity": "prompt-improve"
      }
    },
    {
      "workflowMode": "prompt-models",
      "packetKind": "workflow",
      "backendKind": "small-model-profile-lookup",
      "packet": "prompt-models",
      "packetSkillName": "prompt-models",
      "grandfatheredFolderMismatch": false,
      "command": null,
      "aliases": ["small model prompt", "model profiles", "deepseek prompt", "kimi prompt", "minimax prompt", "mimo prompt", "glm prompt"],
      "toolSurface": {
        "mutatesWorkspace": false,
        "allowed": ["Read", "Grep", "Glob"],
        "forbidden": ["Write", "Edit", "Task"],
        "bashAllowlist": []
      },
      "advisorRouting": {
        "routingClass": "metadata",
        "packetIdentity": "prompt-models",
        "routingClassNote": "Empirical lexical carve-out question deferred to phase 007."
      }
    }
  ],
  "extensions": {}
}
```

Future `hub-router.json` must use this shape as the architecture target:

```json
{
  "skill": "sk-prompt",
  "version": "1.0.0.0",
  "routerPolicy": {
    "defaultMode": "prompt-improve",
    "ambiguityDelta": 1,
    "tieBreak": ["prompt-improve", "prompt-models"],
    "outcomes": {
      "single": "one dominant prompt workflow routes to one mode",
      "orderedBundle": "multiple explicitly requested prompt workflows route in tie-break order",
      "defer": "unclear or contradictory intent asks for disambiguation"
    },
    "defaultResource": ["prompt-improve/SKILL.md"]
  },
  "routerSignals": {
    "prompt-improve": {
      "weight": 4,
      "classes": ["prompt-improve-aliases", "prompt-methods", "hub-identity"],
      "resources": ["prompt-improve/SKILL.md"]
    },
    "prompt-models": {
      "weight": 3,
      "classes": ["prompt-models-aliases", "small-model-families", "hub-identity"],
      "resources": ["prompt-models/SKILL.md", "prompt-models/assets/model_profiles.json"]
    }
  },
  "vocabularyClasses": {
    "prompt-improve-aliases": {
      "keywords": ["prompt improve", "improve prompt", "prompt engineering", "clear scoring", "depth thinking"]
    },
    "prompt-methods": {
      "keywords": ["framework", "score my prompt", "rewrite prompt", "prompt critique"]
    },
    "prompt-models-aliases": {
      "keywords": ["small model prompt", "model profiles", "model prompt craft"]
    },
    "small-model-families": {
      "keywords": ["deepseek", "kimi", "minimax", "mimo", "glm"]
    },
    "hub-identity": {
      "keywords": ["sk-prompt", "prompt hub"]
    }
  }
}
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-prompt/` | Current active prompt-improvement skill and future parent hub | Decision only in phase 002; physical rename/scaffold later | Phase 003 uses this plan as its registry/router target |
| `.opencode/skills/sk-prompt-models/` | Current small-model profile skill and live benchmark target | Decision only in phase 002; physical fold-in later | Phase 003/implementation must preserve benchmark path ownership and graph edge content |
| `/deep:model-benchmark` assets | Hardcoded writer to prompt-models benchmarks | Unchanged in phase 002; must be repointed atomically with move | Later implementation grep must cover command markdown and both YAML assets |
| Skill advisor path joins | Runtime consumers of `assets/model_profiles.json` | Unchanged in phase 002; must update with move | Later implementation grep must cover executor-delegation TypeScript and Python advisor script |

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
- [ ] Record the five locked decisions as formal architecture decisions with rationale and phase 003 effects.
- [ ] Resolve prompt-improve manual-testing-playbook ownership as packet-local.
- [ ] Resolve prompt-models version reconciliation as `0.9.0.0` for packet metadata and `1.0.0.0` for the parent hub fold-in release.
- [ ] Record prompt-models routing-class as deferred to phase 007 benchmark evidence.
- [ ] Add concrete future `mode-registry.json` and `hub-router.json` target shapes.

### Phase 3: Verification
- [ ] Check no bracketed scaffold placeholders remain in the three phase files.
- [ ] Check anchors, frontmatter, `SPECKIT_LEVEL`, and `SPECKIT_TEMPLATE_SOURCE` markers remain intact.
- [ ] Hold phase 003 until the operator approves or amends this decision gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template integrity | `spec.md`, `plan.md`, `tasks.md` anchors and frontmatter | Read/Grep checks plus spec-kit validation when allowed |
| Architecture consistency | Registry/router target matches parent-hub doctrine | Manual review against parent-hub references and later `parent-skill-check` after JSON exists |
| Human gate | Operator approval before phase 003 | Explicit approval in conversation or saved continuation note |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval | Human gate | Yellow | Phase 003 cannot start until the architecture decision is accepted or amended. |
| Parent-hub doctrine | Internal documentation | Green | Without it, the target shape could drift into unsupported axes or router outcomes. |
| Phase 007 benchmark evidence | Future empirical validation | Yellow | Final prompt-models routing-class choice remains deferred; scaffold uses metadata routing until evidence says otherwise. |
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
                                    │ freezes registry/router  │ scaffolds against
                                    │ target shape              │ the frozen target
                                    ▼                          ▼
                          decision-record.md          004-onboard-prompt-improve
                          (4 ADRs, operator-gated)     005-foldin-prompt-models
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Operator reviews and approves `decision-record.md`** - blocking, no fixed duration - CRITICAL
2. **Phase 003 scaffolds the hub against the frozen target** - depends directly on step 1 - CRITICAL
3. **Phases 004/005 relocate content into the scaffolded packets** - depends on phase 003 - CRITICAL

**Total Critical Path**: Operator approval is the sole blocking dependency; every subsequent phase in the 8-phase program depends transitively on this gate closing.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Decision record drafted | Four ADRs authored with alternatives and rollback paths | This phase, drafting sub-step |
| M2 | Gate approved | Operator accepts or amends all four ADRs | This phase, closing sub-step |
| M3 | Scaffold unblocked | Phase 003 has zero remaining architecture ambiguity | Phase 003 start |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the four locked decisions from the shared dispatch context are represented without reopening them.
- [ ] Confirm no live `.opencode/skills/sk-prompt/` or `.opencode/skills/sk-prompt-models/` file is touched in this phase.
- [ ] Confirm `decision-record.md` exists with Status: Accepted on all ADRs before claiming the gate ready for review.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Draft `decision-record.md` before finalizing `spec.md`'s Executive Summary, since the summary depends on the ADRs' final wording. |
| TASK-SCOPE | Edits stay inside `002-architecture-decision/`; no git commands, no edits to `sk-prompt/` or `sk-prompt-models/`. |

### Status Reporting Format
Report phase status as: `Phase 002 — <Draft|Review Gate|Approved> — N/4 ADRs accepted — blocking on: <operator approval | none>`.

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
