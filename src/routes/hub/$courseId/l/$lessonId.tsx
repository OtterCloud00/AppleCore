import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'
import VideoPlayer from '@/components/VideoPlayer'
import { courses, flattenLessons, type LessonEntry } from '@/lib/catalog'
import { hydrateProgress, useProgress, markDone, unmarkDone, setNote } from '@/lib/progress'
import { getSessionFn } from '@/server/auth'

const badge =
  'inline-block bg-panel2 border border-hairline text-muted text-xs px-2 py-0.5 rounded-full whitespace-nowrap'
const emptyBox =
  'bg-panel border border-dashed border-hairline rounded-xl p-6 text-muted'
const btn =
  'inline-block px-3.5 py-2 rounded-[10px] text-sm font-semibold cursor-pointer hover:brightness-110'

export const Route = createFileRoute('/hub/$courseId/l/$lessonId')({
  beforeLoad: async ({ location }) => {
    // le pagine di lezione (video/pdf/file/link) sono dietro al login
    const session = await getSessionFn()
    if (!session.authed)
      throw redirect({ to: '/', search: { to: location.pathname } })
  },
  component: LessonPage,
})

function LessonPage() {
  const { courseId, lessonId } = Route.useParams()
  const course = courses.find((c) => c.id === courseId)
  if (!course) throw notFound()

  const flat = flattenLessons(course)
  const idx = flat.findIndex((e) => e.lesson.id === lessonId)
  if (idx === -1) throw notFound()

  return (
    <Suspense fallback={null}>
      <LessonBody
        courseId={courseId}
        entry={flat[idx]}
        prev={idx > 0 ? flat[idx - 1] : null}
        next={idx < flat.length - 1 ? flat[idx + 1] : null}
      />
    </Suspense>
  )
}

function LessonBody({
  courseId,
  entry,
  prev,
  next,
}: {
  courseId: string
  entry: LessonEntry
  prev: LessonEntry | null
  next: LessonEntry | null
}) {
  const { course, module: mod, lesson } = entry
  const isDone = useProgress((s) => !!s.done[lesson.id])
  const note = useProgress((s) => s.notes[lesson.id] ?? '')

  useEffect(() => {
    hydrateProgress()
  }, [lesson.id])

  const toggleDone = () => {
    if (!isDone) markDone(lesson.id)
    else unmarkDone(lesson.id)
  }

  const missingSrc: Record<string, string> = {
    video:
      'Imposta src del video in src/data/catalog.json (i media arrivano da orchard/GitHub).',
    pdf: 'Imposta src del PDF in src/data/catalog.json.',
    file: 'Il file non ha un src: aggiungilo in src/data/catalog.json.',
    link: 'La risorsa esterna non ha un src: aggiungilo in src/data/catalog.json.',
  }

  return (
    <main className="page-wrap px-4 py-10">
      <p className="mb-1.5 flex items-center gap-2.5">
        <Link
          to="/hub/$courseId"
          params={{ courseId }}
          className="text-accent"
        >
          ← {course.title}
        </Link>
        <span className={badge}>{mod.title}</span>
      </p>

      <h1 className="font-display text-[1.9rem] leading-tight mb-2">
        {lesson.title}
      </h1>
      <div className="flex flex-wrap items-center gap-2.5 my-5">
        <span className={badge}>{lesson.type}</span>
        {isDone ? (
          <button
            className={`${btn} border border-success bg-success text-[#06281c]`}
            onClick={toggleDone}
          >
            ✓ Completata (clic per annullare)
          </button>
        ) : (
          <button
            className={`${btn} border border-accent bg-accent text-[#0a1422]`}
            onClick={toggleDone}
          >
            Segna come completata
          </button>
        )}
      </div>

      {lesson.type === 'video' &&
        (lesson.src ? (
          <>
            <VideoPlayer lessonId={lesson.id} src={lesson.src} />
            <div className="flex flex-wrap items-center gap-2.5 mt-1 mb-2">
              <a
                className={`${btn} border border-accent bg-transparent text-accent`}
                href={lesson.src}
                target="_blank"
                rel="noreferrer"
              >
                ⬇ Scarica il video
              </a>
            </div>
          </>
        ) : (
          <p className={emptyBox}>{missingSrc.video}</p>
        ))}

      {lesson.type === 'pdf' &&
        (lesson.src ? (
          <>
            <iframe
              className="w-full h-[70vh] border border-hairline rounded-xl bg-white"
              src={lesson.src}
              title={lesson.title}
            />
            <p className="text-sm text-muted">
              <a
                href={lesson.src}
                target="_blank"
                rel="noreferrer"
                className="text-accent"
              >
                Apri il PDF in una nuova scheda ↗
              </a>
            </p>
          </>
        ) : (
          <p className={emptyBox}>{missingSrc.pdf}</p>
        ))}

      {lesson.type === 'file' &&
        (lesson.src ? (
          <a
            className={`${btn} border border-accent bg-accent text-[#0a1422]`}
            href={lesson.src}
            target="_blank"
            rel="noreferrer"
          >
            Apri / scarica il file ↗
          </a>
        ) : (
          <p className={emptyBox}>{missingSrc.file}</p>
        ))}

      {lesson.type === 'link' &&
        (lesson.src ? (
          <a
            className={`${btn} border border-accent bg-accent text-[#0a1422]`}
            href={lesson.src}
            target="_blank"
            rel="noreferrer"
          >
            Apri la risorsa esterna ↗
          </a>
        ) : (
          <p className={emptyBox}>{missingSrc.link}</p>
        ))}

      {lesson.links && lesson.links.length > 0 && (
        <>
          <h2 className="text-lg font-bold mt-6 mb-2.5">
            Materiale e link della lezione
          </h2>
          <ul className="list-none p-0 m-0">
            {lesson.links.map((l) => (
              <li key={l.url} className="py-1.5 border-b border-hairline">
                {l.url.startsWith('/') ? (
                  <a href={l.url} download className="text-accent">
                    {l.title} ⬇
                  </a>
                ) : (
                  <>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent"
                    >
                      {l.title} ↗
                    </a>
                    <span className="text-muted text-xs ml-2">{l.url}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="flex flex-wrap items-center gap-2.5 my-5">
        {prev && (
          <Link
            to="/hub/$courseId/l/$lessonId"
            params={{ courseId, lessonId: prev.lesson.id }}
            className={`${btn} border border-accent bg-transparent text-accent`}
          >
            ← Lezione precedente
          </Link>
        )}
        {next && (
          <Link
            to="/hub/$courseId/l/$lessonId"
            params={{ courseId, lessonId: next.lesson.id }}
            className={`${btn} border border-accent bg-transparent text-accent`}
          >
            Lezione successiva →
          </Link>
        )}
      </div>

      <h2 className="text-lg font-bold mt-6 mb-2.5">Note personali</h2>
      <textarea
        className="w-full min-h-[140px] bg-panel border border-hairline rounded-[10px] text-ink p-3 text-[0.95rem] resize-y placeholder:text-muted focus:outline-none focus:border-accent"
        placeholder="Appunti su questa lezione (salvati nel browser)…"
        value={note}
        onChange={(e) => setNote(lesson.id, e.target.value)}
      />
    </main>
  )
}
