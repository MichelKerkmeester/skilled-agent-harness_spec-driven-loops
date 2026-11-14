VERDICT: PARTLY ALIGNED. All four hops now carry a purpose line and every touched test passes, but the line is the first sentence of `### Purpose` only, about 12% of live packets do not get their own purpose, and three of the four hops have never been seen in a real run.

Rule sources: all eight code files resolve to the SKILLED surface; one override applies (`review.todo-tracking` replace, from the SKILLED universal checklist) and it touched no finding. No quality gate verdict was handed to me.

## FINDINGS

**P0:** none.

**P1**

1. `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:54`. The helper reads a purpose only under an exact `### Purpose` heading. OBSERVED.
   - **What is wrong:** 274 live packets hold their purpose prose another way (241 under a heading such as `## 2. PROBLEM & PURPOSE` with no subheading, 33 as an inline `Purpose:` label). The helper treats them as having none.
   - **Failure scenario:** a session in `.../002-mode-and-lane-migrations/001-deep-research` compacts or saves. Its spec states its purpose in three paragraphs, yet the line shown is `Parent purpose (specs/system-deep-loop/loop-architecture/001-deep-loop-innovation): Land the one-architecture spine...`, taken from three levels up. `001-goal-hooks-cross-runtime`, which writes `Purpose: one packet delivering...` inline, gets `null`.
   - **Evidence:** I ran the built helper over every live spec folder: `{"total":3000,"nul":26,"packet":2643,"ancestor":331,...}`. A second pass classified the packets with no readable purpose: `"other heading that names purpose": 241, "bracket placeholder": 56, "inline Purpose: label, no ### heading": 33, "no purpose text at all": 18, "scaffold sentence": 5`.
   - **Reach:** this is inside the helper's documented contract, so it is a coverage gap against the need, not a crash. The resume rule in both YAML assets names the same heading.

2. `006-purpose-carry-follow-ups/spec.md` (Purpose and REQ-001) and `plan.md` E1 to E10. The plan fixes 5 parents but claims "every live phase parent states its own reason". OBSERVED.
   - **What is wrong:** 83 of 304 live phase parents have no purpose the helper can read. After E1 to E10, 78 remain: 9 hold a bracket placeholder, 11 hold no purpose text, 57 use another heading and 1 uses an inline label. REQ-001 measures only the scaffold sentence, so it will pass while the claim is false.
   - **Failure scenario:** `specs/sk-design/020-chart-and-diagram-review` resolves to `null` and both of its children have no purpose either, so resume and compaction show nothing for that whole tree. Child 001's gate covers only new parents, and nothing flags existing ones.
   - **Evidence:** `{"phaseParents":304,"withoutOwnPurpose":83,"ofWhichScaffoldSentence":5,"childrenWithNoOwnPurposeUnderThem":229}`.

**P2**

3. `packet-purpose.ts:82` and `:36`. The first-sentence rule often yields a "what", a fragment or a cut line. OBSERVED.
   - 12 packets produce a line under 25 characters: `"1."` (a numbered-list Purpose), `"Measure it."`, `"Investigate."`, `"Reclaim ~463MB."`.
   - 2 are cut at an abbreviation (`...injection-only vs.`, `...concrete work (e.g.`).
   - 347 of 3,000 (11.6%) are cut mid-sentence at the 300-character cap.
   - The Problem Statement, which usually holds the "why" and "for whom", is never carried.

4. `runtime/hooks/claude/session-prime.ts:389`. The compaction line appears only when the Stop hook has pinned exactly one packet. OBSERVED numbers, INFERRED consequence.
   - Of this repository's 31 hook state files, 26 have a null `lastSpecFolder`. Among the 8 with a Stop-hook summary, 3 are null.
   - A session that names two packets in its transcript tail stays null and gets no purpose line.

5. `runtime/lib/continuity/thin-continuity-record.ts:307` and `authored-continuity-snapshot.ts:227`. The stored `packet_purpose` has no default reader. OBSERVED.
   - The Goal facet is rendered only by the authored snapshot, which is opt-in at `compact-inject.ts:348-352`. A grep of `.claude`, `.codex` and the hook folders finds nothing that turns it on.
   - The snapshot carries the stored copy and does not re-resolve it, so a stale line can persist.
   - The write itself works: two real records under this packet (002 and 006) hold a correct line.
   - Child 005's summary and decision Q006 already state this.

6. `.skilled/commands/speckit/handoff.md:135` and `.skilled/hooks/session-relaunch/lib/nudge.cjs:27`. The relaunch rule differs from the other hops. OBSERVED.
   - It does not skip the scaffold sentence "Keep parent documentation lean", so until E1 to E10 land a note under those five parents can copy it word for word.
   - It copies the whole Purpose, while resume quotes one sentence and compaction caps at 300 characters.
   - The three hops use three label shapes: `Purpose (parent <name>)`, `Purpose (from parent <file>)` and `Parent purpose (<path>)`.

7. `runtime/hooks/pi/session-compact-context.ts:74`, `.claude/settings.json:181` and `.skilled/commands/speckit/save.md:19`. Three hops run only from gitignored build output. OBSERVED wiring, INFERRED failure.
   - On this machine the build is current: all dist files share the sources' 05:56 timestamp and contain the new symbols.
   - On a checkout with no build, Claude, Codex and Cursor print a drift message, and Pi returns null silently.
   - The Pi purpose test passes only when dist exists.

8. `006-purpose-retention-across-handovers/spec.md:47-48`, `:78`, `:89`. The parent packet's own doc is stale. OBSERVED.
   - Its Purpose still reads "Find where ... are dropped on each hop, and name the smallest change", and its scope says "Any implementation" is out and "No file outside this packet changes", while six build children sit under it.
   - A child with a placeholder Purpose would inherit a research purpose.
   - All five child summaries (001 to 005) still say "Nothing is committed", though the five commits are on main.

9. `session-prime.ts:232`. The spec folder path is not contained to the project root. OBSERVED code, INFERRED risk.
   - An absolute or `..` value in the temp state file makes the hook read a `spec.md` elsewhere and place its first sentence, unsanitized, at the top of the recovered context.
   - The cached brief beside it goes through `sanitizeRecoveredPayload`.
   - The Stop hook only writes normalized `specs/...` values, so this is hardening. The single-line collapse and the 300-character cap limit what can be injected.

10. Test gaps. OBSERVED.
    - No new test asserts nothing; every added assertion can fail.
    - `scaffold-passes-its-own-gate.vitest.ts` checks that the token is present, but not that a non-Draft parent fails on it.
    - The resume hop has no test.
    - `nudge.test.cjs` checks four substrings.
    - The compaction tests pass an absolute folder, never the repo-relative value real state holds.

**Checked and ruled out**
- Adding the line never pushes a real record over the 2,048-byte budget: `"purposeDroppedByBudget":0` across 1,142 records, with the largest base at 1,456 bytes.
- Quotes, backslashes, colons, hashes and Unicode round-trip through the writer; a 513-character value is dropped as designed.
- Tests: 88 passed in the five runtime files, 89 passed in `nudge.test.cjs`, and the three cli files passed.

## ALIGNMENT

- **Resume:** the YAML tells the model to read `spec.md` and quote the Purpose. It is model-followed with no code behind it, and no operator has run it on this packet.
- **Relaunch:** guidance text only, in the command and the nudge. Nothing checks the note, and no real relaunch has been run.
- **Compaction:** real code that leads the recovered context, for Claude, Codex, Cursor, DSH and Pi. Devin and OpenCode get nothing. No real compaction has been run.
- **Continuity save:** real code, and it is the only hop with live evidence.

The work has not drifted to a different goal, but it is narrower than the need:
- It carries one Purpose sentence, not the problem or the user need.
- It cannot help when the purpose lives only in the operator's prompt or spans several packets.
- The Goal facet change was not required by the need, since no default path renders it. E11 to E14 are adjacent clean-ups. The operator approved both.

## CHILD 006

- **E1 to E14 mechanics:** correct. Each search text matches exactly once at HEAD, E1/E3/E5/E7/E9 land under Problem Statement and E2/E4/E6/E8/E10 under Purpose. Every new Purpose is one sentence under 300 characters, so the helper returns it whole.
- **E11:** sound. On a real transcript tail the widened regex ranked this packet first (22 hits). 7 of 22 candidates carried a file name or backslash, and the function can name a bare track folder. E12 feeds a clean text line, not a transcript line, so it does not cover that.
- **E13 and E14:** fine.
- **The five Purposes against their children:**
  - E10 matches the parent's `goal.md` Objective and its children.
  - E6 matches children 002, 004, 006 and 010.
  - E4 is supported by the child research summary ("resolved DB-path logic-sync"). It matters most, because all four children there have no purpose of their own.
  - E8 drops the "build a decisions and notes system" half of the title. The plan explains why (children 002 and 006 disagree), and I think that is the honest choice.
  - E2 fits children 001 to 029. Roughly fifteen later children are not about embeddings (a server rename, a skills alignment sweep, a README research pass), so the parent has become a catch-all that the sentence does not cover.
- **Sufficiency:** not sufficient for its own claim, per finding 2. Either reword the Purpose and REQ-001 to "no live parent carries the scaffold sentence", or widen the scope to the 20 parents with a placeholder or no purpose text.

## WHAT I DID NOT CHECK

- No real compaction, relaunch or operator `/speckit:resume` was run.
- I ran no build, so I did not prove dist equals source beyond timestamps and symbol greps.
- I did not run `validate.sh` on any packet, or scaffold a parent to see the non-Draft failure.
- I did not run the proposed E12 test or the full `hook-precompact` suite with E11 applied.
- I did not read the children's `plan.md` and `tasks.md` for 001 to 005 line by line, the lineage folders under `research/`, or the E1/E5/E7/E9 problem statements against every cited child.
- I skimmed the SKILLED TypeScript checklist's blocking items against the new helper and found no violation; I did not work the other checklists item by item.
- Codex, Cursor and DSH state handling was read at the adapter level only.

Review status: REQUESTED_CHANGES
EXIT=0
