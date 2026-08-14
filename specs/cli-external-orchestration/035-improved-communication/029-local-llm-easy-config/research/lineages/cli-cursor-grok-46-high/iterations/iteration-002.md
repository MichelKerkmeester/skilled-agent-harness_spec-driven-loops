# Iteration 2: Automatic provider-record construction from a discovered local endpoint

## Focus

Given a one-file operator config `{ kind, model, endpoint? }`, how does the engine auto-construct a valid `ProviderModelRecord` for Ollama and LM Studio without asking the operator to hand-author family, protocol, credentialReference, privacy facts, or fallback policy.

## Actions Taken

- Read `src/providers/presets.ts` (`createOllamaModelRecord`, `createLlamaCppModelRecord`, `localProvider`).
- Read `src/providers/adapters.ts` (OpenAI-chat vs Ollama-native parse/prepare).
- Read `src/providers/registry.ts` `validateFamilyCompatibility`.
- Read `src/contracts/provider.ts` `ProviderProtocols`.
- Read `src/transports/http.ts` local vs hosted credential routing.
- Read `src/providers/index.ts` public constructors.

## Findings

1. **Presets already construct a complete local record from a tiny options object.** `LocalProviderPresetOptions` is `{ modelId, privacyClass, observedAt, capabilitiesExpireAt, endpoint?, timeoutMs?, priority? }`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts:32-41] Ollama defaults endpoint `http://127.0.0.1:11434/api/chat`, protocol `ollama-native`, `credentialReference: 'none:local'`, `deploymentMode: 'local'`, `fallbackPolicy.mode: 'none'`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts:86-112] [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts:146-168]

2. **llama.cpp / OpenAI-compatible local defaults to `http://127.0.0.1:8080/v1/chat/completions`** with protocol `llama-cpp-openai`. Same `none:local` credential and no-fallback policy. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts:114-139]

3. **There is no LM Studio preset.** LM Studio's default OpenAI-compatible server is `http://127.0.0.1:1234/v1/chat/completions` (same Chat Completions wire as llama.cpp). The OpenAI-chat adapter is shared across `OPENCODE_GO`, `GENERIC_HOSTED`, and `LLAMA_CPP`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts:22-63]

4. **The registry family/protocol lock forbids treating LM Studio as `generic-hosted`.** `GENERIC_HOSTED` and `OPENCODE_GO` require `deploymentMode === 'hosted'` and protocol `openai-chat-completions`. Local OpenAI-compatible is only valid as `family: llama-cpp` + `protocol: llama-cpp-openai` + `deploymentMode: local`. Ollama local is only valid as `family: ollama` + `protocol: ollama-native`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/registry.ts:208-226] [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/contracts/provider.ts:63-69]

5. **Hosted vs local transport is already decided by the credential reference prefix.** `createDefaultProviderTransport` routes `none:` to `createLocalHttpTransport` (no Authorization header) and everything else to hosted bearer. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/transports/http.ts:72-93] Preset `none:local` therefore already selects the local transport with no extra glue.

6. **Dated capability evidence is required.** Presets demand `observedAt` and `capabilitiesExpireAt`. A one-time operator file should not ask for those. Construction must stamp `observedAt = now` and a bounded expiry (reuse the doctor example's ~8 day window, or a longer local-stable window) inside the loader, not in the operator file. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts:36-37] [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/docs/configuration.md:38-43]

7. **Recommended auto-construction table:**

   | Operator `kind` | Constructor | Default endpoint | Family/protocol emitted |
   |-----------------|-------------|------------------|-------------------------|
   | `ollama` | `createOllamaModelRecord` | `http://127.0.0.1:11434/api/chat` | ollama / ollama-native |
   | `lmstudio` | `createLlamaCppModelRecord` with endpoint override | `http://127.0.0.1:1234/v1/chat/completions` | llama-cpp / llama-cpp-openai |
   | `openai-compatible` (alias) | same as `lmstudio` / llama.cpp | operator `endpoint` required if not 8080/1234 | llama-cpp / llama-cpp-openai |
   | `llama.cpp` | `createLlamaCppModelRecord` | `http://127.0.0.1:8080/v1/chat/completions` | llama-cpp / llama-cpp-openai |

   Operator file fields: `kind` + `model` required; `endpoint` optional. Loader fills `privacyClass: 'local-offline'` (loopback) or `'local-networked'` only if the endpoint host is not loopback; `credentialReference: 'none:local'`; `fallbackPolicy: none`; `priority`; timestamps.

8. **Unknown `kind` or missing `model` must fail closed** to no records / empty candidate list, which the privacy router already treats as `invalid-input` → exact original. Do not invent a hosted Go record as a default. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/privacy/router.ts:252-270]

## Questions Answered

- Q2 (answered): Auto-construction is a thin switch over the two existing local presets. LM Studio is OpenAI-compatible local and MUST emit the llama-cpp family, not generic-hosted. The operator never writes family, protocol, credential, or fallback.

## Questions Remaining

- Q3: Judge default.
- Q4: Privacy policy the loader must attach.
- Q5: Where the loader is called from plugin and wrapper.

## Next Focus

Judge default that permits local accepts without weakening hosted reject-only, grounded in `reject-only-judge.ts`, `project-message.ts` judgeMode composition, and the plugin's `judgeMode: 'disabled'`.

## Assessment

- newInfoRatio: 0.78
- noveltyJustification: New evidence is the registry family lock that forces LM Studio through llama-cpp, plus the preset options already matching a 2-field operator file.
- Confidence: High.

## Reflection

What worked: reading `validateFamilyCompatibility` before proposing a new `generic-hosted` local record.
What failed: treating "OpenAI-compatible" as the hosted protocol name — that protocol is hosted-only in the registry.
Ruled out: a new LM Studio adapter family in this design (wire-identical to llama.cpp OpenAI adapter; a later build may add an alias constructor, not a new adapter).

## Dead Ends

- Mapping LM Studio to `GENERIC_HOSTED` / `openai-chat-completions`: registry rejects local+that family.
- Asking the operator to paste a full preset JSON: duplicates what `createOllamaModelRecord` already does from `modelId` + optional `endpoint`.

## Ruled Out

- New Ollama-vs-LM-Studio wire adapter (adapters already exist).
- Defaulting a missing kind to OpenCode Go hosted (would egress).
