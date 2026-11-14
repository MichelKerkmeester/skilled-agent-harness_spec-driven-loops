---
title: "Feature Specification: Phase 19: dsh-single-executor-hardening"
description: "The single DeepSeek Harness lineage shipped in phase 018 leaves stale harness homes behind, lets any env key past the allowlist, echoes up to a megabyte of event stream per iteration and falls through to native in :confirm. A live review on it also showed three loop-health faults. This phase closes the five Fable P2 items still open and plans the three loop faults."
trigger_phrases:
  - "dsh single executor hardening"
  - "phase 19 dsh single executor hardening"
  - "dsh dispatchEnv allowlist"
  - "stale dsh home sweep"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: dsh-single-executor-hardening

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/376-dsh-single-executor-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-dsh-single-executor-loop |
| **Successor** | None |
| **Handoff Criteria** | The two named deep-loop suites pass with the new tests, the contract drift check prints `[CONTRACT DRIFT] OK commands=3` and the full deep-loop suite shows no new failure beside the one timing test that fails today |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the Harden the single DeepSeek Harness lineage in deep review and research and close the review's open P2 items specification.

**Scope Boundary**: The deep-loop runtime that dispatches a harness lineage (`executor-audit.ts`, `fanout-run.cjs`), the four review and research workflow assets and their two presentation files, two reducer scripts the live review exposed, the regenerated command contracts and one changelog entry with its version bump. No change to the harness itself or to `.dsh/`.

**Dependencies**:
- Phase 018 is built and committed as `1bedb33577`. Its spec-gate key, repo-root prompt line and timeout margin are already in both auto workflows, so this phase does not redo them.
- The operator decides item C6 before its edit runs. The other seven items need no decision.

**Deliverables**:
- A per-kind allowlist for `dispatchEnv`, an opt-out for the stdout echo and a sweep of stale harness homes
- A `:confirm` refusal for every executor kind that workflow has no branch for
- The finding registry and the graph coverage signal fixed for the two faults the live review showed
- Changelog `v1.6.26.0` saying the harness runs as a single lineage in `:auto`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Phase 018 lets `/deep:review` and `/deep:research` run one DeepSeek Harness lineage, but four of the Fable review's P2 points on that plan are still open. A killed step strands its harness home in the temp folder, `dispatchEnv` takes any key past the env allowlist, every iteration echoes the harness's whole JSON event stream into the orchestrator and `:confirm` silently falls through to no branch for the harness. The first live review on that path also left a state log with no executor identity, a finding registry with duplicate rows and a graph veto that blocked STOP while every dimension was covered.

### Purpose
Close the open review points on the single harness lineage and the three loop-health faults its first live run exposed, so a harness review runs clean, refuses where it cannot run and records what it did.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Run from the worktree root on 2026-11-14 at `1bedb33577`. `REV` is `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/review`, the five-iteration review that ran on this branch. `DL` is `.skilled/skills/system-deep-loop/runtime`.
```text
$ node -e '<list dsh-home-* in os.tmpdir() with age>'
dsh-home-AFDds1 196.4h
dsh-home-JIkuKN 196.4h
dsh-home-KvE1e6 196.4h
dsh-home-bkKq5B 196.4h
dsh-home-cli001-llmgateway-verified.XElvUI 192.0h
dsh-home-cli001-llmgateway.8snHOl 192.0h
dsh-home-cli001-opencode-go-verified.gIqaJ5 192.0h
dsh-home-cli001-opencode-go.sTnxlK 192.0h
dsh-home-cli001.ibRVE2 192.0h
dsh-home-fduqHI 196.4h
dsh-home-uLDvUT 196.4h

$ sed -n 1229p $DL/lib/deep-loop/executor-audit.ts
    env: { ...buildExecutorDispatchEnv(input.executor, input.guardContext?.env ?? process.env), ...input.dispatchEnv },

$ wc -c <one-iteration dsh lineage stdout logs, 013-dsh-live-contract-pin> <five-iteration dsh review lineage log>
  616174 .../013-dsh-live-contract-pin/research/fanout-live/lineages/dsh-live/logs/fanout-lineage.out
  431422 .../013-dsh-live-contract-pin/research/fanout-live-2/lineages/dsh-live-2/logs/fanout-lineage.out
 1008701 <main checkout>/specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/review/lineages/dsh-1/logs/fanout-lineage.out

$ rg -o '^\s+if_cli_[a-z_]+:' .skilled/commands/deep/assets/deep-review-confirm.yaml
        if_cli_claude_code:
        if_cli_opencode:

$ node -e '<read REV registry and state log>'
rows 9 unique ids 7
R1-P1-001 .skilled/hooks/session-relaunch/lib/nudge.cjs 27 null
R1-P1-001 .skilled/hooks/session-relaunch/lib/nudge.cjs 24 null
R2-P2-001 .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts null null
R2-P2-001 .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts 228 null
dimensionCoverage {"correctness":true,"security":true,"traceability":true,"maintainability":true}
state types {"config":1,"event":13,"iteration":5}
iteration records 5 with executor 0
graphDecision "STOP_BLOCKED"
graphSignals {"dimensionCoverage":0.5,...}

$ node $DL/scripts/convergence.cjs --spec-folder <REV's packet> --loop-type review --session-id 2026-11-14T11:01:50.956Z --read-only
{"status":"ok","data":{"decision":"STOP_BLOCKED",...,"signals":{"dimensionCoverage":0.5,...},...,"nodeCount":87,"edgeCount":97,...}

$ node <read the same session graph read-only, list DIMENSION nodes and edge relations>
nodes 87 edges 97 dimension nodes dimension:correctness,dimension:security,dimension:traceability,dimension:maintainability,dim:security,DIM-TRACEABILITY,dim:maintainability,dim:correctness
{"COVERS":97}

$ node <the same, with each DIMENSION id mapped to dimension:<lowercase name>>
canonical dimension nodes dimension:correctness,dimension:security,dimension:traceability,dimension:maintainability covered 4 rule 1
```
The first list holds six homes that match the default `dsh-home-XXXXXX` pattern, each about 196 hours old, and five named homes left by the phase 001 prototypes. The four registry rows are each pair's file, line and content hash.

The graph holds eight DIMENSION nodes for four dimensions. The workflow seeds `dimension:<name>` and covers each one with `COVERS` edges. The leaf's own graph events added `dim:security`, `DIM-TRACEABILITY`, `dim:maintainability` and `dim:correctness` as four more, and none of their edges reached the graph. Four covered of eight reads `0.5`, under the `0.8` threshold, so the veto held while every dimension was covered.

Test baselines at the same commit: `executor-branch-contract.vitest.ts` and `executor-audit-cli-branch-receipts.test.ts` together print `11 passed` (6 and 5). `check-contract-drift` and `compile-command-contracts` tests print `23 passed`. `npm run typecheck` in `DL` exits 0. The full `DL` suite prints `1 failed | 2893 passed | 8 skipped (2902)`, and the one failure is the timing test `does not orphan an exited-but-still-writing worker while artifact progress continues` in `tests/unit/fanout-pool.vitest.ts`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope

Each item names its source. Fable is the independent Fable 5.2 review of phase 018's plan, Part B of `04-session-review.md` in the main checkout's `006-purpose-retention-across-handovers/scratch/fable-review-2026-11-14/`. Deep review is the five-iteration `/deep:review` whose report is `REV/review-report.md`, which ran on this phase's single harness lineage.

| Item | Severity | Source | Change |
|------|----------|--------|--------|
| C1 | P2 | Fable B-P2-1, the sweep half | Sweep `dsh-home-XXXXXX` folders older than 24 hours from the temp folder before a new home is made, in fan-out and in both auto workflows. The timeout-margin half shipped in `1bedb33577` |
| C2 | P2 | Fable B-P2-2 | Check each `dispatchEnv` key against a short per-kind list and refuse before spawn when one is not on it |
| C3 | P2 | Fable B-P2-3 | Add `echoStdout: false` to the runner input and set it in the two harness branches, so the step prints a byte count instead of the event stream |
| C4 | P2 | Fable B-P2-4, the changelog half | Write changelog `v1.6.26.0` and bump the hub version in four files. The scaffold-docs half was closed in phase 018 |
| C5 | P2 | Fable, "What I could not check" | Refuse in both `:confirm` workflows for every executor kind that workflow has no branch for, and say so in both presentation files |
| C6 | P2 | Deep review, `review-report.md:210` | Keep the executor identity of each iteration somewhere the state log keeps. Gated on the operator's choice in section 10 |
| C7 | P2 | Deep review, `review-report.md:78` | Fold a re-verified finding at a shifted line into its first row instead of a second one |
| C8 | P2 | Deep review, `review-report.md:201` | Map each review DIMENSION node id to the canonical `dimension:<name>` at graph upsert, and its edge ends with it, so a leaf's own id never adds a phantom dimension |

### Out of Scope
- The Fable Part B P1 items - the spec-gate key and the repo-root prompt line shipped in `1bedb33577`, and the orchestrator says not to plan them.
- The claim-adjudication miss in `review-report.md:202` - the orchestrator's matcher searched for an id prefix the narrative does not use, and the run itself wrote a corrected event. No script in this tree owns that matcher.
- The `fanout-pool.vitest.ts` timing failure - it fails at the start commit with no change from this phase, and its file is outside this phase's list.
- A `:confirm` branch for the harness - a confirm run asks the operator between iterations, which a single lineage does not need. C5 refuses instead, as Fable asked.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | C2 allowlist check, C3 echo opt-out |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | C1 exported sweep, called from `createDshHome` |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | C1 sweep call, C3 `echoStdout: false` |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modify | C1 sweep call, C3 `echoStdout: false` |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modify | C5 refusal step |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modify | C5 refusal step |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Modify | C5 one clause |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | Modify | C5 one clause |
| `.skilled/commands/deep/assets/compiled/deep-{review,research,ai-council}.contract.markdown` | Regenerate | The compiler's output after the YAML edits |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | C7 |
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Modify | C8 canonical review dimension ids |
| `.skilled/skills/system-deep-loop/changelog/v1.6.26.0.md` | Create | C4 |
| `.skilled/skills/system-deep-loop/{SKILL.md,description.json,mode-registry.json,hub-router.json}` | Modify | C4 version `1.6.25.0` to `1.6.26.0` |
| `.skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts` | Modify | C2 and C3 tests |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | C1 test |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts` | Modify | C1, C3 and C5 contract tests |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modify | C7 test |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts` | Modify | C8 test |
| C6 files | Pending | Named by the operator's choice in section 10 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A `dispatchEnv` key outside the kind's list throws before any receipt is written or any child is spawned, and the four harness keys still reach the child (C2) |
| REQ-002 | A `:confirm` run with an executor kind that workflow has no branch for stops before dispatch with a message naming the kind and `:auto` (C5) |
| REQ-003 | After the YAML edits, the contract drift check prints `[CONTRACT DRIFT] OK commands=3` and the two named suites pass with the new tests (C1, C3, C5) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A `dsh-home-XXXXXX` folder older than 24 hours is removed before a new home is made, and a younger one or a named one is kept (C1) |
| REQ-005 | With `echoStdout: false` the runner prints one stderr line with the byte count and no stdout, and `completionCheck` still sees the whole stream (C3) |
| REQ-006 | A finding re-reported at another line with the same id, file and title stays one registry row, and two findings with the same id but another title stay two (C7) |
| REQ-007 | A review upsert of `dim:security`, `DIM-SECURITY` or `dimension:Security` stores one `dimension:security` node and rewrites the edge ends that name it, and a graph seeded with four dimensions plus the four leaf ids reads `dimensionCoverage` `1` (C8) |
| REQ-008 | Changelog `v1.6.26.0` exists and the four version fields read `1.6.26.0` (C4) |
| REQ-009 | C6 is built as the operator chose, or recorded as deferred with the reason (C6) |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The two named suites go from `11 passed` to `16 passed` or more, with no failure.
- **SC-002**: The full `DL` suite shows the one known timing failure and no other, against `1 failed | 2893 passed` today.
- **SC-003**: A review graph built like the live one goes from `dimensionCoverage` `0.5` with `STOP_BLOCKED` to `1` with no `uncovered_dimensions` blocker.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 018 at `1bedb33577` | The search texts assume its two harness branches | T001 counts every search text before the first edit |
| Risk | The sweep removes a home a long run still uses | A live lineage loses its profile mid-run | The cutoff is 24 hours, six times the 4-hour lineage ceiling (`LINEAGE_LIFETIME_HARD_MAX_HOURS`) and 24 times the longest step timeout of 3,600 seconds, and the pattern matches only the six-character default suffix |
| Risk | C8 merges two dimensions a config means to keep apart | Coverage of one counts for the other | Only the `dimension:`, `dim:` and `dim-` prefixes and letter case are folded. The name after them must match exactly |
| Risk | Something reads the echoed stdout | Turning the echo off would break it | T004 searches both auto workflows for a reader of the step's stdout before E5 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The sweep reads one directory listing per new home. With eleven entries today it adds no measurable time.
- **NFR-P02**: A five-iteration harness review stops echoing about 1 MB of event stream, from the 1,008,701-byte lineage log above.

### Security
- **NFR-S01**: No key outside the per-kind list reaches a child through `dispatchEnv`.
- **NFR-S02**: The sweep removes only folders directly under `os.tmpdir()` whose name matches `^dsh-home-[A-Za-z0-9]{6}$`, never a symlink target.

### Reliability
- **NFR-R01**: A failed sweep never stops a dispatch. It writes one stderr line and the run continues.
- **NFR-R02**: Every kind other than the harness keeps today's stdout echo.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: no `dsh-home-` folder in the temp folder sweeps nothing. An empty `dispatchEnv` passes the check. A harness run with empty stdout prints `0 bytes`.
- Maximum input: the runner's buffer is 10 MiB, so the byte count line reports at most that, and `completionCheck` still reads the whole buffer.
- Failure path: a rejected key throws `dispatchEnv key <KEY> is not allowed for <kind>`. A `:confirm` run with an unbranched kind halts with exit 2 before the state log gets an iteration row.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 18 files, most of them a few lines, plus regenerated contracts |
| Risk | 9/25 | Runtime dispatch and two reducers. Every change is guarded by a test |
| Research | 5/20 | Each cause is located, C8 on the live graph. C6 needs one design choice |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- C6, where should executor identity live? Option A: the pre-dispatch audit appends a ledger event that carries the executor, so the projection keeps it. Option B: the dispatch receipts are the identity record, `writeFirstRecordExecutor` stops writing a row the projection drops, and the review report reads the receipts. Default taken: neither is built until the operator chooses, and REQ-009 records the deferral. Answered by the operator on 2026-11-14: C6 is deferred. Neither option is built in this phase, and the gap is recorded.
- C1, is 24 hours the right sweep age? Default taken: yes. Answered by the operator on 2026-11-14: yes, 24 hours.
- Deep-review findings: folded in. The three loop-health observations in `REV/review-report.md` lines 78, 201 and 210 are items C7, C8 and C6. Its seven numbered findings are about purpose carry and belong to phases 012 and 013 of the purpose packet.
<!-- /ANCHOR:questions -->

---
