# Iteration 001: All-dimension breadth pass — declared-wire-format gate, affinity relocation, and probe evidence

## Focus

Dimensions: correctness, security, traceability, maintainability (single-pass breadth; `maxIterations: 1`).
Scope: the committed change `80576ef8aa` (`.pi/extensions/pi-cache-optimizer/index.ts`, its tests, `.pi/models.json`) plus the packet's own claims, probes and check evidence.

Reviewed surfaces (read-only):

| Surface | What was read |
|---|---|
| `.pi/extensions/pi-cache-optimizer/index.ts` | 1487-1526, 1622-1634, 2681-2758, 2918-3110, 4053-4111, 5086-5130, 5310-5400, 5625-5718, 5895-5930, 6033-6063, 6700-6820, 6890-6990, 7010-7130, 7285-7325, 8554-8640, 9177-9179 |
| `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` | 1110-1203 (DeepSeek classification), 1530-1698 (fix command) |
| `.pi/models.json` | `providers.llmgateway` (provider compat + both model entries) |
| Installed Pi runtime (read-only reference) | `pi-ai/dist/api/openai-completions.js` (`detectCompat`, compat merge), `dist/core/provider-composer.js` (`mergeCompat`) |
| Packet | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `scratch/*`, `review/{brief.md,change-under-review.diff}` |

Runtime identity of this pass: `cli-pi`, model `deepseek-v4.1-flash`, session `fanout-deepseek-v41-flash-1789146937931-6gxjep`, generation 1.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 12
- New findings: P0=0 P1=1 P2=5
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.62

## Findings

### P0, Blocker

None. No confirmed correctness failure, security vulnerability, or spec contradiction survived the adversarial self-check.

### P1, Required

- **F001** [P1] [correctness] **The chat-level session-affinity advisory is dropped for every DeepSeek-named channel, and no adapter fallback exists to recover it.**
  - Evidence: `index.ts:3097-3105` — the DeepSeek adapter's `warningText` returns `undefined` when `isDeepSeekCompatCheckApplicable(model)` is false, and otherwise computes its message from `describeMissingDeepSeekCompat(model)`, which since the change can only contain `requiresReasoningContentOnAssistantMessages` (`index.ts:2960-2969`). Session affinity was moved out of that list into the generic path (`index.ts:3002-3010`), but the generic text never reaches this surface: `notifyCacheCompatIfNeeded` consults exactly one adapter — `selectAdapterForModel` is a first-match `.find` (`index.ts:4053-4055`) and the DeepSeek adapter is first in `CACHE_PROVIDER_ADAPTERS` (`index.ts:3085-3107`) — then returns early when its `warningText` is empty (`index.ts:4102-4104`). `model_select` is the only automatic surface (`index.ts:9177-9179`); `describeMissingCacheCompatForModel` is reached only from operator-invoked surfaces — `/cache-optimizer compat|doctor|fix` (`index.ts:5631-5643`, `5899-5913`, `9799-9805`), the router/channel notes it feeds (`index.ts:5295`, inside `describeRouterChannelDiagnostics`, itself called from `buildCompatDiagnosis`), and the command's text-help fallback (`index.ts:10599`). No hook path calls it.
  - Consequences, both verified: (a) an **opted-in** DeepSeek channel that also lacks `sendSessionAffinityHeaders` gets a launch warning that omits the affinity advisory entirely — `appendDeepSeekCompatAdviceLines` still contains the affinity branch (`index.ts:3045-3049`) but the adapter can no longer reach it with affinity in `missing`; (b) an **unopted** DeepSeek channel gets no chat warning at all, while the diagnosis surfaces still report `["sendSessionAffinityHeaders"]` for it — `scratch/verify-no-warning.txt` (`### control C … full diagnosis missing : ["sendSessionAffinityHeaders"]` next to `chat warnings=0 expected=0`).
  - Why it matters: the affinity rule is not DeepSeek-specific, and the change's own decision table asserts the opposite outcome — "Compose rather than early-return in `describeMissingCacheCompatForModel()` … an early return would silently drop affinity advice for opted-in channels" (`implementation-summary.md:93`). The composition was implemented in the wrong function: the surface that actually renders advice for DeepSeek-named models is the adapter `warningText`, which still uses the narrower list. Pre-change that warning listed affinity for every DeepSeek-named completions channel with an undeclared flag (`review/change-under-review.diff`, removed hunks at index.ts old lines 2939-2971).
  - What I would do instead: in the DeepSeek adapter's `warningText`, fall back to the generic proxy warning when the DeepSeek gate is off, and build the opted-in message from `describeMissingCacheCompatForModel(model)` (or append the generic entries) so affinity both survives and can be truthfully suggested on that surface. Full remediation detail in `review-report.md`.

```json
{
  "findingId": "F001",
  "claim": "The chat-level (model_select) warning for a DeepSeek-named channel can no longer mention an undeclared sendSessionAffinityHeaders, because the DeepSeek adapter renders only the DeepSeek-specific missing list and the notification path consults no fallback adapter.",
  "evidenceRefs": [
    ".pi/extensions/pi-cache-optimizer/index.ts:3097-3105",
    ".pi/extensions/pi-cache-optimizer/index.ts:2960-2969",
    ".pi/extensions/pi-cache-optimizer/index.ts:4053-4055",
    ".pi/extensions/pi-cache-optimizer/index.ts:4102-4104",
    ".pi/extensions/pi-cache-optimizer/index.ts:4085-4107",
    "specs/hooks/021-compat-opt-in-and-image-declaration/scratch/verify-no-warning.txt"
  ],
  "counterevidenceSought": "Searched for a fallback adapter chain (none: selectAdapterForModel is a first-match .find at index.ts:4053-4055 and notifyCacheCompatIfNeeded returns on empty text at 4104); for a second automatic surface (grep for setInterval returned none; the only other buildCompatDiagnosis callers are the /cache-optimizer compat|doctor handlers at index.ts:9799, 9867, 10308); and for a generic adapter that could match a DeepSeek-named model (isOpenAIFamilyToken matches only gpt-/chatgpt/reasoning-series tokens, index.ts:1622-1629, so the generic 'openai' adapter does not match a deepseek id). Also compared against the pre-change warning, which rendered the affinity line from the DeepSeek branch.",
  "alternativeExplanation": "The behaviour could be intended: the opt-in doctrine deliberately silences DeepSeek-specific advice, and implementation-summary.md limitation 6 discloses that an unopted channel gets no chat warning at all, with doctor/compat as the compensating surface. Rejected as an explanation for the affinity clause: affinity is a generic rule that the change moved rather than removed, the composed list is what the plan promised to feed to advice consumers, and no limitation entry mentions that an opted-in channel's own warning omits affinity.",
  "finalSeverity": "P1",
  "confidence": 0.72,
  "downgradeTrigger": "If the maintainers declare /cache-optimizer compat|doctor the canonical affinity surface for DeepSeek-named channels and accept the chat-surface silence as intended, downgrade to P2 documentation-of-tradeoff; the finding is also discharged outright by adding a generic fallback warning in the DeepSeek adapter.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery; verified against the adapter chain and the harness control C output" }
  ]
}
```

### P2, Suggestion

- **F002** [P2] [traceability] **One of the four new gate tests does not fail against the pre-change code, so REQ-006's "new tests fail against the pre-patch behavior" holds for three of four.**
  - Evidence: `tests/review-findings.test.ts:1138-1149` (`an explicit wire-format opt-in re-enables the DeepSeek reasoning check`) asserts `isDeepSeekCompatCheckApplicable === true` and `describeMissingDeepSeekCompat === ['requiresReasoningContentOnAssistantMessages']` for `{api:'openai-completions', compat:{thinkingFormat:'deepseek', sendSessionAffinityHeaders:true}}`. Against the removed implementation the same inputs produce the same result: affinity is skipped because it is `true` (`change-under-review.diff`, old `model.api !== 'openai-responses' && compat.sendSessionAffinityHeaders !== true`), reasoning is pushed because it is `undefined`, and `thinkingFormat` is skipped because it already equals `'deepseek'`. By contrast `:1122-1136`, `:1151-1167`, `:1169-1173` and the fix-command assertion `:1651-1662` all fail pre-patch (name-alone gate, manufactured flag in suggestion + warning text, affinity `false` reported missing, and `resolveExplicitCompatValue(..., 'thinkingFormat')` returning `{source:'modelOverride', value:'deepseek'}` after `/cache-optimizer fix`).
  - Why it matters: REQ-006 is the packet's regression-coverage claim, and the test that carries the "opt-in still warns" burden cannot distinguish the two implementations — it is a preserved-behaviour pin, not a regression test. The Summary's wording ("includes the 4 new gate tests", `implementation-summary.md:106`) invites reading all four as discriminating.
  - What I would do instead: keep the test, but state its role in the test name or a comment as a pin of preserved behaviour, and reword REQ-006 to name the three tests that actually discriminate against the removed predicate.

- **F003** [P2] [maintainability] **The predicate no longer matches its documented shape, and `thinkingFormat` survives in placement and repair code that can never receive it.**
  - Evidence: (a) `plan.md` §3 describes the predicate as true "only for a `deepseek`-named model on a non-official OpenAI-compatible proxy", but `index.ts:2987-2990` omits the `isOfficialOpenAIBaseUrl(model)` bypass that the generic path applies at `index.ts:2707`; the divergence is reachable only through a self-contradictory config (DeepSeek-named model on `api.openai.com` that also declares `thinkingFormat: "deepseek"`), so impact is documentation drift, not behaviour. (b) `index.ts:6962-6968` still special-cases `thinkingFormat` alongside `requiresReasoningContentOnAssistantMessages` in `decideFixPlacement`, but no write path can put `thinkingFormat` into `compatKeys` any more (`index.ts:3013-3027`, `5899-5913`; grep for the literal across `index.ts` returns only the type declaration at `:260`, the gate at `:2989`, and four comment/branch sites). The same stale assumption appears in comments at `index.ts:6921-6924`, `7031-7034`, `7087-7089` and `7310-7313`, which still describe `thinkingFormat: "legacy" -> "deepseek"` repairs.
  - Why it matters: the branch and comments encode a doctrine the change removed; the next reader will assume `thinkingFormat` is still a repairable model-behaviour key, and a future `compatKeys` producer would silently inherit a placement rule whose DeepSeek half is untested (`PROVIDER_LEVEL_SAFE_COMPAT_KEYS` at `index.ts:6903-6906` already lists only the two channel-capability keys).
  - What I would do instead: drop `thinkingFormat` from the `decideFixPlacement` condition and the four comments (or replace them with a note that the fix never writes the wire-format key), and align `plan.md`'s predicate description with the implemented gate.

- **F004** [P2] [traceability] **The affinity probe licenses less than the packet claims: only the response body is committed, the request side is unevidenced, and a provider-level declaration was proven on one of two models.**
  - Evidence: `scratch/live-affinity-probe.md` asserts "the probe sends exactly the three headers Pi would send", but the committed artifact `scratch/live-affinity-probe.json` is a gateway response containing no request echo (no headers, no `session_id` field; it carries `used_provider: "deepseek"` and routing metadata only). The same response would come back if the headers had never been sent, so the artifact supports "the endpoint answered 200", not "the endpoint accepts the affinity headers". No probe script is committed in `scratch/` (only `verify-no-warning.mjs`), so a reviewer cannot re-derive the request. The declaration is provider-level (`models.json` `providers.llmgateway.compat`, applied to `deepseek-v4.1-flash` and `glm-5.3-flash` — verified with `provider-composer.js:76,105`, shallow `mergeCompat`), while the probe exercised one model and the harness only checks that `glm-5.3-flash` stops warning, not that the second model's live request succeeds.
  - Why it matters: REQ-004's acceptance criterion is "a request through the channel still returns 200 with the headers enabled" — the criterion is stated in exactly the form the artifact cannot show. The risk the spec itself rated ("the proxy or its WAF rejects custom affinity headers with 403", `spec.md` §6) is the one the current evidence cannot rule out.
  - What I would do instead: commit the probe command/script, and re-probe with a request-side assertion (e.g. the gateway echoing a header, or sending the headers alongside a value the endpoint validates); state in the probe md that the artifact is acceptance-not-proof, as `live-image-probe.md` already does for its own limits.

- **F005** [P2] [security] **The committed probe responses embed third-party account metadata, including a hash of the API key.**
  - Evidence: `scratch/live-affinity-probe.json` carries `apiKeyHash: "c4b0f8a8…"`, `organization_id`, `project_id`, `log_id`, and per-route provider metadata; `scratch/live-image-probe.json` carries the same shapes. No credential value is exposed (the key itself is not present, the hash is of the key), and the probe md files correctly avoid printing secrets.
  - Why it matters: these are third-party account identifiers and a key-derived digest committed into a repository packet; a digest removes the need for an attacker to guess which of several keys was used, and the org/project ids are stable account handles. This is an advisory finding, not a suspected active exposure.
  - What I would do instead: trim the response JSON to the fields the claim needs (`choices[0].message.content`, `usage`, `model`), or record the metadata as a note in the md rather than the raw body.

- **F006** [P2] [traceability] **The packet is complete by its own account and simultaneously carries an unchecked Definition of Done.**
  - Evidence: `plan.md` §2 `Definition of Done` keeps four unchecked boxes (`[ ] All acceptance criteria met`, `[ ] npm run check green`, `[ ] Live image and affinity requests recorded`, `[ ] Docs updated`) while `spec.md` §1 records `Status: Complete`, `tasks.md` marks T001–T013 `[x]` with "All tasks marked `[x]`", and `implementation-summary.md` reports completion. `checklist_evidence` is a core (hard-gate) protocol for this target type, so the packet's own evidence rows should not disagree.
  - Why it matters: the contradiction is exactly the class of claim the checklist-evidence protocol exists to catch, and this review's `checklist_evidence` verdict is partial on this basis (Level 1 packets have no `checklist.md`, so `plan.md`'s DoD is the only checklist surface present).
  - What I would do instead: check the four boxes with their evidence, or delete the block if it is not the packet's gate surface.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | pass | hard | `index.ts:2987-2995` vs `spec.md` REQ-001; `index.ts:3013-3027` + `tests/review-findings.test.ts:1151-1167,1651-1662` vs REQ-002; `index.ts:2710-2718` + `tests:1169-1173` vs REQ-003; `.pi/models.json` provider compat vs REQ-004; model `input` vs REQ-005 | REQ-001–REQ-005 all resolve to shipped behaviour. REQ-004's acceptance criterion is under-evidenced (F004), which is an evidence gap for the requirement, not a contradiction: the declaration exists and is effective. |
| `checklist_evidence` | partial | hard | `plan.md` §2 (four unchecked boxes) vs `spec.md` §1 `Status: Complete`, `tasks.md` T001–T013, `implementation-summary.md:105-115` | F006; REQ-006's wording also overstates the four new tests (F002). |
| `skill_agent` | notApplicable | advisory | review target is a spec folder; no skill package in scope | — |
| `agent_cross_runtime` | notApplicable | advisory | no agent definition in scope | — |
| `feature_catalog_code` | notApplicable | advisory | no feature-catalog entry references this extension surface in the packet | — |
| `playbook_capability` | notApplicable | advisory | no playbook scenario in the packet | — |

## Claim-by-Claim (brief `review/brief.md`, CLAIM-1…CLAIM-7)

| Claim | Verdict | Evidence |
|---|---|---|
| 1. DeepSeek advice requires an explicit effective `compat.thinkingFormat: "deepseek"` | **confirmed** | `index.ts:2987-2995`; `tests:1122-1149`. The gate composes family name + `openai-completions` + non-llama.cpp + declared flag. |
| 2. `thinkingFormat` is never reported missing, suggested, or written by `/cache-optimizer fix` | **confirmed** | `index.ts:2960-2969` (not in the missing list), `3013-3027` (not in the suggestion), `5899-5913` (fix write-set); grep shows the literal only at `:260` (type) and `:2989` (gate) plus comments; `tests:1651-1662` asserts the key stays absent after `fix`. |
| 3. Affinity keeps its explicit-`false` opt-out; moving it to the generic path loses no advice for an opted-in channel | **partly confirmed** | Opt-out: confirmed (`index.ts:2710-2718`, `tests:1169-1173`). "Loses no advice": **not confirmed** on the chat surface (F001); confirmed on the diagnosis and fix surfaces (`index.ts:3002-3010`, `5631-5643`, `5899-5913`). |
| 4. Updated tests are non-vacuous and fail pre-change | **partly confirmed** | Three of four gate tests plus the fix-command assertion discriminate against the removed code; `tests:1138-1149` produces the same result pre-change (F002). |
| 5. `models.json` declares provider affinity + model image input, both proven live | **confirmed for the declarations; partly for the affinity proof** | Declarations verified in `.pi/models.json` and effective through `provider-composer.js:76,105`. Image proof independently corroborated (this pass OCR'd the committed PNG and colour-analysed its right region). Affinity proof shows acceptance only, with an unevidenced request side (F004). |
| 6. The harness exercises the real notification path and its positive controls catch a silent detector | **partly confirmed** | Real path: confirmed (`verify-no-warning.mjs` imports the module, registers it, fires `model_select`). Controls A and B catch a silent detector; control C encodes `expected=0` for the case where the affinity advisory is lost, so the harness cannot catch F001. |
| 7. `check-run.txt` supports the full-suite claim | **confirmed** | `check-run.txt:187-190` (114 tests / 28 suites / 114 pass / 0 fail) with the four gate tests present at `:165-168`, plus typecheck, `git diff --check` and `npm pack --dry-run` sections. |

## Assessment

- New findings ratio: 0.62 (severity-weighted: one P1 plus five P2 over a first-pass, high-evidence review; no refinements carried forward).
- Dimensions addressed: correctness, security, traceability, maintainability.
- Novelty justification: the review opened with the brief's adversarial questions, then widened to the surfaces the change did not touch but that consume it — adapter selection and notification aggregation (`index.ts:4053-4111`), `plan.md`'s decision table, `implementation-summary.md`'s limitations, and the installed Pi runtime that consumes the compat keys (`openai-completions.js`, `provider-composer.js`). Findings F001, F004 and F006 are not visible from the diff alone; F002 and F003 require reading the removed implementation against the new tests.
- Adversarial self-check on the P1: F001 was re-read at its two cited sites plus the whole adapter chain before recording, and the strongest counter-argument (intended silence + `implementation-summary.md` limitation 6 + doctor as compensating surface) is recorded in the claim packet with the reason it does not discharge the affinity clause.

## Ruled Out

- **`thinkingFormat` still reaches `models.json` through some path**: ruled out. Grep of `index.ts` shows the literal only in the type declaration, the gate, the dead placement branch and comments; the fix test asserts absence after running `/cache-optimizer fix` against a DeepSeek-named model (`tests:1651-1662`); the 403 repair path writes only `sendSessionAffinityHeaders: false` (`index.ts:8619-8621`). Evidence: `index.ts:260,2989,6922,6962,7033,7089,7311`.
- **The gate under-reports for an opted-in `openai-responses` channel**: ruled out. In the installed `@earendil-works/pi-ai`, `thinkingFormat` and `requiresReasoningContentOnAssistantMessages` are consumed only by `dist/api/openai-completions.js` (grep across `dist/api/` returns no other module), so restricting the gate to `openai-completions` matches the consumer set. Evidence: `pi-ai/dist/api/openai-completions.js:681,1337-1339`.
- **Gating the flags breaks channels that genuinely need DeepSeek reasoning replay**: ruled out. `detectCompat` already derives `thinkingFormat: "deepseek"` and `requiresReasoningContentOnAssistantMessages: true` from `provider === "deepseek" || baseUrl.includes("deepseek.com")` and merges them with declared compat (`model.compat.X ?? detected.X`), so a channel that needs the wire format either declares it (gate opens) or is auto-detected by the runtime. Evidence: `pi-ai/dist/api/openai-completions.js:1250,1287-1288,1324-1339`.
- **The image declaration is unsupported by its probe**: ruled out. The committed `scratch/vision-probe.png` is 720x300 RGB; an independent OCR pass reads the probe lines (`CODE KX-4471`, `SEVEN ORANGE KITES`, `PI VISION …`) and a colour analysis of its right region returns `#ff0000` 5.7% and `#000000` 4.6% on white, matching the documented "red ellipse inside a black square". The model's answer transcribes all three lines and names the red shape. Evidence: `scratch/vision-probe.png`, `scratch/live-image-probe.md`, `scratch/live-image-probe.json`.
- **Provider-level affinity compat is inert in Pi**: ruled out. `provider-composer.js:5-20,76,105` merges provider compat into each model with the model/override winning, which is the same contract `getCompat` documents (`index.ts:1250-1266`).

## Dead Ends

- Attempting to attribute the chat-silence to `isOpenAIFamilyModel`/adapter ordering: the DeepSeek adapter is first (`.find`), so ordering is not the cause; the cause is the missing fallback.
- Looking for a second automatic notification surface: `model_select` (`index.ts:9177-9179`) is the only one; no interval or footer path re-runs the compat check.

## Recommended Next Focus

Iteration not available (`maxIterations: 1`, cap reached). The remediation lanes in `review-report.md` carry the next work: (1) restore a generic affinity advisory on the chat surface for DeepSeek-named channels (F001); (2) tighten the packet's evidence claims (F002, F004, F006); (3) remove the stale wire-format doctrine from placement and repair code (F003); (4) trim the committed probe metadata (F005). A follow-up review pass should also close the two verification items this lineage could not perform: `validate.sh --strict` on the packet and a re-probe of the affinity headers with request-side evidence.

Review verdict: CONDITIONAL
