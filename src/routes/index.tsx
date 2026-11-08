import { createFileRoute } from '@tanstack/react-router'
import CoreMark from '@/components/CoreMark'
import { courses } from '@/lib/catalog'

const EN_SUBTITLES: Record<string, string> = {
  widgetkit: 'Learn how to build widgets for iOS 18 with WidgetKit and SwiftUI',
  'ios-dev-launchpad': 'An iOS development course for beginners, covering Swift, SwiftUI, and Xcode',
  'swiftui-fundamentals': 'Build a strong foundation in SwiftUI with a focus on data flow. - Updated for iOS 16',
  'how-i-became-an-ios-dev': "Stories of an iOS developer's journey",
}

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div
          className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--accent) 26%, transparent), transparent 66%)',
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--success) 22%, transparent), transparent 66%)',
          }}
        />
        <p className="island-kicker mb-3">Applecore</p>
        <h1 className="display-title mb-5 max-w-3xl text-5xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] max-w-[65ch]">
          Your iOS & SwiftUI Courses
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg max-w-[65ch]">
          Watch lessons, track progress, and take notes straight from the browser.
        </p>
         <figure className="justify-self-center md:justify-self-end text-ink" aria-hidden="true">
          <CoreMark size={260} animate />
        </figure>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {courses.length === 0 ? (
          <p className="col-span-full text-center text-muted">
            Nessun corso disponibile al momento. Torna più tardi per scoprire i nuovi contenuti.
          </p>
        ) : (
          courses.map((course, index) => {
            const lessonCount = course.modules.reduce(
              (acc, m) => acc + m.lessons.length,
              0
            )
            return (
              <article
                key={course.id}
                className="island-shell feature-card rise-in rounded-2xl p-5 opacity-60 cursor-not-allowed"
                style={{ animationDelay: `${index * 90 + 80}ms` }}
              >
                <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)] truncate overflow-wrap-anywhere">
                  {course.title}
                </h2>
                {EN_SUBTITLES[course.id] && (
                  <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
                    {EN_SUBTITLES[course.id]}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted">
                  {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'} •{' '}
                  {course.modules.length} {course.modules.length === 1 ? 'module' : 'modules'}
                </p>
              </article>
            )
          })
        )}
      </section>
    </main>
  )
}
