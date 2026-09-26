# ADR: immutable Rust query index format

Status: accepted for Phase 4 implementation.

## Decision

Use a versioned, fixed-layout, little-endian, columnar binary index with a
memory-mapped read path. The index is disposable and immutable: the evidence
archive remains the sole source of truth, and any schema, producer, evidence,
or analysis-identity mismatch regenerates the index.

The format has:

- a fixed header containing magic, schema version, producer ABI, total length,
  evidence archive SHA-256 and byte length, analysis identity, section count,
  and a section-directory location;
- a typed section directory with checked 64-bit offsets, lengths, record widths
  and record counts;
- fixed-width columnar records for obligations and observation relationships;
- a UTF-8 string pool and flattened adjacency sections addressed by checked
  offset/count pairs;
- 64 KiB data pages with SHA-256 digests, plus a SHA-256-authenticated header;
- no typed pointer casts and no process-native `usize`, enum layout, padding,
  or endianness in the persisted representation.

Every lookup validates the header, section bounds, arithmetic overflow, and
the digest of each page it touches before interpreting values. Publication
performs a complete validation before an fsynced temporary file is atomically
renamed. Readers only map regular, non-symlinked files and writers never mutate
a published inode. Corrupt, stale, incomplete, or unsupported indexes are
deleted or ignored and reconstructed from immutable evidence.

## Benchmark

The reproducible spike is in `spikes/query-index`; the captured result is
`benchmarks/query-index-format-2026-08-25.json`. It models 100,000 source lines,
1,000 files, 20,000 tests, and one to four test-attribution edges per line.
Each release-mode result is the median and p95 of 200 fresh mappings with a
warm page cache, including integrity work and the first record lookup:

| Format | Size | Median | p95 |
| --- | ---: | ---: | ---: |
| gzipped JSON | 935,442 B | 15.742 ms | 16.473 ms |
| rkyv mmap + full SHA-256 + bytecheck | 3,042,776 B | 5.104 ms | 5.231 ms |
| FlatBuffers mmap + full SHA-256 + verifier | 3,786,612 B | 9.118 ms | 9.306 ms |
| fixed layout + header/page SHA-256 | 2,001,056 B | 0.114 ms | 0.129 ms |

The measurement isolates format/open/first-query cost; executable cold start
is measured separately by the ≤15 ms end-to-end query gate.

## Why not the alternatives

- Gzipped JSON already exceeds the complete CLI target before process startup
  or query work, and it reconstructs the entire object graph.
- rkyv is safe and fast: its checked access validates the full object graph,
  and its official API describes it as a zero-copy archived representation.
  It still spends roughly 41 times the selected format's p95 here, is 52%
  larger, and makes a disposable on-disk ABI depend on Rust archived layouts.
- FlatBuffers provides cross-language, zero-copy access and schema evolution,
  but the query index is private to the one Rust engine. Its generated schema
  and indirection buy interoperability that this artifact does not need, while
  its fully authenticated p95 is roughly 72 times the selected format.
- SQLite is designed for mutable/query-rich databases. A Supercov run index is
  write-once, has known access paths, and never needs update concurrency.

The custom format is not permission to invent unchecked serialization. Its
section types, byte layout, validation rules, corruption corpus, atomic
publication, and version migration are part of the frozen engine contract.

## Compatibility and versioning

An index is never migrated in place. Unknown versions are ignored and rebuilt.
The header binds an index to the exact evidence archive, analysis options,
schema, and producer ABI. This permits changing the internal format without
changing the immutable evidence contract or losing historical runs.

The implementation must be tested on macOS/APFS, Linux filesystems and
Windows/NTFS for truncated headers, overflowed offsets/counts, reordered or
overlapping sections, bad UTF-8, page corruption, concurrent reconstruction,
failed writes, `ENOSPC`, rename failure, killed publication and replacement of
an index while an older mapping remains open.

## Primary references

- [rkyv checked zero-copy access](https://docs.rs/rkyv/latest/rkyv/fn.access.html)
- [rkyv access and integrity guidance](https://docs.rs/rkyv/latest/rkyv/api/index.html)
- [FlatBuffers Rust support](https://flatbuffers.dev/languages/rust/)
- [memmap2 safety contract](https://docs.rs/memmap2/latest/memmap2/struct.Mmap.html)
