---
title: Deep Research Strategy - embed-text-4 (richer command embedding text)
description: Measures what richer command embedding text buys the six no-recommendation commands on a scratch copy of the advisor database and command metadata, against the built state after phases 014 and 015.
trigger_phrases: []
importance_tier: normal
contextType: planning
---
# Deep Research Strategy - embed-text-4

## 1. OVERVIEW

Lane label `embed-text-4`: segment four, rank 10 and open question 5 of segment three. Measure what richer command embedding text buys the six no-recommendation commands. The measurement runs on a scratch copy of the advisor database and a scratch set of intent signals; no tracked file changes.

## 2. TOPIC

Segment four embed-text lane. Segment three rank 10 proposes giving the six no-recommendation commands evidence through command intent signals, with `/create:skill-parent` also needing a scorer row. Segment three open question 5 asks whether richer intent text in the skill or command vectors moves holdout rows. Rank 16 (enriching skill intent signals and re-embedding the skill graph) is already declined; this lane measures the command side only.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] KQ1: What are the before numbers at HEAD after phases 014 and 015, using the committed capture in `--real-embedding` mode against a scratch copy of the database: plain tune recall, false offers of 35, the holdout count, and the three doctor-family floor rows at 0.82?
- [x] KQ2: When the six no-recommendation commands get richer intent signals in scratch copies of their owning metadata and their command vectors are re-embedded with the live embedder, what changes in the same capture: tune recall, false offers of 35, holdout count, and the three doctor-family floor rows?
- [x] KQ3: Does the measured gain justify a build, with the exact files and the measured gain, or a decline, with the number; and which of the six cannot benefit until it has a scorer row?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-recommending anything ranked, built, declined or waiting in segments one, two and three, including segment three rank 16 (skill intent signals) and rank 8 (quality-control aliases).
- Changing any tracked file: the database, command metadata, bridge projection, scorer, config and corpus stay read-only.
- Running a model session, an arena or the full suite; writing outside the lineage directory.
- Reading or printing holdout prompt text. Holdout rows are counted only through the committed capture.
- Building the change itself; this lane reports whether to build it and with what numbers.

---

## 5. STOP CONDITIONS

- Convergence at newInfoRatio 0.05 or below, with every key question answered or explicitly carried forward.
- Eight iterations at most; a thin iteration is recorded with status `timeout` or `stuck`, not skipped.
- Stop early when a further iteration would add no new measurement, and say which measurement is missing.
- Stop early only for unrecoverable state corruption or a missing control file.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- KQ1: What are the before numbers at HEAD after phases 014 and 015, using the committed capture in `--real-embedding` mode against a scratch copy of the database: plain tune recall, false offers of 35, the holdout count, and the three doctor-family floor rows at 0.82?
- KQ2: When the six no-recommendation commands get richer intent signals in scratch copies of their owning metadata and their command vectors are re-embedded with the live embedder, what changes in the same capture: tune recall, false offers of 35, holdout count, and the three doctor-family floor rows?
- KQ3: Does the measured gain justify a build, with the exact files and the measured gain, or a decline, with the number; and which of the six cannot benefit until it has a scorer row?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- `sqlite3 .backup` plus the capture's documented `SYSTEM_SKILL_ADVISOR_DB_DIR` override made the whole lane possible without touching a tracked file. The committed capture's real-embedding preflight also proved the embedder and the command-vector table before a single row was scored, so a silent cosine lane could not be mistaken for a scoring result. (iteration 1)
- isolating one variable at a time. The scratch database started as a copy, only five command vectors changed, and the capture read the same tracked corpus and bridge projection, so the +5 tune and +2 holdout rows can only come from the embedding text. The parity check at cosine 1.000000 removed any doubt that a different embedding path produced the lift. (iteration 2)
- keeping the decision tied to the two numbers that moved and the one floor that did not. The build case does not need the lexical half to be measured, because the vector half alone already pays +5 tune and +2 holdout with 0 of 35 false offers. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed. Reading the generated bridge projection rather than each metadata file was enough to see that `/create:skill-parent` has no TypeScript runtime, which explains its zero without a vector run. (iteration 1)
- the first version of the scratch script assumed every bridge entry carries `embeddingText`; `/create:skill-parent` does not, because its TypeScript bridge is disabled. The failure was useful: it named exactly why that command cannot move. (iteration 2)
- the first attempt to call this a "tune-only" gain was wrong; the per-command holdout counts show two commands gained a holdout row, so the honest label is "mostly tune, with two holdout rows". (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A plain file copy of the WAL-mode database: the `-wal` file may hold committed rows, so `.backup` was used for a consistent snapshot. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A plain file copy of the WAL-mode database: the `-wal` file may hold committed rows, so `.backup` was used for a consistent snapshot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A plain file copy of the WAL-mode database: the `-wal` file may hold committed rows, so `.backup` was used for a consistent snapshot.

### Claiming the lexical half as measured: the scratch capture read the tracked bridge projection, so the lexical addition is a build-time risk, not a measured gain. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Claiming the lexical half as measured: the scratch capture read the tracked bridge projection, so the lexical addition is a build-time risk, not a measured gain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming the lexical half as measured: the scratch capture read the tracked bridge projection, so the lexical addition is a build-time risk, not a measured gain.

### Command vector enrichment alone cannot make `/create:skill-parent` reachable. This is a definitive dead end for that command until a bridge row exists. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Command vector enrichment alone cannot make `/create:skill-parent` reachable. This is a definitive dead end for that command until a bridge row exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command vector enrichment alone cannot make `/create:skill-parent` reachable. This is a definitive dead end for that command until a bridge row exists.

### Copying the enriched bridge projection over the tracked file so the capture's lexical lane sees it: that would modify a tracked file and break the isolation the measurement needs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Copying the enriched bridge projection over the tracked file so the capture's lexical lane sees it: that would modify a tracked file and break the isolation the measurement needs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying the enriched bridge projection over the tracked file so the capture's lexical lane sees it: that would modify a tracked file and break the isolation the measurement needs.

### Declining the build: the measured cost of declining is 5 tune rows and 2 holdout rows left without a command, with no floor movement to justify the loss. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Declining the build: the measured cost of declining is 5 tune rows and 2 holdout rows left without a command, with no floor movement to justify the loss.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Declining the build: the measured cost of declining is 5 tune rows and 2 holdout rows left without a command, with no floor movement to justify the loss.

### Enriching only the skill descriptions instead of command metadata: segment three rank 16 already declined it and measured 0 holdout gain; this lane's +2 comes from command vectors, not skill text. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Enriching only the skill descriptions instead of command metadata: segment three rank 16 already declined it and measured 0 holdout gain; this lane's +2 comes from command vectors, not skill text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Enriching only the skill descriptions instead of command metadata: segment three rank 16 already declined it and measured 0 holdout gain; this lane's +2 comes from command vectors, not skill text.

### None yet. The lane has a working baseline and a scratch copy that the enrichment run can reuse. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None yet. The lane has a working baseline and a scratch copy that the enrichment run can reuse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None yet. The lane has a working baseline and a scratch copy that the enrichment run can reuse.

### Re-embedding `/create:skill-parent`: there is no `vec_cmd_768` row and no TypeScript id, so the update would write a vector nothing reads. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Re-embedding `/create:skill-parent`: there is no `vec_cmd_768` row and no TypeScript id, so the update would write a vector nothing reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-embedding `/create:skill-parent`: there is no `vec_cmd_768` row and no TypeScript id, so the update would write a vector nothing reads.

### Reusing the doctor route `lead_phrases` mechanism: it is for leading a passing skill, not for adding volume to the embedding text, and it carries its own state-word constraint. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reusing the doctor route `lead_phrases` mechanism: it is for leading a passing skill, not for adding volume to the embedding text, and it carries its own state-word constraint.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the doctor route `lead_phrases` mechanism: it is for leading a passing skill, not for adding volume to the embedding text, and it carries its own state-word constraint.

### Running the capture against the live database in place: it would measure whatever the daemon wrote and would leave no before snapshot for the after run. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Running the capture against the live database in place: it would measure whatever the daemon wrote and would leave no before snapshot for the after run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running the capture against the live database in place: it would measure whatever the daemon wrote and would leave no before snapshot for the after run.

### Treating `/create:skill-parent` as part of the same gain: its measured gain is 0 until a scorer row exists, so folding it into the +5/+2 would overclaim. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `/create:skill-parent` as part of the same gain: its measured gain is 0 until a scorer row exists, so folding it into the +5/+2 would overclaim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `/create:skill-parent` as part of the same gain: its measured gain is 0 until a scorer row exists, so folding it into the +5/+2 would overclaim.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A plain file copy of the WAL-mode database: the `-wal` file may hold committed rows, so `.backup` was used for a consistent snapshot. (iteration 1)
- None yet. The lane has a working baseline and a scratch copy that the enrichment run can reuse. (iteration 1)
- Running the capture against the live database in place: it would measure whatever the daemon wrote and would leave no before snapshot for the after run. (iteration 1)
- Command vector enrichment alone cannot make `/create:skill-parent` reachable. This is a definitive dead end for that command until a bridge row exists. (iteration 2)
- Copying the enriched bridge projection over the tracked file so the capture's lexical lane sees it: that would modify a tracked file and break the isolation the measurement needs. (iteration 2)
- Re-embedding `/create:skill-parent`: there is no `vec_cmd_768` row and no TypeScript id, so the update would write a vector nothing reads. (iteration 2)
- Claiming the lexical half as measured: the scratch capture read the tracked bridge projection, so the lexical addition is a build-time risk, not a measured gain. (iteration 3)
- Declining the build: the measured cost of declining is 5 tune rows and 2 holdout rows left without a command, with no floor movement to justify the loss. (iteration 3)
- Enriching only the skill descriptions instead of command metadata: segment three rank 16 already declined it and measured 0 holdout gain; this lane's +2 comes from command vectors, not skill text. (iteration 3)
- Reusing the doctor route `lead_phrases` mechanism: it is for leading a passing skill, not for adding volume to the embedding text, and it carries its own state-word constraint. (iteration 3)
- Treating `/create:skill-parent` as part of the same gain: its measured gain is 0 until a scorer row exists, so folding it into the +5/+2 would overclaim. (iteration 3)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Segment three rank 10: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md` lines 75 and 95.
- Segment three open question 5: same file, line 209.
- The six no-recommendation commands and their causes: same file, lines 106-107: five have a scorer row and return nothing (`/doctor:install`, `/doctor:setup`, `/doctor:speckit`, `/doctor:update`, `/speckit:search`), and `/create:skill-parent` has no scorer row.
- The three doctor-family floor rows at 0.82: `mns-chat-03`, `nm-system-skilled-doctor-01`, `sv-03` (same file, line 37).
- The live embedder: Ollama at `127.0.0.1:11434`, model `nomic-embed-text:v1.5`, 768 dimensions, records stored as `nomic-embed-text-v1.5` in `vec_cmd_768`.
- The committed capture: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs` (`--real-embedding`, `SYSTEM_SKILL_ADVISOR_DB_DIR` selects the database directory).

### Bounded Context Snapshot

- Source pointers: `capture-command-routing-baseline.mjs`, `lib/skill-graph/skill-graph-db.ts`, `lib/command-attach.ts`, `scripts/command-bridges/derive-command-bridges.cjs`, `scripts/command-bridges/command-bridges.generated.json`, `.skilled/commands/doctor/_routes.yaml`, `.skilled/skills/system-spec-kit/command-metadata.json`, `.skilled/skills/sk-doc/command-metadata.json`.
- Reuse candidates: the committed capture script and its real-embedding preflight; the runtime's command vector table and content-hash convention.
- Constraints: no tracked file writes; no holdout text; scratch DB and scratch metadata only.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 15 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-13T11:47:27Z
