---
title: "Iteration 002 — RQ2: Move-Down vs Must-Stay Classification"
trigger_phrases: []
---
# Iteration 002 — RQ2: Move-Down vs Must-Stay Classification

## Focus

RQ2: classify `AGENTS.md` rows as move-down candidates (with a line-count delta each)
versus must-stay (hard blockers, mandatory gates, routing). Candidate pool per the
iteration brief: the 8 true gaps from iteration 1 (F3) plus the cross-window §5/§9
expansions (F5).

## Actions Taken

1. Re-read `AGENTS.md` L1–179, L180–260, L261–488 to verify every candidate span and
   the must-stay rows first-hand (iteration 1's spans confirmed; L179–190, L236–241,
   L245–255, L277–292, L315, L483 verified verbatim this iteration; L491/L497 cited
   from iteration 1's read).
2. Applied the classification criteria: hard blocker? mandatory gate (fires every
   turn)? routing? already-expanded (statement + expansion pattern) vs true gap?
3. Computed per-row line-count deltas: lines removed from AGENTS.md minus the
   one-line pointer that replaces each row.
4. Classified the 8 gaps, the 4 cross-window rows, and the boundary rows (§4 gates,
   §7 escalation).

No writes outside the bound artifact directory; research targets untouched.

## Iteration Mechanics Notes

- Gateway append succeeded: ledger sequence 2, `event-b545bce6-0b37-4983-b792-7c284b543c76`, exit 0, `projectionRefreshed: true`.
- The pack's run-directory derivation (`dirname` of the state path) makes the gateway refresh its projection at the nested `research/research/deep-research-state.jsonl` (it appends the state filename to the run directory); the canonical `research/deep-research-state.jsonl` carries the workflow's config/iteration_start lines and is reconciled by the reducer from the ledger plus `deltas/iter-002.jsonl`, which contains the same iteration record.
- First gateway attempt via process substitution failed (`EBADF`) — the gateway re-opens the event path; a real temp file is required. Second attempt lacked the stable identity fields (`runId`/`lineageId`); the record was accepted once both were present, matching iteration 1's record shape.

## Findings

### F1 — The stay criteria reduce to one property: always-loaded force

The three stay-criteria in the question (hard blocker, mandatory gate, routing) are
three faces of one property: the row must bind **every turn** (or sit at the top of
the precedence ladder where a rule file cannot override it). Rule files load only on
trigger match (Gate 5, L111–119) and live at level 3 of the ladder — "A rule file
never relaxes a hard blocker" (L117). Rows that bind only when a situation arises
(process doctrine) can move down: the rule file's "Fires when" trigger fires exactly
when the row applies. This is the same asymmetry RQ3 must test for the retired
per-turn governor.

### F2 — Must-stay rows (delta 0 each; 18 row-groups, ≈120 lines)

| Rows | Span (verified) | Why must stay |
|---|---|---|
| §1 Four Laws | L19–26 | Hard blocker; level-1 anchor; fires every turn |
| §1 PLAN-WORKFLOW LOCK | L28–38 | Hard blocker; plan-time binding |
| §1 Comment Hygiene | L40–42 | Hard block; fires on every code write |
| §1 Halt Conditions | L44–49 | Hard stop conditions; fires every turn |
| Gate 3 | L59–73 | Gate + design-excluded (§4 spec-folder mechanics) |
| Gate 1 | L75–80 | Gate; design-excluded (memory/plumbing) |
| Confidence Thresholds | L82–89 | The gates' operative decision scale; cited by Gate 1 step 3 and §9 L484 |
| Gate 2 | L91–98 | Gate + routing; design-excluded (skill routing) |
| Skill Routing Reference | L100–104 | Routing; design-excluded |
| Gate 4 | L106–109 | Gate + workflow selection; design-excluded (judgment call, iteration 1 O2) |
| Gate 5 | L111–119 | Gate; is itself the repo-rules router contract (`REPO RULES.md` is its expansion) |
| Consolidated Question Protocol | L121–122 | Per-turn consolidation gate; bypass phrases are per-turn |
| §4 Final-State Verification gate | L236–241 | Completion gate; fires on every completion claim |
| §4 Completion Verification Rule | L245–255 | Completion gate; design-excluded (spec-kit mechanics) |
| §4 Memory Save Rule | L277–283 | Save gate; design-excluded (spec-kit mechanics) |
| §4 Self-Check list | L285–292 | Per-response checklist; fires before every tool-using response |
| §7 Logic-Sync Protocol | L376–380 | Escalation near-gate ("then wait"); must be visible when conflict hits |
| §7 Escalation | L382–384 | Escalation gate (routes the §7 path) |

Corroboration: iteration 1 O5 — no rule file expands §1 hard blockers, consistent
with the precedence ladder. O3 — `scope-discipline.md` §5 deliberately refuses to
restate PLAN-WORKFLOW LOCK, a principled non-expansion of a must-stay row.

### F3 — Move-down candidates: the 8 true gaps (line-count deltas)

| # | Row | Span | Lines now | Pointer after | AGENTS.md delta | Host candidate | Fires when |
|---|---|---|---|---|---|---|---|
| 1 | Violation Recovery | L124–126 | 3 | 1 | **−2** | no host among the 7 files (gate-discipline is new territory — feeds RQ4) | about to skip gates / realized gates skipped |
| 2 | Two registers | L140–142 | 3 | 1 | **−2** | `uncertainty-and-honesty.md` (communication/honesty cluster) | mid-task communication; turn boundaries |
| 3 | Plan before acting | L161 | 1 | 1 | 0 | `scope-discipline.md` (approach discipline) | starting multi-step work |
| 4 | Research-first approach | L163 | 1 | 1 | 0 | `scope-discipline.md` (surgical edits) or `evidence-and-proof.md` | implementation task start |
| 5 | Frequent self-checks | L179 | 1 | 1 | 0 | already instantiated by the per-file SELF-CHECK anatomy (iteration 1 F4); pointer to that convention | mid-task verification loops |
| 6 | Reason from actual data | L180 | 1 | 1 | 0 | `evidence-and-proof.md` §2 (adjacent — extend, don't create) | debugging / claims |
| 7 | Fallbacks only for real constraints | L188 | 1 | 1 | 0 | `overengineering.md` §4 (tools/dependencies cluster) | tooling fallbacks |
| 8 | Verify with checks | L190 | 1 | 1 | 0 | `evidence-and-proof.md` §3/§9 (green-run lies, final-state proof) | before completion claims |

**Total AGENTS.md line savings: 4 lines** — and only from the two 3-line rows. The
six 1-line rows net **zero**: the pointer occupies the freed line.

**F3a (DERIVED) — the delta is doctrine capacity, not size.** For the 1-line rows,
move-down buys expansion headroom on the rule-file side (these are RQ1's rows
"compressed with nowhere to expand"), not bytes in AGENTS.md. The 004 bloat audit
measured always-loaded size; this operation is the inverse — moving doctrine down is
what makes the always-loaded surface *able* to stay small. A line-count-only reading
of RQ2 would correctly conclude "nothing worth moving"; the correct reading is
"everything worth moving, for headroom, at zero line cost".

**F3b (DERIVED) — Violation Recovery is the weakest candidate.** It is §2's only
non-gate row (marginal −2 delta), but its trigger — "About to skip gates, or
realized gates were skipped" (L125) — is exactly the moment the agent is least
likely to consult a trigger-loaded rule file: a skipped gate means the load path
may already be broken. Its force comes partly from adjacency to the gates it
guards. Verdict: movable in principle; **lean keep** unless a gate-discipline rule
file is independently warranted (RQ4).

### F4 — Cross-window rows (§5/§9): already expanded → keep, no move-down (delta 0)

| Row | Span | Expansion (iteration 1 F5) | Verdict |
|---|---|---|---|
| §5 git push policy | L315 | `blast-radius.md` §3 ("approval does not transfer") | Keep as binding one-liner; doctrine already moved |
| §9 Never fabricate | L483 | `uncertainty-and-honesty.md` §2 | Keep as binding one-liner |
| §9 Dispatch Rules | L491 | `delegation-and-orchestration.md` §2.1 | Keep — also the only AGENTS.md hook anchoring that file's posture doctrine; moving it would orphan the set's largest net-new file |
| §9 Close-out | L497 | `evidence-and-proof.md` §10 | Keep as binding one-liner |

**F4a (DERIVED) — "move down" means expand down, not delete up.** These four rows
show the set's authors already executed the correct shape: the doctrine side moved
into the rule file, the binding statement stayed always-loaded. RQ2's naive reading
("the row itself migrates") is wrong for these — the migration already happened,
asymmetrically. The template for the 8 gaps is the same: **statement stays as a
one-line pointer; doctrine goes down.** No always-loaded row loses its AGENTS.md
presence.

### F5 — Already-in-shape rows inside the window (no action; pattern confirmation)

§3 L148–152 (blast-radius cluster → `blast-radius.md`), L164 (pre-write pass →
`overengineering.md` §2), L186–187 + L189 (smallest size / project tools / test
what changed → `overengineering.md`), L191 (truth over agreement →
`uncertainty-and-honesty.md` §3); §4 L217–223 + L226–232 (evidence tiers →
`evidence-and-proof.md` §1/§6); §7 L376–380 (Logic-Sync → `uncertainty-and-honesty.md`
§4). These are the same expand-or-point pattern executed consistently — the 8 gaps
are the incomplete tail of that operation, not a failure of the pattern.

### Observations

- **O1 (real):** Only one of the 8 gaps lives outside §3 (Violation Recovery, §2);
  §4 and §7 are saturated — move-down work concentrates in §3's process rows.
- **O2 (real):** §3's four adjacent pairs (plan-before-acting/research-first L161–163;
  self-checks/reason-from-data L179–180; fallbacks/verify L188–190) share hosts —
  moves should be section-additions to existing files, not four new files.
- **O3 (real):** The must-stay set is 18 row-groups spanning every section 1–7; the
  always-loaded surface is not "bloat to trim" but the deliberately irreducible
  binding layer — RQ2 finds nothing above the 8 gaps that should leave it.
- **O4 (real):** L491 is `delegation-and-orchestration.md`'s only AGENTS.md anchor —
  relevant to RQ5's "leaves uncovered" critique and to RQ4's subtraction question
  (the file cannot be removed without touching an always-loaded row).

## Questions Answered

- **RQ2 (fully):** classification with deltas — 18 must-stay row-groups (delta 0,
  hard blockers / gates / routing / per-turn checklists); 8 move-down candidates
  (real AGENTS.md savings 4 lines; headroom is the actual gain; Violation Recovery
  caveated lean-keep); 4 cross-window rows correctly already-expanded (delta 0,
  keep statements); ~12 already-in-shape rows. Unifying rule: expand-or-point —
  move doctrine down, keep the binding one-liner always-loaded.

## Questions Remaining

- RQ3: container-versus-content verdict for the retired governor directive
  (commit 4477a9f1) — sharpened: the per-turn force that makes rows must-stay is
  the property the governor carried; does its content deserve that force?
- RQ4: host assignment for the 8 gaps (section-additions to 3–4 existing files vs
  new files; gate-discipline host question for Violation Recovery); dual-locus rung
  ladder (iteration 1 O1) as subtraction candidate.
- RQ5: critique of `delegation-and-orchestration.md` — thin anchor note (O4).

## Next Focus

RQ3 — read commit 4477a9f1's removed text; separate the container (per-turn
governor mechanism) from the content (the disposition it carried), testing the
content against this iteration's always-loaded-vs-triggered criterion.

## SCOPE VIOLATIONS

None. All writes landed in the bound artifact directory; all researched paths
read-only.
