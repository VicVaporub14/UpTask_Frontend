import { useDroppable } from "@dnd-kit/core"

type DropTaskProps = {
    status: string
}

export default function DropTask({status}: DropTaskProps) {

    const { isOver, setNodeRef } = useDroppable({
        id: status
    })

    const style = {
        opacity: isOver ? 0.4 : undefined
    }
    
    return (
        <div
            style={style}
            ref={setNodeRef}
            className="text-xs font-semibold text-slate-500 uppercase p-3 border border-dashed border-slate-500 mt-5 grid place-content-center"
        >
            Soltar Tarea Aqui
        </div>
    )
}
