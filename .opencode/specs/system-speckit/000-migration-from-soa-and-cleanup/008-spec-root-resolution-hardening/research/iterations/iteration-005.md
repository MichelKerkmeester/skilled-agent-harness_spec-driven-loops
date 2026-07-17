# Iteration 5: Claude Stop Source/Dist Parity and Symlink-Absent Autosave Chain

## Focus

This iteration closed only iteration 4's evidence gap: the configured Claude `Stop` route was traced through `session-stop` into `generate-context`, folder detection, workflow writes, and post-save pointer refresh, with source and compiled-dist branches checked side by side. Remediation ranking was deliberately deferred.

## Route Proof

- Exact dispatch: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-5.md:1-14]
- Canonical route fields: `iteration=5`, `run=5`, `mode="research"`, `target_agent="deep-research"`, `agent_definition_loaded=true`, and `resolved_route="Resolved route: mode=research target_agent=deep-research"`. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-5.md:2-14]
- Runtime entrypoint: Claude invokes `mcp_server/dist/hooks/claude/session-stop.js`, not the TypeScript source. [SOURCE: .claude/settings.json:123-137]

## Findings

1. **The configured autosave chain is exact and contains two compiled-runtime boundaries.** Claude runs compiled `session-stop.js`; both hook source and dist locate and spawn compiled `scripts/dist/memory/generate-context.js`; the hook passes the persisted `lastSpecFolder` as structured `specFolder`; and the hook always exits `0`, turning a failed generator into a logged autosave failure rather than a failed Claude Stop. [SOURCE: .claude/settings.json:123-137] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:31-55,104-152,745-749] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:22-44,67-101,567-570]

2. **No source/dist semantic drift was found at any load-bearing root-selection step.** The compared pairs agree on transcript target selection, `lastSpecFolder` autosave input, generator discovery/spawn, explicit `specs/` preservation, absolute-path existence checks, basename child fallback, workflow use of the detected absolute packet, and post-save re-resolution. The checked source maps cannot provide byte-level freshness proof because all six inspected maps omit `sourcesContent`; therefore this is a targeted branch-parity conclusion, not a claim that all dist outputs are fresh. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:104-152,516-547,641-688] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:67-101,372-402,483-522] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:269-352,755-809,876-900] [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:214-279,620-662,734-759] [SOURCE: command `node` source-map/parity scan of the six named source/map pairs reported `embedded=false` for every map]

3. **With the root alias absent, the Stop route does not create a replacement root; selection happens only after the explicit legacy-qualified target fails.** The hook's detected/persisted target reaches the generator as `specs/<packet-id>`; the generator preserves that explicit project-scoped spelling; folder detection first tests `/repo/specs/<packet-id>`, then falls back to child/basename search. A unique canonical match returns the existing `.opencode/specs/...` packet, while ambiguity or no match fails; no root-level `mkdir` occurs in this route. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:641-688,705-740] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:483-522,534-563] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:269-352] [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:214-307] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:1130-1220] [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/spec-folder/folder-detector.js:863-944] [INFERENCE: the cited route contains access checks and existing-child returns but no root creation operation]

4. **After fallback, all main save writes stay on the resolved absolute packet.** Source and dist both pass `detectSpecFolder(...)` into `ensureSpecFolderExists(...)`; description and metadata follow-ups retain that `specFolder`/validated absolute target. Thus the symlink-absent route either writes the recovered canonical packet or fails before the workflow writer; it does not silently create a distinct legacy root. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058,1646-1802] [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/core/workflow.js:730-767,1290-1408] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/directory-setup.ts:22-85] [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/spec-folder/directory-setup.js:17-77]

5. **The remaining autosave-chain gap is narrower than the main save: post-save phase-pointer refresh re-resolves `CONFIG.SPEC_FOLDER_ARG` instead of consuming the workflow's returned absolute packet.** Source and dist agree that `resolveExistingSpecFolderPath(CONFIG.SPEC_FOLDER_ARG)` gates `updatePhaseParentPointersAfterSave(...)`. If earlier validation rewrites the config argument to the canonical child, the pointer updates; if only the deeper async detector recovers the packet while the original legacy argument remains unresolved, the child save can succeed and pointer refresh is skipped. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:755-809,876-900] [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:620-662,734-759] [INFERENCE: the pointer outcome depends on whether the pre-workflow validation stage updates `CONFIG.SPEC_FOLDER_ARG`, whereas the main workflow consumes its independently detected absolute result]

## Ruled Out

- Using source maps as byte-equivalent build provenance was ruled out because the inspected maps name the TypeScript inputs but contain no `sourcesContent`. [SOURCE: command `node` source-map/parity scan of session-stop, generate-context, folder-detector, config, subfolder-utils, and workflow maps]
- Treating targeted parity as proof that the entire stale dist tree is current was ruled out; only the chain's load-bearing branches were compared. [INFERENCE: based on the bounded source/dist pairs listed in Finding 2]
- Remediation ranking was not investigated because iteration 5 explicitly forbids broadening into remediation. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-5.md:8-12]

## Dead Ends

- Repeating the iteration-4 writer matrix would not close the freshness question; direct source/dist pairing and the configured runtime entrypoint were the narrower evidence path. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:13-35,85-93]

## Edge Cases

- Ambiguous input: none; the dispatch narrowed the work to source/dist parity and the Claude Stop autosave chain.
- Contradictory evidence: none in the compared branches. The global stale-dist warning and targeted semantic parity are compatible because the latter does not attest unrelated outputs.
- Missing dependencies: source maps omit embedded source text, so byte-level source/map equality was unavailable; side-by-side source/dist control-flow anchors were used instead.
- Partial success: none; the bounded chain and parity gap were closed without claiming global dist freshness.

## Sources Consulted

- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-5.md:1-14`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:1-93`
- `.claude/settings.json:123-137`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:31-55,104-152,516-547,641-749`
- `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:22-44,67-101,372-402,483-570`
- `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:269-352,755-809,876-900`
- `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:214-307,620-662,734-759`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:1112-1220`
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/folder-detector.js:851-944`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058,1646-1802`
- `.opencode/skills/system-spec-kit/scripts/dist/core/workflow.js:730-767,1290-1408`
- Mechanical `node` scan of output boundaries, exact source/dist anchors, and six checked-in source maps.

## Assessment

- New information ratio: 0.70 (1 fully new finding + 4 partially new findings = 0.60, plus a 0.10 simplicity bonus for replacing the broad stale-dist uncertainty with a bounded parity result)
- Questions addressed: Does the configured Claude Stop autosave chain have source/dist drift at any root-selection step, and where does a symlink-absent run select or create a root?
- Questions answered: The configured chain has no targeted source/dist semantic drift; it selects an existing canonical packet only through fallback and never creates a replacement root; byte-level map provenance remains unavailable.

## Reflection

- What worked and why: Starting at `.claude/settings.json`, pairing each source branch with the exact compiled artifact, and checking map metadata closed the runtime-evidence gap without re-running the broad writer inventory.
- What did not work and why: Two initial bounded `node -e` scans failed on shell quoting before the corrected read-only scan ran; the source maps then proved unsuitable for byte-level provenance because they omit embedded sources.
- What I would do differently: Use a checked-in parity/build manifest or a purpose-built script rather than inline shell quoting, and reserve source maps only for line mapping unless `sourcesContent` is enabled.

## Recommended Next Focus

Proceed to the remaining key question: rank remediation, migration, rollback, and dual-environment validation, using the now-closed facts that the Stop chain has targeted source/dist parity, does not create a root when the alias is absent, and can diverge only at its post-save pointer re-resolution stage.
