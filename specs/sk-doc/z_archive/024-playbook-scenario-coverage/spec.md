---
title: "Feature Specification: playbook scenario coverage across the 11 hub playbooks"
description: "The 11 hub manual-testing-playbook trees hold two incompatible contracts under one directory name, and the sk-doc operator-scenario contract has zero mechanical enforcement anywhere in the repository. Coverage claims are hand-typed prose that has drifted in every hub counted, several shipped scenarios teach an operator to violate a hard repo rule, and the only existing gate checks the other contract and exits 0 on failure. This phased packet builds the missing validator, repairs the hazardous scenarios risk-first, and authors the coverage the derived map proves is owed."
trigger_phrases:
  - "playbook scenario coverage"
  - "manual testing playbook validator"
  - "playbook census drift"
  - "operator scenario contract gate"
  - "playbook corpus split"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the phase-parent spec from the track (d) synthesis proposal"
    next_safe_action: "Resolve the seven operator decisions, then scaffold and start child 001"
    blockers:
      - "OPERATOR-DECISION Q2 (corpus split ruling) gates child 001 Lane A"
      - "OPERATOR-DECISION Q4 (Gate-3 D/E amendment) gates the RD-003-02 scenario rewrite in child 002"
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions:
      - "Q1 shared count-derivation helper ownership"
      - "Q2 corpus split: frontmatter discriminator or file move"
      - "Q3 owner of cross-skill end-to-end workflow scenarios"
      - "Q4 Gate-3 D/E amendment decision and the absent cursor advisory hook"
      - "Q5 does sk-prompt-models owe a playbook package"
      - "Q6 phase-qualification score for this program"
      - "Q7 stating system-spec-kit NOT READY explicitly"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This file is the ONLY authored document at the parent level. Heavy docs live in the phase children.
-->

# Feature Specification: Playbook Scenario Coverage

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None (top-level phase parent under the `sk-doc` track) |
| **Parent Packet** | `sk-doc` |
| **Predecessor** | `sk-doc/021-benchmark-naming-and-playbook-results` (Complete — owns where run evidence lands) |
| **Successor** | None |
| **Handoff Criteria** | Each child validates independently under `validate.sh --strict`; the parent validates under `--recursive --strict` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 11 hub `manual-testing-playbook/` trees are not one corpus. They are two incompatible contracts sharing a
directory name: the `sk-doc` **operator-scenario** contract (five numbered sections, a per-feature required-content
list, exact prompts and commands, evidence, binary verdict, failure triage) and the Lane-C **typed routing gold**
contract (compact frontmatter with `expected_workflow_mode` + `expected_leaf_resources`, read by the skill-benchmark
loader and gated by `validate-playbook-topology.cjs`). Every defect in this program is downstream of that collision.

Three consequences are load-bearing:

1. **The operator-scenario contract has zero mechanical enforcement.** `sk-doc/sk-create-manual-testing-playbook/`
   ships `SKILL.md`, `README.md`, `assets/`, `references/`, `changelog/` — and no `scripts/`. Its own SKILL.md §7
   lists the required section structure, ID bijection, and link resolution under the heading **Manual Checks**.
   Every coverage claim in the fleet is therefore hand-typed prose, and it has drifted in every hub counted.
2. **The one gate that exists checks the other contract, and it is fail-open.** `validate-playbook-topology.cjs`
   reports `verdict: FAIL` on four hubs and still calls `process.exit(0)` unless `--strict` is passed, so no CI
   job has ever seen the failure. Under that gate `sk-git` — the reference-quality operator playbook — scores 0
   valid of 42, because it is being measured against a contract it was never written to.
3. **Some shipped scenarios are worse than gaps.** They are indexed, counted, and in cases recorded PASS, while
   their exact command sequence would fail today or would instruct the operator to do something the repository
   forbids — an unpermissioned `git push -u origin ...`, a `git worktree add` that bypasses the clone-wide
   allocator, a dispatch flag the target CLI rejects on run. A gap is silence; a wrong scenario is misinformation
   with an authority stamp.

### Purpose

Make "covered" and "conforming" mechanically checkable for the operator-scenario contract, then use that gate to
remove the false coverage and author the coverage the derived map proves is owed — hazardous scenarios first.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task
> breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
> This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The governing standard and both templates under `sk-doc/sk-create-manual-testing-playbook/`.
- A new operator-contract validator owned by that packet, with paired positive/negative fixtures and CI wiring.
- A derived per-hub coverage map replacing hand-maintained gap prose.
- All 11 hub-root `manual-testing-playbook/` trees: root census normalization, verdict-enum migration,
  filename migration, scenario repair, and new scenario authoring.
- The 52 active findings from the track (d) research loop, allocated across the three children below.

### Out of Scope

- **Nested playbooks** under `system-deep-loop/deep-review/`, `system-deep-loop/runtime/`, and
  `system-deep-loop/deep-ai-council/` — outside the frozen 11-directory manifest; owned by the WS1 register's
  `031-silent-failure-and-harness-repair` and `032-docs-drift-and-p2-batch`.
- **Feature-catalog completeness defects** — owned by the feature-catalog integrity track. Consumed here only as a
  known ceiling on any catalog-derived denominator.
- **Code READMEs** — a disjoint artifact class owned by the code-README coverage track.
- **The Gate-3 parser fix itself** — the escalated defect is reproduced and adjudicated here, but the runtime fix
  belongs under `system-spec-kit` (its runtime, its blast radius). See §5 and child `002`.
- Expanding the automated 117-combination executor matrix into manual scenarios.

### Files to Change

Summary for audit trail only; per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Create | 001 | Operator-contract validator, `--strict` default-on |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/` | Create | 001 | Paired positive/negative fixtures per check |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` | Modify | 001 | Promote §7 Manual Checks to Automated Checks; record the corpus ruling |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | Modify | 001 | Remove `PARTIAL`; derived-census language |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs` | Modify | 001 | Strict-default; boundary handling if the ruling moves files |
| `.opencode/skills/sk-doc/shared/scripts/` | Create/Modify | 001 | Single-definition-site count-derivation helper |
| `.opencode/skills/*/manual-testing-playbook/manual-testing-playbook.md` (11 roots) | Modify | 001 | Derived census, verdict-enum migration, index repair |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/**/[0-9]*-*.md` (10 files) | Rename | 001 | Numeric-prefix removal, link-safe, IDs unchanged |
| `.opencode/skills/sk-git/manual-testing-playbook/**` | Modify | 002 | Tier 1/2 remote-push and worktree-allocator repairs |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/**` | Modify | 002 | Gate-3, context-save, resume, review-handoff repairs |
| `.opencode/skills/{cli-external-orchestration,sk-doc,sk-code,sk-design,mcp-tooling,mcp-code-mode,sk-prompt,system-skill-advisor}/manual-testing-playbook/**` | Modify | 002 | Tier 3/4 dispatch, route-shape, and dead-path repairs |
| `.opencode/skills/{cli-external-orchestration,system-deep-loop,system-spec-kit,sk-code,sk-design,sk-doc,sk-git,system-skill-advisor}/manual-testing-playbook/**` | Create | 003 | ~25-35 new operator scenarios |
| CI / pre-push wiring | Modify | 001 | Run the new validator fail-closed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All
> implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-playbook-standard-and-fleet-normalization` | Keystone. Settle the corpus-split and verdict rulings, build the operator-contract validator, derive the coverage map, normalize all 11 roots. 19 findings. | Planned |
| 2 | `002-scenario-accuracy-repair-risk-first` | Repair scenarios that would fail on execution or teach a hard-rule violation, in four risk tiers: remote publication, unisolated mutation, external dispatch and safety gates, stale contracts. 19 findings. | Planned |
| 3 | `003-uncovered-workflow-authoring` | Author the scenarios the derived coverage map proves are owed: external executors, end-to-end loops, public mutating tools, declared-but-unauthored features. 13 findings. | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume sk-doc/024-playbook-scenario-coverage/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- Ordering is risk-first, not gap-first: `002` (scenarios that actively teach a violation) precedes `003`
  (scenarios that are merely absent).

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Validator exists and is fail-closed in CI; verdict enum migrated; the link/path resolver is available as the mechanical backstop for repaired files | Seeded-violation test exits non-zero; `grep -l PARTIAL` over the 11 roots returns nothing; resolver runs clean over an unrepaired file and reports its known bad paths |
| 001 | 003 | The derived uncovered-inventory report exists and is reproducible from live registries | Re-running the derivation on an unchanged tree produces a byte-identical report |
| 002 | 003 | Tier 1-4 repairs landed and each repaired scenario executed once for real | Run artifacts present under `<skill>/benchmark/reports/<dated-run>/`; resolver returns zero unresolvable cited paths |
| 003 | close | Uncovered inventory reduced to the ruled-empty set; every residual carries a not-applicable-because record | Report diff plus `validate-playbook-package.cjs --strict` green on every new file |
<!-- /ANCHOR:phase-map -->

---

## DISPOSITIONS — NOTHING SILENTLY DROPPED

The research loop produced 52 active findings and 2 refuted. 51 are allocated to a child's scope table. The
remaining active finding and both refutations are recorded here so no item is dropped without a reason.

| Item | Disposition |
|------|-------------|
| **`RD-007-03`** — `sk-prompt-models` has no `manual-testing-playbook/` package | **Not placed in a child.** The fact is confirmed; the obligation is not. The governing standard states that a missing playbook directory is not automatically a defect, and applicability is behavior-based: a feature owes a scenario when it is operator-visible, integration-critical, release-gating, or orchestration-shaped. The packet holds 5 model profiles and already ships a `benchmarks/` tree. **OPERATOR-DECISION Q5** owes the ruling. If ruled *owed*, this becomes a fourth Lane-D item in child `003` at an estimated 4-6 scenarios and this row is replaced by a scope-table row. If ruled *not owed*, child `001` records the exemption in the `sk-prompt` playbook root so the question stops recurring at every audit. |
| **`RD-007-05`** (refuted) — `skill_graph_propagate_enhances` uncovered | **Do not resurrect.** Operator coverage exists cross-playbook under another hub. Its residual — whether cross-hub coverage should be indexed from the owning hub, moved, or declared dependency-owned — is folded into child `001` Lane A as a secondary ruling under the discriminator decision. |
| **`RD-008-01`** (refuted) — Codex parity targets absent hooks | **Do not resurrect.** The adapters and all four compiled lifecycle hooks exist at HEAD. The surviving defect is the missing non-mutating `--check` scenario, carried as `RD-005-05` in child `002` Tier 2. |
| **WS1 `F-030-01`, `F-030-02`, `F-030-03`, `F-026-06`** | **Not re-filed.** Adjacent by path, outside this packet's frozen 11-directory manifest. Coordination only: `F-030-03` is the same defect class as this packet's verdict-enum findings, so WS1 should **consume** child `001`'s normalizer rather than hand-fix its own root. |
| **Catalog-completeness defects** cited by a playbook root as a coverage denominator | **Belong to the feature-catalog integrity track.** Consumed here as a known ceiling: child `001` Lane C derives its denominator from live registries and treats the catalog as a widening-only cross-check. |
| **The 117-combination executor matrix** | **Not a manual-coverage claim.** Carried as `RD-005-06` in child `003` Lane A explicitly as the guardrail against expanding it into 117 scenarios. |

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

All seven are **OPERATOR-DECISION** items surfaced by the synthesis. Each names the child element it gates. The
recommendation column is the synthesis author's; the operator makes the call.

| # | Question | Gates | Recommendation |
|---|----------|-------|----------------|
| **Q1** | Shared count-derivation helper — who builds it? Three tracks and one WS1 packet all need "derive counts from a registry and fail on mismatch". | `001` Lane B/D helper location; a single-definition-site test | Build once in `sk-doc/shared/scripts/`, by whichever child lands first, imported by the rest. Do not let three copies ship. |
| **Q2** | Corpus split — frontmatter discriminator, or move Corpus B to a fixtures tree? | `001` Lane A ruling; the topology gate's boundary; the Lane-C loader | **Discriminator, not a move.** A move is a cutover touching the gate and the benchmark loader in one commit; the discriminator is reversible and keeps Lane C green. |
| **Q3** | Who owns cross-skill end-to-end workflow scenarios? | `003` Lane B placement; the cross-playbook ID-uniqueness assertion | The hub owning the user-facing command. One execution-truth owner per workflow; everyone else links. |
| **Q4** | **Gate-3 D/E amendment decision** (see §5), plus: is the absent `.cursor/hooks/git-preflight-advisory.mjs` an intentional relocation or an implementation gap the playbook must expose? | **Blocks the `RD-003-02` scenario rewrite in `002` Tier 3**, and gates `RD-006-04` authoring | Reproduce first, then adjudicate under `system-spec-kit`. Do not rewrite the scenario until the ruled behavior exists to certify. |
| **Q5** | Does `sk-prompt-models` owe a playbook package? | The `RD-007-03` disposition above; possibly a fourth Lane-D item in `003` | Either answer is fine; record it either way. |
| **Q6** | Phase-qualification — is this program ≥ 25/50 complexity? The synthesis reads ~30-33. | Whether this stays a phase parent or collapses to one Level-3 packet with three lanes | Keep the phased structure. If scored below 25, collapse to a single Level-3 packet with three lanes; content unchanged. |
| **Q7** | State `system-spec-kit` **NOT READY** explicitly in its root, rather than quietly repairing it? | `001` Lane D reclassification; `RD-003-06` | State it explicitly. Its root permits a READY claim while two mapped scenarios record live contrary results. |
<!-- /ANCHOR:questions -->

---

## 5. ESCALATION — `RD-003-02` IS A LIVE SAFETY-GATE DEFECT

Recorded at the parent because it is the only item in this packet whose resolution is not a documentation change.

The Gate-3 hook **displays** `D) Use a phase folder (e.g. .opencode/specs/<parent>/<NNN-phase>, name it)` and
`E) Skip`, matching the stable A-E contract. The same source file's answer parser carries a standalone-`D`
predicate and a comment stating that D is special-cased to always be the SKIP option, never a folder-binding
target. An operator who reads the displayed menu and answers **D** intending "use a phase folder" is therefore
parsed as having chosen **skip**. The playbook scenario that should have caught this recorded **PASS** against
stale captured evidence.

**Confirmed vs inferred.** The displayed string and the parser comment are **confirmed in source** — both were
re-read at HEAD during authoring of this spec. The runtime behavior is **inferred from the source** and has
**not** been reproduced by executing the parser against a `D` answer.

**Required sequence, enforced by child `002`:**

1. **Reproduce first.** A dedicated task executes the parser against a bare `D` answer and captures the actual
   parse result before anything else moves.
2. **AMENDMENT-DECISION gate.** Under the Logic-Sync Protocol this is a contradiction between two authorities in
   the same file. The correct move is an operator amendment decision opened under `system-spec-kit`, not a
   workaround inside a documentation packet. **OPERATOR-DECISION Q4.**
3. **The scenario rewrite is blocked on that decision.** Only after adjudication does `002` rewrite the scenario
   as a five-option round trip — displayed label, parsed result, bound write boundary, skip behavior, and the
   child-session exemption — on every supported hook adapter, so it certifies the ruled behavior rather than
   re-certifying the contradiction.

**This packet does not draft the parser fix.** Its deliverables are the reproduction, the escalation, and the
post-adjudication scenario.

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md, checklist.md
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer
- **Governing standard**: `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`
- **Run-evidence home**: `sk-doc/021-benchmark-naming-and-playbook-results` (Complete)
