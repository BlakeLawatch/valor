import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"

class TournamentsService {
    async getTournaments() {
        const tournaments = dbContext.Tournaments.find()
        return tournaments
    }

    async getTournamentById(tournamentId) {
        const tournament = (await dbContext.Tournaments.findById(tournamentId)).populate('game')
        return tournament
    }

    // TODO come back and populate any methods that need it
    async createTournament(tournamentData) {
        const newTournament = await dbContext.Tournaments.create(tournamentData)
        return newTournament
    }
    async editTournament(tournamentInfo, tournamentId, userId) {
        const editedTournament = await dbContext.Tournaments.findById(tournamentId)
        if (editedTournament.creatorId != userId) {
            throw new Forbidden('Not yours to edit')
        }
        const keys = Object.keys(tournamentInfo)
        keys.forEach(key => { editedTournament[key] = tournamentInfo[key] })

        await editedTournament.save()
        return editedTournament
    }
}

export const tournamentsService = new TournamentsService()