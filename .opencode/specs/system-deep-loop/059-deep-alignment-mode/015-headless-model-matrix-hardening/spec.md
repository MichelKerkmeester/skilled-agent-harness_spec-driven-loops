---
title: "Feature Specification: headless model-matrix hardening for the deep-alignment loop"
description: "Make the deep-alignment loop reliably self-drive to REPORT under every GPT-5.6 opencode driver slug (fixing the narrate-then-stop stall), wire external GPT executors (cli-codex / cli-opencode) into its per-iteration leaf dispatch, and prove the loop end-to-end across a representative driver + leaf-executor model matrix."
trigger_phrases:
  - "deep-alignment headless model matrix"
  - "deep-alignment narrate-then-stop fix"
  - "deep-alignment external executor wiring"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/015-headless-model-matrix-hardening"
    last_updated_at: "2026-07-14T08:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored L3 planning doc set; awaiting plan approval"
    next_safe_action: "On approval, execute Phase A stall fix and verify live"
---
# Feature Specification: headless model-matrix hardening for the deep-alignment loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The deep-alignment loop has never completed a live end-to-end run. Its first attempt (`opencode run --command deep/alignment :auto` under `gpt-5.6-luna-fast`) narrated a handoff and stopped, writing zero state. The engine and adapters are proven sound; the driver is not. This packet makes the loop model-agnostic in three ordered phases — a low-blast alignment-only stall fix (A), external GPT-executor wiring ported from deep-review (B), and a bounded representative model-matrix e2e proof (C) — so any GPT-5.6 opencode slug can drive it and any GPT model can run its leaf. This unblocks the downstream command/agent canon-conformance audit that depends on it.

<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planning (awaiting approval) |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | system-deep-loop/059-deep-alignment-mode |
| **Predecessor** | 014-skill-doc-template-conformance |
| **Successor** | None (latest child) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `deep-alignment` loop has never had a full live end-to-end run (its own README names this "the remaining acceptance step"). The first live attempt — `opencode run --command deep/alignment :auto` driven by `openai/gpt-5.6-luna-fast` — **narrated-then-stopped**: the session model did recon, emitted "I'm now invoking the command runner…" as a terminal message, and the session ended with **zero `alignment/` state written**. The loop's engine and adapters are proven sound (the sk-doc adapter returns real P0 findings keyed off actual `validate_document.py` exit codes); the broken link is the *driver*. Root cause: the router never forces a concrete first tool call, and its "the auto workflow YAML *owns* the loop" phrasing lets a headless model defer execution to a runner that does not exist — the session model itself is the runner. Separately, the loop is native-executor-only, so codex GPT models cannot participate at all.

### Purpose
Make the deep-alignment loop a trustworthy, model-agnostic headless workflow: (1) any GPT-5.6 opencode driver slug drives it to REPORT with real findings; (2) its per-iteration leaf can run on any GPT model via the shared `cli-codex` / `cli-opencode` executor path; (3) both are proven across a representative driver + leaf model matrix. This unblocks the downstream command/agent canon-conformance audit that depends on a working deep-alignment loop.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Driver execution-forcing** (Phase A): a structural forcing function in `alignment.md` + `deep_alignment_auto.yaml` so a headless GPT-5.6 session model executes the loop instead of narrating a handoff. Alignment-scoped only.
- **External-executor wiring** (Phase B): port `deep-review`'s executor-resolution / audit / dispatch-branch scaffolding into deep-alignment; author the missing alignment prompt-pack; extend the shared `fanout-run.cjs` to accept `loop-type alignment` with alignment convergence flags; unlock the command-surface executor flags once the dispatch branch exists.
- **Model-matrix proof** (Phase C): drive the loop e2e across a representative subset of the 12 opencode GPT-5.6 driver slugs and a representative subset of codex + opencode leaf executors; capture pass/fail evidence.

### Out of Scope
- The downstream 138 command/agent canon-conformance audit itself (this packet only makes the loop that runs it reliable).
- `cli-claude-code` executor kind (reserved-not-wired; irrelevant to an all-GPT matrix).
- Rewriting the deep-alignment engine scripts or adapters (proven sound; unchanged).
- Wiring a live compiled-contract injection plugin (the injection layer is dormant; out of scope).
- Any remediation/auto-fix behavior of the loop (read-only audit contract preserved).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/alignment.md` | Modify | Forcing-function directive; command-surface executor flags (Phase B, after branch exists) |
| `.opencode/commands/deep/assets/deep_alignment_auto.yaml` | Modify | Mandatory side-effecting step-0; executor-resolution + dispatch-branch scaffolding |
| `.opencode/skills/system-deep-loop/deep-alignment/assets/alignment_prompt_pack.md.tmpl` | Create | Prompt-pack template for CLI leaf executors (currently absent) |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify (SHARED) | Accept `loop-type alignment` + alignment convergence flags |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify (SHARED) | Add `ultra` reasoning-effort so sol's ceiling is expressible |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- REQ-001: A headless GPT-5.6 opencode driver slug launched via `opencode run --command deep/alignment :auto` executes the YAML loop to REPORT — writing `alignment/` state and at least one real finding — with no narrate-then-stop. (Phase A)
- REQ-002: The forcing-function fix is alignment-scoped: `deep-review` / `deep-research` / `deep-ai-council` behavior is byte-unchanged and their gates stay green. (Phase A)
- REQ-003: deep-alignment's per-iteration leaf dispatch resolves an external executor (`cli-codex`, `cli-opencode`) via the shared `executor-config.ts` + `fanout-run.cjs` path, with a `native` branch preserved as the default; executor provenance is audited into the iteration record. (Phase B)
- REQ-004: `fanout-run.cjs` accepts `--loop-type alignment` and the alignment convergence flags (`--coverage-threshold`, `--stability-window`) without regressing `research` / `review`. (Phase B)
- REQ-006: The representative e2e matrix passes: each selected driver slug reaches REPORT with real findings, and each selected leaf executor completes one audited iteration; results are captured as evidence. (Phase C)

### P1 - Required (complete OR user-approved deferral)
- REQ-005: `gpt-5.6-sol`'s `ultra` reasoning-effort ceiling is expressible in `executor-config.ts` (additive enum value). (Phase B)
- REQ-007: An alignment prompt-pack template exists and a render step populates `{prompt_dir}/iteration-{N}.md` for CLI leaf executors. (Phase B)

### P2 - Nice-to-have
- REQ-008: The `--variant low` floor restriction on Pro-tier opencode slugs is smoke-verified rather than assumed.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Acceptance Scenarios
- Given a fresh `alignment/` packet, when the loop is launched headless via `opencode run --command deep/alignment :auto` under any representative GPT-5.6 driver slug, then the loop reaches phase_synthesis and writes `alignment-report.md` with a PASS/CONDITIONAL/FAIL verdict and real per-lane findings — no run ends after an "I'm now invoking the runner" message with an empty `alignment/`.
- Given an executor config with `kind: cli-codex` and a GPT model, when an iteration dispatches, then the leaf runs under `codex exec` and writes its iteration/delta/state via Bash, and the iteration record carries the executor audit fields.
- Given `node fanout-run.cjs --loop-type alignment …`, when invoked, then it does not throw the "loop type not active for fan-out" error and honors the alignment convergence flags.
- Given the deep-review / deep-research auto workflows unchanged, when their existing gates run, then they stay green.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Shared-runtime regression (Phase B).** `fanout-run.cjs` and `executor-config.ts` are used by `research` / `review`. Mitigation: additive-only changes, re-run the sibling loops' gates as a before/after regression baseline.
- **Model-behavioral variance.** The narrate-then-stop is family-behavioral; one wording may not fix every slug. Mitigation: Phase C sweeps families and iterates; the side-effecting step-0 converts silent stalls into detectable partials.
- **Premium-token cost (Phase C).** Mitigation: a bounded, documented representative subset; no silent truncation.
- **Contract-must-match-dispatch honesty.** The YAML forbids advertising executor flags before the branch exists. Mitigation: flag unlock is the LAST Phase-B step.
- **Dependency**: the proven `deep-review` executor path is the port source; the sound deep-alignment engine + sk-doc adapter are the substrate.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| NFR ID | Category | Target |
|--------|----------|--------|
| NFR-R01 | Reliability | Every representative driver slug reaches REPORT deterministically (no narrate-then-stop) across repeated runs. |
| NFR-R02 | Regression safety | `research`/`review` behavior byte-unchanged after shared-runtime edits (additive-only). |
| NFR-S01 | Security | CLI leaf executors run at `--sandbox workspace-write` (never danger-full-access); writes scoped to `alignment/`. |
| NFR-C01 | Cost | Phase C stays within a bounded representative subset; skips logged, never silent. |
| NFR-M01 | Maintainability | Alignment reuses the single shared deep-loop runtime; no forked dispatcher. |

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Driver emits a "PROCEED" plan as terminal prose without a tool call → the mandatory step-0 must still be forced, and its absence is detectable (empty `alignment/`).
- A leaf executor times out or errors → the iteration is recorded as `timeout`/`error`, not silently dropped; convergence accounts for it.
- `gpt-5.6-sol` requested at `ultra` before the enum is extended → config rejects it clearly rather than silently downgrading.
- An opencode-driver + opencode-leaf combination → must route via parallel-detached fan-out (self-invocation guard), never a single-executor branch.
- Zero-artifact lane → recorded NOT_APPLICABLE, not an error (existing engine behavior preserved).

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Rating | Note |
|-----------|--------|------|
| Blast radius | Mixed | Phase A alignment-only (low); Phase B touches shared `fanout-run.cjs` + `executor-config.ts` (med-high). |
| Behavioral uncertainty | High | Model-family narrate-then-stop variance requires empirical matrix iteration. |
| Integration risk | Med-High | First e2e run of a never-completed loop; port of a multi-step executor topology. |
| Reversibility | High | All edits git-tracked; phases separately committable; shared edits additive/revertible. |
| Overall | Level 3 | 3 phases, shared-runtime + live-matrix scope. |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Shared-runtime regression | Low | High | Additive-only + before/after regression baseline |
| Forcing function fixes some models not others | Medium | Medium | Family sweep in Phase C; iterate wording |
| Premium-token overrun | Medium | Medium | Bounded representative subset; documented skips |
| Leaf executor sandbox misconfig | Low | High | `workspace-write` only; write paths scoped |
| Contract advertises flags before dispatch exists | Low | Medium | Flag unlock is the final Phase-B step |

<!-- /ANCHOR:risk-matrix -->
---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

- As an operator, I launch `deep/alignment :auto` headless under any GPT-5.6 model and get a completed `alignment-report.md`, so I can trust the audit result.
- As an operator, I choose a codex or opencode GPT model as the per-iteration leaf executor, so I can tune audit cost/quality.
- As a maintainer, I confirm `research`/`review` are unaffected by the shared-runtime edits, so I can ship without regression risk.

<!-- /ANCHOR:user-stories -->
---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Q1: Should `gpt-5.6-sol` run at `ultra` in-loop, or is `max` an acceptable ceiling? (Baked: add `ultra`; ADR-003. Overridable.)
- Q2: Is a single-executor `cli-opencode` leaf branch needed, or only opencode-leaf-via-fan-out? (Baked: no single-executor branch; ADR-004. Overridable.)
- Q3: How wide must Phase C go before "works across all GPT models" is satisfied — the representative subset, or the exhaustive matrix? (Plan proposes representative subset with documented skips; operator may widen.)

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md` — three-phase implementation plan, affected surfaces, quality gates, rollback.
- `tasks.md` — task breakdown across setup / implementation / verification.
- `decision-record.md` — ADR-001..ADR-005.
- `checklist.md` — verification protocol.
- Parent: `../spec.md` (059-deep-alignment-mode).

<!-- /ANCHOR:related-docs -->
