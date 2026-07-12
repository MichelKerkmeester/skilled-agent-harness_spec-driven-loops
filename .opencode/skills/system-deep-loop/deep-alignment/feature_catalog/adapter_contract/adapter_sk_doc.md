---
title: "sk-doc adapter"
description: "The reference authority adapter: wraps validate_document.py and extract_structure.py to check the docs artifact-class against sk-doc's own creation standards."
trigger_phrases:
  - "sk-doc adapter"
  - "reference adapter"
  - "validate_document.py extract_structure.py"
  - "docs conformance"
  - "template conformance DQI floor"
version: 1.0.0.0
---

# sk-doc adapter

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The reference authority adapter: wraps `validate_document.py` and `extract_structure.py` to check the `docs` artifact-class against sk-doc's own creation standards.

`sk-doc.cjs` is the phase-005 reference adapter every other authority adapter copies in shape (three methods, a known-deviation loader, a subprocess-wrapper section, a shared `makeFinding`). It wraps the real, already-shipping sk-doc validators rather than reimplementing document validation.

## 2. HOW IT WORKS

`discover()` walks Markdown files under a `paths`/`globs` scope (excluding the same directories `validate_document.py` skips), classifies each document's type from its path alone via a 1:1 port of `extract_structure.py`'s `detect_document_type()`, and emits `FILE` seed nodes carrying that `docType`. `standardSource('sk-doc')` returns the two validator paths, the create-skill template dirs, `core_standards.md`, and the loaded deviations. `check()` runs two sub-checks: a deterministic template-conformance check that spawns `validate_document.py --json` (blocking-errors → P0, warnings → P1) and `extract_structure.py` (DQI below the 75 floor → P2), and a verify-first reasoning-agent reality-alignment check that only turns already-contradicted, caller-supplied claims into `reality-drift` findings. Known-deviation suppression runs last.

Two provenance details are deliberate and documented: the `DQI_FLOOR` of 75 is a review-contract policy constant carried from the 130-packet precedent, not a value `extract_structure.py` itself emits (it only bands a total qualitatively); and the path-based classifier is `extract_structure.py`'s function, not `validate_document.py`'s content-dependent classifier, chosen because `discover()` walks paths without reading content.

**Difference from deep-review:** deep-review audits a doc's general quality through its own review lens; sk-doc-adapter audits a doc's conformance to sk-doc's *own* creation templates and validators, and suppresses sk-doc's own accepted conventions (repo-wide TOC ban, compact pointer-card shape) so a real convention is never mis-flagged. deep-review has no wrapped external validator and no per-authority deviation list.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/adapters/sk-doc.cjs` | Adapter | The reference adapter: `discover`/`standardSource`/`check`, document-type classifier, subprocess wrappers, suppression. |
| `references/adapters/sk_doc_adapter.md` | Reference | Full specification: classifier provenance (Section 3), the two sub-checks (Section 4), severity mapping (Section 7). |
| `references/adapters/sk_doc_known_deviations.md` | Reference | The seeded sk-doc suppression list; its Section 8 fenced JSON block is parsed by `loadKnownDeviations()`. |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Wrapped tool | The real structural/format validator the deterministic layer spawns. |
| `.opencode/skills/sk-doc/scripts/extract_structure.py` | Wrapped tool | The real DQI/structure extractor the deterministic layer spawns. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/adapters/sk-doc.cjs` CLI (`discover`/`check`/`standard-source`) | Manual dry-run | Runs the real adapter against live docs, the same way the deviation list was re-probed while authored. |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/005-adapter-sk-doc/` | Spec phase | The reference adapter's spec, plan, and acceptance criteria (REQ-001..REQ-003). |

---

## 4. SOURCE METADATA

- Group: Adapter contract
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `adapter-contract/adapter-sk-doc.md`
- Primary sources: `scripts/adapters/sk-doc.cjs`, `references/adapters/sk_doc_adapter.md`, `references/adapters/sk_doc_known_deviations.md`
Related references:
- [discover.md](discover.md) — discover(scope)
- [check.md](check.md) — check(artifact, rules)
- [adapter-sk-git.md](../adapter_contract/adapter_sk_git.md) — sk-git adapter
