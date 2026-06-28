---
title: "Implementation Plan: Application-witness (loaded-determinative)"
description: "Plan to add an APPLICATION WITNESS section to the application proof card and an additive proof_check.py --require-application-witness flag that classifies not-loaded/loaded-inert/loaded-determinative and blocks ready-claims lacking a determinative witness."
trigger_phrases:
  - "application witness plan"
  - "loaded determinative design build"
  - "proof_check require application witness"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/010-application-witness"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark the application-witness plan gates and phases complete with evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Application-witness (loaded-determinative)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown card + Python 3 stdlib (`re`) |
| **Targets** | 1 proof card + 1 gate script (scope-locked) |
| **Mirrored pattern** | The just-landed `--require-source-proof` additive flag (D3-R6) in the same card + script |
| **Verification** | `proof_check.py --require-application-witness` classify + no-regression + `py_compile` |

### Overview
Loading a file proves nothing about use: today a card can claim a rule was loaded with no proof the rule actually shaped the output. This build raises the floor from "loaded" to "loaded had an observable effect on one named output choice". It adds an `APPLICATION WITNESS` section to `proof_of_application_card.md` — a row that names a concrete output choice (a value/decision in the produced UI) and the specific loaded mode rule that drove it — and a new `proof_check.py --require-application-witness` flag that classifies each row as `not-loaded`, `loaded-inert`, or `loaded-determinative` and **fails a ready-claim that has no `loaded-determinative` witness**.

The new flag is **additive** and **mirrors `--require-source-proof`**: parse a section by heading, read the first table beneath it, skip header/separator/placeholder rows, fold the result into the overall verdict only when the flag is set. With no flag (or `--json` / `--require-cards` / `--require-source-proof`), `proof_check.py` behaves byte-for-byte as it does today.

**Honest scope (recorded):** the witness proves a cited mode rule had an **observable effect** on one named choice — it does **not** prove the design is good. Whether the chosen value was tasteful stays advisory. The gate enforces presence of a load-bearing link, never quality.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Targets confirmed read in full: `proof_of_application_card.md`, `proof_check.py` (including the SOURCE PROOF scaffolding to mirror) — both read end to end before edit
- [x] The additive pattern to follow is identified: `--require-source-proof` argv token + `_find_source_proof_rows` + new `check()` key — mirrored by the witness token + `_find_application_witness_rows` + the `application_witness` key
- [x] Acceptance is deterministic (exit 0 vs exit 1) and classification-testable — determinative → exit 0; inert-only / none / malformed → exit 1
- [x] Scope frozen to the 1 card + 1 script; `context_loaded_card.md` is NOT in scope — only the two named files edited

### Definition of Done
- [x] `APPLICATION WITNESS` section added to `proof_of_application_card.md` (output choice / loaded rule source / classification / counterfactual) — `## 7. APPLICATION WITNESS` placed after `SOURCE PROOF`
- [x] `proof_check.py --require-application-witness` classifies each row and requires ≥1 well-formed `loaded-determinative` witness — `_validate_application_witness` returns `ok` only on a well-formed determinative row
- [x] A card with a determinative witness passes; a card with only `loaded-inert` / no witness fails — determinative → `ok True` (exit 0); inert-only → `no loaded-determinative witness` (exit 1)
- [x] No-regression: no-flag, `--json`, `--require-cards`, `--require-source-proof` invocations unchanged; `python3 -m py_compile` passes — no-flag carries NEITHER `source_proof` NOR `application_witness`; `--require-source-proof` emits `source_proof` only; `py_compile` exit 0
- [x] Evergreen: no spec/packet/phase IDs or spec paths in the card or the script — evergreen scan clean over both edits

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### APPLICATION WITNESS block shape (proof card)
Add one new numbered section after `SOURCE PROOF`. Keep it one-screen and parseable as a 4-column markdown table with a fixed column order `[Output choice, Loaded rule source, Classification, Counterfactual]`:

```markdown
## 7. APPLICATION WITNESS

A witness proves a loaded rule had an observable effect on ONE named output choice — it does NOT prove
the design is good (taste stays advisory). Classify each row: `not-loaded` (rule never loaded),
`loaded-inert` (loaded but no output choice traces to it), `loaded-determinative` (a cited loaded rule
changed a named output choice). A ready-claim needs at least one `loaded-determinative` witness.
Gate: `python3 ../scripts/proof_check.py --require-application-witness <this-file>.md`.

| Output choice | Loaded rule source | Classification | Counterfactual (choice without the rule) |
|---|---|---|---|
| `__________` | `__________` | [ ] not-loaded [ ] loaded-inert [ ] loaded-determinative | `__________` |
```

Field meaning:

| Field | Meaning | Checker action |
|---|---|---|
| `Output choice` | A concrete value/decision in the produced UI (e.g. "card padding token = space-4") | Require non-placeholder for a `loaded-determinative` row |
| `Loaded rule source` | The specific loaded mode rule that drove it (e.g. "foundations spacing-scale rule") | Require non-placeholder for a `loaded-determinative` row |
| `Classification` | One of `not-loaded` / `loaded-inert` / `loaded-determinative` (checkbox) | Detect the checked `[x]` form; only `loaded-determinative` satisfies a ready-claim |
| `Counterfactual` | What the choice would have been without the rule | Carried for the reader; not the strong check |

The **classification + named pair** is the anti-self-attestation lever (mirrors how SOURCE PROOF's echo is the lever and its anchor is reader-only): a checkbox can be ticked, but a `loaded-determinative` mark is only well-formed when it names both the output choice and the rule that drove it. The counterfactual is the human-readable falsifiability anchor, not the gated field.

### `--require-application-witness` algorithm
1. **Parse** the `APPLICATION WITNESS` section: locate a heading matching `/APPLICATION WITNESS/i`, then the first markdown table beneath it (until the next heading). Read data rows of 4 cells in fixed order `[Output choice, Loaded rule source, Classification, Counterfactual]`. Skip the header row, the `|---|` separator, and **placeholder rows** (cells that are only underscores / whitespace / empty and an unchecked classification). Mirror `_find_source_proof_rows`.
2. **Presence:** if the flag is set and there are zero real rows → FAIL (`application-witness rows missing`).
3. **Per real row — classify** from the `Classification` cell using checkbox-aware detection of the checked `[x]` form: `not-loaded` / `loaded-inert` / `loaded-determinative`. A `loaded-determinative` row whose `Output choice` or `Loaded rule source` is placeholder → FAIL (`witness not well-formed`).
4. **Aggregate:** the witness passes only when at least one **well-formed** `loaded-determinative` row exists. Real rows present but none `loaded-determinative` (all `loaded-inert` / `not-loaded`) → FAIL (`no loaded-determinative witness`). Fold the result into overall `ok` (and into `missing` when it fails) so the existing exit contract (0 = pass, 1 = fail, 2 = usage) is preserved.

### No-regression contract
- `--require-application-witness` is a new opt-in token in `argv`; absence ⇒ zero new behavior.
- The existing `--require-source-proof` path (`_validate_source_proof`, `source_proof` key, its `missing` contributions) is **untouched** and continues to work exactly as today.
- Existing `check(...)` return keys (`fields`, `cards`, `ready`, `not_ready_flag`, `missing`, `ok`, and `source_proof` when its flag is set) stay present and unchanged. The witness adds a new key (e.g. `application_witness`) and contributes to `missing`/`ok` **only** when `--require-application-witness` is set.
- The card itself is still read as utf-8 text exactly as today; no new file I/O is introduced (unlike source-proof, the witness reads only the card text).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Card
- [x] Add an `## 7. APPLICATION WITNESS` section (classifier line + 4-column table + the honest "observable effect, not taste" framing) to `proof_of_application_card.md`, placed after `SOURCE PROOF` — section present after `SOURCE PROOF`
- [x] Extend the footer gate hint to document the stricter `--require-application-witness` mode — footer names `--require-application-witness` beside `--require-source-proof`

### Phase 2: Checker
- [x] Add `--require-application-witness` to arg parsing (additive, beside `--json` / `--require-cards` / `--require-source-proof`) — token parsed in `main()`; usage string updated
- [x] Implement the APPLICATION WITNESS table parser (heading scope, row extraction, placeholder skip) mirroring `_find_source_proof_rows` — `_find_application_witness_rows` skips header/separator/placeholder rows
- [x] Add checkbox-aware classification regexes (`not-loaded` / `loaded-inert` / `loaded-determinative`) and classify each row — `_application_classification` detects the checked `[x]` form against `APPLICATION_CLASSIFICATIONS`
- [x] Implement well-formedness (a `loaded-determinative` row needs non-placeholder output choice + rule source) and the aggregate verdict (≥1 well-formed determinative witness) — `_validate_application_witness` enforces both
- [x] Thread the result into `check()` output + overall `ok` without breaking existing keys or the `--require-source-proof` path — `application_witness` folds into `missing`/`ok` only under the flag; source-proof path untouched

### Phase 3: Verification
- [x] Card with a well-formed `loaded-determinative` witness → exit 0 — `application_witness.ok True`, exit 0
- [x] Card whose only witness is `loaded-inert` → exit 1 (no loaded-determinative witness) — confirmed `no loaded-determinative witness`, exit 1
- [x] Card with no witness rows → exit 1 (application-witness rows missing); malformed determinative row → exit 1 (witness not well-formed) — both reasons confirmed, exit 1 each
- [x] No-regression: `--require-source-proof` and no-flag / `--json` / `--require-cards` identical to baseline; `python3 -m py_compile proof_check.py` exits 0 — no-flag carries NEITHER key; `--require-source-proof` emits `source_proof` only; `py_compile` exit 0
- [x] Evergreen + scope audit (grep for IDs/paths; only the 1 card + script changed) — evergreen grep clean; only the two named files edited

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Acceptance (pass) | Card with a well-formed `loaded-determinative` witness | `proof_check.py --require-application-witness <card>` exits 0 |
| Acceptance (fail: inert) | Card whose only witness row is `loaded-inert` | exits 1, reason = no loaded-determinative witness |
| Acceptance (fail: none) | Card with placeholder-only witness rows | exits 1, reason = application-witness rows missing |
| Acceptance (fail: malformed) | A `loaded-determinative` row missing output choice or rule source | exits 1, reason = witness not well-formed |
| No-regression (source-proof) | `--require-source-proof` on an existing card | output + exit identical to pre-change baseline |
| No-regression (base) | No flag, `--json`, `--require-cards` on an existing card | output + exit identical to baseline |
| Compile | `python3 -m py_compile proof_check.py` | exits 0 |
| Evergreen lint | Card + script | grep finds no spec/packet/phase IDs or spec paths |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `proof_check.py` `check()` entry + `--require-source-proof` scaffolding | Internal | Green | No additive integration point / pattern to mirror |
| `proof_of_application_card.md` SOURCE PROOF section (structural precedent) | Internal | Green | No section pattern to follow for the witness block |
| Python 3 stdlib (`re`) | External | Green | No parser/classifier possible |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `--require-application-witness` mis-fails a card with a well-formed determinative witness, or any existing (no-flag / `--json` / `--require-cards` / `--require-source-proof`) invocation changes behavior.
- **Procedure**: Revert the two touched files. The flag is additive, so reverting the script restores the original gate (including `--require-source-proof`) exactly; reverting the card removes the APPLICATION WITNESS section. No data or migration to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Card) ───┐
                  ├──> Phase 3 (Verify)
Phase 2 (Checker)─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Card | None | Verify (needs a real witness block to test) |
| Checker | None (can be drafted in parallel) | Verify |
| Verify | Card, Checker | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Card (APPLICATION WITNESS block) | Low | 20 minutes |
| Checker (parse + classify + thread) | Medium | 1.5-2 hours |
| Verification (acceptance + no-regression + compile + audit) | Medium | 1 hour |
| **Total** | | **~3 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured: current `proof_check.py` output for no-flag / `--json` / `--require-cards` / `--require-source-proof` on an existing card — no-flag and `--require-source-proof` shapes confirmed unchanged
- [x] Confirm only the 2 scope-locked files are staged — only `proof_of_application_card.md` + `proof_check.py` edited by the build
- [x] Confirm `context_loaded_card.md` is NOT modified (the witness lives only on the application card) — untouched

### Rollback Procedure
1. `git checkout -- <the 2 files>` to restore the originals
2. Re-run the baseline invocations plus `--require-source-proof` to confirm the prior gate is restored
3. No database, migration, or downstream consumer to reconcile (markdown + stdlib only)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File revert only

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- APPLICATION WITNESS block shape + --require-application-witness classify algorithm + no-regression contract
-->
