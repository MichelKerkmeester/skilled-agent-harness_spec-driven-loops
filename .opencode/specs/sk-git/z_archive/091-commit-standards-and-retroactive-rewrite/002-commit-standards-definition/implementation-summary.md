---
title: "Phase 002 Implementation Summary: Commit Standards Definition"
description: "Locked the canonical commit-message standard via 7 ADRs across 3 deliberation groups. Produced commit-standards.md, derivation-heuristics.md, and a 20-sample validation showing 20/20 deterministic rewrite. Phase 002 complete; Phase 003 cleared to start."
trigger_phrases:
  - "112-commit-standards-definition summary"
  - "commit standards locked"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/091-commit-standards-and-retroactive-rewrite/002-commit-standards-definition"
    last_updated_at: "2026-07-14T21:12:36Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Locked 7 ADRs and 4 deliverables"
    next_safe_action: "Begin Phase 003 sk-git skill update"
    blockers: []
    key_files:
      - "decision-record.md"
      - "commit-standards.md"
      - "derivation-heuristics.md"
      - "hand-sample-validation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-close-2026-05-16"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1 Subject format — ADR-001 13-type taxonomy plus 5 scope shapes"
      - "Q2 Packet-ID prefix policy — ADR-002 strip subject keep Wave trailer"
      - "Q3 Co-Authored-By policy — ADR-003 format normalize preserve attribution"
      - "Q4 Imperative-mood retroactive — ADR-004 preserve original tense"
      - "Q5 Body policy — ADR-005 preservation only no auto authoring"
      - "Q6 Special cases — ADR-006 accept both git-default and authored forms"
      - "Q7 Length caps — ADR-007 72 hard cap 50 soft 72 wrap"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Phase 002 Implementation Summary: Commit Standards Definition

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

The canonical commit-message standard for this repo is now locked. Seven ADRs cover subject format, packet-ID handling, trailer policy, imperative-mood retroactive enforcement, body policy, special cases, and length caps. The standard was validated against 20 random HEAD commits and produced a deterministic rewrite for 20/20 entries with zero `needs_human_review` cases. Phase 003 (sk-git skill update) is now unblocked.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 2 of 5 |
| **Status** | Complete |
| **Closed** | 2026-05-16 |
| **Outputs** | `decision-record.md`, `commit-standards.md`, `derivation-heuristics.md`, `hand-sample-validation.md` |
| **Acceptance** | 20/20 sample deterministic, 0 needs_human_review |
| **Next** | Phase 003 — apply standards to sk-git in 4 runtime mirrors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four canonical artifacts under this phase folder:

1. **`commit-standards.md`** — the canonical standard, replacing the de facto authority that was previously split across `sk-git/SKILL.md §3` and `assets/commit_message_template.md`. Covers:
   - Subject form: `type(scope): subject` with 13-type taxonomy and 5 scope shapes
   - Body wrap and length rules
   - Trailer policy (Co-Authored-By canonical case, Wave trailer for retroactive)
   - Special cases (merge, revert, fixup, release)
   - 6 worked examples spanning happy-path through retroactive-rewrite

2. **`derivation-heuristics.md`** — algorithmic first-match rules organized as 6 ordered rules (Rule 1 packet-ID extraction → Rule 1.5 type-prefix extraction → Rule 2 scope derivation → Rule 3 type derivation → Rule 4 trailer normalization → Rule 5 special cases → Rule 6 subject composition + length-cap trim). Phase 004's cli-devin prompts will reference this directly. Output schema includes a flag set for `needs_human_review`, `subject_hard_truncated`, `body_augmentation_recommended`, etc.

3. **`hand-sample-validation.md`** — 20-commit deterministic-rewrite proof. Each commit walked through all 6 rules; outcome tabulated:
   - 7 unchanged (≤72 chars, scope+type valid)
   - 3 em-dash split (Rule 6b moved secondary clause to body)
   - 10 hard-truncated (Rule 6c — 2 of these also had packet-ID prefix stripped)
   - **0** `needs_human_review`

4. **`decision-record.md`** — 7 ADRs (ADR-001 through ADR-007). All `Status: Accepted` with at least 2 alternatives considered each.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The Phase 002 plan called for `sequential_thinking` MCP. That server is registered in this repo's opencode runtime but is not wired into the active Claude Code runtime. Equivalent rigor was applied via explicit structured reasoning organized into the 3 thematic groups from the plan:

- **Group A** (subject format + length caps): deliberated against the actual length distribution from `evidence/sample-20.txt` (median 70, max 101) and the observed type-vocabulary diversity.
- **Group B** (packet-ID + Co-Authored-By + imperative-mood): grounded in `evidence/sample-packet-id.txt` (5 W3.x commits showing the prefix pattern) and `evidence/sample-coauthor.txt` (5 commits showing the canonical trailer is already in use for recent work).
- **Group C** (body policy + special cases): grounded in `evidence/sample-merges.txt` (both git-default and authored merge forms observed) and the body-presence pattern across `sample-20.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

The 7 ADRs in `decision-record.md` lock these choices:

- **ADR-001**: 13-type taxonomy (canonical 8 + `review` `iter` `research` `remedy` `scaffold`); 5 scope shapes (skill, spec, hierarchical-spec, multi-spec, release-dot) plus fallbacks (`agents`, `commands`, `config`, `readme`, `docs`, `repo`).
- **ADR-002**: Strip `NNN W{wave}.{sub-wave}:` packet-ID prefix from subject; preserve as `Wave:` body trailer.
- **ADR-003**: Format-normalize Co-Authored-By only — preserve actual model attribution. No retroactive canonicalization to current model.
- **ADR-004**: Imperative-mood is forward-only. Retroactive rewrites preserve original tense.
- **ADR-005**: Body preservation-only. No auto-authoring. Substantial-diff empty-body commits get `body_augmentation_recommended` flag but Phase 005 does not auto-fix.
- **ADR-006**: Accept both git-default and authored forms for merge/release. Reverts/fixups preserved exactly.
- **ADR-007**: Subject 72-char hard cap (50 soft); body 72-char wrap; no body max.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **20-sample determinism**: 20/20 commits produce a single unambiguous rewrite. Zero `needs_human_review`. Documented in `hand-sample-validation.md` with per-commit rule trace.
- **ADR coverage**: each rule in `derivation-heuristics.md` cross-references the source ADR (table at end of derivation-heuristics.md).
- **Strict validation**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ./002-commit-standards-definition --strict` exits 0 (pre-implementation-summary state).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Hard-truncate frequency**: 9/20 (45%) of sampled commits exceed 72 chars and require Rule 6c truncation. Truncated subjects are functional but visually rough (mid-word cuts). A future refinement could add `;` as a Rule 6b secondary-clause separator to reduce this to ~25%. Not blocking; deferred.
- **Body augmentation backlog**: `body_augmentation_recommended` flag will fire on a meaningful fraction of HEAD commits during Phase 005. The flag is informational — Phase 005 does not act on it. A future packet could use the flagged list as input for targeted body-authoring work.
- **AGENTS_Barter sibling**: the sibling repo's commit conventions were not evaluated. Phase 003 will decide whether to sync this standard there.
- **commit-msg hook**: an optional pre-commit/commit-msg hook enforcing the standard on new commits is deferred (Phase 003 spec says optional sub-decision).
<!-- /ANCHOR:limitations -->
