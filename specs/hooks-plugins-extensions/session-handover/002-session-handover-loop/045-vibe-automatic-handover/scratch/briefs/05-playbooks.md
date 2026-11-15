REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/406-vibe-automatic-handover
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/045-vibe-automatic-handover

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE
You are the markdown agent: you write manual testing playbook scenarios. First read
`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/README.md` and
`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md`.

CONTEXT
Mistral Vibe now hands over automatically. Started through `skilled-loop vibe` with
`SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1`, a session is nudged once its journal's measured
`input_tokens` pass the threshold share of Vibe's `compaction_threshold` (`SESSION_HANDOVER_THRESHOLD`,
`SESSION_HANDOVER_WINDOW_TOKENS` override it), at a turn start or after a tool call. It writes the note
and prepares the record, the `post_agent` turn-end part arms it and starts the killer, Vibe exits 0 on
SIGTERM, and the wrapper relaunches `vibe` on the claim seed, which the next turn start expands into
the claim instructions. An operator prompt typed after the arm withdraws the hand-over
(`withdrawn` in the relaunch log, no relaunch). With the switch off, or when the operator types
`/speckit-handoff` by hand (Vibe gives tools no session id, so that record is not armed), the old
manual tier applies: the wrapper prints the claim command. Code: `.skilled/hooks/session-handover/vibe/handover-parts.mjs`,
test `node --test .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs`.

ACTION
1. Create `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/relaunch-automatic-tier-conversation.md`
   as scenario `VIB-HK-027`, "The automatic relaunch tier nudges, ends and relaunches a Vibe session".
   Copy the structure of `relaunch-manual-tier-conversation.md` in the same folder exactly. Its
   preflight turn probes that `.skilled/hooks/session-handover/vibe/handover-parts.mjs` exists, then
   exits 77 with a blocker sentence (the runner cannot run the wrapper). The procedure runs
   `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1 SESSION_HANDOVER_THRESHOLD=0.05 SESSION_HANDOVER_WINDOW_TOKENS=100 SESSION_HANDOVER_MAX_HOPS=1 bash .skilled/bin/skilled-loop vibe --trust --agent auto-approve "<task>"`
   and passes when the relaunch log shows `prepare`, `killer-signal` and `relaunch reason=ready`
   and the note reaches `status: done`.
2. Edit `relaunch-manual-tier-conversation.md`: say the manual tier is now the fallback (switch off,
   or a hand-typed `/speckit-handoff`), and change its preflight probe from the
   `session-lifecycle/vibe` grep to a check that prints `automatic-tier-present` when
   `.skilled/hooks/session-handover/vibe/handover-parts.mjs` exists. Update its Expected text to match.
3. In that folder's root `manual-testing-playbook.md`, add the `VIB-HK-027` line after `VIB-HK-026`
   in both lists, and change every `VIB-HK-026` range end (`VIB-HK-001..VIB-HK-026`,
   `VIB-HK-001` to `VIB-HK-026`) to `VIB-HK-027`.
4. Create `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-vibe.md`,
   copying the structure and frontmatter shape of `session-handover-command-runtimes.md` beside it,
   with one automatable check (the test command above) and three live checks: VB-1 a full hop,
   VB-2 a withdraw (type a prompt within two seconds of the arm), VB-3 the switch off prints the
   claim command. Add its row to the table in `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`
   right after the `session-handover-command-runtimes` row, same columns.
5. In `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md`:
   add the trigger phrase `"Vibe session handover"` after `"Devin session handover"`, and in the
   line that says which runtimes run automatically, add Vibe to the automatic list (seven runtimes).

Rules: plain sentences, no em dashes, no semicolons. Never name a spec folder, phase or packet number
in new text. Do not touch any other file.

FORMAT
Run `python3 .skilled/skills/sk-doc/scripts/validate_document.py <file>` on each new file, then `rg -c "VIB-HK-027" .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md`.
End your reply with those outputs and the list of files you changed.
