---
title: "Iteration 003 — RQ3: Governor Container-vs-Content Verdict"
trigger_phrases: []
---
# Iteration 003 — RQ3: Governor Container-vs-Content Verdict

## Focus

RQ3: separate the container (per-turn injection on every advisor brief) from the
content (the disposition carried) in commit `4477a9f1`'s retirement; test the
content against iteration 2's always-loaded-versus-triggered criterion; verdict:
rule file, a section in an existing file, or nothing. The retirement itself is
not relitigated.

## Actions Taken

1. `git show 4477a9f1` (stat + full diff of `policy-plan.ts`, `render.ts`,
   `injection-contract.md`) — recovered both retired directive texts verbatim,
   their source comments, and the commit message's own rationale.
2. Read `specs/hooks/007-fable-governor-pi-hook/spec.md` — the governor's origin
   spec; points to `.opencode/skills/system-spec-kit/constitutional/fable-governor.md`
   as the "Governor doctrine" home.
3. Verified the constitutional doctrine file no longer exists (`ls` exit 1) — the
   content has no doctrine-file home left.
4. Grepped the repo for `DECISION:|qualify only|reversible` — proved the
   `// DECISION:` marker and the qualify-only test appear nowhere in `AGENTS.md`
   or the seven rule files.
5. Read `AGENTS.md` L135–164 (Two registers verbatim), `blast-radius.md` (full),
   `uncertainty-and-honesty.md` (full) — mapped each governor clause to a carried
   row or a candidate host.
6. Read the run's own packet spec (`003-disposition-and-gap-research/spec.md`
   L63): the content "was never disputed and now has no home. A per-turn
   injection was the wrong container; a triggered rule file might be the right
   one."

## Findings

### F1 — The recovered content, verbatim

Governor (from `render.ts` diff, `GOVERNOR_DIRECTIVE`):

> reason about the problem and the person, not yourself; lead with the result and
> act rather than narrate (batch tool calls, report at checkpoints); treat
> reversible decisions as cheap — decide, mark `// DECISION:`, move on; qualify
> only when it changes what the reader should do.

Proof-over-appearance (same commit, `TERMINAL_PROOF_DIRECTIVE`):

> only real command output counts. Encode every requirement as an objective
> pass-or-fail check (exit code, grep, diff), watch it fail before fixing, fix
> the root cause once, and close with a clean re-run and a no-stray-files sweep.

Source comment (the case for and against, verbatim): "the thermostat that
re-states the disposition as context grows."

### F2 — Container vs content separation

**Container** = the fixed directives appended to every advisor brief on every
user turn, every runtime, regardless of recommendation — including briefs with no
route line. Retired by `4477a9f1`; the commit's own doctrine: "A rule with an
enforcer earns its place every turn; a disposition does not." Not relitigated:
nothing in this iteration proposes any per-turn restoration.

**Content** = the disposition itself: 5 governor clauses + the proof
restatement.

### F3 — Clause-by-clause test against the always-loaded-vs-triggered criterion

Criterion (iteration 2 F1): per-turn force is the must-stay property; rows that
bind only when a situation arises move down to trigger-loaded rule files.

| Governor clause | Home today (verified) | Verdict |
|---|---|---|
| reason about the problem (and the person), not yourself | `AGENTS.md` L142: "Reason about the problem, not yourself" | carried — **nothing** |
| lead with the result and act rather than narrate (batch tool calls) | `AGENTS.md` L141: "act, don't narrate; open with the result, not 'I'll'/'Let me'; batch tool calls" | carried — **nothing** ("report at checkpoints" sub-clause is contained in the narration discipline) |
| treat reversible decisions as cheap — decide, mark `// DECISION:`, move on | none (grep-proven); `blast-radius.md` §2 "Trivially reversible → Proceed" is the adjacent tier, not the velocity doctrine | **section in `blast-radius.md`** (extend §2; the marker is a mechanism, optional) |
| qualify only when it changes what the reader should do | none verbatim; `uncertainty-and-honesty.md` §5 applies the same reader-impact test to corrections | **section in `uncertainty-and-honesty.md`** (reader-impact test as selector over §2's inline-flag mechanism) |
| proof-over-appearance (retired same commit) | `AGENTS.md` §4 Final-State Verification L236–241 + Completion Verification Rule L245–255 (must-stay, iteration 2 F2) | carried — **nothing** |

### F4 — Verdict: sections in two existing files; no new rule file

No new rule file: two trigger-shaped clauses (≈2–4 lines) do not meet the bar for
the set's anatomy (Fires-when trigger + SELF-CHECK, iteration 1 O4), and per-turn
force — the only property that would have justified a "governor" container — is
exactly what the retirement removed. The disposition is situation-bound: it fires
at reversible decision forks and at qualification-writing moments, which is the
trigger shape rule files exist for. Under the criterion, the content earns
**sections in two existing files** (the two homeless clauses) and **nothing** for
the three already-carried clauses.

### F5 — Corrections to the run's own framing

The packet spec (L63) says the disposition "now has no home". Partially wrong:
3 of 5 clauses have an always-loaded home in `AGENTS.md` L140–142; only the
decision-velocity clause and the qualify-only test are homeless. Also verified:
the constitutional doctrine file (`fable-governor.md`, the 007 spec's "Governor
doctrine" pointer) no longer exists — so the two homeless clauses genuinely have
nowhere to live, which is the case for the section-additions.

### F6 (DERIVED) — RQ2 interaction

Clauses 1–2 get doctrine depth automatically if RQ2's Two-registers move-down
executes (host: `uncertainty-and-honesty.md`, iteration 2 F3 row 2). Clauses 3–4
need explicit section-additions regardless of RQ2's outcome. RQ3's verdict is not
hostage to RQ2 — it independently names the same two host files RQ2 already
nominated (`blast-radius.md`, `uncertainty-and-honesty.md`).

### Observations

- **O1 (real):** The retirement rationale and the always-loaded-vs-triggered
  criterion are the same asymmetry. The criterion says per-turn force belongs
  only to rows that bind every turn; the commit message says a disposition
  re-asserted per turn spends context on what was never in dispute. The governor
  content never had must-stay force — it was per-turn *re-asserted*, which is
  different — and both analyses converge on trigger-loaded as its proper
  container.
- **O2 (real):** The `// DECISION:` marker is a code-comment convention and sits
  adjacent to the Comment Hygiene HARD BLOCK's territory. No conflict — hygiene
  forbids ephemeral IDs, the marker is durable decision provenance — but it is
  the only mechanism-like element in an otherwise dispositional content; keep it
  optional.

## Questions Answered

- **RQ3 (fully):** container = per-turn injection, correctly retired, not
  relitigated. Content = disposition of 5 governor clauses + proof restatement.
  3 clauses carried by `AGENTS.md` L140–142 (**nothing**); 1 clause → section in
  `blast-radius.md` §2; 1 clause → section in `uncertainty-and-honesty.md`;
  proof → **nothing** (carried by §4 must-stay rows). **No new rule file
  warranted.**

## Questions Remaining

- RQ4: host assignment for the 8 gaps (section-additions to 3–4 existing files
  vs new files); gate-discipline host question for Violation Recovery;
  dual-locus rung ladder (iteration 1 O1) as subtraction candidate; and whether
  the two governor section-additions ride with RQ2's Two-registers move or land
  independently.
- RQ5: critique of `delegation-and-orchestration.md` — thin anchor note (O4).

## Next Focus

RQ4 — warranted vs not-warranted further rules plus the subtraction candidate;
host assignment for the 8 gaps; fold in the two governor section-additions from
this iteration.

## SCOPE VIOLATIONS

None. All writes landed in the bound artifact directory; all researched paths
read-only.
