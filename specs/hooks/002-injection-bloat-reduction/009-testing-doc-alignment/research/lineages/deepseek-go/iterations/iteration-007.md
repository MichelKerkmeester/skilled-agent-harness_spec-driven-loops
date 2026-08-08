# Iteration 7: Plugins README, shadow-id/receipts API references, and remaining plugins-and-hooks playbooks

## Focus

Broaden the review to the plugins README inventory, the shadow-delivery shadow-id / receipts-API vocabulary, and the remaining system-spec-kit plugins-and-hooks playbooks (completion, session, memory, dist-freshness) — confirming no catalog or playbook references the shadow-delivery machine's identifiers.

## Findings

### F25 — Zero catalog/playbook references to the shadow-delivery machine's shadow id or receipts API

Grep across all live feature-catalog + playbook files for `shadow.gate3-delivery-suppression.v1` (the shipped `GATE_3_DELIVERY_SHADOW_ID`), `getGate3ShadowReceipts`, `GATE_3_DELIVERY_STATE`, and `shadow-delivery`: **zero matches**. The shadow-delivery machine's observable identifiers appear only in `spec-gate-core.mjs` source and the updated READMEs. No catalog entry documents `getGate3ShadowReceipts` or the shadow-receipts surface at all — omission-stale (class A), not a contradiction.

### F26 — `.opencode/plugins/README.md:34` inventory line for `mk-spec-gate.js` is accurate but minimal

The plugins README lists `mk-spec-gate.js` as "Classifies and evaluates mutation-gate state." — a true, one-line inventory entry. It does not mention the plugin's post-emission delivery observer or the suppression flag; as a top-level inventory it is not the authoritative delivery-contract surface, so this is at most a mild under-specification (optional note), not stale.

### F27 — Remaining plugins-and-hooks playbooks contain no changed-contract assertions

- `spec-memory-plugin.md:29,333` uses "delivery mechanism" / "delivery path" to describe the continuity-substrate bridge and the sibling Claude Code hooks (`user-prompt-submit.js`, `session-prime.js`) — a different delivery meaning (continuity injection), and its assertions (13/13 unit tests, kill-switch `MK_SPEC_MEMORY_PLUGIN_DISABLED`) are accurate.
- `completion-evidence-sentinel.md`, `session-cleanup-plugin.md`, `speckit-completion-exposer.md`, `dist-freshness-guard.md` show zero spec-gate/delivery/epoch/suppression vocabulary in the changed-contract sense (completion-sentinel and dist-freshness describe their own kill-switch/evidence flags).

### F28 — Broadened-surface verdict is final: the sweep is clean except the count + two omission classes

Across 7 iterations the reviewed surface covers: all 3 root playbook matches, all cli-cursor hook scenarios (CU-013/014/020, task-dispatch), the codex-hook-parity shared playbook, the devin DV-009/DV-021 and pi PI-014/PI-016 scenarios, the system-spec-kit spec-mutation-gate-enforce + plugins-and-hooks set, the system-skill-advisor CL-001 + NC-010 + goal-opencode-plugin, the sk-code advisor-probe-battery, the sk-git GIT-028 + pre-push-naming, the feature-flag-reference catalog/playbook layers, the ~50-file paraphrase net, the plugins README, and the two sibling-lineage-matched catalogs. The consolidated finding set (F2/F6 + class-A/class-B omissions) is closed.

## Sources Consulted

- [SOURCE: grep shadow.gate3 / GATE_3_DELIVERY_SHADOW_ID / getGate3ShadowReceipts / shadow-delivery over live playbook+catalog → zero]
- [SOURCE: .opencode/plugins/README.md:34]
- [SOURCE: .opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/{spec-memory-plugin,completion-evidence-sentinel,session-cleanup-plugin,speckit-completion-exposer,dist-freshness-guard}.md]

## Assessment

newInfoRatio: 0.1
noveltyJustification: F25/F27 clear the final vocabulary and playbook surfaces; F26 confirms the plugins README is accurate-but-minimal. The finding set is stable and closed; remaining iterations per max-iterations policy will re-verify rather than discover.

Key questions answered: Q1-Q5 (all closed).

## Reflection

What worked: grepping for the shadow machine's exact identifiers gave a clean zero; the plugins-and-hooks set needed only two file reads to clear.

What failed / ruled out: Ruled out spec-memory-plugin's "delivery" language (continuity substrate). Ruled out plugins README as stale.

## Recommended Next Focus

Iteration 8: Re-verify the P1 must-fix count finding independently (re-run the suite once more and re-read the exact playbook lines), and check whether the playbook's step-1 count (11/11 for mk-spec-gate.test.cjs) is also current, then finalize the findings registry and prepare synthesis.
