# Iteration 008 — Traceability (Broadened Angle 4: Frozen-Fixture Classification + Generated-Metadata Provenance + Spec-Code Consistency)

## Dimension
traceability — (1) classify whether the 035 deterministic-fixtures-oracle corpus holding the deep-alignment.md mirrors is a FROZEN snapshot or a LIVE baseline needing refresh; (2) verify generated-metadata provenance (canary-cases.v1.json + registry-compiler.cjs, command-bridges.generated.json, skill-graph.json) is consistent with its declared generator/source TODAY and that 8849444aa6 updated fixtures + compiler coherently; (3) confirm the 023-cross-runtime-dispatch and 024-executor-kind-routing spec packets added by commits 1-2 are consistent with what those commits actually changed (spot-check 3 claims each against the diffs).

## Files Reviewed
- `specs/system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle/spec.md:54-74,86-91` (freeze contract: REQ-004 "Freeze each fixture expected defect code and location"; §6 risk "Fixture staleness as command shapes evolve, mitigated by a regenerable mutation manifest")
- `specs/system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle/description.json` (packet purpose: "authored before any adapter code so the deterministic adapter cannot validate itself")
- `find specs/.../002-deterministic-fixtures-oracle/fixtures -name deep-alignment.md` → 16 mirrors under `fixtures/corpus/{public,held-out,base}/.../.codex/prompts/deep-alignment.md` (incl. `clean-control`, `public-mirror-drift`, `held-out-orphan-mirror`, `base/clean-command-tree`)
- `specs/system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle/fixtures/mutation-manifest.json` (regenerable manifest — the regenerator, NOT the frozen expectations)
- `git show --stat 8849444aa6` filtered for generated-metadata surfaces: `canary-cases.v1.json` (33±), `002-system-deep-loop/lib/registry-compiler.cjs` (11±), `deep-loop-registry-compiler.vitest.ts` (-23), `command-bridges.generated.json` (-30), `shadow-diff.md` (-1), `skill-graph.json` (2±)
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/command-bridges.generated.json:1-5` (`generatedBy: scripts/command-bridges/derive-command-bridges.cjs`; 0 `alignment` refs post-edit)
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json:1` (`generated_at: 2026-08-10T12:19:10`; the single `alignment` match is the keyword `"alignment verifier"`, not deep-alignment; no `generated_by` field, no generator script found)
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/README.md:60` (`"sk-code alignment"` — reviewer-alignment concept, not deep-alignment; not touched by any of the 7 commits)
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/fixtures/canary-cases.v1.json` (0 `alignment` refs post-8849444aa6 edit)
- `git show --stat e41aa1878ad` (commit 1: Phase-0 gate retire — 8 deep/* commands + prompt/improve + 4 legacy bodies + 3 presentations + 4 recompiled contracts)
- `specs/system-deep-loop/036-deep-loop-innovation/023-cross-runtime-dispatch/spec.md:1-50` (spec packet for commit 1)
- `git show --stat d1a5981b58c` (commit 2: +273 each to deep-alignment-auto.yaml, deep-research-auto.yaml, deep-review-auto.yaml + 024 spec packet files)
- `specs/system-deep-loop/036-deep-loop-innovation/024-executor-kind-routing/spec.md:50-140` (spec packet for commit 2; §2 notes research uses `config.executor.type`, review uses `config.executor.kind`; Files-to-Change table lists all three auto YAMLs)

## Findings by Severity

### P0
None.

### P1
None.

### P2
None new this iteration. The three focus items resolved as classifications / ruled-out directions (see below). Prior P2-001…P2-012 carry forward unchanged.

## Traceability Checks
- **spec_code (023 vs commit 1 — e41aa1878ad):** CONSISTENT. Spot-checks: (a) "retire the gate across all 8 deep/* commands" — commit stat shows `alignment.md`, `ai-council.md`, `agent-improvement.md` changed and commit message confirms all 8; (b) "reverted 022" — commit message confirms "reverted the dormant 022 render authorization + its test"; (c) "recompiled contracts" — stat shows 4 `compiled/deep-*.contract.md` files changed (2+/2- each). All three claims match the diff. ✓
- **spec_code (024 vs commit 2 — d1a5981b58c):** CONSISTENT. Spot-checks: (a) "Add `if_cli_cursor/devin/pi` to `deep-review-auto.yaml`" — stat shows +273 to that file; (b) "research uses `config.executor.type`" — 024 spec §2 explicitly documents the field asymmetry (cross-corroborated by prior P2-009); (c) "`deep-alignment-auto.yaml` gets the three branches" — stat shows +273. The third target was subsequently deleted by commit 3 (8849444aa6, documented by the 025 packet), but 024 correctly records what commit 2 shipped at its time — correct spec-per-commit traceability, not drift. ✓
- **checklist_evidence:** Deferred (strategy.md §9 exhausted-approaches; observation-only review).
- **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Deferred (strategy.md §9 exhausted-approaches; not traceability-relevant to this angle).

## Classifications (this iteration)

### P2-005 reclassified — FROZEN-by-design, not a defect
- **Prior framing:** "035 fixture corpus still contains deep-alignment prompt mirrors (out of 025 scope, observation)."
- **Classification:** The 035 `002-deterministic-fixtures-oracle` corpus is a **FROZEN snapshot**, not a live baseline. Evidence: spec.md REQ-004 (P1) "Freeze each fixture expected defect code and location from the verified oracle"; §3 SCOPE "Freeze expected defect codes and locations from the verified reference oracle"; §6 RISK "Fixture staleness as command shapes evolve, mitigated by a regenerable mutation manifest" — the `mutation-manifest.json` is the regenerator; the frozen expectations are the test oracle the production adapter is measured against (REQ-001 non-circularity: "authored before any adapter code so the deterministic adapter cannot validate itself").
- **Consequence:** The 16 `deep-alignment.md` mirrors under `fixtures/corpus/{public,held-out,base}/.../.codex/prompts/` (incl. `clean-control`, `held-out-orphan-mirror`, `base/clean-command-tree`) are **intentional frozen historical command-surface inputs** capturing the now-deleted deep-alignment command shape. They are correct, not a gap. Refreshing them to delete the deep-alignment mirrors would DEFEAT the oracle's purpose (it would erase the historical defect corpus the adapter is scored against). The 025 removal correctly left them untouched.
- **[SOURCE:** `specs/system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle/spec.md:69-73` (REQ-001/REQ-004); `:86-91` (RISK); `fixtures/mutation-manifest.json` (regenerator, not the frozen expectations)**]**
- **Disposition:** P2-005 reclassified as ruled_out / frozen-by-design. The finding's own "out of 025 scope, observation" framing was already correct; the traceability angle confirms the mirrors are frozen-correct, not stale.

### Generated-metadata provenance — coherent (observation, no new finding)
- **canary-cases.v1.json (002-system-deep-loop):** 8849444aa6 edited it (33± lines); post-edit it carries 0 `alignment` refs. Coherently updated. ✓
- **registry-compiler.cjs (002-system-deep-loop):** 8849444aa6 edited it (11± lines) AND removed `deep-loop-registry-compiler.vitest.ts` (-23 lines) — compiler + fixture + test updated together as a coherent triple. ✓
- **command-bridges.generated.json:** declares `generatedBy: "scripts/command-bridges/derive-command-bridges.cjs"`; 8849444aa6 removed 30 lines; post-edit 0 `alignment` refs. Declared generator consistent with content TODAY. ✓
- **skill-graph.json:** 8849444aa6 edited it (2± lines) to remove deep-alignment family refs. The single remaining `alignment` match is the keyword `"alignment verifier"` (a capability tag, e.g. for spec-alignment verification), NOT a deep-alignment residue. NOTE: skill-graph.json carries a `generated_at: 2026-08-10T12:19:10` field (pre-removal, now stale) but NO `generated_by` field and no generator script was found under `system-skill-advisor/mcp-server/scripts` — its provenance is ambiguous (hand-maintained despite the `generated_at` naming). This ambiguity is **pre-existing** (the `generated_at` timestamp predates all 7 commits) and **outside 025 scope** (the 7 commits did not introduce it; 8849444aa6's surgical edit was coherent with the removal). Recorded as an observation, not a new P2 — raising it would expand scope beyond the seven-commit audit.
- **[SOURCE:** `git show --stat 8849444aa6` (generated-metadata file list); `command-bridges.generated.json:2` (`generatedBy`); `skill-graph.json:1` (`generated_at`, `"alignment verifier"` keyword); `canary-cases.v1.json` (0 alignment refs)**]**

## Ruled-Out Directions (this iteration)
- **023/024 spec-code drift:** Both spec packets are consistent with their respective commits (1 and 2). 024's reference to `deep-alignment-auto.yaml` is a correct historical record of commit 2's deliverable; its subsequent deletion by commit 3 is separately documented by the 025 packet. No spec-code drift. RULED OUT.
- **Generated-metadata incoherence from 8849444aa6:** The compiler + canary fixture + vitest triple was updated coherently; command-bridges.generated.json regenerated/updated consistently with its declared generator; skill-graph.json's stale `generated_at` is pre-existing provenance ambiguity, not an 8849444aa6-introduced incoherence. RULED OUT as a 025-scope finding.
- **P2-005 as a real gap (frozen-fixture mirrors):** The 035 corpus is frozen-by-design (REQ-004); the deep-alignment.md mirrors are correct historical fixtures. RULED OUT as a defect.

## SCOPE VIOLATIONS
None. All writes confined to the allowed iteration/delta/strategy paths.

## Verdict
No new P0, P1, or P2 findings this iteration. The three focus items resolved as one reclassification (P2-005 → frozen-by-design, ruled out), one provenance observation (skill-graph.json `generated_at` ambiguity, pre-existing and out of 025 scope), and one ruled-out direction (023/024 spec-code drift). Prior P2-001…P2-012 carry forward unchanged (P0=0, P1=0, P2=12 cumulative).

Review verdict: PASS
