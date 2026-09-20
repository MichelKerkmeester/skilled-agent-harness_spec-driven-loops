---
title: "Iteration 004 — RQ4: Warranted vs Refused Inventory + Subtraction Candidate"
trigger_phrases: []
---
# Iteration 004 — RQ4: Warranted vs Refused Inventory + Subtraction Candidate

## Focus

RQ4: decide which further repo rules are warranted and which plausible-sounding ones
are NOT. Restraint applies to the rule set itself: a seven-file set that becomes
twelve because twelve sounds thorough has failed its own `overengineering.md`. Assign
hosts for the 8 true gaps (iteration 1 F3) and the two governor section-additions
(iteration 3 F3/F4). Name at least one subtraction candidate (the dual-locus rung
ladder, iteration 1 O1) or state plainly that none was found.

## Actions Taken

1. Read `overengineering.md` in full — verified §1 "THE RESTRAINT LADDER" (7 rungs,
   0–6, ordered by cost-when-wrong, with the climbing-sentence rule), §3 signals, §4
   specific restraints (dependencies cluster), §5, SELF-CHECK.
2. Read `AGENTS.md` L158–169 verbatim — L164 names the authoritative ladder locus:
   "Authoritative rungs: `sk-code/shared/references/universal/code-quality-standards.md` §1."
3. Read `code-quality-standards.md` §1 "Design Restraint Ladder (pre-write)" (L42–53)
   — 6 rungs (1–6), ordered by solution type (YAGNI → stdlib → native platform →
   already-installed dependency → one line → minimum code), surface-aware, post-read
   reflex. First-hand proof the two loci carry different taxonomies.
4. Re-derived the host assignment from carried-forward state: iteration 2 F3 (8 gaps,
   hosts, O2 shared-host pairs) + iteration 3 F3/F6 (governor clause hosts) + this
   iteration's ladder verification.
5. Built the warranted list (host + section target + failure prevented), the refused
   list (candidate + refusal reason + the refusal test), and the subtraction verdict.

No writes outside the bound artifact directory; research targets untouched.

## Findings

### F1 — The refusal test: a new file earns existence only on four conditions

A new rule file is warranted only when (a) it holds a **trigger-shaped doctrine
cluster** (fires when a situation arises, per the set's "Fires when" anatomy), (b) the
doctrine has **no existing home**, (c) it is **not design-excluded** by `REPO RULES.md`
§4's scope line, and (d) it has an **AGENTS.md anchor row** or justified net-new
posture (the set expands AGENTS.md; anchorless doctrine is the reverse direction).
Every refused candidate below fails at least one condition; none of the 10 warranted
additions meets the file bar — all are sections.

### F2 — Warranted additions: 10 items, all section-additions, 0 new files

| # | Gap / governor clause | Source | Host | Section target | Failure it prevents |
|---|---|---|---|---|---|
| 1 | Two registers | AGENTS.md L140–142 | `uncertainty-and-honesty.md` | new registers section | mid-task narration bloat; dense-at-boundary discipline absent from the set |
| 2 | Governor qualify-only clause | retired directive (iter 3 F3) | `uncertainty-and-honesty.md` | folds into #1 (reader-impact test as the selector over §2's inline-flag mechanism) | qualification noise that changes nothing the reader should do |
| 3 | Plan before acting | L161 | `scope-discipline.md` | new approach-discipline section (with #4) | multi-step work started with no plan — tool-call churn, rework |
| 4 | Research-first approach | L163 | `scope-discipline.md` | same section as #3 | edits made before reading the actual code/docs |
| 5 | Frequent self-checks | L179 | none needed | already instantiated by the per-file SELF-CHECK anatomy (iter 1 F4); AGENTS.md row gains a pointer | gap closes free — no new doctrine exists to add |
| 6 | Reason from actual data | L180 | `evidence-and-proof.md` | extend §2 (observed command evidence) | claims reasoned from assumption instead of observation |
| 7 | Verify with checks | L190 | `evidence-and-proof.md` | extend §3/§9 (green-run lies; final-state proof) | completion claims without running the checks |
| 8 | Fallbacks only for real constraints | L188 | `overengineering.md` | extend §4 (dependencies/tools cluster) | fallback paths and tooling added for imagined constraints |
| 9 | Governor decision-velocity clause | retired directive (iter 3 F3) | `blast-radius.md` | extend §2 (reversibility ladder) | reversible decisions stalled; decision forks unmade |
| 10 | Violation Recovery | L124–126 | `AGENTS.md` (keep) | no host — new file refused (F4 #1) | — |

**Files touched: 5 of 7** — `uncertainty-and-honesty.md` (2 additions), `scope-discipline.md`
(1 section, 2 gaps), `evidence-and-proof.md` (2 extensions), `overengineering.md` (1),
`blast-radius.md` (1). `root-cause.md` and `delegation-and-orchestration.md` untouched.
**Set stays seven files.** The 8 gaps collapse into 4 sections + 1 free close + 1
refusal; the two governor clauses ride in the two sections iteration 3 already named.

### F3 — Refused list: plausible-sounding rules that are NOT warranted

| Candidate | Refusal reason (condition failed) |
|---|---|
| Gate-discipline rule file (Violation Recovery host) | Its trigger — "about to skip gates / realized gates were skipped" — fires exactly when the trigger-loaded load path may already be broken (iter 2 F3b); its force is adjacency to the gates, which exists only in AGENTS.md §2; a level-3 file cannot bind level-1/2 gates, so it could only restate (d) |
| Git/commit/PR rule file | Design-excluded — dispatch mechanics belong to `sk-git` (REPO RULES.md §4 line); L315 push policy already expanded by `blast-radius.md` §3 (c) |
| Communication / response-format file | One row (Two registers) does not make a cluster; the correct container is the section in `uncertainty-and-honesty.md` — the exact "twelve because twelve sounds thorough" trap (a) |
| Testing / verification file | Would split the proof doctrine across two files; `evidence-and-proof.md` already owns it, and verify-with-checks + reason-from-data are extensions there — violates one-place-to-change (b) |
| Security rule file | No AGENTS.md anchor row; enforceable surface already covered by `blast-radius.md` §5 (auth/data/config) + §1 Four Laws; anchorless net-new doctrine (d) |
| Memory / context-management file | Design-excluded — plumbing; Gate 1 + Memory Save Rule are spec-kit mechanics (c) |
| Spec-folder / documentation file | Design-excluded — spec-folder mechanics (c) |
| Skill-routing file | Design-excluded — skill routing (c) |
| Delegation-mechanics file (which agent/command/model/flags) | Design-excluded — REPO RULES.md §4 draws the line explicitly: "how to dispatch is theirs, how to think while dispatching is ours" (c) |
| Meeting / collaboration file | No anchor row, no trigger-shaped doctrine in this repo's operating surface (a, d) |

The refused list (10 candidates) is as long as the warranted list — that is the
correct shape for a restraint-governed set.

### F4 — Subtraction candidate: `overengineering.md` §1 ladder table (verified dual locus)

Named candidate from iteration 1 O1, now verified first-hand this iteration:

- **`AGENTS.md` L164 (verbatim):** "Authoritative rungs: `sk-code/shared/references/universal/code-quality-standards.md` §1."
- **Locus A — `overengineering.md` §1:** "THE RESTRAINT LADDER", 7 rungs ordered by
  **cost-when-wrong** (0 build nothing → 1 value change → 2 extend in place → 3 new
  function → 4 new file → 5 abstraction → 6 dependency), with the climbing-sentence
  rule ("the naming is the whole rule").
- **Locus B — `code-quality-standards.md` §1:** "Design Restraint Ladder (pre-write)",
  6 rungs ordered by **solution type** (1 YAGNI → 2 stdlib → 3 native platform →
  4 installed dependency → 5 one line → 6 minimum code), surface-aware, post-read.

Same name, different taxonomy — worse than duplication: an agent reading
`overengineering.md` §1 reasonably treats it as the ladder AGENTS.md L164 declares
authoritative, but the rungs disagree (rung 2 = "extend in place" vs rung 2 =
"standard library"). Authority is already settled by L164 (locus B). **Subtraction:
drop the ladder table from `overengineering.md` §1, keep the climbing-sentence
doctrine** (the durable WHY — "climb one rung only by writing the sentence that says
what fails below") **and a one-line pointer to the authoritative locus.** The file's
SELF-CHECK survives — it tests the climbing sentence, not the table.

**Declined subtraction candidates:** whole-file subtraction of any of the 7 (each owns
a trigger-table row; `delegation-and-orchestration.md` is the weakest anchor but
cannot be removed without touching an always-loaded row, iter 2 O4 — its critique is
RQ5's); `overengineering.md` §3's two extra signals (net-new, declared absent from
AGENTS.md — warranted); the SELF-CHECK anatomy (set anatomy, not doctrine).

### F5 (DERIVED) — The set passes its own overengineering test

The question's own bar: "a seven-file set that becomes twelve because twelve sounds
thorough has failed its own `overengineering.md`." Verdict: **7 → 7**. Ten warranted
additions, all sections; ten refusals; one subtraction (a section inside
`overengineering.md`, not a file). The gaps are absorbed as sections in the files the
"Fires when" triggers already route to — the smallest change that closes them, and
the same expand-or-point pattern iteration 2 F4a found the set's authors already
executing.

### Observations

- **O1 (real):** The two ladder loci differ in taxonomy (cost-when-wrong vs
  solution-type), so the dual locus is a contradiction risk, not mere duplication —
  the subtraction verdict (F4) rests on this first-hand read.
- **O2 (real):** 5 of 7 files gain sections; `root-cause.md` and
  `delegation-and-orchestration.md` are untouched — the inventory's shape
  demonstrates restraint as well as its content.
- **O3 (real):** Governor clauses 1–2 (reason about the problem; lead with the
  result) get doctrine depth automatically if the Two-registers section lands (iter 3
  F6) — the governor content is fully hosted by the section-additions in F2 rows 1–2,
  9; nothing from RQ3 is left homeless.

## Questions Answered

- **RQ4 (fully):** warranted list — 10 section-additions across 5 existing files,
  each with the failure it prevents (F2); refused list — 10 plausible-sounding rules,
  each with the condition it fails (F3); subtraction candidate — `overengineering.md`
  §1 ladder table, dual locus verified first-hand with AGENTS.md L164 as the settled
  authority (F4). Set stays 7 files; no new rule file warranted anywhere.

## Questions Remaining

- RQ5: critique of `delegation-and-orchestration.md` as shipped (thin single anchor
  L491, iter 2 O4; single-lens authorship — the file was written in one pass by one
  reader, the exact condition its own doctrine names insufficient), then the ranked
  recommendation list synthesizing all five iterations.

## Next Focus

RQ5 — read `delegation-and-orchestration.md` in full (the only file this run has not
read at critique depth), apply its own doctrine against itself, then produce the
ranked table in `research.md` per the output contract (rank | target file | change |
failure it prevents | evidence), decidable by phase 4 without opening transcripts.

## SCOPE VIOLATIONS

None. All writes landed in the bound artifact directory; all researched paths
read-only.
