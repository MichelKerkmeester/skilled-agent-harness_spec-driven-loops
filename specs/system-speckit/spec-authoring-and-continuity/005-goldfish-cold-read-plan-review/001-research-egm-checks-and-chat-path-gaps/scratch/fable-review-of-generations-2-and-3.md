# Review under review: fresh Fable 5.2 (high) on syntheses A and B

Verbatim output of a read-only reviewer. It is one model's opinion until its cited lines are checked.

1. VERIFY

Synthesis A
- **Devin limit: CONFIRMED on paper.** `.devin/README.md:92` states 16,384 bytes. `AGENTS.md` is 27,372 bytes and the cut lands 27 bytes into line 184. Whether Devin really truncates is UNKNOWN: `.devin/SYNC.md:93` describes a whole-file drop, not a cut.
- **Card loads on a chat write: WRONG.** "add a --keep flag" matches no keyword in `ROUTER.md:160-162`, so `ROUTER.md:373` returns the fallback with only `quick-reference.md` (`:307`). The advisor returned sk-code, mcp-tooling and sk-doc for that prompt, not system-spec-kit. `SKILL.md:94` ("a write starts with the card") is prose the router does not implement.
- **Card check tests only a heading: CONFIRMED.** `spec-authoring-card.md:124`; the example at `:120` names no file and no proof.
- **"Missing obligation": OVERSTATED.** `plan.md.tmpl:126` does give the phases to `tasks.md`. But card section 7 (`:130-145`) and `tasks.md.tmpl:53` already require a file and a `Verify:` command on every task line.

Synthesis B
- **Refusal anchor and shape: CONFIRMED.** `fanout-run.cjs:3396` is `expandLineages`, `:3397-3406` is the stop-policy guard throwing `inputError`, and the first ledger append is `:3424`. `FANOUT_FLAGS` is at `:30`.
- **Test cost: WRONG.** In `fanout-run.vitest.ts`, 38 test blocks build a one-entry, count-1 matrix, and 37 spawn the script with research or review (for example `:2019`, `:2315`, `:3292`); B names one. `lineage-timestamp-window.vitest.ts:109` is another. The three stress sites (`fanout.vitest.ts:165, 756, 794`) are confirmed.
- **One process per lineage: CONFIRMED.** `fanout-run.cjs:1585`.
- **"Five edits, four files": OVERSTATED.** `research.md:125-126` reads as quoted. But `deep-research-auto.yaml:208-225` sends any run with a fan-out config to this script. A one-entry `--executors` typed through the proper command would be refused, and B edits no YAML (inferred; I did not read how the flags bind).

Not checked: the 118-of-4,812 figure, the DSH claim, `review.md:98`, the presentation assets. No suite was run.

2. ATTACK

A
- **It only looks checkable.** `Verify: npm test` satisfies the shape. Presence is decidable; whether the command proves the phase is not.
- **The same shape rule already exists on task lines.** Only 557 of 4,906 tracked `tasks.md` files contain `Verify: ` (many may predate the rule).
- **The primary carrier does not arrive.** The card is not loaded on the request A targets.
- **Edit 7 misses Devin.** `AGENTS.md:186` sits past the cut. The file is also a universal template with copies elsewhere, which A does not price.
- **It duplicates `tasks.md`.** Two places then state file and proof, and they will drift.

B
- **The session can still skip.** A count of 2 passes the guard with every incident defect intact: no init, no synthesis, no save, shared context. `deep-research-auto.yaml:1216` already teaches "rerun with --count=2".
- **The predicate is a proxy.** The defect is calling the script outside the workflow, not the lineage count. Hand-written iteration files remain untested, as B admits.
- **Refusing is right, but incomplete.** It sends the session back to a 2,539-line YAML with no runner, which is the friction that caused the incident. Running the proper path means a new runner, and B's "nothing existing to promote" ignores the 17 KB driver in `scratch/`. A runner is still too much now.

3. DECIDE

a. **Build a smaller A:** the template example only. Cost is one line. It is the only A carrier that arrives on every scaffold.
b. **Build a different B:** keep the refusal, but have the workflow YAML pass the escape flag so only direct callers are refused. Cost is two script lines, four YAML call sites, about 40 test call sites and a compiled-contract regeneration. No doc edits are needed.
c. **Devin overrun: separate packet.** Its first step is one Devin dispatch asking it to quote line 186.

4. RECOMMENDATIONS

Ship first
1. **`plan.md.tmpl:124`:** rewrite the GOOD example so each phase names its file and proving command. Prevents phases a cold reader cannot check, on every packet.
2. **`fanout-run.cjs:30` and `:3397`:** register `allowSingleLineage` and refuse a one-lineage research or review run without it. The message names the single-executor workflow and never mentions count. Prevents the incident's route.
3. **`deep-research-auto.yaml:225` and its three siblings:** pass the flag from the workflow step. Prevents the proper command dead-ending on a one-entry `--executors`.

Ship later
4. **`ROUTER.md:162`:** add write verbs to the IMPLEMENT keywords, so the card loads as `SKILL.md:94` claims. The keywords match as substrings, so the over-trigger rate is UNKNOWN.
5. **`spec-authoring-card.md:120`:** align the example with recommendation 1. Prevents card and template disagreeing.
6. **`fanout-run.cjs` summary:** add a line saying packet init, synthesis and save were not run. Prevents a false "succeeded" on the count-2 route. Whether a snapshot test pins the summary shape is UNKNOWN.

Do not build
- The `AGENTS.md:186` extension.
- Card rule edits at `:113` and `:123`, and the ownership qualifier at `plan.md.tmpl:126`.
- B's four doc-clause edits.
- A single-executor runner, hook or validator rule in this packet.
