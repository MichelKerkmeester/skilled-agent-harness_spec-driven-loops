# Deep Research Synthesis: Local LLM Easy Config (cli-cursor-grok-46-high lineage)

Lineage: cli-cursor-grok-46-high | executor: cli-cursor / cursor-grok-4.6-high | session: fanout-cli-cursor-grok-46-high-1786720025911-6qn2nd | stop: max-iterations (5/5)

<!-- MACHINE-OWNED: synthesis from iterations 001-005 -->

## 1. Executive Summary

The communication projection can already call a local LM Studio or Ollama endpoint. `createLocalHttpTransport`, OpenAI-compatible adapters, an Ollama-native adapter, and `createOllamaModelRecord` / `createLlamaCppModelRecord` are shipped. What is missing is config-and-glue: after a person opts in, no shipped entry point discovers a provider or constructs the `projectMessage` input, so the projection never uses that model.

**First choice:** extend the git-ignored `enablement.local.json` that operators already use to opt in. Add one object, `localProvider: { kind, model, endpoint? }`. A shared loader under `src/config/` turns that into a local `ProviderModelRecord`, a local-only privacy policy, `judgeMode: 'required'`, and a shipped copy-editing prompt. The OpenCode plugin's `createProjectionInput` and `bin/cli-output-wrapper.mjs` both call that loader. After the one-time file write, projection activates automatically. Missing or malformed config fails closed to the exact original.

This is research only. A later build phase implements the loader and the two call sites.

## 2. Grounding Gaps in Shipped Code

Four gaps the design must close, plus two additional no-ops found in this lineage:

1. **Empty plugin provider config.** `.opencode/plugins/mk-communication-projection.js:256-258` passes `candidateProviderIds: []`, `judgeMode: 'disabled'`, and empty `policy`. [SOURCE: file:.opencode/plugins/mk-communication-projection.js:254-258]
2. **Empty privacy allow-list.** `POLICY.allowedPrivacyClasses` is `[]` at `.opencode/plugins/mk-communication-projection.js:44-48`. The privacy router treats an empty allow-list as `invalid-input`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/privacy/router.ts:263-264]
3. **Unwired wrapper bin.** `bin/cli-output-wrapper.mjs:106-115` records that projection config is caller-supplied and writes captured bytes through; it never calls `runWrapperProjection`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/bin/cli-output-wrapper.mjs:106-115]
4. **Network layer already exists.** `createLocalHttpTransport` / `createDefaultProviderTransport` route `none:` credentials with no Authorization header. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/transports/http.ts:72-93] Adapters cover OpenAI chat and Ollama native. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts:22-48]
5. **Empty rewrite prompt.** Plugin `PROMPT.systemInstruction` is `''`. [SOURCE: file:.opencode/plugins/mk-communication-projection.js:50-54] Adapters send it as the system message. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts:96-100]
6. **Judge wording vs code.** The phase spec says the default judge rejects even good rewrites. Shipped `createRejectOnlyMeaningJudge` accepts when token coverage >= 0.5. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts:16-27] Runtime tests project successfully under `judgeMode: 'required'`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/test/runtime/project-message.test.ts:144-153] The no-op is empty glue, not an always-reject judge.

## 3. Config Discovery Format

The public config API exports only enablement. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/config/index.ts:4] `COMMUNICATION_PROJECTION_ENABLED` wins when set; otherwise git-ignored `enablement.local.json` `{ "enabled": true }` may opt in; otherwise false. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/config/enablement.ts:25-60] The committed example is `{ "enabled": false }` with no provider fields. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/enablement.local.json.example:1-3] `.gitignore` already ignores the real file. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/.gitignore:4]

There is no provider-config loader. Turning enablement on today still no-ops both entry points.

**Recommended operator file:**

```json
{
  "enabled": true,
  "localProvider": {
    "kind": "ollama",
    "model": "llama3.2"
  }
}
```

LM Studio: `"kind": "lmstudio", "model": "<loaded-model-id>"`. Optional `"endpoint"`. No privacy, judge, prompt, or credential fields.

Precedence: env force-off stops everything; env force-on or file `enabled: true` is the opt-in; `localProvider` is the provider source of truth; missing/malformed provider → exact original. One `localProvider` object only (no dual Ollama+LM Studio in one file).

## 4. Automatic Provider-Record Construction

Presets already build a complete local record from `{ modelId, privacyClass, observedAt, capabilitiesExpireAt, endpoint? }`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts:32-139] They set `credentialReference: 'none:local'`, `deploymentMode: 'local'`, and `fallbackPolicy.mode: 'none'`.

The registry family lock is the design constraint:

| Operator `kind` | Constructor | Default endpoint | Emitted family / protocol |
|---|---|---|---|
| `ollama` | `createOllamaModelRecord` | `http://127.0.0.1:11434/api/chat` | ollama / ollama-native |
| `lmstudio` | `createLlamaCppModelRecord` + endpoint override | `http://127.0.0.1:1234/v1/chat/completions` | llama-cpp / llama-cpp-openai |
| `llama.cpp` / `openai-compatible` | `createLlamaCppModelRecord` | `http://127.0.0.1:8080/v1/chat/completions` (or required endpoint) | llama-cpp / llama-cpp-openai |

`GENERIC_HOSTED` + `openai-chat-completions` requires `deploymentMode: 'hosted'`. LM Studio must not use that family. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/registry.ts:208-226]

The loader stamps `observedAt = now` and a bounded `capabilitiesExpireAt`. The operator does not write dates. Unknown `kind` or missing `model` yields no records.

## 5. Judge Default That Permits Local Accepts

Reject-only means the judge cannot override a deterministic rejection and cannot rank variants. It does not mean "always reject." [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts:10-27] `projectMessage` composes the default judge only when `judgeMode === 'required'`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/runtime/project-message.ts:192-194]

**Local easy-config default:** `judgeMode: 'required'`, no custom judge. Good local rewrites accept (coverage >= 0.5). Meaning-loss returns exact-original `judge-rejected`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/test/runtime/project-message.test.ts:155-166] Hosted safety stays `egressConsent` + allowed classes + fresh facts, not a different judge.

Do not default to `judgeMode: 'disabled'` (skips meaning coverage). Do not add an accept-only judge (would authorize deterministic rejects).

## 6. Local-Only Privacy Defaults

Loader-built policy, not operator-authored:

- `allowedPrivacyClasses: ['local-offline']`, plus `'local-networked'` only if the endpoint host is not loopback
- `egressConsent: false`
- `requiredKnownFacts: []`
- single candidate id; preset `fallbackPolicy.mode: 'none'`

Hosted `deploymentMode` with `egressConsent: false` is denied before the ranker. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/privacy/router.ts:157-164] [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/test/providers/privacy.test.ts:25-40] Ranking never creates a fallback. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/docs/configuration.md:17]

Do not merge OpenCode Go into the candidate list because enablement is on. Mixed mode is an explicit later choice.

## 7. Plugin Auto-Pickup

The hook already checks `isProjectionEnabled()` then calls `projectMessage(createProjectionInput(...))`. [SOURCE: file:.opencode/plugins/mk-communication-projection.js:291-295] Auto-pickup is: `createProjectionInput` calls `loadLocalProjectionConfig()`. On null, keep fail-open (original parts, no throw). [SOURCE: file:.opencode/plugins/mk-communication-projection.js:277-282] Kill-switch `MK_COMMUNICATION_PROJECTION_DISABLED=1` remains independent. [SOURCE: file:.opencode/plugins/mk-communication-projection.js:74-76]

## 8. Wrapper Auto-Pickup

`runWrapperProjection` already forwards a full `WrapperProjectionConfig`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/wrapper/run.ts:47-61] The shipped bin does not call it. After enablement-on and a successful parse, the bin must load the same config and project; otherwise keep today's byte-exact passthrough. No new CLI flag.

## 9. Enablement Coupling and Prompt

Default-off stays the outer gate. `enabled: true` plus `localProvider` is the one-time opt-in. Env `0`/`false`/`off` still kills projection. A `localProvider` block with `enabled: false` must not project.

The loader supplies a shipped copy-editing `systemInstruction` (the test helper string is the proven shape: "Rewrite only the user message in plain English. Output only the rewrite."). [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/test/providers/helpers.ts:118] Operators do not write a prompt.

Transport is omitted so `projectMessage` uses `createDefaultProviderTransport()`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/runtime/project-message.ts:177]

## 10. Fail-Closed and Edge Cases

| Case | Behavior |
|---|---|
| No file / `enabled` false / env force-off | Exact original; projection off |
| `enabled` true but missing/malformed `localProvider` | Exact original |
| Unknown `kind` or missing `model` | Exact original |
| Local endpoint down, slow, or truncated | Existing provider/timeout paths → exact original |
| Poor rewrite | Deterministic validators + reject-only judge → exact original |
| Hosted record present alongside local easy-config | Local-only policy + `egressConsent: false` denies hosted |
| Plugin vs wrapper | Same loader → same provider |
| Two kinds in one file | Forbidden; one `localProvider` object |

Discovery and construction run once per activation, not per token. [Inferred from NFR-P01; confirm in the later build.]

## 11. Recommendations

**Implement first (later build phase), in this order:**

1. Extend `enablement.local.json` schema and the committed example with optional `localProvider`.
2. Add `loadLocalProjectionConfig()` in `src/config/` (record via existing presets, local-only policy, `judgeMode: 'required'`, shipped prompt). Export it from the package barrel the plugin already imports.
3. Change plugin `createProjectionInput` to use the loader; keep empty arrays as the null fallback.
4. Change `bin/cli-output-wrapper.mjs` to call the loader and `runWrapperProjection` when the config is valid.
5. Keep enablement env as the force-on / force-off overlay. Optional `COMMUNICATION_PROJECTION_LOCAL_*` overlays are rank 2, not required for v1.

**First choice recap:** one git-ignored file, two call sites, zero new adapters, zero new judges, zero hosted defaults.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Env-only as primary one-time setup | No reader, not auditable, no committed example | `src/config/enablement.ts`; `src/config/index.ts` | 1 |
| Silent localhost port scanning | Violates default-off; may send content to an unexpected process | `docs/enablement.md` | 1 |
| Hand-authored full `ProviderModelRecord` JSON | Exceeds minimal setup; presets already construct from model+endpoint | `src/providers/presets.ts`; `docs/configuration.md` | 1 |
| Map LM Studio to `GENERIC_HOSTED` / `openai-chat-completions` | Registry requires hosted `deploymentMode` for that family | `src/providers/registry.ts:208-226` | 2 |
| New LM Studio wire adapter | OpenAI-chat adapter already shared with llama.cpp | `src/providers/adapters.ts:22-63` | 2 |
| Default missing kind to OpenCode Go hosted | Would egress message content | `src/providers/presets.ts:43-84` | 2 |
| New local-accept judge | Would authorize candidates deterministic checks rejected | `src/fidelity/reject-only-judge.ts:10-14` | 3 |
| `judgeMode: 'disabled'` as easy-config default | Skips meaning coverage | `src/fidelity/validator.ts:229-244` | 3 |
| `egressConsent: true` in local easy-config | Allows hosted `deploymentMode` records | `src/privacy/router.ts:157-164` | 4 |
| Mixed local-then-hosted default | Docs require explicit mixed mode and named fallbacks | `docs/privacy.md:30-37` | 4 |
| Operator-authored `allowedPrivacyClasses` | Loader can derive from endpoint host | `docs/privacy.md:11-16` | 4 |
| Wrapper CLI flag for provider config | Further manual step | `bin/cli-output-wrapper.mjs:17-26` | 5 |
| Two-file enablement + `provider.local.json` as default | Recreates enable-without-provider no-op | `src/config/enablement.ts:48-60` | 5 |
| Require doctor before first projection | Expert path, not one-time setup | `docs/configuration.md:21-73` | 5 |

## Divergence Map

- Saturated directions: env-only primary config; new judge; mixed-mode default.
- Pivots taken: none (stopPolicy max-iterations; five distinct angles instead of early synthesis).
- Evidence: iterations 001–005 and this lineage registry.
- Council artifacts: none (this is a research lineage, not AI Council).
- Pivot failures and audited overrides: none.
- Remaining frontier: rank-2 env overlays; optional `createOpenAiCompatibleLocalRecord` alias so LM Studio docs never say "llama.cpp"; exact capability-expiry window the loader stamps.

## 12. Open Questions

These do not block the ranked recommendation:

- Cosmetic alias constructor so operator docs say `lmstudio` without exposing the llama-cpp family name.
- Exact `capabilitiesExpireAt` window (doctor example uses ~8 days).
- Whether rank-2 env overlays ship in the same build as the file format.

## 13. Risks

- **LM Studio naming smell:** correctness requires llama-cpp family. Mitigate with a kind alias in the loader; do not add a new adapter.
- **Empty prompt leftover:** wiring providers without filling `systemInstruction` still yields useless rewrites. The loader must set the shipped prompt.
- **Enablement-on without provider:** must remain exact-original, never a hosted default.
- **Wrapper bin vs library drift:** both must call the same loader.

## 14. Requirements Trace

| REQ | Finding |
|---|---|
| REQ-003 config surface | Iteration 1: extend `enablement.local.json`; env on/off overlay |
| REQ-004 provider auto-construction | Iteration 2: presets + kind table; LM Studio via llama-cpp |
| REQ-005 local-permissive judge | Iteration 3: `judgeMode: 'required'` + existing reject-only judge |
| REQ-006 local-only privacy | Iteration 4: loader policy, `egressConsent: false`, fallback none |
| REQ-007 ranked options | Iteration 5 and §11: first choice plus four ranked alternatives |

REQ-001 and REQ-002 are packet-planning requirements (question, method). This lineage executed the cli-cursor half (5 of 10 iterations).

## 15. Later Build Phase Touch List (design only)

- `src/config/enablement.ts` / new `src/config/local-provider.ts` / `src/config/index.ts`
- `enablement.local.json.example`
- `.opencode/plugins/mk-communication-projection.js` `createProjectionInput`
- `bin/cli-output-wrapper.mjs` post-parse path
- `docs/enablement.md` and `docs/configuration.md` (one-time file, not doctor-first)
- Tests for loader, plugin input, wrapper bin, fail-closed, hosted-deny

Do not change transports, adapters, the reject-only judge, or privacy router behavior for this design.

## 16. Verification Notes for This Lineage

- Executor: cli-cursor / cursor-grok-4.6-high, session `fanout-cli-cursor-grok-46-high-1786720025911-6qn2nd`
- Iterations completed: 5/5, no early stop (`stopPolicy: max-iterations`)
- Composite convergence was telemetry only (ratios 0.92 → 0.78 → 0.70 → 0.62 → 0.55)
- Write containment: artifacts only under this lineage directory; spec.md not mutated; `generate-context.js` not run
- `resource-map.md` absent at the spec folder; coverage gate skipped; `resource_map.emit: false`

## 17. References

- `.opencode/plugins/mk-communication-projection.js`
- `.opencode/skills/sk-communication/cli-communication-projection/src/config/enablement.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/src/config/index.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/src/runtime/project-message.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/src/transports/http.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/src/providers/registry.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/src/privacy/router.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/src/wrapper/run.ts`
- `.opencode/skills/sk-communication/cli-communication-projection/bin/cli-output-wrapper.mjs`
- `.opencode/skills/sk-communication/cli-communication-projection/docs/enablement.md`
- `.opencode/skills/sk-communication/cli-communication-projection/docs/configuration.md`
- `.opencode/skills/sk-communication/cli-communication-projection/docs/privacy.md`
- `specs/cli-external-orchestration/035-improved-communication/029-local-llm-easy-config/spec.md`

resource-map.md was not present at init; no map citation.

## Convergence Report

- Stop reason: max_iterations
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: none blocking; three non-blocking follow-ups in §12
- Last 3 iteration summaries: (3) judge already accepts good local rewrites — insight; (4) local-only policy + egressConsent false blocks hosted cascade; (5) shared loader + ranked first choice
- Convergence threshold: 0.05 (telemetry only under stopPolicy max-iterations)
- newInfoRatio trend: 0.92 → 0.78 → 0.70 → 0.62 → 0.55 (declining, as expected under forced depth)
- Divergence summary: five distinct angles (config, construction, judge, privacy, pickup); no divergent-mode pivot; saturated env-only, new-judge, and mixed-mode defaults
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
