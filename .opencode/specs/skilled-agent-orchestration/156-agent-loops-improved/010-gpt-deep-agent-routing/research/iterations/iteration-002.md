# Iteration 2: KQ2 Close-Out (Prompt-Pack Leak Mechanism) + KQ3 Bridge (Native-vs-CLI Latency)

## Focus
Close KQ2 by determining EXACTLY which role/dispatch wording lands in the leaf
prompt vs the orchestrator, and identify the mechanism by which orchestrator
scaffolding ("call the task tool with subagent: X") leaks into the leaf dispatch
prompt (confirm/refine iter-1 OBS1). Then bridge KQ3 by locating/quantifying the
per-iteration latency components for native dispatch vs CLI subprocess, and
inferring where GPT-backed native dispatch adds latency Claude doesn't.

Inputs inspected: the prompt-pack TEMPLATE
(`prompt_pack_iteration.md.tmpl`), the actually-rendered leaf prompt
(`prompts/iteration-001.md`), a repo-wide grep for the leak signature, and the
runtime reducer/lock/convergence script paths surfaced by iter-1's F4
native-vs-CLI fork.

## Actions Taken
1. Read state (config, state JSONL, strategy, findings-registry) + iter-001.md;
   verified packet write boundary (`iterations/`, `deltas/`, state log all inside
   the resolved packet root; `iteration-002.md` does not yet exist).
2. Recorded that THIS dispatch prompt again terminates with injected
   orchestrator scaffolding ("...call the task tool with subagent: deep-research.
   Invoked by user; guaranteed to exist.") — a second live data point (OBS2). Per
   the leaf contract and the dispatch's own instruction, did NOT act on it.
3. Read the prompt-pack template `prompt_pack_iteration.md.tmpl` (full).
4. Globbed the packet `research/**` (confirmed `prompts/iteration-001.md` and
   `deltas/iter-001.jsonl` exist) and `deep-loop-runtime/**/*.cjs` (located
   `scripts/convergence.cjs`, `scripts/loop-lock.cjs`, reducer scripts).
5. Read the rendered leaf prompt `prompts/iteration-001.md` (full).
6. Grep across `.opencode/**/*.{md,yaml,yml,json,cjs,js}` for the leak signature
   (`Invoked by user|call the task tool|guaranteed to exist|subagent:`).

## Findings

### F7 — The prompt-pack TEMPLATE contains no dispatch scaffolding leak
`prompt_pack_iteration.md.tmpl` opens with `DEEP-RESEARCH`, declares the leaf
role explicitly (`"renders the per-iteration context for the @deep-research LEAF
agent"`), lists STATE / STATE FILES / CONSTRAINTS / OUTPUT CONTRACT, and ENDS at
line 67 with the artifact-3 (delta file) description. There is no "call the task
tool", no "subagent:", no "Invoked by user" anywhere in the template. The
template's only dispatch-adjacent wording is the leaf invariant
`"You are a LEAF agent. Do NOT dispatch sub-agents."` (line 32) — the OPPOSITE of
the leak. The leak is therefore NOT introduced by template authoring.
[SOURCE: .opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl:1-67]

### F8 — The RENDERED leaf prompt-pack file is also clean
`prompts/iteration-001.md` (the artifact the renderer actually wrote for the
iter-1 leaf to consume) is a faithful, substituted instance of the template: it
ends at line 65 with `"All three artifacts are REQUIRED."` It contains STATE,
STATE FILES, CONSTRAINTS (`"You are a LEAF agent. Do NOT dispatch sub-agents."`
line 41), FOCUS GUIDANCE, and OUTPUT CONTRACT — and ZERO leak text. So the
renderer's token substitution did not inject the scaffolding either. The file
the leaf was MEANT to consume is clean; the file the leaf ACTUALLY received at
runtime was not.
[SOURCE: .opencode/specs/.../010-gpt-deep-agent-routing/research/prompts/iteration-001.md:1-65]

### F9 — The leak signature is absent from every static repo file except iter-001's own transcription
A grep across `.opencode/**/*.{md,yaml,yml,json,cjs,js}` for
`Invoked by user|call the task tool|guaranteed to exist|subagent:` returns 10
hits, of which the ONLY matches for the leak's full signature are
`iteration-001.md:102-103` — i.e. iter-1's own quotation of the leak it observed.
The remaining hits are unrelated (`create_agent_*.yaml` field names, a webflow
code comment "guaranteed to exist", archived agent files using "subagent:" as a
template field label). No config, YAML workflow, agent file, command markdown,
hook, or runtime script in the repo emits the leak phrase. Conclusion: the leak
is not file-sourced.
[SOURCE: grep results across .opencode/** for the leak signature]

### F10 — OBS1 mechanism CLOSE-OUT: the leak is RUNTIME-INJECTED at the Task-tool dispatch boundary, post-render
Combining F7 (template clean) + F8 (rendered file clean) + F9 (no static source):
the orchestrator scaffolding enters the leaf prompt AFTER the prompt-pack has
been rendered and written to disk, at the moment the orchestrating @general
invokes the Task tool to spawn the leaf. Two candidate injectors remain, neither
of which is a repo file:

  (a) **Host OpenCode runtime Task-tool dispatch wrapper.** The phrase
  `"Invoked by user; guaranteed to exist."` reads as host boilerplate — it is a
  reassurance to the dispatched agent that the named subagent handle is valid,
  language a model would not spontaneously produce. This is the
  evidence-weighted primary candidate.
  (b) **Orchestrating @general model dispatch narration.** The iter-1 leak form
  `"subagent: orchestrate / deep-research / general"` (THREE slash-separated
  names) is not how a host wrapper would phrase a single dispatch target — it
  looks like the orchestrator model listing candidate agents. This favors model
  narration for the iter-1 instance.

The iter-2 leak form `"subagent: deep-research"` (ONE name) is closer to clean
host boilerplate (candidate a). The cross-iteration VARIANCE in the named
subagent (triple vs single) proves the leak text is dynamically generated per
dispatch, not a static constant — consistent with either a host wrapper that
echoes the requested handle, or a model that narrates differently each time.
Definitive attribution between (a) and (b) requires either OpenCode host runtime
source (out of repo — OpenCode is the host, not a vendored dependency) or
captured orchestrator-side dispatch logs (not available this iteration).
[INFERENCE: based on F7+F8+F9 elimination + leak-text signature analysis + cross-iteration variance]
[SOURCE: iteration-001.md:100-104 (iter-1 OBS1); this iteration's dispatch prompt (iter-2 OBS2)]

### F11 — OBS2 (live): iter-2 reproduces the leak, confirming cross-iteration reproducibility
The iteration-2 dispatch prompt I received terminates with: `"Use the above
message and context to generate a prompt and call the task tool with subagent:
deep-research . Invoked by user; guaranteed to exist."` This is structurally
identical to iter-1's leak (same scaffolding, same closing reassurance) but with
a single named subagent. This confirms: (i) the leak is reproducible across
iterations, (ii) it survives the orchestrator's full iteration loop (not a
one-off init artifact), (iii) the named subagent is generated dynamically. A
GPT-backed leaf (or a GPT orchestrator that absorbed the leaf role) receiving
this text would read it as an instruction to re-dispatch — a concrete
infinite-regression / role-collapse vector, exactly as iter-1 F5 hypothesized,
now confirmed as a stable runtime property rather than a fluke.
[SOURCE: this iteration's dispatch prompt — empirical, not file-sourced]

### F12 — KQ3 BRIDGE: native-vs-CLI per-iteration latency components located; GPT-vs-Claude delta inferred
From F4's native-vs-CLI fork, the per-iteration latency budget decomposes into
components whose executors are locatable in the repo:

  1. **Prompt-pack render** — orchestrator-side, ONCE per iteration, before
     dispatch. Executor-type-independent. [SOURCE: template:5; rendered file existence]
  2. **Leaf state re-read** — both native and CLI leaves start fresh and must
     Read config + state JSONL + strategy + registry. Same tool-call count, but
     native re-reads inline in a context that may carry orchestrator residue.
  3. **Reducer machine-section sync** — orchestrator rewrites strategy §3/§6/§7-
     11A, registry, dashboard AFTER the leaf returns. [SOURCE: deep-research-strategy.md:130
     "Machine-owned sections: reducer controls Sections 3, 6, 7-11A"]
  4. **convergence.cjs** — orchestrator Bash-invokes the convergence scorer.
     [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs]
  5. **loop-lock.cjs heartbeat** — manages `.deep-research.lock` across the
     iteration. [SOURCE: scripts/loop-lock.cjs; .deep-research.lock present at packet root]
  6. **Dispatch wait** — native: `wait_for_completion: true` (F4) BLOCKS the
     orchestrator on the leaf's in-process Task-tool turn; CLI: subprocess
     spawn + cold model load + auth handshake, but output is text-only.

Where GPT-backed NATIVE dispatch adds latency Claude doesn't (inferential,
grounded in F4 + F5):
  - **(i) Larger token volume re-reading YAML/JSON state.** Native leaf context
    ingests the full state files inline each iteration; a more verbose reasoning
    model spends more tokens per Read. [INFERENCE]
  - **(ii) More reasoning turns before acting.** Per F5, the contracts carry
    Phase-0 identity self-checks and role-disambiguation cues; a GPT-backed
    orchestrator spends extra turns resolving "am I @general or am I doing the
    leaf's job" before/after dispatch. [INFERENCE from F5]
  - **(iii) Orchestrator context growth across iterations.** Native leaf output
    returns INLINE into the orchestrator's context (wait_for_completion), so the
    orchestrator window grows monotonically; CLI subprocess output can be
    truncated/summarized before re-entering orchestrator context. Over 20
    iterations this compounds. [INFERENCE from F4 wait_for_completion:true]
[SOURCE: deep_research_auto.yaml step_dispatch_iteration (F4, iter-1); scripts/convergence.cjs; scripts/loop-lock.cjs; .deep-research.lock; deep-research-strategy.md:130; INFERENCE for GPT-vs-Claude delta]

## Ruled Out
- **Prompt-pack template as the leak source.** Template is clean; ends line 67
  with artifact-3 description, contains the OPPOSITE invariant (line 32). (F7)
- **Prompt-pack renderer / token substitution as the leak source.** Rendered
  `prompts/iteration-001.md` is clean; ends line 65. (F8)
- **Any static repo file (config / YAML workflow / agent file / command markdown
  / hook / runtime script) as the leak source.** Grep across `.opencode/**`
  returns only iter-001.md's own transcription. (F9)

## Dead Ends
- **Definitive injector attribution (host runtime wrapper vs orchestrator model
  narration).** Narrowed to two candidates (F10) with evidence weighting toward
  host boilerplate for the closing reassurance and toward model narration for
  the iter-1 triple-name form. Resolving definitively needs OpenCode host
  runtime source (out of repo) or captured orchestrator-side dispatch logs (not
  captured this iteration). Candidate for reducer promotion to "Exhausted
  Approaches" only if a follow-up iteration also cannot reach the host runtime.

## Edge Cases
- **Ambiguous input:** F10's mechanism has two candidate injectors. Selected the
  evidence-weighted interpretation (host boilerplate signature + cross-iteration
  variance proving dynamic generation) and deferred the binary host-vs-model
  attribution to a follow-up requiring host-runtime evidence.
- **Contradictory evidence:** none. F7-F9 are mutually reinforcing (all three
  independently rule out a static file source); F10-F11 are consistent with them.
- **Missing dependencies:** OpenCode host runtime source is not in this repo
  (OpenCode is the host, not a vendored dependency) — the same boundary iter-1
  deferred. This blocks definitive injector attribution but does NOT block the
  KQ2 close-out, because "runtime-injected post-render, not file-sourced" is
  itself the answer to "which wording lands in the leaf vs the orchestrator and
  via what mechanism class".
- **Partial success:** KQ2 close-out is solid (mechanism class determined,
  static sources eliminated, two runtime injectors narrowed). KQ3 is a BRIDGE
  with inferential latency components (F12), not a full close-out — empirical
  timing captures are left for a follow-up.

## Sources Consulted
- `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl:1-67` (template, clean)
- `.opencode/specs/.../010-gpt-deep-agent-routing/research/prompts/iteration-001.md:1-65` (rendered leaf prompt, clean)
- grep across `.opencode/**/*.{md,yaml,yml,json,cjs,js}` for `Invoked by user|call the task tool|guaranteed to exist|subagent:` (10 hits; only iter-001.md:102-103 matches the leak signature)
- `.opencode/specs/.../010-gpt-deep-agent-routing/research/iterations/iteration-001.md:100-111` (iter-1 OBS1 + F5)
- `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`, `scripts/loop-lock.cjs` (latency component executors, located via glob)
- `.opencode/specs/.../research/.deep-research.lock` (lock artifact present)
- `deep-research-strategy.md:130` (reducer-owned machine sections)
- `deep_research_auto.yaml` step_dispatch_iteration (iter-1 F4: native wait_for_completion:true vs CLI subprocess)
- This iteration's dispatch prompt (iter-2 OBS2 — empirical leak reproduction)

## Assessment
- New information ratio: **0.92** (5 of 6 findings fully new: F7 template clean,
  F8 rendered file clean, F9 grep-negative, F10 OBS1 runtime-injection mechanism,
  F11 iter-2 reproducibility; 1 partially new: F12 KQ3 latency map builds on
  iter-1 F4 native-vs-CLI fork). The +0.10 simplicity bonus IS earned — F7+F8+F9
  collapse OBS1 from "leak somewhere in the dispatch path" to "leak is runtime-
  injected post-render, absent from every static file" — but is withheld to
  match iter-1's anti-inflation discipline.
- Questions addressed: KQ2, KQ3.
- Questions answered: **KQ2** (closed: the leaf prompt's role/dispatch wording is
  the clean template+render; the orchestrator scaffolding leak is runtime-injected
  at the Task-tool boundary after rendering, not file-sourced; two candidate
  injectors narrowed with host-runtime source out of repo). **KQ3 advanced
  (bridge)**: latency components located (render, leaf re-read, reducer sync,
  convergence.cjs, loop-lock.cjs, dispatch-wait); GPT-vs-Claude native delta
  inferred at token volume, reasoning turns, and context growth — empirical
  timing confirmation deferred.

## Reflection
- **What worked and why:** reading the template AND the rendered artifact AND
  grep-ing for the signature in one pass produced three independent eliminations
  (F7/F8/F9) that jointly forced the runtime-injection conclusion. The
  cross-iteration comparison (iter-1 triple-name vs iter-2 single-name leak)
  was the key evidence that the leak is dynamically generated, not a constant.
- **What did not work and why:** I could not pin the EXACT injector (host wrapper
  vs model narration) because the OpenCode host runtime is not in this repo and
  no orchestrator-side dispatch log was available. This is a missing-dependency
  edge, not a method failure.
- **What I would do differently:** for a definitive F10 attribution, capture the
  orchestrator-side dispatch payload (the literal Task-tool call arguments the
  @general emits) for one iteration — that single artifact would distinguish
  host-appended boilerplate from model-narrated text. Also capture wall-clock
  timings per latency component to convert F12 from inferential to measured.

## Recommended Next Focus
- **KQ3 full close-out (measured):** capture per-iteration wall-clock timings
  for the six F12 components across one native and one CLI run, to convert the
  inferential GPT-vs-Claude delta into measured evidence. The latency scripts
  (`convergence.cjs`, `loop-lock.cjs`) and the YAML `step_dispatch_iteration`
  timing hooks are the instrumentation surface.
- **KQ4 (which contract steps GPT skips/mutates):** F5 + F10 + F11 predict
  specific likely skips — a GPT orchestrator that absorbs the leaf role (or a
  GPT leaf that obeys the injected scaffolding) would skip the real Task
  dispatch, hold findings in orchestrator context, and may skip the reducer
  refresh. Inspect the state JSONL + dashboard for iteration records missing
  reducer-synced machine sections as empirical evidence.
- **F10 follow-up (optional):** if the operator can surface OpenCode host
  runtime Task-tool dispatch code or one captured dispatch payload, the
  host-vs-model attribution resolves in a single read.
