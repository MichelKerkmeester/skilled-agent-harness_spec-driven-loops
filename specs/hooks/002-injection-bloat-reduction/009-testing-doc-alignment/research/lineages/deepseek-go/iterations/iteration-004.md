# Iteration 4: Remaining root playbooks, feature-flag reference layer, and dispatch playbooks

## Focus

Complete the sweep of the remaining cli-executor root playbook bodies, the system-spec-kit feature-flag-reference catalog/playbook layer, and the dispatch/audit shared playbooks — confirming the breadth of the "zero old-contract assertions" result and pinning down the feature-flag catalog omission.

## Findings

### F14 — All cli-executor root playbook bodies are clear of delivery-contract assertions

Checked the root `manual-testing-playbook.md` of claude-code, devin, pi, codex, cursor, opencode, cli-external-orchestration hub, system-deep-loop, sk-git, and sk-code:
- `cli-devin` root: only DV-007's event-count table (6 events observed live under bypass) — describes lifecycle-event delivery for Devin, accurate; the "approval delivery" phrase (`:68`) refers to Devin `PermissionRequest`, not Gate-3 confirmation. Not stale.
- `cli-pi` root (`:284`): "live `session_start` restore delivery through Pi's real extension loader" — Pi lifecycle delivery, unrelated to the changed contract.
- `sk-code` root (`:188`, `:313`): WEBFLOW Lenis/IntersectionObserver and post-edit-quality-router kill-switch — unrelated vocabulary ("gate" here = IntersectionObserver / quality gate). Not stale.
- `sk-git` root (`:158,868-872`): Git Preflight Advisory suppression (`SKGIT_ADVISORY`) — a different suppression surface. Not stale.
- `system-deep-loop` root (`:109,193,222`): routing-observation language ("observed route matched registry entry") — refers to mode routing, not delivery receipts. Not stale.
- `cli-claude-code` root: no gate/delivery vocabulary at all.

### F15 — system-spec-kit feature-flag-reference catalog and playbook layers have ZERO spec-gate env coverage

Both `.opencode/skills/system-spec-kit/feature-catalog/feature-flag-reference/` (12 files) and `manual-testing-playbook/feature-flag-reference/` (16 files) enumerate env flags across search/cache/MCP/memory/embedding/debug/CI layers. `grep -rniE 'MK_SPEC_GATE|GATE_3|DELIVERY_SUPPRESSION'` returns zero rows in both. The gate env vars that are load-bearing and documented in `ENV-REFERENCE.md` (`MK_SPEC_GATE_ENFORCE`, `MK_SPEC_GATE_DISABLED`, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`, `AI_SESSION_CHILD`) have no feature-catalog or playbook feature-flag entry. This is omission-stale: the flag reference layer cannot discover the delivery-suppression switch. (Phase 008 added the ENV-REFERENCE.md section; the feature-flag catalog/playbook layers were not swept.)

### F16 — Dispatch shared playbooks (preflight + audit) use "suppress"/"observe" for unrelated surfaces

- `cli-dispatch-preflight-authorization.md`: zero spec-gate/delivery matches (the catalog twin references "spec-gate content" only as injected text that must not authorize a dispatch — accurate).
- `cli-dispatch-audit-trail.md`: "observe" / "suppressed" refer to dispatch-audit kill-switch (`MK_CLI_DISPATCH_AUDIT_DISABLED=1`) and observation of tool calls — a different observer surface from Gate-3 delivery observation. Its assertions (38/38 core tests, redacted JSONL) are about dispatch audit, unchanged by the injection-bloat work. Not stale.

### F17 — The sk-code advisor-probe-battery playbook's gate references are classifier routing probes, not delivery

`sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md` P2/P4/P7/P8/N5 reference `gate-3-classifier.ts`, `gate3-baseline.json`, and "Gate 3 confusion-matrix rows" — these are skill-routing battery prompts for the classifier, unrelated to the delivery-observation layer. Not stale. (P7/P8/N5 are golden probes, not authoritative contract assertions about delivery.)

## Sources Consulted

- [SOURCE: root playbook bodies of claude-code, devin, pi, codex, cursor, opencode, cli-external-orchestration, system-deep-loop, sk-git, sk-code]
- [SOURCE: grep MK_SPEC_GATE/GATE_3/DELIVERY_SUPPRESSION over system-spec-kit feature-flag-reference (catalog + playbook) → zero rows]
- [SOURCE: .opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/{cli-dispatch-preflight-authorization,cli-dispatch-audit-trail}.md]
- [SOURCE: .opencode/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md]

## Assessment

newInfoRatio: 0.15
noveltyJustification: Confirms the breadth of the zero-old-contract result across all remaining root playbooks and the dispatch layer; F15 adds the feature-flag-reference omission. Confirmatory rather than novel — consistent with the max-iterations stop policy continuing past convergence.

Key questions answered: Q1, Q2, Q3, Q4 (all essentially complete; remaining is the must-fix/optional split formalization).

## Reflection

What worked: targeted grep over root playbook bodies cleared the last large surface quickly; the feature-flag layer check completed the flag-reference coverage picture.

What failed / ruled out: Ruled out dispatch-audit "observe/suppress" and sk-git "advisory suppression" as unrelated. Ruled out advisor-probe-battery as a delivery-contract surface.

## Recommended Next Focus

Iteration 5: Verify the post-emission observer timing claims in the four stdout adapters + Pi against the actual code once more (line-level), and confirm the byte-identical/fail-open flags-off claim is what the negative-control test fixtures assert, then begin consolidating the must-fix vs optional split and the authoritative-contract verdict. Also check the two sibling lineage dirs (luna) for any cross-lineage state to avoid duplicate findings.
