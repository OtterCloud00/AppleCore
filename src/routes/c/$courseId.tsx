import { createFileRoute, Link, notFound, Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Progress from '@/components/Progress'
import { courses, flattenLessons } from '@/lib/catalog'
import { loadAllDone, lsRemove, lsSet } from '@/lib/storage'



export const Route = createFileRoute('/c/$courseId')({
  component: CoursePage,
})

function CoursePage() {
  const { courseId } = Route.useParams()
  const course = courses.find((c) => c.id === courseId)
  if (!course) throw notFound()


  const isLessonView = useRouterState({ select: (s) => s.location.pathname.includes('/l/') })
  if (isLessonView) return <Outlet />

  return <CourseBody courseId={courseId} />
}

function CourseBody({ courseId }: { courseId: string }) {
  const course = courses.find((c) => c.id === courseId)!
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDone(loadAllDone())
  }, [courseId])

  const flat = flattenLessons(course)
  const dn = flat.filter((x) => done[x.lesson.id]).length

  const toggleLesson = (id: string) => {
    const isDone = !done[id]
    setDone((prev) => ({ ...prev, [id]: isDone }))
    if (isDone) lsSet(`done:${id}`, true)
    else lsRemove(`done:${id}`)
  }

  return (
    <div>
      <p className="mb-1.5">
        <Link to="/courses" className="text-accent">
          ← Course Catalog
        </Link>
      </p>
      <h1 className="font-display text-[1.9rem] leading-none mb-2">{course.title}</h1>
      {course.subtitle && <p className="text-muted">{course.subtitle}</p>}
      {course.description && <p className="text-sm text-muted">{course.description}</p>}
      <div className="flex flex-wrap items-center gap-2.5 my-5">
        <Progress value={dn} total={flat.length} />
      </div>

      {course.modules.map((m) => (
        <section key={m.id}>
          <h2 className="font-display text-lg mt-7 mb-2">{m.title}</h2>
          <ul className="list-none p-0 m-0">
            {m.lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="flex items-center gap-2.5 px-2.5 py-2 border-b border-hairline hover:bg-panel2"
              >
                <button
                  className={
                    done[lesson.id]
                      ? 'w-[22px] h-[22px] rounded-md text-xs leading-none border border-success bg-success text-[#06281c] cursor-pointer flex-none'
                      : 'w-[22px] h-[22px] rounded-md text-xs leading-none border border-hairline bg-transparent text-muted cursor-pointer flex-none'
                  }
                  aria-label={done[lesson.id] ? 'Lezione completata' : 'Segna lezione completata'}
                  onClick={() => toggleLesson(lesson.id)}
                >
                  ✓
                </button>

                <span className="inline-block bg-panel2 border border-hairline text-muted text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  {lesson.type}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {flat.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 my-5">
          <button
            className="inline-block px-3.5 py-2 rounded-[10px] border border-accent bg-transparent text-accent font-semibold text-sm cursor-pointer hover:brightness-110"
            onClick={() => {
              if (!window.confirm('Azzerare i progressi di questo corso?')) return
              flat.forEach((x) => lsRemove(`done:${x.lesson.id}`))
              setDone({})
            }}
          >
            Azzera progressi del corso
          </button>
        </div>
      )}
    </div>
  )
}
