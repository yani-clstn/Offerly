import { Link } from 'react-router-dom'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DroppableProvided,
  type DroppableStateSnapshot,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd'
import type { Application, Status } from '../types/application'
import { updateApplicationStatus } from '../api/applications'

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'applied', label: 'Applied' },
  { id: 'phone_screen', label: 'Phone Screen' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'rejected', label: 'Rejected' },
]

interface KanbanBoardProps {
  applications: Application[]
  onStatusChange: (updatedApps: Application[]) => void
}

export default function KanbanBoard({ applications, onStatusChange }: KanbanBoardProps) {
  async function handleOnDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const appId = Number(draggableId)
    const newStatus = destination.droppableId as Status

    const updatedApps = applications.map((app) =>
      app.id === appId ? { ...app, status: newStatus } : app
    )
    onStatusChange(updatedApps)

    try {
      await updateApplicationStatus(appId, newStatus)
    } catch (err) {
      console.error('Failed to update status', err)
      onStatusChange(applications)
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((app) => app.status === col.id)

          return (
            <div
              key={col.id}
              className="bg-offwhite border border-border rounded-xl p-3 flex flex-col min-h-[400px]"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-xs text-navy font-medium">{col.label}</p>
                <span className="text-[10px] font-mono bg-cream text-gray px-2 py-0.5 rounded-full border border-border">
                  {colApps.length}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-lg transition-colors p-1 ${
                      snapshot.isDraggingOver ? 'bg-cream/60' : ''
                    }`}
                  >
                    {colApps.map((app, index) => (
                      <Draggable key={app.id} draggableId={String(app.id)} index={index}>
                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                          <Link
                            to={`/applications/${app.id}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`block bg-cream border border-border rounded-lg p-3 mb-2 shadow-xs hover:border-terracotta transition-colors ${
                              snapshot.isDragging ? 'shadow-md border-terracotta cursor-grabbing' : 'cursor-pointer'
                            }`}
                          >
                            <p className="font-display text-sm text-navy font-medium leading-snug">
                              {app.company}
                            </p>
                            <p className="text-xs text-gray mt-0.5">{app.role}</p>
                            {app.location && (
                              <p className="text-[10px] text-gray/70 mt-1">{app.location}</p>
                            )}
                          </Link>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}