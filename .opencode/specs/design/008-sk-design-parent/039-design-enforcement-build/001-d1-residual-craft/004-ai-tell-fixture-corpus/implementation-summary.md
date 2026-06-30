---
title: "Implementation Summary: AI-Tell Fixture Corpus and Detection Benchmark"
description: "The registry named a fixture_id per AI tell but no fixtures existed. There is now a 9-directory fixture corpus, a registry-first detection benchmark that proves each tell fires exactly its own matcher, and a registry checker extended from fixture_id format to file existence."
trigger_phrases:
  - "ai tell fixture corpus summary"
  - "design audit fixture benchmark implementation"
  - "ai fingerprint fixture detection"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/004-ai-tell-fixture-corpus"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Ship 9-dir fixture corpus, fixture-check, registry existence gate; verify PASS/BITE"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is per-tell detection runnable now: yes on curated fixtures; catalog exhaustiveness stays advisory"
      - "Did the D1-R3 fixture_id forward dependency close: yes, every registry fixture_id now resolves to real files"
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
| **Spec Folder** | 004-ai-tell-fixture-corpus |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The AI-tell registry used to name one `fixture_id` per tell with nothing behind the slug, so per-tell detection could not be run and the playbook scenario asserted detection in prose. You can now run a real corpus: nine fixture directories, each holding a faithful sample that fires nothing and a minimal sample that fires exactly its own tell, plus a detection benchmark that proves every matcher works and a registry checker that fails the instant a registry tell has no fixture on disk. Detection is runnable and machine-checked instead of advisory, and the forward dependency the D1-R3 registry wrote into its `fixture_id` column is closed.

This work is additive and lives off-corpus. The fixtures sit under `assets/`, the registry rows and prose catalog are untouched, and the only edit to a shipped craft surface adds content to the playbook scenario without removing a single prose line or changing its route.

### Fixture Corpus (9 directories, 18 samples)

`design-audit/assets/ai_fingerprint_fixtures/` holds one directory per registry `fixture_id`, named by the registry slug. Each directory carries a `clean.html` (a faithful near-twin that triggers no tell) and a `tell.html` (a minimal positive that triggers exactly its own tell). The nine cover the five Codex tells (ghost-card border-plus-shadow, over-rounded cards, sketchy SVG illustration, diagonal stripe background, element-tracking on display type), the one Gemini tell (image-hover animation), and the three 2026-general tells (cream/sand body background, eyebrow above every section, uniform section fade-and-rise). A content-first `README.md` at the corpus root maps each fixture to its tell, family, and the clean-vs-tell contract.

### Detection Benchmark (registry-first, precise matchers)

`shared/scripts/ai-fingerprint-fixture-check.mjs` loads the registry, builds one deterministic matcher per tell ID derived from that row's `deterministic_check`, scans every fixture's source text, and asserts each `tell.html` fires exactly its own tell while each `clean.html` fires none. The matchers are precise content checks, not loose substring scans: ghost-card, for example, requires a CSS declaration block carrying both a 1px solid border and a box-shadow with blur radius >=16px. The runner fails closed on any miss, off-family false positive, or missing fixture.

### Registry Checker Extended to File Existence

`shared/scripts/ai-fingerprint-registry-check.mjs` previously checked only that each registry row carried a present, well-formed `fixture_id`. It now also asserts that each row's fixture directory exists on disk with both `clean.html` and `tell.html`, so a registry tell whose fixture is hidden or missing fails the gate. The prior presence/format and parity checks are preserved.

### Playbook Scenario Extension (additive, route-stable)

`design-audit/manual_testing_playbook/03--slop-hardening/ai-fingerprint-tells.md` (AUDIT-SLOP-002) gains a fixture-backed pointer that names the corpus as the deterministic evidence layer when no richer product artifact is supplied, while its prompt, `expected_intent`, and `expected_resources` are unchanged. The scenario stays a hubRoute corpus member with its route preserved.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/<fixture_id>/clean.html` + `tell.html` | Created | 9 fixture dirs, 18 samples; each `tell.html` fires exactly its tell, each `clean.html` fires none |
| `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/README.md` | Created | Content-first corpus map: fixture to tell, family, and clean-vs-tell contract |
| `.opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs` | Created | Registry-first detection benchmark, one precise matcher per tell ID |
| `.opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs` | Modified | Extended from `fixture_id` presence/format to fixture-dir + sample file existence |
| `.opencode/skills/sk-design/design-audit/manual_testing_playbook/03--slop-hardening/ai-fingerprint-tells.md` | Modified | Additive fixture-backed pointer; route unchanged, 0 prose lines removed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) authored the corpus, the detection runner, the registry-checker extension, and the additive playbook edit, deriving each matcher from a registry row's `deterministic_check` rather than inventing one. The orchestrator then verified acceptance independently, reading exit codes without pipe-masking and syncing after every fixture mutation. The detection benchmark passes at exit 0 printing `registryRows=9 samples=18`, confirming each `tell.html` fires exactly its own tell and each `clean.html` fires nothing. It bites: a `tell.html` mutated so it no longer fires yields exit 1 naming `<fixture_id>/tell.html: expected [<tell_id>], got [...]`, confirmed on both the cream-or-sand and ghost-card matchers, proving the matchers are precise rather than loose. The extended registry checker passes at exit 0 (`catalogTells=9 registryRows=9`) with all nine fixture dirs present and bites at exit 1 when a fixture directory is hidden or missing. No-regression held: the hubRoute scorer stayed at 23 pass / 5 known-gap / 0 regression because the playbook scenario is route-stable and the fixtures live off-corpus under `assets/`. `node --check` is clean on both `.mjs`, the playbook edit removed zero prose lines, and the fixtures and runners were grepped for spec, packet, and dimension identifiers and spec paths to stay evergreen. Scope was confirmed clean: the registry, `load-playbook-scenarios.cjs`, `score-skill-benchmark.cjs`, `router-replay.cjs`, and the sk-design hubRoute fixtures were untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One precise content matcher per `deterministic_check`, not a substring scan | A loose matcher can fire on the wrong fixture and mask a real miss; a precise check (ghost-card needs a 1px solid border AND box-shadow blur >=16px in one block) keeps off-family fires at zero |
| Each fixture ships a clean near-twin plus a minimal tell sample | The clean proves the matcher stays silent on faithful work; the minimal positive isolates exactly one tell so a fire is unambiguous |
| Registry is the source of truth; matchers and existence are derived from it | Keeps the corpus and runners in lockstep with the catalog as the registry grows, rather than maintaining a parallel list |
| Extend the existing registry checker to file existence instead of a second tool | The forward dependency the registry wrote as `fixture_id` slugs now resolves to real files in the same gate that already validated the slug |
| Fixtures live off-corpus under `assets/`, playbook edit stays additive | Keeps the hubRoute route stable and the no-regression invariant honest; the benchmark works on curated samples without touching the scorer corpus |
| Catalog exhaustiveness left advisory | The corpus proves the matchers fire on known positives and stay silent on near-twin cleans; whether a new real-world output exhibits a tell is a judgment call the corpus cannot settle |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node ai-fingerprint-fixture-check.mjs` (orchestrator re-run) | PASS, exit 0, "PASS ai-fingerprint-fixture-check: registryRows=9 samples=18" |
| Negative: a `tell.html` mutated to stop firing its tell | FAIL, exit 1, "<fixture_id>/tell.html: expected [<tell_id>], got [...]" (confirmed on cream-or-sand and ghost-card) |
| `node ai-fingerprint-registry-check.mjs` (orchestrator re-run) | PASS, exit 0, "PASS ai-fingerprint-registry-check: catalogTells=9 registryRows=9", all 9 fixture dirs present |
| Negative: a hidden/missing fixture directory | FAIL, exit 1 |
| `node --check` on both `.mjs` | PASS, syntax OK on fixture-check and registry-check |
| No-regression: hubRoute scorer after the playbook edit | PASS, 23 pass / 5 known-gap / 0 regression (delta 0); scenario route-stable, fixtures off-corpus |
| Off-family false positives across the corpus | 0; no codex fixture fires a gemini/general tell or vice versa |
| Clean samples | All 9 `clean.html` fire 0 tells |
| Evergreen audit | Stable slugs + skill-relative paths only; no spec/packet/dimension IDs or spec paths in fixtures or runners |
| Scope audit | Registry, `load-playbook-scenarios.cjs`, `score-skill-benchmark.cjs`, `router-replay.cjs`, sk-design hubRoute fixtures untouched; playbook edit removed 0 prose lines |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata fingerprint residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Curated samples, not a coverage proof.** The benchmark proves each matcher fires on a known positive and stays silent on a near-twin clean. It does not prove the catalog is exhaustive or that a new real-world output exhibits a tell; that judgment stays advisory.
2. **Detection runner is on-demand, not a standing gate.** `ai-fingerprint-fixture-check.mjs` is runnable but not yet wired into a build or delivery step. A broken matcher fails closed only when the runner is invoked.
3. **Stale path citation in spec/research.** The spec and research cite `001-ai-fingerprint-tells.md`; the real playbook target is the denumbered `03--slop-hardening/ai-fingerprint-tells.md` (AUDIT-SLOP-002). The edit was made against the real file by stable slug.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
