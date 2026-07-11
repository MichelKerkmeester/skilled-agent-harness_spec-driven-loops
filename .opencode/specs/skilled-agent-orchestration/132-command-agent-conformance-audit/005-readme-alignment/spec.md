---
title: "Feature Specification: Phase 5: Align Repo READMEs With Current Reality"
description: "The repo's authored READMEs still enumerate a pre-hub, flat-skill world: the install-guide 'Current Skills' catalog lists retired versions and omits every parent hub, and several component READMEs frame hub-owned modes as flat siblings. After phases 002-004 correct the command / agent / skill surface, these stale enumerations silently misdirect readers and advertise paths and names that no longer exist on disk."
trigger_phrases:
  - "readme alignment"
  - "stale skill catalog readme"
  - "install guide current skills"
  - "repo readme reality sync"
  - "005-readme-alignment"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/005-readme-alignment"
    last_updated_at: "2026-07-11T08:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Fixed 11 READMEs, swept 58 in-scope files, 0 retired-name regressions"
    next_safe_action: "006 closeout: roll up parent, refresh changelog entry for phase 005"
    blockers: []
    key_files:
      - ".opencode/install_guides/README.md"
      - ".opencode/skills/mcp-code-mode/README.md"
      - ".opencode/bin/README.md"
      - ".opencode/agents/README.txt"
      - ".claude/agents/README.txt"
      - ".opencode/commands/README.txt"
      - ".opencode/commands/create/README.txt"
      - ".opencode/commands/speckit/README.txt"
      - ".opencode/skills/sk-doc/README.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Full ~370-README universe swept or changed-surface only? Changed-surface set fixed first, then a bounded 58-file broader sweep; ~321 deep dev-note READMEs pattern-grepped clean but not individually read."
      - ".codex/agents/ (.toml) sibling removed from both agent READMEs per phase 004's operator-confirmed REMOVE decision (AGT-05)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: Align Repo READMEs With Current Reality

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-remediation-agents |
| **Successor** | 006-validation-closeout |
| **Handoff Criteria** | Every in-scope README's skill/command/agent enumeration matches the on-disk tree; a grep for retired names (cli-codex, cli-gemini, cli-devin, mcp-magicpath) and stale flat-skill paths across the in-scope set returns nothing; the confirmed-stale changed-surface READMEs are fixed first. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Command, agent, and asset conformance audit against current skill reality specification.

**Scope Boundary**: Authored repo READMEs that describe command / agent / skill reality. This phase edits documentation prose only — it does not touch SKILL.md logic, command YAML, agent bodies, or scripts (those are owned by phases 002-004). The changed-surface set (READMEs whose enumerations moved when phases 002-004 landed) is fixed first; the broader authored README universe (~370 files, vendored/build/worktree/specs excluded) is swept as time permits.

**Dependencies**:
- Phases 002 (slash commands), 003 (doctor), and 004 (agents) must land first — a README cannot be aligned to a surface that is still being corrected. The `.codex/agents/ (.toml)` claim in the agent READMEs is coordinated with phase 004's decision on whether that runtime directory should exist.
- The 001 deep-research synthesis (`../001-conformance-deep-research/research.md`) supplies the ranked drift inventory this phase draws its full README target list from.

**Deliverables**:
- The confirmed-stale changed-surface READMEs corrected (install-guide catalog, mcp-code-mode transport table, bin naming, agent README .codex claim).
- The parent-hub + skills-index + mode-packet + command-index README enumerations reconciled to the on-disk tree.
- A clean grep result: no retired skill/command names and no stale flat-skill paths survive in the in-scope README set.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill layer moved from flat standalone skills to parent hubs that own former skills as modes, and several command/skill names were retired. The repo's authored READMEs still encode the old world in their enumerations. Confirmed: `.opencode/install_guides/README.md` (the 'Current Skills' catalog at ~line 884) lists pre-hub flat skills with retired pinned versions (`system-spec-kit v2.2.26.0`, `mcp-code-mode v1.0.7.0`, `mcp-chrome-devtools v1.0.7.0`) and omits every parent hub (cli-external, mcp-tooling, sk-design, system-deep-loop, system-code-graph, system-skill-advisor) plus the sibling modes (mcp-click-up, mcp-figma). Additional drift lives in `mcp-code-mode/README.md`'s transport-consumers table, `bin/README.md`'s inconsistent `system-speckit` vs `system-spec-kit` naming, and the agent READMEs' `.codex/agents/ (.toml)` claim that points at an absent directory. These stale enumerations silently misdirect anyone reading the docs to install, discover, or route.

### Purpose
Bring every in-scope authored README into agreement with the corrected command / agent / skill reality so that each skill/command/agent enumeration resolves to something that exists on disk, with the confirmed-stale changed-surface set fixed first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Top-level `README.md` (skill-hub topology, command families, agent roster — recon says mostly current; verify and patch any drift).
- The 13 skills parent-hub + skills-index READMEs under `.opencode/skills/**/README.md` (skills-index plus each hub: cli-external, mcp-tooling, mcp-code-mode, sk-code, sk-design, sk-doc, sk-git, sk-prompt, system-code-graph, system-deep-loop, system-skill-advisor, system-spec-kit).
- The mode-packet READMEs (~32) nested under the parent hubs.
- The `.opencode/commands` index READMEs (4): `README.txt`, `memory/README.txt`, `speckit/README.txt`, `create/README.txt` (plus `create/readme.md`).
- `.opencode/agents/README.txt` + `.claude/agents/README.txt` deep-* one-liners and the `.codex/agents/ (.toml)` sibling claim.
- `.opencode/{hooks,plugins,bin,scripts,install_guides}` READMEs.

### Out of Scope
- Vendored trees (`node_modules`, `mcp-servers/*/node_modules`, Turso upstream) - not authored by this repo.
- `.worktrees`, `dist`/build, `.venv`, `__pycache__` - generated or ephemeral.
- `.opencode/specs/**` spec-doc READMEs and `z_archive` - spec continuity / archived, not surface docs.
- SKILL.md logic, command YAML, agent bodies, and scripts - owned by phases 002-004, not this doc-only phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/install_guides/README.md:884-896 | Modify | Rewrite the 'Current Skills' catalog: drop retired pinned versions (`mcp-code-mode v1.0.7.0`, `system-spec-kit v2.2.26.0`, `mcp-chrome-devtools v1.0.7.0`), add the missing parent hubs (sk-design, system-code-graph, system-deep-loop, system-skill-advisor) and sibling modes (mcp-click-up, mcp-figma), reflect hub-owns-mode topology. CONFIRMED stale (verified: table at line 884-895 lists 9 flat entries, omits 4 hubs + 2 modes). |
| .opencode/skills/mcp-code-mode/README.md:138-141 | Modify | Reframe the Related-Skills table (header 138, `mcp-chrome-devtools` row 140, `mcp-click-up` row 141) under the mcp-tooling hub and add a `mcp-figma` row. CONFIRMED: table has 2 rows, missing mcp-figma. |
| .opencode/bin/README.md:168 | Modify | Normalize the mixed `system-speckit` (1 hit, line 168, in the `system-speckit/030-validate-sh-dist-freshness-and-repo-remediation/...` spec-folder path reference) vs `system-spec-kit` (6 hits: lines 23, 26, 166, 168, 172, 210) naming to the single canonical `system-spec-kit` form. CONFIRMED via grep. |
| .opencode/agents/README.txt:8 | Modify | `Sibling runtimes: .claude/agents/ (.md) and .codex/agents/ (.toml)` — `.codex/agents/` is CONFIRMED absent (`ls .codex/agents` -> No such file or directory). Reconcile wording with phase 004's AGT-05 directory decision (generate the mirror or drop the claim). |
| .claude/agents/README.txt:8 | Modify | `Sibling runtimes: .opencode/agents/ (.md) and .codex/agents/ (.toml)` — same confirmed-absent `.codex/agents` claim; mirror the `.opencode/agents/README.txt` fix for cross-runtime parity. |
| .opencode/commands/create/assets/create_readme_auto.yaml:37 | Modify | CMD-09: comment reads "The setup phase in folder_readme.md determines which operation" — `folder_readme.md` does not exist; replace with `.opencode/commands/create/readme.md` (the live router). |
| .opencode/commands/create/assets/create_readme_confirm.yaml:9,40 | Modify | CMD-09: same dead `folder_readme.md` reference in two comment lines (routing note line 9, operation-routing comment line 40); replace both with `.opencode/commands/create/readme.md`. |
| .opencode/commands/create/assets/create_readme_presentation.txt:19,138 | Modify | CMD-09: rename the copy-pasted `create_agent_verified` field (belongs to `/create:agent`'s own Phase-0 self-check, not README verification) to `create_readme_verified` at the assignment (line 19) and the setup-dashboard table row (line 138). |
| .opencode/commands/create/assets/create_readme_auto.yaml:148 | Modify | CMD-09: rename the `create_agent_verified` checklist bullet to `create_readme_verified`. |
| .opencode/commands/create/assets/create_readme_confirm.yaml:133 | Modify | CMD-09: rename the `create_agent_verified` checklist bullet to `create_readme_verified`. |
| README.md (top-level) | Verify / Modify | Recon: hub topology, command families, and agent roster already reflect the current 13-hub structure (grep for retired names `cli-codex\|cli-gemini\|cli-devin\|mcp-magicpath` across in-scope READMEs returns 0 hits). No confirmed defect; re-verify after 002-004 land and patch any residual drift. |
| .opencode/skills/README.md + 12 hub READMEs | Verify / Modify | Reconcile the skills-index and each parent-hub README enumeration against the on-disk mode tree (cli-external, mcp-tooling, mcp-code-mode, sk-code, sk-design, sk-doc, sk-git, sk-prompt, system-code-graph, system-deep-loop, system-skill-advisor, system-spec-kit). Not yet individually verified line-by-line; scoped discovery task enumerates drift. |
| .opencode/commands/{README.txt, memory/README.txt, speckit/README.txt, create/README.txt} | Verify / Modify | Reconcile command-family enumerations with the post-002/003 command surface; remove any dead command ids. Not yet individually verified; scoped discovery task enumerates drift. |
| mode-packet READMEs (~32 under the parent hubs, of ~152 total README.md files at skills depth 3-4) | Verify / Modify | Swept as time permits after the confirmed-stale set above; fix any stale flat-skill path or retired name found by the discovery task. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rewrite the install-guide 'Current Skills' catalog to current reality. | `.opencode/install_guides/README.md` catalog lists all parent hubs (cli-external, mcp-tooling, sk-design, system-deep-loop, system-code-graph, system-skill-advisor) and sibling modes (mcp-click-up, mcp-figma), carries no retired pinned versions, and no longer frames hub-owned modes as flat top-level skills. |
| REQ-002 | No retired name or stale flat-skill path survives in the in-scope README set. | `grep -rn -E "cli-codex\|cli-gemini\|cli-devin\|mcp-magicpath" <in-scope READMEs>` returns nothing; no dead command id or pre-hub flat path remains. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Reframe the mcp-code-mode transport-consumers table and normalize bin naming. | `mcp-code-mode/README.md` presents mcp-chrome-devtools / mcp-click-up under the mcp-tooling hub and includes mcp-figma; `.opencode/bin/README.md` uses one canonical spelling (0 residual `system-speckit`-vs-`system-spec-kit` split). |
| REQ-004 | Reconcile the agent README indices and the changed-surface hub/command READMEs. | Both agent README.txt files describe current deep-* backing and their `.codex/agents/ (.toml)` claim matches phase 004's directory decision; each in-scope hub, skills-index, and command-index README enumeration matches the on-disk tree. |
| REQ-005 | Fix CMD-09: dead `folder_readme.md` router reference and copy-pasted `create_agent_verified` field in the `/create:readme` workflow assets. | `grep -rn "folder_readme.md" .opencode/commands/create/assets/create_readme_auto.yaml .opencode/commands/create/assets/create_readme_confirm.yaml` returns 0 hits; `grep -rln "create_agent_verified" .opencode/commands/create/assets/create_readme_auto.yaml .opencode/commands/create/assets/create_readme_confirm.yaml .opencode/commands/create/assets/create_readme_presentation.txt` returns 0 hits (field renamed to `create_readme_verified` consistently). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The five confirmed-stale changed-surface targets (install_guides, mcp-code-mode, bin, both agent README.txt files, the CMD-09 readme-workflow assets) are corrected, and `grep -rEn "cli-codex|cli-gemini|cli-devin|mcp-magicpath" <in-scope READMEs>` returns zero hits (already zero as of this authoring pass; re-verify after edits).
- **SC-002**: Every in-scope README's skill/command/agent enumeration matches the on-disk tree (13 hub/index READMEs + 4 command-index READMEs + both agent READMEs verified; ~32 mode-packet READMEs swept as time permits, with any remaining deferrals recorded).
- **SC-003**: CMD-09 closed — `grep -rn "folder_readme.md"` over the 2 readme-workflow YAMLs returns 0, and no `create_agent_verified` string remains in the 3 readme-workflow asset files (renamed to `create_readme_verified`).
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002-004 must land first | Aligning a README to a surface still being corrected produces churn or wrong text | Gate this phase on the 002-004 handoffs; draw the target list from the 001 synthesis and the corrected surface, not from memory |
| Dependency | `.codex/agents/` directory decision (phase 004) | The agent READMEs' `.codex/agents/ (.toml)` claim points at an absent dir; fixing it wrong contradicts phase 004 | Coordinate the wording with phase 004's decision before editing either agent README |
| Risk | ~370-file authored README universe | Time overrun / scope creep if the full sweep is attempted before the changed-surface set | Fix the confirmed-stale changed-surface set first; sweep the rest as time permits and record any deferrals |
| Risk | Scope drift into SKILL.md / command YAML / agent bodies | Doc-only phase silently mutates logic owned by other phases | Hard scope lock: edit README prose only; route any logic drift back to the owning phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED: the changed-surface set was fixed first, then a bounded 58-file broader sweep (13 hub/index + 31 mode-packet + 5 command-index + 1 top-level + 2 agent + 6 misc-root) was individually read or grep-swept; the remaining ~321 deep per-dir dev-note READMEs were pattern-grepped clean (0 retired-name hits) but not individually read line-by-line — see `implementation-summary.md` Known Limitations.
- RESOLVED: phase 004 confirmed the operator decision was REMOVE (not restore); the `.codex/agents/ (.toml)` sibling was removed from both agent README.txt files.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
