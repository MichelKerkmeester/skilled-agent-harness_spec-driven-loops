# Iteration 008 — correctness: sk-code core/shared/quality + sk-prompt

## Scope and method

- **sk-code changelog renumbering** — `v3.x→v1.x`, `v4.x→v2.x` file renames with
  content rewrites, plus new `v2.2.4.0`. Verified:
  - Hub-root version authority holds: `SKILL.md:5`, `description.json:4`,
    `hub-router.json:3`, `mode-registry.json:3`, `ROUTER.md:12` all read
    2.2.4.0 = newest changelog file. Contiguous v1.0.0.0→v2.2.4.0.
  - Disclosure: `.skilled/changelog/skilled/v4.0.0.3.md:301` names the four
    renumbered units and `:338` tells users to compare by new numbers.
  - Fixtures moved with it: `phrase-variants.json`, `corpus-manifest.json`,
    `trigger-index.json` all reference the new numbers; no stale `v3.x`/`v4.x`
    changelog paths remain.
  - Downgrade path traced: `release-update.cjs:1155` compares
    `context.release` vs `base.release` — *release* tags (v4.0.0.x), which did
    not renumber — so installed-version comparisons cannot misfire on skill
    versions. No comparator consumes per-skill versions across the boundary.
- **`verify_alignment_drift.py` (+153)** — new opt-in checks:
  - `--check-sections`: numbered divider required in non-test JS/TS >150 lines;
    `NUMBERED_SECTION_RE`, `NONSTANDARD_DIVIDER_RE` (the `\s`→`[ \t]` fix is
    correct: under `re.M` `\s` crosses newlines — the comment documents it),
    `TEST_FILE_RE`/test-heavy/`stress-test` exemptions, `SECTIONS-MIXED-FORMAT`.
  - `--check-folders`: `FOLDER-DUNDER-NAME` hard-ERROR even under tests/ (the
    code documents why: every other rule softens there, so a softened name
    rule would hide the class); `FOLDER-README-MISSING` via classify_severity.
  - Both flags default-off (verified by test
    `test_section_and_folder_checks_are_off_by_default`) — opt-in, no surprise
    gate activation. `INTEGRITY_RULE_PREFIXES` extended to cover them.
  - `python3 test_verify_alignment_drift.py` → **26/26 OK**.
- **`check-comment-hygiene.sh`** — single-file → multi-file; aggregation
  `violation(1) > clean(0) > all-skipped(2)` is correct precedence; pre-commit
  caller treats 0|2 pass / 1 block / other crash-block, consistent. Test suite
  incl. new `multi_file` case → **all PASS**.
- **`check-rule-copies.js`** (+94) — the delivery-prefix guard verified live in
  iteration 6 (exit 0; canary workflow enforces fail-closed).
- **`sk-prompt` v3.0.2.0** — scoped-read contract for
  `references/patterns-evaluation.md`: cited sections `## 2. FRAMEWORK LIBRARY
  & SELECTION`, `## 3. FRAMEWORK DEEP DIVES`, `## 10. CLEAR EVALUATION MASTERY`
  all exist verbatim (lines 38, 110, 602); every framework has a `###`
  subsection under §3 (RCAF/112, COSTAR/144, TIDD-EC/155, RACE/165, CIDI/205,
  CRISPE/249, CRAFT/294). `framework-registry.json` description corrected to
  "five of the seven" — matches `[rcaf, race, cidi, tidd-ec, costar]` exactly.
  `cli-prompt-quality-card.md` persona table updated for the `cli-usage`→
  `cli-jev`-under-`cli-classifier` rename — accurate per the hub layout.
  Version 3.0.2.0 consistent with new changelog entry.
- `steer.md` — re-read; unchanged.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Review verdict: PASS
