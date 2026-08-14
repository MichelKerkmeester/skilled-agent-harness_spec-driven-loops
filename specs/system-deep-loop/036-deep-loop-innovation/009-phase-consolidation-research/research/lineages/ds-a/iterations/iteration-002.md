# Iteration 2: Theme/Dependency Cluster Analysis → Candidate Multi-Phase Groups

## Focus
Classify all 44 children by theme and dependency, then propose consolidated multi-phase parents with optimized names, grounded in the on-disk purposes and structure.

## Findings

### A. Existing structural layering (the strongest signal)
The 44 children are NOT homogeneous. 13 are already phase-parents with their own sub-children (004, 006-014, 047, 048, 049); 31 are leaves with their own plan/tasks/checklist. The spec.md "PHASE MAP & OUTCOMES" table (spec.md:130-148) plus "PHASE DOCUMENTATION MAP" (spec.md:213-258) already organize them into waves:
- **001-002** research inputs (read-only)
- **003** baseline/taxonomy/census
- **004** architecture+transition contract (parent)
- **005-011** substrate build: unblock → ledger core → shared services → compat/rollback → durable fanout → novelty/claims → convergence/health
- **012-014** mode contract freeze → per-mode migrations (×8) → staged authority cutover
- **015-017** legacy retirement → whole-system gate → integrate+closeout
- **018** drift census & plan revalidation
- **019-020** code README + sk-code alignment
- **021-032** remediation tree (the 166 findings from the 016 gate review)
- **033** identity/lock hardening; **035** CLI stress/playbooks
- **047-049** later hardening groups (executor wiring, write containment, deep-alignment integrity) — each already a phase parent
- **050-056** follow-on defect/review/remediation wave

### B. Proposed consolidation (13 → 5 target multi-phase groups)
The task asks for "fewer, larger multi-phase parents". Grounding on theme + dependency + current sub-structure, I propose consolidating the 44 direct children into **5 multi-phase groups** (reusing the already-parented 004, 006-014, 047-049 as inner parents where sensible):

1. **GROUP A — `000-foundation-and-planning`** (research + contract): 001, 002, 003, 004. Rationale: 001/002 are read-only inputs to 003 (baseline) and 004 (the frozen 178-row ledger/contract); spec.md ordering invariant #1-2 says baseline + contract freeze before ANY implementation. These are pure planning artifacts with no runtime writes.
2. **GROUP B — `010-substrate-and-orchestration`** (dark substrate): 005, 006, 007, 008, 009, 010, 011. Rationale: spec.md orderings #3-4 — additive/dark substrate (006 core, 007 services, 008 compat/rollback) then durable orchestration (009) then intelligence layer (010 novelty/claims) then convergence (011). 005 is the early dispatch-only unblock that 009 consumes. This is the largest contiguous dependency chain in the tree.
3. **GROUP C — `020-mode-migration-and-cutover`**: 012, 013, 014, 015. Rationale: ordering invariants #5-8 — shared contracts (012) before per-mode migration (013 ×8), then staged authority cutover (014), then legacy retirement (015). The four phases are one dependency spine with no internal branches.
4. **GROUP D — `030-gate-closeout-and-drift`**: 016, 017, 018. Rationale: whole-system gate (016) → integrate+closeout (017) → drift census/revalidation (018) form the acceptance-and-revalidation loop.
5. **GROUP E — `040-remediation-hardening-and-review`**: 019, 020, 021, 022, 023, 024, 025, 026, 027, 028, 029, 030, 031, 032, 033, 035, 047, 048, 049, 050, 051, 052, 053, 054, 055, 056. Rationale: the post-018 wave is a remediation/hardening/review queue rather than a dependency spine; sub-grouping internally by the existing parent groups (047-049) and the review set (053-056) keeps blast radius small. This group is large (26 children) but its children are mostly independent leaves — the context-optimization win is smaller here precisely because there is no shared dependency spine; a tighter 3-way internal split is proposed below as an alternative.

### C. Alternative tighter split for Group E (recommended shape)
Group E is too large; split by affinity:
- **E1 `040-runtime-hygiene-and-remediation`**: 019, 020, 021, 022, 023, 024, 025, 026, 027, 028, 029, 030, 031, 032 — the original remediation tree (0013 migration-program blockers + P2 docs batch) plus the 019/020 hygiene pair.
- **E2 `050-hardening-and-repair`**: 033, 035, 047, 048, 049, 050, 051, 052 — identity/lock hardening, CLI stress, the three already-parented hardening groups, trustworthy-state, residual closeouts, cli-devin repair.
- **E3 `060-review-and-conformance`**: 053, 054, 055, 056 — the runtime code-review family (deep-review artifact host + drift remediation + rollback hash + containment exemption).

### D. Dependency grounding
- The dependency edges above come from spec.md ordering invariants #1-10 (spec.md:150-160) and the phase-tree.json `depends_on` array (manifest/phase-tree.json, verified 001-017 only).
- **Critical caveat:** `manifest/phase-tree.json` covers ONLY phases 001-017 (`live_direct_children` says 44 but `phases` array has 17 entries). The 018-056 children have NO phase-tree.json entries. Any consolidation must decide whether to extend phase-tree.json to all groups or leave it as the original-program record. [SOURCE: manifest/phase-tree.json]

### E. Naming design
- Use new parent prefix numbering that leaves headroom and preserves sorted-chronology: `000-foundation-and-planning`, `010-substrate-and-orchestration`, `020-mode-migration-and-cutover`, `030-gate-closeout-and-drift`, `040-runtime-hygiene-and-remediation`, `050-hardening-and-repair`, `060-review-and-conformance`.
- Note the current dirs already use `0NN` 3-digit prefixes for children and children-of-children (e.g., `004/001-spine-architecture-adr`). Introducing a second digit (e.g., 000, 010, 020) creates **prefix collision** with the existing inner `001/002/...` sub-child numbering inside 004, 006-014 — those inner children currently sort under their parent; if Group B's children keep their `00X` names (005, 006...) they'd now be grandchildren. Alternative: renumber inner children too, or keep group parents at `NNN-` and rename children to `NNN-NNN` compound. Both options must be analyzed in the migration plan (iteration 3).

### F. Feasibility signal (KQ1 partial)
- Consolidation is structurally **feasible**: spec-kit already supports multi-level phase parents (verified: 004/006-014/047-049 are parents with children; validate.sh handles `--recursive`).
- The **context-optimization benefit** is real for Group B and C (7 and 4 children in one dependency spine): loading one parent gives the whole spine's spec.md map without walking 11 folders. The benefit is weakest for independent leaf remediation waves (E), where a parent adds a hop with little shared context.
- **Risk:** validate.sh's hardcoded 40-child manifest for 036 must be replaced/extended; descriptions.json (133 036 entries) and 98 cross-repo files must be re-pointed; spec.md phase maps must be rewritten. Cost is concentrated, one-time, and mechanical but touches runtime test files.

## Assessment
- newInfoRatio: 0.75
- Novelty justification: Established the 5/7-group consolidation shape, E-split refinement, naming-collision hazard with inner 0NN numbering, and the phase-tree.json 17-vs-44 coverage gap — all net-new. Builds on iteration-1 census.
- Confidence: Medium-high for grouping (grounded in spec.md invariants + dependency text); the naming-collision resolution and full migration mechanics are deferred to iteration 3.

## Reflection
- What worked: reading spec.md ordering invariants + phase-tree.json depends_on; distinguishing leaf vs parent children changes what "consolidation" means mechanically.
- What failed / ruled out: treating all 44 as equal leaves (wrong — 13 are already parents); a single flat 5-group split hides the fact that Group E is not a dependency spine.

## Recommended Next Focus
Iteration 3: Full migration plan — exact rename mapping (old→new for every child + inner child), and EVERY reference surface to update: parent graph-metadata children_ids, spec.md phase maps, phase-tree.json, validate.sh hardcoded manifest + sha256, descriptions.json regeneration, cross-repo references (98 files incl. runtime code/tests), child graph-metadata parent_id, and the inner-children numbering-collision decision.
