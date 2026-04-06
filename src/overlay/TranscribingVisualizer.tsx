import React from "react";
import { AuroraFallback } from "./AuroraFallback";

export type TranscribingVariant = "dots" | "equalizer" | "gradient";

interface TranscribingVisualizerProps {
  variant: TranscribingVariant;
}

// Original 8-dot pulse wave
const DotsVisualizer: React.FC = () => (
  <div className="transcribing-dots">
    <div className="dot" />
    <div className="dot" />
    <div className="dot" />
    <div className="dot" />
    <div className="dot" />
    <div className="dot" />
    <div className="dot" />
    <div className="dot" />
  </div>
);

// Center-line focused equalizer
const EqualizerVisualizer: React.FC = () => (
  <div className="transcribing-equalizer">
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
    <div className="eq-bar-container">
      <div className="eq-bar" />
    </div>
  </div>
);

// Aurora visualizer - CSS-based flowing energy effect
const GradientVisualizer: React.FC = () => (
  <div className="transcribing-gradient">
    <AuroraFallback className="w-full h-full" />
  </div>
);

export const TranscribingVisualizer: React.FC<TranscribingVisualizerProps> = ({
  variant,
}) => {
  switch (variant) {
    case "dots":
      return <DotsVisualizer />;
    case "equalizer":
      return <EqualizerVisualizer />;
    case "gradient":
      return <GradientVisualizer />;
    default:
      return <DotsVisualizer />;
  }
};

// Small indicator showing current variant (for debugging)
export const VariantIndicator: React.FC<{ variant: TranscribingVariant }> = ({
  variant,
}) => (
  <div className="variant-indicator">{variant.charAt(0).toUpperCase()}</div>
);
