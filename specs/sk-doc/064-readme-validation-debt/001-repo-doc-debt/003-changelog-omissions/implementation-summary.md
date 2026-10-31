---
title: "Implementation Summary"
description: "Fifty released changelog entries now say which scenario or decision they mean instead of quoting an internal id, and ten skills carry a patch entry that records this round."
trigger_phrases:
  - "changelog omissions implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/070-repo-doc-debt/003-changelog-omissions"
    last_updated_at: "2026-10-27T09:00:00Z"
    last_updated_by: "lane-e-conductor"
    recent_action: "Recorded what changed and how it was verified"
    next_safe_action: "Commit this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-e-repo-doc-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-changelog-omissions |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fifty released changelog entries now say which scenario or decision they mean instead of quoting an internal id, and ten skills carry a patch entry that records this round.

### Phase 3: changelog-omissions

A changelog reader cannot resolve `CX-008` or weigh "48 tests", so the omission rule keeps both out of prose. The fifty entries that broke it now name the scenario by its playbook title or the decision by its record, and test counts are gone while the claims they supported stay. Each of the ten skills this packet touched has a new patch entry, with its SKILL.md and hub routing files on the same version.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 50 entries under `.skilled/skills/*/changelog/` and `.skilled/skills/*/*/changelog/` | Modified | Ids reworded, test counts dropped |
| 10 new `changelog/v<next>.md` entries | Created | cli-external-orchestration 1.7.5.0, mcp-tooling 1.8.4.0, sk-code 3.9.3.0, sk-design 2.0.4.0, sk-doc 2.3.16.0, sk-git 1.9.8.0, sk-prompt 3.0.5.0, system-deep-loop 1.6.9.0, system-skill-advisor 0.17.5.0, system-spec-kit 2.12.4.0 |
| SKILL.md, description.json, mode-registry.json, hub-router.json | Modified | Version carriers |
| 10 `.hermes/skills/*/SKILL.md` copies | Regenerated | Version line, by `sync-skills-hermes.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Fourteen reword briefs and ten entry briefs ran through dispatch.sh on DeepSeek V4.1 Flash. Every word diff was read and a sample of id-to-name mappings was checked against playbook titles; archived decision records were read from git history. The sk-code entry was renumbered from 3.9.2.0 to 3.9.3.0 after another lane shipped 3.9.2.0 on main.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave `SHA-256` as written | It is a hash algorithm name that the id pattern happens to match; rewording it would make the entry less precise |
| Keep scenario counts such as "Three playbook scenarios" | A count of scenarios is a fact about coverage, not a test count; DeepSeek dropped two and they were restored |
| One patch entry per hub rather than per mode | The brief asked for one entry per skill, and a hub entry names the modes it covers |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Changelog check over 871 entries | 53 flagged before, 4 after, all `SHA-256` |
| `parent-skill-check.cjs` on six hubs | PASS, 0 warnings each |
| `sync-skills-hermes.cjs --check` | PASS, 67 copies in sync |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Four entries still trip the id check on `SHA-256`.** `sk-design-chart` v0.5.0.0, `system-deep-loop` v1.4.3.0, `deep-ai-council` v1.0.0.0 and the runtime v1.9.0.0. Teaching the check to skip algorithm names is a validator change.
2. **Hand corrections by the conductor.** DeepSeek invented a fact in `cli-opencode` v1.3.3.0, dropped scenario counts in two `sk-create-changelog` entries, and wrote imprecise wording in the new sk-design, sk-doc and sk-prompt entries; each was fixed by hand after one pass.
<!-- /ANCHOR:limitations -->
