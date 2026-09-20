---
title: "Implementation Plan: Astra on the OAuth route, two catalogs and one recorded failure"
description: "Two roster rows, two pi config entries that turn fast mode on, one document correction and one failure written down. The reachability work is already done by dispatch, so what remains is recording it accurately and enabling the Pi fast lever."
trigger_phrases:
  - "astra oauth plan"
  - "astra codex pi rosters"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/064-gpt-6-astra-oauth"
    last_updated_at: "2026-09-05T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Planned the rows, the pi fast-mode entries and the recorded failure"
    next_safe_action: "Add the codex catalog row and its ultra ceiling"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/references/providers-and-models.md"
      - ".pi/pi-fast-mode-w-subagent-support-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-064-astra-oauth"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Astra on the OAuth route, two catalogs and one recorded failure

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config + Markdown catalogs |
| **Framework** | codex, pi and opencode, all three installed and on PATH |
| **Storage** | None |
| **Testing** | Live dispatch per CLI per tier, with a passing control for the failing case |

### Overview

The hard part is finished. Reachability, the tier set and fast mode were all settled by dispatch before this plan existed, so implementation is recording what ran plus one small configuration change that turns a lever on.

The verification order is the point worth keeping. The catalogs said Astra was not on the OAuth provider, and the catalogs were wrong: `opencode models openai` is a bundled list rather than a live account query. Reading it as authoritative would have closed the question with the wrong answer, and the only thing that reopened it was dispatching against the model anyway. Every claim in the rows below therefore comes from a turn that returned a marker, not from a listing.

One configuration change carries real behavior. Pi's fast lever already exists and already accepts the provider Astra runs on, so two entries in the extension's target list bring `/fast` and `--fast` to this model. That is the difference between a document that describes fast mode and a CLI that applies it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Astra dispatched on cli-codex over ChatGPT OAuth, no API key present
- [x] Astra dispatched on cli-pi through the `openai-codex` builtin
- [x] Every codex tier probed individually, floor and ceiling both established
- [x] The cli-opencode failure reproduced three times against a passing control
- [x] The Pi fast-mode extension's supported-provider set read from source

### Definition of Done
- [ ] Both roster rows carry the six accepted tiers and name the two rejected ones
- [ ] `/fast` applies to Astra on Pi, verified after the target entries land
- [ ] The cli-opencode row cites its error refs and the control
- [ ] The cli-pi fast-mode correction cites the extension source
- [ ] No API-key route appears anywhere in the packet
- [ ] Both edited JSON files parse and keep operator formatting
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One provider, three different ways of resolving a model id against it, and that is what separates the three outcomes. codex passes the id straight through to the API, so an id the API knows works whether or not any local file lists it. Pi checks its catalog, warns when the id is absent, and passes it through anyway. opencode resolves against a bundled catalog and fails when the id is missing, which is why the same OAuth credential serves two CLIs and not the third.

### Key Components

- **The cli-codex model table.** Gains a fifth row and a second model reaching `ultra`, which until now was reserved for `gpt-5.6-sol`.
- **The cli-pi `openai-codex` section.** Gains a third model beside Sol and Luna, with the passthrough warning quoted so it does not read as an error.
- **`.pi/pi-fast-mode-w-subagent-support-config.json`.** Its `targets` list is the whole mechanism. Two entries, matching the pattern the six GPT-5.x models already use across the two supported providers.
- **The cli-pi §4 paragraph.** Currently denies the lever exists. It becomes a description of the extension and of the one provider class it cannot reach.

### Data Flow

codex sends `--model gpt-6-astra` with `-c model_reasoning_effort=<tier>` and `-c service_tier="fast"`, both config overrides rather than flags. Pi sends `--provider openai-codex --model gpt-6-astra --thinking <tier>`, and the fast-mode extension injects `service_tier` into the request payload when the target list matches provider and model. Nothing in either path uses an API key.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. The verification phase is already complete and its evidence is recorded there rather than repeated.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No test suite. Twelve live dispatches are already spent and recorded: eight codex tier probes, three pi tier probes, three opencode attempts and one opencode control.

What remains to test is the Pi fast lever, and it needs a real check rather than an assumed one. A target entry that names an unsupported provider is dropped silently by `config.ts`, so the absence of an error proves nothing. The check is a dispatch with fast mode on and one with it off, confirming the extension reports Astra as an eligible target rather than skipping it.

The opencode case needs no further work. Three failures against one passing control is enough to record the behavior, and the cause is upstream.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ChatGPT OAuth on codex | External | Green, `auth_mode = chatgpt`, no API key | No codex route |
| Pi `openai-codex` builtin | Local | Green, a builtin rather than a configured provider | No pi route |
| `pi-fast-mode-w-subagent-support` v0.3.0 | Local extension | Green, installed, 12 targets today | No fast mode on Pi |
| opencode catalog carrying the id | External | Red, and out of our hands | The opencode row stays a recorded failure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Astra behaves badly on either CLI, or `ultra` on a second model turns out to cost more than expected.
- **Procedure**: remove the two `targets` entries and the one `enabledModels` line, then remove the row from each catalog. Nothing enforces the codex side in code, so removing the row removes the permission. The three recorded findings stay: the cli-pi fast-mode correction, the opencode failure and the catalog-versus-dispatch note are each true whether or not Astra is on a roster.
<!-- /ANCHOR:rollback -->
