# Iteration 016 — sk-code-ci registration contract

## Focus

What a new `sk-code` mode must land on, and what an `sk-code-ci` mode would have to be: a workflow mode
or a read-only surface. Read-only research; no hub file was touched.

## Actions Taken

1. Read the three hub registries (mode-registry.json, hub-router.json, leaf-manifest.json) and the hub
   identity files (description.json, feature-catalog/, benchmark/).
2. Inventoried the three existing surface packets on disk (sk-code-webflow, sk-code-skilled,
   sk-code-obsidian) to derive the per-mode folder shape.
3. Read the executable contract rather than the prose: parent-skill-check.cjs checks 3a-3k, 5e, 5i, 5l,
   10a; the sk-code registry-compiler; the verify-router-sync drift guard.
4. Read the doctrine: the repo rule skill-hub-routing.md and parent-skills-nested-packets.md §2, §3, §7.

## Findings

**F16-1 (confirmed) — the three registries are hard-coupled, and the coupling fails loudly.**
The compiler reads `hubRouter.routerSignals[workflowMode]` and then dereferences `.classes` with no guard
[SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:213],
and again for `.weight` in the routing model
[SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:250].
A mode added to mode-registry.json alone throws a TypeError at compile time; it does not degrade to a
zero-signal mode. This is the good failure mode — unlike the silent ones below.

**F16-2 (confirmed) — tieBreak placement is checked three ways, not advisory.**
`5e` requires routerPolicy.tieBreak to be an exact permutation of the registry modes
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1140]; `5i` requires workflow modes to
sort before non-workflow modes [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1209];
`5l` forbids placing an added surface after the native surface, because it would lose every keyword tie to
it [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1230]. A new mode is therefore
inserted at a constrained index, and the index depends on which packetKind it declares.

**F16-3 (confirmed) — leaf-manifest.json is generated, not authored.**
parent-skill-check holds the generator path [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:150],
reads and shape-checks the manifest [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1572],
and reports `10a-manifest-source` only when the declared resourceContractVersion and the manifest agree
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1651]. Hand-editing the manifest is the one
act here that can produce a green registry with a stale inventory.

**F16-4 (confirmed) — the executable definition of a mode is 3a-3k, and it is mostly softFail.**
3c: packet must be a direct child directory that exists
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:525]. 3d: workflowMode and backendKind are
the only hard (FAIL) fields; packetKind in {workflow, surface, transport}, packetSkillName, the
grandfatheredFolderMismatch boolean, aliases and toolSurface are softFail
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:549]. 3d-name: folder, packetSkillName and
the packet SKILL.md frontmatter name must agree
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:581]. 3d-files: SKILL.md, README.md and a
changelog/ directory per packet [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:611].
3d-alias: aliases unique across modes, lowercase is only a WARN
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:628]. 3e: advisorRouting with a valid
routingClass [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:670]. 3i: a mode granting
Write must declare mutatesWorkspace:true or a writeScopeNote
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:743]. 3k: a bound command may not grant
tools beyond the mode toolSurface.allowed [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:756].

**F16-5 (confirmed) — a surface packet is read-only and advisor-invisible by contract, not by habit.**
3g forces backendKind evidence-base, routingClass metadata, mutatesWorkspace:false, allowed subset of
{Read, Bash, Grep, Glob} and a forbidden list covering the mutating tools
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:682]. So a surface gets no advisor entry of
its own and cannot be the thing that edits a workflow file.

**F16-6 (documented) — 11 integration surfaces, 5 ungated.**
§7 lists packet registration, routerSignals, tieBreak, ROUTER.md INTENT_SIGNALS + RESOURCE_MAP,
FULL_INVENTORY where the hub defines one, graph-metadata.json vocabulary, the hub SKILL.md mode table,
description.json, leaf-manifest.json, projection maps for a non-metadata mode, and the four command mirrors
[SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:211].
Its own text states parent-skill-check covers rows 1-3 and 9, check 6b names the mode in the table and
nothing more, and rows 4, 5, 6, 8 and 10 have no gate
[SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:236].
A green per-hub gate is therefore not evidence of reachability; the repo rule states the same discipline for
the two routing stages [SOURCE: .skilled/repo-rules/skill-hub-routing.md:1].

**F16-7 (confirmed) — the ROUTER.md machine projection is drift-guarded against the manifest.**
verify-router-sync leg 3 asserts that compiled destinations, leaf-manifest.json and the code-skilled
RESOURCE_MAP agree through qualifiedIdToLeaf
[SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:232], and fails when
leaf-manifest.json declares no sk-code-skilled mode
[SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:263]. Leg 2 reads the
ROUTER.md SHARED_CONTROL_RESOURCES and DEFAULT_RESOURCE blocks rather than a copy of the list
[SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:58]. Adding a mode
with leaves therefore also edits the root ROUTER.md, and the guard checks the union, not the prose.

**F16-8 (confirmed) — no runtimeLoopType burden for this hub.**
The registry declares only the surface-axis extension [SOURCE: .skilled/skills/sk-code/mode-registry.json:1],
and the runtimeLoopType requirement is conditional on the runtime-loop extension being declared
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:646]. An sk-code mode skips that field.

**F16-9 (inferred) — sk-code-ci cannot be a surface if it acts.**
A surface is contractually read-only (F16-5), and the intended job of sk-code-ci — holding the standards for
writing and reviewing workflow YAML, with sk-code-review applying them and /doctor:ci scaffolding from its
templates — splits into two halves: the standards can be a surface (read-only evidence bundled alongside a
workflow mode), while scaffolding must be a command or a workflow mode with mutatesWorkspace:true.
Registering it as a surface costs one mode entry, one routerSignals entry, one tieBreak slot ahead of the
native surface, one leaf-manifest regeneration and no advisor work; registering it as a workflow mode adds
the workflow-first tieBreak constraint, a hub SKILL.md table row and a command grant comparison. What would
settle it: whether /doctor:ci owns the scaffolding or merely invokes a workflow mode that does. UNKNOWN —
carried into the /doctor:ci iteration.

**F16-10 (inferred) — registration is a roughly 9-file act with one command, and the command is surface-only.**
The 5l remediation text names `/create:skill-parent update --surfaces` as the repair for surface placement
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1238]; no equivalent command is named
anywhere in the checker for a workflow-mode addition. Counted from §7 for a surface packet:
mode-registry.json, hub-router.json (routerSignals + tieBreak), leaf-manifest.json (regenerated), ROUTER.md
(INTENT_SIGNALS, RESOURCE_MAP, possibly SHARED_CONTROL_RESOURCES), graph-metadata.json, description.json,
hub SKILL.md, plus the packet folder itself (SKILL.md, README.md, changelog/, references/, assets/, playbook,
benchmark).

## Questions Answered

- What should an sk-code-ci mode contain, and what does registering a new sk-code mode require?
  The registration half is answered and cited above (F16-1 to F16-8, F16-10). The containment half is
  bounded: the mode is either a read-only surface holding the workflow-YAML standards (cheap,
  advisor-invisible, cannot scaffold) or a workflow mode that also acts (one more gate, one more table row).
  The content list itself is the next iteration of work.

## Questions Remaining

- What should a `/doctor:ci` command do, how is it made safe, and who owns it? Now constrained by F16-9: a
  surface packet cannot perform the scaffolding, so ownership is a command, a workflow mode, or a split
  between them.
- **Blocking phase 002, unchanged:** does a job skipped by `if:` satisfy a required status check?
- Carried forward: which jobs duplicate pre-commit hooks?
- Carried forward: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and what are the
  include globs of `.skilled/hooks/vitest.config.ts`?
- How do the ranked recommendations group into ordered implementation phases 002 and later?

## Next Focus

The `/doctor:ci` command: its mode surface, its safety rules (dry-run default, no edit of a protected
workflow without confirmation), its advisor routing, and its ownership split against sk-git — now read
through F16-9, which rules out the surface-only home.
