# Deep-Research Iteration 011: naming-versioning-changelog-doc-sweep

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

I’ll treat this as read-only research: first surface any stored context, then load the applicable skill guidance, then read the requested source files and report only analysis.
SKILL ROUTING: Hook surfaced `sk-doc` (0.94) and `deep-context` (0.90); this angle is documentation/naming analysis with no workflow execution, so I’m loading `sk-doc` and keeping the deep-loop workflow itself read-only.
I’m reading the established Context Report first and treating it as the factual baseline for this iteration rather than redoing that sweep.
The baseline confirms this is a documentation/surface decision slice. I’m now reading the named docs and only the surrounding ranges needed to cite exact edits.
I found the framework docs still describe five workflow skills in multiple public-facing surfaces, while `deep-loop-runtime/README.md` is explicitly built around “five consumers.” I’m checking the narrow related-skill and changelog surfaces next.
The changelog template confirms global component changelogs are append-only release narratives under `.opencode/changelog/{NN--component}/v{VERSION}.md`, which matters for preserving histories instead of rewriting them.
There is no existing `.opencode/skills/deep-loop-workflows/` folder yet, and the live skill README set still has the five mode-skill READMEs plus `deep-loop-runtime`. The glob for `.opencode/changelog/*deep*` found no matches, so I’m checking the historical naming pattern more broadly before deciding changelog handling.
I’m doing one metadata check on the changelog directories because the recommendation depends on whether those roots are normal directories or symlinks.
The five workflow changelog roots are symlinks into each skill’s local `changelog/`, so changelog migration must preserve or explicitly replace symlink topology rather than treating `.opencode/changelog/` as independent storage.
One extra count drift surfaced: root `README.md` says 24 skills at line 877, while `.opencode/skills/README.md` says 23 at lines 3 and 33. The merge itself is still a minus-four skill-count delta, but implementation should reconcile both current counts instead of copying one number everywhere.
Besides the requested related-skill lines, I found two live system-spec-kit links to `../deep-research/references/protocol/spec_check_protocol.md`; those will break unless the merged skill preserves that relative target or the links are repointed.
I’m also checking the runtime mirror topology once because the sweep plan must distinguish symlinked skill/command docs from real agent mirrors.
Topology check matched the hard constraint for `.claude/skills`, `.codex/skills` and `.claude/commands`, and confirmed all three agent directories are real directories. `.codex/commands` is absent in this checkout, so any command symlink work there should be inventory-gated.
In this repo `.codex` uses `prompts/` rather than `commands/`, so implementation should verify the command mirror name before applying a blanket command symlink rule.
**Recommendation**
Use `deep-loop-workflows` as the new skill identity with `version: 1.0.0`. Keep `deep-loop-runtime` untouched as the MCP-free backend. Treat the merged skill as one public skill with internal modes, not as a flattened workflow. Preserve old mode names as aliases, mode labels, command names, agent names and changelog history, but remove them as skill IDs.

Rejected alternatives:
- Do not inherit `2.2.0.0` from `deep-ai-council` or `1.16.0.0` from `deep-improvement`. The current source versions are separate lineages: `deep-context` v1.2.0, `deep-research` v1.13.1.0, `deep-review` v1.10.2.0, `deep-ai-council` v2.2.0.0 and `deep-improvement` v1.16.0.0 (`*/SKILL.md:2-6`). A max-version choice would falsely make one mode’s lifecycle the aggregate skill lifecycle.
- Do not rename the runtime or make `deep-loop-runtime` the user-facing workflow owner. Its README still correctly says “No MCP tools, no slash commands” and direct script/import invocation (`deep-loop-runtime/README.md:26-28`, `164-166`).
- Do not mechanically replace every old mode name. Old names remain valid as mode aliases, commands, agent slugs and historical changelog text.

**Changelog Plan**
Create one new active changelog root for future releases: `.opencode/skills/deep-loop-workflows/changelog/`, exposed via `.opencode/changelog/deep-loop-workflows`.

Preserve the five historical changelog streams byte-for-byte under mode-history subdirs, for example:
- `.opencode/skills/deep-loop-workflows/changelog/history/deep-context/`
- `.opencode/skills/deep-loop-workflows/changelog/history/deep-research/`
- `.opencode/skills/deep-loop-workflows/changelog/history/deep-review/`
- `.opencode/skills/deep-loop-workflows/changelog/history/deep-ai-council/`
- `.opencode/skills/deep-loop-workflows/changelog/history/deep-improvement/`

The current `.opencode/changelog/deep-*` entries are symlinks into skill-local changelog dirs, confirmed by `stat`: each of `deep-ai-council`, `deep-context`, `deep-improvement`, `deep-research`, `deep-review` and `deep-loop-runtime` points to `../skills/<skill>/changelog`. Retarget the five old workflow symlinks to the preserved history subdirs so old links do not break. Do not rewrite changelog history bodies; the sk-doc changelog rules say global changelogs live at `.opencode/changelog/{component}/v{VERSION}.md` and lead with release narrative (`sk-doc/assets/changelog_template.md:21-29`, `167-175`).

First new release should be `v1.0.0.md` under the new active root, with a “migration only, behavior preserved” narrative and a table of preserved source mode versions.

**README Narrative**
Use one public story:

`deep-loop-runtime` is the backend. `deep-loop-workflows` is the user-facing workflow skill. It contains internal modes for context, research, review, council and improvement. The eight `/deep:*` commands stay stable. Each mode keeps its own convergence math, state shape, artifacts and permissions.

House voice should be plain and operator-facing, matching the current root README style at `README.md:786-871`: explain what the user gets, then list mode outcomes. Avoid “five skills” language. Say “five workflow modes” or “five loop families inside one skill.”

Suggested conceptual replacement:
- `deep-loop-runtime`: shared engine, not invoked directly.
- `deep-loop-workflows`: one skill containing the context, research, review, council and improvement modes.
- Improvement remains a mode group with four lanes.

**Exact Doc Sweep**
| Path | Lines read | Required change |
|---|---:|---|
| `README.md` | `784-871` | Rewrite Deep Loop section from “five loop families on one shared runtime” to “one runtime plus one workflow skill with internal modes.” Keep per-mode subsections, but label them modes, not skills. Replace line `871` so it links to `deep-loop-workflows/README.md` and `deep-loop-runtime/README.md`, not “each loop’s own README under .opencode/skills/”. |
| `README.md` | `917-937` | Collapse six deep-loop skill entries to two: `deep-loop-runtime` and `deep-loop-workflows`. Move research/review/context/council/improvement descriptions under the workflow skill entry. |
| `README.md` | `1172-1198` | Keep the eight command entries, but change the intro from “five autonomous loop families” to “one workflow skill with mode-specific command surfaces.” |
| `README.md` | `1322-1323` | Replace the brittle slash-enumeration with `deep-loop-runtime` / `deep-loop-workflows`. Move `deep-improvement` out of the `sk-prompt` row because it no longer exists as a skill. |
| `README.md` | `877` | Current file says `24 skills`; after five-to-one merge the correct delta is `20 skills`, unless another angle removes a non-deep skill. |
| `.opencode/skills/README.md` | `3`, `24`, `33`, `53-63` | Collapse deep catalog from six rows to two. The prompt expected `23 -> 19`, but the live directory has 24 skill dirs and this README also lists five `mcp-*` rows while saying `(4)`. I recommend using filesystem truth: `24 -> 20`, `deep-* (6) -> (2)`, and fix `mcp-* (4) -> (5)`. |
| `CLAUDE.md` and `AGENTS.md` | `185-188`, `238-241`, `365-369` | Treat as paired mirrored edits. Keep command workflow rows and agent names, but update Gate 4 line `239` to refer to `deep-loop-workflows` mode invariants instead of per-skill SKILL.md invariants. Change line `369` from “via deep-improvement” to “via the improvement mode in deep-loop-workflows.” |
| `.opencode/skills/deep-loop-runtime/README.md` | `2-3`, `26-29`, `37-43`, `91-95`, `107-125`, `148-162` | Rewrite from “five consumer skills” to “one consumer skill with internal modes.” Keep the no-MCP boundary. Replace the consumer table with a mode table under `deep-loop-workflows`. Update FAQ answers to name the workflow skill and internal modes. |
| `.opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md` | `9-14`, `34`, `41`, `49-52` | Add `deep-loop-workflows` as owning skill, keep old mode names as trigger aliases, and rephrase the rule around “deep workflow modes.” Do not delete command names or agent slugs. |
| `.opencode/skills/system-spec-kit/SKILL.md` | `519`, `531` | Repoint `../deep-research/references/protocol/spec_check_protocol.md` to the merged skill’s research-mode protocol path. Update “Related skills” from `deep-research`/`deep-review` to `deep-loop-workflows`. |
| `.opencode/skills/system-spec-kit/README.md` | `431`, `614` | Repoint the research spec-check protocol link to the merged skill path. |
| `.opencode/skills/system-spec-kit/references/workflows/intake_contract.md` | `290` | Repoint the “Deep-research spec check” path. |
| `.opencode/skills/cli-opencode/SKILL.md` | `28-31`, `286-293`, `439` | Keep agent slugs where they are agent slugs. Update only skill-level related-skill prose at line `439` to `deep-loop-workflows` for loop execution. |
| `.opencode/changelog/*` | metadata check | Add new `deep-loop-workflows` symlink/root. Retarget old workflow changelog symlinks to preserved history. Do not rewrite historical changelog bodies. |
| `descriptions.json` | baseline exclusion | Exclude from rename sweep per Context Report `§3.C` lines `97-98`; old spec slugs/history are not live skill IDs. |

**Risks**
- Count drift is real: `.opencode/skills/README.md` says 23 skills, root `README.md` says 24, and the live directory contains 24 skill dirs. Use generated inventory during implementation.
- Broken symlinks are likely if the five old skill folders are deleted before changelog symlinks are retargeted.
- Overzealous rename will corrupt history and agent semantics. `deep-research`, `deep-review`, `deep-context`, `deep-improvement` and `ai-council` remain valid mode/agent names.
- `deep-loop-runtime/README.md` line `134` currently mentions only `review` or `research` loop types; updating this doc may expose a broader runtime contract issue owned by the backend angle.

**Dependencies**
This recommendation assumes:
- Agent names stay stable, as the Context Report recommends resolving first (`context-report.md:179-181`) and as the current mirror topology supports.
- The command surface stays eight `/deep:*` commands (`context-report.md:183-185`).
- The merged skill preserves per-mode subtrees or otherwise provides stable replacement paths for protocol links before old paths are deleted.
- Advisor metadata/aliases will route old mode names to `deep-loop-workflows`, because `skill_id` is folder-bound (`context-report.md:100-105`).
