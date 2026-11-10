# Iteration 001 — Correctness (inventory pass + deep pass)

Lineage: glm-53-flash · session fanout-glm-53-flash-1789146937931-6gxjep · iteration 1 of 1 · focus: correctness (risk-ordered queue head)

## Dimension

Correctness — logic, behavior, error handling. Per the brief (`review/brief.md`): an adversarial pass over commit 80576ef8aa, judging its seven claims, its specific questions (applicability predicate, affinity relocation, the `warningText` short-circuit, leftover inconsistencies, vacuous assertions, probe trustworthiness, missing limitations), and anything else. This iteration doubles as the inventory pass; the traceability checks below were exercised inside it, but security/maintainability sign-off remains open (the iteration cap, not convergence, ends this loop).

## Files Reviewed

- `.pi/extensions/pi-cache-optimizer/index.ts` — predicates 1487-1506, generic proxy checks 2702-2754, the changed region 2960-3051 (`describeMissingDeepSeekCompat`, `isDeepSeekWireCompatApplicable`, `isDeepSeekCompatCheckApplicable`, `describeMissingCacheCompatForModel`, `buildDeepSeekCompatSuggestion`, `appendDeepSeekCompatAdviceLines`, `buildDeepSeekCompatWarningText`), the DeepSeek cache adapter 3085-3106, adapter selection/notification 4040-4111, doctor 5350-5416, fix suggestion 5888-5924, `resolveExplicitCompatValue` 6021-6092
- `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` — DeepSeek classification 1110-1203, `/cache-optimizer fix` command 1590-1698
- `.pi/models.json` — llmgateway provider 44, `compat.sendSessionAffinityHeaders` 50, `input` 57; precedent opt-ins at 9, 103, 108, 113-114
- `review/change-under-review.diff` (the reviewed change), `review/brief.md` (claims), packet docs: `spec.md` (REQ-001..008), `implementation-summary.md` (verification, limitations, continuity), `scratch/` — `verify-no-warning.mjs` + `.txt`, `check-run.txt` (164-190 + tail), `live-affinity-probe.md`, `live-image-probe.md`

Method: read the changed functions, then traced every caller of `describeMissingCacheCompatForModel` (5295, 5363, 5900 via `buildFixSuggestion`, 5519/5633 via the low-hit diagnosis), of the adapter `warningText` (single consumer: `notifyCacheCompatIfNeeded` 4102), of `appendDeepSeekCompatAdviceLines` (3076 warning text, 5392 doctor — the merged list), and of `resolveExplicitCompatValue` (6070, 6083, and the fix command's post-write assertions). Ran `grep -n thinkingFormat index.ts` to hunt leftover references. Read-only; no reviewed file touched.

## Findings by Severity

### P0 — none

No correctness failure, security vulnerability, or spec contradiction found. Seven-of-seven brief claims are supported in whole or in documented part (see Claim-by-claim); the adversarial replay of each REQ-001..007 acceptance criterion held.

### P1 — F1: passive affinity warning lost on opted-in DeepSeek channels

- **Claim:** After this change, a DeepSeek-named channel that IS opted into the wire format but lacks `compat.sendSessionAffinityHeaders` never produces the passive `model_select` compat warning — the chat notification silently drops affinity, where the pre-change code warned about it. The implementation-summary's "opted-in channels keep affinity advice" (`implementation-summary.md` "What Was Built") is true of the composed getter and the command surfaces, not of the notification surface.
- **Evidence:** [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3097-3105] — the DeepSeek adapter's `warningText` computes `missing = describeMissingDeepSeekCompat(model)`, which since this change returns only `requiresReasoningContentOnAssistantMessages` (2960-2968: affinity was deleted from that list; [SOURCE: review/change-under-review.diff:69-79]) and returns `undefined` when that sole entry is satisfied (3101). [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4053-4055] — `selectAdapterForModel` returns the FIRST adapter whose `matchesModel` holds; the `deepseek` adapter is first (3085-3089) and matches every `deepseek`-named model, so the later family adapters whose `warningText` uses `describeMissingOpenAICompatibleProxyCompat` (e.g. 4045-4049 — the surface that DOES report affinity) are unreachable for DeepSeek-named models. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4102-4104] — `notifyCacheCompatIfNeeded` notifies through exactly that one adapter; there is no second notification path (the adaptive-thinking branch at 4090-4100 is `anthropic-messages`-only). The composed truth is visible only where the composed list is read: `/cache-optimizer` (5363→5374-5378) and the fix suggestion (5900).
- **Basis:** verified — code trace, plus the harness's own control C输出 (`scratch/verify-no-warning.txt:39-43`) shows the same divergence mechanism on the not-opted-in variant: `full diagnosis missing = ["sendSessionAffinityHeaders"]` while `chat warnings=0`.
- **Claim adjudication packet (mandated for P1):** claim: as above · evidenceRefs: [`.pi/extensions/pi-cache-optimizer/index.ts:3097-3105`, `.pi/extensions/pi-cache-optimizer/index.ts:2960-2968`, `.pi/extensions/pi-cache-optimizer/index.ts:4053-4055`, `.pi/extensions/pi-cache-optimizer/index.ts:4102-4104`, `scratch/verify-no-warning.txt:39-43`] · counterevidenceSought: (a) harness control B — it proves the opted-in warning fires, but it sets `sendSessionAffinityHeaders: true`, so the affinity-missing+opted-in combination is never exercised (`scratch/verify-no-warning.mjs` `optedInDeepSeek()`); (b) alternative notifier — none, `notifyCacheCompatIfNeeded` is the only passive consumer of `warningText`; (c) doctor coverage — real, but command-surface, not passive · alternativeExplanation: intended trade, extending the documented limitation 6 (`implementation-summary.md:126-127` covers only the never-opted-in case) to opted-in channels: chat warnings carry DeepSeek-protocol issues only, affinity stays command-surface · finalSeverity: P1 · confidence: high (mechanism fully traced; the exact exercised-case gap in the harness corroborates) · downgradeTrigger: if the operator regards the `/cache-optimizer compat|doctor` coverage as sufficient and limitation 6 is extended to opted-in channels, this becomes a documented-behavior P2.
- **Why it matters / what I would do instead:** the warning is the only proactive surface; an operator who adds `thinkingFormat: "deepseek"` (per the documented opt-in) sees the reasoning-content warning, fixes it, and then silently loses the affinity nag forever — the state lives only if they later run `/cache-optimizer`. Fix: have the DeepSeek adapter's `warningText` compose (`describeMissingCacheCompatForModel`) or mark affinity as already-reported when the deepseek list is satisfied; add harness control D (opted-in, affinity-missing, replay-satisfied → expected 1 warning). Both changes are inside the changed file + harness.

### P2 — F2: opted-in DeepSeek on `openai-responses` silently loses the reasoning-replay check

- **Claim:** `isDeepSeekWireCompatApplicable` gates on `isOpenAICompatibleProxyApi` (`openai-completions` ONLY, index.ts:1504-1506), where the previous predicate accepted both compatible APIs (diff: old `isDeepSeekCompatCheckApplicable` used `isOpenAICompatibleApi`, which includes `openai-responses`). An opted-in DeepSeek channel on the Responses API now gets no reasoning-content advice at all, and no test exercises that combination (every fixture in the changed tests uses `api: 'openai-completions'`).
- **Evidence:** [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2987-2990] (the gate), [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1495-1498] (the broader predicate it replaced), [SOURCE: review/change-under-review.diff:100-103] (the substitution).
- **Basis:** verified (the behavior change); the defensibility judgment is inferred — plausibly correct, since `requiresReasoningContentOnAssistantMessages` (assistant-turn `reasoning_content` replay) is a chat-completions-adapter concept and the generic proxy list was always completions-only and Responses-irrelevant; the Responses transport replays reasoning differently. Nothing in the packet documents this narrowing.
- **Why it matters / what I would do instead:** a futureResponses-DeepSeek channel loses a check that used to fire, with no test to notice. Record the narrowing in the packet (one limitation line) or add a responses-fixture test asserting the intended (empty) result — either closes the undocumented-behavior gap.

### P2 — F3: the opt-in key `thinkingFormat` is no longer named anywhere in the extension's own advice output

- **Claim:** After this change no extension output — warning text, doctor, suggested snippet, or fix — mentions `compat.thinkingFormat: "deepseek"`, yet that key now gates ALL DeepSeek-specific advice (2987-2990). Discovery depends on precedent outside the extension: the operator's own `models.json` (cline-pass provider-level at 9; openrouter override at 113-114) or the vendored README (lines 191/272, which limitation 5 admits are now stale in emphasis). The doctor prints the CURRENT compat (5359) and generic flags, never the opt-in.
- **Evidence:** [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:260,2989] — the only two occurrences of `thinkingFormat` in the 10,622-line extension; [SOURCE: review/change-under-review.diff:139-143] (the deleted advice line); [SOURCE: implementation-summary.md:127] (README acknowledged, but only as a README problem — the extension-side loss is not on the limitations list).
- **Basis:** verified (occurrences), inferred (discoverability impact — the spec's own risk table says "the opt-in ... is still reported by `/cache-optimizer doctor`", which overstates: the doctor reports the STATE, not the key).
- **Why it matters / what I would do instead:** the change's core mechanism became its least documented artifact. Cheapest fix: one advisory line in the not-opted-in doctor output ("DeepSeek-specific checks are dormant; `compat.thinkingFormat: "deepseek"` opts this channel in"), or restore an informational (non-suggested, non-written) mention in the advice lines — the original concern (auto-writing a wire-format switch) does not apply to naming it.

### P2 — F4: continuity metadata carries the zero-fingerprint placeholder and a self-contradicting next_safe_action

- **Claim:** `implementation-summary.md` `_memory.continuity` declares the packet complete (`completion_pct: 100`, line 28) while its `session_dedup.fingerprint` is the all-zeros placeholder (line 25 — it can match no recomputed content, so any CONTINUITY_FRESHNESS check grades it stale), and its `next_safe_action: "None; the packet is complete"` (line 18) contradicts known limitation 5, which names the stale vendored README as "the packet's next safe action" (line 127).
- **Evidence:** [SOURCE: specs/hooks/021-compat-opt-in-and-image-declaration/implementation-summary.md:18,25,28,127].
- **Basis:** verified (the values); whether freshness enforcement is enabled is unknown (see What I could not check).
- **Why it matters / what I would do instead:** continuity metadata is what the next session trusts. Regenerate the metadata pair after the last doc edit (the packet's own REQ-008 requires exactly this), and reconcile the two next-action statements.

### P2 — F5: provenance drift — the brief's cited commit differs from the landed change, and models.json carries uncommitted drift

- **Claim:** The brief and the diff header cite commit `80576ef8aa`; the repository's landed equivalent — same subject, carrying the code files AND this spec packet — is `8d897d2a83` (verified by `git --no-optional-locks log/show`, read-only). Separately, `.pi/models.json` in the working tree carries an uncommitted 2-line edit (cline-pass model id `deepseek-v4-flash` → `deepseek-v4.1-flash`, lines 13-14) that is not part of the reviewed change; the reviewed llmgateway declarations (50, 57) are NOT among the uncommitted hunks, so the verified evidence matches the committed declarations.
- **Evidence:** [SOURCE: review/brief.md:17-18], [SOURCE: review/change-under-review.diff:1-5], [SOURCE: .pi/models.json:13-14,50,57] + `git --no-optional-locks show --stat 8d897d2a83` (code 70++/32-- + 18 files incl. this packet).
- **Basis:** verified (read-only git); the 80576ef8aa→8d897d2a83 relationship (amend vs. second commit) is inferred, not proven — the parent chain was not inspected.
- **Why it matters / what I would do instead:** traceability: a later reader following the brief's hash finds a commit without the packet. One-line note in the packet (or amend the brief) suffices; the working-tree drift only needs awareness, not action.

## Verified vs Inferred vs Unknown

- Verified (read in a file): the applicability gate and its consequences (2987-2999, 2702-2728); the notification mechanism (4053-4111); the removed suggestion/advice lines (diff); the fix write-set change, proven by the test expectation change to `undefined` (1651-1662) — resolved: the post-fix `models.json` genuinely loses `thinkingFormat` because `buildDeepSeekCompatSuggestion` (3006-3024) no longer emits it, no fixture change needed; the affinity opt-out fix (`=== undefined` at 2710 vs. the old `!== true`); the 114/114/28/0 check-run (check-run.txt:186-190, the four new gate tests by name at 165-171); the harness's five cases and their outcomes (verify-no-warning.txt); the two live probes' claims as their files state them; the llmgateway declarations in models.json (50, 57) unaffected by the uncommitted hunks.
- Inferred (reasoned): the responses-narrowing's defensibility (F2); the discoverability impact (F3); the amend relationship (F5); that pi's runtime merges provider→model compat as the harness assumes (the extension's own comment at 1257-1263 + the harness's citation of docs/models.md).
- Unknown: see next section.

## What I could not check

1. `validate.sh <folder> --strict` (REQ-008) — outside this lineage's permitted command surface (the invocation forbids it); the packet's PASS claim is recorded, not re-verified.
2. A real pi session: whether the provider-level affinity compat reaches `ctx.model.compat` at runtime and the headers actually go out — the verify harness replicates the documented merge in its own code (`verify-no-warning.mjs` `effectiveModel()`); no captured live-session evidence exists.
3. pi-core's consumption semantics for `input`, `requiresReasoningContentOnAssistantMessages`, `thinkingFormat` (the vendored `pi-ai` adapters) — quoted in the probes, not independently re-read (outside the reviewed diff).
4. Whether `SPECKIT_COMPLETION_FRESHNESS` is enabled (bears on F4's practical impact).
5. The exact relationship between 80576ef8aa and 8d897d2a83 (parentage not inspected).

## SCOPE VIOLATIONS

None. Every write of this lineage landed inside `specs/hooks/021-compat-opt-in-and-image-declaration/review/lineages/glm-53-flash/`; the read-only contract of `review/brief.md` and the loop's NEVER-rules were honored (git use was read-only `--no-optional-locks`).

## Traceability Checks

- `spec_code`: REQ-001 ✓ (gate 2987-2990 + test 1122-1136, fails pre-patch); REQ-002 ✓ (no occurrence outside 260/2989; suggestion 3006-3024; advice 3029-3051; fix proven by 1651-1662); REQ-003 ✓ (2710-2712 `=== undefined`; explicit-false respected on the composed path — test 1169-1173); REQ-004 ✓ (models.json:50 + live-affinity-probe.md: acceptance-only, honestly scoped); REQ-005 ✓ (models.json:57 + live-image-probe.md: HTTP 200, verbatim transcription, usage recorded); REQ-006 ✓ (three expectations fail pre-patch, guards noted); REQ-007 ✓ (check-run.txt: typecheck + 114/114/28/0 + check:diff + check:pack; the captured artifact lacks an exit-code line — the author's "exits 0" is consistent with, not proven by, the artifact); REQ-008 — recorded, unverified here (F4/F5 adjacent). Two material inaccuracies found in the packet's own accounting: "opted-in channels keep affinity advice" (notification surface, F1) and "still reported by doctor" (the key name, F3) — both documented above.
- `checklist_evidence`: notApplicable — Level 1 packet, no `checklist.md`; the AC_COVERAGE advisory signal = `exempt`.
- Resource Map Coverage: `resource-map.md` not present; skipping coverage gate.

## Search Ledger (v2, reviewer-attested)

Required bug classes: notification-coverage, applicability-narrowing, write-set-drift, contract-assertion-accuracy. Covered: notification-coverage (→F1), applicability-narrowing (→F2), write-set-drift (ruled out — REQ-002 clean), contract-assertion-accuracy (ruled out — the vacuity challenge). Deferred: responses-API fixture coverage (F2's remediation) and harness control D (F1's remediation). Graph coverage: graphless_fallback — every required class answered by direct reads/greps cited above; the coverage-graph store was not persisted from this lineage (its persistence tooling sits outside the permitted write surface). Scope class: standard; omitted high-risk target: the vendored pi-ai adapters (outside the reviewed diff; semantics taken from the probes' citations).

## Verdict

CONDITIONAL — no P0; one P1 (F1, adjudicated, held at P1 with a recorded downgrade trigger) and four P2 advisories. The change under review does what it says (CLAIM-1..7 supported; the opt-out inconsistency it claimed to fix — old `!== true` treating explicit `false` as missing — genuinely is fixed, and the new tests are demonstrably not vacuous); the strongest objection is the notification-coverage regression the change introduced while making exactly that guarantee.

Next Dimension: security — uncovered; the iteration cap (1 of 1) ends the queue here. Any follow-up review should start there, then traceability (REQ-008).

Review verdict: CONDITIONAL
