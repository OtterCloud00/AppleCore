/**
 * Marchio Applecore: mela tagliata a metà — la sezione interna disegna la
 * stella a cinque semi. Outline in currentColor, semi nel rosso buccia.
 * È l'unico elemento decorato dell'app (skill frontend-design: la
 * boldness vive qui).
 */
const seedAngle = [-90, -18, 54, 126, 198]

/**
 * `animate`: rivelio orchestrato dei semi (una solavolta, entrada della
 * landing). Dispattivato da prefers-reduced-motion nel CSS.
 */
export default function CoreMark({
  size = 28,
  animate = false,
}: {
  size?: number
  animate?: boolean
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" className="flex-none">
      {/* corpo: doppio lobo con incavo superiore */}
      <path
        d="M20 10.2 C 16.2 6.9 9.8 7.4 7.2 12.1 C 5 16.5 6.4 22 9.5 26.4 C 12.1 30 15.6 33.2 18.2 33.2 C 18.8 33.2 19.4 33 20 32.7 C 20.6 33 21.2 33.2 21.8 33.2 C 24.4 33.2 27.9 30 30.5 26.4 C 33.6 22 35 16.5 32.8 12.1 C 30.2 7.4 23.8 6.9 20 10.2 Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {/* stelo */}
      <path
        d="M20 10.2 C 20.1 7.7 21.2 5.9 23.4 4.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      {/* stella dei 5 semi */}
      <g fill="currentColor" style={{ color: 'var(--color-accent)' }}>
        {seedAngle.map((deg, i) => (
          <ellipse
            key={deg}
            className={animate ? 'coremark-seed' : undefined}
            style={animate ? { animationDelay: `${120 + i * 110}ms` } : undefined}
            cx="20"
            cy="18.9"
            rx="1.7"
            ry="3.1"
            transform={`rotate(${deg} 20 22.4)`}
          />
        ))}
      </g>
    </svg>
  )
}
