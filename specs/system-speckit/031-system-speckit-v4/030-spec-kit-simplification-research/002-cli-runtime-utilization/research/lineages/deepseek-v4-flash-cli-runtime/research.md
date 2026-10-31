---
title: "Research: round two — remediation verification, round-one gap hunting, kept-row re-examination"
description: "Canonical synthesis of the deepseek-v4-flash-cli-runtime detached fan-out lineage: 21 findings (0 P0 / 15 P1 / 6 P2) over 10 iterations on the tree AFTER the 007/008 remediation, verdict-first, every claim traceable to a cited line."
trigger_phrases:
  - "cli runtime utilization round two findings"
  - "remediation verification findings"
  - "spec-kit cli post-remediation audit"
---

# Research: round two — remediation verification, round-one gap hunting, kept-row re-examination

<!-- ANCHOR:verdict -->
## 1. VERDICT

The package's own tests had dead code too, and round one missed it — twelve rounds of evidence:

1. **The remediation landed.** All 31 paths 007 deleted are absent from the checked-in tree; zero live references to any of them anywhere in `.opencode`/`.github`; nothing in the tree, including the deep-loop playbook, claims the removed cli coverage-graph copy. 008's thirteen env-variable removals, the ENV-REFERENCE rows, the config.ts batch constants, the drift-test path fix and the deleted skill-level template are all complete. The three self-descriptions, the 39-rule/orchestrator-hop validation story, `post_save_write`, the sibling-lane rule headers, the ops README, the six spec-kit-check.yml paths — all landed and all real.
2. **The remediation left four document/fixture lines behind** (findings 1-4): the biggest is a SECOND env-variable document that 008's census never touched — `references/config/environment-variables.md:178` still teaches `SPECKIT_ROLLOUT_PERCENT` as "read by `getRolloutPercent()`", and `getRolloutPercent` exists nowhere in code; the only hit for the function name is the document itself. Second: two documents still document the LOOSER phase-parent regex the fix claimed to eliminate everywhere. Third and fourth: three test fixtures still advertise `SPECKIT_ADAPTIVE_FUSION`, and ARCHITECTURE.md:77's tree tag still says "indexing".
3. **Round one's registry-direction check missed the script direction.** `rules/check-doc-pointers.sh` — registered in nothing, cited in nothing, executed by nothing; the only rules/ check script in that state (finding 6). And the round-one counting of "productive files" in codex/pi/ missed that the pi/ half of the mirror family has NEVER been wired (finding 15).
4. **Round one's per-directory verdicts left whole files uncounted** — six dead modules and one dead directory they certified as "wired": core/alignment-validator.ts (a same-name twin of the live spec-folder validator), the three utils (workspace-identity, validation-utils, phase-classifier shim), observability/live-session-wrapper.ts, lib/cli-capture-shared.ts (an extraction whose named modules no longer exist), lib/validator-registry.ts (a loader the engine doesn't use), and optimizer/ (7 files, test-only — round one's "3 agent-definition callers" are not in this tree).
5. **One round-one kept row is superseded**: the resource-map extractor is wired end to end — deep-research-auto.yaml and deep-review-auto.yaml invoke `reduce-state.cjs --emit-resource-map`, which imports `emitResourceMap` from `system-deep-loop/shared/synthesis/resource-map.cjs`, which re-exports the cli extractor. "Wiring waits for lane 004" has no remaining object (finding 14).
6. **Everything else about round one's record survived**: its dropped rows (trigger-extractor, js-yaml counts) held after recount; its kept decisions (sweep-track-roots documented, the save-path phase-parent copy justified, the retrofit moved, the four sweeps remain four, the acceptance harnesses stay documented) all held; its 19 no-caller certificates needed no revision.

The systemic pattern round one named — *copies accreted where seams existed, then tests paid to patrol the difference* — still describes the current tree, but the second round's pattern is narrower: **the decommission's orphans** (one-time-migration files, capture-era helpers, dead compat shims, twin validators) and **the unverifiable wiring claims** (doc-listed "standalone" tools whose exec paths disappeared when their consumers were rewired).

<!-- /ANCHOR:verdict -->
<!-- ANCHOR:removal -->
## 2. THE REMOVAL LIST (ranked by confidence that nothing documented depends on it)

Every member was certified at full sweep (`.opencode` + `.github`, code, tests, docs, fixtures included; self-mentions counted honestly). Certification pass: iteration 10 (all candidates verified present in the tree before recommendation).

| # | Target | Evidence (path:line) | Confidence |
|---|--------|----------------------|------------|
| 1 | `rules/check-doc-pointers.sh` | Zero occurrences of its name anywhere in the repo content (registry grep 0; no checker, hook, plugin, workflow, README or feature-catalog row) — the ONLY rules/ check script unregistered and uncalled | **High** — nothing documented depends on it (nothing documents it) |
| 2 | `utils/phase-classifier.ts` | Pure re-export shim of `../lib/phase-classifier.js`; zero importers (production or test — tests/test-scripts-modules.js:569 explicitly tests the canonical `lib/` location); barrel never exports it | **High** |
| 3 | `utils/workspace-identity.ts` (218L, 5 exports) | Zero importers; reachable only via the partial barrel whose sole production consumer imports two unrelated names; only usage site is tests/workspace-identity.vitest.ts:13 | **High** — dead memory-pipeline survivor, same profile as the 007-removed rank-memories |
| 4 | `core/alignment-validator.ts` (227L) | Zero production importers (sole importer: tests/test-naming-migration.js, which no npm lane runs); same-name live twin is spec-folder/alignment-validator.ts (712L, folder-detector.ts:28) | **High** |
| 5 | `observability/live-session-wrapper.ts` | One reference: its own README row; zero importers, zero tests; the measurement pipeline's committed outputs are consumed only by retrieval fixtures + the three smart-router vitest suites (acceptance evidence, not a live mechanism) | **High** |
| 6 | `utils/validation-utils.ts` (83L) | Zero production importers; the single consumer is tests/test-scripts-modules.js:177-186; it validates RENDERED output — the orphan of the 007-removed renderers/ | **High** — verify the legacy test's T-002d/T-002e block goes with it |
| 7 | `graph/migrate-generated-json.ts` | Zero production importers (only tests/migrate-generated-json.vitest.ts:14); core/spec-root-registry.ts:105 is a ledger string; same class as 007's removed migrate-deep-research-paths | **High** — unless the migration manifest still names it |
| 8 | `lib/cli-capture-shared.ts` | Zero references repo-wide; its own header names capture modules (claude-code/opencode-cli/copilot-cli) that do not exist in the tree | **High** |
| 9 | `lib/validator-registry.ts` (53L) | Zero importers; the engine reads validator-registry.json directly (runtime/lib/validation/orchestrator.ts:76,230); the doc-count test reads the JSON via fs | **High** (or merge: rewire the orchestrator through it — one loader, one type surface) |
| 10 | `cli/check-links.sh` (root shim) | "Preserve existing call paths" — but the only real caller (post-edit-router.cjs:40) execs `rules/check-links.sh` directly; the shim's citations are a feature-catalog row + a comment. Repoint the doc row and remove the shim | **High** |
| 11 | `pi/sync-agents-pi.cjs` + `pi/sync-prompts-pi.cjs` | Zero executable callers; not in doctor routes (_routes.yaml:167-186), not in spec-kit-check.yml; cli-pi skill docs only | **High** — IF the pi mirror is still wanted, wire the `--check` pair into the doctor route + CI instead (that makes it a fix, not a removal) |
| 12 | `optimizer/` (7 files incl. manifest + README) | Zero exec callers repo-wide; .opencode/agents + /modes contain zero "optimizer" mentions (round one's "3 agent-definition callers" absent); the five cli vitest suites are the only consumers | **Medium-high** — the suites keep it documented; if the deep-loop agent-improvement lane wants it, relocate rather than delete |
| 13 | `codex/generate-command-routers.cjs` | No exec caller; validate-command-references.cjs does not reference it; sk-doc contract + codex/README + a fixture mention it | **Medium** — doc-referenced |
| 14 | `tests/test-naming-migration.js` | Runs under no npm lane (not vitest include glob, not test:legacy, not test:validation); exists only to exercise the dead core/alignment-validator.ts | **High** — ship with row 4 |
| 15 | `reference row` — `references/config/environment-variables.md:178` (SPECKIT_ROLLOUT_PERCENT + getRolloutPercent) | The row is a document line: remove, not a file | **High** (document) |

Total: 12 files + 1 directory + 1 document row (+2 pi files conditional). Contrast with round one's ~30 files + 2 directories: the second round's debt is the decommission's orphans, not the package's live surface.

<!-- /ANCHOR:removal -->
<!-- ANCHOR:merge -->
## 3. THE MERGE LIST

| # | What merges into what | Evidence | Confidence |
|---|----------------------|----------|------------|
| 1 | `lib/validator-registry.ts` → the engine's registry load | orchestrator.ts:76 re-implements what the module's loadValidatorRegistry does; one type surface | Medium (alternative to removal row 9) |
| 2 | `core/alignment-validator.ts`'s tree-thinning → the live `spec-folder/alignment-validator.ts` | same-name twins; the extraction from workflow.ts never got wired back | Medium (if the logic is wanted; removal is the alternative) |
| 3 | `utils/validation-utils.ts` → nothing (drop, after the legacy test block) | its renderer-era job is gone; the placeholder rules explicitly exclude mustache | High — this is a removal, listed for completeness with its test dependency |
| 4 | (No new cross-package merges this round.) | The round-one merge candidates were re-checked: coverage-graph copy (already resolved), quality scorers (already resolved), registries (already resolved), repo-root ×3 (kept — shell cannot import ESM), phase-parent ×3 (kept — save-path copy's extra semantics documented in the file itself), template mechanisms (kept — two jobs), four sweeps (kept — no shared logic), js-yaml lane (kept — 3 production importers, drop would need a shared YAML lane for all three) | — |

<!-- /ANCHOR:merge -->
<!-- ANCHOR:fix -->
## 4. THE FIX LIST — the remediation residuals (what 007/008 left behind)

| # | The leftover | The correction | Evidence |
|---|--------------|----------------|----------|
| 1 | `references/config/environment-variables.md:178` | Remove the SPECKIT_ROLLOUT_PERCENT row (and check the section for neighbors of the same class) — the variable was removed from .env.example and runtime/ENV-REFERENCE.md; `getRolloutPercent` is a ghost | f-iter001-001 |
| 2 | `references/validation/template-compliance-contract.md:236`, `runtime/lib/spec/README.md:16` | Replace `^[0-9]{3}-[a-z0-9-]+$` with the enforced `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` — both files contain zero occurrences of the enforced form | f-iter002-001 |
| 3 | Three fixtures: test-fixtures/{002,003,004}-valid*/implementation-summary.md:119 | Drop the "Set SPECKIT_ADAPTIVE_FUSION=false" sentence | f-iter001-002 |
| 4 | ARCHITECTURE.md:77 tree tag "CLI generation, validation, indexing, evals" | Align with the sentence at ARCHITECTURE.md:23 — the package no longer indexes | f-iter001-003 |
| 5 | spec-kit-check.yml coverage boundary | Add `npm run test:legacy`/`test:validation` (or the equivalent) and `--project root` (runtime/tests, 88 files), or narrow the 007 summary's "the test suites" claim | f-iter005-001 |
| 6 | pi/ mirror drift | Wire pi/sync-{agents,prompts}-pi.cjs `--check` into doctor _routes.yaml + spec-kit-check.yml, or document the pi mirrors as unmanaged | f-iter007-001 |
| 7 | frontmatter.mjs:6-8 reason path | `scripts/lib/frontmatter-migration.ts` → `runtime/cli/lib/frontmatter-migration.ts` | f-iter009-003 |
| 8 | The confirmed-findings record (packet-level) | Mark resource-map row 10 superseded (wiring exists via the reducer chain); mark the 007 summary's claim precisely | f-iter006-002 |

<!-- /ANCHOR:fix -->
<!-- ANCHOR:question-verdicts -->
## 5. THE CHARTER VERDICTS

1. **Remediation verification** — 007/008 landed at the file/reference level; the residuals are FOUR document/fixture lines plus one CI-coverage boundary claim (findings 1-5, 12). "A fix that left one consumer, one document line, one fixture or one asset behind" — three of the four classes materialized exactly as the charter predicted.
2. **Round-one misses** — eleven items, dominated by two pattern classes: (a) checks/counts verified only in the registry→script direction (check-doc-pointers.sh, the pi/ wiring, the optimizer agent-callers claim); (b) files inside directories round one certified as a whole but never enumerated per-file (utils/, lib/, observability's wrapper, the two twin validators, the root shim).
3. **Kept-row re-examination** — one row overturned with new evidence (resource-map wiring), every other kept row held under direct verification (iteration 8); round one's dropped rows re-verified as still-correct.
4. **The package framing** — the round-one verdict (three things wearing one name) survives; the second-round finding is that its decommissioned past is TOO well preserved: one-time migrations, capture-era helpers and compat shims still occupy lib/ and utils/ with their tests, and the tests+docs keep them warm. The removal bill is 12 files + 1 directory — a tenth of round one's.

<!-- /ANCHOR:question-verdicts -->
<!-- ANCHOR:residuals -->
## 6. RESIDUALS (stated honestly)

- **Dynamic string-concatenated imports** were not swept — the same bounded caveat as round one; every no-caller claim carries it implicitly.
- **Worktree-scoped facts** (dist/node_modules symlinks to the absolute main checkout; `.opencode/specs` → ../specs vs the runbook's described topology) are asserted as observations, not findings — verifying the runbook's intent against the main checkout was outside this tree's evidence.
- **The 007-side "ten regex sites"** were counted at 15+ enforced-form occurrences; the full set was not enumerated per-file (only the two looser-form survivors matter for the record).
- **The `.opencode/specs` retirement runbook** (references/spec-root-alias-retirement-runbook.md): zero live references (fixture enumerations only); its content describes a topology that does not match this tree. Not filed — worktree-unverifiable. If the alias state is as the runbook says in the main checkout, it is a documented manual tool (keep); if not, it is a stale runbook (remove).

<!-- /ANCHOR:residuals -->
<!-- ANCHOR:provenance -->
## 7. PROVENANCE

- Lineage: deepseek-v4-flash-cli-runtime, session fanout-deepseek-v4-flash-cli-runtime-1788759071033-5hbquq, generation 1, detached fan-out (artifact root = THIS directory, bound via the config.fanout_lineage_artifact_dir override; the resolveArtifactRoot node skipped per the invocation contract — never run; writes remained inside the lineage directory except reads).
- Ten iterations, each: iterations/iteration-NNN.md (narrative + findings + sources) + deltas/iter-NNN.jsonl (machine records) + one state record per iteration in deep-research-state.jsonl + reducer refresh (findings-registry.json, deep-research-strategy.md, deep-research-dashboard.md).
- 21 registered findings (0 P0 / 15 P1 / 6 P2); 8/8 charter questions resolved; every no-caller claim distinguishes none-found from caller-not-checked; every remediation-incompleteness finding verified in the checked-in tree with path:line.
- newInfoRatio trend: 1.00, 0.90, 0.90, 0.95, 0.85, 0.95, 0.90, 0.50, 0.85, 0.60 — convergence telemetry only; the loop rode to the configured maximum under the max-iterations stop policy (convergenceThreshold 3 on a capped-1.0 scale is unreachable, the intended reading of the invocation). The terminal synthesis record carries **stopReason "maxIterationsReached"**.
- Stops honored: no writes outside this lineage directory; no generate-context.js, no validate.sh, no node tooling, no git write/checkout/commit; the executor ran INLINE (this session — no nested CLI, agent, or Task dispatch; the workflow's per-iteration executor steps were satisfied by this process). dist/ and node_modules/ (symlinks to the main checkout) were treated as build output and never used as evidence; the checked-in source was the evidence surface, per the invocation contract's worktree warning.

<!-- /ANCHOR:provenance -->
