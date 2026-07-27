# Iteration 1: Root-Level Metadata Presence and Producers

## Focus
Build the exact 12-skill by eight-file root-level presence census, counting only direct children of the 12 `.opencode/skills/` roots, and identify whether each file type is scaffolded, generated, or authored input.

## Actions Taken
1. Enumerated the 12 direct skill roots and all direct-child JSON files.
2. Checked the detached-lineage narrative and delta targets were absent before writing.
3. Inspected the parent-skill scaffold, leaf-manifest generator, root-name contract test, and the sole `command-metadata.json` instance.
4. Searched the create-command and command trees for a `command-metadata.json` producer.

## Findings
1. The exact root-level census is below. `Y` means the direct-child file exists; `—` means the exact direct-child glob returned no such file. Nested packet/mode metadata was excluded. [INFERENCE: exact direct-child inventory from `Glob .opencode/skills/*/*.json`, cross-checked against the 12 entries returned by reading `.opencode/skills/`]

   | Skill root | description | graph-metadata | leaf-manifest | leaf-manifest.config | leaf-aliases | mode-registry | hub-router | command-metadata |
   |---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
   | `cli-external-orchestration` | Y | Y | Y | — | — | Y | Y | — |
   | `mcp-code-mode` | — | Y | Y | Y | Y | — | — | — |
   | `mcp-tooling` | Y | Y | Y | — | — | Y | Y | — |
   | `sk-code` | Y | Y | Y | — | — | Y | Y | — |
   | `sk-design` | Y | Y | Y | — | — | Y | Y | Y |
   | `sk-doc` | Y | Y | Y | — | Y | Y | Y | — |
   | `sk-git` | — | Y | — | — | — | — | — | — |
   | `sk-prompt` | Y | Y | Y | — | — | Y | Y | — |
   | `system-code-graph` | — | Y | Y | Y | Y | — | — | — |
   | `system-deep-loop` | Y | Y | Y | — | — | Y | Y | — |
   | `system-skill-advisor` | — | Y | Y | Y | Y | — | — | — |
   | `system-spec-kit` | — | Y | Y | Y | Y | — | — | — |

2. Fleet totals are: `description.json` 7/12, `graph-metadata.json` 12/12, `leaf-manifest.json` 11/12, `leaf-manifest.config.json` 4/12, `leaf-aliases.json` 5/12, `mode-registry.json` 7/12, `hub-router.json` 7/12, and `command-metadata.json` 1/12. Thus `graph-metadata.json` is the only universally present type; `sk-git` is the sole graph-only root. [INFERENCE: arithmetic over the exact matrix in Finding 1; the `sk-git` graph node is present at `.opencode/skills/sk-git/graph-metadata.json:1`]

3. Four file types have explicit parent-hub scaffold producer evidence: `init_skill.py --kind parent` writes `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, and `description.json` at the new hub root. These are scaffold outputs, though their checked-in values remain author-maintained after creation. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:528-553]

4. `leaf-manifest.json` is the one clearly derived artifact: `generate-leaf-manifest.cjs --write` builds it from `mode-registry.json` for hubs or from `leaf-manifest.config.json` for registry-less standalone skills, optionally incorporating authored `leaf-aliases.json` for hubs, and writes canonical bytes. The script explicitly calls aliases “authored,” while standalone config is an input declaration rather than generated output. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:7-19] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:173-218]

5. `command-metadata.json` is a singleton confined to `sk-design`; its two entries describe `/interface:design` and `/interface:design-reference`. No producer reference was found in `sk-doc/create-command` or `.opencode/commands`, so current evidence classifies it as hand-authored, not generated; this classification should remain provisional until consumer/schema research traces its ownership history. [SOURCE: .opencode/skills/sk-design/command-metadata.json:1-16] [SOURCE: .opencode/skills/sk-design/command-metadata.json:374-386] [INFERENCE: exact searches for `command-metadata` under `.opencode/skills/sk-doc/create-command` and `.opencode/commands` returned no matches]

## Ruled Out
- Counting `package.json`, `package-lock.json`, or `tsconfig.json`: they are root JSON files but not among the eight named metadata types.
- Counting nested mode/packet JSON: excluded by the focus contract and direct-child glob.
- Treating `leaf-manifest.config.json` or `leaf-aliases.json` as generated because the manifest generator reads them: the implementation identifies them as authored inputs and only writes `leaf-manifest.json`. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:215-218]

## Dead Ends
- A broad `command-metadata.json` search produced oversized output; narrowing to the create-command and command trees found no producer. Future work should search its consumers and Git history rather than repeat the broad search.
- The similarly named root-name consumer-matrix test concerns catalog/playbook directory names, not this eight-file metadata census. [SOURCE: .opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs:80-138]

## Edge Cases
- Ambiguous input: the prompt did not enumerate the eight names inline; they were resolved from the complete direct-child inventory and the topic's named special cases.
- Contradictory evidence: none.
- Missing dependencies: the code graph was empty, so exact Glob/Grep/Read evidence was used as required by strategy.
- Partial success: producer ownership for `command-metadata.json` is evidence-backed only as a negative search plus inference, not a located producer.

## Sources Consulted
- `.opencode/skills/` direct directory inventory
- `Glob .opencode/skills/*/*.json`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py:490-553`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:7-218`
- `.opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs:1-180`
- `.opencode/skills/sk-design/command-metadata.json:1-574`
- Exact `command-metadata` searches under `.opencode/skills/sk-doc/create-command` and `.opencode/commands`

## Assessment
- New information ratio: 1.00
- Novelty calculation: 5 of 5 findings are fully new in this first lineage iteration; `(5 + 0.5 × 0) / 5 = 1.00`.
- Questions addressed: complete 12-skill by eight-file root census and producer evidence.
- Questions answered: complete root-level presence census; producer classification for all eight types, with `command-metadata.json` explicitly provisional.

## Reflection
- What worked and why: exact direct-child globbing produced a scope-safe census without admitting nested packet metadata; focused source reads then separated scaffold outputs, generated artifacts, and authored inputs.
- What did not work and why: broad `command-metadata.json` search output was too large because repository-wide references include large records; narrowed producer searches were clean but yielded only negative evidence.
- What I would do differently: begin the next pass with consumer call sites for each filename and use Git history only for the unresolved singleton rather than another broad textual search.

## Questions Answered
- What is the complete 12-skill by eight-file root-level census? Answered by the matrix and totals above.
- Who produces each file type? Parent scaffold: four hub identity/router files; leaf generator: `leaf-manifest.json`; authored inputs: config and aliases; provisional hand-authored singleton: command metadata.

## Questions Remaining
1. What complete consumer and schema set governs each type?
2. What class taxonomy explains every presence difference?
3. What behavior impact determines whether graph-only, alias, command, and sparse cases are required, optional, or defective?
4. Where should the canonical contract and fleet enforcement live?
5. Which consumer or history evidence conclusively owns `command-metadata.json`?

## Recommended Next Focus
Trace the complete consumer and schema call-site set for `description.json`, `graph-metadata.json`, `mode-registry.json`, and `hub-router.json`, then use that evidence to distinguish mandatory hub identity files from class-conditional files.
