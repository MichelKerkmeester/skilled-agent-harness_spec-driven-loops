---
title: "Feature Specification: Phase 7: fix-deep-review-p2-findings-for-plan-check-builds"
description: "This phase turns the finished deep review's actionable P2 findings into exact, reviewable edits and closes its two deferred path-trust checks. It preserves the single-executor workflow, uses existing validators, and regenerates compiled contracts from maintained sources."
trigger_phrases:
  - "fix deep review p2 findings for plan check builds"
  - "phase 7 fix deep review p2 findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: fix-deep-review-p2-findings-for-plan-check-builds

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-repair-speckit-workflow-gates |
| **Successor** | None |
| **Handoff Criteria** | The exact edit packets apply cleanly, the specified contract generators and suites pass, the current status carriers agree, and strict validation prints RESULT: PASSED. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Remediate the twelve P2 findings and two deferred security checks of the five-iteration deep review specification.

**Scope Boundary**: Apply only the edit packets in this folder to their named source and packet files. Start by resolving SL-203 and SL-204. Do not change the refusal error wording, run the Vitest suites during packet authoring, or hand-edit generated contracts.

**Dependencies**:
- The findings and deferred checks are recorded in `../review/review-report.md`, sections 3, 4, 6 and 8.
- Findings 002–006 are current child packets; the changed status documents must be re-read when their tasks run.
- The contract generator, existing validator, and listed unit/stress suites are available in the repository.

**Deliverables**:
- Exact, task-ordered edit packets under `scratch/`, one per source edit.
- A predicate and supported value forms for the one-lineage opt-in, with unit coverage.
- The existing Claude config-directory root validator reused by the direct deep-review `:auto` path, with unit coverage.
- Consistent policy wording, generated contracts, status records, and shared shell text.
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The finished review found a duplicated loop-type allowlist, an undocumented one-lineage opt-in whose value form is refused, and an unvalidated Claude config directory in the direct review path. It also found stale policy wording, an unowned generated-contract drift fix, a checklist contradiction, status drift, and a duplicated authoring-card sentence.

### Purpose
Make every reviewed finding traceable to a deterministic edit and verification command while preserving existing workflow behavior outside the scoped changes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The current one-lineage guard rejects explicit string values, and the direct review auto path forwards its optional config directory. `parseArgs` at `fanout-run.cjs:105-120` stores a bare flag as Boolean `true` and consumes a following non-flag token as a string value. The shell sentence occurs at two echo sites. This baseline was observed with:

```text
Command: rg -n -F -e 'args.allowSingleLineage !== true' -e 'parentEnv.CLAUDE_CONFIG_DIR = configDir;' -e 'echo "    0. Read .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md before you write a document"' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh
.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2207:        echo "    0. Read .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md before you write a document"
.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2416:    echo "    0. Read .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md before you write a document"
.skilled/commands/deep/assets/deep-review-auto.yaml:1293:              parentEnv.CLAUDE_CONFIG_DIR = configDir;
.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3402:    && args.allowSingleLineage !== true) {
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record SL-203 as safe and SL-204 as unsafe based on current schema, expansion, runner and single-executor path evidence; add the smallest SL-204 fix and a focused test.
- Make the refusal predicate use `ACTIVE_FANOUT_LOOP_TYPES`, accept only Boolean `true` and string values `true` or `1`, and test unsupported values remain refused.
- Document refusal and opt-in behavior; name `config.maxIterations`, reword every maintained `--executors` carrier, and regenerate both compiled contracts with their generator.
- Reconcile the listed packet status carriers, record the deep-ai-council generated drift fix in child 002, and make the create.sh prompt sentence single-source without changing output.

### Out of Scope
- Changing the fan-out refusal message; it continues to name neither the opt-in flag nor a lineage count, and the documentation must say so.
- Hand-editing generated contracts, implementing this plan while authoring it, modifying the finished review report, or changing unrelated files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Modify | Use the active type set, accept the documented opt-in values, export the existing configDir validator. |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | Modify | Cover explicit opt-in values, unsupported value refusal, and configDir allowed/rejected roots. |
| .skilled/commands/deep/assets/deep-review-auto.yaml | Modify | Validate optional `configDir` before setting `CLAUDE_CONFIG_DIR`. |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md | Modify | Document refusal, opt-in, bypassed workflow stages, and message limitation. |
| .skilled/commands/deep/research.md | Modify | Clarify runner flag, policy, and `config.maxIterations` binding. |
| .skilled/commands/deep/review.md | Modify | Clarify runner flag, policy, and `config.maxIterations` binding. |
| .skilled/commands/deep/assets/deep-research-presentation.txt | Modify | Reword the executor row and name the exact iteration config field. |
| .skilled/commands/deep/assets/deep-review-presentation.txt | Modify | Reword the executor row and name the exact iteration config field. |
| .skilled/commands/deep/assets/compiled/deep-research.contract.markdown | Regenerate | Regenerate from maintained research sources. |
| .skilled/commands/deep/assets/compiled/deep-review.contract.markdown | Regenerate | Regenerate from maintained review sources. |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Modify | Hoist the repeated authoring-card sentence into one readonly variable. |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/spec.md | Modify | Record the existing deep-ai-council compiled-contract refresh as generated drift. |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/tasks.md | Modify | Reconcile CHK-012 and record its verified evidence. |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md | Modify | Reconcile continuity and closeability after CHK-012 passes. |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md | Modify | Reconcile checklist count, evidence and Draft status. |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/spec.md | Modify | Reconcile completed phase rows and advance the resume pointer. |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds/spec.md | Create | Record scope, requirements, safe/unsafe path dispositions and evidence. |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds/plan.md | Create | Order the bounded implementation and its verification. |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds/tasks.md | Create | List every edit, check, generator and test command in order. |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds/acceptance-criteria.md | Create | Define the closure evidence for each requirement. |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds/scratch/edit-T002.txt through edit-T029.txt | Create | Store exact, ordered source replacements; edit-T029 is a T005 test-path follow-up. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The one-lineage refusal is derived from `ACTIVE_FANOUT_LOOP_TYPES`; its opt-in accepts bare Boolean `true`, separate string `true`, or separate string `1`, and rejects all other supplied values. | The focused runner unit file passes; its value cases prove `true` and `1` proceed and `false` refuses before side effects. |
| REQ-002 | Direct deep-review `:auto` configDir input is checked by the existing `validateClaudeConfigDir` rule before `CLAUDE_CONFIG_DIR` is set. | The focused unit file accepts home and repo-local `.claude*` roots and rejects a path outside both; the runner and YAML binding use the same validator. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Maintained command pages and presentation assets identify `config.maxIterations`, explain executor routing, and document refusal and opt-in; generated contracts come only from the two named generator commands. | The generator tasks pass; source and generated contract searches show the intended field and routing wording, and no contract is hand-edited. |
| REQ-004 | Status carriers and shell output are reconciled without changing unrelated packet state or changing the authoring-card sentence's printed bytes. | Child 006 has the corrected CHK-012 and consistent closeout carriers; the parent phase map matches the completed child evidence; the two shell echo sites print the single shared value. |
| REQ-005 | The two command contracts are regenerated and every named unit, stress, card-sync and strict-validation command passes in the required order. | T029–T036 exit 0, and T036 prints an explicit `RESULT: PASSED` line. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ACTIVE_FANOUT_LOOP_TYPES.has(loopType)` guards the refusal, with unit coverage for accepted `true` and `1` values and refused unsupported values.
- **SC-002**: `validateClaudeConfigDir` is applied before the review auto path assigns `CLAUDE_CONFIG_DIR`; tests distinguish home/repo roots from an outside path.
- **SC-003**: Each maintained policy carrier states the one-lineage and two-or-more destinations and binds `iterations` to `config.maxIterations`; both generated contracts match their maintained inputs.
- **SC-004**: The authoring-card sentence has one shell owner while both echo branches retain the same output bytes, and the status docs agree with observed checks.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The existing `validateClaudeConfigDir` helper and command-contract compiler own their respective path and generated-contract rules. | Recreating either rule could drift from current policy or produce stale output. | Export and reuse the helper; run each specified `--write` generator after maintained source edits. |
| Risk | Tests can accidentally inherit process environment or mistake an unsupported flag string for an allowed opt-in. | A permissive guard could bypass the single-executor workflow's packet init, synthesis and save phases. | Keep values strict and add explicit `true`, `1`, `false`, plus path-root cases to the focused unit file. |


### Deferred Path Review Dispositions

| Finding | Disposition | Source evidence |
|---------|-------------|-----------------|
| SL-203 lineage label containment | **SAFE; no source edit.** `parseFanoutConfig` validates the fan-out config at `executor-config.ts:1046-1049` and the `executors` schema at `:909-910`. The label pattern at `:820` and schema at `:849-852` permit only a lowercase letter or digit followed by lowercase letters, digits or hyphens. `expandLineages` at `:1158-1167` preserves a validated base label or appends a hyphen and replica number; `fanout-run.cjs:3575` then joins that label beneath `lineagesDir`. The caller cannot supply a slash, dot segment or path separator through the label schema. |
| SL-204 Claude configDir restriction | **UNSAFE in direct review `:auto`; reuse the validator.** `fanout-run.cjs:682-705` restricts resolved config directories to a top-level `.claude` or `.claude-*` under home or cwd; fan-out reuses it at `fanout-run.cjs:3693-3694`. The review `:auto` branch reads the optional placeholder at `deep-review-auto.yaml:1263`, validates it at `:1264`, and assigns the validated value to `CLAUDE_CONFIG_DIR` at `:1293-1294`. The research `:auto` branch has no corresponding optional configDir binding or environment assignment. Export the existing validator, apply it in review `:auto`, and test both allowed roots plus an outside-root rejection; no new rule is needed. |

### Re-read Status Dispositions

- R3-P2-001 is **dropped**: child 004's current summary says to close AC-002 using the captured run at line 83, while its AC-002 row is Met and the packet is Complete/Closeable (`004-name-file-in-plan-phase-lines/implementation-summary.md:83`; `acceptance-criteria.md:47,61,86`). The stale-closure finding no longer holds, so no edit is planned there.
- R3-P2-002 is **narrowed**: children 002–004 report Complete/Closeable Yes; child 005 remains Draft with AC-001 Unmet; child 006 records 28/28 P0/P1 checklist items and Closeable Yes while retaining Draft status; child 007 remains pending. The parent phase map then marked phases 5–7 Pending and resumed at phase 5. Since closed: children 002 to 007 are Complete and the parent map marks every phase Complete.

### Synthesis Follow-up

The closing Opus synthesis (`../synthesis.md`) found four defects after remediation. Each is fixed in this phase:

- **P1, config directory.** The review workflow expands `~` before it calls `validateClaudeConfigDir`, and the shared namespace guard refused any absolute path outside the repository. The documented `--config-dir=~/.claude-account2` therefore failed. The validator now skips that guard for an absolute path, and its own root check still refuses anything outside `~/.claude*` or a repository `.claude*` folder (`edit-T030.txt`, `edit-T031.txt`).
- **P2, runner-only flag.** The `/deep:research` and `/deep:review` flag tables listed `--allow-single-lineage`, which the workflow never reads. The rows are gone, and the policy paragraph no longer names the flag (`edit-T032.txt` to `edit-T035.txt`).
- **P2, router verbs.** Six write verbs on IMPLEMENT could outscore PLAN. They now form a WRITE intent at weight 1 that loads only the card (`edit-T036.txt` to `edit-T038.txt`).
- **P2, status records.** This phase's acceptance metadata and the parent's resume line and child count are reconciled.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — this change adds no service or request-time operation outside existing path validation.
- **NFR-P02**: N/A — no throughput surface is changed.

### Security
- **NFR-S01**: Direct review configDir is restricted to the existing home or repo-local `.claude*` roots before the environment variable is assigned.
- **NFR-S02**: The runner opt-in remains strict; unsupported values retain refusal-before-side-effects behavior.

### Reliability
- **NFR-R01**: N/A — the change does not provide a service with an uptime objective.
- **NFR-R02**: N/A — no service error-rate surface is changed.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: absent `--allow-single-lineage` preserves refusal for a one-lineage research or review matrix.
- Maximum input: the existing maximum fan-out branch count and path-root rules remain owned by the current schema and validator; this phase adds no new maximum.
- Failure path: explicit `false`, another unsupported value, or a configDir outside both approved roots fails closed before spawn or environment forwarding.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Several existing runner, command, presentation, catalog and packet status carriers; no new runtime layer. |
| Risk | 18/25 | Path trust and fail-closed CLI behavior require focused regression evidence. |
| Research | 15/20 | Findings require cross-reading source, generated contracts and changed status records. |
| **Total** | **53/70** | **Level 2**; scoped remediation with verification across existing contracts. |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The supplied `scratch/phase-facts.md` has no section for this folder. Direct re-reads of the cited source lines and current carrier searches support the dispositions above.
- Resolved: the replay mismatches for `edit-T014.txt`, `edit-T015.txt`, `edit-T019.txt`, `edit-T024.txt` and `edit-T028.txt` are settled under CHK-002 in `tasks.md`. Each applied byte-exact, and child 006's later closeout rewrote the same lines.
<!-- /ANCHOR:questions -->

---
