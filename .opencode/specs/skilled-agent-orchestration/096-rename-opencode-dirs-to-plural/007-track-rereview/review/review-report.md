---
title: "Deep Review Report — track:skilled-agent-orchestration (re-review #2, post-100/101)"
description: "Synthesis of 8-iteration architectural cross-phase deep-review: confirms 099→100 verdict-flip for 13/13 carryover P1s; identifies 2 NEW P1 regressions introduced by 101 cli-opencode wiring; verdict CONDITIONAL — release blocked until 4 advisories + 2 regressions are addressed."
trigger_phrases:
  - "102 review report"
  - "deep-review 093-101 verdict"
  - "cli-opencode regression report"
importance_tier: "important"
contextType: "general"
---

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

**Verdict:** **CONDITIONAL** (`hasAdvisories=true`)

**Headline:** Re-review #2 of the 099→100 verdict-flip succeeds in confirming **13 of 13** prior carryover P1 findings have been RESOLVED by `100-099-remediation`. Verdict on the 099-carryover scope alone would be **PASS**. However, packet `101-cli-opencode-executor` introduced **2 NEW P1 regressions** while wiring the 5th deep-loop executor — both regressions are localized to the cli-opencode dispatch surface (`--pure` missing in 4 deep-loop YAML branches; `sandboxMode` declared in `EXECUTOR_KIND_FLAG_SUPPORT` but ignored at runtime). The aggregate verdict is therefore **CONDITIONAL**.

**Active Findings:** 0 P0 / 2 P1 / 4 P2 (deduped)

| Bucket | 099-carryover | 101-introduced | Total active |
|--------|---------------|----------------|--------------|
| P0 | 0 (RESOLVED 13/13 P1 gate kept P0=0) | 0 | **0** |
| P1 | 0 (RESOLVED 13/13) | 2 | **2** |
| P2 | 0 deduped (resolved or absorbed by 100) | 4 | **4** |

**Review Scope (8 iterations across 4 dimensions):**

- 9 priority packets (`093` through `101` + the `102` packet itself for self-validation)
- 4 deep-loop YAML files (`spec_kit_deep-{research,review}_{auto,confirm}.yaml`)
- 1 executor-config TypeScript module + 1 advisor aliases module + 1 advisor scoring-lane module
- 1 reducer script (`reduce-state.cjs`) for the P1-026 fix audit
- 4 cli-* SKILL.md files for runtime-mirror parity audit
- 2 hook surfaces (Stop hook NODE_ENV gate; SessionStart hooks)
- 16+ implementation-summary.md cross-reference spot-checks for the 099→100 closed-gate replay

**Convergence:** Iter-6/7/8 newFindingsRatio = 0.00/0.00/0.00; weighted_stop_score = 1.0; all 7 legal-stop gates green; coverage_age ≥ 1.

**Stop reason:** `converged`
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:planning-trigger -->
## 2. Planning Trigger

**`/spec_kit:plan` REQUIRED** — verdict `CONDITIONAL` blocks release. The 2 active P1 regressions plus 4 P2 advisories should be folded into a remediation packet (e.g. `103-101-remediation`) before the next release window opens.

```json Planning Packet
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 2,
    "P2": 4
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1-cli-opencode-yaml-fix",
      "severity": "P1",
      "title": "Add --pure to all 4 if_cli_opencode YAML branches and document DeepSeek-family requirement",
      "findingsAddressed": ["P1-027"],
      "affectedSurfaces": [
        ".opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml",
        ".opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml",
        ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml",
        ".opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml",
        ".opencode/skills/cli-opencode/SKILL.md"
      ]
    },
    {
      "id": "WS-2-cli-opencode-sandbox-contract",
      "severity": "P1",
      "title": "Resolve sandboxMode runtime-contract violation: either remove from EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode'] OR branch YAML on sandboxMode",
      "findingsAddressed": ["P1-028"],
      "affectedSurfaces": [
        ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts",
        ".opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml",
        ".opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml",
        ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml",
        ".opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml"
      ]
    },
    {
      "id": "WS-3-advisor-alignment",
      "severity": "P2",
      "title": "Resolve advisor coverage asymmetry for cli-opencode (alias OR scoring-lane entry; reframe doc claim accordingly)",
      "findingsAddressed": ["P2-027", "P2-027r"],
      "affectedSurfaces": [
        ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts",
        ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts",
        ".opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/006-cli-opencode-executor/spec.md",
        ".opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-strategy.md"
      ]
    },
    {
      "id": "WS-4-cli-opencode-tests",
      "severity": "P2",
      "title": "Add 4-case unit-test coverage for cli-opencode in executor-config.vitest.ts (mirror cli-claude-code pattern)",
      "findingsAddressed": ["P2-028"],
      "affectedSurfaces": [
        ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts"
      ]
    },
    {
      "id": "WS-5-doc-drift-fix",
      "severity": "P2",
      "title": "Reconcile 102 strategy doc surface inventory with 101 implementation-summary",
      "findingsAddressed": ["P2-032"],
      "affectedSurfaces": [
        ".opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-strategy.md",
        ".opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/006-cli-opencode-executor/implementation-summary.md"
      ]
    }
  ],
  "specSeed": [
    "Title: Remediate 101 cli-opencode wiring regressions + advisor alignment",
    "Problem: cli-opencode dispatch path is broken under DeepSeek-family models (--pure missing); sandboxMode contract violation; advisor coverage asymmetric",
    "Out of scope: re-doing 100 fixes (already validated PASS); rewriting cli-opencode skill",
    "Files to change: 4 deep-loop YAMLs, executor-config.ts, aliases.ts, lanes/explicit.ts, executor-config.vitest.ts, cli-opencode/SKILL.md, 102 strategy doc",
    "Success criteria: cli-opencode + DeepSeek smoke PASSES under default plugins (no --pure required) OR YAML emits --pure unconditionally; sandboxMode either rejected by parser or honored by YAML; advisor scoring-lane entry exists for cli-opencode; 4 vitest cases land green"
  ],
  "planSeed": [
    "Phase 1 (P1 fixes): Add --pure to all 4 YAML branches; decide sandboxMode disposition (reject vs. branch)",
    "Phase 2 (P2 cleanup): Add advisor scoring lane entry; add 4 vitest cases; reconcile doc surface inventory",
    "Phase 3 (verification): Re-run cli-opencode + DeepSeek-family smoke test; vitest green; doctor:skill-advisor PASS",
    "Phase 4 (release): /create:changelog + /spec_kit:deep-review:auto track:skilled-agent-orchestration on the remediation packet to confirm the verdict-flip back to PASS"
  ],
  "findingClasses": {
    "cross-consumer": ["P1-027", "P1-028"],
    "instance-only": ["P2-027", "P2-028"],
    "narrative-drift": ["P2-027r", "P2-032"]
  },
  "affectedSurfacesSeed": [
    ".opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml",
    ".opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml",
    ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml",
    ".opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml",
    ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts",
    ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts",
    ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts",
    ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts",
    ".opencode/skills/cli-opencode/SKILL.md"
  ],
  "fixCompletenessRequired": true
}
```
<!-- /ANCHOR:planning-trigger -->

---

<!-- ANCHOR:active-finding-registry -->
## 3. Active Finding Registry

### 3.1 P1 — Required (block PASS)

#### P1-027 — `--pure` missing from all 4 if_cli_opencode YAML branches

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | correctness |
| **Finding class** | cross-consumer |
| **First seen** | iter-1 (inventory pass) |
| **Last verified** | iter-8 (adversarial second-lens) |
| **Disposition** | active |
| **File:line evidence** | `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:717-726`, `_research_confirm.yaml:649-658`, `_review_auto.yaml:781-790`, `_review_confirm.yaml:758-767` |
| **scopeProof** | grep across 4 deep-* YAML files: 0 hits for `--pure` inside `if_cli_opencode` blocks (confirmed iter-1 and iter-8) |
| **Hunter** | All 4 branches invoke `opencode run` with `--model`, `--agent general`, `--format json`, `--dangerously-skip-permissions`, `--dir`, optional `--variant`. None include `--pure`. |
| **Skeptic** | Could downgrade if `--pure` were optional for the supported model set OR if DeepSeek-family models were excluded by policy. Neither holds: 101 spec.md cites OpenCode model/tool-name compatibility as known limitation; cli-opencode SKILL.md:226-234 frames `--pure` as the canonical fix. |
| **Referee** | **Confirmed P1.** Branch is present but not maintainably complete for the intended cli-opencode executor surface. |
| **Impact** | Default cli-opencode + DeepSeek-family dispatch fails with `Invalid 'tools[N].function.name': string does not match pattern '^[a-zA-Z0-9_-]+$'` because OpenCode's MCP tool prefix injects `:` into tool names. `--pure` removes plugin-loaded tools. Without `--pure`, the cli-opencode executor is silently unusable for the configured default model. |
| **Fix recommendation** | Add `--pure` to all 4 `opencode run` invocations after `--dangerously-skip-permissions` and before `{optional_variant_flag}`. Document DeepSeek-family `--pure` requirement in cli-opencode SKILL.md. |

##### Claim adjudication packet

```yaml
claim: "All 4 if_cli_opencode YAML branches lack --pure, breaking cli-opencode dispatch under DeepSeek-family models"
evidenceRefs:
  - ".opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:717"
  - ".opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml:649"
  - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:781"
  - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:758"
  - ".opencode/skills/cli-opencode/SKILL.md:226-234,273,299"
  - "review/deep-review-state.jsonl:2 (executor_fallback event documenting the smoke failure)"
counterevidenceSought: "Searched for --pure literal across 4 YAMLs (0 hits inside if_cli_opencode blocks); searched for alternative DeepSeek-compat flags (--no-tool-prefix, model-specific exclusion list); none exist. Verified opencode run --help to confirm --pure is the canonical mitigation."
alternativeExplanation: "Possible by-design choice to require operator to set --pure manually; ruled out because the cli-opencode SKILL.md positions it as the default flag for DeepSeek and the YAML hides the dispatch surface from operators."
finalSeverity: "P1"
confidence: "high"
downgradeTrigger: "(a) cli-opencode SKILL.md changes default model away from DeepSeek-family, OR (b) opencode binary stops injecting plugin tool prefixes by default."
```

#### P1-028 — `sandboxMode` declared in EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode'] but silently ignored

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | correctness |
| **Finding class** | cross-consumer |
| **First seen** | iter-3 |
| **Last verified** | iter-8 (adversarial second-lens) |
| **Disposition** | active |
| **File:line evidence** | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:37-40` (declaration); `:116-140` (parser validation); 4 YAML branches at the same lines as P1-027 (hardcoded `--dangerously-skip-permissions`) |
| **scopeProof** | Live `node` parser probe accepts `{ kind: 'cli-opencode', sandboxMode: 'read-only' }`; grep across YAML branches: 0 hits for `sandboxMode` reference inside `if_cli_opencode`; no `resolveOpencodeSandboxMode` helper exists. |
| **Hunter** | EXECUTOR_KIND_FLAG_SUPPORT declares sandboxMode for cli-opencode. Same comment claims conditional handling through --dangerously-skip-permissions, but YAML branches hardcode that flag and never inspect `{config.executor.sandboxMode}`. |
| **Skeptic** | Could be P2 if sandboxMode were documented as accepted-but-no-op. It is not — schema advertises supported fields and parser validates them as meaningful. |
| **Referee** | **Confirmed P1.** Schema-to-runtime contract violation. |
| **Impact** | Operator who sets `sandboxMode: read-only` for cli-opencode receives a silent no-op — the dispatch still runs with full write permissions. This is an authorization-surface defect (operator believes they configured restricted access; runtime ignores it). |
| **Fix recommendation** | Either (a) remove sandboxMode from EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode'] (parser then rejects like serviceTier), OR (b) branch YAML on sandboxMode and refuse to dispatch when read-only is requested but cli-opencode does not support read-only. |

##### Claim adjudication packet

```yaml
claim: "cli-opencode sandboxMode is declared supported by parseExecutorConfig but silently ignored by all 4 if_cli_opencode YAML branches"
evidenceRefs:
  - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:37-40"
  - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:116-140"
  - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:783"
  - "node parser probe: { kind: 'cli-opencode', sandboxMode: 'read-only' } accepted"
counterevidenceSought: "Grepped for sandboxMode usage downstream of parseExecutorConfig within YAML branches (0 hits inside if_cli_opencode). Grepped for resolveOpencodeSandboxMode helper (none exists). Verified that parser rejects unsupported fields (e.g., serviceTier for cli-opencode) — ruling out the no-op-pass-through interpretation."
alternativeExplanation: "Could be intentional placeholder for future implementation; ruled out because the comment at executor-config.ts:37-40 frames it as currently-honored, not deferred."
finalSeverity: "P1"
confidence: "high"
downgradeTrigger: "Either YAML adds sandboxMode-aware branch OR parser rejects sandboxMode for cli-opencode (matching the serviceTier reject pattern)."
```

### 3.2 P2 — Suggestion / Advisory (do not block PASS)

| ID | Severity | Title | Dimension | File:Line | Disposition |
|----|----------|-------|-----------|-----------|-------------|
| P2-027 | P2 | cli-opencode advisor alias claim in 101 strategy not reflected in `aliases.ts` | correctness | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts:5-27` | active |
| P2-027r | P2 | REFRAMED: actual defect is missing scoring lane entry, not missing alias | traceability | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:11,39` | active |
| P2-028 | P2 | Zero unit-test coverage for cli-opencode in `executor-config.vitest.ts` | correctness | `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts` | active |
| P2-032 | P2 | Strategy doc surface inventory drift — claims `aliases.ts` touched by 101 but 101 implementation-summary lists only 5 surfaces | traceability | `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-strategy.md` | active |

> **Dedup note:** P2-027 and P2-027r are paired — P2-027 was the initial discovery (alias missing); P2-027r is the iter-5 reframe (actual defect is the scoring-lane entry, not the alias). Both rows kept in registry for traceability; remediation should treat them as one workstream (WS-3) and explicitly reconcile the narrative.
<!-- /ANCHOR:active-finding-registry -->

---

<!-- ANCHOR:remediation-workstreams -->
## 4. Remediation Workstreams

Ordered P1 first, then P2; P1 fixes block PASS, P2s are advisory.

### WS-1 — cli-opencode YAML --pure fix (P1-027) — **HIGHEST PRIORITY**

- **Action:** Add `--pure` flag to all 4 `if_cli_opencode` `opencode run` invocations after `--dangerously-skip-permissions` and before `{optional_variant_flag}`.
- **Surfaces:** 4 YAML files in `.opencode/commands/spec_kit/assets/`.
- **Doc surface:** Update `cli-opencode/SKILL.md` to mark `--pure` as required-for-DeepSeek-family (not just plugin-crash-only) and document the YAML wiring.
- **Validation:** Re-run cli-opencode + DeepSeek smoke test under default plugins; expect PASS.

### WS-2 — cli-opencode sandboxMode contract (P1-028)

- **Action:** Decide disposition: (a) remove sandboxMode from `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']` (parser then rejects, matching serviceTier reject pattern), OR (b) branch YAML on `{config.executor.sandboxMode}` and refuse-to-dispatch when read-only requested.
- **Surfaces:** `executor-config.ts`, 4 YAML files.
- **Validation:** New vitest case asserting parser behavior matches chosen disposition (subsumed by WS-4).

### WS-3 — Advisor coverage asymmetry (P2-027 + P2-027r)

- **Action:** Reconcile the alias-vs-lane drift surfaced by iter-5 reframing. Either add cli-opencode entry to `lanes/explicit.ts` (so the advisor can route to it from cli-* triggers), OR update 101+102 narrative to clarify cli-opencode advisor coverage lives in its SKILL.md trigger phrases (no programmatic alias).
- **Surfaces:** `aliases.ts`, `lanes/explicit.ts`, 101 spec.md, 102 strategy doc.

### WS-4 — cli-opencode unit-test coverage (P2-028)

- **Action:** Add 4 cases to `executor-config.vitest.ts` mirroring the cli-claude-code pattern: (1) minimal accept, (2) serviceTier reject, (3) arbitrary-model accept, (4) reasoningEffort flowthrough sanity. Optionally add a 5th case for sandboxMode after WS-2 disposition.
- **Surfaces:** `executor-config.vitest.ts`.

### WS-5 — Doc drift fix (P2-032)

- **Action:** Reconcile 102 strategy doc claim with 101 implementation-summary. Either update the strategy doc to remove the aliases.ts claim OR confirm aliases.ts WAS touched and update the 101 implementation-summary to add it as a 6th surface.
- **Surfaces:** 102 strategy doc, 101 implementation-summary.md.

### Sequencing

1. **WS-1** + **WS-2** in one phase (both P1, both same surface family).
2. **WS-3** + **WS-4** + **WS-5** in a second phase (P2 cleanup, no blocker on each other).
3. Re-run `/spec_kit:deep-review:auto track:skilled-agent-orchestration` on the remediation packet to confirm verdict-flip back to PASS.
<!-- /ANCHOR:remediation-workstreams -->

---

<!-- ANCHOR:spec-seed -->
## 5. Spec Seed

- **Title:** Remediate 101 cli-opencode wiring regressions and advisor alignment (`103-101-remediation`)
- **Problem:** Packet `101-cli-opencode-executor` wired the 5th deep-loop executor across 6 surfaces; review #2 of the 099→100 verdict-flip surfaced 2 new P1 regressions and 4 new P2 advisories localized to that wiring. Remediate before the next release window.
- **Purpose:** Restore cli-opencode default-model dispatch path; close the schema-to-runtime contract violation on sandboxMode; tighten advisor coverage; add unit-test parity.
- **In scope:** 4 deep-loop YAML files; `executor-config.ts`; advisor `aliases.ts` and `lanes/explicit.ts`; `executor-config.vitest.ts`; `cli-opencode/SKILL.md`; 102 strategy doc; 101 implementation-summary.md.
- **Out of scope:** Re-doing 100 fixes (validated PASS); cli-opencode skill rewrite; DeepSeek API changes.
- **Success criteria:** cli-opencode + DeepSeek smoke PASS under default plugins (no --pure required at the YAML wiring layer); sandboxMode either rejected by parser or honored by YAML; advisor scoring-lane entry exists for cli-opencode; 4-5 vitest cases green; doctor:skill-advisor reindex PASS; re-review verdict PASS.
<!-- /ANCHOR:spec-seed -->

---

<!-- ANCHOR:plan-seed -->
## 6. Plan Seed

### Phase 1: P1 fixes

- **T-001:** Add `--pure` to `if_cli_opencode` branch in `spec_kit_deep-research_auto.yaml` (line ~717-726); test rendered prompt diff.
- **T-002:** Same for `spec_kit_deep-research_confirm.yaml` (line ~649-658).
- **T-003:** Same for `spec_kit_deep-review_auto.yaml` (line ~781-790).
- **T-004:** Same for `spec_kit_deep-review_confirm.yaml` (line ~758-767).
- **T-005:** Decide sandboxMode disposition (reject vs. branch); apply choice to `executor-config.ts` AND/OR 4 YAML branches.
- **T-006:** Update `cli-opencode/SKILL.md` to document `--pure` requirement for DeepSeek-family + sandboxMode disposition.

### Phase 2: P2 cleanup

- **T-007:** Resolve advisor coverage asymmetry — either add cli-opencode to `lanes/explicit.ts` or reframe narrative.
- **T-008:** Add 4 (or 5) vitest cases to `executor-config.vitest.ts` for cli-opencode.
- **T-009:** Reconcile 102 strategy doc surface inventory with 101 implementation-summary.

### Phase 3: Verification

- **T-010:** Re-run cli-opencode + DeepSeek smoke (`opencode run --model opencode-go/deepseek-v4-pro --variant high "test"`) — expect PASS without manual `--pure`.
- **T-011:** `npx vitest run executor-config.vitest.ts` — expect green.
- **T-012:** `python3 .opencode/commands/doctor/scripts/audit_descriptions.py` + `doctor:skill-advisor` — expect green.
- **T-013:** `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 103-101-remediation --strict` — expect 0 errors / 0 warnings.

### Phase 4: Release

- **T-014:** `/create:changelog` with verdict-flip narrative.
- **T-015:** `/spec_kit:deep-review:auto track:skilled-agent-orchestration` — expect verdict PASS (clean).
<!-- /ANCHOR:plan-seed -->

---

<!-- ANCHOR:traceability-status -->
## 7. Traceability Status

### Core Protocols

| Protocol | Status | Iteration | Evidence |
|----------|--------|-----------|----------|
| `spec_code` | **PASS** | 1, 6, 8 | 099→100 closed-gate replay: 13 of 13 P1 RESOLVED with file:line evidence (iter-1); 8 of 8 100/implementation-summary.md cross-references resolve in live tree (iter-6); 2 of 13 random spot-checks PASS in iter-8 (P1-026 + P1-021) |
| `checklist_evidence` | **PASS** | 6, 7, 8 | strict-validate `--strict` PASS on 099, 100, 101, AND 102 packets (iter-6 batch + iter-7 + iter-8 single); 11/11 checks each |

### Overlay Protocols

| Protocol | Status | Iteration | Evidence |
|----------|--------|-----------|----------|
| `skill_agent` | **PARTIAL** | 1, 5, 7 | cli-opencode SKILL.md ↔ executor-config.ts ↔ aliases.ts coherence: SKILL.md describes default model + `--pure`; executor-config.ts wires the kind; aliases.ts does NOT have a cli-opencode group (P2-027 reframed to P2-027r — actual gap is `lanes/explicit.ts:11,39`) |
| `agent_cross_runtime` | **PASS** | 7 | cli-* SKILL.md description budget audit (`audit_descriptions.py`): cli-opencode 121/130 chars OK; 4 cli-* SKILL.md sizes within tight 115-124 char range; no orphan `.claude/.gemini/.codex` cli-opencode SKILL.md mirrors (skills are not mirrored across runtime dirs by convention; agents are) |
| `feature_catalog_code` | **NOT_APPLICABLE** | — | No feature catalog packages in scope |
| `playbook_capability` | **PASS** | — (covered indirectly via 095 + 093 audit context in iter-5/6) | sk-code-review + sk-git playbooks ↔ playbook execution wiring intact per 100 cited surfaces |

### Resource Map Coverage Gate

resource-map.md was NOT present at packet root at init (`resource_map_present: false`); coverage gate was skipped per the workflow rule. Reducer emitted `review/resource-map.md` from converged deltas at synthesis time (default `config.resource_map.emit=true`). The map captures 6 distinct resources (1 command + 4 skills + 1 spec) — see `review/resource-map.md` for the deterministic table.
<!-- /ANCHOR:traceability-status -->

---

<!-- ANCHOR:deferred-items -->
## 8. Deferred Items

The following items were ruled out at severity-granularity OR explicitly deferred during the loop. They are advisory only and do NOT block release:

- **Line-number drift in 100 implementation-summary.md → reduce-state.cjs**: claims line 869 + 1305-1313 but actual is 875 + 1319 (iter-6). ±6 to ±14 line drift; all named functions exist; structural fix verifiable. Severity: below P2 threshold (informational). Disposition: ruled-out at severity-granularity.

- **`cli-copilot` is referenced by dormant if_cli_copilot YAML branch but is not a supported executor kind**: iter-8 sweep found `EXECUTOR_KINDS` is `[native, cli-codex, cli-gemini, cli-claude-code, cli-opencode]`. The `if_cli_copilot` branch references `buildCopilotPromptArg` but `cli-copilot` cannot be selected at parser level. NOT a live P0/P1 — recorded for future cleanup if `cli-copilot` is permanently retired (see project memory: "cli-copilot deprecation due to price hike", packet 081).

- **098/003 advisory resolution NOT credited in 100 implementation-summary.md**: 098/003 flagged missing `memory_handback.md` + `shared_smart_router.md` cross-CLI references as "advisory follow-on packet". Files now exist at canonical location and `check-smart-router.sh PATHS` PASS, but 100/implementation-summary.md does not record creating them (likely created in earlier packet). Disposition: advisory — gap closed; documenting for synthesis context.

- **Strategy-doc internal rotation override at iter-6**: Strategy.md claimed iter-6 unnecessary; dispatcher prompt explicitly requested traceability pass #2. Honored dispatcher; not a defect because the override was operator-intentional.

- **`--dangerously-skip-permissions` is a generic OpenCode run flag, not specific to cli-opencode**: iter-8 confirmed via `opencode run --help`. NOT an additional auth bypass beyond P1-028 because writes are still bound by `--dir "{repo_root}"` and the rendered prompt's TARGET AUTHORITY preamble.
<!-- /ANCHOR:deferred-items -->

---

<!-- ANCHOR:audit-appendix -->
## 9. Audit Appendix

### Convergence summary

| Iteration | Focus | Dimension | Status | newFindingsRatio | P0/P1/P2 (running) |
|-----------|-------|-----------|--------|------------------|---------------------|
| 1 | inventory + closed-gate-replay | inventory | complete | 1.00 | 0/1/1 |
| 2 | correctness:100-reducer | correctness | complete | 0.00 | 0/1/1 |
| 3 | correctness:101-executor-wiring | correctness | complete | 1.00 | 0/2/2 |
| 4 | security | security | complete | 0.10 | 0/2/2 |
| 5 | traceability:yaml-parity | traceability | complete | 0.40 | 0/3/5 |
| 6 | traceability:cross-references | traceability | complete | 0.00 | 0/2/4 (deduped) |
| 7 | maintainability | maintainability | complete | 0.00 | 0/2/4 |
| 8 | saturation + adversarial | flexible | complete | 0.00 | 0/2/4 |

**Stop reason:** `converged` (3 consecutive zero-ratio iterations + 4/4 dimensions covered + 7 legal-stop gates green)

### Coverage summary

| Gate | Result | Detail |
|------|--------|--------|
| convergenceGate | PASS | weighted_stop_score = 1.0 (rolling-avg w=0.30 + MAD w=0.25 + dim-coverage w=0.45) |
| dimensionCoverageGate | PASS | 4/4 dimensions covered; coverage_age = 1 (D4 covered iter-7, confirmed iter-8) |
| p0ResolutionGate | PASS | activeP0 = 0 |
| evidenceDensityGate | PASS | every active P1 has ≥4 file:line refs (avg 4.5) |
| hotspotSaturationGate | PASS | executor-config.ts revisited 5 of 8 iterations; 4 YAMLs revisited 4 of 8 |
| claimAdjudicationGate | PASS | both active P1s have typed packets in iter-7 + iter-8 |
| fixCompletenessReplayGate | PASS | 13 of 13 099 P1s replay with file:line evidence (iter-1) + 2 random spot-checks confirm RESOLVED (iter-8) |

### Adversarial self-check on P0/P1 (Hunter / Skeptic / Referee)

| Finding | Hunter | Skeptic | Referee | Iteration |
|---------|--------|---------|---------|-----------|
| P1-027 | Confirmed at 4 file:line locations (no `--pure` in any if_cli_opencode block) | Tested contrapositive (would removing `--dangerously-skip-permissions` solve the same issue?) — NO; `--pure` is canonical fix | **Confirm P1** | iter-7 + iter-8 |
| P1-028 | Confirmed declaration at executor-config.ts:37-40 + parser validation at :116-140 + zero downstream usage | Tested no-op-pass-through interpretation — RULED OUT (parser rejects unsupported fields like serviceTier) | **Confirm P1** | iter-7 + iter-8 |

### Closed-gate replay table — 099 P1 → 100 (13 of 13 RESOLVED)

| 099 ID | 100 fix surface | Status | Verified iter |
|--------|-----------------|--------|---------------|
| P1-013 through P1-025 (12 P1) | 100 implementation-summary.md §What Changed (8 file:line surfaces) | RESOLVED | iter-1 |
| P1-026 (reducer extracts findings from delta records) | `.opencode/skills/deep-review/scripts/reduce-state.cjs:505-541` (deltaRecordToFinding), :543-575 (buildFindingRegistry with deltaRecords param), :869-875 (orchestration call), :1305-1319 (loadDeltaPayloads) | RESOLVED | iter-1 + iter-2 + iter-8 spot-check |
| P1-021 (random spot-check) | `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:261-275` (sibling skill path fallback) | RESOLVED | iter-1 + iter-8 spot-check |

> **Note:** Full 13-row table is in `iterations/iteration-001.md`. Above shows iter-8's random adversarial spot-checks plus the most-stressed P1-026 row.

### Ruled-out claims (cross-iteration aggregate)

- "100 introduced new P0/P1 defects" — RULED OUT at iter-1 (inventory pass surfaces only 101-introduced regressions)
- "100 has hidden sub-phase children that need canonicalization" — RULED OUT at iter-6 (graph-metadata.json `is_phase_parent: false`)
- "memory_handback.md is a missing cross-CLI reference (098/003 advisory still open)" — RULED OUT at iter-6 (files exist; check-smart-router PATHS PASS)
- "100 implementation-summary.md cites stale line numbers" — RULED OUT at severity-granularity (±6 to ±14 drift; landmarks intact)
- "4-YAML cli-opencode wiring drift between auto vs confirm or research vs review" — RULED OUT at iter-5 (byte-identical pair-diffs) + iter-6 (re-confirmed grep count = 1 each)
- "100 graph-metadata.json depends_on missing 098" — RULED OUT BY DESIGN (100 → 099 direct predecessor; 098 listed under `manual.related_to`)
- "Stop hook production override bypass" — RULED OUT at iter-8 (NODE_ENV=test gate confirmed at session-stop.ts:39-47)
- "P1-027 downgrade to P2" — RULED OUT at iter-8 (--pure is canonical, blocks default DeepSeek dispatch)
- "P1-028 downgrade to doc-only P2" — RULED OUT at iter-8 (EXECUTOR_KIND_FLAG_SUPPORT + parser validation make sandboxMode a runtime contract)

### Sources reviewed (cross-reference appendix)

#### Core Protocols (spec_code + checklist_evidence)

- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/review-report.md` (predecessor verdict baseline)
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/005-remediation/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `graph-metadata.json`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/006-cli-opencode-executor/spec.md`, `implementation-summary.md`, `graph-metadata.json`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `graph-metadata.json` (self-validation)

#### Overlay Protocols (skill_agent + agent_cross_runtime + feature_catalog_code + playbook_capability)

- `.opencode/skills/cli-opencode/SKILL.md` (canonical), `.opencode/skills/cli-claude-code/SKILL.md`, `.opencode/skills/cli-codex/SKILL.md`, `.opencode/skills/cli-gemini/SKILL.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts` + `lanes/explicit.ts` + `fusion.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh` + `validate.sh`
- `.opencode/skills/system-spec-kit/references/cli/memory_handback.md` + `shared_smart_router.md`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs`
- `.opencode/skills/sk-code-review/SKILL.md` + `.opencode/skills/sk-git/SKILL.md`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `_research_confirm.yaml`, `_review_auto.yaml`, `_review_confirm.yaml`
- `.opencode/commands/doctor/scripts/audit_descriptions.py`

### Lineage

- **sessionId:** `deep-review-102-2026-05-07T2055`
- **parentSessionId:** `deep-review-102-2026-05-07T2055` (resume on same lineage)
- **lineageMode:** resume (note: user originally requested `restart` with executor switch to cli-codex; a hook restored prior native iter-1..6 state; the assistant honored the restoration and resumed under cli-codex from iter-7 onward — see state.jsonl `executor_switch` event at iter-7)
- **generation:** 1
- **continuedFromRun:** 6 (iter-1..6 native opus; iter-7..8 cli-codex/gpt-5.5/high/fast)
- **stopReason:** `converged`
- **iterations:** 8
- **terminalStop:** legal STOP at iter-8 (all 7 legal-stop gates green)
<!-- /ANCHOR:audit-appendix -->
