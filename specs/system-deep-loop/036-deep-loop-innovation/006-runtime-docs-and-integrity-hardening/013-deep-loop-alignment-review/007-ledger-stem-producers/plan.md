---
title: "Implementation Plan: Phase 6: ledger-stem-producers"
description: "Declare the per-stem producer census beside each frozen stem array, enforce it with a checker over the nine producer surfaces, and make the two places where the operative dialect differed from the registered one state their position loudly."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: ledger-stem-producers

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ES2022, strict) for the runtime libraries; CommonJS for the CLI scripts |
| **Framework** | None; Node built-ins, zod-free frozen shapes in the ledger schemas |
| **Storage** | JSONL state logs, JSON artifacts, and the append-only ledger frames behind them |
| **Testing** | vitest (`npx vitest run --no-coverage`) from `runtime/` |

### Overview
The registry says 61 stems; the producers write five. This plan puts a census beside each stem array that says which is which and why, adds a checker that re-derives the answer from the producer surface on every run, and settles the one dialect split that could not be papered over: the flat gate-summary adjudication is its own canonical event, not a shortened typed record.
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
- [ ] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-plus-census with an external conformance checker: the schema declares what it registers and what it expects to be spoken; a separate script re-measures the producer surface and refuses to agree silently.

### Key Components
- **Stem registry**: the frozen per-mode stem arrays and their wire-event maps, which own the registered vocabulary
- **Producer census**: one single-line entry per registered stem beside the array, declaring `spoken` with its producers or `reserved` with a reason
- **Conformance checker**: line-parses both schemas, scans the nine producer files for structured `stem` key occurrences, and reports violations with stable exit codes
- **Shadow projection store**: publishes folded artifacts and now refuses a replace that would drop keys from an existing config row
- **Ledger-backing gate**: reports which frames root backed a run so a vestigial root is visible rather than indistinguishable from the artifact-dir root

### Data Flow
A workflow step stages an event JSON and calls the append gateway, which records it in the ledger and refreshes the legacy artifact as a projection. The census describes that vocabulary statically; the checker re-derives the producer side from the files themselves; the guard sits between the fold and the published bytes so a lossy refresh cannot land quietly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/deep/assets/*.yaml` (four variants) | Producers of every dotted stem that reaches the ledger | unchanged | The checker detects ten emitter occurrences over five stems |
| `runtime/scripts/fanout-run.cjs`, `append-mode-event.cjs`, both `reduce-state.cjs`, `verify-iteration.cjs` | Remaining producer surfaces; all write bare legacy event names | unchanged | The scan finds zero dotted literals in them, so their legacy rows stay pinned by the compatibility maps |
| `runtime/lib/deep-review-ledger-schema/`, `runtime/lib/deep-research-ledger-schema/` | Own the registry and now the census | update | `npm run typecheck`; the ledger-schema suites |
| `runtime/lib/legacy-projections/shadow-projection-store.ts` | Publishes folded artifacts as append, replace or unchanged | update | `legacy-projections.test.ts`, 16 tests including the refusal case |
| `runtime/scripts/verify-iteration.cjs` | After-dispatch leaf gate, including the ledger-backing check | update | `verify-iteration.vitest.ts`, 19 tests over both root kinds |
| `runtime/scripts/verify-authority.cjs` | Independent authority verifier | unchanged, now covered | `verify-authority-cli.vitest.ts`, 10 tests |
| Eight state reference documents | Reader-facing description of each mode's state | update | `check-contract-drift.cjs` regenerated; `validate.sh --strict` on the packet |

Required inventories:
- Same-class producers: `rg -n '"stem"\s*:\s*"deep_(review|research)\.' .opencode/commands/deep/assets runtime/scripts`
- Consumers of changed symbols: `rg -n 'DEEP_REVIEW_STEM_PRODUCERS|DEEP_RESEARCH_STEM_PRODUCERS|ATTRIBUTION_COLLAPSE|ledgerBacking' . --glob '*.ts' --glob '*.cjs' --glob '*.md'`
- Matrix axes: mode (review, research) x declaration (spoken, reserved, undeclared) x emitter state (present, absent, buried in a YAML scalar, unregistered)
- Algorithm invariant: the replace guard compares key sets, never values, and only on a `replaced` publication of a `jsonl` contract, so a torn or unparseable first row still repairs
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Census shape, closed adjudication payloads, the fold's adjudication arm, the replace guard, the frames-root report | vitest |
| Integration | The checker CLI against the committed tree and against mkdtemp fixture trees; the verify-authority CLI against fixture authority roots | vitest spawning the real scripts |
| Manual | The checker run from `runtime/`, the contract-drift check, the packet validator | `node`, `bash` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Frozen stem arrays and wire-event maps | Internal | Green | The census cannot be keyed without them |
| The nine producer surfaces | Internal | Green | The scan is the only evidence for the spoken side |
| Legacy projection engine and shadow store | Internal | Green | The replace guard lives on that path |
| The deep-loop suite as the closure gate | Internal | Red | One client-side stress assertion is stale after another track's preflight change; closure is blocked until it lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the replace guard refuses a legitimate projection refresh in a live run
- **Procedure**: revert the guard commit; the refusal is one call site plus one error code, and no published artifact depends on it
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Census ──────┐
             ├──► Checker ──► Adjudication proofs ──► Prose and reporting ──► Verification
Guard ───────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Census | None | Checker |
| Checker | Census | Adjudication proofs |
| Adjudication proofs | Census | Verification |
| Prose and reporting | Checker, Adjudication proofs | Verification |
| Verification | All | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Census | Low | 1 hour |
| Checker | High | 2-3 hours |
| Adjudication proofs | Med | 1-2 hours |
| Prose and reporting | Med | 1-2 hours |
| Verification | Med | 1 hour |
| **Total** | | **6-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert the change set, which is confined to two schema files, two projection files and their tests
2. Re-run `node scripts/check-ledger-stem-producers.cjs` and confirm the census still matches the tree
3. Re-run the eight suites covering the change set
4. No stakeholder notification is needed; the affected surfaces are developer-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


