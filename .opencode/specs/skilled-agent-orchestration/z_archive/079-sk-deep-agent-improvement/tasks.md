---
title: "Tasks: Rename sk-improve-agent → deep-agent-improvement"
description: "Ordered T-001..T-041 task ledger covering folder rename, in-skill updates, advisor scoring tables (CRITICAL), cross-skill metadata, command surfaces in four runtimes, agent definitions in four runtimes, root docs, install guides, and verification suite. Executor: cli-copilot gpt-5.5 high (max 3 concurrent dispatches)."
trigger_phrases:
  - "task list"
  - "rename tasks"
  - "T-001"
  - "advisor migration"
  - "cli-copilot tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/079-sk-deep-agent-improvement"
    last_updated_at: "2026-05-06T08:20:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "tasks.md authored"
    next_safe_action: "validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000081"
      session_id: "079-tasks-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Rename `sk-improve-agent` → `deep-agent-improvement`

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable within current phase wave (Copilot cap: max 3 concurrent) |
| `[B]` | Blocked |
| `[CRITICAL]` | Load-bearing — failure here breaks the rename |

**Task Format**: `T### [P?][CRITICAL?] Description (file path) → Acceptance`

**Executor convention**: T-000a..g is Claude (this session); T-001..T-034 are cli-copilot dispatches; T-035..T-041 verification is mixed (Claude orchestrates; cli-copilot may assist on summary authoring).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Spec authoring + folder rename + symlink retarget. Pre-dispatch state preparation.

### Spec authoring (Claude — pre-dispatch)

- [x] T-000a Author `spec.md` (specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md)
- [x] T-000b Author `plan.md`
- [x] T-000c Author `tasks.md` (this file)
- [x] T-000d Author `checklist.md`
- [x] T-000e Author `resource-map.md`
- [x] T-000f Generate `description.json` + `graph-metadata.json` via `generate-context.js`
- [ ] T-000g `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/079-sk-deep-agent-improvement --strict` → exit 0

### Folder rename (cli-copilot)

- [ ] T-001 [CRITICAL] `git mv .opencode/skills/sk-improve-agent .opencode/skills/deep-agent-improvement` → `ls .opencode/skills/deep-agent-improvement/SKILL.md` succeeds
- [ ] T-002 Symlink rename + retarget — `rm .opencode/changelog/sk-improve-agent && ln -s ../skill/deep-agent-improvement/changelog .opencode/changelog/deep-agent-improvement` → `readlink` resolves
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> All reference updates. Sub-waves 2A..2G map to the 7 logical update zones (in-skill, advisor, cross-skill, command surfaces × 4 runtimes, agent surfaces × 4 runtimes, root docs, install guides).

### Wave 2A: In-skill updates (parallel ≤3)

- [ ] T-003 [P][CRITICAL] Update `.opencode/skills/deep-agent-improvement/SKILL.md` — frontmatter `name`, first `triggers[]` entry, HTML keyword comment line 15, body path refs lines 221, 298, 312, 351 → `grep -c 'sk-improve-agent' SKILL.md` returns 0
- [ ] T-004 [P] Update `README.md` — frontmatter title, category tag line 5, heading line 13, description line 36, table line 50, script paths lines 101/104/107, refs lines 209/306/314 → 11 refs cleared
- [ ] T-005 [P][CRITICAL] Update `graph-metadata.json` — `skill_id`, `siblings[].target`, all `derived.trigger_phrases[]`, all `derived.key_files[]`, all `derived.entities[].path` → `jq '.skill_id'` returns `"deep-agent-improvement"`
- [ ] T-006 [P][CRITICAL] Update `scripts/run-benchmark.cjs:258` (hardcoded profilesDir) and `scripts/scan-integration.cjs:2` (header comment) → `grep -c 'sk-improve-agent' scripts/*.cjs` returns 0
- [ ] T-007 [P] Update `assets/target_manifest.jsonc` (lines 16, 21, 2, 25), `assets/improvement_config.json` (lines 33-34), `assets/benchmark-profiles/default.json` (3 path refs) → `grep -rc 'sk-improve-agent' assets/` returns 0
- [ ] T-008 Update `changelog/v1.0.0.0.md..v1.2.2.0.md` path strings ONLY (historical narrative untouched); author NEW `changelog/v1.3.0.0.md` documenting rename + 070 precedent + migration notes
- [ ] T-009 [P] Update `feature_catalog/`, `manual_testing_playbook/`, `references/`, `test-fixtures/060-stress-test/` path strings → `grep -rn 'sk-improve-agent/' feature_catalog/ manual_testing_playbook/ references/ test-fixtures/` returns 0

### Wave 2B: Skill advisor (cli-copilot — CRITICAL, sequential)

- [ ] T-010 [CRITICAL] Update `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` — replace ALL 156 `sk-improve-agent` refs in TOKEN_BOOSTS / PHRASE_BOOSTS scoring tables (lines ~1548-1703). Use Sequential Thinking to ensure no phrase silently dropped → `grep -c 'sk-improve-agent' skill_advisor.py` returns 0
- [ ] T-011 [CRITICAL] Update `skill_advisor/scripts/skill-graph.json` — registry key (line 148), skill list entry (line 29), dependency weights (lines 161, 182), trigger phrases (line 349), graph-metadata sibling (`graph-metadata.json:24`) → JSON parses; registry key is `deep-agent-improvement`
- [ ] T-012 [CRITICAL] Update `skill_advisor/lib/scorer/fusion.ts:270` penalty list literal → typecheck passes
- [ ] T-013 Update `skill_advisor/tests/scorer/native-scorer.vitest.ts:315,343` test fixture skill IDs
- [ ] T-014 Update `mcp_server/tests/remediation-008-docs.vitest.ts:22` assertion path string
- [ ] T-015 [CRITICAL] `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` → regenerates `dist/skill_advisor/`; `grep 'sk-improve-agent' dist/skill_advisor/lib/scorer/fusion.js` returns 0
- [ ] T-016 [CRITICAL] Invoke `mcp__spec_kit_memory__advisor_rebuild` → SQLite cache `database/skill-graph.sqlite` rebuilt; `advisor_status` reports current build timestamp

### Wave 2C: Cross-skill metadata (parallel ≤3)

- [ ] T-017 [P] Update `.opencode/skills/sk-improve-prompt/graph-metadata.json:32` `siblings[].target` → JSON parses
- [ ] T-018 [P] Update `.opencode/skills/README.md` lines 60, 173, 210 → 3 refs cleared
- [ ] T-019 [P] Update `system-spec-kit/changelog/v3.3.0.0.md` (path strings only; lines 99, 147-151, 163) and `v3.4.0.0.md` (line 171). Historical narrative untouched

### Wave 2D: Command surfaces in 4 runtimes (parallel waves ≤3)

#### Sub-wave .opencode/ (canonical, sequential within sub-wave)

- [ ] T-020 Update `.opencode/commands/improve/agent.md` — line 238 (Skill matrix), line 293 (inline node template), 7+ body refs → `grep -c 'sk-improve-agent' agent.md` returns 0
- [ ] T-021 Update `.opencode/commands/improve/README.txt` (2 refs lines 1, 3) → 0 hits
- [ ] T-022 [CRITICAL] Update `.opencode/commands/improve/assets/improve_improve-agent_auto.yaml` — 32 refs: `skill:` field, all asset paths, all inline `node` templates → 0 hits; YAML parses
- [ ] T-023 [CRITICAL] Update `.opencode/commands/improve/assets/improve_improve-agent_confirm.yaml` — 33 refs → 0 hits

#### Sub-wave runtime mirrors (parallel ≤3)

- [ ] T-024 [P] Mirror T-020..T-023 to `.claude/commands/improve/`
- [ ] T-025 [P] Mirror to `.gemini/commands/improve/` (note: uses `improve-agent.toml` instead of `agent.md`)
- [ ] T-026 [P] Mirror to `.codex/commands/improve/` (verify file shape; Codex Path Convention may use TOML)

### Wave 2E: Agent definitions in 4 runtimes (parallel ≤3)

- [ ] T-027 [P] Update `.opencode/agents/improve-agent.md:5` Skill matrix. Agent name `improve-agent` itself NOT renamed
- [ ] T-028 [P] Update `.claude/agents/improve-agent.md:5`
- [ ] T-029 [P] Update `.gemini/agents/improve-agent.md:5`
- [ ] T-030 [P] Update `.codex/agents/improve-agent.toml:2`

### Wave 2F: Root docs + install guides (sequential — shared files)

- [ ] T-031 Update `README.md:848` (section header) and `README.md:1220` (feature matrix) → grep clean
- [ ] T-032 Update `AGENTS.md:324` and `CLAUDE.md:324` — skill ref to `deep-agent-improvement`; agent name `@improve-agent` and command `/improve:agent` unchanged → grep clean
- [ ] T-033 Update `.opencode/install_guides/README.md` (2 refs) and `SET-UP - AGENTS.md` (1 ref) → grep clean
- [ ] T-034 Verify `AGENTS_Barter.md` — symlink to separate Barter repo; if external, skip and document; otherwise update local refs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Post-implementation verification suite. Claude orchestrates; cli-copilot may assist on T-040 summary authoring.

- [ ] T-035 [CRITICAL] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/079-sk-deep-agent-improvement --strict` → exit 0
- [ ] T-036 [CRITICAL] Residual grep — `grep -rn 'sk-improve-agent' --include='*.md' --include='*.json' --include='*.toml' --include='*.ts' --include='*.js' --include='*.py' --include='*.yaml' --include='*.yml' --include='*.sh' .opencode/ .claude/ .gemini/ .codex/ README.md AGENTS.md CLAUDE.md | grep -v 'specs/' | grep -v 'changelog/v1\.[0-2]\.' | grep -v 'system-spec-kit/changelog/v3\.[34]\.'` → 0 lines
- [ ] T-037 [CRITICAL] Skill advisor smoke — `mcp__spec_kit_memory__advisor_recommend({prompt: "improve agent loop"})` returns `deep-agent-improvement` as top hit; confidence ≥ 0.85
- [ ] T-038 [CRITICAL] Smoke `/improve:agent` dispatch on sandbox agent at `.opencode/skills/deep-agent-improvement/test-fixtures/060-stress-test/.opencode/agents/cp-improve-target.md` → one auto-mode iteration completes (integration scan + profile + scoring + journal write); zero broken-path errors
- [ ] T-039 [CRITICAL] `cd .opencode/skills/system-spec-kit/mcp_server && npm test` → all tests pass; particularly `native-scorer.vitest.ts` and `remediation-008-docs.vitest.ts`
- [ ] T-040 Author `implementation-summary.md` with: rollup of REQ-001..REQ-016 (with evidence outputs), changed-files count, residual-grep proof, advisor smoke output, vitest summary, dispatch smoke output, link to new `v1.3.0.0.md` changelog entry
- [ ] T-041 `/memory:save` — invoke memory save flow; `_memory.continuity.completion_pct` = 100; description.json + graph-metadata.json regenerated
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 acceptance criteria from `spec.md` REQ-001..REQ-010 met
- [ ] All P1 acceptance criteria from `spec.md` REQ-011..REQ-016 met (or user-approved deferral documented)
- [ ] Tasks T-000..T-041 all `[x]` (excluding T-034 if Barter symlink skipped — document skip in implementation-summary.md)
- [ ] No `[B]` blocked tasks remaining
- [ ] Working tree on `main` branch (no surviving auto-branch from create.sh, per memory)
- [ ] Continuity canonical: implementation-summary.md `_memory.continuity` block reflects 100% completion
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md` — problem statement, scope, naming-decision matrix, REQ-001..REQ-017
- **Plan**: `plan.md` — phase architecture, dependencies, rollback procedure
- **Checklist**: `checklist.md` — P0/P1/P2 verification items mapped to REQs
- **Resource Map**: `resource-map.md` — exhaustive file-by-file inventory with line numbers
- **Precedent**: `specs/skilled-agent-orchestration/070-sk-deep-rename/` — sister rename, 2026-05-01/02
- **Approved orchestration plan**: `~/.claude/plans/run-spec-kit-complet-auto-on-logical-flame.md`
<!-- /ANCHOR:cross-refs -->
