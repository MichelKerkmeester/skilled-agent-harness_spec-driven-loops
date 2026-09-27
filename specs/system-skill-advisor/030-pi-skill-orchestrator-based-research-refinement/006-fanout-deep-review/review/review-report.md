# Deep Review Report: Advisor Refinements (Two-Model Fan-Out)

Target: the 38 files in `../goal-file-manifest.txt`, the code, tests and docs that phases 2 to 5 of this packet changed, plus the research-workflow fix made while closing phase 1.
Lineages: `mimo` (MiMo v2.6 Pro, high) and `deepseek` (DeepSeek V4.1 Flash, max), both through cli-pi on LLM Gateway, three iterations each, stop policy `max-iterations`. Per-lineage reports: `lineages/mimo/review-report.md`, `lineages/deepseek/review-report.md`. Merge: `deep-review-findings-registry.json`, `fanout-attribution.md`.

---

## 1. Executive Summary

- **Verdict: PASS**, `hasAdvisories: true`.
- Active findings after the adversarial self-check: **P0 0, P1 0, P2 12**.
- The merge reported CONDITIONAL with one P1 (R1-P1-001). The self-check below downgraded it to P2: the published contract makes interior hashes opt-in, and the in-code comment overstates the guarantee. It is also in code this packet did not change.
- Both lineages ran three iterations and closed with `synthesis_complete`. Dimension coverage 4 of 4 in each.
- Scope summary: the Claude shim and the Codex, Cursor and Devin adapters, the advisor hook, CLI and daemon request path, the fallback renderer, the OpenCode plugin, the Pi prompt advisor, the review and research close-out steps and Pi's `edit_lines` refusal.

---

## 2. Planning Trigger

`/speckit:plan` is optional. No P0 or P1 is active. Three P2 items touch code this packet changed and are cheap to fix together (F003, F002 with R2-P2-002, R1-P2-002). The rest are pre-existing and can wait for the next change to their file.

Planning Packet:

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    { "id": "F003", "severity": "P2", "title": "Three hardcoded runtime enums reject pi, codex, cursor and devin outcome events", "file": ".skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts", "line": 349 },
    { "id": "F002", "severity": "P2", "title": "Operator budget above the shim kill ceiling is silently ineffective", "file": ".skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts", "line": 105 },
    { "id": "R2-P2-002", "severity": "P2", "title": "Shim nested deadline holds only when SPECKIT_CLAUDE_HOOK_TIMEOUT_MS is unset", "file": ".skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts", "line": 102 },
    { "id": "R1-P2-002", "severity": "P2", "title": "Pi directive-dedup normalization never participates in dedup identity", "file": ".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts", "line": 142 },
    { "id": "R1-P1-001", "severity": "P2", "title": "edit_lines interior-hash verification is opt-in while its comment says every line is verified", "file": ".pi/extensions/pi-cache-optimizer/index.ts", "line": 8201 },
    { "id": "R3-P2-001", "severity": "P2", "title": "Interior-drift test covers only the line_hashes path", "file": ".pi/extensions/pi-cache-optimizer/tests/hash-verified-edits.test.ts", "line": 150 },
    { "id": "R1-P2-003", "severity": "P2", "title": "Review close-out never folds lineage state logs", "file": ".skilled/commands/deep/assets/deep-review-auto.yaml", "line": 2407 },
    { "id": "R3-P2-002", "severity": "P2", "title": "Close-out invariant program duplicated inline across the auto workflows", "file": ".skilled/commands/deep/assets/deep-review-auto.yaml", "line": 2260 },
    { "id": "F005", "severity": "P2", "title": "Confirm-mode review never consumes stop_policy", "file": ".skilled/commands/deep/assets/deep-review-confirm.yaml", "line": 38 },
    { "id": "R2-P2-001", "severity": "P2", "title": "Hook passes the full prompt to the CLI in argv", "file": ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts", "line": 224 },
    { "id": "F004", "severity": "P2", "title": "Diagnostics log created with default permissions under os.tmpdir()", "file": ".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts", "line": 182 },
    { "id": "F001", "severity": "P2", "title": "Dead exported fallback-gate helper has no caller", "file": ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts", "line": 160 }
  ],
  "remediationWorkstreams": [
    "WS-A (P2, packet code): derive the three outcome-event runtime enums from ADVISOR_RUNTIME_VALUES - F003",
    "WS-B (P2, packet code): clamp the shim's pass-through budget below its kill deadline, or document the ceiling - F002, R2-P2-002",
    "WS-C (P2, packet code): make the Pi dedup key use the normalized parts, or reword its comment - R1-P2-002",
    "WS-D (P2, pre-existing): correct the edit_lines comment to the endpoint-plus-count contract and add a no-line_hashes test - R1-P1-001, R3-P2-001",
    "WS-E (P2, pre-existing): fold lineage state logs into the review close-out and share one close-out script - R1-P2-003, R3-P2-002, F005",
    "WS-F (P2, pre-existing): prompt over stdin, 0o700/0o600 diagnostics, delete the dead helper - R2-P2-001, F004, F001"
  ],
  "specSeed": [
    "Name ADVISOR_RUNTIME_VALUES as the single runtime vocabulary for every input enum.",
    "State the ceiling on SPECKIT_CLAUDE_HOOK_TIMEOUT_MS under the Claude shim.",
    "State that edit_lines guarantees endpoints and line count, and interiors only with line_hashes."
  ],
  "planSeed": [
    "WS-A: replace the three literals with ADVISOR_RUNTIME_VALUES and keep the manifest parity suite green.",
    "WS-B: clamp the child budget to min(operator value, CHILD_TIMEOUT_MS - CHILD_START_MARGIN_MS) with a test for an operator value of 5000.",
    "WS-C: compare the normalized directive parts in decidePiDirectiveDelivery, with a headed and headless pair test."
  ],
  "findingClasses": ["drift", "boundary", "contract-doc-mismatch", "evidence-gap", "convergence-telemetry", "duplication-drift", "consistency", "local-disclosure", "hardening", "dead-code"],
  "affectedSurfacesSeed": [
    "runtime/schemas/advisor-tool-schemas.ts", "runtime/tools/advisor-validate.ts", "runtime/skill-advisor-cli-manifest.ts",
    "system-spec-kit Claude hook shim", "hooks/pi/prompt-advisor.ts", ".pi/extensions/pi-cache-optimizer",
    "deep-review-auto.yaml", "deep-review-confirm.yaml", "hooks/lib/skill-advisor-cli-fallback.ts", "runtime/lib/metrics.ts"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

"Checked" means the orchestrator opened the cited lines during synthesis. The other rows are the lineage's claim with its own evidence.

| ID | Sev | Dimension | Title | File:line | Evidence | Fix | Lineage | Checked | In packet code |
|----|-----|-----------|-------|-----------|----------|-----|---------|---------|----------------|
| F003 | P2 | maintainability | Runtime enums reject the runtimes phase 2 added | `runtime/schemas/advisor-tool-schemas.ts:349`, `runtime/tools/advisor-validate.ts:22`, `runtime/skill-advisor-cli-manifest.ts:89` | All three hardcode `['claude','copilot','opencode']`; `ADVISOR_RUNTIME_VALUES` has seven | Derive from `ADVISOR_RUNTIME_VALUES` | deepseek | yes, confirmed | adjacent: phase 2 grew the list, not these copies |
| F002 | P2 | correctness | Operator budget above the shim ceiling is ineffective | `system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:105-121` | Operator value passes through, spawn kills at 2500 ms and returns `{}` | Clamp or document | deepseek | yes, confirmed | yes |
| R2-P2-002 | P2 | security | Same issue as F002, seen as a nested-deadline gap | same file `:102-116` | as F002 | Clamp to `min(env, CHILD_TIMEOUT_MS - margin)` | mimo | yes, same as F002 | yes |
| R1-P2-002 | P2 | correctness | Pi dedup normalization not used in the key | `hooks/pi/prompt-advisor.ts:84-92,138-143` | Compares raw `context`, normalized parts only gate eligibility | Compare normalized parts or reword the comment | mimo | no | yes |
| R1-P1-001 | P2 (from P1) | correctness | `edit_lines` interior hashes are opt-in | `.pi/extensions/pi-cache-optimizer/index.ts:8201-8213` | Interior check runs only when `line_hashes` is supplied | Correct the comment, or require interior hashes | mimo | yes, see section 7 | no: code from 2026-09-09 |
| R3-P2-001 | P2 | traceability | Interior-drift test only covers `line_hashes` | `.pi/extensions/pi-cache-optimizer/tests/hash-verified-edits.test.ts:150` | Every case supplies `line_hashes` | Add a minimal-call case | mimo | no | no |
| R1-P2-003 | P2 | correctness | Review close-out never folds lineage logs | `deep-review-auto.yaml:2407` | Root state log absent on fan-out | Fold lineage logs as research does | mimo | yes: this run's root has no state log | known limitation recorded in phase 5 |
| R3-P2-002 | P2 | maintainability | Close-out program duplicated across auto workflows | `deep-review-auto.yaml:2260` | Inline programs already diverged | One shared script | mimo | no | partly: phase 5 touched both copies |
| F005 | P2 | traceability | Confirm-mode review ignores `stop_policy` | `deep-review-confirm.yaml:38`, `:618-660` | Only auto implements the clause | Port the clause or document | deepseek | no | no |
| R2-P2-001 | P2 | security | Prompt in the CLI child's argv | `hooks/lib/skill-advisor-cli-fallback.ts:224-243` | `--json JSON.stringify(payload)` carries `prompt` | Send over stdin | mimo | yes, confirmed | no: pattern predates the packet |
| F004 | P2 | security | Diagnostics files use default permissions | `runtime/lib/metrics.ts:182,274-278,302-325` | No mode on mkdir or append | `0o700` root, `0o600` files | deepseek | no | partly: phase 2 changed the trim |
| F001 | P2 | maintainability | Dead exported fallback-gate helper | `hooks/lib/skill-advisor-cli-fallback.ts:160` | No caller found repo-wide | Delete or wire up | deepseek | no | no |

---

## 4. Remediation Workstreams

No P0 or P1 workstream. P2 advisories, packet code first:

1. **WS-A** F003. Derive the outcome-event runtime enums from `ADVISOR_RUNTIME_VALUES`.
2. **WS-B** F002, R2-P2-002. Clamp the shim's pass-through budget, or document the ceiling.
3. **WS-C** R1-P2-002. Pi dedup key.
4. **WS-D** R1-P1-001, R3-P2-001. `edit_lines` comment and minimal-call test.
5. **WS-E** R1-P2-003, R3-P2-002, F005. Review close-out and confirm-mode stop policy.
6. **WS-F** R2-P2-001, F004, F001. Prompt transport, diagnostics permissions, dead helper.

---

## 5. Spec Seed

- Every advisor input that names a runtime accepts the same list as `ADVISOR_RUNTIME_VALUES`.
- `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` has a stated ceiling under the Claude shim.
- `edit_lines` states its guarantee as endpoints and line count, with interiors covered only when `line_hashes` is supplied.

---

## 6. Plan Seed

- WS-A: replace three literals, run the manifest parity suite and the advisor runtime suite.
- WS-B: clamp in the shim, add a shim test with an operator value of 5000 that still gets the fallback.
- WS-C: key on the normalized parts, test a headed and a headless brief with identical directives.

---

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | pass | Both lineages checked the phase 2 to 5 requirements against the code. The only contract gap found (F002, R2-P2-002) is an operator-override edge that the phase 2 requirement did not cover |
| checklist_evidence | n/a | Level 1 phases, no checklist |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| skill_agent | partial | R1-P2-002, the Pi dedup comment against its code |
| agent_cross_runtime | pass | Runtime labels checked across Claude, Codex, Cursor, Devin and Pi; F003 is the one input surface left behind |
| feature_catalog_code | n/a in review | Catalog updates are phase 7's scope |
| playbook_capability | n/a in review | as above |

**AC_COVERAGE**: exempt, Level 1.

**Adversarial self-check of the one P1 (R1-P1-001)**

- Hunter: `.pi/extensions/pi-cache-optimizer/index.ts:8201-8213` confirms that the interior loop checks a line only when `edit.line_hashes?.[i - fromIdx]` is defined, and the schema's `required` list omits `line_hashes`.
- Skeptic: the schema describes `line_hashes` as "Optional hashes for every line from..to, in order, so an edit whose interior drifted is refused rather than overwritten" (`index.ts:7985-7986`). The README promises only that the edit applies "when the endpoint hashes it is given still match the file" (`.pi/extensions/pi-cache-optimizer/README.md:130`). So the published contract is endpoints plus line count, with interiors opt-in. The comment "Every line in the range is verified" is what overstates.
- Referee: downgraded to P2, matching the lineage's own downgrade trigger. The code dates from 2026-09-09 (`e2a1c45306`), before this packet; phase 5 changed only the `line_count` refusal message.

**Resource Map Coverage Gate**: skipped. `reduce-state.cjs --emit-resource-map` exits 3 at a fan-out root because the root has no `deep-review-state.jsonl`, the same gap R1-P2-003 records. No lineage emitted a resource map.

---

## 8. Deferred Items

- WS-D, WS-E and WS-F are pre-existing and can ride the next change to their files.
- The fan-out summary recorded a containment advisory on the `mimo` lineage: 54 out-of-scope dirty paths, preserved and quarantined under `lineages/mimo/containment/quarantine/1/`, none reverted. The paths are another session's in-flight work in the shared checkout and one edit this session made to the packet's parent `spec.md` while the review ran. That attribution is inferred from the file set; containment cannot attribute writers.
- The `deepseek` lineage ran as attempt 2 (`retry_attempts: 1`). Its three iteration records predate the attempt-2 window, which is what the timestamp anomaly reports. Attempt 2 found the iterations done and ran only the lineage synthesis. No iteration was duplicated: the state log holds exactly three iteration records.

---

## Dimension Expansion Map

No divergence pivots, Council artifacts or audited overrides were recorded in either lineage. Each lineage covered correctness, security, traceability and maintainability once in its three iterations.

---

## 9. Search Ledger

*No search-depth state captured at the fan-out root.* Each lineage keeps its own search record in its iteration files and its `review-report.md`.

---

## 10. Audit Appendix

**Convergence**: stop reason `maxIterationsReached` in both lineages, as the `max-iterations` stop policy requires. Attribution convergence scores: deepseek 0.2, mimo 0.

**Coverage**: 4 of 4 dimensions in each lineage. Files reviewed: the 38 in `../goal-file-manifest.txt`.

**Ruled-out claims**: none carried from either lineage.

**Cross-reference appendix**

- Core Protocols: `spec_code` pass, `checklist_evidence` n/a.
- Overlay Protocols: `skill_agent` partial, `agent_cross_runtime` pass, `feature_catalog_code` n/a, `playbook_capability` n/a.

**Sources**: `lineages/*/iterations/iteration-00{1,2,3}.md`, `lineages/*/deep-review-findings-registry.json`, `deep-review-findings-registry.json`, `fanout-attribution.md`, `orchestration-summary.json`.
