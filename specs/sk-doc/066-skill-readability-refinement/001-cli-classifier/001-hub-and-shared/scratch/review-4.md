VERDICT: FIX

- [P2] .skilled/skills/cli-classifier/ROUTER.md:108 | 10 | The related-resources section is the only unnumbered H2 in the file, so the section numbers jump from `## 4.` to `## 5.`; the equivalent section in `sk-code/ROUTER.md` is numbered ahead of the machine router. | Replace `## RELATED RESOURCES` with `## 5. RELATED RESOURCES` and replace `## 5. MACHINE ROUTER` with `## 6. MACHINE ROUTER`. Section 3 stays the replay source and no inbound reference cites the machine router by number.

- [P2] .skilled/skills/cli-classifier/shared/README.md:50 | 10 | The related links are an `### Related` subsection inside `## 2. DIRECTORY TREE`, so the file has no top-level related section, unlike every other shared README (`## 4. RELATED` in `sk-doc/shared/README.md`, `## 5. RELATED` in `system-spec-kit/shared/scripts/README.md`, `## 4. RELATED` in the sibling `shared/scripts/README.md`). | Replace this text:

  ```
  Anything a future packet needs in common goes here with its own README, and stays out of the
  two-axis packet model by design.

  ### Related
  ```

  with:

  ```
  Anything a future packet needs in common goes here with its own README, and stays out of the
  two-axis packet model by design.

  ---

  ## 3. RELATED
  ```
