{"timestamp":"2026-09-12T12:52:30.700Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":105,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
## ITERATION 4 FINDINGS

### 1. INVENTORY — read-only bindings, re-verified, plus the policy that classifies the whole set

Two tests stand behind the answer now. Iteration 3's violation-clock (a rule binds read-only only if its *failure* can occur without mutating a file) — re-verified line-by-line this iteration. The new test: the retrieval-coverage policy turns out to have an explicit row for this corpus, and it classifies the whole set.

**Reply-shaped (failure = a sentence; read-only-binding), fires-when lines verified this iteration:**
- `communication.md:37` — every substantive reply. Carrier: `AGENTS.md:404` ("Load it before answering") + remnant `:410`.
- `evidence-and-proof.md:34-38` — reports, numbers, paths, close-outs. Carrier: `AGENTS.md:239` + table `:241-245`.
- `uncertainty-and-honesty.md:33-37` — unverified names, disagreements, contradictions. Carrier: `AGENTS.md:482-484` + §2 confidence table (`:88`).
- `presenting-decisions.md:35-39` → `AGENTS.md:406`. `handoff-and-questions.md:35-39` → `AGENTS.md:408`.
- `root-cause-and-debugging.md:34-37` → §3 debugging block via `AGENTS.md:175`.
- `skill-hub-routing.md:35-39` → `AGENTS.md:114`.
- `delegation-and-orchestration.md:37-41` — **partial carrier only.** `AGENTS.md:245` covers other-produced findings; `:418` is a bare pointer with no content. Unchanged thin spot.

**No read-only violation (re-verified):** `blast-radius.md:33-37` (mutations all), `scope-discipline.md:35` (notice is the read-only event; the failure is the fix), `prevent-overengineering.md:37-40` (`:39` names thinking-vocabulary, but the failure is adding; `:32` binds "before the first write").

**New this iteration — the policy row.** `retrieval-conventions.md:283`: repo-rules are excluded from *both* retrieval lanes — "loaded at Gate 5 through the trigger table in `REPO RULES.md`, not retrieved at Gate 1; indexing them would surface a rule as a context candidate." The exclusion is test-enforced (`:270-271`, parity suite). Confirmed live: the walker's roots are `specs`, `.opencode/skills`, `.opencode/install-guides`, `.opencode/hooks` (`corpus.mjs:31`), and the committed `runtime/data/trigger-index.json` contains no `repo-rules/` key. So "no hook-viable obligation" is backed by two independent things: the violation-clock classification, and a written decision that this class is load-time material, not surface-time material.

### 2. CANDIDATES

**D′ — the retrieval lane (iteration 3's D, retested because its premise was falsifiable).** Iteration 3 claimed the corpus phrases "feed the Gate-1 trigger index." **False.** The phrases serve only `sk-create-repo-rule`'s collision check (`retrieval-conventions.md:283`). 
- Trigger: phrase hit in the per-prompt lookup (`AGENTS.md:83`). Silence: no hit.
- Cost when wrong: a rule surfaced as a context candidate where no action is at hand — the exact failure pre-ruled at `:283`; plus the index is "committed, size-tracked, fail-closed-on-malformed… parsed cold" on every lookup (`:281`).
- Bar side: **retired side, already decided against in writing** — the policy rationale is the retirement bar restated for the retrieval family. Refuse; do not reopen. Manual escape hatch stays open by design: ripgrep reaches repo-rules "if passed as a root" (`:283`) — deliberate retrieval, not automatic surfacing.

**F — `delegation:37-41` / §6 (`:166-174`), first time through the candidate format.** 
- Trigger candidates: judgment-question vocabulary (`:41` "is this the right design") — topic-keyed; or cadence.
- **Silence: not constructible.** The failing act is composing the reply; any hook runs before it. The only silences available are topic-absence (fires on the whole design-discussion class) or cadence (not relevance). No session state tracks "judgment asked, not yet grounded."
- Cost when wrong: re-asserts an epistemic disposition on every design turn; and rule-file content is level 3, "Only by level 1 or 2" overridable (`REPO RULES.md:24-27`) — the injection could not carry the survivor's force.
- Bar side: **retired side.** Disposition-shaped, no gate leg: the gate chain (`git/README.md:18`) enforces mechanical invariants only, and the one reply-shape checker is `[LOG]`-only "by explicit design" (`injection-contract.md:240-244`).
- Verdict: **change the rule instead** — resident promotion, the mechanism `REPO RULES.md:80-83` documents and `AGENTS.md:239`/`:404` instantiate. Operator decision, not a hook.

**G — the strongest general form (once-per-session read-only-prefix pointer).** Trigger: first substantive prompt before any write. Silence: cadence. Cost when wrong: the pointer it can carry is already resident (`AGENTS.md:11`, `:122`, `:182`, `:454`); the content it would need requires the action key it does not have — and the corpus's own matching rule says match the action, not the topic (`REPO RULES.md:12`). Bar side: **retired side.** Refuse.

**Why the whole class fails, stated once** (subsumes iteration 3's per-candidate observability kills): every reply-shaped obligation's triggering evidence — the failing test's output, the delegate's return, the contradiction, the claim being composed — is produced at or after the tool-result/composition stage, *after* any prompt-time hook has fired. A prompt-time hook can only guess from the prompt text, and those guesses are topic-keyed; `REPO RULES.md:12` names topic-keying as the wrong key. The two survivors evade this only because their subjects are point-shaped AGENTS.md blockers self-detectable at composition and gate-backed (`injection-contract.md:54`, `:148-154`; `git/README.md:28`).

### 3. SURFACE — carryable mechanically; nothing admissible to carry

- The contract carries constants with lifecycle dedup (`injection-contract.md:64`), a classifier-gated question (`:82-83`), a resolve-gated evidence block (`:100`), session-bound context (`:106-140`). A repo-rule directive would slot in mechanically (renderer `:65`, channels `:66`).
- But every smart silence in the fleet is content-absence, session state, classifier score, or cadence — **no rule-relevance predicate exists anywhere**, and the policy row explains why: rules were kept out of the one lane that scores documents (`retrieval-conventions.md:283`). All remaining predicates draw on an action surface that reply-shaped obligations never touch.
- The repo has already placed reply-shape checking where the evidence exists — at Stop — and kept it `[LOG]`-only (`injection-contract.md:240-244`). That is the precedent, not a gap to close.
- Payload-class mismatch: prompt-time payloads today are route advisories (§2 domain) and hard-block reminders (§1 domain); corpus content is level 3 (`REPO RULES.md:24-32`).

### 4. PORTABILITY — the refusal ports trivially; the only surviving remedy is the most portable option

- Refusal: nothing to port.
- Promotion remedy: `AGENTS.md` is shared across repositories (`:11`) and the corpus is symlink-shared; one edit reaches all three repos — no resolution contract, no per-repo hook.
- A hook would need, unchanged from iteration 2: install-anchored resolution (`skill-advisor-hook.md:36`), `REPO RULES.md` as the presence key (`AGENTS.md:122`), pointer-form payload only (`repo-rules/<file>` is the corpus's own cross-reference convention, `REPO RULES.md:40-50`), never hub-internal paths (`skill-hub-routing.md:86` pattern). New evidence the shared-corpus layer is deliberately unwalkable by generated artifacts: the walker never follows symlinked directories and refuses link targets outside the repo (`corpus.mjs:197-215`). Machinery cost otherwise: a new concern needs a kill-switch row (`README.md:38-62`) and per-repo skill edits (skills are independent directories).
- So portability is satisfiable for a pointer-form hook; there is nothing meeting the bar to port — and the remedy that does meet it is portable precisely because it is not a hook.

### 5. VERDICT — refuse; change the rule instead for the one thin spot

- **Injection: none.** No repo rule is better served by a prompt-time hook than by Gate 5. Grounds new this iteration, beyond iteration 3's: the family was decided against in writing for the retrieval lane (`retrieval-conventions.md:283`); the corpus is action-keyed while prompt-time hooks are topic-keyed (`REPO RULES.md:12`); the reply layer is deliberately injection-free (`injection-contract.md:240-244`).
- **The one residual: `delegation-and-orchestration.md:37-41` / `:166-174` — change the rule instead** (resident promotion, `REPO RULES.md:80-83`). The only candidate not already served; its remedy is a clause, not a hook, and it is the operator's call.
- **Tests applied to earlier iterations:** iteration 3's D premise is falsified and D re-decided (refuse-by-policy, not refuse-by-observability); iteration 3's per-candidate kills are generalized to the `REPO RULES.md:12` axiom; iteration 3's thin spot is extended into the candidate format with a concrete remedy; iteration 2's portability conditions carry forward, now with walker evidence. Nothing converged by assertion — the refusal now stands on a policy citation, an axiom, and a corrected premise.
