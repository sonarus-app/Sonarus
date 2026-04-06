import React from "react";
import { useTranslation } from "react-i18next";
import { SettingContainer } from "../ui/SettingContainer";
import { Dropdown, type DropdownOption } from "../ui/Dropdown";
import { useSettings } from "../../hooks/useSettings";
import { commands } from "@/bindings";
import { toast } from "sonner";

const VISUALIZER_OPTIONS: DropdownOption[] = [
  { value: "dots", label: "Dots (Pulse Wave)" },
  { value: "equalizer", label: "Micro Equalizer" },
  { value: "gradient", label: "Aurora" },
];

interface TranscribingVisualizerSelectorProps {
  descriptionMode?: "tooltip" | "inline";
  grouped?: boolean;
}

export const TranscribingVisualizerSelector: React.FC<
  TranscribingVisualizerSelectorProps
> = ({ descriptionMode = "tooltip", grouped = false }) => {
  const { t } = useTranslation();
  const { getSetting, isUpdating, refreshSettings } = useSettings();
  const currentVisualizer = getSetting("transcribing_visualizer") ?? "dots";

  const handleSelect = async (value: string) => {
    if (value === currentVisualizer) return;

    try {
      const result = await commands.changeTranscribingVisualizerSetting(value);

      if (result.status === "error") {
        console.error(
          "Failed to update transcribing visualizer:",
          result.error,
        );
        toast.error(String(result.error));
        return;
      }

      await refreshSettings();
    } catch (error) {
      console.error("Failed to update transcribing visualizer:", error);
      toast.error(String(error));
    }
  };

  return (
    <SettingContainer
      title={t("settings.advanced.transcribingVisualizer.title")}
      description={t("settings.advanced.transcribingVisualizer.description")}
      descriptionMode={descriptionMode}
      grouped={grouped}
      layout="horizontal"
    >
      <Dropdown
        options={VISUALIZER_OPTIONS}
        selectedValue={currentVisualizer}
        onSelect={handleSelect}
        disabled={isUpdating("transcribing_visualizer")}
      />
    </SettingContainer>
  );
};
