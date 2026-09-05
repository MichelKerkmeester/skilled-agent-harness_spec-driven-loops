---
title: "Implementation Plan: Phase 2: scripts-into-runtime-nesting"
description: "Build the resolution-based reference inventory, decide the target layout that avoids the runtime/scripts collision, and hand off a Level 3 execution packet - this phase does not run git mv."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: scripts-into-runtime-nesting

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, `rg`, Node (for resolution checks), git |
| **Framework** | None - a reference-inventory and decision exercise |
| **Storage** | None - output is this packet's own documents |
| **Testing** | `recommend-level.sh` (level scoring), manual resolution checks (no automated test in this planning phase) |

### Overview
This phase does not move any file. It builds a resolution-based inventory of every current consumer of `.opencode/skills/system-spec-kit/scripts/`, picks `runtime/cli/` as the target layout to avoid the `runtime/scripts/` collision, and hands off a Level 3 execution packet recommendation with the atomic-commit plan packet 053 already proved out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `recommend-level.sh` run and its result recorded
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Inventory-then-decide: a resolution pass produces a consumer list grouped by class, a target-layout decision resolves the one known collision, and the output becomes the seed for a separate Level 3 execution packet.

### Key Components
- **Resolution inventory**: for each `rg` hit on `scripts/`, confirm the hit is a live consumer - an import statement that resolves, a `spawnSync`/`exec` target that runs, a YAML `command:` field a hook or CI job actually invokes, or a shell `source`/`.` that executes. A text match that is only prose (a changelog entry, a comment describing history) is recorded as non-live and excluded from the move's blast radius.
- **Target-layout decision**: `runtime/cli/` for the incoming CLI workspace, versus folding `runtime/scripts/`'s three build-tooling files into the incoming tree first. This phase recommends the former because it touches three files instead of merging an entire second workspace's internal directory names.
- **Execution handoff**: a Level 3 packet, created via Gate 3 Option D under this same parent, that consumes this phase's inventory and decision as its starting `spec.md` scope.

### Data Flow
`rg -n 'scripts/' <repo-root>` (broad first pass) → filter to `.opencode/skills/system-spec-kit/**` and repo-root config/CI/CLAUDE.md hits → for each hit, resolve whether it is a live consumer or prose → group by consumer class (hook config, CI workflow, doctor asset, agent mirror, README, CLAUDE.md, workspace `package.json`) → target-layout decision applied to the whole group → handed to the execution phase's `spec.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.opencode/skills/system-spec-kit/package.json` `workspaces` | Declares `["shared", "runtime", "scripts"]` | not changed in this phase; execution phase updates the third entry | `cat .opencode/skills/system-spec-kit/package.json \| python3 -c "import json,sys;print(json.load(sys.stdin)['workspaces'])"` |
| `runtime/scripts/` (`finalize-dist.mjs`, `run-tests.mjs`, `run-tests-sharded.mjs`, `tests/`) | Runtime's own build-tooling directory, already occupying the name a naive `git mv` would target | not changed in this phase; execution phase resolves via the `runtime/cli/` decision | `find .opencode/skills/system-spec-kit/runtime/scripts -maxdepth 1` |
| `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, `.cursor/hooks.json` | Reference compiled hook paths under `runtime/dist/hooks/**`, not `scripts/**` directly, but any hook wrapper shelling into `scripts/` would break | inventory only in this phase | `rg -n "skills/system-spec-kit/scripts/" .claude .codex .devin .cursor .github` |
| CLAUDE.md | Names `scripts/spec/validate.sh`, `scripts/dist/memory/generate-context.js`, `scripts/retrieval/lookup-trigger-index.mjs` directly | inventory only in this phase | `rg -n "scripts/spec/validate.sh\|scripts/dist/memory\|scripts/retrieval/lookup-trigger-index" CLAUDE.md` |

Required inventories:
- Same-class producers: `rg -n "system-spec-kit/scripts" . --glob '!node_modules' --glob '!dist' -l` grouped by top-level directory (`.opencode/commands`, `.opencode/skills`, `.claude`, `.codex`, `.cursor`, `.devin`, `.pi`, `.github`, repo root) to size each consumer class before the execution phase estimates effort.
- Consumers of changed symbols: for every hit, `rg -n "require\(.*scripts|import.*scripts|spawnSync.*scripts|command:.*scripts"` to separate a live consumer from a prose mention.
- Matrix axes: consumer class (hook / CI / doctor / mirror / README / CLAUDE.md / workspace config) × reference kind (import / exec / config-string / prose) - the inventory table in the execution phase's `spec.md` should have one row per (class, kind) pair with a non-zero count.
- Algorithm invariant: not applicable - this is a rename, not a parser/resolver change; the only invariant is that every live reference is either moved with the file or updated to the new path in the same atomic commit.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Not applicable - no code changes in this phase | N/A |
| Integration | Not applicable in this phase; the execution phase runs the full gate set (`validate.sh --strict --recursive`, `npm test` in both packages, doctor routes) before and after the `git mv` | `validate.sh`, `npm test` |
| Manual | `recommend-level.sh` run against this folder; manual resolution check on a sample of `rg` hits to confirm the live/prose classification | `recommend-level.sh`, `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh` | Internal | Green - exists and is executable | Cannot confirm the Level 3 re-scoring; execution phase would start under-scoped |
| Packet 053's review-loop precedent and lineage artifacts | Internal | Green - `specs/system-speckit/053-spec-kit-runtime-rename/` exists and is readable | The execution phase would have to reinvent the review-pass shape instead of reusing a proven one |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable to this planning-only phase - no filesystem change is made here.
- **Procedure**: If the target-layout decision recorded here is later found wrong (e.g., the execution phase's deeper inventory finds a third collision), amend this phase's `spec.md` and acceptance criteria before the execution phase starts; no code rollback is needed since none ran.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (rg pass + resolution filter) ──► Core (target-layout decision + level check) ──► Verify (record inventory + handoff)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | The future Level 3 execution packet |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | One broad `rg` pass plus per-hit resolution classification |
| Core Implementation | Low | The target-layout decision is a documented choice, not code |
| Verification | Low | `recommend-level.sh` run plus recording the result |
| **Total** | | **A few hours - this is a planning phase, not the move itself** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not applicable, no data changes in this phase
- [ ] Feature flag configured - not applicable
- [ ] Monitoring alerts set - not applicable

### Rollback Procedure
1. Not applicable - this phase makes no filesystem change outside its own four documents.
2. If the inventory or decision needs revision, edit this phase's documents directly; no revert is needed.
3. Re-run `recommend-level.sh` if scope changes materially enough to affect the score.
4. No stakeholder notification needed - internal planning artifact only.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
