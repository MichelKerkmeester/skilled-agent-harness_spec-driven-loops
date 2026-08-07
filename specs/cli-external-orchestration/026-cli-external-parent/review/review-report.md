# Deep Review Report — whole-program review (cli-external + mcp-tooling packets + cli-opencode GPT-5.6 rename)

<!-- ANCHOR:review-dimensions -->
Dimensions reviewed: correctness, security, traceability, maintainability
<!-- /ANCHOR:review-dimensions -->

## 1. Executive Summary

**Verdict: CONDITIONAL** (hasAdvisories: true)

- **Active findings**: 7 P1, 2 P2, 0 P0 — 10 iterations (2.5 passes × 4 dimensions), dimension coverage 4/4, convergence 0.8.
- **Executor**: iterations 1–9 `openai/gpt-5.6-terra-fast --variant high`; iteration 10 `openai/gpt-5.6-sol-fast --variant high` (operator mid-loop model switch). Real cli-opencode dispatch each iteration, route-proof verified on all 10.
- **Harness note**: terra-fast halted on iteration 2 twice — once on a false state-log "concurrent modification" (it used a last-line-match patch instead of the template's `>>` append), once on the repo's CLAUDE.md Gate-3 doc gate. Both were hand-built-driver deficiencies vs the real `/deep:review :auto` contract; hardening the prompt (pure-append rule + autonomous/Gate-3-suppression preamble) fixed it. sol-fast completed iteration 10 first try with no halt.
- **Headline**: this review read past the rename into cli-opencode's whole SKILL/README and surfaced a distinct finding set from the earlier Fable-5 pass — **4 genuine PRE-EXISTING cli-opencode content bugs** (not caused by this program) and **5 advisory refinements** to the two spec packets (which already passed Fable-5 + `validate.sh --strict`). No P0; nothing blocks.

## 2. Planning Trigger

`/speckit:plan` remediation optional. The pre-existing cli-opencode bugs (WS-A) warrant a small separate cleanup packet; the packet refinements (WS-B) are polish on already-validated plans.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 7, "P2": 2 },
  "remediationWorkstreams": [
    "WS-A: pre-existing cli-opencode content bugs (NOT this program's work) — pkill self-contradiction, stale codex sibling-row, parallel-session confirmation gate, dispatch-recipe/agent-contract",
    "WS-B: spec-packet advisory refinements — resolution-based move gate, scaffold/scorer ordering note, clickup-drift release-gate visibility, ADR-005 carve-out clarity, phase-001 write-boundary"
  ],
  "specSeed": "Separate cli-opencode content-hygiene cleanup; optional packet-plan polish.",
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### WS-A — PRE-EXISTING cli-opencode content bugs (surfaced by this review; NOT caused by the rename or the packets)

| Sev | File:line | Finding | Adjudication |
|-----|-----------|---------|--------------|
| P1 | `cli-opencode/SKILL.md:351` (vs :337) | Rule 16 instructs `pkill -9 -f "opencode run"` for orphan cleanup, but Rule 5 explicitly forbids exactly that ("DO NOT auto-kill operator-owned opencode sessions; exclude `opencode run` from pkill", per a 2026-05-23 operator directive). | **CONFIRMED** — direct internal contradiction, verified both lines. Pre-existing. Fix: Rule 16 must scope its kill to the dispatcher's own PID/session, never a blanket `opencode run` match. |
| P1 | `cli-opencode/README.md:137-145` | The sibling-boundary table lists `cli-opencode` on TWO rows; the 3rd row (`cli-opencode \| OpenAI \| sandboxed coding, repo analysis, PR review, live web research`) is the retired **cli-codex** skill's description, mislabeled as cli-opencode. | **CONFIRMED** — verified; stale leftover from the cli-codex deprecation (packet 122). Directs "OpenAI sandboxed coding" work to the wrong identity. Fix: delete the stale row (only cli-opencode + cli-claude-code exist). |
| P1 | `cli-opencode/README.md:78` | Parallel-session quick-start publishes/shares a session without surfacing the `share-requires-confirmation` hard-rule gate. | **PLAUSIBLE** — pre-existing; consistent with the skill's own hard_rule. Fix: note the confirmation gate in the quick-start. |
| P1 | `cli-opencode/README.md:63-76` | A published default dispatch recipe uses `--agent context`, contradicting the SKILL.md ALWAYS-rule-3 "no top-level `--agent`" contract. | **PLAUSIBLE** — verified the recipe uses `--agent`; SKILL rule 3 says current opencode rejects a top-level `--agent`. Pre-existing doc/contract drift. Fix: align the README recipe with the no-`--agent` rule. |

### WS-B — spec-packet advisory refinements (polish on plans that already passed Fable-5 + validate.sh 0/0)

| Sev | File:line | Finding | Adjudication |
|-----|-----------|---------|--------------|
| P1 | `126.../005-foldin-clickup-and-figma/spec.md:113` | The known ClickUp auth/config drift (OAuth `mcp-remote` in SKILL vs `@clickup/mcp-server` API-key in `.utcp_config.json`) is deferred but sits outside every release gate — nothing in the plan catches it at cutover. | **CONFIRMED (as scoped)** — this is the deliberately-deferred pre-existing drift; the finding is that "deferred" ≠ "gated". Advisory: add a cutover checklist line acknowledging the known-deferred item so it's visible, not silently dropped. |
| P1 | `126.../004-onboard-chrome-devtools/plan.md:85-88` | The relative cross-skill link handling has a grep-string move gate, not a resolution-based one (a grep for `../mcp-` finds references but doesn't verify they RESOLVE post-move). | **CONFIRMED** — real incremental hardening beyond WS2's wording fix. Advisory: add a link-resolves check (not just a path-string grep) to the move gate. |
| P1 | `125.../003-scaffold-hub/spec.md:104-105,121` | Phase-003 authors the hub graph-metadata scaffold before phase-005's scorer atomic bundle, so the hub identity exists in doc-order before the scorer is hub-aware. | **PLAUSIBLE, mitigated** — safe given the "no advisor graph rebuild until phase 006" invariant WS1 added (the scaffold's metadata doesn't take effect until after the 005 scorer rewrite). Advisory: state that invariant explicitly in phase 003, not only 005/006. |
| P2 | `126.../006-advisor-and-integration/spec.md:72` | The phase-006 scope boundary obscures its own mcp-code-mode metadata exception (the ADR-005 carve-out permitting the reverse-edge repoint). | **PLAUSIBLE** — clarity refinement. Advisory: cross-reference the ADR-005 carve-out at the scope-boundary line. |
| P2 | `125.../spec.md:128` | The parent phase map leaves the phase-001 write boundary implicit (001 is a read-only research gate but the map doesn't say so). | **PLAUSIBLE** — minor. Advisory: mark 001 read-only in the map. |

## 4. Remediation Workstreams

- **WS-A (pre-existing cli-opencode, P1×4)**: content-hygiene cleanup of cli-opencode itself — the pkill self-contradiction (real safety bug), the stale codex sibling-row, and two README/contract drifts. **Not caused by this program's rename**; scope as a separate small cli-opencode cleanup so the rename's completion claim stays honest.
- **WS-B (packet polish, P1×3 + P2×2)**: optional refinements to the two plans (resolution-based move gate, explicit scaffold/scorer ordering invariant, clickup-drift cutover visibility, ADR-005 carve-out cross-ref, phase-001 read-only marker). None block; the plans already passed Fable-5 + strict validation.

## 5. Spec Seed
- A `cli-opencode` content-hygiene packet owns WS-A (label it pre-existing/inherited, like the last review's WS-B split).
- WS-B folds into the 125/126 packets at their next revision or execution prep.

## 6. Plan Seed
1. WS-A: fix the Rule-16 pkill scope (highest value — real safety bug), delete the stale README codex row, align the two README doc/contract drifts.
2. WS-B: 5 plan refinements as above.

## 7. Traceability Status
- **Core**: spec_code — PASS (both packets structurally match their ADRs; findings are peripheral). checklist_evidence — PASS (both packets validate.sh --recursive --strict 0/0, independently re-confirmed).
- **Overlay**: the cli-opencode findings are self-contained doc/contract drift within one skill; the packet findings are advisory.
- **AC_COVERAGE**: exempt (review target is completed/planned work, not lifecycle-active implementation).

## 8. Deferred Items
- WS-A cli-opencode content bugs: deferred to a separate cleanup packet by design (pre-existing, not this program's fault). Named, not dropped.
- The ClickUp auth/config drift: already a documented deferral in 126; this review adds "make it visible at cutover" as advisory.

## 9. Search Ledger
*v1 iteration records (router leaf did not emit reviewDepthSchemaVersion:2).* Dimension coverage 4/4 across 2.5 passes; convergence 0.8; no reducer-owned searchDebt.

## 10. Audit Appendix
- **Convergence**: newFindingsRatio 0.5 → 1.0 → 0.17 → 0.0 → 0.0 → 0.0 → 0.1 → 0.25 → 0.0 → 0.2. Later passes largely dry (5 of the last 6 iterations found ≤1 new finding); converged at coverage 4/4.
- **Coverage**: correctness (1,5,9), security (2,6,10), traceability (3,7), maintainability (4,8).
- **Executor**: real dispatch per iteration, route-proof verified on all 10 via `verify-iteration.cjs`. Models: 1–9 gpt-5.6-terra-fast/high, 10 gpt-5.6-sol-fast/high.
- **Sources reviewed**: 41 scope files (both packets' spec.md/plan.md/decision-record.md + the 5 cli-opencode rename files).

Review verdict: CONDITIONAL
