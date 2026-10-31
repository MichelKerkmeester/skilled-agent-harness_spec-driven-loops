---
title: "Implementation Summary"
description: "Research records now take continuity updates in spec.md instead of being refused by the save."
trigger_phrases:
  - "research folder continuity implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/052-research-folder-continuity"
    last_updated_at: "2026-10-19T22:06:11Z"
    last_updated_by: "generate-context"
    recent_action: "Wrote research continuity into spec.md and saved 082 children 014-018"
    next_safe_action: "Monitor Changed Packet Validation on main for this packet"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts"
      - "scratch/facts.md"
    session_dedup:
      fingerprint: "sha256:aea2944bca6599c890277f44fa3de883774d6e5e97f14321ca154e33f49dad6e"
      session_id: "scaffold-052-research-folder-continuity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 052-research-folder-continuity |
| **Completed** | 2026-10-19 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A full-auto save used to refuse every research record that carried continuity fields, so the blocks stayed at the values the scaffolder wrote. The writer now hosts a research record's continuity block in its spec.md and writes it like any other leaf. The 082 children 014 through 018 now report real stop states, fix backlog pointers and completion percentages instead of scaffold defaults.

### Let the continuity writer save into a research-level folder

The writer now asks `continuityHostPath(leafPath)` in `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` where the block lives. The answer is the leaf's `implementation-summary.md` when the file exists, else the leaf's `spec.md` when that file carries `<!-- SPECKIT_LEVEL: research -->`, else null. `planContinuityWrite` validates the merge against that host and carries it in the write plan as `hostPath`. `writePlannedContinuity` re-reads the host, rebuilds the merge and renames a temp file over it, so a save that reached the leaf through its parent cannot interleave with one aimed at the leaf directly.

You gain a research record that shows the stop state, the fix backlog pointer and the completion percentage of the latest run, and no implementation-summary.md appears in a research folder. A non-research leaf without a summary keeps the refusal message, so nothing writes into a doc the save contract never agreed on. The blocker came from commit 0d0f2a0a95 (2026-09-23, "write continuity fields from the save payload"), which wrote payload continuity only into implementation-summary.md. Research records, scaffolded by create.sh since commit e1a408ff6b (2026-09-07), keep that block in spec.md (template `templates/packet-types/research.spec.md.tmpl`, marker `<!-- SPECKIT_LEVEL: research -->`) and never get an implementation summary, so every save of one refused.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` | Modified | Adds `continuityHostPath(leafPath)` and reads, merges and renames the continuity block in the host it returns. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts` | Modified | Adds the research-record spec.md write case and the non-research refusal case. |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modified | The --help text names a research record's spec.md as the other continuity host. |
| `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` | Modified | The planner-mode table names a research record's spec.md as the other continuity host. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/014-post-merge-deep-research/spec.md` | Modified | Continuity block only. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/015-post-merge-research-sk-vision/spec.md` | Modified | Continuity block only. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/016-post-merge-research-cli-opencode-ci/spec.md` | Modified | Continuity block only. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/017-post-merge-research-provisioning/spec.md` | Modified | Continuity block only. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/018-post-merge-research-conformance/spec.md` | Modified | Continuity block only. |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/014-018 description.json and graph-metadata.json, and the 082 parent graph-metadata.json | Regenerated | Written by the same saves, which refresh each child's description and graph metadata and the parent's last-active pointer |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline suite ran green before any edit at 15 of 15 (`specs/system-speckit/052-research-folder-continuity/scratch/before/vitest-baseline.txt`). The two new cases then ran against the unfixed writer: 1 failed, 16 passed, exit 1, with the research case failing (`specs/system-speckit/052-research-folder-continuity/scratch/before/vitest-new-test-on-old-code.txt`). With `continuityHostPath` in place the suite passed 17 of 17 with exit 0 (`specs/system-speckit/052-research-folder-continuity/scratch/after/vitest.txt`). `tsc --noEmit` exited 0 and dist was rebuilt with `npm run build`, exit 0.

On the writer side, the five 082 research children 014 through 018 were saved through `generate-context.js --full-auto --json` with continuity fields composed from each `research/research.md` (the answer and stop state in it, plus the fix backlog section) and `research/deep-research-state.jsonl`. All five saves exited 0 and none logged "Continuity not written" (`specs/system-speckit/052-research-folder-continuity/scratch/after/save-runs.txt`). The scaffold string "Scaffolded the research record before the first iteration" appeared in 5 continuity blocks before the run and in 0 after (`specs/system-speckit/052-research-folder-continuity/scratch/before/research-continuity-blocks.txt` and `specs/system-speckit/052-research-folder-continuity/scratch/after/research-continuity-blocks.txt`). completion_pct is 80 for 014 (manual stop, key question 2 open) and 90 for 015 through 018 (open questions stay in each research.md section 12, since the block only takes question ids).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Host precedence starts at implementation-summary.md | Packet leaves already write there. Existing saves keep that behavior |
| The research level marker in spec.md decides the fallback | It reads the leaf itself, so no new metadata field or packet-type registry is needed |
| A non-research leaf keeps the refusal | The save contract never agreed on a host doc for a leaf with neither a summary nor the marker |
| The caller composes the payload | Deriving continuity automatically inside the writer from research.md stays out of scope, so the payload was composed from research.md and the state log outside |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline suite before any change | PASS: 15 of 15 (`specs/system-speckit/052-research-folder-continuity/scratch/before/vitest-baseline.txt`) |
| New cases against the unfixed writer | FAIL as intended: 1 failed, 16 passed, exit 1, the research case failing (`specs/system-speckit/052-research-folder-continuity/scratch/before/vitest-new-test-on-old-code.txt`) |
| Suite against the fixed writer | PASS: 17 of 17, exit 0 (`specs/system-speckit/052-research-folder-continuity/scratch/after/vitest.txt`) |
| `tsc --noEmit` | PASS: exit 0 |
| `npm run build` | PASS: dist rebuilt, exit 0 |
| Full-auto saves of the five 082 research children | PASS: all five exit 0, zero "Continuity not written" warnings (`specs/system-speckit/052-research-folder-continuity/scratch/after/save-runs.txt`) |
| Scaffold string census across the five blocks | PASS: 5 blocks before, 0 after (`specs/system-speckit/052-research-folder-continuity/scratch/before/research-continuity-blocks.txt`, `specs/system-speckit/052-research-folder-continuity/scratch/after/research-continuity-blocks.txt`) |
| Recursive strict validation of the 082 packet | PASS: 19 of 19 RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The block takes question ids only.** Open-question text stays in each `research/research.md` section 12, so a reader who wants the questions opens the research file.
2. **No automatic derivation.** The writer does not compose continuity from a research record's files by itself. You compose the payload and pass it to the save.
<!-- /ANCHOR:limitations -->

---

