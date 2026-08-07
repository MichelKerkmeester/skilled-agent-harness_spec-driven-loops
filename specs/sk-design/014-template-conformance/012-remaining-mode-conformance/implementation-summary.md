---
title: "Implementation Summary: Template conformance for design-md-generator and design-mcp-open-design"
description: "Planned-state implementation summary: no work has started on either mode's conformance fixes; this document records the pre-work state and will be rewritten once the enum fix, exemplar-file decision, and heading numbering land."
trigger_phrases:
  - "remaining mode conformance implementation summary"
  - "design-md-generator conformance summary"
  - "design-mcp-open-design conformance summary"
importance_tier: "important"
contextType: "continuity"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/012-remaining-mode-conformance"
    last_updated_at: "2026-07-27T18:03:42Z"
    last_updated_by: "conformance-executor"
    recent_action: "Completed all fixes, verification gate green, packet Complete"
    next_safe_action: "Packet complete, no further action required"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md"
      - ".opencode/skills/sk-design/design-md-generator/references/examples/README.md"
      - ".opencode/skills/sk-design/design-mcp-open-design/references/guarded-proxy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: Template conformance for design-md-generator and design-mcp-open-design
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-remaining-mode-conformance |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Completion Pct** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All three originally-scoped fixes landed, plus an exhaustive-sweep addendum that found the same bug classes (off-enum `importance_tier`/`contextType`, missing `## 1. OVERVIEW`) recurring in 13 additional files across both modes. Every reference/asset file in both packets now carries an in-enum 5-field frontmatter block and a numbered, ALL-CAPS `## 1. OVERVIEW`-first H2 structure, except one documented structural exception (`design-md-format.md`) and 8 documented-exempt output exemplars.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `design-md-generator/references/extraction-workflow.md` | Modified | `importance_tier: "high"` -> `important` |
| `design-md-generator/assets/cardinal-rules-card.md` | Modified | `importance_tier: "high"` -> `important` (2nd instance, found via sweep) |
| `design-md-generator/references/guided-run.md` | Modified | `contextType: reference` -> `implementation`; added OVERVIEW, renumbered 1-4 -> 2-5 |
| `design-md-generator/references/authoring-boundary.md` | Modified | Added OVERVIEW, renumbered 1-7 -> 2-8, sub-numbered 2.1-2.4 -> 3.1-3.4 |
| `design-md-generator/assets/source-of-truth-router-card.md` | Modified | Added OVERVIEW, renumbered 1-5 -> 2-6 |
| `design-md-generator/references/writing-style-guide.md` | Modified | Intro trimmed to 1-2 sentences; moved paragraph into OVERVIEW |
| `design-md-generator/references/design-md-format.md` | Modified | Sections 3-15 ALL-CAPS titled (literal output heading kept inline); `## Section presence` -> `## 16. SECTION PRESENCE` |
| `design-md-generator/references/examples/{vercel,linear,supabase,stripe}/DESIGN.md` (4) | Modified (frontmatter only) | `contextType: reference` -> `general`; documented exemption from body-structure rules |
| `design-md-generator/references/examples/{vercel,linear,supabase,stripe}/writing-notes.md` (4) | Modified (frontmatter only) | Same fix, same exemption |
| `design-md-generator/references/examples/editorial-exemplar.md` | Modified | `contextType` fixed; added OVERVIEW, renumbered 1-4 -> 2-5 (NOT exempt — genuine guidance) |
| `design-md-generator/references/examples/README.md` | Created | Records the relocate-vs-exempt decision and its rationale |
| `design-md-generator/manual-testing-playbook/authoring-boundary/authoring-boundary.md` | Modified | Removed stray `contextType` field (not in scenario template) |
| `design-md-generator/manual-testing-playbook/source-of-truth/source-of-truth-card.md` | Modified | Removed stray `contextType` field |
| `design-mcp-open-design/references/cli-child-pairing.md` | Modified | Added OVERVIEW; numbered/uppercased 9 H2s -> `## 2.`-`## 10.` |
| `design-mcp-open-design/references/freshness-invalidation.md` | Modified | Added OVERVIEW; numbered/uppercased 4 H2s -> `## 2.`-`## 5.` |
| `design-mcp-open-design/references/guarded-proxy.md` | Modified | Added OVERVIEW; numbered/uppercased 10 H2s -> `## 2.`-`## 11.` (worst case, 234 lines) |
| `design-mcp-open-design/references/inner-generator-binding.md` | Modified | Added OVERVIEW (with new Dependencies subsection); numbered/uppercased 5 H2s -> `## 2.`-`## 7.` |
| `design-mcp-open-design/references/smart-router-pseudocode.md` | Modified | Added OVERVIEW + new `## 2. IMPLEMENTATION` wrapper; `## References` -> `## 3. REFERENCES` |
| `design-mcp-open-design/references/design-parity-transport.md` | Modified | 6th file found via sweep; added OVERVIEW, renumbered 1-5 -> 2-6, `## RELATED` -> `## 7. RELATED RESOURCES` |
| `sk-design/leaf-manifest.json` | Regenerated | Picks up the new `references/examples/README.md` leaf |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every candidate file was read in full before editing (never fixed from a grep snippet alone), and each hypothesized defect was checked against the real file before touching it — several `grep`-shaped false positives (headings and frontmatter-looking text sitting inside fenced code blocks, e.g. `anti-patterns.md`, `writing-style-guide.md` line 740, `design-md-format.md` line 219/225, `color-role-taxonomy.md` line 355) were confirmed as DISPROVEN and left untouched rather than "fixed."

For each of the 5 (then 6, after the sweep found `design-parity-transport.md`) unnumbered `design-mcp-open-design` files: the pre-edit H2 list was captured with `grep -nE "^## "`, an `## 1. OVERVIEW` section was authored from the file's own existing intro/dependency prose (never invented content), and every subsequent H2 was renumbered in place with a dedicated Edit call per heading to avoid cross-substring collisions (e.g. `## Parent Re-Validation` vs. `### Parent Re-Validation Extension` in `cli-child-pairing.md` required line-anchored context, not a bare string match). Cross-reference blast radius was checked before every renumbering (`rg` for `file.md#`, `§N` fragment citations) — none were found for any of the 6 renumbered files, so renumbering was safe.

For the exemplar `DESIGN.md` files: a citing-site check found only whole-file path citations (no section-number anchors), which drove the documented-exemption decision over relocation — relocating would have required updating every citing site (`SKILL.md`, feature-catalog, 3 playbook scenarios) for zero conformance gain, since the underlying issue was a frontmatter-schema field value, not the body content the citations actually reference.

`design-md-format.md` received a narrower fix than full conformance: its sections 3-15 use literal backtick-quoted target-output heading text as their H2 title (e.g. `` ## 3. `## Tokens — Colors` ``), which is non-ALL-CAPS by the letter of the rule. These were reformatted to an ALL-CAPS descriptive title with the literal quote moved to the first line of body prose, preserving every `§3`/`§4/§5`/`§9`/`§11`/`§13`/`§16` cross-reference used by 15+ other files and 5 backend TypeScript/JS source comments. The file's `## 0.`-based section numbering and absence of an `## 1. OVERVIEW` section were deliberately NOT restructured — see Key Decisions below.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| **Relocate-vs-exempt: documented exemption** (`references/examples/README.md`) | Citing-site check found only whole-file path citations, no section anchors; relocating would force updating every citing site for zero conformance gain since the real issue is a frontmatter field value, not body placement. The 4 `writing-notes.md` companions inherit the same exemption (editorial notes on the same exemplar); `editorial-exemplar.md` does NOT — it is genuine guidance, not an output mockup, so it was brought to full conformance instead. |
| Never rewrite the exemplar `DESIGN.md`/`writing-notes.md` files' content | They are measured output artifacts and editorial annotations, not authored guidance prose; only the `contextType` frontmatter value changed |
| `design-md-format.md`: fix header casing, do NOT restructure numbering or add OVERVIEW | The file's `## 0.`-`## 15.` numbering is load-bearing: 15+ files (`quality-checklist.md`, `writing-style-guide.md`, `cardinal-rules-card.md`, 6+ manual-testing-playbook scenarios) and 5 backend `.ts`/`.js` source comments cite exact section numbers (`§3`, `§4/§5`, `§9`, `§11`, `§13`, `§16`). Inserting an OVERVIEW at position 1 would shift every downstream number and require touching files outside this packet's ownership. The ALL-CAPS-casing defect was fixable without renumbering (literal quote moved to body prose), so that part was fixed; the numbering/OVERVIEW gap is recorded as a documented structural exception, not silently ignored. |
| Leave `mcp-wiring.md`, `od-cli-reference.md`, `tool-surface.md` untouched | Confirmed already fully conformant (numbered ALL-CAPS H2s, OVERVIEW first) — scope discipline, no unnecessary edits |
| `design-parity-transport.md` brought in-scope despite not being in the original 5 | The exhaustive-sweep instruction explicitly covers this case: found missing `## 1. OVERVIEW` during the audit, same bug class as the other 5, fixed under the same rule |
| Defer `003-design-motion`'s conformance to `010-motion-merge` | Avoids duplicating or conflicting with that packet's wholesale rewrite |
| Do not rename `INSTALL-GUIDE.md` or exemplar `DESIGN.md` filenames to satisfy `package_skill.py --check --strict`'s kebab-case rule | Both filenames are mandated by their own governing conventions; the checker's exemption list already covers `README.md`/`SKILL.md` but not these two — a pre-existing gap in a shared script this packet does not own, not a defect in this packet's content |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Enum sweep (`importance_tier`, `contextType`) | PASS | Both packets, all `references/`+`assets/` | `rg` for off-enum values across both skills returns nothing after fixes |
| Exemplar-file citation check | PASS | 4 `DESIGN.md` + 4 `writing-notes.md` | Only whole-file path citations found; documented exemption chosen |
| Heading numbering/OVERVIEW sweep | PASS | 20 `design-md-generator` refs/assets + 9 `design-mcp-open-design` refs | Every file opens with `## 1. OVERVIEW` except the one documented exception (`design-md-format.md`) and the 8 exempt exemplar files |
| `python3 .../package_skill.py design-md-generator --check` (non-strict) | PASS | — | 10 pre-existing warnings (SKILL.md word count, `tokens.json` file-type, kebab-case filenames), none introduced by this packet |
| `python3 .../package_skill.py design-md-generator --check --strict` | FAIL (pre-existing) | — | Fails only on `INSTALL-GUIDE.md` + 4 exemplar `DESIGN.md` kebab-case filenames — mandated names, checker gap predates this packet (no renames were made this session; confirmed via `git diff --name-status`, 0 renames) |
| `python3 .../package_skill.py design-mcp-open-design --check` (non-strict) | PASS | — | 2 pre-existing warnings (`INSTALL-GUIDE.md`, `scripts/_common.sh` filenames) |
| `python3 .../package_skill.py design-mcp-open-design --check --strict` | FAIL (pre-existing) | — | Same root cause as above |
| `node .../parent-skill-check.cjs sk-design` | OK, 0 warnings | Whole hub | Required a `generate-leaf-manifest.cjs --write` re-run after adding `references/examples/README.md`; re-check confirms `10b-byte-drift` PASS |
| `node --test transport-grounding.test.mjs` | 37/37 PASS | `design-mcp-open-design` | No regressions |
| Backend `npm run test` | 173/173 PASS | `design-md-generator/backend` | No regressions |
| Checklist | 14/14 verified | 100% | See `checklist.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`design-md-format.md` retains `## 0.`-based numbering and no `## 1. OVERVIEW`** — a deliberate, documented exception (see Key Decisions) because the numbering is cross-referenced by 15+ files and 5 backend source files. A future operator-approved restructure would need to update every `§N` citation atomically across the whole hub, not just this file.
2. **`package_skill.py --check --strict` fails on both packets for pre-existing, out-of-packet-scope reasons**: `INSTALL-GUIDE.md` and exemplar `DESIGN.md` filenames (mandated by their own conventions, not covered by the checker's `README.md`/`SKILL.md` exemption) and `scripts/_common.sh` (pre-existing, not a documentation file). Non-strict `--check` PASSes for both. Fixing the checker itself is out of this packet's ownership (`design-md-generator/` and `design-mcp-open-design/` only).
3. **`references/examples/README.md` is a new file**, not previously part of either packet's tree — required regenerating `sk-design/leaf-manifest.json` to keep `parent-skill-check.cjs` green.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Fix only the named 5 `design-mcp-open-design` heading files + 4 `DESIGN.md` exemplars + 1 enum | Fixed those plus 13 more files with the same bug classes | The dispatching task explicitly required an "exhaustive sweep" beyond the confirmed-defect list; new instances of the identical, already-scoped bug classes were treated as in-scope per this spec's own Edge Cases section ("a sixth file turns out unnumbered... treat as in-scope") |
| `design-md-format.md` not named in original scope | Header-casing fixed; numbering/OVERVIEW left as a documented exception | Found during the sweep; casing was safely fixable, renumbering was not (cross-reference blast radius) |

<!-- /ANCHOR:deviations -->
