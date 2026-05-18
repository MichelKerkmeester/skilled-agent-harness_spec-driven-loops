# Iteration 9 — maintainability (doc-code drift + resource-map accuracy)

## Files Reviewed

| Path | Dimension-Specific Classification | Notes |
|------|----------------------------------|-------|
| 010-doctor-update-orchestrator/spec.md | doc-code drift (continuity) | parent lean trio; `completion_pct: 30` reasonable for phase parent; packet_pointer correct |
| 010-doctor-update-orchestrator/resource-map.md | resource-map accuracy | 81-row parent aggregate; `completion_pct: 100` matches content |
| 010-doctor-update-orchestrator/handover.md | doc-code drift | broken ref to `002-.../external/opencode--spec-kit-skilled-agent-orchestration-3.3.0.1.tar.gz` (file doesn't exist on disk) |
| 001-initial-doctor-commands/spec.md | doc-code drift (continuity) | `packet_pointer` missing `/001-initial-doctor-commands` suffix; `completion_pct: 0` vs 99 in implementation-summary |
| 001-initial-doctor-commands/resource-map.md | resource-map accuracy | 15+ PLANNED statuses stale (now OK); `packet_pointer` missing child suffix; `scratch/` marked OK but absent; `completion_pct: 50` stale |
| 001-initial-doctor-commands/decision-record.md | doc-code drift (continuity) | `packet_pointer` missing child suffix; `completion_pct: 65` stale (10 ADRs captured) |
| 001-initial-doctor-commands/implementation-summary.md | doc-code drift (continuity) | `packet_pointer` correct; `completion_pct: 99` honest given open blockers |
| 002-sandbox-testing-playbook/spec.md | doc-code drift (continuity) | `completion_pct: 15` vs ~70% actual; RELATED DOCUMENTS § references `../001-initial-doctor-commands/handover.md` (file absent) |
| 002-sandbox-testing-playbook/resource-map.md | resource-map accuracy | `completion_pct: 75` reasonable; `dispatch/logs/track-*.log` referenced but absent |
| 002-sandbox-testing-playbook/decision-record.md | doc-code drift (continuity) | `completion_pct: 60` stale (8 ADRs captured) |
| 002-sandbox-testing-playbook/implementation-summary.md | doc-code drift (continuity) | `completion_pct: 70` honest given blockers |
| `.opencode` workspace (glob) | resource-map accuracy | Verified 5 cmds, 10 YAMLs, migration-manifest.json, launcher.cjs, bootstrap.sh, 23 scenario .md, 23 scenario .sh, 4 harness .sh, 3 fixture files, Dockerfile, dispatch prompts — all exist |

## Findings by Severity

### P0

(None)

### P1

(None)

### P2

#### R9-P2-001 [P2] Stale 001-initial-doctor-commands resource-map statuses
- File: `001-initial-doctor-commands/resource-map.md:57-91`
- Evidence: 15+ entries still marked `PLANNED` — `decision-record.md` (line 57), `implementation-summary.md` (line 58), `description.json` (line 59), `graph-metadata.json` (line 60), 5 command `.md` files (lines 71-75), 5 YAML assets (lines 87-91), `migration-manifest.json` (line 97) — but all these files exist on disk and are fully authored. The resource map was composed at scaffold time and never refreshed after implementation completed.
- Finding class: instance-only (single-file staleness)
- Scope proof: `ls` confirms all 15+ paths exist; only the resource-map status field is stale
- Recommendation: Batch-update all PLANNED → OK for paths that exist on disk. Consider running a scripted resource-map refresh rather than manual edits.

#### R9-P2-002 [P2] 001-initial-doctor-commands resource-map references absent `scratch/` directory
- File: `001-initial-doctor-commands/resource-map.md:61`
- Evidence: Lists `scratch/` with action `Created` and status `OK` but `ls 001-initial-doctor-commands/scratch/` returns "No such file". The 001 implementation-summary.md line 269 lists `013-.../scratch/` as "n/a" (workspace dir), confirming it was planned but never materialized.
- Finding class: instance-only
- Scope proof: Only this one scratch/ row is affected; no other scratch/ references in the review scope
- Recommendation: Change status from `OK` to `MISSING` or remove the row. The scratch/ path was a workspace directory that wasn't committed.

#### R9-P2-003 [P2] 001-initial-doctor-commands spec.md has stale continuity (`completion_pct: 0`)
- File: `001-initial-doctor-commands/spec.md:34`
- Evidence: `completion_pct: 0` set during Phase A scaffold authoring (`session_id: "scaffold-010-doctor-update-orchestrator"`). The 013 parent spec.md line 104 marks child 001 as `Complete`. The 001 implementation-summary.md line 29 shows `completion_pct: 99`. The spec.md `completion_pct: 0` is ~99 percentage points off.
- Finding class: instance-only
- Scope proof: Only the spec.md continuity block at the 001 level is affected; implementation-summary.md correctly reflects 99%.
- Recommendation: Update `completion_pct` to 99 (matching implementation-summary.md) or 100 if all P0/P1 are verified.

#### R9-P2-004 [P2] Stale `packet_pointer` in 001 child docs (missing `/001-initial-doctor-commands` suffix)
- File: `001-initial-doctor-commands/spec.md:18` (also `resource-map.md:11`, `decision-record.md:12`)
- Evidence: Three 001 child docs use `packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator"` (missing `/001-initial-doctor-commands`). The 001 implementation-summary.md line 13 correctly uses `.../010-doctor-update-orchestrator/001-initial-doctor-commands`. After the phase parent reorganization that moved 001 from a standalone 013 packet into a child phase, the packet_pointer prefix should include the child subfolder.
- Finding class: cross-consumer (3 files share the same stale prefix)
- Scope proof: Grep for `packet_pointer.*010-doctor-update-orchestrator"` across 001/ shows 3 hits (spec.md, resource-map.md, decision-record.md) with the short form; implementation-summary.md uses the correct long form.
- Recommendation: Update all three `packet_pointer` values to `.../010-doctor-update-orchestrator/001-initial-doctor-commands`.

#### R9-P2-005 [P2] 013-parent resource-map marks `.opencode/skill` symlink as `OK` but path absent on disk
- File: `010-doctor-update-orchestrator/resource-map.md:187`
- Evidence: Lists `.opencode/skill` with `Action: Created, Status: OK` but the symlink does not exist in the worktree. The 013/handover.md line 207-208 documents: "a truly fresh `opencode run` starts before Phase 1.5 can build ... or bridge `.opencode/skill -> .opencode/skills`, so the full spec_kit_memory MCP tool surface is not registered." The launcher creates this at runtime; it is not a persistent repo artifact.
- Finding class: instance-only
- Scope proof: Only this one row; the runtime-created nature is documented elsewhere
- Recommendation: Change status from `OK` to `RUNTIME` to accurately reflect that the file is created on demand by `spec-kit-memory-launcher.cjs`, not committed.

#### R9-P2-006 [P2] 013-handover.md references non-existent fixture archive path
- File: `010-doctor-update-orchestrator/handover.md:260`
- Evidence: The "Quick Resume Commands" section references `002-sandbox-testing-playbook/external/opencode--spec-kit-skilled-agent-orchestration-3.3.0.1.tar.gz` as a bootstrap archive. But `ls 002-sandbox-testing-playbook/external/` returns "No such file". The 002/external/ directory does not exist — fixture archives are hosted externally per ADR-004, not committed to the repo. The quick-resume command at line 260 will fail.
- Finding class: instance-only
- Scope proof: The Quick Resume Commands section is the only consumer of this path
- Recommendation: Either populate the `external/` directory with the actual archive, or update the quick-resume command to note that the archive must be downloaded first via `fetch-fixtures.sh`.

#### R9-P2-007 [P2] Stale continuity `completion_pct` in 001-decision-record.md and 002-decision-record.md
- File: `001-initial-doctor-commands/decision-record.md:23` (`completion_pct: 65`), `002-sandbox-testing-playbook/decision-record.md:23` (`completion_pct: 60`)
- Evidence: 001's decision-record.md captures 10 ADRs (ADR-001 through ADR-010), all fully decided. 002's decision-record.md captures 8 ADRs (ADR-001 through ADR-008), all fully decided. The 65 and 60 percent values appear to be scaffold-authoring defaults that were never updated after ADR authoring completed.
- Finding class: cross-consumer (same pattern in both child decision records)
- Scope proof: Read confirms all ADRs are complete in both files
- Recommendation: Set both to 100 since all ADRs are fully captured and decided.

#### R9-P2-008 [P2] 002-spec.md continuity `completion_pct: 15` stale
- File: `002-sandbox-testing-playbook/spec.md:35`
- Evidence: `completion_pct: 15` set at scaffold time. The 002 implementation-summary.md line 33 shows `completion_pct: 70`. Phase E verification in implementation-summary.md shows 5/7 gates green with G3/G4 as documented known issues. 15% is ~55 points below actual completion.
- Finding class: instance-only
- Scope proof: Only 002-spec.md is affected
- Recommendation: Update to 70 (matching implementation-summary.md) or higher if remaining blockers are cosmetic.

#### R9-P2-009 [P2] 002-spec.md RELATED DOCUMENTS references absent `001-initial-doctor-commands/handover.md`
- File: `002-sandbox-testing-playbook/spec.md:337`
- Evidence: The `## RELATED DOCUMENTS` section lists `../001-initial-doctor-commands/handover.md` which does not exist. The 001 child handover was moved to the 013 root per the parent aggregate resource-map (line 110: "Moved | MISSING").
- Finding class: instance-only
- Scope proof: Only this one reference; 013/handover.md correctly replaces it
- Recommendation: Replace `../001-initial-doctor-commands/handover.md` with `../handover.md` (the root handover that now serves as the active continuation point) or remove the line.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | clean | All command paths from 001/spec.md §3 "Files to Change" verified on disk; all scenario paths from 002/spec.md §3 verified on disk |
| checklist_evidence | partial | 001/checklist.md and 002/checklist.md reviewed in prior iterations; new resource-map findings are P2 documentation drift only |
| skill_agent | n/a | Not applicable to maintainability dimension (reviewed in iteration 7) |
| agent_cross_runtime | partial | Cross-runtime mirror reviewed in iteration 8; this pass focused on doc-code drift |
| feature_catalog_code | partial | Resource-map → actual code path verification partially done (resource map statuses stale for 001) |
| playbook_capability | clean | All 23 scenarios verified on disk matching spec; DOC-337/DOC-343 correctly absent per ADR-008 |

## Verdict

**PASS** (hasAdvisories=true)

No P0 or P1 findings in this iteration. 9 P2 advisory findings covering:
- 5 stale continuity `completion_pct` values across 001 and 002 child docs (scaffold-era defaults never updated)
- 3 stale `packet_pointer` values in 001 child docs (missing `/001-initial-doctor-commands` suffix after phase parent reorganization)
- 1 absent symlink path in 013 resource map (`.opencode/skill` marked OK but is runtime-created)
- 1 broken fixture archive path in 013 handover quick-resume commands
- 2 stale resource-map statuses (15+ PLANNED→OK conversions needed in 001; scratch/ directory absent)
- 1 stale RELATED DOCUMENTS reference to absent 001/handover.md

All findings are P2 documentation/maintainability issues with no runtime impact.

## Next Dimension

This is iteration 9 of 10. The final iteration (10) should be the **adversarial self-check** on accumulated P0/P1 findings, per the strategy plan. It should:
1. Re-examine the R3-P0-001 finding (the only P0) for downgrade potential given the root-cause fix described in 013/handover.md
2. Scrutinize all P1 findings from iterations 1-8 for any that could be downgraded to P2
3. Verify the findings registry is well-formed for synthesis into the final review report
4. Confirm all quality gates (evidence, scope, coverage) pass for the full review
