---
title: "Implementation Plan: Phase 021 - Command Surface Validator Rewrite & Deep-Research Finding Fixes"
description: "Plan for rewriting the surface-drift stage against the real router+assets shape and applying the remaining 020 deep-research finding fixes."
trigger_phrases:
  - "phase 021 plan"
  - "command surface validator rewrite plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/021-command-surface-validator-and-agent-parity"
    last_updated_at: "2026-07-07T12:05:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "surface-validator-021"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 021 - Command Surface Validator Rewrite & Deep-Research Finding Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM validator script + Markdown command files + YAML/text asset files |
| **Framework** | `design-command-surface-check.mjs`'s existing metadata/surface two-stage validation architecture (kept; only the surface stage's file-reading and per-check logic is rewritten) |
| **Storage** | `.opencode/skills/sk-design/shared/scripts/`, `.opencode/commands/design/{*.md,assets/*}`, `.opencode/skills/sk-design/command-metadata.json` |
| **Testing** | Direct script execution (`node design-command-surface-check.mjs`); `node --check` for syntax; `python3 -c "import json"` for JSON validity |

### Overview

Fixing the metadata-stage errors the 020 audit found (`:auto|:confirm` modeled as a flag, missing sibling coverage) let the script proceed past a check it had never gotten past before -- straight into a second, much larger problem: the surface-drift stage still validated against the pre-Phase-015 flat command-file shape. Rather than partially patch this (which would leave the validator checking the wrong thing in a new way), the fix reads the actual Phase 015 file set per command (wrapper `.md` + 3 owned assets) and retargets every check to where that content really lives now, dropping literal tokens Phase 015 deliberately superseded (e.g. `NEXT_OPTIONS=`/`HANDOFF_REASON=` -> the newer compact `STATUS=OK PRODUCES=... NEXT=... PROOF=...` line) rather than resurrecting them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read `design-command-surface-check.mjs` in full (2600+ lines) to enumerate every surface-stage check and its exact literal expectations
- [x] Read all 5 command wrapper files (`audit.md`, `foundations.md`, `interface.md`, `motion.md`, `md-generator.md`) in full
- [x] Read `audit.md`'s 3 owned assets (`presentation.txt`, `auto.yaml`) as the representative template, then spot-read the other 4 commands' wrappers for structural parity
- [x] Read `command-metadata.json` in full (853 lines) to map every field the surface-drift checks assert against

### Definition of Done
- [x] `design-command-surface-check.mjs` rewritten: `collectSurfaceDrift` builds a combined `{wrapper, presentation, auto, confirm, combined}` surface per command
- [x] All ~10 `expected*Drift` functions retargeted to the file where Phase 015 actually put that content
- [x] `collectRosterReconciliationDrift` exempts transport-kind modes via a new `readTransportCommands()` set
- [x] Dead extraction helpers removed (`extractUserIntentSection`, `extractInternalBindingSection`, `extractEmitDeliverableSection`, `extractPipelineSection`, `extractTaskProjectionsSection`, `extractChoreographySection`, `extractHandoffGrammarSection`, `extractIntentLeadRegion`)
- [x] 5 wrapper `.md` files edited: `design-mcp-open-design` sibling row + `**Ask-first:**` marker
- [x] Script reaches `STATUS=PASS STAGE=complete SUMMARY invalid=0 drift=0`
- [x] Remaining 020-audit findings fixed: obsolete naming (4 files), design agent parity (2 files), `SKILL.md` version bump
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surface-stage checks now fall into three retargeting patterns, chosen per what Phase 015 actually did with that piece of content:

1. **Still in the wrapper, same anchor/header** (sibling-discriminator, register, preconditions marker section): no relocation needed, only content updates (the new sibling row, the Ask-first marker).
2. **Moved to a single owned asset** (example usage, task-projection verbs, choreography steps, deliverable name in the status line): extraction retargeted from `wrapper` to `presentation` or `auto`.
3. **Content genuinely consolidated/dropped by Phase 015's simplification** (the old `NEXT_OPTIONS=`/`HANDOFF_REASON=`/`STATUS=ASK MISSING_REGISTER` literal tokens, the `## INTERNAL BINDING` section, the old `copyGuard` check against the now-uniform "thin router" boilerplate): the check is rewritten to validate the equivalent NEW mechanism (the compact status line, the sibling-discriminator's differentiated "Use this command when" bullet) rather than resurrect vocabulary Phase 015 deliberately retired.

### Key Components

- **`assetPathsForCommand(command)`**: new helper mirroring `wrapperPathForCommand`, deriving the 3 owned-asset URLs from the command name (`design_<mode>_{presentation.txt,auto.yaml,confirm.yaml}`).
- **`wordOverlapRatio(text, phrase)`**: new fuzzy-match helper (significant-word overlap, threshold-gated) used where Phase 015's independently-authored prose paraphrases `command-metadata.json`'s fields closely but not verbatim (handoff rationale text, choreography action text) -- replaces brittle exact-substring checks that would otherwise false-positive on cosmetic rewording.
- **`readTransportCommands(registry)`**: new helper filtering `mode-registry.json`'s modes by `packetKind === "transport"`, used to exempt `design-mcp-open-design` from the roster-reconciliation loop's wrapper/metadata-command requirement (a second, independent bug: that loop assumed every registry mode maps 1:1 to a `/design:<mode>` command).
- **`extractSuccessStatusLine`**: rewritten from a bullet-list pattern (`- Success: \`STATUS=OK...\``) to a bare `STATUS=OK[^\r\n]*` regex matching the actual fenced-code-block format in `presentation.txt`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-command-surface-check.mjs` | Command metadata/surface validator | Rewrite surface-drift stage + roster exemption | `node design-command-surface-check.mjs` |
| `.opencode/commands/design/*.md` (5 files) | Thin router wrappers | Add sibling row + Ask-first marker | Same validator run |
| `design-md-generator/{SKILL.md,README.md,references/extraction_workflow.md}`, `feature_catalog/feature_catalog.md` | Mode/feature docs | Fix obsolete naming | Grep sweep |
| `.opencode/agents/design.md`, `.claude/agents/design.md` | Design agent (2 runtime mirrors) | Mode Map + tool-surface downshift + packet-path note | Manual read-through diff between the two mirrors (frontmatter-only difference expected) |
| `sk-design/SKILL.md` | Hub descriptor | Version bump | Grep for `version:` |

Required inventories:
- Same-class producers: no other in-flight work touches `design-command-surface-check.mjs` or the command wrapper files concurrently (confirmed via scoped `git status` before starting).
- Consumers of changed symbols: nothing else calls the removed dead extraction helpers (confirmed via `grep -n` for each function name before removal); the rewritten `expected*Drift` functions are called only from `collectSurfaceDrift`, whose call sites were updated in the same edit.
- Matrix axes: command x {wrapper section, presentation asset, auto asset} x {old-shape check, new-shape check}.
- Algorithm invariant: every rewritten check still asserts a real `record` field against real file content; none was weakened to an unconditional pass.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the full validator script, all 5 command wrappers, `audit.md`'s assets, and `command-metadata.json`
- [x] Map every old-shape check to its Phase-015 real-content location

### Phase 2: Implementation
- [x] Add `assetPathsForCommand`, `wordOverlapRatio`, `lastPathSegment`, `stripTrailingPeriod`, `readTransportCommands` helpers
- [x] Rewrite `collectSurfaceDrift` to build the 4-file combined surface
- [x] Rewrite `expectedEmitDeliverableDrift`, `expectedExampleDrift`, `expectedDiscriminatorDrift`, `expectedPreconditionsDrift`, `expectedPipelineDrift`/`expectedPipelineStatusDrift`, `expectedHandoffDrift`, `expectedChoreographyDrift`, `expectedRegisterDrift`, `expectedTaskProjectionsDrift`, `expectedUserIntentDrift`, `expectedInterfaceTaskLanesDrift`
- [x] Add transport-command exemption to `collectRosterReconciliationDrift`
- [x] Remove 8 now-dead extraction helper functions
- [x] Edit all 5 wrapper `.md` files: sibling row + Ask-first marker
- [x] Fix obsolete `mcp-open-design` naming in 4 files (7 occurrences)
- [x] Fix both `design.md` agent mirrors: Mode Map, tool-surface downshift, packet-path note
- [x] Bump `SKILL.md` version

### Phase 3: Verification
- [x] `node --check` for syntax after each major edit
- [x] Iterative `node design-command-surface-check.mjs` runs until clean pass (77 -> 10 -> 0 drift)
- [x] Grep sweep confirming 0 remaining obsolete-naming hits outside the frozen changelog
- [x] Manual diff confirming the two `design.md` mirrors only differ in frontmatter/path-convention
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax check | `design-command-surface-check.mjs` | `node --check` |
| Functional validator run | All 5 commands' metadata + surface | `node design-command-surface-check.mjs` |
| Naming sweep | sk-design + design commands + both agent mirrors | `grep -rln` |
| Structural diff | `.opencode/agents/design.md` vs `.claude/agents/design.md` | `diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 015's router+assets command shape | Prerequisite | Already shipped, live in the repo | This phase has nothing to validate against without it |
| `command-metadata.json`'s metadata-stage fix (`:auto|:confirm` flag removal, sibling entries) | Prerequisite | Already applied earlier in this same work session | Surface-drift stage is unreachable without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rewritten validator reports a false pass (misses a genuine content regression) discovered in later work.
- **Procedure**: `git revert` this phase's commit for `design-command-surface-check.mjs` specifically; the prior (broken, INVALID-at-metadata-stage) version is preserved in git history for reference, though it was never a working baseline to restore to.
<!-- /ANCHOR:rollback -->
