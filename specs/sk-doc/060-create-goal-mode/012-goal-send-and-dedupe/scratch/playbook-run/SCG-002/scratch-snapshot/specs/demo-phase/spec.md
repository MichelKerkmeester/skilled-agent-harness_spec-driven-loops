# Demo phase packet specification

## Problem and purpose

Two concurrent runs append to counter.txt and the file sometimes ends up with
duplicated or lost lines. The fix is split across two phases.

## Decisions

Counter lines are plain text and append-only.

## Phase documentation map

| Phase | Folder |
|---|---|
| alpha | `001-alpha` |
| beta | `002-beta` |
