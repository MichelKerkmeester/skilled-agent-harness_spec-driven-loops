---
title: "Implementation Plan: Audit Performance Evidence"
description: "Plan to add a Performance Evidence block to the audit report template and a deterministic perf_evidence_check.py gate so a Performance score above 2 must carry a numeric metric or an explicit not-assessed label, while the truth of the metric stays advisory."
trigger_phrases:
  - "audit performance evidence plan"
  - "perf evidence gate design build"
  - "audit report baseline delta block"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/005-audit-performance-evidence"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked plan phases complete after the block and gate passed acceptance"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/audit_report_template.md"
      - ".opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py"
      - ".opencode/skills/sk-design/design-audit/references/accessibility_performance.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the deterministic bite is a checker or prose-only resolved to a NEW stdlib checker, matching the sibling numeric-law-index build pattern"
---
# Implementation Plan: Audit Performance Evidence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown fill-in template + Python 3 stdlib (`re`) for the deterministic gate |
| **Primary target (spec-named)** | `design-audit/assets/audit_report_template.md` (EDIT, additive — adds a Performance Evidence block + the Perf > 2 rule) |
| **Enforcement mechanism (NEW)** | `design-audit/scripts/perf_evidence_check.py` (NEW, additive — the deterministic checker that makes the rule bite) |
| **Evidence model bound** | `design-audit/references/accessibility_performance.md` §5 Performance Evidence; `design-audit/references/evidence_capture.md` §6 (metrics-unavailable → static-risk + measurement needed) |
| **Verification** | `perf_evidence_check.py` exits 0 when a filled report is honest, non-zero when a Performance score above 2 carries neither a numeric metric nor a not-assessed label |

### Overview
The audit report template scores Performance 0-4 in Section 5 but gives the Performance dimension no place to put a number, so a high optimize score can be claimed on prose alone. The impeccable corpus requires optimize claims to carry metric proof (`optimize.md:21`), and the audit's own evidence model already says metrics-unavailable findings become static-risk findings with a stated measurement needed (`evidence_capture.md` §6) — but nothing in the report makes that mandatory, and nothing checks it.

This build closes that gap in two additive moves:

1. **Express the requirement.** Add a **Performance Evidence** block to `audit_report_template.md` with the four fields the spec names — **baseline, post-change, a static-risk label, and the measurement needed** — plus the rule that a Performance score above 2 must carry a numeric metric or an explicit `not-assessed` label.
2. **Make it bite.** Add `perf_evidence_check.py`, a small stdlib checker that reads a filled report's Section 5 Performance score and its Performance Evidence block, and exits non-zero when a score above 2 has neither a numeric metric nor a not-assessed label.

**Honest enforcement boundary (hybrid).** The checker is deterministic about *structure*: it confirms that a number-with-unit or the `not-assessed` label is present whenever Perf > 2. It is **advisory** about *truth*: it cannot prove the number came from a real measurement run. That split is exactly the spec acceptance — "Whether the metric is real stays advisory." Without the checker the requirement would be advisory-only, so the checker is the in-scope mechanism that satisfies the deterministic acceptance, matching the sibling numeric-law-index build pattern (doc block + NEW stdlib gate).

Scope is frozen to one additive edit (the template) plus one new file (the checker). No other audit doc, asset, reference, or script is touched.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec target confirmed: `design-audit/assets/audit_report_template.md` exists and its Section 5 scores Performance 0-4 with no evidence fields
- [x] Field set fixed by spec §4: baseline, post-change, static-risk label, measurement needed
- [x] Rule fixed by spec §4/§5: a Perf score above 2 requires a numeric metric OR an explicit not-assessed label, deterministically
- [x] Existing evidence model located to bind the block to (`accessibility_performance.md` §5, `evidence_capture.md` §6) so the block restates the live model, not a new invention
- [x] Checker convention located: `shared/scripts/proof_check.py` (stdlib parser, exit 0/1/2)

### Definition of Done
- [x] `audit_report_template.md` carries a Performance Evidence block with all four named fields and the Perf > 2 rule — block present in Section 5, every existing section preserved verbatim
- [x] `perf_evidence_check.py` exists (stdlib only) and reads the Performance score + evidence block from a filled report — stdlib `re`/`json`, `py_compile` clean
- [x] ACCEPTANCE: a filled report with Perf > 2 and a numeric metric passes; the same report with the metric and not-assessed label removed fails — exit 0 with metric, exit 1 stripped naming the reason
- [x] ACCEPTANCE: a filled report with Perf <= 2 or a not-assessed Performance dimension passes regardless of the evidence block — Perf 2 exit 0, not-assessed exit 0
- [x] Advisory boundary honest: the checker and the template both state that a present number is structural proof only; metric truth stays advisory — both artifacts carry the presence-vs-realness split
- [x] Additive only: the template edit removes no prose; the checker is a new file; no other audit file modified — change set is one edit + one new file
- [x] Evergreen [HARD]: no spec/packet/phase IDs or `specs/` paths in the template block or the checker — grep over both finds none

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Template change (`audit_report_template.md`) — additive
Insert a `### Performance Evidence` subsection immediately after the Section 5 five-dimension score table and its rating-band line, before Section 6 OWNER MAPPING. Placing it inside Section 5 keeps it adjacent to the Performance score row and changes **no existing section number** — Sections 1-8 and their prose stay verbatim.

The block is a fill-in skeleton in the template's house style (honest labels, no marketing):

```markdown
### Performance Evidence

Fill this whenever the Performance dimension above scores higher than 2. A Performance
score above 2 is an optimize claim, and an optimize claim needs a measured number or an
honest not-assessed label — never prose alone.

| Field | Answer |
|---|---|
| Metric | `__________` (e.g. LCP, INP, CLS, frame time, bundle weight, request count) |
| Baseline | `__________` (number + unit, or `not-assessed`) |
| Post-change | `__________` (number + unit, `not-assessed`, or `n/a — report only`) |
| Evidence type | [ ] measured (name the tool and run) [ ] static-risk (no metric captured) |
| Static-risk label | `__________` (the static risk to record when no metric was measured) |
| Measurement needed | `__________` (the exact measurement that would confirm the claim) |

Rule: a Performance score above 2 must carry a numeric metric (a number with a unit) in
Baseline or Post-change, or the explicit `not-assessed` label. The deterministic check
confirms the number or the label is present; whether the number is a true measurement
stays a judgment call. See `../references/accessibility_performance.md` §5 and
`../references/evidence_capture.md` §6.
```

A light footer run-hint may be added so a filler knows the gate exists: `Deterministic check: ../scripts/perf_evidence_check.py <filled-report.md>`. Paths are skill-relative (evergreen), never `specs/` paths.

### Checker (`perf_evidence_check.py`) — the deterministic bite
A small stdlib checker mirroring the `proof_check.py` convention (arg parser, optional `--json`, exit 0/1/2). It grades a **filled report**, not the blank skeleton.

Algorithm:
1. **Find the Performance score.** Locate the Section 5 five-dimension score table; read the row whose dimension cell matches `/performance/i`; extract the `Score (0-4)` cell, stripping backticks/whitespace.
2. **Classify the score.**
   - A clean integer/float `> 2` → a gradable optimize claim that needs evidence.
   - `<= 2` → pass (the evidence block is optional below the optimize threshold).
   - `not-assessed` / `not assessed` in the score cell → pass (an honestly un-scored dimension is allowed).
   - Placeholder or blank score (`__`, empty) → fail (`performance score not filled`), so a half-filled report never green-lights.
3. **When evidence is required (score > 2), require one of:**
   - a **numeric metric** — a number-with-unit token (`\b\d+(?:\.\d+)?\s*(?:ms|s|kb|mb|gb|px|%|fps|reqs?|requests?)\b`, case-insensitive) or a recognized Core Web Vital with a number — present in the Baseline or Post-change cell, **or**
   - an explicit **not-assessed** label (`not-assessed` / `not assessed`) anywhere in the Performance Evidence block.
   - Neither present → FAIL (exit 1) with `Perf score > 2 without numeric metric or not-assessed label`.
4. **Exit contract:** `0` satisfied; `1` requirement violated or score unfilled; `2` usage error / unreadable file / no score table found. `--json` emits the structured result, mirroring `proof_check.py`.

### Enforcement honesty (hybrid, stated in both artifacts)
- **Code-enforced (deterministic):** the *presence* of a number-with-unit or the not-assessed label when Perf > 2. Re-runnable, same answer every run.
- **Advisory (judgment):** whether that number reflects a real measurement, the right tool, or a fair baseline. The checker cannot and does not assert this; the template says so in plain words.

### Additive / no-regression contract
- The template edit only inserts a new subsection; no existing line is deleted or reworded.
- The checker is a NEW file in a NEW `design-audit/scripts/` directory; nothing imports or depends on it yet, so it adds no coupling.
- Reverting the feature is: undo the inserted subsection + delete `perf_evidence_check.py`. Nothing else to unwind.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Express the requirement (template block)
- [x] Read the live `audit_report_template.md` Section 5 to confirm the exact Performance row + rating-band wording the block sits beneath — Performance row + `18-20/14-17/10-13/6-9/0-5` bands confirmed
- [x] Insert the `### Performance Evidence` block (four named fields + the Perf > 2 rule) immediately after the Section 5 score table; preserve every existing section and its prose verbatim — block inserted before Section 6, no renumber
- [x] Bind the block to the existing model by referencing `../references/accessibility_performance.md` §5 and `../references/evidence_capture.md` §6 (skill-relative paths only) — both references cited by skill-relative path

### Phase 2: Make it bite (checker)
- [x] Create `design-audit/scripts/perf_evidence_check.py` (stdlib only) with a `main()` arg parser, a target path, and an optional `--json`, mirroring `proof_check.py` — `main()` + `--json`, stdlib `re`/`json`
- [x] Implement the Section 5 Performance-score parser and the score classifier (>2 / <=2 / not-assessed / unfilled) — header-driven parse + `_classify_score`
- [x] Implement the evidence requirement: numeric-metric token OR not-assessed label when score > 2; wire the exit 0/1/2 contract and a human summary — number-with-unit / Core Web Vital / not-assessed accepted, exit 0/1/2 wired

### Phase 3: Verification
- [x] Filled report, Perf = 3 with a numeric metric → exit 0 — verified (Perf 4 + Baseline 2200ms, exit 0)
- [x] Tamper test: remove the metric and the not-assessed label from the same report → exit 1 naming the reason — verified, exit 1 "Perf score > 2 without numeric metric or not-assessed label"
- [x] Filled report, Perf = 2 → exit 0; Performance dimension marked not-assessed → exit 0; unfilled score → exit 1 — all three verified
- [x] Consistency: the block's fields and rule match the spec §4 field set and the existing evidence model; evergreen + scope-lock audits pass — field set matches §4, grep clean, change set is one edit + one new file

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Acceptance (pass) | Filled report, Perf > 2, numeric metric present | `perf_evidence_check.py report.md` exits 0 |
| Acceptance (fail) | Same report, metric + not-assessed label removed | exits 1, names `Perf score > 2 without numeric metric or not-assessed label` |
| Below-threshold | Filled report, Perf <= 2 | exits 0 (evidence block optional) |
| Not-assessed | Performance dimension marked not-assessed | exits 0 (honest un-score allowed) |
| Unfilled guard | Score cell left as placeholder | exits 1 (`performance score not filled`) |
| Usage / robustness | No score table, unreadable file, ragged row | exits 2 deterministically, no false pass |
| Additive lint | Template diff | only the new subsection added; no existing prose changed |
| Evergreen lint | Template block + checker | grep finds no `specs/` paths and no packet/phase IDs |
| Scope audit | Working tree | only `audit_report_template.md` edited + `perf_evidence_check.py` added |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `design-audit/assets/audit_report_template.md` Section 5 (Performance score row) | Internal | Green | No anchor for the evidence block or the score parser |
| `design-audit/references/accessibility_performance.md` §5 (Performance Evidence model) | Internal | Green | Block has no canonical model to bind to |
| `design-audit/references/evidence_capture.md` §6 (metrics-unavailable → static-risk) | Internal | Green | Static-risk / measurement-needed fields lose their source |
| `shared/scripts/proof_check.py` (stdlib checker convention) | Internal | Green | Checker would diverge from the established pattern |
| Python 3 stdlib (`re`, `json`) | External | Green | No deterministic gate possible |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the checker mis-fails an honest report, or the template block contradicts the existing evidence model.
- **Procedure**: remove the inserted `### Performance Evidence` subsection (restoring the template byte-for-byte) and delete `perf_evidence_check.py`. Both changes are additive and referenced by nothing else, so removal restores the prior state exactly. No data or migration to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Template block) ─┐
                          ├──> Phase 3 (Verify)
Phase 2 (Checker) ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Template block | None | Verify (the checker grades the block's fields) |
| Checker | None (can be drafted in parallel against the planned field set) | Verify |
| Verify | Template block, Checker | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Template block (four fields + rule, preserve prose) | Low | 30-45 minutes |
| Checker (`perf_evidence_check.py` parse + classify + require) | Medium | 1-1.5 hours |
| Verification (pass/fail/below-threshold/not-assessed/unfilled + audits) | Low | 45 minutes |
| **Total** | | **~2.25-3 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm the change set is exactly one edited template + one new checker — `audit_report_template.md` modified, `perf_evidence_check.py` added
- [x] Confirm no existing audit doc, reference, asset, or script other than the template is in the diff — no other audit file modified
- [x] Confirm the template diff inserts a subsection and deletes/rewords no existing prose — pure insertion, Sections 1-8 byte-preserved

### Rollback Procedure
1. Revert the `### Performance Evidence` insertion in `audit_report_template.md`
2. Delete `design-audit/scripts/perf_evidence_check.py` (and the empty `scripts/` dir if nothing else lands there)
3. Confirm no other audit file references the block or the checker (grep)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Subsection revert + file deletion only

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Template Performance Evidence block (additive) + perf_evidence_check.py deterministic gate + honest hybrid enforcement boundary
-->
