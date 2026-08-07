# Iteration 2: Security — transport boundaries and design ownership

## Focus

Cross-transport vocabulary collisions, workspace-mutation trust metadata, and the mandatory `sk-design` judgment boundary for Figma authoring.

## Files Reviewed

- `.opencode/skills/mcp-tooling/hub-router.json`
- `.opencode/skills/mcp-tooling/mode-registry.json`
- `.opencode/skills/mcp-tooling/SKILL.md`
- `.opencode/skills/mcp-tooling/mcp-figma/SKILL.md`
- `.opencode/skills/mcp-tooling/mcp-refero/SKILL.md`
- `.opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`

## Scorecard

- Dimensions covered: security
- Cross-transport collision probes: 1
- Trust-boundary producer/consumer traces: 2
- New findings: P0=0 P1=3 P2=0
- New findings ratio: 1.00

## Findings

### P0

- None.

### P1

- **F005**: The generic phrase `screen examples` is declared by both Refero and Mobbin, `.opencode/skills/mcp-tooling/hub-router.json:192`, so “Find screen examples for a signup flow” selects both remote transports at equal score even though the ordered-bundle contract is for multiple explicitly requested tools and both packets say generic screen language belongs to `sk-design`. Replay loads Refero and Mobbin, plus Chrome through F002. [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/SKILL.md:60] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md:63]
- **F006**: The registry marks Figma `mutatesWorkspace:false`, `.opencode/skills/mcp-tooling/mode-registry.json:139`, while the packet's allowed Bash surface includes export commands that explicitly write local files. The hub-level transport trust classification therefore understates a real local write path. [SOURCE: .opencode/skills/mcp-tooling/mcp-figma/SKILL.md:247] [SOURCE: .opencode/skills/mcp-tooling/mcp-figma/SKILL.md:335]
- **F007**: The Figma packet requires `sk-design` only when a read/export feeds a design decision, `.opencode/skills/mcp-tooling/mcp-figma/SKILL.md:269`, but it directly supports author/modify and token-system operations. This is weaker than the hub's prohibition on any transport design decision without `sk-design` and the design hub's “choose design mode before transport” doctrine, leaving the most design-affecting Figma path without the mandatory judgment pairing. [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:122] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:143] [SOURCE: .opencode/skills/sk-design/SKILL.md:225]

### P2

- None.

## Claim Adjudication

```json
{"findingId":"F005","claim":"An unqualified generic screen-examples request selects both Refero and Mobbin rather than deferring to design judgment or choosing a named provider.","evidenceRefs":[".opencode/skills/mcp-tooling/hub-router.json:15-18",".opencode/skills/mcp-tooling/hub-router.json:192-210",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:404-407",".opencode/skills/mcp-tooling/mcp-refero/SKILL.md:60-66",".opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md:63-69"],"counterevidenceSought":"Replayed the shared exact phrase, checked for provider qualification, and inspected both packet-level generic-design exclusions.","alternativeExplanation":"The two sources could be intentionally bundled, but the task names neither provider and the router contract reserves ordered bundles for explicitly requested tools.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if generic screen examples are explicitly documented and tested as a mandatory two-provider bundle.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Shared-vocabulary replay and packet-boundary trace"}]}
```

```json
{"findingId":"F006","claim":"The registry's mutatesWorkspace false classification for mcp-figma conflicts with an allowed local export path that writes files.","evidenceRefs":[".opencode/skills/mcp-tooling/mode-registry.json:139-156",".opencode/skills/mcp-tooling/mcp-figma/SKILL.md:247",".opencode/skills/mcp-tooling/mcp-figma/SKILL.md:335-337"],"counterevidenceSought":"Checked forbidden tools, Bash ownership, and the packet's own command taxonomy for local-write exceptions.","alternativeExplanation":"The flag may intend only repo-edit tools, but its extension description says transport writes land externally and therefore makes a broader workspace-mutation claim.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if mutatesWorkspace is formally defined to exclude all explicit-output-path Bash writes and downstream consumers never use it as a write-safety signal.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Registry-to-packet trust-boundary trace"}]}
```

```json
{"findingId":"F007","claim":"The Figma packet does not require sk-design for its author/modify path even though the two hub contracts require design judgment before design-affecting transport operations.","evidenceRefs":[".opencode/skills/mcp-tooling/mcp-figma/SKILL.md:24-44",".opencode/skills/mcp-tooling/mcp-figma/SKILL.md:262-269",".opencode/skills/mcp-tooling/SKILL.md:120-143",".opencode/skills/sk-design/SKILL.md:225",".opencode/skills/sk-design/SKILL.md:263-267"],"counterevidenceSought":"Inspected all Figma ALWAYS rules and cross-workflow contracts for a separate authoring-time pairing mandate; both pairing statements are limited to read/export.","alternativeExplanation":"A user may supply fully settled design direction, but the packet has no condition that establishes design judgment before mutating the document.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if another authoritative pre-dispatch layer is shown to load sk-design for every Figma author/modify request.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Cross-hub doctrine comparison"}]}
```

## Traceability Checks

- Not the dedicated traceability iteration; the registry-to-packet and hub-to-packet safety contracts were traced as security evidence.

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: security
- Novelty justification: provider over-dispatch, inaccurate local-write metadata, and missing design-judgment pairing are distinct trust-boundary failures.

## Ruled Out

- Refero and Mobbin packet-local doctrine drift: ruled out; both explicitly hand generic design/UI/screen requests to `sk-design` and require design judgment before design-affecting use. [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/SKILL.md:60] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md:63]
- Direct `Write`/`Edit`/`Task` grant to a transport: ruled out; all three transport registry entries forbid those tools. The Figma issue is the allowed Bash export exception.

## Dead Ends

- Treating route telemetry's `deferReason` as an actual defer: the consumer still returns the tied intents and their resources.

## Next Focus

Traceability and bidirectional projection integrity across registry, description, graph metadata, playbook index, and phase acceptance surfaces.

Review verdict: CONDITIONAL
