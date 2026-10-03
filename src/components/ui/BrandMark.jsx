export function BrandMark({ className = 'h-8 w-8' }) {
  return (
    <img
      src="/logo-icon.png"
      alt="SCAN-ETO"
      className={`shrink-0 rounded-lg bg-white object-contain ${className}`}
    />
  )
}
