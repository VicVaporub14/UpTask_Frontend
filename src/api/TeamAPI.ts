import { isAxiosError } from "axios";
import { Project, TeamMember, TeamMemberForm, teamMemberSchema, teamMembersSchema } from "../types";
import api from "@/lib/axios";

type findMemberByIdType = {
    projectId: Project['_id']
    formData: TeamMemberForm
}

export async function findMemberByEmail({projectId, formData}: findMemberByIdType) {
    try {
        const url = `/projects/${projectId}/team/find`
        const { data } = await api.post(url, formData)
        const response = teamMemberSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function addMemberToProject({projectId, id}: {projectId: Project['_id'], id: TeamMember['_id']}) {
    try {
        const url = `/projects/${projectId}/team`
        const { data } = await api.post<string>(url, {id})
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function removeMemberToProject({projectId, userId}: {projectId: Project['_id'], userId: TeamMember['_id']}) {
    try {
        const url = `/projects/${projectId}/team/${userId}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectTeam(projectId: Project['_id']) {
    try {
        const url = `/projects/${projectId}/team`
        const { data } = await api(url)
        const response = teamMembersSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}