---
title: "Feature Specification: Intent-Signal Quality + Fallback Parity"
description: "Fix intent-signal quality across the skill fleet (O6): a per-skill intent_signals coverage floor, dedup domains-vs-intent_signals double-counting in the lexical lane, strip generic file-path tokens from derivedKeywords, enrich the advisor's own thin signal set, add an intent_signals<->derived.trigger_phrases reconciliation gate, and add SQLite-vs-filesystem fallback expected-degradation parity tests."
trigger_phrases:
  - "intent signal quality fix"
  - "fix intent signal coverage floor"
  - "advisor fallback parity tests"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/009-signal-quality"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on 003 (fleet migrated to schema-version 2 derived so key_topics/key_files/entities/source_docs are populated fleet-wide before path-token stripping is measured)"
      - "Depends on 006 (routing-accuracy corpus wired into CI so this phase's lane/derivedKeywords changes are regression-gated, not merged on faith)"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/009-signal-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact intent_signals coverage floor (candidate: 8) is confirmed or adjusted at implementation time against the 006-pinned routing-accuracy corpus, not fixed here"
      - "Whether path-token stripping should drop key_files/source_docs path segments entirely from derivedKeywords, or extract only the file basename as a reduced-noise substitute, is an implementation-time call informed by a corpus A/B run"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Intent-Signal Quality + Fallback Parity

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 029 research (O6, 2-3/3 lineage agreement) found the advisor's intent-signal inputs are noisy and unevenly authored. A direct fleet scan confirms the claim precisely: `intent_signals` array length ranges from 3 (`mcp-code-mode/graph-metadata.json`) to 64 (`sk-code/graph-metadata.json`) — a ~21x spread across the 11 real skill roots (test fixtures excluded) — and `system-skill-advisor/graph-metadata.json` itself carries only 4, the second-thinnest in the fleet, so the skill responsible for routing *to* every other skill has one of the weakest signal sets to be routed *to* itself. Separately, `scoreLexicalLane` (`system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts:64-71`) feeds `skill.domains` and `skill.intentSignals` into the same `scoreTokenOverlap` call without deduping, so any term an author lists in both fields (a common pattern — `domains` and `intent_signals` are both free-text author fields with no cross-field uniqueness contract) is double-counted toward that skill's lexical score. Third, `derivedKeywords` is assembled from `key_topics` + `entities` + `key_files` + `source_docs` (`projection.ts:216-221` for the SQLite path, mirrored at `projection.ts:664-669` for the filesystem path) — and `key_files`/`source_docs` are full repo-relative paths (confirmed on `sk-code`: 20 `key_files` entries and 15 `source_docs` entries, e.g. `.opencode/skills/sk-code/code-webflow/assets/patterns/wait-patterns.js`). `phraseVariants` (`text.ts:40-50`) turns `-`/`_`/`.`/`/` into spaces via `normalizeText`, and `scoreDerivedLane`'s `scoreTokenOverlap(tokens, phrases)` call (`derived.ts:86`) then tokenizes every phrase — so a full path becomes generic tokens (`assets`, `patterns`, `references`, `md`, `js`, `opencode`, `skills`) that can match an unrelated prompt purely because a filename happened to contain a common English word. `metadata-sanitizer.ts:91-104` already treats `key_files`/`source_docs` as `pathLike` for a security/traversal check, but performs no token-noise reduction — the full path string still reaches scoring.

There is also no gate reconciling the two author-facing signal fields against each other. A direct Jaccard computation of `intent_signals` vs `derived.trigger_phrases` per skill root confirms the 029 claim exactly: `sk-code` measures 0.037 (~0.04) — the two fields share almost no vocabulary despite both describing the same skill's routing intent — while other roots range from 0.11 (`sk-prompt`) to 0.42 (`system-spec-kit`). No existing script (`ci-skill-root-metadata.cjs` has no `intent_signals` check at all) flags a root whose two signal sources have drifted this far apart or gone empty.

Finally, `loadAdvisorProjection` (`projection.ts:705-721`) degrades from `sqlite` to `filesystem` (DB absent) or `filesystem-fallback` (DB read threw) and this three-way source tagging is tested (`projection-fallback-049-005.vitest.ts`). What is not tested is *what data the degraded modes silently drop*: `loadFilesystemProjection` (`projection.ts:639-693`) always returns `edges: []` (line 642, never populated, line 692 returns it unchanged) because graph edges live only in the SQLite `skill_edges` table, and it never attaches `docTriggers` to any skill (contrast the SQLite branch at lines 615-618, which reads `docTriggersBySkill` and attaches it). A daemon running in degraded mode for any length of time silently routes with no graph edges and no doc-trigger evidence, and nothing asserts that contract today — a future change could accidentally start (or stop) dropping this data with no test failing either way.

This phase closes all five gaps as one bounded, corpus-gated slice of the 029 map's O6 item.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — `system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts` (dedup `domains` vs `intentSignals` before the combined `scoreTokenOverlap` call, lines 62-71); `system-skill-advisor/mcp-server/lib/scorer/lanes/derived.ts` (the `scoreTokenOverlap(tokens, phrases)` call at line 86, which is where path-token noise in `derivedKeywords` actually surfaces as score); `system-skill-advisor/mcp-server/lib/scorer/projection.ts` (`derivedKeywords` assembly at both `projectionFromRow` lines 216-221 and `loadFilesystemProjection` lines 664-669 — any fix must land in both to avoid a new SQLite-vs-filesystem parity gap; the fallback behavior at lines 639-693 and 705-721 for the new parity tests); `system-skill-advisor/mcp-server/lib/skill-graph/metadata-sanitizer.ts` (the `pathLike` branch at lines 91-104 is the existing seam for `key_files`/`source_docs`; a scoring-oriented path-token reduction is added alongside, not instead of, its existing security sanitization); `system-skill-advisor/mcp-server/lib/scorer/text.ts` (`phraseVariants`/`normalizeText`, lines 19-27 and 40-50, read-only reference for how paths currently expand); `graph-metadata.json` for the fleet roots currently below the coverage floor (confirmed today: `mcp-code-mode` at 3, `system-skill-advisor` at 4, `system-spec-kit` at 5); a new or extended check in `sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` (the `checkRoot` aggregator at line 322 already composes sub-checks via `violations.push(...)`, e.g. `checkCommandMetadata` at line 372 — the new intent-signal floor + reconciliation check follows that same pattern); new/extended vitest coverage under `system-skill-advisor/mcp-server/tests/scorer/` (extending `projection-fallback-049-005.vitest.ts` or a new sibling file) for the fallback expected-degradation parity contract.

Out of scope — picking the canonical `derived` producer (O1, a separate phase this phase depends on via 003's migration); ingesting `command-metadata.json` into command routing (O7); the parent-intent projection from mode/router vocabulary (O8); wiring `skill_graph_compiler.py`/`score-routing-corpus.py` into CI (O4, owned by phase 006, a dependency of this phase, not a deliverable of it); changing the H/S class contract; redesigning the lexical/derived lane algorithms beyond the specific double-count and path-noise fixes named above; restoring `edges`/`docTriggers` to the filesystem fallback (the parity tests lock the *current* documented degradation contract as a regression guard — closing that gap, if ever wanted, is a separate follow-up, not this phase's deliverable).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every skill root meets a minimum `intent_signals` coverage floor | No non-fixture skill root's `graph-metadata.json` `intent_signals` array has fewer than the floor (candidate: 8, confirmed at implementation time per the Open Questions note); the three roots currently below it (`mcp-code-mode`: 3, `system-skill-advisor`: 4, `system-spec-kit`: 5) are enriched with author-reviewed, routing-relevant phrases, not padding |
| REQ-002 | `domains` and `intentSignals` no longer double-count identical terms in the lexical lane | `scoreLexicalLane` (`lexical.ts:64-71`) computes its token-overlap candidate text from the union of `skill.domains` and `skill.intentSignals` with duplicates removed before scoring, verified by a unit test on a fixture skill whose `domains` and `intent_signals` share an entry, asserting the shared term contributes once, not twice, to the resulting score |
| REQ-003 | `key_files`/`source_docs` path segments no longer pollute `derivedKeywords` with generic tokens | The `derivedKeywords` assembly in both `projectionFromRow` (`projection.ts:216-221`) and `loadFilesystemProjection` (`projection.ts:664-669`) applies a scoring-oriented reduction to `key_files`/`source_docs` entries (e.g. basename-only extraction) before `phraseVariants`, so generic path-segment tokens (`assets`, `patterns`, `references`, `md`, `js`, `opencode`, `skills`) no longer appear in the resulting `derivedKeywords` set for a fixture mirroring `sk-code`'s 20 `key_files` / 15 `source_docs` entries; the SQLite and filesystem code paths apply the identical reduction (no new source-of-truth divergence) |
| REQ-004 | The advisor's own intent-signal set is enriched, not just floor-padded | `system-skill-advisor/graph-metadata.json`'s `intent_signals` grows from 4 to at least the REQ-001 floor with phrases that describe being routed *to* the advisor itself ("which skill", "route my request", "skill discovery is wrong", "advisor recommend") distinct from phrases about routing *decisions* the advisor makes for other skills; verified by a routing-accuracy corpus re-run (006-pinned) showing no regression on prompts whose expected top skill is `system-skill-advisor` |
| REQ-005 | An `intent_signals` <-> `derived.trigger_phrases` reconciliation gate exists | A new check (in `ci-skill-root-metadata.cjs`, following the `checkCommandMetadata`-at-line-372 pattern feeding `checkRoot`'s `violations.push(...)` at line 322) computes the Jaccard similarity between each root's `intent_signals` and `derived.trigger_phrases`, asserts at least one of the two arrays is non-empty, and reports (does not silently pass) any root below a documented low-agreement threshold without a recorded rationale; run against the current fleet, the gate must flag `sk-code`'s pre-fix 0.037 Jaccard as a finding (confirming the gate actually detects the condition it is built for) |
| REQ-006 | SQLite-vs-filesystem fallback expected-degradation is locked by tests, not left implicit | New or extended vitest coverage (alongside `projection-fallback-049-005.vitest.ts`) constructs a fixture skill with both graph edges and a doc-trigger entry present in a real SQLite fixture DB, then asserts: (a) `source: 'sqlite'` for that fixture returns non-empty `edges` and a populated `docTriggers` for the skill; (b) `source: 'filesystem'` and `source: 'filesystem-fallback'` for the same skill both deterministically return `edges: []` and no `docTriggers` — a locked, asserted contract instead of an untested silent difference; the test fails if either degraded mode ever starts (or stops) dropping this data without the test being updated in the same change |
| REQ-007 | Every lane/derivedKeywords/JSON change in this phase is measured against the 006-pinned routing-accuracy corpus with no unexplained regression | `score-routing-corpus.py` is run against the 006-pinned corpus (195 labeled + 72 holdout + 24 ambiguity prompts, confirmed present at `mcp-server/scripts/routing-accuracy/{labeled,holdout,ambiguity}-prompts.jsonl`) before and after this phase's REQ-001 through REQ-004 changes; any prompt whose predicted top skill changes is reviewed and either justified (fixes a documented miss) or the change is reverted before this phase is marked complete |

### Implementation amendments (recorded deviations)

- **REQ-002 premise correction (the phase's most important finding).** The cross-reviewer proved `scoreTokenOverlap` already collapses candidate tokens through a Set (`text.ts:84`) — a term listed in both `domains` and `intent_signals` **never double-counted at the token level**, which is why the corpus was byte-identical under the attempted dedup and why the first dedup test passed pre-fix (non-discriminating). The dedup wrapper was reverted (dead complexity); the *real* guard — Set-collapse inside `scoreTokenOverlap` — is now locked by `lexical-candidate-dedup.vitest.ts`, which asserts identical scores for duplicate-vs-single listings and fails if the collapse is ever removed. The 029 research's double-count claim is corrected, not silently papered over.
- **REQ-003 approach.** Basename-extraction (not full drop) chosen for path reduction: `reduceDerivedPathEntry` in `projection.ts`, one shared helper used by both the SQLite and filesystem assemblies, with direct regression coverage asserting basename concepts survive and generic segment tokens do not, in both sources.
- **REQ-005 thresholds.** Floor 8 (raises exactly the three sub-8 roots); Jaccard NOTE threshold 0.05 (flags sk-code's 0.037, passes the next-lowest 0.108); the NOTE is report-only by design.
- **REQ-007 regime coverage.** The Python corpus cannot see TS lane changes, so the TS scorer was additionally measured over the full pinned corpus through its *source* (vitest transform, pinned force-local regime): 176/195 + 53/72, byte-identical to baseline. The dist-based capture tools could not be used — the advisor `npm run build` is broken by the same concurrent in-flight pi-hook relocation blocking `validate.sh` — so the live daemon and dist run pre-phase lanes until the program's rollout phase rebuilds and reloads them.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Every non-fixture skill root meets the confirmed `intent_signals` floor, including `system-skill-advisor` itself; `lexical.ts` no longer double-counts a term present in both `domains` and `intentSignals`; `derivedKeywords` for every fleet root is free of generic path-segment tokens sourced from `key_files`/`source_docs`, with SQLite and filesystem projections producing the identical reduced set; a reconciliation gate exists and correctly flags the pre-fix `sk-code` 0.037 Jaccard case; new vitest coverage locks the fallback expected-degradation contract (`edges: []`, no `docTriggers`) for both `filesystem` and `filesystem-fallback` sources against a fixture that has real edges/doc-triggers in SQLite; the 006-pinned routing-accuracy corpus shows no unexplained regression across all changes; `validate.sh <folder> --strict` reports Errors:0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | This phase edits live, shared scorer code (`lexical.ts`, `derived.ts`, `projection.ts`) that concurrently-running advisor sessions route through | Follows the parent program's guarded-rollout principle (parent REQ-006): land each lane change behind a corpus-gated, individually revertible commit rather than one combined edit; no shadow-mode flag is introduced solely for this phase given the bounded, mechanical nature of the fixes, but the corpus gate (REQ-007) is the merge condition |
| Risk | The candidate coverage floor (8) is picked from the fleet's current distribution, not from a measured routing-accuracy optimum, and could be too low or too high | REQ-001's floor is explicitly a candidate, confirmed or adjusted at implementation time by re-running the 006-pinned corpus with the enriched roots and checking for accuracy movement, not asserted as final in this spec |
| Risk | Stripping path segments from `derivedKeywords` could remove a token that was, coincidentally, carrying real routing signal (e.g. a distinctive filename fragment) | REQ-003's reduction targets generic path-segment tokens specifically (directory names, extensions), preserving basename-derived concepts; REQ-007's corpus regression gate catches any resulting accuracy loss before merge |
| Risk | The reconciliation gate (REQ-005) could be noisy if the Jaccard threshold is set too aggressively, flagging legitimate roots whose two fields are intentionally non-overlapping (broad `intent_signals`, narrow curated `trigger_phrases`) | The gate reports findings for review rather than hard-failing CI in this phase; a documented per-root allow-list entry silences a reviewed, intentional divergence |
| Dependency | Phase 003 (fleet migration to schema-version 2 `derived`) | `key_topics`/`key_files`/`entities`/`source_docs` must be populated fleet-wide under the v2 shape before REQ-003's path-token measurement is meaningful across all roots, not just the ones already migrated |
| Dependency | Phase 006 (CI compiler + routing-accuracy gates) | REQ-004 and REQ-007 require the pinned routing-accuracy corpus and its scoring harness to already be wired for repeatable before/after measurement |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact intent_signals coverage floor (candidate: 8, derived from the fleet's current 3-64 distribution — a floor that raises exactly the three sub-8 roots without disturbing the eight roots already above it) is confirmed or adjusted at implementation time against the 006-pinned corpus.
- Whether path-token stripping (REQ-003) should drop `key_files`/`source_docs` path segments from `derivedKeywords` entirely, or extract a reduced but non-empty basename-derived token per entry, is an implementation-time call informed by a corpus A/B comparison of both approaches.
- The exact low-agreement Jaccard threshold for REQ-005's reconciliation gate (below which a root is flagged) is set at implementation time from the fleet's current distribution (0.037-0.42 measured today), not fixed in this spec.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program parent**: `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation`
- **Research source**: `../../029-skill-json-optimization-research/research/research.md` (§3 O6)
- **Contract under study**: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `008-manual-to-edges-migration` |
| **Successor** | `010-parent-intent-projection-spike` |
