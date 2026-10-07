---
title: "Implementation Summary: SpecKit Scratch Folder Enforcement [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/001-scratch-enforcement/implementation-summary]"
description: "Reconstructed implementation summary for the scratch folder enforcement work, derived from spec.md, plan.md, tasks.md and git history."
trigger_phrases:
  - "scratch folder enforcement summary"
  - "speckit scratch enforcement delivery"
  - "documentation-based scratch enforcement"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Summary: SpecKit Scratch Folder Enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-scratch-enforcement |
| **Completed** | 2025-12-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet closed the documentation-enforcement gap that let temporary files land in the project root or a spec folder root. Enforcement was delivered entirely through documentation because OpenCode does not support hooks, so the rules had to live where agents read them: AGENTS.md critical rules, the failure-pattern table, the templates and the checklist.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | Critical rule, failure pattern #15 and a mandatory rules block for scratch placement |
| `.opencode/speckit/templates/spec.md` | Modified | Working files section with scratch guidance |
| `.opencode/speckit/templates/tasks.md` | Modified | Working files location guidance |
| `.opencode/speckit/templates/research/research/research.md` | Modified | File organization section |
| `.opencode/speckit/templates/checklist.md` | Modified | CHK036-038 cleanup verification items |
| `.opencode/commands/spec_kit/complete.md` | Modified | Scratch guidance in the command workflow |
| `.opencode/commands/spec_kit/implement.md` | Modified | Scratch guidance in the command workflow |
| `.opencode/commands/spec_kit/research/research/research.md` | Modified | Scratch guidance in the command workflow |
| `.opencode/skills/workflows-spec-kit/SKILL.md` | Modified | Enforcement rules, ALWAYS rule #11 and NEVER rule #8 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Eight parallel analysis agents mapped the current scratch documentation, the enforcement gaps, and the root-folder state. The implementation then worked through six phases: AGENTS.md updates, template updates, command updates, skill updates, and spec-folder completion. Verification was a final review with 8-agent parallel verification plus manual checks recorded in `tasks.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Documentation-based enforcement instead of hooks | OpenCode does not support hooks, so MUST/NEVER rules and template guidance are the only mechanisms that work in both environments. |
| Checklist items CHK036-038 as primary enforcement | Completion claims depend on the checklist, so cleanup verification blocks a done claim without any automation. |
| AGENTS.md critical rules treated as P0 | Rules in the critical section are read by all agents regardless of hook support. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| AGENTS.md updated with 3 additions | Recorded as done in `tasks.md` |
| 4 templates updated with scratch guidance | Recorded as done in `tasks.md` |
| 3 commands updated with scratch notes | Recorded as done in `tasks.md` |
| SKILL.md updated with enforcement rules | Recorded as done in `tasks.md` |
| CHK036-038 appear in checklist template | Recorded as done in `tasks.md` |
| OpenCode compatibility notes present | Recorded as done in `tasks.md` (27 mentions verified) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No hook-based blocking** OpenCode has no hook support, so a file placed outside `scratch/` cannot be blocked automatically; `spec.md` records hook-based blocking as future work (SC-007, SC-008).
2. **The "D) Skip" option still bypasses validation** `spec.md` records this as an open risk; the documentation-based rules depend on an agent following them.
<!-- /ANCHOR:limitations -->
