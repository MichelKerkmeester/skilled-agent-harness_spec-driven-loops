# Iteration 7: Narrative Claims, Cited Versions and the Component List

## Focus

Audit the parts of the notes that the earlier passes only touched in passing: the "Why This Release" bullets, the twenty-item breaking-change list, the cited component versions, and the closing component list. Selected interpretation: a component "has its own entry for this release" when its changelog gained an entry in the window; a component that gained one and is not listed is an omission. Deferred: final consolidation.

## Actions Taken

1. Checked all twenty numbered breaking-change items against HEAD code.
2. Checked the two cited component versions (`sk-git v1.11.13.0`, `mcp-tooling v1.10.1.0`) against their changelogs.
3. Checked each of the seventeen "Why This Release" bullets against the section that claims to fix it.
4. Compared the closing component list against the components whose changelogs gained entries in the window.
5. Verified four "Smaller fixes" claims that had no earlier check: `confidenceFloored`, `untrustedLineages`/`_untrusted`, the uuid/request-id masking, and the live stdout cap.

## Findings

1. **DRIFT (P2) — the closing component list omits `sk-code` and `sk-doc`.** The notes say "These components have their own entries for this release" and name fourteen components (line 823). `sk-code` added three changelog entries in the window (`6dc1960f945`, `a5f104ca9ae`, `76f5e2dd36a`, shipping 3.12.2.0 through 3.12.5.0) and `sk-doc` added one (`ab45d376ce1`) while its `SKILL.md` also changed under `991fe6d127a`; neither is named. A reader checking the list for which component changelogs to read misses the two that carry the browser-evidence and stdin-front-door changes. [SOURCE: .skilled/skills/sk-code/changelog/v3.12.5.0.md] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:823]

## Verified Claims (not findings)

- **All twenty breaking-change items hold.** In particular: codex with no model resolves to `CODEX_DEFAULT_MODEL = 'gpt-6-luna'` (`fanout-run.cjs:3652,3883`); dispatch setup errors return 64 (`dispatch-iteration.cjs:970`); `record-base --pin` refuses a commit with no top-level `.skilled` (`release-update.cjs:2508`); the `/doctor:skill-advisor` embedding route is gone (`skill-advisor.md` has no embedding text); a lane weights setting naming the removed lane is filtered by `isLiveScorerLane` (`weights-config.ts:51`); depth wording such as "thorough" opens no loop (`explicit.ts:475`, `command-attach.ts:338`); and the DeepSeek Harness `finished_lineage_mismatch` refusal exists (`fanout-run.cjs:2194`).
- **The cited versions exist.** `sk-git` has `v1.11.13.0` and `mcp-tooling` has `v1.10.1.0` with the Orca boundary removal; both current versions are later, which is consistent with later entries.
- **The "Why This Release" bullets are backed.** Each claimed defect maps to a section that ships its fix, from `--preview` and `provider_cost_usd` to the survivor record and the one-build-path dispatch.
- **Four smaller fixes hold.** `confidenceFloored` is set in `fusion.ts:1338-1356` and forwarded through `subprocess.ts` and the Python fallback; `untrustedLineages` and `_untrusted` exist in `fanout-merge.cjs:856,937,1149`; `uuid` and `request_?id` are in the provider-id masking pattern (`fanout-run.cjs:1603`); and the 20 MB `maxBuffer` is set at `fanout-run.cjs:5688`.

## Ruled Out

- **A missing entry for a listed component.** Every one of the fourteen named components has changelog commits in the window.
- **A wrong cited version.** Both cited versions exist exactly as named.
- **A breaking-change item that no longer holds.** All twenty were checked and hold at HEAD.

## Dead Ends

- **Reproducing the "2 of 26 plain loop asks" routing-analysis figure.** No committed corpus carries that slice, so the number stays UNKNOWN rather than contradicted.

## Edge Cases

- Ambiguous input: "has its own entry" was read as a changelog entry in the window. A stricter reading that requires a top-level skill version bump would also include sk-code and sk-doc, so the finding holds either way.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/changelog/skilled/v4.2.0.0.md:59-104,823,829-917`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2194,3652,3883,5688,1603`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:970`
- `.skilled/commands/doctor/scripts/release-update.cjs:2508`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts:51`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:475`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:338`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1338-1356`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:856,937,1149`
- `.skilled/skills/sk-code/changelog/`, `.skilled/skills/sk-doc/changelog/`, `.skilled/skills/sk-git/changelog/v1.11.13.0.md`, `.skilled/skills/mcp-tooling/changelog/v1.10.1.0.md`

## Assessment

- New information ratio: 1.00
- Questions addressed: Q1 (the breaking-change and narrative claims), Q3 (the component list and cited versions)
- Questions answered: none in full

## Reflection

- What worked and why: comparing the closing component list against the set of changelogs that gained entries in the window turned a prose claim into a set difference, which found two omissions that the packet and section passes had no reason to look for.
- What did not work and why: the routing-analysis figure has no committed corpus, so it cannot be checked from files; recording it as UNKNOWN was the only honest outcome.
- What I would do differently: run the set-difference check against every list the notes present (components, spec folders, breaking changes) rather than only the packet list, because each list is a different claim about the release's shape.

## Recommended Next Focus

Take one more defect pass on a surface not yet read closely — the overlay adopt and re-pin path, and the doctor update apply path — then consolidate the audit into the final tables for synthesis.
