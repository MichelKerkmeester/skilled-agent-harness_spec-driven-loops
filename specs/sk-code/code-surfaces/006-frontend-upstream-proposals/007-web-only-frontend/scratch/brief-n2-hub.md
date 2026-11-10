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


PERSONA: You are @code, a LEAF implementation agent. Load `sk-code` first and follow the surface it selects (SKILLED).
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Remove React Native from the sk-code hub. The operator removed it from canonical Skilled: React Native surfaces live in a project fork.

H = `.skilled/skills/sk-code`

ACTION:
1. `H/ROUTER.md`: remove the six native intents (`FRONTEND_NATIVE`, `NATIVE_A11Y`, `NATIVE_LAYOUT_TEXT`, `NATIVE_INPUTS`,
   `NATIVE_LISTS_MOTION`, `NATIVE_PLATFORM`) from `INTENT_SIGNALS` and `RESOURCE_MAP`, and the six resource-table rows naming
   `sk-code-frontend/references/react-native-layout-and-a11y.md` or `sk-code-frontend/references/native-*.md` (~lines 165-170).
   Keep the dict blocks valid and their keys equal.
   Replace the ownership sentence (~line 195) with:
   `Canonical sk-code owns the SKILLED surface, the `sk-code-ci` GitHub Actions surface and the stack-agnostic `sk-code-frontend` surface for web practice. Go, Next.js server code and React Native surfaces live in a project fork.`
   Replace the DO NOT line (~line 219) with: `- Load Go, Next.js server code or React Native resources from canonical sk-code; those live in a project fork`
   Any other sentence that says the frontend surface carries React Native or native practice: make it say web practice.
2. `H/hub-router.json` and `H/mode-registry.json`: from the `sk-code-frontend` alias list remove exactly these nine phrases:
   `react native layout`, `react native accessibility`, `react native text scaling`, `react native keyboard avoidance`,
   `react native reduced motion`, `react native scroll performance`, `react native flatlist`, `accessibility labels`,
   `ios android platform difference`. Keep the JSON valid and every other alias in order.
3. `H/SKILL.md` (~lines 44, 50, 122), `H/README.md` (~line 56), `H/description.json` (`frontend (web, React Native and Figma-to-code)`
   becomes `frontend (web and Figma-to-code)`), `H/shared/references/phase-detection.md` (~lines 106, 147: drop the native layer and
   `na*` topic options), `H/shared/references/universal/code-quality-standards.md` Frontend row (`Web, React Native and Figma-to-code
   practice` becomes `Web and Figma-to-code practice`): describe the frontend surface as web practice plus the Figma-to-code check.
4. Unsupported stacks: in `H/shared/references/universal/code-quality-standards.md` UNKNOWN row, `does not own Go, React/Next.js server code, generic Node.js or Swift.`
   becomes `does not own Go, React/Next.js server code, generic Node.js, React Native or Swift.`; in
   `H/manual-testing-playbook/surface-detection/unknown-fallback.md` (~line 11) remove "and React Native" from the supported list and add
   React Native to the unsupported list.
5. `H/manual-testing-playbook/compiled-routing/surface-alone-frontend-compiled-routing.md`: change the prompt everywhere it appears to
   `fix the keyboard focus order in this web form`, the title to `sk-code keyboard focus fix in a web form routes the frontend surface alone`,
   and set `expected_resources` / `expected_leaf_resources` to exactly the resources `WEB_A11Y` maps to in
   `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` `RESOURCE_MAP` (read it). Remove every React Native mention in the file.
6. `H/changelog/v3.10.0.0.md` is unreleased: make every bullet say the surface carries web practice and the Figma check, not React Native.
7. `H/sk-code-review/README.md` (~line 165): `frontend web or React Native terms` becomes `frontend web terms`.

ALLOWED WRITE PATHS: `H/ROUTER.md`, `H/hub-router.json`, `H/mode-registry.json`, `H/SKILL.md`, `H/README.md`, `H/description.json`,
`H/shared/references/phase-detection.md`, `H/shared/references/universal/code-quality-standards.md`,
`H/manual-testing-playbook/surface-detection/unknown-fallback.md`, `H/manual-testing-playbook/compiled-routing/surface-alone-frontend-compiled-routing.md`,
`H/changelog/v3.10.0.0.md`, `H/sk-code-review/README.md`. Do NOT edit `H/graph-metadata.json`, `H/leaf-manifest.json` or anything under `H/sk-code-frontend/`.

BANNED OPERATIONS: no `git` command; `rm` only on the files this brief names for deletion; no run of any generator with `--write`, no `compiled-route-sync.cjs`, no manifest refresh (the caller republishes); no edit outside the allowed paths; no installs; no network. No text names a spec folder, phase, task or finding id, and none names Barter. Never write an em dash. Keep every web intent, web keyword, web resource row and web sentence exactly as it is.

VERIFY, paste each command with output and exit code:
- `for f in hub-router.json mode-registry.json description.json; do node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-code/'+process.argv[1],'utf8'))" $f && echo "$f ok"; done`
- `rg -n -i "react native|NATIVE_|native-" .skilled/skills/sk-code --glob '!sk-code-frontend/**' --glob '!graph-metadata.json' --glob '!leaf-manifest.json'` (expect only the unsupported and project-fork lines)
- `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/manual-testing-playbook`
- `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code`
