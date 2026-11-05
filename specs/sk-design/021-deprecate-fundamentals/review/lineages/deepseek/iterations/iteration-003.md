# Deep Review Iteration 3: Maintainability

## Dimension

Maintainability. Scope: whether the canonical descriptions and structure still point at what the
surface now holds, whether a retired rule failed to move, and whether the surviving documents are
safe to change without re-creating the old split.

## Review Focus Addressed

Operator focus, "lost guidance" and "doc accuracy" halves. This iteration maps every retired
reference section to its new home, then checks the two canonical places a future editor reads
first: the hub's surface table and the surface's own description.

## Files Reviewed

- `.skilled/skills/sk-code/SKILL.md:40-50`, `:112-118`
- `.skilled/skills/sk-code/description.json:3`, `:40`
- `.skilled/skills/sk-code/README.md:35-55`
- `.skilled/skills/sk-code/sk-code-frontend/SKILL.md:16-40`
- `.skilled/skills/sk-code/sk-code-frontend/README.md:35-55`
- `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md:17-35`
- `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md:43-565`
- `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-hierarchy.md:43-618`
- `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md:43-642`
- `.skilled/skills/sk-design/SKILL.md:18-95`
- `.skilled/skills/sk-design/benchmark/README.md:30-40`
- the old reference headings recovered with `git show 10474a9567:<path>`

Command evidence used:

- `grep -E '^### V[0-9]+\.' web-visual-values.md` (V1-V41), `^### H` (H1-H36), `^### M` (M1-M57)
- `git show 10474a9567:.skilled/skills/sk-design/sk-design-fundamentals/references/<file>.md`
  piped to `grep -E '^#{2,3} '` for the nine retired references
- `grep -rn 'box-shadow|transition.*opacity|repaint'` across the three new references
- `grep -n '"description"|"lastUpdated"' .skilled/skills/sk-code/description.json`
- `grep -rn 'four modes|values mode'` over the live sk-design and sk-code docs (only changelog
  and benchmark history hits)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 remains active.

### P2 Findings

5. **The hub's canonical surface description still omits the three visual references** -- `.skilled/skills/sk-code/SKILL.md:44` -- The surface table says the frontend packet carries "web markup and CSS, web layout and accessibility, and Figma-to-code checks", and the surface list at `:50` and the layout comment at `:115` say the same. None names `web-visual-values.md`, `web-visual-hierarchy.md`, `web-motion-and-interaction.md` or `assets/tokens.css`. `description.json:3` also still describes the frontend as "web and Figma-to-code", and its `lastUpdated` at `:40` remains `2026-10-10` after the 3.11.0.0 bump.
   Case: an operator or a future editor opens the hub SKILL, sees three surfaces with no visual
   capability, and adds a fourth surface or a second copy of the values instead of extending the
   frontend packet. The surface README and the agent already describe the visual refs, so the
   hub's own canonical table is the outlier.
   Finding class: cross-consumer
   Scope proof: the three omissions are all in one description family (SKILL table, surface list,
   layout comment) plus `description.json`; `grep -n 'web-visual-values' .skilled/skills/sk-code/SKILL.md`
   prints no line, while the surface README and `sk-code-frontend/SKILL.md` do name the files.
   Affected surface hints: ["sk-code SKILL", "sk-code description.json", "surface discovery"]
   Recommendation: add the visual value/hierarchy/motion refs and tokens.css to the frontend row,
   the surface list and the description, and refresh `lastUpdated`.

6. **The shadow-animation performance rule did not move with the depth guidance** -- `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md:247` -- The retired `depth-and-detail.md` carried a rule that a `box-shadow` transition repaints on every frame, with the fix of putting the target shadow on a pseudo-element and animating its opacity. The new `web-visual-values.md` keeps the shadow system (V20-V27) and `web-motion-and-interaction.md` keeps the blur/repaint rules (M27), but neither carries the pseudo-element technique or the "do not transition box-shadow" rule.
   Case: a frontend request asks to animate a card's elevation on hover. The only shadow guidance
   now describes how to compose shadows, not how to transition them, so an agent may write a
   `transition: box-shadow` rule, which repaints on every frame and is exactly what the retired
   rule prevented.
   Finding class: class-of-bug
   Scope proof: mapped every heading in the nine retired references to a new V/H/M item; this is
   the only retired section with no successor. `grep -n 'pseudo-element'` in the two new files
   hits only the touch-target rule (M9), not shadow animation.
   Affected surface hints: ["web-visual-values elevation", "web-motion-and-interaction performance", "tokens.css shadow set"]
   Recommendation: add a V item under Section 5 (or an M item under performance) that keeps the
   pseudo-element opacity technique and its duration band.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | The surface content matches the plan; the hub's own description does not, and one retired rule has no successor. |
| `checklist_evidence` | core | partial | Unchanged from iteration 2: two recording defects, no missing acceptance row. |
| `skill_agent` | overlay | pass | `.skilled/agents/design.md:70-75` names the three new references and `tokens.css`; the capability scan at `:124-136` maps the three paths. |
| `agent_cross_runtime` | overlay | pass | `.claude/agents/design.md`, `.codex/agents/design.toml`, `.pi/agents/design.md` and `.hermes/skills/agent-design/SKILL.md` all carry the new description and decide path. |

## Edge Cases

- The old `token-starter-set.md` was deleted while `tokens.css` was moved. Its role-layer and
  retuning guidance survives in V35-V38, so the deletion is a consolidation, not a gap.
- The old `review-checklist.md` accessibility tiers survive in `web-visual-hierarchy.md` Section 6
  with the same critical/serious/moderate split; the linked A-anchors live in the existing
  `web-accessibility-patterns.md`, which the intent does not load but a reviewer can open.
- Old `motion-principles.md` cites sources in its "Sources" subsection; the new motion reference
  states the principles without those citations, which is the intended chart-style cleanup rather
  than a lost rule.

## Confirmed-Clean Surfaces

- V1-V41, H1-H36 and M1-M57 are all present and numbered without gaps.
- The three new references' relative links (57, 60 and 65 links) all resolve; the playbook
  scenario's 8 links resolve.
- The old nine-reference heading map finds a successor for every section except the shadow
  animation rule.
- `sk-code-frontend/README.md` and `SKILL.md` correctly describe three visual topic files, nine
  web topic files and the token asset.
- `sk-design/SKILL.md`, `ROUTER.md`, `benchmark/README.md` and `description.json` consistently
  describe three modes and no default.

## Ruled Out

- **A wholesale loss of the retired references.** Ruled out by the heading-to-item mapping; eight
  of the nine references have complete successors.
- **A live "four modes" string.** Ruled out by grep over live docs; only changelog and benchmark
  history retain it.
- **Stale versions across the surfaces.** Ruled out by version greps on all four hubs/modes; the
  only unrelated version is `sk-code/ROUTER.md` at 2.3.18.0, which was already independent of the
  hub version at baseline.

## Next Focus

Dimension: security. Inspect the new token and motion guidance for trust-boundary or secret
exposure advice, check that the routing entries are path-safe, and verify the changed manifests
carry no absolute path or executable instruction.

Review verdict: CONDITIONAL
