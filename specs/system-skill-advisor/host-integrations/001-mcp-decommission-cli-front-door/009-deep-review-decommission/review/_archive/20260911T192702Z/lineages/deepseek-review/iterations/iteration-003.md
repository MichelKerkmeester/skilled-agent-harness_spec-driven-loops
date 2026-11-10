# Iteration 3: D3 Traceability - cross-skill surfaces that still describe the advisor's transport

## Focus

- **Dimension(s)**: traceability (primary), maintainability
- **Scope investigated**: `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md`, `.opencode/skills/system-spec-kit/ARCHITECTURE.md`, `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.opencode/install-guides/README.md`, and liveness evidence for each (root `README.md`, `SKILL.md` resource map, `leaf-aliases.json`, committed trigger index)
- **Brief classes covered**: class 2 (references that describe something other than what ships), class 3 (interconnected surfaces outside the advisor package), class 4 (commands printed in documents that would fail if a reader ran them)
- **Reproduction constraint**: unchanged - read-only probes only

## Scorecard

- Dimensions covered: traceability, maintainability
- Files reviewed: 8
- New findings: P0=0 P1=3 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.41

## Findings

### P0, Blocker

None.

### P1, Required

- **F008**: the daemon CLI reference teaches that MCP is still the primary transport and prints a build command against the deleted directory, `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:17`, `:19`, `:25`, `:31-33`, `:44`, `:126`.

  ```
  $ sed -n '17p;25p;31,33p' .opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md
  The daemon CLI shim is an additive IPC client over the skill-advisor MCP daemon. It is not a replacement server, and MCP remains the primary in-session transport.
  The skill-advisor daemon exposes a CLI front door over the same tool surface its MCP transport serves. ... It is the operator's map; the MCP transport remains the runtimes' route.
  | CLI shim | MCP daemon | Tool count | Primary use |
  | --- | --- | ---: | --- |
  | `node .opencode/bin/skill-advisor.cjs` | `system_skill_advisor` | 9 | Advisor recommendations, ... |
  ```

  The document is unambiguously live, not historical: root `README.md:1048` links it as "Full-parity CLI front doors over the warm daemons", `system-spec-kit/SKILL.md:264` lists it in the resource map, and it carries current frontmatter trigger phrases including `"cli vs mcp transport"` (`:9`). Its own description (`:3`) advertises "when to use CLI transport instead of MCP" - a choice that no longer exists.

  Line 44 is the sharpest inversion: "Because the CLI already uses the same daemon IPC path ..., a later evolution could make it the primary or sole transport, replacing the MCP server without breaking existing MCP workflows. Treat that as a possible direction, not a committed migration plan." That evolution is the shipped state, so the operator is told the packet's outcome is still hypothetical.

  The printed command at `:126` fails today:

  ```
  $ rg -n "mcp-server" .opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md
  126:| `skill-advisor.cjs` | `Run the skill-advisor TypeScript build.` | `npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build` |
  $ test -d .opencode/skills/system-skill-advisor/mcp-server && echo EXISTS || echo "MISSING (the documented --prefix target)"
  MISSING (the documented --prefix target)
  ```

- **F009**: the spec-kit architecture doc asserts the advisor's MCP daemon is still running and that the IPC seam exists to serve MCP, `.opencode/skills/system-spec-kit/ARCHITECTURE.md:157`, `:160`.

  ```
  $ sed -n '157p;160p' .opencode/skills/system-spec-kit/ARCHITECTURE.md
  | `.opencode/skills/system-skill-advisor/mcp-server/database/` | The skill advisor | Its routing graph and doctor state; the only MCP daemon this repository still runs |
  | `shared/ipc/`, `@modelcontextprotocol/sdk` in `shared/` | The skill advisor daemon through `shared/ipc` | The IPC seam the advisor's MCP transport is built on |
  ```

  Three claims are false from the final state: the path is `runtime/database/`; the advisor is not an MCP daemon (and is not the only one - `code_mode` remains registered); and the IPC seam is a transport-neutral socket the launcher bridges, not an MCP seam. This table's stated purpose is ownership ("which component owns this path"), so a stale owner row sends a maintainer to a directory that does not exist.

- **F010**: the environment reference still sources the advisor's variables from the deleted tree, including the two hook-walk targets the packet's own shim no longer uses, `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:142`, `:148`, `:193`, `:194`, `:303`.

  ```
  $ rg -n "mcp-server" .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md | head -6
  142:| `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` | ... | `.opencode/skills/system-skill-advisor/mcp-server/lib/ipc/launcher-idle-timeout.ts`, `.opencode/bin/system-skill-advisor-launcher.cjs` |
  148:| `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` | ... | `.opencode/skills/system-skill-advisor/mcp-server/lib/subprocess.ts`, `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs` |
  193:| `SPECKIT_USER_PROMPT_TARGET` | ... | ... the hook walks up from its own module location looking for `.opencode/skills/system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js`. |
  194:| `SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET` | ... | ... else the ancestor walk resolves `.opencode/skills/system-skill-advisor/mcp-server/dist/hooks/claude/directive-lifecycle-boundary.js`. |
  303:**Owned by the skill advisor, not by this package.** Every `mcp-server/...` path in the Source column below is relative to ...
  ```

  Lines 148 and 193-194 name the deleted plugin bridge and document a resolution target that the live shim does not use:

  ```
  $ rg -n "TARGET_REL" .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts
  19:const TARGET_REL = 'skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js';
  ```

  This is the documented behavior of a hook-resolution override. An operator who sets `SPECKIT_USER_PROMPT_TARGET` and then debugs the documented fallback path is reading a target the code stopped using at the rename. Line 303 compounds it by declaring every `mcp-server/...` path in the document's Source column authoritative.

  Classification note: phase 007 limitation #4 declared "the spec-kit env reference still names `mcp-server/` and `plugin-bridges/` paths in its Source columns" as a known carry-over assigned to "a dedicated sweep" that never ran (phase 008 is unstarted). The finding stands on its own evidence and is neither a surprise nor a duplicate: this pass is the first to record the affected line numbers and the divergence between `:193` and the shim's real `TARGET_REL`.

### P2, Suggestion

- **F011**: the install guide validates the advisor inside the MCP-servers phase, `.opencode/install-guides/README.md:661-666`, `:297`.

  ```
  $ rg -n "2 NATIVE MCP SERVERS|mcp_servers_check" .opencode/install-guides/README.md
  297:    │                     2 NATIVE MCP SERVERS                            │
  661:### Phase 3 Complete Validation: `mcp_servers_check`
  ```

  The advisor's own section (§10.3, `:586-604`) is correct and explicitly says "It registers no MCP server and needs no `opencode.json` entry", and every command it prints uses the live paths. The residue is the phase framing: the advisor's validation row sits under an MCP-servers heading, and the ASCII architecture box still counts two native MCP servers. Counterevidence that keeps this P2: the commands themselves would pass, so an operator following §10.3 is not misled about the transport, only about which phase check owns the advisor.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:25`; `.opencode/skills/system-spec-kit/ARCHITECTURE.md:157`; `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:193` | The packet's normative claims ("no live instruction surface presents the advisor as an MCP server", "nothing outside history resolves a path under the old directory name") are contradicted by three live spec-kit documents, one of which is linked from the root README as the CLI front-door reference. Hard-gate failure: the Traceability STOP vote cannot pass while it stands. |
| checklist_evidence | blocked | hard | target packet is a Level 1 scaffold | Scheduled with the packet-claims pass (iteration 5). |
| feature_catalog_code | partial | advisory | advisor `feature-catalog/` Keeps MCP-named directories by documented decision (007 Key Decisions) | The catalog's group 6 was renamed to `COMMAND SURFACE`; the directory names remain. Deferred to the replay pass to confirm the naming decision still has a reason. |
| playbook_capability | notApplicable | advisory | - | Scheduled for the maintainability pass. |

## Claim Adjudication

```json
{
  "findingId": "F008",
  "claim": "The skill-advisor section of the daemon CLI reference states that MCP remains the primary in-session transport and the runtimes' route, describes the CLI-to-primary migration as a future possibility, and prints a build command against the deleted mcp-server/ directory.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:17",
    ".opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:25",
    ".opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:44",
    ".opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:126"
  ],
  "counterevidenceSought": "Checked whether the document is historical (it is not: it is linked from root README:1048, listed in system-spec-kit/SKILL.md:264's resource map, present in the committed trigger index and leaf manifests, and carries current trigger phrases). Checked whether the packet exempted it: phase 007's residue record lists 12 exempt 'MCP server' lines and none is in this file. Checked whether the mcp-server build target exists (it does not) and what the parent spec declared about system-spec-kit (reverse direction: system-spec-kit itself is a preserve target for the advisor, which is why this is a cross-skill remediation item).",
  "alternativeExplanation": "The reference may be intentionally frozen as a snapshot of the transport decision so operators can read the old model. Rejected: the same document's frontmatter advertises 'when to use CLI transport instead of MCP' as a live choice, and the file is a routed leaf resource rather than a dated record.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if the advisor section is explicitly relabelled as a superseded snapshot with a date and the printed build command is corrected or removed.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F009",
  "claim": "The spec-kit architecture ownership table names the advisor's database under the deleted mcp-server/ path, calls the advisor 'the only MCP daemon this repository still runs', and attributes the shared IPC seam to the advisor's MCP transport.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/ARCHITECTURE.md:157",
    ".opencode/skills/system-spec-kit/ARCHITECTURE.md:160"
  ],
  "counterevidenceSought": "Checked the surrounding table rows to be sure line 157 is a live ownership row and not a changelog entry (it sits in an ownership table that also lists the deep-loop runtime and the continuity writer). Verified no code-graph or advisor MCP daemon remains by grepping runtime configs and the skills directory. Considered that the 'only MCP daemon' phrasing may mean 'only daemon that used to be MCP-served', which would make the sentence merely confusing rather than false - recorded, but the path and the @modelcontextprotocol/sdk attribution are still wrong.",
  "alternativeExplanation": "The rows might be owned by a different decommission packet (the memory-engine removal) and intentionally untouched here. Rejected as a reason to drop the finding: the rows name the advisor's MCP transport specifically, which is this packet's subject, and no exemption lists them.",
  "finalSeverity": "P1",
  "confidence": 0.87,
  "downgradeTrigger": "Downgrade to P2 if the path is corrected while the 'only MCP daemon' phrase is kept with clarified wording.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F010",
  "claim": "The spec-kit environment reference sources advisor variables from the deleted mcp-server/ and plugin-bridges/ paths, and documents the hook-walk fallback target as mcp-server/dist/... while the live shim resolves runtime/dist/...",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:142",
    ".opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:148",
    ".opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:193",
    ".opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19"
  ],
  "counterevidenceSought": "Grepped the whole file for mcp-server to enumerate every hit rather than citing the first, checked the compiled shim for the same constant (matches the source), and confirmed the deleted bridge file is absent. Noted that phase 007 already declared this file a known-stale carry-over with no owning phase, so the finding is pre-declared; the new information is the line-level enumeration and the shim divergence.",
  "alternativeExplanation": "The Source column may be documenting the variable's historic owner rather than its current reader. Rejected: the same file's line 303 declares the mcp-server/ prefix authoritative for every row below it, which is a present-tense instruction to readers.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade to P2 if the Source column is relabelled as historical provenance and the two hook-walk rows are corrected to the runtime/ path.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Assessment

- New findings ratio: 0.41 (severity-weighted new 16.0 over cumulative 39.0 - three P1 at 5.0 plus one P2 at 1.0)
- Dimensions addressed: traceability, maintainability
- Novelty justification: the three P1s are independent documents in a different skill, each with its own failure mode (transport primacy claim, ownership/path claim, env provenance plus a documented resolution target). The drop from 0.52 reflects that the traceability dimension's largest surface - the doctor family - was already swept.

## Ruled Out

- **The spec-kit hook shim's runtime behavior**: `TARGET_REL` is correct (verified above), and the shim's compiled sibling agrees. Only the *documented* target is stale, so the brief's "verify the prompt-time brief" concern does not extend to a broken Claude hook.
- **`references/memory/trigger-config.md` and `references/memory/embedder-pluggability.md`**: the first describes memory-search machinery and its advisor references are ownership statements that remain true; the second's line 192 explicitly puts the retired surface in the past tense ("These four steps ran through the retired memory MCP surface"). Evidence: full-line reads of the two advisor hits.
- **`README.md` (root) and `.opencode/install-guides/README.md` advisor sections**: both describe the CLI front door accurately, including "The advisor registers no MCP server, in `opencode.json` or any other runtime config". Only the install guide's phase framing survives as F011.
- **The advisor's own `feature-catalog/mcp-surface/` directory name**: retained by a written phase-007 decision (it would cascade into `leaf-manifest.json`, `leaf-aliases.json` and the SKILL.md resource map). Not a finding; re-checked in the replay pass.

## Dead Ends

- **Testing the cross-skill surfaces by running their commands** (`npm --prefix .../mcp-server run build`, `/doctor speckit-retrieval`): the first writes into `node_modules`, the second writes doctor state. Reproduction stays at `test -d` plus grep. The failure mode of the printed command is proven by the path's absence, which is a complete proof for a path-resolution defect.

## Recommended Next Focus

Iteration 4 (D4 Maintainability, plus the remaining correctness residue): `.opencode/bin/README.md` (the entrypoint map, which still describes a dual-stack MCP surface), the retired-coverage evidence for the deleted bridge suites, the advisor's pre-existing database-directory alias defect, and the stress suite whose name outlived its referent.

Review verdict: CONDITIONAL
