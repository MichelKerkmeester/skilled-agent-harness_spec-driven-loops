---
title: "Feature Specification: Remove remaining post-014-deprecation coco/ccc/rerank residue across non-code-graph surfaces [template:level_2/spec.md]"
description: "The 013 deep-review surfaced coco/ccc/rerank residue on six non-code-graph surfaces the 014 arc missed (GEMINI.md coco routing P0, /memory:manage ccc subcommand, advisor skill-graph runtime copy, .gitignore, sidecar-env-allowlist RERANK_, a session-start playbook), plus a seventh found during this work: dead cocoindex/rerank daemon-kill rules in the RM-8 process harness. This packet removes all of them."
trigger_phrases:
  - "remaining coco residue remediation"
  - "cross-surface ccc cleanup"
  - "013 deep-review residue followup"
  - "process-harness coco daemon kill removal"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/002-deprecate-coco-index/015-remediate-cross-surface-residue"
    last_updated_at: "2026-05-25T16:10:00Z"
    last_updated_by: "main-agent"
    recent_action: "Fixed all 7 surfaces; gates green, tsc + vitest pass"
    next_safe_action: "Validate and commit the cross-surface residue packet"
    blockers: []
    key_files:
      - ".gemini/GEMINI.md"
      - ".opencode/commands/memory/manage.md"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-cross-surface-residue-001"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Remove remaining post-014-deprecation coco/ccc/rerank residue across non-code-graph surfaces

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-25 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 014 CocoIndex + rerank-sidecar deprecation deleted the code, and `014-remediate-codegraph-naming` cleaned the code-graph docs, but six non-code-graph surfaces still carried residue that the 013 deep-review confirmed: `.gemini/GEMINI.md` still routed Gemini to the deleted `mcp__cocoindex_code__search` (**P0** — the only routing doc that did); `/memory:manage` still declared a `ccc <status|reindex|feedback>` subcommand + a CCC MODE section calling removed `ccc_*` tools; the advisor's runtime `database/skill-graph.json` carried stale `system-rerank-sidecar`/`8765` refs; `.gitignore` kept `.cocoindex_code/`; the embedder sidecar's env allowlist kept a dead `RERANK_` prefix; and the `250-session-start` playbook asserted a Code Graph status based on a `.venv/bin/ccc` binary the hook no longer checks. A seventh surface was found during this work: the RM-8 process-classification harness still carried cocoindex-daemon / cocoindex-mcp / rerank-sidecar kill rules + a `ccc-daemon` classification for daemons that can no longer spawn (skills deleted).

### Purpose
No non-code-graph surface routes to, declares, classifies, or ignores a deleted CocoIndex/rerank artifact; routing docs are 4-runtime-consistent on the HYBRID (code-graph + Grep) policy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.gemini/GEMINI.md` SEARCH ROUTING → mirror the canonical `.claude/CLAUDE.md` HYBRID policy (code-graph + Grep; no CocoIndex).
- `/memory:manage` → remove the `ccc` subcommand everywhere (description, argument-hint, validate list, error list, purpose, action, instructions, routing tree, CCC MODE section, error-handling row) + renumber sections.
- Advisor `skill-graph.json` → confirm the tracked `scripts/` copy is clean; sync the gitignored `database/` runtime copy.
- `.gitignore` → remove `.cocoindex_code/`.
- `sidecar-env-allowlist.cjs` → remove the dead `RERANK_` env prefix (file stays — it is the live embedder sidecar's allowlist).
- `250-session-start-startup.md` → reframe `.venv/bin/ccc` to "code-graph readiness" (the hook's real check).
- `process-memory-harness.ts` (+ its two vitests) → remove the cocoindex/rerank daemon-kill rules, `ccc-daemon` classification, deleted-skill owner paths, `RERANK_SIDECAR_OWNER_TOKEN`, and coco/rerank fixtures (operator-approved).

### Out of Scope
- The `system-code-graph` docs (done in sibling `014-remediate-codegraph-naming`).
- Documented kept exceptions: cli-* `pkill ccc search` orphan-sweep, `F-AC3-*`/`409-fixture` frozen test data, and accurate removal-documenting prose in `system-spec-kit/SKILL.md` / `embedder_architecture.md` / `registry.ts`.
- Three borderline candidates observed but not folded in (deep-loop README sidecar_ledger line, system-spec-kit playbook "CCC stubs/trio" old naming, sidecar-client.ts cross-encoder comment) — noted for a future pass.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gemini/GEMINI.md` | Modify | coco routing → HYBRID |
| `.opencode/commands/memory/manage.md` | Modify | remove ccc subcommand + CCC MODE; renumber §18/§19 |
| `.gitignore` | Modify | drop `.cocoindex_code/` |
| `.opencode/bin/lib/sidecar-env-allowlist.cjs` | Modify | drop `RERANK_` prefix |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/250-session-start-startup.md` | Modify | `.venv/bin/ccc` → code-graph readiness |
| `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | Modify | remove coco/rerank daemon-kill rules + ccc-daemon class + fixtures |
| `.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts` | Modify | update fixture + assertions + counts |
| `.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts` | Modify | re-point sidecar test to ollama; drop ccc-daemon test |
| advisor `database/skill-graph.json` | Modify (local, gitignored) | sync from clean tracked `scripts/` copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | GEMINI.md no longer routes to a deleted coco tool | `rg -i cocoindex .gemini/GEMINI.md` == 0; routing matches `.claude/CLAUDE.md` HYBRID policy |
| REQ-002 | No surface references a deleted coco/ccc/rerank artifact | Per-target grep == 0 across all 7 surfaces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Code changes type-check and tests pass | `tsc -p scripts/tsconfig.json` 0 errors; `process-memory-harness` + `process-sweep` vitests green |
| REQ-004 | No broken section numbering / mangled command spec | manage.md sections gap-free; argument-hint well-formed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 per-target residue greps return 0. ✅ ACHIEVED
- **SC-002**: `tsc` clean + both process-* vitests pass (20/20). ✅ ACHIEVED
- **SC-003**: `validate.sh <packet> --strict` clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing RM-8 daemon-kill safety rules | Med | Operator-approved; verified the daemons can't spawn (skills deleted) + tsc/vitest green; `process-sweep.ts` (operational) was already coco-agnostic |
| Risk | sidecar-env-allowlist is live (embedder) | Low | Confirmed 3 importers; removed only the dead `RERANK_` prefix, kept the file |
| Risk | Mangling manage.md special-char argument-hint | Low | Verified post-edit the line is well-formed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — residue removal, no hot path.

### Security
- **NFR-S01**: `RERANK_SIDECAR_OWNER_TOKEN` removal does not weaken redaction — the generic `*TOKEN` alternation still redacts it.

### Reliability
- **NFR-R01**: RM-8 kill-safety preserved for live daemons (code-graph, spec-memory, ollama rules + tests retained).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- "CCC" as an unrelated test-category prefix (mcp-code-mode, sk-doc) is NOT residue — left intact.

### Error Scenarios
- A lingering pre-deletion orphan ccc/rerank daemon: still covered by the operator's runtime `pkill` sweep (a separate mechanism from the harness classification rules).

### State Transitions
- Gitignored `database/skill-graph.json`: self-heals on recompile; synced locally for immediate correctness.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 8 tracked files across configs/commands/code/docs/tests |
| Risk | 10/25 | One code+test change (RM-8 harness); rest are removals |
| Research | 8/20 | 013 findings + this-session verification + harness/hook reading |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — operator approved the daemon-kill removal; all targets verified.
<!-- /ANCHOR:questions -->
