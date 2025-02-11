import { deleteNote } from '@/api/NoteAPI'
import { useAuth } from '@/hooks/useAuth'
import { Note } from '@/types/index'
import { formateDate } from '@/utils/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

type NoteDetailProps = {
    note: Note
}

export default function NoteDetail({note}: NoteDetailProps) {

    const { data } = useAuth();
    const canDelete = useMemo( () => note.createdBy._id === data?._id ,[data])

    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)

    const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })
    return (
        <div className='p-3 flex justify-between items-center'>
            <div>
                <p className='font-bold'>
                    {note.createdBy.name}: <span className='font-normal'>{note.content}</span>
                </p>
                <p className='text-sm text-slate-600'>{formateDate(note.createdAt)}</p>
            </div>
            {canDelete && (
                <button 
                    className='text-red-600 text-sm font-bold bg-red-50 hover:bg-red-100 border border-red-600 rounded-lg p-2 cursor-pointer'
                    onClick={() => mutate({projectId, taskId, noteId: note._id})}
                >Eliminar</button>
                
            )}
        </div>
    )
}
