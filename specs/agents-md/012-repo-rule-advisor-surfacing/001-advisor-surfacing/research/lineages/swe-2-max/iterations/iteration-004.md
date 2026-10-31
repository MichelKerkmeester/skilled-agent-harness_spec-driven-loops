---
title: "Iteration 4: Cross-candidate verification, the coverage partition, and the final matrix"
trigger_phrases: []
---
# Iteration 4: Cross-candidate verification, the coverage partition, and the final matrix

## Focus

Re-verify every load-bearing citation the synthesis will rest on, assemble the candidate×axis matrix, and fix the verdict's deciding tests — including a correction to iteration 3's advise-rate estimate.

## Actions Taken

- Re-read `AGENTS.md` §6–§10 in full — found the §8 reply-fired rule loader the earlier passes had not read.
- Verified `AGENTS.md:153` — the Verification Standards explicitly "bind unconditionally, including on a read-only turn where Gate 5 never fires."
- Grepped the advisor scorer for any repo-rules corpus presence (zero).
- Measured the real spec-gate advise rate by day (correcting iteration 3's tail-only estimate).

## Findings

1. **The coverage partition is designed, not an oversight.** `AGENTS.md:261` loads the five reply-fired rules by name — `communication.md`, `communication-prose.md`, `communication-decisions.md`, `communication-handoff.md`, `answer-the-actual-request.md` — "before any substantive reply… These five fire on a reply rather than on a write, so Gate 5 never reaches them." The framework already routes the rules Gate 5 cannot reach through a second, always-loaded instruction.

2. **The read-turn floor is explicit.** `AGENTS.md:153`: the five Verification Standards "bind unconditionally, including on a read-only turn where Gate 5 never fires and no rule file loads." Plus Confidence Thresholds (§2:70-78), Restraint Signals (§3:135-147), and the §8 two binding clauses (AGENTS.md:263). The compressed obligations a rule file would add depth to are already resident.

3. **The genuinely uncovered cell is narrow.** Of 13 rules: 5 are reply-fired (§8 loader), 8 are action-fired (Gate 5). Of the 8, four — uncertainty, evidence, root-cause, delegation — can also fire on pure read-only reasoning turns (diagnose, answer-without-certainty, judge a delegation), where neither loader reaches them. What is uncovered there is only the rules' *expanded* text; their binding clauses are the resident floor (precedence level 3, REPO RULES.md:22-27).

4. **Correction to iteration 3.** The spec-gate advise rate is ~1–33/day (peak 33 on 2026-09-30, recent 1–7/day) measured over the log's dated rows — not "5 in 2 days." Still cheap for a once-per-session marker form, but the honest number is per-day, not per-event [SOURCE: .skilled/skills/.state/spec-gate/spec-gate-warnings.log, `awk` date histogram].

5. **The advisor cannot suggest rules without a corpus change.** The scorer's recommendation kind is `'skill' | 'command'` only [SOURCE: scorer/types.ts:47,156]; zero `repo-rules` references anywhere in `runtime/lib` or the scorer. A "suggest rules" variant of (a) means admitting rules into the advisor's scored corpus — a topic-matched recommendation polluting the skill-routing contract, symmetric to the REPO RULES.md §4 carve-out ("Out: skill routing" — the layers are deliberately separate) [SOURCE: scorer/types.ts:47; REPO RULES.md:90-94].

6. **Final candidate×axis matrix (all evidence from iterations 1–3, re-verified):**

| Axis | (a) advisor-brief pointer | (b) trigger-index corpus | (c) PreToolUse advisory | (d) no new surface |
|---|---|---|---|---|
| Emits | constant 2nd directive under `Directives:` | `{matchClass,path,phrases,score}` rows in Gate 1 output | `additionalContext` at first mutation (strong) or per classified action (weak) | — |
| Silence | never self-silent; dedup-suppressed only | vocabulary miss (exit 1) | natural (marker / no match) | — |
| Cost/turn | ~0 suppressed; ~150–250 chars per delivery episode | 1 row per matching turn + <1% artifact | ~1 line per session (strong form) | 0 |
| Match key | none (constant) | prompt topic | tool action (≤4/13 rules observable) | — |
| 022 bar | fails: restates resident Gate 5, no mechanical gate | n/a (retrieval, not injection) | strong form passes: enforces a declared HARD gate once | — |
| Portability | clean (shared renderer) | misses sibling-local rules (out-of-root skip) | weakest: per-runtime invisibility traps | — |
| Prior decision | retired-directives precedent against | decided against at retrieval-conventions.md:284 | Gate-3 marker precedent for | promotion remedy (022) endorses the partition |

7. **The only admissible form that survives all four tests** is the strong-form (c): a once-per-session `additionalContext` at the first non-exempt mutation — "match your action against `REPO RULES.md` and load every firing rule." It names a declared [HARD] BLOCK at the moment it binds (022 bar ✓), matches the action event not the topic (table semantics ✓), self-silences via the cloneable Gate-3 marker (cost ≈ ~1 line/session, measured precedent ~1–33 advises/day) (✓), and needs a per-runtime adapter (portability △). **Its blocker: no measured Gate-5 miss rate exists**, so admission today would be speculative — it is a candidate for build only if a miss is observed or the operator accepts the unmeasured risk [SOURCE: decisions.md:33-36; cross-lineage-synthesis.md:81].

8. **Refined-(e) recorded but not recommended.** Indexing rules while rendering them as Gate-5 loads (not context candidates) answers the exclusion objection's literal wording [SOURCE: retrieval-conventions.md:284], but remains topic-matched, fires on read-only turns, and reverses a recorded decision + parity test + committed artifact. The test that would change this: Gate 1's output gaining a non-context presentation channel (e.g., an action/load lane) — then re-open.

9. **The uncovered hole that matters is CI-side, not model-side.** 010 item 18: no mechanical check that trigger rows cover rule fires — the `create-repo-rule` verify step checks counts and links only [SOURCE: synthesis.md item 2/:53-57; cross-lineage-synthesis.md:72]. This is where evidence says the real fragility lives (five rows dropped fires before; the failure mode already happened once).

## Questions Answered

- Does any form satisfy bar+action+silence+federation? Only the strong-form (c), and its admission is blocked on an unmeasured miss rate.
- What is the actual uncovered cell? Expanded text of ~4 reasoning rules on pure read turns; binding clauses already resident.
- What decides (d) vs (c)-strong? A measured Gate-5 miss. Absent it: (d) for prompt/advisory surfaces; the real fix belongs to a coverage check (CI-side), plus optionally the strong-form reminder as an accepted-risk build.

## Questions Remaining

- None blocking synthesis. Open for the operator: whether to build the once-per-session reminder on accepted-risk grounds, and whether to extend `create-repo-rule`'s verify step to compare row coverage against rule fire lists.

## Ruled Out

- (a) as shipped form: fails both prongs of the 022 bar; the `AGENTS.md`-absent-runtime rationale is weaker for Gate 5 than for hygiene (hygiene names a mechanical pre-commit prohibition; Gate 5 is a model contract).
- (b) and refined-(e): recorded-decision reversals whose failure mode (topic-matched surfacing on read-only turns) is the exact thing the exclusion prevents; sibling-local rule invisibility measured.
- Weak-form (c) per-action classification: ≤4/13 observable, already-guarded action space, unmeasured need.
- Advisor-scored rule recommendations: not in the scorer's kinds; pollutes the routing layer boundary.

## Assessment

- `newInfoRatio`: `0.55`
- Novelty justification: mostly consolidation — but the §8 reply-fired loader (AGENTS.md:261) is a NEW decisive fact that shrinks the "gap" to a designed partition, plus the honest correction of the advise-rate measurement and the advisor-scorer corpus exclusion check.
- Confidence: high on the matrix (every cell cites verified code/docs); the (d)-vs-(c)-strong call is explicitly gated on one missing measurement, which the synthesis will name rather than paper over.

## Reflection

- Worked: re-reading AGENTS.md's tail caught the §8 loader — the single fact that most changes the verdict's shape (the gap is designed, not accidental).
- Corrected: iteration 3's advise-rate was a tail estimate; the histogram is the measured rate (022 rule applied to myself).
- Limitation: the miss-rate question cannot be answered from this repo's logs because Gate 5 has no telemetry; the verdict names the measurement rather than assuming it.

## Recommended Next Focus

Synthesis: verdict = (d) for prompt/advisory/retrieval surfaces, with the strong-form once-per-session reminder named as the single admissible build (gated on a measured miss or operator risk acceptance), refined-(e) recorded with its reopening test, and the CI coverage check named as the real gap owner.

## Sources Consulted

- [SOURCE: AGENTS.md:49-101,113-147,153,229-285 (esp. 259-263)]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:47,156]
- [SOURCE: .skilled/skills/.state/spec-gate/spec-gate-warnings.log (date histogram)]
- [SOURCE: REPO RULES.md:22-27,40-52,90-94]
- [SOURCE: specs/hooks/022-smart-rule-injection/decisions.md:21-36]
- [SOURCE: specs/hooks/022-smart-rule-injection/001-deep-research/implementation-summary.md:51-55]
- [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:282-285]
- [SOURCE: specs/agents/010-repo-rule-system-integration/research/cross-lineage-synthesis.md:72,81; synthesis.md:53-57]
- [SOURCE: .skilled/hooks/injection-contract.md:50-68,100,166-172,201]
