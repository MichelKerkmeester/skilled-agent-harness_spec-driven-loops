# Iteration 1: D1 Correctness — prior-finding closure, tranche A

## Focus

Dimension: correctness (closure verification, `confirm-target.txt` question 1, items 1–4).
Files: `.opencode/commands/doctor/assets/doctor-mcp-install.yaml`, `.opencode/commands/doctor/scripts/mcp-doctor.sh`, `.opencode/bin/system-skill-advisor-launcher.cjs`, `.pi/SYNC.md`. Reproductions re-run against the current tree (HEAD `1470c95c9b`).

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

None this iteration. All four tranche-A closures verified; evidence below.

### Closure verdicts (prior lineage `deepseek-review`)

| Prior finding | Prior severity | Verdict | Reproduction |
|---|---|---|---|
| F001 doctor-mcp-install.yaml advisor install workflow + keyless orphan block | P1 | **CLOSED** | `rg -n -i "advisor" .opencode/commands/doctor/assets/doctor-mcp-install.yaml` → no matches; `rg -n "System Code Graph"` → no matches (exit 1). The advisor's `mcp-servers` entry and the nested keyless block it carried are both gone. |
| F002 mcp-doctor.sh lists the advisor among MCP servers | P1 | **CLOSED** | `rg -n -i "system_skill_advisor\|skill.?advisor" .opencode/commands/doctor/scripts/mcp-doctor.sh` → no matches. Help text and the `detect_and_check_configs` server set no longer name the advisor. |
| F004 launcher reports it built an MCP server; comments name an MCP child under the deleted path | P1 | **CLOSED** | `rg -n -i "mcp" .opencode/bin/system-skill-advisor-launcher.cjs` → no matches. File still boots the daemon (naming hits only: `[system-skill-advisor-launcher]`, `system-skill-advisor` dirs). |
| F005 .pi/SYNC.md describes a caller that no longer exists | P1 | **CLOSED** | Current row: "Registers the code_mode MCP server. The advisor is not an MCP server and is not registered here: `extensions/prompt-advisor.ts` reaches it in-process." `ls .pi/extensions/prompt-advisor.ts` → exists. |

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | 4/9 prior findings re-checked against shipped files | Remaining 5 prior findings scheduled for iteration 2 |
| checklist_evidence | notApplicable this iteration | hard | no checklist.md in target (Level 1) | Level-1 packet: silent checklist class respected; packet docs checked in later iterations |

## Assessment

- New findings ratio: 0.0
- Dimensions addressed: correctness (partial coverage; closure tranche A only)
- Novelty justification: no new defects found; four of nine required closures confirmed against the final tree with reproductions. Zero-yield by design: this pass falsifies closed state rather than hunting new ones.

## Ruled Out

- "The advisor is still wired into the doctor install workflow": the two doctor surfaces named by the prior review carry no advisor strings; the orphan block is gone, not merely repointed.
- "The launcher still presents an MCP child": no MCP token remains anywhere in the file.

## Dead Ends

- Searching `doctor-mcp-install.yaml` for a repointed-but-still-present advisor entry: the entry was removed, not edited. Nothing further to audit there.

## Recommended Next Focus

D1 correctness, tranche B: `daemon-cli-reference.md`, `ARCHITECTURE.md`, `runtime/ENV-REFERENCE.md`, `bin/README.md` — closure for prior F008/F009/F010/F012, with special attention to claims that the runtime configs still supply advisor settings.

Review verdict: PASS
