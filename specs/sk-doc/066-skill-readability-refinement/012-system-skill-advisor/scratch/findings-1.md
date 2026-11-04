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