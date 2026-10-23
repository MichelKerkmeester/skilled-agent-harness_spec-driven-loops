---
title: "Implementation Plan: Phase 6: sk-code-ci-surface"
description: "Creates the read-only sk-code-ci surface packet and registers it in the two-axis sk-code hub: the rule data, the protected set, the message-contract exception and the scaffold templates, then the registry, router, ROUTER.md projection, generated manifests, docs, canary, compiled-route test and playbook scenario, proved by the hub's own gates."
trigger_phrases:
  - "sk code ci surface plan"
  - "phase 6 sk code ci surface plan"
  - "sk-code-ci registration plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: sk-code-ci-surface

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON and YAML data; Node.js CJS for the guards and tests; no build step |
| **Framework** | sk-code two-axis parent hub: `mode-registry.json` selects the packet, `hub-router.json` scores the route, `ROUTER.md` maps the leaves |
| **Storage** | None; the packet is reference data on disk and the generated artifacts are `leaf-manifest.json` and `graph-metadata.json` |
| **Testing** | `parent-skill-check.cjs`, `verify-router-sync.cjs`, `node --test` compiled-route suites, the canary harness, the playbook router replay and `validate.sh --strict` |

### Overview
The phase adds one read-only surface packet and then makes the hub aware of it in every place the hub records a packet. The packet is authored first, because `parent-skill-check` check 3c fails a registry entry whose folder is missing. Registration is additive: every task inserts `sk-code-ci` and preserves the entries already present, so the phase survives `specs/sk-code/013-private-surface-skills/002-hub-surface-removal` landing before or after it. The proof is the hub's own battery, not a new test harness.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The rule sources are read and anchored (`final-review.md:430-457`, `research.md:214-241`)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] `parent-skill-check.cjs`, `run-all-drift-guards.sh`, the compiled-route suites and `validate.sh --strict` all pass from the final state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-driven two-tier hub with a read-only evidence surface. The hub tier owns `SKILL.md`, `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `description.json`, `graph-metadata.json` and the generated `leaf-manifest.json`. The packet tier owns `sk-code-ci/` with its own `SKILL.md`, `README.md`, `changelog/`, `references/` and `assets/`. The packet carries no `graph-metadata.json`, so the advisor still discovers exactly one `sk-code` identity.

### Key Components
- **`sk-code-ci/SKILL.md`**: the surface contract and the packet-local `DEFAULT_RESOURCE`, `INTENT_SIGNALS` and `RESOURCE_MAP` that the router parser reads.
- **`references/ci-workflow-standards.md`**: the rule index, so a reader lands on the normative statement before the evidence.
- **`references/trigger-and-filter-rules.md`**: the twin rule, the rebuild-skip rule, push-only scope and R23's message-contract exception.
- **`references/job-shape-rules.md`**: timeouts, permissions, concurrency, the composite action and the switch `if:` shape.
- **`references/protected-set.md`**: the protected-by-function set that `/doctor:ci scaffold` and review must refuse to weaken.
- **`assets/workflow-template.yml`** and **`assets/job-block-template.yml`**: the scaffold templates phase 009 reads.
- **Hub registration**: `mode-registry.json` (surface entry), `hub-router.json` (tie-break, signals, vocabulary), `ROUTER.md` §11, `description.json`, the generated manifests and the guard's surface lists.

### Data Flow
A prompt mentioning a GitHub Actions workflow scores the `code-ci-aliases` and `code-ci-runtime` vocabulary classes, and the hub bundles `sk-code-ci` as evidence beside the acting workflow mode. The acting mode reads the packet's `SKILL.md`, which maps the matched intent to the four references. `/doctor:ci scaffold` reads the two `assets/` templates. Nothing in the packet writes; the acting mode or the doctor command performs any write.

### Component Diagram
```
┌──────────────────────────────────────────────────────────────────────┐
│  .skilled/skills/sk-code/  (hub tier)                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────┐  │
│  │ mode-registry    │  │ hub-router.json  │  │ ROUTER.md          │  │
│  │ modes[] + axis   │  │ tieBreak/signals │  │ INTENT + RESOURCE  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └─────────┬──────────┘  │
│           │                     │                      │             │
│           └──────────┬──────────┴──────────┬───────────┘             │
│                      ▼                     ▼                         │
│         ┌────────────────────┐   ┌──────────────────────┐            │
│         │ leaf-manifest.json │   │ graph-metadata.json  │            │
│         │ (generated)        │   │ (generated + prose)  │            │
│         └─────────┬──────────┘   └──────────┬───────────┘            │
└───────────────────┼─────────────────────────┼────────────────────────┘
                    │                         │
                    ▼                         ▼
      ┌──────────────────────────┐   ┌──────────────────────────┐
      │ verify-router-sync.cjs   │   │ compiled-routing policy  │
      │ legs 1a,1b,2,3,4         │   │ activation manifest      │
      └────────────┬─────────────┘   └────────────┬─────────────┘
                   │                              │
                   ▼                              ▼
      ┌──────────────────────────┐   ┌──────────────────────────┐
      │ sk-code-ci/SKILL.md      │   │ canary case + twin       │
      │ CI_WORKFLOW -> 4 refs    │   │ compiled-route test      │
      └────────────┬─────────────┘   └──────────────────────────┘
                   │
                   ▼
      ┌──────────────────────────────────────────────────────┐
      │ sk-code-ci/references/  (four rule files)            │
      │ sk-code-ci/assets/      (two scaffold templates)     │
      │ sk-code-ci/manual-testing-playbook/ci-surface/       │
      └──────────────────────────────────────────────────────┘
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-code/mode-registry.json` | The single registry the hub routes by; it declares three surfaces at planning time | Update: add the `sk-code-ci` entry and surface-axis membership | `node -e` prints `sk-code-ci` among `modes[].workflowMode` and `extensions.surface-axis.surfaces` |
| `.skilled/skills/sk-code/hub-router.json` | Lexical scoring and tie-break; five signals today | Update: tie-break slot, `routerSignals` entry, two vocabulary classes | `node -e` prints `true` for membership and ordering ahead of `sk-code-skilled` |
| `.skilled/skills/sk-code/ROUTER.md` | Stage-two leaf map; the parent `RESOURCE_MAP` is the union of the surface maps | Update: `CI_WORKFLOW` in `INTENT_SIGNALS` and `RESOURCE_MAP` | `verify-router-sync.cjs --checks 2` passes |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Hard-codes the surfaces whose maps are unioned (`SURFACES` at `:33`) | Update: add `sk-code-ci` to both lists | The same leg 2 command names the packet in its PASS line |
| `.skilled/skills/sk-code/leaf-manifest.json` | Generated inventory of every routed leaf | Regenerate | `generate-leaf-manifest.cjs --check` exits 0 and the manifest has a `sk-code-ci` mode |
| `.skilled/skills/sk-code/graph-metadata.json` | Generated skill-graph identity for the hub | Regenerate; hand-own `causal_summary` | `ci-skill-derived-freshness.cjs` exits 0 |
| `.skilled/skills/sk-code/description.json` | Hub keywords; check 5k-packet requires every packet name to be a keyword | Update | `node -e` prints `true` for `keywords.includes('sk-code-ci')` |
| `.skilled/skills/sk-code/SKILL.md`, `README.md`, `shared/README.md`, `feature-catalog/`, `phase-detection.md` | Prose that lists or counts surfaces | Update to the count the registry declares | `verify-doc-claims.cjs --checks surfaces` passes |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | 18 cases; check 5k-canary requires a case per router signal | Update: one CI case, then copy to the authored twin | `parent-skill-check.cjs` passes `5k-canary`; `cmp` exits 0 |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Compiled-route surface-hint suite | Update: one CI assertion | `node --test` passes |
| `.github/workflows/message-contract.yml` | Every-branch push trigger, correct as written | Unchanged | `git diff --exit-code -- .github/workflows/message-contract.yml` exits 0 |
| `.github/workflows/*.yml` (all others) | The evidence the rule data cites | Unchanged | `git status --porcelain -- .github/workflows` names only this phase's spec folder, no workflow |

Required inventories:
- Same-class producers: `node -e "console.log(require('./.skilled/skills/sk-code/mode-registry.json').modes.map(m=>m.workflowMode+':'+m.packetKind).join('\n'))"` lists every mode and its axis; the new entry must match the `surface` shape at `.skilled/skills/sk-code/mode-registry.json:14-19`.
- Consumers of the changed names: `rg -n "sk-code-(webflow|skilled|obsidian)|surfaceBundle|tieBreak" .skilled/skills/sk-code .skilled/bin .skilled/commands/doctor --glob '!**/changelog/**' --glob '!**/benchmark/**'` names every document and guard that must learn the new name.
- Matrix axes: ordering state (pre- or post-`013/002`) x D1 form (A `[skip ci]` or B push-only filters) x D2 form (PR-only or main cancellation). Six required rows: pre/A/PR, pre/B/PR, post/A/PR, post/B/PR, pre/A/main, post/A/main.
- Algorithm invariant: registration is additive. For every mode `m` present in `scratch/registration-before.json`, `m` is present after the phase; no removed example surface is re-added; `sk-code-ci` is present in `modes`, `surfaces`, `tieBreak`, `routerSignals` and `description.keywords` in every row of the matrix.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Packet, Registration, Verification and Closure phase checkboxes and task state.

| Plan phase | Tasks | Exit condition |
|------------|-------|----------------|
| Setup | T001 to T006 | The baseline, the pattern inputs, the pre-phase registration JSON, the ordering state, the ten source anchors and the consumer inventory are recorded in `scratch/` |
| Packet | T007 to T019 | The packet folder is complete and parses; its four references are routed by its own map; the R23 exception and the playbook scenario exist |
| Registration | T020 to T058 | Every hub artifact names `sk-code-ci`; the generated artifacts are regenerated by their generators; the canary, the compiled-route test and the compiled policy carry the new route |
| Verification | T059 to T065 | The durable-directory manifest is regenerated, `parent-skill-check`, the drift guards, the compiled-route suites, the scope proof and `validate.sh --strict` pass |
| Closure | T066 to T068 | The phase commit carries the packet, the closure commit carries the acceptance rows, the registration snapshot and the phase result, and `scratch/phase-result.md` carries every gate output and the follow-up |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The packet's router block and its four references resolve; the new canary case parses | `node -e`, `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` |
| Integration | Registry to router to leaf manifest to `ROUTER.md` union; the surface count wording | `verify-router-sync.cjs`, `verify-doc-claims.cjs`, `parent-skill-check.cjs` |
| Contract | The packet is a read-only evidence base; the changelog and version agree; the message-contract exception is present | `parent-skill-check.cjs` legs 3g, 5k, 5l, 13b, 13d |
| Regression | The existing compiled-route, canary and playbook routing still resolves the other surfaces | `node --test .skilled/bin/tests/compiled-route-*.test.cjs`, `run-all-drift-guards.sh` |
| Manual | Read the packet as a reviewer: does it state each rule with its evidence and its refusal boundary | Operator read of `SKILL.md` and the four references |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-rebuild-fanout-removal` (D1 answer) | Internal phase | Green | That phase freezes Option A as its default, so T002 records `d1: A` and T011 writes the token form; the rest of the packet is independent |
| `004-setup-caching-provisioning` (R12 and R14) | Internal phase | Yellow | T002 records `composite_action: absent` and T012 writes `status: proposed`; AC-011 checks the status against the tree |
| `specs/sk-code/013-private-surface-skills/002-hub-surface-removal` | Sibling packet | Yellow | The registration tasks insert rather than rewrite; T003 and T004 record the pre-phase state; T064 re-runs the proof and T067 writes the follow-up |
| `gh` with `repo` | External CLI | Green | Only the ruleset read is lost; the required-context rationale is already in `research.md:94` |
| Advisor daemon | Local runtime | Yellow | `ci-router-vocabulary-reach.cjs` is optional; the canary leg is the required reachability proof |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the hub gates stay red after T060 to T065 with no scoped repair, or the registration conflict with `013/002` cannot be resolved additively.
- **Procedure**: `git revert` the phase commit. The packet folder, its registry entry, the generated manifests, the canary case, the compiled-route test case and the playbook scenario all disappear together, because they are one commit. Regenerate `leaf-manifest.json` and `graph-metadata.json` from the reverted registry, then re-run `parent-skill-check.cjs` and `run-all-drift-guards.sh` to confirm the hub is back to its pre-phase state.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Packet) ──► Phase 3 (Registration) ──► Phase 4 (Verify) ──► Phase 5 (Closure)
Phase 1.5 (Inputs) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Packet, Registration |
| Inputs (002/004; D1/D2 defaults) | External phases and frozen defaults | Setup's `[B]` tasks only |
| Packet | Setup | Registration |
| Registration | Packet | Verify |
| Verify | Registration | Closure |
| Closure | Verify | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| Packet | Medium | 3-5 hours |
| Registration | Medium | 2-4 hours |
| Verification | Low | 1-2 hours |
| Closure | Low | 0.5 hour |
| **Total** | | **7-12.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable; the tree is version-controlled and the phase is one commit
- [ ] Feature flag configured - not applicable; the packet is additive and the advisor identity does not change
- [ ] Monitoring alerts set - the hub gates are the monitoring

### Rollback Procedure
1. Immediate action - stop the registration tasks; do not push a partial registration.
2. Revert code - `git revert <phase-commit>`; do not hand-delete the packet folder, because the registry and manifests would still name it.
3. Verify rollback - `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` both exit 0.
4. Notify stakeholders - if the phase was already handed to `009-doctor-ci-review-wiring`, tell that phase the templates are gone.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; generated files are regenerated from the reverted registry
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │────►│   Phase 4   │
│   Setup     │     │   Packet    │     │Registration │     │   Verify    │
└─────────────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
                           │                   │                   │
                    ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
                    │ 002 / 004   │     │ 013/002     │     │  Phase 5    │
                    │  Inputs     │     │ Ordering    │     │  Closure    │
                    └─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet folder | Setup | `sk-code-ci/` with SKILL, README, references, assets | Registration |
| Registry entry | Packet folder | `mode-registry.json` surface entry | Router, leaf manifest, docs |
| Router entry | Registry entry | `hub-router.json` tie-break, signals, vocabulary | Canary, compiled-route test |
| `ROUTER.md` projection | Packet folder | `CI_WORKFLOW` in both maps | Router-sync leg 2 |
| Generated manifests | Registry and router | `leaf-manifest.json`, `graph-metadata.json` | Router-sync leg 3, derived freshness |
| Canary case | Router entry | `canary-cases.v1.json` plus twin | `parent-skill-check` 5k-canary |
| Docs and version | Registry entry | Hub docs, counts, `2.4.0.0` release | Doc-claims and version parity |
| Verification | All of the above | Gate outputs in `scratch/phase-result.md` | Closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T007 to T019 - author the packet** - 3-5 hours - CRITICAL, because check 3c needs the folder before the registry entry.
2. **T020 to T026 - registry, tie-break, signals and vocabulary** - 1-2 hours - CRITICAL, because every generated artifact reads them.
3. **T028 to T034 - ROUTER.md, guard lists and generated manifests** - 1-2 hours - CRITICAL, because the union and bijection legs read all three.
4. **T053 to T058 - canary, compiled-route test and compiled policy** - 1-2 hours - CRITICAL, because the canary leg and the surface-hint suite read them.
5. **T060 to T065 - hub gates and validator** - 1-2 hours - CRITICAL, because the phase cannot close on a red gate.

**Total Critical Path**: 7-12 hours

**Parallel Opportunities**:
- T010 to T013 (the four references) can be authored in any order once T007 fixes the intent name.
- T036 to T052 (hub prose and counts) can run after T020 while T028 to T034 are in progress.
- T053 and T055 (canary and compiled-route test) can run after T024, in parallel with the generated artifacts.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline and inputs recorded | T001 to T006 done; `scratch/` holds the five baseline files, `pattern-inputs.md` with a `d1:` and a `d2:` line, the two registration snapshots, `ordering-state.md`, ten `ANCHOR ` lines and eleven consumer rows | Phase 1 exit |
| M2 | Packet complete | T007 to T019 done; the packet parses, its four references are routed by its own map, the exception row exists and the playbook scenario declares four leaves | Phase 2 exit |
| M3 | Registration complete | T020 to T058 done; every hub artifact names `sk-code-ci`, the generators have run, and the canary, the compiled-route test and the compiled policy carry the new route | Phase 3 exit |
| M4 | Gates green | T059 to T065 done; parent-skill prints its seven PASS lines with only `12-lib` failing, the drift guards exit 0, the suites exit 0, the scope proof prints nothing and `validate.sh --strict` prints `RESULT: PASSED` | Phase 4 exit |
| M5 | Handoff ready | T066 to T068 done; the phase commit and the closure commit carry the phase, and `scratch/phase-result.md` carries every output plus the follow-up line | Phase 5 exit |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

The formal records, with context, constraints, alternatives, five checks and the gated tasks for each choice, are `decision-record.md` ADR-001 to ADR-010. This table is the one-screen index.

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | A read-only surface packet, not a workflow mode | The rules are evidence two acting modes consume, and a surface's tool set is the only one that matches the job |
| ADR-002 | Additive registration with a before and after snapshot | `specs/sk-code/013-private-surface-skills/002-hub-surface-removal` edits the same five files, and insertion is the only order-independent operation |
| ADR-003 | The message-contract exception lives in rule data | The workflow is correct as written; the reader needs the standard, not a YAML comment |
| ADR-004 | The playbook scenario lives in the packet, not the hub playbook | Router-sync leg 4 only walks packet-level playbooks, so a hub-level scenario would pass without being replayed |
| ADR-005 | The rebuild-skip rule records the sibling default and names the alternative once | The form is `002-rebuild-fanout-removal`'s to choose; this phase records one actionable rule |
| ADR-006 | `CI_WORKFLOW` is a shared intent key mirrored in both maps | Leg 2 keys the union by intent, so the packet map and the parent projection must carry the same four paths |
| ADR-007 | The hub release is `2.4.0.0`, with `2.5.0.0` as the collision fallback | The smallest truthful version, with a mechanical escape when another phase took the minor |
| ADR-008 | The rule data is split by rule family across four references | Each intent loads only its family, and the index stays short |
| ADR-009 | The rule data cites workflow files, never `specs/` paths | The packet ships in a skill package, where `specs/` does not exist |
| ADR-010 | Generated artifacts are written only by their generators | Four freshness checks compare the committed file with a fresh regeneration |

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read `tasks.md` and confirm the task id, its file, its exact change and its proof command.
- [ ] Re-read the file the task edits; confirm the quoted anchor is still on the named line.
- [ ] Confirm the task is not `[B]`; if it is, record the blocker and stop before editing.
- [ ] Confirm the edit is additive: no existing mode, surface, canary case or doc row is removed.

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Run T001 to T068 in order. No task is `[B]`, because both defaults are recorded. |
| TASK-SCOPE | Write only the files named by the task. `.github/workflows/**`, `.github/scripts/**` and `.github/actions/**` are read-only in this phase. |
| TASK-PROOF | Run the task's proof command and read both its output and its exit status before marking the task `[x]`. |
| TASK-GENERATED | `leaf-manifest.json`, `graph-metadata.json`, the Hermes copy and the compiled-route manifest are written by their generators, never by hand. |
| TASK-COMMENT | No code comment added by this phase carries an R-id, a D-id or a phase number. |

### Status Reporting Format
After each task: `Task T### complete. Files: <paths>. Proof: <command> -> <observed output/exit>.` At a phase boundary, report the task range, the files changed and the gate that passed.

### Blocked Task Protocol
If a task cannot run, stop and record the blocker in `scratch/phase-result.md` with the task id, the command that failed and its output. Do not substitute a different file or a different command. A `[B]` task whose dependency is another phase stays blocked until that phase's proof exists; a failed gate is repaired, not waived.

---

## Implementation Notes

- **No operator decision is carried.** This phase makes no choice of its own. D1 is read from `002-rebuild-fanout-removal`. D2 is an operator decision in the parent spec, recorded as `pr-only` on 2026-10-23; the concurrency template records that value.
- **No ephemeral ids in code.** The packet's `SKILL.md`, JSON comments and template comments must not name an R-id, a D-id or a phase number. The durable WHY stays; the packet id does not enter the code. Spec documents may cite them.
- **D1 is read, not decided.** T002 reads `### Implementation Notes` in `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/plan.md`. That note freezes Option A, the `[skip ci]` token in the commit body, as its default and names Option B, the 8-entry push-only form, as the alternative. T002 writes `d1: A` or `d1: B`, and T011 writes the matching section. No task blocks.
- **D2 is recorded from the operator's answer, not decided here.** T002 writes `d2: pr-only` (2026-10-23), the recorded PR-only value, `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`, and names `cancel-in-progress: true` on main as the alternative. No sibling phase is read for that value.
- **The composite action is proposed, not landed.** `.github/actions/setup/action.yml` is absent on this commit and `check-gate-inputs.sh` names `github/actions` zero times, so T002 records `composite_action: absent` and T012 writes `status: proposed` with the `final-review.md:344-360` citation. When `004-setup-caching-provisioning` has landed, T002 records `present` and T012 writes `status: landed`. AC-011 is the check that the status matches the tree.
- **The playbook scenario lives in the packet.** `verify-router-sync.cjs` leg 4 walks `<packet>/manual-testing-playbook/` only, so a scenario in the hub playbook would never be replayed and the gate would pass vacuously. The scenario sits at `sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md`, with packet-relative `expected_resources`. ADR-004 records the choice.
- **`CI_WORKFLOW` is mirrored, not invented twice.** The packet's `RESOURCE_MAP` and the parent `ROUTER.md` `RESOURCE_MAP` carry the same four paths under the same key, the parent with a `sk-code-ci/` prefix. Leg 2 compares them, and its failure text names the key. ADR-006 records the choice.
- **The rule data records; it does not apply.** The timeout formula, the permissions shape and the switch shape are written as rules for `007-workflow-hygiene-on-off-control` to apply. No workflow file changes in this phase.
- **R23's report half lands in phase 009.** This phase records the exception in a machine-greppable row. `009-doctor-ci-review-wiring` reads it; its acceptance criterion is where the report behaviour is proved.
- **The benchmark tree is frozen.** `benchmark/README.md` records that the Lane C harness is retired and no new run can start. The playbook scenario is the routing evidence this phase adds; no benchmark report is fabricated.
- **The worktree is not provisioned.** `parent-skill-check` leg `12-lib` fails on `@spec-kit/shared/frontmatter/parse-frontmatter.js` before this phase starts. T001 records that failure as the baseline and T060 treats `12-lib` as the only allowed FAIL line. `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .` is the repair, and it writes outside this phase's scope.
- **Ordering with `013/002`.** Preferred order is `013/002` first. If this phase lands first, `013/002` must preserve `sk-code-ci` in `extensions.surface-axis.surfaces`, `routerPolicy.tieBreak`, the `ROUTER.md` union and the `SKILL.md` surface sentence. T003, T004, T064 and T067 make the state explicit.

---
