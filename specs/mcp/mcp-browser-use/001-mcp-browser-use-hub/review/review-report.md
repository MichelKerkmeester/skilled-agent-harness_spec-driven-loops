# Deep Review Report: mcp-browser-use hub epic, generation 4

Fan-out re-review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` after phase 015, the advisor 2.0.3.0 change and the lexical-anchor packet (`692a4b8c81c`, `2ecd0b8dafc`, `b2d57de924a`). Four DeepSeek lineages ran with no Opus executor: two used cli-pi `deepseek-v4.1-flash-1017` at thinking max and two used cli-mistral-vibe `deepseek-flash`. The scope held 522 files. The generation-3 report is archived under `../review-archive/20261124T090321Z-restart/`.

---

## 1. Verdict

**FAIL by the merge rule, with no P0.** The merge counts P0 = 0, P1 = 7 and P2 = 24. The FAIL comes from the coverage gate, which two lineages recorded as failed after reaching their iteration cap.

This run is partly gate-proven. Three lineages recorded a `terminal_gates` row; generation 3 had none.

| Lineage | Runner status | Recorded gates | Stop reason | Active P1 |
|---|---|---|---|---|
| pi-1 | failed: iteration 2 is stamped after the lineage process ended | coverage failed | maxIterationsReached | 1 |
| pi-2 | succeeded | **all three pass** | converged | 0 |
| vibe-1 | failed: no `terminal_gates` row | none; all pass when computed afterwards | none recorded | 2 |
| vibe-2 | succeeded | coverage failed | maxIterationsReached | 4 |

pi-2 is the one lineage that is fully gate-proven, and it found no P1. The merge marks pi-1 passes 1 to 7 unexamined, so its finding carries less weight.

---

## 2. P1 Findings, Checked Against Source

| Finding | Lineage | Check run | Result |
|---|---|---|---|
| Naming one mode by id and another by its alias drops the alias mode (`router.cjs:88`) | vibe-2 | "use mcp-chrome-devtools and bladebro" prints `single mcp-chrome-devtools`; "use chrome devtools and bladebro" prints the bundle | **Confirmed.** The full id is a superstring of the alias, so it counts twice. The 015 alias fix covered only the all-ids case |
| The digest-pinned installer is bypassed by every other Aside surface (`doctor.sh:36`, catalog `install-and-doctor.md:24`) | pi-1, vibe-2 | `INSTALL-GUIDE.md` lines 21, 49 and 83, the Aside `README.md:56` and the catalog entry still teach `curl -fsSL … \| bash` | **Confirmed.** 015 changed the script and missed the docs that tell an agent to run the pipe directly |
| An Aside request in plain prose defers or drops Aside (`ROUTER.md:53`) | vibe-1 | "open it in aside" prints `defer`; "check the pricing page in aside and in chrome devtools" routes Chrome DevTools only | **Confirmed.** Bare `aside` was removed in 014 because "set that aside" matched it, and no prose form such as "in aside" replaced it |
| The front-door instruction splices the task into a double-quoted shell argument (`SKILL.md:62`) | vibe-2 | The line reads `--prompt "<task>"`. A task holding `"`, `$()` or a backtick breaks out of the argument. `compiled-route.cjs` also accepts `--prompt-stdin` | **Confirmed** |
| The Node troubleshooting fix installs Node 18 under a block that requires Node 20 (`troubleshooting.md:187`) | vibe-1 | Line 179 says "bdg requires Node.js 20.x or higher"; lines 187 and 188 run `nvm install 18` and `nvm use 18` | **Confirmed**, older than 015 |
| The hub README declares release 1.1.4.0 with no changelog (`README.md:8`) | vibe-2 | 1.1.4.0 is the README's own doc version, which the commit hook bumps; the skill release is 1.1.3.0, with `changelog/v1.1.3.0.md` | **Refuted** |

After the check: 5 P1 confirmed, 1 refuted.

---

## 3. P2 Advisories

The merged registry holds 24 P2 findings, in `deep-review-findings-registry.json`. They were not checked one by one.

---

## 4. Next Step

The operator chose to fix all five in phase 016 (Q010). See `../016-fix-second-follow-up-findings/`.

---

## 5. Run Record

- Root config: `deep-review-config.json`, generation 4, parent session `2026-11-24T07:07:48.877Z`, restart.
- Attribution: `fanout-attribution.md`.
