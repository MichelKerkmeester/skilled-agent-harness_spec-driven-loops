### .skilled/skills/system-spec-kit/README.md

- [P2] .skilled/skills/system-spec-kit/README.md:33 | 4 | The Overview leaves its only “When to Use” section in §7. | Rename “Why This Skill Exists” to “Purpose” and move lines 404–412 after the Purpose text at line 37, before “What It Does,” as `### When to Use`.
- [P2] .skilled/skills/system-spec-kit/README.md:75 | 7 | The Session relaunch and Decision capture table cells pack multiple mechanisms into dense paragraphs. | Keep the table, shorten those cells to summaries, and move their existing details into separate labeled lists immediately after it.
- [P2] .skilled/skills/system-spec-kit/README.md:300 | 9 | “Used to sit here” and “none of that came back” record architecture history in the body. | Replace lines 300–303 with: `System Spec Kit has no memory MCP server. Its search pipeline, query intelligence, memory lifecycle, save scoring, causal graph, index self-maintenance and evaluation harness have no successor.`
- [P2] .skilled/skills/system-spec-kit/README.md:304 | 7 | Lines 304–310 combine trigger lookup, free-text search, continuity writing and retired capabilities in one prose block. | Keep line 304 as the lead-in and split lines 305–310 into labeled bullets for trigger-index lookup, free-text retrieval, continuity and declared losses.

### .skilled/skills/system-spec-kit/ROUTER.md

- [P2] .skilled/skills/system-spec-kit/ROUTER.md:16 | 3 | The intro points to `SKILL.md` and explains what this file contains, rather than giving the reader a hook. | Replace lines 16–17 with: `Open this router when a request needs system-spec-kit resources selected by intent.`
- [P2] .skilled/skills/system-spec-kit/ROUTER.md:23 | 4 | The Overview presents request triggers before explaining the router’s purpose. | Move lines 27–29 to immediately after line 21, before the trigger description at lines 23–25.

### .skilled/skills/system-spec-kit/SKILL.md

- [P2] .skilled/skills/system-spec-kit/SKILL.md:135 | 7 | The recovery ladder’s four ordered sources are packed into one sentence. | Reformat lines 135–136 as a numbered list of the four rungs, followed by the existing sentence that `/speckit:resume` owns the ladder.
- [P2] .skilled/skills/system-spec-kit/SKILL.md:137 | 7 | The save paragraph combines the writer’s updates, full-auto side effects and no-indexing behavior. | Keep the save-path sentence, then list the full-auto decision-record write or creation, level stamping and lack of indexing hand-off as separate bullets.
- [P2] .skilled/skills/system-spec-kit/SKILL.md:150 | 9 | Lines 150–151 expose phase-numbered deprecation history in the body. | Replace lines 150–151 with: `Model-based cross-encoder/local-GGUF reranking, the local model path, the local rerank sidecar skill and cloud rerankers are retired.`
- [P2] .skilled/skills/system-spec-kit/SKILL.md:169 | 7 | Lines 169–173 pack repair eligibility, revalidation, disable conditions and warning behavior into one paragraph. | Reformat them as ordered bullets for eligibility, repair and revalidation, disable conditions, child-validator behavior and the measured-behavior warning.
- [P2] .skilled/skills/system-spec-kit/SKILL.md:177 | 7 | The Goal Plugin paragraph combines the source of truth, runtime binding, injection, session state, authoring and plugin behavior. | Reformat lines 177–188 as labeled bullets for goal state, runtime binding and injection, authoring, and the OpenCode plugin contract; preserve the existing sentences and paths.

### .skilled/skills/system-spec-kit/assets/complexity-decision-matrix.md

- [P2] .skilled/skills/system-spec-kit/assets/complexity-decision-matrix.md:16 | 3 | The intro repeats the matrix’s Purpose instead of giving a distinct hook. | Replace line 16 with: `Open this matrix when task signals need to be scored before choosing a documentation level and its features.`
- [P2] .skilled/skills/system-spec-kit/assets/complexity-decision-matrix.md:30 | 6 | Usage sends the reader to §3 to score, then §2 to select a level, while the document presents §2 before §3. | Move the complete Dimension Scoring Signals section before Level Selection by Score; keep them numbered 2 and 3 respectively and update the Usage references at lines 30–31 to match.
- [P2] .skilled/skills/system-spec-kit/assets/complexity-decision-matrix.md:217 | 9 | The Spec Traceability section contains requirement IDs and a spec path in the body. | Delete lines 217–229 and renumber Related Resources from `## 10.` to `## 9.`.

### .skilled/skills/system-spec-kit/assets/level-decision-matrix.md

- [P2] .skilled/skills/system-spec-kit/assets/level-decision-matrix.md:16 | 3 | The intro repeats the Purpose’s level-selection summary instead of giving a distinct hook. | Replace line 16 with: `Open this matrix when LOC gives only an initial estimate and risk, scope or testing may change the documentation level.`
- [P1] .skilled/skills/system-spec-kit/assets/level-decision-matrix.md:260 | 7 | The migration rows place actions under “To Level” and file additions under “Action,” leaving “Files to Add” empty. | Keep it as a table; replace the headers and rows with three columns, `Transition`, `Change` and `Additions`, and put each row’s existing transition, action and artifact text under the matching column.
- [P2] .skilled/skills/system-spec-kit/assets/level-decision-matrix.md:317 | 9 | The Spec Traceability section contains requirement IDs and a spec path in the body. | Delete lines 317–329 and renumber Related Resources from `## 12.` to `## 11.`.

### .skilled/skills/system-spec-kit/assets/parallel-dispatch-config.md

- [P2] .skilled/skills/system-spec-kit/assets/parallel-dispatch-config.md:16 | 3 | The intro restates the Purpose’s description of dispatch based on complexity. | Replace line 16 with: `Open this configuration when deciding whether to dispatch agents in parallel or proceed directly.`

### .skilled/skills/system-spec-kit/assets/template-mapping.md

- [P2] .skilled/skills/system-spec-kit/assets/template-mapping.md:16 | 3 | The intro repeats the Purpose’s mapping of levels to templates and commands. | Replace line 16 with: `Open this mapping while scaffolding a spec folder to find the files and render commands for its level.`
- [P1] .skilled/skills/system-spec-kit/assets/template-mapping.md:351 | 5 | The approval gate appears after folder creation, template rendering and filling, despite requiring approval before any file changes. | Move Steps 7 and 8 (lines 345–354) immediately after Step 2 and before Step 3, then renumber the steps to keep the workflow sequential.

### .skilled/skills/system-spec-kit/references/cli/daemon-cli-reference.md

- [P2] .skilled/skills/system-spec-kit/references/cli/daemon-cli-reference.md:17 | 1 | The reference intro has three statements, while the template calls for a short hook followed by Purpose and When to Use in the Overview. | Keep line 17 as the hook, add `---` before §1, add `### Purpose` before line 25, move line 19 under a new `### When to Use` after the Purpose, and move line 21 to §3 before `Common form`.