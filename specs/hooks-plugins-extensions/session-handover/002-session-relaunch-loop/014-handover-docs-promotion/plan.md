---
title: "Implementation Plan: Phase 14: handover-docs-promotion"
description: "Read the session-relaunch source docs, sweep every markdown surface for the feature and its old wording, then add a plain highlight, a setup section and correct links where a reader looks for how sessions start."
trigger_phrases:
  - "handover docs promotion plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: handover-docs-promotion

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and one plain-text index |
| **Framework** | sk-doc: sk-create-readme for READMEs, sk-create-with-human-voice for prose |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `audit_readmes.py`, `sync-runtime-mirrors.cjs --check` |

### Overview
One lane. Read the session-relaunch README, the `bin/` README, the catalog entry and the playbooks for the facts. Grep every markdown surface for the feature and for wording that says the wrapper starts by hand. Edit the root README first, then the smaller surfaces, then run the validators against a baseline taken before the first edit.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The root README sells the feature in plain words and hands the detail to the session-relaunch README. Smaller surfaces carry one sentence and a link, so the protocol lives in one place.

### Key Components
- **Summary bullet**: one line in What's Inside, no jargon.
- **Endless Sessions subsection**: what happens, which runtimes, the bound-packet save and the fallback.
- **Turn On Endless Sessions**: the `source` line, what the shim wraps, the Hermes switch, the threshold, the off switch, the stalled-hop notice and the note versus `handover.md`.
- **Command library entry**: `/speckit:handoff` with the corrected count.

### Data Flow
The facts flow one way: the session-relaunch README and the phase 013 evidence into the root README, and the root README's Quick Start anchor into the command entry, the Hermes note and the FAQ.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Root README | First doc a reader opens | update | `validate_document.py`, `hvr_scan.py`, `audit_readmes.py` |
| system-spec-kit README continuity table | Lists the relaunch next to `handover.md` | update | `validate_document.py`, `hvr_scan.py` |
| `/speckit:handoff` command | Manual trigger contract | update | `validate_document.py`, `hvr_scan.py`, mirror check |
| Commands index | Lists every command file | update | read back |
| Hooks README, `bin/` README, env reference, catalog entry, three playbooks, OpenCode plugins README | Already describe the shim and the outside-loop rule | unchanged | grep sweep |
| `AGENTS.md` | Gate 3 exemption for handoff notes | unchanged, gate rule | grep sweep |

Required inventories:
- Surfaces naming the feature: `rg -l -i "skilled-loop|speckit:handoff|speckit-handoff|session-relaunch|session relaunch" -g '*.md' -g '!specs/**'`.
- Old wording: `rg -n -i "auto-compaction|context limit|handoff note|start the wrapper|by hand" -g '*.md' -g '!specs/**'`.
- Command count: `find .skilled/commands -name '*.md' -not -name README.md | grep -v assets` lists 40 files.
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
| Structure | Every touched markdown doc | `validate_document.py` |
| Voice | Every touched markdown doc, against a pre-edit baseline | `hvr_scan.py` |
| References | Every README in the repository, filtered to touched files | `audit_readmes.py` |
| Mirrors | The command mirrors | `sync-runtime-mirrors.cjs --check` |
| Spec | This folder and the parent | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 013 shim and live hops | Internal | Green | The docs would describe unproven behavior |
| sk-doc validators | Internal | Green | No structure or voice check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a doc states a fact the code contradicts.
- **Procedure**: revert the phase commit. No code or data depends on these docs.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read sources ──► Grep sweep ──► Root README ──► Other surfaces ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Read sources | None | Grep sweep |
| Grep sweep | Read sources | Edits |
| Edits | Grep sweep | Verify |
| Verify | Edits | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read four source docs |
| Core Implementation | Low | Four files |
| Verification | Low | Four validators and the spec gate |
| **Total** | | **About an hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no data changes
- [x] Feature flag configured: not applicable, documentation only
- [x] Monitoring alerts set: not applicable, documentation only

### Rollback Procedure
1. Revert the phase commit.
2. Rerun `validate_document.py` on the reverted docs.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
