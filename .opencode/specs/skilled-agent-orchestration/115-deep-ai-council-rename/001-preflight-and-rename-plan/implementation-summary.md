---
title: "Implementation Summary: 115/001 — direction-flipped preflight rename plan"
description: "Preflight emitted the skill-only rename contract for sk-ai-council -> deep-ai-council and marks the agent rename phase skipped because all four runtime agent files already use ai-council."
trigger_phrases:
  - "115 preflight summary"
  - "direction flipped rename plan"
  - "rename plan emitted"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/115-deep-ai-council-rename/001-preflight-and-rename-plan"
    last_updated_at: "2026-05-23T07:00:29Z"
    last_updated_by: "main_agent"
    recent_action: "preflight done — rename plan emitted"
    next_safe_action: "dispatch 002 skill rename"
    blockers: []
    key_files:
      - "scratch/rename-plan.json"
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115001"
      session_id: "115-001-direction-flipped-preflight"
      parent_session_id: "115-001-spec-init"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Direction is flipped from stale parent docs: sk-ai-council -> deep-ai-council."
      - "Scope is skill-only; agent rename phase 003 is skipped because all four runtime mirrors already use ai-council."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-preflight-and-rename-plan |
| **Completed** | 2026-05-23 |
| **Level** | 2 |
| **Direction** | `sk-ai-council -> deep-ai-council` |
| **Scope** | Skill-only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The preflight contract now matches the actual Wave 1 A1 direction: rename the skill from `sk-ai-council` to `deep-ai-council`, leave the already-renamed `ai-council` agents alone, and skip sub-phase 003. The emitted `scratch/rename-plan.json` gives Wave 2 a machine-readable file map with executable phases 002, 004, 005, and 006.

### Scan And Classification

The rg baseline command found 201 files containing `sk-ai-council` after excluding `z_archive`. The plan classified 205 total paths after adding explicit handoff paths that the rg roots cannot see or that have no current hit: `README.md`, `AGENTS.md`, `.github/hooks/scripts/pre-push-council.sh`, and `multi-ai-council-runtime-parity.vitest.ts`.

Operation counts:

| Operation | Count | Notes |
|-----------|-------|-------|
| 002 skill rename | 80 | `.opencode/skills/sk-ai-council/**` only |
| 004 sibling edges and TypeScript | 6 | Four graph metadata files, current `lib/scorer/lanes/explicit.ts`, and runtime parity vitest |
| 005 root docs, hooks, index | 4 | `README.md`, `AGENTS.md`, hook script, skills README |
| Unsorted/manual triage | 115 | Agent no-op files, historical/spec surfaces, generated advisor assets, and related tests not assigned to 002/004/005 |

### Agent Phase Skipped

Sub-phase 003 is skipped because all four runtime mirrors already exist at the target `ai-council` slug:

| Runtime | Existing target file |
|---------|----------------------|
| OpenCode | `.opencode/agents/ai-council.md` |
| Claude | `.claude/agents/ai-council.md` |
| Codex | `.codex/agents/ai-council.toml` |
| Gemini | `.gemini/agents/ai-council.md` |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/rename-plan.json` | Created | Direction-flipped Wave 2 contract with phase scopes and preservation policy |
| `spec.md` | Modified | Updated `_memory.continuity` and status for completed preflight |
| `implementation-summary.md` | Modified | Captured scan counts, skip rationale, verification, and commit handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I used the requested rg sweep as the baseline, added only explicitly named handoff paths, and kept all writes inside `001-preflight-and-rename-plan/`. No skill files, agent files, sibling phase folders, root docs, hooks, or generated advisor files were modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat parent 115 direction as stale | The user explicitly corrected the direction, and packet 130 research supports `deep-ai-council` as the proposed iterative council identity. |
| Skip phase 003 | The target agent slug already exists across all four runtime mirrors, so a rename wave would be a no-op with unnecessary risk. |
| Include explicit operation 005 paths outside rg roots | The requested baseline command does not search root `README.md` or `.github/`, but Wave 2 still needs those paths in the contract. |
| Use current `lib/scorer/lanes/explicit.ts` path | The requested `lib/scoring/explicit.ts` path does not exist; the current repo path is the scorer lane file. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -l "sk-ai-council" .opencode .claude .codex .gemini 2>/dev/null \| grep -v "z_archive" \| sort` | PASS, 201 baseline files |
| Agent target files exist | PASS, all four `ai-council` runtime files present |
| `python3 -c "import json; json.load(open('.../scratch/rename-plan.json'))"` | PASS, JSON parsed successfully |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/001-preflight-and-rename-plan --strict` | PASS, Level 2 with 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Unsorted paths need human triage before broad repo edits.** The plan intentionally flags 115 paths outside the 002/004/005 buckets instead of guessing ownership.
2. **Historical preservation stays frozen.** `z_archive`, `101-deep-multi-ai-council-skill`, and the `026` research track remain out of scope for rename edits.
<!-- /ANCHOR:limitations -->

---

## Commit Handoff

Suggested commit: `feat(115/001): preflight — rename-plan.json with FLIPPED direction (sk-ai-council → deep-ai-council)`

Explicit paths for `git add`:

```bash
git add \
  .opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/001-preflight-and-rename-plan/scratch/rename-plan.json \
  .opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/001-preflight-and-rename-plan/spec.md \
  .opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/001-preflight-and-rename-plan/implementation-summary.md \
  .opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/001-preflight-and-rename-plan/checklist.md
```
