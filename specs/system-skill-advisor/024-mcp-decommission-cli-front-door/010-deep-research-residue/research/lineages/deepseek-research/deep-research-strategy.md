---
title: Deep Research Strategy - MCP decommission residue and latent failures
description: Final strategy state for the deepseek-research lineage: five iterations complete at the configured max-iteration stop, all five questions answered.
trigger_phrases:
  - "mcp decommission research strategy"
  - "latent failure research"
  - "transport removal residue"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Fan-out lineage `deepseek-research` of the deep-research loop on `010-deep-research-residue`, executed by the lineage process itself (cli-pi, deepseek-v4.1-flash). Stop policy `max-iterations` with convergence disabled, per the parent directive's audit-loop rule. **Final state: 5 of 5 iterations complete, all 5 questions answered, synthesis written to `research.md`.**

No reducer process ran against this lineage; the executor refreshed the machine-owned sections after each iteration from its own deltas. Reducer-owned artifact names are kept so the packet stays legible beside sibling lineages.

---

## 2. TOPIC

What a completed MCP-to-CLI transport decommission teaches, using `specs/system-skill-advisor/025-mcp-decommission-cli-front-door` as the case study: which failures were latent and why, what residue a transport removal leaves and which instrument finds each class, and what checklist the next such migration should follow.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

None. All five answered; see §6.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not re-litigating whether the decommission should have happened (a frozen parent decision).
- Not an implementation task: findings are reported, not fixed, and nothing outside this lineage directory was written.
- Not a review of advisor scoring quality or routing accuracy, which D7 placed out of scope.
- Not a survey of MCP-versus-CLI trade-offs beyond what this packet's evidence supports.

---

## 5. STOP CONDITIONS

- Max iterations reached (5) — **met**, this is the terminal state and the hard stop.
- A blocking legal-stop gate that could not be cleared within budget — did not occur.
- Unrecoverable state loss in the lineage directory — did not occur.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] **Q1 — the latent-failure class (iteration 1).** A fallback-only path fails latently when three properties hold: order-gated execution, unverified preconditions, and masked failure. Masking is operative — the degradation is already correctly explained by the primary's failure. Membership: M1 flat socket derivation, M1b the pre-flight probe that short-circuited on it, M2 the 250 ms budget under a 440 ms call, M3 `--warm-only` correct-as-fallback and wrong-as-primary, M4 an untimed correctness proof, M5 the fix that removed the work, M6 the dropped ambiguity flag.
- [x] **Q2 — detection before promotion (iteration 2).** Seven checks ordered by cost: execution census, derivation equality against the owner, budget floor, negative-path latency bound, degraded-content assertion, invocation inversion with a byte diff, three-backend-state proof. The structural reason the cluster survived: three harnesses, each scoped to a component, and a fallback lives in a composition. A literal assertion would have passed on the defective revision.
- [x] **Q3 — residue classes (iteration 3).** Eight classes: config env whose holder died; tests encoding the removed contract; names outliving referents; generated artifacts; cross-package hardcoded paths (603 references remain); documentation describing a deleted harness; local machine state outside the repository; and alias pairs collapsed by a rename (added in iteration 4).
- [x] **Q4 — tooling versus reading (iteration 4).** The split is a property of the search key. A token-keyed search is complete for residue carrying the removed token and blind to residue that does not name it, even inside the swept directory. R7 has no corpus; R1 lives only in history. Classes discoverable before the removal are gates; classes discoverable only after are a battery.
- [x] **Q5 — checklist and record (iteration 5).** A 22-step checklist in five stages, ordered by availability tier then cost; eight record defects by kind (C1-C8), of which the parent's `Pending` rows for phases 004-008 are the most consequential because they state the inverse of the delivered truth.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading the *owner* of a derived value instead of the copy that consumed it: `shouldScopeIpcSocket` turned the flat-path defect from a suspicion into a certainty, because the default socket directory is the one directory that is always scoped (iteration 1).
- `git log -S`, `--diff-filter` and `git show <commit>^:<path>` to date a defect rather than accept a phase log's narrative; this reframed the packet as an activator of inherited defects rather than their author (iterations 1, 3, 5).
- Reading the *deletion diff* rather than the post-deletion state: the removed blocks' values and their five `_NOTE_*` documentation keys exist nowhere in the tree (iteration 3).
- Counting the remainder rather than trusting a scope statement; "checked and reported, not rewritten" means 603 surviving references (iteration 3).
- Deriving a search key from the *operation* rather than the removed thing: `legacy fallback` found a class that four phases of transport-token sweeping walked past inside the swept directory (iteration 4).
- Looking for the working form of a mitigation in the same repository: `hook-flags.cjs`'s enumerated alias table turned R8 from "renames are messy" into an actionable rule (iteration 4).
- Separating *stale* from *false* in the record, which changes the remedy from "correct the claim" to "add the reconciliation step" (iteration 5).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- A repo-wide grep for `daemon-ipc.sock` returned mostly other packets' transcript dumps under `specs/`, whose internal paths point at a different checkout; those are not current-state evidence (iteration 1).
- The packet's phase logs are written in the present tense about defects already fixed; three claims were only resolvable by reading the pre-fix source out of git (iterations 1-2).
- `005` and `008` `implementation-summary.md` are untouched templates, so phase status cannot be read from them (iterations 1, 5).
- Reconstructing the brief's "26 tests / 7 registrations" failed; the actual counts are 9+1, 4, and 22 frozen cases with 27-of-41 failing (iteration 5).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Token-keyed residue sweeping — PARTIAL (iterations 3-4)
- What was tried: classifying residue by searching for the removed transport's vocabulary, which is how the packet's own 007 sweep worked and how iterations 3-4 began.
- Why it is insufficient: it is complete only for residue whose carrier names the removed thing. Two live documents inside the swept directory still assert a collapsed env alias that contains no transport token.
- Do NOT retry: a token-only sweep as the *sole* residue instrument. Pair it with a concept-keyed search (`legacy`, `alias`, `fallback`, `still recognized`, `deprecated`, `old name`).

### Reproducing the packet's phase status from its own logs — BLOCKED (iteration 5)
- What was tried: reading phase status from `goal.md` progress rows.
- Why blocked: five of eight phases read `Pending` in the parent while their commits and artifacts exist, and two phases' `implementation-summary.md` files are templates.
- Do NOT retry: log-derived status. Read commits and artifacts; treat logs as leads.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Flat socket probe as a mistyped literal — the literal is the correct unscoped form of the always-scoped default directory; only a single-owner fix generalises (iteration 1, `bin/lib/launcher-ipc-bridge.cjs:103-109`).
- A distinguishable fallback reason code as sufficient observability — `socket_absent` is in the retryable set (iteration 1, `hooks/lib/skill-advisor-cli-fallback.ts:86-91`).
- Widening the parity harness to cover the seam — its allowlist encodes genuine surface differences, so a smaller cross-seam equality assertion is the right instrument (iteration 2, `003/goal.md:41`).
- Asserting the helper's socket path as a literal — the defective revision's own output is what such a test asserts (iteration 2, pre-fix `…:216`).
- Treating name residue as one class — `mcpServerDir` and the `mcp` aliases share a token and need opposite dispositions (iteration 3).
- A blanket regenerate-after-rename step — one generator run rewrote 18,966 unrelated lines and shifted advisor scores (iteration 3).
- Treating R1 as a post-deletion search — its contents are not in the tree; the instrument is git history (iteration 4).
- Treating the seven-class taxonomy as closed — R8 appeared only when the search-key question was asked (iteration 4).
- Reading the parent's pending rows as a delivery failure — every phase's artifacts exist (iteration 5).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0 (convergence mode `off`)
- Failed pivots: 0
- Audited overrides: 0
- Saturated: the packet's own artifacts (iterations 1-5 exhausted the record's usable evidence; further iterations would need the repository's git history or a replay of the pre-promotion revision)
- Pivot lineage: none
- Remaining frontier: five open questions recorded in `research.md` §11, of which the two most tractable are (a) replaying the pre-promotion revision against the seven detection checks and (b) reading `19e1ffedaf0`'s diff to settle whether the alias collapse is a rule or an accident
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Would checks 1-5 have caught M1-M5 without the promotion? Argued from mechanism, not demonstrated.
- Is the R8 alias collapse a family-wide residue? `19e1ffedaf0`'s diff would settle it.
- What does R5's 603-reference remainder cost in practice — are any of those references executed rather than read?
- Does the machine-state class (R7) recur elsewhere? Nothing collects it, so its frequency is unknown.
- Is the checklist transferable without a comparable record? Only its availability-then-cost rule is a general claim.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None — the loop reached its configured max-iteration stop and synthesis is complete. If this lineage is extended, the highest-value next focus is a *replay*: check out the pre-promotion revision (`e8d564ca98^`) in a scratch worktree and run the seven detection checks against it, to convert the detection table from a mechanism argument into a demonstrated catch list.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Captured at init from the packet's record and expanded during the loop. Primary sources: the parent `goal.md` and `spec.md`; phase artifacts 001-008; the sibling review lineage at `009-deep-review-decommission/review/lineages/deepseek-review/`; the live tree at HEAD; and the commit history on `worktrees/049-advisor-mcp-decommission`.

`resource-map.md` was not present at init and was not required; an evidence-derived resource map is emitted beside this file (`resource-map.md`) from the converged deltas.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (reached)
- Convergence threshold: 0.05 (recorded; convergence mode `off` for this audit run)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research.md` ownership: workflow-owned canonical synthesis output, written at synthesis
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Current generation: 1
- Started: 2026-09-11T17:39:36Z · Synthesized: 2026-09-11T19:10:00Z
