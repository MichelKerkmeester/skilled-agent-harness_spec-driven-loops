---
title: "Implementation Summary: Surface-Reality Conformance"
description: "What the cross-repo drift guard caught after the 235-file rename, how the 23 broken citations were repaired, and how the guard was proven to fail closed rather than pass falsely."
trigger_phrases:
  - "implementation summary surface reality conformance"
  - "sk-code-obsidian phase 013 findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/013-surface-reality-conformance"
    last_updated_at: "2026-08-29T00:05:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Surface-reality conformance guard + repair"
    next_safe_action: "None — this is the packet's final planned phase"
    blockers: []
    key_files:
      - "../../../tools/naming/scan-skill-references.mjs"
      - "../../../../Code_Environment/Public/.opencode/skills/sk-code/sk-code-obsidian/references/skill-reference-integrity.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-surface-reality-conformance |
| **Completed** | 2026-08-28 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

`tools/naming/scan-skill-references.mjs`, a cross-repo drift guard that extracts filename/path
citations from the `sk-code-obsidian` packet's markdown and resolves each one against the real
plugin repository tree, plus `references/skill-reference-integrity.md` documenting its method and
built-in counter-example. Both are wired into the packet: `SKILL.md` gained a reference-map row, an
assets note naming the gates runner, and two executable checks under INTEGRATION POINTS;
`scripts/run-source-gates.sh` gained the guard as a fourth check alongside naming, comments, and
folder-docs.

### What It Caught

Immediately after the phase 010 rename of 235 files, the guard's first run reported `broken : 23` —
23 citations in this packet pointing at filenames that no longer existed. At that exact moment, every
plugin-side gate was green: `tsc` 0, `build` 0, `vitest` 386, and `lint` 115 (unchanged baseline).
Nothing in the plugin repository could have noticed the drift, because the dead paths lived in
another repository's prose, in text no test imports or compiler reads. 14 documents were repaired
across 26 substitutions (several documents needed more than one fix), and a re-run confirmed
`broken : 0`.

### The Counter-Example

The guard resolves a sentinel path that must never exist and refuses to pass unless that resolution
fails — because a resolver with a broken path-join bug would also report zero broken citations
regardless of the real state. During development, the guard flagged the very document explaining
this sentinel, because the sentinel's own description in the reference doc looked like a citation. A
scoped exclusion was added for that one constant only — not a general allowlist — preserving the
guard's ability to catch every other broken citation.

### Proven In Both Directions

A deliberately dead citation was planted in a test document; the guard returned rc 1 and
`broken : 1`. The citation was then removed; the guard returned rc 0 and `broken : 0`. This confirms
the guard's result tracks the real state of the tree in both directions, not just the
already-passing case.

### Final State

`bash scripts/run-source-gates.sh` reports all four guards PASS, rc 0: naming, comments,
folder-docs, and skill-refs — the last three of which went from 249 / 19 / absent to green over the
course of phases 009-013. Plugin gates hold at the exact baseline recorded at phase 010/011's close:
`tsc` 0, `build` 0, `vitest` 386, `screenshots:verify` 180 current, `lint` 115 (100 errors, 15
warnings).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `tools/naming/scan-skill-references.mjs` | Create | Cross-repo citation-resolution drift guard |
| `references/skill-reference-integrity.md` | Create | Guard method and sentinel counter-example documentation |
| `SKILL.md` | Modify | Reference-map row, assets note, two INTEGRATION POINTS checks |
| `scripts/run-source-gates.sh` | Modify | Wire the guard in as a fourth check |
| 14 packet documents | Modify | 26 substitutions repairing citations broken by the phase 010 rename |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Replace scaffold | This leaf's spec-kit record |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The guard was built to extract citations from the packet's markdown using a pattern scoped to
plugin-tree-shaped paths, then resolve each against the live plugin repository rather than a cached
listing. Its first run against the post-rename tree produced `broken : 23`, naming each broken
citation's source document and the dead path it referenced. Each of the 14 affected documents was
opened and every dead citation corrected to the file's real, post-rename name — 26 substitutions
total, since several documents cited more than one renamed file. A re-run confirmed `broken : 0`.
The guard was then wired into `SKILL.md` and `scripts/run-source-gates.sh`, following the existing
guard family's SKIP-not-FAIL pattern for an absent script. The sentinel counter-example and the
plant-then-remove test were run directly against the guard's CLI, confirming `counter-example
rejected : yes` and the correct rc/`broken`-count transitions in both directions. Finally, the full
plugin gate suite (`tsc`, `build`, `vitest`, `screenshots:verify`, `lint`) was re-run live and
compared line-for-line against the baseline recorded at phase 010/011's close, confirming no
regression from this phase's script, documentation, or citation-repair changes.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build a dedicated resolver script rather than relying on the plugin's own gates to catch this drift | The plugin's `tsc`/`vitest`/`lint` toolchain never reads this packet's prose; only a purpose-built cross-repo resolver could have caught the 23 broken citations |
| Add a sentinel path that must never resolve, and fail the guard's own run if it does | Without this, a resolver bug that always reports zero broken citations would be indistinguishable from a genuinely clean packet |
| Scope the sentinel exclusion to one named constant rather than a general allowlist | The exclusion exists only because the sentinel's own description looked like a citation; broadening it would risk hiding real broken citations |
| Prove the guard in both directions (plant a dead citation, then remove it) | A guard that has only ever been observed passing has not been shown to detect failure; the plant-then-remove test demonstrates the rc/`broken` count actually tracks real state |
| Re-run the full plugin gate suite even though this phase touches no plugin source | Confirms the new script, documentation, and citation edits introduced no regression, rather than assuming a documentation-only phase cannot affect the build |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Guard first run (post-rename, pre-repair) | `broken : 23` |
| Guard re-run (post-repair) | `broken : 0` |
| Sentinel counter-example | `counter-example rejected : yes` |
| Planted dead citation | rc 1, `broken : 1` |
| Planted citation removed | rc 0, `broken : 0` |
| `bash scripts/run-source-gates.sh` | PASS — all four guards (naming, comments, folder-docs, skill-refs), rc 0 |
| `npx tsc --noEmit` | PASS — exit 0 |
| `npm run build` | PASS — exit 0 |
| `npx vitest run` | PASS — 386 passed |
| `npm run screenshots:verify` | PASS — 180 current |
| `npm run lint` | PASS — 115 problems (100 errors, 15 warnings), baseline unchanged |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The guard resolves paths, not claims.** A citation can point at a file that genuinely exists
   while describing its contents or purpose incorrectly. This guard cannot catch that class of drift;
   only reading keeps prose true. Carried forward as a standing risk for future phases, not solved
   here.
2. **The guard's citation-extraction pattern is scoped to this packet's markdown shape.** It was
   built and tuned against `sk-code-obsidian`'s actual citation style; extending it to other packets
   would need separate verification against each packet's own conventions before trusting its
   `broken` count there.
3. **This is the packet's final planned phase.** Phases 001-013 are now all Complete. Future work on
   this packet (adopting a class-wide `SKILL.md` header vocabulary per phase 012's reversal
   condition, or extending the reality-conformance guard to check prose accuracy) is unstarted and
   not tracked by an existing phase folder.

<!-- /ANCHOR:limitations -->
