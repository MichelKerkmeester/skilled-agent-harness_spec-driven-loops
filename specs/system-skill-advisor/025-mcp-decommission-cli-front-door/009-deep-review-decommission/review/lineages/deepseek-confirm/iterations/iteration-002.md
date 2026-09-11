# Iteration 2: D1 Correctness — prior-finding closure, tranche B

## Focus

Dimension: correctness (closure verification, `confirm-target.txt` question 1, items 5–8; plus the second half of the packet-completion item seeded for iteration 3).
Files: `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md`, `.opencode/skills/system-spec-kit/ARCHITECTURE.md`, `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.opencode/bin/README.md`.

## Scorecard

- Dimensions covered: correctness, traceability
- Files reviewed: 8
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: ENV-REFERENCE advisor rows still assert runtime-config supply that no committed config carries. `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:313` says `SPECKIT_ADVISOR_DOC_TRIGGERS` is "pinned `true` in the runtime configs (`.claude/mcp.json`, `.codex/config.toml`, `opencode.json`)"; `:366` says `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT` is "Set in the committed MCP registrations". Reproduction: `rg -n "ADVISOR_DOC_TRIGGERS|TRUST_DEFAULT" .claude/mcp.json .codex/config.toml opencode.json .cursor/mcp.json .pi/mcp.json` → no matches; `rg -n "system-skill-advisor|skill-advisor" opencode.json .claude/mcp.json .codex/config.toml .cursor/mcp.json .pi/mcp.json` → no matches. This is the residue of prior F010's iteration-6 refinement (the same two rows), so that required finding does not fully close.
  ```json
  {
    "findingId": "F001",
    "claim": "ENV-REFERENCE.md rows for SPECKIT_ADVISOR_DOC_TRIGGERS and SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT claim committed runtime configs supply those values, but no committed config declares the advisor or either variable.",
    "evidenceRefs": [
      ".opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:313",
      ".opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:366"
    ],
    "counterevidenceSought": "Grepped the five runtime configs for ADVISOR_DOC_TRIGGERS / TRUST_DEFAULT and for any advisor registration; none. Checked the launcher's CHILD_ENV_ALLOWLIST claim in the same row, which the README of the launcher path cannot confirm either; checked the prior review's F010 refinement, which flagged the same rows.",
    "alternativeExplanation": "The rows could describe defaults supplied by the launcher or daemon rather than config registration; rejected because both rows name config files/registrations explicitly ('pinned true in the runtime configs', 'Set in the committed MCP registrations').",
    "finalSeverity": "P1",
    "confidence": 0.92,
    "downgradeTrigger": "If the entries reappear in a committed config, or the rows are rewritten to name the live defaults and their real readers, this becomes P2 doc-churn.",
    "transitions": [
      { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery in confirm loop; residue of prior F010's refinement evidence" }
    ]
  }
  ```
- **F002**: bin/README.md still presents the shim surface as MCP dual-stack, contradicting both the tree and its own file listing. `.opencode/bin/README.md:171` — "The three CLI shims are the dual-stack front door shipped by the MCP-to-CLI transition: the MCP registrations stay unchanged, and the CLI is an additive surface...". Reproduction: the tree has one daemon-backed shim (`skill-advisor.cjs`; §3's own tree lists no code-index shim); `:20` — "Each launcher ... spawns the MCP child", false for `system-skill-advisor-launcher.cjs` (`rg -i "mcp" ...launcher.cjs` → no matches); `:177` names `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE`, whose only occurrence in the repo is this line (`rg -n "CODE_INDEX_CLI_DEV_ALLOW_STALE" .opencode` → this file only); `:179` claims "7 dist-producing packages total (the 3 CLI shims' own `mcp_server`s...)" while `dist-freshness.cjs` `DIST_PACKAGES` holds 6 ids and no `mcp_server` for the advisor (`system-skill-advisor/runtime`). This is the residue of prior F012 (dead dist path fixed; dual-stack description remains), so that required finding does not fully close.
  ```json
  {
    "findingId": "F002",
    "claim": "bin/README.md still describes an MCP dual-stack shim surface ('three CLI shims', 'MCP registrations stay unchanged', 'Each launcher ... spawns the MCP child', a dead dev override, and a stale dist-package count) that the current bin/ tree does not support.",
    "evidenceRefs": [
      ".opencode/bin/README.md:171",
      ".opencode/bin/README.md:20",
      ".opencode/bin/README.md:177",
      ".opencode/bin/README.md:179",
      ".opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:24"
    ],
    "counterevidenceSought": "Listed .opencode/bin (one daemon-backed shim; no code-index shim); counted DIST_PACKAGES ids (6: shared, runtime/cli, runtime, mcp-code-mode/mcp-server, system-skill-advisor/runtime, sk-design-md-generator/backend); grepped the launcher for MCP strings (none); compared the prose against §3's own directory tree, which lists exactly one daemon-backed shim.",
    "alternativeExplanation": "The paragraph could be a historical transition note; rejected because it is present-tense operator usage guidance ('Usage is uniform across all three') and names a dev-override flag an operator could set today.",
    "finalSeverity": "P1",
    "confidence": 0.85,
    "downgradeTrigger": "If the section is rewritten to the surviving shim and accurate package table, or if a second/third shim is confirmed that this review failed to see, downgrade or resolve.",
    "transitions": [
      { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery in confirm loop; residue of prior F012" }
    ]
  }
  ```

### P2, Suggestion

None this iteration.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | daemon-cli-reference.md:128 build target exists; ARCHITECTURE.md:157 names runtime/database; ENV-REFERENCE.md:193 walk target matches `TARGET_REL` in the shim; bin/README.md:171 contradicts the tree | 8 of 9 prior required findings now assessed; F010 and F012 marked partially open |
| checklist_evidence | notApplicable this iteration | hard | no checklist.md in target (Level 1) | packet record assessed in iteration 3 |

## Assessment

- New findings ratio: 1.0 (two new P1s; weight 10 of 10)
- Dimensions addressed: correctness (closure tranche B), traceability (F001, F002 are doc-vs-tree alignment)
- Novelty justification: closure re-verification produced two non-closures that the prior set's remediation claimed closed; both are live instruction surfaces, both reproducible with single commands.

## Ruled Out

- "daemon-cli-reference.md still teaches MCP as primary": current text states the CLI is the only transport and "There is no MCP server to fall back to" (`:164`); the build command at `:128` resolves to an existing `package.json` with a `build` script. Closed.
- "ARCHITECTURE.md still calls the advisor an MCP daemon under mcp-server/": zero `mcp-server` hits; `:157` names `runtime/database/` and the daemon's own socket protocol. The `:160` SDK retention note was checked against `shared/ipc/socket-server.ts:14` (imports `StdioServerTransport`) and `launcher-ipc-bridge.cjs:249` (sends the `liveness-probe` frame) — accurate as written. Closed.
- "ENV-REFERENCE hook-walk targets are stale": `ENV-REFERENCE.md:193` names `.opencode/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js`; the shim's `TARGET_REL` matches and the dist file exists. That clause is closed; the config-registration clause is F001.

## Dead Ends

- Hunting a third shim outside `bin/` to rescue the README's "three CLI shims": none exists; the phrase is stale prose, not a missed binary.

## Recommended Next Focus

D3 traceability — the packet's own completion presentation (`spec.md`, `tasks.md`, `plan.md`, `description.json`, `implementation-summary.md`) and the prior lineage's archived report claims; then D4 for what the fixes touched.

Review verdict: CONDITIONAL
