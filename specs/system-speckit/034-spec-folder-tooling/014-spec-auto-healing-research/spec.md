---
title: "Feature Specification: Spec auto-healing research"
description: "This branch changed the spec folder tooling and is repairing all 4,371 packets with one-off scripts and worker lanes. This phase researches how to harden those changes and how to heal old-format and pre-v4 spec folders automatically, so external repos on older versions are not left with a failing corpus."
trigger_phrases:
  - "spec auto healing research"
  - "phase 14 spec auto healing research"
  - "pre-v4 spec folder migration"
  - "spec corpus healing tooling"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Spec auto-healing research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-07 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-corpus-wide-validation-repair |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` ranks evidence-cited recommendations for all five questions, each with its effort, risk and the files it touches. This packet passes strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the spec folder tooling parent. Phases 6 to 12 changed the tooling, and Phase 13 is repairing the whole corpus with one-off scripts and worker lanes. The operator asked how to make that work permanent and how to spare external users on older versions the same repair.

**Scope Boundary**: read-only research. Every write lands inside this packet. No tool, template or packet outside it changes.

**Dependencies**:
- The branch commits in `git log origin/main..HEAD` and the uncommitted Phase 13 state.
- Phase 13's one-off scripts, lane briefs and rule-by-rule failure reports in the orchestrating session's scratchpad.
- Three executors through the `/deep:research` fan-out: cli-pi, cli-devin and cli-codex.

**Deliverables**:
- A 15-iteration research run per executor, with its state and iteration files under `research/lineages/`.
- `research/research.md`: the merged synthesis with ranked recommendations and the orchestrator's own verification.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A baseline over all 4,371 packets found 2,046 failing strict validation, most of them archived packets whose recorded paths went stale when they were moved. Phase 13 is clearing that debt with one-off scripts and 43 worker lanes, so the fixes live in a scratchpad and nothing stops the same failures from coming back. An external repo still on an older layout or older templates would meet the same wall with none of that help.

### Purpose
Find the source of each failure class and name which fixes should become permanent idempotent tooling and where. Then design a safe detect, dry run and apply path for older repos that never changes what a document says.

### Research Findings

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Source of truth: `research/research.md`. Three lineages ran 15 iterations each (45 in total) and answered all five questions. The orchestrator re-read every load-bearing claim, refuted three and downgraded four.

- Archive moves are the largest producer. `archive.sh` never re-derives a moved packet's recorded paths, and five tools hold five different archive policies. The operator must choose current-location or snapshot semantics.
- Two scaffold defects mint failures in new packets. The core spec template nests the NFR, edge-case and complexity sections inside the `questions` anchor (549 files today), and `create.sh --phase` exits before graph-metadata derivation.
- The healers write what the checkers reject. `heal-spec-docs.cjs` refills judge-rejected default phrases, and two tools stamp template versions onto documents that never came from them.
- `upgrade-legacy.mjs` is the pre-v4 path, but nothing calls it and `/doctor:update` covers `.skilled/` only.
- The trigger-index rebuild keeps a bypass token in git config while it runs repository code, stages one of four outputs and runs without `set -e`.
- Top fixes, all small: SH-01 template anchor, SH-02 phase scaffold finalizer, SH-03 archive policy with re-derive on move, SH-04 rebuild workflow, SH-05 healer phrases.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every change this branch made to the spec folder tooling and corpus: commits `4b33313bd4c` to `d727cf94fe1`, and the uncommitted Phase 13 repair with its scripts, lane briefs and failure reports.
- The existing tools a permanent fix would extend: `validate.sh` and its rules, `create.sh`, `archive.sh`, `repair-derived.cjs`, `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, `migrate-generated-json.ts`, the phrase census and cleanup pair, `check-template-staleness.sh`, the templates, `/doctor:update`, `/doctor:speckit` and the CI workflows.
- Five questions: permanent tooling, root causes, pre-v4 detection and migration, hardening the branch's own changes and CI or pre-commit placement.
- A `/deep:research` fan-out of three 15-iteration lineages: DeepSeek V4.1 Flash on cli-pi, SWE-2 Max on cli-devin and GPT-6 Luna at max reasoning on the fast tier through cli-codex.
- A merged `research/research.md` with ranked recommendations, each citing `file:line` with its effort, risk and files touched.

### Out of Scope
- Changing any tool, template, workflow or packet. Every recommendation goes to a follow-up packet the operator approves.
- Running any repair tool or the validator against the corpus. Phase 13's repair lanes are editing `specs/` during this run, so the research reads source and recorded reports only.
- The Claude 5.5 roster commits, which touch no spec tooling.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `014-spec-auto-healing-research/spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` | Modify | Fill the scaffold from what the research did |
| `014-spec-auto-healing-research/research/` | Create | Config, the three lineages, merged registry, resource map and `research.md` |
| `014-spec-auto-healing-research/description.json`, `graph-metadata.json` | Modify | Regenerated by the single-folder generators |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the three executors runs all 15 iterations through the `/deep:research` fan-out, with convergence recorded as telemetry only |
| REQ-002 | `research/research.md` answers all five questions with ranked recommendations, each naming its effort, risk, files touched and evidence |
| REQ-003 | No write lands outside this packet, and no git write runs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The orchestrator checks every load-bearing executor claim against the source and records which it confirmed, downgraded or refuted |
| REQ-005 | Every recommendation states whether it is idempotent, how it is reversed and whether it could change what a document says |
| REQ-006 | This packet passes strict validation |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A follow-up packet can take the ranked table in `research/research.md` and build its top items without re-reading the corpus.
- **SC-002**: Every claim the synthesis relies on carries a `file:line` citation the orchestrator read.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 13 repair lanes edit `specs/` during the run | A cited working-tree line can move between two reads | Executors cite `git show HEAD:` for committed content and say when a citation is a working-tree line |
| Risk | Executors report claims they did not check | High | The orchestrator re-reads every load-bearing citation and downgrades what it cannot confirm |
| Risk | The fan-out snapshots dirty files into each lineage's `containment/` directory | Med | Containment runs in its default preserve mode, which never reverts, and the copies are deleted after the run |
| Risk | A save step writes the parent packet's metadata | Med | `generate-context.js` is skipped and this packet's metadata is refreshed with the single-folder generators |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The three lineages run concurrently, one process per executor, within the fan-out's four-hour lineage timeout.
- **NFR-P02**: No executor runs a whole-corpus validation or repair, which would cost minutes per run and collide with the repair lanes.

### Security
- **NFR-S01**: No secret appears in a prompt, a steer file or any written file.
- **NFR-S02**: Executor children run with the child-dispatch environment (`SYSTEM_SPEC_GATE_ENFORCE=0`, `AI_SESSION_CHILD=1`) and closed stdin.

### Reliability
- **NFR-R01**: Each lineage writes its state through the append gateway, so a failed iteration is recorded rather than lost.
- **NFR-R02**: The merged synthesis states its stop reason as `maxIterationsReached` for every lineage.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A cited line in a file the repair lanes are editing: the citation names the working tree, and the orchestrator re-reads it before relying on it.
- An executor citing a scratchpad file: the citation uses the absolute scratchpad path, which is read only.

### Error Scenarios
- An executor fails or times out: the fan-out retries the lineage up to three times and the report names the failure.
- Two lineages disagree: the synthesis records both sides in its divergence map with the orchestrator's ruling and the line it read.

### State Transitions
- A lineage converges early: convergence is telemetry only under the max-iterations stop policy, so the lineage widens to the next question instead of stopping.
- The run is interrupted before synthesis: the lineage state files keep every finished iteration, and a later synthesis reads them in place.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Read-only, but the evidence spans the spec CLI, the validator, templates, doctor commands, CI and a 4,371-packet corpus |
| Risk | 8/25 | No production write. The live repair lanes are the only collision risk |
| Research | 18/20 | Five questions, three executors and 45 iterations to review |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which archive semantics should hold: current-location, which the research recommends, or snapshot with a validator exemption? SH-03 waits on this.
- How protected are `skilled/**` branches? The rebuild token risk depends on it, and the research did not check branch protection.
- Should `ANCHORS_VALID` tighten to order and nesting, knowing it regrades historical packets, or should the docs narrow to what the code checks?
- Is "implementation summary status follows spec.md" a derived fact a tool may write, or a conflict that stays reported?
- Does anything outside `.skilled/` rely on `check-template-staleness.sh --auto-upgrade` before it is retired?
<!-- /ANCHOR:questions -->
