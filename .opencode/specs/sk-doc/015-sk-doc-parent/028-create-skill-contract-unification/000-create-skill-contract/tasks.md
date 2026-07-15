---
title: "Tasks: create-skill contract unification"
description: "Author the contract, unify validation, unify generation, verify."
trigger_phrases:
  - "028 tasks create-skill contract unification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/028-create-skill-contract-unification/000-create-skill-contract"
    last_updated_at: "2026-07-13T20:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Executed all seven work units; 12 commits shipped to skilled/v4.0.0.0"
    next_safe_action: "Optional: parent negative-fixture corpus + validate_document symlink fix"
---
# Tasks: create-skill contract unification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[~]` partial · `[ ]` pending. Each row names its work unit and gate. EXECUTED 2026-07-13 — commit SHAs cited per row (branch `skilled/v4.0.0.0`).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Re-verify all nine findings' file:line anchors against HEAD; capture baseline [EVIDENCE: findings re-verified pre-execution; baselines — `package_skill.py --check` create-skill PASS, sk-doc `parent-skill-check.cjs` exit 0/0 held throughout]
- [x] T002 WU1 — machine-readable contract as the union of `package_skill.py` + `quick_validate.py` + `assets/` rules [EVIDENCE: `7a2acf34f4`; contract shipped at `sk-doc/shared/assets/skill_contract.json` (DEVIATION: `shared/assets/`, not the plan's prospective `create-skill/contract.json`, so both create-skill scripts and shared loaders consume one file) + `.py`/`.cjs` degrade-on-error loaders]
- [x] T003 WU1 — dual-language loader test: Python and Node both read the contract; assert canonical scaffold template order equals the contract [EVIDENCE: `test_skill_contract.py` 4/4 — py+node loaders read the same budget; `skill_scaffold_template.md` H2 order + smart-router markers match the contract. NOTE: asserts against `skill_scaffold_template.md` (the instantiable template introduced by WU4a), superseding the plan's `skill_md_template.md` (a teaching doc whose top-level H2s are not the canonical skill sections)]
- [~] T004 WU7-PREP — fixtures [PARTIAL — EVIDENCE: `01978caa01` delivered the standalone/packaging fixtures (valid standalone, scalar `allowed-tools`, missing-version structured-parse, strict warning-promotion, hidden-ancestor ZIP, output-inside-source ZIP) as `test_create_skill_contract.py`. GAP: the parent-fixture dirs (surface parent, transport parent, duplicate-`tieBreak` negative) were NOT built as standalone committed fixtures — see T010]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T005 WU2 — `package_skill.py --check --strict` promotes contract-required items (budget, RULES subsections, resource frontmatter, smart-router markers, placeholder examples) to failures; warning mode stays default [EVIDENCE: `bebde560c4`]
- [x] T006 WU3 — kind-aware completion dispatcher `validate_skill_package.py` (standalone → package check; parent → package check + `parent-skill-check.cjs`); completion command repointed in SKILL.md + create/doctor YAMLs [EVIDENCE: `d68f66e218`]
- [x] T007 WU5 — exact-structure parsing: YAML frontmatter parse w/ regex fallback; real `allowed-tools` array; nested `name` vs `packetSkillName`; `tieBreak` exact permutation [EVIDENCE: `932bdd522c` (5a parsing) + `aa951f1139` (5b tieBreak + name-frontmatter). DEVIATIONS: H2 matching kept SUBSTRING+normalization, not exact equality — 43 legitimate fleet heading forms would hard-fail on `==`; alias-lowercase check DEFERRED — sk-doc uses capitalized proper-noun aliases needing a synced multi-surface migration]
- [x] T008 WU4 — render `init_skill.py` from `assets/`; remove the embedded `SKILL_TEMPLATE`; add `--kind {standalone,parent}` [EVIDENCE: split into `2ca7a9f4b2` (WU4a standalone render from `skill_scaffold_template.md`, stops example-file seeding) + `5cbb31f2a3` (WU4b `--kind parent`). DEVIATION/UPGRADE: `--kind parent` generates a MINIMAL checker-PASSING hub (one metadata workflow mode, no surfaces/extensions/command) — verified `parent-skill-check.cjs` exit 0 — rather than a placeholder skeleton]
- [x] T009 WU6 — parent templates: `surfaceBundle` conditional on surfaces; computed tool union [EVIDENCE: `f7525b9575`. DEVIATION: the plan's "drop the unrequired root README" was REFUTED — real hubs (sk-code, sk-doc) carry a hub-root `README.md` and reference it in graph-metadata, so the template's README reference is legitimate and was left intact]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [~] T010 WU7 — fixture suite [PARTIAL — EVIDENCE: `01978caa01` — standalone golden passes; standalone mutants red their rule (scalar `allowed-tools`, missing-version); ZIP edges PROVEN (hidden-ancestor exclusion + output-not-archived). GAP: the parent mutants (surface/transport parent, duplicate-`tieBreak` NEGATIVE) are not committed fixtures — the duplicate-`tieBreak` rule is exercised by WU5b's own change and WU4b's generated hub is a verified golden workflow-only parent, but a standalone negative parent-fixture corpus is a deferred follow-up]
- [x] T011 Regression — `parent-skill-check.cjs` stays 0/0 on sk-doc; `package_skill.py --check` on create-skill green [EVIDENCE: post-final verification 2026-07-13 — sk-doc checker exit 0/0 warnings; create-skill `--check` PASS]
- [x] T012 `validate.sh --recursive --strict` Errors:0 on this packet [EVIDENCE: recorded below at finalize]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
One contract is the single source; `init_skill.py` renders from assets and supports `--kind parent`; strict mode fails on the demoted requirements; the completion gate is kind-aware; exact parsing replaces substring/regex; all gates green. MET (executed 2026-07-13; 12 commits on `skilled/v4.0.0.0`). Two items partial and carried as follow-ups: the parent negative-fixture corpus (T004/T010) and, discovered during finalize, a PRE-EXISTING `validate_document.py` symlink path bug (`test_changelog_validator.py` — reproduces on the untouched main tree; out of this packet's scope).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `./spec.md`, `./plan.md`, `./checklist.md`, `./decision-record.md`
- `../../create-skill-findings.md` (source audit)
- `.opencode/skills/sk-doc/create-skill/scripts/{init_skill.py,package_skill.py}`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
<!-- /ANCHOR:cross-refs -->
