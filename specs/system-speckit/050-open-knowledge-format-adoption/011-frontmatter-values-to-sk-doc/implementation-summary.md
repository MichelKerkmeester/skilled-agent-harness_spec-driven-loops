---
title: "Implementation Summary: Phase 11: frontmatter-values-to-sk-doc"
description: "The contextType and importance_tier value list now lives in sk-create-frontmatter, the session list stays in spec-kit, and all four readers load the new file with every check identical to its baseline."
trigger_phrases:
  - "frontmatter values move summary"
  - "value list owner change"
  - "session list literal"
  - "missing value file behavior"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/011-frontmatter-values-to-sk-doc"
    last_updated_at: "2026-10-04T20:05:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Moved the value list and reran every check"
    next_safe_action: "Operator reviews the diff and decides the commit"
    blockers: []
    key_files:
      - "decision-record.md"
      - "scratch/run-checks.sh"
      - "scratch/baseline/"
      - "scratch/after/"
      - "scratch/missing-file.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 11: frontmatter-values-to-sk-doc

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-frontmatter-values-to-sk-doc |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The list of legal `contextType` and `importance_tier` values now lives with the skill that owns the frontmatter contract: `sk-doc/sk-create-frontmatter/assets/frontmatter-values.json`. spec-kit, sk-doc and the skill advisor all read it there. The 11 session context types, which classify saves, stay in spec-kit as a literal in `context-types.ts`. No value changed, and every check gives the result it gave before.

### Phase 11: frontmatter-values-to-sk-doc

`context-types.ts` reads the file at run time, walking up from its own folder until it finds `sk-doc/sk-create-frontmatter/assets/frontmatter-values.json`. A static JSON import cannot cross the shared build's `rootDir`. The walk works from `shared/` and from the built `shared/dist/` alike. The other three readers changed their path and dropped the old `document` level, since the file now holds `contextType` as `{canonical, aliases}` directly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json` | Created | Document values, tiers and their aliases |
| `.skilled/skills/system-spec-kit/shared/frontmatter-values.json` | Deleted | Backed up first to `scratch/baseline/old-shared-frontmatter-values.json` |
| `.skilled/skills/system-spec-kit/shared/dist/frontmatter-values.json` | Deleted | Stale build copy the old `include` produced, backed up beside the other |
| `.skilled/skills/system-spec-kit/shared/context-types.ts` | Modified | Runtime walk-up read, session list as a literal |
| `.skilled/skills/system-spec-kit/shared/tsconfig.json` | Modified | JSON dropped from `include` |
| `runtime/cli/rules/check-frontmatter-values-helper.cjs`, `.sh`, `lib/validator-registry.json` | Modified | New path in the reader, its comment, its remediation text and the rule description |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `scripts/tests/test_frontmatter_values.py` | Modified | New path and owner comment |
| `.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs` | Modified | New path |
| `sk-create-frontmatter/SKILL.md`, `README.md` | Modified | State that the mode owns the lists |
| Four speckit commands, two references, three catalog pages, two playbook pages, `frontmatter-templates.md`, four changelogs | Modified | Path and owner wording |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline came first (`scratch/run-checks.sh`, output in `scratch/baseline/`). SWE 2 max then made four changes through cli-devin, each with a short brief naming the file, the edit and the check (`scratch/dispatch/`). Change A, the new file and the TypeScript reader, was verified here before B, C and D went out in parallel, since those three touch separate files. The old file was deleted only after every reader passed on the new one. The docs were edited here.

**Before and after** (`scratch/baseline/` and `scratch/after/`):

| Check | Baseline | After |
|-------|----------|-------|
| Shared tests | 18 passed, 0 failed | 18 passed, 0 failed |
| CLI vitest, `--project cli` | 1,671 passed, 19 skipped, 0 failed | 1,671 passed, 19 skipped, 0 failed |
| sk-doc `test_frontmatter_values.py` | 7/7 | 7/7 |
| Advisor `skill-doc-frontmatter-checker.vitest.ts` | 2 passed | 2 passed |
| `context-types` exports from source and from `dist` | Dumped | Byte-identical to the baseline |
| Corpus sweep, 22,782 docs | 7 warnings per checker | The same 7, line for line |

The 7 corpus warnings are all in phase 008's cold model-writer docs (`008/scratch/model-writers/`), which carry off-list values on purpose and were written after phase 008's own sweep. They are the reason the criterion reads "same as baseline" rather than "0".

**Missing file** (`scratch/missing-file.txt`, the file moved aside and restored in the same command): the TypeScript module throws `frontmatter value list not found: sk-doc/sk-create-frontmatter/assets/frontmatter-values.json` from source and from `dist`, the rule helper exits 2 naming the full path, the advisor checker throws ENOENT naming the full path, and `validate_document.py` loads `None` and prints no warning, as its tests require. From a worktree the walk-up cannot reach the main checkout's copy, because no ancestor folder holds `sk-doc/` directly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the file at run time instead of importing it | `@spec-kit/shared` builds with `rootDir "."`, so a static import from another skill breaks the build |
| Keep the session list in spec-kit as a literal | It drives the save runtime's project phase and memory type, and no frontmatter uses it (`decision-record.md` ADR-001) |
| Flatten `contextType.document` to `contextType` | With the session list gone, the extra level names nothing |
| Copy phase 008's sweep with a load guard | The original writes into 008's evidence, and it would print 0 warnings if the Python reader silently lost the file |
| Leave past phase docs and `scratch/` naming the old path | They record what was true when written |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New file matches the old lists | PASS. Document values, document aliases, tiers and tier aliases equal; no session key |
| Old path gone | PASS. `test -e` exits 1; `rg` for the old path outside `specs/`, `dist/` and `node_modules/` finds nothing (`scratch/after/old-path-rg.txt`) |
| Exports, source and `dist` | PASS. Identical to the baseline; `tsc --build` exits 0 |
| Four test sets | PASS. Same counts as the baseline |
| Missing-file behavior | PASS. Three readers fail naming the new path; `validate_document.py` stays silent |
| Corpus sweep | PASS. Same 7 warnings per checker |
| Edited skill docs | PASS. `validate_document.py` exits 0 on six edited docs; frontmatter version gate ok on 2,984 of 2,992 files, 8 without frontmatter |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The walk-up assumes the skills folder layout.** A copy of `context-types.ts` run outside `.skilled/skills` finds no file and throws. That is the intended failure, but it names only the relative path it looked for.
2. **Nothing is committed.** Root decision D4 leaves the commit to the operator.
<!-- /ANCHOR:limitations -->
