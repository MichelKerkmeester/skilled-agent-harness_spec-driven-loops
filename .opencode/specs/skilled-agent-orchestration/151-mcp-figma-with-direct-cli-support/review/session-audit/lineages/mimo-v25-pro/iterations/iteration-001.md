# Iteration 1: Correctness

## Focus
Correctness dimension review of the mcp-figma skill package. Reviewed SKILL.md, all 8 scripts in `scripts/`, references (`tool_surface.md`, `mcp_wiring.md`, `troubleshooting.md`), the graph-metadata.json, and the spec folder documents (spec.md, checklist.md, implementation-summary.md) for the 002 phase.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 14
- New findings: P0=0 P1=2 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker
None.

### P1, Required

- **F001**: connect-yolo.sh does not verify Figma Desktop is running before patching, `.opencode/skills/mcp-figma/scripts/connect-yolo.sh:30`. The script checks that Figma Desktop *exists on disk* via `figma_desktop_path` but does not verify it is *running* (e.g. via `pgrep -x Figma`). The yolo patch modifies the running app.asar bundle and restarts Figma; patching while Figma is not running may leave the bundle in an inconsistent state. The safe connect script (`connect-safe.sh:10`) at least warns when Figma is not found, but neither script verifies the running process. This is a correctness gap in the safety gating: the skill's ALWAYS rule #2 states "ALWAYS require Figma Desktop open with a file" but the yolo enforcement script does not check this precondition.

- **F002**: install.sh auto mode does not handle repo install failure gracefully, `.opencode/skills/mcp-figma/scripts/install.sh:146-158`. In the `auto` branch, when the npm version is stale, `install_repo` is called but its exit code is not checked. If the repo clone or npm build inside the repo fails, the user is left with the stale npm `1.0.0` binary and no error. The script proceeds to `verify_install` which may report success with the old minimal build. The `|| true` on line 147 masks npm failures but the repo path on line 156 has no error handling at all.

### P2, Suggestion

- **F003**: Inconsistent daemon file path naming between token and PID, `.opencode/skills/mcp-figma/scripts/_common.sh:48-49`. `DAEMON_TOKEN_FILE` uses `$HOME/.figma-ds-cli/.daemon-token` (canonical binary name) while `DAEMON_PID_FILE` uses `$HOME/.figma-cli-daemon.pid` (legacy binary name). The constants are defined but not actually used by the scripts (they rely on the CLI's own defaults), so this is cosmetic. However, it creates confusion about which naming convention the daemon actually uses.

- **F004**: tool_surface.md references a nonexistent research output file, `.opencode/skills/mcp-figma/references/tool_surface.md:164`. Line 164 references `151-mcp-figma-with-direct-cli-support/001-figma-cli-and-mcp-research/research/raw/iter-001.out` for the "full per-flag table (~130 rows)". The `001-figma-cli-and-mcp-research/research/` directory contains only `research.md` and `iterations/` — no `raw/` directory exists. This is a phantom reference to data that was not preserved in the packet.

- **F005**: Graph metadata siblings array does not include mcp-magicpath despite spec claiming reciprocal edges were added, `.opencode/skills/mcp-figma/graph-metadata.json:26-37`. The implementation-summary.md (line 93) and the 002 spec (line 93) both state "Sibling skills' graph-metadata.json — Modified — Reciprocal sibling edges (mcp-open-design, mcp-chrome-devtools, mcp-magicpath)" but the graph-metadata.json `siblings` array only contains `mcp-open-design` and `mcp-chrome-devtools`. The `mcp-magicpath` edge is missing.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F001: SKILL.md ALWAYS#2 vs connect-yolo.sh | Spec claims Figma must be open; enforcement script does not verify running state |
| checklist_evidence | partial | hard | CHK-021 checked "every command classified" but tool_surface.md has phantom ref | Checklist evidence is self-referential |
| feature_catalog_code | pending | advisory | — | Not reviewed this iteration |
| playbook_capability | pending | advisory | — | Not reviewed this iteration |

## Assessment
- New findings ratio: 1.0 (first iteration, all findings are new)
- Dimensions addressed: correctness
- Novelty justification: First pass at correctness across all implementation files; 2 P1 findings relate to safety-gating enforcement gaps

## Ruled Out
- None this iteration

## Dead Ends
- None this iteration

## Recommended Next Focus
D2 Security — review the daemon token handling, the yolo patch safety model, the `eval/raw/run` arbitrary mutation surface, and the Code Mode `.env` token exposure path.

---

```json
{
  "findingId": "F001",
  "claim": "connect-yolo.sh checks Figma Desktop exists on disk but does not verify it is running before applying the app.asar patch.",
  "evidenceRefs": [
    ".opencode/skills/mcp-figma/scripts/connect-yolo.sh:30",
    ".opencode/skills/mcp-figma/scripts/connect-safe.sh:10",
    ".opencode/skills/mcp-figma/SKILL.md:244"
  ],
  "counterevidenceSought": "Checked if figma_bin or any helper verifies the running process; grep for pgrep/pkill/ps in all scripts; reviewed the CLI's own connect behavior documentation. The CLI itself may handle this internally, but the gating script does not enforce it.",
  "alternativeExplanation": "The figma-ds-cli connect command itself may fail gracefully if Figma is not running, making the script-level check redundant. However, the skill's ALWAYS rule #2 explicitly requires verifying Figma is open, and the safety gating should enforce this before invoking the CLI, not rely on CLI failure.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If figma-ds-cli connect (yolo) is confirmed to check Figma Desktop running state internally and refuse to patch when Figma is not running, downgrade to P2 (defense-in-depth gap)."
}
```

```json
{
  "findingId": "F002",
  "claim": "install.sh auto mode does not handle repo install failure, leaving the user with a stale npm binary and no error.",
  "evidenceRefs": [
    ".opencode/skills/mcp-figma/scripts/install.sh:146-158"
  ],
  "counterevidenceSought": "Checked if set -e catches the failure; verified that install_repo does not use set -e internally (it's a function in the same script). The git clone and npm install commands inside install_repo would cause the script to exit due to set -e, but the auto branch calls install_repo without || true or a trap.",
  "alternativeExplanation": "The set -e in the script header would cause the entire script to exit if install_repo fails, which is a form of error handling. However, the user gets no guidance on what to do next — the script just exits mid-flow with a potentially confusing error from git or npm.",
  "finalSeverity": "P1",
  "confidence": 0.75,
  "downgradeTrigger": "If install_repo is wrapped in a conditional that falls back to reporting the stale npm version with clear next-step guidance, downgrade to P2."
}
```

Review verdict: CONDITIONAL
