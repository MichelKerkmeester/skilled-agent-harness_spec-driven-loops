---
title: "Feature Specification: cli-pi Native Bridge to Cursor & Devin CLI Models"
description: "Phase parent for investigating and (later) building a native bridge that lets cli pi authenticate against Cursor and Devin subscriptions and expose their CLI-backed models inside pi's own /models picker."
trigger_phrases:
  - "cli pi bridge cursor devin"
  - "pi models cursor devin oauth"
  - "expose cursor devin models in pi"
  - "cli pi native model bridge"
  - "cli pi bridge phase parent 045"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/045-cli-pi-bridge-cursor-devin"
    last_updated_at: "2026-08-17T11:46:00Z"
    last_updated_by: "claude"
    recent_action: "Research child 001 complete; not-feasible-now verdict"
    next_safe_action: "Close packet; revisit if a vendor completions surface ships"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-pi/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-devin/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "research-045-phase-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: cli-pi Native Bridge to Cursor & Devin CLI Models

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Active |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration/045-cli-pi-bridge-cursor-devin |
| **Predecessor** | cli-external-orchestration/031-cli-pi-creation (the cli-pi executor precedent) |
| **Successor** | None (implementation phases arrive after the research phase resolves feasibility) |
| **Handoff Criteria** | Every phase passes `validate.sh --strict` independently and `validate.sh --recursive --strict` passes on this parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli pi` ships its own model picker (`/models`) backed by pi's own provider roster. Cursor and Devin each ship their own CLI (`cursor-agent`, `devin`) with models reachable only through a paid subscription and that CLI's own auth. Today, using a Cursor- or Devin-only model from inside pi means shelling out to a sibling CLI as a separate executor — not selecting that model natively in pi's `/models` list. The open question is whether pi can authenticate against the operator's existing Cursor and Devin OAuth subscriptions and surface those subscription-backed models as first-class entries in pi's own `/models` picker, without re-implementing each vendor's agent.

### Purpose
Resolve feasibility first, build second. The research phase investigates every viable path — OAuth/token reuse, provider-adapter shims, gateway/proxy fronting, and the licensing/ToS boundaries — and produces a ranked, evidence-backed recommendation. Implementation phases (if any) are opened only after the research phase names a concrete, permissible mechanism.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, findings, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Investigating how `cli pi` resolves and lists models in `/models`, and where a new provider/model source would plug in.
- Investigating how Cursor (`cursor-agent`) and Devin (`devin`) authenticate (OAuth/subscription/token storage) and whether that auth is reusable by a third-party client.
- Mechanisms to surface subscription-backed Cursor/Devin models inside pi natively: provider adapters, token reuse, local gateway/proxy, or a documented "not feasible / ToS-blocked" verdict.
- The licensing, Terms-of-Service, and account-safety boundaries of reusing each vendor's auth outside its own CLI.

### Out of Scope
- Actually shipping the bridge implementation — that is a later phase, gated on the research verdict.
- Changes to the existing `cli-devin` / `cli-cursor` executor-dispatch surfaces (the current shell-out path stays as-is).
- Non-model surfaces of pi (unrelated commands, TUI features).
- Any change that would violate a vendor's ToS or endanger the operator's paid accounts.

### Files to Change
Research phase writes only under its own `research/` artifact tree; no runtime files change during research.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities/research/**` | Create | 001 | Deep-research findings, synthesis, resource map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, findings, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research-bridge-possibilities/ | 10-iteration deep research on native paths to expose Cursor + Devin subscription models inside pi's `/models` (5 iters GLM-5.2-High via cli-devin + 5 iters Grok-4.6-xhigh via cli-cursor, forced depth). Verdict: not-feasible-now — keep the existing shell-out. | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research-bridge-possibilities | (implementation phases, TBD) | Research converges on a ranked, evidence-backed feasibility verdict with at least one permissible mechanism (or a documented "not feasible" conclusion) | `research/research.md` synthesized; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether any viable path exists that stays inside both Cursor's and Devin's Terms of Service — the research phase answers this before any implementation phase opens.
- Whether a single bridge mechanism can serve both vendors, or each needs its own adapter.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md, and research artifacts
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
