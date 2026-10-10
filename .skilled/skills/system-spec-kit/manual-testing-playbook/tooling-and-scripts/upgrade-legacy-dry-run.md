---
title: "466 -- Upgrade-legacy dry run"
description: "This scenario validates the upgrade-legacy dry run for `466`. It focuses on the failing-packet report, the Downgrades section, the grouped detail, the repository era block and the guarantee that a dry run writes nothing."
version: 1.0.0.0
id: tooling-and-scripts-upgrade-legacy-dry-run
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 466 -- Upgrade-legacy dry run

## 1. OVERVIEW

This scenario validates the dry run of `upgrade-legacy.mjs` on a disposable repository that holds one legacy packet. The dry run is the census that every later apply depends on. It must name each failing packet and its rules, predict the findings a repair would keep as warnings, end with the repository era block and leave the working tree exactly as it found it.

### Why This Matters

An operator approves an apply on the strength of the dry run. If the dry run wrote a file, or if it hid a failing rule, the approval would rest on a report that does not describe the tree. This scenario proves both properties on a fixture that is safe to change.

---

## 2. SCENARIO CONTRACT

Operators run the dry run on a v4 fixture with one legacy packet and confirm that the report names the failing packet, predicts its Downgrades, prints the era block and writes nothing.

- Objective: Prove that the upgrade-legacy dry run reports failing rules, the Downgrades section, the grouped detail and the repository era block, exits 1 for a failing packet and writes no file.
- Playbook ID: 466.
- Real user request: `Before I approve an upgrade of this spec tree, show me what would change and what would stay a warning.`
- Prompt: `Before I approve an upgrade of this spec tree, show me what would change and what would stay a warning.`
- Preconditions: A checkout that holds `.skilled/skills/system-spec-kit`, `.skilled/skills/sk-doc`, `.skilled/skills/cli-classifier`, `.skilled/skills/sk-code`, `.skilled/hooks` and `.skilled/scripts/git-hooks`, with Node, git, rsync and bash available. Nothing else is needed, and the fixture needs no network.
- Expected execution process: Build the fixture, run the dry run, check the exit code and the written files, then check the supplemental refusal on a tree whose packets sit under the legacy `.opencode` spec root.
- Expected signals: The dry run exits 1. Its first report line names `specs/legacy-track/001-old-packet` with the failing rules `ANCHORS_VALID, FILE_EXISTS, FRONTMATTER_VALID, GREP_CONVENTION, LEVEL_MATCH, TEMPLATE_SOURCE`. The grouped detail prints one heading per packet and rule. The Downgrades section lists nine findings as `packet | rule | error -> warning | detail`. The summary reads `inspected=1 active=1 archived=0` and `passing=0/1`. The repository era block reads `layout: v4 (v3=false, v4=true)`. The closing line starts with `--apply would run:`. No file changes and no `upgrade-baseline.json` appears.
- Desired user-visible outcome: The operator sees each failing rule, each finding that would stay a warning and the layout the run judged, and nothing in the tree has changed.
- Pass/fail: PASS if the exit code is 1, the failing, grouped, Downgrades and era lines appear, the layout reads v4 and the working tree is still clean with no baseline file. FAIL if the dry run writes any file or the failing packet is not named.

---

## 3. TEST EXECUTION

### Prompt

```
Before I approve an upgrade of this spec tree, show me what would change and what would stay a warning.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the disposable repository and add the legacy packet.

```bash
CHECKOUT="$(pwd)"
FIXTURE="$(mktemp -d)/repo"
OUT="$(mktemp -d)"
mkdir -p "$FIXTURE" && cd "$FIXTURE"
export GIT_CONFIG_GLOBAL="$FIXTURE.gitconfig" && : > "$GIT_CONFIG_GLOBAL"
git init -q && git config user.name Fixture && git config user.email fixture@test.invalid
mkdir -p .skilled/skills .skilled/scripts .opencode specs
rsync -a --exclude node_modules "$CHECKOUT/.skilled/skills/system-spec-kit" "$CHECKOUT/.skilled/skills/sk-doc" "$CHECKOUT/.skilled/skills/cli-classifier" "$CHECKOUT/.skilled/skills/sk-code" .skilled/skills/
ln -s "$CHECKOUT/.skilled/skills/system-spec-kit/node_modules" .skilled/skills/system-spec-kit/node_modules
rsync -a "$CHECKOUT/.skilled/hooks" .skilled/
rsync -a "$CHECKOUT/.skilled/scripts/git-hooks" .skilled/scripts/
touch .opencode/.gitkeep
printf 'dist/\nnode_modules\n' > .gitignore
git add -A && git commit -q -m baseline
mkdir -p specs/legacy-track/001-old-packet
printf -- '---\ntitle: "Old packet"\ndescription: "Legacy packet"\n---\n\n# Old packet\n' > specs/legacy-track/001-old-packet/spec.md
printf '# Plan\n' > specs/legacy-track/001-old-packet/plan.md
git add -A && git commit -q -m "legacy packet"
```

2. Run the dry run and record its exit code.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs > "$OUT/dry-run.out" 2>&1
echo "exit=$?"
```

3. Read the report.

```bash
cat "$OUT/dry-run.out"
```

4. Confirm that the dry run wrote nothing. The `git status` line prints nothing, and the test prints `no baseline written`.

```bash
git status --porcelain
test ! -e specs/legacy-track/001-old-packet/upgrade-baseline.json && echo "no baseline written"
```

5. Supplemental check: move the packets under the legacy `.opencode` spec root, leave `specs` as an alias of it, and confirm the dry run refuses.

```bash
git mv specs .opencode/specs && ln -s .opencode/specs specs
node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs > "$OUT/v3-dry-run.out" 2> "$OUT/v3-dry-run.err"
echo "exit=$?"
cat "$OUT/v3-dry-run.err"
```

### Expected

Step 2 prints `exit=1`. Step 3 starts with `failing specs/legacy-track/001-old-packet: ANCHORS_VALID, FILE_EXISTS, FRONTMATTER_VALID, GREP_CONVENTION, LEVEL_MATCH, TEMPLATE_SOURCE`, then prints `grouped detail:` with one `### specs/legacy-track/001-old-packet / x <RULE> (<n>)` heading per rule. It then prints the line `step heal-spec-docs: ok (1 packets)`, which comes from the preview that replays the repair steps, followed by the `Downgrades:` heading and nine lines in the form `specs/legacy-track/001-old-packet | <RULE> | error -> warning | <detail>`. The summary reads `inspected=1 active=1 archived=0` and `passing=0/1`. The era block reads `layout: v4 (v3=false, v4=true)` and `frontmatter: present=1 missing=1`. The last line is `--apply would run: fill-frontmatter, anchor-repair, heal-spec-docs, lane-modes, repair-derived, migrate-generated-json (...)`. Step 4 prints `no baseline written` and nothing from `git status`. Step 5 prints `exit=2`, then a stderr message that says the packets still live in `.opencode/specs`, followed by one `rm -f specs && git mv .opencode/specs specs && ln -s ../specs .opencode/specs` command line.

### Evidence

- The exit code from step 2 and the full text of `$OUT/dry-run.out`.
- The output of `git status --porcelain` and the result of the baseline test in step 4.
- The exit code and stderr from step 5.

### Pass / Fail

- **Pass**: The dry run exits 1. The report names the failing packet and its six rules, prints grouped detail, a Downgrades section with nine predicted lines, the summary, the era block and the `--apply would run:` line. Step 4 prints `no baseline written`, and step 5 exits 2 with the move command.
- **Fail**: The dry run exits with another code, a file changes in the fixture, a baseline appears, the failing packet is not named or the era block is missing.

### Failure Triage

If the report names no failing packet, check that the packet's `spec.md` still has only `title` and `description` in its frontmatter, since that frontmatter is what makes the packet fail. If step 5 does not exit 2, check that `specs` became a symlink to `.opencode/specs` and that the fixture has its `.opencode` folder. If `git status --porcelain` is not empty after step 2, the dry run has written something, so record the scenario as FAIL and keep `$OUT/dry-run.out`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [upgrade-legacy-downgrades-report.md](../../feature-catalog/tooling-and-scripts/upgrade-legacy-downgrades-report.md)
- Implementation: [upgrade-legacy.mjs](../../runtime/cli/spec/upgrade-legacy.mjs)

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 466
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/upgrade-legacy-dry-run.md`
