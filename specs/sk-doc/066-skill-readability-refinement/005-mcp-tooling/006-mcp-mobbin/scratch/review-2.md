VERDICT: PASS

**Findings**

- **Applied:** README.md (skip-gate move, `What It Does` bullets, `Plans And Limits` split, `scripts/README.md` row), ROUTER.md §1 default sentence and the `Setup / error` load row, SKILL.md (discovery-first before the call fence, ALWAYS 2 and NEVER 5 nested bullets), references/tool-surface.md (Purpose split, §6 heading and intro), references/troubleshooting.md (`deep` bullet reframed with the HEAD literal intact).
- **Justified skips — ROUTER.md:71, 147, 80.** All three sit inside fenced blocks: 71 in the ```text Phase Detection block, 80 in the ```text Resource Domains inventory, 147 in the ```python Smart Router pseudocode. The freeze forbids editing code blocks, and `code-blocks.py` confirms the three attempted edits were restored to HEAD (`BLOCK-CHANGED … edited=3`, `code_blocks_changed=0`). Applying them would set `code_blocks_changed=1`, which the review rules define as a FIX. The three-tool truth they would add is already stated in §1, §2 and `RESOURCE_MAP`, so no prose claim is missing; the stale strings survive only inside frozen declarations.

**LOST lines (6)**

- README.md `What It Does`: reflowed into five bullets. `read-only`, `packetKind`/`mutatesWorkspace`, registration reporting, discovery-first, `search_screens`/`limit 5`/platform/`mobbin_url`/`failed[]`, the no-write/no-dispatch boundary and the companion disclaimer are all present.
- ROUTER.md §1: only the finding-corrected final sentence differs; the replacement matches `RESOURCE_MAP` 137-144 and the `DEFAULT_RESOURCE` comment at 106-108. The rest of the paragraph is identical.
- tool-surface.md Purpose: reflowed into three bullets. "THREE", all three registry names, TS callables, the `Access as:` fixture line, the read-only/mutation-refusal check, the per-session discovery rule and the source trail all survive.
- tool-surface.md §6 heading and `These stay UNKNOWN` → `Open items stay UNKNOWN`: finding-driven, and correct now that four items carry RESOLVED. All ten items and every RESOLVED/historical qualifier remain.
- troubleshooting.md `deep`: HEAD's sentence and the `mode?: "deep" | "standard" | "fast"` literal are restored verbatim inside the new `Never treat …` frame.

**Rubric**

- Templates: README keeps its nine-section skill-README shape, ROUTER ends with `## 3. MACHINE ROUTER`, both references run Purpose → Usage with RELATED RESOURCES last, SKILL keeps its nine H2s.
- Render: `render_warnings=0 invalid=0` for all seven scoped files; per-file JSON shows `warnings: []`.
- Intros: none rewritten (`intro-diff.py` empty), so no claim was added or dropped.
- Gate before steps: README's skip gate now precedes QUICK START; SKILL's discovery-first rule now precedes the call example.
- Packed paragraphs: README `What It Does`, SKILL ALWAYS 2 / NEVER 5 and tool-surface Purpose are now lists; tables remain tables.
- Index: `scripts/README.md` is listed and the file documents both `install.sh` (verify-only) and `doctor.sh` (report-only).
- Numbering/progress: integer H2s throughout, related resources last, no TODO/WIP/spec paths, ADR-style ids none.
- Inbound: `#3-machine-router` text unchanged; ROUTER H2s 1-3, SKILL H2s 1-9 and tool-surface §1-§7 keep order and numbers. External tool-surface citations still use §1-§4. SKILL.md sits at 223 lines instead of 224 for the ROUTER link; the rule explicitly schedules that line recheck by hand at commit.

**Mechanical**

`code_blocks_changed=0 block_count_mismatch=0`, `frontmatter_changed=0`, `citations_missing=0`, `broken=0` over 91 links, scope gate `files=7 render_warnings=0 invalid=0`.

**Operator note**

The only unresolved content is the three stale comments inside ROUTER's frozen fences. Correcting them requires an explicit amendment to the code-block freeze; no in-round edit can hold.
