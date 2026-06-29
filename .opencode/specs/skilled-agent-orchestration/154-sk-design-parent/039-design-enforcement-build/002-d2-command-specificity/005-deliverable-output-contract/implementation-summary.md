---
title: "Implementation Summary: D2-R5 — Per-command deliverable output contract for /design:*"
description: "Every /design:* command now declares a named, enforced outputContract in the metadata SSOT, mirrored into an Emit Deliverable wrapper section and reconciled against proofFields and the tool-policy lane by the surface checker."
trigger_phrases:
  - "d2-r5 output contract implementation summary"
  - "design command deliverable contract delivered"
  - "outputContract emit deliverable summary"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/005-deliverable-output-contract"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Level 2 impl doc for the per-command outputContract and surface-check gate"
    next_safe_action: "Run D2-R6 sibling-discriminator phase for the /design:* command surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r5-deliverable-output-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-deliverable-output-contract |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Each `/design:*` command now produces a named, enforced deliverable instead of a bare `STATUS=OK|FAIL` tail. Before this phase the wrappers declared only a status string, so the deliverable's name, kind, required fields, and file outputs were undefined and nothing downstream could check them. The deliverable each command emits is now a first-class contract in the `command-metadata.json` SSOT, mirrored into the wrapper body and reconciled against the existing proof and tool-policy lanes by the surface checker.

### The outputContract per command

Every one of the five `command-metadata.json` records gained an `outputContract{primaryArtifactName, artifactKind, requiredFields, fileOutputs}` block. `requiredFields` mirrors each record's existing `proofFields`, so the deliverable contract and the proof obligation stay in lockstep. The four read-and-guide modes return their artifact inline and carry empty `fileOutputs`; only the mutating `md-generator` names a written file:

| Command | primaryArtifactName | artifactKind | fileOutputs |
|---------|---------------------|--------------|-------------|
| `/design:audit` | Design Quality Audit Report | report | `[]` |
| `/design:foundations` | Visual System Foundations Plan | plan | `[]` |
| `/design:interface` | Interface Direction Spec | spec | `[]` |
| `/design:md-generator` | Style Reference DESIGN.md | reference-doc | `["<output>/DESIGN.md"]` |
| `/design:motion` | Motion Design Spec | spec | `[]` |

### The Emit Deliverable wrapper sections

Each of the five wrappers gained an appended `## 3. EMIT DELIVERABLE` body section that names its `primaryArtifactName` (for example, `audit.md:32` emits `Design Quality Audit Report`; `md-generator.md` also lists `<output>/DESIGN.md`). The section is a projection of the SSOT; wrapper frontmatter (`allowed-tools`, `argument-hint`) was left untouched so the D2-R1/R2 parity holds.

### The surface-check extension

`design-command-surface-check.mjs` was extended additively: `outputContract` joined `REQUIRED_FIELDS`, with sub-shape validation (non-empty-string `primaryArtifactName`/`artifactKind`, non-empty string-array `requiredFields`, string-array `fileOutputs`), a generic-artifact-name ban, the `artifactKind` enum (`report | plan | spec | reference-doc`), the `requiredFields == proofFields` reconciliation, the `fileOutputs` non-empty-iff-`mutatesWorkspace` rule, and an `emit-deliverable` body-drift check that confirms each wrapper carries the section and names its artifact.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Added `outputContract` to all five records |
| `.opencode/commands/design/audit.md` | Modified | Appended Emit Deliverable naming "Design Quality Audit Report" |
| `.opencode/commands/design/foundations.md` | Modified | Appended Emit Deliverable naming "Visual System Foundations Plan" |
| `.opencode/commands/design/interface.md` | Modified | Appended Emit Deliverable naming "Interface Direction Spec" |
| `.opencode/commands/design/md-generator.md` | Modified | Appended Emit Deliverable naming "Style Reference DESIGN.md" + file output |
| `.opencode/commands/design/motion.md` | Modified | Appended Emit Deliverable naming "Motion Design Spec" |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Additive contract validation, ban, enum, reconciliation, body check |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) edited the seven scope-locked files, then the orchestrator verified acceptance independently. `node design-command-surface-check.mjs` returns `STATUS=PASS`, `invalid=0`, `drift=0` — the new `outputContract` checks and the existing frontmatter parity all pass for the five records. A synthetic break (a non-mutating command given a non-empty `fileOutputs`) flips the checker to `STATUS=INVALID` with `outputContract.fileOutputs must be empty when toolPolicy.mutatesWorkspace is false` (invalid=1); restoring returns `invalid=0 drift=0`, proving the gate bites. `command-metadata.json` is valid JSON, `node --check` on the checker exits 0, the D2-R1/R2 frontmatter (`allowed-tools` + `argument-hint`) is preserved on all five wrappers, and the evergreen grep is clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Set `requiredFields == proofFields` | The deliverable's required fields and the command's proof obligation are the same set; mirroring them keeps a single source and lets the checker reject drift |
| Gave only `md-generator` a `fileOutputs` entry | It is the one `mutatesWorkspace: true` mode that writes a file; the four read-and-guide modes return inline and must declare empty `fileOutputs` |
| Mirrored the contract into a wrapper body section, not frontmatter | Keeps D2-R1/R2 frontmatter byte-stable while still giving the wrapper a checkable Emit Deliverable surface |
| Matched the body-drift check on heading + artifact name only | Avoids enforcing prose, so the check stays robust to editorial wording while still proving the section is present and correct |
| Kept the change additive | Every prior parity and drift check still passes, so the contract layers on without regressing the existing gate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS (STATUS=PASS, invalid=0, drift=0) |
| `node --check design-command-surface-check.mjs` | PASS (exit 0) |
| `command-metadata.json` valid JSON, five `outputContract` blocks | PASS |
| Synthetic break: non-mutating + non-empty `fileOutputs` | PASS (STATUS=INVALID, invalid=1, exact message); reverted to invalid=0 drift=0 |
| `requiredFields == proofFields` per record | PASS (all five reconcile) |
| `fileOutputs` non-empty iff `mutatesWorkspace` | PASS (md-generator only) |
| Emit Deliverable section present + names artifact in five wrappers | PASS (e.g. audit.md:30,32; md-generator.md:30,32,40) |
| D2-R1/R2 frontmatter parity preserved | PASS (`allowed-tools` + `argument-hint` unchanged on all five) |
| Evergreen (no spec/packet/phase IDs in the seven files) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`primaryArtifactName` / `artifactKind` wording is editorial-finalizable.** The checker enforces non-generic, in-enum, reconciled values, but the exact phrasing can be tuned later without changing the gate.
2. **Generated metadata is regenerated downstream.** `description.json` and `graph-metadata.json` are owned by the generation step; `validate.sh --strict` reports the expected `GENERATED_METADATA` residual after this doc edit, and the orchestrator regenerates them rather than hand-editing.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Per-command outputContract + Emit Deliverable section + additive surface-check gate
- Surface-check PASS (invalid=0 drift=0); synthetic break proves the gate bites; frontmatter parity preserved
-->
