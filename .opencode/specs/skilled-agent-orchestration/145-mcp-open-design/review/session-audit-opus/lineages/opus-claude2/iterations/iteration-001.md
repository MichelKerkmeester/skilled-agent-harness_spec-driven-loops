# Iteration 001: Correctness

## Focus
**Dimension**: Correctness — logic errors, dead/declared-but-unused code, wrong claims, internal contradictions
**Files reviewed**: `.opencode/skills/mcp-open-design/SKILL.md`, `.opencode/skills/mcp-open-design/references/od_cli_reference.md`, `.opencode/skills/mcp-open-design/references/mcp_wiring.md`, `.opencode/skills/mcp-open-design/references/tool_surface.md`, `.opencode/skills/mcp-open-design/changelog/v1.2.0.0.md`, `.opencode/skills/mcp-open-design/graph-metadata.json`

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Verified-Clean (independent re-check of sibling findings)
- **Version consistency (sibling deepseek lineage P1 "F001"): RESOLVED in live state.** `mcp-open-design/SKILL.md:9` now declares `version: 1.2.0`, matching `changelog/v1.2.0.0.md:1` and the changelog list in `graph-metadata.json`. A finding-is-a-hypothesis re-check confirms the stale-version P1 no longer holds. Not carried forward.
- **Multi-turn generation flow internal consistency: PASS.** The "turn 1 returns a discovery form / 0 files / answer it to fire the build" model is stated identically in `SKILL.md:211-228`, `od_cli_reference.md:169-181`, and `tool_surface.md:101-117`. No contradiction across the three docs.
- **"Adding a file is not creating a design" (`od artifacts create`): PASS.** Consistent across `SKILL.md:228`, `od_cli_reference.md:181`, `tool_surface.md:53/115`.

## Findings

### P2, Suggestion
- **F001**: `DESIGN_INTENTS` declared but never referenced in the routing pseudocode, `.opencode/skills/mcp-open-design/SKILL.md:116`, The smart-router block declares `DESIGN_INTENTS = {"READ", "RUN"}` (line 116) with a comment that READ/RUN intents "Also load sk-interface-design and apply its principles before deciding." But `route_open_design_resources()` (lines 157-175) never reads `DESIGN_INTENTS` and never loads the cross-skill — it only loads `RESOURCE_MAP` entries within this skill. The pseudocode therefore does not implement the cross-skill loading that ALWAYS rule 5 (`SKILL.md:244`) and the Section 2 resource table (`SKILL.md:87-88`) make mandatory for design work. The symbol is dead and the contract it gestures at is unexpressed in the routing logic. Low blast radius (pseudocode is illustrative, not executed), but a reader implementing the router from this block would silently drop the sk-interface-design load.

- **F002**: Confidence inconsistency on the daemon-down install fallback between two references, `.opencode/skills/mcp-open-design/references/mcp_wiring.md:65` and `.opencode/skills/mcp-open-design/references/od_cli_reference.md:244`, `mcp_wiring.md:65` states as established behavior: "If the daemon is down at install time, the installer falls back to a minimal `{command:"od", args:["mcp","--daemon-url",<base>], env:{}}` entry that assumes a PATH `od`." But `od_cli_reference.md:244` (Section 7 item 8, the UNCERTAIN / NEEDS LIVE VERIFICATION list) records the same scenario as unresolved: "Whether `od mcp install` re-derives a `7456` fallback entry when run while the daemon is down ... Confirm both with dry-runs in each state." The two reference docs in the same skill assign different confidence to the identical question — one asserts the fallback shape, the other flags it as needing a live check. A reader cross-referencing both gets contradictory certainty signals.

- **F003**: `command[0]` guidance reads as self-contradicting between the install-info spec and the manual fallback, `.opencode/skills/mcp-open-design/references/mcp_wiring.md:60` and `.opencode/skills/mcp-open-design/references/mcp_wiring.md:125`, Section 2 emphasizes that the canonical install spec's `command[0]` is "the **'Open Design Helper'** Electron binary running the daemon now (NOT `Contents/MacOS/Open Design`)" (line 60). Section 5's hand-authored manual fallback then uses exactly `"/Applications/Open Design.app/Contents/MacOS/Open Design"` as `command[0]` (line 125). Both are defensible — the install-info value reports the already-running helper's `execPath`, while the manual entry spawns a fresh Electron-as-node runtime, which `od_cli_reference.md:52,66` documents as a valid form (`OD_NODE_BIN`). But the emphatic parenthetical "(NOT `Contents/MacOS/Open Design`)" in Section 2 directly contradicts the literal value Section 5 tells the reader to paste, with no note reconciling the two. A one-line clarification (install-info reflects the live helper; the manual entry intentionally uses the bundled Electron-as-node) would remove the apparent contradiction.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | not_executed | hard | — | Deferred to traceability iteration (003) |
| checklist_evidence | not_executed | hard | — | Deferred to traceability iteration (003) |

## Assessment
- New findings ratio: 1.00 (first iteration; all 3 findings new).
- Dimensions addressed: correctness.
- Novelty justification: F001 is dead/declared-but-unused routing logic with an unexpressed cross-skill contract; F002 is an inter-reference confidence contradiction; F003 is an intra-reference `command[0]` contradiction. All three are documentation-correctness defects, not behavioral bugs — appropriate since the "code" under review is skill prose + pseudocode, not executable code.
- No P0/P1: the load-bearing operational claims (CLI location, socket transport, ephemeral-port discovery, multi-turn generation, gating policy) are internally consistent and largely tagged [CONFIRMED - live-verified]. The sibling lineage's only P1 (stale version) is resolved.

## Ruled Out
- Stale `mcp-open-design` version (sibling P1): re-checked, resolved (SKILL.md:9 = 1.2.0). Not recorded.
- `od mcp live-artifacts` absence from `tool_surface.md`: considered as a coverage gap (sibling deepseek F003), but `live-artifacts` is a *separate* stdio server (`od_cli_reference.md:144`) explicitly flagged as un-enumerable from `--help` (`od_cli_reference.md:243`); `tool_surface.md` legitimately scopes itself to the main `od mcp` server's 18 tools. Not a correctness defect.

## Dead Ends
- None.

## Recommended Next Focus
**Dimension**: Security
**Rationale**: The skill governs CLI invocation under Node/Electron, environment-variable injection (`OD_DATA_DIR`, `OD_SIDECAR_IPC_PATH`, `OD_TOOL_TOKEN`, `OD_DAEMON_URL`), a world-readable `/tmp` socket path, and a destructive verb surface (`delete_file`, `delete_project`). Review for secrets exposure, trust-boundary correctness, and whether the gating policy adequately fences the mutating/destructive surface.

Review verdict: PASS
