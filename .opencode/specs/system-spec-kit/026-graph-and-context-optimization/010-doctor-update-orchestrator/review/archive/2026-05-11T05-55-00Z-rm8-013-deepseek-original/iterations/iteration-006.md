# Iteration 6 — traceability core (spec_code + checklist_evidence)

**Date**: 2026-05-11T19-30-00Z
**Dimension**: traceability core (spec_code + checklist_evidence)
**Prior Findings**: P0=1 P1=27 P2=8 (open: 36)

---

## Files Reviewed

| File | Dimension | Classification | Notes |
|------|-----------|---------------|-------|
| `001-initial-doctor-commands/spec.md` | spec_code | source-of-truth | P0 REQ-001..008, P1 REQ-010..017 |
| `001-initial-doctor-commands/checklist.md` | checklist_evidence | all-unchecked | 80+ items, zero [x]; no verification artifacts referenced |
| `001-initial-doctor-commands/resource-map.md` | spec_code, checklist_evidence | PLANNED-gap | Claims 10 YAMLs but only 5 exist on disk |
| `001-initial-doctor-commands/implementation-summary.md` | checklist_evidence | claims-vs-reality | Claims Phases A, A.1, B1 partial complete but checklist never updated |
| `002-sandbox-testing-playbook/spec.md` | spec_code | source-of-truth | P0 REQ-001..012, P1 REQ-020..027 |
| `002-sandbox-testing-playbook/checklist.md` | checklist_evidence | 3-of-75-checked | Only CHK-001..003 checked; ~96% unchecked |
| `002-sandbox-testing-playbook/resource-map.md` | checklist_evidence | cross-ref | Status vocabulary (PLANNED vs OK) useful for evidence mapping |
| `002-sandbox-testing-playbook/implementation-summary.md` | checklist_evidence | claims-vs-reality | Claims 95% complete; checklist contradicts |
| `.opencode/commands/doctor/memory.md` (272 loc) | spec_code | REQ-001 evidence | Exists on disk |
| `.opencode/commands/doctor/causal-graph.md` (271 loc) | spec_code | REQ-001 evidence | Exists on disk |
| `.opencode/commands/doctor/deep-loop.md` (262 loc) | spec_code | REQ-001 evidence | Exists on disk |
| `.opencode/commands/doctor/cocoindex.md` (256 loc) | spec_code | REQ-001 evidence | Exists on disk |
| `.opencode/commands/doctor/update.md` (256 loc) | spec_code | REQ-001+REQ-004 evidence | Exists; 0 REQ-* identifier references |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | spec_code | REQ-002 evidence | Exists; snapshot/VACUUM/rollback present |
| `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` | spec_code | REQ-002 evidence | Exists; snapshot/VACUUM/rollback present |
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | spec_code | REQ-002 evidence | Exists; snapshot/VACUUM/rollback present |
| `.opencode/commands/doctor/assets/doctor_cocoindex.yaml` | spec_code | REQ-002 evidence | Exists; snapshot/VACUUM/rollback present |
| `.opencode/commands/doctor/assets/doctor_update.yaml` (31410 bytes) | spec_code | REQ-002..007 evidence | 75 hits for key safety terms (flock, VACUUM, snapshot, dashboard, tier-aware, retry, SIGINT, gold-battery, state-log) |
| `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json` (15174 bytes) | spec_code | REQ-008 evidence | Exists at expected path |
| `manual_testing_playbook/23--doctor-commands/` (23 .md files) | spec_code | REQ-001 evidence | All 23 IDs 323-336, 338-342, 344-347 present |
| `_sandbox/23--doctor-commands/harness/` (4 .sh) | spec_code | REQ-010 evidence | All 4 pass `bash -n` |
| `_sandbox/23--doctor-commands/scenarios/` (23 .sh) | spec_code | REQ-011 evidence | All 23 exist on disk |
| `_sandbox/23--doctor-commands/docker-compose.yml` | spec_code | REQ-008 evidence | Valid YAML (python3 yaml.safe_load exit 0) |
| `manual_testing_playbook/manual_testing_playbook.md` | spec_code | REQ-004..006 evidence | 23 entries in Section 12; last_updated 2026-05-09; 23-- in canonical sources |

---

## Findings by Severity

### P0

*No new P0 findings in this iteration.*

### P1

---

#### R6-P1-001 [P1] 001 checklist never synced with implementation — 80+ items unchecked

- **File**: `001-initial-doctor-commands/checklist.md:1-202`
- **Evidence**: `grep '\[x\]' 001/checklist.md` returns zero matches. The checklist contains 80+ checkpoints across pre-impl, cross-cutting, per-command, migration, smoke-test, and close sections. All are `[ ]`. Meanwhile `implementation-summary.md` claims Phases A (scaffold) and A.1 (tx-model verify) are COMPLETE, Track B1 is partial (2/5 files), and G1+G2 pass — all of which should have triggered checklist updates. Specifically: CHK-001 (all spec docs authored) should be [x] — 6 packet docs exist; CHK-004 (Multi-AI Council 10-line spec) should be [x] — decision-record.md has 9 ADRs; CHK-005 (tx model verified) should be [x] — ADR-001 CONFIRMED; CHK-100 (memory.md exists+valid) should be [x] — file exists (272 loc).
- **Finding class**: cross-consumer
- **Scope proof**: `grep '\[x\]' 001/checklist.md` returns 0 hits; `grep '\[ \]' 001/checklist.md` returns 80+ hits across all sections.
- **Affected surface hints**: ["001-initial-doctor-commands checklist", "implementation-summary claims", "Phase A/A.1 deliverables"]
- **Recommendation**: Update the checklist to reflect actual delivery state. Mark CHK-001, CHK-004, CHK-005, CHK-100, CHK-101 as [x] with evidence references; mark any items that cannot pass (e.g., CHK-018 G3) as deferred with rationale. Establish a rule: checklist updates MUST accompany implementation-summary writes.

---

#### R6-P1-002 [P1] 002 checklist 96% unchecked despite claimed 95% completion

- **File**: `002-sandbox-testing-playbook/checklist.md:1-314`
- **Evidence**: Only 3 of 75+ items checked (`[x]` CHK-001, CHK-002, CHK-003 — pre-impl parent/sibling setup). All scenario authoring (CHK-100), root playbook items (CHK-200..203), sandbox harness items (CHK-300..332), smoke tests (CHK-400..406), close items (CHK-500..505), and L3+ items remain unchecked. Yet `implementation-summary.md` claims 95% complete with all 5 phases delivered, 23 scenarios authored, sandbox built, root playbook integrated, and 5/7 gates green. The evidence for these claims exists on disk (files verified above) but the checklist was never updated to link evidence to checkpoints.
- **Finding class**: cross-consumer
- **Scope proof**: `grep '\[x\]' 002/checklist.md` returns 3 lines (pre-impl only); `grep '\[ \]' 002/checklist.md` returns 72 hits across all remaining sections.
- **Affected surface hints**: ["002-sandbox-testing-playbook checklist", "Phase B/C/D/E deliverables", "implementation-summary claims"]
- **Recommendation**: Run `grep '\[ \]' 002/checklist.md | wc -l` then update every item where evidence exists on disk to `[x]` with the evidence path. Items that are genuinely incomplete (e.g., real Docker build, fixture URLs) should remain unchecked with deferred rationale.

---

#### R6-P1-003 [P1] YAML asset count mismatch: spec says 10, resource-map says 5, disk has 5

- **File**: `001-initial-doctor-commands/spec.md:133` (vs `001-initial-doctor-commands/resource-map.md:85-91`, and actual disk)
- **Evidence**: Spec REQ-002 acceptance criterion states "All 10 YAML asset files load cleanly". The In Scope table at line 131 lists "10 YAML assets". The resource-map (lines 83-91) lists exactly 5 single-mode YAML assets (one per command). On disk, only 5 YAMLs exist: `doctor_memory.yaml`, `doctor_causal-graph.yaml`, `doctor_deep-loop.yaml`, `doctor_cocoindex.yaml`, `doctor_update.yaml`. The `implementation-summary.md` Track B1 section (lines 97-104) hints at a planned 4-YAML-per-command structure (auto/confirm/apply/apply-confirm) that was never fully authored; only 1 of 4 per command was delivered. The gap is 5 YAMLs delivered vs 10 specified.
- **Finding class**: instance-only (this packet's spec-implementation gap)
- **Scope proof**: `ls commands/doctor/assets/doctor_*.yaml | wc -l` returns 5. `grep "10 YAML" 001/spec.md` returns 3 hits.
- **Affected surface hints**: ["001-initial-doctor-commands spec scope table", "resource-map YAML count", "actual disk delivery"]
- **Recommendation**: Either update spec.md REQ-002 acceptance criterion from 10 to 5 (if the reduced YAML-per-command was an intentional scope reduction) and note the change in decision-record.md, or author the remaining 5 YAML assets. The decision-record should document whether multi-mode YAMLs were de-scoped.

---

#### R6-P1-004 [P1] P0 REQ-003 (strict validate exit 0) never passed — known cross-packet blocker

- **File**: `001-initial-doctor-commands/spec.md:184` (REQ-003)
- **Evidence**: REQ-003 is classified P0 ("MUST complete") in spec.md. Acceptance criterion: "`validate.sh 013-... --strict` exit 0". `implementation-summary.md:227` (G3 row) states "pending" — not yet run. `002/implementation-summary.md:172` G4 row confirms the phase-parent lean-trio detection works but validation exits non-zero with FRONTMATTER_MEMORY_BLOCK issue. The cross-packet template-manifest mismatch is acknowledged in both implementation summaries as affecting 4+ packets (001, 002, 003, 013 parent). Despite being a known tooling issue, the P0 requirement has never been satisfied and no explicit user-deferral is recorded in decision-record.md.
- **Finding class**: instance-only
- **Scope proof**: `grep "G3" 001/implementation-summary.md` shows "pending"; `grep "REQ-003" 001/decision-record.md` returns 0 hits (no explicit deferral).
- **Affected surface hints**: ["001 spec REQ-003", "validate.sh --strict", "cross-packet template-manifest"]
- **Recommendation**: Either: (a) record a formal ADR in decision-record.md deferring REQ-003 until the cross-packet template-manifest alignment fix lands, with explicit user approval; or (b) address the 4 remaining G3 error categories (FILE_EXISTS, TEMPLATE_HEADERS, ANCHORS_VALID, FRONTMATTER_MEMORY_BLOCK) at the packet level. P0 blocker downgraded to P1 because the root cause is a tooling-level template-manifest mismatch affecting multiple packets, not a delivery defect in this packet.

---

#### R6-P1-005 [P1] No POST-SAVE QUALITY REVIEW evidence for either 001 or 002 packet

- **File**: `001-initial-doctor-commands/checklist.md:189` (CHK-803), `002-sandbox-testing-playbook/checklist.md:311` (CHK-503)
- **Evidence**: CHK-803 (P0): "`/memory:save` run; POST-SAVE QUALITY REVIEW HIGH issues addressed". CHK-503 (P0): same requirement for 002. Neither implementation-summary contains the string "POST-SAVE" or documents the POST-SAVE QUALITY REVIEW output from `generate-context.js`. The description.json and graph-metadata.json files are generated, but the mandatory post-save review step is undocumented — no evidence of checking title, trigger_phrases, importance_tier for HIGH issues.
- **Finding class**: cross-consumer (both child packets affected identically)
- **Scope proof**: `grep -i "POST-SAVE" 001/implementation-summary.md 002/implementation-summary.md` returns 0 hits in both files.
- **Affected surface hints**: ["001 close checklist section", "002 close checklist section", "/memory:save workflow", "generate-context.js"]
- **Recommendation**: Run `/memory:save` with `generate-context.js` for both packets, capture the POST-SAVE QUALITY REVIEW output, address any HIGH issues via Edit tool, and document the review pass/fail in each implementation-summary. Mark CHK-803 (001) and CHK-503 (002) as [x] with the POST-SAVE output reference.

---

### P2

---

#### R6-P2-001 [P2] update.md has zero REQ-* identifier references — no bidirectional spec→code traceability

- **File**: `.opencode/commands/doctor/update.md:1-256`
- **Evidence**: `grep -c 'REQ-00[1-8]\|REQ-01[0-7]' update.md` returns 0. The orchestrator command ships the 10-phase council workflow but contains no inline references back to spec requirement IDs. This makes it difficult to verify REQ-004 ("implements all 10 lines of the council spec") from the code side. The implementation exists (update.yaml has 75 key safety term hits) but the mapping is implicit.
- **Finding class**: instance-only
- **Scope proof**: 0 REQ-ID matches in update.md; check other command .md files confirms same pattern (none reference spec IDs).
- **Affected surface hints**: ["update.md", "spec_code traceability"]
- **Recommendation**: Optionally add inline REQ-ID annotations (e.g., `<!-- REQ-005 -->` before the flock section) in future doc polish passes. Not blocking.

---

#### R6-P2-002 [P2] implementation-summary G1 verification claim (1/5) understates actual file delivery

- **File**: `001-initial-doctor-commands/implementation-summary.md:225`
- **Evidence**: G1 row states "1 of 5" for `validate_document.py --type command`. However, all 5 command .md files exist on disk (memory.md 272 loc, causal-graph.md 271 loc, deep-loop.md 262 loc, cocoindex.md 256 loc, update.md 256 loc). The verification tool was simply not run on 4 of them. The claim "1 of 5" implies only 1 file exists when actually 5 exist but verification is incomplete.
- **Finding class**: instance-only
- **Scope proof**: `ls commands/doctor/{memory,causal-graph,deep-loop,cocoindex,update}.md | wc -l` returns 5.
- **Affected surface hints**: ["implementation-summary G1 row", "verification status table"]
- **Recommendation**: Update G1 status to "5 files authored, validation run on 1/5" rather than "1 of 5" which implies only 1 file was created.

---

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| **spec_code** | **partial** | 8 of 8 P0 requirements in 001 have implementation files on disk (REQ-001..REQ-008). 12 of 12 P0 requirements in 002 have implementation evidence (REQ-001..REQ-012). Gaps: REQ-002 (YAML count: spec says 10, disk has 5 — P1); REQ-003 (strict validate never passed — P1 downgrade); P1 requirements REQ-010..REQ-017 all have evidence on disk. Overlay gaps: no REQ-ID back-references in command markdown files. |
| **checklist_evidence** | **not-yet** | 001 checklist: 0 of 80+ items checked. 002 checklist: 3 of 75+ items checked. Implementation evidence exists on disk for most items (23 scenarios, 31 sandbox files, 5 commands, 5 YAMLs, migration manifest, root playbook, decision-record ADRs) but NONE of it is linked back to checklist items. This is an honesty gap — the deliverables exist but their verification is undocumented. R6-P1-001 and R6-P1-002 address this. |
| **skill_agent** | partial | No change from iter 1 — carried forward. |
| **agent_cross_runtime** | not-yet | Deferred to iters 8-9 per strategy. |
| **feature_catalog_code** | clean | 002 resource-map entries match disk reality: 23 scenario .md files, 31 sandbox files, root playbook 23 entries all verified. 001 resource-map has YAML count mismatch (R6-P1-003) and the "PLANNED" annotations for json metadata are stale (files now exist). |
| **playbook_capability** | clean | All 23 playbook scenarios exist, root playbook cross-reference has 23 entries, sandbox harness scripts pass bash -n, docker-compose is valid YAML. Scenario DOC-323 verified to follow 5-section structure with 6 TEST EXECUTION subsections. |

---

## Verdict

**CONDITIONAL** — activeP0=1 (carried from R3), activeP1=5 new + 27 prior = 32. The traceability core pass reveals that the implementation delivery is substantially complete (files exist on disk, safety features present in YAMLs, scenarios and sandbox built) but the **paper trail** (checklist, spec_code bidirectional refs, POST-SAVE review) has never been maintained. The hardware is there; the paperwork isn't.

---

## Next Dimension

Iteration 7 should continue traceability with overlay protocols (`playbook_capability` deep-dive: do sandbox scenarios actually exercise the correct 001 command YAML assets? do .sh wrappers invoke canonical commands 1:1?) and begin the `agent_cross_runtime` overlay — checking whether `.opencode/commands/doctor/` has counterparts in `.claude/commands/doctor/`, `.codex/commands/doctor/`, `.gemini/commands/doctor/`.

---

## SCOPE VIOLATIONS

*None — all writes within allowed paths.*
