import { addMemberToProject } from "@/api/TeamAPI"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SearchResult({user, reset}: SearchResultProps) {

    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: addMemberToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            navigate(location.pathname, {replace: true})
            queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
        }
    })

    const handleAddUserToProject = () => {
        const data = { projectId, id: user._id}
        mutate(data)
    }

    return (
        <>
            <p className="mt-10 text-center font-bold text-xl">Resultado:</p>
            <div className="bg-gray-100 px-10 py-5 flex justify-between items-center mt-5 rounded-lg">
                <p>{user.name}</p>
                <p>{user.email}</p>
                <button
                    className="bg-purple-200 hover:bg-purple-300 text-purple-600 py-3 px-10 font-bold cursor-pointer rounded-lg"
                    onClick={handleAddUserToProject}
                >Agregar Miembro</button>
            </div>
        </>
    )
}
