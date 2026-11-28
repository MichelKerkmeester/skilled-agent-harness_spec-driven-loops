# Reference Evidence for the OpenBot Parity Build

**Lineage:** `vibe-1` · **Session:** `fanout-vibe-1-1795763950430-ek4gqy` · **Executor:** `cli-mistral-vibe` on `deepseek-flash`
**Iterations:** 10 of 10 · **Findings:** 65 · **Stop reason:** `maxIterationsReached`
**Depth mode:** expansive · **Frontier scope:** F-1-001, F-1-005 (both answered)

---

## 1. Executive Summary

This lineage read the ten reference repos against the fourteen phases of the 003 build plan and
produced 65 findings. Four things matter more than the rest.

**The plan is individually evidenced and collectively unverifiable.** Every one of the fourteen
phases has at least five findings with resolving citations, and the thinnest (008-vault) has five.
But no phase has a reference for its *acceptance criteria* — the artifact that says the phase is
done. The ten repos carry that artifact in four incompatible forms (turnstone's `tests.json` cases,
buzz's `task.toml` evaluation layers, OpenMausBot's `scenarios/*.json` with assertions, hermes-muse's
CI step list), and the plan's fourteen phases each write prose criteria with no shared shape and no
runner that reads one. That is the single structural gap this lineage found, and it is fixable with
an Apache-2.0 artifact that already exists.

**`openhuman-full` is the repo no earlier run studied, and it is a product stack, not a grab-bag.**
Its 21 vendored workspaces total roughly 4.7M lines of Rust and share a `TinyBus` module protocol, a
`tinystoragedrivers` port layer and a `tinysecurity` policy layer. Three of them carry capabilities
neither the plan nor the §13 skip list covers: an inbound event noise pipeline with five terminal
dispositions (`tinyeventqueues`), a data-egress policy with a URL canonicalization guard
(`tinysecurity-egress`), and bounded redaction that also scans prompts and tool definitions
(`tinysecurity-redact`). All 21 are GPL-3.0, so they are mirror-only.

**Three of the ten repos are GPL-3.0** — `openhuman-main`, `openhuman-full` and `tinychannels-main`.
The plan handles this well where it handles it at all: `contracts/verification.md` V9 requires a
line-comparison copy check and says a licence banner grep is not enough, and phase 003 states a
clean-room rule that keeps GPL sources out of a worker's brief. But the rule is trapped in phase
003's research folder, the 001 synthesis's licence table omits `tinychannels` entirely, and
`THIRD_PARTY_NOTICES.md` — required by AC-006 and AC-010, both marked Unmet — does not exist.

**This lineage corrected three claims in the earlier syntheses**, and the corrections are worth more
than a footnote: `openhuman-main/vendor/*` is 21 empty directories, "no context repository applies"
is false for phase 012, and the action-kind classifier is `app/src/lib/approvals.ts`, not
`shared/tool-name.ts`. It also corrected itself: iteration 8 claimed the plan does not state the GPL
rule, and iteration 10 found that it does.

---

## 2. Scope, Inputs and Method

**Inputs, all read-only.** The ten reference repos under `specs/system-skilled-bots/context/`; the
fourteen phase folders and `contracts/` of `specs/system-skilled-bots/003-openbot-parity-build`; the
three earlier syntheses under `002-openbot-parity-research/001`, `002` and `003`; and the built
runtime under `.skilled/skills/system-skilled-bots/`.

**Method.** Ten iterations, each with a written narrative, a delta of structured finding rows, and a
gateway-appended state record. Every claim carries `[SOURCE: path:line]` and is marked observed (the
line was read) or inferred (reasoned from it). Findings that one of the three earlier syntheses
already carries are cited and extended rather than repeated.

**Document shape.** Sections 4 to 17 are the fourteen 003 phases, one each, in folder order. The
closing sections are unnumbered because the phase set is fixed at fourteen and the mandatory closing
sections — Recommendations, Eliminated Alternatives, Open Questions, References — must follow them in
that order.

**A note on `steer.md`.** The lineage directory has no `steer.md` at any point in this run. It is
listed among each iteration's sources as absent. No ruling was issued, so no ruling was applied.

---

## 3. The Licence Map

| Repo | Licence | Verb | Evidence |
|---|---|---|---|
| `OpenBot-main` | MIT | Lift | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1] |
| `OpenMausBot-main` | Apache-2.0 | Lift | [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:2] |
| `rakazo-main` | Apache-2.0 | Lift | [SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2] |
| `openhuman-main` | **GPL-3.0** | **Mirror only** | [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2] |
| `openhuman-full` | **GPL-3.0** | **Mirror only** | [SOURCE: specs/system-skilled-bots/context/openhuman-full/LICENSE:1-2] |
| `OpenGhost-main` | MIT | Lift | [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1] |
| `hermes-muse-main` | MIT | Lift | [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1] |
| `turnstone-main` | Apache-2.0 | Lift | [SOURCE: specs/system-skilled-bots/context/turnstone-main/LICENSE:1-2] |
| `buzz-main` | Apache-2.0 | Lift | [SOURCE: specs/system-skilled-bots/context/buzz-main/LICENSE:1-2] |
| `tinychannels-main` | **GPL-3.0** | **Mirror only** | [SOURCE: specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2] |

Inside `openhuman-full`, all 21 vendored workspaces declare GPL-3.0 in their own manifest: nineteen
`GPL-3.0-only` and two `GPL-3.0-or-later` (`tinyflows`, `tinyhumans-sdk`)
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/Cargo.toml:2]
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyflows/Cargo.toml:2].

**What the plan already does.** `contracts/verification.md` V9 requires comparing lines between the
reference files and the design files, and states that "A licence banner grep alone is not enough"
[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/verification.md:41]. Phase 003
states the clean-room rule: "A worker that writes `terminal.rs`, `theme.rs`, the overlay keys or the
overlay view gets our design files and MIT or Apache references only. openhuman and tinychannels
paths appear in design documents as provenance, never in a worker brief"
[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/plan.md:168].
Phase 010 states it for its own reference
[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/mockups.md:17].

**What is missing.** Three things, all narrow:

1. The 001 synthesis's licence table names nine repos and omits `tinychannels`
   [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:120].
2. The GPL knowledge never reaches phase 011, whose primary reference *is* `tinychannels`.
3. `THIRD_PARTY_NOTICES.md` does not exist, though AC-006 requires it to name both lifted OpenBot
   files with the MIT licence and copyright line
   [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:61]
   and AC-010 requires a `## 010-conversations` section naming turnstone's Apache-2.0 licence and a
   statement of changes
   [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/acceptance-criteria.md:62].

Five of fourteen phases have a GPL-3.0 reference among their sources (003, 004, 005, 009, 011) and
two have it as the primary reference (003, 011). The clean-room rule is stated for 003 and 010 only.

---

## 4. 001-activity-and-actor

**Reference:** `OpenBot-main` (MIT). **Findings:** 7, shared with 002. **Iteration:** 1.

**Lift.** The seven activity group titles are liftable verbatim from `ACTIVITY_GROUPS`
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:28-39].
`stopped` is a derived predicate over a nullable `stoppedAt` instant rather than a stored status
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/queries.ts:300-304].
`oneRowPerAction` dedupes a retried action so it appears once
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:70-96].

**Where the plan differs, and which side the evidence supports.** The plan sorts recurring routines by
next fire; the reference never time-sorts them
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:175-192].
The evidence supports the plan here — a routine list sorted by next fire is more useful than one in
insertion order — but the plan should say so, because a builder reading the reference will not find
the sort.

**What the plan does not guard against.** Two failures. A needs-you item and the run that raised it
are deduped in the reference
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:147-152];
the plan has no needs_you/working dedupe rule, so the same work can appear twice on the surface. And
`oneRowPerAction` drops an action's first row when its failure row is loaded beside it — a real
reference bug the plan would inherit if it copied the dedupe without the fix.

---

## 5. 002-routine-layer

**Reference:** `OpenBot-main` (MIT), `OpenMausBot-main` (Apache-2.0), `rakazo-main` (Apache-2.0).
**Findings:** 7, shared with 001. **Iteration:** 1.

**The finding that matters.** `FIRING_FRAME` exists because a live firing read its own instruction
and the model did nothing while the run recorded success
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/routine-firing.ts:9-13].
The constant names the frame the routine runs in, so the model cannot mistake the routine's own text
for the task. The plan has no equivalent, and this is the highest-severity gap in the phase: a
routine that silently does nothing while reporting success is worse than one that fails.

**Second failure.** `checkInSubject` records a live identity collision where every unnamed check-in
matched every other one
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:52-68]. The fix
compares the full identity, not the subject alone.

**Lift.** The cron-to-sentence and preset-to-cron helpers in `OpenMausBot` and `rakazo` are
Apache-2.0 and directly reusable.

---

## 6. 003-terminal-screen

**Reference:** `openhuman-main` / `openhuman-full` `crates/openhuman-tui` (**GPL-3.0, mirror only**).
**Findings:** 6. **Iteration:** 3.

**Premise correction.** `openhuman-main/vendor/*` is 21 empty directories, 0 files each. The
`openhuman-tui` source is byte-identical in both checkouts, and `openhuman-full.build.log:950,956`
proves it compiled. Any earlier reading that treated `openhuman-main` as carrying the vendored tree
is wrong.

**Mirror these designs.** The transcript reducer ignores events for another `client_id`, so one
process cannot corrupt another's view
[SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/state.rs:1-12].
Every entry carries a monotonic `revision` so the renderer can tell a stale frame from a fresh one
[SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/state.rs:21-24,45-51].
The status vocabulary has six values and separates `cancelled` from `failed` and `stale` from both
[SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:5-35].
The four tabs are a closed cycle with `ALL`, title, next and previous
[SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/ui_state.rs:8-36].

**Where the plan differs.** The plan replaces control characters with `?`; the reference filters them
out with a `safe_text` pass
[SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:88-93].
The evidence supports the reference: a `?` is a visible artifact in a transcript, and a filter is not.

---

## 7. 004-computer-exposure

**Reference:** `OpenMausBot-main` (Apache-2.0), `openhuman-full` `tinycomputer` (**GPL-3.0**).
**Findings:** 6, shared with 005, 009, 010. **Iteration:** 2.

The plan's computer-exposure surface is thin in the references too: `OpenMausBot`'s computer claim is
the closest analogue and it is Apache-2.0. `tinycomputer`'s 11 member crates (accessibility, browser,
cursor, desktop, engine, skills) are GPL-3.0 and mirror-only, and the §13 skip list already excludes
the browser farm and container computer, so most of `tinycomputer` is out of scope by decision rather
than by omission.

**What is worth mirroring.** `tinycomputer-accessibility` centralises the macOS AX and `IOKit` FFI
plus a single persistent Swift helper process for focus queries, paste and overlay, and exposes
system-permission detection for Accessibility, Input Monitoring and Microphone
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinycomputer/crates/tinycomputer-accessibility/src/lib.rs:1-8].
The design point is that permission detection is a first-class query, not an error you discover when
an action fails.

---

## 8. 005-memory

**Reference:** `OpenGhost-main` (MIT), `openhuman-full` `tinymemory` (**GPL-3.0**). **Findings:** 6,
shared with 004, 009, 010. **Iteration:** 2.

**Where the plan differs, and the evidence is against the plan.** The plan refuses outright when a
memory render exceeds its budget. The reference degrades in three steps — drop lines, shorten prose,
then refuse — with a `MIN_PROSE_CHARS` floor
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/src/render.rs:80-116]
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/src/render.rs:22]. A hard
refusal turns a degraded-but-useful prompt into a failure.

**Second difference.** The reference uses one unit for every budget — `chars/4`, rounded up — and
stores the measured value
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/src/render.rs:29-31]
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/src/compile/mod.rs:34-46].
The plan mixes units across phases; one unit everywhere is the cheaper discipline.

**Lift.** `OpenGhost` bounds memory on read by slicing to 60 records
[SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:37], while the plan bounds only on
write. Bounding on read is what protects a long-lived store.

---

## 9. 006-approval-grants

**Reference:** `OpenBot-main` (MIT), `OpenGhost-main` (MIT). **Findings:** 6, shared with 007.
**Iteration:** 4.

**Correction to the 001 synthesis.** The action-kind classifier is not `shared/tool-name.ts`. It is
`app/src/lib/approvals.ts` (`ActionKind` at `:62`) with `docs/approvals.md:34-45`
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts:62]
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:34-45]. The 001 synthesis's
lift table still names the wrong file
[SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:126].

**Lift.** A kind of action is opened only by an allow given on that kind's own card
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:29-32]. The
`ConversationGrant` is keyed on bot, tool, place and account together
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:22] — a bot+tool key leaks
across places. There is a third answer, `hand_off`, in both `RuleBehaviour` and `ActionKindPolicy`
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts:60-71,87].

**Deferred.** `OpenGhost`'s `rules.js` carries a per-moment `CAN` capability matrix and a
`FOREIGN_EVENTS` set
[SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:39-50]. That is a per-action policy
packet of its own and belongs to a later run.

---

## 10. 007-per-bot-apps

**Reference:** `OpenBot-main` (MIT), `hermes-muse-main` (MIT). **Findings:** 6 shared with 006, plus
1 from iteration 9. **Iterations:** 4, 9.

**Lift.** The per-bot app refusal carries a connect-app marker and four reasons — `ConnectReason` —
and the hint is a hint, not a state
[SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/connect-prompt.ts:1-35]. A refusal
that names why the app is not connected is actionable; one that says "not connected" is not.

**From iteration 9.** `hermes-muse`'s dashboard view API is host-authenticated and read-only, and
loads the host package by file path under a content-hashed module name so two copies do not collide
in `sys.modules`
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/dashboard/plugin_api.py:1-17]. Read-only
is the right default for anything a bot renders.

**Coverage note.** This is one of the two thinnest phases in the packet: one dedicated finding plus a
shared set. A later run should give it its own iteration.

---

## 11. 008-vault

**Reference:** `rakazo-main` (Apache-2.0). **Findings:** 5. **Iteration:** 5.

**Lift, with the cost model.** The secret matcher carries `BUILD_COST = 8` and
`MAX_SECRET_MATCHER_STATES = 1_000_000`, scanning until building a matcher pays and refusing past the
state cap
[SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:16-53].
That is the guard against a pathological input taking the process down.

**Second lift.** The matcher returns merged ranges, so overlapping matches become one stretch rather
than several
[SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:5-12].
The placeholder guard holds the known dev and example values and throws when a non-dev value matches
[SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:1-55].

**Where the plan differs.** The reference grants a secret to a set of bots — `VaultBots {allBots,
botIds}` — while the plan grants to one
[SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:40-41].
And the reference never surfaces the secret store's own error, only one of three fixed refusals
[SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:25-38].
The evidence supports the reference on both: a store error can leak a path or a key name.

**Coverage note.** Thinnest phase in the packet: 5 findings, one iteration, one repo.

---

## 12. 009-skills

**Reference:** `OpenGhost-main` (MIT), `openhuman-full` `tinyskills` (**GPL-3.0**). **Findings:** 6,
shared with 004, 005, 010. **Iteration:** 2.

**Lift.** `OpenGhost` lists skill names and descriptions and loads one body on mention
[SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:76-78,58-62,81-96]. That is a
two-tier list: cheap index, expensive body.

**Where the plan differs.** The plan's skill block omits the skill's directory and its resources. The
reference block carries the directory, a relative-paths line and a completion note
[SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:81-96]. A skill that cannot name
its own directory cannot reference its own files.

---

## 13. 010-conversations

**Reference:** `turnstone-main` (Apache-2.0), `buzz-main` (Apache-2.0). **Findings:** 6 shared with
004, 005, 009, plus 2 from iteration 9. **Iterations:** 2, 9.

**Lift.** `turnstone`'s `CompactionPolicy` is the named reference for the deferred conversation
rotation
[SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/compaction.py:47-68,96-120].
`turnstone`'s `TerminalUI` with readline history and completion is the closest liftable terminal loop
and is Apache-2.0.

**From iteration 9.** Two test designs the phase needs. A scenario whose graded behaviour is
deliberately absent from its instruction file proves the production base prompt carries the behaviour
rather than the task text
[SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:21-24]. And an
attachment eval supplies the file through an `attachments` array while deliberately omitting it from
`setup.files`, so a model that looks on disk finds nothing
[SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_attachments.json:19-30].

---

## 14. 011-messaging-channels

**Reference:** `tinychannels-main` (**GPL-3.0, mirror only**). **Findings:** 7. **Iteration:** 6.

**Mirror this contract.** A capability declaration is a two-way honesty check. An *undeclared*
feature must return an explicit unsupported result — `unsupported && !retryable && !sent_before_error
&& continuation_message_ids.is_empty() && partial_overflow.is_none()` with an empty receipt — **and
must not reach the provider at all**; a *declared* feature must succeed
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:373-430].
A capability table that nothing checks is a comment.

**Mirror this record.** `ChannelCapabilities` is 17 fields with `VERSION = 2`, eight typed
sub-records, a pessimistic `unknown()` default and an `extensions` escape hatch
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:161-190].
`AccountCapabilities` puts five optional account-health booleans plus health text and
`proactive_target` on the record
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:148-159],
so a bot can report "configured but not linked" instead of failing at send time.

**Mirror these policies.** The acknowledge point is a per-adapter declaration with four positions —
`AfterReceiveRecord` (default), `AfterAgentDispatch`, `AfterDurableSend`, `Manual`
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:16-22].
Retries separate permanent from transient failures with eight literal patterns plus three substring
heuristics, so a "chat not found" does not burn five attempts over twelve minutes
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:13-47]. Durability
is negotiated down to `BestEffort` with `missing_capabilities` returned rather than failed
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:110-141].

**Licence note.** This phase's primary reference is GPL-3.0 and the clean-room rule does not reach it.
The phase already says it copies no tinychannels code; the licence should be named where a builder
will read it.

---

## 15. 013-manual-testing-scenarios

**Reference:** `turnstone-main`, `buzz-main`, `OpenMausBot-main` (all Apache-2.0). **Findings:** 7 from
iteration 7 plus 4 from iteration 9. **Iterations:** 7, 9.

**Premise correction.** The 003 synthesis says "no context repository applies" to this phase. Three do,
and they carry exactly the artifact the phase is supposed to produce.

**Lift the manifest shape.** A scenario is JSON with `defaults: {n_runs, max_turns}` and cases
carrying `id`, `description`, `user_prompt`, inline `setup.files`, `expected_actions`, `match_mode`
and a **ten-paraphrase `user_prompts` array**
[SOURCE: specs/system-skilled-bots/context/turnstone-main/tests.json:1-44]. The paraphrase set is the
test: a single-prompt scenario tests the prompt, not the behaviour. `match_mode: "ordered_subset"`
lets harmless extra steps interleave.

**Lift the harness shape.** `OpenMausBot`'s evals evaluate the harness, never the models: a scripted
engine replays deterministic turns, the runner boots a real server and freezes evidence, and scorers
are pure functions over the frozen snapshot that never touch a server
[SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:3-21]. That freeze-then-score
seam is what makes a behaviour eval debuggable.

**Lift the concurrency technique.** Gate files hold a turn open for deterministic busy windows
[SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:28]. A sleep-based
concurrency test is flaky by construction.

**Lift the layer taxonomy.** Regression contracts run at k=1 and are reported per behaviour; workflow
capability runs at k=3 and is reported as a rate; averaging them destroys both signals
[SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:26-39].

**Lift the falsifiability standard.** A guard whose removal fails no test protects nothing, and each
rule carries the PR that produced it
[SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:19-32].

---

## 16. 014-skilled-and-doc-alignment

**Reference:** `turnstone-main`, `hermes-muse-main`, `buzz-main`. **Findings:** 7, shared with 012 and
014. **Iteration:** 7.

**Lift the skill eval.** A skill-adherence eval embeds the skill body inline as a string, so the eval
tests the text rather than whatever the skill file currently says
[SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:1-55]. That is the
missing artifact for this phase: "alignment" should mean a model given the skill text does the thing.

**Lift the residue linter.** Thirteen labelled regexes, one per defect a prior round fixed, plus
structural checks, run in `--check` mode as a pre-commit hook that exits 1 on any hit
[SOURCE: specs/system-skilled-bots/context/turnstone-main/lint_hypothesis.py:127-164]. A doc-alignment
pass with no memory sees the same defect return in the next edit.

**Lift the generated-doc check.** Regenerate the reference in CI and `git diff --exit-code` the
committed copy
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml:26-27]. Drift
becomes impossible rather than reviewed.

**Lift the removal-completeness linter.** Scan prompts, templates, skills and the install doc for 27
removed action names, with a false-positive control: common words match only on a line naming the
tool, distinctive names match anywhere
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/scripts/check_callers.py:34-35].

---

## 17. 015-deep-review

**Reference:** `buzz-main`, `OpenMausBot-main` (both Apache-2.0). **Findings:** 7 shared with 012 and
013, plus 2 from iteration 9. **Iterations:** 7, 9.

**Lift the review criterion.** `buzz-main/TESTING.md`'s "Review-Proven Test Standards" is a criterion
mined from the last 25 PRs' review threads, each rule carrying its PR number
[SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:19-32]. That is the shape a deep
review needs: a rule, its evidence, and the ticket that earned it.

**Lift the pin format.** `OpenMausBot`'s "Current pins" state each behaviour with its issue number and
a negative clause saying what it is not — "Current semantics: a new message is not a cancellation"
[SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:30-36]. The negative
clause is the sentence a spec usually omits and the one that prevents the most likely misreading.

**What the plan does not guard against.** The 003 synthesis records that 012's recorded run goes stale
because 014 changes the code after 012 ran and nothing re-runs the corpus. The references' answer is
the generated-doc check: make the artifact regenerable and diff it in CI.

---

## 18. Net-New Capabilities

What the ten repos have that neither the plan nor the §13 skip list covers, ranked by value to a small
team. Size is Rust lines in the vendored workspace.

| Rank | Crate | Lines | Value | What it is | Covered? |
|---|---|---|---|---|---|
| 1 | `tinysecurity` | 288,030 | 5 | Egress policy, redaction, prompt/tool-definition scanning, audit batches, sandbox planning | No |
| 2 | `tinyeventqueues` | 89,431 | 5 | Inbound event noise pipeline with five terminal dispositions | No |
| 3 | `tinyjuice` | 636,193 | 4 | Pluggable token compression as a separate module | No |
| 4 | `tinydocs` | 83,976 | 4 | Typed document spec to office-format bytes | No |
| 5 | `tinysearch` | 87,179 | 3 | Provider-backed web search behind one service | No |
| 6 | `tinyvoice` | 567,904 | 3 | Voice in/out plus a platform hotkey crate | No |
| 7 | `tinystoragedrivers` | 72,569 | 3 | 14 storage ports including `-fence`, `-secrets`, `-blob`, `-document` | Partly (008) |
| 8 | `tinyconnectors` | 113,104 | 2 | Provider registry, scope catalogs, sync | Yes (§13 row 7) |
| 9 | `tinycomputer` | 630,174 | 2 | Desktop accessibility, browser, cursor, engine | Yes (§13 row 6) |
| 10 | `tinybox` | 159,147 | 2 | Jail, microVM, docker, ssh sandboxes | Yes (§13 row 6) |
| 11 | `tinyagents` | 510,260 | 2 | Agent definition, harness, hooks, orchestration, registry, runtime | Partly (002, 010) |
| 12 | `tinyflows` | 242,273 | 2 | Workflow automation with schedule, catalog, copilot, adaptive | Partly (002) |
| 13 | `tinymcp` | 150,644 | 2 | MCP client | No, but 009 covers the need |
| 14 | `tinymemory` | 99,763 | 2 | Memory API, integrations, tools, plus `tinyredact` | Yes (005) |
| 15 | `tinyskills` | 78,138 | 2 | Skill packages and drivers | Yes (009) |
| 16 | `tinywallet` | 129,856 | 1 | Multi-chain wallet primitives and x402 payments | No, and no need |
| 17 | `tinyhosts` | 67,066 | 1 | Deploy a Next.js app and its database | Yes (§13 rows 3, 4) |
| 18 | `tinybus` | 79,755 | 1 | Module protocol shared by every other crate | Infrastructure |
| 19 | `tinychannels` | 273,669 | 1 | Channel adapters and conformance | Yes (011) |
| 20 | `tinyhumans-sdk` | 13,407 | 1 | Typed client for the vendor backend | Vendor lock |
| 21 | `tiny-artifacts` | 6,720 | 1 | Artifact storage | No, and 008 covers storage |

**The three worth a phase of their own.**

*`tinyeventqueues`* is "durably queue noisy inbound events and filter them the way a person filters
noise, before they reach an agent", with eight named stages — ingress, normalize, gate, coalesce,
salience, attention lanes, cadence/ingestion budget, dispatch — and exactly one terminal
`Disposition` per event: delivered, context, digest, dead, or dropped with a `Reason`
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/crates/tinyeventqueues/src/lib.rs:1-15].
The transferable idea is the terminal disposition: a bot receiving events from five transports needs
an answer to "what happened to this event" that is not "it went to the agent" or "it did not".

*`tinysecurity-egress`* is a data-egress policy in two layers. A URL canonicalization guard rejects
input over 8192 bytes, any control character or whitespace, any backslash, and any authority
containing `@` or `%`
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-egress/src/url_guard.rs:12-26].
A privacy check rejects a request carrying a `transformation`, an `Unknown` data category, a category
outside the policy, `LocalOnly` without a local capability, and `Sensitive` mode with credentials,
identifiers or opaque browser traffic
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-egress/src/privacy.rs:7-30].
The design decision is that the caller declares a data category and the policy decides; `Unknown` is
rejected rather than defaulted, so a new call site cannot opt out by forgetting.

*`tinysecurity-redact`* bounds redaction with constants (`MAX_INPUT = 65_536`, `MAX_OUTPUT =
131_072`, `MAX_DEPTH = 32`), returns a `Sanitized<T>` carrying a content-free change tally, and scans
prompts and tool definitions as well as text
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs:1-35].
A tool's description is attacker-controlled input in any system that lets a third party contribute
tools, and the plan has no such check.

**From the other six repos.** `buzz-main/benchmarks/buzz-dataset` is a behaviour benchmark with ten
named chat scenarios and a two-layer evaluation taxonomy
[SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:8-19].
`OpenMausBot-main/evals` is the best artifact in the corpus: a three-tier behaviour harness with a
scripted engine, golden-thread replay and opt-in live smoke
[SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:9-24]. Both are
Apache-2.0 and liftable.

---

## 19. The Unguarded Failures

Twenty failures the reference repos hit, with the fix each adopted. Nineteen are absent from the
plan's acceptance criteria as far as this lineage read them.

| # | Failure | Fix adopted | Phase | Source |
|---|---|---|---|---|
| 1 | A routine fired, the model did nothing, the run recorded success | `FIRING_FRAME` names the frame | 002 | `routine-firing.ts:9-13` |
| 2 | Unnamed check-ins collided in the identity check | `checkInSubject` compares full identity | 002 | `plan.ts:52-68` |
| 3 | A retried action appeared twice | `oneRowPerAction` dedupe | 001 | `activity-rows.ts:70-96` |
| 4 | A memory render overflowed and the plan refused | An overflow ladder with a prose floor | 005 | `render.rs:80-116` |
| 5 | A skill block omitted its directory and resources | A two-tier skill list | 009 | `skills.js:76-96` |
| 6 | A terminal row drew unescaped control characters | A `safe_text` filter | 003 | `theme.rs:88-93` |
| 7 | An approval kind was opened by a card that did not own it | Each kind opened only by its own card | 006 | `approvals.md:29-32` |
| 8 | A grant leaked across places | `ConversationGrant` keyed bot+tool+place+account | 006 | `approvals.md:22` |
| 9 | A secret matcher ran unbounded | `BUILD_COST=8`, `MAX_SECRET_MATCHER_STATES=1_000_000` | 008 | `secret-matcher.ts:16-53` |
| 10 | A placeholder was mistaken for a secret | A placeholder guard ahead of the matcher | 008 | `secrets-guard.ts:1-55` |
| 11 | An adapter claimed a capability it had not implemented | Conservative default plus a conformance honesty check | 011 | `adapter.rs:55-64`, `conformance/lib.rs:395-423` |
| 12 | "chat not found" burned five retries over twelve minutes | A permanent-error classifier | 011 | `policy.rs:13-47` |
| 13 | A transport that could not honour durable send failed the send | Durability negotiated down with `missing_capabilities` | 011 | `policy.rs:110-141` |
| 14 | A regression test passed with its guard deleted | The falsifiability standard | 012, 014 | `TESTING.md:25-32` |
| 15 | A doc defect fixed in one round returned in the next | A residue regex list | 013 | `lint_hypothesis.py:127-141` |
| 16 | A generated reference drifted from its generator | Regenerate and `git diff --exit-code` | 013 | `test.yml:26-27` |
| 17 | A stale reference survived a rename because the name is a common word | A per-name false-positive rule | 013 | `check_callers.py:34-35` |
| 18 | A concurrency test was flaky because the busy window was a sleep | A gate file the test controls | 012 | `evals/README.md:28` |
| 19 | A prompt rule was documented but never reached the model | A scenario whose graded behaviour is absent from its instruction | 010, 012 | `buzz-dataset/README.md:21-24` |
| 20 | An attachment was looked for on disk instead of read from the prompt | An eval that omits the attachment from `setup.files` | 010, 012 | `eval_attachments.json:19-30` |

---

## 20. Premise Corrections

Three claims in the earlier syntheses that the reference code contradicts, plus one this lineage made
against itself.

| # | Claim | Correction | Evidence |
|---|---|---|---|
| 1 | `openhuman-main` carries the vendored tree | `vendor/*` is 21 empty directories, 0 files each; `openhuman-tui` source is byte-identical in both checkouts; `openhuman-full.build.log:950,956` proves it compiled | iteration 3 |
| 2 | "No context repository applies" to phase 012 | Three repos carry exactly 012's closing artifact | iteration 7 |
| 3 | The action-kind classifier is `shared/tool-name.ts` | It is `app/src/lib/approvals.ts` (`ActionKind` at `:62`) with `docs/approvals.md:34-45` | iteration 4 |
| 4 | *(self)* The plan does not state the GPL rule | It does: `contracts/verification.md:41` V9 line-comparison check, phase 003's clean-room rule, phase 010's mockup note. What is missing is distribution, not design | iteration 10 |

Three corrections across three syntheses is a rate worth stating: the earlier syntheses are reliable
on *what a repo does* and less reliable on *which file does it* and *whether a repo has been looked at
at all*.

---

## 21. What the Plan Does Better

The topic asks which side the evidence supports where plan and reference differ. On one point the plan
is ahead of all ten repos: **the copy check**. `contracts/verification.md` V9 compares lines between
the reference files and the design files and says a licence banner grep is not enough
[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/verification.md:41], implemented
as a `comm -12` over lines longer than 30 characters
[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/tasks.md:95].
No reference repo has an equivalent; the closest is `hermes-muse`'s `git diff --exit-code` on a
generated file, which catches drift but not copying.

The recommendation is therefore to extend the plan's own V9 check to the five phases with a GPL
reference, not to import a practice from outside.

---

## 22. Evidence Completeness and Limits

| Phase | Iteration | Findings | Primary reference |
|---|---|---|---|
| 001-activity-and-actor | 1 | 7 (shared with 002) | OpenBot |
| 002-routine-layer | 1 | 7 (shared with 001) | OpenBot, OpenMausBot, rakazo |
| 003-terminal-screen | 3 | 6 | openhuman-tui |
| 004-computer-exposure | 2 | 6 (shared) | openhuman, OpenMausBot |
| 005-memory | 2 | 6 (shared) | OpenGhost, openhuman |
| 006-approval-grants | 4 | 6 (shared with 007) | OpenBot, OpenGhost |
| 007-per-bot-apps | 4, 9 | 6 + 1 | OpenBot, hermes-muse |
| 008-vault | 5 | 5 | rakazo |
| 009-skills | 2 | 6 (shared) | OpenGhost, openhuman |
| 010-conversations | 2, 9 | 6 + 2 | turnstone, buzz |
| 011-messaging-channels | 6 | 7 | tinychannels |
| 013-manual-testing-scenarios | 7, 9 | 7 + 4 | turnstone, buzz, OpenMausBot |
| 014-skilled-and-doc-alignment | 7 | 7 (shared) | turnstone, hermes-muse, buzz |
| 015-deep-review | 7, 9 | 7 + 2 | buzz, OpenMausBot |

**Limits.** Two phases are thin: 008-vault (5 findings, one repo) and 007-per-bot-apps (one dedicated
finding plus a shared set). Four phases share a single iteration's findings (004, 005, 009, 010), so
their depth is uneven. `tinycomputer`, `tinybox`, `tinyagents`, `tinyflows`, `tinymcp`, `tinymemory`
and `tinyskills` were inventoried but not read in depth, because each is covered by a phase or by a
§13 skip row. `OpenGhost`'s `rules.js` per-action policy packet is deferred to a later run. No
iteration read the built runtime under `.skilled/skills/system-skilled-bots/runtime/lib/`, so this
lineage says nothing about whether the plan's contracts match the code that exists.

---

## 23. Recommendations

1. **Give phase 012 a shared acceptance-criteria format and a runner that reads it.** This is the one
   structural gap spanning every phase. Lift `OpenMausBot`'s freeze-then-score harness (Apache-2.0):
   scenarios as pure data, a runner that boots and freezes, scorers that never touch a server. Add
   gate files for concurrency and a ten-paraphrase set per case.
2. **Extend `contracts/verification.md` V9 to phases 003, 004, 005, 009 and 011.** The check already
   exists and is better than anything in the references; it is simply not applied where a GPL
   reference is in play.
3. **Add `tinychannels` to the licence table and name its GPL-3.0 status in phase 011.** The 001
   synthesis names nine of ten repos.
4. **Create `THIRD_PARTY_NOTICES.md`.** AC-006 and AC-010 both require it and both are Unmet.
5. **Add `FIRING_FRAME` to phase 002.** A routine that silently does nothing while reporting success
   is the highest-severity gap this lineage found.
6. **Replace phase 005's hard refusal with the three-step overflow ladder** and adopt one token unit
   (`chars/4`) across every phase.
7. **Adopt the capability honesty contract in phase 011**: an undeclared feature must return an
   explicit unsupported result and must not reach the provider.
8. **Add the permanent-error classifier to phase 011's retry policy** so a permanent failure does not
   consume an attempt.
9. **Add a residue linter and a generated-doc diff to phase 013.** Both are small, both are Apache-2.0
   or MIT, and both stop a class of defect the plan currently re-fixes.
10. **Consider three net-new capabilities as their own phase or child:** the inbound event disposition
    pipeline (`tinyeventqueues`), the data-egress policy (`tinysecurity-egress`), and prompt and
    tool-definition scanning (`tinysecurity-redact`). All three are GPL-3.0, so mirror the design.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Lifting code from `openhuman-main`, `openhuman-full` or `tinychannels-main` | All three are GPL-3.0; lifting would put the combined work under GPL | `openhuman-full/LICENSE:1-2`, `tinychannels-main/LICENSE:1-2` | 8, 10 |
| A per-crate licence check inside `openhuman-full` | The licence is uniform across all 21 workspaces; only two `-or-later` exceptions | `vendor/*/Cargo.toml` | 8 |
| A single global acknowledge rule for phase 011 | The ack point is a per-adapter declaration with four defensible positions | `adapter.rs:16-22` | 6 |
| A typed error taxonomy for permanent delivery failures | The reference uses substring matching on provider text; a taxonomy would require every transport to map its provider's errors | `policy.rs:13-47` | 6 |
| One prompt per manual-testing scenario | The reference uses ten paraphrases per case; a single prompt tests the prompt, not the behaviour | `tests.json:32-43` | 7 |
| A hand-maintained index of scenarios | Discovery-by-structure plus a guard script is the counter-example; the index is what the guard exists to avoid | `buzz-db/TESTING.md:3-18` | 7 |
| One eval tier for phase 012 | Two independent designs both refuse a single tier | `evals/README.md:9-12`, `buzz-dataset/README.md:26-33` | 9 |
| A single pass-rate headline for phase 012 | The reference explicitly forbids averaging regression and workflow results | `buzz-dataset/README.md:35` | 9 |
| Per-phase licence statements in each of the fourteen specs | Fourteen copies of one rule is the drift problem the generated-doc check exists to prevent | `test.yml:26-27` | 10 |
| Importing a copy check from a reference repo | None has one; the plan's own V9 is the best available | `verification.md:41` | 10 |
| Reading `src/approvals/mod.rs` for the approval index | The reference keeps its index in memory and the phase must not copy it | 003 synthesis, phase 011 | 6 |
| Reading `src/delivery/queue.rs` for queue-entry fields | A field list is the gap's closing artifact, not new evidence | 003 synthesis gap 4 | 6 |
| Treating the conformance crate as a test harness only | It is the enforcement point for the capability contract | `conformance/lib.rs:373-430` | 6 |
| Reading `buzz-acp/TESTING.md` and `buzz-cli/TESTING.md` | Per-crate variants of a pattern already established | `buzz-db/TESTING.md` | 7 |
| Reading `hermes-muse` `check_boundaries.py` | An architecture-import check, which belongs to 014 not 013 | `test.yml:22` | 7 |
| Treating `turnstone/tests.json` as a test runner | It is a declarative manifest; the manifest is the liftable artifact | `tests.json:1-7` | 7 |
| Reading `rakazo-main/packages/` in depth | A monorepo layout for a multi-app product, closer to the multi-tenant and mobile skip rows | `packages/` listing | 9 |
| Reading `OpenGhost-main` for net-new | Iterations 2 and 4 already extracted its memory bounds, skill list, `CAN` matrix and `FOREIGN_EVENTS` | iterations 2, 4 | 9 |
| Reading `buzz-main/benchmarks/harbor-buzz-orchestra` | The runner, not the liftable artifact | `buzz-dataset/README.md` | 9 |
| Treating `OpenMausBot-main/evals` as a test suite | It is a behaviour harness with a scripted model; the freeze-then-score seam is the point | `evals/README.md:5` | 9 |
| Re-reading the fourteen phase specs to build the licence table | The table is built from this lineage's findings plus the ten `LICENSE` files | iterations 1-9 | 10 |
| Counting findings per phase from the registry | Reducer-owned and read-only; counts come from the iteration files | `findings-registry.json` | 10 |
| Treating iteration 8's F-8-1 as correct | It was not, in the part that mattered; F-10-1 replaces it | `verification.md:41` | 10 |

---

## Open Questions

1. **Does the built runtime match the plan's contracts?** No iteration read
   `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs` or
   `bot-check.cjs`. The topic named them as inputs; this lineage did not reach them. A later run
   should compare the contracts to the code that exists.
2. **What is in `OpenGhost`'s per-action policy packet?** `rules.js` carries a `CAN` capability matrix
   and a `FOREIGN_EVENTS` set that no iteration read in full. It is the closest reference for a
   per-action policy and it is MIT.
3. **Which of the three net-new capabilities does a small team actually want first?** This lineage
   ranked them by value but did not test the ranking against the plan's build order or the team's
   constraints.
4. **Is `tinyeventqueues`' five-disposition vocabulary the right one?** It is the only reference that
   models inbound noise, so there is no second source to check it against.
5. **Do phases 007 and 008 need their own iterations?** Both are thin (one dedicated finding and five
   findings respectively) and both have Apache-2.0 or MIT references that would reward a full pass.
6. **What does `openhuman-full`'s `openhuman-tui` build log say about the rest of the tree?** Iteration
   3 read `:950,956` to prove compilation; the log is longer and may record what else built.

---

## References

**Reference repos** (all under `specs/system-skilled-bots/context/`): `OpenBot-main`,
`OpenMausBot-main`, `rakazo-main`, `openhuman-main`, `openhuman-full`, `OpenGhost-main`,
`hermes-muse-main`, `turnstone-main`, `buzz-main`, `tinychannels-main`.

**Build plan:** `specs/system-skilled-bots/003-openbot-parity-build/` — fourteen phase folders plus
`contracts/`.

**Earlier syntheses:** `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md`,
`.../002-plan-review-research/research/research.md`, `.../003-plan-depth-research/research/research.md`.

**This lineage's iterations:** `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-001.md` through `iteration-010.md`.

**Absent:** `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md` — no ruling was issued during this run.

**No resource map.** `config.resource_map_present` is false, so no `resource-map.md` citation is made.
