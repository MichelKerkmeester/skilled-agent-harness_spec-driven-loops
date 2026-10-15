---
title: "Iteration 2: What the 026/028/029 packets decided — command-shape rationale, rejected ideas, phase ordering"
trigger_phrases: []
---
# Iteration 2: What the 026/028/029 packets decided

## Focus

Extract the design rationale behind `/doctor:sk-code setup`: why a doctor command and not a hub mode, which alternatives were rejected and why, what the battery legs were chosen to prove, and how the work was phased (journey fixes first, battery second).

## Actions Taken

- Read `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/spec.md` (phase parent: scope, traceability, phase map).
- Read `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md` (the battery's own packet: problem, scope, requirements).
- Read `specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md` §4-§13 (the research the build implemented: user journey, doctor-vs-hub-mode decision, ranked recommendations, rejected ideas, phases).
- Cross-referenced `026-external-surface-priority-build` phase map and its `005-external-user-guide` spec for the surface-priority decisions already shipped.

## Findings

1. The placement decision is documented explicitly: "a new doctor command, `/doctor:sk-code`, with one read-only target, `setup`" — chosen because the family grammar is `/doctor:<owner> <target>` and the one-per-owner rule wants the sk-code hub as owner. A `sk-code-setup` hub mode was rejected because `packetKind` is only `workflow` or `surface` (setup is neither), no setup prompt would ever route to it, and it would cost 15+ files plus a contract change. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md:97-111,135]

2. The rejection catalogue is a checklist of tempting-but-wrong ideas: X1 hub mode (contract mismatch + cost); X2 target under `/doctor:skill-advisor` (wrong owner, undiscoverable name); X3 extending the `parent-skill` route (its contract is a structural audit — routing/drift failures would corrupt what a pass means); X4 mutating repairs inside the doctor (a read-only route may not write; `route-validate.sh` enforces it); X6 terminal add/remove script (the registry scrub and ROUTER.md edits need judgment; a second mutation path serves one caller class); X7 minting manifests inside `update --surfaces`; X11 advisor surface-awareness (no failure exists). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md:131-145]

3. The battery's leg list is not arbitrary — it is the executable form of the README guide's Verify block: the six documented verify commands, plus a provisioning precheck (the missing step a fresh clone needs) and the derived-metadata freshness gate (CI ran it but the user's battery did not), plus a probe that must parse `action:"route"` because the last README leg exited 0 on the legacy stub. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md:88-93,105,123; specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:35-44]

4. The motivating failures define what a setup check is FOR: the guard printed `Re-mint: sk-code` with no command (F5), the route probe could not fail (F7), a CI gate was missing from the user battery (F16), and a fresh clone could not reach green following the guide (F1-F3). A doctor setup exists to make invisible/unactionable failures visible with named repairs. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md:85-113]

5. Phase ordering was deliberate: P1 (029/001) fixed the hand-followed path first — README before-you-start lines, guard stale-manifest message naming its commands, named failure instead of a stack — and only then P2 (029/002) built the battery that prints those same repair texts. The battery depends on P1 because it prints P1's repair strings. Lesson: the documented journey must be self-sufficient before a battery is worth running. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/spec.md:85-118; specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md:149-174]

6. Naming was weighed: `setup` was chosen over `surfaces` because the battery also covers provisioning — the target name must cover the whole check surface, not just the resource being adapted. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md:111]

7. Route additions have a fixed recipe and a validator: append a row to `_routes.yaml`, list it in the command's router and presentation, run `route-validate.sh`; every script the route runs is enumerated in `script_invocations`. The acceptance gate for the new route was `route-validate.sh` exit 0 plus pristine/stale/unprovisioned copy runs (S-1..S-3 ledger rows). [SOURCE: .skilled/commands/doctor/_routes.yaml:36-38; specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:80-95]

8. The 026 packet already shipped the "external surface" semantics this research builds on: a user-added surface is scaffolded ahead of the native `sk-code-opencode` in `tieBreak` so it wins keyword ties (doctor check 5l fails a surface placed after it), OpenCode is marked native (keep), Webflow/Obsidian are optional examples (removable via the 9-step recipe). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:60-83; README.md:1449,1472]

9. Battery cost and growth were considered acceptable: ~15 s measured (E6), one pass per leg, and the drift-guards leg is the one that grows — a sk-git battery should likewise time-budget its legs. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:118]

## Questions Answered

- What did 026/029 decide about what belongs in a setup check vs out? In: the documented verify steps + the two gaps a fresh clone hits (provisioning, CI-only gate) + an assertion that catches false-pass (probe). Out: any mutation (X4), any second mutation path for the same surface (X6), any placement that is not the owning surface's doctor family (X1-X3).
- Where does the placement rule come from? `/doctor:<owner> <target>` grammar + one-per-owner rule, enforced socially by `_routes.yaml` review and mechanically by `route-validate.sh` + `mutating:` class.

## Questions Remaining

- What are sk-git's customizable parts and where does each live? → Iterations 3-4.
- Does a `setup` target under the existing `/doctor:git` satisfy the same grammar (owner = git family) or does sk-git need `/doctor:sk-git`? The one-per-owner rule suggests the former — /doctor:git already IS the git owner route. Confirm against `/doctor:git`'s router file in iteration 4.

## Ruled Out

- Reading `parent-skill-check.cjs`, the guard, or the sync scripts' internals — their contract surfaces (what they check) are already established via the battery's leg commands; internals matter only if sk-git needs an analogous per-leg script, which iteration 4 will settle.

## Dead Ends

- None.

## Edge Cases

- Ambiguous input: "the packets under 026 and 029" — read the phase parents plus the battery's own child (029/002) and the originating research (028), which is where the placement rationale actually lives.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/spec.md:1-120
- specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:1-125
- specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md:81-208
- specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:60-95

## Assessment

- `newInfoRatio`: `0.88`
- Novelty justification: 8 of 9 findings were fully new (placement rule, rejection catalogue, leg-selection logic, phase ordering, naming, validator, surface-priority semantics); finding 9 partially new.
- Confidence: high — all claims cite packet docs or manifest lines read this iteration.

## Reflection

- Worked: the 028 research doc carried the WHY (decision matrix, rejected ideas) that the built files cannot; reading research + spec together gave both the decision and its enforcement mechanism.
- Did not work: nothing.
- Would do differently: nothing.

## Recommended Next Focus

Iteration 3: sk-git's customization surface part 1 — `.skilled/skills/sk-git/SKILL.md`, `hard-rules.json`, the commit message template and its per-repository rules, the remote branch allowlist.
