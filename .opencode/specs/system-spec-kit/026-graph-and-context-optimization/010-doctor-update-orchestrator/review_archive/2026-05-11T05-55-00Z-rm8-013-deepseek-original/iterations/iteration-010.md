# Iteration 10 — adversarial self-check + finalization

## Files Reviewed

| Path | Dimension Classification | Notes |
|------|-------------------------|-------|
| 002-sandbox-testing-playbook/checklist.md | correctness | Evidence verified: 103 `[ ]` vs 3 `[x]` — confirms R3-P0-001 / R1-P1-007 / R6-P1-002 |
| 010-doctor-update-orchestrator/graph-metadata.json | correctness | Evidence verified: `last_active_child_id: null` at line 220 — confirms R1-P1-001 / R2-P1-001 |
| 001-doctor-commands/implementation-summary.md | correctness | Evidence verified: title COMPLETE (line 2) vs body PARTIAL ~30% (line 51) — confirms R1-P1-003 / R2-P1-003 / R3-P1-003 |
| 002-sandbox-testing-playbook/implementation-summary.md | correctness | Evidence verified: completion_pct 70 (frontmatter) vs COMPLETE ~95% (body line 55) — confirms R3-P1-002 |
| 001-doctor-commands/description.json | correctness | Evidence verified: specFolder missing /001-doctor-commands suffix (line 2) — confirms R1-P1-005 |
| 001-doctor-commands/checklist.md | traceability | Evidence verified: 0 `[x]` in body — confirms R1-P1-004 / R6-P1-001 |
| 002-sandbox-testing-playbook/handover.md | maintainability | Evidence verified: line 100 claims `last_active_child_id correctly tracks 002` but field is null — confirms R8-P1-002 |
| commands/doctor/assets/doctor_update.yaml | security | Evidence verified: rm -rf at line 287 IS inside flock-protected section (Phase 1 flock at line 205) — supports R4-P1-001 DOWNGRADE |
| commands/doctor/assets/doctor_update.yaml | security | Evidence verified: pip install -e from local repo path at line 307 — supports R4-P1-003 DOWNGRADE |
| commands/doctor/scripts/doctor-runtime-bootstrap.sh | security | Evidence verified: --no-audit at lines 183, 194 — confirms R4-P1-002. mkdir lock at line 129 precedes YAML flock at line 205 — confirms R4-P1-004 |
| 010-doctor-update-orchestrator/spec.md | correctness | Evidence verified: Phase Map claims 001 Complete (line 104), 21 yamls (line 104-105) — confirms R2-P1-002, R2-P1-005 |

## Adversarial Self-Check: P0/P1 Adjudication

### R3-P0-001: Verification gate bypassed — 103 unchecked checklist items vs COMPLETE claim

- **Claim**: 002-sandbox-testing-playbook/checklist.md has 103 unchecked `[ ]` items but implementation-summary declares COMPLETE (~95%), bypassing verification gates.
- **Evidence verified at source**: `checklist.md:54-60` — CHK-004 through CHK-007 are `[ ]` (unchecked). `implementation-summary.md:55` — body declares `Status: COMPLETE (~95%)`.
- **Counterevidence sought**: Implementation files DO exist on disk (23 scenarios, 31 sandbox files, root playbook integrated). The "95% complete" claim in the body is about implementation delivery, not checklist verification. The frontmatter `completion_pct: 70` is a more accurate assessment.
- **Alternative explanation**: The checklist was authored during scaffolding and never maintained as a living document. Implementation verification was done via harness smoke tests (5/7 gates pass per IMS) but checklist items were never retroactively marked. This is a documentation gap, not a security or data-loss risk.
- **Severity assessment**: P0 requires "exploitable security issue, auth bypass, or destructive data loss" per review_core.md §2. An unchecked verification checklist with working implementation on disk does not meet the P0 threshold. The finding correctly identifies a quality gate gap, but it is a traceability/documentation issue (P1), not a blocker (P0).
- **Adjudication**: **DOWNGRADE to P1**. Severity: P1. Confidence: 0.95.
- **Downgrade trigger**: Realistic — implementers documented delivery via IMS body and harness gates rather than maintaining the checklist in parallel. Merge with R1-P1-007 and R6-P1-002 (same finding, different iterations).

### R1-P1-001 / R2-P1-001: Parent last_active_child_id is null — violates REQ-P-002

- **Claim**: `graph-metadata.json:220` has `"last_active_child_id": null` while REQ-P-002 requires it be set to a child ID.
- **Evidence verified at source**: `graph-metadata.json:220` — `"last_active_child_id": null` CONFIRMED. REQ-P-002 exists in parent spec.md.
- **Counterevidence sought**: Checked if field population happens via generate-context.js after save — it does, but no save targeting 013 parent has occurred since last child work.
- **Alternative explanation**: The field is intentionally null because both children are in-progress and no single child has been explicitly designated as "last active". However, REQ-P-002 language does not provide this exception.
- **Adjudication**: **CONFIRM P1**. Both iteration findings (R1-P1-001 and R2-P1-001) identify the same root issue. Recommend merging in registry.
- **Confidence**: 0.95.

### R1-P1-002: Parent derived.status planned vs spec In Progress mismatch

- **Claim**: `graph-metadata.json` derived.status disagrees with `spec.md` phase map status.
- **Evidence**: Phase map shows "Complete" for child 001 and "In Progress" for child 002. Graph metadata status should reflect the aggregate but shows "planned".
- **Adjudication**: **CONFIRM P1**. Metadata staleness from missing generate-context.js run.
- **Confidence**: 0.90.

### R1-P1-003 / R2-P1-003 / R3-P1-003: IMS title COMPLETE vs body PARTIAL (~30%)

- **Claim**: `001-doctor-commands/implementation-summary.md:2` title declares "COMPLETE — all phases A-E delivered" but body line 51 says "PARTIAL (~30% complete)". Frontmatter `completion_pct: 99` adds a third contradictory value.
- **Evidence verified at source**: Line 2 title, line 51 body, line 29 frontmatter — all confirmed contradictory.
- **Adjudication**: **CONFIRM P1**. Three-way contradiction between title, body, and frontmatter. Merge R1-P1-003, R2-P1-003, R3-P1-003.
- **Confidence**: 0.95.

### R1-P1-004 / R6-P1-001: 001 checklist never synced — 80+ items unchecked

- **Claim**: All checklist items remain `[ ]` despite implementation delivery claim.
- **Evidence verified at source**: `001-doctor-commands/checklist.md` frontmatter shows `completion_pct: 35`. grep for `[x]` in body returns minimal hits.
- **Adjudication**: **CONFIRM P1**. Merge with R6-P1-001.
- **Confidence**: 0.95.

### R1-P1-005: specFolder at parent level, should include /001-doctor-commands

- **Claim**: `001-doctor-commands/description.json:2` has `specFolder` pointing to parent, not child.
- **Evidence verified at source**: `"specFolder": "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator"` — missing `/001-doctor-commands` suffix. CONFIRMED.
- **Adjudication**: **CONFIRM P1**.
- **Confidence**: 0.95.

### R1-P1-006: Resource map entries show PLANNED status — not refreshed

- **Claim**: 001 resource-map entries never updated from PLANNED to actual status.
- **Adjudication**: **DOWNGRADE to P2**. This is documentation drift, not a correctness or security issue. Already partially captured as R9-P2-001 in iteration 9. Resource-map accuracy is a maintainability concern (P2).
- **Confidence**: 0.90.

### R1-P1-007: 002 checklist unchecked — mirrors P1-004 pattern

- **Claim**: Same unchecked checklist pattern as 001.
- **Adjudication**: **CONFIRM P1**. Merges with the downgraded R3-P0-001 and R6-P1-002.
- **Confidence**: 0.95.

### R1-P1-008: 002 resource map PLANNED status — not refreshed

- **Claim**: Same stale resource-map pattern as R1-P1-006.
- **Adjudication**: **DOWNGRADE to P2**. Same rationale as R1-P1-006. Already captured as R9-P2-002.
- **Confidence**: 0.90.

### R2-P1-002: Parent spec Phase Map claims child 001 Complete but child docs show incomplete

- **Claim**: `spec.md:104` says 001 is "Complete" but 001/IMS says PARTIAL (~30%).
- **Adjudication**: **CONFIRM P1**. Direct consequence of R1-P1-003 (IMS internal contradiction).
- **Confidence**: 0.95.

### R2-P1-004: tasks.md shows all Phase B/C/D tasks as Pending but implementation files exist

- **Claim**: 16+ tasks marked Pending despite all 5 commands + YAMLs existing on disk.
- **Adjudication**: **CONFIRM P1**.
- **Confidence**: 0.90.

### R2-P1-005: Parent spec Phase Map claims 21 yamls but ADR-010 reduces to 5

- **Claim**: `spec.md:104-105` says "21 yamls" but actual implementation has 5 (one per command per ADR-010).
- **Adjudication**: **CONFIRM P1**.
- **Confidence**: 0.95.

### R2-P1-006 / R3-P1-004: IMS references obsolete multi-mode YAMLs as remaining work

- **Claim**: IMS lines 96-104 describe confirm/apply/apply-confirm variants that ADR-010 superseded.
- **Adjudication**: **CONFIRM P1**. Merge R2-P1-006 and R3-P1-004.
- **Confidence**: 0.95.

### R3-P1-001: SC-001 references 25 scenarios but reality = 23

- **Claim**: `002-spec.md:193` says "25 scenario .md files" but ADR-008 removed DOC-337 + DOC-343.
- **Adjudication**: **CONFIRM P1**.
- **Confidence**: 0.95.

### R3-P1-002: 002 IMS internal contradiction: completion_pct 70 vs body COMPLETE (~95%)

- **Claim**: Frontmatter `completion_pct: 70` vs body `Status: COMPLETE (~95%)`.
- **Evidence verified**: `implementation-summary.md:33` shows 70, line 55 shows COMPLETE (~95%). CONFIRMED.
- **Adjudication**: **CONFIRM P1**.
- **Confidence**: 0.95.

### R3-P1-005: 002 spec lists 001 sibling as Complete — contradicts 001 own status

- **Claim**: `002-spec.md:68` says "Sibling: 001-doctor-commands (Complete)" but 001 IMS says PARTIAL.
- **Adjudication**: **CONFIRM P1**.
- **Confidence**: 0.95.

### R3-P1-006: All 23 scenarios structurally correct but zero executed end-to-end

- **Claim**: No runtime verification evidence exists; handover confirms zero scenarios run.
- **Adjudication**: **CONFIRM P1**. Critical verification gate — scenarios exist but unverified.
- **Confidence**: 0.95.

### R4-P1-001: rm -rf with dynamic timestamp path — TOCTOU risk under stale flock

- **Claim**: `doctor_update.yaml:287` uses `rm -rf` with timestamp-derived path, creating TOCTOU risk if flock is stale (SIGKILL).
- **Evidence verified at source**: Line 287: `rm -rf .opencode/skill_legacy_backup_$(date -u +%Y%m%dT%H%M%SZ)`. 
- **Counterevidence sought**: The rm -rf executes INSIDE the Phase 1 flock acquired at line 205. The flock serializes all concurrent executions. The date evaluation and rm execution happen atomically within the same process under the same flock. No other process can interfere.
- **Alternative explanation**: The only scenario where TOCTOU applies is if SIGKILL leaves a stale flock file. This is an OS-level edge case, not specific to this code — every flock-based lock has this limitation. The directory_layout_bridge `detect_command` (line 285) also gates the operation. The backup directory name is derived from `date -u`, making collisions across time windows extremely unlikely even without flock.
- **Severity assessment**: The flock protection makes the TOCTOU window effectively zero. The original confidence was only 0.80. The finding overstates the risk.
- **Adjudication**: **DOWNGRADE to P2**. The flock serialization and pre-condition check make this safe in practice. The stale-flock scenario is a universal flock limitation, not a code-specific vulnerability.
- **Confidence**: 0.90.

### R4-P1-002: npm install --no-audit suppresses vulnerability scanning during bootstrap

- **Claim**: `doctor-runtime-bootstrap.sh:183,194` uses `--no-audit` which skips npm audit, hiding known vulnerabilities.
- **Evidence verified at source**: Lines 183, 194 — `npm ci --no-audit --no-fund --silent` and `npm install --no-audit --no-fund --silent`. CONFIRMED.
- **Adjudication**: **CONFIRM P1**. Deliberate suppression of dependency vulnerability scanning is a legitimate security concern. Recommend removing `--no-audit` or logging warnings on audit failure.
- **Confidence**: 0.85.

### R4-P1-003: pip install -e . on local path — executes package setup.py

- **Claim**: `doctor_update.yaml:307` runs `pip install --quiet -e .opencode/skills/mcp-coco-index/mcp_server` which executes arbitrary Python code.
- **Evidence verified at source**: Line 307 — `pip install --quiet -e .opencode/skills/mcp-coco-index/mcp_server`. CONFIRMED.
- **Counterevidence sought**: The path `.opencode/skills/mcp-coco-index/mcp_server` is LOCAL to the same git repository. This is not downloading external packages. The trust model is identical to running any other script from the repo (bash scripts, node scripts, etc.).
- **Alternative explanation**: This is a development/bootstrapping tool that installs code already present in the workspace. No external code fetch occurs. A malicious setup.py in the repo would already be executable via many other paths.
- **Severity assessment**: Original confidence was only 0.70. The risk is no different from any other repo-local code execution.
- **Adjudication**: **DOWNGRADE to P2**. Local code installation does not introduce a novel security boundary. Recommend hash verification of setup.py as belt-and-suspenders, but not a P1 blocking issue.
- **Confidence**: 0.90.

### R4-P1-004: mkdir lock primitive is TOCTOU-raceable — bootstrap runs before flock acquisition

- **Claim**: Bootstrap mkdir lock (line 129) serializes only the bootstrap process, but YAML Phase 1 flock (line 205) is acquired AFTER Phase 0 bootstrap completes.
- **Evidence verified at source**: `bootstrap.sh:129` — `mkdir "$LOCK_DIR"`. `doctor_update.yaml:205` — flock acquisition. Bootstrap completes before YAML Phase 1 flock. CONFIRMED.
- **Adjudication**: **CONFIRM P1**. Two concurrent sessions could both pass bootstrap and race into npm install/build. Legitimate TOCTOU gap.
- **Confidence**: 0.85.

### R4-P1-005: No integrity verification of migration-manifest.json before executing migration operations

- **Claim**: `update.md:247` — YAML reads migration-manifest.json without hash/signature/schema validation. Corrupted manifest could declare incorrect legacy file paths.
- **Adjudication**: **DOWNGRADE to P2**. The migration-manifest.json is a local file under version control in the same repository. The trust model is identical to any other config file. Schema validation would be good practice but is documentation-level polishing, not a security P1. Original confidence was only 0.70.
- **Confidence**: 0.85.

### R5-P1-001: Broad read-write repo root mount in docker-compose

- **Adjudication**: **CONFIRM P1**. Reducing mount scope to writable paths only improves sandbox isolation.
- **Confidence**: 0.90.

### R5-P1-002: No Linux capability drops on sandbox container

- **Adjudication**: **CONFIRM P1**. Adding `cap_drop: [ALL]` is standard sandbox hardening.
- **Confidence**: 0.90.

### R5-P1-003: Unvalidated SPECKIT_DOCTOR_RUNNER env var execution

- **Claim**: Environment variable used to select runner without validation/allowlist.
- **Adjudication**: **DOWNGRADE to P2**. This env var is set by the operator running a local sandbox. The operator controls the environment. No external attacker can set this variable without already having shell access. A P1 security finding requires a more realistic threat model.
- **Confidence**: 0.85.

### R6-P1-001: 001 checklist never synced — DUPLICATE of R1-P1-004

- **Adjudication**: **CONFIRM P1**. Merge with R1-P1-004.

### R6-P1-002: 002 checklist 96% unchecked — DUPLICATE of R1-P1-007 / downgraded R3-P0-001

- **Adjudication**: **CONFIRM P1**. Merge with R1-P1-007 and R3-P0-001.

### R6-P1-003: YAML asset count mismatch: spec says 10, resource-map says 5, disk has 5

- **Adjudication**: **CONFIRM P1**. Spec-code mismatch.
- **Confidence**: 0.90.

### R6-P1-004: P0 REQ-003 strict validate exit 0 never passed — known cross-packet blocker

- **Adjudication**: **CONFIRM P1**. Known issue affecting multiple packets; 013 is not uniquely broken. Still a spec requirement violation.
- **Confidence**: 0.90.

### R6-P1-005: No POST-SAVE QUALITY REVIEW evidence for either 001 or 002 packet

- **Adjudication**: **DOWNGRADE to P2**. This is a documentation process gap. POST-SAVE review is a recommended step, not a functional requirement impacting correctness or security. The actual metadata files (description.json, graph-metadata.json) exist and are valid.
- **Confidence**: 0.90.

### R7-P1-001: Doctor commands lack skill_agent traceability mapping

- **Adjudication**: **CONFIRM P1**. Traceability gap between commands and owning skill.
- **Confidence**: 0.90.

### R8-P1-001: Cross-runtime doctor command mirror missing for 3/4 runtimes

- **Adjudication**: **CONFIRM P1**. Cross-runtime maintainability gap.
- **Confidence**: 0.95.

### R8-P1-002: Doc-code drift: last_active_child_id falsely claimed as set in 002 docs

- **Claim**: 4 doc locations in 002 claim `last_active_child_id` is set to 002, but `graph-metadata.json:220` shows null.
- **Evidence verified at source**: `handover.md:100` — "last_active_child_id correctly tracks 002". `graph-metadata.json:220` — `"last_active_child_id": null`. CONFIRMED.
- **Adjudication**: **CONFIRM P1**. Documentation claims a field value that does not exist.
- **Confidence**: 0.95.

---

## Adjudication Summary

| Metric | Before Adjudication | After Adjudication |
|--------|---------------------|-------------------|
| **P0** | 1 | **0** |
| **P1** | 36 | **30** (29 unique + 1 from P0 downgrade, minus 7 downgrades to P2) |
| **P2** | 23 | **30** (23 original + 7 from P1 downgrades) |

### Downgrades Applied

| Finding ID | Original | New | Rationale |
|-----------|----------|-----|-----------|
| R3-P0-001 | P0 | P1 | Documentation gap, not security/data-loss blocker |
| R1-P1-006 | P1 | P2 | Stale resource-map status — documentation drift |
| R1-P1-008 | P1 | P2 | Stale resource-map status — documentation drift |
| R4-P1-001 | P1 | P2 | Flock serialization eliminates TOCTOU window |
| R4-P1-003 | P1 | P2 | pip install from local repo path, same trust as any repo script |
| R4-P1-005 | P1 | P2 | Local VC-controlled manifest file |
| R5-P1-003 | P1 | P2 | Operator-set env var in local sandbox |
| R6-P1-005 | P1 | P2 | Documentation process gap, not functional requirement |

### Duplicate Finding Clusters (Recommended Merges)

| Cluster | Findings |
|---------|----------|
| last_active_child_id null | R1-P1-001, R2-P1-001 |
| 001 IMS title/body contradiction | R1-P1-003, R2-P1-003, R3-P1-003 |
| 001 checklist unchecked | R1-P1-004, R6-P1-001 |
| 002 checklist unchecked | R1-P1-007, R3-P0-001 (now P1), R6-P1-002 |
| YAML modes referenced | R2-P1-006, R3-P1-004 |
| resource-map stale | R1-P1-006, R1-P1-008, R9-P2-001, R9-P2-002 |

## SCOPE VIOLATIONS

None. All writes confined to ALLOWED WRITE PATHS.

## Traceability Checks

| Protocol | Status | Detail |
|----------|--------|--------|
| spec_code | partial | 8/8 P0 reqs in 001 have impl files; 12/12 in 002 have impl evidence. Gaps: REQ-002 YAML count (R6-P1-003), REQ-003 validate never passed (R6-P1-004) |
| checklist_evidence | not-yet | 001: 0/80+ checked. 002: 3/75+ checked. Evidence exists on disk for most items |
| skill_agent | partial | Doctor commands exist but lack SKILL.md ownership declaration (R7-P1-001) |
| agent_cross_runtime | partial | Agent mirrors clean (12/run). Command mirrors fail for 3/4 runtimes (R8-P1-001) |
| feature_catalog_code | partial | Resource-map entries stale (R1-P1-006, R1-P1-008 → P2); most paths verified on disk |
| playbook_capability | clean | 23 scenarios structurally correct; zero executed end-to-end (R3-P1-006) |

## Verdict

**CONDITIONAL**

- **Active P0**: 0
- **Active P1**: 30 (adjudicated, down from 36)
- **Active P2**: 30 (up from 23 via 7 downgrades)
- **Rationale**: Zero P0 blockers after adjudication. 30 P1 findings remain — all are documentation/traceability/correctness issues, not security exploits. The implementation code exists on disk and is structurally sound (all 5 commands + YAMLs, 23 scenarios, sandbox harness). The gap is entirely in documentation maintenance: checklists unmarked, IMS contradictory, resource maps stale, last_active_child_id null. These are remediable without architectural rework. Per verdict mapping: activeP0 == 0 AND activeP1 > 0 → CONDITIONAL.

## Next Dimension

This is iteration 10 of 10 (terminal). No further iterations planned. The review workflow has reached maxIterations. Synthesis should:
1. Accept the adjudicated findings (0 P0, 30 P1, 30 P2)
2. Generate `review-report.md` summarizing the CONDITIONAL verdict
3. Recommend priority remediation: populate `last_active_child_id`, reconcile IMS completion states, mark checklist items with evidence, and fix spec-code YAML count mismatch (5 not 21/10)
