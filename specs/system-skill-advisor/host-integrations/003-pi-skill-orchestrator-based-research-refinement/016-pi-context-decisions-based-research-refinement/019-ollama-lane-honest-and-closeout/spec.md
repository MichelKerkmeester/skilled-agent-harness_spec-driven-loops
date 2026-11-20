---
title: "Feature Specification: Phase 19: ollama-lane-honest-and-closeout"
description: "Phase 018 switched the Ollama lane off but left it unfit to switch back on, left a watchdog gap at startup, and left two one-off test failures and other sessions' operator answers unrecorded. This phase closes all of it, and measures the lane once with real embeddings to decide its weight."
trigger_phrases:
  - "ollama lane honest and closeout"
  - "phase 19 ollama lane honest and closeout"
  - "semantic lane coverage gate"
  - "semantic lane real ablation"
  - "orphan operator answers"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: ollama-lane-honest-and-closeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-19 |
| **Branch** | `worktrees/480-ollama-lane-honest-and-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-ollama-lane-off-and-daemon-liveness |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is `Met`, the branch is merged and pushed, and nothing from 018 is listed as open |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the pi-context-decisions refinement packet. The operator asked to leave nothing open after phase 018.

**Scope Boundary**: the advisor's semantic lane, its launcher and daemon lifecycle, the ablation harness, the flaky-test check, and writing other sessions' pending operator answers into their own packets' decision records. The shared embedder cascade stays unchanged, as in 018.

**Dependencies**:
- Phase 018 on main at `32b0e9d4421`.
- A local `ollama serve` with `nomic-embed-text` (installed and pulled), started for the ablation and stopped after.

**Deliverables**:
- A semantic lane that is correct whenever it runs, plus one real-embedding ablation that decides its default weight.
- A watchdog with no startup gap.
- A named cause for each one-off test failure, or proof it does not repeat.
- Every ended session's pending operator answers written to its packet.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The lane is off but could not be turned back on honestly: only a manual scan refreshes vectors, partial coverage still scores, an Ollama outage leaves the lane's weight in the total, and the daemon ignores `OLLAMA_*` settings. The ablation harness scores its full arm at the registry weight, now 0, and pins a 193-row corpus that now has 196. A server that hangs before its first heartbeat is never reaped. Other sessions' answers sit unrecorded.

### Scope Amendment (2026-11-19)
The operator added, mid-phase: "We need full vector coversge / And a update to related system skilled doctor so repo users get those automatically for anything new created, overlays etc". Two advisors (Opus 5.5 xhigh and Fable 5.2 medium, through claude2) read the code first. The daemon now keeps every embeddable skill and command vector current at any lane weight. The doctor checks pass on full, current coverage. Only the prompt path stays tied to the lane weight. The operator also chose to write all 231 unrecorded operator answers the orphan map found, with one commit per spec track.

The operator then asked: "Create goal for all open work / Also add /local-doc-alignment and /local-skilled-alignment to goal for finalization". Before the merge, `/local-skilled-alignment` runs over the committed branch against base `f2f03c90fb6`, and `/local-doc-alignment` runs over a new topic for the advisor's vector refresh. Both reports are kept in `evidence/`, and each finding is fixed or recorded as accepted with a reason.

### Purpose
Nothing from phases 014 to 018 is left open: the lane is correct and its weight rests on a fresh measurement, and every recorded gap is fixed or explained, and both alignment checks clear the change before it lands.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/skill-advisor.cjs advisor_status --json '{"workspaceRoot":"<repo>","includeSemanticHealth":true}' --format json   (semantic block)
{"disabledReason":"lane_weight_zero","laneEnabled":false,"vectorCoverage":{"embedded":8,"total":15,"ratio":0.533333},"commandVectorCoverage":{"embedded":0,"total":47},"activeEmbedder":{"name":"nomic-embed-text-v1.5","dim":768,"adapterDim":768}}
$ rg -c "OLLAMA_" .skilled/bin/system-skill-advisor-launcher.cjs
(no output: 0 matches)
$ rg -n "refreshSkillEmbeddings\(" runtime --glob "!**/tests/**" --glob "!**/dist/**"
runtime/handlers/skill-graph/scan.ts:54:    const embeddingRefresh = await refreshSkillEmbeddings(skillsRoot);
runtime/lib/skill-graph/skill-graph-db.ts:1291:export async function refreshSkillEmbeddings(skillDir?: string)
$ rg -n "expect\(corpus.length\)" runtime/tests/scorer/semantic-shadow-ablation.vitest.ts
243:    expect(corpus.length).toBe(193);
$ wc -l < runtime/scripts/routing-accuracy/labeled-prompts.jsonl
     196
```
Live coverage is 8 of 15 skills and 0 of 47 commands, only the manual scan refreshes vectors, the daemon gets no `OLLAMA_*` key, and the harness pins a stale corpus size.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep every embeddable skill and command vector current from the daemon, after startup and after each watcher reindex, at any lane weight, and keep an existing vector when an outage blocks its refresh.
- One function defines the embeddable rows and their current, stale and missing counts, for the refresh, the lane gate, status and the doctor checks.
- The doctor checks pass on full, current coverage, report a missing Ollama as degraded, and show the lane weight as information. Update, overlay and symlink results show coverage, and `/create:command` regenerates the command bridges.
- Score the lane only when every described skill has a vector, and drop the lane from the live total when its prompt embed fails.
- Forward `OLLAMA_BASE_URL` and `OLLAMA_REQUEST_TIMEOUT_MS` to the daemon, which supersedes 018's NFR-S02.
- Pin the child's database directory, start the heartbeat at the top of startup, and reap a server with no heartbeat 5 minutes after spawn.
- Run the ablation once, with the pass bar below, and settle the default weight from it.
- Rerun the suites until each one-off failure repeats or is shown not to.
- Write each ended session's pending answers into its packet's decision record: 231 answers across 75 packets, plus consumed rows for the 246 already written.
- Run `/local-skilled-alignment` and `/local-doc-alignment` over the change before the merge, and fix or accept each finding.

### Out of Scope
- The shared cascade in `system-spec-kit/shared/embeddings`: other skills read it.
- Chaining a scan from create or doctor workflows: the daemon refresh covers new rows on its next start or watcher event.
- Answers from a session still running: that session records its own.

### Ablation pass bar (fixed before the run)
- **Corpus**: the labeled corpus, 196 rows, every described skill seeded with a real `nomic-embed-text-v1.5` vector, a warm model, and a pinned scoring date.
- **Arms**: the semantic lane at 0.05 against the lane disabled, run twice; the flips must match.
- **Pass**: more correct top-1 rows with the lane than without, and no prompt whose gold answer is none fires with the lane that abstains without it.
- **Pass outcome**: the default weight returns to 0.05. The 018 test and fixture changes for weight 0 are reverted, the docs and changelog say so, and the operator picks the version.
- **Fail outcome**: the weight stays 0, and the result is recorded in this phase and the changelog.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts` | Modify | Refresh after startup scan, heartbeat at the top of startup |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher*.ts` | Modify | Refresh after a watcher reindex |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | Modify | Keep vectors through an outage |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` | Modify | Full-coverage gate |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Modify | Outage marks the lane degraded |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | `OLLAMA_*` forwarding, database directory pin, startup grace |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts` | Modify | Candidate weight, live corpus size, none-gold counts |
| Tests for each change, advisor docs, ENV-REFERENCE, `SKILL.md`, changelogs | Create/Modify | Coverage and the shipped facts |
| Other packets' `decision-record.md` | Create/Modify | Orphan operator answers, decisions only |
| `.skilled/commands/assets/local-doc-alignment/topics.json` | Modify (local) | A topic for the advisor's vector refresh. The file is gitignored and symlinked to the main checkout, so the topic lives there; a copy is kept in `evidence/doc-alignment/topics-entry.json` |
| Files named by an alignment finding | Modify | The fix for that finding |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The daemon refreshes skill and command vectors after startup and after each watcher reindex, at any lane weight, single-flight, never blocking, unless the opt-out env turns it off |
| REQ-002 | A refresh that fails on an outage leaves the existing vector in place |
| REQ-003 | The lane returns no match and reports `incomplete_skill_vectors` when any embeddable skill or command row lacks a vector |
| REQ-004 | A failed prompt embed marks `semantic_shadow` degraded, so it leaves the live total for that call |
| REQ-005 | The ablation runs with real embeddings to the pass bar, and the default weight follows its outcome |
| REQ-006 | The launcher reaps a server with no heartbeat newer than its spawn 5 minutes after spawn, and the child always gets the launcher's database directory |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `OLLAMA_BASE_URL` and `OLLAMA_REQUEST_TIMEOUT_MS` reach the daemon |
| REQ-008 | Each one-off test failure is reproduced and fixed, or shown not to repeat across repeated runs on a quiet tree |
| REQ-009 | Every pending answer from an ended session is in its packet's decision record, or listed with the reason it was skipped |
| REQ-010 | Docs, `SKILL.md` and the changelogs state the shipped facts |
| REQ-011 | Status reports current, stale and missing counts for skills and commands from the one embeddable-row function, and a live daemon with Ollama up reaches full, current coverage |
| REQ-012 | The doctor setup and embedder checks pass on full, current coverage, report DEGRADED without Ollama and never fail on lane weight 0; update, overlay and symlink results show coverage; `/create:command` regenerates the command bridges |
| REQ-013 | `/local-skilled-alignment` and `/local-doc-alignment` run over the change before the merge, their reports sit in `evidence/`, and each finding is fixed or accepted with a reason |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every suite that passed after 018 passes again, with only explained deltas.
- **SC-002**: `advisor_status` with `includeSemanticHealth` on main reports the lane state the ablation decided, and `match-decision-table --scan-orphans` lists only live sessions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A local `ollama serve` for the ablation | No ablation if it will not start | Record its pid, stop only that pid, and confirm port 11434 refuses after |
| Risk | A daemon refresh during an outage shrinks coverage | Med | REQ-002 keeps vectors through an outage |
| Risk | Writing into other sessions' packets clobbers their work | High | Skip a live session, a packet with uncommitted changes and a packet missing from main, and write decisions only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A daemon start with full, current coverage makes zero Ollama requests. With rows missing or stale it probes once with a short timeout, embeds only those rows, and never blocks. At weight 0 no prompt is embedded. This supersedes the wider "no Ollama call at weight 0" reading of phase 018.
- **NFR-P02**: The daemon refresh runs after the IPC server is up and never blocks a request.

### Security
- **NFR-S01**: The two forwarded keys hold a URL and a number, never a secret.
- **NFR-S02**: A decisions-only save writes no continuity into another session's packet.

### Reliability
- **NFR-R01**: The child's database directory always equals the launcher's, so the heartbeat path cannot differ.
- **NFR-R02**: The idle exit still works: nothing new marks IPC activity.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skill with an empty description is not embeddable and does not count against coverage.
- Maximum input: a startup that writes no heartbeat within 5 minutes of spawn now gets the server reaped, which is the intended behavior for a wedged start.
- Failure path: Ollama down during a daemon refresh keeps every old vector and logs the outage.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Six source files, the harness, tests, docs and other packets' records |
| Risk | 13/25 | Default weight may change; writes into other packets |
| Research | 6/20 | One ablation run and a flake hunt |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose phase 019, a worktree, building the three lane fixes with an ablation, and routing orphan answers to their packets.
<!-- /ANCHOR:questions -->

---
