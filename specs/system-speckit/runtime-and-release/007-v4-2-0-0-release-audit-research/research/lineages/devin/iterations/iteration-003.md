# Iteration 3: The 21 Recent Packets Against the Notes

## Focus

Work Q2: determine which of the 21 recently touched packets shipped work the notes do not cover, and whether the notes describe any shipped work differently. Selected interpretation: "shipped" means at least one non-docs, non-specs-housekeeping commit in `v4.1.0.0..HEAD` under the packet path; a packet touched only by `docs(specs)` or `chore(specs)` commits is planning, not shipped work. Deferred: BUG hunting (Q4).

## Actions Taken

1. Counted, for each of the 21 packets, the commits in the window whose type is not `docs`, `chore` or `merge`, which separates shipped work from planning.
2. Read the latest child packet's `implementation-summary.md` description for each parent whose latest child had one.
3. Mapped the 21 packets against the notes' "Spec folders (10)" block and against the notes' section content.
4. Verified two claims the packet work rests on: the advisor's `ownerSkill: system-skilled-doctor` projection for the six moved doctor commands, and the sk-git version trail.

## Findings

1. **DRIFT (P2) — the notes' "Spec folders (10)" block under-reports the release.** Twenty-one packets were touched in `v4.1.0.0..HEAD`. The block lists ten folders, and only nine of them appear among the 21 (`006-parent-skill-check-target-root` is not one of the recent packets). Twelve recent packets are unlisted; eleven of those are also absent from every section's content, and four of the eleven shipped user-visible work: `decision-capture/001-decision-capture` (`d57563b175a`), `sk-git/worktree-lifecycle/008-provision-skill-graph-database` (`957f47570f3`), `system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing` (`527fc5f9d43`) and `sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording` (`c06a73d348e`, `413d3268b8a`, `3395b32f6b1`). A reader who trusts the block as the release's packet index misses four shipped changes. [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:924] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt]

## Verified Claims (not findings)

- **All nine listed packets' shipped work is covered.** `012-deep-loop-command-offers` (the offer question, Option A/B/C and the brief options), `008-own-all-doctor-commands` (the ownership move and the playbook), `007-provision-dev-dependencies` (the nested lockfile install), `003-pi-skill-orchestrator` (the advisor hook and fallback fixes the "Smaller fixes" block records), `mcp-browser-use` (the hub and Bladebro), `007-overlay-framework-root-layout` (the layout and relayout), `002-graph-engineering` (expansive depth) and `002-opencode-v1-v2-dual-compat` (the v1 removal) each have matching note lines. `006-sk-code-and-readme-alignment` shipped no code in the window.
- **The advisor projection names the new owner.** `projection.ts:116,135,154,173` sets `ownerSkill: 'system-skilled-doctor'` for the moved doctor commands, matching the notes' "One Skill Owns Every Doctor Command".
- **The sk-git version trail matches.** `v1.11.13.0` records the nested-lockfile fix the notes cite; `v1.11.14.0` is a documentation correction only; `v1.11.15.0` is the unmentioned graph-build fix already recorded as a MISSING in iteration 1.

## Ruled Out

- **The eight unlisted packets that shipped nothing.** `005-skill-readability-refinement`, `001-hub-routing-quality`, `003-changelog-system`, `007-alignment-lane-runner`, `001-headless-bots-first-build`, `002-session-handover-loop` and `mcp-code-mode` have only `docs(specs)`, `chore(specs)` or `refactor(specs)` commits in the window, so their absence from the notes is correct. `001-headless-bots-first-build`'s own latest child states "Planned, not started."
- **`013-deep-loop-offer-in-hint` as a MISSING.** It is unlisted but its shipped behavior is described by the notes' "The Advisor Offers the Loop With Its Flags" section.
- **A second sk-git version gap.** `v1.11.14.0` changes only the claim that `create` is idempotent; it is a documentation correction, not user-visible behavior.

## Dead Ends

- **Using packet commit counts as a shipping signal without filtering commit types.** The first count said all 21 were touched and suggested several shipped; filtering `docs`/`chore`/`merge` reduced that to nine packets with shipped work. The unfiltered count would have produced false MISSING findings.

## Edge Cases

- Ambiguous input: "shipped work" was read as code or behavior changes, excluding spec-tree housekeeping. Deferred alternative: counting documentation rewrites as shipped, which would have added the changelog retrofit and the readability program.
- Contradictory evidence: none.
- Missing dependencies: several parent packets have no `implementation-summary.md` at the parent level; the latest child's summary was used instead, and parents whose latest child had none are marked as planning-only from their commit types.
- Partial success: none.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt`
- `.skilled/changelog/skilled/v4.2.0.0.md:924`
- `specs/hooks-plugins-extensions/decision-capture/001-decision-capture/016-stop-hook-auto-record/implementation-summary.md`
- `specs/sk-git/worktree-lifecycle/008-provision-skill-graph-database/implementation-summary.md`
- `specs/system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing/implementation-summary.md`
- `specs/sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording/implementation-summary.md`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/spec.md`
- `specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/implementation-summary.md`
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md`
- `specs/mcp/mcp-code-mode/003-code-mode-js-yaml-override/spec.md`
- `specs/commands/007-alignment-lane-runner/002-devin-lane/spec.md`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:116,135,154,173`
- `.skilled/skills/sk-git/changelog/v1.11.13.0.md`, `v1.11.14.0.md`, `v1.11.15.0.md`
- `git log --format="%s" v4.1.0.0..HEAD -- <packet path>` for all 21 packets

## Assessment

- New information ratio: 1.00
- Questions addressed: Q2 (fully)
- Questions answered: Q2

## Reflection

- What worked and why: filtering commit types per packet turned "touched in the window" into "shipped in the window", which is the only distinction that matters for a coverage audit. Reading each latest child's implementation-summary description gave a one-line statement of what shipped without opening every spec.
- What did not work and why: the first unfiltered count made seven planning packets look like shipped work; the packet tree carries research, plan and review commits under the same path, so path-only counting cannot separate them.
- What I would do differently: filter commit types before the first count, and read the parent `description.json` only after the filter, so planning packets are never opened.

## Recommended Next Focus

Work Q4: hunt for defects in code changed in the window, starting with the highest-risk new surfaces — the fan-out stop and survivor path, the frontier admission and budget arithmetic, and the overlay relayout restore path — and cite each with a commit hash, `file:line` and the notes line it concerns.
