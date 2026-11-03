# Keep-marker form

**Chosen:** a sibling array, `intent_signals_keep`, in the hub's `graph-metadata.json`, next to the provenance array `intent_signals_generated` that `--write` maintains.

**Why:** `intent_signals` is a JSON array of strings that the advisor reads as literal phrases, so any in-string marker would leak into scoring.

**Rejected:** a prefix on the phrase itself (for example `keep:`). The advisor would score the prefixed string, and every reader of `intent_signals` would need to strip it.

Under ADR-001 most hand-added signals need no marker at all. A phrase that was never generated is never an orphan. The keep list only matters for a generated phrase that should outlive its router entry.
