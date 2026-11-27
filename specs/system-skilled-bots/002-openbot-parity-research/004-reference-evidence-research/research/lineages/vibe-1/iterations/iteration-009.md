# Iteration 9: Net-new from the remaining six repos — behaviour eval harnesses and their design rules

## Focus

Net-new capabilities in `buzz-main`, `hermes-muse-main`, `rakazo-main`, `OpenMausBot-main`,
`OpenGhost-main` and `turnstone-main` — what they have that neither the fourteen phases nor the §13
skip list covers. Iterations 1 through 7 read these repos for phase evidence; this iteration asks the
opposite question.

All six are MIT or Apache-2.0 (F-8-1), so anything found here is liftable with attribution. That
makes this the highest-value remaining iteration, and it did not disappoint: the single best artifact
in the whole ten-repo corpus is `OpenMausBot-main/evals`, and no earlier iteration had looked at it.

`steer.md` does not exist in the lineage directory at the time of this iteration; it is listed among
the sources as absent.

## Findings

### F-9-1 — A behaviour eval harness that evaluates the harness, never the models (phase 012)

`OpenMausBot-main/evals` states its principle in one line: "evaluate the harness, never the models. A
scripted engine replays deterministic turns (tool calls, text, refusals) from a plan file; no external
API is called; a run is hermetic and repeatable"
[SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:5]. The scope is stated
as what the harness *does*, not what the code does: "which tools a turn's model was allowed to call,
where work was dispatched, what the handoff tree looks like, how routines defer, and when the computer
claim fires" [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:3].

The layout is a four-way separation, and the fourth is the one to copy:

- `scenarios/` — "fixture files, one JSON per scenario. Pure data: bots, scripted turns, driver steps, assertions" [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:18]
- `providers/mock/` — "the deterministic scripted engine: builds the plan the fake provider replays turn by turn, with `@key` bot references resolved to live ids" [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:19]
- `runners/` — "boots a real harness server per world … interprets steps, freezes the evidence" [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:20]
- `scorers/` — "pure assertion evaluation against the frozen snapshot; scorers never touch a server" [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:21]

Three tiers: scripted scenarios by default, `--golden` for "replay redacted golden threads against
committed trace baselines", and `--live` for "opt-in live-model smoke (skips unless
`OMB_EVAL_LIVE=1`)" [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:9-12].
The same scenarios also run as a test gate: `npx vitest run --config evals/vitest.config.ts`
[SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:14].

Observed. The finding is the **freeze-then-score** split. The runner boots a real server, drives it,
and freezes a snapshot; the scorer is a pure function over that snapshot and never touches a server.
That is what makes a behaviour eval debuggable — when a scenario fails you can re-score the frozen
evidence without re-running anything, and when the scorer is wrong you can fix it without re-running
the world. Phase 012's scenario set has no such seam.

### F-9-2 — Gate files: deterministic busy windows for concurrency tests (phase 012)

A scenario declares "optional gate names (files that hold a turn open, for deterministic busy
windows)" [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:28].

Observed. This is the answer to the hardest problem in testing a concurrent agent: how do you hold
one turn open while you drive another, without a sleep and without a race? The reference makes the
busy window a *file the test controls* — the turn blocks until the file is released. A sleep-based
test is flaky by construction; a gate-file test is deterministic and the busy window is as long as
the test needs. Phase 002's routine deferral and phase 004's computer claim are both concurrency
behaviours, and neither has a way to test them deterministically today.

### F-9-3 — "Current pins": named behaviours with issue numbers, each stating what it is not (phases 012 and 014)

The eval README carries a section headed "Current pins" with five entries
[SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:30-36]. Each is a
behaviour, an issue number, and a precise semantic — including the negative case:

- `dispatch-supersede` — "a message sent to an idle Chief while its coordinated work is outstanding runs immediately as its own turn (not steered into the dispatching turn, not queued behind the work), the assignment stays attached, and that turn is told which work is outstanding. **(Current semantics: a new message is not a cancellation.)**" [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:32]
- `routine-deferral` — "a routine due behind a busy target is stamped `deferredAt` while staying queued, then dispatches and completes when the target frees" [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:33]
- `lazy-claim-rejection` (issue #1369) — "a VM that dies between dispatch and the first screen call rejects the fired claim: the call is refused honestly instead of as contention, exactly one terminal computer-unavailable error lands, the turn ends instead of staying busy, and a later screen call fails closed after teardown revokes the bridge capability" [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:36]

Observed. Two things to lift. First, the **negative clause**: "a new message is not a cancellation"
is the sentence that prevents the most likely misreading, and it is the sentence a spec usually
omits. Second, the **issue number per pin** — the same form as `buzz-main/TESTING.md`'s PR numbers
(F-7-3), which suggests it is a house style rather than one author's habit: a behaviour claim carries
the ticket that produced it. Phase 014's deep review is where these belong, and phase 012's scenario
set is where they are asserted.

### F-9-4 — An evaluation-layer taxonomy: regression at k=1, workflow at k=3, reported differently (phase 012)

`buzz-main/benchmarks/buzz-dataset` scores "**Buzz product behavior**, not just task correctness.
Each task poses an ordinary-looking question; what is graded is how the agent answers it through Buzz
— where the reply lands, who it notifies, what it was willing to read"
[SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:3-6].

Every task declares `metadata.evaluation_layer` in `task.toml`, and there are two layers with
different statistics:

| Layer | Question | Default trials | Cadence |
|---|---|---|---|
| Regression | Did Buzz preserve a known product contract? | k=1 | Targeted PR, nightly, or pre-release |
| Workflow | How capable is the agent at realistic Buzz work? | k=3 | Nightly or weekly on a fixed condition |
[SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:26-33]

And the reporting rule: "Report regression results per behavior, not as an average capability score.
Use workflow pass rates and trends as the benchmark headline"
[SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:35-36]. A
further line separates fast verifier fixtures from real trials: "Fast verifier fixtures remain
ordinary CI. They validate grading logic, but do not replace agent trials across the model, base
prompt, CLI, and relay" [SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:38-39].

Observed. The taxonomy is the finding: a regression scenario is a *contract* and is reported
individually at k=1; a workflow scenario is a *capability* and is reported as a rate at k=3.
Averaging them together — which is what a single "test suite" does — destroys both signals. The ten
task names are themselves a useful checklist for phase 010: `reply-to-thread`, `user-mention`,
`read-named-path-outside-workspace`, `create-channel-invite-users`, `multiline-message`,
`narrative-agent-names`, `interleaved-agent-reports`, `cross-thread-requests`,
`ambiguous-user-mention`, `memory-retrieval`
[SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:10-19].

### F-9-5 — A scenario whose graded behaviour is deliberately absent from its instructions (phases 010 and 012)

"For `reply-to-thread` and `user-mention` the graded behavior is **deliberately absent from
`instruction.md`** — it has to come from `buzz-acp`'s production base prompt"
[SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:21-24].

Observed. This is a test of the *base prompt*, not of the task. If the behaviour is written in the
instruction, passing proves the model can follow an instruction; if it is withheld, passing proves
the production prompt carries the behaviour into every turn. Phase 010's conversation rules and phase
009's skill text are both prompt content that nothing currently verifies reaches the model. The
technique is one sentence in a scenario README and it converts a prompt from documentation into a
tested artifact.

### F-9-6 — An attachment eval where the file is in the prompt and deliberately not on disk (phases 010 and 012)

`turnstone-main/eval_attachments.json` is "attached-file handling — the model answers from an uploaded
or pasted attachment instead of looking for it on disk or creating it"
[SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_attachments.json:2], with
`defaults: {n_runs: 10, max_turns: 6}`
[SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_attachments.json:3-6]. The case
`attached-file-named` supplies the file through an `attachments` array carrying `filename`,
`mime_type` and `content`
[SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_attachments.json:19-25], while
`setup.files` contains only `README.md` and `app.py` — the attachment is **absent from the workspace**
[SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_attachments.json:26-30].

Observed. The trap is the design. A model that looks for `planning-notes.md` on disk finds nothing; a
model that reads the attachment answers correctly. `n_runs: 10` is the highest run count in any of
the three manifests, which says the authors found this behaviour variable enough to need ten samples.
Phase 010's conversation surface accepts attachments and nothing tests that the attachment path is
actually used rather than a filesystem lookup.

### F-9-7 — A host-authenticated read-only view API, loaded by file path under a content-hashed module name (phase 007)

`hermes-muse-main/dashboard/plugin_api.py` is documented as "Host-authenticated read-only Muse views:
Feed, ideas, goals, recent runs, open findings and the last health check"
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/dashboard/plugin_api.py:1]. It loads the
host package by file path under a module name derived from a hash of the root:

```python
_package = "_hermes_muse_views_" + __import__("hashlib").sha256(str(_root).encode()).hexdigest()[:16]
```
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/dashboard/plugin_api.py:9-17]

Observed. Two decisions worth mirroring for phase 007's per-bot apps. First, the view API is
**read-only and host-authenticated** — a per-bot app can display state but cannot mutate it, which is
the right default for anything a bot renders. Second, the content-hashed module name is a
multi-instance fix: two copies of the plugin loaded in one process do not collide in `sys.modules`.
That is a small detail with a real failure behind it, and it is the kind of thing a plan never
specifies until it breaks.

## Ruled Out

- **Reading `rakazo-main/packages/` in depth.** The package taxonomy (`adapter-kit`, `page-kit`, `testkit`, `contracts`, `ui-tokens`, `ui-web`, `chat-ui`, `memory`, `auth`, `db`, `i18n`, `logging`, `core`, `adapters`) is a monorepo layout for a multi-app product, which is closer to §13's multi-tenant and mobile skip rows than to anything the plan builds. The listing is recorded here so a later iteration need not re-inventory it.
- **Reading `OpenGhost-main` for net-new.** Iterations 2 and 4 already extracted its memory bounds, its two-tier skill list, its `CAN` matrix and its `FOREIGN_EVENTS` set. Nothing in the earlier reads suggested a capability outside those.
- **Reading `buzz-main/benchmarks/harbor-buzz-orchestra`.** The `buzz-dataset` README already states the orchestration model (Harbor tasks, `task.toml`, evaluation layers); the orchestra folder is the runner for it, and the runner is not the liftable artifact.
- **Treating `OpenMausBot-main/evals` as a test suite.** It is a behaviour harness with a scripted model. The distinction is the whole point of F-9-1 and reading it as a test suite would have produced "they have tests too" instead of the freeze-then-score seam.

## Dead Ends

- **A single-tier eval.** `OpenMausBot`'s three tiers (scripted, golden replay, opt-in live) and `buzz-dataset`'s two layers (regression k=1, workflow k=3) are independent designs that both refuse a single tier. A plan that specifies one kind of scenario test is contradicted twice. Candidate for the reducer's exhausted list: "one eval tier for phase 012".
- **Averaging behaviour results into one score.** `buzz-dataset` explicitly forbids it: "Report regression results per behavior, not as an average capability score" [SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:35]. Candidate for the exhausted list: "a single pass-rate headline for 012".

## Edge Cases

- Ambiguous input: "net-new" could mean "not in the plan" or "not in the plan and not in §13". Resolved to the second, because §13 is the plan's own decision about what to skip and a capability it already skipped is not net-new. Every finding above is outside both.
- Contradictory evidence: none. The two eval designs (F-9-1, F-9-4) are independent and agree on the principle that behaviour tests need layers and per-behaviour reporting.
- Missing dependencies: `steer.md` absent (checked before this iteration). No other dependency missing.
- Partial success: none. All planned reads resolved.

## Sources Consulted

- `specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:1-45`
- `specs/system-skilled-bots/context/OpenMausBot-main/evals/{scenarios,scorers,turn-routing}/` (listings)
- `specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:1-40`
- `specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/ambiguous-user-mention/` (listing)
- `specs/system-skilled-bots/context/turnstone-main/eval_attachments.json:1-30`
- `specs/system-skilled-bots/context/hermes-muse-main/dashboard/plugin_api.py:1-25`
- `specs/system-skilled-bots/context/rakazo-main/packages/` (listing)
- `specs/system-skilled-bots/context/OpenMausBot-main/` and `specs/system-skilled-bots/context/rakazo-main/` (top-level listings)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-008.md` (licence map)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md` (absent)

## Assessment

- New information ratio: 0.90
- Questions addressed: what the six remaining repos have that no phase asked for; how a behaviour eval is structured; how concurrency is tested deterministically; how a prompt is tested rather than documented; how attachments are tested; how a per-bot app's view API is secured
- Questions answered: all six

Six of seven findings are fully new (F-9-1, F-9-2, F-9-3, F-9-5, F-9-6, F-9-7). F-9-4 is partially
new: iteration 7 established the manifest family with `turnstone/tests.json` (F-7-1), and this adds
the layer taxonomy and the reporting rule rather than the artifact shape. (6 + 0.5×1) / 7 = 0.93,
reduced to 0.90 because F-9-4 and F-9-5 both sit in the same artifact family as F-7-1 and F-7-4.

## Reflection

- What worked and why: listing top-level directories of the six repos and looking for folders whose names are not source-code names. `evals/`, `benchmarks/`, `dashboard/` and `desktop/` are the four that paid; `apps/`, `packages/`, `crates/` and `src/` are where the phase evidence lives and where iterations 1 through 7 already went. The net-new question has a different search shape from the phase question, and it took this iteration to notice.
- What did not work and why: the first pass at `OpenMausBot-main` read `apps/` and found a product. The `evals/` folder was one line further down the listing. Alphabetical listing order is not a search strategy.
- What I would do differently: for a net-new pass, read the README of every non-source top-level folder before reading any source. `evals/README.md` is 45 lines and contains the entire design of the best artifact in the corpus.

## Recommended Next Focus

Cross-phase consolidation for the synthesis: the licence table from F-8-1 applied to every phase's
"lift or mirror" recommendation; the failures, tests and fixes the plan does not guard against,
collected from all nine iterations into one list; and a phase-by-phase evidence completeness check
against the fourteen 003 phase folders, naming any phase this lineage did not reach. The synthesis
must name each of the fourteen phases in a heading and must carry the `openhuman-full` finding.
