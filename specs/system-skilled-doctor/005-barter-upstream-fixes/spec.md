---
title: "Feature Specification: Upstream fixes so Barter can drop four overlays: Code Mode disabled manuals, provider-neutral Pi config, doctor tests outside the source repo, overlay anchor placement"
description: "A vendored Skilled copy carries overlays or a red gate after every re-pin because Code Mode ignores disabled manuals, the Pi config names a personal provider, seven doctor test files assume the source repo and marked blocks can only append."
trigger_phrases:
  - "barter upstream fixes"
  - "upstream fixes so barter can drop four overlays"
  - "code mode disabled manual startup"
  - "marked section insertBefore"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Upstream fixes so Barter can drop four overlays: Code Mode disabled manuals, provider-neutral Pi config, doctor tests outside the source repo, overlay anchor placement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-18 |
| **Branch** | `worktrees/473-barter-upstream-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Barter vendors Skilled and has to carry overlays, or live with a red gate, after every re-pin. Four upstream causes drive this. Code Mode registers every manual at startup and ignores `"disabled": true`, so developers without tokens get ClickUp, Mobbin and Refero sign-in tabs. The vendored `.pi/` config names the author's private `llmgateway` provider, so the Pi observer skips. Seven doctor test files assert facts about the Skilled source repo. And a `marked-section` overlay can only append, which pushes RELATED RESOURCES out of last place.

Two more causes came in an addendum. No doctor check proves a Pi extension entry can load, so Barter carries its own `hook-wiring-check` overlay to find entries that fail at session start. And every entry imports its adapter statically, so a missing or stale shared tree makes Pi print one load error per entry, 22 in all, on a fresh install.

### Purpose
A consumer re-pins Skilled and drops its Code Mode, Pi and Mobbin/Refero overlays, its doctor tests pass on the vendored tree, and a marked block can sit before a closing section.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ cd <vendored skilled>/.skilled/commands/doctor/scripts/tests && node --test agents-md-check.test.cjs agents-md-embed.test.cjs ci-profile.test.cjs ci-scaffold.test.cjs ci-toggle.test.cjs doctor-ci-contract.test.cjs symlink-engine.test.cjs
ℹ tests 154
ℹ pass 130
ℹ fail 24
ℹ skipped 0

$ node sk-skill-check.cjs .skilled/skills/sk-code/sk-code-review   (vendored tree)
C3  FINDING Format: Strict mode: 1 contract requirement(s) unmet — render check: references/review-core.md:417 "RELATED RESOURCES" must be the last H2; it is followed by "BARTER OVERLAY: CODE REVIEW LAYERS".

Unpatched Code Mode, config with one enabled and one disabled stdio manual:
startup list_tools: {"tools":["live.live.ping","sleepy.sleepy.ping"]}
started at startup: ["live","sleepy"]

Pi 1.5.2 loader (discoverAndLoadExtensions) on the one-line re-export entries with no .skilled tree:
{"loaded": 0, "errors": 22, "handlers": 0}
errorSamples[0]: Failed to load extension: Cannot find module '../../.skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts'
Same entries over the full tree: {"loaded": 22, "errors": 0, "handlers": 37}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Skip manuals marked `"disabled": true` at Code Mode startup, mark the three OAuth `mcp-remote` manuals disabled, and add the ask-then-register step to the Mobbin and Refero modes.
- Remove the personal default provider and observer model from `.pi/settings.json` and `.pi/pi-blackhole-config.json`, and set `sessionFallback: true`.
- Make the doctor test files Skilled ships unchanged pass on a vendored tree without weakening them in the source repo.
- Add an optional `insertBefore` line to `marked-section` overlay entries, so the block goes before that line.
- Port Barter's `hook-wiring-check` overlay, which proves each Pi extension entry can load, with its test and the three doctor assets that run it.
- Render the 22 Pi extension entries from one template that imports the adapter inside the factory, so an adapter that cannot load costs one session notice, and hold every entry to that template in the sync check, the parity test, `doctor:git` and the wiring check.

### Out of Scope
- `record-base --release` choosing an old nearest release - the consumer did not ask for it, and `--pin <sha>` already works.
- Renumbering or reshaping the consumer's own review-core fragment - the fragment lives in the consumer's overlay folder.
- Stale "manuals load at startup" wording in Mobbin's README, INSTALL-GUIDE, references and playbook - reported as follow-up, not part of the ask.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-code-mode/mcp-server/index.ts` | Modify | Filter disabled manuals before validating the startup config |
| `.utcp_config.json` | Modify | Mark `clickup_official`, `mobbin` and `refero` disabled |
| `.skilled/skills/mcp-tooling/mcp-mobbin/SKILL.md`, `mcp-refero/SKILL.md` | Modify | Ask-then-register step |
| `.pi/settings.json`, `.pi/pi-blackhole-config.json` | Modify | Provider-neutral defaults |
| `.skilled/commands/doctor/scripts/tests/*.test.cjs` (seven files) | Modify | Host-independent fixtures, source-repo-only skips |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `tests/overlay-engine-sync.test.cjs`, `system-skilled-doctor/references/overlays.md` | Modify | `insertBefore` placement, tests and docs |
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, its test, `assets/doctor-setup.yaml`, `doctor-setup-presentation.txt`, `doctor-symlink-check.yaml` | Modify | Barter's Pi entry load check, then a one-hop follow of a lazy entry |
| `.pi/extensions/*.ts` (22 entries), `runtime-mirrors/sync-hook-registrations.cjs`, `hook-registry.json` | Modify | The entry template, its renderer and the check that holds entries to it |
| `runtime/tests/hook-adapter-path-parity.vitest.ts`, `runtime/cli/tests/hook-registration-sync.vitest.ts` | Modify | Template equality and the re-export migration |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` and its test | Modify | Follow the lazy import to the git advisory adapter |
| `tsconfig.pi.json`, `.pi/types/*.d.ts` | Modify | Type-check the template through three entries |
| `.pi/` READMEs, `.skilled/CROSS-CLI.md` and the hook READMEs that describe an entry | Modify | Entry shape and the session notice |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A Code Mode server started on a config with a disabled stdio manual never starts it, and `register_manual` with that entry registers its tools, which stay listed on the next call. |
| REQ-002 | The three OAuth `mcp-remote` manuals in `.utcp_config.json` carry `"disabled": true`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The Mobbin and Refero SKILL.md files carry the ask-then-register step and pass `sk-skill-check`. |
| REQ-004 | `.pi/settings.json` and `.pi/pi-blackhole-config.json` name no `llmgateway` default or observer model and are byte-identical to the consumer's overlays. |
| REQ-005 | The doctor test files Skilled ships unchanged into the vendored tree report 0 failures there, and the seven files pass 166 with 0 skipped in the source worktree. Amended during implementation: the consumer overlays `symlink-engine.test.cjs`, its engine and its manifest, so those failures are the consumer's own. |
| REQ-006 | A `marked-section` entry with `insertBefore` places, rewrites, captures and moves its block before the anchor, and refuses when the anchor line is missing. |
| REQ-007 | `hook-wiring-check.cjs` names every Pi extension entry that cannot load and exits 1, passes the Skilled tree, and `/doctor:setup` and `/doctor:symlink` run it. |
| REQ-008 | Every Pi extension entry is the rendered template. With the shared tree missing or stale, Pi loads every entry without a load error and shows one notice naming the entries that are off. With the tree present, the same hooks register as before. An adapter that throws while it registers still fails as a Pi load error. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The dummy-manual probe prints `started at startup: ["live"]`, then lists `sleepy.sleepy.ping` after `register_manual`.
- **SC-002**: On the vendored harness with the anchored review-core entry, `sk-skill-check` on sk-code-review reports C3 PASS once the block sits one heading level down.
- **SC-003**: Pi's own loader on the rendered entries reports 22 loaded, 0 errors and 37 handlers over the full tree, and 0 errors with one notice over a tree without `.skilled`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's `~/.pi/agent` settings and blackhole config | Without them the operator's own Pi loses its `llmgateway` default | Both global files already name `llmgateway`, and the project file merges over the global one |
| Risk | Operator sessions with cached OAuth tokens no longer see ClickUp, Mobbin or Refero tools at startup | Med | Each mode's ask step registers the manual on demand |
| Dependency | Pi awaits an async extension factory before it commits the extension | A Pi that did not await would drop every hook the adapter registers | Pi has awaited async factories since 0.38.0, and the installed 1.5.0 and 1.5.2 loaders both do |
| Risk | A broken adapter in the source repo shows as a warning notice instead of a load error | Low | The notice names each entry and the first error, and the wiring check and `doctor:git` still fail on it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A - the changes add one array filter at startup and one line scan per anchored entry.

### Security
- **NFR-S01**: No OAuth sign-in tab opens without a user choice.

### Reliability
- **NFR-R01**: A missing anchor line refuses the entry and never appends the block silently.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a config with no `manual_call_templates` array passes through the filter unchanged.
- Maximum input: an anchor line that appears more than once matches its last occurrence.
- Failure path: `insertBefore` with no matching line refuses with `has no line "<anchor>" for the block to go before; rebase the overlay`.
- Failure path: a Pi adapter that throws inside its factory is not caught by the entry, so Pi reports `Failed to load extension` for it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 70 files across six areas, most of them the 22 rendered entries and doc lines |
| Risk | 12/25 | A Code Mode startup contract and an overlay manifest field |
| Research | 10/20 | Reproduced each symptom on a copy of a vendored tree |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None
<!-- /ANCHOR:questions -->

---


