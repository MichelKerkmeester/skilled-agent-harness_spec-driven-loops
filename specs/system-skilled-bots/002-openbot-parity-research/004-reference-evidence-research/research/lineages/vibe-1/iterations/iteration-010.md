# Iteration 10: Cross-phase consolidation — the licence table, the unguarded failures, and a correction to this lineage's own iteration 8

## Focus

Cross-phase consolidation before synthesis. Three deliverables the topic asks for that no
single-phase iteration could produce: the licence of every source a phase is told to lift or mirror;
the failures, tests and fixes in the reference repos that the plan does not yet guard against; and a
phase-by-phase completeness check against the fourteen 003 phase folders.

This iteration also corrects iteration 8. F-8-1 claimed the plan "does not state" the GPL rule. That
was wrong, and the correction is F-10-1.

`steer.md` does not exist in the lineage directory at the time of this iteration; it is listed among
the sources as absent.

## Findings

### F-10-1 — Correction to F-8-1: the plan does handle GPL, but the rule is trapped in phase 003 and the synthesis's licence table omits tinychannels

Iteration 8 recorded that three of the ten repos are GPL-3.0 and framed the consequence as a rule
"the plan does not state"
[SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-008.md].
Reading the 003 plan's own licence machinery shows that framing was wrong in three ways.

**What the plan does state, and states well.**

- `contracts/verification.md` V9 requires a copy check that compares lines, not banners: "`comm -12 <(sort -u <reference files> | awk 'length>30') <(sort -u <design files>)` prints nothing. A licence banner grep alone is not enough" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/verification.md:41]. That is a stronger check than anything in the ten reference repos.
- Phase 003 states the clean-room rule explicitly: "A worker that writes `terminal.rs`, `theme.rs`, the overlay keys or the overlay view gets our design files and MIT or Apache references only. openhuman and tinychannels paths appear in design documents as provenance, never in a worker brief" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/plan.md:168], repeated in the hardening phase [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md:164].
- Phase 003's research names tinychannels' licence at the source: "`LICENSE`: GNU General Public License version 3" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md:101], and the review that produced the clean-room rule says "A second reference repo, tinychannels, is also GPL" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/fable-review-1.md:117].
- Phase 010 states the same rule for its own reference: "openhuman's composer is a design reference for the draft line and its history, and its client is GPL-3.0-only, so no frame reproduces its text or code" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/mockups.md:17].

**What is actually missing.** Three things, and they are narrower than iteration 8 claimed:

1. **The 001 synthesis's licence table omits tinychannels.** It reads: "OpenBot, OpenGhost and hermes-muse are MIT. OpenMausBot (except `enterprise/`), rakazo, turnstone and buzz are Apache-2.0. openhuman is GPL-3.0 and is design-only" [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:120]. Ten repos are named in the research topic; nine appear in that sentence. tinychannels is GPL-3.0 [SOURCE: specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2] and is absent.
2. **The GPL knowledge does not reach phase 011.** Phase 011's reference repo *is* tinychannels, and the clean-room rule lives only in phase 003's research and plan. A worker briefed on 011 has no statement that its primary reference is GPL.
3. **`THIRD_PARTY_NOTICES.md` does not exist.** AC-006 requires it to name both lifted OpenBot files with the MIT licence and copyright line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:61], and AC-010 requires a `## 010-conversations` section naming turnstone's Apache-2.0 licence and a statement of changes [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/acceptance-criteria.md:62]. Both are marked "Unmet", and the file is not present at `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md`.

Observed. The plan's licence discipline is better than this lineage gave it credit for. The gap is
distribution, not design: a rule that lives in one phase's research folder does not protect the phase
that needs it.

### F-10-2 — The licence table, applied per phase

Every phase's "lift or mirror" recommendation with the licence that governs it. "Lift" means copy
with attribution; "mirror" means read the design and write your own.

| Phase | Primary reference | Licence | Verb | Notice required |
|---|---|---|---|---|
| 001-activity-and-actor | OpenBot `activity-groups.ts`, `activity-rows.ts` | MIT | Lift | Copyright + permission notice, one entry per file (AC-006) |
| 002-routine-layer | OpenBot `routines/plan.ts`; OpenMausBot `cron-label.ts`; rakazo `schedule.ts` | MIT; Apache-2.0; Apache-2.0 | Lift | MIT notice; Apache-2.0 licence + NOTICE + statement of changes |
| 003-terminal-screen | openhuman `crates/openhuman-tui/` | **GPL-3.0** | **Mirror only** | Provenance in design docs, never in a worker brief |
| 004-computer-exposure | OpenMausBot computer claim; openhuman `tinycomputer` | Apache-2.0; **GPL-3.0** | Lift / mirror | Apache-2.0 notice; no openhuman code |
| 005-memory | OpenGhost `memory.js`; openhuman `tinymemory` | MIT; **GPL-3.0** | Lift / mirror | MIT notice; no openhuman code |
| 006-approval-grants | OpenBot `app/src/lib/approvals.ts`; OpenGhost `rules.js` | MIT; MIT | Lift | MIT notice |
| 007-per-bot-apps | hermes-muse `dashboard/plugin_api.py` | MIT | Lift | MIT notice |
| 008-vault | rakazo `vault.ts`, `secret-matcher.ts`, `secrets-guard.ts` | Apache-2.0 | Lift | Apache-2.0 licence + NOTICE + statement of changes |
| 009-skills | OpenGhost `skills.js`; openhuman `tinyskills` | MIT; **GPL-3.0** | Lift / mirror | MIT notice; no openhuman code |
| 010-conversations | turnstone `turnstone/cli.py` | Apache-2.0 | Lift | Apache-2.0 + statement of changes (AC-010) |
| 011-messaging-channels | **tinychannels** `adapter.rs`, `capabilities.rs`, `conformance/lib.rs`, `delivery/policy.rs` | **GPL-3.0** | **Mirror only** | Provenance only; the phase already says it copies no tinychannels code |
| 012-manual-testing-scenarios | turnstone `tests.json`, `eval_*.json`; buzz `TESTING.md`, `benchmarks/`; OpenMausBot `evals/` | Apache-2.0; Apache-2.0; Apache-2.0 | Lift | Apache-2.0 + statement of changes |
| 013-skilled-and-doc-alignment | turnstone `lint_hypothesis.py`; hermes-muse `check_callers.py`; buzz `check-postgres-test-discovery.py` | Apache-2.0; MIT; Apache-2.0 | Lift | Per-source notice |
| 014-deep-review | buzz `TESTING.md` review-proven standards; OpenMausBot `evals/README.md` current pins | Apache-2.0; Apache-2.0 | Lift | Apache-2.0 + statement of changes |

Sources for the licence column: [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1]
[SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:2]
[SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2]
[SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2]
[SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1]
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1]
[SOURCE: specs/system-skilled-bots/context/turnstone-main/LICENSE:1-2]
[SOURCE: specs/system-skilled-bots/context/buzz-main/LICENSE:1-2]
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2].

Observed. Five of fourteen phases have a GPL-3.0 reference among their sources (003, 004, 005, 009,
011), and two of those — 003 and 011 — have it as the *primary* reference. The plan's clean-room rule
is stated for 003 and 010 only.

### F-10-3 — The failures, tests and fixes the plan does not guard against

Collected from all nine prior iterations. Each is a defect a reference repo hit, with the fix it
adopted, and the phase that needs the guard.

| # | Failure the reference hit | Fix the reference adopted | Phase | Source |
|---|---|---|---|---|
| 1 | A routine fired, the model did nothing, and the run recorded success | A `FIRING_FRAME` constant that names the frame the routine runs in | 002 | `routine-firing.ts:9-13` (iteration 1) |
| 2 | Two needs-you items with the same subject collided in the identity check | `checkInSubject` compares the full identity, not the subject alone | 002 | `plan.ts:52-68` (iteration 1) |
| 3 | A retried action appeared twice in the activity list | `oneRowPerAction` dedupe keyed on the action id | 001 | `activity-rows.ts:70-96` (iteration 1) |
| 4 | A memory render overflowed the budget and the plan refused outright | An overflow ladder that degrades prose to a minimum before refusing | 005 | `render.rs:80-116`, `MIN_PROSE_CHARS` at `:22` (iteration 2) |
| 5 | A skill block omitted the skill's directory and resources | A two-tier skill list that carries the directory | 009 | `skills.js:76-78`, `:58-62`, `:81-96` (iteration 2) |
| 6 | A terminal row was rendered with unescaped control characters | A `safe_text` filter rather than a `?` replacement | 003 | `theme.rs:88-93` (iteration 3) |
| 7 | An approval kind was opened by a card that did not own it | Each kind is opened only by its own card | 006 | `approvals.md:29-32` (iteration 4) |
| 8 | A grant leaked across bots because the key was bot+tool only | `ConversationGrant` keyed bot+tool+place+account | 006 | `approvals.md:22` (iteration 4) |
| 9 | A secret matcher ran unbounded on a pathological input | `BUILD_COST=8` and `MAX_SECRET_MATCHER_STATES=1_000_000` | 008 | `secret-matcher.ts:16-53` (iteration 5) |
| 10 | A placeholder was mistaken for a real secret | A placeholder guard ahead of the matcher | 008 | `secrets-guard.ts:1-55` (iteration 5) |
| 11 | An adapter claimed a capability it had not implemented | A conservative `declared_capabilities()` default plus a conformance check that an undeclared feature must not reach the provider | 011 | `adapter.rs:55-64`, `conformance/lib.rs:395-423` (iteration 6) |
| 12 | A "chat not found" error burned five retries over twelve minutes | A permanent-error classifier that does not consume an attempt | 011 | `policy.rs:13-47` (iteration 6) |
| 13 | A transport that could not honour durable send failed the whole send | Durability negotiated down to `BestEffort` with `missing_capabilities` returned | 011 | `policy.rs:110-141` (iteration 6) |
| 14 | A regression test passed with its guard deleted | The falsifiability standard: delete the guard and watch the test fail | 012, 014 | `TESTING.md:25-32` (iteration 7) |
| 15 | A doc defect fixed in one round returned in the next | A residue regex list, one labelled pattern per fixed defect | 013 | `lint_hypothesis.py:127-141` (iteration 7) |
| 16 | A generated reference drifted from its generator | Regenerate in CI and `git diff --exit-code` the committed copy | 013 | `test.yml:26-27` (iteration 7) |
| 17 | A stale reference survived a rename because the name is a common word | A per-name rule: distinctive names match anywhere, common words only near their tool | 013 | `check_callers.py:34-35` (iteration 7) |
| 18 | A concurrency test was flaky because the busy window was a sleep | A gate file the test controls | 012 | `evals/README.md:28` (iteration 9) |
| 19 | A prompt rule was documented but never reached the model | A scenario whose graded behaviour is absent from its instruction | 010, 012 | `buzz-dataset/README.md:21-24` (iteration 9) |
| 20 | An attachment was looked for on disk instead of read from the prompt | An eval that supplies the attachment and omits it from `setup.files` | 010, 012 | `eval_attachments.json:19-30` (iteration 9) |

Observed. Nineteen of the twenty are absent from the plan's acceptance criteria as far as this
lineage read them. The two that are present are #14 in spirit (the plan's V9 copy check is a
falsifiability check) and #16 in part (phase 003's context manifest records a sha256 per image).

### F-10-4 — Phase-by-phase evidence completeness: all fourteen phases reached

| Phase | Iteration | Findings | Primary reference |
|---|---|---|---|
| 001-activity-and-actor | 1 | 7 (shared with 002) | OpenBot |
| 002-routine-layer | 1 | 7 (shared with 001) | OpenBot, OpenMausBot, rakazo |
| 003-terminal-screen | 3 | 6 | openhuman-tui |
| 004-computer-exposure | 2 | 6 (shared with 005, 009, 010) | openhuman, OpenMausBot |
| 005-memory | 2 | 6 (shared) | OpenGhost, openhuman |
| 006-approval-grants | 4 | 6 (shared with 007) | OpenBot, OpenGhost |
| 007-per-bot-apps | 4, 9 | 6 + 1 | OpenBot, hermes-muse |
| 008-vault | 5 | 5 | rakazo |
| 009-skills | 2 | 6 (shared) | OpenGhost, openhuman |
| 010-conversations | 2, 9 | 6 + 2 | turnstone, buzz |
| 011-messaging-channels | 6 | 7 | tinychannels |
| 012-manual-testing-scenarios | 7, 9 | 7 + 4 | turnstone, buzz, OpenMausBot |
| 013-skilled-and-doc-alignment | 7 | 7 (shared with 012, 014) | turnstone, hermes-muse, buzz |
| 014-deep-review | 7, 9 | 7 + 2 | buzz, OpenMausBot |

Observed. All fourteen phases have at least five findings with resolving citations. The thinnest
coverage is 008-vault (5 findings, one iteration, one repo) and 007-per-bot-apps (one finding from
iteration 9 plus a shared iteration-4 set). The synthesis should say so rather than imply uniform
depth.

### F-10-5 — Three premise corrections this lineage made to the earlier syntheses

Each is a claim in one of the three earlier syntheses that the reference code contradicts.

1. **`openhuman-main/vendor/*` is 21 empty directories.** Iteration 3 found 0 files in each, and `openhuman-tui`'s source byte-identical in both checkouts, with `openhuman-full.build.log:950,956` proving it compiled [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-003.md]. Any earlier reading that treated `openhuman-main` as carrying the vendored tree is wrong.
2. **"No context repository applies" to phase 012.** Iteration 7 found three repos carrying exactly 012's closing artifact [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-007.md].
3. **The action-kind classifier is not `shared/tool-name.ts`.** Iteration 4 found the real classifier at `app/src/lib/approvals.ts` (`ActionKind` at `:62`) with `docs/approvals.md:34-45` [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-004.md], and the 001 synthesis's lift table still names `shared/tool-name.ts` [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:126].

Observed. Three corrections across three syntheses is a rate worth stating: the earlier syntheses are
reliable on *what a repo does* and less reliable on *which file does it* and *whether a repo has been
looked at at all*. The synthesis should carry the corrections in a section of their own rather than
burying them.

### F-10-6 — What the plan does better than any reference repo

The topic asks which side the evidence supports where plan and reference differ. On one point the
plan is ahead of all ten repos: **the copy check**.

`contracts/verification.md` V9 requires comparing lines between the reference files and the design
files, and says explicitly that "A licence banner grep alone is not enough"
[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/verification.md:41]. Phase 003
implements it as a `comm -12` over lines longer than 30 characters
[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/tasks.md:95].
None of the ten reference repos has a check of this kind; the closest is `hermes-muse`'s
`git diff --exit-code` on a generated file (F-7-6), which catches drift but not copying.

Observed. This matters for the synthesis's tone: the plan is not uniformly behind the references. On
licence enforcement it is ahead, and the recommendation is to extend its own V9 check to the five
phases with a GPL reference rather than to import a practice from outside.

### F-10-7 — The one structural gap that spans every phase

Every phase's evidence in this lineage resolves to a *file and a line*. Not one phase has a
reference for its **acceptance criteria** — the thing that says the phase is done. The references
have that artifact in four different forms (turnstone's `tests.json` cases, buzz's `task.toml`
evaluation layers, OpenMausBot's `scenarios/*.json` with assertions, hermes-muse's CI step list), and
the plan's fourteen phases each write their own acceptance criteria in prose with no shared shape.

Observed. This is the cross-phase finding the synthesis should lead with: the phases are
individually evidenced and collectively unverifiable, because there is no shared acceptance-criteria
format and no runner that reads one. F-9-1's freeze-then-score harness is the artifact that would fix
it, and it is Apache-2.0.

## Ruled Out

- **Re-reading the fourteen phase specs to build the licence table.** The table in F-10-2 is built from this lineage's own iteration findings plus the ten `LICENSE` files, both already in the packet. A phase-spec reread would add the plan's *intent* per phase, which the 003 synthesis already carries.
- **Counting findings per phase from the registry.** The registry is reducer-owned and read-only for this agent; the counts in F-10-4 come from the iteration files, which are this lineage's own artifacts.
- **Treating F-8-1 as correct.** It was not, in the part that mattered. F-10-1 replaces it.

## Dead Ends

- **A per-phase licence section in each of the fourteen phase specs.** The plan already has one shared `contracts/` folder; fourteen copies of a licence rule is the drift problem `hermes-muse`'s generated-doc check exists to prevent. Candidate for the reducer's exhausted list: "per-phase licence statements".
- **Importing a copy check from a reference repo.** None has one. The plan's own V9 is the best available and should be extended, not replaced.

## Edge Cases

- Ambiguous input: "the failures, tests and fixes the plan does not yet guard against" could mean failures *in the references* or failures *the plan will hit*. Resolved to the first, because the second is speculation and the topic asks for evidence.
- Contradictory evidence: **this iteration contradicts iteration 8's F-8-1.** Both are preserved; F-10-1 states which is better supported and why (the 003 plan's `contracts/verification.md:41` and phase 003's clean-room rule are direct evidence that the plan states the rule). The contradiction is resolved in favour of F-10-1.
- Missing dependencies: `steer.md` absent (checked before this iteration). `THIRD_PARTY_NOTICES.md` absent, which is itself finding F-10-1's third part.
- Partial success: none. All planned reads resolved.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/contracts/verification.md:41`
- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:61`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/acceptance-criteria.md:62`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/mockups.md:17`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/tasks.md:95`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/plan.md:168`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md:164`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md:101`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/fable-review-1.md:117`
- `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:118-135`
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-{001..009}.md`
- `specs/system-skilled-bots/context/*/LICENSE` (ten repos)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md` (absent)

## Assessment

- New information ratio: 0.60
- Questions addressed: what licence governs each phase's reference; which reference failures the plan does not guard against; whether all fourteen phases are evidenced; what the plan does better than the references; what single gap spans every phase
- Questions answered: all five

Two of seven findings are fully new (F-10-1's plan-side evidence, F-10-6). Three are partially new
consolidations of prior iteration findings (F-10-2, F-10-3, F-10-4). Two are redundant restatements
of corrections already recorded (F-10-5, F-10-7). (2 + 1.5) / 7 = 0.50, plus the +0.10 simplicity
bonus for resolving the F-8-1 contradiction and reducing the licence question to one table: 0.60.

## Reflection

- What worked and why: reading the plan's own `contracts/` folder before writing the licence table. That one read turned a confident finding into a correction, which is the right outcome — a lineage that never corrects itself is not reading carefully. The `contracts/verification.md` V9 check is also the single best thing in the plan and no earlier iteration had read it.
- What did not work and why: iteration 8 asserted a negative ("the plan does not state") from evidence that only covered the reference repos. A negative claim about the plan needs a read of the plan. That is the same error as the 003 synthesis's "no context repository applies" to phase 012, which iteration 7 corrected — the mistake is symmetric and this lineage made it too.
- What I would do differently: for any finding of the form "X is missing", read X's most likely home before writing the finding. Both premise corrections in this lineage would have been findings rather than corrections if that had been done first.

## Recommended Next Focus

Synthesis. The packet has ten iterations, 63 findings, a licence table, a twenty-row unguarded-failure
list and a completeness check. The synthesis must name each of the fourteen 003 phase folders in a
heading, carry the `openhuman-full` finding, lead with F-10-7's structural gap, and carry the three
premise corrections in a section of their own rather than as footnotes.
