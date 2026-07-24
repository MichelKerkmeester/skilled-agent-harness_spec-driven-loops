---
title: "Feature Specification: Devin docs, agents, governance, and closeout"
description: "Restore cli-devin mentions across all 3 runtime agent rosters, twin-edit AGENTS.md/CLAUDE.md, restore README.md entries, and run whole-packet closeout validation against the CURRENT tree -- not the archived deprecation's drifted line numbers."
trigger_phrases: ["cli-devin revival closeout", "Devin agent roster restore", "Devin governance docs", "Devin docs and closeout"]
importance_tier: normal
contextType: general
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/007-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-24T06:50:25Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase 007 spec.md restoring Devin docs/agents/governance against the current tree"
    next_safe_action: "Wait for phases 002-006, then restore agent rosters and governance docs per spec.md"
    blockers: ["Phases 002-006 must land first -- this phase documents capabilities they build.", "devin auth login needs an interactive OAuth flow only the operator can complete (inherited)."]
    key_files: [".opencode/agents/context.md", "AGENTS.md", "CLAUDE.md", "README.md", ".opencode/skills/README.md", ".opencode/skills/system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts", ".opencode/skills/system-spec-kit/constitutional/post-implementation-deep-review.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Do the other 3 modes cross-reference each other as siblings in hand-authored prose, or is that registry-driven (phase 003's scope)?", "Archived line numbers are unknown by design; implementation must grep the current tree, not infer from this doc."]
    answered_questions: ["CONFIRMED via ls: all 3 runtimes have context.md/.toml (not deep-context), deep-research, deep-review, deep-improvement.", "CONFIRMED via rg: zero live cli-devin hits remain in agents dirs, AGENTS.md, CLAUDE.md, README.md.", "CONFIRMED: live cli-codex README.md entry is the structural precedent to mirror.", "CONFIRMED: ADVISOR_RUNTIME_VALUES is ['claude','copilot','opencode'], no devin -- matches D5 exclusion.", "CONFIRMED: post-implementation-deep-review.md names no hardcoded executor -- matches D4 wording."]
---
# Feature Specification: Devin docs, agents, governance, and closeout
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-23 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | `../006-devin-manual-testing-playbook/spec.md` |
| **Successor** | None (final phase) |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The 2026-06-08 deprecation (`z_archive/022-cli-devin-deprecation`) stripped `cli-devin`/`devin` mentions from all 3 runtime agent rosters, top-level governance docs (`AGENTS.md`, `CLAUDE.md`, `README.md`), and cross-skill sibling docs, and its own removal touch-list recorded the exact file paths and line numbers it edited. Those paths and line numbers have since drifted from three UNRELATED reorganizations that landed between 2026-06-08 and today: a repo-wide hyphen-case migration, the `deep-context.md` -> `context.md` agent rename, and directory moves (e.g. `sk-prompt-models` -> `sk-prompt/prompt-models`, `deep-loop-runtime` -> `system-deep-loop/runtime`). A mechanical replay of the archived diff would silently target files and names that no longer exist.
### Purpose
Restore every live agent-roster and governance-doc mention against the CURRENT tree, confirmed by direct grep and directory-listing evidence rather than archived paths, then run the whole-packet closeout validation that proves all 7 phases compose into one coherent restoration.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Restore `cli-devin` mentions in all 3 runtime agent rosters (`.opencode/agents/`, `.claude/agents/`, `.codex/agents/`) for the 4 confirmed-current agent files: `context.md`/`.toml`, `deep-research.md`/`.toml`, `deep-review.md`/`.toml`, `deep-improvement.md`/`.toml`.
- Twin-edit `AGENTS.md` and `CLAUDE.md` at the repo root independently -- both need the identical restored content, each edited as its own file, not derived from the other via symlink or script.
- Restore the `cli-devin` mode entry in root `README.md` and the skill-catalog entry in `.opencode/skills/README.md`.
- Cross-reference (not duplicate) phase 005's restoration of the `check-prompt-quality-card-sync.sh` CI gate.
- Run a final cross-check that the deep-loop executor tests (`executor-config.vitest.ts`, `executor-audit.vitest.ts`, `remediation.vitest.ts`) -- phase 002's primary responsibility -- no longer assert a 4-member executor union or `cli-devin`'s absence.
- Run the whole-packet recursive `--strict` validation, the `cli-external-orchestration` hub conformance check, and the final inverse `rg` verification (expecting nonzero `cli-devin` hits, the mirror image of the original deprecation's own zero-hits proof).
### Out of Scope
- Restoring the `'devin'` entry to `ADVISOR_RUNTIME_VALUES` (`system-skill-advisor`) -- this belongs to the deliberately-excluded D5 IDE-runtime-hooks surface (see the phase-parent spec's Open Question 2 and phase 004's own scope boundary). Left untouched unless the operator later asks for D5 to be revived.
- Restoring a prescriptive default review executor in `system-spec-kit/constitutional/post-implementation-deep-review.md` -- the 022 deprecation's decision D4 deliberately made this rule executor-agnostic ("operator picks the executor at dispatch time"). This phase must not silently reintroduce a hardcoded preference.
- Rewriting any of the ~1,760 historical files (`.opencode/specs/**`, `changelog/**`, benchmark state `*.jsonl`) the original deprecation's decision D1 deliberately left untouched. Those stay as an immutable audit trail; "fixing" old spec prose to read as if `cli-devin` was never removed would falsify a completed historical record.
- Editing `sk-prompt/prompt-models/references/context-budget.md`'s existing historical-attribution note ("Originally authored under cli-devin; re-homed here when cli-devin was deprecated...") -- it is already accurate and needs no change.
- Implementing phases 002-006 themselves; this phase only closes out docs/agents/governance once those phases' capabilities exist to document.
### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/agents/context.md`, `.claude/agents/context.md`, `.codex/agents/context.toml` | Modify | Restore `cli-devin` executor mention. Confirmed current filename is `context.md`/`.toml` (renamed from `deep-context.md` by unrelated work) -- do not target the old name. |
| `.opencode/agents/deep-research.md`, `.claude/agents/deep-research.md`, `.codex/agents/deep-research.toml` | Modify | Restore `cli-devin` executor mention. Filename unchanged since the archived removal. |
| `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml` | Modify | Restore `cli-devin` executor mention. Filename unchanged since the archived removal. |
| `.opencode/agents/deep-improvement.md`, `.claude/agents/deep-improvement.md`, `.codex/agents/deep-improvement.toml` | Modify | Restore `cli-devin` executor mention. Filename unchanged since the archived removal. |
| `AGENTS.md` (repo root) | Modify | Restore `cli-devin` mode/executor mention. Verbatim twin of `CLAUDE.md`, edited independently. |
| `CLAUDE.md` (repo root) | Modify | Restore `cli-devin` mode/executor mention. Verbatim twin of `AGENTS.md`, edited independently. |
| `README.md` (repo root) | Modify | Restore the `cli-devin` mode entry, mirroring the live `cli-codex` entry (confirmed at `README.md` ~line 922-925). |
| `.opencode/skills/README.md` | Modify | Restore the `cli-devin` skill-catalog entry. |
| `system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `executor-audit.vitest.ts`, `system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Verify only (no primary edit) | Final cross-check that none of these still assert a 4-member executor union or `cli-devin`'s absence; primary restoration is phase 002's responsibility. |
| `system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts`, `system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts` | No change (regression guard) | `'devin'` stays absent from `ADVISOR_RUNTIME_VALUES` -- explicit D5 scope exclusion, confirmed live as `['claude', 'copilot', 'opencode']`. |
| `system-spec-kit/constitutional/post-implementation-deep-review.md` | No change (regression guard) | Stays executor-agnostic per decision D4; confirmed current wording names no hardcoded executor preference. |
| `system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` | Cross-reference only | Already restored by phase 005; this phase verifies and cites, does not duplicate. |
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Restore `cli-devin` mentions across all 3 runtime agent rosters using CURRENT filenames | `rg -n "cli-devin" .opencode/agents .claude/agents .codex/agents` shows hits in `context.md`/`.toml`, `deep-research.md`/`.toml`, `deep-review.md`/`.toml`, `deep-improvement.md`/`.toml` across all 3 directories; zero hits reference `deep-context.md`. |
| REQ-002 | Twin-edit `AGENTS.md` and `CLAUDE.md` independently | Both files contain matching restored content; `git status` shows both changed as independent files, not a symlink or generated copy. |
| REQ-003 | Restore `README.md` and `.opencode/skills/README.md` mentions | `rg -n "cli-devin" README.md .opencode/skills/README.md` returns nonzero hits. |
| REQ-004 | Cross-check deep-loop executor tests assert PRESENCE, not absence | Manual review of `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `remediation.vitest.ts` confirms no assertion of a 4-member executor union or `cli-devin`'s absence; this is a final check on phase 002's work, not new test authorship. |
| REQ-005 | Leave `ADVISOR_RUNTIME_VALUES` and `post-implementation-deep-review.md` untouched | `git diff` shows zero changes to `advisor-runtime-values.ts`, `runtime-parity.vitest.ts`, and `post-implementation-deep-review.md`. |
| REQ-008 | Full recursive `--strict` validation passes across the whole 7-phase packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/029-cli-devin-revival --recursive --strict` exits 0. |
| REQ-009 | Hub conformance check passes | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` exits 0. |
| REQ-010 | Final inverse verification shows nonzero `cli-devin` hits | `rg -n "cli-devin" .opencode/agents .claude/agents .codex/agents AGENTS.md CLAUDE.md README.md` returns nonzero matches -- the inverse of the original deprecation's own zero-hits verification. |
### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-006 | Leave historical spec/changelog/benchmark content untouched | `git diff --stat` shows zero changes under `.opencode/specs/**` (outside this packet's own phases), `changelog/**`, and benchmark state `*.jsonl` files. |
| REQ-007 | Cross-reference, not duplicate, phase 005's CI gate restoration | This phase's `tasks.md`/`checklist.md` cite phase 005's evidence for `check-prompt-quality-card-sync.sh` rather than re-editing it. |
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: All 3 runtime agent rosters plus `AGENTS.md`, `CLAUDE.md`, `README.md`, and `.opencode/skills/README.md` show restored `cli-devin` mentions, verified by `rg`.
- **SC-002**: Zero regressions to the 2 explicit non-restoration surfaces (`ADVISOR_RUNTIME_VALUES`, `post-implementation-deep-review.md`), verified by empty `git diff` on both.
- **SC-003**: Zero drift to historical spec/changelog/benchmark content, verified by empty `git diff --stat` on those paths.
- **SC-004**: Whole-packet recursive `--strict` validation and the hub conformance check both pass.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Phases 002-006 land first | Restoring docs before the capabilities exist would describe a system that isn't there yet | Sequence this phase last; confirm each predecessor's `implementation-summary.md` before editing |
| Risk | Replaying archived line numbers verbatim | Edits land on the wrong lines or files after 3 unrelated reorganizations | Grep the CURRENT tree for every insertion point; never copy a line number from the archived deprecation diff |
| Risk | Silently reverting the D4/D5 regression guards | Re-couples the excluded IDE-hooks surface or reintroduces a prescriptive executor, both against explicit operator scope decisions | Explicit checklist items forbidding edits to those 2 surfaces; diff review scoped to the Files to Change table before commit |
| Risk | Historical record falsification | Editing old spec prose to read as if `cli-devin` was never removed destroys an accurate audit trail | D1-preservation constraint; scope every edit to only the files in this phase's Files to Change table |
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
### Reliability
- **NFR-R01**: The whole-packet validation gate (`validate.sh --recursive --strict`) is deterministic -- re-running it against an unchanged tree produces the same Errors/Warnings count.
### Security
- **NFR-S01**: No secrets, tokens, or credentials are introduced in any restored doc or agent file; this phase touches prose and roster entries only.
## 8. EDGE CASES
### Data Boundaries
- An agent file exists in one runtime's directory but not the other two: not expected per this session's confirmed live listing (all 3 runtimes carry all 4 target files), but implementation must re-verify with `ls` immediately before editing, since these are Planned phases and the tree can move before execution.
### Error Scenarios
- `AGENTS.md` and `CLAUDE.md` drift after independent edits: verify content parity (not byte-parity, since the two files serve different runtime audiences) by diffing the restored sections side by side, not just confirming both files changed.
- The final inverse `rg` check (REQ-010) is intentionally scoped to only `.opencode/agents .claude/agents .codex/agents AGENTS.md CLAUDE.md README.md` -- it must not be run unscoped against the whole repo, which would also match the ~1,760 historical files this phase must leave untouched and produce a misleading signal.
## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 12/25 | Docs-only: 12 agent-roster files (3 runtimes x 4 agents) + 2 governance docs + 2 README entries + 3 test-file cross-checks + 2 regression-guard confirmations. |
| Risk | 14/25 | Low functional risk (no runtime code changes) but real correctness-of-restoration risk: drifted paths, and 2 surfaces that must NOT change even though they look similar to what's being restored elsewhere. |
| Research | 4/20 | Already completed this session via live `ls` and `rg` evidence; implementation re-verifies rather than re-discovers. |
| **Total** | **30/70** | **Level 2** |
## 10. RISK MATRIX
| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | Restoring against a drifted/archived path instead of the current one | Med | Med | Grep the current tree before every edit; the Files to Change table above already confirms current filenames |
| R-002 | Silent reversion of the D4 (executor-agnostic) or D5 (IDE-hooks excluded) regression guards | High | Low | CHK items in `checklist.md` require an empty diff on both guarded files; reviewed before commit |
| R-003 | Historical record falsification via edits to archived spec/changelog content | High | Low | Scope discipline: only touch files in this phase's Files to Change table |
## 11. USER STORIES
### US-001: Restored agent rosters (Priority: P0)
**As an** operator resuming `cli-devin` work after this packet ships, **I want** all 3 runtime agent rosters to mention `cli-devin` under their current filenames, **so that** the agent I dispatch actually reflects an available executor rather than a stale reference to a renamed or removed file.
**Acceptance Criteria**:
1. Given the 3 runtime agent directories, When I grep for `cli-devin`, Then I find it in `context`, `deep-research`, `deep-review`, and `deep-improvement` agent files in all 3 runtimes.
### US-002: Independently twin-edited governance docs (Priority: P0)
**As a** governance reviewer, **I want** `AGENTS.md` and `CLAUDE.md` each independently edited to mention `cli-devin`, **so that** neither document silently diverges from the other or gets skipped under the assumption that editing one is sufficient.
**Acceptance Criteria**:
1. Given both files before this phase, When the restoration completes, Then both `AGENTS.md` and `CLAUDE.md` show a `git diff` for the `cli-devin` mention, not just one of the two.
## 12. OPEN QUESTIONS
- Do the other 3 `cli-external-orchestration` modes' `SKILL.md` files cross-reference each other as siblings in hand-authored prose, or is that relationship entirely registry-driven (`mode-registry.json`/`hub-router.json`)? If hand-authored, this phase's restoration should also add `cli-devin` as a 4th sibling cross-reference; if registry-driven, that is phase 003's registration responsibility, not this phase's. Recommend verifying at implementation time.
- Exact archived line numbers for the original 022 deprecation's edits are unknown at spec-authoring time by design (see Problem Statement); implementation must grep the current tree for insertion points rather than infer them from this document. Any line number written elsewhere in this packet is marked "TBD -- verify against the live file at implementation time."
<!-- /ANCHOR:questions -->
## RELATED DOCUMENTS
- `../spec.md` (phase-parent packet spec)
- `../006-devin-manual-testing-playbook/spec.md` (predecessor phase)
- `../008-devin-hook-parity/spec.md` (sequential-numbering neighbor only, not a dependency - its real predecessor is `004-devin-hook-adapter-layer`; see Phase Transition Rules in `../spec.md`)
- `../z_archive/022-cli-devin-deprecation/spec.md` and `context/context-report.md` (the archived removal this phase restores against -- as an INPUT for what to restore, not a verbatim replay of its paths/line numbers)
- `../../027-cli-codex-revival/006-docs-and-closeout/spec.md` (structural precedent for a revival packet's closeout phase)
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` (cross-referenced, owned by phase 005, not duplicated here)
