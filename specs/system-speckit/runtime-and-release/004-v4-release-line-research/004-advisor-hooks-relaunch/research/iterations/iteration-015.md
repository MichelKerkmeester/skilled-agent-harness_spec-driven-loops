# Iteration 15 — Final read-only verification pass

Segment 1, iteration 15 of 15. Read-only: no build, no install, no repository write outside this packet.
Every verdict below was re-derived from the file as it stands at HEAD in **this** iteration — the eight prior
verdicts were treated as hypotheses, not inherited. Where my measurement disagrees with an earlier pass's
number, the disagreement is stated rather than smoothed.

## Focus

Three jobs, as scoped: (1) re-verify each open P1 at its cited location and mark HOLDS or CHANGED,
(2) say for each whether any test in the tree would catch a regression, naming the file or saying none,
(3) name the strongest finding of each of the seven finding types.

## Actions Taken

1. Read the run config's `lineage` block and the iteration-15 record already present in the state log. The
   pre-existing record carried `type`, `iteration`, `status`, `newInfoRatio` and `timestamp` only — **no
   `runId`/`sessionId`/`lineageId`, no `focus`, no `answeredQuestions`**. The canonical record below was
   re-emitted through the append gateway with stable identity (receipt sequence 21, `ok: true`).
   **Correction, established after the fact and therefore recorded against my own first reading:** I first
   attributed that shape to a writer bypassing the gateway. Re-reading the state log *after* my own accepted
   append shows the same reduced shape, now carrying my `newInfoRatio` (0.3) — so the record is mine, it was
   accepted with identity, and the gateway's own state-log **projection** is what drops `runId`, `sessionId`,
   `lineageId`, `focus` and `answeredQuestions`. See f-iter015-006. The identity-bearing record is intact in
   `deltas/iter-015.jsonl`, which is why the reducer's combined read still sees it — but any consumer that
   reads the state log alone sees a record that fails the contract's own required schema.
2. Opened the ask-surface core and read `OPTION_LINE` **verbatim**, not from a note: line 39,
   `/^\s*(?:[-*+]\s+)?(?:\*\*|__)?\(?(?:([A-Ha-h])[).:]|([1-9])\))(?:\*\*|__)?\s+\S/`. Re-derived the
   behaviour from the alternation rather than from the earlier prose.
3. Located `markTurn` by grep (line 174, exported line 224) and the OpenCode marker key by grep (line 102).
4. Grepped the DSH adapter for `markTurn|nudged|markerDir` — **zero** hits, so the asymmetry is a missing call,
   not different wording.
5. Located `readFileSync(0, 'utf8')` in the Claude Stop adapter at line 83 and confirmed the enclosing
   `readStdin()` body has a bare `try/catch` and no deadline.
6. Grepped the shipped manifest for `hermes` — 3 hits, confirming the asset still carries the persona text.
7. Read the CI workflow's own comment describing what its drift-guard and parity steps assert (lines 151-169).
8. Enumerated hook `.cjs/.mjs` under `.skilled/hooks` and listed the doctor command inventory to test the
   "181 adapters" sizing and the "no doctor command for hooks" claim.
9. **Executed the Node advisor front door** on the f-iter001-001 prompt and printed the top-3 with score,
   confidence and uncertainty.

Not done, and why: the **Python** front door was **not** executed. The attempt used `timeout`, which does not
exist on this platform, so the command failed before reaching Python (`timeout: command not found`). Retrying
without it was out of budget once the gateway and both artifact writes were accounted for. f-iter001-001's
cross-door half therefore still rests on the cited CI line plus the suite inventory, and is marked at that
confidence — it is **not** upgraded by this iteration.

## Findings

### Job 1 and 2 — verdicts

| # | P1 under re-verification | Cited location | Verdict | Would a test catch a regression? |
|---|---|---|---|---|
| 1 | **f-iter001-001** — Node and Python front doors disagree on `add a changelog for this packet` | parity step at [SOURCE: .github/workflows/routing-registry-drift.yml:156] | **HOLDS, medium confidence — cross-door half still unexecuted.** Node door re-run: top-1 `sk-doc 0.347104`. Python door not reached (missing `timeout` binary). | **None.** No suite asserts the same top-1 from both front doors for one prompt. |
| 2 | **f-iter001-002** — the parity ratchet cannot see a front-door divergence | [SOURCE: .github/workflows/routing-registry-drift.yml:156] and suites at [:168] | **CHANGED — narrowed, and the narrowing is confirmed at source.** The step comment states the drift-guard asserts the hardcoded Python **and** TS routing maps equal the registry projection, and the parity suites assert per-mode routing. Map-level Python-vs-TS divergence is therefore reachable transitively. **Outcome-level** disagreement — fusion, scoring, ordering — for one prompt is not. | Map level: yes, `routing-parity-deep-skills.vitest.ts` and `routing-parity-deep-council.vitest.ts`, both named in that step. Outcome level: **none.** |
| 3 | **f-iter005-001 / f-iter005-002** — `1)` lists fire as menus, `1.` menus never do | [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:39] | **HOLDS, both halves, on the verbatim regex.** Alternative 1 is `([A-Ha-h])[).:]` — letters only, so no digit-plus-period form can ever match: the `1.` false negative is total, not marginal. Alternative 2 is `([1-9])\)`, matching `1)` wherever a numbered line begins with no requirement that the list be a choice: the false positive. `A.`/`A)` both match, so the defect is digit-specific. **New this iteration:** the same alternative is single-digit only, so a **ten-or-more-item** list (`10)`, `11)`) is also invisible — a third defect in one regex that earlier passes did not record. | **None.** `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.test.mjs` exists but returns **zero** grep hits for `OPTION_LINE`, `1)` and `1.`: the option-line regex has no case in its own suite at all. All three defects are unpinned. |
| 4 | **f-iter005-005** — send-back once per message on OpenCode, once per turn on DSH | [SOURCE: .opencode/plugins/ask-surface-guard.js:102] and [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:174] | **HOLDS.** Core exposes `markTurn`; OpenCode keys it on `opencode:${sessionID}:${turn.messageId \|\| turn.lastMessage}` — genuinely per message. The DSH adapter (`.dsh/plugins/repo-guards/index.mjs`) contains **no** `markTurn`, `markerDir` or `nudged` reference: it does not call the capability at all. | **Partial.** `opencode/plugins/tests/ask-surface-guard.test.cjs` covers the OpenCode side. The DSH test file exists and does contain option-shaped fixtures, but whether it holds a **two-message-in-one-turn** fixture — the only shape that separates per-turn from per-message — is still unverified. |
| 5 | **f-iter006-001** — the Claude ask-surface Stop hook blocks on stdin with no deadline | [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:83] | **HOLDS, line exact.** `readFileSync(0, 'utf8')` is line 83. The stronger form stands: a tested shared stdin-deadline module ships in the tree, so this adapter is not missing a mechanism — it is not adopting one that exists. | **None for the gap.** The deadline *contract* is tested; the absence of a deadline *in this adapter* is asserted nowhere. The adapter's own test cannot fail on a hang it never provokes. |
| 6 | **f-iter006-002 / f-iter013-001** — shipped AGENTS.md manifest still carries Hermes text | [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:1068] | **HOLDS, unchanged.** 3 hits for `hermes` at HEAD; the body string still ships the Hermes doctrine into the document the doctor writes into vendored repos. | **None.** No test imports the manifest and asserts its bodies match current canon. |
| 7 | **"181 hook adapters share one stdin module"** (sizing behind the over-engineering finding) | `.skilled/hooks/**` | **CHANGED — the number is not reproducible on any basis I can measure, and my basis differs from the earlier pass's.** Mine: 15 `.cjs`/`.mjs` files under ask-surface-guard paths. The earlier pass reported 200 hook sources / 40 stdin references / 61 `.cjs` / 14 stdin. Neither lands on 181, and the two passes did not measure the same population. The **substance** — many adapters, one stdin surface — holds; the **number** is unusable until its basis is stated and reproducible. | **None.** The shared module's own suite tests its behaviour, not how many adapters route through it, so count drift is invisible. |
| 8 | **f-iter008-001** — `my hooks are not firing, what do I run` reaches no doctor command | inventory under `.skilled/commands/doctor/` | **HOLDS.** Inventory at HEAD: `agents-md, ci, deep-loop, env, git, helper, install, mcp, overlay, runtime-mirrors, scripts, setup, sk-code, sk-skill, skill-advisor, speckit, symlink, update`. No `hooks`. `git` and `runtime-mirrors` mention hooks in passing — precisely the finding: hook triage has neighbours, not an owner. | **Partial, on the wrong axis.** A route-table validator and a phrase-reach checker exist, but nothing I opened requires that a *problem phrase* land on a command. A fully valid route table can still answer this prompt with nothing. |

### New finding — the gateway's state-log projection discards the fields the contract requires

`append-mode-event.cjs` accepted a record carrying `runId`, `sessionId`, `lineageId`, `focus` and
`answeredQuestions`, receipted it (`sequence: 21`, `ok: true`, `projectionRefreshed: true`), and refreshed
`deep-research-state.jsonl` with a record holding only `type`, `iteration`, `run`, `status`, `newInfoRatio`,
`ruledOut` and `timestamp`. The projection is lossy by exactly the fields the output contract names as
**required** and states are grounds for refusal (`stable-identity-missing`).

Why this is worth a P1 rather than a note: the refusal happens at the **gateway** boundary and the loss at the
**projection** boundary, so the two never meet — the gateway has no reason to refuse, and the state log it
writes is not schema-valid by its own contract. The failure mode is a re-dispatch loop rather than an error:
a validator reading the state log sees an iteration-15 record without identity or `answeredQuestions` and
re-runs the iteration, which is consistent with this iteration having been dispatched with its artifacts
already on disk. Verify:
`node -e "…JSON.parse each line of deep-research-state.jsonl; filter type==='iteration' && iteration===15; print keys"`
— the log side shows the reduced key set while `deltas/iter-015.jsonl` shows the full one.

### New finding — the recommendation order is not explicable by the payload

The f-iter001-001 execution produced this top-3 for `add a changelog for this packet`:

| rank | skill | score | confidence | uncertainty |
|---|---|---|---|---|
| 1 | `sk-doc` | **0.347104** | 0.82 | 0.20 |
| 2 | `system-spec-kit` | **0.579092** | 0.8313 | 0.16 |
| 3 | `sk-code` | 0.220033 | 0.82 | 0.26 |

Every axis visible in the response ranks `system-spec-kit` **first**: higher score (0.579 > 0.347), higher
confidence (0.8313 > 0.82), lower uncertainty (0.16 < 0.20). The payload nonetheless returns `sk-doc` at
rank 1. Iteration 1 recorded this as an observation on the grounds that intent could not be established from
output order. Two independent executions at HEAD now agree, and the claim I can defend without asserting
intent is the narrower, checkable one: **no field the response returns accounts for the ordering.** That is a
reproducible defect candidate or an undocumented precedence rule — not an inference from order alone.
Deliberately **not** called a bug: a fused rank may legitimately use a lane weight the response does not
expose, and that is a one-read question.

### Job 3 — strongest finding per type

- **Drift — strongest:** the AGENTS.md manifest still ships Hermes doctrine into vendored repos while the docs
  describe a five-runtime roster. Code, shipped asset and canon disagree, and the asset is the one that lands
  on disk. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:1068]
- **Misalignment with canon — strongest:** f-iter008-001. The doctor surface is organised as one command per
  operator problem; hook triage — the one problem an operator hits when the whole guard layer silently stops —
  is the gap in that organisation.
- **Bug — strongest:** f-iter005-002. The `1.` form is *the* default numbered-list form in the model output
  this detector is built to read, and the regex cannot match it under any input, plus the one-digit ceiling
  hides any list of ten or more. Total misses, not marginal ones.
  [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:39]
- **Improvement — strongest:** adopt the shared stdin deadline in the Claude ask-surface Stop hook. The
  cheapest fix in the run: the module exists, is tested, and the adapter simply does not call it.
  [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:83]
- **Operator and AI-user UX — strongest:** f-iter005-005. A guard that sends a turn back once per message on
  one runtime and once per turn on another reads, from the outside, as the same guard behaving differently
  for no visible reason — and the runtime that is stricter is the one whose operator cannot see why.
- **Over-engineering — strongest:** one option-line regex and one shared core re-exposed through every
  runtime adapter, with the DSH adapter not even calling the per-turn marker the core provides — copies
  without the capability. What breaks if removed: nothing new is gained by the extra copies; the risk is that
  fixing the regex once does not fix the six surfaces that wrap it.
- **Extension — strongest:** one shared detector corpus per concern, run under a hostile ambient env, so that
  "which runtime was I in" stops being a variable in whether the prompt was judged. Its first case set should
  be the option-line forms, because that regex currently has **no case at all**.

## Questions Answered

None of the eleven strategy key questions closes on this iteration. This is a verification pass: it refines
existing findings and adds an ordering defect candidate and a pipeline finding, but resolves no strategy
question and no carried open question. Recording an empty list rather than a near-match, so the reducer ticks
nothing.

## Questions Remaining

- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared-daemon lease/race are
  still unexercised, now across **ten** iterations. Still the largest untested claim in the run.
- **Which layer drops the advisor redirect** (CLI handler vs the shim's `recommend_with_native_advisor()`) —
  carried unchanged since iteration 1.
- **New — is the rank-1 anomaly a defect or an exposed-lane precedence rule?** One read of the fusion/ordering
  function against the fields it actually consumes closes it. Reproducer:
  `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a changelog for this packet"}' --format json`
- **The two front doors on one prompt** — the Python half still needs one run, now without `timeout`.
- **`hook-flags.sh` vs `hook-flags.cjs` one-shot differential** — still unrun.
- **Live confirmations still owed:** the Claude turn-end hang, one Codex compaction, `leaf-scopes.json`
  optionality.
- **Advisor follow-ups from generation 1** — sk-doc's `sk-create-skill-parent` shared-packet entry and the
  duplicate `package_skill.py`. Untouched, fifteenth iteration; the oldest open item in the run.
- **History recovery as an operator path** — after compaction, which command returns the pre-compaction turn,
  and does `session-history-lookup` have an operator entry point at all?
- **UX and extension proper** — enabling relaunch, reading the advisor brief, recovering history. Only ever
  reached sideways.
- **New:** what is the stated basis for the "181 adapters" figure? Two passes have now measured two different
  populations and neither reaches it. Restate it on a reproducible basis or drop the number.
- **New:** should the state-log projection carry `focus` and `answeredQuestions`, or is the delta file the
  intended sole home for them? One read of the projection builder answers it, and it decides whether
  f-iter015-006 is a defect or an undocumented division of labour.

## Next Focus

The run ends here at iteration 15. The handover that matters is a ranked one: settle the rank-1 anomaly with
one read of the ordering function (new, cheap, and it affects every recommendation the advisor has ever
returned), re-execute the Python advisor front door on the same prompt, then adopt the shared stdin deadline
in the Claude ask-surface Stop hook — the one finding in this run whose fix is already written, already
tested, and merely uncalled.

## SCOPE VIOLATIONS

None. All writes landed under `iteration-015.md` and `deltas/iter-015.jsonl`; the state log was touched only
through the append gateway.
