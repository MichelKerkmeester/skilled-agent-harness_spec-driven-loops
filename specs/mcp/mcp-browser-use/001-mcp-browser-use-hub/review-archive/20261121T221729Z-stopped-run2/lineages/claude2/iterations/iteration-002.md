# Iteration 002 - Security: Bladebro mode, MCP wiring, installer guards

## Dispatcher

- Lineage: claude2, session fanout-claude2-1795298930568-k8qdqy, generation 1
- Dimension: security
- Sources read this iteration: lineage `steer.md` (absent), strategy Next Focus from iteration 1.
- Review focus coverage: covers the "Bladebro stealth-browser mode" commit (bcc330cb2b5) and the trust-boundary parts of the mode relocation commit (installer paths, mutation-class guard, pre-commit trigger), as the operator focus names both.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:15-140`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:1-88`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md:1-89`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md:12-98`
- `.utcp_config.json:31-46` (new `bladebro` manual)
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`, `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:121-134`, `.skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh:141-179`
- `.skilled/scripts/git-hooks/pre-commit:632`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:392` (only edit in the moved installer)
- Benchmark reports under `mcp-bladebro/benchmark/reports/`, `mcp-aside-devtools/benchmark/reports/`, `mcp-chrome-devtools/benchmark/reports/` (secret scan)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Bladebro lane rule makes an unpinned `npx -y bladebro mcp` the fallback when the binary is missing, contradicting R-SEC-3** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:60` -- The lane rule says to use the MCP lane "with `bladebro mcp` (or `npx -y bladebro mcp`) when the binary is unavailable", and the decision tree at `SKILL.md:69` routes "binary missing" to "bladebro manual via call_tool_chain()". The registered manual (`.utcp_config.json:38`) runs `bladebro` from PATH, so when the binary is missing the only working branch is `npx -y bladebro mcp`. That fetches and runs the latest `bladebro` from npm (no `@4.8.2` pin, no SHA-256 sidecar check) without an operator yes. The same file's R-SEC-3 (`SKILL.md:116`) and NEVER rule 1 forbid implicit install and require the pin plus digest, and `references/mcp-wiring.md:61` says the npx form "is an install under R-SEC-3 and needs an operator yes". The operational step an agent follows contradicts the packet's own supply-chain rules for a third-party stealth browser that drives signed-in profiles.
   Finding class: supply-chain guidance contradiction
   Scope proof: SKILL.md added by commit bcc330cb2b5 on this branch
   Affected surface hints: mcp-bladebro/SKILL.md lane rule (line 60) and decision tree (line 69); ROUTER.md if it mirrors the lane rule; mcp-wiring.md:61 already has the correct wording
   Case: on a host without the global binary, an agent following the lane rule runs `npx -y bladebro mcp`, executing an unpinned, unverified npm package with no operator approval.

```json
{"type":"supply_chain","claim":"The Bladebro lane rule names unpinned npx execution as the binary-missing fallback, which contradicts R-SEC-3 and NEVER rule 1 in the same file.","evidenceRefs":[".skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:60",".skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:69",".skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:116",".skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md:61",".utcp_config.json:38"],"counterevidenceSought":"Checked whether R-SEC-3, NEVER rule 1 or mcp-wiring.md gate the npx path: they do, but the lane rule itself does not reference them and the decision tree has no operator-yes branch for binary-missing; the 'Neither works' bullet at SKILL.md:61 applies only after the MCP lane also fails.","alternativeExplanation":"Authors may intend R-SEC-3 to govern every install, so a careful agent reading the whole file would stop; the npx mention may be informational.","finalSeverity":"P1","confidence":0.7,"downgradeTrigger":"Downgrade to P2 if the lane rule is amended to say npx needs an operator yes and a pinned version, or if the hub-level contract shows Code Mode never launches npx manuals without approval."}
```

### P2 Findings

1. **Bladebro R-SEC-1 carries an Aside-only rule** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:112` -- The Bladebro signed-in-profile rule says "Never pass `--account` to `aside mcp` or `aside repl`", a rule for a different mode's CLI. It does not state the Bladebro equivalent (which flag or env selects an account). An agent reading only the Bladebro packet gets no account-selection guard for Bladebro itself.
   Finding class: misplaced security rule
   Scope proof: SKILL.md added on this branch
   Affected surface hints: mcp-bladebro/SKILL.md R-SEC-1; mcp-aside-devtools/SKILL.md owns the Aside rule
   Case: an agent driving `bladebro rb profile` reads R-SEC-1 for the account guard and finds only an instruction about Aside's `--account` flag.

## Traceability Checks

- `checklist_evidence` (partial): the mutation-class guard covers the new hub segment in all three places (hook regex `pre-commit:632`, guard `HOOK_PATTERN` and `DISCOVERY_GLOBS`, manifest `skill_dir` rows) and the new test reads the hook's own regex, so a dropped segment fails. Running `check-mcp-mutation-class.sh` returned `GUARD PASS` (exit 0). Bladebro ships no install or doctor script, so it needs no manifest row.
- `playbook_capability` (partial): `install-and-verify.md:14` says "None of it has run on this host", yet `bladebro` resolves on this host (`command -v bladebro` returns an nvm global path) and the `2026-11-21--manual-testing-playbook--macos-live` report records the install and probes. Carried to the traceability iteration.

## Integration Evidence

- `.utcp_config.json` registers `bladebro` with `command: bladebro`, `args: [mcp]`, `env: {}` (stdio), matching `mcp-wiring.md:36-53`.
- `check-mcp-mutation-class.sh` (run, read-only): GUARD PASS.

## Edge Cases

- Benchmark reports reference copying the operator's signed-in Aside `Default` profile (cookie-only copy) for one real-browser probe (`macos-live/README.md:42,240`). The report states the operator lifted the limit and no cookie values are recorded; a secret scan of the new reports found no credential values, tokens or emails. Not raised.
- The real-browser `clone` lane failing is a capability result, not a security defect.

## Confirmed-Clean Surfaces

- Moved Chrome DevTools installer: only a doc-path echo changed (`install.sh:392`).
- No stale `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` path remains in live code (only in historical benchmark JSON).
- Consent checklist for real-browser lanes (`browser-lanes.md` §5) and the terminal `blocked:` rule (R-SEC-2) are present.

## Ruled Out

- Secrets in committed benchmark reports: ruled out by pattern scan (cookie/token/password/bearer/email).
- Mutation-class guard missing the new hub path: ruled out, hook, guard and manifest updated together and the guard passes.

## Next Focus

- Dimension: traceability
- Focus area: packet docs (spec.md, goal.md, decision-record.md, phase 002-006 spec/tasks/implementation-summary/acceptance-criteria) against the shipped hub; SKILL.md/ROUTER.md/README of the hub; graph-metadata.json and description.json; feature catalog and playbook wiring; stale "not run on this host" claims
- Reason: the verification phase claims alignment findings were closed; check that claim against files
- Rotation status: correctness (1), security (2) done; traceability, maintainability remain
- Required evidence: file:line on both sides of each mismatch

Review verdict: CONDITIONAL
