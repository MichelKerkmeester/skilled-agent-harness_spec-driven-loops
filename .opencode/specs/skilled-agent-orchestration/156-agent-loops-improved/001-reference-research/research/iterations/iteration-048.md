# Iteration 48: S6-09 Conflict Ownership For Injected Questions

## Focus

Dimension D4 synthesis for S6-09: decide who owns conflict resolution when an injected inbox question disagrees with the reducer's machine-owned `key-questions` rewrite. This builds on S4-01 without re-answering the already-covered inbox/provenance question.

## Actions Taken

1. Read the deep-research output contract and reducer ownership reference to confirm that iteration agents should write durable findings while reducer-owned files remain derived.
2. Checked prior S4-01 outputs so this pass would not duplicate the dedicated inbox and provenance backlog.
3. Inspected the current deep-research reducer path: `parseStrategyQuestions()` extracts only checkbox state and text, then `updateStrategyContent()` rewrites the entire `key-questions` anchor every reducer run.
4. Mined kasper for the closest ownership analogs: pending improvement queue, canonical apply function shared by manual and auto flows, managed-section injection, rejected-pattern suppression, and lock/merge-before-write boundaries.
5. Mapped the conflict policy onto exact deep-research reducer, strategy-template, registry-reference, and workflow-YAML targets.

## Findings

### Rank 1: Choose a merge ADR, not inbox-wins or reducer-wins

- Reference mechanism: kasper separates candidate collection from mutation: `weaknessToPending()` dedupes new candidates into `ctx.improvementsPending` before any file write (`external/kasper/src/handlers.ts:352-370`), and `executeKasperImprove()` filters candidates through thresholds and rejected-pattern checks before queueing them (`external/kasper/src/handlers.ts:420-475`). The actual mutation is centralized in `applyImprovement()`, explicitly used by both manual and auto-update flows (`external/kasper/src/improvements.ts:9-12`).
- Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`.
- One-line why it helps: add a reducer-owned `resolveQuestionConflicts()` between inbox ingestion and `updateStrategyContent()` so conflicts become explicit state transitions instead of whichever writer touched the markdown anchor last.
- Port difficulty: hard.
- Tag: deep-rewrite.

### Rank 2: Operator decisions should win as records; the reducer should win only as renderer

- Reference mechanism: kasper persists user-rejected patterns through `addRejectedPattern()` (`external/kasper/src/state.ts:502-510`), merges on-disk rejected patterns back into memory during read-merge-write (`external/kasper/src/state.ts:988-998`), and suppresses future matching suggestions with fuzzy matching before improvement generation (`external/kasper/src/evaluate.ts:1659-1668`; `external/kasper/src/utils.ts:237-253`).
- Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`.
- One-line why it helps: an injected question, rejection, or supersession should survive as an append-only/question-registry fact, while the reducer decides whether it is rendered as active, suppressed, resolved, or `needs_decision`.
- Port difficulty: med.
- Tag: quick-win.

### Rank 3: Make `key-questions` a generated projection, not an injection surface

- Reference mechanism: kasper's design marks its managed AGENTS.md section as plugin-owned and not manually edited (`external/kasper/DESIGN.html:418-424`), while protected resources distinguish state merge-before-write from locked section injection (`external/kasper/DESIGN.html:472-482`).
- Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md`.
- One-line why it helps: the template should state that `key-questions` is reducer-rendered from registry/inbox state; operators should inject into `research/inbox.jsonl` or a command surface, not directly into the anchor that `replaceAnchorSection()` rewrites.
- Port difficulty: easy.
- Tag: quick-win.

### Rank 4: Surface unresolved conflicts as reducer/dashboard evidence

- Reference mechanism: kasper logs cached rejection suppression when a proposed weakness matches a user-rejected pattern (`external/kasper/src/evaluate.ts:1659-1668`), and the deep-research workflow already has a post-dispatch conflict-event lane for schema mismatches (`.opencode/commands/deep/assets/deep_research_auto.yaml:760-795`).
- Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`.
- One-line why it helps: add a `question_conflict` event class and dashboard row so the loop stops hiding a strategy-control disagreement inside a regenerated markdown block.
- Port difficulty: med.
- Tag: quick-win.

### Rank 5: Document conflict ownership in the reducer/registry contract

- Reference mechanism: kasper documents precedence explicitly: project-local config overrides global config (`external/kasper/README.md:139-145`), inline prompts are refused for direct edit and must be migrated before kasper can own the file path (`external/kasper/README.md:153-159`).
- Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_reducer_registry.md`.
- One-line why it helps: the current registry reference says reducer-managed outputs may overwrite manual edits (`state_reducer_registry.md:32-45`) but does not say how user-injected question records outrank or merge with machine-derived open questions.
- Port difficulty: easy.
- Tag: quick-win.

## Questions Answered

- S6-09 answer: use a merge ADR. Raw inbox should not blindly win, and the reducer's markdown rewrite should not silently win. The reducer owns conflict resolution and rendering; operator/user decisions win only when represented as structured records with explicit `accepted`, `rejected`, `superseded`, or `needs_decision` state.
- The `key-questions` anchor should be a generated projection. It is unsafe as a command/inbox input because `parseStrategyQuestions()` preserves only checkbox state and text (`reduce-state.cjs:245-258`) and `replaceAnchorSection()` rewrites the full anchor (`reduce-state.cjs:782-800`).
- The smallest durable policy is: inbox records are immutable inputs, registry question records are canonical state, reducer is the sole renderer, and unresolved conflicts become dashboard-visible events rather than markdown overwrite races.

## Questions Remaining

- Exact conflict schema still needs design: likely fields are `questionId`, `dedupeKey`, `incomingText`, `existingQuestionId`, `relation`, `decision`, `decidedBy`, `decidedAtIteration`, and `reason`.
- Need a reducer regression fixture with three cases: identical injection dedupes, conflicting injection becomes `needs_decision`, explicit operator rejection suppresses later reducer-generated re-addition.
- Need to decide whether the ADR lives as a new decision record under the implementation spec or as a deep-research reference update first.

## Next Focus

S6-10: map a single telemetry/event schema that can unify fanout-pool ledger events, single-loop heartbeats, and council round-state events into one dashboard-consumable stream.
