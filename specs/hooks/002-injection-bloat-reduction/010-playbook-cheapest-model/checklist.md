---
title: "Checklist: Per-Runtime Cheapest-Model Standardization of the CLI Manual-Testing Playbooks"
description: "Verification checklist for the documentation-only per-runtime playbook model standardization, confirming each runtime's vehicle scenarios use the operator-chosen cheapest model, model-under-test scenarios are preserved, and opencode/pi resolve to the opencode-go gateway."
trigger_phrases:
  - "playbook cheapest model checklist"
  - "cli playbook model swap checklist"
importance_tier: "supporting"
contextType: "checklist"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/010-playbook-cheapest-model"
    last_updated_at: "2026-08-08T10:47:17Z"
    last_updated_by: "claude"
    recent_action: "Verified all six runtimes from the final working-tree state"
    next_safe_action: "Port the delta to skilled/v4.0.0.0 on operator approval"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:5b461f9b930362ccba7b6630d487fed3bd560871dd2df71e3cd9eee2c4431479"
      session_id: "2026-08-08-hooks-002-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Per-Runtime Cheapest-Model Standardization of the CLI Manual-Testing Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is checked from the final working-tree state. Every substitution claim is backed by a boundary-anchored grep and its observed count.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Each runtime's cheapest model id confirmed against its `cli-<runtime>/SKILL.md` before editing — Evidence: `gpt-5.6-luna`, `composer-2.5`, `SWE-1.7`, `opencode-go/deepseek-v4-flash`, `claude-sonnet-5` verified in each runtime's reference.
- [x] CHK-002 [P0] Playbook tree confirmed byte-identical to `origin/skilled/v4.0.0.0` before editing — Evidence: `git diff --stat HEAD origin/skilled/v4.0.0.0` on the playbook trees returned empty.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Model tokens replaced only where the model is a dispatch vehicle — Evidence: preserved dirs (`reasoning-effort/`, `multi-provider/`, `reasoning-and-models/`, `model-dispatch/`, `*direct*`/`*kimi*`/`*minimax*`, `default-model-selection-sonnet.md`) excluded by path in every substitution.
- [x] CHK-011 [P1] No persona/prose token corrupted by the substitution — Evidence: the `sol` substring false positive (in `isolated`/`console`) was identified and never used as a replacement target; only distinctive model ids were replaced.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every vehicle scenario names the target model — Evidence: codex `gpt-5.6-luna`=140 refs; opencode `opencode-go/deepseek-v4-flash`=20 files; claude `claude-sonnet-5`=2 files; devin `SWE-1.7`=1; pi `--provider opencode-go`=1.
- [x] CHK-021 [P0] Zero vehicle residual of the replaced model outside preserved paths — Evidence: codex gpt-5.5/-sol outside `reasoning-effort/`=0; opencode `deepseek-v4-pro` outside preserved=0; claude `claude-*-4-6` outside preserved=0; devin `swe-1.6`=0; pi direct-deepseek vehicle=0.
- [x] CHK-022 [P1] Codex default effort raised to `high` outside the effort-under-test dir — Evidence: `model_reasoning_effort="medium"` outside `reasoning-effort/`=0; `="high"`=59.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All six runtimes addressed — Evidence: 5 runtimes edited (`codex`/`devin`/`opencode`/`pi`/`claude`); `cursor` confirmed already-standardized (no edit needed).
- [x] CHK-FIX-002 [P1] opencode and pi use the `opencode-go` gateway, never the direct `deepseek/` API — Evidence: opencode `deepseek/deepseek-v4-flash` outside preserved=0, gateway present in 20 files; pi `--provider opencode-go --model deepseek-v4-flash` set.
- [x] CHK-FIX-003 [P1] Stale Claude 4.6 ids modernized in re-pointed scenarios — Evidence: no `claude-*-4-6` remains in the two re-pointed claude files; target `claude-sonnet-5`.
- [~] CHK-FIX-004 [P2] Model-under-test scenarios keep their (possibly older) ids by design — Evidence: `reasoning-and-models/` still names `claude-haiku-4-5`/`opus-4-6`/`sonnet-4-6` and `reasoning-effort/` keeps `gpt-5.5`; modernizing those tier ids is out of this scope.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No secrets, credentials, or tokens introduced — Evidence: `git diff` shows only model-id token substitutions in playbook markdown; no credential strings added.
- [x] CHK-031 [P2] No new execution or network surface added — Evidence: playbook prose/command-line text only; no runtime code changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Each written model string is valid for its runtime — Evidence: every target id matches the id documented in its `cli-<runtime>` reference (pi's `opencode-go/deepseek-v4-flash` confirmed against the live model catalog).
- [x] CHK-041 [P1] The pi reference-doc staleness recorded — Evidence: `providers-and-models.md` roster is dated 2026-07-28 and omits the now-live `opencode-go` provider; noted as a limitation, not silently relied upon.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only playbook markdown plus this packet changed — Evidence: `git status --porcelain` shows 48 `manual-testing-playbook` files plus the `010` packet; 0 non-playbook/non-packet files changed by this work.
- [x] CHK-051 [P2] No repo-wide `description.json` churn — Evidence: `git status` shows no `description.json` changes outside the packet tree.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 6 | 6/6 |
| P2 Items | 3 | 2/3 (1 preserved-by-design) |

**Verification Date**: 2026-08-08 — all six runtimes verified from the final working-tree state with boundary-anchored grep evidence; vehicle residuals are zero outside preserved paths; opencode/pi resolve to the `opencode-go` gateway; one P2 (modernizing model-under-test tier ids) preserved by design.
<!-- /ANCHOR:summary -->
