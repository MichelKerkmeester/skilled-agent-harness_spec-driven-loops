VERDICT: Do not adopt the text as written. Points 1, 5, 6, 7, 8 and 9 are already covered (9 nearly verbatim); point 2 largely covered with a recorded disposition; only the residue of points 2–4 — when a settled answer may be reopened, and that re-reading is not a check — is admissible. Destination: a new section in `.skilled/repo-rules/uncertainty-and-honesty.md`. No AGENTS.md line is available: Devin cuts AGENTS.md at byte 16,384 and the last must-carry anchor ends at 16,345 (`specs/agents/016-repo-rule-advisor-surfacing/goal.md:114`; `.../003-agents-md-delivery-prefix/spec.md:61`), with a CI guard on it (`003/implementation-summary.md:51`; `specs/agents/004-agents-md-bloat-audit/implementation-summary.md:75-80`).

Per point

1. Covered — `uncertainty-and-honesty.md:81-82`, `:137`; `answer-the-actual-request.md:60-65`. Conflict: "solve the corrected problem" against `answer-the-actual-request.md:62-65`: "Either deliver the ask, or say in the first lines what you are changing and why". Risk: silently substituting a task the user did not ask for.

2. Mostly covered — `root-cause-and-debugging.md:87-101`, `AGENTS.md:189`; approach-switching was already routed to escalation without a new threshold (`specs/agents/001-terminal-proof-discipline/review-report.md:145`). Conflict: `root-cause-and-debugging.md:93` mandates a framing change on repetition — "**Restate the problem one level up**" — which "carry it to a conclusion" forbids unless the blocker is namable. Risk: sunk-cost persistence past the three-fix cap.

3. Partially covered; its positive statement is new. Adjacent: `evidence-and-proof.md:143-144` ("Re-reading your own arithmetic is not an independent derivation"). Conflict: `AGENTS.md:136` — "Rerun the objective proof plan and the authoritative workspace gate from the final state" — plus `evidence-and-proof.md:117-120`, `:130`. Risk: skipping mandated re-verification and keeping an unchecked answer. The causal claim about easy steps is unsourced: UNKNOWN.

4. New formulation. Adjacent: `evidence-and-proof.md:64-72`. Conflict: `AGENTS.md:63` "Blockers/conflicts → ask regardless of score" and `uncertainty-and-honesty.md:94-96`'s contradiction halt. Risk: a real halt or safety question dismissed as "doubt".

5. Covered — `uncertainty-and-honesty.md:84`, `:86-88`; `AGENTS.md:168`. Conflict: `uncertainty-and-honesty.md:86-88` — after a reaffirm, "that is their decision... Do not re-litigate" — and `REPO RULES.md:25` places an explicit operator instruction above rule files. Risk: refusing a correct user correction, or demanding evidence for a preference change. This is the hazard named in my brief.

6. Covered — `uncertainty-and-honesty.md:108-111`; `evidence-and-proof.md:74-77`; `AGENTS.md:185`. Conflict: none. Risk: duplication only.

7. Covered — `evidence-and-proof.md:86-95`, `:161-168`, `:203-215`; `AGENTS.md:133-138`. Conflict: the text lists "the source document or record" as decisive, while `evidence-and-proof.md:213-215` says docs are "worthless as the final word on *what happens*". Risk: citing a README as proof of behavior.

8. Covered — `uncertainty-and-honesty.md:123-125`; `answer-the-actual-request.md:52-56`; `communication.md:200`. Conflict: none, but "no invented critics" must not cancel real adversarial checks (`evidence-and-proof.md:117-120`; `delegation-and-orchestration.md:116`). Risk: dropping a required negative control as "performance".

9. Covered — `uncertainty-and-honesty.md:108-111`, `:142`. Conflict: none. Risk: none; text is duplicate.

Decision tests (new parts)

Test 1, always-loaded: No. The new clauses bind only where a premise, doubt or pushback exists, and the uncertainty trigger fires there (`REPO RULES.md:46`). An AGENTS.md row is impossible regardless (byte budget above). Continue.

Test 2, scope: In. "How to think and act... honesty" is explicitly In (`REPO RULES.md:81-82`) — posture, not routing (`decision-tests.md:59-70`). Pass.

Test 3, four-part: cluster passes; "no existing home" fails (`uncertainty-and-honesty.md` §3/§5 and `evidence-and-proof.md` §9/§11 own it); the AGENTS.md anchor fails — none exists and there is no byte room. Refuse a new file; route to a section per `decision-tests.md:133`.

Test 4, restraint: the nine as a whole have no recorded failure; the flip half is already owned (`uncertainty-and-honesty.md:84`). The reopen/oscillate half appears only as a dispatch norm (`specs/agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing/research/lineages/swe-2-max/prompts/iteration-001.md:24`, "do not re-litigate settled decisions without new evidence") and no packet records a failure — UNKNOWN. Admit only the small section below; refuse the rest as "might need it" (`decision-tests.md:113-115`).

Destination and draft

New §6 in `.skilled/repo-rules/uncertainty-and-honesty.md`, before "TWO REGISTERS" (renumber the two sections below it). Nine lines:

```
## 6. SETTLED AND REOPENED

A conclusion is settled once derived and put through the check that settles it. Re-reading it for assurance is not a check.

Carry one approach to its conclusion. Switch only on a blocker named in one line. Repetition without new evidence is such a blocker: that is where root-cause-and-debugging.md §3's level-up applies.

Reopen a settled conclusion only for a concrete reason, named in one line: a failing check, a fact or source that contradicts it, a named error, a counterexample, or an independent derivation that disagrees. A hunch, and the bare possibility of an unseen objection, are not reasons.

The carve-outs still run: §4's contradiction halt, §1's confidence bands, and evidence-and-proof.md §9's final-state proof. An operator's call on what is theirs stays theirs.
```

Points 1 and 5–9 get no text. Operator verification available: none beyond this read — no file was changed, and I did not run the repo's rule-guard checks, so the byte-budget citation rests on the packet records cited, not a fresh measurement today.
