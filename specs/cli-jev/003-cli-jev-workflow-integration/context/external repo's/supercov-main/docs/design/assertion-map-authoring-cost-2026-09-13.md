# Authoring cost of assertion maps — two findings

Status: design note, not implemented. Measured against supergateway's real map
(`run_cca3b6ce5e5d08d8`): 452 assertions, 653 flows, 4,837 nodes.

## 1. Draft generation for trivial flows does not pay (negative result)

The idea: for an assertion with no flow, have the engine propose a skeleton —
nodes anchored, prose empty, `countsAsAsserted: false`, no `basis` — and let the
agent fill in meaning. Steps besides the proposal already exist (the `draft`
state and the acknowledgement gate), so only candidate selection is new.

Candidates must come from something the engine can check without understanding
code. Two such signals exist, and both were measured:

| signal | flows it can draft unambiguously |
| --- | --- |
| a string literal shared by the assertion text and the statement text | 3.1% |
| a statement that executed only in this assertion's tests | 3% |

The literal rule *fires* on 18% of flows, but when it fires there are usually
several candidates (median 6, max 21): one assertion on `'Stdio server
listening'` matches `sseToStdio.ts:194` and `streamableHttpToStdio.ts:195`
equally well. Exclusivity is no better — 61% of product statements are claimed
by more than one assertion, one by 51.

Two independent signals landing on ~3% is a ceiling, not an artifact. Linking is
not the bottleneck; disambiguating is, and disambiguating is the semantic
judgment the engine exists not to make. Do not rebuild this.

## 2. The repeated prose is stored at the wrong level

84% of node meanings and 55% of flow explanations are textual reuse. The obvious
reading — "add variables" — is wrong twice over: it burdens the author with
naming and lookup, and its failure mode is a dangling reference, i.e. a broken
map rather than a verbose one.

The measurements say something different. The most-reused explanation covers
**67 structurally distinct flows**:

> The real gateway runs against controlled HTTP, SDK and process boundaries.
> This compares boundary calls or effects, not actual network/process completion.

That is not a description of a flow. It is a caveat about how the *test* is
written, copied into every flow beneath it. Across all repeated explanations,
**79% are scoped to a single test file**. Likewise, 4,837 node entries describe
only 872 distinct statements.

So the prose is not redundant, it is misplaced — and both of the things it is
actually about are anchors the schema already carries.

### Resolution

Two optional tables on `AssertionMap`, keyed by existing anchors:

- `testNotes`, keyed by `assertion.at.file`
- `statementMeanings`, keyed by `node.at.file + ":" + node.at.line`

```
flow.explanation := flow.explanation if non-empty, else testNotes[assertion.at.file]   else ""
node.meaning     := node.meaning     if non-empty, else statementMeanings["file:line"] else ""
```

Inline always wins; the table is only a fallback. No names, no recursion, no
scoping, nothing to search.

### Engine change

`expected_basis` (`assertion_map.rs:603`) hashes the flow struct:

```rust
let mut claim = f.clone();
claim.basis = None;
```

becomes

```rust
let mut claim = resolve(a, f, map);
claim.basis = None;
```

Hashing the **resolved** flow preserves the token's meaning exactly: it covers
the prose that applies to the flow, inline or inherited. Hashing the stored flow
would be a hole — a shared caveat could be edited while 284 acknowledgements
survived untouched.

It adds no inputs to the hash. `dependencies()` already collects `a.at.file`,
every `applies_to` file and every `node.at.file`, so both table keys point at
files already fingerprinted.

### Compatibility

With the tables absent, resolution is the identity function. Every existing
`schemaVersion: 2` map resolves to exactly what it stores, so tokens are
byte-identical: no migration, no staleness, no version bump.

### Effect

| | today | after | |
| --- | ---: | ---: | ---: |
| flow explanations | 653 | 420 | −36% |
| node meanings | 4,837 | 1,798 | −63% |
| **prose judgments** | **5,490** | **2,218** | **−60%** |

Character saving is ~93k of 903k (~10%); the judgment count is the point, not
the bytes. An earlier estimate of −59.7% was an upper bound on blind string
deduplication and is not what this achieves.

Editing shared prose invalidates its dependents — correct, since those flows
were acknowledged under the old text — and is strictly cheaper than today: one
edit instead of 284, with the same number of re-acknowledgements.

### Why it is safe for a weak author

- **Writing** is unchanged. Prose goes inline, as now. A map authored in total
  ignorance of the tables is valid and complete.
- **Hoisting** is the engine's job, and is verifiable rather than judged:
  factor out repeats, re-resolve, assert the resolved flows are unchanged. If
  they are, no token moved.
- **Reading** gets a 60% smaller file, with a resolved view available on demand.

No agent can produce a dangling reference, because there are no references.

## Open question this does not answer

48% of statements carry different meanings in different flows. Those keep
writing their own `meaning`, exactly as today.
