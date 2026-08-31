# Iteration 005 — RQ5: Critique of `delegation-and-orchestration.md` + Final Ranked Synthesis

## Focus

RQ5: read `repo-rules/delegation-and-orchestration.md` at critique depth and name
what it gets wrong, overstates, or leaves uncovered — it was authored single-lens by
the same packet, the condition its own section 4 calls insufficient. Then emit the
final ranked recommendation table consolidating iterations 1–5, every row decidable
by an adopter without opening the transcripts.

## Actions Taken

1. Read `repo-rules/delegation-and-orchestration.md` in full (164 lines) — the only
   file this run had not read at critique depth.
2. Verified the file's external anchors first-hand: `AGENTS.md` L491 (Dispatch
   Rules — CLI dispatch MUST Read `.opencode/skills/cli-external-orchestration/cli-X/SKILL.md`)
   — citation in §2.1 is **verbatim accurate**; the `evidence-and-proof.md` §7
   chain (iter 1 F4: L219 → evidence §7 → delegation §5) and `scope-discipline.md`
   §5 refusal (iter 1 O3) both resolve.
3. Read `findings-registry.json` — confirmed carried-forward question state and the
   accumulated finding IDs for the synthesis.
4. Applied the file's own doctrine against itself (§3 brief-evidence standard, §4
   one-lens rule, §5 citation resolution, §6 self-application, SELF-CHECK).
5. Built the consolidated ranked table from iterations 1–5.

No writes outside the bound artifact directory; research targets untouched.

## Findings

### F1 — Verified factual anchors (what the file gets RIGHT)

- §2.1's citation of `AGENTS.md` §9 Dispatch Rules L491 is verbatim accurate:
  "Before composing any `cli-X` prompt, MUST `Read`
  `.opencode/skills/cli-external-orchestration/cli-X/SKILL.md` first."
- §5's chain to `evidence-and-proof.md` §7 ("a finding is a hypothesis") resolves;
  `scope-discipline.md` §5's principled non-restatement of PLAN-WORKFLOW LOCK is
  consistent with this file's §2.3 referral.
- §5 check 3 ("read the state it wrote, not the story it told") is the doctrine
  this run's own append-gateway discipline instantiates — accurate and load-bearing.

### F2 — What it gets wrong (falsifiable or self-inconsistent claims)

- **W1 — "a verification step that did not exist before" (§1 posture table) is
  false.** Verification existed before delegation: `AGENTS.md` §4 Final-State
  Verification gate (L236–241) binds every completion claim regardless of who wrote
  the work. What delegation changes is the *object* of verification (a foreign
  artifact with different failure modes), not its existence. The table overstates
  the switch, which weakens the very "you own a verification step" instruction it
  is there to deliver.
- **W2 — the §4 factual/judgment binary has a loophole.** "For a factual question
  … one delegate is enough, because the repository can settle it and you will
  check." The operative clause is "you will check" — which is exactly the
  judgment-case move (grounding). The real differentiator is never defined: *can
  the repository settle it?* A delegate's `COMPLETE` on a test run is
  factual-sounding and only settled by re-running. The binary invites
  misclassifying "repository-settleable" as "delegate-trustable", which §5's own
  existence contradicts.
- **W3 — the file fires after the delegation decision, never before it.** "Fires
  when" bullet 1 triggers on "about to hand work to another runtime"; nothing in
  the file or its trigger tests whether the hand-off should happen at all. §8's
  "Not a mandate to delegate" is one line with no test and no cross-reference to
  the restraint doctrine (`overengineering.md`) that would supply one. The
  delegation-cost failure the file names in §8 is precisely the one it cannot
  catch.
- **W4 — bullet 4 of "Fires when" promises a solo-judgment rule the file half
  delivers.** "About to answer a judgment question … from your own reading alone"
  is §6's scope, but §6's mechanics are the weakest in the file: "say plainly that
  it is your judgment and what would change it" — no divergence requirement, no
  grounding step, no escalation test. The trigger promises a gate; §6 supplies a
  disclosure.

### F3 — What it overstates

- **O1 — "every incentive to return something that looks like an answer" (§1) and
  "a five-iteration research run that produces a fluent restatement of the brief's
  own assumptions" (§3) are empirical claims about model behavior stated as
  settled fact, with zero grounding.** No incident citation, no commit, no
  experiment — the file does not even mark them as judgment. Under its own §4,
  these are the exact claims that must be diverged or grounded. The §3 claim is
  also self-referential: it describes the failure mode of the very run shape that
  is now critiquing it, unanchored to any observed instance in this repository.
- **O2 — "Agreement between two runs of the same model is not corroboration. It
  is the same opinion twice" (§4) is absolute where it should be scoped.** It
  holds for judgment questions. For grounded factual verification, a re-run with
  different seeds that lands on the same repository state IS evidence — the file
  itself relies on re-runs to settle facts in §4's own factual branch. The
  sentence as written forbids a corroboration it elsewhere presumes.
- **O3 — "None is optional, and the first is a hard rule elsewhere" (§2) is
  accurate (L491 verified) but the "hard rule" framing overstates the binding:**
  the Dispatch Rule is a level-3 operating mandate, not a level-1 hard blocker.
  Fine as routing, overstated as "hard rule."

### F4 — What it leaves uncovered

- **U1 — No repair loop for failed verification.** §5 names three checks but
  nothing says what happens when one fails: re-dispatch with a corrected brief,
  abandon the return, record the failure, who decides. §7's "goes back out or gets
  raised as an amendment" is about scope drift, not verification failure. The deep
  loop's own machinery (typed failure events, state logs) is an instance of the
  missing protocol — the doctrine does not require it.
- **U2 — No multi-delegate conflict doctrine.** "Fires when" names "a fan-out
  lineage", but the whole file models one delegate, one return. Nothing covers
  reconciling conflicting returns (which wins, how to combine, when to re-dispatch
  with the conflict stated). The set's own workflows (deep-loop fan-out, AI
  Council) produce exactly this situation.
- **U3 — The paper trail is one-sided.** §5 requires reading the delegate's state;
  nothing requires the orchestrator to persist its brief, its checks, and its
  verdict so a later reader can reconstruct the judgment. In a repository with
  memory/save and continuity infrastructure, the orchestrator-side audit record is
  a genuine absence — §3's "brief carries evidence" has no durable counterpart.
- **U4 — Returns from work it did not dispatch are uncovered.** Transcript reads,
  linked-context handovers, and session continuations carry the same verification
  obligations (§5's checks apply to any foreign artifact), but the "Fires when"
  table is dispatch-centric and never fires for them.
- **U5 — No cost-of-verification proportionality.** §5's checks applied to every
  return can exceed the cost of doing the work — the exact failure §8 warns about
  — with no cross-reference to `blast-radius.md`'s proportionality doctrine. The
  file applies restraint to delegation but not to its own verification stack.
- **U6 — The §4 escalation path is undefined.** "If it is genuinely a preference,
  it is the operator's" — there is no test for "genuinely a preference" versus
  "judgment the operator would want grounded". Escalate-vs-ground is the file's
  least-defined move, on the branch that decides who decides.
- **U7 — Structural: the thinnest anchor in the set (iter 2 O4 confirmed).** The
  posture doctrine (§1–§8) hangs on a single AGENTS.md anchor, L491's dispatch
  rule, which covers only the pre-dispatch moment. The file's own "Fires when"
  rows are self-authored triggers, not AGENTS.md rows — so the set's largest
  net-new file is also its least anchored, and the only one whose load path is not
  grounded in an always-loaded row. Removal is out-of-bounds (it would orphan
  L491's expansion), but the anchor mismatch is real.

### F5 — The self-application finding (the packet's premise, confirmed first-hand)

**The file fails its own §4/§6.** It is a judgment-heavy doctrine (every section
prescribes how to think) authored by one lens, containing **zero grounding**: no
`file:line` citation anywhere in the file — while its §3 demands briefs cite
`file:line` for every claim and its §5 makes citation resolution the first check on
returns. Its empirical claims (O1) are ungrounded and unmarked. It never says "this
is one lens's judgment; what would change it" — the exact disclosure §4 and §6
demand of every judgment claim. Under its own doctrine the file is a hypothesis,
not a finding. This is not a defect of the doctrine — the doctrine is coherent and
the anchors resolve (F1) — it is a defect of the packaging: the file models the
verification discipline it refuses to practice on itself.

### F6 — SELF-CHECK calibration contradiction

§5 calls a fabricated `file:line` "the cheapest thing to detect and the most
expensive thing to propagate", but SELF-CHECK item 7 reads "I opened at least one
citation from the return and it resolved." Sampling one citation from a return of N
does not bound the propagation risk the doctrine itself names; the check should
open the load-bearing citations (the claims the orchestrator is about to repeat),
not an arbitrary one. Doctrine and checklist disagree about the standard.

### F7 (DERIVED) — Verdict

The critique does not warrant structural change: no new file, no relocation, no
anchor surgery. It warrants **file-internal fixes**: (a) a §5 repair-loop paragraph,
(b) the SELF-CHECK calibration, (c) a one-lens marking + grounding pass on the
empirical claims (or explicit "this is judgment" labels), (d) a one-line
delegate-or-not restraint check with a cross-reference, (e) an orchestrator-side
persistence clause (U3). The file's doctrine survives; its self-application does
not.

---

## RANKED RECOMMENDATIONS

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

## Questions Answered

- **RQ5 (fully):** the file's anchors are accurate (F1); four wrong claims
  (F2 W1–W4); three overstatements (F3 O1–O3); seven uncovered gaps (F4 U1–U7);
  the self-application failure confirmed first-hand (F5); SELF-CHECK calibration
  contradiction (F6); verdict: file-internal fixes only (F7).
- **All five RQs now resolved** — RQ1 coverage map (iter 1), RQ2 move-down
  classification (iter 2), RQ3 governor verdict (iter 3), RQ4 warranted/refused/
  subtraction (iter 4), RQ5 critique + ranked synthesis (this iteration).

## Questions Remaining

None material. The run's five questions are all answered; the ranked table is the
delivery surface for adoption. Follow-up (implementation) is out of scope for this
research run by design.

## Next Focus

Run complete at max iterations (5/5). The ranked table above is the adoption
hand-off: ranks 1–5 close the 8 true gaps plus the governor content as
section-additions to 5 existing files; rank 6 is the subtraction; ranks 7–9 fix the
critiqued file internally; rank 10 is a keep-decision. Set stays seven files.

## SCOPE VIOLATIONS

None. All writes landed in the bound artifact directory; all researched paths
read-only.
