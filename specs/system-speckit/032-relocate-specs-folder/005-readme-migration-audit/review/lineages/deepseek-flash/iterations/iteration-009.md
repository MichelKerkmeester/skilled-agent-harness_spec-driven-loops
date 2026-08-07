# Iteration 9: Broader topology-drift variant scan

## Focus

Scan beyond the literal-hit set for topology drift in other forms: `opencode/specs` variants, prose mentions of "specs root/directory", and verification that the phase-8-fixed AGENTS.md now correctly labels the symlink (sanity check for the correct-as-is convention).

## Scorecard

- Dimensions covered: [correctness, security, traceability, maintainability]
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

No new findings. Variant scan results:

- `opencode/specs` (no leading dot) matches the same 21 files already covered.
- `scripts/config/README.md`, `scripts/graph/README.md`, `scripts/README.md` all use canonical `specs/<name>` / `<specs-dir>` forms — correct.
- `AGENTS.md:259` correctly labels the legacy path: "Legacy `.opencode/specs/[###-short-name]/` symlink may exist" with `specs/[track]/...` as the canonical path — the correct-as-is convention this migration wants, and evidence that the phase-8 fix established the desired pattern.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | AGENTS.md:259 vs README.md:1303 | AGENTS.md correct; READMEs in scope still stale |
| checklist_evidence | notApplicable | hard | - | No checklist.md |

## Assessment

- New findings ratio: 0.0
- Dimensions addressed: [correctness, security, traceability, maintainability]
- Novelty justification: Confirms the drift is contained to the 21 literal-hit files; AGENTS.md provides the correct-as-is model for fixes.

## Ruled Out

- `scripts/config/README.md`, `scripts/graph/README.md`, `scripts/README.md` — canonical, no finding.
- AGENTS.md — out of scope (non-README) and already correctly fixed in phase 8; no finding.

## Dead Ends

- None.

## Recommended Next Focus

Iteration 10: adversarial P0/P1 replay — re-read cited code for each active P0/P1 (F001, F002, F013, F014, F017), challenge severities, and confirm no false positives before synthesis.

## Claim Adjudication

(No new P0/P1 findings this iteration — no packet required.)

Review verdict: PASS
