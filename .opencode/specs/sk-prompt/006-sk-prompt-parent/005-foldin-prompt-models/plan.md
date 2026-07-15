---
title: "Implementation Plan: Phase 5: fold in prompt-models"
description: "Execute the prompt-models fold-in as one atomic relocation and hardcoded-path repoint bundle. The plan preserves the live benchmark write target, dissolves the old advisor identity into the sk-prompt hub, and verifies both small-model profile lookup and /deep:model-benchmark output routing against the new layout."
trigger_phrases:
  - "fold in prompt models plan"
  - "sk-prompt-models relocation"
  - "prompt-models atomic move"
  - "model benchmark write target"
  - "small model profile lookup"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/006-sk-prompt-parent/005-foldin-prompt-models"
    last_updated_at: "2026-07-09T16:30:00Z"
    last_updated_by: "claude"
    recent_action: "Executed as planned; hub now canon-clean"
    next_safe_action: "Proceed to phase 006"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/"
      - ".opencode/skills/sk-prompt/prompt-models/"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - ".opencode/commands/deep/model-benchmark.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-foldin-prompt-models"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: foldin-prompt-models

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML, TypeScript, Python path constants |
| **Framework** | OpenCode skill hub with workflow packets |
| **Storage** | Filesystem skill tree and benchmark artifact directories |
| **Testing** | Static path inventory, profile load smoke checks, /deep:model-benchmark dry-run or smoke check, parent skill gate |

### Overview
This phase moves the entire `sk-prompt-models` skill into `sk-prompt/prompt-models` and immediately repoints the functional consumers that would otherwise keep reading or writing the old location. The move is bundled with graph identity dissolution, advisor profile path repoints, benchmark write-target repoints, and focused smoke verification so there is no interval where `/deep:model-benchmark` writes to a dead path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented in `spec.md`
- [ ] Atomic move and repoint bundle understood before any `git mv` execution
- [ ] Current old-path references and benchmark target files inventoried from the live worktree

### Definition of Done
- [ ] Full prompt-models tree moved with `git mv` and old top-level skill path removed
- [ ] Hardcoded advisor profile paths and /deep:model-benchmark write-target paths repointed in the same change
- [ ] Small-model profile load and benchmark write-target smoke checks pass against the new path
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow-packet fold-in inside a parent hub, matching the sk-doc-style two-tier shape.

### Key Components
- **Prompt-models packet tree**: The former `sk-prompt-models` skill contents, moved under `sk-prompt/prompt-models` while preserving `assets/model_profiles.json` and `benchmarks/`.
- **Hub advisor identity**: The single `sk-prompt/graph-metadata.json` file that absorbs the former prompt-models enhancement and routing metadata.
- **Functional hardcoded consumers**: The two system-skill-advisor path joins and three /deep:model-benchmark files that must point at the new packet path immediately.

### Data Flow
cli-opencode's small-model dispatch uses advisor-owned profile lookup to read `assets/model_profiles.json`; after this phase that lookup must resolve under `sk-prompt/prompt-models`. `/deep:model-benchmark` writes benchmark evidence into the packet-local `benchmarks/` tree; after this phase command markdown and YAML assets must write under `sk-prompt/prompt-models/benchmarks/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-prompt-models/` | Independent prompt-models skill and current benchmark write target | Move into `.opencode/skills/sk-prompt/prompt-models/` with `git mv` | Destination contains the moved tree; old top-level skill folder is absent |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Hub advisor identity | Absorb former prompt-models enhancement, domain, and intent-signal metadata | One graph metadata file remains under `sk-prompt/` and includes the folded edge to cli-opencode |
| `executor-delegation.ts` and `skill_advisor.py` | Runtime small-model profile path resolution | Repoint hardcoded `assets/model_profiles.json` joins to the new packet path | Profile load smoke check resolves a known small-model profile |
| `/deep:model-benchmark` markdown and YAML assets | Benchmark output path construction | Repoint all write-target paths to `sk-prompt/prompt-models/benchmarks/` in the atomic move change | Dry-run or smoke invocation confirms the new benchmark target exists |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 004 left `.opencode/skills/sk-prompt/` ready to receive a `prompt-models/` workflow packet.
- [ ] Inventory the current `.opencode/skills/sk-prompt-models/` tree count and verify `benchmarks/` is present before moving it.
- [ ] Inventory old-path references in the two advisor path-join files and the three /deep:model-benchmark files so verification has a concrete baseline.

### Phase 2: Core Implementation
- [ ] Execute one atomic relocation bundle: `git mv` `.opencode/skills/sk-prompt-models/` to `.opencode/skills/sk-prompt/prompt-models/`, delete the moved packet-local `graph-metadata.json` after folding its `enhances -> cli-opencode (0.8)` edge plus domain and intent-signal content into `.opencode/skills/sk-prompt/graph-metadata.json`, and repoint both advisor profile path joins plus all /deep:model-benchmark write-target paths to the new packet path before stopping.
- [ ] Reconcile the moved packet's version statements so `SKILL.md`, `description.json`, and latest changelog do not disagree after the fold-in.
- [ ] Confirm no `/prompt-models` command is introduced and the moved packet keeps read-only prompt-craft lookup semantics.

### Phase 3: Verification
- [ ] Verify no functional write-target or profile-load path in the five hardcoded-path files still points at `.opencode/skills/sk-prompt-models/`.
- [ ] Load at least one small-model profile through the repointed advisor path logic.
- [ ] Run a dry-run or smoke invocation for `/deep:model-benchmark` that proves the benchmark target exists under `.opencode/skills/sk-prompt/prompt-models/benchmarks/`.
- [ ] Run the parent-skill enforcement gate against the merged `sk-prompt` hub shape.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static inventory | Old-path references, graph metadata count, moved tree contents | Grep, Glob, direct file reads |
| Runtime smoke | Small-model profile path resolution in TypeScript and Python consumers | Targeted command or script invocation grounded in the touched files |
| Workflow smoke | `/deep:model-benchmark` benchmark target resolution | Dry-run or minimal smoke invocation that does not publish benchmark results |
| Structural gate | Parent hub packet shape and router metadata | `.opencode/commands/doctor/scripts/parent-skill-check.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 prompt-improve onboarding | Internal | Yellow until confirmed at execution | The destination parent layout may not be ready for the prompt-models packet. |
| `sk-prompt-models/benchmarks/` live write target | Internal | Green from phase research | Moving without same-change path repoints causes silent writes to a dead location. |
| system-skill-advisor path joins | Internal | Green from phase research | Missing a join leaves cli-opencode small-model profile dispatch resolving the old path. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Profile lookup fails after repoint, `/deep:model-benchmark` cannot resolve the new benchmark target, or the parent-skill gate reports multiple advisor identities under `sk-prompt`.
- **Procedure**: Revert the atomic phase commit as one unit so the moved tree, graph metadata fold, advisor path joins, and benchmark write-target paths return to their prior layout together. Do not partially restore only the directory or only the path strings.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
