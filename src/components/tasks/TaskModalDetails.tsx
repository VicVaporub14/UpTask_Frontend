import React, { Fragment, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateStatus } from '@/api/TaskAPI';
import { formateDate } from '@/utils/utils';
import { statusTranslations } from '@/locales/es';
import { TaskStatus } from '@/types/index';
import NotesPanel from '../notes/NotesPanel';


export default function TaskModalDetails() {
  
    const params = useParams()
    const projectId = params.projectId!

    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!

    const show = taskId ? true : false

    const { data, isError, error } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId,
        retry: false
    })

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ["project", projectId]})
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as TaskStatus
        const data = { projectId, taskId, status }
        mutate(data)
    }


    // Manejar el error de forma segura con useEffect
    useEffect(() => {
        if (isError && error) {
            toast.error(error.message, { toastId: 'error' });
        }
    }, [isError, error]);

    if (isError) {
        return <Navigate to={`/projects/${projectId}`} />;
    }

    if (data) return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <p className='text-sm text-slate-400'>Agregada el: {formateDate(data.createdAt)}</p>
                                    <p className='text-sm text-slate-400'>Última actualización: {formateDate(data.updatedAt)} </p>
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl text-slate-600 my-5"
                                    >{data.name}
                                    </Dialog.Title>
                                    <p className='text-lg text-slate-500 mb-2'>Descripción: {data.description}</p>
                                    
                                    {data.completedBy.length ? (
                                        <>
                                            <p className='font-bold text-xl mb-2 text-slate-800'>Historial de Cambios</p>
                                            <ol className='list-decimal'>
                                                {data.completedBy.map( (activityLog) => (
                                                    <li key={activityLog._id} className='font-semibold text-slate-600'>
                                                        <span className='font-bold text-slate-900'>
                                                            { statusTranslations[activityLog.status]} por:  
                                                        </span>{' '}
                                                        {activityLog.user.name}
                                                    </li>
                                                ))}
                                            </ol>
                                        </>
                                    ) : null }
                                    
                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Estado Actual:</label>

                                        <select
                                            className='bg-white p-3 w-full border border-slate-400 mt-3'
                                            defaultValue={data.status}
                                            onChange={ handleChange }
                                        >
                                            {Object.entries(statusTranslations).map( ([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <NotesPanel
                                        notes={data.notes}
                                    />
                                    
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}