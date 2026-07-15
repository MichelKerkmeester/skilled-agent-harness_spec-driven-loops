---
title: "Implementation Summary: create-diff fidelity, safety, and accessibility hardening"
description: "Landed the reconciled GPT-5.6 review fixes in create_diff.py and validate_report.py behind a 39-test regression suite: strict UTF-8 decode, a correct empty/EOF-newline line model, an HTMLParser allowlist safety gate, legend contrast with a non-colour inline decoration, and a keyboard-operable scoped side-by-side scroll."
trigger_phrases:
  - "create-diff hardening summary"
  - "diff safety gate status"
  - "diff strict decode status"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/008-fidelity-safety-a11y-hardening"
    last_updated_at: "2026-07-15T18:46:00Z"
    last_updated_by: "claude"
    recent_action: "Completed P1 code-opencode alignment; added scripts/README; wired 009 successor"
    next_safe_action: "Commit the alignment + command work and push to v4"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-hardening-008"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether to close the long-filename / 6-digit-line-number overflow edges here or as a bounded follow-up."
    answered_questions:
      - "EOF-newline is treated as insignificant (consistent with trailing-whitespace normalization), not marked git-style."
      - "The remediation lives in its own child (008), cross-linked from 006."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: create-diff fidelity, safety, and accessibility hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-fidelity-safety-a11y-hardening |
| **Status** | Complete |
| **Level** | 2 |
| **Origin** | Adversarial GPT-5.6 SOL (ultra) review of the 006 redesign, independently re-verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fixes for the reconciled review findings, each locked by a checked-in test.

### Files Changed (under `.opencode/skills/sk-doc/create-diff/`)

| File | Action | Purpose |
|------|--------|---------|
| `scripts/create_diff.py` | Modify | Strict decode (refuse undecodable UTF-8 instead of `errors="replace"`); unknown-extension fidelity warning; logical-line model (`_logical_lines`) so empty files and trailing newlines stop producing phantom/spurious lines; legend contrast rule `.legend mark.wd{color:var(--text)}`; side-by-side `.sxs{min-width:60rem}` plus a `role="region"`/`aria-label`/`tabindex="0"`/`:focus-visible` scroll wrapper. |
| `scripts/validate_report.py` | Rewrite | Real safety gate, an **allowlist** for the renderer's exact HTML dialect: parses with `html.parser`, permits only the emitter's known tags and attributes (any other element/attribute fails), asserts the exact CSP directive set (rejecting non-ASCII directive smuggling and a mis-placed or duplicated CSP), and requires every URL-bearing attribute to be a local `#` fragment — so `@import`/non-`data:` `url()`, remote/`data:`/`javascript:` references, and live handlers all fail. |
| `scripts/test_create_diff.py` | Create | 39-test stdlib regression suite: one-hazard-per-case allowlist conformance, four-report conformance, CLI exit-3/exit-0 subprocess tests, plus REQ-001..005 and zero-JS/CSP/escaping/byte-reproducibility/pairing/collapse. |
| `scripts/README.md` | Create | Code-navigation README for the scripts directory (overview, quick start, structure, CLI entrypoints deferring to `../references/cli-reference.md`, exit-code and report-contract tables). |
| `references/capabilities-and-fidelity.md` | Modify | States strict-decode refusal, the unknown-extension warning, and the logical-line model. |
| `references/accessibility-contract.md` | Modify | Accurate relative-unit wording; keyboard-operable scoped-scroll description. |
| `../006-opencode-skill-and-accessibility/implementation-summary.md` | Modify | Corrected warnings count (8), added the WCAG/scroll remediation note, cross-linked 008. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding was treated as a hypothesis and re-verified against the source before any edit — two of the reviewer's specific characterizations were corrected in the process (the empty-file case is a pure addition, not "one changed line"; the `@@` header is a documented human scan anchor, not a patch header measured against `difflib`). Fixes were made surgically inside existing functions, prefer-refuse-over-fabricate for the engine and parse-don't-regex for the validator. The four demo reports were regenerated and re-validated after every behavior change, and the whole set stays byte-reproducible under a fixed `SOURCE_DATE_EPOCH`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refuse undecodable UTF-8 (exit 3) rather than decode with `errors="replace"` | Replacement characters let two files differing only in invalid bytes collapse to identical text — silent difference-erasure. Honest failure over a fabricated "no changes". |
| Treat a trailing EOF newline as insignificant (via `_logical_lines`), not a git-style "No newline at EOF" marker | Consistent with the tool's existing per-line trailing-whitespace normalization; a document diff for prose/Markdown should not surface a code-diff EOF marker. Deviates from the reviewer's suggestion and the original REQ-004 wording — recorded, not silent. |
| Rewrite the validator as an `html.parser` allowlist, not a patched regex denylist | The regex tag boundary broke on a malformed `alt=">"`, hiding a live `onerror`; a denylist can only reject the hazards it enumerates. The renderer emits a fixed, known dialect, so the gate allowlists exactly that dialect's tags/attributes/CSP/local-fragment URLs and fails everything else — an independent acceptance boundary rather than a blocklist that must anticipate every attack. |
| Legend swatch text uses `--text`, not the inherited `--text-muted` | `--text-muted` on the stronger `--add-inline`/`--del-inline` tint failed WCAG AA in three theme pairs; full-strength text passes all (≥ 4.5:1 both themes). |
| Give the side-by-side table a `min-width` and make the scroll region focusable | Without a min-width the fixed-layout table wrapped to fit and never scrolled; the wrapper had no `tabindex`, so the promised scoped scroll neither scrolled nor was keyboard-reachable. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Regression suite | PASS: `python3 scripts/test_create_diff.py` — Ran 39 tests, OK. |
| Strict decode (REQ-001) | PASS: `\xff` vs `\xfe` refused with exit 3 (unit and CLI subprocess); valid UTF-8 still diffs. |
| Legend contrast (REQ-002) | PASS: `--text` on `--add-inline`/`--del-inline` ≥ 4.5:1 measured in both themes; inline additions underlined / removals struck through (non-colour signal). |
| Safety gate (REQ-003) | PASS: allowlist rejects every hazard class one-per-test (disallowed element/attribute, live handler, external/`data:`/`javascript:` href, `@import`, `url()`, refresh/unknown `http-equiv`, duplicate attribute, non-ASCII/mis-placed/duplicate/weakened/missing CSP); the four canonical reports PASS. |
| Line model (REQ-004) | PASS: empty→content = 1 add / 0 unchanged; empty→empty = 0 changes; `x`→`x\n` = 0 changes; interior blank preserved. |
| Scoped scroll a11y (REQ-005) | PASS: `.sxs{min-width:60rem}` + `role="region"`/`aria-label`/`tabindex="0"`/`:focus-visible` present in the regenerated report. |
| Byte-reproducibility + zero-JS | PASS: reports byte-identical across runs under fixed `SOURCE_DATE_EPOCH`; `scripts=0` on all four. |
| Comment hygiene | PASS: 0 ephemeral artifact labels across all three scripts. |
| code-opencode alignment | PASS: full P0 structural (`# COMPONENT:` header, numbered section dividers, shebang, snake_case/UPPER_SNAKE naming) plus P1 type hints on every signature and Google-style docstrings on the public functions; one dead `import` removed; verified by an adversarial code-opencode audit (8 confirmed findings fixed, 10 false positives correctly rejected); `py_compile` and the 39-test suite green after; `scripts/README.md` added. |
| Canon gates | PASS: `package_skill.py --check` PASS with 8 intentional advisories (6 × 017 hyphen-naming on reference/fixture filenames + 2 × the diff-input fixtures carry no spec-doc frontmatter by design); `parent-skill-check.cjs` all hard invariants, 0 warnings (12 modes, create-diff registered); `check-frontmatter-versions.sh` clean (2823/2842 ok, rest skip-no-frontmatter). |
| Strict recursive validation | PASS: `validate.sh --recursive --strict` on 999 — 008, the parent, and phases 002–007 all Errors 0 / Warnings 0; the sole remaining tree warning is a pre-existing continuity-freshness lag in sibling 001-research (out of scope, untouched). |
| Phase-chain integration | PASS: added 008 parent back-reference + predecessor (007), and 007 successor → 008, so `PHASE_LINKS` on the parent is clean. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Long unbroken filenames and >99,999-line files** can still stress the header/gutter layout (reviewer P1.3/P1.4); reproduced only at extreme inputs and tracked as a bounded follow-up rather than closed here.
2. **The `@@` hunk header remains a human scan anchor**, not a machine-applicable patch header — by design; only the empty-file artifact that fed into it was corrected.
3. **EOF-newline is intentionally insignificant.** A tool that must surface a pure trailing-newline change would need the git-style marker this packet deliberately did not add.
<!-- /ANCHOR:limitations -->
