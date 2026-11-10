### .skilled/skills/sk-doc/sk-create-diff/references/workflow.md

- [P1] .skilled/skills/sk-doc/sk-create-diff/references/workflow.md:20 | 10 (render gate, rubric 2) | Six H2s are unnumbered and the validator reports `render_h2_numbering` at lines 20, 36, 49, 73, 79 and 93; numbering them without ALL-CAPS titles and `---` separators only swaps those warnings for blocking `h2_not_uppercase` and `general_h2_separator` errors. | Replace the six heading lines with `## 2. AUTOMATIC FLOW (SNAPSHOT-BACKED)` (line 20), `## 3. EXPLICIT-PAIR FLOW (FALLBACK)` (36), `## 4. PRE-COMPOSED AGGREGATE PAIRS` (49), `## 5. WHERE SNAPSHOTS LIVE` (73), `## 6. LIFECYCLE` (79), `## 7. AFTER GENERATING A REPORT` (93), and insert a `---` line above each heading, with a blank line above and below the rule.
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/workflow.md:16 | 3 | The H1 at line 14 is followed directly by `## 1. OVERVIEW`; there is no intro, and the template requires a 1-2 sentence hook. | Insert after line 14: `Reach for this reference before a document changes, or when both versions are already in hand and the baseline is missing.`
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/workflow.md:18 | 4 | `## 1. OVERVIEW` opens with an unlabelled paragraph that is a core-principle statement; it has no Purpose and no When to Use, so the overview never says what the reference produces or when to open it. | Replace line 18 with:
  ```
  ### Purpose

  Give every review a real before-state, so a change is judged against what the document actually said.

  ### When to Use

  - You control the moment before an edit and want the engine to hold the baseline.
  - No baseline exists, or you are comparing two arbitrary versions.
  - One review needs to cover multiple files.
  - You need to inspect or prune stored baselines.

  ### Core Principle

  The core invariant: **capture the baseline before the edit.** A before/after review needs a real before-state, and once a file is overwritten the original is gone. `create-diff` never mutates the source — capture copies it into a local store.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/workflow.md:75 | 7 | One paragraph packs five separate storage mechanisms: store location, hash-keyed per-file subdirectory, manifest contents, atomic writes, and the read-only source guarantee. | Replace line 75 with:
  ```
  Baselines are stored under a `.create-diff/` directory in the current working directory (override with `--state-dir DIR`).

  - Each source path gets its own subdirectory, keyed by a hash of its absolute path.
  - That subdirectory holds the copied blobs plus a `manifest.json` recording capture time, size, and SHA-256.
  - Writes are atomic (temp file + rename).
  - The source is only ever read.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/workflow.md:93 | 6 | Report validation is the last step of every run, yet it is separated from the three comparison sections by the storage and cleanup maintenance sections, so the run's steps are not contiguous. | Move lines 93-101 to after line 71; renumber the moved section `## 5. AFTER GENERATING A REPORT`, and renumber `## 6. WHERE SNAPSHOTS LIVE` / `## 7. LIFECYCLE` accordingly, keeping the `---` separator above each.
