# Iteration 2: The external-repository install, and two runtimes that finish green without the brief or its policy

## Focus

KQ3: what an external repository install must do so a plain request gets an offered command with a usable policy. The iteration follows the two instruction-file choices in `INSTALL-SKILLED.md`, the Claude copy rule in the agents-md engine and check, and the six legs of the install's final `/doctor:setup` against the measured per-runtime brief delivery.

## Actions Taken

1. Read the install guide's Step 1 and Step 2 (the embed and link choices) and the agents-md embed route's mutation boundary.
2. Read the agents-md engine's copy handling and the check's A1 install-state and A10 runtime-copy rows.
3. Read the symlink manifest's `CLAUDE.md` row and the two read-only hook checks.
4. Read `/doctor:setup`'s six legs and the doctor route table, and compared them with where `codex-hook-approval-check.cjs` and `hook-wiring-check.cjs` are actually called.
5. Re-read the after-arm delivery numbers for Claude and Codex against those install shapes.

## Findings

1. The install offers two instruction-file shapes with opposite outcomes for Claude Code: `link` makes `CLAUDE.md` a symlink to the checkout's `AGENTS.md`, while `embed` folds a project `CLAUDE.md` into `AGENTS.md` and removes it, leaving no file named `CLAUDE.md` in the project. [SOURCE: .skilled/commands/doctor/assets/symlink-manifest.json:23] [SOURCE: .skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:29]

2. The agents-md check is asymmetric. It has a named `claude-only` install state for a repository with `CLAUDE.md` and no `AGENTS.md`, but no state or row for the reverse shape that `embed` produces. A10 accepts `absent` as an expected `CLAUDE.md`, so an embed install with no Claude instruction file passes the check. [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:217] [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:738]

3. The install's final step is not truthful about brief delivery. `/doctor:setup` runs six read-only legs, and none of them reports whether a runtime received a brief or whether its prompt hook is approved; the Codex approval check runs only under `/doctor:runtime-mirrors`, and the hook-wiring check only under `/doctor:symlink check`. A fresh Codex install can therefore print `STATUS=OK` with 0 of 24 briefs delivered. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:54] [SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:41] [SOURCE: .skilled/commands/doctor/assets/doctor-symlink-check.yaml:60]

4. The measured after arm lands exactly on those two shapes: Codex delivered 0 of 24 briefs because a fresh checkout's project hooks are unapproved, and Claude delivered 24 of 24 briefs but 0 of 24 Gate 2 bullets because the arena had no project `CLAUDE.md` and the global file points at the main checkout. Two of six runtimes reach a nominally successful install with either no brief or no policy definition. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:130] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:135]

5. The cheap repair fits both readings of Claude's instruction loading: a one-line `@AGENTS.md` pointer is not a copy, so it cannot double-load or drift, and the manifest's own expected set already lists `pointer` for `CLAUDE.md`. No validator change is needed; only the engine's default and the check's missing row. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:738]

6. The install guide does not tell the person what the instruction-file choice costs per runtime. Step 1 says `embed` "adds the shipped sections to your project's own `AGENTS.md`" and step 2 repeats it; neither says `embed` removes `CLAUDE.md`, and neither names Claude as the runtime that depends on it. [SOURCE: INSTALL-SKILLED.md:133] [SOURCE: INSTALL-SKILLED.md:146]

7. Both repairs are display and file-authoring changes with no process and no scorer path: one 12-byte pointer written at embed time, one check row that reads the project `CLAUDE.md`, and one `/doctor:setup` line that calls the two existing read-only checks. [INFERENCE: based on the embed engine's allowlist and the setup legs' read-only invariant]

## Ruled Out

- Write the operator's global `~/.claude/CLAUDE.md` from the install path: outside the repository, declared report-only by the manifest, and it changes what every session on the machine loads. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:777]
- Keep a full `CLAUDE.md` copy from `embed`: the manifest's own reason says a full copy double-loads or drifts; a pointer avoids both. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:744]
- Leave the Codex signal to `/doctor:runtime-mirrors`: a person who ran the six printed install steps has no reason to run a seventh command, so the zero stays silent. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:54]

## Dead Ends

- Looking for a setup leg that already covers brief delivery: the advisor leg checks `advisor_status` freshness, not a delivered brief, and the embedder leg checks the semantic lane. Neither reads a run log or a hook approval. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:57]
- Looking for a check that fails on the embed shape: A1 only names `claude-only`, and A10 accepts `absent`, so both rows pass. [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:217]

## Edge Cases

- Ambiguous input: "external repository setup" could mean the link engine, the instruction file or the hook approval. All three are on the printed install path, so all three were measured; the instruction file is the one with a runtime-specific zero.
- Contradictory evidence: carried from iteration 1 between the manifest's "Claude reads the root document directly" and the measured arena. The pointer recommendation is deliberately valid under both.
- Missing dependencies: none; all reads were local and no command wrote outside the lineage.
- Partial success: none.

## Sources Consulted

- `INSTALL-SKILLED.md`
- `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml`
- `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt`
- `.skilled/commands/doctor/assets/agents-md-manifest.json`
- `.skilled/commands/doctor/assets/symlink-manifest.json`
- `.skilled/commands/doctor/assets/doctor-setup.yaml`
- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`
- `.skilled/commands/doctor/assets/doctor-symlink-check.yaml`
- `.skilled/commands/doctor/scripts/agents-md-check.cjs`
- `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`

## Assessment

- New information ratio: 0.72
- Questions addressed: KQ3
- Questions answered: KQ3

## Reflection

- What worked and why: following the printed install steps in order, then asking what each final check actually reads, found a green status that no measured runtime supports. Comparing the two instruction-file shapes explained why the same brief behaved differently on Claude between the main checkout and the arena.
- What did not work and why: searching for an existing brief-delivery leg failed because every leg is a component check; none composes "the runtime can receive a brief" from the hook file plus the approval plus the instruction file.
- What I would do differently: start from the final status line and walk backwards; the misleading green is the finding, and the file shapes are its cause.

## Recommended Next Focus

KQ4 and KQ5: the embedder keep-alive decision with its memory and latency numbers, then the ranking. The install-side findings already supply two of the ranked items; the ranking needs the cost side measured before it can order them.
