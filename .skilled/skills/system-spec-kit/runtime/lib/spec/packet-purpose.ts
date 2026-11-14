// ───────────────────────────────────────────────────────────────────
// MODULE: Packet Purpose
// ───────────────────────────────────────────────────────────────────
// Reads why a spec packet exists from its own documents, so a surface that
// rebuilds context after a compaction or a hop can repeat the purpose and not
// only the files and the next step. Every read fails soft: a missing or
// unreadable document yields null, never an exception.

import * as fs from 'node:fs';
import * as path from 'node:path';

import { isPhaseParent } from './is-phase-parent.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Where the purpose text came from: the packet, an enclosing phase parent or the packet's goal.md Objective. */
export type PacketPurposeSource = 'packet' | 'ancestor' | 'goal';

/** One resolved purpose sentence and the folder it was read from. */
export interface PacketPurpose {
  /** The first sentence of the purpose, whitespace-collapsed and length-capped. */
  text: string;
  /** Which document supplied the text. */
  source: PacketPurposeSource;
  /** Absolute path of the folder whose spec.md or goal.md held the text. */
  folder: string;
  /** The first sentence of that folder's `### Problem Statement`, or null when it states none. */
  problem: string | null;
}

// The phase-parent scaffold has written this sentence, in two wordings, in
// place of a purpose. It describes the document layout, not the work, so it
// never counts as one.
const SCAFFOLD_PARENT_PURPOSE = /^Keep parent documentation lean while child phases own detailed plans\b/;
// One sentence has to fit even a pressure-shrunk recovery budget.
const MAX_PURPOSE_CHARS = 300;
const MAX_ANCESTOR_DEPTH = 8;
// Packets written before the `### Purpose` subheading hold the purpose under
// one of these level-two headings, with or without a section number.
const PURPOSE_SECTION_HEADING = /^##\s+(?:\d+\.\s+)?(?:PROBLEM\s+(?:&|AND)\s+PURPOSE|ROOT\s+PURPOSE|PURPOSE)\s*$/i;
// Inside that section an author may mark the purpose paragraph with a label.
const PURPOSE_LABEL = /^(?:[-*]\s+)?\*{0,2}Purpose\*{0,2}\s*:\*{0,2}\s*/i;
// A numbered or bulleted purpose opens with a marker that is not its sentence.
const LIST_MARKER = /^(?:\d+[.)]|[-*])\s+/;
// The full stop of these abbreviations does not end a sentence.
const SENTENCE_END = /^.+?(?<!\b(?:e\.g|i\.e|vs|cf))[.!?](?=\s|$)/i;

// ───────────────────────────────────────────────────────────────────
// 2. TEXT EXTRACTION
// ───────────────────────────────────────────────────────────────────

function readTextFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/** The first paragraph after line `start`, skipping comment lines and stopping at a heading, an anchor close or a quote. */
function paragraphAfter(lines: string[], start: number): string {
  const body: string[] = [];
  for (const raw of lines.slice(start + 1)) {
    const line = raw.trim();
    if (line.startsWith('#') || line.startsWith('<!-- /ANCHOR') || line.startsWith('>')) break;
    if (line.startsWith('<!--')) continue;
    if (line === '') {
      if (body.length > 0) break;
      continue;
    }
    body.push(line);
  }
  return body.join(' ');
}

/**
 * The packet's purpose paragraph. Reads the `### Purpose` subheading first.
 * Without one it reads the purpose section: the paragraph an author labelled
 * `Purpose:` when there is one, else the section's first paragraph.
 */
function extractPurposeParagraph(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const trimmed = lines.map((line) => line.trim());
  const subheading = trimmed.findIndex((line) => /^###\s+Purpose\s*$/.test(line));
  if (subheading >= 0) return paragraphAfter(lines, subheading);

  const section = trimmed.findIndex((line) => PURPOSE_SECTION_HEADING.test(line));
  if (section < 0) return '';
  const nextSection = trimmed.findIndex((line, index) => index > section && /^##\s/.test(line));
  const sectionEnd = nextSection < 0 ? trimmed.length : nextSection;
  const labelled = trimmed.findIndex(
    (line, index) => index > section && index < sectionEnd && PURPOSE_LABEL.test(line),
  );
  if (labelled >= 0) return paragraphAfter(lines, labelled - 1).replace(PURPOSE_LABEL, '');
  return paragraphAfter(lines, section);
}

function extractGoalObjective(markdown: string): string {
  return markdown.match(/^\*\*Objective:\*\*\s*(.+)$/m)?.[1] ?? '';
}

/**
 * The first sentence of authored text, or null for a template token, a
 * bracketed prompt, UNKNOWN or the scaffold's layout sentence.
 */
function authoredSentence(raw: string): string | null {
  const text = raw.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ').trim().replace(LIST_MARKER, '');
  if (!text || SCAFFOLD_PARENT_PURPOSE.test(text)) return null;
  if (text.includes('[YOUR_VALUE_HERE') || /^\[[^\]]*\]$/.test(text) || /^unknown\.?$/i.test(text)) return null;
  const sentence = text.match(SENTENCE_END)?.[0] ?? text;
  return sentence.length <= MAX_PURPOSE_CHARS
    ? sentence
    : `${sentence.slice(0, MAX_PURPOSE_CHARS - 3).trimEnd()}...`;
}

function purposeIn(folder: string): string | null {
  const markdown = readTextFile(path.join(folder, 'spec.md'));
  return markdown === null ? null : authoredSentence(extractPurposeParagraph(markdown));
}

/** The first sentence under `### Problem Statement`: what is broken, and for whom. */
function problemIn(folder: string): string | null {
  const markdown = readTextFile(path.join(folder, 'spec.md'));
  if (markdown === null) return null;
  const lines = markdown.split(/\r?\n/);
  const heading = lines.findIndex((line) => /^###\s+Problem Statement\s*$/.test(line.trim()));
  return heading < 0 ? null : authoredSentence(paragraphAfter(lines, heading));
}

// ───────────────────────────────────────────────────────────────────
// 3. RESOLUTION
// ───────────────────────────────────────────────────────────────────

/**
 * Resolve the one-sentence purpose of a spec packet.
 *
 * Reads the packet's own purpose first. When that is empty or a
 * placeholder, walks up through enclosing phase parents that carry a spec.md
 * and takes the nearest authored purpose. When neither exists, takes the
 * packet's goal.md Objective. Returns null when nothing authored exists or a
 * read fails.
 *
 * @param specFolderAbsPath - Absolute path to the spec packet folder
 * @returns The purpose sentence with its source and folder, or null
 */
export function resolvePacketPurpose(specFolderAbsPath: string): PacketPurpose | null {
  try {
    const folder = path.resolve(specFolderAbsPath);
    const own = purposeIn(folder);
    if (own) return { text: own, source: 'packet', folder, problem: problemIn(folder) };

    let current = folder;
    for (let depth = 0; depth < MAX_ANCESTOR_DEPTH; depth += 1) {
      const parent = path.dirname(current);
      if (parent === current) break;
      if (!fs.existsSync(path.join(parent, 'spec.md')) || !isPhaseParent(parent)) break;
      const inherited = purposeIn(parent);
      if (inherited) return { text: inherited, source: 'ancestor', folder: parent, problem: problemIn(parent) };
      current = parent;
    }

    const goal = readTextFile(path.join(folder, 'goal.md'));
    const objective = goal === null ? null : authoredSentence(extractGoalObjective(goal));
    return objective ? { text: objective, source: 'goal', folder, problem: null } : null;
  } catch {
    return null;
  }
}

/** Render a resolved purpose as one line, naming the parent folder when the text is inherited. */
export function formatPacketPurpose(purpose: PacketPurpose, projectRoot: string): string {
  if (purpose.source === 'ancestor') {
    const parentFolder = path.relative(projectRoot, purpose.folder).split(path.sep).join('/');
    return `Parent purpose (${parentFolder}): ${purpose.text}`;
  }
  if (purpose.source === 'goal') return `Goal objective: ${purpose.text}`;
  return `Purpose: ${purpose.text}`;
}

/** Render the problem behind a resolved purpose as one line, or null when the packet states none. */
export function formatPacketProblem(purpose: PacketPurpose): string | null {
  return purpose.problem ? `Problem: ${purpose.problem}` : null;
}
