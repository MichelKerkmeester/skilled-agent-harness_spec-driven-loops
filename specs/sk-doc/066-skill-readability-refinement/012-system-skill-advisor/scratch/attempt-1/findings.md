### .skilled/skills/system-skill-advisor/README.md

- [P2] .skilled/skills/system-skill-advisor/README.md:99 | 7 | The OpenCode plugin note packs lifecycle delivery, fallback behavior, deduplication, receipt handling and state safety into one paragraph. | Reformat it as bullets, one per mechanism, preserving the existing sentences verbatim.
- [P2] .skilled/skills/system-skill-advisor/README.md:257 | 9 | The document description includes an ephemeral ADR identifier and labels the resource as historical. | Replace `ADR-001 standalone topology record (historical)` with `Standalone advisor topology`; move the historical annotation to the changelog.

### .skilled/skills/system-skill-advisor/ROUTER.md

- [P2] .skilled/skills/system-skill-advisor/ROUTER.md:16 | 3 | The intro points to `SKILL.md` and describes this file’s contents instead of telling readers when to open it. | Replace lines 16–17 with: `Use this router when maintaining advisor resource selection or checking which local documents a prompt loads.`

### .skilled/skills/system-skill-advisor/SKILL.md

- [P2] .skilled/skills/system-skill-advisor/SKILL.md:123 | 1 | `Always:`, `Never:` and `Escalate if:` are plain text labels; the SKILL template requires these RULES subsections as all-caps H3 headings. | Replace the labels with `### ALWAYS`, `### NEVER` and `### ESCALATE IF`.
- [P2] .skilled/skills/system-skill-advisor/SKILL.md:96 | 7 | One paragraph combines degraded fallback behavior, JSONL output semantics and mutation trust gating. | Reformat lines 96–98 as three bullets, one per behavior, preserving the sentences verbatim.
- [P2] .skilled/skills/system-skill-advisor/SKILL.md:100 | 7 | This paragraph combines several routing mechanisms: vocabulary ownership, runtime readers, optional document triggers and the source authors change. | Reformat lines 100–105 as bullets, one per sentence, preserving the wording.
- [P2] .skilled/skills/system-skill-advisor/SKILL.md:111 | 7 | This paragraph packs the skill watcher lifecycle, manual refresh and target retirement into a single block. | Reformat lines 111–117 as ordered steps, preserving the wording and sequence.
- [P2] .skilled/skills/system-skill-advisor/SKILL.md:161 | 9 | The reference descriptions at lines 161, 163 and 168 include an ADR id, historical labels and an F6 deprecation marker. | Replace those descriptions with `Standalone advisor topology`, `Legacy tool bridge policy` and `Deferred hook decisions`; move the historical labels to the changelog.
- [P2] .skilled/skills/system-skill-advisor/SKILL.md:194 | 9 | `(extraction complete)` is authoring history attached to a current ownership statement. | Replace the bullet with: `- The \`lib/skill-graph/\` database and query logic live in \`system-skill-advisor\`.`

### .skilled/skills/system-skill-advisor/references/config/db-path-policy.md

- [P2] .skilled/skills/system-skill-advisor/references/config/db-path-policy.md:15 | 3 | The intro repeats the Purpose by describing the same package-local path policy and test/CI override. | Replace it with: `Open this policy before changing the advisor database path or enabling a test or CI override.`
- [P2] .skilled/skills/system-skill-advisor/references/config/db-path-policy.md:67 | 9 | The rationale contains the ephemeral `ADR-001` identifier. | Replace the sentence with: `Package-local ownership keeps the advisor database beside the code that reads, writes, validates and rebuilds it.`
- [P2] .skilled/skills/system-skill-advisor/references/config/db-path-policy.md:94 | 7 | This paragraph packs the child environment default, ambient-variable handling, its rationale and the test/CI override into one block. | Reformat the paragraph as bullets, one per mechanism, preserving its claims.

### .skilled/skills/system-skill-advisor/references/decisions/deferred-decisions.md

- [P2] .skilled/skills/system-skill-advisor/references/decisions/deferred-decisions.md:15 | 3 | The intro repeats the Purpose’s description of deferred decisions and their rationale. | Replace it with: `Open this reference when an advisor decision could affect a proposed runtime or structural change.`
- [P1] .skilled/skills/system-skill-advisor/references/decisions/deferred-decisions.md:120 | 9 | The removal plan names 2026-08-16 as a future action date, but that date has passed; the current-looking directive leaves its applicability unclear. | Move lines 118–129 to a historical record and state the verified post-window disposition in current guidance.
- [P2] .skilled/skills/system-skill-advisor/references/decisions/deferred-decisions.md:44 | 9 | The body contains dated status and action history, packet identifiers and packet-numbered source paths across F4–F37 (including lines 37, 46, 87, 93, 129, 200, 235 and 259–263). | Move the dated and packet-linked history at lines 37, 44–81, 87–165, 173–211 and 215–263 to a history record; leave only current decision guidance in this body.

### .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md

- [P2] .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:15 | 3 | The intro repeats the Purpose’s description of the tool. | Replace it with: `Open this reference when deciding whether a missing \`enhances\` edge should be reported, proposed or written.`
- [P2] .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:53 | 7 | One paragraph describes three separate detection mechanisms: family inference, asset shape and sibling transitivity. | Reformat the mechanism descriptions as three bullets, preserving their wording.
- [P2] .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:63 | 5 | The `apply` write mode is described before the trusted-caller requirement at line 73, which governs that mode. | Move the trusted-caller requirement at line 73 to immediately after line 59, before the mode descriptions.

### .skilled/skills/system-skill-advisor/references/graph/skill-graph-drift.md

- [P2] .skilled/skills/system-skill-advisor/references/graph/skill-graph-drift.md:15 | 3 | The validator reports that the intro restates the Purpose (0.73 token overlap); it describes the same drift detection and reconciliation. | Replace it with: `Open this runbook when an advisor status or validation result leaves graph freshness in doubt.`

### .skilled/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md

- [P2] .skilled/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md:15 | 3 | The intro repeats the Purpose’s current-ownership description after extraction. | Replace it with: `Open this reference when a proposed change could put skill graph code in the wrong package.`
- [P2] .skilled/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md:62 | 9 | This section recounts prior wording, a realignment delta and the verification used to correct the documentation. | Move lines 62–64 to a history record; keep current ownership facts in the body.
- [P2] .skilled/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md:78 | 6 | The ROADMAP introduces remaining work, then lists two items marked `Done` before the one future-facing item. | Move lines 80–81 before the ROADMAP intro as current-state facts, remove their `Done` labels and leave line 82 as the remaining item.
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
### .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md

- [P2] .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:16 | 3 | The intro restates the Purpose instead of serving as a hook. | Replace the intro and matching `description` at line 3 with: “Open this guide when a proposed lane-weight change needs a pre-promotion evidence check.”

### .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md

- [P2] .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:15 | 3 | The intro restates the Purpose instead of serving as a hook. | Replace the intro and matching `description` at line 3 with: “Open this reference when a validation slice needs investigation or a lane-weight change needs a ship decision.”
- [P2] .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:59 | 7 | One paragraph packs three independent bounded-delta thresholds. | Split the full-corpus, holdout and UNKNOWN threshold clauses into three bullets, preserving their values, baselines and dates; keep the opening policy sentence and closing sentence.
- [P2] .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:59 | 9 | “policy accepted 2026-08-02” is authoring history in the body. | Replace `**Bounded-delta gate (policy accepted 2026-08-02):**` with `**Bounded-delta gate:**`.
