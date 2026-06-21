// ─── Crawl Types ──────────────────────────────────────────────────────────────

export interface CrawlResult {
  pages: PageData[];
  failedUrls: { url: string; reason: string }[];
  totalTime: number;
}

export interface PageData {
  url: string;
  html: string;
  screenshots: Record<'1920' | '1440' | '768' | '375' | '320', Buffer>;
  loadTime: number;
  triggeredModals: { screenshot: Buffer; style: Record<string, string> }[];
  triggeredDropdowns: Record<string, string>[];
  errors: string[];
}

// ─── DOM Collector Types ──────────────────────────────────────────────────────

export interface DOMCollection {
  cssVariables: CSSVariable[];
  elements: ElementStyle[];
  pseudoElements: PseudoElementInfo[];
  gradients: GradientInfo[];
  svgColors: string[];
  svgSizes: { width: number; height: number }[];
  fontInfo: {
    fontFaces: { family: string; weight: string; style: string; src: string }[];
    loadedFonts: { family: string; weight: string; style: string; status: string }[];
    googleFontsLinks: string[];
  };
  logoColors: string[] | null;
}

export interface CSSVariable {
  name: string;
  value: string;
  source: string;
  context?: string;
}

export interface ElementStyle {
  tag: string;
  className: string;
  role: string;
  ariaLabel: string;
  textContent: string;
  href: string;
  type: string;
  rect: { x: number; y: number; width: number; height: number };
  color: string;
  backgroundColor: string;
  borderTopColor: string;
  borderRightColor: string;
  borderBottomColor: string;
  borderLeftColor: string;
  outlineColor: string;
  textDecorationColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  fontFeatureSettings: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  gap: string;
  borderRadius: string;
  borderTopWidth: string;
  borderRightWidth: string;
  borderBottomWidth: string;
  borderLeftWidth: string;
  borderStyle: string;
  boxShadow: string;
  opacity: string;
  zIndex: string;
  display: string;
  position: string;
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  gridTemplateColumns: string;
  maxWidth: string;
  overflow: string;
  transition: string;
  childrenCount: number;
  hasImage: boolean;
  structuralRegion?: 'nav' | 'header' | 'main' | 'footer' | 'aside' | 'unknown';
  nearestLandmark?: string;
  isInsideMedia?: boolean;
}

export interface PseudoElementInfo {
  elementTag: string;
  elementClasses: string;
  pseudo: '::before' | '::after';
  content: string;
  backgroundColor: string;
  color: string;
  width: string;
  height: string;
  borderRadius: string;
  position: string;
  backgroundImage: string;
}

export interface GradientInfo {
  type: 'linear' | 'radial' | 'conic';
  value: string;
  elementTag: string;
  elementClasses: string;
  rect: { x: number; y: number; width: number; height: number };
}

// ─── CSS Analyzer Types ───────────────────────────────────────────────────────

export interface CSSAnalysis {
  pseudoClassRules: PseudoClassRule[];
  mediaBreakpoints: MediaBreakpoint[];
  transitions: TransitionInfo[];
  animations: AnimationInfo[];
  supportsQueries: string[];
  containerQueries: string[];
  totalRuleCount: number;
  analyzedSheetCount: number;
  failedSheets: { url: string; reason: string }[];
}

export interface PseudoClassRule {
  selector: string;
  baseSelector: string;
  pseudoClass: string;
  properties: Record<string, string>;
}

export interface MediaBreakpoint {
  query: string;
  type: 'min-width' | 'max-width' | 'prefers-color-scheme' | 'prefers-reduced-motion' | 'other';
  value: string;
  ruleCount: number;
}

export interface TransitionInfo {
  selector: string;
  property: string;
  duration: string;
  timingFunction: string;
  delay: string;
}

export interface AnimationInfo {
  name: string;
  keyframes: { offset: string; properties: Record<string, string> }[];
  usedBy: string[];
  duration: string;
}

// ─── Interaction Capture Types ────────────────────────────────────────────────

export interface LoadingStateInfo {
  selector: string;
  classes: string;
  detectionMethod: 'class' | 'aria-busy' | 'role-progressbar';
  visualTreatment: Record<string, string>;
}

export interface EmptyStateInfo {
  selector: string;
  classes: string;
  textContent: string;
  hasIcon: boolean;
  hasHeading: boolean;
  hasBody: boolean;
  hasCta: boolean;
}

export interface ErrorStateInfo {
  selector: string;
  classes: string;
  detectionMethod: 'class' | 'aria-invalid' | 'role-alert';
  visualTreatment: Record<string, string>;
}

export interface InteractionData {
  captures: InteractionCapture[];
  loadingStates?: LoadingStateInfo[];
  emptyStates?: EmptyStateInfo[];
  errorStates?: ErrorStateInfo[];
}

export interface InteractionCapture {
  element: { tag: string; classes: string; textContent: string; role: string };
  componentType: string;
  defaultStyle: Record<string, string>;
  hoverDiff: Record<string, string> | null;
  focusVisibleDiff: Record<string, string> | null;
  focusDiff: Record<string, string> | null;
  activeDiff: Record<string, string> | null;
  disabledStyle: Record<string, string> | null;
  transition: string | null;
}

// ─── Dark Mode Types ──────────────────────────────────────────────────────────

export interface DarkModeData {
  supported: boolean;
  detectionMethod: 'media-query' | 'class-toggle' | 'data-attr' | 'toggle-button' | 'none';
  lightVariables: CSSVariable[];
  darkVariables: CSSVariable[];
  variableDiff: { name: string; lightValue: string; darkValue: string }[];
  darkScreenshots: Record<string, Buffer> | null;
}

// ─── Framework Detection Types ────────────────────────────────────────────────

export interface FrameworkDetection {
  tailwind: { detected: boolean; matchCount: number; sampleClasses: string[]; jitDetected: boolean } | null;
  uiFramework: string | null;
  designSystemUrl: string | null;
}

// ─── Icon System Types ────────────────────────────────────────────────────────

export interface IconSystemInfo {
  library: string | null;
  sizeScale: number[];
  strokeWidth: number | null;
  colorMode: 'currentColor' | 'fixed' | 'mixed';
  totalCount: number;
  strokeWidthDistribution?: { value: number; count: number }[];
  sizeDistribution?: { size: number; count: number }[];
  labeledPercentage?: number;
  colorUsage?: {
    currentColor: number;
    fixedFill: number;
    strokeOnly: number;
  };
}

// ─── Motion System Types ──────────────────────────────────────────────────────

export interface MotionSystem {
  durationScale: { label: string; value: string; frequency: number }[];
  primaryTimingFunction: string;
  timingFunctions: { value: string; frequency: number }[];
  keyframeAnimations: { name: string; type: string; duration: string; properties: string[] }[];
  prefersReducedMotion: boolean;
}

// ─── A11y Types ───────────────────────────────────────────────────────────────

export interface A11yTokens {
  focusIndicator: {
    style: Record<string, string>;
    consistent: boolean;
  };
  contrastPairs: {
    foreground: string;
    background: string;
    ratio: number;
    meetsAA: boolean;
    meetsAAA: boolean;
    usageCount: number;
  }[];
  minTouchTarget: { width: number; height: number };
  minFontSize: string;
  ariaRoleStats?: Record<string, number>;
  tabOrder?: {
    tabbableCount: number;
    hasPositiveTabindex: boolean;
    positiveTabindexCount: number;
  };
  langAttribute?: string | null;
  skipLinkDetected?: boolean;
  reducedMotionSupport?: boolean;
  altTextCoverage?: {
    withAlt: number;
    withoutAlt: number;
    total: number;
    percentage: number;
  };
}

// ─── Design Boundary Types ────────────────────────────────────────────────────

export interface DesignBoundary {
  groups: {
    label: string;
    urls: string[];
    tokenCount: { colors: number; typography: number; components: number };
  }[];
  relationship: 'unified' | 'shared-foundation' | 'independent';
  overallSimilarity: number;
  dimensionScores: {
    font: number;
    color: number;
    spacing: number;
    radius: number;
    component: number;
    shadow: number;
  };
  sharedTokenSummary: string | null;
  anomalies: { url: string; description: string }[];
}

// ─── Stability Classification ────────────────────────────────────────────────

export interface StabilityClassification {
  layer: 'infrastructure' | 'system' | 'campaign' | 'content';
  confidence: number;  // 0.0 to 1.0
  signals: string[];   // human-readable reasons for classification
}

// ─── Design Tokens (Final Output) ─────────────────────────────────────────────

export interface DesignTokens {
  meta: {
    sourceUrls: string[];
    totalPages: number;
    extractionDate: string;
    framework: FrameworkDetection;
    totalElements: number;
    extractionTime: number;
  };

  colorTokens: ColorToken[];

  colorRelationships: {
    scales: {
      baseHue: number;
      steps: { hex: string; lightness: number; frequency: number }[];
    }[];
    contrastPairs: {
      foreground: string;
      background: string;
      contrastRatio: number;
      meetsAA: boolean;
      meetsAAA: boolean;
      usageCount: number;
    }[];
  };

  typographyLevels: TypographyLevel[];

  fontInfo: {
    fontFaces: { family: string; weight: string; style: string; src: string }[];
    loadedFonts: { family: string; weight: string; style: string }[];
    googleFontsLinks: string[];
  };

  spacingSystem: {
    baseUnit: number;
    scale: number[];
    frequencyMap: Record<number, number>;
    maxContentWidth: string | null;
    sectionSpacing: number[];
  };

  shadowTokens: ShadowToken[];
  radiusTokens: RadiusToken[];
  components: ComponentGroup[];

  layoutPatterns: {
    maxContentWidth: string | null;
    commonColumnCounts: number[];
    sectionSpacing: number[];
    contentAlignment: 'centered' | 'full-width' | 'mixed';
  };

  iconSystem: IconSystemInfo | null;
  motionSystem: MotionSystem | null;
  a11yTokens: A11yTokens;
  darkMode: DarkModeData;
  breakpoints: MediaBreakpoint[];

  gradients: {
    type: string;
    value: string;
    elementTag: string;
    location: string;
  }[];

  consistency: {
    consistent: { token: string; value: string; pages: string[] }[];
    inconsistent: { token: string; values: { value: string; pages: string[] }[] }[];
  };

  cssVariables: CSSVariable[];
}

export interface ColorToken {
  hex: string;
  rgba: [number, number, number, number];
  frequency: number;
  usedAs: {
    textColor: number;
    bgColor: number;
    borderColor: number;
    shadowColor: number;
    gradientColor: number;
    iconColor: number;
  };
  cssVariableNames: string[];
  pagesCoverage: number;
  sourcePages: { url: string; frequency: number }[];
  confidence: 'high' | 'medium' | 'low';
  stability?: StabilityClassification;
}

export interface TypographyLevel {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string | null;
  fontFeatureSettings: string | null;
  frequency: number;
  typicalTags: string[];
  sampleTexts: string[];
  confidence: 'high' | 'medium' | 'low';
  stability?: StabilityClassification;
}

export interface ShadowToken {
  value: string;
  frequency: number;
  type: 'border-shadow' | 'elevation' | 'inset' | 'ring' | 'complex-stack';
  typicalElements: string[];
  stability?: StabilityClassification;
}

export interface RadiusToken {
  value: string;
  frequency: number;
  typicalElements: string[];
  stability?: StabilityClassification;
}

export interface ComponentGroup {
  type: string;
  variants: ComponentVariant[];
  stability?: StabilityClassification;
}

export interface ComponentVariant {
  name: string;
  count: number;
  style: Record<string, string>;
  hoverChanges: Record<string, string> | null;
  focusVisibleChanges: Record<string, string> | null;
  focusChanges: Record<string, string> | null;
  activeChanges: Record<string, string> | null;
  disabledStyle: Record<string, string> | null;
  transition: string | null;
  sampleTexts: string[];
}

// ─── Extraction Report ────────────────────────────────────────────────────────

export interface ExtractionReport {
  startTime: string;
  endTime: string;
  totalDuration: number;
  sourceUrls: string[];
  pagesDiscovered: number;
  pagesCrawled: number;
  failedPages: { url: string; reason: string }[];
  totalElements: number;
  framework: FrameworkDetection;
  darkModeSupported: boolean;
  screenshotCount: number;
  designBoundary: DesignBoundary;
  warnings: string[];
}
