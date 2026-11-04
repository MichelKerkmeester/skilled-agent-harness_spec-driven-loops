VERDICT: FIX

- [P2] .skilled/skills/cli-external-orchestration/ROUTER.md:23 | 4 | The Overview lacks Purpose and When to Use sections; the use guidance appears only in the intro. | Add `### Purpose` immediately after `## 1. OVERVIEW` and keep the existing overview paragraphs under it. After those paragraphs, before the section divider, add:
  ```markdown
  ### When to Use

  Open this router after mode selection when the request's CLI-dispatch intent must be mapped to packet-local leaf resources.
  ```