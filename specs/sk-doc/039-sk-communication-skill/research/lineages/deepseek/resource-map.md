# Resource Map — Communication Projection Deep-Research (deepseek lineage)

Evidence-derived inventory of the surfaces consulted by the five-iteration deepseek lineage. Derived from converged deltas; every file was read without modification.

## Primary implementation

- `packages/cli-communication-projection/src/fidelity/protected-spans.ts` — protected-span codec; `protectMarkdown`, `createToken` (~48-char placeholder), `restoreProtectedSpans` (fail-closed identity/order checks).
- `packages/cli-communication-projection/src/fidelity/dialect.ts` — conservative Markdown dialect; `collectProtectedRanges` (block + configured + inline), `createMarkdownStructureSignature`.
- `packages/cli-communication-projection/src/fidelity/validator.ts` — `validateProjectionCandidate` (staged fail-closed pipeline), `runJudge` (reject-only judge seam), unchanged-echo short-circuit.
- `packages/cli-communication-projection/src/fidelity/semantics.ts` — `compareSemanticMeaning` (deterministic vetoes), `isUnexpectedRefusal`, `countContentCodepoints`.
- `packages/cli-communication-projection/src/providers/adapters.ts` — `messages()` (one system + one user message), `prepare`, adapters per family.
- `packages/cli-communication-projection/src/providers/controls.ts` — `compilePromptControls` (fail-closed capability/control evidence).
- `packages/cli-communication-projection/src/providers/presets.ts` — `createOpenCodeGoDeepSeekV4FlashRecord`, `baseCapabilities` (temperature/thinking `unknown`).
- `packages/cli-communication-projection/src/providers/executor.ts` — `executeProviderRoute` (privacy-verified attempt loop; returns candidate or exact-original).
- `packages/cli-communication-projection/src/contracts/prompt.ts` — `PromptProfileRecord` (no examples/rubric field).
- `packages/cli-communication-projection/src/contracts/event.ts` — `EventEnvelope`, `EventKinds`, `EventPhases`, `TerminalStatuses`.
- `packages/cli-communication-projection/src/core/assembly-output.ts` — `completeAssembly` (raw-text terminal payload).
- `packages/cli-communication-projection/src/core/assembler.ts` — `MessageAssembler` (generation-keyed, bounded state machine).
- `packages/cli-communication-projection/src/runtimes/codex.ts` — `CodexCapabilityRecords`, `payloadFor` (canonical references), `presentCodexDecision`.
- `packages/cli-communication-projection/src/clients/types.ts` — presentation tiers; `canClaimFullProjectionParity`.
- `packages/cli-communication-projection/src/render/decision.ts` — `decideRender` (atomic/append/sidecar/original-only).
- `packages/cli-communication-projection/src/evaluation/fidelity-veto.ts` — `evaluateFidelityVeto` (judge `disabled`).
- `packages/cli-communication-projection/src/evaluation/proxy-judge.ts` — `scoreMaskedReviewPacketWithProxy` (provisional `llm-proxy`).
- `packages/cli-communication-projection/src/evaluation/types.ts` — `assertHumanCertifiable`, evidence classes.

## Test fixtures

- `packages/cli-communication-projection/test/fixtures/prompt-profiles.json` — reference-like and unsupported-controls synthetic prompt profiles.

## Documentation

- `packages/cli-communication-projection/docs/privacy.md` — local-only/hosted/mixed privacy modes.
- `packages/cli-communication-projection/docs/configuration.md` — privacy modes + compatibility doctor.
- `packages/cli-communication-projection/docs/runbook.md` — release prerequisites incl. live smoke and human non-inferiority.
- `packages/cli-communication-projection/docs/support-matrix.md` — supported/provisional/unsupported/blocked evidence.
- `packages/cli-communication-projection/docs/rollback.md` — provider-free rollback and `OriginalOnlyEmergencyMode`.

## Skill contract

- `.opencode/skills/sk-communication/SKILL.md` — pipeline, presentation tiers, ALWAYS/NEVER rules, release gate.

## Known gaps

- No user-value benchmark or deterministic prose baseline in the package.
- No checked-in production composition connecting the provider candidate to the meaning judge.
- No structured prose renderer; the projected payload is raw text.
- No source-backed model quality tier; DeepSeek temperature/thinking capability evidence is `unknown`.
- The live smoke's capability-evidence profile is not checked into the package.
