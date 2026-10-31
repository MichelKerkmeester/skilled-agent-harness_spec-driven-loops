# Demo packet specification

## Problem and purpose

Two concurrent runs append to counter.txt and the file sometimes ends up with
duplicated or lost lines. This packet defines one append-only counter update.

## Decisions

The counter update is append-only. A run never rewrites existing lines.
