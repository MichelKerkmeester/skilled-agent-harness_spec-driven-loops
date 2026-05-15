// ───────────────────────────────────────────────────────────────────
// MODULE: Apply Metadata
// ───────────────────────────────────────────────────────────────────

export type ApplyResultStatus = 'committed' | 'rolled-back' | 'aborted' | 'dry-run' | 'noop';
export declare const APPLY_METADATA_KEY = "last_apply";
export declare function persistApplyMetadata(result: {
    status: ApplyResultStatus;
    batteryPassRate: number | null;
    now: () => Date;
}): void;
export declare function getLastApplyMetadata(): {
    lastRunAt: string | null;
    lastResult: ApplyResultStatus | null;
    batteryPassRate: number | null;
};
//# sourceMappingURL=apply-metadata.d.ts.map