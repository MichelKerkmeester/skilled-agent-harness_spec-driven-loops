---
title: "Feature Specification: Gate DeepSeek cache-compat advice on an explicit wire-protocol opt-in and declare image input for the llmgateway model"
description: "The cache optimizer treats a model's name as protocol evidence, so any 'deepseek'-named model behind an OpenAI-compatible proxy is told to add thinkingFormat: \"deepseek\" and requiresReasoningContentOnAssistantMessages, whether or not the channel speaks that wire format. The advice is also unsatisfiable by an explicit opt-out. Separately, the llmgateway model entry declares no input modalities, so Pi drops attached images even though the channel can accept them."
trigger_phrases:
  - "deepseek-like compat warning"
  - "merged compat lacks thinkingFormat"
  - "manufactured thinkingFormat deepseek"
  - "llmgateway image input omitted"
  - "pi cache optimizer warning"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Gate DeepSeek cache-compat advice on an explicit wire-protocol opt-in and declare image input for the llmgateway model

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Operator: "Analyze the cache optimizer extension, and why we get this error in chat ... AND if we can remove that or prevent that error" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`llmgateway/deepseek-v4.1-flash` produces a blocking-looking warning at every Pi launch:

```
💡 pi-cache-optimizer: llmgateway/deepseek-v4.1-flash is DeepSeek-like but merged
compat lacks sendSessionAffinityHeaders and requiresReasoningContentOnAssistantMessages
and thinkingFormat.
```

The warning is derived from the model's **name**, not from its protocol: `isDeepSeekLikeModel()` substring-matches `deepseek` in the model id, and the DeepSeek/`openai-completions` branch then demands three compat keys. Because the `llmgateway` provider block in `models.json` carries no `compat` at all, all three read as missing.

Following the printed advice is not safe. `thinkingFormat: "deepseek"` is a wire-format switch, not a cache flag: the newer upstream build of this same extension deliberately removed that suggestion, noting it "can turn a valid reasoning_effort request into a provider-rejected thinking request". The locally installed 2.8.0 copy still manufactures it, and `/cache-optimizer fix` would write it into `models.json`. Worse, the check cannot be satisfied without it: an operator who intentionally declines the flag keeps getting warned, and `sendSessionAffinityHeaders: false` — the documented opt-out for proxies/WAFs that reject custom headers with 403 — still counts as "missing" on the DeepSeek branch.

A second, unrelated declaration gap surfaced in the same investigation. `llmgateway/deepseek-v4.1-flash` declares no `input` modalities, so Pi defaults to `["text"]` and silently omits attached images; the operator's only image path on this channel is the sk-vision tool. The same model declared through the OpenRouter catalog carries `["text","image"]`, so the capability is plausibly available on the gateway too and simply undeclared here.

### Purpose
Make compat advice follow declared intent rather than a model's name, and make the one capability the operator actually relies on — seeing images — a declared fact instead of a heuristic.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Gate every DeepSeek-specific compat check behind an explicit effective `thinkingFormat: "deepseek"` opt-in.
- Stop manufacturing `thinkingFormat: "deepseek"` in the copyable snippet, the advice prose and the `/cache-optimizer fix` write-set.
- Treat an explicit `sendSessionAffinityHeaders: false` as a deliberate opt-out that does not warn.
- Declare `sendSessionAffinityHeaders: true` for the `llmgateway` provider so the remaining generic proxy advisory is satisfied rather than repeated.
- Declare `input: ["text","image"]` for `llmgateway/deepseek-v4.1-flash` after proving live image pass-through.
- Update the tests that pin the removed behavior and add a regression test for the opt-in gate.

### Out of Scope
- Editing the upstream/npm copies of the extension (`~/.pi/agent/npm/node_modules/pi-cache-optimizer`, `~/.pi/agent/git/...`) - they are not the loaded package; the loaded path is this project's `.pi/extensions/pi-cache-optimizer`.
- Changing `model-modality.ts`'s text-only name allowlist - the operator selected the declaration path, and that allowlist only affects the auto-inspect path, which is disabled by default.
- Renaming the `deepseek`-named model or removing the DeepSeek cache adapter - the adapter still owns usage normalization and cache accounting.
- Rewriting the whole 2.8.0 extension to upstream 2.8.7 - only the compat-advice gate and its tests are in scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Opt-in gate for DeepSeek compat checks; remove manufactured `thinkingFormat`; honor explicit `false` as an opt-out |
| `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` | Modify | Update the DeepSeek classification and fix-command expectations; add opt-in gate regression coverage |
| `.pi/models.json` | Modify | `llmgateway.compat.sendSessionAffinityHeaders`, and `input: ["text","image"]` on the DeepSeek model entry |
| `specs/hooks/021-compat-opt-in-and-image-declaration/` | Create | This packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A DeepSeek-named model whose effective compat lacks `thinkingFormat: "deepseek"` is not treated as a DeepSeek wire-protocol channel | `isDeepSeekCompatCheckApplicable()` and `describeMissingDeepSeekCompat()` return false/empty for `{api: 'openai-completions', compat: {}}` with a `deepseek` id, and return the reasoning requirement once `thinkingFormat: "deepseek"` is set |
| REQ-002 | No code path manufactures `thinkingFormat: "deepseek"` | `buildDeepSeekCompatSuggestion([...])` never contains the key; the warning text contains no `thinkingFormat` advice line; `/cache-optimizer fix` writes no `thinkingFormat` into `models.json` |
| REQ-003 | An explicit `sendSessionAffinityHeaders: false` is an opt-out, not missing compat | The affinity check reports missing only for `undefined`; `false` produces no warning and no fix suggestion on either the generic or the DeepSeek path |
| REQ-004 | `llmgateway` declares the affinity compat it does support | `models.json` carries `providers.llmgateway.compat.sendSessionAffinityHeaders`; a request through the channel still returns 200 with the headers enabled |
| REQ-005 | `llmgateway/deepseek-v4.1-flash` declares the image modality it does support | The model entry carries `input: ["text","image"]` and a live request that includes an image returns 200 with content that matches the image, not an omission notice |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Regression coverage pins the new gate | New tests fail against the pre-patch behavior and pass after it; the removed `thinkingFormat` advice has no remaining assertion |
| REQ-007 | Extension checks pass | `npm run check` (typecheck, tests, `git diff --check`, `npm pack --dry-run`) exits 0 in `.pi/extensions/pi-cache-optimizer` |
| REQ-008 | The packet closes cleanly | `validate.sh <folder> --strict` exits 0 and the generated metadata pair is refreshed after the last spec-doc edit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A freshly launched Pi on `llmgateway/deepseek-v4.1-flash` shows no cache-compat warning, while `/cache-optimizer doctor` still surfaces the truthful state of the channel.
- **SC-002**: One live gateway request carrying an image returns 200 and its answer reflects the image content, proving the `input` declaration instead of assuming it.
- **SC-003**: `npm run check` is green and no test still asserts the manufactured `thinkingFormat` snippet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live `llmgateway` channel and `LLMGATEWAY_API_KEY` | Cannot prove image pass-through; REQ-005 stays unverified | Fall back to keeping the channel text-only and record that sk-vision remains the image path |
| Risk | The gateway rejects images despite the OpenRouter catalog declaring them | Attached images 400 or come back blind at the provider level | Revert the `input` declaration; the entry stays `["text"]` and Pi keeps omitting images cleanly |
| Risk | The proxy or its WAF rejects custom affinity headers with 403 | Every request on the channel fails, a far worse outcome than a warning | Revert to an explicit `sendSessionAffinityHeaders: false`, which REQ-003 makes a warning-free opt-out |
| Risk | Gating the DeepSeek checks hides a wire format the channel genuinely needs | Reasoning replay breaks silently on that channel | The opt-in stays one deliberate key away and is still reported by `/cache-optimizer doctor`; the extension never writes it on the operator's behalf |
| Risk | Editing a loaded extension mid-session | The running Pi keeps the pre-edit module instance | Verify against a fresh process, not the current session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the npm/git upstream copies under `~/.pi/agent/` be refreshed from this patched local copy, or is the project package the single maintained source? Deferred: only the loaded package is in scope here.
<!-- /ANCHOR:questions -->

---
