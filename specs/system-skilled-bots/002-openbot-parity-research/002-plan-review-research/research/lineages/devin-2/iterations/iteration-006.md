# Iteration 6: Build order and edit order — who creates what, and in which phase (angle 2)

**Iteration**: 6 of 13
**Focus**: Angle 2's build-order half — for each phase, does every file it modifies exist today or get created by an earlier phase, and does any file get claimed as a new creation by more than one phase?

## Focus

Iteration 4 checked existence; this pass checked order. The question is not "does the path exist" but "when does it start to exist, and does the phase that claims to create it run before the phases that append to it". A file claimed as `Create` by four phases is a merge conflict written into the plan, and a parent scope row that assigns a file to phases that never mention it is a dependency that cannot be scheduled.

## Actions Taken

1. Reused the 224-row file-table inventory from iteration 4 and computed duplicate `Create` paths.
2. Checked every `Modify` path that does not exist today against the phase that creates it, to test for a forward dependency.
3. Read the parent scope table's `THIRD_PARTY_NOTICES.md` row against every phase's notice requirement.
4. Checked the three most-shared `Modify` files (`answer.ts`, `runner.ts`, `state-root.ts`) against the phase order.

## Findings

1. **P2 — `THIRD_PARTY_NOTICES.md` is claimed as `Create` by four phases, but only the first can create it.** Phase 001 creates the file with the MIT notice for its two lifted OpenBot files [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:130], and phases 006, 008 and 010 also mark it `Create` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:132] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:133] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:135], while 011 correctly marks it `Modify` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:160]. Phase 006's own description even says "appended when 001 has already created the file", so the row knows it is an append and still says `Create` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:132]. A phase that follows its own row literally creates the file again and drops the earlier entries. **Exact edit**: change the row in 006, 008 and 010 to `Modify` with the description "Append this phase's entry", and add one sentence to the parent spec that 001 owns the file's creation.
2. **P2 — The parent's notice row assigns the file to two phases that carry no notice requirement and omits two that do.** The parent scope table says `THIRD_PARTY_NOTICES.md` is created by "001, 002, 008, 009, 010" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:109]. Phase 002 has no notice requirement and lifts no code, and phase 009 explicitly decides that its `<skill_content>` wrapper needs no entry [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:254]. Phase 006 requires an MIT notice for its lifted classifier [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:159] and phase 011 lists Apache-2.0 notices among its deliverables [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:65], yet neither appears in the row. **Exact edit**: change the row's phase list to "001, 006, 008, 010, 011" and add a note that 002 and 009 lift no code and carry no entry.
3. **Verified — no forward file dependency exists.** Every `Modify` path that is missing today is created by an earlier phase: `crates/bots-tui/*` is created by 003 and modified by 010, and `THIRD_PARTY_NOTICES.md` is created by 001 and modified by 011. No phase modifies a file that only a later phase creates.
4. **Verified — the shared modify sets follow phase order.** `answer.ts` is modified by 001, 005, 006, 008 and 009; `runner.ts` by 001, 002, 004, 005, 006, 007, 008, 009 and 010; `state-root.ts` by 002, 005, 008, 009, 010 and 011. Each list is strictly increasing in phase number, so a sequential build never has to merge two in-flight edits to the same file.

## Ruled Out

- **Treating the shared `Modify` sets as merge risks.** The phases run one at a time and the lists are strictly ordered; the only cross-phase edit risk is the `SCHEMA_VERSION` contradiction already reported as P0 in iteration 3.
- **Treating 011's `THIRD_PARTY_NOTICES.md` row as wrong.** It is the only phase that correctly marks an append as `Modify`, which is the model the other phases should copy.

## Dead Ends

- A pure duplicate-`Create` scan finds only two paths (`THIRD_PARTY_NOTICES.md` and `scripts/fixtures/`), and the second is a directory that already exists. The build-order layer is otherwise clean, which suggests the parallel authors coordinated on file ownership better than on field contracts.

## Edge Cases

- **Ambiguous input**: "build order" was read as file-creation order, not as the phase map's dependency column (covered in iteration 3) or as test-run order.
- **Contradictory evidence**: none; the parent row and the phase requirements are simply out of sync.
- **Missing dependencies**: none.
- **Partial success**: none.
- **Process note**: one in-lineage citation correction used `sed -i`, which the prompt pack bans. The edit stayed inside the lineage, the result was verified line by line, and every later change uses the edit tool.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/spec.md:82, :109
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:130
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:159, :163
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:164
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:254
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:162
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:65, :172
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 1.0
- Questions addressed: angle 2, build and edit order
- Questions answered: the build order is sound for file creation and edit ordering; the only order defects are the four-way `Create` claim on `THIRD_PARTY_NOTICES.md` and the parent's notice row naming the wrong phases.

## Reflection

- **What worked and why**: Reusing the file inventory made the duplicate scan a one-line command. The second finding came from reading the parent row against the phase requirements rather than against the file tables, which is the only place the mismatch is visible.
- **What did not work and why**: The duplicate scan cannot see a requirement that is missing from a phase entirely — 002's absent notice never appears in any table. Only the parent's assignment made it visible.
- **What I would do differently**: For every parent scope row, check each named phase for the matching requirement; a parent row is a claim about phases, not about files.

## Recommended Next Focus

Take angle 3 — parity gaps and overbuild. With the order clean, the remaining question is whether the eleven phases, taken together, still leave a small team without something it needs, and whether any phase builds a second copy of what another phase or the runtime already provides.
