---
title: "Synthesis review: three open gaps in operator decision capture"
description: "A fresh read-only DeepSeek V4.1 Flash review of research.md, run through OpenCode Go at max effort on 2026-11-03. Four P1 and ten P2 findings, every gap AGREE WITH CHANGES."
trigger_phrases:
  - "decision capture synthesis review"
importance_tier: "important"
contextType: "research"
---

# Synthesis review: three open gaps in operator decision capture

Reviewer: `opencode1 run --model opencode-go/deepseek-v4.1-flash --variant max`, read-only, 2026-11-03. The orchestrator re-checked P1-4 (the fixture has 14 lines), P1-1 (`readQueueRecords` reads one path at `match-decision-table.ts:192-194`) and P2-2 (the trigger lookup exits 1 on zero rows); all three hold.

Operator decisions taken after this review: gap 1 is planned as 043 child 010, with goal D1 amended to admit it; gap 2 keeps the hashed subfolder under `.skilled/skills/.state/decision-capture/`, and the symlink-escape P2 stays open as a sanctioned-link exception.

### Findings

#### P0
None.

#### P1

**P1-1 — Gap 2: the dual-read migration covers capture-core only, not the matcher or the writer's consumed reader.**
- Section: 4.2–4.3.
- Claim: `readQueue` unions the new and legacy queue files, and `readConsumedKeys` unions the project and legacy consumed logs.
- Evidence: `match-decision-table.ts:192-194` has its own queue reader that resolves only `queuePath(projectRoot, sessionId)`; `match-decision-table.ts:256-258,289` uses that and `readConsumedRows`; `decision-record-writer.ts:769-804` reads only `consumedLogPath(projectRoot)`; `match-decision-table.ts:313-342` `--release` rewrites only `consumedLogPath`. The save step runs the matcher (`save.md:68-70`).
- Correction: apply the dual-read to `readQueueRecords` and `readConsumedRows` too, and make `--release` scan both logs. Otherwise a pre-fix answer that already sits in a hand-written table is invisible to the matcher and can be written again, and a legacy consumed key can never be released. Add a migration test seeded with a root queue and a root consumed row.

**P1-2 — Gap 2: the token root is not canonical across producers.**
- Section: 4.2.
- Claim: the identity is present at every call site, and the token hashes the "real project path."
- Evidence: five sweeps use raw `process.cwd()` (`sweep-transcript.mjs:311`, `sweep-codex.mjs:338`, `sweep-devin.mjs:295`, `sweep-opencode.mjs:301`, `sweep-pi.mjs:333` — the research names four); the writer resolves the git top-level (`config.ts:131-147,355`); the matcher defaults to `process.cwd()` (`match-decision-table.ts:349`).
- Correction: resolve one canonical root (git top-level plus realpath) inside `projectToken`/`stateDirPath`, or pass the resolved root everywhere. Otherwise a save or matcher run from a packet subfolder or through a symlinked path reads a different token directory than the hook wrote. Add a cross-producer token test.

**P1-3 — Gap 3: no test that the evidence block changes the model's decision.**
- Section: 5.3 and 6.
- Claim: the evidence block "makes the decision auditable"; verification is unit tests, a larger labeled set and save-step wording.
- Evidence: `save.md:72-74` remains the only decision rule; the verification table (line 166) has no fixture or live-save assertion; the open question (line 213) says it "may not change the model's choice."
- Correction: child 009 must assert the outcome on the 7-pair fixture — the three non-answers produce no entry and pair 6 produces one — not merely that the fields exist. "Auditable" also overstates transient output: the candidate is printed, not stored, and the decision record does not carry the evidence unless the save writes it into `why` or the appendix.

**P1-4 — Gap 3: the fixture line citations are false.**
- Section: 5.2.
- Claim: sources at `claude-chat-questions.jsonl:12`, `:16`, `:24` and `:22`.
- Evidence: the file has 14 lines. The replies are at line 2 (pair 1), 6 (pair 3), 14 (pair 7), and 12 (pair 6, the true answer). Lines 16, 24 and 22 do not exist; line 12 is cited as a non-answer but is the true answer.
- Correction: cite 2, 6, 14 and 12 respectively.

#### P2

**P2-1 — Gap 1: ROUTER.md's machine projection is not updated.**
- Section: 3.2 and 7.
- Claim: adding a DECISION intent row is enough for the loaded skill to know which references to open.
- Evidence: `ROUTER.md:159-181` holds `INTENT_SIGNALS`; `ROUTER.md:183+` holds `RESOURCE_MAP`; `ci-router-vocabulary-reach.cjs:118` parses `INTENT_SIGNALS`. The §2 bullets at 37-57 are the human projection only.
- Correction: add DECISION to both machine dicts (keywords plus the two resources) and keep §2 in sync; otherwise the deterministic router replay and reach check do not see the intent.

**P2-2 — Gap 1: several source citations and counts are wrong.**
- Section: 3.1–3.5.
- Claims and evidence: `sk-design/graph-metadata.json:48-80` does not contain the decision phrases; they are at 236, 243-244 and 267. `skill_advisor.py:257-268` is the SQLite path constants, not the four-input scoring. `031/spec.md:73` is the `sk-git` metadata row; the `system-spec-kit` edit is `implementation-summary.md:81`. The trigger-index lookup exits **1** on zero rows, not 0. The freshness checker reports `STALE COMPILED` only for `skill-graph.json` (`skill-graph-freshness.cjs:185-209`); SQLite is compared structurally and never gates (`:18-20, 214-225`). The summary's "one row field (gap 2) and one candidate field (gap 3)" is wrong: gap 2 adds no row field, and gap 3 adds five evidence fields.
- Correction: fix the locations and counts; name the native probe and `advisor_rebuild` rather than the Python/freshness checks for gap 1 verification.

**P2-3 — Gap 1: the collision scan is incomplete.**
- Section: 3.3.
- Claim: the only competing vocabulary is `sk-design`'s description word "decision" and its three signals.
- Evidence: `sk-design/graph-metadata.json:267` also declares `decision branch`; the deep-routing layer declares `architecture decision` at weight 2.0 (`skill_advisor.py:3543`) and `decision` at 0.7 (`:3524`). The four proposed phrases do not trigger the deep patterns, but the completeness claim is false.
- Correction: state the deep-routing exclusion and include `decision branch` and `architecture decision` in the live probe set.

**P2-4 — Gap 1: the evidence is from the Python fallback, not the native hook lane.**
- Section: 3.3 and 3.5.
- Claim: a three-token signal gives a 1.6 boost; the live source signal map reads metadata directly.
- Evidence: the 1.6 math is `skill_advisor.py:1642-1645` and the 0.5 + score·0.15 confidence curve is `:3795-3800`; the live hook filters at 0.8 (`skill-advisor-brief.ts:166-177`; `compat/contract.ts:10-13`) and the native scorer reads SQLite (`scorer/projection.ts:75-76`). The Python `--force-local` path returns `[]` for `environment variables`, while the native path returns system-spec-kit at 0.82/pass; `measured behavior block` returns 0.95/pass. The 42-case corpus is the Python scorer's corpus.
- Correction: the fix likely works, but the owning packet must verify the native `advisor_recommend`/hook brief at confidence ≥0.8 and uncertainty ≤0.35, and rebuild the SQLite index (`advisor_rebuild`), not just `skill-graph.json`.

**P2-5 — Gap 2: the safer project-local state directory was never considered.**
- Section: 4.4 and 8.
- Claim: the token subdirectory scopes data but cannot enforce real-path containment; a strict check would disable linked projects.
- Evidence: `capture-core.mjs:38` keeps state under the symlinked `.skilled`; `symlink-manifest.json:3` links `.skilled` whole; `review-report.md:124-132` asks for containment. The research rejects only a temp directory (line 193) and a strict containment check (line 201).
- Correction: evaluate a durable project-local directory outside `.skilled` (for example `<project>/.decision-capture/`), which closes the `symlinked_queue_path_escape` finding and removes the token/dual-implementation need. If rejected, record the gitignore/convention cost.

**P2-6 — Gap 2: "one path helper" is actually two token implementations.**
- Section: 4.2.
- Claim: capture-core owns `projectToken`, and the writer exports `stateDirPath`.
- Evidence: `capture-core.mjs` is ESM under `.skilled/hooks`, while `decision-record-writer.ts` is TypeScript under the spec-kit runtime; the runtime cannot statically import the hook module (the only existing import is a dynamic one at `session-stop.ts:101-105`).
- Correction: define the token algorithm once in a shared module, or add a cross-implementation test asserting `queueDir(projectDir)` and `stateDirPath(projectRoot)` agree for the same root.

**P2-7 — Gap 3: adding evidence fields breaks exact-shape tests and is undercounted.**
- Section: 6 and 7.
- Claim: tests are `chat-questions.test.mjs`, a larger labeled set and save-step wording; the change adds "one candidate field."
- Evidence: `sweep-transcript.test.mjs:183-192` deep-equals the full candidate object; `chat-questions.test.mjs:25` deep-equals the full result. The design lists five evidence fields (question type, option match, overlap, imperative opening, topic-shift marker).
- Correction: add `sweep-transcript.test.mjs` to the test plan and describe the candidate change as five fields or one nested evidence object.

**P2-8 — Gap 3: the evidence heuristics are underspecified.**
- Section: 5.3.
- Claim: the evidence block is deterministic.
- Evidence: `chat-questions.mjs` has no stopword list, verb lexicon or option/type parser; the fixture's pair 1 opens with the misspelling "Analyxe" (`claude-chat-questions.jsonl:2`), which a verb-list check may miss; the topic-shift marker "first" also matches a valid ordinal answer such as "First, make it blue."
- Correction: define the lexicons and require the marker to be a shift phrase (for example "actually", "instead", "let's") rather than a bare "first"; tolerate the fixture's spelling or rely on overlap for pair 1.

**P2-9 — Gap 3: option-match must be not-applicable for the true answer.**
- Section: 5.3.
- Claim: option-label match is one evidence field.
- Evidence: pair 6's question is a numbered list of questions, not lettered options (`claude-chat-questions.jsonl:11`); its true reply answers the numbers but names no option label (`:12`).
- Correction: emit `optionMatch: not_applicable` for open-value and numbered-list questions, or the model may read a false as a negative signal against the one true answer.

**P2-10 — Gap 3: "do not separate the true answer" is false on the fixture.**
- Section: 5.3.
- Claim: the detector's structural signals (closing paragraph, options present, later paragraph) do not separate the true answer from the non-answers.
- Evidence: pair 6's candidate is the only closing product candidate; pairs 1, 3 and 7 are earlier paragraphs (`chat-questions.mjs:88-96,137-146`; fixture lines 2, 6, 14). Closing does separate pair 6 from the non-answers.
- Correction: say the real issue is that question-side structure says nothing about whether the reply answered the question, as ADR-002's off-topic lone candidate shows — not that the signals fail on this fixture.

### Gap verdicts

- **Gap 1: AGREE WITH CHANGES.** The advisor-track owner is right and the metadata signal likely clears the native 0.8 bar (the `environment variables` precedent proves it), but verification must target the native lane and the SQLite rebuild, and the ROUTER machine dicts plus collision scan need completion.
- **Gap 2: AGREE WITH CHANGES.** The 043 child 008 owner is right and the token subdirectory closes the stated sharing gap, but the migration must dual-read in the matcher and writer readers, canonicalize the project root, and consider the safer project-local directory outside the symlink.
- **Gap 3: AGREE WITH CHANGES.** The 043 child 009 owner is right and the evidence block is a reasonable minimal mitigation, but the child needs an outcome test, concrete heuristic definitions, a not-applicable option-match state, and updated sweep-shape tests.

### Claims verified as correct

- `QUEUE_RELATIVE_DIR` is `.skilled/skills/.state/decision-capture`, and `queueDir`/`queueFile`/nudge all resolve under it (`capture-core.mjs:38,238-248`).
- `.skilled` is a single whole-tree link in the default `auto` mode (`symlink-manifest.json:3`; `symlink-engine.cjs:829-847`).
- Every producer passes a project directory into capture-core; the core has no other project identity (`capture-core.mjs:129-180`; five sweeps plus the three adapters and Stop hook).
- `--scan-orphans` enumerates every `<hex>.jsonl` in the state folder and prints `<count> <session-id>` with no project filter (`match-decision-table.ts:280-311`).
- Consumed rows carry `key`, `packet`, `id` and `at`, never a project (`decision-record-writer.ts:836`).
- The shared consumed log suppresses a key across projects; the key includes runtime, session, tool-use id and question index (`decision-record-writer.ts:811-838`; `capture-core.mjs:64-66`).
- `system-spec-kit/graph-metadata.json` has 31 intent signals and 21 derived trigger phrases, none decision-related (`graph-metadata.json:48-104`).
- The trigger index returns zero rows for both reported prompts (verified; exit status is 1, not 0).
- Phrase matching is boundary-bound and signal boosts scale with token count (`skill_advisor.py:1672-1679,3093-3103,1642-1645`).
- The source signal map reads `intent_signals` and `derived.trigger_phrases` directly (`skill_advisor.py:1205-1248,1389-1391`).
- Packet 031's `environment variables` precedent is real: the spec records the empty route (`031/spec.md:40`), the implementation added the signal (`031/implementation-summary.md:81`), and the live native probe now returns system-spec-kit at 0.82/pass.
- 043's goal D1 freezes children to the pipeline, writer or save step (`goal.md:44`), and 007 recorded the advisor metadata as outside it (`007/implementation-summary.md:143`).
- The next free advisor packet is 034.
- The 12-character SHA-256 project-hash convention exists (`completion-evidence-response.mjs:19-21`; `hook-completion-evidence-stop.vitest.ts:33-35`).
- The chat detector pairs by position and copies the prompt text as the answer without judging relevance (`chat-questions.mjs:159-217`).
- The save step's chat rule is "for each chat candidate whose answer clearly replies to its question" (`save.md:72-74`).
- The fixture labels four product pairs (1, 3, 6, 7), with pair 6 the only positive (`claude-chat-questions.labels.json:2-8`); AC-008 requires four candidates including pair 6 (`005/acceptance-criteria.md:63`).
- The fixture's three non-answers are new-task requests (lines 2, 6, 14) and the true answer is the numbered reply (line 12).
- ADR-002's lone-candidate probe is real and used the "actually first fix the login bug" reply to "Should the badge be blue or amber?" (`007/decision-record.md:123-163`).
- The detector's ranking signals are closing paragraph, options present and later paragraph (`chat-questions.mjs:135-146`).
- The `symlinked_queue_path_escape` P2 finding and its containment recommendation are as quoted (`review/review-report.md:124-132`).
- 007 bundled several small fixes, so one child per gap versus one combined child is a real choice (`spec.md:117`).
- Gap 2 and gap 3 share no production file: gap 2 changes `capture-core.mjs`, the writer, the API barrel and the matcher; gap 3 changes `chat-questions.mjs` and `save.md`.
