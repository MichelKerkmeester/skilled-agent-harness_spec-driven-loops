---
title: "Implementation Plan: Phase 5: filename-underscore-alignment [template:level_1/plan.md]"
description: "Rename sk-prompt-models dash-named docs/assets to underscores with git mv, repair live references in one controlled pass (path-qualified for the context-budget name collision), then verify with the drift guard and strict validate."
trigger_phrases:
  - "filename underscore alignment plan"
  - "rename references update pass"
  - "context-budget collision path-qualified"
  - "phase 005 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/023-kimi-k2-7-code-support/005-filename-underscore-alignment"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Renamed 7 targets (git mv), repaired ~27 live reference files, drift guard exit 0"
    next_safe_action: "Phase complete; strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model_profiles.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-005-filename-underscore-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: filename-underscore-alignment

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON docs; bash `git mv` + `sed` |
| **Framework** | spec-kit phase folder; pre-commit drift guard (python in bash) |
| **Storage** | Files in `.opencode/skills/sk-prompt-models` and cross-skill references |
| **Testing** | `check-prompt-quality-card-sync.sh` + `validate.sh --strict` + live-wiring grep |

### Overview
A mechanical filename-convention change with a verification gate. Rename 5 markdown files and 2 JSON assets dash to underscore (`git mv`, history preserved), then repair every live inbound reference in one controlled pass. The only subtlety is the `context-budget.md` name collision (cli-opencode owns a file of the same name), handled with a path-qualified replacement so cli-opencode's own file is never touched. The four model-profile filenames are excluded by a drift-guard contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (drift guard + strict validate)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Rename-and-repair. The renames are data; the reference updates keep every pointer valid.

### Key Components
- **Rename set**: 5 markdown (`confidence-scoring-rubric`, `context-budget`, `output-verification`, `pattern-index`, `quota-fallback`) + 2 JSON (`model-profiles`, `per-model-budgets`)
- **6 globally-unique names**: replaced by full filename token across the live file list (extension-anchored to avoid matching model ids or prose)
- **`context-budget` collision**: replaced only as the path-qualified `sk-prompt-models/references/context-budget.md`, plus two targeted same-skill relative links; cli-opencode's file and the links to it stay
- **Functional consumer**: `check-prompt-quality-card-sync.sh:116` `json.load(... model_profiles.json)`

### Data Flow
`git mv` renames the files; the sed pass rewrites references in the skill, the cli-* executors, the pre-commit hook, the permissions configs, and the root README; targeted edits fix the two same-skill `context-budget` links; the drift guard and strict validate confirm nothing dangles.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Rename
- [x] `git mv` the 5 markdown files dash to underscore
- [x] `git mv` the 2 JSON assets (`model_profiles.json`, `per_model_budgets.json`)

### Phase 2: Repair references
- [x] Replace the 6 unique filenames across the live file list
- [x] Path-qualified replace for `sk-prompt-models/references/context-budget.md`; two targeted same-skill link edits
- [x] Update the functional drift-guard `json.load` path

### Phase 3: Verify
- [x] Drift guard exit 0; live-wiring grep clean; JSON validity check
- [x] Parent phase map row + `children_ids`; strict validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Functional | Drift guard loads the renamed registry and resolves all 4 model profiles | `check-prompt-quality-card-sync.sh .` |
| Reference integrity | No stale dash references in live wiring | `rg` over live files (excl. specs/changelogs/caches) |
| Data integrity | Both renamed JSONs parse; profile_ref still points at dashed model files | `python3 json.load` + `rg profile_ref` |
| Structure | Phase folder validates | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `check-prompt-quality-card-sync.sh` | Internal | Green | Defines the model-profile filename contract; sets which files cannot be renamed |
| `git mv` | Tooling | Green | History-preserving rename not possible |
| Live-wiring grep inventory | Internal | Green | Cannot prove zero stale references |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A renamed file breaks a consumer not caught by the drift guard, or a reference is found dangling.
- **Procedure**: `git mv` the affected file back to its dashed name and revert the matching reference edits; the change is mechanical and fully reversible from git history.
<!-- /ANCHOR:rollback -->
