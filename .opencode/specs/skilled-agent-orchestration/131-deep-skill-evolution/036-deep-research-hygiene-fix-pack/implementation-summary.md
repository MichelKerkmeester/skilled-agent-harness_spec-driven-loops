---
title: "Implementation Summary: Deep Research Hygiene and Negative Knowledge Dedup"
description: "Packet 122 implementation summary and commit handoff."
trigger_phrases:
  - "DR-005"
  - "C-008"
  - "DR-008"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-research-hygiene-fix-pack"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed packet 122"
    next_safe_action: "Stage files listed in commit handoff"
    blockers: []
    key_files:
      - ".opencode/skills/deep-research/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-research/scripts/verify-yaml-script-paths.sh"
      - ".opencode/skills/deep-research/SKILL.md"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 122-deep-research-hygiene-fix-pack |
| **Completed** | 2026-05-23 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet 122 closed the P2 hygiene bundle:

- DR-005: `ruledOutDirections` now deduplicates identical negative-knowledge rows by normalized content hash while preserving first-seen iteration.
- C-008: Added `verify-yaml-script-paths.sh` to check Node `.cjs` script paths in four deep-loop workflow YAML assets.
- DR-008: Audited `SKILL.md`; no deleted `mcp__mk_spec_memory__deep_loop_graph_*` allowed-tools entries remain.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-research/scripts/reduce-state.cjs` | Modified | Content-hash dedup |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Modified | DR-005 regression test |
| `.opencode/skills/deep-research/scripts/verify-yaml-script-paths.sh` | Created | C-008 verification |
| `.opencode/specs/skilled-agent-orchestration/122-deep-research-hygiene-fix-pack/` | Created | Level 2 packet docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The reducer now hashes normalized negative-knowledge text and drops later duplicates after sorting by first-seen iteration. The verifier script scans the two deep-research and two deep-review workflow YAML files for `node .opencode/.../*.cjs` references and confirms each target exists.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hash normalized full text | Avoids fuzzy over-deduplication |
| Preserve first-seen iteration | Keeps traceability stable |
| Use shell verifier | Shorter than adding a new test harness for YAML path checks |
| Do not edit SKILL.md when clean | Deleted graph MCP entries were already absent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reducer syntax | PASS: `node --check .opencode/skills/deep-research/scripts/reduce-state.cjs` |
| Verifier syntax/run | PASS: `bash -n ... && verify-yaml-script-paths.sh` |
| DR-008 grep | PASS: no deleted graph MCP tools found |
| Targeted Vitest | PASS: reducer suite passed |
| Packet strict validation | PASS: `validate.sh .../122-deep-research-hygiene-fix-pack --strict` |
| sk-doc validation | PASS after modified Markdown validation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The verifier matches the checked-in `node .opencode/.../*.cjs` command pattern. It is not a general YAML parser.
2. DR-008 required no file edit because the deleted tool prefix was already absent.
<!-- /ANCHOR:limitations -->

---

## Commit Handoff (122)

Suggested commit message:

```text
fix(122): deep-research hygiene fix-pack - DR-005 + C-008 + DR-008

Deduplicate negative-knowledge registry rows by content hash, add a workflow
YAML script-path verifier, and record the DR-008 allowed-tools audit showing
deleted deep-loop graph MCP tools are absent.
```

Files for `git add`:

```text
.opencode/skills/deep-research/scripts/reduce-state.cjs
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts
.opencode/skills/deep-research/scripts/verify-yaml-script-paths.sh
.opencode/specs/skilled-agent-orchestration/122-deep-research-hygiene-fix-pack/spec.md
.opencode/specs/skilled-agent-orchestration/122-deep-research-hygiene-fix-pack/plan.md
.opencode/specs/skilled-agent-orchestration/122-deep-research-hygiene-fix-pack/tasks.md
.opencode/specs/skilled-agent-orchestration/122-deep-research-hygiene-fix-pack/checklist.md
.opencode/specs/skilled-agent-orchestration/122-deep-research-hygiene-fix-pack/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/122-deep-research-hygiene-fix-pack/description.json
.opencode/specs/skilled-agent-orchestration/122-deep-research-hygiene-fix-pack/graph-metadata.json
```
