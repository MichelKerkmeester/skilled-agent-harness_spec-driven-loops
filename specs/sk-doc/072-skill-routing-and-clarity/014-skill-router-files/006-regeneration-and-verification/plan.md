---
title: "Implementation Plan: Phase 6: regeneration-and-verification"
description: "Regenerate every derived artifact in the routing stack from the post-move tree, then prove the move changed provenance and not routing by recapturing the scorer baseline, comparing two router replay reports and re-measuring the per-skill token table."
trigger_phrases:
  - "regeneration and verification plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: regeneration-and-verification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node.js (CI pins 20), Python 3.9 |
| **Framework** | None |
| **Storage** | JSON derived artifacts, with the SQLite skill graph kept at runtime and gitignored |
| **Testing** | `validate.sh --strict`, the freshness CLI checks, vitest, pytest |

### Overview

Each derived family has one owner command, so the phase regenerates rather than edits: `generate-leaf-manifest.cjs` for the 13 manifests, `sync-skills-hermes.cjs` for the 65 Hermes copies, `compiled-route-manifest.cjs refresh` for the seven activation manifests, `init-skill-graph.sh` for the graph and `generate-trigger-index.mjs` for the index and its sidecars. Each derived family also has a read-only check, either the command's own `--check` mode or a separate gate, and each one recomputes the artifact and compares it byte for byte, which is the idempotence proof. The proof that routing did not move comes from three comparisons: the scorer baseline compared with 155/195, 49/66 and 19/24, the `leaf-route-replay.cjs` report compared with its twin and the per-skill token table compared with the research totals.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Every generator `--check` exits 0 twice in a row and the before and after replay reports are byte-identical
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Regenerate, then prove.

### Key Components
- **Owner commands**: `generate-leaf-manifest.cjs`, `sync-skills-hermes.cjs`, `compiled-route-manifest.cjs`, `init-skill-graph.sh` and `generate-trigger-index.mjs`, one per derived family, each writing only its own artifact.
- **Check twins**: `ci-leaf-manifest-freshness.cjs`, `ci-skill-root-metadata.cjs`, `ci-skill-derived-freshness.cjs`, `sync-skills-hermes.cjs --check`, `compiled-route-guard.cjs`, `skill-graph-freshness.cjs --strict` and `generate-trigger-index.mjs --check`, each recomputing an artifact and comparing bytes.
- **Captures**: `capture-scorer-eval-baseline.mjs` for the accuracy reading and `leaf-route-replay.cjs --report` for the routing projection, each run once before and once after regeneration.
- **Evidence set**: `scratch/` holds `baseline-before.json`, `baseline-after.json`, `replay-before/report.json`, `replay-after/report.json` and `token-savings-after.csv`.

### Data Flow

The authored tree under `.skilled/skills` and `.skilled/agents` is the source. An owner command reads it and writes one derived artifact: a manifest, a copy, a compiled export or an index. Its check twin recomputes the same artifact from the same source and exits nonzero on any byte difference, so a stale artifact is a failure and not a silent drift. The two captures read the same authored tree, once before the regeneration writes anything and once after, and the diff between them is the proof that only provenance moved.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the before state and both captures. Regeneration runs the owner commands in dependency order and ends with the trigger index. Verification reruns every check twin and compares the captures.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each derived family recomputes byte-identical | `ci-leaf-manifest-freshness.cjs`, `ci-skill-root-metadata.cjs`, `ci-skill-derived-freshness.cjs` |
| Integration | Compiled routing, Hermes copies, trigger index and the graph agree with the authored tree | `compiled-route-guard.cjs`, `compiled-route-sync.cjs --check`, `sync-skills-hermes.cjs --check`, `generate-trigger-index.mjs --check`, `skill-graph-freshness.cjs --strict` |
| Regression | Router paths, the surface map and playbook scenarios still resolve | `verify-router-sync.cjs` |
| Accuracy | The live scorer holds the committed baseline | `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` |
| Manual | Two replay reports and two baseline captures match | `diff scratch/replay-before/report.json scratch/replay-after/report.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 002 to 005 | Internal | Planned | No reader resolves the new router and every check here fails |
| `.skilled/skills/system-skill-advisor/runtime/dist` | Internal build | Green on this tree | The scorer capture and the graph compiler cannot import their runtime |
| `tiktoken` 0.11.0 with `o200k_base` | External package | Green on this tree | The token table cannot be re-measured and only word counts remain |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation` | Internal state | Green, 7 hubs fresh | The manifest refresh has no target and the guard cannot compare |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a check twin fails after regeneration on a tree that passed it before, or a replay report differs from its twin.
- **Procedure**: restore the derived files from the last green commit and rerun the owner command for the failing family. The authored tree is untouched by this phase, so no authored rollback is needed. If the activation manifests are involved, copy each authored twin back over its runtime manifest and rerun `compiled-route-guard.cjs`.
<!-- /ANCHOR:rollback -->

---
