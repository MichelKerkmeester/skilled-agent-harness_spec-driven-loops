---
title: "frontier-admit.cjs"
description: "Owns the expansive frontier node store: seeds depth-1 nodes, admits or prunes leaf proposals through seven ordered checks, closes nodes, renders the frontier prompt block and projects the store to graph events."
trigger_phrases:
  - "frontier-admit.cjs"
  - "frontier node store"
  - "frontier-nodes.jsonl"
  - "frontier admission checks"
  - "expansive frontier seed budget"
version: 1.0.11.0
---

# frontier-admit.cjs

---

## 1. OVERVIEW

Owns the expansive frontier node store: seeds depth-1 nodes, admits or prunes leaf proposals through seven ordered checks, closes nodes, renders the frontier prompt block and projects the store to graph events.

This feature belongs to the script entry points group. The orchestrating workflow calls it. Leaves only propose, and they never call it.

---

## 2. HOW IT WORKS

### Commands

The CLI takes one command and value flags. The commands are `seed`, `admit`, `close`, `graph`, `block`, `budget` and `scope`. Every command needs `--artifact-dir`. `--target research|review` picks the loop, and it defaults to `research`. Research reads `deep-research-config.json` and review reads `deep-review-config.json`. A missing config means the defaults apply. A config that exists but cannot be read or parsed is an error.

- `seed --input <file>` reads a JSON array of candidates and places each one at depth 1 under the synthetic `root`. `--max-iterations-source` says where the run's budget came from, and it defaults to `default`. `--max-iterations <N>`, a positive integer, is the bound budget and wins over the root config's `maxIterations`, because a fan-out seed runs before its root config is written.
- `admit --input <file>` reads the `frontier_proposal` rows of an iteration delta and runs them through admission.
- `close --node-id <id> --status <status>` appends a new row for that node with the given status and an optional `--reason`. The status must be `active`, `answered`, `blocked`, `exhausted`, `abstained` or `pruned`. A node admission pruned can be closed only as `pruned`, since it never reached the inbox. A node already closed as `answered`, `blocked`, `exhausted` or `abstained` accepts only a repeat of that status, so a settled node never reopens through `close`.
- `graph --output <file>` writes the graph projection of the store.
- `block` prints the frontier prompt block. Research needs `--focus-file <file>`, a file holding the focus line. The workflow writes it with its file tool, so the focus text, which can carry a question a leaf proposed, never reaches a shell argument. `--focus` is gone. Review needs `--node-id` and takes an optional `--dimension`.
- `budget` sizes a defaulted expansive budget from the seed (`seedBudget` with source `default`), writes `maxIterations` into the target's config by temp-file rename when it differs, and prints `{derivedMaxIterations, growthSlots, warning?}`. A missing config exits 2. `step_frontier_budget` in both workflows runs it.
- `scope` writes `git diff --name-only <range> -- <pathspec>` into `reviewScopeFiles` for a commit-range review target and prints `{touchedFiles, range, pathspec}` or `{skipped}`. `step_frontier_scope` runs it right after config creation, on every fan-out lineage too; a target that is not a commit range is left untouched.

`seed`, `admit` and `close` also take `--iteration`, a non-negative integer. `seed` and `admit` take `--known-texts`, a file that must hold a JSON array of question texts that count for dedupe. The record commands print one JSON result, and so does `budget`. `block` prints raw prompt text. Any error goes to stderr, prefixed `[frontier-admit]`, and exits 2. Warnings also go to stderr with the same prefix and leave the exit at 0. `seed` reports its budget line there. `admit` reports each delta line it could not parse and skipped. `readNodeStore` reports each node-store line it could not parse and skipped as `[frontier-admit] warning: skipped frontier-nodes.jsonl line N: ...`.

### Node Store

The store is `frontier-nodes.jsonl` in the artifact directory. It is append-only, one JSON object per line, and the last row per `nodeId` wins. `readNodeStore` skips a torn or malformed line, reports its file and line on stderr, and the rows after it still count. A store that exists but cannot be read is an error, never an empty frontier. Node ids take the form `F-{depth}-{NNN}`.

A research admission also appends one row to `inbox.jsonl` with `origin` `frontier`. A review run writes no inbox row. The store alone queues its nodes.

### Admission Checks

`checkProposal` runs seven checks in a fixed order. The first one that fails prunes the proposal, and its name becomes the prune reason.

1. `relevance` fails a proposal with no question, no evidence or no usable scope. It also fails a parent that is not in the store or was pruned, and a question, or any scope entry, longer than 500 characters. Before the checks run, admission replaces every control character (U+0000-U+001F, U+007F) in the question and scope with a space and collapses repeated spaces, so the stored row, the focus line and the inbox text never carry a newline. On review, a file-list target narrows relevance to scopes inside that target: every word of a scope entry must lie inside, so free text after an in-target path fails. A target that holds a revision range (`base..tip` or `base...tip`) anywhere, even with a label around it such as `commit range base..tip (label)`, narrows it to the files the range touches, read from `reviewScopeFiles` as one list or as named lists by kind. An open-ended range such as `main..`, `..HEAD` or `origin/main...` reads as a range. A token with a `../` or `/..` path segment is never read as a range. A token that names a file or directory on disk, resolved against the working directory, is a path, so an existing `docs/notes..v2.md` is not a range, while slashed refs such as `origin/main..HEAD` or `feature/x...main` still are. A missing path of that shape reads as a range. A `.` or `./` target names the repo root, which holds every path that does not climb out of it, and a glob entry such as `src/**/*.ts` is bounded by the directory before its first glob segment.
2. `dedupe` fails a question whose normalized key matches any stored node, in any status, or any known text. The key is NFKC-normalized and lowercased, keeps the letters, digits and combining marks of every script, and collapses every other run to one space. A leading id such as `Q3:` or `F-1-001:` is dropped before the match.
3. `depth` fails a proposal past `maxDepth`.
4. `fanout` fails a parent that already holds its child cap.
5. `node-cap` fails when the live node count has reached the run-wide node cap. The seed pass skips this check.
6. `budget` fails a proposal whose `budget` is above the budget its parent recorded. A proposal budget must be a positive whole number; anything else reads as no budget. An admitted proposal keeps its `budget` on the row for that reason. The root records no budget, so a depth-1 proposal is never budget-checked.
7. `cycle` fails a proposal whose parent chain loops or runs past the depth cap.

A pruned proposal is still written to the store with status `pruned` and its reason. It never reaches the inbox.

### Seeding

A run is seeded once. When the store already holds a depth-1 node, `seed` returns `skipped: 'already-seeded'`. The seed pass answers to the root-children cap but is exempt from the run-wide node cap. The root-children cap is the larger of the per-node cap and 6 for research or 8 for review. A review candidate may carry its own `pruneReason`, and it is stored as pruned with that reason. Research ignores the field.

### Caps And Budget

`readCaps` returns `maxDepth` (default 3), `maxChildrenPerNode` (default 6), `maxRootChildren` and `maxFrontierNodes`. The node cap is half of the config's `maxIterations`, never below 1, or 10 when no `maxIterations` is set. `expansiveDepth.maxFrontierNodes` overrides it.

`seed` returns the result of `seedBudget` with the admission result. Only a `default` budget source derives a budget. Any other source keeps the configured value, even below the derived one. `expansiveBudget` derives `min(24, max(loopDefault, 2 × perNode × (S + maxDepth − 1)))`. S is the count of live depth-1 nodes. The loop default is the config's `maxIterations` when set, else 10 for research and 7 for review. Per-node cost is 1 for research. For review it is the size of the reducer's dimension universe (`buildDimensionUniverse`): the canonical four less traceability when `reviewDimensions` leaves it out, plus each distinct custom name in that list, so never below three. When S is 0 the loop default stays. The result also holds `growthSlots`, the node cap left past depth 1, and a `warning` when none is left. The CLI writes the budget line to stderr from `seed`, and `budget` prints the same fields as JSON on stdout after it writes the config.

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
| `scripts/frontier-admit.cjs` | Runtime | Frontier node store and its CLI. `checkProposal`, `admitProposals`, `seedNodes`, `closeNode`, `readCaps`, `expansiveBudget`, `seedBudget`, `writeSeedBudget`, `renderFrontierBlock` and `buildFrontierGraphEvents`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/frontier-admit.vitest.ts` | Unit | Check order and prune reasons, seeding, close, graph projection, block rendering, focus-file block CLI with shell metacharacters, proposal text limits, torn-row warning, budget CLI, node cap and seed budget. |
| `tests/unit/frontier-admit-review.vitest.ts` | Unit | Review target relevance including commit range with surrounding text, review seeding and root cap, review block and the dimension-scaled budget. |
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
