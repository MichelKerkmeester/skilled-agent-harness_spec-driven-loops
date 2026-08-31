---
title: "Implementation Plan: sk-communication consumes the human-voice mode"
description: "Find every live copy of voice guidance, separate what the standard owns from what the projection owns, replace the first with a route and keep the second, then prove no gate moved."
trigger_phrases:
  - "voice routing plan"
  - "rubric deduplication method"
  - "projection standard adoption plan"
  - "keep versus reroute test"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-communication consumes the human-voice mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown under `.opencode/commands/rewrite/` and `.opencode/skills/sk-communication/` |
| **Framework** | sk-doc command contract, and the `sk-create-with-human-voice` mode shipped by Wave A at `60212f5292` |
| **Storage** | Filesystem only. The `.claude` command mirrors are per-file symlinks, so no mirror regeneration is involved |
| **Testing** | `sk-doc/shared/scripts/validate_document.py`, `sk-create-skill/scripts/package_skill.py`, `sk-create-with-human-voice/scripts/hvr_scan.py` |

### Overview

One question decides every line: **does the Human Voice Rules standard already settle this, or does the projection settle it?** Guidance the standard settles is replaced by a path to the standard. Guidance the projection settles is kept where it is, because deleting it would remove a contract nothing else carries. The two answers are not symmetric and the split is written down in spec.md section 8.2 rather than left implicit in a diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Wave A's mode, scope gate and scanner confirmed present on disk before the first edit
- [x] Baselines captured for the command validator, the package check and the scanner
- [x] Scanner proved working with its own fixtures, dirty at 6 hard blockers and exit 1, clean at 0 and exit 0
- [x] Ownership boundary confirmed: no `sk-doc` hub-root file, no `repo-rules/` file

### Definition of Done
- [x] Zero live copies of the rerouted guidance remain outside `hvr-rules.md`
- [x] Both edited commands validate at 0 issues, matching baseline
- [x] `package_skill.py --check --strict` reports PASS, matching baseline
- [x] No file's hard-blocker count rose against its own baseline
- [x] `validate.sh <folder> --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One home, many pointers. The standard stays at `sk-doc/shared/references/hvr-rules.md`, where hundreds of files already point. `sk-communication/SKILL.md` becomes the skill's single statement of what binds and what is excluded. Both commands cite the standard and the scope gate directly, plus that one section for the exclusions.

### Key Components

| Component | Role |
|---|---|
| `hvr-rules.md` | The standard. Never copied, only cited |
| `sk-create-with-human-voice/references/scope-and-exemptions.md` | The scope gate. Names the spans a rewrite may never touch, and states that accuracy outranks the standard |
| `sk-communication/SKILL.md` section 3 | The exclusion list and the precedence, stated once for both lanes and both commands |
| The two command files | Operational steps plus the projection constraints the standard does not cover |

### Data Flow

```text
/rewrite:response  ─┐
                    ├─> hvr-rules.md                (what plain English means)
/rewrite:response-  ┤
  by-external-agent ├─> scope-and-exemptions.md     (what may be touched)
   (Branch A only)  │
                    └─> sk-communication/SKILL.md   (what a projection excludes)
                             section 3
```

### Why the new text went into SKILL.md rather than a new reference

The skill's own router returns `{"lane": "projection", "resources": [], "note": "subsystem map is inline in SKILL.md"}` for every projection request. A new file under `references/` would never be loaded by the lane that needs it, and it would also require a `leaf-manifest.json` and `leaf-aliases.json` regeneration. Extending `SKILL.md` in place is the cheaper move and the one the existing design already assumes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and inventory
Read Wave A's mode before assuming what it contains. Capture the three gate baselines and the scanner self-test. Grep the whole live tree for the rubric phrases and the tone vocabulary, so the inventory is measured rather than guessed.

### Phase 2: Split, reroute, keep
For each located item, decide standard or projection. Write the standard's home into the commands. Keep the projection constraints and record why each is not the standard's. Put the exclusion list in one place.

### Phase 3: Prove
Rerun all three gates from the final state. Rescan every touched surface and compare hard-blocker counts to baseline. Confirm the symlinked mirrors resolve. Confirm every cited path and heading exists. Repair anything the scanner catches in the new prose, then rescan.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three gates plus a residue scan, all captured to `scratch/`.

| Check | What it proves |
|---|---|
| `validate_document.py <cmd>.md --type command` | The command contract survived the edit |
| `package_skill.py .opencode/skills/sk-communication --check --strict` | The skill package is still well formed |
| `hvr_scan.py` before and after on all five surfaces | The edit added no new voice defect, and the packet is dogfooded through the mode it adopts |
| Repo-wide grep for the rubric phrases | The transform is complete, with no unprocessed copy left behind |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Wave A commit `60212f5292`, which shipped `sk-create-with-human-voice`, its scope gate and `hvr_scan.py`.
- `sk-doc/shared/references/hvr-rules.md`, unmoved and unmodified. Wave A left it in place deliberately and this packet depends on that decision holding.
- Nothing from streams 4 or 5. Section 9 of spec.md records that no hub-root or repo-rule change is needed.
<!-- /ANCHOR:dependencies -->

---
