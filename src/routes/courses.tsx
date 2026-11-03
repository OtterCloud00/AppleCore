import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState} from 'react'
import { courses, flattenAll} from '@/lib/catalog'


export const Route = createFileRoute('/courses')({
  component: Courses,
})

  const [done, setDone] = useState<Record<string, boolean>>({})
  const total = useMemo(() => flattenAll().length, [])
  const doneCount = useMemo(
    () => flattenAll().filter((e) => done[e.lesson.id]).length,
    [done],
  )

function Courses() {
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
    </main>
  )
}
