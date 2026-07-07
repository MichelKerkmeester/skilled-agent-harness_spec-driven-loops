---
title: "Implementation Plan: Rename sk-improve-agent → deep-agent-improvement"
description: "Sequenced rename plan executed by cli-copilot gpt-5.5 high in 9 phases (folder rename → in-skill → advisor → cross-skill → command surfaces → agent surfaces → root docs → verification). Strict ordering: skill folder rename precedes path-string updates so missed sites surface as broken paths during smoke verification."
trigger_phrases:
  - "rename plan"
  - "sk-improve-agent migration"
  - "skill rename phases"
  - "advisor reindex"
  - "deep-agent-improvement plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/014-sk-deep-agent-improvement"
    last_updated_at: "2026-05-06T08:10:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "plan.md authored"
    next_safe_action: "validate"
    blockers: []
    key_files:
      - "specs/system-deep-loop/z_archive/014-sk-deep-agent-improvement/spec.md"
      - "specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000080"
      session_id: "079-plan-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Rename `sk-improve-agent` → `deep-agent-improvement`

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server), Python 3.x (skill_advisor.py), Node.js CommonJS (skill scripts), Markdown + YAML (docs/configs), Shell (validators) |
| **Framework** | OpenCode skill+command runtime; Vitest for tests; SQLite for advisor cache |
| **Storage** | Filesystem-only (no DB schema changes). SQLite advisor cache is rebuilt from JSON, not migrated |
| **Testing** | Vitest in `mcp_server/`; smoke dispatch via `/deep:start-agent-improvement-loop` on sandbox agent |
| **Implementation executor** | `cli-copilot` with `gpt-5.5` reasoning level **high** |
| **Concurrency** | Max **3** parallel cli-copilot dispatches per Copilot API throttle (per memory) |

### Overview

Symbolic rename of one skill folder propagated through ~96 active-code files (~735 references). Strict ordering enforces a "rename first, then chase missed refs" discipline: T-001 performs `git mv` so the old path becomes broken; T-002..T-034 update each reference site; T-035..T-041 verify completeness via residual-grep, advisor reindex, smoke dispatch, vitest, and continuity save. The 070-sk-deep-rename packet (sister rename, 2026-05-01/02) is the directly applicable architectural precedent — we collapse its 7-phase parent structure into a single Level 2 packet with sequenced tasks because the user explicitly asked for Level 2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented (`spec.md` §2-3)
- [x] Success criteria measurable (`spec.md` §5; SC-001..SC-005)
- [x] Resource map produced (`resource-map.md` — exhaustive file-by-file inventory)
- [x] Naming-decision matrix resolved against 070 precedent (`spec.md` §3 Out of Scope)
- [x] cli-copilot executor + concurrency cap declared (`spec.md` §1, `plan.md` §1)

### Definition of Done

- [ ] All P0 acceptance criteria met (`spec.md` REQ-001..REQ-010)
- [ ] All P1 acceptance criteria met (`spec.md` REQ-011..REQ-016)
- [ ] `validate.sh ... --strict` exits 0
- [ ] Residual `grep -rn 'sk-improve-agent'` scoped to active code returns 0 hits (excluding historical record + `specs/`)
- [ ] Vitest pass in `.opencode/skills/system-spec-kit/mcp_server/`
- [ ] Smoke `/deep:start-agent-improvement-loop` dispatch on sandbox agent completes one iteration
- [ ] `implementation-summary.md` authored with verification evidence
- [ ] `/memory:save` executed; continuity canonical at packet root
- [ ] Branch hygiene: working tree on `main`, no surviving auto-branch
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Sequenced string-substitution refactor** with explicit ordering (filesystem move → metadata update → advisor index rebuild → consumer surfaces → verification). No new components, no behavioral change. Rollback model is `git revert` of the rename commits + `npm run build` + `advisor_rebuild`.

### Key Components

- **Skill folder** (`.opencode/skills/sk-improve-agent/` → `.opencode/skills/deep-agent-improvement/`): the renamed directory containing SKILL.md, README.md, graph-metadata.json, scripts/, assets/, references/, changelog/, feature_catalog/, manual_testing_playbook/, test-fixtures/.
- **Skill advisor** (`system-spec-kit/mcp_server/skill_advisor/`): the load-bearing scoring system. `skill_advisor.py` carries 156 phrase entries; `skill-graph.json` is the registry; `fusion.ts` carries a penalty list; SQLite cache is rebuilt from JSON via `advisor_rebuild`.
- **Command surface** (`commands/deep/`): `/deep:start-agent-improvement-loop` definition + YAML asset templates that reference the skill path. Mirrored across 4 runtime directories (`.opencode/`, `.claude/`, `.gemini/`, `.codex/`).
- **Agent surface** (`agents/improve-agent.{md,toml}`): the `@improve-agent` definition referencing the skill in its skill-matrix. Mirrored across 4 runtimes. Agent name itself is **not** renamed.
- **Symlink** (`.opencode/changelog/sk-improve-agent`): convenience pointer to the skill's changelog directory; renamed and retargeted.

### Data Flow

```
T-001: git mv (folder rename)
   │
   ▼
T-002: symlink retarget        (parallel ok)
   │
   ▼
T-003..T-009: skill internals  (renamed folder's own contents)
   │
   ▼
T-010..T-016: ADVISOR (CRITICAL — load-bearing)
   │   ├─ skill_advisor.py (156 phrase entries)
   │   ├─ skill-graph.json (registry)
   │   ├─ fusion.ts (penalty list) + tests
   │   ├─ npm run build (regenerates dist/)
   │   └─ advisor_rebuild (SQLite cache)
   │
   ▼
T-017..T-019: cross-skill metadata (sk-improve-prompt, skill index, sys-spec-kit changelog)
   │
   ▼
T-020..T-026: COMMAND SURFACES (4 runtimes × {agent.md, README.txt, *.yaml assets})
   │
   ▼
T-027..T-030: AGENT DEFINITIONS (4 runtimes × improve-agent.{md,toml})
   │
   ▼
T-031..T-034: ROOT DOCS + INSTALL GUIDES
   │
   ▼
T-035..T-041: VERIFICATION (validate.sh, residual grep, advisor recommend, smoke /deep:start-agent-improvement-loop, vitest, summary, /memory:save)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a symbolic refactor, not a fix; the addendum is included because the rename touches advisor scoring tables, schema-shaped JSON metadata, and public response paths in the `/deep:start-agent-improvement-loop` workflow.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Producer: skill folder + SKILL.md | Authoritative skill identity | Rename folder + update frontmatter `name`, triggers, body refs | `grep -n '^name:' .opencode/skills/deep-agent-improvement/SKILL.md` |
| Producer: graph-metadata.json | Skill registry entry (skill_id, siblings, key_files, entities, trigger_phrases) | Update skill_id + 21 path/entity refs | JSON parse + spot-check fields |
| Producer: skill_advisor.py | TOKEN_BOOSTS / PHRASE_BOOSTS scoring tables (156 phrase entries) | Bulk replace phrase keys + values | `grep -c 'sk-improve-agent' skill_advisor.py` returns 0 |
| Producer: skill-graph.json | Registry, dependency edges, hub_skills | Rename key + update target/from/to references (5 refs) | JSON parse + advisor_recommend smoke |
| Helper: fusion.ts:270 | Penalty list (penalizes deep-review and sk-improve-agent in fusion ranker) | Update string in penalty list | Type check + vitest |
| Helper: native-scorer.vitest.ts | Test fixture asserting skill IDs | Update fixture skill ID | `npm test` |
| Helper: remediation-008-docs.vitest.ts | Test asserting feature_catalog path string | Update path | `npm test` |
| Consumer: deep_start-agent-improvement-loop_*.yaml | Command workflow templates calling `node .opencode/skills/sk-improve-agent/scripts/*.cjs` | Update `skill:` field + 32-33 path templates per file × 2 files × 4 runtimes | Smoke dispatch /deep:start-agent-improvement-loop |
| Consumer: improve-agent.{md,toml} | Agent definition skill-matrix line | Update skill name reference (1 ref per file × 4 runtimes) | grep + visual review |
| Consumer: README.md (root), AGENTS.md, CLAUDE.md | Public skill index + agent registry | Update 4 refs | grep returns 0 in those files |
| Consumer: install_guides/* | New-machine setup docs | Update 3 refs | grep |
| Consumer: skill_advisor SQLite cache | Compiled scoring index | Rebuild via advisor_rebuild MCP call | `advisor_status` reports current build |
| Not-a-consumer: agent name `@improve-agent` | Agent identifier (independent of skill folder name) | **Unchanged** (per 070 precedent) | grep `@improve-agent` returns same hits as before |
| Not-a-consumer: command `/deep:start-agent-improvement-loop` | Command identifier | **Unchanged** | grep `/deep:start-agent-improvement-loop` returns same hits |
| Not-a-consumer: YAML asset filenames | Command-scoped (named after command target) | **Unchanged** | `ls commands/deep/assets/` shows same filenames |
| Not-a-consumer: specs/ research artifacts | Historical record | **Unchanged** | excluded from residual-grep filter |

**Required inventories**:
- Same-class producers grep: `rg -n 'sk-improve-agent' .opencode/skills/sk-improve-agent/` (393 hits — internal cohesion check)
- Consumers grep: `rg -n 'sk-improve-agent' .opencode/ .claude/ .gemini/ .codex/ README.md AGENTS.md CLAUDE.md` (all external active-code consumers; expected ≈342)
- Algorithm invariant: rename is **string-substitution only**; no parser, no path resolution logic change. Adversarial cases none — deterministic mechanical replace.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec authoring (Claude this session — pre-dispatch)

- [x] Author `spec.md`
- [ ] Author `plan.md` (this file, in progress)
- [ ] Author `tasks.md` with T-001..T-041 ordered
- [ ] Author `checklist.md` with P0/P1/P2 verification items
- [ ] Author `resource-map.md` with exhaustive file-by-file inventory
- [ ] Generate `description.json` + `graph-metadata.json` via `generate-context.js`
- [ ] Run `validate.sh ... --strict` → exit 0 before dispatch

### Phase 2: Folder rename (cli-copilot)

- [ ] T-001: `git mv .opencode/skills/sk-improve-agent .opencode/skills/deep-agent-improvement`
- [ ] T-002: Symlink rename + retarget (`.opencode/changelog/`)

### Phase 3: In-skill updates (parallelizable wave)

- [ ] T-003: SKILL.md (frontmatter + body)
- [ ] T-004: README.md
- [ ] T-005: graph-metadata.json (21 refs)
- [ ] T-006: scripts/ (run-benchmark.cjs, scan-integration.cjs)
- [ ] T-007: assets/ (target_manifest.jsonc, improvement_config.json, benchmark-profiles)
- [ ] T-008: changelog/ path strings (historical narrative untouched) + new v1.3.0.0.md authored
- [ ] T-009: feature_catalog/, manual_testing_playbook/, references/, test-fixtures/ path strings

### Phase 4: Skill advisor (cli-copilot — CRITICAL, sequential within phase)

- [ ] T-010: skill_advisor.py — 156 phrase entries
- [ ] T-011: skill-graph.json — registry + edges + trigger phrases
- [ ] T-012: fusion.ts:270 — penalty list
- [ ] T-013: native-scorer.vitest.ts — test fixture skill IDs
- [ ] T-014: remediation-008-docs.vitest.ts — assertion path
- [ ] T-015: `npm run build` in mcp_server (regenerates dist/)
- [ ] T-016: `advisor_rebuild` MCP call (or equivalent script) — rebuild SQLite cache

### Phase 5: Cross-skill metadata (parallelizable wave)

- [ ] T-017: sk-improve-prompt/graph-metadata.json:32 sibling target
- [ ] T-018: .opencode/skills/README.md skill index (3 refs)
- [ ] T-019: system-spec-kit changelog v3.3.0.0.md, v3.4.0.0.md path strings only

### Phase 6: Command surfaces (4 runtimes)

- [ ] T-020: .opencode/commands/deep/start-agent-improvement-loop.md (10+ refs)
- [ ] T-021: .opencode/commands/README.txt (2 refs)
- [ ] T-022: .opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml (32 refs)
- [ ] T-023: .opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml (33 refs)
- [ ] T-024: Mirror T-020..T-023 to .claude/commands/deep/
- [ ] T-025: Mirror to .gemini/commands/deep/ (note: uses improve-agent.toml)
- [ ] T-026: Mirror to .codex/commands/deep/ (verify presence + shape)

### Phase 7: Agent definitions (4 runtimes)

- [ ] T-027: .opencode/agents/improve-agent.md:5 skill matrix
- [ ] T-028: .claude/agents/improve-agent.md:5
- [ ] T-029: .gemini/agents/improve-agent.md:5
- [ ] T-030: .codex/agents/improve-agent.toml:2

### Phase 8: Root docs + install guides (cli-copilot)

- [ ] T-031: README.md:848,1220
- [ ] T-032: AGENTS.md:324, CLAUDE.md:324
- [ ] T-033: .opencode/install_guides/README.md (2 refs), SET-UP - AGENTS.md (1 ref)
- [ ] T-034: AGENTS_Barter.md (verify only — symlink to separate Barter repo)

### Phase 9: Verification (Claude this session, post-dispatch)

- [ ] T-035: `validate.sh ... --strict` → exit 0
- [ ] T-036: Residual `grep -rn 'sk-improve-agent'` scoped to active code → 0 hits
- [ ] T-037: `advisor_rebuild` + `advisor_recommend({prompt: "improve agent loop"})` → top hit deep-agent-improvement
- [ ] T-038: Smoke `/deep:start-agent-improvement-loop` dispatch on sandbox agent (cp-improve-target)
- [ ] T-039: `cd .opencode/skills/system-spec-kit/mcp_server && npm test` passes
- [ ] T-040: Author `implementation-summary.md` with verification evidence
- [ ] T-041: `/memory:save` → continuity canonical
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | spec docs (Level 2 contract) | `validate.sh ... --strict` |
| Static check | residual `sk-improve-agent` references | `grep -rn` with category filters |
| Unit (vitest) | `native-scorer.vitest.ts`, `remediation-008-docs.vitest.ts`, `improvement-journal.vitest.ts`, etc. | Vitest in mcp_server/ |
| Integration | Skill advisor recommendation | `advisor_recommend` MCP call |
| Smoke | `/deep:start-agent-improvement-loop` dispatch end-to-end | Sandbox agent dispatch (cp-improve-target.md) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-copilot CLI installed and authenticated | External | Green (assumed) | Cannot dispatch implementation; spec docs still authored |
| `gpt-5.5` model available in cli-copilot | External | Yellow (uncertain availability) | Surface fallback prompt; do not silently switch CLI executors |
| Node.js + npm in mcp_server/ | Internal | Green | Cannot rebuild dist/ or run vitest |
| `advisor_rebuild` MCP tool | Internal | Green | SQLite cache stale; routing degrades silently |
| `validate.sh` working (head -n 20 quirk satisfied) | Internal | Green (TEMPLATE_SOURCE comment prepended above frontmatter) | Strict validation fails |
| Spec Kit Memory MCP available (`generate-context.js`, `/memory:save`) | Internal | Green | Continuity not canonical; description.json/graph-metadata.json missing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Smoke `/deep:start-agent-improvement-loop` dispatch fails after rename, or `npm test` regresses, or advisor_recommend returns wrong skill, or any P0 acceptance criterion cannot be met.
- **Procedure**:
  1. `git log --oneline | head -20` — identify rename commit(s) authored by cli-copilot dispatch
  2. `git revert <commit-hash>` for each rename commit in reverse order (preserves history; preferred over `reset --hard` per branch hygiene)
  3. `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` — regenerate compiled dist/ from now-reverted sources
  4. `mcp__spec_kit_memory__advisor_rebuild` — rebuild SQLite cache against now-reverted JSON
  5. Verify: `grep -rn 'deep-agent-improvement' .opencode/ .claude/ .gemini/ .codex/` returns 0 hits in active code
  6. Verify: `/deep:start-agent-improvement-loop` smoke dispatch on the same sandbox agent completes successfully
  7. Document rollback in `implementation-summary.md` (rollback section + reason)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Spec authoring, Claude) ────► Phase 2 (Folder rename)
                                              │
                                              ▼
                  ┌───── Phase 3 (In-skill, parallel wave ≤3) ─────┐
                  │                                                  │
                  ▼                                                  │
Phase 4 (Advisor, sequential within) ──┐                              │
                                        │                              │
                                        ▼                              │
                  ┌───── Phase 5 (Cross-skill, parallel wave ≤3) ─────┘
                  │
                  ▼
                  ┌───── Phase 6 (Command surfaces, 4 runtimes parallel ≤3) ──┐
                  │                                                              │
                  ▼                                                              │
                  ┌───── Phase 7 (Agent surfaces, 4 runtimes parallel ≤3) ──────┘
                  │
                  ▼
                  Phase 8 (Root docs, sequential — single-thread on shared files)
                  │
                  ▼
                  Phase 9 (Verification, Claude)
```

| Phase | Depends On | Blocks | Concurrency |
|-------|------------|--------|-------------|
| 1 (Spec) | None | 2-9 | Claude only |
| 2 (Folder rename) | 1 | 3-8 | sequential, single dispatch |
| 3 (In-skill) | 2 | 4 | parallel wave ≤3 |
| 4 (Advisor CRITICAL) | 2 | 5-8 | sequential T-010..T-016 |
| 5 (Cross-skill) | 4 | 9 | parallel wave ≤3 |
| 6 (Command surfaces) | 4 | 9 | parallel wave ≤3 (4 runtimes split into 2 waves) |
| 7 (Agent surfaces) | 4 | 9 | parallel wave ≤3 |
| 8 (Root docs) | 4-7 (any) | 9 | sequential (shared README.md/AGENTS.md/CLAUDE.md) |
| 9 (Verification) | 2-8 (all) | None | Claude only |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Spec authoring (Claude) | Med | 30-45 min |
| 2 Folder rename | Low | 2 min |
| 3 In-skill updates | Med | 15-25 min (parallel wave) |
| 4 Advisor (CRITICAL) | High | 20-30 min (skill_advisor.py 156 phrases is the bulk) |
| 5 Cross-skill metadata | Low | 5-10 min |
| 6 Command surfaces (4 runtimes) | High | 30-45 min (YAML 32-33 refs × 2 files × 4 runtimes = ~520 substitutions) |
| 7 Agent surfaces | Low | 5 min |
| 8 Root docs + install guides | Low | 10 min |
| 9 Verification | Med | 20-30 min (vitest + smoke + summary + /memory:save) |
| **Total** | | **~2-3.5 hours** end-to-end |

Concurrency note: Copilot 3-cap means Phase 6 (command surfaces, 4 runtimes) runs as 2 waves (3+1) rather than full parallel.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] `git status` clean OR known-state at start (per memory: dirty worktree is baseline; not a blocker)
- [ ] Current branch is `main`
- [ ] `npm run build` runs cleanly in mcp_server/ at baseline (so post-rename rebuild has reference)
- [ ] Sandbox agent for smoke test identified: `.opencode/skills/sk-improve-agent/test-fixtures/060-stress-test/.opencode/agents/cp-improve-target.md` (path will shift to `deep-agent-improvement/`)

### Rollback Procedure

1. `git log --oneline -- .opencode/skills/sk-improve-agent .opencode/skills/deep-agent-improvement` — list rename-related commits
2. `git revert <commits>` in reverse chronological order (one revert commit per original)
3. `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` — regenerate dist/
4. Invoke `advisor_rebuild` to refresh SQLite cache from now-reverted JSON
5. Smoke test `/deep:start-agent-improvement-loop` on sandbox agent — must succeed against the restored old name
6. `bash validate.sh specs/skilled-agent-orchestration/079-sk-deep-agent-improvement --strict` — should still pass on rolled-back state (spec docs remain authored, just not implemented)
7. Annotate `implementation-summary.md` with `## Rollback` section, reason, and timestamp

### Data Reversal

- **Has data migrations?** No — symbolic rename only.
- **Reversal procedure**: Git revert + advisor rebuild covers all state. SQLite cache is regenerable (not authoritative). No DB schema, no user data, no external service state.
<!-- /ANCHOR:enhanced-rollback -->
