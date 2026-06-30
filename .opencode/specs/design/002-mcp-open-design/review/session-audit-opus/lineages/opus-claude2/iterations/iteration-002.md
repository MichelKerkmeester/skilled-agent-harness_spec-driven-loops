# Iteration 002: Security

## Focus
**Dimension**: Security — trust boundaries, secrets/token handling, supply-chain guidance, licensing/provenance integrity (the original legal driver), destructive-verb gating
**Files reviewed**: `.opencode/skills/sk-design-interface/SKILL.md`, `.opencode/skills/sk-design-interface/LICENSE.txt`, `.opencode/skills/sk-design-interface/changelog/v1.1.0.0.md`, `.opencode/skills/mcp-open-design/references/od_cli_reference.md`, `.opencode/skills/mcp-open-design/references/tool_surface.md`, `.opencode/skills/mcp-open-design/SKILL.md` (re-read for credential rules) + de-vendor token grep across `sk-design-interface/`

## Scorecard
- Dimensions covered: security
- Files reviewed: 6 (+ tree-wide grep)
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.25

## Verified-Clean (headline security/legal driver)
- **De-vendor / licensing integrity: PASS (verified independently).** The original packet driver was that `sk-design-interface` carried MIT-licensed `ui-ux-pro-max` data + scripts. A tree-wide grep for `ui-ux-pro-max|MIT` returns hits ONLY in (a) `changelog/v1.0.0.0.md` and `v1.1.0.0.md`, which legitimately *record* the removal history, and (b) `manual_testing_playbook/06--licensing-and-provenance/`, which is the verification scenario itself. No live reference doc, principle file, or shipped payload carries MIT-covered material. `scripts/`, `data/`, and `assets/` directories are absent (`ls` → "No such file or directory"). `LICENSE.txt` is genuine Apache-2.0 (`LICENSE.txt:2-3`). `SKILL.md:9` declares `license: Apache-2.0; see LICENSE.txt` and `SKILL.md:16,207` cite the Anthropic `frontend-design` Apache-2.0 upstream. The "read live, never cache" rule (`mcp-open-design/SKILL.md:245`, `tool_surface.md:97`) prevents re-vendoring Open Design's per-source licenses. Conclusion: the skill ships Apache-2.0 only; no residual license obligation. This is a clean PASS on the packet's primary security/compliance goal.
- **Destructive-verb gating: PASS.** `delete_file`/`delete_project` require explicit `project` + `confirm:true` with no active-project fallback (`tool_surface.md:57,96`; `SKILL.md:252`). Mutating verbs are fenced behind confirmation + explicit target + rollback note (`tool_surface.md:72-77`; `SKILL.md:243`).
- **Supply-chain guidance: PASS.** "NEVER pipe `open-design.ai/install.sh` to a shell" is stated in `SKILL.md:254`, `mcp_wiring.md:160`, and `od_cli_reference.md:69-71`, with the rationale that the script is not in the bundle and is unverified.

## Findings

### P2, Suggestion
- **F004**: No safe-handling directive for the `OD_TOOL_TOKEN` bearer when a user runs `od tools` standalone, `.opencode/skills/mcp-open-design/references/od_cli_reference.md:131`, The reference states the `od tools …` wrappers expect `OD_DAEMON_URL` plus `OD_TOOL_TOKEN` (bearer), "which the daemon injects when it spawns an agent. Run standalone, they may need those env vars set." The skill's only credential guidance (`SKILL.md:260` / `tool_surface.md:124` ESCALATE: "do not paste credentials into prompts") is scoped to *cloud* `vela login` auth, not to the local daemon bearer token. When a user is told to set `OD_TOOL_TOKEN` manually for standalone use, there is no directive to (a) pass it via environment rather than a command-line argument visible in the process table / shell history, or (b) avoid echoing it into logs or transcripts. The exposure is bounded (loopback-only daemon, same-origin 403 on cross-origin per `od_cli_reference.md:130`), so this is a low-severity hardening gap, not an exploitable hole — but the bearer-token handling guidance is incomplete relative to how thoroughly the cloud-credential path is fenced.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | not_executed | hard | — | Deferred to traceability iteration (003) |
| checklist_evidence | not_executed | hard | — | Deferred to traceability iteration (003) |

## Assessment
- New findings ratio: 0.25 (1 new P2; novelty declining; no P0/P1).
- Dimensions addressed: security.
- Novelty justification: F004 is a token-handling hardening gap in the standalone-invocation path, distinct from the iteration-1 correctness defects. The dominant security result is the verified-clean licensing/provenance state — the packet's primary compliance objective is genuinely met.

## Ruled Out
- **`/tmp/open-design/ipc/release-stable/daemon.sock` as a world-readable exposure (sibling deepseek F006):** RULED OUT on independent analysis. `od_cli_reference.md:83` reports the socket perms as `srwxr-xr-x` — owner `rwx`, group `r-x`, other `r-x`. Connecting to a Unix domain socket requires **write** permission, which neither group nor other holds; cross-user connection is therefore blocked by the missing `w` bit, and a loopback same-origin check (`od_cli_reference.md:130`) adds a second boundary. The doc reports the perms accurately; the socket is created by the third-party Open Design app (out of scope to change). Not a defect in this packet's work.
- **Shell-injection via `--message "<brief>"` / `--value "..."`:** considered, ruled out — every documented invocation quotes user-supplied content (`SKILL.md:217-223`, `od_cli_reference.md:218-222`) and the skill ships no script that interpolates user content unsafely. Speculative without a shipped unsafe construction.
- **Over-broad `allowed-tools` on sk-design-interface (Write/Edit/Bash):** deferred to maintainability (iteration 4) as a least-privilege/contract concern, not an active security hole — the skill legitimately builds UI (`SKILL.md:109` STEP 3).

## Dead Ends
- None.

## Recommended Next Focus
**Dimension**: Traceability
**Rationale**: Execute the core hard-gate protocols `spec_code` (parent + phase-008/007 normative claims vs shipped skill state) and `checklist_evidence` (checked items in the child-phase checklists vs evidence), plus the `mcp-magicpath` deprecation completeness sweep (phase 008's central claim: the skill is deleted and all live references re-centered onto mcp-open-design).

Review verdict: PASS
