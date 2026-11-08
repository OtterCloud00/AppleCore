import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { courses, flattenAll, flattenLessons } from '@/lib/catalog'
import { loadAllDone } from '@/lib/storage'
import Progress from '@/components/Progress'

const EN_SUBTITLES: Record<string, string> = {
  widgetkit: 'Learn how to build widgets for iOS 18 with WidgetKit and SwiftUI',
  'ios-dev-launchpad': 'An iOS development course for beginners, covering Swift, SwiftUI, and Xcode',
  'swiftui-fundamentals': 'Build a strong foundation in SwiftUI with a focus on data flow. - Updated for iOS 16',
  'how-i-became-an-ios-dev': "Stories of an iOS developer's journey",
}

export const Route = createFileRoute('/courses')({
  component: Courses,
})

function Courses() {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const total = useMemo(() => flattenAll().length, [])
  const doneCount = useMemo(
    () => flattenAll().filter((e) => done[e.lesson.id]).length,
    [done],
  )

  useEffect(() => {
    setDone(loadAllDone())

    const handleStorage = () => setDone(loadAllDone())
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const content =
    courses.length === 0 ? (
      <section className="island-shell rounded-2xl p-10 sm:p-16 text-center">
        <p className="island-kicker mb-3">Courses</p>
        <h2 className="text-xl font-semibold text-[var(--sea-ink)] mb-2">
          Nessun corso disponibile
        </h2>
        <p className="text-[var(--sea-ink-soft)] mb-6 max-w-[40ch] mx-auto">
          I corsi appariranno qui una volta aggiunti al catalogo. Vai sulla
          home per esplorare i corsi disponibili.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] rounded-full no-underline transition hover:-translate-y-0.5"
        >
          Vai alla home
        </Link>
      </section>
    ) : (
      courses.map((c) => {
        const fl = flattenLessons(c)
        const dn = fl.filter((x) => done[x.lesson.id]).length
        return (
          <Link
            key={c.id}
            to="/hub/$courseId"
            params={{ courseId: c.id }}
            className="island-shell rise-in mb-8 block rounded-2xl p-5 transition-colors hover:bg-panel2"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] truncate overflow-wrap-anywhere">
                {c.title}
              </h2>
              <span className="text-sm text-[var(--sea-ink-soft)]">
                {dn}/{fl.length}
              </span>
            </div>
            {EN_SUBTITLES[c.id] && (
              <p className="text-sm text-[var(--sea-ink-soft)]">
                {EN_SUBTITLES[c.id]}
              </p>
            )}
            <div className="w-full mt-2">
              <Progress value={dn} total={fl.length} />
            </div>
          </Link>
        )
      })
    )

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Courses</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl max-w-[65ch]">
          Course Catalog
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          {courses.length} courses, {total} lessons, {doneCount} completed.
        </p>
      </section>
      <section className="mt-4">{content}</section>
    </main>
  )
}
