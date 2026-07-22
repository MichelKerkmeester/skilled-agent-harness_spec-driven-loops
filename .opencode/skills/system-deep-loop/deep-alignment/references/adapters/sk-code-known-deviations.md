---
title: sk-code Known-Deviation Suppression List
description: The seeded sk-code known-deviation list for deep-alignment's ADR-005 suppression invariant, seeded from verify_alignment_drift.py's own live skip-path/severity-downgrade functions plus two adapter-specific conventions found while building this adapter, not invented.
trigger_phrases:
  - "sk-code known deviations"
  - "known deviation suppression list sk-code"
  - "alignment suppression list sk-code"
  - "context advisory path test heavy path motion dev overlay"
importance_tier: important
contextType: reference
version: 1.0.0.2
---

# sk-code Known-Deviation Suppression List

The sk-code authority's known-deviation list for deep-alignment's ADR-005 suppression invariant: intentional repo conventions the mode must never flag as drift.

---

## 1. OVERVIEW

### Purpose

ADR-005 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-005`) requires every authority adapter's `standardSource` to carry a known-deviation list so a real repo-wide convention is never flagged as drift. Every entry below traces to real, already-live code: `verify_alignment_drift.py`'s own exemption functions, or a real classification outcome this adapter's own build surfaced by construction. It is not a hypothetical.

### Source of Truth

This document is the single source of truth for sk-code's suppression rules. The fenced `json` block in Section 8 is parsed directly by `scripts/adapters/sk-code.cjs`'s `loadKnownDeviations()` at runtime. There is no separate, hand-synced copy of this list in code. Editing a deviation means editing it here, once.

### Why Every Entry Below Is `matchTypes: []`

Unlike sk-doc's known-deviation list (which suppresses findings `validate_document.py`/`extract_structure.py` emit), every entry here is **native to the wrapped tool or the router itself**: `verify_alignment_drift.py` already downgrades severity or skips the check entirely for the four path categories in Sections 2-5 *before* it ever prints a finding, and the surface-precedence outcome in Section 6 is the router's own documented, correct behavior, not an adapter-level override. `sk-code.cjs`'s `suppressKnownDeviations()` therefore has nothing to actively filter for any entry here today: every `matchTypes` is `[]`. This list exists so a **reasoning-agent-layer-2** reviewer (which does not read `verify_alignment_drift.py`'s source before judging) does not independently re-flag a path or classification outcome the deterministic layer, or the router itself, already treats correctly. This mirrors `sk-doc-known-deviations.md`'s own "dormant" entries (Sections 4-5 there), which exist for the identical reason.

---

## 2. CONTEXT-ADVISORY PATH SEVERITY DOWNGRADE

**Deviation name**: Context-advisory path severity downgrade

**Why it is not a violation**: `verify_alignment_drift.py`'s `classify_severity()` (verify_alignment_drift.py:253-257) downgrades every rule's severity to `WARN`, never `ERROR`, for any path containing a `z_archive`, `scratch`, `memory`, `research`, `context`, `assets`, `examples` or `fixtures` path segment (`is_context_advisory_path()`, verify_alignment_drift.py:225-228, checking `CONTEXT_ADVISORY_SEGMENTS`, lines 75-84). plan.md's Architecture section names this exact function as one of two candidate seeds for this list ("`is_context_advisory_path`, `is_test_heavy_path`").

**Evidence**:
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:75-84`: `CONTEXT_ADVISORY_SEGMENTS` definition.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:225-228`: `is_context_advisory_path()`.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:253-257`: `classify_severity()`, the downgrade call site.
- `007-adapter-sk-code/plan.md` Architecture section names `is_context_advisory_path` as a seed candidate.

**Match rule**: none currently (`matchTypes: []`). See Section 1: `verify_alignment_drift.py`'s own output already reflects this downgrade. `sk-code.cjs`'s layer-1 translator (`checkOpencodeDeterministic()`) faithfully carries the tool's own `severity` field through to P0/P1, so a `z_archive/`-path finding already prints as P1 (WARN), never P0, with no adapter-side suppression required.

**Live-Reality Check (2026-07-11)**: confirmed by reading `verify_alignment_drift.py` in full and re-deriving the call chain (`check_file()` → `classify_severity(path, rule_id)` → `is_context_advisory_path(path)`). Not re-derived from the 130-packet or any other adapter's precedent. This is sk-code's own tool, read directly.

---

## 3. TEST-HEAVY PATH SEVERITY DOWNGRADE

**Deviation name**: Test-heavy path severity downgrade

**Why it is not a violation**: the same `classify_severity()` downgrade applies to any path under a `/tests/` segment, or whose basename ends in `.test.ts`/`.spec.ts`/`.vitest.ts`/`.test.tsx`/`.spec.tsx`/`.vitest.tsx` (`is_test_heavy_path()`, verify_alignment_drift.py:231-236, `TS_TEST_SUFFIXES`, lines 85-92). Test fixtures and specs are held to a lighter mechanical bar than shipped implementation code.

**Evidence**:
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:85-92`: `TS_TEST_SUFFIXES` definition.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:231-236`: `is_test_heavy_path()`.
- `007-adapter-sk-code/plan.md` Architecture section names `is_test_heavy_path` as the second seed candidate.

**Match rule**: none currently (`matchTypes: []`), same reasoning as Section 2.

**Live-Reality Check (2026-07-11)**: `is_context_advisory_path()` itself calls `is_test_heavy_path()` first (verify_alignment_drift.py:226). Every test-heavy path is also context-advisory, so this entry is a documented subset of Section 2's, kept separate because plan.md names both functions individually and a reasoning-agent reviewer benefits from the narrower, more specific rationale ("this is test code," not just "this is advisory").

---

## 4. TS-MODULE-HEADER EXEMPTION FOR PATTERN-ASSET FILES

**Deviation name**: TS pattern-asset module-header exemption

**Why it is not a violation**: a TypeScript file under a path containing both `/assets/` and `/patterns/` segments is exempt from the `TS-MODULE-HEADER` check entirely (`should_skip_ts_module_header()`, verify_alignment_drift.py:249-250, calling `is_ts_pattern_asset()`, lines 239-241). These are illustrative pattern snippets, not real modules expected to carry a `MODULE:` header block.

**Evidence**:
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:239-241`: `is_ts_pattern_asset()`.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:249-250`: `should_skip_ts_module_header()`, the skip call site (this check is entirely skipped, not merely downgraded, distinct from Sections 2-3's severity-downgrade shape).
- `007-adapter-sk-code/plan.md` Architecture section names `is_ts_pattern_asset` as a third seed candidate.

**Match rule**: none currently (`matchTypes: []`). `verify_alignment_drift.py` never emits `TS-MODULE-HEADER` for a matching path in the first place, so there is nothing for the adapter to suppress after the fact.

**Live-Reality Check (2026-07-11)**: confirmed by reading `should_skip_ts_module_header()`'s two-line body directly (`is_test_heavy_path(path) or is_ts_pattern_asset(path)`). This is an unconditional skip, not a severity change, the one structurally different exemption shape among the four seeded here.

---

## 5. ONE KNOWN MALFORMED JSON TEST FIXTURE

**Deviation name**: Known malformed JSON fixture exemption

**Why it is not a violation**: exactly one file, a deliberately-malformed JSON fixture used by an earlier spec-kit test suite, is exempt from the `JSON-PARSE` check by an exact-suffix match (`is_known_malformed_json_fixture()`, verify_alignment_drift.py:244-246, `KNOWN_MALFORMED_JSON_FIXTURE_SUFFIXES`, lines 94-97). The file is intentionally invalid JSON by design (it is a fixture for testing malformed-input handling), not a real drift instance.

**Evidence**:
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:94-97`: the one hardcoded suffix, pointing at `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/044-speckit-test-suite/scratch/001-test-agent-08/malformed.json`.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:244-246`: `is_known_malformed_json_fixture()`.
- `007-adapter-sk-code/plan.md` Architecture section names `is_known_malformed_json_fixture` as the fourth seed candidate.

**Match rule**: none currently (`matchTypes: []`), same reasoning as Section 4 (unconditional skip inside the wrapped tool, nothing left for the adapter to suppress).

**Live-Reality Check (2026-07-11)**: confirmed the named path is a real, archived test-scratch file (both `z_archive` and `scratch` path segments present, so this single file is also covered by Section 2's context-advisory downgrade on every *other* rule type. This exemption is specifically and only about the `JSON-PARSE` check being skipped outright rather than merely downgraded).

---

## 6. SK-CODE'S OWN TOOLING UNDER `code-webflow/` CLASSIFIES OPENCODE, NOT WEBFLOW

**Deviation name**: OPENCODE-precedence classification of Webflow-named tooling paths

**Why it is not a violation**: `stack-detection.md`'s own Detection Order (Section 2, lines 38-56) gives OPENCODE strict precedence over WEBFLOW markers for any path under `.opencode/`, and names the exact live rationale: *"`.opencode/` system tools (e.g. preview servers, mock fixtures, animation demos under `.opencode/skills/sk-doc/scripts/`) may import vanilla animation libraries internally without being WEBFLOW-shipping artifacts. A first-match-WEBFLOW order would mis-route this work to the wrong standards."* This adapter's own `classifySurface()` reproduces that precedence faithfully, which means every file under `.opencode/skills/sk-code/code-webflow/**` (its reference material, its verification *scripts*, even the word "webflow" in the directory name) classifies **OPENCODE**, not WEBFLOW, when discovered inside this monorepo. This is correct, intentional router behavior, confirmed live (Section 8's live-reality note below), not an adapter bug and not something a reasoning-agent reviewer should re-flag as "wrong surface."

**Evidence**:
- `.opencode/skills/sk-code/shared/references/stack-detection.md:38,42,56`: the precedence rule and its own named rationale.
- Live CLI dry-run, 2026-07-11: `node scripts/adapters/sk-code.cjs discover .opencode/skills/sk-code/code-webflow/assets/scripts` classified all three files (`minify-webflow.mjs`, `test-minified-runtime.mjs`, `verify-minification.mjs`) as `surface: "OPENCODE"`, `detectedFrom: "path"`. See `sk-code-adapter.md` Section 8 for the full transcript.

**Match rule**: none currently (`matchTypes: []`). This is a classification-outcome deviation, not a finding-type deviation. It is recorded here for the reasoning-agent layer's benefit (Section 1) and for any future human reviewer who encounters the same "why is this WEBFLOW-named file marked OPENCODE?" question.

**Live-Reality Check (2026-07-11)**: this is not a hypothetical scenario constructed for this document. It is the actual, live output of this adapter's own `discover()` against its own repository, confirmed by direct CLI invocation (see Section 8 cross-reference above).

---

## 7. MOTION.DEV CROSS-STACK PEER-LIBRARY REFERENCES

**Deviation name**: Motion.dev / GSAP / Lenis / Swiper / HLS peer-library references are not off-standard

**Why it is not a violation**: `smart-routing.md` §5 states Motion.dev (and by the same logic, GSAP/Lenis/Swiper/HLS, the same marker family `stack-detection.md`'s WEBFLOW content-grep checks) is *"a peer resource category... It is not a separate code surface. It supplements WEBFLOW, OPENCODE, or future surfaces."* A file that references one of these peer libraries is not thereby non-conformant to its own surface's standard. It is drawing on documented, expected cross-stack integration material (`code-webflow/references/animation/`), the exact resource `standardSource()`'s `motionOverlay` reference already surfaces to the reasoning-agent layer when `motionDevOverlay: true`.

**Evidence**:
- `.opencode/skills/sk-code/shared/references/smart-routing.md` Section 5 ("MOTION_DEV MAP"): "supplements... rather than replacing it."
- `.opencode/skills/sk-code/shared/references/smart-routing.md` Section 1: "Motion.dev resources are a **peer category** loaded after either surface, not a third surface."

**Match rule**: none currently (`matchTypes: []`). `sk-code.cjs`'s layer 1 has no "wrong peer library" finding type to suppress. This entry exists purely to keep the reasoning-agent layer from independently inventing one.

**Live-Reality Check (2026-07-11)**: `sk-code.cjs`'s own `MOTION_DEV_CONTENT_MARKER_RE` content-marker regex is a lightweight literal-text match, confirmed (by direct test against this adapter's own source file) to also fire on **prose that merely names** a Motion.dev API (for example a docstring quoting `"animate()"` as a keyword, not an actual `animate(...)` call). See `sk-code-adapter.md` Section 8 for the full reproduction. This is recorded as a known, accepted imprecision of the lightweight overlay signal (a false positive on *mentioning* the pattern, not *using* it), not silently smoothed over.

---

## 8. SCOPE OF THIS LIST

**In scope**: sk-code authority only. Each other authority adapter (sk-doc phase 005, sk-git and sk-design phase 006) owns its own known-deviation list under its own `standardSource`, per ADR-005's per-authority requirement. This document does not attempt to anticipate their conventions.

**Not a dumping ground**: per `spec.md` REQ-004's acceptance criteria and the phase's own risk register, every entry here traces to real, already-live tool source or a real classification outcome this adapter's own build reproduced, never an invented convention. An entry that stops matching real repo state gets flagged for operator review at REPORT time (ADR-006's state machine), not silently dropped or silently kept. The Live-Reality Check notes above are exactly that kind of flag, surfaced at authoring time instead of waiting for a later review pass.

---

## 9. MACHINE-READABLE DEVIATION LIST

`scripts/adapters/sk-code.cjs` parses this fenced block directly (see that file's `loadKnownDeviations()`). Keep it byte-consistent with Sections 2-7 above. This block is the operative rule set (currently all `matchTypes: []`, per Section 1), the prose above is the human-readable rationale and evidence for each.

```json
{
  "authority": "sk-code",
  "version": "1.0.0",
  "generatedFrom": "sk-code-known-deviations.md Section 9, hand-maintained alongside Sections 2-7",
  "deviations": [
    {
      "id": "context-advisory-path-severity-downgrade",
      "name": "Context-advisory path severity downgrade",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": "opencode-pattern-drift",
      "matchSurfaces": null,
      "status": "native-to-tool",
      "evidence": [
        "verify_alignment_drift.py:75-84",
        "verify_alignment_drift.py:225-228",
        "verify_alignment_drift.py:253-257"
      ]
    },
    {
      "id": "test-heavy-path-severity-downgrade",
      "name": "Test-heavy path severity downgrade",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": "opencode-pattern-drift",
      "matchSurfaces": null,
      "status": "native-to-tool",
      "evidence": [
        "verify_alignment_drift.py:85-92",
        "verify_alignment_drift.py:231-236"
      ]
    },
    {
      "id": "ts-pattern-asset-module-header-exemption",
      "name": "TS pattern-asset module-header exemption",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": "opencode-pattern-drift",
      "matchSurfaces": ["OPENCODE"],
      "status": "native-to-tool",
      "evidence": [
        "verify_alignment_drift.py:239-241",
        "verify_alignment_drift.py:249-250"
      ]
    },
    {
      "id": "known-malformed-json-fixture-exemption",
      "name": "Known malformed JSON fixture exemption",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": "opencode-pattern-drift",
      "matchSurfaces": ["OPENCODE"],
      "status": "native-to-tool",
      "evidence": [
        "verify_alignment_drift.py:94-97",
        "verify_alignment_drift.py:244-246"
      ]
    },
    {
      "id": "opencode-precedence-webflow-named-tooling",
      "name": "OPENCODE-precedence classification of Webflow-named tooling paths",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": "surface-detection",
      "matchSurfaces": ["OPENCODE"],
      "status": "confirmed-live",
      "evidence": [
        "stack-detection.md:38,42,56",
        "sk-code-adapter.md Section 8 (live discover() dry-run transcript)"
      ]
    },
    {
      "id": "motion-dev-cross-stack-peer-reference",
      "name": "Motion.dev / GSAP / Lenis / Swiper / HLS peer-library references are not off-standard",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": null,
      "matchSurfaces": null,
      "status": "confirmed-live",
      "evidence": [
        "smart-routing.md Section 5",
        "smart-routing.md Section 1",
        "sk-code-adapter.md Section 8 (motionDevOverlay self-reference reproduction)"
      ]
    }
  ]
}
```

---

## 10. REFERENCES AND RELATED RESOURCES

- [sk-code-adapter.md](./sk-code-adapter.md): the full `standardSource`/`discover`/`check` specification this list is loaded by.
- [sk-code.cjs](../../scripts/adapters/sk-code.cjs): the reference wiring script. `loadKnownDeviations()` parses Section 9's fenced block.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py`: the real source of Sections 2-5's exemption functions.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHORS `adr-005`, `adr-008`): the alignment contract and hybrid-honesty decision this list satisfies.
