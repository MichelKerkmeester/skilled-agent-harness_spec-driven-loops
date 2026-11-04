VERDICT: PASS

- **Findings:** All 14 are applied; none skipped. Thirteen match the prescribed text verbatim (README 4, ROUTER 1, `figma-cli-reference.md` 2, `mcp-wiring.md` 1, `tool-surface.md` 1, `troubleshooting.md` 4). The SKILL.md finding is applied as a disclosed shaping choice: the discover rule sits on its own line above `call_tool_chain()`, which preserves the required order and the block's one-sentence-per-line rhythm.
- **Lost-line audit:** 6 LOST lines, all finding-mandated.
  - The README connect-mode and command-class paragraphs, the ROUTER overview and the troubleshooting daemon paragraph are exact reflows into lists. Every mode, flag, risk, gate, destructive verb, endpoint, token path, PID path and timeout survives; `status -> diagnose -> restart -> reconnect` is verbatim.
  - The Skills Library row is a relabel to the established `[Skills Library](../../README.txt)` form used by the sibling READMEs; the link resolves to `.skilled/skills/README.txt`, and the row's purpose text is intact.
  - The `figma-cli-reference.md` version label is a P1-mandated removal of packet version state that contradicted the frozen `SKILL.md` `1.2.0.0` frontmatter. The same sentence's surviving claim, the embedded `mcp-servers/figma-cli` scaffold rather than source-vendoring, is intact.
- **Changed intros:** none. `intro-diff.py` reports no difference for any changed file; the factual blockquote intros were left alone.
- **Render/template:** `scope-gate.py` prints `files=9 render_warnings=0 invalid=0`, and `validate_document.py --json` returns `valid: true`, `total_issues: 0`, `warnings: []` on all nine files, including `README.md --type readme`. The four references now open Purpose → When to Use → Core Principle → Key Sources; the two assets keep the asset template's Purpose → Usage.
- **Inbound freeze:** H2 text, order and numbers are byte-identical to HEAD for `ROUTER.md`, `SKILL.md`, `figma-cli-reference.md`, `mcp-wiring.md`, `tool-surface.md` and `troubleshooting.md`. `ROUTER.md#3-machine-router` still resolves. Only intra-section line offsets shifted, which the commit-time manual line-reference recheck covers.
- **Frozen artifacts:** `frontmatter_changed=0 code_blocks_changed=0 block_count_mismatch=0 citations_missing=0`; 111 links checked, 0 broken. `git status` shows exactly the seven in-scope files.
- **Rubric:** governing rules now precede what they govern (discover before call, token rule before Fix, hard facts before sources); packed paragraphs are lists and every table stayed a table; the README document map gains the nine missing entries; no new progress tokens or spec paths; integer H2s; related-resources sections remain last.

Nothing is required from the operator for this review.
