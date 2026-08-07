---
title: "Verification Checklist: Devin docs, agents, governance, and closeout"
description: "Verification Date: TBD -- verify against the live tree at implementation time"
trigger_phrases: ["Devin docs closeout checklist", "Devin agent roster restore checklist"]
importance_tier: normal
contextType: general
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/007-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md covering restoration completeness and the 2 regression guards"
    next_safe_action: "Wait for phases 002-006, then verify against the live tree and mark items with evidence"
    blockers: ["Phases 002-006 must land before most items below have anything to verify against."]
    key_files: [".opencode/agents/context.md", "AGENTS.md", "CLAUDE.md", "README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Devin docs, agents, governance, and closeout
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling | Completion Impact |
|---|---|---|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-001 [P0] Phases 002-006 confirmed landed before this phase's doc restoration begins.
  - **Evidence**: TBD -- review each phase's `implementation-summary.md` at implementation time.
- [ ] CHK-002 [P0] Current-tree touch points identified via `ls`/`rg`, not archived line numbers.
  - **Evidence**: TBD -- re-run the current-tree grep from `spec.md`'s answered_questions immediately before editing.
- [ ] CHK-003 [P1] Archived removal's `context/context-report.md` touch-list reviewed as an input only, not replayed verbatim.
  - **Evidence**: TBD -- cite the specific archived paths consulted vs. the current paths actually edited.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] Restored agent-roster mentions use CURRENT filenames (`context.md`/`.toml`, not `deep-context.md`/`.toml`).
  - **Evidence**: TBD -- `rg -n "cli-devin" .opencode/agents .claude/agents .codex/agents` and confirm zero hits reference `deep-context`.
- [ ] CHK-011 [P0] `AGENTS.md` and `CLAUDE.md` contain matching restored content, each edited as an independent file.
  - **Evidence**: TBD -- `git status --short` shows both files changed; side-by-side diff of the restored sections confirms content parity.
- [ ] CHK-012 [P1] `README.md` and `.opencode/skills/README.md` entries follow the existing `cli-codex` entry pattern for consistency.
  - **Evidence**: TBD -- diff the new `cli-devin` entry against the confirmed live `cli-codex` entry shape.
- [ ] CHK-013 [P1] No orphaned references to `deep-context.md` introduced anywhere in this phase's edits.
  - **Evidence**: TBD -- `rg -n "deep-context"` across all files touched by this phase returns zero hits.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] `validate.sh <packet> --recursive --strict` exits 0 across the whole 7-phase packet.
  - **Evidence**: TBD -- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/029-cli-devin-revival --recursive --strict` output.
- [ ] CHK-021 [P0] `parent-skill-check.cjs cli-external-orchestration` exits 0.
  - **Evidence**: TBD -- `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` output.
- [ ] CHK-022 [P0] Final `rg -n "cli-devin" .opencode/agents .claude/agents .codex/agents AGENTS.md CLAUDE.md README.md` returns nonzero hits.
  - **Evidence**: TBD -- command output, the inverse of the original deprecation's zero-hits proof.
- [ ] CHK-023 [P1] `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `remediation.vitest.ts` reviewed and confirmed to NOT assert a 4-member executor union or `cli-devin`'s absence.
  - **Evidence**: TBD -- cite the specific test names/assertions reviewed and the confirming outcome.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Restoration finding class recorded as `cross-consumer` (agent rosters + governance docs + READMEs are independent consumers of the same "cli-devin exists" fact).
  - **Evidence**: TBD -- confirmed by the 8-surface consumer inventory in `plan.md`'s Affected Surfaces table.
- [ ] CHK-FIX-002 [P0] Same-class consumer inventory completed: 3 runtime agent directories x 4 agent files, plus `AGENTS.md`, `CLAUDE.md`, `README.md`, `.opencode/skills/README.md`.
  - **Evidence**: TBD -- the 16-point matrix in `plan.md`'s Affected Surfaces section, each point checked off in `tasks.md`.
- [ ] CHK-FIX-003 [P0] Consumer inventory confirms no other live doc/code surface still references `cli-devin`'s absence that this phase must also flip.
  - **Evidence**: TBD -- repo-wide `rg -n "devin"` review (excluding `.opencode/specs/**` historical content) for any missed live consumer.
- [ ] CHK-FIX-004 [P2] N/A -- no security/path/parser/redaction code changes in this docs-only phase.
  - **Evidence**: N/A by scope; confirmed no code files appear in this phase's Files to Change table.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed: {runtime x agent-file} = 3 x 4 = 12 rows, plus 4 standalone governance/README rows = 16 total restoration points.
  - **Evidence**: TBD -- confirmed against `plan.md`'s Affected Surfaces required-inventories section.
- [ ] CHK-FIX-006 [P2] N/A -- no process-wide or global runtime state is read by this phase's changes.
  - **Evidence**: N/A by scope; this phase edits static docs/rosters only.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the commit SHA created at this phase's completion, not a moving branch-relative range.
  - **Evidence**: TBD -- record the exact commit SHA in `implementation-summary.md` once this phase is executed.
<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security
- [ ] CHK-030 [P0] No secrets, tokens, or credentials introduced in any restored doc or agent file.
  - **Evidence**: TBD -- diff review of every changed file at implementation time.
- [ ] CHK-031 [P1] No prescriptive default executor reintroduced into `post-implementation-deep-review.md`.
  - **Evidence**: TBD -- `git diff` on that file is empty (see CHK-040).
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P0] `ADVISOR_RUNTIME_VALUES` (`advisor-runtime-values.ts`) and `runtime-parity.vitest.ts` confirmed untouched.
  - **Evidence**: TBD -- `git diff -- .opencode/skills/system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts` is empty.
- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md` all describe the identical restoration scope and the identical 2 explicit non-restoration surfaces.
  - **Evidence**: TBD -- cross-read confirms no drift between the 4 documents' Out of Scope / regression-guard language.
- [ ] CHK-042 [P1] Historical content (`.opencode/specs/**` z_archive, `changelog/**`, benchmark `*.jsonl`) confirmed untouched.
  - **Evidence**: TBD -- `git diff --stat` on those paths (outside this packet's own phases) is empty.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-050 [P1] No temp files left outside `scratch/`.
  - **Evidence**: TBD -- final `git status --short` review at implementation time.
- [ ] CHK-051 [P1] `scratch/` (if used) cleaned before completion claim.
  - **Evidence**: TBD -- confirm no leftover scratch artifacts in the final diff.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 2 | 0/2 |

**Verification Date**: TBD -- verify against the live tree at implementation time
<!-- /ANCHOR:summary -->
