# Iteration 5: Plugin and wrapper auto-pickup plus ranked recommendation

## Focus

Design how both shipped entry points automatically consume the one-file local config after the one-time write, reconciled with default-off enablement. Rank the full design against the four grounding gaps and name a first choice.

## Actions Taken

- Re-read plugin `createProjectionCore` / `createProjectionInput` and hook gate order.
- Re-read `bin/cli-output-wrapper.mjs` parse path vs `src/wrapper/run.ts` `runWrapperProjection`.
- Re-read `src/wrapper/types.ts` `WrapperProjectionConfig`.
- Re-read plugin `PROMPT` (empty `systemInstruction`) vs test helper prompts.
- Re-read `docs/enablement.md` plugin and wrapper setup steps.
- Synthesize Q1–Q4 into a ranked recommendation.

## Findings

1. **Plugin activation order is already correct for auto-pickup.** `hookEnabled()` then `isProjectionEnabled()` then `projectMessage(createProjectionInput(...))`. [SOURCE: file:.opencode/plugins/mk-communication-projection.js:291-295] Auto-use means `createProjectionInput` must stop hard-coding empty provider fields and instead call a shared loader. If the loader returns "no valid local provider", keep today's fail-open: do not throw, leave original parts. [SOURCE: file:.opencode/plugins/mk-communication-projection.js:277-282]

2. **The wrapper library already accepts the full config object; the bin never supplies it.** `runWrapperProjection` forwards `config.records`, `candidateProviderIds`, `policy`, `judgeMode`, optional `transport`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/wrapper/run.ts:47-61] [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/wrapper/types.ts:48-59] The bin, after a successful parse, explicitly passes bytes through because "projection config is caller-supplied." [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/bin/cli-output-wrapper.mjs:106-115] Easy-config auto-pickup for wrapper is: bin calls the same loader and, when a valid local provider exists and enablement is on, calls `runWrapperProjection` / `projectRuntimeStream` instead of writing `capturedText`.

3. **Empty `systemInstruction` is a third independent no-op even after providers are wired.** Plugin `PROMPT.systemInstruction` is `''`. [SOURCE: file:.opencode/plugins/mk-communication-projection.js:50-60] Adapters send that string as the system message. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts:96-100] Tests that actually project use a real instruction: `'Rewrite only the user message in plain English. Output only the rewrite.'` [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/test/providers/helpers.ts:118] The loader (or a shipped local prompt profile constant) must supply that instruction. Do not ask the operator to write a prompt in the easy-config file.

4. **Default-off stays the outer gate.** Enablement file `enabled: true` OR env `COMMUNICATION_PROJECTION_ENABLED=1|true|on` remains required. A `localProvider` block with `enabled: false` / missing enabled must not project. Env `0`/`false`/`off` still kills projection even if the file has a provider. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/config/enablement.ts:25-34] One-time setup is: write the git-ignored file with `enabled: true` and `localProvider`. That is the opt-in. No second plugin flag, no wrapper CLI flag.

5. **Shared loader location.** New module under `src/config/` (the barrel currently exports only enablement) so both the plugin (which already imports `dist/index.js`) and the wrapper bin can call one function, e.g. `loadLocalProjectionConfig(): LocalProjectionConfig | null`. Null means exact-original. Construction uses iteration-2 presets, iteration-3 `judgeMode: 'required'`, iteration-4 local-only policy, and a shipped copy-editing prompt. Optional `transport` omitted so `projectMessage` uses `createDefaultProviderTransport()`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/runtime/project-message.ts:177]

6. **Recommended operator file (minimal):**

   ```json
   {
     "enabled": true,
     "localProvider": {
       "kind": "ollama",
       "model": "llama3.2"
     }
   }
   ```

   LM Studio variant: `"kind": "lmstudio", "model": "<loaded-model-id>"` (endpoint defaults to `http://127.0.0.1:1234/v1/chat/completions`). Optional `"endpoint"` override. No privacy, judge, prompt, or credential fields.

7. **Precedence.** (1) Enablement env force-off → stop. (2) Enablement env force-on or file `enabled: true`. (3) File `localProvider` is the provider source of truth. (4) Optional env overlays `COMMUNICATION_PROJECTION_LOCAL_KIND|MODEL|ENDPOINT` may override file fields for ephemeral runs but are not the documented primary UX (iteration 1). (5) Missing/malformed provider → null config → exact-original. (6) Both Ollama and LM Studio in one file: forbid two kinds; one `localProvider` object only. If both products are running, the operator picks one kind.

8. **Doctor remains optional.** `docs/configuration.md` doctor script is the expert/pre-release path, not the one-time setup. Easy-config must not require running the doctor before first projection. Unreachable local endpoint already fails closed to exact-original.

## Ranked design recommendation

| Rank | Option | What the operator does once | How auto-activation works | Trade-off |
|------|--------|-----------------------------|---------------------------|-----------|
| **1 (first choice)** | **Single git-ignored `enablement.local.json` extended with `localProvider: { kind, model, endpoint? }` + shared `src/config` loader used by plugin `createProjectionInput` and wrapper bin** | Write the file (or copy the example and fill kind+model). Restart the CLI. | Enablement already true; loader builds record/policy/judge/prompt; plugin and wrapper call it on every message with no flags | Reuses shipped enablement path, gitignore, env kill-switch, presets, local transport, reject-only judge. LM Studio rides llama-cpp family (naming smell, not a wire gap). |
| 2 | Dual file+env overlays (`COMMUNICATION_PROJECTION_LOCAL_*`) on top of option 1 | Same file; env optional | Identical loader, env fields overlay | Slightly more surface; useful for CI; not needed for the person-at-desk story |
| 3 | Separate `provider.local.json` plus keep enablement boolean | Two files | Loader reads both | Extra step; easy to enable without a provider (today's no-op) or vice versa |
| 4 | Env-only kind/model/endpoint | Shell profile exports | Loader reads env | Not auditable; no committed example; easy to leak |
| 5 | Auto-probe loopback ports with zero file | Nothing | First open local server wins | Violates default-off; may send content to an unexpected process |

## Mapping onto the four grounding gaps

1. **Empty plugin provider config** — loader fills `records`, `candidateProviderIds`, `policy`, `judgeMode: 'required'`, and a real `systemInstruction`. Empty arrays remain the fail-closed fallback when the loader returns null.
2. **Reject-only judge** — keep it; set `judgeMode: 'required'` so good local rewrites accept (coverage >= 0.5) and meaning-loss still returns exact-original. No new judge.
3. **No pre-wired entry point** — plugin `createProjectionInput` and wrapper bin both call the same loader; wrapper bin stops being parse-then-passthrough when a valid local provider exists.
4. **Transport and adapters already exist** — `createOllamaModelRecord` / `createLlamaCppModelRecord` + `createDefaultProviderTransport` (`none:` → local HTTP). No network-layer work.

## Questions Answered

- Q5 (answered): One shared config loader behind the existing enablement gate. Plugin and wrapper consume it automatically. Empty prompt must be filled by a shipped local profile, not by the operator.
- Q1–Q4 carried forward as the ranked first choice above.

## Next Focus

None in this lineage — max-iterations stop. Parent merge with the cli-devin lineage synthesizes the canonical `research/research.md`.

## Assessment

- newInfoRatio: 0.55
- noveltyJustification: New evidence is the wrapper bin's explicit non-call of runWrapperProjection and the empty systemInstruction as a third no-op; the ranked table consolidates Q1–Q5.
- Confidence: High.

## Reflection

What worked: treating plugin, wrapper bin, and wrapper library as three different seams (only the first two are unwired).
What failed: none.
Ruled out: requiring a wrapper CLI flag; requiring doctor before first use; two-file setup as the default.

## Dead Ends

- Document-only "pass config at the embedding boundary" without changing the bin — that leaves the shipped entry point unwired.
- Asking operators to set `PROMPT.systemInstruction` in the JSON file.

## Ruled Out

- Options 3–5 as the recommended default.
- Mixed local+hosted auto-pickup from the same easy-config file.
