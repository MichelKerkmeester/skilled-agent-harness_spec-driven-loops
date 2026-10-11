---
title: "467 -- Upgrade-legacy apply with manifest"
description: "This scenario validates the upgrade-legacy apply for `467` on a disposable repository with an uncommitted edit inside a failing packet. It focuses on the recorded findings, the reversibility manifest in the git directory and the baseline the apply writes."
id: tooling-and-scripts-upgrade-legacy-apply-manifest
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 467 -- Upgrade-legacy apply with manifest

## 1. OVERVIEW

This scenario validates an apply of `upgrade-legacy.mjs` on a disposable repository whose failing packet carries an uncommitted edit. An apply on a dirty tree writes a reversibility manifest and one sidecar before-image per dirty file into the git directory before it repairs anything. The scenario checks that the manifest is complete, that the sidecar holds the saved bytes with a matching digest, that the remaining findings land in the packet baseline and that neither the manifest nor the sidecar directory shows up in `git status`.

### Why This Matters

The manifest and its sidecars are the only record of the pre-apply bytes for uncommitted work. If an apply left the manifest in progress or inside the working tree, an operator could not tell a finished repair from an interrupted one, and the restore path would be unclear. This scenario proves the record exists and is complete on a fixture that is safe to change.

---

## 2. SCENARIO CONTRACT

Operators apply the upgrade to a fixture with one legacy packet and an uncommitted note, then confirm the manifest, its sidecar, the baseline and the git status.

- Objective: Prove that an apply on a dirty tree writes a complete manifest and a sidecar before-image in the git directory, records the nine remaining findings and three refusals in `upgrade-baseline.json`, and leaves the manifest and its sidecar directory out of `git status`.
- Playbook ID: 467.
- Real user request: `Apply the upgrade to this spec tree and keep a record I can restore from if it goes wrong.`
- Prompt: `Apply the upgrade to this spec tree and keep a record I can restore from if it goes wrong.`
- Preconditions: A checkout that holds `.skilled/skills/system-spec-kit`, `.skilled/skills/sk-doc`, `.skilled/skills/cli-classifier`, `.skilled/skills/sk-code`, `.skilled/hooks` and `.skilled/scripts/git-hooks`, with Node, git, rsync and bash available. The apply runs only on the fixture, never on a real `specs/` tree.
- Expected execution process: Build the fixture, add the uncommitted note, run the apply, then read the manifest, its sidecar, the baseline and the git status.
- Expected signals: The apply exits 0. Its output reports `recorded specs/legacy-track/001-old-packet (9 findings, 3 refusals)` and `passing before=0/1 after=1/1`. The manifest reads status `complete` with one before-image entry that names a sidecar under `upgrade-legacy.before-images/`, a `sha256` digest and a file mode, and it carries no `content` key. The sidecar holds the saved bytes and its digest matches the entry. The baseline holds nine findings and three refusals. `git status` lists `plan.md` and `spec.md` as modified and three new files, and it never lists the manifest or the sidecar directory.
- Desired user-visible outcome: The operator sees what the apply changed, and a manifest and its sidecar record the pre-apply state of the uncommitted note.
- Pass/fail: PASS if the apply exits 0, the manifest status is `complete`, the before-image entry names a sidecar whose bytes match the recorded `sha256`, the baseline holds nine findings and neither the manifest nor the sidecar directory appears in `git status`. FAIL if the manifest status is `in-progress` after a zero exit, the sidecar is missing or its digest differs, or the apply exits non-zero on the fixture.

The scenario writes the sidecar form. A manifest written before sidecars existed holds the file bytes inline as base64 `content` with an `encoding` key, and the command and the README recovery script still read that older form. After a manifest is written, sidecars it does not reference are removed, while referenced sidecars stay as the undo record.

---

## 3. TEST EXECUTION

### Prompt

```
Apply the upgrade to this spec tree and keep a record I can restore from if it goes wrong.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the disposable repository, add the legacy packet and add the uncommitted note.

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
printf '\nUncommitted note.\n' >> specs/legacy-track/001-old-packet/spec.md
git status --porcelain
```

2. Run the apply and record its exit code.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --apply > "$OUT/apply.out" 2> "$OUT/apply.err"
echo "exit=$?"
cat "$OUT/apply.out"
cat "$OUT/apply.err"
```

3. Read the manifest and its sidecar. They live in the git directory, so they stay outside the working tree.

```bash
MANIFEST="$(git rev-parse --absolute-git-dir)/upgrade-legacy.manifest.json"
node -p 'JSON.stringify({ schema: require(process.argv[1]).schema, status: require(process.argv[1]).status })' "$MANIFEST"
node -p 'JSON.stringify(require(process.argv[1]).beforeImages[0])' "$MANIFEST"
node -e 'const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");const entry=JSON.parse(fs.readFileSync(process.argv[1],"utf8")).beforeImages[0];const saved=fs.readFileSync(path.join(path.dirname(process.argv[1]),entry.beforeImage.sidecar));console.log(crypto.createHash("sha256").update(saved).digest("hex")===entry.beforeImage.sha256)' "$MANIFEST"
```

4. Read the baseline and the git status.

```bash
BASE="$FIXTURE/specs/legacy-track/001-old-packet/upgrade-baseline.json"
node -p 'JSON.stringify({ recordedBy: require(process.argv[1]).recordedBy, findings: require(process.argv[1]).findings.length, refusals: require(process.argv[1]).refusals.length })' "$BASE"
git status --porcelain
```

### Expected

Step 1 prints ` M specs/legacy-track/001-old-packet/spec.md`. Step 2 prints `exit=0` and an apply report that starts with `plan changes=1`, then six `step` lines (`fill-frontmatter`, `anchor-repair`, `heal-spec-docs`, `lane-modes`, `repair-derived` and `migrate-generated-json`), then `recorded specs/legacy-track/001-old-packet (9 findings, 3 refusals)`. The report then prints the Downgrades section, the summary `inspected=1 active=1 archived=0`, the line `passing before=0/1 after=1/1` and the counts by rule. Its stderr is empty. Step 3 prints `{"schema":1,"status":"complete"}`, then the single before-image entry shaped like `{"path":"specs/legacy-track/001-old-packet/spec.md","beforeImage":{"kind":"file-bytes","sidecar":"upgrade-legacy.before-images/<64 hex>.bin","sha256":"<64 hex>","mode":420}}`, then `true` from the digest comparison. The entry carries no `content` key. Step 4 prints `{"recordedBy":"upgrade-legacy","findings":9,"refusals":3}`, then the git status lists ` M` for `plan.md` and `spec.md`, and `??` for `description.json`, `graph-metadata.json` and `upgrade-baseline.json`. The manifest file and the sidecar directory do not appear.

### Evidence

- The exit code from step 2 and the full text of `$OUT/apply.out`.
- The manifest status, the before-image entry and the digest result from step 3.
- The baseline counts and the git status from step 4.

### Pass / Fail

- **Pass**: The apply exits 0, the manifest status is `complete` with one before-image entry, the sidecar digest matches the recorded `sha256`, the baseline holds nine findings and three refusals, and neither the manifest nor the sidecar directory appears in the git status.
- **Fail**: The apply exits non-zero, the manifest status is `in-progress` after a zero exit, the sidecar is missing or its digest differs, the baseline counts differ from nine and three, or the manifest or the sidecar directory appears in the git status.

### Failure Triage

If the apply exits 2 with `--apply requires REPO to be a git repository`, the fixture lost its `.git` directory, so rebuild it. If the apply exits 2 with a message about an in-progress manifest, an earlier run was interrupted. The message names the manifest, so read it before any retry. Reset the fixture by deleting the fixture directory and building it again. If the digest line prints `false`, the sidecar was altered or the command read a different manifest directory. Never run this scenario against a real `specs/` tree.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [upgrade-legacy-reversibility-manifest.md](../../feature-catalog/tooling-and-scripts/upgrade-legacy-reversibility-manifest.md)
- Implementation: [upgrade-legacy.mjs](../../runtime/cli/spec/upgrade-legacy.mjs)

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --apply

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 467
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/upgrade-legacy-apply-manifest.md`
