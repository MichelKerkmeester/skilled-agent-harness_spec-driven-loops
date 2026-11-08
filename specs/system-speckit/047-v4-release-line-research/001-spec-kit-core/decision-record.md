---
title: "Decision Record: Phase 1: spec-kit-core"
description: "Run decisions for the spec-kit-core research loop: configuration, workflow execution, deviations, executor switches, per-iteration steering and depth checkpoints."
trigger_phrases:
  - "spec kit core decision record"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "scaffold/001-spec-kit-core"
    last_updated_at: "2026-11-08T22:34:13Z"
    last_updated_by: "orchestrator-a"
    recent_action: "Run closed after the depth bar cleared at iteration 20; research.md synthesized"
    next_safe_action: "Parent synthesis reads research/research.md"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-spec-kit-core-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 1: spec-kit-core

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
| Before iteration 5 (2026-11-08) | cli-devin deepseek-v4-1-flash-max | cli-pi opencode-go/deepseek-v4.1-flash, thinking max (dsh skipped) | devin stderr 'Your daily usage quota has been exhausted' (cognition.ai/errorKind resource_exhausted) on dispatch and redispatch of iteration 4; dsh skipped because buildLineageCommand throws 'cli-deepseek-harness requires a lineage directory' in the single-executor path (no lineageDir passed, and the YAML has no dsh branch); pi probe answered 'ok' exit 0. Config stays immutable; the executor is applied at dispatch time and recorded in each iteration's executor provenance. |

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
| 1 | Deep: 3 findings, classifier code read and run, 9 cites resolve | gate-3-classifier.ts:731/849 CONFIRMED by running classifyPrompt ('Update the README and review the result.' returns false, read_only_override); v4.0.0.0.md:93 scope-adherence CONFIRMED absent (rg finds SCOPE_ADHERENCE only in changelogs) | key questions 2 and 3 |
| 2 | Deep: 3 findings with a validate repro, 13 cites resolve | orchestrator.ts:975-976 CONFIRMED: phase parent returns ANCHORS_VALID pass before any anchor scan; lookup-trigger-index.mjs:26 CONFIRMED exit-code comment (1 = no candidates) matches the stale-vs-absent ambiguity claim | key questions 4 and 5 |
| 3 | Deep: 5 goal-system findings, 13 cites resolve | check-goal.cjs:703 logic CONFIRMED by text; PARTIAL on behaviour: my run of check-goal.cjs --all exits 2 (corpus has errors), so the findings-but-exit-0 path was not reproduced; goal.cjs:211-218 prints chat_slice after packet_budget CONFIRMED by text | key questions 6 and 7, and reproduce the check-goal exit claim on a fixture corpus with findings but no errors (under /tmp) to settle it |
| 4 | Error: no research done; dispatch failed twice | None: no iteration file was written | Same focus carried to iteration 5 |
| 5 | Deep: 7 findings with /tmp repros, first cli-pi iteration, 13 cites resolve | check-goal.cjs:703 vs :714 DERIVED-CONFIRMED (corpus returns 0 whenever errors is empty, per-packet returns 1 on findings); create.sh:2253 TEMPLATES_BASE from REPO_ROOT CONFIRMED; release-update.cjs:54 USAGE vs update.md:38 action sets CONFIRMED | key questions 8 and 9 plus the small releases |
| 6 | Adequate: 5 findings but only 7 cites; one claim overstated, one unverified | environment-variables.md 0 SESSION_RELAUNCH matches CONFIRMED; sync-phase-map-status.ts PARTIAL: plain node exits ERR_MODULE_NOT_FOUND, tsx runs it (prints unknown argument); README.txt:116 '9-command' vs 'ten' UNVERIFIED: .skilled/commands/speckit holds 7 command .md files | key questions 10, 11 and 12 |
| 7 | Deep: 10 findings incl. two self-corrections, UX error texts run; SCOPE VIOLATION found later: an untracked specs/001-test-feature/ (created 21:27, inside this iteration window, matching its create.sh probes) sits outside the run directory; left in place for the operator because deleting an untracked folder needs their yes, and no containment event recorded it | validate.sh:104 unknown-option exit 1 CONFIRMED by text; README.txt:116/:67 inventory mismatch CONFIRMED against 7 .md files on disk; module-header sweep (f-iter007-008) not re-run by orchestrator | key question 4, still unprobed: continuity save and resume |
| 8 | Deep: 7 continuity findings from generate-context.ts and save-workflow.md; 6 unique cites, below the 10 floor | spec-doc-structure.ts:1289 skip path CONFIRMED by my strict validate run printing 'No routing payload supplied; contamination check skipped'; save-workflow.md:426/:432 router text CONFIRMED | releases with no finding yet in this cluster: v4.0.0.15 (Spec Kit), v4.0.0.16, v4.0.1.0 (Spec Kit, Manual Testing Playbooks, Retired Surfaces) and v4.0.2.0 (Dec |
| 9 | Deep but one overstated P1 and typed fields dropped again; 7 unique cites | f-iter009-001 DOWNGRADED: generate-trigger-index --check exits 1, but the 43 stale rows are 38 docs of this in-progress research packet plus 5 in specs/001-test-feature/, an untracked folder created 21:27 that matches iteration 7's create.sh probes, so 'clean checkout' is false; orchestrator records the stray folder for the lead; MEASURED_BEHAVIOR registry rows :239/:243 CONFIRMED | REQUIRED: every delta finding row carries findingType and release (iteration 9 dropped both) |
| 10 | Deep: 5 findings including the order-asymmetry root cause of the Gate 3 bug; 7 cites | gate-3-classifier.ts:731/:735 forward-only span and :854 read_only_override CONFIRMED by text and by my own classifyPrompt run in iteration 1 review | an attribution pass over every finding this run has logged (read all deltas/iter-*.jsonl finding rows) |
| 11 | Deep: attribution pass (28 rows, 0 unplaced) plus 6 new findings incl. a corrected release; 5 cites | attribution rows read and folded into the coverage table; f-iter011-005 correction cites git log -S result 6f42c7b169 (2026-10-31), consistent with v4.0.1.0; extract-from-evidence.cjs:549 strip call CONFIRMED by text | verification of the run's P1 findings, since new P1s are still appearing: for each P1 in the registry (Gate 3 order asymmetry, ANCHORS_VALID phase-parent skip,  |
| 12 | deep: 10 findings, 19 unique cites, four P1 repros confirmed in /tmp, trigger-index P1 downgraded with mechanism | opened check-goal.cjs:59 (path.resolve(__dirname,'../../../../../')) and config.ts:99 (usesSpecKit tests .skilled/skills/system-spec-kit): both match the claims | Improvement and over-engineering pass, the two thinnest types (2 and 4 rows) |
| 13 | deep: 10 findings, 32 unique cites, a fix row for each confirmed P1, three over-engineering rows with counts | node read of validator-registry.json gives 42 rules {error 32, warn 8, info 2}, no skip (confirms f-iter013-007); gate-3-classifier.ts:840-842 shows the resume branch can return triggersGate3 false despite the ':835 ALWAYS required' comment (confirms f-iter013-001); orchestrator.ts:192 returns 'phase' for a phase parent (confirms f-iter013-008) Lead correction: the cli-classifier.zip containment quarantine entry seen after this iteration came from a sibling orchestrator executor running package_skill.py without --check at the repo root, not from this child; from here on every focus restricts generators, packagers, create.sh and save scripts to check or dry-run mode or /tmp copies. | Release-coverage and UX pass |
| 14 | deep: 6 findings, 18 unique cites, two P1 UX rows with live repros and one release-note omission found by diff | re-ran lookup-trigger-index.mjs -- 'validaton rulles strict': 20 rows all 0.000, exit 0, while --json --scoring-only exits 1 (confirms f-iter014-001); check-source-tags.sh:28-33 degrades a helper failure to warn and returns 0, and orchestrator.ts:1508 prints RESULT from report.passed alone (confirms the mechanism of f-iter014-002) | Bug and extension pass on surfaces not yet read |
| 15 | deep: 5 findings, 23 unique cites, one new P1 (post-edit placeholder wrapper fails where the rule only warns) with a mechanism traced across both scripts | recommend-level.sh --files 5 prints Recommended Level: 0, Score 7/100 despite :172-173 marking both inputs required (confirms f-iter015-003); grep -ci draft on the wrapper finds only its header comment while the rule script has 16 draft references, so the wrapper has no Draft deferral (confirms the mechanism of f-iter015-001) | Verification pass before the depth checkpoint |
| 16 | deep: verification table for ten P1s plus 6 findings, 20 unique cites; one new P1 (check-goal corpus and packet paths disagree on a finding); V8 ruled out a different scenario than iteration 15 claimed | require(runtime/dist/core/config.js).resolveProjectRoot is undefined (confirms f-iter016-005); orchestrator reproduced f-iter015-001 on a /tmp Draft packet: the wrapper exits 1 with FAIL while validate.sh --strict shows PLACEHOLDER_FILLED as a warn, so V8 (a non-Draft handover token) does not refute it. Checkpoint 2 scored below bar, ceiling raised to 21 | Dist-versus-source drift pass |
| 17 | deep: 6 findings, 23 unique cites; its P0 is lowered to P1 by the orchestrator, and it corrects iteration 16's config.js claim as a path collision | git check-ignore -v shows .gitignore:60 dist/ ignoring runtime/cli/dist/continuity/generate-context.js and git ls-files on runtime/cli/dist returns 0 (confirms the core of f-iter017-001); doctor-install.yaml:34 probes runtime/dist, not runtime/cli/dist, while cli/package.json:13 has a build script, so the orchestrator lowered it to P1; require of runtime/cli/dist/core/config.js shows resolveProjectRoot is a function (confirms f-iter017-004) | Fresh-clone path pass |
| 18 | deep: 6 findings, 21 unique cites; its first P1 sharpens f-iter017-001 (folded in), its second P1 lowered to P2 on evidence | runtime/tsconfig.json references only ../shared while the skill-root tsconfig.json:18-20 lists shared, runtime and runtime/cli, so the repair line validate.sh prints at :409/:432 does not build runtime/cli/dist (confirms f-iter018-001); node on a missing path prints Cannot find module '<exact path>', so f-iter018-002 is diagnosable and lowered to P2 | New ground: the shared/ package and the session hooks |
| 19 | deep: 6 findings, 24 unique cites on the spec gate hooks; its P1 lowered to P2 on evidence, so no new verified P1 (second clean iteration after 17) | spec-gate-core.mjs:400/:1624/:1769 compare SYSTEM_SPEC_GATE_DISABLED to '1' only while ENV-REFERENCE.md:248 documents 1/true/yes/on (confirms f-iter019-001); f-iter019-003 lowered: resolveGuardPaths already applies projectDir\|\|process.cwd() at :806 and appendWarningLog catches its own errors at :978-987, so the unguarded second call at :1876 repeats a call that just succeeded | Repo-root resolution, one more surface |

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
| Checkpoint 1, after 10 productive iterations (11 rows) | Releases: all 13 ranges plus pre-v4 hold a finding after the attribution pass (0 unplaced of 59); types: all seven present, misalignment thin (1 placed); strongest claims opened, two corrected; new P0/P1 in iterations 9-11: 5 (1, 2, 2) | Below bar: still finding new P1s. Extend by five to 16 rows |
| Checkpoint 2, after 16 rows (15 productive) | Releases: each v4.0.x.y release read and either holds a finding or is stated empty in scope (v4.0.0.15 added by iteration 16); types: all seven present; strongest claims: iteration 16 re-ran ten P1 repros (7 confirmed, 2 changed, 1 ruled out by a different scenario) and the orchestrator re-ran three; new P1s in iterations 14-16: 14 had two (trigger lookup score-0 rows, SOURCE_TAGS skip printing PASSED), 15 one (placeholder wrapper vs Draft rule), 16 one (check-goal corpus and packet paths disagree on a finding) | Below bar: new P1s still appear in each of the last three iterations. Extend by five to 21 rows |
| Close, after 20 rows (19 productive) | Releases: every coverage row from pre-v4.0.0.0 to v4.0.2.0 holds at least one finding (v4.0.0.4 to .10 share one commit, read in iteration 14); types: all seven present in most release rows; strongest claims: iteration 16 re-ran ten P1 repros and the orchestrator re-ran the top five at close; new verified P0 or P1 in iterations 18, 19 and 20: none (18's first P1 folded into f-iter017-001 and its second lowered to P2; 19's P1 lowered to P2 on code evidence; 20's two P1s are new angles on f-iter012-006, one lowered to P2) | Bar met: three consecutive productive iterations clean and the coverage items hold. Close at 20 rows under the lead's early-close ruling; ceiling 21 not used |

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
