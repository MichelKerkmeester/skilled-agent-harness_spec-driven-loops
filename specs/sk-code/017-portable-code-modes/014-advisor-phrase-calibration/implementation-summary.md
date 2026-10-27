---
title: "Implementation Summary"
description: "A hub that declares the exact phrase a prompt typed now outranks a surface that repeats one of its words across its metadata fields, in both the TypeScript scorer and the Python mirror, with no routing number moved."
trigger_phrases:
  - "advisor phrase calibration implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/014-advisor-phrase-calibration"
    last_updated_at: "2026-10-27T23:59:00Z"
    last_updated_by: "implementer"
    recent_action: "Shipped the explicit-lane dedup and the Python rival-phrase skip with fixture tests"
    next_safe_action: "Conductor wires this child into the parent phase table and commits"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py"
      - ".skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-advisor-phrase-calibration"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 014-advisor-phrase-calibration |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With a fixture surface that lists `browser` or `css` as both a keyword and an intent signal, `browser agent` and `css extraction` now route to the hub that declares the exact phrase, in both scorers. Before, that one repeated bare word scored twice and took the hub's own phrase.

### Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits

The report blamed two generic one-word hits. The lane breakdown showed the two hits were one word scored once per field: the explicit lane reads `intent_signals` and the SKILL.md keywords back to back, so a bare word in both scored 0.7 twice and clamped at 1.0, above the 0.88 an exact two-word phrase earns. The TypeScript lane now counts a repeated bare word once per skill and leaves multi-word repeats as they were. A first version collapsed every repeat, and a review caught it flipping `help me with markdown notes in this repo` from mcp-tooling to sk-doc, because mcp-tooling declares `markdown notes` in both fields on purpose. The Python mirror skips a bare-word keyword that repeats its own matched signal only when another skill matched an exact multi-word signal holding the word, because its scale is tuned with other repeats in it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | Count a repeated single-word author phrase once per skill |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | Return matched signals; skip a one-token repeated keyword under a rival exact phrase |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts` | Created | Five cases: two fixture phrases, distinct-word control, multi-word control, and one case that runs both scorers on the same fixture skills root |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Modified | Python fixture test, two cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts` | Modified | Four guard prompts the divergence ratchet now scores |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Recaptured: one added row, no row resolved or changed, scoring instant 2026-10-11 to 2026-10-27 |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.15.0.md` | Created | Changelog entry |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modified | Version 0.17.12.0 to 0.17.15.0 |
| `.hermes/skills/system-skill-advisor/SKILL.md` | Modified | Hermes sync of the version carrier |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every gate ran before the first scorer edit and again after it, with the runtime rebuilt in between. Each new test was run against the unchanged scorer first and failed, then passed on the changed one. Two first attempts were narrowed on evidence: the unconditional Python collapse failed the legacy corpus parity and the divergence ratchet, and the all-repeats TypeScript collapse moved the markdown-notes prompt.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Collapse rather than cap single-word hits | The breakdown shows a repeated bare word, not distinct words, and the collapse moves no measured top-1 |
| Bare words only, both sides | Multi-word repeats are specific and shipped routes rest on them; collapsing them flipped the markdown-notes prompt |
| Rival-phrase condition in Python only | The unconditional bare-word collapse dropped Python-correct rows from 113 to 111 (`rr-iter3-151`, `rr-hub6-206`); TypeScript moved nothing without it |
| Fixture skills, never the real outside surface | The probe and the tests build their own skills, so no operator-local metadata enters the repository or a gate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fixture test file against HEAD sources | FAIL: 4 of 5 (`expected 'fixture-generic-surface' to be 'fixture-automation-hub'`; cross-scorer case `native` and `python` both `fixture-generic-surface`), exit 1; the multi-word control passes on HEAD by design |
| Fixture test file after | PASS: `Tests 5 passed (5)`, exit 0 |
| Python fixture test, before (HEAD copy) | FAIL: `T243-SA-030a` and `T243-SA-030b`, generic surface 0.78 over the hub 0.69 |
| Python suite, after | PASS: `Summary: pass=89, fail=0` (baseline 87 plus 2 new), exit 0 |
| Full vitest suite | PASS: 154 files, 1306 passed, 8 skipped, exit 0 (baseline 153 files, 1301 passed, 8 skipped; 5 added tests) |
| Parity, divergence, eval and legacy corpus ratchets | PASS; the divergence corpus grew from 217 to 221 rows and the recaptured ledger reports `added: harder:c2182871dbf3`, `resolved: []`, `changed: []` |
| Python skip coverage | Fires on 2 of 221 gated prompts (`delegate to opencode`, `opencode cli`, sk-code's `opencode`), both routing to gold on both scorers; it fired on 0 before the guard rows |
| 320-prompt repeat probe, unchanged build vs this build | 0 top-1 moved; 56 top scores changed, all bare-word repeats |
| `help me with markdown notes in this repo` | mcp-tooling 0.715388 over sk-doc 0.688114 on both builds in the pinned probe regime; the live daemon shows mcp-tooling explicit 1.0 |
| Routing-accuracy capture | Identical to the committed baseline, with identical corpus, holdout and ambiguity hashes: 155/195, 49/66, 19/24, unknown 13, false fire 5, buckets 25/31, 27/32, 13/13; the harder corpus is not one of its inputs, so no denominator moved |
| `doctor-phrase-reach.cjs` | Byte-identical: `STATUS=OK phrases=118 bridges=22`, exit 0 |
| `ci-router-vocabulary-reach.cjs --json` | Same: 506 phrases, 3 unreachable all `allowed`, exit 0 |
| Real projection plus fixture surface | mcp-tooling 0.533597 over 0.418667 on `browser agent`; sk-design 0.582933 over 0.477467 on `css extraction` |
| Changelog `validate_document.py --json` | `"total_issues": 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Distinct bare words still add.** A surface that declares both `browser` and `agent` as separate words scores two hits on `browser agent` and can still tie or beat the hub. No measured prompt shows it yet; ADR-001 keeps the single-word cap ready to measure when one does.
2. **The two scorers use different rules.** Both collapse only bare words, but TypeScript always does and Python only under a rival exact phrase. The parity and divergence ratchets fail the first prompt where that difference changes a top-1.
3. **The gated Python rows guard, they do not discriminate.** `delegate to opencode` and `opencode cli` route to gold with or without the skip; the cross-scorer fixture case is the test that fails without it.
4. **One new approved divergence.** `help me with markdown notes in this repo` has the Python scorer abstain (sk-doc 0.79, mcp-tooling 0.78, both under 0.8) before and after this change, so it is recorded in the ledger rather than fixed here.
<!-- /ANCHOR:limitations -->

---
