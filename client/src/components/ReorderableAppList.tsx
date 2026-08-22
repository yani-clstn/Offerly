import React from 'react'
import {
  DndContext,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableItemProps {
  id: number
  company: string
  role: string
}

const SortableItem: React.FC<SortableItemProps> = ({ id, company, role }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-3 mb-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm touch-none select-none active:scale-[0.99] transition-transform"
    >
      <div>
        <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{role}</h4>
        <p className="text-xs text-zinc-500">{company}</p>
      </div>
      <div className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-grab p-2">
        ≡
      </div>
    </div>
  )
}

export const ReorderableAppList: React.FC<{
  items: Array<{ id: number; company: string; role: string }>
  onReorder: (newItems: Array<any>) => void
}> = ({ items, onReorder }) => {
  // Configure TouchSensor with a press delay so page scrolling isn't blocked on mobile
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Must press and hold for 250ms to activate dragging on touchscreens
        tolerance: 5,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      const newArray = arrayMove(items, oldIndex, newIndex)
      onReorder(newArray)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="w-full max-w-xl mx-auto">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} company={item.company} role={item.role} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}