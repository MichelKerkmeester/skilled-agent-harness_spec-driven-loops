---
title: "Implementation Summary"
description: "Fix verdict for `/doctor:speckit router-reach`: the probe fails closed on a degraded advisor response, `--concurrency` reaches the script, the target is visible in the startup menu, and the route validator reads that menu."
trigger_phrases:
  - "router reach implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/008-router-reach"
    last_updated_at: "2026-10-02T16:10:21Z"
    last_updated_by: "doc-closure"
    recent_action: "Closed the phase documentation for the applied router-reach fix"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "scratch/reality-check.md"
      - "scratch/doctor-run.log"
      - "scratch/proposal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-router-reach"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-router-reach |
| **Status** | Complete |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:what-built -->
## What Was Built

Verdict: fix. The router-reach target routed to the intended workflow and its declared paths existed, but the check could not reliably prove what its contract says: the advisor can answer with a degraded local-scorer envelope that the probe treated as no-reach, the doctor-level `--concurrency` flag had no path into the script, and the numeric entry for router-reach was accepted without being displayed. The applied fix closes those gaps in the doctor lane and leaves the inspected subsystem untouched. Evidence: `scratch/reality-check.md`, the read-only runs in `scratch/doctor-run.log`, and the verdict in `scratch/proposal.md`.

### Phase 8: router-reach

`/doctor:speckit router-reach` asks the live skill advisor whether every phrase a hub's router advertises actually reaches that hub. An operator runs it after a routing change or when a phrase seems to land on the wrong skill, and reads one summary line plus a `RESULT` verdict. The probe now refuses to score a response that is not live, so a degraded advisor can no longer masquerade as a routing failure or as a silent pass. The flag the route always advertised can now be supplied end to end, and the target appears in the menu the operator actually sees.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Modified | Fail closed on a degraded, not-live or generation-less advisor response; list `--concurrency` in the usage header; keep the map-key separators as escapes instead of literal NUL bytes |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Add `concurrency` to the router-reach setup variables |
| `.skilled/commands/doctor/assets/doctor-router-reach.yaml` | Modified | Declare, validate and map the optional `--concurrency <n>` input |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modified | Show `12) Check runtime mirrors` and `13) Check router reach` in the startup menu and help block |
| `.skilled/commands/doctor/scripts/route-validate.py` | Modified | Build the presentation parity set from the visible startup menu numbers |
| `scratch/reality-check.md`, `scratch/doctor-run.log`, `scratch/proposal.md` | Created | Phase evidence: inventory, read-only runs, verdict and the applied edits |
<!-- /ANCHOR:what-built -->

---
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Audit first: the phase inventoried every named path, flag and script, then ran the workflow read-only with the full fleet and probed the advisor response envelope. The verdict was fix. The five target files were edited together in one batch with the other doctor targets that share `_routes.yaml`, the router text and the presentation contract, and the orchestrator reviewed the diff. Delivery is a working-tree change, not a commit. Verification reran the route validator, the YAML parse, the catalog mirror check and the MCP mutation-class guard, and a live probe on one hub (`--hub sk-doc --limit 5`) ended `RESULT: PASSED` with advisor generation 3.
<!-- /ANCHOR:how-delivered -->

---
<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fail closed when the advisor is degraded or lacks live trust metadata | A degraded local-scorer envelope carries no recommendations and no generation; scoring it produced 221 recorded no-reach rows, which describe the fallback scorer rather than routing |
| Wire the concurrency flag through instead of removing it | The route already advertised `--concurrency=<n>` and the script already parsed it with a default; only the workflow mapping was missing, so the flag was connected |
| Measure presentation parity against the visible menu | The accepted-answer table listed a numeric answer the startup menu never displayed; parity has to be measured against what the operator can choose |
| Record subsystem defects instead of fixing them | The wrong-hub and outranked phrases are observations about the subsystem the doctor inspects; the packet decision keeps them as findings |
<!-- /ANCHOR:decisions -->

---
<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | exit 0 — `OK: route-validate — 9 routes validated, 2 warnings`; `PASS: J1` parity |
| Live probe `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub sk-doc --limit 5` | exit 0 — `declared= 5 wrong-hub= 0 outranked= 0 no-reach= 0 allowed= 0 probe-error= 0`, `advisor generation: 3`, `RESULT: PASSED` |
| YAML parse of every doctor asset and `_routes.yaml` | `YAML_OK` |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | `STATUS=OK`, exit 0 |
| `check-mcp-mutation-class.sh` | `GUARD PASS` |
| Doctor script tests | `skill-advisor-route-contract.test.cjs` passes; three `parent-skill-check-*.test.cjs` fail exactly as the pre-batch baseline (their fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree) — not a regression |
| Startup menu check | shows `12) Check runtime mirrors` and `13) Check router reach` |
| Retired-identifier sweep | `rg` for `system_skill_advisor.`, `deep_loop_graph_status\|query\|convergence(` and `doctor_*` in the edited doctor files returns no matches |
<!-- /ANCHOR:verification -->

---
<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recorded findings stay open by decision.** The pre-fix full-fleet run reported 14 wrong-hub and 18 outranked phrases. Examples: `jev mcp server` routed to `mcp-code-mode=0.8500`; `full plugin and memory stack` ranked `memory:save` and `system-spec-kit` at `0.9500`; `notion mcp` ranked `mcp-code-mode` above `mcp-tooling`. The workflow treats both classes as failures.
2. **Those counts are not verified against a live advisor.** The audit's fleet run answered from a degraded local-scorer envelope inside a sandbox, so the wrong-hub and outranked rows are fallback-scoring observations. The same run reported 221 no-reach rows, 8 allowed disputes and 0 probe errors; no-reach is reported but does not fail the workflow, and allowed disputes are accepted under the allowlist.
3. **Only one hub was rerun live after the fix.** The post-fix live check used `--hub sk-doc --limit 5`; the full fleet has not been rerun against the live advisor.
4. **Three doctor test fixtures fail in this worktree, as before the batch.** `parent-skill-check-*.test.cjs` cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` inside a temporary fixture; this matches the pre-batch baseline and is not a regression.

**Follow-up status.** Items 1 to 3 are resolved by `specs/system-skill-advisor/033-advisor-status-truthfulness` phase 002: the full fleet, rerun against the live advisor, reports 0 wrong-hub and 0 outranked, and a rerun after merging main agrees. Item 4 is resolved by `specs/system-speckit/049-doctor-audit-followups` phase 003.
<!-- /ANCHOR:limitations -->

---

