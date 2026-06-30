# Iteration 2: D2 Security — Secrets Exposure, Trust Boundaries, Injection Vectors

## Focus
D2 Security: Review token/credential handling, daemon token exposure risk, yolo connect security boundary, `eval`/`raw`/`run` gating policy, input validation, and script injection vectors across the skill package. Focus files: `_common.sh`, `connect-yolo.sh`, `doctor.sh`, `install.sh`, `mcp_wiring.md`, `env_template.md`, `tool_surface.md`.

## Scorecard
- Dimensions covered: security
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F003**: `_common.sh:48-51` exposes daemon token file path and PID file path as shared constants in a sourced script. While the paths themselves are not secrets (they identify where credentials live), a script sourcing `_common.sh` and later echo'ing these paths unnecessarily broadens the attack surface for path-traversal or local file-read exploits. The constant definitions are fine on their own; the risk is downstream misuse. [SOURCE: `.opencode/skills/mcp-figma/scripts/_common.sh:48-51`]
  ```json
  {"findingId":"F003","claim":"_common.sh defines DAEMON_TOKEN_FILE and DAEMON_PID_FILE as globally sourced constants; while the paths are not secrets, an agent or downstream script that echos them without the same 'contents NOT shown' discipline as doctor.sh could leak the token file location in user-facing output.","evidenceRefs":[".opencode/skills/mcp-figma/scripts/_common.sh:48-51",".opencode/skills/mcp-figma/scripts/doctor.sh:32"],"counterevidenceSought":"Grepped all scripts for reads of DAEMON_TOKEN_FILE beyond doctor.sh (which explicitly says contents NOT shown). Only doctor.sh:32 references it, and it guards the content. No script reads .daemon-token contents.","alternativeExplanation":"These are file-path constants needed for daemon health checks; the defensive read of doctor.sh is the right pattern and makes this a purely documentation-level concern.","finalSeverity":"P2","confidence":0.55,"downgradeTrigger":"If no script ever echoes DAEMON_TOKEN_FILE without content-guard discipline, this finding is theoretical and should be downgraded to disproved.","transitions":[{"iteration":2,"from":null,"to":"P2","reason":"Initial discovery"}]}
  ```

### P2, Suggestion
- **F004**: `mcp_wiring.md:146` asserts "Figma Desktop does not need to be open for the MCP path" tagged `[INFERRED]`. The Framelink server wraps the Figma REST API, so this claim is almost certainly correct, but a `[CONFIRMED]` tag from a live Code Mode test that verified `get_figma_data` works with Figma Desktop closed would strengthen the security posture by making the trust boundary explicit. [SOURCE: `.opencode/skills/mcp-figma/references/mcp_wiring.md:146`]
  ```json
  {"findingId":"F004","claim":"mcp_wiring.md states Figma Desktop does not need to be open for the MCP path as an INFERRED claim; confirming this live would validate the REST-API-only trust model and eliminate the risk of an agent assuming Desktop must be open to reach the REST API.","evidenceRefs":[".opencode/skills/mcp-figma/references/mcp_wiring.md:146"],"counterevidenceSought":"Checked the Framelink figma-developer-mcp README (it wraps the REST API, no Desktop dependency). Checked if any code in the skill forces Desktop-open for MCP calls (it doesn't).","alternativeExplanation":"The claim is trivially true for any REST API wrapper; the INFERRED tag is already honest about evidence quality.","finalSeverity":"P2","confidence":0.50,"downgradeTrigger":"If a live test confirms get_figma_data returns data with Figma Desktop closed, upgrade claim to CONFIRMED and downgrade to disproved.","transitions":[{"iteration":2,"from":null,"to":"P2","reason":"Initial discovery"}]}
  ```

### P2, Suggestion
- **F005**: `tool_surface.md:52` classifies `eval`, `raw`, and `run` as ARBITRARY with the rule "review the code/command before running." However, no concrete autofence mechanism enforces this review in the scripts (e.g., dry-run preview, consent prompt). The enforcement relies on the skill contract and agent discipline. A `--dry-run` or `--preview` wrapper for eval/raw/run would add a defense-in-depth layer. [SOURCE: `.opencode/skills/mcp-figma/references/tool_surface.md:52-53`]
  ```json
  {"findingId":"F005","claim":"ARBITRARY command gating (eval/raw/run) relies entirely on agent contract discipline with no programmatic consent check in the thin script wrappers.","evidenceRefs":[".opencode/skills/mcp-figma/references/tool_surface.md:52-53",".opencode/skills/mcp-figma/SKILL.md:259"],"counterevidenceSought":"Checked all 8 scripts for eval/raw/run wrappers (none exist). Checked if the skill's ALWAYS rules enforce pre-review (SKILL.md line 249 says 'review the code/command before running').","alternativeExplanation":"The skill's contract is a runtime behavior rule enforced by the agent framework, not a shell guard. Adding a shell wrapper for eval/raw/run would create a false sense of security without the agent actually reviewing the payload.","finalSeverity":"P2","confidence":0.60,"downgradeTrigger":"If the agent framework (system-spec-kit constitutional) already enforces pre-review for arbitrary-code verbs, the contract-level guard is sufficient.","transitions":[{"iteration":2,"from":null,"to":"P2","reason":"Initial discovery"}]}
  ```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| N/A | - | - | - | Security dimension does not execute traceability protocols |

## Assessment
- New findings ratio: 1.00 (all findings are new — expected for a new dimension)
- Dimensions addressed: security
- Novelty justification: The skill package has a strong security posture. No hardcoded secrets in any of the 8 scripts. The daemon token file is never read-and-echoed (only `doctor.sh` references it with `contents NOT shown`). `connect-yolo.sh` enforces explicit consent via `--i-understand-this-patches-figma`. The `.env` token guidance in `mcp_wiring.md` and `env_template.md` correctly uses the Code Mode prefix convention (`figma_FIGMA_API_KEY`) and warns against committing or exposing credentials. All scripts use `set -euo pipefail`. No shell injection vectors found — all input is validated against whitelists (verb names, source types). The three P2 findings are advisory: a path-constant location disclosure risk (theoretical), an INFERRED claim that could be promoted to CONFIRMED, and a defense-in-depth suggestion for arbitrary-code gating.

## Ruled Out
- **Shell injection via user input**: All scripts use whitelist-based validation (case/esac on verbs, specific flag parsing). No unsanitized user input reaches shell execution contexts. `install.sh` uses hardcoded `REPO_URL`, not user-supplied URLs. [RULED OUT: no injection vector found]
- **Secrets exposure in scripts**: `grep -r 'figd_\|FIGMA_API_KEY\|DAEMON_TOKEN\|token' scripts/` confirmed no hardcoded tokens or secrets in any script. The daemon token path is a constant, not the token value. [RULED OUT: no secrets in code]
- **Yolo patch bypass**: `connect-yolo.sh` has exactly one consent checkpoint (line 11) and exits 2 without the flag. The script does not accept `--help` or any alternative path that could bypass consent. [RULED OUT: consent gate is singular and strict]

## Dead Ends
- **Daemon token local-storage risk**: The daemon token is stored at `~/.figma-ds-cli/.daemon-token` with `127.0.0.1` binding. This is the upstream figma-cli design; the skill cannot change it. Adding file-permission hardening guidance could be a P2 but the upstream tool already sets appropriate permissions. [DEAD END: upstream design, not a skill issue]

## Recommended Next Focus
D3 Traceability: Cross-reference spec claims against shipped behavior. Execute `spec_code` protocol: verify normative claims in phase-002 spec (REQ-001 through REQ-006) and phase-001 spec (R1-R5) resolve to shipped skill behavior. Execute `checklist_evidence` protocol: verify all `[x]` marks in 002 checklist have supporting evidence. Focus files: phase-002 `spec.md`, phase-002 `checklist.md`, SKILL.md.

Review verdict: PASS
