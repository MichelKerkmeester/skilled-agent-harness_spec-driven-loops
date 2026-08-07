---
title: "Implementation Plan: Devin docs, agents, governance, and closeout"
description: "Restore cli-devin mentions across 3 runtime agent rosters and governance docs against the CURRENT tree, then run whole-packet closeout validation."
trigger_phrases: ["Devin docs closeout plan", "Devin agent roster restore plan"]
importance_tier: normal
contextType: general
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/007-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md covering doc/agent restoration and the closeout validation sequence"
    next_safe_action: "Wait for phases 002-006, then execute Phase 2 Implementation below in order"
    blockers: ["Phases 002-006 must land before this phase's edits describe real, shipped capabilities."]
    key_files: [".opencode/agents/context.md", "AGENTS.md", "CLAUDE.md", "README.md", ".opencode/skills/README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Devin docs, agents, governance, and closeout
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown (agent rosters, governance docs) + TOML (`.codex/agents/*.toml`) |
| **Framework** | None -- prose/roster restoration, not application code |
| **Storage** | None |
| **Testing** | `validate.sh --recursive --strict`, `parent-skill-check.cjs`, `rg` grep verification (no unit-test framework; this phase is docs-only) |
### Overview
Restore `cli-devin` mentions in the 3 runtime agent rosters (4 agent files each) and the 3 governance/README surfaces, grounding every edit in a current-tree grep rather than the archived deprecation's line numbers. Close with the whole-packet recursive validation, hub conformance check, and the inverse `rg` proof.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [ ] Phases 002-006 confirmed landed (each phase's `implementation-summary.md` present and its own `validate.sh --strict` passing).
- [ ] Current-tree touch points re-confirmed via `ls`/`rg` immediately before editing (tree may have moved since spec-authoring time).
### Definition of Done
- [ ] All 12 agent-roster restoration points (3 runtimes x 4 agents) plus `AGENTS.md`, `CLAUDE.md`, `README.md`, `.opencode/skills/README.md` show restored `cli-devin` mentions.
- [ ] `ADVISOR_RUNTIME_VALUES` and `post-implementation-deep-review.md` show zero diff.
- [ ] `validate.sh --recursive --strict` and `parent-skill-check.cjs` both exit 0.
- [ ] Final inverse `rg` check returns nonzero hits.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Docs/governance restoration against a moved tree -- not a code architecture pattern. The "architecture" here is the touch-point map: 3 runtime agent directories (each mirroring the same 4 agent identities), 2 independently-twinned governance docs, 2 README catalogs, and 2 explicit regression-guard surfaces that must stay untouched.
### Key Components
- **Runtime agent rosters**: `.opencode/agents/`, `.claude/agents/`, `.codex/agents/` -- 3 parallel directories, each needing the same 4 files touched (`context`, `deep-research`, `deep-review`, `deep-improvement`).
- **Governance twin**: `AGENTS.md` + `CLAUDE.md` -- a verbatim twin pair, edited independently, never via symlink.
- **README catalogs**: root `README.md` (mode entry, mirrors the live `cli-codex` entry shape) + `.opencode/skills/README.md` (skill-catalog entry).
- **Regression guards**: `ADVISOR_RUNTIME_VALUES` (system-skill-advisor) and `post-implementation-deep-review.md` (system-spec-kit) -- explicitly left untouched, verified by empty diff.
- **Closeout validation**: `validate.sh --recursive --strict`, `parent-skill-check.cjs`, and the inverse `rg` proof.
### Data Flow
No runtime data flow. The "flow" is documentary: archived removal touch-list (input, read-only) -> current-tree grep (ground truth) -> restored prose in live files -> whole-packet validation (proof).
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.opencode/agents/*`, `.claude/agents/*`, `.codex/agents/*` | Runtime agent rosters (3 mirrored sets) | Restore `cli-devin` mention in 4 files per runtime | `rg -n "cli-devin"` per directory |
| `AGENTS.md`, `CLAUDE.md` | Root governance twin | Restore independently | Both show `git diff`; content parity reviewed |
| `README.md`, `.opencode/skills/README.md` | Top-level + skill catalogs | Restore mode/skill entry | `rg -n "cli-devin"` |
| `ADVISOR_RUNTIME_VALUES`, `runtime-parity.vitest.ts` | D5-excluded enum + its test | Unchanged | `git diff` empty |
| `post-implementation-deep-review.md` | D4 executor-agnostic rule | Unchanged | `git diff` empty |
| `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `remediation.vitest.ts` | Phase 002's executor tests | Cross-check only, no primary edit here | Manual review confirms no 4-member-union or absence assertion remains |
Required inventories:
- Same-class producers: `rg -n "cli-codex" AGENTS.md CLAUDE.md README.md .opencode/agents .claude/agents .codex/agents` as the structural precedent map for exactly where `cli-devin`'s equivalent restoration should land.
- Consumers of the restored fact "cli-devin exists": the 3 agent-roster sets, 2 governance docs, 2 README catalogs -- 8 independent consumer surfaces, all inventoried in the Files to Change table in `spec.md`.
- Matrix axes: {runtime (3) x agent-file (4)} = 12 roster restoration points, plus 4 standalone governance/README points = 16 total.
<!-- /ANCHOR:affected-surfaces -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
- [ ] Confirm phases 002-006 landed (review each `implementation-summary.md`).
- [ ] Re-run the current-tree grep/`ls` evidence from this spec to catch any drift since authoring time.
### Phase 2: Core Implementation
- [ ] Restore `cli-devin` in all 3 runtimes' `context`, `deep-research`, `deep-review`, `deep-improvement` agent files.
- [ ] Twin-edit `AGENTS.md` and `CLAUDE.md` independently.
- [ ] Restore `README.md` and `.opencode/skills/README.md` entries.
- [ ] Cross-reference phase 005's CI gate evidence (no duplicate edit).
### Phase 3: Verification
- [ ] Cross-check the 3 deep-loop executor test files assert presence, not absence.
- [ ] Confirm zero diff on the 2 regression-guard surfaces.
- [ ] Run `validate.sh --recursive --strict`, `parent-skill-check.cjs`, and the final inverse `rg` check.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|---|---|---|
| Grep verification | Restored `cli-devin` mentions present in the 16 target points | `rg -n` |
| Regression-guard verification | 2 excluded surfaces show zero diff | `git diff` |
| Whole-packet structural validation | All 7 phases + parent validate cleanly together | `validate.sh --recursive --strict` |
| Hub conformance | `cli-external-orchestration` hub stays canon-conformant | `parent-skill-check.cjs` |
| Inverse proof | Final state is the mirror image of the original deprecation's zero-hits proof | `rg -n "cli-devin" .opencode/agents .claude/agents .codex/agents AGENTS.md CLAUDE.md README.md` (expect nonzero) |
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phases 002-006 | Internal (this packet) | Planned (not yet built as of this authoring pass) | Restoring docs before capabilities exist would describe an unshipped system; this phase must wait |
| `validate.sh`, `parent-skill-check.cjs` | Internal (system-spec-kit, sk-doc tooling) | Green (confirmed present, used by prior phases in this and sibling packets) | Whole-packet closeout proof unavailable |
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: Any of the 16 restoration points lands against a drifted/incorrect path, or a regression-guard surface (`ADVISOR_RUNTIME_VALUES`, `post-implementation-deep-review.md`) is accidentally modified.
- **Procedure**: `git diff` the specific file, revert only that file's hunk (`git checkout -- <path>` for an unstaged change, or a targeted `git revert` if already committed), then re-verify against the current-tree grep before re-attempting the edit.
<!-- /ANCHOR:rollback -->
<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Phase 007 depends on phases 001-006 all having landed; it has no successor. Within this phase, Setup precedes Implementation, and Implementation precedes Verification -- the closeout validation in Verification is only meaningful after every restoration point in Implementation is in place.
<!-- /ANCHOR:phase-deps -->
<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup | Low | Re-verify current-tree grep, ~15 min |
| Core Implementation | Medium | 16 restoration points across 12 files, ~1-2 hours |
| Verification | Low-Medium | 3 validation commands + manual test-file review, ~30-45 min |
| **Total** | | **~2-3 hours** |
<!-- /ANCHOR:effort -->
<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
### Pre-deployment Checklist
- [ ] No data migration involved (docs-only phase).
- [ ] Current-tree grep re-run immediately before editing (tree may have moved since authoring).
### Rollback Procedure
1. Identify the specific file(s) whose restoration went wrong via `git diff`.
2. Revert only those files (`git checkout -- <path>` unstaged, or a targeted `git revert` post-commit).
3. Re-run the current-tree grep to re-confirm the correct insertion point.
4. Re-apply the restoration and re-run the affected verification command.
### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A -- plain file reverts as described above.
<!-- /ANCHOR:enhanced-rollback -->
