---
title: "Feature Specification: Correct the deep-loop command contracts to state the real per-command CLI executor sets"
description: "The deep-loop command contracts named a three-item CLI executor set while each command runtime accepts a different, larger set; one contract also advertised an executor its resolver rejects. This packet makes every contract state its own runtime's accepted set and cite the constant that enforces it."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Correct the deep-loop command contracts to state the real per-command CLI executor sets

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `scaffold/039-executor-availability-docs` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every `/deep:*` presentation contract documented the executor field as `native | cli-opencode | cli-claude-code`. The runtime has moved well past that: `EXECUTOR_KINDS` (`runtime/lib/deep-loop/executor-config.ts:11`) declares seven kinds, and `LINEAGE_COMMAND_ADAPTERS` (`runtime/scripts/fanout-run.cjs:2166`) ships a working adapter for each. Four selectable executors were invisible to any operator reading the contract.

The inverse error was also present and is worse. The AI Council contract offered `cli-claude-code` and defaulted to a token, `active-runtime`, that `resolveExecutorKind` (`deep-ai-council/scripts/orchestrate-session.cjs:183`) rejects at resolve time — the contract sent operators to configure an executor that throws.

### Purpose
Each deep-loop contract states the executor set its own command's runtime actually accepts, and cites the constant that enforces it, so the docs cannot drift from the code again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the executor enumeration in every `deep-*-presentation.txt`, its `-auto.yaml` / `-confirm.yaml` siblings, and the `system-deep-loop` mode packets that repeat it.
- State the accepted set **per command**, since the four dispatch paths do not share one set.
- Cite the enforcing constant for every model allowlist instead of copying model ids into prose.
- Regenerate the three derived `assets/compiled/*.contract.md` artifacts so they carry the corrected text.

### Out of Scope
- Any runtime behavior change - this packet only makes documentation match code that already works.
- The dead `ExecutorNotWiredError` class in `executor-config.ts` - declared, exported, never thrown; removing it is a code change outside a documentation packet.
- Pre-existing box-drawing misalignment on untouched lines of the model-benchmark ASCII panel - a formatting sweep over lines this change does not otherwise edit.
- The stale `--reasoning-effort` enumeration in the research and review contracts, which omits the `ultra` tier present in `REASONING_EFFORTS` - a different field, reported as an adjacent defect.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep-research-presentation.txt` | Modify | Seven-kind set, Q-Exec options D-G, corrected fail-fast list |
| `.opencode/commands/deep/assets/deep-review-presentation.txt` | Modify | Same as research, plus an empty executor-hint literal repaired |
| `.opencode/commands/deep/assets/deep-ai-council-presentation.txt` | Modify | Council's own five-kind set; drop the rejected kinds and the unaccepted default token |
| `.opencode/commands/deep/assets/deep-ai-council-auto.yaml` | Modify | Same set; remove a duplicated `cli-opencode` entry |
| `.opencode/commands/deep/assets/deep-ai-council-confirm.yaml` | Modify | Same as the auto variant |
| `.opencode/commands/deep/assets/deep-model-benchmark-presentation.txt` | Modify | Five-kind grader set; realign the ASCII panel line |
| `.opencode/commands/deep/assets/deep-agent-improvement-presentation.txt` | Modify | Dispatcher line named `cli-opencode` twice and omitted three kinds |
| `.opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt` | Modify | Name the `codex` live transport and why the text-only CLIs are excluded |
| `.opencode/commands/deep/assets/deep-skill-benchmark-confirm.yaml` | Modify | Same live-transport correction |
| `.opencode/commands/deep/skill-benchmark.md` | Modify | Same live-transport correction, two places |
| `.opencode/skills/system-deep-loop/deep-review/SKILL.md` | Modify | Prohibition named two of six CLIs |
| `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` | Modify | Mixed-executor example named one executor three times |
| `.opencode/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md` | Modify | Same duplicated dispatcher list |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md` | Modify (generated) | Regenerated from the corrected sources |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | Modify (generated) | Regenerated from the corrected sources |
| `.opencode/commands/deep/assets/compiled/deep-ai-council.contract.md` | Modify (generated) | Regenerated from the corrected sources |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every deep-loop contract states the executor set its own runtime accepts | Grep finds no surviving `native \| cli-opencode \| cli-claude-code` enumeration under `commands/deep/` or `skills/system-deep-loop/` |
| REQ-002 | No contract advertises an executor its runtime rejects | The council contract no longer offers `cli-claude-code` or `cli-codex`, and no longer defaults to `active-runtime`; the token appears nowhere outside `z_archive` |
| REQ-003 | The three generated contract artifacts carry the corrected text | `check-contract-drift.cjs` exits 0 and prints `[CONTRACT DRIFT] OK commands=3` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Model allowlists are referenced by constant, never copied into docs | Each contract naming an allowlist names `CURSOR_SUPPORTED_MODELS` / `DEVIN_SUPPORTED_MODELS` / `PI_SUPPORTED_MODELS` and lists no model ids |
| REQ-005 | Genuinely narrow executor sets are documented as deliberate, with the mechanism | The skill-benchmark contract states that only opencode and codex emit the structured tool-use stream its score depends on |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator reading any `/deep:*` contract can name that command's selectable executors without opening the runtime source.
- **SC-002**: No contract names an executor that fails at resolve time - the failure mode this packet is most concerned with introducing.
- **SC-003**: The contract-drift gate is green from the final state, and the compiled diff contains no content beyond this change plus digest refreshes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Overcorrecting to "all six CLIs work everywhere" | High - sends operators to configure an executor with no adapter on that path | Each command's set was read from that command's own resolver, not generalized from the fan-out set |
| Risk | Copying model allowlists into prose | Medium - docs drift from code on the next model roster change | Docs cite the constant by name and list no model ids |
| Dependency | `compile-command-contracts.cjs` | Generated contracts keep the stale text if not regenerated | Regenerated for all three commands; drift gate re-run from the final state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The council contract's documented default token moved from `active-runtime` to `native`. `active-runtime` appears in no runtime code and `resolveExecutorKind` would reject it, so the code was treated as authoritative - but this is a documented-default change and is flagged for operator confirmation rather than assumed correct.
- `ExecutorNotWiredError` (`executor-config.ts:400`) is exported and never thrown, now that every kind is wired. Left in place as out-of-scope; worth deleting in a code packet.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
