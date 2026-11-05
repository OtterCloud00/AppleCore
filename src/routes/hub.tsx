import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import Progress from '@/components/Progress'
import { courses, flattenAll, flattenLessons } from '@/lib/catalog'
import { loadAllDone } from '@/lib/storage'


function Hub() {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [q, setQ] = useState('')

  useEffect(() => {
    setDone(loadAllDone())
  }, [])

  const query = q.trim().toLowerCase()
  const results = useMemo(() => {
    if (!query) return []
    return flattenAll().filter(
      (e) =>
        e.lesson.title.toLowerCase().includes(query) ||
        e.course.title.toLowerCase().includes(query),
    )
  }, [query])

  const total = useMemo(() => flattenAll().length, [])
  const doneCount = useMemo(
    () => flattenAll().filter((e) => done[e.lesson.id]).length,
    [done],
  )

  return (
    <main className="page-wrap px-4 pb-8 pt-10">
      <section className="island-shell rise-in rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">I tuoi corsi</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          I tuoi corsi
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          {courses.length} corsi, {total} lezioni, {doneCount} completate.
        </p>
        <input
          className="demo-input mt-6"
          type="search"
          placeholder="Cerca una lezione o un corso…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </section>

      {query ? (
        <section className="mt-4">
          <h2 className="display-title mt-6 mb-2 text-xl text-[var(--sea-ink)]">
            {results.length === 0
              ? 'Nessuna lezione trovata'
              : `${results.length} lezioni`}
          </h2>
          <div className="island-shell overflow-hidden rounded-2xl">
            {results.map((e) => (
              <Link
                key={e.lesson.id}
                to="/c/$courseId/l/$lessonId"
                params={{ courseId: e.course.id, lessonId: e.lesson.id }}
                className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3 text-[var(--sea-ink)] no-underline last:border-b-0 hover:bg-panel2"
              >
                <span
                  className={
                    done[e.lesson.id]
                      ? 'w-1.5 self-stretch rounded-full bg-success'
                      : 'w-1.5 self-stretch rounded-full bg-hairline'
                  }
                />
                <span
                  className={`flex-1 ${done[e.lesson.id] ? 'text-muted line-through' : ''}`}
                >
                  {e.lesson.title}
                </span>
                <span className="whitespace-nowrap text-sm text-muted">
                  {e.course.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-4">
          {courses.map((c, index) => {
            const fl = flattenLessons(c)
            const dn = fl.filter((x) => done[x.lesson.id]).length
            return (
              <Link
                key={c.id}
                to="/c/$courseId"
                params={{ courseId: c.id }}
                className="island-shell rise-in group mb-4 block rounded-2xl p-5 text-[var(--sea-ink)] no-underline transition-colors hover:bg-panel2"
                style={{ animationDelay: `${index * 70 + 80}ms` }}
              >
                <div className="flex items-baseline gap-3">
                  <h2 className="display-title m-0 min-w-0 flex-1 text-[1.25rem] group-hover:text-[var(--accent)]">
                    {c.title}
                  </h2>
                  <span className="whitespace-nowrap text-xs tabular-nums text-muted">
                    {dn}/{fl.length}
                  </span>
                </div>
                {c.subtitle && (
                  <p className="mt-0.5 mb-2 text-sm text-muted">{c.subtitle}</p>
                )}
                <div className="-mt-1.5">
                  <Progress value={dn} total={fl.length} />
                </div>
              </Link>
            )
          })}
        </section>
      )}
    </main>
  )
}
