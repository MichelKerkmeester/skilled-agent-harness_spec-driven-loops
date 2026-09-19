---
title: "Implementation Plan: Give the deep-research ledger its own spec-protocol events"
description: "Add seven research stems modeled on the run-now precedent, upcast the legacy spec-protocol rows into them losslessly, and prove existing ledgers replay unchanged."
trigger_phrases:
  - "spec protocol ledger events plan"
  - "packet 050 plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Give the deep-research ledger its own spec-protocol events

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript in the deep-loop runtime |
| **Framework** | The runtime's authorized ledger, event envelope and replay fingerprint |
| **Storage** | Append-only ledger frames, projected into `deep-research-state.jsonl` |
| **Testing** | The deep-loop runtime Vitest suite |

### Overview
`b8da689d67` added the run-now and synthesis stems and is the template for every file touched. One difference: those stems are `spoken` because the workflow stages them as `{stem, scope, data}` envelopes, while these seven are reached only by upcasting the legacy row the workflows keep writing, so the census declares them `reserved`, as it does `run_resumed`. Each legacy spec-protocol row maps to one stem of the same name; the upcaster moves its fields into the payload without loss, the reducer leaves research state alone, and the legacy projection writes the row back into the state log exactly as the workflow wrote it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive event stems on an existing lane schema.

### Key Components
- **Stem registry** (`deep-research-ledger-types.ts`): the stem list, wire types, payload and scope types, and the producer table the stem-producer checker enforces.
- **Field rules** (`deep-research-ledger-schema.ts`): exact payload fields and value rules per stem.
- **Upcaster** (`legacy-compatibility.ts`): today it pins the seven rows; it will map them.
- **Reducer and legacy projection**: consume the stems without changing research state, and rebuild the legacy row.

### Data Flow
Workflow row → gateway → upcast to stem → authorized ledger frame → reducer (no-op) → legacy projection → state log row.

### Legacy row shapes
| Row | Fields besides `type`, `event` and `timestamp` |
|-----|-----|
| `spec_check_result` | `folder_state`, `normalized_topic`, `specPath`, `hostAnchor` |
| `spec_seed_created` | `folder_state`, `anchors_touched`, `diff_summary`, `seed_markers` |
| `spec_preinit_context_added` | `folder_state`, `anchors_touched`, `diff_summary`, `normalized_topic` |
| `spec_preinit_context_deduped` | the same, plus `specPath` |
| `spec_mutation` | `phase`, `anchors_touched`, `diff_summary`, `generatedFence` |
| `spec_mutation_conflict` | `folder_state`, `reason`, `hostAnchor`, `specPath`, `generatedFence`, `conflictKind` |
| `spec_synthesis_deferred` | `reason`, `generatedFence` |

### Payload mapping
Every stem is scoped `['runId', 'lineageId']`. The legacy key is what the workflow writes and what the projection must write back; the payload field is its camelCase form.

| Legacy key | Payload field | Field rule | Used by |
|-----|-----|-----|-----|
| `folder_state` | `folderState` | `code` | check_result, seed_created, preinit_context_added, preinit_context_deduped, mutation_conflict |
| `normalized_topic` | `normalizedTopic` | `prose` | check_result, preinit_context_added, preinit_context_deduped |
| `lockPath` | `lockPath` | `prose` | check_result |
| `specPath` | `specPath` | `prose` | check_result, preinit_context_added, preinit_context_deduped, mutation_conflict |
| `anchors_touched` | `anchorsTouched` | `prose-array` (new rule: an array of prose strings) | seed_created, preinit_context_added, preinit_context_deduped, mutation |
| `diff_summary` | `diffSummary` | `prose` | seed_created, preinit_context_added, preinit_context_deduped, mutation |
| `seed_markers` | `seedMarkers` | `code-array` | seed_created |
| `phase` | `phase` | `code` | mutation |
| `generatedFence` | `generatedFence` | `code`; `nullable-identifier` on mutation_conflict | mutation, mutation_conflict, synthesis_deferred |
| `conflictKind` | `conflictKind` | `nullable-identifier` | mutation_conflict |
| `reason` | `reason` | `prose` | mutation_conflict, synthesis_deferred |

The legacy `type` is `event` for `spec_check_result` and `spec_mutation` for the other six. The fields are taken from the rows the two research workflows write, not from the protocol reference's minimum schema, which lists a `hostAnchor` no row carries. `spec_mutation_conflict` has two shapes: the pre-init row has only `folder_state`, `reason` and `specPath`, so its `generatedFence` and `conflictKind` are null, and the projection writes a null field back as absent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Stem registry and field rules | Define research events | Add seven | Schema tests; stem-producer checker |
| Upcaster | Pins the seven rows | Map them | Round-trip tests |
| Reducer | Folds events into state | No-op cases | Replay of committed fixtures unchanged |
| Legacy projection | Rebuilds the state log | Emit the legacy row | Byte-equivalence test |
| Append-site checker | Holds YAML sites to stems | Expect the seven as stems | Its own test |

Required inventories:
- Every `append_to_jsonl` site naming a spec-protocol row: `rg -n "spec_(check_result|seed_created|preinit_context|mutation|synthesis_deferred)" .skilled/commands/deep/assets`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

The build is dispatched to DeepSeek V4.1 Flash through cli-pi as one brief per task T003 to T007, each naming its file and edit, with `PI_BLACKHOLE_PASSIVE=true` in the child. Each diff and check is reviewed before the next brief goes out.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Field rules and upcast per row | Vitest |
| Integration | `append-mode-event.cjs` on each row; replay of committed fixtures | Vitest |
| Manual | The failing command from phase 15 of packet 041 | CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator go-ahead | Operator | Yellow | A durable format change waits for it |
| The run-now precedent | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Replay drift, or a runtime that cannot read a ledger.
- **Procedure**: Revert the commit. A reverted runtime refuses any ledger that already holds one of the new stems, so a revert must come before any research run writes them, or those runs must be archived first.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Registry + rules ──► Upcaster ──► Reducer + projection ──► Tests ──► Protocol doc
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Registry and rules | Go-ahead | Upcaster |
| Upcaster | Registry | Reducer |
| Reducer and projection | Upcaster | Tests |
| Tests and doc | Reducer | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Registry, rules, upcaster | Med | Half a day |
| Reducer, projection, tests | Med | Half a day |
| **Total** | | **About a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Committed ledger fixtures replayed before and after
- [ ] No research run in flight when it lands
- [ ] Rollback note read by the operator

### Rollback Procedure
1. Revert the commit.
2. Archive any research run that wrote a new stem since.
3. Rerun the deep-loop suite.
4. Tell the operator which runs were archived.

### Data Reversal
- **Has data migrations?** No; the change is additive.
- **Reversal procedure**: Archive ledgers holding the new stems before running an older runtime on them.
<!-- /ANCHOR:enhanced-rollback -->

---
