---
title: "Implementation Summary: Codex Theater / Meta-Criticism Copy Tell"
description: "The AI-fingerprint corpus now carries a tenth tell — the Codex theater/meta-criticism copy habit — wired end-to-end across six artifacts, with the first copy/text matcher among nine CSS-structural ones. Both checkers pass at 10=10, the tell fires and the clean doesn't, off-family safety holds both ways, and a live hit stays advisory."
trigger_phrases:
  - "codex theater tell summary"
  - "ai fingerprint theater meta criticism implementation"
  - "first copy text matcher fingerprint"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/011-codex-theater-tell"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Ship tenth theater tell across six artifacts; verify both checkers 10=10 with PASS and BITE"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md"
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The first copy/text matcher carries no off-family cross-fire risk in practice: it fires on no structural fixture and no structural matcher fires on the copy fixture"
      - "owner: interface chosen for the copy/voice tell, matching the house ownership for voice-layer calls"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-codex-theater-tell |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The AI-fingerprint catalog flagged nine Codex/Gemini/general slop tells but never caught copy that narrates its own importance by calling a surface a kind of theater ("design theater", "engagement theater") instead of naming concrete user harm. You can now detect that habit: the corpus carries a tenth tell, the Codex "theater / meta-criticism copy" tell, wired end-to-end across six artifacts so both registry parity and fixture detection stay green at ten. This is also the first copy/text detector in the corpus — the nine existing matchers all scan CSS structure, while this one scans visible body copy.

The change is additive. The nine existing tells, fixtures, and matchers are untouched, and `ai-fingerprint-registry-check.mjs` needed no code edit. The tell lands as one reconciled set: a catalog entry, a registry row, a clean+tell fixture pair, a matcher, and two consistency mirrors.

### The tenth tell, reconciled across the parity machinery

The catalog gains `### 2.6 Theater / meta-criticism copy` under `## 2. CODEX TELLS`, with a Check / Owner / Severity block in the house style and an explicit advisory note. The registry gains the tenth row, reconciled to the catalog slug, carrying exactly the seven required fields:

- `tell_id`: `theater-meta-criticism-copy`
- `model_family`: `codex`
- `severity_floor`: `P2`
- `owner`: `interface`
- `fixture_id`: `ai-fingerprint-theater-meta-criticism-copy`
- plus `self_defect_prompt` and the canonical `deterministic_check` sentence

The registry parses to ten rows, and `ai-fingerprint-registry-check.mjs` confirms the catalog↔registry bijection holds at ten with every `fixture_id` resolving to a directory carrying `clean.html` and `tell.html`.

### The first copy/text matcher

`ai-fingerprint-fixture-check.mjs` gains a tenth `CHECK_MATCHERS` entry keyed to the canonical `deterministic_check`, mapped to `{ tellId: "theater-meta-criticism-copy", matches: matchesTheaterMetaCriticism }`. `matchesTheaterMetaCriticism` runs `/\b(\w+)\s+theater\b/i` over `extractVisibleBodyText(source)` — it scans visible body copy with the markup stripped, so a `theater` token inside a `<style>` block, an attribute, or a title does not fire it. The nine existing matchers read CSS structure; this is the first to read copy, which made off-family cross-fire the real novelty risk and the reason the verification checks it both ways.

### The fixture pair

A new directory `ai_fingerprint_fixtures/ai-fingerprint-theater-meta-criticism-copy/` carries the deterministic evidence. `tell.html` is faithful page copy that includes a `<word> theater` meta-criticism phrase and otherwise uses plain, safe CSS that trips none of the nine structural matchers, so it fires exactly `[theater-meta-criticism-copy]`. `clean.html` is the near-twin whose copy avoids the pattern entirely and fires `[]`.

### Advisory framing, stated honestly

The matcher fires deterministically so the fixture gate is repeatable, but the catalog labels a live hit advisory. A `<word> theater` match in a real surface is a hint, not a verdict: it false-positives on legitimate copy like "movie theater" and "home theater", so the catalog entry marks it flag-and-confirm rather than an automatic high-severity finding. That honesty lives in the catalog, not hidden in the matcher.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md` | Modified | Added `### 2.6 Theater / meta-criticism copy` under `## 2. CODEX TELLS` with Check / Owner / Severity and the movie/home-theater advisory caveat |
| `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json` | Modified | Added the tenth row reconciled to the catalog slug, seven fields, `model_family: codex`, `severity_floor: P2`, `owner: interface` |
| `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai-fingerprint-theater-meta-criticism-copy/tell.html` | Created | Fires only `[theater-meta-criticism-copy]`; plain CSS trips no structural matcher |
| `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai-fingerprint-theater-meta-criticism-copy/clean.html` | Created | Near-twin that fires `[]` |
| `.opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs` | Modified | Added the tenth matcher + `matchesTheaterMetaCriticism`, the first copy/text matcher (`\b(\w+)\s+theater\b` over visible body text) |
| `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md` | Modified | Added the `theater-meta-criticism-copy` self-audit prompt under `## Codex` (mirror) |
| `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/README.md` | Modified | Added the tenth corpus-map row (mirror) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) added the tell as a reconciled four-artifact set plus two mirrors, authoring the canonical `deterministic_check` sentence once and reusing it byte-for-byte as the matcher map key so the registry-driven binding holds. The orchestrator then verified acceptance independently, reading exit codes without pipe-masking and with the corpus in sync, and this summary re-ran both checkers from the scripts directory.

`node ai-fingerprint-registry-check.mjs` prints `PASS ai-fingerprint-registry-check: catalogTells=10 registryRows=10` and exits 0; removing the theater registry row makes it exit 1, so the parity gate bites. `node ai-fingerprint-fixture-check.mjs` prints `PASS ai-fingerprint-fixture-check: registryRows=10 samples=20 matcherCount=10` and exits 0 — the new `tell.html` fires `[theater-meta-criticism-copy]`, the new `clean.html` fires `[]`, and there are zero off-family cross-fires in either direction across all twenty samples; blanking the theater phrase out of `tell.html` makes it exit 1 with `FAIL fixture-scan`, so the detection gate bites too. The slug agrees across catalog, registry, matcher, and fixture (`theater-meta-criticism-copy` / `ai-fingerprint-theater-meta-criticism-copy`), `node --check` passes on both `.mjs`, and the registry JSON parses to ten rows. hubRoute held `23/5/0` because the fingerprint fixtures are off the hubRoute corpus, and the change set is exactly the six fingerprint artifacts — the scorer, router, and hubRoute fixtures are untouched, and no fingerprint-count vitest existed to update.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Land the tell as four reconciled artifacts plus two mirrors, not a catalog entry alone | The registry checker enforces a catalog↔registry bijection and the spec's fire/no-fire acceptance runs through the registry-driven fixture checker, so a catalog tell with no row, fixture, or matcher turns both checkers red |
| Make the matcher scan visible body text, not raw source | A `theater` token in a `<style>` block, attribute, or title is not meta-criticism copy; stripping markup keeps the first copy matcher narrow and avoids structural noise |
| Gate deterministically but label a live hit advisory | The fixture gate must be repeatable, but `<word> theater` false-positives on "movie theater" / "home theater", so a real-surface hit is flag-and-confirm, never an automatic high-severity finding |
| Verify off-family safety both ways | This is the first copy matcher among nine structural ones, so the real risk was cross-fire; confirming the theater matcher fires on no structural fixture and no structural matcher fires on the copy fixture closes it |
| Author the `deterministic_check` sentence once and reuse it as the matcher key | Check-string byte parity between the registry row and the matcher map key is the most common reconciliation break; one canonical sentence prevents it |
| Choose `owner: interface` for the copy/voice tell | The theater habit is a voice-layer call, so the interface owner matches the house ownership for copy/voice tells |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node ai-fingerprint-registry-check.mjs` | PASS, exit 0, `catalogTells=10 registryRows=10` |
| Registry BITE: remove the theater row | FAIL, exit 1 (parity gate bites) |
| `node ai-fingerprint-fixture-check.mjs` | PASS, exit 0, `registryRows=10 samples=20 matcherCount=10` |
| `tell.html` detection | Fires `[theater-meta-criticism-copy]` and nothing else |
| `clean.html` detection | Fires `[]` |
| Off-family safety (both ways) | Zero cross-fires: the theater matcher fires on none of the nine existing samples; the nine structural matchers fire on neither new fixture |
| Fixture BITE: blank the theater phrase from `tell.html` | FAIL, exit 1, `FAIL fixture-scan` (detection gate bites) |
| Slug agreement | `tell_id` = matcher `tellId` = `theater-meta-criticism-copy`; `fixture_id` = `ai-fingerprint-theater-meta-criticism-copy` |
| `node --check` both `.mjs` | OK |
| Registry JSON parse | Parses to ten rows |
| hubRoute scorer | `23/5/0`, delta 0 (fingerprint fixtures off the hubRoute corpus) |
| Evergreen + scope audit | Grep clean; change set is exactly the six fingerprint artifacts; scorer/router/hubRoute fixtures untouched |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata fingerprint residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A live hit is advisory, not a verdict.** The matcher gates the fixture deterministically, but a `<word> theater` match in a real surface false-positives on legitimate copy ("movie theater", "home theater"). The catalog marks it flag-and-confirm, so it is a hint to confirm context, not an automatic high-severity finding.
2. **First copy matcher, scoped to one pattern.** `matchesTheaterMetaCriticism` detects exactly the `\b(\w+)\s+theater\b` meta-criticism shape. Other meta-criticism copy habits (for example "performative", "ceremony") are not covered; they would each need their own reconciled tell.
3. **Visible-text scan only.** The matcher reads `extractVisibleBodyText`, so a theater phrase that only appears in a `<style>` block, an attribute, or a non-rendered node is intentionally not flagged.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
