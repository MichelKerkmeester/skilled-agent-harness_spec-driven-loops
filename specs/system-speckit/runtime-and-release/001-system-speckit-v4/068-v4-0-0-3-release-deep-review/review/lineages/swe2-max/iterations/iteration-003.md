# Iteration 003 — correctness: sk-doc shared scripts + system-spec-kit shared/test surface

## Scope and method

Reviewed the `v4.0.0.2..v4.0.0.3` diff of the `sk-doc` shared-script surface and the
adjacent `system-spec-kit/shared` test move:

- `.skilled/skills/sk-doc/shared/scripts/validate_document.py` — new shared
  frontmatter-values check, `document_type_fallback` warning, `--advise` subprocess
  integration, feature/env opt-outs (`JEV_FEATURES`, `JEV_FEATURE_CITE_DRIFT`,
  `SKDOC_CITE_DRIFT_CHECK`, `SKDOC_CITE_DRIFT_OUT`).
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (new, 1450 lines) —
  citation extraction, tracked-set resolution, redirect chains, basename fallback,
  `git cat-file --batch` prefetch parser, census/draw/advise modes.
- `.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs` (new) —
  Jev transport, version pin, credential gate, adaptive borderline reruns, budget.
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json` — 701 rules
  (`.opencode/` → `.skilled/` migration dominates: 17 767 records, 0.9998 agreement).
- `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` — new
  check 10 (fires-when word coverage, threshold 0.3) and check 11 (card sync).
- `.skilled/skills/system-spec-kit/shared/tests/` — 15 test files moved under
  `tests/`; spot-checked `auto-select.test.ts` / `registry.test.ts` import fixes.
- `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` (new, 1855 lines)
  — ran it: **64/64 pass** (node:test, ~11.6 s).
- `.github/workflows/repo-rules-corpus.yml` — confirms `check-repo-rules.cjs` is a
  blocking PR gate (check 10 false-fails block merges).
- `steer.md` — re-read; findings weighed against "no style nits as P1".

Verified-but-clean observations (no finding): the `cat-file --batch` parser reads a
Buffer (`indexOf(0x0a)` is a byte search, not the string `"10"` trap); the
`document_type_fallback` warning is `severity:'warning'` and cannot move
`exit_code` (1764-1769); `scripts/validate_document.py` symlink resolves through
`.resolve()` so `parents[2]` still lands on `sk-doc/`; the redirect loader treats a
malformed table as a hard error rather than silently degrading (509-522); the
advisory subprocess is bounded (90 s outer timeout, 60 s inner budget, 20-citation
cap) and failure-soft on every axis (missing node/git/jev/credentials → `skipped`).

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None. Every defect found in this surface is bounded, advisory-path, or heuristic —
none corrupts artifacts or blocks the release contract.

### P2 Findings

1. **sw2m-P2-004 — `check-repo-rules.cjs` stemmer diverges on its own documented
   example; coverage under-count can false-fail the CI gate.**
   Check 10 ("fires-when coverage") claims the suffix list lets "`fails` and
   `failure` meet". Empirically: `fails` → `fail` (s-strip), `failure` → `failur`
   (e-strip; `failure` never reaches the `er` rule because `re`≠`er`).
   `moved`/`moving` stay unstemmed (`5-2<4`, `6-3<4` below the min-length guard).
   Evidence: `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs`
   SUFFIXES + `contentWords` (~lines 38-41 and 224-235).
   Failure scenario: an author edits a rule's Fires-when bullet to say "fails"
   while the router row says "failure"; shared-word coverage drops below 0.30 →
   check 10 FAIL → `.github/workflows/repo-rules-corpus.yml:40` blocks the PR even
   though the row genuinely covers the bullet. The 0.30 threshold was tuned with
   this stemmer so the current corpus passes, but the metric is noisier than the
   comment claims and each future rule edit rolls that dice.

2. **sw2m-P2-005 — `validate_document.py` dereferences the shared
   frontmatter-values map unguarded; a malformed asset crashes every validation.**
   `_load_frontmatter_values` catches only `FileNotFoundError`
   (`.skilled/skills/sk-doc/shared/scripts/validate_document.py:1607-1613`); a
   truncated/invalid JSON raises `JSONDecodeError` straight through
   `validate_document`. With valid JSON missing a key, `values['contextType']`
   (1643) or `lists[list_key]['canonical']`/`['aliases']` (1652) raises `KeyError`.
   Failure scenario: a contributor edits `sk-create-frontmatter/assets/
   frontmatter-values.json`, drops a key or leaves a trailing comma → every
   `create-*` workflow step that runs `validate_document.py` on a
   frontmatter-bearing doc dies with a traceback and non-zero exit instead of a
   warning or graceful skip — the data file is a single point of failure for the
   whole doc-validation surface.

3. **sw2m-P2-006 — citation-drift advisory silently excludes the dominant drift
   class: moved/renamed citations never reach the pool or the unchecked count.**
   `adviseCitations` retains only `status === 'in_range'`
   (`.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:862`), and
   the summary computes `unchecked = citations.length - checked` over that already-
   filtered list (line 983). `moved_in_range`, `moved_past_end`, `past_end`,
   `basename_only`, `unresolved` are dropped before counting — even though the 701-
   rule redirect table exists precisely because renames are the common case.
   Failure scenario: a doc whose only citations point at renamed paths (e.g.
   `.opencode/...` → `.skilled/...`) is reported by the advisory as
   `checked=0 flagged=0 unchecked=0` — complete silence where the census mode would
   count `moved_past_end`. A maintainer reading the advisory concludes "no drift"
   for a doc that is entirely stale. Deliberate scope per test "advise without an
   in-range citation never spawns jev", but the silent zero is indistinguishable
   from "all clean".

## Expansion note

The blast radius of findings 1 and 3 stayed inside `sk-doc`; finding 1's consumer
(`.github/workflows/repo-rules-corpus.yml`) is outside the steer focus area and was
followed to confirm the gate is blocking. `system-spec-kit/shared/tests/*` moves
were spot-checked — import depth fixes are correct.

## Review verdict: PASS
