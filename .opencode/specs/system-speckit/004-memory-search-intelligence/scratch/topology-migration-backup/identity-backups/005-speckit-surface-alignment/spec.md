---
title: "Feature Specification: SpecKit Surface Alignment Remediation"
description: "Phase-parent packet for the 028 surface-alignment audit, Fable review narrowing, audit remediation phases, inert-novelty detector, and recorded-failure closure."
trigger_phrases:
  - "speckit surface alignment"
  - "surface-alignment audit"
  - "Fable review synthesis"
  - "code graph doc audit"
  - "stress and skillmd audit"
  - "recorded failure closure"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/005-speckit-surface-alignment"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Remediate surface-alignment documentation metadata"
    next_safe_action: "Run strict validation for the phase parent"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/004-memory-search-intelligence/005-speckit-surface-alignment/spec.md"
      - ".opencode/specs/system-speckit/004-memory-search-intelligence/changelog/changelog-028-root.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "speckit-surface-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# 005 — SpecKit Surface Alignment (Remediation)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

## METADATA

- **Status:** Planned
- **Level:** Phase Parent
- **Parent:** `004-memory-search-intelligence`
- **Source of record:** `../research/research.md` (20-iteration deep-research audit) + `../research/fable-5-review-synthesis.md` (adversarial review; the errata of record for the three trimmed overstatements)

---

## 1. PURPOSE

Remediate the documentation-vs-implementation drift the surface-alignment audit surfaced across the system-speckit skill ecosystem. The audit's verdict: the code and runtime are largely current with recent specs, but the **documentation surfaces** (feature catalogs, manual-testing playbooks, READMEs, benchmark indexes) and the **validation tooling meant to catch that drift** trail behind. This packet turns the ~18 distinct, citation-verified misalignments plus the coverage gaps and process fixes into shippable phase children.

The edits themselves land across `sk-doc`, `system-spec-kit`, `system-code-graph`, `deep-loop-runtime`, and `.opencode/commands/**` — the spec-folder home sits under 028 because that is where the audit was run and where the findings are anchored, not because the scope is limited to memory-search.

---

## 2. SCOPE

**In scope:** the confirmed misalignments (stale flag/catalog/index docs, a doc-vs-code flag-name contradiction, stale code comments, template/label-taxonomy drift), the class-fix that stops the drift regrowing (a feature-catalog validation gate), two coverage-gap audits (code-graph docs, stress-tests + SKILL.md), and two process fixes (the inert `newInfoRatio` scoring bug; the "detector fired, nobody acted" closure loop).

**Out of scope:** the three synthesis overstatements the review trimmed — they are *not* propagated into any phase (the phase-027 envelope-fidelity "drift" was a documented rename; "pattern E" is scoped to a YAML-asset gap, not a code bug; the expired governance evidence is re-recorded, not re-litigated). See the review doc §3.

---

## PHASE DOCUMENTATION MAP

Executor tags: **FAST** = GPT-5.5-fast `--variant high` mechanical edit (exact old→new strings + self-verify grep supplied); **CAREFUL** = GPT-5.5-fast `--variant xhigh` (or Claude) with a RED/GREEN test gate; **AUDIT** = Claude-led deep-review (cited report, not a mechanical fix — a fast executor would reproduce the audit's own sampling blind spot); **DECISION** = design call recorded before any edit.

| Phase | Slug | Scope | Executor | Level | Status |
|-------|------|-------|----------|-------|--------|
| 001 | `feature-catalog-validation-gate` | Keystone. `validate_document.py` feature-catalog doc-type + validation-table taxonomy check (placeholders, allowed `Type`, path resolution). Lands report-mode. | CAREFUL | 2 | Planned |
| 002 | `false-now-doc-corrections` | Retention `_V1`→unsuffixed + living-doc sweep; Track-C supersession pointer; soft-delete-tombstone contradiction; stale `search-results.ts` comment. Excludes the phase-027 summary. | FAST | 2 | Planned |
| 003 | `index-freshness-sweep` | Benchmarks README rows (2 to 8, MPS-HOLD first); playbook root index counts + high-water; MODULE_MAP category count + duplicate `14--` prefix; schema catalog archived-rebuild row + retitle. | FAST | 2 | Planned |
| 004 | `flag-table-single-source` | Demote the feature-flag catalog table to an ENV_REFERENCE pointer (kills the drift class); re-run + re-record governance scenario 063. | FAST | 2 | Planned |
| 005 | `template-and-label-contract` | Scaffolder section-name drift; relabel a static-contract fixture; fix catalog rows typing manual-scenario files as "Automated test". | FAST | 1 | Planned |
| 006 | `deep-loop-yaml-contract` | Startup `context_loading` error/timeout branch in research/review/council YAMLs; `delta_pattern` naming vs runner output. | CAREFUL | 2 | Planned |
| 007 | `coverage-gap-authoring` | Author the missing under-surfacing/display-floor manual scenario; author the rescue-authority (`SPECKIT_RETRIEVAL_RESCUE_MODE`) catalog entry. | FAST/CAREFUL | 2 | Planned |
| 008 | `validation-gate-enforce-flip` | Flip 001's gate report→enforce once the tree is clean. | CAREFUL | 1 | Planned |
| 009 | `skill-docs-sanitizer-boundary` | Decide sanitize-at-write vs document-the-boundary; implement + test if sanitizing. | DECISION→CAREFUL | 2 | Planned |
| 010 | `reconcile-routing-decision` | `memory_embedding_reconcile` exposure in `/memory:manage` + `/doctor` (doctor read-only by design). | DECISION | 1 | Planned |
| 011 | `code-graph-doc-audit` | Coverage gap. Scoped review of system-code-graph doc suite vs 028 code-graph work. | AUDIT | 2 | Planned |
| 012 | `stress-and-skillmd-audit` | Coverage gap. Stress-test lane, system-spec-kit SKILL.md, changelog. | AUDIT | 2 | Planned |
| 013 | `deep-research-loop-instrumentation` | Fix the inert `newInfoRatio` (emitted 1.0 × 20 despite verbatim repeats); repair `[INFERENCE]` vs executed-evidence label semantics. | CAREFUL | 2 | Planned |
| 014 | `recorded-failure-closure` | "Detector fired, nobody acted" class: fix the exemplar (iteration-cap contradiction) + a closure route (constitutional rule + unactioned-recorded-failure surfacer). | DECISION→CAREFUL | 2 | Planned |
| 015 | `manual-test-verification-and-fixes` | run refined-feature manual scenarios + fix surfaced defects (gold-battery path, bm25 scoped fill-limit regression) | AUDIT | 2 | Complete |

---

## 4. SEQUENCING

- `001` (report-mode gate) precedes `007` (authored docs must pass it) and `008` (enforce flip).
- `002` precedes `004` (confirm ENV_REFERENCE canonical before demoting the catalog table).
- `002` ∥ `003` ∥ `005` touch disjoint file clusters → dispatched concurrently.
- `008` is the join gate: flip to enforce only after `002`–`006` leave the tree clean.
- `006`, `009`–`014` are independent; audits `011`/`012` may run early and spawn cheap fix children that slot before `008`.

---

## 5. SUCCESS CRITERIA

- Every phase child ships with evidence and passes `validate.sh --strict`.
- The validation gate (`001`→`008`) is enforcing: a reintroduced placeholder/label-drift row is rejected.
- `rg 'SPECKIT_\w+_V1'` in living docs resolves only to the ENV_REFERENCE alias table and phase-history folders.
- `newInfoRatio` responds to duplicate findings (RED/GREEN), and a recorded detector failure has a documented follow-up route.
