---
title: "Decision Record: Phase 2: authoring-hubs"
description: "Run decisions for the authoring-hubs research loop: configuration, workflow execution, deviations, executor switches, per-iteration steering and depth checkpoints."
trigger_phrases:
  - "authoring hubs decision record"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "scaffold/002-authoring-hubs"
    last_updated_at: "2026-11-08T22:34:13Z"
    last_updated_by: "orchestrator-a"
    recent_action: "Run closed after checkpoint 1 cleared; research.md synthesized"
    next_safe_action: "Parent synthesis reads research/research.md"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "002-authoring-hubs-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 2: authoring-hubs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Run configuration

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-08 |
| **Deciders** | Orchestrator A, under the lead's pre-resolved brief |

---

<!-- ANCHOR:adr-001-context -->
### Context

The lead's brief fixes one `/deep:research:auto` run per child with cli-devin, `deepseek-v4-1-flash-max`, a 2,400-second executor timeout, ten iterations and `--stop-policy=max-iterations`.

### Constraints

- Writes stay inside this child folder; no commit, push or branch.
- The operator is not available, so every gate is decided here and recorded.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: the brief's configuration as written, with twelve seeded key questions instead of the YAML's default three to five.

**How it works**: `research/deep-research-config.json` carries `executor.kind` `cli-devin`, `stopPolicy` `max-iterations`, `maxIterations` 10 and `minIterations` 3. The strategy seeds twelve questions that together name every release and all seven finding types.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Twelve questions** | Covers every release and type | Longer strategy | 9/10 |
| Three to five questions | YAML default | Leaves releases and types unprobed | 4/10 |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Each iteration prompt carries the full coverage target.

**What it costs**:
- Question coverage near 85 percent will not stop the run. Mitigation: stopPolicy makes convergence telemetry only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fewer than twelve questions answered by iteration 10 | M | The depth checkpoint extends the run by five |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The brief requires this decision for the run to proceed unattended. |
| 2 | **Beyond Local Maxima?** | PASS | The alternatives table names what was rejected. |
| 3 | **Sufficient?** | PASS | It changes nothing outside this folder. |
| 4 | **Fits Goal?** | PASS | It serves forced-depth research of this cluster. |
| 5 | **Open Horizons?** | PASS | The parent synthesis can reuse the record. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `research/deep-research-config.json` and `research/deep-research-strategy.md` in this folder.

**How to roll back**: move `research/` to `research_archive/` and re-run init.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
<!-- ANCHOR:adr-002 -->
## ADR-002: Workflow execution and concurrency

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-08 |
| **Deciders** | Orchestrator A, under the lead's pre-resolved brief |

---

<!-- ANCHOR:adr-002-context -->
### Context

The YAML is executed by the orchestrator step by step. The brief asks for the three children to run concurrently, while the cli-devin skill defaults to one dispatch at a time unless parallel dispatch is authorized.

### Constraints

- Writes stay inside this child folder; no commit, push or branch.
- The operator is not available, so every gate is decided here and recorded.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: a helper that runs each phase_loop step with the YAML's own commands (lock refresh, run-now check, graph convergence, prompt render, pre-dispatch audit, the literal `if_cli_devin` script, `verify-iteration.cjs`, the reducer, graph upsert, telemetry), and three children dispatched in parallel, one devin process each, each killed by its own PID only.

**How it works**: the helper is a transcription of the YAML steps, not a new loop: it holds no findings, and the steering decision between iterations stays with the orchestrator.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Helper running YAML commands, three in parallel** | Exact commands, no transcription slips, wall time cut by three | Write-containment sees sibling writes as out-of-scope | 8/10 |
| Typing each step by hand, one child at a time | Simplest | Thirty serial dispatches and more slips | 4/10 |
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Every command is the YAML's own, with exit status and output logged.

**What it costs**:
- The advisory write-containment guard reports writes in sibling children as out-of-scope paths. Mitigation: the guard only records and leaves files in place, and each child's paths are known.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Provider rate limits under three parallel sessions | M | Fall back per ADR-004 after two failures in a row |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The brief requires this decision for the run to proceed unattended. |
| 2 | **Beyond Local Maxima?** | PASS | The alternatives table names what was rejected. |
| 3 | **Sufficient?** | PASS | It changes nothing outside this folder. |
| 4 | **Fits Goal?** | PASS | It serves forced-depth research of this cluster. |
| 5 | **Open Horizons?** | PASS | The parent synthesis can reuse the record. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- A helper script in the orchestrator's scratchpad, outside the repository.

**How to roll back**: stop the helper; the run state stays valid and resumes from the state log.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---
<!-- ANCHOR:adr-003 -->
## ADR-003: Deviations from the YAML

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-08 |
| **Deciders** | Orchestrator A, under the lead's pre-resolved brief |

---

<!-- ANCHOR:adr-003-context -->
### Context

Three YAML steps conflict with the brief or with the packet's shape.

### Constraints

- Writes stay inside this child folder; no commit, push or branch.
- The operator is not available, so every gate is decided here and recorded.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: (1) skip `step_stage_artifact_dir`, because `git add` changes the index the brief keeps frozen; (2) create a `Research Context` subsection under Open Questions in `spec.md`, because the spec-present branch names that host and the Level 1 template has none; (3) steer through `research/inbox.jsonl` and the rendered `next_focus`, because the reducer owns and rewrites the strategy's Next Focus section.

**How it works**: each deviation is logged here and changes nothing outside this folder.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Skip staging, add the host, steer via inbox** | Keeps scope and ownership | Operator stages the run by hand | 9/10 |
| Follow the YAML literally | No deviation | Changes the git index against the brief | 2/10 |
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Scope and reducer ownership both hold.

**What it costs**:
- The run is not staged. Mitigation: the operator stages `research/` when committing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An unstaged audit trail is missed at commit | L | The implementation summary names the folder to stage |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The brief requires this decision for the run to proceed unattended. |
| 2 | **Beyond Local Maxima?** | PASS | The alternatives table names what was rejected. |
| 3 | **Sufficient?** | PASS | It changes nothing outside this folder. |
| 4 | **Fits Goal?** | PASS | It serves forced-depth research of this cluster. |
| 5 | **Open Horizons?** | PASS | The parent synthesis can reuse the record. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `spec.md` gains a Research Context subsection.

**How to roll back**: delete that subsection.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---
<!-- ANCHOR:adr-004 -->
## ADR-004: Executor switches

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-08 |
| **Deciders** | Orchestrator A, under the lead's pre-resolved brief |

---

<!-- ANCHOR:adr-004-context -->
### Context

The brief allows a same-family fallback on an auth or quota error, a timeout, or two failed iterations in a row: cli-deepseek-harness, then cli-pi, then cli-opencode, all DeepSeek V4.1 Flash. Config is read-only after init, so a switch needs a new lineage generation.

### Constraints

- Writes stay inside this child folder; no commit, push or branch.
- The operator is not available, so every gate is decided here and recorded.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: switch only on that evidence, through a restart lineage with the new executor in a fresh config, and log the error text below.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Same-family fallback chain** | Keeps one model family | Fallback CLIs differ in flags | 8/10 |
| Another model family | More capacity | Forbidden by the brief | 0/10 |
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A provider outage does not end the run.

**What it costs**:
- A restart archives nothing here unless a switch happens. Mitigation: the table records every switch.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| All four routes fail | H | Halt and report the blocker with the error text |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The brief requires this decision for the run to proceed unattended. |
| 2 | **Beyond Local Maxima?** | PASS | The alternatives table names what was rejected. |
| 3 | **Sufficient?** | PASS | It changes nothing outside this folder. |
| 4 | **Fits Goal?** | PASS | It serves forced-depth research of this cluster. |
| 5 | **Open Horizons?** | PASS | The parent synthesis can reuse the record. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

| When | From | To | Error evidence |
|------|------|----|----------------|
| Before iteration 6 (2026-11-08) | cli-devin deepseek-v4-1-flash-max | cli-pi opencode-go/deepseek-v4.1-flash, thinking max (dsh skipped) | devin stderr 'Your daily usage quota has been exhausted' (cognition.ai/errorKind resource_exhausted) on dispatch and redispatch of iteration 5; dsh skipped because buildLineageCommand throws 'cli-deepseek-harness requires a lineage directory' in the single-executor path (no lineageDir passed, and the YAML has no dsh branch); pi probe answered 'ok' exit 0. Config stays immutable; the executor is applied at dispatch time and recorded in each iteration's executor provenance. |

**How to roll back**: a switch is a new lineage generation; the previous generation's files stay in `research_archive/`.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---
<!-- ANCHOR:adr-005 -->
## ADR-005: Iteration steering and citation checks

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-08 |
| **Deciders** | Orchestrator A, under the lead's pre-resolved brief |

---

<!-- ANCHOR:adr-005-context -->
### Context

After every iteration the brief requires reading the iteration and its state record, opening at least two of its strongest citations, recording shallow or fabricated work, and steering the next focus at unread releases, unprobed types and unverified claims.

### Constraints

- Writes stay inside this child folder; no commit, push or branch.
- The operator is not available, so every gate is decided here and recorded.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: one row per iteration below, holding the quality verdict, the citation checks with their outcome, and the focus set for the next iteration.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-iteration log here** | One durable place | Long table | 9/10 |
| Notes only in the dashboard | Generated | Reducer rewrites it | 3/10 |
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Every repeated finding has an orchestrator check behind it.

**What it costs**:
- Orchestrator time per iteration. Mitigation: two citations, not all.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Two checks miss a fabricated third citation | M | Findings repeated in the summary are opened individually |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The brief requires this decision for the run to proceed unattended. |
| 2 | **Beyond Local Maxima?** | PASS | The alternatives table names what was rejected. |
| 3 | **Sufficient?** | PASS | It changes nothing outside this folder. |
| 4 | **Fits Goal?** | PASS | It serves forced-depth research of this cluster. |
| 5 | **Open Horizons?** | PASS | The parent synthesis can reuse the record. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

| Iteration | Quality | Citation checks | Next focus set |
|-----------|---------|-----------------|----------------|
| 1 | Deep: 4 findings, manifest and router read, 12 cites resolve | leaf-manifest.json:125-133 CONFIRMED: test -e shows the leaves missing under sk-create-quality-control and present in sk-doc/shared/references; v4.0.0.0.md:278 CONFIRMED the note names sk-code-skilled (registry side not re-checked) | key questions 3 and 4 |
| 2 | Adequate: 3 findings, 5 cites, validators partly run; delta rows omitted findingType and release | forty-of-fifty-threshold.md:82 CONFIRMED: sk-prompt/manual-testing-playbook.md does not exist; sk-code.md:3/35 CONFIRMED: only --dry-run documented for quality, no --apply | key questions 5 and 6, plus finish question 3 |
| 3 | Deep: 6 findings across 13 create commands, typed rows present, 13 cites resolve | README.txt:50 says 21 forms vs sk-design-chart/SKILL.md:114 twenty-nine CONFIRMED; changelog.md:3 four bump values vs sk-create-changelog/SKILL.md:64 five CONFIRMED | key questions 7, 8 and 9, with exact release attribution: use git log --format='%h %cs %s' -- <file> to name the release that introduced each finding instead of |
| 4 | Deep: 4 findings, sk-prompt and validator code read, 10 cites resolve | v4.0.0.0.md:400 DEPTH claim vs sk-prompt/changelog/v4.0.0.0.md:13 removal CONFIRMED; cli-prompt-quality-card.md:192 names cli-opencode twice CONFIRMED; :211 ../../../cli-claude-code from sk-prompt/assets resolves to .skilled/cli-claude-code, DERIVED missing | key question 10 (over-engineering) and the unread releases v4.0.0.13, v4.0.0.14, v4.0.0.15 and v4.0.2.0 |
| 5 | Error: no research done; dispatch failed twice | None: no iteration file was written | Same focus carried to iteration 6 |
| 6 | Shallow: 2 findings, ratio 0.18; over-engineering question from the focus not answered | v4.0.0.13.md:122 rename vs sk-code/hub-router.json:73 'opencode' keyword CONFIRMED by text; mode-registry.json:74 alias CONFIRMED | REDO key question 10 with a concrete method: for each of sk-doc, sk-code, sk-design and sk-prompt, list every file under references/ and assets/ (find), then fo |
| 7 | Deep: 7 findings with validator probes, over-engineering done with a reference count | palette-sheet-ordered/categorical CONFIRMED: rg finds only the files themselves and sk-design/leaf-manifest.json; validate_skill_package.py CONFIRMED by my own probe: only the first frontmatter error (allowed-tools) prints, the dangling link is never reported | release coverage, which is still empty for v4.0.0.1 to v4.0.0.12, v4.0.0.14 and v4.0.0.16 in this cluster, and the misalignment type, which has no finding yet |
| 8 | Deep: 7 findings across v4.0.0.2/.10/.16/v4.0.1.0, misalignment now probed; 6 unique cites | parent-skill-check.cjs:1187 requires only single/orderedBundle/defer CONFIRMED; parent-hub-router-schema.md:96 outcome rule CONFIRMED by text | releases v4.0.0.1, v4.0.0.3, v4.0.0.11, v4.0.0.12 and v4.0.0.14, still empty for this cluster: find each release's commits touching the four hubs with git log - |
| 9 | Adequate: 5 findings, repo-rule checker code read; 7 unique cites; several releases tagged 'present at' instead of a release | check-repo-rules.cjs:40 COVERAGE_THRESHOLD 0.3 and :272-275 divide by bullet word count CONFIRMED by text; git status shows no new write outside the packet | REQUIRED: the release field must be one tag (v4.0.0.N or v4.0.N.0) found with git log --format='%h %cs %s' --follow -- <file>, never 'present at' |
| 10 | Deep: 6 findings on v4.0.0.11/.12/.6, typed with single release tags; 7 cites | sk-prompt hub-router.json/mode-registry.json/description.json absence CONFIRMED by ls; whether sk-prompt should be a hub is judgment, UNVERIFIED; prompt/improve.md:31 ROUTER CONTRACT heading position CONFIRMED by text | an attribution pass over every finding this run has logged (read all deltas/iter-*.jsonl finding rows) |
| 11 | Adequate: attribution done by restating releases (unplaced 6 to 3), 5 findings incl. retractions; one retraction is wrong | f-iter011-001 retraction REJECTED: v4.0.0.16.md:338 says 'run /doctor:sk-code quality, then --apply' while _routes.yaml quality target allows only --dry-run (engine --apply runs internally after approval), so f-iter002-002 stands as an operator-facing drift; leaf-manifest.json:137 packet name CONFIRMED | Checkpoint scored; run closed |

**How to roll back**: not applicable; this is a log.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---
<!-- ANCHOR:adr-006 -->
## ADR-006: Depth checkpoints and extensions

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-08 |
| **Deciders** | Orchestrator A, under the lead's pre-resolved brief |

---

<!-- ANCHOR:adr-006-context -->
### Context

After iteration 10 the brief scores the child: every release read, all seven types probed, strongest claims verified, and no new P0 or P1 in the last three iterations. Below the bar, the run extends by five.

### Constraints

- Writes stay inside this child folder; no commit, push or branch.
- The operator is not available, so every gate is decided here and recorded.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: score each checkpoint against those four tests and extend by raising `maxIterations` through a resume, logged below.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Score and extend by five** | Depth by evidence | Longer run | 9/10 |
| Stop at ten | Faster | May stop mid-discovery | 3/10 |
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The run stops on evidence of depth, not on an iteration count.

**What it costs**:
- More dispatches. Mitigation: five at a time.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| New P0 findings keep appearing | M | Each extension is logged; the lead sees the trend |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The brief requires this decision for the run to proceed unattended. |
| 2 | **Beyond Local Maxima?** | PASS | The alternatives table names what was rejected. |
| 3 | **Sufficient?** | PASS | It changes nothing outside this folder. |
| 4 | **Fits Goal?** | PASS | It serves forced-depth research of this cluster. |
| 5 | **Open Horizons?** | PASS | The parent synthesis can reuse the record. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

| Checkpoint | Score | Decision |
|------------|-------|----------|
| Mid-run, after the quota error (lead instruction) | One iteration was a dispatch error with no research, so ten state-log rows would give nine productive iterations | Ceiling raised from 10 to 11 rows so ten productive iterations run before the depth bar is scored; applied at dispatch time, config untouched |
| Checkpoint 1, after 10 productive iterations (11 rows) | Releases: all 13 ranges plus pre-v4 hold a finding (3 of 49 rows unplaced); types: all seven present (misalignment 4, extension 3); strongest claims opened, one wrong retraction rejected; new P0/P1 in iterations 9-11: 0 (0, 0, 0) | Clears the bar. No extension; close the run and synthesize |

**How to roll back**: not applicable; this is a log.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---
<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set. No operator answers were captured: the operator was not available and every decision above was pre-resolved by the lead's brief.
<!-- /ANCHOR:operator-answers-verbatim -->

---
