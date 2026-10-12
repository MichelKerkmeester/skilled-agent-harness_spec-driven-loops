# Iteration 4: Missing surface packet behavior

## Focus

Q2 part 1: observe what breaks when an external user deletes the Obsidian and Webflow leaf packets, then add a user-named surface directory in the copy and see whether the tooling discovers or routes it. This is the first iteration that performs the deletion experiment; prior iterations explicitly deferred it.

## Actions Taken

- Read the lineage config, state log, strategy, prior findings and iteration summaries. Iteration 4 was next; Q2 remained unanswered. The strategy listed no new exhausted direction for this probe.
- Built two throwaway copies outside the worktree using the supplied rsync exclusions. Copy 1: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i4.pswY`. Detail copy: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i4-detail.1R4p`. Deleted only `.skilled/skills/sk-code/sk-code-obsidian` and `.skilled/skills/sk-code/sk-code-webflow` inside each copy; both copies were then cleaned with scoped Node fs.rmSync calls.
- The check harness did not print the setup commands' individual exit codes. Both overall copy-probe commands exited 0, and the reported doctor and runtime commands confirm the required files were present. The first output filter hid some command output; the detail copy reran the guard and route samples with captured output.
- Ran the compiled guard, four route prompts, doctor fleet metadata and parent-skill checks, route-sync check, the focused parent-skill and compiled-route tests, and skill-advisor recommend inside the missing-packet copy. Added `.skilled/skills/sk-code/sk-code-project` by copying the OpenCode leaf directory, then reran the parent-skill check and a custom-project prompt.

## Findings

| Class | Claim | Evidence | Priority |
|---|---|---|---|
| BREAK | compiled-route-guard reports sk-code fresh after both example packet directories are deleted. | `node .skilled/bin/compiled-route-guard.cjs` in the detail copy, exit 0: `sk-code fresh`; `All hubs fresh or excused: serving matches inputs, and the runtime matches its source.` Yet the next route commands return the absent packet ids. [INFERENCE: freshness is not a packet-presence check.] | P1 |
| BREAK | An Obsidian-specific prompt still routes to deleted packet sk-code-obsidian with exit 0. | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt 'Build an Obsidian plugin in TypeScript with Dataview'`, exit 0: JSON target has `packetId=sk-code-obsidian`, `workflowMode=sk-code-obsidian`. The hub still registers that resource at [SOURCE: .skilled/skills/sk-code/hub-router.json:42]. | P1 |
| BREAK | A Webflow-specific prompt still routes to deleted packet sk-code-webflow with exit 0. | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt 'Create a Webflow CMS site with Designer interactions'`, exit 0: JSON target has `packetId=sk-code-webflow`, `workflowMode=sk-code-webflow`. The hub still registers its resource at [SOURCE: .skilled/skills/sk-code/hub-router.json:31]. | P1 |
| OK | OpenCode-specific and generic code prompts still route to sk-code-opencode when the other two packet directories are absent. | OpenCode prompt in copy 1 and generic Python code prompt in both copies, exit 0: target `packetId=sk-code-opencode`. [SOURCE: .skilled/skills/sk-code/hub-router.json:36] | P2 |
| BREAK | The doctor fleet metadata gate fails after deletion on the duplicated empty leaf-set collision and unresolved Webflow resource paths. | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`, exit 1: `MANIFEST_REGENERATION_FAILED ... MODE_LEAF_SET_COLLISION` and multiple `RRC-006` unresolved `sk-code-webflow/...md` resources. [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:80] identifies this as the fleet metadata gate. | P1 |
| BREAK | The doctor parent-skill check fails because its registered Webflow and Obsidian packet directories are missing. | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code`, exit 1: `FAIL: 3c ... sk-code-webflow ... is not an existing sub-directory` and the same for `sk-code-obsidian`. Registry entries remain at [SOURCE: .skilled/skills/sk-code/mode-registry.json:98] and [SOURCE: .skilled/skills/sk-code/mode-registry.json:107]. | P1 |
| OK | The focused parent-skill and compiled-route canary tests pass in the copy despite the missing live packets. | `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs .skilled/bin/tests/compiled-route-front-door.test.cjs .skilled/bin/tests/compiled-route-surface-hint.test.cjs`, exit 0. Output included `a workflow mode keeps first place and only the surfaces reorder`, `3c fails: packet directory missing`, and `3g fails: surface packet with a mutating backend`. These fixture tests do not catch the live missing-resource routes above. | P2 |
| OK | The skill-advisor recommend command itself does not fail on the missing packets. | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Refactor a TypeScript service and add API tests"}' --format json`, exit 0; captured output included `"status": "ok"`. The output filter did not retain the recommendation list, so this run does not establish which recommendation won. | P2 |
| BREAK | compiled-route-sync --check cannot reach route validation because the prescribed copy excludes specs/ and it exits on ENOENT. | `node .skilled/bin/compiled-route-sync.cjs --check`, exit 1: `ENOENT ... lstat '<copy>/specs'`, at `compiled-route-sync.cjs:39`. The parent copy recipe intentionally excludes specs/. The same limitation was recorded in iteration 3. | P2 |
| BREAK | Adding an unregistered sk-code-project directory alone does not make it routable; the custom prompt defers and the checker still reports the original missing registrations. | In the detail copy, `cp -R .skilled/skills/sk-code/sk-code-opencode/. .skilled/skills/sk-code/sk-code-project/` added the directory. Parent check still exited 1 on the two missing registered modes; `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt 'Use the Acme project code workflow to update my application'` exited 0 with `"action":"defer","selectionKind":null,"targets":[]`. [SOURCE: .skilled/skills/sk-code/mode-registry.json:88] shows the existing OpenCode packet is explicitly registered. | P1 |

## Options and Recommendations

| Option | What it changes, path:line | Cost | Risk | Cheaper move and why it fails |
|---|---|---|---|---|
| Recommended: ship example packets as operator-owned registration data; omit their registrations/resources from an external starter. | External starter data in `.skilled/skills/sk-code/mode-registry.json:98-108`, `.skilled/skills/sk-code/hub-router.json:7,31-45`, and generated `.skilled/skills/sk-code/leaf-manifest.json:35-36,270-271`; operator data retains its current entries. | Medium: update authored registrations, regenerate the manifest, and cover both starter and operator configurations with the existing check path. | Medium: the two data sets can drift unless the external/operator distinction is explicit. | Cheaper docs-only deletion fails: the doctor returns exit 1 and compiled routing still returns packet ids for the removed directories, observed above. [INFERENCE: based on the copy deletion results and the current registrations.] |

## Questions Answered

- [x] Q2: What breaks when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy, and what happens when they add their own surface?

## Questions Remaining

- Q1: complete occurrence inventory across the advisor, doctor checks, install guides, release note and runtime.
- Q3: compare tieBreak, priority/rank, native/fallback and surface-hint policies for a user-added surface.
- Q4: establish how shipped starter data can omit examples while the operator repository retains its registrations.
- Q5: specify doctor messaging, delete-or-replace guidance and the supported surface-scaffolding path.
- Q6: reject overbuilt alternatives with a concrete cheaper move and failure evidence.

## Ruled Out

- Adding only a new directory is sufficient for routing: the custom prompt returned `action=defer` with no targets.
- `compiled-route-sync.cjs --check` is an executable deletion probe under the required copy recipe: it stops before validation because `specs/` is absent. This limitation was seen previously and is not retried with a different copy shape.

## Edge Cases

- Ambiguous input: none; the focus explicitly requested directory deletion and a throwaway copy.
- Contradictory evidence: none.
- Missing dependency: the copied repository lacks `specs/` by design, so route-sync could not run to its validation stage.
- Partial success: all other specified commands ran; the route-sync check and the full advisor recommendation details remain unverified.

## Sources Consulted

- [SOURCE: .skilled/skills/sk-code/hub-router.json:7]
- [SOURCE: .skilled/skills/sk-code/hub-router.json:31]
- [SOURCE: .skilled/skills/sk-code/hub-router.json:36]
- [SOURCE: .skilled/skills/sk-code/hub-router.json:42]
- [SOURCE: .skilled/skills/sk-code/mode-registry.json:88]
- [SOURCE: .skilled/skills/sk-code/mode-registry.json:98]
- [SOURCE: .skilled/skills/sk-code/mode-registry.json:107]
- [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:80]
- [SOURCE: .skilled/bin/compiled-route-sync.cjs:39]
- Copy command receipts documented in Findings.

## Assessment

- New information ratio: 0.80 (seven fully new deletion observations, two partially new results, one route-sync limitation already reported in iteration 3).
- Questions addressed: Q2.
- Questions answered: Q2, scoped to deletion and directory-only addition. Full route-sync validation and advisor recommendation details remain unverified.

## Reflection

- What worked and why: direct route invocations after deleting the leaves exposed a false-green freshness check and successful routes to absent packet ids.
- What did not work and why: route-sync resolves the missing `specs/` path before testing deletion behavior; the approved copy recipe excludes it. The first output filter also hid the full advisor recommendation, so only its `status=ok` result is retained.
- What I would do differently: capture each copy-setup command status separately and preserve the full advisor JSON in the next focused pass.

## Recommended Next Focus

Q3: compare the existing explicit tieBreak list with a registry priority/rank, native/fallback metadata and `--surface-hint` for a registered user surface. Use this iteration's result that a directory alone is ignored as the baseline.

