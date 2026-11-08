---
title: "Decision Record: Phase 5: doctor-git-ci-runtime"
description: "Run decisions for the doctor-git-ci-runtime research loop: configuration, workflow execution, deviations, executor switches, per-iteration steering and depth checkpoints."
trigger_phrases:
  - "doctor git ci runtime decision record"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "scaffold/005-doctor-git-ci-runtime"
    last_updated_at: "2026-11-08T22:34:13Z"
    last_updated_by: "orchestrator-a"
    recent_action: "Run closed after the depth bar cleared at iteration 22; research.md synthesized"
    next_safe_action: "Parent synthesis reads research/research.md"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-doctor-git-ci-runtime-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 5: doctor-git-ci-runtime

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
| 1 | Deep: 7 findings, doctor routes and scripts read and run, 26 cites resolve | route-validate.sh CONFIRMED: exit 0 with 11 WARN lines; symlink-engine.cjs --help CONFIRMED: 'ERROR: unknown flag: --help', exit 2 | key questions 3 and 4 |
| 2 | Deep: 3 findings plus sk-git hook reading, 18 cites resolve; delta rows omitted findingType and release | doctor-runtime-mirrors.yaml/_routes.yaml/runtime-mirrors.md CONFIRMED 0 references to check-agent-mirror-sync; agent-mirror-crosswalk.md:16 'twelve' vs 11 .skilled/agents/*.md CONFIRMED; .dsh exists CONFIRMED | key questions 5 and 6, and the sk-git repro left open |
| 3 | Thin: 2 findings, CI workflows barely read; release field malformed | AGENTS.md 27,587 bytes, head -c 16384 ends at line 179 CONFIRMED; .opencode/skills is a symlink to .skilled/skills, so chart-corpus.yml:47 path resolves (not a finding) | redo key question 5 properly: list every file in .github/workflows, and for each name its trigger, the scripts and paths it runs (check each exists), its switch |
| 4 | Adequate: 5 findings, mostly agent-count drift in cli-* docs (overlaps sibling 003 cluster), 5 cites | claude-tools.md:247 and agent-delegation.md:3 count claims CONFIRMED by text against 11 files in .skilled/agents; ci.json:20 exempt list CONFIRMED | key questions 2 and 4, which no iteration has covered yet |
| 5 | Error: no research done; dispatch failed twice | None: no iteration file was written | Same focus carried to iteration 6 |
| 6 | Deep but one wrong finding: 4 findings with hook repros on cli-pi; f-iter006-003 is FALSE | f-iter006-003 REFUTED: .opencode/scripts is a symlink to ../.skilled/scripts, so the 'two byte-identical hook trees' is one tree; f-iter006-001/002 premise CONFIRMED: no .sk-git/ and git config skgit.contractDir unset (exit 1); commit-msg:14/23 CONFIRMED 'no rules block is not checked' | correct the record first: state in Findings that f-iter006-003 is withdrawn because .opencode/scripts is a symlink (ls -la .opencode/scripts), and always check  |
| 7 | Adequate: 4 findings, 11 cites, code read | .env.example banners 1-14 then 16-19 CONFIRMED (no 15); validate.sh:132-135 returns before sourcing hook-flags.sh with only a warning CONFIRMED; README.md:179 vs plugin import :21 CONFIRMED by text | read code and diffs, not notes |
| 8 | Deep: 6 findings from overlay engine, CI and ci-toggle code, 13 cites | sk-git-script-tests.yml has one run step (:51) while sk-git/scripts/tests holds five suites CONFIRMED by ls and grep; overlay-engine.cjs:433 vs :437 two message variants CONFIRMED by text | the repo-rules half of key question 6 and key question 11 (misalignment, nearly empty) |
| 9 | Deep: 6 findings on command format and repo-rules; 6 unique cites | ci.md:4 grants Write CONFIRMED; command-template.md has 0 skill_agent mentions CONFIRMED | key questions 10 and 12 and the v4.0.0.11/v4.0.0.12 releases |
| 10 | Deep: 10 findings from running every doctor engine; one count claim refuted; 7 unique cites | f-iter010-007 REFUTED in part: find -type l gives .pi 58, .codex 26, .dsh 79, .opencode 23 symlinks, not 0 (copied .md files do exist); install.md:73-74 vs doctor-install.yaml:59 --root binding CONFIRMED by text; route-validate.sh:17-18 exit taxonomy CONFIRMED | first correct f-iter010-007 with find <dir> -type l counts per runtime folder and say which mirrored kinds (agents, commands, prompts, skills) are copies vs lin |
| 11 | Deep: 4 findings from symlink-engine and git-setup-check code, 9 cites | .claude/agents 13 files 0 links and .cursor/agents links into it CONFIRMED by find/ls; symlink-engine.cjs:1795-1801 returns 0 after emit CONFIRMED | bugs with repros, the thinnest type: take the P1 findings already logged (install-checklist fail-open commit-msg, symlink-engine check always exit 0, /doctor:ru |
| 12 | Deep: 7 findings with /tmp repros, P1s re-verified; 7 cites | git-setup-check.cjs:354-368 resolves hooks via git rev-parse --git-path hooks CONFIRMED by text, and the global core.hooksPath (~/.config/git/hooks) that makes it PASS on a hookless repo CONFIRMED by git config --global; symlink-engine.cjs:1801 return 0 CONFIRMED earlier | an attribution pass over every finding this run has logged (read all deltas/iter-*.jsonl finding rows) |
| 13 | Deep: attribution pass (12 rows, 0 unplaced) plus 4 findings incl. a red AGENTS.md canary; 5 cites | agents-md-manifest.cjs --check prints FAIL 'the recorded body 865f058927ed is no longer released' CONFIRMED by my run; no .github/workflows file names agents-md-manifest CONFIRMED by grep; f-iter013-004 narrows f-iter002-001 (agent-mirror-sync.yml runs the checker in CI) | run the body-parity checkers that exist and report real drift: node .skilled/bin/check-agent-mirror-sync.cjs --all, each sync script in doctor-runtime-mirrors.y |
| 14 | deep: 5 findings, 28 unique cites, two P1 drift rows; f-iter014-004 used an out-of-scale severity P3, read as P2 | ran agent-roster-mirror-check.cjs --check and command-catalog-mirror-check.cjs --check: both exit 2 (confirms f-iter014-003); wc -c code.md gives 49002/48781/48863 and mirror-sync-verify.cjs:50-54 lists only opencode, claude, codex (confirms f-iter014-001) | Improvement, over-engineering and extension pass, with a concrete fix per confirmed P1 |
| 15 | deep: 10 findings, 18 unique cites, every confirmed P1 now has a fix row; one over-engineering row refuted (the third symlink-resolution error in this child) | sed -n 51p sk-git-script-tests.yml runs only worktree-naming.test.sh against 5 suites on disk (confirms f-iter015-003); f-iter015-007 REFUTED: .opencode/bin is a symlink to ../.skilled/bin (git ls-files mode 120000) and cmp says identical, so CI runs the canonical checker, not a copy Lead correction: the cli-classifier.zip containment quarantine entry seen after this iteration came from a sibling orchestrator executor running package_skill.py without --check at the repo root, not from this child; from here on every focus restricts generators, packagers, create.sh and save scripts to check or dry-run mode or /tmp copies. | Final pass for this child: verification and the release gaps |
| 16 | solid: 4 rows, 14 unique cites, one new P1 (the opencode arm compares a file with itself) and a release-range attribution confirmed; f-iter016-001 is a withdrawal row, excluded as a finding | ls -ld .opencode/agents shows a symlink to ../.skilled/agents, git ls-files -s mode 120000 (confirms f-iter016-002); git rev-list -n1 for v4.0.0.4, v4.0.0.7 and v4.0.0.10 all give 4d8f403355 (confirms f-iter016-003). Checkpoint 2 scored below bar, ceiling raised to 21 | Bug pass on doctor routes this child has cited least |
| 17 | deep: 7 findings, 34 unique cites, all P2 (first iteration since the extension with no new P1); every finding pairs a route asset line with the script line that contradicts it | ran ci-report.cjs --no-gh --sha=<40 uppercase hex>: prints usage and exits 2 (confirms f-iter017-002); release-update.cjs:2642 maps every non-usage error to exit 1 while doctor-update-check.yaml:127 documents only 0 and 2 (confirms f-iter017-001); ENV-REFERENCE.md:131 carries the third header shape 'Variable \| Set to \| Read by' (confirms the mechanism of f-iter017-003) | CI workflow pass |
| 18 | solid: 5 findings, 11 unique cites (just over the floor); its P1 restates f-iter015-003 at tree scope, so no new P1 class: second iteration in a row without one | grep -rl over .github finds 0 references to stamp-branch, migrate-legacy-branch-names and validate-message-git-timeout, and the single commit-id-naming hit is broken-move-drill.sh naming the script, not the test (confirms f-iter018-001); ls .github/workflows counts 32 .yml against '33 workflows' at v4.0.0.16.md:58 (confirms f-iter018-003) | Final sweep before the depth checkpoint: hooks and runtime wiring |
| 19 | deep: 4 findings, 16 unique cites, one new P1 reproduced live (hook status reports SHADOWED for hooks reached through the .opencode/scripts alias), so the depth bar is not met at 19 | ran GIT_CONFIG_GLOBAL=/dev/null install-git-hooks.sh --status: 6 SHADOWED lines (the iteration said 7), and .git/hooks/commit-msg links to .opencode/scripts/git-hooks/commit-msg, the same file via the symlink; resolve_target at install-git-hooks.sh:99-110 follows one hop and compares strings (confirms f-iter019-001) | Symlink-alias sweep: f-iter019-001 shows that comparing paths as strings across the .opencode -> .skilled aliases produces false results |
| 20 | deep: 6 findings, 25 unique cites, all P2, and eight path comparisons audited and cleared; no new P1, the first clean iteration after 19 | ls -ld shows .opencode/agents a symlink and .opencode/commands a real directory (confirms f-iter020-002); worktree-status.sh:72 strips MAIN_ROOT with no separator and a bash repro maps /Users/dev/Skilled-old/work/wt2 to -old/work/wt2 (confirms f-iter020-003) | Last iteration of this child: consolidation and extension |
| 21 | deep: 5 findings, 15 unique cites; re-ran the six P1 repros, corrected iteration 19's mechanism (same defect), and ranked three fixes; its extension P1 lowered to P2 | the orchestrator's earlier run matches f-iter021-001 (6 SHADOWED lines, .git/hooks/prepare-commit-msg absent per ls -ld); f-iter021-003 is a ranking, not a defect, so lowered to P2. Checkpoint 3 below bar under the lead's ruling, ceiling raised to 26 | Uncited doctor scripts |

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
| Checkpoint 1, after 10 productive iterations (11 rows) | Releases: v4.0.0.12 has no finding; types: all seven present but bug thin among release-placed rows (10 of 51 rows unplaced); strongest claims: opened and confirmed, two refuted and corrected; new P0/P1 in iterations 9-11: 7 (0, 6, 1) | Below bar: still finding new P1s. Extend by five to 16 rows |
| Checkpoint 2, after 16 rows (15 productive) | Releases: v4.0.0.4 to v4.0.0.10 share one commit (4d8f403355, a trigger-index rebuild) with nothing in scope, confirmed by git rev-list; all seven types present; strongest P1s re-run with exit codes and opened by the orchestrator; new P1s in iterations 14-16: 14 had two (RUNTIME_MIRRORS misses .pi, two canonical agent roots), 15 added RUNTIME_MIRRORS covering 3 of 7 trees, 16 added the opencode arm comparing a file with itself | Below bar: new P1s still appear in each of the last three iterations. Extend by five to 21 rows |
| Checkpoint 3, after 21 rows (20 productive) | Releases: iteration 21 read v4.0.0.5 to .7 and found in-scope changes with no finding (recorded as drift); all seven types present; the six strongest P1s re-run read-only and confirmed; new P1s in iterations 19-21: 19 one (hook --status SHADOWED via the alias, reproduced by the orchestrator), 20 none, 21 none (f-iter021-001 corrects 19's mechanism and is the same defect; f-iter021-003 is an extension ranking, lowered to P2) | Below bar under the lead's no-close-at-ceiling ruling: iteration 19's P1 survived verification. Extend by five to 26 rows and score after each iteration; close once three productive iterations in a row hold no new verified P0 or P1 |
| Close, after 22 rows (21 productive) | Releases: every row of the coverage table from pre-v4.0.0.0 to v4.0.1.0 holds at least one finding, v4.0.0.4 to .10 share one commit and iteration 21 named the in-scope changes in .5 to .7; types: all seven present; strongest claims: the six P1 repros re-run by iteration 21 and the top five re-checked by the orchestrator at close; new verified P0 or P1 in iterations 20, 21 and 22: none (21's P1 rows are a corrected restatement of 19 and an extension ranking lowered to P2; 22 is all P2) | Bar met: three consecutive productive iterations clean and the coverage items hold. Close at 22 rows under the lead's early-close ruling; ceiling 26 not used |

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
