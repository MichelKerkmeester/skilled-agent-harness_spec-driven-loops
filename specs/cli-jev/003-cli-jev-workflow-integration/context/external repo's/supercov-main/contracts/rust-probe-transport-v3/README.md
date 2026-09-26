# Rust probe transport v3

Status: **candidate wire contract; Rust product frontend private**.

V3 preserves v2's fixed header and descriptor sizes, authentication,
publication and crash semantics, plus v2's record kind `4` (assertion phase)
and the shared atomic phase-invocation sequence at header offset `80`. It
changes the magic/version and adds record kinds `5` (thread phase), `6`
(thread end) and `7` (test boundary) so a runtime can publish exact
join-bounded native-thread identity without guessing thread lifetimes.

A thread-phase record (kind `5`) uses the descriptor context as the derived
child context, an empty ID payload, and exactly sixteen value bytes as the
little-endian parent context followed by the globally allocated invocation
nonce. Outcome and flags are zero. The child is FNV-1a over the v3 thread
domain (`supercov-rust-thread-phase-v1\0`), parent and nonce, with the same
zero/max avoidance rewrite as other derived contexts. The reader recomputes
it, rejects a mismatch, rejects context `0` or `u64::MAX`, and rejects any
child mapped to two different parent/nonce pairs.

A thread-end record (kind `6`) uses the thread-phase child as its context with
an empty payload; it commits when the thread's start routine returns. A
test-boundary record (kind `7`) uses the exact test context with an empty
payload; it commits when the test's context is exited. Duplicate ends for one
thread phase and duplicate boundaries for one test context are fatal.

Chains may interleave assertion and thread phases; every non-base context must
still resolve through authenticated phase records to the supervisor-owned
attempt context. Offline partitioning applies the join-bounded acceptance rule
in `threadScope`: a record whose chain includes thread phases is attributed to
its root test only when every such thread phase has a thread end whose
descriptor index precedes the root test's boundary index; otherwise every
record under the chain is deterministic background evidence with an explicit
`RUST_THREAD_OUTLIVED_TEST` limitation. This makes joined and scoped threads
exact and makes shared pool work safe background instead of misattributed
coverage.
