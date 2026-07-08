---
title: "Implementation Plan: External Reference Migration"
description: "Dependency-ordered staging plan for migrating every deep-loop-workflows/deep-loop-runtime reference to system-deep-loop."
trigger_phrases:
  - "external reference migration plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/003-external-reference-migration"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from Plan-agent B's verified staged design"
    next_safe_action: "Wait for 002 to land, then execute Stage A"
    blockers:
      - "Depends on 002-hub-rename-and-runtime-nesting landing first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-003-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: External Reference Migration

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, JSON, Python, TypeScript, CommonJS |
| **Framework** | `rg`-based grep-before/grep-after bracketing (154 precedent's methodology), codegen re-runs, vitest |
| **Testing** | `routing-registry-drift-guard.vitest.ts`, `local-native-divergence-ratchet.vitest.ts`, full `system-skill-advisor` + `system-spec-kit` vitest suites |

### Overview
10 dependency-ordered stages (A-J). Physical move (002) and reference rewrite happen as one atomic unit — no safe intermediate commit exists where files moved but references haven't. Temporary compatibility symlinks (`deep-loop-workflows -> system-deep-loop`, `deep-loop-runtime -> system-deep-loop/runtime`) act as a safety net during the multi-file rewrite window, removed once Stage J's residual-grep is clean.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 002-hub-rename-and-runtime-nesting landed; `system-deep-loop/` exists as the real target.
- [ ] Stage-A baseline captured (current `rg` inventory + `score-routing-corpus.py` accuracy numbers).

### Definition of Done
- [ ] Residual grep clean (Stage J.1).
- [ ] Advisor routing accuracy holds or exceeds baseline (Stage J.5).
- [ ] Divergence ratchet, agent-mirror sync, and full vitest suites pass (Stage J.6-10).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Grep-before/grep-after bracketing per file category, never a blind one-shot find/replace. Category-level rule for what's safe to leave: anything under `.opencode/specs/**` is historical and untouched; anything executable, structured-data, or advisor-facing must update.

### Stage sequence

**Stage A — Pre-flight baseline.** Scoped `rg` inventory (excluding `node_modules`, specs, `.worktrees`, `dist/`) as the audit anchor. Run `score-routing-corpus.py` once, pre-change, to capture current accuracy numbers.

**Stage B — Consume the physical move (from 002).** Combine move + rewrite into one atomic unit. Drop temporary compat symlinks right after the move as a safety net for the rewrite window.

**Stage C — Hardcoded code constants** (must land before D-J):
1. `skill_advisor.py`: `MODE_REGISTRY_PATH`, `MERGED_DEEP_SKILL_ID`, the literal skill string inside `_projection_hash()` (changes the emitted hash intentionally), `ALIASES_TS_PATH`, routing-weight tables.
2. `aliases.ts`: hand-authored `MERGED_DEEP_SKILL_ID` constant only — do NOT touch the generated block (regenerated in Stage D).
3. `explicit.ts`: `TOKEN_BOOSTS`/`PHRASE_BOOSTS` literals.
4. `mk-deep-loop-guard.js`: `REGISTRY_RELATIVE_PATH` constant + test fixture — first confirm its failure mode (throw vs. silent no-op) on a missing path.
5. `parent-skill-check.cjs`: `GLOBAL_MAP_OWNER`, `DEFAULT_TARGET` — **highest priority**, gates every other skill's doctor audit, not just this one's.
6. `render-command-contract.cjs` + `compile-command-contracts.cjs`: cross-skill relative requires + the hardcoded path manifest (in-file sed safe here, no historical-narrative risk).
7. Pre-commit hook (`MIRROR_CHECKER`) + GitHub Actions workflow (`CHECKER`) — edited as a matched pair.

**Stage D — Structured identity fields + codegen** (depends on B+C):
1. `mode-registry.json`/`hub-router.json` `skill` fields, `description.json` name/keywords, both `SKILL.md` frontmatter, moved folders' own `graph-metadata.json` self-references.
2. Run `skill_advisor.py --emit-routing-projection` — regenerates `aliases.ts`'s generated block AND `skill_advisor.py`'s own hash block in one pass.
3. Update `routing-registry-drift-guard.vitest.ts`'s hardcoded `registryPath` constant.

**Stage E — Compiled command-contract regeneration** (depends on C.6/D):
1. Update `skill:`/`skill_md:` frontmatter in 8 source YAML assets under `.opencode/commands/deep/assets/*.yaml`.
2. Update 3 router `.md` one-liners (`deep/review.md`, `research.md`, `ai-council.md`).
3. Run `compile-command-contracts.cjs` — never hand-edit the compiled output (embedded content hash).
4. `.claude/commands -> .opencode/commands` is a real symlink — edit once.

**Stage F — Prose/docs** (parallel-safe once B's paths exist): agents (`.opencode/agents/**` + `.claude/agents/**`, real non-symlinked duplicate, per-file scoped grep verification not a blanket diff), root README + 6 others, `system-spec-kit`'s constitutional doc + references, cross-skill "related skills" prose (`sk-design`, `cli-opencode`, `sk-code`, `sk-prompt-models`).

**Stage G — Sibling `graph-metadata.json` edges** in `system-spec-kit`, `system-skill-advisor`, `cli-opencode`, `sk-code`, `sk-prompt`. Where a graph carries two separate edges (one to each old skill), collapse to one edge, not a duplicate.

**Stage H — Grandfather-example files** (spec.md §8 Decision): `parent_skills_nested_packets.md`'s hub matrix and `skill-parent.md`'s canonical-example sentence updated to `system-deep-loop`. `skill-parent.md`'s prefix-derivation example specifically needs its OTHER half swapped (not just the name substituted) since the equivalence "folder prefix == command-namespace prefix" now has one documented exception — add an explicit caveat sentence, apply the same fix to the 2 asset YAMLs.

**Stage I — Advisor routing corpus + re-baseline** (depends on C+D):
- Field-scoped replace on `"skill_top_1"`/`"nativeTop"`/`"localTop"` values only (confirmed: skill name never appears inside prompt text).
- `local-native-approved-divergences.json`: run the ratchet test post-rename, let it fail and print its mismatch diff, hand-verify each flagged mismatch is the expected rename, then update `nativeTop`/`localTop`/`reason`/`approvedAt` together per entry — mirrors the existing 2026-06-15 re-baseline entry's own pattern.
- `score-routing-corpus.py --min-advisor-accuracy <Stage-A baseline>` to prove the number held.

**Stage J — Verification/exit gate** (always last, in order): residual-grep sweep → `parent-skill-check.cjs` self-check → advisor codegen clean + drift-guard → contract-compile determinism → routing-accuracy re-baseline → divergence ratchet suite → agent-mirror sync check → `/doctor:update` skill-graph rebuild → CI parity → full vitest for `system-skill-advisor` + `system-spec-kit` → `create:skill-parent` smoke check.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Stage A: capture baseline `rg` inventory + advisor accuracy numbers.

### Phase 2: Core Implementation
- [ ] Stage B: consume the physical move; drop temp compat symlinks.
- [ ] Stage C: hardcoded code constants (7 sub-items above).
- [ ] Stage D: structured identity fields + codegen.
- [ ] Stage E: compiled command-contract regeneration.
- [ ] Stage F: prose/docs (agents, READMEs, system-spec-kit references).
- [ ] Stage G: sibling graph-metadata.json edges.
- [ ] Stage H: grandfather-example files with the prefix-exception caveat.
- [ ] Stage I: advisor routing corpus field-scoped rename + divergence ledger re-approve + accuracy re-baseline.

### Phase 3: Verification
- [ ] Stage J: full 11-step exit-gate sweep (see Architecture above).
- [ ] Remove temporary compat symlinks once residual-grep is clean.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Residual reference sweep | `rg -l 'deep-loop-workflows\|deep-loop-runtime'` excluding specs/worktrees/node_modules/dist |
| Routing | Advisor codegen drift + accuracy | `routing-registry-drift-guard.vitest.ts`, `score-routing-corpus.py` |
| Ledger | Divergence re-approve completeness | `local-native-divergence-ratchet.vitest.ts` |
| Integration | Doctor + hooks + CI parity | `/doctor parent-skill`, `check-agent-mirror-sync.cjs`, pre-commit vs. GH Actions path comparison |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002-hub-rename-and-runtime-nesting | Internal | Pending | This phase repoints TO paths that don't exist until 002 lands |

### Downstream
005-validation-and-closeout's final sweep assumes this phase's Stage J already passed.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Stage J's exit gate fails on advisor accuracy regression, unresolved residual grep, or a broken doctor/hook/CI path.
- **Procedure**: every stage here is a text-only edit or codegen re-run — revert via `git revert` per stage; the temporary compat symlinks (Stage B) provide a live safety net during the rewrite window itself.
<!-- /ANCHOR:rollback -->
