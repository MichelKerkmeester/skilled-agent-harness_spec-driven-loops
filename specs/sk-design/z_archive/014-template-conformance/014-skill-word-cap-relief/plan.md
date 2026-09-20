---
title: "Implementation Plan: design-interface SKILL.md word-cap relief"
description: "Three-phase plan: establish the checker's own baseline word count, relocate the motion downstream sequence into the already-mapped gate reference and apply a one-home rule across the two resource indexes, then verify the router block is byte-identical and both gates are unchanged."
trigger_phrases:
  - "skill word cap relief plan"
  - "design-interface SKILL.md trim plan"
  - "motion prose relocation plan"
importance_tier: "important"
contextType: "planning"
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
    open_questions:
      - "resource-loading-notes.md is on disk but absent from RESOURCE_MAP — pre-existing D5 gap, not fixed here"
    answered_questions:
      - "Where should the relocated motion sequence live? In animation-decision-framework.md, already mapped first in every MOTION_* entry."
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: design-interface SKILL.md word-cap relief
<!-- SPECKIT_LEVEL: 2 -->
<!-- PHASE_LINKS: parent=../spec.md; predecessor=013-design-command-decomposition-research -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Surface | `.opencode/skills/sk-design/design-interface/` (one mode, two files) |
| Cap authority | `package_skill.py` `MAX_SKILL_MD_WORDS = 5000`, measured as `len(content.split())` on the raw file |
| Baseline | 4,991 words, 9 words of headroom |
| Frozen artifact | The fenced Python router block: `DEFAULT_RESOURCE`, `INTENT_SIGNALS` (18 keys), `RESOURCE_MAP` (18 keys) |
| Gates | `package_skill.py --check`, `parent-skill-check.cjs`, D5 connectivity, relative-link resolution |

### Overview

Three phases: measure with the checker's own method so the delta is real rather than a `wc -w` approximation; relocate and trim; then verify by hash and by re-running both gates against their captured baselines. The whole change is prose, so the risk profile is "did anything load-bearing quietly leave" rather than "does it still run" — which is why verification is weighted toward byte-identity and one-home traceability rather than toward execution.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Working tree clean for `.opencode/skills/sk-design/design-interface/SKILL.md`, confirmed by `git status --porcelain`.
- Baseline captured for all four gates before the first edit.
- The counting method read out of `package_skill.py` source, not assumed.

### Definition of Done

- `package_skill.py design-interface --check` PASS, word count at or below 4,800.
- `parent-skill-check.cjs .opencode/skills/sk-design` OK with 0 warnings.
- Router block SHA-256 equal to the `HEAD` version.
- D5 unmapped set identical to the `HEAD` baseline set.
- Every removal traceable to a surviving home in `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One-home rule for resource description. `SKILL.md` carries two indexes over broadly the same resource set: the Resource Loading Levels table and the Core References index. Before this change many resources were described in both, plus a third time in the router's mapping and sometimes a fourth in `RULES`. The rule assigns each index a distinct job — the table answers *which tier and when to load*, the index answers *what the file is* — and the router keeps its mapping. Description text that answered the index's question from inside the table is removed, not rewritten.

### Key Components

- **Frozen**: the fenced router block. Any change to it is a routing change, so it is excluded by construction and verified by hash.
- **Relocation target**: `references/motion/animation-decision-framework.md`. Chosen because it is already the first entry in all six `MOTION_*` `RESOURCE_MAP` values, so content placed there loads on every motion intent without a router edit and without a new D5-invisible file.
- **Protected redundancy**: the restraint-gate ordering guarantee in three positions. Load-bearing precisely because `RESOURCE_MAP` is an unordered mapping and cannot express "run this first".

### Data Flow

A motion request scores against `INTENT_SIGNALS`, unions `DEFAULT_RESOURCE` with the winning `MOTION_*` entries, and loads `animation-decision-framework.md` first in every case. The relocated sequence therefore reaches the same readers it reached from `SKILL.md` §3, on the same triggers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Collision check on the hub, then baseline capture: the checker's word count, `package_skill.py --check` result, `parent-skill-check.cjs` result, the D5 unmapped set computed against `HEAD`, and the router block hash. Read the whole file and measure words per section so the cuts are aimed at where the words actually are.

### Phase 2: Implementation

Append the eight-step motion sequence to `animation-decision-framework.md` as §7, verifying its relative paths resolve from `references/motion/`. Then reduce `SKILL.md`: replace the §3 Motion Design Workflow body with a gate statement plus a pointer to §7; strip retired-mode residue; apply the one-home rule to the Resource Loading Levels table; trim fourth-copy prose in the Core References index, Integration Points, and §8; and correct the stale manual-testing-playbook sub-path.

### Phase 3: Verification

Hash-compare the router block against `HEAD` and byte-compare `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` separately. Re-run both gates and the D5 computation, compare each against its captured baseline, sweep both files for broken relative links, and re-check `git status` for a mid-flight collision.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no runtime to exercise; the artifacts under test are a parsed block and two markdown files. Verification is therefore differential against captured baselines:

- **Byte-identity**: extract the fenced block from `HEAD` and from the working tree, compare SHA-256 and each sub-structure.
- **Gate parity**: both gate runners are re-run and their outputs compared to baseline, not merely read for the word "PASS".
- **Property check**: D5 connectivity recomputed from disk on both sides, so a newly-orphaned resource would surface as a set difference rather than as a silent regression.
- **Link resolution**: every non-anchor relative link in both edited files resolved against the filesystem.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `python3` and `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py` for the authoritative word count and skill validation.
- `node` and `.opencode/commands/doctor/scripts/parent-skill-check.cjs` for hub invariants including `10b-byte-drift`.
- `git` read-only access to `HEAD` for baselines. No write git command is run by this packet.
- Predecessor `013-design-command-decomposition-research` for the settled decision that a command split is not the remedy.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Both edited files are tracked and uncommitted. Rollback is `git checkout --` on the two paths, which restores the 4,991-word file and the pre-append reference. No generated artifact was regenerated, no registry or manifest was touched, so nothing else has to be undone in step.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|-----------|--------|
| Phase 1 | — | Baselines must be captured before any edit, or the delta is unverifiable after the fact |
| Phase 2 | Phase 1 | The relocation target is chosen from the baseline `RESOURCE_MAP` reading; the trims are aimed by the per-section word measurement |
| Phase 2 append | Phase 2 trim | The `SKILL.md` pointer must not dangle, so §7 exists in the reference before the body is removed from `SKILL.md` |
| Phase 3 | Phase 2 | Differential verification needs both sides to exist |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- `git status --porcelain` shows only the two intended files as modified within `design-interface/`.
- No file created or deleted under `references/` or `assets/`, so `leaf-manifest.json` needs no regeneration and `10b-byte-drift` stays PASS.

### Rollback Procedure

`git checkout -- .opencode/skills/sk-design/design-interface/SKILL.md .opencode/skills/sk-design/design-interface/references/motion/animation-decision-framework.md`. Then re-run `package_skill.py design-interface --check` and expect the 4,991-word warning to return, which is the positive confirmation that the rollback landed.

### Data Reversal

None. No database, index, or generated artifact was written; the spec-folder metadata for this packet is the only other output and is independent of the skill files.
<!-- /ANCHOR:l2-rollback -->
