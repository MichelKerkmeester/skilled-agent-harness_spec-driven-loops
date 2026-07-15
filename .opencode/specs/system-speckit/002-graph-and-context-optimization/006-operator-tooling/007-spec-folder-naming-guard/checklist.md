---
title: "Verification Checklist: Spec-Folder Naming-Convention Guard [system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard/checklist]"
description: "Level 2 verification that the naming-guard research packet is evidence-backed, complete, and structurally valid."
trigger_phrases:
  - "naming guard checklist"
  - "naming guard verification"
  - "research completeness checklist"
importance_tier: "normal"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard"
    last_updated_at: "2026-06-06T05:50:56Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified research packet completeness against evidence"
    next_safe_action: "Operator review of feasibility verdict"
    blockers: []
    key_files:
      - "checklist.md"
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "naming-guard-research-2026-06-06"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
# Verification Checklist: Spec-Folder Naming-Convention Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |


<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Defect reproduced and located
  - **Evidence**: `.opencode/specs/system-spec-kit/028-026-program-research` confirmed at track root via `find .opencode/specs -maxdepth 3 -type d -name "028-*"`
- [x] CHK-002 [P0] Naming convention sources cited
  - **Evidence**: phase-child regex `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` at `is-phase-parent.ts:8` and `shell-common.sh:57`
- [x] CHK-003 [P1] Hook system reference located
  - **Evidence**: `references/config/hook_system.md` §8 runtime matrix read in full


<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Creation-time enforcement gap proven
  - **Evidence**: `create.sh` `validate_spec_folder_basename` (`create.sh:681-687`) checks `^[0-9]{3}-[A-Za-z0-9._-]+$` only; no semantic or location check
- [x] CHK-011 [P0] Top-level vs phase-child decision shown to be flag-driven
  - **Evidence**: `create.sh` branches on `--phase` / `--parent` / `--subfolder` / `--track`; no tool decides intended location
- [x] CHK-012 [P1] Defect shown to pass every existing layer
  - **Evidence**: `028-026-program-research` passes both `create.sh` basename regex and `validate.sh` FOLDER_NAMING rule (`validation_rules.md:586`)
- [x] CHK-013 [P1] Single-source-of-truth pattern identified for the design
  - **Evidence**: `is-phase-parent.ts` dual-impl (TS + shell mirror) cited as the model to reuse


<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All P0 requirements satisfied
  - **Evidence**: REQ-001, REQ-002, REQ-003 each map to a documented finding in `research.md`
- [x] CHK-021 [P0] Feasibility verdict produced
  - **Evidence**: `research.md` §Verdict states PARTIAL with grounded reasoning
- [x] CHK-022 [P1] Hook-parity audit complete
  - **Evidence**: Claude / Codex / OpenCode / Gemini pre-write parity documented; Codex `pre-tool-use.ts` named as the only existing deny interception
- [x] CHK-023 [P1] Degraded runtimes named
  - **Evidence**: Gemini (no checked-in project hook) and Copilot (next-prompt-only) identified from `hook_system.md` §8


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified
  - **Evidence**: Defect classed as `class-of-bug` (any mis-located/embedded-number slug, not a one-off); the recommended design targets the class, not just `028-026-program-research`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: `find .opencode/specs -maxdepth 3 -type d -name "028-*"` plus track-root listing; `028-026-program-research` is the only current top-level embedded-number instance
- [x] CHK-FIX-003 [P0] Consumer inventory completed
  - **Evidence**: N/A for code consumers (no code changed); design enumerates all four creation/validation consumers (create.sh, per-runtime hooks, validate.sh, prompt-time advisor)
- [x] CHK-FIX-004 [P0] Adversarial cases considered
  - **Evidence**: spec.md §8 lists embedded-number, uppercase, generic-slug, unreadable-parent, and raw-mkdir-bypass cases for the future guard
- [x] CHK-FIX-005 [P1] Scope axes listed
  - **Evidence**: Hook-parity audit covers four runtimes x (prompt-time, pre-write, SessionStart) axes in research.md §5
- [x] CHK-FIX-006 [P1] Degraded-runtime variant covered
  - **Evidence**: Gemini (no project hook) and Copilot (next-prompt-only) fallback documented in research.md §7
- [x] CHK-FIX-007 [P1] Evidence pinned to fixed references
  - **Evidence**: Citations use file:line against the working-tree state at authoring time, not a moving range


<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or executable content introduced
  - **Evidence**: Documentation-only packet; no scripts, no credentials
- [x] CHK-031 [P0] No files modified outside the packet folder
  - **Evidence**: Only files under `007-spec-folder-naming-guard/` created; `create.sh` / `validate.sh` / hooks untouched
- [x] CHK-032 [P1] Recommended guard fails open by design
  - **Evidence**: NFR-S02 specifies allow-and-warn on guard self-error to avoid blocking all creation


<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/research synchronized
  - **Evidence**: All four documents reflect the PARTIAL verdict and the same layered design
- [x] CHK-041 [P1] Citations are file:line and resolve
  - **Evidence**: Each cited path read directly during research; line numbers verified
- [x] CHK-042 [P2] Risks and open questions captured
  - **Evidence**: `spec.md` §6 / §9 and `research.md` §Risks list raw-mkdir bypass, parity gaps, false positives


<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: `scratch/.gitkeep` present; no temp artifacts outside scratch/
- [x] CHK-051 [P1] Packet metadata generated
  - **Evidence**: `description.json` and `graph-metadata.json` generated for the packet


<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-06
**Verified By**: AI Assistant (claude-opus-4-8)

<!-- /ANCHOR:summary -->
