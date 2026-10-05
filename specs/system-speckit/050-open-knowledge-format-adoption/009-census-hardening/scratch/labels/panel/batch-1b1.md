## Row 51 (ambiguous)
- Doc: `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/lineages/swe/iterations/iteration-004.md:65`
- Citation: `spec.md:91`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
| Function | Signature | Notes |
|---|---|---|
| `probeBackend(flag)` | `('--deem'|'--jev'|'--both'|'none') → {backend, model, endpoint} | null` | Deem: `GET /health` 200 + `status=="ok"` + `backend` in allowlist `{torch}` or `ensemble:*` sans `stub` + `model=="deem-0.8-v1"` (deepseek-04 F10's gate, quoted). Jev: D5 (`command -v jev`, `jev 0.6.2`, `jev auth status --provider <p>` exit 0). Default order: **Deem first** — this payload is the operator's own transcripts, the packet's highest privacy class (`spec.md:91`); Jev egresses the fitted state |
| `questionsFor(call)` | vendored port | verbatim intent: `call_<id>` keep-call, `result_<id>` keep-verbatim (`compact.ts:58-67`) |
| `batchCalls(calls, stateTokens)` | vendored port (`compact.ts:73-101`) | |
```

