import type { ReactNode } from 'react'

import { PageLoader } from '@/components/page-loader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { IconComponent } from '@/lib/icons'
import { cn } from '@/lib/utils'

import { PAGE_INSET_X } from '../layout-constants'

export function SettingsContent({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-0 overflow-hidden">
      <div className={cn('h-full min-h-0 overflow-y-auto pb-20', PAGE_INSET_X)}>{children}</div>
    </section>
  )
}

export function Pill({ tone = 'muted', children }: { tone?: 'muted' | 'primary'; children: ReactNode }) {
  return <Badge variant={tone === 'primary' ? 'default' : 'muted'}>{children}</Badge>
}

export function SectionHeading({
  aside,
  icon: Icon,
  meta,
  page = false,
  title
}: {
  // Right-aligned trailing content on the heading row.
  aside?: ReactNode
  icon: IconComponent
  meta?: string
  // Web-adapted: there is no subpage breadcrumb in this build, so `page`
  // headings always show their title (upstream hides it under a breadcrumb).
  page?: boolean
  title: string
}) {
  return (
    <div className="mb-2.5 flex items-center gap-2 pt-2 text-[length:var(--conversation-text-font-size)] font-medium">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span>{title}</span>
      {meta && <Pill>{meta}</Pill>}
      {aside && <div className="ml-auto flex min-w-0 items-center">{aside}</div>}
    </div>
  )
}

export function NavLink({
  icon: Icon,
  label,
  active,
  onClick
}: {
  icon: IconComponent
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <Button
      className={cn(
        'flex min-h-7 w-full justify-start gap-2 rounded-md px-2 text-left text-[length:var(--conversation-text-font-size)] transition',
        active
          ? 'bg-(--ui-bg-tertiary) text-foreground'
          : 'text-(--ui-text-secondary) hover:bg-(--chrome-action-hover) hover:text-foreground'
      )}
      onClick={onClick}
      size="sm"
      type="button"
      variant="ghost"
    >
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </Button>
  )
}

export function ListRow({
  title,
  description,
  hint,
  action,
  below,
  wide = false
}: {
  title: ReactNode
  description?: ReactNode
  hint?: ReactNode
  action?: ReactNode
  below?: ReactNode
  wide?: boolean
}) {
  return (
    // Container-queried, not viewport-queried: the label/control split keys on
    // the row's own pane width, so a narrow detail column (messaging, split
    // views) stacks instead of squishing the label against minmax(15rem,…).
    <div className="@container">
      <div
        className={cn(
          'grid gap-3 py-3',
          !wide && '@2xl:grid-cols-[minmax(0,1fr)_minmax(15rem,22rem)] @2xl:items-center'
        )}
      >
        <div className="min-w-0">
          <div className="text-[length:var(--conversation-text-font-size)] font-medium text-foreground">{title}</div>
          {description && (
            <div className="mt-1 text-[length:var(--conversation-caption-font-size)] leading-(--conversation-caption-line-height) text-(--ui-text-tertiary)">
              {description}
            </div>
          )}
          {hint && <div className="mt-1 block font-mono text-[0.68rem] text-muted-foreground/45">{hint}</div>}
          {below}
        </div>
        {action && <div className={cn('min-w-0', !wide && '@2xl:justify-self-end')}>{action}</div>}
      </div>
    </div>
  )
}

export function LoadingState({ label }: { label: string }) {
  return <PageLoader label={label} />
}

// Canonical implementation lives in components/ui; re-exported so the many
// settings call sites keep their import path.
export { EmptyState } from '@/components/ui/empty-state'

// ── Loading shapes (ported from the desktop settings primitives) ───────────
const LIST_ROW_COLUMNS = '@2xl:grid-cols-[minmax(0,1fr)_minmax(15rem,22rem)]'

function SectionHeadingSkeleton() {
  return (
    <div className="mb-2.5 flex items-center gap-2 pt-2">
      <Skeleton className="size-4" />
      <Skeleton className="h-4 w-36 max-w-full" />
    </div>
  )
}

function ListRowSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className="@container">
      <div className={cn('grid gap-3 py-3', !wide && [LIST_ROW_COLUMNS, '@2xl:items-center'])}>
        <div className="min-w-0 space-y-1.5">
          <Skeleton className="h-3.5 w-40 max-w-full" />
          <Skeleton className="h-3 w-64 max-w-full" />
        </div>
        {!wide && <Skeleton className="h-8 w-full @2xl:w-72 @2xl:justify-self-end" />}
      </div>
    </div>
  )
}

// A full settings page in its loading shape: an optional leading search field
// over one or more sections, each an optional heading above a run of rows.
// `<SettingsSkeleton search sections={[{ heading, rows }]} />`.
export function SettingsSkeleton({
  search = false,
  sections = [{ rows: 4 }]
}: {
  search?: boolean
  sections?: { heading?: boolean; rows: number }[]
}) {
  return (
    <SettingsContent>
      {search && <Skeleton className="mb-3 h-8 w-full" />}
      {sections.map((section, i) => (
        <section className={cn(i > 0 && 'mt-6')} key={i}>
          {section.heading && <SectionHeadingSkeleton />}
          <div className="grid gap-1">
            {Array.from({ length: section.rows }, (_, r) => (
              <ListRowSkeleton key={r} />
            ))}
          </div>
        </section>
      ))}
    </SettingsContent>
  )
}
