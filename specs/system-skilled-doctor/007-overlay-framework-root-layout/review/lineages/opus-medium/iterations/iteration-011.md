# Iteration 011 - Frontier node F-1-005: traceability and maintainability

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-005 (Barter, read-only nested repo), dimensions traceability (registry next) and maintainability, each with its own pass.
- Review focus addressed: checked ai-speckit's own record of the remediation (039 implementation-summary, recorded in e63bd038a5d) row by row against commit 5dd004f3faa and the tests it names, and judged the cost of the three hooks' duplicated lookup.
- Sources: steer.md absent; strategy; registry frontier (F-1-005 next traceability).

## Files Reviewed

- `barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/implementation-summary.md:76-89` (remediation table), `barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/implementation-summary.md:90-100` (re-pin follow-up), `barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/implementation-summary.md:154-175` (Known Limitations)
- `git show --stat e63bd038a5d` (5 record files) and `git show --stat 5dd004f3faa` (26 files)
- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:83-110`, `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:53-75`, `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:177-189` (three copies of the overlayDir lookup)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R5-P1-001 (Skilled engine) stays active; the 039 record does not mention commits from a linked worktree, which is consistent with it not knowing of the gap.

### P2 Findings

None.

## Traceability Pass

| 039 row | Code or test | Result |
|---------|--------------|--------|
| Commit gate fails closed without a manifest | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:120-146`; pre-commit.test.cjs "refuses a staged vendored change when no manifest exists" (6 of 6, iteration 4) | pass |
| New pre-commit test adopted into the manifest | 5dd004f3faa touches overlay-manifest.json (+7) and adds pre-commit.test.cjs | pass |
| Three hooks read overlayDir, one "../ovl" case each | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:93-107`, `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60-71`, `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:177-187`; guard-core test +10, gate test +14, pre-commit "honours a different overlayDir setting" | pass |
| Plugin case on the real bridge | barter-overlay-guard.test.cjs real-bridge case (3 of 3, iteration 7) | pass |
| relayout-runs ignored and documented | .gitignore:69, README.md:459 | pass |
| Fixture renamed | compiled-routing-byte-parity.test.cjs fixture now `overlays` | pass |
| Rule quotes ../overlays | barter-overlay-first.md:48, 52 | pass |
| Re-pin onto b5a630c, numbers equal baseline | live rerun at iteration 8: in-sync=488, 136/136, RESULT: PASSED, allow | pass |

- Known Limitation 6 records the vendored `barter-overlays` test value as deliberate; R3-P2-001 therefore disputes a recorded decision rather than reporting an oversight.

## Maintainability Pass

- The overlayDir lookup exists three times (bash with inline node, CommonJS, ESM). Each is about ten lines, each falls back to `../overlays` on an absent or unparsable setting, and the engine stays the validator. Phase 007 records the reason (no shared module across the three runtimes). The copies agree today; the cost of a fourth runtime is one more copy. Not raised.
- The commit hook's inline node block (`barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:93-107`) is the least testable copy, and pre-commit.test.cjs covers it end to end, including the unparsable-setting fallback.

## Traceability Checks

- spec_code: pass, every 039 remediation row traced to code or a rerun test.
- checklist_evidence: pass for the 039 verification rows this lineage reran.

## Edge Cases

- The hooks fall back to `../overlays` while the engine falls back to `skilled-overlays` with no setting file (iteration 3). Barter always ships the setting, and the commit gate fails closed either way.

## Confirmed-Clean Surfaces

- 039 remediation table, re-pin numbers, limitations list.

## Ruled Out

- A 039 claim with no evidence behind it: none found.

## Next Focus

- Dimension: security
- Focus area: frontier node F-1-007 (records), with maintainability in the same pass
- Reason: last node with uncovered dimensions
- Rotation status: F-1-001, F-1-003, F-1-005 all dimensions done
- Required evidence: whether the records expose secrets or credentials (008 push credential override), and record maintainability

Review verdict: CONDITIONAL
