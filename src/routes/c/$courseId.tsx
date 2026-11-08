import { createFileRoute, Link, notFound, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getSessionFn } from '@/server/auth'
import Progress from '@/components/Progress'
import { courses, flattenLessons } from '@/lib/catalog'
import { loadAllDone, removeDone, setDone as setStorageDone } from '@/lib/storage'


export const Route = createFileRoute('/c/$courseId')({
  beforeLoad: async ({ location }) => {
    const session = await getSessionFn()
    if (!session.authed)
      throw redirect({ to: '/', search: { to: location.pathname } })
  },
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

    const handleStorage = () => setDone(loadAllDone())
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [courseId])

  const flat = flattenLessons(course)
  const dn = flat.filter((x) => done[x.lesson.id]).length

  const toggleLesson = (id: string) => {
    const isDone = !done[id]
    setDone((prev) => ({ ...prev, [id]: isDone }))
    if (isDone) setStorageDone(id, true)
    else removeDone(id)
  }

  return (
    <div>
      <p className="mb-1.5">
        <Link to="/courses" className="text-accent">
          ← Course Catalog
        </Link>
      </p>
      <h1 className="font-display text-[1.9rem] leading-none mb-2 max-w-[65ch]">{course.title}</h1>
      {course.description && (
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)] max-w-[65ch] leading-relaxed">
          {course.description}
        </p>
      )}
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
                  aria-label={done[lesson.id] ? 'Lesson completed' : 'Mark lesson as completed'}
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
              if (!window.confirm('Reset course progress?')) return
              flat.forEach((x) => removeDone(x.lesson.id))
              setDone({})
            }}
          >
            Reset course progress
          </button>
        </div>
      )}
    </div>
  )
}
