# Iteration 003

## Focus
Runtime mirrors of the four code-working agents across `.claude`, `.opencode`, `.codex`, `.cursor`, `.devin`, `.pi` and `.hermes`; which copy is authoritative, what each local gate actually compares, and where a drift can pass unnoticed.

## Actions Taken
- Hashed the canonical bodies and all per-runtime copies for the four agents, and classified each mirror shape (symlink, generated copy, authored copy).
- Read the three checkers that own the agent-mirror story: the deep-improvement mirror-sync checker, the doctor roster check and the runtime-mirrors sync policy, plus the pre-commit mirror-parity gate.
- Verified round one's D2 (Codex-only changes passing unchecked) against the current tree.
- Traced the Hermes agent-persona mirror from its sync script to CI, pre-commit and both doctor routes.

## Findings
1. **Round one's D2 is closed in the current tree. VERIFIED CLOSURE.** The checker's path regex now includes `codex` [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:32], its orphan list now looks for lingering `.codex` mirrors [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:88], both pre-commit hooks now include codex paths in the staged-agent grep [SOURCE: .skilled/hooks/git/pre-commit:87] [SOURCE: .skilled/scripts/git-hooks/pre-commit:170], and the pre-commit mirror gate now runs the dedicated Codex sync checks [SOURCE: .skilled/scripts/git-hooks/pre-commit:259] [SOURCE: .skilled/scripts/git-hooks/pre-commit:260]. Round one recommendation 8 (hand off D2) is satisfied; the parent packet should not reopen it as pending work. Priority P1 as a scope correction, no fix needed.
2. **The Hermes agent-persona mirror check runs only in CI. NEW, same failure class as the closed D2.** `sync-skills-hermes.cjs` mirrors the agent personas from `.skilled/agents` into `.hermes/skills/agent-*` and has a `--check` mode [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:20] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:27] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:48]. CI runs both Hermes checks [SOURCE: .github/workflows/command-tree-parity.yml:62] [SOURCE: .github/workflows/command-tree-parity.yml:65] [SOURCE: .github/workflows/command-tree-parity.yml:66]. The local commit gate does not: the pre-commit file contains zero Hermes references, and `.hermes` appears in neither the mirror-output nor the mirror-source list [SOURCE: .skilled/scripts/git-hooks/pre-commit:210] [SOURCE: .skilled/scripts/git-hooks/pre-commit:223]. The doctor's runtime-mirror config also contains zero Hermes entries, and the doctor's update route checks only Hermes prompts, never the skill/persona copies [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:186]. The doctor's own documentation claims the workflow runs "the Codex, Pi and Hermes prompt and agent mirrors" [SOURCE: .skilled/commands/doctor/runtime-mirrors.md:59], which the config does not back. A stale `.hermes/skills/agent-*` copy ships locally and is caught only when CI runs. Priority P1. Target: the pre-commit mirror gate and the doctor runtime-mirror config.
3. **The OpenCode-dialect agent body exists in three byte-identical copies with no equality check between them. NEW, latent.** `.skilled/agents/code.md`, `.opencode/agents/code.md` and `.hermes/agents/code.md` hash identically today (same for `review`, `debug`, `orchestrate`), while `.pi/agents` diverges because it is generated with adapted frontmatter. Each checker compares a different pair: the deep-improvement checker reads `.opencode/agents` as its canonical and compares `.claude`/`.codex` [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:29]; the doctor's roster check treats `.claude/agents` as canonical and checks the `.skilled` copy for presence only, never content, because it expects a different frontmatter dialect [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:41] [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:62]; the Hermes and Pi syncs source from `.skilled/agents` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:27] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs:21]. Nothing compares `.skilled`, `.opencode` and `.hermes/agents` to each other, so an edit to one copy that satisfies its own pair checker can leave the other two stale while every local gate stays green. No drift exists today; the risk is latent. Priority P2. Target: one content-equality check across the three copies, or collapse two of them into links/generated outputs.
4. **Ponytail's adapter-thinness rule is substantively implemented. ALREADY-ADOPTED.** Ponytail keeps one skill source and thin adapters, with copied rule text kept aligned only for instruction-only hosts [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:45] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:47]. The repo mirrors that policy concretely: Cursor agents are symlinks resolving back to the Claude canonical so a real file cannot silently fork [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:51], Devin and Codex trees are generated, and the runtime-mirrors sync documents which dialect each host parses [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36]. No action; recorded so the mirror findings above stay scoped to their real gaps.

## Questions Answered
- Which Ponytail teachings improve the four code-working agent definitions (.skilled/agents/code.md, review.md, debug.md, orchestrate.md) and their runtime mirrors, and which are already adopted there?

## Questions Remaining
- Which Ponytail teachings improve the repository rules (`.skilled/repo-rules/*.md`) without weakening floors?
- Which Ponytail teachings improve the root `REPO RULES.md` and `AGENTS.md` framework?
- Which Ponytail teachings improve the sk-code hub core beyond round one?
- Which Ponytail teachings improve the sk-code shared layer and the quality/review modes beyond round one's adopted set?
- Which Ponytail teachings improve the per-surface packets beyond round one's cited defects?
- Which original ideas does Ponytail inspire for these targets, and which transfers should be rejected?
- Which round-two findings are NEW, ALREADY-COVERED or ALREADY-ADOPTED, and at what priority?

## Ruled Out
- **Adding per-host verification records for every runtime adapter.** Round one already carried this as a deferred idea; the repo's doctor and CI already prove freshness structurally, and a hand-kept host-version table would be a second source of truth that rots. Rejected unless an adapter actually misbehaves against a host version.
- **Treating the three-way OpenCode-dialect copy as urgent.** All three copies are identical and every gate passes; finding 3 is a latent risk with a cheap fix, not a present defect.

## Dead Ends
- Searching for a cross-copy equality check between `.skilled/agents` and `.opencode/agents`: none exists in the tooling, which is why finding 3 is stated as a gap rather than a drift.

## Edge Cases
- Ambiguous input: "canonical" means three different files to three tools. Rather than resolve it by preference, the finding records each tool's claim with its source line and treats the divergence itself as the finding.
- Contradictory evidence: the doctor documentation claims Hermes agent mirrors are checked while the config contains no Hermes entry; both are cited and the doc claim is reported as drift instead of silently preferred.
- Missing dependencies: none.
- Partial success: none; all planned checks ran.

## Sources Consulted
- .skilled/agents/code.md, .skilled/agents/review.md, .skilled/agents/debug.md, .skilled/agents/orchestrate.md (hashes only, bodies read in iterations 1-2)
- .claude/agents, .opencode/agents, .codex/agents, .cursor/agents, .devin/agents, .pi/agents, .hermes/agents (copy shapes and hashes)
- .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs
- .skilled/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs
- .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
- .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml
- .skilled/commands/doctor/runtime-mirrors.md
- .skilled/commands/doctor/assets/doctor-update-apply.yaml
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
- .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs
- .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs
- .skilled/hooks/git/pre-commit
- .skilled/scripts/git-hooks/pre-commit
- .github/workflows/command-tree-parity.yml
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md

## Assessment
- New information ratio: 0.75 (3 fully new: findings 1, 2, 3; 1 reconfirmation: finding 4)
- Questions addressed: key question 1 (the whole question, bodies plus mirrors)
- Questions answered: key question 1

## Reflection
- What worked and why: hashing every copy before reading any checker turned "there are many mirrors" into an exact map of what is compared and what is not; two of the three findings fell out of that map rather than from doctrine.
- What did not work and why: an early terminal pass rendered some path strings incorrectly, which nearly led to a false claim that the doctor had no Hermes support; re-running the same query through a file-reading script gave exact text and corrected it before the finding was written.
- What I would do differently: for rule-file iterations, read each rule's own contract first and the framework text second; the mirrors iteration proved that the tooling in this repo is better evidence about the repo than any summary of it.

## Recommended Next Focus
Repository rules: `.skilled/repo-rules/*.md` against Ponytail's doctrine and portable rule copy, checking each rule for teachings it lacks without weakening its floors.
