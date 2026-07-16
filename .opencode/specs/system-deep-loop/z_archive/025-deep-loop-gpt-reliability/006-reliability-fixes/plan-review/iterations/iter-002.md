## GAPS

### 1. Phase 001 does not add the verification instrumentation phases 003/005/006/009 depend on — its "trustworthy harness" scope is incomplete

**Evidence**: Phase 001 scope closes only F-014 (content-hash detection) and F-025 (path-free prompts) (`001-benchmark-harness-hardening/spec.md` REQ-001..003). Synthesis §5.3 ("Acceptance harness") lists three *additional* harness pieces every package depends on: *"Add presentation snapshot assertions (exact rendered block), budget-edge integration checks (first-artifact deadline, progress cadence, pre-cap finalizer), and advisor telemetry classifying vague-ask outcomes (routed / offered / inline / misroute)."* These map to later phases' success criteria: 003 REQ-003 ("benchmark marker assertions … D2 vocabulary" needs snapshot assertions), 005/009 watchdog/pacing verification (need budget-edge integration checks), 006 success #1 ("the three vague prompts route or produce an explicit offer" needs advisor outcome telemetry). None of the three is in 001's scope, and no other phase owns harness instrumentation.

**Gap**: The parent (`spec.md:52`, `116`) justifies 001-first as "make the 033 acceptance harness trustworthy BEFORE verifying fixes." But 001 makes it trustworthy only for the F-014/F-025 confounds. The §5.3 instrumentation is unassigned, so 003/005/006/009 cannot actually verify their cell-flips against the post-001 harness — their acceptance claims rest on measurement capability that does not yet exist and that 001 will not add.

**Severity**: major

**Recommended amendment**: Expand 001 REQ to include the three §5.3 instrumentation additions (presentation snapshot assertions, budget-edge integration checks, advisor outcome telemetry), or add an explicit per-phase harness-extension sub-requirement to 003/005/006/009 gated on the shared capability, and restate 001's purpose as "trustworthy harness for *all* later cell-flip claims," not just the two 034 confounds.

---

### 2. Phases 002 and 010 collide on the same "what a command-scoped run receives" injection surface; 010 (last) can silently regress 002's (first) fix

**Evidence**: 002 REQ-003 *"wire command-scoped runs to receive [the 8-rule autonomous execution profile] first"* + REQ-001 adds the Gate-3 autonomous-precedence bridge *to the root policy file*. 010 REQ-002 *"defer command-irrelevant sections for autonomous command runs"* (naming "agent routing," "completion mechanics") + success #1 *"command runs receive a slimmed profile"* + REQ-001 dedupes the (now 002-edited) root policy by hash. Both phases manipulate the per-session injection composition for command-scoped runs — 002 establishes a first-position guarantee, 010 reorders/slims that same payload. 010's risks/dependencies row (`010-injection-slimming/spec.md:96`) names only the generic "phase 002 must land before P1" boilerplate; the 002→010 interaction is unacknowledged. 010's Predecessor is 009, not 002.

**Gap**: 010 lands last and rewrites the injection payload that 002 (phase 2) carefully ordered. If 010's slimmed autonomous profile does not explicitly preserve 002's Gate-3 bridge and 8-rule-profile-first guarantee, it regresses exactly the cells 002 flipped (RVB-008/RSB-008/ACB-004/IMB-004/IMB-005). The plan models these as independent surfaces when they are the same one.

**Severity**: major

**Recommended amendment**: Set 010's predecessor to 002 (its real surface dependency), and add a 010 requirement that the slimmed autonomous-run profile *preserves* the 002 autonomous-precedence bridge and the 8-rule profile's first position, with a regression re-run of 002's five cells as a 010 acceptance gate.

---

### 3. "Each phase ships and verifies independently" (`spec.md:62`) is false for 007, 008, and 010 — they have no dedicated acceptance cells

**Evidence**: Parent Success Criterion #1 (`spec.md:81`) requires *"All 10 phases complete with their acceptance cells moved to the expected verdict."* But 007's acceptance row reads *"Cross-class (Gate-3 inversion, presentation, absorption); measured indirectly"*; 008's reads *"Gate-inversion + render + absorbed-step classes together"* (class labels, no cell ids); 010's reads *"Prompt salience (indirect; supports the Gate-3 + presentation cells)."* None names a cell it uniquely owns. Their "expected verdict" is therefore non-regression on cells that 002/003/004 must first move.

**Gap**: A phase whose only cell-level acceptance is borrowed from another phase's cells cannot verify independently — it can only be accepted *after* the owning P0/P1 phase has landed and turned those cells green. So 007/008/010 are structurally dependent on 002/003/004 despite the parent's independence claim and the per-phase boilerplate that says nothing about this.

**Severity**: major

**Recommended amendment**: Either (a) restate the parent independence claim as "P0/P1 phases (001–006) verify independently; P2 phases 007/008/010 verify as non-regression passes gated on the owning P0/P1 phase," or (b) give each of 007/008/010 a dedicated structural acceptance cell (contract-presence assertion for 007, drift-guard CI check + setup-loader unit test for 008, single-injection + token-budget assertion for 010) so each is acceptable on its own merits.

---

### 4. Phase 006 is serialized after 004 and 005 though it depends on neither — the linear "dependency-ordered" map overstates dependencies and delays a synthesis-ranked top impact/effort win

**Evidence**: 006's Predecessor field is 005 (`006-routing-offer/spec.md:43`); parent §8 header (`spec.md:112`) says "Dependency-ordered." But 006's scope is Gate 2 + `skill_advisor.py` (`006:62-63`), sharing no file with 004 (dispatch mechanism/validator) or 005 (council/context YAMLs). Synthesis §5.1 prescribes the order: *"P0 Gate-3 → render markers + routing offer + absorption guard (parallel, S) → receipts → progress records"* — i.e. 006 belongs in the first parallel wave *with* 003, before 004/005. §2 calls the render contract "the single highest impact-per-effort" and 006 is in that same S wave.

**Gap**: Declaring 005 as 006's predecessor invents a dependency that does not exist. 006's cells (ACB-003/IMB-003/RSB-004) are vague-ask cells answered inline (synthesis §6: "inline partial on ALL THREE legs") — they do not even hit Gate-3, so the 002-masking rule barely constrains them; 006's true gate is at most 001. Serializing it behind two M phases leaves three measured cells unmitigated longer than the synthesis intended and contradicts §5.1.

**Severity**: major

**Recommended amendment**: Set 006's predecessor to 001 (harness) — or 002 at most — mark 003 and 006 as parallelizable per §5.1, and change the parent §8 header to distinguish true hard dependencies (001; 002→P1 verification) from sequencing convenience, so the numbering stops implying 006 must wait for 005.

---

### 5. Phase 009 has an undocumented dependency on 004 (per-dispatch receipts), not only on 005 — resumable sub-invocations are multiple dispatches each bound by 004's receipt-before-state-log-append rule

**Evidence**: 009 REQ-001 splits the improvement command into *"resumable sub-invocations (setup / work --one-iteration / synthesize) sharing session id + ledger."* Each sub-invocation is a dispatch. 004 REQ-002 makes the validator *"require the receipt before the state-log append"* and REQ-001 emits a *per-dispatch* HMAC receipt. 009's scope (`009-pacing-and-resume/spec.md:65`) names only *"Progress-record schema (phase 005, dependency)"* as a cross-phase dependency; its risks row (`009:98`) repeats only the 002 boilerplate. The 004→009 interaction is absent.

**Gap**: 009's resumable design produces N dispatches over one shared session ledger, but 004's receipt contract is per-dispatch and gates every state-log append. Whether 004's HMAC receipts compose across a multi-dispatch resumable run (shared session id + ledger vs per-dispatch HMAC) is an unexamined design coupling. Because 004 lands before 009 the *order* is safe, but the *dependency* is invisible, so 009's plan.md could easily design a ledger protocol that 004's validator rejects.

**Severity**: major

**Recommended amendment**: Add 004 as a documented predecessor/dependency of 009, and add a 009 requirement that each resumable sub-invocation emits and consumes a 004-style dispatch receipt over the shared session ledger, with a multi-dispatch acceptance test (resume mid-run, assert all sub-invocations validate).

---

### 6. Phase 002's Gate-3 cells may not fully flip on orchestrate-routed paths until 007 (P2) hoists the agent-file Gate-3 — a P2 phase partially gating a P0 phase's acceptance

**Evidence**: F-020 (closed by 007) evidence: *"orchestrate.md … the operative hard block sits at 387-404 … Expected effect: Gate-3 cells on E4/orchestrate-routed paths."* 002's acceptance cells (RVB-008, RSB-008, ACB-004, IMB-004, IMB-005) are review/research/council/improvement cells that route through the orchestrator agent. 002 fixes only the *root-policy* Gate-3 (AGENTS.md) + the 8-rule profile (`002-gate3-precedence/spec.md` scope:63); it does not touch `orchestrate.md`'s buried Gate-3 block — that is 007/F-020. 002 success #2 claims *"the five Gate-3 cells stop halting when re-run"* after 002 alone.

**Gap**: If any of the five acceptance cells weights the agent file's Gate-3 position (line 387) over the root-policy bridge — exactly F-020's measured "priority-inversion" mechanism — then 002 alone cannot flip that cell; 007's hoist is also required. The plan asserts 002 lands first and flips all five with no caveat that a P2 phase may be co-owner of the flip. (Caveat: 002's 8-rule profile reaches command-scoped runs first and *may* overcome the agent-file positioning — so this is a risk to verify at execution, not a certain block.)

**Severity**: major

**Recommended amendment**: Add a risk/dependency to 002 acknowledging the F-020 interaction, and an acceptance caveat: if a Gate-3 cell does not flip after 002 on an orchestrate-routed path, the residual cause is the agent-file Gate-3 positioning (007/F-020) and the cell is jointly owned by 002 + 007 — do not let 007 re-claim it as a clean independent flip.

---

### 7. Phase 001's path-free prompt rewrite (F-025) re-scores 006's acceptance cells — a hidden measurement coupling that invalidates the baseline 006 measures against

**Evidence**: 001 REQ-002 rewrites the vague-ask scenario prompts (ACB-003, IMB-003, RSB-004) to be path-free; 001 REQ-003 *"Re-score any affected historical cells and note deltas."* Those three cells are exactly 006's acceptance cells (`006-routing-offer/spec.md:86`). 006 verifies *"the three vague prompts now route or offer."* But 001 already changed the prompts and re-scored them. F-026 (closed by 006) states path tokens *"can route AWAY from the intended skill"* — so removing them (001) can by itself move the routing verdict before 006's scorer change lands.

**Gap**: 006's before/after delta is measured against a baseline 001 established, not the original 033 verdicts. If 001's path-free rewrite alone routes/offers the cells, 006 has nothing to flip; if it regresses them, 006 inherits a moved baseline with no attribution. This cross-phase measurement coupling is unflagged in both 001 and 006 (their dependency rows cite only the 002 boilerplate).

**Severity**: major

**Recommended amendment**: Require 001 to record the post-rewrite re-score for ACB-003/IMB-003/RSB-004 as the *new* baseline and hand it to 006; restate 006's acceptance as "cells route/offer vs the post-001 baseline," not vs the original 033 verdicts, and add the coupling to 006's risks/dependencies. (Distinct from Gap 1's missing advisor *telemetry*: this is an *input*-change confound, that is a *capability* gap.)

---

### 8. Phases 004 and 005 co-edit three shared surfaces (review/improvement auto-YAMLs, the review prompt pack, `post-dispatch-validate.ts`) with no coordination note

**Evidence**: 004 scope: *"deep_*_auto.yaml dispatch steps … the two LEAF prompt packs"* + REQ-002 touches the validator. 005 scope: *"the review prompt pack"* + REQ-004 *"Review/improvement emit progress after each sub-step"* (so 005 also edits the review/improvement auto-YAMLs) + REQ-002 *"require per-round liveness records in validation"* (same validator). Concrete overlap: `deep_review_auto.yaml` and the improvement auto-YAML (004 = dispatch step; 005 = iteration/loop steps — same file, different steps, answering the brief's "same YAML dispatch step?" hypothesis: same YAML, adjacent steps), the review prompt pack (004 REQ-004 abort line vs 005 REQ-004 progress emission), and `post-dispatch-validate.ts` (004 receipt-require vs 005 liveness-require).

**Gap**: Two M phases mutating the same YAML, prompt pack, and validator with no cross-reference. The order (004 before 005) is correct so this is not a blocker, but 005's plan.md/tasks.md must rebase onto 004's validator and prompt-pack edits or the two liveness/receipt requirements will collide in one function. Neither phase's risks row names the other.

**Severity**: minor

**Recommended amendment**: Add a cross-phase coordination note to 005's risks naming the three shared surfaces with 004, and gate 005's plan authoring on rebasing against 004's landed `post-dispatch-validate.ts` and review prompt-pack changes.
