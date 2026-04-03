const phases = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent"
];

export function getMoonPhase(dateInput: string | Date) {
  const date = new Date(dateInput);
  const knownNewMoon = new Date("2024-01-11T11:57:00Z");
  const synodicMonth = 29.530588853;
  const diffDays =
    (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const phase = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;
  const index = Math.floor((phase / synodicMonth) * phases.length) % phases.length;
  return phases[index];
}
