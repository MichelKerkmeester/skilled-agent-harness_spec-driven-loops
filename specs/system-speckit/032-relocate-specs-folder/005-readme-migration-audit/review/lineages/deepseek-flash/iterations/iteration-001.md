# Iteration 1: D1 Correctness

## Focus

Audit every non-worktree README with a literal `.opencode/specs` reference for factual staleness after the specs-root topology flip. Verified ground truth: `specs/` is canonical, `.opencode/specs -> ../specs` is a compat symlink (confirmed via `readlink`). Census: 29 total README literal-hit files (23 outside `specs/`, 6 historical spec-doc under `specs/` that are out of scope).

## Scorecard

- Dimensions covered: [correctness]
- Files reviewed: 12 (deep-dive) + 21 (hit-line scan) = 33
- New findings: P0=0 P1=2 P2=10
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P1, Required

- **F001**: system-spec-kit flagship README teaches `.opencode/specs/` as the canonical spec-folder root, `.opencode/skills/system-spec-kit/README.md:128` (also `:661`,`:662`,`:663`,`:701`,`:702`,`:748`,`:846`)
  - Evidence: Line 846 table states "| `.opencode/specs/` | all spec folders created by Spec Kit |"; lines 128/661-663/701-702/748 show `validate.sh .opencode/specs/[project]/NNN-feature/` as the canonical usage pattern. The README contains no statement that `specs/` is canonical or that `.opencode/specs` is a compat symlink (grep for canonical/symlink finds no topology-flip acknowledgement). Post-flip, the canonical root is `specs/`; `.opencode/specs` is the legacy alias. The flagship operator-facing skill doc still instructs the pre-flip layout as canonical.
  - Recommendation: Rewrite the canonical usage examples and the Project-Level References table to `specs/`, noting `.opencode/specs` as a compat symlink.

- **F002**: core/README config resolution description contradicts shipped code, `.opencode/skills/system-spec-kit/scripts/core/README.md:142`
  - Evidence: README claims config.ts "resolves the active specs directories canonical-first (`.opencode/specs` before legacy `specs`, with legacy read fallback)". Actual `config.ts:321-326` `getSpecsDirectories()` returns `['specs', '.opencode/specs']` and `findActiveSpecsDir()` returns the first existing (post-flip that is `specs`). The README statement is inverted relative to the shipped behavior.
  - Recommendation: Correct the line to "(`specs` before legacy `.opencode/specs`, with legacy read fallback)".

### P2, Suggestion

- **F003**: sweep README inverts legacy labels, `.opencode/skills/system-spec-kit/scripts/sweep/README.md:12` — calls `specs` the "legacy" root while `.opencode/specs` is now the legacy alias; the sweep code `strict-pass-freshness.ts:83` itself still lists `.opencode/specs` first (code-level staleness mirrors into the doc).
- **F004**: KPI README teaches spec-folder args relative to `.opencode/specs/`, `.opencode/skills/system-spec-kit/scripts/kpi/README.md:67` — `quality-kpi.sh:59` still joins `.opencode/specs`; doc mirrors un-migrated code.
- **F005**: MCP server README + benchmarks README describe spec-doc scan/authority under `.opencode/specs/`, `.opencode/skills/system-spec-kit/mcp-server/README.md:109` and `.opencode/skills/system-spec-kit/mcp-server/benchmarks/README.md:3` — scan-scope and "Authoritative spec packets live under" claims use the legacy root.
- **F006**: sk-design-md-generator READMEs teach `--output .opencode/specs/<track>/<packet>/output`, `.opencode/skills/sk-design/sk-design-md-generator/README.md:80,91,156` and `backend/README.md:52,55,58,122,126,130,131`.
- **F007**: sk-create-benchmark shared README points audit trail to `.opencode/specs/`, `.opencode/skills/sk-doc/sk-create-benchmark/references/shared/README.md:23`.
- **F008**: bin/lib README teaches changing the authored program under `.opencode/specs/`, `.opencode/bin/lib/README.md:58`.
- **F009**: git-hooks + drift-marker READMEs describe watch logic on `.opencode/specs` (stale root), `.opencode/scripts/git-hooks/lib/README.md:28,37`, `.opencode/scripts/git-hooks/README.md:27,108`, `.opencode/skills/system-spec-kit/scripts/git-hooks/README.md:3,18` — READMEs accurately mirror code that still diffs `.opencode/specs` (post-flip a drift marker watching the legacy alias may miss renames under canonical `specs/`).
- **F010**: root README links via legacy alias (REQ-001 target), `README.md:1303` — the link resolves via the symlink (functional), but uses the legacy alias; recommend canonicalizing to `specs/...`.
- **F011**: deep-alignment + styles/scripts + mcp-server hooks (cursor/devin) + migrations READMEs use/teach `.opencode/specs/` packet pointers, `deep-alignment/assets/conformance-benchmark/README.md:34,66`, `styles/scripts/README.md:112`, `mcp-server/hooks/cursor/README.md:71`, `mcp-server/hooks/devin/README.md:62,63`, `mcp-server/database/migrations/README.md:139`.
- **F012**: command help files teach `.opencode/specs/` (outside literal README.md boundary, same defect class), `.opencode/commands/create/README.txt:160`, `.opencode/commands/memory/README.txt:323`.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | README.md:1303; system-spec-kit/README.md:846; core/README.md:142 | Normative claims about spec-root topology contradict shipped layout in multiple READMEs |
| checklist_evidence | notApplicable | hard | - | No checklist.md exists (Level 1 packet) |

## Assessment

- New findings ratio: 1.0
- Dimensions addressed: [correctness]
- Novelty justification: First iteration, all findings are new; no dedup needed. Ground-truth topology verified live (`.opencode/specs -> ../specs`).

## Ruled Out

- Test-fixture README `.opencode/skills/sk-doc/scripts/tests/code-folder/negative/durability-leak/README.md:7` names `.opencode/specs/temporary-note.md` — intentional negative-test fixture content, not live documentation.
- 6 README hits under `specs/**` (z_archive, prompts, output artifacts) — historical spec-doc content explicitly out of scope per spec.md §3.

## Dead Ends

- None.

## Recommended Next Focus

D2 Security — check for secrets/paths/tooling exposure in the same README set, plus whether any README teaches path-writing that lands outside canonical roots.

## Claim Adjudication

```json
{
  "findingId": "F001",
  "claim": "system-spec-kit/README.md presents `.opencode/specs/` as the canonical spec-folder root in operator-facing usage and reference tables, contradicting the post-flip topology where `specs/` is canonical.",
  "evidenceRefs": [".opencode/skills/system-spec-kit/README.md:846", ".opencode/skills/system-spec-kit/README.md:128", ".opencode/skills/system-spec-kit/README.md:661"],
  "counterevidenceSought": "Grepped the README for canonical/symlink acknowledgements and verified live symlink `readlink .opencode/specs` -> ../specs; no doc statement of the flip was found.",
  "alternativeExplanation": "Could argue `.opencode/specs/` commands still run because the symlink resolves; but the doc's claim of where spec folders live is still the pre-flip canonical claim.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the README adds an explicit 'specs/ is canonical, .opencode/specs is a compat symlink' note and all examples are canonicalized, downgrade to P2.",
  "transitions": [ { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" } ]
}
```

```json
{
  "findingId": "F002",
  "claim": "scripts/core/README.md:142 asserts config.ts resolves `.opencode/specs` before legacy `specs`, but the shipped code returns `specs` first.",
  "evidenceRefs": [".opencode/skills/system-spec-kit/scripts/core/README.md:142", ".opencode/skills/system-spec-kit/scripts/core/config.ts:321"],
  "counterevidenceSought": "Read config.ts getSpecsDirectories() and findActiveSpecsDir() directly; confirmed order ['specs', '.opencode/specs'].",
  "alternativeExplanation": "The README could be describing pre-flip behavior that was not updated; that is exactly the staleness being reported.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "If the README line is corrected to match config.ts order, downgrade to P2.",
  "transitions": [ { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" } ]
}
```

## Ruled Out (ledger)

- [Test fixture]: durability-leak README is negative-test fixture content. Ruled out, fixture.
- [Historical]: specs/** README hits are archive/artifact content. Ruled out, out-of-scope.

Review verdict: CONDITIONAL
