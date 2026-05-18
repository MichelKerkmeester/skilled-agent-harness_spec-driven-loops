# Iteration 10 — adversarial self-check + final verdict (re-review)

**Dimension**: adversarial self-check + final verdict
**Mode**: re-review
**Timestamp**: 2026-05-11T11:00:00Z
**Tool calls used**: 8

## Closure Verification

All 10 finding clusters (A–J) from the original deep-review report (§3 of `review_archive/.../review-report.md`) remain closed on disk. Remediation commit `495fdd282` closed all 30 P1 findings and 28/30 P2 findings. Two P2 were formally deferred (see §Deferred Findings below).

| Cluster ID | Original symptom | Fix applied (commit 495fdd282) | Re-verified status |
|---|---|---|---|
| A | `last_active_child_id: null`, `derived.status: planned` | Batch A: `graph-metadata.json` updated; `last_active_child_id` = `002-sandbox-testing-playbook` (line 220), derived.status = `in_progress` | CLOSED |
| B | 001 IMS "COMPLETE" vs "~95%" contradiction | Batch A: reconciled to `COMPLETE (~95%)` across title + body + continuity | CLOSED |
| C | 002 SC-001 scenario count unclear, 002 checklist unmarked | Batch A: SC-001 = 23 confirmed, 71 items marked `[x]` with evidence anchors | CLOSED |
| D | parent spec "21 yamls" → should be "10 yamls" | Batch A: corrected to "10 yamls" per ADR-010 mode reduction | CLOSED |
| E | 001 description.json specFolder short-form vs full path | Batch A: accepted as upstream generate-context.js convention; documented in 003 IMS §Verification | CLOSED |
| F | resource-maps show PLANNED for on-disk files, dead `.opencode/skill` symlink row | Batch A: marked OK for on-disk files, absent-on-disk rows marked `# absent on disk`, symlink row dropped | CLOSED |
| G | `--no-audit` + mkdir-lock in doctor-runtime-bootstrap.sh | Batch B: `--no-audit` removed (grep returns 0 hits), `npm audit --audit-level=high` added at lines 188,202, `flock -n` at FD 9 (lines 128-132) | CLOSED |
| H | docker-compose.yml wide mount + no capabilities drop | Batch B: mount narrowed to `:ro` + `evidence:rw`, `cap_drop: [ALL]` + minimal `cap_add`, `no-new-privileges:true` at docker-compose.yml:12-20 | CLOSED |
| I | missing cross-runtime doctor command mirrors | Batch C: opencode=10, claude=10, codex=10 (via symlink), gemini=10; skill_agent anchors 10/10 | CLOSED |
| J | Dockerfile base + sandbox guard exit code + spec.md REQ-P-001 + continuity stale values | Batch D: `node:20-bookworm-slim`, guard returns 125/SKIP, REQ-P-001 relaxed, continuity refreshed where targeted | CLOSED |

## Files Reviewed

- `parent/spec.md:106` — malformed PHASE DOCUMENTATION MAP row (P2-RG-001)
- `parent/description.json:7` — overwritten description (P2-009-001)
- `parent/graph-metadata.json:220` — last_active_child_id populated (Cluster A closed)
- `002-sandbox-testing-playbook/handover.md:33` — completion_pct drift (P2-007-001)
- `001-doctor-commands/` — no handover.md (P2-007-003, confirmed by Glob)
- `002-rm8-013-remediation-doc-honesty-security/implementation-summary.md` — deferred findings record

## Findings by Severity

### P0

None.

### P1

None. All 30 original P1 findings remain closed after adversarial re-adjudication.

### P2 — Adversarial Adjudication

Each active P2 is re-adjudicated below using the CLAIM ADJUDICATION schema.

---

#### P2-009-001 [P2] Parent description.json description overwritten to describe remediation instead of phase parent purpose

- **File**: `010-doctor-update-orchestrator/description.json:7`
- **Claim**: `description` field reads `"Remediation of 013 deep-review CONDITIONAL findings: doc honesty + security hardening + cross-runtime mirror"` — this describes the 003 remediation, not the parent's role as a phase parent for doctor commands (001) + sandbox playbook (002).
- **EvidenceRefs**: `description.json:7`, 003/implementation-summary.md §Verification (does not document this overwrite), iter-009.md §P2-009-001
- **CounterevidenceSought**: Is this actually correct? The parent's most recent context at the time of the 003 memory save WAS the remediation. generate-context.js honestly captured the last context it was given. However, the `description` field should describe the phase parent's identity/purpose, not its most recent action. The parent spec.md title/description (lines 1-3) correctly reads `"Feature Specification: Doctor Update Orchestrator"` and `"Phase parent for the doctor command surface and the manual testing playbook..."`.
- **AlternativeExplanation**: generate-context.js extracts description from the most recent context it's given; when run during 003 memory save, it captured the remediation description. This is an upstream convention issue in generate-context.js, not a 013 packet defect per se. However, the result on disk is incorrect for the parent's identity.
- **FinalSeverity**: P2 (confirmed). Documentation identity drift — does not affect functionality, does not block correctness or security. The parent spec.md remains authoritative.
- **Confidence**: 0.95
- **DowngradeTrigger**: Re-run generate-context.js scoped to the parent spec.md context, or manually patch the description field.
- **Finding class**: instance-only
- **Scope proof**: `grep -rn 'description' `010-doctor-update-orchestrator/description.json` confirms the field is singular — only the parent description.json has this drift. Child description.json files are correct.

---

#### P2-RG-001 [P2] Malformed PHASE DOCUMENTATION MAP row in parent spec.md (iter-2/7/8/9, now re-adjudicated as P2-007-002)

- **File**: `parent/spec.md:106`
- **Claim**: Row reads `| 002-sandbox-testing-playbook | 002-rm8-013-remediation-doc-honesty-security | [Criteria TBD] | [Verification TBD] |`. The Phase column is missing its number, the Folder column has the remediation packet name instead of a child folder, and the row structure does not match the two-phase layout described in the same table (lines 104-105).
- **EvidenceRefs**: `spec.md:106` (read confirms the row is present and malformed), iter-2 §P2-RG-001, iter-7 §P2-007-002, iter-8, iter-9
- **CounterevidenceSought**: Could this row be intentional — e.g., documenting the 003 remediation as a temporary phase? No: the table header defines columns `Phase | Folder | Status | Description`. Row 3 has no phase number, the folder column is a remediation packet (not a phase child), and fields are TBD. This looks like a Batch A artifact that was never cleaned up.
- **AlternativeExplanation**: The remediation Batch A may have added this row as a placeholder when updating the parent spec.md, intending to fill it in later. It was left incomplete.
- **FinalSeverity**: P2 (confirmed). Documentation formatting — the table is parseable for rows 1-2; row 3 is noise. Does not affect functionality or block correctness. Would confuse a human reader about the phase structure.
- **Confidence**: 0.95
- **DowngradeTrigger**: Delete or correct row 3 of the PHASE DOCUMENTATION MAP table.
- **Finding class**: instance-only
- **Scope proof**: Only one row in the table is malformed. Rows 1 and 2 are structurally correct with phase numbers (1, 2) and valid child folder references.

---

#### P2-007-001 [P2] 002 handover.md completion_pct drifts from IMS (70 vs 95)

- **File**: `002-sandbox-testing-playbook/handover.md:33`
- **Claim**: `completion_pct: 70` in handover.md frontmatter vs `completion_pct: 95` in implementation-summary.md. The remediation refreshed IMS from 70→95 but did not touch handover.md (not in Batch D scope; R9-P2-006 was deferred).
- **EvidenceRefs**: `handover.md:33` (read confirms `completion_pct: 70`), `002/implementation-summary.md` (confirms `completion_pct: 95` via iter-9 verification), 003 IMS §Deferred items
- **CounterevidenceSought**: Could handover.md reflect a different completion metric (e.g., handover-specific completion vs overall completion)? No — the handover.md continuity block is the same schema as IMS continuity, and handover.md's own body claims to be a continuity handoff. The IMS is the authoritative source of truth.
- **AlternativeExplanation**: Handover.md was authored before the remediation; the remediation targeted IMS continuity but not handover.md (by design, to keep Batch D surgical). The drift is real but minor.
- **FinalSeverity**: P2 (confirmed). Minor continuity metadata drift — `completion_pct` is advisory, not a runtime gate. The IMS and spec both agree on 95. Handover.md is the only stale source.
- **Confidence**: 0.90
- **DowngradeTrigger**: Update handover.md `completion_pct` to 95.
- **Finding class**: instance-only
- **Scope proof**: Only 002's handover.md has this drift. 002's IMS and spec.md are internally consistent (both 95). 001's docs are also consistent (95).

---

#### P2-007-003 [P2] 001 child lacks handover.md

- **File**: `001-doctor-commands/` (file absent)
- **Claim**: Sibling 002 has a handover.md for resumption continuity; 001 has no equivalent. The parent resource-map.md line 110 marks a former `001-doctor-commands/handover.md` as MISSING (Moved).
- **EvidenceRefs**: Glob of `001-doctor-commands/` (24 files, no `handover.md`), parent/resource-map.md (marks handover.md as MISSING/Moved)
- **CounterevidenceSought**: Is handover.md required for child packets? No — `handover.md` is a cross-cutting optional doc per the spec kit. 001's IMS continuity block (`implementation-summary.md` frontmatter) serves the same purpose for resumption. The absence is a convention gap, not a functional defect.
- **AlternativeExplanation**: 001 was authored before the handover.md convention was established for this phase parent's children. Or 001's implementation-summary.md continuity block is the intended resumption ladder for this child, and no separate handover.md is needed.
- **FinalSeverity**: P2 (confirmed — borderline trivial). The continuity ladder works through IMS frontmatter. A handover.md would be nice-to-have for parity with sibling 002 but is not required.
- **Confidence**: 0.85
- **DowngradeTrigger**: Not urgent. Create handover.md if parity is desired, but the 001 IMS continuity block is functionally sufficient.
- **Finding class**: instance-only
- **Scope proof**: Only 001 lacks handover.md. 002 has one. 003 has none (remediation packet, not a phase child). Parent has one.

---

## Regression Check

**Assessment**: PASS — no new P0/P1 regressions introduced by remediation commit `495fdd282`. No previously-closed findings have re-opened.

### Items re-checked:

1. **Adversarial re-read of all 10 clusters**: All closure conditions verified on disk (see Closure Verification table above). No signs of regression.

2. **Remediation-introduced P2s are correctly classified**:
   - P2-009-001 (description.json overwrite): P2 — cosmetic identity drift, functional spec.md is authoritative
   - P2-RG-001 (malformed table row): P2 — documentation formatting, rows 1-2 are correct and complete

3. **The 2 deferred P2 are honestly recorded**:
   - R8-P2-001 ("Gemini TOML format"): DEFERRED-NON-ISSUE. The `.gemini/commands/doctor/` convention IS `.toml` (pre-existing `mcp_debug.toml` + `mcp_install.toml`). Batch C completed the mirror in TOML to match convention. The finding's framing was wrong. Honest resolution: not a defect.
   - R9-P2-006 ("parent handover.md drift"): DEFERRED. Parent handover.md was deliberately not in Batch D's allowed-write list to keep batches surgical. The drift is minor. Honest resolution: deferred to follow-on packet.

4. **Scope hygiene**: The 003 remediation IMS claims "zero out-of-scope writes across all 4 batches." The on-disk evidence in the review target (parent + 001 + 002) shows no unexpected mutations. The re-review iterations 1-9 found no scope violations.

5. **Sandbox guard logic edge cases**: Previously verified in iter-9 — guard returns 125/SKIP when preconditions unset, propagates cleanly through all 3 harness scripts. No regression.

6. **Cross-runtime mirror**: opencode=10, claude=10, codex=10 (via symlink), gemini=10. All anchors present.

7. **Security hardening**: `--no-audit` absent (0 grep hits), `flock -n` at FD 9, `cap_drop: [ALL]` in docker-compose.yml. All verified in iters 4-5.

## Traceability Checks

- **003/implementation-summary.md §Verification**: 30-row evidence table maps each check to result — traceable.
- **003/implementation-summary.md §Findings closure tally**: Documents 30/30 P1 closed, 28/30 P2 closed, 2 deferred — accurate.
- **Parent graph-metadata.json**: `last_active_child_id` = `002-sandbox-testing-playbook` (line 220), `derived.status` = `in_progress` — correct.
- **Parent spec.md §3 PHASE DOCUMENTATION MAP**: Rows 1-2 (phases 1 and 2) correctly enumerate child folders with status and descriptions. Row 3 is malformed (P2-RG-001).
- **Cross-child references**: 002 spec.md references `../001-doctor-commands/spec.md` and `../001-doctor-commands/decision-record.md` — both exist on disk.
- **Resource-map.md**: 38 OK rows, 1 MISSING (pre-existing — 001 child handover.md moved to parent). No broken paths.

## Adversarial Self-Check Conclusion

After rigorous adjudication of all 4 remaining P2 findings and reproof of all 10 closure clusters:

1. **No finding merits elevation to P1 or P0**. All 4 are documentation-maintenance issues (P2 by definition per review_core.md §2: "non-blocking improvement, documentation polish"). None affect correctness, security, or runtime behavior.

2. **No finding from the original CONDITIONAL verdict has resurfaced as P1**. The remediation campaign (commit `495fdd282`) closed all 30 P1 findings cleanly, and the closure holds under adversarial re-examination.

3. **The 2 formally deferred P2** (R8-P2-001, R9-P2-006) are recorded honestly in the 003 IMS with clear rationale.

4. **The remediation introduced only 2 minor regressions** (P2-009-001, P2-RG-001) — both P2, both cosmetic, both confined to the parent spec folder. These do not block the verdict.

5. **No scope violations** were detected across the re-review (iters 1-10). The review target is read-only; all writes confined to the allowed-write list.

## Deferred Findings (Formal Record)

| ID | Original description | Resolution | Status |
|----|---------------------|-----------|--------|
| R8-P2-001 | Gemini runtime doctor commands use `.toml` vs `.md` | `.toml` is correct Gemini convention (pre-existing `mcp_debug.toml`, `mcp_install.toml`). Batch C completed mirror in TOML. Finding framing was wrong. | DEFERRED-NON-ISSUE |
| R9-P2-006 | Small doc-code drift in parent `handover.md` | Deliberately not in Batch D scope to keep batches surgical. Minor drift — does not block. | DEFERRED |

## Verdict

**PASS** (`hasAdvisories=true`)

| Metric | Value |
|--------|-------|
| activeP0 | 0 |
| activeP1 | 0 |
| activeP2 | 4 |
| Clusters verified closed | 10/10 (A–J) |
| Deferred P2 (from original) | 2 (R8-P2-001, R9-P2-006) |
| Remediation regressions (P2) | 2 (P2-009-001, P2-RG-001) |
| Pre-existing P2 (not in remediation scope) | 2 (P2-007-001, P2-007-003) |
| Scope violations | 0 |
| Convergence score | 1.0 (all 4 dimensions covered, evidence complete) |

The remediation campaign succeeded: the 010-doctor-update-orchestrator phase parent moves from **CONDITIONAL** → **PASS**. The 4 remaining P2 advisories are non-blocking documentation polish. The 2 deferred P2 are honestly documented in the 003 remediation IMS.

## Next Dimension

None — iteration 10 is the final iteration. Produce final `review-report.md` with the PASS verdict.
