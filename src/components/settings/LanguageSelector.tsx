import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/Dropdown";
import { SettingContainer } from "../ui/SettingContainer";
import { ResetButton } from "../ui/ResetButton";
import { useSettings } from "../../hooks/useSettings";
import { LANGUAGES } from "../../lib/constants/languages";

interface LanguageSelectorProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
  supportedLanguages?: string[];
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  descriptionMode = "tooltip",
  grouped = false,
  supportedLanguages,
}) => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, resetSetting, isUpdating } = useSettings();

  const selectedLanguage = getSetting("selected_language") || "auto";

  const availableLanguages = React.useMemo(() => {
    if (!supportedLanguages || supportedLanguages.length === 0)
      return LANGUAGES;
    return LANGUAGES.filter(
      (lang) =>
        lang.value === "auto" || supportedLanguages.includes(lang.value),
    );
  }, [supportedLanguages]);

  const languageOptions = availableLanguages.map((lang) => ({
    value: lang.value,
    label: lang.label,
  }));

  const handleLanguageSelect = async (languageCode: string) => {
    await updateSetting("selected_language", languageCode);
  };

  const handleReset = async () => {
    await resetSetting("selected_language");
  };

  return (
    <SettingContainer
      title={t("settings.general.language.title")}
      description={t("settings.general.language.description")}
      descriptionMode={descriptionMode}
      grouped={grouped}
    >
      <div className="flex items-center space-x-1">
        <Dropdown
          options={languageOptions}
          selectedValue={selectedLanguage}
          onSelect={handleLanguageSelect}
          disabled={isUpdating("selected_language")}
        />
        <ResetButton
          onClick={handleReset}
          disabled={isUpdating("selected_language")}
        />
      </div>
    </SettingContainer>
  );
};
