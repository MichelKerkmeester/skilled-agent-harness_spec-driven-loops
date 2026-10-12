# Iteration 8: Doctor and external surface onboarding

## Focus

Q5: Which doctor and documentation changes tell external users the two surfaces are examples, and how do they scaffold their own surface? The dispatch explicitly selects Q5 even though the reducer's current Next Focus names Q6. Q5 is still open in the registry.

## Actions Taken

- Read the lineage config, state, strategy, registry, dashboard, and prior iteration evidence. Iterations 1 and 3 already record that the sk-code hub presents the current three-surface set without labeling Webflow or Obsidian as examples, and that replacement must update packet registration and routing data. I did not restate those as new findings.
- Searched the doctor directory for `sk-code-obsidian`, `sk-code-webflow`, Obsidian, and Webflow. The only hit was the separate MCP Obsidian manifest; no sk-code example-specific doctor check or advice appeared.
- Read the parent-skill doctor route, contract, and checker; the sk-code hub README/SKILL.md and v4.0.0.4 note; and the sk-doc parent-skill guide and `/create:skill-parent` assets.
- Checked onboarding paths: `.skilled/README.md` is absent. The only install-named sk-code path found is the Webflow animation `install-card.md`, not a sk-code setup guide.
- Did not repeat the Q2 deletion probe; iterations 3–4 already recorded its observed behavior.

## Findings

| class | claim | evidence | priority |
|---|---|---|---|
| DOC | The existing `/doctor:parent-skill` route runs the fleet metadata gate and the generic parent checker. The checker rejects a registered packet whose directory is missing (3c), and an on-disk child directory that is no longer registered (6a); its messages stop at the structural mismatch and provide no intentional-replacement steps. Keep these checks fail-closed, but add a concise remediation hint that points to reconciling the registry/router entries and refreshing generated routing artifacts. | [SOURCE: .skilled/commands/doctor/_routes.yaml:152-160]; [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:23-34,78-85]; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:490-497,1335-1342] | P2 |
| DOC | A surface scaffold already exists: sk-doc's parent workflow is `/create:skill-parent`, and its command assets accept `--surfaces <names>` to generate read-only evidence-base packets and update the parent registry/router contract. The smallest onboarding change is to link to this workflow from the canonical sk-code surface section; a new surface wizard is not needed. | [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:20-28,57-80]; [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,461-467]; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:17,56-68,85-87] | P2 |

## Options and Recommendation

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| Recommended: clarify the existing docs and improve the existing missing-packet diagnostic. Label Webflow and Obsidian as optional operator examples beside the canonical list; direct users to `/create:skill-parent update --surfaces <name>`; explain that replacement must reconcile mode registration, router resources/signals and tieBreak, then refresh the leaf/compiled routing artifacts. Add the same short guidance to the existing 3c doctor error. Qualify the v4.0.0.4 “One Surface Order Everywhere” statement in a subsequent release note as the operator repository's current order, not a portable external default. | Canonical surface list and packet layout: [SOURCE: .skilled/skills/sk-code/SKILL.md:32-40,147-170]. Human-facing packet table: [SOURCE: .skilled/skills/sk-code/README.md:51-57]. Existing diagnostic: [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:490-497]. Release wording: [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:295-297]. Scaffold command: [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,467]. | Low: edits to existing prose and one existing diagnostic string; no new command, guide, or metadata field. | The docs could drift from routing data. The existing doctor checks still catch structural drift, but do not prove the semantic priority order is right. | Cheaper: edit only the README. It fails because the hub SKILL.md names the canonical surface list at lines 40 and 170, while the generic doctor error still leaves a user with no repair path. “Build nothing” also fails: the current hub inventory has no example qualifier, and the release note says the order applies everywhere. |

## Questions Answered

- Q5: Current sk-code onboarding does not tell external users that Webflow and Obsidian are replaceable examples, and the doctor does not explain how to repair the structural failures caused by intentional removal. The supported scaffold route is already `/create:skill-parent` with `--surfaces`; documentation should link to it and explain the existing registration/router refresh steps.

## Questions Remaining

- Q1: complete the order and installed-presence inventory across advisor, doctor, install guides, canaries, runtime, and release notes.
- Q6: complete the rejected-ideas pass across the whole research topic.
- Follow-up: the repository evidence does not establish whether a separate publisher ships a different example-free starter; iteration 7 left that boundary open.

## Ruled Out

- A new surface-scaffolding command or separate installer guide: the existing parent-skill workflow already creates surface packets. A new entry point would duplicate its contract.
- A README-only clarification: the hub SKILL.md is the canonical surface inventory and the doctor still needs actionable repair text.

## Edge Cases

- Ambiguous input: none; the dispatch selects Q5 over the generated Q6 next-focus text.
- Contradictory evidence: none.
- Missing dependencies: none for this documentation and doctor-contract pass.
- Partial success: Q5 is answered; Q1 and Q6 remain open.

## Sources Consulted

- [SOURCE: .skilled/commands/doctor/_routes.yaml:152-160]
- [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:23-34,78-85]
- [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:490-497,1335-1342]
- [SOURCE: .skilled/skills/sk-code/SKILL.md:32-40,147-170]
- [SOURCE: .skilled/skills/sk-code/README.md:51-57]
- [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:295-297]
- [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:20-28,57-80]
- [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,461-467]
- [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:17,56-68,85-87]
- Command evidence: `rg -n -i 'sk-code-(obsidian|webflow)|obsidian|webflow' .skilled/commands/doctor` exited 0 and returned only the MCP Obsidian manifest.
- Command evidence: `.skilled/README.md` existence check returned false; the sk-code install-name search returned only `.skilled/skills/sk-code/sk-code-webflow/assets/animation/install-card.md`.

## Assessment

- New information ratio: 0.85 (one newly verified command-level scaffold route and one partially new doctor-remediation gap; +0.10 simplicity bonus because the existing parent workflow makes a new scaffold mechanism unnecessary).
- Questions addressed: Q5.
- Questions answered: Q5.
- Questions remaining: Q1 and Q6, plus the publisher boundary noted above.

## Reflection

- What worked and why: reading the command asset beside the parent-skill contract exposed a usable scaffold path that can be linked directly, without inventing a new workflow.
- What did not work and why: the doctor checks identify stale structure but do not provide the user-facing replacement steps; this pass did not test code changes.
- What I would do differently: next, finish Q1's cross-surface inventory and then use Q6 to reject costly alternatives against the now-confirmed existing scaffold and checks.

## Recommended Next Focus

Q6: complete the rejected-ideas pass, while carrying the unresolved Q1 inventory and publisher boundary forward.

