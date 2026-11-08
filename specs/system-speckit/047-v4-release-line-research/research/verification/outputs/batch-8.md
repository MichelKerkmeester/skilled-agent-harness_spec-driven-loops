### V56
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:37` - lists `agent_roster`; `:140` says it checks roster coverage. `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:41` - `.claude/agents` is canonical; `:60` - authored surfaces check presence, “never content equality.” `.skilled/bin/lib/mirror-sync-verify.cjs:349` - the separate checker compares tool surfaces.
COMMAND: `rg -n "check-agent-mirror-sync" .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` -> exit 1
CORRECTED CLAIM: -

### V57
VERDICT: CONFIRMED
SEVERITY: propose P2 because the failure occurs when the target is the source checkout itself, which the engine explicitly forbids.
EVIDENCE: `.skilled/commands/doctor/assets/doctor-install.yaml:59` - runs `check --root <dir>` without `--source`; `.skilled/commands/doctor/scripts/symlink-engine.cjs:68` - defaults the source to `SCRIPT_ROOT`; `:289` - rejects roots that contain one another. The probe printed `ERROR: root and source must not contain one another`.
COMMAND: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "$PWD"` -> exit 2
CORRECTED CLAIM: -

### V58
VERDICT: CHANGED
SEVERITY: propose P2 because the checklist omission is real, but fresh linked projects still resolve and enforce the shipped rules.
EVIDENCE: `INSTALL-SKILLED.md:114` - step 1 links `.skilled`; `:117` - step 4 is `/doctor:git setup`. `.skilled/commands/doctor/assets/doctor-install.yaml:60` also omits standards initialization. `.skilled/scripts/git-hooks/lib/message-contract-gate.sh:76` - checks `.skilled/skills/sk-git/assets`; `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:300` - validator uses the same fallback.
COMMAND: `node .skilled/skills/sk-git/scripts/validate-message.mjs --explain` -> exit 0
CORRECTED CLAIM: The install checklist omits `/doctor:git standards` initialization, but a fresh linked project still enforces shipped commit rules through `.skilled/skills/sk-git/assets`.

### V59
VERDICT: REFUTED
SEVERITY: propose P2 because both paths resolve the same shipped assets, so the claimed enforcement mismatch is absent.
EVIDENCE: `.skilled/scripts/git-hooks/lib/message-contract-gate.sh:78` and `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:300` - both include `.skilled/skills/sk-git/assets`. `.skilled/scripts/git-hooks/commit-msg:94` - runs the validator after the Commit-Id check. `--explain` reported commit rules enforced from that assets directory.
COMMAND: `node .skilled/skills/sk-git/scripts/validate-message.mjs --explain` -> exit 0
CORRECTED CLAIM: -

### V60
VERDICT: REFUTED
SEVERITY: propose P2 because the changed-file gates catch mirror-only Claude files, and `Explore` is an explicit exception.
EVIDENCE: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:37` - Claude agents are the deliberate source for Cursor and Devin; `:192` - defines their mirror links. `.github/workflows/agent-mirror-sync.yml:69` collects changed Claude agent paths and `:74` passes them to the checker. `.skilled/bin/check-agent-mirror-sync.cjs:98` detects a Claude mirror with no OpenCode canonical; `:39` explicitly excludes `Explore`. `ls -l .cursor/agents` showed symlinks into `.claude/agents`.
COMMAND: `nl -ba .github/workflows/agent-mirror-sync.yml | sed -n '66,76p'` -> exit 0
CORRECTED CLAIM: -

BATCH DONE