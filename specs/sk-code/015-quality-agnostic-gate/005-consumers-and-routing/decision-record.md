---
title: "Decision Record: Phase 5: consumers-and-routing"
description: "Decision record for the Phase 5 readers, declarations, routing vocabulary, mirrors, versions, and the operator decisions the program design left open."
trigger_phrases:
  - "consumers and routing decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/005-consumers-and-routing"
    last_updated_at: "2026-10-26T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the Phase 5 decisions and the operator decisions taken by default"
    next_safe_action: "None. The operator confirmed the operator decisions on 2026-10-26"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-consumers-and-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 5: consumers-and-routing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

## Decisions in This Record

ADR-001 to ADR-008 are Phase 5 choices. ADR-009 to ADR-014 take the six decisions that the program design leaves to the operator (its section 1.4). Each of those is taken at the design's recommended default, and the operator confirmed each one on 2026-10-26. The Gate 3 placement question is not taken here. The folder sits under the parent at `015-quality-agnostic-gate`, and this phase may not move it.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Named readers for the run verdict

<!-- ANCHOR:adr-001-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent (author) for the program design |
<!-- /ANCHOR:adr-001-metadata -->

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 2 defines a run verdict, `code-quality-run/v1`. A change can come back from @code as done with no gate evidence unless a workflow reads that verdict. The design requires every field to have a named reader on the other side (its section 5.1).

### Constraints

- Each reader is an agent instruction, not a new process.
- @code must not return PASS when the gate is BLOCKED.
- `sk-code-review` keeps its own severity ids.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Three named readers. `workflow-verify.md` step 2 reads the verdict fields and hands unverified ids to verification. The @code RETURN `Quality Gate` field carries the gate, and a BLOCKED gate maps to the P0 failed mandatory quality gate. `sk-code-review` reads the verdict as input evidence only.

**How it works**: Each reader names the fields it consumes. No reader writes the verdict, and no reader changes the gate.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Named readers (chosen)** | Each field has a reader. No new process | Three prose readers to keep in step | 8/10 |
| A consumer script that reads the verdict and writes a summary | One place for the rule | A new process, and a second answer to the same question | 4/10 |
| Readers left implicit | Nothing to maintain | The two-sided contract fails without a named reader | 2/10 |

**Why this one**: The design names the missing readers as the reason the contract fails (its open question Q5). Prose readers add no process and keep the mode's tool surface unchanged.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A change that returns without gate evidence fails the RETURN check.
- The readers are findable by grep, which AC-001, AC-003 and AC-027 use.

**What it costs**:
- Three readers to keep in step. Mitigation: AC-001, AC-003 and AC-027 check each one with a grep.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader drifts from the field name in Phase 2 | M | Each reader names the field, and the Phase 2 grammar is the source. A rename is an amendment |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The design's Q5 names this gap |
| 2 | **Beyond Local Maxima?** | PASS | A consumer script was weighed and rejected |
| 3 | **Sufficient?** | PASS | Three grep-checkable readers cover the verdict fields |
| 4 | **Fits Goal?** | PASS | Each reader is on the path from gate to completion claim |
| 5 | **Open Horizons?** | PASS | A later reader needs one more row in the same shape |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.skilled/agents/code.md` and its mirrors
- `.skilled/skills/sk-code/sk-code-review/SKILL.md` evidence line
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` reason at line 58

The `workflow-verify.md` step 2 reader is written by phase 004, which owns every edit to that file. This phase confirms it in T007.

**How to roll back**: Restore those three files from the phase starting commit, then rerun AC-003 and AC-027, which should fail again.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Drop the quality gate trigger from sk-code-review

<!-- ANCHOR:adr-002-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent (author) for the program design |
<!-- /ANCHOR:adr-002-metadata -->

---

<!-- ANCHOR:adr-002-context -->
### Context

`sk-code-review/SKILL.md` lists "quality gate" as an activation trigger (line 22) and a keyword trigger (line 29). The quality mode's aliases claim the same phrase (`hub-router.json` quality-aliases, line 47). A request with those words can reach either mode.

### Constraints

- Review keeps its findings-first triggers.
- The quality mode keeps its alias, since the gate is its job.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Remove "quality gate" from review's two trigger lines. Review keeps "code review", "pr review", "audit" and "merge readiness".

**How it works**: The trigger lists change, and the alias stays with the quality mode.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove from review (chosen)** | One owner for the phrase | Review loses a phrase it used to claim | 8/10 |
| Keep both and rely on `tieBreak` | No edit | `tieBreak` only settles ties, and the phrase still splits traffic | 3/10 |
| Add "quality review" to the quality mode | Narrows the phrase | Adds vocabulary and leaves the collision in place | 4/10 |

**Why this one**: The phrase names the author gate. Review's job is findings, so the phrase belongs to one owner.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A request that says only "quality gate" reaches the quality mode.

**What it costs**:
- A user who wanted review on that phrase now reaches the quality mode. Mitigation: review still matches "code review" and "pr review", and AC-008 checks the line.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A review request phrased only as "quality gate" routes to the quality mode | L | The quality mode's output names the review follow-up when findings are asked for |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The collision is at `sk-code-review/SKILL.md` lines 22 and 29 |
| 2 | **Beyond Local Maxima?** | PASS | Keeping both was weighed and rejected |
| 3 | **Sufficient?** | PASS | Two lines change, and no other trigger moves |
| 4 | **Fits Goal?** | PASS | The gate routes to the mode that runs it |
| 5 | **Open Horizons?** | PASS | Review keeps its own vocabulary for later changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/sk-code-review/SKILL.md` lines 22 and 29

**How to roll back**: Restore the two lines from the phase starting commit, then run `grep -n 'quality gate' .skilled/skills/sk-code/sk-code-review/SKILL.md`, which should print both lines again.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Restraint vocabulary at stage two, and the SKILLED language checklists kept

<!-- ANCHOR:adr-003-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent (author) for the program design |
<!-- /ANCHOR:adr-003-metadata -->

---

<!-- ANCHOR:adr-003-context -->
### Context

The stage-two replay of "apply yagni to this change" returns an empty `surfaceIntents` today. The restraint words appear only in the prose table at `ROUTER.md` line 54. The design asks to drop the SKILLED language checklists from the CODE_QUALITY resource map, because the language overlay at `ROUTER.md` lines 131 to 136 loads them. The design keeps them only if the hub benchmark regresses. That benchmark is retired (ADR-006), so the drop cannot be measured.

### Constraints

- "simplify" stays out of stage one, because prose-editing requests would match it there.
- The resource map keeps every existing row that still has a reader.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Add "comment hygiene", "restraint", "yagni", "simplify", "over-engineering" and "bloat" to the CODE_QUALITY intent keywords at `ROUTER.md` line 242. Add the runner-contract resource. Keep the SKILLED language checklists in the map. Stage one carries only "comment hygiene".

**How it works**: The keyword line gains words. The resource map keeps its rows and gains one row.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Add the words, keep the checklists (chosen)** | No measured regression risk. Phase 6 can measure the drop | Duplicate checklist loads when both paths apply | 7/10 |
| Drop the checklists as the design asks | Less duplication | Unmeasurable now, since the replay harness is retired | 5/10 |
| Put "simplify" in stage one too | Matches more phrasing | Pulls prose-editing requests to the hub | 2/10 |
| Carry yagni and over-engineering at stage one | Matches the restraint phrasing before stage two runs | Measured cost, sk-code 0.8246 for "write a README paragraph about over-engineering a cake recipe" and 0.82 for "a blog post about yagni as a life philosophy", where main returns no sk-code row for either | 2/10 |

**Why this one**: The duplicate load costs context, and it does not change a route. A drop that cannot be measured is a risk with no owner.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A restraint request reaches the CODE_QUALITY intent at stage two.

**What it costs**:
- Possible duplicate checklist loads. Mitigation: Phase 6 measures the load, and a later change drops the rows with a replay.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stage-two replay still misses a restraint phrase | M | The stage-two test in T039 asserts the phrase, and T053 replays it |

**Amended 2026-10-26**: Stage one carried "comment hygiene", "yagni" and "over-engineering" at first. Two prose prompts measured the cost. "write a README paragraph about over-engineering a cake recipe" gave sk-code confidence 0.8246, and "a blog post about yagni as a life philosophy" gave sk-code 0.82. On main both prompts gave no sk-code row. Both words were taken out of `intent_signals`, so stage one now carries only "comment hygiene". After an advisor rebuild, the cake prompt gives no sk-code row, the yagni prompt gives `[]`, and "check comment hygiene on these files" gives sk-code 0.8419. Stage two keeps both words in the `ROUTER.md` `CODE_QUALITY` row, and the stage-two replay of "apply yagni to this change" still gives `["CODE_QUALITY"]`. The phrase "comment hygiene" has no sense outside code, so its prose replay, "write prose about comment hygiene for a newsletter" at sk-code 0.82 tied with sk-doc, is a request about code comments.
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The replay returns no CODE_QUALITY intent today |
| 2 | **Beyond Local Maxima?** | PASS | Dropping the checklists and adding simplify to stage one were weighed |
| 3 | **Sufficient?** | PASS | A keyword line and one resource row |
| 4 | **Fits Goal?** | PASS | Restraint requests reach the author gate |
| 5 | **Open Horizons?** | PASS | Phase 6 can measure the drop later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/ROUTER.md` line 242 and the CODE_QUALITY map at lines 268 to 282

**How to roll back**: Restore those lines from the phase starting commit, then rerun the stage-two test, which should fail again.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Shared aliases move to sk-code-skilled

<!-- ANCHOR:adr-004-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent (author) for the program design |
<!-- /ANCHOR:adr-004-metadata -->

---

<!-- ANCHOR:adr-004-context -->
### Context

"alignment verifier" and "stable jsonl keys" are aliases of the quality mode (`mode-registry.json` line 37). They describe SKILLED runtime code. The quality-gates vocabulary class also holds "add set -euo pipefail" (`hub-router.json` line 50). The hub mirrors its registry aliases into its vocabulary classes (`parent-skills-nested-packets.md` line 290), and that reference requires aliases to be unique across all modes (line 289).

### Constraints

- Each alias has one owner mode.
- The mirrored vocabulary keeps matching the registry.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Move the two aliases to the sk-code-skilled aliases (`mode-registry.json` line 74). Move the three phrases to the end of the code-skilled-runtime vocabulary class (`hub-router.json` line 71).

**How it works**: Each phrase keeps one owner, in the registry and in the vocabulary.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move to sk-code-skilled (chosen)** | Each phrase has one owner | Requests that used the old owner now reach sk-code-skilled | 8/10 |
| Keep the aliases with the quality mode | No edit | Two owners for SKILLED phrases, and the registry rule forbids it | 3/10 |

**Why this one**: The phrases describe SKILLED code, and the uniqueness rule requires one owner.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The registry and the vocabulary agree on one owner per phrase.

**What it costs**:
- Stage-one matching for the three phrases changes. Mitigation: replay each phrase before and after, as the hub routing rule asks, and record the output in the summary.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A moved phrase stops matching at stage one | M | The routing replay in plan.md section 5 runs before and after |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two aliases appear under two owners today |
| 2 | **Beyond Local Maxima?** | PASS | Keeping them was weighed and rejected |
| 3 | **Sufficient?** | PASS | Two registry lines and two vocabulary lines change |
| 4 | **Fits Goal?** | PASS | Each SKILLED phrase reaches the SKILLED owner |
| 5 | **Open Horizons?** | PASS | The uniqueness rule holds for later aliases |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/mode-registry.json` lines 37 and 74
- `.skilled/skills/sk-code/hub-router.json` lines 50 and 71

**How to roll back**: Restore those four lines from the phase starting commit, then run the T031 and T032 checks, which should show the phrases under the old owner again.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Quality rows for SKILLED and the path-only sk-code-ci declaration

<!-- ANCHOR:adr-005-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent (author) for the program design |
<!-- /ANCHOR:adr-005-metadata -->

---

<!-- ANCHOR:adr-005-context -->
### Context

SKILLED has a surface detection block. sk-code-ci has none, because a surface reached from request vocabulary alone declares no block (`stack-detection.md` line 34). Fixture F14 needs the sk-code-ci row, and Phase 2 owns that fixture. The design places the row in Phase 5, so the two disagree.

### Constraints

- Declarations hold checklists only, never commands.
- A surface without a detection block must not gain one.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: sk-code-ci declares one path-only row for `.github/workflows/**` that points at `ci-workflow-standards.md`. The SKILLED entry declares one row for each checklist that its conditional rows name. Phase 5 confirms both rows and adds a missing one only.

**How it works**: The runner reads rows by path for sk-code-ci and by surface for SKILLED.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Path-only row (chosen)** | Matches the surface rule. No detection order change | Request vocabulary alone adds no row | 8/10 |
| Add a detection block to sk-code-ci | Detects the surface from content | Changes detection order, and `stack-detection.md` says the surface has none | 3/10 |

**Why this one**: The row needs only a path, and a detection block would change routing for every workflow file.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A workflow file names its checklist through the registry.

**What it costs**:
- A request that names only the CI vocabulary adds no checklist. Mitigation: the stage-two CI_WORKFLOW intent still names the surface.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A workflow file outside `.github/workflows/` misses the row | L | The row matches the standard location only, and the design keeps path rows exact |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F14 needs the row |
| 2 | **Beyond Local Maxima?** | PASS | A detection block was weighed and rejected |
| 3 | **Sufficient?** | PASS | One row for sk-code-ci, and rows that already exist for SKILLED |
| 4 | **Fits Goal?** | PASS | The CI checklist reaches workflow files |
| 5 | **Open Horizons?** | PASS | A new surface adds one row in the same shape |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/mode-registry.json` SKILLED entry, lines 61 to 85, if the rows are missing
- `.skilled/skills/sk-code/mode-registry.json` sk-code-ci entry, lines 86 to 103, if the row is missing

**How to roll back**: Remove the added `quality` objects, then rerun the T019 and T020 checks, which should print nothing for the removed row.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The benchmark replay is replaced by the successor gate and the canaries

<!-- ANCHOR:adr-006-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent (author) for the program design |
<!-- /ANCHOR:adr-006-metadata -->

---

<!-- ANCHOR:adr-006-context -->
### Context

The design's Phase 5 acceptance asks that "the hub benchmark replay shows no regression against its last report". The sk-code benchmark README says the Lane C harness is retired and no new run can start from it. Its successor is the routing-registry drift workflow (`.github/workflows/routing-registry-drift.yml`), whose steps run the metadata gate, the derived freshness gate, the intent carry gate and the skill-graph compiler.

The design's second canary expects `sk-code-ci` as a surface bundle at stage one. Today `compiled-route.cjs` returns `single`. `hub-router.json` describes a `surfaceBundle` outcome but holds no rule that produces one.

### Constraints

- No retired tool is revived.
- Compiled-routing artifacts sit outside this phase's scope, except for the sync step.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: The regression check is the successor gate's steps that cover this hub, plus the canaries in plan.md section 5. The stage-one CI canary is recorded as measured. AC-018 closes as a waiver under this decision, and the operator confirmed the waiver on 2026-10-26.

**How it works**: Each gate prints a fixed line, and each canary records its exact output in the implementation summary.

**Amended 2026-10-26**: The CI vocabulary is unchanged from the base commit, and this phase adds no CI keyword. The `code-ci-runtime` class in `hub-router.json`, the `CI_WORKFLOW` row of `ROUTER.md` and the `INTENT_SIGNALS` `CI_WORKFLOW` row of `sk-code-ci/SKILL.md` each end `"sha-pinned action", ".github/workflows/"]`. Stage one for "run the quality gate on my edited .github/workflows/ci.yml" prints `"selectionKind":"single"` with the target `sk-code-quality`. Stage two through the router-replay `routeSkillResources` returns `surfaceIntents` `["CI_WORKFLOW"]` and loads four sk-code-ci references, so the CI standards still reach the quality run. "review the .github/workflows/test.yml diff for bugs" prints `surfaceBundle`, with review, ci and skilled, and "fix the gitlab pipeline stage in .gitlab-ci.yml" defers. The doc-claims guard prints fresh and the router sync matches 5 of 5. Two keyword fixes were tried and rejected. The bare file name `ci.yml` matches only a file named exactly that, and it pulled `.gitlab-ci.yml` and ci.yml prose into sk-code-ci. The keyword `github/workflows/` is a substring of `.github/workflows/`, so every workflow path scored twice, which broke the "code quality" phrasings and dropped review mode from the review-on-workflow bundle. AC-018 therefore closes as a waiver under this decision, and the operator confirmed it on 2026-10-26.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Successor gate and canaries (chosen)** | Uses gates that run today | No single benchmark score | 7/10 |
| Revive the Lane C harness | Keeps the design's wording | The harness is retired, and no runner exists | 1/10 |
| Change compiled routing to produce a surface bundle now | Meets canary 2 directly | Compiled-routing artifacts are outside this phase, and no bundle rule exists. Amended 2026-10-26: two keyword fixes were tried and rejected, see the decision | 4/10 |
| Waive AC-018 now | Closes the row | Amended 2026-10-26: the stage-one `single` result and the stage-two `CI_WORKFLOW` replay back it, so the row closes this way | 6/10 |

**Why this one**: The gates and canaries run on the current tree, and they report exact output. The stage-one bundle needs a decision the design does not make.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Each regression check runs today and prints a line that can be compared.

**What it costs**:
- No single number for routing quality. Mitigation: Phase 6 owns the measurement and compares against the canary outputs recorded here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A route changes without a gate noticing | M | The canaries record exact output, and T049 to T053 replay them |
| Canary 2 stays `single` and nobody decides | M | AC-018 closes only as a waiver that names this decision, and the operator confirmed it on 2026-10-26 |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The design's acceptance names a retired lane |
| 2 | **Beyond Local Maxima?** | PASS | Reviving the harness and changing compiled routing were weighed |
| 3 | **Sufficient?** | PASS | The successor gate and the canaries cover the hub's routing surfaces |
| 4 | **Fits Goal?** | PASS | Regressions are visible before the packet closes |
| 5 | **Open Horizons?** | PASS | Phase 6 can add the measurement |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- No product file changes for this decision. The canary outputs are recorded in `implementation-summary.md`.

**How to roll back**: Not applicable, since no file changes. Delete the recorded canary outputs from the implementation summary if they are wrong.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Agent mirrors are edited by hand for Claude and generated for Codex and Pi

<!-- ANCHOR:adr-007-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent (author) for the program design |
<!-- /ANCHOR:adr-007-metadata -->

---

<!-- ANCHOR:adr-007-context -->
### Context

`.skilled/agents/code.md` is canonical. The crosswalk says `.claude/agents/` is an authored fork in the Claude dialect, edited in the same change. It says `.codex/agents/` and `.pi/agents/` are generated, and `.cursor` and `.devin` link to `.claude`. The Claude fork uses a `tools:` list, and the canonical file uses a `permission:` map.

### Constraints

- The dialect of each tree stays as it is.
- A generated tree is never hand-edited.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: Edit the canonical file. Hand-sync the Claude fork in the same change, in its own dialect. Regenerate the Codex and Pi trees with their scripts, then run the mirror check for all agents.

**How it works**: The Codex and Pi sync scripts write when they get no argument, and check when they get `--check`.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hand-sync Claude, generate the rest (chosen)** | Each tree keeps its dialect | Three edits and one check | 8/10 |
| Copy the canonical file over the Claude fork | One edit | Breaks the `tools:` dialect | 2/10 |
| Hand-edit the generated trees | One edit per tree | The next sync overwrites the edit | 2/10 |

**Why this one**: The crosswalk defines these roles, and the mirror check enforces them.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- Each runtime carries the same behavior in its own dialect.

**What it costs**:
- Three edits per agent change. Mitigation: `check-agent-mirror-sync.cjs --all` fails on any drift.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The hand-synced Claude fork drifts | M | T015 and T048 run the check after each edit |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The mirror check fails without the sync |
| 2 | **Beyond Local Maxima?** | PASS | Copying and hand-editing the generated trees were weighed |
| 3 | **Sufficient?** | PASS | Three edits and one check cover the six trees |
| 4 | **Fits Goal?** | PASS | The QUALITY step reaches every runtime |
| 5 | **Open Horizons?** | PASS | The same method applies to later agent edits |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `.skilled/agents/code.md`
- `.claude/agents/code.md`
- `.codex/agents/code.toml` (generated)
- `.pi/agents/code.md` (generated)

**How to roll back**: Restore the four files from the phase starting commit, then run `node .skilled/bin/check-agent-mirror-sync.cjs --all`, which should pass on the restored state.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Versions and changelogs for each touched packet

<!-- ANCHOR:adr-008-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent (author) for the program design |
<!-- /ANCHOR:adr-008-metadata -->

---

<!-- ANCHOR:adr-008-context -->
### Context

The design's D21 rules a fix a patch and a feature a minor release. Each phase writes real changelog files at the hub and packet level. The hub has four version carriers: `SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json`. `ROUTER.md` keeps its own document version.

### Constraints

- Changelogs are real files, never symlinks.
- The hub's four carriers hold one value.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: A minor hub bump across the four carriers, a minor bump for ROUTER.md and sk-code-review, and patch bumps for sk-code-skilled, sk-code-ci and the three shared workflow documents. Each bumped hub or packet gets a real changelog file. The values in this record are for the tree at authoring time. The next minor applies when an earlier phase has already bumped the hub.

**How it works**: The version tasks in tasks.md set the values, and AC-015 and AC-016 check them.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bump each touched unit (chosen)** | Each release names its change | More files to update | 8/10 |
| Bump the hub only | One change | Breaks the packet changelog rule in D21 | 3/10 |
| Bump every packet as a minor | One rule | The text fixes would look like features | 4/10 |

**Why this one**: The packet changelog rule and the semantic bump rule both apply, and each touched unit gets its own value.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- A reader can see which packet changed and by how much.

**What it costs**:
- Seven version edits and four changelog files. Mitigation: AC-015 and AC-016 check them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later phase bumps the hub first, so the values here are stale | M | Re-pick the minor at landing, as the design's risk 11 says |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | D21 requires the changelog and the bump |
| 2 | **Beyond Local Maxima?** | PASS | Hub-only and all-minor bumps were weighed |
| 3 | **Sufficient?** | PASS | One bump per touched unit |
| 4 | **Fits Goal?** | PASS | Each release names its change |
| 5 | **Open Horizons?** | PASS | Later phases follow the same rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- Version lines in the hub carriers, ROUTER.md, the packet SKILL.md files and the shared workflow documents
- Four new changelog files

**How to roll back**: Restore the version lines from the phase starting commit and delete the four new changelog files.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Iron Law 3 amended as the design words it (operator decision D4)

<!-- ANCHOR:adr-009-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed by the operator 2026-10-26 |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, by standing instruction to build autonomously |
| **Owner phase** | 004-doctrine |
<!-- /ANCHOR:adr-009-metadata -->

---

<!-- ANCHOR:adr-009-context -->
### Context

Iron Law 3 forbids any standard on an UNKNOWN surface (`phase-detection.md` line 109). Iron Law 2 makes the gate mandatory. A repository with no surface packet therefore never completes its gate. The design lists this as operator decision 1.4 item 1.

### Constraints

- The amended text must not allow discovered commands to run.
- The amended text must keep verification governed by Iron Law 3.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: The design's text for Iron Law 3: "No claim about an unsupported surface. An UNKNOWN surface gets only the universal floor in `code-quality-standards.md` and the quality runner's built-in checks until the operator names its surface and commands, in a declared surface or in the repository's committed `.sk-code/quality.json`. No other standard or verification command applies to it."

**How it works**: The gate can complete on an UNKNOWN surface with the floor and the built-in checks. Verification keeps asking for commands, which Phase 5 keeps at `workflow-verify.md` lines 47 and 55.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Design text (chosen)** | The gate completes without a deadlock | Reviewers must read two rules | 8/10 |
| Keep the current Iron Law 3 | No edit | The gate never completes on an unknown repository | 2/10 |
| Let any verification command run on UNKNOWN | Simple | Runs repository code nobody named | 1/10 |

**Why this one**: It removes the deadlock and keeps every command under a named source.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- The gate can finish on an unknown repository.

**What it costs**:
- Reviewers must know that the floor and the built-in checks are the only standards there. Mitigation: the floor is named in the same sentence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Iron Law 3 is read as permission for surface standards on UNKNOWN | M | The text names the floor and the config, and nothing else |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The deadlock is in `phase-detection.md` lines 108 and 109 |
| 2 | **Beyond Local Maxima?** | PASS | Keeping the rule and allowing any command were weighed |
| 3 | **Sufficient?** | PASS | One sentence changes, and the rest of the rule stays |
| 4 | **Fits Goal?** | PASS | Unknown repositories can complete the gate |
| 5 | **Open Horizons?** | PASS | Named surfaces and the config extend the rule later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- Owned by Phase 4. Phase 5 keeps the unknown-surface lines at `workflow-verify.md` lines 47 and 55 unchanged.

**How to roll back**: Restore the Iron Law 3 text from the Phase 4 starting commit.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: The universal checklist becomes the SKILLED house checklist (operator decision D12)

<!-- ANCHOR:adr-010-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed by the operator 2026-10-26 |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, by standing instruction to build autonomously |
| **Owner phase** | 004-doctrine |
<!-- /ANCHOR:adr-010-metadata -->

---

<!-- ANCHOR:adr-010-context -->
### Context

`universal-checklist.md` serves the OpenCode development environment, and its P0 rows force this framework's header form, numbered sections and spec roots. Every surface loads it today, which makes its name wrong for foreign repositories. The design lists this as operator decision 1.4 item 2.

### Constraints

- The floor for every surface stays the cross-mode severity model in `code-quality-standards.md`.
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: Retitle the checklist as the SKILLED house checklist. It loads only when SKILLED is a resolved surface of the target. The floor stays in `code-quality-standards.md`.

**How it works**: Foreign surfaces load the floor and their own rows. SKILLED targets load the house checklist as well.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **SKILLED house checklist (chosen)** | Foreign surfaces stop inheriting house rules | Narrows what the baseline meant under the earlier remediation decision | 7/10 |
| Keep the baseline name | No edit | House rules bind foreign repositories | 3/10 |

**Why this one**: The house rules are this framework's, and the design keeps the floor universal.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- A foreign repository stops receiving SKILLED header and spec-root rules.

**What it costs**:
- The baseline meaning in ADR-001 of `specs/sk-code/014-code-modes-research/003-review-remediation` narrows. Mitigation: the operator confirmed it on 2026-10-26.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A SKILLED target misses the house rules | M | The SKILLED rows load the checklist, and F16 checks it |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The checklist's rows bind foreign repositories |
| 2 | **Beyond Local Maxima?** | PASS | Keeping the name was weighed |
| 3 | **Sufficient?** | PASS | A retitle and a load condition |
| 4 | **Fits Goal?** | PASS | Foreign repositories reach the gate without house rules |
| 5 | **Open Horizons?** | PASS | Other house checklists can follow the same pattern |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- Owned by Phase 4, which retitles the checklist and sets the load condition in the SKILLED rows that declare it.
- Phase 5 scopes the `universal-checklist.md` entry to a SKILLED-resolved target in both places the hub names it, which are the CODE_QUALITY intent overlay row in `ROUTER.md` section 6 and its entry in the section 11 CODE_QUALITY `RESOURCE_MAP`. The entry stays in the map rather than being dropped, because the orphan guard and the router replay both require every routable doc to be routed. The language checklists keep their CODE_QUALITY rows, as ADR-003 records.
- A foreign surface reaches a checklist only through a row it declares itself, so it loads the floor in `code-quality-standards.md` plus its own rows and never this framework's house rules.

**How to roll back**: Restore the checklist title and its load condition from the Phase 4 starting commit, and remove the SKILLED-only scope from the two `ROUTER.md` lines.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:adr-011 -->
## ADR-011: The repository config is `.sk-code/quality.json` with the design's merge rule (operator decision D16)

<!-- ANCHOR:adr-011-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed by the operator 2026-10-26 |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, by standing instruction to build autonomously |
| **Owner phase** | 003-config-and-doctor |
<!-- /ANCHOR:adr-011-metadata -->

---

<!-- ANCHOR:adr-011-context -->
### Context

The runner needs one committed place where a repository names its checks. The operator decision 1.4 item 3 asks for the file name and the merge rule.

### Constraints

- A required check must never be disabled silently.
- The discovery order follows sk-git's resolver.
<!-- /ANCHOR:adr-011-context -->

---

<!-- ANCHOR:adr-011-decision -->
### Decision

**We chose**: `.sk-code/quality.json` at the repository root, committed. Discovery runs in this order: the `--config` path, git config `skcode.qualityConfig` at file scope, `.sk-code/quality.json`, then the shipped defaults. The merge rule is the design's section 4.2.

**How it works**: The repository layer is the only layer that names commands. The base layer and surface blocks name none.
<!-- /ANCHOR:adr-011-decision -->

---

<!-- ANCHOR:adr-011-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`.sk-code/quality.json` (chosen)** | Mirrors `.sk-git/` | One more folder at the root | 8/10 |
| `quality.json` at the root | Shorter path | Breaks the `.sk-git/` precedent | 5/10 |
| A local override file | Lets one developer skip checks | A required check could be disabled silently | 2/10 |

**Why this one**: It follows the sk-git precedent and keeps the trust boundary in one layer.
<!-- /ANCHOR:adr-011-alternatives -->

---

<!-- ANCHOR:adr-011-consequences -->
### Consequences

**What improves**:
- One committed file names every repository check.

**What it costs**:
- A new folder at the root. Mitigation: `/doctor:sk-code quality init` writes it once with `--apply`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A configured path points nowhere | M | The runner exits 3 with `CONFIG_PATH_MISSING`, as sk-git does |
<!-- /ANCHOR:adr-011-consequences -->

---

<!-- ANCHOR:adr-011-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The runner needs a committed place for repository checks |
| 2 | **Beyond Local Maxima?** | PASS | The root file and a local override were weighed |
| 3 | **Sufficient?** | PASS | One file and one merge rule |
| 4 | **Fits Goal?** | PASS | The repository names its own commands |
| 5 | **Open Horizons?** | PASS | Later sensors add rows, not files |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-011-five-checks -->

---

<!-- ANCHOR:adr-011-impl -->
### Implementation

**What changes**:
- Owned by Phase 3. Phase 5 reads no config and changes no config file.

**How to roll back**: Remove the config reader from the Phase 3 changes, and keep the shipped defaults.
<!-- /ANCHOR:adr-011-impl -->
<!-- /ANCHOR:adr-011 -->

---

<!-- ANCHOR:adr-012 -->
## ADR-012: CI and pre-commit keep whole-file scope (design decision D6)

<!-- ANCHOR:adr-012-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed by the operator 2026-10-26 |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, by standing instruction to build autonomously |
| **Owner phase** | 001-honest-checker |
<!-- /ANCHOR:adr-012-metadata -->

---

<!-- ANCHOR:adr-012-context -->
### Context

The author gate checks changed lines. CI and pre-commit scan whole files. The design asks whether they should move to changed-line scope (operator decision 1.4 item 4).

### Constraints

- A change to CI or pre-commit is a hard block layer, so it needs a halt rule.
<!-- /ANCHOR:adr-012-context -->

---

<!-- ANCHOR:adr-012-decision -->
### Decision

**We chose**: Changed-line scope applies to the author gate only. CI and pre-commit keep whole-file scope. A finding on an unchanged line blocks only when a whole-file layer is present, and the finding names that layer.

**How it works**: The layer probe in the runner reports the whole-file layers. Phase 5 leaves the comment-hygiene workflow untouched.
<!-- /ANCHOR:adr-012-decision -->

---

<!-- ANCHOR:adr-012-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Whole-file in CI and pre-commit (chosen)** | No change to a hard block layer | Author and CI can disagree on unchanged lines | 7/10 |
| Changed-line scope in CI | Consistent scope | Changes a hard block layer before the 6.4 baseline is known | 4/10 |

**Why this one**: The design's pattern baseline (its section 6.4) has not run, and the halt rule depends on its count.
<!-- /ANCHOR:adr-012-alternatives -->

---

<!-- ANCHOR:adr-012-consequences -->
### Consequences

**What improves**:
- The blocking layers do not change before their baseline runs.

**What it costs**:
- The author and CI scopes can differ. Mitigation: the layer report names the enforcing layer.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Authors see a P1 that CI blocks later | L | The finding names the layer that will block |
<!-- /ANCHOR:adr-012-consequences -->

---

<!-- ANCHOR:adr-012-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The question is in the operator list |
| 2 | **Beyond Local Maxima?** | PASS | Changed-line scope in CI was weighed |
| 3 | **Sufficient?** | PASS | The layer probe covers the difference |
| 4 | **Fits Goal?** | PASS | Blocking layers change only after measurement |
| 5 | **Open Horizons?** | PASS | A later change can move the layers with a halt rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-012-five-checks -->

---

<!-- ANCHOR:adr-012-impl -->
### Implementation

**What changes**:
- None in this phase. Phase 5 leaves the CI and pre-commit layers unchanged.

**How to roll back**: Not applicable, since no file changes.
<!-- /ANCHOR:adr-012-impl -->
<!-- /ANCHOR:adr-012 -->

---

<!-- ANCHOR:adr-013 -->
## ADR-013: The benchmark report follows the existing folder layout (design rank 13)

<!-- ANCHOR:adr-013-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed by the operator 2026-10-26 |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, by standing instruction to build autonomously |
| **Owner phase** | 006-measurement |
<!-- /ANCHOR:adr-013-metadata -->

---

<!-- ANCHOR:adr-013-context -->
### Context

Phase 6 writes a live benchmark report. The design leaves the report format to its harness owner (operator decision 1.4 item 5).

### Constraints

- The format must match the reports already in the quality mode's benchmark folder.
<!-- /ANCHOR:adr-013-context -->

---

<!-- ANCHOR:adr-013-decision -->
### Decision

**We chose**: The report follows the existing folder layout under the quality mode's `benchmark/reports/`. Each run is a dated folder holding the same files as the existing runs, which are a markdown report, a JSON report, `results.csv` and a README.

**How it works**: The Phase 6 run writes a new dated folder beside the two existing 2026-07-10 folders.
<!-- /ANCHOR:adr-013-decision -->

---

<!-- ANCHOR:adr-013-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Existing layout (chosen)** | Readers already know it | Less room for new fields | 7/10 |
| A new format for the gate | Fits the gate exactly | A second shape beside the existing reports | 4/10 |

**Why this one**: The existing reports are the shape the readers already use.
<!-- /ANCHOR:adr-013-alternatives -->

---

<!-- ANCHOR:adr-013-consequences -->
### Consequences

**What improves**:
- A reader compares the new run with the old ones directly.

**What it costs**:
- Fields the gate adds need a note in the README. Mitigation: the README names them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The live run lacks a repository-relative root | L | The design requires one, and Phase 6 records it |
<!-- /ANCHOR:adr-013-consequences -->

---

<!-- ANCHOR:adr-013-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 6 writes a report |
| 2 | **Beyond Local Maxima?** | PASS | A new format was weighed |
| 3 | **Sufficient?** | PASS | The existing layout holds the required fields with a README note |
| 4 | **Fits Goal?** | PASS | Results compare with earlier runs |
| 5 | **Open Horizons?** | PASS | The layout can grow by README notes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-013-five-checks -->

---

<!-- ANCHOR:adr-013-impl -->
### Implementation

**What changes**:
- None in this phase. Phase 6 writes the report folder.

**How to roll back**: Not applicable in this phase.
<!-- /ANCHOR:adr-013-impl -->
<!-- /ANCHOR:adr-013 -->

---

<!-- ANCHOR:adr-014 -->
## ADR-014: The advisor plugin keeps its own copy of declaredSurfaces (design decision D14)

<!-- ANCHOR:adr-014-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed by the operator 2026-10-26 |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, by standing instruction to build autonomously |
| **Owner phase** | None in this program. The advisor plugin is outside the quality packets |
<!-- /ANCHOR:adr-014-metadata -->

---

<!-- ANCHOR:adr-014-context -->
### Context

The advisor plugin holds its own copy of the surface detection logic (`.skilled/plugins/system-skill-advisor.js` lines 747 to 772). The design asks whether to fold it into the one reader (operator decision 1.4 item 6).

### Constraints

- The advisor plugin is outside the quality packets, so this program does not edit it.
<!-- /ANCHOR:adr-014-context -->

---

<!-- ANCHOR:adr-014-decision -->
### Decision

**We chose**: The plugin keeps its copy. Phase 5 changes advisor vocabulary only in `graph-metadata.json` and `description.json`.

**How it works**: The copy and the reader can drift. The mirror and vocabulary checks catch vocabulary drift, and a later change can fold the copy.
<!-- /ANCHOR:adr-014-decision -->

---

<!-- ANCHOR:adr-014-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the copy (chosen)** | No change outside the quality packets | Two copies can drift | 6/10 |
| Fold the copy into the one reader now | One copy | Edits the advisor plugin inside a quality program | 4/10 |

**Why this one**: The plugin belongs to another owner, and this program's writes stay inside its own packets.
<!-- /ANCHOR:adr-014-alternatives -->

---

<!-- ANCHOR:adr-014-consequences -->
### Consequences

**What improves**:
- The quality program stays inside its own write boundary.

**What it costs**:
- Two copies to keep aligned. Mitigation: the advisor vocabulary is checked in Phase 5 by the intent carry gate.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The copies disagree on a surface marker | M | A later change folds them, and the design's risk 7 names this |
<!-- /ANCHOR:adr-014-consequences -->

---

<!-- ANCHOR:adr-014-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The question is in the operator list |
| 2 | **Beyond Local Maxima?** | PASS | Folding the copy now was weighed |
| 3 | **Sufficient?** | PASS | No plugin change is needed for this phase |
| 4 | **Fits Goal?** | PASS | The write boundary stays intact |
| 5 | **Open Horizons?** | PASS | A later change can fold the copy |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-014-five-checks -->

---

<!-- ANCHOR:adr-014-impl -->
### Implementation

**What changes**:
- None to the plugin. Phase 5 changes `graph-metadata.json` and `description.json` only.

**How to roll back**: Not applicable, since the plugin does not change.
<!-- /ANCHOR:adr-014-impl -->
<!-- /ANCHOR:adr-014 -->

---
