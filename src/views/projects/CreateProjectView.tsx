import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectAPI";

export default function CreateProjectView() {

    const navigate = useNavigate()

    const initialValues : ProjectFormData = { 
        projectName: '',
        clientName: '',
        description: ''
    }

    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues})

    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (response) => {
            toast.success(response)
            navigate('/')
        }
    })

    const handleForm = async (data : ProjectFormData) => mutate(data)

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Crear Proyecto</h1>
                <p className="text-2xl font-light text-gray-600 mt-5">Llena el siguiente formulario para crear un proyecto</p>

                <nav className="my-10">
                    <Link 
                        className="bg-purple-400 hover:bg-purple-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors rounded"
                        to='/'
                    >
                        Volver a Proyectos
                    </Link>
                </nav>
                
                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm 
                        register={register}
                        errors={errors}
                    />
                    <input 
                        type="submit" 
                        value='Crear Proyecto'
                        className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold w-full p-3 uppercase cursor-pointer transition-colors rounded"
                    />
                </form>
            </div>

        </>
    )
}
