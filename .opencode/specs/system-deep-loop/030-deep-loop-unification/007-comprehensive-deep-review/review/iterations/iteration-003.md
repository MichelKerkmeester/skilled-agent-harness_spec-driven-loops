# Deep Review Iteration 003

## Dimension
Security - hub tier.

## Files Reviewed
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md:83`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:4`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:9`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/system-deep-loop/SKILL.md:5`
- `.opencode/skills/system-deep-loop/SKILL.md:37`
- `.opencode/skills/system-deep-loop/SKILL.md:46`
- `.opencode/skills/system-deep-loop/SKILL.md:55`
- `.opencode/skills/system-deep-loop/SKILL.md:62`
- `.opencode/skills/system-deep-loop/SKILL.md:66`
- `.opencode/skills/system-deep-loop/SKILL.md:101`
- `.opencode/skills/system-deep-loop/mode-registry.json:36`
- `.opencode/skills/system-deep-loop/mode-registry.json:60`
- `.opencode/skills/system-deep-loop/mode-registry.json:84`
- `.opencode/skills/system-deep-loop/mode-registry.json:108`
- `.opencode/skills/system-deep-loop/mode-registry.json:134`
- `.opencode/skills/system-deep-loop/mode-registry.json:157`
- `.opencode/skills/system-deep-loop/mode-registry.json:180`
- `.opencode/skills/system-deep-loop/hub-router.json:15`
- `.opencode/skills/system-deep-loop/hub-router.json:52`
- `.opencode/skills/system-deep-loop/description.json:3`
- `.opencode/skills/system-deep-loop/graph-metadata.json:61`

## Findings by Severity

### P0
None.

### P1
None.

### P2

#### DR-003-P2-001 [P2] Hub frontmatter grants broad tools despite routing-only behavior
- File: `.opencode/skills/system-deep-loop/SKILL.md:5`
- Evidence: The hub frontmatter grants `Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch`, but the hub describes itself as holding no per-mode logic and only classifying a request, resolving `workflowMode`, reading the registry, guarding the packet path, and loading the packet `SKILL.md` (`.opencode/skills/system-deep-loop/SKILL.md:37`, `.opencode/skills/system-deep-loop/SKILL.md:46`, `.opencode/skills/system-deep-loop/SKILL.md:55`, `.opencode/skills/system-deep-loop/SKILL.md:62`). Per-mode behavior and tool-permission guards are delegated to mode packets (`.opencode/skills/system-deep-loop/SKILL.md:66`).
- Finding class: instance-only
- Scope proof: This finding is limited to the hub frontmatter. `mode-registry.json` mutating surfaces correspond to modes that write research/review/council/improvement artifacts or run improvement hosts (`.opencode/skills/system-deep-loop/mode-registry.json:36`, `.opencode/skills/system-deep-loop/mode-registry.json:60`, `.opencode/skills/system-deep-loop/mode-registry.json:84`, `.opencode/skills/system-deep-loop/mode-registry.json:108`, `.opencode/skills/system-deep-loop/mode-registry.json:134`, `.opencode/skills/system-deep-loop/mode-registry.json:157`, `.opencode/skills/system-deep-loop/mode-registry.json:180`).
- Affected surface hints: [`hub skill frontmatter`, `tool grant boundary`, `mode packet delegation`]
- riskScore: 2 (advisory only)
- Recommendation: Narrow the hub-level `allowed-tools` to what the routing layer itself needs, or document why the parent hub must intentionally expose the union of child-mode tools before packet selection.

## Traceability Checks
- Path containment: PASS. The routing prose requires guarding `mode-registry.json` inside `SKILL_ROOT`, returning fallback for missing modes, and guarding `registry[mode].packet/SKILL.md` inside `SKILL_ROOT` before load (`.opencode/skills/system-deep-loop/SKILL.md:49`, `.opencode/skills/system-deep-loop/SKILL.md:54`, `.opencode/skills/system-deep-loop/SKILL.md:55`, `.opencode/skills/system-deep-loop/SKILL.md:62`). No path-escape route was confirmed.
- Secrets exposure: PASS. The hub tier files read in this iteration contain routing metadata and descriptions only; a hub-only credential scan over `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` returned no matches for credential/token/password/private-key/internal-URL patterns.
- Hub `allowed-tools`: P2 advisory. The hub grants broad tools not needed by the described routing-only layer (`.opencode/skills/system-deep-loop/SKILL.md:5`, `.opencode/skills/system-deep-loop/SKILL.md:37`).
- Registry `toolSurface`: PASS. The mutating tool declarations are not new security findings because the registry modes describe artifact-producing workflows or improvement hosts, and the hub explicitly delegates per-mode behavior and guards to the packets (`.opencode/skills/system-deep-loop/SKILL.md:66`).
- Already-registered findings: The existing README/runtime label advisory from iteration 2 was not re-counted as new.

## Verdict
PASS with P2 advisory. No P0/P1 security finding was confirmed in the hub tier.

## Next Dimension
Hub-tier traceability: cross-check mode identity, command/agent aliases, registry/router/metadata consistency, and packet-boundary claims without re-counting the existing README/runtime label or hub tool-grant advisories.

Review verdict: PASS
