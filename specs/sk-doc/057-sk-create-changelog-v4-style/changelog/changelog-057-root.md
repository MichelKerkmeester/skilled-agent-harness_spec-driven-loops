---
title: "Changelog: Rewrite sk-create-changelog template and workflow to the v4 narrative style [057-sk-create-changelog-v4-style/root]"
description: "Chronological changelog for the Rewrite sk-create-changelog template and workflow to the v4 narrative style spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-09-23

> Spec folder: `specs/sk-doc/057-sk-create-changelog-v4-style` (Level 1)

### Summary

The /create:changelog skill now writes release notes in the narrative house style of the v4 exemplar instead of the machine-era table format. Generated changelogs open with why the release matters, name their sections for the domain they change, enforce voice and conciseness at validation time, and drop the file inventories, test metrics and schema churn no reader asked for.

### Added

- Verify HVR scanner presence and invocation (sk-create-with-human-voice/scripts/hvr_scan.py) -- verified, scanner exercised throughout (flags --all, --json, --rules)
- Dispatch cli-codex drafting review for the new template shape -- folded per the approved plan into the finished-artifact consistency review (T010), the blueprint was drafted from the direct v4 analysis
- [P] Reconcile command YAMLs with the new template -- both parse as valid YAML, remaining mentions are the new prohibition wording
- Add the packet changelog changelog/v1.1.0.0.md so SKILL.md 1.1.0.0 has a matching entry -- compact v4 format, structural checks PASSED 0, VALID, 0 hard blockers
- Bump packet to 1.1.0.0, write nested changelog entry, fill implementation-summary.md -- nested entry written via the generator (changelog/changelog-057-root.md), summary filled, decision note records the 2-5 to 2-7 heading amendment

### Changed

- Read the auto/confirm command YAMLs and catalog stale validation snippets -- 17 contradicting blocks cataloged, reconciled in T009
- [P] Baseline: run validate_document.py and hvr_scan.py on current packet files -- old template: VALID, 0 issues, 0 hard blockers, ceiling 94/100
- Rewrite assets/changelog-template.md to the two-tier v4 shape with omission rules -- 1.1.0.0, 0 hard blockers, ceiling 91/100
- Rewrite SKILL.md format contract and voice/omission/validation sections -- 1.1.0.0, 0 hard blockers, ceiling 84/100
- Rework references/worked-examples.md to the v4-style annotated entry -- 1.1.0.0, 0 hard blockers, ceiling 97/100
- [P] Stale-path touch-ups in references/README.md and topology-edge-cases.md -- 0 hard blockers, ceilings 100/100 and 98/100

### Fixed

- Correct false or stale claims -- the misquoted exemplar sentence, the "exactly as the exemplar writes it" excerpt claim, the three-sentence Upgrade annotated as two, SKILL.md step 5 still checking "files changed", four wrong SKILL.md section pointers in topology-edge-cases.md
- Refresh the packet README.md (operator-directed drift fix) -- the plain-category vocabulary, the validation-only claim and the claim that only sk-git releases replaced, the voice scan added to Quick Start and Verification, 0 hard blockers, VALID
- Operator-directed drift fixes outside the packet -- Hermes mirrors regenerated for sk-create-changelog and sk-design, Codex hooks reinstalled, sk-doc compiled-routing activation manifests re-pinned to the current policy hash in both copies
- Make the structural checks reproducible (scratch/check-changelog-structure.py) and rerun them -- exemplar PASSED 0, both worked examples PASSED 0, the real v3.9.0.0 changelog FAILED 10, the pre-fix compact example FAILED 4
- Repair the packet record and rerun every gate -- metadata re-derived, placeholders filled, status reconciled, nested changelog regenerated, validate.sh --strict RESULT: PASSED
- Rerun every gate after the drift round -- sk-doc serves compiled with two route replays correct, Hermes check leaves only deep-ai-council, Codex hooks --check OK, validate.sh --strict RESULT: PASSED

### Verification

- validate_document.py on all five rewritten contract files - PASS, VALID, 0 issues each
- hvr_scan.py on all five rewritten contract files - PASS, 0 hard blockers each (ceilings 91, 84, 97, 100, 98 of 100)
- Both command YAMLs parse (yaml.safe_load) - PASS
- Structural checks on the exemplar (python3 scratch/check-changelog-structure.py .skilled/changelog/system-spec-kit/v4.0.0.0.md) - PASS, 0 violations. Before the remediation the same checks at the old ceilings failed it 12 times
- Positive test: both worked-example blocks (compact whole, expanded with --excerpt) - PASS, 0 violations each
- Negative test: the real old-format changelog system-spec-kit/changelog/v3+/v3.9.0.0.md - PASS, correctly fails with 10 violations (bare version H1, Files Changed section and table, missing narrative sections, missing &nbsp; separators)
- Negative test: the pre-remediation compact example - PASS, correctly fails 4 times on its double-dash bullets
- Residue scan: nine retired rules and false claims across the seven contract files - PASS, 24 hits before the remediation and 0 after

### Files Changed

| File | Action | What changed |
|---|---|---|
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
| `.hermes/skills/sk-create-changelog/SKILL.md` | Regenerated | The generated Hermes copy of SKILL.md, rewritten from sync-skills-hermes.cjs's own renderer for this one skill only |
| `.hermes/skills/sk-design/SKILL.md` | Regenerated | Operator-directed drift fix: the mirror still said sk-design had no compiled routing |

### Follow-Ups

- Published changelogs are unchanged. History stays as written, so older entries beside a new one will not match. The template tells writers not to copy them.
- The nested changelog format is owned by the spec-kit templates. Its shape (H1, dated H2, Added/Changed/Fixed) is not the v4 two-tier narrative, by design.
- The exemplar path depends on an uncommitted move. .skilled/changelog/system-spec-kit/v4.0.0.0.md resolves through a symlink to .skilled/skills/system-spec-kit/changelog/v4.0.0.0.md, which is still untracked (moved byte-for-byte from the 033 packet's changelog folder). Committing this packet without that move leaves twelve exemplar pointers dead across the seven contract files.
- The routing pin and SKILL.md ship together. The re-pinned sk-doc manifests hold the hash of the edited SKILL.md. Committing one without the other leaves sk-doc serving legacy routing.
- Frontmatter versions move at commit time. The build segment counts each doc's git edits, so the version tool needs a second pass once these edits are committed.
- Nothing is committed. All changes sit unstaged in the working tree.
