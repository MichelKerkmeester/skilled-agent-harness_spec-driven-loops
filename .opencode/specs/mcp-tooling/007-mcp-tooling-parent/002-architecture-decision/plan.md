---
title: "Implementation Plan: Phase 2: architecture-decision"
description: "Decision-gate process for freezing the mcp-tooling parent-hub architecture before scaffold work. The plan records the locked decisions as six ADRs and provides a concrete mode-registry.json (with a transport-axis extension) and hub-router.json target for phase 003."
trigger_phrases:
  - "mcp-tooling architecture plan"
  - "mcp bridge decision gate"
  - "mode-registry transport-axis target"
  - "hub-router target mcp-tooling"
  - "phase 002 decision plan"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T22:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted decision-gate plan and registry/router target shape"
    next_safe_action: "Operator reviews the decision gate before phase 003"
    blockers:
      - "Human approval required before phase 003 starts"
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Phase 007 must empirically decide whether the figma transport needs lexical routing beyond metadata membership"
    answered_questions:
      - "Registry target uses a transport-axis extension listing mcp-figma"
      - "Default mode is mcp-chrome-devtools; ambiguous queries defer"
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
| **Framework** | OpenCode parent-skill hub pattern (mixed workflow-plus-transport, like sk-design) |
| **Storage** | Skill-local files only; no database changes in this phase |
| **Testing** | Spec-kit validation after drafting; parent-skill-check belongs to scaffold and verification phases after JSON files exist |

### Overview
This phase implements a decision gate, not code. It converts the operator-locked decisions into a frozen target architecture for a two-workflow-plus-one-transport `mcp-tooling` parent hub and gives phase 003 an unambiguous registry/router scaffold target, including the transport-axis extension for `mcp-figma`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Operator-locked decisions are represented without reopening them
- [ ] The five settled decisions plus versioning are captured as ADRs
- [ ] The figma-transport routing carve-out is explicitly deferred to phase 007

### Definition of Done
- [ ] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` contain no template placeholders
- [ ] Frozen target shape names every future registry/router field phase 003 needs, including the transport-axis extension
- [ ] Operator approval is recorded before phase 003 begins
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mixed workflow-plus-transport parent hub with three nested packets and one transport-axis extension. This mirrors `sk-design`'s live shape: hub plus packets, one `modes[]` registry, one `hub-router.json`, one graph identity, base router outcomes `single`/`orderedBundle`/`defer`, and a `transport-axis` extension declaring the transport member.

### Key Components
- **Hub `.opencode/skills/mcp-tooling/`**: Surviving advisor identity, router policy owner, graph metadata owner, and parent of the three packets.
- **Packet `mcp-chrome-devtools/`**: `packetKind:"workflow"`, keeps Write/Edit (writes screenshots/HAR locally), version `1.0.8.0`.
- **Packet `mcp-click-up/`**: `packetKind:"workflow"`, keeps Write/Edit and orchestration judgment, version `1.0.0.0`.
- **Packet `mcp-figma/`**: `packetKind:"transport"`, no Write/Edit (writes land in Figma Desktop, `mutatesWorkspace:false`), mandatory cross-hub pairing to `sk-design`, version `1.0.0.0`.
- **Future `mode-registry.json`**: Three `modes[]` entries plus an `extensions.transport-axis` block listing `mcp-figma`.
- **Future `hub-router.json`**: Base three outcomes; `defaultMode:"mcp-chrome-devtools"`; tie-break orders workflows before the transport.

### Data Flow
Advisor routing selects the single `mcp-tooling` hub identity. The hub reads `hub-router.json`, resolves a `workflowMode` from disambiguating signals, then loads the selected packet's `SKILL.md`. Genuinely ambiguous non-matching queries take the `defer` outcome rather than silently defaulting.

### Decision Record

| Decision | Status | Rationale | Phase 003 Effect |
|----------|--------|-----------|------------------|
| Two workflow bridges (chrome-devtools, click-up), one figma transport, one transport-axis extension. | Locked (ADR-001) | `allowed-tools` evidence: chrome-devtools/click-up mutate the workspace; figma writes only to Figma Desktop. | Scaffold three modes with the correct `packetKind` and the transport-axis extension. |
| figma transport pairs cross-hub to `sk-design`. | Locked (ADR-002) | figma's mandatory judgment partner lives in a different hub; CLAUDE.md already frames it as the external sibling transport. | Registry extension records the mandatory cross-hub pairing note. |
| Full `git mv` rename keeping the `mcp-` prefix. | Locked (ADR-003) | `folder == packetSkillName == workflowMode`; avoids the `figma` manual name collision. | Scaffold packet folders exactly as `mcp-chrome-devtools/`, `mcp-click-up/`, `mcp-figma/`. |
| One hub graph identity; code-mode edges as external cross-skill deps. | Locked (ADR-004) | Single advisor identity; preserve outward `sk-design`/`sk-code` edges; code-mode is external. | Phase 006 authors the hub `graph-metadata.json` union and deletes the child files. |
| Exclude `mcp-code-mode`; it stays flat. | Locked (ADR-005) | Live native-MCP server serving manuals beyond this set; lower blast radius. | Hub has exactly three members; code-mode untouched. |
| Hub `SKILL.md` at `1.0.0.0`; children keep own versions; no commands; default `mcp-chrome-devtools`. | Locked (ADR-006) | Matches prior-hub versioning; no bridge has a command today. | Scaffold hub at `1.0.0.0`, `command:null` per packet, `defaultMode:"mcp-chrome-devtools"`. |
| Defer figma-transport routing carve-out to phase 007. | Deferred by design | Empirical benchmark question, not a phase 002 assertion. | Scaffold `routingClass:"metadata"` for all modes; phase 007 may amend only if evidence justifies. |

### Frozen Target Shape For Phase 003

Future `mode-registry.json` must use this shape as the architecture target:

```json
{
  "skill": "mcp-tooling",
  "version": "1.0.0.0",
  "description": "Parent hub for MCP tool bridges: browser inspection, task management, and Figma design transport.",
  "discriminator": {
    "workflowMode": "Selects mcp-chrome-devtools, mcp-click-up, or mcp-figma.",
    "packetKind": "workflow for the two local-mutating bridges; transport for the figma bridge.",
    "backendKind": "cli-plus-mcp for the workflow bridges; figma-desktop-transport for figma."
  },
  "advisorRoutingContract": "One advisor identity: mcp-tooling. Packets are advisor-invisible nested modes resolved by hub membership.",
  "extensions": {
    "transport-axis": {
      "description": "Declares the TRANSPORT axis. packetKind:'transport' entries bridge to an external tool (figma-desktop-transport, routingClass:'metadata', mutatesWorkspace:false). The figma transport carries a mandatory cross-hub pairing to sk-design for design judgment (see ADR-002).",
      "transports": ["mcp-figma"],
      "crossHubPairing": { "mcp-figma": "sk-design" }
    }
  },
  "modes": [
    {
      "workflowMode": "mcp-chrome-devtools",
      "packetKind": "workflow",
      "backendKind": "cli-plus-mcp",
      "packet": "mcp-chrome-devtools",
      "packetSkillName": "mcp-chrome-devtools",
      "grandfatheredFolderMismatch": false,
      "command": null,
      "aliases": ["chrome devtools", "browser debug", "dom inspect", "lighthouse", "bdg", "cdp"],
      "toolSurface": {
        "mutatesWorkspace": true,
        "allowed": ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "mcp__code_mode__call_tool_chain"],
        "forbidden": [],
        "bashAllowlist": []
      },
      "advisorRouting": { "routingClass": "metadata", "packetSkillName": "mcp-chrome-devtools" }
    },
    {
      "workflowMode": "mcp-click-up",
      "packetKind": "workflow",
      "backendKind": "cli-plus-mcp",
      "packet": "mcp-click-up",
      "packetSkillName": "mcp-click-up",
      "grandfatheredFolderMismatch": false,
      "command": null,
      "aliases": ["clickup", "cupt", "task management", "work queue", "mark done", "time tracking"],
      "toolSurface": {
        "mutatesWorkspace": true,
        "allowed": ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "mcp__code_mode__call_tool_chain"],
        "forbidden": [],
        "bashAllowlist": []
      },
      "advisorRouting": { "routingClass": "metadata", "packetSkillName": "mcp-click-up" }
    },
    {
      "workflowMode": "mcp-figma",
      "packetKind": "transport",
      "backendKind": "figma-desktop-transport",
      "packet": "mcp-figma",
      "packetSkillName": "mcp-figma",
      "grandfatheredFolderMismatch": false,
      "command": null,
      "aliases": ["figma cli", "figma-ds-cli", "figma desktop", "render in figma", "figma tokens", "extract design.md", "figma mcp"],
      "toolSurface": {
        "mutatesWorkspace": false,
        "allowed": ["Read", "Bash", "Grep", "Glob", "mcp__code_mode__call_tool_chain"],
        "forbidden": ["Write", "Edit", "Task"],
        "bashAllowlist": []
      },
      "advisorRouting": { "routingClass": "metadata", "packetSkillName": "mcp-figma" }
    }
  ]
}
```

Future `hub-router.json` must use this shape as the architecture target:

```json
{
  "skill": "mcp-tooling",
  "version": "1.0.0.0",
  "routerPolicy": {
    "defaultMode": "mcp-chrome-devtools",
    "ambiguityDelta": 1,
    "tieBreak": ["mcp-chrome-devtools", "mcp-click-up", "mcp-figma"],
    "outcomes": {
      "single": "one dominant tool signal routes to one mode",
      "orderedBundle": "multiple explicitly requested tools route in tie-break order",
      "defer": "unclear or contradictory tool intent asks for disambiguation"
    },
    "defaultResource": ["mcp-chrome-devtools/SKILL.md"]
  },
  "routerSignals": {
    "mcp-chrome-devtools": {
      "weight": 4,
      "classes": ["chrome-devtools-aliases", "browser-debug", "hub-identity"],
      "resources": ["mcp-chrome-devtools/SKILL.md"]
    },
    "mcp-click-up": {
      "weight": 4,
      "classes": ["clickup-aliases", "task-management", "hub-identity"],
      "resources": ["mcp-click-up/SKILL.md"]
    },
    "mcp-figma": {
      "weight": 4,
      "classes": ["figma-aliases", "design-transport", "hub-identity"],
      "resources": ["mcp-figma/SKILL.md"]
    }
  },
  "vocabularyClasses": {
    "chrome-devtools-aliases": { "keywords": ["chrome devtools", "browser debug", "dom inspect", "lighthouse", "bdg", "cdp"] },
    "clickup-aliases": { "keywords": ["clickup", "cupt", "task management", "work queue", "mark done", "time tracking"] },
    "figma-aliases": { "keywords": ["figma cli", "figma-ds-cli", "figma desktop", "render in figma", "figma tokens", "extract design.md", "figma mcp"] },
    "hub-identity": { "keywords": ["mcp-tooling", "mcp tool bridge", "mode-registry"] }
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
| The three bridge skill trees | Current flat bridge skills and future hub members | Decision only in phase 002; physical move later | Phase 003 uses this plan as its registry/router target |
| `mcp-code-mode` + `code_mode` registration | Shared MCP substrate and native-MCP server | Unchanged — excluded (ADR-005) | Confirm `opencode.json` `code_mode` registration is untouched |
| `doctor_mcp_install.yaml` path refs | Hardcoded skill_dir/install_guide refs for the 3 bridges | Unchanged in phase 002; repointed in phase 006 | Later implementation grep covers the three bridge refs plus the stale `mcp-open-design` entry |
| Advisor routing corpus | 3 `labeled-prompts.jsonl` rows target `mcp-chrome-devtools` | Unchanged in phase 002; retargeted in phase 006 | Later implementation grep covers the labeled-prompts rows |

Required inventories:
- Same-class producers: `rg -n 'mcp-chrome-devtools|mcp-click-up|mcp-figma' .opencode/commands/doctor .opencode/skills/README.md README.md`.
- Consumers of changed symbols: `rg -n 'mcp-chrome-devtools|mcp-click-up|mcp-figma' . --glob '*.md' --glob '*.yaml' --glob '*.jsonl'`.
- Matrix axes: list every referrer class (functional path, advisor corpus, documentation catalog, internal self-path) and the required rows before implementation.
- Algorithm invariant: name-keyed `.utcp_config.json` manuals and the `code_mode` registration key must stay untouched.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the operator-locked decisions and treat them as frozen inputs
- [ ] Confirm the phase is documentation-only and scoped to `002-architecture-decision/` files
- [ ] Review `sk-design`'s `mode-registry.json`/`hub-router.json` as the transport-axis precedent

### Phase 2: Core Implementation
- [ ] Record the six ADRs with rationale, alternatives, and rollback paths
- [ ] Add the concrete `mode-registry.json` target including the transport-axis extension and cross-hub pairing
- [ ] Add the concrete `hub-router.json` target with `defaultMode:"mcp-chrome-devtools"` and a `defer` outcome
- [ ] Record the figma-transport routing carve-out as deferred to phase 007

### Phase 3: Verification
- [ ] Check no bracketed scaffold placeholders remain in the phase files
- [ ] Check anchors, frontmatter, `SPECKIT_LEVEL`, and `SPECKIT_TEMPLATE_SOURCE` markers remain intact
- [ ] Hold phase 003 until the operator approves or amends this decision gate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template integrity | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` anchors and frontmatter | `validate.sh` against this phase folder |
| Architecture consistency | Registry/router target matches the sk-design mixed-hub precedent | Manual review against `sk-design` references and later `parent-skill-check` after JSON exists |
| Human gate | Operator approval before phase 003 | Explicit approval in conversation or saved continuation note |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval | Human gate | Yellow | Phase 003 cannot start until the architecture decision is accepted or amended |
| sk-design transport-axis precedent | Internal documentation | Green | Without it, the transport-axis target could drift into an unsupported shape |
| Phase 007 benchmark evidence | Future empirical validation | Yellow | Final figma-transport routing carve-out remains deferred; scaffold uses metadata routing until evidence says otherwise |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Operator rejects or amends the architecture gate, or phase 003 discovers the frozen target conflicts with parent-hub enforcement.
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
                                    │ + transport-axis target   │ the frozen target
                                    ▼                          ▼
                          decision-record.md          004-onboard-chrome-devtools
                          (6 ADRs, operator-gated)     005-foldin-clickup-and-figma
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
| M1 | Decision record drafted | Six ADRs authored with alternatives and rollback paths | This phase, drafting sub-step |
| M2 | Gate approved | Operator accepts or amends all six ADRs | This phase, closing sub-step |
| M3 | Scaffold unblocked | Phase 003 has zero remaining architecture ambiguity | Phase 003 start |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the operator-locked decisions from the shared dispatch context are represented without reopening them
- [ ] Confirm no live `mcp-*` skill file is touched in this phase
- [ ] Confirm `decision-record.md` exists with Status: Accepted on all six ADRs before claiming the gate ready for review

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Draft `decision-record.md` before finalizing `spec.md`'s Executive Summary, since the summary depends on the ADRs' final wording. |
| TASK-SCOPE | Edits stay inside `002-architecture-decision/`; no git commands, no edits to any `mcp-*` skill. |

### Status Reporting Format
Report phase status as: `Phase 002 — <Draft|Review Gate|Approved> — N/6 ADRs accepted — blocking on: <operator approval | none>`.

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
