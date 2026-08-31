---
title: "Research: Repo-Rules Gap Analysis and the Retired Governor Disposition"
description: "Five iterations on a DeepSeek V4 Flash Max executor over the shipped repo-rules set, AGENTS.md, and commit 4477a9f1. Verdict: the set stays seven files. Ten section-additions to five existing files close every real gap, ten plausible new rules are refused with the failed condition named, one subtraction is warranted because a dual-locus restraint ladder now disagrees with itself, and the delegation rule this packet wrote fails its own self-application in six named ways."
trigger_phrases:
  - "repo rules gap research"
  - "governor disposition verdict"
  - "ranked rule recommendations"
  - "delegation rule critique"
  - "rule set subtraction candidate"
importance_tier: "important"
contextType: "research"
---

# Research: Repo-Rules Gap Analysis and the Retired Governor Disposition

---

## 1. RUN RECORD

| Field | Value |
|-------|-------|
| Iterations | 5 of 5 (terminal cap) |
| Stop policy | `max-iterations` - `minIterations` set equal to `maxIterations`, so the convergence floor overrode every stop candidate and only the terminal cap could end the run |
| Executor | `cli-devin`, model `deepseek-v4-flash-max` (DeepSeek V4 Flash **Max** thinking tier, 1M context, roster-verified before dispatch) |
| newInfoRatio by iteration | 0.85 -> 0.55 -> 0.60 -> 0.55 -> 0.60 |
| Write authority | `specs/agents/007-repo-rules-router/003-disposition-and-gap-research/` - every doctrine file's mtime predates the run's first write |
| Prior context | **None retrieved.** The `system-spec-memory` MCP server failed to connect (CONNECT_TIMEOUT). A connection failure, not evidence that no prior context exists. |

The ratios never approached the 0.05 threshold, so the forced-depth policy was never
actually load-bearing here - the run would have gone to five iterations on its own.
Recorded because the opposite result would have mattered.

---

## 2. HEADLINE VERDICT

**The rule set stays seven files.** Every real gap is a section-addition to a file that
already exists, and the single most useful finding is a subtraction, not an addition.

Four results carry the run:

1. **Coverage is better than assumed, and the gaps are specific.** Of 52 prescriptive
   rows in `AGENTS.md` sections 2, 3, 4 and 7: 33 have a direct expansion, 4 are
   partial, 7 are design-excluded by the router's own scope statement, and **8 are true
   gaps** - all process rows in section 3, plus Violation Recovery in section 2.

2. **Moving rows down buys capacity, not size.** The eight move-down candidates free
   **four lines** of always-loaded surface. Anyone selling move-down as bloat reduction
   is selling the wrong benefit; what it buys is somewhere for a one-line row to grow.

3. **The governor's disposition is three-fifths already home.** Of the five clauses in
   the retired directive, three still live in `AGENTS.md` L140-142 and section 4. Two do
   not live anywhere, and both belong in existing files. **No new rule file, and no
   restored container** - per-turn force was the only property a "governor" container
   ever added, and that is exactly what commit `4477a9f1` deliberately removed.

4. **The delegation rule fails its own test.** Written single-lens by this packet, it
   contains zero `file:line` citations while its own section 3 demands them of every
   brief, and it never marks its empirical claims about model behavior as one lens's
   judgment - the disclosure its own sections 4 and 6 require. The doctrine survives;
   the self-application does not.

---

## 3. FINDINGS BY QUESTION

### RQ1 - Coverage

52 prescriptive rows mapped. Section 4 is near-saturated (`evidence-and-proof.md`
expands 12 of 13 rows). Section 7 is fully saturated. Section 3's blast-radius,
debugging and restraint clusters each have a home.

**The 8 true gaps:** two registers · plan-before-acting · research-first ·
frequent self-checks · reason-from-actual-data · fallbacks-only-for-real-constraints ·
verify-with-checks · Violation Recovery.

**Net-new doctrine with no `AGENTS.md` row** is real and mostly healthy: the restraint
ladder, the three drifts, the reversibility tiers, the symptom-fix smells, and the whole
delegation posture. Expansion beyond the source is what the rule files are for.

### RQ2 - Direction of travel

18 row-groups must stay, and they reduce to one property: **always-loaded force**. Rule
files load on a trigger and sit at level 3 of the precedence ladder, so anything that
must bind every turn cannot move.

Cross-window rows (L315 git push, L483, L491, L497) are **already correctly shaped** -
the statement stayed, the doctrine moved. "Move down means expand down, not delete up."

### RQ3 - The governor disposition

Container and content separate cleanly:

| Clause | Where it lives now | Verdict |
|--------|--------------------|---------|
| Reason about the problem, not yourself | `AGENTS.md` L142 | carried - nothing to do |
| Lead with the result; act rather than narrate | `AGENTS.md` L141 | carried - nothing to do |
| Reversible decisions are cheap - decide and move on | nowhere (grep-proven) | section in `blast-radius.md` |
| Qualify only when it changes what the reader should do | nowhere verbatim | section in `uncertainty-and-honesty.md` |
| Proof over appearance (retired in the same commit) | `AGENTS.md` section 4 | carried - nothing to do |

The retirement's own reasoning and this run's criterion are the same asymmetry: a rule
with an enforcer earns per-turn cost; a disposition does not. Two homeless clauses,
roughly four lines, do not meet the anatomy bar for a file of their own.

**This corrects the framing in this phase's own `spec.md`,** which said the disposition
"now has no home". Three of five clauses do. The correction is the kind of thing a
second lens exists to catch.

### RQ4 - Inventory

**Ten warranted additions**, all sections in five existing files. **Ten refusals**, each
naming the condition it failed: gate-discipline, git/PR, communication-format, testing,
security, memory, spec-folder, skill-routing, delegation-mechanics, collaboration. The
refusal test used throughout: a trigger-shaped cluster, with no existing home, not
design-excluded, and anchored to an `AGENTS.md` row.

One row closed for free: **frequent self-checks** is already instantiated by every rule
file's closing SELF-CHECK. No addition needed.

**The subtraction, verified first-hand:** `AGENTS.md` L164 names
`sk-code/shared/references/universal/code-quality-standards.md` section 1 as the
authoritative restraint ladder, while `overengineering.md` section 1 defines a
same-named ladder with a **different taxonomy** - and rung 2 disagrees between the two
loci. That is a contradiction, not duplication. Drop the table, keep the
climbing-sentence doctrine, add a one-line pointer.

### RQ5 - The delegation rule under critique

Four wrong claims, three overstatements, seven uncovered areas. The load-bearing ones:

- **W1:** section 1 claims delegation creates "a verification step that did not exist
  before". `AGENTS.md` section 4's Final-State Verification gate predates it.
- **O1:** the claims about model incentives and fluent restatement are empirical
  assertions with no grounding - precisely what the file's own section 4 says to
  diverge or ground.
- **U1/U3:** no repair loop when verification fails, and a one-sided paper trail - the
  delegate's state is read, the orchestrator's brief and verdict are never persisted.
- **F6:** zero `file:line` citations in a file whose section 3 requires them, and whose
  SELF-CHECK asks only that "at least one" citation be opened, contradicting its own
  section 5 severity claim.

**Verdict: file-internal fixes, not removal.** The file is the only expansion anchored
to `AGENTS.md` L491; deleting it would orphan that row.

---

## 4. RANKED RECOMMENDATIONS

Consolidated from iterations 1–5. Every row is decidable from the cited iteration
finding; no transcript access required. "Evidence" cites iteration narratives
(`iter N Fx`), which are the run's own artifacts.

| Rank | Target file | Change | Failure it prevents | Evidence |
|---|---|---|---|---|
| 1 | `evidence-and-proof.md` | Extend §2 (reason from actual data) and §3/§9 (verify with checks) | Completion claims made without running the checks; claims reasoned from assumption instead of observation — the set's most expensive failure class (Iron-Law verification) | iter 1 F3 rows 6,8; iter 4 F2 rows 6–7 |
| 2 | `uncertainty-and-honesty.md` | Add Two-registers section (clipped/dense), folding in the retired governor's qualify-only clause as the reader-impact selector over §2's inline-flag mechanism | Mid-task narration bloat; qualification noise that changes nothing the reader should do | iter 2 F3 row 2; iter 3 F3 clause 4 + F4; iter 4 F2 rows 1–2 |
| 3 | `scope-discipline.md` | Add approach-discipline section: plan-before-acting + research-first (one section, two gaps) | Multi-step work started with no plan (tool-call churn, rework); edits made before reading the actual code | iter 1 F3 rows 3–4; iter 2 F3 rows 3–4 + O2; iter 4 F2 rows 3–4 |
| 4 | `blast-radius.md` | Extend §2 with the governor's decision-velocity clause (reversible → decide, mark, move on; `// DECISION:` marker optional) | Reversible decision forks stall; decisions unmade at forks the reversibility ladder already declares cheap | iter 3 F3 clause 3 + F4; iter 4 F2 row 9 |
| 5 | `overengineering.md` | Extend §4 (tools/dependencies cluster): fallbacks only for real constraints | Fallback paths and tooling added for imagined constraints | iter 1 F3 row 7; iter 4 F2 row 8 |
| 6 | `overengineering.md` | SUBTRACT §1's ladder table; keep the climbing-sentence doctrine and add a one-line pointer to the authoritative locus (`code-quality-standards.md` §1, per AGENTS.md L164) | Contradiction risk from dual-locus ladder with different taxonomies (rung 2 = "extend in place" vs rung 2 = "standard library"); authority already settled by L164 | iter 1 O1; iter 4 F4 (both loci read first-hand) |
| 7 | `delegation-and-orchestration.md` | Add §5 repair-loop paragraph: what happens when a check fails (re-dispatch with corrected brief / record the failure / never quote the return); require orchestrator-side persistence of brief + checks + verdict | Failed returns propagated as findings; unreconstructable orchestration judgments | iter 5 F4 U1, U3 |
| 8 | `delegation-and-orchestration.md` | Recalibrate SELF-CHECK item 7: open the load-bearing citations (claims about to be repeated), not "at least one" | Fabricated citations propagating at scale while the checklist is satisfied by one resolved sample | iter 5 F6 |
| 9 | `delegation-and-orchestration.md` | Add one-line delegate-or-not restraint check (cross-ref `overengineering.md`); mark the file's empirical claims (O1) as one-lens judgment or ground them, per the file's own §4/§6 | Delegation costing more than the work; readers mistaking ungrounded judgment for finding | iter 5 F2 W3, F5 |
| 10 | `AGENTS.md` §2 | Violation Recovery: KEEP in place (no move-down, no new host) — decision row | Moving it would remove the adjacency that gives it force: its trigger fires exactly when the trigger-loaded load path may already be broken | iter 2 F3b; iter 4 F2 row 10 + F3 refusal #1 |

**Out-of-bounds (deliberately not ranked):**

- Restoring any per-turn governor container — retirement in `4477a9f1` is not
  relitigated (iter 3 F2); the disposition's content is hosted by ranks 2 and 4.
- Whole-file subtraction of `delegation-and-orchestration.md` — touches the
  always-loaded row L491; removal would orphan an anchored expansion (iter 2 O4;
  iter 5 F4 U7). Its critique is satisfied by ranks 7–9.
- Any new rule file for gate-discipline, git, communication, testing, security,
  memory, spec-folder, skill-routing, delegation-mechanics, or collaboration —
  all refused in iter 4 F3 with the failed condition named.
- Any change to §1 hard blockers, §2 gates, or §4 completion gates — the
  must-stay set (iter 2 F2, 18 row-groups).

---

## 5. HOW TO READ THIS

Every row above is a hypothesis produced by one executor family in one run. Phase 4
verifies each claimed gap against the repository before adopting it, records a
disposition for every row including the refusals, and batches anything touching
`AGENTS.md` into a single operator approval - that document carries hard blockers, and
a rule file never overrides one.

A low adoption rate would be a finding about this research, not a failure of the
adoption phase.

---

## 6. ARTIFACTS

| Artifact | Path |
|----------|------|
| Iteration narratives | `research/iterations/iteration-00{1..5}.md` (910 lines) |
| Per-iteration deltas | `research/deltas/iter-00{1..5}.jsonl` |
| State log | `research/deep-research-state.jsonl` (5 `iteration` records) |
| Ledger | `research/deep-research-ledger/` (5 sequences, receipts recorded) |
| Strategy | `research/deep-research-strategy.md` |
| Question set | `research/research-questions.md` |
| Dispatch receipts | `research/dispatch-receipts/` |
