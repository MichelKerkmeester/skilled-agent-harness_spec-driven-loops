---
title: "Implementation Summary: versioned command contract"
description: "Scaffold-only summary: the versioned command-contract phase is planned but not implemented. The doc set defines the sidecar schema, six-family population, template alignment, and the required-input fix; no schema file, template edits, or verification exist yet."
trigger_phrases:
  - "versioned command contract implementation"
  - "command contract sidecar schema"
  - "command contract scaffold status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/001-versioned-command-contract"
    last_updated_at: "2026-07-16T08:06:37Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Level-1 contract-phase doc set"
    next_safe_action: "Await 014 asset-layer research before finalizing schema"
    blockers:
      - "Mode-matrix and typed presentation-exception shape pending 014 asset-layer research"
    key_files:
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_template.md"
    completion_pct: 0
    open_questions:
      - "Sidecar file format: JSON versus YAML"
      - "Whether the mode matrix lives in the contract or a separate mode-registry"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-versioned-command-contract |
| **Status** | In Progress |
| **Completed** | 0 of 7 tasks; scaffold and plan only, no schema file, template edits, or verification |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been implemented yet. This phase is scaffolded only: the doc set (spec, plan, tasks, and this summary) frames the versioned command-contract work but no runtime artifact exists.

The plan of record is to define a versioned command-contract schema as a sidecar file under `create-command/assets/`, populate it for all six command families (create, design, speckit, memory, doctor, deep), align both templates and the skill to consume it, and correct the required-input contradiction and the stale template references. The schema's non-asset fields (topology, gate owner, execution targets, destructive policy, invocation aliases) are authorable now; the asset-layer fields (mode matrix and typed presentation exceptions) are gated on the in-flight 014 asset-layer research.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| _None yet_ | — | No schema file, template edits, or skill edits have been made; this phase is scaffold-only |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Only the phase documentation has been authored. Implementation is deliberately paused because the mode-matrix and typed-presentation-exception fields depend on the sibling `014-command-asset-layer-research` deep-research run, which is currently in flight. The non-asset fields of the schema can begin once this doc set is approved, but no code or template change has been made.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship the contract as a sidecar asset, not template frontmatter | Some OpenCode and Claude loaders drop unverified frontmatter placement; a sidecar keeps the machine-readable source reliable |
| Split authoring into non-asset now, asset-layer after 014 | The mode-matrix and typed-presentation-exception detail is owned by the in-flight 014 research; non-asset fields do not depend on it |
| Resolve the required-input contradiction by naming the router-gate form | Declaring the resolved form here keeps enforcement scoped to phase 003 rather than expanding this phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Schema file defined | NOT STARTED — no sidecar schema exists yet |
| Six-family population | NOT STARTED — no family entries authored |
| Template validation against schema | NOT STARTED — templates unedited |
| Required-input contradiction resolved | NOT STARTED — resolution declared in plan, not yet applied |
| Strict packet validation | Spec-doc set passes `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` (Errors:0, Warnings:0); implementation verification not yet applicable |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This phase is scaffold-only. No schema file, template edits, skill edits, or verification runs exist; the tables above record planned work, not completed work.
2. **Blocked on 014.** The mode-matrix and typed-presentation-exception fields are finalized only after the sibling `014-command-asset-layer-research` run converges. Until then, only the non-asset schema fields are authorable.
3. **Open format questions.** The sidecar file format (JSON versus YAML) and whether the mode matrix lives inline or in a separate mode-registry remain undecided.
<!-- /ANCHOR:limitations -->
