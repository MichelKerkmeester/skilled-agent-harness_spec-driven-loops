declare module 'css-tree' {
  export function parse(source: string, options?: Record<string, unknown>): CssNode;
  export function walk(ast: CssNode, handler: WalkHandler): void;
  export function generate(ast: CssNode): string;

  export interface WalkHandler {
    visit?: string;
    enter?: (this: WalkContext, node: CssNode) => void;
    leave?: (this: WalkContext, node: CssNode) => void;
  }

  export interface WalkContext {
    skip: () => void;
    break: () => void;
  }

  export interface CssNode {
    type: string;
    name?: string;
    value?: CssNode | string;
    prelude?: CssNode;
    block?: CssNode;
    children?: CssNodeList;
    property?: string;
    important?: boolean;
    loc?: { start: { line: number; column: number }; end: { line: number; column: number } };
    [key: string]: unknown;
  }

  export interface CssNodeList {
    forEach(callback: (node: CssNode) => void): void;
    map<T>(callback: (node: CssNode) => T): T[];
    toArray(): CssNode[];
    size: number;
  }

  export type Block = CssNode;
}
