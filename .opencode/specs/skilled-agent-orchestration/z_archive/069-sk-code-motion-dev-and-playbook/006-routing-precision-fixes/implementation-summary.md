---
title: "Implementation Summary: Phase 006 Routing Precision Fixes"
description: "Phase 006 applied the routing precision fixes from the Phase 005 audit, but final status remains failed because nested Codex rechecks could not execute and the live local advisor still reads stale SQLite ahead of the patched JSON graph."
trigger_phrases:
  - "phase 006 implementation summary"
  - "routing precision summary"
  - "packet 069 remediation evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/006-routing-precision-fixes"
    last_updated_at: "2026-05-05T14:55:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Applied routing precision fixes and captured blocked rechecks"
    next_safe_action: "Refresh or approve updating live skill-advisor SQLite, then rerun RD-002/CS-002/LS-001"
    blockers:
      - "Nested Codex cannot resolve api.openai.com from this sandbox."
      - "skill_advisor.py --force-local loads skill-graph.sqlite before patched skill-graph.json."
    key_files:
      - "implementation-summary.md"
      - "spot-recheck-results/RD-002-RECHECK-codex.yaml"
      - "spot-recheck-results/CS-002-RECHECK-codex.yaml"
      - "spot-recheck-results/LS-001-RECHECK-codex.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Should Phase 006 be allowed to refresh or patch .opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite?"
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/006-routing-precision-fixes` |
| **Completed** | Not complete; verification failed |
| **Level** | 2 |
| **Phase Status** | FAILED |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 006 now has the router contract changes the audit asked for: doc-only skill markdown edits are documented as `sk-doc`, explicit non-Webflow Motion.dev prompts are blocked from WEBFLOW promotion, Webflow/Motion performance refs use exact filenames, and runner result YAMLs carry parser quality flags. The work is not green yet because the required nested Codex rechecks failed at network resolution, and a local forced advisor probe still loads stale SQLite routing data before the patched JSON graph.

### Per-Finding Status

| Finding | Status | Evidence |
|---------|--------|----------|
| F-001 RD-002 doc-only edits | PARTIAL | Static router docs and JSON graph changed: `.opencode/skills/sk-code/SKILL.md:29`, `.opencode/skills/sk-code/references/router/intent_classification.md:41`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:313`. Live `skill_advisor.py --force-local` still ranks `sk-code` first because it reads SQLite. |
| F-002 CS-002 explicit non-Webflow | FIXED | Non-Webflow pre-check and reference contract added: `.opencode/skills/sk-code/SKILL.md:65`, `.opencode/skills/sk-code/references/router/code_surface_detection.md:52`, `.opencode/skills/sk-code/references/router/resource_loading.md:61`. Runtime recheck blocked by network. |
| F-003 CS-001 exact Motion refs/assets | FIXED | Exact Motion refs and snippet examples added: `.opencode/skills/sk-code/references/router/resource_loading.md:53`, `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md:124`. |
| F-004 CS-003 directory placeholders | FIXED | Router docs reject placeholders and runners emit `refs_loaded: []` plus flags: `.opencode/skills/sk-code/references/router/resource_loading.md:71`, `../005-playbook-cross-cli-execution/scripts/run_codex.sh:80`. |
| F-005 SD-001 Webflow implementation trio | FIXED | Implementation trio is now a MUST load: `.opencode/skills/sk-code/references/router/resource_loading.md:30`. |
| F-006 CB-002/SA-001 performance and decision refs | FIXED | Canonical performance/decision files named exactly: `.opencode/skills/sk-code/references/router/resource_loading.md:73`. |
| F-007 LS-001 executable `.opencode/` advisor weight | PARTIAL | JSON graph adds executable-code positives and system-spec-kit anti-signals: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:264`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:387`. Live local advisor still ranks `system-spec-kit` first from SQLite. |
| F-008 CS-004/CS-005 Motion contract regressions | FIXED | Regression examples added: `.opencode/skills/sk-code/references/motion_dev/decision_matrix.md:97`, `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md:118`. |
| F-009 YAML extraction quality | FIXED | Four runner parsers now extract block scalars, preserve assets, reject directory placeholders, and emit `quality_flags`: `../005-playbook-cross-cli-execution/scripts/run_codex.sh:63`, `../005-playbook-cross-cli-execution/scripts/run_copilot.sh:50`, `../005-playbook-cross-cli-execution/scripts/run_gemini.sh:50`, `../005-playbook-cross-cli-execution/scripts/run_opencode.sh:50`. |

### Files Changed

| File | Lines | Action | Purpose |
|------|-------|--------|---------|
| `spec.md` | 218 | Created | Level 2 Phase 006 scope and requirements |
| `plan.md` | 216 | Created | Fix order, affected surfaces, verification strategy |
| `tasks.md` | 119 | Created | Finding-level task ledger |
| `checklist.md` | 137 | Created | Verification checklist with P0 routing gates |
| `graph-metadata.json` | 78 | Created | Phase child metadata |
| `.opencode/skills/sk-code/SKILL.md` | 214 | Modified | Doc-only exclusion and explicit non-Webflow guard |
| `.opencode/skills/sk-code/references/router/intent_classification.md` | 74 | Modified | Doc-edit anti-signals |
| `.opencode/skills/sk-code/references/router/code_surface_detection.md` | 112 | Modified | Explicit non-Webflow guard contract |
| `.opencode/skills/sk-code/references/router/resource_loading.md` | 138 | Modified | Exact resource contracts and implementation trio |
| `.opencode/skills/sk-code/references/motion_dev/decision_matrix.md` | 120 | Modified | Contract regression examples |
| `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md` | 145 | Modified | Snippet regression examples |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | 417 | Modified | Advisor positives and anti-signals |
| `../005-playbook-cross-cli-execution/scripts/run_codex.sh` | 168 | Modified | Hardened YAML parser |
| `../005-playbook-cross-cli-execution/scripts/run_copilot.sh` | 120 | Modified | Hardened YAML parser |
| `../005-playbook-cross-cli-execution/scripts/run_gemini.sh` | 120 | Modified | Hardened YAML parser |
| `../005-playbook-cross-cli-execution/scripts/run_opencode.sh` | 120 | Modified | Hardened YAML parser |
| `../spec.md` | 172 | Modified | Parent phase map rows for 005 and 006 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

P0s were patched first in `SKILL.md`, router docs, and the advisor graph. Then the resource-loading contracts were tightened to exact filenames, Motion.dev regression examples were added, and the four runner parsers were brought to one hardened behavior. The mini rechecks were run through the required `run_codex.sh` path, but each failed before model output because the sandbox cannot resolve/connect to OpenAI's API endpoint.

### Spot Recheck Results

| Scenario | Result | Rationale |
|----------|--------|-----------|
| RD-002-RECHECK | FAIL | `run_codex.sh` exit 1; nested Codex failed DNS/API connection. Copied result: `spot-recheck-results/RD-002-RECHECK-codex.yaml`. |
| CS-002-RECHECK | FAIL | `run_codex.sh` exit 1; nested Codex failed DNS/API connection. Copied result: `spot-recheck-results/CS-002-RECHECK-codex.yaml`. |
| LS-001-RECHECK | FAIL | `run_codex.sh` exit 1; nested Codex failed DNS/API connection. Copied result: `spot-recheck-results/LS-001-RECHECK-codex.yaml`. |

The copied YAMLs prove F-009 behavior improved: empty output is represented as `refs_loaded: []`, `assets_loaded: []`, `quality_flags: ["empty_excerpt"]`, and `(no response)` instead of a bare literal marker.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat doc-only `SKILL.md` edits as `sk-doc` even under `.opencode/skills/` | The audit failure came from path ownership overpowering prose-only intent. The updated rule separates documentation edits from executable routing logic. |
| Keep explicit non-Webflow Motion.dev prompts UNKNOWN/N/A | Motion.dev is cross-stack. A user explicitly excluding Webflow should still get Motion.dev refs without Webflow-only guidance. |
| Add `anti_signals` to JSON graph without editing SQLite | The approved scope named the JSON graph, not the runtime SQLite database. Editing SQLite would exceed the stated scope. |
| Mark rechecks FAIL instead of PASS_BLOCKED | The requested output vocabulary was PASS/PARTIAL/FAIL. The scripts exited 1 and did not analyze routing, so FAIL is the honest status. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:recommendations -->
## Recommendation Mapping

| Recommendation | Addressed By | Residual Risk |
|----------------|--------------|---------------|
| R1 Smart-router fixes | F-002, F-005, F-006 | Runtime recheck blocked by network |
| R2 Skill-advisor weights | F-001, F-007 | JSON updated, but live SQLite still needs refresh or approved patch |
| R3 Documentation gaps | F-003, F-004, F-008, F-009 | Exact-path contract is documented; full matrix still needs rerun |
| R4 CLI-specific notes | F-009 and copied recheck evidence | Gemini/OpenCode precision still needs future rerun after parser hardening |
<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Exit | Result |
|-------|------|--------|
| `ccc search "skill advisor doc-only edit anti signal routing" --path .opencode/skills/system-spec-kit --limit 5` | 1 | CocoIndex unavailable: operation not permitted writing daemon log under home |
| `python3 -c "import json; json.load(open('.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json'))"` | 0 | PASS |
| `bash -n .../scripts/run_codex.sh` | 0 | PASS |
| `bash -n .../scripts/run_copilot.sh` | 0 | PASS |
| `bash -n .../scripts/run_gemini.sh` | 0 | PASS |
| `bash -n .../scripts/run_opencode.sh` | 0 | PASS |
| `python3 .../skill_advisor.py --force-local "<RD-002 prompt>" --threshold 0.0` | 0 | FAIL logic: `sk-code` ranked before `sk-doc` from SQLite-loaded graph |
| `python3 .../skill_advisor.py --force-local "<LS-001 prompt>" --threshold 0.0` | 0 | FAIL logic: `system-spec-kit` ranked before `sk-code` from SQLite-loaded graph |
| `bash .../run_codex.sh RD-002-RECHECK "<prompt>"` | 1 | FAIL environment: API DNS/connection failure |
| `bash .../run_codex.sh CS-002-RECHECK "<prompt>"` | 1 | FAIL environment: API DNS/connection failure |
| `bash .../run_codex.sh LS-001-RECHECK "<prompt>"` | 1 | FAIL environment: API DNS/connection failure |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/006-routing-precision-fixes --strict` | 0 | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook --strict` | 0 | PASS |
| `ls specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/006-routing-precision-fixes/spot-recheck-results/` | 0 | PASS, 3 YAMLs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live advisor graph not refreshed.** The approved change targeted `skill-graph.json`, but `skill_advisor.py --force-local` reports "Skill graph: loaded from SQLite" and still uses old signal data. A follow-up needs approval to refresh or patch `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite`.
2. **Nested Codex rechecks cannot run here.** All three required rechecks failed with `failed to lookup address information` for `wss://api.openai.com/v1/responses`. The result YAML schema is improved, but routing PASS cannot be claimed from these runs.
3. **Full cross-CLI matrix was not rerun.** Phase 006 only attempted the requested mini matrix.
<!-- /ANCHOR:limitations -->
