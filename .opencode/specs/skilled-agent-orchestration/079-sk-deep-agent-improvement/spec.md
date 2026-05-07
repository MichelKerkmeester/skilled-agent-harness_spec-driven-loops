---
title: "Feature Specification: Rename sk-improve-agent → deep-agent-improvement"
description: "Symbolic-only rename of the sk-improve-agent skill to deep-agent-improvement to align with the modern deep-* family naming convention. Folder rename plus full propagation across skill internals, advisor scoring tables, four runtime mirror surfaces, root docs, and install guides — without changing the @improve-agent agent or /improve:agent command."
trigger_phrases:
  - "rename sk-improve-agent"
  - "deep-agent-improvement"
  - "skill rename"
  - "skill folder rename"
  - "deep prefix migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/079-sk-deep-agent-improvement"
    last_updated_at: "2026-05-06T08:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "spec.md authored"
    next_safe_action: "validate"
    blockers: []
    key_files:
      - ".opencode/skills/sk-improve-agent/SKILL.md"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/commands/improve/assets/improve_improve-agent_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000079"
      session_id: "079-spec-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Should the @improve-agent agent or /improve:agent command be renamed too? (No — per 070-sk-deep-rename precedent, agent and command names already use modern convention without sk- prefix and stay independent of skill folder name.)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Rename `sk-improve-agent` → `deep-agent-improvement`

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-06 |
| **Branch** | `main` (per user directive — stay on main) |
| **Precedent** | `specs/skilled-agent-orchestration/070-sk-deep-rename/` |
| **Implementation executor** | `cli-copilot` with `gpt-5.5` reasoning level **high** (max 3 concurrent dispatches per Copilot API throttle) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The skill folder `.opencode/skills/sk-improve-agent/` is named with the legacy `sk-` prefix that has been deprecated for autonomous-loop skills. Sister skills `sk-deep-review` and `sk-deep-research` were renamed to `deep-review` / `deep-research` in packet 070-sk-deep-rename (2026-05-01/02), establishing the convention that skills carrying autonomous iteration/evaluation loops adopt a `deep-*` semantic prefix. `sk-improve-agent` is the third skill in this family — it runs an evaluator-first improvement loop with packet-local candidates, deterministic scoring, and promotion gates — but its name is still inconsistent with the modern convention. The mismatch causes two practical problems: (a) skill-advisor trigger phrases and graph relationships are awkwardly bifurcated between `sk-` and non-`sk-` family signals, and (b) discoverability suffers because users searching for "deep agent improvement" do not naturally find a skill called `sk-improve-agent`.

### Purpose

Rename `.opencode/skills/sk-improve-agent/` to `.opencode/skills/deep-agent-improvement/` and propagate the change through every active code reference site so the deep-* family becomes visually and semantically consistent (deep-review, deep-research, deep-agent-improvement) without altering any behavior, API, or agent/command surface. Success looks like a single `git mv` plus a clean residual-grep showing zero `sk-improve-agent` hits in active code paths (skill internals, advisor, runtimes, root docs), with the `/improve:agent` command and `@improve-agent` agent dispatching unchanged through the new skill path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

1. **Skill folder rename** — `git mv .opencode/skills/sk-improve-agent .opencode/skills/deep-agent-improvement`.
2. **Symlink rename + retarget** — `.opencode/changelog/sk-improve-agent` → `.opencode/changelog/deep-agent-improvement` pointing at the new skill's `changelog/` directory.
3. **In-skill reference updates** — `SKILL.md`, `README.md`, `graph-metadata.json`, `scripts/`, `assets/`, `changelog/`, `feature_catalog/`, `manual_testing_playbook/`, `references/`, `test-fixtures/`. Updates skill_id, frontmatter `name`, trigger phrases, all path strings (`.opencode/skills/sk-improve-agent/...` → `.opencode/skills/deep-agent-improvement/...`), and entity definitions.
4. **System-spec-kit advisor surface** — `skill_advisor.py` (156 phrase entries in TOKEN_BOOSTS / PHRASE_BOOSTS), `skill-graph.json` (registry, dependency edges, trigger phrases), `graph-metadata.json` (sibling target), `fusion.ts:270` (penalty list), test fixtures (`native-scorer.vitest.ts`, `remediation-008-docs.vitest.ts`), compiled `dist/` mirrors (rebuilt via `npm run build`), and SQLite cache (`skill-graph.sqlite` rebuilt via `advisor_rebuild`).
5. **Cross-skill metadata** — `sk-improve-prompt/graph-metadata.json:32` sibling target; `.opencode/skills/README.md` skill index (3 refs); `system-spec-kit/changelog/v3.3.0.0.md`/`v3.4.0.0.md` path strings only (historical narrative untouched).
6. **Command surfaces in all four runtimes** — `agent.md` body refs, `README.txt` skill matrix, `improve_improve-agent_auto.yaml` (32 path templates), `improve_improve-agent_confirm.yaml` (33 path templates) in `.opencode/`, `.claude/`, `.gemini/`, `.codex/` runtime command directories.
7. **Agent definitions in all four runtimes** — `improve-agent.md`/`.toml` skill-matrix line in `.opencode/agents/`, `.claude/agents/`, `.gemini/agents/`, `.codex/agents/`. **Agent name `improve-agent` itself is NOT renamed.**
8. **Root docs + install guides** — `README.md` (lines 848, 1220), `AGENTS.md` (line 324), `CLAUDE.md` (line 324), `.opencode/install_guides/README.md` (2 refs), `.opencode/install_guides/SET-UP - AGENTS.md` (1 ref).
9. **New changelog entry** — `v1.3.0.0.md` (or next-up version) inside the renamed skill's `changelog/` documenting the rename, migration notes, and reverse-mapping pointers.
10. **Verification battery** — strict spec validation, residual-grep, advisor reindex + recommendation smoke test, `/improve:agent` dispatch smoke test on a sandbox agent, vitest suite, implementation-summary, /memory:save.

### Out of Scope

- **Agent rename.** The `@improve-agent` agent name stays stable. Per 070-sk-deep-rename precedent (where `@deep-research` and `@deep-review` were unchanged through the skill rename), agent names live in their own naming family without the `sk-` prefix and are independent of skill folder names.
- **Command rename.** `/improve:agent` stays stable — the command family name `improve` and sub-name `agent` follow command naming conventions, not skill naming.
- **YAML asset filename rename.** `improve_improve-agent_auto.yaml` and `improve_improve-agent_confirm.yaml` keep their filenames — these are command-scoped (named after the command target, not the skill).
- **Behavioral / API changes.** No script behavior, scoring algorithm, or workflow logic changes. Symbolic rename only.
- **Historical record edits.** Past changelog entries in the skill's own `changelog/v1.0.0.0.md..v1.2.2.0.md` and the system-spec-kit changelog `v3.3.0.0.md`/`v3.4.0.0.md` keep their narrative prose ("v1.0.0.0 created sk-improve-agent…") untouched. Only path strings inside those documents are updated since those paths must resolve after the folder rename. New `v1.3.0.0.md` entry documents the rename forward.
- **Spec-folder research artifacts under `specs/`.** Packets 059-agent-implement-code, 060-sk-agent-improver-test-report-alignment, 070-sk-deep-rename and others contain historical references to `sk-improve-agent` (~24,127 hits). These are research record and stay verbatim.
- **`AGENTS_Barter.md`** — symlink to a separate Barter repo. Update only if it carries an active local reference; the Barter repo handles its own propagation.

### Files to Change

See `resource-map.md` for the exhaustive file-by-file inventory with line numbers and reference counts. High-level summary:

| Category | File Count | Reference Count | Risk |
|---|---|---|---|
| Skill internals (renamed folder) | 60 | ~393 | Medium — internal cohesion |
| System-spec-kit advisor (CRITICAL) | 9 | ~173 | High — load-bearing scoring + tests |
| Cross-skill metadata | 3 | 5 | Low |
| Runtime command surfaces (4 runtimes) | 14 | ~150 | High — YAML asset path templates |
| Runtime agent definitions (4 runtimes) | 4 | 4 | Low |
| Root docs + install guides | 5 | 9 | Low |
| Symlink (rename + retarget) | 1 | 1 | Low |
| **Total active-code surface** | **~96 files** | **~735 refs** | |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill folder physically renamed via `git mv` | `ls .opencode/skills/deep-agent-improvement/` succeeds; `ls .opencode/skills/sk-improve-agent/` fails (ENOENT) |
| REQ-002 | All `skill_id` and frontmatter `name` fields reflect new name | `grep -n '^name:' .opencode/skills/deep-agent-improvement/SKILL.md` returns `name: deep-agent-improvement`; ditto for `skill_id` in `graph-metadata.json` |
| REQ-003 | Skill advisor scoring tables fully migrated | `grep -c 'sk-improve-agent' .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` returns 0; `advisor_recommend({prompt: "improve agent loop"})` returns `deep-agent-improvement` as top hit with score parity to prior baseline |
| REQ-004 | Skill-graph SQLite cache rebuilt | `advisor_rebuild` MCP call succeeds; `advisor_status` reports current build timestamp |
| REQ-005 | Compiled `dist/` mirrors regenerated | `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` succeeds; `grep 'sk-improve-agent' dist/skill_advisor/lib/scorer/fusion.js` returns 0 hits |
| REQ-006 | All four runtime command surfaces updated | Each of `.opencode/`, `.claude/`, `.gemini/`, `.codex/` `commands/improve/` directories shows zero `sk-improve-agent` hits in active YAML/MD files |
| REQ-007 | `/improve:agent` dispatches successfully through new skill path | Smoke test on sandbox agent (e.g., `cp-improve-target.md`) completes one auto-mode iteration without broken-path errors; YAML asset templates resolve, scripts execute |
| REQ-008 | Symlink renamed and retargeted | `readlink .opencode/changelog/deep-agent-improvement` resolves to `../skill/deep-agent-improvement/changelog`; old symlink absent |
| REQ-009 | Strict spec validation passes | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/079-sk-deep-agent-improvement --strict` exits 0 |
| REQ-010 | Vitest suite passes | `cd .opencode/skills/system-spec-kit/mcp_server && npm test` passes — particularly `native-scorer.vitest.ts` and `remediation-008-docs.vitest.ts` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | New changelog entry authored | `.opencode/skills/deep-agent-improvement/changelog/v1.3.0.0.md` (or next-up version) exists, documents the rename, references precedent (070), and lists migration notes |
| REQ-012 | Root docs (README.md, AGENTS.md, CLAUDE.md) updated | `grep -n 'sk-improve-agent' README.md AGENTS.md CLAUDE.md` returns 0 hits |
| REQ-013 | Install guides updated | `.opencode/install_guides/README.md` and `SET-UP - AGENTS.md` have zero `sk-improve-agent` hits |
| REQ-014 | Implementation summary authored with verification evidence | `implementation-summary.md` at the 079 root cites verification command outputs, REQ IDs satisfied, and links to the new changelog entry |
| REQ-015 | Continuity saved to canonical surface | `/memory:save` executed → `_memory.continuity` block in `implementation-summary.md` reflects completed state; `description.json` and `graph-metadata.json` regenerated |
| REQ-016 | Branch hygiene confirmed | Working state at end is on `main`; no surviving auto-created packet branch; any orphan continuity commits cherry-picked to main |

### P2 - Optional (defer with reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-017 | Optional: rename internal-historical narrative in skill's own changelog | All `v1.0.0.0..v1.2.2.0` entries within the renamed skill's `changelog/` reference "deep-agent-improvement" prospectively. **Default: deferred** — historical accuracy preferred. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -rn 'sk-improve-agent' --include='*.md' --include='*.json' --include='*.toml' --include='*.ts' --include='*.js' --include='*.py' --include='*.yaml' --include='*.yml' --include='*.sh' .opencode/ .claude/ .gemini/ .codex/ README.md AGENTS.md CLAUDE.md | grep -v 'specs/' | grep -v 'changelog/v1\.[0-2]\.' | grep -v 'system-spec-kit/changelog/v3\.[34]\.' | wc -l` returns **0**.
- **SC-002**: Skill advisor returns `deep-agent-improvement` as top recommendation for the prompt phrase "improve agent" with confidence ≥ 0.85 (parity with pre-rename baseline).
- **SC-003**: `/improve:agent <sandbox-agent-path> :auto` smoke dispatch completes one iteration: integration scan runs, profile generates, candidate scores produce, journal writes — all from new skill paths with zero errors.
- **SC-004**: `validate.sh ... --strict` exits 0; `npm test` in mcp_server passes.
- **SC-005**: Sister-skill consistency: `ls .opencode/skills/ | grep -E '^(deep-research|deep-review|deep-agent-improvement)$'` shows all three present, demonstrating naming family completion.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `skill_advisor.py` 156 phrase entries — any miss silently degrades routing | High | T-010 uses bulk `sed` replace + diff inspection + advisor smoke recommendation tests |
| Risk | Compiled `dist/` drift if rebuild forgotten | Medium | T-015 explicit + T-039 vitest catches drift |
| Risk | YAML asset path templates break command at runtime | High | T-022/T-023 careful regex-targeted replacement; T-038 smoke test exercises both auto + confirm |
| Risk | Symlink rename leaves dangling pointer | Medium | T-002 explicit; T-036 residual-grep checks symlinks |
| Risk | macOS HFS+ case-fold quirks with `git mv` | Low | Both old and new names are all-lowercase; no case-fold collision |
| Risk | Spec folder research artifacts pollute residual-grep | Low | Filter via `grep -v specs/` in T-036 |
| Risk | `create.sh` auto-branches off main | Medium | Skip create.sh; or run, then immediately `git checkout main && git branch -D <auto-branch>` after cherry-picking continuity commits (per memory) |
| Dependency | `cli-copilot` with `gpt-5.5` reasoning level high | Medium | If `gpt-5.5` model not available in cli-copilot at dispatch time, surface fallback prompt; do NOT silently switch to a different CLI executor (per memory: stick to the executor the user named) |
| Constraint | cli-copilot max 3 concurrent dispatches | Low | Per memory: GitHub Copilot API throttles above 3 per account; sequence task waves of ≤3 parallel jobs; use per-iter delta files to avoid shared-write races |
| Dependency | `npm run build` in mcp_server | Low | Standard build; failures surface clear errors |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Skill advisor recommendation latency unchanged (no logic change; only string substitution in scoring tables).
- **NFR-P02**: `/improve:agent` end-to-end iteration time unchanged.

### Security
- **NFR-S01**: No new attack surface — symbolic rename only. No new env vars, secrets, or external dependencies.

### Reliability
- **NFR-R01**: Zero behavior regression — verified by smoke dispatch and vitest pass.
- **NFR-R02**: Reversibility — rollback is `git revert` of the rename commits + `npm run build` + `advisor_rebuild`. Documented in `plan.md` rollback section.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Path resolution
- **Stale symlink:** old `.opencode/changelog/sk-improve-agent` symlink — must be removed, not just retargeted, to avoid two parallel entries pointing at the same content.
- **Compiled mirror drift:** if `npm run build` is skipped, `dist/skill_advisor/lib/scorer/fusion.js:242` still carries the old name and tests/runtime use it — caught by T-039 vitest.
- **SQLite advisor cache:** `skill-graph.sqlite` is binary; `advisor_rebuild` MCP call (or equivalent script) must run after `skill-graph.json` updates.

### Reference shapes
- **Path strings vs. semantic identifier:** the string `sk-improve-agent` appears in three categorical contexts: (1) path components (`.opencode/skills/sk-improve-agent/...` — always update), (2) skill id / metadata identifier (`skill_id: sk-improve-agent`, `name: sk-improve-agent` — always update), (3) historical prose ("v1.0.0.0 created sk-improve-agent" — leave verbatim, factual record). T-008 / T-009 / T-019 must distinguish between these.
- **Trigger phrase tables:** `skill_advisor.py` carries phrase variants — `sk-improve-agent`, `sk improve agent`, `improve-agent`, `agent-improvement`, `/sk-improve-agent`, `sk-agent-improvement-loop`, `/improve:agent`. The `/improve:agent` slash-command phrase stays as-is (command naming independent); other phrase variants targeting the skill update to `deep-agent-improvement` and reasonable variants.

### Test fixtures
- **`test-fixtures/060-stress-test/`** carries CP test agent definitions — these reference the skill in their internal docs and must be updated (paths) but the CP-* agent names themselves are independent.
- **`scripts/tests/fixtures/low-sample-benchmark/`** — JSON state files; check `improvement_config.json` and `agent-improvement-state.jsonl` for skill-name path refs.

### Concurrency
- This is a one-shot serial migration. No concurrent execution concern. Any parallel `cli-codex` workers must coordinate via the explicit task ordering (folder rename T-001 must complete before path-update tasks T-003+).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~96 active files, ~735 refs (ex-historical record); skill internals + advisor + 4 runtimes + root |
| Risk | 14/25 | Symbolic rename (low behavior risk) but advisor + YAML templates are load-bearing (high blast radius if missed); compiled `dist/` drift trap |
| Research | 8/20 | Fully scoped via 070-sk-deep-rename precedent; resource map authored from two parallel exploration sweeps |
| **Total** | **40/70** | **Level 2 confirmed** (boundary: Scope 100-499 LOC) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None at spec authoring time. All naming-decision matrix entries resolved against 070-sk-deep-rename precedent.

If `gpt-5.5` is not yet available in cli-copilot at dispatch time, the cli-copilot orchestrator will surface a fallback prompt — do not silently switch CLI executors (per memory: stick with cli-copilot once user has named it).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md` (T-001..T-041)
- **Verification Checklist**: `checklist.md`
- **Resource Map (full file-by-file inventory)**: `resource-map.md`
- **Precedent**: `specs/skilled-agent-orchestration/070-sk-deep-rename/` (sister rename `sk-deep-{review,research}` → `deep-{review,research}`, 2026-05-01/02)
- **Approved orchestration plan**: `~/.claude/plans/run-spec-kit-complet-auto-on-logical-flame.md`
