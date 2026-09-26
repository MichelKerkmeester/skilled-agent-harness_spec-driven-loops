# Query-index format spike

This reproducible Phase 4 spike compares four immutable query-index formats on
the same synthetic 100,000-line coverage model. It measures opening the file,
performing the format's integrity validation, and reading the first requested
record. Build and run it with:

```sh
cargo run --release --manifest-path spikes/query-index/Cargo.toml
```

The FlatBuffers compiler is built from the version-pinned upstream source by
the spike's build dependency; no system `flatc` installation is required.
Generated files and compilation output remain below the ignored local
`target/` directory.

The benchmark uses 200 fresh file mappings per format. It measures a warm page
cache, which isolates format/open/query cost from storage-device latency. Full
CLI cold-start is a separate release gate.
