GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/006-open-items-and-alignment

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @code, a LEAF implementation agent. Load `sk-code` first and follow the surface it selects (SKILLED).
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Give the router intent-signal generator's orphan pruning the provenance it needs on hubs written before it existed.

ACTION:
1. In G = `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs`, `write()` returns early when
   nothing is missing and nothing is orphaned, and it only records phrases it adds. A hub whose `intent_signals_generated`
   is absent therefore never gains provenance, so a router rename is never reported. Change `write()` so that when a hub's
   `intent_signals_generated` is absent (not an array), it seeds that list with the router-declared phrases already present in
   `intent_signals` (compare lower-cased, keep the `intent_signals` spelling and order), writes, and returns true even when
   nothing is missing. A hub whose list already exists behaves exactly as today. Hand-curated signals that no router declares
   are never added to the list. Add one comment line saying why the seed exists.
2. In `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-router-intent-signals-orphans.test.cjs`, add two cases
   with the file's existing fixture helpers: a hub with no `intent_signals_generated` gains one holding exactly its declared
   phrases after `--write`, and a later router rename of one of them is then reported as an orphan by `--check`.
3. In `.hermes/SYNC.md` line ~24, the present-tense counts "(all 56)" and "(12)" are wrong: count the generated skill copies
   with `ls -d .hermes/skills/*/ | grep -v '/agent-' | wc -l` and the agent mirrors with `ls -d .hermes/skills/agent-*/ | wc -l`
   and write those numbers. Leave the dated "61 of the 68 on 2026-09-15" sentence alone.
4. Update the upgrade note in `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.1.0.md` with one bullet saying the first
   `--write` on a hub without provenance now seeds it from the router-declared phrases.

ALLOWED WRITE PATHS: G, that test file, `.hermes/SYNC.md`, that changelog file.
BANNED OPERATIONS: no `git` command, no `rm`, no run of G with `--write` against the live tree (tests use their own fixtures),
no edit to any other file, no installs, no network calls. No code comment names a spec folder, phase, task or finding id.
Never write an em dash.

VERIFY before the status line, and paste each command with its output and exit code:
- `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-router-intent-signals-orphans.test.cjs`
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` (report its output)
