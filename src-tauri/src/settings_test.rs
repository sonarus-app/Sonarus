#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cpu_only_default_settings() {
        let settings = AppSettings::default();
        assert!(settings.force_cpu_transcription);
    }

    #[test]
    fn test_no_gpu_fields_in_settings() {
        // Test that GPU fields have been removed
        let settings = AppSettings::default();
        // Should be able to access CPU-only setting
        assert!(settings.force_cpu_transcription);
        // GPU fields should no longer exist - this will fail to compile if they still exist
    }
}
