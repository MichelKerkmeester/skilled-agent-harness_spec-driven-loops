### .skilled/skills/system-skill-advisor/references/graph/skill-graph-query-cookbook.md

- [P2] .skilled/skills/system-skill-advisor/references/graph/skill-graph-query-cookbook.md:15 | 3 | The intro restates the Purpose instead of telling readers when to open the cookbook. | Replace with: `Open this cookbook when building or testing a graph traversal call.`

### .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:13 | 3 | The H1 is followed immediately by Section 1, so the file has no intro hook. | Insert after the H1: `Use this contract when implementing an advisor CLI caller or checking which response fields and exit codes it can rely on.` Then add the required blank line and `---` before Section 1.
- [P2] .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:15 | 4 | Section 1 begins with a comment and blockquote; it has no Purpose or When to Use. | Before the comment, insert: `### Purpose\n\nDefines the frozen invocation, output and exit-code contract for callers of the advisor CLI.\n\n### When to Use\n\n- Implementing an advisor CLI caller.\n- Checking which response fields and exit codes a caller may rely on.`

### .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md:15 | 3 | The intro repeats the Purpose’s description of workspace lease semantics. | Replace with: `Open this contract when diagnosing daemon contention or checking whether a lease is stale.`
- [P2] .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md:110 | 5 | The legacy probe’s skip gate appears after the stale-lease recovery steps it governs. | Move lines 110-112 to after line 98 and before `Stale-lease recovery procedure:`.
- [P2] .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md:112 | 9 | `Phase 006` is an ephemeral phase number in the body. | Replace `During the Phase 006 compatibility window` with `During the compatibility window`.

### .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md:16 | 3 | The intro restates the Purpose’s summary of freshness states, transitions and responsibilities. | Replace with: `Open this contract when a trust state determines whether you rely on an advisor result, rebuild or fall back.`

### .skilled/skills/system-skill-advisor/references/runtime/legacy-tool-bridge.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/legacy-tool-bridge.md:15 | 3 | The intro repeats the Purpose’s compatibility-policy summary. | Replace with: `Open this reference when checking whether a public advisor tool ID can be renamed.`
- [P2] .skilled/skills/system-skill-advisor/references/runtime/legacy-tool-bridge.md:66 | 9 | The sentence records authoring history through an ADR reference. | Replace `ADR-001 chooses compatibility first.` with `Compatibility comes first.`
- [P2] .skilled/skills/system-skill-advisor/references/runtime/legacy-tool-bridge.md:74 | 9 | `child 006` is an ephemeral phase number in the body. | Replace `After child 006` with `After the bridge window`.

### .skilled/skills/system-skill-advisor/references/runtime/standalone-mcp-shape.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/standalone-mcp-shape.md:15 | 3 | The intro repeats the Purpose’s summary of the standalone topology and migration boundary. | Replace with: `Open this reference when checking which package owns an advisor command, scorer or database write.`
- [P2] .skilled/skills/system-skill-advisor/references/runtime/standalone-mcp-shape.md:23 | 9 | The Purpose and Section 2 narrate ADR decisions and a superseded transport as authoring history. | Replace the Purpose with `Documents the current standalone \`system_skill_advisor\` boundary and ownership between advisor routing and adjacent Spec Kit runtimes.` Replace the Section 2 paragraph with `The standalone package is named \`system_skill_advisor\`; its current surface is the CLI front door over the \`runtime/\` daemon.` Move the ADR chronology to its source record.
- [P2] .skilled/skills/system-skill-advisor/references/runtime/standalone-mcp-shape.md:74 | 9 | The ownership table exposes child packet numbers in the body. | Replace the numbered rows with workstream labels, preserving their responsibility text: `Envelope`, `Source and database path`, `Launcher and runtime config`, `Hooks and consumer cutover`, `Cleanup and bridge removal`.

### .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md:16 | 2 | The zero-feature validator reports `render_intro_restates_purpose`; the intro repeats the Purpose rather than acting as a hook. | Replace with: `Use this reference when confirming which advisor or skill-graph command to call or reviewing a proposed rename.`
- [P2] .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md:69 | 7 | Section 4 has a header-only table with no data rows; the access-gate details are prose below it. | Delete lines 69-70; keep the following paragraphs as the trust-gate explanation.

### .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md

- [P2] .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:17 | 3 | The intro restates the Purpose’s summary of scoring, attribution, confidence and safety. | Replace with: `Open this reference when tracing why a recommendation scored as it did or checking how confidence is assembled.`
- [P2] .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:93 | 7 | The paragraph packs phrase matching, boost bounds, validation, score clamping and review-plus-write disambiguation into one block. | Split it into bullets at the existing sentence and semicolon boundaries, preserving every claim, value and path.