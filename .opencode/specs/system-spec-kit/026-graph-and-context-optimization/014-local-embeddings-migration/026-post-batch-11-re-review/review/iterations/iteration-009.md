# Iteration 009 — Local-LLM Legacy Hunt

## Focus
This iteration focused on maintainability residue in live skill assets, generated fixtures, command packs, root/runtime configs, install guides, and embedding-related test fixtures. I scanned for stale singleton DB filenames, rejected ONNX runtime references, MiniLM/nomic-era default claims, hf-local-default wording, and Voyage marketing copy, then filtered out historical archives, the current review packet, forensic evidence, accepted compatibility registries, and prior iteration findings.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-009-001 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:380 | "MEMORY_DB_PATH points directly to context-index.sqlite for disposable fixtures." | confirmed-residue | Regenerate or patch the compiled manual-playbook fixture so the disposable DB note uses provider-neutral wording, matching the post-014 profile-keyed filename model. |

## Iteration summary
- Files scanned: 4261
- New findings: 1 (P0=0, P1=0, P2=1)
- Out-of-scope/historical noted but NOT flagged: 18
- Notes: Saturation. Most remaining hits were already covered by iterations 001-008, explicitly intentional compatibility/test patterns, historical changelog/spec context, or accepted provider/model registries. The only new maintainability residue I could support without duplicating prior findings is the generated JS fixture copy of the stale disposable `context-index.sqlite` note.
