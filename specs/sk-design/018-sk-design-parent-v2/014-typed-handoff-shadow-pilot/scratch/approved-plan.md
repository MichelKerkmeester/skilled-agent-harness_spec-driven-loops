# Plan: sk-design live fixes + typed-handoff shadow pilot, built by cli-pi (MiMo v2.6 Pro), orchestrated and reviewed here

## Context

The pasted plan proposes a shadow-only `TypedHandoffV1` evaluation for the sk-design compiled-routing hub.
The operator wants every implementation write done by **cli-pi running `llmgateway/mimo-v2.6-pro`**. This
session orchestrates and reviews under the `.claude/agents/orchestrate.md` contract.

I checked the pasted plan against the code. Its direction holds up: shadow-only, one hub, the four-action decision
algebra untouched, and `defaultMode` kept. Eight of its assumptions were wrong or missing (below). The operator
then decided three things:

- **Gate 3 = C:** a new child `specs/sk-design/018-sk-design-parent-v2/014-typed-handoff-shadow-pilot/`. 013 stays untouched.
- **Fix both first:** fix the `compareText` crash and correct rule 6 before the baseline freeze, then take the baseline on the new identity.
- **Workspace:** a new sk-git worktree, `.worktrees/062-typed-handoff-shadow-pilot`. Its number came from `worktree-naming.sh next`.

## Findings that shape this plan (each confirmed by running or reading code)

1. **Rule 6 is not docs-only.** `SKILL.md` is one of four sources hashed into sk-design's policy identity
   (`009-sk-design/lib/registry-compiler.cjs:292-295,419-432`). Serving recompiles from the live bytes
   (`014-runtime-engine/lib/compiled-route.cjs:65,81`), and on a hash mismatch `resolve.cjs:111-117` falls back to legacy.
   The repo already handles this: the pre-commit hook's `gate:route-remint` runs
   `compiled-route-manifest.cjs refresh` whenever a hub `SKILL.md` is staged. It copies the runtime manifest over the authored copy and
   stages both. **For sk-design the generation stays 1 and only the hash changes.** Refresh selects the generation the shadow-child
   snapshot carries (`compiled-route-manifest.cjs:728,763`), and that comes from `canary-cases.v1.json` `activationGeneration: 1`
   (`build-artifacts.cjs:66,185`). My earlier "generation 2" expectation was wrong.
2. **There is a live crash.** `canary-router.cjs:251` calls `compareText`, which is defined only in `registry-compiler.cjs:73` and is a
   one-line comparator. A VALUES/REVIEW tie throws, and the caller silently falls back to legacy. Reproduced:
   `--prompt "design review of the spacing"` returns the legacy sentinel. No test imports `canary-router.cjs`.
3. **The plan puts the new code in the wrong place.** `.skilled/bin/lib/compiled-routing/` (63 tracked files) is the promoted mirror of the authored
   tree `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/`, and `compiled-route-sync.cjs` rebuilds it by swapping the root.
   Engine fixes therefore go in the authored tree and reach the mirror through sync. `.skilled/bin` may not require `specs/`
   (`check-no-spec-imports.cjs`), so the pilot goes off-closure, beside `.skilled/bin/lib/compiled-route-admission.cjs`.
4. **Canonical hashing is closed.** `canonical.cjs` `DOMAIN_TAGS` is frozen, and `hashArtifact` throws on an unknown tag.
   `routeId` = pilot-local `sha256` of a local prefix plus `canonicalBytes(...)`. `canonical.cjs` is not edited.
5. **Drop the synthetic `handoffHops: 1` policy.** It would change the policy hash, and the shared compiler rejects `handoffEdges`.
   The budget becomes an evaluator option, and identity binds to the live selected policy.
6. **Two verification commands are wrong.** The foundation vitest suite needs `--config vitest.config.bin.ts`, and the `compiled-route.cjs` CLI prints no
   clarify or defer payload and no leaf pairs, so those metrics come from `evaluateCanary` in-process.
7. **The corpus is too small for the GO gate as written.** `canary-cases.v1.json` is 8 cases (7 route, 1 reject, 0 clarify, 0 defer) and lives in the closure,
   and the admission test pins 80. Controlled cases go in a pilot-local fixture, rates are reported as n/N, and handoff records are
   fixture-supplied, not inferred.
8. **The docs placement fights a Complete packet.** A `handover.md` inside Complete 013 would become the first document `/speckit:resume` reads for it.
   The 014 answer resolves this.

Known repo-wide gap, not owned here: a re-mint never refreshes `manifest.serving-prior.json`. That fix is planned in
`system-speckit/033/041/019` and not built yet. Consequence: a `flip-serving.cjs --rollback` would restore the old hash, which
the engine no longer builds, and the hub would land on legacy. That end state is safe, but only by accident. The precursor's rollback
below uses `git revert` plus the flag instead.

## Roles and dispatch contract

**Roles.** I decompose, brief, review every diff, run every gate, and hold every stop-for-yes. cli-pi on MiMo writes
all content: code, tests, fixture, the SKILL.md line, and packet docs. I run only deterministic tooling: the worktree,
the scaffold, refresh, sync, probes, validate and git.

**Dispatch.** A direct `pi -p`, because the llmgateway MiMo route is direct-dispatch-only. Run it from the worktree root, in the background:
```
command -v pi && cd .worktrees/062-typed-handoff-shadow-pilot && \
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 MK_SPEC_GATE_ENFORCE=0 PI_BLACKHOLE_PASSIVE=true \
pi -p "$(cat <brief>)" --provider llmgateway --model llmgateway/mimo-v2.6-pro --thinking high \
  --offline --no-session --no-extensions --tools read,bash,edit,write,grep,find,ls \
  </dev/null > <014>/scratch/dispatch-NN.log 2>&1
```
- `--no-extensions` is needed because sk-git provisioning skips `.pi/extensions/*/node_modules`, and one broken extension fails the whole session.
- `high` is MiMo's ceiling on this route.
- **Every brief:**
  - opens with the child-dispatch preamble plus the 014 path;
  - inlines the persona (`.claude/agents/code.md` for code, `markdown.md` for docs);
  - makes **one change**: the file, the literal edit or contract, and the check to run;
  - names what must not be touched.
- **After every dispatch:**
  - confirm the artifact is on disk;
  - grep the log for an A/B/C/D question, `No API key` or `Extension`;
  - read the whole diff against the brief;
  - rerun its check myself;
  - run the comment-hygiene grep on added lines.

  Exit codes are never proof. Three failed re-briefs on one symptom means I stop and escalate.

## Phases

### Phase 0: Workspace, route proof, packet
1. `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create typed-handoff-shadow-pilot` creates
   `worktrees/062-typed-handoff-shadow-pilot` from `main` at `2c8f243607`, provisioned.
   - `.opencode/skills` is a tracked symlink, so it is present.
   - The global pre-commit hook runs per checkout, so the re-mint gate fires in the worktree.
   - None of main's dirty paths overlap this work.
2. **D0 smoke:** `pi -p "reply OK" …` from the worktree. This is the first live proof of the llmgateway MiMo route. Stop if it returns `401`, a `400` model error or an `Extension` error.
3. Load `REPO RULES.md` (Gate 5), sk-code (the code artifact trigger) and system-spec-kit.
   Scaffold 014 with `create.sh --level 2`. `recommend-level.sh` says 1 on size alone. I'm choosing 2 because the precursor changes live serving and Level 2 adds the
   acceptance-criteria closure gate. Add the 014 row, and the missing 013 row, to the parent 018 phase map.
4. **D1:** 014 `spec.md`, `plan.md` and `tasks.md` content. `plan.md` carries this plan, with the precursor as its first phase.

### Phase 1: Live precursor
1. **D2:** in the authored `specs/sk-doc/019-…/015-router-unification-program/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs`,
   add a local `compareText` byte-identical to `registry-compiler.cjs:73`.
   Also add `.skilled/bin/tests/compiled-route-sk-design-tie.test.cjs` (`node:test`, requiring the promoted copy). It asserts that the tie prompt routes and does not throw.
   **It must fail before sync.** That failure is the negative control.
2. **D3:** replace `.skilled/skills/sk-design/SKILL.md:202-203` (rule 6) with literal text I supply.
   The new rule matches the §2 contract at lines 48-52: quote a compiled decision only when the front door returns one, and on the sentinel or an error use the routing below.
   Apply sk-doc's version and changelog convention for the skill, as resolved at write time.
3. **Me, re-mint:** `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-design --skill-root .skilled/skills/sk-design --pretty`,
   then `cp` the runtime manifest over the authored `…/013-live-activation/activation/sk-design/manifest.json`. This is the hook's own documented fix.
   `freshness` must then report the new hash at generation 1.
4. **Me, publish the engine fix:** `node .skilled/bin/compiled-route-sync.cjs`. This publishes the authored closure and prints the rollback root.
   Then run the post-publish gates (§Verification items 1-9).
   If they pass: `node .skilled/bin/compiled-route-sync.cjs --verify`, then `--finalize <rollback-root>`.
   If any fails: `--revert <rollback-root>`, then stop and report.
5. **Commit in the worktree.** The pre-commit re-mint gate re-runs refresh. It must be byte-idempotent: same hash, generation 1, both manifests staged.
6. **STOP FOR YES before the precursor merges to main.** Main serves the change only after the merge. I will name the rollback
   (`git revert <precursor>` restores both trees and both manifests byte-exact; `SPECKIT_COMPILED_ROUTING=0` is the instant fallback) and wait.
   After the merge, rerun the status, front-door and advisor probes on main.

### Phase 2: Freeze the baseline on the new identity (me)
Record SHA-256s of the four sk-design sources, the promoted `canary-router.cjs`, the manifest and the fence state. Record the status row, hash,
generation, `defaultMode`, `userTurns`, `handoffHops`, and CLI outputs for the four named request types. Everything goes to `014/scratch/baseline-*.txt`. From here, all of these are frozen.

### Phase 3: Build the pilot (off-closure, shadow-only)
- **D4:** `.skilled/bin/lib/compiled-route-handoff.cjs` with `validateTypedHandoff(record, ctx)`.
  - The record is closed and has exactly five fields.
  - `reason` must be `wrong-door` or `incomplete-route`.
  - `evidence` must be `{requestFactsHash, baseAction, baseMode, source: 'shadow'}`.
  - The validator rejects extra or missing fields, unknown or self modes, bad evidence and identity mismatch.
  - Tests go in `.skilled/bin/tests/compiled-route-handoff.test.cjs`.
- **D5:** `evaluateWithHandoff(snapshot, input, record, budget)`.
  - It makes at most one extra `evaluateCanary(snapshot, {prompt, explicitMode: toMode})` call.
  - Outcomes: `accepted`, `invalid-record`, `loop`, `hop-limit`, `user-turn-limit` and `fail-closed`.
  - A throw returns the base decision marked fail-closed. It never mutates state and never returns a live route.
  - Tests cover: an accepted hop, a second hop, a loop, the turn limit and a throw.
- **D6:** fixture `.skilled/bin/tests/fixtures/compiled-route-handoff-cases.v1.json`, holding the pasted plan's controlled cases, plus `runShadow(cases)`.
  It runs baseline and candidate on identical inputs and writes raw n/N plus deltas to `014/scratch/`.

### Phase 4: Shadow run, second lens, verdict
- Run the shadow. A fresh read-only `@review` subagent then audits the evidence and the diff.
- Apply the pasted plan's GO conditions unchanged, plus one: every frozen SHA-256 matches Phase 2.
- **D7:** `014/handover.md` from `templates/addons/handover.md.tmpl`. It has the six required sections, keeps confirmed facts separate from proposals, and states the exact next action.
- **STOP FOR YES before the pilot merges.** A GO authorizes only a *separate* decision about live one-hop recovery (Phase 5 of the pasted plan, which gets a new packet).

### Phase 5: Close on main (after merge)
Run `validate.sh <014> --strict` and regenerate metadata on main, per the sk-git rule. Rerun the full battery. Remove the worktree once you confirm.

## Verification (final state; read output and exit status)
1. `node --test .skilled/bin/tests/compiled-route-sk-design-tie.test.cjs`: pass. It failed before sync.
2. `node --test .skilled/bin/tests/compiled-route-handoff.test.cjs`: all pass.
3. `node --test .skilled/bin/tests/compiled-route-admission.test.cjs`: green, and the corpus is still 80.
4. `cd .skilled && ./node_modules/.bin/vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts`: green.
5. `node .skilled/bin/compiled-route-status.cjs --all --no-probe --pretty`: 7 of 7 compiled-serving, 0 stale. sk-design shows the new hash at generation 1, and the other six are unchanged.
6. `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "create a flowchart for the approval path"`: a diagram route. `--prompt "design review of the spacing"`: a route, not the sentinel.
7. `SPECKIT_COMPILED_ROUTING=0`, then `=BOGUS`: `{"servingAuthority":"legacy","hubId":"sk-design"}` both times.
8. `node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-design --skill-root .skilled/skills/sk-design`: fresh, and the authored manifest is byte-equal to the runtime one.
9. `node .skilled/bin/check-no-spec-imports.cjs`: clean. `node .skilled/bin/compiled-route-sync.cjs --check`: the closure file set is unchanged, and `compiled-route-handoff` is absent.
10. Advisor probe on main after merge: `compiledRoute.effectivePolicyHash` for a design prompt equals the new hash.
11. `git diff --unified=0 -- <changed code> | rg '^\+.*(ADR-|REQ-|CHK-|task-|specs/|scratch/|phase)'`: no matches.
12. `validate.sh <014> --strict`: `RESULT: PASSED`, on main. `git status --short`: only the declared paths changed.

## Rollback
- **Precursor, instant:** `SPECKIT_COMPILED_ROUTING=0`.
- **Precursor, durable:** `git revert` of the precursor commit. It restores `SKILL.md`, both `canary-router.cjs` copies and both manifests byte-exact, because the mirror is tracked.
- **Precursor, during Phase 1:** `compiled-route-sync.cjs --revert <rollback-root>`. The rollback root is kept until the gates pass.
- **Pilot:** delete the three new `.skilled/bin` files and the 014 folder. Nothing in the pilot is published.

## Out of scope
- Other hubs.
- `defaultMode` changes and live recovery policy.
- The serving-prior refresh gap, owned by `041/019`.
- The pre-existing `REFERENCES` and SD-007 debts.
- Main's unrelated dirty files.
