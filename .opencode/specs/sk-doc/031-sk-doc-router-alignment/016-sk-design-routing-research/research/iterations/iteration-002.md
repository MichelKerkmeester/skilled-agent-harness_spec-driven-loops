# Iteration 2: Leaf-Manifest Feasibility and Byte Stability

## Focus
This iteration tested whether the existing sk-doc leaf-manifest generator can represent all six sk-design mode namespaces, including the nested `design-mcp-open-design` transport, and whether it deterministically emits byte-identical output. The probe called the exported read-only builder twice; it did not invoke `--write` or alter sk-design.

## Findings
1. The generator iterates every declared registry mode that has `workflowMode` and `packet`; it does not filter on `packetKind`. A non-mutating build over sk-design therefore produced six manifest mode entries, including `design-mcp-open-design`, with 114 total packet-local leaves (audit 37, transport 9, foundations 12, interface 20, md-generator 26, motion 10). [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:91-108] [SOURCE: .opencode/skills/sk-design/mode-registry.json:38-164] [SOURCE: command output: non-mutating `buildManifestBytes` probe, 2026-07-17T04:49Z]
2. Manifest serialization is byte-stable by construction: leaves are deduplicated and sorted, modes are sorted by `workflowMode`, object keys are recursively sorted, formatting is fixed at two spaces, and exactly one trailing newline is added; no timestamp enters the manifest. Two consecutive non-mutating sk-design builds were byte-identical at 7,098 bytes with SHA-256 `42514c152c74220464729d7de1c07ec1ef5a3bc686595b36cd73266461a817b2`. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:281-305] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:318-338] [SOURCE: command output: non-mutating `buildManifestBytes` probe, 2026-07-17T04:49Z]
3. One root manifest can represent the workflow/transport mix because each generated entry preserves both the registry's `workflowMode` and packet join; the nested transport is a normal independent namespace rather than a seventh hub mode or an alias of `interface`. This confirms iteration 1's structural inference for packet-local leaves. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88-108] [SOURCE: .opencode/skills/sk-design/mode-registry.json:145-162] [INFERENCE: the successful six-entry probe confirms the prior composite-namespace feasibility claim]
4. Shared-resource resolution remains an explicit authoring boundary. The generator walks only each packet's local `references/` and `assets/`; shared resources enter a mode only through `leaf-aliases.json`. sk-design currently has no such file, which is valid and treated as zero aliases, but any `../shared/...` route that must become independently addressable typed gold will require an authored alias rather than automatic discovery. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-67] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:70-105] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:217-236]
5. The official `--check` path cannot prove drift status before a manifest is committed: it returns code 2 when `leaf-manifest.json` is absent. The exported pure builder is sufficient for feasibility and repeatability research, but implementation must first author the manifest and then run `--check` to establish committed-byte parity. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:111-130] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:143-161]

## Ruled Out
- Excluding the transport from generation because its `packetKind` differs: the generator consumes `workflowMode` and `packet`, not `packetKind`, and the read-only probe emitted the transport namespace. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:91-108]
- Treating absent `leaf-aliases.json` as a generation blocker: absence explicitly means zero aliases. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:17-19] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-67]
- Using `--check` against a missing committed manifest as evidence of nondeterminism: that path reports a missing prerequisite before comparing bytes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:143-161]

## Dead Ends
The official `--check` mode is not a valid pre-implementation feasibility probe because it requires an existing committed manifest. Future research should reuse the pure non-mutating builder; implementation should use `--check` only after authoring the manifest. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:143-161]

## Edge Cases
- Ambiguous input: none; the prompt fixed the root-manifest and byte-stability focus.
- Contradictory evidence: none; the generator behavior agrees with the six-mode registry.
- Missing dependencies: no committed sk-design `leaf-manifest.json` exists, so official `--check` drift proof is unavailable; the exported non-mutating builder supplied feasibility and repeatability evidence instead. No `leaf-aliases.json` exists, leaving shared-resource typed identities outside the generated local-leaf inventory.
- Partial success: none for the stated feasibility question; committed-manifest drift validation remains an implementation-stage proof.

## Sources Consulted
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:1-183`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:1-340`
- `.opencode/skills/sk-design/mode-registry.json:1-165`
- `.opencode/skills/sk-doc/leaf-manifest.json:1-120`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/findings-registry.json:1-380`
- Non-mutating `node -e` probe calling `buildManifestBytes` twice against `.opencode/skills/sk-design`

## Assessment
- New information ratio: 1.00 (4 fully new findings, 1 partially new confirmation: raw ratio 0.90, plus 0.10 simplicity bonus for resolving the manifest-feasibility question)
- Questions addressed: Can one byte-stable leaf manifest represent the parent hub and nested design-mcp-open-design transport?
- Questions answered: Yes for all six packet-local mode namespaces, including the transport; shared resources require explicit aliases, and committed-byte drift proof awaits implementation.

## Reflection
- What worked and why: Reading the generator and pure contract before running the exported builder separated deterministic generation from the mutating CLI path and yielded direct six-mode evidence without altering sk-design.
- What did not work and why: The official `--check` mode cannot be used before a manifest exists; this is a prerequisite failure, not a stability result.
- What I would do differently: In a future verification pass, compare a proposed committed manifest through `--check` and audit any authored shared aliases against actual router references.

## Recommended Next Focus
Partition the sk-design benchmark scenarios into genuine routing decisions versus command/precondition/quality behavior, then identify which scenarios can receive independently authored `(workflowMode, leafResourceId)` gold without deriving expected values from router output.
