GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @markdown, a LEAF documentation agent. Load `sk-doc` first and follow the mode it selects.
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Make the `sk-code-frontend` packet web-only. The operator removed React Native from canonical Skilled: React Native surfaces now live in a project fork.

P = `.skilled/skills/sk-code/sk-code-frontend`

ACTION:
1. Delete these seven files: `P/references/react-native-layout-and-a11y.md`, `P/references/native-accessibility.md`,
   `P/references/native-layout-and-text.md`, `P/references/native-inputs-and-keyboard.md`, `P/references/native-lists-and-motion.md`,
   `P/references/native-platform-differences.md`, `P/manual-testing-playbook/frontend-surface/frontend-native.md`.
2. `P/ROUTER.md`: remove the intents `FRONTEND_NATIVE`, `NATIVE_A11Y`, `NATIVE_LAYOUT_TEXT`, `NATIVE_INPUTS`, `NATIVE_LISTS_MOTION`,
   `NATIVE_PLATFORM` everywhere they appear (prose bullets, the `INTENT_SIGNALS` dict, the `RESOURCE_MAP` dict, any table, any
   default or fallback list), and every row naming a deleted file. Keep the Python-dict blocks syntactically valid (no trailing comma
   problems), and keep the remaining keys of `INTENT_SIGNALS` and `RESOURCE_MAP` equal.
3. `P/references/frontend-practice.md`: it becomes the core page for web practice. Remove the native layer row, the "Native topic files"
   table, every link to a deleted file and every "native" clause, keeping each principle's web wording and web links. Describe the
   layers as the web layer plus the project-specific layer.
4. `P/references/figma-to-code.md`: drop the "React Native, where it differs" column from the construct table, drop every "Native:"
   clause from the five-pass table, and drop the "Figma Check on Native" link. Every web cell stays as is.
5. `P/SKILL.md`, `P/README.md`, `P/manual-testing-playbook/manual-testing-playbook.md`: describe the surface as stack-agnostic web
   practice plus the Figma-to-code check. Remove every mention of native, React Native, Yoga and the deleted files. The playbook now
   holds two scenarios (web and Figma check): fix every count, table row, wave row and cross-reference index row that named the native one.
   In `SKILL.md` the topic-file count line says six web topic files only.
6. `P/changelog/v1.0.0.0.md` and `P/changelog/v1.0.1.0.md` have never been released: rewrite them so they describe what ships, which is
   the web layer, the topic files, the Figma check and, in v1.0.1.0, the playbook with two scenarios and the three web or Figma aliases
   (`keyboard focus`, `figma frame`, and keep any other web alias as written). Remove every React Native and native mention, the native
   alias names, and fix every count ("Eleven topic references" becomes the web count, "three scenarios" becomes two).

ALLOWED WRITE PATHS: the seven deletions above, and `P/ROUTER.md`, `P/SKILL.md`, `P/README.md`, `P/references/frontend-practice.md`,
`P/references/figma-to-code.md`, `P/manual-testing-playbook/manual-testing-playbook.md`, `P/changelog/v1.0.0.0.md`, `P/changelog/v1.0.1.0.md`.

BANNED OPERATIONS: no `git` command; `rm` only on the files this brief names for deletion; no run of any generator with `--write`, no `compiled-route-sync.cjs`, no manifest refresh (the caller republishes); no edit outside the allowed paths; no installs; no network. No text names a spec folder, phase, task or finding id, and none names Barter. Never write an em dash. Keep every web intent, web keyword, web resource row and web sentence exactly as it is.

VERIFY, paste each command with output and exit code:
- `rg -n -i "react native|react-native|native-|NATIVE_|yoga|\bnative\b" .skilled/skills/sk-code/sk-code-frontend` (expect no hit; report any you left and why)
- `rg -n "\]\((\./)?(references/)?[a-z-]+\.md" .skilled/skills/sk-code/sk-code-frontend -o | sort -u` then confirm every linked file exists
- `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook`
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md`
