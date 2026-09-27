# Iteration 003 — glm-03: Against context-reduction features

- **Lineage:** `glm` · session `fanout-glm-1790490452777-942a1f` · 2026-09-27
- **Wave:** W2 (cross-read, then push past) · **Maps to:** C · **Timestamp (research):** 2026-09-27T07:01:30Z

## Focus

Angle `glm-03` (research-angles.md:534-544): run every question-C proposal through the fitness checklist (Q1-Q15 + the red flags, digest:52-109); separate counts from estimates; name the below-threshold kills and the threshold; find the cheaper fixes without a model; name the ONE proposal that survives. Refinement (research-angles.md:898): where a named sibling angle has not landed, critique the newest landed file on that question plus BASE2 and Planned phases 002/003/005/006, recording which targets were missing.

## STEER

Still no `steer.md` in this lineage (verified this iteration). No refinement conflict: the `glm-03, glm-04` row binds where named targets are missing — recorded in the Sibling check.

## Sibling check (every named file; missing targets recorded)

- `mimo/iterations/iteration-002.md` (newest; their angle = D, but its Part 0 is the C-DECISIVE recount) — their steer **voided their it.1's Q2-Q4 counts** (a dedupe-by-message defect) and they re-counted: Reads 1,984 main (not 342); Bash 58,109 (not 12,172); tool calls/prompt p50 2, p95 40, sum 60,130; subagents: 1,003 files, p50 32 calls/prompt, 6,937 reads; **re-reads 598/1,984 = 30.1% main, 1,168/6,937 = 16.8% subagent** (my it.2-cited 8.5%: retired); SKILL.md reads 3,175 (load-command subset 2,451), references 2,557 (2,017), **ROUTER.md 369** (my it.2-cited "0 reads": retired to "never via the Read tool" — 369 arrive by other mechanisms, ~9.2/day); hook-injected `additionalContext` = 12,152,899 B/19,588 events main + 2,290,457/709 sub = **14.4 MB/40d ≈ 361 KB/day** ("hook-injected context is unmeasurable": refuted); `hook_success` attachments 546.2 MB more (`r2:60,123`; the bucket-relationship of that 546.2 MB to it.1's 463 MB attachment total is their notation's todefine — cited as theirs, marked). Their own "new" rows at :158 confirm the corrections.
- `swe/iterations/iteration-003.md` (newest on question C; W1, independent) — the three-stage trace: stage 0 = trigger-index (cap 20, exits 0/1/2); stage 1 = compiled route when authoritative (tri-state flag, manifest `servingAuthority`, `effectivePolicyHash`+`generation` identity binding, error → the `{"servingAuthority":"legacy"}` sentinel → prose fallback); stage 2 = **leaf pick executed by the model, re-reading and re-scoring "1,641 lines of prose across six files"** (their six=1,572 + cli-jev's 69; the six = 1,572 = 617+411+115+160+119+150, matching mimo-001's line-counts) — "the compiled router does not reach stage 2" (`compiled-route.cjs:87-107` returns mode/surface targets only). The replay-source clause, their :38: sk-doc's machine block is "the byte-for-byte source the deterministic router-replay parses" (`sk-doc/ROUTER.md:145-152`).
- `swe/iterations/iteration-004.md` (newest; their C verdict) — the top reduction seam **counted**: compaction keep-or-drop, 212+14=226 `compact_boundary` records, sessions compacting at preTokens ≥ 450,019, "p50 wait ≈ 104 s per boundary" (citing `005.../spec.md:60`); their table ranks it "two orders of magnitude" over leaf routing (their ~3-4k tokens/route: **their estimate, marked**) and tool-output pruning (mimo's 28.6%); the slice = "the deletion arm that 005's stop line gates — an amendment to phase 005, not a new phase." Their sibling table cites MY it.001 (the 0.68/flip-0.10 gate, "latency flips nothing") — recorded: the cross-read had flowed. Their convergence: "the model never goes live first — it rides an existing offline census as a second arm, behind a printed keep rule."
- `grok/iterations/iteration-003.md` (their C+B owner, targeted) — their MCP conviction N-grok-03-1 (verdict: drop): the schema source-slice = **2,225 bytes** (deem_mcp.py:46-120, counted by slicing the file; the wire size UNKNOWN — "producing it means executing Deem's module"); "MCP is the wrong shape for a context reduction here… the main model has to place `state` in the tool arguments; a hook or a script reads the transcript itself"; the hook = 0 schema bytes. Their rows 44/47/49 re-read: 44's drop rests on cache-invalidation + saved-prune-after-error (README:85/87), not latency/egress — "a local 60 ms call removes the API charge and the egress. It does not remove cache invalidation or a saved prune that survives an error"; 47's missing→0 = a default bug that persists; 49 = a refuse-list, no classifier helps.
- `deepseek/iterations/iteration-008.md` (their C-precompute owner, targeted) — F1: warm = a permanent 3,368 MB, no eviction (operator-owned; the repo evicts its own embedder via `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN`, `model-server-supervision.cjs:224-234`); cold = 10 s → any timely hook skips. F2/F3: the host's `session.compact`/`trigger:"precompute"` dispatch exists in the vendored types (`claude-code.d.ts:3310-3325, :7196-7287`, "kept if the conversation it ran over still leads") but **the repo has no route to it** (command hooks only; function hooks = early access) → their F6: **no live PreCompact command-hook form; the "background precompute pass" (async Stop hook or agent-script, result stored + staleness-guarded) is the only live compaction home**. F5: printed kill criteria — `kill: latency` (measured connect+call p95), `kill: cold <n>%` (skip rate), `kill: accuracy` (loses to the no-model baseline on the seeded labels), `kill: stale cache`.
- `deepseek/iterations/iteration-010.md` (newest; skimmed for their H) — their two-backend amendments to 002/003/005/006; they note "swe-08 has not landed (the SWE lineage is at iteration 2)" — now retired: swe-003/004 exist (my read above). My it.2's A3 one-word amendment isGLM-side; their :92-verse amendments are theirs to reconcile in the synthesis.
- `mimo/iterations/iteration-001.md`, `swe/iterations/iteration-001/002.md`, `grok/iterations/iteration-010.md`, `deepseek/iterations/iteration-005.md` — read in it.2; their counts used here are the RECOUNTED ones from mimo-002 where retired.
- **Missing (named targets not landed, recorded):** mimo-04, swe-04-existed-now(read), grok-03(read), deepseek-04 — **deepseek-04 not re-read this iteration** (my it.2 read their 005; their 004 = the flip-set prose side; their 008+010 cover my C-ground — noted, not contested); mimo-04 remains missing (mimo is at 2). BASE2/Planned-phases check: 002/003/005/006 hub-mention = 0 (it.2 F2, unchanged); the C-relevant Planned state: 005's spec.md:60 problem statement quoted by swe-004 (their cite; not re-opened by me — marked).

## Actions Taken (reads only)

1. Seven sibling files (4 targeted, 2 full, 1 skim), the recount Part 0 above all.
2. My it.2 evidence (validate_skill_package.py, parent-skill-check.cjs, skill-hub-routing.md, 002:85-115) — still in force; nothing here needed re-opening.
3. The digest's Q1-Q15 + red flags (read it.1, unchanged) — the checklist instrument; `.skilled/repo-rules/prevent-overengineering.md`'s operative rule (description, :6) as the tiebreaker.

## Findings

### F1 — The checklist, row by row (answers question 1; maps C, H)

| # | Question-C proposal | Q1: counted? | Frozen contracts | Under the threshold? | Checklist misses | Verdict |
|---|---|---|---|---|---|---|
| 1 | **Compaction keep/drop, offline deletion arm** (swe-004's 005-amendment) | YES: 226 boundaries/40d, preTokens ≥ 450,019, p50 wait ≈ 104 s (their cites; BASE2's 210/222 → K16 drift, noted) | none — offline; PreCompact's 3,000/1,800 ms untouched (deepseek-005 F1, quoted) | NO — 5.6 firings/day × 104 s of user-wait | none | **SURVIVES (the one)** — as an amendment to 005, gated by 005's own stop line |
| 2 | R2 goal-verifier Pi census (003) | YES: 1,457 nudges/28 sessions/253 truncation-branch (BASE2 §1:51-52) | none — zero-call | NO — ~52/session | none | survives **as a census**; its classifier role is question D's (it.4) |
| 3 | Retrieval reranking (the 20-candidate lookup) | NO: no miss/misrank count exists; the post-recount Grep/Glob-0 status = UNKNOWN (it.1's 0 was a Q2-voided count) | YES: exit 0/1/2, the sentinel, the cap — cold-Node synchronous (deepseek-005 F1) | — | Q1, Q8 (whose owner? which counted miss-rate?) | later, behind a counted miss-rate; the harness = the advisor's own parity fixtures, replayed |
| 4 | File relevance (R22, the HVR lens) | YES (ceiling): **30.1% main / 16.8% subagent re-reads** = 1,766+1,168... main 598 + sub 1,168 = 1,766 re-reads/40d ≈ 44/day (recount) | partial: a READ-time filter needs the row-38 output-rewriting capability (BASE1:38: no contract; host capability UNKNOWN) | NO — 44/day clears 1/week | the deepseek-008 cold problem applies to any READ-time judge; the no-rewriting contract | later, behind row-38's contract + the 44/day × bytes split; the cheaper fix (F3) covers most of it |
| 5 | Tool-output pruning (BASE1 row 38) | NO: the decisive bucket — how many of the 186-28.6% bytes are READ-CONTENT — still uncounted (mimo's one-more-bucket method, still not run); the recount's hook-verse: additionalContext 14.4 MB + hook_success 546.2 MB (theirs; bucket-relationship marked) | YES: no output-rewriting contract | — | Q1 | later, behind the one bucket; note the 546.2 MB hook-stdout = the biggest counted untouched STORED surface (a cap/TTL there = no model, F3) |
| 6 | ROUTER-leaf reduction ("skill and resource routing incl. ROUTER leaves") | YES (the recount): **369 ROUTER.md reads/40d ≈ 9.2/day**, each = the model re-reading 617-1,641 lines of prose it must then re-SCORE (swe-003's stage-2) | the machine-blocks are ALREADY machine-parseable: "the byte-for-byte source the deterministic router-replay parses" (sk-doc/ROUTER.md:145-152, swe-003's read) | NO | — | **the cheaper fix wins (F2): a stage-2 deterministic replay — the 0.8B earns nothing here** |
| 7 | Deem-as-MCP tools (grok-03's N-grok-03-1) | YES: 2,225 source bytes; wire = UNKNOWN, honestly | — (an addition, not a change) | 2,225 B + the state-echo, per tools/list | — | **drop — JOINED**, plus the cache-structure argument (F2) |
| 8 | Row-44/47/49 revivals (the 60 ms rounds 1-2 drops) | YES (their re-read): 44 = NOT latency/egress alone (cache-invalidation + persisted prune); 47 = a missing→0 default bug; 49 = a refuse-list | YES: the prompt cache IS the cost structure (F2) | — | — | **none flip** — confirms BASE1's Later with the *reason* now precise: the 60 ms buys the egress/charge halves only (grok-003:36) |

### F2 — The trap: fresh input is ~2 tokens; the prompt cache is the cost structure (maps C, H; the iteration's first headline)

mimo-001's fresh-input p50 = 2 tokens / turn, carried p50 = 384,219 (their res:15-16, recount-pending-but-structured) — 99.999% of input tokens arrive VIA CACHE. Therefore, for question C, "context reduction" reduces **attention + the marginal cache-creation**, not cost — UNLESS the reducer busts the cache, in which case it costs. grok-003 found the mechanism (their :36, README:85/87: "filtering can invalidate your model provider's prompt cache"; "previously saved pruning still applies" after an API error) and hissed at it in one row; it.3 generalizes: **every question-C proposal must be judged cache-neutrally, because the thing it would prune is, from the cost side, nearly free.** The honest unit = "attention-seconds + new cache-creation bytes, with the cache-bust probability stated" — a unit NO proposal in the four lineages reports yet. (Q1-of-the-checklist, applied to the METRIC itself: the/checklists pass, the metric's-unit is still an estimate — the red flag "a usefulness claim without numbers" in its subclass-form: numbers, but of the wrong thing.)

### F3 — The cheaper fixes without a model, counted (answers question 4; maps C, H; the iteration's second headline)

1. **The stage-2 deterministic replay (the ROUTER-leaf fix).** swe-003's own trace supplies it: sk-doc's machine block is "the byte-for-byte source the deterministic router-replay parses" (`sk-doc/ROUTER.md:145-152`), the compiled stage-1 machinery already exists (the tri-state, the manifest, the hash+generation identity binding, the canary fixtures — their :86-125), and it simply "does not reach stage 2" (`compiled-route.cjs:87-107`). Extending it one stage: the SAME prose-authored `INTENT_SIGNALS`+`RESOURCE_MAP` blocks, promoted through the SAME pinning ceremony, scored by the SAME deterministic scorer — **no model, no 60 ms, no pin, no staleness, no calibration** (the entire F4/F1 problem-class of my it.1-2 vanishes where the grammar is already machine-tractable). The counted prize: 369 prose-reads/40d of 617-1,641 lines, the model's re-SCORING attention, and the near-tie behavior becomes a printed, replayable, fixed-`AMBIGUITY_DELTA` decision instead of a fresh judgment call. **N-glm-03-1.**
2. **The hook-verse cap/TTL (the 546.2 MB).** The recount's largest untouched STORED surface is hook-stdout (`hook_success` 546.2 MB/40d, theirs; bucket-relationship to the 463 MB attachment total marked). A retention cap/TTL on stored hook-stdout is a cleaner/retention policy — no model, no hook, no new surface; the additionalContext (the part that is CONTEXT: 361 KB/day) is separately countable and small. **N-glm-03-2's cheaper-fix clause.**
3. **The 44/day re-read prize.** 30.1%/16.8% of 1,984+6,937 reads are re-reads — the cheapest fix is not a classifier but session-note hygiene (a "already-read: path@line-range" ledger the subagent prompt already carries — the mechanics exist in the subagent facts); sized: 44 × (2-6 KB) ≈ 88-264 KB/day of attention — **arithmetic on the recount's counts, marked.** No new surface.

### F4 — The threshold, proposed (answers question 3; maps C, H)

**N-glm-03-2's test.** A question-C surface (hook, file, daemon, skill) earns its existence only when ALL FOUR hold:

1. **≥1% of the p50 carry** (≈ 3,842 of 384,219 tokens) expected off the firing path, counted, not estimated;
2. **≥1 counted firing/week** (the fleet runs 167 prompts/day, theirs; 1/week = the 0.6% rarity floor);
3. **cache-neutral or better** — the expected cache-creation bust, counted, must not exceed the expected saving (F2's unit);
4. **0 new advisor identities and 0 new layers** — an extension of an existing harness (002/005's scripts, the compiled-routing engine) always beats a new file (prevent-overengineering.md:6, the "smallest thing" rule; the digest's Q5/Q6).

Scored: the 005-deletion-arm passes 1-4 (it adds NOTHING — it is an amendment); the stage-2 replay passes (no new surface — the machinery exists); the 44/day ledger passes as subagent-prompt hygiene (no surface); MCP-Deem fails 3-4 (a new tool surface, 2,225 B + state-echo, cache-busting by construction); the READ-time relevance judge fails 3 (cache-bust probability unstated) and 4 (a new hook) until row-38's contract exists.

### F5 — The one that survives (answers question 5)

**The 005 deletion arm** (swe-004's amendment, my full agreement): the only question-C proposal that passes the checklist TODAY with counted numbers, zero new surfaces, and a printed kill; the model's role in it — if any — is decided by question D's printed precision (it.4's assignment), not by this iteration. Everything else in question C: the stage-2 replay (F3.1, cheaper-than-classifier), the hook-verse cap, the read-ledger — then later, behind row-38's contract and the counted miss-rates. **The 0.8B's question-C role, stated negatively: none, yet.** It loses every seam it was proposed for, to determinism that already exists (the replay) or to counts that don't exist yet (rows 3/5). This is the contrarian answer the angle asked for: the strongest surviving C-case is the one where the model is NOT.

## Per-idea records

#### N-glm-03-1 — The stage-2 deterministic replay (the ROUTER-leaf cheaper-fix)

| Field | Value |
|---|---|
| **Idea** | `N-glm-03-1`: extend the compiled-routing machinery one stage deeper — the same pinning ceremony, the same deterministic scorer, over the machine blocks that already claim to be "the byte-for-byte source the deterministic router-replay parses." Type: not a judgment — a replay (noul-class only if a tie must be broken, and the tie-break is a printed rule, not a judgment) |
| **Question** | C (routing/ROUTER-leaves), H (the cheaper fix) |
| **Builds on** | swe-003's three-stage trace (their stage-2 finding); sk-doc/ROUTER.md:145-152 (the replay-source clause); the compiled stage-1's own machinery (`resolve.cjs:59-125`, `compiled-route.cjs:55-108`, the canary fixtures — their reads, quoted); the recount's 369/40d |
| **Value** | The main AI stops re-reading and re-scoring 617-1,641 lines of prose ~9.2×/day; near-ties become printed, replayable decisions (`AMBIGUITY_DELTA` = 1, enforced, not remembered) |
| **Seam** | The stage-2 boundary: `compiled-route.cjs:87-107` (targets = mode/surface today) → the leaf-identity contract `leaf-resource-contract.cjs` (swe-003's read: the `(workflowMode, leafResourceId)` pair) — the extension point their own trace names |
| **Metric, baseline, harness** | Agreement of replay-vs-model leaf picks on theExisting canary fixtures + the playbooks' `expected_leaf_resources` (their it.3 Actions: the seven canary-case files + the playbook greps — the gold EXISTS, theirs); baseline: the model's stage-2 record (369/40d, the recount); harness: the replay runner + the existing fixture admission (`validate-compiled-routing-scenarios.cjs:1-50`, their read) |
| **Savings** | Attention: ~9.2 × (617-1,641 lines)/day ≈ the sk-code+sk-doc prose — **bytes counted, tokens-converted arithmetic, marked**; cache-creation: those reads become hash-pinned replays (cache-STABLE — F2's trap, passed); 0.8B: 0 calls |
| **Cost, latency, privacy** | 0 model calls; +1 policy-snapshot stage in the existing engine; nothing leaves the machine |
| **Two-backend gate** | No backend: the replay IS the no-backend behavior (deterministic, no jel/Deem); with a backend, nothing changes — it does not consult one. Malformed machine-block: the prose fallback stands (the stage-1 pattern: their :151-152 sentinel) |
| **Rough LOC** | The engine extension ≈ 100-200 (the snapshot+scoring pattern exists at stage 1); the 6 policy snapshots ≈ 0 new LOC (the machine blocks exist; the ceremony: promotion + canary cases). Estimates, marked — the engine's internals are 014-runtime-engine's, theirs-quoted |
| **Verdict** | **build-now (as the C-answer)** — the cheaper fix that makes the question-C classifier unnecessary on its biggest counted seam (Q4's clause: which cheaper fix gets most of the saving) |
| **Confidence** | Confirmed: the 369 count (the recount), the machine-block contract (swe-003's quote of :145-152), the stage-1 machinery's existence (their reads). Inferred: the 100-200 LOC — what confirms: the 014-runtime-engine's own extension point, that phase's business; and that the replay would agree with the model ≥ the printed threshold — the canary fixtures decide, not this research |

#### N-glm-03-2 — The question-C threshold + the hook-verse retention cap

| Field | Value |
|---|---|
| **Idea** | `N-glm-03-2`: (a) the four-part threshold (F4) adopted as the checklist's quantitative gate for EVERY question-C proposal, including the model's; (b) the cheapest counted fix nobody owns: a retention cap/TTL on stored hook-stdout (the 546.2 MB/40d). Type: (a) = a rule; (b) = a retention policy (`choice`: keep/drop, but deterministic) |
| **Question** | C, H |
| **Builds on** | mimo-002's recount (the 546.2 MB, their r2:60,123; the 14.4 MB additionalContext, their :65,128); BASE1 row 38 (no output-rewriting contract — which is WHY the retention, not the pruning, is the honest slice); the digest's Q1/Q6 |
| **Value** | (a) kills the below-threshold proposals BEFORE they are built (the checklist's quantitative teeth); (b) recovers the largest counted stored surface with 0 surfaces of its own |
| **Seam** | (b): wherever hook-stdout is stored as `hook_success` attachments (the recount's r2:60,123 — the writer's location is the recount's, theirs; the retention knob's owner = the same; NOT opened by me, marked) |
| **Metric, baseline, harness** | (a) = the four counts, each with its source (1% = 3,842/384,219, theirs+mine-arithmetic; 1/week = 167/day, theirs; cache-delta = the F2 unit; 0-new-surfaces = the reviewer's count); (b): stored-bytes/40d = 546.2 MB (theirs) → the cap's delta = theTacit count; the harness = the retention policy's own log (bytes freed/day) |
| **Savings** | (b): 13.7 MB/day stored, if the cap cut it by half — 6.8 MB/day, **arithmetic, marked**; the context-ACTIVE part = the 361 KB/day additionalContext (theirs) — the honest claim: (b) saves STORAGE + the subagent-facts bloat, NOT the p50 carry; stated as such (F2's discipline) |
| **Cost, latency, privacy** | (a): 0; (b): a retention line + a cleaner; nothing leaves the machine |
| **Two-backend gate** | Neither (a) nor (b) consults a backend; behavior with neither = exactly today's |
| **Rough LOC** | (a): 0 (a paragraph in the acceptance criteria); (b): ~10-20 (a retention check in the hook-stdout writer) — estimate, the writer's file not opened, marked |
| **Verdict** | (a) **build-now** (a criterion, not code); (b) **later** — until someone owns the writer's retention, it is a named, counted, unowned gap (the honest verdict for an ownerless seam) |
| **Confidence** | (a) confirmed (each count's source); (b) the 546.2 MB = theirs, the bucket-relationship marked; the 10-20 LOC = inferred, what confirms: opening the hook-stdout writer |

## Questions Answered

- **C1:** Which proposals fail, on which question — the F1 table: 3 (rerank: Q1+Q8), 5 (pruning: Q1), 7 (MCP: joined, cache+surfaces), 8 (rows 44/47/49: none flip); 4 (relevance: later behind row-38 + the 44/day prize); 6 (ROUTER: the replay, not a classifier); 1-2 (the censuses: already-planned, survive).
- **C2:** Which savings claims rest on estimates: swe-004's ~3-4k/route (their mark), my it.2's own +1-hop token conversion (arithmetic, marked), the wire-size 2,225 (grok's honest UNKNOWN), the "saves context" family's missing cache-bust term (F2 — the WHOLE question-C metric Needs re-uniting; nobody's fault: the unit didn't exist before the recount).
- **C3:** The threshold: F4's four-part test, with its first-pass kills (MCP-Deem, the READ-time judge).
- **C4:** The cheaper fixes: the stage-2 replay (F3.1), the hook-verse retention (F3.2), the read-ledger (F3.3).
- **C5:** The one that survives: the 005 deletion arm (F5) — where the model is not.

## Questions Remaining

- D/E/F: the validator/sk-prompt/sk-design residue and the precision question (glm-04, next; swe-002's check map + mimo-002's "categories that earn a classifier at precision 0.8" — their :101 — are the D-side receipts).
- H1/H2: the drop list from 73, the smallest program (glm-05).
- C (residual): the one-bucket count (READ-CONTENT's share of the 186 MB) — the recount's own "one more bucket" method, owner: mimo's harness; the post-recount Grep/Glob-0 status (UNKNOWN — one recount query).

## Next Focus

`glm-04: Against validator, sk-prompt and sk-design classifiers` (W3, research-angles.md:644-654). Read the newest sibling iteration of each lineage first (swe-004, deepseek-010, grok-010, mimo-002 — the W3 rule: EVERY new proposal carries a metric, a counted baseline and a harness, or it is recorded as unmeasured). Then: which D/E/F proposals replace a repository fact or validator verdict with a judgment; which produce a report nobody reads; which lack gold; which are better solved by a docs/template fix; the ONE that survives, with its kill. BASE1 rows 12/21/24 + BASE2 row 63, and the Planned 002/003/005/006 hub-mentions (0, it.2) — the questions-D targets.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| Two of my it.2-cited counts are retired by the recount (8.5% → 30.1/16.8%; "0 ROUTER reads" → 369) | **new** (my own correction, from their recount — adopted, not THEIR error) | mimo-002:23-38, :158 |
| The question-C metric's unit is wrong question-wide: fresh input ≈ 2 tokens/turn makes the prompt cache the cost structure; every C-claim needs a cache-bust term | **new** (grok-003 found the mechanism in one row; it.3 generalizes it into the F2 unit + the F4 threshold) | their :36 + the recount's fresh-2 |
| The stage-2 cheaper fix: the machine blocks are already the replay-source; the 0.8B earns nothing on the biggest counted C-seam | **new** (swe-003's trace + :145-152 + the 369 count; nobody proposed the extension) | swe-003:38,145-152; the recount |
| The 005 deletion arm survives the checklist; the model's question-C role is NONE, yet — it loses every seam to determinism or to missing counts | **confirms BASE with new evidence** (BASE2's own censuses-first order, now by elimination-argument: swe-004's convergence + this F1/F5) | swe-004; the F1 table |
| BASE1 row 38's "no output-rewriting contract" now has a counted blast radius: additionalContext 361 KB/day, hook_success 546.2 MB stored/40d | **new** (the row-38 paired facts, counted) | mimo-002:29-38 |

## SCOPE VIOLATIONS

None. Reads only outside the lineage; writes: this file, `deltas/iter-003.jsonl`, the state record, and the lineage's reducer-owned state files.

## Hand-off

- **glm-04**: the W3 rule (every proposal: metric + counted baseline + harness, else "unmeasured") — apply it to the D/E/F proposals AND to this iteration's survivors (the 005-arm's model-question: precision 0.8's categories, mimo-002's :101 arithmetic, THEIR harness). The recount's lesson applies to YOUR evidence: their it.1's counts retired; cite the recount's `r2` lines, not it.1's.
- The F2 unit (attention + cache-creation, cache-bust counted) is the question-C yardstick the synthesis should impose on the final rankings — without it, the "savings" column compares the wrong things.
- The stage-2 replay (N-glm-03-1) and the 002 one-word (N-glm-02-2) are BOTH cheaper-than-the-model fixes on their seams; if it.4's precision question resurrects the 0.8B anywhere, it must be a seam where determinism does NOT already exist — the burden of proof is the model's, and this lineage's prior iterations fixed what that proof looks like: the printed number.
- The unowned seam (the hook-stdout retention, 546.2 MB) is the synthesis's "recorded for its owner" item — 002/003/005/006 own none of it; note it for the amendment list.
