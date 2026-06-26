---
title: "CLUSTER-001 -- OKLCH Clustering And Stability Classification"
description: "Validates OKLCH color clustering and L1-L4 stability classification. Confirms cluster.ts groups visually similar colors into named roles and assigns L1 (permanent/brand), L2 (system), L3 (campaign), L4 (content) stability classes that gate DESIGN.md inclusion."
version: 1.0.0.4
---

# CLUSTER-001 -- OKLCH Clustering And Stability Classification

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CLUSTER-001`.

---

## 1. OVERVIEW

This scenario validates OKLCH color clustering and L1-L4 stability classification for `CLUSTER-001`. It confirms `cluster.ts` groups visually similar colors in OKLCH space (deltaE < 3 threshold) into representative clusters with named roles, and that the `classifyTokenStability` function assigns every `colorToken` a valid `stability.layer` value (one of `infrastructure`, `system`, `campaign`, or `content`) with the corresponding stability classification signals. The test suite in `cluster.test.ts` validates the unit-level functions (`parseColor`, `rgbaToHex`, `wcagContrast`, `deltaE`, `splitShadowLayers`, `classifyShadow`, `mergeTokenSets`) in isolation. The real-output check confirms the full pipeline writes `stability` objects to `tokens.json`.

### Why This Matters

Stability classification (L1-L4) is the gatekeeper for Style Reference inclusion. L1 (permanent/brand) and L2 (system) tokens populate the named token tables. L3 (campaign) tokens appear under a "Subject to change" sub-table. L4 (content) tokens are excluded entirely. If clustering misclassifies a brand color as L4, the Style Reference omits it silently. If a one-off content color leaks in as L1, downstream AI agents treat it as a permanent design-system token. The failure mode this guards against is a degenerate clustering pass that assigns every token to L2 or leaves `stability` undefined, making the stability gate meaningless. (Clustering mechanics are unchanged by the v3 output format; only the document the classified tokens flow into changed.)

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `CLUSTER-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm clustering and stability classification produce correct L1-L4 assignments and sane role groupings in tokens.json
- Real user request: `Confirm the color tokens are clustered and stability-classified correctly.`
- Prompt: `Confirm the color tokens are clustered and stability-classified correctly.`
- Expected execution process: run the vitest cluster test suite to confirm unit-level functions pass, then inspect a real `<--output>/tokens.json` to verify every `colorToken` has a valid `stability` object with a `layer` field (one of `infrastructure`, `system`, `campaign`, `content`), a `confidence` number between 0 and 1, and non-empty `signals`
- Expected signals: `npx vitest run cluster` exits 0 with all cluster tests passing; `tokens.json` contains `colorTokens[]` where each token has `stability.layer` (L1-L4) and `cssVariableNames`; clustering is not degenerate (fewer than 5 color clusters is a warning)
- Desired user-visible outcome: the agent reports that the cluster test suite passed and that a given tokens.json carries L1-L4 classifications with sane role grouping (e.g., brand colors at L1, text/background colors at L2)
- Pass/fail: PASS if cluster.test.ts passes AND tokens.json `colorTokens[].stability.layer` values are all valid stability layers (infrastructure/system/campaign/content) with non-empty signals; FAIL if `stability` is missing on any token OR clustering produces only one cluster for distinctly different colors OR the vitest suite fails

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Clustering and stability checks stay local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Wave 1 (SETUP-001) must be PASS. The `backend/node_modules/` directory must exist and the vitest runner must be available. A prior extraction must have produced `<--output>/tokens.json`; if none exists, run `npx ts-node .opencode/skills/sk-design/md-generator/backend/scripts/extract.ts <url> --fast --output .opencode/specs/<track>/<packet>/output` first.

1. verify tool readiness: `bash: node --version`, glob `backend/node_modules/`  # -> Node 20+, node_modules exists
2. `cd .opencode/skills/sk-design/md-generator/backend && npx vitest run cluster`  # -> exits 0, all cluster tests pass
3. `bash: ls <--output>/tokens.json` (run from the repo root)  # -> file exists
4. `bash: node -e "const t = require('./<--output>/tokens.json'); const layers = t.colorTokens.map(c => c.stability?.layer); console.log('total colors:', t.colorTokens.length, '| L1:', layers.filter(l => l === 'infrastructure').length, 'L2:', layers.filter(l => l === 'system').length, 'L3:', layers.filter(l => l === 'campaign').length, 'L4:', layers.filter(l => l === 'content').length, '| missing stability:', layers.filter(l => !l).length)"` (run from the repo root)  # -> all tokens have stability.layer, L1/L2 present
5. agent reports cluster test pass and stability distribution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLUSTER-001 | OKLCH clustering and stability classification | Verify cluster.ts groups colors in OKLCH space and assigns L1-L4 stability classes | `Confirm the color tokens are clustered and stability-classified correctly.` | 1. verify tool readiness (`node --version`, check `backend/node_modules/`) -> 2. `cd backend && npx vitest run cluster` -> 3. `ls <--output>/tokens.json` -> 4. `node -e "...` inspect stability.layers -> 5. agent reports cluster pass + stability distribution | Step 1: Node 20+, tool dependencies present. Step 2: vitest exits 0, all cluster tests pass (parseColor, rgbaToHex, wcagContrast, deltaE, splitShadowLayers, classifyShadow, mergeTokenSets). Step 3: tokens.json exists. Step 4: every colorToken has stability.layer (infrastructure/system/campaign/content) with confidence and signals. Step 5: agent reports L1-L4 counts. | Transcript of `vitest run cluster`, node inspect output of tokens.json stability, stability layer distribution | PASS if cluster.test.ts passes AND tokens.json colorTokens[].stability.layer values are all valid AND no token is missing stability. FAIL if vitest fails OR stability is missing on any token OR clustering is degenerate (single cluster for different colors) OR L1/L2 count is zero on a real site | 1. If vitest fails, check `backend/vitest.config.ts` includes `tests/**/*.test.ts`. 2. If stability is missing, confirm the extraction pipeline ran `classifyTokenStability()` after `clusterTokens()`. 3. If all tokens are L3 or L4, the site may be content-heavy with no design system; try a known design-system site (e.g., linear.app, vercel.com). 4. If only one cluster exists, check `deltaE` threshold (should be < 3) and confirm culori OKLCH conversion works. |

### Optional Supplemental Checks

For a deeper stability audit, run `cd backend && npx vitest run cluster` with `--reporter verbose` to see each unit test case output. Inspect a single `colorToken` by running `node -e "const t = require('./<--output>/tokens.json'); console.log(JSON.stringify(t.colorTokens[0].stability, null, 2))"` to confirm the `signals` array explains the classification (e.g., `pages: 100%`, `text/border usage`, `css-var: --color-brand`). Cross-check that tokens with `cssVariableNames` populated are never classified as L4.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../backend/scripts/cluster.ts` | Token clustering orchestrator: deltaE grouping, L1-L4 classification, mergeTokenSets |
| `../../backend/tests/cluster.test.ts` | Vitest suite: unit tests for parseColor, rgbaToHex, wcagContrast, deltaE, splitShadowLayers, classifyShadow, mergeTokenSets |
| `../../backend/vitest.config.ts` | Vitest config: includes `tests/**/*.test.ts` |
| `../../backend/scripts/extract.ts` | Extraction orchestrator: calls clusterTokens and classifyTokenStability during Phase 1 |
| `../../backend/scripts/types.ts` | StabilityClassification type: layer, confidence, signals |
| `../../SKILL.md` | §3 Token Stability Classes (L1-L4) — classification table and DESIGN.md treatment |

---

## 5. SOURCE METADATA

- Group: Cluster
- Playbook ID: CLUSTER-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--cluster/oklch-clustering.md`
