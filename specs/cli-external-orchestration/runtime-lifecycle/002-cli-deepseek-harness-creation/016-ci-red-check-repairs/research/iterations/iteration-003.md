# Iteration 3: Q1 and Q3 Re-verification — Track-Root Docs, Doctor Battery, mcp-tooling Routing

## Focus

Close Q1 and Q3 in the strategy ledger. Iteration 1 answered both in prose, but its record did not carry the strategy's exact question text, so the reducer left both boxes unchecked. This iteration re-verifies the live-doc surfaces for the system-spec-kit track-root change (a65d573299) and the test-only history-locator change (190b103dd8), then sweeps the system-skilled-doctor and mcp-tooling surfaces behind 8da131af09, cdd3c27db4 and 9932b52352, looking for anything beyond the surfaces iteration 1 recorded.

## Actions Taken

- Read the agent definition, `deep-research-config.json`, `deep-research-strategy.md`, and iteration 1's narrative (state-first; no reducer-owned file touched).
- Ran four scoped grep sweeps: `children_ids`/`numbered child` vocabulary over the `.skilled/skills/system-spec-kit` Markdown tree; `isolated`/`chrome` over the `.skilled/skills/mcp-tooling` tree; `battery`/`leaf-alias` over `.skilled/commands`; `leaf-alias` over all `.skilled` Markdown.
- Classified every hit as aligned, stale, or out of scope (flag documentation versus routing prose), and did not retry any exhausted direction.

## Findings

1. **Q1 — the stale track-root set is exactly the three directory-worded surfaces plus one borderline line; no fifth doc states the counting rule.** `track-root-children-lists.md:32` still says `refresh-track-roots.mjs` sets `children_ids` to the numbered packet folders with no `spec.md` condition; `runtime/cli/spec/README.md:115` describes the sweep as comparing against "the numbered child directories" and line 116 the refresh as the same; `runtime/cli/lib/README.md:121` says `compareTrackChildren()` compares against "its numbered child directories as sets". `references/structure/folder-structure.md:121` says "direct numbered packets", which is defensible under the new packet definition but never states the gate. [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md:32] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:115] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/README.md:121] [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:121]

2. **Q1 — the two highest-level docs use packet wording and are aligned, though neither states the `spec.md` gate explicitly.** The skill README says `refresh-track-roots.mjs --apply` rewrites the list "from the packet folders on disk" and defines a sub-track as a non-numbered child with no `spec.md`, which matches a65d573299's definition; the feature catalog's own row says the lists track "the packets the track holds". These are completeness notes, not contradictions. [SOURCE: .skilled/skills/system-spec-kit/README.md:241] [SOURCE: .skilled/skills/system-spec-kit/README.md:243] [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:782]

3. **Q1 — the history-locator commit remains documentation-neutral.** 190b103dd8 is test-only; the feature catalog already records the runtime dependence on a writable state directory and the playbook still invokes the same six Vitest files, so no doc describing the lookup behavior is stale. No new surface exists beyond what iteration 1 cited. [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:53] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:58]

4. **Q3 — mcp-tooling retains no "isolated chrome" routing phrase on any live surface.** The hub keyword list, the `chrome-devtools-aliases` block in `hub-router.json`, the hub README, `description.json`, and the hub playbook all name the mode without that phrase. The remaining "isolated" prose in the tree documents the `--isolated=true` manual flag and Aside's documented lack of isolation; none of it is an alias, so a cleanup must leave it untouched. [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:94] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:136] [SOURCE: .skilled/skills/mcp-tooling/README.md:28] [SOURCE: .skilled/skills/mcp-tooling/description.json:3] [SOURCE: .skilled/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:57] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md:45] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:120]

5. **Q3 — the battery and leaf-aliases prose are aligned; one count claim stays unverified.** The OpenCode version battery is documented only in the doctor scripts README, which 8da131af09 updated in-commit (description at line 109, invocation rows at 188-193); no other command doc describes the v1 command-naming leg, so nothing is stale. The leaf-aliases docs describe a generated projection and remain accurate after cdd3c27db4. The one open thread: `sk-doc/shared/README.md:50` claims "the five alias entries ... four of them `shared/` paths"; that count was not checked against the regenerated `leaf-aliases.json` this iteration and is carried to Next Focus. [SOURCE: .skilled/commands/doctor/scripts/README.markdown:109] [SOURCE: .skilled/commands/doctor/scripts/README.markdown:188] [SOURCE: .skilled/skills/sk-doc/shared/README.md:50] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:108] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:73]

## Questions Answered

- `Q1: Are the system-spec-kit changes (a65d573299 track roots count a numbered folder as a packet only with spec.md; 190b103dd8 history-locator test state dir) reflected in every doc that describes the touched behavior, beyond track-root-children-lists.md section 2 and runtime/cli/spec/README.md?` — No beyond the recorded set except detail: the stale directory-worded surfaces are `track-root-children-lists.md:32`, `runtime/cli/spec/README.md:115-116` and `runtime/cli/lib/README.md:121`; `folder-structure.md:121` is borderline. The top-level README and feature catalog use "packet(s)" wording and are aligned. 190b103dd8 is test-only and needs no doc change.
- `Q3: Are the system-skilled-doctor and mcp-tooling changes (8da131af09 OpenCode version battery names a v1 command by its frontmatter name; cdd3c27db4 leaf-aliases regen; 9932b52352 mcp-tooling drops the isolated chrome routing phrase) reflected in SKILL.md, references, routing docs, feature catalogs and playbooks?` — Yes, all live surfaces are aligned: the battery README was updated in-commit and no other doc describes the v1 command-naming leg; the leaf-aliases docs correctly describe a generated projection; no routing doc or playbook retains the dropped phrase. The only gaps are the known missing changelog entries and the unverified `sk-doc/shared/README.md:50` count.

## Questions Remaining

- Q4's final branch: the ten-commit ancestry check against tag v4.0.2.0 (carried from iteration 2).
- Verify `sk-doc/shared/README.md:50`'s "five alias entries / four shared paths" against `.skilled/skills/sk-doc/leaf-aliases.json` after cdd3c27db4.
- Policy edge: decide whether the two packet-worded track-root docs (`README.md:241-243`, `folder-structure.md:121`) should state the `spec.md` gate explicitly or are correct as written.

## Next Focus

Q4's ancestry check against tag v4.0.2.0, plus the `sk-doc` alias-count verification and the packet-wording policy call.

## Ruled Out

- Re-reporting the five Known Context items without new line detail (exhausted, iteration 1).
- Re-sweeping `system-skilled-doctor` for battery or leaf-alias prose (exhausted, iterations 1-2; the skill never describes either).
- Treating every `specs/` or changelog hit as a repoint target (frozen history, iteration 2).
- Reading every "isolated" hit in mcp-tooling as stale routing prose: the remaining hits are the `--isolated=true` flag and Aside's isolation-gap documentation, not aliases.

## Dead Ends

- None new. The full mcp-tooling sweep found no surviving routing phrase to remove.

## Edge Cases

- Ambiguous input: "reflected in every doc" was read as live docs only; changelogs and archived history stay frozen per `filesystem-naming-convention.md` §5.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the `sk-doc/shared/README.md:50` count claim was left unverified at the tool-call budget; recorded above as a next-focus item rather than claimed clean.

## Sources Consulted

- `.skilled/skills/system-spec-kit/README.md:241-243`
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:782`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md:32-51`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:115-116`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/README.md:121`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:121`
- `.skilled/skills/mcp-tooling/ROUTER.md:94`
- `.skilled/skills/mcp-tooling/hub-router.json:136-152`
- `.skilled/skills/mcp-tooling/README.md:28,44,135`
- `.skilled/skills/mcp-tooling/description.json:3`
- `.skilled/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:33,47,57`
- `.skilled/skills/mcp-tooling/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md:45,54,70,116`
- `.skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:120,145,209`
- `.skilled/commands/doctor/scripts/README.markdown:109,188-193`
- `.skilled/skills/sk-doc/shared/README.md:50`
- `.skilled/skills/sk-doc/sk-create-skill/SKILL.md:108`
- `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:73,105,202`

## Assessment

- New information ratio: 0.40
- Questions addressed: Q1, Q3
- Questions answered: Q1, Q3

## Reflection

- What worked: one scoped grep per skill tree, reusing iteration 1's established anchors instead of broad rereads, separated aligned surfaces from stale ones at line level and closed both ledger questions with exact text.
- What did not work: the budget left no call to count `sk-doc`'s regenerated alias entries, so that claim stays explicitly unverified rather than assumed.
- What I would do differently: read the generated `leaf-aliases.json` counts first when auditing a regeneration commit, before the prose sweep.

## SCOPE VIOLATIONS

None. No file outside the iteration narrative and delta was written; all researched paths were read-only.
