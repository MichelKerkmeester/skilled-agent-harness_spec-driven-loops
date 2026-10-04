---
title: "Research: repo rule concision and loading"
description: "Four steered lineages, 12 forced iterations, on writing the repo rules shorter without losing what binds, why loaded rules are ignored, and how AGENTS.md, Gate 5 or a hook should load them. Verdict: loading more text is not the fix, card-only loading is unsafe, and every candidate change needs a measured pilot first."
trigger_phrases:
  - "repo rule concision research"
  - "why are repo rules ignored"
  - "card plus self-check loading"
  - "once per compaction rule hook"
  - "agents md truncation devin"
importance_tier: "important"
contextType: "research"
---

# Research: repo rule concision and loading

<!-- ANCHOR:deep-research-rule-concision-and-loading -->

## 1. VERDICT

**Loading more rule text is not the fix. The measurements show reading a rule moves one prohibition and leaves the rest unchanged, so the bottleneck is binding, not delivery volume. Shorten the rules where the cut is apparatus, never load a card without its self-check, fix the Devin truncation now, and pilot every loading change against the current text before rolling it out.**

- **Full load.** Everything at once (AGENTS.md, router, 13 rules) is about 146 KB, about 37k tokens per compaction window. It is affordable in a 200k window but buys nothing measured: the table rate after a read is the same as before it, and it does not decay with distance from the read (`prep/evidence-pack.md` §3). Prompt caching lowers cost, not context occupied (luna-advocate §6).
- **Why rules are ignored.** The data cannot say. The semicolon ban roughly halves after a read (37.0% to 17.0%). The table ban does not move (17.4% before, 20.3% after), even one to three replies after the read. Five causes stay open: competing defaults, volume, placement, wording, and no mechanical check. One structural cause is confirmed: Devin cuts AGENTS.md at 16,384 B, so the §8 load line for the reply rules never reaches Devin sessions.
- **Concision.** Only 54% of the corpus is rule statement. The rest is frontmatter, headers, restatement, justification tails and provenance. A cut of about 20% to 28% keeps every norm (26.8k to about 19k to 21k tokens). Two measured drafts prove it: `communication.md` down 27.8% with about 145 B of edge clauses lost, `evidence-and-proof.md` down 11.5% with nothing lost.
- **Cards.** A plain card (Fires when plus The rule) drops every operative prohibition in 6 of 13 files, including the one ban with a measured effect. Card plus self-check keeps each norm in checklist form: 18,699 B for all 13 rules, 17% of the corpus, about 4.7k tokens. That is the only compressed load worth testing.
- **Loading design.** AGENTS.md keeps binding clauses and one pointer line per rule family, inside the smallest runtime cap. Gate 5 stays action-keyed. A card-plus-self-check load with the full file on demand is the candidate change, cutting a load event by about 70% to 80%, and it ships only after a randomized pilot.
- **Hook.** None now. If a measured miss rate justifies one, it rides the directive-lifecycle window model and resets on compaction. It needs two extensions the machinery lacks: a per-rule delivered set, and suppression on runtimes without a transcript, where the current code delivers in full every turn.
- **Mechanical enforcement.** No documented Claude Code hook rewrites a reply before the operator sees it. Stop can block and make the model continue. The repository's own Stop hook is asynchronous and advisory, so it is not a linter.

---

## 2. QUESTION AND METHOD

The operator's question: can the rules be written shorter without losing what enforces them, how should AGENTS.md and Gate 5 load them without poisoning context, is the full token load acceptable, why do sessions disregard the communication rules, and can a hook deliver a rule at most once per compaction window.

The orchestrator measured first and handed every lineage the same evidence pack (`prep/evidence-pack.md`, script `prep/measure-rule-compliance.py`, aggregates only). Each lineage took one angle, read its own `steer.md` before every iteration, and ran to a forced cap (`stopPolicy: max-iterations`).

| Lineage | Executor | Iterations | Angle |
|---|---|---|---|
| `deepseek-v4-1-flash-max` | cli-devin | 4 | Loading design: AGENTS.md, Gate 5, hook |
| `swe-2-max` | cli-devin | 3 | Concision: which sentences change behaviour |
| `luna-compliance` | cli-codex `gpt-6-luna`, max, fast | 3 | Why loaded rules are ignored |
| `luna-advocate` | cli-codex `gpt-6-luna`, max, fast | 2 | Devil's advocate and full-load cost |

Planned deviation: the GLM 5.3 Flash lineage was replaced. The llmgateway route rejected every request ("The request was rejected as invalid") at low and max thinking and through a direct call. The operator chose a second Luna lineage on cli-codex, which took GLM's compliance angle and its three iterations. Both Luna lineages are the same model family, and luna-advocate read the other lineages' output by design, so they are not independent confirmations of each other.

The orchestrator steered between iterations: a runtime-cap question and the per-window fire counts went to DeepSeek, the card-plus-self-check variant to SWE, and a list of seven claims to attack went to luna-advocate.

---

## 3. WHAT THE MEASUREMENTS SHOW

### Token load

| Surface | Bytes | Tokens (about 4 B each) |
|---|---:|---:|
| `AGENTS.md`, always loaded | 27,012 | 6.8k |
| `REPO RULES.md`, at Gate 5 | 11,853 | 3.0k |
| All 13 rules | 107,092 | 26.8k |
| Five reply-time rules (§8) | 42,811 | 10.7k |
| Everything at once | about 146 KB | about 37k |
| All 13 as card plus self-check | 18,699 | 4.7k |
| Five reply-time rules as card plus self-check | 7,453 | 1.9k |

Rules actually loaded: 93 of 265 compaction windows read any rule. Those windows read 3.5 distinct rules on average (median 3, p90 7, max 11). Sessions almost never re-read a rule inside one window (1 case) and re-read after compaction 104 times, so the existing behaviour is already close to once per window.

### Compliance

Long replies in 44 sessions since 2026-09-15, split by whether the governing rule was read earlier in the session.

| Check | Before read | After read | Never read |
|---|---|---|---|
| Table in a reply | 17.4% of 219 | 20.3% of 1,063 | 11.6% of 86 |
| Semicolon in prose | 37.0% of 138 | 17.0% of 1,015 | 43.7% of 215 |
| Em dash in prose | 2.2% | 4.5% | 6.5% |
| Empty opener | 0% | 0% | 0% |
| Label as first line | 2.3% to 2.7% | same | same |

These are observational cohorts with pattern detectors. A table inside a requested document counts as a hit. The table result is best stated as no measurable association between reading the rule and fewer tables, not as proof the rule has no effect (luna-advocate, claim 4).

### Runtime caps on the instruction file

| Runtime | Cap | Source |
|---|---|---|
| Claude Code | None, loaded in full | code.claude.com/docs/en/memory; observed whole in this session |
| Codex | 32,768 B default (`project_doc_max_bytes`), cumulative, silent | developers.openai.com/codex/guides/agents-md; codex binary constant |
| Devin | 16,384 B observed; cut ends mid-line 175 of `AGENTS.md` | Observed in this packet's Devin runs |
| OpenCode | No byte guard, whole file each loop | opencode.ai/v2/docs/instructions |
| Cursor | UNKNOWN, advisory 500 lines | cursor.com/docs/rules.md |
| Pi | UNKNOWN | earendil-works/pi usage.md |

The Devin cut keeps §1 to most of §4 and drops §5 to §10, including the §8 reply-rule load line (`AGENTS.md:261`) and the §10 mandates. Codex's cap cuts later, around line 250 to 260 by arithmetic, not measured.

---

## 4. CONCISION PLAYBOOK

Source: swe-2-max, with a deterministic part classifier that sums exactly to 107,092 B.

| Part | Bytes | Share | Keep? |
|---|---:|---:|---|
| Rule statement | 57,847 | 54.0% | Keep the imperatives, tests and exceptions. Cut justification tails |
| Self-check | 10,941 | 10.2% | Keep. It is the corpus's own compressed restatement of each norm |
| Frontmatter | 10,246 | 9.6% | Move `trigger_phrases` (about 6,800 B) to a sidecar |
| Header | 7,732 | 7.2% | Collapse shared boilerplate (about 2,400 B) |
| Failure it prevents | 5,909 | 5.5% | UNKNOWN whether it aids compliance. Drafts drop it, so they are the test |
| Fires when | 4,414 | 4.1% | Keep. It is the load decision |
| Cross-references | 3,589 | 3.4% | Dedupe repeated pointers |
| What this is not | 3,353 | 3.1% | Keep only the clauses that block a real misreading |
| Rationale | 1,749 | 1.6% | Cut |
| Examples | 1,312 | 1.2% | Keep the few that pin an edge case |

The floor tracks rule-statement share. Dense files (60% or more normative, such as `root-cause-and-debugging.md` at 65%) bottom out near a 10% to 15% cut. Apparatus-heavy files (`communication.md` at 43%) reach 25% to 33%.

What each draft keeps and drops (REQ-003):

- `drafts/communication.md`, 11,458 to 8,279 B. Keeps every ban and test. Drops three edge clauses, about 145 B: paragraph-as-step, a count line is not an item, and the reader decides. Drops all failure-naming sentences. Ledger: `drafts/communication.ledger.md`.
- `drafts/evidence-and-proof.md`, 11,823 to 10,465 B. Keeps every receipt and command test. Drops restatement only. Ledger: `drafts/evidence-and-proof.ledger.md`.

Per rule, card plus self-check (Fires when, The rule, and the SELF-CHECK section, no frontmatter), measured by the orchestrator:

| Rule | Full | Card plus self-check | Share |
|---|---:|---:|---:|
| answer-the-actual-request | 5,644 | 1,020 | 18% |
| blast-radius | 7,154 | 1,134 | 16% |
| communication-decisions | 8,024 | 1,425 | 18% |
| communication-handoff | 10,803 | 1,624 | 15% |
| communication-prose | 6,882 | 1,130 | 16% |
| communication | 11,458 | 2,254 | 20% |
| delegation-and-orchestration | 11,712 | 1,911 | 16% |
| evidence-and-proof | 11,823 | 1,677 | 14% |
| prevent-overengineering | 7,374 | 1,525 | 21% |
| root-cause-and-debugging | 6,591 | 1,377 | 21% |
| scope-discipline | 6,725 | 1,209 | 18% |
| skill-hub-routing | 6,573 | 1,276 | 19% |
| uncertainty-and-honesty | 6,329 | 1,137 | 18% |
| **Total** | **107,092** | **18,699** | **17%** |

The self-checks carry the measured bans in short form: `communication-prose.md:159` "No em dash, no semicolon, no serial comma." and `communication.md:247` "...no table stands in a reply." The self-check keeps a norm's shape, not always its content: the blast-radius tier table and the uncertainty never-invent list live only in the body (swe-2-max, iteration 3).

---

## 5. LOADING DESIGN

| Option | Per-window cost | Verdict |
|---|---|---|
| 1. Status quo: Gate 5 loads full matched files | About 6.2k (median 3 rules) to 14.4k (p90 7) | Keep as the baseline arm |
| 2. Cards resident in AGENTS.md | Adds 2.5k to 17.9k B to every session | Rejected for all 13. It breaks the Codex cap. See open question 3 for the reply five only |
| 3. Gate 5 loads card plus self-check, full text on demand | About 70% to 80% less per load event | The candidate. Pilot against option 1 |
| 4. Hook delivers cards once per window | About 820 to 1,560 tokens in loading windows | Deferred until a miss rate is measured |
| 5. Load everything | About 36.5k per load | Rejected. No measured benefit |

**What AGENTS.md must carry.** The four laws, PLAN-WORKFLOW LOCK, comment hygiene, the gates, the verification standards and the §8 load line with its two always-binding clauses, all inside the first 16,384 B. Today the §8 line sits at line 261 and the §10 mandates at 281 and 285, past the Devin cut. Move them up or compress what sits above them. This fix needs no pilot. It repairs a delivery gap that is measured, not a behaviour that is guessed.

**What Gate 5 loads.** The router, then the matched rules. The candidate replaces each full file with its card plus self-check and opens the full file when the card does not settle the case. Keep the action key and the silence when nothing matches (`REPO RULES.md:12,18`).

**Where the reply rules fall through.** Gate 5 fires on the first write, so a read-only session never reaches it, and the §8 load line is the only route for the five reply rules. In 82 sessions `answer-the-actual-request.md` was read 4 times. Nothing checks that §8 ran. This is the gap the operator sees, and none of the lineages measured how often a session needed a reply rule and missed it.

---

## 6. THE HOOK, IF EVER BUILT (REQ-004)

- **Marker.** The directive-lifecycle receipt (`directive-lifecycle.ts:121-140`, store `evaluate`). The spec-gate once-per-session marker (`spec-gate-core.mjs:364`, `:429`) is the naming precedent only. It resets per session, not per compaction.
- **Reset event.** The compaction boundary, detected three ways: boundary events from session-prime, Devin post-compaction, Cursor precompact and Codex session-start; transcript shrink; and the durable epoch advance (`advanceDirectiveLifecycleBoundary`, `directive-lifecycle.ts:183`).
- **Gap 1, per-rule dedup.** Suppression keys on whole-payload equality. A rule delivered once and a different rule set later would both deliver in full. The hook needs a delivered-set key per rule.
- **Gap 2, transcript-less runtimes.** Without a valid transcript the decision returns full delivery (`directive-lifecycle.ts:133-135`). On those runtimes a hook would inject every turn, which breaks the once-per-window constraint. It needs an epoch-only suppression path.
- **Precondition.** A measured Gate 5 miss rate from the logging-only observer that `001-advisor-surfacing` recommended. The 104 post-compaction re-reads are not misses (luna-advocate, claim 3).

---

## 7. WHERE THE LINEAGES DISAGREE (REQ-005)

**Cards.** DeepSeek recommends Gate 5 load cards for a 70% to 80% cut. SWE's card test shows a plain card drops the operative bans in 6 of 13 files. Both are right about their own object: DeepSeek measured bytes, SWE measured content. Card plus self-check reconciles them on content at 17% of the corpus. No lineage measured behaviour under any card, so the reconciliation is structural only.

**Short rules bind better.** SWE reads the semicolon result as evidence that a short imperative works. luna-advocate refutes this as a causal claim: two different prohibitions in non-randomized cohorts cannot separate wording from everything else. Verdict: a hypothesis worth a same-rule wording test, not a writing law.

**MessageDisplay.** luna-compliance says a MessageDisplay hook can replace the visible text while leaving the transcript unchanged. A separate check against the Claude Code hook docs in this session found the event exists but text replacement is not documented. Status: UNKNOWN until a live probe. Either way it changes only what the operator sees, not what the model does.

**luna-advocate's verdicts on the seven claims it was steered to attack.**

| Claim | Verdict |
|---|---|
| 1. Cards need no measurement | Weakened |
| 2. The AGENTS.md pointer design works | Weakened. 4 reads in 82 sessions has no eligible-action denominator |
| 3. No hook now | Stands |
| 4. Reading the rule does not reduce tables | Weakened. Restate as no measurable association |
| 5. Short rules bind better | Refuted as causal |
| 6. Card-only loading is safe | Refuted |
| 7. A reply linter can enforce the bans | Weakened. The existing Stop hook is async and advisory |

---

## 8. RANKED RECOMMENDATIONS

1. **Move the load-bearing AGENTS.md clauses inside 16,384 B.** The §8 load line and the §10 mandates first. Measured gap, no pilot needed. Verify by checking the byte offset of each clause.
2. **Instrument before changing behaviour.** Log, outside model context, each session's runtime, task category, rule delivery receipt (read or injected) and eligible actions. Without this, no later comparison can be read. It also gives the Gate 5 miss rate the hook decision needs.
3. **Run a same-rule wording test on the table ban.** Hold path and trigger fixed, randomize the current 612 B block (`communication.md:91-99`) against a 152 B imperative that keeps the in-flight exception. Add task-type review so requested-document tables do not count.
4. **Pilot card plus self-check at Gate 5** against full files on matched tasks across all 13 rules. Measure fallback frequency, obligation-level violations and actual tokens.
5. **Apply the concision cuts** that remove apparatus only (boilerplate, restatement, rationale, provenance, `trigger_phrases` to a sidecar). Each rewrite carries a keep/drop ledger like the two drafts.
6. **Add the trigger-row versus Fires-when coverage check** to `check-repo-rules.cjs`, carried over from `001-advisor-surfacing`.

---

## 9. ELIMINATED ALTERNATIVES

| Approach | Reason eliminated | Evidence |
|---|---|---|
| Load all 13 rules every window | About 37k tokens with no measured benefit. Table rate unchanged after a read | §3; evidence pack §3 |
| Card-only loading | Drops the operative bans in 6 of 13 files | swe-2-max iteration 2 |
| Resident cards for all 13 in AGENTS.md | Pushes AGENTS.md past Codex's 32,768 B cap | §3 caps; DeepSeek option 2 |
| Re-injecting a rule within a window | No decay with distance from the read, so repetition has no target | evidence pack §3 |
| Prompt caching as the affordability answer | Lowers cost, frees no context | luna-advocate §6 |
| Using the existing Stop hook as a linter | Async and advisory, never blocks or rewrites | `completion-evidence-stop.cjs:132-139` |
| A hook built from read counts alone | Re-reads after compaction are not misses | luna-advocate claim 3 |

---

## Divergence Map

| Direction | State | Frontier |
|---|---|---|
| Full files versus card plus self-check | Structurally reconciled, behaviour untested | Recommendation 4 |
| Short versus long wording | Hypothesis only | Recommendation 3 |
| Hook versus no hook | No hook, measure first | Recommendation 2 |
| Display filter versus model behaviour | MessageDisplay replacement UNKNOWN | Live probe |
| Pointer reliability across runtimes | Devin gap confirmed, Cursor and Pi UNKNOWN | Recommendation 1, then probes |

---

## 10. OPEN QUESTIONS

1. Why the table ban fails while the semicolon ban partly works. Candidates: the runtime's Markdown habit, the ban's placement in a mid-conversation tool result, its wording, or the lack of any check. Only a randomized test separates them.
2. How often a session needs a reply rule and does not have it. No log exists.
3. Should the five reply rules' card plus self-check (7,453 B) sit resident in AGENTS.md §8, so they no longer depend on a read that rarely happens? This is orchestrator judgment, not tested by any lineage. It needs AGENTS.md trimmed first to stay under Codex's cap, and it belongs in the recommendation 4 pilot as a third arm.
4. Whether failure-naming sentences help compliance. The drafts drop them and are the test.
5. Cursor's and Pi's instruction-file caps, and whether runtimes outside Claude Code pass a transcript path to hooks.

---

## 11. CITATION CHECK

Verified by the orchestrator against the working tree on 2026-10-04:

- `communication-prose.md:159` and `communication.md:247`: the self-check lines quoted in §4.
- `communication.md:91-99`: the table block luna-compliance measured at 612 B.
- `AGENTS.md`: 285 lines, the first 16,384 B end at line 174 to 175, and §8 starts at line 259.
- `spec-gate-core.mjs:364` `gate3DeliveryMarker` and `:429` `recordGate3NoticeDelivered`, under `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/`.
- `directive-lifecycle.ts:121-140`: no transcript returns full delivery. `:183`: `advanceDirectiveLifecycleBoundary`.
- The card-plus-self-check table: recomputed by script from the 13 files, total 18,699 B.
- A path check for the misspelled packet name `016-repo-advisor-surfacing` across all lineage outputs found no occurrences.

Not verified first-hand: external runtime docs (cited by URL, treated as data), and the Devin 16,384 B cap outside this packet's Devin runs.

Route proof: the two Devin lineages wrote `target_agent`, `resolved_route`, `agent_definition_loaded` and `mode` on each iteration record. The two codex lineages wrote iteration records without those fields. Their iteration files and syntheses are on disk, but route proof is incomplete for them. This is a gap in the cli-codex fan-out path, not in the research content.

Containment: the runner attributed a `.pi/settings.json` change (an added `deviceId`) to luna-advocate. Its logs show no pi command, and another session was active in this checkout at the time. The attribution is most likely wrong (inferred). The file was left untouched.

---

## 12. REFERENCES

- Lineage syntheses: `lineages/<label>/research.md` for each of the four labels.
- Drafts and ledgers: `lineages/swe-2-max/drafts/`.
- Evidence: `../prep/evidence-pack.md`, `../prep/measure-rule-compliance.py`.
- Merge outputs: `deep-research-findings-registry.json` (55 key findings), `fanout-attribution.md`, `resource-map.md`.
- Prior packet: `../../001-advisor-surfacing/research/research.md`.

---

## Convergence Report

- Stop reason: `maxIterationsReached` on all four lineages. Convergence was telemetry only.
- Iterations: DeepSeek 4, SWE 3, luna-compliance 3, luna-advocate 2. Total 12, as planned.
- Novelty stayed high to the end: SWE 0.92 to 0.80, DeepSeek 0.85 to 0.70. No lineage saturated its angle.
- Steering: DeepSeek iteration 4 ran against the revised steer and answered the runtime-cap question. SWE iteration 3 started before the card-plus-self-check steer landed, so the orchestrator measured that table itself (§4).

<!-- /ANCHOR:deep-research-rule-concision-and-loading -->
