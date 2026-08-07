# Review Report — 007-output-surface-parity (lineage p017c007-opus)

## 1. Executive Summary

**Verdict: PASS** (hasAdvisories: true)

- Active findings: **P0=0, P1=0, P2=2**
- Scope: spec folder `007-output-surface-parity` — a Level 1, contract-only (markdown) phase whose shipped deliverable is edits to `.opencode/commands/memory/search.md` and `.opencode/commands/memory/assets/search_presentation.txt`, committed at `254289251a`.
- Convergence reason: maxIterations (1) reached; all 4 review dimensions covered in a single comprehensive pass; no P0/P1 after re-reading cited evidence; evidence, scope, and coverage gates pass.
- Release readiness: converged.

The shipped contract is correct and internally consistent. Every claim in `implementation-summary.md` was re-read at its cited source and **confirmed**: the one-score/one-scale/one-name mandate, the five mandatory core slots, the surface-parity clause, the named optional trailing fields, the COSTAR register note, and the "O1 structural layer untouched" claim all hold across both files. The two findings are documentation/metadata hygiene gaps on the spec-folder control files, not defects in the deliverable.

## 2. Planning Trigger

PASS routes to `/create:changelog` follow-up, not remediation planning. The two P2 advisories do not require a remediation packet; they are optional cleanups recorded under Deferred Items. If a maintainer chooses to act, they fold into a lightweight metadata/doc-backfill change, not a new feature spec.

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last | Status |
|----|-----|-----|-------|----------|------------|--------|
| F001 | P2 | traceability | spec/plan/tasks remain unfilled template scaffolds while the phase is shipped; impl-summary is the only real doc, so contract mandates have no spec.md REQ/SC to anchor to | `spec.md:84-157`, `plan.md:46-160`, `tasks.md:53-77` | 1/1 | active |
| F002 | P2 | maintainability | completion-metadata mismatch: `graph-metadata.json` Status=planned (and omits changed files) while `impl-summary` continuity = 100% and work is committed; `spec.md:51` Status still placeholder; `description.json` memorySequence=0 | `graph-metadata.json:1`, `description.json`, `spec.md:51`, `implementation-summary.md:26` | 1/1 | active |

No active P0 or P1 findings.

## 4. Remediation Workstreams

**Lane A — Spec-folder doc/metadata backfill (advisory, P2).** Single low-risk lane covering both findings, since both stem from the spec/plan/tasks scaffold and control files never being refreshed after the contract work landed.
- Constituent findings: F001, F002
- Execution order: (1) backfill `spec.md` REQ/SC + `plan.md` + `tasks.md` from `implementation-summary.md`; (2) run `generate-context.js` to reconcile `graph-metadata.json` Status and refresh `description.json`.
- Blocking: none. Deferable without risk to the shipped contract.

## 5. Spec Seed

Minimal spec delta if Lane A is taken (target: `007-output-surface-parity/spec.md`):
- REQ-001 (P0): `/memory:search` retrieval output MUST render `similarity` (0–1, two decimals) as the sole per-row ranking metric; `confidence` and percentage scores are banned in rendered output. AC: `search.md:70`, `search_presentation.txt:93-96`.
- REQ-002 (P0): every non-empty retrieval response MUST render the five core slots (query echo, similarity, `#id`, title, STATUS w/ RESULTS+INTENT); only the empty-result fallback may omit. AC: `search.md:68`, `search_presentation.txt:84-91`.
- REQ-003 (P1): core slots + 0–1/two-decimal scale MUST hold on every surface (`--command`, direct prompt, conversation). AC: `search.md:74`, `search_presentation.txt:98-100`.
- REQ-004 (P2): `requestQuality`/`citationPolicy` are the only sanctioned trailing extras, rendered named between the scored block and the terminal STATUS footer. AC: `search.md:76`, `search_presentation.txt:102-116`.
- SC-001: any two surfaces return diffable, comparable rows for the same result.

## 6. Plan Seed

1. Backfill `spec.md` §3–§5 (scope, REQ table, success criteria) from `implementation-summary.md` "What Was Built" + "Verification" — references F001.
2. Replace `plan.md` and `tasks.md` template defaults with the actual contract-edit approach and the done tasks — references F001.
3. Run `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` for this spec folder to reconcile `graph-metadata.json` Status (`planned` → complete) and `description.json` — references F002.
4. Re-run `validate.sh <spec-folder> --strict` to confirm 0/0.

## 7. Traceability Status

| Protocol | Level | Status | Gate | Notes |
|----------|-------|--------|------|-------|
| spec_code | core | partial | hard | Shipped contract mandates are real, internally consistent, and match impl-summary's cited line evidence; partial only because `spec.md` carries no normative REQ/SC to anchor them (F001). The hard gate is satisfied at the behavioral level — claims resolve to shipped behavior — and the gap is documentation traceability, not a contradiction. |
| checklist_evidence | core | n/a | hard | Level 1 packet; no `checklist.md` required or present. |
| feature_catalog_code | overlay | n/a | advisory | No catalog claim in scope. |
| playbook_capability | overlay | n/a | advisory | No playbook scenario in scope. |

No spec-vs-code **contradiction** was found; the contract behavior the docs describe is exactly what the two files implement.

## 8. Deferred Items

- **F001 (P2)**: refill spec/plan/tasks from impl-summary (traceability backfill). Deferred — non-blocking; Level 1 tolerates thin docs and validate.sh --strict passed.
- **F002 (P2)**: reconcile graph-metadata Status and description.json (completion-metadata hygiene). Deferred — non-blocking for the deliverable; affects graph traversal/resume accuracy only.
- **Known Limitations carried from impl-summary (not new findings)**: (a) live cross-model A/B render-consistency probe against DeepSeek/Kimi/MiMo via `--command` is the documented follow-up; (b) enforcement is contract-level, not mechanical — no code rejects a `confidence`/percentage render. Both are already recorded in `implementation-summary.md` §Known Limitations.

## 9. Audit Appendix

### Iteration coverage
| Iter | Dimensions | Files | P0/P1/P2 | newFindingsRatio | Status |
|------|-----------|-------|----------|------------------|--------|
| 1 | correctness, security, traceability, maintainability | 6 | 0/0/2 | 1.00 | complete |

### Convergence replay
- Recomputed from JSONL: 1 iteration record, findingsSummary P0=0/P1=0/P2=2, dimensionCoverage=4/4, newFindingsRatio=1.00. No P0 override triggered (no P0). Coverage gate green (all 4 dimensions + required core protocol covered/justified). Evidence gate green (every active finding carries file:line). Scope gate green (conclusions stay within the spec folder + its two shipped files). Stop reason matches recorded `synthesis_complete` event. Replay **agrees** with persisted result.
- Adversarial replay: no P0 to replay. Both P2 findings re-checked at source — F001 (scaffold placeholders) and F002 (`graph-metadata` Status=planned vs committed/100%) are directly observable, not inferred.

### Security note
Markdown contract; no new executable surface introduced this phase. The §0 `bash -c` argument-join in `search.md:17` is prior O1 work (commit `eac1eb5ef8`), unchanged here, and out of this phase's deliverable scope. No injectable/untrusted-input path added by O2.

### File coverage matrix
| File | Dimension(s) | Result |
|------|--------------|--------|
| `.opencode/commands/memory/search.md` | correctness, traceability, security | PASS — mandates present, citations accurate |
| `.opencode/commands/memory/assets/search_presentation.txt` | correctness, traceability | PASS — render example + placement consistent |
| `spec.md` / `plan.md` / `tasks.md` | traceability | F001 (P2) — unfilled scaffolds |
| `graph-metadata.json` / `description.json` | maintainability | F002 (P2) — completion-metadata mismatch |

---

**Lineage:** p017c007-opus | session `fanout-p017c007-opus-1781724827687-uybw8w` | executor cli-claude-code model=claude-opus-4-8 | maxIterations=1
**Verdict: PASS (hasAdvisories: true) — release-readiness: converged**
