---
title: "Verification Checklist: design-interface SKILL.md word-cap relief"
description: "Evidence-carrying verification of the word-count delta, the router block's byte-identity, both gate results against baseline, D5 connectivity parity, relative-link resolution, and the preserved restraint-gate redundancy."
trigger_phrases:
  - "skill word cap relief checklist"
  - "design-interface SKILL.md verification"
importance_tier: "important"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/014-skill-word-cap-relief"
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Trimmed design-interface/SKILL.md 4991 to 4760 words; router block byte-identical."
    next_safe_action: "Re-run package_skill --check and parent-skill-check before committing SKILL.md."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/references/motion/animation-decision-framework.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Did the D5 connectivity property regress? No — the unmapped set is identical to the HEAD baseline."
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: design-interface SKILL.md word-cap relief
<!-- SPECKIT_LEVEL: 2 -->
<!-- PHASE_LINKS: parent=../spec.md; predecessor=013-design-command-decomposition-research -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Working-tree collision check passed before the first edit
  - **Evidence:** `git status --porcelain .opencode/skills/sk-design/` returned empty; `git log --oneline -3` on `SKILL.md` showed `140fdab23d`, `c1981d2b91` (motion merge), `c10ded2ab8` — committed and clean at dispatch
- [x] CHK-002 [P0] The authoritative counting method was read from the checker's source, not assumed
  - **Evidence:** `package_skill.py:430` `words = len(content.split())` where `content` is the raw `SKILL.md` read at line 745 including frontmatter; cap at line 95 `MAX_SKILL_MD_WORDS = 5000`. Applying that method to the pre-edit file yields 4,991, matching the checker's own reported figure exactly
- [x] CHK-003 [P0] Baselines captured for every gate before editing
  - **Evidence:** `package_skill.py --check` → `Result: PASS`, 1 warning `4991 words`; `parent-skill-check.cjs` → `OK — all hard invariants passed, 0 warnings`; router block SHA-256 prefix `dff7be30e67b02ca`; D5 unmapped set at `HEAD` = `{references/design-process/resource-loading-notes.md}`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [router integrity]

- [x] CHK-010 [P0] The fenced router block is byte-identical before and after (REQ-001)
  - **Evidence:** extracted the fenced ```python block from `git show HEAD:...SKILL.md` and from the working tree; `bo == bn` → `True`, SHA-256 prefix `dff7be30e67b02ca` on both sides
- [x] CHK-011 [P0] `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` each compare byte-identical individually, not only as part of the whole block (REQ-001)
  - **Evidence:** per-structure comparison reported `INTENT_SIGNALS byte-identical: True`, `RESOURCE_MAP byte-identical: True`, `DEFAULT_RESOURCE identical: True`; intent key count 18 on both sides
- [x] CHK-012 [P0] The restraint-gate ordering guarantee survives in all three engineered positions (REQ-004)
  - **Evidence:** the ALWAYS table row `| ALWAYS | The first step of any motion/temporal task | references/motion/animation-decision-framework.md (the restraint gate — frequency, keyboard rule, purpose, register coupling — runs before any timing or easing choice) |` is unedited; `animation-decision-framework.md` is still first in all six `MOTION_*` `RESOURCE_MAP` values (unchanged by CHK-011); ALWAYS rule 11 still reads "run the motion restraint gate before any timing or easing choice"
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [gate parity]

- [x] CHK-020 [P0] `package_skill.py design-interface --check` PASSES and reports a word count materially below the cap (REQ-002)
  - **Evidence:** post-edit run → `✅ Skill is valid!`, `Result: PASS`, warning now reads `SKILL.md has 4760 words`; 4,991 → 4,760 is −231 words, headroom 9 → 240
- [x] CHK-021 [P1] `parent-skill-check.cjs` on the sk-design hub is unchanged from baseline (REQ-005)
  - **Evidence:** post-edit run → `OK: parent-skill-check — all hard invariants passed, 0 warnings`, with `10b-byte-drift: committed leaf-manifest.json matches a fresh regeneration byte for byte` PASS — no manifest regeneration was needed because no file was created or deleted under `references/` or `assets/`
- [x] CHK-022 [P0] D5 connectivity did not regress: no on-disk reference or asset became unmapped (REQ-003)
  - **Evidence:** recomputed from disk post-edit → 37 on-disk `.md` under `references/` + `assets/`, unmapped set `{references/design-process/resource-loading-notes.md}`; the same computation against `HEAD` (via `git ls-tree`) yields the identical single-element set, so the gap is pre-existing and unchanged
- [x] CHK-023 [P1] Every relative link in both edited files resolves on disk (REQ-007)
  - **Evidence:** link sweep over `SKILL.md` and `references/motion/animation-decision-framework.md` → `all links resolve` for both; the new §7's `../../assets/motion/*` (3 cards), `../../../shared/sk-code-handoff.md`, and `../../assets/interface-preflight-card.md` were each stat-checked and returned OK
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [no guidance lost]

- [x] CHK-030 [P0] Every removal is traceable to a surviving home — nothing was deleted outright (REQ-006)
  - **Evidence:** `implementation-summary.md` "What Was Built" maps each removal to its home: the motion downstream sequence → `animation-decision-framework.md` §7; table parentheticals → the Core References index entry for the same file; the Mobbin/Refero discipline clause → ALWAYS rule 8; the five-step flow enumeration → the Phase Detection diagram in §2; the redesign-intake protected-items list → §3 Required sk-code Build Manifest
- [x] CHK-031 [P0] The one-home rule did not strand a resource with no description anywhere
  - **Evidence:** `../shared/context-loading-contract.md` has no Core References index entry, so its table parenthetical (register-first gate, build bundle, context manifest, four proof fields, hard gates) was deliberately kept; every other trimmed row's file has a surviving index entry
- [x] CHK-032 [P1] The motion sequence is still reachable on every motion trigger, not only on a new conditional one
  - **Evidence:** the relocation target is first in all six `MOTION_*` `RESOURCE_MAP` entries, so §7 loads on `MOTION_DECISION`, `MOTION_STRATEGY`, `MOTION_MICRO_INTERACTIONS`, `MOTION_PRESENCE`, `MOTION_PERFORMANCE`, and `MOTION_ADVANCED_CRAFT` — strictly broader than the `SKILL.md` §3 placement it replaced
- [x] CHK-033 [P2] A latent path defect found during the read was corrected rather than carried forward
  - **Evidence:** §5 named per-scenario files under `manual_testing_playbook/<NN>--<topic>/`; on-disk the directory is `manual-testing-playbook/` with unnumbered kebab-case topic dirs (`color/`, `data-viz/`, `decision/`, …). Corrected to `manual-testing-playbook/<topic>/`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [n/a]

- [x] CHK-040 [P2] No secrets, credentials, or executable behaviour were introduced
  - **Evidence:** both edits are markdown prose; the only fenced code in `SKILL.md` is the pre-existing router block, verified byte-identical by CHK-010
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same prose-only, router-frozen scope and the same numbers
  - **Evidence:** all five carry the 4,991 → 4,760 delta, the same two changed files, and the same deviation record on the new-sub-document decision; `spec.md` status, `tasks.md` completion criteria, and `implementation-summary.md` metadata agree
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [x] CHK-060 [P0] Only the two owned skill files were modified; the concurrently-edited directories were not touched
  - **Evidence:** final `git status --porcelain` shows this session's changes limited to `design-interface/SKILL.md` and `design-interface/references/motion/animation-decision-framework.md`. Other dirty paths under the hub (`design-mcp-open-design/**`, `design-interface/manual-testing-playbook/**`, `feature-catalog/**`) belong to concurrent sessions, were out of scope, and were left untouched
- [x] CHK-061 [P0] No file was created or deleted under `references/` or `assets/`, and no registry, router, or manifest file was edited
  - **Evidence:** `mode-registry.json`, `command-metadata.json`, `hub-router.json`, and `leaf-manifest.json` are absent from this session's changed set; `10b-byte-drift` PASS independently confirms `leaf-manifest.json` still matches a fresh regeneration
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 5 | 5/5 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-27. All items verified with evidence. One finding is recorded as open but out of scope: `references/design-process/resource-loading-notes.md` is on disk yet absent from every `RESOURCE_MAP` entry, so the D5 connectivity gate cannot reach it. Confirmed identical at `HEAD`, so it predates this packet; closing it requires editing the router block this packet deliberately froze.
<!-- /ANCHOR:summary -->
