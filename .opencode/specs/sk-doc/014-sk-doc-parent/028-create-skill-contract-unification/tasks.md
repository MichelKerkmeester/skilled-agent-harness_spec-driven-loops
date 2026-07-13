---
title: "Tasks: create-skill contract unification"
description: "Author the contract, unify validation, unify generation, verify."
trigger_phrases:
  - "028 tasks create-skill contract unification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
    last_updated_at: "2026-07-13T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the task breakdown"
    next_safe_action: "Resolve the description-budget fork, then start Phase 1"
---
# Tasks: create-skill contract unification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row names its work unit and gate. This is a PLAN packet — all tasks are pending until execution begins.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Re-verify all nine findings' file:line anchors against HEAD; capture baseline (`package_skill.py --check` create-skill = valid:true/2 warns; sk-doc = valid:true/4 warns; `parent-skill-check.cjs` sk-doc = 0/0)
- [ ] T002 WU1 — author `create-skill/contract.json` from the union of `package_skill.py` + `quick_validate.py` + `assets/` rules (section order, description budget, RULES subsections, `allowed-tools` array rule, packet kinds + per-kind required files)
- [ ] T003 WU1 — dual-language loader test: Python and Node both read the contract; assert `assets/skill/skill_md_template.md` section order equals the contract
- [ ] T004 WU7-PREP — stand up the nine fixture dirs (valid standalone; bad frontmatter; scalar `allowed-tools`; warning-only; workflow-only parent; surface parent; transport parent; duplicate `tieBreak`; hidden-dir + output-inside-source packaging)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T005 WU2 — add `package_skill.py --check --strict`; promote contract-required items (description budget, RULES subsections, resource frontmatter, smart-router markers, placeholder examples) to failures; keep warning mode default
- [ ] T006 WU3 — kind-aware completion dispatcher: standalone → package check; parent → package check + `parent-skill-check.cjs`; repoint the documented completion command
- [ ] T007 WU5 — exact-structure parsing: YAML frontmatter parse; real `allowed-tools` array; exact H2 match (strip numbering/emoji); nested `name` vs `packetSkillName`; `tieBreak` exact permutation
- [ ] T008 WU4 — render `init_skill.py` from `assets/`; remove the embedded `SKILL_TEMPLATE`; add `--kind {standalone,parent}` scaffolding the hub skeleton from `assets/parent_skill/`
- [ ] T009 WU6 — render parent templates conditionally from declared packet types: `surfaceBundle` only with surfaces; computed tool union; drop the unrequired root `README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T010 WU7 — full fixture suite green: golden (canon-clean) pass; each mutant reds exactly its rule; ZIP edges (hidden-ancestor exclusion, output-not-archived) proven
- [ ] T011 Regression — `parent-skill-check.cjs` stays 0/0 on sk-doc after every WU; `package_skill.py --check` on create-skill still green
- [ ] T012 `validate.sh --strict` Errors:0 on every touched spec folder; fleet audited under `--strict` before strict is made a completion requirement
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
One contract is the single source; `init_skill.py` renders from assets and supports `--kind parent`; strict mode fails on the demoted requirements; the completion gate is kind-aware; exact parsing replaces substring/regex; all gates green. Not met (plan authored; execution pending).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `./spec.md`, `./plan.md`, `./checklist.md`, `./decision-record.md`
- `../create-skill-findings.md` (source audit)
- `.opencode/skills/sk-doc/create-skill/scripts/{init_skill.py,package_skill.py}`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
<!-- /ANCHOR:cross-refs -->
