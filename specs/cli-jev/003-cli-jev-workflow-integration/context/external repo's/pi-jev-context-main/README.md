<p align="center">
  <img src="https://raw.githubusercontent.com/kevinpita/pi-jev-context/main/assets/preview.png" alt="Jev Context: less noise, original history intact" width="920">
</p>

<h1 align="center">Jev Context for Pi</h1>
<p align="center">Keep useful context. Hide old noise. Keep your original history.</p>
<p align="center">
  <a href="https://github.com/kevinpita/pi-jev-context/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/kevinpita/pi-jev-context/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/kevinpita/pi-jev-context/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-a7f3d0"></a>
  <img alt="Pi 0.85.1 or later" src="https://img.shields.io/badge/Pi-%E2%89%A50.85.1-c4b5fd">
  <img alt="Node 22.19 or later" src="https://img.shields.io/badge/Node-%E2%89%A522.19-93c5fd">
</p>

A [Pi](https://pi.dev) extension that uses [TypeSafe Jev](https://typesafe.ai) to judge which older messages are still useful. Low-scoring content is hidden from future model requests, **not deleted from your session**.

**Opt-in · Reversible filtering · Branch-aware cache · No extra runtime dependencies**

## Get started

Requires **Pi 0.85.1+**, **Node.js 22.19+**, and a [TypeSafe API key](https://console.typesafe.ai). TypeSafe usage can incur charges. Jev is a separate judgment service, not your main coding model.

Install from [npm](https://www.npmjs.com/package/pi-jev-context):

```bash
pi install npm:pi-jev-context
```

Restart Pi or run `/reload`, then:

```text
/login typesafe
/jev on
```

Enter your key in Pi's secret prompt. Do not paste it into a conversation. `TYPESAFE_API_KEY` is also supported. Pruning is **off by default**.

> **Data leaves your machine when enabled.** Candidate assistant history, tool arguments, text results, and recent conversation excerpts go to `https://api.typesafe.ai/v1/systemone`. They can contain private code or secrets. Review your data policy before enabling this extension. No TypeSafe requests are made while disabled.

## What changes?

| Kept intact | Eligible for judging |
| :--- | :--- |
| User requirements and system instructions | Complete text-only tool call/result pairs |
| `todo` operations and extension messages | Assistant text and readable thinking |
| Images, incomplete tool exchanges, summaries | User shell history included in model context |
| Latest five tool pairs during active work | Older eligible history outside that buffer |

A candidate stays when its keep probability is **greater than** the threshold. The default is `0.8`, so `0.81` stays and `0.80` is hidden. This is aggressive. Lower the threshold to retain more information.

```text
Session history -> Jev relevance judgments -> Filtered model context
       |                                         |
       +-- Original messages stay intact         +-- /jev off restores visibility
```

## You stay in control

| Command | Use it to |
| :--- | :--- |
| `/jev on` | Enable pruning or resume judging after an error |
| `/jev off` | Stop requests and restore unfiltered history |
| `/jev status` | Inspect settings and cached judgments |
| `/jev threshold 0.5` | Keep more history using cached scores |
| `/jev buffer 5` | Protect the latest five tool pairs during active work |
| `/jev cache on` | Judge only new or changed candidates, the default |
| `/jev cache off` | Rejudge eligible history each time |
| `/rejev` | Rejudge the active branch while idle, including hidden candidates |

<p align="center">
  <img src="https://raw.githubusercontent.com/kevinpita/pi-jev-context/main/assets/commands.png" alt="Illustrated command preview showing Jev status, threshold control, and disabling" width="920">
</p>

*Visuals are illustrated previews, not live-session captures or benchmark results. The command preview uses the extension's actual notification text with sample state.*

## Designed for long sessions

- **Complete exchanges only.** Tool calls and results are removed together. Parallel tool batches finish before judging starts.
- **Branch-aware state.** Settings and successful judgments persist with the session branch.
- **Reversible decisions.** `/rejev` can bring hidden content back when the task changes.
- **Cancellation support.** New input and session navigation cancel pending scans.
- **Visible savings.** A successful idle scan shows estimated context reduction. This is not a billing claim.

### Know the limits

Jev can make incorrect relevance decisions. Cached scores do not automatically adapt to a new topic. Scans add latency and API usage, and filtering can invalidate your model provider's prompt cache.

On an API error, judging pauses but **previously saved pruning still applies**. Use `/jev off` to restore unfiltered context, or `/rejev` to retry. Pi's own compaction is separate. Jev cannot recover messages already removed by compaction. Pi's context meter can differ from the pruning estimate.

## Configuration

Optional defaults go in `~/.pi/agent/jev-context.json` (or your active Pi agent directory):

```json
{
  "enabled": false,
  "threshold": 0.8,
  "buffer": 5,
  "cache": true,
  "model": "jev-latest",
  "timeoutMs": 60000
}
```

Session settings take precedence. The timeout covers a complete scan. Use a versioned model name for stable judgments. At idle, Jev scans without the active-tool buffer. Large candidates are split without truncation. If any fragment exceeds the threshold, the complete candidate stays.

Credentials use Pi's `typesafe` provider entry. A stored key takes precedence over `TYPESAFE_API_KEY`. `/logout typesafe` removes the stored key, not the environment variable. Jev does not add a chat model to `/model`.

Image data and tool-result `details` are not sent to Jev. Dynamically loaded tool definitions, unknown message types, and opaque thinking stay intact. Recent conversation excerpts are bounded and can miss earlier context.

## Development

```bash
git clone https://github.com/kevinpita/pi-jev-context.git
cd pi-jev-context
npm ci
npm run check
npm run test:package
pi -e ./src/index.ts
```

Tests use synthetic history and mocked HTTP responses. They need no API key and make no TypeSafe requests. CI checks Node 22.19 and 24, strict types, Biome, behavior tests, and the packed extension through Pi's loader.

## License

[MIT](LICENSE) © Kevin Pita. Independent community extension, not an official Pi or TypeSafe product.
