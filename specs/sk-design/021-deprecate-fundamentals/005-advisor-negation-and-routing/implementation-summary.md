---
title: "Implementation Summary"
description: "A negated write no longer earns sk-doc a document-writing boost. The design-document and chart-colour prompts now reach the modes that own them. The v4.0.1.0 release entry is updated and its tag and release are republished."
trigger_phrases:
  - "advisor negation and routing implementation summary"
  - "negated write fix"
  - "borderline route fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/005-advisor-negation-and-routing"
    last_updated_at: "2026-11-05T15:30:00Z"
    last_updated_by: "markdown"
    recent_action: "Republished the v4.0.1.0 tag and release on d1c57bb81d"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-021-005-advisor-negation-and-routing"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-advisor-negation-and-routing |
| **Status** | Complete |
| **Completed** | 2026-11-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A negated write no longer earns sk-doc a document-writing boost, so a review that asks for no edits now stays with sk-code. A design-document review now reaches the sk-doc quality mode and a chart-colour review now reaches the sk-design chart mode. The v4.0.1.0 release entry names this work, and its tag and release are republished.

### Phase 5: advisor-negation-and-routing

The advisor explicit lane gave sk-doc a 0.7 write-doc-surface boost whenever a write verb and a doc word co-occurred. It did that even when the write verb was negated, so the labeled case rr-iter3-146 scored sk-doc 0.8445 over its sk-code gold at 0.8377. The lane now carries a `NEGATED_WRITE` pattern and an `affirmedWriteText()` helper that blanks each negated write phrase before the three write-surface tests. A new test pins three affirmed prompts and four negated prompts. The live advisor now returns sk-code first for the case.

The two borderline routes received the phrase each one lacked. The design-document prompt now sits in the sk-doc intent signals, derived trigger phrases, quality-control alias class and `DOC_QUALITY` intent. The chart-colour prompt now sits in the sk-design derived trigger phrases under both spellings. The design-document prompt returns sk-doc 0.949 first with a single `sk-create-quality-control` route and the chart-colour prompt returns sk-design 0.9268 first with a single `sk-design-chart` route.

The negation case is class-of-bug because the pattern affects every negated write. The two borderline routes are instance-only vocabulary gaps because each one needs a phrase in the mode that owns it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | Adds the `NEGATED_WRITE` pattern and the `affirmedWriteText()` helper |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/negated-write-surface.vitest.ts` | Created | Covers three affirmed and four negated write prompts |
| `.skilled/skills/sk-doc/graph-metadata.json` | Modified | Adds "document for clarity" to the intent signals and derived trigger phrases |
| `.skilled/skills/sk-doc/hub-router.json` | Modified | Adds the `create-quality-control-aliases` class |
| `.skilled/skills/sk-doc/ROUTER.md` | Modified | Adds the `DOC_QUALITY` intent |
| `.skilled/skills/sk-design/graph-metadata.json` | Modified | Adds "chart color system" and "chart colour system" to the derived trigger phrases |
| `.skilled/skills/system-skill-advisor/changelog/v0.18.3.0.md` | Created | Records the negated-write fix and the accuracy rise |
| `.skilled/skills/sk-doc/changelog/v2.4.2.0.md` | Created | Records the design-document route |
| `.skilled/skills/sk-design/changelog/v3.0.0.0.md` | Created | Records the chart-colour route |
| `.skilled/changelog/skilled/v4.0.1.0.md` | Modified | Points open design values at `sk-code-frontend` and names the branch work |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The negation fix ran in the advisor runtime. The lane now blanks a negated write phrase and the new test covers three affirmed and four negated prompts. The rebuild moved tsAlsoCorrect from 103 to 104 and the full corpus from 155 to 157. The parity regression list lost rr-iter3-146 and the ledger moved from 75 to 74.

The two borderline routes ran as vocabulary additions to the sk-doc and sk-design metadata. A fresh Opus agent at medium effort made both edits. A later replay returned sk-doc 0.949 first for the design-document prompt and sk-design 0.9268 first for the chart-colour prompt. The five protected routes kept their prior selection and the routing gates passed. The operator chose to update the v4.0.1.0 entry in place and republish its tag. Main was fast-forwarded to the branch, then the tag and the GitHub release were deleted and recreated on `d1c57bb81d` with a body built from the entry.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the scorer negation rather than record the regression | The case is a real misread. The fix raises the parity and baseline counts |
| Tune the two borderline routes with a fresh Opus agent at medium effort | The operator chose targeted vocabulary additions over a wider router change |
| Keep the v4.0.1.0 version and reopen the existing entry | The entry is unpublished, so the same release can carry the branch |
| Leave the older chart phrases in sk-doc as they are | They predate this change and the two new sk-design phrases own the chart-colour prompt |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` in the advisor runtime | PASS, build completed |
| python-ts-parity | PASS, tsAlsoCorrect 103 -> 104 and rr-iter3-146 left the regression list |
| Accepted list and ledger | PASS, the case left both and the ledger moved from 75 to 74 |
| Scorer eval baseline | PASS, full corpus 157 at 0.8051, holdout 50 and ambiguity 20 |
| Legacy advisor-corpus-parity | PASS with caveat, 108 -> 109 and the pinned 110 is unreached on main too |
| Full advisor suite | PASS with caveat, 1371 passed, 1 failed and 8 skipped. The failure is the same legacy pin as main |
| Live advisor rr-iter3-146 | PASS, sk-code 0.8377 first |
| Design-document route | PASS, sk-doc 0.949 first and a single `sk-create-quality-control` |
| Chart-colour route | PASS, sk-design 0.9268 first and a single `sk-design-chart` |
| Five protected routes | PASS, design review findings, review this design, review this screen, code review and what padding should this have kept their prior selection |
| Routing gates | PASS, intent signals missing=0 orphans=0, compiled-route guard fresh, sync 55/55, vocabulary reach PASSED, parent-skill-check OK on sk-doc and sk-design, Hermes 65/65 and advisor parity unchanged |
| Release entry and tag | PENDING |
| `validate.sh --strict` on this folder | PASS, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The two new routes have thin margins of 0.007 and 0.020.** A later vocabulary edit can move them, so rerun both replays and the five protected prompts.
2. **The advisor suite keeps one legacy failure.** It is the same pin as main and this phase does not change it.
3. **The legacy advisor-corpus-parity reads 109 against a pinned 110.** The same gap exists on main and this phase does not change it.
4. **The release was republished.** Anyone who fetched the old v4.0.1.0 tag holds an object that now differs from origin, and `git fetch --tags --force` updates it.
5. **sk-doc's derived trigger phrases still list older chart phrases.** They predate this change and stay as they are.
<!-- /ANCHOR:limitations -->

---
