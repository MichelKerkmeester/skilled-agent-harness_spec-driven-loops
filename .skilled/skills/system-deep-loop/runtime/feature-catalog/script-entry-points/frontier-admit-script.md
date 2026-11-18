---
title: "frontier-admit.cjs"
description: "Owns the expansive frontier node store: seeds depth-1 nodes, admits or prunes leaf proposals through six ordered checks, closes nodes, renders the frontier prompt block and projects the store to graph events."
trigger_phrases:
  - "frontier-admit.cjs"
  - "frontier node store"
  - "frontier-nodes.jsonl"
  - "frontier admission checks"
  - "expansive frontier seed budget"
version: 1.0.3.0
---

# frontier-admit.cjs

---

## 1. OVERVIEW

Owns the expansive frontier node store: seeds depth-1 nodes, admits or prunes leaf proposals through six ordered checks, closes nodes, renders the frontier prompt block and projects the store to graph events.

This feature belongs to the script entry points group. The orchestrating workflow calls it. Leaves only propose, and they never call it.

---

## 2. HOW IT WORKS

### Commands

The CLI takes one command and value flags. The commands are `seed`, `admit`, `close`, `graph` and `block`. Every command needs `--artifact-dir`. `--target research|review` picks the loop, and it defaults to `research`. Research reads `deep-research-config.json` and review reads `deep-review-config.json`. A missing config means the defaults apply. A config that exists but cannot be read or parsed is an error.

- `seed --input <file>` reads a JSON array of candidates and places each one at depth 1 under the synthetic `root`. `--max-iterations-source` says where the run's budget came from, and it defaults to `default`.
- `admit --input <file>` reads the `frontier_proposal` rows of an iteration delta and runs them through admission.
- `close --node-id <id> --status <status>` appends a new row for that node with the given status and an optional `--reason`. The status must be `active`, `answered`, `blocked`, `exhausted`, `abstained` or `pruned`. A node admission pruned can be closed only as `pruned`, since it never reached the inbox.
- `graph --output <file>` writes the graph projection of the store.
- `block` prints the frontier prompt block. Research needs `--focus`. Review needs `--node-id` and takes an optional `--dimension`.

`seed`, `admit` and `close` also take `--iteration`, a non-negative integer. `seed` and `admit` take `--known-texts`, a file that must hold a JSON array of question texts that count for dedupe. The record commands print one JSON result. `block` prints raw prompt text. Any error goes to stderr, prefixed `[frontier-admit]`, and exits 2.

### Node Store

The store is `frontier-nodes.jsonl` in the artifact directory. It is append-only, one JSON object per line, and the last row per `nodeId` wins. `readNodeStore` skips a torn or malformed line so the rows after it still count. A store that exists but cannot be read is an error, never an empty frontier. Node ids take the form `F-{depth}-{NNN}`.

A research admission also appends one row to `inbox.jsonl` with `origin` `frontier`. A review run writes no inbox row. The store alone queues its nodes.

### Admission Checks

`checkProposal` runs six checks in a fixed order. The first one that fails prunes the proposal, and its name becomes the prune reason.

1. `relevance` fails a proposal with no question, no evidence or no usable scope. It also fails a parent that is not in the store or was pruned. On review, a file-list target narrows relevance to scopes inside that target, and a commit-range target narrows it to the files the range touches, read from `reviewScopeFiles` as one list or as named lists by kind. A `.` or `./` target names the repo root, which holds every path that does not climb out of it, and a glob entry such as `src/**/*.ts` is bounded by the directory before its first glob segment.
2. `dedupe` fails a question whose normalized key matches any stored node, in any status, or any known text. A leading id such as `Q3:` is dropped before the match.
3. `depth` fails a proposal past `maxDepth`.
4. `fanout` fails a parent that already holds its child cap. It also fails when the live node count has reached the run-wide node cap.
5. `budget` fails a proposal whose `budget` is above the budget its parent recorded. An admitted proposal keeps its `budget` on the row for that reason. The root records no budget, so a depth-1 proposal is never budget-checked.
6. `cycle` fails a proposal whose parent chain loops or runs past the depth cap.

A pruned proposal is still written to the store with status `pruned` and its reason. It never reaches the inbox.

### Seeding

A run is seeded once. When the store already holds a depth-1 node, `seed` returns `skipped: 'already-seeded'`. The seed pass answers to the root-children cap but is exempt from the run-wide node cap. The root-children cap is the larger of the per-node cap and 6 for research or 8 for review. A review candidate may carry its own `pruneReason`, and it is stored as pruned with that reason. Research ignores the field.

### Caps And Budget

`readCaps` returns `maxDepth` (default 3), `maxChildrenPerNode` (default 6), `maxRootChildren` and `maxFrontierNodes`. The node cap is half of the config's `maxIterations`, never below 1, or 10 when no `maxIterations` is set. `expansiveDepth.maxFrontierNodes` overrides it.

`seed` returns the result of `seedBudget` with the admission result. Only a `default` budget source derives a budget. Any other source keeps the configured value, even below the derived one. `expansiveBudget` derives `min(24, max(loopDefault, 2 × perNode × (S + maxDepth − 1)))`. S is the count of live depth-1 nodes. The loop default is the config's `maxIterations` when set, else 10 for research and 7 for review. Per-node cost is 1 for research. For review it is the size of the reducer's dimension universe (`buildDimensionUniverse`): the canonical four plus each distinct custom name in `reviewDimensions`, so never below four. When S is 0 the loop default stays. The result also holds `growthSlots`, the node cap left past depth 1, and a `warning` when none is left. The CLI writes the budget line to stderr.

### Prompt Block

`renderFrontierBlock` builds the FRONTIER block a leaf prompt carries. Research finds the node from a focus string that starts `Frontier node <id>`. Review takes the node id directly. The block names the node, its depth and scope, and how many `frontier_proposal` rows the leaf may append. That slot count is the smaller of the node's free child slots and the free run-wide slots. A node at the depth cap or with no slot left is told not to propose children. An unknown or closed node gets an empty block.

### Graph Projection

`buildFrontierGraphEvents` turns the store into coverage graph events. An open, active or answered node becomes a QUESTION node. An exhausted, blocked or abstained node is re-kinded to a CLAIM with `verification_status` `closed`, so an unanswered close does not hold question coverage down. Pruned nodes are not written. A child links to its written parent with a DERIVED_FROM edge. `graph` writes the events as one JSON array, the shape `upsert.cjs` parses.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/frontier-admit.cjs` | Runtime | Frontier node store and its CLI. `checkProposal`, `admitProposals`, `seedNodes`, `closeNode`, `readCaps`, `expansiveBudget`, `seedBudget`, `renderFrontierBlock` and `buildFrontierGraphEvents`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/frontier-admit.vitest.ts` | Unit | Check order and prune reasons, seeding, close, graph projection, block rendering, node cap and seed budget. |
| `tests/unit/frontier-admit-review.vitest.ts` | Unit | Review target relevance, review seeding and root cap, review block and the dimension-scaled budget. |
| `manual-testing-playbook/script-entry-points/frontier-admit-script.md` | Manual playbook | DLR-065: the CLI seeds, admits with a prune reason, closes and refuses to revive a pruned node. |

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `script-entry-points/frontier-admit-script.md`
- Primary sources: `scripts/frontier-admit.cjs`, `tests/unit/frontier-admit.vitest.ts`
Related references:
- [convergence-script.md](../../feature-catalog/script-entry-points/convergence-script.md) - convergence.cjs
- [upsert-script.md](../../feature-catalog/script-entry-points/upsert-script.md) - upsert.cjs
