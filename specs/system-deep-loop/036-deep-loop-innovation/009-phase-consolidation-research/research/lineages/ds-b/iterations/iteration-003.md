# Iteration 3: Cluster Design Part 2 + Full Reference-Surface Inventory

## Focus
Complete the multi-phase parent set for 035 + 047-052 (executor/CLI-hardening tree) and 053-056 (review/rollback tree), finalize the grandparent naming + numbering scheme, and enumerate the complete reference surface (internal + external) that a migration must update. Also confirm the health of the proposed final 036 direct-child listing.

## Findings

### F3.1 — Grounding: executor/CLI-hardening tree (035, 047-052) themes + statuses
- 035-cli-adapter-stress-and-playbooks (planned) — stress-test + manual-playbook program for external CLI adapters.
- 047-executor-wiring-and-parity (in_progress, parent ×5) — cli-codex read-only leaf, cli-devin wiring, executor/provider/model parity, devin allowlist parity/prune.
- 048-write-containment-hardening (in_progress, parent ×3) — cli-codex containment, sibling-lineage scope, concurrent-writer safety.
- 049-deep-alignment-integrity (in_progress, parent ×2) — findings-registry seal state, contained multi-executor.
- 050-trustworthy-state-records (complete) — append-time stamps + stop-policy event-name fix.
- 051-residual-finding-closeouts (in_progress) — closes residual findings carried from 022/025/028.
- 052-cli-devin-executor-repair (complete) — workspace-trust + model-catalog drift repair in cli-devin.
[SOURCE: file:.../{035,047-052}/spec.md H1 titles; child graph-metadata.json statuses]

**Theme:** All seven are executor-facing runtime hardening/work. 047/048/049 are already grouped phase-parents (executor wiring, containment, alignment integrity); 035, 050, 051, 052 are leaves. They form a coherent "executor & CLI hardening" grandparent.

### F3.2 — Grounding: review/rollback tree (053-056) themes + statuses
- 053-runtime-code-review (complete) — deep-review artifact host for the runtime code audit.
- 054-review-drift-remediation (complete) — reconciles parent documentation/metadata drift.
- 055-rollback-candidate-hash-hardening (complete) — promoted-candidate-only rollback authority follow-up.
- 056-review-containment-exemption (complete) — review containment exemption.
[SOURCE: file:.../{053-056}/spec.md H1 titles; child graph-metadata.json statuses]

**Theme:** All four were added 2026-08-13 (commit 0f38efabe24 "reconcile 036 phase-parent drift + add review-follow-up packets") as a review-follow-up wave. [SOURCE: git log] They form a "review & rollback follow-up" grandparent. Note 053-056 are currently **absent from the validate.sh hardcoded manifest** (drift) — a consolidation that re-lists children must add them.

### F3.3 — Final grandparent set (complete proposed grouping)

| New grandparent (direct child of 036) | Members | Theme |
|---|---|---|
| `001-research-inputs-and-baseline` | 001, 002, 003 | Research inputs + frozen BASE/taxonomy/census |
| `002-ledger-and-spine-architecture` | 004, 005, 006 | Spine ADR/ledger contract + early fan-out unblock + dark ledger core |
| `003-shared-services-and-migration-bridge` | 007, 008 | Shared evidence/control services + compat/shadow/rollback bridge |
| `004-orchestration-convergence-and-mode-contracts` | 009, 010, 011, 012 | Durable fan-out/fan-in + novelty/claims + convergence/health + mode contracts |
| `005-mode-migration-cutover-and-gate` | 013, 014, 015, 016, 017 | Per-mode migrations → cutover → legacy retirement → whole-system gate → closeout |
| `006-drift-revalidation-and-blocker-closeout` | 018, 021, 022, 023, 024 | Drift revalidation + the four named cutover blockers |
| `007-remediation-docs-integrity-and-hardening` | 019, 020, 025, 026, 027, 028, 029, 030, 031, 032, 033 | Docs/alignment + integrity/hardening bindings |
| `008-executor-and-cli-hardening` | 035, 047, 048, 049, 050, 051, 052 | Executor wiring/containment/parity/repair + stress/playbooks + residual closeouts |
| `009-review-and-rollback-followup` | 053, 054, 055, 056 | Runtime code review + drift remediation + rollback hardening + containment exemption |

Plus `009-phase-consolidation-research` remains a direct child (the research host; would later be renamed to the plan/implementation packet or kept as-is).

**Health check:** 036 direct children drop from **45 → 10** (9 grandparents + 057). All grandparent member counts are ≤ 11 (well under the 20 warning / 40 error thresholds). Every grandparent is itself a phase-parent, so it needs the lean trio (`spec.md`, `description.json`, `graph-metadata.json`) per the Phase Parent Mode rule. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:24-25; system-spec-kit SKILL.md Phase Parent Mode]

### F3.4 — Numbering scheme decision
Two viable numbering philosophies for the new grandparents:
- **A) Reuse program-sequential numbers 001-009** (proposed above): mirrors the original 001-017 spine, so phase numbers stay human-meaningful (001 = research/baseline … 009 = review follow-up). Cost: the grandparent prefix `001-` collides visually with the existing child `001-deep-loop-market-research` now nested underneath it (paths become `001-research-inputs-and-baseline/001-deep-loop-market-research/`). This is valid per the phase-child regex and already precedented (nested children reuse 001-00N inside 004/006/013/047). [SOURCE: child phase-parent graph-metadata children_ids]
- **B) Reuse the tail band 035/047-056** to minimize collision with the existing program numbers. Not recommended: it reads arbitrarily and fights the program-ordered taxonomy.
**Recommendation: Scheme A** — 001-009 grandparents, because the existing nested children already reuse 001-00N and the numeric banding maps 1:1 to the original program bands. The *chronological* order then lives in `timeline.md` (iteration 5), NOT in the numbers.

### F3.5 — Full reference-surface inventory (what the migration must update)
**Internal to 036 (per child moved):**
1. Parent `graph-metadata.json` `children_ids` (44 → 9-10 grandparent entries) + `last_active_child_id`.
2. New grandparent `graph-metadata.json` (created with `children_ids` = its member paths).
3. Each moved child's `graph-metadata.json`: `packet_id`, `spec_folder`, `parent_id` (if stored), `derived.last_active_child_id` (parents only).
4. Each moved child's `description.json`: `specFolder`, `parentChain`, `specId`, `folderSlug`, `memoryNameHistory` (parentChain gains the grandparent level).
5. Parent `spec.md`: PHASE DOCUMENTATION MAP (45 rows → ~10), the Phase Map + Outcomes table, phase-transition/handoff tables, section text referencing "44-child" / "live direct children".
6. Parent `manifest/phase-tree.json`: `live_direct_children` (44 → 9), `phases[]` (currently 17 program rows; add grandparent band rows), `notes`.
7. Parent-level docs: `handover.md`, `goal.md`, `goal-plan-review.md`, `cutover-execution-plan.md`, `dispositions.md`, `before-and-after.md`, `execution-sequencing-strategy.md`, `goal-prompt.md` — any child-slug or "44-child"/"45-child" mentions.

**External to 036 (confirmed hits):**
8. `specs/descriptions.json` — repo-wide index; every child + grandparent must be re-indexed (regenerate via `generate-context.js`).
9. `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` — hardcoded 036 child manifest (40 entries + sha256 `f6cf1e943d...`) MUST be replaced with the 9-grandparent list + recomputed sha256, AND 053-056 (currently missing) added.
10. `.opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts` — child path references.
11. Runtime code: `.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts`, `shipped-census.ts`, and 15 `runtime/tests/unit/*.vitest.ts` + `runtime/tests/helpers/legacy-real-log.ts` — reference child slugs (13→013 nested paths etc.).
12. Cross-packet specs: `specs/sk-code/021-code-conformance-alignment/*`, `specs/sk-design/012-sk-design-program/004-hallmark-design-system/{goal,handover}.md`, `specs/sk-doc/022-code-readme-coverage/*`, `specs/sk-doc/023-feature-catalog-integrity/*`, `specs/sk-doc/024-playbook-scenario-coverage/spec.md`, `specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census/baseline/census/symlink-mode-manifest.json`.
13. Sibling packet research artifacts: `specs/system-deep-loop/037-graph-engineering/research/**` (deltas, iterations, strategy, dashboard), `specs/system-skill-advisor/018-advisor-audit-and-state-containment/research/leak-research.md`, and `specs/sk-design/012-sk-design-program/001-research/*/research/lineages/*/logs/fanout-lineage.out` (historical lineage logs — these are append-only research logs, typically NOT rewritten; they should be left as-is and only new writes use new paths).
14. `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/019-routing-coverage-activation-verification/001-research/research/logs/iter-*.err` — historical logs; leave as-is.

**Total external live-editable files ≈ 27** (excluding historical logs that must not be rewritten). [SOURCE: rg scans above]

## Sources Consulted
- specs/system-deep-loop/036-deep-loop-innovation/{035,047-052,053-056}/spec.md + graph-metadata.json
- specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json
- specs/descriptions.json; validate.sh; recursive-child-manifest.vitest.ts
- rg across repo for 036 child-slug references (external-surface enumeration)
- git log commit 0f38efabe24 (053-056 wave)

## Assessment
- **newInfoRatio:** 0.80
- **noveltyJustification:** Completed the grandparent set (9 groups covering all 45 children), finalized the numbering scheme, and produced the first exhaustive external+internal reference-surface inventory (~27 editable files) for the migration.
- **Confidence:** Confirmed for membership + external hits (rg reads); numbering preference is judgment (A vs B, recommend A).

## Reflection
- What worked: the rg scan across the repo produced a precise, deduplicated external reference list instead of guessing.
- What failed: nothing this iteration.
- Ruled out: numbering scheme B (tail-band reuse) — reads arbitrarily, fights the taxonomy. Historical research/lineage logs (iter-*.err, fanout-lineage.out, 037 research artifacts) are NOT migration targets — append-only records.

## Recommended Next Focus
Iteration 4: The full migration plan — exact rename sequence for 001-056 → 9 grandparents, every JSON/markdown/code surface updated in lockstep with ordered steps, verification gates (validate.sh manifest hash recompute, is-phase-parent health re-run, recursive strict validation), and rollback.
