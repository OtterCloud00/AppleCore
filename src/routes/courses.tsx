import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { courses, flattenAll, flattenLessons } from '@/lib/catalog'
import Progress from '@/components/Progress'

export const Route = createFileRoute('/courses')({
  component: Courses,
})

function Courses() {
  const [done] = useState<Record<string, boolean>>({})
  const total = useMemo(() => flattenAll().length, [])
  const doneCount = useMemo(
    () => flattenAll().filter((e) => done[e.lesson.id]).length,
    [done],
  )
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Courses</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Course Catalog
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          {courses.length} courses, {total} lessons, {doneCount} completed.
        </p>
      </section>
      <section className="mt-4">
        {courses.map((c) => {
          const fl = flattenLessons(c)
          const dn = fl.filter((x) => done[x.lesson.id]).length
          return (
            <Link
              key={c.id}
              to="/c/$courseId"
              params={{ courseId: c.id }}
              className="island-shell rise-in mb-8 block rounded-2xl p-5 transition-colors hover:bg-panel2"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
                  {c.title}
                </h2>
                <span className="text-sm text-[var(--sea-ink-soft)]">
                  {dn}/{fl.length}
                </span>
              </div>
              {c.subtitle && (
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  {c.subtitle}
                </p>
              )}
              <div className="w-full mt-2">
                <Progress value={dn} total={fl.length} />
              </div>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
