# Deep Review Strategy — Skill-Metadata Program (glm-high lineage)

## Topic
Review of the skill-metadata program landed on skilled/v4.0.0.0: H/S class contract + fleet gate, command-metadata core schema, JSON template set, advisor watcher ingestion seam, creation-journey fixes, doctrine coherence sweep, CI/hooks wiring. COMPLETE.

## Review Dimensions
- [x] D1 Correctness — covered iter 1 (3 P2)
- [x] D2 Security — covered iter 2 (1 P2)
- [x] D3 Traceability — covered iter 3 (1 P2)
- [x] D4 Maintainability — covered iter 4-5 (1 P1 + 4 P2)

## Completed Dimensions
- D1 Correctness [x] — verdict PASS; silent readdir, within-entry dup signals, permissive resource probe (F001-F003).
- D2 Security [x] — verdict PASS; cross-drive isWithin edge (F004); ingestion containment confirmed strong.
- D3 Traceability [x] — verdict PASS; doctrine honest against code; cross-gate exit-code gap (F005).
- D4 Maintainability [x] — verdict CONDITIONAL; CI trigger gap P1 (F009) + test-honesty/docs P2 (F006-F008, F010).

## Running Findings
- P0: 0 | P1: 1 (F009) | P2: 9 (F001-F008, F010) | total active: 10

## What Worked
- Running the live fleet gate (`--format json`) to verify ground truth (11/11 pass, 7H/4S) — anchored the doctrine-vs-code check in fact, not inference.
- Re-reading `provenance.ts` before claiming a key_files traversal finding — turned a hypothesized P1 into a confirmed PASS (symlink-aware realpath containment).
- Verifying the CI trigger gap with `grep -c command-metadata` (0) before recording the P1.

## What Failed
- (none — no false-positive findings; the one P1 carried a full adjudication packet)

## Exhausted Approaches
- Searching for a P0 correctness/security bug in the contract+gate+watcher: exhausted; the program is in a conforming state and the watcher seam is well-engineered (serialization, storm breaking, quarantine, delete/recreate symmetry).

## Ruled-Out Directions
- Doctrine fleet-roster drift, dead §7 links, template-inventory drift, non-empty overlay set, dead code in contract libs, watcher-test vacuity, pre-push fail-open-as-gap — all ruled out with evidence.

## Next Focus
Synthesis complete. Next operator action: `/speckit:plan` for remediation (CONDITIONAL verdict, 1 active P1). Lane A (F009 CI trigger) first.

## Known Context
- Verified ground truth: `ci-skill-root-metadata.cjs --format json` → 11 roots, 7H/4S, 0 violations (matches doctrine §2).
- `grep -c command-metadata routing-registry-drift.yml` → 0 (confirms F009).
- Doctrine §7 link targets all exist; checklist.md absent (Level 1 → advisory).
- resource-map.md not present. Skipping coverage gate.
- Out of scope: implementing fixes (report only); spec tree continuity schema.

## Cross-Reference Status
| Protocol | Level | Gate | Status |
|----------|-------|------|--------|
| spec_code | core | hard | pass |
| checklist_evidence | core | hard | skipped (Level 1) |
| feature_catalog_code | overlay | advisory | partial (deferred) |
| playbook_capability | overlay | advisory | partial (deferred) |

## Files Under Review
| File | Coverage |
|------|---------|
| create-skill/scripts/lib/skill-root-metadata-contract.cjs | covered (1,3) |
| create-skill/scripts/lib/command-metadata-schema.cjs | covered (1) |
| create-skill/scripts/lib/leaf-resource-contract.cjs | covered (1,2) |
| create-skill/scripts/ci-skill-root-metadata.cjs | covered (1,3,4) |
| create-skill/scripts/generate-leaf-manifest.cjs | covered (1,2) |
| create-skill/scripts/ci-leaf-manifest-freshness.cjs | covered (1,3,4) |
| system-skill-advisor/mcp-server/lib/daemon/watcher.ts | covered (1,2) |
| system-skill-advisor/mcp-server/lib/derived/provenance.ts | covered (2) |
| system-skill-advisor/mcp-server/tests/daemon-watcher-new-root-ingestion.vitest.ts | covered (4) |
| create-skill/scripts/init_skill.py | read (scaffold-vs-template) |
| create-skill/references/shared/skill-root-metadata-contract.md | covered (3) |
| 7x */command-metadata.json | sampled + gate-validated |
| .github/workflows/routing-registry-drift.yml | covered (5) |
| .opencode/scripts/git-hooks/pre-push | covered (5) |
| create-skill/scripts/tests/* | covered (4) |

## Review Boundaries
- Max iterations: 5 (reached; stopPolicy=max-iterations)
- Convergence threshold: 0.10 (telemetry-only under max-iterations)
- Severity threshold: P2
- Read-only audit; report only

## Non-Goals
- Implementing fixes (report only); re-running the advisor runtime; files outside spec.md §2.

## Stop Conditions
- 5 iterations completed — loop stopped at max-iterations. All 4 dimensions + required `spec_code` protocol covered. 1 active P1 → CONDITIONAL verdict.
