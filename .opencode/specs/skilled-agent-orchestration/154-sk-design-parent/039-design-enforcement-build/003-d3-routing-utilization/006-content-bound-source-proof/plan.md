---
title: "Implementation Plan: Content-bound SOURCE PROOF"
description: "Plan to add a SOURCE PROOF (path/sha256/anchor/echo) block to both proof cards and a recompute-based proof_check.py --require-source-proof flag."
trigger_phrases:
  - "source proof plan"
  - "content bound proof design build"
  - "proof_check require source proof"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
# Implementation Plan: Content-bound SOURCE PROOF

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown cards + Python 3 stdlib (`hashlib`, `re`) |
| **Targets** | 2 proof cards + 1 gate script (scope-locked) |
| **Reused contract** | `../../references/design_proof_token.md` §4 raw-byte sha256 + canonicalization |
| **Verification** | `proof_check.py --require-source-proof` recompute + tamper tests |

### Overview
Utilization is self-attested today: a checkbox can claim a file was loaded with no proof it was. This build replaces self-attestation with a **content-bound** SOURCE PROOF: each cited file carries its raw-byte `sha256` plus a short verbatim `echo` quote that exists inside that file, and `proof_check.py --require-source-proof` recomputes the digest from disk and confirms the echo is really present — failing on a tampered digest or a missing/forged anchor, not merely on a missing field.

The digest rule is **reused, not reinvented**: `SOURCE PROOF` sha256 is the raw-byte SHA-256 (`sha256:<64 lowercase hex>`) defined in `design_proof_token.md` §4 — no trim, no line-ending normalization, no frontmatter strip, no symlink resolution. There is exactly one hashing rule in the system.

The new flag is **additive**: with no flag (or `--json` / `--require-cards`), `proof_check.py` behaves byte-for-byte as it does today.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Targets confirmed read: `context_loaded_card.md`, `proof_of_application_card.md`, `proof_check.py` (full), `design_proof_token.md` §4
- [x] Reused hashing rule identified (`design_proof_token.md` §4) — no second rule to be authored
- [x] Acceptance is deterministic (exit 0 vs exit 1) and tamper-testable
- [x] Scope frozen to the 2 cards + 1 script

### Definition of Done
- [ ] SOURCE PROOF block added to both cards (path / sha256 / anchor / echo)
- [ ] `proof_check.py --require-source-proof` recomputes digest + verifies echo
- [ ] Faithful card passes; tampered digest fails; absent/forged echo fails
- [ ] No-regression: no-flag, `--json`, `--require-cards` invocations unchanged
- [ ] Evergreen: no spec/packet/phase IDs or spec paths in cards or script

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### SOURCE PROOF block shape (both cards)
Add a new numbered section to each card. Keep it one-screen and parseable as a 4-column markdown table with a fixed column order `[Path, SHA256, Anchor, Echo]`:

```markdown
## N. SOURCE PROOF

Recompute rule: raw-byte sha256 per `../../references/design_proof_token.md` §4 (no trim, no newline
normalization, no frontmatter strip). Gate: `python3 ../scripts/proof_check.py --require-source-proof <this-file>.md`.

| Path | SHA256 | Anchor | Echo |
|---|---|---|---|
| `__________` | `sha256:__________` | `__________` | `__________` |
```

Field meaning:

| Field | Meaning | Checker action |
|---|---|---|
| `Path` | Repository-relative POSIX path of a loaded/cited file | Resolve to disk; read raw bytes |
| `SHA256` | `sha256:<64 lowercase hex>` of the file's raw bytes (per token §4) | Recompute from disk; reject on mismatch |
| `Anchor` | Human-readable locator for the quote (heading, line, or marker) | Carried for the reader; not the strong check |
| `Echo` | Short verbatim quote copied from inside the cited file | Reject unless it appears literally in the file |

The **echo** is the anti-self-attestation lever: a checkbox can be ticked without reading the file, but a verbatim quote that must still be found inside the live file cannot be produced without the content.

### `--require-source-proof` algorithm
1. **Parse** the `SOURCE PROOF` section: locate a heading matching `/SOURCE PROOF/i`, then the first markdown table beneath it (until the next heading). Read data rows of 4 cells in fixed order `[Path, SHA256, Anchor, Echo]`. Skip the header row, the `|---|` separator, and **placeholder rows** (cells that are only underscores / whitespace / empty).
2. **Presence:** if the flag is set and there are zero real rows → FAIL (`source-proof rows missing`).
3. **Per real row:**
   - Resolve `Path` (repo-relative) to an absolute path by ascending from the card's directory to the repo root (first ancestor containing `.opencode/` or `.git/`), falling back to cwd.
   - Read the cited file with `open(path, "rb")`; recompute `hashlib.sha256(raw_bytes).hexdigest()`; compare (lowercased, tolerant of the `sha256:` prefix). Mismatch → FAIL (`digest mismatch`).
   - Decode the file (utf-8) and confirm the `Echo` string is a **verbatim substring**. Echo empty/placeholder or not found → FAIL (`anchor echo absent/forged`).
   - Unreadable cited file → FAIL (fail-closed, per token §6 "fail closed on unreadable required inputs").
4. **Aggregate:** source-proof passes only when every real row passes both digest and echo. Fold the result into overall `ok` (and into `missing` when it fails) so the existing exit contract (0 = pass, 1 = fail) is preserved.

### No-regression contract
- `--require-source-proof` is a new opt-in token in `argv`; absence ⇒ zero new behavior.
- Existing `check(text, require_cards)` return keys (`fields`, `cards`, `ready`, `not_ready_flag`, `missing`, `ok`) stay present and unchanged for existing callers. Source-proof adds a new key (e.g. `source_proof`) and contributes to `missing`/`ok` **only** when the flag is set.
- Cited-file reads use binary mode; the card itself is still read as utf-8 text exactly as today.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Cards
- [ ] Add `SOURCE PROOF` section (path/sha256/anchor/echo table + recompute rule line) to `context_loaded_card.md`
- [ ] Add `SOURCE PROOF` section to `proof_of_application_card.md`; extend the footer gate hint with the `--require-source-proof` stricter mode

### Phase 2: Checker
- [ ] Add `--require-source-proof` to arg parsing (additive, beside `--json` / `--require-cards`)
- [ ] Implement SOURCE PROOF table parser (heading scope, row extraction, placeholder skip)
- [ ] Implement raw-byte sha256 recompute (binary read) + compare per token §4
- [ ] Implement echo verbatim verification (decoded substring) + fail-closed unreadable
- [ ] Thread result into `check()` output + overall `ok` without breaking existing keys

### Phase 3: Verification
- [ ] Faithful card → exit 0
- [ ] Tampered digest → exit 1 (tamper test)
- [ ] Forged/absent echo → exit 1 (tamper test)
- [ ] No-regression: no-flag / `--json` / `--require-cards` identical to baseline
- [ ] Evergreen + scope audit (grep for IDs/paths; only 2 cards + script changed)

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Acceptance (pass) | Faithful filled card | `proof_check.py --require-source-proof <card>` exits 0 |
| Acceptance (tamper digest) | One hex char flipped in a `SHA256` cell | exits 1, reason = digest mismatch |
| Acceptance (tamper echo) | `Echo` replaced with text absent from the cited file | exits 1, reason = anchor echo absent/forged |
| No-regression | No flag, `--json`, `--require-cards` on an existing card | Output + exit identical to pre-change baseline |
| Fail-closed | Cited path unreadable / missing | exits 1 (does not pass) |
| Evergreen lint | Cards + script | grep finds no spec/packet/phase IDs or spec paths |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `design_proof_token.md` §4 (raw-byte sha256 rule) | Internal | Green | No source-of-truth hashing rule to reuse |
| Python 3 stdlib (`hashlib`, `re`) | External | Green | No recompute possible |
| `proof_check.py` line-47 `check()` entry | Internal | Green | No additive integration point |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `--require-source-proof` mis-fails a faithful card, or any existing (no-flag/`--json`/`--require-cards`) invocation changes behavior.
- **Procedure**: Revert the three touched files. The flag is additive, so reverting the script restores the original gate exactly; reverting the two cards removes the SOURCE PROOF sections. No data or migration to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Cards) ─┐
                 ├──> Phase 3 (Verify)
Phase 2 (Checker)┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Cards | None | Verify (needs a real SOURCE PROOF block to test) |
| Checker | None (can be drafted in parallel) | Verify |
| Verify | Cards, Checker | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Cards (2 SOURCE PROOF blocks) | Low | 30 minutes |
| Checker (parse + recompute + echo) | Medium | 1.5-2 hours |
| Verification (3 acceptance + no-regression + tamper) | Medium | 1 hour |
| **Total** | | **~3-3.5 hours** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline captured: current `proof_check.py` output for no-flag / `--json` / `--require-cards` on an existing card
- [ ] Confirm only the 3 scope-locked files are staged
- [ ] Confirm `design_proof_token.md` is NOT modified (reused, not edited)

### Rollback Procedure
1. `git checkout -- <the 3 files>` to restore the originals
2. Re-run the baseline invocations to confirm the original gate is restored
3. No database, migration, or downstream consumer to reconcile (markdown + stdlib only)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File revert only

<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- SOURCE PROOF block shape + --require-source-proof algorithm + no-regression contract
-->
