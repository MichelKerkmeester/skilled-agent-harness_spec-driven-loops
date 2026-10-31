---
title: "Research: repo rule surfacing through the advisor"
description: "Two cli-devin lineages, four iterations each, on whether the skill advisor or another surface should suggest repo rules. Both refuse the advisor pointer and the trigger-index root; they split on whether an action-keyed PreToolUse advisory should be built now."
trigger_phrases:
  - "repo rule advisor research"
  - "should the advisor suggest repo rules"
  - "repo rules trigger index decision"
  - "gate 5 backstop advisory"
importance_tier: "important"
contextType: "research"
---

# Research: repo rule surfacing through the advisor

<!-- ANCHOR:deep-research-repo-rule-advisor-surfacing -->

## 1. VERDICT

**Do not teach the skill advisor about repo rules, and do not add `.skilled/repo-rules` to the trigger index.** Both lineages reached this independently, and the citations that carry it were checked against the working tree (§9).

- **Advisor brief pointer: refused.** It would be a second constant line in the Directives block, restating a Gate 5 obligation the always-loaded document already carries, with no gate enforcing it. That is the exact profile `specs/hooks/022-smart-rule-injection` refused eighteen times and the profile that retired two earlier directives (`.skilled/hooks/injection-contract.md:54`). It also cannot match on action: the advisor sees the prompt, and the scorer only knows `'skill' | 'command'` kinds (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:47`).
- **Trigger-index root: refused.** The repository already decided this: "`.skilled/repo-rules` … Decided against … indexing them would surface a rule as a context candidate" (`.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` §9, root coverage table), and `retrieval-coverage-parity.vitest.ts` fails on any divergence from that table. It matches prompt topic where the router matches action, and fires on the read-only turns Gate 5 skips on purpose.
- **Action-keyed PreToolUse advisory: the only admissible family, and the lineages split on timing** (§5). Neither found any measurement of how often the model skips a rule it needed, and 022's rule is that "an event's frequency must be read from the log, never reasoned about" (`specs/hooks/022-smart-rule-injection/decisions.md:33-36`).

**Recommended next step: measure before building anything model-facing.** A logging-only observer (no `additionalContext`, zero context cost) that records, per session, whether `REPO RULES.md` or a rule file was read before the first non-exempt write. That produces the number both lineages say is missing, and it decides between them. This step is orchestrator judgment, derived from the two lineages' shared blocker; neither lineage proposed it in this form (§6).

**The orchestrator's own pre-run recommendation was wrong.** Before this run, the orchestrator recommended adding `.skilled/repo-rules` to `CORPUS_ROOTS`, having missed the recorded decision in `retrieval-conventions.md`. Both lineages found it. That recommendation is withdrawn.

---

## 2. QUESTION AND METHOD

Question: should `system-skill-advisor`, or another surface, support and suggest repo rules from `.skilled/repo-rules/` without adding context the model does not need?

Method: `/deep:research:auto`, fan-out of two `cli-devin` lineages, `swe-2-max` and `deepseek-v4-1-flash-max`, four forced iterations each (`stopPolicy: max-iterations`), run concurrently on 2026-10-04 (12:21 to 12:39 UTC). The brief carried the evidence paths and the open question, not a preferred answer. Both lineages wrote only inside `research/lineages/<label>/`; the runner reported no containment advisory and `git status` showed no change outside the packet.

| Lineage | Iterations | newInfoRatio trend | Stop | Synthesis |
|---|---|---|---|---|
| `swe-2-max` | 4 | 0.92, 0.85, 0.80, 0.55 | `maxIterationsReached` | `lineages/swe-2-max/research.md` |
| `deepseek-v4-1-flash-max` | 4 | 0.90, 0.75, 0.80, 0.70 | `maxIterationsReached` | `lineages/deepseek-v4-1-flash-max/research.md` |

Every iteration record carries `target_agent: deep-research` and `agent_definition_loaded: true`.

---

## 3. WHAT ALREADY COVERS THE GROUND

The coverage the question asks about is mostly a designed partition, not a gap.

- **Action-fired rules** load through Gate 5's trigger table on the first write (`AGENTS.md:93-101`, `REPO RULES.md:12`).
- **Reply-fired rules**, the four communication rules and answer-the-actual-request, are named in the always-loaded document because "These five fire on a reply rather than on a write, so Gate 5 never reaches them" (`AGENTS.md:261`). The packet's own problem statement understated this: read-only turns are not uncovered for these five.
- **Binding clauses of the reasoning rules** are resident: the Verification Standards "bind unconditionally, including on a read-only turn where Gate 5 never fires" (`AGENTS.md` §4).

What remains genuinely uncovered: the expanded text of roughly four reasoning rules (uncertainty, evidence, root-cause, delegation) on purely read-only turns, and any action later in a long session that needs a rule the first-write match did not load. Neither has a measured failure rate.

---

## 4. THE CANDIDATES

**(a) Advisor brief pointer.** Emits a constant line beside the comment-hygiene directive at three render sites (`render.ts:441`, `:449`, `:486`), plus the OpenCode plugin mirror. Silence: never self-silent; the directive lifecycle suppresses the whole Directives block after proven delivery and re-delivers at boundaries (`directive-lifecycle.ts:121-180`). Cost, measured by `deepseek-v4-1-flash-max`: about 162 bytes, roughly 40 tokens, on full-delivery turns; zero on deduped turns. Matching: none. **Refused** by both lineages.

**(b) `.skilled/repo-rules` in `CORPUS_ROOTS`.** Emits lookup rows that the model then reads (rule files are 5.6 to 11.8 KB). Silence: exit 1 on no vocabulary hit. Cost: about +0.76% phrases and +0.10% paths on the committed index. Simulated hits were good when vocabulary overlapped ("force push" to blast-radius at 0.880). Matching: prompt topic. Portability: the sibling repository's three local rules stay uncovered, and root `repo-rules/` as a corpus root would break the sibling through the outside-repo symlink refusal (`corpus.mjs:307-310`). **Refused** by both lineages, on the recorded decision.

**(c) Action-keyed PreToolUse advisory.** Emits `additionalContext` on a matched tool call. The delivery machinery exists in production: `spec-gate-core.mjs` delivers a Gate 3 notice once per session and records it (`gate3DeliveryMarker`, line 364; `recordGate3NoticeDelivered`, line 429). Matching: action, the router's own key. Limit: most trigger rows fire inside reasoning or prose, not at a tool boundary. By the orchestrator's own count of `REPO RULES.md` §2, three rows are cleanly tool-observable (blast-radius, delegation, skill-hub-routing) and two partially (overengineering on a new file, scope on an out-of-scope path); `swe-2-max` put it at no more than four of thirteen.

**(d) No new surface.** Emits nothing. Stands on the partition in §3.

---

## 5. WHERE THE LINEAGES DISAGREE

They agree on (a) and (b). They split on (c), and the split is about evidence, not taste.

- **`deepseek-v4-1-flash-max` recommends building (c) now**, smallest version: a classifier from tool-call signatures to trigger rows, deliver once per session per row, kill switch, and telemetry so 022's frequency rule can be applied after the build. Its case: (c) is the only candidate that matches the router's key and the only one that reaches later-in-session actions.
- **`swe-2-max` admits only a strong form of (c) and blocks even that on evidence**: one line at the first non-exempt mutation of a session telling the model to match its action against `REPO RULES.md`, which is Gate 5 given the mechanical backstop other hard gates have. It refuses the per-action classifier because most rules are invisible at the tool boundary and the riskiest commands are already guarded (`git-preflight`, `git-message-gate`, `dispatch-preflight-lint`). It will not recommend building without a measured Gate 5 miss rate.

**Why they split:** `deepseek-v4-1-flash-max` treats structural fit as sufficient and measures after building; `swe-2-max` applies 022's measurement rule before building. The repository's own recorded rule sides with measuring first (`decisions.md:33-36`): 022's strongest candidate died when its log showed about eight fires a minute where rarity had been assumed. That is why §1 recommends the logging-only observer: it supplies the measurement without spending any context.

---

## 6. RANKED RECOMMENDATIONS

1. **Do not add an advisor pointer or a trigger-index root.** Both lineages, both refusals backed by recorded decisions. Revisit (a) only if a hook-capable runtime is observed without `AGENTS.md` in context; revisit (b) only with a measured topic-keyed miss and an explicit operator decision to overturn the recorded exclusion.
2. **Measure Gate 5 misses with a logging-only observer.** Seat it beside `spec-gate-enforce` on the `Write|Edit` matcher, emit nothing to the model, and log per session whether `REPO RULES.md` or a rule file was read before the first non-exempt write. Orchestrator judgment, derived from the shared blocker in §5. It costs zero context and its log decides item 3.
3. **Build the strong-form (c) only if item 2 shows misses.** One `additionalContext` line per session at the first non-exempt mutation, cloned from the Gate 3 delivery marker. Keep the per-action classifier refused unless the strong form proves insufficient.
4. **Add a trigger-row coverage check to the corpus checker.** `check-repo-rules.cjs` runs nine checks and all pass today, but none compares a trigger row's "You are about to…" text against its rule's Fires-when list (`checkWiring`, lines 261-291, checks only that each rule has a resolving row). Five rows silently dropping fires happened once before (010, ranked item 2). This is the authoring-time fix `swe-2-max` named, and it needs no model-facing surface. `swe-2-max` described the checker as "counts and link resolution only", which understates it; the gap it named is real.

---

## 7. ELIMINATED ALTERNATIVES

| Approach | Reason eliminated | Evidence |
|---|---|---|
| Constant repo-rules directive in the advisor brief | Restates resident content; no enforcing gate; fails the 022 bar | `injection-contract.md:54`; 022 `implementation-summary.md` |
| `.skilled/repo-rules` as a trigger-index root | Reverses a recorded, test-enforced decision; topic-matched | `retrieval-conventions.md` §9; `retrieval-coverage-parity.vitest.ts` |
| Rules indexed but rendered as Gate 5 loads | Still topic-matched; reopen only if Gate 1 gains an action channel | `swe-2-max` iteration 3 |
| Advisor-scored rule recommendations | Scorer kinds are skill and command only; mixes the routing and rule layers | `scorer/types.ts:47`; `REPO RULES.md` §4 |
| Per-action PreToolUse classifier now | Most rules not tool-observable; riskiest commands already guarded; unmeasured need | `REPO RULES.md` §2; `swe-2-max` iteration 4 |
| Root `repo-rules/` as a corpus root | Outside-repo symlink refusal breaks the sibling checkout | `corpus.mjs:307-310` |

## Divergence Map

No divergent-mode pivots were taken (`convergenceMode: default`). Saturated directions: (a) and (b), both refused by both lineages with recorded-decision evidence. Remaining frontier: the Gate 5 miss rate, unmeasured, which decides (c).

---

## 8. OPEN QUESTIONS

- What is the real Gate 5 miss rate in sessions that write? No log exists today; recommendation 2 produces one.
- Do the sibling repository's three local rules need any surface? Out of scope; the shared corpus was the subject.
- Is `answer-the-actual-request.md` missing from the sibling a propagation defect? Recorded by `deepseek-v4-1-flash-max`; belongs to the rule-authoring flow.

---

## 9. CITATION CHECK

The orchestrator opened these against the working tree on 2026-10-04 rather than quoting the lineages:

| Claim | Result |
|---|---|
| Trigger index excludes `.skilled/repo-rules` by recorded decision, test-enforced | Confirmed, `retrieval-conventions.md` §9 root coverage table and its parity-test sentence |
| `AGENTS.md:261` names the five reply-fired rules | Confirmed |
| 022 measurement rule | Confirmed, `decisions.md:33-36` |
| Scorer kinds are skill and command only | Confirmed, `scorer/types.ts:47` and `:156` |
| Gate 3 once-per-session delivery marker exists | Confirmed, `spec-gate-core.mjs:364` and `:429` (lineage cited 376-444; functions start at 364 and 429) |
| Spec-gate warning rate about 1 to 33 a day | Approximately: `.skilled/skills/.state/spec-gate/spec-gate-warnings.log` shows 2 to 53 dated entries a day over 2026-09-27 to 2026-10-04 |
| Corpus checker checks only counts and links | Corrected: nine checks, all passing; none compares a trigger row with its Fires-when list |

Not checked by the orchestrator: the byte and index-growth measurements, the scorer simulation, and the sibling-repository listings. They are lineage measurements and are labelled as such above.

---

## 10. REFERENCES

- `lineages/swe-2-max/research.md` and `lineages/deepseek-v4-1-flash-max/research.md`, with their `iterations/` and `deltas/`.
- `findings-registry.json` (merged, 77 findings) and `fanout-attribution.md`.
- `resource-map.md`.

## Convergence Report

- Stop reason: maxIterationsReached (both lineages, forced cap)
- Total iterations: 8 (4 per lineage)
- Questions answered: 3 / 3 packet open questions answered or bounded
- Remaining questions: the Gate 5 miss rate, bounded as unmeasured
- Convergence threshold: 0.05, telemetry only under `stopPolicy: max-iterations`
- Divergence summary: no divergent pivots recorded

<!-- /ANCHOR:deep-research-repo-rule-advisor-surfacing -->
