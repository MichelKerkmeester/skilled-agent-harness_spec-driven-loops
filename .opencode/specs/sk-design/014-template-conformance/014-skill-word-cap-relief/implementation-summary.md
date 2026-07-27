---
title: "Implementation Summary: design-interface SKILL.md word-cap relief"
description: "Outcome record for the prose-only reduction of design-interface/SKILL.md from 4,991 to 4,760 words: what moved, what was deliberately left, why the on-record new-sub-document proposal was not taken, and the baseline-versus-after gate numbers."
trigger_phrases:
  - "skill word cap relief summary"
  - "design-interface SKILL.md word count result"
  - "motion sequence relocation outcome"
importance_tier: "important"
contextType: "implementation"
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
      - "How much relief was achievable without deleting substance? 231 words, headroom 9 to 240."
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: design-interface SKILL.md word-cap relief
<!-- SPECKIT_LEVEL: 2 -->
<!-- PHASE_LINKS: parent=../spec.md; predecessor=013-design-command-decomposition-research -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-skill-word-cap-relief |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Completion Pct** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### The Numbers

Measured with the checker's own method — `len(content.split())` over the raw file including frontmatter, per `package_skill.py:430` — not `wc -w`.

| Point | Words | Headroom vs 5,000 cap |
|-------|-------|-----------------------|
| Baseline (`HEAD`) | 4,991 | 9 |
| After | 4,760 | 240 |
| Delta | −231 (−4.6%) | 27× more headroom |

The checker independently reports the same figures: its pre-edit warning read `SKILL.md has 4991 words`, its post-edit warning reads `SKILL.md has 4760 words`, both with `Result: PASS`.

### Where the Words Actually Were

Per-section measurement before editing, which is what aimed the cuts:

| Region | Words | Disposition |
|--------|-------|-------------|
| Router block (fenced Python) | 805 | Frozen — untouched |
| Resource Loading Levels table | 628 | Largest safe source; one-home rule applied |
| §4 RULES | 578 | Normative core — untouched |
| §5 Core References index | 565 | Trimmed where it was a fourth statement |
| §3 head through Two-Pass | 504 | Meta-narration only |
| §2 Smart Routing prose | 400 | Routing precedence — untouched |
| §6 Success Criteria | 290 | Checkable criteria — untouched |
| §3 Corpus Relational Exemplar | 267 | Sole home of the authority order — untouched |
| §3 Motion Design Workflow | 119 | Downstream sequence relocated |

### What Moved

The Motion Design Workflow's downstream sequence left `SKILL.md` §3 and became `## 7. THE FULL MOTION SEQUENCE` in `references/motion/animation-decision-framework.md` — eight ordered steps from the gate through purpose and budget, timing/easing/material, the reduced-motion equivalent, the three pass-or-fail cards, and the `sk-code` handoff. What stayed inline in `SKILL.md` is the gate statement itself and the failed-gate-ships-instant rule, plus a pointer to §7.

The placement is better than the original, not merely smaller: `animation-decision-framework.md` is already the first entry in all six `MOTION_*` `RESOURCE_MAP` values, so the sequence now loads on every motion intent.

### What Was Trimmed, and Where It Still Lives

The governing rule was one home per resource: the Resource Loading Levels table answers *which tier and when to load*; the Core References index answers *what the file is*. Descriptions that answered the index's question from inside the table were removed.

| Removed from | Surviving home |
|---|---|
| Table parentheticals for design-principles, transform-application, variation-diversity, ux-quality-reference, real-ui-loop, sk-code-handoff, preflight-card, redesign-intake, corpus | The Core References index entry for each same file |
| The redesign-intake protected-items list (URLs, nav labels, form fields, legal copy, locked tokens) | §3 Required sk-code Build Manifest, which states it as an instruction |
| "relocated in whole from the retired `motion` mode" (twice) | Nothing — retired-mode residue, historical narration rather than guidance |
| The five-step flow enumerated inside the Two-Pass paragraph | The Phase Detection diagram in §2, which is where the file itself says it is diagrammed |
| "one reference, never copied, never a chooser" in §7 Integration Points | ALWAYS rule 8, which states the full initiative/ask/fallback rule |
| §8's restatement of the related-skills handoffs | §7 Integration Points |
| Verbose per-card descriptions for the eight `procedures/` entries | The §3 Procedure Card Selection table, which gives request shape, card, and required proof; all eight links are still in the index |

### Defect Corrected in Passing

§5 pointed at `manual_testing_playbook/<NN>--<topic>/`. On disk the directory is `manual-testing-playbook/` and the topic folders are unnumbered kebab-case (`color/`, `data-viz/`, `decision/`, …). Corrected to `manual-testing-playbook/<topic>/`. This is a path reference inside the owned file, not an edit to the concurrently-held playbook directory.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline first: the collision check confirmed the target committed and clean, the counting method was read out of `package_skill.py` rather than assumed, and all four gate baselines plus the router block hash were captured before the first edit. The relocation was written into the reference before the `SKILL.md` body was removed, so the pointer never dangled. Trims were then applied in four batches, with the word count re-measured after each so the delta could be attributed: motion −33, table −137, index and Two-Pass −40, Integration Points and §8 −21.

Verification was differential rather than declarative. The router block was extracted from `git show HEAD:` and from the working tree and compared by SHA-256 and by sub-structure; both gates were re-run and compared to their captured baselines; D5 connectivity was recomputed from disk on both sides so a newly-orphaned resource would surface as a set difference. No write git command was run at any point.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Relocate into `animation-decision-framework.md` rather than create a new `references/motion/` sub-document | A new file would be absent from `RESOURCE_MAP` and therefore unreachable by the D5 connectivity gate; the only repair is a router edit, which was frozen. The existing file is already first in every `MOTION_*` entry, so the same content lands with broader load coverage, no router change, and no `leaf-manifest.json` regeneration — which also avoids racing the concurrent sessions in this hub |
| One home per resource across the two indexes, with the table keeping tier/trigger/path | The table's tier and when-to-load are unique information the router cannot express; the descriptive half was the genuine third copy. This also makes the file cheaper to maintain, since a description now has one place to drift instead of two |
| Leave the restraint-gate redundancy fully intact | It is engineered, not accidental: `RESOURCE_MAP` has no ordering semantics, so "run the gate first" has to be asserted outside it. All three positions verified surviving |
| Leave the Corpus Relational Exemplar section (267 words) untouched despite its size | Checked `corpus/README.md` for the authority order, the decision-only handoff contract, and the no-averaging rule — it carries none of them. `SKILL.md` is their sole home, so trimming would have been deletion, not deduplication |
| Leave §4 RULES, §6 Success Criteria, and the §2 Primary Detection Signal untouched | RULES and Success Criteria are the normative and checkable core; the Primary Detection Signal encodes mode-boundary precedence (including the `clarify` alias override) that appears nowhere else in the file |
| Fix the stale playbook path instead of preserving it | It is a wrong pointer inside the file being edited; carrying a known-broken path forward to save two words would be the wrong trade |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| `package_skill.py design-interface --check` | Pass | baseline vs after | PASS both sides; word warning 4,991 → 4,760; no new warning introduced |
| `parent-skill-check.cjs .opencode/skills/sk-design` | Pass | full hub, all checks | `OK — all hard invariants passed, 0 warnings`, identical to baseline; `10b-byte-drift` PASS |
| Router byte-identity | Pass | whole block + 3 sub-structures | SHA-256 `dff7be30e67b02ca…` on both sides; `INTENT_SIGNALS`, `RESOURCE_MAP`, `DEFAULT_RESOURCE` each byte-identical; 18 intent keys both sides |
| D5 connectivity | Pass | 37 on-disk `.md` under `references/` + `assets/` | Unmapped set after = unmapped set at `HEAD` = one pre-existing entry; no new orphan |
| Relative-link resolution | Pass | both edited files | `all links resolve`; the new §7's five cross-directory paths stat-checked individually |
| Collision re-check | Pass | final `git status` | Only the two owned files changed by this session |
| Checklist | Verified | 17/17 with evidence | See `checklist.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A pre-existing D5 gap was found and left open.** `references/design-process/resource-loading-notes.md` exists on disk but appears in no `RESOURCE_MAP` entry, so the connectivity gate cannot reach it — even though the Resource Loading Levels table cites it twice for load-and-prove and citation-required rationale. Recomputing the same property against `HEAD` yields the identical gap, so it predates this packet. Closing it means adding the path to a `RESOURCE_MAP` value, which is exactly the router edit this packet froze; it needs its own scope.
2. **The realised saving is at the low end of the on-record estimate's framing.** The proposal on record estimated 150-300 words from motion prose specifically. The motion relocation alone yielded 33 words; reaching 231 required the cross-index deduplication the brief also flagged as legitimate. Reported as measured rather than as forecast.
3. **The brief described `INTENT_SIGNALS` as carrying 17 intents; the file has 18.** Counted directly: 12 non-motion plus 6 `MOTION_*`. This has no bearing on the outcome — the block is byte-identical either way — but the count is recorded here so a future reader does not treat 17 as the invariant.
4. **No behavioural verification was possible or attempted.** These are documentation artifacts with no runtime; the strongest available evidence is byte-identity of the parsed block plus gate parity, which is what was produced. Whether a future editor actually uses the reclaimed headroom well is not something this packet can guarantee.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| The on-record proposal: move motion prose into a new sub-document under `references/motion/`, saving 150-300 words | The prose was appended to the existing, already-mapped `references/motion/animation-decision-framework.md`; no new file was created | A new file is invisible to `RESOURCE_MAP` and would fail the D5 connectivity gate, whose only repair is the forbidden router edit. It would also force a `leaf-manifest.json` regeneration while other sessions hold the hub. The chosen target gives the same relocation with broader load coverage and zero gate risk. The brief invited evaluation rather than compliance, so this is recorded as a reasoned substitution, not a shortfall |
| Relief sourced primarily from motion prose | Motion prose supplied 33 of 231 words; the majority came from cross-index deduplication and fourth-copy prose | Per-section measurement showed the motion narrative was only 119 words to begin with, most of it markdown links that cost one token each under the checker's counting method. The two resource indexes, at 1,193 words combined for broadly the same resource set, were the real slack |
| §5 index entries expected to shrink uniformly | Motion index entries were largely kept; `procedures/` entries were compressed instead | The motion index entries include one of the three engineered restraint-gate statements, so they were protected; the `procedures/` entries duplicated the §3 selection table, which carries richer trigger and proof information for all eight cards |
<!-- /ANCHOR:deviations -->
