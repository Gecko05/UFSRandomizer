import { languageCodes, languages, type LanguageCode } from "../i18n";

interface FooterProps {
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
}

export function Footer({ language, onLanguageChange }: FooterProps) {
  return (
    <footer className="mt-12 flex flex-col items-center gap-3 px-4 py-6 text-center text-xs text-white/60">
      <div role="group" aria-label="Language" className="flex gap-2">
        {languageCodes.map((code) => (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={code === language}
            className={`rounded px-3 py-1 ${
              code === language ? "bg-white/20 text-white" : "hover:bg-white/10"
            }`}
            onClick={() => onLanguageChange(code)}
          >
            {languages[code].label}
          </button>
        ))}
      </div>
      <p>
        Unofficial fan tool. Not affiliated with or endorsed by Czech Games Edition.
      </p>
      <p>
        <cite>Under Falling Skies</cite> and all artwork are © Czech Games Edition.
      </p>
    </footer>
  );
}
