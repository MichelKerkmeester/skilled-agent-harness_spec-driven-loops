# Fleet Cleanup Contract

The terminal cleanup is a gated teardown, not a new routing plane. It removes
legacy resolver entries and registry adapters one skill at a time, then leaves
the compiled `EffectivePolicy` as the only resolver. The ordering is
`mcp-code-mode → sk-code → system-deep-loop → mcp-tooling`, matching the
increasing semantic blast radius in the synthesis migration table (§9).

## External readiness

Deletion cannot create its own readiness fact. The validator executes the
committed singleton compiler/rollback harness, the committed execution-plane
harness, and each committed parent-hub canary harness. It also reads the
committed acceptance records and activation manifests. Every candidate tuple,
real route-gold result, rollback receipt, and destination lifecycle receipt must
agree before `assertFleetReady()` issues an in-process capability token. The
checked-in manifests must still be legacy-authoritative before this modeled
cleanup begins, preserving the Stage-0-through-6 authority rule (§9).

## Per-skill deletion

`deleteLegacySkill()` accepts `skillId` as data. It has no singleton or hub-name
control-flow branch. The driver compares the complete current manifest against
the frozen canonical preimage, retains those exact bytes, performs a token- and
epoch-fenced temp/fsync/rename swap, and then calls the real route-gold gate
through the committed compatibility projector. A red verdict performs a second
fenced swap to the retained bytes before returning the failure. This follows
the byte-exact rollback and preimage-drift discipline in synthesis §9.

The N=1 policy is produced by the committed compiler. Its empty composition,
ranking, and handoff collections are walked through the same driver; zero signal
still returns `defer(no-match)`, as required by synthesis §5.2 and §5.3.

## Hot card and final state

The final `PolicyCardV1.md` is generated from the four compiled snapshot
identities and the terminal manifest. The compatibility vocabulary array is
structurally omitted once the last legacy input is deleted. The generated card
states and encodes an empty zero-signal union; replay reaches the compiled
policy and returns typed `defer(no-match)` rather than a default fleet union.
That preserves the document-only limits in synthesis §8.3 and the no
over-emission constraint in §10.

The frozen final manifest is compared byte-for-byte using the canonical
serializer. Any manifest preimage mismatch, route-gold mismatch, final-state
drift, retained compatibility vocabulary, or zero-signal union aborts. Routing
rollback restores bytes only; it cannot undo an external effect already
committed by a destination (§9).
