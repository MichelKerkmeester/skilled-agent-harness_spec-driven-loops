# 12 - History inventory

Recorded on 2026-10-24 by a Claude Sonnet 5.5 sub-agent dispatched by the OpenCode 2 orchestrator, in the operator checkout on branch `main` at `9129007915a2b6ada693440ad106fd8eefa5e589`. The inventory is read-only and no history rewrite was run.

Path note: the tasks name `/tmp/psurf-clone-main` and `/tmp/psurf-tag-old-paths.txt`. The clone that T008 produced lives at `$S/psurf-clone-main` with `S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad`, so every command below uses `$C` for that clone and the tag file sits at `$S/psurf-tag-old-paths.txt`. The clone `HEAD` read `9129007915a2b6ada693440ad106fd8eefa5e589` with an empty `git status --porcelain`, which equals the operator checkout tip.

## A - Reachable objects

```bash
S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad
C=$S/psurf-clone-main
git -C $C rev-list --objects --all | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)'
```

Output:

```text
1681
```

For scale, `git -C $C rev-list --objects --all | wc -l` printed `865369` reachable objects in all.

Expected: 1814 at the measured tip; a different count is recorded, not corrected

Result: not held against the original number. The live count at `9129007915` is 1681, which is 133 fewer than 1814. The operator ruling of 2026-10-24 amended the expectation to 1681, so against the amended expectation it holds. The count is recorded as found and the inventory itself succeeded (exit status 0 from the pipeline). It is non-zero, so old paths remain reachable in history.

## B - Tags

```bash
git -C $C tag --list | wc -l
for t in $(git -C $C tag --list); do printf '%s %s\n' "$t" "$(git -C $C ls-tree -r --name-only "$t" | grep -c -E 'sk-code-(webflow|obsidian)|local-(webflow|obsidian)')"; done > $S/psurf-tag-old-paths.txt
awk '$2>0' $S/psurf-tag-old-paths.txt | wc -l
```

Output:

```text
157
18
```

Tags with a non-zero old-path count (`awk '$2>0' $S/psurf-tag-old-paths.txt`):

```text
backup/0146-restore2 159
backup/pre-031-push 159
backup/pre-v4-integration 159
v4.0.0.0 310
v4.0.0.0-beta.1 159
v4.0.0.1 310
v4.0.0.10 336
v4.0.0.11 336
v4.0.0.12 336
v4.0.0.13 336
v4.0.0.2 310
v4.0.0.3 324
v4.0.0.4 336
v4.0.0.5 336
v4.0.0.6 336
v4.0.0.7 336
v4.0.0.8 336
v4.0.0.9 336
```

The tag file holds 157 lines (`wc -l`), one per tag.

Context checks, read-only:

```bash
git -C $C ls-remote --tags origin | grep -v '\^{}' | wc -l
git -C /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public tag --list | wc -l
```

```text
157
164
```

The remote carries 157 tags and the operator checkout carries 164 local tags. The 164 in the task's Expected line matches the local count, so the 7 extra tags exist only locally and a fresh clone never sees them.

Expected: `164` at the measured tip or a recorded different count, then a count of at least `1`

Result: against the original expectation the tag count is 157 (not 164), and the operator ruling of 2026-10-24 amended it to 157, so it holds as amended. The recorded difference is 7 tags that exist only in the operator checkout. The non-zero count is 18, which is at least 1, so that half held.

## C - Releases

```bash
gh release list --limit 30
for t in $(gh release list --limit 30 --json tagName --jq '.[].tagName'); do gh release view "$t" --json tagName,assets; done
```

Release list (exit status 0, 30 lines, columns are title, state, tag and publish time):

```text
v4.0.0.13 — Endless Sessions & OpenCode v2 Plugin Support	Latest	v4.0.0.13	2026-10-23T06:56:23Z
v4.0.0.12 — The Advisor Sends You to the Right Doctor		v4.0.0.12	2026-10-17T17:03:30Z
v4.0.0.11 — Prove Your Git Setup in One Command		v4.0.0.11	2026-10-17T11:32:58Z
v4.0.0.10 — Adapt sk-code to Your Stack, Keep Untrusted Clones Out		v4.0.0.10	2026-10-14T21:17:35Z
v4.0.0.9 — Every Skill Doc Carries Its Own Version		v4.0.0.9	2026-10-14T21:17:30Z
v4.0.0.8 — A Fresh Clone Works, and Tools Refuse Bad Input		v4.0.0.8	2026-10-14T21:17:25Z
v4.0.0.7 — The Deep Loop Runs Three Modes, and Routing Reads Intent		v4.0.0.7	2026-10-14T21:17:20Z
v4.0.0.6 — Code Reviews Say What They Skipped		v4.0.0.6	2026-10-14T21:17:15Z
v4.0.0.5 — Spec Repairs Write Only What Evidence Proves		v4.0.0.5	2026-10-14T21:17:10Z
v4.0.0.4 — Packets, Rules and Runtimes Stay Current		v4.0.0.4	2026-10-14T21:17:05Z
v4.0.0.3 — Update Safely, Commit Clearly, Read Plainly		v4.0.0.3	2026-10-05T20:24:49Z
v4.0.0.2 — A Steadier Skill Advisor, Findable Changelogs and Leaner Goals		v4.0.0.2	2026-09-28T20:01:19Z
v4.0.0.1 — The Foundation Hardened: Old Specs Forward and Quieter Sessions		v4.0.0.1	2026-09-25T12:12:29Z
v4.0.0.0 — The Foundation Rebuilt: Spec Kit, Deep Loops and Parent Skills		v4.0.0.0	2026-09-21T18:45:00Z
v3.6.0.0 — Harder Core, Longer Reach		v3.6.0.0	2026-06-18T19:51:03Z
v3.5.0.4 — The Deferred Lifecycle, Closed		v3.5.0.4	2026-06-08T03:33:45Z
v3.5.0.3 — One Voice for Every Skill README		v3.5.0.3	2026-06-08T03:33:43Z
v3.5.0.2 — Sessions Keep Their Hands to Themselves		v3.5.0.2	2026-06-06T17:02:19Z
v3.5.0.1 — Right Hooks, Honest Reverts		v3.5.0.1	2026-06-06T16:28:11Z
v3.5.0.0 — Memory That Maintains Itself		v3.5.0.0	2026-06-05T16:51:12Z
v3.4.1.0 — Now You Can Watch It Run		v3.4.1.0	2026-05-09T09:17:50Z
v3.4.0.0 — Memory That Actually Sticks		v3.4.0.0	2026-04-16T14:33:57Z
v3.3.0.1 -- Incremental Entity Linking + Scheduled Graph Refresh		v3.3.0.1	2026-04-05T09:27:53Z
v3.3.0.0 -- Compact Code Graph + Agent Improver Skill		v3.3.0.0	2026-04-04T16:08:22Z
v3.2.2.0 -- Implicit feedback signal pipeline		v3.2.2.0	2026-04-03T16:30:36Z
v3.2.1.0 - System Spec Kit Release		v3.2.1.0	2026-04-03T12:00:52Z
v3.2.0.1 -- Post-release hardening		v3.2.0.1	2026-04-02T17:08:48Z
v3.2.0.0 — ESM Module Compliance + Compact Code Graph		v3.2.0.0	2026-04-02T15:59:06Z
v3.1.5.0 -- Frontmatter compliance + memory indexing + search retrieval quality fixes		v3.1.5.0	2026-03-31T14:25:59Z
v3.1.4.0 -- 10 search optimizations + 4 P1 review fixes		v3.1.4.0	2026-03-30T18:27:31Z
```

One asset line per release (exit status 0, 30 lines):

```text
{"assets":[],"tagName":"v4.0.0.13"}
{"assets":[],"tagName":"v4.0.0.12"}
{"assets":[],"tagName":"v4.0.0.11"}
{"assets":[],"tagName":"v4.0.0.10"}
{"assets":[],"tagName":"v4.0.0.9"}
{"assets":[],"tagName":"v4.0.0.8"}
{"assets":[],"tagName":"v4.0.0.7"}
{"assets":[],"tagName":"v4.0.0.6"}
{"assets":[],"tagName":"v4.0.0.5"}
{"assets":[],"tagName":"v4.0.0.4"}
{"assets":[],"tagName":"v4.0.0.3"}
{"assets":[],"tagName":"v4.0.0.2"}
{"assets":[],"tagName":"v4.0.0.1"}
{"assets":[],"tagName":"v4.0.0.0"}
{"assets":[],"tagName":"v3.6.0.0"}
{"assets":[],"tagName":"v3.5.0.4"}
{"assets":[],"tagName":"v3.5.0.3"}
{"assets":[],"tagName":"v3.5.0.2"}
{"assets":[],"tagName":"v3.5.0.1"}
{"assets":[],"tagName":"v3.5.0.0"}
{"assets":[],"tagName":"v3.4.1.0"}
{"assets":[],"tagName":"v3.4.0.0"}
{"assets":[],"tagName":"v3.3.0.1"}
{"assets":[],"tagName":"v3.3.0.0"}
{"assets":[],"tagName":"v3.2.2.0"}
{"assets":[],"tagName":"v3.2.1.0"}
{"assets":[],"tagName":"v3.2.0.1"}
{"assets":[],"tagName":"v3.2.0.0"}
{"assets":[],"tagName":"v3.1.5.0"}
{"assets":[],"tagName":"v3.1.4.0"}
```

Every one of the 30 releases reports `"assets":[]`, so no release carries an asset archive. No asset archive was opened, so any archive contents stay `UNKNOWN`.

Wider check, read-only, outside the task's `--limit 30`:

```bash
gh api --paginate repos/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases --jq '.[] | "\(.tag_name) \(.assets|length)"'
```

It printed 146 lines and the filter `awk '$2>0'` over them printed nothing, so all 146 hosted releases carry zero assets. The `--limit 30` window therefore covers 30 of 146 releases and the other 116 were checked for asset counts only.

Expected: the release list, then one JSON object per release naming its assets

Result: held. The list and 30 objects are present and none names an asset.

<!-- evidence:end -->
