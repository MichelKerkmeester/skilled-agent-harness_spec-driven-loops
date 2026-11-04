### .skilled/skills/system-skill-advisor/references/graph/skill-graph-query-cookbook.md

- [P2] .skilled/skills/system-skill-advisor/references/graph/skill-graph-query-cookbook.md:15 | 3 | The intro restates the Purpose instead of giving a use-trigger hook. | Replace line 15 with: “Use this cookbook while constructing or explaining a `skill_graph_query` call.”

### .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:13 | 3 | No hook follows the H1 before the Overview. | Insert after the H1: “Open this contract when wiring a caller to an advisor capability through the CLI.”
- [P2] .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:15 | 4 | The Overview has no Purpose or When to Use sections. | After the HTML comment, add `### Purpose` with “Defines the CLI command, argument, output and failure contract callers may rely on.” Then add `### When to Use` with bullets “Before invoking an advisor capability through the CLI” and “When deciding how to handle its response or exit code.”
- [P2] .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:57 | 5 | The caller-trust gate follows the command table it governs. | Move “The three mutating commands require caller trust; an untrusted caller is refused before anything is written.” to before the command table at line 44.

### .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md:55 | 5 | The environment-variable gate appears after the launcher behaviors it controls. | Move line 55 to immediately after the “Launcher-Boundary Enforcement” heading at line 45.

### .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md:16 | 3 | The intro repeats the Purpose without telling readers when to open the contract. | Replace line 16 with: “Open this contract when deciding whether an advisor result is usable or whether to rebuild or fall back.”
- [P2] .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md:40 | 7 | One paragraph combines the author-time timestamp, rebuild and scan behavior, restamping rules and haircut refresh guidance. | Split the paragraph into bullets for those four mechanisms, preserving every claim.

### .skilled/skills/system-skill-advisor/references/runtime/legacy-tool-bridge.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/legacy-tool-bridge.md:15 | 3 | The intro restates the Purpose instead of giving a use-trigger hook. | Replace line 15 with: “Open this policy before renaming a public advisor tool id or reviewing callers that still use a compatibility bridge.”

### .skilled/skills/system-skill-advisor/references/runtime/standalone-mcp-shape.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/standalone-mcp-shape.md:15 | 3 | “Summary of…” is a pointer sentence that restates the Purpose. | Replace line 15 with: “Use this reference to check which package owns an advisor operation or whether a proposed cleanup crosses the runtime boundary.”

### .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md

- [P2] .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md:16 | 3 | The intro restates the Purpose instead of giving a use-trigger hook. | Replace line 16 with: “Open this reference when you need the exact command id to call or need to check whether a rename would break callers.”
- [P1] .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md:71 | 2 | The TRUST GATES table has only a header; its access-contract text renders as prose outside the table. | Replace line 71 with: `| \`skill_graph_propagate_enhances\` | Authoring helper, counted in Section 3. | Trusted-caller gate; see [propagate-enhances.md](../graph/propagate-enhances.md) for its access contract. |`
- [P2] .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md:93 | 5 | The trusted-caller requirement follows the invocation examples it governs. | Move the sentence beginning “Calls are sent untrusted by default” to before “Worked examples” at line 85.
- [P2] .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md:93 | 7 | The paragraph combines aliases, trust requirements, warm-only behavior, exit handling and the retired bridge reference. | Split it into bullets for those five mechanisms, preserving every claim.

### .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md

- [P2] .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:17 | 3 | “Reference for…” is a pointer sentence that restates the Purpose. | Replace line 17 with: “Open this reference when a recommendation’s lane attribution or confidence needs explaining, or when checking what attribution may safely expose.”
- [P2] .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:61 | 7 | One paragraph combines the inert environment flag, registry-based shadow status, raw match tags and live ranking behavior. | Split it into bullets for those mechanisms, preserving every claim.
- [P2] .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:93 | 7 | One paragraph combines token boosts, phrase boosts and bounds, score clamping and review-plus-write disambiguation. | Split it into bullets for those four mechanisms, preserving every claim.