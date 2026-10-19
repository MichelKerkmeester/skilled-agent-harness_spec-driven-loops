## (a) sk-doc ARCHITECTURE.md template

**NONE FOUND** — no template file for `ARCHITECTURE.md` exists in `.skilled/skills/sk-doc`.

Grep run: case-insensitive `architecture` over `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-doc` (all files), plus `find **/*rchitecture*` (only hit: `sk-create-skill/references/parent-skill/compiled-routing-architecture.md`, which is about the compiled router, not an ARCHITECTURE.md template).

Two non-template rule mentions only:
- `sk-doc/sk-create-readme/assets/readme-code-template.md` — a **README** template; §3 "ARCHITECTURE PATTERNS" says "Model diagrams on the package-level `ARCHITECTURE.md` style" and §9 links `../../ARCHITECTURE.md`. Does not define an ARCHITECTURE.md standard.
- `sk-doc/shared/references/evergreen-packet-id-rule.md:31,51` — lists `ARCHITECTURE.md` as an **Evergreen doc** class (no packet IDs allowed). Governs authoring, not structure.
- `sk-doc/shared/assets/template-rules.json:448` — `"architecture"` appears only as an optional section of the **changelog** doc type. No architecture doc type defined.

`sk-create-skill/assets/skill/` has `skill-md-template.md`, `skill-readme-template.md`, `skill-reference-template.md`, `skill-procedure-template.md`, `skill-asset-template.md` — **no** `architecture` template.

## (b) Heading lists (side by side)

| system-spec-kit/ARCHITECTURE.md | system-skill-advisor/ARCHITECTURE.md |
|---|---|
| `# Architecture: system-spec-kit` | `# Architecture: system-skill-advisor` |
| `## 1. OVERVIEW` | `## 1. OVERVIEW` |
| `### Architecture diagram` | `### Architecture diagram` |
| `## 2. PACKAGE TOPOLOGY` | `## 2. PACKAGE TOPOLOGY` |
| `## 3. CANONICAL CONTINUITY FLOWS` | `## 3. CANONICAL CONTINUITY FLOWS` |
| `## 4. RUNTIME SUBSYSTEMS` | `## 4. RUNTIME SUBSYSTEMS` |
| `### Ownership of the surfaces the memory store used to touch` | — |
| `## 5. HOOK AND PLUGIN INTEGRATION` | `## 5. HOOK AND PLUGIN INTEGRATION` |
| `## 6. ENFORCEMENT AND VERIFICATION` | `## 6. ENFORCEMENT AND VERIFICATION` |
| `## 7. DECISION RECORDS` | `## 7. DECISION RECORDS` |
| `## 8. RELATED` | `## 8. RELATED` |

Both files carry the same frontmatter title pattern (`# Architecture: <skill-name>`) and an identical 8-section skeleton.

## (c) Differences

The two documents are structurally identical (same 8 numbered H2 sections in the same order, same `### Architecture diagram` under §1). The **only** difference is one H3 subheading present in `system-spec-kit` under §4: `### Ownership of the surfaces the memory store used to touch` (line 146). `system-skill-advisor` has no H3 subheadings. Section line numbers differ slightly (overview body lengths) but heading sets are otherwise the same. (Frontmatter/body content not compared — headings only per task.)

## (d) system-deep-loop candidate files playing the architecture role

No dedicated `ARCHITECTURE.md` exists (`find **/*rchitecture*` → No files found). `grep -ril architecture .skilled/skills/system-deep-loop --include=*.md` returned these files:

Architecture-section candidates (function as the architecture reference):
- `deep-review/references/protocol/quick-reference.md` (`## 3. ARCHITECTURE`)
- `deep-review/SKILL.md` (`### Architecture`)
- `deep-research/references/guides/quick-reference.md` (`## 4. ARCHITECTURE`)
- `deep-research/SKILL.md` (`### Architecture: 3-Layer Integration`)
- `deep-improvement/scripts/shared/README.md` (`## 2. ARCHITECTURE`)
- `deep-improvement/scripts/model-benchmark/README.md` (`## 2. ARCHITECTURE`)
- `deep-improvement/scripts/model-benchmark/scorer/README.md` (`## 2. ARCHITECTURE`)
- `deep-improvement/scripts/model-benchmark/scorer/deterministic/README.md` (`## 2. ARCHITECTURE`)
- `deep-improvement/scripts/model-benchmark/scorer/grader/README.md` (`## 2. ARCHITECTURE`)
- `deep-improvement/scripts/agent-improvement/README.md` (`## 2. ARCHITECTURE`)
- `runtime/lib/README.md` (describes "convergent-architecture spine")
- `runtime/lib/replay-fingerprint/README.md`

Incidental mentions only (not architecture docs):
- `SKILL.md`
- `deep-ai-council/SKILL.md`, `deep-ai-council/README.md`, `deep-ai-council/references/convergence/depth-dispatch.md`, `deep-ai-council/references/patterns/seat-diversity-patterns.md`
- `manual-testing-playbook/manual-testing-playbook.md`, `manual-testing-playbook/runtime-and-backend/external-adapter.md`
- `deep-review/changelog/v1.4.0.0.md`, `deep-review/feature-catalog/loop-lifecycle/initialization.md`
- `deep-improvement/changelog/v1.0.0.0.md`
- `deep-research/assets/deep-research-dashboard.md`, `deep-research/changelog/v1.3.0.0.md`

Strongest single "architecture role" candidate: `deep-review/references/protocol/quick-reference.md` §3 and `deep-review/SKILL.md` §Architecture, since `deep-review` is the packet-level leaf whose architecture sections describe the runtime spine. UNKNOWN whether the committee intends a specific one — the task's step 3 asked only for the candidate list.
