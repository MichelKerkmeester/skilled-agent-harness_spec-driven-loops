---
description: "Describe a problem and get the doctor command that fits, with why, ranked and ready to run."
argument-hint: "[<problem in plain words>] [--json] | list | ?"
allowed-tools: Read, Bash
---
<!-- skill_agent: system-spec-kit -->

# /doctor:helper Router

This command is a thin router. It binds the read-only `helper` target from `_routes.yaml`, then loads that target's workflow YAML and the presentation contract. Every command it names comes from the route manifest at run time, so the router lists no doctor command of its own.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing the question prompt, the ranked list, the no-match fallback or next-step text.

This command never runs a target that writes and never adds an argument to a runnable it prints.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-helper-presentation.txt` |
| Matcher engine | `.skilled/commands/doctor/scripts/doctor-helper-match.cjs` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest, and this command owns the route whose `command` is `/doctor:helper`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- `$ARGUMENTS` is free text, not a target token, which is the one way this router differs from its siblings. Everything after `--` is the described problem, so a pasted error line carrying its own flags stays problem text and never fails as an unknown flag.
- A leading `--json` is the only flag. It prints the matcher's JSON and nothing else.
- `list`, `?` and `menu` as the whole argument print the routing table from the manifest and stop, so the answer stays current with no edit to this command.
- An empty invocation asks the three questions in the presentation contract in one prompt and stops. `not sure` as an answer to any of them drops that filter.
- The class shown on every line is the manifest's `mutating` value for that route, verbatim, so `/doctor:env list` reads `mutates` and a read-only route reads `read-only`.
- The YAML owns workflow behavior; the presentation text owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `helper` | `.skilled/commands/doctor/assets/doctor-helper.yaml` |

| Argument | Applies to | Effect |
|----------|------------|--------|
| `<problem in plain words>` | `helper` | Rank the doctor commands that fit, best first, at most three |
| `--json` | `helper` | Print the matcher's JSON report and nothing else |
| `--area=<command>` | `helper` | Rank only that doctor command's routes, used by the area answer |
| `--intent=check\|change` | `helper` | Prefer a read-only route for `check`, a writing one for `change` |
| `list`, `?`, `menu` | the command | Print the routing table built from the manifest, and load no workflow |

1. Read `.skilled/commands/doctor/assets/doctor-helper-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:helper` route.
3. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating` and script invocations from the route, and reject a flag outside its `allowed_flags`.
4. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the three-question prompt, the ranked list, the offer to run, the hand-off rule, the no-match fallback, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-helper-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

1. Bind the free text after `--`, or the answers to the three questions when there are none, then resolve the `helper` route from `_routes.yaml`.
2. Run `doctor-helper-match.cjs` once, adding `--json` when the operator asked for it, and render at most the three candidates it returns through the presentation contract.
3. A read-only pick runs in place by loading that doctor command's own router with its target, so its workflow and presentation govern. A pick that writes is printed as the exact command for the operator to run, and this command stops there.
4. With no candidate above the floor, offer the read-only `/doctor:setup` fallback and close on the matcher's no-match status line.
