interface Props {
  height?: number;
  className?: string;
}

export default function QGenLogo({ height = 36, className = "" }: Props) {
  return (
    <img
      src="/Qgen Logo Black Orange.png"
      alt="QGEN"
      height={height}
      style={{ height: `${height}px`, width: "auto" }}
      className={className}
    />
  );
}
