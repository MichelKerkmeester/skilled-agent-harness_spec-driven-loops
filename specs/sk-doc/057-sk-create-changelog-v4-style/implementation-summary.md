---
title: "Implementation Summary"
description: "The /create:changelog skill now writes release notes in the v4 exemplar's narrative style, and a post-close review brought the contract, the command YAMLs and the exemplar into agreement so the exemplar passes every check the contract teaches."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/057-sk-create-changelog-v4-style"
    last_updated_at: "2026-09-23T07:04:05Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed open ends and drift after the review"
    next_safe_action: "Commit with the exemplar move and routing pins"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md"
      - ".skilled/skills/sk-doc/sk-create-changelog/SKILL.md"
      - ".skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md"
      - ".skilled/skills/sk-doc/sk-create-changelog/changelog/v1.1.0.0.md"
      - ".skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json"
    session_dedup:
      fingerprint: "sha256:9ac79662045130751bf265dffd2b51e3f41f295806b9e6bfda44d7c36a660d01"
      session_id: "scaffold-057-sk-create-changelog-v4-style"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 057-sk-create-changelog-v4-style |
| **Completed** | 2026-09-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `/create:changelog` skill now writes release notes in the narrative house style of the v4 exemplar instead of the machine-era table format. Generated changelogs open with why the release matters, name their sections for the domain they change, enforce voice and conciseness at validation time, and drop the file inventories, test metrics and schema churn no reader asked for.

### Rewrite sk-create-changelog template and workflow to the v4 narrative style

The shared template now defines a two-tier narrative format. Compact releases (under 10 changes, non-breaking) read as a summary narrative, What's New at a Glance bullets with bold lead-ins, and a two-sentence Upgrade. Expanded releases (10 or more changes, a major bump, or any breaking change) open with a multi-paragraph narrative, explain the motivation in Why This Release, then tell the story in topical H2 sections named for the domain they change, with benefit-led H4 story items separated by `&nbsp;` and inline Breaking markers, closing with Adopt/Repoint/Drop Upgrade Notes.

Voice, omission and structure are enforced, not suggested. The Human Voice scanner gates every generated changelog with zero hard blockers required, the validation section carries fourteen structural checks, an omission decision-aid decides what stays out by default, and tables appear only when the measured numbers themselves are the story. A cli-codex consistency review (gpt-5.6-luna, xhigh, read-only) confirmed nine inconsistencies between the new contract and the exemplar. All nine were fixed by relaxing the contract to the exemplar, which stays untouched as the canonical reference.

### Post-close review and remediation

A second review measured the exemplar against the contract's own checks and found the two still disagreed. Eleven of the exemplar's 44 H4 items ran past the 3-paragraph cap, the longest to seven, and one heading ran to ten words against a 2-7 rule that claimed the exemplar stopped at seven. The H4 ceilings are now 7 paragraphs and 10 words, with 1-3 paragraphs and 2-7 words kept as the norm, and the exemplar passes every structural check with zero violations.

The review also closed gaps the first pass left in the command surface. The at-a-glance bullets now use the exemplar's bold lead-in sentence instead of a double-dash shape the exemplar never uses. Both YAMLs had kept the 2-5 heading rule in seven places, still said "one to three domains" and "no H1", and never routed a breaking change to the expanded format. The GitHub release step stripped a title H1 but not the YAML frontmatter this packet had just allowed, so a changelog in the exemplar's shape would have published its frontmatter into the release notes. The template quoted the exemplar's alignment-mode sentence with its wording changed, and the worked example claimed to quote the exemplar when it paraphrases it. All of these are fixed.

### Open ends and drift closed

A third pass closed what the review had only reported. SKILL.md and `references/topology-edge-cases.md` still called the release mechanics undefined, although both command YAMLs define them in `step_7_publish_release`. Both now describe the tag, the three commands and the no-draft publish as the YAMLs run them, and the mechanics themselves are unchanged. The packet README still taught the plain-category vocabulary and said only `sk-git` releases, so it was brought in line with the contract. SKILL.md had moved to 1.1.0.0 with no matching packet changelog, so `changelog/v1.1.0.0.md` now records the release in the compact v4 format it teaches. The six child docs carry their derived frontmatter versions.

The same pass fixed drift the gates surfaced. The SKILL.md edits had moved the sk-doc routing policy hash, so both activation manifests were re-pinned and sk-doc serves compiled routing again. The Hermes mirrors for `sk-create-changelog` and `sk-design` were regenerated, and the Codex hooks were reinstalled after the session-start check flagged drift.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modified | Full rewrite to the two-tier v4 narrative shape, derived version 1.1.0.28 |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modified | Format contract, omission aid, voice rules, 14-check validation, success criteria, version 1.1.0.0 |
| `.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md` | Modified | Compact and expanded annotated examples rewritten in the new style |
| `.skilled/skills/sk-doc/sk-create-changelog/references/README.md` | Modified | Exemplar pointers updated, HVR violations fixed |
| `.skilled/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md` | Modified | Source-conflicts section rewritten to the reconciled contract, release flow described as the YAMLs run it |
| `.skilled/skills/sk-doc/sk-create-changelog/references/version-bump-rules.md` | Modified | Derived frontmatter version only |
| `.skilled/skills/sk-doc/sk-create-changelog/README.md` | Modified | Category vocabulary, validation and release ownership brought in line with the contract |
| `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.1.0.0.md` | Created | Packet changelog for the 1.1.0.0 release, in the compact v4 format |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modified | Template, category, discovery and format-check blocks reconciled to the narrative contract |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modified | Same reconciliation, mirrored |
| `.hermes/skills/sk-create-changelog/SKILL.md` | Regenerated | The generated Hermes copy of SKILL.md, rewritten from `sync-skills-hermes.cjs`'s own renderer for this one skill only |
| `.hermes/skills/sk-design/SKILL.md` | Regenerated | Operator-directed drift fix: the mirror still said sk-design had no compiled routing |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-doc/manifest.json` | Modified | Re-pinned to the policy hash of the edited SKILL.md |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | Modified | The promoted copy, byte-identical to the authored one |
| `~/.codex/hooks.json` (outside the repo) | Reinstalled | Operator-directed drift fix by the repo's installer, backup kept beside it |
| `specs/sk-doc/057-sk-create-changelog-v4-style/*` | Created | This packet's docs, this summary and the nested changelog entry |
| `specs/sk-doc/057-sk-create-changelog-v4-style/scratch/check-changelog-structure.py` | Created | The structural checks as a rerunnable script, so the positive and negative tests can be repeated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet docs came first, then the contract files, then validation. The template was rewritten, the SKILL.md contract sections were aligned to it, the worked examples were rebuilt in the new style, the reference touch-ups and the two command YAML reconciliations followed. One cli-codex review (gpt-5.6-luna, xhigh, read-only, dispatched via direct codex exec with the persona inlined) then audited template, SKILL.md and worked examples against the exemplar. It returned nine findings, all nine were confirmed against the files, and all nine were fixed in the template, the SKILL contract and the worked-example note. The packet's own strict validation initially failed on a missing template-source marker in spec.md and on stale generated metadata, both repaired (marker restored, the gate's prescribed repair tool applied), and the gate run returned RESULT: PASSED with 0 errors and 0 warnings.

A later edit to this summary left the generated metadata stale, and strict validation failed with two errors until the post-close review repaired it. That review read every contract file against the exemplar, wrote the structural checks as `scratch/check-changelog-structure.py`, ran them against the exemplar, both worked examples and a real old-format changelog, then fixed what it found and reran every gate. Nothing is committed: every change sits in the working tree.

The drift round followed an operator instruction to fix any open ends or existing drift. Each fix used the owning tool rather than a hand edit: the frontmatter version tool for versions, the Hermes renderer for mirrors, the Codex installer for hooks and the routing status command for the current policy hash. Lanes owned by other live work were left alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The exemplar wins, the contract relaxes to it | The exemplar is the published canon and out of scope to edit, so its 5-paragraph opening, 13 topical domains, 7-word headings and factual identifiers became the ceilings |
| Metadata (frontmatter plus editorial title H1) is optional | The exemplar carries both and the worked example shows the prose-only variant. Both shapes keep the narrative opening the prose. Only the retired machine header (bare version title, backlink, version-date line) is banned |
| The exemplar's one table is descriptive, not a quota | A generated changelog carries a table only when its numbers are the claim, so most releases carry none |
| Spec-folder blockquote is conditional | The SKILL check already required it only when the source is a spec folder, and the exemplar (no blockquote) confirms the template's unconditional shape was wrong |
| Benefit-led headings run 2-7 words, 10 at most | The 2-5 rule's own good examples included seven-word headings. 43 of the exemplar's 44 headings stay at seven or fewer and its longest runs to ten, so seven is the norm and ten the ceiling. REQ-003 still reads "2-5" because the spec's scope is frozen, and this row is the recorded amendment |
| H4 items run 1-3 paragraphs, 7 at most | 33 of the exemplar's 44 items stay within three paragraphs and its longest runs to seven. A 3-paragraph ceiling made the canonical exemplar fail its own contract 11 times |
| At-a-glance bullets open with a bold lead-in sentence | Every exemplar bullet is a bold sentence followed by plain ones. The double-dash `**Name** -- text` shape appears nowhere in it |
| The GitHub release body drops frontmatter and the title H1 | Allowing frontmatter would otherwise publish it into the release notes, because the release step only stripped a leading H1 |
| Release mechanics are documented, not changed | The spec keeps release mechanics out of scope. The YAMLs already defined them, so calling them UNKNOWN was a false claim about existing behavior, and correcting it changes no mechanics |
| README, packet changelog and drift fixes go beyond the frozen file list | The operator asked for every open end and drift fixed. Each one is recorded here and in tasks T022-T026 rather than folded silently into the original scope |
| Other sessions' drift stays theirs | The `deep-ai-council` Hermes mirror is fixed in its own worktree, and the `cli-external-orchestration` stale manifest belongs to its live cutover. Touching either would collide with that work |
| The drafting review (T004) was folded into the consistency review | The approved plan carried one cli-codex review. The blueprint was drafted from the direct v4 analysis, so the dispatched review audited the finished artifacts instead |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| validate_document.py on all five rewritten contract files | PASS, VALID, 0 issues each |
| hvr_scan.py on all five rewritten contract files | PASS, 0 hard blockers each (ceilings 91, 84, 97, 100, 98 of 100) |
| Both command YAMLs parse (`yaml.safe_load`) | PASS |
| Structural checks on the exemplar (`python3 scratch/check-changelog-structure.py .skilled/changelog/system-spec-kit/v4.0.0.0.md`) | PASS, 0 violations. Before the remediation the same checks at the old ceilings failed it 12 times |
| Positive test: both worked-example blocks (compact whole, expanded with `--excerpt`) | PASS, 0 violations each |
| Negative test: the real old-format changelog `system-spec-kit/changelog/v3+/v3.9.0.0.md` | PASS, correctly fails with 10 violations (bare version H1, Files Changed section and table, missing narrative sections, missing `&nbsp;` separators) |
| Negative test: the pre-remediation compact example | PASS, correctly fails 4 times on its double-dash bullets |
| Residue scan: nine retired rules and false claims across the seven contract files | PASS, 24 hits before the remediation and 0 after |
| Link integrity: every path target named in the seven contract files | PASS, 49 checked, 0 missing |
| Hermes mirror (`sync-skills-hermes.cjs --check`) | PASS for `sk-create-changelog` and `sk-design` after regeneration. The check still reports `deep-ai-council`, owned by other work |
| README.md and `changelog/v1.1.0.0.md` | PASS: README VALID with 0 hard blockers, the changelog PASSED the structural checks with 0 violations, VALID and 0 hard blockers |
| Frontmatter versions (`frontmatter-version.mjs verify`) | PASS, ok 7 of 7 |
| sk-doc compiled routing (`compiled-route-status.cjs --hub sk-doc`) | PASS, `compiled-serving` and fresh. A changelog prompt routes to `sk-create-changelog` and a README prompt to `sk-create-readme`. `--all` leaves only `cli-external-orchestration` stale, owned by other work |
| Codex hooks (`install-codex-hooks.mjs --check`) | PASS. The reinstall kept every hook group, reordered them and dropped 12 empty matchers |
| cli-codex consistency review | 9 confirmed findings, all applied. The post-close review found the further gaps listed above, all fixed |
| REQ-004 stale-reference check | PASS: no stale usage remains. SKILL.md and topology-edge-cases.md keep explanatory retirement notes (the retired `Search` and `Saving Memories` vocabulary, the stale `NN--` and `00--` patterns) by design |
| spec validate.sh --strict on this packet | PASS, RESULT: PASSED, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Published changelogs are unchanged.** History stays as written, so older entries beside a new one will not match. The template tells writers not to copy them.
2. **The nested changelog format is owned by the spec-kit templates.** Its shape (H1, dated H2, Added/Changed/Fixed) is not the v4 two-tier narrative, by design.
3. **The exemplar path depends on an uncommitted move.** `.skilled/changelog/system-spec-kit/v4.0.0.0.md` resolves through a symlink to `.skilled/skills/system-spec-kit/changelog/v4.0.0.0.md`, which is still untracked (moved byte-for-byte from the 033 packet's changelog folder). Committing this packet without that move leaves twelve exemplar pointers dead across the seven contract files.
4. **The routing pin and SKILL.md ship together.** The re-pinned sk-doc manifests hold the hash of the edited SKILL.md. Committing one without the other leaves sk-doc serving legacy routing.
5. **Frontmatter versions move at commit time.** The build segment counts each doc's git edits, so the version tool needs a second pass once these edits are committed.
6. **Nothing is committed.** All changes sit unstaged in the working tree.
<!-- /ANCHOR:limitations -->

---


