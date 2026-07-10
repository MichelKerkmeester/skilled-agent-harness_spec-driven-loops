---
title: "Implementation Summary: 022/010 ADR Writing and Doc Validator"
description: "Closed 022 arc with 4 ADRs documenting architectural decisions + validate-doc-model-refs.js script for doc drift detection."
trigger_phrases:
  - "022/010 shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator"
    last_updated_at: "2026-05-23T15:17:00Z"
    last_updated_by: "devin"
    recent_action: "Phase 010 shipped — 4 ADRs + validator script closing 022 arc"
    next_safe_action: "Wire validate-doc-model-refs.js to pre-commit or CI (deferred)"
    blockers: []
    key_files:
      - "decision-record.md"
      - ".opencode/skills/sk-doc/scripts/validate-doc-model-refs.js"
      - "../004-spec-memory-embedder-bake-off/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002312"
      session_id: "022-010-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 010 documented 4 architectural decisions from 022 remediation"
      - "Validator script detects doc drift via canonical model cross-reference"
---
<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/.templates/implementation-summary-core.md | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/010 ADR Writing and Doc Validator

<!-- ANCHOR:metadata -->
## 1. METADATA

|| Field | Value |
||---|---|
|| Status | Complete |
|| Shipped | 2026-05-23 |
|| Files changed | 1 new decision-record + 1 new validator script + 1 modified decision-record + 6 spec docs |
|| ADRs authored | 4 (A, B, C, D) |
|| Validator script | validate-doc-model-refs.js (~220 lines) |
|| Typecheck | N/A (no TS changes) |
|| Audit findings addressed | Doc drift detection mechanism (preventative) |
|| Arc closure | 022-hardcoded-default-remediation-arc closed |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### `010-adr-writing-and-doc-validator/decision-record.md` (NEW)

4 ADRs documenting 022 remediation decisions:

- **ADR-A: Skill-Advisor Calibration as Contractual Constants**
  - Status: Accepted
  - Decision: `SKILL_ADVISOR_COMPAT_CONTRACT.defaults` is canonical source of truth
  - Consequence: Single diff per threshold change; env-var overrides for runtime tuning

- **ADR-B: Verification Clause Amendment for ADR-013 + ADR-014**
  - Status: Accepted
  - Decision: Future audits MUST grep for BOTH `DEFAULT_*` constants AND inline `||` fallbacks
  - Consequence: Structurally impossible to miss inline fallbacks; invariant test required

- **ADR-C: profile.ts Scope Coverage (Parallel Resolution Chains)**
  - Status: Accepted
  - Decision: All 3 resolution chains MUST derive from registry.ts
  - Consequence: Future maintainers see all chains documented; new chains require registry derivation

- **ADR-D: Doc-Implementation Cross-Checking Mandate**
  - Status: Accepted
  - Decision: Validator script cross-references docs against canonical model lists
  - Consequence: Doc drift visible at PR time once wired to CI

### `sk-doc/scripts/validate-doc-model-refs.js` (NEW)

Node.js validator script (~220 lines):

- Loads canonical models from registry.ts (MANIFESTS, CLOUD_CANONICAL, RERANKER_CANONICAL)
- Loads canonical models from registered_embedders.py (DEFAULT_EMBEDDER_NAME, DEFAULT_RERANKER_NAME)
- Glob scans .opencode/skills/**/*.md excluding changelog/, scratch/, benchmarks/, *archive*, research/iterations/
- Detects model-name patterns with org-prefix whitelist (BAAI/, jinaai/, Qwen/, etc.)
- Checks context for default markers ("current default", "default", "shipped default", etc.)
- Ignores intentional historical references ("former default", "superseded", "pre-", etc.)
- Reports drift with file:line + cited value + canonical value
- Supports --verbose flag for debugging
- Supports --help for usage documentation
- Exit 0 = no drift; exit 1 = drift found

### `004-spec-memory-embedder-bake-off/decision-record.md` (MODIFIED)

Appended AMENDMENT section (no existing content modified):

- Scope: Verification clause for ADR-013 + ADR-014
- Verification Clause: No inline string-literal model-name defaults shall contradict canonical entries
- Rationale: Packet 020's grep missed profile.ts:195 inline fallback; 021 audit caught it
- Cross-ref: Full ADR-B text in 010 decision-record.md
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Devin SWE-1.6 direct execution. ~90 minutes wall-clock total:

1. Created directory structure for 010 packet
2. Read ADR template from 004 decision-record.md
3. Wrote decision-record.md with 4 ADRs following template structure
4. Wrote validate-doc-model-refs.js with ES module syntax, custom file walker (no glob dependency)
5. Fixed ESM compatibility issues (__dirname via fileURLToPath, removed glob dependency)
6. Tested validator script --help (exit 0)
7. Tested validator script dry-run (detected drift in install guides and CocoIndex docs)
8. Appended AMENDMENT section to 004 decision-record.md
9. Created 5 Level 2 spec docs (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md)
10. Created description.json and graph-metadata.json

The validator script currently detects doc drift (exit 1) because several docs still cite pre-023B defaults (nomic-ai/CodeRankEmbed, Qwen/Qwen3-Reranker-0.6B). This is expected and documented in ADR-D; CI wiring is deferred.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **ESM over CommonJS**: Project uses ES modules; used import syntax and fileURLToPath for __dirname
- **Custom file walker over glob dependency**: Avoided adding glob dependency; implemented recursive directory walk with regex pattern matching
- **Org-prefix whitelist**: Reduced false positives by only matching model names starting with known org prefixes (BAAI/, jinaai/, Qwen/, etc.)
- **Context-aware detection**: Checks for default markers in surrounding context to distinguish actual drift from incidental mentions
- **Intentional historical references**: Ignores matches with "former default", "superseded", "pre-" markers to avoid false positives on historical documentation
- **CI wiring deferred**: 1-shot run is immediate use case; pre-commit/CI integration left for future work
- **Append-only amendment**: Modified 004 decision-record.md by appending only; no existing content changed to preserve history
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- `node .opencode/skills/sk-doc/scripts/validate-doc-model-refs.js --help` → exit 0, help text displayed
- `node .opencode/skills/sk-doc/scripts/validate-doc-model-refs.js` → exit 1, drift detected (expected)
- `grep -c "^## ADR-A:\|^## ADR-B:\|^## ADR-C:\|^## ADR-D:" .../010-.../decision-record.md` → 4
- `grep "AMENDMENT (2026-05-23, per 022/010 ADR-B)" .../004-spec-memory-embedder-bake-off/decision-record.md` → 1 hit
- All spec docs created (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md)
- description.json and graph-metadata.json created
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- **Validator false positives**: Current run detects drift in install_guides/README.md (citing onnx-community/embeddinggemma-300m-ONNX and unsloth/embeddinggemma-300m-GGUF as defaults) and CocoIndex docs (citing nomic-ai/CodeRankEmbed and Qwen/Qwen3-Reranker-0.6B as defaults). These are legitimate drift findings per ADR-D; docs need updating to reflect current canonical defaults.
- **Model org prefix coverage**: Whitelist covers major orgs but may miss future model providers. Extensible via MODEL_ORG_PREFIXES array.
- **Pattern matching complexity**: Regex-based pattern matching may not catch all model-name variations; org-prefix whitelist reduces this risk.
- **No CI wiring yet**: Validator is not integrated into pre-commit or CI; doc drift detection requires manual runs until wired.

### Commit Handoff

Suggested message:

```
docs(022/010): author 4 ADRs closing 022 arc + validate-doc-model-refs.js doc drift detector

ADR-A: Skill-Advisor Calibration as Contractual Constants
- SKILL_ADVISOR_COMPAT_CONTRACT.defaults is canonical source of truth
- Env-var overrides allow runtime tuning without compromising audit trail

ADR-B: Verification Clause Amendment for ADR-013 + ADR-014
- Future audits MUST grep for BOTH DEFAULT_* constants AND inline || fallbacks
- Invariant test required for each resolution-chain entry point

ADR-C: profile.ts Scope Coverage (Parallel Resolution Chains)
- All 3 spec-memory resolution chains MUST derive from registry.ts
- Documented auto-select cascade, active-profile path, and deferred-resolution path

ADR-D: Doc-Implementation Cross-Checking Mandate
- New validate-doc-model-refs.js script detects doc drift via canonical cross-reference
- Scans .opencode/skills/**/*.md excluding changelog/, scratch/, benchmarks/, *archive*
- Exit 0 = no drift; exit 1 = drift found

Also appended AMENDMENT section to 004 decision-record.md (ADR-B cross-ref).
```

Suggested explicit paths:

```
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator/
.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/description.json
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/graph-metadata.json
```
<!-- /ANCHOR:limitations -->
