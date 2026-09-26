# Rust probe transport v1

Status: **frozen wire contract; Rust product frontend private**.

This is the bounded observation channel shared by the Rust supervisor and the
runtime injected into compiled Rust code. It is not the evidence archive. The
supervisor converts authenticated transport records into evidence v3 only
after the attempt has stopped and every health check below has passed.

## Ownership and isolation

The supervisor creates a new regular file with mode `0600`, a random 128-bit
task token, fixed descriptor and payload capacities, and zeroed counters. The
path and token are scoped to one execution task. Writers reject a missing or
mismatched header/token and never create, resize, truncate, or follow a
symlinked transport path. The supervisor also refuses non-regular or symlinked
files.

The task token binds a mapping to its supervisor; it is not a security boundary
against the user's own test process. Final evidence archive authentication and
integrity remain governed by evidence v3.

## Fixed layout

All integers are little-endian. The 128-byte header begins with `SCVRUST1` and
contains exact layout sizes, bounded capacities, the endian marker `0x01020304`,
atomic reservation/loss counters, the task token, and an attachment counter.
Reserved header bytes must remain zero.

Each 40-byte descriptor contains a one-byte commit marker, record kind,
decision outcome, zero flags byte, process ID, 64-bit context ID, payload
offset/length split into ID and value lengths, and a 64-bit FNV-1a checksum over
all meaningful descriptor metadata plus payload. The variable payload follows
the complete fixed descriptor array.

Context `0` means background or unattributed execution. `u64::MAX` is reserved
as the runtime's nesting sentinel and is never a published context. Every other
nonzero ID resolves, through supervisor-owned attempt metadata, to exact run,
worker, logical test, retry, and phase identity. It is recorded per observation
so concurrent contexts are never inferred from timestamps or process order.

Rust assertion phases use the same context field without changing this wire
format. The injected runtime derives a child context from the active nonzero
parent context and the assertion's stable 96-bit decision ID using FNV-1a over
`supercov-rust-assertion-phase-v1 || parent-le || id-high-le || id-low-le`.
Reserved results are remapped with `0xa5a55a5ad3c3b4b4`. Context `0` never
becomes attributed. The supervisor must derive the same IDs for every
test/assertion nesting path, reject any collision before execution, and map
each child to an explicit assertion phase in evidence v3. Enter/exit boundaries
are compiler-owned and cover assertion argument/condition evaluation through
normal or unwind completion; nested assertions restore their parent assertion.

## Publication and crash semantics

A writer atomically reserves a descriptor and payload range, fills both, then
publishes commit value `1` with release ordering. The reader observes commit
with acquire ordering. A fully committed descriptor is independently
recoverable if a later writer or the entire process dies. Reserved but
uncommitted descriptors are counted as incomplete; capacity failures increment
the dropped counter. Unknown kinds, invalid boundaries, nonzero reserved bytes,
bad checksums, invalid IDs, and unexpected commit values fail closed.

For an ultimately passing attempt, zero runtime attachments when executable
obligations were expected, any dropped record, or any incomplete descriptor is
a measurement blocker. Evidence from killed or failed attempts may retain
fully committed observations under its actual outcome, but can never verify
passed-only coverage. Context-zero observations remain background evidence and
cannot be reassigned to a passing test.

## Platform gate

The std-only target runtime currently implements shared mmap transport on the
six shipped x86-64/AArch64 GNU Linux, musl Linux, and macOS target triples.
Every other target fails closed. Windows needs its owned mapping implementation
and crash/concurrency corpus before it can advertise this contract; a no-op
stub is not support.
