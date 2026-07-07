# Iteration 007 — KQ7 (adversarial): governance gaps, sequencing contradictions, convergence

## Focus

Attack the consolidated program for sequencing contradictions, unstated dependencies, and governance gaps. A consolidation is only shippable if it survives its own adversarial pass.

## Attack 1 — Does the novel slate (Phase VI) have a hidden dependency on the migration (Phase V)?

Claim under test: VI can parallelize with III-V (iter 1). Attack: the contradiction detector (N5a, S10) nominates candidate pairs via the entity catalog + causal graph; do those require the schema-error gates (S8) to be live? **Verdict: no.** The entity extractor and causal graph already ship (dq-novel-oob §3) and are independent of the doc-shape gates. N5a reads them in their current state; a stricter schema later only improves its inputs. VI's report-only outputs carry no backfill/error dependency. The parallelism claim SURVIVES.

## Attack 2 — Can C2 (S14) be built before the drift monitor (S9)?

Claim under test: S9 precedes S13/S14 because it protects the prod@3 read. Attack: is that a real edge or a nicety? **Verdict: real edge.** Without the drift monitor + coverage guard, a C2 read taken while the corpus is mid-re-index mixes prefixed/unprefixed vectors under the floor (parent Stage 5) — the fidelity delta is then confounded and the gate would PROMOTE or REGRESS on noise. S9-before-S14 is a hard dependency, not an ordering preference. The edge SURVIVES and is load-bearing.

## Attack 3 — Is "CI report-only, never auto-commit" too conservative given the safe-fix tier exists?

Attack: if a fix is `safe` (deterministic, length-neutral, metadata-only), why not let CI auto-commit it corpus-wide? **Verdict: the rail holds.** A safe fix is safe per-file; corpus-wide it is an unbounded blast radius in a context (CI) where no human reviews the batch. The governance boundary is not "is the fix safe" but "is the blast radius human-reviewed." Local `--apply` and `--confirm` are human-initiated and batch-visible; CI is neither. The boundary SURVIVES (dq-automation-impl iter 2).

## Attack 4 — Governance gap: who owns the fixClass registry's frozen allow-list, and what stops drift?

This is a REAL gap the building-block lineages did not close. The registry is "frozen deny-by-default" but a frozen artifact still drifts if a future detector author adds an entry. **Resolution (new governance rule):** the `detector-registry.ts` allow-list is itself gated — a change to it is a `guarded`-class change requiring `--confirm` + the two structural invariants re-checked (no entry may mark a body-touching fix `safe`; no entry may mark a retrieval change auto-promotable). The registry guards itself with the same INV-1/INV-2 it enforces. This closes the meta-drift gap.

## Attack 5 — Sequencing contradiction: S7 backfill uses safe fixes (S5), but S5 is "after" the sweep (S4)?

Attack: the master sequence puts safe-fix executors at S5 and backfill at S7, but the migration four-beat (iter 2) says backfill runs per gate. Is there a circular dependency? **Verdict: no contradiction.** S5 builds the safe-fix EXECUTORS (the capability); S7 APPLIES them in the backfill (the use). Capability-before-use is the correct order. The four-beat (warn→backfill→re-measure→error) is per-gate and sits inside S3→S7→S8; it does not contradict the engine/executor/apply build order. The sequence SURVIVES.

## Attack 6 — Does any retrieval item have a promotion path that skips C2?

Exhaustive check against RAIL-2: header-path prefix (C1) → C2-gated; edge-b refinement (B3) → C2-gated via `min_rank_seen`; metadata fusion → C2-gated; LLM-judge ranking (N2b) → C2-gated; auto-gen answerable-questions fusion (N3a) → C2-gated (and needs a consumer built first). **Verdict: no escape path.** Every retrieval-class item routes through S14. The one near-miss — the context-budget assembler (N1a) — is NOT retrieval-class (it runs after the floor, no re-index, wins on density not recall), so it correctly bypasses C2. RAIL-2 has no hole.

## Convergence

The consolidated program survives the adversarial pass with ONE new governance rule added (Attack 4: the registry guards itself) and zero sequencing contradictions. The five deliverables are complete:
1. Unified rollout sequence — 17 stages, 7 phases, 5 dependency edges (iter 1).
2. Migration plan — four-beat per gate, Stage-0 census, distinct coverage-guard for the retrieval half (iter 2).
3. Safety/governance model — fixClass taxonomy + 2 invariants, per-stage rollback, 4 human boundaries, 4 drift guards, + the self-guarding registry (iter 3 + Attack 4).
4. Measurement plan — 4 tiers, one-reader-one-metric, earns-its-keep bar per tier (iter 4).
5. NO-GO + anti-patterns — 18 NO-GOs derived from 10 anti-patterns (iter 5).
Plus the cross-lineage reconciliation into one spine (iter 6).

The governance synthesis layer is complete and the program is shippable and safe: every stage names its rollback, every fix is classified, every gate migrates warn-before-error, every tier proves its own metric, and the retrieval half is frozen behind a measurement it does not yet have.

## Dead Ends

- Looking for a faster path that ships retrieval before C2. RAIL-2 forecloses it (Attack 6).
- Trying to let CI auto-commit safe fixes. The blast-radius-not-fix-safety boundary forecloses it (Attack 3).

## Sources

- All iterations 001-006 (the five deliverables under attack)
- `../../research.md` (truncation law, Stage 5 mixed-vector); `../dq-automation-impl/research.md` §5 (the two rails); `../dq-novel-oob/research.md` §3 (shipped substrate independence)

## Assessment

newInfoRatio 0.05 — converged. The adversarial pass overturned no deliverable and surfaced exactly one real governance gap (the self-guarding registry), now closed. Every sequencing edge tested is either load-bearing (S9-before-S14) or non-contradictory (S5 capability before S7 use). RAIL-2 has no escape path. The governance/rollout synthesis layer is complete.
