# Iteration 3: /doctor:update surface contract audit

## Focus

Q3 only (other iterations cover Q1, Q2, Q4 and Q5 concurrently, so stay on Q3): check .skilled/commands/doctor/update.md and doctor-update-presentation.txt against the sk-create-command contract in .skilled/skills/sk-doc/sk-create-command/ (thin router, presentation split, argument-hint, allowed-tools, approval gates, dry-run, rollback) and against the three doctor-update-*.yaml workflows. Report every contract violation and every place the router, presentation and workflows disagree, with file:line evidence.

## Actions Taken

1. Read the current research config, strategy, state log, registry, and prior iteration artifact. The prompt assigns Q3 for this iteration. Iteration 1 also recorded Q3 and already identified the base-recording wording duplication and prerelease input declaration gap, so those findings are not repeated here.
2. Loaded the system-deep-loop research protocol, system-spec-kit research artifact ownership rule, and sk-create-command frontmatter, router, presentation, and destructive-action contracts.
3. Read the /doctor:update router, presentation contract, all three workflow YAML files, and the machine-readable doctor command contract. Checked the declared tool grants and measured the router argument hint at 139 characters.
4. Compared approval, dry-run, cancellation, rollback, and read-only descriptions across the router, presentation, and workflows. This was a static contract audit. No tests were run.

## Findings

### P2: Cancellation is recorded as a decline

The apply presentation maps no, cancellation, ambiguity, or interruption to STATUS=DECLINED at .skilled/commands/doctor/assets/doctor-update-presentation.txt:212. The apply workflow's terminal status list has no cancelled value at .skilled/commands/doctor/assets/doctor-update-apply.yaml:197-203. The sk-create-command destructive-action contract requires STATUS=CANCELLED ACTION=cancelled on user abort at .skilled/skills/sk-doc/sk-create-command/SKILL.md:367-381. The doctor command contract marks apply as a gated mutating operation at .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:241-244. This makes cancellation indistinguishable from an explicit refusal and violates the command-authoring status contract.

### P2: Apply dry-run claims no writes but writes a state log

The apply workflow says dry_run_writes_nothing at .skilled/commands/doctor/assets/doctor-update-apply.yaml:31-35, then requires a state log on every terminal path including dry-run at lines 191-195. The presentation prints the state-log path in its apply result at .skilled/commands/doctor/assets/doctor-update-presentation.txt:320 and says dry-run stops after the plan at line 212. State explicitly that dry-run skips release-managed targets, lock, and rollback writes while still writing the audit log, or omit the dry-run state log.

### P2: Router argument metadata differs from the canonical command contract

The shipped hint includes --include-prerelease and measures 139 characters at .skilled/commands/doctor/update.md:3. That is within the sk-create-command limit of 140 characters at .skilled/skills/sk-doc/sk-create-command/SKILL.md:214-219. The canonical doctor argument_hint omits --include-prerelease at .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:200-203, even though the router accepts it. Update the canonical hint so generated or contract-driven surfaces cannot drift from the router.

### P2: The tool grant includes two unexplained capabilities

The router grants Read, Bash, Grep, and Glob at .skilled/commands/doctor/update.md:4. Grep and Glob do not appear as tool calls in the router or the check, align, and apply workflows. The sk-create-command rules require only actual tools and prohibit broad grants without a reason at .skilled/skills/sk-doc/sk-create-command/SKILL.md:217-220. Remove Grep and Glob unless the workflow has a documented need.

### P2: “Read-only” does not disclose Git metadata writes

The router calls bare /doctor:update a read-only check at .skilled/commands/doctor/update.md:16. The check workflow permits git fetch to write the Git object store and FETCH_HEAD when needed at .skilled/commands/doctor/assets/doctor-update-check.yaml:17-24 and 61-69. The router summary narrows the promise to no checkout-file changes at line 64, but the presentation only lists --offline and does not explain that exception at .skilled/commands/doctor/assets/doctor-update-presentation.txt:23-31. Qualify read-only as working-tree read-only and explain that a normal check can fetch missing objects and update Git metadata.

## Questions Answered

- Q3: Do update.md and doctor-update-presentation.txt meet the sk-create-command contract (thin router, presentation split, approval gates, dry-run, rollback), and do they agree with the workflows?

## Questions Remaining

- Q1: Does each workflow (check, align, apply) promise only what release-update.cjs actually does: flags, exit codes, outputs, unit keys, locking, rollback?
- Q2: Does release-update.cjs behave correctly in real operator scenarios (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback), and does a test cover each?
- Q4: Is customization handling sound end to end: base recording, three-way merge, provenance, hashes; align never writes skill bodies; apply applies only accepted decisions?
- Q5: What else blocks a safe end-to-end update for an operator (install and sync scripts, post-apply rebuild and reindex, docs, recovery), ranked by severity?

## Next Focus

Q3 is answered for this iteration. Return to the lineage scheduler for its next assigned question. Do not infer a new Q3 scope while Q1, Q2, Q4, and Q5 are assigned to other iterations.

## SCOPE VIOLATIONS

- scope_violation: The append instructions request a one-line temporary event file, but the explicit write allowlist excludes temporary files. No temporary file will be created. The canonical record will be passed to the required append gateway through /dev/stdin instead.

