# Iteration 2: The G5 layout fix and the measurement that decides whether a start-rate gain is real

## Focus

Follow the reducer's next focus (G5 shadowing) and settle the measurement question behind every later recommendation: can the current harness tell a model that declined an offered command from a model that was never offered one? Both are per-runtime facts, so they stay in this lineage.

## Actions Taken

1. Read `scratch/g5/listing-a.txt` and `listing-b.txt` to see what the G5 experiment actually listed and where its limits are.
2. Traced the Claude command mirror to its generator and counted the hidden siblings.
3. Read the one-turn runner's runtime table and Codex argv, then checked the Codex trust surface in the arena and the home config.
4. Loaded the first six pre-arm sessions per runtime through the shared session readers and counted `Advisor:` / `COMMAND:` occurrences in normalized records; then repeated the check against the raw Claude and Codex transcript files.
5. Re-read the live run log's row counts to see whether the arm is still growing.

## Findings

1. **G5's blast radius is exactly one namespace and twelve commands.** Only `create` carries a lowercase `skill.md` under `.skilled/commands`; its mirror is a folder-preserving symlink at `.claude/commands/create/skill.md` created by `sync-runtime-mirrors.cjs`. The folder holds 12 sibling commands, so the shadow costs all 12 Claude names, not one. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:202] [SOURCE: .claude/commands/create/skill.md:1] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt:3]

2. **The G5 experiment does not prove the defect on the real mirror path.** Its listing mixes built-in skills (`dataviz`, `init`, `security-review`) with the `create` entries, so the tested folder behaved as a skill folder; whether `.claude/commands/create/skill.md` shadows the same 12 names is not established by the artifact. The cheap decisive test is one throwaway repo with `CLAUDE_CONFIG_DIR=$(mktemp -d)` and two listings, with and without the basename. Reproduce before changing layout. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/listing-a.txt:1] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/listing-b.txt:1]

3. **Codex's pre-arm is missing its brief for a harness reason, not a model reason.** The repo turns hooks on, but Codex runs a project hook only after the exact entry is approved and stored as `trusted_hash` in `~/.codex/config.toml`; the arena paths under `/private/var/folders/.../skilled-behaviour-arenas/` have no project entry there. The runner passes no `CODEX_HOME` and no trust setting. Six of six raw Codex transcripts contain no `Advisor:` line, so Codex's 0/12 measures a session with no advisor, and it cannot be compared with a runtime that got one. [SOURCE: .codex/config.toml:3] [SOURCE: .codex/README.md:54] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:136]

4. **The scorer cannot see the brief on the runtimes that inject it out of band.** The raw Claude transcripts contain `Advisor:` in 6 of 6 sampled sessions, while the normalized records the scorer reads contain it in 0 of 6; Pi's in-prompt injection is visible in 6 of 6, and OpenCode's hook context in 1 of 6. So a `started` fact is attributable to the brief on no runtime, and a `declined` judgment is unsupported everywhere. A start rate can move for reasons other than surfacing and the current summary would not show it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:325] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:646]

5. **The pre-arm log is still being written while it is being scored.** In the minutes between iteration 1 and this check the row counts moved from 24/24/24/13/10/10 to 24/24/24/15/13/11 (claude/codex/pi/devin/opencode/dsh). Any `--summary` number is a snapshot of a moving arm, and a before/after comparison built now would compare different row sets. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl:1] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/tasks.md:113]

## Ruled Out

- **"Codex declined the command."** It never received a brief in the arena: hooks are unapproved there and no `Advisor:` line exists in any sampled Codex transcript. [SOURCE: .codex/README.md:54]
- **"A `COMMAND:` line proves the model saw an offer."** DSH emitted two `COMMAND:` tokens in six sampled sessions with no advisor row enabled, so the token can appear without a brief. [SOURCE: .dsh/plugins/repo-guards/index.mjs:53]

## Dead Ends

- A G5 fix cannot be verified from the existing artifacts; the definitive listing needs a throwaway repo and a temporary `CLAUDE_CONFIG_DIR`. Recording it as the verification step is more honest than treating the stand-in folder as the real path.
- The scorer's `normalize` discards hook context for Claude, so post-processing transcripts cannot recover "was it offered" without either reading raw prompt records (runtime-specific) or recording the brief at hook time.

## Edge Cases

- **Ambiguous input:** "G5 confirmed" in `result.txt` is confirmed for a stand-in folder, not for `.claude/commands`. Recorded as a verification gap, not a contradiction.
- **Contradictory evidence:** none.
- **Missing dependency:** the arena's Codex trust state is outside the repo; the evidence is the absence of an arena project entry in `~/.codex/config.toml` plus 0/6 raw-transcript `Advisor:` hits.
- **Partial success:** the layout recommendation is conditional on reproduction; the measurement recommendations are unconditional.

## Questions Answered

- Q4: How must command files be laid out and installed so a fresh external repository exposes every command on every runtime, given the g5 skill.md folder-shadowing result? — Answered with a reproduce-first rule: only `create/skill.md` is affected, the mirror path is the suspect (not proven), and the fix must be a Claude-only rename plus a per-runtime name map, verified by a listing diff.
- Q5: What is the cheapest reliable way to measure start rate across six runtimes without running pi, ollama, or the full test suite? — Answered: three scorer fields (`armComplete`, `uncappedStartRate`, `offered→started`) plus a prepared `CODEX_HOME`; verify with one Codex smoke run and one fixture.

## Questions Remaining

3 of 5: the raise-start-rate change (Q3), plus confirmation of Q4's reproduction and Q5's fixture once implemented.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/listing-a.txt`, `listing-b.txt`, `result.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/tasks.md`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`
- `.skilled/hooks/shared/session-readers/index.mjs`
- `.codex/config.toml`, `.codex/README.md`, `~/.codex/config.toml`
- `.claude/commands/create/skill.md`, `.skilled/commands/create/skill.md`
- `steer.md`

## Assessment

- New information ratio: 0.9
- Questions addressed: Q4, Q5
- Questions answered: Q4, Q5

## Reflection

- What worked and why: checking the raw transcript against the normalized one exposed a blind spot the scorer design hides; reading the runner's argv exposed the Codex trust gap that a rate alone would have blamed on the model.
- What did not work and why: the G5 artifact could not be tied to the real mirror path; the verification is named instead of assumed.
- What I would do differently: read the G5 listing before treating its cause as settled in iteration 1.

## Recommended Next Focus

Iteration 3: the raise-start-rate change itself. Use the brief as it will render after 005 and the Gate 2 bullet after 006, and identify the one post-008 change with the largest expected gain per runtime, with a measured or bounded number and a verification that does not need a full six-runtime arm.
