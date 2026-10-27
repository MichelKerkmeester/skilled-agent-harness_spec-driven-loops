---
title: "Implementation Plan: Add GPT-6.1 Terra to cli-codex, cli-opencode and cli-pi through the openai provider"
description: "Add gpt-6.1-terra to three CLI skill rosters and the cli-pi fan-out allowlist, proven by live dispatches and the deep-loop runtime suite."
trigger_phrases:
  - "gpt 6 1 terra roster plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Add GPT-6.1 Terra to cli-codex, cli-opencode and cli-pi through the openai provider

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, TypeScript and CommonJS allowlists, JSON config |
| **Framework** | Skilled cli-external-orchestration hub, deep-loop runtime |
| **Storage** | None |
| **Testing** | vitest (deep-loop runtime), sk-doc validators, live CLI dispatches |

### Overview
Add one roster row per skill doc and one id to the three cli-pi allowlist literals. Prove the model is real with one-turn dispatches on all three CLIs, and prove the allowlist change with a roster test that fails before the edit and passes after it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npx vitest run --no-coverage` in the deep-loop runtime shows the roster suites passing and no failure tied to the allowlist
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Closed roster allowlist.

### Key Components
- **Skill references**: the three `providers-and-models.md` files are the roster an operator reads.
- **Fan-out allowlist**: `PI_SUPPORTED_MODELS`, its synchronous mirror `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS` decide which ids a cli-pi lineage may pin and which provider prefixes them.

### Data Flow
A lineage pins a bare model id. The fan-out checks it against the allowlist, prefixes its provider and passes `--model openai/gpt-6.1-terra` to `pi -p`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the two roster unit suites red before the allowlist edit and green after it, then the whole deep-loop runtime suite. Live one-turn dispatches confirm the model on each CLI.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Codex 0.164.0, OpenCode 1 1.19.4, OpenCode 2 2.1.4 and Pi 1.4.0, each the latest release on 2026-10-27. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: OpenAI withdraws `gpt-6.1-terra`. Revert the commit that carries this packet. Pi extension updates roll back by reinstalling the recorded versions (rpiv packages 2.13.9, pi-blackhole 0.5.15, pi-web-access 0.43.0).
<!-- /ANCHOR:rollback -->

---
