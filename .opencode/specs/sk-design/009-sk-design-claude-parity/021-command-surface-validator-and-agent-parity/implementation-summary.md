---
title: "Implementation Summary"
description: "design-command-surface-check.mjs's surface-drift stage rewritten to validate the real Phase 015 router+assets command shape, reaching a genuine STATUS=PASS drift=0. Remaining 020 deep-research findings (obsolete naming, agent parity, version hygiene) fixed."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 021 implementation summary"
  - "command surface validator rewrite summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/021-command-surface-validator-and-agent-parity"
    last_updated_at: "2026-07-07T12:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run validate.sh --strict, then commit and push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/agents/design.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "surface-validator-021"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-command-surface-validator-and-agent-parity |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 020 deep-research audit found `design-command-surface-check.mjs` reporting `STATUS=INVALID STAGE=metadata`, attributed to two `command-metadata.json` errors. Fixing those (removing an invalid `:auto|:confirm` flag entry, adding `design-mcp-open-design` sibling coverage to all 5 commands) let the script proceed past a gate it had never cleared before -- straight into a second, far larger problem: the surface-drift stage still validated every command wrapper against the PRE-Phase-015 flat command-file shape (`## USER INTENT`, `## CHOREOGRAPHY`, `## PIPELINE & HANDOFF`, literal `NEXT_OPTIONS=`/`HANDOFF_REASON=`/`STATUS=ASK MISSING_REGISTER` tokens), even though Phase 015 had restructured every command into a thin router `.md` plus three owned assets months earlier. The validator had been silently broken since Phase 015 shipped -- the breakage was invisible because the earlier metadata-stage error always short-circuited the run before reaching the drift check.

This phase rewrote the surface-drift stage to read the real 4-file surface per command (wrapper + `presentation.txt` + `auto.yaml` + `confirm.yaml`) and retargeted every check to where Phase 015 actually put that content, reaching a genuine `STATUS=PASS drift=0` rather than either the old false-INVALID or a naive rewrite that would have reported ~77 phantom drift items forever. It then applied the remaining findings from the 020 audit per the user's "fix all findings" directive.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Edited | Rewrote surface-drift stage for the router+assets shape; added transport-command roster exemption; removed 8 dead extraction helpers |
| `.opencode/commands/design/{audit,foundations,interface,motion,md-generator}.md` | Edited | Added `design-mcp-open-design` sibling-discriminator row + `**Ask-first:**` marker (5 files) |
| `.opencode/skills/sk-design/command-metadata.json` | Edited | Removed invalid `:auto\|:confirm` flag entry, added `design-mcp-open-design` sibling entries (all 5 commands) -- carried over from the metadata-stage fix that opened this phase's work |
| `.opencode/skills/sk-design/design-md-generator/{SKILL.md,README.md,references/extraction_workflow.md}` | Edited | Fixed obsolete `mcp-open-design` naming (6 occurrences) |
| `.opencode/skills/sk-design/feature_catalog/feature_catalog.md` | Edited | Fixed obsolete `mcp-open-design` naming (1 occurrence) |
| `.opencode/agents/design.md`, `.claude/agents/design.md` | Edited | Added 6th mode to Mode Map, Tool-Surface Downshift section, ALWAYS/NEVER rules, packet-path note (both runtime mirrors) |
| `.opencode/skills/sk-design/SKILL.md` | Edited | Version `1.1.0.0` -> `1.2.0.0` |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/020-drift-and-improvement-audit/**` | Added | Committed the previously-untracked deep-research folder |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the full 2600+ line validator script and all 5 command wrappers plus one command's full asset set (`audit.md` + its `presentation.txt`/`auto.yaml`) to build an exact map of every old-shape check to where Phase 015 actually relocated that content. Three retargeting patterns emerged: (1) checks whose anchor still exists in the wrapper unchanged (sibling-discriminator, register, preconditions marker section) needed only content updates; (2) checks whose content moved to a single owned asset (example usage, task-projection verbs, choreography steps, the deliverable name inside the status line) needed their extraction source changed from `wrapper` to `presentation`/`auto`; (3) checks expecting literal vocabulary Phase 015 deliberately retired (`NEXT_OPTIONS=`, `HANDOFF_REASON=`, `STATUS=ASK MISSING_REGISTER`, `## INTERNAL BINDING`) needed the assertion itself rewritten against the new equivalent mechanism, not a resurrection of dropped tokens.

Iterated the rewrite against a real run rather than reasoning from static review alone: the first full rewrite pass took the drift count from 77 to 10, both narrow and specific (a trailing-period mismatch between `command-metadata.json`'s `example.returnsArtifact` and the presentation asset's prose, and step-3 choreography resource paths written as repo-absolute in metadata but mode-relative in the actual `auto.yaml`). Both were root-caused and fixed with small, targeted helpers (`stripTrailingPeriod`, a `lastPathSegment` fallback match) rather than loosening the checks wholesale, reaching a genuine `drift=0`.

Separately, fixing the metadata-stage errors exposed a second, independent bug: `collectRosterReconciliationDrift` mechanically assumed every registry `workflowMode` maps to a real `/design:<mode>` command, which is false by design for the transport-kind `design-mcp-open-design` (`command: null`). Added a `packetKind === "transport"` exemption rather than forcing a wrapper/metadata record into existence for a mode the Phase 018 architecture decision deliberately left command-less.

The remaining 020-audit findings (obsolete `mcp-open-design` naming, agent tool-surface/mode-map parity, `SKILL.md` version staleness) were applied directly against the live files, then verified with a grep sweep and a structural diff between the two agent runtime mirrors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rewrite the validator to match Phase 015's actual shape, not revert Phase 015 or add legacy sections back to the command files | Phase 015's router+assets refactor was an already-shipped, deliberate simplification; the validator being stale was the bug, not the command architecture |
| Use word-overlap fuzzy matching (0.7 threshold for handoff rationale, 0.5 for choreography action text) instead of exact-substring matching for content Phase 015 independently reworded | `command-metadata.json`'s prose and the presentation/auto assets' prose were authored separately and paraphrase each other closely but not verbatim (e.g. "audit findings need..." vs. "findings need..."); exact-substring matching would false-positive on every command |
| Drop the `NEXT_OPTIONS=`/`HANDOFF_REASON=`/`STATUS=ASK MISSING_REGISTER` literal-token requirements rather than add them back to the presentation assets | Phase 015's compact `STATUS=OK PRODUCES=... NEXT=... PROOF=...` line and consolidated single ask-token already carry the same information; resurrecting retired tokens would just re-verbosify files Phase 015 deliberately simplified |
| Retarget the `copyGuard` (banned generic-phrasing) check from `## ROUTER CONTRACT` to the sibling-discriminator's "Use this command when" bullet | All 5 router-contract sections legitimately share boilerplate phrasing ("Pin the X mode... loads the mode directly") by design -- that IS the "thin router" pattern; the genuinely differentiated, per-command prose lives in the discriminator's `whenToUse` bullet instead |
| Exempt transport-kind modes from the roster-reconciliation loop via `packetKind`, rather than adding a wrapper/metadata record for `design-mcp-open-design` | The 020 audit explicitly left "should this transport get a real command" as an open product decision; this phase fixes the validator's incorrect assumption without reopening or foreclosing that decision |
| Build the eventual commit in an isolated worktree scoped to only this phase's files | The shared working tree had 8 unrelated concurrent-session dirty files (description.json regenerations, an unrelated sk-doc path fix) discovered via `git diff`; scoping avoided any cross-contamination |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check design-command-surface-check.mjs` | PASS |
| `node design-command-surface-check.mjs` (first rewrite pass) | `STATUS=DRIFT drift=10` (down from the original 77) |
| `node design-command-surface-check.mjs` (after 2 targeted follow-up fixes) | `STATUS=PASS STAGE=complete SUMMARY invalid=0 drift=0` |
| Grep sweep for `` `mcp-open-design` `` outside `design-mcp-open-design` | 0 hits remain outside the frozen `design-md-generator/changelog/v1.0.0.0.md` historical entry |
| `diff .opencode/agents/design.md .claude/agents/design.md` | Only frontmatter block (`permission:` vs `tools:`) and the Path Convention line differ, as expected for the two runtime mirrors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Word-overlap fuzzy matching is strictly weaker than exact-substring matching.** The 0.7/0.5 thresholds for handoff rationale and choreography action text will tolerate a future edit that meaningfully changes an option's rationale as long as most significant words are reused -- this is a deliberate tradeoff against Phase 015's independent prose authoring, not a defect, but it is a real reduction in strictness versus the pre-Phase-015 validator's exact matching.
2. **The `design-mcp-open-design` command-addressability question remains open**, per the 020 audit -- this phase's roster-reconciliation fix makes the validator correctly NOT require a wrapper/metadata record for it, but does not decide whether one should eventually be added.
3. **No fresh skill-benchmark run was performed in this phase** -- the validator reaching a clean pass is the relevant automated gate for this phase's scope (a validator/doc-fidelity fix, not a routing behavior change); the last real benchmark baseline remains Phase 019's `benchmark/after-018-transport-integration/`.
<!-- /ANCHOR:limitations -->
