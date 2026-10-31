---
title: "Resource Map — Redesign /doctor:update into a release-aware updater for this framework. It must smartly detect which release tag the operator's checkout is on (tags, changelog versions, skill version frontmatter), find the latest upstream release, and compute what changed between the operator's current state and that release. For skills the operator has NOT customized, it updates them to the release. For skills the operator HAS customized or overridden locally (for example sk-git or sk-code), it must not overwrite: it proposes fixes that align them with the latest release while keeping the repo's own override specifics. Detection of customization and the alignment proposals must be smart (three-way merge against the release base, provenance markers, hashes, git history), and where manual, guided and evidence-backed. Decide whether this is one command or several (for example check, apply, align), what happens to today's database-rebuild behaviour of /doctor:update, and specify each resulting command's workflow YAML to the sk-create-command contract (thin router, -presentation.txt, workflow YAML with approval gates, rollback, dry-run). Ground every claim in this repository: .skilled/commands/doctor/, .skilled/changelog/, skill changelogs and versions, sk-git, sk-doc/sk-create-command, the install and sync scripts."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 0
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=0, Specs=0, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 003-update
- **Generated**: 2026-10-02T20:59:41.572Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.
