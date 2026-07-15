---
title: "Implementation Plan: create-diff fidelity, safety, and accessibility hardening"
description: "Land the reconciled GPT-review fixes in create_diff.py and validate_report.py behind a checked-in regression suite: strict decode, correct empty/EOF-newline line model, an HTMLParser safety gate, legend contrast, and a keyboard-operable scoped side-by-side scroll."
trigger_phrases:
  - "create-diff hardening plan"
  - "diff strict decode plan"
  - "validate report rewrite"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/008-fidelity-safety-a11y-hardening"
    last_updated_at: "2026-07-15T16:33:01Z"
    last_updated_by: "claude"
    recent_action: "Aligned scripts to code-opencode; closed T010/T012; reconciled evidence and status"
    next_safe_action: "Dispatch the GPT-5.6 SOL ULTRA (fast) review, then make the scoped commit"
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
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-diff fidelity, safety, and accessibility hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (stdlib only) |
| **Framework** | None — single-file CLI engine + validator |
| **Storage** | Local content-addressed snapshot store (unchanged) |
| **Testing** | New `test_create_diff.py`, stdlib `unittest`/asserts, offline |

### Overview
Fix the reconciled defects surgically inside the two existing scripts and lock each with a test. Prefer the smallest change that makes the honest behavior true: refuse rather than fabricate, parse rather than regex, measure contrast rather than assert it. Keep every already-passing invariant (zero-JS, exact CSP, escaping, byte-reproducibility) green throughout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Findings independently re-verified against source (not taken on the reviewer's word)
- [ ] Scope frozen in spec.md; operator selected redesign + engine hardening
- [ ] Fix approach chosen for each finding

### Definition of Done
- [ ] Each REQ has a failing-before / passing-after test
- [ ] Four demo reports regenerate, validate, stay byte-reproducible
- [ ] `validate.sh --recursive --strict` on 999 = 0/0; canon gates clean
- [ ] Docs (capabilities, contract, 006 summary) reconciled
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file stdlib CLI (extract → normalize → diff → render) plus a standalone report validator. No new modules; fixes stay inside existing functions.

### Key Components
- **`_read_text_file` / `extract`**: gains strict-decode + unknown-extension warning.
- **`diff_lines` + `_logical_lines`**: logical-line model (empty → no lines; trailing EOF newline treated as insignificant).
- **`_CSS` + `_render_side_by_side`**: legend contrast rule; `.sxs` min-width; scroll-wrapper a11y attributes.
- **`validate_report.py`**: HTMLParser-based safety gate.
- **`test_create_diff.py`**: regression harness.

### Data Flow
Unchanged pipeline; the fixes tighten the decode boundary (input), the line model (middle), the render a11y (output), and add an independent parse-based gate over the rendered artifact.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `_read_text_file` (producer) | Decodes source bytes with `errors="replace"` | update: strict decode + explicit refusal | test: invalid-byte pair not identical; undecodable exits 3 |
| `_looks_binary` (policy) | NUL-only binary sniff on unknown-ext fallback | update: also refuse undecodable full-tier text | test: `0xFF`-run `.blob` refused or warned |
| `diff_lines` + line splitter (producer) | `split("\n")` creates phantom blank lines | update: logical-line model (`_logical_lines`) | test: empty→content pure add; newline-only insignificant |
| `_CSS` `.legend mark.wd` (producer) | Inherits `--text-muted` on inline tint | update: `color:var(--text)` | test: contrast_check pairs pass both themes |
| `_render_side_by_side` + `.sxs`/`.diff-scroll` (producer) | width:100%, no min-width, no a11y attrs | update: min-width + role/aria/tabindex/focus | grep: attributes present; min-width on table |
| `validate_report.py` (policy/gate) | Regex tags; CSP existence only | rewrite: HTMLParser, exact CSP, URL-attr + @import checks | test: hostile payload FAILS; 4 reports PASS |
| Docs: capabilities-and-fidelity, accessibility-contract, 006 summary (consumer) | Describe behavior/claims now partly false | update: align to true behavior | read: wording matches implementation |

Required inventories:
- Consumers of the changed report structure: `rg -n 'diff-scroll|mark wd|is-empty' .opencode/skills/sk-doc/create-diff`
- Callers of the validator: `rg -n 'validate_report' .opencode/skills/sk-doc/create-diff`
- Algorithm invariant (decode): a reported "identical" result MUST imply byte-equal-after-normalization inputs; adversarial case = differing invalid-UTF-8 bytes.
- Algorithm invariant (validator): PASS MUST imply no live handler, no non-`data:` external reference, exact CSP directive set; adversarial cases = malformed-attribute handler, `@import`, remote `src`, permissive CSP.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Engine correctness
- [ ] Strict decode + unknown-extension warning (REQ-001)
- [ ] Logical-line model; trailing EOF newline treated as insignificant (REQ-004)

### Phase 2: Safety gate + presentation a11y
- [ ] Rewrite `validate_report.py` to an HTMLParser gate (REQ-003)
- [ ] Legend contrast CSS (REQ-002)
- [ ] Side-by-side min-width + keyboard/ARIA scroll region (REQ-005)

### Phase 3: Lock + reconcile
- [ ] `test_create_diff.py` regression suite (REQ-006)
- [ ] Regenerate + validate demo reports; byte-reproducibility
- [ ] Reconcile docs + 006 summary (REQ-007); canon gates + strict validation (in progress)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | decode, line model, hunk/pairing/collapse, contrast token pairs | stdlib `unittest` |
| Contract | zero-JS, exact CSP, escaping, byte-reproducibility | subprocess + `validate_report.py` |
| Adversarial | validator against hostile payloads; decode against invalid bytes | in-suite fixtures |
| Manual | regenerate the four demo reports, eyeball the redesign | browser (self-contained HTML) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `contrast_check.py` (sk-design) | Internal | Green | Contrast asserted manually |
| Python 3 stdlib (`html.parser`, `difflib`) | External | Green | None — always present |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix regresses an existing invariant (report stops validating, output stops being byte-reproducible, or a valid report is over-rejected).
- **Procedure**: the changes are uncommitted and scoped to two scripts + one new test file; revert the specific hunk via `git checkout -- <file>` (nothing committed yet), or drop the new test file. No data migration, no deployed consumer.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Engine) ──► Phase 3 (Lock + reconcile)
Phase 2 (Gate + a11y) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Engine correctness | None | Lock |
| Gate + a11y | None | Lock |
| Lock + reconcile | Engine, Gate+a11y | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Engine correctness | Med | ~1-2 hours |
| Gate + a11y | Med | ~1-2 hours |
| Lock + reconcile | Med | ~1-2 hours |
| **Total** | | **~3-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All new tests pass locally before any commit
- [ ] Four demo reports validate and are byte-reproducible
- [ ] No concurrent-session files staged

### Rollback Procedure
1. `git checkout -- <changed script>` (nothing is committed until operator go)
2. Remove `test_create_diff.py` if partial
3. Regenerate the demo reports to confirm the pre-change baseline

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — source scripts only, no persisted state schema change
<!-- /ANCHOR:enhanced-rollback -->
