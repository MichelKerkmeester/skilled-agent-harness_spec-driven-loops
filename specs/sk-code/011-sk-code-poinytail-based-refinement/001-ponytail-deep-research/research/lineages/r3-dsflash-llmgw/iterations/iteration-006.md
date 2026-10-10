# Iteration 6: Review mode detection and surface vocabulary

## Focus

Part 2 opens. The first question is the one the steer names first: how agnostic `sk-code-review` really is, and which repository-specific assumptions leak into a mode meant for any codebase. This iteration reads the mode's `SKILL.md` end to end, executes its own `detect_surface_evidence` pseudocode against three foreign-repository inputs, and sweeps its references and assets for surface vocabulary.

## Actions Taken

1. Read `sk-code-review/SKILL.md` in full (551 lines), including the routing pseudocode and the output contract.
2. Reimplemented `detect_surface_evidence` exactly as written and ran it on three inputs: a generic Node path, a `package.json`-only diff, and an Obsidian plugin review prompt.
3. Swept the packet for `obsidian` (case-insensitive) and for the pre-rename packet names `code-webflow`, `code-opencode`, `code-quality`.
4. Compared the mode's detection rules against the shared authority `stack-detection.md` §§2-3.
5. Confirmed the round-008 additions are present (connected-code read, case line, numbering, final-line contract).

## Findings

1. **The review mode's detection logic misroutes generic repositories to the Webflow surface and contradicts the shared detection authority it claims to use.** `detect_surface_evidence` returns `sk-code:code-webflow` when any changed path contains `package.json` or `src/` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:226] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:227], but the shared authority names an exact Webflow-marker set (`src/2_javascript/`, `*.webflow.js`, `Webflow.push`, `--vw-`, vendor globals, `wrangler.toml`) and says "Generic Node.js outside `.skilled/` and without WEBFLOW markers stays UNKNOWN until the user clarifies the surface" [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:83]. The executed pseudocode makes the divergence observable: text `fix a null deref in the parser` with changed `src/api/client.ts` returns `sk-code:code-webflow`; `review my dependency bump` with changed `package.json` returns `sk-code:code-webflow` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:220]. A generic-Node review therefore receives Webflow standards evidence and skips the `sk-code:unknown` disclosure path the mode itself defines. NEW, P1 (the mode's central agnostic claim; a foreign repository is the normal input, not an edge case).
2. **The mode has no Obsidian surface anywhere, although the hub bundles Obsidian evidence into reviews.** `detect_surface_evidence` has no OBSIDIAN branch [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:220], the output contract's surface-evidence line lists only two surfaces plus unknown [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:339], and `review-core.md` describes the surface field as "`sk-code:code-webflow` or `sk-code:code-opencode`" [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:66]. A case-insensitive sweep of `SKILL.md`, `references/` and `assets/` finds zero matching lines outside the changelog. The hub, by contrast, routes `sk-code-review` bundled with `sk-code-obsidian` when the prompt names an Obsidian plugin [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:79] and the surface precedence the mode reads puts OBSIDIAN above WEBFLOW [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:39]. Executed proof: the same pseudocode fed `code review my obsidian plugin` with a changed `main.ts` returns `sk-code:unknown`. Reproducing case: `rg -i "obsidian" .skilled/skills/sk-code/sk-code-review/SKILL.md .skilled/skills/sk-code/sk-code-review/references .skilled/skills/sk-code/sk-code-review/assets` exits 1. NEW, P1.
3. **The mode still uses the pre-rename packet vocabulary in its contracts and guidance.** "Use the surface skill (`code-webflow` / `code-opencode`)" and "use `code-quality`" [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:39] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:42] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:43], the report template's "Baseline used: [sk-code (`code-review`)]" [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:338], the `sk-code:code-webflow` / `sk-code:code-opencode` keys [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:225] and the integration note [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:463]. The canonical keys are `sk-code-webflow`, `sk-code-opencode`, `sk-code-quality` and `sk-code-review` [SOURCE: .skilled/skills/sk-code/mode-registry.json:24] [SOURCE: .skilled/skills/sk-code/mode-registry.json:42]. Reproducing case: `rg -n "code-webflow|code-opencode|code-quality" .skilled/skills/sk-code/sk-code-review/SKILL.md .skilled/skills/sk-code/sk-code-review/references/review-core.md` prints nine rows, and none of those keys exists in `mode-registry.json`. NEW, P2 (naming drift in a contract consumed by automation; the canonical keys are what the hub and doctor validate).
4. **The round-008 review additions are present and coherent, so the mode's *doctrine* side is not the problem.** Phase 1 now reads the connected code and sends unread material to `Not checked:` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:295]; Phase 3 requires a `Case:` line, numbering across severity groups, and refuses a case-less finding [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:311] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:345]; and the final-line contract states the exact strings and the one blank line above the status line [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:383]. ALREADY-ADOPTED, P2, recorded so later iterations do not re-check doctrine; the checker behavior is separately in scope for the scripts iteration.

## Questions Answered

- Key question 5 is answered for the assumptions leg: repository-specific leakage is now demonstrated in the detection function (Findings 1-2), and the vocabulary drift is mapped (Finding 3). The internal-agreement leg moves to the next iterations.

## Questions Remaining

- Do the checklists, `review-core.md` and the playbook agree with the output contract's newer fields (`Case:`, numbering, `Not checked:` placement)?
- Does the review agent (`.skilled/agents/review.md`) carry the same detection assumptions as the mode?

## Ruled Out

- **"Treat the two-surface output contract as a deliberate scope limit."** The mode's own `When NOT to Use` never excludes Obsidian, the hub's canary bundles it, and the shared precedence places it second; a scope limit would have to be stated, and none is.
- **"Re-verify the connected-code and case-line additions."** They were confirmed once here and are round-008 adopted scope; no further budget.
- **"Read `@deep-review`'s finding format now."** The reproducing-case amendment to the deep-review agent is phase 009's in-flight scope (steer ruling 2).

## Dead Ends

- The `benchmark/` folder inside the review packet is historical Lane C material [SOURCE: .skilled/skills/sk-code/benchmark/README.md:15]; not read as live contract.
- `changelog/` mentions of Obsidian are historical entries, not live routing vocabulary.

## Edge Cases

- Ambiguous input: whether `package.json` in a changed-file list is itself a Webflow marker. Chosen interpretation: no, per the shared authority's marker set; the mode's rule is the defect.
- Contradictory evidence: none once the authority was read.
- Missing dependencies: the pseudocode was re-executed in Python, not run through the repo's harness; the inputs are concrete and the outputs recorded.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md`
- `.skilled/skills/sk-code/sk-code-review/references/quick-reference.md`
- `.skilled/skills/sk-code/shared/references/stack-detection.md`
- `.skilled/skills/sk-code/mode-registry.json`
- `.skilled/skills/sk-code/benchmark/README.md`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.88 (three fully new findings, one ALREADY-ADOPTED confirmation).
- Questions addressed: key question 5 (assumptions leg).
- Questions answered: none fully; the leg is addressed, not closed.

## Reflection

- What worked and why: executing the pseudocode instead of reasoning about it. The `package.json` misroute is arguable on a read; the three printed outputs make it a reproduction.
- What did not work and why: the initial keyword sweep for "repository-specific" found nothing because the leakage is structural (path markers), not lexical; the comparison against `stack-detection.md` is what surfaced it.
- What I would do differently: run every routing pseudocode block in the packet against foreign inputs the moment it is read, before moving on.

## Recommended Next Focus

Internal agreement: the review mode's checklists, `review-core.md`, and the playbook against each other and against the output contract's newer fields.
