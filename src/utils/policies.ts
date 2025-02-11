import { Project, TeamMember } from "../types"

export const isManager = (manager: Project['manager'], userId: TeamMember['_id']) => manager === userId
// return implicito en arrow function