---
title: "Feature Specification: deep-alignment — conformance-audit mode for docs, code, design, and git history against named parent-skill authorities"
description: "Phase parent for deep-alignment, a new system-deep-loop mode-packet that asks a structured scoping question, resolves N alignment lanes (authority x artifact-class x scope), and reuses the deep-review runtime engine to audit artifacts against a named parent skill's own templates and creation standards via a pluggable per-authority adapter."
status: in_progress
trigger_phrases:
  - "deep-alignment mode"
  - "alignment lanes"
  - "conformance audit deep-loop"
  - "verify-first drift detection"
  - "sk-doc sk-git sk-design sk-code standards check"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled topology to children 000-013; opened 013-review-remediation"
    next_safe_action: "Finish the in-progress phases (001/003/004/006/008) or complete 013-review-remediation"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-review/SKILL.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs"
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-deep-alignment-mode"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "New mode-packet, not a deep-review mode (locked, see 002)"
      - "Adapter contract is discover/standardSource/check (locked, see 002)"
      - "Authorities v1 sequenced sk-doc, sk-git, sk-design, sk-code (locked, see 002)"
      - "sk-code automatability limits: HYBRID, deterministic surface-detection + reasoning-based pattern-conformance (ADR-008, locked)"
      - "sk-design live-render scope: new peer phase 010-adapter-sk-design-live-render (ADR-009, locked)"
      - "deep-review runtime reuse boundary: reduce-state.cjs promoted to shared runtime/scripts/ (ADR-010, locked)"
      - "non-interactive lane-arg schema: --lane-config <file.json> only (ADR-011, locked)"
      - "new-authority adapter registration governance: short adapter decision-record required (ADR-012, locked)"
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

# Feature Specification: deep-alignment — conformance-audit mode for docs, code, design, and git history against named parent-skill authorities

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-07-11 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/059-deep-alignment-mode |
| **Predecessor** | None (new mode-packet; prior art reviewed as evidence, not as a phase-chain predecessor, in phase 001) |
| **Successor** | None (new subsystem; a follow-on hardening tail is plausible after phase 009 but is not pre-scoped here) |
| **Handoff Criteria** | All child phases (000-013) pass `validate.sh --strict`; `parent-skill-check.cjs` STRICT clean once phase 003 scaffolds the real skill; the mode's cutover gate in phase 009 passes (gating on every other phase, including peer adapter phase 010) before advisor routing goes live |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repository defines conformance standards for its own artifacts — `sk-doc`'s document templates and DQI validators, `sk-git`'s commit and branch-naming rules, `sk-design`'s DESIGN.md and token structure, `sk-code`'s per-surface implementation patterns — but nothing checks a given artifact against the *named* standard it claims to follow, with reality-drift verification, in a repeatable loop. The closest thing that exists today is `deep-review`, which audits general code correctness, and `parent-skill-check.cjs`, which audits hub *structure* (folders, registries, routing) rather than artifact *content*. A manual 10-iteration conformance review of the `cli-external` and `mcp-tooling` hub docs against `sk-doc` standards was run by hand this session, using a hand-rolled scoping question, a hand-rolled per-authority ruleset, and a hand-rolled verify-first fix fleet: `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-strategy.md` and `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/002-hub-doc-conformance-fixes/spec.md`. That pattern is valuable and repeatable, but it has no product form: no reusable scoping protocol, no pluggable authority contract, no shared convergence loop.

### Purpose
Add `deep-alignment` as a new mode-packet under `system-deep-loop`, a peer of `deep-review`, that productizes the manual 130/131 pattern: ask a structured scoping question to resolve N alignment lanes (authority x artifact-class x scope), reuse the proven `deep-review` runtime engine (`.opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs`, `convergence.cjs`, `verify-iteration.cjs`, `upsert.cjs`) as a thin specialization rather than a rebuild, and audit each lane's artifacts against its named authority's own templates and creation standards through a pluggable per-authority adapter (`discover`, `standardSource`, `check`). The mode enforces an alignment contract — verify-first re-probing against live ground truth, a known-deviation suppression list per authority, read-only default, and gated opt-in remediation — so its output is proven drift against live reality, separated from intentional convention, not naive linting.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `system-deep-loop` mode-packet `deep-alignment`, sequenced across 10 phase children: research, architecture freeze, mode-packet scaffold plan, scoping/discovery design, and five authority adapters (`sk-doc` reference adapter, `sk-git` + `sk-design` static adapters, `sk-code` hardest adapter, `sk-design` live-render adapter — a peer adapter phase feeding the same reducer, not a sequential continuation), then loop wiring and command/agent/advisor cutover.
- A structured, non-interactive-capable scoping protocol over three axes: artifact class, standard authority, scope (paths/globs/branch-range).
- A pluggable per-authority adapter contract so `sk-doc`/`sk-git`/`sk-design`/`sk-code` are the v1 authority set, not a hard-wired ceiling — future authorities (`sk-prompt`, `system-spec-kit`) stay addable without a rebuild.
- Reuse of the `deep-review` runtime engine for iteration, convergence, and state, specialized for conformance-to-a-named-authority rather than general correctness review.
- The alignment contract as a first-class mode invariant: verify-first re-probing, known-deviation suppression, read-only default, gated remediation.
- Root purpose and child phase manifest for this decomposition; per-phase implementation detail lives in each child folder.

### Out of Scope
- Implementing the mode itself at the parent level — no `SKILL.md`, no `mode-registry.json` entry, no adapter scripts, no command files are created by this scaffold. Those are PLANNED in phases 003 and 009, not built here.
- Rebuilding or forking the `deep-review` runtime engine wholesale — the exact reuse boundary (shared scripts vs. a fork) is an explicitly open question owned by phase 002/008, not resolved at the parent.
- Replacing `parent-skill-check.cjs` (hub structure checks) or `deep-review` (general code correctness) — `deep-alignment` is scoped to artifact-content conformance against a named authority, a boundary phase 002 must record explicitly.
- Building the live-render adapter's actual code — phase 006 scopes v1 to static DESIGN.md/token checks only, per the locked decision brief; live-render (chrome-devtools-driven, dispatched only through `design-mcp-open-design`) ships as peer phase 010 (ADR-009, LOCKED), planned here but not implemented.

### Files to Change
Summary of aggregate file scope across all 9 phases; per-phase detail lives in each child's `plan.md`. Every row below is planned, not yet created.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Create | 003 | Thin mode contract for the new packet |
| `.opencode/skills/system-deep-loop/mode-registry.json` | Modify | 003 | New `deep-alignment` mode entry alongside `research`/`review`/`council` |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scope-resolver.*` | Create | 004 | Scoping decision-tree + lane resolution + non-interactive arg form |
| `.opencode/skills/system-deep-loop/deep-alignment/adapters/sk-doc/*` | Create | 005 | Reference authority adapter: `discover`/`standardSource`/`check` |
| `.opencode/skills/system-deep-loop/deep-alignment/adapters/{sk-git,sk-design}/*` | Create | 006 | Deterministic commit/branch adapter + static design-rubric adapter |
| `.opencode/skills/system-deep-loop/deep-alignment/adapters/sk-code/*` | Create | 007 | Surface-detection + reasoning-based pattern-conformance adapter (ADR-008 LOCKED: hybrid) |
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Move | 008 | Relocated from `deep-review/scripts/` per ADR-010 (LOCKED); `deep-review`'s import repointed, behavior unchanged |
| `.opencode/skills/system-deep-loop/runtime/scripts/{loop,reduce-alignment-state}.*` | Create | 008 | Loop wiring onto the runtime engine + report reducer (shared-runtime location per ADR-010) |
| `.opencode/skills/system-deep-loop/deep-alignment/adapters/sk-design-live-render/*` | Create | 010 | Live-render adapter dispatched through `design-mcp-open-design` (ADR-009 LOCKED); peer of 006/007, feeds phase 008's reducer |
| `.opencode/commands/deep/alignment.md` + assets | Create | 009 | `/deep:alignment` command and its auto/confirm asset pair |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

> **DAG note**: Phase numbers are folder IDs, not a strict execution order. Phase 010 (`sk-design` live-render) is a peer adapter alongside 006 and 007 — it feeds phase 008's reducer the same way 006/007 do, even though its folder number is higher than phase 009's. Phase 009 (cutover) is the terminal phase of the original 0-010 build DAG: its gates run last, after every other build phase — including 010 — is implemented. Phases 011-013 are post-build follow-on phases (doc-conformance, behavior-benchmark capture, and review remediation) added after that build DAG; they do not re-open it. Statuses below reflect on-disk reality.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 0 | 000-deep-loop-runtime-refinement/ | Prerequisite: remediate the deep-loop runtime bugs surfaced by the `008-divergent-mode-dogfood` findings that this mode reuses — the reducers, agent-definition contracts, council dispatch, and benchmark verdict must be sound before the mode is built on top of them | Complete |
| 1 | 001-research-and-context/ | Read-only research gate: deep-review packet + runtime scripts, prior art (052, 055, 051), the 4 parent skills' standards surfaces, and reference implementation packets 130/131 | In progress |
| 2 | 002-architecture-decision/ | Decision gate: freeze new-packet-vs-review-mode, the scoping decision-tree, the adapter contract, the alignment contract, the state machine, artifact layout, and the boundaries vs `parent-skill-check.cjs`/`deep-review`. All 12 ADRs Accepted (7 brief-locked + 5 operator-resolved 2026-07-11) | Complete |
| 3 | 003-scaffold-mode-packet/ | Plan the mode-packet skeleton: `SKILL.md`, `mode-registry.json` entry, advisor routing block, hub-router touchpoints, prompt-pack template, dir skeleton, changelog | In progress |
| 4 | 004-scoping-and-discovery/ | The interactive scoping question decision-tree, lane resolution, the non-interactive `--lane-config` arg form (ADR-011 LOCKED: config-file-only), per-adapter `discover(scope)` | In progress |
| 5 | 005-adapter-sk-doc/ | The reference adapter: validators, templates, reality-check — the proven path every other adapter follows | Complete |
| 6 | 006-adapter-sk-git-and-sk-design/ | The deterministic `sk-git` commit/branch adapter plus the `sk-design` STATIC audit-rubric adapter (live-render split into peer phase 010) | In progress |
| 7 | 007-adapter-sk-code/ | The hardest adapter: surface-detection + reasoning-agent-based pattern-conformance, HYBRID (ADR-008 LOCKED) with honest layer-tagging | Complete |
| 8 | 008-iterate-converge-report/ | Wire the loop to the runtime engine (`reduce-state.cjs` promoted to shared `runtime/scripts/` per ADR-010 LOCKED), the alignment-report reducer, convergence thresholds, corpus partitioning across all adapter lanes including 010 | In progress |
| 9 | 009-command-agent-advisor-cutover/ | `/deep:alignment` command + assets, `@deep-alignment` leaf agent, advisor vocab/routing, a behavior benchmark, and the cutover gates — terminal phase, gates run after phase 010 too | Complete |
| 10 | 010-adapter-sk-design-live-render/ | Peer adapter phase: the `sk-design` live-render dimension (chrome-devtools-driven, dispatched only through `design-mcp-open-design`), ADR-009 LOCKED; feeds phase 008's reducer alongside 006/007 | Complete |
| 11 | 011-skdoc-doc-conformance/ | sk-doc doc-conformance pass over the deep-alignment packet's own authored docs | Complete |
| 12 | 012-behavior-benchmark-capture/ | Capture the mode's autonomous behavior baseline across runtimes; records the setup-misbind and autonomous-termination signals the review's F010 cites | Complete |
| 13 | 013-review-remediation/ | Remediate the deep-review Pass A findings (F001-F010): fail-closed correctness, security-boundary honesty, contract fidelity, topology truth | In progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Phase 010 is a DAG peer of 006/007, not a sequential successor of 009 — see the DAG note above

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research-and-context | 002-architecture-decision | Research/context map complete; confirmed reuse points grounded in fresh reads, not assumption | Human review (research gate stops here) |
| 002-architecture-decision | 003-scaffold-mode-packet | `decision-record.md` accepted; state machine, adapter contract, and boundaries frozen (all 12 ADRs Accepted) | Human approval required |
| 003-scaffold-mode-packet | 004-scoping-and-discovery | Mode-packet skeleton plan complete; zero adapter content planned yet | Plan review only — no files exist until phase 003 executes |
| 004-scoping-and-discovery | 005-adapter-sk-doc | Scoping decision-tree and lane-resolution design complete | Plan review; decision tree covers all 3 axes with the `--lane-config` non-interactive form |
| 005-adapter-sk-doc | 006-adapter-sk-git-and-sk-design, 010-adapter-sk-design-live-render | Reference adapter design proven against real `sk-doc` validators | Plan review; adapter contract shape matches phase 002's freeze exactly |
| 006-adapter-sk-git-and-sk-design | 007-adapter-sk-code | Deterministic adapters designed; `sk-design` v1 STATIC scope explicitly bounded (live-render is peer phase 010, not this phase) | Plan review |
| 007-adapter-sk-code | 008-iterate-converge-report | Hardest adapter's honest-limits and accepted-deviation set documented (ADR-008 LOCKED: hybrid) | Plan review |
| 010-adapter-sk-design-live-render | 008-iterate-converge-report | Live-render adapter's dispatch-boundary compliance and known-deviation set documented (ADR-009 LOCKED) | Plan review |
| 008-iterate-converge-report | 009-command-agent-advisor-cutover | Loop-wiring and report design complete against the runtime engine's real contract, including the `reduce-state.cjs` shared-runtime relocation (ADR-010 LOCKED) and all adapter lanes (005-007, 010) | Plan review |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None at the parent level. All 12 ADRs in `002-architecture-decision/decision-record.md` are Accepted — the original 7 locked by the frozen design brief, plus 5 resolved by the operator on 2026-07-11:

- `sk-code` adapter automatability limits — ADR-008 LOCKED: HYBRID (deterministic surface-detection + reasoning-based pattern-conformance, honestly layer-tagged). Phase 007 designs the specific split.
- `sk-design` live-render audits (chrome-devtools-driven) — ADR-009 LOCKED: joins as peer phase `010-adapter-sk-design-live-render`, dispatched only through `design-mcp-open-design`. v1 static scope (ADR-004, phase 006) is unchanged.
- Exact reuse boundary with the `deep-review` runtime engine — ADR-010 LOCKED: `reduce-state.cjs` promotes to shared `runtime/scripts/`, behavior-preserving relocation. Phase 008 performs it; the separate `convergence.cjs` loopType reuse-vs-extend question remains phase 008's own open build-time call, independent of this ADR.
- Non-interactive lane-arg schema for headless/cron invocation — ADR-011 LOCKED: config-file-only (`--lane-config <file.json>`). Phase 004 designs the JSON schema's field-level detail.
- Governance for registering a new authority adapter beyond the v1 four (plus phase 010) — ADR-012 LOCKED: a short adapter-specific decision-record is required, mirroring ADR-005/ADR-008's honesty discipline. Standing governance rule, not deferred.

Each child phase's own `spec.md` §"Open Questions" may still carry genuinely open, phase-local implementation decisions (for example phase 008's loopType reuse-vs-extend call) — those are execution-time design choices within a locked frame, not open architecture decisions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
