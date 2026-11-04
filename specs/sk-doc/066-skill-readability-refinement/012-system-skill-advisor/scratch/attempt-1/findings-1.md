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