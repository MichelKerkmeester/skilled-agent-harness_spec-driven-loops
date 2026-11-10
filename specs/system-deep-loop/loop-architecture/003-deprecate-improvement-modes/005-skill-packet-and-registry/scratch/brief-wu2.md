GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/005-skill-packet-and-registry
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You remove two retired modes from the deep-loop hub's JSON registries. Nothing else.

Removed modes: `agent-improvement` and `model-benchmark`. Their packet `deep-improvement`, agent `deep-improvement`, commands `/deep:agent-improvement` and `/deep:model-benchmark`, and backend kind `improvement-host` are all gone. The remaining modes are `research`, `review` and `ai-council`, all on backend `runtime-loop-type`.
All paths are under .skilled/skills/system-deep-loop/. Keep each file's formatting and key order; JSON must stay valid.

1. mode-registry.json
   - Delete the two objects in `modes` whose `workflowMode` is `agent-improvement` and `model-benchmark`.
   - In `discriminator`: `runtimeLoopType` text, delete the sentence `Explicit null for improvement-host modes;` (keep `NEVER inferred from workflowMode.`). `backendKind` text becomes: `Which backend actually runs the mode: runtime-loop-type (runtime/ convergence).`
   - In `advisorRoutingContract`: `advisorDefaultMode` drop the example `(deep-improvement -> agent-improvement)`; `packetSkillName` drop the sentence about the two improvement lanes sharing one packet. Leave every other key's text alone.
2. hub-router.json: remove both modes from `tieBreak`, delete their two route entries (lines ~36-45) and the two classes `agent-improvement-aliases` and `model-benchmark-aliases` (lines ~57-62).
3. command-metadata.json: it is an array of five command objects. Delete the two whose `command` is `/deep:agent-improvement` and `/deep:model-benchmark`.
4. description.json: remove `deep-improvement`, `agent-improvement`, `model-benchmark` and `improvement-host` from its arrays; in `description` change `routing to five modes across four workflow families` to `routing to three modes across three workflow families` and drop any other mention of the removed modes in that sentence.
5. graph-metadata.json: remove every array item that is `deep-improvement`, `agent-improvement`, `model-benchmark` or a path into `deep-improvement/`; in `causal_summary` drop `, deep-improvement` from the persona list.
6. shared/rollout/command-injection-rollout.json: delete the `deep/agent-improvement` and `deep/model-benchmark` keys (fix the trailing comma).
7. Regenerate the leaf manifest (do not hand-edit it):
   node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/system-deep-loop

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- Do not put spec paths, phase numbers or ticket ids in code comments.
- Do not touch `.skilled/skills/system-deep-loop/runtime/`, `.skilled/skills/system-skill-advisor/` or any file not named in this brief.
- ALLOWED WRITE PATHS: the seven files above plus leaf-manifest.json (written by the generator only).

VERIFY (run these; report each exit status)
  for f in mode-registry hub-router command-metadata description graph-metadata leaf-manifest shared/rollout/command-injection-rollout; do node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/system-deep-loop/$f.json','utf8'))" || echo "BAD $f"; done
  node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/system-deep-loop
  rg -n -i "agent-improvement|model-benchmark|deep-improvement|improvement-host" .skilled/skills/system-deep-loop/{mode-registry,hub-router,command-metadata,description,graph-metadata,leaf-manifest}.json .skilled/skills/system-deep-loop/shared/rollout/command-injection-rollout.json

HANDBACK: list every file you changed, then each VERIFY command with its exit status and output. The last rg should print nothing.
