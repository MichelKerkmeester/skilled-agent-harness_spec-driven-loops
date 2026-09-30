# Iteration 5 — mimo-05: Measurement-first build order, operator labor and the cost of a day

**Lineage:** `mimo` (UX and measurement lens)
**Session:** `fanout-mimo-1790457982528-yjdrdz`
**Focus Area:** `mimo-05` — Measurement-first build order, operator labor and the cost of a day
**Angle question:** Which slice yields a usable number soonest, what does the operator read, what does each phase cost in operator minutes and in calls, which measurements gate which, and which printed number stops each phase?

## Sibling check

W3 contract: all four of my own iterations plus the newest sibling file of each lineage, read first.
- Own: `iterations/iteration-001.md` to `iteration-004.md` (this lineage).
- `../grok/iterations/iteration-005.md` (grok's newest, iteration 5).
- `../deepseek/iterations/iteration-005.md` (deepseek's newest, iteration 5).
- `../swe/iterations/iteration-003.md` (swe's newest so far, iteration 3).

Agreements and disagreements, each grounded in my own counts or arithmetic:
- **Agree with grok-05 (F1):** if one phase ships, it is 002's zero-call census. Grounded in mimo-01: the census is the only slice whose numbers (movable rows, power line, baseline reproduction) are computable today from committed data, and it needs zero operator labels.
- **Agree with deepseek-05:** dependency order puts the key gate and the redaction unit cases before any egress. My addition: the D5 rubric adoption (N-mimo-02-1) sits before 006's labels, which neither sibling's order carries.
- **Contest swe-03's labor frame:** its fixture schema assumes operator adjudication of disagreements (swe-03 Q4). mimo-03's labor model prices that at 6–30 minutes and — the number neither sibling carries — **003's slice fails outright if the operator gives none**, because pre-labels only pre-fill; the disagreement rows decide the error rates.

## Grounding opened this iteration

- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md` §9 (`:443-470`, cost, latency, privacy table, D5 gate) and §13 (`:1181-1260`, the five proposed phases and the build order).
- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/context/measurement-digest.md` §3 (the eight gap rows) and §4 (use case to harness map).
- Own iterations 1–4 (counts and arithmetic reused as cited).
- No repository module run, no `jev` call of either package, no network, no `.env` opened.

## 1. The soonest usable number, and what the operator reads when it lands

**002's census.** One script, one run, zero calls, zero labels. Four numbers settle the program's next month: movable rows (bound today 0–55, mimo-01), the baseline reproduction at 53/70, the comparator metrics, and the power line. The operator reads, in print order (mimo-01's layout):

1. `census: <file> rows= eligible= movable= gold-first= top3= tau-slice=` — the headroom.
2. `power: movable=<m> need-wins=<x>/<n> q80=<q*>` — whether any arm can earn a keep (mimo-01: at n=10 the arm needs a 0.92 win rate; at n=55, 0.68).
3. `baseline: holdout-top1=53/70 ok` or `baseline mismatch: comparison void`.
4. `comparators: …` then the boundary line `no headroom` / `underpowered` / (with key) one verdict line.

**The single line that decides the program's shape is line 2**, not the verdict: if q80 sits above any win rate worth demonstrating, the arm's `keep` is structurally unreachable and only R21's calibration is worth the calls. Build the census to print that line (N-mimo-01-1's flip-rate clause and the power line must be in 002's spec before the run, not after).

## 2. Operator labor per phase (minutes)

| Phase | Labels | Spot checks | Adjudication | Total | If the operator gives none |
|---|---|---|---|---|---|
| 002 (R1 census + arm, R21) | 0 (corpus gold is committed) | 5–10 (read the report) | 0 | **5–10 min** | **Survives.** It is the only phase that returns numbers with zero labor |
| 003 (R2 zero-call slice) | 0 (native `goal_status` pre-labels exist, 757 records counted) | 10 (10 agreement spot checks per BASE 003 REQ-001) | 6–30 (disagreement rows at 30–50 rows × 10–30% × 2 min, mimo-03) | **16–40 min** | **Fails.** Pre-labels pre-fill; without adjudication there are no error rates and the slice returns a table nobody can quote |
| 005 (R19 census) | 0 | 15–30 (open question 27: 3-session rule-derived recall spot check) | 0 | **17–32 min** | Degrades: the census prints but its recall column stays unvalidated |
| 006 (R20 lint) | 50–60 (~100 labels at ~30 s) | 5 (relabel 5 rows) | 0 | **55–65 min**, plus 10 min rubric choice (N-mimo-02-1) | **Fails outright.** The labels are the slice; without them D5 stays open and there is no base rate |
| Synthesis (REQ-005) | 0 | 20 (5 citations + 3 recommendations reopened) | 0 | **20 min** | Fails the citation gate |

**The cost of a day: about 2 to 2.5 hours of operator time for the whole program**, two thirds of it 006's labels. The phase that dies first under operator scarcity is **006**, then 003's slice. 002 is the scarcity-proof phase, which is a second, independent argument for it shipping first.

## 3. Cost of each Jev arm, and the announcement line before its first billed call

All prices are **vendor claims** (claude-jev `README.md:30-31`: $0.042 per million input tokens; supercov `quality.md:182-189`: about a cent per MB of source), never reproduced here; every dollar figure below is inferred arithmetic on a vendor claim. Latency is UNKNOWN for every arm until 002's `calls.jsonl` (measurement-digest gap row 1).

| Arm | Calls | Payload class (BASE §9 privacy table) | Dollars (vendor-claimed price) | Announcement line before the first billed call |
|---|---|---|---|---|
| R1 arm + R21 | ceiling 723 + 585, +1 `jev auth test` | Corpus prompts and skill descriptions (low) | ~$0.05–0.13 | `payload: corpus prompts + skill descriptions; planned calls=<n>` |
| R20 Jev arm (later) | ~600 | Committed goal criteria (low) | ~$0.02–0.05 | `payload: committed goal criteria; planned calls=600` |
| R2 shadow (later) | 1 per verification | Live goal evidence (**highest**, standing egress) | cents per run | `payload: live goal evidence; one call per verification` — printed once per session, with the gate cached (BASE §9 D5) |
| R19 arm (later) | UNKNOWN until the census sizes the sessions | Whole-session prose (**highest**) | UNKNOWN | `payload: whole-session prose; planned calls=<n>` — printed with the redaction unit-case status on the same line |

Each line prints before the first billed call and once per session (BASE R1's proof plan step 3; mimo-01's layout line 5). The gate itself costs a shell builtin plus two Python spawns, latency UNKNOWN (BASE §9), paid once per run offline, once per session live.

## 4. What must be measured before what

1. **002's per-call latency record before any live form** of anything (BASE §13, unchanged). R2's shadow mode and any served order wait on it.
2. **Both redaction unit cases (`opencode-goal.js:474`, `secret-scrubber.ts:128`) before any egress** — BASE question 17; nothing sends text until they pass.
3. **The D5 rubric adoption before 006's labels** (N-mimo-02-1): the labels score rules 4/5, and the rules mean nothing until the rubric is written. My 45.5%–79.5% spread is the evidence that this ordering is not optional.
4. **The power line and the flip-rate clause before the arm's interpretation** (mimo-01): pre-registration is only honest while the rule text is still unfrozen. swe-01's `verdict` function (swe-001:64) currently encodes the unfixed clause; amend before 002's spec freezes.
5. **005's fit estimate before the R19 arm**: every round-1 compaction started at 450,019 tokens or more (BASE D1); if the placeholder-state estimate clears 25,000 tokens on most compactions, the arm never runs.
6. **R1's census before R3** (served order): and the live ambiguity rate is recorded nowhere (mimo-01: `shadow-deltas.jsonl` absent), so R3's value estimate starts from zero events.
7. **003's recorded-use tripwire before anyone waits on R2's Jev arm** (N-mimo-03-1): the precondition is 0 of 5 records today.

## 5. Kill criteria from the measurement view: the printed number that stops each phase

| Phase | Printed number or line | Effect |
|---|---|---|
| 002 | `baseline mismatch: comparison void` | The comparison is void; the arm does not run; no later arm waits on its latency (grok-05 agrees) |
| 002 | `no headroom` (movable = 0) or `underpowered` with `q80` above any demonstrable win rate | The arm does not run; R21's calibration carries 002's Jev number instead |
| 002 | `verdict: kill` (sign test favors the scorer at 0.05) | Closes R3 and every served form (BASE R1 kill criterion) |
| 003 | `r2 jev arm not built: no recorded OpenCode or Pi verifier use (0 of N records)` | **Already true today** (mimo-03); the arm stays unbuilt until the tripwire flips |
| 003 | Clamp-error count ≈ heuristic error count after the free clamp fix | If the free fix cures the errors, the Jev arm dies with a number |
| 005 | `placeholder estimate ≥ 25000 tokens on N of M compactions` | The deletion arm never runs (fit question, BASE open question 24) |
| 006 | Labeled violation rate under 5% **with the interval's floor under 5%**, rubric-qualified (N-mimo-02-1) | The lint stops. BASE's bare 5% rule is rubric-blind and cannot fire under any semantic rubric (mimo-02) |
| 006 Jev arm | F1 gain under 0.2 over the lexical lint | The arm stops at the lexical lint (BASE R20 keep rule) |

## Per-idea records

### Idea 1: `N-mimo-05-1` — the measurement-first order, with the operator's day priced (decision record)

| Field | Record |
|---|---|
| **Idea** | Build order for the survivors as measurements first: 002 census (zero labor, zero calls) → 002 arm under pre-registered rules → 005 census + 003 slice in parallel (operator-dependent) → 006 lint after the rubric → no live form until latency and redaction gates clear. |
| **Builds on** | BASE §13 build order; grok-05 F1/F5; deepseek-05's dependency order; this lineage's iterations 1–4. |
| **Value** | The operator can give 10 minutes and get the program's go/no-go number (the census and its power line); every hour after that buys a specific, named decision (003's error rates, 006's base rate) instead of general progress. |
| **Seam** | No code seam; this is the schedule 004's synthesis hands to the phase reconciliation. |
| **Metric, baseline, harness** | Minutes-to-first-number: today the answer is 5–10 min for 002's census (estimate from the labor table). Baseline: no program has been priced this way before (new). |
| **Cost, latency, privacy** | The day: 2–2.5 h operator time, ~1,300–1,900 billed calls worst case across all arms at vendor-claimed cents. |
| **Key gate and no-key behavior (D5)** | Every step runs its three checks before its first billed call; the census and the lint need no key at all. |
| **Rough LOC** | None; scheduling text. |
| **Verdict** | **build-now (as the order the synthesis recommends).** It matches BASE's order with three insertions: the rubric before 006's labels, the power line before 002's arm, the tripwire before R2's wait. |
| **Confidence** | Confirmed: the labor arithmetic rests on counts from mimo-01 to mimo-04. Inferred: label speed (~30 s per label) — what would confirm: timing the first ten labels. |

### Idea 2: `N-mimo-05-2` — one kill-line string table for all four phases (contract text, no Jev call)

| Field | Record |
|---|---|
| **Idea** | The eight kill lines in section 5 become pre-registered strings in each phase's spec, in one shared wording family with R1's `jev arm skipped: <check>` (BASE §9 D5's one skip-line form). |
| **Builds on** | grok-05 F2's printed kills and BASE §9's skip-line unification. |
| **Value** | A kill line quoted from a report is the only evidence that closes a phase; if the strings are fixed before the build, no argument can re-litigate what the number meant. |
| **Seam** | Spec text in 002, 003, 005, 006; the strings print from each script's report. |
| **Metric, baseline, harness** | Each line's firing event; baseline: `r2 jev arm not built: …` already fires today (mimo-03). |
| **Cost, latency, privacy** | Text only. |
| **Key gate and no-key behavior (D5)** | The skip line is one member of the family; no-key runs print the same lines. |
| **Rough LOC** | ~2 LOC per script for the string. |
| **Verdict** | **build-now (as spec text).** Cheapest item on this list and the one that keeps the rest honest. |
| **Confidence** | Confirmed: BASE already unified the skip lines (`:466-470` read this iteration); the kill family is the same move. |

## Ruled out this iteration

- Pricing the arms in dollars as a decision input: money is cents at vendor-claimed prices (BASE §9), so the binding costs are operator minutes and privacy, which is where this iteration priced instead.
- Any change to BASE's phase list or the reconciliation: that write is the final synthesis's, outside this lineage.
- Rerunning any count from iterations 1–4: reused as cited.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence, or restated | Evidence |
|---|---|---|
| The program costs about 2–2.5 h of operator time; 006's labels are two thirds of it | new | labor table; mimo-02/mimo-03 counts |
| 002 is the only phase that survives zero operator labor; 003's slice and 006 fail outright without it | new | same table |
| The census's power line (mimo-01) is the soonest usable decision number, ahead of the verdict line | new | mimo-01's power table |
| Three insertions into BASE §13's order: rubric before 006 labels, power line + flip clause before 002's arm interpretation, recorded-use tripwire before R2's wait | new | mimo-01 to mimo-03 |
| One kill-line string family across 002/003/005/006; `r2 jev arm not built: no recorded OpenCode or Pi verifier use (0 of N)` fires today | new | mimo-03 counts; BASE `:466-470` |
| R20's bare 5% stop rule cannot fire under any semantic rubric; the kill line must be rubric-qualified | contests BASE R20 | mimo-02's intervals |
| Announcement lines per arm, one per session, payload class on the line | confirms BASE R1's proof plan with new evidence (exact strings proposed) | section 3 above |
| Dollars are cents at vendor-claimed prices and are not the binding cost | confirms BASE §9 | BASE §9 reopened |

## Hand-off

- The final synthesis: take the order in N-mimo-05-1 and the kill strings in N-mimo-05-2 as this lineage's RQ7 answer; the labor table prices the operator side of every phase.
- The phase reconciliation (parent write): insert the three ordering clauses into 002, 003 and 006's specs as amendments, and the power line + flip clause into 002 REQ-007/REQ-008.
- 002's spec owner: `power: movable= need-wins= q80=` and the aggregate flip clause (N-mimo-01-1) before the run.
- 006's spec owner: rubric-qualified stop rule wording from mimo-02.
