# Deep Research: What's planned in `028-peck-teachings-adoption`

> Canonical synthesis of a 5-iteration deep-research loop (executor: `cli-opencode openai/gpt-5.5 --variant xhigh`, isolated worktree). Evaluates feasibility, risks, prior art, and refinements for the planned phases: T3 (self-check template blocks), T4 (advisory current-state content rule), T2 (constitutional-rule review surface), and deferred T1 (AC-coverage completion gate).

| Field | Value |
|-------|-------|
| Session | `dr-peck-028-001` |
| Iterations | 5 of 5 (stop reason: maxIterationsReached) |
| newInfoRatio trace | 0.86 → 0.78 → 0.69 → 0.74 → 0.68 |
| Executor | cli-opencode `openai/gpt-5.5` `--variant xhigh` (worktree-isolated) |
| Date | 2026-06-02 |
| Source analysis | `../peck-teachings-analysis.md` (packet 028 phase 001) |

---

## 1. Executive summary

The planned phases are sound and the proposed sequencing (T3 → T4 → T2, T1 deferred) is correct. Research sharpened each phase with concrete, evidence-backed refinements and surfaced one new hard constraint:

- **T3 (templates):** Ship as concise **HTML-comment guidance**, not tracked `##` sections. **New constraint:** the header extractor strips fenced code but **NOT** HTML comments, so a comment block must not contain any line starting with `## ` or it will trip `TEMPLATE_HEADERS`. Use plain labels (`SELF-CHECK:`, `FAILURE MODES:`) inside the comment.
- **T4 (current-state rule):** Ship as **`INFO`, not `WARNING`** — strict mode escalates `WARNING` to a blocking error. Scope the first wave to **`implementation-summary.md` only** (not all non-parent `spec.md`). Reuse the existing fence/comment-aware scanner; review the broad `consolidat[a-z]*` token for false positives.
- **T2 (constitutional review):** Build a **standalone read-only diagnostic** first (not `/memory:manage` or `/doctor memory`, which mutate; `/memory:learn` is the better future wrapper). Store **`last_confirmed` + provenance** (`last_confirmed_source: git-last-commit`); compute `review_by` at report time. **Enumerate `constitutional/*.md` dynamically** — there is a count-drift bug between docs (README says 2, phase spec says 14).
- **T1 (deferred):** Confirmed feasible but correctly deferred. Needs **explicit AC IDs + a per-AC traceability table**; existing `CHK-020`/`EVIDENCE_CITED`/`SECTION_COUNTS` signals are too generic/brittle to reuse as a blocking gate. Split into a mechanical table check + a fresh-context reviewer verdict for assertion strength. Per-level opt-in is mandatory (L1 has no checklist/tests).

**Cross-cutting:** spec-kit already has a warn-only rollout precedent (`SPECKIT_SAVE_QUALITY_GATE`, 14-day window) — reuse it for T4/T1. The phase order is risk-based, not a technical dependency.

---

## 2. Convergence report

Stopped at the 5-iteration cap, not by numeric convergence: `newInfoRatio` stayed 0.68–0.86 because each iteration deliberately targeted a different key question (breadth, not redundancy), keeping new-info high by design. **All five key questions were substantively answered**, so the loop reached practical saturation on the planned scope. A longer run would deepen T1/T2 design detail rather than overturn any finding. Quality guard: every iteration emitted `status:"evidence"` with cited repo/web sources.

---

## 3. T3 — Self-check + failure-mode blocks in templates

**Verdict: feasible, lowest risk. Ship as comment guidance.**

- **Mechanism:** Add a compact `<!-- SELF-CHECK: … / FAILURE MODES: … -->` block to `spec.md.tmpl`, `plan.md.tmpl`, `checklist.md.tmpl`. The manifest templates already use HTML comments for voice guides, anchors, and metadata, so this matches the existing pattern.
- **Hard constraint (new):** `template-structure.js` extracts H2s via `^##\s+(.+)$` and strips **fenced code only — not HTML comments**. A comment containing a line-start `## Self Check` would still be seen by `TEMPLATE_HEADERS`. Use plain labels, never markdown headings, inside the comment. *(iteration-001 Finding 1, Ruled-Out)*
- **No registry change:** required headers are derived from the rendered template via `loadTemplateContract()`, not from a static list in `validator-registry.json`. For comment guidance, no rule/registry/header-contract edit is needed. The phase spec's "TEMPLATE_HEADERS list" file-to-modify wording should be corrected. *(iteration-001 Finding 3)*
- **Prior art:** markdownlint treats HTML comments as non-rendered and uses them for inline config; Vale exposes comment scopes — mature doc linters treat comments as a distinct guidance surface.
- **Failure mode:** adding tracked/hidden `##` headers regresses `TEMPLATE_HEADERS`/`SECTION_COUNTS`. **Success metric:** a freshly scaffolded folder shows guidance in all three docs AND passes `validate.sh --strict`.

---

## 4. T4 — Broadened current-state content discipline (advisory)

**Verdict: feasible; ship as INFO, narrow scope first.**

- **Severity:** Use **`INFO`**, not `WARNING`. Locally, `WARNING` = exit 0 normally but **exit 2 under `--strict`**, so a "WARNING" advisory rule silently becomes a completion blocker. `INFO` stays exit 0 in both modes. Promote to `WARNING` only after baseline cleanup or behind a rollout flag. *(iteration-002 Finding 1; iteration-005 Finding 2)*
- **Scope:** Start with **`implementation-summary.md` only**. The phase spec's proposal to also scan all non-parent `spec.md` is broader than the source analysis recommended; defer that to a second wave. *(iteration-002 Finding 2)*
- **Exemptions:** Keep `decision-record.md`, `changelog/`, and `context-index.md` exempt — they are legitimate history surfaces.
- **Detection:** Reuse the existing conservative token/regex scanner (already fence- and comment-aware). Re-examine the broad `consolidat[a-z]*` token — "consolidated findings" is valid current-state prose, not migration history. Add a documented, reasoned suppression path.
- **Prior art:** Vale `existence` check (phrase/regex + `ignorecase` + exceptions), Vale glob-scoped sections, ESLint `warn` semantics + unused-disable reporting, markdownlint front-matter/comment ignoring.

---

## 5. T2 — Constitutional-rule review surface

**Verdict: feasible; strictly read-only.**

- **Host:** Build a **standalone read-only script first**. `/memory:manage` and `/doctor memory` are mutation surfaces; `/memory:learn` already owns constitutional-rule lifecycle and is the better *future* wrapper (report mode only). Prove read-only with a before/after diff. *(iteration-003 Findings 2-3)*
- **Metadata:** Store **`last_confirmed: YYYY-MM-DD`** + **`last_confirmed_source: git-last-commit`** (honest backfill provenance), optionally `last_confirmed_by: human` only after a real review. Compute **`review_by` at report time** from a documented cadence (candidate: 180 or 365 days) — do not store a deadline that implies a human reviewed on schedule. *(iteration-003 Findings 4-5)*
- **Dynamic enumeration (new bug):** Scan `constitutional/*.md` dynamically, exclude `README.md`, require `importanceTier: constitutional`. There is a **count-drift discrepancy**: the constitutional README says 2 active rule files while the phase spec hard-codes "14". Treat missing lifecycle metadata as expected initial state, not corruption. *(iteration-003 Finding 7-8)*
- **No behavior change:** never auto-expire, auto-demote, delete, or alter decay/search boost. *(iteration-003 Finding 1)*
- **Prior art:** ESLint rule-deprecation metadata (`deprecated`, `deprecatedSince`, `availableUntil: null` = kept-but-deprecated), MADR status/date + Confirmation section. OPA metadata was inconclusive within budget.

---

## 6. T1 — AC-coverage completion gate (deferred, confirmed)

**Verdict: feasible and highest-value, but correctly deferred to its own packet.**

- **Insertion point exists:** L1/L2 specs have an Acceptance Criteria column; L3/L3+ use Given/When/Then. That supports adding stable AC IDs + a coverage table.
- **Do NOT reuse existing signals:** `SECTION_COUNTS` greps exactly `**Given**` (bolded) but templates use unbolded `Given…` — brittle. `EVIDENCE_CITED` accepts generic markers and never maps evidence to a specific AC. `CHK-020` collapses all AC verification into one self-attested box. A new `AC_COVERAGE` rule must define its own canonical AC syntax/table. *(iteration-004 Findings 2-4)*
- **Two verdicts:** a mechanical regex check of the authored AC table (validator-computable, `covered ≥ floor(0.90 × total)` candidate) **plus** a fresh-context reviewer (`deep-review`/acceptance-review) to judge weak assertions and manual exceptions — regex alone can't detect false-confidence tests. *(iteration-004 Finding 9; iteration-005 Finding 5)*
- **Main risk:** false confidence from weak/no-assertion tests (Stryker: coverage ≠ test effectiveness). Per-level opt-in is mandatory (L1 has no checklist and may legitimately have no tests).
- **Prior art:** Cucumber/Gherkin & behave (executable specs, assert-on-outcome), Cucumber reporting (evidence input, not final verdict), OpenFastTrace (requirement traceability `AC-id → evidence → ratio`), Stryker (assertion strength).

---

## 7. Cross-cutting rollout & sequencing

- **Warn-only-first precedent:** `SPECKIT_SAVE_QUALITY_GATE` is default-on, records an activation timestamp, and treats the first 14 days as warn-only (logs would-reject, returns pass). Reuse this graduated pattern for T4 and T1. T3 needs none (template text); T2 needs none (read-only). *(iteration-005 Finding 1)*
- **Order is risk-based, not dependency-based:** T3 → T4 → T2 → T1 by ascending blast radius; no phase technically blocks another. T1 stays excluded from packet 028. *(iteration-005 Finding 4)*
- **Verdict ownership scales with blast radius:** self-attestation + validation evidence is enough for T3/T4/T2; reserve a separate fresh-context reviewer for T1. *(iteration-005 Finding 5)*

---

## 8. Ruled-out directions

1. Implementing T1 inside packet 028 (excluded by scope; highest blast radius).
2. Treating `WARNING` as harmless advisory for any new default-on rule (strict mode promotes it to failure).
3. First-wave T4 scanning across all non-parent `spec.md` (start with `implementation-summary.md`).
4. Auto-expiring/demoting/deleting constitutional rules in T2 (read-only, human-in-the-loop).
5. Comment blocks containing markdown `## ` headers for T3 (the extractor still sees them).
6. Reusing `CHK-020`/`EVIDENCE_CITED`/`SECTION_COUNTS` as a T1 blocking gate (too generic/brittle).

---

## 9. Residual risks / open questions (for implementation packets)

- **T4:** exact doc scope beyond `implementation-summary.md`, and whether the rule is `INFO`, opt-in `WARNING`, or `WARNING` behind a strict-mode escape hatch.
- **T2:** final diagnostic host (standalone script vs `/memory:learn report` vs new read-only `/doctor` route) and cadence threshold (180 vs 365 days). Fix the 2-vs-14 rule-count drift.
- **T1:** its own packet — AC ID syntax, manual/partial scoring, floor default, reviewer-verdict storage, per-level applicability (likely L2+ default, L1 opt-in).
- **Process:** resource-map coverage gate was unavailable this session (no `resource-map.md`); not evidence against findings.

---

## 10. Recommended next steps

1. Implement **T3** as comment guidance (apply the no-`## `-in-comments constraint); verify via scaffold + `validate.sh --strict`.
2. Implement **T4** as an `INFO` rule scoped to `implementation-summary.md`, reusing the existing scanner; re-scope the `consolidat*` token.
3. Implement **T2** as a standalone read-only diagnostic with `last_confirmed` + provenance and dynamic rule enumeration; fix the rule-count drift.
4. Open a **separate T1 packet** using the two-verdict design (mechanical table + fresh-context reviewer), warn-only rollout, per-level opt-in.

Each remains its own spec folder with scope lock and verification. → `/speckit:plan` per phase.

---

## 11. Source map

**Repo (worktree HEAD) evidence:**
- `templates/manifest/{spec,plan,checklist}.md.tmpl`; `scripts/utils/template-structure.js`; `scripts/rules/check-template-headers.sh`; `references/validation/template_compliance_contract.md`
- `scripts/rules/check-phase-parent-content.sh`; `scripts/lib/validator-registry.json`; `references/validation/validation_rules.md`
- `constitutional/README.md`; `references/memory/memory_system.md`; `mcp_server/lib/cognitive/fsrs-scheduler.ts`; `commands/memory/{manage,learn}.md`; `commands/doctor/{_routes.yaml,speckit.md}`
- `scripts/rules/{check-section-counts,check-evidence}.sh`; `scripts/spec/validate.sh`
- `mcp_server/lib/validation/save-quality-gate.ts` + tests; `mcp_server/handlers/memory-save.ts`; `references/config/environment_variables.md`
- Packet docs: `028-…/spec.md`, `002/003/004-*/spec.md`, `001-…/peck-teachings-analysis.md`

<!-- ANCHOR:sources -->
**External prior art (sources):** markdownlint (https://github.com/DavidAnson/markdownlint), Vale (https://vale.sh/docs/topics/scoping/), ESLint rules + rule-deprecation (https://eslint.org/docs/latest/use/configure/rules ; https://eslint.org/docs/latest/extend/rule-deprecation), MADR (https://adr.github.io/madr/), Cucumber/Gherkin (https://cucumber.io/docs/gherkin/reference/), behave (https://behave.readthedocs.io/en/latest/tutorial/), OpenFastTrace (https://github.com/itsallcode/openfasttrace), Stryker (https://stryker-mutator.io/docs/), OPA (https://www.openpolicyagent.org/docs/policy-language/ — inconclusive).

**Iteration index (citations):** `iterations/iteration-001.md` (T3) · `iteration-002.md` (T4) · `iteration-003.md` (T2) · `iteration-004.md` (T1) · `iteration-005.md` (cross-cutting). Per-iteration deltas in `deltas/iter-00N.jsonl`; state log `deep-research-state.jsonl`. Each iteration narrative carries per-finding `[SOURCE: …]` citations.
<!-- /ANCHOR:sources -->
