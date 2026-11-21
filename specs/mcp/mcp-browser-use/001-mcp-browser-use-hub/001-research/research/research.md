# Research synthesis: mcp-browser-use hub

Canonical answer surface for KQ1-KQ8 of the research charter in `../spec.md`. Compiled from the twelve iteration files under `iterations/`. Every upstream Bladebro claim is pinned to **v4.8.2** (published 2026-11-20T16:33:56Z, read 2026-11-21) [SOURCE: https://api.github.com/repos/dondai44423/bladebro/releases/latest].

---

## 1. Executive Summary

The hub is buildable as planned, all eight key questions have a stated answer, and both operator inbox questions are resolved — the Lighthouse contradiction was settled in iteration 12.

- **Contract (KQ3):** `mcp-browser-use` copies `mcp-tooling`'s four-file skeleton. All three modes are `routingClass: metadata`, `packetKind: workflow`, `backendKind: cli-plus-mcp`. The `transport-axis` extension is dropped.
- **Naming (KQ5):** keep the `mcp-` prefix: `mcp-chrome-devtools`, `mcp-aside-devtools` and the new `mcp-bladebro`, each with folder == `workflowMode` == `packetSkillName`. That makes phase 003 a relocation, not a rename.
- **Lanes (KQ2):** every mode is CLI-first, with MCP through Code Mode for composition. Bladebro's fallback is transport-driven because its CLI and MCP share the same five handlers.
- **Aside overlap (KQ8):** **no.** Bladebro does not take over Aside's deterministic signed-in work. Aside keeps that work, and Bladebro gets the stealth, caller-owned-browser and agentic signed-in cases through the router tie-break.
- **Security (KQ7):** three quotable rules for 004: R-SEC-1 signed-in profiles, R-SEC-2 stealth and site terms of service, R-SEC-3 npm supply chain.
- **macOS (KQ6):** a 14-step plan with expected output and rollback per step. It was authored, not executed, because the install is a phase-006 operator stop-for-yes.

The largest residual uncertainty is KQ4. Its blast radius is classified by cluster, not as a frozen per-file list, so phase 003 should re-run the inventory before it edits anything.

## 2. Scope, Method and Evidence Pins

- **Method:** twelve deep-research iterations on `cli-opencode` (`opencode-go/hy4-flash-free`, reasoning `high`), stop policy `max-iterations`. One key question per iteration for KQ1-KQ8. Iterations 9 and 10 were closure work: re-recording KQ1's state and verifying it. Iteration 11 was a resumed run answering the operator's two queued inbox questions: it resolved question 9 (outside-hub blast radius); iteration 12 resolved question 10 (Lighthouse) using the upstream tool reference plus the local tool-inventory fixture and closed the run.
- **Local evidence:** the `mcp-tooling` hub files, the two mode packets and the downstream phase specs, cited as `path:line`.
- **Upstream evidence:** the Bladebro README, `docs/tools.md`, `docs/setup.md`, `docs/browser-modes.md`, `docs/configuration.md`, `STEALTH_BENCH.md` and the releases API, fetched from `main` on 2026-11-21 and read against the v4.8.2 pin.
- **Not done, by charter:** no Bladebro install, no live probe, no edit outside this phase folder [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100].
- **Host facts at start:** `bladebro` absent, `aside` at `~/.local/bin/aside`, `bdg` at `/opt/homebrew/bin/bdg` [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:81-84].

## 3. KQ1: Capability Matrix

**Answer:** each tool owns a distinct band. Chrome DevTools owns raw CDP, HAR and traces. Aside owns signed-in work and deterministic Playwright proof. Bladebro owns agentic goal completion, the real-browser lane and stealth. Full cited matrix: `iterations/iteration-001.md`.

| Dimension | Bladebro v4.8.2 | Chrome DevTools (`bdg` + chrome-devtools-mcp) | Aside |
|---|---|---|---|
| Page model | `see model/content/outline/find/scope/extract`, large reads paged to an artifact | `bdg dom query` / `dom eval`; MCP element tools | Playwright `page` API in `aside repl` |
| Actions | `act` verbs plus `run` plans (branches, bounded loops, up to 1000 steps) | `bdg` session, `bdg cdp <Method>`, MCP clicks/forms/tabs | `aside "<task>"` / `exec`; deterministic `aside repl` |
| Console / network | `see logs` console / network / xhr rings | `bdg console --list`, CDP network methods | `page.on(...)` events only |
| HAR | none | `bdg network har <path>` | gap |
| Heap / perf trace | none | raw CDP HeapProfiler/Performance plus perf scripts | Performance API timing only |
| Lighthouse | none | MCP `lighthouse_audit` (accessibility/SEO/best practices/agentic); performance via `performance_start_trace` (iteration 12) | gap |
| Raw CDP | none (CDP is internal transport) | 300+ methods across 53 domains | gap |
| iframes | cross-origin out of scope; open shadow roots supported | via CDP frame methods | via Playwright frames |
| Signed-in profiles | `rb on` "your browser": attach / clone / profile, injection off | `chrome_devtools_live --autoConnect`, fallback only | signed-in account by default, `--account`, autofill |
| Stealth | claimed, with a published benchmark | none documented | none documented |

Sources: [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md] [SOURCE: https://github.com/dondai44423/bladebro#the-five-tools] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:61-83] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:84-90] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:21-37] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:139-150].

**Where each stops:** Chrome DevTools stops at agentic goal completion. Aside stops at CDP, HAR, stealth and parallel isolation. Bladebro stops at HAR, Lighthouse, heap trace, raw CDP and cross-origin iframes. This is inferred from the cited gaps.

**Lighthouse contradiction resolved (iteration 12):** the router is correct and the catalog gap is a granularity artifact. `lighthouse_audit` is a first-class chrome-devtools-mcp tool [SOURCE: https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/docs/tool-reference.md], and the 2026-07-16 `list_tools` fixture registers it on both isolated Code Mode instances [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json:6]. The catalog enumerates CLI features and MCP invocation patterns, not MCP tool names [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:20]. Lighthouse excludes performance; Core Web Vitals come from the trace tools, and the capability is MCP-fallback-lane only. Detail: `iterations/iteration-012.md`.

## 4. KQ2: CLI versus Code Mode Lane Rule

**Answer:** one rule shape fits all three modes. Use the CLI when it is present, and switch to MCP through Code Mode when the work must chain with other MCP tools or the CLI is unavailable. Detail: `iterations/iteration-002.md`.

| Mode | Detection (in order) | Default lane | Fallback trigger |
|---|---|---|---|
| Bladebro | `command -v bladebro` → `bladebro doctor` | CLI (same five handlers as MCP) | `bladebro mcp` / `npx -y bladebro mcp` via Code Mode when chaining or the binary is unavailable; if neither works, hand the install decision to the operator |
| Chrome DevTools | `command -v bdg` → `bdg --version 2>&1` → `bdg status` | CLI `bdg` (full CDP, `--list`/`--describe`, HAR) | Code Mode MCP when the CLI is missing, when chaining, for parallel `--isolated=true` sessions or typed automation; signed-in work → `chrome_devtools_live --autoConnect`, with Aside the default owner |
| Aside | `command -v aside` → `aside --version 2>&1` → `aside --help 2>&1` | CLI: `aside "<prompt>"` / `aside exec` for tasks, `aside repl` for deterministic proof | `aside mcp` via Code Mode for composition or MCP-only capability; rediscover inventory each session, no `--account` on `mcp`/`repl`, close stdio in `try/finally` |

Sources: [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:61] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:106-119] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:53-75] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:93-122] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md].

Bladebro's fallback is transport-driven, not capability-driven. Chrome's MCP, by contrast, is a CDP subset without `--list`/`--describe` [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:114-119]. Detection output is version-pinned fixture evidence: re-capture it each session and redact cookie and credential values [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:130-135].

## 5. KQ3: Hub Contract

**Answer:** mirror `mcp-tooling`'s root files with the identity swapped. Detail: `iterations/iteration-003.md`.

- **Skeleton:** `SKILL.md`, `mode-registry.json`, `hub-router.json`, root `ROUTER.md`, a generated `leaf-manifest.json`, and `description.json` / `graph-metadata.json`. The hub holds no per-mode logic [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:15-20] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:105-111].

| Mode | `routingClass` | `packetKind` | `backendKind` | Tool surface |
|---|---|---|---|---|
| `mcp-chrome-devtools` | `metadata` | `workflow` | `cli-plus-mcp` | Write/Edit allowed, `mutatesWorkspace: true` |
| `mcp-aside-devtools` | `metadata` | `workflow` | `cli-plus-mcp` | Write/Edit allowed, `mutatesWorkspace: true` |
| `mcp-bladebro` | `metadata` | `workflow` | `cli-plus-mcp` | Write/Edit allowed, `mutatesWorkspace: true` |

- **`mode-registry.json`:** top-level `skill`, `version`, `resourceContractVersion: 1`, `description`, `discriminator` and `advisorRoutingContract`, plus `modes[]` of three. Each mode carries `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, `packet == packetSkillName`, `grandfatheredFolderMismatch: false`, `command: null`, `aliases[]` and `advisorRouting.routingClass: "metadata"`. There is no `extensions.transport-axis` block [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:1-61] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:17-26].
- **`hub-router.json`:** `routerPolicy` (`defaultMode: null`, `ambiguityDelta: 1`, fallback-only `defaultResource`, discovery-only classes), three `routerSignals` of `weight: 4`, and `vocabularyClasses`. The tie-break encodes the Chrome↔Bladebro overlap (debugging) and the Aside↔Bladebro overlap (signed-in work). Generic "browser automation" defers instead of fanning out [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:1-33] [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:42-47].
- **`leaf-manifest.json`:** three generated `{leaves[], packet, workflowMode}` entries. Chrome and Aside leaves carry over. Bladebro leaves are greenfield and must exist before regeneration. Never hand-edit it [SOURCE: .skilled/skills/mcp-tooling/leaf-manifest.json:1-25] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:111].
- **Invariants:** registry modes and router signal keys stay bidirectionally aligned. ESCALATE when the registry, stage one, stage two or the manifest disagree. One `graph-metadata.json` identity with three member entities, and `mcp-code-mode` as the external substrate [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:125] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:140-141].

## 6. KQ4: Blast Radius

**Answer (partial: classified by cluster, not a frozen per-file list):** moving the two modes is a coordinated multi-file edit. The doctor mutation-class manifest and the advisor fixtures carry the highest risk. Detail: `iterations/iteration-004.md`.

- **Hand-edit inside `mcp-tooling`:** `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, `feature-catalog/feature-catalog.md`, `feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md`, `manual-testing-playbook/manual-testing-playbook.md` plus six `hub-routing/*.md` scenarios, and `README.md` [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:30] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:35].
- **Hand-edit outside `mcp-tooling`:**
  - seven `cli-orca` docs [SOURCE: .skilled/skills/cli-orca/SKILL.md:53];
  - five `mcp-code-mode` docs, including the test-enforced byte-identical `_utils.sh` coupling [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:318];
  - `mcp-click-up/references/mcp-tools.md` and its `SKILL.md` / `README.md`;
  - canonical docs in `mcp-figma`, `mcp-mobbin`, `mcp-refero`, `sk-code`, `sk-code-frontend` and `sk-design-md-generator`;
  - `.skilled/skills/README.txt` [SOURCE: .skilled/skills/README.txt:53];
  - the doctor mutation-class manifest [SOURCE: .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:43] [SOURCE: .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:59];
  - the playbook fail-closed allowlist [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt:25];
  - `cite-drift-redirects.json`;
  - system-skill-advisor golden and labeled prompt fixtures and tests [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl:6];
  - the live downstream specs in 003 and 006.
- **Regenerate:** `mcp-tooling/leaf-manifest.json` (canonical command only), the new hub's manifest after relocation, the system-spec-kit `trigger-index.json` and retrieval fixtures, and observability reports [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:111] [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1].
- **Move wholesale:** the two packet directories. `.claude`, `.opencode` and `.pi` skills are symlinks to `.skilled/skills` and follow automatically (shell probe, 2026-11-21).
- **Leave as history:** changelogs, benchmark reports and every `specs/**` scratch, evidence, handover, TSV, receipt and research artifact that quotes a mode id.
- **Carry-over validated:** the Chrome leaves `cdp-patterns.md` / `session-management.md` and the Aside leaves `aside-cli-reference.md` / `mcp-wiring.md` exist on disk [SOURCE: .skilled/skills/mcp-tooling/leaf-manifest.json:4] [SOURCE: .skilled/skills/mcp-tooling/leaf-manifest.json:17].

**Why partial:** several outside clusters are named by skill, not by file, and the raw grep returned 400 truncated matches before `rg -l` scoping. Phase 003 should regenerate the exact list with `rg -l 'mcp-chrome-devtools|mcp-aside-devtools' .skilled` and classify each hit against these rules.

**Outside-hub refinement (iteration 11):** the operator's queued question 9 asked for the file-level list strictly *outside* `.skilled/skills/mcp-tooling`, excluding changelog and benchmark/reports, classified as rewrite-path / rewrite-mode-name / historical-leave. The literal scope drops the six sibling packets (`mcp-click-up`, `mcp-figma`, `mcp-mobbin`, `mcp-notion`, `mcp-obsidian`, `mcp-refero`) that live under mcp-tooling. Live path rewrites concentrate in the doctor mutation-class manifest, the mcp-installers test, the playbook fail-closed allowlist, the mcp-code-mode `_utils.sh` coupling and two playbook catalog rows, and sk-code/sk-doc relative cross-references [SOURCE: .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:45] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt:25]. Bare-id references in the seven cli-orca docs, the skills index, the canary fixture and the advisor fixtures need no id change under KQ5, which kept the `mcp-` prefix and made the ids stable [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:117]. Full classification: `iterations/iteration-011.md`.

## 7. KQ5: Naming Decision

**Answer: keep the `mcp-` prefix.** The canonical parent-hub rule is "canonical workflow folder == packetSkillName == [hub-prefix]-<mode>" [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:294] [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:261], and `mcp-browser-use`'s prefix is `mcp`. Detail: `iterations/iteration-005.md`.

| Mode | Folder (under `.skilled/skills/mcp-browser-use/`) | `workflowMode` | `packetSkillName` |
|---|---|---|---|
| Chrome DevTools | `mcp-chrome-devtools/` | `mcp-chrome-devtools` | `mcp-chrome-devtools` |
| Aside | `mcp-aside-devtools/` | `mcp-aside-devtools` | `mcp-aside-devtools` |
| Bladebro | `mcp-bladebro/` | `mcp-bladebro` | `mcp-bladebro` |

- Every row has `grandfatheredFolderMismatch: false`, and the packet `SKILL.md` `name:` equals `packetSkillName`. The doctor checker soft-fails a stale `true` flag, which rules out a hybrid bare-folder option [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:588-612].
- The bare nouns in the parent spec are the `<mode>` part, not full ids [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:82].
- **Consequence:** the KQ4 work is a relocation. Literal mode ids stay valid, and only `mcp-tooling/` paths move. The `_utils.sh` coupling, the doctor `skill_dir` values and the allowlist paths still need re-pointing.

## 8. KQ6: macOS Verification

**Answer:** a 14-step plan, each step with an expected output and a rollback. Full table: `iterations/iteration-006.md`. The plan was authored from pinned upstream docs and not executed.

| Steps | Phase | Command → expected output | Rollback |
|---|---|---|---|
| 1-2 | Preflight | `command -v bladebro` → `absent`; Node ≥ 14 and a Chromium-family browser | none |
| 3 | Install (operator yes) | `npm install -g bladebro` → package plus native `bladebro-darwin-arm64`/`-x64` | `npm uninstall -g bladebro` |
| 4 | Install verify | `bladebro doctor` → health pass, data root `~/.local/state/blade` (or `~/.blade`), browser found | set `CHROME_PATH`, re-run |
| 5 | Pin | `bladebro --version` → `4.8.2`; check the release SHA-256 (arm64 `7324e502…`, x64 `d839f5f8…`) | none |
| 6 | MCP lane | register `mcpServers.bladebro` `["mcp"]` → five `mcp__bladebro__*` tools | remove the entry |
| 7-10 | Agent-browser probe | `see content <url> --json` → `{ok,is_error,text}` exit 0; `see model`, `act click`, `vision --marks --json`, `state tabs`, optional `run` | `bladebro stop`; isolate with `BLADE_HOME` / `BLADE_FRESH=1` |
| 11-13 | Real-browser probe | `rb status --json`, `rb use`, `rb profile`, `rb on` (`clone`/`auto` on macOS) → tools and refs work with injection off | `rb off`, `rb forget`, `rb pause`/`resume` |
| 14 | Teardown | `rb off`; `bladebro stop`; uninstall and remove the data root after approval | re-run step 3 |

Sources: [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/configuration.md].

macOS constraint: `profile` mode needs the browser closed, and branded Chrome 136+ refuses remote debugging on its default data directory, so the plan defaults to `clone`/`auto` and keeps `attach` for a browser that must stay open.

## 9. KQ7: Security Risks

**Answer:** three risk families, each with a mitigation 004 can quote verbatim. The quotable text is in `iterations/iteration-007.md`.

| Rule | Risk | Mitigation |
|---|---|---|
| R-SEC-1 signed-in profiles | `rb` acts in authenticated sessions; "Actions in a signed-in profile can affect your account" | owned agent-browser profile by default (`BLADE_HOME`/`BLADE_FRESH=1`); `rb` only on explicit request with operator-chosen profile/account; `attach` for caller-owned browsers; no `profile` on live branded Chrome; `rb pause`/`resume` gating; no `--account` on `aside mcp`/`repl`; single-writer lock per account; redact captures |
| R-SEC-2 stealth and site ToS | anti-detection tool: 68/80 (85.0%) anti-bot sites passed, Akamai 3/6 | operator ToS gate before use on a target site; never evade CAPTCHAs, anti-bot walls or access controls where that breaches terms or law; `blocked:` is terminal; prefer the agent-browser lane |
| R-SEC-3 npm supply chain | global install pulls optional native binaries; fast upstream release cadence | install is a 006 operator stop-for-yes; pin v4.8.2 and the read date; verify SHA-256 against release sidecars (`shasum -a 256 -c`); prefer the standalone binary; re-verify flags; staged rollback |

Sources: [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/STEALTH_BENCH.md] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/README.md] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:121] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:113].

The mapping to 004 REQ-002 is one rule per risk family. R-SEC-2's ToS gate is an operator-owned judgment, because no upstream document supplies a ToS policy.

## 10. KQ8: Aside Overlap

**Answer: no.** Bladebro does not take over Aside's deterministic signed-in work. Three independent cases decide it. Detail: `iterations/iteration-008.md`.

1. **Determinism:** Aside's `aside repl` is a sandboxed Playwright REPL with a 120-second timeout and evidence-friendly steps [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:55-63]. Bladebro's `run` plans branch and loop: agentic, not replay-deterministic.
2. **Consent and ownership:** Aside owns the signed-in account by default, with a single writer, Deny-wins permissions and human pauses for MFA and approvals [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:116]. Bladebro's `rb` lane is non-default and gated by R-SEC-1 and R-SEC-2. Making it the default would invert R-SEC-1.
3. **Contract:** 004 changes Aside's scope only on a "yes" [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:90], so "no" keeps 004 in scope.

**Cases that go to Bladebro (complement, not takeover):** stealth on a signed-in site, `rb attach` to a caller-owned browser that must stay open, and agentic branching signed-in workflows. The tie-break routes deterministic signed-in proof to Aside and agentic or stealth signed-in work to Bladebro.

## 11. Recommendations: Per-Phase Synthesis

- **002-hub-scaffold:** scaffold the four-file contract plus the generated manifest and advisor metadata, with `modes[]` of three, all `workflow` / `cli-plus-mcp` / `metadata`. Do not carry `extensions.transport-axis`, which answers 002's open question. Use the KQ5 ids as written.
- **003-mode-relocation:** relocate `mcp-chrome-devtools/` and `mcp-aside-devtools/` without renaming. First regenerate the exact KQ4 file list with `rg -l`, then hand-edit by cluster: the doctor mutation-class manifest and advisor fixtures first, then the `_utils.sh` byte-identical test coupling in `mcp-code-mode`. Regenerate `leaf-manifest.json` with the canonical command, and leave changelog, benchmark and spec history alone.
- **004-bladebro-mode:** author `mcp-bladebro/` (`SKILL.md` `name: mcp-bladebro`) and its leaves before the manifest is regenerated. Write R-SEC-1/2/3 verbatim from `iterations/iteration-007.md` (REQ-002). KQ8 is "no", so do not change Aside's scope, and the 004 open question resolves to "no change to Aside".
- **005-routing-and-surfaces:** every mode is `routingClass: metadata`, so no per-mode advisor projection maps are needed (005's open question). Own the advisor graph rebuild, the stage-two `ROUTER.md`, the tie-break described in KQ3 and KQ8, removing browser vocabulary from `mcp-tooling/graph-metadata.json`, and a check that advisor fixtures asserting `mcp-chrome-devtools` still resolve under hub-membership routing.
- **006-verification:** after the operator's install yes, run the 14-step macOS plan (section 8), record the agent-browser and real-browser probe output for 006 REQ-001, and check `bladebro --version` against the v4.8.2 pin, re-reading upstream if it moved.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Broad web search for Bladebro facts | Official README and `docs/*.md` were reachable directly | upstream docs index | 1, 2, 6-9 |
| Live `bladebro` probes or install during research | Binary absent and install is a charter non-goal owned by 006 | `001-research/spec.md:98-100` | 1, 6-10 |
| Non-`metadata` routingClass for any mode | Adds per-mode projection maps to 005 with no benefit under hub-membership routing | `mcp-tooling/mode-registry.json:11-16` | 3 |
| Importing `mcp-tooling`'s `transport-axis` extension | All three modes are workflow, none is a read-only transport | `mcp-tooling/mode-registry.json:17-26` | 3 |
| Hand-writing `leaf-manifest.json` | Generated from packet resources; never hand-edited | `mcp-tooling/SKILL.md:111` | 3, 4 |
| Treating the raw 400-match grep as the edit list | Most hits are changelog, benchmark or spec history | iteration-004 classification | 4 |
| Editing runtime mirrors under `.claude` / `.opencode` / `.pi` | They are symlinks into `.skilled/skills` | shell probe 2026-11-21 | 4 |
| Dropping the `mcp-` prefix | Breaks the `[hub-prefix]-<mode>` rule and renames every literal id | `create-skill-parent-confirm.yaml:294` | 5 |
| Bare folder + prefixed name with `grandfatheredFolderMismatch: true` | The flag is legacy-only; the checker soft-fails a stale `true` | `parent-skill-check.cjs:588-612` | 5 |
| Bladebro taking over Aside's deterministic signed-in work | Fails determinism, consent-default and contract cases | KQ8 section | 8 |

## Divergence Map

- Convergence mode was `default`, so no divergent pivots ran. Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none recorded in the registry. The two directions blocked since iteration 1 (broad web search, live probes) were never retried.
- Breadth came from one-KQ-per-iteration focus. The topic did not converge by breadth expansion.
- Remaining frontier: the KQ4 per-file inventory only; the KQ1 Lighthouse contradiction was resolved in iteration 12 (see Open Questions).

## 12. Open Questions

- **Lighthouse (KQ1) — resolved in iteration 12:** yes. The router is right [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:49-53]; `lighthouse_audit` is a real tool upstream [SOURCE: https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/docs/tool-reference.md] and in the local 2026-07-16 fixture [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json:6]. Phase 005 should add a Lighthouse + performance-trace leaf to the Chrome catalog; keep the router intent.
- **Exact KQ4 file list:** phase 003 should regenerate it before editing (section 6).
- **Observed Bladebro behavior:** every KQ6 expected output is upstream documentation, not an observation. Phase 006 confirms it on the installed binary.
- **Upstream drift:** Bladebro releases often. Re-read the pinned docs if `bladebro --version` is not `4.8.2` at 006 time.

## 13. References

- Bladebro upstream (read 2026-11-21, pinned v4.8.2): https://github.com/dondai44423/bladebro, `docs/tools.md`, `docs/setup.md`, `docs/browser-modes.md`, `docs/configuration.md`, `STEALTH_BENCH.md`, https://api.github.com/repos/dondai44423/bladebro/releases/latest
- Local hub: `.skilled/skills/mcp-tooling/{SKILL.md,ROUTER.md,mode-registry.json,hub-router.json,leaf-manifest.json,graph-metadata.json,description.json}`
- Mode packets: `.skilled/skills/mcp-tooling/mcp-chrome-devtools/`, `.skilled/skills/mcp-tooling/mcp-aside-devtools/`
- Naming canon: `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:294`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs:588-612`
- Phase specs: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/{spec.md,002-hub-scaffold,003-mode-relocation,004-bladebro-mode,005-routing-and-surfaces,006-verification}`
- Iteration evidence: `iterations/iteration-001.md` through `iterations/iteration-012.md`. No `resource-map.md` existed at init, so none is cited.

## 14. Answered Questions

| KQ | Status | Where |
|---|---|---|
| KQ1 capability matrix | answered (Lighthouse contradiction resolved in iteration 12) | §3, iteration 1, closure in 9, Lighthouse in 12 |
| KQ2 lane rule | answered | §4, iteration 2 |
| KQ3 hub contract | answered | §5, iteration 3 |
| KQ4 blast radius | partial: cluster-level classification, per-file list to regenerate in 003 | §6, iteration 4 |
| KQ5 naming | answered | §7, iteration 5 |
| KQ6 macOS verification | answered as an authored plan; not executed | §8, iteration 6 |
| KQ7 security | answered | §9, iteration 7 |
| KQ8 Aside overlap | answered: no | §10, iteration 8 |

The reducer marks all eight resolved. The statuses above are this synthesis's reading against each "answered means" bar, which is stricter than the reducer's tick for KQ4.

## 15. Limitations and Confidence

- **High confidence:** KQ3, KQ5 and KQ8. They rest on local contracts read line by line.
- **Medium confidence:** KQ2, KQ6 and KQ7. Bladebro facts come from upstream docs on `main` read against v4.8.2, with no binary to observe.
- **Medium-low confidence:** KQ4's completeness, for the reason in section 6.
- **Process limitation:** iterations 9 and 10 added no new research. Iteration 1 recorded KQ1 without the strategy's `KQ1:` prefix, so the reducer did not tick it, and the last two iterations went to re-recording and verifying that closure. Ten iterations bought roughly eight iterations of research.
- **Single model:** every iteration ran on one executor model, with no second-model cross-check.
- **Synthesis closeout failed its invariant:** the ledger records `synthesis_incomplete` (`count_only_state_findings_not_reconstructed`). The iteration records claim 65 findings, and the delta files carry all 65 `finding` rows. The reducer, however, parses findings from each narrative's `## Findings` section and reconstructed only 44, because several iterations wrote findings as `### Finding N` subsections or tables. The answers above are unaffected. What is incomplete is the run's machine-checked findings reconciliation, so the config was not marked `complete`.

## 16. Implementation Decision

Proceed to 002-006 with the decisions above:
- a three-mode `mcp-browser-use` hub, all `metadata` / `workflow` / `cli-plus-mcp`;
- the `mcp-` prefix kept;
- a relocation, not a rename;
- `mcp-bladebro` authored with R-SEC-1/2/3;
- Aside's scope unchanged;
- macOS verification after the operator's install approval.

Three inputs must be refreshed before their phase builds on them: the KQ4 per-file inventory (003), the Bladebro version pin (004 and 006), and a dedicated Lighthouse / performance-trace row in the Chrome DevTools feature catalog so the router's `lighthouse` intent has a describing leaf (005).

## 17. Convergence Report

- Run 11 (resumed): operator inbox question 9 answered — outside-hub blast radius classified into rewrite-path / rewrite-mode-name / historical-leave; newInfoRatio 0.62; one new iteration record committed through the append gateway. Detail: `iterations/iteration-011.md`.
- Run 12: operator inbox question 10 answered — Lighthouse confirmed as a real chrome-devtools-mcp tool, locally registered on both isolated instances; the catalog gap is a granularity artifact; newInfoRatio 0.85; last open question closed from contradictory-evidence to resolved. Detail: `iterations/iteration-012.md`.
- Stop reason: maxIterationsReached (stop policy `max-iterations`; convergence was telemetry only)
- Total iterations: 12, all status `complete` or `insight`, no errors, no redispatches
- Questions answered: 8 / 8 per the reducer plus both operator inbox questions (9 and 10); KQ4 partial per this synthesis, section 14
- Remaining questions: 0 in the registry
- newInfoRatio by iteration: 1.0, 1.0, 0.94, 0.94, 0.90, 0.88, 0.73, 0.70, 0.60, 0.33, 0.62, 0.85
- Last 3 iteration summaries: run 8 KQ8 decision (0.70); run 9 KQ1 closure re-record (0.60); run 10 closure verification (0.33)
- Final stop decision: weighted stop score 0.35. The graph decision was STOP_BLOCKED on `sourceDiversity`, which the max-iterations cap overrides.
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Closeout: `synthesis-closeout.cjs` exited 2 with `synthesis_incomplete` (`count_only_state_findings_not_reconstructed`: 65 claimed findings, 44 reconstructed into the registry). No `synthesis_complete` event was written, and the config status stays `initialized`, so a resume reruns closeout once the narrative-versus-delta gap is fixed.
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
