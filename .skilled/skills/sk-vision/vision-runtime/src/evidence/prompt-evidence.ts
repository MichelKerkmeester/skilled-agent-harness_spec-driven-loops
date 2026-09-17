// ───────────────────────────────────────────────────────────────────
// MODULE: Prompt Evidence
// ───────────────────────────────────────────────────────────────────
// Shared entry for hosts that reach vision from outside the process: the
// Devin lifecycle hook and the CLI that Cursor's command invokes. Both need
// the same two steps — find the image a prompt is talking about, then render
// an evidence block for it — so the logic lives here rather than once per host.
//
// Path detection is deliberately conservative. A prompt mentions many things
// that look like filenames, and spinning a local GPU on a false positive costs
// the user real time, so a candidate only counts when it resolves to a file
// that exists on disk.

import { existsSync, statSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import type { ImageSource } from "../providers/types.js";
import contextBuilder from "../core/context-builder.js";
import { PhotonProvider } from "../providers/photon.js";
import { RuntimeClient } from "../runtime/client.js";

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/** Extensions the Python runtime can open. PDFs are rendered page-wise upstream. */
const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".bmp",
  ".pdf",
] as const;

/**
 * Candidate path tokens inside free-form prompt text. Quoted runs come first so
 * a path containing spaces survives; the bare form then catches the common case.
 */
const PATH_PATTERNS: readonly RegExp[] = [
  /"([^"\n]+?\.(?:png|jpe?g|webp|gif|bmp|pdf))"/gi,
  /'([^'\n]+?\.(?:png|jpe?g|webp|gif|bmp|pdf))'/gi,
  /(\S+\.(?:png|jpe?g|webp|gif|bmp|pdf))/gi,
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function hasImageExtension(candidate: string): boolean {
  const lowered = candidate.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lowered.endsWith(ext));
}

/** Strips punctuation a sentence leaves clinging to a path, e.g. a trailing comma. */
function trimPunctuation(candidate: string): string {
  return candidate.replace(/^[([<{'"]+/, "").replace(/[)\]>},.;:'"]+$/, "");
}

function resolveExisting(candidate: string, cwd: string): string | undefined {
  const absolute = isAbsolute(candidate) ? candidate : resolve(cwd, candidate);
  try {
    if (existsSync(absolute) && statSync(absolute).isFile()) return absolute;
  } catch {
    return undefined;
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Finds the image a prompt refers to, or undefined when it refers to none.
 *
 * Returns the LAST resolvable match: when a prompt names several images, the
 * most recently mentioned one is the one being asked about.
 */
export function findImagePathInText(text: string, cwd: string): string | undefined {
  if (typeof text !== "string" || !text) return undefined;

  const seen = new Set<string>();
  const resolved: string[] = [];
  for (const pattern of PATH_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const candidate = trimPunctuation(match[1] ?? "");
      if (!candidate || seen.has(candidate) || !hasImageExtension(candidate)) continue;
      seen.add(candidate);
      const absolute = resolveExisting(candidate, cwd);
      if (absolute) resolved.push(absolute);
    }
  }
  return resolved.length > 0 ? resolved[resolved.length - 1] : undefined;
}

/**
 * Runs the local model over one image and returns a rendered evidence block.
 *
 * The runtime is opened per call and torn down in `finally`, so a host that
 * fires on every prompt never leaves a Python child or GPU allocation behind.
 */
export async function renderEvidence(
  imagePath: string,
  options: { question?: string; projectDir?: string } = {},
): Promise<string> {
  const source: ImageSource = { type: "path", path: imagePath };
  const client = new RuntimeClient();
  const provider = new PhotonProvider(client, { projectDir: options.projectDir });
  const question = (options.question ?? "").trim();

  try {
    if (question) {
      const result = await provider.query({ source, question });
      return contextBuilder.renderQuery(result, { source: imagePath, question });
    }
    const [caption, scene, ocr] = await Promise.all([
      provider.caption({ source }),
      provider.scene({ source }),
      provider.ocr({ source }),
    ]);
    return [
      contextBuilder.renderScene(scene, { source: imagePath }),
      contextBuilder.renderCaption(caption, { source: imagePath }),
      contextBuilder.renderOCR(ocr, { source: imagePath }),
    ].join("\n");
  } finally {
    await teardown(client, provider);
  }
}

/**
 * Wraps rendered evidence in the delimiter hosts and commands look for.
 *
 * The marker is deliberately not a bare `SK-VISION`: the per-signal renderers
 * already emit `<SK-VISION Scene>`, `<SK-VISION Caption>` and `<SK-VISION OCR>`
 * blocks, so reusing that name would nest one tag inside itself and leave the
 * reader guessing which closing tag belongs to which block. This follows the
 * OpenCode command hook, which distinguishes its own outer block the same way.
 */
export function wrapEvidence(rendered: string): string {
  return `<SK-VISION EVIDENCE>\n${rendered}\n</SK-VISION EVIDENCE>`;
}

/**
 * The whole path for a host that only has prompt text: detect, analyze, wrap.
 * Returns undefined when the prompt names no resolvable image, which is the
 * common case and must stay silent rather than announcing itself every turn.
 */
export async function evidenceForPrompt(
  text: string,
  cwd: string,
  options: { question?: string } = {},
): Promise<string | undefined> {
  const imagePath = findImagePathInText(text, cwd);
  if (!imagePath) return undefined;
  const rendered = await renderEvidence(imagePath, {
    question: options.question,
    projectDir: cwd,
  });
  return wrapEvidence(rendered);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TEARDOWN
// ─────────────────────────────────────────────────────────────────────────────

/** Unset or "close" hard-closes; "unload" frees the model; "keep" leaves it warm. */
async function teardown(client: RuntimeClient, provider: PhotonProvider): Promise<void> {
  const mode = process.env.SK_VISION_TEARDOWN;
  if (mode === "keep") return;
  if (mode === "unload") {
    await provider.unload();
    return;
  }
  await client.close();
}
