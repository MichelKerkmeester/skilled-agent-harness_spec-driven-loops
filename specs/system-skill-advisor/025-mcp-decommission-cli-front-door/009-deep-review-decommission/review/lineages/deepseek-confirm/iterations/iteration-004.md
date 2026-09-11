# Iteration 4: D2 Security + D4 Maintainability — regression scan and residual advisories

## Focus

Dimensions: security (trust boundary and doc claims on the post-decommission surfaces), maintainability (residue the fixes left or introduced).
Scope: the four post-review fix commits (`1470c95c9b`, `16a01fa20c`, `f5c55c7eb8`, `6aae1d2f39`), the surfaces the confirm context claims were repaired (`.github`, `.gitignore`, bridge docs, trigger index, launcher seam, fallbacks, type rename), and the prior advisories F003/F006/F011/F013/F016/F017.

## Scorecard

- Dimensions covered: security, maintainability
- Files reviewed: 14
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

None.

### P1, Required

None this iteration.

### P2, Suggestion

- **F005**: `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml:244` still enumerates the advisor in the MCP-doctor final report format — `| Skill Advisor | {before} | {after} | {status} |` beside `System Code Graph` and `Code Mode` — while the invariant text at `:27` now says the script runs "against all supported servers (code-mode)" and `mcp-doctor.sh` contains no advisor check. The row's data source is gone, so the report format advertises a server the workflow cannot report on. This is the prior advisory F003 ("MCP debug workflow still enumerates the advisor as a supported MCP server") not fully closed.
  Reproduction: `rg -n "Skill Advisor" .opencode/commands/doctor/assets/doctor-mcp-debug.yaml` → `:244`.
  ```json
  {
    "findingId": "F005",
    "claim": "The MCP debug workflow's final report table still lists the advisor as a server row although the workflow and its doctor script no longer check it.",
    "evidenceRefs": [
      ".opencode/commands/doctor/assets/doctor-mcp-debug.yaml:244",
      ".opencode/commands/doctor/assets/doctor-mcp-debug.yaml:27",
      ".opencode/commands/doctor/scripts/mcp-doctor.sh:1"
    ],
    "counterevidenceSought": "Grepped mcp-doctor.sh for advisor strings (none), re-read the invariant text (code-mode only), and checked the install workflow where the advisor entry was removed outright; only the debug report template retains the row.",
    "alternativeExplanation": "The row could be a placeholder that is conditionally omitted at render time; no conditional structure is present in the template, and the surrounding table always emits three fixed rows.",
    "finalSeverity": "P2",
    "confidence": 0.8,
    "downgradeTrigger": "If the render path conditionally drops the row when the advisor is absent, downgrade to informational.",
    "transitions": [
      { "iteration": 4, "from": null, "to": "P2", "reason": "Initial discovery in confirm loop; residue of prior F003" }
    ]
  }
  ```
- **F006**: Phase 007's limitation block is stale against the tree — prior advisory F016 not closed. `007-docs-and-residue-sweep/implementation-summary.md:159` item 2 claims four pre-existing red tests including `rename-invariants.vitest.ts` asserting the retired registration and the two `plugin-bridge` suites resolving a removed file; the file now asserts the inverse contract (`runtime/tests/rename-invariants.vitest.ts:35-50`) and `runtime/tests/compat/` contains neither bridge suite. Item 4 still says the spec-kit env reference names `mcp-server/` and `plugin-bridges/` paths — the env reference was rewritten since (prior F010 work). Item 1's claim that the packet is not closed remains true, so the block is partially stale rather than wholly.
  Reproduction: `ls .opencode/skills/system-skill-advisor/runtime/tests/compat/` → `README.md daemon-probe.vitest.ts python-compat.vitest.ts redirect-metadata.vitest.ts shim.vitest.ts`; `rg -n "not.toContain\('system_skill_advisor'\)" .opencode/skills/system-skill-advisor/runtime/tests/rename-invariants.vitest.ts` → `:49`.
  ```json
  {
    "findingId": "F006",
    "claim": "Phase 007's limitation block still describes red tests and stale paths that the post-review fixes resolved.",
    "evidenceRefs": [
      "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/007-docs-and-residue-sweep/implementation-summary.md:159",
      ".opencode/skills/system-skill-advisor/runtime/tests/rename-invariants.vitest.ts:49"
    ],
    "counterevidenceSought": "Listed tests/compat/, read the current rename-invariants assertions, and checked the env reference for mcp-server strings (none).",
    "alternativeExplanation": "The block could be a dated record of the phase's exit state; the document is an implementation-summary whose Known Limitations section is the live record the packet cites for F016-closure, so it is treated as current-state.",
    "finalSeverity": "P2",
    "confidence": 0.85,
    "downgradeTrigger": "If the block is explicitly marked as the phase-exit snapshot and a separate current record exists, downgrade to informational.",
    "transitions": [
      { "iteration": 4, "from": null, "to": "P2", "reason": "Initial discovery in confirm loop; residue of prior F016" }
    ]
  }
  ```
- **F007**: `.gitignore:135` carries `.opencode/skills/system-skill-advisor/mcp_server/`, a path that does not exist under the renamed package (`runtime/`) and does not match any current layout; the surrounding block was otherwise repaired to `runtime/` paths. A live config surface still names the retired directory shape.
  Reproduction: `sed -n '135p' .gitignore`; `ls .opencode/skills/system-skill-advisor/` → `INSTALL-GUIDE.md hooks/ runtime/ ...` (no `mcp_server/`).
  ```json
  {
    "findingId": "F007",
    "claim": "A stale gitignore entry still ignores the advisor's retired mcp_server/ directory.",
    "evidenceRefs": [
      ".gitignore:135"
    ],
    "counterevidenceSought": "Listed the advisor skill directory (no mcp_server/), checked the surrounding ignore block (runtime/ paths updated), and searched for any live writer of that path (none).",
    "alternativeExplanation": "The pattern may be a deliberate tombstone to keep an untracked local checkout ignored; no comment says so, and every neighbouring tombstone-style entry was updated to the current shape.",
    "finalSeverity": "P2",
    "confidence": 0.8,
    "downgradeTrigger": "If an operator confirms the entry is an intentional tombstone, downgrade to informational.",
    "transitions": [
      { "iteration": 4, "from": null, "to": "P2", "reason": "Initial discovery during the regression scan" }
    ]
  }
  ```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | fix commits' file lists vs tree; live refs to retired names | Type rename clean in live tree; trigger-index pair regenerated together; CI configs clean |
| checklist_evidence | partial | hard | 008 acceptance rows | AC-008 suite figures not reproducible from the packet (no stored log, scratch empty); recorded as owed evidence, corroborated for the accuracy-gate pair by commit `9015d00c79` |
| feature_catalog_code | notApplicable | advisory | target is a spec folder; no feature catalog claims in scope | - |
| playbook_capability | notApplicable | advisory | no playbook scenarios in the target | - |

## Assessment

- New findings ratio: 1.0 (three P2s; weight 3 of 3)
- Dimensions addressed: security (trust gate read; no secret exposure in the fixed docs; trust-default doc claim already filed as F001), maintainability (residue scan of the repaired surfaces)
- Novelty justification: the regression scan found three live surfaces still carrying retired shapes, one of them introduced by the repair itself (the `.gitignore` block edit) and two the earlier advisories claimed as acted on.

## Ruled Out

- "The caller-context rename broke consumers": zero live references to `MCPCallerContext` outside historical specs; the commit updated all eleven call sites and three test files.
- "The trigger-index regeneration drifted from its fixtures": `trigger-index.json` and the three fixture files were committed together in `f5c55c7eb8`; both files exist and parse.
- "The CI repairs missed a workflow": no advisor token remains under `.github/`.
- "The fallback collapse left a self-fallback": the DB-dir path now reads one env var with a plain directory default; remaining `??` sites in the file are genuine alternates.
- "F011 install guide still frames the advisor as an MCP server": the box now reads `1 NATIVE MCP SERVER + 1 DAEMON-BACKED CLI` and the advisor section states it is validated "for convenience, not because it is an MCP server". Closed.
- "F017 accounting is now in the packet": still absent from packet docs; carried as a deferred item, not a new finding (evidence-placement gap, no false claim created by it).

## Dead Ends

- Hunting for the suite's fifth failure name: the packet names two (the scorer parity pair) and describes three as "command-bridge and metadata checks"; the exact fifth name is not in the packet and cannot be recovered without running the suite, which containment forbids. Recorded as owed, not reconstructed.

## Recommended Next Focus

D5 stabilization: re-adjudicate F001–F007, replay the closure table end to end, confirm dimension coverage and the nine legal-stop gates, then synthesize.

Review verdict: PASS
