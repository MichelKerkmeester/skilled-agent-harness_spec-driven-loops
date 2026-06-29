---
title: "Implementation Plan: Polish Readiness Gate"
description: "Plan to turn polish readiness from prose into a structured gate: a Polish Readiness subsection in critique_hardening.md (verdict vocabulary, report-row shape, deterministic unfinished-marker scan, verdict-mapping rule) plus a NEW polish_readiness_check.py that runs the TODO/FIXME scan and refuses a ready verdict while unfinished markers remain, while whether a clean surface is truly polished stays advisory."
trigger_phrases:
  - "polish readiness gate plan"
  - "todo fixme scan verdict design build"
  - "critique hardening polish readiness row"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/010-polish-readiness-gate"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan complete with evidence; keep canonical L2 phase-deps/effort/rollback anchors"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/critique_hardening.md"
      - ".opencode/skills/sk-design/design-audit/scripts/polish_readiness_check.py"
      - ".opencode/skills/sk-design/design-audit/references/audit_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the deterministic bite is a checker or prose-only resolved to a NEW stdlib checker, matching the sibling audit-performance-evidence build pattern (doc block + NEW stdlib gate)"
      - "Whether the report row is pre-printed into audit_report_template.md resolved to NO: the spec names only critique_hardening.md, so the row shape is defined there (as the Visual-Critique Crosswalk already defines probes that feed the report) and pre-printing into the report template is left to a separate phase"
---
# Implementation Plan: Polish Readiness Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference subsection + Python 3 stdlib (`re`, `subprocess`/`os.walk`) for the deterministic gate |
| **Primary target (spec-named)** | `design-audit/references/critique_hardening.md` (EDIT, additive — adds a `Polish Readiness` subsection: verdict vocabulary, report-row shape, the unfinished-marker scan, and the verdict-mapping rule) |
| **Enforcement mechanism (NEW)** | `design-audit/scripts/polish_readiness_check.py` (NEW, additive — runs the unfinished-marker scan over a surface and refuses a `ready` verdict while markers remain) |
| **Evidence model bound** | `critique_hardening.md` §6 Polish Checks + §7 Evidence Limits; impeccable `polish.md` ("Detector and automated QA output are defect evidence only … known issues to preserve, mark with TODOs") |
| **Verification** | `polish_readiness_check.py` exits 0 when the polish-readiness row carries an allowed verdict consistent with the scan, non-zero when a `ready` verdict is asserted while unfinished markers were found, or when the row/verdict is missing |

### Overview
Today `critique_hardening.md` §6 *narrates* polish: "Polish Checks", a "Visual-Critique Crosswalk" of lenses, and "Polish As Trust" prose. There is no verdict, no vocabulary, and no scan of unfinished markers — so a packet can read as "polished" while `TODO`/`FIXME` markers still sit in the surface. Impeccable's polish pass is explicitly a readiness gate ("Are there known issues to preserve? Mark with TODOs"; "A clean script result is never proof that the design is strong") — the live critique only narrates that intent.

This build turns narration into a structured gate in two additive moves:

1. **Express the requirement.** Add a `### Polish Readiness` subsection to `critique_hardening.md` §6 that names the verdict vocabulary the spec fixes — **ready / blocked / not-assessed** — defines the **report-row shape** an auditor emits, specifies the **deterministic unfinished-marker scan** (`TODO`/`FIXME` and the same-class markers `XXX`/`HACK`/`WIP`), and states the **verdict-mapping rule** that feeds the row from the scan.
2. **Make it bite.** Add `polish_readiness_check.py`, a small stdlib checker that runs the unfinished-marker scan over a target surface and grades the asserted polish-readiness row: it exits non-zero when a `ready` verdict is claimed while the scan found markers, or when the row/verdict is missing or uses a token outside the allowed set.

**Honest enforcement boundary (hybrid).** The checker is deterministic about *facts*: the unfinished-marker scan is `ripgrep`-equivalent — same surface, same hits, every run — and the rule "a `ready` verdict cannot stand while markers remain" is mechanically checkable. It is **advisory** about *judgment*: a zero-marker scan plus a `ready` verdict is **necessary, not sufficient** — it never proves the surface is actually polished, because perceived quality, design-system alignment, and state craft need rendered and human review. `critique_hardening.md` §7 already says "A clean detector result is not proof of a strong design," and impeccable `polish.md` says the same; the gate makes the *absence* of a readiness verdict and the *presence* of unfinished markers loud and blocking, never certifies taste. Without the checker the requirement would be advisory-only, so the checker is the in-scope mechanism that satisfies the deterministic acceptance, matching the sibling audit-performance-evidence build pattern (doc block + NEW stdlib gate).

Scope is frozen to one additive edit (the reference subsection) plus one new file (the checker). The report row is defined inside `critique_hardening.md` — the way that file already defines the Visual-Critique Crosswalk probes that feed the audit model without owning `audit_report_template.md`. No other audit doc, asset, reference, or script is touched.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec target confirmed: `design-audit/references/critique_hardening.md` §6 Polish Checks narrates polish with no verdict, no vocabulary, and no unfinished-marker scan — confirmed; §6 ended with "Polish As Trust" prose only
- [x] Verdict vocabulary fixed by spec: `ready`, `blocked`, `not-assessed` — exactly three tokens — `ALLOWED_VERDICTS` and the subsection both carry exactly these three
- [x] Deterministic mechanism fixed by spec: a static `TODO`/`FIXME` scan feeding the verdict — `\b(TODO|FIXME|XXX|HACK|WIP)\b` scan implemented in the checker
- [x] Existing model located to bind the subsection to (§6 Polish Checks, §7 Evidence Limits; impeccable `polish.md` mark-with-TODOs + clean-script-is-not-proof) so the subsection restates the live intent, not a new invention — subsection references §6/§7; necessary-not-sufficient line traces to §7
- [x] Checker convention located: `design-audit/scripts/perf_evidence_check.py` and `shared/scripts/proof_check.py` (stdlib parser, exit 0/1/2, optional `--json`) — checker mirrors the convention (argparse, exit 0/1/2, `--json`)

### Definition of Done
- [x] `critique_hardening.md` carries a `### Polish Readiness` subsection with the three-token verdict vocabulary, the report-row shape, the unfinished-marker scan, and the verdict-mapping rule — every existing section and its prose preserved verbatim — subsection at line 107; §§1-7 intact, 0 removed
- [x] `polish_readiness_check.py` exists (stdlib only), runs the unfinished-marker scan over a target surface, and grades an asserted polish-readiness row — created; stdlib only; `py_compile` OK
- [x] ACCEPTANCE: a polish-readiness row with verdict `ready` over a surface the scan finds clean → exit 0; the same row with an unfinished marker introduced into the surface → exit 1 naming the reason — exit 0 clean; exit 1 "ready claimed with N unfinished markers present"
- [x] ACCEPTANCE: `blocked` (markers present or a named blocker) and `not-assessed` (scan not run / surface unavailable) both behave honestly — `blocked` with markers passes, `ready` with markers fails, `not-assessed` passes — verified: blocked → 0, not-assessed → 0
- [x] ACCEPTANCE: a missing row, a missing verdict, or a verdict token outside `{ready, blocked, not-assessed}` → exit 1 naming the reason — exit 1 "polish readiness row missing or verdict not in {ready, blocked, not-assessed}"
- [x] Advisory boundary honest: the subsection and the checker both state that a clean scan plus a `ready` verdict is necessary not sufficient — taste, design-system alignment, and state craft stay advisory — written into the subsection and the checker docstring
- [x] Additive only: the reference edit removes no prose; the checker is a new file; no other audit file modified — change set is the one edit + the one new checker
- [x] Evergreen [HARD]: no spec/packet/phase IDs or `specs/` paths in the subsection or the checker — only skill-relative paths — evergreen grep over both clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Reference change (`critique_hardening.md`) — additive
Insert a `### Polish Readiness` subsection at the **end of §6 Polish Checks**, after "Polish As Trust" and before §7 Evidence Limits. Placing it inside §6 keeps it adjacent to the existing polish prose and the Visual-Critique Crosswalk, and changes **no existing section number** — §§1-7 and their prose stay verbatim.

The subsection has four parts, in the file's house style (plain, honest, no marketing):

1. **Verdict vocabulary** — exactly three tokens with one-line definitions:
   - `ready` — the unfinished-marker scan is clean and the §6 polish checks (design-system alignment, state quality, edge cases) were walked.
   - `blocked` — the scan found one or more unfinished markers, or a named incomplete/known-issue state remains.
   - `not-assessed` — the scan did not run or the surface was unavailable, so readiness is honestly unknown.
2. **The unfinished-marker scan** — a deterministic, re-runnable scan for the same-class markers `TODO`, `FIXME`, `XXX`, `HACK`, `WIP` (word-boundary) over the resolved surface, documented as a `ripgrep` one-liner plus the checker invocation. This is the "static `TODO`/`FIXME` scan" the spec names; `ripgrep` is the deterministic engine.
3. **The report row** — a small markdown row an auditor emits into the audit report, e.g. `| Polish readiness | <verdict> | <scan command → N markers> | <locations or "rendered/state review done"> |`. Defined here (like the Visual-Critique Crosswalk) so the row has a single source of shape without editing `audit_report_template.md`.
4. **The verdict-mapping rule** — markers present ⇒ at most `blocked`; `ready` requires a clean scan **and** the rendered/state review; scan not run ⇒ `not-assessed`. Plus the honest line: a clean scan plus `ready` is necessary, not sufficient — it is not proof of a strong design (§7).

A light footer run-hint may be added: `Deterministic check: ../scripts/polish_readiness_check.py --scan <surface> <filled-report.md>`. Paths are skill-relative (evergreen), never `specs/` paths.

### Checker (`polish_readiness_check.py`) — the deterministic bite
A small stdlib checker mirroring the `perf_evidence_check.py` / `proof_check.py` convention (arg parser, optional `--json`, exit 0/1/2). It grades a **filled report's polish-readiness row** against a **re-run scan**, never the blank subsection.

Algorithm:
1. **Run the unfinished-marker scan.** Given `--scan <path>` (file or directory), walk the surface and count word-boundary matches of `\b(TODO|FIXME|XXX|HACK|WIP)\b`, recording locations. This is the authoritative, deterministic scan — it does not trust a self-reported count. When no `--scan` path is given, the scan is treated as **not run**.
2. **Find the polish-readiness row + verdict.** Locate the polish-readiness row/verdict in the passed report; extract the verdict token, stripping backticks/whitespace; lowercase it.
3. **Classify and gate:**
   - Verdict missing, or token not in `{ready, blocked, not-assessed}` → FAIL (`polish readiness row missing or verdict not in {ready, blocked, not-assessed}`).
   - `ready` **and** `markerCount > 0` (scan ran) → FAIL (`ready claimed with N unfinished markers present`). This is the load-bearing bite.
   - `ready` and scan not run → FAIL (`ready claimed without a scan`) — a `ready` verdict must be backed by a clean scan, not narration.
   - `blocked` → pass (a blocked surface is honest; the row should name markers or a blocker, advisory).
   - `not-assessed` → pass (honest un-assessment allowed).
   - `ready` and clean scan → pass (the deterministic floor is met; taste stays advisory).
4. **Exit contract:** `0` row present + verdict allowed + consistent with the scan; `1` missing/invalid verdict or `ready` contradicted by the scan; `2` usage error / unreadable file / surface path missing when required. `--json` emits the structured result (verdict, markerCount, markerLocations, reason), mirroring `proof_check.py`.

### Enforcement honesty (hybrid, stated in both artifacts)
- **Code-enforced (deterministic):** the unfinished-marker scan result, the presence of a polish-readiness row with an allowed verdict, and the rule that `ready` cannot stand while markers remain or without a scan. Re-runnable, same answer every run.
- **Advisory (judgment):** whether a clean-scan `ready` surface is actually polished — design-system alignment, perceived quality, state craft, and flow shape need rendered and human review. The checker asserts none of this; the subsection says so in plain words (echoing §7 and impeccable `polish.md`).

### Additive / no-regression contract
- The reference edit only inserts a new subsection; no existing line is deleted or reworded; §§1-7 numbers and prose are untouched.
- The checker is a NEW file in the existing `design-audit/scripts/` directory; nothing imports or depends on it yet, so it adds no coupling.
- The report row is defined in `critique_hardening.md` only; `audit_report_template.md` is **not** edited (out of this spec's named scope and another phase's territory).
- Reverting the feature is: undo the inserted subsection + delete `polish_readiness_check.py`. Nothing else to unwind.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Express the requirement (reference subsection)
- [x] Read the live `critique_hardening.md` §6 Polish Checks to confirm the exact end-of-section anchor ("Polish As Trust") the subsection sits beneath and the §7 boundary it precedes — confirmed: "Polish As Trust" at line 101, §7 at line 124
- [x] Insert the `### Polish Readiness` subsection — verdict vocabulary (ready/blocked/not-assessed), the report-row shape, the unfinished-marker scan, and the verdict-mapping rule — preserving every existing section and its prose verbatim — subsection inserted at line 107; §§1-7 byte-preserved
- [x] Bind the subsection to the existing model by referencing §6 Polish Checks and §7 Evidence Limits (skill-relative paths only); state the necessary-not-sufficient boundary in plain words — subsection references §6/§7 and states the floor-not-proof boundary

### Phase 2: Make it bite (checker)
- [x] Create `design-audit/scripts/polish_readiness_check.py` (stdlib only) with a `main()` arg parser, a positional report path, a `--scan <surface>` option, and an optional `--json`, mirroring `perf_evidence_check.py` / `proof_check.py` — created; `py_compile` OK
- [x] Implement the unfinished-marker scan over `--scan` (file or dir walk; `\b(TODO|FIXME|XXX|HACK|WIP)\b`; count + locations; skip nothing silently) — `_scan_surface` walks file or dir, counts `MARKER_PATTERN`, records locations
- [x] Implement the verdict parse + gate: allowed-token check; `ready` + markers → fail; `ready` + no scan → fail; `blocked`/`not-assessed` → pass; wire the exit 0/1/2 contract, a human summary, and the `--json` payload — `check()` + `main()` implement all branches and the exit contract

### Phase 3: Verification
- [x] Clean surface + `ready` verdict → exit 0 — confirmed
- [x] Tamper test: introduce a `TODO` marker into the scanned surface, keep the `ready` verdict → exit 1 naming `ready claimed with N unfinished markers present`; restore the surface — confirmed, gate bites
- [x] `blocked` with markers present → exit 0; `not-assessed` with no `--scan` → exit 0; missing row / invalid verdict token → exit 1 — confirmed: 0 / 0 / 1
- [x] Consistency: the subsection's verdict vocabulary equals the spec's three tokens, the scan equals the spec's static `TODO`/`FIXME` scan, and the row feeds the verdict; evergreen + scope-lock audits pass (no IDs/paths; only the reference edit + the new checker in the change set) — all consistent; both audits clean

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Acceptance (pass) | Clean surface, `ready` verdict | `polish_readiness_check.py --scan <clean> report.md` exits 0 |
| Acceptance (fail) | `TODO` introduced into surface, `ready` retained | exits 1, names `ready claimed with N unfinished markers present` |
| Blocked path | Markers present, verdict `blocked` | exits 0 (honest blocked allowed) |
| Not-assessed path | No `--scan` surface, verdict `not-assessed` | exits 0 (honest un-assessment allowed) |
| Ready-without-scan guard | `ready` verdict, no `--scan` | exits 1 (`ready claimed without a scan`) |
| Missing/invalid verdict | No row, or verdict token outside the three | exits 1 (`polish readiness row missing or verdict not in {ready, blocked, not-assessed}`) |
| Usage / robustness | Unreadable report, missing surface path when required, ragged row | exits 2 deterministically, no false pass |
| Additive lint | Reference diff | only the new subsection added; no existing prose changed |
| Evergreen lint | Subsection + checker | grep finds no `specs/` paths and no packet/phase IDs |
| Scope audit | Working tree | only `critique_hardening.md` edited + `polish_readiness_check.py` added |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `design-audit/references/critique_hardening.md` §6 Polish Checks / §7 Evidence Limits | Internal | Green | No anchor for the subsection or the necessary-not-sufficient boundary |
| `design-audit/references/audit_contract.md` §5 Report Order (verdict feeds the report) | Internal | Green | Report-row placement loses its surrounding contract |
| `design-audit/scripts/perf_evidence_check.py` (sibling stdlib checker shape) | Internal | Green | Checker would diverge from the established pattern |
| `shared/scripts/proof_check.py` (stdlib checker convention, exit 0/1/2, `--json`) | Internal | Green | Checker would diverge from the canonical convention |
| Python 3 stdlib (`re`, `os`/`pathlib`, `json`) | External | Green | No deterministic gate possible |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the checker mis-fails an honest report, or the subsection contradicts §6/§7 or the verdict feeds nothing in the report.
- **Procedure**: remove the inserted `### Polish Readiness` subsection (restoring `critique_hardening.md` byte-for-byte) and delete `polish_readiness_check.py`. Both changes are additive and referenced by nothing else, so removal restores the prior state exactly. No data or migration to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Reference subsection) ─┐
                                ├──> Phase 3 (Verify)
Phase 2 (Checker) ──────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Reference subsection | None | Verify (the checker grades the row + verdict the subsection defines) |
| Checker | None (can be drafted in parallel against the planned vocabulary + row shape) | Verify |
| Verify | Reference subsection, Checker | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Reference subsection (vocabulary + row + scan + rule, preserve prose) | Low | 30-45 minutes |
| Checker (`polish_readiness_check.py` scan + parse + gate) | Medium | 1-1.5 hours |
| Verification (pass/fail/blocked/not-assessed/ready-without-scan/invalid + audits) | Low | 45 minutes |
| **Total** | | **~2.25-3 hours** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm the change set is exactly one edited reference + one new checker — `critique_hardening.md` edited + `polish_readiness_check.py` added
- [x] Confirm no existing audit doc, reference, asset, or script other than `critique_hardening.md` is in the diff (in particular, `audit_report_template.md` untouched) — confirmed; `audit_report_template.md` / `perf_evidence_check.py` / `audit_contract.md` untouched
- [x] Confirm the reference diff inserts a subsection and deletes/rewords no existing prose — pure insertion; §§1-7 byte-preserved, 0 removed

### Rollback Procedure
1. Revert the `### Polish Readiness` insertion in `critique_hardening.md`
2. Delete `design-audit/scripts/polish_readiness_check.py`
3. Confirm no other audit file references the subsection or the checker (grep)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Subsection revert + file deletion only

<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Polish Readiness subsection (additive) + polish_readiness_check.py deterministic gate (ready cannot stand with markers) + honest hybrid enforcement boundary
-->
