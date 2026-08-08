---
title: "Injection-Bloat Epic — Hooks Before vs After"
description: "Side-by-side of the runtime hooks before the injection-bloat-reduction epic and after it, showing that emitted output stays byte-identical (every candidate flag off) while a measured, receipt-gated shadow machine is now in place for safe future activation — plus the follow-on alignment and playbook-results tooling that let the epic be validated per runtime."
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

The epic changed **nothing a user sees**. Before and after, every runtime hook emits the **same bytes**. What the epic added is a **shadow** layer — measurement, delivery receipts, and a per-runtime activation gate — that sits beside the hooks with **every candidate flag off** (`activated = 0`) and **fails open** (any unknown or unobserved state emits the full content). It is the safe foundation for *future* reduction of repeated per-prompt injection, not a reduction that is live today.

Read the rest as "what each surface did before" → "what it does now, still emitting the same bytes."

---

## 2. PER-SURFACE: BEFORE → AFTER

| Surface / hook | Before the epic | After the epic (shadow, flag-off) |
|---|---|---|
| **Skill-advisor prompt hooks** — `hooks/claude/user-prompt-submit.ts`, `hooks/pi/prompt-advisor.ts` | Emit the full advisor brief / skill recommendations every turn. No record of what was delivered. | Same full emission. **Plus** a strictly post-emission shadow observation (`observeEmittedAdvisorPolicy`) that records an *observed* delivery receipt (`lifecycleEpoch >= 1`). Feeds the default-off suppression path; emitted envelope byte-identical. |
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
| Emitted bytes | Full content every turn | **Identical** — byte-for-byte parity on every negative-control fixture |
| Runtime behavior | Full delivery | **Unchanged** — `activated = 0`, fail-open everywhere |
| What's new | — | A measured, receipt-gated, per-runtime framework that can *safely* suppress repeated injection when/if a candidate is turned on — with guardrails, rollback, and an epoch-floored confirmation contract — plus per-runtime playbook validation whose results auto-save to the correct location |

The epic's value is **optionality with safety**: the program can now measure how much repeated per-prompt injection each runtime carries and turn reduction on one candidate-runtime cell at a time, each gated by evidence and reversible — without having changed a single emitted byte to get here.
