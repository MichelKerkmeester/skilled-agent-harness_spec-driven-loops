---
title: Official Orca Skill Snapshots - Provenance
description: Verbatim provenance for the eight official Orca Agent Skills vendored as flat .txt snapshots in assets, with per-skill release revisions, package digests and file hashes.
trigger_phrases:
  - "orca official skill provenance"
  - "orca skill snapshot release revision"
  - "package digest orca skill"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Official Orca Skill Snapshots - Provenance

Verbatim `SKILL.md` snapshots of the eight official Orca Agent Skills, vendored so this skill can read upstream wording without a network call. Do not edit the snapshot files; refresh them from a newer snapshot instead.

---

## 1. OVERVIEW

Each `assets/<skill-name>.txt` file holds the unmodified `SKILL.md` of one official Orca Agent Skill, copied from the vendored `orca-main` source tree recorded below. The snapshot exists because the official files are hybrid discovery stubs whose real flags live in the installed binary, and a local skill that paraphrases them would drift. The records in this directory let a future maintainer prove which upstream revision each file came from.

The `.txt` extension is deliberate. The files are byte-for-byte upstream copies, and the repository's skill-doc contracts require every `.md` under `references/` or `assets/` to carry its own frontmatter block with a four-part `version`. An upstream file cannot satisfy that without being edited, so the snapshots stay out of that scope by extension and keep their bytes.

**Ownership**: `cli-orca` owns this snapshot directory. The upstream wording itself belongs to the Orca project.

---

## 2. SNAPSHOT SOURCE

| Field | Value |
|---|---|
| Upstream repository | `github.com/stablyai/orca` |
| Snapshot tree | `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/` |
| Skill source path | `<snapshot>/skills/<skill-name>/SKILL.md` |
| Local snapshot path | `assets/<skill-name>.txt` |
| Record files | `<snapshot>/resources/skills/current-manifest.json`, `snapshot-registry.json`, `release-mapping.json` |
| Declared app version | `1.4.197` (`<snapshot>/package.json` `version` field) |
| Snapshot date | 2026-09-20 (directory creation time of the vendored tree) |
| Source commit | UNKNOWN - the snapshot carries no `.git` directory and records no commit id |

---

## 3. PER-SKILL RELEASE RECORDS

Values are read from `<snapshot>/resources/skills/current-manifest.json` and verified against the copied files.

| Skill | releaseRevision | packageDigest | gitTreeSha | SKILL.md sha256 |
|---|---|---|---|---|
| `computer-use` | 9 | `ff60c0d0fcb142047fbb83477b829459cfb57d9e6f7fb715644e2b13aa441bf1` | `335986bf5b78557d5d6973eea183eeb2dc527eba` | `244b06656c849aaaa79c29a6053fd4c2be98933ca10bd1edaeb727ce73ede793` |
| `linear-tickets` | 11 | `2c8a0bae253341fd3147e3fc0b41ab1a298df31f6768be46eee31b7da9a4b059` | `01b3a89c1c3209f8b2de1ae05014937b0cfc58b2` | `af2d33d98c21e22726a6a36a3e41b1967770c4df6691530d02409d8aca861c15` |
| `orca-cli` | 37 | `15b5fd49198b080322a55545932acfb2e8351c88746fac468df73ea999693260` | `ae1a86f92d7bf38f4dc161cc0c57e15a74f54832` | `6522a3355993b377abe7d7a5c8f6a00f9726e1a6a6b9aa9c015651e8d0f5e6b8` |
| `orca-emulator` | 8 | `54a3b8e534d3e9cb63fab11bfd3690908b21385398da06c618b6fd63851317c5` | `bd23a74f2c55b393fe288f9e2806d0ebc028a513` | `654746c72c0fa4aaa540c3aa7450413404450c195bcdeaf0aaa27fa114d0f058` |
| `orca-emulator-android` | 6 | `bf670be58d2650274943b32b1abcdc58b135b0ad81f96aaee491f47af32fe2f5` | `2dd0b64d4e5ef4748b5fb30fb7bdf0aa13f51084` | `ae242330d98c9335160fbd4356894e15633d63c02da4edfd7109ab1845368002` |
| `orca-linear` | 9 | `86c7e2b1d2712cea280ceac45b2cefcb98591cb25fa46539cc9e159338caa1bb` | `2b0b3b3d422f0d9cdb88574e955c345ed4370ea8` | `85ee0d4d3cfadfec301e3a852c8ff959a1f366ac51b9c312cf463f050e427e72` |
| `orca-per-workspace-env` | 6 | `b41563e217d38af2ded7d88ea099a9f996a5280f3333e771a2867a0e3f680055` | `49103d96472ad790758f14cfc3ed5c69434a6f1b` | `d3a23c0d3e87c6024f710145e0cc6e5c7eb37eda1386c27d074f2538a92b7d1c` |
| `orchestration` | 29 | `00d30c68d91693b6210e43c1fca9ba8b8711e31b4d76d1fcbeaa6257209d569f` | `23bc2ff6bb9f6e7d17f41734709ac951dbe3ee80` | `36bc32f022447418b566db35f9ffcff75113eb023e37d06fd1bd609c5dd173ef` |

### Release-Mapping Status

`<snapshot>/resources/skills/release-mapping.json` maps skill revisions onto app versions; its final row is `1.4.178-rc.2` and it lists one revision behind the manifest for most skills (for example `orca-cli` 36 against the manifest's 37). The manifest revisions above are therefore current but not yet covered by a released app version in that file.

---

## 4. VERIFICATION

The copies were verified, not assumed. Each `assets/<skill>.txt` was compared byte for byte against its snapshot source with `cmp`, and its sha256 was compared against the manifest's `exactSha256` field. Both checks pass for all eight files, so the rows in section 3 describe the files actually shipped with this skill.

---

## 5. MAINTENANCE

Refresh procedure when a newer Orca snapshot is vendored:

1. Copy each `<snapshot>/skills/<skill>/SKILL.md` over the matching `assets/<skill>.txt` without reformatting it.
2. Regenerate the section 3 table from the new `current-manifest.json`; copy the values rather than transcribing them.
3. Re-run the byte and hash comparison from section 4.
4. Record the new declared app version, snapshot date and source commit status in section 2.
5. Bump this file's frontmatter version and add a changelog entry when the snapshot meaningfully changes.

If a snapshot file cannot be matched to a manifest entry, stop and record the mismatch instead of guessing.
