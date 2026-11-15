---
title: "Injection-Bloat Epic — Hooks Before vs After"
description: "Side-by-side of the runtime hooks before the injection-bloat-reduction epic and after it: the shadow machine (001-007) shipped byte-identical and flag-off, and phases 013/014 later turned the directive-lifecycle reduction LIVE for Pi and the model-context runtimes with default-on dedup and fail-open everywhere — plus the follow-on alignment and playbook-results tooling."
trigger_phrases:
  - "hooks before after injection bloat"
  - "injection bloat epic summary"
  - "shadow delivery before after"
importance_tier: "important"
contextType: "reference"
---
# Injection-Bloat Epic — Hooks Before vs After

<!-- sk-doc-template: skill_readme -->

## 1. THE HEADLINE

The shadow core of the epic (phases 001–007) changed **nothing a user sees**: it added measurement, delivery receipts, and a per-runtime activation gate beside the hooks with every candidate flag off (`activated = 0`), failing open on any unknown or unobserved state. That remains true for the central machine.

Two later phases turned the program's first **live** reductions on, per operator direction, each as an adapter-local mechanism that leaves the shadow machine and the 007 gate untouched:

- **Phase 013 (Pi)** — the three constant advisor directives are no longer visibly re-appended onto every Pi prompt; they are delivered in full on the first message of a session and after every lifecycle boundary, and dropped on a proven same-content repeat. Default-on with `SPECKIT_PI_DIRECTIVE_DEDUP=0` as the kill-switch.
- **Phase 014 (cross-runtime)** — the same lifecycle rule now applies to the model-context runtimes: the Claude/Cursor/Devin/Codex shim and the OpenCode plugin deliver the full directives only on the first message and after lifecycle boundaries (startup/resume/compact; transcript shrink on the subprocess shim), keeping the dynamic `Advisor:` route line on repeats. Default-on with `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` as the kill-switch.

Both are **fail-open**: unknown/unconfirmed sessions, the directives-only fallback, the kill-switch, and any error always deliver the full brief — a guardrail is never silently dropped.

---

## 2. PER-SURFACE: BEFORE → AFTER

| Surface / hook | Before the epic | After the epic (shadow, flag-off) |
|---|---|---|
| **Skill-advisor prompt hooks** — `hooks/claude/user-prompt-submit.ts`, `hooks/pi/prompt-advisor.ts`, `plugins/mk-skill-advisor.js` | Emit the full advisor brief / skill recommendations every turn. No record of what was delivered. | Full emission on the first message and after every lifecycle boundary; the three constant directives are dropped on a proven same-content repeat within one lifecycle epoch (route line kept). **Plus** the shadow delivery observer (`observeEmittedAdvisorPolicy`) recording observed receipts. Live since phases 013 (Pi) and 014 (Claude/Cursor/Devin/Codex shim + OpenCode plugin); fail-open everywhere; kill-switches `SPECKIT_PI_DIRECTIVE_DEDUP` / `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`. |
| **Gate-3 classify adapters** — `spec-gate-classify` for claude / codex / cursor / devin / pi | Surface the full Gate-3 spec-folder question on every mutation-shaped turn. | Same full question. **Plus** a strictly post-emission delivery observer (`observeGate3QuestionDelivery`). A *repeated* question is suppressible only when `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` is enabled (default off) **and** an observed receipt with `lifecycleEpoch >= 1` confirms the prior delivery. |
| **Advisor policy delivery** — `mcp-server/lib/render.ts`, `mcp-server/lib/policy-plan.ts` | Full policy/directive block every turn. No delivery state, no measurement. | A shadow delivery-state machine that *measures* would-be savings and gates confirmation on an observed epoch≥1 receipt. Route-only vs full-first tracked as shadow only. No emitted-byte change. |
| **OpenCode route + transforms** — plugins / route builder | Uncapped compiled-route target list; duplicate system-message transforms re-emitted. | Shadow route-line bounding (candidate 002) and shadow same-message transform dedup (candidate 003), both behind off-by-default flags. |

---

## 3. THE MACHINERY THE EPIC ADDED (all shadow / flag-off)

- **Measurement & receipts foundation (phase 1)** — a shadow planner beside `render.ts`, canonical block IDs, and the observed-receipt delivery contract, with byte-stable parity fixtures.
- **Observed-receipt confirmation contract** — a block or Gate-3 question is confirmable **only** by a receipt whose `hostReceiptStatus === 'observed'` matches the content hash, the artifact digest, **and** a `lifecycleEpoch >= 1`. Epoch 0 (no lifecycle boundary yet) never confirms. This is the correctness spine hardened across every confirmation path.
- **Per-runtime-per-candidate activation gate (phase 7)** — a matrix over six runtimes × candidates 002–006. A cell activates only when *both* behavioral and delivery evidence pass; any missing or ambiguous evidence defaults the cell to full emission (fail-open). Every cell has a documented rollback.
- **Candidates 002–006** — OpenCode route bounding, transform dedup, full-first/route-only repeats, Gate-3 relay suppression, and Pi dispatch/compaction — each shadow-only behind its own off-by-default flag.

---

## 4. FOLLOW-ON: ALIGNMENT & PLAYBOOK INFRASTRUCTURE (children 008–011)

The hook work (phases 001–007) is the epic's core. Four follow-on children extended it — **none changed an emitted hook byte**; they aligned the surrounding docs to the new contract and built the tooling to *validate* the hooks per runtime.

| Child | What it did | Emitted-byte impact |
|---|---|---|
| **008 sk-code-alignment** | Aligned code + READMEs to the epoch≥1 / observed-receipt confirmation contract. | None — docs + comments only. |
| **009 testing-doc-alignment** | Dual-model sweep of the repo-wide manual-testing-playbooks and feature-catalogs against the changed behavior; corrected one stale test count. | None — no doc asserted the old contract; behavior frozen. |
| **010 playbook-cheapest-model** | Standardized each runtime's manual-testing-playbook scenarios onto its cheapest model (codex→gpt-5.6-luna, cursor→composer-2.5, devin→SWE-1.7, opencode/pi→opencode-go/deepseek-v4-flash, claude→sonnet-5), preserving model-under-test scenarios — so a full per-runtime validation pass is cheap. | None — playbook markdown only. |
| **011 playbook-results-automation** | Built + wired the wrapper that auto-persists every manual playbook run into the correctly-named `benchmark/reports/<date>--manual-testing-playbook--<runtime>/` 7-file record (extending `sk-doc/021`'s Lane C writer to the manual path); exercised end-to-end across all six runtimes. | None to the hooks — new benchmark tooling + result records only. |

Together these turn "the hooks emit the same bytes" from an assertion into something **checkable per runtime**: run each runtime's playbook with its cheapest model, and the outcome lands in a dated, correctly-named results record automatically.

---

## 5. NET EFFECT

| Dimension | Before | After |
|---|---|---|
| Emitted bytes | Full content every turn | Shadow core (001–007): **identical** — byte-for-byte parity, every candidate flag off. Live reductions (013–014): the three constant directives deliver in full on the first message and after lifecycle boundaries only; repeats carry the route line (~43 B) instead of the ~763 B directive block, with fail-open guarantees and kill-switches. |
| Runtime behavior | Full delivery | Shadow core: unchanged. 013/014: **live** directive-lifecycle dedup on Pi and on the Claude/Cursor/Devin/Codex shim + OpenCode plugin — default-on, per-operator direction, adapter-local, central machine and 007 gate untouched. |
| What's new | — | A measured, receipt-gated, per-runtime framework with guardrails, rollback, and an epoch-floored confirmation contract; two live adapter-local lifecycle reductions; plus per-runtime playbook validation whose results auto-save to the correct location |

The epic's value is **optionality with safety**: the program measured how much repeated per-prompt injection each runtime carries, shipped the shadow machine byte-identical and flag-off, and then — where the operator chose to act — turned on adapter-local lifecycle reductions that cut the recurring directive payload on repeat turns while remaining fail-open and fully reversible.
