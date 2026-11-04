### .skilled/skills/system-skill-advisor/README.md

- [P2] .skilled/skills/system-skill-advisor/README.md:15 | 3 | The tagline repeats the overview’s purpose instead of giving a distinct hook. | Replace with: “Use this README to check advisor commands, trust states and runtime integration paths.”
- [P2] .skilled/skills/system-skill-advisor/README.md:32 | 4 | The Overview has no “When to Use” subsection; that content is under Section 5. | Rename “Why This Skill Exists” to “Purpose” and move lines 178–180 after it under “When to Use,” preserving the wording.
- [P2] .skilled/skills/system-skill-advisor/README.md:99 | 7 | This paragraph packs the plugin’s delivery, lifecycle, deduplication and goal-plugin behavior into one block. | Split it into bullets by behavior, preserving the wording and order.

### .skilled/skills/system-skill-advisor/ROUTER.md

- [P2] .skilled/skills/system-skill-advisor/ROUTER.md:23 | 4 | The Overview describes when requests reach the skill before stating the router’s purpose. | Move lines 25–27 before line 23 and label the blocks “Purpose” and “When to Use,” respectively.
- [P2] .skilled/skills/system-skill-advisor/ROUTER.md:23 | 7 | This paragraph combines request triggers, resource families, navigation indexes and the target-skill boundary. | Split the resource families and ownership boundary into bullets, preserving every claim.
- [P2] .skilled/skills/system-skill-advisor/ROUTER.md:322 | 7 | The fallback paragraph combines transport, degraded behavior, timeout handling and the Python facade. | Split lines 322–328 into bullets by behavior, preserving the wording.

### .skilled/skills/system-skill-advisor/SKILL.md

- [P2] .skilled/skills/system-skill-advisor/SKILL.md:123 | 1 | The Rules subsections are plain, mixed-case labels; the template requires uppercase H3 headings. | Replace `Always:`, `Never:` and `Escalate if:` with `### ALWAYS`, `### NEVER` and `### ESCALATE IF`.
- [P2] .skilled/skills/system-skill-advisor/SKILL.md:96 | 7 | This paragraph combines daemon fallback, JSONL output format and the trust gate. | Split into three bullets, preserving the sentences and order.
- [P2] .skilled/skills/system-skill-advisor/SKILL.md:100 | 7 | This paragraph combines routing metadata sources, frontmatter behavior and authoring guidance. | Split into bullets by mechanism, preserving the sentences and order.
- [P2] .skilled/skills/system-skill-advisor/SKILL.md:111 | 7 | The lifecycle paragraph compresses the watcher, discovery, reindexing and deletion sequence. | Reformat lines 111–117 as ordered steps, preserving the wording.
- [P2] .skilled/skills/system-skill-advisor/SKILL.md:150 | 1 | Section 5 lists local references as inline-code paths, so readers cannot open them directly; the template uses linked references. | Wrap each existing path in a Markdown link using the same path as its target.

### .skilled/skills/system-skill-advisor/references/config/db-path-policy.md

- [P2] .skilled/skills/system-skill-advisor/references/config/db-path-policy.md:15 | 3 | The intro describes the same policy as the Purpose instead of telling readers when to open it. | Replace with: “Open this policy when verifying the SQLite path or evaluating a test/CI override.”
- [P2] .skilled/skills/system-skill-advisor/references/config/db-path-policy.md:80 | 7 | This paragraph combines the override scope, retired variable name and alias-bridge behavior. | Split into bullets by rule, preserving the wording.
- [P2] .skilled/skills/system-skill-advisor/references/config/db-path-policy.md:94 | 7 | This paragraph combines the child-process default, ignored ambient override and test override. | Split into bullets by rule, preserving the wording.

### .skilled/skills/system-skill-advisor/references/decisions/deferred-decisions.md

- clean

### .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md

- [P2] .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:15 | 3 | The intro repeats the Purpose instead of giving readers a distinct hook. | Replace with: “Open this reference when reviewing candidate `enhances` edges or deciding whether to apply them.”
- [P2] .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:53 | 7 | This paragraph describes three separate scoring mechanisms in one block. | Split into three bullets, one per detection rule, preserving the wording.
- [P2] .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:65 | 7 | This paragraph combines candidate selection and the `dryRun` default. | Split into separate bullets for selection and dry-run behavior, preserving the wording.

### .skilled/skills/system-skill-advisor/references/graph/skill-graph-drift.md

- [P2] .skilled/skills/system-skill-advisor/references/graph/skill-graph-drift.md:15 | 3 | The intro restates the Purpose; the requested validator also reported `render_intro_restates_purpose` here. | Replace with: “When advisor status or validation points to stale graph state, this guide identifies the drift source and reconciliation path.”
- [P2] .skilled/skills/system-skill-advisor/references/graph/skill-graph-drift.md:100 | 5 | The reconciliation commands use `--trusted` before the governing trust rule is stated. | Insert before the first reconciliation command: “Trust resolution fails closed. A call is untrusted unless `--trusted` or `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1` is supplied. Mutation commands therefore require the maintainer path.”

### .skilled/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md

- [P2] .skilled/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md:15 | 3 | The intro repeats the current-ownership Purpose instead of giving a distinct hook. | Replace with: “Use this record to check current ownership before acting on references that still place `lib/skill-graph/` under `system-spec-kit`.”
- [P1] .skilled/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md:50 | 8 | The directory inventory says it contains three files, but the directory has six; `metadata-sanitizer.ts`, `doc-frontmatter.ts` and `bfs-traversal.ts` are omitted. | Change “three files” to “six files” and add those three filenames to the list.
- [P2] .skilled/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md:80 | 9 | The `**Done**:` labels are progress tokens in the roadmap. | Replace them with current-state bullets: “ARCHITECTURE.md §1 and §9, and SKILL.md §4 RULES, describe `lib/skill-graph/` as package-local to system-skill-advisor.” and “The obsolete future-work bullet is absent from ARCHITECTURE.md §9.”
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
### .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md

- [P2] .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:16 | 3 | The intro repeats the Purpose instead of telling readers when to use the guide. | Replace with `Open this guide when proposing a scorer-weight change, comparing validation slices before promotion, or rolling back a weight change that regresses routing quality.`
- [P2] .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:86 | 7 | One paragraph packs the edit locations, calibration requirement, experiment override, restart requirement and durable-tuning rule. | Replace with:
  ```md
  Edit `runtime/lib/scorer/lane-registry.ts:7-19` (live weights) or `lane-registry.ts:32-38` (shadow weights). Keep both sums close to 1.0 to preserve the calibration assumptions in `scoring-constants.ts`.

  For experiments:
  - `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` is allowlisted through the launcher and read by `lane-registry.ts`.
  - It requires a daemon restart to apply and suits short-lived experiments only.
  - Durable tuning stays a source edit shipped with measured evidence.
  ```
- [P2] .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:115 | 9 | The body includes a spec path. | Replace with `Open a spec packet at the repository's required spec-packet location, documenting the trigger condition, baseline measurement, proposed weights, plus expected impact.`
- [P2] .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:146 | 9 | The body points to a packet-specific file. | Replace with `Confirm the baseline numbers return. Document the rollback rationale in the original change summary.`

### .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md

- [P2] .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:15 | 3 | The intro restates the Purpose instead of telling readers when to use the reference. | Replace with `Open this reference when running release validation after a scorer, metadata or graph change, diagnosing a slice failure, or deciding whether a lane-weight change can ship.`
- [P2] .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:52 | 9 | “In this packet” is temporary packet-scoped wording in the measurement cells on lines 52 and 53. | Replace `measurement unavailable in this packet` with `measurement unavailable` on both lines.
- [P2] .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:59 | 7 | One paragraph packs three separate metric thresholds and the policy-history qualifier. | Replace with:
  ```md
  **Bounded-delta gate (policy accepted 2026-08-02):** do not regress more than the bounded amount below the baseline captured on **2026-07-30**.
  - Full-corpus top-1 must remain at or above `0.7544` (`0.7744` baseline minus `0.0200`, captured 2026-07-30).
  - Holdout top-1 must remain at or above `0.7261` (`0.7361` baseline minus `0.0100`, captured 2026-07-30).
  - UNKNOWN must remain at or below `15` (`13` baseline plus `2`, captured 2026-07-30).

  The former absolute floors are retired as policy statements; the snapshot JSON and scorer are unchanged.
  ```
