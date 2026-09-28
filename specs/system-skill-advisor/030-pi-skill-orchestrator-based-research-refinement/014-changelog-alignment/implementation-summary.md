---
title: "Implementation Summary: Changelog Alignment for the Skill Advisor Work"
description: "The skill advisor changelog now uses four-part names and the contract's titles, and nine new entries across eight changelog folders record what the advisor work shipped since 2026-09-12. The v4.0.0.2 release notes gain the same story, and two fresh reviews checked every new claim against its commit."
trigger_phrases:
  - "changelog alignment summary"
  - "advisor changelog four-part rename"
  - "packet 030 changelog entries"
  - "skill advisor release notes section"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/014-changelog-alignment"
    last_updated_at: "2026-09-28T12:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Applied the checked review findings and ran the final gates"
    next_safe_action: "None. The commit and the push close the phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/changelog/v0.11.2.0.md"
      - ".skilled/skills/system-skill-advisor/changelog/v0.12.0.0.md"
      - ".skilled/changelog/skilled/v4.0.0.2.md"
      - "evidence/review/verification.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-28-030-phase-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Changelog Alignment for the Skill Advisor Work

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-changelog-alignment |
| **Completed** | 2026-09-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill advisor's changelog now follows the sk-create-changelog contract, and every change the advisor work shipped since 2026-09-12 has an entry in the changelog of the component it changed. The v4.0.0.2 release notes tell the same story.

### Phase 14: changelog-alignment

**The advisor changelog.** Ten entries took four-part file names with `git mv`, and their titles, identity phrases and in-body advisor versions followed. v0.11.0.0 and v0.11.1.0 took the contract title with their identity phrases first, and v0.5.0.0 took the contract H1 and two short topic phrases. Their prose is unchanged.

**Two new advisor entries.** v0.11.2.0 records what shipped between v0.11.1.0 and packet 030, across Skilled v4.0.0.0 and v4.0.0.1. That covers the move to `.skilled`, the skill brief every hook runtime lost in v4.0.0.0 and got back in v4.0.0.1, the OpenCode status tool, the plugin cache below the checkout root, two-character executor names and compiled routes for two more hubs. v0.12.0.0 records the packet 030 hook work in the expanded format.

**Seven component entries.** system-spec-kit v4.1.4.0, deep-loop runtime v1.5.1.0, deep-review v1.11.1.0, deep-research v1.15.1.0, cli-codex v1.9.5.0, cli-external-orchestration v1.7.1.0 and sk-code-opencode v1.0.1.0 each record packet 030's change to that component. Each `SKILL.md` took its new version, the cli-external-orchestration hub restated it in its four root artifacts, its route manifest was re-minted and the seven Hermes copies were rebuilt.

**The release notes.** v4.0.0.2 gains a skill advisor sentence in its opening, a Why paragraph, a glance bullet, sections for the skill advisor, the deep loops and editing in Pi, and four upgrade notes.

**The reviews.** Two fresh Opus reviews found 35 problems, and the orchestrator checked each against its source. 32 held as stated, one held in part and two were judgment calls kept with their reasons. The orchestrator's own trace of all 48 advisor commits added three changes no entry recorded, and dating each fix against the release tags rewrote two bullets that described states no release carried.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/changelog/v0.1.0.0.md` to `v0.10.0.0.md` | Renamed and modified | Four-part names, with titles, identity phrases and the advisor versions in the text to match |
| `.skilled/skills/system-skill-advisor/changelog/v0.11.0.0.md`, `v0.11.1.0.md` | Modified | Contract titles with the identity phrases first |
| `.skilled/skills/system-skill-advisor/changelog/v0.11.2.0.md`, `v0.12.0.0.md` | Created | The two missing advisor entries |
| Seven component `changelog/` folders | Created | v4.1.4.0, v1.5.1.0, v1.11.1.0, v1.15.1.0, v1.9.5.0, v1.7.1.0 and v1.0.1.0 |
| Seven `SKILL.md` files and their `.hermes/skills/*/SKILL.md` copies | Modified | The version of each newest entry |
| `cli-external-orchestration/{ROUTER.md,description.json,hub-router.json,mode-registry.json}` | Modified | The hub version |
| The cli-external-orchestration route manifest and its authored copy under `specs/sk-doc/019-skill-routing-refactor/` | Modified | Re-minted for the new hub version |
| `.skilled/changelog/skilled/v4.0.0.2.md` | Modified | The skill advisor work |
| `../goal.md`, `../spec.md`, `../graph-metadata.json` | Modified | The phase 14 binding, the shortened decisions, the phase map row and the refreshed metadata |
| `evidence/` | Created | Baselines, entry checks, the commit trace, the two reviews with the verification record, the final gates and strict validation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each entry was written from commit bodies and phase summaries, then run through `validate_document.py` and `hvr_scan.py`. Two fresh Opus 5.5 reviewers at high effort checked the new entries and the release-note lines against the commits. Their briefs named the sources and the answer shape and carried no expected conclusion. The orchestrator checked every finding against its source before changing anything, applied the ones that held and recorded a verdict for each in `evidence/review/verification.md`. The final gates and strict validation ran from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two advisor entries, not one | v4.0.0.0 shipped the source-root move and v4.0.0.1 the fixes that followed, so that window gets v0.11.2.0 and packet 030 gets v0.12.0.0 |
| A bullet describes the change between tagged releases | Two fixes landed a day after the bug they fixed and before any tag, so a story told from the commits alone would describe a state no user met |
| The Codex installer change is not marked Breaking | Nothing runs the installer in write mode on its own, the documented setup already trusts the checkout and the upgrade note puts the trust step first. Marking it Breaking would make cli-codex 2.0.0.0 |
| The installer change stays in cli-codex | No changelog component owns `.skilled/bin`, and cli-codex's hook contract documents the installer |
| The release notes keep their four earlier topic phrases | The contract allows one or two, but cutting them would rewrite another packet's release metadata, so the phrase this phase added came out instead |
| Legacy entries keep their prose | Decision D1. Alignment touched only names, frontmatter, headings and advisor versions |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Entry checks | 22 of 22 entries valid with 0 issues and 0 hard HVR findings, and no three-part advisor name left (`evidence/entry-checks.txt`) |
| Links | The 8 relative links in the 22 entries resolve |
| Frontmatter version gate | 2,960 files checked, exit 0 |
| Route guard | `All hubs fresh or excused` (`evidence/final-gates.txt`) |
| Hermes check | `PASS: 71 Hermes skill copies in sync` |
| Parent-skill check | OK for cli-external-orchestration, system-deep-loop and sk-code |
| Routing replays | Three route as before, and the one that defers predates this work, since the hub inputs changed only their version |
| Strict validation | `RESULT: PASSED` on packet 030 with `--strict --recursive` (`evidence/strict-validate.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two docs still call the hook's fallback warm-only.** System-spec-kit `feature-catalog/tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md:28` and the advisor's `feature-catalog/cli-surface/skill-advisor-cli.md:57` are outside this phase's scope. The entries no longer claim they were fixed.
2. **The v4.0.0.2 release entry keeps four topic phrases.** One of them, "v4.0.0.2 goal changes", carries a version number. The contract allows one or two phrases without a number, and the phrases belong to the goal work's release metadata.
3. **35 entries in other skills title themselves `<component> changelog v<version>`.** That fleet drift is outside the advisor work.
4. **The pi-cache-optimizer fix has no component changelog.** No component exists for it and the contract forbids creating one, so the release notes carry it alone.
5. **No third reviewer read the final text.** The fixes were checked against their sources and rerun through the validators.
<!-- /ANCHOR:limitations -->

---
