# Iteration 1: D1 Correctness — Inventory Pass over Check Scripts and Standing Invariants

## Focus

- **Dimension:** correctness (D1)
- **Scope:** the 8 gate/check scripts in `shared/scripts/`, `design-foundations/scripts/`, `design-audit/scripts/`, plus the 3 metadata files (`command-metadata.json`, `mode-registry.json`, `hub-router.json`).
- **Goal:** capture baseline behavior for the four standing invariants, identify any first-pass correctness regressions in the gate code.

## Scorecard

- Dimensions covered: correctness (deep pass 1)
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.04 (1 P2 against 27 in-scope files)

## Standing-Invariant Baseline (captured)

| Invariant (from orchestrator reviewScopeNote) | Method | Result |
|---|---|---|
| `design-command-surface-check` STATUS=PASS drift=0 | `node …/design-command-surface-check.mjs --json` | ✅ `status=pass`, `commandCount=5`, `aliasCount=15`, `drift=[]` (exit 0) |
| `naming_doc_check` exit 0 | `python3 …/naming_doc_check.py fixtures/naming_doc/compliant.md` | ✅ exit 0; violating fixture → exit 1; missing file → exit 2 |
| `numeric_law_check` clean on canonical doc | `python3 …/numeric_law_check.py shared/numeric_design_laws.md` | ✅ exit 0, rows=12 |
| `variant_parameter_check` clean on contract | `python3 …/variant_parameter_check.py shared/assets/variant_parameter_contract.md` | ✅ exit 0, rows=5 |
| `ai-fingerprint-registry-check` | `node …/ai-fingerprint-registry-check.mjs --json` | ✅ exit 0, catalogTells=10, registryRows=10 |
| `ai-fingerprint-fixture-check` | `node …/ai-fingerprint-fixture-check.mjs --json` | ✅ exit 0, matchers=10, samples=20 |
| evergreen 0 leaks (no `specs/NNN-*` / `ADR-NNN` / `REQ-NNN` / `TNNN`) | rg across `sk-design/**` excluding node_modules/changelog | ✅ no literal 3-digit IDs leaked; only parameterized `<track>/<packet>` path templates in `design-md-generator/{README,SKILL,INSTALL_GUIDE}.md` |

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion

- **F001** — `proof_check.py` READY-verdict regex accepts any bolded "READY" in prose as a verdict. `.opencode/skills/sk-design/shared/scripts/proof_check.py:46`. The `READY = re.compile(r"(?:\[x\]|\*\*|verdict[:\s*]+|result[:\s*]+)\s*READY\b", re.I)` pattern's `\*\*` alternative matches a sentence like "we are not yet **READY** for this" as a positive verdict. The `NOT_READY` regex (line 47) only catches the explicitly checked form, so an inline bolded READY in non-verdict prose would inflate `ready=true` for a partial card. Strictly a false-positive risk; the proof-field gate and `--require-*` lanes still anchor the verdict, so this is hardening, not active drift.
  - **Category:** correctness
  - **Dimension:** correctness
  - **ScopeProof:** `.opencode/skills/sk-design/shared/scripts/proof_check.py` is the deterministic proof-of-application gate cited by `shared/assets/proof_of_application_card.md` and is in the orchestrator's reviewScopeNote.
  - **Recommendation:** tighten the regex to require an anchor (e.g., `\*\*Verdict:\s*READY\*\*` or `\[x\]\s*READY`) before "READY" can flip `ready=true`, OR document the existing `\*\*` alternative as "intentionally lenient".

### Claim-Adjudication Packets
(none — no new P0/P1 in this iteration)

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | deferred | hard | — | scheduled for D3 traceability iteration |
| checklist_evidence | n/a | hard | — | no spec-folder checklist for this target |

## Assessment

- New findings ratio: 0.04
- Dimensions addressed: correctness
- Novelty justification: F001 is the only novel P2; all other gate scripts passed their canonical inputs cleanly with correct exit codes. The 4 standing invariants hold on direct execution.

## Ruled Out

- "naming_doc_check exits 0 even on violating input" — initially suspected from a `python3 ... | tail` pipe measurement, but re-measured without pipe: violating → exit 1, clean → exit 0, missing → exit 2. False alarm.

## Dead Ends

- Tried grep for spec/packet IDs across the skill tree to find evergreen leaks — every match is either a token name (`--ds-gray-100-value`), prose (`100-plus per day`), or a parameterized path template (`<track>/<packet>`). No real leak.

## Recommended Next Focus

D2 Security pass on the design-md-generator backend (the only code surface that takes URLs and file paths from operator input). Specifically audit `crawl.ts`, `extract.ts`, `cli.ts`, `cluster.ts`, `formatters-v3.ts`, and `validate.ts` for shell-injection paths, URL handling, and untrusted-path traversal.

Review verdict: PASS
