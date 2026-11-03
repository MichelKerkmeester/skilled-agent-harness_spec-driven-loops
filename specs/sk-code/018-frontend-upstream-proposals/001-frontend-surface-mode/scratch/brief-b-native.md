GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are @markdown, a LEAF template-first documentation executor. Load `sk-doc` before
writing markdown. Write only the files named below. Never dispatch another agent or another codex.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.

ROLE: Port the React Native part of a frontend reference set into Skilled as stack-agnostic docs.

CONTEXT:
- Sources (read-only): `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/scratch/source/`
- Target folder (exists): `.skilled/skills/sk-code/sk-code-frontend/references/`
- `frontend-practice.md` in the target folder already links to these files; read it, do not edit it.

ACTION: Create exactly these 6 files in the target folder, one per same-named source file:
react-native-layout-and-a11y.md, native-accessibility.md, native-layout-and-text.md,
native-inputs-and-keyboard.md, native-lists-and-motion.md, native-platform-differences.md

Rules, applied to every file:
1. Keep every technical rule, section number, heading and anchor. Each file stays at 215 lines or fewer.
2. Remove everything project-specific: the word "Barter", `@barter-bv`, every repository or app name
   (fe-creators-mobile, barter-expo, fe-ui-components, ui-react-native), Expo SDK pins tied to one app,
   and any "PASS" verdict for an app.
3. Rewrite each `**Support.**` line to name versions, never apps. Use this shape:
   `**Support.** Checked against React Native 0.83 documentation and source. React Native 0.76 is inferred, not verified.`
   Keep a library and its version when the rule depends on it (for example FlashList 2 or Reanimated 4),
   and keep any "unconfirmed" caveat, rewritten without an app name.
4. Rewrite the intro "Support figures are from..." sentence the same way: the React Native 0.83
   documentation and source, checked 2026-11-03, with 0.76 inferred.
5. Frontmatter: keep the keys, set `version: 1.0.0.0`, and make every trigger phrase multi-word with no project name.

FORMAT (report): for each file, its line count; then any Support line you kept a caveat on.

VERIFY before the status line, and paste the output:
- `rg -n -i "barter|@barter-bv|creators-mobile|barter-expo|ui-components|ui-react-native|expo sdk|: pass" .skilled/skills/sk-code/sk-code-frontend/references/` prints nothing.
- `wc -l .skilled/skills/sk-code/sk-code-frontend/references/*.md` shows every file at 215 or fewer.
