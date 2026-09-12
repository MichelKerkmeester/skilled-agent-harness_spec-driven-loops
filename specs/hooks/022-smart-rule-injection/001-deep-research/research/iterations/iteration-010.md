{"timestamp":"2026-09-12T13:20:19.837Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":99,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
## ITERATION 10 FINDINGS

*What this pass tested that earlier ones did not: the federation at current state (sibling corpora, sibling routers, sibling AGENTS.md, probed directly), iteration 9's Cursor "conflict" claim, the operator-visibility cost on Pi, and two constructions never put through the silence test. All citations below were opened this session unless a range is attributed to an earlier iteration's file.*

---

### 1. INVENTORY — the read-side set holds under the violation-clock test; the carriers re-verified; one iteration-9 claim withdrawn

The read-side binding set, each carrier re-read this pass:

- `communication.md:37` → resident load-command `AGENTS.md:404` ("Load it before answering").
- `evidence-and-proof.md:34-38` → `AGENTS.md:239` ("These four bind unconditionally, including on a read-only turn where Gate 5 never fires and no rule file loads") plus table `:241-246`.
- `uncertainty-and-honesty.md:33-37` → `AGENTS.md:482-484` plus the §2 confidence table (`:92-97`).
- `presenting-decisions.md:35-39` → `AGENTS.md:406`, `:499`. `handoff-and-questions.md:35-39` → `:408`, `:500`.
- `root-cause-and-debugging.md:34-37` → `AGENTS.md:175` pointer, §3 debugging block `:190-192`. `skill-hub-routing.md:38-39` → `AGENTS.md:114`.
- Negative re-verified: `grep "read-only|read only" repo-rules/` returns zero matches. No rule file names the read-only turn.
- The sole uncovered obligation remains `delegation-and-orchestration.md:45-47` (self-lens), §6 at `:166-174`, with `AGENTS.md:418` and `:488` both bare expansion pointers.

Policy lines the lineage had quoted but never opened firsthand, now verified verbatim: `decision-tests.md:32-41` (Test 1) and `:131` (destination = `AGENTS.md` row), `retrieval-conventions.md:283` ("indexing them would surface a rule as a context candidate"), `check-repo-rules.cjs:5-9` ("nothing else reads it... no hook or workflow touches the router") and `:42-52` (`findRepoRoot`), `specs/hooks/002-.../spec.md:75` ("Unconditional directive removal or no-match/failure silence"), `specs/hooks/014-.../spec.md:71-73`, `:77`, and the nine-gate enumeration at `.opencode/hooks/git/README.md:18`.

**New: iteration 9's recorded "conflict" is withdrawn.** `skill-advisor-hook.md:55` and `injection-contract.md:103` do not contradict. `.cursor/hooks.json:79-90` registers both spec-kit prompt hooks on `beforeSubmitPrompt` (spec-gate-classify.mjs at `:81`, the advisor shim at `:86`), and the contract itself describes the same hooks as "registered on that event... dormant". Registration is repo wiring, delivery is a runtime probe. Two axes, both documents true, no repair owed.

### 2. CANDIDATES — two never-tested constructions, then the class-level closure

**C10.1 — operator-request echo** (pointer injected when the prompt itself requests an action the corpus restrains: "clean up while you're here", "delete the old ones", "just push it").
- *Trigger:* imperative request vocabulary naming a restrained action.
- *Silence:* no such vocabulary. Observable, and it is the only new trigger shape found since iteration 3.
- *Cost when wrong, and the new general property:* it fires on exactly the turns where a live operator instruction exists, and `REPO RULES.md:22-27` puts an in-the-moment instruction at level 2, above rule files at level 3. The injected text is content that cannot govern the turn it was injected for. This generalizes 3 §2C's and 2 §2A's self-authorization observations: for every action-requesting trigger, the fire moment and the override moment are the same moment.
- *Bar side:* retired. No gate leg, and the mechanically gated subset (push) was already refused as signal-disjoint with a complete block message (2 §2A). **Refuse.**

**C10.2 — first-read-only-turn one-shot** (one pointer on a session's first turn when no write has happened yet and the corpus is present).
- *Trigger:* session state at prompt time (turn 1, no write, router present).
- *Silence:* first turn only.
- *Cost when wrong:* it fires on every session that opens with reading, which is this packet's own shape. Its payload is already resident: the Gate 5 block (`AGENTS.md:121-129`) and the read-side carriers (`:239`, `:404`) arrive in context by construction, from the same system that would deliver the injection. One-shot cadence inherits iteration 5's anti-correlation, absent on every later turn, present before any obligation attaches.
- *Bar side:* retired. Constant-shaped restatement, no gate. **Refuse.**

**Class closure, the last test, superseding per-candidate enumeration.** An injection is admissible only if its applicability is decided by the same observable that decides its fire. The incumbent directive passes because its enforcer defines its domain: the pre-commit chain adjudicates every staged code write (`git/README.md:28`), so the hygiene prohibition's applicability equals the write domain. That is why it needs no silence condition, why the slot's policy bans failure-silence (`002 spec:75`), and why its fail direction stays full (`injection-contract.md:64`). Every corpus rule fails the property on the predicate inventory: prompt vocabulary is topic-shaped, cadence is positional, backward verdicts arrive after the failure, constants spam, and action-shaped predicates belong to tool-time `[BLOCK]` where the denial reason is itself the payload (`injection-contract.md:150-154`) and no corpus subject exists. Therefore **the set of rules that should be injected is exactly the set that needs no smart silence, and membership in that set is decided by the gate inventory, not by the corpus.** No corpus rule holds membership. The design space is closed.

### 3. SURFACE — carryable mechanically; locks stand; one new cost axis

- Mechanical carriage is not the blocker: canonical owner and channel list (`injection-contract.md:65-66`), cadence machinery (`:64`).
- Locks re-verified: purpose rule (`014 spec:77`, "Every prompt carries the directive that has an enforcement mechanism, and nothing else"), failure-silence ban in that lane (`002 spec:75`) with fail-open toward full (`injection-contract.md:64`), and the corpus's single-consumer design statement (`check-repo-rules.cjs:5-9`).
- Budget context: `SYSTEM_SKILL_ADVISOR_MAX_TOKENS` default 80 and `MAX_BRIEF_CHARS` 2 KiB (`skill-advisor-hook.md:123`) against a pre-reduction constant measured at ~94.7% of payload (`002 spec:59`) and a shipped ~82% cut (`:62`).
- **New cost axis, never enumerated in iterations 1-9:** on Pi the prompt-time channel is the operator's own visible prompt (`[MSG]`, `injection-contract.md:39`, `:66`, `:268`), and the brief and Gate-3 question "chain additively, so both appear in the same visibly-modified prompt" (`:84`). A new corpus directive would be text the operator sees in their own mouth on every firing, so a wrong fire costs the human's trust directly, not only context. The incumbent pays this for a gate-backed prohibition. No corpus candidate justifies it.

### 4. PORTABILITY — the remedy now has current-state federation evidence, and both layers are heterogeneous

- Layout axis stays solved: discovery precedent (`check-repo-rules.cjs:42-52`, `skill-advisor-hook.md:36`), payload stays the corpus's own `repo-rules/<file>.md` convention.
- **New, probed directly this run: the corpus layer.** All 11 shared files are present in both sibling corpora. Each repo additionally carries local rules, 6 in Mobile CLI (design-system, first-command-traps, host-authority, known-baselines, storybook-archive, verification-ladder) and 3 in Obsidian (screenshot-currency, spec-tree-layout, verification-gates), routed and marked `**local**` by their own routers (Mobile CLI/REPO RULES.md:59-64, :83-88, Obsidian/REPO RULES.md:56-58, :76-79). Both siblings now carry rows for the two newest shared files (Mobile CLI/REPO RULES.md:56-57, :80-81, Obsidian/REPO RULES.md:53-54, :74-75). The parent lineage's last read recorded those files absent and the counts at 15 and 12 (deepseek iteration-010.md:106-109), which reconciles exactly with today's 17 and 14. The propagation landed. Consequence for any candidate: it must derive payload from the per-repo router, which already handles shared-plus-local heterogeneity.
- **New, probed directly this run: the resident layer.** The three AGENTS.md files are 501 lines each and textually identical at every probed locus, including both promotion candidates (`:245` row region, `:418`), §8 (`:404`, `:406`, `:408`), §4's lead sentence (`:239`) and the tail (`:494-501`). Caveat: the same parent record measured a one-line offset in four sibling pointer lines a day earlier, so uniformity is maintained, not structural, and the maintenance mechanism (symlink versus synchronization) is UNKNOWN from a read-only seat. The promotion text itself is path-free, so text-level portability is currently real. A hook would instead add a per-repo artifact to maintain, the opposite direction.

### 5. VERDICT

**REFUSE the injection. LEAVE AT GATE 5 for the action-triggered corpus. CHANGE THE RULE INSTEAD for the one uncovered clause.**

The refusal, recorded with the test that produced it per `specs/hooks/022-smart-rule-injection/spec.md:69`: push directive, signal-disjoint plus self-authorization plus complete gate message (iter 2 §2A). Routing vocabulary, resident restatement, no gate (2 §2B). Check-weakening, missing gate leg, "cannot be repaired by a better trigger" (2 §2C, retested 3 §2B). Retrieval-lane registration, policy decision (4 §C1, rationale corrected 7 §C1). Classifier Gate-5 reminder, restatement and wrong pole (5 §C1). Vocabulary-keyed directive, topic selectivity plus anti-correlated cadence (5 §C2, measured 8 §N1). Delegation judgment vocabulary, Test 1 (`decision-tests.md:38-40`) plus failure invisible to the predicate class (5 §C3, 9 §N4). Completion back-loop, advisory-log upgrade without consent (6 §C2). Advisor constant, purpose rule (`014 spec:77`) plus gate-free corpus (6 §C1, 8 §N1). Orchestrate carrier, realized form works, automation is a second loader (9 §N3). Session-start pointer, constant, continuity owns the channel (7 §C4, 9 §N2). Advisor-graph entries, scope statement Out (7 §C2). Tool-time consent guard, signal is not failure (7 §C3). Bulk-deletion directive, composition self-detection fails (3 §C). Trigger-phrases pointer, vocabulary is not imminence (3 §D). Inverse injection, the retired class by definition (3 §A). Gate-5-to-read-only, universal loading (8 §N3). C10.1 and C10.2, this iteration.

Change the rule instead: promote `delegation-and-orchestration.md:45-47`'s self-lens. Form, one operator decision each: a compressed row beside "Finding = hypothesis" (`AGENTS.md:245`), its inward mirror, or a load-command upgrade of the bare `:418`/`:488` pointers, the §8 pattern (`AGENTS.md:404`, documented at `REPO RULES.md:80-83`). The promotion is one text edit in a document currently uniform across all three repositories.

Forward marker, from 3 §2B with current evidence: the only lever that can move a corpus rule into the admissible class is an enforcing gate, and the repo's recent investment went to corpus integrity (`check-repo-rules.cjs`, its CI workflow) instead. That is the correct allocation under the bar.

**Recorded corrections to earlier iterations:** iteration 9's Cursor conflict withdrawn (§1). Iteration 8's "byte-identical across all three repositories" softened to "currently uniform, maintained by an unverified mechanism" (§4). The Pi operator-visibility cost added to the surface ledger (§3).
