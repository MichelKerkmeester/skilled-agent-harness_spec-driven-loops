---
title: "Implementation Summary: Per-Runtime Cheapest-Model Standardization of the CLI Manual-Testing Playbooks"
description: "Final state of the documentation-only per-runtime playbook model standardization: five runtimes re-pointed to their cheapest model and one (cursor) already conformant, with model-under-test scenarios preserved and opencode/pi bound to the opencode-go gateway."
status: complete
completion_pct: 100
trigger_phrases:
  - "playbook cheapest model summary"
  - "cli playbook model swap result"
importance_tier: "important"
contextType: "implementation-summary"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/010-playbook-cheapest-model"
    last_updated_at: "2026-08-08T10:47:17Z"
    last_updated_by: "claude"
    recent_action: "Standardized six runtimes onto their cheapest models and verified"
    next_safe_action: "Port the delta to skilled/v4.0.0.0 on operator approval"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges.md"
    session_dedup:
      fingerprint: "sha256:fbd1722f492be533769dc029814ad6b94923d9d2eea380217c9f23c68387ecba"
      session_id: "2026-08-08-hooks-002-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "cli-pi does support the opencode-go gateway (deepseek-v4-flash [opencode-go], confirmed live in the model picker); the skill's providers-and-models.md roster was stale (dated 2026-07-28) and predated it."
      - "cursor needed no edit: its vehicle scenarios already dispatch composer-2.5, and the residual gpt-5.2 / composer-2.5-fast references are model-under-test."
---
# Implementation Summary: Per-Runtime Cheapest-Model Standardization of the CLI Manual-Testing Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete (all six runtimes standardized and verified) |
| **Scope** | 48 `manual-testing-playbook` markdown files across six runtimes, plus this packet |
| **Change class** | Documentation-only (model-id tokens in playbook prose and command lines) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Each runtime's manual-testing-playbook vehicle scenarios were re-pointed to that runtime's operator-chosen cheapest dispatch model, so a full per-runtime playbook pass (to validate the injection-bloat hooks in each host) is cheap and uniform. No hook, plugin, or shadow-delivery behavior was touched.

- **Codex** — `gpt-5.5`, `gpt-5.6-sol`, and bare `gpt-5.6` → `gpt-5.6-luna` (140 refs); the default `model_reasoning_effort="medium"` raised to `"high"` to match the `LUNA HIGH` combination. The `reasoning-effort/` dir (effort-under-test) was preserved untouched.
- **Cursor** — no edit needed. Its vehicle scenarios already dispatch `--model composer-2.5`; the residual `gpt-5.2` / `composer-2.5-fast` references are model-under-test (a hallucination fixture on effort-suffix resolution, the allowlist description, and a deliberate fast-variant comparison).
- **Devin** — the single residual `swe-1.6` → `SWE-1.7` (the rest of the tree was already `SWE-1.7`).
- **OpenCode** — `deepseek/deepseek-v4-pro` and bare `deepseek-v4-pro` → `opencode-go/deepseek-v4-flash` (20 files). The `multi-provider/` comparison scenarios and the `*direct*`/`*kimi*`/`*minimax*` provider templates were preserved.
- **Pi** — the `PI-020` session-lifecycle scenario moved from the direct `--provider deepseek` to the `--provider opencode-go` gateway (model `deepseek-v4-flash`). The `model-dispatch/` allowlist scenarios were preserved.
- **Claude** — `claude-sonnet-4-6` and `claude-opus-4-6` → `claude-sonnet-5` (2 files); the `reasoning-and-models/` tier scenarios and `default-model-selection-sonnet.md` were preserved.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each runtime's real model-token inventory was taken with boundary-anchored greps — after an initial `sol` count proved to be a false positive from the substring in `isolated`/`console`, which corrected the blast radius from an apparent ~186 files down to ~64 with actual model tokens. Substitutions ran per runtime with the model-under-test directories excluded by path, then a post-edit grep proved both completeness (target model present, replaced model absent outside preserved paths) and containment (preserved scenarios unchanged). The pi gateway target was verified against the live model catalog after the reference doc proved stale.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Preserve model-under-test scenarios.** Where the model or reasoning tier IS the thing under test (`reasoning-effort/`, `reasoning-and-models/`, `model-dispatch/`, `multi-provider/`, model-selection, deepseek-direct), the original model is kept; re-pointing it would destroy the scenario's purpose.
- **Codex effort raised to high, not capped.** The default `medium` tier was raised to `high` per the `LUNA HIGH` directive; deliberate `xhigh` deeper-validation notes were left as intentional exceptions rather than downgraded.
- **Trust the live catalog over the stale reference.** cli-pi's `providers-and-models.md` roster (2026-07-28) omits the `opencode-go` provider, but the live model picker confirms `deepseek-v4-flash [opencode-go]`; the operator's original gateway directive was honored.
- **Claude opus → sonnet-5.** The `ai-council` scenario that used `opus` for planning was moved to the cheapest `sonnet-5`; it tests routing, not model tier.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All checks run from the final working-tree state.

- **Vehicle coverage** — codex `gpt-5.6-luna`=140 refs; opencode gateway-flash=20 files; claude `claude-sonnet-5`=2 files; devin `SWE-1.7`=1; pi `--provider opencode-go`=1. `[EVIDENCE: grep -r target model]`
- **Zero residual outside preserved** — codex gpt-5.5/-sol=0; opencode `deepseek-v4-pro`=0; claude `claude-*-4-6`=0; devin `swe-1.6`=0; pi direct-deepseek vehicle=0. `[EVIDENCE: grep -rl replaced model, minus preserved paths]`
- **Gateway not direct** — opencode direct `deepseek/deepseek-v4-flash` outside preserved=0; pi bound to `--provider opencode-go`. `[EVIDENCE: grep for direct form]`
- **Scope clean** — 48 playbook markdown files plus this packet changed; 0 non-playbook, non-packet files touched by this work. `[EVIDENCE: git status --porcelain]`
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Model-under-test ids stay old.** Preserved tier scenarios (`reasoning-and-models/`, `reasoning-effort/`) still name Claude 4.6 / GPT-5.5 ids; modernizing those tier ids is a separate concern outside a cheapest-vehicle standardization.
- **Pi reference doc is stale.** `cli-pi/references/providers-and-models.md` does not list the `opencode-go` provider now confirmed live; updating that reference is a follow-on doc fix, not part of this playbook standardization.
- **Not yet ported to v4.** The change is complete and validated on `sk-code/0131-injection-bloat-impl`; landing it on `skilled/v4.0.0.0` awaits operator approval (the playbook tree was confirmed identical to v4, so the port is conflict-free).
<!-- /ANCHOR:limitations -->
