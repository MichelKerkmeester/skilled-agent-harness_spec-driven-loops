import { z } from 'zod';
import type { JsonValue } from '../domain/question.js';

export const jsonValue: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValue),
    z.record(z.string(), jsonValue),
  ]),
);

export const stateSchema = z.union([
  z.string(),
  z.array(jsonValue),
  z.record(z.string(), jsonValue),
]);

export const sourceSchema = z.object({
  path: z.string().min(1).describe('File to read, relative to a working directory or absolute inside one'),
  start: z.number().int().positive().optional().describe('First line, 1-based'),
  end: z.number().int().positive().optional().describe('Last line, inclusive'),
});

export const sourcesSchema = z
  .array(sourceSchema)
  .describe('Code the questions are about; the server reads it so you do not have to');

/** Question ids double as answer keys, so keep them short and plain. */
export const idSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{1,32}$/, 'use 1-32 characters from A-Z, a-z, 0-9, _ or -');

const noulQuestion = z.object({
  type: z.literal('noul'),
  instructions: z.string().min(1).describe('One literal yes/no judgement, stated in English'),
  criteria: z
    .object({ true: z.string().optional(), false: z.string().optional() })
    .optional()
    .describe('What a yes and a no mean; boundary cases belong here'),
});

const choiceQuestion = z.object({
  type: z.literal('choice'),
  instructions: z.string().min(1),
  criteria: z
    .record(z.string(), z.string().nullable())
    .describe('Option label mapped to its description, or null when the label speaks for itself'),
});

const scoreQuestion = z.object({
  type: z.literal('score'),
  instructions: z.string().min(1),
  criteria: z
    .array(z.string().min(1))
    .min(2)
    .describe('Ordered levels from 0 upwards; each level describes a concrete situation'),
});

export const questionSchema = z.discriminatedUnion('type', [
  noulQuestion,
  choiceQuestion,
  scoreQuestion,
]);

export const questionsSchema = z
  .record(idSchema, questionSchema)
  .describe('Named questions; every question sees the same state and is answered independently');
