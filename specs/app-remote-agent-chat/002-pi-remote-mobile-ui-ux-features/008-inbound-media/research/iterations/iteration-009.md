<!-- provenance: external-CLI orchestration pass; original file iter-09-grok.md -->
> **Source pass 9** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-9-grok.md`.

<!-- F8-inbound-media | model=grok | lens=competitive-teardown | iter 9/15 | 2026-08-16T04:47:14.933Z -->

I have enough cited product evidence to write the teardown. The report below is the iteration-9 competitive pass only.

# Iteration 9 — Competitive teardown: inbound screenshot / image preview (Pi Remote)

**Lens:** How Claude iOS, Kimi Code, ChatGPT, Perplexity, DeepSeek, Gemini, and Meta AI actually present **images that arrive in the transcript**, and what a security-first iPhone PWA must copy, refuse, or split.  
**Constraint:** ink-on-parchment (bone `#f8f8f6` / carbon ink / clay `#d97757`; Inter + Source Serif 4), light + dark, WCAG AA, React 19 + Vite + Tailwind 4 + react-aria-components. Mutations stay one-use ticketed + revision-checked and fail closed. Reuse F6 for the viewer.  
**Evidence limits:** Mobbin MCP was not callable in this session (no authenticated Code Mode tools). Public Mobbin pages were crawled; they confirm flow *titles* and tags, not pixel measurements. Layout numbers for Claude iOS come from this repo’s staged teardown at ~390 CSS px. Where a vendor documents a gesture in first-party help, that is treated as stronger than a Mobbin caption.

---

## 1. Findings for this lens

### 1.1 The target bar is two products, not one

“Match Claude iOS” is not a single interaction.

| Surface | What actually happens with images | Source |
|---|---|---|
| **Claude chat iOS** | User-attached photos live in the thread. Assistant *artifacts* (code, SVG, diagrams, HTML) open a **dedicated viewer**, not a Photos-style inline raster. Anthropic’s help: artifacts appear in a window **separate from the main conversation**; lower-right of that window exposes view-code, copy, and download. | [Claude artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them) |
| **Claude chat iOS (visual)** | Assistant turn: Source-Serif prose, **no bubble**. Artifact **card** in flow: ~16 px radius, hairline, near-canvas fill, title + muted subtitle, **small tilted thumbnail on the right**, optional centered `1 artifact` pill above the turn. Action row under the turn (copy · share · speak · thumbs · retry). | [01-visual-teardown.md](docs/design-reference/mobile-chat-apps/01-visual-teardown.md); staged `screens/claude-conversation-actions.png` |
| **Claude iOS image *input*** | Mobbin flow **“Chatting with Claude (image input)”**: user attaches an image, asks for a translation, app returns **text**. This is F5’s direction, not F8. | [Mobbin flow d386db15](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1), [Mobbin screen 63d3bc73](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8) |
| **Claude Code iOS (remote session)** | Host-generated images **do not render inline**. `SendUserFile` of a PNG/SVG is a **generic file chip**; markdown `data:` URIs render as literal text. `Read` of a PNG can render inline on some clients, but **SendUserFile does not**. Users report the picture *is* the content and tap-to-open “defeats the purpose.” | [claude-code#61995](https://github.com/anthropics/claude-code/issues/61995), [claude-code#41300](https://github.com/anthropics/claude-code/issues/41300), [claude-code#66194](https://github.com/anthropics/claude-code/issues/66194) |
| **Claude Code artifacts on mobile** | Published `claude.ai/code/artifact/…` pages list on web/desktop; **the mobile Artifacts view does not list them**. Workaround: paste the URL in a signed-in browser. | [claude-code#78792](https://github.com/anthropics/claude-code/issues/78792) |

**Implication for Pi Remote:** the closest *product* analog is **Claude Code remote-control on iOS**, and that product **fails this feature**. Matching the Claude *chat* artifact chip without showing pixels would ship the same failure users already file against Claude Code. Matching ChatGPT’s large generated-image well without a file identity would ignore Claude’s work-oriented card (title, type, revision) that F6 already specified.

**Build rule:** inbound host screenshots are a **third species**: Claude’s **card chrome** + Kimi/ChatGPT’s **visible pixels** + F6’s **owned fullscreen**, never Claude Code’s chip-only path and never Claude’s “Download → system preview” handoff ([iter-01 already flagged system preview](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude); this pass adds the Claude Code split as the reason the chip-only path is disqualified).

Anthropic also states Claude **does not natively generate photos/illustrations**; PNG visualizations and files are the output analog. ([Can Claude produce images](https://support.claude.com/en/articles/9002504-can-claude-produce-images))

### 1.2 Kimi Code is the only coding-agent transcript that already does *inbound* pixels

Kimi’s Web UI is the documented prior art for **tool-returned media**, not user attach:

1. `ReadMediaFile` results render as **clickable image/video thumbnails**. ([Kimi Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html) § Tool output)
2. Images also **display directly in chat**. Same page, § Rich media.
3. **Collapse invariant (2026 changelog):** tool media previews stay visible when tool details collapse — thumbnails render **below the tool card**, not inside the collapsible detail. ([kimi-cli CHANGELOG](https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md))
4. **Click-to-enlarge** for uploaded images: “Click an image in a message to open it.” ([Kimi changelog](https://moonshotai.github.io/kimi-code/en/release-notes/changelog.html))
5. **Error fallback UI** when images fail to load. ([CHANGELOG v1.9 media preview](https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md))
6. Transparent images sit on a **checkerboard**. ([Kimi changelog](https://moonshotai.github.io/kimi-code/en/release-notes/changelog.html))
7. Resume/reload bug they had to fix: `ReadMediaFile` results rendered as **plain tool cards instead of images** after session reload. That is the exact durability bug F8 must not ship. ([Kimi changelog](https://moonshotai.github.io/kimi-code/en/release-notes/changelog.html))
8. Mobile layout: **collapsible drawer sidebar**; transcript model does not change. ([Kimi Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html) § Responsive layout)
9. Bytes are **not** kept in `wire.jsonl`: large base64 is offloaded to external blob files with an in-memory `BlobStore` cache. ([Kimi changelog](https://moonshotai.github.io/kimi-code/en/release-notes/changelog.html))
10. On HTTP 413, older media is replaced by **text markers** and the request retries — the transcript stays a stable row, not a broken `<img>`. ([Kimi changelog](https://moonshotai.github.io/kimi-code/en/release-notes/changelog.html))

**Kimi compression (model-read, not display):** `[image] max_edge_px` default **2000** (later changelog raises a downscale cap to **3000**); `read_byte_budget` default **262 144 (256 KB)** for `ReadMediaFile` default reads; `region` and `full_resolution` **bypass** that budget. PNG screenshots stay lossless until the byte budget forces JPEG. If compression cannot meet limits, `ReadMediaFile` **errors without sending the original**. File-size cap on the tool is **100 MB**. ([Kimi config files](https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/config-files.html); [Kimi tools](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/tools.html); [kimi-code#1243](https://github.com/MoonshotAI/kimi-code/commit/ace79010669d19ad175bc25443b6efb41ca2e2ac); [changelog 2000→3000](https://moonshotai.github.io/kimi-code/en/release-notes/changelog.html))

**Negative example in the same commit:** an earlier compression path was **best-effort pass-through** if compression failed, and huge-dimension PNGs could OOM Jimp. Pi Remote’s F5/F6 posture is the opposite: fail closed (`withheld` / `corrupt`), never pass original bytes to the PWA. ([kimi-code#1243](https://github.com/MoonshotAI/kimi-code/commit/ace79010669d19ad175bc25443b6efb41ca2e2ac); [F6 spec](specs/002/F6-file-preview/spec.md); [F5 spec](specs/002/F5-media-upload/spec.md))

**Kimi network posture (relevant because `kimi web` is a remote-CLI UI):** default bind `127.0.0.1:5494`; `--network` + `--auth-token` (≥32 random chars) + `--allowed-origins` + `--lan-only` (default) / `--public`; `--restrict-sensitive-apis` disables open-in and file access. Pi Remote already has a stricter tailnet + enrollment model; do not copy Kimi’s `--dangerously-omit-auth`. ([Kimi Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html))

### 1.3 ChatGPT iOS — generated images are first-class; the library is the anti-pattern

**Documented sequences**

| Step | ChatGPT iOS behavior | Source |
|---|---|---|
| Composer | Camera glyph on the input field (user-attach). | [Mobbin screen f7e6514e](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1) |
| After send | Used to show a **gray box** until the server echoed the upload; now shows the **preview immediately**. | [ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) |
| Generated image in thread | Dark-mode conversation screens on Mobbin are tagged “generated images and message input” — the image sits **in the transcript**, not a separate pane. | [Mobbin screen 3aa59b0a](https://mobbin.com/explore/screens/3aa59b0a-9d5e-451b-af8d-21acfd81064b); [Mobbin DALL·E flow 205d7105](https://mobbin.com/explore/flows/205d7105-5ad4-42b5-aa8f-9b970e1d8983) |
| Tap | Opens a dedicated image surface (editor on consumer Images). Copy / Save / Share live on that surface. | [ChatGPT Image library](https://help.openai.com/en/articles/11084440-chatgpt-image-library) |
| Second home | Generated images also land in a persistent **Images library**. | Same |
| Codex iOS (coding analog) | Added **save or copy rendered images** as explicit actions. | [ChatGPT for iOS release](https://releases.sh/release/rel_2lA0Wqh52bOT4XrQq4px9) |
| Apps SDK inline card | Inline widget **always appears before** the model’s prose. Max **two** primary actions. **No nested scroll. No drill-in navigation.** Expand control opens fullscreen. | [OpenAI Apps SDK UI guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines) |
| Apps SDK fullscreen | Composer **stays overlaid**. Thinking shimmer on the composer. Ephemeral truncated snippet above composer; tap opens a chat sheet. | Same |
| Apps SDK carousel | **3–8** items; each item has an image, title, ≤2 lines metadata, optional single CTA. | Same |
| Apps SDK PiP | Floating window pinned while conversation continues; returns to inline when the session ends. | Same |

**Copy:** immediate reserved well (never a gray hole); tap-to-expand; card actions ≤2; screenshot sits **before** the assistant’s explanation when it came from a tool.

**Refuse:** Images library; public share links; in-viewer editor; carousel of search-style crops; fullscreen-with-composer (see §3 — it fights F6’s inert background and screenshot privacy).

OpenAI image **input** (not display): PNG, JPEG, non-animated GIF, **20 MB**, resized for analysis; original filenames/metadata not processed. ([Image inputs FAQ](https://help.openai.com/en/articles/8400551-image-inputs-for-chatgpt-faq)) GIF remains out of F5/F8 v1.

### 1.4 Gemini iOS — official split: tap = look, long-press = export

First-party iPhone/iPad help is unusually precise:

1. Generate from **Menu → Images** (or Live).
2. **Tap** the image → **larger version**.
3. **Back** returns to chat.
4. **Touch and hold** → **Save** (downloads to the device) or **Share** (**creates a public link**).
5. Chat share below a response can include uploaded images on the shared page (`g.co/gemini/share/…`).
6. Download resolution: **2K** with a Google AI plan, **1K** without.

([Gemini Apps: generate & edit images, iOS](https://support.google.com/gemini/answer/14286560?hl=en&co=GENIE.Platform%3DiOS); [Share chats, iOS](https://support.google.com/gemini/answer/13743730?hl=en&co=GENIE.Platform%3DiOS))

Mobbin’s Gemini flow **“Asking Gemini”** is again **user-upload → identify place → open Maps**, not agent-inbound. ([Mobbin flow e5b8846f](https://mobbin.com/explore/flows/e5b8846f-e7bb-481a-82bd-47f29bfb6653))

Local teardown of Gemini shows a **plan card + action row + disclaimer**, not an image viewer. ([01-visual-teardown.md](docs/design-reference/mobile-chat-apps/01-visual-teardown.md))

**Copy:** tap must open a larger view; Back/Close must return to the originating turn; export must never be the primary tap.

**Refuse:** public-link Share; long-press as the *only* way to open (undiscoverable, and F6 already forbids custom long-press in v1).

### 1.5 Perplexity iOS — interleaved editorial images, portrait lock, auto-preview

- App Store / store screenshots: answers interleave a **large image with citations**, not a trailing media section. ([Perplexity App Store](https://apps.apple.com/us/app/perplexity-ask-anything/id1668000334))
- Extracted design notes (third-party DESIGN.md, treat as measured *intent*, not Anthropic-grade): iPhone content width = full minus **16 pt** margins; source cards **200×80 pt**, **12 pt** radius, **12 pt** padding, **12 pt** gap, **16 pt** leading inset; attach sheet is a **24 pt** top-radius bottom sheet with **56 pt** rows. ([Perplexity DESIGN.md](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/perplexity/DESIGN.md))
- Community: the iOS app **locks portrait**; wide tables/charts cannot rotate. Request: landscape *only* for expanded sources/tables/charts. ([Perplexity forum](https://community.perplexity.ai/t/feature-request-landscape-mode-support-for-viewing-sources-tables-and-charts/5627))
- Asset workflow (first-party, previously crawled; this session’s fetch was Cloudflare-blocked): generated assets **auto-open a preview**; a side panel has **Expand** then download/share and **version history**. Uploads JPEG/HEF/PNG/PDF up to **40 MB**, reformatted; vendor claims uploads are not retained. ([Perplexity assets overview](https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview); [Uploading images](https://www.perplexity.ai/help-center/en/articles/10354840-uploading-images-on-perplexity))
- Mobbin: generic chat-bot screen, no image-viewer caption. ([Mobbin 67ff18d6](https://mobbin.com/explore/screens/67ff18d6-4a29-418d-9f55-b51010e0b462))

**Copy:** keep the screenshot **next to the prose that explains it**; show **exact revision** (Perplexity version history).  
**Refuse:** auto-open (F6: never auto-open); search-style crops; relying on landscape (Pi Remote v1 is portrait iPhone PWA; F6 image uses `contain`, not rotation).

### 1.6 DeepSeek iOS — vision is inbound-*understanding*, not inbound-*preview*

- App Store “What’s New”: **Supports vision mode**. Requires iOS 15+. ([DeepSeek App Store](https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349))
- Third-party iOS writeup (April 2026 V4): image upload exists, **full visual understanding still limited**; the model “primarily extracts and processes text from documents.” Web has a code sandbox the iOS app does not. ([deepseeksr1.com/ios-app](https://deepseeksr1.com/ios-app/))
- Version history (DE store, previously cited): copy / download / **fullscreen preview for tables** — DeepSeek treats *complex output* as a separate preview surface, but that surface is documented for **tables**, not host screenshots. ([DE App Store](https://apps.apple.com/de/app/deepseek-ki-assistent/id6737597349))
- Mobbin: chat-bot + top nav, no media caption. ([Mobbin 9fa85a22](https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4))

**Lesson:** do not encode a host screenshot as extracted text, markdown, or a tool-result URL. If pixels cannot be shown, use Kimi’s **text marker** / F6 `withheld` card — never a fake “image understood” paragraph.

### 1.7 Meta AI iOS — conversation-native pixels optimized for distribution

Documented iOS sequence for generated/edited images:

1. Image sits **in the chat**.
2. **Menu → Media → Creations** is a second durable gallery.
3. Tap image → edit / restyle / swap / lip-sync.
4. **Upper-right toolbar** Download; Share to Instagram, Facebook, WhatsApp, Messenger.
5. Edits sync into a **Media gallery across Meta AI and Vibes**.
6. Incognito Chat is a separate private mode — implying the default chat is *not* treated as ephemeral.

([Meta: how to edit photos](https://ai.meta.com/learn/ai-creativity/how-to-edit-photos-with-ai/); [Meta Help: edit/animate](https://www.meta.com/help/artificial-intelligence/517678174532704/); [Meta AI App Store](https://apps.apple.com/us/app/meta-ai/id1558240027))

Local teardown of Meta AI home: suggestion rows + composer with model + mic + voice — no inbound screenshot. ([01-visual-teardown.md](docs/design-reference/mobile-chat-apps/01-visual-teardown.md))

**Copy:** upper-trailing overflow is where Save/Share live in consumer apps — Pi Remote should put **Details** there, not social destinations.  
**Refuse:** Creations/Discover/remix; social share shortcuts; treating screenshots as creative assets.

### 1.8 Apple Photos is the gesture grammar iPhone users already have

Apple’s own Photos guide (the platform default, not an AI app):

- Tap a library cell → **fullscreen**.
- **Tap the photo** → hide on-screen controls; tap again to show. ([View photos and videos on iPhone](https://support.apple.com/guide/iphone/view-photos-and-videos-iph3d267610/ios))
- **Double-tap or pinch out** to zoom; **drag** to pan; double-tap or pinch in to zoom out. ([View photos, iOS 16 guide](https://support.apple.com/guide/iphone/view-photos-iph3d267610/16.0/ios/16.0))
- **Swipe left/right** to browse siblings; swipe the filmstrip to jump. ([iOS 26 guide](https://support.apple.com/guide/iphone/view-photos-and-videos-iph3d267610/ios))
- **Swipe up** (or Info) for metadata. Same.
- Grid **long-press** (iOS 26 coverage): Share, Copy, Favorite, Delete **without opening**. ([Photos 101, iOS 26](https://appleinsider.com/inside/ios-26/tips/inside-photos-in-ios-26-macos-26----refinements-in-apples-image-and-video-management-tool))
- Fullscreen chrome: Back top-left; bottom row Share / Favorite / Info / Edit / Delete.

F6 already **rejects** custom swipe-down dismiss and horizontal artifact paging because they collide with pan/zoom. ([F6 spec](specs/002/F6-file-preview/spec.md) DECISION + §Gestures) That is a **deliberate divergence from Photos**, and it is the right one for a coding screenshot: there is no album of siblings, and a downward swipe would fight vertical pan at 1×.

**Copy from Photos:** tap-to-toggle chrome; pinch + double-tap zoom; Info via an explicit control (not a hidden swipe-up as the only path).  
**Do not copy:** sibling swipe; Edit; Favorite; automatic Photos-library save; grid long-press as the open gesture.

WCAG 2.2 SC 2.5.8 Target Size (Minimum) is **24×24 CSS px**; Apple HIG hit targets are **44×44 pt**. Use 44×44 throughout. ([WCAG 2.2 Understanding target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html); [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility))

### 1.9 Other remote-CLI / mobile clients (GitHub)

These are not the UX bar, but they show how the category currently fails inbound pixels:

| Client | Inbound image behavior | Repo / note |
|---|---|---|
| **Cline** | Browser tool captures screenshots for the *model*; a `read_file` image change **does not open/show** the image in chat (“Successfully read image”). Conservative, fails the Claude/Kimi visual bar. | [cline#4411](https://github.com/cline/cline/pull/4411); [Cline README computer-use](https://github.com/aicccode/cline) |
| **OpenCode web / Conduit PWA** | Full GUI on phone: diffs, terminal, camera **attach** (outbound). No documented inbound screenshot card. PWA-installable, LAN, PIN auth. | [dibstern/conduit](https://github.com/dibstern/conduit) |
| **OpenClient for OpenCode** | Native iOS: attach files, Excalidraw sketch, live tool activity. No inbound raster viewer in the App Store copy. | [App Store 6763641767](https://apps.apple.com/us/app/openclient-for-opencode/id6763641767) |
| **Claude Code iOS** | File chip / literal text (see §1.1). | [claude-code#61995](https://github.com/anthropics/claude-code/issues/61995) |
| **pi-mono** | RPC `images` on **prompt/steer/follow_up only**; assistant content is text/thinking/toolCall. Tool results in `@mariozechner/pi-ai` already type `ImageContent` `{type, data, mimeType}`. | [pi RPC](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md); [pi-ai types](https://github.com/badlogic/pi-mono/blob/main/packages/ai/src/types.ts) |
| **Mobbin MCP → Claude** | `mobbin_get_screen_detail` can return an **inline image content block**; users then complain thumbs are too small and there is no convenient fullscreen. | [aos-engineer/mobbin-mcp](https://github.com/aos-engineer/mobbin-mcp); [LinkedIn, Liau](https://www.linkedin.com/posts/liaujianjie_the-mobbin-mcp-now-displays-the-screens-inline-activity-7465351105502294016-qvs1) |

**Category conclusion:** consumer AI apps show **generated** pixels inline. Coding-agent **mobile** clients mostly do not show **host** pixels. Kimi Web is the exception. Pi Remote can win the category by shipping Kimi’s “pixels survive tool collapse” on an iPhone, which neither Claude Code iOS nor Cline currently does.

### 1.10 Cross-app interaction matrix (what F8 must implement)

| Job | Claude chat iOS | Claude Code iOS | Kimi Web | ChatGPT iOS | Gemini iOS | Perplexity iOS | DeepSeek iOS | Meta AI iOS | Apple Photos | **Pi Remote F8** |
|---|---|---|---|---|---|---|---|---|---|---|
| Inline pixels in transcript | Artifact **thumb** (~44 px, tilted) | **No** (chip/text) | **Yes**, below tool card | **Yes**, large well | **Yes**, generated | **Yes**, editorial | **Not documented** | **Yes** | N/A (library) | **Yes**, screenshot well + identity chrome |
| Open larger view | Artifact window / system preview | Tap chip | Click-to-enlarge | Tap | Tap | Expand / auto-preview | Table fullscreen only | Tap | Tap cell | F6 modal, no auto-open |
| Primary tap | Open artifact | Open file | Enlarge | Open/edit | Larger version | Expand | — | Edit/share | Fullscreen | Open F6 |
| Long-press | Not the open path | — | — | — | **Save / public Share** | — | — | — | Grid actions | **None in v1** (F6) |
| Save / Share | Download in artifact chrome | — | Local web | Save/Share + **library** | Save device / **public link** | Download/share | Copy/download tables | Social + gallery | Share sheet | **Off** (`shareAllowed: false`) |
| Second durable home | Artifacts sidebar (after Publish) | Missing on mobile | BlobStore + session | **Images library** | Images menu / Library | Assets + versions | History | **Creations** | Library | **Forbidden** |
| Collapse / streaming | Artifact pill | Chip | Thumbs **stay** when tool collapses | Immediate preview (no gray box) | — | Auto-open | — | — | — | Reserve well immediately; thumbs survive tool collapse |
| Composer in viewer | No (separate window) | — | No | Apps SDK: **yes, overlaid** | Back to chat | — | — | Chat under image | No | **No** (F6 inert chat) |

### 1.11 Visual system mapping (ink-on-parchment)

Do not import ChatGPT’s dark full-bleed generated image or Meta’s social chrome.

From the locked Claude teardown ([01-visual-teardown.md](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)) + F6:

- Canvas: bone. Assistant: Source Serif 4. Card: Inter. Clay only on focus / send / brand mark — **not** on the screenshot, **not** as the sole redaction signal.
- Card radius **16 px**, 1 px `--line`, fill `--surface`, **no elevation**.
- F6 file card: min height **68 px**, padding **12 px**, glyph/thumb slot **44×44**. That is the **identity** row.
- For a **screenshot**, a 44×44 thumb is the failure mode called out against Mobbin-in-Claude ([LinkedIn](https://www.linkedin.com/posts/liaujianjie_the-mobbin-mcp-now-displays-the-screens-inline-activity-7465351105502294016-qvs1)). Use a **contain well** under the identity row (ChatGPT/Kimi), not a cropped square (Perplexity/carousel).
- Viewer stage: **carbon in both themes** (F6 image renderer), `object-fit: contain`, no intrinsic upscale. ([F6 spec](specs/002/F6-file-preview/spec.md))
- Motion: F6 entry 220 ms overlay + `translateY(8px→0)`; exit 180 ms; reduced motion opacity ≤100 ms or instant. Press scale `.985` 90–120 ms. No spring (screenshots must not wobble).

---

## 2. Concrete spec contribution a build phase can execute

This pass specifies **presentation and competitive parity**, mapped onto the existing F6 shell and F5 sanitizer. It does not reopen F6’s POST-only blob fetch, digest, or `shareAllowed: false` for screenshots.

### 2.1 Presentation kinds (do not collapse to one card)

Reuse `FilePreviewBlock` with `renderer: 'image'` and `shareAllowed: false` ([F6](specs/002/F6-file-preview/spec.md)). Add a relay-authored `mediaClass` used **only** for layout:

```ts
mediaClass: 'screenshot' | 'raster' | 'generated'
```

| `mediaClass` | Inline presentation | Why |
|---|---|---|
| `screenshot` (default for host captures) | **Identity row** (Claude chip) **plus** a reserved **contain well** (ChatGPT/Kimi) | Coding screenshots are the primary content ([claude-code#61995](https://github.com/anthropics/claude-code/issues/61995)) |
| `raster` | Identity row + 44×44 sanitized thumb only | Matches F6 file-preview; used when the image is incidental |
| `generated` | Same as screenshot but label `Image from pi` | Reserved; Share still false in v1 |

`displayName` is only `Screenshot` / `Image` / `Redacted preview` — never a host path (F6).

### 2.2 Placement in the turn (Kimi, not Claude sidebar)

Sequence inside an assistant turn:

1. Optional collapsed **tool activity** (existing).
2. **Inbound image card(s)** — **siblings under the tool row**, not inside the collapsed details. If the user collapses the tool, the card **stays**. (Kimi changelog collapse invariant.)
3. Source Serif **prose** that explains the frame.
4. Existing action row (copy/retry…) — **outside** the image card. ChatGPT Apps SDK: ≤2 actions *on* a card; screenshot card has **zero** nested buttons.

Never auto-open (F6 + Perplexity anti-pattern).

If the tool result streams first: **mount the card in `opening`/`loading` immediately** with the final well height reserved (ChatGPT “no gray box” fix). Do not wait for assistant prose.

**Per turn:** max **4** images (F5). If 2–4 screenshots: **vertical stack**, 12 px gap — **not** a ChatGPT/Perplexity carousel (crops kill terminal text). A contact-sheet is a v2 minority idea (§3).

### 2.3 Inline card — screenshot (390 CSS px iPhone)

Use the F6 identity row **and** a well. Numbers are build targets from F6 + Claude teardown + ChatGPT’s large-object lesson.

| Token | Value |
|---|---|
| Width | Assistant column; gutters 16 px (Perplexity/Claude teardown) |
| Radius | 16 px |
| Border | 1 px `--line` |
| Fill | `--surface` |
| Identity row | min-height 44 px; Inter 15/20 semibold title; Inter 12/16 meta |
| Title | `Screenshot` (generic) |
| Meta | `rev {revision} · Redacted` or `Preview expired` — **no pixel dimensions, no byte size, no digest** in the visible subtitle (those leak host/display specifics into screenshots of the PWA). Put them in Details. |
| Well | width 100%; **min-height 180 px**; **max-height 240 px**; `object-fit: contain`; bone well in light / near-carbon in dark |
| Image | sanitized JPEG/PNG blob; `alt=""` (decorative inside named button) |
| Whole card | one React Aria `Button` `onPress` |
| Accessible name | `Open screenshot preview, redacted, revision {n}.` |
| Press | background/border change; scale `.985` 90–120 ms; activate on release |
| Loading | static parchment well (no shimmer after 800 ms) |
| Failed | Kimi-style fallback: keep card, show `Preview unavailable` / `Preview expired` — never a broken-image icon |
| Alpha PNG | checkerboard **only inside the well**, 8 px cells, contrast-safe (Kimi); not on the parchment page |

**Do not** use Claude’s 44×44 tilted thumb *alone* for `screenshot`. **Do not** crop to fill.

### 2.4 Gesture and state machine

**Transcript**

| Input | Result |
|---|---|
| `onPress` / Enter / Space on card | Open F6 `ArtifactViewerHost`, freeze `{artifactId, revision, digest}` |
| Long-press | **None** (F6 v1; Gemini Save lives here in Gemini — we do not) |
| Swipe on card | Native transcript scroll only |

**Viewer (F6 image renderer + Photos chrome toggle)**

| Input | Result |
|---|---|
| Appear | Carbon stage, contain-fit, header+zoom chrome visible |
| Single tap on image | Toggle chrome (Photos) |
| Double-tap | Fit ↔ 2× around tap (F6; not Photos’ unbounded zoom) |
| Pinch | 1×–4× (F6) |
| Pan | Only above fit |
| Swipe down | **Not bound** (F6 DECISION) |
| Swipe left/right | **Not bound** (no album) |
| Close / Escape / iOS edge-back | 180 ms exit; restore scroll + focus to card |
| Visible Zoom out / Fit / Zoom in | 44×44, always present when chrome shown (WCAG 2.5.1 alternative to pinch) |
| Details (header overflow) | Dimensions, byte length, digest prefix, expiry, redaction state — **no path** |
| Share / Download / Copy pixels | **Hidden** (`shareAllowed: false`) |

States: reuse F6 table (`closed`, `opening`, `loading`, `loading-stalled` at 15 s, `ready`, `withheld`, `expired`, `missing`, `offline-unavailable`, `denied`, `corrupt`, `rate-limited`, `revoked`, …). Map Kimi’s text-marker decay to `expired` / `withheld` **without removing the transcript row**.

### 2.5 Upload + redaction + security (competitive constraints only)

Inbound is **not** an F5 mutation. Competitive products that look similar are unsafe to copy:

| Competitor behavior | Pi Remote |
|---|---|
| ChatGPT Images library / Meta Creations | No second store; pixels only in F6 artifact store |
| Gemini Share → public link; Claude Publish | No public URL, no token in query string |
| Kimi pass-through on compression fail (historical) | Fail closed; original never reaches `<img>` |
| Kimi 100 MB `ReadMediaFile` | Display budget stays F5/F6: 2 000 px / 2 MiB sanitized; 25 MiB / 40 MP / 8 192 px viewer reject |
| Kimi 256 KB **model-read** budget | Does **not** apply to phone display; do not downscale the operator’s preview to 256 KB |
| ChatGPT 20 MB input / Perplexity 40 MB | Ingress still F5/F8 host caps; not phone HTTP JSON |
| Apps SDK composer-in-fullscreen | Chat remains inert; no follow-up from inside the screenshot |
| Cline “successfully read image” | Insufficient; card must show pixels or an honest `withheld` |

Delivery stays F6: authenticated exact-tuple read, blob URL, revoke on close / `visibilitychange` / session switch, `Cache-Control: private, no-store`, no Cache Storage. Durable transcript: descriptor only.

**Re-send to pi:** not “resend artifactId”. New F5 selection only (iter-07). No Gemini-style long-press Save.

### 2.6 A11y

- One name on the card button; inner `<img alt="">`.
- Viewer image: F6 `Image preview; description not provided.` unless relay supplies a **generic** label (`Screenshot from browser tool`). Never OCR (secrets).
- Focus: heading → Close; restore to card.
- `role="status"` Opening/Loaded; `role="alert"` withheld/denied/corrupt.
- 320 CSS px: no page-level horizontal scroll; well `contain`.
- 200% text: F6 two-row header.
- `prefers-reduced-motion`: no scale, no chrome slide; chrome toggle is instant.
- RTL: `<bdi>` on `displayName`; image stage LTR-isolated.
- VoiceOver: two-finger scrub dismisses (F6).

### 2.7 Visual / motion (locked system)

- Identity typography: Inter. Do not put Source Serif on the card (Claude uses serif for **prose**, sans for chrome).
- Clay 2 px focus ring + 2 px bone/carbon separation; clay never fills the well.
- Redaction fills inside the raster: **carbon**, not clay (readable in both themes).
- No glass/blur header (F6).
- Entry/exit: F6 220/180 ms. No Photos-style hero zoom from the 44×44 slot (that animation needs a large well anyway; if implemented, only from the contain well, and skip under reduced motion).

### 2.8 Acceptance checks added by this lens

| Check | Pass |
|---|---|
| Claude Code gap closed | A tool-returned PNG is visible **without** opening a file chip; SVG/data-URI never execute |
| Kimi collapse | Collapsing the parent tool does not hide the screenshot card |
| ChatGPT gray-box | Well height reserved before bytes arrive |
| Gemini tap vs export | Primary tap never Save/Share; no public link control exists |
| Photos chrome | Single tap toggles viewer chrome; pinch/double-tap still zoom |
| No library | After viewing, `localStorage` / Cache Storage / Images-like galleries contain zero pixels |
| Carousel absent | 2–4 images stack vertically; no horizontal snap-crop |
| Expired | Row remains; copy is `Preview expired`, not a broken icon |

---

## 3. Divergent / minority ideas worth considering

Resist converging on “Claude chip + F6 modal.” These are real patterns in the competitive set:

1. **ChatGPT Apps SDK fullscreen-with-composer.** Operator can say “crop to the error toast” while looking at the frame. Strong for iteration, bad for screenshot privacy (chat is no longer inert; follow-ups may F5-reupload). Keep as a **v2 “Inspect and steer” mode**, off by default.

2. **Claude iOS artifacts half-sheet then expand** (TestingCatalog report of a half-screen popup). F6 forbids detents. A 50% sheet would let the operator keep reading prose. Worth a prototype only if it does not steal pan/zoom.

3. **Apple Photos sibling swipe** for multiple screenshots in the **same turn**. F6 forbids paging. A *turn-local* filmstrip of already-fetched sanitized thumbs (max 4) is closer to Photos and Kimi than a session gallery. Still a leak surface; default off.

4. **ChatGPT/Gemini Images menu as a session-scoped “this turn’s frames” drawer**, destroyed on session end — not a library. Helps when prose scrolled the cards away. Conflicts with “no second home” unless TTL = turn.

5. **Apps SDK Picture-in-Picture** for a **live** computer-use screenshot stream (Cline/Claude computer-use). Sticky 120×80 px well while the agent clicks. High value, high leak, out of F8 v1.

6. **Kimi `region` / `full_resolution`.** Viewer lasso → new F5 upload of a crop so the model can re-read a control at full fidelity without sending the whole `.env` screenshot. Powerful; it is a **mutation** and a prompt-injection path. Do not hide it as a zoom gesture.

7. **Tap-to-reveal / blurred contact sheet** until explicit Open (stronger than Claude/Kimi immediacy; better against App Switcher). Optional “Hide media previews” setting.

8. **Cline metadata-only** when `PI_REMOTE_INBOUND_MEDIA` is off: card text `Pi captured a screenshot` with no well. Honest degraded mode.

9. **DeepSeek table-style “Open preview” text button** instead of a visual well — more accessible, worse scanability. Use only for `withheld`.

10. **Mobbin-style contact sheet** (their MCP can stitch a PNG of many screens). One card, many frames, one digest. Good for “pi, screenshot the flow”; bad if any frame is secret.

11. **Never show pixels on the phone** (strict F5 ethics). Fails the stated Claude/Kimi bar; keep as a host policy bit, not the default.

12. **Checkerboard vs parchment well.** Kimi checkerboard is for alpha. Most screenshots are opaque. Default parchment; checkerboard only if the sanitized PNG has a non-opaque alpha channel.

---

## 4. Open questions + risks

1. **No public Mobbin flow is “agent sent me a host screenshot.”** Claude/Gemini/ChatGPT Mobbin hits are **user-attach** or **generated-image**. Pixel-parity signoff still needs an authenticated Mobbin pass plus a device capture of current Claude iOS artifacts and Kimi mobile web.

2. **Which Claude is the bar?** Chat app artifact chip vs Claude Code remote. Shipping the chip without a well repeats [claude-code#61995](https://github.com/anthropics/claude-code/issues/61995). Confirm product intent: coding-remote, not consumer Claude.

3. **Kimi display vs model-read budgets.** 256 KB is for the **model**. Using it for the phone well would make terminal screenshots illegible. Confirm F8 display stays F5’s 2 000 px / 2 MiB.

4. **Kimi raised downscale 2000→3000 px** after F5 locked 2000. A 3× retina iPhone screenshot is ~1179×2556 logical×3. Display at 2000 px contain is enough; do not silently follow Kimi’s 3000 without a battery/memory budget on iPhone.

5. **Composer-in-viewer vs F6 inert chat.** ChatGPT is training users that fullscreen still talks. Pi Remote operators may try to type while looking. If we refuse, the empty composer behind an inert overlay must not look tappable.

6. **Gemini public-link muscle memory.** A Share glyph in the F6 header will be used. Keeping Share hidden is correct and will still be requested. Copy should explain *why* in Details, not in a toast that mentions policy internals.

7. **Immediate well vs redaction time.** ChatGPT’s “show preview right away” is for **user** photos the client already has. Inbound bytes do not exist until the relay sanitizes. A reserved well can show `Opening…` but must not paint unsanitized pixels to “feel fast.”

8. **Resume/reload.** Kimi shipped a bug where media became plain tool cards after reload. F8 must test: kill Safari, reopen PWA, card still opens the **same** revision or shows `expired` — never a chip that looks like F6 file-preview of a path.

9. **SVG.** Claude Code users tried `data:image/svg+xml` and SendUserFile SVG. F6 already forbids executing SVG. Competitive pressure to “just render the diagram” is high; the answer is rasterize on the host (like artifacts → PNG) or `unsupported`.

10. **Perplexity portrait lock** vs landscape screenshots of desktop browsers. `contain` on a 16:9 desktop capture in a 390×844 phone will letterbox heavily. That is correct; a “rotate this artifact only” control is unproven in PWAs and is a v2 question.

11. **OpenCode mobile clients** (Conduit, OpenClient) may add inbound preview while F8 is specified. Re-check before implementation freeze.

12. **Mobbin MCP auth** in this repo is still operator-OAuth-pending; do not treat public Mobbin HTML as a substitute for screen-level measurement.

---

## 5. Sources

### Mobbin (public URLs; MCP not called this pass)

- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 — Claude iOS, chatting with image **input**
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude iOS chat detail
- https://mobbin.com/explore/screens/ce7d8bb5-3e54-4936-848d-000c2a9ff599 — Claude **Web** conversation with an image
- https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7 — Claude Web publish artifact
- https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3 — Claude Web code/SVG preview
- https://mobbin.com/explore/flows/205d7105-5ad4-42b5-aa8f-9b970e1d8983 — ChatGPT iOS DALL·E
- https://mobbin.com/explore/screens/3aa59b0a-9d5e-451b-af8d-21acfd81064b — ChatGPT iOS dark conversation with generated images
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 — ChatGPT iOS composer + camera
- https://mobbin.com/explore/flows/e5b8846f-e7bb-481a-82bd-47f29bfb6653 — Gemini iOS identify-from-upload
- https://mobbin.com/explore/screens/67ff18d6-4a29-418d-9f55-b51010e0b462 — Perplexity iOS chat
- https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4 — DeepSeek iOS chat
- https://docs.mobbin.com/mcp/introduction — Mobbin MCP (auth/plan gate)
- https://github.com/aos-engineer/mobbin-mcp — inline image content blocks + contact sheets
- https://www.linkedin.com/posts/liaujianjie_the-mobbin-mcp-now-displays-the-screens-inline-activity-7465351105502294016-qvs1 — thumbs too small, need fullscreen

### First-party product docs

- https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- https://support.claude.com/en/articles/9547008-publishing-and-sharing-artifacts
- https://support.claude.com/en/articles/9002504-can-claude-produce-images
- https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude
- https://code.claude.com/docs/en/artifacts.md
- https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html
- https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/config-files.html
- https://www.kimi.com/code/docs/en/kimi-code-cli/reference/tools.html
- https://moonshotai.github.io/kimi-code/en/release-notes/changelog.html
- https://help.openai.com/en/articles/6825453-chatgpt-release-notes
- https://help.openai.com/en/articles/11084440-chatgpt-image-library
- https://help.openai.com/en/articles/8400551-image-inputs-for-chatgpt-faq
- https://developers.openai.com/apps-sdk/concepts/ui-guidelines
- https://support.google.com/gemini/answer/14286560?hl=en&co=GENIE.Platform%3DiOS
- https://support.google.com/gemini/answer/13743730?hl=en&co=GENIE.Platform%3DiOS
- https://www.perplexity.ai/help-center/en/articles/12528830-creating-assets-with-perplexity-overview
- https://www.perplexity.ai/help-center/en/articles/10354840-uploading-images-on-perplexity
- https://ai.meta.com/learn/ai-creativity/how-to-edit-photos-with-ai/
- https://www.meta.com/help/artificial-intelligence/517678174532704/
- https://support.apple.com/guide/iphone/view-photos-and-videos-iph3d267610/ios
- https://support.apple.com/guide/iphone/view-photos-iph3d267610/16.0/ios/16.0
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

### GitHub / issue trackers / App Store

- https://github.com/anthropics/claude-code/issues/61995
- https://github.com/anthropics/claude-code/issues/41300
- https://github.com/anthropics/claude-code/issues/66194
- https://github.com/anthropics/claude-code/issues/78792
- https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md
- https://github.com/MoonshotAI/kimi-code/commit/ace79010669d19ad175bc25443b6efb41ca2e2ac
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md
- https://github.com/badlogic/pi-mono/blob/main/packages/ai/src/types.ts
- https://github.com/cline/cline/pull/4411
- https://github.com/dibstern/conduit
- https://apps.apple.com/us/app/openclient-for-opencode/id6763641767
- https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349
- https://apps.apple.com/us/app/perplexity-ask-anything/id1668000334
- https://apps.apple.com/us/app/meta-ai/id1558240027
- https://releases.sh/release/rel_2lA0Wqh52bOT4XrQq4px9 — Codex iOS save/copy rendered images

### Local / this packet

- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`
- `specs/002/F5-media-upload/spec.md`
- `specs/002/F6-file-preview/spec.md`
- `packages/pi-rpc-protocol/src/types.ts` (`ImageContent` on commands only)
- `specs/002/F8-inbound-media/001-research/iter-01-sol.md` (same lens, earlier; this pass adds Claude Code vs Claude chat, Kimi collapse/blob/413, Gemini tap/long-press, Apps SDK composer-in-fullscreen, Photos chrome toggle)

### Secondary (labeled as such)

- https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/perplexity/DESIGN.md — third-party token extraction
- https://community.perplexity.ai/t/feature-request-landscape-mode-support-for-viewing-sources-tables-and-charts/5627
- https://www.threads.com/@testingcatalog/post/C-Tb2EIAZCO — Claude iOS artifacts half-sheet (unofficial)
- https://appleinsider.com/inside/ios-26/tips/inside-photos-in-ios-26-macos-26----refinements-in-apples-image-and-video-management-tool
- https://deepseeksr1.com/ios-app/ — unofficial DeepSeek iOS capability writeup
- https://generativeai.pub/claude-artifacts-is-now-available-on-ios-and-android-dbdbe7dc7644 — Artifacts on iOS rollout (secondary)
