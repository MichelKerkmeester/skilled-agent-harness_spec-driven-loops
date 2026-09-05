# Iteration 3: zvec, system-plugins and runtime MCP identity

## Focus
Angle 1b. Confirm whether the zvec lane, the `system-plugins` home or an mcp-server identity for `@spec-kit/runtime` still exist on live surfaces.

## Findings

### F-I3-001 — zvec lane and system-plugins home are gone on the live surfaces checked. CONFIRMED. P2 (negative)
Read of `.opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs` and `.opencode/skills/system-plugins/README.md` returned not found.
Content search of `scripts/` (mjs/cjs/js/md/json/sh), `retrieval-conventions.md`, `README.md`, `AGENTS.md`, `doctor.sh`, `.github` and `.gitignore` returned no `zvec` or `system-plugins` hits.
D11 and the 052 LOG said those surfaces were deleted. The live tree matches that claim on these paths. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:64]
The 052 pass-1 review still cites `zvec-lane.mjs:528-579` as if live. That is a historical review artifact, not a live lane. [SOURCE: .opencode/specs/system-speckit/052-memory-decommission-landing/review/lineages/luna-max/iterations/iteration-009.md:33-40]
Smallest fix: none on the live lane. Stamp the 052 review citations as pre-retirement.

### F-I3-002 — Runtime package identity is a library, not an MCP server. CONFIRMED. P2 (negative)
`runtime/package.json` name is `@spec-kit/runtime` with three dependencies and no MCP SDK. [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:2,41-44]
`runtime/README.md` says it is consumed as a library, not run as a service, and has no server process or transport. [SOURCE: .opencode/skills/system-spec-kit/runtime/README.md:12-14,28]
Remaining `mcp-server` strings under `runtime/hooks/claude/` point at `system-skill-advisor/mcp-server/dist/hooks/...`, which is the preserved advisor. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19]
Smallest fix: none. Do not reclassify advisor shims as rename residue.

### F-I3-003 — sk-doc still inventories a path that has never existed. CONFIRMED. P1
`.opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` still lists `.opencode/skills/system-spec-kit/shared/mcp-server/database`. [SOURCE: .opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:862]
`baseline-readme-verdicts.json` still names `.opencode/skills/system-spec-kit/shared/mcp-server/database/README.md`. [SOURCE: .opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json:5628]
053 limitation 7 recorded exactly this and left it. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:222-226]
054 did not take it. A code-folder validator that treats a never-existed `mcp-server` path as durable inventory will keep teaching the old identity.
Smallest fix: drop those two fixture rows, or point them at a path that exists (`shared/` has embeddings, ipc, ranking, not `mcp-server/database`).

### F-I3-004 — Continuity writer still lives under scripts/memory and still calls itself a memory workflow. CONFIRMED. P2
The runtime README lists `../scripts/memory/generate-context.ts` as a live caller. [SOURCE: .opencode/skills/system-spec-kit/runtime/README.md:34]
That file exists and its header says it "runs the memory workflow". [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:8]
D7 said command names and paths stay literal, so `/memory:save` can remain. A folder named `memory/` plus "memory workflow" in the successor writer is still retired-surface framing on the replacement.
Smallest fix: rename the comment to continuity workflow. A folder rename is a later packet (054 already deferred nesting `scripts/` under `runtime/`).

### F-I3-005 — Runtime README contradicts itself on consumer count. CONFIRMED. P2
"Two consumers, and no third." then the next paragraph calls `validate.sh` "a third consumer in practice". [SOURCE: .opencode/skills/system-spec-kit/runtime/README.md:32-37]
Not decommission residue. It is a live contract doc that cannot be used as a consumer inventory.
Smallest fix: say three consumers, two import and one process, or drop the "no third" clause.

## Sources Consulted
- .opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs (absent)
- .opencode/skills/system-plugins/README.md (absent)
- .opencode/skills/system-spec-kit/runtime/package.json
- .opencode/skills/system-spec-kit/runtime/README.md:12-37
- .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19
- .opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:862
- .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:8
- README.md, AGENTS.md, doctor.sh, .github, .gitignore (negative zvec greps)

## Assessment
- newInfoRatio: 0.55
- Novelty justification: zvec/plugins absence is expected. The new items are the sk-doc never-existed path still live, and the scripts/memory framing on the successor writer.
- Confidence: high on the fixture path and the generate-context header.

## Reflection
- Worked: targeted Read of the two retired paths, then fixture grep outside system-spec-kit.
- Failed: grepping `.pi` for mcp-server. Mirror fixtures drowned the signal the same way phrase-variants did.
- Ruled out: treating advisor hook TARGET_REL paths as runtime MCP identity.

## Dead Ends
- Live zvec/system-plugins search on README, AGENTS, doctor, CI, gitignore (clean).

## Recommended Next Focus
Angle 2. Registrations, symlinks, hook configs, CI workflows and doctor assets, starting with the eleven session-lifecycle registrations restored at commit 273767431d.
