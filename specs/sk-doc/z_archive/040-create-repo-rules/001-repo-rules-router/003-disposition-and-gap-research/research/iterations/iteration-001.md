---
title: "Iteration 001 — RQ1: Coverage Mapping (AGENTS.md rows → repo-rules expansions)"
trigger_phrases: []
---
# Iteration 001 — RQ1: Coverage Mapping (AGENTS.md rows → repo-rules expansions)

## Focus

RQ1: map every thinking-and-acting row in `AGENTS.md` sections 2, 3, 4 and 7 to the
repo-rules file that expands it, and name the rows with no expansion plus any rule
text with no corresponding AGENTS.md row.

## Actions Taken

1. Read `AGENTS.md` in full (498 lines) — sections 2 (gates, L53–126), 3 (execution
   & quality, L130–205), 4 (verification & completion, L209–292), 7 (escalation &
   conflict, L374–384), plus §5/§9 for cross-reference.
2. Read `REPO RULES.md` (router, trigger table, precedence, scope statement L65–74).
3. Read all seven rule files under `repo-rules/` in full.
4. Read `deep-research-strategy.md` (non-goals; §4 exclusion contract; 004 audit
   citation pointer).
5. Built the row→expansion map, the no-expansion list, and the net-new doctrine list.

No writes outside the bound artifact directory; research targets untouched.

## Findings

### F1 — Coverage verdict (DERIVED, from my own enumeration of prescriptive rows)

Of **52 prescriptive rows** in AGENTS.md §2/§3/§4/§7:
**33 have a direct expansion** (63%), **4 are partially expanded**, **7 are
design-excluded** by `REPO RULES.md` §4's scope statement, **8 are true gaps**
(neither expanded nor excluded).

### F2 — Row → expansion map

#### Section 2 (MANDATORY GATES)

| AGENTS.md row | Location | Expansion |
|---|---|---|
| Gate 3 spec-folder question | L59–73 | none — **design-excluded** (§4: spec-folder mechanics) |
| Gate 1 context surfacing | L75–80 | none — **design-excluded** (memory/plumbing) |
| Confidence Thresholds table | L82–89 | `uncertainty-and-honesty.md` §1 (explicitly: "exactly one of it; what it adds is how to behave inside a band") |
| Gate 2 skill routing | L91–98 | none — **design-excluded** (§4: skill routing) |
| Skill Routing Reference / advisor metadata | L100–104 | none — **design-excluded** (skill routing) |
| Gate 4 workflow tiebreakers | L106–109 | none — **design-excluded** (§4: workflow selection; judgment call, see O2) |
| Gate 5 repo-rules load | L111–119 | `REPO RULES.md` itself (router + trigger table + precedence) |
| Consolidated Question Protocol | L121–122 | partial — `uncertainty-and-honesty.md` §1 ("consolidating every question into one message"); bypass phrases uncovered |
| Violation Recovery | L124–126 | none — **true gap** |

#### Section 3 (EXECUTION & QUALITY)

| AGENTS.md row | Location | Expansion |
|---|---|---|
| Two registers (clipped / dense) | L140–142 | none — **true gap** |
| Follow brief's intent; record deviations | L144 | partial — `scope-discipline.md` §6 (amendment over absorption) |
| Match effort to blast-radius; stakes read | L148 | `blast-radius.md` §1 |
| Name the rollback, stop for yes | L149 | `blast-radius.md` §3 |
| Name what still speaks the old contract | L150 | `blast-radius.md` §4 |
| Sanitize by persistence boundary | L151 | `blast-radius.md` §5 |
| Acquire dependencies deliberately | L152 | `blast-radius.md` §6 + `overengineering.md` §4 + `scope-discipline.md` §3 |
| Plan before acting | L161 | none — **true gap** |
| Define proof before implementation | L162 | `evidence-and-proof.md` §8 |
| Research-first approach | L163 | none — **true gap** |
| Pre-write pass (need to exist / what it touches) | L164 | `overengineering.md` §2 |
| Repo-local rules load at Gate 5 | L165 | `REPO RULES.md` |
| Take responsibility (no "not my changes") | L168 | `root-cause.md` §6 (Ownership) |
| Smallest complete result | L169 | `scope-discipline.md` §1 (narrowing drift) + `overengineering.md` §5 |
| Don't stop early | L170 | `scope-discipline.md` §7 (Finishing) |
| Don't ask permission for approved steps; mandatory waits | L171 | `scope-discipline.md` §7 |
| Reproduce / trace / fix / rerun | L174 | `root-cause.md` §1 + `evidence-and-proof.md` §4 |
| Law 4 bounded remediation loop | L175 | partial — `root-cause.md` §1/§3 (loop mechanics, no explicit "bounded loop" text) |
| Stop patching at failure site; restate one level up; name the seam | L176 | `root-cause.md` §3 |
| Frequent self-checks | L179 | none — **true gap** |
| Reason from actual data | L180 | none — **true gap** (`evidence-and-proof.md` §2 is adjacent, not an expansion) |
| Solve stated problem at smallest size | L186 | `overengineering.md` (whole file) |
| Prefer available project tools | L187 | `overengineering.md` §4 (dependencies) + `blast-radius.md` §6 |
| Fallbacks only for real constraints | L188 | none — **true gap** |
| Test what changed / coverage floor | L189 | `overengineering.md` §4 (Tests: "The coverage floor and the earns-its-place bar are AGENTS.md §3") |
| Verify with checks | L190 | none — **true gap** |
| Truth over agreement | L191 | `uncertainty-and-honesty.md` §3 |
| Restraint Signals table (7 rows) | L197–205 | `overengineering.md` §3 (explicitly binds, not repeated; adds 2 signals) |

#### Section 4 (VERIFICATION & COMPLETION)

| AGENTS.md row | Location | Expansion |
|---|---|---|
| Confirmed vs inferred | L217 | `evidence-and-proof.md` §1 (OBSERVED/DERIVED/INFERRED tiers) |
| Baseline before "no regressions" | L218 | `evidence-and-proof.md` §5 |
| Finding = hypothesis | L219 | `evidence-and-proof.md` §7 |
| Objective proof plan | L220 | `evidence-and-proof.md` §8 |
| Observed command evidence | L221 | `evidence-and-proof.md` §2 |
| Safe negative control | L222 | `evidence-and-proof.md` §4 |
| Final-state proof | L223 | `evidence-and-proof.md` §9 |
| Task-specific proof (4 rows) | L226–232 | `evidence-and-proof.md` §6 |
| Final-State Verification gate | L236–241 | `evidence-and-proof.md` §9 (partial: check list is shared) |
| Completion Verification Rule (validate.sh, checklist, reconcile) | L245–255 | none — **design-excluded** (spec-kit mechanics) |
| Four ways a validate.sh run lies | L257–275 | `evidence-and-proof.md` §3 (generic "four ways a green run lies" — mirrors: did not run / wrong thing / stale artifacts / asserted nothing) |
| Memory Save Rule | L277–283 | none — **design-excluded** (spec-kit mechanics) |
| Self-check list | L285–292 | partial — each rule file ends with its own SELF-CHECK; the AGENTS list itself is a router of checks |

#### Section 7 (ESCALATION & CONFLICT)

| AGENTS.md row | Location | Expansion |
|---|---|---|
| Logic-Sync Protocol | L376–380 | `uncertainty-and-honesty.md` §4 (exact LOGIC-SYNC REQUIRED format, "then wait") |
| Escalation (<80% after two attempts → 2–3 options; blockers → evidence) | L382–384 | `root-cause.md` §7 (5-part escalation format) + `uncertainty-and-honesty.md` §1 |

### F3 — Rows with no expansion

**True gaps (8)** — not excluded by `REPO RULES.md` §4, and nothing in the set
expands them; all but one live in §3:

1. Violation Recovery (§2, L124–126)
2. Two registers (§3, L140–142)
3. Plan before acting (§3, L161)
4. Research-first approach (§3, L163)
5. Frequent self-checks (§3, L179)
6. Reason from actual data (§3, L180)
7. Fallbacks only for real constraints (§3, L188)
8. Verify with checks (§3, L190)

**Design-excluded (7)** — `REPO RULES.md` §4 deliberately leaves these to AGENTS.md
and the skills: Gate 3 (L59–73), Gate 1 (L75–80), Gate 2 (L91–98), Skill Routing
Reference (L100–104), Gate 4 (L106–109, judgment call — see O2), Completion
Verification Rule (L245–255), Memory Save Rule (L277–283). The §4 exclusion
contract is honored: none of these is a false gap.

### F4 — Rule text with no corresponding AGENTS.md row (net-new doctrine)

The set is not a pure expansion; every file carries net-new doctrine. Largest blocks:

- **`delegation-and-orchestration.md` — the whole posture doctrine** (§1 posture
  switch, §3 brief carries evidence not preference, §4 one model is one opinion,
  §5 what comes back is unverified, §6 your own opinion is also one opinion, §7
  scope travels with the work). Its only AGENTS.md hooks are §4 "Finding =
  hypothesis" (L219 → evidence §7 → delegation §5) and §9 Dispatch Rules (L491,
  outside the RQ1 window). This is the set's largest net-new file (relevant to RQ5).
- `overengineering.md` §1 rung ladder (see O1), §3's two extra signals (config
  option "so we can change it later"; forwarding wrapper — the file itself declares
  them absent from AGENTS.md), §4's options/abstraction/error-handling/defensive-
  checks doctrine (only Performance, Tests, Dependencies have AGENTS.md rows).
- `scope-discipline.md` §1 Three Drifts table (widening and transforming are
  net-new; narrowing maps to L169–170), §2 "what counts as explicitly in scope",
  §3 what-always-needs-a-yes-first list, §4 Adjacent-Defect Protocol (closest hook:
  L202 restraint signal).
- `blast-radius.md` §2 Reversibility Ladder tiers (L149 gives only the principle).
- `root-cause.md` §2 Symptom-Fix Smells table (closest hook: L205), §4 never weaken
  a check, §5 "flake is a conclusion, not a starting hypothesis".
- `uncertainty-and-honesty.md` §3 operator-reaffirms-instruction clause, §5
  correcting yourself.
- Every rule file's SELF-CHECK section — a new artifact form; AGENTS.md §4's
  self-check list (L285–292) is the generic hook.

### F5 — The set expands rows outside the RQ1 window

The router's scope ("how to think and act") reaches beyond §2/3/4/7:

- `evidence-and-proof.md` §10 close-out expands AGENTS.md §9 L497 ("close
  substantive turns with honest status").
- `blast-radius.md` §3 "approval does not transfer" expands §5 L315 (git push
  policy).
- `uncertainty-and-honesty.md` §2 expands §9 "Never fabricate" mandate (L483).
- `delegation-and-orchestration.md` §2.1 cites §9 Dispatch Rules (L491).

RQ2's move-down analysis must account for this: some expansions service rows
outside the window, so "row X is expanded" is not a per-section property.

### Observations

- **O1 (real):** `overengineering.md` §1 defines a rung ladder, while AGENTS.md L164
  declares the authoritative rungs to live in
  `sk-code/shared/references/universal/code-quality-standards.md` §1 — the ladder
  has two loci. Candidate for RQ4 (subtraction/duplication analysis).
- **O2 (real):** Gate 4 (L106–109) is classified here as design-excluded via
  "workflow selection", but it also carries deep-loop state-machine discipline —
  the classification is a judgment call; the set contains no text either way.
- **O3 (real):** `scope-discipline.md` §5 deliberately refuses to restate
  PLAN-WORKFLOW LOCK (§1 hard blocker) — a principled non-expansion showing
  conscious container choices in the set's authors.
- **O4 (real):** All seven rule files open with a "Fires when" trigger and close
  with a SELF-CHECK, mirroring REPO RULES.md's action-matching trigger table —
  consistent set anatomy.
- **O5 (real):** §1 hard blockers (Four Laws, PLAN-WORKFLOW LOCK, Comment Hygiene,
  Halt Conditions) have no rule-file expansion anywhere — consistent with the
  precedence ladder (level 1 cannot be overridden; rule files stay level 3).

## Questions Answered

- **RQ1 (fully):** the coverage map above — 33/52 rows expanded, 4 partial, 7
  design-excluded, 8 true gaps; net-new doctrine enumerated; cross-window reach
  noted.

## Questions Remaining

- RQ2: which rows should move down into a rule file, which must stay (hard
  blockers, gates, routing) — the 8 true gaps in F3 are the natural move-down
  candidate pool; §1 laws and §2 gates are the must-stay set.
- RQ3: container-versus-content verdict for the retired governor directive
  (commit 4477a9f1).
- RQ4: warranted vs not-warranted further rules + the subtraction candidate
  (O1's dual-locus ladder is a candidate).
- RQ5: critique of `delegation-and-orchestration.md` as shipped (F4's largest
  net-new block).

## Next Focus

RQ2 — move-down versus must-stay classification, using iteration 1's mapping:
test each of the 8 true gaps against the "hard blocker / gate / routing" stay
criteria, and weigh cross-window expansions (F5) before recommending any move.

## SCOPE VIOLATIONS

None. All writes landed in the bound artifact directory; all researched paths
read-only.
