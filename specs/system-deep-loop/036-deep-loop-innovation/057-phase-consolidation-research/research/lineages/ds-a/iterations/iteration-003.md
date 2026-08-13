# Iteration 3: Full Migration Plan — Rename Mapping + Every Reference Surface

## Focus
Define the exact old→new rename mapping for every child (and every inner child), enumerate EVERY reference surface that must be updated, and resolve the inner-children numbering-collision decision.

## Findings

### 1. The rename mapping (Group-parent introduces a new level)
Proposed 7-group target (Groups A–E1/E2/E3 from iteration 2). **Decision on naming collision:** The existing inner children of 004/006-014/047-049 already use `NNN-` prefixes (e.g., `004/001-spine-architecture-adr`). If new group parents are inserted as `000-...` … `060-...`, the inner children's `00X` prefixes now collide semantically with group-parent numbering. Two clean options:

- **Option 1 (rename outer, keep inner):** New group parents get their own number band; inner children keep `NNN-` but are now grandchildren. The group parent's `children_ids` list them as children. Names: `000-foundation-and-planning`, `010-substrate-and-orchestration`, `020-mode-migration-and-cutover`, `030-gate-closeout-and-drift`, `040-runtime-hygiene-and-remediation`, `050-hardening-and-repair`, `060-review-and-conformance`. The old 44 children become second-level; their own sub-children become third-level. `has_phase_children` (validate.sh:145-155) and recursive traversal still work at any depth, so this is mechanically supported.
- **Option 2 (fold-and-rename children, no outer group):** Renumber children into bands under a single-level scheme (e.g., 004 → 001-..., keep flat). This is equivalent to today's tree and gains NO context optimization (still 44 top-level entries).

**Recommendation: Option 1.** It matches the existing multi-level pattern already proven by 004/006-014/047-049 and the spec-kit "phase parent" model.

### 2. Exact per-child mapping (old folder → new folder)
Concretely (using Option 1 band numbers; old names preserved as slugs unless renamed):

| Old | New |
|-----|-----|
| 001-deep-loop-market-research | 000-foundation-and-planning/001-deep-loop-market-research |
| 002-deep-loop-effectiveness-and-fanout | 000-foundation-and-planning/002-deep-loop-effectiveness-and-fanout |
| 003-baseline-taxonomy-and-state-census | 000-foundation-and-planning/003-baseline-taxonomy-and-state-census |
| 004-architecture-coverage-and-transition-contract | 000-foundation-and-planning/004-architecture-coverage-and-transition-contract |
| 005-fanout-live-tools-unblock | 010-substrate-and-orchestration/001-fanout-live-tools-unblock |
| 006-transition-authorized-ledger-core | 010-substrate-and-orchestration/002-transition-authorized-ledger-core |
| 007-shared-evidence-and-control-services | 010-substrate-and-orchestration/003-shared-evidence-and-control-services |
| 008-compatibility-shadow-and-rollback-bridge | 010-substrate-and-orchestration/004-compatibility-shadow-and-rollback-bridge |
| 009-fanout-fanin-durable-orchestration | 010-substrate-and-orchestration/005-fanout-fanin-durable-orchestration |
| 010-novelty-claims-continuity-and-projections | 010-substrate-and-orchestration/006-novelty-claims-continuity-and-projections |
| 011-convergence-termination-and-health | 010-substrate-and-orchestration/007-convergence-termination-and-health |
| 012-shared-mode-contracts-and-fixtures | 020-mode-migration-and-cutover/001-shared-mode-contracts-and-fixtures |
| 013-mode-and-lane-migrations | 020-mode-migration-and-cutover/002-mode-and-lane-migrations |
| 014-staged-state-migration-and-authority-cutover | 020-mode-migration-and-cutover/003-staged-state-migration-and-authority-cutover |
| 015-legacy-writer-retirement | 020-mode-migration-and-cutover/004-legacy-writer-retirement |
| 016-whole-system-gate | 030-gate-closeout-and-drift/001-whole-system-gate |
| 017-integrate-latest-and-closeout | 030-gate-closeout-and-drift/002-integrate-latest-and-closeout |
| 018-drift-census-and-plan-revalidation | 030-gate-closeout-and-drift/003-drift-census-and-plan-revalidation |
| 019-runtime-code-readmes | 040-runtime-hygiene-and-remediation/001-runtime-code-readmes |
| 020-sk-code-opencode-alignment | 040-runtime-hygiene-and-remediation/002-sk-code-opencode-alignment |
| 021-completion-evidence-reconcile | 040-runtime-hygiene-and-remediation/003-completion-evidence-reconcile |
| 022-shadow-parity-independent-derivation | 040-runtime-hygiene-and-remediation/004-shadow-parity-independent-derivation |
| 023-legacy-compat-event-vocabulary | 040-runtime-hygiene-and-remediation/005-legacy-compat-event-vocabulary |
| 024-durable-write-boundaries | 040-runtime-hygiene-and-remediation/006-durable-write-boundaries |
| 025-artifact-certificate-binding | 040-runtime-hygiene-and-remediation/007-artifact-certificate-binding |
| 026-alignment-coverage-integrity | 040-runtime-hygiene-and-remediation/008-alignment-coverage-integrity |
| 027-mode-gate-and-contract-binding | 040-runtime-hygiene-and-remediation/009-mode-gate-and-contract-binding |
| 028-fanout-dispatch-integrity | 040-runtime-hygiene-and-remediation/010-fanout-dispatch-integrity |
| 029-improvement-promotion-authority | 040-runtime-hygiene-and-remediation/011-improvement-promotion-authority |
| 030-runtime-mirror-and-routing-parity | 040-runtime-hygiene-and-remediation/012-runtime-mirror-and-routing-parity |
| 031-silent-failure-and-harness-repair | 040-runtime-hygiene-and-remediation/013-silent-failure-and-harness-repair |
| 032-docs-drift-and-p2-batch | 040-runtime-hygiene-and-remediation/014-docs-drift-and-p2-batch |
| 033-identity-and-lock-ownership-hardening | 050-hardening-and-repair/001-identity-and-lock-ownership-hardening |
| 035-cli-adapter-stress-and-playbooks | 050-hardening-and-repair/002-cli-adapter-stress-and-playbooks |
| 047-executor-wiring-and-parity | 050-hardening-and-repair/003-executor-wiring-and-parity |
| 048-write-containment-hardening | 050-hardening-and-repair/004-write-containment-hardening |
| 049-deep-alignment-integrity | 050-hardening-and-repair/005-deep-alignment-integrity |
| 050-trustworthy-state-records | 050-hardening-and-repair/006-trustworthy-state-records |
| 051-residual-finding-closeouts | 050-hardening-and-repair/007-residual-finding-closeouts |
| 052-cli-devin-executor-repair | 050-hardening-and-repair/008-cli-devin-executor-repair |
| 053-runtime-code-review | 060-review-and-conformance/001-runtime-code-review |
| 054-review-drift-remediation | 060-review-and-conformance/002-review-drift-remediation |
| 055-rollback-candidate-hash-hardening | 060-review-and-conformance/003-rollback-candidate-hash-hardening |
| 056-review-containment-exemption | 060-review-and-conformance/004-review-containment-exemption |

Note: 013-mode-and-lane-migrations currently has 8 sub-children; under the new scheme its sub-children become third-level (e.g., `020/002-mode-and-lane-migrations/001-deep-research`). The 034/036-046 gaps remain free for future growth.

### 3. EVERY reference surface (migration checklist)

**A. Parent packet (036-deep-loop-innovation):**
1. `graph-metadata.json` — `children_ids` must change from the 44 old paths to the 7 new group-parent paths; `spec_folder`/`packet_id` unchanged (parent slug kept).
2. `spec.md` — rewrite the "PHASE MAP & OUTCOMES" table (spec.md:130-148), the "PHASE DOCUMENTATION MAP" table (spec.md:213-258), the intro paragraph referencing phases 001-017 (spec.md:121-128), and the sequencing invariants text (spec.md:150-160) which cites phase numbers. The `033-dispositions.md` disambiguation note (spec.md:209) must be preserved and re-pointed.
3. `description.json` — regenerate (auto-generated by generate-context.js; do NOT hand-edit).
4. `manifest/phase-tree.json` — currently lists only 001-017; extend to cover the 7 group parents + their children, or document it as the original-program record only. `live_direct_children` would become 7.
5. `handover.md` — contains phase references; update any hard-coded child paths.

**B. Each child packet (44) and each inner child (all levels):**
6. Child `graph-metadata.json` — `parent_id` (currently `system-deep-loop/036-deep-loop-innovation`) must become the new group-parent path; `spec_folder`/`packet_id` must be updated to the new path. For the 13 that are already parents, `children_ids` must be updated to their new grandchild paths.
7. Child `spec.md` — the "Sibling phase adjacency" line (present in most leaves, e.g., 002-006, 015-032) cites predecessor/successor by old name; must be rewritten to the new band-relative numbering. Verify by grepping `Sibling phase adjacency` across children.
8. `description.json` per child — regenerate.
9. Any `implementation-summary.md`/`handover.md`/`tasks.md`/`plan.md`/`checklist.md` that embeds the old path in prose or evidence rows (e.g., evidence citing `specs/system-deep-loop/036-deep-loop-innovation/0XX-...`).

**C. validate.sh (spec-kit):**
10. `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:216-219` — the hardcoded `case` manifest for 036 lists 40 children (001-033, 035, 047-052) with `expected_hash=f6cf1e94...`. After consolidation this must become the 7 group-parent names + their own children, with a **recomputed sha256** (the `child_manifest_hash` uses `printf '%s' | sha256sum`). The hash is verified at validate.sh:239-246; mismatch → exit 2. Alternatively remove the hardcoded branch and rely on the generic `[0-9][0-9][0-9]-*/` glob path. Also note the hardcoded list ALREADY omits 053-056 (stale today); consolidation is the moment to fix that.
11. `has_phase_children` (validate.sh:145) globs `[0-9][0-9][0-9]-*/` — works at any depth, no change needed.

**D. Repo-wide indexes & cross-references:**
12. `specs/descriptions.json` — 133 entries reference 036 paths (children + grandchildren); regenerate the whole index (it is auto-generated from description.json files). Do NOT hand-edit.
13. **98 non-036 files** reference `036-deep-loop-innovation` (git grep). Categories: runtime code under `.opencode/skills/system-deep-loop/runtime/` (write-set-conflict-graph `graph.ts`/`shipped-census.ts`, tests), spec-kit `validate.sh` + `recursive-child-manifest.vitest.ts`, and other spec packets (sk-code, sk-doc, sk-design, sk-doc lineage logs). Each must be re-pointed to the new paths. The `recursive-child-manifest.vitest.ts` test embeds the expected manifest — MUST be updated in lockstep with validate.sh.
14. Individual child references: `001-deep-loop-market-research` in 16 files, `013-mode-and-lane-migrations` in 32 files, `022-...` in 8, `047-...` in 4, `053-...` in 8 (non-self files). A global `git grep` + sed rename sweep per old path is required.

**E. Memory/graph DB:**
15. Spec-kit memory DB (indexed-continuity store) holds `spec_folder`/`packet_id` rows keyed to the old paths. After the move, a `memory_index_scan` (or memory save) re-ingest is required so search doesn't return stale paths. `generate-context.js` refresh also updates `graph-metadata.json`/`description.json`.

### 4. Recommended execution order (migration sequence)
1. Freeze & snapshot: checkpoint the memory store; `git tag`/branch the pre-move tree.
2. Write `timeline.md` in each group parent + the root (see iteration 4) BEFORE renumbering, so chronological lineage is captured.
3. `git mv` each child folder (and inner children) into the new band parents — 1 commit per group to keep blast radius readable.
4. Update validate.sh manifest + sha256 + `recursive-child-manifest.vitest.ts` in the same commit as the group's renames.
5. Update parent + child graph-metadata (`parent_id`, `children_ids`, `spec_folder`, `packet_id`), child spec.md adjacency lines, handover/docs.
6. Regenerate `specs/descriptions.json` + per-child description.json + memory re-ingest.
7. Repoint the 98 cross-repo files (runtime code/tests, other spec packets) via grep+sed sweep.
8. Run `validate.sh --strict --recursive` on the root + each group parent; run the spec-kit test suite (`recursive-child-manifest.vitest.ts`).
9. Verify no stale path remains: `git grep "036-deep-loop-innovation/0[0-9][0-9]"` returns zero.

### 5. Effort/risk estimate
- ~45 `git mv` operations; ~15-25 JSON/metadata files edited; 1 validate.sh manifest + hash recompute; 1 vitest fixture; 98 cross-file reference updates; 1 descriptions.json regeneration; 1 memory re-ingest. All mechanical; the main risks are (a) validate.sh hash mismatch blocking every `--strict` run, and (b) the memory DB serving stale paths until re-ingest.

## Assessment
- newInfoRatio: 0.9
- Novelty justification: Produced the full 44-row mapping, the 15-surface migration checklist (including the validate.sh embedded-hash mechanism, the 053-056 staleness, the vitest lockstep requirement, and the 98-file cross-repo sweep), and the recommended execution order. This directly answers KQ3.
- Confidence: High for the mapping (all from on-disk data); the exact count of cross-file edits inside each runtime file requires the grep sweep at execution time.

## Reflection
- What worked: reading validate.sh manifest functions (lines 182-297, 1294-1368) revealed the hash mechanism and the recursive path both consume it.
- What failed / ruled out: Option 2 (flat renumber, no groups) — it achieves no context win. Deep in-repo path-counting per runtime file was left to execution-time sweep.

## Recommended Next Focus
Iteration 4: timeline.md design — the chronological-lineage record that survives renumbering. Derive a canonical per-folder "worked order" from git first-add timestamps + graph-metadata created_at, design the timeline.md schema, and specify where it lives (root + each group parent).
