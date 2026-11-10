---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Audit the Skilled v4 release line (v4.0.0.0 to v4.0.2.0) for the CLI and deep-loop cluster: .skilled/skills/cli-external-orchestration/**, .skilled/skills/cli-classifier/**, .skilled/skills/system-deep-loop/** and .skilled/commands/deep/**. Find seven types: drift (release note vs code vs docs), misalignment with sk-code, sk-doc or Skilled canon, bugs (each with a repro command or failing check), improvement, operator and AI-user UX, over-engineering (name what breaks if removed), extension. Each finding states type, severity P0/P1/P2, a [SOURCE: path:line] you opened this iteration, the release that introduced it, confidence and a verify command. Release notes: .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0 3fed08373e, .1 bcb775402e, .2 7980001709, .3 c9bd4b156c, .4-.10 4d8f403355, .11 e2b2e393fa, .12 7fecd5f219, .13 42b41dd286, .14 bb9b9d1c09, .15 22c3a9b2c7, .16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317; always path-limit git diff. Read-only outside your research folder.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Fan-out parity (v4.0.0.0, v4.0.0.16): for each executor kind, do LINEAGE_COMMAND_ADAPTERS in fanout-run.cjs, EXECUTOR_KINDS, EXECUTOR_KIND_FLAG_SUPPORT and the model allowlists in runtime/lib/deep-loop/executor-config.ts, and each cli-*/SKILL.md agree?
- [x] Single-executor dispatch: which if_cli_* branches in .skilled/commands/deep/assets/deep-research-auto.yaml and deep-review-auto.yaml carry placeholder, field-name or ordering defects that would break or mislabel a run?
- [x] Mode retirement (v4.0.0.7): which remnants of agent-improvement or model-benchmark survive in system-deep-loop runtime code, mode-registry.json, /deep:* commands or tests?
- [x] Convergence (v4.0.0.3, v4.0.0.16): do runtime/scripts/convergence.cjs and deep-research/scripts/reduce-state.cjs honor stopPolicy, minIterations and the four convergence modes as deep-research/references/convergence/convergence.md documents?
- [x] Write containment and lane resume (v4.0.0.16): does runtime/lib/deep-loop/write-containment.ts and the fan-out resume path do what the v4.0.0.16 note claims?
- [x] cli-classifier and cli-jev (v4.0.0.2, v4.0.0.3, v4.0.1.0): do the router phrases, Jev feature switches and stored-key behavior in .skilled/skills/cli-classifier/** match the notes and their own hub-router.json, mode-registry.json and ROUTER.md?
- [ ] Hub canon (v4.0.1.0): do the cli-external-orchestration and cli-classifier hubs and every mode follow the parent-hub canon and the rule that each skill routes from its own ROUTER.md?
- [x] Over-engineering: which system-deep-loop runtime surfaces (divergent pivot, legacy projection, idea lifecycle, observability, wave planner) have no live caller or test, and what would break if each were removed?
- [x] UX: which steps of deep-research-auto.yaml, deep-research-presentation.txt or the cli-*/SKILL.md dispatch rules are unclear, contradictory or impossible to execute for the operator or an AI user?
- [x] Extension: which concrete extensions of the fan-out runner, the executor registry or ai-council would remove the manual steps and defects found in this cluster?
- [ ] Executor failure handling (v4.0.0.3, v4.0.0.16): when a CLI executor returns a quota error (devin resource_exhausted) or a builder throws, what does the single-executor workflow record, and can a run change executor without archiving its research tree?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Fixing anything: findings only, no edits outside the research folder.
- Clusters owned by sibling phases (spec kit core, authoring hubs, the other cluster of this pair, doctor/git/CI/runtime mirrors).
- Releases before v4.0.0.0 and commits after the v4.0.2.0 tag, except as context.

---

## 5. STOP CONDITIONS
- Forced depth: stopPolicy is max-iterations, so the run continues to maxIterations regardless of convergence telemetry.
- The orchestrator may extend the ceiling by +5 when the depth checkpoint is not cleared.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Fan-out parity (v4.0.0.0, v4.0.0.16): for each executor kind, do LINEAGE_COMMAND_ADAPTERS in fanout-run.cjs, EXECUTOR_KINDS, EXECUTOR_KIND_FLAG_SUPPORT and the model allowlists in runtime/lib/deep-loop/executor-config.ts, and each cli-*/SKILL.md agree?
- Single-executor dispatch: which if_cli_* branches in .skilled/commands/deep/assets/deep-research-auto.yaml and deep-review-auto.yaml carry placeholder, field-name or ordering defects that would break or mislabel a run?
- Mode retirement (v4.0.0.7): which remnants of agent-improvement or model-benchmark survive in system-deep-loop runtime code, mode-registry.json, /deep:* commands or tests?
- Convergence (v4.0.0.3, v4.0.0.16): do runtime/scripts/convergence.cjs and deep-research/scripts/reduce-state.cjs honor stopPolicy, minIterations and the four convergence modes as deep-research/references/convergence/convergence.md documents?
- Write containment and lane resume (v4.0.0.16): does runtime/lib/deep-loop/write-containment.ts and the fan-out resume path do what the v4.0.0.16 note claims?
- cli-classifier and cli-jev (v4.0.0.2, v4.0.0.3, v4.0.1.0): do the router phrases, Jev feature switches and stored-key behavior in .skilled/skills/cli-classifier/** match the notes and their own hub-router.json, mode-registry.json and ROUTER.md?
- Over-engineering: which system-deep-loop runtime surfaces (divergent pivot, legacy projection, idea lifecycle, observability, wave planner) have no live caller or test, and what would break if each were removed?
- UX: which steps of deep-research-auto.yaml, deep-research-presentation.txt or the cli-*/SKILL.md dispatch rules are unclear, contradictory or impossible to execute for the operator or an AI user?
- Extension: which concrete extensions of the fan-out runner, the executor registry or ai-council would remove the manual steps and defects found in this cluster?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"`defaultMode: null` is a misconfiguration."** It is documented fail-closed design: `hub-router.json:5` plus the `discoveryClassesContract` at `:27-31` state that a prompt carrying only hub-identity vocabulary scores zero modes and takes the defer outcome. Both advisor probes returned a single named executors, consistent with the contract. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **"`defaultMode: null` is a misconfiguration."** It is documented fail-closed design: `hub-router.json:5` plus the `discoveryClassesContract` at `:27-31` state that a prompt carrying only hub-identity vocabulary scores zero modes and takes the defer outcome. Both advisor probes returned a single named executors, consistent with the contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"`defaultMode: null` is a misconfiguration."** It is documented fail-closed design: `hub-router.json:5` plus the `discoveryClassesContract` at `:27-31` state that a prompt carrying only hub-identity vocabulary scores zero modes and takes the defer outcome. Both advisor probes returned a single named executors, consistent with the contract.

### **"Mode `aliases` are dead code."** Falsified — `executor-delegation.ts:212` reads them. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **"Mode `aliases` are dead code."** Falsified — `executor-delegation.ts:212` reads them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Mode `aliases` are dead code."** Falsified — `executor-delegation.ts:212` reads them.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **"`defaultMode: null` is a misconfiguration."** It is documented fail-closed design: `hub-router.json:5` plus the `discoveryClassesContract` at `:27-31` state that a prompt carrying only hub-identity vocabulary scores zero modes and takes the defer outcome. Both advisor probes returned a single named executors, consistent with the contract. (iteration 6)
- **"Mode `aliases` are dead code."** Falsified — `executor-delegation.ts:212` reads them. (iteration 6)

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
- Single-executor dispatch: the *ordering* and *missing-branch* defects are now evidenced, but the (iteration 1)
- Convergence, write containment, cli-classifier/cli-jev, hub canon, over-engineering beyond the (iteration 1)
- Mode retirement (v4.0.0.7): not started. (iteration 1)
- Convergence (`convergence.cjs`, `reduce-state.cjs` vs `convergence.md`), write containment/lane resume, `cli-classifier`/`cli-jev`, hub canon, over-engineering beyond the census case — all still open. (iteration 2)
- Single-executor dispatch: which `if_cli_*` branches in `deep-research-auto.yaml` and `deep-review-auto.yaml` carry placeholder, field-name or ordering defects? (deferred from iteration 1) (iteration 2)
- Where does `check-review-findings.js` / `check-review-final-line.js` live (v4.0.0.6 names them in "the review mode's `scripts/` folder"), and does it enforce the `Case:` line on saved reviews? Not found at two guessed `sk-code/scripts` and `sk-code/assets/scripts` paths. (iteration 2)
- Executor failure handling: quota errors and builder throws under the single-executor workflow. (iteration 2)
- Executor failure handling (v4.0.0.3, v4.0.0.16): quota errors and builder throws under the (iteration 3)
- NEW — Does anything test `convergence.cjs`'s research composite against the documented (iteration 3)
- Over-engineering: which runtime surfaces (divergent pivot, legacy projection, idea lifecycle, (iteration 3)
- Single-executor dispatch: which `if_cli_*` branches in `deep-research-auto.yaml` and (iteration 3)
- Write containment and lane resume (v4.0.0.16): does `runtime/lib/deep-loop/write-containment.ts` (iteration 3)
- NEW — `stopPolicy: max-iterations` makes convergence telemetry-only. Is there a config value or (iteration 3)
- Extension: what would remove the manual steps and defects found in this cluster. (iteration 3)
- `cli-classifier` and `cli-jev` (v4.0.0.2, v4.0.0.3, v4.0.1.0): router phrases, Jev feature (iteration 3)
- Hub canon (v4.0.1.0): parent-hub canon across `cli-external-orchestration` and `cli-classifier`. (iteration 3)
- UX: which steps of `deep-research-auto.yaml` are unclear, contradictory or impossible. (iteration 3)
- `cli-classifier` / `cli-jev`: router phrases, Jev feature switches, stored-key behaviour. (iteration 4)
- UX: which steps of `deep-research-auto.yaml` / `deep-research-presentation.txt` are unclear, (iteration 4)
- NEW — does anything validate the `containment.mode` value in `deep-research-config.json` for (iteration 4)
- Executor failure handling: quota errors (devin `resource_exhausted`) and builder throws under (iteration 4)
- Hub canon (v4.0.1.0): parent-hub canon and per-skill `ROUTER.md` routing. (iteration 4)
- Extension: what concrete change removes the manual steps and defects in this cluster. (iteration 4)
- NEW — F5's class: is there any validator that compares `ROUTER.md` frontmatter version and the (iteration 5)
- UX: which steps of `deep-research-auto.yaml`, `deep-research-presentation.txt` or the (iteration 5)
- Hub canon beyond the classifier: do `cli-external-orchestration` and its seven modes follow the (iteration 5)
- Extension: what removes the manual steps and defects in this cluster? F1 and F3 now suggest one: (iteration 5)
- Over-engineering: which system-deep-loop runtime surfaces have no live caller or test? (iteration 5)
- **Over-engineering:** unresolved in the other direction — this iteration *falsified* one removal candidate (`mode-registry` `aliases` is live, F3) but the divergent pivot, legacy projection, idea lifecycle, observability and wave planner surfaces remain uncensused. (iteration 6)
- **Executor failure handling:** still unexamined (quota errors, builder throws, executor swap). (iteration 6)
- **Hub canon (narrowed):** run `package_skill.py --strict` across the hub and its seven modes. Structure is present; conformance is unproven. (iteration 6)
- **Single-executor dispatch:** the `if_cli_*` branch defects remain unexamined. (iteration 6)
- **UX:** F6 adds a second UX instance (ambiguous multi-recommendation). `deep-research-auto.yaml` steps still unexamined. (iteration 6)
- **Extension:** F1 and F3 now point at one concrete extension rather than several — generate `hub-router.json` `vocabularyClasses` and `mode-registry.json` `aliases` from `ROUTER.md` §3, so one edit updates all three and the drift class closes at the source. (iteration 6)
- Is the idea-lifecycle suppression step ever expected to fire in the auto variant, or is F5 a (iteration 7)
- Does any external consumer (operator habit, tail, dashboard) read `orchestration-status.log`? Blocks (iteration 7)
- Hub canon conformance (`package_skill.py --strict` across hub + seven modes), single-executor (iteration 7)
- `deep-ai-council`: which of its scripts (`advise-council-completion`, `orchestrate-topic`, (iteration 7)
- `deep-research-presentation.txt` and `deep-review-auto.yaml` UX: unexamined. (iteration 8)
- What *is* the unknown-token policy of the `{...}` substitution engine — literal passthrough, empty (iteration 8)
- Persona vs `agentPersona` policy: which is canonical — hub §189/217 or the executor schema? (iteration 8)
- Does the reducer treat `status:"error"` iterations as counting toward `maxIterations`, or only the (iteration 8)
- Is there any normalisation that maps `executor.kind` onto `executor.type` before the YAML renders? (iteration 8)
- **Over-engineering**: F5 is a removal case (one roster, imported twice) but its blast radius needs a check for consumers outside the three files read. (iteration 9)
- **UX (narrowed, second instance)**: the branch's own `notes` block instructs `input: ''` citing the skill's §4 ALWAYS rule while the same argv passes a flag §266 forbids — an operator reading the notes gets a self-contradicting instruction. `deep-research-presentation.txt` still unexamined. (iteration 9)
- **Single-executor dispatch (narrowed)**: does `deep-review-auto.yaml`'s `if_cli_opencode` carry the same four defects? A twin comparison is the cheapest close. (iteration 9)
- **Hub canon**: `package_skill.py --strict` conformance across the hub and its seven modes — structure present, conformance unproven. (iteration 9)
- **Extension**: F1 + F2 + F4 now point at one change — make the single-executor branches consume the same resolver and argv builder as `fanout-run.cjs`, so a version rule is stated once. (iteration 9)
- **Executor failure handling** (v4.0.0.3, v4.0.0.16): quota errors and builder throws under the single-executor workflow — still open after four iterations of deferral. (iteration 9)
- **Carried forward, unresolved**: the substitution engine's unknown-token policy; persona vs `agentPersona`; idea-lifecycle suppression in the auto variant; the `orchestration-status.log` external-consumer question. (iteration 10)
- **UX**: all three `*-presentation.txt` assets are unexamined. (iteration 10)
- **Executor failure handling** (v4.0.0.3, v4.0.0.16): the switch half is now closed negatively — no switch surface exists in fan-out or the auto branches — but what a single-executor run *records* for a devin quota error is still unread after six iterations of deferral. (iteration 10)
- **Hub canon** (v4.0.1.0): `package_skill.py --strict` conformance across the hub and its seven modes remains unproven. (iteration 10)
- **Over-engineering**: F3 exposes a removal candidate — `runtime-capabilities.json` plus the un-called `dispatchSeat` seam — whose blast radius was not checked. (iteration 10)
- **Executor failure handling** (v4.0.0.3, v4.0.0.16): what a single-executor run records for a devin `resource_exhausted` — deferred again; still unread after seven iterations. (iteration 11)
- **Over-engineering**: `runtime-capabilities.json` plus the un-called `dispatchSeat` seam — blast radius unchecked. (iteration 11)
- **Hub canon** (v4.0.1.0): `package_skill.py --strict` conformance across the hub and its seven modes remains unproven; F6 now adds a second, concrete hub-resolution question (what `defer` means). (iteration 11)
- **Drift method**: F1 and F5 both derive from "feature landed, note silent". A `git log --name-only` pass per tag, diffed against the note's headline list, would close that class for the whole release line in one action. (iteration 11)
- **UX**: two of the three `*-presentation.txt` assets are still unexamined; F2 and F4 are `deep-review-*` instances and the `deep-research-*` twin has not been compared against them. (iteration 11)
- **Shell-hop class**: does the same raw-interpolation pattern exist in `deep-research-auto.yaml` and in the `if_cli_*` branches? F2 gives the search key (`"{...}"` inside a `--flag` in a YAML `command`/`run` step). (iteration 11)
- **Over-engineering** — `runtime-capabilities.json` plus the un-called `dispatchSeat` seam, blast radius still unchecked. (iteration 12)
- **Hub canon, narrowed twice.** New evidence: 9 of 9 hub packets (7 cli modes + both hubs) ship a `ROUTER.md`, and every `SKILL.md` references it (1–13 references each), so the "each skill routes from its own `ROUTER.md`" rule holds structurally. Still unproven: parent-hub canon under `package_skill.py --strict` for the hub and its seven modes. That is now the only unexplained half. (iteration 12)
- **UX** — two of three `*-presentation.txt` assets unread; the `deep-research-*` twin never compared against the `deep-review-*` instances in F2/F4 of earlier iterations. (iteration 12)
- **Drift method** — F1 is a second instance of "release note claims a sweep, tree shows a partial sweep". A `git log --name-only` pass per tag against each note's headline list would close the class in one action. (iteration 12)
- **Executor failure handling** — eighth iteration carried. Unread: what a single-executor run records for a devin `resource_exhausted` or a builder throw. (iteration 12)
- **F1's runtime repro** needs write authority the leaf does not have: confirm that `--bogus-flag` returns exit 0 through the gateway. (iteration 12)
- **UX** — two of three `*-presentation.txt` assets remain unread; the `deep-research-*` twin has never been compared against the `deep-review-*` instances. (iteration 13)
- **F1's runtime repro** — confirming `--bogus-flag` returns exit 0 through the gateway needs write authority the leaf does not have. (iteration 13)
- **Hub canon** (v4.0.1.0) — `package_skill.py --strict` conformance across the hub and its seven modes. Structural routing is proven; the parent-hub check is not. (iteration 13)
- **v4.0.0.16 fast-mode half** — "Pi's fast mode also sends GPT-6.1 Terra on the priority service tier". A `priority` grep over `.pi/extensions/pi-fast-mode-w-subagent-support` matched only benchmark fixtures, no source, so the claim is neither confirmed nor refuted. Needs the tier map read directly. (iteration 13)
- **Executor failure handling** (v4.0.0.3, v4.0.0.16) — ninth iteration carried. Still unread: what a single-executor run records for a devin `resource_exhausted`, or a builder throw. (iteration 13)
- **Executor failure handling** (v4.0.0.3, v4.0.0.16) — tenth iteration carried, still unread: what a single-executor run records for a devin `resource_exhausted` or a builder throw. (iteration 14)
- **Hub canon, mode half:** `package_skill.py --check --strict` across the seven `cli-external-orchestration` modes and the three `system-deep-loop` modes. Two of nine packets proven. (iteration 14)
- **`v4.0.0.12` doctor routing for deep-loop:** the note claims deep-loop prompts suggest `/doctor:deep-loop`; no cluster commit corroborates it, so the fix must live in the doctor/advisor trees. One read of `.skilled/commands/doctor/deep-loop.md` and the advisor hint map closes it. (iteration 14)
- **F1's runtime repro** needs write authority the leaf does not have: `--bogus-flag` exiting 0 through the gateway is still unconfirmed. (iteration 14)
- **`/doctor:setup` "lists all 17 doctor commands"** — uncounted in this iteration; cheap to verify against `.skilled/commands/doctor/`. (iteration 14)
- **v4.0.0.16 fast-mode half** — "Pi's fast mode also sends GPT-6.1 Terra on the priority service tier": a `priority` grep over `.pi/extensions/pi-fast-mode-w-subagent-support` matched only fixtures, so the tier map still needs a direct read. (iteration 14)
- **UX:** two of three `*-presentation.txt` assets remain unread; the `deep-research-*` twin has never been compared with the `deep-review-*` instances. (iteration 14)
- package_skill.py --strict conformance across the cli-external-orchestration hub, the cli-classifier hub and the deep-loop modes. Structural routing is proven; conformance is not. (iteration 15)
- Which token map binds {generation} versus {config.lineage.generation}? The spelling split is proven; the binding is not. (iteration 15)
- f-iter015-010 — drift, P2. The append gateway strips the fields the leaf contract requires. (iteration 15)
- Item 9 above: does append-mode-event.cjs parseArgs reject unknown options? Body unread; parseArgs at line 58 is the entry point. (iteration 15)
- Executor failure handling, eleventh carry: what a single-executor run records for a devin resource_exhausted, or when a builder throws. Still unread in the whole run. (iteration 15)
- Two of the three *-presentation.txt assets remain unread, and the deep-research twin has never been compared with the deep-review instances. (iteration 15)
- Whether any normaliser maps executor.kind onto executor.type before the YAML evaluates branch_on. f-iter015-001 rests on the absence of one; this iteration found no such step, but a renderer-side map would overturn it. (iteration 15)
- Hub canon (v4.0.1.0): `package_skill.py --strict` conformance across the hub and its modes — still unproven. (iteration 16)
- UX: the three `*-presentation.txt` assets, two of them still unread. (iteration 16)
- New: is any model-executed step contractually required to supply an in-cli `dispatchSeat`, or does `in-cli` silently become an external spawn? f-iter016-002 leaves this open. (iteration 16)
- Executor failure handling (v4.0.0.3, v4.0.0.16): what a single-executor run records for a devin `resource_exhausted` or a builder throw — twelfth carry. (iteration 16)
- **Drift method**: f-iter017-004 is a third instance of "the citation, not the code, is wrong". A (iteration 17)
- **UX**: two of the three `*-presentation.txt` assets remain unread. (iteration 17)
- **Executor failure handling** (v4.0.0.3, v4.0.0.16) — thirteenth carry: what a single-executor run (iteration 17)
- **`--pure` validity** (f-iter017-001): does the installed OpenCode accept `--pure`, and does it (iteration 17)
- **Hub canon** (v4.0.1.0): `package_skill.py --strict` conformance across the hub and its modes — (iteration 17)
- **Unknown-token rendering policy**: f-iter017-002 records the defect under all three candidate (iteration 17)
- **Hub canon** (v4.0.1.0): `package_skill.py --strict` conformance across the hub and (iteration 18)
- **Carried**: whether the installed OpenCode accepts `--pure` (f-iter018-003). (iteration 18)
- **Executor failure handling** (v4.0.0.3, v4.0.0.16) — fourteenth carry. Still unread: (iteration 18)
- **New**: `deep-review-confirm.yaml` has ~18 bare `{generation}` tokens and no (iteration 18)
- **New**: does the branch engine resolve `branch_on` to `if_<value>`, and what does it (iteration 18)
- **Staleness signal**: both confirm assets are dated Oct 28 and both auto assets Nov 7. (iteration 18)
- New: `mergeVerdicts` — the no-adjudicator fallback in `orchestrate-topic.cjs` — was read only at its call site; (iteration 19)
- New: does `council-graph-db.ts` / `council-graph-query.ts` (1,156 lines, two modules) have a live caller in the (iteration 19)
- UX: two of three `*-presentation.txt` assets remain unread; `deep-research-presentation.txt` never compared with (iteration 19)
- Executor failure handling (v4.0.0.3, v4.0.0.16): what a single-executor run records for a devin (iteration 19)
- Hub canon (v4.0.1.0): `package_skill.py --strict` conformance across hub + seven modes — still unproven. (iteration 19)
- Carried: `--pure` validity for the installed OpenCode (f-iter018-003); unknown-token `{...}` rendering policy; (iteration 19)
- The three `*-presentation.txt` assets: two still unread. (iteration 20)
- Mid-run quota handling (devin `resource_exhausted`) and builder throws: still unread across the whole run; only the pre-spawn refusal path is evidenced. (iteration 20)
- `--pure` validity for the installed OpenCode (f-iter018-003); unknown-token `{...}` render policy. (iteration 20)
- Hub canon (v4.0.1.0) `package_skill.py --strict` conformance for the hub and its seven modes — carried to the ceiling, unresolved. (iteration 20)
- **A third confirmation of the "documented surface absent from the tree" class** (f-iter021-002 (iteration 21)
- **Hub canon** (`package_skill.py --strict` across the hub and its seven modes): still unproven, (iteration 21)
- **Mid-run executor failure** (devin `resource_exhausted`, a builder throw): still unread across (iteration 21)
- **`--pure` validity** for the installed OpenCode (f-iter018-003) and the unknown-token `{...}` (iteration 21)
- **Whether `spawnCli`'s `code: null` timeout outcome reaches a caller as exit 0.** `spawnCli` (iteration 21)
- `divergence.overrides` is still summarised by `step_read_state` on both sides, but the auto (iteration 22)
- Does `validateSessionStateHierarchy` in `runtime/lib/council/session-state-hierarchy.cjs` (iteration 22)
- Carried: hub canon `package_skill.py --strict`; mid-run executor failure (devin (iteration 22)
- Why do the review twins differ by 496 lines while the council twins differ by 11? The council (iteration 22)
- Hub canon `package_skill.py --strict` conformance; mid-run executor failure under the single-executor workflow; `--pure` validity — all carried, all untouched. (iteration 23)
- Is the delta-corruption fail-open path reachable in practice, or does the gateway's projection refresh refuse first (f-iter023-001)? (iteration 23)
- Does the resource-map extractor dereference delta rows without a null guard (f-iter023-006)? One fixture run with `--emit-resource-map` settles it. (iteration 23)
- Is `resolvedFindings` emitted by any live leaf or YAML step, or is it reducer-internal only? A (iteration 24)
- Carried: executor failure handling (devin `resource_exhausted`, builder throws) — fifteenth (iteration 24)
- Should `buildDimensionCoverage` read `config.reviewDimensions` plus `crossReference.core`, or is (iteration 24)
- Does anything read the **dashboard** verdict as a release decision, or is `review-report.md` the (iteration 24)
- `--pure` validity for the installed OpenCode; unknown-token `{...}` render policy. (iteration 25)
- The three `*-presentation.txt` assets: `deep-research-presentation.txt` was spot-read (iteration 25)
- `--executors=<json>` is named by `research.md:122`, `review.md:94` and (iteration 25)
- Mid-run executor failure (devin `resource_exhausted`, builder throw) — still unread (iteration 25)
- Hub canon under `package_skill.py --strict` across the hub and its three modes — carried (iteration 25)
- Mid-run executor failure (devin `resource_exhausted`, a builder throw): still unread. This iteration read only builders, never the failure path. (iteration 26)
- New: is `deep-loop-cursor-neutral-workspace` deliberately outside documented config? The env override exists (`DEEP_LOOP_CURSOR_NEUTRAL_WORKSPACE`) but no packet or config documents it. (iteration 26)
- `--pure` validity for the installed OpenCode; unknown-token `{...}` render policy — both carried. (iteration 26)
- Hub canon under `package_skill.py --strict` across the hub and its seven modes — carried again. (iteration 26)
- New: does any test exercise the Flash pin? `pinReasoningEffortForModel` is described as mirroring `executor-config.ts`, so a divergence between the two copies would be silent. (iteration 26)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
New: does any test exercise the Flash pin? `pinReasoningEffortForModel` is described as mirroring `executor-config.ts`, so a divergence between the two copies would be silent.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work: the ripgrep recipe over specs/ and .skilled/ found no prior packet for this exact topic.

Release map (tag to commit; diff between consecutive commits, always path-limited):
v4.0.0.0-beta.1 -> v4.0.0.0 3fed08373e -> v4.0.0.1 bcb775402e -> v4.0.0.2 7980001709 -> v4.0.0.3 c9bd4b156c -> v4.0.0.4..v4.0.0.10 all 4d8f403355 (tagged together: use each note and `git log --since/--until` by date or subject, not tag diffs) -> v4.0.0.11 e2b2e393fa -> v4.0.0.12 7fecd5f219 -> v4.0.0.13 42b41dd286 -> v4.0.0.14 bb9b9d1c09 -> v4.0.0.15 22c3a9b2c7 -> v4.0.0.16 f459b06479 -> v4.0.1.0 6a93a2cfeb -> v4.0.2.0 51f70a0317.
Release notes: .skilled/changelog/skilled/v4.0.<x>.md (19 files).

Evidence bar set by the orchestrator: every finding names its type (drift, misalignment, bug, improvement, UX, over-engineering, extension), severity P0/P1/P2, a [SOURCE: path:line] opened in this iteration, the release that introduced it, a confidence and a verify command. A bug needs a repro command or a failing check. Restating a release note is not a finding. The orchestrator opens at least two citations per iteration.

Cluster diff size per release (files changed, path-limited to cli-external-orchestration, cli-classifier, system-deep-loop, commands/deep): beta.1->.0 3564; .0->.1 132; .1->.2 284; .2->.3 657; .3->.4-10 1130; ->.11 19; ->.12 0; ->.13 188; ->.14 68; ->.15 294; ->.16 65; ->4.0.1.0 761; ->4.0.2.0 258.

Orchestrator observations to verify, not conclusions: deep-research-auto.yaml names the executor field `config.executor.type`, while runtime/lib/deep-loop/executor-config.ts treats `type` as a deprecated alias of `kind`. The if_cli_devin branch builds dispatchId from `{generation}` while post_dispatch_validate uses `{config.lineage.generation}`.

Generation 1 (archived under research_archive/, executor cli-devin deepseek-v4-1-flash-max) completed two iterations before Devin's daily quota ran out (`Your daily usage quota has been exhausted`, errorKind resource_exhausted). Its findings, verified by the orchestrator, are settled; do not redo them:
- Hermes removal: no live reference to cli-hermes, .hermes/ or the hermes function remains in cli-external-orchestration, system-deep-loop or commands/deep outside changelog history.
- DeepSeek Harness: hard-rules.json declares 13 rules; the fan-out builder enforces 12, with no-repo-root-dotenv unchecked because cwd is path.resolve(options.lineageDir) and never compared with repoRoot (fanout-run.cjs:3005,3056). One error message covers a missing route or lineage patch (fanout-run.cjs:3011-3012). The note's "three patches" omits the optional persona and MCP patches. The DSH roster lives twice (executor-config.ts DSH_SUPPORTED_MODELS and fanout-run.cjs DSH_ALLOWED_MODELS) and DSH_VERSION only in fanout-run.cjs.
- Orchestrator-confirmed bug: deep-research-auto.yaml has no if_cli_deepseek_harness branch, and the shared builder throws `cli-deepseek-harness requires a lineage directory` on the single-executor path because that branch passes only { env, cwd }. Repro: node -e "require('./.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs').buildLineageCommand({kind:'cli-deepseek-harness',model:'deepseek-v4.1-flash',sandboxMode:'workspace-write'},'x','workspace-write','acceptEdits',{env:process.env,cwd:process.cwd()})".
- Orchestrator observation: the gateway-projected iteration row in deep-research-state.jsonl keeps only type, iteration, run, status, newInfoRatio, ruledOut and timestamp, while the YAML's post_dispatch_validate lists focus and mode as required JSONL fields; verify-iteration.cjs passed anyway.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only under stopPolicy max-iterations)
- Per-iteration budget: 24 tool calls, 40 minutes (executor timeout 2400s)
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 2
- Started: 2026-11-08T20:14:35.000Z

- resource-map.md not present; skipping coverage gate
