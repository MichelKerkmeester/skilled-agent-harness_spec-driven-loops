---
title: "Implementation Summary: Phase 13: sk-prompt framework docs"
description: "sk-prompt's framework registry now says it holds code-task scaffolds for five of the skill's seven frameworks, and SKILL.md tells a run to read three sections of patterns-evaluation.md instead of the whole file. The largest read set drops from 59,661 to 33,579 bytes, and the owner's validators, card sync guard and sweep test still pass."
trigger_phrases:
  - "sk-prompt framework docs summary"
  - "sk-prompt framework docs status"
  - "sk-prompt section read shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs"
    last_updated_at: "2026-09-27T18:30:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Recorded the build commit e3cf07f4f9 and its evidence; every acceptance row is Met"
    next_safe_action: "None. The phase is closed; the orchestrator commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-prompt/SKILL.md"
      - ".skilled/skills/sk-prompt/assets/framework-registry.json"
      - ".skilled/skills/sk-prompt/changelog/v3.0.2.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the owner trim depth-framework.md, which a $improve run also loads"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 13: sk-prompt framework docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-sk-prompt-framework-docs |
| **Status** | Complete |
| **Completed** | 2026-09-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

sk-prompt's registry now states which of the seven frameworks it scaffolds, and a run reads about a quarter of `patterns-evaluation.md` instead of all of it.

### Phase 13: sk-prompt framework docs

The registry's top-level `description` used to call it a "Machine-readable registry of prompt-engineering frameworks", so a reader could not tell that five ids was a deliberate subset of seven. It now says the registry holds code-task benchmark scaffolds for RCAF, RACE, CIDI, TIDD-EC and COSTAR, that CRISPE and CRAFT have none because they fit strategy and planning work, and that `references/patterns-evaluation.md` defines the full set. The five ids and every entry are unchanged, so the sweep and its pinned test read the same data.

`SKILL.md` gained a section-read rule below the `### Resource Loading Levels` table. A run reads `## 2. FRAMEWORK LIBRARY & SELECTION` to choose, the chosen framework's subsection of `## 3. FRAMEWORK DEEP DIVES`, and `## 10. CLEAR EVALUATION MASTERY` to score. A framework switch reads the new subsection, an unmatched name reads all of section 3, and an on-demand keyword still reads the whole file. The `patterns-evaluation.md` bullet in `### Deterministic Agent Rules` names the same three sections, because `@prompt-improver` reads `SKILL.md` before it composes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-prompt/assets/framework-registry.json` | Modified | Line 3, the top-level `description` only. Numstat `1 1` |
| `.skilled/skills/sk-prompt/SKILL.md` | Modified | The section-read rule from line 100, the amended agent-rules bullet and `version` 3.0.1.0 to 3.0.2.0. Numstat `10 2`, 23,081 to 23,893 bytes |
| `.skilled/skills/sk-prompt/changelog/v3.0.2.0.md` | Created | The owner's changelog entry for both changes. Numstat `22 0` |
| `.hermes/skills/sk-prompt/SKILL.md` | Regenerated | The Hermes mirror of `SKILL.md`, rewritten by `sync-skills-hermes.cjs`. Outside the spec's file list, see Deviations |

All four files landed in commit `e3cf07f4f9`, "docs(sk-prompt): read the framework reference by section and state the registry's scope". The build-start HEAD was `6f47c32dce`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator first rechecked the owner's state and took the baseline, then dispatched four single-change briefs from `scratch/briefs/` to the `pi` executor (`llmgateway/deepseek-v4.1-flash`, thinking max). Brief 01 rewrote the registry description in 45 s. Brief 02 added the section-read rule in 108 s. Brief 03 bumped the version in 39 s. Brief 04 wrote the changelog in 429 s. The orchestrator verified each brief's result before the next, regenerated the Hermes mirror, reran every check from the final state and committed the build. These phase docs were then closed from that evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep seven frameworks and fix the registry's description | The owner's matrix, quality card, README and card sync guard name seven, and the sweep test pins the five registry ids. `goal.md` D1 |
| Read sections 2, the chosen subsection of 3 and 10 | Section 2 is needed to choose and section 10 to score. `goal.md` D2 |
| Bump `SKILL.md` to 3.0.2.0 | The new changelog file needs a matching version. The owner's `239bc805db` bumped the version with its changelog, and sk-create-changelog makes a docs change a patch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every check ran from the worktree root with exit 0 unless the row says otherwise.

| Check | Result |
|-------|--------|
| Planning baseline, 2026-09-27 at `00480a8d5c` | `SKILL.md` 23,081 bytes, `patterns-evaluation.md` 36,580, sections 2 and 10 at 3,066 and 3,950, deep dives 538 (TIDD-EC) to 2,670 (CRAFT). Registry ids `rcaf,race,cidi,tidd-ec,costar`, CRISPE and CRAFT absent from its `description`. `validate_document.py` VALID, `quick_validate.py` valid and `GUARD PASS`, each exit 0 |
| Recheck before the first brief | `git status --short -- .skilled/skills/sk-prompt .hermes/skills/sk-prompt` printed nothing. Newest skill commit `094cdb9f8a` (changelog metadata only). `sync-skills-hermes.cjs --check` printed `PASS: 71 Hermes skill copies in sync` |
| Build baseline (plan section 5 and the sweep test) | 23081, 36580, 3066, 3950, 2670, 538. `rcaf,race,cidi,tidd-ec,costar false false`. `VALID`, `Skill is valid!`, `GUARD PASS`, `Tests  26 passed (26)` |
| Registry `node -p` (AC-001 command) | `rcaf,race,cidi,tidd-ec,costar true true`, numstat `1 1` |
| `grep -c` for `FRAMEWORK DEEP DIVES`, `CLEAR EVALUATION MASTERY` and `"all frameworks"` in `SKILL.md` | 2, 2 and 1 |
| AC-002 greps (rerun read-only while closing the docs) | Matrix rows for CRISPE and CRAFT 2, `7 frameworks` 4 |
| `wc -c` and the `sed` range counts after the build | `SKILL.md` 23893. Sections 2 and 10 at 3066 and 3950, CRAFT 2670, TIDD-EC 538, unchanged |
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-prompt/SKILL.md` | `VALID` |
| `python3 .skilled/skills/sk-doc/scripts/quick_validate.py .skilled/skills/sk-prompt` | `Skill is valid!`. Phase 012 had not landed, its `spec.md` reads Planned |
| `bash .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh .` | `GUARD PASS` |
| `npx vitest run model-benchmark/tests/sweep-foundation.vitest.ts` from `system-deep-loop/deep-improvement/scripts` | `Tests  26 passed (26)`, the same as the baseline |
| `validate_document.py` on `changelog/v3.0.2.0.md` | `VALID`, `Document type: changelog` |
| `sync-skills-hermes.cjs --check` after the mirror rewrite | `PASS: 71 Hermes skill copies in sync` |
| `git diff --name-only 6f47c32dce..HEAD -- .skilled/skills/sk-prompt` | Exactly `SKILL.md`, `assets/framework-registry.json` and `changelog/v3.0.2.0.md` |
| `validate.sh --strict` and `check-goal.cjs` on this folder | `RESULT: PASSED` and exit 0 on the final state of these docs |

**Byte measurement.** Before, a run read `SKILL.md` 23,081 bytes plus `patterns-evaluation.md` 36,580, 59,661 bytes. After, the TIDD-EC read set is 3,066 + 3,950 + 538 = 7,554 bytes and the CRAFT read set 3,066 + 3,950 + 2,670 = 9,686 bytes. With `SKILL.md` at 23,893 bytes the largest read of the two files is 33,579 bytes, under the 34,000 bound. The 812 bytes the rule adds sit inside NFR-P02's 919-byte allowance.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Hermes mirror.** `.hermes/skills/sk-prompt/SKILL.md` is a generated copy of `SKILL.md`, outside the spec's Files to Change and D3. The orchestrator regenerated it with `sync-skills-hermes.cjs`, as the owner's `SKILL.md` commits `239bc805db` and `86e99e7fc1` did.
2. **Version bump.** The spec does not name `SKILL.md`'s `version`. It moved from 3.0.1.0 to 3.0.2.0 to match the new changelog, following the owner's `239bc805db` and sk-create-changelog's patch rule.
3. **Parent changelog.** `spec.md` Phase Context asks for a refresh of `../changelog/`, but `specs/cli-jev/003-cli-jev-workflow-integration/changelog/` does not exist, so there was nothing to refresh.
4. **Diff base.** The AC-007 base moved from `00480a8d5c` to the build-start HEAD `6f47c32dce`, because the main merge brought `094cdb9f8a` into the old range. The operator approved the merge, and the `goal.md` log records the move.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The byte check measures the rule, not a model's reads.** Confirming that a run reads only the named sections needs a transcript of a live run, which this phase does not make.
2. **Three checklist items stay open in `tasks.md`.** CHK-031 because the edits were written by a model executor over a network gateway, CHK-032 because the evidence does not record whether a `.env` file was opened, and CHK-051 because `scratch/briefs/` is kept on purpose. None is an acceptance row.
3. **Two owner questions stay open.** Whether to trim `references/depth-framework.md` (21,817 bytes, loaded by every `$improve` run) and whether `SWEEP.md` line 31 should say "5 of sk-prompt's 7". `spec.md` section 10 holds both.
<!-- /ANCHOR:limitations -->

---
