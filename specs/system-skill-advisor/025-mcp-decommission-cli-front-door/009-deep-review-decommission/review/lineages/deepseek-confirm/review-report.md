# Deep Review Report — 009-deep-review-decommission (confirming audit)

- **Target:** `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission` (spec-folder)
- **Lineage:** `deepseek-confirm` (`review/lineages/deepseek-confirm/`), session `fanout-deepseek-confirm-1789154849211-6y01mn`
- **Executor:** cli-pi, deepseek-v4.1-flash (max reasoning), in-process fan-out lineage
- **Iterations:** 5 of 5 | **Stop:** `maxIterationsReached` (stopPolicy max-iterations; convergence off)
- **Verdict:** **CONDITIONAL** — 0 P0, 3 P1, 5 P2 active

---

## 1. Executive Summary

**Verdict: CONDITIONAL.** No blocker stands, but three required findings do not fully close against the current tree, and five advisories remain open. The confirming audit asked three questions and can answer all three with reproductions:

1. **Do the prior nine required findings close?** Six close cleanly (F001 doctor install workflow, F002 doctor script, F004 launcher, F005 `.pi/SYNC.md`, F008 daemon CLI reference, F009 spec-kit architecture). Three do **not** fully close: the env-reference config claims (prior F010 → F001 here), the bin README dual-stack framing (prior F012 → F002 here), and the packet-completion presentation (prior F015 → F003 here).
2. **Did the fixes introduce anything new?** The four fix commits are clean where they claim to be (caller-context rename has no live stragglers, CI configs are clean, the trigger index and its fixtures were regenerated as one set, the fallback collapse left no self-fallback). The regression scan still found residue on three live surfaces, one of them inside the repair's own `.gitignore` edit (F007), plus a live playbook instruction (F008).
3. **Does the packet present its own completion honestly?** Mostly, and materially better than before. `008-verification-and-closeout` now carries an authored record with eight `Met` acceptance rows; the parent goal's progress table marks every phase Done. What remains: the parent `spec.md` phase map — the document that claims to track aggregate progress — still reads Draft/Pending with placeholder scopes and a broken table (F003), and the `009` packet's own spec/plan/tasks/goal/description remain scaffolds beside a `Status: Complete` row.

**Active findings:** P0 = 0 | P1 = 3 | P2 = 5. **hasAdvisories:** false (verdict is CONDITIONAL).
**Scope:** the nine prior required findings and their surfaces, the four post-review fix commits, the 008/009/parent packet records, and the advisory overlay protocols for a spec-folder target.
**Convergence reason:** iteration ceiling reached (5/5, parent goal D10); convergence signals were telemetry and were stable (all dimensions covered by iteration 4; the stabilization pass found no new P0/P1). All nine legal-stop gates record pass in iteration 5.

## 2. Planning Trigger

`/speckit:plan` is **required**: the verdict is CONDITIONAL, driven by three required findings. Remediation is documentation- and surface-level: no code defect was found in the decommission itself during this audit.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": 0,
    "P1": 3,
    "P2": 5,
    "ids": ["F001", "F002", "F003", "F004", "F005", "F006", "F007", "F008"]
  },
  "remediationWorkstreams": [
    { "id": "WS-1", "priority": "P1", "theme": "Operator references still assert MCP-era configuration", "findings": ["F001", "F005"], "shape": "Rewrite the two ENV-REFERENCE guard rows to the live defaults, and drop or repoint the dead advisor rows in the MCP debug report template." },
    { "id": "WS-2", "priority": "P1", "theme": "Bin entrypoint guide still frames the shim surface as MCP dual-stack", "findings": ["F002"], "shape": "Rewrite the daemon-backed CLI shims section to the surviving shim set; drop the dual-stack/'registrations unchanged' claims and the dead dev override." },
    { "id": "WS-3", "priority": "P1", "theme": "Packet cannot fully present its completion", "findings": ["F003", "F004", "F006"], "shape": "Refresh the parent phase map to the child statuses and real scopes (fix the split table); author or waive the 009 packet docs; correct the durable-directive measurement; refresh 007's stale limitation items." },
    { "id": "WS-4", "priority": "P2", "theme": "Residue sweep follow-through", "findings": ["F007", "F008"], "shape": "Remove the dead gitignore entry; rewrite the live playbook steps against the CLI/daemon surface." }
  ],
  "specSeed": [
    "State that operator references must cite the live defaults' readers, not deleted config registrations.",
    "State that a scoped rename is not complete until every live ignore/config/instruction surface it touched is updated.",
    "State the closure checklist for the parent phase map on packet close."
  ],
  "planSeed": [
    "WS-1: patch ENV-REFERENCE.md:313/:366 and doctor-mcp-debug.yaml:244 with a verification command per file.",
    "WS-2: rewrite bin/README.md sections 1 (launcher bullet) and 'Daemon-backed CLI shims' against the current bin/ listing.",
    "WS-3: refresh parent spec.md:141-151; decide author-vs-waive for 009 spec/plan/tasks/goal/description; fix goal.md:111; refresh 007 implementation-summary items 2 and 4.",
    "WS-4: delete .gitignore:135; rewrite or freeze operator-h5/unavailable-daemon.md steps 5-6.",
    "Re-run a confirming pass after the patches; the owed evidence (below) travels with it."
  ],
  "findingClasses": [
    "stale-config-claim",
    "stale-transport-description",
    "completion_claim_unverified",
    "stale_measurement",
    "stale_transport_doc",
    "stale_packet_record",
    "name_outlived_referent",
    "stale_playbook_instruction"
  ],
  "affectedSurfacesSeed": [
    ".opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md",
    ".opencode/bin/README.md",
    "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md",
    "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/goal.md",
    "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission (spec/plan/tasks/goal/description)",
    "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/007-docs-and-residue-sweep/implementation-summary.md",
    ".opencode/commands/doctor/assets/doctor-mcp-debug.yaml",
    ".gitignore",
    ".opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/unavailable-daemon.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | First/Last seen | Disposition |
|----|-----|-----------|-------|----------|-----------------|-------------|
| F001 | P1 | traceability | ENV-REFERENCE advisor rows assert config supply that no committed config carries | `ENV-REFERENCE.md:313` (`SPECKIT_ADVISOR_DOC_TRIGGERS` "pinned true" in three configs), `:366` (`SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT` "set in the committed MCP registrations"); both claims fail `rg` over the five configs | 2 / 5 | active |
| F002 | P1 | maintainability | bin/README still presents the shim surface as MCP dual-stack | `bin/README.md:171` ("three CLI shims ... MCP registrations stay unchanged"), `:20` ("Each launcher ... spawns the MCP child"), `:177` (dead `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE`), `:179` (7 packages / 3 shims vs 6 `DIST_PACKAGES` ids) | 2 / 5 | active |
| F003 | P1 | traceability | Packet cannot fully present its completion | parent `spec.md:141-151` (Draft/Pending, `[Phase N scope]`, split table) vs `goal.md:105-125` (all Done) and child statuses (008/009/010 Complete); `009` docs scaffold: `spec.md:3/:60/:72/:96`, `tasks.md` 13 unchecked, `description.json:3` | 3 / 5 | active |
| F004 | P2 | traceability | goal.md Progress row understates the durable-directive length | `goal.md:111` says 2,481 chars; measured span (`# Goal` → log anchor) 3,946 bytes; fix commit states 3,993 | 3 / 5 | active |
| F005 | P2 | maintainability | MCP debug report still enumerates the advisor | `doctor-mcp-debug.yaml:244` server row; invariant at `:27` says code-mode only; `mcp-doctor.sh` has no advisor check | 4 / 5 | active |
| F006 | P2 | traceability | Phase 007 limitation block stale | `007/implementation-summary.md:159` items 2 and 4 contradict the tree (`rename-invariants.vitest.ts:49` asserts inverse; `tests/compat/` has no bridge suites; env reference has no `mcp-server` paths) | 4 / 5 | active |
| F007 | P2 | maintainability | Stale `.gitignore` entry for the retired advisor directory | `.gitignore:135` ignores `.opencode/skills/system-skill-advisor/mcp_server/`; the package is `runtime/` | 4 / 5 | active |
| F008 | P2 | maintainability | Live playbook steps instruct a retired MCP surface | `operator-h5/unavailable-daemon.md:48-49` ("restart the MCP server", "untrusted public MCP context") | 5 / 5 | active |

Audit trail: F001/F002 first seen iteration 2; F003/F004 iteration 3; F005/F006/F007 iteration 4; F008 iteration 5. No finding was merged, downgraded, or disproved; adversarial replay (iteration 5) confirmed all three P1s.

## 4. Remediation Workstreams

1. **WS-1 — Operator references still assert MCP-era configuration (P1):** F001, F005. Patch `ENV-REFERENCE.md:313` and `:366` to state the live defaults and their readers; remove or repoint the dead rows in `doctor-mcp-debug.yaml:244`. Verify with `rg` over the five configs and the debug template.
2. **WS-2 — Bin entrypoint guide still MCP dual-stack (P1):** F002. Rewrite the "Daemon-backed CLI shims" section and the `§1` launcher bullet against the current `bin/` listing and `DIST_PACKAGES`. Verify with the file listing and the package table.
3. **WS-3 — Packet completion presentation (P1 + P2):** F003, F004, F006. Refresh the parent phase map (statuses, real focus text, fix the split table); decide author-vs-waive for the `009` packet scaffolds; correct the durable-directive figure; refresh phase 007's limitation items. Verify with the child status fields and the goal table.
4. **WS-4 — Residue follow-through (P2):** F007, F008. Delete `.gitignore:135`; rewrite or freeze the playbook scenario steps.

## 5. Spec Seed

- Operator-reference rows must name the live reader of a setting; a deleted config registration is not a valid source.
- A package rename's closure includes live ignore patterns, instruction text and report templates, not only imports and paths.
- Packet-close check: the parent phase map, the child status fields, and the goal progress table must agree in one pass.

## 6. Plan Seed

- T1: `ENV-REFERENCE.md` row rewrite + config grep verification (F001).
- T2: `doctor-mcp-debug.yaml` report-template cleanup (F005).
- T3: `bin/README.md` shims section rewrite (F002).
- T4: parent `spec.md` phase map refresh (F003).
- T5: `009` packet docs — author or record a waiver (F003).
- T6: `goal.md:111` measurement refresh (F004).
- T7: `007` limitation item refresh (F006).
- T8: `.gitignore:135` removal (F007); playbook step rewrite (F008).
- T9: re-run a confirming pass; carry the owed evidence from §Traceability and the Audit Appendix.

## 7. Traceability Status

**Core protocols (hard):**
- `spec_code` — **partial**. The decommission's normative scope claims hold on the audited surfaces (five configs clean, package renamed, CLI front door live, env rehomed), but three of the nine prior required findings do not fully close, filed as F001–F003.
- `checklist_evidence` — **partial**. The nearest completion list is `008-verification-and-closeout/acceptance-criteria.md` (no `checklist.md` exists at Level 1 inside the target). Eight rows all read `Met`; AC-002 was re-verified clean this run. Execution-dependent rows (AC-001 recursive validate, AC-004 CLI capabilities, AC-005 daemon states, AC-006 latency, AC-008 suite) were not re-run under this lineage's write containment and are recorded as **owed evidence**, not as verified.
- `AC_COVERAGE`: exempt — the target is a Level 1 packet with no checklist.md; the phase-008 acceptance list is covered above.

**Overlay protocols (advisory):**
- `feature_catalog_code` — **pass**. The advisor feature catalog describes the native CLI/daemon surface; no stale MCP claims (`rg` clean).
- `playbook_capability` — **partial**. One live scenario instructs the retired MCP surface (F008); other MCP mentions are labelled legacy rows or recorded-run evidence.
- `skill_agent` / `agent_cross_runtime` — not applicable (spec-folder target).

**Unresolved drift:** F001 (config claims), F002 (shim framing), F003 (completion presentation), F008 (playbook steps).

## 8. Deferred Items

- **Resource Map Coverage Gate:** `resource-map.md not present; skipping coverage gate.` (config `resource_map_present: false`; `resource_map.emit: false` for this lineage, matching the target's declared layout; no gate section emitted.)

- **F004, F005, F006, F007, F008** — listed above; advisory-grade.
- **Prior advisories status (17-finding set):** F003 debug workflow → F005 (open); F006 caller-context rename → closed (no live refs); F007 plugin bridge naming → deliberate waiver per packet decision (operator-set env); F011 install guide → closed (box reads `1 NATIVE MCP SERVER + 1 DAEMON-BACKED CLI`; section carries the non-MCP disclaimer); F013 self-fallback → addressed (single env read, plain directory default); F014 stress-suite naming/non-execution → deliberate limitation recorded in 008; F016 phase-007 record → F006 (open); F017 retired-coverage accounting → still only in commit bodies (`9015d00c79`), recorded here as an evidence-placement gap, not re-filed; two prior P2s (F015-related clauses) folded into F003.
- **Owed evidence (not verifiable inside this lineage):** the advisor test suite's final numbers (860/5/7 of 872 and the five-failure baseline) — no stored run log exists under the packet (`008/scratch/` is empty); the exact third–fifth failure names are not in the packet. The accuracy-gate pair is corroborated by commit `9015d00c79`; the remaining three are accepted as recorded, not re-proven. The recursive strict validate, CLI capability, daemon-state and latency checks are owed the same way; re-running them is the operator's or a write-enabled session's step.
- **Suite-figure consistency check performed:** 860 + 5 + 7 = 872 ✓; the claim is internally consistent; it is not re-proven here.

## 9. Dimension Expansion Map

Not applicable — no divergent pivots ran (`antiConvergence.convergenceMode: off`; `stopPolicy: max-iterations`). Swept: correctness (1–2), security (4), traceability (2–5), maintainability (2, 4–5). Remaining frontier: none recorded; ceiling reached.

## 10. Search Ledger

*No search-depth state captured (legacy v1 record).* This lineage ran v1 review depth; coverage was enumerated as the nine prior required findings, the four fix commits, the packet records, and the two applicable overlay protocols.

## 11. Audit Appendix

### Iteration table

| # | Focus | Dimensions | Ratio | New findings | Verdict |
|---|-------|-----------|-------|--------------|---------|
| 1 | Closure tranche A | correctness | 0.0 | 0 | PASS |
| 2 | Closure tranche B | correctness, traceability | 1.0 | 2 P1 | CONDITIONAL |
| 3 | Packet completion presentation | traceability | 1.0 | 1 P1, 1 P2 | CONDITIONAL |
| 4 | Regression scan + advisories | security, maintainability | 1.0 | 3 P2 | PASS |
| 5 | Stabilization + overlays | all | 1.0 | 1 P2 | PASS |

### Convergence replay validation

Recomputed from `deep-review-state.jsonl` only: ratios `[0.0, 1.0, 1.0, 1.0, 1.0]`. Rolling average (last 2) = 1.0 → continue; MAD = 0 → latest ratio above noise floor → continue; dimension coverage = 4/4 with `coverage_age >= 1` and core protocols executed → stop vote. Weighted score = 0.45·stop + 0.30·continue + 0.25·continue = 0.45 < 0.60 → composite CONTINUE. Recorded terminal decision: `iteration_count 5 >= maxIterations 5` → `STOP`, `stopReason: maxIterationsReached`. Replay agrees with the recorded stop; the convergence math alone did not force it (by design: `stopPolicy: max-iterations`, `convergenceMode: off`). All nine legal-stop gates recorded pass in iteration 5; claim adjudication passed 5/5 events; no `blocked_stop` events exist.

### Closure replay — the nine prior required findings

| Prior finding | Verdict | Reproduction (re-runnable) |
|---|---|---|
| F001 doctor install workflow | **Closed** | `rg -i "advisor" .opencode/commands/doctor/assets/doctor-mcp-install.yaml` → no matches; `rg "System Code Graph"` → none |
| F002 mcp-doctor.sh | **Closed** | `rg -i "system_skill_advisor\|skill.?advisor" .opencode/commands/doctor/scripts/mcp-doctor.sh` → none |
| F004 launcher MCP reporting | **Closed** | `rg -i "mcp" .opencode/bin/system-skill-advisor-launcher.cjs` → none |
| F005 .pi/SYNC.md caller | **Closed** | Row states the advisor is not registered; `.pi/extensions/prompt-advisor.ts` exists |
| F008 daemon CLI reference | **Closed** | No `mcp-server` paths; `:128` build command targets an existing `package.json`; `:164` states no MCP fallback |
| F009 ARCHITECTURE | **Closed** | Zero `mcp-server` hits; `:157` names `runtime/database/`; `:160` SDK retention matches `shared/ipc/socket-server.ts:14` + launcher liveness probe |
| F010 env reference | **Not closed → F001** | Two rows still assert config supply; configs carry nothing |
| F012 bin README | **Not closed → F002** | Dist path fixed; dual-stack framing, shim count, dead flag remain |
| F015 packet completion | **Not closed → F003** | 008 record + goal progress fixed; parent phase map and 009 docs not |

### Adversarial self-check (P0/P1)

Hunter/Skeptic/Referee replay recorded in `iterations/iteration-005.md`; all three P1s confirmed, none downgraded, no false positives found. No active P0 exists.

### File coverage matrix

Surfaces read this run: the 009 packet docs and prompts; the prior lineage archive (report + registry); 008 verification docs; parent spec/goal/description; the nine prior-finding files; the four fix commits' footprints (caller context, tests, CI, `.gitignore`, trigger-index fixtures, residue allowlist, playbook, feature catalog, doctor workflows, install guide). Full per-file state table in `deep-review-strategy.md` §15.

### Deviations recorded

- **maxIterations = 5** chosen from parent goal D10 ("each 5 iterations, convergence disabled") rather than the schema default 7, because the runner bound `stopPolicy: max-iterations` without an iteration cap. `convergenceMode: off` was recorded as the directive specifies; the runner's own defect (mode not carried in fan-out lineage prompts) is already documented in the parent goal deviations and is not re-filed here.
- **resource-map emission disabled** (`resource_map.emit: false`) because the target declares no map; no Resource Map Coverage Gate section is emitted.
- **Save phase skipped:** `generate-context.js` is forbidden by this lineage's write containment. Continuity update is owed to the operator or a write-enabled session; the artifact truth is this lineage directory.
