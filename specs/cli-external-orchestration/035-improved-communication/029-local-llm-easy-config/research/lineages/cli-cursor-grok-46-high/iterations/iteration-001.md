# Iteration 1: Config discovery format against shipped enablement surfaces

## Focus

Map every shipped configuration surface that an operator can touch today, then rank file-only, env-only, and dual-surface designs for local-LLM easy-config. The question is not "how to call Ollama" — the transport already exists — but "what does a person write once, where it lives, and how little of it is needed."

## Actions Taken

- Read `src/config/enablement.ts` and `src/config/index.ts` (the entire public config API).
- Read `docs/enablement.md`, `docs/configuration.md`, `enablement.local.json.example`, and package `.gitignore`.
- Read `.opencode/plugins/mk-communication-projection.js` constants and `createProjectionInput()`.
- Read `bin/cli-output-wrapper.mjs` through the parse-and-passthrough path.
- Grep the package for `readFileSync`, `enablement.local`, and `COMMUNICATION_PROJECTION_*` to inventory every live discovery path.

## Findings

1. **Enablement is a boolean gate, not a provider config.** `isProjectionEnabled()` consults `COMMUNICATION_PROJECTION_ENABLED` first, then git-ignored `enablement.local.json` at the package root, and otherwise returns false. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/config/enablement.ts:9-60] The public config barrel exports only that gate. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/config/index.ts:4]

2. **The committed example is `{ "enabled": false }`.** The operator must flip one boolean. There is no model, endpoint, family, or judge field. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/enablement.local.json.example:1-3] `.gitignore` already ignores `enablement.local.json`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/.gitignore:4]

3. **Env wins over file for on/off, which is the right CI/kill-switch shape.** A set variable always wins, including `0`/`false`/`off` to force a machine off even when the local file opts in. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/docs/enablement.md:26-62] [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/config/enablement.ts:29-33]

4. **There is no provider-config loader anywhere in the package.** The only `readFileSync` on a live config path is `enablement.ts`. Grep for `COMMUNICATION_PROJECTION_*` hits only the enablement env var plus test fixtures. No `provider.local.json`, no `OLLAMA_HOST` reader, no LM Studio env. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/config/enablement.ts:36-45]

5. **Turning enablement on today still yields a guaranteed no-op at both entry points.** The plugin hard-codes `candidateProviderIds: []`, `judgeMode: 'disabled'`, `POLICY.allowedPrivacyClasses: []`, and `PROMPT.systemInstruction: ''`. [SOURCE: file:.opencode/plugins/mk-communication-projection.js:44-61] [SOURCE: file:.opencode/plugins/mk-communication-projection.js:254-258] Empty `candidateProviderIds` or empty `allowedPrivacyClasses` is `invalid-input` in the privacy router, before any transport. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/privacy/router.ts:252-270] The wrapper bin never calls `runWrapperProjection`; after a successful parse it writes the captured bytes through. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/bin/cli-output-wrapper.mjs:106-115]

6. **Docs already teach a one-file local opt-in.** Enablement docs tell the operator to set the env var or drop the git-ignored file, then "Launch OpenCode and send a message" — implying auto-activation after that one step, which the empty plugin config falsifies. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/docs/enablement.md:90-97]

7. **Ranked config-surface options (this iteration's design slice):**

   | Rank | Surface | Operator writes once | Auditable | Reuses shipped path | Failure if missing |
   |------|---------|----------------------|-----------|---------------------|--------------------|
   | 1 | Extend `enablement.local.json` with a `localProvider` object; keep env as on/off override | One git-ignored file already in the docs | File is inspectable; example stays committed | Same path, same gitignore, same env kill-switch | Malformed/absent provider block → exact-original; `enabled: true` alone is not enough |
   | 2 | Dual: file as source of truth, optional `COMMUNICATION_PROJECTION_LOCAL_{KIND,MODEL,ENDPOINT}` overlays | File for the common case; env for ephemeral overrides | File remains the audit copy | Env overlay matches existing "env wins" habit | Env-only without file is allowed but undocumented as the primary path |
   | 3 | Separate `provider.local.json` plus keep enablement boolean | Two files | Yes | New discovery path | Two-step setup violates "no further manual steps" if enablement stays a second toggle |
   | 4 | Env-only (`OLLAMA_HOST` / `LM_STUDIO_BASE_URL`) | Export in shell profile | Poor (not a file an operator can `cat` next to the package) | No existing reader | Easy to forget; not git-ignored-example-shaped |

## Questions Answered

- Q1 (answered): The simplest auditable surface is one git-ignored JSON file already used for enablement. Extend it rather than invent a second file or an env-only scheme. Env stays the force-on / force-off overlay, not the place the model name lives.

## Questions Remaining

- Q2: How a discovered `{ kind, model, endpoint? }` auto-constructs a valid `ProviderModelRecord` for Ollama and LM Studio given the family/protocol lock in the registry.
- Q3: Judge default for local accepts vs hosted reject-only.
- Q4: Local-only privacy policy construction.
- Q5: Shared loader so plugin and wrapper pick the same constructed config up, including the empty `systemInstruction` gap.

## Next Focus

Automatic provider-record construction from a discovered local endpoint: Ollama native vs LM Studio OpenAI-compatible, mapped onto `createOllamaModelRecord` / `createLlamaCppModelRecord` and the registry family/protocol lock.

## Assessment

- newInfoRatio: 0.92
- noveltyJustification: First pass over the live config API; confirmed there is no provider discovery at all, and that enablement-on is still a no-op because the plugin and wrapper never load a provider.
- Confidence: High (primary files and grep inventory).

## Reflection

What worked: treating enablement and provider-config as two different shipped surfaces, then checking whether any third loader existed.
What failed: assuming `docs/configuration.md` already described a local endpoint file — it only describes privacy modes and a doctor script that constructs records in code.
Ruled out: env-only as the primary operator UX; a second `provider.local.json` as the default (extra step unless enablement is implied by the provider file, which then duplicates the existing file).

## Dead Ends

- Env-only primary config: not auditable, no committed example, no existing reader, easy to leak into shared shells.
- Auto-probe of `127.0.0.1:{11434,1234,8080}` with no file: violates default-off and can send message content to whichever local server happens to be up.

## Ruled Out

- Env-only as the one-time setup.
- Silent localhost port scanning as "zero-config."
- Requiring a full hand-authored `ProviderModelRecord` JSON (doctor script shape) as the minimal UX.
