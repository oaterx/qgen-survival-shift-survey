interface Props {
  className?: string;
  animate?: boolean;
}

export default function SignalLine({ className = "", animate = false }: Props) {
  return (
    <svg
      viewBox="0 0 720 72"
      className={`${className} ${animate ? "qgen-signal-animate" : ""}`}
      aria-hidden="true"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 36H220L237 36L248 17L263 58L279 24L294 36H485"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="528" cy="36" r="7" fill="currentColor" />
      <path d="M542 36H700" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M700 36L684 26M700 36L684 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
