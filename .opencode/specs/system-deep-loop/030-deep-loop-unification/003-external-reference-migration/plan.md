---
title: "Implementation Plan: External Reference Migration"
description: "Dependency-ordered staging plan for migrating every deep-loop-workflows/deep-loop-runtime reference to system-deep-loop."
trigger_phrases:
  - "external reference migration plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/003-external-reference-migration"
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
1. `skill_advisor.py`: `MODE_REGISTRY_PATH`, `MERGED_DEEP_SKILL_ID`, the literal skill string inside `_projection_hash()` (changes the emitted hash intentionally), `ALIASES_TS_PATH`, routing-weight tables (`PHRASE_INTENT_BOOSTERS` and CLI help/docstring prose — 18 total old-name occurrences in this one file, not just the named constants).
2. `aliases.ts`: hand-authored `MERGED_DEEP_SKILL_ID` constant only — do NOT touch the generated block (regenerated in Stage D). **Path correction (verified live 2026-07-08): the real file is `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`, NOT `lib/routing/aliases.ts` as originally planned** — `lib/routing/` does not exist. Generated block is lines ~21-63 (`BEGIN/END GENERATED DEEP ROUTING PROJECTION`); hand-authored `MERGED_DEEP_SKILL_ID` is at line 109, inside a separate "Merged Deep-Loop Identity + Mode Layer" section — confirmed the codegen only rewrites the marked block, line 109 is safe to hand-edit.
3. `explicit.ts`: `TOKEN_BOOSTS`/`PHRASE_BOOSTS` literals. **Path correction (verified live): the real file is `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`, NOT `lib/routing/explicit.ts`.**
4. `mk-deep-loop-guard.js`: real path `.opencode/plugins/mk-deep-loop-guard.js`, `REGISTRY_RELATIVE_PATH` at line 35. Test fixture: `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` (constructs/deletes the old path directly — must change in lockstep). Confirmed failure mode: **silent fail-open**, not a throw — `loadRegistryAgents()` catches all read/parse errors and returns `null`; the test explicitly asserts fail-open-even-in-reject-mode behavior, so a stale/missing registry path degrades safety silently rather than erroring loud. Edit with care — verify the guard still fires on a *valid* registry post-rename, not just that it doesn't crash on a missing one.
5. `parent-skill-check.cjs`: real path `.opencode/commands/doctor/scripts/parent-skill-check.cjs`, `GLOBAL_MAP_OWNER` (line ~95) + `DEFAULT_TARGET` (line ~97). **Priority claim refined by verification**: it does NOT gate literally every skill's doctor audit — it gates parent-hub audits specifically (any skill with its own `mode-registry.json`), enrolled via `.opencode/skills/*/mode-registry.json` glob in the GH Actions workflow, still high priority since every hub is swept automatically. Also shells out to `skill_advisor.py --dump-routing-maps` (line ~638) — a direct Stage C.1↔C.5 cross-dependency, both must land together. `routing-registry-drift-guard.vitest.ts` also calls the same `--dump-routing-maps`/`--check-routing-projection` CLI surface AND independently hardcodes its own `registryPath` (`.opencode/skills/deep-loop-workflows/mode-registry.json`, line ~26) plus a canonical-compare literal `skill: 'deep-loop-workflows'` (line ~76) — this file was under-scoped in the original Stage D.3 wording (only mentioned `registryPath`); both literals in it must be updated together with Stage C.1/C.5.
6. `render-command-contract.cjs` + `compile-command-contracts.cjs` (now under `system-deep-loop/runtime/scripts/`): verified their own script bodies are ALREADY current (no old-name literals — they use fresh `system-deep-loop` paths post-002). The real Stage C.6 work is downstream: the **generated/compiled contract output files** (`.opencode/commands/deep/assets/compiled/{deep_research,deep_review,deep_ai-council}.contract.md`) still embed old paths in their `GENERATED_COMMAND_CONTRACT_HEADER` (`generatedBy`, source `path` fields) from before 002 — these regenerate via Stage E's `compile-command-contracts.cjs` run, not a hand-edit here.
7. Pre-commit hook (`.opencode/hooks/pre-commit`, `MIRROR_CHECKER` line ~40) + GitHub Actions workflow (`.github/workflows/agent-mirror-sync.yml`, `CHECKER` line ~17) — edited as a matched pair, confirmed. **Not semantically identical**: local hook fails OPEN when node/checker missing and filters only `.opencode|.claude`; CI fails CLOSED on missing checker and filters `.opencode|.claude|.codex` — preserve this asymmetry, only the hardcoded path changes. `.opencode/hooks/README.md` (line ~52) documents the same stale checker path and must be updated alongside this pair (was missing from the original plan).
8. **New (found via verification, not in original 7-site plan): `.gitignore`** (lines 166-171) — has real, active `deep-loop-runtime` DB-artifact ignore rules (`*.sqlite`, `*.sqlite-shm`, `*.sqlite-wal`, `*.sqlite.bak*`) under the old runtime path. Must repoint to `system-deep-loop/runtime/database/` or the moved DB files will stop being ignored.
9. **New (found via verification): doctor command assets are a Stage-E-shaped gap not covered by the original Stage E wording**, which only named `.opencode/commands/deep/assets/*.yaml`. Also needing the same compiled-contract-style treatment: `.opencode/commands/doctor/_routes.yaml`, `.opencode/commands/doctor/scripts/parent-skill-check.cjs` (`DEFAULT_TARGET`, covered above as C.5), `.opencode/commands/doctor/assets/{doctor_deep-loop.yaml, doctor_update.yaml, doctor_parent-skill.yaml}`.

**Stage D — Structured identity fields + codegen** (depends on B+C):
1. `mode-registry.json`/`hub-router.json` `skill` fields, `description.json` name/keywords, both `SKILL.md` frontmatter, moved folders' own `graph-metadata.json` self-references.
2. Run `skill_advisor.py --emit-routing-projection` — regenerates `aliases.ts`'s generated block AND `skill_advisor.py`'s own hash block in one pass.
3. Update `routing-registry-drift-guard.vitest.ts`'s hardcoded `registryPath` constant.

**Stage E — Compiled command-contract regeneration** (depends on C.6/D):
1. Update `skill:`/`skill_md:` frontmatter in 8 source YAML assets under `.opencode/commands/deep/assets/*.yaml`.
2. Update 3 router `.md` one-liners (`deep/review.md`, `research.md`, `ai-council.md`).
3. Run `compile-command-contracts.cjs` — never hand-edit the compiled output (embedded content hash).
4. `.claude/commands -> .opencode/commands` is a real symlink — edit once.

**Stage F — Prose/docs** (parallel-safe once B's paths exist): agents (`.opencode/agents/**` + `.claude/agents/**`, real non-symlinked duplicate confirmed via `ls -la`/`readlink`, per-file scoped grep verification not a blanket diff — verified pair: `orchestrate.md`, `deep-research.md`, `ai-council.md`, `deep-review.md`, `deep-improvement.md`, each independently touched), root README + 6 others, `system-spec-kit`'s constitutional doc + references (verified: `SKILL.md`, `README.md`, `ENV_REFERENCE.md`, `constitutional/deep-skill-workflow-required.md`, `references/structure/folder_structure.md`, `references/workflows/{intake_contract,agent-io-contract}.md`, plus its `manual_testing_playbook/**` prose — ~15 files), cross-skill "related skills" prose (`sk-design`, `cli-opencode`, `sk-code`, `sk-prompt-models`, `sk-doc`, `system-code-graph` — the last two were missing from the original plan's named list; `system-code-graph`'s own `feature_catalog/`+`manual_testing_playbook/` account for ~7 files alone). **Note**: `.opencode/hooks/pre-commit`, `.opencode/plugins/mk-deep-loop-guard.js`+test, and doctor scripts/assets are executable/config, not prose — they belong to Stage C.4/C.5/C.9 above, not this stage, even though a naive grep sweep would surface them here too.

**Stage G — Sibling `graph-metadata.json` edges** in `system-spec-kit`, `system-skill-advisor`, `cli-opencode`, `sk-code`, `sk-prompt`. Where a graph carries two separate edges (one to each old skill), collapse to one edge, not a duplicate. Verified per-file (2026-07-08): `system-spec-kit` carries edges to BOTH old names — collapse to one. `cli-opencode` has duplicate `deep-loop-workflows` entries within its own `manual.related_to` list — collapse duplicates, no `deep-loop-runtime` edge found. `system-skill-advisor` has repeated `deep-loop-workflows` edges (no `deep-loop-runtime` edge found in the inspected section). `sk-prompt` and `sk-code` each carry exactly one `deep-loop-workflows` edge (sibling / prerequisite respectively) — simple rename, no collapse needed.

**Stage H — Grandfather-example files** (spec.md §8 Decision): `parent_skills_nested_packets.md`'s hub matrix and `skill-parent.md`'s canonical-example sentence updated to `system-deep-loop`. `skill-parent.md`'s prefix-derivation example specifically needs its OTHER half swapped (not just the name substituted) since the equivalence "folder prefix == command-namespace prefix" now has one documented exception — add an explicit caveat sentence, apply the same fix to the 2 asset YAMLs.

**Stage I — Advisor routing corpus + re-baseline** (depends on C+D):
- Field-scoped replace confirmed SAFE (verified live 2026-07-08): old skill names appear ONLY in label/metadata fields across every corpus file checked, never in prompt text. Full file list (the original plan named only "the labeled corpus" — verification found 4 files, not 1):
  - `labeled-prompts.jsonl`: 53 rows, `skill_top_1` field only.
  - `ambiguity-prompts.jsonl`: 8 rows, `skill_top_1` field only — **not named in the original plan, must be included**.
  - `.../tests/scorer/fixtures/intent-prompt-corpus.ts`: 2 rows, `expectedSkill` field only — **not named in the original plan, must be included**.
  - `local-native-approved-divergences.json`: 25 entries total (exact count), nonuniform field distribution — `gold`: 18, `nativeTop`: 21, `reason`: 21 (prose mentions), plus exactly 1 entry with `nativeTop: "deep-loop-runtime"` specifically (the rest are `deep-loop-workflows`). Some entries also carry unrelated legacy MODE ids in `localTop` (e.g. `"deep-research"`, `"deep-review"`) — these are workflowMode values, not skill ids, and must NOT be touched by this rename.
- **Sequencing landmine (new finding, not in original plan)**: `aliases.ts`'s `MERGED_DEEP_SKILL_ID` (Stage C.2) is read live by the scorer to canonicalize predictions — after C.2 renames it, the scorer will predict `system-deep-loop` for every deep-loop-shaped prompt, while an UN-relabeled corpus still says `skill_top_1: "deep-loop-workflows"`, producing a false catastrophic accuracy regression on every threshold check run in the gap. Stage C.2 and this stage's corpus relabel MUST land in the same atomic commit — never leave a checkpoint where one is applied without the other, and never run `score-routing-corpus.py --min-advisor-accuracy` in that intermediate state.
- `local-native-approved-divergences.json`: run the ratchet test post-rename, let it fail and print its mismatch diff, hand-verify each flagged mismatch is the expected rename, then update `nativeTop`/`localTop`/`reason`/`approvedAt` together per entry — mirrors the existing 2026-06-15 re-baseline entry's own pattern (verified template: `{id, corpus, promptHash, gold, localTop, nativeTop, reason, approvedAt}`).
- `scorer-eval-baseline-ratchet.vitest.ts` pins SHA256 hashes of `labeled-prompts.jsonl`/`holdout-prompts.jsonl`/`ambiguity-prompts.jsonl` against `scorer-eval-baseline.json` — ANY edit to those files breaks the hash pin. Re-baseline IS script-driven (confirmed, not manual paste): `node capture-scorer-eval-baseline.mjs --write`. Current committed baseline for reference: full_corpus_top1 147/193 (0.7617), holdout 60/78 (0.7692), ambiguity 15/25 (0.6), review 22/32, memory_save 25/32, delegation 11/11.
- `python-ts-parity.vitest.ts` is a SEPARATE, MORE MANUAL risk than the ratchet test — it has no capture script. It hardcodes raw expect() numbers (`pythonCorrect=106`, `tsAlsoCorrect=103`, 3 named `ACCEPTED_PARITY_REGRESSION_IDS`) and uses raw equality with no alias-folding, unlike the ratchet. Re-baseline procedure: run the test, read its logged `advisor-parity-report`, hand-verify the new numbers are rename-only (not a real scoring regression), then hand-edit the hardcoded expect() values and the accepted-ID list.
- `score-routing-corpus.py --min-advisor-accuracy <Stage-A baseline>` to prove the number held — flag confirmed real and process-exit-code-gating (`report["overall_pass"]` / exit 1 on failure), Stage-A baseline = 0.3679 (71/193 correct) via `research/stage-a-advisor-baseline.json`.

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
