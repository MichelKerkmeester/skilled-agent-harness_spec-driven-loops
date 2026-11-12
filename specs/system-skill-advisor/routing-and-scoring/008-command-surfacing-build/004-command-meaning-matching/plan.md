---
title: "Implementation Plan: Phase 4: command-meaning-matching"
description: "Give each tracked command a vector in the skill graph and let a close meaning match anchor the command in the scorer. Prove it with a capture that runs the real embedding."
trigger_phrases:
  - "command meaning matching plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: command-meaning-matching

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, one CommonJS deriver script |
| **Framework** | The system-skill-advisor runtime (`ADV` is `.skilled/skills/system-skill-advisor/runtime`) |
| **Storage** | The skill graph SQLite database and its `vec_<dim>` vector table |
| **Testing** | Vitest through `npm test` in `ADV`, plus the routing-accuracy captures |

### Overview
The deriver emits an embedding text per command, and the existing skill graph refresh embeds and stores it next to the skill vectors. The semantic lane already scores any row that has a stored vector, and `requireCommandPhraseAnchor` lets a command pass when its cosine is at or above τ with a margin m. A real-embedding mode of the command capture proves the gain on holdout rows, and the default capture proves nothing else moved.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The four open questions in `spec.md` have an operator answer. Accepted on 2026-11-12 and recorded as ADR-001 to ADR-004.
- [x] The two questions found after that answer, vector storage and rank, have an operator answer. Answered on 2026-11-12 and recorded in ADR-001 and ADR-005.
- [ ] `curl -s localhost:11434/api/tags | jq -r '.models[].name'` lists a `nomic-embed-text` model.
- [ ] The before numbers are recorded: the default capture metrics, the scorer floor `[159,50,20,5]` and three hook timing runs.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] The real-embedding capture prints holdout combined plain reach of at least 5 of 44 and false offers 0 of 35, and `npm test` in `ADV` reports 0 failed.
- [ ] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Second anchor source. The scorer keeps its lanes and its gate, and the gate accepts one more kind of evidence.

### Key Components
- **Command embedding text** (`derive-command-bridges.cjs`): without it nothing has a vector, because the scan embeds skill descriptions from `source_path` only (`skill-graph-db.ts:705`).
- **Command vector refresh and load** (`skill-graph-db.ts`): without it command rows have no vectors, because `refreshSkillEmbeddings` walks skill rows only.
- **Command cosine** (`semantic-shadow.ts`): no change. The lane asks for a vector for every scored row (`semantic-shadow.ts:293`), so a stored command vector is scored as is.
- **Meaning anchor** (`fusion.ts`): without it every meaning match is dropped, because the gate at `fusion.ts:847` accepts the `explicit_author` lane only and never makes a row pass.
- **Real-embedding capture** (`capture-command-routing-baseline.mjs`): without it no capture can see the change, because the capture forces `VITEST` and an empty database (`:273-286`).

### Data Flow
The scan reads each command's embedding text from the generated bridge file, hashes it and embeds it on change. At recommend time the handler embeds the prompt once (`advisor-recommend.ts:590`), the lane computes a cosine per command, and the gate passes a command row that clears τ and the margin. The attach rule from phase 003 then carries a hub command through its owner.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `requireCommandPhraseAnchor` | Drops a command row with no `explicit_author` anchor | Update | `tests/command-meaning-anchor.vitest.ts` |
| `applyDoctorHelperHandoff` (`fusion.ts:988`) | Sends a doctor problem in other words to `/doctor:helper` | Unchanged. It already steps aside when any doctor row passes (`fusion.ts:1003`) | Doctor slice test and the doctor holdout count |
| `keepPassingSkillsAboveDoctorBridges` (`fusion.ts:906`) | Keeps a passing skill above a doctor row | Unchanged. The meaning rank step runs after it (ADR-005) | The capture's own reach on doctor rows and the T016 doctor rank case |
| `readOnlyRouteAllowed` (`fusion.ts:673`) | Floors a read-only route | Unchanged | A test row: a meaning anchor alone never sets it |
| `refreshSkillEmbeddings`, `loadSkillEmbeddings` | Embed and load skill vectors | Update | A rescan reports zero re-embeds when text is unchanged |
| Readers of the `vec_<dim>` table | Assume skill rows | Check, then update or leave | `rg -n "vecTableNameForDim\|loadSkillEmbeddings" ADV --glob '*.ts' --glob '!dist'` |
| Committed baselines and ratchets | Run under `VITEST` with an empty database | Unchanged | The default capture and `capture-scorer-eval-baseline.mjs` print the before numbers |
| Python scorer `ADV/scripts/skill_advisor.py` | Parity path with no vectors | Not a consumer | The parity divergence ratchet reports no new divergence |

Matrix axes: embedder present or absent, database present or absent, command vector present or absent, cosine above or below τ, margin held or not. Every axis has one test row.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the before numbers and checks Ollama. Implementation adds the text, the vectors, the cosine, the anchor and the capture mode. Verification runs the real-embedding capture, the default capture, the floor, the hook timing and the suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The anchor with injected vectors: pass, under τ, inside the margin, absent vector, absent embedder, `readOnly` unchanged | Vitest, `tests/command-meaning-anchor.vitest.ts` |
| Integration | The real-embedding capture over the 176-row corpus, and the default capture and floor unchanged | `capture-command-routing-baseline.mjs`, `capture-scorer-eval-baseline.mjs` |
| Manual | The Claude hook over the 44 tune prompts, three runs before and three after | Phase 003's `hook-latency.mjs`, copied into this packet's `scratch/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Ollama with `nomic-embed-text` | External | Yellow: `~/.ollama` exists and the tags call exited 0, but the model list was not read | No real vectors and no real-embedding proof |
| Skill graph embedding refresh and loader | Internal | Green: in code today | Command vectors need their own refresh |
| `001-semantic-lane-enablement` | Internal | Draft | A later lane weight change shifts the measured numbers |
| Operator decisions of 2026-11-12 | Decision | Green: ADR-001 to ADR-005 answered | None |
| Phase 003 attach rule and phrase gate | Internal | In Progress, code shipped | The anchor has nothing to extend |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a false offer above 0 of 35, typed recall under 24 of 44, a moved scorer floor or a hook time over budget.
- **Procedure**: revert this phase's commits. The vector rows for commands stay in the local database and are ignored once the anchor code is gone. Whether a rescan after the revert removes them is not confirmed. Delete them by bridge id, or rebuild the database, if they matter.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 shipped code and the open question answers | Implementation |
| Implementation | The before numbers and a running embedder | Verification |
| Verification | All implementation tasks | Phase 005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:decisions -->
## ARCHITECTURE DECISION RECORD

### ADR-001: Command vectors live in the existing vector table

**Status**: Accepted by the operator on 2026-11-12, then amended the same day by the operator's answer "Sibling table (Recommended)"

**Context**: Commands have no vectors. The skill graph already embeds, hashes and stores skill vectors in `vec_<dim>` and refreshes them with an outage streak.

**Decision**: Store command vectors in a sibling table `vec_cmd_<dim>` with the same columns as `vec_<dim>` and no foreign key, keyed by the scored command row id. The same refresh pass writes it and the same loader, `loadSkillEmbeddings`, reads it.

**Amendment**: The accepted wording put command vectors in the existing `vec_<dim>` table. That table's `skill_id` references `skill_nodes(id)` and foreign keys are on (`ADV/lib/embedders/schema.ts:121`, `skill-graph-db.ts:492`), so a command row cannot be inserted. The operator corrected the decision to the sibling table on 2026-11-12, so the skill table that packet 001 owns stays untouched and needs no migration.

**Consequences**:
- No new embedder, no new refresh path and no migration.
- A deleted command leaves its row in `vec_cmd_<dim>`, because no foreign key cascades. Mitigation: the refresh deletes rows whose id is not in the generated bridge file.

**Alternatives Rejected**:
- Rebuild `vec_<dim>` without the foreign key: it changes a table packet 001 owns and needs a migration for every existing database.

### ADR-002: A threshold and a margin in the phrase-anchor check

**Status**: Accepted by the operator on 2026-11-12

**Context**: `requireCommandPhraseAnchor` drops a command row with no `explicit_author` anchor, so a meaning match alone never survives.

**Decision**: A command row whose real cosine is at or above τ and beats every other command row by m passes the check, with its confidence raised to the threshold. Only matches with `cosine:` evidence count, so the word-overlap stand-in under `VITEST` never fires it. The `semantic_shadow` weight stays at 0.05.

**Consequences**:
- The committed baselines, captured under `VITEST`, do not move.
- Where a meaning-passed row ranks is ADR-005.

**Alternatives Rejected**:
- Raise the semantic lane weight for command rows: packet 001 owns the lane weight.

### ADR-003: Doctor routes get vectors

**Status**: Accepted by the operator on 2026-11-12

**Context**: Doctor rows are 17 of the 44 holdout rows and reach 0 of 17 today.

**Decision**: Each doctor route gets a vector from its command file `description` and its route `trigger_phrases`. If a doctor row causes a false offer, doctor routes lose their vectors and `/doctor:helper` stays the only doctor path for unknown words.

**Consequences**:
- `applyDoctorHelperHandoff` needs no change, because it steps aside when a doctor row passes.
- T017 runs only when the false-offer check fails on a doctor row.

**Alternatives Rejected**:
- No doctor vectors: it leaves 17 holdout rows out of reach.

### ADR-004: Hook budget

**Status**: Accepted by the operator on 2026-11-12

**Context**: The Claude hook measured a 235.04 ms median and a 318.96 ms p95 over the 44 tune prompts. The handler already embeds the prompt once, so the new cost is one cosine per command row.

**Decision**: The hook may grow by at most 25 ms at the median and 40 ms at the p95, compared as the middle of three runs before and three after.

**Consequences**:
- A slower result blocks the phase and triggers the rollback plan.

**Alternatives Rejected**:
- No budget: the hook runs on every prompt.

### ADR-005: A meaning-passed command ranks first only on a clear margin

**Status**: Accepted by the operator on 2026-11-12, "First, on a clear margin (Recommended)"

**Context**: The capture counts own reach at top 1 only (`capture-command-routing-baseline.mjs:388`). A row raised to the threshold confidence ranks below any passing skill, and `keepPassingSkillsAboveDoctorBridges` (`fusion.ts:906`) keeps a passing skill above a doctor row.

**Decision**: After `keepPassingSkillsAboveDoctorBridges` runs, a command that passed on meaning moves to first place only when its `semantic_shadow` cosine beats the top passing skill's cosine by `COMMAND_MEANING_MARGIN`. A top skill with no `semantic_shadow` contribution counts as 0. Otherwise the command keeps its score position.

**Consequences**:
- The model still sees the skill beside the command and chooses (decision D2).
- The step runs after the doctor ordering, so that ordering cannot undo it.

**Alternatives Rejected**:
- Keep the score position always: a row at the threshold confidence would rarely be top, and holdout reach could stay at 0.
<!-- /ANCHOR:decisions -->
