# Iteration 4: Local-only privacy defaults

## Focus

Design the privacy policy the easy-config loader must attach so local-classified content stays on the local endpoint, never cascades to a hosted service, and fails closed when the operator also has a hosted record nearby.

## Actions Taken

- Read `src/privacy/types.ts` (`PrivacyRoutePolicy`).
- Read `src/privacy/router.ts` `evaluateRecord`, `validateInput`, hosted `egressConsent`, `preservePrivacyClass`.
- Read `docs/privacy.md` and `docs/configuration.md` mode table.
- Read `test/providers/privacy.test.ts` hosted-deny-before-ranker.
- Read preset `noFallback()` and `localProvider` privacyClass handling.

## Findings

1. **Policy shape is three fields.** `allowedPrivacyClasses`, `egressConsent`, `requiredKnownFacts`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/privacy/types.ts:29-34] Empty `allowedPrivacyClasses` is invalid input (same as empty candidates). [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/privacy/router.ts:263-264]

2. **The plugin's frozen empty policy is an independent no-op.** `allowedPrivacyClasses: []`, `egressConsent: false`. [SOURCE: file:.opencode/plugins/mk-communication-projection.js:44-48] Even if `candidateProviderIds` were filled, every class would be `privacy-class-not-allowed` or the input would fail validation first.

3. **Documented local-only mode already matches the easy-config need.** Local-only: local endpoints only, `egressConsent: false`, fallback `none`. Allow `local-offline` and, when required, `local-networked`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/docs/privacy.md:11-16] [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/docs/configuration.md:10]

4. **Hosted is denied before the ranker when egress is false.** `deploymentMode === 'hosted' && !egressConsent` → `egress-not-consented`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/privacy/router.ts:157-164] Tests assert the ranker is not invoked. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/test/providers/privacy.test.ts:25-40] Easy-config therefore does not need a second "block hosted" flag: `egressConsent: false` is sufficient even if a hosted record is accidentally present in `records`.

5. **Fallback cannot invent a hosted hop.** Presets set `fallbackPolicy: { mode: 'none', providerIds: [], preservePrivacyClass: true }`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts:181-183] Ranking never creates a fallback; only `explicit-list` can, and then `preservePrivacyClass` still blocks a class change. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/privacy/router.ts:76-108] [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/docs/configuration.md:17]

6. **Recommended loader-built local policy (not operator-authored):**

   ```
   allowedPrivacyClasses: ['local-offline']           // default
   + 'local-networked' only if parsed endpoint host is non-loopback
   egressConsent: false
   requiredKnownFacts: []
   ```

   Loopback hosts (`127.0.0.1`, `localhost`, `::1`) → `local-offline`. Any other host → `local-networked` still with `egressConsent: false` (LAN is not hosted, but it is not offline). Never add `hosted-zdr` or `hosted-retained` because a local LLM was configured.

7. **If both a local easy-config and a hosted record appear, local-only policy wins for this activation path.** Candidate list the loader emits is only the constructed local provider id. Do not merge in Go/hosted presets. Mixed mode is an explicit later operator choice (`egressConsent: true` + named hosted candidates), not a default. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/docs/privacy.md:30-37]

8. **Fail closed, never hang, never partial rewrite.** Missing file, malformed JSON, unknown kind, unreachable endpoint, privacy deny, provider error, or judge reject all already return exact-original from `projectMessage`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/runtime/project-message.ts:105-109] Easy-config must not add a hosted fallback on local timeout.

9. **Credentials stay references, never values.** Local presets use `none:local`. The transport does not attach Authorization. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/transports/http.ts:72-78] The file must not accept a pasted API key. If an operator later adds a hosted provider, only `env:` / `keychain:` / `managed:` references are valid on the Go preset. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts:25-29]

## Questions Answered

- Q4 (answered): Loader emits a local-only policy (`local-offline` ± `local-networked`, `egressConsent: false`, no required hosted facts) and a single local candidate with `fallbackPolicy.mode: 'none'`. Hosted cascade is already impossible under that policy. Operator does not write privacy fields.

## Questions Remaining

- Q5: How plugin and wrapper auto-pick-up this constructed `{ records, candidateProviderIds, policy, judgeMode, prompt }` while keeping default-off.

## Next Focus

Plugin and wrapper auto-pickup: shared discovery module, enablement coupling, empty `systemInstruction`, wrapper bin currently skipping `runWrapperProjection`.

## Assessment

- newInfoRatio: 0.62
- noveltyJustification: New evidence is that empty allowedPrivacyClasses is a second independent plugin no-op, and that egressConsent false already blocks hosted even if a hosted record is present.
- Confidence: High.

## Reflection

What worked: mapping each easy-config privacy requirement onto an existing router reason code instead of inventing a new policy type.
What failed: none for this angle.
Ruled out: mixed-mode as the easy-config default; operator-authored `allowedPrivacyClasses`; hosted fallback on local timeout.

## Dead Ends

- Teaching the operator to fill `PrivacyRoutePolicy` by hand.
- Default mixed policy that lists local then hosted.

## Ruled Out

- `egressConsent: true` as part of local easy-config.
- Merging OpenCode Go into the candidate list because enablement is on.
