---
title: "Decision Record: sk code ci surface"
description: "The ten design choices this phase freezes: the read-only surface packet, the additive registration, the message-contract exception in rule data, the packet-local playbook scenario, the recorded rebuild-skip default, the shared CI_WORKFLOW intent key, the 2.4.0.0 release, the four-reference split, the workflow-file-only citations and the generator-only artifacts. No operator decision gates this phase."
trigger_phrases:
  - "sk code ci surface decision record"
  - "read-only surface packet adr"
  - "additive hub registration adr"
  - "message contract exception adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface"
    last_updated_at: "2026-10-23T15:10:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded ten proposed ADRs for the planned phase"
    next_safe_action: "Run the phase's tasks from T001"
    blockers:
      - "004-setup-caching-provisioning has not landed; .github/actions/setup/action.yml is absent"
      - "specs/sk-code/013-private-surface-skills/002-hub-surface-removal is Draft and edits the same registration files"
      - "The worktree is not provisioned, so parent-skill-check leg 12-lib fails before this phase starts"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-006-sk-code-ci-surface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: sk code ci surface

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> **No operator decision gates this phase.** R22 and R23 change no workflow, no repository variable and no repository setting. D1 (the rebuild-skip form) is read from `002-rebuild-fanout-removal`'s `### Implementation Notes`. D2 (main-branch cancellation) is an operator decision in the parent spec, recorded as `pr-only` on 2026-10-23; the concurrency template records that value. Every ADR below is a design choice this plan makes, not a question for the operator.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: A read-only surface packet, not a workflow mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-001-context -->
### Context

The CI rules are stack knowledge consumed by two acting modes: authoring under `sk-code-skilled` and review under `sk-code-review`. The hub already distinguishes a workflow mode, which acts, from a surface packet, which supplies evidence (`mode-registry.json:6-15`). A workflow mode for CI would have to own either implementation or review, and both contracts already exist.

### Constraints

- The hub defines a surface as `packetKind: surface`, `backendKind: evidence-base`, `routingClass: metadata` and `mutatesWorkspace: false` (`mode-registry.json:14-19`).
- A surface's tool set forbids Write and Edit, so the packet cannot scaffold even if a caller asks it to.
- The advisor routes one identity, `sk-code`; a surface is advisor-invisible and reached only by hub bundling.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `sk-code-ci` is a `packetKind: surface` entry with `backendKind: evidence-base`, `routingClass: metadata`, `mutatesWorkspace: false` and `allowed-tools: [Read, Bash, Grep, Glob]`.

**How it works**: the hub scores a CI prompt, keeps the workflow mode first and appends `sk-code-ci` as read-only evidence. The acting mode reads the packet's `SKILL.md`, which maps `CI_WORKFLOW` to the four references. The packet never writes.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A read-only surface packet (chosen)** | Fits the existing surface contract, adds no advisor identity, and the hub already bundles evidence | The packet cannot scaffold; the write belongs to a later doctor route | 9/10 |
| A `sk-code-ci` workflow mode | One entry instead of a bundled pair | Duplicates the authoring and review contracts, and a mode that cannot write still cannot scaffold | 4/10 |
| A standalone skill | Independent release cadence | The advisor gains a second code identity, which the hub's surface axis exists to prevent | 3/10 |

**Why this one**: the packet shape is the one the hub already proves for three surfaces, and it is the only shape whose tool set matches the job: supply rules, never edit a workflow.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A workflow-YAML review can bundle CI evidence as a second target instead of falling back to `UNKNOWN`.
- The hub gains no new advisor identity and no new primary mode, so existing routes keep their order.

**What it costs**:
- The packet cannot scaffold. Mitigation: `/doctor:ci scaffold` in `009-doctor-ci-review-wiring` reads the two templates and performs the write.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later contributor adds Write to the packet's tool set | H | Check `3g` fails any surface that is not read-only, and it runs in T060 |
| The packet is bundled where no workflow mode scores | M | The engine does not defer a bare surface prompt, whatever `routerPolicy.defaultMode` (`null`) suggests: `add a timeout to the ci workflow` resolves to `single` `[sk-code-ci]` and `implement a new function in the typescript module` to `single` `[sk-code-skilled]`, both observed 2026-10-24 and both true before this phase's routing change. A surface with no scoring workflow mode therefore acts alone as read-only evidence, which is the native surface's behavior too |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nine rule families have no written home today, and `.github/` is not a stack marker, so a workflow diff reviews as `UNKNOWN` |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes compared, including a workflow mode and a standalone skill |
| 3 | **Sufficient?** | PASS | One packet with four references and two templates covers all ten rule families |
| 4 | **Fits Goal?** | PASS | It is R22, the recommendation the final review ranks tenth and assigns to this phase |
| 5 | **Open Horizons?** | PASS | The same shape carries a future rules family without a registry change beyond one vocabulary class |
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/mode-registry.json`: the `sk-code-ci` entry and its surface-axis membership.
- `.skilled/skills/sk-code/sk-code-ci/SKILL.md`: the frontmatter that declares the read-only tool set.

**Gated tasks**: T007, T020, T021.

**How to roll back**: delete the registry entry, the surface-axis member and the packet folder. The hub returns to three surfaces and no route names the packet.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Additive registration with a recorded pre-phase snapshot

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-002-context -->
### Context

`specs/sk-code/013-private-surface-skills/002-hub-surface-removal` is a Draft phase that removes `sk-code-webflow` and `sk-code-obsidian` from `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md` and the canary fixture. Both phases edit the same five files, and either can land first. That phase's own spec states the removal is a rewrite of the same arrays.

### Constraints

- The sibling phase is Draft today, and both example surfaces exist on disk, so this phase runs against the five-mode, three-surface shape.
- A wholesale rewrite of an array from a remembered shape drops whichever entries the other phase added.
- `parent-skill-check` `5e` fails when `tieBreak` does not cover every registered mode, so an insertion that loses an entry is caught, but only after the damage.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: every registration task inserts `sk-code-ci` into the array or object it finds and replaces nothing. T003 records the pre-phase mode set, T004 records whether the sibling phase has landed, and T064 compares the after snapshot with the before snapshot.

**How it works**: `scratch/registration-before.json` holds the five arrays and the canary count. `scratch/registration-after.json` holds the same fields after the registration. T064 prints seven booleans: every before entry still present, and `sk-code-ci` present in each of the five lists.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Additive insert with a before and after snapshot (chosen)** | Works in both orders, and the snapshot proves nothing was lost | One extra re-run when the sibling phase lands later | 9/10 |
| Wait for the sibling phase unconditionally | One order only, so one rewrite | The final review says this phase may be drafted from the start, and the packet content does not depend on the removal | 5/10 |
| Rebuild each array from a template | Deterministic shape | Drops whichever entries the other phase added, and silently re-adds a removed surface if the template is stale | 2/10 |

**Why this one**: insertion is the only operation whose result is independent of the order the two phases land in, and the snapshot is the evidence a reviewer needs to believe it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The phase works in both orders, at the cost of one re-run of T064.
- The pre-phase snapshot is the evidence that no mode or surface was lost.

**What it costs**:
- One extra scratch file and one comparison task. Mitigation: both live in `scratch/` and are deleted with the phase if it is reverted.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The sibling phase rewrites the files after this phase lands | H | T067 writes the follow-up line naming the four files that phase must preserve |
| A registration task edits a line the sibling phase already changed | M | Every task quotes its anchor and stops when the anchor is absent |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both phases edit the same five files, and the sibling phase is a removal by rewrite |
| 2 | **Beyond Local Maxima?** | PASS | Three orders compared: insert, wait, rebuild |
| 3 | **Sufficient?** | PASS | A before snapshot, an after snapshot and one comparison answer the whole question |
| 4 | **Fits Goal?** | PASS | REQ-009 is exactly this invariant |
| 5 | **Open Horizons?** | PASS | The same snapshot pattern serves any later phase that adds a surface |
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `scratch/registration-before.json` and `scratch/registration-after.json`: the two snapshots.
- Every registration task from T020 to T052: insertion only.

**Gated tasks**: T003, T004, T020 to T052, T064, T067.

**How to roll back**: delete the inserted entries. The snapshots are evidence, not state, so they can stay or be removed with `scratch/`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The message-contract exception lives in rule data

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-003-context -->
### Context

`message-contract.yml:2-7` explains that every local gate can be skipped by a machine without the hooks or by `--no-verify`, and `:9` sets `branches: ['**']` so the workflow sees every pushed branch. `.github/workflows/README.md:73` records the same reason and notes that fork branch names and Dependabot descriptions are exempt. Every other push workflow targets `main` and `skilled/**`, so the trigger reads as drift to a reader who does not know the reason.

### Constraints

- The workflow is correct as written; narrowing the trigger would stop checking branch names on every other pushed branch.
- This phase makes no workflow change, so the exception cannot be a YAML comment.
- The later `/doctor:ci report` must be able to tell a deliberate trigger from drift without reading the workflow's prose.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: record the exception as one table row labelled `intentional-exception` in `references/trigger-and-filter-rules.md`, citing `message-contract.yml:9` and `.github/workflows/README.md:73`, and state that no YAML change is made.

**How it works**: the row is a stable, greppable label. `009-doctor-ci-review-wiring` reads the label and suppresses the drift flag for that workflow. The workflow's bytes never change.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A labelled row in rule data (chosen)** | One grep away from the rule it qualifies, and machine-readable by label | The reader must open the packet to see it | 9/10 |
| A comment in `message-contract.yml` | Visible where the trigger is | This phase would edit a workflow, and the workflow already explains itself at `:2-7` | 4/10 |
| Narrow the trigger to `main` and `skilled/**` | Matches the norm | Stops checking branch names on every other pushed branch, which is the workflow's purpose | 1/10 |

**Why this one**: the workflow is right and the reader is wrong, so the correction belongs in the standard, not in the file.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The report route can suppress a false drift flag with one label read.
- The workflow keeps its required-context behaviour and its every-branch coverage.

**What it costs**:
- The exception is invisible to someone who reads only `.github/workflows/`. Mitigation: the row cites both workflow lines, so the reader can follow it back.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later edit narrows the trigger and leaves the row stale | M | T017 greps `branches: ['**']` in the workflow as part of its check |
| The report route ignores the label | L | Phase 009's acceptance criterion names the read; this phase records the label in the shape that criterion greps |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | R23 exists because the trigger reads as drift, and phase 009 would flag it |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared, including editing the workflow |
| 3 | **Sufficient?** | PASS | One labelled row plus two citations states the exception and its reason |
| 4 | **Fits Goal?** | PASS | It is R23, and it changes no workflow |
| 5 | **Open Horizons?** | PASS | The label is the pattern for any later deliberate exception |
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md`: the `## Intentional exceptions` section.

**Gated tasks**: T017.

**How to roll back**: delete the section. No other file changes, because the workflow is never edited.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The packet's playbook scenario lives in the packet, not the hub playbook

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-004-context -->
### Context

`verify-router-sync.cjs` leg 4 replays every playbook scenario that declares `expected_intent`. `playbookScenarios()` walks each directory under the hub root and looks for `<packet>/manual-testing-playbook/`; a scenario in the hub-level `.skilled/skills/sk-code/manual-testing-playbook/` is never reached, because that directory has no packet-level playbook inside it. A hub-level scenario would therefore pass the gate without ever being replayed.

### Constraints

- Leg 4 resolves `expected_resources` against the packet root, so a hub-level scenario's paths would have to be prefixed with the packet name and would still never be read.
- The hub playbook's §19 table and its `Total scenarios` and `Categories` counts are hand-maintained, so a hub-level scenario costs three extra edits.
- `parent-skill-check` `9a` only requires a `manual-testing-playbook/` directory, which the hub already has.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: put the scenario in `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md`, with a packet-level index at `manual-testing-playbook/manual-testing-playbook.md` and packet-relative `expected_resources`.

**How it works**: `playbookScenarios()` reaches the packet directory, reads the frontmatter, skips the index by name, and replays the scenario against the packet's own `SKILL.md` router block. The four declared leaves must be emitted, so the replay proves the packet's map and its files agree.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A packet-local scenario (chosen)** | Leg 4 actually replays it, and the paths stay packet-relative | The hub playbook gains no row | 9/10 |
| A hub-level scenario with prefixed paths | Visible in the hub playbook's §19 index | Leg 4 never reaches it, so the gate passes vacuously; three extra hand-maintained edits | 3/10 |
| No playbook scenario | One less file | R22's routing evidence rests on the canary and the compiled-route test alone, and leg 4 stays as vacuous as it is today | 5/10 |

**Why this one**: a proof that cannot fail is not a proof. The packet-local location is the only one the replay reads.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Leg 4 gains its first non-vacuous packet scenario for this hub, so a broken packet map fails the gate.
- The hub playbook's hand-maintained counts stay untouched.

**What it costs**:
- The hub playbook does not list the CI scenario. Mitigation: the packet README and `SKILL.md` name the playbook, and the packet index lists the category.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The scenario is named `README.md` and the replay skips it | M | T018 and T019 name the files explicitly, and T062 fails when leg 4 finds no scenario |
| A declared leaf is not emitted by the packet map | M | T019 lists the same four paths T007 and T030 use |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it, leg 4 has no scenario for this hub and cannot fail |
| 2 | **Beyond Local Maxima?** | PASS | Three locations compared against the guard's own walk |
| 3 | **Sufficient?** | PASS | One scenario with four leaves covers the packet's routing map |
| 4 | **Fits Goal?** | PASS | REQ-005 asks for the playbook evidence |
| 5 | **Open Horizons?** | PASS | A second category can be added under the same packet playbook without touching the hub |
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md`: the index.
- `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md`: the scenario.

**Gated tasks**: T018, T019, T062.

**How to roll back**: delete `sk-code-ci/manual-testing-playbook/`. Leg 4 returns to its pre-phase state.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The rebuild-skip rule records the sibling default and names the alternative once

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-005-context -->
### Context

D1 asks how a rebuild commit skips CI. `002-rebuild-fanout-removal/plan.md` freezes Option A, a `[skip ci]` token in the commit body, as its default and names Option B, a push-only `paths-ignore` form with 8 entries across 13 files, as the alternative. This phase records the rule that future workflows follow; it does not choose the form.

### Constraints

- A rule that records two forms as equal leaves the reader unable to say what to do.
- A rule that records only one form hides the alternative a later reader may need.
- The form is decided in 002, and this phase must not pre-empt that decision.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: record the form T002 reads from 002's notes, with the other form named in one line and the reason the recorded form was chosen.

**How it works**: T002 writes `d1: A` or `d1: B` from 002's notes. T011 writes the matching section. When 002 has already run and recorded a different answer, T002 records that answer instead, and the rule follows it.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Record the read form and name the other once (chosen)** | One actionable rule, and the alternative stays visible | The rule changes if 002 answers differently | 9/10 |
| Record both forms as an unresolved branch | No dependency on 002 | A reader cannot tell what to do, and the rule ages into a menu | 4/10 |
| Choose the form here | One less dependency | Pre-empts a decision this phase does not own | 2/10 |

**Why this one**: a rule is a decision, and this phase may record one only because 002 already made it.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The packet states one rebuild-skip form, with the reason and the alternative beside it.
- The rule follows 002 rather than competing with it.

**What it costs**:
- T002 must read another phase's plan. Mitigation: 002's notes freeze a default, so the read always returns a value.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| 002 later answers B after this phase recorded A | M | T011 names B in one line, so the correction is one edit, not a rewrite |
| 002's notes move | L | T002 greps `Option A` and stops when the line is absent |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | R22's rule data must state the rebuild-skip form, and the form is not this phase's to choose |
| 2 | **Beyond Local Maxima?** | PASS | Three treatments compared, including recording both |
| 3 | **Sufficient?** | PASS | One recorded form plus one named alternative is enough to act on |
| 4 | **Fits Goal?** | PASS | REQ-002 asks for the rebuild-skip rule in D1's chosen form |
| 5 | **Open Horizons?** | PASS | The same record-a-default pattern serves D2 and the timeout floor |
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `scratch/pattern-inputs.md`: the `d1:` line.
- `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md`: the `## Rebuild commits` section.

**Gated tasks**: T002, T011.

**How to roll back**: delete the section. The rest of the rule data stands.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: `CI_WORKFLOW` is a shared intent key mirrored in both maps

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-006-context -->
### Context

`verify-router-sync.cjs` leg 2 requires the parent `ROUTER.md` `RESOURCE_MAP` to equal the union of every surface's map plus the parent tier. The union is keyed by intent, so a packet intent key that the parent lacks makes leg 2 report `parent map CI_WORKFLOW is missing child path`. The packet's own map and the parent's projection must therefore carry the same four paths under the same key.

### Constraints

- The parent `INTENT_SIGNALS` keys and `RESOURCE_MAP` keys are independent dictionaries; the guard reads both maps, not the signals.
- The packet's `RESOURCE_MAP` paths are packet-relative; the parent's are prefixed with `sk-code-ci/`.
- A new intent key adds one scoring row to the hub's surface router, which changes no workflow mode's score.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: add one intent key, `CI_WORKFLOW`, to the packet's `INTENT_SIGNALS` and `RESOURCE_MAP` and to the parent's `INTENT_SIGNALS` and `RESOURCE_MAP`, with the parent holding the same four paths under the `sk-code-ci/` prefix.

**How it works**: T029 adds the signal to both files' keyword sets through the parent only, because the packet's signal lives in its own `SKILL.md`; T030 adds the four prefixed paths to the parent map. Leg 2 compares the packet's four relative paths, re-prefixed, against the parent array.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One new `CI_WORKFLOW` key mirrored in both maps (chosen)** | The packet's intent is readable, and leg 2 stays exact | Two edits must agree on four paths | 9/10 |
| Reuse an existing key such as `IMPLEMENTATION` | No new key | CI rules would load on every implementation prompt, which is the over-trigger the multi-word keywords exist to prevent | 3/10 |
| Add the parent key and skip the packet key | One less edit | Leg 2 reports a missing child path, and the packet's own replay cannot select the intent | 2/10 |

**Why this one**: the intent is real and narrow, and mirroring it is what makes the union check meaningful rather than vacuous.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- A CI prompt selects a CI intent and loads only the CI references.
- Leg 2 proves the parent projection equals the packet map for the new key.

**What it costs**:
- One more intent row in a 21-key dictionary. Mitigation: the row carries weight 4 and multi-word keywords only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The parent array and the packet array drift | M | T030 and T032 both run leg 2, which names the key in its failure text |
| A bare `workflow` keyword over-triggers | M | Every keyword is multi-word; T029's check compares the list with T020's aliases |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without the key, either the packet map is unreachable or the parent map is missing its child paths |
| 2 | **Beyond Local Maxima?** | PASS | Three key strategies compared |
| 3 | **Sufficient?** | PASS | One key with four paths on each side satisfies leg 2 |
| 4 | **Fits Goal?** | PASS | REQ-004 names both maps and the union |
| 5 | **Open Horizons?** | PASS | The same shape carries a second CI intent if one is ever needed |
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/ROUTER.md`: the `CI_WORKFLOW` row in `INTENT_SIGNALS` and the array in `RESOURCE_MAP`.
- `.skilled/skills/sk-code/sk-code-ci/SKILL.md`: the packet's own `CI_WORKFLOW` row and array.

**Gated tasks**: T007, T029, T030, T032.

**How to roll back**: delete the two parent rows and the packet's two rows. Leg 2 returns to its pre-phase union.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: The hub release is `2.4.0.0`, with `2.5.0.0` as the collision fallback

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-007-context -->
### Context

The hub version is `2.3.0.0` in `SKILL.md:5`, `mode-registry.json:3`, `hub-router.json:3` and `description.json:3`, and `changelog/v2.3.0.0.md` is the newest entry. `parent-skill-check` `13a-version` requires the three JSON files to carry the `SKILL.md` version, and `13b-version` requires `SKILL.md` to match its newest changelog entry. A new surface is a minor change to the hub.

### Constraints

- The version is four-part, so the next minor after `2.3.0.0` is `2.4.0.0`.
- A second in-flight phase can cut the same minor, and two changelog files cannot share a name.
- All four fields must change together or `13a-version` fails.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: cut `2.4.0.0` in all four fields and write `changelog/v2.4.0.0.md`. When that changelog already exists, cut `2.5.0.0` in all four fields instead and record the reason in `scratch/phase-result.md`.

**How it works**: T042 reads the four fields, sets them together, and prints one version repeated four times. T043 writes the matching changelog, and `13b-version` proves the file name and the field agree.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`2.4.0.0` with a `2.5.0.0` fallback (chosen)** | One read decides it, and the fallback is mechanical | The fallback needs a recorded reason | 9/10 |
| Always `2.5.0.0` | No read needed | Skips a minor and makes the changelog history lie about a release that never happened | 5/10 |
| No version bump | One less edit | `13d-packet-version` and the hub release contract expect a packet release to be a hub release | 2/10 |

**Why this one**: the smallest truthful version, with a deterministic escape when another phase took it.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- The four fields, the changelog and the packet changelog all agree.
- A collision costs one extra changelog name, not a re-plan.

**What it costs**:
- One more changelog file in the hub. Mitigation: it is the release note a reader expects.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Another phase cuts `2.4.0.0` mid-flight | M | T042's check fails on a disagreeing set, and the fallback is one edit in four places |
| `13d-packet-version` fails because the packet version and its changelog disagree | L | T009 and T007 set `0.1.0.0` in both places |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A new surface is a hub release, and three gates read the version |
| 2 | **Beyond Local Maxima?** | PASS | Three version strategies compared |
| 3 | **Sufficient?** | PASS | One minor with one fallback covers every collision the tree can present |
| 4 | **Fits Goal?** | PASS | REQ-008 asks for a coherent release |
| 5 | **Open Horizons?** | PASS | The next surface repeats the same read-then-cut step |
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `SKILL.md:5`, `mode-registry.json:3`, `hub-router.json:3` and `description.json:3`: the version field.
- `changelog/v2.4.0.0.md`: the release note.

**Gated tasks**: T042, T043.

**How to roll back**: restore `2.3.0.0` in the four fields and delete the changelog file.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: The rule data is split by rule family across four references

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-008-context -->
### Context

R22 names ten rule families: the twin rule, the rebuild-skip rule, push-only scope, timeout sizing, least privilege, the concurrency template, the composite action, the switch shape, the protected set and the scaffold templates. One document holding all ten would be read end to end for any one of them, and the packet's router maps intents to references, so a single document would make every intent load everything.

### Constraints

- The packet's `RESOURCE_MAP` maps intent keys to reference paths, so a coarse split defeats the map.
- The hub's `sk-code-obsidian` surface uses one reference per topic, which is the shape a reader of this hub expects.
- The three workflow-doctrine docs are symlinks and carry no CI rule.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: four references split by rule family: `ci-workflow-standards.md` for the index and the cross-cutting rules, `trigger-and-filter-rules.md` for triggers, twins and the exception, `job-shape-rules.md` for timeouts, permissions, concurrency, the composite action and the switch, and `protected-set.md` for the protected-by-function list.

**How it works**: `ci-workflow-standards.md` is the `DEFAULT_RESOURCE`, so a reader lands on the normative table first and follows a row to the detail. The other three are the `CI_WORKFLOW` leaves.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four references by rule family (chosen)** | Each intent loads only its family, and the index stays short | Four files to keep consistent | 9/10 |
| One reference for all ten families | One file to read | Every intent loads everything, and the index and the detail compete for the same page | 4/10 |
| Ten references, one per family | Maximum precision | Most families are one table row, and ten files make the map unreadable | 5/10 |

**Why this one**: four is the smallest split where each file answers one question a reader actually asks.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- A reader asking about a trigger lands on trigger rules, not on timeout arithmetic.
- The router map has four leaves, which is the same shape the existing surface uses.

**What it costs**:
- One cross-reference from the index to each detail file. Mitigation: the index table's rows name the detail file.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A rule is duplicated in two files and drifts | M | Each family has one owner file, and the index states the rule in one row with a link |
| A reference is not routed and leg 1b reports an orphan | M | T007's map names all four, and T061 runs leg 1b |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Ten families in one file make every intent load all ten |
| 2 | **Beyond Local Maxima?** | PASS | Three splits compared: one, four and ten |
| 3 | **Sufficient?** | PASS | Four files cover all ten families with no orphan |
| 4 | **Fits Goal?** | PASS | REQ-002 asks for the ten families with citations, and REQ-004 asks for four routed leaves |
| 5 | **Open Horizons?** | PASS | A fifth family becomes a fifth file plus one map row |
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- Four files under `.skilled/skills/sk-code/sk-code-ci/references/`.
- The packet `SKILL.md` map and the parent `RESOURCE_MAP` row that name them.

**Gated tasks**: T010 to T013, T007, T030.

**How to roll back**: delete the four references. The packet then has no rule data and T060's `3g` still passes, because the surface contract does not count references.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: The rule data cites workflow files, never `specs/` paths

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-009-context -->
### Context

The packet ships inside `.skilled/skills/sk-code/`, which a clone may copy or vendor without this repository's `specs/` tree. A rule that cites `specs/system-speckit/053-ci-workflow-efficiency/...` sends a reader to a path that may not exist in their checkout, and it puts a packet id into shipped code.

### Constraints

- `specs/` is not part of a skill package.
- The rule's evidence is the workflow file and the line, both of which ship with the repository.
- The phase's own spec documents may cite `final-review.md` and `research.md`; the packet may not.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: every citation in the packet names a `.github/` file and its line, or a hub file and its line. The packet names no `specs/` path.

**How it works**: T010 to T017 write `file:line` citations against `.github/workflows/`, `.github/scripts/` and the hub's own files. AC-012 greps the packet for `specs/` and requires zero matches.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Workflow-file citations only (chosen)** | Every citation resolves in any checkout, and no packet id ships | The reasoning behind a rule lives in the spec, not the packet | 9/10 |
| Cite both the workflow and the research | The reader sees the reasoning | A `specs/` path in shipped code, and a packet id in the packet | 3/10 |
| Cite only the research | Shortest to write | Unusable outside this repository | 1/10 |

**Why this one**: a shipped standard must resolve where it ships.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- Every citation resolves in a clone that carries only `.skilled/` and `.github/`.
- The packet carries no ephemeral id, which is REQ-010.

**What it costs**:
- The packet states the rule without the measurement behind it. Mitigation: the index names the observed count beside the rule, so the reader sees the number even without the research path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later editor adds a `specs/` link for convenience | M | AC-012 greps for it, and T063 runs the ephemeral-id search |
| A workflow file moves and a citation goes stale | M | T005 records the anchors, and T043 of the drift guard set does not cover this, so the index carries the quoted line beside the number |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The packet ships in a skill package, and `specs/` does not |
| 2 | **Beyond Local Maxima?** | PASS | Three citation strategies compared |
| 3 | **Sufficient?** | PASS | A workflow file plus a line is enough to check every rule |
| 4 | **Fits Goal?** | PASS | REQ-010 forbids an ephemeral id in code, and a `specs/` path carries one |
| 5 | **Open Horizons?** | PASS | The same rule keeps the packet portable if it is vendored |
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- The four references and the two templates: citations only against `.github/` and hub files.

**Gated tasks**: T010 to T017, T063.

**How to roll back**: no rollback needed; a citation is text.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: Generated artifacts are written only by their generators

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-010-context -->
### Context

Four artifacts this phase changes are generated: `leaf-manifest.json`, `graph-metadata.json`, the Hermes mirror and the compiled-routing activation manifest. Each has a freshness check, and each check fails when a hand edit diverges from what the generator would write. `graph-metadata.json` is the one exception in part: its `derived.causal_summary` is authored prose the generator preserves.

### Constraints

- `generate-leaf-manifest.cjs --check` compares the committed file with a fresh regeneration byte for byte.
- `regenerate-skill-derived.cjs` preserves `causal_summary` and rewrites every other derived field.
- `sync-skills-hermes.cjs --check` and `compiled-route-sync.cjs --check` compare served copies with authored files.
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: every generated artifact is written by its generator, and the one authored field is edited by hand only after the generator has run.

**How it works**: T033, T034, T056 and T057 run the four generators. T035 edits `causal_summary` alone, after T034. T058 copies the refreshed activation manifest to its archived twin, which is a copy, not an edit.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Generator-only writes (chosen)** | Every freshness check passes by construction | Four commands to run | 9/10 |
| Hand-edit each artifact | One edit per file | Every freshness check fails, and the next regeneration overwrites the edit | 1/10 |
| Skip the artifacts | Fewer tasks | `5k-canary`, `10b-byte-drift` and the compiled route all read them | 2/10 |

**Why this one**: the artifacts exist so nobody has to keep two copies of the same fact in agreement by hand.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- The byte-drift, leaf-set and freshness checks pass because the generator wrote the file.
- A later registry change regenerates the same artifacts with one command each.

**What it costs**:
- Four commands in the critical path. Mitigation: each is one line, and each has its own check.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A generator stops with a contract error | M | T033 names `MODE_LEAF_SET_COLLISION` and its repair; the other three stop cleanly and name their cause |
| A hand edit slips into a generated file | M | The freshness checks in T033, T034, T056 and T057 fail on it |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four freshness checks read these files, and a hand edit fails each one |
| 2 | **Beyond Local Maxima?** | PASS | Three write strategies compared |
| 3 | **Sufficient?** | PASS | One generator run per artifact is enough |
| 4 | **Fits Goal?** | PASS | REQ-003 names the generated manifest and REQ-008 the release |
| 5 | **Open Horizons?** | PASS | The next surface runs the same four commands |
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- `leaf-manifest.json`, `graph-metadata.json`, `.hermes/skills/sk-code-ci/SKILL.md` and the activation manifest: written by their generators.
- `graph-metadata.json`'s `derived.causal_summary`: the one authored field.

**Gated tasks**: T033 to T035, T056 to T058.

**How to roll back**: `git checkout` the four artifacts and rerun each generator against the reverted registry.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:amendment-2026-10-24 -->
## AMENDMENT 2026-10-24: routing vocabulary changes the operator approved after first landing

The accepted ADR text above stays as written, apart from the one corrected sentence in ADR-001's risk table. This amendment records what changed after the packet first landed and why. ADR-001's statement that the hub gains no new advisor identity still holds: no advisor identity was added, only advisor phrases for the existing `sk-code` identity.

**Approval**: the operator approved all three changes on 2026-10-24. They sit outside the frozen scope that `spec.md` set, and the amendment note in `spec.md` records the change to that scope.

### Change 1: narrower runtime keywords

Bare words in the `code-ci-runtime` class of `hub-router.json` became multi-word phrases. `matrix`, `ruleset` and `cache key` came first, because replaying `fix the cache key in the bun lockfile loader`, `the ruleset in the advisor scorer is wrong` and `write a vitest test matrix for the parser` showed all three being pulled into `sk-code-ci`, a CI surface that has nothing to say about them. `fail-fast` and `concurrency group` were narrowed the same way. On 2026-10-24 the class holds `fail-fast: false`, `strategy matrix`, `ruleset context`, `actions concurrency group` and `actions cache key`. A second read-only review (a DeepSeek pass) found seven non-CI prompts that still selected `sk-code-ci`, and the same approved intent was applied again, which produced the forms above. The narrowed forms moved more than once during the pass, so `hub-router.json` is the source for the live list. `compiled-route-surface-hint.test.cjs` now holds a test that keeps the three replay prompts off the surface.

### Change 2: eight advisor phrases

Eight multi-word CI phrases were added to `intent_signals` in `.skilled/skills/sk-code/graph-metadata.json`: `github actions workflow`, `github actions yaml`, `ci workflow`, `github workflow timeout`, `github workflow concurrency`, `github workflow permissions`, `workflow path filters` and `timeout-minutes`. Before the change a CI prompt never reached `sk-code`. After it, `pin the actions/checkout sha in the github actions workflow` went from `sk-git` 0.82 first to `sk-code` 0.8357 first, and `add a timeout to the ci workflow` went from `mcp-tooling` to `sk-code` 0.8933, as measured when the phrases first landed.

### Change 3: overlapping aliases dropped

`actions workflow`, `ci workflow standards` and `workflow yaml` left the alias list in `mode-registry.json` and the matching keyword lists, because each one counted a single phrase two or three times and inflated the CI score. `protected workflow` left later and four more aliases gained a qualifier. The second review narrowed `workflow timeout`, `workflow concurrency` and `workflow permissions` to their `github workflow ...` forms and `required status check` to `required status check workflow`, and three of the eight advisor phrases in `graph-metadata.json` took the same `github workflow ...` form. On 2026-10-24 eight aliases remain: `github actions workflow`, `ci workflow`, `github actions yaml`, `workflow path filters`, `github workflow timeout`, `github workflow concurrency`, `github workflow permissions` and `required status check workflow`. Tasks T020, T025 and T029 describe the original twelve and carry a drift note.

### Known limitation: the earlier canary prompt no longer bundles

`review the github actions workflow yaml` now resolves to `surfaceBundle` `[sk-code-review, sk-code-ci]`, where it resolved to `single` `[sk-code-ci]` before the change (CI score 12 against review score 4). The canary case `surface-bundle-ci` and its test use this prompt. The earlier prompt `code review the github actions workflow` used to bundle and now routes to `sk-code-review` alone, because `code review` scores twice on the review side. No CI weight or alias set in range bundles both prompts. Bundling both needs `routerPolicy.ambiguityDelta` raised from 1, which changes the result of every two-mode prompt in the hub.

**Operator ruling 2026-10-24**: accept the limitation. `code review the github actions workflow` routes to `sk-code-review` alone and `routerPolicy.ambiguityDelta` stays at 1, so no two-mode prompt elsewhere in the hub changes.

### Corrected statement: a bare surface prompt does not defer

ADR-001's risk table said that `routerPolicy.defaultMode` being `null` makes a bare surface prompt defer. The engine does not do that. Replaying on 2026-10-24, `add a timeout to the ci workflow` resolves to `single` `[sk-code-ci]` and `implement a new function in the typescript module` resolves to `single` `[sk-code-skilled]`, and both did so before this phase's routing change. The sentence in the table now says so.

### Replays after the second narrowing

Observed 2026-10-24 with `compiledRoute("sk-code", <prompt>, {})`:

| Prompt | Result |
|--------|--------|
| `make the config loader fail-fast on a missing DATABASE_URL` | `single` `[sk-code-skilled]` |
| `build matrix factorization recommender in python` | `single` `[sk-code-skilled]` |
| `assign each tenant its own concurrency group inside the worker pool` | `defer` |
| `the Temporal workflow timeout on order-fulfilment is too short, raise it` | `defer` |
| `the approval workflow permissions should let a manager approve only their own team requests` | `defer` |
| `our branch ruleset should block force-pushes to release branches` | `defer` |
| `add a required status check to main and document the override` | `defer` |
| `review the github actions workflow yaml` | `surfaceBundle` `[sk-code-review, sk-code-ci]` |
| `review the ci workflow` | `surfaceBundle` `[sk-code-review, sk-code-ci]` |
| `add a timeout to the ci workflow` | `single` `[sk-code-ci]` |
| `pin the actions/checkout sha in the github actions workflow` | `single` `[sk-code-ci]` |
| `fix the timeout-minutes in the workflow yaml` | `single` `[sk-code-ci]` |

### Operator rulings

On 2026-10-24 the operator accepted that `code review the github actions workflow` routes to `sk-code-review` alone, and approved raising the pinned gold-corpus size in `compiled-route-admission.test.cjs` from 82 to 85. The pin was set to 82 on 2026-10-11 and the live corpus holds 85. The failure predates this phase: the orchestrator reproduced `85 !== 82` in a clean checkout of `113d8b56d1` before any edit of this phase. The pin raise resolves it, and the serial run `node --test --test-concurrency=1 .skilled/bin/tests/compiled-route-*.test.cjs` printed `pass 90` and `fail 0` with exit `0`.

### Effect on the compiled policy

The activation manifest `effectivePolicyHash` moved off `095a492e239cf97d0ce41e8f9d2a737778f739b64fb587c39385f33e6b429c2d` and starts `37718f51` on 2026-10-24, still at generation 2. It moves again whenever the routing lists change, so read the live value from `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`. `compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files`.

### Rollback

`git checkout` the routing files named above and rerun `compiled-route-manifest.cjs refresh` so the policy hash follows the registry.
<!-- /ANCHOR:amendment-2026-10-24 -->
