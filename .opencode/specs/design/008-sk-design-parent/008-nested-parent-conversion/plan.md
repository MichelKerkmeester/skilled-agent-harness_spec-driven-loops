---
title: "Implementation Plan: Phase 8: nested-parent-conversion"
description: "The staged, gated plan to convert the flat sk-design family into one nested-packet parent skill: five gated stages (scaffold, nest, rewire, optional commands/agents, validate), each with entry/exit gates and rollback, with the irreversible structural move isolated. Plan-only; nothing is executed in this packet."
trigger_phrases:
  - "sk-design conversion plan"
  - "sk-design nested packet stages"
  - "sk-design rewire plan"
  - "sk-design conversion rollback"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/008-nested-parent-conversion"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the five-stage gated conversion plan"
    next_safe_action: "Operator review before any stage executes"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/008-nested-parent-conversion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: nested-parent-conversion

<!-- SPECKIT_LEVEL: 3 -->

<!-- This plan describes a FUTURE, operator-approved conversion. This packet executes
none of the .opencode/skills/** work below; it only authors the plan. -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON skill packaging under `.opencode/skills/` |
| **Framework** | Parent skill with nested mode packets (`parent_skills_nested_packets.md`) |
| **Storage** | None (filesystem skill tree; one hub `graph-metadata.json`) |
| **Testing** | `package_skill.py --check`, `advisor_rebuild`, `skill_graph_validate`, routing fixtures, `validate.sh --recursive` |

### Overview
Convert the flat `sk-design` family (one umbrella router + five independent top-level siblings) into a single nested-packet parent skill (Model A, per `decision-record.md` ADR-001): an invokable hub `SKILL.md` + `mode-registry.json` + exactly one `graph-metadata.json` + five nested mode packets (`interface`, `foundations`, `motion`, `audit`, `md-generator`) + a `shared/` base. Modes are reached through the invokable hub (ADR-002); no advisor merged-identity layer is added. The work is split into five gated stages with the irreversible structural move isolated behind a recovery baseline. This packet writes only its own spec-folder docs plus an append to the parent map; it executes no stage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (spec.md section 5)
- [x] Dependencies identified (decision-record ADR-001 evidence; section 6 below)

### Definition of Done
- [ ] All acceptance criteria met (this packet: docs authored, metadata generated, dual validate clean)
- [ ] Tests passing (N/A for plan-only; the conversion's checks live in Stage 5)
- [ ] Docs updated (spec/plan/tasks + decision-record + checklist + implementation-summary)

> The Definition of Done for the conversion itself lives in the per-stage exit gates (section 4) and is satisfied only by a future, operator-approved execution.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent skill with nested mode packets: one advisor-routable hub dispatching to N self-contained mode packets over a shared base, with exactly one `graph-metadata.json` (the hub's).

### Key Components
- **Hub `SKILL.md`**: routing-only; aggregates all mode trigger phrases; classifies a request to a mode key.
- **`mode-registry.json`**: the discriminator (`workflowMode`/`backendKind`/`packet`) plus `advisorRouting` per mode; single source of truth.
- **`graph-metadata.json`**: the one advisor identity (`skill_id == "sk-design"`); `derived.trigger_phrases` aggregate every mode.
- **Five nested packets**: `interface`, `foundations`, `motion`, `audit`, `md-generator` (the last over a Playwright backend; its `backendKind` differs); each self-contained, zero `graph-metadata.json`.
- **`shared/`**: anti-slop / token-budget / cognitive-laws base references; non-discoverable by construction.

### Data Flow
```
advisor query (design ...) -> routes to ONE identity: sk-design (>=0.8)
Skill(sk-design[, "motion: <request>"])
  -> hub SKILL.md smart router classifies the request (mode key)
  -> reads mode-registry.json
  -> loads the nested packet at sk-design/<mode>/SKILL.md
  -> (optional) /design:* commands + design-mode agents are complementary, not required
```
No advisor merged-identity projection is added: routing terminates at `sk-design`; the hub selects the mode. The one hard invariant holds: exactly one `graph-metadata.json` under `sk-design/` (the hub's, `skill_id == folder`, `family` in the allowed set); zero in any packet or `shared/`. The five flat per-skill `graph-metadata.json` files are deleted during Stage 2.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This conversion touches shared routing/discovery policy, so the affected-surface inventory is required before execution. All actions below are FUTURE (not performed in this packet).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design/` | Umbrella router skill | Becomes the hub + registry + one graph-metadata + nested packets + shared/ | `package_skill.py --check`; one graph-metadata under sk-design/ |
| `.opencode/skills/sk-design-*/` (5) | Independent top-level skills | Moved into `sk-design/<mode>/`; per-skill graph-metadata deleted | No orphan `sk-design-*` folders; zero packet graph-metadata |
| ~72 `.opencode/skills/**` files | Reference the flat names | Rewire to `sk-design` (+ mode/packet path) | residual re-grep returns only intended/legacy hits |
| `CLAUDE.md`, `AGENTS.md` | 2 root-config references | Rewire to `sk-design` | grep both files |
| `mcp-open-design` | Mandatory design co-load | Confirm minimal/no rewire (0 flat-name matches verified) | grep `mcp-open-design` for flat names |
| `.opencode/specs/**` (434) | Historical doc mentions | Leave as-is (non-breaking) | no action |
| Skill Advisor + skill-graph | Discovery + routing | Rebuild + validate only (no new maps, no new drift-guard) | `advisor_rebuild`; design query -> sk-design >=0.8 |

Required inventories (run at execution time):
- Same-class producers: `rg -n 'sk-design-(interface|foundations|motion|audit|md-generator)' .opencode/skills`.
- Consumers of the flat names: `rg -n 'sk-design-(interface|foundations|motion|audit|md-generator)' . --glob '*.md' --glob '*.json' --glob '*.ts'`.
- Invariant: exactly one `graph-metadata.json` under `sk-design/`; adversarial check = grep for any `graph-metadata.json` in a packet or `shared/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

The five gated conversion stages. Every stage below is part of the FUTURE conversion.

> All stages are FUTURE. This packet executes none of them. Each stage has an entry gate, an exit gate, and a rollback note. A failed exit gate stops the conversion at that stage.

### Phase 1: Stage 1 - Scaffold hub + registry + one graph-metadata (additive, reversible)
- [ ] Create `sk-design/SKILL.md` from `parent_skill_hub_template.md` (routing-only; aggregate all mode trigger phrases).
- [ ] Create `sk-design/mode-registry.json` from `parent_skill_registry_template.json` (five mode entries; `backendKind`; `packetSkillName` where the folder differs).
- [ ] Create `sk-design/graph-metadata.json` from `parent_skill_graph_metadata_template.json` (one identity; `derived.trigger_phrases` aggregate all modes; edges per section 6).
- **Entry gate**: decision-record ADR-001 + ADR-002 approved; recovery baseline chosen (worktree or committed pre-move tag).
- **Exit gate**: the three hub files exist and parse; `package_skill.py --check` passes on the hub `SKILL.md`; the flat skills are still intact and untouched.
- **Rollback**: delete the three new hub files; the flat family is unchanged.

### Phase 2: Stage 2 - Nest each packet (THE IRREVERSIBLE MOVE - isolated)
- [ ] For each of the five skills, move its content verbatim into `sk-design/<mode>/` (own `SKILL.md`, `references/`, `scripts/`, `assets/`, etc.).
- [ ] Delete each moved skill's `graph-metadata.json` so exactly one (the hub's) remains.
- [ ] Repoint each packet's internal relative paths to its new packet root.
- [ ] Move the shared base references into `sk-design/shared/`.
- **Entry gate**: Stage 1 exit gate green; the recovery baseline is committed/created (the point of no easy return).
- **Exit gate**: all five packets live under `sk-design/<mode>/`; zero `graph-metadata.json` in any packet or `shared/`; exactly one under `sk-design/`; each packet's `SKILL.md` still passes `package_skill.py --check`; no orphan `sk-design-*` top-level folders remain.
- **Rollback**: restore from the recovery baseline (worktree discard or `git reset`/restore to the pre-move tag).

### Phase 3: Stage 3 - Rewire the ~72 references (mechanical, verifiable)
- [ ] Rewire the ~72 `.opencode/skills/` cross-refs to the flat names → `sk-design` (+ mode/packet path as appropriate).
- [ ] Rewire the 2 root-config refs (`CLAUDE.md`, `AGENTS.md`).
- [ ] Leave the 434 `.opencode/specs/` doc mentions as historical / non-breaking.
- [ ] Confirm `mcp-open-design` needs minimal/no pairing rewire (0 matches verified).
- **Entry gate**: Stage 2 exit gate green (packets exist at final paths so links resolve).
- **Exit gate**: a residual re-grep for the flat names across `.opencode/skills/` and the 2 root-config files returns only intended/legacy-alias hits; no broken co-load or routing reference remains.
- **Rollback**: revert the rewrite commits (text-only, fully revertible).

### Stage 4 - Commands + agents (OPTIONAL, deferrable)
- [ ] Optionally add `/design:*` commands and design-mode agents mirroring the deep-loop pattern.
- **Entry gate**: Stages 1–3 green; operator opts in to the optional surfaces.
- **Exit gate**: each command/agent routes into the hub correctly; or, if deferred, this stage is explicitly skipped and recorded.
- **Rollback**: remove the added command/agent files; the primary `Skill(sk-design[, args])` invocation is unaffected.

### Stage 5 - Validate (the conversion gate)
- [ ] `package_skill.py --check` passes on the hub `sk-design`.
- [ ] `advisor_rebuild` + `skill_graph_validate` succeed (rebuild only - no new merged-identity maps, no new drift-guard).
- [ ] Routing fixtures: a design query routes to `sk-design` at ≥0.8, and the hub routes representative requests to the correct mode packet.
- [ ] `validate.sh --recursive` on `154-sk-design-parent` passes.
- **Entry gate**: Stages 1–3 (and 4 if taken) green.
- **Exit gate**: all checks pass; exactly one `graph-metadata.json` under `sk-design/`.
- **Rollback**: if any check fails, restore from the Stage 2 recovery baseline and re-plan.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packaging | Hub + each nested packet `SKILL.md` | `package_skill.py --check` (Stages 1, 2, 5) |
| Discovery invariant | Exactly one `graph-metadata.json` under `sk-design/` | `skill_graph_validate` + file count (Stage 5) |
| Advisor routing | Design query → `sk-design` ≥0.8 | `advisor_rebuild` + routing fixture (Stage 5) |
| Hub mode routing | Representative requests → correct mode packet | routing fixtures (Stage 5) |
| Reference integrity | No broken flat-name refs in `.opencode/skills/` + root config | re-grep (Stage 3) |
| Spec integrity | Parent + children validate | `validate.sh --recursive` on 154 (Stage 5) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `parent_skills_nested_packets.md` + 3 parent-skill templates | Internal | Green | Target structure undefined |
| `deep-loop-workflows/` canonical example | Internal | Green | No worked reference for hub/registry/graph |
| 155 native invocability | Internal | Green (satisfied) | Invocation mechanism decided (ADR-002 hub routing) |
| 002 architecture-decision | Internal | Reversed | This packet reverses it (ADR-001); 002 stays `complete` |
| 147 / 150 (pattern provenance) | Internal | Green | Pattern lineage for the nested-packet model |
| Skill Advisor + skill-graph build | Internal | Green | Stage 5 cannot rebuild/validate |

### Edge Relations (recorded in graph-metadata.json `manual`)
- `depends_on`: 155 (native invocability - satisfied by hub routing).
- `related_to`: 002 (reversed), 147 and 150 (the nested-packet pattern lineage).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any stage exit gate fails, or the converted family fails Stage 5 validation.
- **Procedure**: additive-first. Stage 1 (scaffold), Stage 3 (text rewires), and Stage 4 (optional files) are revertible by deleting/reverting their commits. The irreversible part is Stage 2 (content move + child `graph-metadata.json` deletion); before it, establish a recovery baseline (a dedicated worktree or a committed pre-move tag of the flat family). If Stage 2+ must be abandoned, discard the worktree or `git restore`/reset to the pre-move tag to restore the flat family wholesale.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Stage 1 (Scaffold) ──> Stage 2 (Nest, IRREVERSIBLE) ──> Stage 3 (Rewire) ──> Stage 5 (Validate)
                                                              │
                                                       Stage 4 (Commands/Agents, OPTIONAL) ──> Stage 5
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| 1 Scaffold | ADR approval + baseline chosen | 2 |
| 2 Nest (irreversible) | 1 + baseline created | 3, 4, 5 |
| 3 Rewire | 2 | 5 |
| 4 Commands/Agents (optional) | 3 | 5 |
| 5 Validate | 3 (and 4 if taken) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Scaffold | Low | Small |
| 2 Nest (5 packets + deletions + repoint) | High | Largest single block |
| 3 Rewire (~72 refs + 2 config) | Med | Mechanical but broad |
| 4 Commands/Agents (optional) | Low | Optional |
| 5 Validate | Med | Gate runs |
| **Total** | | **Indicative only - this packet commits to no schedule** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Recovery baseline established (worktree OR committed pre-move tag of the flat family)
- [ ] Stage 1 hub files green under `package_skill.py --check`
- [ ] Operator approval of ADR-001 + ADR-002 on record

### Rollback Procedure
1. If in Stage 1: delete the three new hub files.
2. If in/after Stage 2: discard the worktree, or `git restore`/reset to the pre-move tag (restores the flat family wholesale).
3. If in Stage 3/4: revert the text/command commits.
4. Verify: the family discovers correctly (one identity if forward, six if rolled back) and `validate.sh --recursive` on 154 passes.

### Data Reversal
- **Has data migrations?** No (filesystem skill tree only).
- **Reversal procedure**: restore the flat skill folders + their five `graph-metadata.json` files from the recovery baseline.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐
│ ADR approval +   │
│ baseline chosen  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Stage 1 Scaffold │  (reversible)
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Stage 2 Nest     │  (IRREVERSIBLE - behind recovery baseline)
└────────┬─────────┘
         ▼
┌──────────────────┐      ┌────────────────────────┐
│ Stage 3 Rewire   │─────▶│ Stage 4 Commands/Agents │ (optional)
└────────┬─────────┘      └───────────┬────────────┘
         └───────────────┬────────────┘
                         ▼
                ┌──────────────────┐
                │ Stage 5 Validate │ (gate)
                └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Stage 1 Scaffold | ADR approval + baseline | hub + registry + one graph-metadata | Stage 2 |
| Stage 2 Nest | Stage 1 + baseline | five nested packets; five child graph-metadata deleted | Stages 3, 4, 5 |
| Stage 3 Rewire | Stage 2 | ~72 refs + 2 config repointed | Stage 5 |
| Stage 4 Commands | Stage 3 | optional /design:* + agents | Stage 5 |
| Stage 5 Validate | Stages 3 (+4) | the conversion gate result | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **ADR approval + baseline** - gate - CRITICAL
2. **Stage 1 Scaffold** - CRITICAL (hub identity must exist before nesting)
3. **Stage 2 Nest** - CRITICAL + IRREVERSIBLE (the structural move)
4. **Stage 3 Rewire** - CRITICAL (broken refs block routing)
5. **Stage 5 Validate** - CRITICAL (the conversion gate)

**Total Critical Path**: gate + four critical stages (Stage 4 is off-path).

**Parallel Opportunities**:
- Stage 4 (commands/agents) can run alongside Stage 3 once nesting is done.
- The 2 root-config rewires can run in parallel with the ~72 skill-ref rewires within Stage 3.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Hub scaffolded | Stage 1 exit gate green | FUTURE |
| M2 | Family nested | Stage 2 exit gate green; one graph-metadata under sk-design/ | FUTURE |
| M3 | References rewired | Stage 3 exit gate green; no broken flat-name refs | FUTURE |
| M4 | Optional surfaces | Stage 4 done or explicitly deferred | FUTURE |
| M5 | Validated | Stage 5 all checks pass; routing ≥0.8; validate.sh --recursive clean | FUTURE |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reverse 002 Model B → Model A (one nested-packet parent)

**Status**: Accepted

**Context**: The operator wants a single advisor identity for the design family; Model B's flat siblings expose six identities.

**Decision**: Convert the flat family into one nested-packet parent skill (hub + registry + one graph-metadata + five nested packets + shared/).

**Consequences**:
- One advisor identity matching the `deep-loop-workflows` model.
- Irreversible structural move + ~72 rewires + a reversed binding decision; mitigated by staging and a recovery baseline.

**Alternatives Rejected**:
- Keep Model B: fails the single-identity goal.

See `decision-record.md` for the full ADR-001 and ADR-002 (invokable-hub routing; advisor merged-identity avoided).

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
