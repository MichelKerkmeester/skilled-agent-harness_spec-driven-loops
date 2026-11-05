# Iteration 4: Adversarial re-check — two of iteration 3's claims do not survive the source

## Focus

Adversarial re-check of the open findings before synthesis, on four named targets: (1) whether a `delivery prefix` line inside the `AGENTS.md` repository block silences check A6, and whether the rule-copy canary itself fails past 16,384 bytes; (2) whether an `AGENTS.md:70` wording naming `ROUTER.md` fits the 16-byte headroom; (3) whether `f-iter002-001` is worth a rule edit or is gate detail the rule rightly delegates; (4) whether any `REPO RULES.md` trigger-table row should route to the v4.0.1.0 doctor commands.

The iteration was run as a falsification pass. The working assumption for each target was that the prior claim was wrong until the source said otherwise, because iteration 3's headline finding (`f-iter003-001`) is the one this packet would carry into synthesis.

One ambiguity, resolved before research: "the `own` array" in the dispatch could mean the parsed `AGENTS.md` sections or the checker's local variable. It is the local variable — `const own` at `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:461]` — and that reading is what settles target 1.

## Actions Taken

1. Read config, state log, strategy, and iteration 3's full narrative; confirmed `progressiveSynthesis: true` and the lineage session id, and that the state log carries three `type: "iteration"` records.
2. Read the A6 `rowBudget` implementation in full, including the `defaultTools` resolver that supplies `tools.canary`.
3. Traced `manifest.root_file` and `manifest.budget` out of the shipped manifest, plus the 21 `delivery-anchor` pins and the `last_anchor_id`.
4. Read the rule-copy canary's own delivery-prefix check and its `MISSING:` / `BLOCKED:` emitter to answer whether the canary fails independently.
5. Read the current `AGENTS.md:70` sentence and its byte length, then measured five candidate rewordings against the 16,384-byte prefix.
6. Scanned every `SKILL.md` root under `.skilled/skills` for a sibling `ROUTER.md` to test whether naming `ROUTER.md` at `:70` is factually safe.
7. Re-read `REPO RULES.md` in full — the trigger table, the index, and §4's carve-outs — against the four v4.0.1.0 doctor commands.
8. Confirmed `RS-002` / `RS-004` / `RS-005` still exist in `parent-skill-check.cjs` (23 occurrences) and read `agents-md.md`'s manifest and plan-digest lines.

## Findings

### f-iter004-001 (P2) — `f-iter003-001`'s central mechanism is wrong: the `delivery prefix` guard reads the canary's stdout, never the repository block, and nothing silences A6

The guard iteration 3 read as an acknowledgment escape is a de-duplication guard, and its own comment says so: "The canary already names whatever it measured, so this row adds a figure only for a defect the canary did not report, instead of printing the same ceiling twice" `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:478-479]`.

What `own` actually holds is canary output, filtered twice:

```js
const own = output
  .filter((line) => line.includes(manifest.root_file))
  .filter((line) => /^(MISSING|BLOCKED):/u.test(line));
```

`[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:461-463]` — where `output` is the canary's stdout and stderr split into lines, `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:450]`. So a line qualifies only if the **canary printed it**, it **names `AGENTS.md`**, and it **begins with `MISSING:` or `BLOCKED:`**. A line of `AGENTS.md` itself can never satisfy any of the three, because `AGENTS.md` is never in `output`. The guard at `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:480]` therefore tests canary findings, not document prose.

Answering the dispatch's second half: **yes, the canary fails on its own** past 16,384 bytes. It carries its own anchor table and prefix budget (`prefixBytes: 16384`, `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:140]`), and when an anchor ends past it the failure text already contains the words `delivery prefix`:

> `${DELIVERY_PREFIX.file}: "${anchor.text}" ends at byte ${endByte}, past the ${DELIVERY_PREFIX.prefixBytes}-byte delivery prefix`

`[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:426-428]`, pushed at `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:426]` and printed as `MISSING: ${failure}` at `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:440]`.

That line satisfies all three `own` predicates: it names the root file, it starts with `MISSING:`, and it contains `delivery prefix`. So `own` is non-empty, `failures` is non-empty at `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:477]`, and A6 reports FINDING. The guard then suppresses the row's own duplicate message — which is exactly the intent stated in the comment. There is no acknowledgment path anywhere in A6.

Consequences to carry into synthesis:

- `f-iter003-001`'s sentence "That phrase is the sole acknowledgment the check accepts, and it is read from the block only" is **false on both halves**: no phrase is accepted, and nothing is read from the block.
- The design warning built on it — that a rule teaching the escape by quoting the words into the block "permanently silences A6" — is **false**. Writing `delivery prefix` into the repository block has no effect on A6 whatsoever. The warning must be dropped, not softened; keeping it would ship a rule that names a footgun that does not exist.
- What survives from `f-iter003-001` is the narrower, still-true part: the 16,384-byte delivery prefix is real, it is enforced twice (manifest pins plus canary), it is stated in no rule file, and the live run reports 16,368 of 16,384 `[SOURCE: AGENTS.md:70]`-adjacent headroom from row A6.

### f-iter004-002 (P2) — The proposed `:70` wording does fit: 89 bytes, 13 bytes of headroom, and every repository skill has a sibling `ROUTER.md`

Iteration 3 concluded "no version of 'name `ROUTER.md` at `:70`' fits on budget" and made a compensating trim a follow-up decision. That conclusion is wrong. It measured two variants — +55 bytes and +19 bytes — and never measured the short form the dispatch proposes.

Measured against the 86-byte sentence at `[SOURCE: AGENTS.md:70]`:

| Variant | Bytes | Delta | Last anchor | Verdict |
|---|---|---|---|---|
| current: `...what the router resolves, under the same loading rule as Gate 5.` | 86 | — | 16,368 | PASS |
| `...what its ROUTER.md resolves, under the same loading rule as Gate 5.` | 89 | +3 | **16,371** | **PASS, 13 bytes headroom** |
| `...what its sibling ROUTER.md resolves, under Gate 5's loading rule.` | 87 | +1 | 16,369 | PASS, 15 bytes |
| `...what the skill's sibling ROUTER.md resolves, under the same loading rule as Gate 5.` | 105 | +19 | 16,387 | FINDING, 3 past |
| iteration 1's full proposal | 141 | +55 | 16,423 | FINDING, 39 past |

The 89-byte form is the recommendation:

> `Routing means loading what its ROUTER.md resolves, under the same loading rule as Gate 5.`

It reads correctly in context. The sentence sits third in a paragraph whose first two sentences name `sk-code` and `sk-doc` `[SOURCE: AGENTS.md:70]`, so `its` resolves to the skill being routed, and the clause after the comma is unchanged from the version iteration 3 already verified against Gate 5 `[SOURCE: AGENTS.md:97-98]`. It changes exactly one token pair — `the router` → `its ROUTER.md` — so nothing else in the sentence has to be re-read.

Naming `ROUTER.md` is factually safe. A scan of every `SKILL.md` root under `.skilled/skills` found 57 roots, of which 3 lack a sibling `ROUTER.md` — and all three are vendored third-party packages under `node_modules/playwright-core/lib/tools/skills/`, not repository skills. Every first-party skill root has one, matching iteration 3's 54-of-54 figure.

The one honest caveat is the headroom, not the wording: 13 bytes is thin. A future edit that adds a single word above the last anchor re-opens this, and that is a standing property of the file rather than a defect in this edit. It does not justify the compensating trim, and it does not justify the acknowledgment line iteration 3 proposed — which `f-iter004-001` shows would not have worked anyway.

### f-iter004-003 (P3) — `f-iter002-001` is gate detail the rule rightly delegates; no rule edit, and the residual gap belongs to an `sk-doc` reference outside this packet's surface

The finding proposed appending `12a-router-contract` / `12b-routing-shape` codes to `[SOURCE: .skilled/repo-rules/skill-hub-routing.md:78]`. Three reasons not to:

- **The sentence is more true than when it was written.** `:78` says the per-hub gate "asserts only presence, never reachability" `[SOURCE: .skilled/repo-rules/skill-hub-routing.md:78]`. Checks `12a` and `12b` assert shape — a sibling file exists, a relative pointer exists, no router section remains in `SKILL.md`. Shape is not reachability, so the rule's distinction is exactly the right frame for the gates that appeared. Adding the codes would narrow a general statement into an inventory.
- **The rule's own contract forbids it.** `REPO RULES.md` §4 states that `skill-hub-routing.md` "carries no route-selection guidance: the mechanics stay in the skills, and the rule points at them" `[SOURCE: REPO RULES.md:98-101]`, and the rule does point: it sends the reader to section 7 of `parent-skills-nested-packets.md` `[SOURCE: .skilled/repo-rules/skill-hub-routing.md:71]` and says "The commands are in the reference above" `[SOURCE: .skilled/repo-rules/skill-hub-routing.md:89]`. Putting `RS-002`, `RS-004` and `RS-005` into the rule is precisely the mechanics-in-the-rule duplication the carve-out was written to prevent.
- **Nothing is stale.** All three codes still exist in the checker (23 occurrences of `RS-002|RS-004|RS-005` in `.skilled/commands/doctor/scripts/parent-skill-check.cjs`), so the rule is not pointing at a retired name.

The real gap the finding identified is elsewhere and should be recorded as such: `parent-skills-nested-packets.md` §7's 11-row surface table has no row for routing-shape plumbing, so a mode-wiring change can be blocked by a code enumerated in no row. That reference is `sk-doc`-owned and sits outside this packet's three target surfaces (`AGENTS.md`, `REPO RULES.md`, `.skilled/repo-rules/`). Verdict: **downgrade `f-iter002-001` from a proposed rule edit to no edit**, and carry the reference gap as a separate out-of-surface observation for synthesis.

### f-iter004-004 (P3) — No `REPO RULES.md` trigger-table row should route to a v4.0.1.0 doctor command; all four already fire existing rows

The table's `Load` column names rule files only, and the document states the reason: "**It is a router, not a rulebook:** it holds no rules of its own" `[SOURCE: REPO RULES.md:5-6]`, routing "you to every rule file that governs what you are about to do". A command name has no place in a column whose job is to name a rule file, and `:18` already settles the null case — "Nothing fires → `AGENTS.md` alone governs."

All four new commands already fire existing rows on their action vocabulary, so nothing is unreachable:

| Command | Row it fires | Why |
|---|---|---|
| `/doctor:install`, `/doctor:symlink` | `[SOURCE: REPO RULES.md:44]` | the row's action list leads with "install" and includes "any call that leaves this machine"; `symlink` links a project, which the rollback sentence covers |
| `/doctor:agents-md check`, `/doctor:sk-skill check` | `[SOURCE: REPO RULES.md:45]` | "Diagnose a failure · make a red check green" |
| quoting a check's byte figure (`16368 of 16384`) | `[SOURCE: REPO RULES.md:42]` | "quote a number · report a file path or command output" |

What the table genuinely lacks is not a row but a premise: `AGENTS.md`'s shipped sections are now composed, and a hand edit to one is reverted by the next `embed` unless the manifest's `sections` array is edited too — iteration 3 established this as `f-iter003-005`. The command's own router names the manifest as the "Shipped template manifest" `[SOURCE: .skilled/commands/doctor/agents-md.md:28]` and documents the plan-then-digest write path at `[SOURCE: .skilled/commands/doctor/agents-md.md:38]`, so the owner exists. Recorded as an observation for synthesis, not a rule edit: this iteration found no rule file that claims otherwise, so there is nothing stale to repair.

## Ruled Out

- **A `delivery prefix` line in the repository block silences A6.** False. `own` is canary stdout screened for `MISSING:` / `BLOCKED:` `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:461-463]`; document prose cannot enter it.
- **The canary is silent past the prefix, so A6's fallback is the only signal.** False. The canary emits its own failure containing `delivery prefix` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:428]`, printed as `MISSING:` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:440]`.
- **No `ROUTER.md`-naming wording fits the budget.** False at the short end: the 89-byte form lands at 16,371, 13 bytes inside.
- **`skill-hub-routing.md:78` should name `RS-002` / `RS-004` / `RS-005`.** Rejected: mechanics in the rule, against `REPO RULES.md:98-101`.
- **A trigger-table row should route to `/doctor:agents-md` or `/doctor:install`.** Rejected: `REPO RULES.md:5-6` and `:18` make the table a rule-file router; the commands already fire rows 42, 44 and 45.

## Dead Ends

- **Treating iteration 3's A6 read as sufficient because it quoted the right file and line.** The citation was correct and the inference from it was inverted — the code was read as parsing the document when it parses a subprocess's stdout. For any row that shells out, the variable's provenance (`output` at `:450`) has to be established before its predicate is interpreted. Recorded because this is the second time in this packet that a correct citation carried a wrong inference.
- **Measuring only the variants already on the table.** Iteration 3 tested the two wordings it had and concluded about "any version". A budget question has to be answered by measuring the cheapest candidate, not the two most discussed.

## Edge Cases

- Ambiguous input: "the `own` array" — resolved as the checker's local `const own` at `:461`, not the parsed sections; the resolution is what makes target 1 decidable.
- Contradictory evidence: **open and recorded, not collapsed.** `f-iter003-001` states the block silences A6; `agents-md-check.cjs:461-463` plus `:450` show it cannot. The source prevails because it is the executing code, and `f-iter003-001` is superseded rather than amended — the mechanism was the finding.
- Missing dependencies: none. The canary resolved through `defaultTools` `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:864-872]` from the manifest pin whose `consumer` ends in `check-rule-copies.js`.
- Partial success: none for targets 1-3. Target 4's premise question (whether any rule file claims a hand edit to a shipped section is safe) was answered by the absence of such a claim across the 13 files, which is a weaker form of evidence than a positive citation and is stated as such.

## Sources Consulted

- `.skilled/commands/doctor/scripts/agents-md-check.cjs:411-412,441-444,450,461-464,477-481,490,864-872`
- `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:140,425-433,436-448`
- `.skilled/commands/doctor/assets/agents-md-manifest.json` (`root_file`, `budget`, 21 `delivery-anchor` pins, `last_anchor_id`)
- `AGENTS.md:65-72,97-98,298-302`
- `REPO RULES.md:3-6,12-18,20-32,38-52,96-101`
- `.skilled/repo-rules/skill-hub-routing.md:71,78,88-89`
- `.skilled/commands/doctor/agents-md.md:28,34-38`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` (23 occurrences of `RS-002|RS-004|RS-005`)
- `.skilled/skills/**` scan, 57 `SKILL.md` roots, 3 without sibling `ROUTER.md` (all under `node_modules/playwright-core`)
- `specs/agents-md/017-v4-0-1-0-rules-refresh/research/iterations/iteration-002.md`, `iteration-003.md`

## Assessment

- New information ratio: 0.70
- Questions addressed: the four dispatch targets; no strategy key question remained open, so `answeredQuestions` is empty
- Questions answered: none at the key-question level — this iteration corrects already-answered ones
- Calculation: 5 findings — 2 fully new (`f-iter004-001`, `f-iter004-002`, both corrections that replace a prior claim's mechanism or conclusion) and 3 partially new (`f-iter004-003`, `-004`, each resolving an open proposal with a negative or a boundary) → (2 + 3×0.5) / 5 = 0.70. No simplicity bonus: the cleaner model was bought with new reads, not derived from prior packet evidence.

## Reflection

- What worked and why: following one variable to its producer. The whole of `f-iter004-001` came from asking "where does `output` come from" before accepting what `own` was asserted to mean — one line, `:450`, inverted the reading of the guard at `:480`. The second thing that worked was measuring the cheap candidate. Iteration 3 asked whether a *long* wording fits and concluded about all wordings; measuring the 89-byte form took one arithmetic pass and reversed the conclusion, which also dissolved the compensating-trim follow-up it had created.
- What did not work and why: nothing failed outright this iteration. The method failure being corrected is prior: iteration 3 read a correct line and inferred the wrong data flow, because it read the predicate without reading the variable's origin. A citation that resolves is not the same as a citation that is understood — `validate.sh` will happily confirm `:480` exists while the claim about it is backwards.
- What I would do differently: for any check whose logic shells out to another tool, read the subprocess invocation and the string it returns before interpreting any predicate over that string. And for any budget question, measure the smallest candidate first — it is the one that decides whether the question is open at all.

## Questions Answered

None at the key-question level. All five strategy questions are already ticked; this iteration changes what two of the recorded answers may say.

## Questions Remaining

- None at the key-question level. Three items carry forward as refinements: (a) 13 bytes of headroom at `AGENTS.md:70` is thin enough that the next edit above the last anchor must re-measure, though no trim is owed now; (b) `research/research.md` synthesis remains unowned while the dispatch allowlist excludes it; (c) the `parent-skills-nested-packets.md` §7 table has no routing-shape row, which is `sk-doc`-owned and outside this packet's surface.

## Next Focus

Synthesis. Two of iteration 3's claims are superseded and the packet's headline recommendation changes from "the edit needs a compensating trim" to "the edit fits as an 89-byte substitution" — that substitution, the surviving delivery-prefix statement from `f-iter003-001`, and the downgrade of `f-iter002-001` are what iteration 5 should assemble. No new external evidence is needed.

## Gateway Record and Scope Notes

The canonical iteration record is recorded through `append-mode-event.cjs --mode research --run-directory specs/agents-md/017-v4-0-1-0-rules-refresh/research`, from a single-record temp file outside the repository.

Scope note, unchanged: `progressiveSynthesis` is `true`, but `research/research.md` is not in this dispatch's ALLOWED WRITE PATHS, so the narrower allowlist governs and synthesis stays unowned.

No write outside `specs/agents-md/017-v4-0-1-0-rules-refresh/research/` was issued. Every researched file was read only; the doctor check was not re-run in a writing mode.
