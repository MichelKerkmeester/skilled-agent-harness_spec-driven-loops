# Iteration 13: The ranked build order

## Focus

Closing iteration. Twelve iterations have produced three stores, one schema change, a reuse list and a terminal verdict. This iteration turns them into the thing a build packet can start from: **a ranked order**, with the reason each slice sits where it does and the size and risk it carries.

## Actions Taken

1. Read the checker's refusal vocabulary to see how a new frontmatter key joins it.
2. Ranked the slices by coupling first, failure mode second, size third.
3. Cross-checked each rank against the iteration that established it.

## Findings

1. The checker's refusal vocabulary is a **named-reason set** — `id-invalid`, `isolation-invalid`, `sandbox`, `secrets`, `trigger-kind-invalid`, `delivery-invalid` and so on — so a new `apps` key adds `apps-invalid` and `apps-unknown-server` in the same style rather than a new error mechanism. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92]
2. `secrets` is **already a checked key** in that set, so the secret store's frontmatter half is a resolution step rather than a new key. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92]
3. The order follows from **coupling, not size**: the run folder touches nothing (iteration 9), the connector registry needs one schema change, and the secret store needs the same one. [INFERENCE: from iteration 9 findings 9 and 10]
4. The first slice is therefore the **run folder as working directory**, because it is the only one that touches nothing and its failure mode is a bot writing in the wrong place rather than a leak. [INFERENCE: from iteration 8 findings 4 and 11]
5. The second slice is the **connector registry**, because it is a whitelist over an existing config and its failure mode is a refusal rather than a leak. [INFERENCE: from iteration 7 findings 6 and 7]
6. The third slice is the **secret store**, because it is the only one whose failure mode is a leak, so it should land after the two that cannot leak. [INFERENCE: from iteration 6 findings 3 and 4]
7. The fourth slice is the **`grants` field on the needs-you item**, which both stores need and neither can add alone. [INFERENCE: from iteration 9 finding 9]
8. **Memory is last and out of scope for this lineage**, because it couples to nothing and the other three pairs own it. [INFERENCE: from iteration 9 finding 10]

## The ranked build order

| # | Slice | Size | Risk | Why here |
| --- | --- | --- | --- | --- |
| 1 | Run folder as the bot's working directory, named in the prompt preamble | 20–40 lines | low | touches nothing; makes the existing store usable |
| 2 | `apps:` frontmatter key, per-run filtered UTCP config, `HonoredPosture.apps`, `apps-unknown-server` invariant | 150–250 lines | medium | a whitelist over an existing config; fails closed |
| 3 | `bots secret set` with a no-echo prompt, per-identity store under the state root, child-environment injection, `HonoredPosture.secretsUsed` | 200–300 lines | medium | the only slice that can leak, so it lands after the two that cannot |
| 4 | `grants` on the needs-you item, so an approval names what it approves | 20–40 lines | low | both stores need it; neither can add it alone |
| 5 | `bots open <run-id>` | 0 lines | none | a documented command, not code |
| 6 | Memory | out of scope | — | couples to nothing, and another pair owns it |

**The first build packet should take slices 1 and 2 together.** They are independent, they total under 300 lines, and together they prove the two claims the design rests on: that a bot can be given a place to work without a container, and that a bot can be given an app without an OAuth server.

**What to defer past the first packet.** Slice 3 needs the encryption-key decision from iteration 6 finding 9, and slice 4 needs the needs-you schema change from iteration 9 finding 9. Both are small, and both are easier once slices 1 and 2 have shown the shape of a run record that carries grants.

## Ruled Out

- Starting with the secret store: it is the largest slice and the only one that can leak, so starting there puts the risk first and the proof last.
- Building all four slices as one packet: the first two prove the design, and the last two depend on what the first two learn about the run record.
- Building memory in this packet: it is another pair's share and it couples to nothing here.

## Dead Ends

- Looking for a dependency that forces the secret store before the connector registry: there is none. The two share only the `grants` field, which is slice 4 and can land after both.

## Edge Cases

- Ambiguous input: "build order" could mean dependency order or value order. Selected interpretation: dependency order with value as the tie-break, because a packet that builds a dependent slice first stalls.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92-107
- iterations/iteration-006.md through iteration-012.md (this lineage's own records)

## Assessment

- New information ratio: 0.6
- Questions addressed: the ranked build order a first build packet can start from
- Questions answered: the ranked build order a first build packet can start from

## Reflection

- What worked and why: ranking by coupling rather than by size. The smallest slice is also the least coupled, and the largest slice is the only one that can leak, so coupling and failure mode agree on the order and no tie-break is needed.
- What did not work and why: trying to rank by user value. Every slice is invisible to the operator until it is done, so value does not discriminate between them.
- What I would do differently: write the order at iteration 6 and refine it. The shape was visible once the three stores were named, and the last seven iterations mostly confirmed it.

## Recommended Next Focus

The lineage's frontier is drained and its thirteen iterations are complete. The next work is the synthesis: compile `research.md` into the eight-part answer with the terminal verdict, the small-team section and the skip list, and record the terminal synthesis event.
