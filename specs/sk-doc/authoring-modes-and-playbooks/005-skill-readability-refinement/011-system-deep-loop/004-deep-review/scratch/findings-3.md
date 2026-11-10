### .skilled/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md

- [P2] .skilled/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md:20 | 4 | §1 OVERVIEW has no `### Purpose` or `### When to Use` and its only paragraph repeats the intro's reducer→registry/dashboard/strategy claim, so the section adds only the "not a second source of truth" clause. | Replace lines 20-22 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Keep the findings registry, dashboard, and strategy current by deriving them from append-only evidence under the reducer, never as a second source of truth.

  ### When to Use

  - Deciding which writer owns a derived surface, or whether a hand edit is legitimate.
  - Recovering from corrupt JSONL, or rebuilding derived files that are missing.
  - Checking what a finding must carry before emission, and how duplicate findings collapse.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md:39 | 7 | One 55-word sentence carries three separate mechanisms — the projection bound, where the vocabulary and census are documented, and what the checker script enforces — so the script's role is only reachable at the end of the clause chain. | Split after "bounded by the registered stems.", keeping line 39 as the lead sentence:
  ```markdown
  Under ledger authority the JSONL the reducer reads is a projection of the ledger, bounded by the registered stems.

  - The registered vocabulary and the producer census are in `state-format.md` section 11.
  - `.skilled/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs` holds the census to the emitter surface on disk.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md:83 | 6 | FINDING DEDUPLICATION sits after both recovery sections although §3 (line 53) already requires a `content hash` on every active finding; that term is defined only 36 lines later, after the corrupt-log and rebuild material, so the section reads as appended rather than placed where the registry contract is used. | Move lines 83-104 (`## 6. FINDING DEDUPLICATION` through its closing `---`) to after line 55; retitle it `## 4. FINDING DEDUPLICATION`, retitle `## 4. FAIL-CLOSED BEHAVIOR` to `## 5. FAIL-CLOSED BEHAVIOR` and `## 5. RECONSTRUCTION` to `## 6. RECONSTRUCTION`, and drop the extra blank line left before `## 7. RELATED RESOURCES`.
