# Iteration 4: D4 Maintainability + playbook_capability Overlay

## Focus

- **Dimension:** maintainability (D4)
- **Scope:** duplicated helpers across the 7 Python gate scripts, section-comment drift in `design-md-generator/backend/scripts/{extract,crawl}.ts`, and the deferred `playbook_capability` overlay for the `audit` mode.
- **Goal:** complete dimension coverage (4/4) and close the last required traceability overlay.

## Scorecard

- Dimensions covered: maintainability (deep pass 1) — **completes D1+D2+D3+D4 coverage**
- Files reviewed: 9
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.07

## playbook_capability Overlay (audit mode)

All 11 `AUDIT-*` scenarios in `design-audit/manual_testing_playbook/manual_testing_playbook.md` reference playbook files that exist on disk and name a capability backed by `design-audit/references/` or `design-audit/scripts/`:

| Scenario | Backing file | Status |
|---|---|---|
| AUDIT-SCORE-001 | `01--score/findings-first-score.md` | executable (refs `audit_contract.md`) |
| AUDIT-SCORE-002 | `01--score/transform-remediation-routing.md` | executable (refs `transform_remediation.md`) |
| AUDIT-SCORE-003 | `01--score/evidence-capture.md` | executable (refs `evidence_capture.md`) |
| AUDIT-SCORE-004 | `01--score/audit-report-template.md` | executable (refs `audit_report_template.md`) |
| AUDIT-A11Y-001 | `02--a11y-performance/accessibility-performance-gate.md` | executable (refs `accessibility_performance.md`) |
| AUDIT-A11Y-002 | `02--a11y-performance/a11y-quick-fixes.md` | executable (refs `a11y_quick_fixes.md`) |
| AUDIT-SLOP-001 | `03--slop-hardening/anti-slop-production-hardening.md` | executable (refs `anti_patterns_production.md`) |
| AUDIT-SLOP-002 | `03--slop-hardening/ai-fingerprint-tells.md` | executable (refs `ai_fingerprint_tells.md` + `ai_fingerprint_registry.json` + `ai-fingerprint-registry-check.mjs`) |
| AUDIT-SLOP-003 | `03--slop-hardening/hardening-edge-cases.md` | executable (refs `hardening_edge_cases.md` + `critique_hardening.md`) |
| AUDIT-EVIDENCE-010 | `04--evidence-worksheet/evidence-worksheet-labels.md` | executable (refs `audit_evidence_worksheet.md`) |
| AUDIT-EVIDENCE-011 | `04--evidence-worksheet/evidence-backed-release-readiness.md` | executable (refs `audit_evidence_worksheet.md`) |

Verdict: 11/11 executable. **Overlay PASS**.

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion

- **F009** — Markdown-cell helper code duplicated across 7 Python gate scripts. `.opencode/skills/sk-design/shared/scripts/{proof_check,numeric_law_check,variant_parameter_check}.py`, `.opencode/skills/sk-design/design-foundations/scripts/{naming_doc_check,baseline_rhythm_check}.py`, `.opencode/skills/sk-design/design-audit/scripts/{perf_evidence_check,polish_readiness_check}.py`. Each script independently defines `_clean_cell`, `_split_table_row`, and `_is_separator_row` with identical semantics. When the markdown-table parsing logic needs to evolve (e.g., handle GFM-style escaped pipes `\|`, or multi-line cells), all 7 scripts must be patched in lockstep. No shared `markdown_table_utils.py` exists. Risk: drift across gates causes one script to accept a row shape another rejects.
  - **Category:** maintainability
  - **Dimension:** maintainability
  - **ScopeProof:** all 7 scripts are the deterministic gate code named in the orchestrator reviewScopeNote.
  - **Recommendation:** extract the 3 helpers into `shared/scripts/_md_table_utils.py` (or a `shared/scripts/md_table_utils.py`) and import from each gate. Single-source the parsing contract.

- **F010** — `extract.ts` has duplicated section-header comments from copy-paste. `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:40,234` declares `// 2. TYPE DEFINITIONS` twice; `:58,246,663` declares `// 5. CORE LOGIC` three times; `:197,651` declares `// 4. HELPERS` twice. `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:94,867` declares `// 4. HELPERS` twice. The numbered-section convention implies a single linear flow (1→2→3→4→5→6), so the duplicates signal that the file grew by copy-pasting module scaffolding without renumbering. Readers navigating by section number get lost; IDE outline views show duplicate entries.
  - **Category:** maintainability
  - **Dimension:** maintainability
  - **ScopeProof:** `extract.ts` and `crawl.ts` are the orchestration entry points of the md-generator Playwright backend named in the orchestrator reviewScopeNote.
  - **Recommendation:** renumber the section-header comments to a single linear sequence, or drop the numbered scheme and use plain `// HELPERS` / `// CORE LOGIC` markers per logical block.

### Claim-Adjudication Packets
(none — no new P0/P1)

## Cross-Reference Results

| Protocol | Level | Status | Gate | Evidence | Notes |
|----------|-------|--------|------|----------|-------|
| playbook_capability | overlay | pass | advisory | 11/11 audit-mode scenarios backed by real references/scripts | closes the deferred overlay from iter 3 |

## Assessment

- New findings ratio: 0.07
- Dimensions addressed: maintainability — **completes 4/4 dimension coverage**
- Novelty justification: F009 captures real lockstep-drift risk across 7 gates; F010 captures navigable-file ergonomics drift in the two largest backend scripts.

## Ruled Out

- "Playbook scenarios may reference non-existent files" — checked all 11 AUDIT-* scenarios; every referenced file exists.

## Dead Ends

- Checked whether the duplicated `_clean_cell` semantics actually diverge across scripts — they don't (yet). The drift risk is structural, not active.

## Recommended Next Focus

Convergence evaluation. With all 4 dimensions covered, all required core + applicable overlay protocols executed, and 0 P0/P1 findings, the legal-stop decision tree should now permit STOP. Proceed to phase_synthesis.

Review verdict: PASS
