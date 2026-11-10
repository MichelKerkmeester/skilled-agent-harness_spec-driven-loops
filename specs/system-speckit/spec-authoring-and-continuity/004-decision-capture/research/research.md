---
title: "Research: Three open gaps in operator decision capture"
description: "Four-iteration deep research over the routing words for decision requests, per-project scoping of the shared decision-capture state folder, and reducing the saving model's judgment for chat answers. Recommends a metadata-only routing fix owned by the advisor track, a per-project state subdirectory owned by a new 043 child, and a deterministic evidence block that keeps the model's decision."
trigger_phrases:
  - "decision capture open gaps research"
  - "record my chat reply as a decision routing"
  - "linked projects share decision capture state"
  - "chat answer judgment decision capture"
importance_tier: "important"
contextType: "research"
---

# Research: Three open gaps in operator decision capture

<!-- ANCHOR:deep-research-decision-capture-open-gaps -->

## 1. Run Provenance

- Workflow: `/deep:research`, fan-out lineage `devin-deepseek`, 4 iterations, stop policy `convergence`.
- Executor: cli-devin, `deepseek-v4-1-flash-max`, workspace-write sandbox.
- Session: `fanout-devin-deepseek-1793694885417-825i4p`, generation 1.
- Iterations: `iterations/iteration-001.md` (newInfoRatio 0.88), `iteration-002.md` (0.86), `iteration-003.md` (0.84), `iteration-004.md` (0.72). Every iteration passed the append gateway and the reducer refresh.
- Stop reason: `converged`, because all five key questions were answered. The graph convergence snapshot was not run: `convergence.cjs` takes only `--spec-folder` and writes under the packet, outside this lineage's write surface. The inline vote ran without a graph decision, which the composite rule allows when the decision is absent.
- Write-surface note: the workflow's pre-init `spec.md` mutation and the post-synthesis `spec.md` writeback were not executed, because both target the parent packet outside this lineage. They are recorded as scope conflicts in iteration 1 and Section 8.

## 2. Executive Summary

The three gaps are real, independent, and each has a small fix. None needs a new service, a new model, or a new file format beyond one row field and one candidate field.

| Gap | Smallest correct fix | Owner | Why this owner |
|-----|----------------------|-------|----------------|
| 1. No routing words for decision requests | Add a short decision vocabulary to `system-spec-kit/graph-metadata.json` `intent_signals` ("as a decision", "decision record", "operator decision", "record my answer"), add a DECISION intent row to `ROUTER.md`, and re-export both compiled graph artifacts. No advisor code change. | New packet in `specs/system-skill-advisor/` (next free 034) | Packet 031 fixed the same class of gap ("`environment variables` routes to nothing") by editing `system-spec-kit/graph-metadata.json` and filing under the advisor track; 043's goal D1 freezes its children to the pipeline, writer or save step. |
| 2. Linked projects share one state folder | Give each project its own subdirectory under the existing state folder, keyed by a short hash of the real project path. One path helper in `capture-core`, one exported `stateDirPath` in the writer, matcher delegates. Dual-read the legacy root file; single-write the new subdirectory. | New 043 child (008) | It changes the decision-capture pipeline, which D1 covers. |
| 3. Chat answers still need judgment | Do not auto-accept. Add a deterministic evidence block to each candidate (question type, option match, content overlap, imperative opening, topic-shift marker) and keep the saving model's decision. A reject-only filter waits on a larger labeled set. | New 043 child (009) | It changes the chat detector and the save step, both inside D1. |

Recommended order: gap 2 first (data plane and migration note), gap 3 second (candidate payload), gap 1 last or in parallel on the advisor track (so routing does not lead users into the shared-state bug).

## 3. Gap 1: Routing words for decision requests

### 3.1 How a request becomes a skill

The skill advisor scores four inputs: SKILL.md `description` corpus terms, SKILL.md `keywords` variants, the compiled `skill-graph.json` `signals`, and a live source signal map rebuilt from every skill's `graph-metadata.json` `intent_signals` plus `derived.trigger_phrases`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:257-268] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1205-1248] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1389-1391]

Signal matching is phrase-boundary matching, not token overlap. A declared phrase fires only when its normalized form appears in the prompt with word boundaries, so "record a decision" does not fire on "record my chat reply as a decision", while "as a decision" does. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1672-1679] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:3093-3103]

`system-spec-kit`'s metadata carries no operator-decision vocabulary. Its 31 intent signals and 21 derived trigger phrases cover spec folders, saves, continuity, validation, retrieval, template repair, env vars and runtime mirrors, and none names a decision, an answer or a decision record. [SOURCE: .skilled/skills/system-spec-kit/graph-metadata.json:48-80] [SOURCE: .skilled/skills/system-spec-kit/graph-metadata.json:82-104]

The committed trigger index returns zero rows for both "record my chat reply as a decision" and "record this as a decision" (exit 0, empty `results`). No indexed document declares the phrase either. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs]

### 3.2 The smallest fix

Add four intent signals to `system-spec-kit/graph-metadata.json`:

- `as a decision` — the phrase the reported request actually contains; three tokens, so it outranks a single corpus word.
- `decision record` — the artifact the request is asking to write.
- `operator decision` — the feature's name.
- `record my answer` — the adjacent phrasing for a tool answer.

Then add a DECISION intent row to `ROUTER.md` that loads `references/memory/save-workflow.md` and `references/validation/decision-format.md`, so the loaded skill knows which references to open. No advisor code change is needed; the live source signal map reads the metadata directly. [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:37-57]

### 3.3 Collision check

No existing skill declares any of the four phrases. The only competing vocabulary is `sk-design`'s description word "decision" and its "decision tree", "colour decision" and "color decision" signals. [SOURCE: .skilled/skills/sk-design/graph-metadata.json:48-80] [SOURCE: .skilled/skills/sk-design/SKILL.md:3]

The collision result is structural: a prompt that contains "as a decision" gives `system-spec-kit` a 1.6 signal, while `sk-design` gets at most its 1.0 corpus word for "decision". A prompt about a decision tree or a colour decision contains neither "as a decision" nor "decision record", so `sk-design` keeps those prompts. The live advisor probe is still the proof the owning packet must run; the structural scan only shows no declared phrase overlap. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1642-1689]

### 3.4 Owner

A new packet in `specs/system-skill-advisor/` (next free 034), not a 043 child. Packet 031 fixed "the bare prompt `environment variables` routes to nothing" by adding `environment variables` to `.skilled/skills/system-spec-kit/graph-metadata.json`, re-exporting the skill graph, and filing under `specs/system-skill-advisor/`. [SOURCE: specs/system-skill-advisor/routing-and-scoring/004-routing-and-launcher-hardening/spec.md:40] [SOURCE: specs/system-skill-advisor/routing-and-scoring/004-routing-and-launcher-hardening/spec.md:73] [SOURCE: specs/system-skill-advisor/routing-and-scoring/004-routing-and-launcher-hardening/implementation-summary.md:81]

043's goal D1 says every child changes the decision-capture pipeline: `.skilled/hooks/decision-capture/`, the decision-record writer or the save step. Routing metadata is none of those, and 007's Known Limitations already calls the advisor metadata "another artifact (parent goal D1)". [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/goal.md:44] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/007-gap-closure/implementation-summary.md:143]

### 3.5 Verification

- Re-export both compiled artifacts: `skill-graph.json` and the SQLite database the daemon reads. The freshness checker compares both against the on-disk `graph-metadata.json` files and reports `STALE COMPILED` when either is older. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:13] [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:48-49] [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:191]
- Run the 42-case regression corpus plus new decision rows. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl]
- Run a short-prompt probe for "record my chat reply as a decision", "record this as a decision", "decision tree", "colour decision" and "architecture decision". The last two must keep their current routes.
- Run the doctor skill check on `system-spec-kit` and the advisor.

## 4. Gap 2: One state folder for every linked project

### 4.1 The shared path

Every producer passes a project directory into `capture-core`, and every path is computed as `join(projectDir, '.skilled', 'skills', '.state', 'decision-capture')`. The project directory is the only identity the core receives. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:38] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:238-248]

`doctor:symlink` treats `.skilled` as one directory entry and links it whole in the default `auto` mode; a merged link still mirrors the same child tree. Nothing inside `.skilled` can be per-project when the root is a symlink. [SOURCE: .skilled/commands/doctor/assets/symlink-manifest.json:3] [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:829-870]

The queue file is per session (`<hex(session-id)>.jsonl`), so answer files do not collide across projects. The shared surfaces are the directory enumeration in `--scan-orphans` and the single `consumed.jsonl`. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:242-248] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:280-310]

`--scan-orphans` enumerates every `<hex>.jsonl` in the state folder and prints a count plus the decoded session id, with no project filter. That is how another project's sessions enter a save's orphan list. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:280-310]

`consumed.jsonl` rows carry `key`, `packet`, `id` and `at`, never a project, and one log serves every project. A key consumed in one project therefore suppresses the same key in another; the key includes the runtime, session id, tool-use id and question index, so a collision needs a repeated session id rather than ordinary use. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:769-838]

### 4.2 The scoping fix

Give each project its own subdirectory under the existing state folder, keyed by a 12-character SHA-256 of the real project path:

```
<projectDir>/.skilled/skills/.state/decision-capture/<projectToken>/
```

- `capture-core.mjs` owns `projectToken(projectDir)` and `queueDir(projectDir)`.
- `decision-record-writer.ts` exports one `stateDirPath(projectRoot)`; `consumedLogPath` and `recordConsumedKeys` use it.
- `match-decision-table.ts` deletes its own `STATE_DIR_SEGMENTS` copy and delegates `stateDir` to `stateDirPath`.
- The queue file format and the session-keyed filenames stay unchanged.

The identity needed for the token is present at every call site: `process.cwd()` in the four sweeps, `context.directory` in the OpenCode plugin, `sessionContext.cwd` in the Pi extension, `CLAUDE_PROJECT_DIR || payload.cwd` in the Claude adapter, and a resolved project directory in the Stop hook. [SOURCE: .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:54] [SOURCE: .opencode/plugins/decision-capture.js:48] [SOURCE: .skilled/hooks/decision-capture/pi/decision-capture.ts:91] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:311]

A 12-character SHA-256 of the real project path is an established local convention, so the token does not invent a new scheme. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs:19-21] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hook-completion-evidence-stop.vitest.ts:33-35]

### 4.3 Migration

Use dual-read and single-write:

- New writes go to the project subdirectory.
- `readQueue` unions the new file and the legacy root file, deduplicated by key. The queue filename is session-scoped, so a legacy read cannot pull another project's session unless the session id is the same session.
- `readConsumedKeys` unions the project log and the legacy root log. The same session-scoped key rule limits cross-project suppression.
- `--scan-orphans` reads only the project subdirectory, so pre-fix root queues stop appearing as other projects' sessions.
- The state README records the new structure and the one-time legacy behavior.

### 4.4 The review finding this does not close

The deep-review report carries a P2 `symlinked_queue_path_escape` finding: if the expected state directory is a symlink outside the project, captured answers can be redirected outside the project boundary, and it recommends real-path containment or rejection. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/review/review-report.md:124-132]

The project token scopes data; it does not enforce real-path containment. A strict containment check would reject every linked project, because the sanctioned `.skilled` symlink resolves outside the project root, and that would disable capture in exactly the install shape the feature must support. The gap-2 child must record that trade-off and decide whether to add a sanctioned-link exception or leave the review finding open.

## 5. Gap 3: Chat answers still need judgment

### 5.1 What the detector emits

The detector pairs by position, not meaning: every asking paragraph in an assistant turn becomes a candidate against the next typed prompt, and the prompt text becomes the candidate's `answer` unchanged. Nothing checks whether the reply answers that paragraph. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:159-217]

The save step delegates the decision to the saving model: it writes an `operatorDecisions` entry "for each chat candidate whose answer clearly replies to its question", and notes that several candidates can share one reply. That sentence is the entire decision rule. [SOURCE: .skilled/commands/speckit/save.md:72-74]

### 5.2 What the evidence says

The labeled fixture holds four product candidates among its seven pairs: one true answer (pair 6, a numbered reply to a numbered list of four decisions) and three non-answers (pair 1, a new investigation request; pair 3, a new deep-review instruction; pair 7, a request for another review). The detector deliberately offers all four; 005's AC-008 requires the true one to be included, not the others to be excluded. [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json:2-8] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/005-chat-question-detection/acceptance-criteria.md:63]

The three non-answers share a shape: each opens with an imperative verb that starts a new task ("Analyxe", "Do", "ask") and shares no content word with its candidate question. The one true answer opens with a numbered list that maps to the question's numbered list. [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl:12] [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl:16] [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl:24] [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl:22]

ADR-002 already ruled out auto-accept for a lone candidate: its probe returned one candidate for the off-topic reply "actually first fix the login bug" to "Should the badge be blue or amber?". [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/007-gap-closure/decision-record.md:123-163]

### 5.3 The safe reduction

A deterministic accept is ruled out. The detector's only structural signals (closing paragraph, options present, later paragraph) do not separate the true answer from the non-answers, and a lone candidate can be off-topic. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:135-146]

A deterministic reject-only prefilter is possible but not proven safe. The observed non-answer shape (imperative new task, zero content overlap with the question, no option match, no yes/no form) would catch all three fixture non-answers and ADR-002's reply, but it also rejects valid short answers such as "make it blue" to "which color?" or "use the darker one" to "blue or amber?", unless the rule exempts open-value questions and comparative answers. [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json:2-8] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/007-gap-closure/decision-record.md:150]

The smallest safe reduction is a deterministic evidence block on each candidate, not a filter:

- question type: yes/no, alternative, open value, numbered list;
- option-label match: whether the reply names an offered option;
- content-word overlap count with the question;
- imperative opening: whether the reply starts a new task;
- topic-shift marker: "actually", "instead", "first", "let's".

The sweep computes it; the save model still decides, but from structured evidence rather than raw text. It adds no auto-accept and no new write path. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:120-133] [SOURCE: .skilled/commands/speckit/save.md:72-74]

If the operator wants fewer judgments rather than better ones, the next step is a reject-only filter measured on a larger labeled set. The current fixture is too small: 4 product candidates, 1 positive, so a rule that catches the 3 observed non-answers has no measured false-reject rate. [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json:2-8]

## 6. Ownership, Sequencing and Verification

| Work | Owner | Depends on | Verification |
|------|-------|------------|--------------|
| Gap 2: per-project state subdirectory | 043 child 008 | none | hooks `node --test` (series goal criterion 6), writer and matcher vitest, a two-project temp test, state README |
| Gap 3: candidate evidence block | 043 child 009 | a stable queue shape (gap 2 preferred first) | chat-questions unit tests, a larger labeled set, save-step wording |
| Gap 1: decision routing vocabulary | new `specs/system-skill-advisor/034-...` | none; ship after gap 2 or in parallel | graph compile, freshness `--strict`, 42-case regression corpus plus new rows, short-prompt probe, doctor skill check |

The fixes do not collide in code. Gap 2 changes `capture-core.mjs`, the writer, the api barrel and the matcher; gap 3 changes `chat-questions.mjs` and `save.md`. They share no file. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:238-345] [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:120-217]

Gap 2 should land first because it changes where data lives and needs a migration note; gap 3 only adds fields to candidates that are printed, not stored. Gap 1 is independent and can ship in parallel, but it should ship after gap 2 or point its DECISION intent at the save workflow that carries the scoped behavior. [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:42]

One child per gap gives clean closure. A single 008 is also consistent with 007's precedent of bundling several small fixes, but it makes two different proofs share one acceptance gate. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/spec.md:117]

## 7. Smallest Change Set

| Gap | Production files | Tests and docs |
|-----|------------------|----------------|
| 1 | `.skilled/skills/system-spec-kit/graph-metadata.json`, `ROUTER.md`; regenerate `skill-graph.json` and the SQLite database | new decision rows in the advisor regression corpus; short-prompt probe |
| 2 | `capture-core.mjs`, `decision-record-writer.ts`, `runtime/api/index.ts`, `match-decision-table.ts` | `capture-core.test.mjs`, writer vitest, matcher vitest, a two-project temp test, `.skilled/skills/.state/decision-capture/README.md`, `.skilled/hooks/README.md` |
| 3 | `chat-questions.mjs`, `.skilled/commands/speckit/save.md` | `chat-questions.test.mjs`, a larger labeled fixture, the save-step wording check |

No new service, no new model, no new file format beyond one row field (gap 2) and one candidate field (gap 3).

## 8. Eliminated Alternatives

- **A bare `decision` keyword on `system-spec-kit/SKILL.md`.** It fires on every prompt that mentions a decision, and `sk-design` already owns the decision vocabulary; a single keyword is weighted 1.0 while a three-word signal reaches 1.6.
- **A `PHRASE_INTENT_BOOSTERS` code entry.** It is a hard-coded map; a metadata signal is the smaller change and the one 031 used.
- **The exact sentence "record my chat reply as a decision" as a signal.** It fixes one phrasing and still misses "record this as a decision".
- **A new 043 child for gap 1.** D1 freezes 043 children to the pipeline, writer or save step; routing metadata is none of those.
- **Per-row `project` field with read-time filtering only for gap 2.** It leaves isolation to every reader and cannot scope pre-fix rows.
- **Changing `doctor:symlink` to merge mode or to leave `.skilled/skills/.state` unmirrored.** It cannot help a whole `.skilled` link, it changes every skill's state folder, and it is outside D1.
- **Moving the queue to a temp directory.** Pending answers must survive a reboot and be found by a later save.
- **Keying the project folder by basename.** Two checkouts named `app` would share a folder.
- **Auto-accepting a lone chat candidate.** ADR-002's probe shows a lone candidate can be an off-topic reply.
- **Auto-accepting an option-label match.** It cannot tell naming an option from mentioning it, and most questions offer no options.
- **A lexical-overlap threshold as an accept rule.** "yes" and "make it blue" are valid answers with zero overlap.
- **Ranking candidates and asking only about the top one.** Several candidates can share one reply, so a ranking cut can drop the real answer.
- **A full local classifier.** It is larger than the evidence block, needs training data the packet does not have, and adds a model surface to a deterministic save path.
- **Landing gap 3 before gap 2.** It would add evidence to candidate payloads while the queue rows they describe may move.
- **A strict real-path containment check as the gap-2 fix.** It would reject every linked project and disable capture there.

## 9. Divergence Map

No divergent pivots ran (`convergenceMode` default, stop policy `convergence`). No saturated directions or audited overrides were recorded. The remaining frontier is Section 8: the live advisor probe, the gap-2 legacy behavior and containment trade-off, the gap-3 labeled set and evidence value, the child count, and the two skipped parent-packet writes.

## 10. Remaining Open Questions

- **Gap 1 live probe.** The advisor daemon writes outside this lineage, so the collision check is structural only. The owning packet must run the live probe and the 42-case regression corpus, and add rows for "record my chat reply as a decision", "record this as a decision", "decision tree" and "colour decision".
- **Gap 1 trigger index.** The skill router is fixed by metadata, but document retrieval stays at zero for the phrase. If retrieval should also find the decision-record docs, the owning packet must add a `trigger_phrases` entry to the doc it wants found and rebuild the index.
- **Gap 2 legacy data.** Dual-read keeps pre-fix answers visible for the same session, but pre-fix root queues no longer appear in `--scan-orphans`. The child must decide whether to document that as a one-time cleanup or add a legacy count.
- **Gap 2 review finding.** `symlinked_queue_path_escape` asks for real-path containment; a strict check would disable capture in every linked project. The child must record the trade-off and choose a sanctioned-link exception or leave the finding open. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/review/review-report.md:124-132]
- **Gap 3 evidence value.** The evidence block makes the decision auditable but may not change the model's choice. A live save on the 7-pair fixture is the cheapest way to see whether it does.
- **Gap 3 reject rule.** A reject-only filter needs a larger labeled set before it can be enabled. The current set has 1 positive.
- **Child count.** One 043 child or two; two is cleaner, one is acceptable if the operator prefers fewer packets.
- **Scope conflicts.** The workflow's pre-init `spec.md` append and the post-synthesis `spec.md` writeback were skipped under the lineage write limit. The parent fan-out merge and synthesis must handle them, or the parent packet must record that they were intentionally skipped.
- **Workflow observation, not a topic gap.** The append gateway's research iteration upcast keeps `status`, `rawNewInfoRatio`, `ruledOutApproachRefs`, `outputDigest`, `trustedEvidenceYield` and the run scope, and drops `findingsCount`, `focus`, `answeredQuestions`, `keyQuestions`, `sourcesQueried`, `toolsUsed`, `noveltyJustification` and the stable identity fields from the projected state log. The canonical records supplied all of them. The reducer rebuilds the finding counts from the delta files, so the registry and dashboard show 8, 10, 10 and 10 findings, but the state log alone cannot answer a per-iteration findings count. A validator that reads only the state log would see the wrong shape; a validator that reads the deltas or the ledger sees the right one.
- **Dispatcher telemetry.** `research/orchestration-status.log` and `research/observability-events.jsonl` in the parent packet are written by the parent `fanout-run` process (producer `fanout-run`, label `devin-deepseek`) while this lineage runs. They are not lineage writes.

## 11. References

- Iteration narratives: `iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`, `iteration-004.md`
- Deltas: `deltas/iter-001.jsonl` to `iter-004.jsonl`
- Resource map: `resource-map.md`
- Dashboard: `deep-research-dashboard.md`
- Prior archived research: `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research_archive/2026-11-02-pre-gaps/research.md`
- Series goal and phase map: `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/goal.md`, `spec.md`
- 007 gap closure: `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/007-gap-closure/implementation-summary.md`, `decision-record.md`
- Deep review: `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/review/review-report.md`
- Routing precedent: `specs/system-skill-advisor/routing-and-scoring/004-routing-and-launcher-hardening/`

## 12. Convergence Report

- Stop reason: `converged` (all five key questions answered)
- Total iterations: 4
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 2: state-folder scoping (0.86); run 3: chat-answer judgment (0.84); run 4: ownership and sequencing (0.72)
- Convergence threshold: 0.1
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

<!-- /ANCHOR:deep-research-decision-capture-open-gaps -->

## 13. Verification Addendum (2026-11-03)

A fresh read-only DeepSeek V4.1 Flash review checked every recommendation against the code. Its full findings are in `synthesis-review.md`. Every gap stays, each with changes. The corrections below supersede the sections they name, and children 008, 009 and 010 plan against the corrected text.

| Section | Correction |
|---------|------------|
| 2, 3.4, 6 | Gap 1 is planned as 043 child 010, not a system-skill-advisor packet. The operator chose this on 2026-11-03 and goal D1 is amended to admit it. |
| 3.1, 3.3 | Cite `sk-design/graph-metadata.json:236,243-244,267`. The collision set also holds sk-design's `decision branch` and the advisor's `architecture decision` deep-routing pattern. The trigger-index lookup exits 1 on zero rows, not 0. |
| 3.2 | The DECISION intent must also be added to `ROUTER.md`'s machine `INTENT_SIGNALS` and `RESOURCE_MAP`, not only the §2 bullets. |
| 3.5 | Prove the route on the native advisor (`advisor_recommend` and the hook brief, confidence at least 0.8 and uncertainty at most 0.35), and rebuild its SQLite index with `advisor_rebuild`. The 1.6 boost and the 42-case corpus belong to the Python fallback scorer. |
| 4.2 | Five sweeps pass the raw working directory, and the writer resolves the git top-level. The token must hash one canonical root (git top-level, then realpath) inside the helper. The token algorithm lives in ESM and in TypeScript, so a test must prove the two agree. |
| 4.3 | Dual-read must also cover the matcher's `readQueueRecords` and `readConsumedRows`, and `--release` must reach a key in the legacy log. Add a migration test seeded with a root queue file and a root consumed row. |
| 4.4 | The operator kept the hashed subfolder. A project-local folder outside `.skilled` was weighed and rejected, because it would add an untracked folder to every linked project. `symlinked_queue_path_escape` stays open as a sanctioned-link exception. |
| 5.2 | The fixture has 14 lines. The non-answer replies are on lines 2, 6 and 14, and the true answer is on line 12. |
| 5.3 | The closing-paragraph signal does separate pair 6 on this fixture. The real limit is that question-side structure says nothing about whether the reply answers, as ADR-002's lone off-topic candidate shows. `optionMatch` needs a `not_applicable` value for open and numbered questions. The topic-shift lexicon must not include a bare "first". |
| 6, 7 | Gap 2 adds no row field. Gap 3 adds one nested `evidence` object with five fields. `sweep-transcript.test.mjs` and `chat-questions.test.mjs` compare whole objects and must be updated. 009 must assert the outcome on the 7-pair fixture: the three non-answers produce no entry and pair 6 produces one. |
